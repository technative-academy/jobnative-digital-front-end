import { useEffect, useState } from "react";
import { eventsService } from "../services/events.service";

export function useEvent(eventId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(eventId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setError(null);

    const load = async () => {
      try {
        setIsLoading(true);
        const res = await eventsService.getById(eventId);
        if (isActive) setData(res);
      } catch (err) {
        if (isActive) setError(err);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [eventId]);

  return { data, isLoading, error };
}
