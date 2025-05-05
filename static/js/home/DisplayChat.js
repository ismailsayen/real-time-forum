import { isLogged, nickname } from "../main.js";
import { Toast } from "../toast/toast.js";
import { convertTime } from "../utils/convertDate.js";
import { socket } from "../utils/socket.js";
let offset = 0;
const limit = 10;
let loading = false;
let allLoaded = false;

export function FetchUsers(users) {
  let usersSection = document.querySelector(".user-list");
  if (!usersSection) {
    usersSection = document.querySelector(".user-section");
  }
  if (!users) {
    usersSection.innerHTML = `<h1>no users yet <i class="fa-solid fa-user-xmark"></i></h1>`;
    return;
  }

  const userList = document.createElement("div");
  userList.className = "user-list";
  let storedNotifs = JSON.parse(localStorage.getItem("notifications") || "{}");
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    const status = document.createElement("div");
    const username = document.createElement("p");
    const notif = document.createElement("span");
    notif.style.display = "none";
    status.style.backgroundColor = "red";
    userDiv.classList.add("user");
    username.textContent = user.nickname;
    username.appendChild(notif);
    userDiv.dataset.userid = user.id;
    userDiv.addEventListener("click", () => {
      startChatWith(user.id, user.nickname);
    });
    userDiv.append(username);
    userDiv.append(status);
    userList.appendChild(userDiv);
    if (storedNotifs[user.id]) {
      notif.style.display = "inline-block";
      notif.innerHTML = `<i class="fa-solid fa-envelope"></i>`;
    }
  });

  usersSection.appendChild(userList);
}

export function startChatWith(receiverId, receiverNickname) {
  offset = 0;
  allLoaded = false;
  const post_section = document.querySelector(".post-section");
  const oldChat = document.querySelector(".chat-area");
  if (oldChat) {
    oldChat.remove();
  }
  let notif = document.querySelector(`[data-userid="${receiverId}"] span`);
  if (notif.style.display === "inline-block") {
    notif.style.display = "none";
    // Remove notification from localStorage
    let storedNotifs = JSON.parse(localStorage.getItem("notifications") || "{}");
    delete storedNotifs[receiverId];
    localStorage.setItem("notifications", JSON.stringify(storedNotifs));
  }
  const chatArea = document.createElement("div");
  chatArea.className = "chat-area";
  const chatHeader = document.createElement("div");
  chatHeader.className = "chat-header";
 
  const userName = document.createElement("p");
  userName.textContent = `Chat with ${receiverNickname}`;
  const closeChat = document.createElement("i");
  closeChat.className = "fa-solid fa-xmark";
 
chatHeader.appendChild(userName);
  chatHeader.appendChild(closeChat);
  closeChat.addEventListener("click", () => {
    const chat = document.querySelector(".chat-area");
    if (chat) {
      chat.remove();
    }
  });
  let notifDiv = document.querySelector(`[data-userid="${receiverId}"] span`);
  if (notifDiv.style.display === "inline-block") {
    notifDiv.style.display = "none";
  }

  const chatMessages = document.createElement("div");

  chatMessages.className = "chat-messages";
  chatMessages.innerHTML = `
  <div class="chat-loading-indicator" style="
    display: none;
    text-align: center;
    padding: 10px;
    color: red;
    font-size: 14px;
    position:absolute;
    z-index:999;
  ">
    <i class="fa fa-spinner fa-spin"></i> Loading messages...
  </div>
`;
 
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
  post_section.appendChild(chatArea);
  sendButton.addEventListener("click", () => {
    SendMessage(chatInput.value, receiverId);
    chatInput.value = "";
  });
  socket.send(
    JSON.stringify({
      type: "getMessages",
      to: receiverId,
      offset: offset,
      limit: limit,
    })
  );
  let throttleTimeout = null;
  chatMessages.addEventListener("scroll", () => {
    if (throttleTimeout) return;

  
    console.log(chatMessages.scrollHeight,chatMessages.scrollTop,chatMessages.clientHeight);

    const spinner = document.querySelector(".chat-loading-indicator");
    if (chatMessages.scrollTop <=4 && !loading) {
      if (spinner){
     console.log(spinner);
     
        spinner.style.display = "block";
      }

      loading = true;
      socket.send(JSON.stringify({
        type: "getMessages",
        to: receiverId,
        offset,
        limit,
      }));
    }
    throttleTimeout = setTimeout(() => {
      // spinner.style.display = "none";

      throttleTimeout = null;
    }, 500);
  });
}

