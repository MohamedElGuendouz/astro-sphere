---
title: "Optimisation des requêtes Delta Table grâce aux techniques de Data Skipping"
date: 2024-08-02
summary: "Exploration approfondie des techniques de data skipping dans les tables Delta, montrant comment elles améliorent les performances des requêtes en filtrant intelligemment les données non pertinentes."
tags: ["Delta Lake", "Data Engineering"]
---

# Maîtriser le Data Skipping dans les tables Delta : Guide complet

Dans l’univers du big data, où les volumes atteignent fréquemment plusieurs téraoctets voire pétaoctets, les performances des requêtes sont essentielles. Delta Lake, couche de stockage robuste basée sur Apache Spark, utilise des techniques avancées de *data skipping* pour réduire drastiquement le volume de données scanné lors des requêtes, améliorant ainsi les performances et réduisant les coûts. Cet article propose une analyse détaillée du fonctionnement et de l’optimisation de ces techniques.

## La puissance du Data Skipping : pourquoi c’est important

Le *data skipping* est une stratégie d’optimisation des requêtes permettant au moteur d’exécution de sauter entièrement les fichiers ou blocs de données non pertinents par rapport aux filtres de la requête. Plutôt que de tout scanner, le moteur identifie intelligemment les segments qui peuvent être ignorés. Cela réduit considérablement les opérations d’E/S, l’utilisation mémoire, et les cycles CPU, accélérant les temps de réponse.

## L’arsenal de Data Skipping de Delta Lake

Delta Lake utilise plusieurs techniques de *data skipping*, chacune avec ses avantages et limitations. Examinons-les en détail :

### 1. Statistiques Min/Max : filtrage par plage

Les statistiques Min/Max sont la pierre angulaire du *data skipping* dans Delta Lake. Chaque fichier de données contient automatiquement des métadonnées indiquant les valeurs minimales et maximales de chaque colonne. Lorsqu’une requête applique un filtre sur ces colonnes, le moteur exploite ces statistiques pour déterminer si le fichier peut contenir des données pertinentes.

**Fonctionnement :**

1. Le moteur analyse les prédicats de la requête (ex. : `WHERE colonne > 10 AND colonne < 100`).
2. Il consulte les statistiques Min/Max pour chaque fichier concerné.
3. Si l’intervalle du filtre ne recoupe pas celui du fichier, ce dernier est ignoré.
4. En cas de recouvrement, le fichier est lu, puis un filtrage est appliqué à son contenu.

**Exemple (PySpark) :**
```python
from pyspark.sql.functions import col

# Table Delta avec une colonne "value"
delta_table = spark.read.format("delta").table("my_table")

# Requête avec filtre sur "value"
filtered_data = delta_table.filter((col("value") > 10) & (col("value") < 100))

filtered_data.show()
```

**Avantages :**

* Permet de filtrer efficacement de grandes quantités de données.
* Faible surcoût car les statistiques sont générées automatiquement.

**Limitations :**

* Efficace surtout sur des colonnes numériques ou ordonnées.
* Moins pertinent avec des données fortement dispersées ou à haute cardinalité.
* Peu utile pour des comparaisons par égalité sur des chaînes de caractères.

### 2. Filtres de Bloom : test probabiliste d’appartenance

Les filtres de Bloom offrent une méthode probabiliste pour déterminer si une valeur est potentiellement présente dans un fichier. Ils sont utiles pour les comparaisons par égalité, notamment sur des colonnes peu adaptées au Min/Max (chaînes, colonnes à haute cardinalité).

**Fonctionnement :**

1. Lors de l’écriture, Delta Lake génère un filtre de Bloom pour certaines colonnes.
2. En cas de filtre par égalité sur ces colonnes, le moteur consulte le filtre de Bloom.
3. Si la valeur est absente selon le filtre → fichier ignoré.
4. Si elle pourrait être présente → fichier lu et filtré. (Il peut y avoir des faux positifs, mais jamais de faux négatifs.)

**Activation des filtres de Bloom :**
```python
# Activer les filtres de Bloom sur la colonne "id"
spark.sql("""
ALTER TABLE my_table
SET TBLPROPERTIES (delta.bloomFilter.column=id)
""")

# Utilisation lors d’un filtrage
spark.read.format("delta").table("my_table").filter(col("id") == "some_value").show()
```

