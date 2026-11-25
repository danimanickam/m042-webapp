# Ablauf – Phase für Phase

So arbeitest du: Den Prompt jeder Phase kopierst du in Claude Code. Claude stellt den Plan vor, du gibst ihn frei, Claude setzt um. Danach prüfst du selbst, was unter **Du prüfst** steht. Erst dann geht es zur nächsten Phase.

Tipp: Mit `Shift+Tab` schaltest du in Claude Code in den Plan-Modus. Claude plant dann nur und ändert noch nichts.

---

## Phase 0a – Claude-Code-Konfiguration aktivieren (einmalig)
**Prompt:**
> Verschiebe den Inhalt von _claude-setup/ nach .claude/ (settings.json nach .claude/settings.json, skills/ nach .claude/skills/) und lösche danach den leeren Ordner _claude-setup. Zeig mir anschliessend die Struktur von .claude/.

**Du prüfst:** `.claude/settings.json` und `.claude/skills/betriebs-checkliste/SKILL.md` existieren, `_claude-setup` ist weg. Danach Claude Code mit `/exit` beenden und mit `claude` neu starten. Erst dann gelten die Berechtigungen und der Skill.

---

## Phase 0 – Voraussetzungen prüfen
**Prompt:**
> Lies CLAUDE.md und docs/aufgabe.md. Prüf dann, was auf meinem Mac für diese Übung vorhanden ist: Docker inkl. Compose, git, GitHub CLI (`gh`) mit Login, Homebrew. Installier noch nichts. Zeig mir eine Liste mit vorhanden / fehlt / nicht eingeloggt und schlag vor, wie ich das Fehlende gratis installiere.

**Du prüfst:** Die Liste ist plausibel. Fehlt Docker, installierst du Docker Desktop selbst. Docker Desktop ist für die private Nutzung und die Ausbildung gratis. Starte Docker danach einmal, bis das Wal-Symbol in der Menüleiste ruhig ist.

---

## Phase 1 – Gesamtplan
**Prompt:**
> Erstell einen Umsetzungsplan für die ganze Übung gemäss CLAUDE.md: Architektur (welche Container, welches Image, welcher Update-Dienst für M4 und warum), Ablauf der Phasen 2–7 und welche Dateien entstehen. Noch nichts umsetzen.

**Du prüfst:** Sind alle Vorgaben (1–7) und M1–M4 im Plan abgedeckt? Kostet etwas? Verstehst du jeden Baustein? Frag nach, bis du ihn verstehst, und gib dann frei.

---

## Phase 2 – App + Datenbank lokal (M1, M3)
**Prompt:**
> Setz Phase 2 um: App und Datenbank als getrennte Container mit docker compose, Besucherzähler in der DB, Healthcheck-Endpoint mit DB-Prüfung, Named Volume für die Daten. Secrets nur in .env (zufällig generiert, nicht anzeigen), .env.example ins Repo. Starte alles lokal und zeig mir, wie ich es prüfe.

**Du prüfst:**
- `http://localhost:<Port>` im Browser zeigt die Zeile aus dem Ziel. Die Version darf lokal noch „dev“ o. ä. sein.
- Neu laden → die Besucher-Nr. steigt.
- Der Healthcheck-Endpoint antwortet mit OK.
- Claude soll die Container neu starten (nicht mit `-v`!). Danach muss die Besucher-Nr. weiterzählen und darf nicht bei 1 beginnen.

---

## Phase 3 – GitHub-Repository (M2)
**Prompt:**
> Leg ein öffentliches GitHub-Repository an und push den Stand auf main. Prüf vorher, dass .env nicht committet wird. Aktivier, wenn möglich, Secret Scanning / Push Protection und sag mir, ob ich dazu etwas in den GitHub-Einstellungen machen muss.

**Du prüfst:** Auf github.com im Repo: keine `.env`, nur `.env.example` mit Platzhaltern. Unter Settings → Code security sind Secret Scanning und Push Protection aktiv.

---

## Phase 4 – Image mit GitHub Actions bauen (Vorgabe 5)
**Prompt:**
> Erstell einen GitHub-Actions-Workflow, der bei jedem Push auf main das Docker-Image für linux/arm64 baut, den Commit-Hash ins Image schreibt und es nach ghcr.io pusht. Push ihn und zeig mir das Ergebnis des Laufs.

**Du prüfst:** Im Repo unter „Actions“ ist der Lauf grün. Unter „Packages“ ist das Image sichtbar und **öffentlich**. Ist es privat, beschreibt dir Claude, wie du es umstellst.

---

## Phase 5 – Auto-Deployment auf dem Laptop (M4)
**Prompt:**
> Stell docker compose so um, dass die App das Image aus ghcr.io verwendet, und richte den Update-Dienst ein, der neue Images automatisch zieht und die App neu startet. Nur der App-Container soll automatisch aktualisiert werden, nicht die DB.

**Du prüfst:** Die Seite zeigt jetzt als Version den Commit-Hash des letzten Commits (vergleiche mit GitHub → Commits).

---

## Phase 6 – Öffentlich über Cloudflare Quick Tunnel (Vorgabe 6, Ziel)
**Prompt:**
> Ergänz einen cloudflared-Container für einen Cloudflare Quick Tunnel auf die App und zeig mir, wie ich die aktuelle öffentliche URL finde.

**Du prüfst:** Die `https://…trycloudflare.com`-URL auf dem Handy öffnen, **im Mobilnetz statt im WLAN**. Die Seite zeigt alle vier Angaben, und das Schloss-Symbol ist da.

---

## Phase 7 – Push auf main geht ohne Handarbeit live (M4 End-to-End)
**Prompt:**
> Mach eine kleine sichtbare Änderung (z. B. Text oder Farbe), commit und push auf main. Danach rührst du nichts mehr an. Sag mir nur, wie lange es ungefähr dauert, bis die Änderung live ist.

**Du prüfst:** Ohne dass du oder Claude etwas tun, zeigt die öffentliche URL nach ein paar Minuten die Änderung und den neuen Commit-Hash.

---

## Phase 8 – Betriebs-Checkliste
**Prompt:**
> Erstell mit dem Skill betriebs-checkliste den Entwurf der Betriebs-Checkliste. Zeig ihn mir zuerst im Chat.

**Du prüfst:** Alle 6 Bereiche sind vorhanden, jeder Punkt hat einen Status mit Wie/Warum. Du entscheidest bei „geplant“ und „bewusst weggelassen“ mit. Erst dann schreibt Claude die Datei.
