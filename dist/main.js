(()=>{var t={161:(t,r)=>{let e;function n(t){return`:${u(t)}`}function o(t){let r={};return t.forEach((t=>{const e=u(t.key),n=t.values.map((t=>t.literal));r.hasOwnProperty(e)?r[e]=r[e].concat(n):r[e]=n})),Object.entries(r).map((([t,r])=>`${t}:"${r.join(",")}"`))}function u(t){return t.quote?t.quote+t.literal+t.quote:'"'+t.literal+'"'}r.format=function({lines:t,comments:r},i,c){e=[];let a={},f={};return t.forEach((t=>{t.node?(a[t.node.id.literal]=!0,function({id:t,labels:r,properties:i},c){e.push([u(t),...r.map(n),...o(i)].join(c))}(t.node,i)):t.edge&&(f[t.edge.from.literal]=!0,f[t.edge.to.literal]=!0,function({from:t,to:r,direction:i,labels:c,properties:a},f){e.push([`${u(t)} ${i} ${u(r)}`,...c.map(n),...o(a)].join(f))}(t.edge,i))})),Object.keys(f).forEach((t=>{a[t]||e.push(`${t}`)})),e.join(c+"\n")}},98:(t,r)=>{function e(t={},r){for(let[e,n]of r)if(e in t)for(let r of n)t[e].add(r);else t[e]=new Set(n);for(let r in t)t[r]=[...t[r].values()];return proper}function n(t){return{id:i(t.id),labels:t.labels.map(i),properties:u(t.properties)}}function o(t){let r={from:i(t.from),to:i(t.to),undirected:"--"===t.direction,labels:t.labels.map(i),properties:u(t.properties)};return t.id?{id:i(t.id),...r}:r}function u(t){let r={};return t.forEach((t=>{const e=i(t.key),n=t.values.map(i);r.hasOwnProperty(e)?r[e]=r[e].concat(n):r[e]=n})),r}function i(t){return t.literal}r.formatJSONL=function(t){let r;return t.node?r={type:"node",...n(t.node)}:t.edge&&(r={type:"edge",...o(t.edge)}),JSON.stringify(r,null,2).replace(/{\n */g,"{").replace(/\n *}/g,"}").replace(/\[\n */g,"[").replace(/\n *\]/g,"]").replace(/\n */g," ")},r.buildGraph=function(t){const r={},u=[];for(let i of t)if(i.node){const t=n(i.node);if(t.id in r){const n=[...r[id].labels,...t.labels];r[id].labels=Array.from(new Set(n)),e(r[id].properties,t.properties)}else r[t.id]=t}else i.edge&&u.push(o(i.edge));return{nodes:Object.keys(r).sort().map((t=>r[t])),edges:u}}},602:(t,r)=>{let e,n;function o(t){return`:${i(t)}`}function u({key:t,values:r}){return`${i(t)}:${function(t){return t.map(i).join(",")}(r)}`}function i(t){return t.quote?t.quote+t.literal+t.quote:t.literal}r.format=function({lines:t,comments:r},c,a){for(e=[],n=Object.entries(r).map((([t,r])=>({pos:parseInt(t),text:r}))),t.forEach((t=>{t.node?function({id:t,labels:r,properties:c},a,f){for(;n.length&&n[0].pos<a.start;)e.push(n.shift().text);for(e.push([i(t),...r.map(o),...c.map(u)].join(f));n.length&&n[0].pos<a.end;)e[e.length-1]+=n.shift().text}(t.node,t.pos,c):t.edge&&function({id:t,from:r,to:c,direction:a,labels:f,properties:s},l,h){for(;n.length&&n[0].pos<l.start;)e.push(n.shift().text);let p="";for(t&&(p+=`${i(t)} : `),p+=`${i(r)} ${a} ${i(c)}`,e.push([p,...f.map(o),...s.map(u)].join(h));n.length&&n[0].pos<l.end;)e[e.length-1]+=n.shift().text}(t.edge,t.pos,c)}));n.length;)e.push(n.shift().text);return e.join(a+"\n")}},417:t=>{"use strict";function r(t,e,n,o){var u=Error.call(this,t);return Object.setPrototypeOf&&Object.setPrototypeOf(u,r.prototype),u.expected=e,u.found=n,u.location=o,u.name="SyntaxError",u}function e(t,r,e){return e=e||" ",t.length>r?t:(r-=t.length,t+(e+=e.repeat(r)).slice(0,r))}!function(t,r){function e(){this.constructor=t}e.prototype=r.prototype,t.prototype=new e}(r,Error),r.prototype.format=function(t){var r="Error: "+this.message;if(this.location){var n,o=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){o=t[n].text.split(/\r\n|\n|\r/g);break}var u=this.location.start,i=this.location.source&&"function"==typeof this.location.source.offset?this.location.source.offset(u):u,c=this.location.source+":"+i.line+":"+i.column;if(o){var a=this.location.end,f=e("",i.line.toString().length," "),s=o[u.line-1],l=(u.line===a.line?a.column:s.length+1)-u.column||1;r+="\n --\x3e "+c+"\n"+f+" |\n"+i.line+" | "+s+"\n"+f+" | "+e("",u.column-1," ")+e("",l,"^")}else r+="\n at "+c}return r},r.buildMessage=function(t,r){var e={literal:function(t){return'"'+o(t.text)+'"'},class:function(t){var r=t.parts.map((function(t){return Array.isArray(t)?u(t[0])+"-"+u(t[1]):u(t)}));return"["+(t.inverted?"^":"")+r.join("")+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function o(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function u(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function i(t){return e[t.type](t)}return"Expected "+function(t){var r,e,n=t.map(i);if(n.sort(),n.length>0){for(r=1,e=1;r<n.length;r++)n[r-1]!==n[r]&&(n[e]=n[r],e++);n.length=e}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+o(t)+'"':"end of input"}(r)+" found."},t.exports={SyntaxError:r,parse:function(t,e){var n,o={},u=(e=void 0!==e?e:{}).grammarSource,i={PG:Or},c=Or,a=":",f=",",s="-",l=".",h="'",p='"',d="`",A="``",g="\\",v="/",m="b",C="f",b="n",x="r",y="t",j="u",E="--",O="->",$="#",q="0",S="true",w="false",F=/^[0-9]/,k=/^[^'\\]/,N=/^[^"\\]/,R=/^[^`]/,P=/^[^\r\n]/,I=/^[\n]/,T=/^[\r]/,U=/^[ \t]/,G=/^[0-9a-f]/i,J=/^[ \t\r\n,]/,L=/^[^\0- <>"{}|\^`\\]/,H=/^[^\0- <>"{}|\^`\\:]/,M=/^[1-9]/,_=/^[eE]/,z=/^[+\-]/,B=Cr(":",!1),D=Cr(",",!1),Q=Cr("-",!1),W=Cr(".",!1),K=br([["0","9"]],!1,!1),V=Cr("'",!1),X=Cr('"',!1),Y=Cr("`",!1),Z=br(["'","\\"],!0,!1),tt=br(['"',"\\"],!0,!1),rt=br(["`"],!0,!1),et=Cr("``",!1),nt=Cr("\\",!1),ot=Cr("/",!1),ut=Cr("b",!1),it=Cr("f",!1),ct=Cr("n",!1),at=Cr("r",!1),ft=Cr("t",!1),st=Cr("u",!1),lt=Cr("--",!1),ht=Cr("->",!1),pt=Cr("#",!1),dt=br(["\r","\n"],!0,!1),At=br(["\n"],!1,!1),gt=br(["\r"],!1,!1),vt=br([" ","\t"],!1,!1),mt=br([["0","9"],["a","f"]],!1,!0),Ct=br([" ","\t","\r","\n",","],!1,!1),bt=xr("UNQUOTED_CHAR"),xt=br([["\0"," "],"<",">",'"',"{","}","|","^","`","\\"],!0,!1),yt=xr("WITHOUT_COLON"),jt=br([["\0"," "],"<",">",'"',"{","}","|","^","`","\\",":"],!0,!1),Et=xr("INTEGER"),Ot=Cr("0",!1),$t=br([["1","9"]],!1,!1),qt=br(["e","E"],!1,!1),St=br(["+","-"],!1,!1),wt=Cr("true",!1),Ft=Cr("false",!1),kt={type:"any"},Nt=function(t){return{lines:t,comments:Qr}},Rt=function(t,r,e){return t.node?(t.node.labels=r,t.node.properties=e):t.edge&&(t.edge.labels=r,t.edge.properties=e),t.pos.end=mr().end.offset,t},Pt=function(t){return{node:{id:t},pos:{start:mr().start.offset}}},It=function(t,r,e){return{edge:{from:t,to:e,direction:r},pos:{start:mr().start.offset}}},Tt=function(t,r,e,n){return{edge:{id:t,from:r,to:n,direction:e},pos:{start:mr().start.offset}}},Ut=function(t){return t},Gt=function(t,r){return{key:t,values:r}},Jt=function(t,r){return[t,...r]},Lt=function(){return{literal:Number(vr())}},Ht=function(){return vr()},Mt=function(){return{literal:vr()}},_t=function(){return{literal:vr()}},zt=function(t){return t},Bt=function(t){return{literal:t}},Dt=function(t){return{literal:t.join("")}},Qt=function(){return vr()},Wt=function(t){return{quote:"'",literal:t.join("")}},Kt=function(t){return{quote:'"',literal:t.join("")}},Vt=function(t){return{quote:"`",literal:t.join("")}},Xt=function(t){return{quote:"'",literal:t.join("")}},Yt=function(t){return{quote:'"',literal:t.join("")}},Zt=function(t){return{quote:"`",literal:t.join("")}},tr=function(){return"\b"},rr=function(){return"\f"},er=function(){return"\n"},nr=function(){return"\r"},or=function(){return"\t"},ur=function(t){return vr()},ir=function(t){return String.fromCharCode(parseInt(t,16))},cr=function(){return Qr[mr().start.offset]=vr().replace(/\n$/,""),""},ar=function(){const t=mr().start.offset;return Qr[t]=vr(),""},fr=function(){return{literal:!0}},sr=function(){return{literal:!1}},lr=0,hr=0,pr=[{line:1,column:1}],dr=0,Ar=[],gr=0;if("startRule"in e){if(!(e.startRule in i))throw new Error("Can't start parsing from rule \""+e.startRule+'".');c=i[e.startRule]}function vr(){return t.substring(hr,lr)}function mr(){return jr(hr,lr)}function Cr(t,r){return{type:"literal",text:t,ignoreCase:r}}function br(t,r,e){return{type:"class",parts:t,inverted:r,ignoreCase:e}}function xr(t){return{type:"other",description:t}}function yr(r){var e,n=pr[r];if(n)return n;for(e=r-1;!pr[e];)e--;for(n={line:(n=pr[e]).line,column:n.column};e<r;)10===t.charCodeAt(e)?(n.line++,n.column=1):n.column++,e++;return pr[r]=n,n}function jr(t,r,e){var n=yr(t),o=yr(r),i={source:u,start:{offset:t,line:n.line,column:n.column},end:{offset:r,line:o.line,column:o.column}};return e&&u&&"function"==typeof u.offset&&(i.start=u.offset(i.start),i.end=u.offset(i.end)),i}function Er(t){lr<dr||(lr>dr&&(dr=lr,Ar=[]),Ar.push(t))}function Or(){var t,r,e,n,u;for(t=lr,r=[],e=lr,n=[],u=Tr();u!==o;)n.push(u),u=Tr();for((u=$r())!==o?e=u:(lr=e,e=o);e!==o;){for(r.push(e),e=lr,n=[],u=Tr();u!==o;)n.push(u),u=Tr();(u=$r())!==o?e=u:(lr=e,e=o)}for(e=[],n=Tr();n!==o;)e.push(n),n=Tr();return hr=t,Nt(r)}function $r(){var r,e,n,u,i,c,f;if(r=lr,e=function(){var r,e,n,u,i,c,f,s;if(r=lr,(e=Fr())!==o&&(n=Gr())!==o&&(u=Jr())!==o&&(i=Gr())!==o&&(c=Fr())!==o?(hr=r,r=It(e,u,c)):(lr=r,r=o),r===o)if(r=lr,(e=Fr())!==o)if(58===t.charCodeAt(lr)?(n=a,lr++):(n=o,0===gr&&Er(B)),n!==o){for(u=[],i=Gr();i!==o;)u.push(i),i=Gr();(i=Fr())!==o&&(c=Gr())!==o&&(f=Jr())!==o&&Gr()!==o&&(s=Fr())!==o?(hr=r,r=Tt(e,i,f,s)):(lr=r,r=o)}else lr=r,r=o;else lr=r,r=o;return r}(),e===o&&(e=function(){var t,r;return t=lr,(r=Fr())!==o&&(hr=t,r=Pt(r)),t=r}()),e!==o){for(n=[],u=lr,(i=Gr())!==o&&(c=qr())!==o?u=c:(lr=u,u=o);u!==o;)n.push(u),u=lr,(i=Gr())!==o&&(c=qr())!==o?u=c:(lr=u,u=o);for(u=[],i=lr,(c=Gr())!==o&&(f=Sr())!==o?i=f:(lr=i,i=o);i!==o;)u.push(i),i=lr,(c=Gr())!==o&&(f=Sr())!==o?i=f:(lr=i,i=o);(i=Ur())===o&&(i=null),(c=Dr())!==o?(hr=r,r=Rt(e,n,u)):(lr=r,r=o)}else lr=r,r=o;return r}function qr(){var r,e,n;return r=lr,58===t.charCodeAt(lr)?(e=a,lr++):(e=o,0===gr&&Er(B)),e!==o?(Mr(),n=function(){var t,r,e;if((t=kr())===o){if(t=lr,r=[],(e=zr())!==o)for(;e!==o;)r.push(e),e=zr();else r=o;r!==o&&(hr=t,r=_t()),t=r}return t}(),n!==o?(hr=r,r=Ut(n)):(lr=r,r=o)):(lr=r,r=o),r}function Sr(){var r,e,n;return r=lr,e=function(){var r,e,n;return r=lr,(e=kr())!==o?(Mr(),58===t.charCodeAt(lr)?(n=a,lr++):(n=o,0===gr&&Er(B)),n!==o?(Gr(),hr=r,r=zt(e)):(lr=r,r=o)):(lr=r,r=o),r===o&&(r=function(){var r,e,n,u,i,c;if(r=lr,e=function(){var r,e,n,u,i,c,f;if(r=lr,e=[],(n=Br())!==o)for(;n!==o;)e.push(n),n=Br();else e=o;if(e!==o){if(n=[],u=lr,58===t.charCodeAt(lr)?(i=a,lr++):(i=o,0===gr&&Er(B)),i!==o){if(c=[],(f=Br())!==o)for(;f!==o;)c.push(f),f=Br();else c=o;c!==o?u=i=[i,c]:(lr=u,u=o)}else lr=u,u=o;if(u!==o)for(;u!==o;)if(n.push(u),u=lr,58===t.charCodeAt(lr)?(i=a,lr++):(i=o,0===gr&&Er(B)),i!==o){if(c=[],(f=Br())!==o)for(;f!==o;)c.push(f),f=Br();else c=o;c!==o?u=i=[i,c]:(lr=u,u=o)}else lr=u,u=o;else n=o;n!==o?(hr=r,r=Qt()):(lr=r,r=o)}else lr=r,r=o;return r}(),e!==o?(n=lr,58===t.charCodeAt(lr)?(u=a,lr++):(u=o,0===gr&&Er(B)),u!==o&&(i=Gr())!==o?n=u=[u,i]:(lr=n,n=o),n===o&&(n=lr,(u=Mr())!==o?(58===t.charCodeAt(lr)?(i=a,lr++):(i=o,0===gr&&Er(B)),i!==o?((c=Gr())===o&&(c=null),n=u=[u,i,c]):(lr=n,n=o)):(lr=n,n=o)),n!==o?(hr=r,r=Bt(e)):(lr=r,r=o)):(lr=r,r=o),r===o){if(r=lr,e=[],(n=Br())!==o)for(;n!==o;)e.push(n),n=Br();else e=o;e!==o?((n=Mr())===o&&(n=null),58===t.charCodeAt(lr)?(u=a,lr++):(u=o,0===gr&&Er(B)),u!==o?((i=Gr())===o&&(i=null),hr=r,r=Dt(e)):(lr=r,r=o)):(lr=r,r=o)}return r}()),r}(),e!==o?(n=function(){var r,e,n,u,i,c;if(r=lr,(e=wr())!==o){for(n=[],u=lr,Gr(),44===t.charCodeAt(lr)?(i=f,lr++):(i=o,0===gr&&Er(D)),i!==o?(Gr(),(c=wr())!==o?u=c:(lr=u,u=o)):(lr=u,u=o);u!==o;)n.push(u),u=lr,Gr(),44===t.charCodeAt(lr)?(i=f,lr++):(i=o,0===gr&&Er(D)),i!==o?(Gr(),(c=wr())!==o?u=c:(lr=u,u=o)):(lr=u,u=o);hr=r,r=Jt(e,n)}else lr=r,r=o;return r}(),n!==o?(hr=r,r=Gt(e,n)):(lr=r,r=o)):(lr=r,r=o),r}function wr(){var r,e,n,u;return r=lr,e=function(){var r,e,n,u,i,c,a;if(r=lr,45===t.charCodeAt(lr)?(e=s,lr++):(e=o,0===gr&&Er(Q)),e===o&&(e=null),n=function(){var r,e,n,u;if(gr++,48===t.charCodeAt(lr)?(r=q,lr++):(r=o,0===gr&&Er(Ot)),r===o)if(r=lr,M.test(t.charAt(lr))?(e=t.charAt(lr),lr++):(e=o,0===gr&&Er($t)),e!==o){for(n=[],F.test(t.charAt(lr))?(u=t.charAt(lr),lr++):(u=o,0===gr&&Er(K));u!==o;)n.push(u),F.test(t.charAt(lr))?(u=t.charAt(lr),lr++):(u=o,0===gr&&Er(K));r=e=[e,n]}else lr=r,r=o;return gr--,r===o&&(e=o,0===gr&&Er(Et)),r}(),n!==o){if(u=lr,46===t.charCodeAt(lr)?(i=l,lr++):(i=o,0===gr&&Er(W)),i!==o){if(c=[],F.test(t.charAt(lr))?(a=t.charAt(lr),lr++):(a=o,0===gr&&Er(K)),a!==o)for(;a!==o;)c.push(a),F.test(t.charAt(lr))?(a=t.charAt(lr),lr++):(a=o,0===gr&&Er(K));else c=o;c!==o?u=i=[i,c]:(lr=u,u=o)}else lr=u,u=o;u===o&&(u=null),i=function(){var r,e,n,u,i;if(r=lr,_.test(t.charAt(lr))?(e=t.charAt(lr),lr++):(e=o,0===gr&&Er(qt)),e!==o){if(z.test(t.charAt(lr))?(n=t.charAt(lr),lr++):(n=o,0===gr&&Er(St)),n===o&&(n=null),u=[],F.test(t.charAt(lr))?(i=t.charAt(lr),lr++):(i=o,0===gr&&Er(K)),i!==o)for(;i!==o;)u.push(i),F.test(t.charAt(lr))?(i=t.charAt(lr),lr++):(i=o,0===gr&&Er(K));else u=o;u!==o?r=e=[e,n,u]:(lr=r,r=o)}else lr=r,r=o;return r}(),i===o&&(i=null),r=e=[e,n,u,i]}else lr=r,r=o;return r}(),e!==o?(n=lr,gr++,u=function(){var r;return J.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(Ct)),r}(),gr--,u!==o?(lr=n,n=void 0):n=o,n!==o?(hr=r,r=Lt()):(lr=r,r=o)):(lr=r,r=o),r===o&&(r=function(){var r,e;return r=lr,t.substr(lr,4)===S?(e=S,lr+=4):(e=o,0===gr&&Er(wt)),e!==o&&(hr=r,e=fr()),(r=e)===o&&(r=lr,t.substr(lr,5)===w?(e=w,lr+=5):(e=o,0===gr&&Er(Ft)),e!==o&&(hr=r,e=sr()),r=e),r}(),r===o&&(r=kr())===o&&(r=function(){var r,e,n,u,i,c;if(r=lr,e=lr,n=lr,gr++,44===t.charCodeAt(lr)?(u=f,lr++):(u=o,0===gr&&Er(D)),gr--,u===o?n=void 0:(lr=n,n=o),n!==o&&(u=Br())!==o?e=n=[n,u]:(lr=e,e=o),e!==o){for(n=[],u=lr,i=lr,gr++,44===t.charCodeAt(lr)?(c=f,lr++):(c=o,0===gr&&Er(D)),gr--,c===o?i=void 0:(lr=i,i=o),i!==o&&(c=zr())!==o?u=i=[i,c]:(lr=u,u=o);u!==o;)n.push(u),u=lr,i=lr,gr++,44===t.charCodeAt(lr)?(c=f,lr++):(c=o,0===gr&&Er(D)),gr--,c===o?i=void 0:(lr=i,i=o),i!==o&&(c=zr())!==o?u=i=[i,c]:(lr=u,u=o);hr=r,r=Ht()}else lr=r,r=o;return r}())),r}function Fr(){var r,e,n,u,i,c,f;if(r=function(){var r,e,n,u;if(r=lr,39===t.charCodeAt(lr)?(e=h,lr++):(e=o,0===gr&&Er(V)),e!==o){if(n=[],(u=Nr())!==o)for(;u!==o;)n.push(u),u=Nr();else n=o;n!==o?(39===t.charCodeAt(lr)?(u=h,lr++):(u=o,0===gr&&Er(V)),u!==o?(hr=r,r=Wt(n)):(lr=r,r=o)):(lr=r,r=o)}else lr=r,r=o;if(r===o){if(r=lr,34===t.charCodeAt(lr)?(e=p,lr++):(e=o,0===gr&&Er(X)),e!==o){if(n=[],(u=Rr())!==o)for(;u!==o;)n.push(u),u=Rr();else n=o;n!==o?(34===t.charCodeAt(lr)?(u=p,lr++):(u=o,0===gr&&Er(X)),u!==o?(hr=r,r=Kt(n)):(lr=r,r=o)):(lr=r,r=o)}else lr=r,r=o;if(r===o)if(r=lr,96===t.charCodeAt(lr)?(e=d,lr++):(e=o,0===gr&&Er(Y)),e!==o){if(n=[],(u=Pr())!==o)for(;u!==o;)n.push(u),u=Pr();else n=o;n!==o?(96===t.charCodeAt(lr)?(u=d,lr++):(u=o,0===gr&&Er(Y)),u!==o?(hr=r,r=Vt(n)):(lr=r,r=o)):(lr=r,r=o)}else lr=r,r=o}return r}(),r===o){if(r=lr,e=[],(n=Br())!==o)for(;n!==o;)e.push(n),n=Br();else e=o;if(e!==o){if(n=[],u=lr,58===t.charCodeAt(lr)?(i=a,lr++):(i=o,0===gr&&Er(B)),i!==o){if(c=[],(f=Br())!==o)for(;f!==o;)c.push(f),f=Br();else c=o;c!==o?u=i=[i,c]:(lr=u,u=o)}else lr=u,u=o;for(;u!==o;)if(n.push(u),u=lr,58===t.charCodeAt(lr)?(i=a,lr++):(i=o,0===gr&&Er(B)),i!==o){if(c=[],(f=Br())!==o)for(;f!==o;)c.push(f),f=Br();else c=o;c!==o?u=i=[i,c]:(lr=u,u=o)}else lr=u,u=o;hr=r,r=Mt()}else lr=r,r=o}return r}function kr(){var r,e,n,u;if(r=lr,39===t.charCodeAt(lr)?(e=h,lr++):(e=o,0===gr&&Er(V)),e!==o){for(n=[],u=Nr();u!==o;)n.push(u),u=Nr();39===t.charCodeAt(lr)?(u=h,lr++):(u=o,0===gr&&Er(V)),u!==o?(hr=r,r=Xt(n)):(lr=r,r=o)}else lr=r,r=o;if(r===o){if(r=lr,34===t.charCodeAt(lr)?(e=p,lr++):(e=o,0===gr&&Er(X)),e!==o){for(n=[],u=Rr();u!==o;)n.push(u),u=Rr();34===t.charCodeAt(lr)?(u=p,lr++):(u=o,0===gr&&Er(X)),u!==o?(hr=r,r=Yt(n)):(lr=r,r=o)}else lr=r,r=o;if(r===o)if(r=lr,96===t.charCodeAt(lr)?(e=d,lr++):(e=o,0===gr&&Er(Y)),e!==o){for(n=[],u=Pr();u!==o;)n.push(u),u=Pr();96===t.charCodeAt(lr)?(u=d,lr++):(u=o,0===gr&&Er(Y)),u!==o?(hr=r,r=Zt(n)):(lr=r,r=o)}else lr=r,r=o}return r}function Nr(){var r;return k.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(Z)),r===o&&(r=Ir()),r}function Rr(){var r;return N.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(tt)),r===o&&(r=Ir()),r}function Pr(){var r;return R.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(rt)),r===o&&(t.substr(lr,2)===A?(r=A,lr+=2):(r=o,0===gr&&Er(et))),r}function Ir(){var r,e,n,u,i;return r=lr,92===t.charCodeAt(lr)?(e=g,lr++):(e=o,0===gr&&Er(nt)),e!==o?(34===t.charCodeAt(lr)?(n=p,lr++):(n=o,0===gr&&Er(X)),n===o&&(39===t.charCodeAt(lr)?(n=h,lr++):(n=o,0===gr&&Er(V)),n===o&&(92===t.charCodeAt(lr)?(n=g,lr++):(n=o,0===gr&&Er(nt)),n===o&&(47===t.charCodeAt(lr)?(n=v,lr++):(n=o,0===gr&&Er(ot)),n===o&&(n=lr,98===t.charCodeAt(lr)?(u=m,lr++):(u=o,0===gr&&Er(ut)),u!==o&&(hr=n,u=tr()),(n=u)===o&&(n=lr,102===t.charCodeAt(lr)?(u=C,lr++):(u=o,0===gr&&Er(it)),u!==o&&(hr=n,u=rr()),(n=u)===o&&(n=lr,110===t.charCodeAt(lr)?(u=b,lr++):(u=o,0===gr&&Er(ct)),u!==o&&(hr=n,u=er()),(n=u)===o&&(n=lr,114===t.charCodeAt(lr)?(u=x,lr++):(u=o,0===gr&&Er(at)),u!==o&&(hr=n,u=nr()),(n=u)===o&&(n=lr,116===t.charCodeAt(lr)?(u=y,lr++):(u=o,0===gr&&Er(ft)),u!==o&&(hr=n,u=or()),(n=u)===o&&(n=lr,117===t.charCodeAt(lr)?(u=j,lr++):(u=o,0===gr&&Er(st)),u!==o?(i=function(){var r,e,n,u,i;for(r=lr,e=lr,n=lr,u=[],i=_r();i!==o;)u.push(i),i=u.length>=4?o:_r();return u.length<4?(lr=n,n=o):n=u,(e=n!==o?t.substring(e,lr):n)!==o&&(hr=r,e=ir(e)),r=e}(),i!==o?n=i:(lr=n,n=o)):(lr=n,n=o)))))))))),n!==o?(hr=r,r=ur(n)):(lr=r,r=o)):(lr=r,r=o),r}function Tr(){var t,r,e,n;return t=lr,Mr(),r=lr,(e=Lr())!==o&&(n=Dr())!==o?r=e=[e,n]:(lr=r,r=o),r===o&&(r=Hr()),r!==o?(hr=t,t=cr()):(lr=t,t=o),t}function Ur(){var t;return t=lr,Mr()!==o&&Lr()!==o?(hr=t,t=ar()):(lr=t,t=o),t===o&&(t=Mr()),t}function Gr(){var t,r,e,n,u;for(t=lr,r=[],e=lr,(n=Ur())===o&&(n=null),(u=Hr())!==o?e=n=[n,u]:(lr=e,e=o);e!==o;)r.push(e),e=lr,(n=Ur())===o&&(n=null),(u=Hr())!==o?e=n=[n,u]:(lr=e,e=o);return(e=Mr())!==o?t=r=[r,e]:(lr=t,t=o),t}function Jr(){var r;return t.substr(lr,2)===E?(r=E,lr+=2):(r=o,0===gr&&Er(lt)),r===o&&(t.substr(lr,2)===O?(r=O,lr+=2):(r=o,0===gr&&Er(ht))),r}function Lr(){var r,e,n,u;if(r=lr,35===t.charCodeAt(lr)?(e=$,lr++):(e=o,0===gr&&Er(pt)),e!==o){for(n=[],P.test(t.charAt(lr))?(u=t.charAt(lr),lr++):(u=o,0===gr&&Er(dt));u!==o;)n.push(u),P.test(t.charAt(lr))?(u=t.charAt(lr),lr++):(u=o,0===gr&&Er(dt));r=e=[e,n]}else lr=r,r=o;return r}function Hr(){var r,e,n;return I.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(At)),r===o&&(r=lr,T.test(t.charAt(lr))?(e=t.charAt(lr),lr++):(e=o,0===gr&&Er(gt)),e!==o?(I.test(t.charAt(lr))?(n=t.charAt(lr),lr++):(n=o,0===gr&&Er(At)),n===o&&(n=null),r=e=[e,n]):(lr=r,r=o)),r}function Mr(){var r,e;if(r=[],U.test(t.charAt(lr))?(e=t.charAt(lr),lr++):(e=o,0===gr&&Er(vt)),e!==o)for(;e!==o;)r.push(e),U.test(t.charAt(lr))?(e=t.charAt(lr),lr++):(e=o,0===gr&&Er(vt));else r=o;return r}function _r(){var r;return G.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(mt)),r}function zr(){var r;return gr++,L.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(xt)),gr--,r===o&&0===gr&&Er(bt),r}function Br(){var r;return gr++,H.test(t.charAt(lr))?(r=t.charAt(lr),lr++):(r=o,0===gr&&Er(jt)),gr--,r===o&&0===gr&&Er(yt),r}function Dr(){var r;return(r=Hr())===o&&(r=function(){var r,e;return r=lr,gr++,t.length>lr?(e=t.charAt(lr),lr++):(e=o,0===gr&&Er(kt)),gr--,e===o?r=void 0:(lr=r,r=o),r}()),r}let Qr={};if((n=c())!==o&&lr===t.length)return n;throw n!==o&&lr<t.length&&Er({type:"end"}),function(t,e,n){return new r(r.buildMessage(t,e),t,e,n)}(Ar,dr<t.length?t.charAt(dr):null,dr<t.length?jr(dr,dr+1):jr(dr,dr))}}}},r={};function e(n){var o=r[n];if(void 0!==o)return o.exports;var u=r[n]={exports:{}};return t[n](u,u.exports,e),u.exports}(()=>{const t=e(417),r=e(602),n=e(161),o=e(98);pgFormat=(e,n,u)=>n?r.format(t.parse(e),n,u):t.parse(e).lines.map(o.formatJSONL).join("\n"),pgForBlitz=(r,e=" ",o="")=>n.format(t.parse(r),e,o)})()})();