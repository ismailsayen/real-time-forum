import { isLogged, nickname } from "../main.js";
import { Toast } from "../toast/toast.js";
import { convertTime } from "../utils/convertDate.js";
import { socket } from "../utils/socket.js";
let offset = 0;
const limit = 10;
let loading = false;
let allLoaded = false;
let chatwith = "";
export function FetchUsers(users) {
  let usersSection = document.querySelector(".user-list");
  if (!usersSection) {
    usersSection = document.querySelector(".user-section");
  } else {
    usersSection.innerHTML = "";
  }

  if (!users) {
    usersSection.innerHTML = `<h1>no users yet <i class="fa-solid fa-user-xmark"></i></h1>`;
    return;
  }

  const userList = document.createElement("div");
  if (usersSection.classList.contains("user-list")) {
    usersSection = document.querySelector(".user-section");
    usersSection.innerHTML = ""
  }
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

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "user-typing-indicator";
    typingIndicator.innerHTML = 'typing <div class="typing-dots"></div>';
    typingIndicator.style.cssText = `
      display: none;
    `;

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
export function ShowUserListTypingIndicator(userId) {
  const userDiv = document.querySelector(`.user[data-userid="${userId}"]`);
  if (!userDiv) return;

  let typingIndicator = userDiv.querySelector(".user-typing-indicator");

  if (!typingIndicator) {
    typingIndicator = document.createElement("div");
    typingIndicator.className = "user-typing-indicator";
    typingIndicator.innerHTML = 'typing <div class="typing-dots"></div>';
    typingIndicator.style.cssText = `
      color: #777;
      font-size: 12px;
      font-style: italic;
      margin-top: 2px;
      display: flex;
      gap:10px;
      align-items:center;
    `;

    const username = userDiv.querySelector("p");
    username.appendChild(typingIndicator);
  } else {
    typingIndicator.style.display = "flex";
  }
}

export function HideUserListTypingIndicator(userId) {
  const userDiv = document.querySelector(`.user[data-userid="${userId}"]`);
  if (!userDiv) return;

  const typingIndicator = userDiv.querySelector(".user-typing-indicator");
  if (typingIndicator) {
    typingIndicator.style.display = "none";
  }
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
    let storedNotifs = JSON.parse(
      localStorage.getItem("notifications") || "{}"
    );
    delete storedNotifs[receiverId];
    localStorage.setItem("notifications", JSON.stringify(storedNotifs));
  }
  const chatArea = document.createElement("div");
  chatArea.className = "chat-area";
  const chatHeader = document.createElement("div");
  chatHeader.className = "chat-header";

  const userName = document.createElement("p");
  userName.textContent = `Chat with ${receiverNickname}`;
  chatwith = receiverNickname;
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
  let typingTimeout;
  chatInput.addEventListener("input", () => {
    socket.send(
      JSON.stringify({
        type: "typing",
        to: receiverId,
        from: nickname,
      })
    );

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.send(
        JSON.stringify({
          type: "stopTyping",
          to: receiverId,
          from: nickname,
        })
      );
    }, 1000);
  });

  const typingIndicator = document.createElement("div");
  typingIndicator.className = "typing-indicator";
  typingIndicator.id = `typing-${receiverId}`;
  typingIndicator.style.cssText =
    "color: gray; padding: 5px; font-style: italic;";
  typingIndicator.style.display = "none";
  typingIndicator.innerHTML = `${receiverNickname} is typing<div class="typing-dots"></div>`;

  chatArea.appendChild(typingIndicator);

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

    const spinner = document.querySelector(".chat-loading-indicator");
    if (chatMessages.scrollTop <= 10 && !loading) {
      if (spinner) {


        spinner.style.display = "block";
      }

      loading = true;
      socket.send(
        JSON.stringify({
          type: "getMessages",
          to: receiverId,
          offset,
          limit,
        })
      );
    }
    throttleTimeout = setTimeout(() => {
      spinner.style.display = "none";

      throttleTimeout = null;
    }, 200);
  });
}
export function ShowTypingIndicator(userId) {
  const el = document.querySelector(`#typing-${userId}`);
  if (el) {
    el.style.display = "flex"
    el.style.gap = "10px"
  };
}

export function HideTypingIndicator(userId) {
  const el = document.querySelector(`#typing-${userId}`);
  if (el) el.style.display = "none";
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
    let usernickname =
      ele.receiver_nickname === nickname ? "receiver-msg" : "sender-msg";
    msg.className = usernickname;
    const username = document.createElement("h4");

    if (usernickname == "sender-msg") {
      username.textContent = nickname;
    } else if (usernickname == "receiver-msg") {
      username.textContent = chatwith;
    }

    const p = document.createElement("p");
    p.textContent = ele.content;

    const time = document.createElement("div");
    time.className = "msg-time";
    time.textContent = convertTime(ele.sent_at);

    msg.appendChild(username);
    msg.appendChild(p);
    msg.appendChild(time);
    if (offset > 0) {
      chat_messages.insertBefore(msg, chat_messages.firstChild);
    } else {
      chat_messages.appendChild(msg);
    }
  });

  if (offset === 0) {
    chat_messages.scrollTop = chat_messages.scrollHeight;
  } else {
    const newScrollHeight = chat_messages.scrollHeight;
    chat_messages.scrollTop =
      newScrollHeight - prevScrollHeight + prevScrollTop;
  }

  offset += messages.length;
  loading = false;
}

export function AddNewMsgToChat(ele) {
  const chat_messages = document.querySelector(".chat-messages");
  if (!chat_messages || chat_messages.id != ele.ChatID) return;
  const msg = document.createElement("div");
  msg.className = ele.sender === nickname ? "sender-msg" : "receiver-msg";
  const username = document.createElement("h4");
  username.textContent = ele.sender;
  const p = document.createElement("p");
  p.textContent = ele.message;
  const time = document.createElement("div");
  time.className = "msg-time";
  time.textContent = convertTime(ele.date);
  msg.appendChild(username);
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
  const section = document.querySelector(".user-section");
  if (!section) return;

  let usersSection = document.querySelector(".user-list");
  if (!usersSection) {
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
}
