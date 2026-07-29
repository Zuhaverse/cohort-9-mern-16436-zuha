const chai = require("chai");
const expect = chai.expect;

const authService = require("../services/authService");

describe("Auth Service", function () {

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
          email: "zuha123@example.com",
          password: "123456",
        });
      
        expect(result).to.have.property("token");
      });

      it("should throw an error for invalid credentials", async function () {

        try {
          await authService.loginUser({
            email: "zuha123@example.com",
            password: "wrongpassword",
          });
      
          throw new Error("Test failed");
        } catch (error) {
          expect(error.message).to.equal("Invalid credentials");
        }
      
      });

      it("should throw an error for invalid email format", async function () {

        try {
          await authService.loginUser({
            email: "invalidemail",
            password: "123456",
          });
      
          throw new Error("Test failed");
        } catch (error) {
          expect(error.message).to.equal("Invalid email format");
        }
      
      });

    });
