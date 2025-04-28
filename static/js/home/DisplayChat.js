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

  users.sort((a, b) =>
    a.nickname.localeCompare(b.nickname, undefined, { sensitivity: "base" })
  );

  const userList = document.createElement("div");
  userList.className = "user-list";

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    const status = document.createElement("div");
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

  // sendButton.addEventListener("click", () => {
  //   handleSendMessage(receiverId, chatInput, chatMessages);
  // });

  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(sendButton);

  chatArea.appendChild(chatHeader);
  chatArea.appendChild(chatMessages);
  chatArea.appendChild(chatInputContainer);

  usersSection.appendChild(chatArea);
  // fetchMessages(currentUserId, receiverId, chatMessages);
}
async function fetchMessages(currentUserId, receiverId, chatMessages) {
  const response = await fetch(
    `/getMessages?user1_id=${currentUserId}&user2_id=${receiverId}`
  );

  if (response.ok) {
    const messages = await response.json();
    messages.forEach((msg) => {
      displayMessage(chatMessages, msg, currentUserId);
    });
  } else {
    console.error("Failed to load messages");
  }
}

async function handleSendMessage(receiverId, chatInput, chatMessages) {
  const messageContent = chatInput.value.trim();
  console.log(messageContent);

  if (messageContent === "") return;

  try {
    const response = await fetch("/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId: receiverId,
        content: messageContent,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      displayMessage(chatMessages, {
        senderNickname: "You",
        content: messageContent,
        timestamp: data.timestamp || new Date().toISOString(),
      });

      chatInput.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } else {
      console.error("Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

function displayMessage(chatMessages, message, currentUserId) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  if (message.senderId == currentUserId) {
    messageDiv.classList.add("sent"); // right side
  } else {
    messageDiv.classList.add("received"); // left side
  }

  const nicknameDiv = document.createElement("div");
  nicknameDiv.className = "nickname";
  nicknameDiv.textContent = message.senderNickname;

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";
  contentDiv.textContent = message.content;

  const timeDiv = document.createElement("div");
  timeDiv.className = "timestamp";
  const time = new Date(message.timestamp);
  timeDiv.textContent = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageDiv.appendChild(nicknameDiv);
  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);

  chatMessages.appendChild(messageDiv);
}
