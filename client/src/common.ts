export interface IChat {
  id: number;
  icon_url: string;
  joined_at: string;
  unseen_messages: boolean;
  room_name: string;
  member_count: number;
}

export interface IMessage {
  id: number;
  body: string;
  sender_id: number;
  created_at: string;
  room_id: number;
  username: string;
  icon_url: string;
}

export interface IRelationship {
  id: number;
  username: string;
  request_id: number;
  reciever_id: number;
  icon_url: string;
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}