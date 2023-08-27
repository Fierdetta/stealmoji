(function(S,a,o,u,p,f,h,N){"use strict";const j=a.findByProps("openMediaModal"),I=a.findByProps("hideActionSheet");function w(t){return new Promise(function(e,n){o.ReactNative.Image.getSize(t,function(i,r){e([i,r])},n)})}async function L(t){const[e,n]=await w(t),{width:i,height:r}=o.ReactNative.Dimensions.get("window");I.hideActionSheet(),j.openMediaModal({initialSources:[{uri:t,sourceURI:t,width:e,height:n}],initialIndex:0,originLayout:{width:128,height:128,x:i/2-64,y:r-64,resizeMode:"fill"}})}function B(t,e){fetch(t).then(function(n){n.blob().then(function(i){const r=new FileReader;r.readAsDataURL(i),r.onloadend=function(){e(r.result)}})})}const{default:_,ButtonColors:z,ButtonSizes:M}=a.findByProps("ButtonColors","ButtonLooks","ButtonSizes"),y=a.findByProps("openLazy","hideActionSheet"),{downloadMediaAsset:T}=a.findByProps("downloadMediaAsset"),x=function(t){return y.openLazy(Promise.resolve().then(function(){return fe}),"AddToServerActionSheet",{emojiNode:t})};function b(t){let{emojiNode:e}=t;const n=[{text:"Add to Server",callback:function(){return x(e)}},{text:"Copy URL to clipboard",callback:function(){o.clipboard.setString(e.src),y.hideActionSheet(),h.showToast(`Copied ${e.alt}'s URL to clipboard`,f.getAssetIDByName("ic_copy_message_link"))}},...o.ReactNative.Platform.select({ios:[{text:"Copy image to clipboard",callback:function(){return B(e.src,function(i){o.clipboard.setImage(i.split(",")[1]),y.hideActionSheet(),h.showToast(`Copied ${e.alt}'s image to clipboard`,f.getAssetIDByName("ic_message_copy"))})}}],default:[]}),{text:`Save image to ${o.ReactNative.Platform.select({android:"Downloads",default:"Camera Roll"})}`,callback:function(){T(e.src,e.src.includes(".gif")?1:0),y.hideActionSheet(),h.showToast(`Saved ${e.alt}'s image to ${o.ReactNative.Platform.select({android:"Downloads",default:"Camera Roll"})}`,f.getAssetIDByName("toast_image_saved"))}}];return React.createElement(React.Fragment,null,n.map(function(i){let{text:r,callback:c}=i;return React.createElement(_,{color:z.BRAND,text:r,size:M.SMALL,onPress:c,style:{marginTop:o.ReactNative.Platform.select({android:12,default:16})}})}))}const C=a.findByProps("hideActionSheet"),{FormDivider:D}=p.Forms,{TouchableOpacity:F}=p.General;let g=a.findByProps("GuildDetails");function G(){if(g)return P("default",g);const t=[],e=u.before("openLazy",C,function(n){let[i,r]=n;r==="MessageEmojiActionSheet"&&(e(),i.then(function(c){g=c,t.push(u.after("default",c,function(l,s){t.push(P("type",s))}))}))});return function(){return e(),t.forEach(function(n){return n?.()})}}function P(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1;const i=u.after(t,e,function(r,c){let[{emojiNode:l}]=r;if(o.React.useEffect(function(){return function(){return void(n&&i())}},[]),!l.src)return;const s=c?.props?.children?.props?.children?.props?.children;if(!s)return;const d=u.after("type",s,function(R,m){let[{emojiNode:v}]=R;o.React.useEffect(function(){return function(){return void d()}},[]);const E=m?.props?.children?.[0]?.props?.children;E?.[0]?.type?.Sizes&&(E[0]=o.React.createElement(F,{onPress:function(){return L(v.src.split("?")[0])}},E[0]));const $=m?.props?.children?.[3]?.props?.children;if($){$.push(o.React.createElement(b,{emojiNode:v}));return}const pe=-~m.props?.children?.findIndex?.(function(he){return he?.type?.name==="Button"})||-2;m.props?.children?.splice(pe,0,o.React.createElement(o.React.Fragment,null,o.React.createElement(D,{style:{marginLeft:0,marginTop:16}}),o.React.createElement(b,{emojiNode:v})))})},n);return i}const k=a.findByProps("convertSurrogateToName"),U=a.findByProps("hideActionSheet");function O(t){let{id:e,name:n,animated:i}=t;try{U.openLazy(Promise.resolve(g),"MessageEmojiActionSheet",{emojiNode:e?{id:e,alt:n,src:`https://cdn.discordapp.com/emojis/${e}.${i?"gif":"webp"}?size=128`}:{content:k.convertSurrogateToName(n),surrogate:n}})}catch(r){console.log("Failed to open action sheet",r)}}const H=a.find(function(t){return t.render?.name==="ActionSheet"}),{TouchableOpacity:V}=p.General;function X(){return u.before("render",H,function(t){let[e]=t;if(!g||!e?.header?.props?.reactions||e.children.type?.name!=="FastList")return;const n=u.after("type",e.header,function(i,r){o.React.useEffect(function(){return n},[]);try{const c=r.props.children[0],{tabs:l,onSelect:s}=c.props;c.props.tabs=l.map(function(d){return o.React.createElement(V,{onPress:function(){return s(d.props.index)},onLongPress:function(){const{emoji:R}=d.props.reaction;O(R)}},d)})}catch{console.error("Failed to patch reaction header.")}})})}let A=[];var q={onLoad:function(){A.push(G()),A.push(X())},onUnload:function(){for(const t of A)t()}};const{default:J,GuildIconSizes:K}=a.findByProps("GuildIconSizes"),{FormRow:Q,FormIcon:W}=p.Forms,Y=a.findByProps("uploadEmoji"),Z=a.findByStoreName("EmojiStore"),ee=a.findByProps("openLazy","hideActionSheet");function te(t){let{guild:e,emojiNode:n}=t;const i=function(){N.showInputAlert({title:"Emoji name",initialValue:n.alt,placeholder:"bleh",onConfirm:function(c){B(n.src,function(l){Y.uploadEmoji({guildId:e.id,image:l,name:c,roles:void 0}).then(function(){h.showToast(`Added ${n.alt} ${n.alt!==c?`as ${c} `:""}to ${e.name}`,f.getAssetIDByName("Check"))}).catch(function(s){h.showToast(s.body.message,f.getAssetIDByName("Small"))})})},confirmText:`Add to ${e.name}`,confirmColor:void 0,cancelText:"Cancel"}),ee.hideActionSheet()},r=o.React.useMemo(function(){const c=e.getMaxEmojiSlots(),l=Z.getGuilds()[e.id]?.emojis??[],s=n.src.includes(".gif");return l.filter(function(d){return d?.animated===s}).length<c},[]);return o.React.createElement(Q,{leading:o.React.createElement(J,{guild:e,size:K.MEDIUM,animate:!1}),disabled:!r,label:e.name,subLabel:r?void 0:"No slots available",trailing:o.React.createElement(W,{style:{opacity:1},source:f.getAssetIDByName("ic_add_24px")}),onPress:i})}const ne=a.findByProps("openLazy","hideActionSheet"),ie=a.find(function(t){return t.render?.name==="ActionSheet"}),{BottomSheetFlatList:oe}=a.findByProps("BottomSheetScrollView"),{ActionSheetTitleHeader:re,ActionSheetCloseButton:ae}=a.findByProps("ActionSheetTitleHeader"),{FormDivider:ce,FormIcon:se}=p.Forms,le=a.findByProps("getGuilds"),de=a.findByProps("can","_dispatcher");function ue(t){let{emojiNode:e}=t;const n=Object.values(le.getGuilds()).filter(function(i){return de.can(o.constants.Permissions.MANAGE_GUILD_EXPRESSIONS,i)});return React.createElement(ie,{scrollable:!0},React.createElement(re,{title:`Stealing ${e.alt}`,leading:React.createElement(se,{style:{marginRight:12,opacity:1},source:{uri:e.src},disableColor:!0}),trailing:React.createElement(ae,{onPress:function(){return ne.hideActionSheet()}})}),React.createElement(oe,{style:{flex:1},contentContainerStyle:{paddingBottom:24},data:n,renderItem:function(i){let{item:r}=i;return React.createElement(te,{guild:r,emojiNode:e})},ItemSeparatorComponent:ce,keyExtractor:function(i){return i.id}}))}var fe=Object.freeze({__proto__:null,default:ue});return S.default=q,Object.defineProperty(S,"__esModule",{value:!0}),S})({},vendetta.metro,vendetta.metro.common,vendetta.patcher,vendetta.ui.components,vendetta.ui.assets,vendetta.ui.toasts,vendetta.ui.alerts);