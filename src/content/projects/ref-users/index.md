---
title: "Référentiel utilisateur"
description: "Conception et déploiement d’une architecture data cloud sur GCP pour la personnalisation avancée des parcours utilisateurs, dans le cadre des initiatives stratégiques liées aux JO 2024."
date: 2024-01-01
summary: "Refonte complète du traitement des données utilisateur chez France Télévisions : création d’un référentiel structuré, automatisé et interopérable pour répondre aux enjeux CRM et aux besoins de ciblage stratégique."
tags: ["GCP", "Delta Lake", "Infrastructure as Code", "Airflow", "PySpark", "Data Engineering", "Data Architecture"]
---
### Contexte du projet
Ce projet est né au sein du **département numérique** de France Télévisions, à un moment **charnière** où il fallait repenser la gestion des données utilisateur. L’équipe **Lakehouse**, jusqu’alors en charge de l’**ingestion**, ne pouvait plus assurer les **traitements métiers avancés**. Par manque d’expertise métier et de bande passante, ces traitements devenaient difficiles à maintenir et manquaient de cohérence globale.

Lors de l'**audit** des traitements à migrer, j'ai constaté un **manque de structure** : certains **indicateurs** étaient stockés seuls dans des tables isolées, d'autres ajoutés de manière opportuniste sans vision d'ensemble. L'équipe ne disposait ni de l'expertise métier, ni de la bande passante suffisantes. Les traitements devenaient donc difficiles à maintenir et manquaient de cohérence globale. Par conséquent, des **incohérences** apparaissaient lorsque les indicateurs étaient croisés, générant ainsi de la confusion au niveau métier, notamment pour le **CRM**.

Plutôt que de simplement migrer les traitements existants, j’ai proposé une **refonte complète**. L’idée était de créer un **référentiel utilisateur centralisé**, structuré par thématiques métiers (ex : consommation, navigation, segmentation) et organisé autour de l’identifiant utilisateur.
Cette **démarche** a été cadrée avec le **PO** et le data steward, puis validée par le directeur technique du département **data** de la direction numérique. Le projet a été officiellement lancé, avec des enjeux clés liés à l’évolution de la stratégie **Data** et à la préparation des Jeux Olympiques (prévue six mois plus tard).

### Objectifs du projet

- Reprendre la **maîtrise** sur les données envoyées au **CRM** (client principal)
- Supprimer une **dette technique importante** en repensant l’organisation des traitements
- Créer une architecture de données **claire**, maintenable et évolutive
- Répondre aux enjeux **stratégiques** dans des délais courts

### Mon rôle et mes responsabilités

J'ai débuté en tant que **Data Engineer**, puis j'ai été promu **Data Engineer Lead** à l'arrivée de nouveaux membres dans l'équipe.

Mes responsabilités comprenaient :
- Le **cadrage technique** du projet
- La **définition** de l’architecture du référentiel
- La **mise en œuvre** des pipelines de traitement sur GCP

J’ai collaboré **étroitement** avec le PO, un data steward, l’équipe ingestion (Lakehouse), le client (CRM), un architecte technique, ainsi qu’un nouveau data engineer arrivé en phase de **réalisation**.

### Méthodologie et technologies
  
Initialement, nous avons adopté une organisation **Kanban**. À mesure que l'équipe s'est agrandie, nous avons évolué vers une méthodologie **SCRUM**.
Les technologies utilisées incluaient **PySpark**, **Airflow**, **Delta Tables**, **Terraform**, Google Cloud Pub/Sub et GCP Storage.

La démarche a été itérative, ajustée régulièrement selon les retours du PO et de l’architecte pour affiner l’architecture et valider les choix techniques.

### Réalisations clés

- **Conception** et mise en place d'un référentiel centralisé comprenant une dizaine de tables thématiques, structurées autour des identifiants utilisateurs.
  
Quelques exemples :
  - *Consommation vidéo* (Premier et dernier contenu visionnée, tops catégories et sous-catégories, etc...)
  - *Navigation* (avec des indicateurs comme la fréquence de connexion ou la dernière activité)  
  - *Segmentation* (incluant des indicateurs comme la segmentation RFA : récence, fréquence, ancienneté)

- **Structuration** des tables avec des **clés primaires** adaptées, comme par exemple les identifiants utilisateur couplés avec le type de contenu afin de mesurer les différents contenus visualisés.
- Développement de **pipelines indépendants** pour chaque table (via Airflow), permettant un découpage **logique**, une meilleure maintenabilité et une fréquence de mise à jour ajustée aux besoins (ex : quotidien pour la navigation, mensuel pour la segmentation RFA).

Adoption du format **Delta Tables**, avec à la clé une **réduction significative** des coûts de traitement comparé à BigQuery natif, tout en bénéficiant d’une meilleure performance.

L'organisation des données était auparavant complexe et **peu cohérente**, comme illustré ci-dessous. Après la **refonte**, la structure est plus claire et cohérente.  

![image description](/table_before_ftv.png)
![image description](/table_after_ftv.png)

### Résultats et impacts

- **Référentiel opérationnel**, entièrement exploitable par les **métiers**
- **Alignement renforcé** entre les données techniques et les besoins CRM
- **Réduction de la dette technique** et meilleure lisibilité des indicateurs
- Une plus grande flexibilité pour **intégrer** de nouveaux cas d'usage dans les projets futurs (comme le projet **VCU 2.0** prévu pour les Jeux Olympiques)

### Enseignements et retour personnel
  
- Ce projet a été un **tournant** pour moi. Il m’a permis de :
- Prendre en charge une vision **technique d’envergure**, avec un fort **impact métier**  
- Développer mes compétences en **architecture**, mais aussi en **communication**, notamment pour expliquer clairement ma vision à des interlocuteurs **non techniques**  
- **Approfondir** l’usage des Delta Tables dans un cadre **industriel**
  
Des retours constructifs du PO et de l’architecte ont permis d’affiner la solution progressivement.

Ce projet, **structurant** à plusieurs niveaux, m’a permis de faire mes **preuves** tout en consolidant les fondations d’un **socle data stratégique** pour France Télévisions.
