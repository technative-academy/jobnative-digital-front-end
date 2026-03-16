import { companiesService } from "@/services/companies.service";
import { useState } from "react";

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createEvent(newEvent) {
    try {
      setLoading(true);

    //   const res = await fetch("/api/events", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newEvent),
    //   });
      const res = await companiesService.create(newEvent)

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      return await res.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createEvent, loading, error };
}
