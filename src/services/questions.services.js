// Serviço para interação com o Firestore
const questionService = {
    findByLevel: level => {
        return firebase.firestore().collection("questions")
            .doc(level)
            .get()
            .then(doc => {
                return doc.data();
            });
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
