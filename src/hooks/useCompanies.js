import { useState, useEffect } from "react";
import { companiesService } from "../services/companies.service";

export function useCompanies() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const res =
          await companiesService.getAll(); /* i changed this to match service.js */

        if (isActive) {
          setData(res);
        }
      } catch (err) {
        console.error("API error:", err); /* added error logging */

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
