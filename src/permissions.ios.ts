import { CheckOptions, RequestOptions } from './permissions';
import { CLog, CLogTypes } from './permissions.common';
export * from './permissions.common';

export namespace PermissionsIOS {
    export enum Status {
        Undetermined = 'undetermined',
        Denied = 'denied',
        Authorized = 'authorized',
        Restricted = 'restricted'
    }
    namespace NSPLocation {
        function getStatusFromCLAuthorizationStatus(status: CLAuthorizationStatus, type?: string): Status {
            switch (status) {
                case CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedAlways:
                    return Status.Authorized;
                case CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedWhenInUse:
                    return type === 'always' ? Status.Denied : Status.Authorized;
                case CLAuthorizationStatus.kCLAuthorizationStatusDenied:
                    return Status.Denied;
                case CLAuthorizationStatus.kCLAuthorizationStatusRestricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }
        export function getStatusForType(type?: string): Status {
            const status2 = CLLocationManager.authorizationStatus();
            return getStatusFromCLAuthorizationStatus(status2, type);
        }
        let locationManager: CLLocationManager;
        let locationManagerDelegate: CLLocationManagerDelegateImpl;
        export type SubCLLocationManagerDelegate = Partial<CLLocationManagerDelegate>;
        export class CLLocationManagerDelegateImpl extends NSObject implements CLLocationManagerDelegate {
            public static ObjCProtocols = [CLLocationManagerDelegate];

            private subDelegates: SubCLLocationManagerDelegate[];

            public addSubDelegate(delegate: SubCLLocationManagerDelegate) {
                if (!this.subDelegates) {
                    this.subDelegates = [];
                }
                const index = this.subDelegates.indexOf(delegate);
                if (index === -1) {
                    this.subDelegates.push(delegate);
                }
            }

            public removeSubDelegate(delegate: SubCLLocationManagerDelegate) {
                const index = this.subDelegates.indexOf(delegate);
                if (index !== -1) {
                    this.subDelegates.splice(index, 1);
                }
            }
            static new(): CLLocationManagerDelegateImpl {
                return super.new() as CLLocationManagerDelegateImpl;
            }
            public initDelegate() {
                this.subDelegates = [];
                return this;
            }
            locationManagerDidChangeAuthorizationStatus(manager, status: CLAuthorizationStatus) {
                this.subDelegates &&
                    this.subDelegates.forEach(d => {
                        if (d.locationManagerDidChangeAuthorizationStatus) {
                            d.locationManagerDidChangeAuthorizationStatus(manager, status);
                        }
                    });
            }
        }
        export function request(type): Promise<Status> {
            const status = getStatusForType(undefined);
            CLog(CLogTypes.info, 'NSPLocation request', type, status);
            if (status === Status.Undetermined) {
                return new Promise((resolve, reject) => {
                    if (!locationManager) {
                        locationManager = CLLocationManager.new();
                        locationManagerDelegate = locationManager.delegate = CLLocationManagerDelegateImpl.new().initDelegate();
                    }
                    const subD = {
                        locationManagerDidChangeAuthorizationStatus: (manager, status: CLAuthorizationStatus) => {
                            CLog(CLogTypes.info, 'locationManagerDidChangeAuthorizationStatus', status);
                            if (status !== CLAuthorizationStatus.kCLAuthorizationStatusNotDetermined) {
                                if (locationManager) {
                                    (locationManager.delegate as CLLocationManagerDelegateImpl).removeSubDelegate(subD);
                                    locationManager.delegate = null;
                                    locationManager = null;
                                    locationManagerDelegate = null;
                                }
                                resolve(getStatusFromCLAuthorizationStatus(status, type));
                                // } else {
                                // reject('kCLAuthorizationStatusNotDetermined');
                            }
                        }
                    };
                    (locationManager.delegate as CLLocationManagerDelegateImpl).addSubDelegate(subD);
                    try {
                        CLog(CLogTypes.info, 'NSPLocation requestAuthorization', type);
                        if (type === 'always') {
                            locationManager.requestAlwaysAuthorization();
                        } else {
                            locationManager.requestWhenInUseAuthorization();
                        }
                    } catch (e) {
                        reject(e);
                        if (locationManager) {
                            (locationManager.delegate as CLLocationManagerDelegateImpl).removeSubDelegate(subD);
                            locationManager.delegate = null;
                            locationManager = null;
                        }
                    }
                });
            } else {
                if (CLLocationManager.authorizationStatus() === CLAuthorizationStatus.kCLAuthorizationStatusAuthorizedWhenInUse && type === 'always') {
                    return Promise.resolve(Status.Denied);
                } else {
                    return Promise.resolve(status);
                }
            }
        }
    }
    namespace NSPBluetooth {
        export function getStatus(): Status {
            const status2 = CBPeripheralManager.authorizationStatus();
            switch (status2) {
                case CBPeripheralManagerAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case CBPeripheralManagerAuthorizationStatus.Denied:
                    return Status.Denied;
                case CBPeripheralManagerAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }
        export type SubCBPeripheralManagerDelegate = Partial<CBPeripheralManagerDelegate>;
        export class CBPeripheralManagerDelegateImpl extends NSObject implements CBPeripheralManagerDelegate {
            public static ObjCProtocols = [CBPeripheralManagerDelegate];

            private subDelegates: SubCBPeripheralManagerDelegate[];

            public addSubDelegate(delegate: SubCBPeripheralManagerDelegate) {
                const index = this.subDelegates.indexOf(delegate);
                if (index === -1) {
                    this.subDelegates.push(delegate);
                }
            }

            public removeSubDelegate(delegate: SubCBPeripheralManagerDelegate) {
                const index = this.subDelegates.indexOf(delegate);
                if (index !== -1) {
                    this.subDelegates.splice(index, 1);
                }
            }
            static new(): CBPeripheralManagerDelegateImpl {
                return super.new() as CBPeripheralManagerDelegateImpl;
            }
            public initDelegate(): CBPeripheralManagerDelegateImpl {
                this.subDelegates = [];
                return this;
            }
            peripheralManagerDidUpdateState(peripheralManager) {
                this.subDelegates.forEach(d => {
                    if (d.peripheralManagerDidUpdateState) {
                        d.peripheralManagerDidUpdateState(peripheralManager);
                    }
                });
            }
        }
        let peripheralManager: CBPeripheralManager;
        export function request(): Promise<Status> {
            const status = getStatus();
            if (status === Status.Undetermined) {
                return new Promise((resolve, reject) => {
                    if (!peripheralManager) {
                        peripheralManager = CBPeripheralManager.new();
                        peripheralManager.delegate = CBPeripheralManagerDelegateImpl.new().initDelegate();
                    }
                    const subD = {
                        peripheralManagerDidUpdateState: peripheralManager => {
                            if (peripheralManager) {
                                peripheralManager.stopAdvertising();
                                (peripheralManager.delegate as CBPeripheralManagerDelegateImpl).removeSubDelegate(subD);
                                peripheralManager.delegate = null;
                                peripheralManager = null;
                            }
                            // for some reason, checking permission right away returns denied. need to wait a tiny bit
                            setTimeout(() => {
                                resolve(getStatus());
                            }, 100);
                        }
                    };
                    (peripheralManager.delegate as CBPeripheralManagerDelegateImpl).addSubDelegate(subD);
                    try {
                        peripheralManager.startAdvertising(null);
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                return Promise.resolve(status);
            }
        }
    }
    namespace NSPAudioVideo {
        function typeFromString(value: string) {
            if (value === 'audio') {
                return AVMediaTypeAudio;
            } else {
                return AVMediaTypeVideo;
            }
        }
        export function getStatus(type?: string): Status {
            const status = AVCaptureDevice.authorizationStatusForMediaType(typeFromString(type));
            switch (status) {
                case AVAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case AVAuthorizationStatus.Denied:
                    return Status.Denied;
                case AVAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(type): Promise<Status> {
            return new Promise((resolve, reject) => {
                AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(type, granted => resolve(getStatus(type)));
            });
        }
    }
    namespace NSPSpeechRecognition {
        export function getStatus(): Status {
            const status = SFSpeechRecognizer.authorizationStatus();
            switch (status) {
                case SFSpeechRecognizerAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case SFSpeechRecognizerAuthorizationStatus.Denied:
                    return Status.Denied;
                case SFSpeechRecognizerAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(): Promise<Status> {
            return new Promise(resolve => {
                SFSpeechRecognizer.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPPhoto {
        export function getStatus(): Status {
            const status = PHPhotoLibrary.authorizationStatus();
            switch (status) {
                case PHAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case PHAuthorizationStatus.Denied:
                    return Status.Denied;
                case PHAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(): Promise<Status> {
            return new Promise(resolve => {
                PHPhotoLibrary.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPMotion {
        let status: Status = Status.Undetermined;
        export function getStatus(): Status {
            if (status === Status.Undetermined) {
                const cmStatus = (CMMotionActivityManager.authorizationStatus as any) as CMAuthorizationStatus;
                switch (cmStatus) {
                    case CMAuthorizationStatus.Authorized:
                        status = Status.Authorized;
                        break;
                    case CMAuthorizationStatus.Denied:
                        status = Status.Denied;
                        break;
                    case CMAuthorizationStatus.Restricted:
                        status = Status.Restricted;
                        break;
                }
            }
            return status;
        }

        export function request(): Promise<Status> {
            if (status === Status.Undetermined) {
                return new Promise(resolve => {
                    let activityManager = CMMotionActivityManager.new();
                    let motionActivityQueue = NSOperationQueue.new();
                    CLog(CLogTypes.info, 'NSPMotion request', status);
                    activityManager.queryActivityStartingFromDateToDateToQueueWithHandler(NSDate.distantPast, new Date(), motionActivityQueue, (activities, error) => {
                        if (error) {
                            status = Status.Denied;
                        } else if (activities || !error) {
                            status = Status.Authorized;
                        }
                        CLog(CLogTypes.info, 'NSPMotion got response', activities, error, status, getStatus());
                        resolve(status);
                        activityManager = null;
                        motionActivityQueue = null;
                    });
                });
            } else {
                return Promise.resolve(status);
            }
        }
    }
    namespace NSPMediaLibrary {
        export function getStatus(): Status {
            const status = MPMediaLibrary.authorizationStatus();
            switch (status) {
                case MPMediaLibraryAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case MPMediaLibraryAuthorizationStatus.Denied:
                    return Status.Denied;
                case MPMediaLibraryAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(): Promise<Status> {
            return new Promise(resolve => {
                MPMediaLibrary.requestAuthorization(() => resolve(getStatus()));
            });
        }
    }
    namespace NSPNotification {
        const NSPDidAskForNotification = 'NSPDidAskForNotification';
        export function getStatus(): Status {
            const didAskForPermission = NSUserDefaults.standardUserDefaults.boolForKey(NSPDidAskForNotification);
            const isEnabled = UIApplication.sharedApplication.currentUserNotificationSettings.types !== UIUserNotificationType.None;

            if (isEnabled) {
                return Status.Authorized;
            } else {
                return didAskForPermission ? Status.Denied : Status.Undetermined;
            }
        }

        export function request(types: UIUserNotificationType): Promise<Status> {
            const status = getStatus();

            if (status === Status.Undetermined) {
                return new Promise(resolve => {
                    const observer = function() {
                        resolve(getStatus());
                        NSNotificationCenter.defaultCenter.removeObserver(observer);
                    };
                    NSNotificationCenter.defaultCenter.addObserverForNameObjectQueueUsingBlock(UIApplicationDidBecomeActiveNotification, null, null, observer);

                    const settings = UIUserNotificationSettings.settingsForTypesCategories(types, null);
                    UIApplication.sharedApplication.registerUserNotificationSettings(settings);
                    UIApplication.sharedApplication.registerForRemoteNotifications();

                    NSUserDefaults.standardUserDefaults.setBoolForKey(true, NSPDidAskForNotification);
                    NSUserDefaults.standardUserDefaults.synchronize();
                });
            } else {
                return Promise.resolve(status);
            }
        }
    }
    namespace NSPContacts {
        export function getStatus(): Status {
            const status = CNContactStore.authorizationStatusForEntityType(CNEntityType.Contacts);
            switch (status) {
                case CNAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case CNAuthorizationStatus.Denied:
                    return Status.Denied;
                case CNAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(): Promise<Status> {
            return new Promise(resolve => {
                const contactStore = CNContactStore.new();
                contactStore.requestAccessForEntityTypeCompletionHandler(CNEntityType.Contacts, () => resolve(getStatus()));
            });
        }
    }
    namespace NSPBackgroundRefresh {
        export function getStatus(): Status {
            const status = UIApplication.sharedApplication.backgroundRefreshStatus;
            switch (status) {
                case UIBackgroundRefreshStatus.Available:
                    return Status.Authorized;
                case UIBackgroundRefreshStatus.Denied:
                    return Status.Denied;
                case UIBackgroundRefreshStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(): Promise<Status> {
            return new Promise(resolve => {
                const contactStore = CNContactStore.new();
                contactStore.requestAccessForEntityTypeCompletionHandler(CNEntityType.Contacts, () => resolve(getStatus()));
            });
        }
    }
    namespace NSPEvent {
        function typeFromString(value: string) {
            if (value === 'reminder') {
                return EKEntityType.Reminder;
            } else {
                return EKEntityType.Event;
            }
        }
        export function getStatus(type?: string): Status {
            const status = EKEventStore.authorizationStatusForEntityType(typeFromString(type));
            switch (status) {
                case EKAuthorizationStatus.Authorized:
                    return Status.Authorized;
                case EKAuthorizationStatus.Denied:
                    return Status.Denied;
                case EKAuthorizationStatus.Restricted:
                    return Status.Restricted;
                default:
                    return Status.Undetermined;
            }
        }

        export function request(type?: string): Promise<Status> {
            return new Promise(resolve => {
                const aStore = EKEventStore.new();
                aStore.requestAccessToEntityTypeCompletion(typeFromString(type), () => resolve(getStatus(type)));
            });
        }
    }

    export enum NSType {
        Unknown,
        Location = 'location',
        Camera = 'camera',
        Microphone = 'microphone',
        Photo = 'photo',
        Contacts = 'contacts',
        Event = 'event',
        Reminder = 'reminder',
        Bluetooth = 'bluetooth',
        Notification = 'notification',
        BackgroundRefresh = 'backgroundRefresh',
        NSPTypeSpeechRecognition = 'speechRecognition',
        MediaLibrary = 'mediaLibrary',
        Motion = 'motion'
    }

    export function openSettings() {
        return new Promise((resolve, reject) => {
            const center = NSNotificationCenter.defaultCenter;
            const observer = function(notif) {
                resolve(true);
                center.removeObserver(observer);
            };
            center.addObserverForNameObjectQueueUsingBlock(UIApplicationDidBecomeActiveNotification, null, null, observer);
            UIApplication.sharedApplication.openURL(NSURL.URLWithString(UIApplicationOpenSettingsURLString));
        });
    }
    export function canOpenSettings() {
        return Promise.resolve(UIApplicationOpenSettingsURLString !== null);
    }
    export function getPermissionStatus(type, json): Promise<Status> {
        let status;
        CLog(CLogTypes.info, `nativescript-perms: getPermissionStatus ${type}`);

        switch (type) {
            case NSType.Location: {
                // NSString *locationPermissionType = [RCTConvert NSString:json];
                status = NSPLocation.getStatusForType(json);
                break;
            }
            case NSType.Camera:
                status = NSPAudioVideo.getStatus('video');
                break;
            case NSType.Microphone:
                status = NSPAudioVideo.getStatus('audio');
                break;
            case NSType.Photo:
                status = NSPPhoto.getStatus();
                break;
            case NSType.Contacts:
                status = NSPContacts.getStatus();
                break;
            case NSType.Event:
                status = NSPEvent.getStatus('event');
                break;
            case NSType.Reminder:
                status = NSPEvent.getStatus('reminder');
                break;
            case NSType.Bluetooth:
                status = NSPBluetooth.getStatus();
                break;
            case NSType.Notification:
                status = NSPNotification.getStatus();
                break;
            case NSType.BackgroundRefresh:
                status = NSPBackgroundRefresh.getStatus();
                break;
            case NSType.NSPTypeSpeechRecognition:
                status = NSPSpeechRecognition.getStatus();
                break;
            case NSType.MediaLibrary:
                status = NSPMediaLibrary.getStatus();
                break;
            case NSType.Motion:
                status = NSPMotion.getStatus();
                break;
            default:
                break;
        }

        return Promise.resolve(status);
    }
    export function requestPermission(type, json): Promise<Status> {
        CLog(CLogTypes.info, `nativescript-perms: requestPermission ${type}`);
        switch (type) {
            case NSType.Location:
                return NSPLocation.request(json);
            case NSType.Camera:
                return NSPAudioVideo.request('video');
            case NSType.Microphone:
                return NSPAudioVideo.request('audio');
            case NSType.Photo:
                return NSPPhoto.request();
            case NSType.Contacts:
                return NSPContacts.request();
            case NSType.Event:
                return NSPEvent.request('event');
            case NSType.Reminder:
                return NSPEvent.request('reminder');
            case NSType.Bluetooth:
                return NSPBluetooth.request();
            case NSType.Notification:
                let types: UIUserNotificationType;
                const typeStrings: string[] = json;
                if (typeStrings.indexOf('alert') !== -1) {
                    types = types | UIUserNotificationType.Alert;
                }
                if (typeStrings.indexOf('badge') !== -1) {
                    types = types | UIUserNotificationType.Badge;
                }
                if (typeStrings.indexOf('sound') !== -1) {
                    types = types | UIUserNotificationType.Sound;
                }
                return NSPNotification.request(types);
            case NSType.NSPTypeSpeechRecognition:
                return NSPSpeechRecognition.request();
            case NSType.MediaLibrary:
                return NSPMediaLibrary.request();
            case NSType.Motion:
                return NSPMotion.request();
            default:
                return Promise.reject(NSType.Unknown);
        }
    }
}

const DEFAULTS = {
    location: 'whenInUse',
    notification: ['alert', 'badge', 'sound']
};

const permissionTypes = Object.keys(PermissionsIOS.NSType).map(k => PermissionsIOS.NSType[k]) as string[];

export function canOpenSettings() {
    return PermissionsIOS.canOpenSettings();
}

export function openSettings() {
    return PermissionsIOS.openSettings();
}

export function getTypes() {
    return permissionTypes;
}

export function check(permission: string, options?: CheckOptions) {
    CLog(CLogTypes.info, `nativescript-perms: check ${permission}`);
    if (permissionTypes.indexOf(permission) === -1) {
        // const error = new Error(`ReactNativePermissions: ${permission} is not a valid permission type on iOS`);

        // return Promise.reject(error);
        CLog(CLogTypes.warning, `nativescript-perms: ${permission} is not a valid permission type on iOS`);
        // const error = new Error(`nativescript-perms: ${permission} is not a valid permission type on Android`);

        return Promise.resolve('authorized');
    }

    let type;

    if (typeof options === 'string') {
        type = options;
    } else if (options && options.type) {
        type = options.type;
    }

    return PermissionsIOS.getPermissionStatus(permission, type || DEFAULTS[permission]);
}

export function request(permission: string, options?: RequestOptions) {
    CLog(CLogTypes.info, `nativescript-perms: request ${permission}`);
    if (permissionTypes.indexOf(permission) === -1) {
        // const error = new Error(`ReactNativePermissions: ${permission} is not a valid permission type on iOS`);
        CLog(CLogTypes.warning, `nativescript-perms: ${permission} is not a valid permission type on iOS`);

        return Promise.resolve('authorized');
    }

    if (permission === 'backgroundRefresh') {
        const error = new Error('nativescript-perms: You cannot request backgroundRefresh');

        return Promise.reject(error);
    }

    let type;

    if (typeof options === 'string') {
        type = options;
    } else if (options && options.type) {
        type = options.type;
    }

    return PermissionsIOS.requestPermission(permission, type || DEFAULTS[permission]);
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
