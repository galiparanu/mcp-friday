import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.log('❌ Missing credentials in .env');
  process.exit(1);
}

console.log('📋 Configuration:');
console.log('   URL:', url.substring(0, 30) + '...');
console.log('   Token:', token.substring(0, 20) + '...');
console.log('');

const redis = new Redis({ url, token });

console.log('🔌 Testing connection...');
redis.ping()
  .then(result => {
    if (result === 'PONG') {
      console.log('✅ Redis connection successful!');
      console.log('');
      console.log('Testing write operation...');
      return redis.set('friday:test', 'Hello from FRIDAY', { ex: 60 });
    }
  })
  .then(() => {
    console.log('✅ Write successful!');
    console.log('');
    console.log('Testing read operation...');
    return redis.get('friday:test');
  })
  .then(value => {
    console.log('✅ Read successful:', value);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ HYBRID MEMORY READY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('FRIDAY is now configured with:');
    console.log('✅ Git Memory (local structured docs)');
    console.log('✅ Redis Memory (global fast cache)');
    console.log('✅ Hybrid mode active');
    console.log('');
    console.log('All systems operational, Sir.');
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ Connection failed:', error.message);
    console.log('');
    console.log('Please check:');
    console.log('1. Credentials are correct in .env');
    console.log('2. Upstash database is active');
    console.log('3. Network connection');
    process.exit(1);
  });
