"use strict";

var request = require('superagent')
var util = require('util')
var Rx = require('rxjs')
var depGraph = require('es-dependency-graph');
// var esprima = require('esprima')
var recast = require("recast");
var scour = require('scourjs')
var traverse = require('traverse');
var _ = require('lodash')
var dot = require('dot-object');
var estraverse = require('estraverse-fb');
var fondue = require('fondue')
var vm = require('vm');
var dfatool = require('dfatool')
var escodegen = require('escodegen')
var convert = require('convert-source-map')
var UglifyJS = require("uglify-js");

var parse = require("shift-parser");
var analyzeScope = require("shift-scope");
var istanbul = require('istanbul');
var assert = require("assert");
var types = require("ast-types");
var brushtail = require('brushtail')
var acorn = require('acorn')
var recursive = require('acorn/dist/walk')
// ('acorn');


var Firebase = require('firebase')
var githubRef = new Firebase('https://biznobo-sandbox.firebaseio.com/')
var githubEmailRef = new Firebase('https://biznobo-sandbox.firebaseio.com/github/emails')

githubRef.set(null)


function gol(obj, utils){
  if(!utils) {
    console.log(util.inspect(obj, false, null));
    return
  } else {
    console.log(obj);
    return
  }
}

function createsNewScope(node){
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program';
}

var scopeChain = [];

// if (createsNewScope(node)){
//   scopeChain.push([]);
// }


// var GitHubApi = require("github");
//
// var github = new GitHubApi({
//     // required
//     version: "3.0.0",
//     // // optional
//     // debug: true,
//     // protocol: "https",
//     // host: "github.my-GHE-enabled-company.com", // should be api.github.com for GitHub
//     // pathPrefix: "/api/v3", // for some GHEs; none for GitHub
//     // timeout: 5000,
//     // headers: {
//     //     "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
//     // }
// });
//
// github.authenticate({
//     type: "basic",
//     username: 'darzuaga',
//     password: 'lgs350h2'
// });
//
// // (github.__proto__);

//
//
//
//
//
//
var scopeChain = [];
var assignments = [];
var dec = false;

function enter(node){

  if (createsNewScope(node)){
    scopeChain.push([]);
  }
  if (node.type === 'VariableDeclarator'){

    // // ('VariableDeclarator');
    // // (node);
    if (dec == false) {
      dec = true;
      gol(node)
    }
    var currentScope = scopeChain[scopeChain.length - 1];
    // // ('Variable');
    // // (node.id.name);
    currentScope.push(node.id.name);
  }
  if (node.type === 'AssignmentExpression'){
    // // ('AssignmentExpression');
    // // ('node.left');
    // // (Object.keys(node));
    assignments.push(node.left.name);
  }
  if(node.type == 'CallExpression'){
    // ('CallExpression');
    // (node.callee.property.name);
  }

}

function leave(node){
  if (createsNewScope(node)){
    // // ('leaveNode');
    // // (Object.keys(node));
    // // (node.type);
    // checkForLeaks(assignments, scopeChain);
    // scopeChain.pop();
    // assignments = [];
  }
}

function isVarDefined(varname, scopeChain){
  for (var i = 0; i < scopeChain.length; i++){
    var scope = scopeChain[i];
    if (scope.indexOf(varname) !== -1){
      return true;
    }
  }
  return false;
}

function checkForLeaks(assignments, scopeChain){
  for (var i = 0; i < assignments.length; i++){
    // // ('assigments');
    // // (assignments[i]);
    if (!isVarDefined(assignments[i], scopeChain)){
      // ('Detected leaked global variable:', assignments);
    }
  }
}

function createsNewScope(node){
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program';
}

