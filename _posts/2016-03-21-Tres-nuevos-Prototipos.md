---
layout: post
title: Tres nuevos prototipos
---
Buenas tardes nuevamente, el desafío de crear 8 prototipos en 2 semanas cambió un poco, ahora sólo serán 5, es decir, que para esta semana se crearon 3 nuevos prototipos, pero existe una condición para 2 de estos, la cual es que el resultado de las decisiones del jugador deben ser <strong>asincrónicas</strong> con el input de acción. Asi que este post contiene un poco el proceso de creación de estos 3 nuevos prototipos que se muestran a continuación.

A modo de recordatorio, trabajo con [Phaser](http://phaser.io/) para el desarrollo de todos los prototipos debido a las razones explicadas en el post anterior.

<strong>Prototipo N°3, Paint Your Way!</strong>

Paint Your Way! Nace debido a un ejemplo en la página oficial de phaser [Tileset From Bitmapdata](http://phaser.io/examples/v2/tilemaps/tileset-from-bitmapdata), el cual consiste en que se tiene una paleta de colores y con ella se pueda pintar el escenario, donde todos los colores menos el primero (Rojo) tiene colision con el personaje, como se ve en la siguiente figura:

![Tileset From Bitmapdata](/img/Tileset.png)

Este fue mi punto de partida, transforme este tutorial en un <i>Runner</i> donde el jugador debe pintar el camino evitando los obstáculos y de que su personaje no colisione con el suelo, ambas condiciones significa perder en el juego. El objetivo y lograr la mayor distancia en el juego. La paleta de colores se redujo a tan solo 4 (rojo, azul, blanco y negro), donde la mecánica es la siguiente:


* Si el Background del juego es de color Azul, el jugador debe pintar con color Rojo, ya que todas las colisiones con los demás colores son inhabilitadas, por lo tanto el personaje del juego caerá  y si toca el suelo será Game Over.
* Si el Background es de color Rojo el jugador debe pintar con el color Azul y los demás colores pierde su caja de colisión.
* Si el Background es de color Blanco el jugador deberá pintar con el color Negro.
* Si el Background es de color Negro el jugador deberá pintar con el color Blanco.

Para efectos de disminuir la complejidad, cuando el color del Background va a cambiar un segundo antes de que esto ocurra se activa otro background, el cual avisa a qué color va a cambiar. Esto se realiza para que el cambio de Background no sea inesperado, por ejemplo:

![Ejemplo Backgroun Rojo](/img/ejemploBackground.png)

Este es un ejemplo de cambio de background al color Rojo.

Además el cambio de Background se realiza de manera aleatoria con los colores distintos al background actual.

El juego comienza con una velocidad “X” que aumenta progresivamente cada vez que hay un cambio en el background, con una plataforma inicial base de color rojo y background azul, para dar a entender que si el background es azul el color que se debe usar es rojo y que el personaje puede correr sobre la pintura.

El resultado final de este prototipo es el siguiente:

![Game play paint your way!](/img/paintyourway_gameplay.gif)

Los siguientes dos prototipos tiene las características asincrónicas requeridas.

<strong>Prototipo N°4, Throw me!</strong>

Throw me! También nace a partir de un exemplo de la pagina de Phaser, llamado [Launcher](http://phaser.io/examples/v2/arcade-physics/launcher), que simplemente consiste en lanzar una pelota a través de la pantalla:

![Ejemplo Phaser Launcher](/img/launcher.png)

A partir de esto generé un juego de plataforma, donde se debe lanzar un hámster (en vez de la pelota) para recolectar ciertos ítem que aumenta el <strong>Score</strong> del jugador evitando colisionar con enemigos que se mueven horizontalmente en el nivel. Una vez se recolecta todos los ítemes se pasa al segundo nivel, donde el mapa se vuelve a generar, esto continuará hasta que el jugador se quede sin lanzamientos. Se inicia con 6 intentos, y cada vez que se sube de nivel se otorgan 4 más. Nuevamente el objetivo del juego es maximizar el <strong>Score</strong> posible durante el tiempo de juego.

Para dar mayor versatilidad al juego se incorporó una zona para capturar al hamster antes de que este caiga al suelo, si esto ocurre el disparo no es descontado, es decir, se puede realizar un mismo lanzamiento tantas veces sea capturado el hámster en el aire y este no colisione con enemigos. Además esta zona decrece conforme aumentan los niveles.

El resultado del juego es el siguiente:

![Game play throw me!](/img/throwMe_gameplay.gif)

Prototipo N°5, Panda Hit!

Finalmente, el último prototipo es Panda Hit! Este prototipo no salió de algún ejemplo de Phaser como los anteriores. Es un juego de plataformas (parecido a Throw me!) donde se tienen 4 pandas alrededor del mapa y la misión del jugador es golpear a los 4 pandas con su personaje que puede mover en cualquier direccion del nivel. Cuando un panda es colisionado el movimiento del jugador se inhabilita y el panda se mueve de acuerdo a la potencia del impacto, además el atributo alpha (de la imagen del panda) cambia volviéndolo más transparente de manera que se sepa que ya fue golpeado. También si el panda golpea a otro en su trayecto antes de detenerse también cuenta como un golpe válido, aún más se premia al jugador dándole una mayor puntuación cuando se realizan golpes de pandas en cadena. El juego termina cuando ya no quedan movimientos, y un movimiento es consumido cuando un panda es golpeado por el jugador. Como ya se sabrá nuevamente el objetivo del juego es maximizar el <strong>Score</strong>

Para aumentar la dificultad se agregaron 2 obstáculos en el mapa, los cuales se mueven horizontalmente y si un panda choca con estos el panda vuelve a la normalidad, es decir, su alpha es restaurado por lo tanto deberá ser golpeado nuevamente. Además cada vez que un panda golpea los obstáculos el <strong>Score</strong> del juegado disminuye. 

Por otro lado, para restar complejidad cada vez que se sube de nivel se otorgan 3 movimientos nuevos.

El resultado es el siguiente

![Game play panda hit!](/img/pandahit_gameplay.gif)


Finalmente los 3 prototipos fueron publicados en la página [Gamejolt](http://gamejolt.com/) y todos los prototipos realizados hasta la fecha pueden encontrarlos y jugarlos [aquí](http://gamejolt.com/profile/mazino/1313716).