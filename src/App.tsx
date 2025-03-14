import React, { useState } from "react";
import "./styles.css";

interface Event {
  date: string;
  title: string;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const openModal = (day: number) => {
    setSelectedDate(`${currentYear}-${currentMonth + 1}-${day}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setNewEvent("");
  };

  const addEvent = () => {
    if (selectedDate && newEvent.trim()) {
      setEvents([...events, { date: selectedDate, title: newEvent }]);
      closeModal();
    }
  };

  const handleDragStart = (event: Event) => {
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (day: number) => {
    if (draggedEvent) {
      const newDate = `${currentYear}-${currentMonth + 1}-${day}`;
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e === draggedEvent ? { ...e, date: newDate } : e))
      );
      setDraggedEvent(null);
    }
  };

  const changeMonth = (offset: number) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="container">
      <h2>Event Calendar</h2>

      {/* Month & Year Navigation */}
      <div className="month-navigation">
        <button onClick={() => changeMonth(-1)}>◀</button>
        <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        {daysArray.map((day) => (
          <div
            key={day}
            className="calendar-day"
            onClick={() => openModal(day)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(day)}
          >
            {day}
            {events
              .filter((event) => event.date === `${currentYear}-${currentMonth + 1}-${day}`)
              .map((event, index) => (
                <div
                  key={index}
                  className="event-item"
                  draggable
                  onDragStart={() => handleDragStart(event)}
                >
                  {event.title}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Event</h3>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
            />
            <button onClick={addEvent}>Add</button>
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;