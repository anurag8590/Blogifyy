import CategoriesPage from '@/pages/categories/categories'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/categories')({
  component: CategoriesPage
})


