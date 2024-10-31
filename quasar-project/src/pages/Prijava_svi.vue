<template>
  <q-page class="bg-dark">
    <div class="row">
      <div class="col-12 col-md-8">
        <div class="q-pa-md">
          <div class="q-pa-md">
            <q-carousel
              square bordered
              class="q-pa-lg shadow-1 bg-grey"
              swipeable
              animated
              v-model="slide"
              :autoplay="autoplay"
              ref="carousel"
              infinite
              height="800px"
            >
              <q-carousel-slide :name="1" img-src="pexels-anete-lusina-4793209.jpg">
                <div style="position: absolute; bottom: 0; left: 0; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 8px;">
                  Photo by Anete Lusina
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="2" img-src="pexels-cottonbro-4753885.jpg">
                <div style="position: absolute; bottom: 0; left: 0; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 8px;">
                  Photo by cottonbro studio
                </div>
              </q-carousel-slide>
              <q-carousel-slide :name="3" img-src="pexels-mikhail-nilov-6740822.jpg">
                <div style="position: absolute; bottom: 0; left: 0; color: white; background-color: rgba(0, 0, 0, 0.5); padding: 8px;">
                  Photo by Mikhail Nilov
                </div>
              </q-carousel-slide>
              <template v-slot:control>
                <q-carousel-control
                  position="top-right"
                  :offset="[18, 18]"
                  class="text-white rounded-borders"
                  style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"
                >
                  <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
                </q-carousel-control>
                <q-carousel-control position="bottom-right" :offset="[18, 18]" class="q-gutter-xs">
                  <q-btn
                    push round dense color="orange" text-color="black" icon="arrow_left"
                    @click="$refs.carousel.previous()"
                  />
                  <q-btn
                    push round dense color="orange" text-color="black" icon="arrow_right"
                    @click="$refs.carousel.next()"
                  />
                </q-carousel-control>
              </template>
            </q-carousel>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 login-container">
        <div class="column justify-center">
          <q-card square bordered class="q-pa-lg shadow-10 login-card">
            <q-card-section>
              <q-form class="q-gutter-md" @submit.prevent="prijava">
                <h5 class="text-h4 text-dark q-my-md">Prijava</h5>
                <q-input square filled clearable v-model="email" type="email" label="Vaš e-mail" class="shadow-10" />
                <q-input square filled clearable v-model="password" type="password" label="Lozinka" class="shadow-10" />
                <p v-if="error" class="text-negative">{{ error }}</p>
                <q-card-actions class="q-px-md">
                  <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Prijava" @click="prijava" type="submit" />
                </q-card-actions>
              </q-form>
            </q-card-section>
            <q-card-section class="text-center q-pa-none">
              <router-link to="/login/Registracija_svi" class="link-style">
                <p class="text-grey-10">Nemate račun? Registrirajte se!</p>
              </router-link>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore"; 

export default {
  setup() {
    const router = useRouter();
    const db = getFirestore();
    const email = ref('');
    const password = ref('');
    const auth = getAuth();
    const error = ref(''); 
 // metoda za prijavu
    const prijava = async () => {
      if (!email.value.trim() || !password.value.trim()) {
        error.value = 'Molimo unesite e-mail i lozinku.';
        return;
      }
      try {
        const korisnickiPodaci = await signInWithEmailAndPassword(auth, email.value, password.value);
      
        // Provjera uloge korisnika
        const treneriRef = doc(db, "Trener", korisnickiPodaci.user.uid);
        const klijentiRef = doc(db, "Klijent", korisnickiPodaci.user.uid);
        const treneriSnap = await getDoc(treneriRef);
        const klijentiSnap = await getDoc(klijentiRef);

        let uloga = '';
        if (treneriSnap.exists()) {
          uloga = 'Trener/ica';
        } else if (klijentiSnap.exists()) {
          uloga = 'Klijent/ica';
        } else {
          console.log("Ne postoji dokument koji je povezan sa tim korisničkim podacima!");
        }

        // Redirekcija korisnika na temelju njihove uloge
        if (uloga === 'Trener/ica') {
          router.push('/trener/PocetnaTrener');
        } else if (uloga === 'Klijent/ica') {
          router.push('/klijent/PocetnaKlijent');
        } 
      } catch (err) {
        console.log("Pogreška prilikom prijave:", err);
        error.value = 'Provjerite svoje korisničke podatke i pokušajte ponovno.';
      }
    };

    return {
      slide: ref(1),
      autoplay: ref(false),
      email,
      password,
      prijava,
      error,
    };
  }
}
</script>
<style scoped>
  .q-page {
    background-color: white;
  }

  .q-carousel {
    max-height: 60vh; 
    margin: 0 auto; 
  }

  .q-carousel .q-carousel-slide {
    background-size: cover;
    background-position: center;
  }

  @media (max-width: 599px) {
    .q-carousel {
      height: auto;
      max-height: 30vh;
    }

    .q-page,
    .q-card {
      width: 100%;
    }

    .q-carousel-control {
      position: absolute;
      z-index: 10;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
    }

    .login-container {
      padding: 0 15px;
    }
  }

  @media (min-width: 600px) {
    
    .q-card {
      width: 80%;
      margin: 30px auto;
    }
    .login-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: auto;
      padding: 0;
      margin-left: 0;
    }
    .q-carousel {
      max-height: 40vh;
    }

  }

  @media (min-width: 1280px) {
    .q-card {
      width: 70%;
      margin: 90px;
    }

    .login-container {
      padding: 40px;
    }

    .q-carousel {
      max-height: 75vh;
    }

    .q-carousel .q-carousel-slide img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
</style>
