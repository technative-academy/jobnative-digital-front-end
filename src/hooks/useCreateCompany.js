import { useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesService } from "@/services/companies.service";
import {
  buildLocalCompany,
  COMPANIES_QUERY_KEY,
  LOCAL_COMPANIES_QUERY_KEY,
  mergeCompanies,
} from "../lib/companyData";

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newCompany) => companiesService.create(newCompany),
    onSuccess: (createdCompany, submittedCompany) => {
      const localCompany = buildLocalCompany(createdCompany, submittedCompany);

      queryClient.setQueryData(LOCAL_COMPANIES_QUERY_KEY, (current = []) =>
        mergeCompanies([current, localCompany]),
      );
      void queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    },
  });

  return {
    createCompany: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
