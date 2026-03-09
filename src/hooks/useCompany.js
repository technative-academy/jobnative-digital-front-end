import { useEffect, useState } from "react";
import { companiesService } from "../services/companies.service";

export function useCompany(companyId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(companyId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    let isActive = true;
    setError(null);

    const load = async () => {
      try {
        setIsLoading(true);
        const res = await companiesService.getById(companyId);
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
  }, []);

  return { data, isLoading, error };
}
