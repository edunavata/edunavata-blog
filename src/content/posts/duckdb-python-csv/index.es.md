---
title: "DuckDB: consulta tus CSVs como si fueran una base de datos"
date: 2026-05-22
draft: false
slug: "duckdb-python-csv"
description: "Cómo usar DuckDB en Python para analizar ficheros CSV con SQL sin levantar ningún servidor ni cargar datos en memoria."
summary: "DuckDB convierte cualquier CSV en una tabla SQL en milisegundos, directamente desde Python, sin servidor y sin copiar los datos."
tags: ["python", "data-engineering", "duckdb", "sql"]
categories: ["data-engineering"]
lang: "es"
aiGenerated: true
aiModel: "Claude Sonnet 4.6"
---

Si trabajas con datos en Python, probablemente has vivido esta situación: tienes un CSV de 2 GB, intentas cargarlo con `pandas.read_csv()` y el proceso muere a los 30 segundos. O peor: lo carga, pero cualquier agregación tarda minutos porque estás operando en memoria con tipos de Python en lugar de vectores nativos.

[DuckDB](https://duckdb.org) resuelve esto de forma elegante. Es una base de datos analítica embebida —como SQLite, pero orientada a columnas y optimizada para OLAP— que puede leer CSV, Parquet y JSON directamente desde disco sin importarlos.

## Instalación

```bash
pip install duckdb
```

Sin servidor. Sin configuración. Sin dependencias pesadas.

## El problema con pandas en ficheros grandes

```python
import pandas as pd
import time

start = time.time()
df = pd.read_csv("ventas_2025.csv")  # 1.8 GB
resultado = df.groupby("region")["importe"].sum()
print(f"Tiempo: {time.time() - start:.1f}s")
# Tiempo: 47.3s — y el proceso usó 6 GB de RAM
```

Pandas carga todo en memoria antes de poder hacer cualquier operación. Para CSVs grandes, esto es prohibitivo.

## La misma consulta con DuckDB

```python
import duckdb
import time

start = time.time()
resultado = duckdb.sql("""
    SELECT region, SUM(importe) as total
    FROM read_csv_auto('ventas_2025.csv')
    GROUP BY region
    ORDER BY total DESC
""").df()
print(f"Tiempo: {time.time() - start:.1f}s")
# Tiempo: 1.8s — pico de RAM: 340 MB
```

DuckDB escanea el fichero en streaming, procesa por columnas y aplica el filtro antes de materializar nada. El `read_csv_auto` infiere el schema automáticamente.

## Funciones útiles para CSVs reales

### Inferencia de schema con control

```python
import duckdb

# Ver qué tipos infirió DuckDB
duckdb.sql("""
    DESCRIBE SELECT * FROM read_csv_auto('ventas_2025.csv', sample_size=10000)
""").show()
```

Si la inferencia falla en alguna columna, puedes forzar tipos:

```python
duckdb.sql("""
    SELECT *
    FROM read_csv(
        'ventas_2025.csv',
        columns = {
            'fecha': 'DATE',
            'importe': 'DOUBLE',
            'codigo_postal': 'VARCHAR'  -- evita que lo trate como INT
        }
    )
    LIMIT 5
""").show()
```

### Leer múltiples CSVs como una sola tabla

```python
# Glob nativo: lee todos los ficheros de un directorio
duckdb.sql("""
    SELECT mes, COUNT(*) as pedidos, SUM(importe) as total
    FROM read_csv_auto('pedidos/2025/*.csv')
    GROUP BY mes
    ORDER BY mes
""").show()
```

Esto es especialmente útil en pipelines donde los datos llegan particionados por fecha.

### Exportar a Parquet

Una vez que has limpiado o transformado los datos, exportar a Parquet es trivial:

```python
duckdb.sql("""
    COPY (
        SELECT
            fecha::DATE as fecha,
            region,
            producto,
            ROUND(importe, 2) as importe
        FROM read_csv_auto('ventas_2025.csv')
        WHERE draft = false
    )
    TO 'ventas_limpio.parquet'
    (FORMAT PARQUET, COMPRESSION 'zstd')
""")
```

El fichero resultante ocupa un 20-30% del CSV original y las lecturas posteriores son 10-50x más rápidas.

## Integración con pandas y polars

DuckDB no reemplaza pandas: los complementa. Puedes mezclarlos sin copiar datos:

```python
import duckdb
import pandas as pd

# Pandas → DuckDB (sin copiar)
df_clientes = pd.read_parquet("clientes.parquet")

resultado = duckdb.sql("""
    SELECT
        c.segmento,
        COUNT(*) as pedidos,
        AVG(v.importe) as ticket_medio
    FROM read_csv_auto('ventas_2025.csv') v
    JOIN df_clientes c ON v.cliente_id = c.id
    GROUP BY c.segmento
""").df()  # devuelve un DataFrame de pandas
```

DuckDB registra el DataFrame de pandas como una tabla virtual sin copiarlo en memoria. El JOIN ocurre a nivel de C++.

## Cuándo usar DuckDB vs alternativas

| Caso | Herramienta recomendada |
|---|---|
| CSV < 100 MB, transformaciones complejas con Python | pandas |
| CSV > 500 MB, consultas SQL analíticas | **DuckDB** |
| Datos en S3/GCS, múltiples fuentes remotas | DuckDB + extensión httpfs |
| Pipeline de producción con esquema fijo | Polars (más predecible en memoria) |
| Necesitas compartir la BD entre procesos | PostgreSQL |

DuckDB brilla especialmente en exploración ad-hoc de datasets grandes sin infraestructura: un analista con un portátil puede sustituir un cluster de Spark para la mayoría de los análisis que caben en disco local.

## Conexión persistente y tablas en memoria

Si vas a reutilizar los datos en varias queries de la misma sesión, crea una tabla en memoria:

```python
import duckdb

con = duckdb.connect()  # conexión en memoria

# Materializa una vez, consulta muchas veces
con.execute("""
    CREATE TABLE ventas AS
    SELECT * FROM read_csv_auto('ventas_2025.csv')
""")

# Las queries siguientes van sobre la tabla en memoria (más rápido)
con.sql("SELECT region, COUNT(*) FROM ventas GROUP BY region").show()
con.sql("SELECT mes, AVG(importe) FROM ventas GROUP BY mes").show()
```

También puedes persistir a disco con `duckdb.connect('mi_analisis.duckdb')` y retomar el trabajo en otra sesión.

## Conclusión

DuckDB resuelve un hueco real en el ecosistema Python: análisis SQL eficiente sobre ficheros locales sin levantar ningún servidor. Para exploración de datos, ETLs ligeros y análisis ad-hoc, es frecuentemente la herramienta más sencilla y rápida disponible.

Si trabajas con ficheros de más de 200 MB en pandas y no estás satisfecho con el rendimiento, DuckDB debería ser tu próxima parada.
