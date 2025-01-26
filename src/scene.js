
import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

export function createScene() {
    const scene = new THREE.Scene();


    // Ajouter les lumières
    const ambientLight = new THREE.AmbientLight(0xfff5cc, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.7);
    directionalLight.position.set(-4.9, -10.3, 8);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    addBackgroundImage(scene)


    return { scene, ambientLight, directionalLight };
}


export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 2.5;
    create3DPointer(camera);
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
}

function addBackgroundImage(scene) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/images/background.jpg', (texture) => {
        const geometry = new THREE.PlaneGeometry(20, 10); // Taille du plan (adapter selon votre scène)
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide, // Permet de rendre visible des deux côtés
        });
        const backgroundPlane = new THREE.Mesh(geometry, material);

        // Positionner le plan derrière le garage
        backgroundPlane.position.set(6.5, 5, -17);
        backgroundPlane.scale.set(3,3,3);// Ajuster selon votre scène
        backgroundPlane.rotation.y = Math.PI; // Retourner si nécessaire

        scene.add(backgroundPlane);
    });
}

function create3DPointer(camera) {
    // Charger la texture de l'image
    const textureLoader = new THREE.TextureLoader();
    const cursorTexture = textureLoader.load('assets/icons/hand.png');

    // Créer un matériau avec la texture
    const cursorMaterial = new THREE.SpriteMaterial({ map: cursorTexture });

    // Créer un Sprite (plane toujours orienté vers la caméra)
    const cursor = new THREE.Sprite(cursorMaterial);

    // Ajuster la taille du curseur
    cursor.scale.set(0.2, 0.2, 0.2); // Adapter la taille du pointeur

    // Positionner le pointeur devant la caméra
    cursor.position.set(0, 0, -1); // 1 unité devant la caméra

    // Ajouter le curseur comme enfant de la caméra
    camera.add(cursor);
}

export function addBoundingWallsForObject(object, scene, collisionObjects) {
    const box = new THREE.Box3().setFromObject(object); // Get the object's bounding box
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size); // Get the dimensions of the bounding box
    box.getCenter(center); // Get the center of the bounding box

    // Create four walls around the object
    const wallThickness = 0.1; // Thickness of the walls

    const walls = [
        // Front wall
        createWall(
            size.x,
            10000,
            new THREE.Vector3(center.x, center.y, box.max.z + wallThickness / 2)
        ),
        // Back wall
        createWall(
            size.x,
            10000,
            new THREE.Vector3(center.x, center.y, box.min.z - wallThickness / 2)
        ),
        // Left wall
        createWall(
            size.z, // Wall width becomes thickness
            1000,        // Use the object's height for the wall// Wall length
            new THREE.Vector3(box.min.x - wallThickness / 2, center.y, center.z), // Position
            Math.PI / 2    // Rotation around Y-axis for lateral walls
        ),
        // Right wall
        createWall(
            size.z,// Wall width becomes thickness
            1000,        // Use the object's height for the wall// Wall length
            new THREE.Vector3(box.max.x + wallThickness / 2, center.y, center.z), // Position
            Math.PI / 2    // Rotation around Y-axis for lateral walls
        )
    ];

    // Add the walls to the scene and collisionObjects array
    walls.forEach((wall) => {
        scene.add(wall);
        collisionObjects.push(wall);
    });

    console.log(collisionObjects);

    return collisionObjects;
}

function createWall(width, height, position, rotationY = 0) {
    const geometry = new THREE.BoxGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Red for debugging (change as needed)
        transparent: true,
        opacity: 0,    // Slightly transparent for debugging
    });
    const wall = new THREE.Mesh(geometry, material);

    wall.position.copy(position);

    // Apply rotation if needed
    wall.rotation.y = rotationY;
    wall.visible = false;

    return wall;
}



export function createWalls(scene, collisionObjects) {
    const walls = [];
    const wallMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White walls
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5, // Adjust visibility for debugging
    });

    const wallGeometry = new THREE.BoxGeometry(50, 10, 0.5); // Adjust size for your scene

    // Define wall positions and rotations
    const wallPositions = [
        { x: 0, y: 5, z: -10 }, // Front wall
        { x: 0, y: 5, z: 20 }, // Back wall
        { x: -17, y: 5, z: 0, rotationY: Math.PI / 2 }, // Left wall
        { x: 17, y: 5, z: 0, rotationY: Math.PI / 2 }, // Right wall
    ];

    wallPositions.forEach((pos) => {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(pos.x, pos.y, pos.z);
        if (pos.rotationY) wall.rotation.y = pos.rotationY;
        walls.push(wall);
    });

    walls.forEach((wall) => {
        scene.add(wall);
        wall.visible = false;
        collisionObjects.push(wall);
    });



    return walls;
}

