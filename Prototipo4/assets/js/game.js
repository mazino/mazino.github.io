var arrow;
var ball;
var catchFlag = false;
var launchVelocity = 0;

var items, throwBall, floor, limitLaunch, limitThrow, limit; //Limit es el valor que hace disminuir la barra para agarrar
var obstacles, obstacleMove;
var score, scoreTextValue, etapa, stageTexValue, shoot, shootTextValue, textStyle_Key, textStyle_Value;

var Game = {


  preload : function () {

    game.load.image('analog', 'assets/images/fusia.png');
    game.load.image('arrow', 'assets/images/longarrow2.png');
    //game.load.image('ball', 'assets/images/pangball.png');
    game.load.spritesheet('ball', 'assets/images/humstar.png', 32, 32);
    game.load.image('item', 'assets/images/apple.png');
    game.load.image('obstacle', 'assets/images/ufo.png');
    game.load.image('floor', 'assets/images/platform.png');
    game.load.image('limitLaunch', 'assets/images/limitLaunch.png');
    game.load.image('limitThrow', 'assets/images/limitThrow.png');
    game.load.image('background', 'assets/images/starfield.jpg');
 
  },

  create : function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);    

    // set global gravity
    game.physics.arcade.gravity.y = 200;
    //game.stage.backgroundColor = '#0072bc';
    game.add.tileSprite(0, 0, 800, 600, 'background');

    
    throwBall = false;
    score = 0;
    etapa = 1;
    limit = 0;
    shoot = 6;
    obstacleMove = 40;
    
    this.createItem();
    this.createFloor();
    this.createLimit();
    this.createLimitThrow();
    this.createObstacle();

     // Add Text to top of game.
    textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#46c0f9", align: "center" };

    // Score.
    game.add.text(30, 40, "SCORE", textStyle_Key);
    scoreTextValue = game.add.text(90, 36, score.toString(), textStyle_Value);

    // Stage.
    game.add.text(500, 40, "STAGE", textStyle_Key);
    stageTextValue = game.add.text(558, 36, etapa.toString(), textStyle_Value);

    // Shoot.
    game.add.text(30, 80, "SHOTS LEFT", textStyle_Key);
    shootTextValue = game.add.text(130, 77, shoot.toString(), textStyle_Value);

    game.add.text(30, 540, "HamStar Catch Zone", { font: "bold 18px sans-serif", fill: "#FFE600", align: "center" });

    game.add.text(30, 392, "HamStar  Throw Zone", { font: "bold 18px sans-serif", fill: "#FF2B2B", align: "center" });

    var graphics = game.add.graphics(0,0);
    graphics.beginFill(0x049e0c);
    graphics.drawRect(395, 400, 10, 200);    

    analog = game.add.sprite(400, 400, 'analog');

    game.physics.enable(analog, Phaser.Physics.ARCADE);

    analog.body.allowGravity = false;
    analog.width = 8;
    analog.rotation = 220;
    analog.alpha = 0;
    analog.anchor.setTo(0.5, 0.0);
    
    arrow = game.add.sprite(400, 400, 'arrow');

    game.physics.enable(arrow, Phaser.Physics.ARCADE);

    arrow.anchor.setTo(0.1, 0.5);
    arrow.body.moves = false;
    arrow.body.allowGravity = false;
    arrow.alpha = 0;

    //  Create our ship sprite
    ball = game.add.sprite(400, 585, 'ball');
    ball.scale.set(1.5);
    ball.smoothed = false;
    ball.animations.add('fly', [0,1,2,3,4,5], 10, true);
    ball.play('fly');
    
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    
    ball.body.collideWorldBounds = true;    
    ball.body.bounce.setTo(0.7, 0.7);
    ball.anchor.setTo(0.5, 0.5);
    
    
    // Enable input.
    ball.inputEnabled = true;
    ball.input.start(0, true);
    ball.events.onInputDown.add(this.set);
    ball.events.onInputUp.add(this.launch);

  },

  set : function(ball, pointer) {
    if (pointer.y > 400 + limit){
      ball.body.moves = false;
      ball.body.velocity.setTo(0, 0);
      ball.body.allowGravity = false;
      catchFlag = true;
      throwBall = false;
     }

  },

  launch : function (ball, pointer) {
    if (pointer.y > 400 && pointer.y < game.world.height - 40){
      catchFlag = false;
      ball.body.moves = true;
      arrow.alpha = 0;
      analog.alpha = 0;
      Xvector = (arrow.x - ball.x) * 5;
      Yvector = (arrow.y - ball.y) * 5;
      ball.body.allowGravity = true;  
      ball.body.velocity.setTo(Xvector, Yvector);
      throwBall = true;
    }
  },

  update : function () {
    arrow.rotation = game.physics.arcade.angleBetween(arrow, ball);
    if(throwBall){
      game.physics.arcade.overlap(ball, items, this.itemCollect, null, this);      
      game.physics.arcade.overlap(ball, obstacles, this.obstacleBallCollision, null, this);
      game.physics.arcade.overlap(ball, floor, this.floorBallCollision, null, this);
    }

    if(shoot <= 0){
      this.gameOver();
    }

    if(obstacles.exists)
    {
      obstacles.forEach(function(obstacle) {

        if(obstacle.x >= 220 && obstacle.x <= 230){
          obstacle.body.velocity.x = -1 * obstacleMove;
        }
        else if(obstacle.x >= 20 && obstacle.x <= 30){
          obstacle.body.velocity.x = obstacleMove;
        }

        if(obstacle.x >= 480 && obstacle.x <= 490){
          obstacle.body.velocity.x = -1 * obstacleMove;
        }
        else if(obstacle.x >= 230 && obstacle.x <= 240){
          obstacle.body.velocity.x = obstacleMove;
        }

        if(obstacle.x >= 770 && obstacle.x <= 780){
          obstacle.body.velocity.x = -1 * obstacleMove;
        }
        else if(obstacle.x >= 500 && obstacle.x <= 510){
          obstacle.body.velocity.x = obstacleMove;
        }
        
      });
    }

    if (catchFlag == true)
    {
      //  Track the ball sprite to the mouse  
      ball.x = game.input.activePointer.worldX;
      ball.y = game.input.activePointer.worldY;
      
      arrow.alpha = 1;    
      analog.alpha = 0.5;
      analog.rotation = arrow.rotation - 3.14 / 2;
      analog.height = game.physics.arcade.distanceToPointer(arrow);  
      launchVelocity = analog.height;
    }
  },

  createItem : function(){
    items = game.add.group();
    items.enableBody = true;
    items.createMultiple(6, 'item');
  
    for (var i = 0; i < 6; i++) {
      var item = items.getFirstDead();
      var x = i*140 + 10;
      var y = game.rnd.integerInRange(50 , 220);
      item.reset(x,y);
      item.scale.setTo(1.2, 1.2);
      item.body.immovable = true;
      item.body.allowGravity = false;
    }
  },

  createObstacle : function(){
    obstacles = game.add.group();
    obstacles.enableBody = true;
    obstacles.createMultiple(4, 'obstacle');
  
    for (var i = 0; i < 3; i++) {
      var obstacle = obstacles.getFirstDead();
      var x = i*280 + 40;
      var y = game.rnd.integerInRange(200 , 250);
      obstacle.reset(x,y);
      obstacle.scale.setTo(1.5, 1.5);
      obstacle.body.immovable = true;
      obstacle.body.allowGravity = false;
      obstacle.body.velocity.x = obstacleMove;
    }
  },

  createFloor : function(){
    floor = game.add.sprite(0, game.world.height - 32, 'floor');
    floor.scale.setTo(2, 0.5);
    
    game.physics.enable(floor, Phaser.Physics.ARCADE);

    floor.body.immovable = true;
    floor.body.allowGravity = false;
  },

  createLimitThrow : function(){
    limitThrow = game.add.sprite(0, 400, 'limitThrow');
    limitThrow.alpha = 0.2;
  },

  createLimit : function(){
    limitLaunch = game.add.sprite(0, 400, 'limitLaunch');
    limitLaunch.alpha = 0.2;
  },

  finishLevel : function (){
    etapa +=1;
    limit += 10;
    if(limit > 120){
      limit = 120
    }
    shoot += 5;
    if(shoot > 13){
      shoot = 13;
    }

    if(obstacles.countLiving() > 0)
    {
      obstacles.forEach(function(obstacle) {
        obstacle.kill();
      });
    }    
    this.createObstacle();
    obstacleMove += 20;

    throwBall = false;
    limitLaunch.reset(0,400 + limit)
    stageTextValue.text = etapa.toString();

    this.createItem();
    ball.reset(400,585);
  },

  itemCollect : function(obj1, obj2){
    score += 10*etapa;
    scoreTextValue.text = score.toString();
    obj2.kill();
    if(items.countLiving() == 0){
      this.finishLevel();
    }
  },

  obstacleBallCollision : function(obj1, obj2){    
    obj1.reset(400,585);
    obj2.kill()
  },

  floorBallCollision : function(obj1, obj2){
    shoot -= 1;
    shootTextValue.text = shoot.toString();
    throwBall = false;
    obj1.reset(400,585);
  },

  gameOver : function(){
    game.state.start('Game_Over');
  },

  render : function() {

    game.debug.text("Drag the HamStar and release to launch", 32, 32);
    game.debug.body(obstacles);

    //game.debug.bodyInfo(ball, 32, 64);

    // game.debug.spriteInfo(ball, 32, 64);
    // game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 32, 250);

  }
}
