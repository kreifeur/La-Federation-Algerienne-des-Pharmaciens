"use client";
import Link from "next/link";
import StatCard from "./StatCard";
import ArticleCreationModal from "./ArticleCreationModal";
import MemberCreationModal from "./MemberCreationModal";
import EventCreationModal from "./EventCreationModal";
import GalleryItemModal from "./GalleryItemModal";
import { useState, useEffect } from "react";

export default function OverviewTab({
  stats,
  recentActivities,
  pendingApprovals,
}) {
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const handleItemCreated = () => {
    // Rechargez la galerie ou effectuez une action après création
    console.log("Média ajouté à la galerie avec succès");
  };
  const [showEventModal, setShowEventModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const handleArticleCreated = () => {
    // Rechargez les articles ou effectuez une action après création
    console.log("Article créé avec succès");
  };
  const [showMemberModal, setShowMemberModal] = useState(false);

  const handleMemberCreated = () => {
    // Rechargez la liste des membres ou effectuez une action après création
    console.log("Membre créé avec succès");
  };

  const handleEventCreated = () => {
    // Rechargez la liste des événements ou effectuez une action après création
    console.log("Événement créé avec succès");
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total des membres"
          value={stats.totalMembers}
          change="+12%"
          icon="👥"
          color="bg-indigo-100"
        />
        <StatCard
          title="Membres actifs"
          value={stats.activeMembers}
          icon="✅"
          color="bg-green-100"
        />
        <StatCard
          title="En attente"
          value={stats.pendingMembers}
          icon="⏳"
          color="bg-yellow-100"
        />
        <StatCard
          title="Nouveaux messages"
          value={stats.newMessages}
          icon="✉️"
          color="bg-blue-100"
        />
      </div>

      {/* approbation and activities */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Activité Récente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="mt-6">
              <Link href="/dashboard/admin/activity" className="text-blue-600 hover:text-blue-500 font-medium">
                Voir toute l'activité →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Approbations en Attente</h2>
          </div>
          <div className="p-6">
            {pendingApprovals.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovals.map(approval => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{approval.user}</p>
                      <p className="text-sm text-gray-600">{approval.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(approval.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                      Vérifier
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">Aucune approbation en attente</p>
            )}
            <div className="mt-6">
              <Link href="/dashboard/admin/approvals" className="text-blue-600 hover:text-blue-500 font-medium">
                Gérer les approbations →
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Actions Rapides</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setShowMemberModal(true)}
              className="p-4 border border-gray-200 rounded-lg text-center hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="p-2 bg-blue-100 rounded-lg inline-block mb-2">
                <span className="text-xl">👥</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                Ajouter un membre
              </p>
            </div>

            {showMemberModal && (
              <MemberCreationModal
                onClose={() => setShowMemberModal(false)}
                onMemberCreated={handleMemberCreated}
              />
            )}

            <button
              onClick={() => setShowEventModal(true)}
              className="p-4 border border-gray-200 rounded-lg text-center hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer w-full"
            >
              <div className="p-2 bg-green-100 rounded-lg inline-block mb-2">
                <span className="text-xl">🎪</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                Créer un événement
              </p>
            </button>

            {showEventModal && (
              <EventCreationModal
                onClose={() => setShowEventModal(false)}
                onEventCreated={handleEventCreated}
              />
            )}

            <div
              onClick={() => setShowGalleryModal(true)}
              className="p-4 border border-gray-200 rounded-lg text-center hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <div className="p-2 bg-purple-100 rounded-lg inline-block mb-2">
                <span className="text-xl">📷</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                Ajouter un nouveau média
              </p>
            </div>

            {showGalleryModal && (
              <GalleryItemModal
                onClose={() => setShowGalleryModal(false)}
                onItemCreated={handleItemCreated}
              />
            )}

            <button
              onClick={() => setShowArticleModal(true)}
              className="p-4 border border-gray-200 rounded-lg text-center hover:border-orange-300 hover:bg-orange-50 transition-colors w-full"
            >
              <div className="p-2 bg-orange-100 rounded-lg inline-block mb-2">
                <span className="text-xl">📝</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                Créer un article
              </p>
            </button>

            {showArticleModal && (
              <ArticleCreationModal
                onClose={() => setShowArticleModal(false)}
                onArticleCreated={handleArticleCreated}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
