import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '@/services/events.service';
import {
  buildLocalEvent,
  EVENTS_QUERY_KEY,
  LOCAL_EVENTS_QUERY_KEY,
} from '../lib/eventData';

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => eventsService.update(id, payload),
    onSuccess: (updatedEvent, { id, payload }) => {
      queryClient.setQueryData(LOCAL_EVENTS_QUERY_KEY, (current = []) =>
        current.map((localEvent) =>
          Number(localEvent?.id) === Number(updatedEvent?.id ?? id)
            ? buildLocalEvent(updatedEvent ?? localEvent, {
                ...localEvent,
                ...payload,
              })
            : localEvent,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  return {
    updateEvent: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
