# Server with auth

## Elements:

- express
- typescript
- mongoose
- mongoDB
- jsonwebtoken
- helmet
- express-rate-limit
- zod

## Setup:

1. Clone the repo
2. Rename .env.example to .env
3. Update the .env file with project secrets like:
    - JWT_SECRET: Encryption key to sign JWTs.
    - JWT_LIFETIME: Lifetime the JWT will be valid for. Example: 30d - for 30 days.
    - MONGO_URI: A mongodb cluster URI.
    - PORT: This is optional. By default the port will be 3000.
    - RATELIMIT_WINDOW: Time window in minutes.
    - RATELIMIT_MAX: Maximum number of hits in a particular time window
4.  Run the following commands:
    ```bash
    npm install
    npm run build
    npm start
    ```