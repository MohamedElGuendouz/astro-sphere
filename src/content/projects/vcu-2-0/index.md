---
title: "Vue client unifiée 2.0"
description: "Révolutionner le Traitement de Données : Le Passage à une Architecture Data Processing as a Service (DPaaS) sur GCP pour France Télévisions, dans le cadre des initiatives stratégiques liées aux JO 2024."
date: 2024-01-01
summary: "Refonte complète du système de ciblage chez France Télévisions : migration d'un outil PHP limité vers une solution scalable sur GCP, avec un traitement parallèle des données en temps réel et une gestion automatisée des clusters Dataproc."
tags: ["GCP", "Dataproc", "Cloud Functions", "Data Engineering", "PySpark", "Data Processing", "Google Cloud Storage", "Architecture Cloud", "Automation", "Scaling"]
---

## Introduction

Avec l’approche des Jeux Olympiques, France Télévisions s’est retrouvée face à un défi technique majeur : absorber un volume massif de demandes de traitement de données tout en maintenant une réactivité optimale. L’outil interne VCPU, initialement développé en PHP pour générer des ciblages basés sur des données sources stockées dans le Lakehouse, montrait ses limites.  

Pour répondre à cette montée en charge tout en garantissant une flexibilité accrue, **j’ai été mandaté pour repenser l’architecture existante et proposer une solution basée sur Google Cloud Platform (GCP)**. C’est ainsi qu’est née une solution novatrice : **Data Processing as a Service (DPaaS)**.

## Problématique : Les Limites du VCPU

Le VCPU permettait de définir des ciblages personnalisés via une interface utilisateur composée de listes déroulantes, de menus contextuels et de paramètres configurables. Cependant, le système présentait des contraintes techniques importantes :

- **Capacité limitée :** Traitement de seulement **quatre ciblages toutes les 15 minutes**, chaque ciblage prenant 15 minutes à exécuter.
- **Absence de scalabilité :** L’architecture PHP ne permettait pas de traiter plus de quatre ciblages en parallèle, ce qui devenait critique à l’approche des Jeux Olympiques, période durant laquelle le volume de ciblages allait considérablement augmenter.
- **Temps de traitement élevé :** Pour des ciblages complexes, le temps de traitement pouvait excéder 15 minutes, ce qui n’était plus viable avec l’accroissement des demandes.

## Analyse des Besoins

Pour structurer la réflexion autour de la solution à mettre en place, **j’ai organisé plusieurs ateliers de cadrage avec le directeur technique et l’architecte de France Télévisions** afin d’identifier les besoins suivants :

- **Scalabilité dynamique :** Capacité à traiter des centaines de ciblages en parallèle, quel que soit le volume des demandes.
- **Réactivité accrue :** Réduire le temps de traitement à **moins de 3 minutes** par ciblage, même pour les cas complexes.
- **Flexibilité opérationnelle :** Créer des instances de traitement à la demande pour éviter tout goulot d’étranglement.
- **Stockage structuré des résultats :** Mettre en place une structure de stockage par ciblage afin de faciliter l’accès aux données depuis l’interface VCPU.

## Solution Proposée : Data Processing as a Service (DPaaS) sur GCP

### Concept et Architecture

L’approche DPaaS repose sur une infrastructure cloud scalable et distribuée, exploitant pleinement les services de **Google Cloud Platform (GCP)**.

1. **Gestion des demandes via Pub/Sub :**  
   - Chaque demande de ciblage est envoyée dans une file d’attente **Google Pub/Sub**, permettant de gérer les flux de données de manière asynchrone.

2. **Orchestration via Cloud Function :**  
   - Une **Cloud Function** est déclenchée par chaque message dans Pub/Sub.  
   - La Cloud Function est responsable de la création dynamique d’un cluster **Dataproc** pour chaque demande.  
   - Elle exécute ensuite le workflow PySpark en tant qu’instance distincte.  
   - Une fois le traitement terminé, la Cloud Function s’occupe également de la **suppression automatique du cluster Dataproc**, minimisant ainsi les coûts.

3. **Traitement des données avec PySpark sur Dataproc :**  
   - Le traitement des données est effectué par une application PySpark, conçue pour interpréter les ciblages, exécuter les calculs nécessaires et générer les résultats.  
   - Chaque instance PySpark est indépendante, ce qui permet une exécution massive en parallèle.

