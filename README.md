# 📍 Roadmap Tracker

A simple and interactive **Roadmap Tracker** web app built using **HTML, CSS, and JavaScript**, designed to help users plan, track, and visualize their learning progress or goals.  

It features real-time progress tracking, task management, completion visualization, and motivational feedback when all tasks are completed ✅.

---

## 🚀 Features

### 📝 Task Management
- Add new tasks with a title and description.  
- Edit or delete existing tasks easily.  
- Tasks are automatically saved in **LocalStorage** (no data loss on refresh).  

### ✅ Progress Tracking
- Track completion progress dynamically with a **progress bar** and **Chart.js graph**.  
- When all tasks are marked complete:
  - A **positive motivational message** appears 🎉  
  - A **summary table** is displayed showing task titles with their **completion date**.

### 📊 Saved Roadmaps
- Save multiple roadmaps for different goals or subjects.  
- Quickly switch between saved roadmaps to manage various learning plans.  

### 💾 LocalStorage Integration
- All roadmaps and task data are stored in **browser LocalStorage**.  
- No backend or database required.  

### 💡 Smart UI Behavior
- Positive message and table hide automatically when a task is marked pending again.  
- Clean and responsive layout for both desktop and mobile.  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Structure and layout |
| **CSS3** | Styling and responsiveness |
| **JavaScript (ES6)** | App logic and LocalStorage handling |
| **Chart.js** | Visual progress chart |

---

## 📷 Preview

![Roadmap Tracker Screenshot](https://via.placeholder.com/800x400?text=Roadmap+Tracker+Preview)

---

## ⚙️ How It Works

1. Enter task details and click **Add Task**.  
2. Check tasks as completed when done.  
3. Once all are complete:
   - A **motivational message** appears.
   - A **summary table** shows completion dates.  
4. If any task is unchecked, the message and table hide automatically.  

---

## 📁 Project Structure

