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
  homebd.appendChild(postSection)
  homebd.appendChild(usersSection)
  container.appendChild(homebd);
  DisplayPost();
}
