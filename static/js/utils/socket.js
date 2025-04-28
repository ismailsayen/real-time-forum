

import { FetchUsers } from "../home/DisplayChat.js";
import { Toast } from "../toast/toast.js";
import { ChangeStatus, SetNickname } from "./changeStatus.js";

export function initSocket() {
  const socket = new WebSocket("ws://localhost:8080/ws");
  socket.addEventListener("open", () => {
    // socket.send();
  });
  socket.addEventListener("close", async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "userList") {
       
      ChangeStatus(data.users);
      return;
    }
    Toast(event.data);
  });
  socket.addEventListener("message", async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "userList") {
      console.log(data.nickname);
      
      SetNickname(data.nickname)
      await FetchUsers();
      ChangeStatus(data.users);
      return;
    }
    Toast(event.data);
  });
  document.querySelector(".logout-btn").addEventListener("click", () => {
    socket.close();

    return socket;
  });
}
