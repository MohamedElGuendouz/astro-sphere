---
title: "Optimisation de la trajectoire d'une sonde marine autonome"
description: "Projet R&D sur l'optimisation de la trajectoire d'une sonde marine autonome en conditions difficiles."
date: 2018-03-01
summary: "Développement en C++ d’un module embarqué sur Raspberry Pi pour estimer la trajectoire d’une sonde marine sans GPS, via intégration d’une IMU et filtre de Kalman 3D."
tags: ["Data Science", "Data Engineering", "Data Architecture"]
---
## Objectif

Le projet visait à résoudre un problème fréquent en milieu marin : suivre la trajectoire d’une sonde autonome en l’absence de signal GPS, notamment lors d’immersions prolongées ou de conditions météorologiques difficiles.

L’objectif était de développer une solution embarquée, capable d’estimer dynamiquement la position d’une sonde sous l’eau pendant quelques dizaines de secondes, avec une précision tolérable de quelques mètres.

## Conception technique

J’ai conçu un module embarqué en C++, déployé sur une Raspberry Pi, capable de :

- Lire les données d’une IMU (gyroscope + accéléromètre).
- Traiter ces données en temps réel embarqué.
- Appliquer une intégration double des accélérations pour estimer la position.
- Filtrer les résultats avec un filtre de Kalman 3D, codé à la main.

### Fonctionnement de l’estimation

1. Lecture des capteurs (MPU6050) via I2C.
2. Suppression de la gravité grâce à l’estimation de l’orientation (gyroscope).
3. Intégration des accélérations pour obtenir la vitesse.
4. Intégration des vitesses pour estimer la position.
5. Application d’un filtre de Kalman pour lisser la trajectoire et réduire le bruit.

Le résultat permettait une estimation de position à ±2–4 m sur 10 à 30 secondes, suffisante pour une navigation locale approximative sans GPS.

## Système embarqué

- Langage : C++ (traitement capteur + filtre Kalman)
- Matériel : Raspberry Pi + IMU MPU6050
- Architecture : le script tournait en continu, stockait les résultats localement, et était conçu pour être intégré au système propriétaire de la sonde.

## Tests et résultats

- Tests réalisés en laboratoire sur prototype fonctionnel.
- Intégration validée dans la sonde marine propriétaire du centre CIDCO.
- Le module a été jugé suffisamment fiable pour un usage sur le terrain en environnement contrôlé.
- Livrables : code C++, documentation, support de soutenance et démonstration.

## Enjeux et limites techniques

- Le traitement ne repose sur aucun repère externe, donc la dérive est inévitable à long terme.
- Solution adaptée uniquement à des estimations à court terme (≤1 min) sans recalibrage.
- La stabilité du résultat dépend fortement de la qualité du capteur et de la précision de l’estimation de la gravité.

## Ce que j’ai appris

- Développement embarqué complet en C++ avec contraintes de performance et de mémoire.
- Mise en œuvre d’un filtre de Kalman 3D maison.
- Lecture de données capteurs via I2C sur Raspberry Pi.
- Structuration d’un projet allant du POC à une première phase d’industrialisation.

## Ce que je referais aujourd’hui

- Structurer le code avec des design patterns adaptés.
- Mettre en place des tests unitaires et fonctionnels rigoureux dès le début.
- Intégrer une calibration automatisée de l’IMU au démarrage.

## Bilan

Une solution simple, efficace et embarquée pour l’estimation de trajectoire sans GPS à court terme, réalisée de manière autonome, avec intégration dans un vrai système opérationnel.