#!/usr/bin/env node
/**
 * Test FRIDAY Setup
 */

import dotenv from 'dotenv';
import { setupTool } from './dist/tools/setup.js';

// Load environment variables
dotenv.config();

console.log('🚀 Running FRIDAY Setup...\n');

setupTool({
  projectType: 'auto-detect',
  enableRedis: true,
  memoryCapacity: 100
})
  .then(result => {
    if (result.content && result.content[0]) {
      console.log(result.content[0].text);
    }
    
    if (result.isError) {
      console.error('\n❌ Setup failed');
      process.exit(1);
    } else {
      console.log('\n✅ Setup completed successfully');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
