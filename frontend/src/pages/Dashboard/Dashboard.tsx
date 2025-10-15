"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Pill,
  Activity,
  AlertTriangle,
  Clock,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import { MainWrapper } from "../../component/Wrapper/MainWrapper";
import BannerImage from "../../assets/Banner.png";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getRandomQuote } from "../../helper/getRandomQuote";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

const Dashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { loading, message, dashboardData, fetchDashboardData } = useDashboard();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week").add(1, "day") // Monday as first day
  );
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    if (userId) {
      fetchDashboardData(userId);
    }
    setQuote(getRandomQuote());
  }, [userId, fetchDashboardData]);

  const handlePrevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  const handleNextWeek = () => setCurrentWeekStart(currentWeekStart.add(7, "day"));

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    currentWeekStart.add(i, "day")
  );

  const today = dayjs();

  if (loading && !dashboardData) {
    return (
      <MainWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
                  <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
                  <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
                  <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-14 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-56 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-56 bg-gray-200 rounded-2xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </MainWrapper>
    );
  }

  if (!dashboardData) {
    return (
      <MainWrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dashboard Not Found</h2>
            <p className="text-gray-600">Unable to load your dashboard information.</p>
          </div>
        </div>
      </MainWrapper>
    );
  }

  const { user, profile, stats, upcomingReminders, recentActivity } = dashboardData;

  return (
    <MainWrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header with Banner */}
        <div className="relative">
          <img
            src={BannerImage}
            alt="Dashboard Banner"
            className="w-full h-64 object-cover rounded-4xl"
          />
          <div className="absolute inset-0 bg-black/35 rounded-4xl"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-bold mb-2">
              Hello, {profile.displayName}! 👋
            </h1>
            <p className="text-lg opacity-90">
              {quote}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Dashboard Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Today's Medication Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Medication Schedule</h2>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">{dayjs().format("MMM D, YYYY")}</span>
                  </div>
                </div>

                {upcomingReminders.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReminders
                      .filter(reminder => dayjs(reminder.scheduledAt).isSame(dayjs(), 'day'))
                      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                      .map((reminder, index) => (
                        <div key={reminder.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            {index < upcomingReminders.filter(r => dayjs(r.scheduledAt).isSame(dayjs(), 'day')).length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">{reminder.medication.name}</h3>
                              <span className="text-lg font-bold text-teal-600">
                                {dayjs(reminder.scheduledAt).format("h:mm A")}
                              </span>
                            </div>
                            {reminder.medication.brand && (
                              <p className="text-sm text-gray-600">{reminder.medication.brand}</p>
                            )}
                            {reminder.medication.strength && (
                              <p className="text-xs text-gray-500">{reminder.medication.strength}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications scheduled today</h3>
                    <p className="text-gray-600">Add medications to see your daily schedule here</p>
                  </div>
                )}
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalMedications}</p>
                      <p className="text-sm text-gray-600">Medications</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.recentDoses}</p>
                      <p className="text-sm text-gray-600">Recent Doses</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.missedDoses}</p>
                      <p className="text-sm text-gray-600">Missed Doses</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Reminders */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Next Medication Reminders</h2>
                <div className="space-y-4">
                  {upcomingReminders.slice(0, 3).map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                          <Pill className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reminder.medication.name}</p>
                          {reminder.medication.brand && (
                            <p className="text-sm text-gray-600">{reminder.medication.brand}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {dayjs(reminder.scheduledAt).format("h:mm A")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dayjs(reminder.scheduledAt).format("MMM D")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {upcomingReminders.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">No upcoming reminders</p>
                      <p className="text-sm text-gray-500">Add medications to see your reminders here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === "dose_taken" ? "bg-green-100" :
                        activity.type === "dose_missed" ? "bg-red-100" :
                          activity.type === "medication_added" ? "bg-blue-100" :
                            "bg-gray-100"
                        }`}>
                        {activity.type === "dose_taken" ? (
                          <Pill className="w-4 h-4 text-green-600" />
                        ) : activity.type === "dose_missed" ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : activity.type === "medication_added" ? (
                          <Activity className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MessageCircle className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {dayjs(activity.timestamp).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">No recent activity</p>
                      <p className="text-sm text-gray-500">Start taking medications to see activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="w-full bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                {/* Profile Header */}
                <div className="flex flex-col items-center pt-6 pb-4 border-b border-gray-100">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {profile.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {upcomingReminders.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-xs font-bold text-white w-5 h-5 flex items-center justify-center rounded-full">
                        {upcomingReminders.length}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold mt-3 text-gray-900">{profile.displayName}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Health Stats */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Health Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{stats.totalMedications}</p>
                      <p className="text-xs text-gray-600">Medications</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{stats.adherenceRate}%</p>
                      <p className="text-xs text-gray-600">Adherence</p>
                    </div>
                  </div>
                </div>

                {/* Calendar */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {currentWeekStart.format("MMMM YYYY")}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={handlePrevWeek}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNextWeek}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => {
                      const isToday = day.isSame(today, "day");
                      return (
                        <div key={day.format("DD")} className="text-center">
                          <div className="text-xs text-gray-500 mb-1">
                            {day.format("ddd")}
                          </div>
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${isToday
                              ? "bg-teal-500 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                              }`}
                          >
                            {day.format("D")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming Reminders */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Upcoming Reminders
                  </h3>
                  <div className="space-y-3">
                    {upcomingReminders.slice(0, 3).map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {reminder.medication.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {dayjs(reminder.scheduledAt).format("h:mm A")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {upcomingReminders.length === 0 && (
                      <div className="text-center py-6">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No upcoming reminders</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 px-4 py-2 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default Dashboard;