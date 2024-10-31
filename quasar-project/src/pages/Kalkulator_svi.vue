<template>
  <q-page class="q-pa-md">
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
        <h3>KALKULATOR KALORIJA</h3>
      </q-toolbar>
    </q-header>

    <div class="q-gutter-md">
      <q-input outlined v-model="godine" label="Vaše godine" type="number" />
      <q-input outlined v-model="tezina" label="Vaša kilaža (kg)" type="number" />
      <q-input outlined v-model="visina" label="Vaša visina (cm)" type="number" />
      <q-select outlined v-model="spol" :options="spolovi" label="Spol" />
      <q-select outlined v-model="aktivnost" :options="aktivnosti" label="Aktivnost" />
      <q-select outlined v-model="cilj" :options="ciljevi" label="Vaš cilj" />
      <q-btn :disable="!omoguciGumb" label="Izračunaj kalorije" color="primary" @click="izracunajKalorije" />
      <q-card class="q-mt-md" v-if="kalorije !== null">
        <q-card-section>
          <div class="text-h6">Potreban vam je unos {{kalorije}} kalorija po danu</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, inject } from 'vue';

export default {
  beforeMount() {
  const isReloaded = localStorage.getItem("isReloaded");
  if (!isReloaded) {
    localStorage.setItem("isReloaded", "true");
    location.reload();
  } else {
    localStorage.removeItem("isReloaded");
  }
},
  setup() {
    const godine = ref(null);
    const tezina = ref(null);
    const visina = ref(null);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const spol = ref(null);
    const aktivnost = ref(null);
    const cilj = ref(null);
    const kalorije = ref(null);
    
    const spolovi = [
      { label: 'Muškarac', value: 5 },
      { label: 'Žena', value: -161 },
    ];

    const aktivnosti = [
      { label: 'Loš', value: 1.2 },
      { label: 'Lagano aktivan', value: 1.375 },
      { label: 'Srednje aktivan', value: 1.55 },
      { label: 'Jako aktivan', value: 1.725 },
      { label: 'Ekstra aktivan', value: 1.9 },
    ];

    const ciljevi = [
      { label: 'Izgubi težinu (1 kg/tjedno)', value: -1000 },
      { label: 'Izgubi težinu (0.5 kg/tjedno)', value: -500 },
      { label: 'Održavaj kilažu', value: 0 },
      { label: 'Povećaj kilažu (0.5 kg/tjedno)', value: 500 },
      { label: 'Povećaj kilažu (1 kg/tjedno)', value: 1000 },
    ];

    const omoguciGumb = computed(() => {
      return godine.value !== null && tezina.value !== null && visina.value !== null && spol.value !== null && aktivnost.value !== null && cilj.value !== null;
    });

    const izracunajKalorije = () => {
      let bmr;
      if (spol.value?.value === 5) {
        bmr = 88.362 + (13.397 * tezina.value) + (4.799 * visina.value) - (5.677 * godine.value);
      } else if (spol.value?.value === -161) {
        bmr = 447.593 + (9.247 * tezina.value) + (3.098 * visina.value) - (4.33 * godine.value);
      } else {
        console.error("Nepoznata vrijednost za spol", spol.value);
        return;
      }

      const dnevneKalorije = Math.round(bmr * aktivnost.value.value);
      const CiljaneKalorije = cilj.value.value;
      kalorije.value = dnevneKalorije + CiljaneKalorije;
    };

    return {
      godine,
      tezina,
      visina,
      spol,
      aktivnost,
      cilj,
      kalorije,
      aktivnosti,
      ciljevi,
      spolovi,
      omoguciGumb,
      izracunajKalorije,
      toggleLeftDrawer
    };
  },
};
</script>

<style>
.footer {
  background-color: rgba(2, 122, 227, 0.849);
  border: solid;
  color: rgb(245, 243, 243);
  size: 30px;
}

.glossy {
  margin-left: 125px;
  margin-right: 80px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>