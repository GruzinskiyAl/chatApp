window.onload = () => {
    init();
}
function init(){
    const activeUsersList = document.querySelector("#activeUsers");
    const messages = document.querySelector("#messages");
    const messageField = document.querySelector("#messageTextArea");
    const sendMessageBtn = document.querySelector("#sendMessageBtn");

    startSession();
}

function getAciveUser(){
    return localStorage.getItem("nick");
}

function addActiveUser(userNick) {
    let div = document.createElement("DIV");
    div.innerText = userNick;
    activeUsersList.appendChild(div);
}

function printMessage(user, message) {
    let div = document.createElement("div")
    div.className = "message";
    let spanName = document.createElement("SPAN");
    let spanMessage = document.createElement("SPAN");
    spanName.innerText = user;
    spanMessage.innerText = message;
    div.appendChild(spanName);
    div.appendChild(spanMessage);
    messages.appendChild(div);
}

function startSession() {
    ws = new WebSocket(wsHost);
        ws.onopen = () => {
            addActiveUser(user.nick);
        }
}