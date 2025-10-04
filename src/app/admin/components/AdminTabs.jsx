export default function AdminTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', name: 'Aperçu' },
    { id: 'members', name: 'Membres' },
    { id: 'content', name: 'blogs' },
    { id: 'events', name: 'Événements' },
    { id: 'finances', name: 'Finances' },
    { id: 'reports', name: 'Rapports' }
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg mb-6">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}