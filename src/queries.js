// PostgreSQL connection configuration
const pool = require('./dbpool.js');

// Function to create table if not exists
async function createShoreSyncTable() {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS Shoresyncdata (
                txn_id SERIAL PRIMARY KEY,
                landform VARCHAR[],
                bank_height VARCHAR(255),
                bank_stability VARCHAR(255),
                bank_cover VARCHAR(255),
                marsh_buffer BOOLEAN,
                beach_buffer BOOLEAN,
                phragmites_australis BOOLEAN,
                erosional_control_structures JSONB,
                recreational_structures JSONB,
                latitude DECIMAL(9, 6),
                longitude DECIMAL(9, 6)
            )
        `);
        console.log('Table created successfully or already exists.');
        client.release();
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Dummy function 1
function dummyFunction1() {
    console.log('This is dummy function 1');
}

// Dummy function 2
function dummyFunction2() {
    console.log('This is dummy function 2');
}
createShoreSyncTable();

// Exporting multiple functions
module.exports = {
  createShoreSyncTable
};
