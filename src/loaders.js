import { GLTFLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { createDesktopTexture } from "./screen.js";

export const keyObjects = new Map(); // Store key objects by their names

// Centralized model loading
export function loadModels(scene, onAllModelsLoaded) {
    const collisionObjects = [];
    let mac, table, garage, imacg3, appleII;
    let modelsLoaded = 0;
    const totalModels = 5; // Update this if new models are added
    
    // Éléments du préchargeur
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = preloader.querySelector('p');

    function modelLoaded() {
        modelsLoaded++;
        // Mettre à jour la barre de progression
        const progress = (modelsLoaded / totalModels) * 100;
        progressBar.style.width = `${progress}%`;
        loadingText.textContent = `Chargement des modèles 3D... (${modelsLoaded}/${totalModels})`;
        
        if (modelsLoaded === totalModels) {
            // Masquer le préchargeur avec une transition en fondu
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500); // Attendre un peu pour que l'utilisateur voie 100%
            
            onAllModelsLoaded({ mac, table, garage, imacg3, appleII, collisionObjects });
        }
    }

    // Load each model
    const loader = new GLTFLoader();
    
    // Gestionnaire de progression global
    loader.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Progression: ${itemsLoaded} / ${itemsTotal}`);
    };

    // Macintosh 1984
    loader.load('assets/models/macintosh1984.glb', (gltf) => {
        mac = gltf.scene;
        mac.position.set(2, -1.6, 4.3);
        mac.scale.set(8, 8, 8);
        mac.traverse((child) => {
            if (child.isMesh) {
                const name = child.name || `Unnamed_${keyObjects.size}`; // If object has no name
                keyObjects.set(name.toUpperCase(), child); // Index object by its name
            }
        });
        scene.add(mac);
        modelLoaded();
    });

    // Table
    loader.load('assets/models/table.glb', (gltf) => {
        table = gltf.scene;
        table.position.set(0, -4.3, 1);
        table.rotation.set(0, 4.7, 0);
        table.scale.set(6, 6, 6);
        scene.add(table);
        collisionObjects.push(table); // Add table for collisions
        modelLoaded();
    });

    // Garage
    loader.load('assets/models/garage.glb', (gltf) => {
        garage = gltf.scene;
        garage.position.set(0, -7, 10);
        garage.scale.set(2, 2, 2);
        scene.add(garage);
        modelLoaded();
    });

    // iMac G3
    loader.load('assets/models/imac_g3.glb', (gltf) => {
        imacg3 = gltf.scene;
        imacg3.position.set(-19, 0.5, -4);
        imacg3.scale.set(5, 5, 5);
        imacg3.rotation.y = Math.PI;
        scene.add(imacg3);
        modelLoaded();
    });

    // Apple II
    loader.load('assets/models/apple_ii.glb', (gltf) => {
        appleII = gltf.scene;
        appleII.position.set(2, -1.8, 20);
        appleII.scale.set(0.7, 0.7, 0.7);
        appleII.rotation.y = Math.PI;
        scene.add(appleII);
        modelLoaded();
    });
}
