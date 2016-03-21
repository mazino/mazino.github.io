var player, playerMove;
var pandas;
var cursors;
var spaceKey;
var timer;
var aux, pandaAux;
var obstacles, obstacleMove;

var score, scoreTextValue, stage, stageClear, stageTexValue, move, moveTextValue, textStyle_Key, textStyle_Value;

var Game = {

   preload : function() {
    game.load.spritesheet('ship', 'assets/images/humstar.png', 32, 32);
    game.load.image('panda', 'assets/images/spinObj_01.png');
    game.load.image('background', 'assets/images/starfield.jpg');
    game.load.image('obstacle', 'assets/images/obstacle.png');

  },

  create : function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.tileSprite(0, 0, 800, 600, 'background');

    // Create our Timer
    timer = game.time.create(false);  
    aux = false;
    pandaAux = false;
    stage = 1;
    move = 4;
    score = 0;
    obstacleMove = 40;
    playerMove = 300;

    this.createPandas();
    this.createObstacle();

    // Add Text to top of game.
    textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#46c0f9", align: "center" };

    // Score.
    game.add.text(30, 40, "SCORE", textStyle_Key);
    scoreTextValue = game.add.text(90, 36, score.toString(), textStyle_Value);

    // Stage.
    game.add.text(500, 40, "STAGE", textStyle_Key);
    stageTextValue = game.add.text(558, 36, stage.toString(), textStyle_Value);

    // Moves.
    game.add.text(30, 80, "MOVES LEFT", textStyle_Key);
    moveTextValue = game.add.text(130, 77, move.toString(), textStyle_Value);

    player = game.add.sprite(400, 300, 'ship');
    player.name = 'player';
    player.anchor.set(0.5);
    player.scale.setTo(2,2);
    player.smoothed = false;

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.bounce.set(0.8);
    player.body.allowRotation = true;
    player.body.immovable = true;    

    player.animations.add('fly', [0,1,2,3,4,5], 10, true);
    player.play('fly');

    player.body.setSize(24, 22);
    
    //player.body.fixedRotation = true;

    cursors = game.input.keyboard.createCursorKeys();

    spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.togglePause, this);

    timer.start();
  },

  togglePause : function() {
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
  },

  update : function(){
    //pandas.forEachAlive(this.playerPandaNoCollision, this);
    game.physics.arcade.collide(player, pandas, this.playerPandaCollision, null, this);
    game.physics.arcade.collide(pandas, pandas, this.pandaCollision, null, this);
    game.physics.arcade.collide(obstacles, pandas, this.obstaclePandaCollision, null, this);

    if(move <= 0 && !pandas.checkAll("alpha", 0.4)){
      timer.add(3000, this.lose, this);
      //this.gameOver();
    }

    if(pandas.checkAll("alpha", 0.4)){
      this.stageUp();
    }

    this.playerMovement();

    pandas.forEach(function(panda) {
      if(panda.body.velocity.x > 30){
        panda.body.velocity.x -= 0.5;
      }
      else if(panda.body.velocity.x < -30){
        panda.body.velocity.x += 0.5;
      }

      if(panda.body.velocity.y > 30){
        panda.body.velocity.y -= 0.5;
      }
      else if(panda.body.velocity.x > -30){
        panda.body.velocity.y += 0.5;
      }

      if(panda.body.velocity.x > 0 && panda.body.velocity.x < 30){
        panda.body.velocity.x = 0;
      }
      else if(panda.body.velocity.x < 0 && panda.body.velocity.x > -30){
        panda.body.velocity.x = 0;
      }

      if(panda.body.velocity.y > 0 && panda.body.velocity.y < 30){
        panda.body.velocity.y = 0;
      }
      else if(panda.body.velocity.y < 0 && panda.body.velocity.y > -30){
        panda.body.velocity.y = 0;
      }
    });

    obstacles.forEach(function(obstacle) {
      if(obstacle.x >= 340 && obstacle.x <= 350){
        obstacle.body.velocity.x = -1 * obstacleMove;
      }
      else if(obstacle.x >= 70 && obstacle.x <= 80){
        obstacle.body.velocity.x = obstacleMove;
      }

      if(obstacle.x >= 450 && obstacle.x <= 460){
        obstacle.body.velocity.x = 1*obstacleMove;
      }
      else if(obstacle.x >= 720 && obstacle.x <= 730){
        obstacle.body.velocity.x = -1 * obstacleMove;
      }
    });
  },

  stageUp : function(){
    //stageClear = game.add.text(390, 290, "Stage Clear", { font: "bold 30px sans-serif", fill: "#000000", align: "center" });
    aux = true;
    timer.add(4000, this.generateStage, this);
  },

  generateStage : function(){
    if(aux){
      stage += 1;
      stageTextValue.text = stage.toString();
      move += 3;
      moveTextValue.text = move.toString();

      playerMove += 40;
      obstacleMove += 20;
      //stageClear.destroy();

      pandas.removeAll();
      this.createPandas();
      player.reset(390,290);
      aux = false;
    }
  },

  createPandas : function(){
    pandas = game.add.group();
    pandas.enableBody = true;

    var panda;

    panda = pandas.create(game.rnd.integerInRange(20 , 350), game.rnd.integerInRange(20 , 250), 'panda');
    panda.body.collideWorldBounds = true;
    panda.body.bounce.setTo(0.8, 0.8);
    panda.scale.setTo(0.8, 0.8);
    panda.anchor.setTo(0.5, 0.5);
    panda.body.setSize(52, 58);

    panda = pandas.create(game.rnd.integerInRange(450 , 780), game.rnd.integerInRange(20 , 250), 'panda');
    panda.body.collideWorldBounds = true;
    panda.body.bounce.setTo(0.8, 0.8);
    panda.scale.setTo(0.8, 0.8);
    panda.anchor.setTo(0.5, 0.5);
    panda.body.setSize(52, 58);

    panda = pandas.create(game.rnd.integerInRange(20 , 350), game.rnd.integerInRange(350 , 580), 'panda');
    panda.body.collideWorldBounds = true;
    panda.body.bounce.setTo(0.8, 0.8);
    panda.scale.setTo(0.8, 0.8);
    panda.anchor.setTo(0.5, 0.5);
    panda.body.setSize(52, 58);

    panda = pandas.create(game.rnd.integerInRange(450 , 780), game.rnd.integerInRange(350 , 580), 'panda');
    panda.body.collideWorldBounds = true;
    panda.body.bounce.setTo(0.8, 0.8);
    panda.scale.setTo(0.8, 0.8);
    panda.anchor.setTo(0.5, 0.5);
    panda.body.setSize(52, 58);
  },

  createObstacle : function(){
    obstacles = game.add.group();
    obstacles.enableBody = true;

    var obstacle;

    obstacle = obstacles.create(game.rnd.integerInRange(20, 305), game.rnd.integerInRange(260 , 340), 'obstacle');
    obstacle.body.collideWorldBounds = true;
    obstacle.body.immovable = true;
    obstacle.body.velocity.x = obstacleMove;
    //obstacle.scale.setTo(0.8, 0.8);
    obstacle.anchor.setTo(0.5, 0.5);

    obstacle = obstacles.create(game.rnd.integerInRange(495 , 780), game.rnd.integerInRange(260 , 340), 'obstacle');
    obstacle.body.collideWorldBounds = true;
    obstacle.body.immovable = true;
    obstacle.body.velocity.x = obstacleMove;
    //obstacle.scale.setTo(0.8, 0.8);
    obstacle.anchor.setTo(0.5, 0.5);
  },

  playerPandaCollision : function(obj1, obj2){
    obj1.body.enable = false;
    obj2.alpha = 0.4;
    obj2.body.velocity.x = obj1.body.velocity.x;
    obj2.body.velocity.y = obj1.body.velocity.y;

    move -=1;
    moveTextValue.text = move.toString();

    score += 10;
    scoreTextValue.text = score.toString();

    timer.add(5000, this.stopMove, this);
  },

  obstaclePandaCollision : function(obj1, obj2){
    obj1.alpha = 1;
    obj2.alpha = 1;
    score -= 20;
    if(score <= 0){
      score = 0;
    }
    scoreTextValue.text = score.toString();
  },

  stopMove : function(){
    player.body.enable = true;
    pandas.setAll("body.velocity.x", 0);
    pandas.forEach(function(panda) {
      if(panda.alpha == 0.4){        
        panda.body.enable = false;
      }
    });
  },

  pandaCollision : function(obj1, obj2){
    if(obj1.alpha != 0.4 || obj2.alpha != 0.4){
      score += 20;
      scoreTextValue.text = score.toString();  
    }
    obj1.alpha = 0.4;
    obj2.alpha = 0.4;
  },

  playerMovement : function(){
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
      player.body.velocity.x = -playerMove;
    }
    else if (cursors.right.isDown)
    {
      player.body.velocity.x = playerMove;
    }

    if (cursors.up.isDown)
    {
      player.body.velocity.y = -playerMove;
    }
    else if (cursors.down.isDown)
    {
      player.body.velocity.y = playerMove;
    }
  },

  lose : function(){
    this.gameOver();
  },

  gameOver : function(){
    if(!pandas.checkAll("alpha", 0.4)){
      game.state.start('Game_Over');  
    }    
  },

  render : function() {
    //game.debug.body(player);
    //game.debug.bodyInfo(player, 32, 64);
    //game.debug.text('Time until event: ' + timer.seconds , 32, 200);
  }
}

