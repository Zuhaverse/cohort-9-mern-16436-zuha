const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");

describe("Auth Middleware", function () {
    const originalJwtSecret = process.env.JWT_SECRET;

  before(function () {
    process.env.JWT_SECRET = "test-jwt-secret";
  });
  after(function () {
    if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalJwtSecret;
  });

    it("should return 401 when no token is provided", function () {
  
      const req = {
        headers: {}
      };
  
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
  
      const next = sinon.spy();
  
      authMiddleware(req, res, next);
  
      expect(res.status.calledWith(401)).to.be.true;
      expect(next.called).to.be.false;
  
    });

    it("should return 401 for an invalid token", function () {

        const req = {
          headers: {
            authorization: "Bearer invalidtoken"
          }
        };
      
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
        };
      
        const next = sinon.spy();
      
        authMiddleware(req, res, next);
      
        expect(res.status.calledWith(401)).to.be.true;
        expect(next.called).to.be.false;
      
      });

      it("should call next() for a valid token", function () {

        const token = jwt.sign(
          {
            id: 1,
            email: "zuha123@example.com"
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h"
          }
        );
      
        const req = {
          headers: {
            authorization: `Bearer ${token}`
          }
        };
      
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
        };
      
        const next = sinon.spy();
      
        authMiddleware(req, res, next);
      
        expect(next.calledOnce).to.be.true;
        expect(next.firstCall.args).to.have.lengthOf(0);
        expect(req.user.email).to.equal("zuha123@example.com");
      
      });

      it("should return 401 for an expired token", function () {

        const token = jwt.sign(
          {
            id: 1,
            email: "zuha123@example.com"
          },
          process.env.JWT_SECRET,
          {
            expiresIn: -1
          }
        );
      
        const req = {
          headers: {
            authorization: `Bearer ${token}`
          }
        };
      
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub()
        };
      
        const next = sinon.spy();
      
        authMiddleware(req, res, next);
      
        expect(res.status.calledWith(401)).to.be.true;
        expect(next.called).to.be.false;
      
      });
  
  });