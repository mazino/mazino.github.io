var GlobalScore = 0; //Variable que contiene el Score general de juego
var bmd, map, layer, marker, currentTile;
var score;
var scoreTextValue, nBlackTextValue, textStyle_Key, textStyle_Value;

var cursors;
var player;
var vidas = 3,vidasTextValue;
var egg, eggs, eggsCount = 0, eggsTextValue;
var playerGolpe;
var jumpButton, jumpTimer;

var background, colorBackground, backgroundDelay, changeBackground, screenDelay;
var index;
var floors;
var timer;
var A,S;
var obstacles;
var velocityUp;
var laserRojo;
var laserRojoGroup;
var iterador; //Tiempo en que se active el rayo laser.

var music_mundo1,music_mundo2;
var sfx_salto;
var sfx_laser, sfx_laser2;
var sfx_cambio;
var sfx_colision;

var caidaLibre;

var LEVEL_LENGHT = 101;
var lvlup;
var checkRepetition = [];
var yBefore = 0;
var xBefore = 0;

var Game = {
  preload : function() {

  },

  create : function() {
    //TGS.Analytics.logGameEvent('begin');

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 450;

    music_mundo1 = game.add.audio('music_mundo1', 0.6, true);
    music_mundo1.play();
    
    sfx_salto = game.add.audio('sfx_salto', 0.3, false);

    sfx_colision = game.add.audio('sfx_colision');
    sfx_colision.addMarker('colision', 0.2, 1);

    sfx_cambio = game.add.audio('sfx_cambio', 0.4, false);

    sfx_laser = game.add.audio('sfx_laser');

    // Create our Timer
    timer = game.time.create(false);

    game.add.tileSprite(0, 0, 800, 600, "bg").fixedToCamera = true;
    background = game.add.tileSprite(0, 0, 800, 600, "backgroundGreen");
    background.fixedToCamera = true;
    background.alpha = 0.8
    

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
    playerGolpe = false;

    //Paleta de colores
    map = game.add.tilemap();
    bmd = game.add.bitmapData(32 * 2, 32 * 1);
    var color = Phaser.Color.createColor(0,112,166);//Blue
    bmd.rect(0*32, 0, 32, 32, color.rgba);
    color = Phaser.Color.createColor(12,153,81); //Green
    bmd.rect(1*32, 0, 64, 32, color.rgba);

    //  Add a Tileset image to the map
    map.addTilesetImage('tiles', bmd);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', LEVEL_LENGHT, 30, 32, 32); //Intentar Corregir el 2000

    //  Populate some tiles for our player to start on with color Blue
    for (var i = 0; i < 20; i++){
      i < 10 ? map.putTile(0, i, 10, layer) : map.putTile(0, i, 10, layer);
    }
    //Se setea azul con collider debido al background inicial Verde
    map.setCollision([0], true);

    //  Create our tile selector at the top of the screen
    this.createTileSelector();

    // Add Text to top of game.
    textStyle_Key = { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#46c0f9", align: "center" };

    // Score.
    game.add.text(30, 40, "Distance", textStyle_Key).fixedToCamera = true;
    scoreTextValue = game.add.text(100, 38, score.toString(), textStyle_Value);    
    scoreTextValue.fixedToCamera = true;

    // Letras con que se activa cada Tile
    game.add.text(12, 10, "A", textStyle_Key).fixedToCamera = true;
    game.add.text(44, 10, "S", textStyle_Key).fixedToCamera = true;

    //Vidas
    game.add.sprite(560, 30, 'camaleonWalk',24).fixedToCamera = true;
    game.add.text(600, 40, "x", textStyle_Key).fixedToCamera = true;
    vidasTextValue = game.add.text(614, 38, vidas.toString(), textStyle_Value);
    vidasTextValue.fixedToCamera = true;

    //huevos
    game.add.sprite(660, 30, 'eggs').fixedToCamera = true;
    game.add.text(700, 40, "x", textStyle_Key).fixedToCamera = true;
    eggsTextValue = game.add.text(714, 38, eggsCount.toString(), textStyle_Value);
    eggsTextValue.fixedToCamera = true;
    game.add.text(730, 40, "/10", textStyle_Key).fixedToCamera = true;
    
    this.createFloor();
    this.lvlUp();
    this.obstaclesCreate();
    this.eggsCreate();
    this.laserRojoVerticalCreate();
    this.createMiniMap();
    this.createChamaleonHead();

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
    if(game.camera.bounds.width <= LEVEL_LENGHT*32){
      game.world.setBounds(player.xChange, 0, game.width + player.xChange, game.world.height);
    }

    game.physics.arcade.collide(player, layer);

    this.addScore();
    this.updateMiniMap();

    this.playerMove();

    if(eggsCount == 10){
      vidas += 1;
      eggsCount = 0;
      player.body.velocity.x -= 85;
      vidasTextValue.text = vidas.toString();
      eggsTextValue.text = eggsCount.toString();

    }

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

    //var yBefore = 0;
    //var xBefore = 0;
    /*obstacles.forEachAlive(function(obstacleGroup) {
      obstacleGroup.forEachAlive(function(obstacle){
        if(obstacle.x < (game.camera.bounds.left - 32))
          obstacle.kill();
      }, this);
    }, this);*/
    obstacles.forEach(function(obstacleGroup) {
      var k = 0;
      var x = 0;
      var y = 0;
      var n = obstacleGroup.length;
      obstacleGroup.forEach(function(obstacle){
        if(obstacle.x < (game.camera.bounds.left - 32)) {
          if (k === 0) {
            if (xBefore === 0)
              x = Math.floor(game.camera.x/32)*32 + 832;
            else if (xBefore != 0) {
              x = game.rnd.integerInRange(1,10)
              if (x >= 3) {
                x = xBefore + game.rnd.integerInRange(3, 6)*32;
                checkRepetition = [];
              }
              else
                x = xBefore;
            }
            if (x === xBefore)
              checkRepetition[checkRepetition.length] = 1;
            if (checkRepetition.length === 2) {
              x = xBefore + game.rnd.integerInRange(5,15)*32;
            y = game.rnd.integerInRange(2, 12)*32;
            checkRepetition = [];
            }
            if (x < game.camera.bounds.left + 800)
              x = Math.floor(game.camera.x/32)*32 + 832;
            else if (checkRepetition.length === 1) {
              if (yBefore/32 > 7 && player.y < 128) {
              y = 2*32;
              }
              else if (yBefore/32 > 7 && yBefore/32 < 8) {          
                y = game.rnd.integerInRange(0,1);
                if (y = 0)
                  y = game.rnd.integerInRange(2 , yBefore/32-5)*32;
                else
                  y = game.rnd.integerInRange(yBefore/32+5, 12)*32;
              }
              else if (yBefore/32 > 7)
                y = game.rnd.integerInRange(2 , yBefore/32-5)*32;
              else if (yBefore/32 < 8)
                y = game.rnd.integerInRange(yBefore/32+5, 12)*32;
              else {
                x = xBefore + game.rnd.integerInRange(5,14)*32;
                y = game.rnd.integerInRange(2, 12)*32;
              }
            }
            else {
              if (player.y < 128) { //si el jugador esta arriba entonce hay un 70% de probabilidades de que aparezca un obstaculo a esa altura
                y = game.rnd.integerInRange(1,10);
                if (y >= 4)
                  y = game.rnd.integerInRange(1, 3)*32;
                else
                  y = game.rnd.integerInRange(3, 12)*32;
              }
              else
                y = game.rnd.integerInRange(1, 12)*32;
            }
            k = 1;
            yBefore = y;
            xBefore = x;
          }
          obstacle.kill();
          var obstacle = obstacleGroup.getFirstDead();
          obstacle.reset(x, y+(k*32));
          obstacle.body.immovable = true;
          obstacle.body.allowGravity = false;
          k += 1;
          xBefore = x;
          return obstacle;
        }
      },this);
      return obstacleGroup;
    },this);

    laserRojoGroup.forEach(function(laserRojo) {
      if(laserRojo.frame == 14){
        laserRojo.kill();
      }
    });

    if(eggs.countLiving() > 0){
      if(player.x > eggs.getFirstAlive().x +  400)
      {
        egg = eggs.getFirstAlive();

        var posX = Math.floor(game.rnd.integerInRange(game.camera.x + 1000 , game.camera.x + 1200)/32);
        var posY = game.rnd.integerInRange(2 , 15);

        egg.reset(posX*32, posY*32);
        egg.body.immovable = true;
        egg.body.allowGravity = false;
      }
    }

    if(eggs.countLiving() == 0){
      egg = eggs.getFirstDead();

      var posX = Math.floor(game.rnd.integerInRange(game.camera.x + 1000 , game.camera.x + 1200)/32);
      var posY = game.rnd.integerInRange(2 , 15);

      egg.reset(posX*32, posY*32);
      egg.body.immovable = true;
      egg.body.allowGravity = false;
    }

    if(playerGolpe == false){
        game.physics.arcade.overlap(laserRojoGroup, player, this.playerLaserCollision, null, this);
        obstacles.forEachAlive(function(obstaclesGroup){
          game.physics.arcade.overlap(player, obstaclesGroup, this.playerCollision, null, this);
        }, this);
    }

    game.physics.arcade.overlap(obstacles, eggs, this.overlapEgg, null, this);
    game.physics.arcade.overlap(player, eggs, this.playerEgg, null, this);
    game.physics.arcade.overlap(player, lvlup, this.playerLvlup, null, this);
    game.physics.arcade.overlap(player, floors, this.playerFloorCollision, null, this);
  },

  playerCollision : function(){
    if((player.animations.name == "camaleonWalkBlue" || player.animations.name == "camaleonJumpBlue") && background.key == "backgroundBlue"){
      //Hacer nada
    }
    else if((player.animations.name == "camaleonWalkGreen" || player.animations.name == "camaleonJumpGreen") && background.key == "backgroundGreen"){
      //Hacer nada
    }
    else{
      if(vidas > 1){
        vidas -=1;
        vidasTextValue.text = vidas.toString();
        player.alpha = 0.5;
        playerGolpe = true;
        game.time.events.add(Phaser.Timer.SECOND * 1.5, this.playerTime, this);
        sfx_colision.play('colision');
      }
      else{
        this.gameOver();
      }
    }
  },

  playerLaserCollision : function(pj, laser){
    if(laser.frame == 10){
      if(vidas > 1){
        vidas -=1;
        vidasTextValue.text = vidas.toString();
        player.alpha = 0.5;
        playerGolpe = true;
        game.time.events.add(Phaser.Timer.SECOND * 1.5, this.playerTime, this);
        sfx_colision.play('colision');
      }
      else{
        this.gameOver();
      }
    }
  },

  playerTime : function(){
    player.alpha = 1;
    playerGolpe = false;
    iterador = 0;
  },

  playerFloorCollision : function(){
    this.gameOver();
  },

  addScore : function(){
    score = Math.floor(player.x / 32) + GlobalScore;
    scoreTextValue.text = score.toString();
  },

  updateMiniMap : function() {
    var movX = player.x/(LEVEL_LENGHT)*7;
    chamaleonHead.cameraOffset.setTo(272+movX, 32);
  },

  eggsCreate : function() {
    eggs = game.add.group();
    eggs.enableBody = true;
    eggs.createMultiple(1, 'eggs');

    egg = eggs.getFirstDead();

    var posX = Math.floor(game.rnd.integerInRange(1000 , 1200)/32);
    var posY = game.rnd.integerInRange(2 , 15);
    egg.reset(posX*32, posY*32);

    egg.body.setSize(egg.width - 4, egg.height - 2, -1, 2);
    egg.body.immovable = true;
    egg.body.allowGravity = false;
  },

  overlapEgg : function(){
    egg = eggs.getFirstAlive();
    var posX = Math.floor(game.rnd.integerInRange(1000 , 1200)/32);
    var posY = game.rnd.integerInRange(2 , 17);
    egg.x = egg.x + 128;
  },

  playerEgg : function(){
    eggsCount += 1;
    eggsTextValue.text = eggsCount.toString();
    egg = eggs.getFirstAlive();
    egg.kill();
  },

  obstaclesCreate : function() {
    obstacles = game.add.group();
    obstacles.enableBody = true;
    var n = game.rnd.integerInRange(5,8);
    for (var i = 0; i < n; i++) {
      this.obstaclesGroup();
    }
  },

  obstaclesGroup: function() {
    obstacleGroup = game.add.group();
    obstacleGroup.enableBody = true;
    var n = game.rnd.integerInRange(1,3);
    var obstacle = obstacleGroup.getFirstDead(true,-32,0, 'Obstacle - Mutant Plant'); //parte de arriba del obstaculo
    obstacle.body.setSize(28, 20, 2, 2);
    obstacle.frame = 0;
    obstacle.body.allowGravity = false;
    obstacle.body.immovable = true;
    for (var i = 0; i < n; i++) {
      var obstacle = obstacleGroup.getFirstDead(true,-32,32*(i+1), 'Obstacle - Mutant Plant'); //partes del medio, pueden ser entre 1 y 3 en total para cada obstaculo (cada obstaculo varia en largo)
      obstacle.body.setSize(28, 20, 2, 6);
      obstacle.frame = 1;
      obstacle.body.allowGravity = false;
      obstacle.body.immovable = true;
    }
    var obstacle = obstacleGroup.getFirstDead(true,-32,32*(n+1), 'Obstacle - Mutant Plant'); //parte de abajo del obstaculo
    obstacle.body.setSize(28, 20, 2, 10);
    obstacle.frame = 2;
    obstacle.body.allowGravity = false;
    obstacle.body.immovable = true;
  obstacles.add(obstacleGroup);
    return obstacleGroup;
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
    laserRojo.animations.add('laserRojo', [0,1,2,3,4,5,6,7,9,10,11,12,13,14], 10, false);
    laserRojo.play('laserRojo');
    game.time.events.add(Phaser.Timer.SECOND * 0.25, this.laserPlay, this);
  },

  laserPlay : function(){
    sfx_laser.play();
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
    floor.fixedToCamera = true;
    floor.body.immovable = true;
    floor.body.allowGravity = false;
  },

  playerLvlup : function(){
    GlobalScore = score;
    sfx_salto.stop();
    music_mundo1.stop();
    game.state.start('WhiteWorld');
  },

  lvlUp : function() {
    lvlup = game.add.sprite((LEVEL_LENGHT-1)*32,0,"lvlEnd");
    game.physics.arcade.enable(lvlup);
    lvlup.enableBody = true;
    lvlup.body.immovable = true;
    lvlup.body.allowGravity = false;
  },

  createChamaleonHead : function() {
    chamaleonHead = game.add.sprite(272,32,"chamaleonHead");
    chamaleonHead.fixedToCamera = true;
    chamaleonHead.allowGravity = false;
  },

  createMiniMap : function() {
    miniMapSprite = game.add.sprite(240,0,"miniMapSprite");
    miniMapSprite.fixedToCamera = true;
    miniMapSprite.immovable = true;
    miniMapSprite.allowGravity = false;
  },

  createPlayer : function() {
    checkRepetition = [];
    xBefore = 0;
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
      player.body.setSize(32,16,0,11);
      //player.body.setSize(21,16,6,9);
      caidaLibre++;
      if(caidaLibre == 1){
        sfx_salto.play();
      }
    }    

    player.xChange = Math.max(Math.abs(player.x - player.xOrig), player.xChange);
    if(A.isDown){
      currentTileMarker.x = 0;
      currentTileMarker.y = 0;
      currentTile == 1 ? sfx_cambio.play() : false
      currentTile = 0;

    }
    else if(S.isDown){
      currentTileMarker.x = 32;
      currentTileMarker.y = 0;
      currentTile == 0 ? sfx_cambio.play() : false
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
      var tile = map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y), layer, false)
      if(tile == null){
        map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer);
      }
      else{
        //Se puede pintar si estoy pintando con un color diferente del tile detectado.
        if(tile.index != currentTile){
          map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer);
        }
      }
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
    /*obstacles.forEachAlive(function(obstaclesGroup){
      obstaclesGroup.forEachAlive(function(obstacle){
        game.debug.body(obstacle);
      }, this);
    }, this);
    */
    //game.debug.body(obstacleGroup.getFirstAlive());
    //game.debug.body(eggs.getFirstAlive());
    //game.debug.text('MouseX: ' + game.input.activePointer.x , 32, 80);
    //game.debug.text('MouseY: ' + game.input.activePointer.y , 180, 80);
    //game.debug.text('x: ' + layer.getTileX(marker.x) , 32, 100);
    //game.debug.text('y: ' + layer.getTileX(marker.y) , 180, 100);
    //game.debug.text('Time: ' + timer.seconds , 32, 200);
    //game.debug.text('nBlack: ' + nBlack , 32, 250);
    //game.debug.text('world height: ' + game.world.height , 32, 150);
  }
}