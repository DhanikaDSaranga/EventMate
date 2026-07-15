# EventMate 📅

EventMate is a cross-platform mobile application developed using React Native Expo. It allows users to manage, plan, and organize their events, from birthday parties to corporate conferences. 

## Features ✨

- **User Authentication:** Secure login and registration using Firebase Authentication.
- **Event Planning (CRUD):** 
  - **Create** new events with details like title, date, budget, event type, and notes.
  - **Read** and view all your upcoming and past events on a dynamic dashboard.
  - **Update** existing events easily.
  - **Delete** cancelled events.
- **Real-Time Data:** All event data is persistently stored using Firebase Realtime Database.
- **Dynamic Dashboard:** A beautiful, responsive UI showing total events, total budget, and quick actions.
- **Premium Aesthetics:** Built with a modern, glassmorphic UI, smooth interactions, and a polished dark-themed design.

## Tech Stack 🛠️

- **Framework:** React Native Expo (Expo Router)
- **State Management:** React Context API
- **Backend-as-a-Service (BaaS):** Firebase (Authentication & Realtime Database)
- **Styling:** Custom React Native Stylesheets

## Getting Started 🚀

### 1. Prerequisites
- Node.js and npm installed on your machine.
- Expo CLI installed (`npm install -g expo-cli`).
- Expo Go app installed on your physical mobile device (Android/iOS) OR an Emulator set up.

### 2. Installation
Clone the repository and install the required dependencies:

```bash
npm install
```

### 3. Firebase Setup
Create a `.env` file in the root of the project and add your Firebase Realtime Database URL:
```env
EXPO_PUBLIC_DATABASE_URL=https://your-firebase-url.firebasedatabase.app/
```
*(Make sure to also include other standard Firebase config variables if required by your setup).*

### 4. Running the App
Start the Expo development server:

```bash
npx expo start -c
```
Use your Expo Go app to scan the QR code and preview the application!

## Academic Requirements Met 🎓
- Data Persistence & Authentication (Firebase BaaS).
- State management via React Context (`AuthContext`, `LoaderContext`).
- Navigation using `expo-router`.
- RESTful-style operations via Firebase Realtime Database SDK.
- A unique and creative adaptation from the initial coursework template.

---
*Developed for final coursework submission.*
