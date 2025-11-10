# Smart Search Strategy - Implementation Guide

## 🎯 Strategy Overview

**Goal:** When user wants to implement a new feature, agent searches for relevant documentation intelligently.

**Search Priority:**
1. **Local** (.github/memory, docs/, README) - Fastest, project-specific
2. **Upstash** (Redis cache) - Fast, cross-project patterns
3. **Context7** (External libraries) - Slowest, but comprehensive

---

## 📋 How It Works

### User Request
```
"I want to add user authentication"
```

### Agent Process

**Step 1: Local Search** 📂
- Searches `.github/memory/implementations/`
- Checks `docs/` folder
- Scans README, CONTRIBUTING
- **If found:** Returns existing patterns
- **If not:** Proceeds to Step 2

**Step 2: Upstash Search** ☁️
- Queries Redis cache
- Finds patterns from other projects
- **If found:** Returns cached implementations
- **If not:** Proceeds to Step 3

**Step 3: Context7 Search** 🌐
- Detects libraries (e.g., "passport", "next-auth")
- Fetches official documentation
- **Returns:** External library guides

---

## 🔧 Implementation

### Tool: `friday-smart-search`

```typescript
{
  name: "friday-smart-search",
  description: "Smart search for new features (local → upstash → context7)",
  input: {
    query: "user authentication",
    featureContext: "Next.js app with TypeScript"
  }
}
```

### Response Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Smart Search Results: "user authentication"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Search Path:
   1. 📂 local
   2. ☁️  upstash
   3. 🌐 context7

📋 Found 5 Results:

1. 📂 auth-implementation (85% relevance)
   Path: .github/memory/implementations/auth-system.md
   Preview: JWT authentication with refresh tokens using...

2. ☁️  user-sessions (70% relevance)
   Source: Upstash cache
   Preview: Session management pattern for Express apps...

3. 🌐 next-auth Documentation (60% relevance)
   Library: next-auth
   Preview: Official authentication library for Next.js...

💡 Recommendations:
   • Review existing auth implementation in .github/memory/
   • Check cached session patterns
   • Consult next-auth official docs for Next.js integration
```

---

## 💡 Benefits

### 1. **Faster Development**
- Reuses existing patterns
- No need to search manually
- Finds best practices automatically

### 2. **Consistency**
- Uses project-specific patterns first
- Maintains code style
- Follows established architecture

### 3. **Smart Escalation**
- Only searches external docs when needed
- Saves API calls
- Optimizes search time

### 4. **Learning**
- Builds knowledge over time
- Caches successful patterns
- Improves with usage

---

## 🚀 Usage Examples

### Example 1: Payment Integration

**User:**
```
"Add Stripe payment processing"
```

**Agent Search:**
1. Local: Checks `.github/memory/implementations/payment-*`
2. Finds: `payment-gateway.md` (existing Stripe integration)
3. **Result:** Uses existing pattern, no external search needed

### Example 2: New Technology

**User:**
```
"Implement WebSocket real-time chat"
```

**Agent Search:**
1. Local: No WebSocket docs found
2. Upstash: No WebSocket cache
3. Context7: Fetches Socket.io documentation
4. **Result:** External docs + creates new implementation

### Example 3: Similar Feature

**User:**
```
"Add password reset functionality"
```

**Agent Search:**
1. Local: Finds `auth-system.md` (password handling)
2. Upstash: Finds `email-verification.md` (similar flow)
3. **Result:** Combines local + cached patterns

---

## 🎯 Integration with FRIDAY

### Workflow Enhancement

**Before Smart Search:**
```
User: "Add authentication"
Agent: *searches everything randomly*
Agent: *wastes time on external docs*
```

**After Smart Search:**
```
User: "Add authentication"
Agent: *checks local first*
Agent: "Found existing auth pattern in memory"
Agent: "Implementing using your established pattern..."
```

### Automatic Documentation

After implementing, agent saves to memory:

```markdown
# implementations/new-feature.md

## Context
Based on smart search results from:
- Local: auth-system.md
- Upstash: session-management
- Context7: passport.js docs

## Implementation
[Details here]

## Lessons Learned
[For future reference]
```

---

## 📊 Search Algorithm

### Relevance Scoring

```typescript
function calculateRelevance(content, query):
  score = 0
  
  // Exact phrase match
  if content.includes(query):
    score += 0.5
  
  // Word matches
  queryWords = query.split()
  matchedWords = queryWords.filter(w => content.includes(w))
  score += (matchedWords.length / queryWords.length) * 0.5
  
  return score
```

### Sufficiency Check

```typescript
function isSufficient(results):
  // Need at least 2 results with >50% relevance
  goodResults = results.filter(r => r.relevance > 0.5)
  return goodResults.length >= 2
```

---

## 🔄 Future Enhancements

### Phase 1 (Current)
- ✅ Local file search
- ✅ Upstash cache integration
- ✅ Context7 library detection
- ✅ Relevance scoring

### Phase 2 (Next)
- [ ] AI-powered semantic search
- [ ] Code snippet extraction
- [ ] Automatic pattern matching
- [ ] Version compatibility checking

### Phase 3 (Future)
- [ ] Machine learning recommendations
- [ ] Auto-generate implementation plan
- [ ] Predict required dependencies
- [ ] Suggest test cases

---

## ⚙️ Configuration

### Enable Smart Search

```json
{
  "friday": {
    "smartSearch": {
      "enabled": true,
      "localFirst": true,
      "cacheResults": true,
      "maxResults": 5
    }
  }
}
```

### Search Paths

```json
{
  "searchPaths": [
    ".github/memory/**/*.md",
    "docs/**/*.md",
    "README.md",
    "CONTRIBUTING.md"
  ]
}
```

---

## 📝 Best Practices

### For Users

1. **Document implementations** in `.github/memory/`
2. **Use descriptive names** for memory files
3. **Add context** in feature requests
4. **Review search results** before implementing

### For Agent

1. **Always start local** - fastest and most relevant
2. **Cache successful patterns** - improve future searches
3. **Combine sources** - use best from each
4. **Document decisions** - explain why approach chosen

---

## 🎭 FRIDAY Integration

**When user requests feature:**

```typescript
1. Run smart search
2. Analyze results
3. If local patterns exist:
   - "Certainly, Sir. I found existing patterns for this."
   - "I'll implement following your established approach."
4. If external docs needed:
   - "No local documentation found, Sir."
   - "Consulting official library documentation..."
5. Always save result to memory for future use
```

---

Ready to integrate, Sir!
