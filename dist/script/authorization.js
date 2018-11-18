const authLogin = document.querySelector("#enterLogin");
const authPassword = document.querySelector("#enterPassword");

const authLoginBtn = document.querySelector("#enterLoginBtn")
authLoginBtn.onclick = loginRequest;

const authRegistrationBtn = document.querySelector("#enterRegBtn");
authRegistrationBtn.onclick = () => {
    window.location.replace("http://localhost:9000/registration.html")
}