document.addEventListener("DOMContentLoaded", async function () {
  const URLapi = "http://localhost:3000";
  const response1 = await fetch(`${URLapi}/getSwiper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response1.ok) {
    const Container = document.getElementById("swiper-wrapper");
    Container.innerHTML = "";
    Wrappers = await response1.json();
    for (var i = 0; i < 3; i++) {
      if (i >= Wrappers.length) break;
      var wrapper = Wrappers[i];
      var html = `<div class="swiper-slide">
                <a href="course.html?id=${wrapper.CourseID}">
                  <img style="width:1280px;height:440px"
                    class="lazy-img"
                    src="${wrapper.CoverImage}"
                  />
                </a>
              </div>`;
      Container.innerHTML += html;
    }
  }

  const response2 = await fetch(`${URLapi}/getNewest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response2.ok) {
    const arr = await response2.json();
    const Container = document.getElementById("newestCourseWrapper");
    Container.innerHTML = "";
    for (var i = 0; i < 3; i++) {
      const item = arr[i];
      const html = `<div class="newCourseItem">
            <a class="courseItem" href="course.html?id=${item.CourseID}" target="_blank">
              <div class="courseItem-img">
                <img style="width:305px;height:208px"
                  class="lazy-img"
                  src="${item.CoverImage}"
                />
              </div>
              <div class="courseItem-info">
                <div class="courseItem-info-main">
                  <h3 class="courseItem-title oneline">
                    ${item.CourseName}
                  </h3>
                  <p class="courseItem-from">
                    <span class="courseItem-teacher oneline"> ${item.RealName}</span>
                  </p>
                </div>
              </div>
            </a>
          </div>`;
      Container.innerHTML += html;
    }
  }

  const response3 = await fetch(`${URLapi}/gethot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response3.ok) {
    const arr = await response3.json();
    const Container = document.getElementById("hotCourseList");
    Container.innerHTML = "";
    for (var i = 0; i < arr.length; i++) {
      if (i > 5) break;
      item = arr[i];
      const html = `<li class="hotItem">
            <div class="rankswrap">
              <p class="rank">No.${i + 1}</p>
              <a
                class="rankItem"
                style="display: flex"
                href="course.html?id=${item.CourseID}"
                target="_blank"
              >
                <div class="rankItem-img" style="float: left">
                  <img
                    class="rankimg"
                    src="${item.CoverImage}"
                  />
                </div>
                <div class="infowrapper">
                  <h3 class="ranktitle">
                    ${item.CourseName}
                  </h3>

                  <span class="rankauthor">${item.RealName}</span>
                </div>
              </a>
            </div>
          </li>`;
      Container.innerHTML += html;
    }
  }
  const response4 = await fetch(`${URLapi}/getRec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response4.ok) {
    const arr = await response4.json();
    const Container = document.getElementById("swiper-wrapper2");
    Container.innerHTML = "";
    for (var i = 0; i < arr.length; i++) {
      if (i > 5) break;
      item = arr[i];
      const html = `<div class="swiper-slide2">
              <a class="courseItem" href="course.html?id=${item.CourseID}" target="_blank">
                <div class="courseItem-img">
                  <img
                    class="lazy-img" style="width:305px;height:209px"
                    src="${item.CoverImage}"
                  />
                </div>
                <div class="courseItem-info">
                  <div class="courseItem-info-main">
                    <h3 class="courseItem-title oneline">${item.CourseName}</h3>
                    <p class="courseItem-from">
                      <span class="courseItem-teacher oneline">${item.RealName}</span>
                    </p>
                  </div>
                </div>
              </a>
            </div>`;
      Container.innerHTML += html;
    }
    Container.innerHTML+=Container.innerHTML;
  }
});
