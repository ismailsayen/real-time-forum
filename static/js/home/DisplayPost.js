import { DispalyError } from "../ErrorPage.js";
import { nickname } from "../main.js";
import { SetUrl } from "../navigation/setPath.js";
import { Toast } from "../toast/toast.js";
import { convertTime } from "../utils/convertDate.js";
import { ShowComments, ShowDiv } from "../utils/showComment.js";

export async function DisplayPost() {
  const container = document.querySelector(".postss");
  try {
    const resp = await fetch("/Getposts");
    if (!resp.ok) {
      let data = await resp.json();
      Toast(`${data.status} ${data.message}`);
      return;
    }
    const data = await resp.json();
    if (data === null) {
      container.innerHTML = "<h1>No Post</h1>";
      return;
    }
    container.innerHTML = "";
    data.forEach((post) => {
      const postss = document.createElement("div");
      postss.className = "card";
      const hasCmts = Number(post.nbCmnts) > 0;
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
          <span class="comment-count">${Number(post.nbCmnts)}</span>
          <button data-post="${Number(post.id)}" class="cmnt-btn ${hasCmts ? "hide" : "disabled"
        }" ${hasCmts ? "" : "disabled"}>
           ${hasCmts
          ? `<i class="fa-regular fa-comment"></i>`
          : `No comments yet`
        }
          </button>
        </div>
      </div>
    </div>
    <div class="comments" data-postID="${Number(post.id)}"></div>
  <div class="new-comment">
    <input type="text" name="newComment" id="${Number(
          post.id
        )}" placeholder="Write your comment Here.">
    <button id="comment-btn" id="${Number(
          post.id
        )}" ><i class="fa-solid fa-plus"></i></button>
    
  </div>
`;
      container.appendChild(postss);
      const commentBtn = postss.querySelector("#comment-btn");
      commentBtn.addEventListener("click", () => addComment(Number(post.id)));

      if (hasCmts) {
        const btn = postss.querySelector(`[data-post="${Number(post.id)}"]`);
        btn.dataset.loaded = "false";
        btn.addEventListener("click", async function (e) {
          if (this.dataset.loaded === "false") {
            await ShowComments(e);
            this.dataset.loaded = "true";
          } else {
            ShowDiv(this, document.querySelector(`[data-postID="${post.id}"]`));
          }
        });
      }
    });
    SetUrl("/posts");
  } catch (error) {
    DispalyError(error.Status, error.Message);
  }
}

async function addComment(idpost) {
  const content = document.getElementById(`${idpost}`);
  if (
    !content.value ||
    content.value.length <= 3 ||
    content.value.trim().length == 0
  ) {

    content.value = "";
    Toast("invalid Comment");
    return;
  }

  const newComment = {
    content: content.value,
    IdPost: idpost,
    date: new Date() - 0,
  };

  try {
    const resp = await fetch("/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    if (resp.ok) {
      Toast("Commment added ✅.");
      const card = document.getElementById(`${idpost}`).closest('.card');
      const commentsContainer = card.querySelector(`[data-postid="${idpost}"]`);
      const countSpan = card.querySelector('.comment-count');
      const commentBtn = card.querySelector(`[data-post="${idpost}"]`);
      const currentCount = parseInt(countSpan.textContent);
      countSpan.textContent = currentCount + 1;

      if (currentCount === 0) {
        commentBtn.classList.replace("disabled", "hide");
        commentBtn.disabled = false;
        commentBtn.innerHTML = '<i class="fa-regular fa-comment"></i>';
        commentBtn.dataset.loaded = "false";
        commentBtn.addEventListener("click", async function (e) {
          if (this.dataset.loaded === "false") {
            await ShowComments(e);
            this.dataset.loaded = "true";
          } else {
            ShowDiv(this, commentsContainer);
          }
        });
      }

      if (commentsContainer.style.display === "block") {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = /*html*/ `
          <div class="header-comment">
            <h4>
              <img src="/static/images/profil.svg" alt="">
              ${nickname}
            </h4>
            <p class="datetime">${convertTime(newComment.date)}</p>
          </div>
          <p class="content">${newComment.content}</p>
        `;
        commentsContainer.appendChild(commentElement);
      } else if (commentBtn.classList.contains("hide") && !commentBtn.disabled) {
        commentBtn.dataset.loaded = "false";
      }
      content.value = "";
    } else {
      const errr = await resp.json();


      Toast(errr);
    }
  } catch (err) {
    Toast(err);
  }
}
