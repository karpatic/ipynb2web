"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[811],{434:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>s,metadata:()=>r,toc:()=>l});var o=i(5893),t=i(1151);const s={},a="FAQ",r={id:"overview/faq",title:"FAQ",description:"What is ipynb2web?",source:"@site/docs/overview/faq.md",sourceDirName:"overview",slug:"/overview/faq",permalink:"/docs/overview/faq",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Server Side",permalink:"/docs/overview/server"}},d={},l=[{value:"What is ipynb2web?",id:"what-is-ipynb2web",level:3},{value:"What makes ipynb2web unique?",id:"what-makes-ipynb2web-unique",level:3},{value:"Usage",id:"usage",level:2},{value:"How do I install ipynb2web?",id:"how-do-i-install-ipynb2web",level:3},{value:"How do I convert a Jupyter notebook to JSON using ipynb2web?",id:"how-do-i-convert-a-jupyter-notebook-to-json-using-ipynb2web",level:3},{value:"Can I use ipynb2web in the browser?",id:"can-i-use-ipynb2web-in-the-browser",level:3},{value:"Features and Functionality",id:"features-and-functionality",level:2},{value:"What core features does ipynb2web offer?",id:"what-core-features-does-ipynb2web-offer",level:3},{value:"How does ipynb2web handle Markdown and code cells?",id:"how-does-ipynb2web-handle-markdown-and-code-cells",level:3},{value:"What are some key commands in the ipynb2web CLI?",id:"what-are-some-key-commands-in-the-ipynb2web-cli",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"What if my notebook isn&#39;t converting properly?",id:"what-if-my-notebook-isnt-converting-properly",level:3},{value:"How can I get detailed API documentation?",id:"how-can-i-get-detailed-api-documentation",level:3},{value:"Contact and Support",id:"contact-and-support",level:2},{value:"How can I report an issue or request a feature?",id:"how-can-i-report-an-issue-or-request-a-feature",level:3},{value:"Where can I find more examples and usage instructions?",id:"where-can-i-find-more-examples-and-usage-instructions",level:3}];function c(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,t.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"faq",children:"FAQ"}),"\n",(0,o.jsx)(n.h3,{id:"what-is-ipynb2web",children:"What is ipynb2web?"}),"\n",(0,o.jsx)(n.p,{children:"Ipynb2web is a tool designed to convert Interactive Python Notebooks (.ipynb) into web-ready, static assets compatible with various templates."}),"\n",(0,o.jsx)(n.h3,{id:"what-makes-ipynb2web-unique",children:"What makes ipynb2web unique?"}),"\n",(0,o.jsxs)(n.p,{children:["Unlike other tools like Pandoc or Sphinx, ipynb2web allows for the inclusion of ",(0,o.jsx)(n.code,{children:"yaml"})," metadata, special ",(0,o.jsx)(n.code,{children:"#flags"})," for output formatting, and the addition of minimally opinionated content through specific ",(0,o.jsx)(n.code,{children:"markup"}),"."]}),"\n",(0,o.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,o.jsx)(n.h3,{id:"how-do-i-install-ipynb2web",children:"How do I install ipynb2web?"}),"\n",(0,o.jsx)(n.p,{children:"For Node.js environments:"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-bash",children:"npm install ipynb2web\n"})}),"\n",(0,o.jsx)(n.h3,{id:"how-do-i-convert-a-jupyter-notebook-to-json-using-ipynb2web",children:"How do I convert a Jupyter notebook to JSON using ipynb2web?"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-javascript",children:"const preparedJsonAsset = ipynb2web.nb2json(url);\r\n// Returns: { meta: { ... }, content: { ... } }\n"})}),"\n",(0,o.jsx)(n.h3,{id:"can-i-use-ipynb2web-in-the-browser",children:"Can I use ipynb2web in the browser?"}),"\n",(0,o.jsx)(n.p,{children:"Yes, ipynb2web can be included via CDN and used to convert notebooks to JSON in the browser."}),"\n",(0,o.jsx)(n.h2,{id:"features-and-functionality",children:"Features and Functionality"}),"\n",(0,o.jsx)(n.h3,{id:"what-core-features-does-ipynb2web-offer",children:"What core features does ipynb2web offer?"}),"\n",(0,o.jsxs)(n.ol,{children:["\n",(0,o.jsx)(n.li,{children:"Conversion of .ipynb documents to JSON for web templates."}),"\n",(0,o.jsx)(n.li,{children:"Rendering of assets on the server or browser."}),"\n",(0,o.jsx)(n.li,{children:"Custom template creation and integration."}),"\n",(0,o.jsx)(n.li,{children:"Automated handling of intricate details like system logs and error messages."}),"\n"]}),"\n",(0,o.jsx)(n.h3,{id:"how-does-ipynb2web-handle-markdown-and-code-cells",children:"How does ipynb2web handle Markdown and code cells?"}),"\n",(0,o.jsx)(n.p,{children:"Markdown cells support footnotes, breakouts, and HTML embedding. Code cells can be processed with flags for specific behaviors like collapsing, hiding, or executing JavaScript/HTML."}),"\n",(0,o.jsx)(n.h3,{id:"what-are-some-key-commands-in-the-ipynb2web-cli",children:"What are some key commands in the ipynb2web CLI?"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["Convert notebooks to JSON: ",(0,o.jsx)(n.code,{children:'ipynb2web DirectoryName "custom/SAVETO/path/" "custom/FROM/path/"'})]}),"\n",(0,o.jsxs)(n.li,{children:["Generate a sitemap: ",(0,o.jsx)(n.code,{children:'ipynb2web sitemap "custom/sitemap/path.txt"'})]}),"\n",(0,o.jsxs)(n.li,{children:["Create audio assets: ",(0,o.jsx)(n.code,{children:'ipynb2web audio "custom/SAVETO/path/" "custom/FROM/path/"'})]}),"\n"]}),"\n",(0,o.jsx)(n.h2,{id:"troubleshooting",children:"Troubleshooting"}),"\n",(0,o.jsx)(n.h3,{id:"what-if-my-notebook-isnt-converting-properly",children:"What if my notebook isn't converting properly?"}),"\n",(0,o.jsx)(n.p,{children:"Ensure that the YAML metadata is correctly formatted and that the notebook follows the guidelines for flags and markup."}),"\n",(0,o.jsx)(n.h3,{id:"how-can-i-get-detailed-api-documentation",children:"How can I get detailed API documentation?"}),"\n",(0,o.jsxs)(n.p,{children:["Visit the official documentation: ",(0,o.jsx)(n.a,{href:"https://karpatic.github.io/ipynb2web/jsdocs",children:"ipynb2web API Documentation"})]}),"\n",(0,o.jsx)(n.h2,{id:"contact-and-support",children:"Contact and Support"}),"\n",(0,o.jsx)(n.h3,{id:"how-can-i-report-an-issue-or-request-a-feature",children:"How can I report an issue or request a feature?"}),"\n",(0,o.jsx)(n.p,{children:"Issues and feature requests can be submitted through the project's GitHub repository."}),"\n",(0,o.jsx)(n.h3,{id:"where-can-i-find-more-examples-and-usage-instructions",children:"Where can I find more examples and usage instructions?"}),"\n",(0,o.jsxs)(n.p,{children:["For comprehensive guides and examples, visit the official website: ",(0,o.jsx)(n.a,{href:"https://karpatic.github.io/ipynb2web/docs/overview",children:"ipynb2web Documentation"})]})]})}function h(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>r,a:()=>a});var o=i(7294);const t={},s=o.createContext(t);function a(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);