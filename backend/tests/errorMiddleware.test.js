const { expect } = require("chai");
const sinon = require("sinon");
const authService = require("../services/authService")

const errorMiddleware = require("../middleware/errorMiddleware");

describe("Error Middleware", function () {

  it("should return the correct error response", function () {

    const error = new Error("Test error");
    error.status = 400;

    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    const next = sinon.spy();

    errorMiddleware(error, req, res, next);

    expect(res.status.calledOnceWith(400)).to.be.true;

    expect(
      res.json.calledOnceWith({
        success: false,
        message: "Test error"
      })
    ).to.be.true;

    expect(next.called).to.be.false;

  });

  it("should return 500 when error has no status", function () {

    const error = new Error("Internal Server Error");

    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    const next = sinon.spy();

    errorMiddleware(error, req, res, next);

    expect(res.status.calledOnceWith(500)).to.be.true;

    expect(
      res.json.calledOnceWith({
        success: false,
        message: "Internal Server Error"
      })
    ).to.be.true;

    expect(next.called).to.be.false;

  });

});

