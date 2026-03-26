

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { register, login };