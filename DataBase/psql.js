const bcrypt = require('bcrypt');
const pool = require('../server');

// --- Helper: Check if Project Name exists ---
async function isProjectUnique(projectName, userId) {
    const sql = 'SELECT * FROM projects WHERE project_name=$1 AND user_id=$2';
    const result = await pool.query(sql, [projectName, userId]);
    if (result.rows.length > 0) {
        throw new Error('Project name already exists for this user');
    }
}

// --- Project Controllers ---

const createNewProject = async (req, res) => {
    const { projectName } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).redirect('/login');

    try {
        await isProjectUnique(projectName, userId);
        const sql = 'INSERT INTO projects (project_name, user_id) VALUES ($1, $2) RETURNING project_id';
        const result = await pool.query(sql, [projectName, userId]);
        
        res.json({ success: true, projectId: result.rows[0].project_id });
    } catch (err) {
        console.error('Project Creation Error:', err);
        res.status(400).json({ error: err.message });
    }
};

const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.session.userId;

    try {
        // Verification: Ensure the user owns the project before deleting
        const sql = 'DELETE FROM projects WHERE project_id = $1 AND user_id = $2';
        const result = await pool.query(sql, [projectId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }
        res.json({ success: true, message: 'Project and all associated data deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
};

// --- Image & Annotation Controllers ---

const uploadProjectImage = async (req, res) => {
    const { projectId } = req.body;
    const imageBuffer = req.file.buffer; // Assuming use of 'multer' for file uploads

    try {
        const sql = 'INSERT INTO directory (project_id, image) VALUES ($1, $2) RETURNING img_id';
        const result = await pool.query(sql, [projectId, imageBuffer]);
        res.json({ success: true, imgId: result.rows[0].img_id });
    } catch (err) {
        res.status(500).json({ error: 'Image upload failed' });
    }
};

const saveAnnotation = async (req, res) => {
    const { projectId, imgId, x_min, y_min, width, height, class_name } = req.body;

    try {
        const sql = `
            INSERT INTO annotations (project_id, img_id, x_min, y_min, width, height, class_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(sql, [projectId, imgId, x_min, y_min, width, height, class_name]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save annotation' });
    }
};

const getFullProjectData = async (req, res) => {
    const { projectId } = req.params;

    try {
        const sql = `
            SELECT 
                d.img_id, 
                a.annotation_id, a.x_min, a.y_min, a.width, a.height, a.class_name
            FROM directory d
            LEFT JOIN annotations a ON d.img_id = a.img_id
            WHERE d.project_id = $1
        `;
        const result = await pool.query(sql, [projectId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Data retrieval failed' });
    }
};

module.exports = { 
    createNewProject, 
    deleteProject, 
    uploadProjectImage, 
    saveAnnotation, 
    getFullProjectData 
};
