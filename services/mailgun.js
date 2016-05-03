var Mailgun = require('mailgun').Mailgun;
// import {Mailgun} from 'npm:mailgun'
var mailgun = new Mailgun('key-deaa68e6a637455ee70397251da174b0');
// import request from 'npm:superagent'
var request = require('superagent')
var util = require('util')
// import util from 'npm:util'
var Rx = require('rxjs')
// import * as Rx from 'rx';

// import _ from 'lodash'
var _ = require('lodash')
// import Firebase from 'firebase'
var Firebase  = require('firebase')
var githubRef = new Firebase('https://biznobo-sandbox.firebaseio.com/github/users')
var githubEmailRef = new Firebase('https://biznobo-sandbox.firebaseio.com/github/emails')
var fbRef = new Firebase('https://biznobo-sandbox.firebaseio.com')
var emailEndpoint = 'email_tests'
// var emailEndpoint = 'email_tests_sandbox'

var esp = 'getresponse'
// import moment from 'moment'
var moment = require('moment')





var text =  "Hey <br>\n\
<br>\n\
Just wanted to ask you a quick question. I’m Alex from Biznobo. I noticed that you were using Getresponse to follow up with your leads. <br>\n\
<br>\n\
I was curious if you'd like to be able to send emails from Getresponse based on actions your visitors have taken such as sending them an email if they leave your checkout page and bring them back? <br>\n\
<br>\n\
I wanted to send you an invite to a free beta tester account. If you’d like to try it out I’ve added the link below, feel free to create an account. <br>\n\
<br>\n\
http://unbouncepages.com/biznobo/beta/<br>\n\
<br>\n\
Hope to see you on the other side, <br>\n\
<br>\n\
Alex Meneses <br>\n\
Co Founder <br>\n\
Biznobo <br>\n\ "

var subject = 'Quick question';

// var testSize = 1;

var emails = Rx.Observable.create(function(observer){
     fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).once('value', function(snapshot){
          // console.log(snapshot.numChildren());
          // console.log('snapshot');
          // var snapshot2 = [{email: '1infiniteloop.end@gmail.com'}, {email: '1infiniteloop.end+2@gmail.com'}]
          snapshot.forEach(function(siteSnap){

               if(siteSnap.val().emails.emailhunter && !siteSnap.val().contacted){
               // if(siteSnap){
                    observer.next(siteSnap)

               }
               // console.log(siteSnap.ref().toString());
               // siteSnap.ref().update(emailsObj)
          })
     })
})

function isValid(email){
     return Rx.Observable.create(observer => {
          request
            .get('https://api.mailgun.net/v3/address/validate')
            .auth('api', 'pubkey-290941eafba03257e14233b628e54968')
            .type('form')
            .send({
                 'address': email
            })
            .end((error, response) => {
                 observer.next(response.body.is_valid)
            })
     })
}

// isValid('1infiniteloop.end@gmail.com')

function sendEmails(payload){

    // var sentOnce = false
    return emails
      // .filter(x => !sentOnce)
      .map(function(siteSnap, numOfEmailsSent){
          var email;

          // console.log('email');
          var personal_emails = siteSnap.val().emails.emailhunter.filter(email=>email.type == 'personal')
          // var generic_emails = siteSnap.val().emails.emailhunter.filter(email=>email.type == 'generic')
          if (personal_emails.length > 0){
               email = personal_emails[0].value
               // console.log(email, 'personal');
          } else {
               email = siteSnap.val().emails.emailhunter[0].value
               // console.log(email, 'generic');
          }

          isValid(email).subscribe(valid => {
               console.log('isValid');
               console.log(valid, email);
               if(valid){

                //  email = 'mauro@biznobo.com'
                //  sentOnce = true

                    // console.log('personal_emails');
                    // console.log(generic_emails);
                    // var email = siteSnap.email;
                    var testSize = payload.size;
                    var html = setEmailParam(payload.html, email);
                    var subject = payload.subject
                    // console.log('html');
                    // console.log(html);
                    // var email = siteSnap.val().emails.emailhunter[0].value
                    // console.log('email');
                    // console.log(email);
                    var ref = siteSnap.ref()
                    if(numOfEmailsSent<=testSize){
                         // console.log('gotHere');
                         request
                            .post('https://api.mailgun.net/v3/conversiontemplates.com/messages')
                            .auth('api', 'key-f67521c42fe75366bee0120238a9efee')
                            .type('form')
                            .send({
                                 'from': 'Alex <alex@biznobo.com>',
                                 'to': email,
                              //    'to': '1infiniteloop.end@gmail.com',
                                 'subject': subject,
                                 'html': html,
                                 'o:tracking': true,
                                 'o:tracking-clicks':true,
                                 'o:tracking-opens':true
                            })
                            .end((error, response) => {
                               console.log('email sent to ' + email);
                               if (error){
                                    var id = moment().unix();
                                    var data = {
                                         'contacted': {
                                              [id]: {
                                                   'email': email,
                                                   'test_id': id,
                                                   'description': subject,
                                                   'status': 'error'
                                              }
                                         }
                                    }
                                    console.log('data');
                                    console.log(data);
                                    return error && console.log(error)
                                    siteSnap.ref().update(data)

                               } else {
                                    console.log('numOfEmailsSent');
                                    console.log(numOfEmailsSent);
                                    numOfEmailsSent = numOfEmailsSent+1;
                                    var id = moment().unix();

                                    var data = {
                                         'contacted': {
                                              [id]: {
                                                   'email': email,
                                                   'test_id': id,
                                                   'description': subject,
                                                   'status': 'success'
                                              }
                                         }
                                    }

                                    // observer.next(data)
                                   //  console.log('data');
                                   //  console.log(data);
                                    siteSnap.ref().update(data)
                               }

                            })
                    }



               }
          })



     })
}
// .subscribe()

