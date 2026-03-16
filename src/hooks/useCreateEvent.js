import { eventsService } from "@/services/events.service";
import { useState } from "react";

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createEvent(newEvent) {
    try {
      setLoading(true);
      const data = await eventsService.create(newEvent);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createEvent, loading, error };
}
