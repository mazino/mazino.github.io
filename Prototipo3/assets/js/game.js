var bmd, map, layer, marker, currentTile;
var score, scoreTextValue, textStyle_Key, textStyle_Value;

var cursors;
var player;
var jumpButton, jumpTimer;

var background, colorBackground, backgroundDelay, changeBackground, screenDelay;
var index;
var floors;
var timer;
var A,S,B,F;

var Game = {
  preload : function() {

    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
    game.load.image('floor', 'assets/images/floor.png');
    game.load.image('backgroundRed', 'assets/images/backgroundRed.png');
    game.load.image('backgroundBlue', 'assets/images/backgroundBlue.png');
    game.load.image('backgroundWhite', 'assets/images/backgroundWhite.png');
    game.load.image('backgroundBlack', 'assets/images/backgroundBlack.png');

    game.load.image('changeRed', 'assets/images/changeRed.png');
    game.load.image('changeBlue', 'assets/images/changeBlue.png');
    game.load.image('changeWhite', 'assets/images/changeWhite.png');
    game.load.image('changeBlack', 'assets/images/changeBlack.png');

  },

  create : function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create our Timer
    timer = game.time.create(false);
    //timer.loop(7000, this.changeWarning2, this);

    //Por defecto background inicial Rojo
    background = game.add.tileSprite(0, 0, 800, 600, "backgroundRed");    
    background.fixedToCamera = true;

    //init variables
    colorBackground = ["backgroundRed","backgroundBlue","backgroundWhite","backgroundBlack"];
    changeBackground = ["changeRed","changeBlue","changeWhite","changeBlack"];
    backgroundDelay = 10;
    screenDelay = 8;
    jumpTimer = 0;
    currentTile = 0;
    score = 0;
    
    //Paleta de colores
    map = game.add.tilemap();
    bmd = game.add.bitmapData(32 * 4, 32 * 1);    
    var color = Phaser.Color.createColor(255,0,0); //Red
    bmd.rect(0*32, 0, 64, 32, color.rgba);
    color = Phaser.Color.createColor(0,0,255); //Blue
    bmd.rect(1*32, 0, 64, 32, color.rgba);
    color = Phaser.Color.createColor(255,255,255); //White
    bmd.rect(2*32, 0, 64, 32, color.rgba);
    color = Phaser.Color.createColor(51,0,51); //Black
    bmd.rect(3*32, 0, 64, 32, color.rgba); 

    //  Add a Tileset image to the map
    map.addTilesetImage('tiles', bmd);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', 999, 30, 32, 32); //Intentar Corregir el 999

    //  Populate some tiles for our player to start on with color Blue
    for (var i = 0; i < 20; i++){
      map.putTile(1, i, 10, layer);
    }
    
    //Se setea Azul con collider debido al background inicial rojo;
    map.setCollision(1, true);

    //  Create our tile selector at the top of the screen
    this.createTileSelector();

    // Add Text to top of game.
    textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#46c0f9", align: "center" };

    // Score.
    game.add.text(30, 40, "SCORE", textStyle_Key).fixedToCamera = true;
    scoreTextValue = game.add.text(90, 38, score.toString(), textStyle_Value);    
    scoreTextValue.fixedToCamera = true;

    // Letras con que se activa cada Tile
    game.add.text(12, 10, "A", textStyle_Key).fixedToCamera = true;
    game.add.text(44, 10, "S", textStyle_Key).fixedToCamera = true;
    game.add.text(76, 10, "D", textStyle_Key).fixedToCamera = true;
    game.add.text(108, 10, "F", textStyle_Key).fixedToCamera = true;

    //Crea suelo (kill player)
    this.createFloor();    

    // Crea Player
    this.createPlayer();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    A = game.input.keyboard.addKey(Phaser.Keyboard.A);
    S = game.input.keyboard.addKey(Phaser.Keyboard.S);
    D = game.input.keyboard.addKey(Phaser.Keyboard.D);
    F = game.input.keyboard.addKey(Phaser.Keyboard.F);


    game.input.addMoveCallback(this.updateMarker, this);

    timer.start();
  },

  update : function() {
    game.world.setBounds(player.xChange, 0, game.width + player.xChange, game.world.height);

    game.physics.arcade.collide(player, layer);    

    this.playerMove();
    
    if(player.x % 500 == 0){ //Corregir Score
      this.addScore();
    }

    if(timer.seconds > screenDelay){
      index = this.changeWarning();
    }

    if(timer.seconds > backgroundDelay){
      this.changeBackground(index);
    }

    //game.physics.arcade.collide(player, floors, this.floorPlayerCollision, null, this);
    
  },

  addScore : function(){
    score += 50;
    scoreTextValue.text = score.toString();
  },

  changeWarning : function()
  { 
    index = game.rnd.integerInRange(0, 3);
    if (background.key != colorBackground[index]){
      background.loadTexture(changeBackground[index]);
      screenDelay = timer.seconds + 10;
      return index;
    }
  },

  changeBackground : function(indice){
    if (background.key != colorBackground[indice]){
      background.loadTexture(colorBackground[indice]);
      indice % 2 == 0 ? this.collisionSet(++indice) : this.collisionSet(--indice);
      backgroundDelay = timer.seconds + 10;
    }
  },

  collisionSet : function(indice){
    map.setCollision(indice,true);
    for(var i = 0; i < 4; i++){
      if(i != indice){
        map.setCollision(i,false);
      }
    }
  },

  createFloor : function(){
    floors = game.add.group();
    floors.enableBody = true;
    var floor = floors.create(0, game.world.height - 32, 'floor');
    floor.scale.x = game.world.width; 
    floor.body.immovable = true;
    floor.body.collideWorldBounds = true;
  },

  createPlayer : function() {
    player = game.add.sprite(80, game.world.centerY-20, 'dude');
    player.anchor.set(0.5);

    player.xOrig = player.x;
    player.xChange = 0;

    game.physics.arcade.enable(player);
    game.physics.arcade.gravity.y = 350;

    player.body.collideWorldBounds = true;    

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
  },

  playerMove : function(){
    player.body.velocity.x = 300;
    player.play('right');

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
    else if(D.isDown){
      currentTileMarker.x = 64;
      currentTileMarker.y = 0;
      currentTile = 2;
    }
    else if(F.isDown){
      currentTileMarker.x = 96;
      currentTileMarker.y = 0;
      currentTile = 3;
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

    if (game.input.mousePointer.isDown && marker.y > 32)
    {
      map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer);
    }

  },

  createTileSelector : function() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.8);
    tileSelectorBackground.drawRect(0, 0, 128, 33);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, bmd);
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(this.pickTile, this);

    //  Our painting marker
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

  floorPlayerCollision : function(){
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('Game_Over');
  },

  render : function(){

    game.debug.cameraInfo(game.camera, 500, 100);
    game.debug.spriteInfo(player, 32, 100);
    game.debug.text('Time until event: ' + timer.seconds , 32, 200);
  }
}