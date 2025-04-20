import { DisplayLoginForm } from "./authPage/displayLoginForm.js";
import { DisplayPost } from "./DisplayPost.js";
import { DispalyError } from "./ErrorPage.js";

export function LoadPage() {
  let container = document.querySelector(".container");
  let path = location.pathname;
  container.innerHTML = "";
  console.log(path);
  
  switch (path) {
    case "/auth":
      DisplayLoginForm();
      break;
    case "/home":
      DisplayPost()
      break
    default:
      DispalyError();
  }
}
