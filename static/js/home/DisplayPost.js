import { SetUrl } from "../navigation/setPath.js";
import { convertTime } from "../utils/convertDate.js";
import { ShowComments } from "../utils/showComment.js";

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
      postss.className = "card";
      postss.innerHTML = /*html*/ `
    <div class="header-card">
      <h4>
        <img src="/static/images/profil.svg" alt="profil" />
        ${post.nickname}
      </h4>
      <p class="datetime">Created at: ${convertTime(post.created_at)} </p>
    </div>
    <h3 class="title">${post.title}</h3>
    <p class="content">${post.content}</p>
    <div class="footer-card">
      <div class="category">
        <p>
          <span>Category: </span>#${post.categories
            .join("")
            .split(",")
            .join(" #")}
        </p>
      </div>
      <div class="reacts">
        <div>
          <span>${Number(post.nbCmnts)}</span>
          <button data-post="${Number(post.id)}" class="cmnt-btn hide">
            <i class="fa-regular fa-comment" ></i>
          </button>
        </div>
      </div>
    </div>
    <div class="comments" data-postID="${Number(post.id)}">
    </div>
  <div class="new-comment">
    <input type="text" name="newComment" id="" placeholder="Write your comment Here.">
    <button><i class="fa-solid fa-plus"></i></button>
  </div>     
`;
      container.appendChild(postss);
      const btn = document.querySelector(`[data-post="${Number(post.id)}"]`);
      btn.addEventListener("click", ShowComments);
    });
    SetUrl("/posts");
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
}
