const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");

const port = 3000;

const sequelize = new Sequelize("test1", "postgres", "Kashif", {
  host: "localhost",
  dialect: "postgres" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const User = sequelize.define(
  "users",
  {
    // Model attributes are defined here
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      //If you don't define a primaryKey then sequelize uses id by default.
      primaryKey: true,
    },
    pass: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },

  {
    timestamps: false,
    id: false,
  }
);

sequelize.sync();
// .then(async (result) => {
//   console.log(result);
//   await User.upsert({ user: "kash2", pass: "1234" });
// })
// .catch((err) => {
//   console.log(err);
// });

app.get("/", async (req, res) => {
  try {
    const usersIn = await User.findAll({
      attributes: ["user", "pass"],
    });
    res.send(usersIn);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
