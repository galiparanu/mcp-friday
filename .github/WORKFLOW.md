# FRIDAY Workflow - Best Practices Integration

## 🎯 Complete Implementation Workflow

### When User Requests a Feature

**Full Process:**

```
User Request
    ↓
1. SEARCH BEST PRACTICES (Context7)
    ↓
2. SEARCH INTERNAL MEMORY (FRIDAY)
    ↓
3. PLAN IMPLEMENTATION (Silent)
    ↓
4. IMPLEMENT CODE
    ↓
5. CREATE DOCUMENTATION
    ↓
6. SYNC TO HYBRID MEMORY
    ↓
7. RESPOND TO USER (Concise)
```

---

## 📋 Detailed Steps

### Step 1: Search Best Practices (Context7)

**Purpose:** Get official documentation and industry best practices

**Tools:**
- Context7 MCP server
- Official library documentation
- Framework guides

**Example:**
```
User: "Add authentication with NextAuth.js"

AI Internal:
→ Query Context7: "nextauth authentication setup best practices"
→ Results:
  - NextAuth.js v5 configuration
  - Protected routes pattern
  - Session management
  - Middleware setup
  
→ Extract key patterns:
  - Use middleware for route protection
  - JWT strategy for API routes
  - Session callbacks for custom data
```

---

### Step 2: Search Internal Memory (FRIDAY)

**Purpose:** Check existing implementations and avoid duplication

**Command:**
```
#friday-search "authentication"
```

**What to check:**
- Similar features already implemented?
- Existing patterns to follow?
- Previous decisions about auth?
- Known issues to avoid?

**Example:**
```
AI Internal:
→ #friday-search "authentication"
→ Results:
  - No existing auth implementation
  - Previous decision: Use JWT for API
  - Note: Avoid session storage (security concern)
  
→ Apply constraints:
  - Must use JWT (existing decision)
  - Follow stateless pattern
```

---

### Step 3: Plan Implementation (Silent)

**Purpose:** Combine best practices + internal context

**Considerations:**
- Best practice from Context7
- Existing patterns from FRIDAY memory
- Project constraints
- Security requirements

**Output:** Mental plan (not shown to user)

**Example:**
```
AI Internal Plan:
1. Use NextAuth v5 (latest, from Context7)
2. JWT strategy (matches existing decision)
3. Middleware for protection (best practice)
4. Custom session callbacks (project need)
5. Error boundaries (security)

Files to create:
- src/auth/auth.config.ts
- src/middleware.ts
- src/app/api/auth/[...nextauth]/route.ts
- tests/auth.test.ts
```

---

### Step 4: Implement Code

**Purpose:** Write production-ready code

**Guidelines:**
- Follow best practices from Context7
- Match existing code style
- Add proper error handling
- Include type safety
- Write tests

**Example:**
```typescript
// src/auth/auth.config.ts
// Following NextAuth v5 best practices (Context7)

import { NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authConfig: NextAuthConfig = {
  // Middleware-based protection (best practice)
  pages: {
    signIn: '/login',
  },
  
  callbacks: {
    // JWT strategy (internal pattern)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
  },
  
  providers: [], // Added in auth.ts
};
```

---

### Step 5: Create Documentation

**Purpose:** Save implementation details for future reference

**Location:** `.github/memory/implementations/YYYY-MM-DD-feature-name.md`

