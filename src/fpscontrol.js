import { PointerLockControls } from 'https://unpkg.com/three@0.150.1/examples/jsm/controls/PointerLockControls.js';

export function setupFPSControls(camera, scene) {
    const controls = new PointerLockControls(camera, document.body);
    const customPointer = document.getElementById('custom-pointer');

    // Activer les contrôles au clic
    document.addEventListener('click', () => {
        controls.lock(); // Capture le curseur
    });

    // Événements pour savoir si le contrôle est activé ou non
    controls.addEventListener('lock', () => {
        console.log('Pointer locked');
        // Afficher le pointeur personnalisé (cercle gris clair)
        if (customPointer) {
            customPointer.style.display = 'block';
        }
    });

    controls.addEventListener('unlock', () => {
        console.log('Pointer unlocked');
        // Cacher le pointeur personnalisé
        if (customPointer) {
            customPointer.style.display = 'none';
        }
    });

    scene.add(controls.getObject()); // Ajoutez le contrôleur FPS à la scène
    return controls;
}
