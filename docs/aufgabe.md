# Aufgabe – Übung Webapplikation (Modul 042, Tag 3, 21.10.2026, Folien 45–47)

## Ausgangslage
Einzelarbeit (120 Minuten)

## Aufgabe
Du bist verantwortlich für Betrieb und Deployment einer neuen Webapplikation. Deine KI übernimmt Entwicklung und Setup.
Du selbst schreibst keinen Code und keine Konfiguration: Du gibst die Ziele vor, gibst die Schritte der KI frei und prüfst das Ergebnis.
Die App selbst ist unwichtig. Was zählt, ist ein vollständiges und funktionierendes Deployment.

## Ziel
Deine App ist öffentlich über HTTPS erreichbar und zeigt:
Hallo von [Name] – Besucher Nr. [aus DB] – DB: verbunden – Version: [Commit-Hash]

## Vorgaben
- Die App läuft lokal auf deinem Laptop, der Cloudflare Tunnel macht sie öffentlich.
- Die KI arbeitet lokal im Agent-Modus, z. B. Claude Code oder GitHub Copilot in VS Code.
- App und Datenbank laufen in getrennten Containern und werden mit docker compose gestartet.
- Der Code liegt in einem GitHub-Repository.
- Das Docker-Image wird automatisch mit GitHub Actions gebaut.
- Die App wird über einen Cloudflare Tunnel veröffentlicht.
- Ausser der KI darf nichts etwas kosten.

## Muss umgesetzt werden
- Die Daten bleiben nach einem Neustart der Container erhalten.
- Passwörter und Tokens stehen nicht im Repository.
- Die App hat einen Healthcheck.
- Ein Push auf main bringt die neue Version ohne Handarbeit live.

## Muss durchdacht werden: die Betriebs-Checkliste
- Erstelle mit der KI eine Checkliste mit allem, was eine echte Applikation im Betrieb braucht.
- Halte bei jedem Punkt fest: Status: umgesetzt / geplant (wie?) / bewusst weggelassen (warum?)
- Mindestens diese Bereiche müssen vorkommen: Daten, Sicherheit, Betrieb, Deployment, Infrastruktur, Organisatorisches.

## Getroffene Rahmenentscheide (Dani, 25.11.2026)
- Laptop: MacBook Pro M1 (arm64, macOS)
- GitHub-Repo: öffentlich
- Tunnel: Cloudflare Quick Tunnel (gratis, ohne Account/Domain, URL ändert bei Neustart)
