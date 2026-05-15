const http = require('http')
const { spawn } = require('child_process')
const { parse } = require('url')
const fs = require('fs')

const SECRET = process.env.SECRET || 'changeme'

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/me') {
    res.writeHead(200)
    return res.end('server is live')
  }

  if (req.method === 'POST' && req.url.startsWith('/run')) {
    if (req.headers['x-secret'] !== SECRET) {
      res.writeHead(401)
      return res.end('Unauthorized')
    }

    const { query } = parse(req.url, true)
    const prompt = query.prompt || 'default task'

    res.writeHead(200)
    res.end('Claude started')

    // spawn avoids shell injection — prompt is passed as a literal arg, not interpolated
    const log = fs.createWriteStream('/tmp/claude.log', { flags: 'a' })
    const child = spawn('claude', ['-p', prompt])
    child.stdout.pipe(log)
    child.stderr.pipe(log)
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(3000, () => console.log('Listening on port 3000'))
