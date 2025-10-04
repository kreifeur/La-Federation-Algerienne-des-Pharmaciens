export default function ActivityItem({ activity }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration': return '📝';
      case 'download': return '📥';
      case 'profile': return '👤';
      case 'message': return '💬';
      case 'payment': return '💳';
      default: return '🔔';
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <span className="text-xl">{getActivityIcon(activity.type)}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
        <p className="text-sm text-gray-600">{activity.action}</p>
      </div>
      <span className="text-xs text-gray-500">{activity.time}</span>
    </div>
  );
}