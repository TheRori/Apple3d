# **Simulation 3D Interactive : Macintosh 1984, iMac G3, et Apple II**

## **Description**
Ce projet propose une simulation interactive en 3D mettant en scène des modèles emblématiques d’ordinateurs Apple, tels que le Macintosh 1984, l'iMac G3 et l'Apple II. L’objectif est de permettre une médiation ludique et pédagogique autour de ces machines historiques, en illustrant leurs spécifications techniques et innovations via des **pop-ups interactifs**.

### **Fonctionnalités principales :**
- Déplacement en vue à la première personne (**WASD** et **souris**).
- Interactions avec des zones cliquables pour afficher des **pop-ups informatifs**.
- Affichage de captures d'écran des systèmes d'exploitation et des logiciels emblématiques.
- Animation visuelle des zones interactives pour guider l'utilisateur.
- Bruits d'ambiance et de clics pour renforcer l'immersion.

---

## **Capture d'écran GIF**
![overview.gif](assets/presentation/overview.gif)
---

## **Procédure d’installation et de lancement**

### **Prérequis**
- [Node.js](https://nodejs.org/) installé sur votre machine.
- [Three.js](https://threejs.org/) inclus comme dépendance via un gestionnaire ou directement intégré via un CDN.

### **Étapes d'installation**
1. Clonez ce dépôt Git :
   ```bash
   git clone https://github.com/TheRori/Apple3d

2. Installez les dépendances nécessaires avec un gestionnaire comme npm (si applicable) :

    ```bash
    npm install
    ```

Placez ensuite les ressources dans le dossier `assets` (modèles GLB, textures, sons, etc.).


3. Lancement : Ouvrez un serveur local dans le dossier du projet :

    ```bash
    npx http-server
    ```

Accédez à l’application via votre navigateur à l’adresse [http://localhost:8080](http://localhost:8080).

---

## Modules et bibliothèques utilisés

- **Three.js** : Pour la gestion de la scène 3D et des interactions.
- **GLTFLoader** : Pour charger les modèles 3D au format `.glb`.
- **PointerLockControls** : Pour le contrôle FPS.
- **Sons** : Formats `.mp3` intégrés pour l’ambiance sonore et les interactions.
- **Canvas API** : Pour dessiner les pop-ups dynamiques.
- **Unpkg CDN** : Pour charger des dépendances directement depuis le web.

---

## Démo hébergée en ligne sur Netify

[Démo](https://therori2.netlify.app/)

---

## Sources et crédits

- **Modèles 3D** : Tous les modèles utilisés proviennent de Blender ou de dépôts open-source (spécifiez les liens si applicables).
- **Textures et icônes** : Les captures d’écran et icônes proviennent de versions légitimes ou de créations personnelles.
- **Bibliothèques** :
    - [Three.js](https://threejs.org/)
- **Audio** : fourni par des sites libres de droits tels que [Freesound](https://freesound.org/).

---

## Contexte de développement

Ce projet a été développé dans le cadre du cours *Réalité virtuelle* dispensé par Isaac Pante dans le cadre d'un cours en master d'humanités numériques de l'Université de Lausanne (UNIL). L'objectif pédagogique était d'explorer la création d'environnements interactifs en 3D à l'aide de Three.js et d'autres outils numériques.

---

## Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser et de le modifier à des fins personnelles ou pédagogiques, à condition de créditer l'auteur.