const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

//reading counterFile and accessing current number
//Converts buffer to number
//passing current number to callback, which invokes writeCounter with current number + 1
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

//pads increased number that turns it into a string
//writes to counterFile and updates number with increased padded number string
//Invokes callback with new padded number
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
  return counterString
};

// Public API - Fix this function //////////////////////////////////////////////
//passes increment value in callback =
exports.getNextUniqueId = (callback) => {
  readCounter((err, counter) => {
    if (err) {
      return err;
    } else {
      writeCounter(counter += 1, callback)
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
