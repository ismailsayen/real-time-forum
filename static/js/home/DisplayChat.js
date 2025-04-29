import { socket } from "../utils/socket.js";

export async function FetchUsers() {
  const response = await fetch("/getUsers", {
    method: "GET",
  });

  if (!response.ok) {
    console.error("Failed to fetch users");
    return;
  }

  const users = await response.json();
  const usersSection = document.querySelector(".user-section");
  usersSection.innerHTML = "";
  if (!users) {
    usersSection.innerHTML = `<h1>  no users yet </h1>`;
    return;
  }
  users.sort((a, b) =>
    a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" })
  );
  const userList = document.createElement("div");
  userList.className = "user-list";

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    const status = document.createElement("div");
    status.style.backgroundColor = "red";
    userDiv.className = "user";
    userDiv.textContent = user.nickname;
    userDiv.dataset.userid = user.id;
    userDiv.addEventListener("click", () => {
      startChatWith(user.id, user.nickname);
    });
    userDiv.append(status);
    userList.appendChild(userDiv);
  });

  usersSection.appendChild(userList);
}

export function startChatWith(receiverId, receiverNickname) {
  const usersSection = document.querySelector(".user-section");
  const oldChat = document.querySelector(".chat-area");

  if (oldChat) {
    oldChat.remove();
  }

  const chatArea = document.createElement("div");
  chatArea.className = "chat-area";
  const chatHeader = document.createElement("div");
  chatHeader.className = "chat-header";
  chatHeader.textContent = `Chat with ${receiverNickname}`;

  const chatMessages = document.createElement("div");
  chatMessages.className = "chat-messages";

  const chatInputContainer = document.createElement("div");
  chatInputContainer.className = "chat-input-container";

  const chatInput = document.createElement("input");
  chatInput.type = "text";
  chatInput.className = "chat-input";
  chatInput.placeholder = "Type a message...";

  const sendButton = document.createElement("button");
  sendButton.className = "send-button";
  sendButton.textContent = "Send";

  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(sendButton);
  chatArea.appendChild(chatHeader);
  chatArea.appendChild(chatMessages);
  chatArea.appendChild(chatInputContainer);
  usersSection.appendChild(chatArea);
  sendButton.addEventListener("click", () => {
    console.log(chatInput.value);
  });
  socket.send(
    JSON.stringify({
      type: "getMessages",
      to: receiverId,
    })
  );
}
