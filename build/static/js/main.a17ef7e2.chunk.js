(this.webpackJsonptransportcare=this.webpackJsonptransportcare||[]).push([[0],{334:function(e,t,a){},409:function(e,t,a){},490:function(e,t,a){},491:function(e,t,a){},492:function(e,t,a){},493:function(e,t,a){},494:function(e,t,a){},571:function(e,t,a){},572:function(e,t,a){},573:function(e,t,a){},574:function(e,t,a){},575:function(e,t,a){},576:function(e,t,a){},577:function(e,t,a){},579:function(e,t,a){"use strict";a.r(t);var c=a(0),s=a.n(c),n=a(26),r=a.n(n),i=(a(409),a(56)),l=a(34),j=a(44),d=a.n(j),o=a(31),u=a(58),b=a(12),h=a(656),O=a(659),x=a(624),m=a(661),p=a(87),f=a(660),v=a(665),g=a(654),N=a(335),y=a.n(N),U=function(){var e=Object(u.a)(d.a.mark((function e(t,a){var c,s,n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=JSON.stringify({params:t}),s={method:"post",url:"".concat("http://localhost:8080/api").concat(a),headers:{"Content-Type":"application/json",Authorization:"Basic YWRtaW46MTIzNDU2"},data:c},e.next=4,y()(s);case 4:return n=e.sent,e.abrupt("return",n);case 6:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),w=a(2),C=h.a.Title,I=O.a.Search,k=x.a.Content,S=function(){var e=Object(l.f)(),t=Object(c.useState)({role:"1  ",page:1,per_page:5,search:"",sort:""}),a=Object(b.a)(t,2),s=a[0],n=(a[1],Object(c.useState)([])),r=Object(b.a)(n,2),i=r[0],j=r[1],h=Object(c.useState)({current:1,pageSize:5}),O=Object(b.a)(h,2),x=O[0],N=O[1],y=Object(c.useState)(""),S=Object(b.a)(y,2),_=S[0],L=S[1],A=function(){var e=Object(u.a)(d.a.mark((function e(t,a,c){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(o.a)(Object(o.a)({},s),{},{page:t.current||s.page,search:_}),e.next=3,U(n,"/user/get_users").then((function(e){j(e.data.data.docs),console.log(e.data.data.docs),N({current:e.data.data.page,pageSize:5,total:e.data.data.totalDocs})}));case 3:case"end":return e.stop()}}),e)})));return function(t,a,c){return e.apply(this,arguments)}}();Object(c.useEffect)((function(){A(s)}),[s]);var E=[{title:"Username",render:function(e,t){return Object(w.jsx)("span",{title:"Username",children:t.name})}},{title:"Email",render:function(e,t){return Object(w.jsx)("span",{title:"Email",children:t.email})}},{title:"Phone",render:function(e,t){return Object(w.jsx)("span",{title:"Phone",children:t.phone})}},{title:"Action",key:"x",render:function(e,t){return Object(w.jsxs)(m.b,{size:"middle",children:[Object(w.jsx)(p.a,{onClick:function(){return e=t._id,console.log("----- here we are"),void U({id:e},"/user/delete_user").then((function(e){A(s)}));var e},children:"Delete"}),Object(w.jsx)(p.a,{onClick:function(){return T(t._id)},children:"View"})]})}}],T=function(t){e.push("/dashboard/user/".concat(t))};return Object(w.jsxs)(k,{style:{margin:"24px 16px",padding:24,minHeight:"calc(100vh - 114px)",background:"#fff"},children:[Object(w.jsxs)(f.a,{gutter:[40,0],children:[Object(w.jsx)(v.a,{span:18,children:Object(w.jsx)(C,{level:2,children:"User List"})}),Object(w.jsx)(v.a,{span:6,children:Object(w.jsx)(I,{placeholder:"input search text",allowClear:!0,onKeyUp:function(e){console.log("---\x3e",e.target.value),L(e.target.value),A(x)},style:{width:200}})})]}),Object(w.jsx)(f.a,{gutter:[40,0],children:Object(w.jsx)(v.a,{span:24,children:Object(w.jsx)(g.a,{columns:E,dataSource:i,onChange:A,pagination:x})})})]})};a(490);function _(){var e=Object(l.g)().id,t=Object(c.useState)([]),a=Object(b.a)(t,2),s=a[0],n=a[1];return Object(c.useEffect)((function(){console.log("id: -----\x3e ",e),U({id:e},"/user/get_user_detail").then((function(e){console.log("usersid=>>>>>",e.data),n(e.data.data.user_detail)}))}),[]),Object(w.jsxs)("div",{className:"user",children:[Object(w.jsxs)("div",{className:"userTitleContainer",children:[Object(w.jsx)("h1",{className:"userTitle",children:"Edits User"}),Object(w.jsx)(i.b,{to:"/newUser",children:Object(w.jsx)("button",{className:"userAddButton",children:"Create"})})]}),Object(w.jsx)("div",{className:"userContainer",children:Object(w.jsxs)("div",{className:"userUpdate",children:[Object(w.jsx)("span",{className:"userUpdateTitle",children:"Edit"}),Object(w.jsxs)("form",{className:"userUpdateForm",children:[Object(w.jsxs)("div",{className:"userUpdateLeft",children:[Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Username"}),Object(w.jsx)("input",{type:"text",value:s.name,className:"userUpdateInput"})]}),Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Email"}),Object(w.jsx)("input",{type:"text",value:s.email,className:"userUpdateInput"})]}),Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Phone"}),Object(w.jsx)("input",{type:"text",value:s.phone,className:"userUpdateInput"})]})]}),Object(w.jsx)("div",{className:"userUpdateRight"})]})]})})]})}var L=a(72),A=(a(491),a(655)),E=a(662);a(492),a(343),a(625);var T=[{name:"Jan","Active User":4e3},{name:"Feb","Active User":3e3},{name:"Mar","Active User":5e3},{name:"Apr","Active User":4e3},{name:"May","Active User":3e3},{name:"Jun","Active User":2e3},{name:"Jul","Active User":4e3},{name:"Agu","Active User":3e3},{name:"Sep","Active User":4e3},{name:"Oct","Active User":1e3},{name:"Nov","Active User":4e3},{name:"Dec","Active User":3e3}];a(493),a(494);var M=a(630),z=a(663),D=a(362),P=a(372),R=a(201),B=a(634);function W(e){var t=e.title,a=e.data,c=e.dataKey,s=e.grid;return Object(w.jsxs)("div",{className:"chart",children:[Object(w.jsx)("h3",{className:"chartTitle",children:t}),Object(w.jsx)(M.a,{width:"100%",aspect:4,children:Object(w.jsxs)(z.a,{data:a,children:[Object(w.jsx)(D.a,{dataKey:"name",stroke:"#5550bd"}),Object(w.jsx)(P.a,{type:"monotone",dataKey:c,stroke:"#5550bd"}),Object(w.jsx)(R.a,{}),s&&Object(w.jsx)(B.a,{stroke:"#e0dfdf",strokeDasharray:"5 5"})]})})]})}a(635);a(334);function K(){var e=Object(l.f)(),t=Object(c.useState)({name:"",price:"",commission:"",photo:"",loading:!1,error:""}),a=Object(b.a)(t,2),s=a[0],n=a[1],r=s.name,i=s.price,j=s.commission,h=(s.photo,s.loading,s.error,function(e){return function(t){var a="photo"===e?t.target.files[0]:t.target.value;n(Object(o.a)(Object(o.a)({},s),{},Object(L.a)({},e,a)))}}),x=function(){var e=Object(u.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("onsubmit"),t.preventDefault(),n(Object(o.a)(Object(o.a)({},s),{},{error:"",loading:!0})),e.next=5,U(s,"/category/update_category").then((function(e){console.log("add",e.data),e.error?n(Object(o.a)(Object(o.a)({},s),{},{error:e.error})):n(Object(o.a)(Object(o.a)({},s),{},{name:"",price:"",photo:"",commission:""}))}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),m={name:"file",action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",headers:{authorization:"authorization-text"},onChange:function(e){"uploading"!==e.file.status&&console.log(e.file,e.fileList),"done"===e.file.status||e.file.status}};return Object(w.jsxs)("div",{className:"newUser",children:[Object(w.jsx)("h1",{className:"newUserTitle",children:"New User"}),Object(w.jsxs)("form",{children:[Object(w.jsxs)("div",{className:"newUserItem",children:[Object(w.jsx)("label",{children:"Username"}),Object(w.jsx)(O.a,{placeholder:"Username",onChange:h("name"),value:r})]}),Object(w.jsxs)("div",{className:"newUserItem",children:[Object(w.jsx)("label",{children:"Commission"}),Object(w.jsx)(O.a,{placeholder:"commission",onChange:h("price"),value:i})]}),Object(w.jsxs)("div",{className:"newUserItem",children:[Object(w.jsx)("label",{children:"Price"}),Object(w.jsx)(O.a,{placeholder:"price",onChange:h("commission"),value:j})]}),Object(w.jsx)("div",{className:"file_upload",children:Object(w.jsx)(A.a,Object(o.a)(Object(o.a)({},m),{},{children:Object(w.jsx)(p.a,{icon:Object(w.jsx)(E.a,{}),children:"Click to Upload"})}))}),Object(w.jsx)("button",{onClick:x,className:"newUserButton",children:"Create"}),Object(w.jsx)("button",{onClick:function(){return console.log("cat"),void e.push("/category")},className:"newUserButton",children:"Cancel"})]})]})}function J(){var e=Object(l.f)(),t=Object(l.g)().id,a=Object(c.useState)({id:"",type:"edit",name:"",price:"",commission:"",photo:""}),s=Object(b.a)(a,2),n=s[0],r=s[1],i=n.name,j=n.price,h=n.commission,x=function(){var e=Object(u.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("id===>",t),e.next=3,U(Object(o.a)(Object(o.a)({},n),{},{id:t}),"/category/get_category").then((function(e){console.log("add---\x3e",e.data.data.category),r({name:e.data.data.category[0].name,price:e.data.data.category[0].price,commission:e.data.data.category[0].commission})}));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),m=function(){var a=Object(u.a)(d.a.mark((function a(c){return d.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return c.preventDefault(),a.next=3,U(Object(o.a)(Object(o.a)({},n),{},{id:t,type:"edit"}),"/category/update_category");case 3:e.push("/category");case 4:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}();Object(c.useEffect)((function(){x()}),[]);var f=function(e){return function(t){var a="photo"===e?t.target.files[0]:t.target.value;r(Object(o.a)(Object(o.a)({},n),{},Object(L.a)({},e,a)))}};return Object(w.jsxs)("div",{className:"newUser",children:[Object(w.jsx)("h1",{className:"newUserTitle",children:"Edit"}),Object(w.jsxs)("form",{children:[Object(w.jsxs)("div",{className:"newUserItem",children:[Object(w.jsx)("label",{children:"Username"}),Object(w.jsx)(O.a,{placeholder:"Username",onChange:f("name"),value:i})]}),Object(w.jsxs)("div",{className:"newUserItem",children:[Object(w.jsx)("label",{children:"Commission"}),Object(w.jsx)(O.a,{placeholder:"commission",onChange:f("price"),value:j})]}),Object(w.jsxs)("div",{className:"newUserItem",children:[Object(w.jsx)("label",{children:"Price"}),Object(w.jsx)(O.a,{placeholder:"price",onChange:f("commission"),value:h})]}),Object(w.jsx)("div",{className:"file_upload",children:Object(w.jsx)(A.a,{children:Object(w.jsx)(p.a,{icon:Object(w.jsx)(E.a,{}),children:"Click to Upload"})})}),Object(w.jsx)("button",{onClick:m,className:"newUserButton",children:"Update"}),Object(w.jsx)("button",{onClick:function(){e.push("/category")},className:"newUserButton",children:"Cancel"})]})]})}var H=h.a.Title,F=O.a.Search,$=x.a.Content,q=function(){var e=Object(l.f)(),t=Object(c.useState)({role:"2  ",page:1,per_page:5,search:"",sort:""}),a=Object(b.a)(t,2),s=a[0],n=(a[1],Object(c.useState)([])),r=Object(b.a)(n,2),i=r[0],j=r[1],h=Object(c.useState)({current:1,pageSize:5}),O=Object(b.a)(h,2),x=O[0],N=O[1],y=Object(c.useState)(""),C=Object(b.a)(y,2),I=C[0],k=C[1],S=function(){var e=Object(u.a)(d.a.mark((function e(t,a,c){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(o.a)(Object(o.a)({},s),{},{page:t.current||s.page,search:I}),e.next=3,U(n,"/user/get_users").then((function(e){j(e.data.data.docs),console.log(e.data.data.docs),N({current:e.data.data.page,pageSize:5,total:e.data.data.totalDocs})}));case 3:case"end":return e.stop()}}),e)})));return function(t,a,c){return e.apply(this,arguments)}}();Object(c.useEffect)((function(){S(s)}),[s]);var _=[{title:"Username",render:function(e,t){return Object(w.jsx)("span",{title:"Username",children:t.name})}},{title:"Email",render:function(e,t){return Object(w.jsx)("span",{title:"Email",children:t.email})}},{title:"Phone",render:function(e,t){return Object(w.jsx)("span",{title:"Phone",children:t.phone})}},{title:"Action",key:"x",render:function(e,t){return Object(w.jsxs)(m.b,{size:"middle",children:[Object(w.jsx)(p.a,{onClick:function(){return e=t._id,console.log("----- here we are"),void U({id:e},"/user/delete_user").then((function(e){S(s)}));var e},children:"Delete"}),Object(w.jsx)(p.a,{onClick:function(){return L(t._id)},children:"Edit"})]})}}],L=function(t){e.push("/drivers/".concat(t))};return Object(w.jsxs)($,{style:{margin:"24px 16px",padding:24,minHeight:"calc(100vh - 114px)",background:"#fff"},children:[Object(w.jsxs)(f.a,{gutter:[40,0],children:[Object(w.jsx)(v.a,{span:18,children:Object(w.jsx)(H,{level:2,children:"User List"})}),Object(w.jsx)(v.a,{span:6,children:Object(w.jsx)(F,{placeholder:"input search text",allowClear:!0,onKeyUp:function(e){console.log("---\x3e",e.target.value),k(e.target.value),S(x)},style:{width:200}})})]}),Object(w.jsx)(f.a,{gutter:[40,0],children:Object(w.jsx)(v.a,{span:24,children:Object(w.jsx)(g.a,{columns:_,dataSource:i,onChange:S,pagination:x})})})]})},V=h.a.Title,Q=O.a.Search,Y=x.a.Content,G=function(){var e=Object(l.f)(),t=Object(c.useState)({role:"3",page:1,per_page:5,search:"",sort:""}),a=Object(b.a)(t,2),s=a[0],n=(a[1],Object(c.useState)([])),r=Object(b.a)(n,2),i=r[0],j=r[1],h=Object(c.useState)({current:1,pageSize:5}),O=Object(b.a)(h,2),x=O[0],N=O[1],y=Object(c.useState)(""),C=Object(b.a)(y,2),I=C[0],k=C[1],S=function(){var e=Object(u.a)(d.a.mark((function e(t,a,c){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(o.a)(Object(o.a)({},s),{},{page:t.current||s.page,search:I}),e.next=3,U(n,"/user/get_users").then((function(e){j(e.data.data.docs),console.log(e.data.data.docs),N({current:e.data.data.page,pageSize:5,total:e.data.data.totalDocs})}));case 3:case"end":return e.stop()}}),e)})));return function(t,a,c){return e.apply(this,arguments)}}();Object(c.useEffect)((function(){S(s)}),[s]);var _=[{title:"Username",render:function(e,t){return Object(w.jsx)("span",{title:"Username",children:t.name})}},{title:"Email",render:function(e,t){return Object(w.jsx)("span",{title:"Email",children:t.email})}},{title:"Phone",render:function(e,t){return Object(w.jsx)("span",{title:"Phone",children:t.phone})}},{title:"Action",key:"x",render:function(e,t){return Object(w.jsxs)(m.b,{size:"middle",children:[Object(w.jsx)(p.a,{onClick:function(){return e=t._id,console.log("----- here we are"),void U({id:e},"/user/delete_user").then((function(e){S(s)}));var e},children:"Delete"}),Object(w.jsx)(p.a,{onClick:function(){return L(t._id)},children:"View"})]})}}],L=function(t){e.push("/dashboard/user/".concat(t))};return Object(w.jsxs)(Y,{style:{margin:"24px 16px",padding:24,minHeight:"calc(100vh - 114px)",background:"#fff"},children:[Object(w.jsxs)(f.a,{gutter:[40,0],children:[Object(w.jsx)(v.a,{span:18,children:Object(w.jsx)(V,{level:2,children:"User List"})}),Object(w.jsx)(v.a,{span:6,children:Object(w.jsx)(Q,{placeholder:"input search text",allowClear:!0,onKeyUp:function(e){console.log("---\x3e",e.target.value),k(e.target.value),S(x)},style:{width:200}})})]}),Object(w.jsx)(f.a,{gutter:[40,0],children:Object(w.jsx)(v.a,{span:24,children:Object(w.jsx)(g.a,{columns:_,dataSource:i,onChange:S,pagination:x})})})]})},X=(a(571),{pending:"Update status to interviewed",interviewed:"Update status to trained",trained:"Update status to approved",approved:"Reject and Update status to pending"});function Z(){var e=Object(l.g)().id,t=Object(c.useState)([]),a=Object(b.a)(t,2),s=a[0],n=a[1],r=function(){console.log("id: -----\x3e ",e),U({id:e},"/user/get_user_detail").then((function(e){console.log("usersid=>>>>>",e.data),n(e.data.data.user_detail)}))};return Object(c.useEffect)((function(){r()}),[]),Object(w.jsxs)("div",{className:"user",children:[Object(w.jsx)("div",{className:"userTitleContainer",children:Object(w.jsx)("h1",{className:"userTitle",children:"Driver Edit"})}),Object(w.jsx)("div",{className:"userContainer",children:Object(w.jsxs)("div",{className:"userUpdate",children:[Object(w.jsxs)("div",{className:"userUpdateLeft",children:[Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Username"}),Object(w.jsx)("input",{type:"text",value:s.name,className:"userUpdateInput"})]}),Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Email"}),Object(w.jsx)("input",{type:"text",value:s.email,className:"userUpdateInput"})]}),Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Phone"}),Object(w.jsx)("input",{type:"text",value:s.phone,className:"userUpdateInput"})]}),Object(w.jsxs)("div",{className:"userUpdateItem",children:[Object(w.jsx)("label",{children:"Status"}),Object(w.jsx)("h4",{children:s.driver_status}),Object(w.jsx)("span",{children:Object(w.jsx)("button",{style:{padding:"5px",marginTop:10},onClick:function(){console.log("id: -----\x3e ",s);var t="pending";switch(s.driver_status){case"pending":t="interviewed";break;case"interviewed":t="trained";break;case"trained":t="approved";break;default:t="pending"}U({id:e,driver_status:t},"/user/update_driver_status").then((function(e){r()}))},children:X[s.driver_status]})})]})]}),Object(w.jsx)("div",{className:"userUpdateRight"})]})})]})}a(572);var ee=a.p+"static/media/logo.b7fbac13.png",te=a(636),ae=a(637);function ce(){return Object(w.jsx)("div",{className:"topbar",children:Object(w.jsxs)("div",{className:"topbarWrapper",children:[Object(w.jsx)("div",{className:"topLeft",children:Object(w.jsx)("img",{src:ee})}),Object(w.jsxs)("div",{className:"topRight",children:[Object(w.jsxs)("div",{className:"topbarIconContainer",children:[Object(w.jsx)(te.a,{}),Object(w.jsx)("span",{className:"topIconBadge",children:"2"})]}),Object(w.jsx)("div",{className:"topbarIconContainer",children:Object(w.jsx)(ae.a,{})})]})]})})}a(573);var se=a(638),ne=a(639),re=a(640),ie=a(641),le=a(642),je=a(643),de=a(644),oe=a(645),ue=a(646),be=a(647),he=a(648),Oe=a(649);function xe(){return Object(w.jsx)("div",{className:"sidebar",children:Object(w.jsxs)("div",{className:"sidebarWrapper",children:[Object(w.jsxs)("div",{className:"sidebarMenu",children:[Object(w.jsx)("h3",{className:"sidebarTitle",children:"Dashboard"}),Object(w.jsxs)("ul",{className:"sidebarList",children:[Object(w.jsx)(i.b,{to:"/",className:"link",children:Object(w.jsxs)("li",{className:"sidebarListItem active",children:[Object(w.jsx)(se.a,{className:"sidebarIcon"}),"Home"]})}),Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(ne.a,{className:"sidebarIcon"}),"Analytics"]}),Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(re.a,{className:"sidebarIcon"}),"Sales"]})]})]}),Object(w.jsxs)("div",{className:"sidebarMenu",children:[Object(w.jsx)("h3",{className:"sidebarTitle",children:"Quick Menu"}),Object(w.jsxs)("ul",{className:"sidebarList",children:[Object(w.jsx)(i.b,{to:"/users",className:"link",children:Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(ie.a,{className:"sidebarIcon"}),"Users"]})}),Object(w.jsx)(i.b,{to:"/driver",className:"link",children:Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(le.a,{className:"sidebarIcon"}),"Driver"]})}),Object(w.jsx)(i.b,{to:"/caregiver",children:Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(je.a,{className:"sidebarIcon"}),"Caregiver"]})}),Object(w.jsx)(i.b,{to:"/category",children:Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(de.a,{className:"sidebarIcon"}),"Category"]})})]})]}),Object(w.jsxs)("div",{className:"sidebarMenu",children:[Object(w.jsx)("h3",{className:"sidebarTitle",children:"Notifications"}),Object(w.jsxs)("ul",{className:"sidebarList",children:[Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(oe.a,{className:"sidebarIcon"}),"Mail"]}),Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(ue.a,{className:"sidebarIcon"}),"Feedback"]}),Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(be.a,{className:"sidebarIcon"}),"Messages"]})]})]}),Object(w.jsxs)("div",{className:"sidebarMenu",children:[Object(w.jsx)("h3",{className:"sidebarTitle",children:"Staff"}),Object(w.jsxs)("ul",{className:"sidebarList",children:[Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(he.a,{className:"sidebarIcon"}),"Manage"]}),Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(ne.a,{className:"sidebarIcon"}),"Analytics"]}),Object(w.jsxs)("li",{className:"sidebarListItem",children:[Object(w.jsx)(Oe.a,{className:"sidebarIcon"}),"Reports"]})]})]})]})})}a(574);var me=a(650),pe=a(651);function fe(){return Object(w.jsxs)("div",{className:"featured",children:[Object(w.jsxs)("div",{className:"featuredItem",children:[Object(w.jsx)("span",{className:"featuredTitle",children:"Revanue"}),Object(w.jsxs)("div",{className:"featuredMoneyContainer",children:[Object(w.jsx)("span",{className:"featuredMoney",children:"$2,415"}),Object(w.jsxs)("span",{className:"featuredMoneyRate",children:["-11.4 ",Object(w.jsx)(me.a,{className:"featuredIcon negative"})]})]}),Object(w.jsx)("span",{className:"featuredSub",children:"Compared to last month"})]}),Object(w.jsxs)("div",{className:"featuredItem",children:[Object(w.jsx)("span",{className:"featuredTitle",children:"Sales"}),Object(w.jsxs)("div",{className:"featuredMoneyContainer",children:[Object(w.jsx)("span",{className:"featuredMoney",children:"$4,415"}),Object(w.jsxs)("span",{className:"featuredMoneyRate",children:["-1.4 ",Object(w.jsx)(me.a,{className:"featuredIcon negative"})]})]}),Object(w.jsx)("span",{className:"featuredSub",children:"Compared to last month"})]}),Object(w.jsxs)("div",{className:"featuredItem",children:[Object(w.jsx)("span",{className:"featuredTitle",children:"Cost"}),Object(w.jsxs)("div",{className:"featuredMoneyContainer",children:[Object(w.jsx)("span",{className:"featuredMoney",children:"$2,225"}),Object(w.jsxs)("span",{className:"featuredMoneyRate",children:["+2.4 ",Object(w.jsx)(pe.a,{className:"featuredIcon"})]})]}),Object(w.jsx)("span",{className:"featuredSub",children:"Compared to last month"})]})]})}a(575),a(576),a(652);a(577);function ve(){return Object(w.jsxs)("div",{className:"home",children:[Object(w.jsx)(fe,{}),Object(w.jsx)(W,{data:T,title:"User Analytics",grid:!0,dataKey:"Active User"}),Object(w.jsx)("div",{className:"homeWidgets"})]})}var ge=h.a.Title,Ne=O.a.Search,ye=x.a.Content,Ue=function(){var e=Object(l.f)(),t=Object(c.useState)({page:1,per_page:5,search:"",sort:""}),a=Object(b.a)(t,2),s=a[0],n=(a[1],Object(c.useState)([])),r=Object(b.a)(n,2),i=r[0],j=r[1],o=Object(c.useState)({current:1,pageSize:5}),h=Object(b.a)(o,2),O=h[0],x=(h[1],Object(c.useState)("")),N=Object(b.a)(x,2),y=(N[0],N[1],function(){var e=Object(u.a)(d.a.mark((function e(t,a,c){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,U(s,"/category/get_category").then((function(e){j(e.data.data.category),console.log(e.data.data.category)}));case 2:case"end":return e.stop()}}),e)})));return function(t,a,c){return e.apply(this,arguments)}}());Object(c.useEffect)((function(){y(s)}),[s]);var C=[{title:"Name",render:function(e,t){return Object(w.jsx)("span",{title:"Name",children:t.name})}},{title:"Price",render:function(e,t){return Object(w.jsx)("span",{title:"Price",children:t.price})}},{title:"Commission",render:function(e,t){return Object(w.jsx)("span",{title:"Commission",children:t.commission})}},{title:"Image",render:function(e,t){return Object(w.jsx)("span",{title:"Image",children:t.image})}},{title:"Action",key:"x",render:function(e,t){return Object(w.jsxs)(m.b,{size:"middle",children:[Object(w.jsx)(p.a,{onClick:function(){return I(t._id)},children:"Edit"}),Object(w.jsx)(p.a,{onClick:function(){return e=t.id,console.log("----- here we are"),U({id:e},"/category/delete_category"),void y(s);var e},children:"Delete"})]})}}],I=function(t){e.push("/categories/".concat(t))};return Object(w.jsxs)(ye,{style:{margin:"24px 16px",padding:24,minHeight:"calc(100vh - 114px)",background:"#fff"},children:[Object(w.jsxs)(f.a,{gutter:[40,0],children:[Object(w.jsxs)(v.a,{span:18,children:[Object(w.jsx)(ge,{level:2,children:"Category List"}),Object(w.jsx)(p.a,{style:{margin:"2px 2px 2px 2px",width:"100px",background:"orange"},onClick:function(){e.push("/newUser")},children:"Create"})]}),Object(w.jsx)(v.a,{span:6,children:Object(w.jsx)(Ne,{placeholder:"input search text",allowClear:!0,style:{width:200}})})]}),Object(w.jsx)(f.a,{gutter:[40,0],children:Object(w.jsx)(v.a,{span:24,children:Object(w.jsx)(g.a,{columns:C,dataSource:i,onChange:y,pagination:O})})})]})},we=function(){return Object(w.jsxs)(i.a,{children:[Object(w.jsx)(ce,{}),Object(w.jsxs)("div",{className:"container",style:{display:"flex",marginTop:"10px"},children:[Object(w.jsx)(xe,{}),Object(w.jsxs)(l.c,{children:[Object(w.jsx)(l.a,{exact:!0,path:"/",children:Object(w.jsx)(ve,{})}),Object(w.jsx)(l.a,{path:"/users",children:Object(w.jsx)(S,{})}),Object(w.jsx)(l.a,{path:"/user/:id",children:Object(w.jsx)(_,{})}),Object(w.jsx)(l.a,{path:"/driver",children:Object(w.jsx)(q,{})}),Object(w.jsx)(l.a,{path:"/drivers/:id",children:Object(w.jsx)(Z,{})}),Object(w.jsx)(l.a,{path:"/caregiver",children:Object(w.jsx)(G,{})}),Object(w.jsx)(l.a,{path:"/category",children:Object(w.jsx)(Ue,{})}),Object(w.jsx)(l.a,{path:"/categories/:id",children:Object(w.jsx)(J,{})}),Object(w.jsx)(l.a,{path:"/newUser",children:Object(w.jsx)(K,{})})]})]})]})},Ce=(a(578),a(365)),Ie=a(657),ke=a(653),Se=a(585),_e=a(283),Le=a(148),Ae=function(){var e=Object(l.f)(),t=Object(c.useState)({email:"",password:""}),a=Object(b.a)(t,2),s=a[0],n=a[1],r=s.email,i=s.password;Object(c.useEffect)((function(){localStorage.getItem("adminLogin")===r?e.push({pathname:"/"}):e.push({pathname:"/admin"})}),[]);var j=function(e){return function(t){n(Object(o.a)(Object(o.a)({},s),{},Object(L.a)({error:!1},e,t.target.value)))}},h=function(){var t=Object(u.a)(d.a.mark((function t(){var a;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==r&&""!==i){t.next=4;break}console.log("Please fill data"),t.next=9;break;case 4:return t.next=6,U({email:r,password:i},"/auth/admin_login");case 6:a=t.sent,console.log(a.data),a.data.status&&(localStorage.setItem("adminLogin",r),e.push("/"));case 9:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(w.jsx)("div",{children:Object(w.jsx)(Ie.a,{sx:{backgroundColor:"background.default",display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"},children:Object(w.jsx)(ke.a,{maxWidth:"sm",children:Object(w.jsx)(Ce.a,{children:Object(w.jsxs)("form",{children:[Object(w.jsxs)(Ie.a,{sx:{mb:3},children:[Object(w.jsx)(Se.a,{color:"textPrimary",variant:"h2",children:"Sign in"}),Object(w.jsx)(Se.a,{color:"textSecondary",gutterBottom:!0,variant:"body2",children:"Sign in on the internal platform"})]}),Object(w.jsx)(_e.a,{fullWidth:!0,label:"Email Address..",margin:"normal",name:"email",type:"email",value:r,variant:"outlined",onChange:j("email"),required:!0}),Object(w.jsx)(_e.a,{fullWidth:!0,label:"Password",margin:"normal",name:"password",type:"password",onChange:j("password"),value:i,variant:"outlined",required:!0}),Object(w.jsx)(Ie.a,{sx:{py:2},children:Object(w.jsx)(Le.a,{color:"primary",fullWidth:!0,size:"large",variant:"contained",onClick:h,children:"Sign in"})})]})})})})})};var Ee=function(){return Object(w.jsx)(i.a,{children:Object(w.jsxs)(l.c,{children:[Object(w.jsx)(l.a,{exact:!0,path:"/admin",children:Object(w.jsx)(Ae,{})}),Object(w.jsx)(l.a,{exact:!0,path:"/",children:Object(w.jsx)(we,{})})]})})};r.a.render(Object(w.jsx)(s.a.StrictMode,{children:Object(w.jsx)(Ee,{})}),document.getElementById("root"))}},[[579,1,2]]]);
//# sourceMappingURL=main.a17ef7e2.chunk.js.map