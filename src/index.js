// import express from 'express';
 
// import {shoresyncdataRequestParser} from './middlewares/shoresyncdataRequestParser.js';


const express = require('express');
const { shoresyncdataRequestParser } = require('./middlewares/shoresyncdataRequestParser.js');
const bodyParser = require("body-parser");
const multer = require("multer");

const queries = require("./queries");
const app = express()

app.use(express.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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