<script setup lang="ts">

import { directus } from '@/services/directus.services';
import { IonContent, IonSearchbar, IonFooter, RefresherCustomEvent, IonRefresher, IonRefresherContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonButtons, IonButton, onIonViewDidEnter } from '@ionic/vue';
import { ref } from 'vue';


const listedGames = ref([]);

const searchResults = ref([]);


//Calls fetchGamesList upon opening home page
onIonViewDidEnter( () =>{
  fetchGamesList();
});


//refreshes homepage
const refreshGamesList = async (event: RefresherCustomEvent) => {
  await fetchGamesList();
  event.target.complete();
}


//Makes call to api, awaits the response and saves to array of objects.

const fetchGamesList = async () =>{
  const dbResponse = directus.graphql.items(`
    query{
      retro_games {
        id,
        title,
        price,
        platform,
        description,
        condition,
        address,
        image {
          id
        },
        user_created{
          first_name
        }
      }
    }
  `).then(dbResponse => listedGames.value = [...dbResponse.data.retro_games]);
}


//Allows searching the home page list filtering by title
const handleChange = (event:any) => {
  const query = event.target.value.toLowerCase();
  searchResults.value = listedGames.value.filter(game => game.title.toLowerCase().indexOf(query) > -1);
  console.log(searchResults.value)
}


</script>


<template>
  <ion-page class="background" id="main-content">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title slot="start">Retro gamestop</ion-title>
        <ion-buttons slot="end">
            <ion-button :router-link="'/user-info'">User</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refreshGamesList($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>      
      
      <ion-searchbar :debounce="1000" @ionChange="handleChange($event)"></ion-searchbar>
      <div v-if="searchResults.length == 0">

      <ion-card  v-for="game in listedGames" :key="game.id" :router-link="'/description/' + game.id">
        <img :src="`https://kcwe8gkm.directus.app/assets/${game.image.id}`"/>
        <ion-card-header>
          <ion-card-title>Title: {{game.title}}</ion-card-title>
        </ion-card-header>


        <ion-card-content>
          <ion-card-subtitle>Price: {{game.price}}kr</ion-card-subtitle>
          <ion-card-subtitle>Address: {{game.address}}</ion-card-subtitle>
        </ion-card-content>
      </ion-card>
      </div>
      
      <div v-else>
      <ion-card v-for="game in searchResults" :key="game.id" :router-link="'/description/' + game.id">
        <img :src="`https://kcwe8gkm.directus.app/assets/${game.image.id}`"/>
        <ion-card-header>
          <ion-card-title>Title: {{game.title}}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-card-subtitle>Price: {{game.price}}kr</ion-card-subtitle>
          <ion-card-subtitle>Address: {{game.address}}</ion-card-subtitle>
        </ion-card-content>
      </ion-card>
    </div>
    </ion-content>
    


    <ion-footer :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button :router-link="'/new-game'">Create listing</ion-button>
        </ion-buttons>

        <ion-buttons slot="end">
            <ion-button :router-link="'/authentication'">Login</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>

  </ion-page>
</template>

<style>


  img {
    padding: 15px;
  }

  ion-card {
    --background: url(../../public/assets/images/background.jpg) 0 0/100% 100% no-repeat;
    --color: #9efff0;

  }

  ion-card-title {
    --color: black;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    padding: 5px;
    font-weight: bold;
    text-align: center;
  }

  ion-card-subtitle {
    --color: black;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    padding: 5px;
    margin: 5px;
    font-weight: bold;
    text-align: center;
  }
  
</style>
