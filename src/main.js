// Imports
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { createScene, createCamera, createRenderer } from './scene.js';
import { loadMacintosh, loadTable, keyObjects } from './loaders.js';
import { createGUI } from './gui.js';
import {
    createScreen,
    simulateBootSequence,
    enableScreenInteraction,
    createPopup,
    createDesktopTexture,
    updateMacintoshScreen
} from './screen.js';
import { createAnimation } from './animations.js';

// Initialisation de la scène, de la caméra et du renderer
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
document.body.appendChild(renderer.domElement);

// Contrôles de la caméra
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Variables globales
let mac, table;
let isInteracting = false; // Suivi de l'état d'interaction
let bootCompleted = false; // Suivi de l'état du boot
let bootRequested = false; // Suivi si Enter a été pressé avant le chargement
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const macintoshPopups = [];

// Fonction principale
function main() {
    loadModels();
    setupEventListeners();
    animate();
}

// Section 1 : Chargement des Modèles
function loadModels() {
    loadTable(scene, (loadedTable) => {
        table = loadedTable;
    });

    loadMacintosh(scene, (loadedMac) => {
        mac = loadedMac;

        // Créer l'écran pour le Macintosh
        const { screenCanvas, screenMesh, screenContext, screenTexture } = createScreen(mac);
        mac.screenResources = { screenCanvas, screenMesh, screenContext, screenTexture };

        if (bootRequested) {
            startBootSequence();
        }

        // Ajouter les pop-ups
        addPopups();

        // Initialiser le GUI
        if (table) {
            if (screenTexture.image) {
                createGUI(mac, table, mac.screenResources, macintoshPopups);
            } else {
                const checkTextureReady = setInterval(() => {
                    if (screenTexture.image) {
                        createGUI(mac, table, mac.screenResources, macintoshPopups);
                        clearInterval(checkTextureReady);
                    }
                }, 100);
            }
        }
    });
}

// Section 2 : Gestion des Pop-Ups
function addPopups() {
    const popupData = [
        {
            text: "Bienvenue sur Macintosh\nL’interface graphique révolutionnaire.",
            position: { x: -4.4, y: 0.9, z: -1 },
            screenImage: 'assets/screenshots/boot_step1.png'
        },
        {
            text: "MacWrite :\nUn des premiers traitements de texte\navec WYSIWYG.",
            position: { x: -4.4, y: 0.9, z: -1 },
            screenImage: 'assets/screenshots/macwrite.png'
        },
        {
            text: "MacPaint :\nOutil révolutionnaire pour le dessin numérique.",
            position: { x: -4.4, y: 0.9, z: -1 },
            screenImage: 'assets/screenshots/macpaint.png'
        },
        {
            text: "Le Finder :\nOrganisez vos fichiers et dossiers avec simplicité.",
            position: { x: -4.4, y: 0.9, z: -1 },
            screenImage: 'assets/screenshots/desktop.png'
        }
    ];

    popupData.forEach((info) => {
        const popup = createPopup(info.text, new THREE.Vector3(info.position.x, info.position.y, info.position.z));
        scene.add(popup);
        info.popup = popup;
        popup.visible = false; // Masquer les pop-ups par défaut
        macintoshPopups.push(info);
    });
}

function showPopup(index) {
    macintoshPopups.forEach((info, i) => {
        info.popup.visible = (i === index); // Afficher uniquement le pop-up correspondant
    });

    const selectedInfo = macintoshPopups[index];
    if (selectedInfo) {
        updateMacintoshScreen(
            mac.screenResources.screenContext,
            mac.screenResources.screenTexture,
            selectedInfo.screenImage
        );
    }
}

function hideAllPopups() {
    macintoshPopups.forEach((info) => {
        info.popup.visible = false;
    });
}

// Section 3 : Gestion des Événements
function setupEventListeners() {
    // Gérer les clics dans la scène
    window.addEventListener('click', (event) => {
        // Normaliser les coordonnées de la souris
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Définir le raycaster
        raycaster.setFromCamera(mouse, camera);

        // Vérifier les intersections avec les pop-ups
        const intersects = raycaster.intersectObjects(macintoshPopups.map(info => info.popup), true);
        if (intersects.length > 0) {
            macintoshPopups.forEach((info) => {
                info.popup.visible = false;
            });

            const intersectedPopup = intersects[0].object;
            const selectedInfo = macintoshPopups.find((info) => info.popup === intersectedPopup);
            if (selectedInfo) {
                selectedInfo.popup.visible = true;
                updateMacintoshScreen(
                    mac.screenResources.screenContext,
                    mac.screenResources.screenTexture,
                    selectedInfo.screenImage
                );
            }
        }
    });

    // Gestion des événements clavier
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (!bootCompleted) {
            if (key === 'enter') {
                bootRequested = true;
                startBootSequence();
            }
            return;
        }

        if (isInteracting) {
            if (key === 'escape') {
                stopInteraction();
            } else {
                handleInteractionKey(event.key.toUpperCase());
            }
        } else {
            handleMovementKeys(key);
        }
    });

    // Ajuster la taille de la fenêtre
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
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
    controls.update();
    renderer.render(scene, camera);
}

// Lancer le programme principal
main();
