const chai = require("chai");
const expect = chai.expect;

const noteService = require("../services/noteService");
const authService = require("../services/authService");
const userModel = require("../models/userModel");

describe("Note Service", function () {
  const userFixture = {
    name: "User Fixture",
    email: `user-fixture${Date.now()}@example.com`,
    password: "123456",
  };

  let user;
  let noteId;

  before(async function () {
    await authService.registerUser(userFixture);
    user = await userModel.findUserByEmail(userFixture.email);
  });

  it("should create a note successfully", async function () {
    const note = {
      title: "My First Note",
      content: "Learning backend step by step.",
      userId: user.id,
    };

    const result = await noteService.createNote(note);

    expect(result.message).to.equal("Note created successfully!");
  });

  it("should fetch notes successfully", async function () {
    const result = await noteService.getNotesByUser(user.id);

    expect(result).to.be.an("array");

    noteId = result[0].id;
  });

  it("should update a note successfulyy", async function(){
    const note = {
      title: "Updated note",
      content: "Updated content",
      userId: user.id,
      noteId
    }
    const result = await noteService.updateNote(note);
    expect(result.message).to.equal("Note updated successfully!");
  })

  it("should delete a note successfully", async function(){
    const result = await noteService.deleteNote(user.id, noteId);

    expect(result.message).to.equal("Note deleted successfully!");
})
})