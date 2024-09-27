import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export interface IInheritanceStartSessionParams {
  connection: IDeviceConnection;
}

export type IInheritanceStartSessionEventType = 'Result' | 'Device';

export interface IInheritanceStartSessionEvent {
  type: IInheritanceStartSessionEventType;
  sessionId?: string;
  sessionAge?: number;
  device?: {
    isDone: boolean;
  };
}

export interface IInheritanceStopSessionParams {
  connection: IDeviceConnection;
}

export type IInheritanceStopSessionEventType = 'Result' | 'Device';

export interface IInheritanceStopSessionEvent {
  type: IInheritanceStopSessionEventType;
  device?: {
    isDone: boolean;
  };
}
