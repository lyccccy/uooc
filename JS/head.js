const username = document.getElementById("username");
const userprofile = document.getElementById("userprofile");
const apiUrl = "http://localhost:3000"; // API 服务的 URL
var Username = "User";
var ID ;
var data;
// Function to render the view based on token existence
async function renderView() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await fetch(`${apiUrl}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("获取用户信息失败，请重新登录");
        return;
      }

      data = await response.json();

      // If token exists, show authenticated view
      console.log(data);
      Username = data.Username;
      ID = data.UserID;
      avatar = data.avatar;
      console.log(Username)
      localStorage.setItem("ID",ID);
      console.log("set localstorage success:"+ID)
      username.textContent = data.RealName||data.Username || "User";
      var jump;
      if(data.Role=='student')
        jump =  './student.html'
      else if(data.Role=='admin')
        jump = './admin.html'
      else
        jump ='./experiment.html'

      document.getElementById("avatar").src=avatar;
      userprofile.innerHTML = `
        <div class="layout-header-menu">
          <ul>
            <li><a href="${jump}">个人中心</a></li>
            <br>
            <li><p id="Logout">退出</p></li>
          </ul>
        </div>`;
      try{
        document.getElementById("profile").innerHTML=`
        <img src="${avatar}" alt="Profile Image">
        <a href="" id="qiufo">编辑信息</a>
        <li>昵称：${data.RealName}</li>
        <li>身份：${data.Role}</li>
        <li>学校：深圳大学</li>
        <li>—————————————</li>
        <li>个人简介：${data.signature}</li>`
      }
      catch{}
      // Logout event listener
      const logoutButton = document.getElementById("Logout");
      if (logoutButton) {
        logoutButton.onclick = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("ID");
          renderView();
          window.location.href = "homepage.html";
        };
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      username.textContent = "Welcome, Guest!";
      userprofile.innerHTML = `
        <div class="layout-header-menu">
          <p>获取用户信息失败，请重新登录。</p>
          <a id="Login" href="./login.html">登录</a>
        </div>`;
    }
  } else {
    // If no token, show unauthenticated view
    username.textContent = "Welcome, Guest!";
    userprofile.innerHTML = `
      <div class="layout-header-menu">
        <p>Please login to access more features.</p>
        <a id="Login" href="./login.html">登录</a>
      </div>`;
  }
}

// Initial render
renderView();

//搜索功能
// 搜索逻辑函数：跳转到 search.html 并带上搜索词
function handleSearch() {
    const keyword = document.getElementById("searchInput").value.trim();
  
    if (keyword) {
      // 跳转到 search.html 并传递搜索词
      window.location.href = `search.html?query=${encodeURIComponent(keyword)}`;
    } else {
      alert("请输入关键词！");
    }
  }
  
  // 监听回车键
  document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
  
  // 监听按钮点击
  document.getElementById("searchButton").addEventListener("click", handleSearch);