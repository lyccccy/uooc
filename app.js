// 引入 mysql 连接数据库
const mysql = require("mysql2");
// 数据库配置
// 我是利用 sqlyog 可视化工具建立的数据库 并且建立相应的表 user
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "uooccccc",
  port:"3305"
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
const multer = require("multer");
const path = require("path");

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
// 监听3000端口
app.listen(3000, () => {
  console.log("服务器启动");
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const identity = req.body.identity;
  // 密码进行加密
  const password = bcrypt.hashSync(req.body.password, 10);
  const sql = `INSERT INTO User (Username, Password, Role ) VALUES ('${username}', '${password}', '${identity}')`;

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
  // 从请求中获取请求体
  const { username, password } = req.body;

  const sql = `select * from User where username='${parseInt(username, 10)}'`;
  console.log("login " + sql);
  exec(sql).then((result) => {
    const user = result[0];
    // 如果查询不到用户
    if (!user) {
      return res.status(500).json({ error: "用户名不存在" });
      return;
    }
    // 判断用户输入的密码和数据库存储的是否对应 返回 true 或者 false

    const isPasswordValid = bcrypt.compareSync(password, user.Password);
    if (!isPasswordValid) {
      return res.status(500).json({ error: "密码错误" });
      return;
    }
    // 生成 token 将用户的唯一标识 id 作为第一个参数
    // SECRET 作为取得用户 id 密匙
    const token = jwt.sign({ id: username }, SECRET);

    // 如果都通过了 则返回user 和 token
    // 返回的 token 应该存储在客户端 以便后续发起请求需要在请求头里设置
    res.send({ user, token });
  });
});

app.get("/profile", (req, res) => {
  // 从请求头里取出 token
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  console.log(SECRET);
  console.log(jwt.verify(token, SECRET));
  // token 验证取得 用户 id
  let userid = jwt.verify(token, SECRET).id;

  console.log(userid);
  // 查询用户
  const sql = `select * from User where Username='${userid}'`;
  exec(sql).then((result) => {
    // 返回用户信息
    res.send(result[0]);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 保存到 uploads 文件夹
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 用时间戳命名文件
  },
});
// 配置上传中间件
const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 限制文件大小为 100MB
});

app.post(
  "/add_course",
  upload.fields([
    { name: "image", maxCount: 1 }, // 单文件
    { name: "courseMaterial", maxCount: 1 },
  ]),
  (req, res) => {
    const { courseName, TeacherID, type, courseDescription } = req.body;
    var sql;
    if (req.files["image"]) {
      if (!req.files["courseMaterial"])
        sql = `INSERT INTO Course (CourseName,TeacherID,catagory, CourseDescription,CoverImage) VALUES ('${courseName}','${TeacherID}', '${type}', '${courseDescription}','${req.files["image"][0].path}')`;
      else
        sql = `INSERT INTO Course (CourseName,TeacherID,catagory, CourseDescription,CoverImage,course_material_path) VALUES ('${courseName}','${TeacherID}', '${type}', '${courseDescription}','${req.files["image"][0].path}','${req.files["courseMaterial"][0].path}')`;
    } else {
      if (!req.files["courseMaterial"])
        sql = `INSERT INTO Course (CourseName,TeacherID,catagory, CourseDescription) VALUES ('${courseName}', '${TeacherID}','${type}', '${courseDescription}')`;
      else
        sql = `INSERT INTO Course (CourseName,TeacherID,catagory, CourseDescription,course_material_path) VALUES ('${courseName}','${TeacherID}', '${type}', '${courseDescription}','${req.files["courseMaterial"][0].path}')`;
    }
    console.log(sql);
    exec(sql)
      .then((result) => {
        console.log("course added successfully:", result);
        res.status(201).send(result);
      })
      .catch((err) => {
        console.error("Error during adding course:", err.message);
        res.status(500).send("课程添加失败");
      });
  }
);

app.post("/getDraft", (req, res) => {
  const TeacherID = req.body.ID;
  const sql = `select * from  Course where Status = "Draft" and TeacherID = '${TeacherID}'`;

  exec(sql)
    .then((result) => {
      console.log("course added successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during adding course:", err.message);
      res.status(500).send("查询草稿课程失败");
    });
});

app.post("/publishCourse", (req, res) => {
  const CourseID = req.body.ID;
  const sql = `update Course set Status = 'Published' where  CourseID = '${CourseID}'`;

  exec(sql)
    .then((result) => {
      console.log("course publish successfully:", result);
      res.status(201).send("发布成功");
    })
    .catch((err) => {
      console.error("Error during publishing course:", err.message);
      res.status(500).send("发布失败");
    });
});

