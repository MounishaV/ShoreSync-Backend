import express from 'express';

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

app.post('/api/addFormData',(req, res) => {
    console.log("checkedItems: ", req.body);

    const selectedValues = [];
    selectedValues.push(req.body);
    console.log("selected values:: ", selectedValues[0].landUse);
    //database call to push the user selected values
    res.send(selectedValues);
})
export default app;