import 'server-only'
import type { GitHubRepo } from '@/types/github'

const GITHUB_API = 'https://api.github.com'

export async function getRepos(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN

  // /user/repos requiere auth y devuelve públicos + privados
  // /users/{user}/repos solo devuelve públicos
  const res = await fetch(`${GITHUB_API}/user/repos?per_page=100&sort=updated&affiliation=owner`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    next: { revalidate: 3600, tags: ['github-repos'] },
  })

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)

  const data = await res.json()
  return data as GitHubRepo[]
}

const HACKER_TOPICS = ['security', 'ctf', 'hacking', 'pentest', 'cybersecurity', 'osint', 'pentesting']
const DEV_TOPICS = ['dev', 'fullstack', 'frontend', 'backend', 'nextjs', 'react', 'api', 'typescript', 'javascript', 'python', 'nodejs', 'ecommerce', 'landing-page', 'cli']

const HACKER_NAME_PATTERNS = [/security/i, /hack/i, /pentest/i, /ctf/i, /osint/i, /exploit/i, /vuln/i, /cyber/i]
const DEV_NAME_PATTERNS = [/landing/i, /ecommerce/i, /shop/i, /store/i, /app/i, /web/i, /front/i, /back/i, /api/i, /chat/i, /finance/i, /stock/i, /pedidos/i, /gestion/i, /booked/i, /vending/i, /escrutinio/i, /racket/i, /rapidito/i, /hexa/i, /solar/i, /pocket/i, /retro/i, /tecno/i, /folio/i]

export function categorizeRepo(repo: GitHubRepo): 'dev' | 'hacker' | 'other' {
  const topics = repo.topics ?? []
  const searchText = `${repo.name} ${repo.description ?? ''}`.toLowerCase()

  if (topics.some((t) => HACKER_TOPICS.includes(t))) return 'hacker'
  if (HACKER_NAME_PATTERNS.some((p) => p.test(searchText))) return 'hacker'

  if (topics.some((t) => DEV_TOPICS.includes(t))) return 'dev'
  if (DEV_NAME_PATTERNS.some((p) => p.test(searchText))) return 'dev'

  return 'other'
}
