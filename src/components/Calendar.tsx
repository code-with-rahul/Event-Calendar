import React, { useState } from "react";
import "../styles.css";

interface Event {
  id: number;
  title: string;
  date: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleAddEvent = () => {
    if (selectedDate && eventTitle.trim() !== "") {
      const newEvent: Event = {
        id: events.length + 1,
        title: eventTitle,
        date: selectedDate,
      };
      setEvents([...events, newEvent]);
      setEventTitle("");
      setSelectedDate(null);
    }
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleDragStart = (event: Event) => {
    setDraggedEvent(event);
  };

  const handleDrop = (newDate: string) => {
    if (draggedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === draggedEvent.id ? { ...event, date: newDate } : event
        )
      );
      setDraggedEvent(null);
    }
  };

  const handleMonthChange = (change: number) => {
    let newMonth = currentMonth + change;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div>
      <h2>Event Calendar</h2>

      {/* Month Selector */}
      <div className="month-selector">
        <button onClick={() => handleMonthChange(-1)}>◀</button>
        <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}</span>
        <button onClick={() => handleMonthChange(1)}>▶</button>
      </div>

      {/* Calendar */}
      <div className="calendar-container">
        {days.map((day) => {
          const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          return (
            <div
              key={day}
              className={`calendar-day ${selectedDate === formattedDate ? "selected-day" : ""}`}
              onClick={() => setSelectedDate(formattedDate)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(formattedDate)}
            >
              {day}
              {events
                .filter((event) => event.date === formattedDate)
                .map((event) => (
                  <div
                    key={event.id}
                    className="event-item"
                    draggable
                    onDragStart={() => handleDragStart(event)}
                  >
                    {event.title}
                    <button className="delete-button" onClick={() => handleDeleteEvent(event.id)}>
                      X
                    </button>
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* Event Form */}
      {selectedDate && (
        <div className="event-form">
          <h3>Add Event on {selectedDate}</h3>
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;