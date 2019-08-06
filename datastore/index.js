const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error');
    } else {
      var data = _.map(files, (file) => {
        fs.readFile(path.join(exports.dataDir, file), (err, data) => {
          console.log(data.toString("utf-8", 0, 12))
          return { id: data.id, text: data.text }
        })
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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
