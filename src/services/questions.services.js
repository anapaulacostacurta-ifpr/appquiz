// Serviço para interação com o Firestore
const questionService = {
    getAll: async () => {
        // Verifica se as perguntas já estão armazenadas no localStorage
        const storedQuestions = localStorage.getItem("questions");

        if (storedQuestions) {
            // Carrega perguntas do localStorage se existirem
            return JSON.parse(storedQuestions);
        } else {
            try {
                // Caso não existam, busca as perguntas do Firestore
                const questionsRef = firebase.firestore().collection("questions");
                const snapshot = await questionsRef.get();
                const questions = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                }));

                // Armazena as perguntas no localStorage para acessos futuros
                localStorage.setItem("questions", JSON.stringify(questions));
                return questions;
            } catch (error) {
                console.error("Erro ao carregar perguntas:", error);
                alert("Falha ao carregar perguntas. Tente novamente mais tarde.");
                return [];
            }
        }
    },
    findByUid: uid => {
        return firebase.firestore()
            .collection("questions")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    remove: question => {
        return firebase.firestore()
            .collection("questions")
            .doc(question.uid)
            .delete();
    },
    save: question => {
        return firebase.firestore()
            .collection("questions")
            .add(question);
    },
    update: question => {
        return firebase.firestore()
            .collection("questions")
            .doc(question.uid)
            .update(question);
    }
};
