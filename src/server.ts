import { createServer } from 'express-zod-api';
import { config } from './config';
import { routing } from './route';
import { consumeKafkaEvents } from './kafka/consumer/debateZone';

createServer(config, routing);
consumeKafkaEvents();
