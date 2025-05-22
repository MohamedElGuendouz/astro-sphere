---
title: "Delta Lake : Tables gérées vs. Tables externes – Guide complet"
date: 2024-08-09
summary: "Comprenez les différences entre les tables gérées et externes dans Delta Lake, leurs implications, cas d’usage, et comment choisir le bon type pour votre data lake."
tags: ["Delta Lake", "Data Engineering", "Data Architecture"]
---

# Tables gérées vs. Tables externes dans Delta Lake : Guide complet

Delta Lake, construit au-dessus des data lakes, offre un cadre fiable et robuste pour la gestion des données. L’un des choix essentiels à faire concerne le type de table : **gérée** ou **externe**. Cet article explore les différences entre ces types de tables, leurs implications, cas d’usage et comment faire le bon choix selon vos besoins.

## Qu’est-ce qu’une table gérée ou externe ?

Dans Delta Lake, on distingue deux grands types de tables :

* **Tables gérées (Managed Tables)** : Delta Lake gère entièrement les données **et** les métadonnées. Le système contrôle l’emplacement des fichiers et prend en charge tous les aspects de gestion.
* **Tables externes (External Tables)** : Delta Lake gère uniquement les métadonnées, tandis que les données sont stockées à un emplacement que vous définissez vous-même. Cela vous donne un contrôle total sur la localisation physique des données.

## Implications du choix de type de table

Le choix entre table gérée et table externe a des impacts concrets sur la gestion des données et des métadonnées :

| Fonctionnalité           | Tables gérées                                     | Tables externes                                      |
|--------------------------|--------------------------------------------------|------------------------------------------------------|
| Emplacement des données  | Contrôlé par Delta Lake (dans le dossier par défaut du metastore). | Déterminé par l’utilisateur ; accessible depuis le cluster. |
| Gestion des données      | Delta Lake gère le stockage, l’organisation et le nettoyage. | L’utilisateur gère le cycle de vie et l’organisation des fichiers. |
| Gestion des métadonnées  | Gérée par Delta Lake (schéma, statistiques, journal de transactions). | Métadonnées gérées par Delta Lake, mais données sous contrôle utilisateur. |
| Suppression              | Supprimer la table efface **les données et les métadonnées**. | Supprimer la table n’efface que les métadonnées ; les données restent. |

## Cas d’usage et exemples

Le bon choix dépend de la manière dont vous souhaitez gérer vos données.

### Tables gérées

Recommandées lorsque :

* Vous souhaitez une solution 100 % gérée sans gérer les détails du stockage.
* Vous privilégiez la simplicité et la sécurité (Delta contrôle l’accès aux fichiers).
* Le cycle de vie des données est lié à celui de la table : supprimer la table doit aussi supprimer les données.
* Vous débutez ou souhaitez minimiser la configuration.

**Exemple (PySpark) :**
```python
from pyspark.sql.functions import *

# Création d’une table gérée
spark.sql("""
    CREATE TABLE IF NOT EXISTS managed_users (
        id INT,
        name STRING,
        email STRING
    ) USING DELTA
""")

# Insertion de données
data = [(1, "Alice", "alice@example.com"), (2, "Bob", "bob@example.com")]
df = spark.createDataFrame(data, ["id", "name", "email"])
df.write.mode("append").saveAsTable("managed_users")

# Requête
spark.sql("SELECT * FROM managed_users").show()

# La suppression supprime aussi les données :
# spark.sql("DROP TABLE managed_users")
```

### Tables externes

Préférées lorsque :

* Vous devez stocker les données dans un emplacement spécifique (ex : data lake existant, stockage partagé).
* Vous voulez contrôler le cycle de vie, l’organisation et l’architecture physique des données.
* Plusieurs moteurs doivent accéder aux données (y compris hors Delta Lake).
* Le cycle de vie des données est indépendant de celui de la table.

**Exemple (PySpark) :**
```python
# Définir l’emplacement de stockage
path = "/chemin/vers/donnees/external/users"

# Création d’une table externe
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS external_users (
        id INT,
        name STRING,
        email STRING
    ) USING DELTA
    LOCATION '{path}'
""")

# Insertion de données
data = [(3, "Charlie", "charlie@example.com"), (4, "David", "david@example.com")]
df = spark.createDataFrame(data, ["id", "name", "email"])
df.write.format("delta").mode("append").save(path)

# Requête
spark.sql("SELECT * FROM external_users").show()

# La suppression ne supprime que les métadonnées :
# spark.sql("DROP TABLE external_users")
```

## Avantages et inconvénients

| Critère                  | Tables gérées                          | Tables externes                             |
|--------------------------|----------------------------------------|---------------------------------------------|
| **Avantages**            | - Gestion simplifiée                  | - Contrôle total sur l’emplacement          |
|                          | - Isolation et sécurité des données   | - Cycle de vie des données indépendant      |
|                          | - Mise en place rapide                | - Partage de données entre systèmes         |
| **Inconvénients**        | - Moins de contrôle sur le stockage   | - Gestion manuelle du stockage              |
|                          | - Données supprimées avec la table    | - Complexité accrue de l’organisation       |

## Comment choisir ?

Voici quelques critères pour orienter votre choix :

1. **Contrôle et gouvernance des données** : besoin de maîtrise complète → table externe. Besoin d’un cadre simple → table gérée.
2. **Cycle de vie** : si les données doivent être supprimées avec la table → table gérée. Sinon, table externe.
3. **Interopérabilité** : si vous devez partager les données avec d’autres outils (ex : moteurs non Delta Lake), utilisez une table externe.
4. **Facilité d’usage** : les tables gérées sont plus faciles à manipuler pour débuter ou prototyper rapidement.

## Impacts opérationnels

Le type de table influence certaines opérations :

* **Suppression** : les tables gérées suppriment aussi les fichiers ; les externes conservent les données.
* **Évolution du schéma** : les deux types la supportent, mais en externe, attention aux décalages entre les données réelles et la définition.
* **Partitionnement** : possible dans les deux cas, mais plus flexible côté externe car vous contrôlez l’organisation physique.

## Conclusion

Maîtriser la différence entre tables gérées et tables externes est essentiel pour structurer efficacement votre data lake avec Delta Lake. Chaque type a ses forces et compromis. En choisissant celui qui s’aligne avec vos objectifs (contrôle, simplicité, partage, cycle de vie), vous optimisez la fiabilité, les performances et la gouvernance de vos pipelines de données.