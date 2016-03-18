var Game_Over = {

  preload : function() {
    // Load the needed image for this game screen.
    game.load.image('gameover', './assets/images/menu_background.jpg');
  },

  create : function() {
    game.add.sprite(0, 0, 'gameover');
    this.add.button(0, 0, 'gameover', this.startGame, this);
        
    game.add.text(290,180, 'Game Over', 
      {font: '40px Arial', fill: '#ffffff' }).fixedToCamera = true;

    game.add.text(240,300, 'Press Click To Restart Game', 
      {font: '25px Arial', fill: '#ffffff' }).fixedToCamera = true;

    // Add text with information about the score from last game.
    game.add.text(239, 350, "LAST SCORE", 
      { font: "bold 20px sans-serif", fill: "#46c0f9", align: "center"}).fixedToCamera = true;
    game.add.text(376, 350, score.toString(),
      { font: "bold 20px sans-serif", fill: "#fff", align: "center" }).fixedToCamera = true;
  },

  startGame: function () {
    // Change the state back to Game.
    this.state.start('Game');
  }

};