import { DisplayLoginForm } from "./authPage/displayLoginForm.js";
import { DispalyError } from "./ErrorPage.js";
import { HomePage } from "./home/HomePage.js";

export function LoadPage() {
  let container = document.querySelector(".container");
  let path = location.pathname;
  container.innerHTML = "";

  switch (path) {
    case "/auth":
      DisplayLoginForm();
      break;
    case "/":
      HomePage();
      break;
    default:
      DispalyError();
  }
}
