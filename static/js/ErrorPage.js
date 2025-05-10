import { Header } from "./home/DisplayHeader.js"
import { isLogged } from "./main.js"
import { SetUrl } from "./navigation/setPath.js"

export async function DispalyError(status = 404, message = "Error Not Found") {
    const container = document.querySelector(".container")
    container.innerHTML = ``
    let div = document.createElement("div")
    div.className = "error-container"
    let h2 = document.createElement("h2")
    h2.innerHTML = `${status}|${message}`

    let button = document.createElement("button");
    button.className = "back-home-button";
    button.innerText = "← Back to Home";
    button.onclick = async () => {
        SetUrl("/");

        await isLogged(true)
    };
    Header();
    div.appendChild(h2);
    div.appendChild(button);
    container.appendChild(div)
    document.body.appendChild(container)
}