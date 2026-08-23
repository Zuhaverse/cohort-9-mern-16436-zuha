const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const app = require("../app");

describe("Auth API", function () {
  before(function () {
    process.env.JWT_SECRET = "test-jwt-secret";
  });

  describe("GET /api/auth/me", function () {
    it("should return the current user when authenticated", async function () {
      const token = jwt.sign(
        {
          id: 1,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [`token=${token}`]);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.authenticated).to.be.true;
      expect(response.body.data.user).to.have.property("id");
      expect(response.body.data.user).to.have.property("name");
      expect(response.body.data.user).to.have.property("email");
    });
  });

  describe("POST /api/auth/register", function () {
    it("should return 400 when required fields are missing", async function () {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "123456",
        });

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("All fields are required!");
    });

    it("should return 400 for an invalid email", async function () {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "123456",
        });

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("Invalid email format");
    });
  });

  describe("POST /api/auth/login", function () {
    it("should return 400 when login credentials are missing", async function () {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        });

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("All fields are required!");
    });
  });

  describe("POST /api/auth/logout", function () {
    it("should clear the authentication cookie", async function () {
      const response = await request(app)
        .post("/api/auth/logout");

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.equal("Logout successful");

      const cookies = response.headers["set-cookie"];

      expect(cookies).to.exist;
      expect(cookies.some((cookie) => cookie.startsWith("token="))).to.be.true;
    });
  });
});