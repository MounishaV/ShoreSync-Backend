// shoresyncdataRequestParser.js

const queries = require('../queries.js');
// createShoreSyncTable,
// insertParsedData
const fs = require("fs");

function shoresyncdataRequestParser(req, res, next) {
  // Check if the request body contains the required data
  if (!req.body) {
      return res.status(400).send('Missing required data in request body');
  }
  console.log("req.body: ", req.body);

  const landUse = req.body.landUse;
  const BankAttributesData = req.body.BankAttributesData;
  const ShoreLineFeaturesData = req.body.ShoreLineFeaturesData;
  console.log("Testing");
  console.log("landUse: ", landUse);
  // console.log("BankAttributesData: ", BankAttributesData);
  // console.log("ShorelineFeaturesData: ", ShorelineFeaturesData);
  //console.log("here:",req.body.FinalSubmitForm.txnid);
  const parsedData = {};
    // Initialize an empty array to store the req.body.FinalSubmitFormlist of strings
  const landUseList = [];

  // Loop through the landUse object
  for (const key in landUse) {
    if (Object.hasOwnProperty.call(landUse, key)) {
      // Check if the value is true
      if (landUse[key]) {
        // If true, push the key to the array
        landUseList.push(key);
        
      }
    }
  }

  // Initialize an empty array to store the labels
  const erosionControlOptionLabels = [];

  // Loop through the erosionStructers array
  for (const option of ShoreLineFeaturesData.erosionStructers) {
    // Push the label to the array
    erosionControlOptionLabels.push(option.label);
  }

  parsedData.erosionControlOptions = erosionControlOptionLabels;

  // Initialize an empty array to store the labels
  const recreationalOptionLabels = [];

  // Loop through the recreationalStructures array
  for (const option of ShoreLineFeaturesData.recreationalStructures) {
    // Push the label to the array
    recreationalOptionLabels.push(option.label);
  }

  parsedData.recreationalOptions = recreationalOptionLabels;


  // Initialize an empty array to store the labels
  const otherOptionLabels = [];

  // Loop through the otherOptions array
  for (const option of ShoreLineFeaturesData.otherOptions) {
    // Push the label to the array
    otherOptionLabels.push(option.label);
  }

  parsedData.otherOptions = otherOptionLabels;
  parsedData.landUseDB = landUseList;
  parsedData.bankHeightDB = BankAttributesData.heightItem;
  parsedData.stabilityDB = BankAttributesData.bankStability;
  parsedData.coverDB = BankAttributesData.bankCover;  
  parsedData.marshDB = BankAttributesData.marshBuffer;
  parsedData.beachDB = BankAttributesData.bankBuffer;
  parsedData.phragmitesDB = BankAttributesData.phragmitesAustralis;
  parsedData.latitude = req.body.FinalSubmitForm.latitude;
  parsedData.longitude = req.body.FinalSubmitForm.longitude;
  parsedData.transactionId = req.body.FinalSubmitForm.txnid;

  // const imagesList = req.body.FinalSubmitForm.image;
  // console.log("image::",imagesList);
  // // Loop through the selectedErosionControlOptions array
  // for (const image of imagesList) {
  //   // Push the label to the array
  //   console.log("each image::",image);
  // }
  // const bitmap = fs.readFileSync(req.body.FinalSubmitForm.image)
  // const buf = new Buffer(bitmap)
  // console.log("buff",buf);

  //finally fill it with location
  //In this lattitude and longitude are numbers
  parsedData.location = req.body.location;
  console.log("parsedData: ", parsedData);

  queries.createShoreSyncTable();
  queries.insertParsedData(parsedData);
  // Call the next middleware
  next();
}


module.exports = { shoresyncdataRequestParser };