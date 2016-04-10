var bmd, map, layer, marker, currentTile;
var score, scoreTextValue, nBlackTextValue, textStyle_Key, textStyle_Value;

var cursors;
var player;
var jumpButton, jumpTimer;

var background, colorBackground, backgroundDelay, changeBackground, screenDelay;
var index;
var floors;
var timer;
var A,S,B,F, nBlack, isBlack, maxBlack, itemBlack;
var obstacles;
var velocityUp;

var Game = {
  preload : function() {
    game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
    game.load.image('floor', 'assets/images/spikess.png');
    game.load.image('backgroundRed', 'assets/images/backgroundRed.png');
    game.load.image('backgroundBlue', 'assets/images/backgroundBlue.png');
    game.load.image('backgroundWhite', 'assets/images/backgroundGreen.png');
    game.load.image('backgroundBlack', 'assets/images/backgroundBlack.png');

    game.load.image('changeRed', 'assets/images/changeRed.png');
    game.load.image('changeBlue', 'assets/images/changeBlue.png');
    game.load.image('changeWhite', 'assets/images/changeGreen.png');
    game.load.image('changeBlack', 'assets/images/changeBlack.png');

    game.load.image('obstacle', 'assets/images/obstacle.png');
    game.load.image('addBlack', 'assets/images/addBlack.png');

  },

  create : function() {
    TGS.Analytics.logGameEvent('begin');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 450;

    // Create our Timer
    timer = game.time.create(false);
    //timer.loop(3000, this.changeWarning2, this);
    //timer.loop(5000, this.addScore, this);

    //Por defecto background inicial Rojo
    background = game.add.tileSprite(0, 0, 800, 600, "backgroundWhite");
    background.fixedToCamera = true;

    //init variables
    colorBackground = ["backgroundRed","backgroundBlue","backgroundWhite","backgroundBlack"];
    changeBackground = ["changeRed","changeBlue","changeWhite","changeBlack"];
    backgroundDelay = 10;
    screenDelay = 9;
    jumpTimer = 0;
    currentTile = 0;
    score = 0;
    velocityUp = 0;
    nBlack = 100;
    maxBlack = 200;
    isBlack = false;

    //Paleta de colores
    map = game.add.tilemap();
    bmd = game.add.bitmapData(32 * 4, 32 * 1);
    var color = Phaser.Color.createColor(255,0,0); //Red
    bmd.rect(0*32, 0, 32, 32, color.rgba);
    color = Phaser.Color.createColor(0,0,255); //Blue
    bmd.rect(1*32, 0, 64, 32, color.rgba);
    color = Phaser.Color.createColor(0,180,0); //Green
    bmd.rect(2*32, 0, 64, 32, color.rgba);
    color = Phaser.Color.createColor(51,0,51); //Black
    bmd.rect(3*32, 0, 64, 32, color.rgba); 

    //  Add a Tileset image to the map
    map.addTilesetImage('tiles', bmd);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', 2000, 30, 32, 32); //Intentar Corregir el 2000

    //  Populate some tiles for our player to start on with color Blue
    for (var i = 0; i < 20; i++){
      i < 10 ? map.putTile(3, i, 10, layer) : map.putTile(0, i, 10, layer);
    }
    
    //Se setea Blanco con collider debido al background inicial Azul, y color Negro siempre tiene Collider;
    map.setCollision([0,3], true);
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
    game.add.text(76, 10, "D", textStyle_Key).fixedToCamera = true;
    game.add.text(108, 6, "F", textStyle_Key).fixedToCamera = true;
    nBlackTextValue = game.add.text(102, 19, nBlack.toString(), { font: "bold 12px sans-serif", fill: "#46c0f9", align: "center" });
    nBlackTextValue.fixedToCamera = true;
    
    this.createFloor();
    this.obstaclesCreate();
    this.itemBlackCreate();

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

    if(nBlack <= 0 && isBlack){
      nBlack = 0; // Sólo para asegurarse que nBlack sea igual a cero
      nBlackTextValue.text = "00" + nBlack.toString();
      isBlack = false;
      if(background.key == "backgroundRed"){
        currentTileMarker.x = 32;
        currentTileMarker.y = 0;
        currentTile = 1;
      }
      else if(background.key == "backgroundBlue"){
        currentTileMarker.x = 64;
        currentTileMarker.y = 0;
        currentTile = 2;
      }
      else if(background.key == "backgroundWhite"){
        currentTileMarker.x = 0;
        currentTileMarker.y = 0;
        currentTile = 0;
        isBlack = false;
      }
      else if(background.key == "changeRed" || background.key == "changeBlue" || background.key == "changeBlue"){
        currentTileMarker.x = 64;
        currentTileMarker.y = 0;
        currentTile = 0;
      }
    }

    if(game.physics.arcade.distanceBetween(itemBlack, player) > 2000){
      this.itemBlackGenerate();
    }

    this.playerMove();

    this.addScore();

    if(timer.seconds > screenDelay){
      index = this.changeWarning();
    }

    if(timer.seconds > backgroundDelay){
      this.changeBackground(index);
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

    game.physics.arcade.overlap(player, itemBlack, this.addItemBlack, null, this);
    game.physics.arcade.overlap(obstacles, player, this.gameOver, null, this);
    game.physics.arcade.overlap(player, floors, this.gameOver, null, this);
  },

  addScore : function(){
    score = Math.floor(player.x / 50);
    scoreTextValue.text = score.toString();
  },

  addItemBlack : function(p, item){
    item.kill();
    nBlack += 25;
    nBlackTextValue.text = nBlack.toString();
  },

  itemBlackCreate : function(){
    var posX = game.rnd.integerInRange(1500, 1800);
    var posY = game.rnd.integerInRange(4 , 16);
    itemBlack = game.add.sprite(posX, posY * 32, "addBlack");
    game.physics.arcade.enable(itemBlack);
    itemBlack.body.collideWorldBounds = false;
    itemBlack.scale.setTo(0.25, 0.25);
    itemBlack.body.immovable = true;
    itemBlack.body.allowGravity = false;
  },

  itemBlackGenerate : function(){
    var posX = game.camera.x +  game.rnd.integerInRange(1000, 1500);
    var posY = game.rnd.integerInRange(4 , 16);
    itemBlack.reset(posX, posY * 32);
  },

  obstaclesCreate : function() {
    obstacles = game.add.group();
    obstacles.enableBody = true;
    obstacles.createMultiple(6, 'obstacle');

    var x = game.rnd.integerInRange(this.game.width, this.game.world.width - this.game.width);
    for (var i = 0; i < 4; i++) {
      //this.obstaclesCreateOne(game.rnd.integerInRange(game.world.width - 200, game.world.width - 50), game.rnd.integerInRange(50 , game.world.height - 100));
      this.obstaclesCreateOne(game.rnd.integerInRange(16, 24), game.rnd.integerInRange(4 , 15));
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

  changeWarning : function()
  { 
    var indice = game.rnd.integerInRange(0, 2);
    if (background.key != colorBackground[indice]){
      background.loadTexture(changeBackground[indice]);
      screenDelay = timer.seconds + 10;
      return indice;
    }
  },

  changeBackground : function(indice){
    if (background.key == changeBackground[indice]){
      background.loadTexture(colorBackground[indice]);
      if(indice == 0){
        map.setCollision(1, true);
        map.setCollision([0,2],false);
      }
      else if(indice == 1){
        map.setCollision(2, true);
        map.setCollision([0,1],false);
      }
      else if (indice == 2){
        map.setCollision(0, true);
        map.setCollision([1,2],false);
      }
      backgroundDelay = timer.seconds + 10;
      velocityUp += 20;
    }
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
    player = game.add.sprite(96, game.world.centerY - 30, 'dude');

    player.xOrig = player.x;
    player.xChange = 0;

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true; 
    player.body.setSize(32,32,0,16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
  },

  playerMove : function(){
    player.body.velocity.x = 150 + velocityUp;
    player.play('right');

    player.xChange = Math.max(Math.abs(player.x - player.xOrig), player.xChange);
    if(A.isDown){
      currentTileMarker.x = 0;
      currentTileMarker.y = 0;
      currentTile = 0;
      isBlack = false;
    }
    else if(S.isDown){
      currentTileMarker.x = 32;
      currentTileMarker.y = 0;
      currentTile = 1;
      isBlack = false;
    }
    else if(D.isDown){
      currentTileMarker.x = 64;
      currentTileMarker.y = 0;
      currentTile = 2;
      isBlack = false;
    }
    else if(F.isDown && nBlack > 0){
      currentTileMarker.x = 96;
      currentTileMarker.y = 0;
      currentTile = 3;
      isBlack = true;
      //TGS.Analytics.logLevelEvent('pressF', nBlack);
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

  destroyObstacle: function(x, y){
    obstacles.forEachAlive(function(obstacle){
      var posX = obstacle.x/32;
      var posY = obstacle.y/32;
      for(var i = 0; i < obstacle.height/32; i++){
        if(posX == x && posY == (y - i)){
          obstacle.kill();
          break;
        }
      }
    });
  },

  updateMarker : function() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;    

    if (game.input.mousePointer.isDown && marker.y > 32 && marker.y < (game.world.height - 32))
    {
      map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer); //Pintar con el color seleccionado
      if(isBlack){
        nBlack--;
        nBlack < 100 ? nBlackTextValue.text = "0" + nBlack.toString() : nBlackTextValue.text = nBlack.toString();
        this.destroyObstacle(layer.getTileX(marker.x), layer.getTileY(marker.y));
      }
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
    TGS.Analytics.logGameEvent('end');
    game.world.setBounds(0, 0, game.width, game.height);
    game.state.start('Game_Over');
  },

  render : function(){
    //game.debug.cameraInfo(game.camera, 500, 100);
    //game.debug.spriteInfo(player, 32, 400);
    //game.debug.text('Time: ' + timer.seconds , 32, 200);
    //game.debug.body(player);
    //game.debug.body(floors.getFirstAlive());
    //game.debug.body(itemBlack);
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