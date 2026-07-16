const fs = require('node:fs')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')

const dataDir = path.join(__dirname, 'data')
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

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
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

  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count
  if (userCount > 0) return

  const createdAt = now()
  db.prepare(`
    INSERT INTO users (id, nickname, phone, password, city, bio, experience, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('u_demo', '暖宠用户', '13800000000', '123456', '广州', '喜欢小动物，愿意认真了解并长期照顾它们。', '有基础养宠经验', createdAt)

  db.prepare(`
    INSERT INTO users (id, nickname, phone, password, city, bio, experience, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('u_rescue', '暖宠志愿者', '13900000000', '123456', '深圳', '长期参与流浪动物救助。', '救助经验 2 年', createdAt)

  db.prepare(`
    INSERT INTO pets (id, name, type, age, gender, city, status, note, health, location, description, publisher_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('p_1001', '小橘', '猫咪', '约 8 个月', '男孩', '广州', '待领养', '亲人，会蹭手，已做基础驱虫。', '已驱虫，精神状态良好', '广州市天河区救助点', '性格亲人，会主动靠近人，适合有耐心、能接受适应期的家庭领养。', 'u_rescue', createdAt)

  db.prepare(`
    INSERT INTO pets (id, name, type, age, gender, city, status, note, health, location, description, publisher_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('p_1002', '豆豆', '狗狗', '约 1 岁', '女孩', '深圳', '急需救助', '性格温顺，暂住救助点。', '食欲正常，待进一步体检', '深圳市南山区临时安置点', '被志愿者发现后临时安置，亲人不护食，希望找到稳定照顾人。', 'u_demo', createdAt)

  db.prepare('INSERT INTO posts (id, author_id, content, created_at) VALUES (?, ?, ?, ?)').run('post_1001', 'u_rescue', '救助点新来的小猫已经适应环境，正在寻找稳定领养人。', createdAt)
  db.prepare('INSERT INTO comments (id, post_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?)').run('c_1001', 'post_1001', 'u_demo', '希望它早点遇到家。', createdAt)
  db.prepare('INSERT INTO post_likes (post_id, user_id, created_at) VALUES (?, ?, ?)').run('post_1001', 'u_demo', createdAt)
}

module.exports = {
  db,
  initDatabase,
  makeId,
  now
}
