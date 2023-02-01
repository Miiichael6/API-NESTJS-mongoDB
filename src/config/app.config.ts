export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || "dev",
  mongodb: process.env.DB_URI,
  port: process.env.PORT || 4000,
});
