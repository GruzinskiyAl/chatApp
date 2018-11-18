const xhr = new XMLHttpRequest();

const serverHost = "http://localhost:3000/"

const regNick = document.getElementById("regNick");
const regLogin = document.getElementById("regLogin");
const regPassword = document.getElementById("regPassword");
const regPasswordRepeat = document.getElementById("regPasswordRepeat");

const regBtn = document.getElementById("regBtn");

regBtn.onclick = registrationRequest;

function passwordCompare(password, repeat) {
    if (password === repeat) return true;
    else return false;
}

function encryptPassword(password){
    return password
}

function createUserObject(nick, login, password, repeatPassword) {
    if (passwordCompare(password, repeatPassword)) {
        password = encryptPassword(password);

        const user = {
            nick,
            login,
            password
        };

        return user;
    }
}

function registrationRequest() {
    xhr.open("POST", serverHost + "user/registration/");
    xhr.onreadystatechange = () => {
        if ( xhr.readyState === 4 ) {
            console.log(xhr.status)
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send( JSON.stringify(
        createUserObject(regNick.value, 
                         regLogin.value, 
                         regPassword.value, 
                         regPasswordRepeat.value)));
}