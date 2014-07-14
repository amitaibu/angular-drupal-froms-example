"use strict";angular.module("angularDrupalFormsExampleApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","xeditable"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]).run(["editableOptions",function(a){a.theme="bs3"}]),angular.module("angularDrupalFormsExampleApp").controller("MainCtrl",["$scope","DrupalAuthenticate","Articlesresource","$log",function(a,b,c){a.authenticationData={backendUrl:"http://dev-gizra-headless-drupal-inline-edit.gotpantheon.com",name:"demo",pass:"1234"},a.authenticated=!1,a.post={label:"Some title (longer than 2 chars)",body:"The body, with Gizra (try removing it...)"},a.serverSideErrors={},a.submitAuthenticationForm=function(){b.authenticate(a.authenticationData).then(function(){a.authenticated=!0})},a.createArticle=function(b){c.createArticle(b).success(function(b){a.post=b,a.errors=null}).error(function(b){a.errors=b.errors})},a.updateArticle=function(b,d){var e={};return e[d]=b,c.updateArticle(e,a.post.id).success(function(b){a.post=b,a.errors=null}).error(function(b){a.errors=b.errors})}}]),angular.module("angularDrupalFormsExampleApp").service("DrupalAuthenticate",["$q","$http",function(a,b){var c={backendUrl:null,token:null},d={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=d._utf8_encode(a);k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return j},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}};return{authenticate:function(c){var e=a.defer(),f=this,g=c.backendUrl;return this.setBackendUrl(g),b({method:"get",url:g+"/api/login-token",headers:{Authorization:"Basic "+d.encode(c.name+":"+c.pass)}}).success(function(a){f.setToken(a.access_token),e.resolve(a.access_token)}).error(function(){e.reject("Wrong backend url, or credentails")}),e.promise},getBackendUrl:function(){return c.backendUrl},setBackendUrl:function(a){c.backendUrl=a},getToken:function(){return c.token},setToken:function(a){c.token=a}}}]),angular.module("angularDrupalFormsExampleApp").directive("inlineEditArticle",["$log",function(){return{templateUrl:"scripts/directives/inlineEditArticle/index.html",restrict:"E",scope:{post:"=post",errors:"=errors",onSubmit:"=onSubmit"},link:function(a){a.$watch("post.body",function(){a.post.body=String(a.post.body).replace(/<[^>]+>/gm,"")}),a.updateArticle=function(b,c){return a.onSubmit(b,c)}}}}]),angular.module("angularDrupalFormsExampleApp").directive("quickPostArticle",["$log",function(){return{templateUrl:"scripts/directives/quickPostArticle/index.html",restrict:"E",scope:{post:"=post",errors:"=errors",onSubmit:"=onSubmit"},link:function(a){a.submitForm=function(){a.onSubmit(a.post)}}}}]),angular.module("angularDrupalFormsExampleApp").service("Articlesresource",["DrupalAuthenticate","$http",function(a,b){return{createArticle:function(c){var d={headers:{"X-Restful-Minor-Version":5,"X-Access-Token":a.getToken()}},e=a.getBackendUrl()+"/api/v1/articles";return b.post(e,$.param(c),d)},updateArticle:function(c,d){var e={headers:{"X-Restful-Minor-Version":5,"X-Access-Token":a.getToken()}},f=a.getBackendUrl()+"/api/v1/articles/"+d;return b({method:"patch",url:f,headers:e.headers,data:$.param(c)})}}}]);