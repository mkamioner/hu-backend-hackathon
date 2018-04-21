
angular.module('guessing-game', ['pubnub.angular.service']).
controller('index-controller', function ($scope, $http, Pubnub) {
  const PUBNUB_CHANNEL = 'scoreboard-update';

  function init() {
    $http.get('/pubnubCreds')
      .success((res) => {
        const subscribeKey = res.subscribeKey;
        Pubnub.init({ subscribeKey });

        Pubnub.subscribe({
          channels  : [PUBNUB_CHANNEL],
          triggerEvents: ['message']
        });

        $scope.$on(Pubnub.getMessageEventNameFor(PUBNUB_CHANNEL), function (ngEvent, envelope) {
          $scope.$apply(function () {
            $scope.scoreboard = envelope.message;
          });
        });
        $scope.refreshScoreboard();
        $scope.resetGame();
      })
      .error((err) => console.error(err));
  }

  $scope.resetGame = function resetGame() {
    $scope.state = 'ready';
    $scope.history = [];
  };

  $scope.refreshScoreboard = function refreshScoreboard() {
    $http.get('/scoreboard')
      .success((res) => {
        $scope.scoreboard = res;
      })
      .error((err) => console.error(err));
  };

  $scope.startGame = function() {
    if (!$scope.playerName || !$scope.playerName.trim()) {
      return alert('Please enter a valid name to continue');
    }
    $http.post('/newGame', { name: $scope.playerName })
      .success((res) => {
        $scope.gameId = res.gameId;
        $scope.guesses = 0;
        $scope.state = 'playing';
      })
      .error((err) => console.error(err));
  };

  $scope.submitGuess = function() {
    const nextGuess = parseInt($scope.nextGuess, 10);
    if (nextGuess === NaN) {
      alert('Please use a valid number');
      return;
    }
    $scope.nextGuess = '';
    $http.post('/guess', {
      value: nextGuess,
      gameId: $scope.gameId
    })
      .success((res) => {
        $scope.history.unshift({
          result: res.result,
          guess: nextGuess
        });
        if (res.result === 0) {
          $scope.state = 'finished';
        }
      })
      .error((err) => console.error(err));

  };

  init();
});
