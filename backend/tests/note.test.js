const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");

const app = require("../app");

const authService = require("../services/authService");
const userModel = require("../models/userModel");
const noteService = require("../services/noteService");

describe("Notes API", function () {
  let userA;
  let userB;
  let noteId;

  before(async function () {
    process.env.JWT_SECRET = "test-jwt-secret";

    const userAData = {
      name: "Note User A",
      email: `note-user-a-${Date.now()}@example.com`,
      password: "123456",
    };

    const userBData = {
      name: "Note User B",
      email: `note-user-b-${Date.now()}@example.com`,
      password: "123456",
    };

    await authService.registerUser(userAData);
    await authService.registerUser(userBData);

    userA = await userModel.findUserByEmail(userAData.email);
    userB = await userModel.findUserByEmail(userBData.email);

    await noteService.createNote({
        title: "Test Note",
        content: "Test note content",
        userId: userA.id,
      });

    const notes = await noteService.getNotesByUser(userA.id);
    noteId = notes[0].id;
  });

  function createToken(userId) {
    return jwt.sign(
      {
        id: userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  }

  describe("GET /api/notes/:id", function () {
    it("should not allow a user to access another user's note", async function () {
      const token = createToken(userB.id);

      const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .set("Cookie", [`token=${token}`]);

      expect(response.status).to.equal(404);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("Note not found");
    });

    it("should return 404 when the note does not exist", async function () {
      const token = createToken(userA.id);

      const response = await request(app)
        .get("/api/notes/999999")
        .set("Cookie", [`token=${token}`]);

      expect(response.status).to.equal(404);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("Note not found");
    });
  });

  describe("PUT /api/notes/:id", function () {
    it("should return 400 for an invalid note ID", async function () {
      const token = createToken(userA.id);

      const response = await request(app)
        .put("/api/notes/invalid-id")
        .set("Cookie", [`token=${token}`])
        .send({
          title: "Updated title",
          content: "Updated content",
        });

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("Invalid note ID");
    });
  });

  describe("DELETE /api/notes/:id", function () {
    it("should return 400 for an invalid note ID", async function () {
      const token = createToken(userA.id);

      const response = await request(app)
        .delete("/api/notes/invalid-id")
        .set("Cookie", [`token=${token}`]);

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal("Invalid note ID");
    });
  });
});