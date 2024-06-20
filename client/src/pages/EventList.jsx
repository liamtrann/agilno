import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center">Event List</h1>
          <div className="list-group">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <span>{event.name}</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
