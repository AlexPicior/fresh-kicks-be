const Pool = require('pg').Pool;

const pool = new Pool({
    connectionString : "postgres://postgres:t0s8XxyxstHDemdaBJMg@containers-us-west-63.railway.app:7210/railway",
    ssl: {
        rejectUnauthorized: false, 
    }, 
    },
);

pool.on("error", (err)=>{
  console.error('PostgreSQL client error:', err);
});

module.exports = pool;