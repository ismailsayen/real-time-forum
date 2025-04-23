import { Header } from "./DisplayHeader.js";
import { DisplayPost } from "./DisplayPost.js";
import { Toast } from "./toast/toast.js";


export function HomePage() {

    Header()
     DisplayPost();
     const welcome = localStorage.getItem("welcome");
if (welcome) {
    Toast("Welcome back!");
    localStorage.removeItem("welcome"); 
}
    
     console.log("home");
     
    
}


