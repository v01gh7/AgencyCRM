# 🧠 AgencyCRM
### Automation of the company's advertising department

---

## 🚀 About the project
**AgencyCRM** is an internal system for automating the work of the company's advertising department.

Its purpose is to eliminate human error, speed up data collection and analysis,
and make advertising campaign management **transparent, accurate, and effective**.

---

## 🎯 Goals and Objectives

- 📊 Automatic statistics collection from **Google Ads** and **Yandex Metrica** via official APIs.
- 🔁 Daily data updates (or upon request) without human intervention.
- 🔒 Centralized access through a single service account:
- **Google Ads MCC** — access to client dashboards.
- **Yandex Metrica** — shared access to counters.
- 🧩 Minimizing errors when manually uploading reports.
- ⚡ Accelerating decision-making and increasing analytics accuracy.

---

## 🧰 Tech Stack

| Component | Technology |
|-----------|-------------|
| **Frontend** | Vue 3 (TypeScript) |
| **Backend** | Python (FastAPI) *(Go / PHP options are being considered)* |
| **Data Sources** | Google Ads API, Yandex Metrica API |
| **Authorization** | OAuth2 (Google / Yandex) |
| **Data Storage** | PostgreSQL (or similar) |

---

## 💡 Advantages

- ✅ **APIs are completely free** — Google and Yandex limits allow for tens of thousands of requests per day.

- 🔗 Simple client connection — access granted without complex authorization.

- 📈 Centralized access to advertising accounts and counters.

- 🧩 Scalable for any number of clients.

- 🕒 Up-to-date data without manual intervention.

---

## 🔮 Development Plans

- 📊 Adding interactive dashboards and metric visualizations.

- 🧾 CRM integration for end-to-end analytics.

- 🔔 Notifications about key changes in Telegram / Slack.

- 🤖 Using ML algorithms to optimize advertising campaigns.

---

## ⚙️ Installation (preliminary)

```bash
# Cloning the repository
git clone https://github.com/v01gh7/agencycrm.git
cd gm-adhub

# Installing dependencies (frontend)
cd frontend
pnpm install

# Installing dependencies (backend)
cd ../backend
pip install -r requirements.txt
````

*(The exact structure and instructions will appear after selecting the backend)*

---

## 📌 Project Status

The project is in the **API design and integration stage**.
The main goal of the current stage is to implement a connection to **Google Ads** and **Yandex Metrica**,
ensure stable data loading, storage, and updates.