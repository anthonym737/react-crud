const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Info76240#',
    database: 'users',
    server: 'amopc22',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    }
    catch (error) {
        console.error('Erreur de connexion:', error);
    }
}

module.exports = getConnection;