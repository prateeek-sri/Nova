# Nova — Premium AI Anime Chatbot

Nova is a high-performance, visually stunning AI chatbot dedicated to the "Big 3" anime: **One Piece**, **Naruto**, and **Bleach**. Built with Next.js, Gemini AI, and AstraDB, it provides deep, context-aware knowledge about characters, lore, and story arcs.

## 🚀 Features

-   **Deep Anime Knowledge**: Specialized expertise in One Piece, Naruto, and Bleach.
-   **Vector Search & RAG**: Uses AstraDB and Gemini Embeddings for highly relevant context retrieval.
-   **Premium UI/UX**: Modern dark-themed design with:
    -   Glassmorphism components
    -   Custom CSS animations (float, glow, shimmer)
    -   Space Grotesk typography
    -   Animated background orbs and grid overlays
-   **Real-time AI**: Powered by Google's Gemini 2.5 Flash for intelligent, streaming responses.
-   **Secure Auth**: Full user management via Clerk.
-   **Rate Limiting**: Integrated Upstash Redis to prevent abuse.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, Tailwind CSS, Lucide React
-   **AI/LLM**: Google Generative AI (Gemini)
-   **Vector DB**: AstraDB (DataStax)
-   **Auth**: Clerk
-   **Cache/Limit**: Upstash Redis
-   **Styling**: Vanilla CSS + Tailwind

## 🏁 Getting Started

### Prerequisites

-   Node.js >= 18
-   AstraDB Token & Endpoint
-   Google Gemini API Key
-   Clerk Publishable & Secret Keys
-   Upstash Redis URL & Token

### Installation

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/prateeek-sri/Nova.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment**: Create a `.env` file based on the required keys (Astra, Gemini, Clerk, Upstash).
4.  **Seed the Database**:
    ```bash
    npm run seed
    ```
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🧪 Seeding Data

The project includes a seed script `scripts/loadDb.ts` that scrapes anime data from Wikipedia and loads it into your AstraDB collection. Make sure your environment variables are set before running `npm run seed`.

---
Built with ❤️ for Anime fans.
