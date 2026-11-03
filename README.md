# Portofoliu de Laborator – Dezvoltarea Aplicațiilor Mobile

- **Studentă:** Oșurco Iulia  
- **Grupa:** IT2401  
- **Instituția:** Universitatea Tehnica a Moldovei.Centrul Universitar "Bogdan Petriceicu Hasdeu” din Cahul  

Bun venit în portofoliul meu digital! Această pagină conține lucrările de laborator realizate în cadrul disciplinei.

---

## Laboratorul 4: Consum API public — listă, detalii și căutare live
- **Descriere:** Implementarea unei aplicații mobile în React Native care consumă date reale de la un API public (DummyJSON). Proiectul integrează navigare în stivă (Stack Navigator) între lista de produse și ecranul de detalii bazat pe ID, căutare live, filtrare locală pe categorii și un sistem sincronizat de produse favorite.
- **Fișiere și Cod:** [Vezi folderul laboratorului 4](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab4)
- **Link util:** [https://snack.expo.dev/@julia7/lab4](https://snack.expo.dev/@julia7/lab4)
- **Demonstrație Video (GIF):**  

  ![Demo Lab 4](LAB4.gif)

---

## Laboratorul 5.1: Catalog pe pagini, Reîmprospătare și Tratarea Erorilor
- **Descriere:** Implementarea unui flux avansat de date într-o listă React Native (FlatList) cu încărcare pe pagini folosind parametrii limit și skip de la DummyJSON, reîmprospătare prin tragere (RefreshControl) și o separare riguroasă a stărilor de eroare (prima încărcare, reîmprospătare și paginare suplimentară).
- **Fișiere și Cod:** [Vezi folderul laboratorului 5.1](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab5_s1)
- **Link util:** [https://snack.expo.dev/@julia7/lab5_s1](https://snack.expo.dev/@julia7/lab5_s1)
- **Demonstrație Video (GIF):**  

![Demo LAB51](LAB51.gif)

---

## Laboratorul 5.2: Componente Interactive de Progres și Cronometru
- **Descriere:** Dezvoltarea unor componente independente de interfață care utilizează hook-uri React (useEffect, useState) și temporizatoare (setInterval). Proiectul include o bară de progres determinată animată procentual și un cronometru complet cu funcționalități de start, stop și resetare.
- **Fișiere și Cod:** [Vezi folderul laboratorului 5_s2](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab5_s2)
- **Link util:** [https://snack.expo.dev/@julia7/lab5_s2](https://snack.expo.dev/@julia7/lab5_s2)
- **Demonstrație Video (GIF):**  

  ![Demo Lab 5_2](LAB5_2.gif)

---

## Laboratorul 6: Aplicație cu login simplu și persistență (AsyncStorage)
- **Descriere:** Implementarea unui flux complet de autentificare (login/logout) bazat pe un API real (DummyJSON), cu gestionarea securizată a tokenurilor prin SecureStore/AsyncStorage și restaurarea automată a sesiunii. Proiectul include, de asemenea, un sistem de notițe locale salvate persistent, izolate și separate în funcție de ID-ul fiecărui utilizator.
- **Fișiere și Cod:** [Vezi folderul laboratorului 6](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab6)
- **Link util:** [https://snack.expo.dev/@julia7/lab6](https://snack.expo.dev/@julia7/lab6)
- **Demonstrație Video (GIF):**  

  ![Demo LAB6](LAB6.gif)

---

## Laboratorul 7:  Aplicație cu cameră și galerie (jurnal foto, scanner QR)
- **Descriere:** Dezvoltarea unei aplicații mobile complexe în React Native ce utilizează capabilitățile native ale dispozitivului (expo-image-picker, expo-camera) pentru a captura și selecta imagini, tratând riguros permisiunile și anulările. Proiectul implementază copierea fișierelor multimedia într-un director permanent pentru a supraviețui repornirilor (expo-file-system), stocarea metadatelor în AsyncStorage și un scanner de coduri QR securizat, care validează datele preluate înainte de execuție.
- **Fișiere și Cod:** [Vezi folderul laboratorului 7](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab7)
- **Link util:** [https://snack.expo.dev/@julia7/lab7](https://snack.expo.dev/@julia7/lab7)
- **Demonstrație Video (GIF):**  

  ![Demo LAB7](LAB7.gif)

---

## Laboratorul 8: Integrare hărți și geolocație — „găsește cea mai apropiată cafenea”
- **Descriere:** Implementarea unei aplicații mobile bazate pe geolocație (expo-location) și hărți interactive (react-native-maps). Proiectul calculează distanțele geografice folosind formula Haversine, sortează locațiile în timp real și interoghează date reale din OpenStreetMap (cu mecanism de cădere la date demo în caz de eroare). De asemenea, include funcționalități de urmărire a poziției utilizatorului (watchPositionAsync) cu eliberare corectă a resurselor și navigare externă către punctele de interes.
- **Fișiere și Cod:** [Vezi folderul laboratorului 8](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab8)
- **Link util:** [https://snack.expo.dev/@julia7/lab8](https://snack.expo.dev/@julia7/lab8)
- **Demonstrație Video (GIF):**  

  ![Demo LAB8](LAB8.gif)

---

## Laboratorul 9: Notificări locale programate — aplicație de remindere
- **Descriere:** Implementarea unui sistem complet de notificări locale în React Native utilizând expo-notifications. Proiectul configurează canale Android și permisiuni contextuale, gestionând programarea avansată a reminderelor (după un interval, la oră exactă sau zilnic). De asemenea, include sincronizarea stării locale prin AsyncStorage cu notificările active din sistem (reconciliere) și tratarea evenimentelor de interacțiune când utilizatorul deschide o notificare.
- **Fișiere și Cod:** [Vezi folderul laboratorului 9](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab9)
- **Link util:** [https://snack.expo.dev/@julia7/lab9](https://snack.expo.dev/@julia7/lab9)
- **Demonstrație Video (GIF):**  

  ![Demo LAB9](LAB9.gif)

---

## Laboratorul 10: Refactorizare cu Context API pentru starea globală
- **Descriere:** Refactorizarea unei aplicații mobile complexe prin eliminarea prop drilling-ului și separarea clară a responsabilităților. Proiectul implementează Context API și hook-uri personalizate pentru gestionarea sesiunii (AuthContext) și a notițelor (NotesContext), utilizând optimizări de randare prin useMemo și useCallback, un reducer dedicat (useReducer) pentru starea locală, precum și un context suplimentar pentru personalizarea temei vizuale (light/dark cu persistență).
- **Fișiere și Cod:** [Vezi folderul laboratorului 10](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab10)
- **Link util:** [https://snack.expo.dev/@julia7/lab10](https://snack.expo.dev/@julia7/lab10)
- **Demonstrație Video (GIF):**  

  ![Demo LAB10](LAB10.gif)

---

## Laboratorul 11: Construirea unui build (EAS Build) — APK instalabil
- **Descriere:** Generarea unui pachet executabil nativ (APK) pentru platforma Android utilizând serviciul cloud EAS Build (Expo Application Services). Proiectul presupune configurarea fișierului eas.json pentru profilul de previzualizare (preview cu tipul apk), gestionarea automată a versiunilor, integrarea corectă a variabilelor de mediu la momentul compilării (EXPO_PUBLIC_*) și utilizarea uneltelor de diagnosticare pre-build (expo-doctor) pentru optimizarea resurselor și evitarea erorilor în cloud.
- **Fișiere și Cod:** [Vezi folderul laboratorului 11](https://github.com/juliaoshurco07-debug/juliaoshurco07.github.io/tree/main/lab11)
- **Link util:** [https://snack.expo.dev/@julia7/lab11](https://snack.expo.dev/@julia7/lab11)
- **Demonstrație Video (GIF):**  

  ![Demo Lab 11](LAB11.gif)

---

## Tehnologii Utilizate
- **Framework-uri & Limbaje:** React Native, Expo, JavaScript, Python
- **Instrumente:** Git, GitHub Pages, VS Code

---
© 2026 - Oșurco Iulia | Grupa IT2401
