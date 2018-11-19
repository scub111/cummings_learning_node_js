var express = require('express');
var router = express.Router();
var games = require('../services/games');

/* GET home page. */
router.get('/', function (req, res, next) {
   let visits = parseInt(req.cookies.visits) || 0;
   visits += 1;
   res.cookie('visits', visits);
   let userId = req.user.id;
   /*
   res.cookie('visits', visits);
   games.createBy(userId)
      .then(gamesCreatedByUser =>
         games.availableTo(req.user.id)
            .then(gamesAvailableToUser => {
               res.render('index', {
                  title: 'Hangman',
                  name: 'Biskub 12345',
                  visits,
                  userId,
                  createdGames: gamesCreatedByUser,
                  availableGames: gamesAvailableToUser,
                  partials: { createdGame: 'createdGame' }
               });
            }))
            .catch(next);
   */
   Promise.all([
      games.createBy(userId),
      games.availableTo(userId)
   ])
   .then(results => {
      res.render('index', {
                  title: 'Hangman',
                  name: 'Biskub 12345',
                  visits,
                  userId,
                  createdGames: results[0],
                  availableGames: results[1],
                  partials: { createdGame: 'createdGame' }
               });
   });
});

module.exports = router;
