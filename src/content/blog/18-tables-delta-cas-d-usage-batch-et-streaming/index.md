---
title: "Delta Tables : Cas d’usage en traitement batch et streaming"
date: 2025-01-09
summary: "Découvrez des cas d’usage concrets des Delta Tables en traitement batch et streaming, avec des exemples pratiques et du code."
tags: ["Delta Lake", "Data Engineering"]
---
Grâce à leurs propriétés ACID et leur support natif du batch comme du streaming, les Delta Tables offrent une solution polyvalente pour de nombreux scénarios de traitement de données. Cet article explore des cas d’usage pratiques dans les deux contextes, illustrés par du code et des exemples concrets.

## Cas d’usage en traitement batch

Les Delta Tables brillent dans les pipelines batch pour le data warehousing, l’ETL, l’analyse, et la préparation des données.

### Data Warehousing et pipelines ETL

Delta Tables constituent une base robuste pour un data warehouse, avec gestion de schéma évolutif et transactions ACID intégrées.

**Exemple (PySpark) :**
```python
from pyspark.sql.functions import *
from pyspark.sql.types import *

input_schema = StructType([
    StructField("user_id", IntegerType(), True),
    StructField("event_time", TimestampType(), True),
    StructField("event_type", StringType(), True),
    StructField("payload", StringType(), True)
])

raw_data = spark.read.schema(input_schema).parquet("/path/to/raw/events")

transformed_data = raw_data.withColumn("processed_time", current_timestamp()) \
    .filter(col("event_type").isin("login", "logout")) \
    .select("user_id", "event_time", "event_type", "processed_time")

transformed_data.write.format("delta").mode("append").save("/path/to/delta/events")

delta_events = spark.read.format("delta").load("/path/to/delta/events")
delta_events.groupBy("event_type").count().show()
```

### Data Lake Management et qualité des données

Avec les Delta Tables, vous pouvez appliquer des règles strictes sur les schémas et garantir l'intégrité des données.

**Exemple (Scala) :**
```scala
import io.delta.tables._
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._

val schema = StructType(Array(
  StructField("product_id", IntegerType, false),
  StructField("name", StringType, true),
  StructField("price", DoubleType, true)
))

spark.emptyDataFrame(schema)
  .write
  .format("delta")
  .mode("overwrite")
  .option("dataChange", "false")
  .save("/path/to/delta/products")

val deltaTable = DeltaTable.forPath(spark, "/path/to/delta/products")

deltaTable.update()
  .withColumn("price", expr("IF(price >= 0, price, NULL)"))
  .execute()
```

### Feature Engineering et préparation des données pour ML

Les Delta Tables permettent de versionner et de tracer les datasets utilisés pour l'entraînement des modèles ML.

**Exemple (PySpark) :**
```python
from pyspark.sql.functions import *
from pyspark.ml.feature import StringIndexer
from pyspark.ml.linalg import Vectors
from pyspark.ml.regression import LinearRegression

data = spark.read.format("delta").load("/path/to/delta/training_data")

indexer = StringIndexer(inputCol="category", outputCol="categoryIndex")
indexed_data = indexer.fit(data).transform(data)

feature_cols = ["feature1", "feature2", "categoryIndex"]
feature_vector = udf(lambda features: Vectors.dense(features), VectorUDT())
feature_data = indexed_data.withColumn("features", feature_vector(array(*feature_cols))) \
    .select("features", "label")

(training_data, test_data) = feature_data.randomSplit([0.8, 0.2], seed=42)

lr = LinearRegression(featuresCol="features", labelCol="label")
model = lr.fit(training_data)
predictions = model.transform(test_data)

feature_data.write.format("delta").mode("overwrite").save("/path/to/delta/prepared_training_data")
```

### Analyse historique et reporting

Grâce au **Time Travel**, les Delta Tables permettent d’interroger l’état passé des données.

**Exemple (SQL) :**
```sql
SELECT * FROM delta.`/path/to/delta/table` VERSION AS OF 5;
SELECT * FROM delta.`/path/to/delta/table` TIMESTAMP AS OF '2023-10-27 10:00:00';

CREATE OR REPLACE TEMP VIEW historical_data AS
SELECT * FROM delta.`/path/to/delta/sales_data` VERSION AS OF 10;

SELECT date, SUM(amount) as total_sales
FROM historical_data
GROUP BY date
ORDER BY date;
```

## Cas d’usage en traitement streaming

