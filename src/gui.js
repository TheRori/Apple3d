import { GUI } from 'https://unpkg.com/dat.gui/build/dat.gui.module.js';

export function createGUI(mac, table, resources, popups) {
    const gui = new GUI();

    const { screenCanvas, screenMesh, screenContext, screenTexture } = resources;

    if (!screenTexture || !screenTexture.image) {
        console.error('screenTexture.image est manquant dans gui.js');
        return;
    }

    // GUI pour le Macintosh
    const macFolder = gui.addFolder('Macintosh');
    macFolder.add(mac.position, 'x', -10, 10).name('Position X');
    macFolder.add(mac.position, 'y', -10, 10).name('Position Y');
    macFolder.add(mac.position, 'z', -10, 10).name('Position Z');
    macFolder.add(mac.scale, 'x', 1, 20).name('Échelle X');
    macFolder.add(mac.scale, 'y', 1, 20).name('Échelle Y');
    macFolder.add(mac.scale, 'z', 1, 20).name('Échelle Z');
    macFolder.open();

    // GUI pour l'écran
    const screenFolder = gui.addFolder('Screen');
    screenFolder.add(screenMesh.position, 'x', -10, 10).name('Position X');
    screenFolder.add(screenMesh.position, 'y', -10, 10).name('Position Y');
    screenFolder.add(screenMesh.position, 'z', -10, 10).name('Position Z');
    screenFolder.add(screenMesh.scale, 'x', 0.1, 5).name('Échelle X');
    screenFolder.add(screenMesh.scale, 'y', 0.1, 5).name('Échelle Y');
    screenFolder.add(screenMesh.scale, 'z', 0.1, 5).name('Échelle Z');
    screenFolder.open();

    // Gestion des pop-ups et captures d'écran
    const popupControls = {
        currentPopupIndex: 0, // Indice du pop-up actuel
        navigatePopups: () => {
            popups.forEach((popupInfo, index) => {
                const { popup, screenImage, text } = popupInfo;

                // Mettre à jour la visibilité des pop-ups
                popup.visible = index === popupControls.currentPopupIndex;

                // Mettre à jour l'écran avec l'image correspondante
                if (popup.visible && screenImage) {
                    const screenImageElement = new Image();
                    screenImageElement.src = screenImage;
                    screenImageElement.onload = () => {
                        screenContext.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
                        screenContext.drawImage(screenImageElement, 0, 0, screenCanvas.width, screenCanvas.height);
                        screenTexture.needsUpdate = true;
                    };
                }

                // Mettre à jour le texte du pop-up (si visible)
                if (popup.visible) {
                    const popupMaterial = popup.material.map;
                    const popupCanvas = popupMaterial.image;
                    const popupCtx = popupCanvas.getContext('2d');

                    popupCtx.clearRect(0, 0, popupCanvas.width, popupCanvas.height);
                    popupCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    popupCtx.fillRect(0, 0, popupCanvas.width, popupCanvas.height);
                    popupCtx.font = '20px Arial';
                    popupCtx.fillStyle = 'white';

                    // Diviser le texte en lignes et l'afficher
                    const lines = text.split('\n');
                    lines.forEach((line, i) => {
                        popupCtx.fillText(line, 20, 50 + i * 30);
                    });

                    popupMaterial.needsUpdate = true;
                }
            });
        }
    };

    // Ajouter un contrôleur pour sélectionner le pop-up actif
    const popupFolder = gui.addFolder('Popups');
    popupFolder.add(popupControls, 'currentPopupIndex', 0, popups.length - 1, 1).name('Choisir un popup').onChange(() => {
        popupControls.navigatePopups();
    });

    // Ajouter des contrôles pour positionner les pop-ups
    const positionFolder = gui.addFolder('Popup Position');
    positionFolder.add(popups[popupControls.currentPopupIndex].popup.position, 'x', -10, 10).name('Position X').onChange(() => {
        popupControls.navigatePopups();
    });
    positionFolder.add(popups[popupControls.currentPopupIndex].popup.position, 'y', -10, 10).name('Position Y').onChange(() => {
        popupControls.navigatePopups();
    });
    positionFolder.add(popups[popupControls.currentPopupIndex].popup.position, 'z', -10, 10).name('Position Z').onChange(() => {
        popupControls.navigatePopups();
    });
    positionFolder.open();

    // Initialiser le premier pop-up
    popupControls.navigatePopups();
}
