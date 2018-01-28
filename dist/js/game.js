var game;
var WIDTH;
var HEIGHT;
window.onload = () => {
  const {
    scrollWidth,
    scrollHeight,
  } = document.getElementById('game-container');
  WIDTH = scrollWidth;
  HEIGHT = scrollHeight;
  game = new Phaser.Game(WIDTH, HEIGHT, ENV.debug ? Phaser.CANVAS : Phaser.AUTO, 'game-container');
  game.state.add('play', new GameState());
  game.state.add('gameend', new GameEndState());
  game.state.start('play');
}
