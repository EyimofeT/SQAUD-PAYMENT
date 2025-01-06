import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import v1Routes from './routes.js';
import morgan from "morgan";
import { format_request_middleware } from './core/format_request_body.js';
import merchant_routes from './apis/merchant/routes.js'
import settlement_routes from './apis/settlement/routes.js'
import payment_routes from './apis/payment/routes.js'

const app = express();

// set security HTTP headers
app.use(helmet());

// Logging middleware to log to CLI
app.use(morgan("combined"));

// parse json request body
app.use(express.json({ limit: '5mb' }));

// sanitize request data
app.use(xss());

// enable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type');

    next();
});

app.use(format_request_middleware)

let base_route = `/v1/`
app.use(base_route, v1Routes)
app.use(`${base_route}merchant`,merchant_routes);
app.use(`${base_route}settlement`,settlement_routes); 
app.use(`${base_route}payment`,payment_routes);

export default app;