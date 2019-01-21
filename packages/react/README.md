Blog-o-Matic React
===
`@blog-o-matic/react` is a library of Blog-o-Matic-aware React components. These components are also used to build the Blog-o-Matic editor. A component library is helpful because it lets us take advantage of end-to-end awareness of context.

For Example...
---

### Progressive Image Component
```jsx
import { ProgressiveImage } from "@blog-o-matic/react"

// 1. Load and blurs image https://static.bpev.me/micro/my-image.WebP
// 2. Load image https://static.bpev.me/medium/my-image.WebP
// 3. On-click, show image https://static.bpev.me/large/my-image.WebP
<ProgressiveImage src="/my-image.jpg" />
```

### Context
```jsx
import { Blog, Post } from "@blog-o-matic/react"

<Blog root="https://static.bpev.me">
  {/* Images already have width/height available via post metadata + context */}
  {/* Image lists are combined into tile */}
  <Post name="my-blog-post" />
</Blog>
```

Usage
---
Blog-o-Matic depends on use of [Civility]() (and by extension, [Basscss](http://basscss.com/)) styles. It uses [Highlight.js]() for code snippets.

```css
@import "@civility/stylesheets/dist/civility.css";
@import "highlight.js/styles/ocean.css";
```

```jsx

```
