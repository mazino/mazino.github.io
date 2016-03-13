var squareSize, score, speed,
    cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value;

var player;
var enemies;
var nextEnemyAt = 0;
var enemyDelay = 1000;
var npc;
var npcLife;
var floor;

var bullet;
var bullets;
var lastState;
var bulletTime = 0;
var item;

var Game = {

  preload : function() {
    game.load.image('item_uno', './assets/images/apple.png');

    //Floor
    game.load.image('floor', './assets/images/floor3.png');
    //Player/NPC/Enemies
    game.load.spritesheet('personajes', './assets/images/player32x32.png', 32, 32);
    //Bullet of player
    game.load.image('bullet', './assets/images/bullets.png');
    //diamond
    game.load.image('diamond', './assets/images/diamond.png');
  },

  create : function() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    floor = game.add.sprite(0, 0, 'floor');
    floor.smoothed = false;

    squareSize = 15;                // The length of a side of the squares. Our image is 15x15 pixels.
    score = 0;                      // Game score.
    speed = 0;                      // Game speed.
    npcLife = 3;                    // Init of life
    lastState = 0;                  // Se inicializa lastState 0 por defecto  

    // Add Text to top of game.
    textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
    textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

    // Score.
    game.add.text(30, 20, "SCORE", textStyle_Key);
    scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
    
    // Speed.
    //game.add.text(500, 20, "SPEED", textStyle_Key);
    //speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
    
    // The player and its settings
    player = game.add.sprite(400, 300, 'personajes');
    player.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true; //Permite que el personaje no se salga de as dimenciones de la pantalla

    player.animations.add('left', [9, 10, 11], 10, true);
    player.animations.add('right', [3, 4, 5], 10, true);
    player.animations.add('up', [6, 7, 8], 10, true);
    player.animations.add('down', [0, 1, 2], 10, true);
    player.smoothed = false;

    //NPC
    npc = game.add.sprite(450, 300, 'personajes',49);
    npc.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(npc);
    npc.smoothed = false;
    npc.body.collideWorldBounds = true;

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.createMultiple(10, 'personajes', 37);
    enemies.setAll('anchor.x', 0.5);
    enemies.setAll('anchor.y', 0.5);
    //enemies.setAll('outOfBoundsKill', true);
    //enemies.setAll('checkWorldBounds', true)

    // Genereate the first item.
    this.generateItem();

    //Bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;    
    bullets.createMultiple(40, 'bullet'); //Se generar como maximo 40 bullets
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

  },

  update: function() {
    // Reset the players velocity (movement)
    player.body.velocity.set(0);
    
    this.playerMovement();

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
      this.fireBullet(lastState);
    }

    if(npc.exists)
    {
      game.physics.arcade.moveToObject(npc, item, 100);
    }
    if(enemies.exists)
    {
      enemies.forEach(function(enemy) {
        game.physics.arcade.moveToObject(enemy, npc, 70);        
        
      });
    }

    if(nextEnemyAt < this.time.now && enemies.countDead() > 0) {
      nextEnemyAt = this.time.now + enemyDelay;
      var enemy = enemies.getFirstExists(false);
      
      enemy.reset(this.rnd.integerInRange(20, 780), 0); //Enemigo sale en la parte superior, random
      enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
    }

    game.physics.arcade.overlap(npc, item, this.itemCollision, null, this);
    game.physics.arcade.overlap(bullets, enemies, this.bulletEnemyCollision, null, this);
    game.physics.arcade.overlap(npc, enemies, this.enemyNpcCollision, null, this);

  },

  generateItem: function()
  { 
    var randomX = Math.floor(Math.random() * 53 ) * squareSize;
    var  randomY = Math.floor(Math.random() * 40 ) * squareSize;
    item = game.add.sprite(randomX, randomY, 'item_uno');
    game.physics.arcade.enable(item);
  },

  itemCollision: function(npc,item) {
    item.destroy();
    itemTime = game.time.now + 1000;
    this.generateItem();
    score +=10;
    scoreTextValue.text = score.toString();
  },

  enemyNpcCollision: function(nonpc,enemy) {
    npcLife--;
    if(npcLife > 0)
    {
      enemy.kill();
    }
    else
    {
      game.state.start('Game_Over');
    }
  },

  bulletEnemyCollision: function(bullet, enemy) {    
    enemy.kill();
    bullet.kill();
  },

  playerMovement: function()
  {
    if (cursors.left.isDown)
    {
      // Move to the left
      player.body.velocity.x = -150;
      player.animations.play('left');
      lastState = 9;
    }
    else if (cursors.right.isDown)
    {
      // Move to the right
      player.body.velocity.x = 150;
      player.animations.play('right');
      lastState = 3;
    }
    else if (cursors.up.isDown)
    {
      player.body.velocity.y = -150;
      player.animations.play('up');
      lastState = 6;
    }
    else if (cursors.down.isDown)
    {
      player.body.velocity.y = 150;
      player.animations.play('down');
      lastState = 0;
    }
    else
    {
      // Stand still
      player.animations.stop();
      player.frame = lastState;
    }
  },

  fireBullet: function(){

    if (game.time.now > bulletTime)
    {
      bullet = bullets.getFirstExists(false);

      if (bullet)
      {
        bullet.reset(player.body.x + 16, player.body.y + 16);
        bullet.lifespan = 3000; //Tiempo de vida de bullet
        bullet.smoothed = false;
        bullet.scale.setTo(2, 2);
        
        if(player.body.velocity.x > 0) //Movimiento hacia la derecha
        {
          this.bulletDirection("right");
        }
        else if(player.body.velocity.x < 0) //Movimiento hacia la izquierda
        {
          this.bulletDirection("left");
        }
        else if(player.body.velocity.y < 0) //Movimiento hacia arriba
        {
          this.bulletDirection("up");
        }
        else if(player.body.velocity.y > 0) //Movimiento hacia abajo
        {
          this.bulletDirection("down");
        }
        else if (player.body.velocity.x == 0 & player.body.velocity.y == 0)
        {
          if (lastState == 9) { this.bulletDirection("left"); }
          else if (lastState == 3) { this.bulletDirection("right"); }
          else if (lastState == 6) { this.bulletDirection("up"); }
          else if (lastState == 0) { this.bulletDirection("down"); }
        }
        bulletTime = game.time.now + 500; //Tiempo entre disparo
      }
    }
  },

  bulletDirection: function(direction)
  { 
    if(direction == "right")
    {
      bullet.body.velocity.x = 400;
      bullet.body.velocity.y = 0;
      bullet.angle = 0;
    }

    else if(direction == "left")
    {
      bullet.body.velocity.x = -400;
      bullet.body.velocity.y = 0;
      bullet.angle = 180;
    }
    else if(direction == "up")
    {
      bullet.body.velocity.x = 0;
      bullet.body.velocity.y = -400;
      bullet.angle = 270;
    }
    else if(direction == "down")
    {
      bullet.body.velocity.x = 0;
      bullet.body.velocity.y = 400;
      bullet.angle = 90;
    }
  }

};