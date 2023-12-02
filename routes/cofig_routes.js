const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");

// Init of  API routes
exports.routesInit = (app) => {
    app.use("/",indexR);
    app.use("/users",usersR);
    app.use("/toys",toysR);
}