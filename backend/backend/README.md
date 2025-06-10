# Project Overview

This backend application is built using Node.js and Express. It provides user authentication features, allowing users to sign up and log in. The application connects to a PostgreSQL database to store user information securely.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**
   Make sure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```

3. **Set Up PostgreSQL Database**
   Create a PostgreSQL database and execute the following SQL command to create the `user_log_info` table:
   ```sql
   CREATE TABLE user_log_info (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );
   ```

4. **Environment Variables**
   Set the `DATABASE_URL` environment variable to connect to your PostgreSQL database. You can create a `.env` file in the root of the project with the following content:
   ```
   DATABASE_URL=your_database_url
   ```

5. **Start the Server**
   Run the following command to start the server:
   ```bash
   npm start
   ```

## Usage

- **Sign Up**
  - Endpoint: `POST /signup`
  - Request Body: 
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```

- **Login**
  - Endpoint: `POST /login`
  - Request Body: 
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```

## License

This project is licensed under the MIT License.