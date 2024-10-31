<template>
  <q-page class="q-pa-md">
    <q-header reveal elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-item>
        <h3>POČETNA STRANICA</h3>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="my-card" border flat bordered style="max-width: 100%;">
            <q-img src="victor-freitas-hOuJYX2K5DA-unsplash.jpg">
              <div class="absolute-bottom text-caption" style="font-size: 12px; color: white; opacity: 0.8; text-align: left; width: 100%;">
                Photo by Victor Freitas on Unsplash
              </div>
            </q-img>
            <q-card-section>
              <div class="text-overline text-orange-9">https://www.fitness.com.hr/</div>
              <div class="text-h5 q-mt-sm q-mb-xs">Najveći fitness portal u Hrvatskoj</div>
              <div class="text-caption">
                Najveći fitness portal u Hrvatskoj. Svakodnevno pratite naše stručne savjete vezano za vježbanje, zdravu prehranu, mršavljenje i zdravlje.
              </div>
            </q-card-section>
            <q-card-actions>
              <q-btn flat color="primary" @click="otvoriFitnessStranicu" label="Otvori" />
              <q-space />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="q-my-md" flat bordered>
            <q-card-section>
                <h3>BILJEŠKE</h3>
                <q-input v-model="naslovBiljeske" label="Unesite naslov..." :rules="validacija ? [val => !!val || 'Naslov je obavezan'] : []"></q-input>
                <q-input v-model="sadrzajBiljeske" label="Unesite sadržaj..." type="textarea" :rules="validacija ? [val => !!val || 'Sadržaj je obavezan'] : []"></q-input>
                <q-btn :disabled="!omoguciGumb" @click="spremiBiljesku" color="primary">Spremi bilješku</q-btn>
              </q-card-section>
            <q-card-section>
              <q-table :rows="biljeske" :columns="stupci" row-key="sifraBiljeske">
                <template v-slot:body-cell-edit="props">
                  <q-td class="text-center">
                    <q-btn color="primary" dense icon="edit" @click="pronadiBiljeskuZaUredivanje(props.row.sifraBiljeske)" />
                  </q-td>
                </template>
                <template v-slot:body-cell-delete="props">
                  <q-td class="text-center">
                    <q-btn color="negative" dense icon="delete" @click="obrisiBiljesku(props.row.sifraBiljeske)" />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, inject, onMounted, computed } from 'vue';
import { addDoc, getDocs, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "boot/firebase";
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
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;

    const biljeske = ref([]);
    const naslovBiljeske = ref("");
    const sadrzajBiljeske = ref("");
    const sifraBiljeskeZaUredivanje = ref(null);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const stupci = ref([
      { name: "naslovBiljeske", required: true, label: "Naslov", align: "left", field: "naslovBiljeske", sortable: true },
      { name: "sadrzajBiljeske", align: "left", label: "Sadržaj", field: "sadrzajBiljeske", sortable: true },
      { name: "edit", label: "", align: "center", sortable: false },
      { name: "delete", label: "", align: "center", sortable: false }
    ]);
    const validacija = ref(false);
   // metoda za dohvaćanje bilješki
    const dohvatiBiljeske = async () => {
      try {
        const biljeskaRef = collection(db, "Trener", idTrenera, "Biljeska");
        const biljeskaSnapshot = await getDocs(biljeskaRef);
        biljeske.value = biljeskaSnapshot.docs.map((doc) => ({ sifraBiljeske: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Došlo je do pogreške prilikom dohvaćanja bilješki:", error);
      }
    };

    onMounted(dohvatiBiljeske);
  // metoda za omogućavanje gumba spremi
    const omoguciGumb = computed(() => {
  return naslovBiljeske.value.trim() && sadrzajBiljeske.value.trim();
});

// metoda za spremanje ili ažuriranje biljeske
    const spremiBiljesku = async () => {
      try {
        const novaBiljeska = {
          naslovBiljeske: naslovBiljeske.value,
          sadrzajBiljeske: sadrzajBiljeske.value,
        };

        if (sifraBiljeskeZaUredivanje.value) {
          const biljeskaRef = doc(db, "Trener", idTrenera, "Biljeska", sifraBiljeskeZaUredivanje.value);
          await updateDoc(biljeskaRef, novaBiljeska);
        } else {
          const biljeskeRef = collection(db, "Trener", idTrenera, "Biljeska");
          await addDoc(biljeskeRef, novaBiljeska);
        }

        naslovBiljeske.value = "";
        sadrzajBiljeske.value = "";
        sifraBiljeskeZaUredivanje.value = null;
        dohvatiBiljeske();
      } catch (error) {
        console.error("Došlo je do pogreške prilikom spremanja bilješke:", error);
      }
    };
  // metoda za brisanje biljeske
    const obrisiBiljesku = async (sifraBiljeske) => {
      try {
        const biljeskaRef = doc(db, "Trener", idTrenera, "Biljeska", sifraBiljeske);
        await deleteDoc(biljeskaRef);
        biljeske.value = biljeske.value.filter(biljeska => biljeska.sifraBiljeske !== sifraBiljeske); // za prikaz u realnom vremenu da je obrisana
      } catch (error) {
        console.error("Došlo je do pogreške prilikom brisanja bilješke:", error);
      }
    };
  // metoda za pronalazak biljeske koja se zeli azurirati
    const pronadiBiljeskuZaUredivanje = (sifraBiljeske) => {
      const biljeska = biljeske.value.find(biljeska => biljeska.sifraBiljeske === sifraBiljeske);
      naslovBiljeske.value = biljeska.naslovBiljeske;
      sadrzajBiljeske.value = biljeska.sadrzajBiljeske;
      sifraBiljeskeZaUredivanje.value = sifraBiljeske;
    };

    const otvoriFitnessStranicu = () => {
      window.open("https://www.fitness.com.hr/", "_blank");
    };

    return {
      biljeske,
      naslovBiljeske,
      sadrzajBiljeske,
      omoguciGumb,
      dohvatiBiljeske,
      sifraBiljeskeZaUredivanje,
      stupci,
      spremiBiljesku,
      obrisiBiljesku,
      pronadiBiljeskuZaUredivanje,
      otvoriFitnessStranicu,
      validacija,
      toggleLeftDrawer,
    };
  }
};
</script>
<style>


.q-my-md {
  margin: 0; 
}

.footer {
  background-color: rgba(2, 122, 227, 0.831);
  height: 50px;
}

.q-toolbar {
  align-items: center;  
}
</style>
