var game;

// Create a new game instance 600px wide and 450px tall:
game = new Phaser.Game(800, 600, Phaser.AUTO, '');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);

//game.state.add('Controls', Controls);

game.state.add('PreloadState', PreloadState);

game.state.add('Game', Game);

game.state.add('WhiteWorld', White_World);

game.state.add('Game_Over', Game_Over);

game.state.start('Menu');