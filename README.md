# Daily-quote-journal
## 📝 Daily Journal Web App

A simple full-stack web app to write, save, and delete your daily thoughts, featuring an inspirational quote every time you visit.

### ✨ Features

- Get a random inspirational quote
- Add new journal entries
- View all past entries
- Delete entries you no longer want
- All entries saved locally in a JSON file (server-side)

---

### 💻 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Data Storage**: JSON file (`entries.json`)
- **API**: [ZenQuotes API](https://zenquotes.io/)

---

### ⚛️ How to Run Locally

1. **Clone the repo**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
node backend/server.js
```

4. **Open `index.html`** in your browser  
> Or run a Live Server if you're using VS Code

---

### 🗃️ Project Structure

```
📁 backend
🔝 server.js         # Express backend server
🔝 entries.json      # Stores journal entries

📁 frontend
🔝 index.html        # Webpage
🔝 style.css         # Styling
🔝 script.js         # Frontend logic
```

---

### 🌐 Live Demo

*Coming soon!* (Deploy using Netlify + Render)

---

### 🙌 Acknowledgements

- Quote API by [ZenQuotes](https://zenquotes.io/)

---

### 📌 To-Do Ideas

- [ ] Add edit functionality
- [ ] Add dark mode toggle
- [ ] Save entries in localStorage or a real database
- [ ] Mobile responsiveness

