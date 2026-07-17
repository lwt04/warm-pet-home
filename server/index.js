const express = require('express')
const cors = require('cors')
const { db, initDatabase, makeId, now } = require('./db')

initDatabase()

const app = express()
const port = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json({ limit: '5mb' }))

function parseImages(value) {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

function normalizeAssetPath(value) {
  if (!value) return ''
  const text = String(value).replace(/\\/g, '/')
  if (/^blob:/i.test(text)) return ''
  if (/^(https?:|data:)/i.test(text)) return text
  const staticIndex = text.toLowerCase().lastIndexOf('/static/')
  if (staticIndex !== -1) return text.slice(staticIndex)
  if (text.startsWith('static/')) return `/${text}`
  if (text.startsWith('/')) return text
  return text
}

function normalizeImageList(images) {
  return (Array.isArray(images) ? images : []).map(normalizeAssetPath).filter(Boolean)
}

function stringifyImages(images) {
  return JSON.stringify(normalizeImageList(images))
}

function publicUser(user) {
  if (!user) return null
  const { password, ...safeUser } = user
  return {
    ...safeUser,
    avatar: normalizeAssetPath(safeUser.avatar || '')
  }
}

function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

function getCurrentUser(req) {
  const userId = req.headers['x-user-id']
  return userId ? getUserById(userId) : null
}

function requireUser(req, res, next) {
  const user = getCurrentUser(req)
  if (!user) {
    res.status(401).json({ message: '请先登录' })
    return
  }
  req.user = user
  next()
}

function petRow(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    age: row.age,
    gender: row.gender,
    city: row.city,
    status: row.status,
    note: row.note,
    health: row.health,
    location: row.location,
    desc: row.description,
    images: normalizeImageList(parseImages(row.images)),
    publisherId: row.publisher_id,
    publisher: row.publisher,
    createdAt: row.created_at
  }
}

function applicationRow(row) {
  return {
    id: row.id,
    petId: row.pet_id,
    petName: row.pet_name,
    applicantId: row.applicant_id,
    applicant: row.applicant,
    publisherId: row.publisher_id,
    publisher: row.publisher,
    city: row.city,
    home: row.home,
    experience: row.experience,
    contact: row.contact,
    reason: row.reason,
    status: row.status,
    createdAt: row.created_at
  }
}

function getPost(id, userId) {
  const post = db.prepare(`
    SELECT posts.*, users.nickname AS author, users.avatar AS author_avatar
    FROM posts
    JOIN users ON users.id = posts.author_id
    WHERE posts.id = ?
  `).get(id)
  if (!post) return null

  const comments = db.prepare(`
    SELECT comments.*, users.nickname AS author
    FROM comments
    JOIN users ON users.id = comments.author_id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `).all(id)
  const likes = db.prepare('SELECT user_id FROM post_likes WHERE post_id = ?').all(id).map((item) => item.user_id)
  const favorites = db.prepare('SELECT user_id FROM post_favorites WHERE post_id = ?').all(id).map((item) => item.user_id)

  return {
    id: post.id,
    authorId: post.author_id,
    author: post.author,
    authorAvatar: normalizeAssetPath(post.author_avatar || ''),
    content: post.content,
    images: normalizeImageList(parseImages(post.images)),
    createdAt: post.created_at,
    likes,
    favorites,
    liked: likes.includes(userId),
    favorited: favorites.includes(userId),
    comments: comments.map((comment) => ({
      id: comment.id,
      authorId: comment.author_id,
      author: comment.author,
      content: comment.content,
      createdAt: comment.created_at
    }))
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'warm-pet-home-server' })
})

app.post('/api/auth/register', (req, res) => {
  const { nickname, phone, password } = req.body
  if (!nickname || !phone || !password) {
    res.status(400).json({ message: '昵称、手机号和密码不能为空' })
    return
  }
  if (db.prepare('SELECT id FROM users WHERE phone = ?').get(phone)) {
    res.status(409).json({ message: '手机号已注册' })
    return
  }
  const id = makeId('u')
  db.prepare('INSERT INTO users (id, nickname, phone, password, city, bio, experience, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, nickname, phone, password, '', '', '', now())
  res.status(201).json({ token: id, user: publicUser(getUserById(id)) })
})

app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE phone = ? AND password = ?').get(phone, password)
  if (!user) {
    res.status(401).json({ message: '账号或密码错误' })
    return
  }
  res.json({ token: user.id, user: publicUser(user) })
})

