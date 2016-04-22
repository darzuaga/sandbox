var Firebase = require('firebase')
var util = require('util')
var Rx = require('rxjs')
var Observable = Rx.Observable;

var apiIndex = new Firebase('https://biznobo-sandbox.firebaseio.com/') // like the nasdaq this is our index of the api's in the world
var API_ID = 1;


var names = {
   '1': 'daniel',
   '2': 'alex'
}

var users = {

   '1': {
      // here we can imaine that instead of the name daniel being hardcoded it could point to an address/path of where the value of name could be found. that way when you update the api you can change the route of where that output for this version can be found.
      'name': names['1']
   },

   '2': {
      // this address can change since now we've made it dynamic. we've told the api for this version this is where you can find the value of this path. the key and the value should be dynamic pointers not static
      'name': names['2']
   }

}

var cars = {
   '1': {
      'make': 'ford',
      'model': 'f-150'
   },
   '2': {
      'make': 'toyota',
      'model': 'camry'
   }
}

var API = {

   '1': {

      'userById': function(){
         return users;
      },

      'user:id': function(id){
         return users[id]
      }

   },

   '2': {

      'new': function(){
         return {};
      },

      'cars:id': function(payload){
         return cars[id];
      }

   }

}

// this is how the data needs to look inside of biznobo for us to have the service, the key, and the endpoints mapped out
var GRAPH = {

   '1': {
      // the indexes here specify version numbers
      '1': {
         // 'users': 'users', // what it used to be, so that you can see the history of how the api changed
         'users': 'userById',
         "user:id": "user:id"
      },

      '2': {
         'userById': 'userById',
         "user:id": "user:id"
      }

   },

   '2': {

      '1': {
         'new': 'new',
         "cars:id": "cars:id"
      }

   }

}

var biznobo = {
   'get': function(payload){
      var _p = payload;
      // console.log('payload');
      // console.log(_p);
      var service = _p.id;
      // console.log('service');
      // console.log(service);
      var version = _p.version;
      // console.log('version');
      // console.log(version);
      var endpoint = _p.endpoint;
      // console.log('endpoint');
      // console.log(endpoint);
      var body = _p.body;



      var path = GRAPH[service][version][endpoint];
      // console.log('path');
      // console.log(path);
      return API[service][path](body);

   }
}

var client_1 = {

   'id': '1', // API ID IN THE GRAPH
   'version': 1,
   'endpoint': 'users',
   'body': {}
}

var client_2 = {
   'id': '1',
   'version': 2,
   'endpoint': 'userById',
   'body': {}
}

var client_3 = {
   'id': '2',
   'version': 1,
   'endpoint': 'new',
   'body': {}
}

var response_1 = biznobo.get(client_1)
console.log('response_1');
console.log(response_1);

var response_2 = biznobo.get(client_2)
console.log('response_2');
console.log(response_2);

var response_3 = biznobo.get(client_3)
console.log('response_3');
console.log(response_3);
