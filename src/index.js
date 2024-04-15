// import express from 'express';
 
// import {shoresyncdataRequestParser} from './middlewares/shoresyncdataRequestParser.js';

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./dbpool');
const dbInit = require('./db-init');



const cors = require('cors');
const express = require('express');
const { shoresyncdataRequestParser } = require('./middlewares/shoresyncdataRequestParser.js');
const bodyParser = require("body-parser");
const multer = require("multer");

const queries = require("./queries");
const app = express()


app.use(cors({
    origin: 'http://localhost:3000',  // your React application's origin
    credentials: true,  // to support session cookies from the browser
    optionsSuccessStatus: 200  // some legacy browsers choke on 204
}));

app.options('*', cors());  // include before other routes


app.use(express.json());


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.get('/', (req, res) => {
    res.send('hello from Vt 2');
})

/*app.use(bodyParser.raw({
   /!* type: ["image/jpeg", "image/png"],*!/
    inflate: true,

    type: () => true,

    limit: '10mb'
}));

app.use(bodyParser.json());*/
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});
app.use(bodyParser.urlencoded({ extended: false }))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +
        cb(null,  uniqueSuffix+file.originalname);
    }
})




// Registration Route
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        res.status(201).json({ user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "User could not be created" });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            res.status(404).json({ message: "User not found. Please create an account." });
        } else {
            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
                res.status(401).json({ message: "Invalid password" });
            } else {
                const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                res.json({ token, message: "Login successful!" });
            }
        }
    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



// const upload = multer({ storage: storage })
app.post('/api/addFormData', shoresyncdataRequestParser, (req, res) => {
    const selectedValues = [];
    selectedValues.push(req.body);
    console.log("selected values:", req.body);
    // queries.createShoreSyncImagesTable();
    // queries.insertImages(req.body);
    res.send(selectedValues);
})

// app.post("/api/addImages",
//     /*bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}),*/
//      upload.array("image",20),
//     (req, res) => {
//         try {
//             // console.log(req.body);
//             console.log("after adding multer, req body:: ",req.body);
//
//
//             queries.createShoreSyncImagesTable();
//             queries.insertImages(req.body);
//             res.json({ status: "ok" });
//         } catch (error) {
//             console.log("error parsing image")
//         }
//     });

app.post("/api/addImages",
    upload.array("image",20),
    async (req, res) => {
        try {
            if (!req.body || req.body.length === 0) {
                return res.status(400).json({ error: 'No images uploaded' });
            }
            await queries.createShoreSyncImagesTable();


            // const data = await req.body;
            // console.log("images: ",data.image[0]);

            const data = await req.body;
            const files = await req.files;
            const txid = req.body.txid;
            console.log("txid:: ",req.body.txid);

            console.log("files :: ",req.files);
            console.log("files length :: ",req.files.length);

            console.log("files[0 :: ",req.files[0]);
            for(let i=0;i<files.length;i++){
                 queries.insertImages(txid, files[i]);
            }
            //await queries.insertImages(data);
            res.json({ status: "ok" });
        } catch (error) {
            console.log("error parsing image")
        }
    });
module.exports = app;