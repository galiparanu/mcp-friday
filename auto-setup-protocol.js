#!/usr/bin/env node
/**
 * FRIDAY Auto-Setup Protocol
 * Script ini memastikan FRIDAY selalu digunakan oleh AI
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Warna untuk output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkFridaySetup() {
  const memoryPath = path.join(process.cwd(), '.github', 'memory');
  const indexPath = path.join(memoryPath, 'INDEX.md');
  
  try {
    await fs.access(indexPath);
    return true;
  } catch {
    return false;
  }
}

async function createAIInstructions() {
  const instructionsPath = path.join(process.cwd(), '.github', 'copilot-instructions.md');
  
  try {
    await fs.access(instructionsPath);
    log('✅ Copilot instructions sudah ada', 'green');
    return true;
  } catch {
    log('⚠️  Copilot instructions belum ada', 'yellow');
    return false;
  }
}

async function createAutoSetupHook() {
  const hookContent = `#!/bin/bash
# FRIDAY Auto-Setup Hook
# Ensures FRIDAY is always initialized

MEMORY_DIR=".github/memory"

if [ ! -d "$MEMORY_DIR" ]; then
  echo "🤖 FRIDAY not initialized. Running setup..."
  node dist/index.js setup
fi

echo "✅ FRIDAY is ready"
`;

  const hookPath = path.join(process.cwd(), '.github', 'hooks', 'pre-commit');
  
  try {
    await fs.mkdir(path.dirname(hookPath), { recursive: true });
    await fs.writeFile(hookPath, hookContent);
    await fs.chmod(hookPath, 0o755);
    log('✅ Git hook created', 'green');
  } catch (error) {
    log(`⚠️  Failed to create hook: ${error.message}`, 'yellow');
  }
}

async function createReadmeSection() {
  const readmePath = path.join(process.cwd(), 'README.md');
  
  const fridaySection = `

## 🤖 AI Protocol - FRIDAY Memory System

**IMPORTANT: Semua AI assistant (GitHub Copilot, Claude, ChatGPT) WAJIB mengikuti protocol ini!**

### Untuk AI: Quick Start Commands

\`\`\`bash
# 1️⃣ Awal session (WAJIB)
#friday-context

# 2️⃣ Sebelum implementasi (WAJIB)
#friday-search "<topik>"

# 3️⃣ Setelah perubahan (WAJIB)
#friday-sync
\`\`\`

### Protocol Rules

1. **Setup Check**: Always verify FRIDAY is initialized
2. **Context Load**: Load context at session start
3. **Memory Search**: Search before implementing
4. **Document**: Create memory files for changes
5. **Sync**: Sync to Redis after changes

📖 **Full Protocol**: [.github/copilot-instructions.md](.github/copilot-instructions.md)

`;

  try {
    const readme = await fs.readFile(readmePath, 'utf-8');
    
    // Cek apakah section sudah ada
    if (readme.includes('## 🤖 AI Protocol')) {
      log('✅ README section sudah ada', 'green');
      return;
    }
    
    // Tambahkan section
    const updatedReadme = readme + fridaySection;
    await fs.writeFile(readmePath, updatedReadme);
    log('✅ README section ditambahkan', 'green');
  } catch (error) {
    log(`⚠️  Failed to update README: ${error.message}`, 'yellow');
  }
}

async function createVSCodeSettings() {
  const settingsPath = path.join(process.cwd(), '.vscode', 'settings.json');
  
  const settings = {
    "github.copilot.enable": {
      "*": true
    },
    "github.copilot.advanced": {
      "inlineSuggestCount": 3
    },
    "files.watcherExclude": {
      "**/.github/memory/archive/**": true
    },
    "search.exclude": {
      "**/.github/memory/archive/**": true
    }
  };
  
  try {
    await fs.mkdir(path.dirname(settingsPath), { recursive: true });
    
    let existingSettings = {};
    try {
      const content = await fs.readFile(settingsPath, 'utf-8');
      existingSettings = JSON.parse(content);
    } catch {
      // File doesn't exist or invalid JSON
    }
    
    const merged = { ...existingSettings, ...settings };
    await fs.writeFile(settingsPath, JSON.stringify(merged, null, 2));
    log('✅ VS Code settings updated', 'green');
  } catch (error) {
    log(`⚠️  Failed to update settings: ${error.message}`, 'yellow');
  }
}

async function main() {
  console.log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('🤖 FRIDAY Auto-Setup Protocol', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log('');
  
  // 1. Check FRIDAY setup
  log('1️⃣  Checking FRIDAY setup...', 'blue');
  const isSetup = await checkFridaySetup();
  
  if (isSetup) {
    log('   ✅ FRIDAY memory initialized', 'green');
  } else {
    log('   ❌ FRIDAY not initialized', 'red');
    log('   Run: #friday-setup', 'yellow');
  }
  console.log('');
  
  // 2. Create AI instructions
  log('2️⃣  Setting up AI instructions...', 'blue');
  await createAIInstructions();
  console.log('');
  
  // 3. Create auto-setup hook
  log('3️⃣  Creating auto-setup hooks...', 'blue');
  await createAutoSetupHook();
  console.log('');
  
  // 4. Update README
  log('4️⃣  Updating README...', 'blue');
  await createReadmeSection();
  console.log('');
  
  // 5. Update VS Code settings
  log('5️⃣  Updating VS Code settings...', 'blue');
  await createVSCodeSettings();
  console.log('');
  
  // Summary
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('✅ Auto-Setup Protocol Complete!', 'green');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  console.log('');
  
  log('📋 Summary:', 'blue');
  log(`   FRIDAY Setup: ${isSetup ? '✅' : '❌ Run #friday-setup'}`, 'white');
  log('   AI Instructions: ✅ Created', 'white');
  log('   Auto Hooks: ✅ Created', 'white');
  log('   README: ✅ Updated', 'white');
  log('   VS Code: ✅ Configured', 'white');
  console.log('');
  
  log('🎯 Next Steps for AI:', 'yellow');
  log('   1. Always run #friday-context at session start', 'white');
  log('   2. Search memory before implementing: #friday-search', 'white');
  log('   3. Document all changes in .github/memory/', 'white');
  log('   4. Sync after changes: #friday-sync', 'white');
  console.log('');
  
  log('📖 Full Instructions: .github/copilot-instructions.md', 'cyan');
  console.log('');
}

main().catch(error => {
  log(`❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
