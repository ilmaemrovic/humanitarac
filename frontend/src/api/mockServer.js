// Simple in-memory mock server to simulate latency and occasional failures.

function randDelay() {
  return 400 + Math.floor(Math.random() * 500) // 400-900ms
}

function shouldFail() {
  return false // disable random failures for stable testing
}

const now = new Date()

let activities = [
  {
    id: 'a1',
    title: 'Distribucija hrane i higijene',
    date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    city: 'Novi Pazar',
    category: 'Pomoć',
    description: 'Podjela prehrambenih paketa najugroženijim porodicama.'
  },
  {
    id: 'a2',
    title: 'Edukacija o sanitaciji',
    date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    city: 'Sjenica',
    category: 'Edukacija',
    description: 'Radionica o osnovama lične i javne higijene.'
  },
  {
    id: 'a3',
    title: 'Prikupljanje pomoći za poplave',
    date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    city: 'Tutin',
    category: 'Krizna pomoć',
    description: 'Akcija prikupljanja odjeće i osnovnih potrepština.'
  },
  {
    id: 'a4',
    title: 'Volonterski dan: Park Čišćenje',
    date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    city: 'Beograd',
    category: 'Volontiranje',
    description: 'Okupljanje volontera za čišćenje gradskog parka.'
  }
]

let donations = []
let volunteers = []
// Seeded mock users for testing (2 per role)
let users = [
  // admins
  { id: 'u_admin_1', name: 'Marko Ilic', email: 'marko.ilic@example.com', password: 'adminpass1', role: 'admin' },
  { id: 'u_admin_2', name: 'Aleksandar Vukasnovic', email: 'aleksandar.v@example.com', password: 'adminpass2', role: 'admin' },

  // registered users
  { id: 'u_user_1', name: 'Ilma Emrovic', email: 'ilma.emrovic@example.com', password: 'userpass1', role: 'user' },
  { id: 'u_user_2', name: 'Aldina Avdic', email: 'aldina.avdic@example.com', password: 'userpass2', role: 'user' },

  // volunteers
  { id: 'u_vol_1', name: 'Maja Volonter', email: 'maja.v@example.com', password: 'volpass1', role: 'volunteer' },
  { id: 'u_vol_2', name: 'Nemanja Volonter', email: 'nemanja.v@example.com', password: 'volpass2', role: 'volunteer' },

  // donors
  { id: 'u_don_1', name: 'Luka Donator', email: 'luka.d@example.com', password: 'donpass1', role: 'donor' },
  { id: 'u_don_2', name: 'Sara Donator', email: 'sara.d@example.com', password: 'donpass2', role: 'donor' }
]

let tokens = {}
let participations = [] // activity signups
let contacts = []

const stats = () => ({
  actions: activities.length,
  raised: donations.reduce((s, d) => s + (d.amount || 0), 0),
  volunteers: volunteers.length
})

function parseUrlParams(url) {
  try {
    const u = new URL(url, 'http://localhost')
    return { pathname: u.pathname, searchParams: u.searchParams }
  } catch (e) {
    // fallback
    const parts = url.split('?')
    return { pathname: parts[0], searchParams: new URLSearchParams(parts[1] || '') }
  }
}

