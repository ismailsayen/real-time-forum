import { SetUrl } from "../navigation/setPath.js";
import { Toast } from "../toast/toast.js";
import { convertTime } from "../utils/convertDate.js";
import { ShowComments } from "../utils/showComment.js";
import { sendMessage } from "../utils/socket.js";

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
          <button data-post="${Number(post.id)}" id="display-comment" class="cmnt-btn hide">
            <i class="fa-regular fa-comment" ></i>
          </button>
        </div>
      </div>
    </div>
    <div class="comments" data-postID="${Number(post.id)}">
      
    </div>
  <div class="new-comment">
    <input type="text" name="newComment" id="comment-content" placeholder="Write your comment Here.">
    <button id="comment-btn"><i class="fa-solid fa-plus"></i></button>
    
  </div>
`;
const commentBtn = postss.querySelector("#comment-btn");
commentBtn.addEventListener("click", () => addComment(Number(post.id)));
const displaycomment = postss.querySelector("#display-comment");
displaycomment.addEventListener("click", () => getComment(Number(post.id)));
      container.appendChild(postss);
      const btn = document.querySelector(`[data-post="${Number(post.id)}"]`);
      btn.addEventListener("click", ShowComments);
    });
    SetUrl("/posts");
  } catch (error) {
    console.log("Error fetching posts:", error);
  }

  

}



async function addComment(idpost){
const content =document.getElementById("comment-content")
if(!content.value||content.value.length<=3){
Toast("invalide Comment")
return
}

  const newComment = {
    content:content.value,
  
    IdPost:idpost,
    date:new Date() - 0
  };

 try{

  const resp= await fetch("/addComment",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newComment),
  });

  if (resp.ok) {
  
    Toast("Commment added ✅.")
    content.value=""
    sendMessage({
      type: "new_comment",
      postId: idpost,
      comment: newComment.content,
      time: new Date(),
    });
  } else {
    const errr = await resp.json();
    console.error("Failed to create comment", errr);
    Toast(errr);
  }


 }catch(err){
  Toast(err)

 }

}





async function getComment(postid) {


  const newComment = {
    id:postid
  };


  
try{


  const resp= await fetch("/getComment",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newComment),
  });

  const data = await resp.json();
    console.log(data);
    
}catch(err){
Toast(err)
}

}