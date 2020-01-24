require('dotenv').config()
const http = require('http')
const app = require('./src')
const server = http.createServer(app)

server.listen(process.env.PORT || 3000, () => {
    console.log(`listening at port ${process.env.PORT || 3000}`)
})