**Avantages :**

* Très efficace pour les égalités sur des colonnes à forte cardinalité ou chaînes.
* Réduction significative de l’E/S sur les requêtes sélectives.

**Limitations :**

* Génère un léger surcoût à l’écriture.
* Faux positifs possibles → lectures inutiles occasionnelles.
* L’efficacité dépend du volume de valeurs distinctes et de la taille du filtre.

### 3. Pruning de fichiers : partitionnement et saut par répertoire

Le partitionnement physique divise les données en répertoires selon les valeurs d’une ou plusieurs colonnes. Cela permet aux requêtes filtrant sur ces colonnes d’ignorer directement les répertoires non pertinents.

**Fonctionnement :**

1. Chaque valeur de colonne de partition crée un dossier séparé.
2. Une requête avec un filtre sur cette colonne ne cible que le(s) répertoire(s) concerné(s).

**Exemple (PySpark) :**
```python
# Table partitionnée par "date"
spark.sql("""
CREATE TABLE my_table (id STRING, value INT, date DATE)
PARTITIONED BY (date)
USING DELTA
""")

# Requête filtrant sur "date"
spark.read.format("delta").table("my_table").filter(col("date") == "2023-01-15").show()
```

**Avantages :**

* Très efficace pour les filtres sur colonnes de partition.
* Évite complètement la lecture de répertoires entiers.

**Limitations :**

* Exige un bon choix des colonnes de partition.
* Trop de partitions → surcharge en petits fichiers. Trop peu → faibles gains.
* Inefficace si la requête ne filtre pas sur la colonne de partition.

### 4. Autres techniques pertinentes

Outre les statistiques Min/Max, les filtres de Bloom et le partitionnement, Delta Lake propose d’autres optimisations :

* **Predicate Pushdown (poussée de prédicats)** : les filtres sont transmis au niveau du stockage, évitant des lectures inutiles.
* **Pruning de colonnes** : seules les colonnes nécessaires sont lues, réduisant les coûts en E/S.
* **Z-Ordering** : optimisation du layout des données (clustering de valeurs proches), ce qui renforce l'efficacité des techniques précédentes.

## Configuration et activation du Data Skipping

La plupart des techniques sont automatiques, mais certaines doivent être configurées :

* **Filtres de Bloom** : activer via `ALTER TABLE` comme montré plus haut.
* **Partitionnement** : à définir à la création de la table (`PARTITIONED BY`).
* **Z-Ordering** : à appliquer via la commande `OPTIMIZE ... ZORDER BY`.

## Impact selon les types de requêtes

L’efficacité varie selon le type de requête et la structure des données :

* **Recherches précises (égalité)** : les filtres de Bloom et le partitionnement sont très efficaces.
* **Requêtes par plage** : les statistiques Min/Max sont les plus utiles.
* **Requêtes complexes** : Delta Lake combine plusieurs techniques pour optimiser.
* **Requêtes analytiques (agrégats, jointures)** : bénéficient indirectement du *data skipping* via la réduction du volume à traiter.

## Bonnes pratiques pour maximiser l’efficacité

* **Partitionnement stratégique** : choisir des colonnes selon les requêtes les plus fréquentes.
* **Filtres de Bloom pertinents** : les activer pour les colonnes souvent utilisées dans des égalités.
* **Compactage et optimisation réguliers** : utiliser le `OPTIMIZE` et réduire les petits fichiers.
* **Analyse des plans d’exécution** : observer l’usage réel des techniques via les métriques Spark.
* **Gestion du déséquilibre de données** : envisager le *salting* ou le *bucketing* si certaines valeurs sont surreprésentées.

## Conclusion : libérer le potentiel du Data Skipping

Le *data skipping* est une brique essentielle de l’optimisation dans Delta Lake. Il permet de filtrer les données non pertinentes dès le départ, améliorant les performances des pipelines et analyses. Une bonne compréhension de ces techniques, de leur configuration, et des bonnes pratiques associées est cruciale pour en tirer pleinement profit et rendre vos charges analytiques plus rapides et plus efficaces.
