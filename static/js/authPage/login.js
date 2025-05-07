import { isLogged } from "../main.js";
import { Toast } from "../toast/toast.js";

export async function Login() {
  const nickname = document.querySelector("#nickname").value;
  const password = document.querySelector("#loginPassword").value;
  const error = document.querySelector(".login-error");

  if (nickname === "" || password === "") {
    error.innerHTML = "Nickname and password cannot be empty";
    error.style.display = "block";
    return;
  }

  if (nickname.length < 4 || password.length < 6) {
    error.innerHTML =
      "Nickname must be at least 4 characters and password at least 6";
    error.style.display = "block";
    return;
  }

  try {
    const resp = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: nickname,
        password: password,
      }),
    });

    if (!resp.ok) {
      const result = await resp.json();
      Toast(`${result.status} ${result.message}`);
      error.innerHTML = result.message;
      error.style.display = "block";
      return;
    }
    localStorage.setItem("welcome", `Welcome, ${nickname}!`);

    await isLogged(true);
  } catch (err) {
    console.log(err);

    error.innerHTML = "Something went wrong. Please try again.";
    error.style.display = "block";
  }
}
