// import { DisplayPost } from "../home/DisplayPost.js";

import { FetchUsers } from "../home/DisplayChat.js";
import { Toast } from "../toast/toast.js";
import { ChangeStatus } from "./changeStatus.js";

// let socket;

// export function initWebSocket() {
//   socket = new WebSocket("ws://localhost:8080/ws");

//   socket.onopen = () => {
//     console.log("🔌 Connected to WebSocket Server");
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);

//     // Example handlers
//     if (data.type === "new_comment") {
//       // Show a toast or update the UI
//       console.log("💬 New Comment:", data.comment);
//     }
//     if (data.type === "new_post") {
//         DisplayPost()
//         console.log("📝 New Post Added with ID:", data.postId, "at", data.time,data);
//     }

//     if (data.type === "notification") {
//       // Display notification
//       console.log("🔔 Notification:", data.message);
//     }
//   };

//   socket.onerror = (err) => {
//     console.error("WebSocket Error:", err);
//   };

//   socket.onclose = () => {
//     console.warn("WebSocket closed, retrying in 3s...");
//     setTimeout(initWebSocket, 3000); // Retry connection
//   };
// }

// export function sendMessage(messageObj) {
//   if (socket && socket.readyState === WebSocket.OPEN) {
//     socket.send(JSON.stringify(messageObj));
//   } else {
//     console.warn("WebSocket not connected.");
//   }
// }

export function initSocket() {
  const socket = new WebSocket("ws://localhost:8080/ws");
  socket.addEventListener("open", () => {
    socket.send();
  });
  socket.addEventListener("message", async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "userList") {
      await FetchUsers();
      ChangeStatus(data.users);
      return;
    }
    // Toast(event.data);
  });
  document.querySelector(".logout-btn").addEventListener("click", () => {
    socket.close();
  });

  return socket;
}
