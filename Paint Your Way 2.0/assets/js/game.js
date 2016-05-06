var bmd, map, layer, marker, currentTile;
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
var velocityUp;

var Game = {
  preload : function() {
    game.load.spritesheet('camaleonWalk', 'assets/images/Camaleon.png', 31, 27);
    game.load.image('floor', 'assets/images/spikess.png');
    game.load.image('backgroundRed', 'assets/images/backgroundRed.png');
    game.load.image('backgroundBlue', 'assets/images/backgroundBlue.png');
    game.load.image('backgroundGreen', 'assets/images/backgroundGreen.png');

    game.load.image('changeRed', 'assets/images/changeRed.png');
    game.load.image('changeBlue', 'assets/images/changeBlue.png');
    game.load.image('changeGreen', 'assets/images/changeGreen.png');    

    game.load.image('obstacle', 'assets/images/obstacle.png');
    game.load.image('addBlack', 'assets/images/addBlack.png');

  },

  create : function() {
    //TGS.Analytics.logGameEvent('begin');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 450;

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
    score = 0;
    velocityUp = 0;    

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

    this.playerMove();

    this.addScore();

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

    game.physics.arcade.overlap(obstacles, player, this.playerCollision, null, this);
    game.physics.arcade.overlap(player, floors, this.gameOver, null, this);
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

  addScore : function(){
    score = Math.floor(player.x / 50);
    scoreTextValue.text = score.toString();
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
    player = game.add.sprite(96, game.world.centerY - 30, 'camaleonWalk');

    player.xOrig = player.x;
    player.xChange = 0;

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    //Ajustar la caja de colisiones con el sprite definitivo 
    //player.body.setSize(32,32,0,16);

    player.animations.add('camaleonWalkGreen', [0,1,2,3], 20, true);
    player.animations.add('camaleonWalkBlue', [4,5,6,7], 20, true);

    //Inicializamos la animacion con que comenzamos el juego.
    player.play('camaleonWalkBlue');
  },

  playerMove : function(){
    player.body.velocity.x = 150 + velocityUp;    

    player.xChange = Math.max(Math.abs(player.x - player.xOrig), player.xChange);
    if(A.isDown){
      currentTileMarker.x = 0;
      currentTileMarker.y = 0;
      currentTile = 0;
      player.play('camaleonWalkBlue');
    }
    else if(S.isDown){
      currentTileMarker.x = 32;
      currentTileMarker.y = 0;
      currentTile = 1;
      player.play('camaleonWalkGreen');
    }

    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
      player.body.velocity.y = -250;
      jumpTimer = game.time.now + 750;
      //Ajustar el body del PJ al salto (es una idea hacerlo acá)
    }

    //Crear funcion if player.body.onFloor() -> ajustar el body al del tamaño de correr
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
    game.world.setBounds(0, 0, game.width, game.height);
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