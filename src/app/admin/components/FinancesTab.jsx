// app/dashboard/admin/components/MembersTab.jsx
export default function MembersTab({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Gestion des Membres</h2>
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
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Voir tous les membres
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Exporter la liste
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
          Ajouter un membre
        </button>
      </div>
    </div>
  );
}