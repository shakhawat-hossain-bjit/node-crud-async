const fs = require("fs");
const { getCurrentUser } = require("./authentication/user");

async function readLogFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    // console.log("my data ", data);
    jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

async function writeFile(filePath, data) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data), "utf-8");
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
}

async function insertInLog(operation, parameter = null) {
  //   if (operation === "GET_ALL") {
  //     message = `All data viewd at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  //   } else if (operation == "POST") {
  //     message = `ID ${id} added at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  //   } else if (operation == "GET_SINGLE") {
  //     message = `Request to view ID ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  //   } else if (operation == "GET_CHEAP") {
  //     message = `Request to view products with price less than or equal ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  //   } else if (operation == "UPDATE") {
  //     message = `Request to update products with ID ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  //   } else if (operation == "DELETE") {
  //     message = `Request to delete products with ID ${id} at ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}, by ${user}  \n`;
  //   }
  // console.log(message);

  try {
    let date = new Date();
    const user = getCurrentUser();
    let time = date;
    let message;
    message = {
      operation,
      requester: user,
      time,
    };

    if (
      operation == "GET_ONE" ||
      operation == "POST" ||
      operation == "DELETE" ||
      operation == "UPDATE"
    ) {
      message.id = parameter;
    }
    if (operation == "FILTER_PRICE") {
      message.price = parameter;
    }
    const filePath = "log.json";
    const fileData = await readLogFile(filePath);
    // console.log("File data: ", fileData);
    // console.log(message);
    fileData.push(message);
    const result = await writeFile(filePath, fileData);
    return { success: true };
  } catch (error) {
    console.error(error.message);
    return { success: false };
  }
}

module.exports = { insertInLog };
