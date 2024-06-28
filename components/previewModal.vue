<template>
    <div class="preview-modal">
        <Alert
            :show="alert.isShowing"
            :message="alert.message"
            :type="alert.type"
        />
        <img :src="photo.fileb64String"/>
        <template v-if="photo.href">
            <a :href="photo.href" class="download" @click="download">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
            </a>
        </template>
        <div class="close" @click="$emit('clearPhotoInspect')"><b>X</b></div>
    </div>
</template>

<script lang="ts">
export default {
    data () {
        return {
            alert: {
                isShowing: false,
                message: '',
                type: 'info'
            }
        }
    },
    emits:['clearPhotoInspect'],
    props: ['photo'],
    methods: {
        download(){
            // this needs to emit to parent the show alert so the alert is shown on parent as this component is being destroyed
            setTimeout(() => {
                this.showAlert('Downloaded!', 'success', 2000);
                setTimeout(() => {
                    this.$emit('clearPhotoInspect')
                }, 2500);
            }, Math.floor(Math.random() * 1500) + 500);
        },
        showAlert(msg: string, type: string, duration: number) {
            // TODO need to put this inside alert component and have multiple alerts rendered instead of one alert changing.
            this.alert.message = msg;
            this.alert.type = type;
            this.alert.isShowing = true;
            setTimeout(() => {
                this.alert.isShowing = false;
                setTimeout(() => {
                this.alert.message = "";
                this.alert.type = "info";
                }, 100);
            }, duration || 5000);
        },
    }
}
</script>

<style>
.preview-modal {
    position: fixed;
    top: 0;
    left:0;
    height: 100vh !important;
    width: 100vw !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.8);
    z-index: 999;
}
.close {
    position: absolute;
    font-size: 16pt;
    top: 1.5rem;
    right:1.5rem;
    cursor:pointer;
    height:50px;
    width:50px;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
}
.download {
    position: absolute;
    font-size: 16pt;
    top: 1.5rem;
    right:5.5rem;
    cursor:pointer;
    height:50px;
    width:50px;
    border-radius: 50%;
    background-color: #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>