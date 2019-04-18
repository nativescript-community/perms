import * as application from 'tns-core-modules/application';
import * as applicationSettings from 'tns-core-modules/application-settings';
import { CheckOptions, Rationale, RequestOptions, Status } from './permissions';

export * from './permissions.common'

export const permissionTypes = {
    get location() {
        return android.Manifest.permission.ACCESS_FINE_LOCATION;
    },
    get camera() {
        return android.Manifest.permission.CAMERA;
    },
    get microphone() {
        return android.Manifest.permission.RECORD_AUDIO;
    },
    get contacts() {
        return android.Manifest.permission.READ_CONTACTS;
    },
    get event() {
        return android.Manifest.permission.READ_CALENDAR;
    },
    get storage() {
        return [android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.READ_EXTERNAL_STORAGE];
    },
    get photo() {
        return android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
    },
    get callPhone() {
        return android.Manifest.permission.CALL_PHONE;
    },
    get readSms() {
        return android.Manifest.permission.READ_SMS;
    },
    get receiveSms() {
        return android.Manifest.permission.RECEIVE_SMS;
    }
};

const STORAGE_KEY = '@NSPermissions:didAskPermission:';

const setDidAskOnce = (permission: string) => Promise.resolve().then(() => applicationSettings.setBoolean(STORAGE_KEY + permission, true));

const getDidAskOnce = (permission: string) => Promise.resolve(!!applicationSettings.getBoolean(STORAGE_KEY + permission));

export enum PermissionStatus {
    GRANTED = 'granted',
    DENIED = 'denied',
    NEVER_ASK_AGAIN = 'never_ask_again'
}

namespace PermissionsAndroid {
    /**
     * A list of specified "dangerous" permissions that require prompting the user
     */
    export const PERMISSIONS = {
        READ_CALENDAR: 'android.permission.READ_CALENDAR',
        WRITE_CALENDAR: 'android.permission.WRITE_CALENDAR',
        CAMERA: 'android.permission.CAMERA',
        READ_CONTACTS: 'android.permission.READ_CONTACTS',
        WRITE_CONTACTS: 'android.permission.WRITE_CONTACTS',
        GET_ACCOUNTS: 'android.permission.GET_ACCOUNTS',
        ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
        ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
        RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
        READ_PHONE_STATE: 'android.permission.READ_PHONE_STATE',
        CALL_PHONE: 'android.permission.CALL_PHONE',
        READ_CALL_LOG: 'android.permission.READ_CALL_LOG',
        WRITE_CALL_LOG: 'android.permission.WRITE_CALL_LOG',
        ADD_VOICEMAIL: 'com.android.voicemail.permission.ADD_VOICEMAIL',
        USE_SIP: 'android.permission.USE_SIP',
        PROCESS_OUTGOING_CALLS: 'android.permission.PROCESS_OUTGOING_CALLS',
        BODY_SENSORS: 'android.permission.BODY_SENSORS',
        SEND_SMS: 'android.permission.SEND_SMS',
        RECEIVE_SMS: 'android.permission.RECEIVE_SMS',
        READ_SMS: 'android.permission.READ_SMS',
        RECEIVE_WAP_PUSH: 'android.permission.RECEIVE_WAP_PUSH',
        RECEIVE_MMS: 'android.permission.RECEIVE_MMS',
        READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
        WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE'
    };

    export const RESULTS = {
        GRANTED: 'granted',
        DENIED: 'denied',
        NEVER_ASK_AGAIN: 'never_ask_again'
    };

