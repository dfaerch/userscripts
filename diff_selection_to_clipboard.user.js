// ==UserScript==
// @name         Diff Selection vs Clipboard
// @namespace    https://github.com/dfaerch
// @version      1.6
// @description  Compare selected text with clipboard
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

if (window.self !== window.top) return;
if (window.__diffSelectionInjected) return;
window.__diffSelectionInjected = true;

//
// ========== INLINE DIFF MODULE START ==========
//

const DiffLib = (function() {
/*!

 diff v5.1.0

Software License Agreement (BSD License)

Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>

All rights reserved.

Redistribution and use of this software in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above
  copyright notice, this list of conditions and the
  following disclaimer.

* Redistributions in binary form must reproduce the above
  copyright notice, this list of conditions and the
  following disclaimer in the documentation and/or other
  materials provided with the distribution.

* Neither the name of Kevin Decker nor the names of its
  contributors may be used to endorse or promote products
  derived from this software without specific prior
  written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
@license
*/
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e=e||self).Diff={})}(this,function(e){"use strict";function t(){}t.prototype={diff:function(u,a,e){var n=2<arguments.length&&void 0!==e?e:{},t=n.callback;"function"==typeof n&&(t=n,n={}),this.options=n;var f=this;function d(e){return t?(setTimeout(function(){t(void 0,e)},0),!0):e}u=this.castInput(u),a=this.castInput(a),u=this.removeEmpty(this.tokenize(u));var c=(a=this.removeEmpty(this.tokenize(a))).length,h=u.length,p=1,r=c+h;n.maxEditLength&&(r=Math.min(r,n.maxEditLength));var v=[{newPos:-1,components:[]}],i=this.extractCommon(v[0],a,u,0);if(v[0].newPos+1>=c&&h<=i+1)return d([{value:this.join(a),count:a.length}]);function o(){for(var e,n=-1*p;n<=p;n+=2){var t=void 0,r=v[n-1],i=v[n+1],o=(i?i.newPos:0)-n;r&&(v[n-1]=void 0);var l=r&&r.newPos+1<c,s=i&&0<=o&&o<h;if(l||s){if(!l||s&&r.newPos<i.newPos?(t={newPos:(e=i).newPos,components:e.components.slice(0)},f.pushComponent(t.components,void 0,!0)):((t=r).newPos++,f.pushComponent(t.components,!0,void 0)),o=f.extractCommon(t,a,u,n),t.newPos+1>=c&&h<=o+1)return d(function(e,n,t,r,i){for(var o=0,l=n.length,s=0,u=0;o<l;o++){var a,f,d=n[o];d.removed?(d.value=e.join(r.slice(u,u+d.count)),u+=d.count,o&&n[o-1].added&&(a=n[o-1],n[o-1]=n[o],n[o]=a)):(!d.added&&i?(f=(f=t.slice(s,s+d.count)).map(function(e,n){var t=r[u+n];return t.length>e.length?t:e}),d.value=e.join(f)):d.value=e.join(t.slice(s,s+d.count)),s+=d.count,d.added||(u+=d.count))}var c=n[l-1];1<l&&"string"==typeof c.value&&(c.added||c.removed)&&e.equals("",c.value)&&(n[l-2].value+=c.value,n.pop());return n}(f,t.components,a,u,f.useLongestToken));v[n]=t}else v[n]=void 0}p++}if(t)!function e(){setTimeout(function(){return r<p?t():void(o()||e())},0)}();else for(;p<=r;){var l=o();if(l)return l}},pushComponent:function(e,n,t){var r=e[e.length-1];r&&r.added===n&&r.removed===t?e[e.length-1]={count:r.count+1,added:n,removed:t}:e.push({count:1,added:n,removed:t})},extractCommon:function(e,n,t,r){for(var i=n.length,o=t.length,l=e.newPos,s=l-r,u=0;l+1<i&&s+1<o&&this.equals(n[l+1],t[s+1]);)l++,s++,u++;return u&&e.components.push({count:u}),e.newPos=l,s},equals:function(e,n){return this.options.comparator?this.options.comparator(e,n):e===n||this.options.ignoreCase&&e.toLowerCase()===n.toLowerCase()},removeEmpty:function(e){for(var n=[],t=0;t<e.length;t++)e[t]&&n.push(e[t]);return n},castInput:function(e){return e},tokenize:function(e){return e.split("")},join:function(e){return e.join("")}};var r=new t;function i(e,n){if("function"==typeof e)n.callback=e;else if(e)for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n}var o=/^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,l=/\S/,s=new t;s.equals=function(e,n){return this.options.ignoreCase&&(e=e.toLowerCase(),n=n.toLowerCase()),e===n||this.options.ignoreWhitespace&&!l.test(e)&&!l.test(n)},s.tokenize=function(e){for(var n=e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),t=0;t<n.length-1;t++)!n[t+1]&&n[t+2]&&o.test(n[t])&&o.test(n[t+2])&&(n[t]+=n[t+2],n.splice(t+1,2),t--);return n};var u=new t;function L(e,n,t){return u.diff(e,n,t)}u.tokenize=function(e){var n=[],t=e.split(/(\n|\r\n)/);t[t.length-1]||t.pop();for(var r=0;r<t.length;r++){var i=t[r];r%2&&!this.options.newlineIsToken?n[n.length-1]+=i:(this.options.ignoreWhitespace&&(i=i.trim()),n.push(i))}return n};var a=new t;a.tokenize=function(e){return e.split(/(\S.+?[.!?])(?=\s+|$)/)};var f=new t;function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function x(e){return function(e){if(Array.isArray(e))return c(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,n){if(!e)return;if("string"==typeof e)return c(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return c(e,n)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}f.tokenize=function(e){return e.split(/([{}:;,]|\s+)/)};var h=Object.prototype.toString,p=new t;function v(e,n,t,r,i){var o,l;for(n=n||[],t=t||[],r&&(e=r(i,e)),o=0;o<n.length;o+=1)if(n[o]===e)return t[o];if("[object Array]"===h.call(e)){for(n.push(e),l=new Array(e.length),t.push(l),o=0;o<e.length;o+=1)l[o]=v(e[o],n,t,r,i);return n.pop(),t.pop(),l}if(e&&e.toJSON&&(e=e.toJSON()),"object"===d(e)&&null!==e){n.push(e),l={},t.push(l);var s,u=[];for(s in e)e.hasOwnProperty(s)&&u.push(s);for(u.sort(),o=0;o<u.length;o+=1)l[s=u[o]]=v(e[s],n,t,r,s);n.pop(),t.pop()}else l=e;return l}p.useLongestToken=!0,p.tokenize=u.tokenize,p.castInput=function(e){var n=this.options,t=n.undefinedReplacement,r=n.stringifyReplacer,i=void 0===r?function(e,n){return void 0===n?t:n}:r;return"string"==typeof e?e:JSON.stringify(v(e,null,null,i),i,"  ")},p.equals=function(e,n){return t.prototype.equals.call(p,e.replace(/,([\r\n])/g,"$1"),n.replace(/,([\r\n])/g,"$1"))};var g=new t;function j(e){var l=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},s=e.split(/\r\n|[\n\v\f\r\x85]/),u=e.match(/\r\n|[\n\v\f\r\x85]/g)||[],i=[],a=0;function n(){var e={};for(i.push(e);a<s.length;){var n=s[a];if(/^(\-\-\-|\+\+\+|@@)\s/.test(n))break;var t=/^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(n);t&&(e.index=t[1]),a++}for(o(e),o(e),e.hunks=[];a<s.length;){var r=s[a];if(/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(r))break;if(/^@@/.test(r))e.hunks.push(function(){var e=a,n=s[a++].split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/),t={oldStart:+n[1],oldLines:void 0===n[2]?1:+n[2],newStart:+n[3],newLines:void 0===n[4]?1:+n[4],lines:[],linedelimiters:[]};0===t.oldLines&&(t.oldStart+=1);0===t.newLines&&(t.newStart+=1);for(var r=0,i=0;a<s.length&&!(0===s[a].indexOf("--- ")&&a+2<s.length&&0===s[a+1].indexOf("+++ ")&&0===s[a+2].indexOf("@@"));a++){var o=0==s[a].length&&a!=s.length-1?" ":s[a][0];if("+"!==o&&"-"!==o&&" "!==o&&"\\"!==o)break;t.lines.push(s[a]),t.linedelimiters.push(u[a]||"\n"),"+"===o?r++:"-"===o?i++:" "===o&&(r++,i++)}r||1!==t.newLines||(t.newLines=0);i||1!==t.oldLines||(t.oldLines=0);if(l.strict){if(r!==t.newLines)throw new Error("Added line count did not match for hunk at line "+(e+1));if(i!==t.oldLines)throw new Error("Removed line count did not match for hunk at line "+(e+1))}return t}());else{if(r&&l.strict)throw new Error("Unknown line "+(a+1)+" "+JSON.stringify(r));a++}}}function o(e){var n,t,r,i=/^(---|\+\+\+)\s+(.*)$/.exec(s[a]);i&&(n="---"===i[1]?"old":"new",r=(t=i[2].split("\t",2))[0].replace(/\\\\/g,"\\"),/^".*"$/.test(r)&&(r=r.substr(1,r.length-2)),e[n+"FileName"]=r,e[n+"Header"]=(t[1]||"").trim(),a++)}for(;a<s.length;)n();return i}function m(e,n){var t=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};if("string"==typeof n&&(n=j(n)),Array.isArray(n)){if(1<n.length)throw new Error("applyPatch only works with a single input.");n=n[0]}var r,i,l=e.split(/\r\n|[\n\v\f\r\x85]/),o=e.match(/\r\n|[\n\v\f\r\x85]/g)||[],s=n.hunks,u=t.compareLine||function(e,n,t,r){return n===r},a=0,f=t.fuzzFactor||0,d=0,c=0;for(var h=0;h<s.length;h++){for(var p=s[h],v=l.length-p.oldLines,g=0,m=c+p.oldStart-1,w=function(n,t,r){var i=!0,o=!1,l=!1,s=1;return function e(){if(i&&!l){if(o?s++:i=!1,n+s<=r)return s;l=!0}if(!o)return l||(i=!0),t<=n-s?-s++:(o=!0,e())}}(m,d,v);void 0!==g;g=w())if(function(e,n){for(var t=0;t<e.lines.length;t++){var r=e.lines[t],i=0<r.length?r[0]:" ",o=0<r.length?r.substr(1):r;if(" "===i||"-"===i){if(!u(n+1,l[n],i,o)&&f<++a)return;n++}}return 1}(p,m+g)){p.offset=c+=g;break}if(void 0===g)return!1;d=p.offset+p.oldStart+p.oldLines}for(var y=0,L=0;L<s.length;L++){var x=s[L],S=x.oldStart+x.offset+y-1;y+=x.newLines-x.oldLines;for(var k=0;k<x.lines.length;k++){var b,F=x.lines[k],N=0<F.length?F[0]:" ",H=0<F.length?F.substr(1):F,P=x.linedelimiters[k];" "===N?S++:"-"===N?(l.splice(S,1),o.splice(S,1)):"+"===N?(l.splice(S,0,H),o.splice(S,0,P),S++):"\\"===N&&("+"===(b=x.lines[k-1]?x.lines[k-1][0]:null)?r=!0:"-"===b&&(i=!0))}}if(r)for(;!l[l.length-1];)l.pop(),o.pop();else i&&(l.push(""),o.push("\n"));for(var C=0;C<l.length-1;C++)l[C]=l[C]+o[C];return l.join("")}function w(e,n,a,f,t,r,d){void 0===(d=d||{}).context&&(d.context=4);var c=L(a,f,d);if(c){c.push({value:"",lines:[]});for(var h=[],p=0,v=0,g=[],m=1,w=1,i=0;i<c.length;i++)!function(e){var n,t,r,i,o,l,s=c[e],u=s.lines||s.value.replace(/\n$/,"").split("\n");s.lines=u,s.added||s.removed?(p||(n=c[e-1],p=m,v=w,n&&(g=0<d.context?y(n.lines.slice(-d.context)):[],p-=g.length,v-=g.length)),g.push.apply(g,x(u.map(function(e){return(s.added?"+":"-")+e}))),s.added?w+=u.length:m+=u.length):(p&&(u.length<=2*d.context&&e<c.length-2?g.push.apply(g,x(y(u))):(t=Math.min(u.length,d.context),g.push.apply(g,x(y(u.slice(0,t)))),r={oldStart:p,oldLines:m-p+t,newStart:v,newLines:w-v+t,lines:g},e>=c.length-2&&u.length<=d.context&&(i=/\n$/.test(a),o=/\n$/.test(f),l=0==u.length&&g.length>r.oldLines,!i&&l&&0<a.length&&g.splice(r.oldLines,0,"\\ No newline at end of file"),(i||l)&&o||g.push("\\ No newline at end of file")),h.push(r),v=p=0,g=[])),m+=u.length,w+=u.length)}(i);return{oldFileName:e,newFileName:n,oldHeader:t,newHeader:r,hunks:h}}function y(e){return e.map(function(e){return" "+e})}}function y(e,n,t,r,i,o,l){return function(e){var n=[];e.oldFileName==e.newFileName&&n.push("Index: "+e.oldFileName),n.push("==================================================================="),n.push("--- "+e.oldFileName+(void 0===e.oldHeader?"":"\t"+e.oldHeader)),n.push("+++ "+e.newFileName+(void 0===e.newHeader?"":"\t"+e.newHeader));for(var t=0;t<e.hunks.length;t++){var r=e.hunks[t];0===r.oldLines&&--r.oldStart,0===r.newLines&&--r.newStart,n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@"),n.push.apply(n,r.lines)}return n.join("\n")+"\n"}(w(e,n,t,r,i,o,l))}function S(e,n){if(n.length>e.length)return!1;for(var t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0}function k(e){var n=function r(e){var i=0;var o=0;e.forEach(function(e){var n,t;"string"!=typeof e?(n=r(e.mine),t=r(e.theirs),void 0!==i&&(n.oldLines===t.oldLines?i+=n.oldLines:i=void 0),void 0!==o&&(n.newLines===t.newLines?o+=n.newLines:o=void 0)):(void 0===o||"+"!==e[0]&&" "!==e[0]||o++,void 0===i||"-"!==e[0]&&" "!==e[0]||i++)});return{oldLines:i,newLines:o}}(e.lines),t=n.oldLines,r=n.newLines;void 0!==t?e.oldLines=t:delete e.oldLines,void 0!==r?e.newLines=r:delete e.newLines}function b(e,n){if("string"!=typeof e)return e;if(/^@@/m.test(e)||/^Index:/m.test(e))return j(e)[0];if(!n)throw new Error("Must provide a base reference or pass in a patch");return w(void 0,void 0,n,e)}function F(e){return e.newFileName&&e.newFileName!==e.oldFileName}function N(e,n,t){return n===t?n:(e.conflict=!0,{mine:n,theirs:t})}function H(e,n){return e.oldStart<n.oldStart&&e.oldStart+e.oldLines<n.oldStart}function P(e,n){return{oldStart:e.oldStart,oldLines:e.oldLines,newStart:e.newStart+n,newLines:e.newLines,lines:e.lines}}function C(e,n,t,r){var i,o=O(n),l=function(e,n){var t=[],r=[],i=0,o=!1,l=!1;for(;i<n.length&&e.index<e.lines.length;){var s=e.lines[e.index],u=n[i];if("+"===u[0])break;if(o=o||" "!==s[0],r.push(u),i++,"+"===s[0])for(l=!0;"+"===s[0];)t.push(s),s=e.lines[++e.index];u.substr(1)===s.substr(1)?(t.push(s),e.index++):l=!0}"+"===(n[i]||"")[0]&&o&&(l=!0);if(l)return t;for(;i<n.length;)r.push(n[i++]);return{merged:r,changes:t}}(t,o);l.merged?(i=e.lines).push.apply(i,x(l.merged)):E(e,r?l:o,r?o:l)}function E(e,n,t){e.conflict=!0,e.lines.push({conflict:!0,mine:n,theirs:t})}function z(e,n,t){for(;n.offset<t.offset&&n.index<n.lines.length;){var r=n.lines[n.index++];e.lines.push(r),n.offset++}}function A(e,n){for(;n.index<n.lines.length;){var t=n.lines[n.index++];e.lines.push(t)}}function O(e){for(var n=[],t=e.lines[e.index][0];e.index<e.lines.length;){var r=e.lines[e.index];if("-"===t&&"+"===r[0]&&(t="+"),t!==r[0])break;n.push(r),e.index++}return n}function I(e){return e.reduce(function(e,n){return e&&"-"===n[0]},!0)}function $(e,n,t){for(var r=0;r<t;r++){var i=n[n.length-t+r].substr(1);if(e.lines[e.index+r]!==" "+i)return}return e.index+=t,1}g.tokenize=function(e){return e.slice()},g.join=g.removeEmpty=function(e){return e},e.Diff=t,e.applyPatch=m,e.applyPatches=function(e,o){"string"==typeof e&&(e=j(e));var n=0;!function r(){var i=e[n++];if(!i)return o.complete();o.loadFile(i,function(e,n){if(e)return o.complete(e);var t=m(n,i,o);o.patched(i,t,function(e){return e?o.complete(e):void r()})})}()},e.canonicalize=v,e.convertChangesToDMP=function(e){for(var n,t,r=[],i=0;i<e.length;i++)t=(n=e[i]).added?1:n.removed?-1:0,r.push([t,n.value]);return r},e.convertChangesToXML=function(e){for(var n,t=[],r=0;r<e.length;r++){var i=e[r];i.added?t.push("<ins>"):i.removed&&t.push("<del>"),t.push((n=i.value,n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"))),i.added?t.push("</ins>"):i.removed&&t.push("</del>")}return t.join("")},e.createPatch=function(e,n,t,r,i,o){return y(e,e,n,t,r,i,o)},e.createTwoFilesPatch=y,e.diffArrays=function(e,n,t){return g.diff(e,n,t)},e.diffChars=function(e,n,t){return r.diff(e,n,t)},e.diffCss=function(e,n,t){return f.diff(e,n,t)},e.diffJson=function(e,n,t){return p.diff(e,n,t)},e.diffLines=L,e.diffSentences=function(e,n,t){return a.diff(e,n,t)},e.diffTrimmedLines=function(e,n,t){var r=i(t,{ignoreWhitespace:!0});return u.diff(e,n,r)},e.diffWords=function(e,n,t){return t=i(t,{ignoreWhitespace:!0}),s.diff(e,n,t)},e.diffWordsWithSpace=function(e,n,t){return s.diff(e,n,t)},e.merge=function(e,n,t){e=b(e,t),n=b(n,t);var r={};(e.index||n.index)&&(r.index=e.index||n.index),(e.newFileName||n.newFileName)&&(F(e)?F(n)?(r.oldFileName=N(r,e.oldFileName,n.oldFileName),r.newFileName=N(r,e.newFileName,n.newFileName),r.oldHeader=N(r,e.oldHeader,n.oldHeader),r.newHeader=N(r,e.newHeader,n.newHeader)):(r.oldFileName=e.oldFileName,r.newFileName=e.newFileName,r.oldHeader=e.oldHeader,r.newHeader=e.newHeader):(r.oldFileName=n.oldFileName||e.oldFileName,r.newFileName=n.newFileName||e.newFileName,r.oldHeader=n.oldHeader||e.oldHeader,r.newHeader=n.newHeader||e.newHeader)),r.hunks=[];for(var i=0,o=0,l=0,s=0;i<e.hunks.length||o<n.hunks.length;){var u,a=e.hunks[i]||{oldStart:1/0},f=n.hunks[o]||{oldStart:1/0};H(a,f)?(r.hunks.push(P(a,l)),i++,s+=a.newLines-a.oldLines):H(f,a)?(r.hunks.push(P(f,s)),o++,l+=f.newLines-f.oldLines):(function(e,n,t,r,i){var o,l,s={offset:n,lines:t,index:0},u={offset:r,lines:i,index:0};z(e,s,u),z(e,u,s);for(;s.index<s.lines.length&&u.index<u.lines.length;){var a=s.lines[s.index],f=u.lines[u.index];"-"!==a[0]&&"+"!==a[0]||"-"!==f[0]&&"+"!==f[0]?"+"===a[0]&&" "===f[0]?(o=e.lines).push.apply(o,x(O(s))):"+"===f[0]&&" "===a[0]?(l=e.lines).push.apply(l,x(O(u))):"-"===a[0]&&" "===f[0]?C(e,s,u):"-"===f[0]&&" "===a[0]?C(e,u,s,!0):a===f?(e.lines.push(a),s.index++,u.index++):E(e,O(s),O(u)):function(e,n,t){var r,i,o,l=O(n),s=O(t);if(I(l)&&I(s)){if(S(l,s)&&$(t,l,l.length-s.length))return(r=e.lines).push.apply(r,x(l));if(S(s,l)&&$(n,s,s.length-l.length))return(i=e.lines).push.apply(i,x(s))}else if(function(e,n){return e.length===n.length&&S(e,n)}(l,s))return(o=e.lines).push.apply(o,x(l));E(e,l,s)}(e,s,u)}A(e,s),A(e,u),k(e)}(u={oldStart:Math.min(a.oldStart,f.oldStart),oldLines:0,newStart:Math.min(a.newStart+l,f.oldStart+s),newLines:0,lines:[]},a.oldStart,a.lines,f.oldStart,f.lines),o++,i++,r.hunks.push(u))}return r},e.parsePatch=j,e.structuredPatch=w,Object.defineProperty(e,"__esModule",{value:!0})});

    return Diff;

})();

