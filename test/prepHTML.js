var mail = require('../services/mailgun.js')

var html = "<p>This is a test.</p><p>With a&nbsp;<a href=\"http://lvh.me:8000/?foobar\">http://lvh.me:8000/</a></p>"

console.log(mail(html));
