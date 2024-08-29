/* Authentification : Créer un modèle User avec Sequelize */
const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

  
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { username: req.body.username } }).then(user => {
        
        if (!User){
            const message = `L'utilisateur demandé n'existe pas.`
            return res.status(404).json({ message })
        }

        bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {  //Vérification du mot de passe
            if(!isPasswordValid) {
                const message = `Le mot de passe est incorrect.`;
                return res.stats(401).json({ message })
            }

            //JWT
            const token = jwt.sign(
              { UserId: user.id },
              privateKey,
              {expiresIn: '24h'}
            )

            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token })
      })
    })
    .catch(error => {
        const message = `L'utilisateur n'a pas pu se connecté, réessayez dans quelques instants.`;
        return res.json({ message, data: error, token })
    })
  })
}