<template>
  <q-header reveal elevated>
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
      <h3>{{ imeKlijenta }}</h3>
    </q-toolbar>
  </q-header>
     <div class="q-pa-md row justify-center">
    <div class="row justify-center q-gutter-md" style="margin-bottom: 20px;">
        <q-card class="card-container" @click="provjeriINavigirajNaTrenerPV" style="width: 300px">
            <q-img src="6500_2_09.jpg" style="height: 200px; object-fit: cover; position: relative;">
                <div class= "absolute-bottom text-h6 center">Program vježbi</div>
                <div class="textgrey-h20" style="font-size: 12px; color: white; opacity: 0.3;">
                    Image by catalyststuff on Freepik
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje dodajte prilagođeni program vježbi za klijenta
            </q-card-section>
        </q-card>

        <q-dialog v-model="programVjezbiDijalog" persistent>
    <q-card>
      <q-card-section class="row items-center">
      </q-card-section>
      <q-card-section>
        Klijent već ima program vježbi!
        <br> Molimo Vas ažurirajte postojeći program vježbi ili ga obrišite kako biste mogli stvoriti novi program vježbi!
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Zatvori" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

        <q-card class="card-container" @click="navigacijaNaTrenerAzuriranjePVBrisanje" style="width: 300px">
            <q-img src="edit-icon-2375785_640.png"  style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Ažuriranje programa vježbi</div>
                <div class="textgrey-h20" style="font-size: 12px;  color: white; opacity: 0.3;">
                    Image by mcmurryjulie from Pixabay
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete ažurirati/obrisati Vaš program vježbi!
            </q-card-section>
        </q-card>

        <q-card class="card-container" @click="provjeriINavigirajNaTrenerPP" style="width: 300px">
            <q-img src="z9jm_28o9_221215.jpg"  style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Plan prehrane</div>
                <div class="textgrey-h20" style="font-size: 12px; color: white; opacity: 0.3;">
                  Image by brgfx on Freepik
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje dodajte prilagođeni plan prehrane za klijenta
            </q-card-section>
        </q-card>

        <q-dialog v-model="planPrehraneDijalog" persistent>
    <q-card>
      <q-card-section class="row items-center">
      </q-card-section>
      <q-card-section>
        Klijent već ima plan prehrane!
        <br> Molimo Vas ažurirajte postojeći plan prehrane ili ga obrišite kako biste mogli stvoriti novi plan prehrane!
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Zatvori" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

        <q-card class="card-container" @click="navigacijaNaTrenerAzuriranjePPBrisanje" style="width: 300px">
            <q-img src="edit-icon-2375785_640.png" style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Ažuriranje plana prehrane</div>
                <div class="textgrey-h20" style="font-size: 12px;  color: white; opacity: 0.3;">
                    Image by mcmurryjulie from Pixabay
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete ažurirati/obrisati Vaš plan prehrane!
            </q-card-section>
        </q-card>
    </div>


    <div class="row justify-center q-gutter-md">
        <q-card class="card-container" @click="navigacijaNaTrenerPodacioKlijentu" style="width: 300px">
            <q-img src="user-2517433_640.png" style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Podaci o klijentu</div>
                <div class="textgrey-h20" style="font-size: 12px;  color: white; opacity: 0.3;">
                    Image by Raphael Silva from Pixabay
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete vidjeti sve podatke o vašem klijentu
            </q-card-section>
        </q-card>

        <q-card class="card-container" @click="navigacijaNaTrenerUvidUKlijentovNapredak" style="width: 300px">
            <q-img src="progress.png" style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Napredak klijenta</div>
                <div class="textgrey-h20" style="font-size: 12px;  color: white; opacity: 0.3;">
                    Progress icons created by wahya - Flaticon
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete vidjeti tjedni napredak Vašeg klijenta
            </q-card-section>
        </q-card>

        <q-card class="card-container" @click="navigacijaNaTrenerUvidUKlijentOdradeneVjezbe" style="width: 300px">
            <q-img src="fax-1889045_1280.jpg" style="height: 200px; object-fit: cover; position: relative;">
                <div class="absolute-bottom text-h6 center">Odrađene vježbe</div>
                <div class="textgrey-h20" style="font-size: 12px;  color: white; opacity: 0.3;">
                    Image by Peggy und Marco Lachmann-Anke from Pixabay
                </div>
            </q-img>
            <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
                Ovdje možete vidjeti odrađene vježbe Vašeg klijenta
            </q-card-section>
        </q-card>
    </div>
