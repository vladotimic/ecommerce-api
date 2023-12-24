# E-Commerce API

Simple E-Commerce REST API that has next features:

- Auth API (user registration, login, verify account, reset and forgot password).
- Product API (product creation, querying list of products by specific filters, updating and deleting products).
- Review API (allow customers to create, get, update and delete reviews).
- Order API (allow customers to place, update and delete orders).

## Getting started

Install the project dependencies by running the following command in the root of the project:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file inside `/rest` folder.

| Environment Variable | Value                             | Description                                  |
| -------------------- | --------------------------------- | -------------------------------------------- |
| DEBUG                | false                             | Enables `debug` level logging.               |
| MONGO_URI            | mongodb://127.0.1:27017/{db}      | MongoDB URI for establishing the connection. |
| JWT_SECRET           | _string_                          | JWT secret key.                              |
| STRIPE_KEY           | _string_                          | Stripe secret key.                           |
| SMTP_HOST            | smtp.ethereal.email               | SMTP Host.                                   |
| SMTP_PORT            | 587                               | SMTP Port.                                   |
| SMTP_USER            | name@example.com                  | SMTP Username.                               |
| SMTP_PASSWORD        | _string_                          | SMTP Password.                               |
| EMAIL_FROM           | "Name Surname" <name@example.com> | SMTP Password.                               |
