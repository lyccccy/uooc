// 引入 mysql 连接数据库
const mysql = require("mysql");
// 数据库配置
// 我是利用 sqlyog 可视化工具建立的数据库 并且建立相应的表 user
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "websubmission",
});
// 定义一个执行 sql 语句的函数 并且返回一个 promise 对象
const exec = (sql) => {
    return new Promise((resolve, reject) => {
      con.query(sql, (err, result) => {
        console.log("SQL Executed:", sql); // 打印执行的 SQL 语句
        if (err) {
          console.error("SQL Error:", err.message); // 打印错误信息
          reject(err); // 如果有错误，拒绝 Promise
        } else {
          console.log("Result:", result); // 打印返回的结果
          resolve(result); // 成功时解析 Promise
        }
      });
    });
  };
// 连接数据库
con.connect();

// 引入其他相关包
const express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// 解析 post 请求体
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" })); //body-parser 解析json格式数据
app.use(
  bodyParser.urlencoded({
    //此项必须在 bodyParser.json 下面,为参数编码
    extended: true,
  })
);
// 此变量为解析 token 密匙 变量比较隐私  应该放在其他地方 本文章简单使用一下
// 值为开发者随意设定的
const SECRET = "asdfjoijisadfjlkj";
// 创建服务器
// 监听3001端口
app.listen(3001, () => {
  console.log("服务器启动");
});
console.log(2)
app.post("/register", (req, res) => {
    const username = req.body.username;
    const identity = req.body.identity;
    // 密码进行加密
    const password = bcrypt.hashSync(req.body.password, 10);
    const sql = `INSERT INTO users (userid, password, Student_or_teacher) VALUES ('${username}', '${password}', '${identity}')`;
  
    exec(sql)
      .then((result) => {
        console.log("User registered successfully:", result);
        res.status(201).send("用户注册成功");
      })
      .catch((err) => {
        console.error("Error during registration:", err.message);
        res.status(500).send("用户注册失败");
      });
  });

app.post("/login", (req, res) => {
    console.log(req.query)
    // 从请求中获取请求体
    const { username, password } = req.body;
    const sql = `select * from users where userid='${username}'`;
    exec(sql).then((result) => {
      const user = result[0];
      // 如果查询不到用户
      if (!user) {
        return res.status(500).json({error:"用户名不存在"});
        return;
      }
      // 判断用户输入的密码和数据库存储的是否对应 返回 true 或者 false
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(500).json({error:"密码错误"});
        return;
      }
      // 生成 token 将用户的唯一标识 id 作为第一个参数 
      // SECRET 作为取得用户 id 密匙
      const token = jwt.sign({ id: user.id }, SECRET);
      // 如果都通过了 则返回user 和 token
      // 返回的 token 应该存储在客户端 以便后续发起请求需要在请求头里设置
      res.send({ user, token });
    });
  });

  app.get("/profile", (req, res) => {
    // 从请求头里取出 token
    const token = req.headers.authorization.split(" ")[1];
    // token 验证取得 用户 id
    const { id } = jwt.verify(token, SECRET);
    // 查询用户
    const sql = `select * from users where id='${id}'`;
    exec(sql).then((result) => {
      // 返回用户信息
      res.send(result[0]);
    });
  });