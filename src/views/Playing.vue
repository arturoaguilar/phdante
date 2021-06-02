<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div id="levelProgressBar">
          <div
            id="levelBarStatus"
            :style="{ width: level * levelProgressConverter + '%' }"
          ></div>
        </div>
        <!-- Time Bar-->
        <div id="progressBar">
          <div
            id="barStatus"
            :style="{ width: timeLeft * timeConverter + '%' }"
          ></div>
        </div>
        <!-- End Time bar-->

        <div v-show="screen == 1" id="calls" class="calls">
          <div class="calls-container"></div>
          <div
            class="call"
            @click="answerCall(call)"
            v-for="call in incomingCalls"
            :key="call.room"
          >
            <span>{{ call.room }}</span>
            <span>{{ call.name }}</span>
          </div>
<div class="player-stats">
          <div class="stat">HERO: {{ heroicPoints }}</div>
          <div class="stat">EVIL: {{ evilPoints }}</div>
          <div class="stat">VIDA: {{ hp }}</div>

</div>
<button> Inventario </button>

        </div>

        <div v-show="screen == 2" class="selected-call">
          {{ selectedCall.room }}
          {{ selectedCall.name }}

          <div class="call__context">
            <img :src="selectedCall.image" />
            <p>{{ selectedCall.context }}</p>
          </div>

          <div class="actions-container">
            <div
              class="action"
              @click="choseOption(action)"
              v-for="action in selectedCall.actions"
              :key="action.id"
            >
              {{ action.action }}
            </div>
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
      levelProgressConverter: 10,
      tiemLevelCount: 1,
      timeConverter: 10,
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

    //progress bar logic

    //elem.style.width = gameState.timeLeft + '%';
    //==================

    watch(() => {
      if (gameState.timeLeft == 0) {
        gameState.tiemLevelCount++;
        if (gameState.tiemLevelCount==10){ 
          gameState.level++;
          gameState.tiemLevelCount=0;
          }
        callState.incomingCalls = getEnterCalls();
        stopTime();
        restartTime();
        startTime();
      } else {
        console.log(gameState.timeLeft);
      }
    });

    stopTime();
    restartTime();
    startTime();

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
.calls-container {
  display: flex;
}
.call {
  width: 100%;
  border: solid 1px;
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
}

.call__context {
  padding: 20px;
  border: solid 1px;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.player-stats{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
 
}

#progressBar {
  position: relative;
  width: 100%;
  height: 30px;
  background-color: #ddd;
}

#barStatus {
  position: absolute;
  height: 100%;
  background-color: #000;
}

#levelProgressBar {
  position: relative;
  width: 100%;
  height: 30px;
  background-color: #ddd;
}

#levelBarStatus {
  position: absolute;
  height: 100%;
  background-color: rgb(243, 72, 72);
}
</style>