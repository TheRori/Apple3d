import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';


function createPopup(text, position) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Style de fond du pop-up
    ctx.fillStyle = 'black'; // Fond noir
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Style de texte
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white'; // Texte en blanc pour le fond noir

    // Diviser le texte en lignes
    const lineHeight = 30;
    const maxWidth = canvas.width - 100; // Marge de 50px de chaque côté
    const lines = splitTextIntoLines(ctx, text, maxWidth);

    // Dessiner les lignes de texte
    lines.forEach((line, index) => {
        ctx.fillText(line, 20, 50 + index * lineHeight);
    });

    // Dessiner une icône de maison avec un fond contrasté
    const houseImage = new Image();

    // Définir une région de clic élargie autour de la maison
    const houseRegion = { x: 380, y: 180, width: 90, height: 90 }; // Zone élargie autour de l'image

    // Dessiner un rectangle transparent (facultatif, pour visualiser la zone élargie lors du débogage)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Couleur légèrement transparente pour visualisation
    ctx.fillRect(houseRegion.x, houseRegion.y, houseRegion.width, houseRegion.height);

    // Dessiner l'image de la maison au centre de la région élargie
    houseImage.src = 'assets/icons/house.png'; // Chemin vers l'image
    houseImage.onload = () => {
        const imageX = houseRegion.x + (houseRegion.width - 50) / 2; // Centrer l'image dans la région
        const imageY = houseRegion.y + (houseRegion.height - 50) / 2; // Centrer l'image dans la région
        ctx.drawImage(houseImage, imageX, imageY, 50, 50); // Taille fixe de l'image

        // Mettre à jour la texture après le chargement de l'image
        texture.needsUpdate = true;
    };

    // Créer une texture à partir du canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide, // Render the popup on both sides
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), material);

    // Associer la région élargie de la maison au plan pour la détection de clic
    plane.houseRegion = houseRegion;

    // Positionner le pop-up
    plane.position.set(position.x, position.y, position.z);

    // Appliquer la rotation si elle est définie
    if (position.rotation) {
        console.log('rotation',position.rotation);
        plane.rotation.set(
            position.rotation.x || 0,
            position.rotation.y || 0,
            position.rotation.z || 0
        );
    }

    // Masquer le pop-up par défaut
    plane.visible = false;

    return plane;
}


function splitTextIntoLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
        const testLine = currentLine + word + ' ';
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && currentLine !== '') {
            lines.push(currentLine); // Ajouter la ligne complète
            currentLine = word + ' '; // Démarrer une nouvelle ligne
        } else {
            currentLine = testLine;
        }
    });

    // Ajouter la dernière ligne
    if (currentLine !== '') {
        lines.push(currentLine);
    }

    return lines;
}


function drawZonesOnMacintosh(mac, macintoshPopups) {
    macintoshPopups.forEach((icon) => {
        const { region, position, name } = icon;

        if (region) {
            // Créer la zone cliquable
            const geometry = new THREE.PlaneGeometry(region.width, region.height);
            const material = new THREE.MeshBasicMaterial({
                color: 0x850000,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide,
            });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(region.x, region.y, region.z);
            if (region.rotation) {
                plane.rotation.set(region.rotation.x || 0, region.rotation.y || 0, region.rotation.z || 0);
            }
            plane.name = name;
            plane.visible = false;
            mac.add(plane);

            // Créer le rond clignotant
            const circleGeometry = new THREE.CircleGeometry(region.width/10, 32);
            const circleMaterial = new THREE.MeshBasicMaterial({
                color: 0x850000,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide,
            });
            const circle = new THREE.Mesh(circleGeometry, circleMaterial);
            circle.position.set(region.x + region.width / 8, region.y + region.height / 8, region.z);
            if (region.rotation) {
                circle.rotation.set(region.rotation.x || 0, region.rotation.y || 0, region.rotation.z || 0);
            }

            // Animation du rond
            const clock = new THREE.Clock();
            function animateCircle() {
                const elapsedTime = clock.getElapsedTime();
                circleMaterial.opacity = 0.5 + 0.5 * Math.sin(elapsedTime * 2);
                requestAnimationFrame(animateCircle);
            }
            animateCircle();

            mac.add(circle);

            // Ajouter les références des objets au popup
            icon.zoneMesh = plane;
            icon.circleMesh = circle;
        }
    });
}


export function addPopups(scene,popupData, macintoshPopups, mac) {


    popupData.forEach((info) => {
        const popup = createPopup(info.text, info.position);
        scene.add(popup);
        info.popup = popup;
        popup.visible = false; // Masquer les pop-ups par défaut
        macintoshPopups.push(info);
    });
    drawZonesOnMacintosh(mac, macintoshPopups);

}


export function showPopup(index, macintoshPopups) {
    macintoshPopups.forEach((info, i) => {
        info.popup.visible = (i === index); // Afficher uniquement le pop-up correspondant

        // Masquer les zones cliquables et les ronds pour tous les icônes
        if (info.zoneMesh) {
            info.zoneMesh.visible = false; // Masquer la zone cliquable
        }
        if (info.circleMesh) {
            info.circleMesh.visible = false; // Masquer le rond clignotant
        }
    });
    return macintoshPopups[index];
}
