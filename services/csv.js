var csv = require("fast-csv");
var mail = require('email-verify')
var Hunter = require('emailhunter');
var hunter = new Hunter("2e90988137c793f5098587b0c46e49a7db51a53b");
var _ = require('lodash')
var util = require('util')

var backoff = require('backoff');


// var URL = require('url-parse');
// var url = require('url');
var domain = require('parse-domain')

// var osmosis = require('osmosis');
// var csv = require('csv');
var fs = require('fs');
var filename = './getresponse.csv'
var Rx = require('rxjs')

var esp = 'getresponse'
var Firebase = require('firebase')
var fbRef = new Firebase('https://biznobo-sandbox.firebaseio.com/')

// fbRef.set(null)

// var Nightmare = require('nightmare');
// var nightmare = Nightmare({ show: true })
//

var $ = require('jquery')
// fbRef.child('mailchimp').set(null)
// PARSE CSV //
var headers = [
     'url',
     'category',
     'rank',
     'global_monthly_visits',
     'copmany_name',
     'copmany_country',
     'copmany_state',
     'copmany_city',
     'copmany_phone',
     'copmany_revenue_range',
     'copmany_employee_range',
     'personal_emails',
     'role_basede_emails',
     'technology_coverage'
]

// csv
//  .fromPath(filename, {headers: headers})
//  .on("data", function(data){
//      console.log(data);
//      fbRef.child(esp + "/sites").push(data)
//  })
//  .on("end", function(){
//      console.log("done");
//  })

var sites = Rx.Observable.create(function(observer){
     // fbRef.child(esp+"/sites").orderByChild("active").equalTo(null).once('value', function(snapshot){
     fbRef.child(esp+"/sites").once('value', function(snapshot){
     // observer.next(snapshot.val())
          snapshot.forEach(function(site){
               // console.log(site.val()==undefined);
               if (site.val()) observer.next(site)
          //      // var site = siteSnap.val()
          //      // var url = site.url
          //      // request
          //      //      .get(url)
          //      //      .send()
          //      //      .end((error, response) => {
          //      //           if(error){
          //      //                console.log(url + ' error ' + error['code']);
          //      //                siteSnap.ref().update({active: false})
          //      //           } else if(response && response.text) {
          //      //                var isActive = response.text.indexOf('mailchimp') > -1
          //      //                console.log(url + ' isActive? ' + isActive);
          //      //                siteSnap.ref().update({active: isActive})
          //      //           }
          //      //      })
          })
     })
})

// fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).once('value', function(snapshot){

fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).once('value', function(snapshot){
// fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).limitToLast(5).once('value', function(snapshot){
     // console.log(snapshot.numChildren());
     // console.log('snapshot');
     snapshot.forEach(function(siteSnap){
          // var emailsObj = {
          //      'emails': {
          //           'checked': false
          //      }
          // }
          // console.log(siteSnap.val().emails.checked);
          if(siteSnap.val().emails && siteSnap.val().emails.emailhunter){
               siteSnap.val().emails.emailhunter.map(function(email){
                    // console.log(util.inspect(email, false, null));
                    email.value
               })
          }
          // console.log(siteSnap.ref().toString());
          // siteSnap.ref().update(emailsObj)
     })
})

var emailsSource = Rx.Observable.create(function(observer){
     fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).once('value', function(snapshot){
     // fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).limitToLast(5).once('value', function(snapshot){
          // console.log(snapshot.numChildren());
          // console.log('snapshot');
          snapshot.forEach(function(siteSnap){
               console.log('emailsChecked');
               console.log(siteSnap.val().emails);
               if(!siteSnap.val().emails || siteSnap.val().emails.checked == false || siteSnap.val().emails.count == 0){
                    observer.next(siteSnap)
               }
          })
     })
})

emailsSource.flatMap(function(siteSnap){
     return Rx.Observable.create(function(observer){
     var site = siteSnap.val();
     var parseUrl = domain(site.url);
     // console.log(site);

     var site = siteSnap.val();
     // console.log(site.emails);
     var parseUrl = domain(site.url);
     // console.log(parseUrl);
     // if(!site.emails && parseUrl){
     if(parseUrl){
     //      // console.log(site);
     //
          var url = parseUrl.domain + '.' + parseUrl.tld;
          // console.log(url);

          request
               .get('https://api.emailhunter.co/v1/email-count?domain=' + url)
               // .get('https://api.emailhunter.co/v1/search?domain=' + url + '&api_key=d1695ec729884866d226fa188103efd32fc2cc0d')
               .send()
               .end((err, res) => {
                    if(res && res.body) {

                         var count = res.body.count;
                         // console.log('count');

                         if(count>0){

                              observer.next({url: url, count: count, ref: siteSnap})

                         }

                    }
               })


     //      var emailsObj;
     //      hunter.search(url,function(err , response){
     //
     //      	if(err){
     //                var emailsObj = {
     //                     'emails': {
     //                          'checked': true
     //                     }
     //                }
     //                console.error('ERROR',err);
     //                console.log(siteSnap.ref().toString());
     //                siteSnap.ref().update(emailsObj)
     //           } else {
     //                var emails = (response.length == 0) ? null : response;
     //                console.log('emails for' + site.url);
     //                console.log(emails);
     //                console.log("EMAILS FOUND-----------------------");
     //                console.log('emailPath');
     //                console.log(siteSnap.ref().toString()+'/emails/emailhunter');
     //                console.log(site.url);
     //                console.log(emails);
     //                var emailsObj = {
     //                     'emails': {
     //                          'checked': true,
     //                          'emailhunter': emails
     //                     }
     //                }
     //                // console.log('emailsObj');
     //                // console.log(emailsObj);
     //
     //                console.log("-----------------------EMAILS FOUND");
     //                siteSnap.ref().update(emailsObj)
     //           }
     //
     //      });
     //
     }
     })
})
// .map(function(res){
.subscribe(function(res){
     // console.log('resBottom');
     // console.log(res);


     var call = backoff.call(getEmails, res, function(err, result) {
     //     console.log('Num retries: ' + call.getNumRetries());

         if (err) {
             console.log('Error: ' + err.message);
         } else {
             console.log('Body: ' + result.body);
         }
     });

     call.retryIf(function(err) { return err.status == 503; });
     call.setStrategy(new backoff.ExponentialStrategy());
     call.failAfter(5);
     call.start();

})

