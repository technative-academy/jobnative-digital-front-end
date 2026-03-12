import { useState } from "react";

export function useCreateCompany() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createCompany(newCompany) {
    try {
      setLoading(true);

      const res = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCompany),
      });

      if (!res.ok) {
        throw new Error("Failed to create company");
      }

      return await res.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createCompany, loading, error };
}
