import { LoadPage } from "../loadPage.js";
import { SetUrl } from "../navigation/setPath.js";
import { Toast } from "../toast/toast.js";

export function Register() {
  const form = document.getElementById("signup-form");
  const btn = document.getElementById("register");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form, btn));
    formData.age = parseInt(formData.age);

    let req = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!req.ok) {
      //Toast("404 azbi")
      let data = await req.json();
      for (let [key, value] of Object.entries(data)) {
        if (value !== "") {
          displayError(key, value);
          console.log(key, value);
        }
      }
      return;
    }
    SetUrl("/");
    LoadPage();
  });
}

function displayError(name, message) {
  const div = document.querySelector(`.${name}`);
  div.innerHTML = message;
  div.style.display = "block";
}
