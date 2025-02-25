import { getBlogsByCategoryId } from '@/services/blog.service'
import CategoriesBlogPage from '@/pages/categories/category-blog-page';
import { createFileRoute, redirect} from '@tanstack/react-router'
import { isAuthenticated } from '@/services/auth.service';

export const Route = createFileRoute('/blogs/category/$catid')({
    beforeLoad: () => {
        if (!isAuthenticated()) {
          return redirect({ to: "/login" });
        }
      },
    component: CategoriesBlogPage,
    loader: async({params}) => {
        const blogData = await getBlogsByCategoryId(Number(params.catid));
        return blogData
}
})
