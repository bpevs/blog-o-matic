import sinon from "sinon";
export default {
  checkout: sinon.stub().returns(Promise.resolve()),
  clone:    sinon.stub().returns(Promise.resolve()),
  destroy:  sinon.stub().returns(Promise.resolve()),
  hasRepo:  sinon.stub().returns(Promise.resolve()),
  reset:    sinon.stub().returns(Promise.resolve())
};
