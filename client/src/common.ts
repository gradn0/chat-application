export interface IChat {
  id: number,
  title: string;
  unread: number;
  icon_url: string;
  latest_message: string;
}

export interface IContact {
  id: number,
  name: string;
  icon_url: string;
}

export interface IFriendRequest {
  id: number,
  username: string,
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}