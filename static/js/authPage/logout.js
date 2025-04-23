import { LoadPage } from "../loadPage.js";
import { SetUrl } from "../navigation/setPath.js";
import { Toast } from "../toast/toast.js";

export async function Logout(){

try {
    const resp = await fetch("/logout");

    if (!resp.ok) {
        const result = await resp.json();
        console.log(result);
        return;
    }
    Toast("good Bye")
    console.log("logout");
    
   SetUrl("/auth")
    LoadPage()
} catch (err) {
    Toast(err)
}

}