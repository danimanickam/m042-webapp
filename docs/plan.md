# Plan – Übung Webapplikation

## Aktueller Stand
- Phase 0 (Voraussetzungen) abgeschlossen: Docker 29.9 / Compose 5.7 (arm64), git, gh (eingeloggt) vorhanden.
- Phase 1 (Gesamtplan) freigegeben am 25.11.2026.
- Phase 2 umgesetzt und getestet: App + DB laufen lokal auf `http://localhost:8080`, Zähler überlebt Neustart und Neuerstellen, Fehleranzeige ohne DB funktioniert. Von Dani geprüft (Neustart-Test 15 → 16).
- Phase 3 umgesetzt: öffentliches Repo https://github.com/danimanickam/m042-webapp (Branch `main`), `.env` nicht enthalten. Secret Scanning und Push Protection aktiv (GitHub-Standard).
- Phase 4 umgesetzt: Workflow `.github/workflows/build.yml` baut bei jedem Push auf `main` (arm64-Runner, ca. 30 s) und pusht `ghcr.io/danimanickam/m042-webapp:latest` + `:sha-<hash>`. Erster Lauf grün; Image ist linux/arm64, enthält `APP_VERSION=2d69ea2`, anonym abrufbar (öffentlich).
- Phase 5 umgesetzt: `app` nutzt `ghcr.io/danimanickam/m042-webapp:latest`, `updater` (Watchtower-Fork) prüft alle 60 s nur die App. Gemessen: Push → live in ca. 50 s (Build ~30 s + bis zu 60 s Wartezeit des Updaters). DB lief dabei ohne Unterbruch, Zähler blieb erhalten.
- Phase 6 umgesetzt: Container `tunnel` (`cloudflare/cloudflared:2026.11.2`, Quick Tunnel auf `http://app:3000`). Öffentlich über HTTPS erreichbar, Zertifikat gültig, http → https-Weiterleitung. Aktuelle Adresse: `docker compose logs tunnel | grep trycloudflare`.
- Phase 6 von Dani auf dem Handy im Mobilnetz geprüft.
- Phase 7 erfolgreich (von Dani bestätigt): Farbänderung (Commit 280b28e) ging ohne Handarbeit live, Push 16:18:50 → live 16:20:00 (70 s). Damit sind Ziel, Vorgaben 1–7 und M1–M4 umgesetzt.
- Phase 8 abgeschlossen: `docs/betriebs-checkliste.md` (43 Punkte: 21 umgesetzt, 9 geplant, 13 bewusst weggelassen), Entscheide von Dani übernommen.
- Alle Phasen der Übung abgeschlossen.

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
- Commits als «Dani» mit anonymer GitHub-noreply-Adresse (nur in diesem Repo gesetzt).
- Updater-Einstellungen: `WATCHTOWER_LABEL_ENABLE=true`, `POLL_INTERVAL=60`, `CLEANUP=true`, `REMOVE_VOLUMES=false`; App hat Label `com.centurylinklabs.watchtower.enable=true`. Lokales Bauen aus compose.yaml entfernt (nur noch Image aus CI).
- Tunnel ohne Updater-Label: App-Updates ändern die öffentliche Adresse nicht. Adresse ändert nur bei Neustart des Tunnel-Containers.
- Datenvolume `m042-webapp_pgdata` (Postgres 18: Mount auf `/var/lib/postgresql`).

## Offene Fragen / Punkte für später
- Geplante Punkte aus der Checkliste (noch nicht umgesetzt): Backup + Restore-Test, Dependabot, Trivy-Scan, Docker-Autostart, Mac-Ruhezustand, Rollback-Test, Tests im Workflow, Betriebsanleitung im README.
- Hinweis: Mac geht heute nach 1 Minute in den Ruhezustand und Docker Desktop startet nicht automatisch → Seite sonst offline.
