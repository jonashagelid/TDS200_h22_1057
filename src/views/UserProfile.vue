<script setup lang="ts">

import { directus } from '@/services/directus.services';
import { IonContent, IonList, IonListHeader, IonFooter, IonMenuButton, IonMenuToggle, IonAccordion, IonMenu, IonModal, IonLabel, IonTextarea, IonItem, IonRefresher, IonRefresherContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButtons, IonButton, onIonViewDidEnter } from '@ionic/vue';
import { ref, resolveDirective } from 'vue';



const userAccessToken = localStorage.getItem('auth_token');
const modalOpen = ref(false);
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

            </ion-list-header>
            <ion-card-subtitle>Name: {{userInfo.first_name}}</ion-card-subtitle>
            <ion-card-subtitle>Email: {{userInfo.email}}</ion-card-subtitle>
            <ion-buttons>
              <ion-button fill="outline" @click="logout">Logout</ion-button>
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
