import {Permissions, check, request} from '@nativescript-community/perms';
import { Device, Utils } from '@nativescript/core';
const sdkVersion = parseInt(Device.sdkVersion, 10);
export default {
    name: 'Home',
    template: `
    <Page>
      <ActionBar title="Extendedinfo Demo">
      </ActionBar>
      <ListView ref="listView"
          for="perm in permissions"
          rowHeight="70"
          @itemTap="goToExample">
        <v-template>
          <GridLayout  columns="*,auto,auto" padding="10" class="item" orientation="horizontal">
            <Label :text="perm" fontSize="17" verticalAlignment="center"></Label>
            <Button col="1" text="check" fontSize="17" verticalAlignment="center" @tap="checkPermission(perm)"/>
            <Button col="2" text="request" fontSize="17" verticalAlignment="center" @tap="requestPermission(perm)"/>
          </GridLayout>
        </v-template>
      </ListView>
    </Page>
    `,
    data() {
        return {
            permissions: ['location'
                , 'camera'
                , 'microphone'
                , 'photo'
                , 'contacts'
                , 'event'
                , 'reminder'
                , 'bluetooth'
                , 'bluetoothScan'
                , 'notification'
                , 'backgroundRefresh'
                , 'speechRecognition'
                , 'mediaLibrary'
                , 'motion'
                , 'location'
                , 'callPhone'
                , 'readSms'
                , 'receiveSms']
        };
    },
    mounted() {
        // worker.onmessage = msg => {
        //     const dict = valueFromPointerNumber(NSDictionary, msg.data.value.dictionaryPtr) as NSDictionary<string, any>;
        //     const type = dict.objectForKey('type') as string;
        //     console.log('postMessageToWorker', type);
        //     switch (type) {
        //         case 'image':
        //             this.showImage(dict.objectForKey('data'));
        //             break;
        //         default:
        //             break;
        //     }
        //     (dict as any).release();
        // };
    },
    methods: {
        async checkPermission(perm: Permissions) {

            try {
                const result = await check(perm, {type:'none'});
                alert(JSON.stringify(result));
            } catch(err) {
                console.error(err);
                alert(err);
            }

        },
        async requestPermission(perm: Permissions) {
            try {
                if (__ANDROID__ && perm === 'notification' ) {
                    // create notification channel
                    if (sdkVersion >= 26) {
                        const context = Utils.ad.getApplicationContext();
                        // API level 26 ("Android O") supports notification channels.
                        const service = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager;

                        // create channel
                        const channel = new android.app.NotificationChannel('test_channel', 'test_channel', android.app.NotificationManager.IMPORTANCE_MIN);
                        channel.setDescription('test');
                        service.createNotificationChannel(channel);
                    }
                }
                const result = await request(perm, {type:'none'});
                alert(JSON.stringify(result));
            } catch(err) {
                console.error(err);
                alert(err);
            }
        }
    }
};
