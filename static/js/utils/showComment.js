import { convertTime } from "./convertDate.js";

export const ShowComments = async (e) => {
  const idPost = e.currentTarget.getAttribute("data-post");
  const comments = document.querySelector(`[data-postID="${idPost}"]`);
  const div = e.currentTarget;

  if (comments.children.length == 0) {
    let data = await getComment(idPost);
    data.map((ele) => {
      let comnt = /*html*/ `
        <div class="comment">
            <div class="header-comment">
              <h4>
                <img src="/static/images/profil.svg" alt="">
                ${ele.nickname}
              </h4>
              <p class="datetime">${convertTime(ele.date)}</p>
            </div>
            <p class="content">${ele.content}</p>
        </div>
      `;
      comments.innerHTML += comnt;
    });
    ShowDiv(div, comments);
    return;
  }
  ShowDiv(div, comments);
};
async function getComment(postid) {
  const newComment = {
    id: Number(postid),
  };
  let data;
  try {
    const resp = await fetch("/getComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    data = await resp.json();
  } catch (err) {
    Toast(err);
  }
  return data;
}
function ShowDiv(div, comments) {
  if (div.classList[1] == "hide") {
    comments.style.display = "block";
    div.classList.replace("hide", "show");
    div.children[0].style.color = "red";
  } else {
    comments.style.display = "none";
    div.classList.replace("show", "hide");
    div.children[0].style.color = "black";
  }
}
