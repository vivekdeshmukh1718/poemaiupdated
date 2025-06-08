
import { config } from 'dotenv';
config({ path: '.env.local' }); // Ensure .env.local is loaded for dev

import '@/ai/flows/generate-poem.ts';
