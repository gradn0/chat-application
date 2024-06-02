export interface IChat {
  id: number;
  name: string;
  icon_url: string;
  joined_at: string;
}

export interface IRelationship {
  id: number;
  username: string;
  request_id: number;
  reciever_id: number;
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}