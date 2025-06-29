document.addEventListener('DOMContentLoaded', () => {
   
    const descricaoInput = document.getElementById('descricaoTarefa');
    const adicionarBtn = document.getElementById('adicionarBtn');
    const tabelaBody = document.querySelector('#tabelaTarefas tbody');

    let idCounter = 1;
    let tarefas = []; 

    
    const formatarData = (data) => {
        if (!data) return "";
        const d = new Date(data);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const horas = String(d.getHours()).padStart(2, '0');
        const minutos = String(d.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    };
    
    
    const renderizarTabela = () => {
        tabelaBody.innerHTML = ''; // Limpa a tabela antes de redesenhar

        tarefas.forEach(tarefa => {
            const tr = document.createElement('tr');
            
            // Adiciona uma classe se a tarefa estiver concluída
            if (tarefa.dataConclusao) {
                tr.classList.add('tarefa-concluida');
            }

            tr.innerHTML = `
                <td>${tarefa.id}</td>
                <td>${tarefa.descricao}</td>
                <td>${formatarData(tarefa.dataInicio)}</td>
                <td>${tarefa.dataConclusao ? formatarData(tarefa.dataConclusao) : 'Pendente'}</td>
                <td data-id="${tarefa.id}">
                    ${!tarefa.dataConclusao ? 
                        `<button class="concluirBtn">Concluir</button>` :
                        `<button class="reabrirBtn">Reabrir</button>`
                    }
                    <button class="excluirBtn" ${tarefa.dataConclusao ? 'disabled title="Não é possível excluir tarefas finalizadas."' : ''}>Excluir</button>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });
    };

    
    const adicionarTarefa = () => {
        const descricaoTarefa = descricaoInput.value.trim();

        // Validação: Não permitir incluir tarefas sem descrição
        if (!descricaoTarefa) {
            alert('A descrição da tarefa não pode estar vazia.');
            return;
        }

        // Estrutura da tarefa
        const novaTarefa = {
            id: idCounter++,
            descricao: descricaoTarefa,
            dataInicio: new Date(), // Data de início é a data de inclusão
            dataConclusao: ""
        };

        // Adiciona a nova tarefa ao array de dados
        tarefas.push(novaTarefa);

        // Limpa o input e atualiza a visualização
        descricaoInput.value = '';
        descricaoInput.focus();
        renderizarTabela();
    };

    const manipularAcoesTabela = (e) => {
        const target = e.target;
        const id = parseInt(target.parentElement.getAttribute('data-id'));

        // Encontra a tarefa no array pelo ID
        const tarefa = tarefas.find(t => t.id === id);
        if (!tarefa) return;

        // Ação de Concluir
        if (target.classList.contains('concluirBtn')) {
            tarefa.dataConclusao = new Date();
        }

        // Ação de Excluir
        if (target.classList.contains('excluirBtn')) {
            // Exibir caixa de confirmação
            const confirmou = confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.descricao}"?`);
            if (confirmou) {
                // Atualiza o array de dados, removendo a tarefa
                tarefas = tarefas.filter(t => t.id !== id);
            }
        }

        // Ação de Reabrir
        if (target.classList.contains('reabrirBtn')) {
            tarefa.dataConclusao = "";
        }

        // Re-renderiza a tabela para refletir as mudanças nos dados
        renderizarTabela();
    };

    
    adicionarBtn.addEventListener('click', adicionarTarefa);
    descricaoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });
    tabelaBody.addEventListener('click', manipularAcoesTabela);
});