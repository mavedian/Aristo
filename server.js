// Chargez les variables d'environnement à partir du fichier .env
/*require('dotenv').config();
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



// Définissez le port pour votre serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});*/
