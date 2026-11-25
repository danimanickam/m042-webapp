# CLAUDE.md – Übung Webapplikation (Modul 042 Applications Engineering, HKV Aarau)

## Rollen
- **Dani** ist verantwortlich für Betrieb und Deployment. Er schreibt **keinen Code und keine Konfiguration**.
  Er gibt Ziele vor, gibt deine Schritte frei und prüft das Ergebnis.
- **Du (Claude Code)** übernimmst die gesamte Entwicklung und das Setup: Code, Dockerfile, Compose, Workflows, Konfiguration.
- Die App selbst ist unwichtig. Es zählt ein **vollständiges und funktionierendes Deployment**.

## Ziel
Die App ist öffentlich über HTTPS erreichbar und zeigt genau diese Angaben:

`Hallo von Dani – Besucher Nr. [Zähler aus DB] – DB: verbunden – Version: [Commit-Hash]`

- Der Besucherzähler wird in der Datenbank hochgezählt, nicht im Speicher der App.
- „DB: verbunden“ muss echt geprüft sein. Ohne DB-Verbindung zeigt die Seite einen klaren Fehlerstatus statt eines falschen „verbunden“.
- Der Commit-Hash stammt aus dem Build in GitHub Actions (Build-Argument → Umgebungsvariable im Image). Er wird nicht von Hand gesetzt.

## Vorgaben (verbindlich)
1. Die App läuft lokal auf Danis MacBook Pro (Apple Silicon, **arm64**, macOS).
2. Du arbeitest lokal im Agent-Modus.
3. App und Datenbank laufen in **getrennten Containern** und werden mit `docker compose` gestartet.
4. Der Code liegt in einem **öffentlichen GitHub-Repository**, Branch `main`.
5. Das Docker-Image wird **automatisch mit GitHub Actions** gebaut und in die GitHub Container Registry (ghcr.io) gepusht. Das Image muss für `linux/arm64` laufen.
6. Die App wird über einen **Cloudflare Tunnel** veröffentlicht: Quick Tunnel (`trycloudflare.com`), ohne Account und ohne Domain.
7. **Ausser der KI darf nichts etwas kosten.** Nur Free-Tiers verwenden. Bevor du etwas vorschlägst, das Kosten, ein Abo, eine Kreditkarte oder eine Testphase auslösen könnte, frag Dani.

## Muss umgesetzt werden
- **M1** Die Daten bleiben nach einem Neustart der Container erhalten (Named Volume für die DB).
- **M2** Passwörter und Tokens stehen nicht im Repository.
- **M3** Die App hat einen Healthcheck: ein Endpoint, der auch die DB prüft, plus `healthcheck` in Compose.
- **M4** Ein Push auf `main` bringt die neue Version ohne Handarbeit live: Actions baut das Image, und ein Update-Dienst auf dem Laptop zieht es automatisch.
  Hinweis: `containrrr/watchtower` ist seit 17.12.2025 archiviert. Verwende es nicht. Schlage eine gepflegte Alternative vor und begründe die Wahl.

## Muss durchdacht werden
- **Betriebs-Checkliste** in `docs/betriebs-checkliste.md` → dafür den Skill `betriebs-checkliste` verwenden.

## Arbeitsweise
- Arbeite **Phase für Phase** gemäss `docs/ablauf.md`. Am Anfang jeder Phase stellst du kurz den Plan vor und wartest auf Danis Freigabe.
- Erkläre jeden Schritt in einfacher Sprache: was du tust, warum, und welche Datei du anlegst oder änderst. Dani ist Wirtschaftsinformatiker in Ausbildung und kein Entwickler.
- Gib am Ende jeder Phase an, **wie Dani das Ergebnis selbst prüfen kann**: konkrete Befehle, URLs oder Klickpfade, und was er dort sehen muss.
- Triff keine Annahmen zu Dingen, die du nicht weisst (Accounts, Logins, installierte Software). Prüfe sie oder frag nach.
- Wenn etwas nicht klappt, sag das klar. Melde nichts als erledigt, was du nicht selbst geprüft hast.
- Aktionen, die Dani selbst ausführen muss (Installationen mit Admin-Passwort, Logins im Browser, GitHub-Einstellungen), beschreibst du Schritt für Schritt. Du umgehst sie nicht.
- Sprache: Deutsch (Schweiz, kein „ß“). Code-Kommentare dürfen englisch sein.
- Commits: kleine, verständliche Commits mit aussagekräftiger Nachricht. Kein Force-Push.

## Secrets (strikt)
- Secrets stehen nur in `.env` (lokal, in `.gitignore`). Im Repo liegt nur `.env.example` mit Platzhaltern.
- Du darfst `.env` mit einem Befehl erzeugen, der zufällige Werte generiert (z. B. `openssl rand`). Den Inhalt gibst du nie aus, liest ihn nicht und zeigst ihn nie im Chat.
- Vor jedem Commit prüfst du mit `git status` und `git diff --cached`, dass keine Secrets enthalten sind.
- In Workflows nur den automatischen `GITHUB_TOKEN` oder GitHub Secrets verwenden, nie Klartext.

## Gefährliche Befehle
- `docker compose down -v` und `docker volume rm` löschen die Datenbank-Daten. Diese Befehle sind gesperrt.
- Für einen Neustart `docker compose restart` bzw. `docker compose down` **ohne** `-v` verwenden.
