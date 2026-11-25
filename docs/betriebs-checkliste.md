# Betriebs-Checkliste – M042 Webapp

Stand: 25.11.2026. Abgeglichen mit Repo, laufenden Containern, GitHub und dem Mac.
Entscheide bei «geplant» und «bewusst weggelassen»: Dani (25.11.2026).

**Bekannte Grenzen vorab:** Die App läuft auf einem Laptop. Ist der Mac aus, im Ruhezustand oder läuft Docker Desktop nicht, ist die Seite offline. Der Cloudflare Quick Tunnel hat keine Verfügbarkeitsgarantie und eine Adresse, die bei jedem Neustart des Tunnels wechselt.

## 1. Daten

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|
| Daten bleiben bei Neustart erhalten | umgesetzt | Named Volume `pgdata` in `compose.yaml`; getestet mit `docker compose restart` sowie `down`/`up` (ohne `-v`) |
| Schutz vor versehentlichem Löschen | umgesetzt | `docker compose down -v` und `docker volume rm` in `.claude/settings.json` gesperrt; Updater mit `WATCHTOWER_REMOVE_VOLUMES=false` |
| Datensparsamkeit / Datenschutz | umgesetzt | App speichert nur eine Zahl, keine Personendaten (`app/server.js`) |
| Backup | geplant | Täglich `pg_dump` aus dem `db`-Container in eine Datei ausserhalb von Docker (z. B. per Zeitplan auf dem Mac) |
| Restore-Test | geplant | Backup einmal in eine leere Test-DB zurückspielen und Zählerstand vergleichen |
| Schema-Migrationen | bewusst weggelassen | Nur eine Tabelle, wird beim Start angelegt; Migrationswerkzeug wäre Overkill |

## 2. Sicherheit

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|
| Keine Secrets im Repo | umgesetzt | `.env` nur lokal (`.gitignore`), im Repo nur `.env.example`; GitHub Secret Scanning und Push Protection aktiv |
| HTTPS | umgesetzt | Zertifikat via Cloudflare (`tunnel` in `compose.yaml`), `http` wird auf `https` umgeleitet |
| DB nicht von aussen erreichbar | umgesetzt | Kein veröffentlichter DB-Port; App lokal nur auf `127.0.0.1:8080` |
| Minimale Rechte im CI | umgesetzt | `.github/workflows/build.yml`: `contents: read`, `packages: write`, nur automatischer `GITHUB_TOKEN` |
| App läuft nicht als root | umgesetzt | `USER node` im `Dockerfile`, im laufenden Container geprüft |
| Feste Image-Versionen | umgesetzt | `postgres:18-alpine`, `nickfedor/watchtower:1.24.2`, `cloudflare/cloudflared:2026.11.2` in `compose.yaml` |
| Updater mit Vollzugriff auf Docker (`docker.sock`) | bewusst weggelassen | Für die Übung akzeptiert. Saubere Lösung wäre ein Socket-Proxy, der nur die nötigen Docker-Befehle durchlässt |
| Automatische Sicherheits-Updates der Abhängigkeiten | geplant | GitHub Dependabot (gratis) für `pg`, Node-Basis-Image und GitHub Actions; schlägt Updates als Pull Request vor |
| Image auf Schwachstellen scannen | geplant | Trivy-Scan als zusätzlicher Schritt in `build.yml` (gratis) |
| Schutz vor Missbrauch (Bots, Zähler hochtreiben) | bewusst weggelassen | Öffentliche Demo-Seite ohne Login; der Zähler hat keinen Wert |
| Branch-Schutz / Code-Review | bewusst weggelassen | Einzelarbeit; direkter Push auf `main` ist der gewollte Auslöser fürs Deployment |

