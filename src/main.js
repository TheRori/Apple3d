// Imports
import * as THREE from 'three';
import { PointerLockControls } from 'https://unpkg.com/three@0.150.1/examples/jsm/controls/PointerLockControls.js';
import { createScene, createCamera, createRenderer, createWalls,addBoundingWallsForObject } from './scene.js';
import {loadModels} from './loaders.js';
import { createGUI } from './gui.js';

import {
    createScreen,
    simulateBootSequence,
    createDesktopTexture,
    updateMacintoshScreen
} from './screen.js';

import { addPopups, showPopup } from './popup.js';
import { createAnimation } from './animations.js';
import {setupFPSControls} from "./fpscontrol.js";
import {soundManager} from "./sounds.js";
import {checkCollisionsStop} from "./utils.js";

// Initialisation de la scène, de la caméra et du renderer
const camera = createCamera();
const renderer = createRenderer();
const { scene, ambientLight, directionalLight } = createScene();

document.body.appendChild(renderer.domElement);



// Variables globales
let mac, table,garage, imacg3, appleII;
let isInteracting = false; // Suivi de l'état d'interaction
let bootCompleted = false; // Suivi de l'état du boot
let bootRequested = false; // Suivi si Enter a été pressé avant le chargement
let macintoshPopups = [], imacg3Popups = [],appleIIPopups = [];
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isMoving = false; // Évite de rejouer le son si l'utilisateur maintient une touche enfoncée
let collisionObjects = [];
let velocity = new THREE.Vector3(); // Vitesse de mouvement
const moveSpeed = 5.0; // Vitesse de déplacement
const damping = 0.9; // Amortissement du mouvement
const clock = new THREE.Clock();

let controls; // PointerLockControls global

const popupDataMacintosh = [
    {
        name: "Macintosh 1984",
        text: "Lancé en 1984, le Macintosh était bien plus qu'un ordinateur. Il symbolisait une révolution dans le monde de la technologie : un design compact, une interface utilisateur accessible et des logiciels innovants. Il a jeté les bases de l'informatique personnelle moderne.",
        region: { x: -0.28, y: 0.1,z:-.29, width: .05, height: .05 },
        position: { x: -2.5, y: -0.66, z: 1.9 },
        screenImage: 'assets/screenshots/macintosh1984_desktop.png'
    },
    {
        name: "MacWrite",
        text: "MacWrite est l'un des premiers traitements de texte WYSIWYG (What You See Is What You Get). Ce logiciel permet de rédiger et de formater des documents exactement comme ils apparaîtront une fois imprimés, une véritable révolution à l'époque.",
        region: { x: -.17, y: .28,z:-.3, width: 0.05, height: 0.05 }, // Position sur l'écran
        position: { x: -2.5, y: -0.66, z: 1.9 },
        screenImage: "assets/screenshots/macintosh1984_macwrite.png",
    },
    {
        name: "MacPaint",
        text: "MacPaint est un logiciel graphique révolutionnaire, offrant des outils simples mais puissants pour créer des illustrations numériques. L'interface intuitive a inspiré les bases de nombreux logiciels de design actuels.",
        region: { x: -0.25, y: .28,z:-.3, width: .05, height: .05 }, // Position sur l'écran
        position: { x: -2.5, y: -0.66, z: 1.9 },
        screenImage: "assets/screenshots/macintosh1984_macpaint.png",
    },
    {
        name: "Finder",
        text: "Avec son interface utilisateur révolutionnaire, le Macintosh 1984 introduit une navigation visuelle intuitive. Fini les lignes de commande : place aux fenêtres, icônes et menus déroulants qui simplifient l'accès aux fonctionnalités.",
        region: { x: -0.125, y: 0.24,z:-.3, width: .05, height: .05 },
        position: { x: -2.5, y: -0.66, z: 1.9 },
        screenImage: 'assets/screenshots/macintosh1984_ui.png'
    },
    {
        name: "Souris",
        text: "Le Macintosh 1984 démocratise l'usage de la souris, un périphérique innovant à l'époque. Elle permet de pointer, cliquer et interagir directement avec les éléments affichés à l'écran, rendant l'informatique plus accessible que jamais.",
        region: { x: 0.1, y: 0,z:-0.08, width: .1, height: .1 },
        position: { x: -2.5, y: -0.66, z: 0.9 },
        screenImage: ''
    },
    {
        name: "Contrôle technique",
        text: "Macintosh 1984\n- Processeur : Motorola 68000 (8 MHz)\n- Écran : 9 pouces monochrome (512x342 px)\n- RAM : 128 Ko\n- Stockage : Disquettes de 400 Ko\n- Prix : 2 495 $ (~6 500 $ actuels)",
        region: {x: -0.2, y: 0.15, z: -0.6, width: 0.2, height: 0.2},
        position: {
            x: -2.5,
            y: -0.66,
            z: 0.9,
            rotation: {x: 0, y: Math.PI, z: 0,} // Rotation 180° autour de l'axe Y
        },
        screenImage: ''
    }]
