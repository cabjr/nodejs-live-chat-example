import express from 'express'
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

const server = express();

const route = Router()


const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 9000;

server.use(function(req: Request, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(bodyParser.json({ limit: '8mb' }));
server.use(bodyParser.urlencoded({ extended: true }));

const ads = [{ message: 'Backend is up and running!' }];
server.get('/', (req: Request, res: Response) => {
  res.send(ads);
});

server.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});

export default server