    /**
     * Returns a promise resolving to a boolean value as to whether the specified
     * permissions has been granted
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#check
     */
    export function check(permission: string) {
        const context: android.content.Context = application.android.foregroundActivity || application.android.startActivity;
        if (android.os.Build.VERSION.SDK_INT < 23) {
            return Promise.resolve(context.checkPermission(permission, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED);
        }
        return Promise.resolve(context.checkSelfPermission(permission) === android.content.pm.PackageManager.PERMISSION_GRANTED);
    }

    /**
     * Prompts the user to enable a permission and returns a promise resolving to a
     * string value indicating whether the user allowed or denied the request
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#request
     */
    export async function request(permission: string, rationale?: Rationale): Promise<PermissionStatus> {
        // if (rationale) {
        //     const shouldShowRationale = await shouldShowRequestPermissionRationale(permission);

        //     if (shouldShowRationale) {
        //         return new Promise((resolve, reject) => {

        //             NativeModules.DialogManagerAndroid.showAlert(rationale, () => reject(new Error('Error showing rationale')), () => resolve(requestPermission(permission)));
        //         });
        //     }
        // }
        return requestPermission(permission);
    }

    /**
     * Prompts the user to enable multiple permissions in the same dialog and
     * returns an object with the permissions as keys and strings as values
     * indicating whether the user allowed or denied the request
     *
     * See https://facebook.github.io/react-native/docs/permissionsandroid.html#requestmultiple
     */
    export function requestMultiple(permissions: string[]): Promise<{ [permission: string]: Status }> {
        return requestMultiplePermissions(permissions);
    }
}

// PermissionsAndroid = new PermissionsAndroid();

let mRequestCode = 0;
function requestPermission(permission: string): Promise<PermissionStatus> {
    const activity: android.app.Activity = application.android.foregroundActivity || application.android.startActivity;
    if (android.os.Build.VERSION.SDK_INT < 23) {
        return Promise.resolve(
            activity.checkPermission(permission, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED
                ? PermissionStatus.GRANTED
                : PermissionStatus.DENIED
        );
    }
    if (activity.checkSelfPermission(permission) === android.content.pm.PackageManager.PERMISSION_GRANTED) {
        return Promise.resolve(PermissionStatus.GRANTED);
    }

    return new Promise((resolve, reject) => {
        try {
            const requestCode = mRequestCode++;
            activity.requestPermissions([permission], requestCode);
            application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, (args: application.AndroidActivityRequestPermissionsEventData) => {
                if (args.requestCode === requestCode) {
                    if (args.grantResults.length > 0 && args.grantResults[0] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        resolve(PermissionStatus.GRANTED);
                    } else {
                        if (activity.shouldShowRequestPermissionRationale(permission)) {
                            resolve(PermissionStatus.DENIED);
                        } else {
                            resolve(PermissionStatus.NEVER_ASK_AGAIN);
                        }
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function requestMultiplePermissions(permissions: string[]): Promise<{ [permission: string]: Status }> {
    const grantedPermissions = {};
    const permissionsToCheck = [];
    let checkedPermissionsCount = 0;

    const context: android.content.Context = application.android.foregroundActivity || application.android.startActivity;

    for (let i = 0; i < permissions.length; i++) {
        const perm = permissions[i];

        if (android.os.Build.VERSION.SDK_INT < 23) {
            grantedPermissions[perm] =
                context.checkPermission(perm, android.os.Process.myPid(), android.os.Process.myUid()) === android.content.pm.PackageManager.PERMISSION_GRANTED
                    ? PermissionStatus.GRANTED
                    : PermissionStatus.DENIED;
            checkedPermissionsCount++;
        } else if (context.checkSelfPermission(perm) === android.content.pm.PackageManager.PERMISSION_GRANTED) {
            grantedPermissions[perm] = PermissionStatus.GRANTED;
            checkedPermissionsCount++;
        } else {
            permissionsToCheck.push(perm);
        }
    }
    if (permissions.length === checkedPermissionsCount) {
        return Promise.resolve(grantedPermissions);
    }

    const activity: android.app.Activity = application.android.foregroundActivity || application.android.startActivity;
    return new Promise((resolve, reject) => {
        try {
            const requestCode = mRequestCode++;
            activity.requestPermissions(permissionsToCheck, requestCode);
            application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, (args: application.AndroidActivityRequestPermissionsEventData) => {
                if (args.requestCode === requestCode) {
                    const results = args.grantResults;
                    console.log('did requestMultiplePermissions', permissionsToCheck, results, results.length);
                    for (let j = 0; j < permissionsToCheck.length; j++) {
                        const permission = permissionsToCheck[j];
                        if (results.length > j && results[j] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                            grantedPermissions[permission] = PermissionStatus.GRANTED;
                        } else {
                            if (activity.shouldShowRequestPermissionRationale(permission)) {
                                grantedPermissions[permission] = PermissionStatus.DENIED;
                            } else {
                                grantedPermissions[permission] = PermissionStatus.NEVER_ASK_AGAIN;
                            }
                        }
                    }
                    resolve(grantedPermissions);
                }

                // if (args.grantResults.length > 0 && args.grantResults[0] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                //     resolve(PermissionStatus.GRANTED);
                // } else {
                //     if (activity.shouldShowRequestPermissionRationale(permission)) {
                //         resolve(PermissionStatus.DENIED);
                //     } else {
                //         resolve(PermissionStatus.NEVER_ASK_AGAIN);
                //     }
                // }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function shouldShowRequestPermissionRationale(permission: string) {
    if (android.os.Build.VERSION.SDK_INT < 23) {
        return Promise.resolve(false);
    }
    const activity: android.app.Activity = application.android.foregroundActivity || application.android.startActivity;
    try {
        return Promise.resolve(activity.shouldShowRequestPermissionRationale(permission));
    } catch (e) {
        return Promise.reject(e);
    }
}

export function canOpenSettings() {
    return Promise.resolve(false);
}

export function openSettings() {
    return Promise.reject(new Error("'openSettings' is deprecated on android"));
}

export function getTypes() {
    return Object.keys(permissionTypes);
}

export function check(permission: string, options?: CheckOptions) {
    if (!permissionTypes[permission]) {
        const error = new Error(`ReactNativePermissions: ${permission} is not a valid permission type on Android`);

        return Promise.reject(error);
    }

    return PermissionsAndroid.check(permissionTypes[permission]).then(isAuthorized => {
        if (isAuthorized) {
            return Promise.resolve('authorized' as Status);
        }

        return getDidAskOnce(permission).then(didAsk => {
            if (didAsk) {
                return shouldShowRequestPermissionRationale(permissionTypes[permission]).then(shouldShow => (shouldShow ? 'denied' : 'restricted') as Status);
            }

            return Promise.resolve('undetermined' as Status);
        });
    });
}

export function request(permission: string, options?: RequestOptions) {
    const types = permissionTypes[permission];
    if (!types) {
        const error = new Error(`ReactNativePermissions: ${permission} is not a valid permission type on Android`);

        return Promise.reject(error);
    }

    const rationale = typeof options === 'string' ? undefined : options && options.rationale;
    if (Array.isArray(types)) {
        return requestMultiplePermissions(types);
    }
    return PermissionsAndroid.request(types, rationale).then(result => {
        // PermissionsAndroid.request() to native module resolves to boolean
        // rather than string if running on OS version prior to Android M
        if (typeof result === 'boolean') {
            return result ? 'authorized' : 'denied';
        }

        return setDidAskOnce(permission).then(() => PermissionStatus[result]);
    });
}

export function checkMultiple(permissions: string[]) {
    return Promise.all(permissions.map(permission => this.check(permission))).then(result =>
        result.reduce((acc, value, index) => {
            const name = permissions[index];
            acc[name] = value;
            return acc;
        }, {})
    );
}
