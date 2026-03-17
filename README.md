# ProjectPartner - APLIKACIJA ZA PODRŠKU STUDENTIMA U IZRADI PROJEKATA

**Završni rad**  
**Autor:** Patrik Fabijanić  
**Mentor:** izv. prof. dr. sc. Nikola Tanković  
**Sveučilište Jurja Dobrile u Puli, Sveučilišni preddiplomski studij Informatika**  
**Kolegij:** Web aplikacije  

---

## Sažetak

Vođen idejom rješavanja problema organizacije studentskih projekata, razvio sam web aplikaciju **ProjectPartner** koja pomaže studentima i profesorima u upravljanju projektima. Aplikacija rješava problem poznat kao „nadzor bez gušenja" — omogućava profesoru praćenje napretka bez konstantnog direktnog kontakta. Sustav pruža centralizirano mjesto za projekte, zadatke, rokove i dokumente, kalendar s rokovima te AI asistenta koji pomaže studentima pri radu na projektima.

---

## Funkcionalnosti

### Studenti
- Pregled dostupnih projekata i pridruživanje projektu
- Prijava na projekt s vlastitom idejom
- Kreiranje i upravljanje zadacima
- Promjena statusa zadataka (not-started, in-progress, completed)
- Pregled kalendara s rokovima projekata i zadataka
- Dodavanje i brisanje vlastitih kalendarskih događaja
- Korištenje AI asistenta za pomoć pri radu
- Dodavanje poveznica na datoteke (GitHub, Google Drive)


### Profesori
- Kreiranje, uređivanje i brisanje projekata
- Odobravanje i odbijanje prijava studenata
- Kreiranje zadataka za bilo koji projekt
- Generiranje PDF izvještaja završenog projekta
- Pregled profila članova tima
- Upravljanje kalendarskim događajima
- Brisanje bilo koje poveznice na datoteku

### AI Asistent
- Dostupan na svim stranicama aplikacije
- Daje odgovore na temelju konteksta projekata i zadataka korisnika
- Predložena pitanja za brzi unos


---

## Tehnologije

| Dio aplikacije | Tehnologije |
|---|---|
| **Frontend** | Vue 3, TypeScript, Tailwind CSS, Pinia, Vue Router, Vite |
| **Backend** | Node.js, Express.js, TypeScript |
| **Baza podataka** | MongoDB, Mongoose |
| **Autentikacija** | JWT (JSON Web Token), Bcrypt |
| **Ostalo** | OpenAI API, PDF-lib |

---

## Pokretanje projekta

### Backend
```bash
cd backend-ProjectPartner-main
npm install
npm run build
npm start
```

### Frontend
```bash
cd frontend-ProjectPartner
npm install
npm run dev
```


> **Pristupni kod za registraciju profesora:** `Private123`

---

## Web aplikacija
 **https://frontend-project-partner.vercel.app/**



