# News site with CMS

## Quick start

### Prerequisites
1. **Node.js**: version 20 [Download and install](https://nodejs.org/en/download/) it if you haven't already.
2. **Docker/Compose**
3. **npm**

## Start the project
- `npm docker-up` - up docker containers
- `npm docker-down` - down docker containers


## Development

- `npm install` - install dependencies.
- `npx prisma migrate dev` - create prisma migrations from /web directory.
- `npx prisma db seed` - run seeding.
- `npm run dev` - run your app from root directory.
- `npm run cron` - start cron process.