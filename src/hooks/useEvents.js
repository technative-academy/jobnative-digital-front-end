import { useState, useEffect } from "react";
import { eventsService } from "../services/events.service";

export function useEvents() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const res =
          await eventsService.getAll();

        if (isActive) {
          setData(res);
        }
      } catch (err) {
        console.error("API error:", err);

        if (isActive) {
          setError(err);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return { data, isLoading, error };
}
