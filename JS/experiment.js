

document.addEventListener('DOMContentLoaded', async function () {
    console.log(localStorage.getItem("ID"))
    try {
        const response = await fetch(`${apiUrl}/getDraft`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ID: localStorage.getItem("ID") }),
        });
        if (response.ok) {
            DraftItems = await response.json();
            console.log(DraftItems[0]);
            for (var i in DraftItems) {
                var DraftItem = DraftItems[i]
                const newLi = document.createElement('li');
                newLi.classList.add("course-item")
                var html = `
                    <img src="${DraftItem.CoverImage}"alt="${DraftItem.CourseName}">
                    <div class="info">
                        <p>${DraftItem.CourseName}</p>
                        <p id="courseID">${DraftItem.CourseID}</p>
                        <p>类别：${getCategoryName(DraftItem.catagory)}</p>
                        <p>简介：${DraftItem.CourseDescription}</p>
                    </div>
                    <div class="btn"> 
                        <p><a href="#edit" class="edit-link" >编辑</a></p>
                        <p><a href="#publish">发布</a></p>
                        <p><a href="#delete">删除</a></p>
                    </div>
                `;
                console.log(html);
                newLi.innerHTML = html;
                document.getElementById('drafts').querySelector('ul').appendChild(newLi);
            }
        }
    }
    catch (error) { }
    //获取所有已经发布的
    console.log(localStorage.getItem("ID"))
    try {
        const response = await fetch(`${apiUrl}/getPublished`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ID: localStorage.getItem("ID") }),
        });
        if (response.ok) {
            pubItems = await response.json();
            for (var i in pubItems) {
                var pubItem = pubItems[i]
                const newLi = document.createElement('li');
                newLi.classList.add("course-item")
                var html = `
                    <img src="${pubItem.CoverImage}" alt="${pubItem.CourseName}">
                    <div class="info">
                        <p><a href="course.html?id=${pubItem.CourseID}">${pubItem.CourseName}</a></p>
                        <p id="courseID">${pubItem.CourseID}</p>
                        <p>类别：${getCategoryName(pubItem.catagory)}</p>
                        <p>简介：${pubItem.CourseDescription}</p>
                    <span class="publish-time">${pubItem.UpdateTime}</span></div>
                    <div class="btn"> 
                        <p><a href="#edit" class="edit-link">编辑</a></p>
                        <p><a href="#delete">删除</a></p>
                        <p id="addSlider"><a href="#addSlider">添加轮播</a></p>
                        <p><a href="#register" >禁止注册</a></p>
                        <p><a href="#comment" >关闭评论</a></p>
                    </div>
                `;
                console.log(html);
                newLi.innerHTML = html;
                document.getElementById('published').querySelector('ul').appendChild(newLi);
            }
        }
    }
    catch (error) { }
    //获取学生
    try {
        const response = await fetch(`${apiUrl}/getStudent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            StudentItems = await response.json();
            console.log(StudentItems[0]);
            for (var i in StudentItems) {
                var StudentItem = StudentItems[i]
                const newLi = document.createElement('li');
                var html = `
                                 <p id='StudentID'>${StudentItem.UserID}</p>
                                 <p>${StudentItem.RealName ? StudentItem.RealName : "暂未更新真实姓名"}</p>
                                 <button class="delete-student-btn">删除</button>              
                `;
                console.log(html);
                newLi.innerHTML = html;
                document.getElementById('adstu').querySelector('ul').appendChild(newLi);
            }
        }
    }
    catch (err) { }

    const links = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const sortOptions = document.getElementById('sort-options');
    sortOptions.style.display = 'none';

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

            if (targetId === 'published') {
                sortOptions.style.display = 'block';
            } else {
                sortOptions.style.display = 'none';
            }
        });
    });

    var modal = document.getElementById("editModal");

    // 获取编辑链接元素
    var editBtns = document.querySelectorAll('a[href="#edit"]');

    // 获取关闭按钮元素
    var span = document.getElementsByClassName("close")[0];

    // 点击编辑链接显示弹窗
    editBtns.forEach(function (btn) {
        btn.onclick = function () {
            modal.style.display = "block";
        }
    });

    // 点击关闭按钮隐藏弹窗
    span.onclick = function () {
        modal.style.display = "none";
    }

    var profileModal = document.getElementById("editProfileModal");

    // 获取编辑信息链接元素
    var editInfoLink = document.querySelector('a[href=""]');

    // 点击编辑信息链接显示弹窗
    editInfoLink.onclick = function (e) {
        e.preventDefault(); // 防止链接的默认行为
        profileModal.style.display = "block";
    }

    // 获取关闭按钮元素
    var closeBtn = document.getElementsByClassName("close")[1]; // 注意这里的索引可能需要根据实际DOM结构调整

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

    function sortCoursesByPublishTime(order) {
        const courses = publishedUl.querySelectorAll('li');
        let sortedCourses = Array.from(courses);

        // 获取每个课程的发布时间
        sortedCourses = sortedCourses.sort((a, b) => {
            const timeA = new Date(a.querySelector('.publish-time').textContent).getTime();
            const timeB = new Date(b.querySelector('.publish-time').textContent).getTime();

            if (order === 'desc') {
                return timeB - timeA;
            } else {
                return timeA - timeB;
            }
        });

        // 清空已发布区域的ul
        publishedUl.innerHTML = '';

        // 根据排序结果重新排列li元素
        sortedCourses.forEach((course) => {
            publishedUl.appendChild(course);
        });
    }
    const addSliders = document.querySelectorAll('a[href="#addSlider"]');
    console.log(addSliders)
    addSliders.forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
            e.preventDefault(); // 阻止默认行为
            const CourseID = e.target.parentElement.parentElement.parentElement.querySelector("#courseID").textContent;
            try {
                const response = await fetch(`${apiUrl}/addSlide`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ CourseID: CourseID }),
                })
                if (response.ok) {
                    alert("成功添加首页轮播图")
                }
            }
            catch (err) { }             // 这里可以添加更多的删除操作代码
        });
    });



    const deleteBtns = document.querySelectorAll('a[href="#delete"]');
    const publishBtns = document.querySelectorAll('a[href="#publish"]');

    // 为删除按钮添加点击事件监听器
    deleteBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认行为
            console.log('删除按钮被点击');
            // 这里可以添加更多的删除操作代码
        });
    });

    // 为发布按钮添加点击事件监听器
    publishBtns.forEach(function (btn) {
        btn.addEventListener('click', async function (e) {
            e.preventDefault(); // 阻止默认行为
            console.log('发布按钮被点击');
            // 这里可以添加更多的发布操作代码
            const courseItem = e.target.closest('.course-item');

            // 获取课程 ID
            const courseID = courseItem.querySelector('#courseID').textContent.trim();
            console.log('发布按钮被点击，课程ID:', courseID);
            try {
                const response = await fetch(`${apiUrl}/publishCourse`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ID: courseID }),
                });
                if (response.ok) {
                    console.log(已发布)
                }
            }
            catch (error) { }
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

    const addForm = document.getElementById('addForm');

    // 获取草稿箱的ul元素
    const draftsUl = document.getElementById('drafts').querySelector('ul');

    // 为表单添加提交事件监听器
    addForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 阻止表单默认提交行为

        // 获取表单中的课程名称和描述
        const courseName = document.getElementById('courseName').value.trim();
        const courseDescription = document.getElementById('courseDescription').value.trim();
        const imageInput = document.getElementById('courseImage'); // 假设图片输入字段的ID为courseImage
        const type = document.getElementById('courseCategory').value; // 假设单选按钮的name属性为type，获取选中的值
        var imageFile = imageInput.files[0];
        console.log("photo path:" + imageFile)
        var path1
        try {
            const reader = new FileReader();
            reader.onload = function (event, path) {
                path = event.target.result;
            };
            reader.readAsDataURL(imageFile, path1)
            console.log("photo path:" + path)

        }
        catch { }
        const formData = new FormData();
        formData.append("courseName", courseName);
        formData.append("TeacherID", localStorage.getItem("ID"));
        formData.append("type", type);
        formData.append("courseDescription", courseDescription);

        if (imageFile) {
            formData.append('image', imageFile); // 添加图片文件
        }
        const courseMaterial = document.getElementById('courseMaterial').files[0];
        if (courseMaterial) {
            formData.append('courseMaterial', courseMaterial);
        }
        try {
            const response = await fetch(`${apiUrl}/add_course`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result)
                const courseID = result.courseID;
                console.log("ok");
            } else {
                console.log("error");
            }
        } catch (error) {
            // document.getElementById('response').innerText = Error:`${error.message}`;
        }
        // 将新的li元素添加到草稿箱的ul中
        // 将新的li元素添加到草稿箱的ul中
        // 创建新的li元素
        const newLi = document.createElement('li');
        newLi.classList.add("course-item");
        newLi.innerHTML = `
             <img src="${path1}" alt="${courseName}">
             <div class="info">
                 <p>${courseName}</p>
                 <p>类别：${getCategoryName(type)}</p>
                 <p>简介：${courseDescription}</p>
             </div>
             <div class="btn"> 
                 <p><a href="#edit" class="edit-link" >编辑</a></p>
                 <p><a href="#publish">发布</a></p>
                 <p><a href="#delete">删除</a></p>
             </div>
         `;
        location.reload();
        draftsUl.appendChild(newLi);
        addForm.reset();
    });

    // 为草稿箱中的每个删除链接添加点击事件监听器
    draftsUl.addEventListener('click', async function (e) {
        if (e.target && e.target.matches('a[href="#delete"]')) {
            e.preventDefault(); // 阻止链接的默认行为

            const courseItem = e.target.closest('.course-item');

            // 获取课程 ID
            const courseID = courseItem.querySelector('#courseID').textContent.trim();
            console.log('删除被点击，课程ID:', courseID);
            try {
                const response = await fetch(`${apiUrl}/DeleteCourse`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ID: courseID }),
                });
                if (response.ok) {
                    console.log("已删除")
                }
            }
            catch (error) { }


            // 找到对应的li元素
            const li = e.target.closest('li');
            if (li) {
                // 从ul中移除li
                draftsUl.removeChild(li);
            }
        }
    });



    const publishedUl = document.getElementById('published').querySelector('ul');

    // 为草稿箱中的每个发布链接添加点击事件监听器
    draftsUl.addEventListener('click', async function (e) {
        if (e.target && e.target.matches('a[href="#publish"]')) {
            const courseItem = e.target.closest('.course-item');
            e.preventDefault(); // 阻止链接的默认行为
            const courseID = courseItem.querySelector('#courseID').textContent.trim();
            console.log('发布按钮被点击，课程ID:', courseID);
            try {
                const response = await fetch(`${apiUrl}/publishCourse`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ID: courseID }),
                });
                if (response.ok) {
                    console.log(已发布)
                }
            }
            catch (error) { }
            // 找到对应的li元素
            const li = e.target.closest('li');
            if (li) {
                // 获取当前系统时间作为发布时间
                const now = new Date();
                const publishTime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

                // 复制li元素的内容，并添加发布时间
                const liContent = li.cloneNode(true);
                // 确保在复制的节点上添加发布时间
                if (liContent.querySelector('.publish-time')) {
                    liContent.querySelector('.publish-time').textContent = publishTime;
                } else {
                    // 如果没有找到.publish-time元素，则创建一个新的span元素并添加发布时间
                    const publishTimeSpan = document.createElement('span');
                    publishTimeSpan.className = 'publish-time';
                    publishTimeSpan.textContent = publishTime;
                    liContent.querySelector('.info').appendChild(publishTimeSpan);
                }

                // 将复制的内容添加到已发布区域的ul中
                publishedUl.appendChild(liContent);

                // 从草稿箱的ul中移除li
                draftsUl.removeChild(li);

                // 移除复制的li中的发布按钮
                const publishBtn = liContent.querySelector('a[href="#publish"]');
                if (publishBtn) {
                    publishBtn.remove();
                }
            }
        }
    });


    publishedUl.addEventListener('click', async function (e) {
        if (e.target && e.target.matches('a[href="#delete"]')) {
            e.preventDefault(); // 阻止链接的默认行为
            const courseItem = e.target.closest('.course-item');

            // 获取课程 ID
            const courseID = courseItem.querySelector('#courseID').textContent.trim();
            console.log('删除被点击，课程ID:', courseID);
            try {
                const response = await fetch(`${apiUrl}/DeleteCourse`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ID: courseID }),
                });
                if (response.ok) {
                    console.log("已删除")
                }
            }
            catch (error) { }
            // 找到对应的li元素
            const li = e.target.closest('li');
            if (li) {
                // 从ul中移除li
                publishedUl.removeChild(li);
            }
        }

        if (e.target && e.target.matches('a[href="#register"]')) {
            e.preventDefault(); // 阻止链接的默认行为
            toggleRegistrationStatus(e);
        }
        if (e.target && e.target.matches('a[href="#comment"]')) {
            e.preventDefault(); // 阻止链接的默认行为
            toggleCommentStatus(e);
        }
    });


    function toggleRegistrationStatus(event) {
        event.preventDefault(); // 阻止链接默认行为
        const currentText = event.target.textContent;
        let newText = currentText === '禁止注册' ? '可以注册' : '禁止注册';
        event.target.textContent = newText;
        alert('注册状态已切换为: ' + newText);
    }

    // 切换评论状态的函数
    function toggleCommentStatus(event) {
        event.preventDefault(); // 阻止链接默认行为
        const currentText = event.target.textContent;
        let newText = currentText === '关闭评论' ? '打开评论' : '关闭评论';
        event.target.textContent = newText;
        alert('评论状态已切换为: ' + newText);
    }

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


    document.querySelectorAll('.tab-content').forEach(function (content) {
        content.addEventListener('click', function (e) {
            if (e.target && e.target.matches('a[href="#edit"]')) {
                e.preventDefault(); // 阻止链接的默认行为
                showEditModal(e.target);
            }
        });
    });
    var EditCourse
    function showEditModal(eventTarget) {
        EditCourse = eventTarget.parentElement.parentElement.parentElement.querySelector("#courseID").innerHTML;
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'block';
    }
    const uploadButton = document.querySelector('.upload-module button[type="submit"]');
    const fileInput = document.querySelector('.upload-module input[type="file"]');

    // 监听文件输入变化事件,获取文件url,添加将url传至数据库的js
    fileInput.addEventListener('change', function (event) {


        // 获取文件列表
        const files = event.target.files;
        if (files.length === 0) {
            return;
        }
        console.log(files[0])
        // 遍历文件列表，为每个文件生成URL
        for (let i = 0; i < files.length; i++) {
            const fileList = document.getElementById('edifilelist');
            fileList.textContent += files[i].name;
            fileList.textContent += ' '
            const formData = new FormData();
            formData.append('CourseID', EditCourse)
            formData.append('FileName', files[i].name)
            formData.append('file', files[i]);

            // 文件上传到服务器
            fetch(apiUrl + '/uploadCourseDoc', {
                method: 'POST',
                body: formData, // 使用 FormData 发送文件
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                })
                .then(data => {
                    console.log('文件上传成功:', data);
                })
                .catch(error => {
                    console.error('文件上传失败:', error);
                    alert('文件上传失败，请重试！');
                });

            console.log('File name:', files[i].name);
        }
    });

    // 阻止表单默认提交行为
    uploadButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log('上传按钮被点击');

        editModal.style.display = 'none';
        document.getElementById('editfile').textContent = '';

    });


    const addStuBtn = document.getElementById('addStuBtn');
    const studentsList = document.getElementById('studentsList');

    // 为添加学生按钮添加点击事件监听器
    addStuBtn.addEventListener('click', function () {
        const studentId = document.getElementById('studentId').value.trim();
        if (studentId) {
            // 创建新的li元素并添加学生信息
            const newLi = document.createElement('li');
            newLi.innerHTML = `
                <p>${studentId}</p>
                <button class="delete-student-btn">删除</button>
            `;
            // 将新的li元素添加到学生列表的ul中
            studentsList.appendChild(newLi);

            // 清空输入框
            document.getElementById('studentId').value = '';
        } else {
            alert('请输入学生ID');
        }
    });

    // 为学生列表添加点击事件监听器，以便删除学生
    studentsList.addEventListener('click', async function (e) {
        if (e.target && e.target.matches('.delete-student-btn')) {
            e.preventDefault(); // 阻止默认行为
            // 找到对应的li元素
            const li = e.target.closest('li');
            if (li) {
                // 从ul中移除li
                try {
                    const response = await fetch(`${apiUrl}/DeleteStudent`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ StudentID: e.target.parentElement.querySelector('#StudentID').textContent }),
                    });
                    if (response.ok) {
                        console.log("已删除")
                    }
                }
                catch (error) { }
                studentsList.removeChild(li);
            }
        }
    });


    const homeworkForm = document.getElementById('homeworkForm');
    const uploadOption = document.getElementById('uploadOption');
    const createOption = document.getElementById('createOption');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsList = document.getElementById('questionsList');
    uploadOption.style.display = 'block';
    // 获取单选按钮元素
    const assignmentTypeOptions = document.querySelectorAll('input[type="radio"][name="assignmentType"]');

    // 为单选按钮添加change事件监听器
    assignmentTypeOptions.forEach(function (option) {
        option.addEventListener('change', function () {
            if (this.value === 'upload') {
                uploadOption.style.display = 'block';
                createOption.style.display = 'none';
            } else if (this.value === 'create') {
                uploadOption.style.display = 'none';
                createOption.style.display = 'block';
            }
        });
    });

    // 为添加题目按钮添加点击事件监听器
    addQuestionBtn.addEventListener('click', function () {
        const questionType = prompt("请输入题目类型，若为选择题则输入1，若为填空题则输入2）:");
        let questionHtml = '';

        if (questionType === '1') {
            questionHtml = `
                <div class="question-item1">
                
                    <div class="question-type" style="font-size: 18px;">选择题</div>
                    <div class="question-question">
                        <label for="question${questionsList.children.length + 1}">题目:</label>
                        <input type="text" id="question${questionsList.children.length + 1}" name="question${questionsList.children.length + 1}" required>
                    </div>
                    <div class="question-option">
                        <label for="optionA${questionsList.children.length + 1}">选项A:</label>
                        <input type="text" id="optionA${questionsList.children.length + 1}" name="optionA${questionsList.children.length + 1}" required>
                    </div>
                    <div class="question-option">
                        <label for="optionB${questionsList.children.length + 1}">选项B:</label>
                        <input type="text" id="optionB${questionsList.children.length + 1}" name="optionB${questionsList.children.length + 1}" required>
                    </div>
                    <div class="question-option">
                        <label for="optionC${questionsList.children.length + 1}">选项C:</label>
                        <input type="text" id="optionC${questionsList.children.length + 1}" name="optionC${questionsList.children.length + 1}" required>
                    </div>
                    <div class="question-option">
                        <label for="optionD${questionsList.children.length + 1}">选项D:</label>
                        <input type="text" id="optionD${questionsList.children.length + 1}" name="optionD${questionsList.children.length + 1}" required>
                    </div>
                </div>
            `;
        } else if (questionType === '2') {
            questionHtml = `
                <div class="question-item2">
                    <div class="question-type" style="font-size: 18px;">填空题</div>
                    <div class="question-question">
                        <label for="question${questionsList.children.length + 1}">题目:</label>
                        <input type="text" id="question${questionsList.children.length + 1}" name="question${questionsList.children.length + 1}" required>
                    </div>
                    <div class="question-answer" style="margin-top: 20px;">
                        <label for="answer${questionsList.children.length + 1}" >答案:</label>
                        <textarea type="text" id="answer${questionsList.children.length + 1}" name="answer${questionsList.children.length + 1}" required></textarea>
                    </div>
                </div>
            `;
        }

        if (questionHtml) {
            const newQuestionLi = document.createElement('li');
            newQuestionLi.innerHTML = questionHtml;
            questionsList.appendChild(newQuestionLi);
        }
    });

    // 为作业发布表单添加提交事件监听器
    homeworkForm.addEventListener('submit', function (e) {
        e.preventDefault(); // 阻止表单默认提交行为

        const CourseID = e.target.querySelector('#courseId').value;
        const Time = e.target.querySelector('#deadline').value;
        // 这里可以添加更多的逻辑处理代码，比如发送请求等
        const selectedType = Array.from(assignmentTypeOptions).find(option => option.checked)?.value;

        if (selectedType === 'upload') {
            const fileInput = document.getElementById("homeworkFile");

            const file = fileInput.files[0]; // 获取文件
            if (!file) {
                alert('请上传文件！');
                return;
            }

            const formData = new FormData();
            formData.append('CourseID', CourseID)
            formData.append('deadline', Time);
            formData.append('file', file);

            // 文件上传到服务器
            fetch(apiUrl + '/uploadAssignment', {
                method: 'POST',
                body: formData, // 使用 FormData 发送文件
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('文件上传成功:', data);
                    alert('文件上传成功！');
                    homeworkForm.reset(); // 重置表单
                })
                .catch(error => {
                    console.error('文件上传失败:', error);
                    alert('文件上传失败，请重试！');
                });

        } else if (selectedType === 'create') {
            // 处理 "create" 的逻辑
            const questions = Array.from(questionsList.children).map((questionItem, index) => {
                const questionType = questionItem.querySelector('.question-type').textContent.trim();
                const questionText = questionItem.querySelector('input[type="text"]').value;

                let options = null;
                if (questionType === '选择题') {
                    options = {
                        A: questionItem.querySelector(`#optionA${index + 1}`).value,
                        B: questionItem.querySelector(`#optionB${index + 1}`).value,
                        C: questionItem.querySelector(`#optionC${index + 1}`).value,
                        D: questionItem.querySelector(`#optionD${index + 1}`).value,
                    };
                }

                const answer = questionType === '填空题'
                    ? questionItem.querySelector(`#answer${index + 1}`).value
                    : null;

                return {
                    questionType,
                    questionText,
                    options,
                    answer,
                };
            });

            const dataToSend = {
                courseID: CourseID,
                deadline: Time,
                assignmentType: selectedType,
                questions,
            };

            fetch(apiUrl + '/submitAssignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('作业信息提交成功:', data);
                    alert('作业提交成功！');
                    homeworkForm.reset();
                })
                .catch(error => {
                    console.error('提交作业信息时发生错误:', error);
                    alert('提交失败，请重试！');
                });
        }

        homeworkForm.reset();
        console.log('作业发布表单已提交');
    });

    let workingbtn = document.getElementById("workingBtn");
    workingbtn.addEventListener("click", function () {
        const courseId = document.getElementById("course_homework").value;
        if (courseId) {
            fetchHomeworkSubmissions(courseId);
        } else {
            alert("请输入课程ID");
        }
    });

    function fetchHomeworkSubmissions(courseId) {
        // 确保 fetch 调用后面没有逗号
        fetch(apiUrl + `/get-homework-submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseID: courseId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('网络响应失败');
                }
                return response.json();
            })
            .then((data) => {
                displaySubmissions(data);
            })
            .catch((error) => {
                console.error("获取作业提交信息失败:", error);
                alert('获取作业提交信息失败');
            });
    }

    function displaySubmissions(submissions) {
        const resultsContainer = document.getElementById("homeworkList");
        resultsContainer.innerHTML = ''; // 清空之前的结果
      
        submissions.forEach((submission) => {
          const status = submission.SubmissionTime < submission.Deadline ? '按时提交' : '未按时提交';
          const color = submission.SubmissionTime < submission.Deadline ? 'green' : 'red';
      
          // 假设 submission.Content 包含文件路径
          const contentPath = submission.Content; // 获取文件路径
      
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${submission.UserID}</strong>: 
            <a href="${contentPath}" download>下载文件</a> - 
            ${status} <span style="color: ${color};">(${new Date(submission.Deadline).toLocaleString()})</span>
          `;
          li.style.marginBottom = '10px';
          li.style.height = '50px';
          resultsContainer.appendChild(li);
        });
      }


});
function getCategoryName(code) {
    const categoryMap = {
        "EG": "理工·工学",
        "CS": "计算机",
        "ED": "教育·语言",
        "LI": "文学·艺术",
        "CR": "创业·职场",
        "CU": "哲史·文化",
        "FN": "经济·管理",
        "ME": "医学",
        "PH": "心理学",
        "SC": "社会·法律"
    };

    return categoryMap[code] || "未知分类";
};


