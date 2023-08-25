const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const Product = require("./Model/Product");
const { success, failure } = require("./utils/message");
const { insertInLog } = require("./logFile");
const { title } = require("process");
const Order = require("./Model/Order");
const User = require("./Model/User");

const server = http.createServer((req, res) => {
  const getQueryParams = () => {
    // const firstPart = new URLSearchParams(req.url.split("?")[0]);
    // console.log("firstPart ", firstPart);
    // const parsedUrl = url.parse(req.url);
    // console.log("req.url ", req.url);
    // console.log("parsedUrl ", parsedUrl);
    const params = new URLSearchParams(req.url.split("?")[1]);
    // console.log("params ", params);
    const queryParams = {};
    for (const param of params) {
      console.log(param);
      queryParams[param[0]] = param[1];
    }
    return queryParams;
  };
  // const params = getQueryParams();
  console.log("param output ", params);

  let body = "";
  req.on("data", (buffer) => {
    body += buffer;
  });

  req.on("end", async (end) => {
    const parsedUrl = url.parse(req.url);
    // console.log("parsedUrl.pathname ", parsedUrl.pathname);
    // console.log("req.url ", req.url);
    const params = getQueryParams();
    // console.log(params);

    // all product
    if (req.url === "/products" && req.method === "GET") {
      try {
        let result = await Product.getAllData();
        let logFileResult = await insertInLog("GET_ALL_PRODUCT");
        if (result.success) {
          // console.log("success");
          // console.log(result.data);
          // insertInLog("GET_ALL");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify(
              success("successfully fetched the data", result.data)
            )
          );
          return res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("failed to fetch the data")));
          return res.end();
        }
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Internal error occured")));
        return res.end();
      }
    }
    // single product insert
    else if (req.url === "/product/insert" && req.method == "POST") {
      try {
        let newProduct = JSON.parse(body);
        // console.log("newProduct ", newProduct);
        let error = {};
        if (newProduct.hasOwnProperty("id")) {
          error.id = "Id should not be passed in body";
        }
        if (
          !newProduct.hasOwnProperty("title") ||
          newProduct?.title?.toString().trim() == ""
        ) {
          error.title =
            "title should be passed to create a product and it must have some values";
        }

        if (!newProduct.hasOwnProperty("price") || isNaN(newProduct.price)) {
          error.price =
            "price should  be passed to create a product and it must be number type";
        }
        if (
          !newProduct.hasOwnProperty("stock") ||
          isNaN(newProduct.stock) ||
          !Number.isInteger(Number(newProduct.stock))
        ) {
          error.stock =
            "stock should  be passed to create a product and it must be integer type";
        }

        if (Object.keys(error).length > 0) {
          // console.log(error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify(
              failure("Data is not provided as per requirement", error)
            )
          );
          return res.end();
        }

        // console.log("new product ", newProduct);
        let result = await Product.insertData(newProduct);
        let logFileResult = await insertInLog("POST_PRODUCT", result.id);
        // console.log("result ", result);
        if (result.success) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(success("successfully added the data")));
          return res.end();
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("failed to add the data")));
          return res.end();
        }
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Internal error occured")));
        return res.end();
      }
    }
    // single product view
    else if (parsedUrl.pathname == "/product/find" && req.method == "GET") {
      if (params.id) {
        // console.log("single product", params.id);
        try {
          let result = await Product.getSingleData(params.id);
          let logFileResult = await insertInLog("GET_ONE_PRODUCT", params.id);
          if (result.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            if (result.data) {
              res.write(
                JSON.stringify(
                  success("successfully fetched the data", result.data)
                )
              );
              return res.end();
            } else {
              res.write(
                JSON.stringify(success("There is no such data with this ID"))
              );
              return res.end();
            }
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("failed to fetch the data")));
            return res.end();
          }
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("Internal error occured")));
          return res.end();
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Pass an id via your url")));
        return res.end();
      }
    }

    //update a product
    else if (parsedUrl.pathname == "/product/update" && req.method == "PUT") {
      if (params.id) {
        // console.log("product id ", params.id);
        try {
          let newProduct = JSON.parse(body);

          // starts here
          let error = {};
          if (newProduct.hasOwnProperty("id")) {
            error.id = "Id should not be passed in body";
          }
          if (
            !newProduct.hasOwnProperty("title") ||
            newProduct?.title?.toString().trim() == ""
          ) {
            error.title =
              "title should be passed to create a product and it must have some values";
          }

          if (!newProduct.hasOwnProperty("price") || isNaN(newProduct.price)) {
            error.price =
              "price should  be passed to create a product and it must be number type";
          }
          if (
            !newProduct.hasOwnProperty("stock") ||
            isNaN(newProduct.stock) ||
            !Number.isInteger(Number(newProduct.stock))
          ) {
            error.stock =
              "stock should  be passed to create a product and it must be integer type";
          }

          if (Object.keys(error).length > 0) {
            // console.log(error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(
              JSON.stringify(
                failure("Data is not provided as per requirement", error)
              )
            );
            return res.end();
          }

          //ends here

          let result = await Product.updateProduct(params.id, newProduct);
          let logFileResult = await insertInLog("UPDATE_PRODUCT", params.id);

          if (result.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(success("successfully updated the data")));
            return res.end();
          } else {
            if (result.hasOwnProperty("message")) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify(success("There is no such data with this ID"))
              );
              return res.end();
            }
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("failed to update the data")));
            return res.end();
          }
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("Internal error occured")));
          return res.end();
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Pass an id via your url")));
        return res.end();
      }
    }

    //delete a product
    else if (
      parsedUrl.pathname == "/product/delete" &&
      req.method == "DELETE"
    ) {
      if (params.id) {
        // console.log("product id ", params.id);
        try {
          let result = await Product.deleteProduct(params.id);
          let logFileResult = await insertInLog("DELETE_PRODUCT", params.id);

          if (result.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(success("successfully deleted the data")));
            return res.end();
          } else {
            if (result.hasOwnProperty("message")) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify(success("There is no such data with this ID"))
              );
              return res.end();
            }
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("failed to update the data")));
            return res.end();
          }
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("Internal error occured")));
          return res.end();
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Pass an id via your url")));
        return res.end();
      }
    }

    //  products with price <= x
    else if (parsedUrl.pathname == "/product/get-less" && req.method == "GET") {
      if (params.price) {
        // console.log("params.price ", params.price);
        try {
          let result = await Product.getProductByCustomPrice(params.price);
          let logFileResult = await insertInLog("FILTER_PRICE", params.price);
          if (result.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            if (result.data) {
              res.write(
                JSON.stringify(
                  success("successfully fetched the data", result.data)
                )
              );
            } else {
              res.writeHead(204, { "Content-Type": "application/json" });
              res.write(JSON.stringify(success("There is no such data.")));
            }
            return res.end();
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("failed to fetch the data")));
            return res.end();
          }
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("Internal error occured")));
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Pass price property via your url")));
        return res.end();
      }
    }

    // get order by id  (take order id as parameter)
    else if (parsedUrl.pathname == "/order" && req.method == "GET") {
      // console.log("params.id ", params.id);
      if (params.id) {
        // console.log("params.id ", params.id);
        try {
          let result = await Order.getOrderById(params.id);
          let logFileResult = await insertInLog("GET_ONE_ORDER", params.id);
          if (result.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            if (result.data) {
              res.write(
                JSON.stringify(
                  success("successfully fetched the data", result.data)
                )
              );
            } else {
              res.write(JSON.stringify(success("There is no such data.")));
            }
            return res.end();
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("failed to fetch the data")));
            return res.end();
          }
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("Internal error occured")));
          return res.end();
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Pass id property via your url")));
        return res.end();
      }
    }

    // get all orders of a user  (take user id as parameter)
    else if (parsedUrl.pathname == "/order/user" && req.method == "GET") {
      if (params.id) {
        // console.log("params.id ", params.id);
        try {
          let result = await User.getOrdersByUserId(params.id);
          let logFileResult = await insertInLog(
            "GET_ORDERS_FOR_USER",
            params.id
          );
          if (result.success) {
            res.writeHead(200, { "Content-Type": "application/json" });
            if (result.data) {
              res.write(
                JSON.stringify(
                  success("successfully fetched the data", result.data)
                )
              );
            } else {
              res.write(JSON.stringify(success("There is no such data.")));
            }
            return res.end();
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify(failure("failed to fetch the data")));
            return res.end();
          }
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify(failure("Internal error occured")));
          return res.end();
        }
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify(failure("Pass id property via your url")));
        return res.end();
      }
    }

    // no url matched
    else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify(failure("This route doesn't exist")));
      return res.end();
    }
  });
});

let port = 8000;
server.listen(port, () => {
  let date = new Date();
  console.log(
    `Server is ruinnig in port ${port}, at Time  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} `
  );
});
