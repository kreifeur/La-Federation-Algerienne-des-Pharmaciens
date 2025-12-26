"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Head from "next/head";
import Link from "next/link";

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

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const response = await fetch("/api/articles");
      const data = await response.json();

      if (data.success) {
        // Transform API data to match component structure
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
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        }));

        setBlogPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const response = await fetch("/api/articles");
      const data = await response.json();

      if (data.success) {
        // Get most viewed posts
        const popular = data.data.articles
          .sort((a, b) => b.views - a.views)
          .slice(0, 3)
          .map((article) => ({
            id: article._id,
            title: article.title,
            excerpt: article.excerpt,
            author: article.authorId?.email || "Auteur inconnu",
            category: article.tags?.[0] || "Général",
            tags: article.tags || [],
            date: new Date(article.publishedAt).toLocaleDateString("fr-FR"),
            readTime: `${Math.ceil(article.content.length / 1000)} min read`,
            viewCount: article.views,
            content: article.content,
          }));

        setPopularPosts(popular);
      }
    } catch (error) {
      console.error("Error fetching popular posts:", error);
    }
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "Tous" ||
      post.tags.includes(selectedCategory) ||
      post.category === selectedCategory;

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Head>
        <title>Blog - Association de Cosmétologie</title>
        <meta
          name="description"
          content="Articles et actualités de l'Association de Cosmétologie"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          {/* Blog Header */}
          <section className="w-full mb-8 text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Blog</h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Découvrez les dernières tendances, les conseils d'experts et
              l'actualité du monde pharmaceutique
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
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer block"
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
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
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
                          <span className="text-sm text-gray-500">
                            {post.date}
                          </span>
                        </div>
                      </div>
                    </Link>
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
                    <h3 className="font-semibold text-lg text-blue-800 mt-2 mb-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}