// Serviço para interação com o Firestore
const questionService = {  
    getQuestionsByLevel: async (level) => {
        try {
            const querySnapshot = await firebase.firestore().collection("questions")
            .where('level','==',level)
            .get();

            if(querySnapshot.empty){
                throw new Error("Nenhuma pergunta encontrada para o nível "+ level+ " .");
            }
            return querySnapshot.docs.map(doc=>doc.data());
        } catch (error) {
                console.error("Erro ao carregar perguntas:", error);
                alert("Falha ao carregar perguntas. Tente novamente mais tarde.");
                return [];
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
