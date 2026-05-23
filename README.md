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

The dev server now binds to `0.0.0.0`, so you can open it on this laptop with [http://localhost:3000](http://localhost:3000) and from a phone or other device on the same network with `http://<your-laptop-ip>:3000`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Deploying this app on Vercel is the recommended path because it gives you a public HTTPS URL that you can open and install on your phone as a PWA.

1. Push the repo to GitHub.
2. In Vercel, create a new project and import this repository.
3. Add these environment variables in Vercel:
   - `DATABASE_URL` for a hosted Postgres database such as Neon, Supabase, or Vercel Postgres.
   - `NEXTAUTH_SECRET` as a strong random string.
   - `NEXTAUTH_URL` set to your deployed Vercel URL after the first deploy.
4. Deploy the project.
5. Open the Vercel URL on your phone.
6. On Android, use the browser menu to install the app.

The app is already configured to work with hosted Postgres and NextAuth on Vercel.
