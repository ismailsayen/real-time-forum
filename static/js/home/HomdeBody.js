import { DisplayPost } from "./DisplayPost.js";

export function HomeBody() {
  const header = document.querySelector(".header").getBoundingClientRect();
  const container = document.querySelector(".container");
  const homebd = document.createElement("div");
  const usersSection =document.createElement("div")
  const postSection =document.createElement("div")
  usersSection.className="user-section"
  postSection.className="post-section"
  homebd.className = "container-body";
  homebd.style.height = `calc(100% - ${header.height}px - 0.7rem)`;

  const addPostBtn = document.createElement("button");
  addPostBtn.className = "add-post-btn";
  addPostBtn.textContent = "Add Post";
  addPostBtn.addEventListener("click", openPostForm);
  GetCategory()

  postSection.appendChild(addPostBtn);

  createPostFormModal();
  homebd.appendChild(postSection)
  homebd.appendChild(usersSection)
  container.appendChild(homebd);
  DisplayPost();
}

function createPostFormModal() {

  const modal = document.createElement("div");
  modal.className = "post-modal";
  modal.style.display = "none";

  const modalContent = document.createElement("div");
  modalContent.className = "post-modal-content";

  const closeBtn = document.createElement("span");
  closeBtn.className = "close-btn";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  const form = document.createElement("form");
  form.id = "post-form";
  form.addEventListener("submit", handlePostSubmit);

  form.innerHTML = `
    <h2>Create New Post</h2>
    <div class="form-group">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" required>
    </div>
    <div class="form-group">
      <label for="content">Content:</label>
      <textarea id="content" name="content" rows="5" required></textarea>
    </div>
    <div class="form-group">
      <label for="categories">Categories (comma-separated):</label>
      <input type="text" id="categories" name="categories">
    </div>
    <button type="submit" class="submit-btn">Submit Post</button>
  `;
  

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  

  document.body.appendChild(modal);
  
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

function openPostForm() {
  const modal = document.querySelector(".post-modal");
  if (modal) {
    modal.style.display = "block";
  }
}

async function GetCategory() {
  try {
     const resp = await fetch("/getCategory");
 
     if (!resp.ok) {
       const result = await resp.json();
       console.log(result);
       return;
     }
     console.log(resp);

   } catch (err) {
     Toast(err);
   }


}















async function handlePostSubmit(event) {
  event.preventDefault();
  
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const categoriesInput = document.getElementById("categories");
  
  const newPost = {
    title: titleInput.value,
    content: contentInput.value,
    // Assuming you have a way to get the current user's nickname
    nickname: "CurrentUser", // Replace with actual user nickname
    categories: categoriesInput.value.split(",").map(cat => cat.trim()).filter(cat => cat !== "")
  };
  
  try {
    const response = await fetch("/CreatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
    
    if (response.ok) {
      // Close modal
      document.querySelector(".post-modal").style.display = "none";
      
      // Clear form
      document.getElementById("post-form").reset();
      
      // Refresh posts display
      const postSection = document.querySelector(".post-section");
      // Remove all posts except the Add Post button
      while (postSection.childNodes.length > 1) {
        postSection.removeChild(postSection.lastChild);
      }
      DisplayPost();
    } else {
      console.error("Failed to create post");
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}