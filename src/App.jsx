import React, { useState, useEffect } from "react";
import {
  Target,
  Calculator,
  LogIn,
  LogOut,
  Clock,
  Timer,
  Activity,
  Frown,
  SmilePlus,
  ClockAlert,
} from "lucide-react";

function App() {
  const [workedTime, setWorkedTime] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [results, setResults] = useState({});

  const parseTime = (timeStr) => {
    const parts = timeStr.split(":").map(Number);
    return {
      hours: parts[0],
      minutes: parts.length > 1 ? parts[1] : 0,
    };
  };

  useEffect(() => {
    if (!workedTime || !startTime || !targetTime) return;

    const { hours: wh, minutes: wm } = parseTime(workedTime);
    const { hours: th, minutes: tm } = parseTime(targetTime);
    const workedMinutesSoFar = wh * 60 + wm;
    const targetTotal = th * 60 + tm;

    if (workedMinutesSoFar >= targetTotal) {
      setResults((prev) => ({
        ...prev,
        leaveTime: "Dobby is free!",
      }));
      return;
    }

    const remainingToday = targetTotal - workedMinutesSoFar;
    const [sh, sm] = startTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const leaveMinutes = remainingToday + 60;

    const totalLeaveMinutes = start + leaveMinutes;
    const maxLeaveMinutes = 22 * 60;

    if (totalLeaveMinutes > maxLeaveMinutes) {
      setResults((prev) => ({
        ...prev,
        leaveTime: "아직 멀었어요..",
      }));
      return;
    }

    const leaveHour = Math.floor(totalLeaveMinutes / 60);
    const leaveMin = totalLeaveMinutes % 60;

    setResults((prev) => ({
      ...prev,
      leaveTime: `${leaveHour.toString().padStart(2, "0")}:${leaveMin
        .toString()
        .padStart(2, "0")}`,
    }));
  }, [workedTime, startTime, targetTime]);

  const handleCalculate = () => {
    const { hours: wh, minutes: wm } = parseTime(workedTime);
    const { hours: th, minutes: tm } = parseTime(targetTime);
    const workedMinutesSoFar = wh * 60 + wm;
    const targetTotal = th * 60 + tm;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const todayWorked = end - start - 60;

    const totalWorked = workedMinutesSoFar + todayWorked;
    const totalHours = Math.floor(totalWorked / 60);
    const totalMins = totalWorked % 60;
    const diff = totalWorked - targetTotal;
    const absDiff = Math.abs(diff);

    setResults((prev) => ({
      ...prev,
      todayWorked,
      totalWorked,
      totalStr: `${totalHours}:${totalMins.toString().padStart(2, "0")}`,
      diffStr:
        diff === 0
          ? "정확히 목표 달성"
          : diff > 0
          ? `+${Math.floor(diff / 60)}시간 ${diff % 60}분 초과 근무 `
          : `-${Math.floor(absDiff / 60)}시간 ${absDiff % 60}분 부족`,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-300 to-blue-300">
      <div className="w-full max-w-xl mx-auto p-6 bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl ring-2 ring-white/20">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 drop-shadow-sm">
          Can I go home?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Target className="w-4 h-4 text-gray-600" />,
              label: "이번달 기준시간",
              value: targetTime,
              setValue: setTargetTime,
              placeholder: "160 or 160:00",
              type: "text",
            },
            {
              icon: <Calculator className="w-4 h-4 text-gray-600" />,
              label: "어제까지 누적시간",
              value: workedTime,
              setValue: setWorkedTime,
              placeholder: "152 or 152:30",
              type: "text",
            },
            {
              icon: <LogIn className="w-4 h-4 text-gray-600" />,
              label: "오늘 출근",
              value: startTime,
              setValue: setStartTime,
              type: "time",
            },
            {
              icon: <LogOut className="w-4 h-4 text-gray-600" />,
              label: "오늘 퇴근",
              value: endTime,
              setValue: setEndTime,
              type: "time",
            },
          ].map(({ icon, label, value, setValue, placeholder, type }, i) => (
            <div key={i}>
              <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
                {icon} {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="border border-gray-300 bg-white/70 text-gray-800 text-base placeholder-gray-400 p-3 rounded-lg w-full backdrop-blur focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              />
            </div>
          ))}
        </div>

        <div className="text-sm text-center mt-6 text-violet-600 animate-fade-in flex justify-center items-center gap-1">
          <Clock className="w-4 h-4 text-violet-600" />
          퇴근 가능 시간:{" "}
          <span className="font-bold text-gray-800 drop-shadow-md">
            {results.leaveTime || "--:--"}
          </span>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-pink-400 to-orange-300 text-white py-3 px-5 rounded-full shadow-md hover:opacity-90 transition-all duration-300"
          >
            총 근무시간 계산
          </button>
        </div>

        <div className="mt-6 bg-white/50 p-4 rounded-xl border border-white/30 text-gray-800 animate-fade-in">
          <div className="text-sm mb-1 flex items-center gap-1">
            <Timer className="w-4 h-4 text-gray-600" />총 근무:{" "}
            <span className="font-semibold">{results.totalStr || "--:--"}</span>
          </div>
          <div className="text-sm flex items-center gap-1">
            <Activity className="w-4 h-4 text-gray-600" />
            결과:{" "}
            <span className="font-semibold flex items-center gap-1">
              {results.diffStr || "계산을 완료해주세요"}
              {results.diffStr?.includes("초과") && (
                <Frown className="w-4 h-4 text-red-500" />
              )}
              {results.diffStr?.includes("정확히") && (
                <SmilePlus className="w-4 h-4 text-green-600" />
              )}
              {results.diffStr?.includes("부족") && (
                <ClockAlert className="w-4 h-4 text-red-600" />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