function setEmailParam(html, email) {
  var preppedHTML = html

  // Replace the query param with email
  preppedHTML = preppedHTML.replace('foobar', `email=${email}`)

  return preppedHTML
}


fbRef.child(emailEndpoint).on('child_added', test => {
     var testRef = test.ref();
     var testVal = test.val()
     if(testVal.status !== 'sent'){
          console.log('testVal');
          console.log(testVal);
          sendEmails(testVal).subscribe()
          testRef.update({status: 'sent'})
     }
})

// githubEmailRef.limitToLast(500).once('value', function(snapshot){
//          console.log('firsbase');
//          // var snapshot2 = [{email: '1infiniteloop.end@gmail.com'}, {email: 'maurop123@gmail.com'}, , {email: 'maurop123@mailinator.com'}]
//          snapshot.forEach(function(userSnapshot){
//                // var user = userSnapshot.val()
//                // request
//                //      .get('https://api.mailgun.net/v3/address/validate')
//                // //         .auth('api', 'key-deaa68e6a637455ee70397251da174b0')
//                //      .auth('api', 'pubkey-0eb2db6c5b8f320273a6af5d02a8afc2')
//                //      .type('form')
//                //      .send({
//                //               address: user.email
//                //      })
//                //      .end((error, response) => {
//                //       //   console.log('email sent to ' + user.email);
//                //       // console.log(Object.keys(response));
//                //       //   console.log(response.body.address + "isValid?" + response.body.is_valid);
//                //         if(!response.body.is_valid){
//                //                  console.log(response.body.address);
//                //         }
//                //      })
//
//
//
//                   var user = userSnapshot
//                   var user = userSnapshot.val()
//                   var ref = userSnapshot.ref()
//
//                       request
//                           .get('https://api.mailgun.net/v3/mptysquare.com/messages')
//                           .auth('api', 'key-deaa68e6a637455ee70397251da174b0')
//                           .type('form')
//                           .send({
//                                    'from': 'Danny <1infiniteloop.end+api1@gmail.com>',
//                                    'to': user.email,
//                                    'subject': 'Quick question',
//                                    'html': text,
//                                    'o:tracking': true,
//                                    'o:tracking-clicks':true,
//                                    'o:tracking-opens':true
//                           })
//                           .end((error, response) => {
//                              console.log('email sent to ' + user.email);
//                              if (error){
//                                       return error && console.log(error)
//                              } else {
//                                       ref.update({
//                                                test: {
//                                                         variant: 1,
//                                                         description: 'first test sent to the first 500 emails we collected',
//                                                         id: response.body.id
//                                                }
//                                       })
//                              }
//
//                           })






//          //
//          //
//          //
//          //          // mailgun.sendText('Danny <1infiniteloop.end+api1@mptysquare.com>',
//          //          //          [user.email],
//          //          //          'quick question',
//          //          //          text,
//          //          //          {},
//          //          //          {'headers':
//          //          //                   {
//          //          //                            'o:tracking': 'yes', 'o:tracking-clicks':'yes', 'o:tracking-opens':'yes'
//          //          //                   }
//          //          //          },
//          //          //          function(err, response) {
//          //          //             if(err){
//          //          //                return err && console.log(err)
//          //          //             } else {
//          //          //                      console.log('email sent to ' + user.email);
//          //          //                   //    ref.update({
//          //          //                   //             test: {
//          //          //                   //                      id: 1,
//          //          //                   //                      description: 'first test sent to the first 500 emails we collected'
//          //          //                   //             }
//          //          //                   //    })
//          //          //
//          //          //             }
//          //          //          });
//          //
//          //
//          //
//          })
//
//
//
//
//
//
// })

// var emails = ['danny@biznobo.com', '1infiniteloop.end@gmail.com', 'maurop123@gmail.com'];
//
// emails.map(function(email){
//          mailgun.sendText('Danny <danny@biznobo.com>',
//                   [email],
//                   'Behold the wonderous power of email!',
//                   text,
//                   {},
//                   function(err) {
//                      if(err){
//                         return err && console.log(err);
//                      } else {
//                               console.log('success');
//                            //   githubEmailRef.child('emails[email]').update()
//                      }
//                   });
// })
