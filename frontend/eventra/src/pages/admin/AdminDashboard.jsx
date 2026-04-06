import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../../../api.js";
import Loader from "../../components/Loader.jsx";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BASE_URL}/myevents`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.message || "Failed to fetch admin events");

      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const completed = events.filter((e) => e.status === "completed").length;
    const cancelled = events.filter((e) => e.status === "cancelled").length;

    const registrations = events.reduce(
      (sum, e) => sum + (e.registeredUsers?.length || 0),
      0,
    );

    return { total, upcoming, completed, cancelled, registrations };
  }, [events]);

  const handleDelete = async (eventId) => {
    const ok = window.confirm("Delete this event?");
    if (!ok) return;

    try {
      const res = await fetch(`${BASE_URL}/deleteevent/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      alert("Event deleted");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <h2>{error}</h2>;

  // recent events (latest by date)
  const recent = [...events]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <Link className="btn" to="/createevent">
            Create Event
          </Link>
          <Link className="btn" to="/myevents">
            My Events
          </Link>
          <Link className="btn" to="/analytics">
            Analytics
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming</h3>
          <p>{stats.upcoming}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h3>Cancelled</h3>
          <p>{stats.cancelled}</p>
        </div>
        <div className="stat-card">
          <h3>Total Registrations</h3>
          <p>{stats.registrations}</p>
        </div>
      </div>

      {/* Recentevents */}
      <div className="section">
        <h2>Recent Events</h2>

        {recent.length === 0 ? (
          <p>No events created yet.</p>
        ) : (
          <div className="event-grid">
            {recent.map((event) => (
              <div className="event-card" key={event._id}>
                {event.bannerImage?.match(/\.(mp4|webm|ogg)$/i) ? (
          <video
          src={event.bannerImage}
          autoPlay
          muted
          loop
          playsInline
          />
        ) : (
        <img src={event.bannerImage} alt={event.title} /> )}
                <h3>{event.title}</h3>
                <p>{event.location}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>Status: {event.status}</p>
                <p>Registrations: {event.registeredUsers?.length || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
