const R = require('ramda')
const sign = require('../signStuff')

var assert = require('assert');
describe('sign tx', function() {

  let chain_id = "testCardchain";
  let mnemonic = "divert twelve zoo inner found display detail bone curve achieve banner thunder obtain wash canal squirrel trim goose receive merit answer brick hybrid thrive";
  let account_number = 0;
  let sequence = 0;

  const signIt = R.curry(sign.signTx)(R.__, mnemonic, chain_id, account_number, sequence);

  describe('#BuyCardScheme', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/BuyCardScheme","value":{"Bid":{"denom":"credits","amount":"800"},"Buyer":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp"}}],"fee":{"amount":[{"denom":"credits","amount":"1"}],"gas":"50544"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "GV7NXFs4+xWGLkt/AJuXh0NeXxvyrZ9zkc3iiUolrQZmPAag6wr1Hz499k1xl9PfTBD1JHuHRw8qWfIkis4t2w==");
    });
  });

  describe('#CreateUser', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/CreateUser","value":{"NewUser":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp","Creator":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp","Alias":"alice"}}],"fee":{"amount":null,"gas":"200000"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "7bu43K4X6C9wCqlV+UXE7AuuUlIdnDS/Lt4zHrEmRBl09AGS3f/2TDfnrFk0IETXsFA6vMils/NCz8H21AssMg==");
    });
  });

  describe('#DonateToCard', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/DonateToCard","value":{"CardId":"1","Donator":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp","Amount":{"denom":"credits","amount":"10"}}}],"fee":{"amount":null,"gas":"200000"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "upSk8FOE6N3zimZujik6q5Z2pintUWYdVEeeQ3u01q8LU+rUH5rqbft4OimvccwJ3C0CynolWQ5ihuPA10RIwA==");
    });
  });

  describe('#SaveCardContent', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/SaveCardContent","value":{"CardId":"1","Content":"dGhpc19pc19zaGl0Y2FyZA==","Owner":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp"}}],"fee":{"amount":null,"gas":"200000"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "B3s83K+WP0LxCfO2baMx+5iICOH5MWS6sq+0n0nRHPcO1bCiZzvSfkgcCjQW2fEDmlkB0BePm4KdVB/295MaGA==");
    });
  });

  describe('#TransferCard', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/TransferCard","value":{"CardId":"1","Sender":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp","Receiver":"cosmos1dgtmv64mvjljush052ekt5evx6uprwym2pynev"}}],"fee":{"amount":null,"gas":"200000"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "6mNiOKJSoojTA6iVomPtTSb2bjDHhiuI0gCGGWgduc0VPp8AXJcjiz1BvQLWqL6taKqBQ/2SOXu+YAndRmKkBA==");
    });
  });

  describe('#VoteCard', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cardservice/VoteCard","value":{"CardId":"3","VoteType":"underpowered","Voter":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp"}}],"fee":{"amount":null,"gas":"200000"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "3mvlPjXcc7sZu6xYfqYbPeWJ4V9l0LC9smOF14Z4fS8mvHtAGmm6tZl5gEvBGLAS2zLotgmT3rx0BgptCeIpWg==");
    });
  });

  describe('#MsgSend', function() {
    it('should yield right signature', function() {
      let unsignedTx = {"type":"auth/StdTx","value":{"msg":[{"type":"cosmos-sdk/MsgSend","value":{"from_address":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp","to_address":"cosmos1r9myatnpkxkr4ylynn98r0y75pd3rjzr20zdtp","amount":[{"denom":"credits","amount":"1"}]}}],"fee":{"amount":[{"denom":"credits","amount":"1"}],"gas":"200000"},"signatures":null,"memo":""}};
      let res = signIt(unsignedTx);

      assert.equal(res.value.signatures[0].signature, "FWX5RxWOz6fkmhDztw8FyubLSuRiU0MnlwTBpYoi0vBSsOC/fdHNRhvAtRXCoG0vTb07Pj2OA80ZmJvbcR37Dw==");
    });
  });
});
