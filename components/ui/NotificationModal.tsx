"use client";

import React from "react";
import { X, Plus, FileText, Bell } from "lucide-react";
import Image from "next/image";

interface Notification {
  id: string;
  type:
    | "access_request"
    | "comment"
    | "reply"
    | "file_attachment"
    | "account_created";
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  time: string;
  actionType?: "approve_decline" | "add_to_favorites" | "none";
  fileName?: string;
  fileSize?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "access_request",
    user: {
      name: "Lex Murphy",
      avatar: "/assets/profile.jpg",
    },
    message: "requested access to UNIX directory tree hierarchy",
    time: "Today at 5:42 AM",
    actionType: "approve_decline",
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Ray Arnold",
      avatar: "/assets/profile.jpg",
    },
    message: "left 6 comments on Isla Nublar SOC2 compliance report",
    time: "Last Wednesday at 8:42 AM",
    actionType: "none",
  },
  {
    id: "3",
    type: "reply",
    user: {
      name: "Denise Nedry",
      avatar: "/assets/profile.jpg",
    },
    message: "replied to Anna Srzand",
    time: "Last Wednesday at 8:42 AM",
    actionType: "none",
  },
  {
    id: "4",
    type: "file_attachment",
    user: {
      name: "John Hammond",
      avatar: "/assets/profile.jpg",
    },
    message: "attached a file to Isla Nublar SOC2 compliance report",
    time: "Last Wednesday at 8:42 AM",
    fileName: "EY_review.pdf",
    fileSize: "2mb",
    actionType: "none",
  },
  {
    id: "5",
    type: "comment",
    user: {
      name: "Denise Nedry",
      avatar: "/assets/profile.jpg",
    },
    message: "commented on Isla Nublar SOC2 compliance report",
    time: "Last Wednesday at 8:42 AM",
    actionType: "add_to_favorites",
  },
  {
    id: "6",
    type: "account_created",
    user: {
      name: "New Account",
      avatar: "/assets/profile.jpg",
    },
    message: "created",
    time: "Last Wednesday at 8:42 AM",
    actionType: "none",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "access_request":
      return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
    case "file_attachment":
      return <FileText size={12} className="text-slate-500" />;
    case "account_created":
      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    default:
      return <div className="w-2 h-2 bg-slate-400 rounded-full"></div>;
  }
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleApprove = (notificationId: string) => {
    console.log("Approved notification:", notificationId);
  };

  const handleDecline = (notificationId: string) => {
    console.log("Declined notification:", notificationId);
  };

  const handleAddToFavorites = (notificationId: string) => {
    console.log("Added to favorites:", notificationId);
  };

  const markAllAsRead = () => {
    console.log("Marked all as read");
  };

  return (
    <>
      <style>
        {`
          .notification-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .notification-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .notification-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 2px;
          }
          .notification-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }
          .notification-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #e2e8f0 transparent;
          }
        `}
      </style>

      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-start pt-10 px-4">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200/50 relative max-h-[85vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-slate-600" />
                <h2 className="text-slate-900 text-base font-semibold">
                  Notifications
                </h2>
              </div>
              <div className="px-2 py-0.5 bg-slate-100 rounded-full">
                <span className="text-slate-600 text-xs font-medium">
                  {mockNotifications.length}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllAsRead}
                className="text-slate-500 hover:text-slate-700 text-xs font-medium px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto notification-scrollbar">
            {mockNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`px-5 py-4 hover:bg-slate-25 transition-colors cursor-pointer group ${
                  index !== mockNotifications.length - 1
                    ? "border-b border-slate-50"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar with notification indicator */}
                  <div className="relative flex-shrink-0">
                    <Image
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    
                    <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="text-sm leading-relaxed">
                      <span className="font-medium text-slate-900">
                        {notification.user.name}
                      </span>
                      <span className="text-slate-600 ml-1">
                        {notification.message}
                      </span>
                    </div>

                    {/* File attachment display */}
                    {notification.fileName && (
                      <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-7 h-7 bg-red-500 rounded-md flex items-center justify-center flex-shrink-0">
                          <FileText size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {notification.fileName}
                          </div>
                          <div className="text-xs text-slate-500 uppercase font-medium">
                            {notification.fileSize}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {notification.actionType === "approve_decline" && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleApprove(notification.id)}
                          className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(notification.id)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {notification.actionType === "add_to_favorites" && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleAddToFavorites(notification.id)}
                          className="flex items-center gap-1.5 text-slate-600 text-xs font-medium hover:text-slate-800 transition-colors"
                        >
                          <Plus size={12} />
                          Add to favorites
                        </button>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-xs text-slate-400 font-medium">
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="text-center">
              <button className="text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
