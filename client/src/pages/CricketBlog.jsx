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

  return (
    <>
      <Helmet>
        <title>{blog.title} | My Blog</title>
        <meta
          name="description"
          content={blog.paragraphs?.[0]?.content || "Read more on this blog."}
        />
        <meta property="og:title" content={blog.title} />
        <meta
          property="og:description"
          content={blog.paragraphs?.[0]?.content || ""}
        />
        <meta property="og:image" content={blog.img} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            {blog.title}
          </h1>
          {blog.img && (
            <img
              className="w-full h-72 sm:h-96 object-cover rounded-xl mb-10 shadow"
              src={blog.img}
              alt={blog.title}
            />
          )}

          <div className="space-y-8">
            {blog.paragraphs.map((para, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
                  {para.subtitle}
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {para.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
