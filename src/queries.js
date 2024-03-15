// PostgreSQL connection configuration
const pool = require('./dbpool.js');
// import {pool} from './dbpool.js';
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
                marsh_buffer VARCHAR(255),
                beach_buffer VARCHAR(255),
                phragmites_australis VARCHAR(255),
                erosional_control_structures VARCHAR[],
                recreational_structures VARCHAR[],
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

async function createShoreSyncImagesTable() {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS ShoresyncImages (
                /*txn_id SERIAL FOREIGN KEY REFERENCES Shoresyncdata(txn_id),*/
                image_data BYTEA  
                                                       
            )
        `);
        console.log('Table ShoresyncImages created successfully or already exists.');
        client.release();
    } catch (error) {
        console.error('Error creating table ShoresyncImages:', error);
    }
}

async function insertParsedData(parsedData) {
    try {
        const query = `
            INSERT INTO Shoresyncdata (
                landform,
                bank_height,
                bank_stability,
                bank_cover,
                marsh_buffer,
                beach_buffer,
                phragmites_australis,
                erosional_control_structures,
                recreational_structures,
                latitude,
                longitude
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;

        // Extract data from the parsedData object
        const {
            erosionControlOptions,
            recreationalOptions,
            otherOptions,
            landUseDB,
            bankHeightDB,
            stabilityDB,
            coverDB,
            marshDB,
            beachDB,
            phragmitesDB,
            latitude,
            longitude
        } = parsedData;



        console.log('Worked till here ');
        // Execute the query
        await pool.query(query, [
            landUseDB,
            bankHeightDB,
            stabilityDB,
            coverDB,
            marshDB,
            beachDB,
            phragmitesDB,
            erosionControlOptions,
            recreationalOptions,
            latitude,
            longitude
        ]);

        console.log('Worked till here 2 ');

        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

async function insertImages(images) {
    try {
        const query = `
            INSERT INTO ShoresyncImages (
                image_data
            ) VALUES (
                $1)`;


        await pool.query(query, [
            images
        ]);



        console.log('Images inserted successfully');
    } catch (error) {
        console.error('Error inserting images:', error);
    }
}

module.exports = {
    createShoreSyncTable,
    insertParsedData,
    createShoreSyncImagesTable,
    insertImages
};


// // Exporting multiple functions
// module.exports = {
//   createShoreSyncTable,
//   insertParsedData
// };
