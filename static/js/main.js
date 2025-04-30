import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";
import { SetNickname } from "./utils/changeStatus.js";
export let nickname;
export async function isLogged(change = false) {
  try {
    const resp = await fetch("/isLog");

    if (resp.ok) {
      if (change) {
        let data = await resp.json();
        nickname = data.nickname;
        SetUrl("/");
        LoadPage();
        SetNickname(nickname);
      }
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

await isLogged(true);
