var Controls = {

  preload : function() {
    game.load.image('menu', './assets/images/menu_background.jpg');
    game.load.image('controls', './assets/images/controls.png');
  },

  create: function () {
    //game.add.sprite(0, 0, 'menu');
    //this.add.button(0, 0, 'menu', this.startGame, this);

    //game.add.tileSprite(0, 0, 800, 600, 'menu');
    game.add.tileSprite(20, 180, 760, 400, 'controls');

    var back;
    game.add.text(260, 50, 'Paint Your Way!', 
      {font: '40px Arial', fill: '#ffffff' });

    back = game.add.text(260,130, 'Back',
            {font: '25px Arial', fill: '#ffffff' });
    
    back.inputEnabled = true;
    back.events.onInputDown.add(this.mainMenu, this);

  },

  mainMenu: function () {
    // Change the state to the actual game.
    this.state.start('Menu');
  },
};