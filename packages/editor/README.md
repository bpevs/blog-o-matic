Blog-o-Matic Editor
===
Server and GUI for the Editor used in cli's `edit` command. When initialized locally, we can essentially create a lighter-weight, cross-browser [Electron](https://electronjs.org/)-esqe experience that runs in a browser. This client can also be exported separately for use in a website, but it will only make api calls. I don't expect anyone to actually use this to actually edit their blog online. If after building this, it doesn't seem like a useful export, I will probably bundle it into `@blog-o-matic/cli`. It might become useful if we actually make a real [Electron](https://electronjs.org/) executable. However I don't see this happening in the near future at all.

The editor is built with create-react-app, and served with an express server.

Usage
---
```html
<!-- Client might just export a whole site script, tbh -->
<script src="node_modules/@blog-o-matic/editor/client"></script>
```
