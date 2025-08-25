import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogSkeleton from "../components/BlogSkeleton";

export default function FootballBlog() {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data.blog);
      } catch (error) {
        toast.error("Error Fetching Blog");
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogResponse = await axios.get("/api/blog");
        console.log(news);
        setNews(blogResponse.data.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  if (!blog) {
    return <BlogSkeleton />;
  }

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

  const renderContent = () => {
    if (blog.sections && Array.isArray(blog.sections)) {
      // NEW STRUCTURE
      return blog.sections.map((section, idx) => {
        if (section.type === "content") {
          const styledHTML = section.content
            .replace(
              /<h([1-3])>/g,
              '<h$1 class="text-2xl font-medium text-indigo-700 dark:text-indigo-400">'
            )
            .replace(
              /<h([1-3])\s+class="(.*?)">/g,
              '<h$1 class="$2 text-2xl font-medium text-indigo-700 dark:text-indigo-400">'
            );

          return (
            <div
              key={idx}
              className="prose prose-gray dark:prose-invert max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: styledHTML }} />
            </div>
          );
        } else if (section.type === "image") {
          return (
            <div key={idx} className="my-8">
              <img
                src={section.url}
                alt={section.caption || "Blog image"}
                className="w-full rounded-xl shadow"
              />
              {section.caption && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
                  {section.caption}
                </p>
              )}
            </div>
          );
        }
        return null;
      });
    } else if (blog.paragraphs && Array.isArray(blog.paragraphs)) {
      // OLD STRUCTURE
      return blog?.paragraphs?.map((para, idx) => (
        <div key={idx}>
          {para.subtitle && (
            <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
              {para.subtitle}
            </h2>
          )}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            {para.content}
          </p>
        </div>
      ));
    } else {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          No content available.
        </p>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | My Blog</title>
        <meta
          name="description"
          content={
            blog.paragraphs?.[0]?.content ||
            blog.sections
              ?.find((s) => s.type === "content")
              ?.content?.replace(/<[^>]+>/g, "")
              .slice(0, 160) ||
            "Read more on this blog."
          }
        />
        <meta property="og:title" content={blog.title} />
        <meta
          property="og:description"
          content={
            blog.paragraphs?.[0]?.content ||
            blog.sections
              ?.find((s) => s.type === "content")
              ?.content?.replace(/<[^>]+>/g, "")
              .slice(0, 160) ||
            ""
          }
        />
        <meta
          property="og:image"
          content={blog.featuredImage || blog.img || ""}
        />
      </Helmet>

      <div>
        {/* Parent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Content Section (2/3 width) */}
          <div className="lg:col-span-2 min-h-screen bg-gray-50 dark:bg-gray-800 shadow py-10 px-4 md:px-8 transition-colors duration-300 rounded-xl">
            <div className="max-w-5xl mx-auto">
              {/* Blog Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap justify-center items-center gap-3 mb-8 text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {blog.author || "Arvind Kumar M"}
                </span>

                <span className="text-gray-400 dark:text-gray-500">•</span>

                <span className="text-gray-600 dark:text-gray-300">
                  {getRelativeTime()}
                </span>

                <span className="text-gray-400 dark:text-gray-500">•</span>

                <span className="text-gray-500 dark:text-gray-400">
                  {getReadingTime()}
                </span>
              </div>

              {/* Featured Image */}
              {(blog.featuredImage || blog.img) && (
                <img
                  loading="lazy"
                  className="w-full object-cover rounded-xl mb-10 shadow"
                  src={blog.featuredImage || blog.img}
                  alt={blog.title}
                />
              )}

              {/* Blog Content */}
              <div className="space-y-8 text-gray-800 dark:text-gray-100">
                {renderContent()}
              </div>

              {/* Author Section */}
              <div className="mt-16 border-t border-gray-300 dark:border-gray-700 pt-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img
                    src="https://media.licdn.com/dms/image/v2/C4E03AQEHzBiFN-u1UQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1621057196221?e=1756944000&v=beta&t=BJtjmUEiF9Hfgvi-OrEFeAthiwbj7ieL2GGTYchEHJw"
                    alt="Arvind Kumar M"
                    className="w-20 h-20 rounded-full object-cover shadow"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {blog.author || "Arvind Kumar M"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug max-w-xl">
                      As a Writer and Director with four years of experience
                      collaborating with diverse production houses, visionary
                      filmmakers, and corporate giants, Arvind brings a
                      writer-centric approach to content creation. His
                      storytelling craft shapes industries through emotionally
                      resonant and visually impactful narratives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest News Section (Right Sidebar) */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-4 lg:p-5 h-fit max-h-[600px] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Visit More News
              </h2>
              <a
                href="/football/blogs"
                className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View All
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
            </div>

            {/* News List */}
            <div className="space-y-3">
              {news.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/blog/${item.id}/${item.slug}`)}
                  className="flex cursor-pointer gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.img && (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-16 h-14 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-200 font-medium text-s line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] mt-1 line-clamp-2 text-gray-600 dark:text-gray-400">
                      {item.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
