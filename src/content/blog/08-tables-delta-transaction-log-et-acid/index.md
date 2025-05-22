---
title: "Plongée dans les journaux de transactions des tables Delta et les propriétés ACID"
date: 2024-07-30
summary: "Une exploration technique des journaux de transactions des tables Delta, détaillant leur structure, leur rôle dans la garantie des propriétés ACID, le contrôle de la concurrence et les implications sur les performances."
tags: ["Delta Lake", "Data Engineering"]
---
Delta Lake a révolutionné les architectures de data lake en introduisant une fiabilité et des performances comparables à celles des bases de données traditionnelles. Au cœur de cette transformation se trouve le **journal de transactions**, un composant crucial qui garantit les propriétés **ACID** et permet des fonctionnalités avancées telles que le *time travel*. Cet article propose une exploration approfondie du fonctionnement interne des journaux de transactions des tables Delta, destinée aux data engineers et architectes cherchant une compréhension complète de cette technologie.

## La structure du journal de transactions

Le journal de transactions dans Delta Lake — souvent appelé répertoire `_delta_log` dans le stockage d’une table Delta — est un ensemble ordonné de fichiers JSON. Chaque fichier JSON représente un **commit**, un changement atomique unique sur les données ou les métadonnées de la table. Ces commits sont numérotés séquentiellement (`0.json`, `1.json`, etc.).

Dans chaque fichier JSON, on trouve un tableau d’actions représentant les opérations effectuées :

- `add` : ajoute un nouveau fichier de données.
- `remove` : supprime un fichier (après un `UPDATE`, `DELETE`, etc.).
- `metadata` : met à jour le schéma, les colonnes de partition, etc.
- `protocol` : spécifie la version minimale requise pour lire/écrire.
- `commitInfo` : métadonnées du commit (horodatage, utilisateur...).

### Exemple simplifié (`0.json`) :

```json
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
```

Ce commit initial représente la création d'une table Delta avec un schéma simple. Les commits suivants refléteront les ajouts de données, les mises à jour et autres modifications.

## Garantie des propriétés ACID

Le journal de transactions est fondamental pour assurer les propriétés **ACID** :

### Atomicité

Chaque transaction est indivisible : elle réussit ou elle échoue entièrement.

> *Mécanisme* : si une écriture échoue, aucun commit n’est écrit. Les lecteurs ne voient que des transactions complètes.

### Cohérence

Chaque transaction amène la table d’un état valide à un autre, en respectant les règles du schéma.

> *Mécanisme* : un commit invalide est rejeté automatiquement.

### Isolation

Les transactions concurrentes ne s’interfèrent pas.

> *Mécanisme* : Delta Lake utilise le **contrôle de concurrence optimiste**. En cas de conflit, un seul commit passe, les autres sont rejetés (à retenter).

### Durabilité

Une fois le commit écrit, il est permanent, même en cas de crash.

> *Mécanisme* : le journal est stocké de façon persistante (S3, Azure Blob, etc.) et chaque fichier est immuable.

## Time Travel et versioning des données

Grâce au journal :

- **Audit** : vous pouvez retracer l’historique complet.
- **Reproductibilité** : relancer une analyse à une version précise.
- **Correction** : revenir à une version antérieure si besoin.

### Exemple PySpark :

```python
version_df = spark.read.format("delta").option("versionAsOf", 2).load("/path/to/delta_table")
```

## Performances et optimisation

Le journal de transactions apporte robustesse, mais peut introduire une surcharge. Delta Lake propose plusieurs optimisations :

- **Checkpointing** : snapshots réguliers du journal en `.checkpoint.parquet`.
- **Compaction** : la commande `OPTIMIZE` fusionne les petits fichiers.
- **Data Skipping** : statistiques (min/max, bloom filters) pour ignorer les fichiers non pertinents.

## Comparaison rapide avec Iceberg et Hudi

| Moteur     | Points clés |
|------------|-------------|
| **Iceberg** | Utilise des *manifests* pour suivre les snapshots. Très adapté au branching et à la gestion avancée de versions. |
| **Hudi**    | Gère inserts/updates avec deux modes : *Copy-on-Write* et *Merge-on-Read*. |
| **Delta Lake** | Privilégie la simplicité, une forte intégration Spark et des garanties ACID strictes. |

---

En maîtrisant les **journaux de transactions Delta Lake**, vous accédez à un niveau de contrôle, de traçabilité et de performance qui rapproche les data lakes des bases de données transactionnelles traditionnelles.
