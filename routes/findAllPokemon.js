const { Pokemon } = require('../db/sequelize')
const pokemon = require('../models/pokemon')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

//  fonction exportée configure une route pour l'API qui gère les requêtes pour obtenir des Pokémon.
module.exports = (app) => {

  app.get('/api/pokemons', auth, (req, res) => {
    // Lorsque l'utilisateur envoie une requête GET à l'URL '/api/pokemons', cette fonction est exécutée.

    if(req.query.name){
      // Si un paramètre de requête 'name' est présent (par exemple, '/api/pokemons?name=Pikachu'),
      const name = req.query.name 
      const limit = parseInt(req.query.limit) || 5 //soit la valeur de l'utilisateur, soit 5 par defaut


      //Vérifier si la longueur de recherchce par name est bien supperieur à 1
      if(name.length < 2 ) {
        const message = 'Le terme de recherche doit contenir au minimum 2 caractères.'
        return res.status(400).json({ message })
      }

      // Recherche dans la base de données tous les Pokémon qui ont exactement ce nom.
      return Pokemon.findAndCountAll({
        where: {
          name: { //'name' est la propriété du modél pokemon
            [Op.like]: `%${name}%` //'name' est le critere de recherche
          }
        },
        order: ['name'],
        limit: limit
      })

      .then(({count, rows}) => {
        // Si la recherche réussit, cette partie du code est exécutée.
        const message = `Il y a ${count} pokémon${count > 1 ? 's' : ''} qui correspond${count > 1 ? 'ent' : ''} au terme ${name}.`;
        res.json({message, data: rows})
      })
    } 


    else {
      // Si aucun paramètre 'name' n'est présent, on récupère tous les Pokémon.
      Pokemon.findAll({order: ['name']})
      .then(pokemons => {
        // Si la récupération réussit, cette partie est exécutée.
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        // Si une erreur survient lors de la récupération, cette partie est exécutée.
        const message = "La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants."
        res.status(500).json({ message, data: error })
      })
    }  
  })
}

