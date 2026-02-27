# VitalAI

Your personal health operating system.

## Version 1 Features

*   **Auth**: Secure Authentication with Clerk (Sign up, Sign in, Provider Logins).
*   **Database**: PostgreSQL integration mapping Clerk IDs to local User records via webhooks.
*   **Health Profile**: Comprehensive health profiling including vital settings, allergies, medical conditions, and lifestyle habits.
*   **Calculations**: Automatic computation of BMI, BMR, and Daily Caloric targets based on user goals.
*   **Dashboard Shell**: Functional sidebar, mobile menu, and header dashboard integrating core profile data.

## Setup Instructions

### Prerequisites
*   Node.js 18+
*   PostgreSQL running locally (or remote DB)
*   A Clerk account (https://clerk.com/)

### Installation

1.  **Clone the repository and install dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Fill in the values in `.env`:
    *   Set `DATABASE_URL` to your PostgreSQL connection string.
    *   Get the Clerk keys from your Clerk Dashboard (API Keys section).

3.  **Database Migration**
    Initialize the database schema:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

4.  **Clerk Webhook Setup**
    *   Go to your Clerk Dashboard -> Webhooks.
    *   Add an endpoint pointing to `http://your-local-ip:3000/api/webhooks/clerk` (You may need ngrok or similar to expose your localhost to Clerk during development).
    *   Subscribe to the `user.created` event.
    *   Copy the Signing Secret and paste it as `WEBHOOK_SECRET` in your `.env` file.

5.  **Run the development server**
    ```bash
    npm run dev
    ```

6.  **Access the application**
    Open your browser and visit `http://localhost:3000`.
