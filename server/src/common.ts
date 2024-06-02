export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}

export type TStatus = "pending" | "approved";

export interface IRelationship {
  id: string;
  request_id: number;
  reciever_id: number;
  status: TStatus;
}
