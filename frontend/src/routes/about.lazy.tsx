import { createLazyFileRoute } from '@tanstack/react-router'
import AboutPage from '@/pages/about/about'
export const Route = createLazyFileRoute('/about')({
  component: AboutPage
})

