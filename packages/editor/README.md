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

Markdown Spec
===
All Blog-o-Matic markdown is valid [Github Markdown](https://github.github.com/gfm/).

Blog-o-Matic also introduces custom entity groups, which will be described in this document. These entities are additive to Github Markdown (for example, a list of images will turn into an image group).

Blog-o-Matic Entities
---
- Image Group: Responsive groups of images
- Playlist: Read a playlist file as a playlist.
- Music: Read a music link as a playable sound

Styled Entities
---
Read url params from content, adjusting behavior as necessary.
- Styled Image: Progressive loading, image size control, parallaxing/animation
- Styled Playlist: Show a playable playlist, be able to play simultaneous, etc.
