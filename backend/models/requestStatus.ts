export const REQUEST_STATUSES = [
  "PENDING",
  "APPROVED",
  "DECLINED",
  "RETURNED"
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
