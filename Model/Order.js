const fs = require("fs");
const path = require("path");
const fsPromise = require("fs").promises;

class Order {
  async getOrderById(id) {
    // console.log("inside ", id);
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "order.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        data = JSON.parse(data);
        let order = data.find((x) => x.id == id);
        return order;
      })
      .then((order) => {
        // console.log(order);
        if (order) {
          return fsPromise
            .readFile(path.join(__dirname, "..", "data", "product.json"), {
              encoding: "utf-8",
            })
            .then((data) => {
              let products = JSON.parse(data);

              //   console.log("products ", products, "------");
              //   console.log("order ", order);
              let orderedProducts = products.filter((x) => {
                if (order.products.includes(x.id)) {
                  return x;
                }
              });

              order.orderedProducts = orderedProducts;

              return { success: true, data: order };
            })
            .catch((error) => {
              return { success: false };
            });
        } else {
          return { success: true };
        }
      })
      .catch((error) => {
        return { success: false };
      });
  }
}

module.exports = new Order();
