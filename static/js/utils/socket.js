import { Logout } from "../authPage/logout.js";
import {
  AddNewMsgToChat,
  DisplayMessages,
  FetchUsers,
} from "../home/DisplayChat.js";
import { isLogged } from "../main.js";
import { Toast } from "../toast/toast.js";
import { ChangeStatus } from "./changeStatus.js";
export let socket;
export function initSocket() {
  socket = new WebSocket("ws://localhost:8080/ws");

  socket.addEventListener("close", async (event) => {
   
    const data = JSON.parse(event.data);
    if (data.type === "userList") {
      ChangeStatus(data.users);
      return;
    }
    Toast(event.data);
  });
  socket.addEventListener("message", async (event) => {
    let islogged = await isLogged(false);
    if (!islogged) {
      socket.send(
        JSON.stringify({
          type: "user-close",
        })
      );
      socket.close();
      Logout();
      return;
    }
    const data = JSON.parse(event.data);
    console.log(data);

    if (!data || !data.type) return;
    if (data.type === "userList") {
      await FetchUsers();
      ChangeStatus(data.users);
      return;
    }
    if (data.type === "conversation") {
      DisplayMessages(data);
      return;
    }
    if (data.type === "messageSent") {
      console.log("ssss");
      
      AddNewMsgToChat(data);
      return;
    }
    Toast(event.data);
  });
  document.querySelector(".logout-btn").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "user-close",
      })
    );
    socket.close();
  });
}
