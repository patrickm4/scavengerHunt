<template>
    <div class="flex justify-center w-full alert-box" :class="transitionState">
        <div class="alert-msg-box flex justify-center items-center text-slate-50" :class="messageBoxStyle">{{ message }}</div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        message: {
            type: String,
            default: 'No Message'
        },
        show: Boolean,
        type: String
    },
    computed: {
        transitionState() {
            return this.show ? 'alert-show' : 'alert-hidden'
        },
        messageBoxStyle() {
            if (this.type) {
                return this.type.toLowerCase()
            } else {
                return 'info'
            }
        }
    }
}
</script>

<style>
.alert-hidden {
    top: -3.5rem;
}
.alert-show {
    top: 0rem;
}
.alert-box {
    position: absolute;
    transition: top 0.15s ease 0s; 
    left:0;
    width:100%;
    height:3rem;
    margin-top: 0.5rem;
}
.alert-msg-box {
    border-radius: 0.375rem;
    width: 98%;
}
</style>