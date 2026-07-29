# Backend / API
 
Dieses Repository enthält das Backend (API). Es werden punktuelle Anpassungen vorgenommen, keine Neuentwicklung.
 
## Tech-Stack
 
- **Node.js**
- **TypeScript**
- **TypeORM** als ORM/Datenbankzugriff
## Befehle
 
<!-- Bitte anpassen an dein Setup -->
- Dev-Server starten: `npm run dev`
- Build: `npm run build`
- Tests: `npm run test`
- Linting: `npm run lint`
## Konventionen
 
- Entities liegen unter `src/entities/` (TypeORM-Decorators, keine rohen SQL-Strings in Business-Logik)
- Migrationen für jede Schemaänderung erzeugen, nie das Schema manuell in der DB ändern
- **Migrationen müssen dialekt-portabel sein** (PostgreSQL lokal, MySQL in Produktion — beide laufen über dieselbe `AppDataSource`, gesteuert per `DB_TYPE`). Deshalb in `up()`/`down()` ausschließlich die TypeORM QueryRunner Table-API verwenden (`createTable`, `addColumn`, `dropColumn`, `createForeignKey`, `dropForeignKey`, `Table`, `TableColumn`, `TableForeignKey`) statt `queryRunner.query(rawSql)` mit dialektspezifischem SQL (z. B. `character varying`, `SERIAL`, `uuid_generate_v4()`). `npm run create_migration` (= `typeorm migration:generate`) erzeugt beim Diffen gegen die aktuell verbundene DB immer rohes, dialektspezifisches SQL — das generierte Ergebnis daher grundsätzlich manuell auf die Table-API umschreiben, bevor es committet wird.
- DTOs/Validierung für eingehende Requests konsequent nutzen
- Umgebungsvariablen über `.env` (siehe `.env.example`), keine Secrets im Code. `.env.example` dokumentiert die Variablen für beide Umgebungen (Postgres lokal / MySQL Produktion via `DB_TYPE`).
## Aktueller Kontext
 
Das Backend wird **nicht** neu geschrieben, sondern gezielt angepasst – bestehende Architektur und Patterns bitte beibehalten, sofern nicht explizit anders besprochen. Änderungen sollten möglichst minimal-invasiv sein und bestehende Tests nicht brechen.
Das zugehörige Frontend (separates Repo) wird parallel komplett neu geschrieben. API-Contracts (Request/Response-Formate) sollten daher nicht ohne Rücksprache breaking geändert werden.
 
## Ordnerstruktur
 
<!-- Bitte an tatsächliche Struktur anpassen -->
```
src/
  entity/         # TypeORM Entities
  migration/      # TypeORM Migrationen. PostgreSQL für lokale Entwicklung. MySQL für Produktivumgebung
  api/v1/         # Routen
  services/       # Weitere Logik
  lib/middleware  # Auth, Error-Handling etc.
```