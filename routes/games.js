'use strict';

const express = require('express');
const router = express.Router();
const service = require('../services/games');

router.post('/', function (req, res, next) {
   const word = req.body.word;
   if (word && /^[A-Za-z]{3,}$/.test(word)) {
      service.create(req.user.id, word)
         .then(game => res.redirect(`/games/${game.id}/created`))
         .catch(next);
   } else {
      res.status(400).send('Word mast be at least three characters long and contain letters');
   }
});

const checkGameExists = function (id, res, onSuccess, onError) {
   service.get(id)
      .then(game => {
         if (game) {
            onSuccess(game);
         } else {
            res.status(404).send('Non-existent game ID');
         }
      })
      .catch(onError);
};

router.get('/:id', function (req, res) {
   checkGameExists(
      req.params.id,
      res,
      game => res.render('game', {
         length: game.word.length,
         id: game.id
      })
   );
});

router.post('/:id/guesses', function (req, res) {
   checkGameExists(
      req.params.id,
      res,
      game => {
         res.send({
            positions: game.positionsOf(req.body.letter)
         });
      }
   );
});

router.get('/:id/created', function (req, res) {
   checkGameExists(
      req.params.id,
      res,
      game => res.render('createdGame', game)
   );
});

router.delete('/:id', function (req, res, next) {
   checkGameExists(
      req.params.id,
      res,
      game => {
         if (game.setBy == req.user.id) {
            game.remove()
               .then(() => res.send())
               .catch(next);
         } else {
            res.status(403).send('You don\'t have permisition to delete this game');
         }
      }
   );
});

module.exports = router;