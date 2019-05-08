"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");

const readdir = util.promisify(fs.readdir);

const getFiles = async (directoryPath, extension) => {
  const result = [];
  const files = await readdir(directoryPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(directoryPath, file.name);
    if (file.isFile()) {
      if (file.name.endsWith(extension)) {
        result.push(filePath);
      }
    } else if (file.isDirectory()) {
      const children = await getFiles(filePath, extension);
      result.push.apply(result, children);
    }
  }
  return result;
};

module.exports = async (directoryPath, extension) => {
  return await getFiles(directoryPath, extension);
};
