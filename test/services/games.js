'use strict';

//const assert = require('assert');
const expect = require('chai').expect;
const service = require('../../services/games.js');

describe('Game service', () => {
   const firstUserId = 'user-id-1';
   const secondUserId = 'user-id-2';

   beforeEach((done) => {
      service.availableTo('not-a-user')
         .then(games => games.map(game => game.remove()))
         .then(gamesRemoved => Promise.all(gamesRemoved))
         .then(() => done(), done);
   });

   describe('list of available games', (done) => {
      it('should include games set by other users', () => {
         // Given
         service.create(firstUserId, 'testing');

         // When
         service.availableTo(secondUserId)
            .then(games => {
               // Then
               expect(games.length).to.equal(1);
               const game = games[0];
               expect(game.setBy).to.equal(firstUserId);
               expect(game.word).to.equal('TESTING');
            })
            .then(() => done(), done);
      });

      it('should not include games set by the same user', () => {
         // Given
         service.create(firstUserId, 'first');
         service.create(secondUserId, 'second');

         // When
         service.availableTo(secondUserId)
            .then(games => {
               // Then
               expect(games.length).to.equal(1);
               const game = games[0];
               expect(game.setBy).not.to.equal(secondUserId);
            })
            .then(() => done(), done);
      });
   });
});