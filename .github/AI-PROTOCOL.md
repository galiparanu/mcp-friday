# FRIDAY AI Protocol Setup

**Status:** ✅ COMPLETE  
**Date:** 2025-11-08  
**Purpose:** Memastikan semua AI assistant selalu menggunakan FRIDAY memory system

---

## 🎯 Apa Yang Sudah Dibuat

### 1. GitHub Copilot Instructions ✅
**File:** `.github/copilot-instructions.md`

Instruksi lengkap untuk AI yang mencakup:
- ✅ Protocol setup wajib
- ✅ Workflow standar AI
- ✅ Template dokumentasi otomatis
- ✅ Rules DO dan DON'T
- ✅ Troubleshooting guide

### 2. Auto-Setup Script ✅
**File:** `auto-setup-protocol.js`

Script yang otomatis:
- ✅ Cek FRIDAY initialization
- ✅ Create AI instructions
- ✅ Setup Git hooks
- ✅ Update README
- ✅ Configure VS Code settings

### 3. Git Hooks ✅
**File:** `.github/hooks/pre-commit`

Hook yang memastikan:
- ✅ FRIDAY selalu initialized sebelum commit
- ✅ Auto-run setup jika belum ada
- ✅ Validasi memory structure

### 4. README Section ✅
**Added to:** `README.md`

Section baru untuk AI:
- ✅ Quick start commands
- ✅ Protocol rules
- ✅ Link ke full instructions

### 5. VS Code Settings ✅
**File:** `.vscode/settings.json`

Settings untuk:
- ✅ Copilot enabled
- ✅ Exclude archive dari search
- ✅ File watcher configuration

---

## 📋 Protocol Rules untuk AI

### WAJIB Dilakukan di Setiap Session:

```markdown
1. START SESSION
   → Run: #friday-context
   → Load semua memory yang ada

2. BEFORE IMPLEMENTATION
   → Run: #friday-search "<topik>"
   → Cari context yang relevan

3. DURING IMPLEMENTATION
   → Tulis code
   → Buat memory documentation

4. AFTER CHANGES
   → Update .github/memory/
   → Run: #friday-sync
   
5. END SESSION
   → Verify sync success
   → Update current-state.md
```

---

## 🗂️ Memory Structure

```
.github/
├── copilot-instructions.md    ← AI WAJIB BACA!
├── hooks/
│   └── pre-commit             ← Auto-setup hook
└── memory/
    ├── INDEX.md               ← Project overview
    ├── current-state.md       ← Status terkini
    ├── implementations/       ← Fitur yang diimplementasi
    ├── decisions/             ← Keputusan arsitektur
    ├── issues/                ← Bug fixes
    └── archive/               ← Items selesai
```

---

## 🤖 Commands untuk AI

### Setup & Context
```bash
#friday-setup        # Initialize FRIDAY (sekali per project)
#friday-context      # Load full context (setiap session start)
```

### Search & Query
```bash
#friday-search "authentication"   # Search memory
#friday-search "API design"       # Find decisions
```

### Sync & Update
```bash
#friday-sync         # Sync Git ↔ Redis (setelah changes)
```

---

## 📝 Documentation Templates

### Implementation Template
```markdown
# Implementation: [Feature Name]

**Date:** 2025-11-08
**Author:** AI Assistant
**Status:** Completed

## What Was Implemented
- Files changed: ...
- Functions added: ...

## Why This Approach
- Technical reasons
- Trade-offs considered

## Code Samples
```typescript
// Key implementation
```

## Testing
- Tests added
- Edge cases

## Next Steps
- Future improvements
```

### Decision Template
```markdown
# Decision: [Title]

**Date:** 2025-11-08
**Status:** Accepted

## Context
Why this decision was needed.

## Decision
What was decided.

## Consequences
Positive and negative impacts.

## Alternatives
What else was considered.
```

### Issue Template
```markdown
# Issue: [Bug Description]

**Date:** 2025-11-08
**Severity:** High

## Problem
Detailed description.

## Root Cause
Why it happened.

## Solution
How it was fixed.

## Prevention
How to avoid in future.
```

---

## ✅ Checklist untuk AI

Setiap AI assistant harus verify:

- [ ] `.github/copilot-instructions.md` exists
- [ ] `.github/memory/` initialized
- [ ] `INDEX.md` dan `current-state.md` ada
- [ ] Run `#friday-context` di awal session
- [ ] Search memory sebelum implement
- [ ] Create memory docs untuk changes
- [ ] Run `#friday-sync` setelah changes
- [ ] Update `current-state.md` regularly

---

## 🔄 AI Workflow Standard

```
┌─────────────────────┐
│  1. Session Start   │
│  #friday-context    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  2. User Request    │
│  #friday-search     │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  3. Implementation  │
│  Write code + docs  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  4. Save & Sync     │
│  #friday-sync       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  5. Confirm         │
│  Report to user     │
└─────────────────────┘
```

---

## 🎯 Success Criteria

AI dianggap mengikuti protocol jika:

1. ✅ Setup FRIDAY di project baru
2. ✅ Load context setiap session
3. ✅ Search sebelum implement
4. ✅ Create memory documentation
5. ✅ Sync ke Redis regularly
6. ✅ Update current-state.md
7. ✅ Report apa yang didokumentasikan

---

## 📞 Support

### Jika AI Tidak Mengikuti Protocol:

1. **Reminder**: Tunjukkan `.github/copilot-instructions.md`
2. **Re-initialize**: Run `node auto-setup-protocol.js`
3. **Verify**: Check `.github/memory/INDEX.md`

### Jika FRIDAY Tidak Tersedia:

1. Check MCP server status
2. Restart VS Code
3. Verify `mcp.json` configuration

### Jika Redis Disconnect:

1. Fallback to Git-only mode
2. Notify user
3. Continue with Git memory

---

## 🚀 Quick Start untuk AI Baru

```bash
# 1. Verify FRIDAY
node auto-setup-protocol.js

# 2. Read instructions
cat .github/copilot-instructions.md

# 3. Load context
#friday-context

# 4. Start working!
#friday-search "<your topic>"
```

---

**IMPORTANT:** Protocol ini WAJIB diikuti oleh SEMUA AI assistant!

**Version:** 1.0.0  
**Maintained by:** FRIDAY MCP Server  
**Last Updated:** 2025-11-08
