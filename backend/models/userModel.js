const db = require("../config/db");

async function findUserByEmail(email) {
  let connection;

  try {
    connection = await db.getConnection();

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function findUserById(userId) {
  let connection;

  try {
    connection = await db.getConnection();

    const [rows] = await connection.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId]
    );

    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function createUser(name, email, hashedPassword) {
  let connection;

  try {
    connection = await db.getConnection();

    const [result] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
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

async function deleteUserByEmail(email) {
  let connection;

  try {
    connection = await db.getConnection();

    const [result] = await connection.query(
      "DELETE FROM users WHERE email = ?",
      [email]
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
  findUserByEmail,
  findUserById,
  createUser,
  deleteUserByEmail,
};