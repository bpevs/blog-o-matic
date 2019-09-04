export const channelTemplate = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0">
  <channel>
    <title><%= meta.title %></title>
    <link><%= meta.permalink %></link>
    <description><%= meta.description %></description>
    <% posts.forEach(function(post){ %>
      <item>
        <title><%= post.frontmatter.title %></title>
        <link><%= post.frontmatter.permalink %></link>
        <guid><%= post.frontmatter.permalink %></guid>
        <pubDate><%= post.frontmatter.releaseDate %></pubDate>
        <description><%- post.htmlBody %></description>
        </item>
      <item>
    <% }); %>
  </channel>
</rss>
`
