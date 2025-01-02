
document.addEventListener('DOMContentLoaded', async function() {
    console.log(localStorage.getItem("ID"))

    //获取所有学生
    try{
        const response = await fetch(`${apiUrl}/getStudent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.ok){
            StudentItems = await response.json();
            console.log(StudentItems[0]);
            for(var i in StudentItems){
                var StudentItem = StudentItems[i]
                const newLi = document.createElement('li');            
                var html = `
                                 <p id='StudentID'>${StudentItem.UserID}</p>
                                 <p>${StudentItem.RealName?StudentItem.RealName:"暂未更新真实姓名"}</p>
                                 <button class="delete-student-btn">删除</button>              
                `;
                console.log(html);
                newLi.innerHTML = html;
                document.getElementById('adstu').querySelector('ul').appendChild(newLi);
            }
        }
    }
    catch(err){}
    //获取所有老师
    console.log(localStorage.getItem("ID"))
    try{
        const response = await fetch(`${apiUrl}/getTeacher`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.ok){
            TeacherItems = await response.json();
            console.log(TeacherItems[0]);
            for(var i in TeacherItems){
                var TeacherItem = TeacherItems[i]
                const newLi = document.createElement('li');            
                var html = `
                                 <p id='TeacherID'>${TeacherItem.UserID}</p>
                                 <p>${TeacherItem.RealName?TeacherItem.RealName:"暂未更新真实姓名"}</p>
                                 <button class="delete-teacher-btn">删除</button>              
                `;
                console.log(html);
                newLi.innerHTML = html;
                document.getElementById('adtch').querySelector('ul').appendChild(newLi);
            }
        }
    }
    catch(err){}
    //获取所有课程
    try{
        const response = await fetch(`${apiUrl}/getCourse`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.ok){
            pubItems = await response.json();
            const ul = document.getElementById("allcourse");
            
            for(var i in pubItems){
                var pubItem = pubItems[i]
                const html = `<li>
                                <span>课程名称：${pubItem.CourseName}</span>
                                 <span>课程ID：${pubItem.CourseID} </span>
                             </li>`
                ul.innerHTML+=html
            }
        }
    }
    catch(error){}

    document.getElementById("addRecBtn").addEventListener("click",async function(e){
        e.preventDefault();
        const CouresID = document.getElementById("addRec").value;
        const response = await fetch(`${apiUrl}/addRec`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({CourseID:CouresID})
        });
        if(response.ok){
            alert("添加推荐成功！")
        }
    })


    const links = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const draftsLink = document.querySelector('a[data-target="adtch"]');
    draftsLink.classList.add('active'); // 添加激活类

    const draftsContent = document.getElementById('adtch');
    draftsContent.style.display = 'block'; // 显示草稿箱内容

    links.forEach(link => {
        link.addEventListener('click', function(e) {
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

    var profileModal = document.getElementById("editProfileModal");

    // 获取编辑信息链接元素
    document.addEventListener('click', function(e) {
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



    const studentsList = document.getElementById('studentsList');
    studentsList.addEventListener('click',async function(e) {
        if (e.target && e.target.matches('.delete-student-btn')) {
            e.preventDefault(); // 阻止默认行为
            // 找到对应的li元素
            const li = e.target.closest('li');
            if (li) {
                // 从ul中移除li
                try{
                    const response = await fetch(`${apiUrl}/DeleteStudent`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({StudentID:e.target.parentElement.querySelector('#StudentID').textContent}),
                    });
                    if(response.ok){
                        console.log("已删除")
                    }
                }
                catch(error){}
                studentsList.removeChild(li);
            }
        }
    });

    const TeacherList = document.getElementById('teachersList');
    TeacherList.addEventListener('click',async function(e) {
        if (e.target && e.target.matches('.delete-teacher-btn')) {
            e.preventDefault(); // 阻止默认行为
            // 找到对应的li元素
            const li = e.target.closest('li');
            if (li) {
                // 从ul中移除li
                try{
                    const response = await fetch(`${apiUrl}/DeleteTeacher`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({TeacherID:e.target.parentElement.querySelector('#TeacherID').textContent}),
                    });
                    if(response.ok){
                        console.log("已删除")
                    }
                }
                catch(error){}
                TeacherList.removeChild(li);
            }
        }
    });
});
