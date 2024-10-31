<template>
  <q-page class ="q-pa-md">
  <q-header reveal elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
      </q-item>
      <h3>TRENING</h3>
    </q-toolbar>
  </q-header>
  <div class="row justify-center q-gutter-md" style="margin-bottom: 50px; margin-top: 20px;">
        <q-card class="card-container" @click= "navigacijaNaKlijentProgramVjezbi" style="width: 300px">
            <q-img src="6500_2_09.jpg" style="height: 200px; object-fit: cover; position: relative;">
                <div class= "absolute-bottom text-h6 center">Program vježbi</div>
                <div class="textgrey-h20" style="font-size: 12px; color: white; opacity: 0.3;">
                    Image by catalyststuff on Freepik
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete vidjeti Vaš program vježbi
            </q-card-section>
        </q-card>

        <q-card class="card-container" @click="navigacijaNaKlijentPlanPrehrane" style="width: 300px">
            <q-img src="z9jm_28o9_221215.jpg"  style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Plan prehrane</div>
                <div class="textgrey-h20" style="font-size: 12px; color: white; opacity: 0.3;">
                  Image by brgfx on Freepik
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete vidjeti Vaš plan prehrane
            </q-card-section>
        </q-card>
    <q-card class="card-container" @click="navigacijaNaKlijentNapredak" style= "width: 300px">
            <q-img src="work-in-progress.png" style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Tjedni napredak</div>
                <div class="textgrey-h20" style="font-size: 12px;  color: white; opacity: 0.3;">
                  Work in progress icons created by Aranagraphics – Flaticon
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete unijeti Vaš tjedni napredak
            </q-card-section>
        </q-card>
      </div>
    </q-page>
</template>


<script>
import { inject, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const toggleLeftDrawer = inject('toggleLeftDrawer');

    const navigacijaNaKlijentProgramVjezbi = () => {
      router.push({ path: '/klijent/KlijentProgramVjezbi' });
    };

    const navigacijaNaKlijentPlanPrehrane = () => {
      router.push({ path: '/klijent/KlijentPlanPrehrane' });
    };

    const navigacijaNaKlijentNapredak = () => {
      router.push({ path: '/klijent/KlijentNapredak' });
    };

    onMounted(() => {
      const isReloaded = localStorage.getItem('isReloaded');
      if (!isReloaded) {
        localStorage.setItem('isReloaded', 'true');
        location.reload();
      } else {
        localStorage.removeItem('isReloaded');
      }
    });

    return {
      toggleLeftDrawer,
      navigacijaNaKlijentProgramVjezbi,
      navigacijaNaKlijentPlanPrehrane,
      navigacijaNaKlijentNapredak
    };
  }
};
</script>
<style>

.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>