"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[681],{9020:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>a,frontMatter:()=>t,metadata:()=>d,toc:()=>l});var s=r(5893),i=r(1151);const t={},o="Ipynb2Web",d={id:"overview/README",title:"Ipynb2Web",description:"npm version",source:"@site/docs/overview/README.md",sourceDirName:"overview",slug:"/overview/",permalink:"/ipynb2web/docs/overview/",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",next:{title:"Getting Started",permalink:"/ipynb2web/docs/overview/getting-started"}},c={},l=[{value:"CDN",id:"cdn",level:2},{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2},{value:"CLI",id:"cli",level:3},{value:"Node.js",id:"nodejs",level:3},{value:"Browser (Non Module)",id:"browser-non-module",level:3},{value:"Browser (ESM Module)",id:"browser-esm-module",level:3}];function p(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",...(0,i.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"ipynb2web",children:"Ipynb2Web"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://badge.fury.io/js/ipynb2web",children:(0,s.jsx)(n.img,{src:"https://badge.fury.io/js/ipynb2web.svg",alt:"npm version"})}),"\r\n",(0,s.jsx)(n.a,{href:"http://hits.dwyl.com/karpatic/ipynb2web",children:(0,s.jsx)(n.img,{src:"https://hits.dwyl.com/karpatic/ipynb2web.svg?style=flat-square",alt:"HitCount"})}),"\r\n",(0,s.jsx)(n.img,{src:"https://img.shields.io/github/downloads/karpatic/ipynb2web/total",alt:"GitHub Downloads (all assets, all releases)"}),"\r\n",(0,s.jsx)(n.img,{src:"https://img.shields.io/github/repo-size/karpatic/ipynb2web",alt:"GitHub repo size"}),"\r\n",(0,s.jsx)(n.a,{href:"https://opensource.org/licenses/MIT",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/License-MIT-yellow.svg",alt:"License: MIT"})}),"\r\n",(0,s.jsx)(n.a,{href:"https://nodei.co/npm/ipynb/",children:(0,s.jsx)(n.img,{src:"https://nodei.co/npm/ipynb.png",alt:"NPM"})})]}),"\n",(0,s.jsxs)(n.p,{children:["This project is complete with dedicated ",(0,s.jsx)(n.a,{href:"https://karpatic.github.io/ipynb2web/jsdocs/",children:"API"})," and also ",(0,s.jsx)(n.a,{href:"https://karpatic.github.io/ipynb2web",children:"usage"})," documentation. Read below to get started."]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Process Ipynb's into JSON assets ready for website templating."}),"\n",(0,s.jsx)(n.li,{children:"Light weight with minimal dependencies"}),"\n",(0,s.jsx)(n.li,{children:"For client and servers. Available in all forms and flavors."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Both Server and Client side implementations can be used to get a ",(0,s.jsx)(n.code,{children:"{content, meta}"})," object."]}),"\n",(0,s.jsx)(n.p,{children:"The server-side implementation can traverse directories and create JSON assets for directory-based navigation - which can ve used to generate a sitemaps.txt and produce accompanying image and audio-transcription assets using openAI."}),"\n",(0,s.jsx)(n.h2,{id:"cdn",children:"CDN"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://cdn.jsdelivr.net/npm/ipynb2web@latest",children:"https://cdn.jsdelivr.net/npm/ipynb2web@latest"})}),"\n",(0,s.jsx)(n.p,{children:"or"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://unpkg.com/ipynb2web@latest",children:"https://unpkg.com/ipynb2web@latest"})}),"\n",(0,s.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"npm install ipynb2web\n"})}),"\n",(0,s.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,s.jsxs)(n.p,{children:["You convert a notebook with: ",(0,s.jsx)(n.code,{children:"nb2json(path)"})]}),"\n",(0,s.jsx)(n.h3,{id:"cli",children:"CLI"}),"\n",(0,s.jsx)(n.p,{children:"In its most generic form, the cli is executed like so:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"ipynb2web <COMMAND> <SAVETO> <FROM/or/SitemapName>\n"})}),"\n",(0,s.jsx)(n.p,{children:"It's is best demonstrated through sequential use all 3 of it's commands."}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Convert directories with ipynb's to json docs"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"and"}),"\n",(0,s.jsxs)(n.ol,{start:"2",children:["\n",(0,s.jsx)(n.li,{children:"Create Navigation json for each directory:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'ipynb2web DirectoryName "custom/SAVETO/path/" "custom/FROM/path/"\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"3",children:["\n",(0,s.jsx)(n.li,{children:"Create a Sitemap.txt from multiple section navigations:"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'ipynb2web sitemap "custom/sitemap/path.txt\n'})}),"\n",(0,s.jsxs)(n.ol,{start:"4",children:["\n",(0,s.jsxs)(n.li,{children:["Create Audio versions of the documents if the ipynb frontmatter requests it. Requires ",(0,s.jsx)(n.code,{children:"OPENAI_API_KEY"})," stored in your ",(0,s.jsx)(n.code,{children:".env"})," file:"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"ipynb2web audio\n"})}),"\n",(0,s.jsx)(n.h3,{id:"nodejs",children:"Node.js"}),"\n",(0,s.jsx)(n.p,{children:"Import using ESM:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"// import { ipynb2web } from './../src/node.js';\r\n// or\r\nimport ipynb2web from './../src/node.js';\n"})}),"\n",(0,s.jsx)(n.p,{children:"Import using CJS:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"// const ipynb2web = require('../dist/ipynb2web.cjs').default;\r\n// or\r\nconst { ipynb2web } = require('../dist/ipynb2web.cjs');\n"})}),"\n",(0,s.jsx)(n.p,{children:"Usage:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"const prepairedJsonAsset = ipynb2web.nb2json(url)\n"})}),"\n",(0,s.jsx)(n.p,{children:"Returns:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"{ meta: { ... }, content: { ... } }\n"})}),"\n",(0,s.jsx)(n.h3,{id:"browser-non-module",children:"Browser (Non Module)"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>\r\n    <script>console.log(window.marked)<\/script>\r\n    <script src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.umd.js"><\/script>\r\n</head>\r\n<body>\r\n    <script>\r\n        const url = \'https://api.charleskarpati.com/vanillapivottable/index.ipynb\';\r\n        // Either:\r\n        // ipynb2web.nb2json(url)\r\n        // or\r\n        ipynb2web.nb2json(url)\r\n        // returns: { meta: { ... }, content: { ... } }\r\n    <\/script>\r\n</body>\r\n</html>\n'})}),"\n",(0,s.jsx)(n.h3,{id:"browser-esm-module",children:"Browser (ESM Module)"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    \x3c!--\r\n    // Module import method 1\r\n    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>\r\n    <script type="module" src="https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs"><\/script>\r\n    --\x3e\r\n</head>\r\n<body>\r\n    \x3c!--\r\n    <script type="module">\r\n        // Module method 1 continued ...\r\n        const url = \'https://api.charleskarpati.com/vanillapivottable/index.ipynb\';\r\n        ipynb2web.nb2json(url)\r\n        // returns: { meta: { ... }, content: { ... } }\r\n    <\/script>\r\n    --\x3e\r\n    <script type="module">\r\n        // Module import method 2\r\n        import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";\r\n        const url = \'https://api.charleskarpati.com/vanillapivottable/index.ipynb\';\r\n        // Either\r\n        // import ipynb2web from \'https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs\';\r\n        // ipynb2web.nb2json(url)\r\n        // or\r\n        import { ipynb2web } from \'https://cdn.jsdelivr.net/npm/ipynb2web@1.0.23/dist/ipynb2web.browser.mjs\';\r\n        ipynb2web.nb2json(url)\r\n        // returns: { meta: { ... }, content: { ... } }\r\n    <\/script>\r\n</body>\r\n</html>\n'})})]})}function a(e={}){const{wrapper:n}={...(0,i.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},1151:(e,n,r)=>{r.d(n,{Z:()=>d,a:()=>o});var s=r(7294);const i={},t=s.createContext(i);function o(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);