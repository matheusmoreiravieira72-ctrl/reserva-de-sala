//=========================================================
// GERENCIAMENTO DE FREQUÊNCIA E REGRAS DE ALERTA
//=========================================================

const frequencia = {
    // 1) AUXILIARES: RECUPERA DADOS DO CONTEXTO ATUAL
    obterContexto() {
        return {
            turmaId: localStorage.getItem("turmaAtual"),
            ucId: localStorage.getItem("ucAtual"),
            alunos: Storage.get("alunos"),
            ucs: Storage.get("ucs"),
            aulas: Storage.get("aulas"), // Estrutura: { id, ucId, data, numero, presencas: {alunoId: true/false} }
        };
    },

    // 2) CRIAR UMA NOVA AULA (LANÇAR FREQUÊNCIA)
    lancar() {
        const { turmaId, ucId, alunos: todosAlunos } = this.obterContexto();
        const dataAula = document.getElementById('data-aula').value;
        const numAula = document.getElementById('num-aula').value;

        // Regras de validação
        const alunosDaTurma = todosAlunos.filter(a => a.turmaId === turmaId);
        if (alunosDaTurma.length === 0) return alert("Não é possível lançar frequência sem alunos cadastrados!");
        if (!ucId) return alert("Erro: UC não selecionada!");
        if (!dataAula || !numAula) return alert("Preencha a data e o número da aula!");

        let todasAulas = Storage.get("aulas");
        
        // Captura as presenças marcadas nos checkboxes
        const presencasMap = {};
        alunosDaTurma.forEach(aluno => {
            const checkbox = document.getElementById(`check-${aluno.id}`);
            presencasMap[aluno.id] = checkbox ? checkbox.checked : false;
        });

        const novaAula = {
            id: Date.now(),
            ucId: ucId,
            data: dataAula,
            numero: parseInt(numAula),
            presencas: presencasMap
        };

        todasAulas.push(novaAula);
        Storage.set("aulas", todasAulas);
        
        alert("Frequência salva com sucesso!");
        this.listarAlunosComAlertas(); // Atualiza a tela com os novos alertas
    },

    // 3) LISTAR ALUNOS E PROCESSAR REGRAS DE ALERTA
    listarAlunosComAlertas() {
        const { turmaId, ucId, alunos: todosAlunos, ucs: todasUcs, aulas: todasAulas } = this.obterContexto();
        const listaElemento = document.getElementById('lista-frequencia-alunos');
        const ucAtual = todasUcs.find(u => u.id == ucId);
        
        const alunosDaTurma = todosAlunos.filter(a => a.turmaId === turmaId);
        const aulasDaUc = todasAulas.filter(aula => aula.ucId == ucId).sort((a, b) => a.numero - b.numero);

        listaElemento.innerHTML = alunosDaTurma.map(aluno => {
            // --- REGRA 2: PRESENÇA INFERIOR A 40% ---
            const totalPresencas = aulasDaUc.filter(aula => aula.presencas[aluno.id] === true).length;
            const percentual = ucAtual.totalAulas > 0 ? (totalPresencas / ucAtual.totalAulas) * 100 : 0;
            const alertaBaixaPresenca = percentual < 40 ? `<br><span class="alerta-texto">⚠️ alerta de faltas (Presença: ${percentual.toFixed(1)}%)</span>` : "";

            // --- REGRA 1: 2 FALTAS SEGUIDAS ---
            let faltasConsecutivas = false;
            for (let i = 0; i < aulasDaUc.length - 1; i++) {
                if (aulasDaUc[i].presencas[aluno.id] === false && aulasDaUc[i+1].presencas[aluno.id] === false) {
                    faltasConsecutivas = true;
                    break;
                }
            }

            const estiloNome = faltasConsecutivas ? 'style="color: #ef4444; font-weight: bold;"' : "";
            const iconeConsecutivo = faltasConsecutivas ? ' <span title="2 faltas seguidas">⚠️ faltas consecutivas</span>' : "";

            return `
                <div class="card-aluno-freq">
                    <label>
                        <input type="checkbox" id="check-${aluno.id}">
                        <span ${estiloNome}>${aluno.nome}</span> ${iconeConsecutivo}
                        ${alertaBaixaPresenca}
                    </label>
                </div>
            `;
        }).join('');
    }
};