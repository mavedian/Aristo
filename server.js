// Chargez les variables d'environnement à partir du fichier .env
require('dotenv').config();
//console.log(process.env)
const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
const app = express();
const axios = require('axios');
const path = require('path');


// Référencer le dossier où se trouvent vos fichiers statiques, comme index.html
app.use(express.static(path.join(__dirname, 'public')));

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
// Référencez votre base de données Airtable
//const base = Airtable.base('ID_DE_VOTRE_BASE');


// Middleware pour parser le corps des requêtes en JSON
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://framer.com https://framerusercontent.com https://*.framer.com https://*.framerusercontent.com;");
    next();
  });
  
/*app.post('/submit', async (req, res) => {
    console.log(req.body); // Affiche tout le corps de la requête
    console.log(req.body.personalInfo);
    console.log(req.headers);
    // Récupérez les données du corps de la requête
    const { interests, businessInfo, personalInfo } = req.body;

    // Créez un nouvel enregistrement dans votre table Airtable
    base('tblrDanQwFT6xrE0I').create([
        {
            "fields": {
                // Adaptez les noms des champs et les valeurs selon la structure de votre table Airtable
                "firstName": req.body.personalInfo.firstName,
                "lastName": req.body.personalInfo.lastName,
                "mail": req.body.personalInfo.mail,
                "phone": req.body.personalInfo.phone,
                "description": req.body.personalInfo.description,
                "employees": req.body.businessInfo.employees,
                "sector": req.body.businessInfo.sector,
                "interests": req.body.interests.join(", ") 
            }
        }
    ], function(err, records) {
        if (err) {
            console.error(err);
            // Envoie d'une réponse JSON avec un statut 500 et un message d'erreur
            return res.status(500).json({ error: "Erreur lors de l'enregistrement des données dans Airtable." });
        }
        // Envoie d'une réponse JSON avec un statut 200 et un message de succès
        res.status(200).json({ message: "Données enregistrées avec succès dans Airtable." });
    });


});*/

app.post('/submit', async (req, res) => {
    const { interests, businessInfo, personalInfo } = req.body;
    console.log(req.body);
    
    // Préparez les données pour l'envoi à HubSpot
    const hubspotData = {
        fields: [
            { name: "firstname", value: personalInfo.firstName },
            { name: "lastname", value: personalInfo.lastName },
            { name: "email", value: personalInfo.email },
            { name: "phone", value: personalInfo.phone },
            { name: "message", value: personalInfo.message },
            { name: "numemployees", value: businessInfo.employees },
            { name: "industry", value: businessInfo.sector },
            { name: "field_of_study", value: interests.join(", ") },
            // Ajoutez d'autres champs personnalisés ici
        ],
        context: {
            // "hutk": req.cookies.hubspotutk, // Utilisez ce champ si vous souhaitez relier la soumission à un cookie HubSpot
            "pageUri": "https://share-eu1.hsforms.com/1pwZYmXJJSpSTP0qmSgsDSQ2dp2sd",
            "pageName": "Form BDD Aristo"
        }
    };

    try {
        const response = await axios.post(`https://api.hsforms.com/submissions/v3/integration/submit/${process.env.HUBSPOT_PORTAL_ID}/${process.env.HUBSPOT_FORM_ID}`, hubspotData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // En cas de succès, envoyez une réponse positive
        res.status(200).json({ message: "Données envoyées avec succès à HubSpot." });
    } catch (error) {
        console.error(error);
        // En cas d'erreur, envoyez une réponse avec le statut d'erreur
        res.status(500).json({ error: "Erreur lors de l'envoi des données à HubSpot." });
    }
});

// Définissez le port pour votre serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