// function getUsers(params){
//   return Rx.Observable.create(function(observer){
//     // console.log('observerTop');
//     // console.log(observer);
//
//     var usersPath = params ? params.path : 'https://api.github.com/users';
//     console.log('usersPath');
//     console.log(usersPath);
//     request
//         // .get('https://api.github.com/repos/lodash/lodash/contents/package.json?ref=master+json')
//         // .get('https://api.github.com/search/code?q=aweber-api-nodejs+repo:darzuaga/biznobo')
//         // when trying to the raw contents of the file so that we can analyze it, use this uri https://raw.githubusercontent.com/
//         // instead of the api uri otherwise you wont be able to get the contents in a readable format.
//         // .get('https://raw.githubusercontent.com/darzuaga/biznobo/master/src/services/aweber.js')
//         // .get('https://api.github.com/repos/darzuaga/biznobo/contents/src/services/aweber.js')
//         // .get(`https://raw.githubusercontent.com/darzuaga/biznobo/master/package.json?token=AA8QyBJC-QeWyaCiRsfPfLcbmmMmkVnhks5XErauwA%3D%3D`)
//         // .get('https://api.github.com/users?since=135')
//         .get(usersPath)
//         .auth('darzuaga', 'lgs350h2')
//         .send()
//         .end((error, response) => {
//           // console.log('observerTop');
//           // console.log(observer);
//           observer.next(response)
//         })
//   })
// }

// var since = Rx.Observable
// .timer(200, 100)
// .take(3)
// .subscribe(function(response){
//   // console.log('sinceResponse');
//   // console.log(response.body);
//   console.log('responseIndex');
//   console.log(index);
//   return response.links.next
// })
// .distinctUntilChanged();

// function getUsers(params){
//   console.log('paramsTop');
//   console.log(params);
//   var path = params ? params : 'https://api.github.com/users';
//   console.log('pathTop');
//   console.log(path);
//   return Rx.Observable.create(function(observer){
//     console.log('params');
//     console.log(params);
//     request
//         // .get('https://api.github.com/repos/lodash/lodash/contents/package.json?ref=master+json')
//         // .get('https://api.github.com/search/code?q=aweber-api-nodejs+repo:darzuaga/biznobo')
//         // when trying to the raw contents of the file so that we can analyze it, use this uri https://raw.githubusercontent.com/
//         // instead of the api uri otherwise you wont be able to get the contents in a readable format.
//         // .get('https://raw.githubusercontent.com/darzuaga/biznobo/master/src/services/aweber.js')
//         // .get('https://api.github.com/repos/darzuaga/biznobo/contents/src/services/aweber.js')
//         // .get(`https://raw.githubusercontent.com/darzuaga/biznobo/master/package.json?token=AA8QyBJC-QeWyaCiRsfPfLcbmmMmkVnhks5XErauwA%3D%3D`)
//         // .get('https://api.github.com/users?since=135')
//         .get(path)
//         .auth('darzuaga', 'lgs350h2')
//         .send()
//         .end((error, response) => {
//           console.log('responseBottom');
//           // console.log(error);
//           // console.log(response.body);
//           observer.next(response)
//         })
//   })
// }
function getProfile(){
  return Rx.Observable.create(function(observer){
    githubRef.child('last_checked').once('value', function(lastChecked){



        var startAt = lastChecked.exists() ? lastChecked.val().id : 1;
        // console.log('startAt');
        // console.log(startAt);
        githubRef.orderByChild('id').startAt(startAt).limitToFirst(30).once('value', function(snapshot){
          // console.log('numChildren');
          // console.log(snapshot.numChildren());
          // console.log();
          // var lowest = _.min(snapshot.val(), function(o){return o.id});
                // console.log('lowest');
          // _.max(_.map(snapshot.val(), "id"))
          // var lowest = _.max(_.pluck(obj, 'value'))

          // console.log(lowest);
          // var last_checked = snapshot.val()[Object.keys(snapshot.val())[snapshot.numChildren() - 1]];
          // console.log('last_checked');
          // console.log(last_checked);
          snapshot.forEach(function(userSnapshot){
            observer.next(userSnapshot.val())
          })
        })
        // githubRef.update({'last_checked': last_checked})

    })

  })
}

