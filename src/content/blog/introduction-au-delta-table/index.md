---
title: Introduction au Delta Table
date: 2023-10-27
---

## Introduction

Delta Lake est un framework de stockage open source qui apporte la fiabilité aux data lakes. Il fournit des transactions ACID, une gestion évolutive des métadonnées et un traitement unifié des données par lots et en streaming. Au cœur de Delta Lake se trouve le Delta Table, un format de table qui améliore les tables de données traditionnelles avec des fonctionnalités telles que le versioning, le rollback et l'application du schéma.

## Concepts clés de Delta Lake et des tables Delta

### Transactions ACID

Les tables Delta prennent en charge les transactions ACID (Atomicité, Cohérence, Isolation, Durabilité), garantissant que les opérations de données sont fiables et que les lecteurs ne voient jamais de données incohérentes.

### Versioning et Rollback

Chaque opération sur une table Delta crée une nouvelle version de la table. Cela permet de revenir à des versions antérieures des données si nécessaire, offrant ainsi une piste d'audit et la possibilité d'annuler des modifications.

### Application du schéma

Delta Lake permet d'appliquer un schéma aux tables de données, empêchant ainsi l'insertion de données non conformes et améliorant la qualité des données.

### Traitement unifié par lots et en streaming

Les tables Delta peuvent être utilisées à la fois pour le traitement par lots et en streaming, simplifiant ainsi les pipelines de données et réduisant la complexité.