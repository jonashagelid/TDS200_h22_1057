<script setup lang="ts">
import { authServce } from '@/services/directus.services';
import {  IonInput, IonLabel, IonListHeader, IonItem, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButtons, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';



const router = useRouter();
const registerMode = ref(false);

const setRegisterMode = () => {
    if(registerMode.value == false){
        registerMode.value = true;
        console.log(registerMode.value)
    } else {
        registerMode.value = false;
        console.log(registerMode.value)
    }
}

const userDetails = ref({
    firstName: '',
    email: '',
    password: ''
});

const login = async () => {
    try{
        await authServce.login(userDetails.value.email, userDetails.value.password);
        router.replace('/');
    } catch (error) {
        console.log(error);
    }
}

const register = async () => {
    try{
        const wasRegistered = await authServce.register(userDetails.value.firstName, userDetails.value.email, userDetails.value.password);
        if(wasRegistered){
            await login();
        }
    }catch(error){
        console.log(error);
    }
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
        <ion-list-header v-if="registerMode">
            <label>Register new user</label>
        </ion-list-header>
        <ion-list-header v-else>
            <label>Login</label>
        </ion-list-header>
        <ion-item lines="none" v-if="registerMode">
            <IonButton fill="outline" @click="setRegisterMode">Already registered?</IonButton>
        </ion-item>
        <ion-item lines="none" v-else>
            <IonButton fill="outline" @click="setRegisterMode">New user?</IonButton>
        </ion-item>

        <ion-item v-if="registerMode">
            <ion-label>Name:</ion-label>
            <ion-input v-model="userDetails.firstName"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label>Email:</ion-label>
            <ion-input type="email" v-model="userDetails.email"></ion-input>
        </ion-item>

        <ion-item>
            <ion-label>Password:</ion-label>
            <ion-input type="password" v-model="userDetails.password"></ion-input>
        </ion-item>

        <IonButton fill="outline" v-if="registerMode" @click="register">
            Register user
        </IonButton>

        <IonButton fill="outline" v-else @click="login">
            Log in
        </IonButton>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
