import { Github, Mail, Linkedin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hi, I'm Anurag 👋
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Exploring the world of modern web development
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              About This Project
            </h2>
            
            <p className="text-gray-600 mb-6">
              This blog platform represents my journey into modern web development, marking my first venture into the React ecosystem. I'm combining React with TypeScript and Vite for the frontend, while leveraging FastAPI for the backend—a technology I'm already familiar with.
            </p>

            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Tech Stack
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">Frontend</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>React with TypeScript</li>
                    <li>Vite for build tooling</li>
                    <li>TanStack Router</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">Backend</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>FastAPI</li>
                    <li>SQLAlchemy</li>
                    <li>PostgreSQL</li>
                    <li>Pydantic</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Learning Journey
            </h3>
            <p className="text-gray-600 mb-6">
              While I'm experienced with FastAPI for backend development, this project marks my first exploration into React, TypeScript, and Vite. It's been an exciting challenge learning these modern frontend technologies and seeing how they complement my backend expertise.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Future Plans
            </h3>
            <p className="text-gray-600 mb-6">
              As I continue to learn and grow, I plan to add more features to this platform, improve the user experience, and optimize performance. I'm particularly excited about exploring more advanced React patterns and TypeScript features.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Let's Connect
          </h2>
          <div className="flex justify-center space-x-6">
            <a 
              href="http://github.com/anurag8590" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Github size={24} />
            </a>
            <a 
              href="http://github.com/anurag8590" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="mailto:anuragranjan707@gmail.com" 
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}