var saveProfile = getProfile().map(function(user){
  // console.log('GithubUser');
  // console.log(user);
  // var user = userSnapshot.val()
  // console.log(user);
  var id = user.id;
  // console.log('id');

  var username = user.login;
  var url = user.url
  // console.log(url);
  if (!url) return;
  request
      // .get('https://api.github.com/repos/lodash/lodash/contents/package.json?ref=master+json')
      // .get('https://api.github.com/search/code?q=aweber-api-nodejs+repo:darzuaga/biznobo')
      // when trying to the raw contents of the file so that we can analyze it, use this uri https://raw.githubusercontent.com/
      // instead of the api uri otherwise you wont be able to get the contents in a readable format.
      // .get('https://raw.githubusercontent.com/darzuaga/biznobo/master/src/services/aweber.js')
      // .get('https://api.github.com/repos/darzuaga/biznobo/contents/src/services/aweber.js')
      // .get(`https://raw.githubusercontent.com/darzuaga/biznobo/master/package.json?token=AA8QyBJC-QeWyaCiRsfPfLcbmmMmkVnhks5XErauwA%3D%3D`)
      .get(url)
      // .get(path)
      // .auth('darzuaga', 'lgs350h2')
      // .auth('Alex-Meneses', 'Gitter003')
      // .auth('Maurop123', 'Shoez,.117')
      .auth('sudopuppy-2', 'sudopuppy1')
      .send()
      .end((error, response) => {
        // console.log('responseBottom');
        // console.log(response.status);
        // if (error) console.log(error.status);
        if (response && response.status == 403) {
          console.log('-');
          console.log(id);
          response.body.profile = true;
          githubRef.child('last_checked').update({id: id, username: username})
          githubRef.child(username).update({status: response.status, proifle: true})
          return
        };
        console.log('+');
        // console.log(response.body)
        if (!response) return;
        response.body.profile = true;
        response.body.status = response.status;
        githubRef.child('last_checked').update({id: id, username: username})
        githubRef.child(username).update(response.body)
        if(response.body.email){
          console.log('hasEmail');
          console.log({email: response.body.email, username: username});
          githubEmailRef.child(username).update({email: response.body.email})
          return response.body;
        } else {
          return response.body;
        }



        // console.log(error);
        // console.log(response.body);
        // observer.next(response)
        // return response
      })
})

githubEmailRef.once('value', function(snapshot){
  console.log('Number of total emails collected');
  console.log(snapshot.numChildren());
})

// Node {
//   name: {
//     first:
//     last:
//   }
// }

// serviceMap {
//   v1: {
//     Person.name: {Node.Name}
//   },
//   v2: {
//     Node.name: Node.name
//   }
// }

// githubRef.once('value', function(snapshot){
//   console.log('Number of total profiles collected');
//   console.log(snapshot.numChildren());
// })

// THIS IS THE CALL TO COLLECT EMAILS.

Rx.Observable
.timer(1000, 1000)
// .take(3)
// .subscribe(function(response){
//   saveProfile.subscribe()
// })

// THIS IS THE CALL TO COLLECT EMAILS.

// saveProfile.subscribe(function(profile){
//   console.log('profile');
//   console.log(profile);
// })

var pageRequest = new Rx.Subject();

function getNextPath(){
  return Rx.Observable.create(function(observer){
    return githubRef.child('nextPath').once('value', function(pathSnapshot){
      console.log('pathSnapshot');
      console.log(pathSnapshot.val());
      observer.next(pathSnapshot.val()||null)
    })
  })
}

pageRequest
  .flatMap(function(nextPath){
    console.log('nextPath');
    console.log(nextPath);
    return getNextPath()
  })
  .flatMap(function(pageUrl){
    return getUsers(pageUrl)
  })
  .flatMap(function(response){
    var paths = response.links
    githubRef.update({nextPath: paths.next})
    pageRequest.next(paths.next)
    return Rx.Observable.of(response)
  })
  // .subscribe(function(response){
  //   // console.log(response.body);
  //   var users = response.body;
  //   console.log('numOfUsersInResult');
  //   console.log(users.length);
  //   users.map(function(user){
  //     console.log('GithubUser');
  //     console.log(user.login)
  //     user.profile = false;
  //     console.log(user);
  //     githubRef.child(user.login).update(user)
  //   })
  // })
  //
  // pageRequest.next()

function getUsers(params){
  return Rx.Observable.create(function(observer){
    var path = params ? params : 'https://api.github.com/users';
    console.log('path');
    console.log(path);

    request
        // .get('https://api.github.com/repos/lodash/lodash/contents/package.json?ref=master+json')
        // .get('https://api.github.com/search/code?q=aweber-api-nodejs+repo:darzuaga/biznobo')
        // when trying to the raw contents of the file so that we can analyze it, use this uri https://raw.githubusercontent.com/
        // instead of the api uri otherwise you wont be able to get the contents in a readable format.
        // .get('https://raw.githubusercontent.com/darzuaga/biznobo/master/src/services/aweber.js')
        // .get('https://api.github.com/repos/darzuaga/biznobo/contents/src/services/aweber.js')
        // .get(`https://raw.githubusercontent.com/darzuaga/biznobo/master/package.json?token=AA8QyBJC-QeWyaCiRsfPfLcbmmMmkVnhks5XErauwA%3D%3D`)
        // .get('https://api.github.com/users?since=135')
        .get(path)
        .auth('darzuaga', 'lgs350h2')
        // .auth('Alex-Meneses', 'Gitter003')
        // .auth('Maurop123', 'Shoez,.117')
        // .auth('sudopuppy-1', 'sudopuppy1')
        .send()
        .end((error, response) => {
          console.log('responseBottom');
          console.log(error);
          console.log(response.body);
          observer.next(response)
          // return response
        })
  })
}

