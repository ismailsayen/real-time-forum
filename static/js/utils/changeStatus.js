export function ChangeStatus(users = []) {
    const userstatus= document.querySelectorAll(".user div")
   userstatus.forEach((div)=>{
 div.style.backgroundColor="red"
   })
console.log(userstatus);
console.log(users);

  users.forEach((id) => {
    const user = document.querySelector(`[data-userid="${id}"] div`);
    if (user) {
      console.log(id,user);
      user.style.backgroundColor = "green"; 
    }
  });
}


export function SetNickname(nickname){
const nickdiv=document.querySelector(".nickname")
nickdiv.textContent=nickname
nickdiv.value=nickname

}