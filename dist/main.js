(()=>{var t={161:(t,r)=>{let e;function n(t){return`:${u(t)}`}function o(t){let r={};return t.forEach((t=>{const e=u(t.key),n=t.values.map((t=>t.literal));r.hasOwnProperty(e)?r[e]=r[e].concat(n):r[e]=n})),Object.entries(r).map((([t,r])=>`${t}:"${r.join(",")}"`))}function u(t){return t.quote?t.quote+t.literal+t.quote:'"'+t.literal+'"'}r.format=function({lines:t,comments:r},i,c){e=[];let a={},f={};return t.forEach((t=>{t.node?(a[t.node.id.literal]=!0,function({id:t,labels:r,properties:i},c){e.push([u(t),...r.map(n),...o(i)].join(c))}(t.node,i)):t.edge&&(f[t.edge.from.literal]=!0,f[t.edge.to.literal]=!0,function({from:t,to:r,direction:i,labels:c,properties:a},f){e.push([`${u(t)} ${i} ${u(r)}`,...c.map(n),...o(a)].join(f))}(t.edge,i))})),Object.keys(f).forEach((t=>{a[t]||e.push(`${t}`)})),e.join(c+"\n")}},98:(t,r)=>{function e(t={},r){for(let[e,n]of r)if(e in t)for(let r of n)t[e].add(r);else t[e]=new Set(n);for(let r in t)t[r]=[...t[r].values()];return proper}function n(t){return{id:i(t.id),labels:t.labels.map(i),properties:u(t.properties)}}function o(t){let r={from:i(t.from),to:i(t.to),undirected:"--"===t.direction,labels:t.labels.map(i),properties:u(t.properties)};return t.id?{id:i(t.id),...r}:r}function u(t){let r={};return t.forEach((t=>{const e=i(t.key),n=t.values.map(i);r.hasOwnProperty(e)?r[e]=r[e].concat(n):r[e]=n})),r}function i(t){return t.literal}r.formatJSONL=function(t){let r;return t.node?r={type:"node",...n(t.node)}:t.edge&&(r={type:"edge",...o(t.edge)}),JSON.stringify(r,null,2).replace(/{\n */g,"{").replace(/\n *}/g,"}").replace(/\[\n */g,"[").replace(/\n *\]/g,"]").replace(/\n */g," ")},r.buildGraph=function(t){const r={},u=[];for(let i of t)if(i.node){const t=n(i.node);if(t.id in r){const n=[...r[id].labels,...t.labels];r[id].labels=Array.from(new Set(n)),e(r[id].properties,t.properties)}else r[t.id]=t}else i.edge&&u.push(o(i.edge));return{nodes:Object.keys(r).sort().map((t=>r[t])),edges:u}}},602:(t,r)=>{let e,n;function o(t){return`:${i(t)}`}function u({key:t,values:r}){return`${i(t)}:${function(t){return t.map(i).join(",")}(r)}`}function i(t){return t.quote?t.quote+t.literal+t.quote:t.literal}r.format=function({lines:t,comments:r},c,a){for(e=[],n=Object.entries(r).map((([t,r])=>({pos:parseInt(t),text:r}))),t.forEach((t=>{t.node?function({id:t,labels:r,properties:c},a,f){for(;n.length&&n[0].pos<a.start;)e.push(n.shift().text);for(e.push([i(t),...r.map(o),...c.map(u)].join(f));n.length&&n[0].pos<a.end;)e[e.length-1]+=n.shift().text}(t.node,t.pos,c):t.edge&&function({id:t,from:r,to:c,direction:a,labels:f,properties:s},l,h){for(;n.length&&n[0].pos<l.start;)e.push(n.shift().text);let p="";for(t&&(p+=`${i(t)} : `),p+=`${i(r)} ${a} ${i(c)}`,e.push([p,...f.map(o),...s.map(u)].join(h));n.length&&n[0].pos<l.end;)e[e.length-1]+=n.shift().text}(t.edge,t.pos,c)}));n.length;)e.push(n.shift().text);return e.join(a+"\n")}},417:t=>{"use strict";function r(t,e,n,o){var u=Error.call(this,t);return Object.setPrototypeOf&&Object.setPrototypeOf(u,r.prototype),u.expected=e,u.found=n,u.location=o,u.name="SyntaxError",u}function e(t,r,e){return e=e||" ",t.length>r?t:(r-=t.length,t+(e+=e.repeat(r)).slice(0,r))}!function(t,r){function e(){this.constructor=t}e.prototype=r.prototype,t.prototype=new e}(r,Error),r.prototype.format=function(t){var r="Error: "+this.message;if(this.location){var n,o=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){o=t[n].text.split(/\r\n|\n|\r/g);break}var u=this.location.start,i=this.location.source&&"function"==typeof this.location.source.offset?this.location.source.offset(u):u,c=this.location.source+":"+i.line+":"+i.column;if(o){var a=this.location.end,f=e("",i.line.toString().length," "),s=o[u.line-1],l=(u.line===a.line?a.column:s.length+1)-u.column||1;r+="\n --\x3e "+c+"\n"+f+" |\n"+i.line+" | "+s+"\n"+f+" | "+e("",u.column-1," ")+e("",l,"^")}else r+="\n at "+c}return r},r.buildMessage=function(t,r){var e={literal:function(t){return'"'+o(t.text)+'"'},class:function(t){var r=t.parts.map((function(t){return Array.isArray(t)?u(t[0])+"-"+u(t[1]):u(t)}));return"["+(t.inverted?"^":"")+r.join("")+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function o(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function u(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function i(t){return e[t.type](t)}return"Expected "+function(t){var r,e,n=t.map(i);if(n.sort(),n.length>0){for(r=1,e=1;r<n.length;r++)n[r-1]!==n[r]&&(n[e]=n[r],e++);n.length=e}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+o(t)+'"':"end of input"}(r)+" found."},t.exports={SyntaxError:r,parse:function(t,e){var n,o={},u=(e=void 0!==e?e:{}).grammarSource,i={PG:vr},c=vr,a=":",f=",",s="-",l=".",h="'",p='"',d="\\",A="/",g="b",v="f",m="n",C="r",x="t",b="u",y="--",j="->",E="#",O="0",$="true",S="false",q=/^[0-9]/,w=/^[^'\\]/,F=/^[^"\\]/,k=/^[^\r\n]/,N=/^[\n]/,R=/^[\r]/,P=/^[ \t]/,I=/^[0-9a-f]/i,T=/^[ \t\r\n,]/,U=/^[^\0- <>"{}|\^`\\]/,G=/^[^\0- <>"{}|\^`\\:]/,J=/^[1-9]/,L=/^[eE]/,H=/^[+\-]/,M=lr(":",!1),_=lr(",",!1),z=lr("-",!1),B=lr(".",!1),D=hr([["0","9"]],!1,!1),Q=lr("'",!1),W=lr('"',!1),K=hr(["'","\\"],!0,!1),V=hr(['"',"\\"],!0,!1),X=lr("\\",!1),Y=lr("/",!1),Z=lr("b",!1),tt=lr("f",!1),rt=lr("n",!1),et=lr("r",!1),nt=lr("t",!1),ot=lr("u",!1),ut=lr("--",!1),it=lr("->",!1),ct=lr("#",!1),at=hr(["\r","\n"],!0,!1),ft=hr(["\n"],!1,!1),st=hr(["\r"],!1,!1),lt=hr([" ","\t"],!1,!1),ht=hr([["0","9"],["a","f"]],!1,!0),pt=hr([" ","\t","\r","\n",","],!1,!1),dt=pr("UNQUOTED_CHAR"),At=hr([["\0"," "],"<",">",'"',"{","}","|","^","`","\\"],!0,!1),gt=pr("WITHOUT_COLON"),vt=hr([["\0"," "],"<",">",'"',"{","}","|","^","`","\\",":"],!0,!1),mt=pr("INTEGER"),Ct=lr("0",!1),xt=hr([["1","9"]],!1,!1),bt=hr(["e","E"],!1,!1),yt=hr(["+","-"],!1,!1),jt=lr("true",!1),Et=lr("false",!1),Ot={type:"any"},$t=function(t){return{lines:t,comments:Gr}},St=function(t,r,e){return t.node?(t.node.labels=r,t.node.properties=e):t.edge&&(t.edge.labels=r,t.edge.properties=e),t.pos.end=sr().end.offset,t},qt=function(t){return{node:{id:t},pos:{start:sr().start.offset}}},wt=function(t,r,e){return{edge:{from:t,to:e,direction:r},pos:{start:sr().start.offset}}},Ft=function(t,r,e,n){return{edge:{id:t,from:r,to:n,direction:e},pos:{start:sr().start.offset}}},kt=function(t){return t},Nt=function(t,r){return{key:t,values:r}},Rt=function(t,r){return[t,...r]},Pt=function(){return{literal:Number(fr())}},It=function(){return fr()},Tt=function(){return{literal:fr()}},Ut=function(){return{literal:fr()}},Gt=function(t){return t},Jt=function(t){return{literal:t}},Lt=function(t){return{literal:t.join("")}},Ht=function(){return fr()},Mt=function(t){return{quote:"'",literal:t.join("")}},_t=function(t){return{quote:'"',literal:t.join("")}},zt=function(t){return{quote:"'",literal:t.join("")}},Bt=function(t){return{quote:'"',literal:t.join("")}},Dt=function(){return"\b"},Qt=function(){return"\f"},Wt=function(){return"\n"},Kt=function(){return"\r"},Vt=function(){return"\t"},Xt=function(t){return fr()},Yt=function(t){return String.fromCharCode(parseInt(t,16))},Zt=function(){return Gr[sr().start.offset]=fr().replace(/\n$/,""),""},tr=function(){const t=sr().start.offset;return Gr[t]=fr(),""},rr=function(){return{literal:!0}},er=function(){return{literal:!1}},nr=0,or=0,ur=[{line:1,column:1}],ir=0,cr=[],ar=0;if("startRule"in e){if(!(e.startRule in i))throw new Error("Can't start parsing from rule \""+e.startRule+'".');c=i[e.startRule]}function fr(){return t.substring(or,nr)}function sr(){return Ar(or,nr)}function lr(t,r){return{type:"literal",text:t,ignoreCase:r}}function hr(t,r,e){return{type:"class",parts:t,inverted:r,ignoreCase:e}}function pr(t){return{type:"other",description:t}}function dr(r){var e,n=ur[r];if(n)return n;for(e=r-1;!ur[e];)e--;for(n={line:(n=ur[e]).line,column:n.column};e<r;)10===t.charCodeAt(e)?(n.line++,n.column=1):n.column++,e++;return ur[r]=n,n}function Ar(t,r,e){var n=dr(t),o=dr(r),i={source:u,start:{offset:t,line:n.line,column:n.column},end:{offset:r,line:o.line,column:o.column}};return e&&u&&"function"==typeof u.offset&&(i.start=u.offset(i.start),i.end=u.offset(i.end)),i}function gr(t){nr<ir||(nr>ir&&(ir=nr,cr=[]),cr.push(t))}function vr(){var t,r,e,n,u;for(t=nr,r=[],e=nr,n=[],u=Sr();u!==o;)n.push(u),u=Sr();for((u=mr())!==o?e=u:(nr=e,e=o);e!==o;){for(r.push(e),e=nr,n=[],u=Sr();u!==o;)n.push(u),u=Sr();(u=mr())!==o?e=u:(nr=e,e=o)}for(e=[],n=Sr();n!==o;)e.push(n),n=Sr();return or=t,$t(r)}function mr(){var r,e,n,u,i,c,f;if(r=nr,e=function(){var r,e,n,u,i,c,f,s;if(r=nr,(e=yr())!==o&&(n=wr())!==o&&(u=Fr())!==o&&(i=wr())!==o&&(c=yr())!==o?(or=r,r=wt(e,u,c)):(nr=r,r=o),r===o)if(r=nr,(e=yr())!==o)if(58===t.charCodeAt(nr)?(n=a,nr++):(n=o,0===ar&&gr(M)),n!==o){for(u=[],i=wr();i!==o;)u.push(i),i=wr();(i=yr())!==o&&(c=wr())!==o&&(f=Fr())!==o&&wr()!==o&&(s=yr())!==o?(or=r,r=Ft(e,i,f,s)):(nr=r,r=o)}else nr=r,r=o;else nr=r,r=o;return r}(),e===o&&(e=function(){var t,r;return t=nr,(r=yr())!==o&&(or=t,r=qt(r)),t=r}()),e!==o){for(n=[],u=nr,(i=wr())!==o&&(c=Cr())!==o?u=c:(nr=u,u=o);u!==o;)n.push(u),u=nr,(i=wr())!==o&&(c=Cr())!==o?u=c:(nr=u,u=o);for(u=[],i=nr,(c=wr())!==o&&(f=xr())!==o?i=f:(nr=i,i=o);i!==o;)u.push(i),i=nr,(c=wr())!==o&&(f=xr())!==o?i=f:(nr=i,i=o);(i=qr())===o&&(i=null),(c=Ur())!==o?(or=r,r=St(e,n,u)):(nr=r,r=o)}else nr=r,r=o;return r}function Cr(){var r,e,n;return r=nr,58===t.charCodeAt(nr)?(e=a,nr++):(e=o,0===ar&&gr(M)),e!==o?(Rr(),n=function(){var t,r,e;if((t=jr())===o){if(t=nr,r=[],(e=Ir())!==o)for(;e!==o;)r.push(e),e=Ir();else r=o;r!==o&&(or=t,r=Ut()),t=r}return t}(),n!==o?(or=r,r=kt(n)):(nr=r,r=o)):(nr=r,r=o),r}function xr(){var r,e,n;return r=nr,e=function(){var r,e,n;return r=nr,(e=jr())!==o?(Rr(),58===t.charCodeAt(nr)?(n=a,nr++):(n=o,0===ar&&gr(M)),n!==o?(wr(),or=r,r=Gt(e)):(nr=r,r=o)):(nr=r,r=o),r===o&&(r=function(){var r,e,n,u,i,c;if(r=nr,e=function(){var r,e,n,u,i,c,f;if(r=nr,e=[],(n=Tr())!==o)for(;n!==o;)e.push(n),n=Tr();else e=o;if(e!==o){if(n=[],u=nr,58===t.charCodeAt(nr)?(i=a,nr++):(i=o,0===ar&&gr(M)),i!==o){if(c=[],(f=Tr())!==o)for(;f!==o;)c.push(f),f=Tr();else c=o;c!==o?u=i=[i,c]:(nr=u,u=o)}else nr=u,u=o;if(u!==o)for(;u!==o;)if(n.push(u),u=nr,58===t.charCodeAt(nr)?(i=a,nr++):(i=o,0===ar&&gr(M)),i!==o){if(c=[],(f=Tr())!==o)for(;f!==o;)c.push(f),f=Tr();else c=o;c!==o?u=i=[i,c]:(nr=u,u=o)}else nr=u,u=o;else n=o;n!==o?(or=r,r=Ht()):(nr=r,r=o)}else nr=r,r=o;return r}(),e!==o?(n=nr,58===t.charCodeAt(nr)?(u=a,nr++):(u=o,0===ar&&gr(M)),u!==o&&(i=wr())!==o?n=u=[u,i]:(nr=n,n=o),n===o&&(n=nr,(u=Rr())!==o?(58===t.charCodeAt(nr)?(i=a,nr++):(i=o,0===ar&&gr(M)),i!==o?((c=wr())===o&&(c=null),n=u=[u,i,c]):(nr=n,n=o)):(nr=n,n=o)),n!==o?(or=r,r=Jt(e)):(nr=r,r=o)):(nr=r,r=o),r===o){if(r=nr,e=[],(n=Tr())!==o)for(;n!==o;)e.push(n),n=Tr();else e=o;e!==o?((n=Rr())===o&&(n=null),58===t.charCodeAt(nr)?(u=a,nr++):(u=o,0===ar&&gr(M)),u!==o?((i=wr())===o&&(i=null),or=r,r=Lt(e)):(nr=r,r=o)):(nr=r,r=o)}return r}()),r}(),e!==o?(n=function(){var r,e,n,u,i,c;if(r=nr,(e=br())!==o){for(n=[],u=nr,wr(),44===t.charCodeAt(nr)?(i=f,nr++):(i=o,0===ar&&gr(_)),i!==o?(wr(),(c=br())!==o?u=c:(nr=u,u=o)):(nr=u,u=o);u!==o;)n.push(u),u=nr,wr(),44===t.charCodeAt(nr)?(i=f,nr++):(i=o,0===ar&&gr(_)),i!==o?(wr(),(c=br())!==o?u=c:(nr=u,u=o)):(nr=u,u=o);or=r,r=Rt(e,n)}else nr=r,r=o;return r}(),n!==o?(or=r,r=Nt(e,n)):(nr=r,r=o)):(nr=r,r=o),r}function br(){var r,e,n,u;return r=nr,e=function(){var r,e,n,u,i,c,a;if(r=nr,45===t.charCodeAt(nr)?(e=s,nr++):(e=o,0===ar&&gr(z)),e===o&&(e=null),n=function(){var r,e,n,u;if(ar++,48===t.charCodeAt(nr)?(r=O,nr++):(r=o,0===ar&&gr(Ct)),r===o)if(r=nr,J.test(t.charAt(nr))?(e=t.charAt(nr),nr++):(e=o,0===ar&&gr(xt)),e!==o){for(n=[],q.test(t.charAt(nr))?(u=t.charAt(nr),nr++):(u=o,0===ar&&gr(D));u!==o;)n.push(u),q.test(t.charAt(nr))?(u=t.charAt(nr),nr++):(u=o,0===ar&&gr(D));r=e=[e,n]}else nr=r,r=o;return ar--,r===o&&(e=o,0===ar&&gr(mt)),r}(),n!==o){if(u=nr,46===t.charCodeAt(nr)?(i=l,nr++):(i=o,0===ar&&gr(B)),i!==o){if(c=[],q.test(t.charAt(nr))?(a=t.charAt(nr),nr++):(a=o,0===ar&&gr(D)),a!==o)for(;a!==o;)c.push(a),q.test(t.charAt(nr))?(a=t.charAt(nr),nr++):(a=o,0===ar&&gr(D));else c=o;c!==o?u=i=[i,c]:(nr=u,u=o)}else nr=u,u=o;u===o&&(u=null),i=function(){var r,e,n,u,i;if(r=nr,L.test(t.charAt(nr))?(e=t.charAt(nr),nr++):(e=o,0===ar&&gr(bt)),e!==o){if(H.test(t.charAt(nr))?(n=t.charAt(nr),nr++):(n=o,0===ar&&gr(yt)),n===o&&(n=null),u=[],q.test(t.charAt(nr))?(i=t.charAt(nr),nr++):(i=o,0===ar&&gr(D)),i!==o)for(;i!==o;)u.push(i),q.test(t.charAt(nr))?(i=t.charAt(nr),nr++):(i=o,0===ar&&gr(D));else u=o;u!==o?r=e=[e,n,u]:(nr=r,r=o)}else nr=r,r=o;return r}(),i===o&&(i=null),r=e=[e,n,u,i]}else nr=r,r=o;return r}(),e!==o?(n=nr,ar++,u=function(){var r;return T.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(pt)),r}(),ar--,u!==o?(nr=n,n=void 0):n=o,n!==o?(or=r,r=Pt()):(nr=r,r=o)):(nr=r,r=o),r===o&&(r=function(){var r,e;return r=nr,t.substr(nr,4)===$?(e=$,nr+=4):(e=o,0===ar&&gr(jt)),e!==o&&(or=r,e=rr()),(r=e)===o&&(r=nr,t.substr(nr,5)===S?(e=S,nr+=5):(e=o,0===ar&&gr(Et)),e!==o&&(or=r,e=er()),r=e),r}(),r===o&&(r=jr())===o&&(r=function(){var r,e,n,u,i,c;if(r=nr,e=nr,n=nr,ar++,44===t.charCodeAt(nr)?(u=f,nr++):(u=o,0===ar&&gr(_)),ar--,u===o?n=void 0:(nr=n,n=o),n!==o&&(u=Tr())!==o?e=n=[n,u]:(nr=e,e=o),e!==o){for(n=[],u=nr,i=nr,ar++,44===t.charCodeAt(nr)?(c=f,nr++):(c=o,0===ar&&gr(_)),ar--,c===o?i=void 0:(nr=i,i=o),i!==o&&(c=Ir())!==o?u=i=[i,c]:(nr=u,u=o);u!==o;)n.push(u),u=nr,i=nr,ar++,44===t.charCodeAt(nr)?(c=f,nr++):(c=o,0===ar&&gr(_)),ar--,c===o?i=void 0:(nr=i,i=o),i!==o&&(c=Ir())!==o?u=i=[i,c]:(nr=u,u=o);or=r,r=It()}else nr=r,r=o;return r}())),r}function yr(){var r,e,n,u,i,c,f;if(r=function(){var r,e,n,u;if(r=nr,39===t.charCodeAt(nr)?(e=h,nr++):(e=o,0===ar&&gr(Q)),e!==o){if(n=[],(u=Er())!==o)for(;u!==o;)n.push(u),u=Er();else n=o;n!==o?(39===t.charCodeAt(nr)?(u=h,nr++):(u=o,0===ar&&gr(Q)),u!==o?(or=r,r=Mt(n)):(nr=r,r=o)):(nr=r,r=o)}else nr=r,r=o;if(r===o)if(r=nr,34===t.charCodeAt(nr)?(e=p,nr++):(e=o,0===ar&&gr(W)),e!==o){if(n=[],(u=Or())!==o)for(;u!==o;)n.push(u),u=Or();else n=o;n!==o?(34===t.charCodeAt(nr)?(u=p,nr++):(u=o,0===ar&&gr(W)),u!==o?(or=r,r=_t(n)):(nr=r,r=o)):(nr=r,r=o)}else nr=r,r=o;return r}(),r===o){if(r=nr,e=[],(n=Tr())!==o)for(;n!==o;)e.push(n),n=Tr();else e=o;if(e!==o){if(n=[],u=nr,58===t.charCodeAt(nr)?(i=a,nr++):(i=o,0===ar&&gr(M)),i!==o){if(c=[],(f=Tr())!==o)for(;f!==o;)c.push(f),f=Tr();else c=o;c!==o?u=i=[i,c]:(nr=u,u=o)}else nr=u,u=o;for(;u!==o;)if(n.push(u),u=nr,58===t.charCodeAt(nr)?(i=a,nr++):(i=o,0===ar&&gr(M)),i!==o){if(c=[],(f=Tr())!==o)for(;f!==o;)c.push(f),f=Tr();else c=o;c!==o?u=i=[i,c]:(nr=u,u=o)}else nr=u,u=o;or=r,r=Tt()}else nr=r,r=o}return r}function jr(){var r,e,n,u;if(r=nr,39===t.charCodeAt(nr)?(e=h,nr++):(e=o,0===ar&&gr(Q)),e!==o){for(n=[],u=Er();u!==o;)n.push(u),u=Er();39===t.charCodeAt(nr)?(u=h,nr++):(u=o,0===ar&&gr(Q)),u!==o?(or=r,r=zt(n)):(nr=r,r=o)}else nr=r,r=o;if(r===o)if(r=nr,34===t.charCodeAt(nr)?(e=p,nr++):(e=o,0===ar&&gr(W)),e!==o){for(n=[],u=Or();u!==o;)n.push(u),u=Or();34===t.charCodeAt(nr)?(u=p,nr++):(u=o,0===ar&&gr(W)),u!==o?(or=r,r=Bt(n)):(nr=r,r=o)}else nr=r,r=o;return r}function Er(){var r;return w.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(K)),r===o&&(r=$r()),r}function Or(){var r;return F.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(V)),r===o&&(r=$r()),r}function $r(){var r,e,n,u,i;return r=nr,92===t.charCodeAt(nr)?(e=d,nr++):(e=o,0===ar&&gr(X)),e!==o?(34===t.charCodeAt(nr)?(n=p,nr++):(n=o,0===ar&&gr(W)),n===o&&(39===t.charCodeAt(nr)?(n=h,nr++):(n=o,0===ar&&gr(Q)),n===o&&(92===t.charCodeAt(nr)?(n=d,nr++):(n=o,0===ar&&gr(X)),n===o&&(47===t.charCodeAt(nr)?(n=A,nr++):(n=o,0===ar&&gr(Y)),n===o&&(n=nr,98===t.charCodeAt(nr)?(u=g,nr++):(u=o,0===ar&&gr(Z)),u!==o&&(or=n,u=Dt()),(n=u)===o&&(n=nr,102===t.charCodeAt(nr)?(u=v,nr++):(u=o,0===ar&&gr(tt)),u!==o&&(or=n,u=Qt()),(n=u)===o&&(n=nr,110===t.charCodeAt(nr)?(u=m,nr++):(u=o,0===ar&&gr(rt)),u!==o&&(or=n,u=Wt()),(n=u)===o&&(n=nr,114===t.charCodeAt(nr)?(u=C,nr++):(u=o,0===ar&&gr(et)),u!==o&&(or=n,u=Kt()),(n=u)===o&&(n=nr,116===t.charCodeAt(nr)?(u=x,nr++):(u=o,0===ar&&gr(nt)),u!==o&&(or=n,u=Vt()),(n=u)===o&&(n=nr,117===t.charCodeAt(nr)?(u=b,nr++):(u=o,0===ar&&gr(ot)),u!==o?(i=function(){var r,e,n,u,i;for(r=nr,e=nr,n=nr,u=[],i=Pr();i!==o;)u.push(i),i=u.length>=4?o:Pr();return u.length<4?(nr=n,n=o):n=u,(e=n!==o?t.substring(e,nr):n)!==o&&(or=r,e=Yt(e)),r=e}(),i!==o?n=i:(nr=n,n=o)):(nr=n,n=o)))))))))),n!==o?(or=r,r=Xt(n)):(nr=r,r=o)):(nr=r,r=o),r}function Sr(){var t,r,e,n;return t=nr,Rr(),r=nr,(e=kr())!==o&&(n=Ur())!==o?r=e=[e,n]:(nr=r,r=o),r===o&&(r=Nr()),r!==o?(or=t,t=Zt()):(nr=t,t=o),t}function qr(){var t;return t=nr,Rr()!==o&&kr()!==o?(or=t,t=tr()):(nr=t,t=o),t===o&&(t=Rr()),t}function wr(){var t,r,e,n,u;for(t=nr,r=[],e=nr,(n=qr())===o&&(n=null),(u=Nr())!==o?e=n=[n,u]:(nr=e,e=o);e!==o;)r.push(e),e=nr,(n=qr())===o&&(n=null),(u=Nr())!==o?e=n=[n,u]:(nr=e,e=o);return(e=Rr())!==o?t=r=[r,e]:(nr=t,t=o),t}function Fr(){var r;return t.substr(nr,2)===y?(r=y,nr+=2):(r=o,0===ar&&gr(ut)),r===o&&(t.substr(nr,2)===j?(r=j,nr+=2):(r=o,0===ar&&gr(it))),r}function kr(){var r,e,n,u;if(r=nr,35===t.charCodeAt(nr)?(e=E,nr++):(e=o,0===ar&&gr(ct)),e!==o){for(n=[],k.test(t.charAt(nr))?(u=t.charAt(nr),nr++):(u=o,0===ar&&gr(at));u!==o;)n.push(u),k.test(t.charAt(nr))?(u=t.charAt(nr),nr++):(u=o,0===ar&&gr(at));r=e=[e,n]}else nr=r,r=o;return r}function Nr(){var r,e,n;return N.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(ft)),r===o&&(r=nr,R.test(t.charAt(nr))?(e=t.charAt(nr),nr++):(e=o,0===ar&&gr(st)),e!==o?(N.test(t.charAt(nr))?(n=t.charAt(nr),nr++):(n=o,0===ar&&gr(ft)),n===o&&(n=null),r=e=[e,n]):(nr=r,r=o)),r}function Rr(){var r,e;if(r=[],P.test(t.charAt(nr))?(e=t.charAt(nr),nr++):(e=o,0===ar&&gr(lt)),e!==o)for(;e!==o;)r.push(e),P.test(t.charAt(nr))?(e=t.charAt(nr),nr++):(e=o,0===ar&&gr(lt));else r=o;return r}function Pr(){var r;return I.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(ht)),r}function Ir(){var r;return ar++,U.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(At)),ar--,r===o&&0===ar&&gr(dt),r}function Tr(){var r;return ar++,G.test(t.charAt(nr))?(r=t.charAt(nr),nr++):(r=o,0===ar&&gr(vt)),ar--,r===o&&0===ar&&gr(gt),r}function Ur(){var r;return(r=Nr())===o&&(r=function(){var r,e;return r=nr,ar++,t.length>nr?(e=t.charAt(nr),nr++):(e=o,0===ar&&gr(Ot)),ar--,e===o?r=void 0:(nr=r,r=o),r}()),r}let Gr={};if((n=c())!==o&&nr===t.length)return n;throw n!==o&&nr<t.length&&gr({type:"end"}),function(t,e,n){return new r(r.buildMessage(t,e),t,e,n)}(cr,ir<t.length?t.charAt(ir):null,ir<t.length?Ar(ir,ir+1):Ar(ir,ir))}}}},r={};function e(n){var o=r[n];if(void 0!==o)return o.exports;var u=r[n]={exports:{}};return t[n](u,u.exports,e),u.exports}(()=>{const t=e(417),r=e(602),n=e(161),o=e(98);pgFormat=(e,n,u)=>n?r.format(t.parse(e),n,u):t.parse(e).lines.map(o.formatJSONL).join("\n"),pgForBlitz=(r,e=" ",o="")=>n.format(t.parse(r),e,o)})()})();