export async function DisplayPost() {
  const container = document.querySelector(".post-section");
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
      container.appendChild(postss);
    });
    window.history.pushState(null, "", "/posts");
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
