const fs = require('node:fs')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')

const dataDir = process.env.WARM_PET_DATA_DIR || path.join(__dirname, 'data')
const dbPath = path.join(dataDir, 'warm-pet-home.db')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new DatabaseSync(dbPath)
db.exec('PRAGMA foreign_keys = ON')

function now() {
  return new Date().toISOString()
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map((item) => item.name)
  if (!columns.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
}

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      city TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      experience TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      age TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      city TEXT DEFAULT '',
      status TEXT DEFAULT '待领养',
      note TEXT DEFAULT '',
      health TEXT DEFAULT '',
      location TEXT DEFAULT '',
      description TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      publisher_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (publisher_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      pet_id TEXT NOT NULL,
      applicant_id TEXT NOT NULL,
      publisher_id TEXT NOT NULL,
      home TEXT DEFAULT '',
      experience TEXT DEFAULT '',
      contact TEXT DEFAULT '',
      reason TEXT DEFAULT '',
      status TEXT DEFAULT '审核中',
      created_at TEXT NOT NULL,
      FOREIGN KEY (pet_id) REFERENCES pets(id),
      FOREIGN KEY (applicant_id) REFERENCES users(id),
      FOREIGN KEY (publisher_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS pet_favorites (
      user_id TEXT NOT NULL,
      pet_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, pet_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (pet_id) REFERENCES pets(id)
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      content TEXT NOT NULL,
      images TEXT DEFAULT '[]',
      created_at TEXT NOT NULL,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS post_likes (
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS post_favorites (
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id),
      FOREIGN KEY (author_id) REFERENCES users(id)
    );
  `)

  ensureColumn('pets', 'images', "TEXT DEFAULT '[]'")
  ensureColumn('posts', 'images', "TEXT DEFAULT '[]'")
  ensureColumn('users', 'avatar', "TEXT DEFAULT ''")

  const createdAt = now()
  const users = [
    ['u_demo', '暖心救助站', '13800000000', '123456', '/static/uploads/avatars/1.jpg', '广州', '记录救助与领养回访，帮助小动物找到稳定家庭。', '救助经验 1 年'],
    ['u_rescue', '暖宠志愿者', '13900000000', '123456', '/static/uploads/avatars/2.jpg', '深圳', '长期参与流浪动物救助，负责临时安置和领养审核。', '救助经验 2 年']
  ]

  const upsertUser = db.prepare(`
    INSERT INTO users (id, nickname, phone, password, avatar, city, bio, experience, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      nickname = excluded.nickname,
      phone = excluded.phone,
      password = excluded.password,
      avatar = excluded.avatar,
      city = excluded.city,
      bio = excluded.bio,
      experience = excluded.experience
  `)
  users.forEach((user) => upsertUser.run(...user, createdAt))

  const pets = [
    ['p_1001', '小橘', '猫咪', '约 8 个月', '男孩', '广州', '待领养', '亲人爱蹭腿，适合新手领养。', '已驱虫，精神状态良好', '天河区小区楼下', '在小区楼下连续出现一周，性格很亲人，会主动靠近人。食欲正常，已做基础驱虫，适合有稳定居住环境的家庭。', '["/static/uploads/pets/xiaoju-1.jpg","/static/uploads/pets/xiaoju-2.jpg"]', 'u_rescue'],
    ['p_1002', '团团', '狗狗', '约 1 岁', '女孩', '深圳', '待领养', '温顺安静，正在等待一个家。', '食欲正常，待进一步体检', '南山区临时安置点', '被志愿者在路边发现，性格安静不乱叫，对人友好。希望领养人能定期遛狗，不长期笼养。', '["/static/uploads/pets/tuantuan-1.jpg","/static/uploads/pets/tuantuan-2.jpg"]', 'u_rescue'],
    ['p_1003', '奶盖', '猫咪', '约 3 个月', '女孩', '东莞', '待领养', '胆子小但很粘人，需要耐心陪伴。', '已体内外驱虫，待疫苗', '东城街边绿化带', '雨天被发现躲在绿化带里，目前已经临时安置。刚开始有点怕人，熟悉后会撒娇。', '["/static/uploads/pets/naigai-1.jpg","/static/uploads/pets/naigai-2.jpg","/static/uploads/pets/naigai-3.jpg"]', 'u_rescue'],
    ['p_1004', '豆包', '狗狗', '约 2 岁', '男孩', '佛山', '待领养', '活泼亲人，喜欢散步。', '身体结实，已清洁护理', '禅城区菜市场附近', '长期在菜市场附近流浪，被好心人喂养。性格开朗，适合有遛狗时间、愿意稳定陪伴的家庭。', '["/static/uploads/pets/doubao-1.jpg","/static/uploads/pets/doubao-2.jpg"]', 'u_rescue'],
    ['p_1005', '雪球', '兔子', '约 6 个月', '女孩', '广州', '待领养', '安静乖巧，适合有养兔经验的人。', '食欲正常，毛发干净', '海珠区宠物店门口', '疑似被遗弃在宠物店门口，目前状态稳定。需要领养人了解兔子的饮食和笼舍清洁。', '["/static/uploads/pets/xueqiu-1.jpg","/static/uploads/pets/xueqiu-2.jpg"]', 'u_rescue'],
    ['p_1006', '黑糖', '猫咪', '约 1 岁半', '男孩', '深圳', '待领养', '成熟稳重，会用猫砂。', '已绝育，已驱虫', '福田区停车场', '在停车场生活了一段时间，性格稳定，不挑食，会用猫砂。适合想领养成年猫的家庭。', '["/static/uploads/pets/heitang-1.jpg","/static/uploads/pets/heitang-2.jpg"]', 'u_demo'],
    ['p_1007', '可乐', '狗狗', '约 5 个月', '男孩', '广州', '待领养', '活泼小狗，恢复中。', '轻微皮肤问题，已在护理', '白云区公交站附近', '被发现时有轻微皮肤问题，目前已开始护理。性格活泼，喜欢和人互动，需要领养人继续关注皮肤恢复。', '["/static/uploads/pets/kele-1.jpg","/static/uploads/pets/kele-2.jpg"]', 'u_demo'],
    ['p_1008', '米粒', '仓鼠', '约 4 个月', '女孩', '东莞', '待领养', '小巧安静，需要安全笼具。', '状态稳定，进食正常', '学校门口纸箱内', '被放在学校门口纸箱里，目前临时照顾中。适合了解仓鼠习性的领养人，需要准备合适笼具和垫料。', '["/static/uploads/pets/mili-1.jpg","/static/uploads/pets/mili-2.jpg","/static/uploads/pets/mili-3.jpg"]', 'u_demo'],
    ['p_1009', '花花', '猫咪', '约 2 岁', '女孩', '佛山', '待领养', '温柔三花猫，适合安静家庭。', '已绝育，性格稳定', '居民楼楼道', '原本在居民楼附近活动，经常被邻居喂养。性格温柔，不太闹腾，希望找到长期稳定的家庭。', '["/static/uploads/pets/huahua-1.jpg","/static/uploads/pets/huahua-2.jpg"]', 'u_demo'],
    ['p_1010', '啾啾', '其他', '约 1 岁', '未知', '广州', '待领养', '亲人的小鹦鹉，需要防飞环境。', '精神良好，羽毛完整', '公园管理处', '在公园附近被发现，疑似走失或被遗弃。会主动靠近人，领养人需要准备安全鸟笼，并注意关窗防飞。', '["/static/uploads/pets/jiujiu-1.jpg","/static/uploads/pets/jiujiu-2.jpg"]', 'u_demo']
  ]

  const upsertPet = db.prepare(`
    INSERT INTO pets (id, name, type, age, gender, city, status, note, health, location, description, images, publisher_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      type = excluded.type,
      age = excluded.age,
      gender = excluded.gender,
      city = excluded.city,
      note = excluded.note,
      health = excluded.health,
      location = excluded.location,
      description = excluded.description,
      images = excluded.images,
      publisher_id = excluded.publisher_id
  `)
  pets.forEach((pet) => upsertPet.run(...pet, createdAt))

  ;['post_1001', 'post_1002', 'post_1003'].forEach((postId) => {
    db.prepare('DELETE FROM comments WHERE post_id = ?').run(postId)
    db.prepare('DELETE FROM post_likes WHERE post_id = ?').run(postId)
    db.prepare('DELETE FROM post_favorites WHERE post_id = ?').run(postId)
    db.prepare('DELETE FROM posts WHERE id = ?').run(postId)
  })

  const postSeeds = [
    ['post_2001', 'u_demo', '今天把照片重新整理了一遍，很多瞬间都很值得留下来。', '["/static/uploads/posts/1-1.jpg","/static/uploads/posts/1-2.jpg","/static/uploads/posts/1-3.jpg"]', 6],
    ['post_2002', 'u_demo', '这几天总觉得时间过得很快，忙起来的时候也挺充实。', '["/static/uploads/posts/2-1.jpg","/static/uploads/posts/2-2.jpg"]', 5],
    ['post_2003', 'u_demo', '记录一下今天的状态，虽然累，但还是觉得很有意义。', '["/static/uploads/posts/3-1.jpg","/static/uploads/posts/3-2.jpg"]', 4],
    ['post_2004', 'u_rescue', '今天的天气很好，拍出来的照片也比平时更温柔一点。', '["/static/uploads/posts/4-1.jpg","/static/uploads/posts/4-2.jpg"]', 3],
    ['post_2005', 'u_rescue', '下午抽空整理了空间，感觉整个环境都清爽了不少。', '["/static/uploads/posts/5-1.jpg","/static/uploads/posts/5-2.jpg"]', 2],
    ['post_2006', 'u_rescue', '把今天的小片段留在这里，过段时间再看应该会很有意思。', '["/static/uploads/posts/6-1.jpg","/static/uploads/posts/6-2.jpg"]', 1]
  ]

  const upsertPost = db.prepare(`
    INSERT INTO posts (id, author_id, content, images, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      author_id = excluded.author_id,
      content = excluded.content,
      images = excluded.images,
      created_at = excluded.created_at
  `)

  const postComment = db.prepare(`
    INSERT INTO comments (id, post_id, author_id, content, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      post_id = excluded.post_id,
      author_id = excluded.author_id,
      content = excluded.content,
      created_at = excluded.created_at
  `)

  postSeeds.forEach(([id, authorId, content, images, minuteOffset], index) => {
    const createdAtValue = new Date(Date.now() - minuteOffset * 60000).toISOString()
    upsertPost.run(id, authorId, content, images, createdAtValue)

    const commentId = `c_200${index + 1}`
    const commentAuthorId = authorId === 'u_demo' ? 'u_rescue' : 'u_demo'
    const commentContent = [
      '这张照片很有氛围感。',
      '看起来心情很好。',
      '今天的记录也很温柔。',
      '这个画面很舒服。',
      '整理得很用心。',
      '留住这些小瞬间真好。'
    ][index]
    postComment.run(commentId, id, commentAuthorId, commentContent, createdAtValue)
  })
}

module.exports = {
  db,
  initDatabase,
  makeId,
  now
}
