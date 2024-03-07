const pool = require('./dbpool.js');

let variable;
async function createAlbumsTable() {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(`SELECT * FROM employee`);
    variable = res.rows;
    console.log(res.rows);
      console.log(variable);
    // await pool.query(query);
    // Connect to the database and execute the query
    console.log('Albums table created');

  } catch (err) {
    console.error(err);
    console.error('Albums table creation failed');
  }
}

createAlbumsTable();
console.log("test ok");

