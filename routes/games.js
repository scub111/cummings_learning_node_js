'use strict';

const express = require('express');
const router = express.Router();
const service = require('../services/games');

router.post('/', function (req, res, next) {
   const word = req.body.word;
   if (word && /^[A-Za-z]{3,}$/.test(word)) {
      const game = service.create(req.user.id, word);
      //res.redirect('/');
      res.redirect(`/games/${game.id}/created`)
   } else {
      res.status(400).send('Word mast be at least three characters long and contain letters');
   }
});

const checkGameExists = function (id, res, callback) {
   const game = service.get(id);
   if (game) {
      callback(game);
   } else {
      res.status(404).send('Non-existent game ID');
   }
}

router.get('/:id', function (req, res, next) {
   checkGameExists(
      req.params.id,
      res,
      game => res.render('game', {
         length: game.word.length,
         id: game.id
      })
   )
});

router.post('/:id/guesses', function (req, res, next) {
   checkGameExists(
      req.params.id,
      res,
      game => {
         res.send({
            positions: game.positionsOf(req.body.letter)
         });
      }
   )
});

router.get('/:id/created', function (req, res, next) {
   checkGameExists(
      req.params.id,
      res,
      game => res.render('createdGame', game)
   )
});

router.delete('/:id', function(req, res, next) {
   checkGameExists(
      req.params.id,
      res,
      game => {
         if (game.setBy == req.user.id) {
            game.remove();
            res.send();
         } else {
            res.status(403).send("You don't have permisition to delete this game");
         }
      }
   )
});

module.exports = router;