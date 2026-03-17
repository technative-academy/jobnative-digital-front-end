import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '@/services/events.service';
import { EVENTS_QUERY_KEY, LOCAL_EVENTS_QUERY_KEY } from '../lib/eventData';

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id) => eventsService.delete(id),
    onSuccess: (_response, id) => {
      queryClient.setQueryData(LOCAL_EVENTS_QUERY_KEY, (current = []) =>
        current.filter((event) => Number(event?.id) !== Number(id)),
      );
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  return {
    deleteEvent: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
