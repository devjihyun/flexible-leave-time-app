import React, { useState } from "react";

function App() {
  const [workHours, setWorkHours] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(0);
  const [startTime, setStartTime] = useState("09:00");
  const [leaveTime, setLeaveTime] = useState("");

  const handleCalculate = () => {
    const requiredTotal = 152 * 60; // 152시간 = 9120분
    const workedTotal = workHours * 60 + workMinutes;
    const remainingMinutes = requiredTotal - workedTotal;

    if (remainingMinutes <= 0) {
      setLeaveTime("이미 목표 근무시간을 초과했습니다 👏");
      return;
    }

    const [startHour, startMin] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHour);
    startDate.setMinutes(startMin);

    const leaveDate = new Date(
      startDate.getTime() + (remainingMinutes + 60) * 60000
    ); // 점심시간 1시간 포함
    const leaveHour = leaveDate.getHours().toString().padStart(2, "0");
    const leaveMin = leaveDate.getMinutes().toString().padStart(2, "0");

    setLeaveTime(`${leaveHour}:${leaveMin}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">마지막 근무일 퇴근 시간 계산기</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">📊 전일까지 누적 근무시간</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="시간"
              value={workHours}
              onChange={(e) => setWorkHours(parseInt(e.target.value) || 0)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="number"
              placeholder="분"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 0)}
              className="border p-2 rounded w-1/2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">⏰ 오늘 출근 시간 (HH:MM)</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          🧮 퇴근 시간 계산
        </button>

        {leaveTime && (
          <div className="mt-4 text-lg font-semibold">
            ✅ 퇴근 가능 시간:{" "}
            <span className="text-green-600">{leaveTime}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
