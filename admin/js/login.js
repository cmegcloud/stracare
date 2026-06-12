import {
collection,
getDocs
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function login(){

alert("Login Clicked");

try{

const username =
document.getElementById("username").value.trim();

const password =
document.getElementById("password").value.trim();

const users =
await getDocs(
collection(window.db,"users")
);

alert("Users Found : " + users.size);

let validUser = null;

users.forEach(doc=>{

const user = doc.data();

if(

user.username === username &&
user.password === password &&
user.active === true

){

alert("User Match Found");

validUser = user;

}

});

if(!validUser){

alert("Invalid Username or Password");

return;

}

localStorage.setItem(
"currentUser",
JSON.stringify(validUser)
);

alert("Login Success");

window.location.href="index.html";

}catch(err){

alert(err.message);
console.log(err);

}

}

window.login = login;