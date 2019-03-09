# 12 - Plane


## Inspiration et défi relevé

Pour notre application, nous avons été inspiré par le débat d'actualité présent sur la 
place publique concernant la mobilité à Québec.

Notre idée nous est aussi venu du fait que nous nous retrouvions quelquefois 
en tant que citoyen à attendre tard la nuit que le feu devienne vert pour nous malgré le
fait que nous soyons seul à l'intersection, ainsi que du fait qu'il y a peu(ou pas) de 
système de feux intelligents présentement utilisés dans la province de Québec.

Nous avons aussi pensé aux bénéfices environnementaux possibles de cette solution venant
du fait que les voitures se retrouveraient moins longtemps aux intersections. 

<!--
D'où vous est venue cette idée ? Quel défi en lien avec le thème avez-vous relevé ?

– Améliorer la relation avec le citoyen

– Améliorer la mobilité de façon durable

– Améliorer la connaissance du territoire
-->

## Ce que l'app fait
<!--
Une courte description de votre solution.
-->
Notre application donne aux citoyens l'accès au traffic sur le territoire de la région de 
Québec et de Montréal ainsi que l'état des différents feux aux intersections. Celui-ci peut 
signaler que la présence de traffic à son intersection ainsi que son attente à un arrêt. En 
prenant en compte les données fournies par le citoyen ainsi que les données disponible sur 
le traffic actuel, les feux modifient leur temps d'attente dans chacune des directions. De 
cette manière, on veut donner un poids au citoyen dans l'équation.

## Les jeux de données utilisés.

Nommez tous les jeux de données utilisés provenant du portail Données Québec.

* [Feux pour piétons - Ville de Montréal](https://www.donneesquebec.ca/recherche/fr/dataset/vmtl-feux-pietons)
* [Placement de toutes les intersections - Ville de Montréal](https://www.donneesquebec.ca/recherche/fr/dataset/vmtl-feux-tous)
* [Intersection de voie publique - Ville de Québec](https://www.donneesquebec.ca/recherche/fr/dataset/vque_53)
* [Feux sonores pour les malvoyants - Ville de Montréal](https://www.donneesquebec.ca/recherche/fr/dataset/vmtl-feux-malvoyants)
* [Comptage des véhicules et des piétons aux intersections munies de feux - Ville de Montréal](https://www.donneesquebec.ca/recherche/fr/dataset/vmtl-comptage-vehicules-pietons)

## Les technos

<!-- 
Qu'avez vous utilisé pour concevoir votre application.
-->

* `React Native` utilisant `Expo`
* `Node` avec `socket.io` pour des mises à jour de l'interface en temps-réel
* `MongoDB`

## Les difficultés rencontrées

Nous avons rencontré des difficultés quant à l'utilisation d'un système pour la 
reconnaissance de la voix par le citoyen lors de sa conduite. Cette difficulté était
principalement de nature technologique, car il n'existait pas actuellement de manière 
simple d'obtenir la voix et de l'interpréter dans le cas d'une application mobile
utilisant `React Native`. Notre manière de remédier à ce problème a été de repenser 
l'expérince utilisateur pour que l'application possède quelques grands boutons 
permettant l'interaction souhaitée.

Une autre difficulté d'ordre technologique vient du fait que nous avons une application 
dont les données seront modifiées à intervalle très fréquentes. Cela amène à une forte
demande en puissance de calcul du côté du serveur ainsi qu'à une forte demande de la
base de données.

Une autre difficulté que nous avons rencontrée vient du manque de données réelles qui
vient du fait que seul Québec et Montréal ont des jeux de données à cet effet et
du manque de tests réels possibles de notre application, puisque seul des simulations
pourrait être utilisés pour modéliser le temps qu'une telle solution pourrait sauver.

## Les bons coups
## Ce qu'on a appris
## La suite pour votre application
## Built With

HackQc 2019

[![](https://cdn.discordapp.com/attachments/347875180342935563/551886132472971290/unknown.png)]


## Utilisation
VM de Calcul Québec:
* http://plane.mdamour.info
* Port d'écoute: 8888