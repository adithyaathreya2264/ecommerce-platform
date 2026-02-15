# Curator's Gallery: Link Verified E-Commerce Platform

## Project Overview

Curator's Gallery is a simplified e-commerce platform designed to allow users to showcase products alongside external purchase links. The core security feature of this application is the server-side validation of every submitted purchase link, ensuring that uploaded products are tied to live, trusted retail pages (specifically Amazon and Flipkart, as configured).

If a user attempts to upload a link that is broken, expired, or belongs to an untrusted domain, the upload is blocked with a clear error message.

## **Key Features**

- Robust Link Verification: The backend performs multi-stage checks on the external purchase link:
- Trusted Domain Check: Ensures the link belongs to a whitelisted retailer (Amazon, Flipkart).
- Live Status Check: Sends an HTTP request (with a mocked browser User-Agent) to verify the link returns a 200 OK status code, preventing dead links and 404s.
- Redirection Check: Handles short-links or redirects to ensure the final destination is also trusted.
- Curator's Gallery Design: A unique, dark-themed, and responsive frontend built using native HTML, JavaScript, and Bootstrap 5.
- Conditional Display: Only products that have successfully passed the backend verification process (is_link_valid: true) are displayed in the main gallery.
- Clear User Feedback: Provides specific error messages on the form (e.g., "Link must be from a trusted platform") when an upload is blocked.

## **Architecture and Stack**

The project uses a classic split between a robust Node.js backend and a simple, configuration-free HTML frontend.

| Component | Technology | Role |
| --- | --- | --- |
| Backend (Server) | Node.js (Express) | Handles API routing, database communication, and the critical link verification logic. |
| Database | MongoDB (Mongoose) | Stores product data, including the verification status (is_link_valid). |
| Core Utility | Axios | Used for making external HTTP requests to verify the live status of purchase links. |
| Frontend (Client) | HTML5, Vanilla JavaScript, Bootstrap 5 | Provides the user interface, handles form submission, and fetches verified products for display. |

## Setup and Installation Guide

To run this application, you must have Node.js and npm installed.

### Step 1: Clone the Repository & Install Dependencies

## Clone or create the project structure
```bash
cd ecommerce-platform
```

## Install Backend Dependencies
```bash
cd server
npm install
```

## Install Axios specifically (for link verification)
```bash
npm install axios
```

### Step 2: Configure the Database Connection
- Set up MongoDB Atlas: Create a free MongoDB Atlas account and a new cluster.
- Get URI: Create a database user and whitelist your IP address (0.0.0.0/0 for development). Obtain your MongoDB connection string (URI).
- Update .env: In the server/ directory, open the .env file and update the placeholder with your actual URI:

## server/.env
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerceDB?retryWrites=true&w=majority
PORT=5000
```

### Step 3: Run the Application
You need two separate terminal windows for the server and client.

#### Terminal 1: Start the Backend API
Navigate to the /server directory: cd server
Run the server:

```bash
npm run server
```

Expected Output: MongoDB Connected: ... and Server running on port 5000.

#### Terminal 2: Launch the Frontend Client
- Navigate to the /client directory: cd client
- Launch the application by double-clicking the index.html file in your file explorer.

## Core Functionality: Link Verification

The link verification logic is contained in server/utils/linkVerifier.js. It performs the following sequence:

- Trusted Domain Check: Checks the URL against the TRUSTED_DOMAINS array (Amazon, Flipkart). If not trusted, the upload is blocked instantly.
- Live Check: If trusted, it sends an HTTP request to the URL.
- It includes a custom User-Agent header to bypass bot-blocking security measures common on e-commerce sites.
- If the site returns a 4xx (Not Found/Client Error) or 5xx (Server Error), the upload is blocked.
- Database Storage: Only if the link passes all checks is the product saved to MongoDB with is_link_valid: true.
