import { LoadPage } from "./loadPage.js";
import { SetUrl } from "./navigation/setPath.js";

export async function isLogged() {
  try {
    const resp = await fetch("/isLog");
    const data = await resp.json();

    if (resp.status === 403) {
      SetUrl("/auth");
      LoadPage();
    
    }

    if (resp.ok) {
      SetUrl("/");
      
      
      LoadPage(data.userId);
      
    } else {
      console.error("Unhandled response error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}


 await isLogged();