**Template:**
```markdown
# Implementation: NextAuth.js Authentication

**Date:** 2025-11-09
**Author:** AI Assistant
**Status:** Completed

## What Was Implemented

### Files Created:
- `src/auth/auth.config.ts` - NextAuth configuration
- `src/middleware.ts` - Route protection
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API
- `tests/auth.test.ts` - Authentication tests

### Features:
- JWT-based authentication
- Protected routes via middleware
- Session management
- Automatic token refresh

## Why This Approach

### Best Practices (Context7):
- **Middleware Protection**: NextAuth v5 recommends middleware-based route protection for better performance
- **JWT Strategy**: Stateless authentication suitable for API-first architecture
- **Edge Runtime**: Compatible with Vercel Edge for global deployment

### Internal Constraints (FRIDAY):
- Previous decision to use JWT (from 2025-11-01-api-design.md)
- Must avoid session storage (security requirement)
- Stateless pattern required for scaling

## Best Practices Applied

1. **Middleware Pattern** (NextAuth docs)
   - Single point of auth check
   - No redundant route guards
   - Performance optimized

2. **Type Safety** (TypeScript best practice)
   - Augmented NextAuth types
   - Custom session interface
   - Full IntelliSense support

3. **Error Handling** (Security best practice)
   - No sensitive error messages
   - Proper error boundaries
   - Logging for monitoring

## Code Samples

### Auth Configuration
```typescript
// Following NextAuth v5 pattern
export const authConfig: NextAuthConfig = {
  callbacks: {
    authorized({ auth, request }) {
      // Middleware-based protection
      return !!auth?.user;
    },
  },
};
```

### Protected Route Pattern
```typescript
// middleware.ts - Single auth check point
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
```

## References

### Context7 Documentation:
- [NextAuth.js v5 Setup](https://authjs.dev/getting-started)
- [Middleware Pattern](https://authjs.dev/guides/middleware)
- [JWT Strategy](https://authjs.dev/concepts/jwt)

### Related Decisions:
- .github/memory/decisions/2025-11-01-api-design.md (JWT choice)
- .github/memory/decisions/2025-10-15-security-standards.md

## Testing

### Unit Tests: 18 tests
- Login flow: 6 tests
- Session management: 4 tests
- Route protection: 5 tests
- Token refresh: 3 tests

### Integration Tests: 8 tests
- End-to-end login: 3 tests
- Protected routes: 3 tests
- Logout flow: 2 tests

### Manual Testing:
- ✅ Login with valid credentials
- ✅ Access protected routes
- ✅ Token expiry handling
- ✅ Logout functionality
- ✅ Invalid credentials rejection

### Edge Cases:
- ✅ Expired token refresh
- ✅ Concurrent session handling
- ✅ Network failure recovery
- ✅ Malformed token handling

## Performance

- Authentication check: <1ms (middleware)
- Token validation: ~2ms (JWT decode)
- Protected route overhead: Negligible

## Security

- ✅ HTTPS only in production
- ✅ Secure cookie flags
- ✅ CSRF protection enabled
- ✅ Rate limiting on auth endpoints
- ✅ No sensitive data in JWT payload

## Next Steps

### Immediate:
- [x] Basic auth working
- [x] Protected routes
- [x] Tests passing

### Future Improvements:
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Implement role-based access control (RBAC)
- [ ] Add 2FA support
- [ ] Session analytics

### Known Limitations:
- Single auth provider only (credentials)
- No refresh token rotation yet
- Basic permission system

---

*Implementation follows NextAuth.js v5 best practices with FRIDAY internal patterns*
```

---

### Step 6: Sync to Hybrid Memory

**Purpose:** Save to Git + Redis for persistence

**Command:**
```
#friday-sync
```

**What happens:**
- Documentation saved to `.github/memory/implementations/`
- Git commit created
- Synced to Redis cache
- Available for future searches

---

### Step 7: Respond to User (Concise)

**Purpose:** Inform user of completion

**Format:**
```
✅ [What was done]

Files:
- [List of files]

Best practices applied:
- [Key practice 1]
- [Key practice 2]

References:
- [Context7 doc link]

Docs: [Link to memory file]
```

**Example Response:**
```
✅ Added NextAuth.js authentication

Files:
- src/auth/auth.config.ts (configuration)
- src/middleware.ts (route protection)
- src/app/api/auth/[...nextauth]/route.ts
- tests/auth.test.ts (18 unit + 8 integration)

Best practices applied:
- Middleware-based protection (NextAuth v5)
- JWT stateless strategy
- Edge runtime compatible

References:
- NextAuth.js v5 docs (Context7)

Docs: .github/memory/implementations/2025-11-09-nextauth.md
```

---

## 🎯 Workflow Diagram

