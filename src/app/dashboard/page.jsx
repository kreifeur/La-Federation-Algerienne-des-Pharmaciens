// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    events: 0,
    resources: 0,
    messages: 0,
    connections: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Données simulées (à remplacer par des appels API)
  const mockUser = {
    name: "Marie Dupont",
    role: "member",
    membershipType: "individual",
    membershipStatus: "active",
    joinDate: "2023-01-15"
  };

  const mockStats = {
    events: 3,
    resources: 12,
    messages: 5,
    connections: 24
  };

  const mockEvents = [
    {
      id: 1,
      title: "Congrès Annuel de Cosmétologie",
      date: "2023-09-15",
      type: "congress",
      status: "registered"
    },
    {
      id: 2,
      title: "Atelier Formulation Naturelle",
      date: "2023-10-05",
      type: "workshop",
      status: "pending"
    },
    {
      id: 3,
      title: "Webinaire Réglementation",
      date: "2023-10-12",
      type: "webinar",
      status: "completed"
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: "event",
      message: "Votre inscription au congrès est confirmée",
      date: "2023-08-20",
      read: false
    },
    {
      id: 2,
      type: "message",
      message: "Nouveau message de Pierre Martin",
      date: "2023-08-19",
      read: true
    },
    {
      id: 3,
      type: "resource",
      message: "Nouveau document disponible : Guide des bonnes pratiques",
      date: "2023-08-18",
      read: true
    }
  ];

  useEffect(() => {
    // Simulation de chargement des données
    const loadData = async () => {
      setIsLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      setStats(mockStats);
      setRecentEvents(mockEvents);
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleNotificationClick = (notificationId) => {
    // Marquer comme lu et rediriger
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    
    // Redirection selon le type de notification
    router.push('/dashboard/notifications');
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'registered': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventStatusText = (status) => {
    switch (status) {
      case 'registered': return 'Inscrit';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Tableau de Bord - La Fédération Algérienne des Pharmaciens</title>
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.events}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ressources</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.resources}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.messages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connexions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.connections}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prochains événements */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mes Événements</h2>
            </div>
            <div className="p-6">
              {recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}>
                        {getEventStatusText(event.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">Aucun événement à venir</p>
              )}
              <div className="mt-6">
                <Link href="/events" className="text-blue-600 hover:text-blue-500 font-medium">
                  Voir tous les événements →
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            </div>
            <div className="p-6">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        notification.read ? 'border-gray-200' : 'border-blue-200 bg-blue-50'
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="ml-2 flex-shrink-0">
                            <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">Aucune notification</p>
              )}
              <div className="mt-6">
                <Link href="/dashboard/notifications" className="text-blue-600 hover:text-blue-500 font-medium">
                  Voir toutes les notifications →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Accès rapide */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Accès Rapide</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/profile" className="p-4 border border-gray-200 rounded-lg text-center hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg inline-block mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Mon Profil</p>
              </Link>

              <Link href="/dashboard/resources" className="p-4 border border-gray-200 rounded-lg text-center hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg inline-block mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Ressources</p>
              </Link>

              <Link href="/dashboard/directory" className="p-4 border border-gray-200 rounded-lg text-center hover:border-orange-300 hover:bg-orange-50 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg inline-block mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Annuaire</p>
              </Link>

              <Link href="/dashboard/messages" className="p-4 border border-gray-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg inline-block mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Messages</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}