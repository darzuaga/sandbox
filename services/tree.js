var resolveDeps = require('snyk-resolve-deps');
var asTree = require('snyk-tree');
var util = require('util')
var madge = require('madge');
var depGraph = require('es-dependency-graph');
// var dependencyObject = madge('./');



function gol(obj, utils){
  if(!utils) {
    console.log(util.inspect(obj, false, null));
    return
  } else {
    console.log(obj);
    return
  }
}




// log(dependencyObject.dot(), true);
// gol(dependencyObject.obj(), true)

// this right here gets the dependences given a whole node package
// resolveDeps(process.cwd(), { dev: true, json: true }).then(function (tree) {
// resolveDeps(process.cwd(), { dev: true }).then(function (tree) {
//   gol(Object.keys(tree.dependencies), true)
//
// }).catch(function (error) {
//   // error is usually limited to unknown directory
//   // console.log(error.stack);
//   process.exit(1);
// });