app.post("/getPublished", (req, res) => {
  const TeacherID = req.body.ID;
  const sql = `select * from  Course where Status = "Published" and TeacherID = '${TeacherID}'`;

  exec(sql)
    .then((result) => {
      console.log("course publish send successfully:");
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during sending pub course:", err.message);
      res.status(500).send("查询发布课程失败");
    });
});

app.post("/getCourse", (req, res) => {
  const TeacherID = req.body.ID;
  const sql = `select * from  Course `;

  exec(sql)
    .then((result) => {
      console.log("all course send successfully:");
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during sending all course:", err.message);
      res.status(500).send("查询发布课程失败");
    });
});

//删除课程
app.post("/DeleteCourse", (req, res) => {
  const CourseID = req.body.ID;
  const sql = `delete from Course  where  CourseID = '${CourseID}'`;

  exec(sql)
    .then((result) => {
      console.log("course delete successfully:", result);
      res.status(201).send("删除成功");
    })
    .catch((err) => {
      console.error("Error during deleting course:", err.message);
      res.status(500).send("删除失败");
    });
});

//引入渲染函数
const renderCoursePage = require("./JS/renderCourse");

app.post("/course", (req, res) => {
  console.log(req.body);
  const courseId = req.body.CourseID;
  const sql = `select * from Course where courseid='${courseId}'`;
  exec(sql)
    .then((result) => {
      const html = renderCoursePage(result[0]);
      console.log(result[0]);
      // 返回课程信息
      res.send(html);
    })
    .catch((err) => {
      console.error("Error loading course", err.message);
      res.status(500).send("加载课程失败");
    });
});

app.post("/filter_category", (req, res) => {
  const category = req.body.category;
  console.log(req.body);
  const sql = `SELECT * FROM Course WHERE catagory='${category}'`;
  exec(sql)
    .then((result) => {
      console.log(result[0]);
      // 返回类别信息
      res.send(result);
    })
    .catch((err) => {
      console.error("Error loading category", err.message);
      res.status(500).send("加载类别失败");
    });
});

app.post("/edit_info", upload.single("image"), (req, res) => {
  const { UserID, realName, signature } = req.body;
  var sql;
  console.log(req.body);
  if (req.file) {
    sql = `update User set RealName ='${realName}' ,avatar = '${req.file.path}',signature= '${signature}' where UserID = '${UserID}'`;
  } else {
    sql = `update User set RealName ='${realName}' ,signature= '${signature}' where UserID = '${UserID}'`;
  }
  console.log(sql);
  exec(sql)
    .then((result) => {
      console.log("course added successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during adding course:", err.message);
      res.status(500).send("课程添加失败");
    });
});

app.post("/uploadAssignment", upload.single("file"), (req, res) => {
  const { CourseID, deadline } = req.body;
  const sql = `insert into Homework (CourseID,HomeworkRequirements,Deadline) value (${CourseID}, '${req.file.path
    }','${deadline.replace("T", " ")}' ) `;
  console.log(sql);
  exec(sql)
    .then((result) => {
      console.log("homework added successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during adding homework:", err.message);
      res.status(500).send("作业添加失败");
    });
});

app.post("/submitAssignment", (req, res) => {
  const data = req.body;
  const CourseID = data.courseID;
  const deadline = data.deadline;
  const questions = data.questions;
  console.log(data);
  const sql = `insert into Homework (CourseID,HomeworkRequirement,Deadline) value(${CourseID}, '${questions}','${deadline.replace(
    "T",
    " "
  )}')`;
  exec(sql)
    .then((result) => {
      console.log("homework added successfully:", result);
      // 返回类别信息
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error loading category", err.message);
      res.status(500).send("作业添加失败");
    });
});
//上传课件
app.post("/uploadCourseDoc", upload.single("file"), (req, res) => {
  const CourseID = req.body.CourseID;
  const FileName = req.body.FileName;
  const sql = `insert into documentpath (courseId,documentPath,documentName) value (${CourseID}, '${req.file.path}',"${FileName}" ) `;
  console.log(sql);
  exec(sql)
    .then((result) => {
      console.log("document added successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during adding document:", err.message);
      res.status(500).send("文档添加失败");
    });
});

