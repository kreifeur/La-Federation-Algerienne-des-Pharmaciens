// app/dashboard/directory/page.jsx
'use client';

import { useState, useEffect } from 'react';

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);

  // Sample data with the requested names
  const sampleMembers = [
    {
      id: 1,
      name: "Ibrahim Kreifeur",
      company: "Laboratoires Beauté Naturelle",
      position: "Responsable R&D",
      location: "Paris, France",
      specialty: "Cosmétiques naturels",
      email: "ibrahim.kreifeur@example.com",
      status: "active"
    },
    {
      id: 2,
      name: "Yacine Test",
      company: "Institut de Dermatologie",
      position: "Dermatologue",
      location: "Lyon, France",
      specialty: "Dermatologie clinique",
      email: "yacine.test@example.com",
      status: "active"
    },
    {
      id: 3,
      name: "Member Try",
      company: "AromaSynth",
      position: "Chimiste des arômes",
      location: "Toulouse, France",
      specialty: "Parfumerie",
      email: "member.try@example.com",
      status: "active"
    },
    {
      id: 4,
      name: "Only Me",
      company: "BioFormulations",
      position: "Directeur technique",
      location: "Nantes, France",
      specialty: "Formulation",
      email: "only.me@example.com",
      status: "pending"
    },
    {
      id: 5,
      name: "Iam Here",
      company: "PharmaTech Solutions",
      position: "Consultant Senior",
      location: "Marseille, France",
      specialty: "Réglementation pharmaceutique",
      email: "iam.here@example.com",
      status: "active"
    }
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        setError('');
        setIsUsingSampleData(false);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication required. Please login.');
        }

        const response = await fetch('/api/members', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(`Error ${response.status}: Failed to fetch members`);
        }

        const result = await response.json();

        if (result.success) {
          if (result.data.members && result.data.members.length > 0) {
            // Use real data from API
            const formattedMembers = result.data.members.map(member => ({
              ...member,
              id: member._id || member.id
            }));
            setMembers(formattedMembers);
          } else {
            // API returned empty array, use sample data
            setMembers(sampleMembers);
            setIsUsingSampleData(true);
          }
        } else {
          throw new Error(result.message || 'Failed to fetch members');
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err.message);
        
        // Fallback to sample data
        setMembers(sampleMembers);
        setIsUsingSampleData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.company && member.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.specialty && member.specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || member.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Annuaire des Membres</h1>


      {/* Error Message */}
      {error && !isUsingSampleData && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher un membre, entreprise ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* <div className="flex space-x-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Actifs
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                En attente
              </button>
            </div> */}
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des membres...</span>
            </div>
          ) : filteredMembers.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucun membre trouvé</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMembers.map(member => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.position} • {member.company}</p>
                      <p className="text-sm text-gray-600 mt-1">{member.specialty}</p>
                      <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {member.location}
                      </p>
                    </div>
{/*                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status === 'active' ? 'Actif' : 'En attente'}
                    </span> */}
                  </div>
                  
                 {/*  <div className="mt-4 flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200">
                      Envoyer un message
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200">
                      Voir le profil
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}