const popupDataAppleII = [
    {
        name: "Apple II",
        text: "Lancé en 1977, l'Apple II a été l'un des premiers ordinateurs personnels à succès. Avec son boîtier élégant, il était destiné aussi bien aux entreprises qu'aux particuliers, et a marqué le début de l'ère de l'informatique personnelle.",
        region: { x: -1.2, y: 0.81, z: -10.3, width: 1, height: 1, rotation: { x: 0, y: 0, z: 0 } },
        position: { x: 0, y: .8, z: 25, rotation: { x: 0, y: Math.PI, z: 0 } },
        screenImage: 'assets/screenshots/appleii_desktop.png'
    },
    {
        name: "Contrôle technique",
        text: "Apple II (1977)\n- Processeur : MOS Technology 6502 (1 MHz)\n- RAM : 4 Ko (extensible à 48 Ko)\n- Graphismes : 280x192 px en couleur\n- Stockage : Cassette, puis lecteur de disquettes (Disk II)\n- Prix : 1 298 $ (~5 800 $ actuels)",
        region: { x: 0.2, y: 0.15, z: -10.3, width: 1, height: 1, rotation: { x: 0, y: 0, z: 0 } },
        position: { x: 0, y: .8, z: 25, rotation: { x: 0, y: Math.PI, z: 0 } },
        screenImage: ''
    }
];
const popupDataImacG3 = [
    {
        name: "iMac G3",
        text: "Lancé en 1998, l'iMac G3 a révolutionné l'industrie informatique avec son design coloré, ses fonctionnalités tout-en-un et son focus sur la simplicité. Conçu par Jony Ive et présenté par Steve Jobs, il a marqué le renouveau d'Apple.",
        region: { x: .2, y: 0.41,z:-.19, width: .1, height: .1, rotation: {x: 0, y: Math.PI/2, z: 0,} },
        position: { x: -19, y: 2,z: -6, rotation: {x: 0, y: Math.PI/2, z: 0,} },
        screenImage: 'assets/screenshots/macintosh1984_desktop.png'
    },
    {
        name: "Caractéristiques techniques",
        text: "iMac G3\n- Processeur : PowerPC G3 (233 à 700 MHz)\n- Écran : CRT 15 pouces (1024x768 px)\n- RAM : 32 Mo (extensible à 1 Go)\n- Stockage : Disques durs de 4 Go à 128 Go\n- Connectivité : USB, Ethernet, pas de lecteur disquette\n- Prix : 1 299 $ (~2 100 $ actuels)",
        region: {x: 0.2, y: 0.15, z: -0.55, width: 0.2, height: 0.2, rotation: {x: 0, y: Math.PI/2, z: 0,} },
        position: { x: -19, y: 2,z: -6, rotation: {x: 0, y: Math.PI/2, z: 0,} },
        screenImage: ''
    }]

