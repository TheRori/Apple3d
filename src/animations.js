import { gsap } from 'https://cdn.skypack.dev/gsap';

// Animation pour une touche standard
export function createAnimation(keyObject) {
    gsap.to(keyObject.position, {
        y: keyObject.position.y - 0.01, // Descend légèrement
        duration: 0.1,
        yoyo: true, // Revient à la position initiale
        repeat: 1,
        ease: 'power1.inOut',
    });
}

// Animation pour des touches spéciales comme Space ou Enter
export function animateSpecialKey(keyObject, key) {
    if (key === 'SPACE') {
        gsap.to(keyObject.scale, {
            x: 1.1, y: 1.1, z: 1.1, // Élargit légèrement
            duration: 0.1,
            yoyo: true,
            repeat: 1,
        });
    } else if (key === 'ENTER') {
        gsap.to(keyObject.rotation, {
            z: Math.PI / 8, // Rotation légère
            duration: 0.1,
            yoyo: true,
            repeat: 1,
        });
    }
}
