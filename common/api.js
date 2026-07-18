const LOCAL_BASE_URL = 'http://localhost:3000'
const TOKEN_KEY = 'warmPetToken'
const USER_KEY = 'warmPetUserInfo'

function getBaseUrl() {
  const customBase = uni.getStorageSync('warmPetBaseUrl')
  if (customBase) return String(customBase).replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location) {
    const { origin = '' } = window.location
    if (/localhost:8080|127\.0\.0\.1:8080/.test(origin)) return LOCAL_BASE_URL
    if (origin) return origin.replace(/\/$/, '')
  }
  return LOCAL_BASE_URL
}

function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setAuth(token, user) {
  uni.setStorageSync(TOKEN_KEY, token)
  if (user) {
    uni.setStorageSync(USER_KEY, user)
  }
}

export function getLocalUser() {
  return uni.getStorageSync(USER_KEY) || null
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function clearAuth() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_KEY)
}

export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${getBaseUrl()}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        ...(getToken() ? { 'x-user-id': getToken() } : {}),
        ...(options.header || {})
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }
        const message = res.data && res.data.message ? res.data.message : '请求失败'
        uni.showToast({ title: message, icon: 'none' })
        reject(new Error(message))
      },
      fail(error) {
        uni.showToast({ title: '后端服务未连接', icon: 'none' })
        reject(error)
      }
    })
  })
}

export const api = {
  login(data) {
    return request({ url: '/api/auth/login', method: 'POST', data })
  },
  register(data) {
    return request({ url: '/api/auth/register', method: 'POST', data })
  },
  getMe() {
    return request({ url: '/api/users/me' })
  },
  updateMe(data) {
    return request({ url: '/api/users/me', method: 'PUT', data })
  },
  getPets(params = {}) {
    const query = Object.keys(params)
      .filter((key) => params[key])
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    return request({ url: `/api/pets${query ? `?${query}` : ''}` })
  },
  getPet(id) {
    return request({ url: `/api/pets/${id}` })
  },
  createPet(data) {
    return request({ url: '/api/pets', method: 'POST', data })
  },
  getMyPets() {
    return request({ url: '/api/pets/mine/list' })
  },
  deletePet(id) {
    return request({ url: `/api/pets/${id}`, method: 'DELETE' })
  },
  favoritePet(id) {
    return request({ url: `/api/favorites/pets/${id}`, method: 'POST' })
  },
  unfavoritePet(id) {
    return request({ url: `/api/favorites/pets/${id}`, method: 'DELETE' })
  },
  getFavorites() {
    return request({ url: '/api/favorites' })
  },
  createApplication(data) {
    return request({ url: '/api/applications', method: 'POST', data })
  },
  getMyApplications() {
    return request({ url: '/api/applications/mine' })
  },
  getReceivedApplications() {
    return request({ url: '/api/applications/received' })
  },
  reviewApplication(id, status) {
    return request({ url: `/api/applications/${id}/review`, method: 'PUT', data: { status } })
  },
  getPosts() {
    return request({ url: '/api/posts' })
  },
  getMyPosts() {
    return request({ url: '/api/posts/mine/list' })
  },
  getPost(id) {
    return request({ url: `/api/posts/${id}` })
  },
  createPost(data) {
    return request({ url: '/api/posts', method: 'POST', data })
  },
  deletePost(id) {
    return request({ url: `/api/posts/${id}`, method: 'DELETE' })
  },
  togglePostLike(id) {
    return request({ url: `/api/posts/${id}/like`, method: 'POST' })
  },
  togglePostFavorite(id) {
    return request({ url: `/api/posts/${id}/favorite`, method: 'POST' })
  },
  createComment(postId, data) {
    return request({ url: `/api/posts/${postId}/comments`, method: 'POST', data })
  },
  deleteComment(postId, commentId) {
    return request({ url: `/api/posts/${postId}/comments/${commentId}`, method: 'DELETE' })
  }
}
