function renderCoursePage(course){
   

    const html  =`<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>课程详情</title>
    <link rel="stylesheet" href="CSS/lesson.css">
</head>

<body>
    <div class="course-details">
        <h1>${course.CourseName} 🎓</h1>
        <p class="course-code">课程代码：${course.catagory}${course.CourseID}</p>
        <p class="teacher">授课教师：${course.TeacherID}</p>
        <div class="like-button">
            <input class="on" id="heart" type="checkbox" />
            <label class="like" for="heart">
                <svg
                class="like-icon"
                fill-rule="nonzero"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
                ></path>
                </svg>
                <span class="like-text">Likes</span>
            </label>
            <span class="like-count one">68</span>
            <span class="like-count two">69</span>
    </div>
        

        <!-- 课件 -->
        <h2>课件 📚</h2>
        <div class="materials">
            <h3>文档 📄</h3>
            <ul class="document-list" id = "document-list">
               
            </ul>

            <h3>音视频 🎥</h3>
            <ul class="media-list">
                <li class="responsive-video">
                    <video controls>
                        <source src="./${course.course_material_path}" type="video/mp4">视频内容
                    </video>
                </li>
                <li>
                    <audio controls>
                        <source src="./${course.course_material_path}" type="audio/mpeg">音频内容
                    </audio>
                </li>
            </ul>
        </div>

        <!-- 课程简介 -->
        <h2>课程简介 📖</h2>
        <p>${course.CourseDescription}</p>

        <!-- 讨论区 -->
        <h2>讨论区 💬</h2>
        <div id="discussion">
            <p>"游客不可评论"</p>
            <textarea id="comment" rows="4" placeholder="请输入评论..."></textarea>
            <button id="submitComment">提交评论</button>
            <div id="comments-list"></div>
        </div>

        <!-- 个人笔记 -->
        <h2>个人笔记 📝</h2>
        <div id="personal-notes">
            <p>游客不可见</p>
            <!-- 这里可以添加登录后的用户笔记功能 -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
`;
return html;
}
module.exports = renderCoursePage;