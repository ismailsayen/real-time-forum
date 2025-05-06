import { Logout } from "../authPage/logout.js";
import {
  AddNewMsgToChat,
  AppendNewUser,
  DisplayMessages,
  DisplayNotif,
  FetchUsers,
} from "../home/DisplayChat.js";
import { isLogged } from "../main.js";
import { Toast } from "../toast/toast.js";
import { ChangeStatus } from "./changeStatus.js";
export let socket;
export function initSocket() {
  socket = new WebSocket("ws://localhost:8080/ws");
  socket.addEventListener("open", async () => {
    socket.send(
      JSON.stringify({
        type: "getAllUsers",
      })
    );
  });

  socket.addEventListener("close", async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "userList") {
      ChangeStatus(data.users);
      return;
    }
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

    if (!data || !data.type) return;
    if (data.type == "AllUsers") {
      FetchUsers(data.users);
      ChangeStatus(data.users);
      return;
    }

    if (data.type === "userList") {
      ChangeStatus(data.users);
      return;
    }

    if (data.type === "conversation") {
      DisplayMessages(data);
      return;
    }

    if (data.type === "messageSent") {
      AddNewMsgToChat(data);
      return;
    }

    if (data.type === "notification") {
      DisplayNotif(data.usersid, data.chatID);
      Toast(`${data.message} 🔔`);
      return;
    }

    if (data.type == "NewUserJoinned") {
      AppendNewUser(data.user);
      return;
    }
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
