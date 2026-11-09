import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ContactView from '@/views/ContactView.vue'
import CvView from '@/views/CvView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import pl from '@/content/pl.json'

export type RouteName = 'home' | 'projects' | 'skills' | 'contact' | 'cv' | 'not-found'

type NamedRouteRecord = RouteRecordRaw & { name: RouteName }

// `cv.href` in the content files is the single switch for the CV page: empty hides
// the CV links and, here, the /cv route (so no prerender, sitemap or llms.txt entry).
const cvPublished = pl.cv.href.length > 0

const namedRoutes: NamedRouteRecord[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/projects', name: 'projects', component: ProjectsView },
  { path: '/skills', name: 'skills', component: SkillsView },
  { path: '/contact', name: 'contact', component: ContactView },
  ...(cvPublished ? [{ path: '/cv', name: 'cv', component: CvView } as NamedRouteRecord] : []),
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

export const routes: RouteRecordRaw[] = namedRoutes

// Routes without params: the ones that get prerendered, listed in sitemap and llms.txt.
export const staticRoutes: { path: string; name: RouteName }[] = namedRoutes
  .filter((route) => !route.path.includes(':'))
  .map((route) => ({ path: route.path, name: route.name }))

export const staticPaths: string[] = staticRoutes.map((route) => route.path)
