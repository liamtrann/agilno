// EventDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((response) => response.json())
      .then((data) => setEvent(data));
  }, [id]);

  const handleRegister = () => {
    // Implement registration logic here
    console.log("Register for event logic goes here");
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>{event.name}</h1>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <button onClick={handleRegister} className="btn btn-primary">
        Register for Event
      </button>
    </div>
  );
};

export default EventDetail;
