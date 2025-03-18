
let username = "";
const loginScreen = document.getElementById("loginScreen");
const chatScreen = document.getElementById("chatScreen");
const userDisplay = document.getElementById("userDisplay");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const toggleModeBtn = document.getElementById("toggleMode");
const clearChatBtn = document.getElementById("clearChat");

document.getElementById("startChat").addEventListener("click", startChat);
document.getElementById("username").addEventListener("keypress", (e) => { if (e.key === "Enter") startChat(); });

function startChat() {
  const input = document.getElementById("username").value.trim();
  if (input) {
    username = input;
    userDisplay.textContent = `Hoş geldin, ${username}`;
    loginScreen.style.display = "none";
    chatScreen.style.display = "block";
    loadMessages();
    messageInput.focus();
  } else {
    alert("Lütfen kullanıcı adınızı girin!");
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

function sendMessage() {
  const text = messageInput.value.trim();
  if (text) {
    const message = { user: username, text, time: new Date().toLocaleTimeString() };
    saveMessage(message);
    displayMessage(message, true);
    broadcastMessage(message);
    messageInput.value = "";
  }
}

function displayMessage(message, isOwn) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", isOwn ? "own" : "other");
  msgDiv.innerHTML = `<strong>${message.user}</strong>: ${message.text}<br><small>${message.time}</small>`;
  if (isOwn) {
    msgDiv.style.cursor = "pointer";
    msgDiv.title = "Silmek için tıkla";
    msgDiv.addEventListener("click", () => {
      if (confirm("Bu mesajı silmek istiyor musun?")) {
        deleteMessage(message);
        msgDiv.remove();
      }
    });
  }
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function saveMessage(message) {
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push(message);
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadMessages() {
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.forEach((msg) => displayMessage(msg, msg.user === username));
}

function deleteMessage(targetMessage) {
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory = chatHistory.filter(
    (msg) => !(msg.user === targetMessage.user && msg.text === targetMessage.text && msg.time === targetMessage.time)
  );
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

clearChatBtn.addEventListener("click", () => {
  if (confirm("Tüm mesajlar silinecek. Emin misin?")) {
    localStorage.removeItem("chatHistory");
    messagesDiv.innerHTML = "";
  }
});

function broadcastMessage(message) {
  localStorage.setItem("chatMessage", JSON.stringify(message));
}

window.addEventListener("storage", (e) => {
  if (e.key === "chatMessage") {
    const message = JSON.parse(e.newValue);
    if (message && message.user !== username) {
      saveMessage(message);
      displayMessage(message, false);
    }
  }
});

toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleModeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
