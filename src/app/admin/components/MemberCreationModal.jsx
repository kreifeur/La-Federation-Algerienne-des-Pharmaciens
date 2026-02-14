'use client';

import { useState, useCallback } from 'react';

const DOMAIN_OPTIONS = [
  { value: 'skincare', label: 'Soins de la peau' },
  { value: 'research', label: 'Recherche' },
  { value: 'business', label: 'Business' },
  { value: 'development', label: 'Développement' },
  { value: 'marketing', label: 'Marketing' }
];

export default function MemberCreationModal({ onClose, onMemberCreated }) {
  const [memberForm, setMemberForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    professionalStatus: '', // Champ libre - vide par défaut
    domainOfInterest: ['skincare', 'research'],
    role: 'member'
  });
  
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberMessage, setMemberMessage] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
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
  }, [memberForm.domainOfInterest]);

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setMemberLoading(true);
    setMemberMessage('');

    try {
      // Validation des données
      if (!memberForm.email || !memberForm.password || !memberForm.firstName || !memberForm.lastName) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

      if (memberForm.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
      }

      const memberData = {
        email: memberForm.email,
        password: memberForm.password,
        firstName: memberForm.firstName,
        lastName: memberForm.lastName,
        phone: memberForm.phone,
        professionalStatus: memberForm.professionalStatus, // Champ libre
        domainOfInterest: memberForm.domainOfInterest,
        role: memberForm.role
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(memberData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création du membre');
      }

      if (result.success) {
        setMemberMessage('✅ Membre créé avec succès !');
        setMemberForm({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          professionalStatus: '', // Réinitialisé à vide
          domainOfInterest: ['skincare', 'research'],
          role: 'member'
        });
        
        onMemberCreated();
        
        setTimeout(() => {
          onClose();
          setMemberMessage('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la création du membre');
      }
    } catch (error) {
      setMemberMessage(`❌ ${error.message}`);
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Ajouter un nouveau membre</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {memberMessage && (
            <div className={`p-4 rounded-md mb-6 ${
              memberMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {memberMessage}
            </div>
          )}

          <form onSubmit={handleCreateMember} className="space-y-6">
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
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={memberForm.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Au moins 6 caractères"
                  minLength="6"
                />
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
                  Profession
                </label>
                <input
                  type="text"
                  name="professionalStatus"
                  value={memberForm.professionalStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez la profession"
                />
              </div>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaines d'intérêt *
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
 */}
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
                <option value="member">Membre</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={memberLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={memberLoading}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {memberLoading ? 'Création en cours...' : 'Créer le membre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}