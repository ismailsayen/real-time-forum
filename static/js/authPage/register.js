import { LoadPage } from "../loadPage.js";
import { SetUrl } from "../navigation/setPath.js";

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
    let data = await req.json();
    if (data.Status != 200) {
      console.log("qqqqqq");
      return;
    }
    SetUrl("/");
    LoadPage();
  });
}
