<template>
    <ion-page>   
    <ion-content :fullscreen="true">
      <div id="container">
<img :src="IntroImage" />
<p>{{IntroMessage}}</p>
  <button @click="begin()" class="begin-button">¡Comenzar!</button>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonContent, IonPage } from "@ionic/vue";
import {ref} from "@vue/reactivity"
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
export default defineComponent({
  name:"Intro",
    components: {
    IonContent,
    IonPage,
  },
  setup() {
    const router = useRouter();
    const IntroMessage = ref('Es tu primer día de conserje... El último renunció, porque decía que en este edificio suceden cosas raras. Admiro que eso no te importe ');
 const IntroImage = ref('assets/images/characterGenProfile2.png');
 function begin(){
   router.push("/playing");
 }
 
 return{
    IntroMessage,
    IntroImage,
    begin
  }
  
  },
});
</script>