</div>
</template>

<script>
import { ref, onMounted, inject } from 'vue';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from 'boot/firebase';
import { getAuth } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router';

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
    const idKlijenta = route.params.idKlijenta;
    const auth = getAuth();
    const idTrenera = auth.currentUser.uid;
    const imeKlijenta = ref('');
    const programVjezbiDijalog = ref(false);
    const planPrehraneDijalog = ref(false);
    const toggleLeftDrawer = inject('toggleLeftDrawer');
   
 // Dohvaća ime klijenta iz baze podataka na temelju ID-a klijenta.
 const dohvatiImeKlijenta = async () => {
  try {
    const klijentRef = doc(db, 'Trener', idTrenera, 'Klijent', idKlijenta);
    const klijentSnapshot = await getDoc(klijentRef);
    
    const podaciKlijenta = klijentSnapshot.data();
    imeKlijenta.value = `${podaciKlijenta.ime_korisnika} ${podaciKlijenta.prezime_korisnika}`;
    
  } catch (error) {
    console.error("Pogreška prilikom dohvaćanja podataka:", error);
  }
};

  onMounted(dohvatiImeKlijenta);

 // provjera postoji li program vjezbi za klijenta te ako ne postoji, preusmjerava na stranicu za izradu programa vjezbi
const provjeriINavigirajNaTrenerPV = async () => {
  const programRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi");
  const provjeraSnapshot = await getDocs(programRef);
  if (!provjeraSnapshot.empty) {
    programVjezbiDijalog.value = true;
  } else {
    router.push({ name: 'TrenerPV', params: { idKlijenta } });
  }
};
// provjera postoji li plan prehrane za klijenta te ako ne postoji, preusmjerava na stranicu za izradu plana prehrane
const provjeriINavigirajNaTrenerPP = async () => {
  const planRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Plan prehrane");
  const provjeraSnapshot = await getDocs(planRef);
  if (!provjeraSnapshot.empty) {
    planPrehraneDijalog.value = true;
  } else {
    router.push({ name: 'TrenerPP', params: { idKlijenta } });
  }
};

    const navigacijaNaTrenerPodacioKlijentu = () => {
        router.push({ name: 'TrenerPodacioKlijentu', params: { idKlijenta } });
    };

    

    const navigacijaNaTrenerUvidUKlijentovNapredak = () => {
        router.push({ name: 'TrenerUvidUKlijentovNapredak', params: { idKlijenta } });
    };

    const navigacijaNaTrenerAzuriranjePVBrisanje = () => {
        router.push({ name: 'TrenerAzuriranjePVBrisanje', params: { idKlijenta } });
    };

    const navigacijaNaTrenerAzuriranjePPBrisanje = () => {
        router.push({ name: 'TrenerAzuriranjePPBrisanje', params: { idKlijenta } });
    };

    const navigacijaNaTrenerUvidUKlijentOdradeneVjezbe = () => {
        router.push({ name: 'TrenerUvidUKlijentOdradeneVjezbe', params: { idKlijenta } });
    };
    

    return {
      dohvatiImeKlijenta,
      imeKlijenta,
      programVjezbiDijalog,
      planPrehraneDijalog,
      provjeriINavigirajNaTrenerPV,
      provjeriINavigirajNaTrenerPP,
      navigacijaNaTrenerPodacioKlijentu,
      navigacijaNaTrenerUvidUKlijentovNapredak,
      navigacijaNaTrenerAzuriranjePVBrisanje,
      navigacijaNaTrenerAzuriranjePPBrisanje,
      navigacijaNaTrenerUvidUKlijentOdradeneVjezbe,
      toggleLeftDrawer
      
    };
  },
};
</script>

<style>
</style>
