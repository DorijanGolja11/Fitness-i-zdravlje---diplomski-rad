<template>
  <q-page class ="q-pa-md">
  <q-header reveal  elevated>
    <q-toolbar>
      <q-item clickable v-ripple>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
      </q-item>
      <h3>UNOS VJEŽBE</h3>
    </q-toolbar>
  </q-header>

  <div class="form-wrapper">
    <div class="form-container">
      <div class="form-header text-h5 text-center q-py-md">Ispunite obrazac za unos nove vježbe u sustav!</div>

      <q-form class="q-gutter-md" @submit="spremiVjezbu">
        <q-input filled v-model="vjezba.nazivVjezbe" label="Naziv vježbe" class="q-mb-md" />
        <q-input filled v-model="vjezba.opisVjezbe" label="Opis vježbe" type="textarea" class="q-mb-md" />
        
        <div class="q-my-md">
          <q-uploader
            ref="uploader"
            class="uploader"
            flat
            bordered
            accept="image/*"
            auto-upload
            :factory="file => ucitajSliku(file)"
            @uploaded="handleUpload"
          />
        </div>

        <div class="text-center">
          <q-btn label="Spremi Vježbu" type="submit" color="primary" :disabled="!omoguciGumb" />
        </div>
      </q-form>
    </div>
  </div>
</q-page>
</template>

<script>
import { ref, computed, inject } from 'vue';
import { db, storage } from 'boot/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

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
    const vjezba = ref({});
    const uploader = ref(null);
    const ucitavaSe = ref(false);
    const toggleLeftDrawer = inject('toggleLeftDrawer');

    // Učitava sliku vježbe na Firebase Storage i ažurira URL slike u lokalnom stanju.
    const ucitajSliku = async (files) => {
  const file = files[0];
  ucitavaSe.value = true;  
  try {
    console.log('Ime datoteke je:', file.name);
    const slikaRef = storageRef(storage, `slike_vjezba/${file.name}`);
    const snapshot = await uploadBytes(slikaRef, file);
    const url = await getDownloadURL(snapshot.ref);
    vjezba.value.slikaVjezbe = url;
    ucitavaSe.value = false;  
  } catch (error) {
    console.error('Pogreška pri učitavanju slike', error);
    ucitavaSe.value = false;  
  }
};
const omoguciGumb = computed(() => {
  // Gumb je omogućen samo ako su sva polja popunjena
  return (
    vjezba.value.nazivVjezbe && vjezba.value.nazivVjezbe.trim() !== "" && 
    vjezba.value.opisVjezbe && vjezba.value.opisVjezbe.trim() !== "" && 
    vjezba.value.slikaVjezbe
  );
});

    // spremanje vježbe u bazu podataka
    const spremiVjezbu = async () => {
      try {
        await addDoc(collection(db, 'Vježba'), {
          nazivVjezbe: vjezba.value.nazivVjezbe,
          opisVjezbe: vjezba.value.opisVjezbe,
          slikaVjezbe: vjezba.value.slikaVjezbe,
        });
        console.log('Vježba je uspješno spremljena!');

        vjezba.value = {};
        uploader.value.reset();
        
      } catch (error) {
        console.error('Dogodila se pogreška pri spremanju vježbe!', error);
      }
    };

    return {
      vjezba,
      ucitajSliku,
      spremiVjezbu,
      omoguciGumb,
      uploader,
      toggleLeftDrawer
    };
  }
};
</script>

<style>


.form-container {
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;

}

.form-wrapper {
  display: flex;
  justify-content: center; 
  align-items: flex-start; 
  height: 100%; 
  margin-left: auto; 
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}

.q-btn.full-width {
  width: 100%;
}

.q-uploader {
  width: 100%;
  max-width: 300px; 
  margin: auto; 
}


.q-uploader__trigger {
  width: 100%; 
  margin: 0;
}


.q-uploader__list {
  width: 100%; 
}


.q-uploader__progress {
  width: 100%; 
}


.q-uploader__file, .q-uploader__thumbnail {
  width: 100%; 
}


.q-uploader__file-nazivVjezbe, .q-uploader__file-size {
  text-align: center;
}


.q-uploader__thumbnail, .q-uploader__thumbnail-container {
  margin: 0 auto; 
}


</style>
