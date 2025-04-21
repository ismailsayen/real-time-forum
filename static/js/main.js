import { LoadPage } from "./loadPage.js";

async function isLogged() {
  let resp = await fetch("/isLog");
  let data = await resp.json();

  if (resp.status === 403) {
    window.history.pushState(null, "", "/auth");
    LoadPage();
    return;
  }

  if (resp.ok) {
    window.history.pushState(null, "", "/");
    LoadPage();
  } else {
    console.error("Erreur de réponse non gérée :", data.status);
  }
}

isLogged();
