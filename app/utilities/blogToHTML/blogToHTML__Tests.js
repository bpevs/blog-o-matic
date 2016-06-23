import { expect } from "chai";
import { spy } from "sinon";
import blogToHTML from "app/utilities/blogToHTML";
import path from "path";

describe("BlogToHTML", function() {
  beforeEach(function() {
    this.blogDir = path.resolve("./test/fixtures/repos/testBlog");
  });

  it("Should have posts with metadata and HTML", function() {
    return blogToHTML(this.blogDir)
      .then(function(postsObj) {
        const post1 = postsObj["test-post-1"].meta;
        const post2 = postsObj["test-post-2"].meta;

        expect(post1.title).to.equal("Test Post");
        expect(post2.title).to.equal("Test Post 2");

        expect(post1.alias).to.equal("test-post-1");
        expect(post2.alias).to.equal("test-post-2");

        expect(post2.date).to.equal("03/22/2015");
        expect(post1.date).to.equal("03/12/2015");

        expect(post1.description).to.equal("The numba 1 blog post");
        expect(post2.description).to.equal("The numba 2 blog post");

        expect(post1.authors[0]).to.equal("Author 1");
        expect(post1.authors[1]).to.equal("Author 2");
        expect(post2.authors[0]).to.equal("Author 1");
        expect(post2.authors[1]).to.equal("Author 2");

        expect(post1.tags[0]).to.equal("tag-1");
        expect(post1.tags[1]).to.equal("tag-2");
        expect(post2.tags[0]).to.equal("tag-1");
        expect(post2.tags[1]).to.equal("tag-2");

        expect(postsObj["test-post-1"].post.match(/<h2>/g)).to.exist;
      });
  });
});
