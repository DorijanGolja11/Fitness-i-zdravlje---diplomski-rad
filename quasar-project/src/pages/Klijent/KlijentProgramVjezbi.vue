<template>
  <q-page class="q-pa-md">
    <q-header elevated>
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        </q-item>
        <h3> PROGRAM VJEŽBI</h3>
      </q-toolbar>
    </q-header>
    <div class="text-center q-pb-lg">
      <div class="form-header text-h5 text-center q-py-md">Ovdje možete vidjeti Vaš program vježbi!</div>
      <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
    </div>
    <div class="q-pa-md form-container">
      <q-select
        filled
        v-model="odabranTjedan"
        :options="opcijeTjedan"
        label="Odaberite tjedan"
        emit-value
        map-options
        class="q-mb-md"
      />
      <q-select
        v-if="odabranTjedan"
        filled
        v-model="odabranDan"
        :options="opcijeDan"
        label="Odaberite dan"
        emit-value
        map-options
        class="q-mb-md"
      />
      <q-btn
        v-if="odabranDan"
        color="primary"
        label="Spremi odrađene vježbe"
        @click="prikaziDijalog"
        class="q-mt-md"
        :disabled="!omoguciGumb"
      />
      <q-table
        v-if="vjezbeUProgramu.length > 0"
        :rows="vjezbeUProgramu"
        :columns="stupci"
        row-key="name"
        class="full-width"
      >
        <template v-slot:body-cell-opis="props">
          <q-td :props="props" class="description-cell">
            <div class="multi-line-description">{{ props.row.opisVjezbeUProgramu }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-slika="props">
          <q-td :props="props">
            <img :src="props.row.slikaVjezbeUProgramu" alt="Exercise" style="width: 150px; height: 150px;">
          </q-td>
        </template>
        <template v-slot:body-cell-odradeno="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.odradeno" />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="prikazDijaloga">
      <q-card>
        <q-card-section>
          <div class="text-h6">Potvrda</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Jeste li sigurni da želite spremiti odrađene vježbe?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Odustani" color="negative" @click="zatvoriDijalog" />
          <q-btn label="Spremi" color="primary" @click="spremiOdradeneVjezbe" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="infoDijalogPrikaz">
      <q-card>
        <q-card-section>
          <div class="text-h6">Obavijest</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ poruka }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Zatvori" color="primary" @click="zatvoriInfoDijalog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, watch, computed, inject } from 'vue';
import { db } from 'boot/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

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
    const auth = getAuth();
    const idTrenera = ref(null);
    const idKlijenta = ref(null);
    const sifraProgramaVjezbi = ref(null);
    const odabranTjedan = ref(null);
    const odabranDan = ref(null);
    const vjezbeUProgramu = ref([]);
    const poruka = ref('');
    const toggleLeftDrawer = inject('toggleLeftDrawer');
    const uid = auth.currentUser.uid;

    const opcijeTjedan = ref([
      { label: 'Tjedan 1', value: 'Tjedan 1' },
      { label: 'Tjedan 2', value: 'Tjedan 2' },
      { label: 'Tjedan 3', value: 'Tjedan 3' },
      { label: 'Tjedan 4', value: 'Tjedan 4' },
      { label: 'Tjedan 5', value: 'Tjedan 5' },
      { label: 'Tjedan 6', value: 'Tjedan 6' },
      { label: 'Tjedan 7', value: 'Tjedan 7' },
      { label: 'Tjedan 8', value: 'Tjedan 8' }
    ]);

    const opcijeDan = ref([
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Četvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' }
    ]);

    const stupci = [
      { name: 'naziv', label: 'Naziv vježbe', field: 'nazivVjezbeUProgramu', align: 'left'},
      { name: 'opis', label: 'Opis vježbe', field: 'opisVjezbeUProgramu', align: 'left' },
      { name: 'slika', label: 'Slika', field: 'slikaVjezbeUProgramu', align: 'center' },
      { name: 'odradeno', label: 'Odrađeno', field: 'odradeno', align: 'center' }
    ];

    const prikazDijaloga = ref(false);
    const infoDijalogPrikaz = ref(false);

    const prikaziDijalog = () => { prikazDijaloga.value = true; };
    const zatvoriDijalog = () => { prikazDijaloga.value = false; };
    const zatvoriInfoDijalog = () => { infoDijalogPrikaz.value = false; };
    
