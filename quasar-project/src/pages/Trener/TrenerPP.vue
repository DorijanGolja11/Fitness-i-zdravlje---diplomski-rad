<template>
  <q-page class="row items-start q-pa-md justify-center">

    <q-header reveal  elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-item>
      <h3> UNOS PLANA PREHRANE</h3>
    </q-toolbar>
  </q-header>
    <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm" style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div class="form-header text-h5 text-center q-py-md">Ispunite obrazac za unos novog plana prehrane u sustav!</div>
      
      <q-form class="q-gutter-md" @submit.prevent="spremiPlanPrehraneINastavi">
        <q-input filled v-model="planPrehrane.nazivPlanPrehrane" label="Naziv plana" class="q-mb-md" />
        <q-input filled v-model="planPrehrane.opisPlanPrehrane" label="Opis plana" type="textarea" class="q-mb-md" />
        
        <div class="text-center q-pt-md">
          <q-btn label="Dalje" type="submit" color="primary" :disabled="!omoguciGumb" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from 'boot/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  beforeMount() {
    const isReloaded = localStorage.getItem('isReloaded');
    if (!isReloaded) {
      localStorage.setItem('isReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('isReloaded');
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const idKlijenta = route.params.idKlijenta;
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const planPrehrane = ref({
      nazivPlanPrehrane: '',
      opisPlanPrehrane: ''
    });

    const omoguciGumb = computed(() => {
  return planPrehrane.value.nazivPlanPrehrane.trim() && planPrehrane.value.opisPlanPrehrane.trim();
});
  
  // metoda za spremanje plana prehrane i navigacija na stranicu TrenerPlanPrehrane
  const spremiPlanPrehraneINastavi = async () => {
  try {
    const planPrehraneRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane");
    const plan = await addDoc(planPrehraneRef, {
      nazivPlanPrehrane: planPrehrane.value.nazivPlanPrehrane,
      opisPlanPrehrane: planPrehrane.value.opisPlanPrehrane
    });
    router.push({ name: 'TrenerPlanPrehrane', params: { sifraPlanaPrehrane: plan.id, idKlijenta } });
  } catch (error) {
    console.error('Greška u spremanju plana prehrane:', error);
  }
};

    return {
      planPrehrane,
      spremiPlanPrehraneINastavi,
      omoguciGumb,
      toggleLeftDrawer
    };
  }
};
</script>

<style>
.form-header {
  color: #5c6bc0;
  font-weight: bold;
}
</style>