const pool = require('./routes/db');

getUserByEmail = async (email) =>{
    const result = (await pool.query(`SELECT * FROM accounts WHERE email = $1`, [email])).rows[0];
    if(result) return {id: result.id, email: result.email, password: result.password};
    return null;
}

getUserById = async (id) =>{
    const result = (await pool.query('SELECT * FROM accounts WHERE id = $1', [id])).rows[0];
    if(result) return {id: result.id, email: result.email, password: result.password};
    return null;
}

module.exports = {
    getUserByEmail,
    getUserById,
};
