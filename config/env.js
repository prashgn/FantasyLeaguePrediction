const env = {
    DATABASE: 'competition',
    USER: 'root',
    PASSWORD: 'mpt@titans_2020',
    HOST: 'localhost',
    DIALECT: 'mysql',
    JWT_SECRET: 'Terasuper&secret@10_2020',
    JWT_EXPIRES_IN: '90d',
    JWT_COOKIES_EXPIRES: 90,
    POOL: {
        MAX: 5,
        MIN: 0,
        ACQUIRE: 30000,
        IDLE: 10000,
    },
};

module.exports = env;