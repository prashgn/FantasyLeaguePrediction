const env = {
    DATABASE: 'competition',
    USER: 'root',
    PASSWORD: '',
    HOST: 'localhost',
    DIALECT: 'mysql',
    JWT_SECRET: '',
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
