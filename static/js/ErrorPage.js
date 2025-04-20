export async function DispalyError(status){
        
    const container=document.querySelector(".container")
    console.log(container);
    container.innerHTML=`error `
    if(status==404){
        container.innerHTML+=status
    }
}