import { Logout } from "./authPage/logout.js";



export function Header() {
  const container = document.querySelector(".container");

  const header = document.createElement("header");
  header.className = "header";

  const title = document.createElement("h1");
  title.textContent = "Real Time Forum";

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.className = "logout-btn";
  logoutBtn.addEventListener("click", () => {
    console.log("event");
    
    Logout()
  });

  header.appendChild(title);
  header.appendChild(logoutBtn);

  container.appendChild(header);
}
