<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <div class="countdown">{{ timeLeft }}</div>
        <div class="stage-bar">stage bar</div>

        <div v-show="!answering" id="calls" class="calls">
          <div
            class="amswer"
            @click="answerCall(call)"
            v-for="call in incomingCalls"
            :key="call.room"
          >
            <span>{{ call.room }}</span>
            <span>{{ call.name }}</span>
          </div>
        </div>

        <div v-show="answering" class="selected-call">
          {{ selectedCall.room }}
          {{ selectedCall.name }}
          <p class="call__context">
            {{ selectedCall.context }}
          </p>
          <div
            class="action"
            @click="choseOption"
            v-for="action in selectedCall.actions"
            :key="action.id"
          >
            {{ action.action }}
          </div>
        </div>
      </div>
      <button @click="startTime()">Start</button>
      <button @click="stopTime()">Stop</button>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonContent, IonPage } from "@ionic/vue";
import { ref, toRefs, reactive } from "@vue/reactivity";
import { defineComponent } from "vue";
import { watch } from "@vue/runtime-core";
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
      answering: 0,
      timeLeft: 10,
      timeInterval: "",
      level: 1,
    });

    const pageName = ref("Jugando");
    const callState = {
      /* Las llamadas */
      selectedCall: "",
      incomingCalls: [],
      calls: [
        {
          room: 101,
          name: "Domitila",
          level: 1,
          problem: "mis ventanas están sonando mucho",
          context: "Todo está desordenado",
          actions: [
            {
              id: 1,
              action: "Cerrar la ventana",
              heroicPoints: 1,
              devilPoints: 0,
              item: "0",
            },
            {
              id: 2,
              action: "Gritarle",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
            {
              id: 3,
              action: "Decirle que podría ser un espíritu",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
          ],
        },
        {
          room: 102,
          name: "Familia Dominguez ",
          level: 1,
          problem: "mi perro se quedó atrapado en el baño",
          context: "Todo está desordenado",
          actions: [
            {
              id: 1,
              action: "Romper la puerta",
              heroicPoints: 1,
              devilPoints: 0,
              item: "0",
            },
            {
              id: 2,
              action: "Decirles que no puedes ayudarlos",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
            {
              id: 3,
              action: "Decirle que podría ser un espíritu",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
          ],
        },
        {
          room: 103,
          name: "Lucíano",
          level: 1,
          problem: "mis ventanas están sonando mucho",
          context: "Todo está desordenado",
          actions: [
            {
              id: 1,
              action: "Cerrar la ventana",
              heroicPoints: 1,
              devilPoints: 0,
              item: "0",
            },
            {
              id: 2,
              action: "Gritarle",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
            {
              id: 3,
              action: "Decirle que podría ser un espíritu",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
          ],
        },
        {
          room: 104,
          name: "Soren",
          level: 1,
          problem: "M cocína suena mucho",
          context: "Todo está desordenado",
          actions: [
            {
              id: 1,
              action: "Cerrar la ventana",
              heroicPoints: 1,
              devilPoints: 0,
              item: "0",
            },
            {
              id: 2,
              action: "Gritarle",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
            {
              id: 3,
              action: "Decirle que podría ser un espíritu",
              heroicPoints: 0,
              devilPoints: 1,
              item: "0",
            },
          ],
        },
      ],
      /* Fin de las llamadas */
    };

    function getEnterCalls() {
      return callState.calls.sort(() => Math.random() - 0.5);
    }
    function answerCall(call) {
      callState.selectedCall = call;
      gameState.answering = true;
    }

    function choseOption(option) {
      gameState.answering = false;
      console.log(option);
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
      console.log("STARTING");
      console.log(gameState.timeInterval);
      getTime();
    }
    function stopTime() {
      console.log("STOP");
      clearInterval(gameState.timeInterval);
    }

function restarTime() {
    gameState.timeLeft =10;
}
    watch(() => {
      if (gameState.timeLeft==0){
       callState.incomingCalls = getEnterCalls();
       stopTime();
       restarTime();
       startTime();
      } else {
       console.log(gameState.timeLeft);
      }
    });

    callState.incomingCalls = getEnterCalls();
    return {
      ...toRefs(gameState),
      ...toRefs(callState),
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
  border-radius: 10px;
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
  border-radius: 10px;
  padding-block: 10px;
  margin-block: 10px;
}

.call__context {
  border-radius: 5px;
  border: solid 1px;
  padding: 30px;
}
</style>