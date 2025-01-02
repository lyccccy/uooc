function deletelesson(courseId) {
    console.log(courseId);
    fetch(`http://localhost:3000/delete-course-registration`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, userId: localStorage.getItem("ID") }), // 传递课程ID
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应失败');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // 处理服务器返回的数据
            alert(data.message); // 显示成功或失败的消息
        })
        .catch(error => {
            console.error('退课失败:', error);
            alert('退课失败');
        });
}

function checkAndRegisterCourse() {
    const courseId = document.getElementById('courseId').value;
    fetch(apiUrl + '/checkAndRegister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId, userId: localStorage.getItem("ID") }),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            console.log(data.message);
        })
        .catch((error) => {
            console.error('注册课程失败:', error);
        });
}

function fetchCoursesByStudentId(userId) {
    fetch(apiUrl + `/courses/${userId}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })

        .then(data => {
            const courseList = document.getElementById('aaa');
            data.forEach(course => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <img src="${course.CoverImage}" alt="">
                    <div class="info">
                        <p><a href="course.html?id=${course.CourseID}">${course.CourseName}</a></p>
                        <p>id:${course.CourseID}</p>
                        <p>简介：${course.CourseDescription}</p>
                    </div>
                    <div class="btn">
                        <p><a onclick="deletelesson(${course.CourseID})">申请退课</a></p>
                        <p><a href="${course.HomeworkRequirements}" download>课程作业</a></p>
                        <p><a href="course.html?id=${course.CourseID}">课程资料</a></p>
                    </div>
                `;
                courseList.appendChild(li);
            });
            
            
        })
        .catch(error => {
            console.error('获取课程列表失败:', error);
        });
}


