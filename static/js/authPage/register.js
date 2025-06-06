import { isLogged } from "../main.js";
import { Toast } from "../toast/toast.js";

export function Register() {
  const form = document.getElementById("signup-form");
  const btn = document.getElementById("register");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
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
      let data = await req.json();
    
      
      Toast(`${data.status} ${data.message}`)
      for (let [key, value] of Object.entries(data)) {
        if (value !== "") {
          displayError(key, value);
         
        }
      }
      return;
    }
    localStorage.setItem("welcome", `Welcome, ${nickname}!`);
    await isLogged(true);

  });
}

function displayError(name, message) {
  const div = document.querySelector(`.${name}`);
  div.innerHTML = message;
  div.style.display = "block";
}

function clearErrors() {
  const errorDivs = document.querySelectorAll(".error");
  errorDivs.forEach((div) => {
    div.innerHTML = "";
    div.style.display = "none";
  });
}
