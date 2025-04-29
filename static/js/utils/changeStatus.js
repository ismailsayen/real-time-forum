export function ChangeStatus(users = []) {
  const userstatus = document.querySelectorAll(".user div");
  userstatus.forEach((div) => {
    div.style.backgroundColor = "red";
  });
  users.forEach((id) => {
    const user = document.querySelector(`[data-userid="${id}"] div`);
    if (user) {
      user.style.backgroundColor = "green";
    }
  });
}

export function SetNickname(nickname) {
  const nickdiv = document.querySelector(".nickname");
  nickdiv.textContent = nickname;
}
