'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const expect = require('chai').expect;
const gamesService = require('../../services/games');

const TEST_PORT = 5000, userId = 'test-user-id';

describe('/games', () => {
   let server, agent, app;

   before(done => {
      app = express();
      app.use(bodyParser.json());
      app.use((req, res, next) => {
         req.user = { id: userId };
         next();
      });

      const games = require('../../routes/games');
      app.use('/games', games);

      server = http.createServer(app).listen(TEST_PORT, done);
   });

   afterEach(() => {
      const gamesCreated = gamesService.availableTo('non-user');
      gamesCreated.forEach(game => game.remove());
   });

   after(done => {
      server.close(done);
   });

   beforeEach(() => {
      agent = request.agent(app);
   });

   describe('/:id DELETE', () => {
      it('should allow users to delete their own games', done => {
         const game = gamesService.create(userId, 'test');
         agent
            .delete(`/games/${game.id}`)
            .expect(200)
            .expect(() => {
               expect(gamesService.createBy(userId)).to.be.empty;
            })
            .end(done);
      });

      it('should not allow to delete games that they did not set', done => {
         const game = gamesService.create('another-user-id', 'test');
         agent
            .delete(`/games/${game.id}`)
            .expect(403)
            .expect(() => expect(gamesService.get(game.id).ok))
            .end(done);
      });

      it('should return a 404 for requests to delete a game that no longer exists', done => {
         const game = gamesService.create(userId, 'test');
         agent
            .delete(`/games/${game.id}`)
            .expect(200)
            .end(err => {
               if (err) {
                  done(err);
               } else {
                  agent
                     .delete(`/games/${game.id}`)
                     .expect(404, done);
               }
            })
      });
   });
});