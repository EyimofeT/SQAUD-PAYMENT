import app from './src/app.js';
import { custom_error } from './src/core/customerror.js';
import dotenv from 'dotenv';
dotenv.config();

global.custom_error = custom_error



const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.info(`Listening to port ${port}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