// Fonction principale
function main() {
    // Load all models
    loadModels(scene, ({ mac: loadedMac, table: loadedTable, garage: loadedGarage, imacg3: loadedIMac, appleII: loadedAppleII, collisionObjects: loadedCollisionObjects }) => {
        mac = loadedMac;
        table = loadedTable;
        garage = loadedGarage;
        imacg3 = loadedIMac;
        appleII = loadedAppleII;

        // Add collision objects
        collisionObjects.push(...loadedCollisionObjects);
        addPopups(scene,popupDataMacintosh, macintoshPopups, mac);
        addPopups(scene,popupDataImacG3, imacg3Popups, imacg3);
        addPopups(scene,popupDataAppleII,appleIIPopups,appleII);
        const { screenCanvas, screenMesh, screenContext, screenTexture } = createScreen(mac);
        mac.screenResources = { screenCanvas, screenMesh, screenContext, screenTexture };

        // Add the screen mesh to the Macintosh model
        mac.add(screenMesh);

        // Set a default screen image
        updateMacintoshScreen(screenContext, screenTexture, "assets/screenshots/macintosh1984_desktop.png");
        createWalls(scene, collisionObjects);
        addBoundingWallsForObject(table,scene,collisionObjects);
        // // Initialize GUI after models are loaded
        // initializeGUI(mac, table, garage);
    });
    soundManager.loadSounds();
    controls = setupFPSControls(camera, scene);
    setupEventListeners(
        camera,
        renderer,
        soundManager
    );
    animate();
}

function allResourcesReady() {
    return mac && table && garage && mac.screenResources?.screenTexture?.image;
}

function initializeGUI() {
    if (allResourcesReady()) {
        createGUI(appleII, table, garage,ambientLight,directionalLight, mac.screenResources, macintoshPopups);
    }
}

// Section 3 : Gestion des Événements
function setupEventListeners(camera, renderer, soundManager) {


    // Fonction utilitaire pour gérer les clics sur un modèle
    function handleModelClicks(model, popups, mouse, raycaster) {
        const intersects = raycaster.intersectObject(model, true); // Vérifie tous les enfants du modèle

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log('intersec')
            // Vérifier si l'objet cliqué est une zone définie

            const clickedZone = popups.find((icon) => icon.name === clickedObject.name);
            if (clickedZone) {
                console.log(`Zone cliquée : ${clickedZone.name}`);
                soundManager.play('mouseClick');
                const selectedInfo = showPopup(popups.indexOf(clickedZone), popups);

                if (selectedInfo && model === mac) {
                    updateMacintoshScreen(
                        model.screenResources.screenContext,
                        model.screenResources.screenTexture,
                        selectedInfo.screenImage
                    );
                }
            }
        }
    }

    // Fonction utilitaire pour gérer les clics sur les pop-ups
    function handlePopupClicks(popups, mouse, raycaster) {
        const intersectsPopup = raycaster.intersectObjects(
            popups.map((icon) => icon.popup), // Obtenir tous les popups
            true
        );

        if (intersectsPopup.length > 0) {
            const clickedPopup = intersectsPopup[0].object;
            const uv = intersectsPopup[0].uv;
            const clickX = uv.x * clickedPopup.material.map.image.width;
            const clickY = (1 - uv.y) * clickedPopup.material.map.image.height;

            popups.forEach((icon) => {
                if (icon.popup === clickedPopup) {
                    const { houseRegion } = icon.popup;

                    if (
                        clickX >= houseRegion.x &&
                        clickX <= houseRegion.x + houseRegion.width &&
                        clickY >= houseRegion.y &&
                        clickY <= houseRegion.y + houseRegion.height
                    ) {
                        console.log(`Retour au bureau depuis le pop-up : ${icon.name}`);
                        soundManager.play('mouseClick');
                        returnToDesktop(popups);
                    }
                }
            });
        }
    }

    // Gestion des clics dans la scène
    function handleMouseClick(event) {
        const mouse = new THREE.Vector2(0, 0.1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Vérifier les clics sur les différents modèles
        console.log(macintoshPopups,'hey');
        handleModelClicks(mac, macintoshPopups, mouse, raycaster);
        if (imacg3) handleModelClicks(imacg3, imacg3Popups, mouse, raycaster);
        if (appleII) handleModelClicks(appleII, appleIIPopups, mouse, raycaster);

        // Vérifier les clics sur les popups
        handlePopupClicks(macintoshPopups, mouse, raycaster);
        handlePopupClicks(imacg3Popups, mouse, raycaster);
        handlePopupClicks(appleIIPopups, mouse, raycaster);
    }

    // Gestion des touches pour les déplacements
    function handleKeyDown(event) {
        const key = event.key.toLowerCase();

        switch (event.code) {
            case 'KeyW': moveForward = true; console.log('avancer'); break; // Avancer
            case 'KeyS': moveBackward = true; break; // Reculer
            case 'KeyA': moveLeft = true; break; // Aller à gauche
            case 'KeyD': moveRight = true; break; // Aller à droite
        }

        if (['w', 'a', 's', 'd'].includes(key) && !isMoving) {
            soundManager.play('footstep');
            isMoving = true;
        }
    }

    function handleKeyUp(event) {
        const key = event.key.toLowerCase();

        switch (event.code) {
            case 'KeyW': moveForward = false; break;
            case 'KeyS': moveBackward = false; break;
            case 'KeyA': moveLeft = false; break;
            case 'KeyD': moveRight = false; break;
        }

        if (['w', 'a', 's', 'd'].includes(key) && isMoving) {
            soundManager.stop('footstep');
            isMoving = false;
        }
    }

    // Ajuster la taille de la fenêtre
    function handleResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    // Ajout des écouteurs d'événements
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('resize', handleResize);
}

