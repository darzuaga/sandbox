var Xray = require('x-ray');
var xray = Xray();
var request = require('superagent')
var util = require('util')
var Rx = require('rxjs')
var _ = require('lodash')
var Firebase = require('firebase')
var githubRef = new Firebase('https://biznobo-sandbox.firebaseio.com/github/users')
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })
var $ = require('jquery')
// nightmare
//   .goto('http://google.com')
//   // .type('input[title="Search"]', 'github nightmare')
//   // .click('#uh-search-button')
//   // .wait('#main')
//   .evaluate(function () {
//     console.log('hihihih');
//     console.log(document.querySelector('#main .searchCenterMiddle li a').href);
//     return document.querySelector('#main .searchCenterMiddle li a').href
//   })
//   // .end()
//   .then(function (result) {
//     console.log(result)
//   })
//
// nightmare.end()
//
var google = nightmare
  .goto('https://www.crunchbase.com/search')
  .wait('#founded_after')
  .select('#founded_after', 2015)
  .wait('#founded_before')
  .select('#founded_before', 2016)
  // .scrollTo(2000, 2000)
  .evaluate(function(){
    var lastHeight = 0;
    setInterval(function(){
      if($('#main-content').height()!==lastHeight){
        console.log(lastHeight);
        // $(window).scrollTop(lastHeight+2000)
        // lastHeight = lastHeight+2000;
      }
    },2000)
  })
  // .wait(500)
  // .evaluate(function(){
  //   console.log('millions');
  //   // console.log(document.body.scrollHeight);
  //   // console.log(document.body.clientHeight);
  //   // var atBottom = 0;
  //   // setInterval(function(){
  //   //   if(atBottom !== $(window).scrollTop()){
  //   //     $(window).scrollTop(atBottom+4000)
  //   //     atBottom = atBottom+1000;
  //   //   }
  //   // }, 1000)
  //
  //
  //
  //   // $(window).scroll(function(){
  //   //   // console.log($(window).scrollTop());
  //   //   //
  //   //   // console.log($(document).height());
  //   //
  //   //
  //   // })
  //
  //
  //
  //   // console.log($(window).height());
  //   //
  //   // $(window).scroll(function() {
  //   //    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  //   //        alert("near bottom!");
  //   //    }
  //   // });
  //   //
  //   // if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  //   //   console.log('  alert("near bottom!");');
  //   // } else {
  //   //   console.log('no bottom');
  //   // }
  //
  //   $(window).scrollTop(1900)
  //   // document.body.scrollTop = document.body.scrollHeight - document.body.clientHeight;
  // })
  .run(function(err, nightmare) {

    if (err) return console.log(err);
    console.log('Done!');
    console.log(nightmare);
  });


  // var google = nightmare
  //   .goto('https://www.crunchbase.com/funding-round/6dec9d2c282b12333f304d2512cb15bd')
  //   .wait()
  //   // .wait('#funded_before')
  //   .evaluate(function(){
  //     $('select#founded_before').val('2014');
  //   })
  //   // .wait(500)
  //   // .evaluate(function(){
  //   //   var selectr2 = $('#founded_before').val('2015');
  //   //   return selectr2
  //   // })
  //   .wait(500)
  //   .run(function(err, nightmare) {
  //     if (err) return console.log(err);
  //     console.log('Done!');
  //     console.log(nightmare);
  //   });

// phantom.create().then(ph => {
//     _ph = ph;
//     return _ph.createPage();
// }).then(page => {
//     _page = page;
//     return _page.open('https://www.crunchbase.com/organization/youtube#/entity');
// }).then(status => {
//     console.log(status);
//     return _page.property('content')
// }).then(content => {
//     console.log(content);
//     _page.close();
//     _ph.exit();
// });
