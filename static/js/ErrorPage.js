import { LoadPage } from "./loadPage.js"
import { SetUrl } from "./navigation/setPath.js"

export async function DispalyError(status=500,message="Internal Server Error"){   
    const container=document.querySelector(".container")
    container.innerHTML=``
    let div=document.createElement("div")
    div.className="error-container"
    let h2=document.createElement("h2")
    h2.innerHTML= `${status}|${message}`

    let button = document.createElement("button");
    button.className = "back-home-button";
    button.innerText = "← Back to Home";
    button.onclick = () => {
        // window.location.href = "/"; 
         SetUrl("/");
        LoadPage();
    };

    div.appendChild(h2);
    div.appendChild(button);
    container.appendChild(div)
    document.body.appendChild(container)
}