export function returnToDesktop(macintoshPopups) {
    console.log('Retour au bureau');
    updateMacintoshScreen(mac.screenResources.screenContext, mac.screenResources.screenTexture, 'assets/screenshots/macintosh1984_desktop.png');
    // Masquer tous les pop-ups
    macintoshPopups.forEach((info) => {
        info.popup.visible = false;

        if (info.circleMesh) {
            info.circleMesh.visible = true; // Réafficher le rond clignotant
        }
    });
}


// Section 4 : Boot Sequence
function startBootSequence() {
    if (bootCompleted) return;

    bootCompleted = true;
    if (mac) {
        const { screenContext, screenTexture } = mac.screenResources;
        simulateBootSequence(screenContext, screenTexture, () => {
            const { texture } = createDesktopTexture();
            mac.screenResources.screenMesh.material.map = texture;
        });
    }
}

// Section 5 : Animation
function animate() {
    requestAnimationFrame(animate);
    if (controls.isLocked) {
        const delta = clock.getDelta(); // Time elapsed since the last frame

        velocity.x -= velocity.x * damping * delta;
        velocity.z -= velocity.z * damping * delta;

        const movement = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();

        // Calculate movement based on keys
        camera.getWorldDirection(direction); // Forward direction
        right.crossVectors(camera.up, direction).normalize(); // Right direction
        if (moveForward) movement.addScaledVector(direction, moveSpeed * delta);
        if (moveBackward) movement.addScaledVector(direction, -moveSpeed * delta);
        if (moveLeft) movement.addScaledVector(right, moveSpeed * delta);
        if (moveRight) movement.addScaledVector(right, -moveSpeed * delta);

        // Ignore movement in the Y-axis
        movement.y = 0;

        // Check collisions (infinite height logic)
        const newPosition = camera.position.clone().add(movement);
        if (!checkCollisionsStop(newPosition,collisionObjects)) {
            camera.position.add(movement); // Move if no collision
        }
    }

    renderer.render(scene, camera);
}

// Lancer le programme principal
main();
