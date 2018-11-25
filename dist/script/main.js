const xhr = new XMLHttpRequest();
const serverHost = "http://localhost:3000/"

let ws = null; 
const wsHost = "ws://localhost:8080"

function setActiveUser(responseData) {
    let user = JSON.parse(responseData);
    localStorage.setItem("nick", user.nick);
}

function passwordCompare(password, repeat) {
    if (password === repeat) return true;
    else return false;
}

function encryptPassword(password){
    return password
}

function createNewUserObject(nick, login, password, repeatPassword) {
    if (passwordCompare(password, repeatPassword)) {
        password = encryptPassword(password);

        return {nick,
                login,
                password}
    }
}

function createUserObject(login, password) {
    password = encryptPassword(password);

    return {login,
            password}
}

function loginRequest() {
    xhr.open("POST", serverHost + "user/login/");
    xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ){
            console.log(xhr.response);

            setActiveUser(xhr.response)
            redirectToChat();
        }
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send( JSON.stringify(
        createUserObject(authLogin.value, 
                          authPassword.value)));
}

function registrationRequest() {
    xhr.open("POST", serverHost + "user/registration/");
    xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ) {
            console.log(xhr.status)
        }
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send( JSON.stringify(
        createNewUserObject(regNick.value, 
                            regLogin.value, 
                            regPassword.value, 
                            regPasswordRepeat.value)));
}

function redirectToChat(){
    window.location.replace("./chat.html");
}
