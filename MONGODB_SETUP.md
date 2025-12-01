# MongoDB Connection Setup Guide

This guide explains how to connect your application to a MongoDB database using MongoDB Atlas.

## Prerequisites

- You have created an account on [MongoDB Atlas](https://cloud.mongodb.com/).
- You have created a Cluster.
- You have created a Database User (username and password).
- You have whitelisted your IP address (or allowed access from anywhere `0.0.0.0/0`).

## Step 1: Get Your Connection String

1.  Log in to your [MongoDB Atlas dashboard](https://cloud.mongodb.com/).
2.  Click on **Database** in the left sidebar.
3.  Click the **Connect** button for your Cluster.
4.  Select **Drivers** (e.g., Node.js, Python, etc.) under "Connect to your application".
5.  Ensure **Node.js** is selected as the driver and the version is **4.1 or later**.
6.  Copy the provided connection string. It will look something like this:
    ```
    mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority
    ```

## Step 2: Configure Your Application

1.  Open your project in your code editor.
2.  Navigate to the `server` directory.
3.  Open (or create) the `.env` file.
4.  Find the `MONGODB_URI` variable or add it if it doesn't exist.
5.  Paste your connection string as the value.
6.  **Important:** Replace `<username>` and `<password>` with your actual database user credentials.

    - Do not include the `<` and `>` characters.
    - If your password contains special characters, you may need to URL encode them.

    **Example `.env` file:**

    ```env
    PORT=5000
    NODE_ENV=development
    MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abcde.mongodb.net/my_database_name?retryWrites=true&w=majority
    JWT_SECRET=your_jwt_secret_key
    CLIENT_URL=http://localhost:3000
    ```

## Step 3: Verify Connection

1.  Save the `.env` file.
2.  Restart your server:
    ```bash
    cd server
    npm run dev
    ```
3.  Check the terminal output. You should see a message confirming the connection:
    ```
    MongoDB Connected: cluster0-shard-00-00.abcde.mongodb.net
    ```

## Troubleshooting

- **Authentication Failed:** Double-check your username and password in the connection string. Ensure you are using the _database user_ credentials, not your MongoDB Atlas login credentials.
- **Network Error / Timeout:** Ensure your IP address is whitelisted in the "Network Access" tab in MongoDB Atlas. For development, you can add `0.0.0.0/0` to allow access from anywhere.
- **DNS Issues:** If you see DNS-related errors, try using the standard connection string format instead of the SRV record (though SRV is standard for Atlas).
