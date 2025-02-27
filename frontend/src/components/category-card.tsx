import { Link } from "@tanstack/react-router";

export const CategoryCard = ({ category_id, name, description, imageUrl }: { category_id: number, name: string, description: string, imageUrl: string }) => (
  <Link
    to="/blogs/category/$catid"
    params={{ catid: String(category_id) }}
    className="block group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-purple-100"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0" />
      <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white tracking-wide">{name}</h3>
    </div>
    <div className="p-6">
      <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors duration-300">
        Explore {name}
        <svg 
          className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
);