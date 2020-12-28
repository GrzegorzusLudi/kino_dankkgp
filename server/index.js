const express = require('express')
const bodyParser = require('body-parser')
const dateFormat = require('dateformat');

const app = express()
const port = 3000

const frontendDir = __dirname + '/../frontend/'
const pageDir = 'pages/'

let lastmessages = []

app.get('/', (req, res) => {
  res.sendFile(pageDir + 'index.html', {root:frontendDir})
})

app.use( bodyParser.json() )
app.post('/post', (req, res) => {
    var now = new Date();
    
    var msg = req.body.message
    if(msg.trim().length == 0)
        return
        
    lastmessages.push({
        date: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
        message: msg
    })
    if(lastmessages.length > 100){
        lastmessages = lastmessages.slice(1)
    }
    res.sendStatus(200)
})

app.get('/chat', (req, res) => {
    res.json({
        messages:lastmessages
    })
})
app.use(express.static(frontendDir + 'static'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
