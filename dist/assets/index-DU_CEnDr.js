import{r as b,b as I,B as w,a as z,j as d,c as Q,h as y,i as tt}from"./index-en87ZZnQ.js";const et="_modalOverlay_1w78y_8",rt="_modalContent_1w78y_21",nt="_modalClose_1w78y_31",at="_form_1w78y_41",st="_formSubmit_1w78y_79",it="_unstakeWarning_1w78y_93",M={modalOverlay:et,modalContent:rt,modalClose:nt,form:at,formSubmit:st,unstakeWarning:it},Et=({buttonText:t,pool:r})=>{const[e,a]=b.useState(!1),n=b.useRef(null),[s,h]=b.useState(0),[i,m]=b.useState(!1),{userWallet:f,web3:p,contractsManager:v,ensureWalletConnection:c}=I(),[o,u]=b.useState(new w(0)),[l,_]=b.useState(new w(0)),{unstake:D,setPools:W,getWithdrawableAmounts:Z,candidateMinStake:x,delegatorMinStake:O}=z(),V=()=>a(!0),k=()=>a(!1);b.useEffect(()=>{m(r.stakingAddress===f.myAddr)},[f.myAddr,r.stakingAddress]),b.useEffect(()=>{r.stakingAddress&&$()},[r]),b.useEffect(()=>{const g=A=>{A.key==="Escape"&&k()},N=A=>{n.current&&!n.current.contains(A.target)&&k()};return e&&(document.addEventListener("keydown",g),document.addEventListener("mousedown",N)),()=>{document.removeEventListener("keydown",g),document.removeEventListener("mousedown",N)}},[e]);const $=async()=>{Z(r).then(g=>{_(g.maxWithdrawAmount),u(g.maxWithdrawOrderAmount)})},J=async g=>{if(g.preventDefault(),!c())return;if(s<=0)return Q.warn("Cannot unstake 0 DMD 💎");const N=p.utils.toWei(s.toString());D(r,new w(s)).then(A=>{A&&W(Y=>{const q=Y.map(P=>P.stakingAddress===r.stakingAddress?{...P,myStake:w(P.myStake).minus(N),totalStake:w(P.totalStake).minus(N)}:P);return $(),q}),k()})},X=()=>i&&o.isZero()?"Unstake DMD":!i&&o.isZero()?`Unstake from ${r.stakingAddress}`:i&&l.isGreaterThan(0)&&o.isGreaterThan(0)?"Unstake DMD":l.isGreaterThan(0)&&o.isGreaterThan(0)?`Unstake DMD from ${r.stakingAddress}`:i&&!o.isZero()?"Order DMD":`Order DMD from ${r.stakingAddress}`;return d.jsxs(d.Fragment,{children:[d.jsx("button",{className:"primaryBtn",onClick:g=>{g.stopPropagation(),V()},children:t}),e&&d.jsx("div",{onClick:g=>g.stopPropagation(),className:M.modalOverlay,children:d.jsxs("div",{onClick:g=>g.stopPropagation(),className:M.modalContent,ref:n,children:[d.jsx("button",{className:M.modalClose,onClick:k,children:"×"}),d.jsx("h3",{children:X()}),d.jsxs("form",{className:M.form,onSubmit:J,children:[l.isZero()?d.jsxs("span",{children:["Amount to be ordered:"," ",o.minus(i?x:r.isCurrentValidator?O:0).dividedBy(10**18).toFixed(2)," DMD"]}):d.jsxs("span",{children:["Amount available to be unstaked:"," ",l.minus(i?x:0).dividedBy(10**18).toFixed(2)," DMD"]}),d.jsx("input",{min:l.isZero()?Math.max(0,Math.min(1,Number(o.minus(i?x:r.isCurrentValidator?O:0).dividedBy(10**18).toFixed(0)))):Math.max(0,Math.min(1,Number(l.minus(i?x:0).dividedBy(10**18).toFixed(0)))),max:l.isZero()?Math.max(0,Number(o.minus(i?x:r.isCurrentValidator?O:0).dividedBy(10**18).toFixed(0))):Math.max(0,Number(l.minus(i?x:0).dividedBy(10**18).toFixed(0))),type:"number",value:s,className:M.formInput,placeholder:"Enter the amount to unstake",onChange:g=>h(Number(g.target.value))}),!l.isZero()&&d.jsxs("span",{children:["Amount to be ordered: ",Math.max(0,Number(o.minus(i?x:r.isCurrentValidator?O:0).dividedBy(10**18).toFixed(2)))," DMD"]}),r.isCurrentValidator&&l.isGreaterThan(0)&&o.isGreaterThan(0)?d.jsx("p",{className:M.unstakeWarning,children:"Please note, that this node is a part of current Epoch validators set. You can unstake the available amount, and after that it is possible to order the coins to be claimed as soon as Epoch ends."}):r.isCurrentValidator&&o.isGreaterThan(0)&&d.jsx("p",{className:M.unstakeWarning,children:"Please note, that this node is a part of current Epoch validators set. We will prepare the coins, but you need to claim them by clicking 'Claim' as soon as the Epoch ends"}),d.jsx("button",{className:M.formSubmit,type:"submit",disabled:l.isZero()?!(Math.max(0,o.minus(i?x:O).dividedBy(10**18).toNumber())>=1):!(Math.max(0,l.minus(i?x:0).dividedBy(10**18).toNumber())>=1),children:l.isGreaterThan(0)&&o.isGreaterThan(0)?"Unstake":o.isGreaterThan(0)?"Order":"Unstake"})]})]})})]})},ot="_modalOverlay_b8s14_2",ut="_modalContent_b8s14_15",lt="_modalClose_b8s14_25",dt="_form_b8s14_35",ct="_formSubmit_b8s14_75",mt="_stakeWarning_b8s14_89",j={modalOverlay:ot,modalContent:ut,modalClose:lt,form:dt,formSubmit:ct,stakeWarning:mt},Dt=({buttonText:t,pool:r})=>{const[e,a]=b.useState(!1),n=b.useRef(null),[s,h]=b.useState(0),{stake:i,setPools:m}=z(),{web3:f,ensureWalletConnection:p}=I(),v=()=>a(!0),c=()=>a(!1);b.useEffect(()=>{const u=_=>{_.key==="Escape"&&c()},l=_=>{n.current&&!n.current.contains(_.target)&&c()};return e&&(document.addEventListener("keydown",u),document.addEventListener("mousedown",l)),()=>{document.removeEventListener("keydown",u),document.removeEventListener("mousedown",l)}},[e]);const o=async u=>{u.preventDefault(),p()&&i(r,new w(s)).then(l=>{c()})};return d.jsxs(d.Fragment,{children:[d.jsx("button",{className:"primaryBtn",onClick:u=>{u.stopPropagation(),v()},children:t}),e&&d.jsx("div",{onClick:u=>u.stopPropagation(),className:j.modalOverlay,children:d.jsxs("div",{onClick:u=>u.stopPropagation(),className:j.modalContent,ref:n,children:[d.jsx("button",{className:j.modalClose,onClick:c,children:"×"}),d.jsx("h2",{children:"Stake DMD"}),d.jsxs("form",{className:j.form,onSubmit:o,children:[d.jsx("span",{children:"Please enter the amount you want to stake"}),d.jsx("input",{type:"number",value:s,className:j.formInput,placeholder:"Enter the amount to stake",onChange:u=>h(Number(u.target.value))}),r.isCurrentValidator&&d.jsx("span",{className:j.stakeWarning,children:"Please note that these coins will become active in the next epoch, as the validator candidate is part of an active set. You can unstake them at any time before they become active"}),d.jsx("button",{className:j.formSubmit,type:"submit",children:"Stake"})]})]})})]})};var G={},R={},S=function(t){t==null&&(t=new Date().getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,t.constructor==Array?this.init_by_array(t,t.length):this.init_seed(t)};S.prototype.init_seed=function(t){for(this.mt[0]=t>>>0,this.mti=1;this.mti<this.N;this.mti++){var t=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30;this.mt[this.mti]=(((t&4294901760)>>>16)*1812433253<<16)+(t&65535)*1812433253+this.mti,this.mt[this.mti]>>>=0}};S.prototype.init_by_array=function(t,r){var e,a,n;for(this.init_seed(19650218),e=1,a=0,n=this.N>r?this.N:r;n;n--){var s=this.mt[e-1]^this.mt[e-1]>>>30;this.mt[e]=(this.mt[e]^(((s&4294901760)>>>16)*1664525<<16)+(s&65535)*1664525)+t[a]+a,this.mt[e]>>>=0,e++,a++,e>=this.N&&(this.mt[0]=this.mt[this.N-1],e=1),a>=r&&(a=0)}for(n=this.N-1;n;n--){var s=this.mt[e-1]^this.mt[e-1]>>>30;this.mt[e]=(this.mt[e]^(((s&4294901760)>>>16)*1566083941<<16)+(s&65535)*1566083941)-e,this.mt[e]>>>=0,e++,e>=this.N&&(this.mt[0]=this.mt[this.N-1],e=1)}this.mt[0]=2147483648};S.prototype.random_int=function(){var t,r=new Array(0,this.MATRIX_A);if(this.mti>=this.N){var e;for(this.mti==this.N+1&&this.init_seed(5489),e=0;e<this.N-this.M;e++)t=this.mt[e]&this.UPPER_MASK|this.mt[e+1]&this.LOWER_MASK,this.mt[e]=this.mt[e+this.M]^t>>>1^r[t&1];for(;e<this.N-1;e++)t=this.mt[e]&this.UPPER_MASK|this.mt[e+1]&this.LOWER_MASK,this.mt[e]=this.mt[e+(this.M-this.N)]^t>>>1^r[t&1];t=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^t>>>1^r[t&1],this.mti=0}return t=this.mt[this.mti++],t^=t>>>11,t^=t<<7&2636928640,t^=t<<15&4022730752,t^=t>>>18,t>>>0};S.prototype.random_int31=function(){return this.random_int()>>>1};S.prototype.random_incl=function(){return this.random_int()*(1/4294967295)};S.prototype.random=function(){return this.random_int()*(1/4294967296)};S.prototype.random_excl=function(){return(this.random_int()+.5)*(1/4294967296)};S.prototype.random_long=function(){var t=this.random_int()>>>5,r=this.random_int()>>>6;return(t*67108864+r)*(1/9007199254740992)};var ft=S,K={};(function(t){Object.defineProperty(t,"__esModule",{value:!0}),t.HSLToHex=t.hexToHSL=t.colorRotate=void 0;var r=function(n,s){var h=(0,t.hexToHSL)(n),i=h.h;return i=(i+s)%360,i=i<0?360+i:i,h.h=i,(0,t.HSLToHex)(h)};t.colorRotate=r;var e=function(n){var s="0x"+n[1]+n[2],h="0x"+n[3]+n[4],i="0x"+n[5]+n[6],m=parseInt(s)/255,f=parseInt(h)/255,p=parseInt(i)/255,v=Math.min(m,f,p),c=Math.max(m,f,p),o=c-v,u=0,l=0,_=0;return o==0?u=0:c==m?u=(f-p)/o%6:c==f?u=(p-m)/o+2:u=(m-f)/o+4,u=Math.round(u*60),u<0&&(u+=360),_=(c+v)/2,l=o==0?0:o/(1-Math.abs(2*_-1)),l=+(l*100).toFixed(1),_=+(_*100).toFixed(1),{h:u,s:l,l:_}};t.hexToHSL=e;var a=function(n){var s=n.h,h=n.s,i=n.l;h/=100,i/=100;var m=(1-Math.abs(2*i-1))*h,f=m*(1-Math.abs(s/60%2-1)),p=i-m/2,v=0,c=0,o=0;0<=s&&s<60?(v=m,c=f,o=0):60<=s&&s<120?(v=f,c=m,o=0):120<=s&&s<180?(v=0,c=m,o=f):180<=s&&s<240?(v=0,c=f,o=m):240<=s&&s<300?(v=f,c=0,o=m):300<=s&&s<360&&(v=m,c=0,o=f);var u=Math.round((v+p)*255).toString(16),l=Math.round((c+p)*255).toString(16),_=Math.round((o+p)*255).toString(16);return u.length==1&&(u="0"+u),l.length==1&&(l="0"+l),_.length==1&&(_="0"+_),"#"+u+l+_};t.HSLToHex=a})(K);var B={};Object.defineProperty(B,"__esModule",{value:!0});B.default=Object.freeze(["#01888c","#fc7500","#034f5d","#f73f01","#fc1960","#c7144c","#f3c100","#1598f2","#2465e1","#f19e02"]);var L={},C=y&&y.__assign||function(){return C=Object.assign||function(t){for(var r,e=1,a=arguments.length;e<a;e++){r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},C.apply(this,arguments)};Object.defineProperty(L,"__esModule",{value:!0});var ht=d,vt={borderRadius:"50px",display:"inline-block",margin:0,overflow:"hidden",padding:0},_t=function(t){var r=t.children,e=t.color,a=t.diameter,n=t.style;return(0,ht.jsx)("div",C({className:"paper",style:C(C(C({},vt),{backgroundColor:e,height:a,width:a}),n)},{children:r}),void 0)};L.default=_t;var pt=y&&y.__extends||function(){var t=function(r,e){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,n){a.__proto__=n}||function(a,n){for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(a[s]=n[s])},t(r,e)};return function(r,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");t(r,e);function a(){this.constructor=r}r.prototype=e===null?Object.create(e):(a.prototype=e.prototype,new a)}}(),E=y&&y.__assign||function(){return E=Object.assign||function(t){for(var r,e=1,a=arguments.length;e<a;e++){r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},E.apply(this,arguments)},yt=y&&y.__createBinding||(Object.create?function(t,r,e,a){a===void 0&&(a=e),Object.defineProperty(t,a,{enumerable:!0,get:function(){return r[e]}})}:function(t,r,e,a){a===void 0&&(a=e),t[a]=r[e]}),gt=y&&y.__setModuleDefault||(Object.create?function(t,r){Object.defineProperty(t,"default",{enumerable:!0,value:r})}:function(t,r){t.default=r}),bt=y&&y.__importStar||function(t){if(t&&t.__esModule)return t;var r={};if(t!=null)for(var e in t)e!=="default"&&Object.prototype.hasOwnProperty.call(t,e)&&yt(r,t,e);return gt(r,t),r},F=y&&y.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(R,"__esModule",{value:!0});var T=d,xt=bt(b),St=F(ft),Mt=K,jt=F(B),wt=F(L),H=4,Ct="http://www.w3.org/2000/svg",Ot=30,Nt=24,At=function(t){pt(r,t);function r(){var e=t!==null&&t.apply(this,arguments)||this;return e.genColor=function(a){e.generator.random();var n=Math.floor(a.length*e.generator.random()),s=a.splice(n,1)[0];return s},e.hueShift=function(a,n){var s=n.random()*30-Ot/2,h=function(i){return(0,Mt.colorRotate)(i,s)};return a.map(h)},e.genShape=function(a,n,s,h){var i=n/2,m=e.generator.random(),f=Math.PI*2*m,p=n/h*e.generator.random()+s*n/h,v=Math.cos(f)*p,c=Math.sin(f)*p,o="translate("+v+" "+c+")",u=e.generator.random(),l=m*360+u*180,_="rotate("+l.toFixed(1)+" "+i+" "+i+")",D=o+" "+_,W=e.genColor(a);return(0,T.jsx)("rect",{x:"0",y:"0",rx:"0",ry:"0",height:n,width:n,transform:D,fill:W},s)},e}return r.prototype.render=function(){var e=this,a=this.props,n=a.diameter,s=n===void 0?Nt:n,h=a.paperStyles,i=h===void 0?{}:h,m=a.seed,f=a.svgStyles,p=f===void 0?{}:f;this.generator=new St.default(m);var v=this.hueShift(jt.default.slice(),this.generator),c=Array(H).fill(void 0);return(0,T.jsx)(wt.default,E({color:this.genColor(v),diameter:s,style:i},{children:(0,T.jsx)("svg",E({xmlns:Ct,x:"0",y:"0",height:s,width:s,style:p},{children:c.map(function(o,u){return e.genShape(v,s,u,H-1)})}),void 0)}),void 0)},r}(xt.PureComponent);R.default=At;var U={};Object.defineProperty(U,"__esModule",{value:!0});function Pt(t){var r=t.slice(2,10),e=parseInt(r,16);return e}U.default=Pt;(function(t){var r=y&&y.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};Object.defineProperty(t,"__esModule",{value:!0}),t.jsNumberForAddress=t.default=void 0;var e=R;Object.defineProperty(t,"default",{enumerable:!0,get:function(){return r(e).default}});var a=U;Object.defineProperty(t,"jsNumberForAddress",{enumerable:!0,get:function(){return r(a).default}})})(G);const Wt=tt(G);export{Wt as J,Dt as S,Et as U,G as d};
