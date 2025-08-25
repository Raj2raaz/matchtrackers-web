import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticleSkeleton from "../components/ArticleSkeleton.jsx";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { content, setContent, refresh, refreshNow } = useMainStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/blogs").then((res) =>
          res.ok ? res.json() : { blogs: [] }
        );

        const data = response.blogs || [];
        const isCricket = window.location.pathname.includes("cricket");

        const filtered = data.filter((blog) =>
          isCricket ? blog.type === "cricket" : blog.type === "football"
        );

        setBlogs(filtered);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  const getBlogPreview = (blog) => {
    if (blog.sections) {
      const firstContent = blog.sections.find((s) => s.type === "content");
      return (
        firstContent?.content?.replace(/<[^>]+>/g, "").substring(0, 120) + "..."
      );
    }

    if (blog.paragraphs && Array.isArray(blog.paragraphs)) {
      const firstPara = blog.paragraphs[0]?.content;
      return firstPara?.substring(0, 120) + "...";
    }

    return "No preview available.";
  };

  const getBlogImage = (blog) => {
    return blog.featuredImage || blog.img || "/api/placeholder/400/300";
  };

  const getRelativeTime = () => {
    const options = [
      "2 hours ago",
      "4 hours ago",
      "Yesterday",
      "2 days ago",
      "Last week",
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getReadingTime = () => {
    return `${Math.floor(Math.random() * 8) + 3} min read`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <div className="bg-gray-300 dark:bg-gray-700 h-80 w-full rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
          No articles found. Check back later!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Featured Article */}
      <div
        onClick={() =>
          navigate(
            `/blog/${blogs[0]?.id}/${
              blogs[0]?.slug?.split(" ")?.join("-") || ""
            }`
          )
        }
        className="cursor-pointer group max-w-xxl mx-auto"
      >
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
          <img
            src={getBlogImage(blogs[0])}
            alt={blogs[0]?.title}
            className="w-full h-140 object-cover object-center group-hover:scale-105 transition duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
            <div className="flex items-center space-x-2 mb-2.5">
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                Featured
              </span>
              <span className="text-gray-200 text-sm">{getRelativeTime()}</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2.5 group-hover:text-blue-200 transition">
              {blogs[0]?.title}
            </h2>
            <p className="text-gray-200 line-clamp-2 mb-3">
              {getBlogPreview(blogs[0])}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <span className="text-white text-sm font-medium">
                  Editor's Pick
                </span>
              </div>
              <span className="text-gray-300 text-sm">{getReadingTime()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(1).map((blog, index) => (
          <div
            key={blog.id || index}
            onClick={() =>
              navigate(
                `/blog/${blog.id}/${blog?.slug?.split(" ")?.join("-") || ""}`
              )
            }
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col h-full"
          >
            <div className="overflow-hidden h-48">
              <img
                src={getBlogImage(blog)}
                alt={blog.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {getRelativeTime()}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                  {getReadingTime()}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-2 text-gray-900 dark:text-white">
                {blog.title}
              </h3>
              {/* <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {getBlogPreview(blog)}
              </p> */}
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"
                    src="https://media.licdn.com/dms/image/v2/C4E03AQEHzBiFN-u1UQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1621057196221?e=1756944000&v=beta&t=BJtjmUEiF9Hfgvi-OrEFeAthiwbj7ieL2GGTYchEHJw"
                    alt=""
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Arvind Kumar M
                  </span>
                </div>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition">
                  Read more
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition flex items-center space-x-2">
          <span>Load more articles</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
