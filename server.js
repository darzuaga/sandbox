var express = require('express')
var bodyParser = require('body-parser')
var util = require('util')
// System.import('./services/mailgun.js');
var email = require('./services/mailgun.js');

var app = express()

var services = {
   'email': email
}

app.use(express.static('./'))
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var port = process.env.PORT || 8000


app.listen(port, () => console.log('starting biznobo on http'))

app.get('/', (req, res, next) => {
   res.render('index.html')
})

app.post('/send', (req, res, next) => {
   services['email'][req.body.endpoint](req.body)
   .subscribe(response => {
    // console.log('serverResponse');
    // console.log(response);
    res.json(response)
   })
})
