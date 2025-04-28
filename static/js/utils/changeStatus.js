export function ChangeStatus(users = []) {
  

  users.forEach((id) => {
    const user = document.querySelector(`[data-userid="${id}"] div`);
    if (user) {
      console.log(id,user);
      user.style.backgroundColor = "green"; 
    }
  });
}
