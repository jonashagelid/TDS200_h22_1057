<script setup lang="ts">
import { authServce, directus } from '@/services/directus.services';
import {  IonInput, toastController, IonTextarea, IonLabel, IonListHeader, IonItem, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButtons, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Camera, CameraResultType } from '@capacitor/camera'
import { is } from '@babel/types';


const isUploading = ref(false);

//object template
const newListing = ref({
    title: "",
    price: "",
    platform: "",
    condition: "",
    description: "",
    image: "",
    address: ""
});


//Create new post in DB
const createNewListing = async () => {
    console.log(newListing.value)

    //checks for image in new listing
    if(!newListing.value.image){
        alert("You need to upload an image");
        return;
    }
    //if image success get value from input fields and post to db
    try{
        isUploading.value = true;
        const response = await fetch(newListing.value.image);
        const imageBlob = await response.blob();

        const formData = new FormData();
        formData.append('file', imageBlob);
        const fileUpload = await directus.files.createOne(formData);

        if(fileUpload){
            await directus.items('retro_games').createOne({
                title: newListing.value.title,
                price: newListing.value.price,
                platform: newListing.value.platform,
                condition: newListing.value.condition,
                description: newListing.value.description,
                address: newListing.value.address,
                image: fileUpload.id
            });

            const successToast = await toastController.create({
                message: 'Listing created',
                duration: 2000,
                position: 'bottom',
                color: 'success'
            });

            await successToast.present();
        }


        isUploading.value = false;
    }catch(error){
        const errorToast = await toastController.create({
            message: 'Listing failed',
            duration: 2000,
            position: 'bottom',
            color: 'danger'
        });
        console.log(error)
        await errorToast.present();
        isUploading.value = false;
    }
}

//opens camera and gets image
const openCamera = async () => {
    const img = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri
    });
    if(img.webPath){
        newListing.value.image = img.webPath;
    }
}

//clears image from
const removeImage = () => {
    newListing.value.image = '';
}

</script>


<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Retro gamestop</ion-title>
        <ion-buttons slot="end">
          <ion-button :router-link="'/home'">Home</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
            <label>List new game</label>
        </ion-list-header>

        <ion-item position="floating">
            <ion-buttons v-if="!newListing.image">
                <ion-button @click="openCamera">Select an image</ion-button>
            </ion-buttons>
            <img v-if="newListing.image" :src="newListing.image" @click="openCamera"/>
        </ion-item>
        <ion-item>
            <ion-buttons v-if="newListing.image">
                <ion-button @click="removeImage">Remove</ion-button>
            </ion-buttons>
        </ion-item>


        <ion-item>
            <ion-label position="floating">Title:</ion-label>
            <ion-input type="text" v-model="newListing.title"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label position="floating">Price:</ion-label>
            <ion-input type="text" v-model="newListing.price"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label position="floating">Platform:</ion-label>
            <ion-input type="text" v-model="newListing.platform"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label position="floating">Condition:</ion-label>
            <ion-input type="text" v-model="newListing.condition"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label position="floating">Address:</ion-label>
            <ion-input type="text" v-model="newListing.address"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label position="floating">Description:</ion-label>
            <ion-textarea type="text" v-model="newListing.description"></ion-textarea>
        </ion-item>

        <IonButton fill="outline" @click="createNewListing" :router-link="'/home'">
            Submit
        </IonButton>




      </ion-list>
    </ion-content>
  </ion-page>
</template>
