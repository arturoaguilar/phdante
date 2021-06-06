<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
});
</script>
<style>
:root {
  --primary: #272727;
  --secondary: #fefeff;
  --contrast: #fefeff;
  --prueba:#60e5e2;
  --prueba2:#c10d17;



}
</style>