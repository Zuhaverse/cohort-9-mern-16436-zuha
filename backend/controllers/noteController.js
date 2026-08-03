const noteService = require("../services/noteService");

async function createNote(req, res, next) {
  try {
    const { title, content } = req.body;

    const userId = req.user.id;

    const noteData = {
      title,
      content,
      userId,
    };

    const result = await noteService.createNote(noteData);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

async function getNotesByUser(req, res, next) {
  try{
    const userId = req.user.id;

    const result = await noteService.getNotesByUser(userId);
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
  }
  
async function updateNote(req, res, next) {
  try{
    const { title, content } = req.body;
    const userId = req.user.id;
    const noteId = req.params.id;

    const noteData = {
      title,
      content,
      userId,
      noteId
    }

    const result = await noteService.updateNote(noteData);
    return res.status(200).json({
      success: true,
      message: "Note updated successfully!",
      data: result
   });
  }

   catch(error){
    next(error);
   }

  }

async function deleteNote(req,res,next) {
  try{
    const userId = req.user.id;
    const noteId = req.params.id;

    const result = await noteService.deleteNote(userId,noteId);
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully!",
      data: null
    })
  }
    catch(error){
      next(error)
    }
  }
  

  
module.exports = {
  createNote,
  getNotesByUser,
  updateNote,
  deleteNote
};