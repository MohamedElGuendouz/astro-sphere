---
title: "Cotation véhicule LLD : un outil d'aide à la décision performant"
description: "Création d'une plateforme d'estimation de la valeur des véhicules en LLD, utilisée pour la vente et les campagnes marketing."
date: 2021-10-01
summary: "Développement d’une plateforme de cotation LLD multi-pays, basée sur Spark, pour optimiser la revente de véhicules et améliorer les marges commerciales de Stellantis."
tags: ["On-Premise", "Spark", "Java", "Data Engineering", "Data Architecture"]
---
## Contexte

Dans le cadre de ses activités en location longue durée (LLD), Stellantis a lancé un projet de création d’une plateforme destinée à optimiser les propositions de vente de véhicules. L’objectif principal était d’**améliorer les marges sur les ventes** en déterminant le bon moment pour revendre chaque voiture, en fonction de sa valeur marchande estimée.

La plateforme, développée **from scratch**, était pensée pour être utilisée par les équipes internes, avec un objectif clair : fournir aux concessionnaires du groupe des recommandations fiables, à grande échelle, sur les véhicules à proposer à la revente.

## Mon rôle

J’ai été **Data Engineer** sur ce projet, avec un rôle à la fois **technique et fonctionnel** :

- Conception et développement des pipelines de traitement.
- Animation des échanges entre les équipes techniques et métiers.
- Suivi global du projet (coordination, planification, suivi des deadlines).
- Animation des rituels agiles.

Nous étions 5 personnes dans l’équipe (data, produit, dev) et j’intervenais comme **lead technique et chef de projet technico-fonctionnel**.

## Approche technique

### Architecture et contraintes

Le système devait s’exécuter de manière **asynchrone tous les 3 mois**, avec des workflows distincts par pays (France, Allemagne, Espagne), chacun ayant ses propres contraintes de calendrier.  
Une partie du calcul des cotations était externalisée auprès d’un **partenaire externe**, avec lequel nous échangions des fichiers via FTP.

Le traitement des données se faisait sur un environnement **on-premise (Cloudera)**, avec orchestration via **crontab**.

### Traitement des données

- Les données étaient stockées en **Parquet sur HDFS**, puis traitées avec **Spark en batch**.
- Les **pipelines Spark** étaient conçus à l’aide d’un **framework interne** basé sur des fichiers YAML (configurations et dépendances).
- Les tâches couvraient toute la chaîne : **ingestion, standardisation, transformation, agrégation**.
- Une **règle métier** permettait ensuite de segmenter les résultats pour identifier les véhicules à proposer à la vente.

Les résultats étaient exposés dans **Hive**, pour une exploitation par les équipes internes.

### Outils et stack

- Spark, Hive, HDFS (Cloudera)
- Kafka (pour d’autres flux de données)
- Ranger, Yarn, Elasticsearch, Kibana
- Git + TeamCity pour la CI
- FTP sécurisé pour les échanges externes

## Fonctionnalités & livrables

- Mise en place de **pipelines complets** depuis l’ingestion jusqu’à l’exposition des données prêtes à l’usage.
- Automatisation des traitements pour chaque pays, avec logique de découplage et de planification.
- Traitement en **batch différé** (aucun temps réel).
- Intégration complète avec l’écosystème data interne et le partenaire de cotation.

## Impacts et résultats

- **Gain de temps et d’efficacité** dans le traitement des véhicules à revendre.
- Meilleure identification des fenêtres de revente selon la valeur estimée.
- Alignement entre les calculs techniques et les contraintes métiers.

## Ce que j’ai appris

- Approfondissement de Spark, Hive et des outils CI comme TeamCity.
- Travail sur un projet **à fort impact métier**, avec des enjeux économiques directs.
- Coordination avec un partenaire externe (intégration, timing, sécurité).
- Prise en main d’une **approche agile** dans un contexte industriel.

## Bonnes pratiques réutilisables

- Standardisation des flux de données pour faciliter la maintenance.
- Structuration de pipelines évolutifs via configuration (YAML).
- Capacité à adapter l’agilité à un projet avec des échéances fixes et des dépendances externes.