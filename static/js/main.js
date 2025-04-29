import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";
import { SetNickname } from "./utils/changeStatus.js";

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
      let data = await resp.json();
      SetNickname(data.nickname);
    }
  } catch (error) {
    return;
  }
}

await isLogged();
