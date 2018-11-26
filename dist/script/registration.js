const regNick = document.querySelector("#regNick");
const regLogin = document.querySelector("#regLogin");
const regPassword = document.querySelector("#regPassword");
const regPasswordRepeat = document.querySelector("#regPasswordRepeat");

const regBtn = document.querySelector("#regBtn");
regBtn.onclick = registrationRequest;

const regLoginBtn = document.querySelector("#regLoginBtn");
regLoginBtn.onclick = () => {
    window.location.replace("./index.html");
}