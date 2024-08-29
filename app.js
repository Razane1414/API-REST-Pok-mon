const express = require('express')
const morgan = require('morgan')
const serveFavicon = require('serve-favicon')
const bodyParser = require('body-parser')
const sequelize = require('./SRC/db/sequelize')

const app = express()
const port = 3000


// MIDDLEWARE pour favicon et logger les requetes
app
    .use(serveFavicon(__dirname + '/favicon/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

sequelize.initDb() // Appelle la fonction initDb pour initialiser la base de données




// ICI NOS FUTURE POINT DE TERMINAISON
require('./SRC/routes/findAllPokemon')(app)
require('./SRC/routes/findPokemonByPk')(app)
require('./SRC/routes/createPokemon')(app)
require('./SRC/routes/updatePokemon')(app)
require('./SRC/routes/deletePokemon')(app)
require('./SRC/routes/login')(app)



// Gestion des erreurs 404 (route non trouvé)
app.use(({res}) => {
    const message ='Impossible de trouver la ressource demandé : Vous pouvez essayez un autre URL.'
    res.status(404).json({message})
})

// Démarrer le serveur
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))