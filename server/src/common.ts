export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type TStatus = "pending" | "approved" | "denied";
