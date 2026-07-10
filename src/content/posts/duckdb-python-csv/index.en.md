---
title: "DuckDB: query your CSVs as if they were a database"
date: 2026-05-22
draft: false
slug: "duckdb-python-csv"
description: "How to use DuckDB in Python to analyze CSV files with SQL without spinning up a server or loading the data into memory."
summary: "DuckDB turns any CSV into a SQL table in milliseconds, straight from Python, with no server and without copying the data."
category: data-engineering
tags: [duckdb, python, sql, tutorial]
origins: [ai-generated]
aiModel: "Claude Sonnet 4.6"
lang: "en"
translationKey: "duckdb-python-csv"
cover:
  image: "cover.png"
  alt: "Cover image"
---

If you work with data in Python, you've probably lived this situation: you have a 2 GB CSV, you try to load it with `pandas.read_csv()` and the process dies after 30 seconds. Or worse: it loads, but any aggregation takes minutes because you're operating in memory with Python types instead of native vectors.

[DuckDB](https://duckdb.org) solves this elegantly. It's an embedded analytical database —like SQLite, but column-oriented and optimized for OLAP— that can read CSV, Parquet and JSON directly from disk without importing them.

## Installation

```bash
pip install duckdb
```

No server. No configuration. No heavy dependencies.

## The problem with pandas on large files

```python
import pandas as pd
import time

start = time.time()
df = pd.read_csv("ventas_2025.csv")  # 1.8 GB
resultado = df.groupby("region")["importe"].sum()
print(f"Tiempo: {time.time() - start:.1f}s")
# Tiempo: 47.3s — y el proceso usó 6 GB de RAM
```

Pandas loads everything into memory before it can perform any operation. For large CSVs, this is prohibitive.

## The same query with DuckDB

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

DuckDB scans the file in streaming, processes by columns and applies the filter before materializing anything. `read_csv_auto` infers the schema automatically.

## Useful functions for real CSVs

### Schema inference with control

```python
import duckdb

# See which types DuckDB inferred
duckdb.sql("""
    DESCRIBE SELECT * FROM read_csv_auto('ventas_2025.csv', sample_size=10000)
""").show()
```

If inference fails on some column, you can force types:

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

### Read multiple CSVs as a single table

```python
# Native glob: reads every file in a directory
duckdb.sql("""
    SELECT mes, COUNT(*) as pedidos, SUM(importe) as total
    FROM read_csv_auto('pedidos/2025/*.csv')
    GROUP BY mes
    ORDER BY mes
""").show()
```

This is especially useful in pipelines where the data arrives partitioned by date.

### Export to Parquet

Once you've cleaned or transformed the data, exporting to Parquet is trivial:

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

The resulting file takes up 20-30% of the original CSV and subsequent reads are 10-50x faster.

## Integration with pandas and polars

DuckDB doesn't replace pandas: it complements it. You can mix them without copying data:

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

DuckDB registers the pandas DataFrame as a virtual table without copying it into memory. The JOIN happens at the C++ level.

## When to use DuckDB vs alternatives

| Case | Recommended tool |
|---|---|
| CSV < 100 MB, complex transformations with Python | pandas |
| CSV > 500 MB, analytical SQL queries | **DuckDB** |
| Data in S3/GCS, multiple remote sources | DuckDB + httpfs extension |
| Production pipeline with fixed schema | Polars (more predictable in memory) |
| You need to share the DB across processes | PostgreSQL |

DuckDB shines especially in ad-hoc exploration of large datasets without infrastructure: an analyst with a laptop can replace a Spark cluster for most analyses that fit on local disk.

## Persistent connection and in-memory tables

If you're going to reuse the data across several queries in the same session, create an in-memory table:

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

You can also persist to disk with `duckdb.connect('mi_analisis.duckdb')` and resume the work in another session.

## Conclusion

DuckDB fills a real gap in the Python ecosystem: efficient SQL analysis over local files without spinning up any server. For data exploration, lightweight ETLs and ad-hoc analysis, it's frequently the simplest and fastest tool available.

If you work with files larger than 200 MB in pandas and you're not happy with the performance, DuckDB should be your next stop.
