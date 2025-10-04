"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";

const categories = [
  "Tous",
  "tendances",
  "innovation",
  "Maquillage",
  "Soins",
  "Naturel",
  "Nutrition",
  "Parfum",
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Fetch blog posts from API
  useEffect(() => {
    fetchBlogPosts();
  }, [selectedCategory, searchQuery]);

  // Fetch popular posts (most viewed)
  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match component structure
        const transformedPosts = data.data.articles.map(article => ({
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
          date: new Date(article.publishedAt).toLocaleDateString('fr-FR'),
          readTime: `${Math.ceil(article.content.length / 1000)} min read`,
          viewCount: article.views,
          publishedAt: article.publishedAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt
        }));
        
        setBlogPosts(transformedPosts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      
      if (data.success) {
        // Get most viewed posts
        const popular = data.data.articles
          .sort((a, b) => b.views - a.views)
          .slice(0, 3)
          .map(article => ({
            id: article._id,
            title: article.title,
            excerpt: article.excerpt,
            author: article.authorId?.email || "Auteur inconnu",
            category: article.tags?.[0] || "Général",
            date: new Date(article.publishedAt).toLocaleDateString('fr-FR'),
            readTime: `${Math.ceil(article.content.length / 1000)} min read`,
            viewCount: article.views,
            content: article.content
          }));
        
        setPopularPosts(popular);
      }
    } catch (error) {
      console.error('Error fetching popular posts:', error);
    }
  };

  const fetchBlogPost = async (postId) => {
    try {
      setLoading(true);
      const baseUrl = "https://backend-association-cosm-tologie.vercel.app/api";
      const response = await fetch(`${baseUrl}/articles/${postId}`);
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
          date: new Date(article.publishedAt).toLocaleDateString('fr-FR'),
          readTime: `${Math.ceil(article.content.length / 1000)} min read`,
          viewCount: article.views,
          publishedAt: article.publishedAt
        };
        
        setSelectedPost(transformedPost);
        
        // Find related posts based on tags
        const related = blogPosts
          .filter(post => 
            post.id !== article._id && 
            post.tags.some(tag => article.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      // Fallback to client-side search if API endpoint doesn't exist
      const post = blogPosts.find(p => p.id === postId);
      if (post) {
        setSelectedPost(post);
        const related = blogPosts
          .filter(p => p.id !== postId && p.category === post.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    // Increment view count if needed
    // You might want to call an API to increment views here
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "Tous" || 
      post.tags.includes(selectedCategory) || 
      post.category === selectedCategory;
    
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <div>
        <Head>
          <title>{selectedPost.title} - Blog Association de Cosmétologie</title>
          <meta name="description" content={selectedPost.excerpt} />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />
        
        <main className="min-h-screen bg-blue-50 py-12">
          <div className="container mx-auto px-4">
            {/* Back button */}
            <div className="w-full py-4">
              <button
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-blue-800 font-medium hover:text-blue-600 transition-colors"
              >
                <FaArrowLeft /> Retour au blog
              </button>
            </div>

            {/* Blog post detail */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement de l'article...</p>
              </div>
            ) : (
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
                  {selectedPost.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
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
                        <div
                          key={post.id}
                          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => handlePostClick(post)}
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
                        </div>
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
                      <h4 className="font-semibold text-blue-800">{selectedPost.author}</h4>
                      <p className="text-gray-600">
                        Passionné par l’innovation pharmaceutique, il contribue au développement de solutions modernes pour la santé.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Blog - Association de Cosmétologie</title>
        <meta name="description" content="Articles et actualités de l'Association de Cosmétologie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          {/* Blog Header */}
          <section className="w-full mb-8 text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Blog</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Découvrez les dernières tendances, les conseils d’experts et l’actualité du monde pharmaceutique
            </p>
          </section>

          {/* Search and Filter */}
          <section className="w-full max-w-5xl mx-auto mb-12">
            <div className="flex sm:flex-row flex-col gap-4 items-center justify-between mb-8">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex items-center gap-2">
                <BiSolidCategory className="text-blue-800" />
                <select
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement des articles...</p>
              </div>
            )}

            {/* Blog Posts Grid */}
            {!loading && (
              <>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="bg-gray-200 aspect-video flex items-center justify-center">
                        <span className="text-gray-500">Image</span>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="px-3 py-1 bg-blue-800 text-white rounded-full text-sm">
                            {post.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-semibold text-xl text-blue-800 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-800 text-sm font-semibold">
                                {post.author.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {post.author}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      Aucun article ne correspond à votre recherche.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Popular Posts */}
          <section className="w-full max-w-8xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
              Articles Populaires
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {popularPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="bg-gray-200 aspect-video flex items-center justify-center">
                    <span className="text-gray-500">Image</span>
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-1 bg-blue-800 text-white rounded-full text-xs">
                      {post.category}
                    </span>
                    <h3 className="font-semibold text-lg text-blue-800 mt-2 mb-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}