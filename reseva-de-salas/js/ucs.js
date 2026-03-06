//=========================================================
// GERENCIAMENTO DE UNIDADES CURRICULARES (UCs)
//=========================================================

const ucs = {
    // 1) AUXILIAR: PEGA A TURMA QUE ESTÁ ABERTA NO MOMENTO
    obterIdTurmaAtual() {
        return localStorage.getItem("turmaAtual");
    },

    // 2) CADASTRAR NOVA UC
    salvar() {
        const nome = document.getElementById('uc-nome').value;
        const totalAulas = document.getElementById('uc-aulas').value;
        const idTurma = this.obterIdTurmaAtual();
        const feedback = document.getElementById('msg-feedback-uc');

        // Validação de campos vazios
        if (!nome || !totalAulas) {
            alert("⚠️ Preencha o nome da UC e o total de aulas!");
            return;
        }

        let todasUcs = Storage.get("ucs");

        // Cria o objeto da UC
        const novaUc = {
            id: Date.now(),
            nome: nome,
            totalAulas: parseInt(totalAulas),
            turmaId: idTurma // Vincula a UC à turma atual
        };

        todasUcs.push(novaUc);
        Storage.set("ucs", todasUcs);

        // Feedback visual e limpeza
        this.limparCampos();
        this.listar();
        
        if(feedback) {
            feedback.innerText = "UC cadastrada com sucesso!";
            setTimeout(() => feedback.innerText = "", 3000);
        }
    },

    // 3) LISTAR UCs DA TURMA SELECIONADA
    listar() {
        const idTurma = this.obterIdTurmaAtual();
        const listaElemento = document.getElementById('lista-ucs');
        const todasUcs = Storage.get("ucs");

        // Filtra para mostrar apenas as UCs desta turma
        const ucsDaTurma = todasUcs.filter(u => u.turmaId === idTurma);

        if (ucsDaTurma.length === 0) {
            listaElemento.innerHTML = "<p>Nenhuma UC cadastrada para esta turma.</p>";
            return;
        }

        listaElemento.innerHTML = ucsDaTurma.map(u => `
            <div class="card-item">
                <div>
                    <strong>${u.nome}</strong><br>
                    <small>${u.totalAulas} aulas planejadas</small>
                </div>
                <div class="acoes">
                    <button class="btn-frequencia" onclick="ucs.abrirFrequencia(${u.id})">Lançar Frequência</button>
                    <button class="btn-remover" onclick="ucs.remover(${u.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    },

    // 4) REMOVER UC
    remover(id) {
        if (confirm("Tem certeza? Isso apagará todos os registros de aula desta UC!")) {
            let todasUcs = Storage.get("ucs");
            todasUcs = todasUcs.filter(u => u.id !== id);
            Storage.set("ucs", todasUcs);
            
            // Também seria ideal limpar as aulas vinculadas a essa UC aqui
            this.listar();
        }
    },

    // 5) ENTRAR NA TELA DE FREQUÊNCIA DA UC
    abrirFrequencia(id) {
        // Salva qual UC o instrutor clicou para carregar na tela uc.html
        localStorage.setItem("ucAtual", id);
        window.location.href = "uc.html";
    },

    limparCampos() {
        document.getElementById('uc-nome').value = "";
        document.getElementById('uc-aulas').value = "";
    }
};

// Inicializa a lista ao carregar a página (se estiver na aba de UCs)
// document.addEventListener('DOMContentLoaded', () => ucs.listar());