<script setup lang="ts">

import { directus } from '@/services/directus.services';
import { IonContent, IonList, IonListHeader, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar, IonCardContent, IonCardSubtitle, IonButtons, IonButton, onIonViewDidEnter } from '@ionic/vue';
import { ref, resolveDirective } from 'vue';


const userInfo = ref({});




onIonViewDidEnter( () =>{
  currentUser();
});


//Querys the server for current logged in user and saves to object
const currentUser = async () => {
  const userResponse = directus.users.me.read({
    fields: ['email', 'first_name']
  }).then(response => {
    userInfo.value=response
  });

  console.log(userResponse)
  console.log(userInfo)
}


//Logout
const logout = async () => {
  try{
    return await directus.auth.logout();
  } catch (error) {
    console.log(error);
  }
};

</script>


<template>
  <ion-page id="main-content">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title slot="start">Retro gamestop</ion-title>
      </ion-toolbar>
    </ion-header>

    
    <ion-content :fullscreen="true">
        <ion-card-content>
          <ion-list>
            <ion-list-header>
              User profile
            </ion-list-header>
            <ion-card-subtitle>Name: {{userInfo.first_name}}</ion-card-subtitle>
            <ion-card-subtitle>Email: {{userInfo.email}}</ion-card-subtitle>
            <ion-buttons class="logout-btn">
              <ion-button fill="outline" @click="logout" :router-link="'/home'">Logout</ion-button>
            </ion-buttons>
          </ion-list>
        </ion-card-content>
    </ion-content>

    <ion-footer :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="end">
            <ion-button :router-link="'/home'">Home</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>


<style>
  ion-list-header {
    font-weight: bolder;
    font-size: larger;
    text-align: center;
  }

  .logout-btn {
    justify-content: center;
  }
</style>