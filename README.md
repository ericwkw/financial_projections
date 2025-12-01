# SaaS Vision AI

**Investor-Grade Financial Modeling for SaaS Founders.**

SaaS Vision AI is a comprehensive flight simulator for your business. It allows you to model subscriptions, expenses, and growth scenarios to answer the ultimate question: *"Is this business fundable?"*

Powered by **Gemini AI**, it provides an on-demand "CFO" to critique your unit economics and strategy.

## 🚀 Key Features

*   **Strict Unit Economics:** Automatically isolates **Paid Cohorts** to calculate accurate CAC and LTV, preventing viral free users from inflating your metrics.
*   **Gemini CFO:** Uses Google Gemini 2.5 Flash to analyze your P&L, providing brutal, VC-style feedback on your efficiency and runway.
*   **Scenario Planning:** Test "What If" scenarios with sliders for Viral Rate, Churn, Expansion Revenue, and Payroll Inflation.
*   **Cash Flow vs. Revenue:** Distinguishes between Accrual Revenue (MRR) and Cash Balance (Bank Account), correctly handling annual plan up-front payments.
*   **Transparency Engine:** A dedicated "Formulas" tab ("White Box") showing the exact math behind every metric (Rule of 40, Magic Number, Burn Multiplier).
*   **Export/Import:** Save your "Bull Case" and "Bear Case" scenarios to JSON files.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS (Dark Mode enabled)
*   **Charts:** Recharts
*   **AI:** Google GenAI SDK (Gemini 2.5 Flash)
*   **Icons:** Lucide React

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/saas-vision-ai.git
    cd saas-vision-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your Google Gemini API Key:
    ```env
    API_KEY=your_gemini_api_key_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 📊 Logic & Formulas

SaaS Vision AI uses strict VC definitions for its calculations:

*   **Rule of 40:** Uses **Annualized Revenue Growth** (not user growth) + Profit Margin.
*   **CAC:** `Sales & Marketing Spend / New PAYING Customers`. (Ignores free users).
*   **LTV:** `(ARPPU * Gross Margin) / Paid Churn Rate`.
*   **Magic Number:** `Net New ARR / Monthly Marketing Spend`.
*   **Burn Multiplier:** `Net Monthly Burn / Net New ARR`.

See the **"Formulas"** tab inside the app for a deep dive into every equation.

## 📄 License

MIT