// getUsers()
// .expand(function(response){
//   console.log('expand');
//   // console.log(response.links.next);
//   // console.log(response);
//   return Rx.Observable.of(response.links.next)
// })
// .take(3)
// .subscribe()
// function since(){
//
// }

// var initialPath = Rx.Observable.of({path: 'https://api.github.com/users'})
//
// function nextUsersPath(){
//   return getUsers().map(function(response){
//     console.log('since');
//     console.log(response.links.next);
//     return {path: response.links.next}
//   })
// }
//
// var paths = initialPath.merge(nextUsersPath())
// // .do(function(path){
// //   console.log('paths');
// //   console.log(path);
// //   getUsers(path)
// //   return path
// // })
//
// paths.map(function(response){
//   console.log('saveResponse');
//   console.log(response);
//   return response
//   // return response.links.next
// })

// since
// .subscribe(function(path){
//   console.log(path);
// })

// getUsers()
// .scan(function(acc, response, i){
//   console.log('i');
//   console.log(i);
//   // console.log('responseTop');
//   // console.log(response.body);
//   var path = response.links.next;
//   console.log('pathSubscribe');
//   console.log(path);
//   getUsers({path: path})
//   return {path: path}
// }, 'https://api.github.com/users')
// .subscribe()
  // var since;
  // var path = (response == 0) ? 'https://api.github.com/users' : since;
  //
  // return response
  // console.log('responseTopIndex');
  // console.log(index);
  // console.log('GithubResponse');
  // console.log(response.body);
  // var path = response.links.next
  // // console.log('path');
  // // console.log(path);
  // return path;
  // var users = response.body;
  // users.map(function(user){
  //   console.log('GithubUser');
  //   console.log(user.login)
  //   githubRef.child(user.login).update(user)
  // })

// .scan(function(x, y, i, source) {
//   console.log('x');
//   console.log(x);
//   console.log('y');
//   console.log(y);
//   console.log('i');
//   console.log(i);
//   console.log('source');
//   console.log(source);
//   return x + y
// }, 0).startWith(0).subscribe()



