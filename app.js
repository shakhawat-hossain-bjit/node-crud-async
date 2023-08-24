const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const Product = require("./Model/Product");
const { success, failure } = require("./utils/message");
const { insertInLog } = require("./logFile");

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
      // console.log(param);
      queryParams[param[0]] = param[1];
    }
    return queryParams;
  };
  // const params = getQueryParams();
  // console.log("param output ", params);

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
    // all product insert
    if (req.url === "/products" && req.method === "GET") {
      try {
        let result = await Product.getAllData();
        let logFileResult = await insertInLog("GET_ALL");
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
        if (!newProduct.hasOwnProperty("title")) {
          error.title = "Title should  be passed to create a product";
        }
        if (!newProduct.hasOwnProperty("price")) {
          error.price = "Price should  be passed to create a product";
        }
        if (!newProduct.hasOwnProperty("stock")) {
          error.stock = "Stock should  be passed to create a product";
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
        let logFileResult = await insertInLog("POST", result.id);
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
          let logFileResult = await insertInLog("GET_SINGLE", params.id);
          if (result.success) {
            if (result.data) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(
                JSON.stringify(
                  success("successfully fetched the data", result.data)
                )
              );
              return res.end();
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
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
          // return res.end();
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
          let result = await Product.getCheapProduct(params.price);
          let logFileResult = await insertInLog("GET_CHEAP", params.price);
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