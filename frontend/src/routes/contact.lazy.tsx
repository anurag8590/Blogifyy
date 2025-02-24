import { createLazyFileRoute } from '@tanstack/react-router'
import ContactPage from '@/pages/contact/contact'
export const Route = createLazyFileRoute('/contact')({
  component: ContactPage
})


