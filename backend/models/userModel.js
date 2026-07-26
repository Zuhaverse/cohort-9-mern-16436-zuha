const db = require("../config/db");

async function findUserByEmail(email) {
    try {
      const connection = await db.getConnection();
  
      const [rows] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
  
      connection.release();
  
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  async function createUser(name, email, hashedPassword) {
    try {
      const connection = await db.getConnection();
  
      const [result] = await connection.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );
  
      connection.release();
  
      return result;
    } catch (error) {
      throw error;
    }
  }

module.exports = { findUserByEmail, createUser };