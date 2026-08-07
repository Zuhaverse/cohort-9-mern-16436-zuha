const { expect } = require("chai");
const sinon = require("sinon");

const { validateLogin } = require("../middleware/validationMiddleware");

describe("Validation Middleware", function () {
  it("should return an error for invalid email format", function () {
    const req = {
      body: {
        email: "invalidemail",
        password: "123456",
      },
    };

    const res = {};

    const next = sinon.spy();

    validateLogin(req, res, next);

    expect(next.calledOnce).to.be.true;

    const error = next.firstCall.args[0];

    expect(error.message).to.equal("Invalid email format");
    expect(error.status).to.equal(400);
  });
});