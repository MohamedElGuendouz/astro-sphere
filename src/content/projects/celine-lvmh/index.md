---
title: "Migration Oracle vers GCP pour Data Warehouse Haute Performance"
description: "Migration d'un entrepôt de données Oracle vers GCP pour répondre à des enjeux de scalabilité et de maintenabilité."
date: 2022-12-01
summary: "Un bref résumé du projet Céline – LVMH."
tags: ["Data Engineering", "Cloud Computing"]
---
## Contexte

Dans le cadre de la modernisation de son environnement data, Céline (LVMH) a lancé un projet de migration de données d’Oracle vers Google Cloud Platform (GCP). L’objectif était de rendre accessible l’historique de plusieurs tables (certaines contenant plusieurs centaines de millions de lignes) dans BigQuery, pour répondre à de nouveaux besoins métiers.

Le projet devait être terminé avant la fin de l’année, avec une migration progressive et temporairement hybride (Oracle on-premises + GCP).

## Mon rôle

J’ai intégré l’équipe data (plus d’une dizaine de personnes) en tant que Data Engineer. J’ai principalement travaillé sur :

- L’ingestion des données historiques (fichiers CSV fournis par des collaborateurs internes, déposés sur Google Cloud Storage).
- La conception des workflows de transformation dans Dataform, en SQLx.
- Le déploiement de l’infrastructure BigQuery via Terraform.

## Ce que j’ai mis en place

### Pipelines SQLx dans Dataform

J’ai conçu les scripts de transformation dans Dataform en SQLx.  
Mes contributions ont porté sur :

- La structuration des workflows de transformation.
- L’écriture de requêtes SQL lisibles, maintenables et adaptées aux volumes.
- L’organisation logique des étapes de traitement et des dépendances entre tables.

### Dataform

J’ai créé les workflows de transformation directement dans l’interface Dataform :

- Écriture des modèles SQL.
- Définition des dépendances.
- Configuration des exécutions planifiées.

### Terraform

J’ai contribué au déploiement de l’infrastructure GCP avec Terraform :

- Création des datasets, tables, et configuration des accès (IAM).
- Intégration dans une CI pour versionner et automatiser les déploiements.

## Résultat

Les données historiques ont été migrées avec succès vers BigQuery.  
Les workflows SQL sont aujourd’hui automatisés, maintenables et utilisés pour alimenter les analyses métiers.

## Ce que j’ai appris

- Conception de pipelines data complets avec Dataform et SQLx.
- Déploiement d’infrastructure cloud avec Terraform.
- Travail dans un contexte technique contraint (accès limité aux bases, coordination avec les équipes internes).