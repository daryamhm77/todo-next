function applyVercelAuthUrl() {
  if (process.env.NEXTAUTH_URL) return;
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  }
}

applyVercelAuthUrl();

export { applyVercelAuthUrl };
