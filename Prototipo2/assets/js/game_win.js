var Game_Win = {

  preload : function() {
    // Load the needed image for this game screen.
    game.load.image('gamewin', './assets/images/menu_background.jpg');
  },

  create : function() {
    //game.add.sprite(0, 0, 'gameover');
    this.add.button(0, 0, 'gamewin', this.startGame, this);
        
    game.add.text(290,180, 'You Won', 
      {font: '40px Arial', fill: '#ffffff' });

    game.add.text(240,300, 'Press Click To Restart Game', 
      {font: '25px Arial', fill: '#ffffff' });

    // Add text with information about the score from last game.
    game.add.text(239, 350, "LAST SCORE", 
      { font: "bold 20px sans-serif", fill: "#46c0f9", align: "center"});
    game.add.text(376, 350, score.toString(),
     { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    
    //var enterkey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //enterkey.onDown.addOnce(this.startGame, this);

  },

  startGame: function () {
    // Change the state back to Game.
    this.state.start('Game');

  }

};