import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../api";

const CreateEvent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    category: "tech",
    location: "",
    date: "",
    time: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/loginuser");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (image) {
      formData.append("bannerImage", image);
    }

    try {
      const res = await fetch(`${BASE_URL}/createevent`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Event creation failed");
      }

      alert("Event Created Successfully!");
      navigate("/admin");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="create-event-page">
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit} className="create-event-form">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="desc"
          placeholder="Description"
          value={form.desc}
          onChange={handleChange}
          required
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="tech">Tech</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="workshop">Workshop</option>
          <option value="film">Film</option>
          <option value="dance">Dance</option>
          <option value="others">Others</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="time"
          placeholder="Time (e.g. 10:00 AM)"
          value={form.time}
          onChange={handleChange}
          required
        />

        <select name="paymentType" value={form.paymentType} onChange={handleChange}>
          <option value="free">Free</option>
          <option value="paid">paid</option>
        </select>

        <input
          type="text"
          name="price"
          placeholder="Event Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="availableSeats"
          placeholder="Available Seats"
          value={form.availableSeats}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/* , video/mp4, video/webm"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
