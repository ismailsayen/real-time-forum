import { SetUrl } from "../navigation/setPath.js";

export async function DisplayPost() {
  const container = document.querySelector(".postss");
  try {
    const resp = await fetch("/Getposts");
    const data = await resp.json();
    if (data === null) {
      container.innerHTML = "<h1>No Post</h1>";
      return;
    }

    data.forEach((post) => {
      const postss = document.createElement("div");
      postss.className = "cards";
      postss.innerHTML = /*html*/ `
    
  <div class="card">
    <div class="header-card">
      <h4>
        <img src="/static/images/profil.svg" alt="profil" />
        ${post.nickname}
      </h4>
      <p class="datetime">Created at: ${post.created_at} ago</p>
    </div>

    <h3 class="title">${post.title}</h3>
    <p class="content">${post.content}</p>

    <div class="footer-card">
      <div class="category">
        <p>
          <span>Category:</span> #
          ${post.categories.join("").split(",").join(" #")}
        </p>
      </div>

      <div class="reacts">
        <div>
          <span>10</span>
          <button>
            <i class="fa-regular fa-comment"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
       
`;
      container.appendChild(postss);
    });
    SetUrl("/posts");
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
}
