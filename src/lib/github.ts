import 'server-only'
import type { GitHubRepo } from '@/types/github'
import type { SecGroup } from '@/types/projects'

const GITHUB_API = 'https://api.github.com'
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'jmsD3v'

export async function getRepos(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN
  const url = token
    ? `${GITHUB_API}/user/repos?per_page=100&sort=updated&affiliation=owner`
    : `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: 3600, tags: ['github-repos'] },
    })
    if (!res.ok) return []
    return (await res.json()) as GitHubRepo[]
  } catch {
    return []
  }
}

// ── Categorisation ────────────────────────────────────────────────────────────

const HACKER_TOPICS = ['security', 'ctf', 'hacking', 'pentest', 'cybersecurity', 'osint', 'pentesting']
const DEV_TOPICS    = ['dev', 'fullstack', 'frontend', 'backend', 'nextjs', 'react', 'api', 'typescript', 'javascript', 'python', 'nodejs', 'ecommerce', 'landing-page', 'cli']

const HACKER_NAME_PATTERNS = [/security/i, /hack/i, /pentest/i, /ctf/i, /osint/i, /exploit/i, /vuln/i, /cyber/i]
const DEV_NAME_PATTERNS    = [/landing/i, /ecommerce/i, /shop/i, /store/i, /app/i, /web/i, /front/i, /back/i, /api/i, /chat/i, /finance/i, /stock/i, /pedidos/i, /gestion/i, /booked/i, /vending/i, /escrutinio/i, /racket/i, /rapidito/i, /hexa/i, /solar/i, /pocket/i, /retro/i, /tecno/i, /folio/i]

export function categorizeRepo(repo: GitHubRepo): 'dev' | 'hacker' | 'other' {
  const topics     = repo.topics ?? []
  const searchText = `${repo.name} ${repo.description ?? ''}`.toLowerCase()

  if (topics.some((t) => HACKER_TOPICS.includes(t))) return 'hacker'
  if (HACKER_NAME_PATTERNS.some((p) => p.test(searchText))) return 'hacker'
  if (topics.some((t) => DEV_TOPICS.includes(t))) return 'dev'
  if (DEV_NAME_PATTERNS.some((p) => p.test(searchText))) return 'dev'
  return 'other'
}

// ── Cybersecurity sub-groups ──────────────────────────────────────────────────

// Explicit order: P-01 → P-02 → P-03, D-01 → D-02 → D-03, F-01 → F-02 → F-03
const SEC_GROUP_MAP: Record<string, { group: SecGroup; order: number }> = {
  reconai:     { group: 'offensive', order: 1 },
  webhunter:   { group: 'offensive', order: 2 },
  phishsim:    { group: 'offensive', order: 3 },
  soclite:     { group: 'defensive', order: 1 },
  threatfeed:  { group: 'defensive', order: 2 },
  honeygrid:   { group: 'defensive', order: 3 },
  dfirauto:    { group: 'forensic',  order: 1 },
  malwarescope:{ group: 'forensic',  order: 2 },
  pcapforge:   { group: 'forensic',  order: 3 },
}

export function getSecGroup(repo: GitHubRepo): SecGroup | undefined {
  return SEC_GROUP_MAP[repo.name.toLowerCase()]?.group
}

export function getSecOrder(repo: GitHubRepo): number {
  return SEC_GROUP_MAP[repo.name.toLowerCase()]?.order ?? 99
}
