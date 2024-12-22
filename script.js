// Configuração do Firebase
const configuracaoFirebase = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO_ID.firebaseapp.com",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_PROJETO_ID.appspot.com",
    messagingSenderId: "SEU_ID_MENSAGENS",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(configuracaoFirebase);
const db = firebase.firestore(app);

// Elementos
const entradaPergunta = document.getElementById('question');
const entradaTipoPergunta = document.getElementById('question-type');
const entradaRespostas = document.getElementById('answers');
const entradaFeedbackAcerto = document.getElementById('feedback-correct');
const entradaFeedbackErro = document.getElementById('feedback-wrong');
const botaoAdicionarPergunta = document.getElementById('add-question');
const listaPerguntas = document.getElementById('question-list');

// Função: Adicionar Pergunta ao Firestore
botaoAdicionarPergunta.addEventListener('click', async () => {
    const pergunta = entradaPergunta.value.trim();
    const tipo = entradaTipoPergunta.value;
    const respostas = entradaRespostas.value.split(',').map(resposta => resposta.trim());
    const feedbackAcerto = entradaFeedbackAcerto.value.trim();
    const feedbackErro = entradaFeedbackErro.value.trim();

    if (pergunta && tipo && respostas.length > 0 && feedbackAcerto && feedbackErro) {
        try {
            await db.collection('perguntas').add({
                pergunta,
                tipo,
                respostas,
                feedbackAcerto,
                feedbackErro
            });
            alert('Pergunta cadastrada com sucesso!');
            entradaPergunta.value = '';
            entradaRespostas.value = '';
            entradaFeedbackAcerto.value = '';
            entradaFeedbackErro.value = '';
            carregarPerguntas();
        } catch (erro) {
            console.error('Erro ao cadastrar pergunta:', erro);
        }
    } else {
        alert('Por favor, preencha todos os campos!');
    }
});

// Função: Carregar Perguntas do Firestore
async function carregarPerguntas() {
    try {
        const consulta = await db.collection('perguntas').get();
        listaPerguntas.innerHTML = '';

        consulta.forEach(doc => {
            const dados = doc.data();
            const item = document.createElement('li');
            item.textContent = `${dados.pergunta} (${dados.tipo})`;

            const botaoEditar = document.createElement('button');
            botaoEditar.textContent = 'Editar';
            botaoEditar.addEventListener('click', () => editarPergunta(doc.id, dados));

            const botaoExcluir = document.createElement('button');
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.addEventListener('click', () => excluirPergunta(doc.id));

            item.appendChild(botaoEditar);
            item.appendChild(botaoExcluir);
            listaPerguntas.appendChild(item);
        });
    } catch (erro) {
        console.error('Erro ao carregar perguntas:', erro);
    }
}

// Função: Editar Pergunta
async function editarPergunta(id, dados) {
    const novaPergunta = prompt('Edite a pergunta:', dados.pergunta);
    const novoFeedbackAcerto = prompt('Edite o feedback de acerto:', dados.feedbackAcerto);
    const novoFeedbackErro = prompt('Edite o feedback de erro:', dados.feedbackErro);

    if (novaPergunta && novoFeedbackAcerto && novoFeedbackErro) {
        try {
            await db.collection('perguntas').doc(id).update({
                pergunta: novaPergunta,
                feedbackAcerto: novoFeedbackAcerto,
                feedbackErro: novoFeedbackErro
            });
            alert('Pergunta atualizada com sucesso!');
            carregarPerguntas();
        } catch (erro) {
            console.error('Erro ao atualizar pergunta:', erro);
        }
    }
}

// Função: Excluir Pergunta
async function excluirPergunta(id) {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
        try {
            await db.collection('perguntas').doc(id).delete();
            alert('Pergunta excluída com sucesso!');
            carregarPerguntas();
        } catch (erro) {
            console.error('Erro ao excluir pergunta:', erro);
        }
    }
}

// Carregar perguntas ao iniciar
carregarPerguntas();