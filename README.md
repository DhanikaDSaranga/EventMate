# EventMate 📅

![EventMate Banner](https://img.shields.io/badge/Status-Completed-success) ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) ![Expo](https://img.shields.io/badge/Expo-1B1F23?style=flat&logo=expo&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)

**EventMate** is a beautifully designed, cross-platform mobile application developed using React Native and Expo. It empowers users to seamlessly manage, plan, and organize their events—ranging from casual birthday parties to large corporate conferences.

With a focus on premium aesthetics, dynamic user interfaces, and robust functionality, EventMate serves as a digital assistant that ensures you never miss a beat when it comes to event planning.

---

## 📱 Download the App (APK)

You can download and test the fully functional Android application directly using the link below:

📥 **[Download EventMate APK (Latest Release)](https://github.com/DhanikaDSaranga/EventMate/blob/main/EventMate.apk?raw=true)**

*(Alternatively, you can find the `EventMate.apk` file directly in the root of this repository.)*

---

## ✨ Key Features

- **User Authentication:** Secure login and registration powered by Firebase Authentication.
- **Comprehensive Event Planning (CRUD):** 
  - **Create** new events with comprehensive details (title, date, budget, event type, and notes).
  - **Read** and view all upcoming and past events on a dynamic, at-a-glance dashboard.
  - **Update** existing event details effortlessly.
  - **Delete** cancelled or past events to keep your dashboard clean.
- **Real-Time Data Sync:** All event data is persistently and securely stored using Firebase Realtime Database, ensuring your data is always up-to-date across devices.
- **Dynamic Dashboard:** A visually stunning, responsive UI that displays your total active events, total budget utilization, and quick action shortcuts.
- **Premium Aesthetics:** Built with a modern, glassmorphic UI, smooth micro-interactions, tailored color palettes, and a polished dark-themed design.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (Expo Router for file-based navigation)
- **State Management:** React Context API (`AuthContext`, `LoaderContext`)
- **Backend-as-a-Service (BaaS):** Firebase (Authentication & Realtime Database)
- **Styling:** NativeWind (Tailwind CSS) & Custom React Native Stylesheets
- **Language:** TypeScript for robust, type-safe code

## 🚀 Getting Started

If you wish to run the project locally on your machine, follow these steps:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) and npm installed on your machine.
- Expo CLI installed globally (`npm install -g expo-cli`).
- Expo Go app installed on your physical mobile device (Android/iOS) OR a configured Emulator (Android Studio/Xcode).

### 2. Installation
Clone the repository and install the required dependencies:

```bash
git clone https://github.com/DhanikaDSaranga/EventMate.git
cd EventMate
npm install
```

### 3. Firebase Setup
Create a `.env` file in the root directory of the project and add your Firebase Realtime Database URL and other necessary config details:
```env
EXPO_PUBLIC_DATABASE_URL=https://your-firebase-url.firebasedatabase.app/
```

### 4. Running the App
Start the Expo development server:

```bash
npx expo start -c
```
Use your Expo Go app to scan the QR code and preview the application on your device!


*Developed by S.D. Dhanika D Saranga for final coursework submission.*
