import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  COMPANIES_QUERY_KEY,
  LOCAL_COMPANIES_QUERY_KEY,
  fetchCompanies,
  mergeCompanies,
} from "../lib/companyData";

export function useCompanies() {
  const companiesQuery = useQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: fetchCompanies,
  });
  const localCompaniesQuery = useQuery({
    queryKey: LOCAL_COMPANIES_QUERY_KEY,
    queryFn: () => [],
    initialData: [],
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const localCompanies = localCompaniesQuery.data ?? [];
  const serverCompanies = companiesQuery.data ?? [];
  const data = useMemo(
    () => mergeCompanies([localCompanies, serverCompanies]),
    [localCompanies, serverCompanies],
  );

  return {
    data,
    isLoading: companiesQuery.isLoading && localCompanies.length === 0,
    error: data.length === 0 ? companiesQuery.error : null,
  };
}
