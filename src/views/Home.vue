<template>
  <ion-page>
    <!--  <ion-header :translucent="true">
     <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>-->

    <ion-content :fullscreen="true">
    <ion-header collapse="condense">
        <ion-title size="large">Blank</ion-title>
      </ion-header>

      <div id="container">
        <img :src="HomeImage" />
        <p>{{ welcomeParagraph }}</p>
        <button @click="begin()" class="button--begin">¡Comenzar!</button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonTitle } from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";
export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonPage,
    IonTitle,
  },
  setup() {
    const router = useRouter();
    const welcomeParagraph = ref(
      "Bienvenido a PH Dante, un edificio que queda en la peculiar ciudad de Laguna Roja."
    );
    const HomeImage = ref('assets/images/characterGenProfile.png');
    function begin() {
      router.push("/intro");
    }
    return {
      welcomeParagraph,
      HomeImage,
      begin,
    };
  },
});
</script>

<style scoped>

#container {
  display: flex;
  flex-direction: column;
  padding-inline: 20px;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
.button--begin{
 height: 60px;
}
</style>