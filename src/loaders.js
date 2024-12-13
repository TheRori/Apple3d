import { GLTFLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.150.1/examples/jsm/loaders/OBJLoader.js';
import {createDesktopTexture} from "./screen.js";

export const keyObjects = new Map(); // Stocke les touches par leur nom

export function loadMacintosh(scene, callback) {
    const loader = new GLTFLoader();
    loader.load('assets/models/macintosh1984.glb', (gltf) => {
        const mac = gltf.scene;
        mac.traverse((child) => {
            if (child.isMesh) {
                const name = child.name || `Unnamed_${keyObjects.size}`; // Si l'objet n'a pas de nom
                keyObjects.set(name.toUpperCase(), child); // Indexer l'objet par son nom
            }
        });
        mac.position.set(0, 0, 3.1);
        mac.scale.set(8, 8, 8);
        scene.add(mac);
        callback(mac);
    });
}

export function attachDesktopToScreen(mac) {
    const { texture } = createDesktopTexture();

    // Récupérer le screenMesh
    const screenMesh = mac.screenResources.screenMesh;

    // Appliquer la texture au matériau de l'écran
    screenMesh.material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    return texture; // Retourner la texture pour des mises à jour dynamiques
}

export function loadTable(scene, callback) {
    const objLoader = new OBJLoader();
    objLoader.load('assets/models/table.obj', (table) => {
        table.position.set(0, -7.4, 0);
        table.scale.set(1.5, 1.5, 1.5);
        scene.add(table);
        callback(table);
    });
}
