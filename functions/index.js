/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const app = express();
const db = admin.firestore();

const cors = require("cors");
// const QuerySnapshot = require("firebase-admin/firestore");
app.use(cors({origin: true}));

// Routes
app.get("/hello-word", (req, res) => {
  return res.status(200).send("Hello-Word!");
});

// Create
// Post
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("product").doc("/" + req.body.id + "/")
          .create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
          });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read
// Get
app.get("/api/read/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("product").doc(req.params.id);
      const product = await document.get();
      const response = product.data();

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read all product
// Get
app.get("/api/read", (req, res) => {
  (async () => {
    try {
      const query = db.collection("product");
      const response = [];

      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;// the result of the query

        for (const doc of docs) {
          const selectedItem = {
            id: doc.id,
            nam: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
          };
          response.push(selectedItem);
        }
        return response;// each then should return value
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Update
// Put
app.put("/api/update/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("product").doc(req.params.id);

      await document.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Delete
// Delete
app.delete("/api/delete/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("product").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Export the api to Firebase Cloud Function
exports.app = functions.https.onRequest(app);
