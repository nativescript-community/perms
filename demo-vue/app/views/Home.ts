import {Permissions, check, request} from '@nativescript-community/perms';
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
                , [android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.READ_EXTERNAL_STORAGE]
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
                console.log('checkPermission', perm);
                const result = await check(perm, {type:'none'});
                alert(JSON.stringify(result));
            } catch(err) {
                console.error(err);
                alert(err);
            }

        },
        async requestPermission(perm: Permissions) {
            try {
                console.log('requestPermission', perm);
                const result = await request(perm, {type:'none'});
                alert(JSON.stringify(result));
            } catch(err) {
                console.error(err);
                alert(err);
            }
        }
    }
};
