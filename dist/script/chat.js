window.onload = () => {
    init();
}
function init(){
    window.ws = null;
    window.userId = null;
    window.activeUsersList = document.querySelector("#activeUsers");
    window.messages = document.querySelector("#messages");
    window.messageField = document.querySelector("#messageTextArea");
    window.sendMessageBtn = document.querySelector("#sendMessageBtn");

    window.exitBtn = document.querySelector("#exitBtn");

    startSession();
}

exitBtn.onclick = () => {
    ws.send(JSON.stringify({
        "header": {
            "action": "userDisconnection"
        }
    }));

    window.location.replace("./index.html")
}

sendMessageBtn.onclick = () => {
    let text = messageField.value;
    
    if (text){
        let mesObj = {
            header: {
                "action": "chatMessage"
            },
            body: {
                "message": text
            }
        };
        ws.send(JSON.stringify(mesObj));
    }
    messageField.value = "";
}

function pullAciveUserNick(){
    let userNick = localStorage.getItem("nick");
    localStorage.removeItem("nick")
    return userNick
}

function clearActiveUsers() {
    while (activeUsersList.firstChild) {
        activeUsersList.removeChild(activeUsersList.firstChild);
    }
}

function renderActiveUsers(usersList) {
    clearActiveUsers(); // rerender users list block

    usersList.forEach(userNick => {
        let div = document.createElement("DIV");
        div.className = "active-user";
        div.innerText = userNick;
        activeUsersList.appendChild(div)
    });
}

function printMessage(user, message) {
    let div = document.createElement("div")
    div.className = "message";
    let spanName = document.createElement("SPAN");
    spanName.className = "message-author";
    let spanMessage = document.createElement("SPAN");
    spanName.innerText = user + ":";
    spanMessage.innerText = message;
    div.appendChild(spanName);
    div.appendChild(spanMessage);
    messages.appendChild(div);
}

function startSession() {
    ws = new WebSocket(wsHost);

    ws.onopen = () => { // send own protocol data obj with userNick value
        let data = {};
        data.header = {"action": "userConnection"};
        data.body = {"user": pullAciveUserNick()}
        ws.send(JSON.stringify(data))
    };

    ws.onclose = () => { //
        let data = {};
        data.header = {"action": "userDisconnection"};
        ws.send(JSON.stringify(data))
    }
    
    ws.onmessage = (responseData) => {
        let data = JSON.parse(responseData.data);
        console.log(data);

        if (data.header.action === "userConnection") {
            renderActiveUsers(data.body.users)
        }

        if (data.header.action === "userDisconnection") {
            renderActiveUsers(data.body.users)
        }

        if (data.header.action === "chatMessage") {
            printMessage(data.body.user, data.body.message)
        }
    }
}


