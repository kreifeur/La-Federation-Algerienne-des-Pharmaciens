'use client';

import { useCallback } from 'react';

const PROFESSIONAL_STATUS_OPTIONS = [
  { value: 'student', label: 'Étudiant' },
  { value: 'professional', label: 'Professionnel' },
  { value: 'researcher', label: 'Chercheur' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'retired', label: 'Retraité' }
];

const DOMAIN_OPTIONS = [
  { value: 'skincare', label: 'Soins de la peau' },
  { value: 'research', label: 'Recherche' },
  { value: 'business', label: 'Business' },
  { value: 'development', label: 'Développement' },
  { value: 'marketing', label: 'Marketing' }
];

const MEMBERSHIP_STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'suspended', label: 'Suspendu' }
];

const ROLE_OPTIONS = [
  { value: 'member', label: 'Membre' },
  { value: 'admin', label: 'Administrateur' }
];

export default function MemberEditForm({ 
  member, 
  memberForm, 
  setMemberForm, 
  memberMessage, 
  memberLoading,
  onCancel, 
  onUpdate 
}) {
  
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Pour les cases à cocher multiples (domaines d'intérêt)
      const updatedDomains = checked
        ? [...memberForm.domainOfInterest, value]
        : memberForm.domainOfInterest.filter(domain => domain !== value);
      
      setMemberForm(prev => ({
        ...prev,
        domainOfInterest: updatedDomains
      }));
    } else {
      setMemberForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [memberForm.domainOfInterest, setMemberForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(member._id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-200 mt-4">
      <h4 className="text-lg font-semibold text-blue-800 mb-4">Modifier le membre</h4>
      
      {memberMessage && (
        <div className={`p-3 rounded-md mb-4 ${
          memberMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {memberMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={memberForm.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle
            </label>
            <select
              name="role"
              value={memberForm.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={memberForm.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={memberForm.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={memberForm.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+33123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut Professionnel
            </label>
            <select
              name="professionalStatus"
              value={memberForm.professionalStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un statut</option>
              {PROFESSIONAL_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domaines d'intérêt
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DOMAIN_OPTIONS.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={memberForm.domainOfInterest.includes(option.value)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut d'adhésion
          </label>
          <select
            name="membershipStatus"
            value={memberForm.membershipStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MEMBERSHIP_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={memberLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={memberLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {memberLoading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}