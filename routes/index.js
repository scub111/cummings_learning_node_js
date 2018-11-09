var express = require('express');
var router = express.Router();
var games = require('../services/games');

/* GET home page. */
router.get('/', function (req, res, next) {
   let visits = parseInt(req.cookies.visits) || 0;
   visits += 1;
   res.cookie('visits', visits);
   let userId = req.user.id;
   let createdGames = games.createBy(userId);
   let availableGames = games.availableTo(userId)
   res.render('index',
      {
         title: 'Hangman',
         name: 'Biskub 12345',
         visits, 
         userId,
         createdGames,
         availableGames,
         partials: {createdGame: 'createdGame'}
      });
});

module.exports = router;
