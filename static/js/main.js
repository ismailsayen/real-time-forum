import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";
import { SetNickname } from "./utils/changeStatus.js";

export async function isLogged() {
  try {
    const resp = await fetch("/isLog");

    if (resp.ok) {
      let data = await resp.json();
      SetUrl("/");
      LoadPage();
      SetNickname(data.nickname);
      return true;
    }
    if (!resp.ok) {
      SetUrl("/auth");
      LoadPage();
      return false;
    }
  } catch (error) {
    SetUrl("/auth");
    LoadPage();
    return false;
  }
}

await isLogged();
