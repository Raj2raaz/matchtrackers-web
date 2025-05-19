import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function CricketBlog() {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data.blog); // assuming response contains a 'blog' object
      } catch (error) {
        toast.error("Error Fetching Blog");
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (blog.sections && Array.isArray(blog.sections)) {
      // NEW STRUCTURE
      return blog.sections.map((section, idx) => {
        if (section.type === "content") {
          return (
            <div key={idx} className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
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
                <p className="text-sm text-center text-gray-500 mt-1">
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
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
              {para.subtitle}
            </h2>
          )}
          <p className="text-gray-700 leading-relaxed text-base">
            {para.content}
          </p>
        </div>
      ));
    } else {
      return <p className="text-gray-500">No content available.</p>;
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

      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            {blog.title}
          </h1>

          {(blog.featuredImage || blog.img) && (
            <img
              className="w-full  object-cover rounded-xl mb-10 shadow"
              src={blog.featuredImage || blog.img}
              alt={blog.title}
            />
          )}

          <div className="space-y-8">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
