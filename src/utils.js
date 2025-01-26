import * as THREE from "three";

export function checkCollisionsStop(newPosition, collisionObjects) {
    const raycaster = new THREE.Raycaster();
    const directions = [
        new THREE.Vector3(-1, 0, 0), // Left
        new THREE.Vector3(1, 0, 0),  // Right
        new THREE.Vector3(0, 0, -1), // Forward
        new THREE.Vector3(0, 0, 1),  // Backward
    ];

    for (const dir of directions) {
        // Ignore Y-axis for collision checks
        const rayOrigin = new THREE.Vector3(newPosition.x, 0, newPosition.z); // Flatten Y
        raycaster.set(rayOrigin, dir);

        const intersects = raycaster.intersectObjects(collisionObjects, true);

        if (intersects.length > 0 && intersects[0].distance < 1) {
            console.log(`Collision detected : ${dir.x}, ${dir.y}, ${dir.z}`);
            return true; // Collision detected
        }
    }

    return false; // No collision detected
}

