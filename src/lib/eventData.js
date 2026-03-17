import { eventsService } from "../services/events.service";

export const EVENTS_QUERY_KEY = ["events"];
export const LOCAL_EVENTS_QUERY_KEY = ["events", "local"];

function createLocalId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function getNames(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      return item?.name ?? item?.title;
    })
    .filter(Boolean);
}

function unique(values) {
  const seen = new Set();

  return values.filter((value) => {
    const key =
      typeof value === "string" ? value.trim().toLowerCase() : String(value);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function normalizeEvent(event) {
  const technologyList = unique([
    ...getNames(event?.technologies),
    ...getNames(event?.technologyStack),
    ...(typeof event?.technology === "string"
      ? event.technology
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : []),
  ]);

  const sponsorNames = unique([
    ...getNames(event?.sponsors),
    ...(Array.isArray(event?.sponsorNames) ? event.sponsorNames : []),
  ]);

  return {
    ...event,
    endTime: event?.endTime ?? event?.end_time ?? null,
    industry: event?.industry || "Not specified",
    location: event?.location || "TBD",
    sponsorNames,
    startTime: event?.startTime ?? event?.start_time ?? null,
    technology: technologyList.join(", ") || "Not specified",
    technologyList,
  };
}

function normalizeEventsResponse(response) {
  if (Array.isArray(response)) {
    return response.map(normalizeEvent);
  }

  if (Array.isArray(response?.events)) {
    return response.events.map(normalizeEvent);
  }

  return [];
}

export async function fetchEvents() {
  const response = await eventsService.getAll();
  return normalizeEventsResponse(response);
}

export function mergeEvents(responses) {
  const eventsById = new Map();

  responses.flatMap(normalizeEventsResponse).forEach((event) => {
    eventsById.set(event.id, event);
  });

  return [...eventsById.values()];
}

export function buildLocalEvent(createdEvent, submittedEvent) {
  const isApproved =
    createdEvent?.status === "approved" ||
    Boolean(createdEvent?.approvedAt || createdEvent?.approved_at);

  return normalizeEvent({
    ...submittedEvent,
    ...(createdEvent || {}),
    id: createdEvent?.id ?? createLocalId("event"),
    isLocalPending: !isApproved,
    status: createdEvent?.status ?? (isApproved ? "approved" : "pending"),
  });
}

export function isPendingEvent(event) {
  return Boolean(event?.isLocalPending || event?.status === "pending");
}
