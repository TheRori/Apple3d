import { PointerLockControls } from 'https://unpkg.com/three@0.150.1/examples/jsm/controls/PointerLockControls.js';

export function setupFPSControls(camera, scene) {
    const controls = new PointerLockControls(camera, document.body);

    // Activer les contrôles au clic
    document.addEventListener('click', () => {
        controls.lock(); // Capture le curseur
    });

    // Événements pour savoir si le contrôle est activé ou non
    controls.addEventListener('lock', () => {
        console.log('Pointer locked');
    });

    controls.addEventListener('unlock', () => {
        console.log('Pointer unlocked');
    });

    scene.add(controls.getObject()); // Ajoutez le contrôleur FPS à la scène
    return controls;
}
