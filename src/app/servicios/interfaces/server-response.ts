export interface IServerResponse<T> {
  success: boolean;
  data: T;
  messages: any;
}

export interface IStatusResponse<T> {
  success: boolean;
  data: T;
  messages: any;
}


export interface IStatusListResponse<T> {
  success: boolean;
  data: T[];
  messages: any;
}
