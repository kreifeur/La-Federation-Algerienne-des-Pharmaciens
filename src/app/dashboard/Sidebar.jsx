// components/Sidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ user }) {
  const pathname = usePathname();

  const memberMenu = [
    { name: 'Tableau de bord', href: '/dashboard', icon: '📊' },
    { name: 'Mon profil', href: '/dashboard/profile', icon: '👤' },
    { name: 'Événements', href: '/dashboard/events', icon: '🎪' },
    { name: 'Ressources', href: '/dashboard/resources', icon: '📚' },
    { name: 'Annuaire', href: '/dashboard/directory', icon: '📇' },
    { name: 'Messages', href: '/dashboard/messages', icon: '✉️' },
    { name: 'Notifications', href: '/dashboard/notifications', icon: '🔔' },
  ];

  const adminMenu = [
    { name: 'Utilisateurs', href: '/dashboard/admin/users', icon: '👥' },
    { name: 'Contenus', href: '/dashboard/admin/content', icon: '📝' },
    { name: 'Statistiques', href: '/dashboard/admin/stats', icon: '📈' },
    { name: 'Paiements', href: '/dashboard/admin/payments', icon: '💳' },
  ];

  const isActiveLink = (href) => {
    return pathname === href;
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">Espace Membre</h1>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {memberMenu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActiveLink(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <>
                <div className="px-2 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </div>
                {adminMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActiveLink(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}