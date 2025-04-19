async function isLogged() {
  let resp = await fetch("/isLog");
  const data = await resp.json();
  if (data.status===403){
    window.history.pushState(null,'',"/")
  }
}

function test(){
  const tt = document.createElement("div");
  tt.innerHTML="this is home /"
  const btn =document.createElement("button")
  btn.textContent="click"
  btn.addEventListener("click",DisplayPost)

}
async function DisplayPost() {
  try {
    const resp = await fetch("/Getposts");
    const data = await resp.json();

    const container = document.querySelector(".container");
console.log(data);

    data.forEach(post => {
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
    window.history.pushState(null,'',"/posts")
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}
// DisplayPost();
// isLogged();
