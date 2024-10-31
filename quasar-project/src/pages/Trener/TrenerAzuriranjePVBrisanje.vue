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
        <h3>AŽURIRANJE PROGRAMA VJEŽBI</h3>
      </q-toolbar>
    </q-header>
    <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm" style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div class="form-header text-h5 text-center q-py-md">Odaberite program vježbi kako biste ga ažurirali!</div>

      <q-form class="q-gutter-md">
        <q-select
          filled
          v-model="sifraOdabranogProgramaVjezbi"
          :options="opcijeProgramaVjezbi"
          label="Odaberite program"
          emit-value
          map-options
          class="q-mb-md"
          @update:model-value="dohvatiDetaljeProgramaVjezbi"
        />
        <q-input filled v-model="odabranProgram.nazivProgramaVjezbi" label="Naziv programa" class="q-mb-md" />
        <q-input filled v-model="odabranProgram.opisProgramaVjezbi" label="Opis programa" type="textarea" class="q-mb-md" />

        <div class="text-center q-pt-md">
          <q-btn label="Ažuriraj" color="primary" class="q-mr-md" @click="azurirajProgramVjezbi" :disabled="!omoguciGumb" />
          <q-btn label="Obriši" color="negative" @click="obrisiProgramVjezbi" :disabled="!omoguciGumb" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>


<script>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { db } from 'boot/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
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
    const router = useRouter();
    const route = useRoute();
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const idKlijenta = route.params.idKlijenta;
    const opcijeProgramaVjezbi = ref([]);
    const sifraOdabranogProgramaVjezbi = ref('');
    const odabranProgram = ref({});
    const toggleLeftDrawer = inject('toggleLeftDrawer');
 // metoda za dohvat programa vjezbi
    const dohvatiProgramVjezbi = async () => {
      try {
        const dohvatiSnapshot = await getDocs(collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi"));
        opcijeProgramaVjezbi.value = dohvatiSnapshot.docs.map(doc => ({
          label: doc.data().nazivProgramaVjezbi,
          value: doc.id
        }));

        // Dohvati detalje za odabrani program vježbi, ako je odabran
        if (sifraOdabranogProgramaVjezbi.value) {
          const dohvatiRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraOdabranogProgramaVjezbi.value);
          const dohvatiSnapshot = await getDoc(dohvatiRef);
          
            odabranProgram.value = {
              nazivProgramaVjezbi: dohvatiSnapshot.data().nazivProgramaVjezbi,
              opisProgramaVjezbi: dohvatiSnapshot.data().opisProgramaVjezbi
            };
          
        } else {
          odabranProgram.value = {};
        }
      } catch (error) {
        console.error('Greška u dohvaćanju programa ili detalja:', error);
      }
    };

    onMounted(dohvatiProgramVjezbi);

    watch(sifraOdabranogProgramaVjezbi, dohvatiProgramVjezbi);

    const omoguciGumb = computed(() => {
  return odabranProgram.value.opisProgramaVjezbi?.trim();
});

    // ažurira odabrani program vježbanja u bazi podataka s novim informacijama
    const azurirajProgramVjezbi = async () => {
      try {
        const azurirajRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraOdabranogProgramaVjezbi.value);
        await updateDoc(azurirajRef, {
          nazivProgramaVjezbi: odabranProgram.value.nazivProgramaVjezbi,
          opisProgramaVjezbi: odabranProgram.value.opisProgramaVjezbi
        });
        console.log('Program uspješno ažuriran!');
        router.push({ name: 'TrenerAzuriranjeVjezbiUProgramuBrisanje', params: { idKlijenta, sifraProgramaVjezbi: sifraOdabranogProgramaVjezbi.value } });
      } catch (error) {
        console.error('Greška u ažuriranju programa vježbi!', error);
      }
    };

    // briše odabrani program vježbanja, uključujući sve vježbe povezane s tim programom za svaki dan u tjednu
    const obrisiProgramVjezbi = async () => {
  try {
    const brisanjeRef = doc(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi", sifraOdabranogProgramaVjezbi.value);

    // Definiranje tjedana i dana u svakom tjednu
    const tjedni = ['Tjedan 1', 'Tjedan 2', 'Tjedan 3', 'Tjedan 4', 'Tjedan 5', 'Tjedan 6', 'Tjedan 7', 'Tjedan 8'];
    const dani = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];

    // Iteriranje kroz tjedne i dane za brisanje vježbi i odrađenih vježbi
    for (const tjedan of tjedni) {
      for (const dan of dani) {
        // Brisanje vježbi u programu
        const danRef = collection(brisanjeRef, tjedan, dan, "Vježba u programu");
        const vjezbeSnapshot = await getDocs(danRef);
        for (const vjezbeDoc of vjezbeSnapshot.docs) {
          await deleteDoc(doc(danRef, vjezbeDoc.id));
        }

        // Brisanje odrađenih vježbi
        const odradeneRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Odrađena vježba", tjedan, dan);
        const odradeneSnapshot = await getDocs(odradeneRef);
        for (const odradenaDoc of odradeneSnapshot.docs) {
          await deleteDoc(doc(odradeneRef, odradenaDoc.id));
        }
      }
    }

    // Nakon što su sve vježbe i odrađene vježbe izbrisane, briše se cijeli program vježbi
    await deleteDoc(brisanjeRef);
    sifraOdabranogProgramaVjezbi.value = '';
    odabranProgram.value = {};
    console.log('Program vježbi uspješno izbrisan!');
  } catch (error) {
    console.error('Greška u brisanju programa vježbi!', error);
  }
};

    return {
      opcijeProgramaVjezbi,
      dohvatiProgramVjezbi,
      sifraOdabranogProgramaVjezbi,
      odabranProgram,
      azurirajProgramVjezbi,
      obrisiProgramVjezbi,
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