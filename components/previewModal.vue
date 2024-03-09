<template>
    <div class="preview-modal">
        <img :src="photo.fileb64String"/>
        <div class="close" @click="$emit('clearPhotoInspect')"><b>X</b></div>
    </div>
</template>

<script lang="ts">
export default {
    emits:['clearPhotoInspect'],
    props: ['photo'],
}
</script>

<style>
.preview-modal {
    position: absolute;
    top: 0;
    left:0;
    height: 100vh !important;
    width: 100vw !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.8);
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
</style>