## 3. Betrieb

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|
| Healthcheck | umgesetzt | Endpoint `/health` prüft die DB (`app/server.js`); `healthcheck` für `db`, `app`, `updater` in `compose.yaml` bzw. Image |
| Neustart nach Absturz | umgesetzt | `restart: unless-stopped` bei allen vier Containern |
| Logs | umgesetzt | `docker compose logs <dienst>`; Docker begrenzt die Log-Grösse automatisch (Treiber `local`) |
| Autostart nach Mac-Neustart | geplant | In Docker Desktop «Start Docker Desktop when you sign in» einschalten (heute aus) |
| Mac-Ruhezustand | geplant | Systemeinstellungen → Energie: am Netzteil Ruhezustand verhindern; Mac aufgeklappt lassen (heute: Ruhezustand nach 1 Minute) |
| Überwachung und Alarmierung | bewusst weggelassen | Externe Uptime-Dienste brauchen einen Account und eine feste Adresse, die der Quick Tunnel nicht bietet |
| Zentrale Log-Sammlung | bewusst weggelassen | Nur ein Rechner; `docker compose logs` reicht |

## 4. Deployment

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|
| Automatischer Build | umgesetzt | `.github/workflows/build.yml` bei jedem Push auf `main`, nativer arm64-Runner, ca. 30 s |
| Automatisches Ausrollen | umgesetzt | Service `updater` (Watchtower-Fork) prüft alle 60 s, nur App per Label; gemessen 50–75 s vom Push bis live |
| Versionierung | umgesetzt | Commit-Hash als Build-Argument → auf der Seite und in `/health`; Image-Tags `latest` und `sha-<hash>` in ghcr.io |
| Rollback | geplant | `git revert` des fehlerhaften Commits und pushen → alte Version kommt automatisch zurück; einmal testen und beschreiben |
| Automatische Tests vor dem Ausrollen | geplant | Im Workflow Image mit Test-DB starten und `/health` prüfen; nur bei Erfolg nach ghcr.io pushen |
| Getrennte Test- und Produktionsumgebung | bewusst weggelassen | Nur ein Laptop; jeder Push geht direkt live |
| Update ohne Unterbruch | bewusst weggelassen | Beim Austausch ist die App ca. 1–2 Sekunden nicht erreichbar; für die Übung vertretbar |

## 5. Infrastruktur

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|
| Passende Architektur | umgesetzt | Alle Images für `linux/arm64`, App-Image auf nativem arm64-Runner gebaut |
| Kosten | umgesetzt | Alles gratis: öffentliches Repo, GitHub Actions, ghcr.io, Quick Tunnel, Docker Desktop (privat/Ausbildung) |
| Speicherplatz | umgesetzt | Updater löscht alte App-Images (`WATCHTOWER_CLEANUP=true`); DB-Volume aktuell ca. 66 MB |
| Richtiger Server statt Laptop | bewusst weggelassen | Vorgabe der Übung. Grenze: Mac aus oder im Ruhezustand → Seite offline |
| Feste öffentliche Adresse | bewusst weggelassen | Quick Tunnel wechselt die Adresse bei Neustart; feste Adresse bräuchte Cloudflare-Account und eigene Domain (Domain kostet) |
| Skalierung | bewusst weggelassen | Eine App-Instanz reicht; Quick Tunnel ist ohnehin begrenzt |

## 6. Organisatorisches

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|
| Rollen und Verantwortung | umgesetzt | `CLAUDE.md`: Dani verantwortet Betrieb, Deployment und Freigaben; Claude Code entwickelt |
| Projekt-Dokumentation | umgesetzt | `README.md`, `docs/plan.md`, `docs/logbuch.md`, `docs/ablauf.md` |
| Betriebsanleitung | geplant | `README.md` ergänzen: Starten, Stoppen, öffentliche Adresse finden, gesperrte Befehle |
| Lizenzen | umgesetzt | Open Source: Node und `pg` (MIT), PostgreSQL (PostgreSQL License), Watchtower-Fork und cloudflared (Apache 2.0); Docker Desktop gratis für private Nutzung/Ausbildung |
| Verfügbarkeitszusage (SLA) | bewusst weggelassen | Laptop und Quick Tunnel ohne Garantie; Cloudflare sieht Quick Tunnels nur zum Testen vor |
| Notfallkontakt / Bereitschaft | bewusst weggelassen | Einzelperson, Übungsprojekt |

## Zusammenfassung

| Status | Anzahl |
|---|---|
| umgesetzt | 21 |
| geplant | 9 |
| bewusst weggelassen | 13 |
| **Total** | **43** |