4. **Stockage structuré des résultats dans Google Cloud Storage (GCS) :**  
   - Les résultats des traitements sont centralisés dans un **bucket GCS dédié**, structuré par ciblage.  
   - L’arborescence est conçue de manière à faciliter l’accès aux résultats depuis l’interface du VCPU :  
     - `gs://vcu-bucket/{ciblage_id}/XXX.csv`  
     - `gs://vcu-bucket/{ciblage_id}/XXX.csv`  
     - `gs://vcu-bucket/{ciblage_id}/XXX.csv`  
   - Cette structuration permet une récupération des résultats simplifiée et rapide par l’interface VCPU, tout en maintenant une organisation logique des données.

### Complexité Métier et Automatisation de l'Interprétation des Ciblages

L’une des principales difficultés rencontrées dans ce projet était la gestion des **règles métiers complexes** qui sous-tendaient chaque ciblage. L’intelligence du traitement reposait sur des règles très spécifiques, qui devaient être implémentées de manière **générique** pour garantir une adaptation à l’ensemble des types de ciblages.

De plus, il a fallu automatiser un **travail complexe d’interprétation des ciblages** afin de sélectionner la bonne ressource, la bonne colonne et le bon filtre pour chaque demande, garantissant ainsi que le résultat produit réponde exactement aux attentes des utilisateurs. Ce travail d’automatisation a été facilité par un **référentiel utilisateurs** développé précédemment dans le projet. Ce référentiel a permis de cartographier précisément les besoins des utilisateurs et d’assurer une interprétation fiable et rapide des ciblages, tout en offrant la flexibilité nécessaire pour traiter des demandes variées.

### Technologies Utilisées :

- **Google Pub/Sub :** Gestion asynchrone des demandes et ordonnancement des traitements.
- **Cloud Function :** Orchestration du workflow, gestion des clusters Dataproc et suppression des ressources à la fin du traitement.
- **PySpark :** Traitement des données massivement parallélisé et génération des résultats de ciblage.
- **Google Dataproc :** Création et destruction dynamique des clusters de traitement PySpark.
- **Cloud Storage (GCS) :** Stockage structuré des résultats par ciblage, accessible par le VCPU.

## Résultats Obtenus : Un Gain de Performance Exceptionnel

## Résultats et Gains Obtenus

| Critère                      | Avant la Solution                         | Après la Solution                               | Gain Observé                          |
|------------------------------|-------------------------------------------|------------------------------------------------|---------------------------------------|
| **Nombre de ciblages traités**| 4 ciblages toutes les 15 minutes          | Jusqu'à 300 ciblages quotidiens traités simultanément | Multiplication par 75                |
| **Temps de traitement**      | 15 minutes par ciblage                    | Moins de 3 minutes par ciblage (même pour les plus complexes) | Réduction de 12 minutes par ciblage   |
| **Capacité de traitement parallèle** | Limité à 4 ciblages en parallèle        | Ciblages traités en masse, centaines de ciblages en parallèle | Scalabilité améliorée                |
| **Temps d'attente pour les utilisateurs** | 15 minutes pour chaque ciblage         | 3 minutes maximum, même pour les plus complexes | Réduction drastique du temps d'attente |
| **Coût d'infrastructure**    | Coût fixe, indépendamment de la demande   | Coût optimisé avec création et suppression dynamique des clusters | Réduction des coûts d'infrastructure |
| **Gestion des données**      | Stockage non structuré et difficile d’accès | Structuration par ciblage dans Google Cloud Storage | Meilleure organisation et accès rapide |
| **Complexité de l’architecture** | Solution statique, difficile à étendre   | Solution flexible et scalable avec Cloud Function et Dataproc | Amélioration de la flexibilité et de l'évolutivité |

## Conclusion : Un Modèle Réplicable pour le Futur

L’approche **Data Processing as a Service (DPaaS)** basée sur **Google Cloud Platform** a non seulement permis de répondre efficacement aux enjeux des Jeux Olympiques, mais elle a également posé les bases d’une infrastructure évolutive et résiliente pour le futur.

En intégrant une **Cloud Function** pour orchestrer le lancement des clusters Dataproc, le traitement PySpark et la gestion des ressources, et en structurant le stockage des résultats dans **Google Cloud Storage**, France Télévisions a réussi à passer d’un traitement séquentiel et limité à un traitement massivement parallèle, garantissant ainsi une performance et une réactivité inégalées.

Cette architecture pourrait désormais être étendue à d’autres types de traitements, renforçant ainsi la capacité globale de France Télévisions à absorber des pics de charge sans compromis sur la qualité des services.
