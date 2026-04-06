import { useState, useEffect } from "react";
import BASE_URL from "../../api.js";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const token = localStorage.getItem("token");

  const [eventStats, setEventStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [topEvents, setTopEvents] = useState([]);

  useEffect(() => {
    fetchEventStats();
    fetchDailyStats();
    fetchTopEvents();
  }, []);

  const fetchEventStats = async () => {
    const res = await fetch(`${BASE_URL}/analytics/geteventstats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setEventStats(data);
  };

  const fetchDailyStats = async () => {
    const res = await fetch(`${BASE_URL}/analytics/getdailyregistrations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const formattedDaily = data.map((item) => ({
      ...item,
      date: new Date(item._id).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
    }));

    setDailyStats(formattedDaily);
  };

  const fetchTopEvents = async () => {
    const res = await fetch(`${BASE_URL}/analytics/gettopevents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTopEvents(data);
  };

  const top10 = eventStats.slice(0, 7);

  const top5 = topEvents.slice(0, 5);
  const COLORS = ["#706db8", "#49c077", "#d19e37", "#be3939", "#3ca9c1"];

  return (
    <div className="analytics-page">
      <h1>Admin Analytics</h1>

      <br />
      <h2>Registrations per Event</h2>
      <div style={{ overflowX: "auto" }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={top10}>
            <XAxis
              dataKey="title"
              interval={0}
              tick={{ fill: "#ff0000", fontSize: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalRegistrations" fill="#c3ccde" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <br />
      <h2>Registrations per Day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailyStats}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <br />
      <h2>Top Events Distribution</h2>

      <ResponsiveContainer width="100%" height={600}>
        <PieChart>
          <Pie
            data={top5}
            dataKey="totalRegistrations"
            nameKey="title"
            cx="50%"
            cy="50%"
            outerRadius={250}
            label
          >
            {top5.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