const mockServer = {
  async handleRequest({ method = 'GET', url, body = null, headers = {} }) {
    await new Promise((r) => setTimeout(r, randDelay()))

    if (shouldFail()) {
      return { error: true, status: 500, message: 'Random mock server error' }
    }

    const { pathname, searchParams } = parseUrlParams(url)

    // GET /api/stats
    if (method === 'GET' && pathname === '/api/stats') {
      return { data: stats(), status: 200 }
    }

    // GET /api/activities
    if (method === 'GET' && pathname === '/api/activities') {
      const limit = parseInt(searchParams.get('limit') || '0', 10)
      const data = limit > 0 ? activities.slice(0, limit) : activities.slice()
      return { data, status: 200 }
    }

    // GET /api/activities/:id
    const actMatch = pathname.match(/^\/api\/activities\/(.+)$/)
    if (method === 'GET' && actMatch) {
      const id = actMatch[1]
      const act = activities.find((a) => a.id === id)
      if (!act) return { error: true, status: 404, message: 'Not found' }
      return { data: act, status: 200 }
    }

    // POST /api/donations - require Authorization header
    if (method === 'POST' && pathname === '/api/donations') {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user) return { error: true, status: 401, message: 'Invalid token' }
      const payload = body || {}
      const id = `d_${Date.now()}`
      const record = { id, userId: user.id, ...payload, createdAt: new Date().toISOString() }
      donations.push(record)
      return { data: { ok: true, id }, status: 201 }
    }

    // POST /api/volunteers (optional auth)
    if (method === 'POST' && pathname === '/api/volunteers') {
      const auth = (headers && headers.Authorization) || headers.authorization
      let userId = null
      if (auth) {
        const token = auth.replace(/^Bearer\s+/i, '')
        const user = tokens[token]
        if (user) userId = user.id
      }
      const payload = body || {}
      const id = `v_${Date.now()}`
      const record = { id, userId, ...payload, createdAt: new Date().toISOString() }
      volunteers.push(record)
      return { data: { ok: true, id }, status: 201 }
    }

    // POST /api/activities - create (admin)
    if (method === 'POST' && pathname === '/api/activities') {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user || user.role !== 'admin') return { error: true, status: 403, message: 'Forbidden' }
      const payload = body || {}
      const id = `a_${Date.now()}`
      const record = { id, ...payload, createdAt: new Date().toISOString(), completed: false }
      activities.unshift(record)
      return { data: record, status: 201 }
    }

    // PUT /api/activities/:id - update (admin)
    const actPutMatch = pathname.match(/^\/api\/activities\/(.+)$/)
    if (method === 'PUT' && actPutMatch) {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user || user.role !== 'admin') return { error: true, status: 403, message: 'Forbidden' }
      const id = actPutMatch[1]
      const payload = body || {}
      const idx = activities.findIndex((a) => a.id === id)
      if (idx === -1) return { error: true, status: 404, message: 'Not found' }
      activities[idx] = { ...activities[idx], ...payload }
      return { data: activities[idx], status: 200 }
    }

    // DELETE /api/activities/:id (admin)
    if (method === 'DELETE' && actPutMatch) {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user || user.role !== 'admin') return { error: true, status: 403, message: 'Forbidden' }
      const id = actPutMatch[1]
      const idx = activities.findIndex((a) => a.id === id)
      if (idx === -1) return { error: true, status: 404, message: 'Not found' }
      activities.splice(idx, 1)
      // remove participations
      participations = participations.filter((p) => p.activityId !== id)
      return { data: { ok: true }, status: 200 }
    }

    // POST /api/activities/:id/join - user signs up for activity (must be authenticated)
    const joinMatch = pathname.match(/^\/api\/activities\/(.+)\/join$/)
    if (method === 'POST' && joinMatch) {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user) return { error: true, status: 401, message: 'Invalid token' }
      const activityId = joinMatch[1]
      const activity = activities.find((a) => a.id === activityId)
      if (!activity) return { error: true, status: 404, message: 'Activity not found' }
      const payload = body || {}
      const id = `p_${Date.now()}`
      const record = { id, activityId, userId: user.id, userName: user.name, note: payload.note || '', status: 'pending', createdAt: new Date().toISOString() }
      participations.push(record)
      return { data: { ok: true, id }, status: 201 }
    }

    // GET /api/participations - admin can view all signups
    if (method === 'GET' && pathname === '/api/participations') {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user || user.role !== 'admin') return { error: true, status: 403, message: 'Forbidden' }
      return { data: participations.slice(), status: 200 }
    }

    // PATCH /api/participations/:id - admin updates status
    const partPatch = pathname.match(/^\/api\/participations\/(.+)$/)
    if (method === 'PATCH' && partPatch) {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user || user.role !== 'admin') return { error: true, status: 403, message: 'Forbidden' }
      const id = partPatch[1]
      const idx = participations.findIndex((p) => p.id === id)
      if (idx === -1) return { error: true, status: 404, message: 'Not found' }
      const payload = body || {}
      participations[idx] = { ...participations[idx], ...payload }
      return { data: participations[idx], status: 200 }
    }

    // POST /api/contact - public
    if (method === 'POST' && pathname === '/api/contact') {
      const payload = body || {}
      const id = `c_${Date.now()}`
      const record = { id, ...payload, status: 'new', createdAt: new Date().toISOString() }
      contacts.push(record)
      return { data: { ok: true, id }, status: 201 }
    }

    // GET /api/contacts - admin
    if (method === 'GET' && pathname === '/api/contacts') {
      const auth = (headers && headers.Authorization) || headers.authorization
      if (!auth) return { error: true, status: 401, message: 'Unauthorized' }
      const token = auth.replace(/^Bearer\s+/i, '')
      const user = tokens[token]
      if (!user || user.role !== 'admin') return { error: true, status: 403, message: 'Forbidden' }
      return { data: contacts.slice(), status: 200 }
    }

    // POST /api/register
    if (method === 'POST' && pathname === '/api/register') {
      const payload = body || {}
      const { name, email, password } = payload
      if (!email || !password || !name) {
        return { error: true, status: 400, message: 'Missing fields' }
      }
      if (users.find((u) => u.email === email)) {
        return { error: true, status: 409, message: 'Email already registered' }
      }
      const id = `u_${Date.now()}`
      const role = payload.role || 'user'
      const user = { id, name, email, password, role }
      users.push(user)
      const token = `t_${Math.random().toString(36).slice(2)}_${Date.now()}`
      tokens[token] = { id: user.id, name: user.name, email: user.email, role: user.role }
      return { data: { ok: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, status: 201 }
    }

    // POST /api/login
    if (method === 'POST' && pathname === '/api/login') {
      const payload = body || {}
      const { email, password } = payload
      const user = users.find((u) => u.email === email && u.password === password)
      if (!user) return { error: true, status: 401, message: 'Invalid credentials' }
      const token = `t_${Math.random().toString(36).slice(2)}_${Date.now()}`
      tokens[token] = { id: user.id, name: user.name, email: user.email, role: user.role }
      return { data: { ok: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, status: 200 }
    }

    return { error: true, status: 404, message: 'Not found' }
  }
}

// allow tests to seed tokens from front-end (useful when reloading localStorage)
mockServer.registerToken = function (token, userObj) {
  if (!token || !userObj) return
  tokens[token] = { id: userObj.id, name: userObj.name, email: userObj.email, role: userObj.role }
}

export default mockServer
