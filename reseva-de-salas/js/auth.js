document.getElementById("loginForm").addEventListener("submit",login);

document.getElementById("registerForm").addEventListener("submit",register);

function register(e){

e.preventDefault();

let nome=document.getElementById("regNome").value;
let email=document.getElementById("regEmail").value;
let senha=document.getElementById("regSenha").value;

let usuarios=storage.get("usuarios");

usuarios.push({
id:storage.generateId(),
nome:nome,
email:email,
senha:senha
});

storage.set("usuarios",usuarios);

alert("Usuário registrado!");

}

function login(e){

e.preventDefault();

let email=document.getElementById("loginEmail").value;
let senha=document.getElementById("loginSenha").value;

let usuarios=storage.get("usuarios");

let usuario=usuarios.find(u=>u.email===email && u.senha===senha);

if(usuario){

alert("Login feito com sucesso!");

}else{

alert("Usuário não encontrado");

}

}