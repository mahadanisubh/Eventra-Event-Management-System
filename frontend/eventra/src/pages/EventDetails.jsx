import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../../api.js";
import Loader from "../components/Loader.jsx";
import CommentSection from "../comments/CommentSection.jsx";

const EventDetails = () => {
  const { eventId } = useParams();
  const nav = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const token = localStorage.getItem("token");

  const getUser = () => {
    try {
      const item = localStorage.getItem("user");
      if (!item || item === "undefined") return null;
      return JSON.parse(item);
    } catch {
      return null;
    }
  };

  const fetchEvent = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getEventById/${eventId}`);

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch event");
      }

      setEvent(data.event);

      const user = getUser();
      if (
        user &&
        data.event?.registeredUsers?.some(
          (rid) => String(rid) === String(user._id),
        )
      ) {
        setIsRegistered(true);
        console.log(user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const calculateTimeLeft = (date, time) => {
    if (!date || !time) return null;

    const eventDateTime = new Date(`${date.split("T")[0]} ${time}`);

    const difference = eventDateTime - new Date();

    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  useEffect(() => {
    if (!event?.date || !event?.time) return;

    const timer = setInterval(() => {
      const result = calculateTimeLeft(event.date, event.time);
      setTimeLeft(result);
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  const handlePaidRegistration = async (eventId) => {
  try {
    const token = localStorage.getItem("token");

    const orderRes = await fetch(`${BASE_URL}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      throw new Error(orderData.message || "Failed to create payment order");
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Eventra",
      description: `Registration for ${orderData.eventTitle}`,
      order_id: orderData.orderId,
      handler: async function (response) {
        const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...response,
            paymentId: orderData.paymentId,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          throw new Error(verifyData.message || "Payment verification failed");
        }
        setIsRegistered(true);
        alert("Payment successful and registration confirmed");
        fetchEvent();
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

  const handleRegister = async () => {
    if (!token) {
      nav("/loginuser");
      return;
    }

    try {
      if (event.paymentType === "free" || event.price === 0) {
      await fetch(`${BASE_URL}/registerInEvent/${eventId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setIsRegistered(true);
      alert("Successfully registered!");
      fetchEvent();
    }
    else{
      await handlePaidRegistration(eventId);
    }
      // const text = await res.text();
      // const data = text ? JSON.parse(text) : {};

      // if (!res.ok) {
      //   throw new Error(data.message || "Registration failed");
      // }

      // setIsRegistered(true);
      // alert("Successfully registered!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <h2>{error}</h2>;
  if (!event) return <h2>Event not found</h2>;

  return (
    <div className="event-details">
      <div className="event-hero">
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
      </div>

      <div className="event-info">
        <div className="event-header">
          <h1>{event.title}</h1>
        </div>

        <div className="event-meta">
          <div>
            <span>Category</span>
            <strong>{event.category}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{event.location}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{new Date(event.date).toLocaleDateString()}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{event.time}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{event.status}</strong>
          </div>
        </div>

        <div className="event-description">{event.desc}</div>

        {event.status === "upcoming" && (
          <div className="countdown-box">
            {timeLeft ? (
              <>
                <h3>Event Starts In</h3>
                <div className="countdown-grid">
                  <div>
                    <span>{timeLeft.days}</span>
                    <p>Days</p>
                  </div>
                  <div>
                    <span>{timeLeft.hours}</span>
                    <p>Hours</p>
                  </div>
                  <div>
                    <span>{timeLeft.minutes}</span>
                    <p>Minutes</p>
                  </div>
                  <div>
                    <span>{timeLeft.seconds}</span>
                    <p>Seconds</p>
                  </div>
                </div>
              </>
            ) : (
              <h3 className="live-text">🔴 Event is Live!</h3>
            )}
          </div>
        )}
        {event.status !== "upcoming" ? (
          <button className="register-btn" disabled>
            Registration Closed
          </button>
        ) : isRegistered ? (
          <button className="register-btn" disabled>
            Already Registered
          </button>
        ) : (
          <button className="register-btn" onClick={handleRegister}>
            Register Now
          </button>
        )}
        <CommentSection eventId={eventId} />
      </div>
    </div>
  );
};

export default EventDetails;
