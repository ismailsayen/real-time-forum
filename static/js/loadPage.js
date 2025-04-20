import { DesplayLoginForm } from "./authPage/login.js";
import { DispalyError } from "./ErrorPage.js";

export function LoadPage() {
  let container = document.querySelector(".container");
  let path = location.pathname;
  container.innerHTML = "";
  console.log(path);
  
  switch (path) {
    case "/auth":
      DesplayLoginForm()
      break
    default:
  console.log("fff",path);
      
      DispalyError(404)

  }
}
