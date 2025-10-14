'use client';

import { useState } from 'react';
import MemberEditForm from './MemberEditForm';

export default function MembersTable({ members, loading, onRefresh }) {
  const [editingMember, setEditingMember] = useState(null);
  const [memberMessage, setMemberMessage] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberForm, setMemberForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    professionalStatus: '',
    domainOfInterest: [],
    role: 'member',
    membershipStatus: 'pending'
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inactif' },
      suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspendu' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      member: { color: 'bg-blue-100 text-blue-800', label: 'Membre' }
    };
    
    const config = roleConfig[role] || roleConfig.member;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleEditMember = (member) => {
    setEditingMember(member._id);
    setMemberForm({
      email: member.email || '',
      firstName: member.profile?.firstName || '',
      lastName: member.profile?.lastName || '',
      phone: member.profile?.phone || '',
      professionalStatus: member.profile?.professionalStatus || '',
      domainOfInterest: member.profile?.domainOfInterest || [],
      role: member.role || 'member',
      membershipStatus: member.profile?.membershipStatus || 'pending'
    });
    setMemberMessage('');
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setMemberForm({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      professionalStatus: '',
      domainOfInterest: [],
      role: 'member',
      membershipStatus: 'pending'
    });
    setMemberMessage('');
  };

  const handleUpdateMember = async (memberId) => {
    setMemberLoading(true);
    setMemberMessage('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      // Validation des données
      if (!memberForm.email || !memberForm.firstName || !memberForm.lastName) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

      const memberData = {
        email: memberForm.email,
        profile: {
          firstName: memberForm.firstName,
          lastName: memberForm.lastName,
          phone: memberForm.phone,
          professionalStatus: memberForm.professionalStatus,
          domainOfInterest: memberForm.domainOfInterest,
          membershipStatus: memberForm.membershipStatus
        },
        role: memberForm.role
      };

      const response = await fetch(`/api/admin/users/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(memberData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour du membre');
      }

      if (result.success) {
        setMemberMessage('✅ Membre mis à jour avec succès !');
        onRefresh();
        setTimeout(() => {
          setEditingMember(null);
          setMemberMessage('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour du membre');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMemberMessage(`❌ ${error.message}`);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/admin/users/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression du membre');
      }

      if (result.success) {
        setMemberMessage('✅ Membre supprimé avec succès !');
        onRefresh();
        setTimeout(() => setMemberMessage(''), 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression du membre');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMemberMessage(`❌ ${error.message}`);
    }
  };

  const handleToggleStatus = async (memberId, currentStatus) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const newStatus = !currentStatus;
      const response = await fetch(`/api/admin/users/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }

      if (result.success) {
        setMemberMessage(`✅ Statut ${newStatus ? 'activé' : 'désactivé'} avec succès !`);
        onRefresh();
        setTimeout(() => setMemberMessage(''), 2000);
      } else {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMemberMessage(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Tous les Membres</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des membres...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Tous les Membres</h2>
      </div>
      
      <div className="p-6">
        {memberMessage && !editingMember && (
          <div className={`p-4 rounded-md mb-4 ${
            memberMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {memberMessage}
          </div>
        )}

        {members.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun membre trouvé.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut Professionnel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle & Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    {editingMember === member._id ? (
                      <td colSpan="6">
                        <MemberEditForm 
                          member={member}
                          memberForm={memberForm}
                          setMemberForm={setMemberForm}
                          memberMessage={memberMessage}
                          memberLoading={memberLoading}
                          onCancel={handleCancelEdit}
                          onUpdate={handleUpdateMember}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {member.profile?.firstName} {member.profile?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.email}
                            </div>
                            {member.profile?.domainOfInterest && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {member.profile.domainOfInterest.map((domain, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.profile?.phone || 'Non renseigné'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {member.profile?.professionalStatus || 'Non renseigné'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1 flex gap-1 items-center ">
                            {getRoleBadge(member.role)}
                            {getStatusBadge(member.profile?.membershipStatus)}
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              member.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.isActive ? 'Compte actif' : 'Compte inactif'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(member.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* <button
                              onClick={() => handleEditMember(member)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </button> */}
                            <button
                              onClick={() => handleToggleStatus(member._id, member.isActive)}
                              className={`${
                                member.isActive 
                                  ? 'text-orange-600 hover:text-orange-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {member.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                           {/*  <button
                              onClick={() => handleDeleteMember(member._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button> */}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}