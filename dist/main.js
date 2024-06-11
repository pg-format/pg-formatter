(()=>{"use strict";function t(r,e,n,o){var u=Error.call(this,r);return Object.setPrototypeOf&&Object.setPrototypeOf(u,t.prototype),u.expected=e,u.found=n,u.location=o,u.name="SyntaxError",u}function r(t,r,e){return e=e||" ",t.length>r?t:(r-=t.length,t+(e+=e.repeat(r)).slice(0,r))}function e(r,e){var n,o={},u=(e=void 0!==e?e:{}).grammarSource,i={PG:lr},c=lr,a=":",f=",",l="-",s=".",h="'",p='"',d="\\",A="/",g="b",v="f",m="n",C="r",b="t",y="u",x="--",j="->",E="#",w="0",$="true",q="false",F=/^[0-9]/,O=/^[^\0-\b\v\f\x0E-\x1F"'\\]/,S=/^[^\r\n]/,k=/^[\n]/,R=/^[\r]/,P=/^[ \t]/,N=/^[0-9a-f]/i,I=/^[^\0- <>"{}|\^`\\]/,U=/^[:#,\-]/,G=/^[1-9]/,M=/^[eE]/,T=/^[+\-]/,z=nr(":",!1),B=nr(",",!1),D=nr("-",!1),H=nr(".",!1),J=or([["0","9"]],!1,!1),Q=nr("'",!1),_=nr('"',!1),K=or([["\0","\b"],"\v","\f",["",""],'"',"'","\\"],!0,!1),L=nr("\\",!1),V=nr("/",!1),W=nr("b",!1),X=nr("f",!1),Y=nr("n",!1),Z=nr("r",!1),tt=nr("t",!1),rt=nr("u",!1),et=nr("--",!1),nt=nr("->",!1),ot=nr("#",!1),ut=or(["\r","\n"],!0,!1),it=or(["\n"],!1,!1),ct=or(["\r"],!1,!1),at=or([" ","\t"],!1,!1),ft=or([["0","9"],["a","f"]],!1,!0),lt=(or([" ","\t","\r","\n",","],!1,!1),ur("UNQUOTED_CHAR")),st=or([["\0"," "],"<",">",'"',"{","}","|","^","`","\\"],!0,!1),ht=or([":","#",",","-"],!1,!1),pt=ur("INTEGER"),dt=nr("0",!1),At=or([["1","9"]],!1,!1),gt=or(["e","E"],!1,!1),vt=or(["+","-"],!1,!1),mt=nr("true",!1),Ct=nr("false",!1),bt={type:"any"},yt=function(t){return{lines:t,comments:Pr}},xt=function(t,r,e){return t.node?(t.node.labels=r,t.node.properties=e):t.edge&&(t.edge.labels=r,t.edge.properties=e),t.pos.end=er().end.offset,t},jt=function(t){return{node:{id:t},pos:{start:er().start.offset}}},Et=function(t,e,n,o){t||e||function(t,e){throw e=void 0!==e?e:cr(Wt,Vt),fr([ur("identifier")],r.substring(Wt,Vt),e)}(),e||(t.literal&&(t.literal+=":"),e=t,t=null);const u={from:e,to:o,direction:n};return t&&(u.id=t),{edge:u,pos:{start:er().start.offset}}},wt=function(t){return t},$t=function(t,r){return{key:t,values:r}},qt=function(t,r){return[t,...r]},Ft=function(){return{literal:Number(rr())}},Ot=function(){return{literal:rr()}},St=function(){return{literal:rr()}},kt=function(){return{literal:rr()}},Rt=function(){return{literal:rr().slice(0,-1)}},Pt=function(){return{literal:rr().slice(0,-1)}},Nt=function(t){return{quote:"'",literal:t.join("")}},It=function(t){return{quote:'"',literal:t.join("")}},Ut=function(t){return{quote:"'",literal:t.join("")}},Gt=function(t){return{quote:'"',literal:t.join("")}},Mt=function(){return"\b"},Tt=function(){return"\f"},zt=function(){return"\n"},Bt=function(){return"\r"},Dt=function(){return"\t"},Ht=function(t){return rr()},Jt=function(t){return String.fromCharCode(parseInt(t,16))},Qt=function(){return Pr[er().start.offset]=rr().replace(/\n$/,""),""},_t=function(){const t=er().start.offset;return Pr[t]=rr(),""},Kt=function(){return{literal:!0}},Lt=function(){return{literal:!1}},Vt=0,Wt=0,Xt=[{line:1,column:1}],Yt=0,Zt=[],tr=0;if("startRule"in e){if(!(e.startRule in i))throw new Error("Can't start parsing from rule \""+e.startRule+'".');c=i[e.startRule]}function rr(){return r.substring(Wt,Vt)}function er(){return cr(Wt,Vt)}function nr(t,r){return{type:"literal",text:t,ignoreCase:r}}function or(t,r,e){return{type:"class",parts:t,inverted:r,ignoreCase:e}}function ur(t){return{type:"other",description:t}}function ir(t){var e,n=Xt[t];if(n)return n;for(e=t-1;!Xt[e];)e--;for(n={line:(n=Xt[e]).line,column:n.column};e<t;)10===r.charCodeAt(e)?(n.line++,n.column=1):n.column++,e++;return Xt[t]=n,n}function cr(t,r,e){var n=ir(t),o=ir(r),i={source:u,start:{offset:t,line:n.line,column:n.column},end:{offset:r,line:o.line,column:o.column}};return e&&u&&"function"==typeof u.offset&&(i.start=u.offset(i.start),i.end=u.offset(i.end)),i}function ar(t){Vt<Yt||(Vt>Yt&&(Yt=Vt,Zt=[]),Zt.push(t))}function fr(r,e,n){return new t(t.buildMessage(r,e),r,e,n)}function lr(){var t,r,e,n,u;for(t=Vt,r=[],e=Vt,n=[],u=jr();u!==o;)n.push(u),u=jr();for((u=sr())!==o?e=u:(Vt=e,e=o);e!==o;){for(r.push(e),e=Vt,n=[],u=jr();u!==o;)n.push(u),u=jr();(u=sr())!==o?e=u:(Vt=e,e=o)}for(e=[],n=jr();n!==o;)e.push(n),n=jr();return Wt=t,yt(r)}function sr(){var t,e,n,u,i,c,a;if(t=Vt,e=function(){var t,e,n,u,i;return t=Vt,e=Vt,n=function(){var t;return(t=gr())===o&&(t=vr()),t}(),n!==o&&(u=wr())!==o?e=n:(Vt=e,e=o),e===o&&(e=null),n=Vt,(u=Ar())!==o&&wr()!==o?n=u:(Vt=n,n=o),n===o&&(n=null),u=function(){var t;return r.substr(Vt,2)===x?(t=x,Vt+=2):(t=o,0===tr&&ar(et)),t===o&&(r.substr(Vt,2)===j?(t=j,Vt+=2):(t=o,0===tr&&ar(nt))),t}(),u!==o&&wr()!==o&&(i=Ar())!==o?(Wt=t,t=Et(e,n,u,i)):(Vt=t,t=o),t}(),e===o&&(e=function(){var t,r;return t=Vt,(r=Ar())!==o&&(Wt=t,r=jt(r)),t=r}()),e!==o){for(n=[],u=Vt,(i=wr())!==o&&(c=hr())!==o?u=c:(Vt=u,u=o);u!==o;)n.push(u),u=Vt,(i=wr())!==o&&(c=hr())!==o?u=c:(Vt=u,u=o);for(u=[],i=Vt,(c=wr())!==o&&(a=pr())!==o?i=a:(Vt=i,i=o);i!==o;)u.push(i),i=Vt,(c=wr())!==o&&(a=pr())!==o?i=a:(Vt=i,i=o);(i=Er())===o&&(i=null),(c=Rr())!==o?(Wt=t,t=xt(e,n,u)):(Vt=t,t=o)}else Vt=t,t=o;return t}function hr(){var t,e,n;return t=Vt,58===r.charCodeAt(Vt)?(e=a,Vt++):(e=o,0===tr&&ar(z)),e!==o?(Fr(),n=function(){var t,r,e;if((t=mr())===o){if(t=Vt,r=[],(e=Sr())!==o)for(;e!==o;)r.push(e),e=Sr();else r=o;r!==o&&(Wt=t,r=kt()),t=r}return t}(),n!==o?(Wt=t,t=wt(n)):(Vt=t,t=o)):(Vt=t,t=o),t}function pr(){var t,e,n;return t=Vt,e=function(){var t,e,n,u,i,c;if((t=gr())===o&&(t=Vt,(e=vr())!==o&&(n=wr())!==o?t=e:(Vt=t,t=o),t===o))if(t=Vt,(e=kr())!==o){for(n=[],u=Vt,i=Vt,tr++,58===r.charCodeAt(Vt)?(c=a,Vt++):(c=o,0===tr&&ar(z)),tr--,c===o?i=void 0:(Vt=i,i=o),i!==o&&(c=Sr())!==o?u=i=[i,c]:(Vt=u,u=o);u!==o;)n.push(u),u=Vt,i=Vt,tr++,58===r.charCodeAt(Vt)?(c=a,Vt++):(c=o,0===tr&&ar(z)),tr--,c===o?i=void 0:(Vt=i,i=o),i!==o&&(c=Sr())!==o?u=i=[i,c]:(Vt=u,u=o);58===r.charCodeAt(Vt)?(u=a,Vt++):(u=o,0===tr&&ar(z)),u!==o?(Wt=t,t=Rt()):(Vt=t,t=o)}else Vt=t,t=o;return t}(),e!==o?(n=function(){var t,e,n,u,i,c;if(t=Vt,wr()===o&&null,(e=dr())!==o){for(n=[],u=Vt,wr(),44===r.charCodeAt(Vt)?(i=f,Vt++):(i=o,0===tr&&ar(B)),i!==o?(wr(),(c=dr())!==o?u=c:(Vt=u,u=o)):(Vt=u,u=o);u!==o;)n.push(u),u=Vt,wr(),44===r.charCodeAt(Vt)?(i=f,Vt++):(i=o,0===tr&&ar(B)),i!==o?(wr(),(c=dr())!==o?u=c:(Vt=u,u=o)):(Vt=u,u=o);Wt=t,t=qt(e,n)}else Vt=t,t=o;return t}(),n!==o?(Wt=t,t=$t(e,n)):(Vt=t,t=o)):(Vt=t,t=o),t}function dr(){var t,e;return t=Vt,e=function(){var t,e,n,u,i,c,a;if(t=Vt,45===r.charCodeAt(Vt)?(e=l,Vt++):(e=o,0===tr&&ar(D)),e===o&&(e=null),n=function(){var t,e,n,u;if(tr++,48===r.charCodeAt(Vt)?(t=w,Vt++):(t=o,0===tr&&ar(dt)),t===o)if(t=Vt,G.test(r.charAt(Vt))?(e=r.charAt(Vt),Vt++):(e=o,0===tr&&ar(At)),e!==o){for(n=[],F.test(r.charAt(Vt))?(u=r.charAt(Vt),Vt++):(u=o,0===tr&&ar(J));u!==o;)n.push(u),F.test(r.charAt(Vt))?(u=r.charAt(Vt),Vt++):(u=o,0===tr&&ar(J));t=e=[e,n]}else Vt=t,t=o;return tr--,t===o&&(e=o,0===tr&&ar(pt)),t}(),n!==o){if(u=Vt,46===r.charCodeAt(Vt)?(i=s,Vt++):(i=o,0===tr&&ar(H)),i!==o){if(c=[],F.test(r.charAt(Vt))?(a=r.charAt(Vt),Vt++):(a=o,0===tr&&ar(J)),a!==o)for(;a!==o;)c.push(a),F.test(r.charAt(Vt))?(a=r.charAt(Vt),Vt++):(a=o,0===tr&&ar(J));else c=o;c!==o?u=i=[i,c]:(Vt=u,u=o)}else Vt=u,u=o;u===o&&(u=null),i=function(){var t,e,n,u,i;if(t=Vt,M.test(r.charAt(Vt))?(e=r.charAt(Vt),Vt++):(e=o,0===tr&&ar(gt)),e!==o){if(T.test(r.charAt(Vt))?(n=r.charAt(Vt),Vt++):(n=o,0===tr&&ar(vt)),n===o&&(n=null),u=[],F.test(r.charAt(Vt))?(i=r.charAt(Vt),Vt++):(i=o,0===tr&&ar(J)),i!==o)for(;i!==o;)u.push(i),F.test(r.charAt(Vt))?(i=r.charAt(Vt),Vt++):(i=o,0===tr&&ar(J));else u=o;u!==o?t=e=[e,n,u]:(Vt=t,t=o)}else Vt=t,t=o;return t}(),i===o&&(i=null),t=e=[e,n,u,i]}else Vt=t,t=o;return t}(),e!==o&&(Wt=t,e=Ft()),(t=e)===o&&(t=function(){var t,e;return t=Vt,r.substr(Vt,4)===$?(e=$,Vt+=4):(e=o,0===tr&&ar(mt)),e!==o&&(Wt=t,e=Kt()),(t=e)===o&&(t=Vt,r.substr(Vt,5)===q?(e=q,Vt+=5):(e=o,0===tr&&ar(Ct)),e!==o&&(Wt=t,e=Lt()),t=e),t}(),t===o&&(t=mr())===o&&(t=function(){var t,e,n,u,i;if(t=Vt,kr()!==o){for(e=[],n=Vt,u=Vt,tr++,44===r.charCodeAt(Vt)?(i=f,Vt++):(i=o,0===tr&&ar(B)),tr--,i===o?u=void 0:(Vt=u,u=o),u!==o&&(i=Sr())!==o?n=u=[u,i]:(Vt=n,n=o);n!==o;)e.push(n),n=Vt,u=Vt,tr++,44===r.charCodeAt(Vt)?(i=f,Vt++):(i=o,0===tr&&ar(B)),tr--,i===o?u=void 0:(Vt=u,u=o),u!==o&&(i=Sr())!==o?n=u=[u,i]:(Vt=n,n=o);Wt=t,t=Ot()}else Vt=t,t=o;return t}())),t}function Ar(){var t,e,n;if(t=function(){var t,e,n,u;if(t=Vt,39===r.charCodeAt(Vt)?(e=h,Vt++):(e=o,0===tr&&ar(Q)),e!==o){if(n=[],(u=Cr())!==o)for(;u!==o;)n.push(u),u=Cr();else n=o;n!==o?(39===r.charCodeAt(Vt)?(u=h,Vt++):(u=o,0===tr&&ar(Q)),u!==o?(Wt=t,t=Nt(n)):(Vt=t,t=o)):(Vt=t,t=o)}else Vt=t,t=o;if(t===o)if(t=Vt,34===r.charCodeAt(Vt)?(e=p,Vt++):(e=o,0===tr&&ar(_)),e!==o){if(n=[],(u=br())!==o)for(;u!==o;)n.push(u),u=br();else n=o;n!==o?(34===r.charCodeAt(Vt)?(u=p,Vt++):(u=o,0===tr&&ar(_)),u!==o?(Wt=t,t=It(n)):(Vt=t,t=o)):(Vt=t,t=o)}else Vt=t,t=o;return t}(),t===o)if(t=Vt,kr()!==o){for(e=[],n=Sr();n!==o;)e.push(n),n=Sr();Wt=t,t=St()}else Vt=t,t=o;return t}function gr(){var t,e,n;return t=Vt,(e=mr())!==o?(58===r.charCodeAt(Vt)?(n=a,Vt++):(n=o,0===tr&&ar(z)),n!==o?t=e:(Vt=t,t=o)):(Vt=t,t=o),t}function vr(){var t,e,n,u,i,c,f;if(t=Vt,kr()!==o){for(e=[],n=Vt,u=[],i=Vt,c=Vt,tr++,58===r.charCodeAt(Vt)?(f=a,Vt++):(f=o,0===tr&&ar(z)),tr--,f===o?c=void 0:(Vt=c,c=o),c!==o&&(f=Sr())!==o?i=c=[c,f]:(Vt=i,i=o);i!==o;)u.push(i),i=Vt,c=Vt,tr++,58===r.charCodeAt(Vt)?(f=a,Vt++):(f=o,0===tr&&ar(z)),tr--,f===o?c=void 0:(Vt=c,c=o),c!==o&&(f=Sr())!==o?i=c=[c,f]:(Vt=i,i=o);if(58===r.charCodeAt(Vt)?(i=a,Vt++):(i=o,0===tr&&ar(z)),i!==o?n=u=[u,i]:(Vt=n,n=o),n!==o)for(;n!==o;){for(e.push(n),n=Vt,u=[],i=Vt,c=Vt,tr++,58===r.charCodeAt(Vt)?(f=a,Vt++):(f=o,0===tr&&ar(z)),tr--,f===o?c=void 0:(Vt=c,c=o),c!==o&&(f=Sr())!==o?i=c=[c,f]:(Vt=i,i=o);i!==o;)u.push(i),i=Vt,c=Vt,tr++,58===r.charCodeAt(Vt)?(f=a,Vt++):(f=o,0===tr&&ar(z)),tr--,f===o?c=void 0:(Vt=c,c=o),c!==o&&(f=Sr())!==o?i=c=[c,f]:(Vt=i,i=o);58===r.charCodeAt(Vt)?(i=a,Vt++):(i=o,0===tr&&ar(z)),i!==o?n=u=[u,i]:(Vt=n,n=o)}else e=o;e!==o?(Wt=t,t=Pt()):(Vt=t,t=o)}else Vt=t,t=o;return t}function mr(){var t,e,n,u;if(t=Vt,39===r.charCodeAt(Vt)?(e=h,Vt++):(e=o,0===tr&&ar(Q)),e!==o){for(n=[],u=Cr();u!==o;)n.push(u),u=Cr();39===r.charCodeAt(Vt)?(u=h,Vt++):(u=o,0===tr&&ar(Q)),u!==o?(Wt=t,t=Ut(n)):(Vt=t,t=o)}else Vt=t,t=o;if(t===o)if(t=Vt,34===r.charCodeAt(Vt)?(e=p,Vt++):(e=o,0===tr&&ar(_)),e!==o){for(n=[],u=br();u!==o;)n.push(u),u=br();34===r.charCodeAt(Vt)?(u=p,Vt++):(u=o,0===tr&&ar(_)),u!==o?(Wt=t,t=Gt(n)):(Vt=t,t=o)}else Vt=t,t=o;return t}function Cr(){var t;return(t=yr())===o&&(34===r.charCodeAt(Vt)?(t=p,Vt++):(t=o,0===tr&&ar(_)),t===o&&(t=xr())),t}function br(){var t;return(t=yr())===o&&(39===r.charCodeAt(Vt)?(t=h,Vt++):(t=o,0===tr&&ar(Q)),t===o&&(t=xr())),t}function yr(){var t;return O.test(r.charAt(Vt))?(t=r.charAt(Vt),Vt++):(t=o,0===tr&&ar(K)),t}function xr(){var t,e,n,u,i;return t=Vt,92===r.charCodeAt(Vt)?(e=d,Vt++):(e=o,0===tr&&ar(L)),e!==o?(34===r.charCodeAt(Vt)?(n=p,Vt++):(n=o,0===tr&&ar(_)),n===o&&(39===r.charCodeAt(Vt)?(n=h,Vt++):(n=o,0===tr&&ar(Q)),n===o&&(92===r.charCodeAt(Vt)?(n=d,Vt++):(n=o,0===tr&&ar(L)),n===o&&(47===r.charCodeAt(Vt)?(n=A,Vt++):(n=o,0===tr&&ar(V)),n===o&&(n=Vt,98===r.charCodeAt(Vt)?(u=g,Vt++):(u=o,0===tr&&ar(W)),u!==o&&(Wt=n,u=Mt()),(n=u)===o&&(n=Vt,102===r.charCodeAt(Vt)?(u=v,Vt++):(u=o,0===tr&&ar(X)),u!==o&&(Wt=n,u=Tt()),(n=u)===o&&(n=Vt,110===r.charCodeAt(Vt)?(u=m,Vt++):(u=o,0===tr&&ar(Y)),u!==o&&(Wt=n,u=zt()),(n=u)===o&&(n=Vt,114===r.charCodeAt(Vt)?(u=C,Vt++):(u=o,0===tr&&ar(Z)),u!==o&&(Wt=n,u=Bt()),(n=u)===o&&(n=Vt,116===r.charCodeAt(Vt)?(u=b,Vt++):(u=o,0===tr&&ar(tt)),u!==o&&(Wt=n,u=Dt()),(n=u)===o&&(n=Vt,117===r.charCodeAt(Vt)?(u=y,Vt++):(u=o,0===tr&&ar(rt)),u!==o?(i=function(){var t,e,n,u,i;for(t=Vt,e=Vt,n=Vt,u=[],i=Or();i!==o;)u.push(i),i=u.length>=4?o:Or();return u.length<4?(Vt=n,n=o):n=u,(e=n!==o?r.substring(e,Vt):n)!==o&&(Wt=t,e=Jt(e)),t=e}(),i!==o?n=i:(Vt=n,n=o)):(Vt=n,n=o)))))))))),n!==o?(Wt=t,t=Ht(n)):(Vt=t,t=o)):(Vt=t,t=o),t}function jr(){var t,r,e,n;return t=Vt,Fr(),r=Vt,(e=$r())!==o&&(n=Rr())!==o?r=e=[e,n]:(Vt=r,r=o),r===o&&(r=qr()),r!==o?(Wt=t,t=Qt()):(Vt=t,t=o),t}function Er(){var t;return t=Vt,Fr()!==o&&$r()!==o?(Wt=t,t=_t()):(Vt=t,t=o),t===o&&(t=Fr()),t}function wr(){var t,r,e,n,u;for(t=Vt,r=[],e=Vt,(n=Er())===o&&(n=null),(u=qr())!==o?e=n=[n,u]:(Vt=e,e=o);e!==o;)r.push(e),e=Vt,(n=Er())===o&&(n=null),(u=qr())!==o?e=n=[n,u]:(Vt=e,e=o);return(e=Fr())!==o?t=r=[r,e]:(Vt=t,t=o),t}function $r(){var t,e,n,u;if(t=Vt,35===r.charCodeAt(Vt)?(e=E,Vt++):(e=o,0===tr&&ar(ot)),e!==o){for(n=[],S.test(r.charAt(Vt))?(u=r.charAt(Vt),Vt++):(u=o,0===tr&&ar(ut));u!==o;)n.push(u),S.test(r.charAt(Vt))?(u=r.charAt(Vt),Vt++):(u=o,0===tr&&ar(ut));t=e=[e,n]}else Vt=t,t=o;return t}function qr(){var t,e,n;return k.test(r.charAt(Vt))?(t=r.charAt(Vt),Vt++):(t=o,0===tr&&ar(it)),t===o&&(t=Vt,R.test(r.charAt(Vt))?(e=r.charAt(Vt),Vt++):(e=o,0===tr&&ar(ct)),e!==o?(k.test(r.charAt(Vt))?(n=r.charAt(Vt),Vt++):(n=o,0===tr&&ar(it)),n===o&&(n=null),t=e=[e,n]):(Vt=t,t=o)),t}function Fr(){var t,e;if(t=[],P.test(r.charAt(Vt))?(e=r.charAt(Vt),Vt++):(e=o,0===tr&&ar(at)),e!==o)for(;e!==o;)t.push(e),P.test(r.charAt(Vt))?(e=r.charAt(Vt),Vt++):(e=o,0===tr&&ar(at));else t=o;return t}function Or(){var t;return N.test(r.charAt(Vt))?(t=r.charAt(Vt),Vt++):(t=o,0===tr&&ar(ft)),t}function Sr(){var t;return tr++,I.test(r.charAt(Vt))?(t=r.charAt(Vt),Vt++):(t=o,0===tr&&ar(st)),tr--,t===o&&0===tr&&ar(lt),t}function kr(){var t,e,n;return t=Vt,e=Vt,tr++,U.test(r.charAt(Vt))?(n=r.charAt(Vt),Vt++):(n=o,0===tr&&ar(ht)),tr--,n===o?e=void 0:(Vt=e,e=o),e!==o&&(n=Sr())!==o?t=e=[e,n]:(Vt=t,t=o),t}function Rr(){var t;return(t=qr())===o&&(t=function(){var t,e;return t=Vt,tr++,r.length>Vt?(e=r.charAt(Vt),Vt++):(e=o,0===tr&&ar(bt)),tr--,e===o?t=void 0:(Vt=t,t=o),t}()),t}let Pr={};if((n=c())!==o&&Vt===r.length)return n;throw n!==o&&Vt<r.length&&ar({type:"end"}),fr(Zt,Yt<r.length?r.charAt(Yt):null,Yt<r.length?cr(Yt,Yt+1):cr(Yt,Yt))}let n,o,u;function i(t){return`:${a(t)}`}function c({key:t,values:r}){return!t.quote&&t.literal.match(/:/)?`${t.literal}: ${f(r)}`:`${a(t)}:${f(r)}`}function a(t){return t.quote?t.quote+t.literal+t.quote:t.literal}function f(t){return t.map(a).join(",")}function l(t){return`:${h(t)}`}function s(t){let r={};return t.forEach((t=>{const e=h(t.key),n=t.values.map((t=>t.literal));r.hasOwnProperty(e)?r[e]=r[e].concat(n):r[e]=n})),Object.entries(r).map((([t,r])=>`${t}:"${r.join(",")}"`))}function h(t){return t.quote?t.quote+t.literal+t.quote:'"'+t.literal+'"'}function p(t){let r;return t.node?r={type:"node",...(e=t.node,{id:g(e.id),labels:e.labels.map(g),properties:A(e.properties)})}:t.edge&&(r={type:"edge",...d(t.edge)}),JSON.stringify(r,null,2).replace(/{\n */g,"{").replace(/\n *}/g,"}").replace(/\[\n */g,"[").replace(/\n *\]/g,"]").replace(/\n */g," ");var e}function d(t){let r={from:g(t.from),to:g(t.to),undirected:"--"===t.direction,labels:t.labels.map(g),properties:A(t.properties)};return t.id?{id:g(t.id),...r}:r}function A(t){let r={};return t.forEach((t=>{const e=g(t.key),n=t.values.map(g);r.hasOwnProperty(e)?r[e]=r[e].concat(n):r[e]=n})),r}function g(t){return t.literal}!function(t,r){function e(){this.constructor=t}e.prototype=r.prototype,t.prototype=new e}(t,Error),t.prototype.format=function(t){var e="Error: "+this.message;if(this.location){var n,o=null;for(n=0;n<t.length;n++)if(t[n].source===this.location.source){o=t[n].text.split(/\r\n|\n|\r/g);break}var u=this.location.start,i=this.location.source&&"function"==typeof this.location.source.offset?this.location.source.offset(u):u,c=this.location.source+":"+i.line+":"+i.column;if(o){var a=this.location.end,f=r("",i.line.toString().length," "),l=o[u.line-1],s=(u.line===a.line?a.column:l.length+1)-u.column||1;e+="\n --\x3e "+c+"\n"+f+" |\n"+i.line+" | "+l+"\n"+f+" | "+r("",u.column-1," ")+r("",s,"^")}else e+="\n at "+c}return e},t.buildMessage=function(t,r){var e={literal:function(t){return'"'+o(t.text)+'"'},class:function(t){var r=t.parts.map((function(t){return Array.isArray(t)?u(t[0])+"-"+u(t[1]):u(t)}));return"["+(t.inverted?"^":"")+r.join("")+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(t){return t.description}};function n(t){return t.charCodeAt(0).toString(16).toUpperCase()}function o(t){return t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function u(t){return t.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,(function(t){return"\\x0"+n(t)})).replace(/[\x10-\x1F\x7F-\x9F]/g,(function(t){return"\\x"+n(t)}))}function i(t){return e[t.type](t)}return"Expected "+function(t){var r,e,n=t.map(i);if(n.sort(),n.length>0){for(r=1,e=1;r<n.length;r++)n[r-1]!==n[r]&&(n[e]=n[r],e++);n.length=e}switch(n.length){case 1:return n[0];case 2:return n[0]+" or "+n[1];default:return n.slice(0,-1).join(", ")+", or "+n[n.length-1]}}(t)+" but "+function(t){return t?'"'+o(t)+'"':"end of input"}(r)+" found."};"undefined"!=typeof window&&(window.pgFormat=(t,r,u)=>r?function({lines:t,comments:r},e=" ",u=""){for(n=[],o=Object.entries(r).map((([t,r])=>({pos:parseInt(t),text:r}))),t.forEach((t=>{t.node?function({id:t,labels:r,properties:e},u,f){for(;o.length&&o[0].pos<u.start;)n.push(o.shift().text);for(n.push([a(t),...r.map(i),...e.map(c)].join(f));o.length&&o[0].pos<u.end;)n[n.length-1]+=o.shift().text}(t.node,t.pos,e):t.edge&&function({id:t,from:r,to:e,direction:u,labels:f,properties:l},s,h){for(;o.length&&o[0].pos<s.start;)n.push(o.shift().text);let p="";for(t&&(p+=`${a(t)}: `),p+=`${a(r)} ${u} ${a(e)}`,n.push([p,...f.map(i),...l.map(c)].join(h));o.length&&o[0].pos<s.end;)n[n.length-1]+=o.shift().text}(t.edge,t.pos,e)}));o.length;)n.push(o.shift().text);return n.join(u+"\n")}(e(t),r,u):e(t).lines.map(p).join("\n"),window.pgForBlitz=(t,r=" ",n="")=>function({lines:t,comments:r},e,n){u=[];const o={},i=new Set;return t.forEach((t=>{if(t.node){const r=t.node.id.literal;o[r]?(o[r].labels=Array.from(new Set([...o[r].labels,...t.node.labels])),o[r].properties=[...o[r].properties,...t.node.properties]):o[r]=t.node}else t.edge&&(i.add(t.edge.from),i.add(t.edge.to),function({from:t,to:r,direction:e,labels:n,properties:o},i){u.push([`${h(t)} ${e} ${h(r)}`,...n.map(l),...s(o)].join(i))}(t.edge,e))})),Object.keys(o).forEach((t=>{!function({id:t,labels:r,properties:e},n){u.push([h(t),...r.map(l),...s(e)].join(n))}(o[t],e)})),Array.from(i).forEach((t=>{o[t.literal]||u.push(`${h(t)}`)})),u.join(n+"\n")}(e(t),r,n))})();