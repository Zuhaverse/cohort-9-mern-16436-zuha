const originalJwtSecret = process.env.JWT_SECRET;
const chai = require("chai");
const expect = chai.expect;

const authService = require("../services/authService");

describe("Auth Service", function () {
  const loginFixture = {
    name: "Login Fixture",
    email: `login-fixture${Date.now()}@example.com`,
    password: "123456",
  };
    
      before(async function () {
        process.env.JWT_SECRET = "test-jwt-secret";
        await authService.registerUser(loginFixture);
      });
  after(function () {
    if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalJwtSecret;
  });

    it("should register a new user", async function () {

        const user = {
            name: "Test User",
            email: `test${Date.now()}@example.com`,
            password: "123456",
          };
        const result = await authService.registerUser(user);

        expect(result.message).to.equal("User registered successfully");

    });

    it("should throw an error if email already exists", async function () {
        const user = {
            name: "Test User",
            email: `duplicate${Date.now()}@example.com`,
            password: "123456",
          };
        await authService.registerUser(user);

        try {
          
          await authService.registerUser(user);
      
          throw new Error("Expected duplicate email error");
        } catch (error) {
          expect(error.message).to.equal("Email already exists");
        }
      });

      it("should login successfully with valid credentials", async function () {

        const result = await authService.loginUser({
          email: loginFixture.email,
    password: loginFixture.password,
        });
      
        expect(result).to.have.property("token");
      });

      it("should throw an error for invalid credentials", async function () {

        try {
          await authService.loginUser({
            email: loginFixture.email,
            password: "wrongpassword",
          });
      
          throw new Error("Test failed");
        } catch (error) {
          expect(error.message).to.equal("Invalid credentials");
        }
      
      });

      


    });

