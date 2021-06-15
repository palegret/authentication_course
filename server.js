const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const events = require('./db/events.json')

// Middleware
const parseToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(401)
  }
}

// In a production app, you'll want the secret key to be an environment variable
const JwtSecret = 'the_secret_key'

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API.'
  })
})

app.get('/dashboard', parseToken, (req, res) => {
  jwt.verify(req.token, JwtSecret, err => {
    if (err) {
      res.sendStatus(401)
    } else {
      res.json({
        events: events
      })
    }
  })
})

app.post('/register', (req, res) => {
  if (req.body) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
      // In a production app, you'll want to encrypt the password
    }

    const data = JSON.stringify(user, null, 2)

    var dbUserEmail = require('./db/user.json').email
    var errorsToSend = []

    if (dbUserEmail === user.email) {
      errorsToSend.push('An account with this email already exists.')
    }

    if (user.password.length < 5) {
      errorsToSend.push('Password too short.')
    }

    if (errorsToSend.length > 0) {
      res.status(400).json({ errors: errorsToSend })
    } else {
      fs.writeFile('./db/user.json', data, err => {
        if (err) {
          console.log(err + data)
        } else {
          const token = jwt.sign({ user }, JwtSecret)
          res.json({
            token,
            email: user.email,
            name: user.name
          })
        }
      })
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/login', (req, res) => {
  if (!req.body) {
    res.status(401).json({ error: 'Invalid login. Please try again.' })
  }

  const userDB = fs.readFileSync('./db/user.json')
  const user = JSON.parse(userDB)
  const { body } = req

  if (body.email === user.email && body.password === user.password) {
    const token = jwt.sign({ userInfo: user }, JwtSecret)    
    res.json({
      token,
      email: user.email,
      name: user.name
    })
  } else {
    res.status(401).json({ error: 'Invalid login. Please try again.' })
  }
})

app.listen(3000, () => {
  console.log('Server started on port 3000...')
})
