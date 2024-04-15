const pool = require('./dbpool');

const createUsersTable = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
    `;

    try {
        await pool.query(queryText);
        console.log('Users table created successfully.');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};

const initializeDatabase = async () => {
    await createUsersTable();
    // Add more table creation calls here if necessary
};

initializeDatabase();
