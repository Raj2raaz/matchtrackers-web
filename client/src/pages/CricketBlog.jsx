import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogSkeleton from "../components/BlogSkeleton";


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
  return <BlogSkeleton />;
}


  const renderContent = () => {
    if (blog.sections && Array.isArray(blog.sections)) {
      // NEW STRUCTURE
      return blog.sections.map((section, idx) => {
        if (section.type === "content") {
          // Add Tailwind classes to h1, h2, h3
          const styledHTML = section.content
            .replace(
              /<h([1-3])>/g,
              '<h$1 class="text-2xl font-medium text-indigo-700">'
            )
            .replace(
              /<h([1-3])\s+class="(.*?)">/g,
              '<h$1 class="$2 text-2xl font-medium text-indigo-700">'
            );

          return (
            <div key={idx} className="prose max-w-none">
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

          <div className="mt-16 border-t pt-10">
            <div className="flex md:flex-row flex-col gap-10 md:gap-0 items-center space-x-6">
              <img
                src="https://media.licdn.com/dms/image/v2/C4E03AQEHzBiFN-u1UQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1621057196221?e=1756944000&v=beta&t=BJtjmUEiF9Hfgvi-OrEFeAthiwbj7ieL2GGTYchEHJw"
                alt="Arvind Kumar M"
                className="w-20 h-20 rounded-full object-cover shadow"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Arvind Kumar M
                </h3>
                <p className="text-sm text-gray-600 leading-snug max-w-xl">
                  As a Writer and Director with four years of experience
                  collaborating with diverse production houses, visionary
                  filmmakers, and corporate giants, Arvind brings a
                  writer-centric approach to content creation. His storytelling
                  craft shapes industries through emotionally resonant and
                  visually impactful narratives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