function fetchHomeworkByStudentId(userId) {
    fetch(apiUrl + `/homework/${userId}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const homeworkListUpcoming = document.getElementById('homeworkListUpcoming');
            const homeworkListPast = document.getElementById('homeworkListPast');

            data.forEach(homework => {
                const li = document.createElement('li');
                if (new Date(homework.Deadline) < new Date()) {
                    // 过期的作业
                    li.innerHTML += `
                    <img src="${homework.CoverImage}" alt="">
                    <div class="info">
                        <p><a href="course.html?id=${homework.CourseID}">${homework.CourseName}</a></p><p style="color:red;">已截止</p>
                        <p>课程ID：${homework.CourseID}</p>
                        <p>作业：${homework.HomeworkRequirements}</p>
                        <p>截止日期：${homework.Deadline}</p>
                    </div>
                        <div class="btn">
                            <button onclick="edithomework(${homework.HomeworkID}, ${userId})">提交作业</button>
                        </div>
                    `;
                    homeworkListPast.appendChild(li);
                } else {
                    // 未过期的作业
                    li.innerHTML += `
                    <img src="${homework.CoverImage}" alt="">
                    <div class="info">
                        <p><a href="course.html?id=${homework.CourseID}">${homework.CourseName}</a></p><p style="color:green;">请及时提交</p>
                        <p>课程ID：${homework.CourseID}</p>
                        <p>作业：${homework.HomeworkRequirements}</p>
                        <p>截止日期：${homework.Deadline}</p>
                    </div>
                        <div class="btn">
                            <button onclick="edithomework(${homework.HomeworkID}, ${userId})">提交作业</button>
                        </div>
                    `;
                    homeworkListUpcoming.appendChild(li);
                }

                console.log(homework);
            });
        })
        .catch(error => {
            console.error('Fetch Error: ' + error);
        });

}

// 获取作业信息
function edithomework(HomeworkId, userId) {
    console.log("作业模块已打开");
    document.getElementById('homeworkId').value = HomeworkId;
    document.getElementById('userId').value = userId;
    document.getElementById('homeworkmodal').style.display = 'block';
    console.log(HomeworkId);
    console.log(userId);
}

var closeBtn = document.getElementsByClassName("close")[1]; // 注意这里的索引可能需要根据实际DOM结构调整
// 点击关闭按钮隐藏弹窗
closeBtn.onclick = function () {
    document.getElementById('homeworkmodal').style.display = "none";
}

//提交作业
function submitHomework(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    const formData = new FormData(document.getElementById('uploadForm'));
    fetch('http://localhost:3000/submitHomework', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert('作业提交成功');
            document.getElementById('homeworkmodal').style.display = 'none';
        })
        .catch(error => {
            console.error('提交作业失败:', error);
        });
}
// 为表单添加提交事件监听器
document.getElementById('uploadForm').addEventListener('submit', submitHomework);



document.addEventListener('DOMContentLoaded', async function () {
    console.log(localStorage.getItem("ID"))

    const links = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');


    // 设置默认选中草稿箱
    const draftsLink = document.querySelector('a[data-target="drafts"]');
    draftsLink.classList.add('active'); // 添加激活类

    const draftsContent = document.getElementById('drafts');
    draftsContent.style.display = 'block'; // 显示草稿箱内容

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // 防止链接的默认行为

            // 移除所有链接的激活样式
            links.forEach(link => {
                link.classList.remove('active'); // 移除激活类
            });

            // 添加当前点击链接的激活样式
            this.classList.add('active'); // 添加激活类

            // 隐藏所有内容
            contents.forEach(content => {
                content.style.display = 'none';
            });

            // 显示对应的内容
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';

            
        });
    });


    const userId = localStorage.getItem("ID");
    fetchCoursesByStudentId(userId);
    fetchHomeworkByStudentId(userId);

    var profileModal = document.getElementById("editProfileModal");

    // 获取编辑信息链接元素
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (target.id === 'qiufo') {
            console.log('点击编辑信息链接');
            e.preventDefault(); // 防止链接的默认行为
            profileModal.style.display = "block";
        }
    });

    // 获取关闭按钮元素
    var closeBtn = document.getElementsByClassName("close")[0]; // 注意这里的索引可能需要根据实际DOM结构调整

    // 点击关闭按钮隐藏弹窗
    closeBtn.onclick = function () {
        profileModal.style.display = "none";
    }

    // 点击窗口外部隐藏弹窗
    window.onclick = function (event) {
        if (event.target == profileModal) {
            profileModal.style.display = "none";
            modal.style.display = "none";
        }
    }

    // 获取单选按钮元素
    const options = document.querySelectorAll('input[type="radio"][name="option"]');

    // 为单选按钮添加change事件监听器
    options.forEach(function (option) {
        option.addEventListener('change', function () {
            // 根据选中的单选按钮值进行排序
            if (this.value === 'desc') {
                // 按时间倒序排序
                sortCoursesByPublishTime('desc');
                console.log('按时间倒序排序');
            } else {
                // 按时间顺序排序
                sortCoursesByPublishTime('asc');
                console.log('按时间顺序排序');
            }
        });
    });



    const searchInput = document.querySelector('.input-style');
    // 定义一个函数用于获取搜索框的输入内容
    function getSearchInputValue() {
        // 获取输入框的值
        const value = searchInput.value.trim(); // 使用trim()来移除前后的空格
        console.log('搜索框的输入内容为：', value);
        // 这里可以添加更多的逻辑处理代码，比如发送请求等
        return value; // 返回输入框的值以供其他函数使用
    }

    // 为搜索框绑定事件监听器，例如在按下回车键时获取输入内容
    searchInput.addEventListener('keypress', function (e) {
        // 检查按下的键是否是回车键
        if (e.key === 'Enter') {
            e.preventDefault(); // 阻止表单提交的默认行为
            getSearchInputValue(); // 调用函数获取搜索框的输入内容
        }
    });



    const profileForm = document.getElementById('profileForm');

    // 为编辑个人信息的表单添加提交事件监听器
    profileForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 阻止表单默认提交行为
        var nickname;
        var signature = document.getElementById('signature').value.trim();
        // 获取表单中的输入值
        if (document.getElementById('nickname').value.trim() != '') {
            nickname = document.getElementById('nickname').value.trim();

            document.querySelector('.catalogue li:nth-of-type(1)').textContent = "昵称：" + nickname;
        }

        const imageFile = document.getElementById('profileimg').files[0];



        formData = new FormData();
        formData.append("UserID", localStorage.getItem("ID"))
        formData.append("realName", nickname);
        formData.append("signature", signature);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        try {
            const response = await fetch(`${apiUrl}/edit_info`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();

                location.reload();
            } else {
                console.log("error");
            }
        } catch (error) {
            // document.getElementById('response').innerText = Error:`${error.message}`;
        }
        // 关闭编辑个人信息的弹窗
        const closeBtn = document.querySelector('.modal-content .close,');
        closeBtn.click();
        profileForm.reset();
    });



});