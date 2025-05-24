---
title: "Classification des environnements applicatifs par machine learning semi-supervisé"
description: "Classification des environnements applicatifs"
date: 2021-10-01
summary: "Un bref résumé du projet Banque PSA Finance."
tags: ["Data Science", "Data Engineering", "Data Architecture", "Machine Learning", "Python"]
---
## Contexte

Dans une logique de rationalisation de son système d'information, la DSI de Banque PSA Finance a lancé un projet visant à classifier automatiquement les environnements applicatifs du groupe. L’objectif était de structurer un référentiel fiable, à jour et automatisé, sans avoir à le maintenir manuellement — une tâche longue, sujette aux erreurs et peu évolutive.

Le projet a été développé sur l’environnement **on-premise Hadoop Cloudera**. Une **nomenclature existante** sur les noms d’applications permettait déjà de déduire certaines caractéristiques clés (environnement : dev, recette, prod, pays de déploiement, etc.), mais elle n'était ni strictement respectée, ni pleinement exploitable sans un traitement intelligent.

## Mon rôle

J’ai travaillé en **autonomie**, accompagné d’un architecte SI pour le cadrage et les validations métier. Mon rôle couvrait l’ensemble du projet :
- Conception de l’approche algorithmique.
- Développement des traitements de classification.
- Intégration dans le SI existant.
- Modélisation et alimentation du référentiel d’architecture d’entreprise.

## Approche technique

### Classification semi-supervisée

Un premier essai avec du **machine learning non supervisé (NLP avec NLTK)** n’a pas donné de bons résultats : les patterns dans les noms n’étaient pas assez clairs pour l’algorithme seul.  
J’ai donc mis en place une **approche semi-supervisée** basée sur :
- **Des règles métiers explicites** (extraction de tags à partir des noms).
- Un moteur de matching pour les cas flous.
- Un système de validation progressive (cf. PDF fourni).

Cette approche a permis d’atteindre **98 % de classification automatique fiable**, avec seulement une minorité de cas nécessitant un contrôle manuel.

### Données et traitements

- **Source** : base contenant la liste des applications.
- **Traitement initial** : POC avec **Pentaho** (ETL open source).
- **Industrialisation** : traitement en **Python** (Pandas, Scikit-learn, NLTK).
- **Automatisation** : batch quotidien sur l’environnement Hadoop.
- **Stockage** : ingestion dans **Hive**, mise à disposition pour les autres outils.

## Modélisation & architecture

Le résultat de la classification a été utilisé pour enrichir le **référentiel TOGAF / Archimate** :

- Modélisation des différents types d’applicatifs et de leurs couches techniques.
- Intégration dans **Sparx Enterprise Architect**.
- Création de **dashboards d’architecture** à partir des tags générés automatiquement.

Cette cartographie a ensuite été utilisée dans une optique stratégique :
- **Suivi des moteurs de versions**.
- **Identification des applications obsolètes**.
- Mise en conformité avec les standards d’architecture internes.

## Organisation

- Projet mené en **autonomie technique**, avec des points réguliers avec un architecte SI.
- Collaboration directe avec les équipes **architecture d’entreprise** et **gouvernance IT**.

## Résultats

- Plus de **200 environnements applicatifs classifiés** automatiquement.
- Référentiel mis à jour automatiquement, exploité dans les outils d’architecture.
- Gain en **fiabilité, maintenabilité et traçabilité** des environnements applicatifs.
- Réutilisation possible de l’approche dans d’autres entités du groupe.

## Ce que j’ai appris

- Conception et mise en œuvre d’une **approche semi-supervisée peu courante** (règles + NLP).
- Industrialisation de traitements Python sur un environnement **on-premise**.
- Travail structuré autour de **TOGAF, Archimate et Sparx EA**, avec une vraie compréhension des enjeux d’architecture SI.
- Prise en main d’outils BI et ETL (Pentaho, Hive) dans un contexte concret de gouvernance.

## Bonnes pratiques réutilisables

- Approche hybride règle + ML pour les systèmes à nomenclature floue.
- Valorisation automatique de la donnée dans les outils d’architecture (Sparx).
- Structuration d’un projet de data engineering avec une forte portée fonctionnelle.