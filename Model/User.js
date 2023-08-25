const fs = require("fs");
const path = require("path");
const fsPromise = require("fs").promises;

class User {
  async getOrdersByUserId(id) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "user.json"), {
        encoding: "utf-8",
      })
      .then((data) => {
        data = JSON.parse(data);
        let user = data.find((x) => x.id == id);
        return user;
      })
      .then((user) => {
        // console.log("user ", user);
        if (user) {
          return fsPromise
            .readFile(path.join(__dirname, "..", "data", "order.json"), {
              encoding: "utf-8",
            })
            .then((data) => {
              let order = JSON.parse(data);
              //   console.log("user ", user);
              //   console.log("order ", order);
              return order;
            })
            .then((order) => {
              // console.log(order);
              if (order) {
                return fsPromise
                  .readFile(
                    path.join(__dirname, "..", "data", "product.json"),
                    {
                      encoding: "utf-8",
                    }
                  )
                  .then((data) => {
                    let products = JSON.parse(data);

                    // console.log("user ", user);
                    // console.log("order ", order);
                    // console.log("product ", products);
                    const orderList = [];
                    user?.orders?.map((current) => {
                      const obj = {};
                      obj.order_id = current;
                      let currentOrderObj = order.find((x) => x.id == current);
                      //   console.log(currentOrderObj);
                      let orderedProducts = products.filter((x) => {
                        if (currentOrderObj.products.includes(x.id)) {
                          return x;
                        }
                      });
                      //   console.log(orderedProducts);

                      obj.orderedProducts = orderedProducts;
                      //   console.log("object ", obj);
                      orderList.push(obj);
                    });

                    // console.log(orderList);

                    user.ordersListDetails = orderList;

                    return { success: true, data: user };
                  })
                  .catch((error) => {
                    return { success: false };
                  });
              } else {
                return { success: true };
              }
            })
            .catch((error) => {
              return { success: true };
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

module.exports = new User();
