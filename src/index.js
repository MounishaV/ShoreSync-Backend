import express from 'express';
 
import {shoresyncdataRequestParser} from './middlewares/shoresyncdataRequestParser.js';
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

app.post('/api/addFormData', shoresyncdataRequestParser, (req, res) => {
    const selectedValues = [];
    selectedValues.push(req.body);
    res.send(selectedValues);
})
export default app;