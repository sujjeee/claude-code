const http = require('http')
const { exec } = require('child_process')
const { parse } = require('url')

const SECRET = process.env.SECRET || 'changeme'

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url.startsWith('/run')) {
    if (req.headers['x-secret'] !== SECRET) {
      res.writeHead(401)
      return res.end('Unauthorized')
    }

    const { query } = parse(req.url, true)
    const prompt = query.prompt || 'default task'

    res.writeHead(200)
    res.end('Claude started')

    exec(`claude -p "${prompt}" >> /root/claude.log 2>&1`)
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(3000, () => console.log('Listening on port 3000'))
