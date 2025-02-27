import myCategoriesPage from '@/pages/categories/my-categories'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/my-categories')({
  component: myCategoriesPage,
})