app.post("/getDocument", (req, res) => {
  console.log(req.body);
  const CourseID = req.body.ID;
  const sql = `select * from  documentpath where courseid = '${CourseID}'`;

  exec(sql)
    .then((result) => {
      console.log("get docs successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get docs:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/getStudent", (req, res) => {
  const sql = `select * from User  where Role = 'student'`;

  exec(sql)
    .then((result) => {
      console.log("get student successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get student:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/DeleteStudent", (req, res) => {
  const StudentID = req.body.StudentID;
  const sql = `delete from User  where UserID = ${StudentID}`;

  exec(sql)
    .then((result) => {
      console.log("get docs successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get docs:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/like", (req, res) => {
  const CourseID = req.body.CourseID;
  const sql = `update Course set  LikeCount = LikeCount + 1  where CourseID = ${CourseID}`;

  exec(sql)
    .then((result) => {
      console.log("like successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error like:", err.message);
      res.status(500).send("fail");
    });
});
app.post("/getlike", (req, res) => {
  const CourseID = req.body.CourseID;
  const sql = `select * from Course where CourseID = ${CourseID}`;

  exec(sql)
    .then((result) => {
      console.log("like successfully:", result);
      res.status(201).send(result[0]);
    })
    .catch((err) => {
      console.error("Error like:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/comment", (req, res) => {
  const { CourseID, UserID, Comment } = req.body;
  const sql = `insert into Discussion (CourseID,UserID,Content) values(${CourseID},${UserID},'${Comment}')  `;

  exec(sql)
    .then((result) => {
      console.log("comment successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error comment:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/getComment", (req, res) => {
  const courseID = req.body.ID;
  const sql = `select * from  Discussion where CourseID = '${courseID}'`;

  exec(sql)
    .then((result) => {
      console.log("course added successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during adding course:", err.message);
      res.status(500).send("拉去评论课程失败");
    });
});

app.use(express.json());

// 检查课程是否存在并注册
app.post("/checkAndRegister", (req, res) => {
  const { courseId, userId } = req.body;
  const checkCourseSql = `
    SELECT COUNT(*) AS count FROM Course WHERE CourseID = ?
  `;
  con.query(checkCourseSql, [courseId], (err, results) => {
    if (err) {
      console.error("查询课程失败: " + err);
      return res.status(500).send({ message: "内部服务器错误" });
    }
    if (results[0].count === 0) {
      res.send({ message: "课程不存在" });
    } else {
      //如果注册过，提示请勿重复注册
      const checkRegistrationSql = `
        SELECT COUNT(*) AS count FROM CourseRegistration
        WHERE UserID = ? AND CourseID = ?
      `;
      con.query(checkRegistrationSql, [userId, courseId], (err, results) => {
        console.log(results);
        if (results[0].count > 0) {
          return res.status(200).send({ message: "请勿重复注册" });
        }
        const registerSql = `
        INSERT INTO CourseRegistration (UserID, CourseID)
        VALUES (?, ?)
      `;
        con.query(registerSql, [userId, courseId], (err, results) => {
          if (err) {
            console.error("注册失败: " + err);
            return res.status(500).send({ message: "注册失败" });
          }
          const addnote = `insert into Note (UserID,CourseID,Content )values (${userId},${courseId},'')`;
          con.query(addnote, (err, results) => {
            if (err) {
              console.log("添加笔记出错：" + err);
            }
          });
          res.send({ message: "注册成功" });
        });
      });
    }
  });
});

app.get("/courses/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT c.CourseID, c.CourseName, c.CourseDescription, c.CoverImage, hw.HomeworkRequirements
    FROM CourseRegistration cr
    JOIN Course c ON cr.CourseID = c.CourseID
    LEFT JOIN Homework hw ON c.CourseID = hw.CourseID
    WHERE cr.UserID = ?
`;
  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("查询课程失败: " + err);
      return res.status(500).send({ message: "查询课程失败" });
    }
    res.json(results);
  });
});

app.delete("/delete-course-registration", (req, res) => {
  const courseId = req.body.courseId;
  const userId = req.body.userId;
  console.log(courseId, userId);
  const sql =
    "DELETE FROM CourseRegistration WHERE CourseID = ? AND UserID = ?";
  con.query(sql, [courseId, userId], (err, results) => {
    if (err) {
      console.error("删除失败: " + err);
      return res.status(500).json({ message: "删除失败" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "未找到指定的课程注册信息" });
    }
    res.json({ message: "删除成功", affectedRows: results.affectedRows });
  });
});

// 搜索课程的路由
app.get("/search", (req, res) => {
  console.log(req.query.query);
  const keyword = req.query.query;
  const sql = `SELECT * FROM Course WHERE CourseName LIKE '%${keyword}%';
`;

  exec(sql)
    .then((result) => {
      console.log("course added successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error during adding course:", err.message);
      res.status(500).send("拉取课程失败");
    });
});

app.post("/getNote", (req, res) => {
  const CourseID = req.body.CourseID;
  const UserID = req.body.UserID;
  const sql = `select * from  Note where CourseID = '${CourseID}' and UserID = ${UserID}`;

  exec(sql)
    .then((result) => {
      console.log("get docs successfully:", result);
      res.status(201).send(result[0].Content);
    })
    .catch((err) => {
      console.error("Error get docs:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/updateNote", (req, res) => {
  const CourseID = req.body.CourseID;
  const UserID = req.body.UserID;
  const Content = req.body.Content;
  const sql = `update Note set Content = '${Content}' where CourseID = ${CourseID} and UserID = ${UserID}`;
  console.log(sql);
  exec(sql)
    .then((result) => {
      console.log("get docs successfully:", result);
      res.status(201).send(result[0].Content);
    })
    .catch((err) => {
      console.error("Error up note:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/addSlide", (req, res) => {
  const CourseID = req.body.CourseID;
  const sql = `insert into addslide (CourseID) values (${CourseID})`;
  exec(sql)
    .then((result) => {
      res.status(201).send("ok");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("fail");
    });
});

app.post("/getTeacher", (req, res) => {
  const sql = `select * from User  where Role = 'teacher'`;
  exec(sql)
    .then((result) => {
      console.log("get teacher successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get teacher:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/getSwiper", (req, res) => {
  const sql = `SELECT Course.*
FROM Course
JOIN (
    SELECT CourseID
    FROM AddSlide
    ORDER BY AddTime DESC
) AS LastThreeSlides ON Course.CourseID = LastThreeSlides.CourseID;
`;
  exec(sql)
    .then((result) => {
      console.log("get Swiper successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get Swiper:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/getNewest", (req, res) => {
  const sql = `SELECT Course.*,User.RealName 
FROM Course,User
WHERE Status = 'Published' and Course.TeacherID = User.UserID
ORDER BY UpdateTime DESC;
;
`;
  exec(sql)
    .then((result) => {
      console.log("get Newest successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get Newest:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/gethot", (req, res) => {
  const sql = `SELECT Course.*,User.RealName 
FROM Course,User
WHERE Status = 'Published' and Course.TeacherID = User.UserID
ORDER BY Course.LikeCount DESC;
;
`;
  exec(sql)
    .then((result) => {
      console.log("get Newest successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get Newest:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/getRec", (req, res) => {
  const sql = `SELECT Course.*, User.RealName FROM Course JOIN ( SELECT CourseID FROM Recommand ORDER BY AddTime DESC LIMIT 10 ) AS LastThreeSlides ON Course.CourseID = LastThreeSlides.CourseID JOIN User ON Course.TeacherID = User.UserID;

`;
  exec(sql)
    .then((result) => {
      console.log("get Rec successfully:", result);
      res.status(201).send(result);
    })
    .catch((err) => {
      console.error("Error get Rec:", err.message);
      res.status(500).send("fail");
    });
});

app.post("/addRec", (req, res) => {
  const CourseID = req.body.CourseID;
  const sql = `insert into Recommand (CourseID) values (${CourseID})`;
  exec(sql)
    .then((result) => {
      res.status(201).send("ok");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("fail");
    });
});

//显示作业目录
app.get('/homework/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT hw.HomeworkID, hw.CourseID, c.CourseName, hw.HomeworkRequirements, hw.Deadline, c.CoverImage
FROM homework hw
JOIN course c ON hw.CourseID = c.CourseID
JOIN courseregistration cr ON hw.CourseID = cr.CourseID
WHERE cr.UserID = ?;

  `;
  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('查询课程失败: ' + err);
      return res.status(500).send({ message: '查询课程失败' });
    }
    res.json(results);
  });
});

app.post('/submitHomework', upload.array('file'), (req, res) => {
  // req.files 是一个数组，包含了上传的文件信息
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: '没有文件上传' });
  }
  const { HomeworkId, UserId } = req.body;
  console.log(req.body);
  const filePaths = req.files.map(file => file.path); // 获取文件路径

  // 插入数据到StudentHomework表
  const query = 'INSERT INTO StudentHomework (HomeworkID, UserID, Content) VALUES (?, ?, ?)';
  const content = filePaths.join(', '); // 将文件路径作为内容存储

  con.query(query, [HomeworkId, UserId, content], (err, result) => {
    if (err) {
      console.error('数据库插入失败:', err);
      return res.status(500).json({ message: '数据库插入失败' });
    }
    res.json({ message: '作业提交成功', files: req.files });
  });
});

// 获取课程作业提交信息的路由
app.post('/get-homework-submissions', (req, res) => {
  const { courseID } = req.body; // 从请求体中获取 courseID
  if (!courseID) {
    return res.status(400).json({ message: '缺少课程ID' });
  }
  const sql = `
    SELECT sh.UserID, sh.Content, sh.SubmissionTime, h.Deadline
    FROM StudentHomework sh
    JOIN homework h ON sh.HomeworkID = h.HomeworkID
    WHERE h.CourseID = ?
  `;
  con.query(sql, [courseID], (err, results) => {
    if (err) {
      console.error('查询作业提交信息失败: ' + err);
      return res.status(500).json({ message: '查询作业提交信息失败' });
    }
    res.json(results); // 返回查询结果
  });
});