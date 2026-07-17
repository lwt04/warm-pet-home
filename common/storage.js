const KEYS = {
  user: 'warmPetUserInfo',
  pets: 'warmPetPets',
  applications: 'warmPetApplications',
  posts: 'warmPetPosts',
  petFavorites: 'warmPetPetFavorites'
}

const defaultUser = {
  id: 'u_demo',
  nickname: '暖宠用户',
  city: '广州',
  phone: '138****8888',
  bio: '喜欢小动物，愿意认真了解并长期照顾它们。',
  experience: '有基础养宠经验'
}

const seedPets = [
  {
    id: 'p_1001',
    name: '小橘',
    type: '猫咪',
    age: '约 8 个月',
    gender: '男孩',
    city: '广州',
    status: '待领养',
    note: '亲人，会蹭手，已做基础驱虫。',
    health: '已驱虫，精神状态良好',
    location: '广州市天河区救助点',
    desc: '性格亲人，会主动靠近人，适合有耐心、能接受适应期的家庭领养。',
    publisherId: 'u_rescue',
    publisher: '暖宠志愿者',
    createdAt: '2026-07-14'
  },
  {
    id: 'p_1002',
    name: '豆豆',
    type: '狗狗',
    age: '约 1 岁',
    gender: '女孩',
    city: '深圳',
    status: '待领养',
    note: '性格温顺，暂住救助点。',
    health: '食欲正常，待进一步体检',
    location: '深圳市南山区临时安置点',
    desc: '被志愿者发现后临时安置，亲人不护食，希望找到稳定照顾人。',
    publisherId: 'u_demo',
    publisher: '暖宠用户',
    createdAt: '2026-07-14'
  }
]

const seedPosts = [
  {
    id: 'post_1001',
    authorId: 'u_rescue',
    author: '暖宠志愿者',
    content: '救助点新来的小猫已经适应环境，正在寻找稳定领养人。',
    createdAt: '今天 10:20',
    likes: ['u_demo'],
    favorites: [],
    comments: [
      { id: 'c_1001', authorId: 'u_demo', author: '暖宠用户', content: '希望它早点遇到家。' }
    ]
  },
  {
    id: 'post_1002',
    authorId: 'u_demo',
    author: '暖宠用户',
    content: '领养后第一周建议保持安静环境，不要频繁洗澡或更换食物。',
    createdAt: '昨天 18:40',
    likes: [],
    favorites: ['u_demo'],
    comments: []
  }
]

function read(key, fallback) {
  const value = uni.getStorageSync(key)
  return value || fallback
}

