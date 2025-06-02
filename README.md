# Xeno-CRM
A full-stack CRM campaign management platform featuring audience segmentation, Google OAuth authentication, and sleek aesthetics making campaign management easy.

1. Features:
  - Create and manage campaigns with flexible rule-based segmentation
  - Smart delivery logic: Messages are sent to 90% of matched customers, simulating real-world delivery success with 10% intentionally skipped!
  - Secure Google OAuth-based login
  - Real-time audience size preview
  - Modern responsive UI built with TailwindCSS and React
  - MongoDB-backed persistent campaign and log storage

2. Local Setup Instructions:
  Clone the Repository...
   
  git clone https://github.com/Mukund-github/Xeno-CRM.git
  cd Xeno-CRM

Setup Environment Variables...
   
  Create two .env files:
  server/.env

//not including sensitive data due to privacy concerns, however the source code is fully functional!

  PORT=5000
  MONGO_URI=your_mongodb_uri
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  SESSION_SECRET=your_session_secret
  CLIENT_URL=http://localhost:3000

client/.env
  REACT_APP_SERVER_URL=http://localhost:5000

3. Install Dependencies...

backend:
  cd server
  npm install

frontend:
  cd ../client
  npm install

4. Run the App Locally...
  Start the backend:
    cd ../server
    npm run dev
    Start the frontend:

Start the frontend:
  cd ../client
  npm start
Visit http://localhost:3000 to use the app.

5. Architecture diagram... (tried to portray the data flow keeping it simple and clean)
                                ┌─────────────────────────────┐
                                │      Google OAuth Server    │
                                └────────────┬────────────────┘
                                             │
                    OAuth Login              │
                                             ▼
┌─────────────────────────────┐    Passport.js (GoogleStrategy)    ┌───────────────────────────────┐
│         Client (React)      │◀──────────────────────────────────▶│       Express Backend         │
│                             │     - Login Button                 │  - Routes: /auth, /api/*      │
│  - Campaign Builder UI      │     - Campaign Forms               │  - Google OAuth Callback      │
│  - Rule Segmentation UI     │     - View Campaigns               │  - Segmentation Logic         │
│  - Audience Count Preview   │                                    │  - 90% Delivery Simulation    │
└────────────┬────────────────┘                                    └───────┬────────────────────────┘
             │                                                                  │
             ▼                                                                  ▼
        Session Cookie                                               ┌───────────────────────────────┐
        (client stores)                                              │           MongoDB             │
                                                                     │   (via Mongoose Atlas)          │
                                                                     │                               │
                                                                     │ ┌───────────────────────────┐ │
                                                                     │ │      customers            │ │
                                                                     │ │ - name, age, visits, etc. │ │
                                                                     │ └───────────────────────────┘ │
                                                                     │ ┌───────────────────────────┐ │
                                                                     │ │      orders               │ │
                                                                     │ │ - total_spent, timestamp  │ │
                                                                     │ └───────────────────────────┘ │
                                                                     │ ┌───────────────────────────┐ │
                                                                     │ │      campaigns            │ │
                                                                     │ │ - rules, metadata         │ │
                                                                     │ └───────────────────────────┘ │
                                                                     │ ┌───────────────────────────┐ │
                                                                     │ │ communicationLogs         │ │
                                                                     │ │ - status: delivered/skipped││
                                                                     │ └───────────────────────────┘ │
                                                                     └───────────────────────────────┘

   

Explanation of Entities and Flow...
Google OAuth Login Flow:
- Client triggers login → Passport.js handles Google login → successful login stores session cookie

- Express uses passport.authenticate() to protect routes and populate req.user

Segmentation Logic:
  When creating a campaign, rules (e.g., spend > 500, visits > 5) are evaluated

- Customers are fetched and matched based on customers and orders collections

Smart Campaign Delivery:
  90% of matched customers receive delivery (simulated)

- communicationLogs are created for each delivery: status: "delivered" or "skipped"

MongoDB Collections:

- customers: Base user info
- orders: Historical data used for segmentation
- campaigns: Saved campaigns and their targeting rules
- communicationLogs: Result of each delivery with customer IDs

6.  Summary of AI Tools and Other Tech Used...
  AI/Smart Logic Used:
    - 90% Smart Delivery Simulation: Campaign delivery logic includes a pseudo-random mechanism that simulates a real-world 90% success rate by skipping 10% of     matched customers. This models delivery behavior as seen in production-scale systems with imperfect reach to mimic real world CRM's.

 Note: No ML or external AI APIs were used; the smart delivery is logic-based and deterministic within randomized bounds.

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Frontend           | React, TailwindCSS                  |
| Backend            | Node.js, Express.js                 |
| Authentication     | Passport.js (Google OAuth Strategy) |
| Database           | MongoDB + Mongoose ODM              |
| Session Management | Express-Session + MongoDB Store     |
| Dev Tools          | Concurrently, dotenv, axios         |


7. Known Limitations or Assumptions...
  - AI Simulation, Not ML: The 90% delivery is logic-based, not a machine learning model — this is an intentional simplification to mimic probabilistic behavior.
  - Single Admin User Assumption: The CRM currently supports single-user login via Google. Multi-user or role-based access control is not implemented.
  - No Email/SMS Integration: Campaign "delivery" is internal only — there's no actual integration with messaging platforms (Twilio, SendGrid, etc.).
  - Hardcoded Client URL: OAuth redirect and CORS are currently configured for http://localhost:3000 and would need updates for production deployment.
  - No Pagination or Search: Lists (e.g., campaigns) are shown without pagination, filtering, or sorting — future improvements can add these for scalability.

