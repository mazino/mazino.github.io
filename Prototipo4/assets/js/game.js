var arrow;
var ball;
var catchFlag = false;
var launchVelocity = 0;

var items, throwBall, floor, limitLaunch, limit;
var score, scoreTextValue, etapa, stageTexValue, shoot, shootTextValue, textStyle_Key, textStyle_Value;

var Game = {


  preload : function () {

    game.load.image('analog', 'assets/images/fusia.png');
    game.load.image('arrow', 'assets/images/longarrow2.png');
    game.load.image('ball', 'assets/images/pangball.png');
    game.load.image('item', 'assets/images/apple.png');
    game.load.image('floor', 'assets/images/platform.png');
    game.load.image('limitLaunch', 'assets/images/limitLaunch.png');

  },

  create : function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);    

    // set global gravity
    game.physics.arcade.gravity.y = 200;
    game.stage.backgroundColor = '#0072bc';
    
    this.createItem();
    this.createFloor();
    this.createLimit();

    throwBall = false;
    score = 0;
    etapa = 1;
    limit = 0;
    shoot = 4;

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
    game.add.text(30, 80, "SHOOTS LEFT", textStyle_Key);
    shootTextValue = game.add.text(140, 77, shoot.toString(), textStyle_Value);

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
    
    ball = game.add.sprite(400, 585, 'ball');
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(0.7, 0.7);
    
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
      game.physics.arcade.overlap(ball, floor, this.floorBallCollision, null, this);
    }

    if(shoot <= 0){
      this.gameOver();
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
      var y = game.rnd.integerInRange(50 , 250);
      item.reset(x,y);
      item.scale.setTo(1.2, 1.2);
      item.body.immovable = true;
      item.body.allowGravity = false;
    }
    
  },

  createFloor : function(){
    floor = game.add.sprite(0, game.world.height - 32, 'floor');
    floor.scale.setTo(2, 0.5);
    
    game.physics.enable(floor, Phaser.Physics.ARCADE);

    floor.body.immovable = true;
    floor.body.allowGravity = false;
  },

  createLimit : function(){
    limitLaunch = game.add.sprite(0, 400, 'limitLaunch');
    limitLaunch.alpha = 0.2;
  },

  finishLevel : function (){
    etapa +=1;
    limit += 20;
    shoot += 5;
    if(shoot > 13){
      shoot = 13;
    }
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

    game.debug.text("Drag the ball and release to launch", 32, 32);

    //game.debug.bodyInfo(ball, 32, 64);

    // game.debug.spriteInfo(ball, 32, 64);
    // game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 32, 250);

  }
}
