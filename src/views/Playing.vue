<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">

        <div v-show="screen == 1" id="calls" class="calls">
            
          <div class="countdown">{{ timeLeft }}</div>

          <div
            class="amswer"
            @click="answerCall(call)"
            v-for="call in incomingCalls"
            :key="call.room"
          >
            <span>{{ call.room }}</span>
            <span>{{ call.name }}</span>
          </div>


          <div>HERO: {{ heroicPoints }}</div>
          <div>EVIL: {{ evilPoints }}</div>
          <button @click="startTime()">Start</button>
          <button @click="stopTime()">Stop</button>
          <button @click="restartTime()">Restar</button>
        </div>

        <div v-show="screen == 2" class="selected-call">
          {{ selectedCall.room }}
          {{ selectedCall.name }}

          <p class="call__context">
            {{ selectedCall.context }}
          </p>
          <div
            class="action"
            @click="choseOption(action)"
            v-for="action in selectedCall.actions"
            :key="action.id"
          >
            {{ action.action }}
          </div>
        </div>

        <div v-show="screen == 3">
          Ganaste:
          <p>
            <b>{{ heroicPointsEarned }}</b> puntos heróicos
          </p>
          <p>
            <b> {{ evilPointsEarned }}</b> puntos de maldad
          </p>
          <button @click="screen = 1">Aceptar</button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonContent, IonPage } from "@ionic/vue";
import { ref, toRefs, reactive } from "@vue/reactivity";
import { defineComponent } from "vue";
import { watch } from "@vue/runtime-core";
import axios from "axios";
export default defineComponent({
  name: "Playing",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const gameState = reactive({
      playing: true,
      end: false,
      typeOfEnd: 1,
      screen: 1,
      timeLeft: 10,
      timeInterval: "",
      level: 1,
      heroicPointsEarned: 0,
      evilPointsEarned: 0,
    });

    const pageName = ref("Jugando");
    const playerState = reactive({
      name: "Charlie",
      hp: 10,
      heroicPoints: 0,
      evilPoints: 0,
    });

    const callState = reactive({
      /* Las llamadas */
      selectedCall: "",
      incomingCalls: [],
      calls: [],
      /* Fin de las llamadas */
    });

    async function getAllCalls() {
      try {
        const allCalls = await axios.get("assets/data.json");
        return allCalls.data.calls;
      } catch (error) {
        console.error(error);
      }
    }

    function getEnterCalls() {
      return callState.calls.sort(() => Math.random() - 0.5);
    }

    (async () => {
      callState.calls = await getAllCalls();
      callState.incomingCalls = getEnterCalls(); 
      console.log("CALL STATE");
        console.log(callState.incomingCalls);
    })();


    function answerCall(call) {
      callState.selectedCall = call;
      gameState.screen = 2;
    }

    function choseOption(action) {
      gameState.heroicPointsEarned = action.heroicPoints;
      gameState.evilPointsEarned = action.evilPoints;
      playerState.heroicPoints = playerState.heroicPoints + action.heroicPoints;
      playerState.evilPoints = playerState.evilPoints + action.evilPoints;
      gameState.screen = 3;
    }

    function getTime() {
      gameState.timeInterval = setInterval(() => {
        if (gameState.timeLeft === 0) {
          clearInterval(gameState.timeInterval);
        } else {
          gameState.timeLeft--;
        }
      }, 1000);
    }

    function startTime() {
      // console.log(gameState.timeInterval);
      getTime();
    }
    function stopTime() {
      clearInterval(gameState.timeInterval);
    }

    function restartTime() {
      //  stopTime();
      gameState.timeLeft = 10;
      // startTime();
    }
    watch(() => {
      if (gameState.timeLeft == 0) {
        callState.incomingCalls = getEnterCalls();
        stopTime();
        restartTime();
        startTime();
      } else {
        console.log(gameState.timeLeft);
      }
    });

console.log("Game State");
    console.log(gameState);
    console.log("Calls State");
    console.log(callState);
    console.log("Players State");
    console.log(playerState);
    return {
      ...toRefs(gameState),
      ...toRefs(callState),
      ...toRefs(playerState),
      restartTime,
      pageName,
      choseOption,
      answerCall,
      startTime,
      stopTime,
    };
  },
});
</script>
<style scoped>
.amswer {
  width: 100%;
  border: solid 1px;

  padding-block: 10px;
  margin-block: 10px;
  /*
  animation-duration: 3s;
  animation-name: slidein;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  */
}
/*
@keyframes slidein {
  from {
    margin-left:100%;
    width:300%
  }

  to {
   margin-left:0%;
   width:100%;
 }
}
*/
.action {
  width: 100%;
  border: solid 1px;
  padding-block: 10px;
  margin-block: 10px;
}

.call__context {
  border: solid 1px;
  padding: 30px;
}
</style>