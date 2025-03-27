import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const NotFoundPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0">
        <img
          src="/3793096.jpg"
          alt="Not Found"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Overlay (for readability) */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content (Centered Text + Button) */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-5xl font-bold">404 - Page Not Found</h1>
        <p className="mt-3 text-lg">The page you're looking for doesn't exist.</p>

        {/* Go Home Button */}
        <Link to="/">
          <Button
            variant="outline"
            className="mt-6 px-6 py-3 text-lg border-white border-2 bg-transparent text-white cursor-pointer focus:ring-0 focus:outline-none"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