function write(key, value) {
  uni.setStorageSync(key, value)
  return value
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

export function ensureSeedData() {
  if (!uni.getStorageSync(KEYS.user)) write(KEYS.user, defaultUser)
  if (!uni.getStorageSync(KEYS.pets)) write(KEYS.pets, seedPets)
  if (!uni.getStorageSync(KEYS.applications)) write(KEYS.applications, [])
  if (!uni.getStorageSync(KEYS.posts)) write(KEYS.posts, seedPosts)
  if (!uni.getStorageSync(KEYS.petFavorites)) write(KEYS.petFavorites, [])
}

export function getCurrentUser() {
  ensureSeedData()
  return read(KEYS.user, defaultUser)
}

export function saveCurrentUser(user) {
  return write(KEYS.user, { ...getCurrentUser(), ...user })
}

export function getPets() {
  ensureSeedData()
  return read(KEYS.pets, [])
}

export function getPetById(id) {
  return getPets().find((pet) => pet.id === id)
}

export function addPet(form) {
  const user = getCurrentUser()
  const pet = {
    id: makeId('p'),
    name: form.name,
    type: form.type || '其他',
    age: form.age || '待补充',
    gender: form.gender || '未知',
    city: form.city || '待补充',
    status: form.status || '待领养',
    note: form.note || form.desc.slice(0, 28) || '等待补充更多信息。',
    health: form.health || '待补充',
    location: form.location || '待补充',
    desc: form.desc || '暂无详细描述',
    publisherId: user.id,
    publisher: user.nickname,
    createdAt: new Date().toLocaleDateString()
  }
  write(KEYS.pets, [pet, ...getPets()])
  return pet
}

export function getMyPets() {
  const user = getCurrentUser()
  return getPets().filter((pet) => pet.publisherId === user.id)
}

export function updatePetStatus(id, status) {
  const pets = getPets().map((pet) => (pet.id === id ? { ...pet, status } : pet))
  write(KEYS.pets, pets)
  return getPetById(id)
}

export function getPetFavoriteIds() {
  ensureSeedData()
  return read(KEYS.petFavorites, [])
}

export function isPetFavorited(id) {
  return getPetFavoriteIds().includes(id)
}

export function togglePetFavorite(id) {
  const ids = getPetFavoriteIds()
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [id, ...ids]
  write(KEYS.petFavorites, next)
  return next.includes(id)
}

export function getFavoritePets() {
  const ids = getPetFavoriteIds()
  return getPets().filter((pet) => ids.includes(pet.id))
}

export function addApplication(form) {
  const user = getCurrentUser()
  const pet = getPetById(form.petId)
  const application = {
    id: makeId('a'),
    petId: form.petId,
    petName: pet ? pet.name : '未知宠物',
    publisherId: pet ? pet.publisherId : '',
    publisher: pet ? pet.publisher : '',
    applicantId: user.id,
    applicant: user.nickname,
    city: user.city,
    contact: form.contact,
    home: form.home,
    experience: form.experience,
    reason: form.reason,
    status: '审核中',
    createdAt: new Date().toLocaleDateString()
  }
  write(KEYS.applications, [application, ...getApplications()])
  return application
}

export function getApplications() {
  ensureSeedData()
  return read(KEYS.applications, [])
}

export function getMyApplications() {
  const user = getCurrentUser()
  return getApplications().filter((item) => item.applicantId === user.id)
}

export function getReceivedApplications() {
  const user = getCurrentUser()
  return getApplications().filter((item) => item.publisherId === user.id)
}

export function reviewApplication(id, status) {
  const apps = getApplications().map((item) => (item.id === id ? { ...item, status } : item))
  const reviewed = apps.find((item) => item.id === id)
  write(KEYS.applications, apps)
  if (reviewed && status === '已通过') updatePetStatus(reviewed.petId, '已领养')
  return reviewed
}

export function getPosts() {
  ensureSeedData()
  return read(KEYS.posts, [])
}

export function getPostById(id) {
  return getPosts().find((post) => post.id === id)
}

export function addPost(content) {
  const user = getCurrentUser()
  const post = {
    id: makeId('post'),
    authorId: user.id,
    author: user.nickname,
    content,
    createdAt: '刚刚',
    likes: [],
    favorites: [],
    comments: []
  }
  write(KEYS.posts, [post, ...getPosts()])
  return post
}

export function togglePostLike(id) {
  const user = getCurrentUser()
  let liked = false
  const posts = getPosts().map((post) => {
    if (post.id !== id) return post
    liked = !post.likes.includes(user.id)
    return { ...post, likes: liked ? [...post.likes, user.id] : post.likes.filter((uid) => uid !== user.id) }
  })
  write(KEYS.posts, posts)
  return liked
}

export function togglePostFavorite(id) {
  const user = getCurrentUser()
  let favorited = false
  const posts = getPosts().map((post) => {
    if (post.id !== id) return post
    favorited = !post.favorites.includes(user.id)
    return { ...post, favorites: favorited ? [...post.favorites, user.id] : post.favorites.filter((uid) => uid !== user.id) }
  })
  write(KEYS.posts, posts)
  return favorited
}

export function addComment(postId, content) {
  const user = getCurrentUser()
  const comment = { id: makeId('c'), authorId: user.id, author: user.nickname, content }
  const posts = getPosts().map((post) => (post.id === postId ? { ...post, comments: [...post.comments, comment] } : post))
  write(KEYS.posts, posts)
  return comment
}

export function removeComment(postId, commentId) {
  const posts = getPosts().map((post) => (
    post.id === postId ? { ...post, comments: post.comments.filter((item) => item.id !== commentId) } : post
  ))
  write(KEYS.posts, posts)
}

export function getLikedPosts() {
  const user = getCurrentUser()
  return getPosts().filter((post) => post.likes.includes(user.id))
}

export function getFavoritePosts() {
  const user = getCurrentUser()
  return getPosts().filter((post) => post.favorites.includes(user.id))
}
