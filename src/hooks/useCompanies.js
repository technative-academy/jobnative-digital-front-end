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

  const data = useMemo(
    () => mergeCompanies([localCompaniesQuery.data ?? [], companiesQuery.data ?? []]),
    [localCompaniesQuery.data, companiesQuery.data],
  );
  const localCompaniesCount = localCompaniesQuery.data?.length ?? 0;

  return {
    data,
    isLoading: companiesQuery.isLoading && localCompaniesCount === 0,
    error: data.length === 0 ? companiesQuery.error : null,
  };
}
