

// Chargez les variables d'environnement à partir du fichier .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(cors());
app.use(express.json());

app.post('/submit', (req, res) => {
    // Préparez les données à envoyer à Airtable
    const data = {
        "fields": {
            "firstName": req.body.personalInfo.firstName,
            "lastName": req.body.personalInfo.lastName,
            "mail": req.body.personalInfo.mail,
            "phone": req.body.personalInfo.phone,
            "description": req.body.personalInfo.description,
            "employees": req.body.businessInfo.employees,
            "sector": req.body.businessInfo.sector,
            "interests": req.body.interests.join(", ")
        }
    };

    // Utilisez axios pour envoyer les données à Airtable
    axios({
        method: 'post',
        url: `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/tblrDanQwFT6xrE0I`, // Remplacez NomDeVotreTable par le nom réel de votre table dans Airtable
        headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: data
    })
    .then(response => {
        // La requête a réussi
        res.status(200).send("Données enregistrées avec succès dans Airtable.");
    })
    .catch(error => {
        // Il y a eu une erreur lors de l'envoi de la requête à Airtable
        console.error(error);
        res.status(500).send("Erreur lors de l'enregistrement des données dans Airtable.");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});