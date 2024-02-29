// api/submit.js
//const axios = require('axios');
const portalId = "143937373";
const formId = "a7065899-7249-4a94-933f-4aa64a0b0349";

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
// Middleware pour parser le corps des requêtes en JSON
app.use(cors({
    // Définissez les origines que vous souhaitez autoriser
    origin: '*', // Ou une liste spécifique d'origines 'https://mondomaine.com'
}));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://framer.com https://framerusercontent.com https://*.framer.com https://*.framerusercontent.com;");
    next();
  });



module.exports = async (req, res) => {
  // Votre logique ici...
  const { interests, businessInfo, personalInfo } = req.body;
  console.log(req.body);
  console.log(portalId);
  console.log(formId);  
  //res.status(200).json({ message: 'Réponse de la fonction serverless' });
    
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
        await axios.post(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, hubspotData, {
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
};

// Définissez le port pour votre serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
