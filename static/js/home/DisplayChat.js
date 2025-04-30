import { isLogged, nickname } from "../main.js";
import { Toast } from "../toast/toast.js";
import { convertTime } from "../utils/convertDate.js";
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
  let usersSection = document.querySelector(".user-list");
  if (!usersSection) {
    usersSection = document.querySelector(".user-section");
  }
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

export  function  startChatWith(receiverId, receiverNickname) {
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
    SendMessage(chatInput.value, receiverId);
  });
  socket.send(
    JSON.stringify({
      type: "getMessages",
      to: receiverId,
    })
  );
}

async function SendMessage(message, receiverId) {
  const chatId = document.querySelector(".chat-messages").id;
  console.log(chatId);

  if (message === "" || message.length > 30) {
    Toast("Message cannot be empty or more than 30 characters.⛔");
    return;
  }
 let l= await isLogged(false);
 if(!l){
  return
}
console.log("dd");
 
  socket.send(
    JSON.stringify({
      type: "sendMessages",
      content: message,
      to: receiverId,
      date: new Date() - 0,
      chatId: Number(chatId),
    })
  );
}

export function DisplayMessages(data) {
  const chat_messages = document.querySelector(".chat-messages");
  chat_messages.id = data.chatID;
  let messages = data.conversation;
  if (!messages) {
    Toast("No message yet.");
    return;
  }
  console.log(messages);

  messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));

  messages.forEach((ele) => {
    const msg = document.createElement("div");
    msg.className =
      ele.receiver_nickname === nickname ? "receiver-msg" : "sender-msg";

    const username = document.createElement("h4");
    username.textContent = ele.sender_nickname;

    const p = document.createElement("p");
    p.textContent = ele.content;

    const time = document.createElement("div");
    time.className = "msg-time";
    time.textContent = convertTime(ele.sent_at);

    msg.appendChild(username);
    msg.appendChild(p);
    msg.appendChild(time);
    chat_messages.appendChild(msg);
  });
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

export function AddNewMsgToChat(ele) {
  const chat_messages = document.querySelector(".chat-messages");
  const msg = document.createElement("div");
  msg.className = ele.sender === nickname ? "sender-msg" : "receiver-msg";
  const username = document.createElement("h4");
  username.textContent = ele.sender;
  const p = document.createElement("p");
  p.textContent = ele.message;
  const time = document.createElement("div");
  time.textContent = convertTime(ele.date);
  msg.appendChild(username);
  msg.appendChild(p);
  msg.appendChild(time);
  chat_messages.appendChild(msg);
  chat_messages.scrollTop = chat_messages.scrollHeight;
}
