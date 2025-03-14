import React, { useState } from "react";

interface EventFormProps {
  onAdd: (eventData: { title: string; date: string }) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, date });
    setTitle("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;