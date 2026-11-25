# Plan – Übung Webapplikation

## Aktueller Stand
- Phase 0 (Voraussetzungen) abgeschlossen: Docker 29.9 / Compose 5.7 (arm64), git, gh (eingeloggt) vorhanden.
- Phase 1 (Gesamtplan) freigegeben am 25.11.2026.
- Phase 2 umgesetzt und getestet: App + DB laufen lokal auf `http://localhost:8080`, Zähler überlebt Neustart und Neuerstellen, Fehleranzeige ohne DB funktioniert. Wartet auf Danis Prüfung.
- Nächster Schritt: Phase 3 – GitHub-Repository.

## Architektur (4 Container, docker compose)
| Container | Image | Aufgabe |
|---|---|---|
| app | `ghcr.io/danimanickam/m042-webapp` (eigenes) | Webseite, Besucherzähler, `/health` |
| db | `postgres:18-alpine` | Datenbank, Named Volume für Daten |
| updater | `nickfedor/watchtower:1.24.2` | zieht neue App-Images automatisch (nur Container mit Label) |
| tunnel | `cloudflare/cloudflared:2026.11.2` | Cloudflare Quick Tunnel (trycloudflare.com) |

Ablauf: Push auf `main` → GitHub Actions (arm64-Runner) baut Image mit Commit-Hash → ghcr.io → updater auf dem Mac → app neu gestartet.

## Getroffene Entscheide
- Laptop MacBook Pro M1 (arm64), Repo öffentlich, Quick Tunnel ohne Account (25.11.2026).
- App in Node.js 24, einziges Zusatzpaket: `pg` (DB-Treiber).
- Update-Dienst: Watchtower-Fork von Nicholas Fedor (gepflegt, gleiche Bedienung; nur App per Label). Alternative WUD geprüft, zu aufwendig.
- Repo-Name: `m042-webapp`.
- Homebrew wird nicht benötigt.
- Image-Build nativ auf GitHub-arm64-Runner (gratis für öffentliche Repos).
- App lokal nur auf `127.0.0.1:8080`, DB ohne offenen Port.
- Ohne DB: Seite zeigt «DB: FEHLER – nicht erreichbar», `/health` meldet Fehler (HTTP 503).
- `.env` enthält nur `POSTGRES_PASSWORD` (zufällig); DB-Benutzer und DB-Name `app` sind nicht geheim.
- Datenvolume `m042-webapp_pgdata` (Postgres 18: Mount auf `/var/lib/postgresql`).

## Offene Fragen / Punkte für später
- Phase 3: git-Name und E-Mail setzen (anonyme GitHub-noreply-Adresse vorgeschlagen).
- Phase 4: `gh` braucht Recht `workflow` (Dani bestätigt im Browser); Paket auf öffentlich stellen.
- Für Checkliste: updater hat Zugriff auf `docker.sock`; Tunnel-URL ändert bei Neustart; Docker Desktop muss nach Mac-Neustart laufen.
