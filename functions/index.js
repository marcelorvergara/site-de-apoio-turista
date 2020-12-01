const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.createUser = functions.https.onCall((data) => {
    return admin.auth().createUser(data)
        .catch((error) => {
            throw new functions.https.HttpsError('internal', error.message)
        });
});
