import { Logout } from "../authPage/logout.js";

export function Header() {
  const container = document.querySelector(".container");

  const header = document.createElement("header");
  header.className = "header";
  const divhead = document.createElement("div");

  const title = document.createElement("h1");
  title.textContent = "RT-Forum";
  const nickname = document.createElement("h3");
  nickname.className = "nickname";
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.className = "logout-btn";
  logoutBtn.addEventListener("click", () => {
    Logout();
  });

  header.appendChild(title);
  divhead.appendChild(nickname);
  divhead.appendChild(logoutBtn);
  header.appendChild(divhead);

  container.appendChild(header);
}
