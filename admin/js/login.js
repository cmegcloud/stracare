import {
collection,
getDocs
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function login(){

alert("Login Clicked");

const username =
document.getElementById(
"username"
).value.trim();

const password =
document.getElementById(
"password"
).value.trim();

const users =
alert("Before Firestore");

const users =
await getDocs(
collection(
window.db,
"users"
)
);

alert("After Firestore");

let validUser = null;

users.forEach(doc=>{

const user = doc.data();

if(

user.username === username &&
user.password === password &&
user.active === true

){

validUser = user;

}

});

if(!validUser){

alert(
"Invalid Username or Password"
);

return;

}

localStorage.setItem(
"currentUser",
JSON.stringify(validUser)
);

window.location.href =
"index.html";

}

window.login = login;
