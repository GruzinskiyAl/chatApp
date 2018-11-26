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

        let user = {nick,
                    login,
                    password}
        return user
    }
}

function createUserObject(login, password) {
    password = encryptPassword(password);

    if (login && password) {
        return {login, 
                password}
    }
}

function loginRequest() {
    const xhr = new XMLHttpRequest();

    let user = createUserObject(authLogin.value, authPassword.value);
    if (user) {
        xhr.open("POST", serverHost + "user/login/");
        xhr.setRequestHeader("Content-Type", "application/json");
    
    
        xhr.send( JSON.stringify(user))
    
        xhr.onreadystatechange = () => {
            if ( xhr.readyState === 4 ){
                console.log(xhr);
                if (xhr.status === 200) {
                    setActiveUser(xhr.response)
                    redirectToChat();
                } else {
                    alert("Check your creditians!")
                }
            }
        };
    } else {
        alert("Empty fields exist!");
    }
 
}

function registrationRequest() {
    const xhr = new XMLHttpRequest();
    
    let user = createNewUserObject(regNick.value, 
                                   regLogin.value, 
                                   regPassword.value, 
                                   regPasswordRepeat.value)
    if (user) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send( JSON.stringify(
            createNewUserObject(regNick.value, 
                                regLogin.value, 
                                regPassword.value, 
                                regPasswordRepeat.value)));
    
        xhr.open("POST", serverHost + "user/registration/");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 201) {
                    window.location.replace("./index.html");
                }
            }
        };
    } else {
        
    }
}

function redirectToChat(){
    window.location.replace("./chat.html");
}
