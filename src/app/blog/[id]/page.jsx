"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Head from "next/head";
import Link from "next/link";

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  // Fetch all blog posts for related posts
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Fetch specific blog post
  useEffect(() => {
    if (postId) {
      fetchBlogPost(postId);
    }
  }, [postId]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/articles");
      const data = await response.json();

      if (data.success) {
        const transformedPosts = data.data.articles.map((article) => ({
          id: article._id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          author: article.authorId?.email || "Auteur inconnu",
          authorId: article.authorId?._id,
          category: article.tags?.[0] || "Général",
          tags: article.tags || [],
          isMemberOnly: article.isMemberOnly,
          isPublished: article.isPublished,
          date: new Date(article.publishedAt).toLocaleDateString("fr-FR"),
          readTime: `${Math.ceil(article.content.length / 1000)} min read`,
          viewCount: article.views,
          publishedAt: article.publishedAt,
        }));

        setBlogPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const fetchBlogPost = async (postId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${postId}`);
      const data = await response.json();

      if (data.success) {
        const article = data.data.article || data.data;
        const transformedPost = {
          id: article._id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          author: article.authorId?.email || "Auteur inconnu",
          authorId: article.authorId?._id,
          category: article.tags?.[0] || "Général",
          tags: article.tags || [],
          isMemberOnly: article.isMemberOnly,
          isPublished: article.isPublished,
          date: new Date(article.publishedAt).toLocaleDateString("fr-FR"),
          readTime: `${Math.ceil(article.content.length / 1000)} min read`,
          viewCount: article.views,
          publishedAt: article.publishedAt,
        };

        setSelectedPost(transformedPost);

        // Find related posts based on tags
        const related = blogPosts
          .filter(
            (post) =>
              post.id !== article._id &&
              post.tags.some((tag) => article.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      // Fallback to client-side search if API endpoint doesn't exist
      const post = blogPosts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
        const related = blogPosts
          .filter((p) => p.id !== postId && p.category === post.category)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        // Redirect to blog list if post not found
        router.push('/blog');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="min-h-screen bg-blue-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de l'article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div>
        <Header />
        <main className="min-h-screen bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-blue-800 mb-4">
              Article non trouvé
            </h1>
            <Link href="/blog" className="text-blue-600 hover:underline">
              Retour au blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>
          {selectedPost.title} - Blog La Fédération Algérienne des Pharmaciens
        </title>
        <meta name="description" content={selectedPost.excerpt} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <div className="w-full py-4">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-blue-800 font-medium hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft /> Retour au blog
            </Link>
          </div>

          {/* Blog post detail */}
          <article className="w-full max-w-4xl mx-auto py-8">
            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-800 text-white rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              {selectedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <FaUser className="text-sm" />
                <span>{selectedPost.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="text-sm" />
                <span>{formatDate(selectedPost.publishedAt)}</span>
              </div>
              <div>
                <span>{selectedPost.readTime}</span>
              </div>
              <div>
                <span>{selectedPost.viewCount} vues</span>
              </div>
            </div>

            <div className="bg-gray-200 aspect-video rounded-lg mb-8 flex items-center justify-center">
              <span className="text-gray-500">Image de l'article</span>
            </div>

            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {selectedPost.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-blue-800">
                  Articles similaires
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
                    >
                      <div className="bg-gray-200 aspect-video flex items-center justify-center">
                        <span className="text-gray-500">Image</span>
                      </div>
                      <div className="p-4">
                        <span className="px-2 py-1 bg-blue-800 text-white rounded-full text-xs">
                          {post.category}
                        </span>
                        <h4 className="font-semibold text-lg text-blue-800 mt-2 mb-1 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">
                À propos de l'auteur
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-semibold">
                    {selectedPost.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">
                    {selectedPost.author}
                  </h4>
                  <p className="text-gray-600">
                    Passionné par l'innovation pharmaceutique, il contribue
                    au développement de solutions modernes pour la santé.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}