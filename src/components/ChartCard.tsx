import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Brush
} from "recharts";

const colors: Record<string, string> = {
  "FCI-G Index (baseline)": "#1f2937",
  "FFR": "#ef4444",
  "10Yr Treasury": "#3b82f6",
  "Mortgage Rate": "#10b981",
  "BBB": "#8b5cf6",
  "Stock Market": "#f59e0b",
  "House Prices": "#f97316",
  "Dollar": "#ec4899"
};

const ChartCard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/data/converted.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const keys = Object.keys(json[0]).filter((k) => k !== "date");
        const vis: Record<string, boolean> = {};
        keys.forEach((k) => (vis[k] = true));
        setVisible(vis);
      });
  }, []);

  if (!data.length) {
    return <div className="text-center p-6 text-gray-600">Loading chart...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Financial Conditions Chart
        </h2>
        <p className="text-gray-500 mb-6">
          Interactive line chart with toggleable components and zoom
        </p>
        <div style={{ width: "100%", height: 500 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend
                onClick={(e) =>
                  setVisible((prev) => ({
                    ...prev,
                    [e.dataKey]: !prev[e.dataKey]
                  }))
                }
              />
              {Object.keys(colors).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[key]}
                  strokeWidth={2}
                  dot={false}
                  hide={!visible[key]}
                />
              ))}
              <Brush dataKey="date" height={30} stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
