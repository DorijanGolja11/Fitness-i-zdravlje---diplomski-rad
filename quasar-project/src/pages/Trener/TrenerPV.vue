<template>
  <q-page class="row items-start q-pa-md justify-center">
   <q-header reveal elevated>
    <q-toolbar>
      <q-item clickable v-ripple >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-item>
      <h3> UNOS PROGRAMA VJEŽBI</h3>
    </q-toolbar>
  </q-header>
    
      <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm" style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div class="form-header text-h5 text-center q-py-md">Ispunite obrazac za unos novog programa vježbi u sustav!</div>
       
        <q-form class="q-gutter-md" @submit.prevent="spremiProgramVjezbiINastavi">
          <q-input filled v-model="programVjezbi.nazivProgramaVjezbi" label="Naziv programa" class="q-mb-md" />
          <q-input filled v-model="programVjezbi.opisProgramaVjezbi" label="Opis programa" type="textarea" class="q-mb-md" />
     
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
      const programVjezbi = ref({
        nazivProgramaVjezbi: '',
        opisProgramaVjezbi: ''
      });

      const omoguciGumb = computed(() => {
  return programVjezbi.value.nazivProgramaVjezbi.trim() && programVjezbi.value.opisProgramaVjezbi.trim();
});
  
   // metoda za spremanje programa vježbi i navigacija na stranicu TrenerProgramVjezbi
      const spremiProgramVjezbiINastavi = async () => {
        try {
          const programVjezbiRef = collection(db, "Trener", idTrenera, "Klijent", idKlijenta, "Program vježbi");
          const program = await addDoc(programVjezbiRef,
          { nazivProgramaVjezbi: programVjezbi.value.nazivProgramaVjezbi,
            opisProgramaVjezbi: programVjezbi.value.opisProgramaVjezbi
          });
          router.push({ name: 'TrenerProgramVjezbi', params: { sifraProgramaVjezbi: program.id, idKlijenta } });
        } catch (error) {
          console.error('Greška u spremanju programa vježbi:', error); 
        }
      };
   
      return {
        programVjezbi,
        spremiProgramVjezbiINastavi,
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