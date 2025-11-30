# Cuby Smart Energy Advisor ⚡️

> A Context-Aware AI Sales Agent & ROI Calculator built for Cuby.mx.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_16_|_Gemini_AI_|_Tailwind-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

**Cuby Smart Energy Advisor** is a specialized sales tool designed to demonstrate the value of **Cuby G4** smart AC controllers. It bridges the gap between raw data and persuasive sales conversations by combining a hard-logic **ROI Calculator** with a soft-skill **AI Chatbot**.

The core philosophy is **Context-Awareness**: The AI doesn't just chat; it "watches" the user interact with the calculator. If a user indicates they run their ACs 24/7 in a Data Center, the AI instantly adapts its pitch to focus on *reliability* and *uptime* rather than just *cost savings*.

## 🎯 The Problem
Selling IoT devices for energy management is complex because the value proposition shifts drastically depending on the customer:
*   **Homeowners:** Care about monthly electricity bills and comfort.
*   **Hotels/Airbnbs:** Care about guests leaving ACs on when rooms are empty.
*   **Data Centers:** Care about critical infrastructure safety, overheating, and redundancy.
*   **Schools:** Care about centralized scheduling and preventing unauthorized usage.

A static, one-size-fits-all calculator fails to address these specific pain points.

## 💡 The Solution
A **Hybrid Interface** that synchronizes state between a calculator and an AI agent.

### Key Features

1.  **Context Injection (RAG-Lite)**
    *   The AI model receives real-time updates from the calculator's state.
    *   **Example:** User sets "Hours/Day" to 24.
    *   **AI Reaction:** "I notice you're running your ACs continuously. This is typical for server rooms. Are you looking for redundancy protection?"

2.  **Multi-Vertical Architecture**
    The application supports distinct profiles with tailored logic and defaults:
    *   🏠 **Home Mode:** Optimizes for residential tariff tiers and comfort.
    *   🏨 **Hotel Mode:** Focuses on "Auto-off" features for guest management.
    *   🖥️ **Data Center Mode:** Prioritizes high-temp alerts and 24/7 uptime.
    *   🎓 **School Mode:** Emphasizes mass-scheduling and remote locks.

3.  **Real-Time ROI Calculation**
    *   Calculates estimated monthly spend based on tariff, usage hours, and AC count.
    *   Applies a "Temperature Penalty" for settings below 24°C (approx. 5% extra cost per degree).
    *   Projects savings with Cuby's efficiency algorithms (~30% savings).
    *   Determines the **Break-even Point** (months until the device pays for itself).

4.  **Smart Lead Capture**
    *   The "Talk to Human" modal pre-fills inquiry subjects based on the active vertical (e.g., *"Enterprise Quote for Data Center"* vs. *"Home Installation Inquiry"*).


## 🛠️ Tech Stack

*   **Frontend Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript (Strict Mode)
*   **AI Integration:** Vercel AI SDK + Google Gemini Provider
*   **Styling:** TailwindCSS + Lucide Icons
*   **Visualization:** Recharts (for savings projections)
*   **State Management:** React Context API

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   npm or yarn
*   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cuby-energy-advisor.git
    cd cuby-energy-advisor
    ```

2.  **Install dependencies:**
    ```bash
    # Navigate to the app directory if needed, or install from root if workspace is set up
    cd cuby-energy-advisor
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the `cuby-energy-advisor` directory:

    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  **Open in Browser:**
    Visit `http://localhost:3000` to see the application.

## 📂 Project Structure

```
.
├── .context/               # Context Engineering files (The "Brain" of the project)
│   ├── 01_project_context.md
│   ├── 02_product_requirements.md
│   └── ...
├── cuby-energy-advisor/    # Main Next.js Application
│   ├── app/                # App Router pages and layouts
│   ├── components/         # React components (Calculator, Chat, UI)
│   ├── context/            # Global State (CalculatorContext)
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
└── README.md               # This file
```

## 🧠 Context Engineering

This project utilizes a **Context-Driven Development** approach. The `.context/` folder contains high-level documentation that serves as the "source of truth" for both human developers and AI assistants.

*   `02_product_requirements.md`: Defines the business logic for ROI calculations and vertical profiles.
*   `05_knowledge_base.md`: Contains specific product details about Cuby G4.
*   `06_chatbot_persona.md`: Defines the tone and behavior of the AI sales agent.
