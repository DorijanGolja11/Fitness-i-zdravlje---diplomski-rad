import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(); 


// zahtijeva autentifikaciju za zaštićene rute
export function requireAuth(to, from, next) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // Korisnik je autenticiran, dopušta pristup rutama
      next();
    } else {
      // Korisnik nije autenticiran i prebacuje ga na login
      next('/login');
    }
    unsubscribe();
  });
}