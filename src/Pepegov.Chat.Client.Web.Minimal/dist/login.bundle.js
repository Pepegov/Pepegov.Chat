(self.webpackChunkpepegov_chat_client_web_minimal=self.webpackChunkpepegov_chat_client_web_minimal||[]).push([[966,722,961,776],{768:(t,e,n)=>{"use strict";n.r(e)},56:(t,e,n)=>{"use strict";n.r(e)},600:(t,e,n)=>{"use strict";n.r(e)},623:function(t){"undefined"!=typeof self&&self,t.exports=function(){"use strict";var t={407:function(t,e,n){n.d(e,{default:function(){return I}});var r=/([:*])(\w+)/g,o=/\*/g,i=/\/\?/g;function a(t){return void 0===t&&(t="/"),v()?location.pathname+location.search+location.hash:t}function c(t){return t.replace(/\/+$/,"").replace(/^\/+/,"")}function s(t){return"string"==typeof t}function u(t){return t&&t.indexOf("#")>=0&&t.split("#").pop()||""}function l(t){var e=c(t).split(/\?(.*)?$/);return[c(e[0]),e.slice(1).join("")]}function f(t){for(var e={},n=t.split("&"),r=0;r<n.length;r++){var o=n[r].split("=");if(""!==o[0]){var i=decodeURIComponent(o[0]);e[i]?(Array.isArray(e[i])||(e[i]=[e[i]]),e[i].push(decodeURIComponent(o[1]||""))):e[i]=decodeURIComponent(o[1]||"")}}return e}function h(t,e){var n,a=l(c(t.currentLocationPath)),h=a[0],p=a[1],d=""===p?null:f(p),v=[];if(s(e.path)){if(n="(?:/^|^)"+c(e.path).replace(r,(function(t,e,n){return v.push(n),"([^/]+)"})).replace(o,"?(?:.*)").replace(i,"/?([^/]+|)")+"$",""===c(e.path)&&""===c(h))return{url:h,queryString:p,hashString:u(t.to),route:e,data:null,params:d}}else n=e.path;var y=new RegExp(n,""),g=h.match(y);if(g){var m=s(e.path)?function(t,e){return 0===e.length?null:t?t.slice(1,t.length).reduce((function(t,n,r){return null===t&&(t={}),t[e[r]]=decodeURIComponent(n),t}),null):null}(g,v):g.groups?g.groups:g.slice(1);return{url:c(h.replace(new RegExp("^"+t.instance.root),"")),queryString:p,hashString:u(t.to),route:e,data:m,params:d}}return!1}function p(){return!("undefined"==typeof window||!window.history||!window.history.pushState)}function d(t,e){return void 0===t[e]||!0===t[e]}function v(){return"undefined"!=typeof window}function y(t,e){return void 0===t&&(t=[]),void 0===e&&(e={}),t.filter((function(t){return t})).forEach((function(t){["before","after","already","leave"].forEach((function(n){t[n]&&(e[n]||(e[n]=[]),e[n].push(t[n]))}))})),e}function g(t,e,n){var r=e||{},o=0;!function e(){t[o]?Array.isArray(t[o])?(t.splice.apply(t,[o,1].concat(t[o][0](r)?t[o][1]:t[o][2])),e()):t[o](r,(function(t){void 0===t||!0===t?(o+=1,e()):n&&n(r)})):n&&n(r)}()}function m(t,e){void 0===t.currentLocationPath&&(t.currentLocationPath=t.to=a(t.instance.root)),t.currentLocationPath=t.instance._checkForAHash(t.currentLocationPath),e()}function b(t,e){for(var n=0;n<t.instance.routes.length;n++){var r=h(t,t.instance.routes[n]);if(r&&(t.matches||(t.matches=[]),t.matches.push(r),"ONE"===t.resolveOptions.strategy))return void e()}e()}function w(t,e){t.navigateOptions&&(void 0!==t.navigateOptions.shouldResolve&&console.warn('"shouldResolve" is deprecated. Please check the documentation.'),void 0!==t.navigateOptions.silent&&console.warn('"silent" is deprecated. Please check the documentation.')),e()}function _(t,e){!0===t.navigateOptions.force?(t.instance._setCurrent([t.instance._pathToMatchObject(t.to)]),e(!1)):e()}g.if=function(t,e,n){return Array.isArray(e)||(e=[e]),Array.isArray(n)||(n=[n]),[t,e,n]};var k=v(),O=p();function S(t,e){if(d(t.navigateOptions,"updateBrowserURL")){var n=("/"+t.to).replace(/\/\//g,"/"),r=k&&t.resolveOptions&&!0===t.resolveOptions.hash;O?(history[t.navigateOptions.historyAPIMethod||"pushState"](t.navigateOptions.stateObj||{},t.navigateOptions.title||"",r?"#"+n:n),location&&location.hash&&(t.instance.__freezeListening=!0,setTimeout((function(){if(!r){var e=location.hash;location.hash="",location.hash=e}t.instance.__freezeListening=!1}),1))):k&&(window.location.href=t.to)}e()}function P(t,e){var n=t.instance;n.lastResolved()?g(n.lastResolved().map((function(e){return function(n,r){if(e.route.hooks&&e.route.hooks.leave){var o,i=t.instance.matchLocation(e.route.path,t.currentLocationPath,!1);o="*"!==e.route.path?!i:!(t.matches&&t.matches.find((function(t){return e.route.path===t.route.path}))),d(t.navigateOptions,"callHooks")&&o?g(e.route.hooks.leave.map((function(e){return function(n,r){return e((function(e){!1===e?t.instance.__markAsClean(t):r()}),t.matches&&t.matches.length>0?1===t.matches.length?t.matches[0]:t.matches:void 0)}})).concat([function(){return r()}])):r()}else r()}})),{},(function(){return e()})):e()}function x(t,e){d(t.navigateOptions,"updateState")&&t.instance._setCurrent(t.matches),e()}var L=[function(t,e){var n=t.instance.lastResolved();if(n&&n[0]&&n[0].route===t.match.route&&n[0].url===t.match.url&&n[0].queryString===t.match.queryString)return n.forEach((function(e){e.route.hooks&&e.route.hooks.already&&d(t.navigateOptions,"callHooks")&&e.route.hooks.already.forEach((function(e){return e(t.match)}))})),void e(!1);e()},function(t,e){t.match.route.hooks&&t.match.route.hooks.before&&d(t.navigateOptions,"callHooks")?g(t.match.route.hooks.before.map((function(e){return function(n,r){return e((function(e){!1===e?t.instance.__markAsClean(t):r()}),t.match)}})).concat([function(){return e()}])):e()},function(t,e){d(t.navigateOptions,"callHandler")&&t.match.route.handler(t.match),t.instance.updatePageLinks(),e()},function(t,e){t.match.route.hooks&&t.match.route.hooks.after&&d(t.navigateOptions,"callHooks")&&t.match.route.hooks.after.forEach((function(e){return e(t.match)})),e()}],C=[P,function(t,e){var n=t.instance._notFoundRoute;if(n){t.notFoundHandled=!0;var r=l(t.currentLocationPath),o=r[0],i=r[1],a=u(t.to);n.path=c(o);var s={url:n.path,queryString:i,hashString:a,data:null,route:n,params:""!==i?f(i):null};t.matches=[s],t.match=s}e()},g.if((function(t){return t.notFoundHandled}),L.concat([x]),[function(t,e){t.resolveOptions&&!1!==t.resolveOptions.noMatchWarning&&void 0!==t.resolveOptions.noMatchWarning||console.warn('Navigo: "'+t.currentLocationPath+"\" didn't match any of the registered routes."),e()},function(t,e){t.instance._setCurrent(null),e()}])];function T(){return(T=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function E(t,e){var n=0;P(t,(function r(){n!==t.matches.length?g(L,T({},t,{match:t.matches[n]}),(function(){n+=1,r()})):x(t,e)}))}function j(t){t.instance.__markAsClean(t)}function A(){return(A=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}var R="[data-navigo]";function I(t,e){var n,r=e||{strategy:"ONE",hash:!1,noMatchWarning:!1,linksSelector:R},o=this,i="/",d=null,k=[],O=!1,P=p(),x=v();function L(t){return t.indexOf("#")>=0&&(t=!0===r.hash?t.split("#")[1]||"/":t.split("#")[0]),t}function T(t){return c(i+"/"+c(t))}function I(t,e,n,r){return t=s(t)?T(t):t,{name:r||c(String(t)),path:t,handler:e,hooks:y(n)}}function H(t,e){if(!o.__dirty){o.__dirty=!0,t=t?c(i)+"/"+c(t):void 0;var n={instance:o,to:t,currentLocationPath:t,navigateOptions:{},resolveOptions:A({},r,e)};return g([m,b,g.if((function(t){var e=t.matches;return e&&e.length>0}),E,C)],n,j),!!n.matches&&n.matches}o.__waiting.push((function(){return o.resolve(t,e)}))}function M(t,e){if(o.__dirty)o.__waiting.push((function(){return o.navigate(t,e)}));else{o.__dirty=!0,t=c(i)+"/"+c(t);var n={instance:o,to:t,navigateOptions:e||{},resolveOptions:e&&e.resolveOptions?e.resolveOptions:r,currentLocationPath:L(t)};g([w,_,b,g.if((function(t){var e=t.matches;return e&&e.length>0}),E,C),S,j],n,j)}}function U(){if(x)return(x?[].slice.call(document.querySelectorAll(r.linksSelector||R)):[]).forEach((function(t){"false"!==t.getAttribute("data-navigo")&&"_blank"!==t.getAttribute("target")?t.hasListenerAttached||(t.hasListenerAttached=!0,t.navigoHandler=function(e){if((e.ctrlKey||e.metaKey)&&"a"===e.target.tagName.toLowerCase())return!1;var n=t.getAttribute("href");if(null==n)return!1;if(n.match(/^(http|https)/)&&"undefined"!=typeof URL)try{var r=new URL(n);n=r.pathname+r.search}catch(t){}var i=function(t){if(!t)return{};var e,n=t.split(","),r={};return n.forEach((function(t){var n=t.split(":").map((function(t){return t.replace(/(^ +| +$)/g,"")}));switch(n[0]){case"historyAPIMethod":r.historyAPIMethod=n[1];break;case"resolveOptionsStrategy":e||(e={}),e.strategy=n[1];break;case"resolveOptionsHash":e||(e={}),e.hash="true"===n[1];break;case"updateBrowserURL":case"callHandler":case"updateState":case"force":r[n[0]]="true"===n[1]}})),e&&(r.resolveOptions=e),r}(t.getAttribute("data-navigo-options"));O||(e.preventDefault(),e.stopPropagation(),o.navigate(c(n),i))},t.addEventListener("click",t.navigoHandler)):t.hasListenerAttached&&t.removeEventListener("click",t.navigoHandler)})),o}function F(t,e,n){var r=k.find((function(e){return e.name===t})),o=null;if(r){if(o=r.path,e)for(var a in e)o=o.replace(":"+a,e[a]);o=o.match(/^\//)?o:"/"+o}return o&&n&&!n.includeRoot&&(o=o.replace(new RegExp("^/"+i),"")),o}function G(t){var e=l(c(t)),r=e[0],o=e[1],i=""===o?null:f(o);return{url:r,queryString:o,hashString:u(t),route:I(r,(function(){}),[n],r),data:null,params:i}}function z(t,e,n){return"string"==typeof e&&(e=D(e)),e?(e.hooks[t]||(e.hooks[t]=[]),e.hooks[t].push(n),function(){e.hooks[t]=e.hooks[t].filter((function(t){return t!==n}))}):(console.warn("Route doesn't exists: "+e),function(){})}function D(t){return"string"==typeof t?k.find((function(e){return e.name===T(t)})):k.find((function(e){return e.handler===t}))}t?i=c(t):console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.'),this.root=i,this.routes=k,this.destroyed=O,this.current=d,this.__freezeListening=!1,this.__waiting=[],this.__dirty=!1,this.__markAsClean=function(t){t.instance.__dirty=!1,t.instance.__waiting.length>0&&t.instance.__waiting.shift()()},this.on=function(t,e,r){var o=this;return"object"!=typeof t||t instanceof RegExp?("function"==typeof t&&(r=e,e=t,t=i),k.push(I(t,e,[n,r])),this):(Object.keys(t).forEach((function(e){if("function"==typeof t[e])o.on(e,t[e]);else{var r=t[e],i=r.uses,a=r.as,c=r.hooks;k.push(I(e,i,[n,c],a))}})),this)},this.off=function(t){return this.routes=k=k.filter((function(e){return s(t)?c(e.path)!==c(t):"function"==typeof t?t!==e.handler:String(e.path)!==String(t)})),this},this.resolve=H,this.navigate=M,this.navigateByName=function(t,e,n){var r=F(t,e);return null!==r&&(M(r.replace(new RegExp("^/?"+i),""),n),!0)},this.destroy=function(){this.routes=k=[],P&&window.removeEventListener("popstate",this.__popstateListener),this.destroyed=O=!0},this.notFound=function(t,e){return o._notFoundRoute=I("*",t,[n,e],"__NOT_FOUND__"),this},this.updatePageLinks=U,this.link=function(t){return"/"+i+"/"+c(t)},this.hooks=function(t){return n=t,this},this.extractGETParameters=function(t){return l(L(t))},this.lastResolved=function(){return d},this.generate=F,this.getLinkPath=function(t){return t.getAttribute("href")},this.match=function(t){var e={instance:o,currentLocationPath:t,to:t,navigateOptions:{},resolveOptions:r};return b(e,(function(){})),!!e.matches&&e.matches},this.matchLocation=function(t,e,n){void 0===e||void 0!==n&&!n||(e=T(e));var r={instance:o,to:e,currentLocationPath:e};return m(r,(function(){})),"string"==typeof t&&(t=void 0===n||n?T(t):t),h(r,{name:String(t),path:t,handler:function(){},hooks:{}})||!1},this.getCurrentLocation=function(){return G(c(a(i)).replace(new RegExp("^"+i),""))},this.addBeforeHook=z.bind(this,"before"),this.addAfterHook=z.bind(this,"after"),this.addAlreadyHook=z.bind(this,"already"),this.addLeaveHook=z.bind(this,"leave"),this.getRoute=D,this._pathToMatchObject=G,this._clean=c,this._checkForAHash=L,this._setCurrent=function(t){return d=o.current=t},function(){P&&(this.__popstateListener=function(){o.__freezeListening||H()},window.addEventListener("popstate",this.__popstateListener))}.call(this),U.call(this)}}},e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={exports:{}};return t[r](o,o.exports,n),o.exports}return n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n(407)}().default},938:function(t,e){"use strict";var n=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((r=r.apply(t,e||[])).next())}))},r=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,r=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};Object.defineProperty(e,"__esModule",{value:!0}),e.bootstrap=function(t){return n(this,void 0,void 0,(function(){var e,n,o,i;return r(this,(function(r){switch(r.label){case 0:e=new t,r.label=1;case 1:return r.trys.push([1,6,,7]),[4,fetch(e.templateUrl)];case 2:return n=r.sent(),o=document.getElementById(e.selector),[4,n.text()];case 3:return o.innerHTML=r.sent(),"OnLoad"in e?[4,e.OnLoad()]:[3,5];case 4:r.sent(),r.label=5;case 5:return[3,7];case 6:return i=r.sent(),[2,console.warn("Something went wrong: ",i)];case 7:return[2]}}))}))}},371:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Component=function(t){return function(e){e.prototype.selector=t.selector,e.prototype.templateUrl=t.templateUrl}}},403:function(t,e,n){"use strict";var r=this&&this.__esDecorate||function(t,e,n,r,o,i){function a(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var c,s=r.kind,u="getter"===s?"get":"setter"===s?"set":"value",l=!e&&t?r.static?t:t.prototype:null,f=e||(l?Object.getOwnPropertyDescriptor(l,r.name):{}),h=!1,p=n.length-1;p>=0;p--){var d={};for(var v in r)d[v]="access"===v?{}:r[v];for(var v in r.access)d.access[v]=r.access[v];d.addInitializer=function(t){if(h)throw new TypeError("Cannot add initializers after decoration has completed");i.push(a(t||null))};var y=(0,n[p])("accessor"===s?{get:f.get,set:f.set}:f[u],d);if("accessor"===s){if(void 0===y)continue;if(null===y||"object"!=typeof y)throw new TypeError("Object expected");(c=a(y.get))&&(f.get=c),(c=a(y.set))&&(f.set=c),(c=a(y.init))&&o.unshift(c)}else(c=a(y))&&("field"===s?o.unshift(c):f[u]=c)}l&&Object.defineProperty(l,r.name,f),h=!0},o=this&&this.__runInitializers||function(t,e,n){for(var r=arguments.length>2,o=0;o<e.length;o++)n=r?e[o].call(t,n):e[o].call(t);return r?n:void 0},i=this&&this.__setFunctionName||function(t,e,n){return"symbol"==typeof e&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:n?"".concat(n," ",e):e})};Object.defineProperty(e,"__esModule",{value:!0}),e.ToolbarComponent=void 0,n(768);var a,c,s,u,l,f=n(371),h=(u=[(0,f.Component)({selector:"toolbar",templateUrl:"./toolbar.component.html"})],l=[],i(c=function(){},"ToolbarComponent"),s="function"==typeof Symbol&&Symbol.metadata?Object.create(null):void 0,r(null,a={value:c},u,{kind:"class",name:c.name,metadata:s},null,l),c=a.value,s&&Object.defineProperty(c,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:s}),o(c,l),c);e.ToolbarComponent=h},761:function(t,e){"use strict";var n=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((r=r.apply(t,e||[])).next())}))},r=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,r=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}};Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t){this.accessTokenFactory=t}return t.prototype.GetAsync=function(t){return n(this,void 0,void 0,(function(){var e;return r(this,(function(n){switch(n.label){case 0:return e={},this.accessTokenFactory&&(e={Authorization:"Bearer ".concat(this.accessTokenFactory())}),[4,fetch(t,{method:"GET",headers:e})];case 1:return[4,n.sent().json()];case 2:return[2,n.sent()]}}))}))},t}();e.default=o},377:function(t,e,n){"use strict";var r=this&&this.__esDecorate||function(t,e,n,r,o,i){function a(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var c,s=r.kind,u="getter"===s?"get":"setter"===s?"set":"value",l=!e&&t?r.static?t:t.prototype:null,f=e||(l?Object.getOwnPropertyDescriptor(l,r.name):{}),h=!1,p=n.length-1;p>=0;p--){var d={};for(var v in r)d[v]="access"===v?{}:r[v];for(var v in r.access)d.access[v]=r.access[v];d.addInitializer=function(t){if(h)throw new TypeError("Cannot add initializers after decoration has completed");i.push(a(t||null))};var y=(0,n[p])("accessor"===s?{get:f.get,set:f.set}:f[u],d);if("accessor"===s){if(void 0===y)continue;if(null===y||"object"!=typeof y)throw new TypeError("Object expected");(c=a(y.get))&&(f.get=c),(c=a(y.set))&&(f.set=c),(c=a(y.init))&&o.unshift(c)}else(c=a(y))&&("field"===s?o.unshift(c):f[u]=c)}l&&Object.defineProperty(l,r.name,f),h=!0},o=this&&this.__runInitializers||function(t,e,n){for(var r=arguments.length>2,o=0;o<e.length;o++)n=r?e[o].call(t,n):e[o].call(t);return r?n:void 0},i=this&&this.__setFunctionName||function(t,e,n){return"symbol"==typeof e&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:n?"".concat(n," ",e):e})};Object.defineProperty(e,"__esModule",{value:!0}),e.LobbyPageComponent=void 0,n(56);var a,c,s,u,l,f=n(371),h=n(28),p=(u=[(0,f.Component)({selector:"app",templateUrl:"./lobby.component.html"})],l=[],c=function(){function t(){this.chatHubService=new h.ChatHubService}return t.prototype.OnLoad=function(){var t=this;this.chatHubService.GetRooms(0,20).then((function(e){var n,r,o;if(!e.isSuccessful){var i=null===(n=e.exceptions)||void 0===n?void 0:n.map((function(t,e){return"ERROR"+e+": source "+t.source+" message "+t.message}));console.log(null==i?void 0:i.join("\n"))}(null===(r=e.message)||void 0===r?void 0:r.items)&&t.addToTable(null===(o=e.message)||void 0===o?void 0:o.items)}))},t.prototype.addToTable=function(t){var e=this,n=document.querySelector("#lobby-table-body");t.forEach((function(t){var r=e.createTableRow(t);null==n||n.appendChild(r)}))},t.prototype.createTableRow=function(t){var e=document.createElement("tr");return e.innerHTML="\n                <td>".concat(t.id,"</td>\n                <td>").concat(t.memberCount,"</td>\n                <td>").concat(t.name,"</td>\n                <td>").concat(t.owner,'</td>\n                <td><a href="/room?id=').concat(t.id,'" class="join">Login</a></td>\n            '),e},t}(),i(c,"LobbyPageComponent"),s="function"==typeof Symbol&&Symbol.metadata?Object.create(null):void 0,r(null,a={value:c},u,{kind:"class",name:c.name,metadata:s},null,l),c=a.value,s&&Object.defineProperty(c,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:s}),o(c,l),c);e.LobbyPageComponent=p},889:function(t,e,n){"use strict";var r=this&&this.__esDecorate||function(t,e,n,r,o,i){function a(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var c,s=r.kind,u="getter"===s?"get":"setter"===s?"set":"value",l=!e&&t?r.static?t:t.prototype:null,f=e||(l?Object.getOwnPropertyDescriptor(l,r.name):{}),h=!1,p=n.length-1;p>=0;p--){var d={};for(var v in r)d[v]="access"===v?{}:r[v];for(var v in r.access)d.access[v]=r.access[v];d.addInitializer=function(t){if(h)throw new TypeError("Cannot add initializers after decoration has completed");i.push(a(t||null))};var y=(0,n[p])("accessor"===s?{get:f.get,set:f.set}:f[u],d);if("accessor"===s){if(void 0===y)continue;if(null===y||"object"!=typeof y)throw new TypeError("Object expected");(c=a(y.get))&&(f.get=c),(c=a(y.set))&&(f.set=c),(c=a(y.init))&&o.unshift(c)}else(c=a(y))&&("field"===s?o.unshift(c):f[u]=c)}l&&Object.defineProperty(l,r.name,f),h=!0},o=this&&this.__runInitializers||function(t,e,n){for(var r=arguments.length>2,o=0;o<e.length;o++)n=r?e[o].call(t,n):e[o].call(t);return r?n:void 0},i=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((r=r.apply(t,e||[])).next())}))},a=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,r=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}},c=this&&this.__setFunctionName||function(t,e,n){return"symbol"==typeof e&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:n?"".concat(n," ",e):e})};Object.defineProperty(e,"__esModule",{value:!0}),e.LoginPageComponent=void 0,n(600);var s,u,l,f,h,p=n(653),d=n(371),v=n(59),y=(f=[(0,d.Component)({selector:"app",templateUrl:"./login.component.html"})],h=[],u=function(){function t(){this.openIdService=new p.SimpleOpenIdService}return t.prototype.OnLoad=function(){return i(this,void 0,void 0,(function(){var t=this;return a(this,(function(e){return document.querySelector("#login_form").addEventListener("submit",(function(e){e.preventDefault();var n=document.querySelector("#username_input"),r=document.querySelector("#password_input");t.openIdService.ResourceOwnerPasswordAuth(n.value,r.value,["openid","offline_access"]).then((function(){t.redirectTobBackUrl()}))})),[2]}))}))},t.prototype.redirectTobBackUrl=function(){var t=(0,v.getCurrentQueryParams)().get("redirect_uri");window.location.href=t||"/"},t}(),c(u,"LoginPageComponent"),l="function"==typeof Symbol&&Symbol.metadata?Object.create(null):void 0,r(null,s={value:u},f,{kind:"class",name:u.name,metadata:l},null,h),u=s.value,l&&Object.defineProperty(u,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:l}),o(u,h),u);e.LoginPageComponent=y},407:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){return fetch("./app/notFound/notFound.component.html").then((function(t){return t.text()})).then((function(t){document.getElementById("app").innerHTML=t})).catch((function(t){return console.warn("Something went wrong.",t)}))}},59:function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((r=r.apply(t,e||[])).next())}))},o=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,r=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}},i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.getCurrentQueryParams=function(){var t=window.location.search;return new URLSearchParams(t)};var a=i(n(623)),c=n(403),s=n(377),u=n(889),l=i(n(407)),f=n(938),h=new a.default("/");function p(t){return r(this,void 0,void 0,(function(){return o(this,(function(e){return document.addEventListener("DOMContentLoaded",(function(){(0,f.bootstrap)(t)})),[2]}))}))}console.log(c.ToolbarComponent),p(c.ToolbarComponent),h.on({"/":function(){return p(s.LobbyPageComponent)},"/login":function(){return p(u.LoginPageComponent)}}).notFound((function(){return(0,l.default)()})),e.default=h},28:function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((r=r.apply(t,e||[])).next())}))},o=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,r=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}},i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.ChatHubService=void 0;var a=n(653),c=i(n(761)),s=function(){function t(){var t=this;this.baseUrl="https://api.chat.pepegov.ru/api/",this.openIdService=new a.SimpleOpenIdService,this.httpClient=new c.default((function(){return t.openIdService.GetAccessTokenOnStorage()}))}return t.prototype.GetRooms=function(t,e){return r(this,void 0,void 0,(function(){var n;return o(this,(function(r){switch(r.label){case 0:return n=this.baseUrl+"room/get-paged?pageIndex="+t+"&pageSize="+e,this.openIdService.GetAccessTokenOnStorage(),[4,this.httpClient.GetAsync(n)];case 1:return[2,r.sent()]}}))}))},t}();e.ChatHubService=s},653:function(t,e,n){"use strict";var r=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function a(t){try{s(r.next(t))}catch(t){i(t)}}function c(t){try{s(r.throw(t))}catch(t){i(t)}}function s(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,c)}s((r=r.apply(t,e||[])).next())}))},o=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(a=0)),a;)try{if(n=1,r&&(o=2&c[0]?r.return:c[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,c[1])).done)return o;switch(r=0,o&&(c=[2&c[0],o.value]),c[0]){case 0:case 1:o=c;break;case 4:return a.label++,{value:c[1],done:!1};case 5:a.label++,r=c[1],c=[0];continue;case 7:c=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==c[0]&&2!==c[0])){a=0;continue}if(3===c[0]&&(!o||c[1]>o[0]&&c[1]<o[3])){a.label=c[1];break}if(6===c[0]&&a.label<o[1]){a.label=o[1],o=c;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(c);break}o[2]&&a.ops.pop(),a.trys.pop();continue}c=e.call(t,a)}catch(t){c=[6,t],r=0}finally{n=o=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}},i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.OpenIdClient=e.SimpleOpenIdService=void 0;var a,c=i(n(761)),s={client:{id:"MicroservicePassword-ID",secret:"MicroservicePassword-SECRET"},auth:{tokenHost:"https://identity.pepegov.ru"}};!function(t){t.ClientCredentials="ClientCredentials",t.ResourceOwnerPassword="ResourceOwnerPassword",t.AuthorizationCode="AuthorizationCode"}(a||(a={}));var u=function(){function t(){var t=this;this.httpClient=new c.default((function(){return t.GetAccessTokenOnStorage()}))}return t.prototype.ResourceOwnerPasswordAuth=function(t,e,n){return r(this,void 0,void 0,(function(){var r;return o(this,(function(o){switch(o.label){case 0:return[4,new l(s).ResourceOwnerPasswordAuth(t,e,n)];case 1:return(r=o.sent())&&(console.log("Access Token:",r.access_token),console.log("ID Token:",r.id_token),console.log("Refresh Token:",r.refresh_token),localStorage.setItem("access_token",r.access_token),localStorage.setItem("token_type",a.ResourceOwnerPassword)),[2]}}))}))},t.prototype.parseJwt=function(t){var e=t.split(".");if(3!==e.length)throw new Error("Invalid JWT token");var n=e[1],r=this.decodeBase64Url(n);return JSON.parse(r)},t.prototype.decodeBase64Url=function(t){var e=t.replace(/-/g,"+").replace(/_/g,"/"),n=e.padEnd(e.length+(4-e.length%4)%4,"=");return atob(n)},t.prototype.isTokenAlive=function(t){try{var e=this.parseJwt(t);if(!e.exp)throw new Error("Token does not contain an exp claim");return Math.floor(Date.now()/1e3)<e.exp}catch(t){return console.error("Failed to parse token or token is invalid",t),!1}},t.prototype.GetAccessTokenOnStorage=function(){var t=localStorage.getItem("access_token");return t&&this.isTokenAlive(t)?t:(window.location.href="/login",null)},t.prototype.GetUserInfoAsync=function(){return r(this,void 0,void 0,(function(){return o(this,(function(t){return[2,this.httpClient.GetAsync(s.auth.tokenHost+"/connect/userinfo")]}))}))},t}();e.SimpleOpenIdService=u;var l=function(){function t(t){this.config=t}return t.prototype.ResourceOwnerPasswordAuth=function(t,e,n){return r(this,void 0,void 0,(function(){var r,i,a,c;return o(this,(function(o){switch(o.label){case 0:r=new URLSearchParams({username:t,password:e,grant_type:"password",scope:n.join(" "),client_secret:this.config.client.secret,client_id:this.config.client.id}),o.label=1;case 1:return o.trys.push([1,6,,7]),[4,fetch(s.auth.tokenHost+"/connect/token",{body:r,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},method:"post"})];case 2:return[4,o.sent().json()];case 3:return(i=o.sent()).hasOwnProperty("access_token")?[4,i]:[3,5];case 4:return[2,o.sent()];case 5:return a=i,console.log(a),[3,7];case 6:return c=o.sent(),console.log("Access Token Error",c),[3,7];case 7:return[2]}}))}))},t}();e.OpenIdClient=l}},t=>{t(t.s=889)}]);