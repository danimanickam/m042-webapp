---
name: betriebs-checkliste
description: Erstellt oder aktualisiert die Betriebs-Checkliste (docs/betriebs-checkliste.md) für die Übung Webapplikation. Verwenden, wenn Dani nach der Betriebs-Checkliste fragt oder eine Phase abgeschlossen ist und sich Status-Punkte geändert haben.
---

# Betriebs-Checkliste

## Auftrag (aus der Übung)
Erstelle zusammen mit Dani eine Checkliste mit allem, was eine **echte Applikation im Betrieb** braucht.
Halte bei jedem Punkt den Status fest:
- **umgesetzt** – mit Verweis, wo (Datei, Workflow, Compose-Service)
- **geplant** – mit dem *Wie* (konkrete Massnahme, Werkzeug)
- **bewusst weggelassen** – mit dem *Warum* (z. B. Übungsumfang, Kosten, nur ein Laptop)

## Pflichtbereiche (mindestens)
1. Daten
2. Sicherheit
3. Betrieb
4. Deployment
5. Infrastruktur
6. Organisatorisches

## Vorgehen
1. Lies den aktuellen Stand des Repos (Compose, Dockerfile, Workflows, App-Code) und, falls vorhanden, die bestehende `docs/betriebs-checkliste.md`.
2. Sammle pro Bereich die Punkte, die eine echte Produktiv-Applikation braucht. Denk dabei an:
   - Daten: Persistenz, Backup/Restore, Aufbewahrung, Datenschutz, Migrationen
   - Sicherheit: Secrets, HTTPS, Updates/Patches, Zugriffsschutz, Image-Herkunft, Least Privilege
   - Betrieb: Healthcheck, Logging, Monitoring/Alarmierung, Neustart-Verhalten, Verfügbarkeit
   - Deployment: CI/CD, Versionierung, Rollback, Umgebungen (Test/Prod)
   - Infrastruktur: Hosting, Abhängigkeit vom Laptop, Netzwerk/Tunnel, Skalierung, Kosten
   - Organisatorisches: Verantwortlichkeiten, Dokumentation, Notfallkontakt, Lizenzen, SLA
3. Gleiche jeden Punkt mit dem **tatsächlichen** Stand im Repo ab. „Umgesetzt“ nur, wenn es nachweisbar im Repo oder im laufenden System existiert.
4. Zeig Dani zuerst den Entwurf im Chat. Er entscheidet bei „geplant“ und „bewusst weggelassen“ mit. Die Begründung muss seine Entscheidung wiedergeben, nicht deine.
5. Erst nach seiner Freigabe in `docs/betriebs-checkliste.md` schreiben.

## Format der Datei
Pro Bereich eine Überschrift und eine Tabelle:

| Punkt | Status | Wie / Warum / Wo |
|---|---|---|

Am Ende eine kurze Zusammenfassung: Anzahl Punkte je Status.

## Regeln
- Keine Punkte erfinden, die nicht zur Applikation passen. Keine leeren Füllpunkte.
- Ehrlich bleiben: Der Laptop als Server und der Quick Tunnel ohne Uptime-Garantie sind bekannte Grenzen und gehören klar erwähnt.
