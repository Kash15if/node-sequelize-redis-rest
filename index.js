const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");

const { createClient } = require("redis");

const port = 3000;

//sequelize set up
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

//redis code
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/", async (req, res) => {
  try {
    await client.connect();

    const allData = await client.get("users");
    if (!allData) {
      const usersIn = await User.findAll({
        attributes: ["user", "pass"],
      });

      console.log("from db", usersIn[0]);
      await client.set("users", usersIn);
      res.send(usersIn);
      return;
    }

    console.log("from chache", allData[0]);
    res.send(allData);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