// metoda za dohvat programa vježbi 
const dohvatiProgramIVjezbeKlijenta = async () => {
  try {
    const trenerRef = collection(db, "Trener");
    const trenerSnapshot = await getDocs(trenerRef);
    for (const trenerDoc of trenerSnapshot.docs) {
      const klijentRef = collection(db, "Trener", trenerDoc.id, "Klijent");
      const klijentSnapshot = await getDocs (klijentRef);
      for (const klijentDoc of klijentSnapshot.docs) {
        if (klijentDoc.data().idKlijenta === uid) {
          const programiVjezbiRef = collection(db, "Trener", trenerDoc.id, "Klijent", klijentDoc.id, "Program vježbi");
          const programiSnapshot = await getDocs(programiVjezbiRef);

          if (!programiSnapshot.empty) {
            const programVjezbiDoc = programiSnapshot.docs[0];
            idTrenera.value = trenerDoc.id;
            idKlijenta.value = klijentDoc.id;  
            sifraProgramaVjezbi.value = programVjezbiDoc.id;
            
            // Dohvaća vježbe za odabrani tjedan i dan
            const programVjezbiRef = collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Program vježbi",
            sifraProgramaVjezbi.value, odabranTjedan.value, odabranDan.value, "Vježba u programu");
            const programVjezbiSnapshot = await getDocs(programVjezbiRef);
            vjezbeUProgramu.value = programVjezbiSnapshot.docs.map(doc => ({ ...doc.data(), odradeno: false }));
          } 
        } 
      }
    }
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja podataka:", error);
  }
};
    watch([odabranTjedan, odabranDan], dohvatiProgramIVjezbeKlijenta);

  

    const omoguciGumb = computed(() => {
      return vjezbeUProgramu.value.some(vjezba => vjezba.odradeno);
    });
     // metoda za spremanje odrađenih vježbi
    const spremiOdradeneVjezbe = async () => {
      try {
        const odradeneVjezbeRef = collection(db, "Trener", idTrenera.value, "Klijent", idKlijenta.value, "Odrađena vježba", odabranTjedan.value, odabranDan.value);

        let brojOznacenihVjezbi = 0;
        for (const vjezba of vjezbeUProgramu.value) {
          if (vjezba.odradeno) {
            const vjezbaUpit = query(odradeneVjezbeRef, where('nazivOdradeneVjezbeUProgramu', '==', vjezba.nazivVjezbeUProgramu));
            const postojeceVjezbeSnapshot = await getDocs(vjezbaUpit);
            if (postojeceVjezbeSnapshot.empty) {
              await addDoc(odradeneVjezbeRef, {
                nazivOdradeneVjezbeUProgramu: vjezba.nazivVjezbeUProgramu,
                opisOdradeneVjezbeUProgramu: vjezba.opisVjezbeUProgramu,
                slikaOdradeneVjezbeUProgramu: vjezba.slikaVjezbeUProgramu,
              });
              brojOznacenihVjezbi++;
            }
          }
        }

        const ukupanBrojVjezbi = vjezbeUProgramu.value.length;
        odabranTjedan.value = null;
        odabranDan.value = null;
        vjezbeUProgramu.value = [];
        poruka.value = `Odradili ste ${brojOznacenihVjezbi} od ${ukupanBrojVjezbi} vježbi.`;

        zatvoriDijalog();
        infoDijalogPrikaz.value = true;

      } catch (error) {
        console.error('Greška prilikom spremanja odrađenih vježbi:', error);
      }
    };

    return {
      odabranDan,
      odabranTjedan,
      vjezbeUProgramu,
      opcijeTjedan,
      opcijeDan,
      stupci,
      spremiOdradeneVjezbe,
      prikazDijaloga,
      infoDijalogPrikaz,
      prikaziDijalog,
      zatvoriDijalog,
      zatvoriInfoDijalog,
      poruka,
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

.multi-line-description {
  white-space: pre-line;
}

.description-cell {
  width: 50%;
}

.q-page {
  min-height: 100vh !important;
  overflow-y: auto !important;
}
</style>