import { companiesService } from "@/services/companies.service";
import { useState } from "react";

export function useCreateCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createCompany(newCompany) {
    try {
      setLoading(true);
      const data = await companiesService.create(newCompany);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createCompany, loading, error };
}
