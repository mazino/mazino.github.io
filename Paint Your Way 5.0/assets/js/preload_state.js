var text;
var PreloadState = {

  preload: function(){
  
  },

  create: function(){
    game.load.onLoadStart.add(this.loadStart, this);
    game.load.onFileComplete.add(this.fileComplete, this);
    game.load.onLoadComplete.add(this.loadComplete, this);

    this.start();
  },

  start: function() {

    //Sprites
    game.load.spritesheet('camaleonWalk', 'assets/images/Camaleon.png', 31, 27);
    game.load.image('floor', 'assets/images/spikess.png');
    game.load.image('miniMapSprite', 'assets/images/MinimapSprite.png');
    game.load.image('chamaleonHead', 'assets/images/ChamaleonHead.png');
    game.load.image('backgroundBlue', 'assets/images/backgroundBlue.png');
    game.load.image('backgroundGreen', 'assets/images/backgroundGreen.png');
    game.load.image('bg', 'assets/images/prueba.png');
    
    game.load.image('changeBlue', 'assets/images/changeBlue.png');
    game.load.image('changeGreen', 'assets/images/changeGreen.png');

    game.load.spritesheet('Obstacle - Mutant Plant', 'assets/images/Obstacle - Mutant Plant.png', 32, 32);
    game.load.image('eggs', 'assets/images/egg.png');
    
    game.load.spritesheet('laserRojo', 'assets/images/laser_vertical.png',32,800);
    game.load.image('lvlEnd', 'assets/images/lvlup.png');

    //Sonidos
    game.load.audio('music_mundo1', 'assets/musica/Music-Mundo1/MundoB&G LOOP.mp3');
    game.load.audio('music_mundo2', 'assets/musica/Music-Mundo2/MundoB&N.mp3');

    game.load.audio('sfx_colision', 'assets/musica/SoundFX-Colision/ColisionFXTest1.mp3');
    game.load.audio('sfx_cambio', 'assets/musica/SoundFX-CambioColor/Cambiocolor.mp3');

    game.load.audio('sfx_laser', 'assets/musica/SoundFX-Laser/Laser.mp3');
    game.load.audio('sfx_laser2', 'assets/musica/SoundFX-Laser/LaserFXTest2.wav');

    game.load.audio('sfx_salto', 'assets/musica/SoundFX-Salto/Jump.mp3');


    //White
    game.load.spritesheet('camaleonWalk', 'assets/images/Camaleon.png', 31, 27);
    game.load.image('backgroundWhite', 'assets/images/backgroundWhite.png');
    game.load.spritesheet('laserRojoHorizontal', 'assets/images/laser_horizontal.png',800,32);
    //End White

    game.load.start();

  },

  loadStart: function() {
    text = game.add.text(32, 32, "Loading...",{ fill: '#ffffff' });    
  },

  //  This callback is sent the following parameters:
  fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {

    text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);

  },

  loadComplete: function() {
    text.setText("Load Complete");
    game.time.events.add(Phaser.Timer.SECOND * 1, this.enterGame, this);
  },

  enterGame: function(){
    this.state.start('Game');
  }
};
