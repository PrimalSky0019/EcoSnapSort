import { config } from 'dotenv';
config();

import '@/ai/flows/notify-supervisors-of-unusual-schedule.ts';
import '@/ai/flows/schedule-garbage-pickup.ts';