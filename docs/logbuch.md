# Logbuch

## 25.11.2026
- Phase 0a: Konfiguration liegt in `.claude/` (bereits erledigt vorgefunden).
- Phase 0: Voraussetzungen geprüft. Docker fehlte → Dani hat Docker Desktop installiert; Testcontainer erfolgreich. Homebrew fehlt, wird nicht gebraucht.
- Phase 1: Gesamtplan erstellt (Watchtower-Fork und WUD auf GitHub auf Aktivität geprüft, arm64-Images geprüft) und von Dani freigegeben.
- Phase 2: App (Node 24, `pg` 8.23.1), Dockerfile, compose.yaml, .env.example erstellt; .env mit Zufallspasswort erzeugt (Inhalt nicht angezeigt). Tests: Zähler 1→2→3; `docker compose restart` → 4; `down` (ohne -v) + `up` → 5; DB gestoppt → Seite «DB: FEHLER», /health HTTP 503, App «unhealthy»; DB gestartet → 6, beide «healthy».
- Phase 2: Dani hat Ergebnis geprüft; Neustart-Test auf Wunsch wiederholt (15 → 16).
- Phase 3: git initialisiert (Absender «Dani», noreply-Adresse). Secret-Suche über alle Dateien: nur Platzhalter. 3 Commits, öffentliches Repo `danimanickam/m042-webapp` angelegt und gepusht. Per API bestätigt: öffentlich, Secret Scanning und Push Protection aktiv.
- Phase 4: Dani hat `gh` das Recht `workflow` gegeben. Workflow committet und gepusht; Lauf 45633727235 grün (Build 27 s). Geprüft: Image linux/arm64, Version 2d69ea2 im Container, Abruf ohne Login HTTP 200 → Paket ist öffentlich (von öffentlichem Repo geerbt), kein Umstellen nötig.
- Phase 5: compose.yaml auf ghcr.io-Image umgestellt, Updater `nickfedor/watchtower:1.24.2` ergänzt (Einstellungen aus offizieller Doku). Seite zeigte danach Version cf9fbd8 statt «dev», Zähler 18 → 19. Erste Updater-Runde: scanned=1 (nur App). Test: Push 16231a2 um 15:44:56 → Build grün nach 29 s → Updater fand neues Image 15:45:50 → live nach ca. 50 s. DB nicht neu gestartet.
- Phase 6: Tunnel-Container ergänzt und gestartet. Öffentliche Adresse aus den Logs gelesen; Aufruf übers Internet: HTTP 200, alle vier Angaben (Besucher 29, DB verbunden, Version b525cdd), /health ok, Zertifikat gültig (Google Trust Services, bis 03.01.2027), http wird auf https umgeleitet.
- Phase 6 (Nachtrag): App-Update während laufendem Tunnel getestet: Push d2d5b9e 15:54:41 → öffentlich live 15:55:57, Tunnel-Adresse blieb gleich. Dani hat die Seite auf dem Handy im Mobilnetz geprüft.
- Phase 7: Hintergrund hellblau, Rand blau (Commit 280b28e). Push 16:18:50 → Build grün 16:19:23 (32 s) → Updater fand neues Image 16:19:59 → neuer Container 16:20:00. Gesamt 70 s, ohne Handarbeit. Dani hat die blaue Seite öffentlich bestätigt. (Syntax-Check vor dem Commit lief wegen Befehlsfehler nicht; Änderung betraf nur zwei Farbwerte.)
- Phase 8: Ist-Stand erhoben (u. a. Docker-Autostart aus, Mac-Ruhezustand nach 1 Min., kein Branch-Schutz, App läuft als `node`). Entwurf im Chat gezeigt, Dani hat alle Vorschläge übernommen. `docs/betriebs-checkliste.md` geschrieben; Summen nachgezählt und korrigiert (Entwurf nannte fälschlich 37 statt 43 Punkte).
