const turmas = {
    criar() {
        const nome = document.getElementById('nome-turma').value;
        if (!nome) return alert("Digite o nome da turma!");

        const todasTurmas = Storage.get('turmas');
        const novaTurma = {
            id: Date.now(), // ID único para cada turma
            nome: nome,
            instrutor: Storage.getSession().email // Associa ao instrutor logado
        };

        todasTurmas.push(novaTurma);
        Storage.save('turmas', todasTurmas);
        location.reload(); // Recarrega para mostrar a turma na lista
    },

    listar() {
        const lista = document.getElementById('lista-turmas');
        const todasTurmas = Storage.get('turmas');
        const minhasTurmas = todasTurmas.filter(t => t.instrutor === Storage.getSession().email);

        lista.innerHTML = minhasTurmas.map(t => `
            <div class="card-turma">
                <p>${t.nome}</p>
                <button onclick="window.location.href='turma.html?id=${t.id}'">Entrar</button>
            </div>
        `).join('');
    }
};

// Carrega as turmas ao abrir a página
turmas.listar();