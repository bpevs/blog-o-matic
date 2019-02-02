export const template = `<html>
  <head>
    <% if (frontmatter) { %>
      <title><%= frontmatter.title %></title>
    <% } %>
  </head>
  <body>
    <%- blog %>
  </body>
</html>`
