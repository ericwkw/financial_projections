# SaaS Vision AI

**An AI-powered financial simulator to stress-test your SaaS for investors.**

SaaS Vision AI is a comprehensive flight simulator for your business. It allows you to model subscriptions, expenses, and growth scenarios to answer the ultimate question: *"Is this business fundable?"*

Powered by **Gemini AI**, it acts as an on-demand "CFO" to critique your unit economics, providing brutal, VC-style feedback on your efficiency and runway.

> **Note:** This application is currently optimized for the **Hong Kong (HKD)** market context, but the financial logic applies globally.

## 🚀 Key Features

*   **Strict Unit Economics:** Automatically isolates **Paid Cohorts** to calculate accurate CAC and LTV. It prevents viral free users from inflating your marketing efficiency metrics.
*   **Gemini CFO Agent:** Uses Google Gemini 2.5 Flash to analyze your P&L. It bridges the gap between raw expenses and "Burn Rate" to provide accurate survival analysis.
*   **5-Year Scenario Planning:** Test "What If" scenarios with sliders for Viral Rate, Churn, Expansion Revenue, and Payroll Inflation.
*   **Cash Flow Engine:** Distinguishes between **Accrual Revenue (MRR)** and **Cash Balance**. It correctly handles the cash-flow advantage of annual plans (upfront payments).
*   **Transparency Mode:** A dedicated "Formulas" tab ("White Box") showing the exact math behind every metric (Rule of 40, Magic Number, Burn Multiplier).
*   **Export/Import:** Save your "Bull Case" and "Bear Case" scenarios to JSON files to share with co-founders or investors.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS (Dark Mode enabled)
*   **Charts:** Recharts (Responsive Composed Charts)
*   **AI:** Google GenAI SDK (Gemini 2.5 Flash)
*   **Icons:** Lucide React

## 📦 Installation & Setup

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
    Create a `.env` file in the root directory. You need a Google Gemini API Key for the AI features to work.
    ```env
    API_KEY=your_gemini_api_key_here
    ```
    *(Get a key at [aistudio.google.com](https://aistudio.google.com))*

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 📖 How to Use

1.  **Model Inputs (The "Now"):**
    *   Enter your **Plans** (Pricing, Setup Fees, Variable Costs).
    *   Add your **Team** (Salaries are auto-adjusted for Tax Load).
    *   List **Expenses** (Tag Marketing spend as "CAC" for accurate tracking).
2.  **Scenarios (The "Future"):**
    *   Use the top bar sliders to adjust **Growth Rates**, **Churn**, and **Viral Loops**.
    *   See how **Salary Inflation** and **Sales Commissions** impact your long-term cash.
3.  **Analysis (The "Truth"):**
    *   Check the **Investor Dashboard** for North Star metrics.
    *   Click **"Run Analysis"** to let the AI critique your model.
    *   Export the data to CSV or JSON.

## 📊 Logic & Formulas

SaaS Vision AI uses strict VC definitions to prevent "Vanity Metrics":

*   **Rule of 40:** `Annualized Paid Revenue Growth % + Profit Margin %`. (We ignore free user growth).
*   **CAC:** `(Marketing Spend + New Deal Commissions) / New PAYING Customers`.
*   **LTV:** `(ARPPU * Recurring Gross Margin) / Paid Churn Rate`.
*   **Magic Number:** `Net New ARR / Monthly Marketing Spend`.
*   **Burn Multiplier:** `Net Monthly Burn / Net New ARR`.

See the **"Formulas"** tab inside the app for a deep dive into every equation.

## 📄 License

MIT