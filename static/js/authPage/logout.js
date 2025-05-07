import { DispalyError } from "../ErrorPage.js";
import { LoadPage } from "../loadPage.js";
import { SetUrl } from "../navigation/setPath.js";
import { Toast } from "../toast/toast.js";
import { initSocket } from "../utils/socket.js";

export async function Logout() {
  try {
    const resp = await fetch("/logout");

    if (!resp.ok) {
      let data = await resp.json();
      Toast(`${data.status} ${data.message}`);
      return;
    }
    Toast("good Bye");
    SetUrl("/auth");
    LoadPage();
    initSocket().onclose();
  } catch (err) {
    Toast(err);
  }
}
