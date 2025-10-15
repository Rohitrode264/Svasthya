import { type FC, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight, Heart, Users, MessageCircle, Clock } from "lucide-react";

interface Appointment {
  id: number;
  doctor: string;
  role: string;
  time: string;
  avatar: string;
}

const ProfileDashboard: FC = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Dayjs>(
    dayjs().startOf("week").add(1, "day") // Monday as first day
  );

  const today = dayjs();

  const appointments: Appointment[] = [
    {
      id: 1,
      doctor: "Dr. White",
      role: "Cardiologist",
      time: "10:30 PM",
      avatar: "https://i.pravatar.cc/50?img=10",
    },
    {
      id: 2,
      doctor: "Dr. Gray",
      role: "Cardiologist",
      time: "10:30 PM",
      avatar: "https://i.pravatar.cc/50?img=11",
    },
    {
      id: 3,
      doctor: "Dr. Brown",
      role: "Cardiologist",
      time: "10:30 PM",
      avatar: "https://i.pravatar.cc/50?img=12",
    },
  ];

  const handlePrevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
  const handleNextWeek = () => setCurrentWeekStart(currentWeekStart.add(7, "day"));

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    currentWeekStart.add(i, "day")
  );

  return (
    <div className="w-[360px] bg-[#0f1c2e] text-white rounded-[28px] overflow-hidden shadow-lg flex flex-col">
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-6 pb-4 relative">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/80?img=5"
            alt="User"
            className="w-20 h-20 rounded-full border-4 border-[#1e2b43]"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold text-white w-5 h-5 flex items-center justify-center rounded-full">
            2
          </span>
        </div>
        <button className="bg-purple-600 text-xs px-3 py-1 mt-2 rounded-full font-medium">
          Pro Member
        </button>
        <h2 className="text-lg font-semibold mt-2">Bocchi Rocksmith</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 text-center border-y border-[#1e2b43] py-3">
        <div>
          <p className="text-lg font-semibold">0</p>
          <p className="text-xs text-gray-400">Total Posts</p>
        </div>
        <div>
          <p className="text-lg font-semibold">0</p>
          <p className="text-xs text-gray-400">Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold">0</p>
          <p className="text-xs text-gray-400">Likes</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-5 mt-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-300">
            {currentWeekStart.format("MMMM YYYY")}
          </h3>
          <div className="flex gap-2">
            <button onClick={handlePrevWeek}>
              <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button onClick={handleNextWeek}>
              <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-3">
          {weekDays.map((day) => {
            const isToday = day.isSame(today, "day");
            return (
              <div
                key={day.format("DD")}
                className={`flex flex-col items-center text-xs font-medium w-8 ${
                  isToday ? "text-white" : "text-gray-400"
                }`}
              >
                <span>{day.format("ddd")}</span>
                <div
                  className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full ${
                    isToday ? "bg-lime-500 text-black" : "hover:bg-[#1e2b43]"
                  }`}
                >
                  {day.format("D")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mt-6 px-5">
        <h3 className="text-sm font-semibold mb-3 text-gray-200">
          Upcoming Appointments
        </h3>
        <div className="space-y-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-[#17263d] rounded-xl px-4 py-3 hover:bg-[#1d314f] transition"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={a.avatar}
                  alt={a.doctor}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{a.doctor}</p>
                  <p className="text-xs text-gray-400 flex items-center">
                    <Heart className="w-3 h-3 mr-1 text-lime-400" />
                    {a.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                {a.time}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-lime-400 mt-3 cursor-pointer hover:underline">
          See All
        </p>
      </div>

      {/* Go Pro Banner */}
      <div className="bg-lime-500 mt-4 mx-4 mb-5 rounded-2xl p-4 flex items-center justify-between text-[#0f1c2e]">
        <div>
          <p className="font-semibold">Go Pro, Today!</p>
          <p className="text-sm">Go Pro →</p>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/726/726488.png"
          alt="Pro"
          className="w-12 h-12 object-contain"
        />
      </div>
    </div>
  );
};

export default ProfileDashboard;
