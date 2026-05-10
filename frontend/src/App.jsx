import { useState, useEffect } from "react";

import Login from "./Login";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { CSVLink } from "react-csv";

import {
  FaShieldAlt,
  FaBug,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";

function App() {

  const token = localStorage.getItem("token");

  if (!token) {

    return <Login />;

  }

  const [logs, setLogs] = useState("");

  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(false);

  const [timeNow, setTimeNow] = useState("");

  // LIVE CLOCK
  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date();

      setTimeNow(
        now.toLocaleTimeString()
      );

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // GENERATE TIMELINE
  const generateTimeline = async () => {

    setLoading(true);

    const response = await fetch(
      "http://127.0.0.1:5000/generate-timeline",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          logs,
        }),
      }
    );

    const data = await response.json();

    setTimeline(data);

    setLoading(false);

  };

  // COUNTS
  const highCount = timeline.filter(
    (item) => item.severity === "High"
  ).length;

  const mediumCount = timeline.filter(
    (item) => item.severity === "Medium"
  ).length;

  const lowCount = timeline.filter(
    (item) => item.severity === "Low"
  ).length;

  // THREAT SCORE
  const threatScore =
    highCount * 30 +
    mediumCount * 15 +
    lowCount * 5;

  // CHART DATA
  const chartData = [
    {
      name: "High",
      value: highCount,
    },
    {
      name: "Medium",
      value: mediumCount,
    },
    {
      name: "Low",
      value: lowCount,
    },
  ];

  const COLORS = [
    "#ef4444",
    "#eab308",
    "#22c55e",
  ];

  // CSV
  const csvData = timeline.map((item) => ({
    Time: item.time,
    Event: item.event,
    Severity: item.severity,
  }));

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-700 text-white">

      {/* NAVBAR */}

      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 p-5 flex flex-col md:flex-row justify-between items-center">

        <div>

          <h1 className="text-4xl font-extrabold">
            🚨 Incident Timeline Visualizer
          </h1>

          <p className="text-pink-200">
            AI Security Monitoring Dashboard
          </p>

        </div>

        <div className="mt-4 md:mt-0 text-center">

          <p className="text-lg">
            ⏰ {timeNow}
          </p>

          <button
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              window.location.reload();

            }}
            className="mt-2 bg-red-500 px-5 py-2 rounded-xl font-bold"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* SECURITY STATUS */}

        <div className="bg-green-500/20 border border-green-400 rounded-3xl p-6 mb-8 flex items-center gap-4">

          <FaShieldAlt className="text-5xl text-green-400" />

          <div>

            <h2 className="text-2xl font-bold">
              Security Status: Protected
            </h2>

            <p>
              AI Monitoring Active • Rate Limiting Enabled • Threat Detection Online
            </p>

          </div>

        </div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-red-500/30 rounded-3xl p-8 text-center">

            <FaExclamationTriangle className="text-5xl mx-auto mb-4" />

            <h2 className="text-5xl font-bold">
              {highCount}
            </h2>

            <p className="mt-2">
              High Threats
            </p>

          </div>

          <div className="bg-yellow-500/30 rounded-3xl p-8 text-center">

            <FaBug className="text-5xl mx-auto mb-4" />

            <h2 className="text-5xl font-bold">
              {mediumCount}
            </h2>

            <p className="mt-2">
              Medium Threats
            </p>

          </div>

          <div className="bg-green-500/30 rounded-3xl p-8 text-center">

            <FaLock className="text-5xl mx-auto mb-4" />

            <h2 className="text-5xl font-bold">
              {lowCount}
            </h2>

            <p className="mt-2">
              Low Threats
            </p>

          </div>

          <div className="bg-cyan-500/30 rounded-3xl p-8 text-center">

            <h2 className="text-5xl font-bold">
              {threatScore}
            </h2>

            <p className="mt-2">
              Threat Score
            </p>

          </div>

        </div>

        {/* INPUT */}

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Paste Security Logs
          </h2>

          <textarea
            value={logs}
            onChange={(e) =>
              setLogs(e.target.value)
            }
            placeholder="Paste logs here..."
            className="w-full h-56 rounded-2xl p-5 bg-black/30 border border-white/20"
          />

          <button
            onClick={generateTimeline}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-red-500 py-4 rounded-2xl text-xl font-bold hover:scale-105 transition"
          >
            ⚡ Generate Timeline
          </button>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="text-center text-3xl animate-pulse mb-10">

            🤖 AI Processing Logs...

          </div>

        )}

        {/* CHARTS */}

        {timeline.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

            <div className="bg-white/10 rounded-3xl p-6">

              <h2 className="text-2xl font-bold mb-4">
                Severity Pie Chart
              </h2>

              <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    {chartData.map((entry, index) => (

                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

            <div className="bg-white/10 rounded-3xl p-6">

              <h2 className="text-2xl font-bold mb-4">
                Severity Bar Chart
              </h2>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart data={chartData}>

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#ec4899"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* TIMELINE */}

        {timeline.length > 0 && (

          <div className="mb-10">

            <h2 className="text-4xl font-bold mb-8">
              📌 Incident Timeline
            </h2>

            <div className="space-y-5">

              {timeline.map((item, index) => (

                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-6"
                >

                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                    <div>

                      <h3 className="text-2xl font-bold">
                        {item.time}
                      </h3>

                      <p className="mt-2 text-lg">
                        {item.event}
                      </p>

                    </div>

                    <div
                      className={`px-5 py-3 rounded-full text-lg font-bold ${
                        item.severity === "High"
                          ? "bg-red-500"
                          : item.severity === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {item.severity}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* EXPORT */}

        {timeline.length > 0 && (

          <div className="text-center mb-10">

            <CSVLink
              data={csvData}
              filename="incident-report.csv"
              className="bg-cyan-500 px-8 py-4 rounded-2xl text-xl font-bold"
            >
              ⬇ Export CSV
            </CSVLink>

          </div>

        )}

        {/* FOOTER */}

        <div className="text-center text-gray-300 border-t border-white/10 pt-6">

          <p>
            Incident Timeline Visualizer • AI Security Dashboard
          </p>

          <p className="mt-2">
            Capstone Project 2026
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;