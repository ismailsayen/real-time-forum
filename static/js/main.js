import { DispalyError } from "./ErrorPage.js";
import { LoadPage } from "./loadPage.js";

async function isLogged() {
  let resp = await fetch("/isLog");
  const data = await resp.json();

  if (data.status === 403) {
    // window.history.pushState(null, "", "/auth");
     LoadPage();
  }
}

isLogged();
