// TABLEAU DES TYPES AUTORISES POUR LES POKEMONS
const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée'];

/* L’API Rest et la Base de données : Créer un modèle Sequelize */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : {
          msg: `Le nom est déjà pris.`
        },
        validate: {
          notEmpty: { msg: "Le nom du pokémon ne peut pas être vide." },
          notNull: { msg: "Le nom du pokémon est requis." }
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: {
          isInt: {msg: 'Utilisez uniquement des nombres entiers pour les points de vie.'},
          min: {
            args: [0],
            msg: "Les points de vie doivent être suppérieur ou égal à 0."
          },
          max: {
            args: [999],
            msg: "Les points de vie doivent être inférieur ou égal à 999."
          },
          notNull: {msg: 'Les points de vie sont une propriété requise.'}
        }
      },

      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {msg: 'Utilisez uniquement des nombres entiers pour la puissance de combat.'},
          min: {
            args: [0],
            msg: "La puissance de combat doit être suppérieur ou égal à 0."
          },
          max: {
            args: [99],
            msg: "La puissance de combat doit être inférieur ou égal à 99."
          },
          notNull: {msg: 'La puissance de combat est une propriété requise.'}
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {msg: "Utilisez une URL correct."},
          notNull: {msg: "L'URL d'image est ue propriété requise."}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue('types').split(',')
        },
        set(types) {
          this.setDataValue('types', types.join())
        },
        //validateur perso
        validate: {
          isTypeValid(value){ //definir une fonction 
            // Vérifie si la valeur du champ 'types' est nulle ou vide
            if(!value) { 
              throw new Error('Un Pokémon doit au moins avoir un type.')
            }
            if(value.split(',').length > 3) {
                throw new Error('Un Pokémon ne peut pas avoir plus de trois types.')
            }
            value.split(',').forEach(type => {
              if(!validTypes.includes(type)){
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`)
              }
            })
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }