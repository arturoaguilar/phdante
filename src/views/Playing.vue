<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div v-show="end" class="container">
        Se terminó
        <button @click="endGame">End game</button>
        <!--<button @click="goToHomePage()">Reiniciar</button>-->
      </div>

      <div v-show="!end" class="container">
        <div class="player-stats">
          <div class="stat">
            heroísmo
            <p>{{ heroicPoints }}</p>
          </div>
          <div class="stat">
            Maldad
            <p>{{ evilPoints }}</p>
          </div>
          <div class="stat">
            Vida
            <p>{{ hp }}</p>
          </div>
        </div>

        <div v-show="screen == 0" class="level">
          <p>sasdasdad</p>
          <button @click="screen = 1">Continuar</button>
        </div>

        <div v-show="screen == 1" id="calls" class="calls">
          <!-- STATS---->
          <div id="levelProgressBar">
            <div
              id="levelBarStatus"
              :style="{ width: level * levelProgressConverter + '%' }"
            ></div>
          </div>
          <div id="timeblock__progress-bar">
            <div
              id="timeblock__status"
              :style="{ width: tiemLevelCount * 10 + '%' }"
            ></div>
          </div>

          <div id="progressBar">
            <div
              id="barStatus"
              :style="{ width: timeLeft * timeConverter + '%' }"
            ></div>
          </div>

          <!--- FIN STAtS -->

          <div class="calls-container">
            <div
              class="call"
              @click="answerCall(call)"
              v-for="call in incomingCalls"
              :key="call.room"
            >
              <span>{{ call.room }}</span>
              <span>{{ call.name }}</span>
            </div>
          </div>
          <div class="footer">
            <button @click="screen = 4">Inventario</button>
          </div>
        </div>

        <div v-show="screen == 2" class="selected-call">
          <div class="call__context">
            {{ selectedCall.room }} -
            {{ selectedCall.name }}
            <img :src="selectedCall.image" />
            <p>{{ selectedCall.problem }}</p>
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
          <p v-show="itemsEarned.length > 0">
            <span v-for="item in itemsEarned" :key="item.id">
              {{ item.name }}
            </span>
          </p>
          <p>
            <b>{{ heroicPointsEarned }}</b> puntos heróicos
          </p>
          <p>
            <b> {{ evilPointsEarned }}</b> puntos de maldad
          </p>

          <button @click="screen = 1">Aceptar</button>
        </div>

        <div class="items-container" v-show="screen == 4">
          <div v-show="items.length == 0">No tienes items</div>
          <div
            @click="getItemDetail(item)"
            class="item"
            v-for="item in items"
            :key="item.id"
          >
            {{ item.name }}
          </div>
          <button @click="screen = 1">Regresar</button>
        </div>

        <div v-show="screen == 5">
          <p>Parece que todo sigue su curso en lagunar roja</p>
          <button @click="startLevel">Continuar</button>
        </div>

        <div v-show="screen == 6">
          <p>Juego terminado</p>
          <p>Felicitaciones, pudiste terminar.</p>
        </div>

        <div v-show="screen == 7">
          <h1>¡COMBATE!</h1>
          <div v-for="(enemy, index) in enemies" :key="index">
            <h2>Name: {{ enemy.name }}</h2>
            <h2>HP: {{ enemy.hp }}</h2>
          </div>
          <ul>
            <li v-for="(log, index) in fightLogs" :key="index">
              {{ log }}
            </li>
          </ul>

          <div v-show="fightEnd">
            <button>Volver</button>
          </div>

          <div v-show="!fightEnd">
            <button @click="fight(enemies)">Atacar</button>
            <button>huir</button>
          </div>
        </div>
      </div>

      <!-- Modal -->

      <div id="endModal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-content" style="background-color: #fff">
          <h1>Hola</h1>
          <h1>Gracias por disfrutar de este juego</h1>
        </div>
        <button
          @click="closeEndModal()"
          class="modal-close is-large"
          aria-label="close"
        ></button>
      </div>
      -->

      <div id="itemModal" class="modal">
        <div class="modal-background"></div>

        <div class="modal-content">
          <div class="box">
            <div style="background-color: white">
              <p id="itemName"></p>
              <p id="itemDescription"></p>
            </div>
          </div>
        </div>
      </div>
      <!-- End Modal -->
    </ion-content>
  </ion-page>
</template>
<script>
import { IonContent, IonPage } from "@ionic/vue";
import { ref, toRefs, reactive } from "@vue/reactivity";
import { defineComponent } from "vue";
import { watch } from "@vue/runtime-core";
import axios from "axios";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Playing",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const router = useRouter();
    const gameState = reactive({
      playing: true,
      end: false,
      typeOfEnd: 1,
      screen: 1,
      timeLeft: 10,
      timeInterval: "",
      level: 1,
      levelText: "",
      endLevel: 10,
      levelProgressConverter: 10,
      tiemLevelCount: 0,
      timeConverter: 10,
      heroicPointsEarned: 0,
      evilPointsEarned: 0,
      itemsEarned: [],
    });

    const pageName = ref("Jugando");

    const playerState = reactive({
      name: "Charlie",
      hp: 10,
      xp: 0,
      dexterity: 1,
      armor: 0,
      attack: [1, 3],
      damage: [1, 2],
      heroicPoints: 0,
      evilPoints: 0,
      playerLevel: 1,
      items: [],
    });

    const callState = reactive({
      /* Las llamadas */
      selectedCall: "",
      incomingCalls: [],
      calls: [],
      /* Fin de las llamadas */
    });

    const itemState = reactive({
      itemSelectedName: "",
      itemSelectedDescrition: "",
    });

    const fightState = reactive({
      enemies: [],
      fightEnd: false,
      userWin: false,
      fightLogs: [],
    });

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
      getTime();
    }
    function stopTime() {
      clearInterval(gameState.timeInterval);
    }

    function restartTime() {
      gameState.timeLeft = 10;
    }

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
      stopTime();
      callState.selectedCall = call;
      gameState.screen = 2;
    }

    function choseOption(action) {
      if (!action.iscombat) {
        startTime();
        gameState.heroicPointsEarned = action.heroicPoints;
        gameState.evilPointsEarned = action.evilPoints;
        gameState.itemsEarned = action.prices;

        action.prices.forEach((element) => {
          playerState.items.push(element);
        });

        playerState.heroicPoints =
          playerState.heroicPoints + action.heroicPoints;
        playerState.evilPoints = playerState.evilPoints + action.evilPoints;
        gameState.screen = 3;
      } else {
        fightState.fightEnd = false;
        gameState.screen = 7;
        fightState.enemies = action.enemies;
      }
    }

    function goToHomePage() {
      router.push("/home");
    }

    function getDiceResult(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    function getPlayerCombatInitiative(enemy) {
      return playerState.dexterity > enemy.dexterity ? true : false;
    }

    function execCombatAction(enemy, playerTurn) {
      let combatLog = "";
      if (playerTurn) {
        const AttackRoll = getDiceResult(
          playerState.attack[0],
          playerState.attack[1]
        );
        if (AttackRoll > enemy.armor) {
          const damageRoll = getDiceResult(
            playerState.damage[0],
            playerState.damage[1]
          );
          enemy.hp = enemy.hp - damageRoll;
          if (enemy.hp > 0) {
            combatLog = `Tu ataque fue exitoso. Hiciste ${damageRoll}`;
          } else {
            combatLog = `Hiciste ${damageRoll} ¡Ganaste!`;
            fightState.fightEnd = true;
          }

          return combatLog;
        } else {
          combatLog = `Tu ataque Falló `;
          return combatLog;
        }
      } else {
        const AttackRoll = getDiceResult(enemy.attack[0], enemy.attack[1]);
        if (AttackRoll > playerState.armor) {
          const damageRoll = getDiceResult(enemy.damage[0], enemy.damage[1]);
          playerState.hp -= damageRoll;
          combatLog = `El ataque de ${enemy.name} fue exitoso. The hizo ${damageRoll}`;
          return combatLog;
        } else {
          combatLog = `El ataque de ${enemy.name} falló`;
          return combatLog;
        }
      }
    }

    function fight(enemies) {
      enemies.forEach(function (element) {
        let isPlayerTurn = getPlayerCombatInitiative(element);
        const actionsNumber = 2;

        for (let index = 0; index < actionsNumber; index++) {
          fightState.fightLogs.push(execCombatAction(element, isPlayerTurn));
          isPlayerTurn = !isPlayerTurn;
        }
      });
    }

   /* function changeWindow(type){
switch (type) {
  case 1:
    break;

  default:
    break;
}
    }*/

    function getItemDetail(item) {
      const t = document.getElementById("itemName");
      const y = document.createTextNode(item.name);
      t.appendChild(y);
      const element = document.getElementById("itemModal");
      element.classList.add("is-active");

      /*
      itemState.itemSelectedName = item.name;*/
    }
    /* Playing with modals  */
    function closeEndModal() {
      const element = document.getElementById("endModal");
      element.classList.remove("is-active");
    }
    function endGame() {
      const element = document.getElementById("endModal");
      element.classList.add("is-active");
    }

    /* End of playing with modals*/

    watch(() => {
      if (gameState.timeLeft == 0) {
        gameState.tiemLevelCount++;

        if (
          gameState.tiemLevelCount == 10 &&
          gameState.level < gameState.endLevel - 1
        ) {
          gameState.level++;
          gameState.tiemLevelCount = 0;
          stopTime();
          gameState.screen = 5;
        } else if (
          gameState.tiemLevelCount == 10 &&
          gameState.level == gameState.endLevel - 1
        ) {
          gameState.end = true;
        } else {
          callState.incomingCalls = getEnterCalls();
          stopTime();
          restartTime();
          startTime();
        }
      }
    });

    stopTime();
    restartTime();
    startTime();

    function startLevel() {
      gameState.screen = 1;
      callState.incomingCalls = getEnterCalls();
      stopTime();
      restartTime();
      startTime();
    }

    return {
      ...toRefs(gameState),
      ...toRefs(callState),
      ...toRefs(playerState),
      ...toRefs(itemState),
      ...toRefs(fightState),
      startLevel,
      restartTime,
      pageName,
      choseOption,
      answerCall,
      startTime,
      stopTime,
      goToHomePage,
      closeEndModal,
      endGame,
      getItemDetail,
      fight,
    };
  },
});
</script>
<style scoped>
.container {
  background-color: var(--primary);
  color: var(--secondary);
  height: 100vh;
}
.calls-container {
  padding-inline: 8px;
  margin-block-start: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.call {
  /*width: 100%;*/
  border: solid 1px;
  padding-block: 16px;
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
  padding-block: 16px;
}

.call__context {
  padding: 20px;
  border: solid 1px;
  margin-block-end: 16px;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.player-stats {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: solid 1px var(--secondary);
  margin-block-end: 16px;
}
.player-stats :nth-child(2) {
  border-right: solid 1px var(--secondary);
  border-left: solid 1px var(--secondary);
}
.stat {
  padding-inline: 16px;
  text-align: center;
  flex-grow: 1;
}
.footer {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
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

#timeblock__progress-bar {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #ddd;
}
#timeblock__status {
  position: absolute;
  height: 100%;
  background-color: rgb(37, 126, 241);
}

button {
  padding-block: 16px;
  font-size: 1.4rem;
  background-color: var(--primary);
  color: var(--secondary);
  border: solid 1px var(--secondary);
}
</style>