let sql;

async function initDB() {
  const { neon } = await import("@neondatabase/serverless");
  sql = neon(process.env.DATABASE_URL);
}

initDB();

module.exports = {
  sql: (...args) => {
    if (!sql) {
      throw new Error("Neon SQL client not initialized yet");
    }
    return sql(...args);
  }
};
