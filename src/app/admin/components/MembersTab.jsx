"use client";

import { useState, useEffect } from "react";
import MembersTable from "./MembersTable";
import MemberCreationModal from "./MemberCreationModal";

export default function MembersTab({ stats, setStats }) {
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Charger les membres
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch("/api/admin/users?noLimit=true", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des membres");
      }

      const result = await response.json();

      if (result.success) {
        setMembers(result.data.users || []);
        // Mettre à jour les stats
        updateStats(result.data.users);
      } else {
        throw new Error(
          result.message || "Erreur lors du chargement des membres"
        );
      }
    } catch (error) {
      setMembers(demoMembers);
      updateStats(demoMembers);
    } finally {
      setMembersLoading(false);
    }
  };

  const updateStats = (users) => {
    const totalMembers = users.length;
    const activeMembers = users.filter((user) => user.isActive).length;
    const pendingMembers = users.filter(
      (user) => user.profile?.membershipStatus === "pending"
    ).length;

    setStats((prev) => ({
      ...prev,
      totalMembers,
      activeMembers,
      pendingMembers,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestion des Membres</h2>
          <button
            onClick={() => setShowMemberModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Ajouter un membre
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Membres Totaux</h3>
            <p className="text-2xl font-bold">{stats.totalMembers}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">Membres Actifs</h3>
            <p className="text-2xl font-bold">{stats.activeMembers}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800">En Attente</h3>
            <p className="text-2xl font-bold">{stats.pendingMembers}</p>
          </div>
        </div>
      </div>

      <MembersTable
        members={members}
        loading={membersLoading}
        onRefresh={fetchMembers}
      />

      {showMemberModal && (
        <MemberCreationModal
          onClose={() => setShowMemberModal(false)}
          onMemberCreated={fetchMembers}
        />
      )}
    </div>
  );
}
