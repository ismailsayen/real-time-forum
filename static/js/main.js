import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";

async function isLogged() {
  let resp = await fetch("/isLog");
  let data = await resp.json();

  if (resp.status === 403) {
    SetUrl("/auth");
    LoadPage();
    return;
  }
  if (resp.ok) {
    SetUrl("/");
    LoadPage();
  } else {
    console.error("Erreur de réponse non gérée :", data.status);
  }
}

isLogged();