app.get('/api/users/me', requireUser, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

app.put('/api/users/me', requireUser, (req, res) => {
  const { nickname, avatar, city, phone, bio, experience } = req.body
  db.prepare('UPDATE users SET nickname = ?, avatar = ?, city = ?, phone = ?, bio = ?, experience = ? WHERE id = ?')
    .run(nickname || req.user.nickname, normalizeAssetPath(avatar || ''), city || '', phone || req.user.phone, bio || '', experience || '', req.user.id)
  res.json({ user: publicUser(getUserById(req.user.id)) })
})

app.get('/api/pets', (req, res) => {
  const { keyword = '', type = '' } = req.query
  const rows = db.prepare(`
    SELECT pets.*, users.nickname AS publisher
    FROM pets
    JOIN users ON users.id = pets.publisher_id
    WHERE (? = '' OR pets.type = ? OR pets.status = ?)
      AND (? = '' OR pets.name LIKE ? OR pets.city LIKE ? OR pets.location LIKE ? OR pets.status LIKE ?)
    ORDER BY pets.created_at DESC
  `).all(type, type, type, keyword, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  res.json({ pets: rows.map(petRow) })
})

app.get('/api/pets/mine/list', requireUser, (req, res) => {
  const rows = db.prepare(`
    SELECT pets.*, users.nickname AS publisher
    FROM pets
    JOIN users ON users.id = pets.publisher_id
    WHERE pets.publisher_id = ?
    ORDER BY pets.created_at DESC
  `).all(req.user.id)
  res.json({ pets: rows.map(petRow) })
})

app.get('/api/pets/:id', (req, res) => {
  const row = db.prepare(`
    SELECT pets.*, users.nickname AS publisher
    FROM pets
    JOIN users ON users.id = pets.publisher_id
    WHERE pets.id = ?
  `).get(req.params.id)
  if (!row) {
    res.status(404).json({ message: '宠物不存在' })
    return
  }
  const user = getCurrentUser(req)
  const favorited = user ? Boolean(db.prepare('SELECT 1 FROM pet_favorites WHERE user_id = ? AND pet_id = ?').get(user.id, row.id)) : false
  res.json({ pet: { ...petRow(row), favorited } })
})

app.post('/api/pets', requireUser, (req, res) => {
  const { name, type, age, gender, city, note, health, location, desc, images } = req.body
  const normalizedImages = normalizeImageList(images)
  if (!name || !type || !age || !gender || !city || !note || !health || !location || !desc || normalizedImages.length === 0) {
    res.status(400).json({ message: '请完整填写宠物信息并至少添加一张图片' })
    return
  }
  const id = makeId('p')
  db.prepare(`
    INSERT INTO pets (id, name, type, age, gender, city, status, note, health, location, description, images, publisher_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, type, age, gender, city, '待领养', note, health, location, desc, stringifyImages(normalizedImages), req.user.id, now())
  const pet = db.prepare('SELECT pets.*, users.nickname AS publisher FROM pets JOIN users ON users.id = pets.publisher_id WHERE pets.id = ?').get(id)
  res.status(201).json({ pet: petRow(pet) })
})

app.delete('/api/pets/:id', requireUser, (req, res) => {
  const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id)
  if (!pet) {
    res.status(404).json({ message: '宠物不存在' })
    return
  }
  if (pet.publisher_id !== req.user.id) {
    res.status(403).json({ message: '只能删除自己发布的宠物' })
    return
  }
  db.prepare('DELETE FROM pet_favorites WHERE pet_id = ?').run(req.params.id)
  db.prepare('DELETE FROM applications WHERE pet_id = ?').run(req.params.id)
  db.prepare('DELETE FROM pets WHERE id = ?').run(req.params.id)
  res.json({ message: '已删除发布' })
})

app.put('/api/pets/:id/status', requireUser, (req, res) => {
  const { status } = req.body
  if (!['待领养', '已领养'].includes(status)) {
    res.status(400).json({ message: '宠物状态只能是待领养或已领养' })
    return
  }
  const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(req.params.id)
  if (!pet) {
    res.status(404).json({ message: '宠物不存在' })
    return
  }
  if (pet.publisher_id !== req.user.id) {
    res.status(403).json({ message: '只能修改自己发布的宠物' })
    return
  }
  db.prepare('UPDATE pets SET status = ? WHERE id = ?').run(status, req.params.id)
  res.json({ message: '状态已更新' })
})

app.post('/api/applications', requireUser, (req, res) => {
  const { petId, home, experience, contact, reason } = req.body
  const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(petId)
  if (!pet) {
    res.status(404).json({ message: '宠物不存在' })
    return
  }
  if (pet.publisher_id === req.user.id) {
    res.status(400).json({ message: '不能申请自己发布的宠物' })
    return
  }
  if (pet.status === '已领养') {
    res.status(400).json({ message: '该宠物已被领养' })
    return
  }
  if (!home || !experience || !contact || !reason) {
    res.status(400).json({ message: '请完整填写申请信息' })
    return
  }
  const exists = db.prepare('SELECT id FROM applications WHERE pet_id = ? AND applicant_id = ? AND status = ?').get(petId, req.user.id, '审核中')
  if (exists) {
    res.status(409).json({ message: '你已经提交过审核中的申请' })
    return
  }
  const id = makeId('a')
  db.prepare(`
    INSERT INTO applications (id, pet_id, applicant_id, publisher_id, home, experience, contact, reason, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, petId, req.user.id, pet.publisher_id, home, experience, contact, reason, '审核中', now())
  res.status(201).json({ applicationId: id })
})

app.get('/api/applications/mine', requireUser, (req, res) => {
  const rows = db.prepare(`
    SELECT applications.*, pets.name AS pet_name, applicant.nickname AS applicant, publisher.nickname AS publisher, applicant.city AS city
    FROM applications
    JOIN pets ON pets.id = applications.pet_id
    JOIN users applicant ON applicant.id = applications.applicant_id
    JOIN users publisher ON publisher.id = applications.publisher_id
    WHERE applications.applicant_id = ?
    ORDER BY applications.created_at DESC
  `).all(req.user.id)
  res.json({ applications: rows.map(applicationRow) })
})

app.get('/api/applications/received', requireUser, (req, res) => {
  const rows = db.prepare(`
    SELECT applications.*, pets.name AS pet_name, applicant.nickname AS applicant, publisher.nickname AS publisher, applicant.city AS city
    FROM applications
    JOIN pets ON pets.id = applications.pet_id
    JOIN users applicant ON applicant.id = applications.applicant_id
    JOIN users publisher ON publisher.id = applications.publisher_id
    WHERE applications.publisher_id = ?
    ORDER BY applications.created_at DESC
  `).all(req.user.id)
  res.json({ applications: rows.map(applicationRow) })
})

app.put('/api/applications/:id/review', requireUser, (req, res) => {
  const { status } = req.body
  if (!['已通过', '已拒绝'].includes(status)) {
    res.status(400).json({ message: '审核状态只能是已通过或已拒绝' })
    return
  }
  const application = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id)
  if (!application) {
    res.status(404).json({ message: '申请不存在' })
    return
  }
  if (application.publisher_id !== req.user.id) {
    res.status(403).json({ message: '只能审核自己收到的申请' })
    return
  }
  const pet = db.prepare('SELECT * FROM pets WHERE id = ?').get(application.pet_id)
  if (status === '已通过' && pet.status === '已领养') {
    res.status(400).json({ message: '该宠物已被领养' })
    return
  }
  db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, req.params.id)
  if (status === '已通过') db.prepare('UPDATE pets SET status = ? WHERE id = ?').run('已领养', application.pet_id)
  res.json({ message: '审核完成' })
})

app.post('/api/favorites/pets/:id', requireUser, (req, res) => {
  const exists = db.prepare('SELECT 1 FROM pet_favorites WHERE user_id = ? AND pet_id = ?').get(req.user.id, req.params.id)
  if (!exists) db.prepare('INSERT INTO pet_favorites (user_id, pet_id, created_at) VALUES (?, ?, ?)').run(req.user.id, req.params.id, now())
  res.json({ favorited: true })
})

app.delete('/api/favorites/pets/:id', requireUser, (req, res) => {
  db.prepare('DELETE FROM pet_favorites WHERE user_id = ? AND pet_id = ?').run(req.user.id, req.params.id)
  res.json({ favorited: false })
})

app.get('/api/favorites', requireUser, (req, res) => {
  const pets = db.prepare(`
    SELECT pets.*, users.nickname AS publisher
    FROM pet_favorites
    JOIN pets ON pets.id = pet_favorites.pet_id
    JOIN users ON users.id = pets.publisher_id
    WHERE pet_favorites.user_id = ?
  `).all(req.user.id).map(petRow)
  const posts = db.prepare(`
    SELECT posts.*, users.nickname AS author
    FROM post_favorites
    JOIN posts ON posts.id = post_favorites.post_id
    JOIN users ON users.id = posts.author_id
    WHERE post_favorites.user_id = ?
  `).all(req.user.id).map((post) => ({ ...post, images: normalizeImageList(parseImages(post.images)) }))
  res.json({ pets, posts })
})

app.get('/api/posts', (req, res) => {
  const user = getCurrentUser(req)
  const rows = db.prepare('SELECT id FROM posts ORDER BY created_at DESC').all()
  res.json({ posts: rows.map((row) => getPost(row.id, user ? user.id : '')) })
})

app.get('/api/posts/mine/list', requireUser, (req, res) => {
  const rows = db.prepare('SELECT id FROM posts WHERE author_id = ? ORDER BY created_at DESC').all(req.user.id)
  res.json({ posts: rows.map((row) => getPost(row.id, req.user.id)) })
})

app.get('/api/posts/:id', (req, res) => {
  const user = getCurrentUser(req)
  const post = getPost(req.params.id, user ? user.id : '')
  if (!post) {
    res.status(404).json({ message: '动态不存在' })
    return
  }
  res.json({ post })
})

app.post('/api/posts', requireUser, (req, res) => {
  const { content, images } = req.body
  const normalizedImages = normalizeImageList(images)
  if (!content || normalizedImages.length === 0) {
    res.status(400).json({ message: '请填写动态内容并至少添加一张图片' })
    return
  }
  const id = makeId('post')
  db.prepare('INSERT INTO posts (id, author_id, content, images, created_at) VALUES (?, ?, ?, ?, ?)').run(id, req.user.id, content, stringifyImages(normalizedImages), now())
  res.status(201).json({ post: getPost(id, req.user.id) })
})

app.delete('/api/posts/:id', requireUser, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!post) {
    res.status(404).json({ message: '动态不存在' })
    return
  }
  if (post.author_id !== req.user.id) {
    res.status(403).json({ message: '只能删除自己发布的动态' })
    return
  }
  db.prepare('DELETE FROM comments WHERE post_id = ?').run(req.params.id)
  db.prepare('DELETE FROM post_likes WHERE post_id = ?').run(req.params.id)
  db.prepare('DELETE FROM post_favorites WHERE post_id = ?').run(req.params.id)
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
  res.json({ message: '动态已删除' })
})

