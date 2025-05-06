import { LoadPage } from "../loadPage.js";
import { SetUrl } from "../navigation/setPath.js";
import { Toast } from "../toast/toast.js";
import { initSocket } from "../utils/socket.js";

export async function Logout() {
  try {
    const resp = await fetch("/logout");

    if (!resp.ok) {
      const result = await resp.json();
    
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