//
// ========== INLINE DIFF MODULE END ==========
//

(function() {
    let lastSelectedText = '';

    function log(...args) {
        console.log('[DIFF DEBUG]', ...args);
    }

    function normalizeIndentBlock(text) {
        const lines = text.split('\n');
        const nonEmpty = lines.filter(line => line.trim());
        if (!nonEmpty.length) return text;
        const minIndent = Math.min(...nonEmpty.map(line => line.match(/^\s*/)[0].length));
        return lines.map(line => line.slice(minIndent)).join('\n');
    }


    function createFloatButton(x, y, range) {
        document.getElementById('diff-float-btn')?.remove();

        const btn = document.createElement('button');
        btn.id = 'diff-float-btn';
        btn.textContent = '📋 Diff';
        btn.type = 'button';
        btn.style.cssText = `
all: unset;
position: fixed;
bottom: 10px;
right: 10px;
background: #6cc460;
color: white;
font-size: 12px;
padding: 4px 6px;
border: 1px solid #2e2e2e;
border-radius: 100px;
cursor: pointer;
z-index: 99999;
opacity: 0;
transition: opacity 0.25s ease;
`;
        document.body.appendChild(btn);

        // force reflow so transition applies
        void btn.offsetWidth;
        btn.style.opacity = '1';

        // Fade out after 5s
        const fadeTimer = setTimeout(() => {
            btn.style.opacity = '0';
            setTimeout(() => removeButton(true), 500);
        }, 4000);

        const removeButton = (force = false) => {
            const stillSelected = window.getSelection().toString().trim();
            if (force || !stillSelected || document.activeElement !== btn) {
                btn.style.opacity = '0';
                setTimeout(() => btn.remove(), 500);
                ['mousedown', 'selectionchange', 'keydown'].forEach(evt =>
                    document.removeEventListener(evt, removeButton)
                );
                clearTimeout(fadeTimer);
            }
        };

        // Listen for cancellation triggers
        ['mousedown', 'selectionchange', 'keydown'].forEach(evt =>
            document.addEventListener(evt, removeButton)
        );

        btn.onclick = async () => {
            if (!lastSelectedText || lastSelectedText.trim() === '') {
                alert("No text selected (cached)");
                return;
            }

            let clipboard;
            try {
                clipboard = await navigator.clipboard.readText();
                // log('Clipboard content:', clipboard);
            } catch (e) {
                alert("Clipboard read failed: " + e);
                log('Clipboard read failed', e);
                return;
            }

            if (!clipboard.trim()) {
                alert("Clipboard is empty");
                return;
            }

            if (!DiffLib || !DiffLib.structuredPatch) {
                alert("Diff lib not available");
                log("Diff lib missing:", typeof DiffLib);
                return;
            }

            const normClipboard = normalizeIndentBlock(clipboard);
            const normSelected = normalizeIndentBlock(lastSelectedText);

            const diff = DiffLib.structuredPatch(
                'a/clipboard.txt',
                'b/selection.txt',
                normClipboard,
                normSelected,
                '',
                '', {
                    context: 3
                }
            );

            let html = `--- ${diff.oldFileName}\n+++ ${diff.newFileName}\n`;
            diff.hunks.forEach(hunk => {
                html += `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@\n`;
                hunk.lines.forEach(line => {
                    let cls = 'normal';
                    if (line.startsWith('+')) cls = 'added';
                    else if (line.startsWith('-')) cls = 'removed';
                    html += `<span class="diff-line ${cls}">${line.replace(/</g, '&lt;')}</span>\n`;
                });
            });

            removeButton(true);
            showOverlay(html);
        };

        document.body.appendChild(btn);
    }

    function showOverlay(content) {
        const overlay = document.createElement('div');
        overlay.id = 'diff-overlay';
        overlay.innerHTML = `
      <div class="diff-box">
        <button class="diff-close">×</button>
        <pre>${content}</pre>
      </div>`;
        document.body.appendChild(overlay);

        overlay.querySelector('.diff-close').onclick = () => {
            overlay.remove();
        };

        document.addEventListener('keydown', escHandler);
        document.addEventListener('mousedown', outsideHandler);

        function escHandler(e) {
            if (e.key === "Escape") closeOverlay();
        }

        function outsideHandler(e) {
            if (!overlay.querySelector('.diff-box').contains(e.target)) {
                closeOverlay();
            }
        }

        function closeOverlay() {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
            document.removeEventListener('mousedown', outsideHandler);
            log('Overlay closed via ESC or outside click');
        }

    }

    function monitorSelection() {
        let showButtonTimer = null;

        document.addEventListener('mouseup', () => {
            if (showButtonTimer) {
                clearTimeout(showButtonTimer);
                showButtonTimer = null;
            }

            setTimeout(() => {
                const sel = window.getSelection();
                if (!sel || sel.isCollapsed) return;

                lastSelectedText = sel.toString();

                const range = sel.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const x = window.scrollX + rect.right + 5;
                const y = window.scrollY + rect.top - 5;

                showButtonTimer = setTimeout(() => {
                    createFloatButton(x, y, range);
                    showButtonTimer = null;
                }, 500);

                // cancel if selection changes or key is pressed
                const cancel = () => {
                    if (showButtonTimer) {
                        clearTimeout(showButtonTimer);
                        showButtonTimer = null;
                        document.removeEventListener('selectionchange', cancel);
                        document.removeEventListener('keydown', cancel);
                    }
                };

                document.addEventListener('selectionchange', cancel, {
                    once: true
                });
                document.addEventListener('keydown', cancel, {
                    once: true
                });
            }, 50); // small delay to let selection register
        });
    }

    GM_addStyle(`
    #diff-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.85);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #diff-overlay .diff-box {
      background: #1e1e1e;
      border: 1px solid #444;
      padding: 1em;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      position: relative;
    }
    #diff-overlay .diff-close {
      position: fixed;
      top: 10px;
      right: 15px;
      font-size: 20px;
      background: none;
      color: #ddd;
      border: none;
      cursor: pointer;
    }
    #diff-overlay pre {
      white-space: pre-wrap;
      font-family: monospace;
    }
    .diff-line.added { color: #0f0; }
    .diff-line.removed { color: #f44; }
    .diff-line.normal { color: #ccc; }
  `);

    monitorSelection();
})();

