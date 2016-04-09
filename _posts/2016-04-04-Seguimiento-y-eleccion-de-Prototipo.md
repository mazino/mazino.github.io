---
layout: post
title: Seguimiento y elección de Prototipo
---
Se realizó un seguimiento a los 5 prototipos creados, hasta el jueves 31 de marzo, con el fin de seleccionar el prototipo más popular y continuar su desarrollo. Para esto se usó la información que provee Gamejolt, esto es, número de visitas y veces que se ha jugado el juego. Además se usó <strong>Game API</strong> provista por GameJolt que permite tener información de el tiempo promedio que los usuarios juegan y el tiempo total de juego hasta la fecha.

Básicamente fueron 2 prototipos los que más fueron jugados hasta la fecha: [Paint Your Way!](http://gamejolt.com/games/paint-your-way/134227) y [Defend The Blue Nexus!](http://gamejolt.com/dashboard/games/133155) con alrededor de 22 veces jugados, 34 veces vistos y un tiempo promedio de juego de aproximadamente 3 minutos, pero además fueron los que consiguieron mayor tiempo de juego, 58 min Piant Your Way! y 31 min Defend The Blue Nexus!. Esto último fue lo que determinó la elección del juego.

Así es, el juego seleccionado fue Paint Your Way!, donde se generaron algunos cambios y mejoras en el. Primero se eliminó un background, ahora solo son 3 (Rojo, Azul, Verde), también el color Blanco se cambió por el color Verde. Y el color negro se convirtió en uno especial, donde puede ser usado como plataforma sin tener en consideración el background actual y además puede destruir obstáculos, no obstante este Color ahora tiene límite de usos. Por lo cual, se incorporó un ítem (<i>collectible</i>) que permite incrementar la cantidad de color negro.

El objetivo del juego sigue siendo maximizar el Score, esto se realiza alcanzando la mayor distancia durante el juego. Para alcanzar la mayor distancia posible el jugador debe evitar obstáculos que van apareciendo de manera aleatoria a medida que avanza y evitar el obstáculo que está constantemente en el suelo. El jugador para evitar los obstáculos debe ir creando su propio camino mediante el pintado de plataformas con los colores disponibles (Rojo, Verde y Azul)  cuya caja de colisión se activa o desactiva de acuerdo al background actual en la partida que puede ser Rojo, Verde o Azul. Además, el jugador puede saltar para evadir obstáculos y como ya fue explicado se pueden destruir obstáculos usando el color negro.

La relación entre background y pintura/plataforma se explica en el siguiente esquema.

![Relacion background-pintura](/img/background-pintura.png)

Básicamente, si el background es Rojo se debe pintar con el color Azul, si el background es Azul se debe pintar con el color Verde y si el background es Verde se debe pintar con el color Rojo. La excepción como ya se mencion es el color negro, el cual puede ser usado sin considerar el background.

A modo complementario se realizaron los modelos Game tokens y Game layers para describir mejor el juego, más información respecto a los modelos [aquí](http://www.gamasutra.com/view/feature/187777/game_design_tools_for_collaboration.php?print=1).

<strong>Game Tokens</strong>

Principalmente se detectaron 4 tokens  en el juego, esto son:

* Jugador, que a su vez se subdivide en Personaje (PJ) y Score.
* Obstáculos.
* Ítems.
* Plataformas, que puede ser de color: Rojo, Azul, Verde o Negro.

Así, se puede representar la interacción  existente entre estos tokens, como se observa en modelo basado en tokens:

![Game tokens](/img/Game Tokens.png)

Se puede observar que el personaje se relaciona con todos los demás tokens, si colisiona con obstáculos se activa el evento “<i>Game Over</i>”. Adquirir item incrementa la pintura de color negro. Dependiendo del background el jugador podrá correr por las distintas plataformas y según la distancia recorrida el Score irá aumentando. Además se observa la relación entre plataformas y obstáculos, donde la plataforma de color negro es capaz de destruir obstáculos y además las distintas pinturas se sobreescriben entre sí.

<strong>Game Layers</strong>

Como su nombre lo dice este modelo funciona con capas (específicamente con 6), donde la primera es de tokens, los cuales están directamente relacionadas con los detectados en el modelo Game tokens. De los 5 tokens utilizados en Game tokens sólo 3 de estos fueron puesto en la capa de tokens en Game layers (PJ, Item, Obstáculos), debido a que los otros 2 tokens (Score y Plataforma) se deducen de la interacción de estos 3 tokens en las demás capas.

El modelo realizado es el siguiente:

![Game Layers](/img/Game Layers.png)

Se puede observar nuevamente con este modelo cómo interactúan los distintos elementos del juego visto desde la perspectiva del jugador. Se debe resaltar la última capa <i>PSYCHO</i>, que pretende resumir las emociones que probablemente sienta el jugador cuando este jugando. En este caso, el personaje debería transmitir la sensación de adrenalina debido a que queremos mantenerlo a salvo el mayor tiempo posible. Los ítems que aparecen debido al aumento en pintura Negra, si se tiene suficiente de esta el jugador debería sentir cierta seguridad y por el contrario si es escaza, el jugador debería sentir ansiedad por obtener el item y que este aparezca. Finalmente, los obstaculos estan hechos para que el jugador se frustre y desee intentar superar su mejor score.

A modo de finalizar esta publicación dejaré algunos Gifs de los cambios hechos en el último avance del juego.

Destrucción de obstaculos:

![Destroy-obstacles](/img/destroy-obstacles.gif)

Limite de pintura negra:

![limite-pintura-negra](/img/limite-pintura.gif)

Un poco de Game Play:

![GamePlay](/img/game-play.gif)