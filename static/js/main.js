import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";

export async function isLogged() {
  try {
    const resp = await fetch("/isLog");

    if (resp.status === 403) {
      SetUrl("/auth");
      LoadPage();
    }
    if (resp.ok) {
      SetUrl("/");
      LoadPage();
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return;
  }
}

await isLogged();
