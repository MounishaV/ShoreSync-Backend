// import express from 'express';
 
// import {shoresyncdataRequestParser} from './middlewares/shoresyncdataRequestParser.js';


const express = require('express');
const { shoresyncdataRequestParser } = require('./middlewares/shoresyncdataRequestParser.js');
const bodyParser = require("body-parser");
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

// app.use(bodyParser.raw({
//     type: ["image/jpeg", "image/png"],
//     limit: '10mb'
// }));
app.post('/api/addFormData', shoresyncdataRequestParser, (req, res) => {
    const selectedValues = [];
    selectedValues.push(req.body);
    res.send(selectedValues);
})

app.post("/api/addImages",
    bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}),
    (req, res) => {
        try {
            console.log(req.body);

            queries.createShoreSyncImagesTable();
            queries.insertImages(req.body);
        } catch (error) {
            console.log("error parsing image")
        }
    });

module.exports = app;