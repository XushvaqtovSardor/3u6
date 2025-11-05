import "dotenv/config";

export const config = {
  app: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.db_url,
  },
};