async function SendMessage(message, receiverId) {
  const chatId = document.querySelector(".chat-messages").id;

  if (message === "" || message.length > 30) {
    Toast("Message cannot be empty or more than 30 characters.⛔");
    return;
  }
  let l = await isLogged(false);
  if (!l) {
    return;
  }
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
  console.log("d",data);
  
  const chat_messages = document.querySelector(".chat-messages");
  if (!chat_messages) {
    return;
  }
  chat_messages.id = data.chatID;
  const spinner = chat_messages.querySelector(".chat-loading-indicator");
if (spinner) spinner.style.display = "none";

  let messages = data.conversation;
  if (!messages || messages.length === 0) {
    if (offset === 0) {
      Toast("No message yet.");
    } else {
      
      allLoaded = true;
    }
    loading = false;
    return;
  }
    
    
  const prevScrollHeight = chat_messages.scrollHeight;
  const prevScrollTop = chat_messages.scrollTop;
  messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
  if (offset > 0) {
    messages.reverse();
  }
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
    if (offset >0) {
      chat_messages.insertBefore(msg, chat_messages.firstChild);
    } else {
      chat_messages.appendChild(msg);
        }
  });

  if (offset === 0) {
    chat_messages.scrollTop = chat_messages.scrollHeight;
  } else {
    const newScrollHeight = chat_messages.scrollHeight;
    chat_messages.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
  }
  
  offset += messages.length;
  loading = false;
}

export function AddNewMsgToChat(ele) {
  const chat_messages = document.querySelector(".chat-messages");
  if (!chat_messages || chat_messages.id != ele.ChatID) return;
  const msg = document.createElement("div");
  msg.className = ele.sender === nickname ? "sender-msg" : "receiver-msg";
  const p = document.createElement("p");
  p.textContent = ele.message;
  const time = document.createElement("div");
  time.textContent = convertTime(ele.date);
  msg.appendChild(p);
  msg.appendChild(time);
  chat_messages.appendChild(msg);
  chat_messages.scrollTop = chat_messages.scrollHeight;
}

export function DisplayNotif(idUser, chatID) {
  const chat_messages = document.querySelector(".chat-messages");
  let notifDiv = document.querySelector(`[data-userid="${idUser}"] span`);
  let userchat = null;
  let storedNotifs = JSON.parse(localStorage.getItem("notifications") || "{}");
  if (chat_messages && chat_messages.id) {
    userchat = Number(chat_messages.id);
  }
  if (chatID === userchat) {
    notifDiv.style.display = "none";
    delete storedNotifs[idUser];
    localStorage.setItem("notifications", JSON.stringify(storedNotifs));
    return;
  }

  if (notifDiv.style.display === "none") {
    notifDiv.style.display = "inline-block";
    notifDiv.innerHTML = `<i class="fa-solid fa-envelope"></i>`;
    storedNotifs[idUser] = chatID;
    localStorage.setItem("notifications", JSON.stringify(storedNotifs));
  }
}

export function AppendNewUser(user) {
  let usersSection = document.querySelector(".user-list");
  if (!usersSection) {
    const section = document.querySelector(".user-section");
    section.innerHTML = "";
    usersSection = document.createElement("div");
    usersSection.className = "user-list";
    section.appendChild(usersSection);
  }
  const existingUser = document.querySelector(
    `.user[data-userid="${user.id}"]`
  );
  if (existingUser) {
    return;
  }

  const userDiv = document.createElement("div");
  const status = document.createElement("div");
  const username = document.createElement("p");
  const notif = document.createElement("span");

  notif.style.display = "none";
  status.style.backgroundColor = "red";
  userDiv.classList.add("user");
  username.textContent = user.nickname;
  username.appendChild(notif);
  userDiv.dataset.userid = user.id;

  userDiv.addEventListener("click", () => {
    startChatWith(user.id, user.nickname);
  });

  userDiv.appendChild(username);
  userDiv.appendChild(status);

  usersSection.appendChild(userDiv);

  SortUsers();
}

function SortUsers() {
  // Fixed: function name to match call
  // Select all user elements, not the container
  let users = document.querySelectorAll(".user");
  let usersArray = Array.from(users);

  // Sort users by name
  usersArray.sort((a, b) => {
    let nameA = a.querySelector("p").textContent.trim().toLowerCase();
    let nameB = b.querySelector("p").textContent.trim().toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Get the parent container
  const parent = document.querySelector(".user-list");

  // Clear the container and add sorted users
  parent.innerHTML = "";
  usersArray.forEach((user) => parent.appendChild(user));
}
