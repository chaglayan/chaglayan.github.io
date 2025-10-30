import React from 'react';
import { useApp } from '../context/AppContext';
import { Notification } from '../types';

const NotificationItem: React.FC<{ notification: Notification; onRemove: () => void }> = ({
  notification,
  onRemove,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  return (
    <div
      className={`border-l-4 p-4 mb-3 rounded shadow-lg flex items-start justify-between ${getColorClasses()} animate-slide-in`}
    >
      <div className="flex items-start">
        <span className="text-xl mr-3">{getIcon()}</span>
        <div>
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm mt-1">{notification.message}</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-gray-700 ml-4"
      >
        ✕
      </button>
    </div>
  );
};

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};
