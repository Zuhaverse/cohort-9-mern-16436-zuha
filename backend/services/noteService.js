const db = require("../config/db");
const noteModel = require("../models/noteModel");
const logger = require("../logger/logger");

async function createNote(noteData) {
    const {title,content,userId} = noteData;
    try{
        logger.info({title,content,userId},"Creating note");
        const result = await noteModel.createNote(title,content,userId);
        logger.info({ userId }, "Note created successfully");
        return {
            message: "Note created successfully!"
        };
    } catch (error) {
        logger.error(error,"Error creating note");
        throw error;
    }
    }

    async function getNotesByUser(userId) {
        try{
            logger.info({userId},"Getting notes by user");
            const result = await noteModel.getNotesByUser(userId);
            logger.info({userId},"Notes fetched successfully");
            return result;
        } catch (error) {
            logger.error(error,"Error getting notes by user");
            throw error;
        }
    }

    async function getNoteById(userId, noteId) {
        let connection;
      
        try {
          connection = await db.getConnection();
      
          const [rows] = await connection.query(
            "SELECT * FROM notes WHERE user_id = ? AND id = ?",
            [userId, noteId]
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

    async function updateNote(noteData) {
        const {title,content,userId,noteId} = noteData;
        try{
            logger.info({title,content,userId,noteId},"Updating note");
            const result = await noteModel.updateNote(title,content,userId,noteId);

            if (result.affectedRows === 0) {
                const error = new Error("Note not found");
                error.status = 404;
                throw error;
            }

            logger.info({userId, noteId},"Note updated successfully!");
            return {
                message: "Note updated successfully!"
            };
        }
        catch (error) {
            logger.error(error,"Error updating note");
            throw error;
        }
    }

    async function deleteNote(userId,noteId) {
        try{
            logger.info({userId,noteId},"Deleting note");
            const result = await noteModel.deleteNote(userId,noteId);

            if (result.affectedRows === 0) {
                const error = new Error("Note not found");
                error.status = 404;
                throw error;
            }

            logger.info({userId, noteId},"Note deleted successfully");
            return {
                message: "Note deleted successfully!"
            };
        }
        catch (error) {
            logger.error(error,"Error deleting note");
            throw error;
        }
    }

module.exports = {
    createNote,
    getNotesByUser,
    getNoteById,
    updateNote,
    deleteNote
}
