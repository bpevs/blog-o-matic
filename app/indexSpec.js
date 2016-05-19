import { expect } from "chai";
import sinon from "sinon";
const blogInjector = require("inject!app/index");
var Blog;

describe("Blog-o-matic", function() {
  beforeEach(function() {
    this.mockTransformer = sinon.stub().returns(Promise.resolve());
    this.mockGitConnect = {
      checkout: sinon.stub().returns(Promise.resolve()),
      clone:    sinon.stub().returns(Promise.resolve()),
      destroy:  sinon.stub().returns(Promise.resolve()),
      hasRepo:  sinon.stub().returns(Promise.resolve()),
      reset:    sinon.stub().returns(Promise.resolve())
    };

    Blog = blogInjector({
      "app/utilities/transformer": this.mockTransformer,
      "app/utilities/gitConnect": this.mockGitConnect
    }).default;

    this.origin = "https://github.com/Blanket-Warriors/Blog";
    this.root = "/public/repos";
    this.branch = "2.0";
    this.blog = new Blog(this.origin, this.root);
  });

  it("Should initialize a blog with master branch default", function() {
    const { remote, name, branch, updating } = this.blog;
    expect(remote).to.equal(this.origin);
    expect(name).to.equal("Blog");
    expect(branch).to.equal("master");
  });

  it("Should be able to initialize a blog with a branch", function() {
    this.blog = new Blog(this.origin, this.root, {branch: this.branch});
    expect(this.branch).to.equal(this.branch);
  });

  it("Should initialize with the directories for all repos and for our specific repo", function() {
    expect(this.blog.rootDirectory).to.contain(this.root);
    expect(this.blog.repoDirectory).to.contain(`${this.root}/${this.blog.name}`);
  });

  it("Should call gitConnect on a repo update", function() {
    return this.blog.update().then(posts => {
      expect(this.mockGitConnect.reset.called).to.equal(true);
      expect(this.mockGitConnect.checkout.called).to.equal(true);
      expect(this.mockGitConnect.clone.called).to.equal(true);
      expect(this.mockTransformer.called).to.equal(true);
      expect(this.blog._updating).to.equal(false);
    });
  });

  it("Should call gitConnect when a repo is destroyed", function() {
    const blogName = this.blog.name;
    return this.blog.destroy().then(blogName => {
      expect(this.mockGitConnect.destroy.called).to.equal(true);
    });
  });
});
