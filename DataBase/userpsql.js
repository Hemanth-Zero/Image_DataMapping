const bcrypt = require('bcrypt');

/**
 * Registers a new user. 
 * Checks for uniqueness before hashing and inserting.
 */
async function registerUser(req, res) {
    const { username, password, email } = req.body;
    try {
        // 1. Check if user already exists
        const checkUser = await pool.query('SELECT user_id FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (checkUser.rows.length > 0) {
            throw new Error('Username or Email already in use');
        }

        // 2. Hash password and Save
        const hashedPassword = await bcrypt.hash(password, 12);
        const sql = `
            INSERT INTO users (username, password, email)
            VALUES ($1, $2, $3)
            RETURNING user_id
        `;
        await pool.query(sql, [username, hashedPassword, email]);
        
        res.redirect('/login');
    } catch (err) {
        console.error('Registration Error:', err.message);
        const params = new URLSearchParams({ code: '400', message: err.message }).toString();
        res.status(400).redirect(`/error.html?${params}`);
    }
}

/**
 * Authenticates user and sets session.
 */
async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Set session
        req.session.userId = user.user_id;
        res.redirect('/dashboard');
        
    } catch (err) {
        const params = new URLSearchParams({ code: '401', message: err.message }).toString();
        res.status(401).redirect(`/error.html?${params}`);
    }
}

/**
 * Fetches basic profile info for the logged-in user.
 */
const getProfile = async (req, res) => {
    const uid = req.session.userId;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const result = await pool.query(
            'SELECT user_id, username, email FROM users WHERE user_id = $1',
            [uid]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};

/**
 * Updates user account details.
 */
const updateAccount = async (req, res) => {
    const { email, username } = req.body;
    const uid = req.session.userId;

    if (!uid) return res.status(401).json({ error: 'Please log in' });

    try {
        await pool.query(
            'UPDATE users SET email = $1, username = $2 WHERE user_id = $3',
            [email, username, uid]
        );
        res.json({ success: true, message: 'Account updated' });
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

/**
 * Deletes user and triggers CASCADE on projects/annotations.
 */
const deleteUserAccount = async (req, res) => {
    const uid = req.session.userId;
    if (!uid) return res.status(401).json({ error: 'No active session' });

    try {
        // Due to "ON DELETE CASCADE", this removes all their projects, images, and annotations automatically
        await pool.query('DELETE FROM users WHERE user_id = $1', [uid]);
        
        req.session.destroy(() => {
            res.json({ success: true, message: 'Account and data permanently removed' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Deletion failed' });
    }
};

/**
 * Simple session cleanup.
 */
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect('/login');
    });
};

module.exports = { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateAccount, 
    deleteUserAccount, 
    logoutUser 
};