```
┌─────────────────────────────────────────────┐
│         USER: "Add feature X"               │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  1. CONTEXT7 SEARCH (External Docs)         │
│     → Query best practices                  │
│     → Get official patterns                 │
│     → Extract key concepts                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  2. FRIDAY SEARCH (Internal Memory)         │
│     → #friday-search "topic"                │
│     → Check existing implementations        │
│     → Review past decisions                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  3. PLAN (Silent - Internal Only)           │
│     → Combine external + internal           │
│     → Resolve conflicts                     │
│     → Determine approach                    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  4. IMPLEMENT                               │
│     → Write code                            │
│     → Follow best practices                 │
│     → Add tests                             │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  5. DOCUMENT                                │
│     → Create implementation.md              │
│     → Include references                    │
│     → Add code samples                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  6. SYNC                                    │
│     → #friday-sync                          │
│     → Save to Git                           │
│     → Cache in Redis                        │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  7. RESPOND (Concise)                       │
│     → "✅ Done: X"                          │
│     → Files: [list]                         │
│     → Best practices: [list]                │
│     → References: [Context7]                │
│     → Docs: [memory link]                   │
└─────────────────────────────────────────────┘
```

---

## 💡 Key Benefits

### 1. Quality
- ✅ Always uses official best practices
- ✅ Follows industry standards
- ✅ Consistent with existing code

### 2. Learning
- ✅ Documents WHY decisions made
- ✅ Links to authoritative sources
- ✅ Builds knowledge base over time

### 3. Efficiency
- ✅ No reinventing wheel
- ✅ Proven patterns
- ✅ Reduced bugs

### 4. Traceability
- ✅ Every implementation documented
- ✅ References to sources
- ✅ Decision history tracked

---

## 🚀 Example: Complete Flow

### User Request:
```
"Add Stripe payment integration"
```

### AI Complete Process:

**1. Context7 Search:**
```
Query: "stripe payment integration best practices nextjs"
Results:
- Stripe Elements for secure forms
- Webhook handling patterns
- Idempotency keys for reliability
- Error handling strategies
```

**2. FRIDAY Search:**
```
#friday-search "payment integration"
Results:
- No existing payment implementation
- Decision: Use server-side processing (2025-10-01-api-security.md)
- Note: All external API calls must be server-side
```

**3. Plan (Silent):**
```
Approach:
- Stripe Elements (Context7 best practice)
- Server Actions (Next.js pattern + internal decision)
- Webhook endpoint with signature verification
- Idempotency keys (Stripe recommendation)
- Error boundaries (internal standard)
```

**4. Implement:**
```typescript
// Create files following best practices
- src/lib/stripe.ts (client initialization)
- src/app/api/webhooks/stripe/route.ts (webhook handler)
- src/actions/payment.ts (server actions)
- src/components/CheckoutForm.tsx (Stripe Elements)
- tests/payment.test.ts (comprehensive tests)
```

**5. Document:**
```markdown
# Implementation: Stripe Payment Integration

**Date:** 2025-11-09
**Status:** Completed

## What Was Implemented
[Full documentation with Context7 references]

## Best Practices Applied
- Stripe Elements for PCI compliance (Stripe docs)
- Server-side processing (internal security standard)
- Webhook signature verification (Stripe security)
- Idempotency keys (Stripe reliability)

## References
- Stripe Elements: https://stripe.com/docs/elements
- Webhooks: https://stripe.com/docs/webhooks
- Related: .github/memory/decisions/2025-10-01-api-security.md
```

**6. Sync:**
```
#friday-sync → Saved to Git + Redis
```

**7. Response:**
```
✅ Added Stripe payment integration

Files:
- src/lib/stripe.ts (initialization)
- src/app/api/webhooks/stripe/route.ts (webhook)
- src/actions/payment.ts (server actions)
- src/components/CheckoutForm.tsx (UI)
- tests/payment.test.ts (28 tests ✅)

Best practices applied:
- Stripe Elements (PCI compliant)
- Webhook signature verification
- Idempotency keys for reliability
- Server-side processing only

References:
- Stripe Integration Guide (Context7)

Docs: .github/memory/implementations/2025-11-09-stripe-payment.md
```

---

## ✅ Success Criteria

AI follows workflow correctly if:

- [x] Context7 queried BEFORE implementation
- [x] FRIDAY memory searched
- [x] Best practices from both sources combined
- [x] Implementation includes references
- [x] Documentation comprehensive
- [x] Response concise (<10 lines)
- [x] Sync completed

---

**This workflow ensures every implementation is backed by official documentation and internal context!** 📚🚀
