import React from 'react';
import { Bell, CheckCircle, Clock, Info, ShieldAlert } from 'lucide-react';

const STATIC_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Course Completed!',
    message: 'Congratulations! You have successfully completed the "Advanced React Patterns" module.',
    time: '2 hours ago',
    type: 'success',
    icon: CheckCircle
  },
  {
    id: 2,
    title: 'Pending Lab Task',
    message: 'Gentle reminder: Your "Mock Interview" for Week 4 is pending. Complete it to stay on track!',
    time: '5 hours ago',
    type: 'warning',
    icon: Clock
  },
  {
    id: 3,
    title: 'Roadmap Updated',
    message: 'Your personalized roadmap has been updated with new modules based on your latest performance.',
    time: '1 day ago',
    type: 'info',
    icon: Info
  },
  {
    id: 4,
    title: 'Security Alert',
    message: 'Your profile was accessed from a new device. If this was not you, please update your password.',
    time: '2 days ago',
    type: 'alert',
    icon: ShieldAlert
  }
];

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Notifications</h1>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {STATIC_NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon;
          const typeStyles = {
            success: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800 text-green-600',
            warning: 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-800 text-yellow-600',
            info: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 text-blue-600',
            alert: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800 text-red-600'
          };

          return (
            <div 
              key={notif.id}
              className="group bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-5">
                <div className={`p-3 rounded-2xl shrink-0 ${typeStyles[notif.type]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{notif.title}</h3>
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm italic">
          "Stay updated with your learning journey."
        </p>
      </div>
    </div>
  );
}
