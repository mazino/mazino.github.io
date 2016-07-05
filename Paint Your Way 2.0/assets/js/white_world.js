/*var bmd, map, layer, marker, currentTile;
var score, scoreTextValue, nBlackTextValue, textStyle_Key, textStyle_Value;

var cursors;
var player;
var jumpButton, jumpTimer;

var background, colorBackground, backgroundDelay, changeBackground, screenDelay;
var index;
var floors;
var timer;
var A,S,D,F;
var obstacles;
var velocityUp;*/
var laserRojoHGroup;
var laserRojoVGroup;
var laserRojoH;
var laserRojoV;
var laserDelay;
var nLaserH;
var intervalosLaser;

var White_World = {
  preload : function() {
    game.load.spritesheet('camaleonWalk', 'assets/images/Camaleon.png', 31, 27);
    game.load.image('floor', 'assets/images/spikess.png');    
    game.load.image('backgroundWhite', 'assets/images/backgroundWhite.png');

    game.load.spritesheet('laserRojoHorizontal', 'assets/images/laser_horizontal.png',800,32);

  },

  create : function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 450;

    // Create our Timer
    timer = game.time.create(false);

    music_mundo2 = game.add.audio('music_mundo2', 0.5, true);
    music_mundo2.play();

    sfx_laser = game.add.audio('sfx_laser2');
    sfx_laser.addMarker('laser', 2.5, 2, 0.3, false);
    
    background = game.add.tileSprite(0, 0, 800, 600, "backgroundWhite");
    background.fixedToCamera = true;
    
    jumpTimer = 0;
    currentTile = 0;
    score = 0;
    laserDelay = 3;
    nLaserH = 3;
    intervalosLaser = 1.4;

    //Paleta de colores
    map = game.add.tilemap();
    bmd = game.add.bitmapData(32 * 2, 32 * 1);
    var color = Phaser.Color.createColor(64,64,64);//Black
    bmd.rect(0*32, 0, 32, 32, color.rgba);
    color = Phaser.Color.createColor(255,255,255); //White
    bmd.rect(1*32, 0, 64, 32, color.rgba);   

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
    this.laserRojoCreate();    

    // Crea Player
    this.createPlayer();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    A = game.input.keyboard.addKey(Phaser.Keyboard.A);
    S = game.input.keyboard.addKey(Phaser.Keyboard.S);

    game.input.addMoveCallback(this.updateMarker, this);

    timer.start();
  },

  update : function() {
    game.world.setBounds(player.xChange, 0, game.width + player.xChange, game.world.height);

    game.physics.arcade.collide(player, layer);    

    this.addScore();

    this.playerMove();

    if(timer.seconds > laserDelay){
      if(laserRojoHGroup.exists){
        laserRojoHGroup.forEach(function(laserRojoH) {
          laserRojoH.kill();
        });
      }
      this.laserRojoHorizontal();
    }

    laserRojoHGroup.forEach(function(laserRojo) {
      if(laserRojo.frame == 14){
        laserRojo.kill();
      }
    });

    //Cambiar esto, hacerlo menos estatico
    if(score > 100 && score < 250){
      nLaserH = 4;
      intervalosLaser = 1.2;
    }
    else if(score > 250 && score < 500){
      nLaserH = 5;
      intervalosLaser = 1;
    }
    else if(score > 500){
      nLaserH = 6;
      intervalosLaser = 0.9;
    }

    game.physics.arcade.overlap(laserRojoHGroup, player, this.playerLaserCollision, null, this);
    game.physics.arcade.overlap(obstacles, player, this.playerCollision, null, this);
    game.physics.arcade.overlap(player, floors, this.gameOver, null, this);

  },

  playerCollision : function(){
    this.gameOver();
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

  laserRojoCreate : function() {
    laserRojoHGroup = game.add.group();
    laserRojoHGroup.enableBody = true;
    laserRojoHGroup.createMultiple(10, 'laserRojoHorizontal', 0, false);
  },

  laserRojoHorizontal: function() {
    for(var i = 0; i < nLaserH; i++){
      game.time.events.add(Phaser.Timer.SECOND * i * intervalosLaser, this.laserPlay, this);
    }

    /*for(var i = 0; i < nLaserH; i++){
      var laserRojoH = laserRojoHGroup.getFirstDead(true, posX, posY*32 + i*64);

      laserRojoH.body.immovable = true;
      laserRojoH.body.allowGravity = false;
      laserRojoH.fixedToCamera = true;
      laserRojoH.body.setSize(800,20,0,6);
      laserRojoH.animations.add('laserRojo', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 8, false);
      laserRojoH.play('laserRojo');
      sfx_laser.play('laser');
    }

    for(var i = 0; i < (nLaserH - 1); i++){
      var laserRojoH = laserRojoHGroup.getFirstDead(true, posX, posY*32 - (i+1)*64);

      laserRojoH.body.immovable = true;
      laserRojoH.body.allowGravity = false;
      laserRojoH.fixedToCamera = true;
      laserRojoH.body.setSize(800,20,0,6);
      laserRojoH.animations.add('laserRojo', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 8, false);
      laserRojoH.play('laserRojo');
    }*/

    laserDelay = timer.seconds + 2*nLaserH;
  },

  laserPlay : function(){
    var posX = 0;
    var posY = Math.floor(player.y / 32);
    var laserRojoH = laserRojoHGroup.getFirstDead(true, posX*32, posY*32);

    laserRojoH.body.immovable = true;
    laserRojoH.body.allowGravity = false;
    laserRojoH.fixedToCamera = true;
    laserRojoH.body.setSize(800,20,0,6);
    laserRojoH.animations.add('laserRojo', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 8, false);
    laserRojoH.play('laserRojo');
    sfx_laser.play('laser');
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
    player = game.add.sprite(96, game.world.centerY - 30, 'camaleonWalk');

    player.xOrig = player.x;
    player.xChange = 0;
    //Asegurarse de setear al jugador al inicio del mapa
    game.world.setBounds(player.xChange, 0, game.width, game.world.height);

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    
    player.body.setSize(32,16,0,11);

    player.animations.add('camaleonWalkBlack', [24,25,26,27], 20, true);
    player.animations.add('camaleonJumpBlack', [28,29,30,31,32,33,34,35], 12, true);
    player.animations.add('camaleonWalkBlue', [12,13,14,15], 20, true);
    player.animations.add('camaleonJumpBlue', [16,17,18,19,20,21,22,23], 12, true);
    
  },

  playerMove : function(){
    player.body.velocity.x = 150 + velocityUp;

    if(player.body.onFloor()){
      player.play('camaleonWalkBlack');
    }
    else{
      player.play('camaleonJumpBlack');
    }

    //Si player está en el suelo su caja de colision es player.body.setSize(32,16,0,11);
    if(player.body.onFloor()){
      player.body.setSize(32,16,0,11);
    }
    //Si player está en el aire su colsion es player.body.setSize(32,32,0,0)
    else{
      player.body.setSize(21,16,6,9);
    }

    player.xChange = Math.max(Math.abs(player.x - player.xOrig), player.xChange);
    if(A.isDown){
      currentTileMarker.x = 0;
      currentTileMarker.y = 0;
      currentTile = 0;      
    }
    else if(S.isDown){
      currentTileMarker.x = 32;
      currentTileMarker.y = 0;
      currentTile = 1;
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
      player.body.velocity.y = -220;
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
    music_mundo2.stop();
    game.world.setBounds(0, 0, game.width, game.height);
    GlobalScore = score;
    game.state.start('Game_Over');
  },

  render : function(){    
     laserRojoHGroup.forEach(function(laserRojo) {
        //game.debug.body(laserRojo);
      
    });
  }
}