Delta Tables s’intègrent naturellement aux frameworks de streaming comme Spark Structured Streaming.

### Pipelines temps réel et applications de stream processing

Delta peut être utilisé comme **sink** ou **source** fiable dans des applications de streaming.

**Exemple (PySpark Structured Streaming) :**
```python
stream_schema = StructType([
    StructField("user_id", IntegerType(), True),
    StructField("timestamp", TimestampType(), True),
    StructField("action", StringType(), True),
    StructField("resource", StringType(), True)
])

stream_df = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "your_kafka_brokers") \
    .option("subscribe", "your_topic") \
    .load() \
    .select(from_json(col("value").cast("string"), stream_schema).alias("data")) \
    .select("data.*")

processed_stream = stream_df.groupBy("user_id") \
    .agg(count("*").alias("event_count")) \
    .select("user_id", "event_count", current_timestamp().alias("processed_time"))

query = processed_stream.writeStream.format("delta") \
    .outputMode("update") \
    .option("checkpointLocation", "/path/to/checkpoint") \
    .start("/path/to/delta/user_activity")
```

### CDC (Change Data Capture) et synchronisation

Delta facilite l’implémentation de CDC avec des opérations `MERGE`.

**Exemple (PySpark) :**
```python
source_df = spark.read.format("delta").load("/path/to/source_table")
destination_df = spark.read.format("delta").load("/path/to/destination_table")

deltaTable = DeltaTable.forPath(spark, "/path/to/destination_table")

deltaTable.alias("destination") \
    .merge(
        source_df.alias("source"),
        "destination.id = source.id"
    ) \
    .whenMatchedUpdateAll() \
    .whenNotMatchedInsertAll() \
    .execute()
```

### Agrégations continues et vues matérialisées

Delta peut stocker les résultats d’agrégations temps réel pour les dashboards.

**Exemple :**
```python
aggregated_data = input_stream.groupBy("window", "category") \
    .agg(sum("value").alias("total_value")) \
    .select("window", "category", "total_value")

query = aggregated_data.writeStream.format("delta") \
    .outputMode("complete") \
    .partitionBy("category") \
    .option("checkpointLocation", "/path/to/checkpoint_agg") \
    .start("/path/to/delta/aggregated_data")
```

### Monitoring et analytics en temps réel

**Exemple de boucle pour dashboard :**
```python
while True:
    df = spark.read.format("delta").load("/path/to/delta/processed_events") \
        .groupBy("action").count().toPandas()

    plt.figure(figsize=(8, 6))
    plt.bar(df["action"], df["count"])
    plt.xlabel("Action")
    plt.ylabel("Count")
    plt.title("Real-Time Event Counts")
    plt.pause(1)
    plt.clf()
```

## Avantages des Delta Tables pour batch et streaming

* **Traitement unifié** : même couche de stockage pour batch et streaming
* **Fiabilité et cohérence** : grâce aux propriétés ACID
* **Qualité et gouvernance des données** : schéma strict, contraintes, versioning
* **Support des pipelines complexes** : transformations avancées, CDC, etc.
* **Analytique temps réel** : lecture efficace en streaming

## Comparaison batch vs streaming

| Fonctionnalité       | Batch Processing                    | Streaming Processing                    |
|----------------------|-------------------------------------|------------------------------------------|
| Source               | Fichiers, bases de données          | Kafka, Kinesis, etc.                     |
| Mode de traitement   | Append / Overwrite                  | Append / Update                          |
| Écriture             | Données écrites en une fois         | Incrémental en continu                   |
| Lecture              | Version entière ou historique       | Données en cours ou vues matérialisées   |
| Latence              | Élevée                              | Faible / temps réel                      |

## Bonnes pratiques

### Pour le batch :

* **Partitionnement** adapté
* **Z-Ordering** sur colonnes filtrées fréquemment
* **Compaction** régulière
* **Caching** des résultats intermédiaires

### Pour le streaming :

* **Checkpointing** activé pour reprise après échec
* **Output Mode** bien choisi (append/update/complete)
* **Watermarking** pour données en retard
* **Backpressure** surveillé et géré

## Conclusion

Les Delta Tables offrent une approche unifiée, fiable et performante pour le traitement batch et streaming. En comprenant les cas d’usage spécifiques à chaque mode et en appliquant les bonnes pratiques, les data engineers peuvent construire des pipelines robustes, scalables et optimisés. Les exemples partagés ici constituent une base solide pour tirer parti de Delta Lake dans tous vos traitements de données.
