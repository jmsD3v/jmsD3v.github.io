# Feature Landscape: jms-folio Multi-Profile Portfolio

**Domain:** Multi-profile developer + cybersecurity personal portfolio
**Researched:** 2026-05-04
**Confidence notes:** Web research tools blocked. All findings from training data (cutoff Aug 2025), which covers 2024-2025 portfolio ecosystem well. Confidence levels noted per section.

---

## Table Stakes

Features every serious portfolio must have. Missing any of these causes visitors to bounce or dismiss credibility.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hero with name + title | Instant identity — visitors need to know who this is in <3 seconds | Low | Must answer "Dev or Security?" immediately |
| Readable contact method | Employers/clients need a next step | Low | Email link or contact form; LinkedIn at minimum |
| Projects section | The actual evidence of skill — without this it's just a resume | Medium | Must link to live work or GitHub repos |
| Tech stack / skills display | Screening step — clients and employers scan for specific technologies | Low | Visual icon grid or tag list is fine; don't over-engineer |
| Mobile responsiveness | 40-60% of traffic arrives on mobile even for dev portfolios | Medium | Especially important for LinkedIn referrals |
| Fast load time (<3s) | Google Lighthouse matters; slow = immediate credibility hit | Medium | Critical with heavy animations — lazy load everything |
| Accessible navigation | Screen readers, keyboard nav; also SEO signal | Low | ARIA labels, skip-to-content link |
| About section | Human connection — clients hire people, not tech stacks | Low | Short, personality-forward, not a resume dump |
| Working links | Broken GitHub/project links destroy trust instantly | Low | Test every link before launch; use Next.js Link |
| Semantic page title + meta description | SEO basics for discoverability from search | Low | "Juan Manuel Silva - Full Stack Dev & Cybersecurity" |
| Social proof indicators | Something to show real work has shipped | Low | GitHub stats, repo stars, or testimonial blurb |

**Confidence: HIGH** — These are universal across every portfolio benchmark from 2022-2025.

---

## Differentiators

Features that separate a memorable portfolio from a forgettable one. These are the reason someone shows it to their team and says "look at this."

### Category: Visual Identity & First Impression

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Terminal/glitch hero with dual identity reveal | The dual-profile concept becomes a narrative, not just a layout | High | Type "Dev" then glitch-transition to "Hacker" — single interaction tells the whole story |
| Animated background (particles, matrix rain, scanlines) | Instantly communicates the aesthetic — no words needed | Medium | Keep GPU-aware: use `requestAnimationFrame`, reduce particle count on mobile |
| Custom cursor (crosshair, terminal blink, dot) | Tactile identity signal — user feels the aesthetic before reading anything | Low | A blinking `_` cursor or small crosshair is enough; avoid laggy cursor followers |
| Noise/grain texture overlay | Adds premium dark-screen feel that flat black doesn't have | Low | CSS `filter: url(#noise)` or `backdrop-filter`; near-zero performance cost |
| Monospace / hacker font throughout | Reinforces terminal aesthetic without a single line of copy | Low | JetBrains Mono, Fira Code, or IBM Plex Mono — already in Google Fonts |

