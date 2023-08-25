const fs = require("fs");
const { getCurrentUser } = require("./authentication/user");

async function readTxtFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

async function writeTxtFile(filePath, data) {
  try {
    await fs.promises.writeFile(filePath, data, "utf-8");
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
}

async function insertInLog(operation, id = null) {
  let date = new Date();
  const user = getCurrentUser();
  let message;
  if (operation === "GET_ALL") {
    message = `All data viewd at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  } else if (operation == "POST") {
    message = `ID ${id} added at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  } else if (operation == "GET_SINGLE") {
    message = `Request to view ID ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  } else if (operation == "GET_CHEAP") {
    message = `Request to view products with price less than or equal ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  } else if (operation == "UPDATE") {
    message = `Request to update products with ID ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  } else if (operation == "DELETE") {
    message = `Request to delete products with ID ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  }

  const filePath = "log.txt";
  try {
    const fileData = await readTxtFile(filePath);
    // console.log("File data:", fileData);
    const result = await writeTxtFile(filePath, fileData + message);
    return { success: true };
  } catch (error) {
    // console.error(error.message);
    return { success: false };
  }
}

module.exports = { insertInLog };
