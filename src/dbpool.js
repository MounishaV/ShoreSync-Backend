// const express = require('express')
const { Pool } = require('pg');
// import { Pool } from 'pg';
const express = require('express');
const app = express()
const port = 8080

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ShoreSyncDB',
    password: 'postgres',
    port: 5432,
  });

module.exports = pool;

  

