import { DispalyError } from "./ErrorPage.js";
import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";
import { Toast } from "./toast/toast.js";
import { SetNickname } from "./utils/changeStatus.js";
export let nickname;
export async function isLogged(change = false) {
  try {
    const resp = await fetch("/isLog");

    if (resp.ok) {
      if (change) {
        let data = await resp.json();
        nickname = data.nickname;
        let path = location.pathname;
        if (path === "/auth") {
          path = "/";
        }
        SetUrl(path);
        LoadPage();
        SetNickname(nickname);
        return;
      }
      return true;
    }
    if (!resp.ok) {
      let data = await resp.json();
      Toast(`${data.status} ${data.message}`);
      SetUrl("/auth");
      LoadPage();
      return false;
    }
  } catch (error) {
    DispalyError(error.Status, error.Message);
    return false;
  }
}

await isLogged(true);
