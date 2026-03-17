import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  EVENTS_QUERY_KEY,
  LOCAL_EVENTS_QUERY_KEY,
  fetchEvents,
  mergeEvents,
} from "../lib/eventData";

export function useEvents() {
  const eventsQuery = useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEvents,
  });
  const localEventsQuery = useQuery({
    queryKey: LOCAL_EVENTS_QUERY_KEY,
    queryFn: () => [],
    initialData: [],
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const localEvents = localEventsQuery.data ?? [];
  const serverEvents = eventsQuery.data ?? null;
  const mergedEvents = useMemo(
    () => mergeEvents([localEvents, serverEvents ?? []]),
    [localEvents, serverEvents],
  );
  const data =
    serverEvents === null && localEvents.length === 0 ? null : mergedEvents;

  return {
    data,
    isLoading: eventsQuery.isLoading && localEvents.length === 0,
    error: mergedEvents.length === 0 ? eventsQuery.error : null,
  };
}