### Category: Multi-Profile Execution

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Scroll-triggered profile switch (not a tab) | The transition itself IS the storytelling — visitor experiences the duality | High | GSAP ScrollTrigger pinning + color/content morph; see Anti-Features for tab alternative |
| Color mode shift per profile (green-terminal vs blue-cyber vs white-clean) | Visual cue so visitor always knows which profile they're reading | Medium | CSS custom properties make this trivial to animate |
| Profile-aware URL anchors (#dev, #security) | Shareable deep links — "here's my security profile" sent to a recruiter | Low | Next.js router, no extra work if sections have IDs |
| Brief role-specific pitch per profile | Each profile answers "why hire me for THIS specifically" | Low | 2-3 sentences, not a paragraph; separate from the global about |

### Category: GitHub Integration

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Topic-based categorization (dev/security topics) | Zero-maintenance filtering — push a repo with `topic: security`, it appears in the right profile | Medium | GitHub Topics API returns `topics[]` array per repo; filter client-side |
| Language badge per repo card | Visual scanning signal — a recruiter spots "Rust" or "Python" instantly | Low | GitHub API returns `language` field directly |
| Star + fork counts on cards | Social proof without writing a word | Low | `stargazers_count`, `forks_count` in API response |
| Live "last pushed" timestamp | Shows the portfolio is not abandoned — activity signals relevance | Low | `pushed_at` field; format as "3 days ago" with `date-fns` |
| Contribution graph / activity heatmap | Proves consistent coding habit over time | High | Requires GraphQL GitHub API or scraping; consider `github-contributions-api` package |
| Pinned repos as featured projects | Owner-controlled curation — best work appears first | Medium | GitHub GraphQL API `pinnedItems` query; REST API doesn't expose pinned repos directly |
| Link to live demo where available | Shows work that actually shipped | Low | Store demo URL in repo `homepage` field — GitHub API returns it |

### Category: Cybersecurity-Specific

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| CTF writeups section or link | The primary credibility signal in the security community — proves hands-on skill, not just theory | Medium | Can be external (HackTheBox profile, CTFtime, or a blog) — link is enough for v1 |
| Certifications display (OSCP, CEH, CompTIA, eJPT, etc.) | Instant trust with corporate buyers of security services | Low | Badge images from Credly or issuer; link to verification URL |
| Tools / methodology section | Shows depth of tradecraft, not just tool names | Medium | Group by phase: Recon / Exploitation / Post-Exploitation / Reporting |
| HackTheBox / TryHackMe profile embed or stats | Third-party social proof — rank and completion stats are verifiable | Low | Both platforms have public profile pages; embed a badge or link |
| Responsible disclosure or CVE mentions | Strongest security credential possible | Low | Only include if real — a single real disclosure beats 10 CTF completions |
| "What I can do for you" security services list | Translates skill into a service a client can buy | Low | Pentest, security review, red team, OSINT — pick the ones actually offered |

### Category: Scroll Animation Patterns with Wow-Factor

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| ScrollTrigger-pinned profile transition | Scroll progress drives a full-screen morph between Dev and Hacker sections | High | Pin the section, use `scrub: true` — the user literally "peels" from one profile to another |
| Staggered card reveal (bottom-up cascade) | Project cards entering one after another feels alive, not static | Low | Framer Motion `staggerChildren` + `whileInView` — 3-5 lines of code |
| Text reveal by word/character (split-text) | Headline words materialize as user scrolls — high drama on hero phrases | Medium | GSAP SplitText or a simple character-by-character span animation |
| Horizontal scroll section for project cards | Desktop users slide sideways through projects — feels app-like, not webpage-like | High | GSAP `ScrollTrigger` horizontal scrub inside a pinned section |
| Parallax depth layers (bg/mid/fg) | Creates 3D spatial feel on hero section | Medium | Different `y` transform speeds per layer; Framer Motion `useScroll` + `useTransform` |
| "Glitch on entry" for section headings | Each major section heading glitches in — reinforces hacker aesthetic on every section boundary | Low | CSS keyframe glitch animation triggered by IntersectionObserver; reusable |
| Reverse animation on scroll-up | Elements exit back the way they came — portfolio feels like a real spatial environment | Medium | Framer Motion `whileInView` with `exit` variants + `viewport: { once: false }` |
| Terminal typing effect for role/title | Classic but still powerful — the cursor blinks, then types the role | Low | `react-type-animation` or a 20-line custom hook; extremely low cost |
| Progress bar / scroll indicator | Visual feedback that there's more to see — reduces bounce from early exit | Low | Simple fixed top bar tracking `window.scrollY / document.body.scrollHeight` |

### Category: Contact & CTA

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Profile-specific CTA per section | Dev section CTA: "Hire me for your project" / Security section CTA: "Request a pentest" | Low | Different headline and button label per profile section; same underlying contact mechanism |
| One-click email link (mailto:) | Lowest friction possible for someone ready to hire | Low | `mailto:juanmanuelsilva06@gmail.com` — no form required for v1 |
| Calendar link (Calendly/Cal.com) | High-signal clients want to book a call, not write an email | Low | A single `/book` link embedded or a button; defer setup if not needed yet |
| Copy email to clipboard button | Subtle "hacker" touch — click the address, it copies | Low | `navigator.clipboard.writeText()` + toast notification |
| Download CV button (PDF) | Employers need this for ATS and HR processes | Low | Serve a static PDF from `/public`; update file in-place when CV changes |
| Availability indicator | "Available for freelance — starts June 2026" removes a question before they ask it | Low | Hardcoded string in a config; update manually when status changes |

**Confidence: HIGH** — Based on analysis of top-tier portfolios (Brittany Chiang, Bruno Simon, Cassie Evans, Jack Jeznach, leerob.io, Josh Comeau) and cybersecurity community norms from CTFtime, HackTheBox, and security job postings observed through 2024-2025.

---

## Anti-Features

Things to deliberately NOT build. Each one is a complexity trap that costs more than it delivers.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Blog in v1 | No content yet = empty section that signals "unfinished." CTF writeups belong on HackTheBox or a dedicated platform | Link externally to writeups; add blog only when there are 3+ real posts ready to publish |
| Interactive 3D WebGL hero (Three.js) | Massive bundle size (~300KB+), unpredictable GPU performance on mobile, kills Lighthouse score | Use CSS particle canvas or a lightweight tsParticles instance; cap particles on mobile |
| Tab-based profile switcher | Clicking a tab to switch profiles kills the narrative — it feels like a settings panel, not an identity | Use scroll-driven transition so the visitor experiences the duality as a journey |
| Skill percentage bars | Widely ridiculed — "90% React" means nothing, is unverifiable, and signals insecurity | Use technology icon grids (Devicons) or grouped tag lists by proficiency tier |
| Auto-playing audio | Instant bounce from any professional visitor — especially in a quiet office | Never. Sound only on explicit user action, if at all |
| Real-time chat widget (Tawk.to, Intercom) | Adds ~80KB, creates an obligation to monitor, looks amateur on a personal portfolio | Use mailto + availability text in footer |
| Infinite loading / too much content | Visitors don't scroll past ~4-5 sections before deciding — loading more repos doesn't help | Show 6-8 curated repos max; "view all on GitHub" link handles the rest |
| Animated skill radar/chart | Looks clever in a tutorial, looks amateur in a real portfolio | Grouped tech tag list is faster to scan and easier to update |
| CMS for copy | Content barely changes — a CMS adds infra cost and complexity for zero user-facing benefit | Edit text in TypeScript constants/config files; deploy takes 30 seconds |
| Contact form with backend | Spam magnets; needs server-side logic, env secrets, and maintenance | Use `mailto:` or Formspree/Netlify Forms (zero-infra form handling); add server form only if spam becomes a problem |
| Preloader / splash screen | Every second of loading before content = lost visitors. Splash screens are 2018 | Optimize bundle instead; use Next.js streaming to show content progressively |
| Cursor follower with heavy physics | Laggy cursor followers on mid-range machines feel broken, not impressive | Simple blinking underscore or a 4px dot — the aesthetic impact is identical |

**Confidence: HIGH** — These anti-patterns appear repeatedly in "portfolio review" threads on Twitter/X, r/webdev, r/cscareerquestions, and in professional design critique through 2024-2025.

---

## Feature Dependencies

```
GitHub API fetch → repo card display
GitHub API fetch → topic-based profile filtering
Topic-based filtering → Dev / Hacker / All filter UI
GitHub GraphQL API → pinned repos as featured
Pinned repos → featured projects section order

Scroll profile transition → CSS custom property theming
CSS custom property theming → color shift per profile
Color shift → all profile-aware sections

Terminal typing effect → hero identity reveal
Hero identity reveal → dual profile narrative
Dual profile narrative → profile-specific CTAs

CTF writeups (external) → security profile credibility
Certifications display → security section content
Tools/methodology → security section content
```

---

## MVP Recommendation

### Build in v1 (Ordered by Impact-to-Effort Ratio)

1. **Terminal typing hero with glitch identity reveal** — highest ROI single feature; sets aesthetic for everything else
2. **Scroll-driven Dev → Hacker section transition with color shift** — the core differentiator; if this is done well, the portfolio is already memorable
3. **GitHub API with topic filtering (dev/security)** — zero-maintenance project section; add `dev` and `security` topics to repos now
4. **Staggered project card reveal** — 10 lines of Framer Motion; huge visual payoff
5. **Cybersecurity: tools + certs + HTB/THM profile link** — establishes security credibility without needing CTF writeups
6. **Profile-specific CTAs** — direct commercial signal; makes the portfolio work for both client types
7. **Copy-email-to-clipboard + availability indicator** — low effort, professional polish
8. **Download CV button** — required by every employer

### Defer to v2

- **Contribution graph** — GitHub GraphQL complexity for moderate visual payoff; add after launch
- **Horizontal scroll project slider** — high complexity; implement after core sections are stable
- **Pinned repos via GraphQL** — requires GraphQL query setup; topic filtering covers 80% of the value for less complexity
- **CTF writeups section** — defer until there are 3+ writeups worth showing; link to HackTheBox profile in v1
- **Calendar booking link** — set up when actively seeking clients; not needed for launch
- **Blog** — defer until content exists

---

## Cybersecurity Portfolio Specifics

This section addresses the unique requirements of the security half of the profile.

### What the Security Community Expects to See

**Credibility signals (ranked by weight):**
1. CVE / responsible disclosure — if it exists, feature it prominently
2. OSCP or equivalent offensive certification — the gold standard; other certs below this
3. Active HackTheBox / TryHackMe rank — verifiable, current, shows ongoing practice
4. CTF writeups with methodology — shows thinking process, not just tools
5. GitHub repos with real security tools — scanners, exploits, automation scripts
6. eJPT, CEH, CompTIA Security+ — valid but lower signal than hands-on proof

**Methodology display (what to show per pentest phase):**
- Recon: Nmap, Shodan, theHarvester, Maltego, OSINT
- Enumeration: Gobuster/ffuf, enum4linux, LinPEAS/WinPEAS
- Exploitation: Metasploit, SQLMap, Burp Suite, custom scripts
- Post-exploitation: Mimikatz, BloodHound, CrackMapExec
- Reporting: deliverables format, remediation recommendations

**What to avoid in a security portfolio:**
- Claiming capabilities without evidence (no GitHub + no cert + no HTB = just words)
- Showing tools associated with illegal activity in a non-educational context
- Listing "Kali Linux" as a skill (it's an OS, not a skill)
- Generic "cybersecurity enthusiast" copy without specifics

### Recommended Security Section Structure

```
[Certifications] — badge images + verification links
[Tools by Phase] — grouped icon/tag grid, not a flat list
[Platforms] — HTB rank, THM rank, CTFtime profile link
[Notable Work] — CVEs, bug bounties, or 1-2 standout CTF wins
[Services Offered] — what a client can hire you for
```

---

## Sources

**Confidence: HIGH (training data — well-established by 2024-2025)**
- Portfolio patterns: Analysis of Brittany Chiang (brittanychiang.com), Bruno Simon (bruno-simon.com), Cassie Evans, Josh Comeau (joshwcomeau.com), Lee Robinson (leerob.io) — widely cited as benchmark portfolios
- Security community norms: HackTheBox community, CTFtime, OffSec community conventions, LinkedIn security recruiter behavior
- GitHub API: Public GitHub REST API v3 and GraphQL API v4 documentation (stable API, unchanged in capability scope)
- Anti-features: Synthesized from r/webdev portfolio reviews, r/cscareerquestions feedback threads, and professional UX critique patterns
- Scroll animation patterns: GSAP ScrollTrigger documentation and showcase examples, Framer Motion whileInView patterns

**Note on currency:** Web research tools were blocked during this research session. All findings reflect training knowledge through August 2025. Portfolio trends in this domain evolve slowly (6-12 month cycles). Confidence remains HIGH for structural/feature recommendations, MEDIUM for specific library version recommendations (verify in STACK.md).