// getUsers()


      // // // (brushtail.tco(code));
      //
      //
      //
      // // var result = UglifyJS.parse(code);
      // // // (result);
      //
      // // var obj = {
      // //     _id: '{{objectId()}}',
      // //     index: '{{index()}}',
      // //
      // //     about: '{{lorem(1, "paragraphs")}}',
      // //
      // //     latitude: '{{floating(-90.000001, 90)}}',
      // //     longitude: '{{floating(-180.000001, 180)}}',
      // //     tags: [
      // //       '{{repeat(7)}}',
      // //       '{{lorem(1, "words")}}'
      // //     ],
      // //     friends: [
      // //       '{{repeat(3)}}',
      // //       {
      // //         id: '{{index()}}',
      // //         name: '{{firstName()}} {{surname()}}'
      // //       }
      // //     ]
      // //   }
      // // gol()
      //
      // // var tgt = dot.dot(obj);
      // //
      // // // (tgt);
      // //
      //
      //
      //
      // // var stackTrace = require('stack-trace');
      // // var trace = stackTrace.get();
      // // // (trace);
      // // // ('response');
      // // // (response.text);
      // // this function outpus all the imports and exports of a file as well as requires* i believe.
      //   // var result = depGraph(response.text, {
      //   //     includeBindings: true
      //   // });
      //   // // (result.imports);
      //   // var paths = traverse(result).forEach(function (x) {
      //   //   // ('x');
      //   //   // (x);
      //   //     if (x < 0) this.update(x + 128);
      //   // });
      //   //
      //   // gol(paths)
      //
      //   // gol(scour(result))
      //
      //   var tokens = [];
      //
      //   var ast = esprima.parse(response.text, {
      //     sourceType: 'module',
      //     // range: true,
      //     loc: true
      //   })
      //
      //   // // (recursive.simple());
      //   // // (Object.keys(acorn.plugins));
      //   var ast2 = acorn.parse(response.text, {
      //     sourceType: 'module',
      //     // range: true,
      //     locations: true
      //   })
      //
      //   // console.log('tokens');
      //   // console.log(tokens);
      //
      //   var map = escodegen.generate(ast, {
      //     sourceMap: true,
      //     sourceMapWithCode: true
      //   });
      //
      //   console.log(Object.keys(map.map));
      //
      //   // ('map');
      //   // // (map.code);
      //   // // (map.
      //   // var json = map.code.map.toString(); // Convert the map to its JSON representation
      //   // // (json);
      //
      //
      //   // // (ast2.body[6].specifiers['0'].local.name);
      //   // gol(ast2.body)
      //   // // (ast2.body[6].declarations);
      //   // // ('types');
      //   // // (Object.keys(types.builders));
      //
      //   // var globalScope = dfatool.newGlobalScope();
      //   // dfatool.buildScope(ast, globalScope);
      //   //
      //   // globalScope.initialize();
      //   // globalScope.derivation();
      //   // // (Object.keys(globalScope.derivation()));
      //
      //   estraverse.traverse(ast2, {
      //     enter: function(node){
      //       // // (node);
      //       //
      //       // // (recursive.recursive(node));
      //       // // (brushtail.mutateAST(ast, {
      //       //   fallback: 'iteration'
      //       // }));
      //       // var globalScope = dfatool.newGlobalScope();
      //       // dfatool.buildScope(ast, globalScope);
      //       //
      //       // globalScope.initialize();
      //       // globalScope.derivation();
      //
      //       var type = node.type;
      //       // // (type == 'ClassDeclaration');
      //       var sub = 'classDeclaration'
      //       if(type == 'ClassDeclaration'){
      //
      //         // // (Object.keys(node.body.scope._defines));
      //         // // (Object.keys(node.body.body));
      //
      //         // // ('scope');
      //         var scope = new types.NodePath(node);
      //         // // ('topScope');
      //         // // ('------------------------');
      //         node.body.body.map(function(scope3, index3){
      //           // // (node.body.body[index3].key.name);
      //         })
      //         // // ('------------------------');
      //         // // (Object.keys(scope.value.body.scope._defines));
      //         // // (Object.keys(scope.value.body.body));
      //         // // (scope.value.body.body['2'].key.name);
      //         // // ('bottom');
      //         // // ('------------------------');
      //         scope.value.body.body.map(function(scope2, index){
      //           // // (scope2);
      //           // // (scope.value.body.body[index].key.name);
      //         })
      //
      //         // // ('------------------------');
      //         // var loc = scope.value.loc;
      //         // var value = variable.inference( scope.offsetLoc(loc) );
      //         // // (Object.keys(scope.value.scope));
      //
      //
      //         // var variable = scope.value.scope.getDefine("userAweberPath");
      //         // // // (scope.value.scope.__proto__);
      //         //
      //         //
      //         // var outline = {};
      //         //
      //         // // Iterate all the defined variables and inference its value
      //         // for(var name in globalScope._defines){
      //         //     var variable = globalScope._defines[name];
      //         //     // // ('variable');
      //         //
      //         //     var value = variable.inference();
      //         //
      //         //     if( value ){
      //         //         // // (Object.keys(value));
      //         //         // // (value.ast);
      //         //         outline[variable.name] = value.toJSON();
      //         //     }
      //         // }
      //         // // (outline);
      //         // // (scope.value.scope);
      //
      //
      //         // if(node.declarations){
      //         //   types.getField(node.declarations[0].id)
      //         // }
      //
      //         // // ('node');
      //         // // (node.type);
      //         // // // (Object.keys(node.declarations));
      //         //
      //         // gol(node.declarations)
      //       }
      //     },
      //     leave: leave,
      //     fallback: 'iteration'
      //   });

        // gol()

        /// COOOOOOOOLL

        // var globalScope = dfatool.newGlobalScope();
        // dfatool.buildScope(ast, globalScope);
        //
        // globalScope.initialize();
        // globalScope.derivation();
        //
        // var outline = {};
        // // // ('keys');
        // // // (Object.keys(globalScope.children[0]));
        // // // ('obj');
        // // gol(globalScope.children[0].parent)
        // // Iterate all the defined variables and inference its value
        // for(var name in globalScope._defines){
        //     var variable = globalScope._defines[name];
        //     var value = variable.inference();
        //     if( value ){
        //         outline[variable.name] = value.toJSON();
        //     }
        // }

        // // (outline);

        // gol(ast)
        //
        // gol(dot.dot(ast))
        //


        // var ast = recast.parse(response.text);
        // gol(ast)



        // response.body.map(function(repo){
        //     // (repo);
        // })
        //
        // // (Object.keys(response));
        // response.body.items.map(function(item){// (item.url)})



        // // (util.inspect(response, false, null));
        // // (util.inspect(response.body.filter(function(repo){return repo.name == 'package.json'}), false, null));

    // })
