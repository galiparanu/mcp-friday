#!/usr/bin/env node
/**
 * FRIDAY Setup Verification
 * Checks that all components are working correctly
 */

import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { HybridMemoryManager } from './dist/memory/hybrid-manager.js';
import { ConfigLoader } from './dist/utils/config-loader.js';

dotenv.config();

async function verify() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 FRIDAY Setup Verification');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  let allChecks = true;

  // 1. Check .env configuration
  console.log('1️⃣  Configuration Check');
  const config = ConfigLoader.load();
  const validation = ConfigLoader.validate(config);
  
  if (validation.valid) {
    console.log('   ✅ Configuration valid');
    console.log(`   ✅ Redis URL: ${config.upstash?.restUrl?.substring(0, 30)}...`);
    console.log(`   ✅ Redis Token: ${config.upstash?.restToken?.substring(0, 20)}...`);
  } else {
    console.log('   ❌ Configuration issues:');
    validation.errors.forEach(err => console.log(`      - ${err}`));
    allChecks = false;
  }
  console.log('');

  // 2. Check memory structure
  console.log('2️⃣  Memory Structure Check');
  const memoryPath = path.join(process.cwd(), '.github', 'memory');
  
  try {
    await fs.access(memoryPath);
    console.log('   ✅ .github/memory/ exists');
    
    const dirs = ['implementations', 'decisions', 'issues', 'archive'];
    for (const dir of dirs) {
      const dirPath = path.join(memoryPath, dir);
      await fs.access(dirPath);
      console.log(`   ✅ ${dir}/ exists`);
    }
    
    const files = ['INDEX.md', 'current-state.md'];
    for (const file of files) {
      const filePath = path.join(memoryPath, file);
      await fs.access(filePath);
      const stats = await fs.stat(filePath);
      console.log(`   ✅ ${file} exists (${stats.size} bytes)`);
    }
  } catch (error) {
    console.log('   ❌ Memory structure incomplete');
    allChecks = false;
  }
  console.log('');

  // 3. Check Redis connection
  console.log('3️⃣  Redis Connection Check');
  const hybridMemory = new HybridMemoryManager(config);
  const health = await hybridMemory.getRedisHealth();
  
  if (health.connected) {
    console.log('   ✅ Redis connected');
    console.log(`   ✅ Latency: ${health.latency}ms`);
  } else {
    console.log(`   ❌ Redis connection failed: ${health.error}`);
    allChecks = false;
  }
  console.log('');

  // 4. Check hybrid memory stats
  console.log('4️⃣  Hybrid Memory Check');
  try {
    const stats = await hybridMemory.getStats();
    console.log(`   ✅ Mode: ${stats.mode}`);
    console.log(`   ✅ Git files: ${stats.git.total}`);
    if (stats.redis) {
      console.log(`   ✅ Redis keys: ${stats.redis.memoryKeys}`);
      console.log(`   ✅ Redis size: ${stats.redis.totalSize} bytes`);
    }
  } catch (error) {
    console.log('   ❌ Failed to get memory stats');
    allChecks = false;
  }
  console.log('');

  // 5. Test search operation
  console.log('5️⃣  Search Operation Test');
  try {
    const searchResults = await hybridMemory.search('FRIDAY', 5);
    console.log(`   ✅ Search completed (${searchResults.length} results)`);
    
    if (searchResults.length > 0) {
      console.log(`   ✅ Found results from: ${searchResults[0].source}`);
    }
  } catch (error) {
    console.log(`   ⚠️  Search test warning: ${error.message}`);
    // Don't fail on search test - it's okay if there are no results yet
  }
  console.log('');

  // Final result
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (allChecks) {
    console.log('✅ ALL CHECKS PASSED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🤖 FRIDAY is fully operational and ready to assist!');
    console.log('');
    console.log('Available tools:');
    console.log('  • #friday-setup   - Initialize new projects');
    console.log('  • #friday-search  - Semantic search across memory');
    console.log('  • #friday-sync    - Sync Git ↔ Redis memory');
    console.log('  • #friday-context - Load project context');
    console.log('');
    return 0;
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Please review the errors above and fix them.');
    console.log('');
    return 1;
  }
}

verify()
  .then(code => process.exit(code))
  .catch(error => {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  });
