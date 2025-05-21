This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 🚀 How to use Docker in this project

#### ✅ Prerequisites

1. Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your system.
2. Open **Docker Desktop** and verify that it is running.

---

## ⚙️ Initial Setup

1. Ensure that there is a `.env` file in the root directory of the project (`./VTG-WEBFORM`).
2. If the `.env` file is missing, request it from a team member with authorized access.

Example `.env` file:

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=db
MYSQL_USER=userdb
MYSQL_PASSWORD=userdb
```

## Basic Commands

```bash
# Start all services in detached mode
docker-compose up -d

# Stop and remove containers (preserves data)
docker-compose down

# Rebuild containers after configuration changes
docker-compose up --build -d
```

#### Access Points

- phpMyAdmin: http://localhost:7001
- Database: Manage 'databasename' database via phpMyAdmin

#### 🧠 Additional Notes

- The init.sql file will be executed automatically the first time the MySQL container is created. Make sure it contains the necessary SQL instructions.
- If you need to rebuild the containers (for example, after changing configuration), run:
```bash
docker-compose up --build -d
```


