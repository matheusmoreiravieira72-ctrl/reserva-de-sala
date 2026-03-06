function listarAlunos() {

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

let lista = document.getElementById("listaAlunos");

lista.innerHTML = "";

alunos.forEach((aluno, index) => {

let li = document.createElement("li");

li.innerHTML = `
${aluno.nome} - ${aluno.matricula}

<button onclick="editarAluno(${index})">Editar</button>

<button onclick="removerAluno(${index})">Remover</button>
`;

lista.appendChild(li);

});

}

function adicionarAluno() {

let nome = document.getElementById("nomeAluno").value;

let matricula = document.getElementById("matriculaAluno").value;

if(nome === "" || matricula === ""){

alert("Preencha todos os campos");

return;

}

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

alunos.push({
nome:nome,
matricula:matricula
});

localStorage.setItem("alunos", JSON.stringify(alunos));

listarAlunos();

document.getElementById("nomeAluno").value = "";
document.getElementById("matriculaAluno").value = "";

}

function removerAluno(index){

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

alunos.splice(index,1);

localStorage.setItem("alunos", JSON.stringify(alunos));

listarAlunos();

}

function editarAluno(index){

let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

let novoNome = prompt("Novo nome:", alunos[index].nome);

let novaMatricula = prompt("Nova matrícula:", alunos[index].matricula);

if(novoNome && novaMatricula){

alunos[index].nome = novoNome;

alunos[index].matricula = novaMatricula;

localStorage.setItem("alunos", JSON.stringify(alunos));

listarAlunos();

}

}

window.onload = listarAlunos;