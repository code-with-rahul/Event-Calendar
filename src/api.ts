const API_URL = "http://localhost:8080/events";

export const fetchEvents = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createEvent = async (eventData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return response.json();
};