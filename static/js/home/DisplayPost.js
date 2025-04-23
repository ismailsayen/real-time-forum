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
      postss.innerHTML = `
            <h2>${post.title}</h2>
            <p><strong>By:</strong> ${post.nickname}</p>
            <p>${post.content}</p>
            <p><strong>Categories:</strong> ${post.categories.join(", ")}</p>
            <hr/>
          `;
          container.appendChild(postss)
    });
    SetUrl("/posts");
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
}
