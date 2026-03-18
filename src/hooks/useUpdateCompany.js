import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService } from '@/services/companies.service';
import {
  buildLocalCompany,
  COMPANIES_QUERY_KEY,
  LOCAL_COMPANIES_QUERY_KEY,
} from '../lib/companyData';

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => companiesService.update(id, payload),
    onSuccess: (updatedCompany, { id, payload }) => {
      queryClient.setQueryData(LOCAL_COMPANIES_QUERY_KEY, (current = []) =>
        current.map((localCompany) =>
          Number(localCompany?.id) === Number(updatedCompany?.id ?? id)
            ? buildLocalCompany(updatedCompany ?? localCompany, {
                ...localCompany,
                ...payload,
              })
            : localCompany,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    },
  });

  return {
    updateCompany: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
