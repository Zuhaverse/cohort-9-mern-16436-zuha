const db = require("../config/db");

async function createNote(title, content, userId) {
  let connection;

  try {
    connection = await db.getConnection();

    const [result] = await connection.query(
      "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getNotesByUser(userId) {
  let connection;

  try {
    connection = await db.getConnection();

    const [rows] = await connection.query(
      "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return rows;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function updateNote(title, content, userId, noteId) {
  let connection;

  try {
    connection = await db.getConnection();

    const [result] = await connection.query(
      "UPDATE notes SET title = ?, content = ? WHERE user_id = ? AND id = ?",
      [title, content, userId, noteId]
    );

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function deleteNote(userId, noteId) {
  let connection;

  try {
    connection = await db.getConnection();

    const [result] = await connection.query(
      "DELETE FROM notes WHERE user_id = ? AND id = ?",
      [userId, noteId]
    );

    return result;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  createNote,
  getNotesByUser,
  updateNote,
  deleteNote,
};