app.post('/api/posts/:id/like', requireUser, (req, res) => {
  const exists = db.prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (exists) {
    db.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').run(req.params.id, req.user.id)
    res.json({ liked: false })
    return
  }
  db.prepare('INSERT INTO post_likes (post_id, user_id, created_at) VALUES (?, ?, ?)').run(req.params.id, req.user.id, now())
  res.json({ liked: true })
})

app.post('/api/posts/:id/favorite', requireUser, (req, res) => {
  const exists = db.prepare('SELECT 1 FROM post_favorites WHERE post_id = ? AND user_id = ?').get(req.params.id, req.user.id)
  if (exists) {
    db.prepare('DELETE FROM post_favorites WHERE post_id = ? AND user_id = ?').run(req.params.id, req.user.id)
    res.json({ favorited: false })
    return
  }
  db.prepare('INSERT INTO post_favorites (post_id, user_id, created_at) VALUES (?, ?, ?)').run(req.params.id, req.user.id, now())
  res.json({ favorited: true })
})

app.post('/api/posts/:id/comments', requireUser, (req, res) => {
  const { content } = req.body
  if (!content) {
    res.status(400).json({ message: '评论内容不能为空' })
    return
  }
  const id = makeId('c')
  db.prepare('INSERT INTO comments (id, post_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)').run(id, req.params.id, req.user.id, content, now())
  res.status(201).json({ post: getPost(req.params.id, req.user.id) })
})

app.delete('/api/posts/:postId/comments/:commentId', requireUser, (req, res) => {
  const comment = db.prepare('SELECT * FROM comments WHERE id = ? AND post_id = ?').get(req.params.commentId, req.params.postId)
  if (!comment) {
    res.status(404).json({ message: '评论不存在' })
    return
  }
  if (comment.author_id !== req.user.id) {
    res.status(403).json({ message: '只能删除自己的评论' })
    return
  }
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.commentId)
  res.json({ message: '评论已删除' })
})

app.listen(port, () => {
  console.log(`Warm Pet Home server is running at http://localhost:${port}`)
})
