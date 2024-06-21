// EventDetail.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [available, setAvailable] = useState(0);
  const { user } = useAuth();
  useEffect(() => {
    axios
      .get(`/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        setAvailable(
          response.data.capacity - response.data.registrations.length
        );
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, [id]);

  const handleRegister = () => {
    setSuccess("");
    setError("");
    if (!user) {
      setError("Please Sign in to Register The Event");
      return;
    }
    axios
      .post(`/api/events/${id}/register`, {
        username: user.username,
      })
      .then((response) => {
        setSuccess(response.data);
        setAvailable(available - 1);
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };

  if (!event) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 mx-auto text-center">
          <h1>{event.name}</h1>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>
            {available ? `Available seats: ${available}` : "No Seat available"}
          </p>
          <button onClick={handleRegister} className="btn btn-primary">
            Register for Event
          </button>
          {error && <div className="alert alert-danger m-5">{error}</div>}
          {success && <div className="alert alert-success m-5">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
