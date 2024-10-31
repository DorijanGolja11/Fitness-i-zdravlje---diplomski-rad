<template>
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
      <h3> UNOS PODATAKA</h3>
    </q-toolbar>
  </q-header>
      <div class="row justify-center q-gutter-md">
        <q-card class="card-container" @click= "navigacijaNaTrenerVjezbeBaza" style="width: 300px">
          <q-img src="6500_2_09.jpg" style="height: 200px; object-fit: cover; position: relative;">
    <div class= "absolute-bottom text-h6 center">
      Vježbe
    </div>
    <div class="textgrey-h20" style="font-size: 12px; color: white; opacity: 0.3;">
  Image by catalyststuff on Freepik
</div>
</q-img>
<q-card-section class="text-center" style="font-family: Arial, sans-serif; height: 50px;">
  Ovdje možete dodati nove vježbe u sustav
</q-card-section>
</q-card>
<q-card class="card-container" @click="navigacijaNaTrenerHranaBaza" style="width: 300px">
  <q-img src="z9jm_28o9_221215.jpg" style="height: 200px; object-fit: cover; position: relative;">
      <div class="absolute-bottom text-h6 center" style="color: white;">
        Hrana
      </div>
      <div class="textgrey-h20" style="font-size: 12px; color: white; opacity: 0.3;">
        Image by brgfx on Freepik
      </div>
  </q-img>
  <q-card-section class="text-center" style="font-family: Arial, sans-serif; height: 50px;">
    Ovdje možete dodati novu hranu u sustav
  </q-card-section>
</q-card>

      </div>
  </template>
  
  
  <script>
  import { useRouter } from 'vue-router';
  import { inject } from 'vue';
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
      const toggleLeftDrawer = inject('toggleLeftDrawer');
      const navigacijaNaTrenerVjezbeBaza = () => {
        router.push({ path: '/trener/TrenerVjezbeBaza' });

      };
      const navigacijaNaTrenerHranaBaza = () => {
        router.push({ path: '/trener/TrenerHranaBaza' }); 
      };
  
    
  
      return {
        navigacijaNaTrenerVjezbeBaza,
        navigacijaNaTrenerHranaBaza,
        toggleLeftDrawer
      };
    },
  };
  </script>
  
  <style>
  .bg-primary {
    background: #5e92f3; 
  }
  </style>
  