# 🌿 CarbonKanakku - Your ESG Compliance Co-Pilot
**LIVE LINK** - [https://carbon-kanakku-demo.firebaseapp.com/](https://carbon-kanakku-demo.firebaseapp.com/)

An AI-powered ESG platform designed for India's textile industry. CarbonKanakku empowers Small and Medium-sized Businesses (SMBs) to effortlessly track emissions, analyze their carbon footprint, ensure compliance, and generate professional sustainability reports, turning complex environmental data into actionable insights.

---

## ✨ Features

### 🤖 AI-Powered Sustainability (Using Google's Gemini API)
- **AI Sustainability Reports**: Automatically generate comprehensive sustainability reports from raw operational data, complete with emission calculations, trend analysis, and a sustainability score.
- **Tailored Reduction Strategies**: The AI analyzes your company's data to suggest specific, actionable strategies for reducing your carbon footprint.
- **Automated Compliance Summaries**: Instantly summarize complex ESG mandates, government incentives, and legal documents using AI to keep your business ahead of regulatory changes.

### 📈 Core Platform Features
- **Live ESG Dashboard**: A real-time overview of your company's current carbon footprint, recent activity, compliance deadlines, and AI-powered insights.
- **Industry-Specific Data Input**: Customized data input modules tailored to different textile subdomains (Spinning, Weaving, Dyeing, etc.) to capture the right metrics.
- **Data Analysis & Visualization**: Interactive charts and graphs visualize your carbon footprint, trend analysis over time, and comparative benchmarks against industry averages.
- **Knowledge Hub**: A centralized resource for the latest ESG news, textile innovations, and key Indian environmental regulations.

### 🔐 Authentication & Data Management (Firebase)
- **Secure User Authentication**: Robust user registration and login with Email/Password and Google Sign-In, powered by Firebase Authentication.
- **User & Company Profiling**: Manage user profiles and detailed company information, including location, capacity, and subdomain, all stored securely in Firestore.
- **Isolated Data Submissions**: Each company's data submissions are stored and analyzed separately, ensuring data privacy and security.

### 📱 Modern UI & Tech
- **Professional UI/UX**: A clean, modern, and responsive interface built with Next.js, React, ShadCN UI, and TailwindCSS.
- **Themed Design**: A calming and professional theme with a forest green and sage color palette that reflects the app's sustainability mission.
- **Built for Performance**: Leverages Next.js App Router and Server Components for a fast, optimized user experience.

---

## 🚀 Tech Stack

- **Frontend**:
  - **Next.js 15**: React framework for Server and Client Components.
  - **React 18**: For building the user interface.
  - **TypeScript**: For type safety and robust code.
  - **TailwindCSS**: For utility-first styling.
  - **ShadCN UI**: A set of reusable and accessible UI components.
  - **Recharts**: For creating beautiful and interactive charts.

- **Backend & AI**:
  - **Firebase**: A comprehensive platform for backend services.
    - **Firestore**: NoSQL database for user profiles, company data, and submissions.
    - **Firebase Authentication**: For secure user management.
    - **Firebase App Hosting**: For seamless deployment and hosting.
  - **Genkit (with Google's Gemini API)**: Powers all generative AI features, including report generation, recommendations, and document summarization.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+ and npm
- A Firebase project with Firestore and Authentication enabled.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd carbon-kanakku
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of your project and add your Firebase project credentials. You can find these in your Firebase project settings.

```env
# Firebase App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google AI (Gemini) API Key for Genkit
# Get your key from Google AI Studio
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

### 4. Set Up Firebase
1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your project, enable **Firestore Database** and **Authentication**.
3.  For Authentication, enable the **Email/Password** and **Google** sign-in providers.
4.  Navigate to Project Settings (click the gear icon) and find your web app's configuration credentials to populate the `.env` file.

### 5. Get Google AI API Key
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a new API key.
3.  Add this key to your `.env` file as `GOOGLE_GENAI_API_KEY`.

---

## 🏃 Running Locally

To run the app in development mode, use the following command:

```bash
npm run dev
```

This will start the Next.js development server, typically on `http://localhost:9002`.

---

## 📁 Project Structure

```
carbon-kanakku/
├── src/
│   ├── app/                    # Next.js App Router: Pages and layouts
│   │   ├── (dashboard)/        # Dashboard routes (protected)
│   │   ├── api/                # API routes (if any)
│   │   ├── hub/                # ESG Hub page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   └── page.tsx            # Landing page
│   ├── ai/                     # Genkit AI flows and configuration
│   │   ├── flows/              # AI feature implementations
│   │   └── genkit.ts           # Genkit setup
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # ShadCN UI components
│   │   └── site-header.tsx     # Main site header
│   ├── firebase/               # Firebase setup and hooks
│   │   ├── auth/               # Authentication hooks (useUser)
│   │   ├── firestore/          # Firestore hooks (useDoc, useCollection)
│   │   └── index.ts            # Firebase initialization
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and constants
│   └── styles/                 # Global CSS and Tailwind setup
├── public/                     # Static assets (images, fonts)
├── .env                        # Environment variables (private)
├── next.config.ts              # Next.js configuration
└── package.json                # Project dependencies
```

---

## 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---
Made with ❤️ for a greener future.
