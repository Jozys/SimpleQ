> [!WARNING]
> Disclaimer: SimpleQ was a project for the lecture "Software Engineering" held in the Baden-Württemberg Cooperative State University (DHBW) in the course TINF22B2. It is not meant to be a realworld application. Consider this project as deprecated and not maintained.
> The original repository is currently available under [this link](https://github.com/SE-TINF22B2/G6-SimpleQ)

> [!NOTE]
> One thing that was changed in contrast to the university project is the identity provider that is used. Originally it used a cloud instance from ORY, but for deployment purposes this was changed to Keycloak.

<div align="center">
  <img width="100%" src="https://github.com/SE-TINF22B2/G6-SimpleQ/assets/95375836/385836e4-f625-4915-8640-b734c7695e9d">
</div>

# SimpleQ: Eine schnelle, KI-gestützte Frageplattform

SimpleQ ist eine revolutionäre Frageplattform, die die Kraft der KI nutzt, um schnellere Antworten als traditionelle Plattformen zu liefern. Es geht aber nicht nur um KI. Sowohl Nutzer als auch Experten können Fragen beantworten, KI-Antworten bewerten und sich an bedeutungsvollen Diskussionen beteiligen.

## 👥 Nutzergruppen und Funktionen

SimpleQ spricht eine vielfältige Palette von Nutzergruppen an, die jeweils Zugang zu verschiedenen Funktionen haben. Wir glauben an Anonymität, weshalb wir die Möglichkeit bieten, an Q&A ohne Registrierung teilzunehmen. Um eine sichere und respektvolle Umgebung zu gewährleisten, werden wir einen Spam-Schutz und eine Blacklist für kontroverse Themen implementieren.

### 🎉 Förderung der Nutzerinteraktivität

Um die Nutzerinteraktivität zu fördern, bieten wir verschiedene Rollen an. Dies verbessert nicht nur das Nutzererlebnis, sondern trägt auch zur dynamischen Umgebung der Plattform bei.

---

## 📚 Dokumentation ([Wiki](../../wiki) und [Projects](https://github.com/orgs/SE-TINF22B2/projects/11/views/1))

🗃️ Die zusammengefassten Projektanforderungen befinden sich in dem [SimpleQ project - Anforderungen](https://github.com/orgs/SE-TINF22B2/projects/11/views/1). Diese sind nach dem MoSCoW Prinzip priorisiert und nach aktuellem Status sortiert.

📦 Die Arbeitspakete befinden sich in [SimpleQ project](https://github.com/orgs/SE-TINF22B2/projects/18/views/1).

📕 Im **[Wiki](https://github.com/SE-TINF22B2/G6-SimpleQ/wiki)** befinden sich die Informationen zur Projektidee, die detaillierte Anforderungsdokumentation, das Glossar und weitere wichtige Hinweise.

---

## 📂 Repository-Struktur

- `README.md`: Dieses Dokument.
- `/docs`: Ist ein Ordner für Dokumentationsspezifische Dateien
- `/backend`: Ordner für die Backend-Applikation, [README-Backend](https://github.com/SE-TINF22B2/G6-SimpleQ/blob/main/backend/README.md)
- `/frontend`: Ordner für die Frontend-Applikation, [README-Frontend](https://github.com/SE-TINF22B2/G6-SimpleQ/blob/main/frontend/README.md)

## 🧾 Starten des Projektes - Entwicklung

- `yarn setup`: Ausführung des Setups, installiert die benötigten Pakete für das Frontend und Backend, sowie die Datenbank
- `yarn start tunnel`: Startet den ORY-Tunnel für die Authentifizierung [Siehe](./backend/README.md)
- `yarn start-backend`: Startet den Webserver für das Backend im [Entwicklungsmodus](./backend/README.md)
- `yarn start-frontend`: Startet den Webserver, der das Frontend liefert

.
