export async function DispalyError(){
        let resp = await fetch("/")
        let data = await resp.json()
        console.log(data);
        
    const container=document.querySelector(".container")
    container.innerHTML=`alert("error not found")`
}