import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Create the router instance
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent'
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  )
}

export default App