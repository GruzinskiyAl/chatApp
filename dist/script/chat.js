window.onload = () => {
    init();
}
function init(){
    window.ws = null;
    window.activeUsersList = document.querySelector("#activeUsers");
    window.messages = document.querySelector("#messages");
    window.messageField = document.querySelector("#messageTextArea");
    window.sendMessageBtn = document.querySelector("#sendMessageBtn");

    startSession();
}

sendMessageBtn.onclick = (e) => {
    let text = messageField.value;
    let user = getAciveUserNick();
    new Promise((res, rej) => {
        ws.send(user, text)
    }).then ( ()=>{
        messageField.value = "";
    })
}

function getAciveUserNick(){
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
        // ws.send(getAciveUserNick())
        // addActiveUser(user)
    }
    ws.onclose = () => {}
    
    ws.onmessage = (response) => {
        console.log(response);
        let data = JSON.parse(response.data);
        printMessage(data.user, data.message);
    }
}


