/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable no-redeclare */
export type Status = 'authorized' | 'denied' | 'limited' | 'restricted' | 'undetermined' | 'never_ask_again';
export const PermsTraceCategory = 'NativescriptPerms';

export type AndroidPermissions<T = Exclude<keyof typeof android.Manifest.permission, keyof typeof java.lang.Object>> = {
    [K in keyof T]: T[K] extends string ? T : never;
};

export type AndroidPermissionsString = `android.permission.${AndroidPermissions}` /*  | `android.Manifest.permission.${AndroidPermissions}` */;

export type Permissions =
    | 'location'
    | 'camera'
    | 'microphone'
    | 'photo'
    | 'video'
    | 'audio'
    | 'contacts'
    | 'event'
    | 'reminder'
    | 'bluetooth'
    | 'bluetoothConnect'
    | 'bluetoothScan'
    | 'notification'
    | 'backgroundRefresh'
    | 'speechRecognition'
    | 'mediaLocation'
    | 'mediaLibrary'
    | 'motion'
    | 'storage'
    | 'callPhone'
    | 'readSms'
    | 'receiveSms'
    | AndroidPermissionsString;

export interface LocationOptions {
    type: string;
    coarse?: boolean;
    precise?: boolean;
}
export interface StorageOptions {
    read?: boolean;
    write?: boolean;
    // manage?: boolean;
}

export type PermissionOptions = Record<string, any>;

export interface ObjectPermissions {
    location: LocationOptions;
    storage: StorageOptions;
}

export type ObjectPermissionsRest = {
    [key in Permissions]: PermissionOptions;
};

export type CheckOptions<T extends Permissions = Permissions> = T extends keyof ObjectPermissions ? ObjectPermissions[T] : any;
export function check<T extends Permissions>(permission: T, options?: CheckOptions<T>): Promise<Result>;
export function check<T extends string>(permission: T): Promise<Result>;

export function canOpenSettings(): Promise<boolean>;

export function openSettings(): Promise<boolean>;

export function getTypes(): Permissions[];

export type Result = [Status, boolean];
export interface MultiResult {
    [k: Permissions | string]: Status;
}

export type RequestOptions<T extends Permissions = Permissions> = T extends keyof ObjectPermissions ? ObjectPermissions[T] : any;
export function request<T extends Permissions>(permission: T, options?: RequestOptions<T>): Promise<Result>;
export function request<T extends Partial<ObjectPermissions | ObjectPermissionsRest>>(permission: T): Promise<MultiResult>;
export function request<T extends string>(permission: T): Promise<Result>;

export function checkMultiple<T extends Partial<ObjectPermissionsRest>>(permissions: T): Promise<MultiResult>;
export function shouldShowRequestPermissionRationale<T extends string>(permission: T): Promise<boolean>;
