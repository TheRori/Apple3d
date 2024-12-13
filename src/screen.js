import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

// Crée l'écran du Macintosh
export function createScreen(mac) {
    const screenGeometry = new THREE.PlaneGeometry(2, 1.5); // Dimensions ajustées à l'écran
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 384;
    const screenContext = screenCanvas.getContext('2d');

    // Dessiner un fond initial
    screenContext.fillStyle = '#C0C0C0';
    screenContext.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);

    // Positionner, scaler et orienter le plan sur l'écran du modèle
    screenMesh.position.set(-0.2, 0.24, -0.31);
    screenMesh.scale.set(0.1, 0.1, 0.1);
    screenMesh.rotation.set(-0.1, 0, 0);
    mac.add(screenMesh);

    return { screenCanvas, screenMesh, screenContext, screenTexture };
}

// Simule la séquence de démarrage
export function simulateBootSequence(screenContext, screenTexture, onBootComplete) {
    // Étape 1 : Écran noir
    screenContext.fillStyle = 'black';
    screenContext.fillRect(0, 0, screenContext.canvas.width, screenContext.canvas.height);
    screenTexture.needsUpdate = true;

    setTimeout(() => {
        // Étape 2 : Message "Welcome to Macintosh"
        screenContext.fillStyle = '#C0C0C0';
        screenContext.fillRect(0, 0, screenContext.canvas.width, screenContext.canvas.height);

        screenContext.fillStyle = 'white';
        screenContext.fillRect(60, 100, 400, 180);

        screenContext.strokeStyle = 'black';
        screenContext.lineWidth = 2;
        screenContext.strokeRect(60, 100, 400, 180);

        screenContext.font = '20px monospace';
        screenContext.fillStyle = 'black';
        screenContext.fillText('Welcome to Macintosh.', 110, 190);
        screenTexture.needsUpdate = true;

        // Vérification : Appel du callback
        setTimeout(() => {
            console.log('Simulation terminée, exécution de onBootComplete...');
            if (typeof onBootComplete === 'function') {
                onBootComplete(); // Appel du callback
            } else {
                console.error('onBootComplete n’est pas une fonction valide.');
            }
        }, 2000); // Temps additionnel avant la fin de la séquence
    }, 1000);
}


export function createDesktopTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; // Résolution du bureau
    canvas.height = 768;

    const context = canvas.getContext('2d');

    // Fond du bureau
    context.fillStyle = '#C0C0C0';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Barre de menu
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, 30);

    context.fillStyle = '#000000';
    context.font = '20px monospace';
    context.fillText('File', 10, 20);
    context.fillText('Edit', 60, 20);
    context.fillText('View', 120, 20);
    context.fillText('Special', 200, 20);

    // Icônes sur le bureau
    context.fillStyle = '#FFFFFF';
    context.fillRect(50, 100, 50, 50); // Icone dossier
    context.fillStyle = '#000000';
    context.strokeRect(50, 100, 50, 50);
    context.fillText('System Folder', 40, 170);

    context.fillStyle = '#FFFFFF';
    context.fillRect(200, 100, 50, 50); // Icone poubelle
    context.fillStyle = '#000000';
    context.strokeRect(200, 100, 50, 50);
    context.fillText('Trash', 205, 170);

    // Créer une texture Three.js à partir du canvas
    const texture = new THREE.CanvasTexture(canvas);
    return { texture, canvas, context };
}

export function createPopup(text, position) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Style du pop-up
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';

    // Diviser le texte en lignes
    const lines = text.split('\n');
    lines.forEach((line, index) => {
        ctx.fillText(line, 20, 50 + index * 30);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), material);

    plane.position.set(position.x, position.y, position.z);
    plane.visible = false; // Par défaut, le pop-up est caché

    return plane;
}

export function updateMacintoshScreen(screenContext, screenTexture, imagePath) {
    const screenImage = new Image();
    screenImage.src = imagePath;

    // Chargement de l'image et mise à jour du canvas
    screenImage.onload = () => {
        screenContext.clearRect(0, 0, screenContext.canvas.width, screenContext.canvas.height);
        screenContext.drawImage(screenImage, 0, 0, screenContext.canvas.width, screenContext.canvas.height);

        // Signaler que la texture a été mise à jour
        screenTexture.needsUpdate = true;
    };
}



// Gère les interactions clavier sur l'écran
export function enableScreenInteraction(screenContext, screenTexture) {
    let currentLine = 1;

    window.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key === 'Backspace') {
            screenContext.clearRect(50, 50 * currentLine, 400, 50);
        } else if (key === 'Enter') {
            currentLine++;
        } else if (key.length === 1) {
            // Affiche la lettre tapée
            screenContext.fillText(key, 50 + (currentLine - 1) * 10, 50 * currentLine);
        }

        screenTexture.needsUpdate = true; // Met à jour l'affichage
    });
}


