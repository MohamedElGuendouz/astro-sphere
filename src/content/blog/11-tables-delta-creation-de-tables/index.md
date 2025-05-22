---
title: "Créer des tables Delta : Guide complet"
date: 2024-08-20
summary: "Apprenez à créer efficacement des tables Delta grâce à ce guide complet couvrant les différentes méthodes, configurations et bonnes pratiques."
tags: ["Delta Lake", "Data Engineering", "PySpark", "Scala"]
---

# Créer des tables Delta : Guide complet

Les tables Delta sont la base d’un data lake fiable et performant. Ce guide couvre les différentes méthodes de création de tables Delta, leurs configurations possibles, ainsi que les bonnes pratiques à adopter.

## Méthodes pour créer une table Delta

Vous pouvez créer une table Delta de plusieurs façons, selon votre source de données et vos besoins.

### 1. Création à partir de données existantes

Il est possible de créer une table Delta à partir de fichiers existants (Parquet, CSV, etc.).

#### Exemple PySpark :
```python
from pyspark.sql.functions import *
from delta.tables import *

# Lecture depuis Parquet
df = spark.read.parquet("chemin/vers/donnees.parquet")
df.write.format("delta").save("chemin/vers/table_delta")

# Lecture depuis CSV (avec déduction du schéma)
df = spark.read.format("csv").option("header", "true").load("chemin/vers/donnees.csv")
df.write.format("delta").save("chemin/vers/table_delta")
```

#### Exemple Scala :
```scala
import org.apache.spark.sql.SparkSession
import io.delta.tables._

// Lecture depuis Parquet
val df = spark.read.parquet("chemin/vers/donnees.parquet")
df.write.format("delta").save("chemin/vers/table_delta")

// Lecture depuis CSV (avec schéma inféré)
val df = spark.read.format("csv").option("header", "true").load("chemin/vers/donnees.csv")
df.write.format("delta").save("chemin/vers/table_delta")
```

### 2. Création avec un schéma défini

Pour un meilleur contrôle, il est recommandé de définir explicitement le schéma.

#### Exemple PySpark :
```python
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True),
    StructField("value", IntegerType(), True)
])

df = spark.read.format("csv").option("header", "true").schema(schema).load("chemin/vers/donnees.csv")
df.write.format("delta").save("chemin/vers/table_delta")
```

#### Exemple Scala :
```scala
import org.apache.spark.sql.types.{StructType, StructField, StringType, IntegerType}

val schema = StructType(Array(
    StructField("id", IntegerType, true),
    StructField("name", StringType, true),
    StructField("value", IntegerType, true)
))

val df = spark.read.format("csv").option("header", "true").schema(schema).load("chemin/vers/donnees.csv")
df.write.format("delta").save("chemin/vers/table_delta")
```

### 3. Création de tables vides

Vous pouvez créer une table Delta vide avec un schéma prédéfini.

#### Exemple PySpark :
```python
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True),
    StructField("value", IntegerType(), True)
])

empty_rdd = spark.sparkContext.emptyRDD()
df = spark.createDataFrame(empty_rdd, schema)
df.write.format("delta").save("chemin/vers/table_delta_vide")
```

#### Exemple Scala :
```scala
import org.apache.spark.sql.types.{StructType, StructField, StringType, IntegerType}

val schema = StructType(Array(
    StructField("id", IntegerType, true),
    StructField("name", StringType, true),
    StructField("value", IntegerType, true)
))

val emptyRDD = spark.sparkContext.emptyRDD[Row]
val df = spark.createDataFrame(emptyRDD, schema)
df.write.format("delta").save("chemin/vers/table_delta_vide")
```

### 4. Création via SQL

Vous pouvez aussi créer des tables Delta avec du SQL.

#### Exemple PySpark :
```python
spark.sql("""
    CREATE TABLE IF NOT EXISTS ma_table_delta (
        id INT,
        name STRING,
        value INT
    ) USING DELTA LOCATION 'chemin/vers/table_delta'
""")
```

#### Exemple Scala :
```scala
spark.sql("""
    CREATE TABLE IF NOT EXISTS ma_table_delta (
        id INT,
        name STRING,
        value INT
    ) USING DELTA LOCATION 'chemin/vers/table_delta'
""")
```

## Options et configurations

Lors de la création de tables Delta, vous pouvez spécifier plusieurs options pour optimiser les performances.

### Propriétés de table

Les propriétés permettent de configurer des comportements automatiques (optimisation, compactage, etc.).

#### Exemple :
```python
df.write.format("delta") \
    .option("delta.autoOptimize.optimizeWrite", "true") \
    .option("delta.autoOptimize.autoCompact", "true") \
    .save("chemin/vers/table_delta")
```

### Partitionnement

Le partitionnement améliore les performances en filtrant efficacement les données par répertoire.

```python
df.write.format("delta") \
    .partitionBy("colonne_date") \
    .save("chemin/vers/table_partitionnee")
```

Choisissez les colonnes de partition selon les modèles de requêtes et la cardinalité des données.

### Z-Ordering

Le Z-Ordering regroupe les données corrélées dans les mêmes fichiers pour améliorer le *data skipping*.

```python
df.write.format("delta") \
    .partitionBy("colonne_date") \
    .option("dataChange", "false") \
    .save("chemin/vers/table_delta")

DeltaTable.forPath(spark, "chemin/vers/table_delta") \
    .optimize() \
    .where("colonne_date >= '2023-01-01'") \
    .executeCompaction()

DeltaTable.forPath(spark, "chemin/vers/table_delta") \
    .optimize() \
    .zOrder("id") \
    .executeCompaction()
```

### Emplacement

Pour une table gérée, Delta Lake détermine l’emplacement. Pour une table externe, vous devez le spécifier.

#### Exemple (table externe) :
```python
df.write.format("delta") \
    .option("path", "hdfs://chemin/vers/emplacement_externe") \
    .save("chemin/vers/table_delta")
```

### Validation du schéma

Par défaut, Delta Lake impose le respect du schéma. Vous pouvez autoriser l’évolution du schéma avec `mergeSchema`.

```python
df.write.format("delta") \
    .option("mergeSchema", "true") \
    .save("chemin/vers/table_delta")
```

## Bonnes pratiques

* **Choisissez des types de données adaptés** pour améliorer le stockage et les performances.
* **Optimisez votre stratégie de partitionnement** : éviter les partitions trop petites ou trop larges.
* **Activez les propriétés utiles** : `delta.autoOptimize.optimizeWrite`, `autoCompact`, etc.

## Gérer l’évolution du schéma

Utilisez `overwriteSchema = true` pour permettre à la table d’évoluer avec vos données entrantes.

```python
df.write.format("delta") \
    .option("overwriteSchema", "true") \
    .mode("overwrite") \
    .save("chemin/vers/table_delta")
```

## Tables gérées vs. externes

Le fait de spécifier un chemin (`path`) détermine si la table est **externe** (avec chemin) ou **gérée** (sans chemin).

## Conseils de dépannage

* **Erreur "Path already exists"** : le dossier contient déjà une table Delta → changer de chemin ou utiliser `mode("overwrite")`.
* **Erreurs de schéma** : vérifier que les données correspondent bien au schéma, ou activer `mergeSchema`.
* **Problèmes de performance** : revoir le partitionnement et envisager le Z-Ordering.

Ce guide vous offre une vue d’ensemble complète sur la création de tables Delta. En maîtrisant ces techniques, vous pouvez construire un data lake fiable, performant et évolutif.
