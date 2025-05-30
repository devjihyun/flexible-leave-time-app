import React, { useState, useEffect } from "react";

function App() {
  const [workedTime, setWorkedTime] = useState("00:00");
  const [targetTime, setTargetTime] = useState("00:00");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [results, setResults] = useState({});

  // 자동 퇴근 가능 시각 계산
  useEffect(() => {
    if (!workedTime || !startTime || !targetTime) return;

    const [wh, wm] = workedTime.split(":").map(Number);
    const [th, tm] = targetTime.split(":").map(Number);
    const workedMinutesSoFar = wh * 60 + wm;
    const targetTotal = th * 60 + tm;
    const remainingToday = targetTotal - workedMinutesSoFar;

    const [sh, sm] = startTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const leaveMinutes = remainingToday + 60;

    const leaveHour = Math.floor((start + leaveMinutes) / 60)
      .toString()
      .padStart(2, "0");
    const leaveMin = ((start + leaveMinutes) % 60).toString().padStart(2, "0");

    setResults((prev) => ({
      ...prev,
      leaveTime: `${leaveHour}:${leaveMin}`,
    }));
  }, [workedTime, startTime, targetTime]);

  const handleCalculate = () => {
    const [wh, wm] = workedTime.split(":").map(Number);
    const [th, tm] = targetTime.split(":").map(Number);
    const workedMinutesSoFar = wh * 60 + wm;
    const targetTotal = th * 60 + tm;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const todayWorked = end - start - 60; // 점심시간 1시간 제외

    const totalWorked = workedMinutesSoFar + todayWorked;

    const totalHours = Math.floor(totalWorked / 60);
    const totalMins = totalWorked % 60;
    const diff = totalWorked - targetTotal;

    setResults((prev) => ({
      ...prev,
      todayWorked,
      totalWorked,
      totalStr: `${totalHours}:${totalMins.toString().padStart(2, "0")}`,
      diffStr:
        diff === 0
          ? "정확히 목표 달성 🎯"
          : diff > 0
          ? `+${Math.floor(diff / 60)}시간 ${diff % 60}분 초과 근무 👏`
          : `-${Math.abs(Math.floor(diff / 60))}시간 ${Math.abs(
              diff % 60
            )}분 부족 🕒`,
    }));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">총 근무시간 계산기</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">🎯 이번 달 목표 근무시간 (HH:MM)</label>
          <input
            type="text"
            placeholder="예: 152:00"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">
            📊 전일까지 누적 근무시간 (HH:MM)
          </label>
          <input
            type="text"
            placeholder="예: 144:30"
            value={workedTime}
            onChange={(e) => setWorkedTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">⏰ 오늘 출근 시간</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">🏁 오늘 퇴근 시간</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          ✅ 총 근무시간 계산
        </button>

        {results.totalStr && (
          <div className="mt-4 text-lg space-y-1">
            <div>
              🔢 총 근무시간:{" "}
              <span className="font-bold">{results.totalStr}</span>
            </div>
            <div>
              📌 상태:{" "}
              <span className="text-red-700 font-semibold">
                {results.diffStr}
              </span>
            </div>
          </div>
        )}

        {results.leaveTime && (
          <div className="mt-2 text-md">
            🕔 퇴근 가능 시간:{" "}
            <span className="text-blue-700 font-semibold">
              {results.leaveTime}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
