# lab-infomation
```mermaid
flowchart LR
    subgraph ブラウザ
        A[React SPA] -- fetch() / axios --> B[/Flask REST API/]
    end
    B -- SQLAlchemy --> C[(SQLite DB)]

```