document.getElementById('submitComment').addEventListener('click', function() {
    const commentInput = document.getElementById('comment');
    const commentText = commentInput.value.trim();
    console.log("submit")
    if (commentText) {
        // 创建一个新的评论元素
        const commentItem = document.createElement('p');
        commentItem.textContent = commentText; // 设置评论文本
        
        // 将评论添加到评论列表中
        document.getElementById('comments-list').appendChild(commentItem);
        
        // 清空输入框
        commentInput.value = '';
    } else {
        alert('评论内容不能为空！');
    }
});

// 模拟用户身份，true 表示已登录，false 表示游客
const isLoggedIn = false; // 将其设置为 false 以模拟游客

        if(localStorage.getItem('token')){
            isLoggedIn=true;
        }
document.addEventListener('DOMContentLoaded', function() {
    const notesMessage = document.getElementById('notes-message');
    const notesContent = document.getElementById('notes-content');

    if (isLoggedIn) {
        notesMessage.textContent = '欢迎回来！你可以在下面写下你的笔记：';
        notesContent.style.display = 'block';

        // 处理保存笔记功能
        document.getElementById('saveNote').addEventListener('click', function() {
            const noteText = document.querySelector('#notes-content textarea').value.trim();
            if (noteText) {
                const noteItem = document.createElement('p');
                noteItem.textContent = noteText;
                document.getElementById('user-notes-list').appendChild(noteItem);
                document.querySelector('#notes-content textarea').value = ''; // 清空输入框
            } else {
                alert('笔记内容不能为空！');
            }
        });
    } else {
        notesMessage.innerHTML = '你是游客，无法查看个人笔记。<br>👀';
    }
});


