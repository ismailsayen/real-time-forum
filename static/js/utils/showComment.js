export const ShowComments = async (e) => {
  const idPost = e.currentTarget.getAttribute("data-post");
  const comments = document.querySelector(`[data-postID="${idPost}"]`);
  if (e.currentTarget.classList[1] == "hide") {
    comments.style.display = "flex";
    e.currentTarget.classList.replace("hide", "show");
    e.target.style.color = "red";
    console.log(comments.children.length);
  } else {
    comments.style.display = "none";
    e.currentTarget.classList.replace("show", "hide");
    e.target.style.color = "black";
  }
};
