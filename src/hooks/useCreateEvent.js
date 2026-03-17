import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "@/services/events.service";
import {
  buildLocalEvent,
  EVENTS_QUERY_KEY,
  LOCAL_EVENTS_QUERY_KEY,
  mergeEvents,
} from "../lib/eventData";

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newEvent) => eventsService.create(newEvent),
    onSuccess: (createdEvent, submittedEvent) => {
      const localEvent = buildLocalEvent(createdEvent, submittedEvent);

      queryClient.setQueryData(LOCAL_EVENTS_QUERY_KEY, (current = []) =>
        mergeEvents([current, localEvent]),
      );
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });

  return {
    createEvent: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
}
