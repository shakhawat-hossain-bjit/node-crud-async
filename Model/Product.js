const fs = require("fs");
const path = require("path");
const fsPromise = require("fs").promises;

class Product {
  async getAllData() {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "product.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        data = JSON.parse(data);
        return { success: true, data: data };
      })
      .catch((error) => {
        return { success: false };
      });
  }

  async getSingleData(id) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "product.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        data = JSON.parse(data);
        let product = data.find((x) => x.id == id);
        return { success: true, data: product };
      })
      .catch((error) => {
        return { success: false };
      });
  }

  async updateProduct(id, obj) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "product.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        const jsonData = JSON.parse(data);
        // console.log("jsonData ", jsonData);
        return jsonData;
      })
      .then((jsonData) => {
        // check if the product exist
        let product = jsonData.find((x) => x.id == id);
        // console.log(product);
        if (product) {
          let updatedProduct = jsonData.map((x) => {
            if (x.id == id) {
              x = { ...x, ...obj };
            }
            return x;
          });
          // console.log("updatedProduct ", updatedProduct);
          return fsPromise
            .writeFile(
              path.join(__dirname, "..", "data", "product.json"),
              JSON.stringify(updatedProduct)
            )
            .then((res) => {
              // console.log("success");
              return { success: true, id };
            })
            .catch((e) => {
              // console.log("error in writing in the file");
              return { success: false };
            });
        } else {
          // the data is not available
          return { success: false, message: "There is no such data" };
        }
      })
      .catch((error) => {
        // console.log("error in reading the file", error);
        return { success: false };
      });
  }

  async deleteProduct(id) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "produc.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        const jsonData = JSON.parse(data);
        // console.log("jsonData ", jsonData);
        return jsonData;
      })
      .then((jsonData) => {
        // check if the product exist
        let product = jsonData.find((x) => x.id == id);
        // console.log(product);
        if (product) {
          let filteredProduct = jsonData.filter((x) => x.id != id);
          console.log("filteredProduct ", filteredProduct);
          return fsPromise
            .writeFile(
              path.join(__dirname, "..", "data", "product.json"),
              JSON.stringify(filteredProduct)
            )
            .then((res) => {
              // console.log("success");
              return { success: true, id };
            })
            .catch((e) => {
              // console.log("error in writing in the file");
              return { success: false };
            });
        } else {
          // the data is not available
          return { success: false, message: "There is no such data" };
        }
      })
      .catch((error) => {
        // console.log("error in reading the file", error);
        return { success: false };
      });
  }

  async getCheapProduct(price) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "product.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        data = JSON.parse(data);
        let product = data.filter((x) => x.price <= price);
        return { success: true, data: product };
      })
      .catch((error) => {
        return { success: false };
      });
  }

  async insertData(newData) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "product.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        const jsonData = JSON.parse(data);
        return jsonData;
      })
      .then((jsonData) => {
        // console.log("jsonData & newData ", jsonData, newData);
        // console.log("id ", jsonData[jsonData.length - 1].id + 1);
        let id = jsonData[jsonData.length - 1].id + 1;
        newData = {
          ...newData,
          id: id,
        };
        jsonData.push(newData);
        return fsPromise
          .writeFile(
            path.join(__dirname, "..", "data", "product.json"),
            JSON.stringify(jsonData)
          )
          .then((res) => {
            return { success: true, id };
          })
          .catch((e) => {
            // console.log("error in writing in the file");
            return { success: false };
          });
      })
      .catch((error) => {
        // console.log("error in reading the file", error);
        return { success: false };
      });
  }
}

module.exports = new Product();
