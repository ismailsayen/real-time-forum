import { FetchUsers } from "../home/DisplayChat.js";
import { Toast } from "../toast/toast.js";
import { ChangeStatus } from "./changeStatus.js";
export let socket;
export function initSocket() {
  socket = new WebSocket("ws://localhost:8080/ws");
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
    console.log(data);

    if (!data || !data.type) return;
    if (data.type === "userList") {
      await FetchUsers();
      ChangeStatus(data.users);
      return;
    }
    if (data.type === "conversation") {
      console.log(data.conversation);
      return;
    }
    Toast(event.data);
  });
  document.querySelector(".logout-btn").addEventListener("click", () => {
    socket.close();
  });
}
