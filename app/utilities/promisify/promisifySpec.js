import { expect } from "chai";
import { spy } from "sinon";
import promisify from "app/utilities/promisify";

describe("Promisify", function() {
  beforeEach(function() {
    this.data = null;
    this.error = null;
    this.callback = null;
    this.nodeMethod = spy(callback => {
      this.callback = spy(callback);
      setTimeout(() => this.callback(this.error, this.data), 20);
    });
  });

  it("Should correctly handle a single response", function() {
    this.data = "data";
    this.error = null;
    const nodePromise = promisify(this.nodeMethod);
    return nodePromise()
      .then(data => {
        expect(data).to.equal(this.data);
        expect(this.nodeMethod.calledOnce).to.be.true;
        expect(this.callback.calledOnce).to.be.true;
        return Promise.resolve();
      });
  });

  it("Should correctly handle errors", function() {
    this.data = "data";
    this.error = new Error("My Error");

    const nodePromise = promisify(this.nodeMethod);
    return nodePromise()
      .then(data => {
        return Promise.reject(new Error("Promise should not succeed!"));
      }, error => {
        expect(error).to.exist;
        expect(error).to.equal(this.error);
        expect(this.nodeMethod.calledOnce).to.be.true;
        expect(this.callback.calledOnce).to.be.true;
        return Promise.resolve();
      });
  });

  it("Should handle multiple arguments", function() {
    this.data = "data";
    this.error = null;
    this.nodeMethod = spy((arg1, arg2, arg3, callback) => {
      this.callback = spy(callback);
      setTimeout(() => this.callback(this.error, this.data), 20);
    });

    const args = [1, 2, 3];

    const nodePromise = promisify(this.nodeMethod);
    return nodePromise.apply(this, args)
      .then(data => {
        expect(data).to.equal(this.data);
        expect(this.nodeMethod.calledOnce).to.be.true;
        const nodeMethodArgs = this.nodeMethod.getCall(0).args;
        expect(nodeMethodArgs[0]).to.equal(args[0]);
        expect(nodeMethodArgs[1]).to.equal(args[1]);
        expect(nodeMethodArgs[2]).to.equal(args[2]);

        expect(this.callback.calledOnce).to.be.true;
        const callbackArgs = this.callback.getCall(0).args;
        expect(callbackArgs[0]).to.be.null;
        expect(callbackArgs[1]).to.equal(this.data);
        return Promise.resolve();
      });
  });
});