//
//     version: 2,
//     resource: 'campaigns',
//     endpoint: 'create',
//     path: path,
//     params: query,
//
//
//     Services.[req.service][req.body.endpoint](req.body)
//     .subscribe(response => {
//       // // ('serverResponse');
//       // // (response);
//       res.json(response)
//     })
//
// var Router = {};
//
// // global api index/router
//
// Router.request = function(payload){
//
//     let { version, resource, endpoint, path, uid, body } = payload;
//
//     return Observable.create(observer => {
//         superagent
//             [method](`https://api.getresponse.com/v3/${url}`)
//             .auth('darzuaga', 'lgs350h2')
//             .send(body)
//             .end((error, response) => {
//                 if(error) {
//                     // ('error');
//                     observer.onNext(error)
//                 } else {
//                     // ('response');
//                     observer.onNext(response.body)
//                 }
//             })
//     })
// }
//
//
//
//
// // request from consumer
//
// var Consumer = {};
//
// Consumer.get = function(){
//
//     let payload = {
//         version: 1,
//         resource: 'getresponse',
//         endpoint: "newCampaign",
//         path: 'https://biznobo.com/api/1getresponsenewCampaign',
//         method: 'get',
//         params: {
//
//         }
//     }
//
//     request
//      .post(`https://biznobo.com/api/1getresponsenewCampaign`)
//      .send(payload)
//      .end((err, res) => {
//          if(err) {
//              // ('err');
//              // (err);
//          } else {
//              // ('res');
//              // (res);
//          }
//      })
// }
//
// // producer handler - > here is where the api call gets handled
// var Producer = {};
// Producer.newCampaign = function(payload){
//     let { version, resource, endpoint, path, body, uid } = payload;
//     let time = moment().unix();
//
//     let payload = {
//         method: 'post',
//         body: {
//
//             name: `danny_${time}`,
//             optinTypes: {
//                 email: 'single',
//                 import: 'single',
//                 api: 'single',
//                 webform: 'single'
//             }
//
//         }
//     }
//
//     return this.request('campaigns', payload, data)
//     .map( res => {
//         let campaignId = res.campaignId;
//         payload.response = res;
//         payload.path = `${serviceRef.toString()}/${uid}/services/getresponse/campaigns/${campaignId}`
//         serviceRef.child(`${uid}/services/getresponse/campaigns/${campaignId}`).update(payload)
//         return payload
//     })
// },
//
//
// // producer response -> comes with a service map of how to find the data he was requesting
//
// let serviceMap = {
//     'getresponse': {
//         'campaignId': 'key', // GetResponse:on the service
//         'path': 'path', // GetResponse:email to this resource on firebase
//         'title': 'response.campaignId', // GetResponse:the name our users give this campaign
//         'campaignName': 'response.campaignId', // GetResponse:the name our users give this campaign
//         'folder_id': 'response.campaignId' // GetResponse:the name our users give this campaign
//     },
//     'mailchimp': {
//         'campaignId': 'key', // GetResponse:on the service
//         'path': 'path', // GetResponse:email to this resource on firebase
//         'title': 'params.name', // GetResponse:the name our users give this campaign
//         'campaignName': 'params.name', // GetResponse:the name our users give this campaign
//         'folder_id': 'mailchimp.folder_id' // GetResponse:the name our users give this campaign
//     }
// }
//
// // consumer handler
