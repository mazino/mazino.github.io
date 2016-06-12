var GlobalScore = 0; //Variable que contiene el Score general de juego
var bmd, map, layer, marker, currentTile;
var score;
var scoreTextValue, nBlackTextValue, textStyle_Key, textStyle_Value;

var cursors;
var player;
var jumpButton, jumpTimer;

var background, colorBackground, backgroundDelay, changeBackground, screenDelay;
var index;
var floors;
var timer;
var A,S,D,F;
var obstacles;
var velocityUp;
var whiteWorld;
var laserRojo;
var laserRojoGroup;
var iterador; //Tiempo en que se active el rayo laser.

var music_mundo1,music_mundo2;
var sfx_salto;
var sfx_laser, sfx_laser2;
var sfx_cambio;
var sfx_colision;

var caidaLibre;

var Game = {
  preload : function() {
    game.load.spritesheet('camaleonWalk', 'assets/images/Camaleon.png', 31, 27);
    game.load.image('floor', 'assets/images/spikess.png');
    game.load.image('backgroundBlue', 'assets/images/backgroundBlue.png');
    game.load.image('backgroundGreen', 'assets/images/backgroundGreen.png');
    
    game.load.image('changeBlue', 'assets/images/changeBlue.png');
    game.load.image('changeGreen', 'assets/images/changeGreen.png');    

    game.load.image('obstacle', 'assets/images/obstacle.png');
    game.load.spritesheet('laserRojo', 'assets/images/laser_vertical.png',32,800);
    game.load.image('whiteWorld', 'assets/images/whiteWorld.png');

    game.load.audio('music_mundo1', 'assets/musica/Music-Mundo1/MusicTest1Mundo1Fran0.wav');
    game.load.audio('music_mundo2', 'assets/musica/Music-Mundo2/LaserMusicTest1Zota.wav');

    game.load.audio('sfx_colision', 'assets/musica/SoundFX-Colision/ColisionFXTest1.mp3');
    game.load.audio('sfx_cambio', 'assets/musica/SoundFX-CambioColor/CambioColorFXTest1.mp3');

    game.load.audio('sfx_laser', 'assets/musica/SoundFX-Laser/LaserFXTest1.wav');
    game.load.audio('sfx_laser2', 'assets/musica/SoundFX-Laser/LaserFXTest2.wav');

    game.load.audio('sfx_salto', 'assets/musica/SoundFX-Salto/GiroAireFXTest1.mp3');

  },

  create : function() {
    //TGS.Analytics.logGameEvent('begin');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 450;

    music_mundo1 = game.add.audio('music_mundo1', 0.6, true);
    music_mundo1.play();
    
    sfx_salto = game.add.audio('sfx_salto');
    sfx_salto.addMarker('salto', 3.5, 2, 2,true);

    sfx_colision = game.add.audio('sfx_colision');
    sfx_colision.addMarker('colision', 0.2, 1);

    sfx_cambio = game.add.audio('sfx_cambio');
    sfx_cambio.addMarker('cambio_color', 0.2, 1, 0.3);

    sfx_laser = game.add.audio('sfx_laser');
    sfx_laser.addMarker('laser', 2.5, 1.5);

   

    // Create our Timer
    timer = game.time.create(false);
    //timer.loop(3000, this.changeWarning2, this);
    //timer.loop(5000, this.addScore, this);

    //Por defecto background inicial Rojo
    background = game.add.tileSprite(0, 0, 800, 600, "backgroundGreen");
    background.fixedToCamera = true;

    //init variables
    colorBackground = ["backgroundRed","backgroundBlue","backgroundGreen","backgroundBlack"];
    changeBackground = ["changeRed","changeBlue","changeGreen","changeBlack"];
    backgroundDelay = 10;
    screenDelay = 9;
    jumpTimer = 0;
    currentTile = 0;
    velocityUp = 0;
    aux = 0;
    score = 0;
    caidaLibre = 0;

    //Paleta de colores
    map = game.add.tilemap();
    bmd = game.add.bitmapData(32 * 2, 32 * 1);
    var color = Phaser.Color.createColor(0,112,166);//Blue
    bmd.rect(0*32, 0, 32, 32, color.rgba);
    color = Phaser.Color.createColor(12,153,81); //Green
    bmd.rect(1*32, 0, 64, 32, color.rgba);

    //Eliminar los 2 de abajo sobrantes
    color = Phaser.Color.createColor(0,180,0);
    bmd.rect(2*32, 0, 64, 32, color.rgba);
    color = Phaser.Color.createColor(51,0,51);
    bmd.rect(3*32, 0, 64, 32, color.rgba); 

    //  Add a Tileset image to the map
    map.addTilesetImage('tiles', bmd);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', 2000, 30, 32, 32); //Intentar Corregir el 2000

    //  Populate some tiles for our player to start on with color Blue
    for (var i = 0; i < 20; i++){
      i < 10 ? map.putTile(0, i, 10, layer) : map.putTile(0, i, 10, layer);
    }
    
    //Se setea Blanco con collider debido al background inicial Azul, y color Negro siempre tiene Collider;
    map.setCollision([0], true);
    //map.setCollision(3, true);

    //  Create our tile selector at the top of the screen
    this.createTileSelector();

    // Add Text to top of game.
    textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#46c0f9", align: "center" };

    // Score.
    game.add.text(30, 40, "Distance", textStyle_Key).fixedToCamera = true;
    scoreTextValue = game.add.text(100, 38, score.toString(), textStyle_Value);    
    scoreTextValue.fixedToCamera = true;

    // Letras con que se activa cada Tile
    game.add.text(12, 10, "A", textStyle_Key).fixedToCamera = true;
    game.add.text(44, 10, "S", textStyle_Key).fixedToCamera = true;    
    
    this.createFloor();
    this.obstaclesCreate();
    this.itemWhiteWorldCreate();
    this.laserRojoVerticalCreate();

    // Crea Player
    this.createPlayer();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    A = game.input.keyboard.addKey(Phaser.Keyboard.A);
    S = game.input.keyboard.addKey(Phaser.Keyboard.S);
    //D = game.input.keyboard.addKey(Phaser.Keyboard.D);
    //F = game.input.keyboard.addKey(Phaser.Keyboard.F);

    game.input.addMoveCallback(this.updateMarker, this);

    timer.start();
  },

  update : function() {
    game.world.setBounds(player.xChange, 0, game.width + player.xChange, game.world.height);

    game.physics.arcade.collide(player, layer);

    this.addScore();

    this.playerMove();

    //Si el cambio es bloqueado por la derecha, activar laser vertical
    if(player.body.blocked.right){
      iterador += 1;
    }
    else if(!player.body.blocked.right){
      iterador = 0;
    }

    if(iterador == 40){
      this.laserRojoVertical();
    }

    if(timer.seconds > screenDelay){
      this.changeWarning();
    }

    if(timer.seconds > backgroundDelay){
      this.changeBackground();
    }

    obstacles.forEach(function(obstacle) {
      if(game.physics.arcade.distanceBetween(obstacle, player) > 1000)
      {
        obstacle.kill();
        var x =  Math.floor((game.camera.x + game.rnd.integerInRange(800 , 1000))/32);
        x = x * 32;
        //var y = game.rnd.integerInRange(50 , game.world.height - 50);
        //var x = game.camera.x + game.rnd.integerInRange(25 , 31);
        var y = game.rnd.integerInRange(4 , 15);
        var obstacle = obstacles.getFirstDead();
        //obstacle.reset(x,y);
        obstacle.reset(x, y * 32);
        obstacle.scale.setTo(1, 0.75);
        obstacle.body.setSize(obstacle.width + 2, obstacle.height + 32, -1);
        obstacle.body.immovable = true;
        obstacle.body.allowGravity = false;
        return obstacle;
      }
    });    

    laserRojoGroup.forEach(function(laserRojo) {
      if(laserRojo.frame == 14){
        laserRojo.kill();
      }
    });

    game.physics.arcade.overlap(laserRojoGroup, player, this.playerLaserCollision, null, this);
    game.physics.arcade.overlap(obstacles, player, this.playerCollision, null, this);
    game.physics.arcade.overlap(player, floors, this.gameOver, null, this);
    game.physics.arcade.overlap(player, whiteWorld, this.changeWhiteWorld, null, this);
  },

  playerCollision : function(){
    if((player.animations.name == "camaleonWalkBlue" || player.animations.name == "camaleonJumpBlue") && background.key == "backgroundBlue"){
      //Hacer nada
    }
    else if((player.animations.name == "camaleonWalkGreen" || player.animations.name == "camaleonJumpGreen") && background.key == "backgroundGreen"){
      //Hacer nada
    }
    else{
      this.gameOver();
    }
  },

  playerLaserCollision : function(pj, laser){
    if(laser.frame == 10){
      this.gameOver();
    }
  },

  addScore : function(){
    score = Math.floor(player.x / 50) + GlobalScore;
    scoreTextValue.text = score.toString();
  },

  itemWhiteWorldCreate : function(){
    var posX = game.rnd.integerInRange(400, 500);
    var posY = game.rnd.integerInRange(8 , 9);
    whiteWorld = game.add.sprite(posX, posY * 32, "whiteWorld");
    game.physics.arcade.enable(whiteWorld);
    whiteWorld.body.collideWorldBounds = false;
    whiteWorld.scale.setTo(0.25, 0.25);
    whiteWorld.body.immovable = true;
    whiteWorld.body.allowGravity = false;
  },

  changeWhiteWorld :function(){
    GlobalScore = score;
    sfx_salto.stop();
    music_mundo1.stop();
    game.state.start('WhiteWorld');
  },

  obstaclesCreate : function() {
    obstacles = game.add.group();
    obstacles.enableBody = true;
    obstacles.createMultiple(6, 'obstacle');

    var x = game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
    for (var i = 0; i < 4; i++) {
      //this.obstaclesCreateOne(game.rnd.integerInRange(game.world.width - 200, game.world.width - 50), game.rnd.integerInRange(50 , game.world.height - 100));
      this.obstaclesCreateOne(game.rnd.integerInRange(32, 40), game.rnd.integerInRange(4 , 15));
    }
  },

  obstaclesCreateOne: function(x, y) {
    var obstacle = obstacles.getFirstDead();
    //obstacle.reset(x,y);
    obstacle.reset(x * 32, y * 32);
    obstacle.body.setSize(obstacle.width + 2, obstacle.height, -1);
    obstacle.scale.setTo(1, 0.75);
    obstacle.body.immovable = true;
    obstacle.body.allowGravity = false;
    return obstacle;
  },

  laserRojoVerticalCreate : function(){
    laserRojoGroup = game.add.group();
    laserRojoGroup.enableBody = true;
    laserRojoGroup.createMultiple(10, 'laserRojo', 0, false);
  },

  laserRojoVertical : function(){
    var posX = player.body.x;
    var posY = 0;
    var laserRojo = laserRojoGroup.getFirstDead(true, posX, posY);

    laserRojo.body.immovable = true;
    laserRojo.body.allowGravity = false;
    //laserRojo.alpha = 0.1;
    laserRojo.animations.add('laserRojo', [0,1,2,3,4,5,6,7,9,10,11,12,13,14], 10, false);
    laserRojo.play('laserRojo');
    sfx_laser.play('laser');
  },

  changeWarning : function()
  { 
    //var indice = game.rnd.integerInRange(0, 2);
    if (background.key == colorBackground[2]){ // Si background es verde entonces,
      background.loadTexture(changeBackground[1]); //Avisar el cambio a Blue      
    }    
    else if (background.key == colorBackground[1]){ // Si background es Azul entonces,
      background.loadTexture(changeBackground[2]); //Avisar el cambio a Verde
    }
    screenDelay = timer.seconds + 10;
  },

  changeBackground : function(indice){
    if (background.key == changeBackground[2]){ // Si changeBackground es Verde
      background.loadTexture(colorBackground[2]); //Cambiar el background a Verde
      map.setCollision(0, true); //Activar colision con color Azul
      map.setCollision(1,false); //Desactivar color Verde
    }

    else if(background.key == changeBackground[1]){ //Si el aviso de cambio de BG es Azul
      background.loadTexture(colorBackground[1]); //Entonces, cambiar el background a Azul
      map.setCollision(1, true); //Activar colision con color Verde
      map.setCollision(0,false); //Desactivar color Azul
    }
    backgroundDelay = timer.seconds + 10;
    velocityUp += 20;
  },

  createFloor : function(){
    floors = game.add.group();
    floors.enableBody = true;
    var floor = floors.create(0, game.world.height - 32, 'floor');
    //floor.scale.x = game.world.width;
    //floor.scale.setTo(0.25, 0.25);
    floor.fixedToCamera = true;
    floor.body.immovable = true;
    floor.body.allowGravity = false;
  },

  createPlayer : function() {
    player = game.add.sprite(96, game.world.centerY - 5, 'camaleonWalk');

    player.xOrig = player.x;
    player.xChange = 0;

    //No aseguramos que el jugador comienza al inicio del mapa
    game.world.setBounds(player.xChange, 0, game.width, game.world.height);

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    
    player.body.setSize(32,16,0,11);

    player.animations.add('camaleonWalkGreen', [0,1,2,3], 20, true);
    player.animations.add('camaleonJumpGreen', [4,5,6,7,8,9,10,11], 12, true);
    player.animations.add('camaleonWalkBlue', [12,13,14,15], 20, true);
    player.animations.add('camaleonJumpBlue', [16,17,18,19,20,21,22,23], 12, true);
  },

  playerMove : function(){
    player.body.velocity.x = 150 + velocityUp;

    if(currentTile == 0){ //si estamos en color Azul
      if(player.body.onFloor()){
        player.play('camaleonWalkBlue');
      }
      else{
        player.play('camaleonJumpBlue'); 
      }
    }

    else if(currentTile == 1){ //Si estamos en color verde
      if(player.body.onFloor()){
        player.play('camaleonWalkGreen');
      }
      else{
        player.play('camaleonJumpGreen');
      }
    }

    //Si player está en el suelo su caja de colision es player.body.setSize(32,16,0,11);
    if(player.body.onFloor()){
      player.body.setSize(32,16,0,11);
      sfx_salto.stop();
      caidaLibre = 0;
    }
    //Si player está en el aire su colsion es player.body.setSize(32,32,0,0)
    else{
      player.body.setSize(21,16,6,9);
      caidaLibre++;
      if(caidaLibre == 1){
        sfx_salto.play('salto');
      }
    }    

    player.xChange = Math.max(Math.abs(player.x - player.xOrig), player.xChange);
    if(A.isDown){
      currentTileMarker.x = 0;
      currentTileMarker.y = 0;
      currentTile == 1 ? sfx_cambio.play('cambio_color') : false
      currentTile = 0;

    }
    else if(S.isDown){
      currentTileMarker.x = 32;
      currentTileMarker.y = 0;
      currentTile == 0 ? sfx_cambio.play('cambio_color') : false
      currentTile = 1;
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
      player.body.velocity.y = -250;
      jumpTimer = game.time.now + 750;
    }    
  },

  pickTile: function(sprite, pointer) {
    var x = game.math.snapToFloor(pointer.x, 32, 0);
    var y = game.math.snapToFloor(pointer.y, 32, 0);

    currentTileMarker.x = x;
    currentTileMarker.y = y;

    x /= 32;
    y /= 32;

    currentTile = x + (y * 25);

  },

  updateMarker : function() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown && marker.y > 32 && marker.y < (game.world.height - 32))
    {
      //Acá utilizar sprite en vez de currenTile
      map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer);
    }
  },

  createTileSelector : function() {
    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.8);
    tileSelectorBackground.drawRect(0, 0, 64, 33);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, bmd);
    tileStrip.inputEnabled = true;
    //tileStrip.events.onInputDown.add(this.pickTile, this); //Permite cambiar color haciando click en la paleta de colores

    //  Our painting marker (El marcador negro)
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

    //  Our current tile marker
    currentTileMarker = game.add.graphics();
    currentTileMarker.lineStyle(1, 0xffffff, 1);
    currentTileMarker.drawRect(0, 0, 32, 32);

    tileSelector.add(currentTileMarker);
    tileSelector.fixedToCamera = true;
  },

  gameOver : function(){
    //TGS.Analytics.logGameEvent('end');
    sfx_colision.play('colision');
    music_mundo1.stop();
    sfx_laser.stop();
    sfx_salto.stop();
    game.world.setBounds(0, 0, game.width, game.height);
    GlobalScore = score;
    game.state.start('Game_Over');
  },

  render : function(){
    //game.debug.cameraInfo(game.camera, 500, 100);
    //game.debug.spriteInfo(player, 32, 400);
    //game.debug.text('Time: ' + timer.seconds , 32, 200);
    //game.debug.body(player);
    //game.debug.body(floors.getFirstAlive());
    //game.debug.body(obstacles.getFirstAlive());
    //game.debug.text('MouseX: ' + game.input.activePointer.x , 32, 80);
    //game.debug.text('MouseY: ' + game.input.activePointer.y , 180, 80);
    //game.debug.text('x: ' + layer.getTileX(marker.x) , 32, 100);
    //game.debug.text('y: ' + layer.getTileX(marker.y) , 180, 100);
    //game.debug.text('Time: ' + timer.seconds , 32, 200);
    //game.debug.text('nBlack: ' + nBlack , 32, 250);
    //game.debug.text('world height: ' + game.world.height , 32, 150);
  }
}