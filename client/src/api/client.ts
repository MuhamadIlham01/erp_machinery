export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error?.message ?? "Terjadi kesalahan",
      json?.error?.details,
    );
  }
  return json.data as T;
}
