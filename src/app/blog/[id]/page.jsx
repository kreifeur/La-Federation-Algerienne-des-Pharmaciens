// app/blog/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Données d'article simulées (en réalité, vous récupéreriez cela par ID)
  useEffect(() => {
    // Simulation de chargement des données
    const fetchPost = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données factices pour l'exemple
      const postData = {
        id: 1,
        title: "Les nouvelles réglementations cosmétiques en 2023",
        content: `
          <h2>Introduction</h2>
          <p>L'année 2023 apporte son lot de nouveautés réglementaires dans le domaine de la cosmétologie. Ces changements impactent tous les acteurs de l'industrie, des fabricants aux distributeurs.</p>
          
          <h2>Nouvelles restrictions sur certains ingrédients</h2>
          <p>Plusieurs ingrédients previously autorisés font désormais l'objet de restrictions plus strictes. Parmi eux, on peut citer :</p>
          <ul>
            <li>Le MIT (Methylisothiazolinone) - désormais interdit dans les produits sans rinçage</li>
            <li>Les microplastiques - interdiction progressive sur tous les produits cosmétiques</li>
            <li>Certains filtres UV - nouvelles limitations de concentration</li>
          </ul>
          
          <h2>Exigences renforcées pour l'étiquetage</h2>
          <p>L'étiquetage des produits cosmétiques évolue également avec :</p>
          <ul>
            <li>Une lisibilité améliorée des précautions d'emploi</li>
            <li>L'indication obligatoire de la période après ouverture</li>
            <li>Des mentions plus détaillées sur l'origine des ingrédients</li>
          </ul>
          
          <h2>Impact sur les tests de sécurité</h2>
          <p>Les protocoles d'évaluation de la sécurité des produits ont été renforcés, avec une attention particulière portée aux :</p>
          <ul>
            <li>Tests d'hypoallergénicité</li>
            <li>Études de stabilité accélérée</li>
            <li>Vérifications de la non-comédogénicité</li>
          </ul>
          
          <h2>Conclusion</h2>
          <p>Ces évolutions réglementaires visent à renforcer la protection des consommateurs tout en encourageant l'innovation responsable dans le secteur cosmétique. Il est essentiel pour les professionnels de se tenir informés de ces changements pour assurer la conformité de leurs produits.</p>
        `,
        category: "news",
        date: "2023-09-15",
        readTime: "5 min",
        author: "Dr. Sophie Martin",
        authorRole: "Experte en réglementation",
        image: "/api/placeholder/800/400"
      };
      
      setPost(postData);
      
      // Articles similaires
      setRelatedPosts([
        {
          id: 3,
          title: "Les avancées de la recherche sur le vieillissement cutané",
          category: "science",
          date: "2023-09-05",
          readTime: "10 min"
        },
        {
          id: 6,
          title: "Comment formuler une crème hydratante efficace",
          category: "tips",
          date: "2023-08-15",
          readTime: "12 min"
        },
        {
          id: 8,
          title: "Interview exclusive avec le fondateur de NaturalSkin",
          category: "news",
          date: "2023-08-05",
          readTime: "11 min"
        }
      ]);
    };
    
    fetchPost();
  }, [params.id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/blog"
            className="text-blue-600 hover:text-blue-500 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au blog
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image de couverture */}
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Image: {post.title}</span>
          </div>

          <div className="p-8">
            {/* En-tête */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-3">
                Actualités
              </span>
              <span>{formatDate(post.date)}</span>
              <span className="mx-3">•</span>
              <span>{post.readTime}</span>
            </div>

            {/* Titre */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* Auteur */}
            <div className="flex items-center mb-8 border-b border-gray-200 pb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-bold">
                  {post.author.split(' ').map(name => name[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.authorRole}</p>
              </div>
            </div>

            {/* Contenu */}
            <div 
              className="prose max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Partage */}
            <div className="border-t border-gray-200 pt-6 mb-12">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Partager cet article</h3>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-blue-600">
                  <span className="sr-only">Partager sur Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-blue-400">
                  <span className="sr-only">Partager sur Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <span className="sr-only">Partager sur LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.45 20.45h-3.56v-5.6c0-1.33-.02-3.06-1.86-3.06-1.86 0-2.14 1.45-2.14 2.96v5.7H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.3zM5.34 7.43c-1.15 0-2.08-.94-2.08-2.08 0-1.15.93-2.08 2.08-2.08 1.15 0 2.08.93 2.08 2.08 0 1.14-.93 2.08-2.08 2.08zM7.13 20.45H3.56V9h3.57v11.45zM22.22 0H1.78C.8 0 0 .8 0 1.78v20.44c0 .98.8 1.78 1.78 1.78h20.44c.98 0 1.78-.8 1.78-1.78V1.78C24 .8 23.2 0 22.22 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Articles similaires */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {relatedPost.category === 'news' ? 'Actualités' : 
                       relatedPost.category === 'tips' ? 'Conseils' : 'Science'}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${relatedPost.id}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <Link 
                    href={`/blog/${relatedPost.id}`}
                    className="text-blue-600 hover:text-blue-500 font-medium text-sm flex items-center mt-4"
                  >
                    Lire la suite
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}