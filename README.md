# 12 - Plane


## Inspiration et défi relevé

Pour notre application, nous avons été inspiré par le débat d'actualité présent sur la 
place publique concernant la mobilité à Québec.

Notre idée nous est aussi venu du fait que nous nous retrouvions quelquefois 
en tant que citoyen à attendre tard la nuit que le feu devienne vert pour nous malgré le
fait que nous soyons seul à l'intersection.

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
Notre application donne aux citoyens l'accès au traffic aux intersections sur le territoire de la région de 
Québec et de Montréal ainsi que l'état des différents feux. Celui-ci peut 
signaler la présence de traffic à son intersection ainsi que sa position en temps réel. En 
prenant en compte les données fournies par le citoyen ainsi que les données disponible sur 
le traffic actuel, les feux ajustent leur temps d'attente dans chacune des directions. De 
cette manière, on donne un poids au citoyen dans l'équation.

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
pourraient être utilisés pour modéliser le temps qu'une telle solution pourrait sauver.

## Les bons coups

* Écologie
* Scalable (universel)
* RealTime
* Feedback user
* Faisabilité élevée (Économique et la technologie est déjà disponible)

## Ce qu'on a appris

Durant notre exploration des différentes problématiques associées à l'implication 
citoyenne, nous avons découvert les bénéfices environnementaux de notre application.
En effet, si les automobilistes canadiens évitaient la marche au ralenti pendant à 
peine trois minutes par jour, les émissions de CO2 pourraient être réduites de 1,4 millions 
de tonnes par année. Cela équivaut à économiser 630 millions de litres de carburant ou 
encore à retirer 320 000 voitures de la circulation annuellement. De la même manière, il 
suffit de 14 minutes de marche au ralenti pour brûler 0,4 litre d’essence et émettre 1 kg 
de CO2 dans l’atmosphère. [source](http://www.crecn.org/main.php?sid=m&mid=24&lng=2)

Grâce aux conférences, nous avons aussi appris que la ville de Québec disposait d'un système 
de gestion artérielle et d'un système permettant aux chauffeurs d'autobus d'appeler une 
lumière leur donnant la priorité dans les intersections.

## La suite pour votre application

Comme mentionné plus haut, il serait envisageable d'ajouter un système de reconnaissance de voix
pour nous permettre de faciliter l'interaction avec les citoyens. Nous avons aussi pensé à 
l'intégration de notre application dans un système d'exploitation pour voitures tels
Apple CarPlay.

* Machine learning
* Ajouter autres commandes utilisateur
* Intégration à l'application Copilote

## Built With

* `React Native` utilisant `Expo`
* `Node` avec `socket.io` pour des mises à jour de l'interface en temps-réel
* `MongoDB`

HackQc 2019

[![](https://cdn.discordapp.com/attachments/347875180342935563/551886132472971290/unknown.png)]


## Utilisation
VM de Calcul Québec:
* http://plane.mdamour.info
* Port d'écoute: 8888