module.exports = {
  apps: [
    {
      name: "insta-frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "insta-worker",
      script: "npx",
      args: "tsx workers/followerWorker.ts",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "insta-cron",
      script: "npx",
      args: "tsx cron/dailyCron.ts",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
