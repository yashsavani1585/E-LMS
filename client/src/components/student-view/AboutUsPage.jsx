import { School, Users, BookOpen, Globe } from "lucide-react";
import { Link } from "react-router-dom";

function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About BRAINBOOST
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering learners worldwide with the best online courses. Join us on a journey of knowledge and growth.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <School className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide high-quality, accessible, and affordable education to everyone, everywhere.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Community</h2>
            <p className="text-gray-600">
              Join a global community of learners and educators passionate about sharing knowledge.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose BRAINBOOST?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wide Range of Courses</h3>
              <p className="text-gray-600">
                Explore thousands of courses in various fields, from technology to arts.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Globe className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Learn from the best instructors around the world, anytime, anywhere.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <School className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lifetime Access</h3>
              <p className="text-gray-600">
                Get lifetime access to all your purchased courses and resources.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join BRAINBOOST today and unlock your potential.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;