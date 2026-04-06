import React, { useEffect, useState } from "react";
import BASE_URL from "../../api.js";
import EventCard from "../components/EventCard.jsx";
import Loader from "../components/Loader.jsx";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async (pageNumber = 1, query = "") => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/getevents?page=${pageNumber}&limit=10&title=${query}`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }
      

      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents(1, search);
  };

  if (loading) return <Loader />;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="home">
      <div className="home-header">
        {page === 1 && (
          <section className="pro-section">
            <div className="pro-content">
              <div className="pro-left">
                <h2>Want to Create Events?</h2>
                <p>
                  Take <span>Eventra Pro</span> today and share your events to
                  millions of users. Manage registrations, export users, send
                  updates and track analytics — all in one place only at{" "}
                  <span>₹499</span>.
                </p>

                <div className="pro-features">
                  <div>✔ Create Unlimited Events</div>
                  <div>✔ Track Registrations</div>
                  <div>✔ Export Attendee Data</div>
                  <div>✔ Send Email Updates</div>
                </div>

                <a
                  href="https://forms.gle/k2GST7HUYZbDZZ3aA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pro-btn"
                >
                  Become a Creator
                </a>
              </div>

              <div className="pro-right">
                <div className="pro-card">
                  <h4>Total Registrations</h4>
                  <h3>2.3K+</h3>
                </div>

                <div className="pro-card">
                  <h4>Active Events</h4>
                  <h3>18</h3>
                </div>

                <div className="pro-card">
                  <h4>Revenue</h4>
                  <h3>₹1,24,000</h3>
                </div>
              </div>
            </div>
          </section>
        )}
        <h1>Explore Events</h1>
        <p>Discover upcoming events around you</p>

        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
