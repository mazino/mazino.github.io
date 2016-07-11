var Game_Over = {

  preload : function() {
    // Load the needed image for this game screen.
    //game.load.image('gameover', './assets/images/menu_background.jpg');
  },

  create : function() {

    //game.add.sprite(0, 0, 'gameover');
    //this.add.button(0, 0, 'gameover', this.startGame, this);
        
    game.add.text(290, 180, 'Game Over', 
      {font: '40px Arial', fill: '#ffffff' }).fixedToCamera = true;


    var mainMenu = game.add.text(260, 300, 'Main Menu', 
      {font: '25px Arial', fill: '#ffffff' });

    mainMenu.inputEnabled = true;
    mainMenu.events.onInputDown.add(this.mainMenu, this);

    var restartGame = game.add.text(260, 350, 'Restart Game', 
      {font: '25px Arial', fill: '#ffffff' });

    restartGame.inputEnabled = true;
    restartGame.events.onInputDown.add(this.startGame, this);

    // Add text with information about the score from last game.
    game.add.text(260, 400, "LAST SCORE", 
      { font: "bold 20px sans-serif", fill: "#46c0f9", align: "center"}).fixedToCamera = true;
    game.add.text(397, 400, GlobalScore.toString(),
      { font: "bold 20px sans-serif", fill: "#fff", align: "center" }).fixedToCamera = true;

    GlobalScore = 0;
    vidas = 3;
    eggsCount = 0;
    //TGS.Analytics.logLevelEvent('fail', score);
    //TGS.Analytics.logCustomEvent('game over', score);
  },

  startGame: function () {
    // Change the state back to Game.
    this.state.start('Game');
  },

  mainMenu : function(){
    this.state.start('Menu')
  }

};