var getEmails = function(res){
     var url = res.url;
     var count = res.count;
     var ref = res.ref; // firebase reference;
     request
          // .get('https://api.emailhunter.co/v1/email-count?domain=' + url)
          .get('https://api.emailhunter.co/v1/search?domain=' + url + '&api_key=2e90988137c793f5098587b0c46e49a7db51a53b')
          .send()
          .end((error, response) => {
               if(error){
                    console.log('error');
                    console.log(Object.keys(error))
                    console.log(error.code);
               } else if(response && response.body) {
                    // console.log(response.body.emails);

                    var emails = (response.body.emails.length == 0) ? null : response.body.emails;

                    console.log("EMAILS FOUND-----------------------");
                    console.log('emails found for ' + url);
                    console.log(response.body.emails.length);
                    console.log('emailPath');
                    console.log(ref.ref().toString()+'/emails/emailhunter');
                    console.log("-----------------------EMAILS FOUND");

                    var emailsObj = {
                         'emails': {
                              'checked': true,
                              'emailhunter': emails,
                              'count': count
                         }
                    }
                    ref.ref().update(emailsObj)
                    return emailsObj
                    // console.log('emailsObj');
                    // console.log(emailsObj);


               }

          })
}

// fbRef.child(esp + "/sites").orderByChild("active").equalTo(true).once('value', function(snapshot){
//      // console.log(snapshot.numChildren());
//      // console.log('snapshot');
//
//      snapshot.forEach(function(siteSnap){
//      // snapshot.forEach(function(siteSnap){
//           // console.log(siteSnap.val());
//
//           var site = siteSnap.val();
//           var parseUrl = domain(site.url);
//           if(!site.emails && parseUrl){
//                // console.log(site);
//
//                var url = parseUrl.domain+'.'+parseUrl.tld;
//                // console.log(url);
//                var emailsObj;
//                hunter.search(url,function(err , response){
//
//                	if(err){
//                          var emailsObj = {
//                               'emails': {
//                                    'checked': true
//                               }
//                          }
//                          console.error('ERROR',err);
//                          console.log(siteSnap.ref().toString());
//                          siteSnap.ref().update(emailsObj)
//                     } else {
//                          var emails = (response.length == 0) ? null : response;
//                          console.log('emails for' + site.url);
//                          console.log(emails);
//                          console.log("EMAILS FOUND-----------------------");
//                          console.log('emailPath');
//                          console.log(siteSnap.ref().toString()+'/emails/emailhunter');
//                          console.log(site.url);
//                          console.log(emails);
//                          var emailsObj = {
//                               'emails': {
//                                    'checked': true,
//                                    'emailhunter': emails
//                               }
//                          }
//                          // console.log('emailsObj');
//                          // console.log(emailsObj);
//
//                          console.log("-----------------------EMAILS FOUND");
//                          siteSnap.ref().update(emailsObj)
//                     }
//
//                });
//
//           }
//
//      //      console.log(siteSnap.ref().toString());
//      //
//
//
//      //
//      //
//      })
//      // console.log(snapshot.numChildren());
// })

sites
     .map(function(snapshot){
          // console.log(snapshot);
          // snapshot.map(function(site){
          //      console.log(site);
          // })

          // return Rx.Observable.create(function(observer){
               var site = snapshot.val()
               var url = site.url
               // console.log('url');
               // console.log(site);
               try {
                    request
                         .get(url)
                         .send()
                         .end((error, response) => {
                              // console.log('top');
                              // if (response) console.log(response.text);
                              // if (error) console.log(error['code']);
                              // return response.text

                              // observer.next(resposne.text)
                              // return resposne

                              if(error){
                                   console.log(url + ' error ' + error['code']);
                                   snapshot.ref().update({active: false})
                              } else if(response && response.text) {
                                   var isActive = response.text.indexOf('getresponse') > -1
                                   console.log(url + ' isActive? ' + isActive);
                                   snapshot.ref().update({active: isActive})
                              }
                         })
               } catch (e) {
                    console.log('error');
                    console.log(e);
               }

          // })
     })

     // .filter(function(res){return res})
     // .subscribe(function(response){
     //      // console.log(response);
     //      // console.log(Object.keys(response));
     // })





// var request = require('request');
// var cheerio = require('cheerio');
var request = require('superagent')

// request
//      .get('http://floridasmart.com/')
//      .send()
//      .end((error, response) => {
//           console.log(response.text.indexOf('mailchimp'));
//      })
//

// CRAWL SITES //

// Rx.Node.fromStream(filename)
//   .map( (data) => {
//     console.log('data');
//     console.log(data);
//     return csv.parse(data.toString())
//   } )
//   .subscribe()

// fs.readFileSync(filename, {}, function(err, res2){
//    console.log(res2);
// })

// fs.open(filename, 'r', function(err, res){
//
// })
