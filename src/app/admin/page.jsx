"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminTabs from "./components/AdminTabs";
import OverviewTab from "./components/OverviewTab";
import EventsTab from "./components/EventsTab";
import MembersTab from "./components/MembersTab";
import ContentTab from "./components/ContentTab";
import FinancesTab from "./components/FinancesTab";
import ReportsTab from "./components/ReportsTab";
import UserMenu from "./components/UserMenu";
import GalleryTab from "./components/GalleryTab"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalResources: 0,
    newMessages: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const router = useRouter();

  // Vérifier que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Vérifier l'authentification côté client seulement
  useEffect(() => {
    if (isClient) {
      const checkAuth = () => {
        const authToken = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("userRole");
        
        if (!authToken) {
          router.push("/login");
          return;
        }
        
        /* if (userRole !== "admin") {
          router.push("/dashboard");
          return;
        } */
      };

      checkAuth();
    }
  }, [isClient, router]);

  // Fonction de déconnexion
  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      router.push("/login");
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStats({
        totalMembers: 0,
        activeMembers: 0,
        pendingMembers: 0,
        totalEvents: 0,
        upcomingEvents: 0,
        totalResources: 0,
        newMessages: 0,
      });

      setRecentActivities([
        {
          id: 1,
          user: "Sophie Leroy",
          action: "Nouvelle inscription",
          time: "Il y a 10 min",
          type: "registration",
        },
        {
          id: 2,
          user: "Pierre Martin",
          action: "A téléchargé un document",
          time: "Il y a 25 min",
          type: "download",
        },
        {
          id: 3,
          user: "Thomas Bernard",
          action: "A modifié son profil",
          time: "Il y a 1 heure",
          type: "profile",
        },
        {
          id: 4,
          user: "Marie Dupont",
          action: "A posté un message",
          time: "Il y a 2 heures",
          type: "message",
        },
        {
          id: 5,
          user: "Lucie Petit",
          action: "A payé sa cotisation",
          time: "Il y a 3 heures",
          type: "payment",
        },
      ]);

      setPendingApprovals([
        {
          id: 1,
          user: "Julie Moreau",
          type: "Nouvelle inscription",
          date: "2023-09-12",
        },
        {
          id: 2,
          user: "Laboratoires Dermatech",
          type: "Adhésion entreprise",
          date: "2023-09-11",
        },
        {
          id: 3,
          user: "Marc Dubois",
          type: "Contenu à modérer",
          date: "2023-09-10",
        },
        {
          id: 4,
          user: "Institut de Beauté",
          type: "Paiement à vérifier",
          date: "2023-09-10",
        },
      ]);
    };

    loadData();
  }, []);

  const renderTabContent = () => {
    
    const commonProps = {
      stats,
      recentActivities,
      pendingApprovals,
      showEventModal,
      setShowEventModal,
      showGalleryModal,
      setShowGalleryModal,
      setStats,
      isClient, // Passer isClient aux composants enfants
    };

    switch (activeTab) {
      case "members":
        return <MembersTab {...commonProps} />;
      case "gallery":
        return <GalleryTab 
        {...commonProps}
      />
      case "content":
        return <ContentTab {...commonProps} />;
      case "events":
        return <EventsTab {...commonProps} />;
      case "finances":
        return <FinancesTab {...commonProps} />;
      case "reports":
        return <ReportsTab {...commonProps} />;
      default:
        return <OverviewTab {...commonProps} />;
    }
  };

  // Afficher un loader pendant le rendu côté serveur
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-gray-600">
            Gérez votre association et surveillez l'activité des membres
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>

      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </div>
  );
}