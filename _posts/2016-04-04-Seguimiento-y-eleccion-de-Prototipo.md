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