var Mailgun = require('mailgun').Mailgun;
var mailgun = new Mailgun('key-deaa68e6a637455ee70397251da174b0');
var request = require('superagent')
var util = require('util')
var Rx = require('rxjs')
var _ = require('lodash')
var Firebase = require('firebase')
var githubRef = new Firebase('https://biznobo-sandbox.firebaseio.com/github/users')
var githubEmailRef = new Firebase('https://biznobo-sandbox.firebaseio.com/github/emails')





var text = 'Hi, my name is Danny… <br>\n\
<br>\n\
I know you’re super busy, so I’ll keep this short. I’m asking for feedback from over 10,000 of the top developers from Github on this one question... <br>\n\
<br>\n\
What is your biggest challenge when developing and using API’s? <br>\n\
<br>\n\
Big question, I know, but I could really use your help. My goal is to make the experience of developing and using API’s simpler, more pleasant, and more productive. I’ll also share what I learn with you in the next few days. My plan is to make every API instantly searchable and available. Think of it like Google for API’s. <br>\n\
<br>\n\
You don’t need to fill out a survey or anything like that. Just reply to this email with your honest thoughts. And don’t worry, your feedback will be kept completely anonymous. <br>\n\
<br>\n\
Thank you for your time!'


githubEmailRef.limitToLast(500).once('value', function(snapshot){
         console.log('firsbase');
         // var snapshot2 = [{email: '1infiniteloop.end@gmail.com'}, {email: 'maurop123@gmail.com'}, , {email: 'maurop123@mailinator.com'}]
         snapshot.forEach(function(userSnapshot){
                  var user = userSnapshot.val()
                                   request
                                   .get('https://api.mailgun.net/v3/address/validate')
                           //         .auth('api', 'key-deaa68e6a637455ee70397251da174b0')
                                   .auth('api', 'pubkey-0eb2db6c5b8f320273a6af5d02a8afc2')
                                   .type('form')
                                   .send({
                                            address: user.email
                                   })
                                   .end((error, response) => {
                                    //   console.log('email sent to ' + user.email);
                                    // console.log(Object.keys(response));
                                    //   console.log(response.body.address + "isValid?" + response.body.is_valid);
                                      if(!response.body.is_valid){
                                               console.log(response.body.address);
                                      }

                                    //   if (error){
                                    //            return error && console.log(error)
                                    //   } else {
                                    //            ref.update({
                                    //                     test: {
                                    //                              variant: 1,
                                    //                              description: 'first test sent to the first 500 emails we collected',
                                    //                              id: response.body.id
                                    //                     }
                                    //            })
                                    //   }

                                   })
         //
         //
         //
         //          // var user = userSnapshot
         //          // var user = userSnapshot.val()
         //          // var ref = userSnapshot.ref()
         //
         //          //     request
         //          //         .post('https://api.mailgun.net/v3/mptysquare.com/messages')
         //          //         .auth('api', 'key-deaa68e6a637455ee70397251da174b0')
         //          //         .type('form')
         //          //         .send({
         //          //                  'from': 'Danny <1infiniteloop.end+api1@gmail.com>',
         //          //                  'to': user.email,
         //          //                  'subject': 'Quick question',
         //          //                  'html': text,
         //          //                  'o:tracking': true,
         //          //                  'o:tracking-clicks':true,
         //          //                  'o:tracking-opens':true
         //          //         })
         //          //         .end((error, response) => {
         //          //            console.log('email sent to ' + user.email);
         //          //            if (error){
         //          //                     return error && console.log(error)
         //          //            } else {
         //          //                     ref.update({
         //          //                              test: {
         //          //                                       variant: 1,
         //          //                                       description: 'first test sent to the first 500 emails we collected',
         //          //                                       id: response.body.id
         //          //                              }
         //          //                     })
         //          //            }
         //              //
         //          //         })
         //
         //
         //
         //          // mailgun.sendText('Danny <1infiniteloop.end+api1@mptysquare.com>',
         //          //          [user.email],
         //          //          'quick question',
         //          //          text,
         //          //          {},
         //          //          {'headers':
         //          //                   {
         //          //                            'o:tracking': 'yes', 'o:tracking-clicks':'yes', 'o:tracking-opens':'yes'
         //          //                   }
         //          //          },
         //          //          function(err, response) {
         //          //             if(err){
         //          //                return err && console.log(err)
         //          //             } else {
         //          //                      console.log('email sent to ' + user.email);
         //          //                   //    ref.update({
         //          //                   //             test: {
         //          //                   //                      id: 1,
         //          //                   //                      description: 'first test sent to the first 500 emails we collected'
         //          //                   //             }
         //          //                   //    })
         //          //
         //          //             }
         //          //          });
         //
         //
         //
         })






})

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
