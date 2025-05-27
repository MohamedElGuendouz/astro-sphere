---
title: "Sécurisation d’un environnement Hadoop chez FDJ"
description: "Transformation d’un environnement Hadoop on-premise en un socle sécurisé et industrialisé pour la gestion de données sensibles, via Apache Ranger et un script de gestion automatisé."
date: 2022-03-01
summary: "Passage d’un POC Hadoop totalement ouvert à un environnement de production sécurisé chez FDJ. Implémentation d’une gouvernance fine des accès avec Apache Ranger, automatisation via un script Python, et accompagnement des équipes techniques."
tags: ["Hadoop", "Apache Ranger", "Data Lake", "HDFS", "Hive", "Data Steward", "Data Governance", "Security", "Python"]
---
En mars 2022, j’ai rejoint la Française des Jeux (FDJ) en tant que **Data Engineer Lead / Data Steward** pour une mission à la fois technique et stratégique : transformer un environnement Hadoop en POC (Proof of Concept) très permissif en un socle sécurisé, prêt pour l’industrialisation.

### Contexte de départ : un POC devenu critique

Lorsque je suis arrivé, l’environnement Hadoop on-premise en place servait initialement à des expérimentations internes. Sauf qu’il donnait un accès total à tous les utilisateurs, y compris via des **Service Accounts (SA)**, qui pouvaient lire, modifier et supprimer n’importe quelle donnée. Bref, c’était un environnement de test, mais utilisé en conditions quasi réelles.

Le tournant, c’est que FDJ avait décidé de basculer vers une industrialisation de cette plateforme, en l’ouvrant aux traitements métiers — dont certains manipulaient des données ultra-sensibles, comme celles des joueurs gagnants. Il fallait donc rendre cet environnement digne d’un système de production, sans interruption de service et sans casser les traitements existants.

### Mon rôle : sécuriser sans bloquer

Ma mission a été double : analyser les besoins métiers et techniques de chaque utilisateur ou équipe, puis concevoir un cadre de sécurité robuste et maintenable.

J’ai travaillé seul sur ce projet, tout en étant intégré à l’équipe Big Data. J’ai d’abord cartographié les flux et les traitements critiques en cours d’exécution. L’objectif était clair : ne rien casser, tout en commençant à restreindre progressivement les accès.

J’ai conçu une première série de policies dans **Apache Ranger**, en définissant des droits par rôle et par équipe. Pour automatiser la gestion et la mise à jour des policies, j’ai développé un **script Python** qui interagissait directement avec l’API de Ranger. Une sorte de "Terraform maison" pour gérer les droits dans Ranger, avec une approche versionnée et industrialisée.

### Concrètement, qu’est-ce qu’on a sécurisé ?

Le périmètre concernait les **données des joueurs gagnants**, un sujet extrêmement sensible pour FDJ. J’ai mis en place un contrôle d’accès fin sur les données **HDFS** et **Hive**, en introduisant des politiques différenciées pour :
- les développeurs (accès en lecture ou écriture selon les cas),
- les métiers (accès restreint à certains datasets),
- les administrateurs (accès spécifiques et tracés via les SA).

Le tout sans recourir à des outils complexes comme Kerberos, en gardant **Ranger** comme point central de la gouvernance des accès.

### Résultats : un environnement sécurisé, sans accroc

Le principal succès de ce projet, c’est d’avoir réalisé cette transition **sans la moindre interruption de service**, ni incident sur les traitements en production. Là où l’environnement était totalement ouvert, on est passé à une gouvernance claire, segmentée, et traçable.

J’ai également accompagné les équipes internes, notamment les développeurs, pour qu’ils comprennent la logique de cette nouvelle approche : on ne restreint pas par défiance, mais pour fiabiliser l’ensemble du pipeline et préparer la montée en charge de l’environnement.

### Ce que j’en retiens

Sur le plan technique, cette mission m’a permis de **monter en puissance sur la dimension "Data Governance"**, au-delà du simple rôle de Data Engineer. J’ai pu concrètement mettre en œuvre une stratégie de sécurité sur un environnement critique, tout en apportant une vraie couche d’industrialisation.

Avec du recul, je referais le projet de la même manière, car tout s’est déroulé comme prévu. Si je devais conseiller une autre entreprise dans un cas similaire, je recommanderais peut-être de partir sur un nouvel environnement propre dès le départ, en intégrant des outils comme **Terraform** pour mieux gérer les ressources dès le début.