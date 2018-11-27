'use strict';

const games = [];
let nextId = 1;

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/hangman');

const Schema = mongoose.Schema;
const gameSchema = new Schema({
   word: String,
   setBy: String
});

const Game = mongoose.model('Game', gameSchema);

gameSchema.method.positionOf = function(character) {
   let position = [];
   for (let i in this.word) {
      if (this.word[i] === character.toUpperCase()) {
         position.push(i);
      }
   }
   return position;
}

module.exports.create = (userId, word) =>  {
   const newGame = new Game({setBy: userId, word: word.toUpperCase()});
   return newGame.save();
};

module.exports.createBy = (userId) => Game.find({setBy: userId});

//module.exports.availableTo = (userId) => Game.find({set: {$ne: userId}});

module.exports.availableTo = (userId) => Game.where('setBy').ne(userId);

module.exports.get = (id) => Game.findById(id);