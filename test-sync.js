#!/usr/bin/env node
/**
 * Test FRIDAY Sync
 */

import dotenv from 'dotenv';
import { syncTool } from './dist/tools/sync.js';

// Load environment variables
dotenv.config();

console.log('🔄 Running FRIDAY Sync...\n');

syncTool({
  direction: 'git-to-redis',
  force: false
})
  .then(result => {
    if (result.content && result.content[0]) {
      console.log(result.content[0].text);
    }
    
    if (result.isError) {
      console.error('\n❌ Sync failed');
      process.exit(1);
    } else {
      console.log('\n✅ Sync completed successfully');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
