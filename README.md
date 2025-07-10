# SMS Messenger App

##  About

My SMS Messenger is a full-stack web application that allows users to register/login, send SMS messages using Twilio, and track real-time delivery status. Built as a modern, secure messaging platform, it leverages JWT-based authentication and a scalable backend architecture.

**Live Demo**: [guileless-llama-116fdb.netlify.app](https://guileless-llama-116fdb.netlify.app)
---

## Tech Stack

**Frontend**  
- Angular  
- TailwindCSS  
- Netlify (Deployment)

**Backend**  
- Ruby on Rails 8 (API-only mode)  
- MongoDB Atlas (Mongoid ODM)  
- Devise + JWT for authentication  
- Twilio API for SMS  
- Render (Deployment)

---

## Features

- User Signup & Login (JWT-based)
- Responsive, modern UI with TailwindCSS
- Send SMS via Twilio API
- Realtime delivery status updates via Twilio Webhooks
- Input validation on both frontend and backend
- Secure cookie-free authentication (JWT)
- Deployed on Netlify (frontend) and Render (backend)

---

## Installation

### 1. Clone both repositories

```bash
git clone https://github.com/yourusername/sms-messenger-api.git
git clone https://github.com/yourusername/sms-messenger-angular.git
````

---

### 2. Backend Setup (Rails API)

```bash
cd sms-messenger-api
bundle install
```

#### Create `.env` file:

```bash
touch .env
```

Add the following environment variables:

```env
MONGODB_URI=<your-mongodb-atlas-uri>
RAILS_ENV=development
SECRET_KEY_BASE=<your-rails-secret>
DEVISE_KEY=<your-jwt-secret>
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER_FROM=<your-twilio-from-number>
TWILIO_PHONE_NUMBER_TO=<your-free-to-number>
```

Then start the Rails server:

```bash
rails s
```

---

### 3. Frontend Setup (Angular)

```bash
cd sms-messenger-angular
npm install
```

#### Add API URL to `src/environments/environment.ts`

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

Then run the frontend:

```bash
ng serve
```

---

## Environment Variables

| Key                        | Description                   |
| -------------------------- | ----------------------------- |
| `MONGODB_URI`              | MongoDB Atlas connection URI  |
| `SECRET_KEY_BASE`          | Rails secret key base         |
| `DEVISE_KEY`               | JWT secret used by Devise JWT |
| `TWILIO_ACCOUNT_SID`       | Twilio SID                    |
| `TWILIO_AUTH_TOKEN`        | Twilio auth token             |
| `TWILIO_PHONE_NUMBER_FROM` | Your Twilio sender number     |
| `TWILIO_PHONE_NUMBER_TO`   | Recipient number (free plan)  |

---

## Usage

1. Open `http://localhost:4200`
2. Sign up or log in
3. View your messages
4. Click "New Message" to send SMS
5. Message status updates automatically from Twilio webhook

---

## API Reference

| Endpoint           | Method | Description                   |
| ------------------ | ------ | ----------------------------- |
| `/signup`          | POST   | Register new user             |
| `/login`           | POST   | Authenticate and return JWT   |
| `/api/messages`    | GET    | List user’s messages          |
| `/api/messages`    | POST   | Send a new message via Twilio |
| `/api/twilio/status` | POST   | Twilio callback for status    |

---

## Lessons Learnt

* Cross-origin authentication using JWT is cleaner and safer than cookies for SPA + API setups
* Devise works well with custom JWT workflows using `devise-jwt`
* CORS, secure headers, and token exposure need special attention in production
* MongoDB and Rails (via Mongoid) make for a fast, flexible backend
* Tailwind makes UI development efficient and modular
* Twilio status webhooks allow real-time delivery feedback

---

## Future Improvements

* Add mobile friendly views
* Add Account/Profile Button
* Add pagination for messages
* Allow multiple phone numbers per user
* Support message history export (PDF/CSV)
* Add message templates
* WebSocket-based real-time updates (instead of polling)
* Enforce strong passwords
* 2FA during login
* Look into security concerns such as: input output validation, JWT handling, MongoDB injection

---
