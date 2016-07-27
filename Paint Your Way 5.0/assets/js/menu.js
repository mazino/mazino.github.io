var Menu = {

  preload : function() {
    //game.load.image('menu', './assets/images/menu_background.jpg');
  },

  create: function () {
    //game.add.sprite(0, 0, 'menu');
    //this.add.button(0, 0, 'menu', this.startGame, this);
    //game.add.tileSprite(0, 0, 800, 600, 'menu');

    var play, control;
    game.add.text(260, 180, 'Paint Your Way!', 
      {font: '40px Arial', fill: '#ffffff' });

    play = game.add.text(260,300, 'Start Game',
            {font: '25px Arial', fill: '#ffffff' });
    
    play.inputEnabled = true;
    play.events.onInputDown.add(this.startGame, this);

    /*control = game.add.text(260,350, 'Controls',
            {font: '25px Arial', fill: '#ffffff' });
    
    control.inputEnabled = true;
    control.events.onInputDown.add(this.menuControl, this);
    */
  },

  startGame: function () {
    this.state.start('PreloadState');
  },

  menuControl: function () {
    this.state.start('Controls');
  }

};