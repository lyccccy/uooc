profileForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // 阻止表单默认提交行为
    var nickname;
    var signature = document.getElementById('signature').value.trim();
    // 获取表单中的输入值
    if(document.getElementById('nickname').value.trim() != ''){
        nickname = document.getElementById('nickname').value.trim();
        
        document.querySelector('.catalogue li:nth-of-type(1)').textContent = "昵称："+nickname; 
    }

    const imageFile = document.getElementById('profileimg').files[0]; 
    
   
   
    formData = new FormData();
    formData.append("UserID",localStorage.getItem("ID"))
    formData.append("realName",nickname);
    formData.append("signature",signature);
    if(imageFile){
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