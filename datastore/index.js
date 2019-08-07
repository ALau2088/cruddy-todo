const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

//must be saved into its own file
//Use the getNextUniqueId to create a file path inside the dataDir.
//Each time a POST request is made to the collection route, save a file with the todo item in this folder.
//Only save todo text in file, id is encoded in filename
//do not store an object.

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    var id = data;
    var newFileName = path.join(exports.dataDir, `./${data}.txt`);
    fs.writeFile(newFileName, text, (err) => {
      if (err) {
        console.log('error');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       console.log('error');
//     } else {
//       var data = _.map(files, (text) => {
//         return { id: text.slice(0, 5), text: text.slice(0, 5) };
//       });
//       callback(null, data);
//     }
//   });
// };
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error');
    } else {
      // var data = _.map(files, (text) => {
      //   return { id: text.slice(0, 5), text: text.slice(0, 5) };
      // });
      Promise.all(files)
      callback(null, data);
    }
  });
};

//read the content of the todo item file on server side
//respond with the text message to the client
exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, null);
    } else {
      for (var i = 0; i < files.length; i++) {
        // If file match
        if (`${id}.txt` === files[i]) {
          fs.readFile(path.join(exports.dataDir, files[i]), (err, text) => {
            if (err) {
              callback(err, null);
            } else {
              var todo = { id, text: text.toString() };
              callback(null, todo);
            }
          });
          return;
        }
      }
      callback(new Error(`No item with id: ${id}`), null);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error('Error reading files in directory'), null);
    } else if (files.includes(`${id}.txt`)) {
      for (var i = 0; i < files.length; i++) {
        if (`${id}.txt` === files[i]) {
          fs.readFile(path.join(exports.dataDir, files[i]), (err, currentText) => {
            if (err) {
              callback(new Error('Error reading file'), null);
            } else {
              var updatedText = text.replace(`${currentText.toString()}`, text);
              fs.writeFile(path.join(exports.dataDir, `${id}.txt`), updatedText, (err) => {
                if (err) {
                  callback(new Error('error writing file'), null);
                } else {
                  callback(null, updatedText);
                }
              });
            }
          });
        }
      }
      // callback(new Error('non-existant id'), null)
    } else {
      (
        callback(new Error('non-existant id'), null)
      );
    }
  });


  //default below----------------------------------------
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    for (var i = 0; i < files.length; i++) {
      if (`${id}.txt` === files[i]) {
        fs.unlink(path.join(exports.dataDir, files[i]), (err) => {
          callback(null);
        });
      } else {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
