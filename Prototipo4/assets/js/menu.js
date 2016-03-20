var Menu = {

  preload : function() {
    game.load.image('menu', './assets/images/menu_background.jpg');
  },

  create: function () {
    //game.add.sprite(0, 0, 'menu');
    this.add.button(0, 0, 'menu', this.startGame, this);

    game.add.text(300,180, 'Throw Me!', 
      {font: '40px Arial', fill: '#ffffff' });

    game.add.text(260,300, 'Press Click To Start Game', 
      {font: '25px Arial', fill: '#ffffff' });
    
    //var enterkey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //enterkey.onDown.addOnce(this.startGame, this);
  },

  startGame: function () {

    // Change the state to the actual game.
    this.state.start('Game');
  }

};