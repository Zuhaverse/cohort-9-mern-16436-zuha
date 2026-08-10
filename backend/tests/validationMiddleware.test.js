const { expect } = require("chai");
const sinon = require("sinon");

const {
  validateLogin,
  validateNoteBody,
  validateNoteId,
} = require("../middleware/validationMiddleware");

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

  it("should return an error when request body is missing", function () {
    const req = {};
    const res = {};
    const next = sinon.spy();
  
    validateNoteBody(req, res, next);
  
    expect(next.calledOnce).to.be.true;
  
    const error = next.firstCall.args[0];
  
    expect(error.message).to.equal("Title and content are required!");
    expect(error.status).to.equal(400);
  });

  it("should validate a valid note body", function () {
    const req = {
      body: {
        title: "My Note",
        content: "Some content",
      },
    };

    const res = {};
    const next = sinon.spy();

    validateNoteBody(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args.length).to.equal(0);
  });

  it("should trim title and content", function () {
    const req = {
      body: {
        title: "  My Note  ",
        content: "  Some content  ",
      },
    };

    const res = {};
    const next = sinon.spy();

    validateNoteBody(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.body.title).to.equal("My Note");
    expect(req.body.content).to.equal("Some content");
  });

  it("should return an error when title or content is missing", function () {
    const req = {
      body: {
        title: "My Note",
      },
    };

    const res = {};
    const next = sinon.spy();

    validateNoteBody(req, res, next);

    expect(next.calledOnce).to.be.true;

    const error = next.firstCall.args[0];

    expect(error.message).to.equal("Title and content are required!");
    expect(error.status).to.equal(400);
  });

  it("should return an error for whitespace-only title or content", function () {
    const req = {
      body: {
        title: "   ",
        content: "   ",
      },
    };

    const res = {};
    const next = sinon.spy();

    validateNoteBody(req, res, next);

    expect(next.calledOnce).to.be.true;

    const error = next.firstCall.args[0];

    expect(error.message).to.equal(
      "Title and content cannot be empty or whitespace"
    );
    expect(error.status).to.equal(400);
  });

  it("should return an error for invalid note ID", function () {
    const req = {
      params: {
        id: "abc",
      },
    };

    const res = {};
    const next = sinon.spy();

    validateNoteId(req, res, next);

    expect(next.calledOnce).to.be.true;

    const error = next.firstCall.args[0];

    expect(error.message).to.equal("Invalid note ID");
    expect(error.status).to.equal(400);
  });

  it("should validate a valid note ID", function () {
    const req = {
      params: {
        id: "5",
      },
    };

    const res = {};
    const next = sinon.spy();

    validateNoteId(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args.length).to.equal(0);
    expect(req.params.id).to.equal(5);
  });
});