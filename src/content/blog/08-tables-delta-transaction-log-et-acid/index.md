---
title: "Plongée dans les journaux de transactions des tables Delta et les propriétés ACID"
date: 2024-07-26
summary: "Une exploration technique des journaux de transactions des tables Delta, détaillant leur structure, leur rôle dans la garantie des propriétés ACID, le contrôle de la concurrence et les implications sur les performances."
tags: ["Delta Lake", "Journal de transactions", "ACID", "Concurrence", "Ingénierie des données"]
---


Plongée dans les journaux de transactions des tables Delta et les propriétés ACID

Delta Lake a révolutionné les architectures de data lake en introduisant une fiabilité et des performances comparables à celles des bases de données traditionnelles. Au cœur de cette transformation se trouve le journal de transactions, un composant crucial qui garantit les propriétés ACID et permet des fonctionnalités avancées telles que le time travel. Cet article propose une exploration approfondie du fonctionnement interne des journaux de transactions des tables Delta, destinée aux data engineers et architectes cherchant une compréhension complète de cette technologie.

La structure du journal de transactions

Le journal de transactions dans Delta Lake, souvent appelé répertoire _delta_log au sein de l'emplacement de stockage d'une table Delta, est un ensemble ordonné de fichiers JSON. Chaque fichier JSON représente un commit, un changement atomique unique sur les données ou les métadonnées de la table. Ces commits sont numérotés séquentiellement, en commençant par 0.json, 1.json, et ainsi de suite.

Dans chaque fichier JSON, on trouve un tableau d'actions, représentant des opérations spécifiques effectuées dans ce commit. Ces actions peuvent inclure :

add : Ajoute un nouveau fichier de données à la table.

remove : Supprime un fichier de données de la table (par exemple, suite à une mise à jour ou une suppression).

metadata : Met à jour les métadonnées de la table (par exemple, le schéma, le partitionnement).

protocol : Spécifie la version du protocole Delta Lake requise pour lire ou écrire dans la table.

commitInfo : Contient des informations sur le commit lui-même (par exemple, horodatage, utilisateur).

Voici un exemple simplifié d'une entrée de journal de transactions (0.json) :

{
  "commitInfo": {
    "timestamp": 1678886400000,
    "operation": "CREATE TABLE",
    "userName": "john.doe"
  },
  "protocol": {
    "minReaderVersion": 1,
    "minWriterVersion": 2
  },
  "metadata": {
    "schemaString": "{\"type\":\"struct\",\"fields\":[{\"name\":\"id\",\"type\":\"integer\",\"nullable\":false,\"metadata\":{}},{\"name\":\"value\",\"type\":\"string\",\"nullable\":true,\"metadata\":{}}]}",
    "partitionColumns": [],
    "configuration": {},
    "createdTime": 1678886400000
  }
}

Ce commit initial représente la création d'une table Delta avec un schéma simple. Les commits suivants refléteront les ajouts de données, les mises à jour et autres modifications.

Garantie des propriétés ACID

Le journal de transactions joue un rôle essentiel dans l'application des propriétés ACID qui garantissent la fiabilité des données :

Atomicité

Chaque transaction est traitée comme une unité indivisible : soit elle est entièrement appliquée, soit elle ne l’est pas.

Mécanisme : Si une écriture échoue, aucun commit n’est écrit. Les lecteurs ne voient que des transactions complètes.

Cohérence :

Une transaction amène les données d’un état valide à un autre, selon les règles définies par les métadonnées de la table (schéma, partitions, etc).

Mécanisme : Un commit doit respecter les contraintes de cohérence du schéma. Toute tentative invalide échoue.

Isolation

Les transactions concurrentes n’interfèrent pas entre elles.

Mécanisme : Delta Lake utilise le contrôle de concurrence optimiste : les conflits sont détectés avant validation.

Exemple : Si deux utilisateurs modifient les mêmes données, un seul commit réussira, l’autre devra être retenté.

Durabilité

Une fois qu’un commit est écrit dans le journal, il est permanent, même en cas de panne.

Mécanisme : Le journal est durablement stocké (S3, Azure Blob, etc.) et chaque commit est immuable.

Time Travel et versioning des données

Grâce à son journal, Delta Lake permet :

Audit : retracer l’historique des changements.

Reproductibilité : relancer des calculs à une version précise.

Correction : revenir à une version antérieure.

Exemple en PySpark :

version_df = spark.read.format("delta").option("versionAsOf", 2).load("/path/to/delta_table")

Performances et optimisation

Les journaux de transactions offrent robustesse mais peuvent ralentir les lectures ou écritures intensives. Pour y remédier, Delta Lake propose :

Checkpointing : snapshots réguliers du journal en fichiers .checkpoint.parquet.

Compaction : la commande OPTIMIZE réduit le nombre de petits fichiers.

Data Skipping : grâce aux statistiques stockées dans le journal (min/max, bloom filters).

Comparaison rapide avec Iceberg et Hudi

Iceberg : utilise des fichiers manifest pour suivre les snapshots. Plus adapté au branching et à la gestion fine de version.

Hudi : optimise les opérations d’insert/update avec différents modes (Copy-on-Write, Merge-on-Read).

Delta Lake : mise sur la simplicité d’usage, l’intégration Spark native et des garanties ACID solides.