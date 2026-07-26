const authService = require("../services/authService");

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const result = await authService.registerUser({name, email, password});
        res.status(201).json(result);
    } catch (error) {
        res.status(409).json({ message: error.message});
    }
}

module.exports = { registerUser };