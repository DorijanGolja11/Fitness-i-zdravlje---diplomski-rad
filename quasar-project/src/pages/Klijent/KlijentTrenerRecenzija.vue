<template>
  <q-page class="q-pa-md">
  <q-header reveal elevated>
    <q-toolbar>
      <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
      <h3>{{ imeTrenera }}</h3>
    </q-toolbar>
  </q-header>

  <div class="q-pa-md flex flex-center">
    <q-card style="max-width: 700px; width: 100%">
      <div class="q-pa-md text-center">
        <div class="text-h5 q-mb-md">Recenzija</div>

        <div class="q-gutter-y-md flex-center column">
          <q-rating
            v-model="ocjenaRecenzije"
            max="5"
            size="4em"
            color="green-5"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
          />

          <div
            class="q-pa-md flex-center"
            style="width: 100%; max-width: 600px"
          >
            <p class="q-mt-md">
              Imate li nešto za reći? Podijelite svoje iskustvo s drugima!
            </p>
            <q-input
              v-model="tekstRecenzije"
              filled
              label="Ostavite recenziju...."
              type="textarea"
            />
          </div>

          <div>
            <q-btn
              color="primary"
              no-caps
              label="Pošalji"
              @click="spremiRecenziju"
              :disabled="!omoguciGumb"
            />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</q-page>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import { getDoc, getDocs, doc, addDoc, updateDoc, collection, query, where } from "firebase/firestore";
import { db } from "boot/firebase";
import { useRoute } from "vue-router";
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
    const route = useRoute();
    const idTrenera = route.params.idTrenera;
    const imeTrenera = ref("");
    const sifraRecenzije = ref(null);
    const ocjenaRecenzije = ref(2.5);
    const tekstRecenzije = ref("");
    const auth = getAuth();
    const idKlijenta = auth.currentUser.uid;
    const toggleLeftDrawer = inject("toggleLeftDrawer");

    // Metoda za dohvaćanje imena trenera
    const dohvatiImeTreneraRecenzija = async () => {
      const trenerDoc = await getDoc(doc(db, "Trener", idTrenera));
      const data = trenerDoc.data();
      imeTrenera.value = `${data.ime_korisnika} ${data.prezime_korisnika}`;
      
    };

    
    
    const omoguciGumb = computed(() => {
      return ocjenaRecenzije.value && tekstRecenzije.value.trim();
    });

   // metoda za spremanje recenzije
    const spremiRecenziju = async () => {
  try {
    
    const klijentRef = doc(db, "Klijent", idKlijenta);
    const klijentSnapshot = await getDoc(klijentRef);
    const klijentPodaci = klijentSnapshot.data();
    const imeKlijenta = `${klijentPodaci.ime_korisnika} ${klijentPodaci.prezime_korisnika}`;

    // provjrava treba li ažurirati postojeću recenziju ili dodati novnu
    if (sifraRecenzije.value) {
      await updateDoc(doc(db, "Trener", idTrenera, "Recenzija", sifraRecenzije.value),
        {
          ocjenaRecenzije: ocjenaRecenzije.value,
          tekstRecenzije: tekstRecenzije.value,
          
        }
      );
    } else {
      await addDoc(collection(db, "Trener", idTrenera, "Recenzija"), {
        ocjenaRecenzije: ocjenaRecenzije.value,
        tekstRecenzije: tekstRecenzije.value,
        idKlijenta: idKlijenta,
        imeKlijenta: imeKlijenta,
      });
    }

    // resetiranje vrijednosti nakon spremanja ili ažuriranja
    ocjenaRecenzije.value = null;
    tekstRecenzije.value = "";

   // ažurira prosječnu ocjenu trenera
    await izracunajProsjecnuOcjenuTrenera(idTrenera);
  } catch (error) {
    console.error("Greška u procesu spremanja recenzije ili u dohvatu podataka o recenziji:", error);
  }
};

   // metoda za izračun prosječne ocjene trenera
   const izracunajProsjecnuOcjenuTrenera = async (idTrenera) => {
  try {
    // Dohvaćanje svih recenzija za trenera
    const recenzijaRef = collection(db, "Trener", idTrenera, "Recenzija");
    const recenzijeSnapshot = await getDocs(recenzijaRef);
    let ukupnaOcjena = 0;
    let brojRecenzija = 0;

    // Prolazi kroz sve recenzije i izračunava ukupnu ocjenu
    recenzijeSnapshot.forEach((doc) => {
      ukupnaOcjena += doc.data().ocjenaRecenzije;
      brojRecenzija++;
    });

    // Izračun prosječne ocjene 
    let prosjecnaOcjena = ukupnaOcjena / brojRecenzija;
    prosjecnaOcjena = prosjecnaOcjena.toFixed(1);
    const trenerRef = doc(db, "Trener", idTrenera);
    await updateDoc(trenerRef, { prosjecna_ocjena: prosjecnaOcjena });
  } catch (error) {
    console.error("Pogreška prilikom izračuna prosječne ocjene", error);
  }
};
// metoda za dohvat postojeće recenzije
const dohvatiPostojecuRecenziju = async () => {
  try {
    const recenzijaUpit = query(collection(db, "Trener", idTrenera, "Recenzija"), where("idKlijenta", "==", idKlijenta));
    const recenzijaSnapshot = await getDocs(recenzijaUpit);
    if (!recenzijaSnapshot.empty) {
      const recenzija = recenzijaSnapshot.docs[0].data(); 
      sifraRecenzije.value = recenzijaSnapshot.docs[0].id;
      ocjenaRecenzije.value = recenzija.ocjenaRecenzije; 
      tekstRecenzije.value = recenzija.tekstRecenzije; 
    } else {
      console.log("Ne postoji recenzija za dohvat!");
    }
  } catch (error) {
    console.error("Došlo je do pogreške prilikom dohvaćanja recenzije:", error);
  }
};

onMounted(() => {
      dohvatiImeTreneraRecenzija();
      dohvatiPostojecuRecenziju();
    });

    return {
      imeTrenera,
      ocjenaRecenzije,
      tekstRecenzije,
      spremiRecenziju,
      izracunajProsjecnuOcjenuTrenera,
      omoguciGumb,
      dohvatiPostojecuRecenziju,
      toggleLeftDrawer,
    };
  },
};
</script>
