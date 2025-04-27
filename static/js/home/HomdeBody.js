import { Toast } from "../toast/toast.js";
import { DisplayPost } from "./DisplayPost.js";
import { FetchUsers } from "./GetUsers.js";

export async function HomeBody(currentuserid) {
  const header = document.querySelector(".header").getBoundingClientRect();
  const container = document.querySelector(".container");
  const homebd = document.createElement("div");
  const usersSection = document.createElement("div");
  const postSection = document.createElement("div");
  usersSection.className = "user-section";
  postSection.className = "post-section";
  homebd.className = "container-body";
  homebd.style.height = `calc(100% - ${header.height}px - 0.7rem)`;
  const postss = document.createElement("div");
  postss.className = "postss";
  const addPostBtn = document.createElement("button");
  addPostBtn.className = "add-post-btn";
  addPostBtn.textContent = "Add Post";
  addPostBtn.addEventListener("click", openPostForm);
  const categories = await GetCategory();

  postSection.appendChild(addPostBtn);

  createPostFormModal(categories);
  homebd.appendChild(usersSection);
  homebd.appendChild(postSection);
  postSection.appendChild(postss);
  container.appendChild(homebd);
  DisplayPost();
  FetchUsers(currentuserid)
}

function createPostFormModal(categories) {
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
  `;
  const checkboxGroup = document.createElement("div");

  checkboxGroup.className = "form-group checkbox-group";
  const label = document.createElement("label");
  label.textContent = "Categories:";
  checkboxGroup.appendChild(label);

  categories.forEach((cat) => {
    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "checkbox-cat";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "categories";
    checkbox.value = cat.id;
    checkbox.id = `${cat.id}`;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.setAttribute("for", `${cat.id}`);
    checkboxLabel.textContent = cat.name;

    checkboxContainer.appendChild(checkboxLabel);
    checkboxContainer.appendChild(checkbox);
    checkboxGroup.appendChild(checkboxContainer);
  });

  form.appendChild(checkboxGroup);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "submit-btn";
  submitBtn.textContent = "Submit Post";
  form.appendChild(submitBtn);

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

      return;
    }
    const data = await resp.json();
   

    return data;
  } catch (err) {
    Toast(err);
  }
}

async function handlePostSubmit(event) {
  event.preventDefault();
  const container = document.querySelector(".postss");
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const checkedCategories = Array.from(
    document.querySelectorAll('input[name="categories"]:checked')
  ).map((checkbox) => checkbox.value);

  if (checkedCategories.length == 0) {
    Toast("Category Required");
    return;
  }
  if (!title || title.length <= 5) {
    Toast("Title to short");
    return;
  }
  if (!content || content.length <= 5) {
    Toast("Content too short ");
    return;
  }

  const newPost = {
    title: title,
    content: content,
    categories: checkedCategories,
    created_at: new Date() - 0,
  };

  try {
    const response = await fetch("/addPost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      document.querySelector(".post-modal").style.display = "none";
      document.getElementById("post-form").reset();
      const postSection = document.querySelector(".post-section");
      container.innerHTML = "";
      DisplayPost();
      Toast("Post added ✅.");
    } else {
      const errr = await response.json();
      console.error("Failed to create post", errr);
      Toast(errr);
    }
  } catch (error) {
    console.error("Error creating post:", error);
    Toast(error);
  }
}
