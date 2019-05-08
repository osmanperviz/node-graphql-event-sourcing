"use strict";

const executeQuery = require("../executeQuery");
const fileFinder = require("./findFiles");
const { GraphQLObjectType } = require("graphql");
const path = require("path");
const process = require("process");

module.exports = async () => {
  const directoryPath = path.join(__dirname, "../");
  const extension = ".query.js";
  const files = await fileFinder(directoryPath, extension);
  const fields = {};
  for (const file of files) {
    const queryName = path.basename(file, extension);
    const query = require(file);
    const reworkedQuery = {
      type: query.responseType,
      description: query.description,
      args: query.args,
      resolve: async (_, args, context) => {
        return await executeQuery({
          args,
          execute: query.execute
        });
      }
    };
    fields[queryName] = reworkedQuery;
  }

  const queryType = new GraphQLObjectType({
    name: "Query",
    fields
  });
  return queryType;
};
