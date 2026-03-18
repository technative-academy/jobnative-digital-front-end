import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '@/services/companies.service';
import { COMPANIES_QUERY_KEY, LOCAL_COMPANIES_QUERY_KEY } from '../lib/companyData';

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id) => companiesService.delete(id),
    onSuccess: (_response, id) => {
      queryClient.setQueryData(LOCAL_COMPANIES_QUERY_KEY, (current = []) =>
        current.filter((company) => Number(company?.id) !== Number(id)),
      );
      void queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    },
  });

  return {
    deleteCompany: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
