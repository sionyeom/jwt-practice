const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = redis.createClient({
  port: process.env.REDIS_PORT,
  legacyMode: true,
});

redisClient.on("connect", () => console.log("Connected to Redis!"));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

module.exports = redisClient;
