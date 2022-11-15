<script setup lang="ts">
import { IonFooter, IonCardTitle, IonButton, IonCardHeader, IonCardSubtitle, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter } from "@ionic/vue";
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { directus } from "@/services/directus.services";
 
const route = useRoute();
const { id } = route.params;
const listedGame = ref({});

onIonViewDidEnter(() => {
  fetchGame();
});

//Grabs id from route and querys server, saves response as object
const fetchGame = async () => {
  const response = directus.graphql.items(`
    query {
      retro_games_by_id(id: ${id}) {
        id,
        title,
        price,
        platform,
        condition,
        description,
        address,
        image {
          id
        },
        user_created{
          first_name
        }
      }
    }
  `).then(response => {
    listedGame.value = response.data.retro_games_by_id;
  });
}

</script>


<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{listedGame.title}}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true">
      <ion-card>
        <img v-if="listedGame.image" :src="`https://kcwe8gkm.directus.app/assets/${listedGame.image?.id}`"/>
        <ion-card-header>
          <ion-card-title>Title: {{listedGame.title}} </ion-card-title>
          <ion-card-subtitle>Address: {{listedGame.platform}}</ion-card-subtitle>
          <ion-card-subtitle>Price: {{listedGame.price}}kr</ion-card-subtitle>
          <ion-card-subtitle>Condition: {{listedGame.condition}}</ion-card-subtitle>
          <ion-card-subtitle>Address: {{listedGame.address}}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div class="description">
            Description:
            <br>
            {{listedGame.description}}
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <ion-footer :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-button>Contact</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
            <ion-button :router-link="'/home'">Home</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>


<style>
  img {
    padding: 15px;
    min-width: 100%;
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
  
  .description {
    color: black;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    padding: 5px;
    margin: 5px;
    text-align: center;
  }
  
</style>