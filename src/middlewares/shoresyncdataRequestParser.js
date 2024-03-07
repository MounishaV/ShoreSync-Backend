// shoresyncdataRequestParser.js

const queries = require('../queries.js');
// createShoreSyncTable,
// insertParsedData


function shoresyncdataRequestParser(req, res, next) {
  // Check if the request body contains the required data
  if (!req.body) {
      return res.status(400).send('Missing required data in request body');
  }
  const landUse = req.body.landUse;
  const BankAttributesData = req.body.BankAttributesData;
  const ShorelineFeaturesData = req.body.ShorelineFeaturesData;

  console.log("landUse: ", landUse);
  // console.log("BankAttributesData: ", BankAttributesData);
  // console.log("ShorelineFeaturesData: ", ShorelineFeaturesData);
    
  const parsedData = {};
    // Initialize an empty array to store the list of strings
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

  // Loop through the selectedErosionControlOptions array
  for (const option of ShorelineFeaturesData.selectedErosionControlOptions) {
    // Push the label to the array
    erosionControlOptionLabels.push(option.label);
  }

  parsedData.erosionControlOptions = erosionControlOptionLabels;

  // Initialize an empty array to store the labels
  const recreationalOptionLabels = [];

  // Loop through the selectedErosionControlOptions array
  for (const option of ShorelineFeaturesData.selectedRecreactionalOptions) {
    // Push the label to the array
    recreationalOptionLabels.push(option.label);
  }

  parsedData.recreationalOptions = recreationalOptionLabels;


  // Initialize an empty array to store the labels
  const otherOptionLabels = [];

  // Loop through the selectedErosionControlOptions array
  for (const option of ShorelineFeaturesData.selectedOtherOptions) {
    // Push the label to the array
    otherOptionLabels.push(option.label);
  }

  parsedData.otherOptions = otherOptionLabels;
  parsedData.landUseDB = landUseList;
  parsedData.bankHeightDB = BankAttributesData.heightItem;
  parsedData.stabilityDB = BankAttributesData.stabilityItem;
  parsedData.coverDB = BankAttributesData.coverItem;  
  parsedData.marshDB = BankAttributesData.marshItem;
  parsedData.beachDB = BankAttributesData.beachItem;
  parsedData.phragmitesDB = BankAttributesData.phragmitesAustralis;
  parsedData.latitude = req.body.location.latitude;
  parsedData.longitude = req.body.location.longitude;


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