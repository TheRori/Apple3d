import { GUI } from 'https://unpkg.com/dat.gui/build/dat.gui.module.js';

export function createGUI(mac, table, garage,ambientLight,directionalLight, resources, popups) {
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

    // GUI pour le Macintosh
    const tableFolder = gui.addFolder('Table');
    tableFolder.add(table.position, 'x', -10, 10).name('Position X');
    tableFolder.add(table.position, 'y', -10, 10).name('Position Y');
    tableFolder.add(table.position, 'z', -10, 10).name('Position Z');
    tableFolder.add(table.rotation, 'x', 1, 20).name('r X');
    tableFolder.add(table.rotation, 'y', 1, 20).name('r Y');
    tableFolder.add(table.rotation, 'z', 1, 20).name('r Z');
    tableFolder.add(table.scale, 'x', 1, 20).name('Échelle X');
    tableFolder.add(table.scale, 'y', 1, 20).name('Échelle Y');
    tableFolder.add(table.scale, 'z', 1, 20).name('Échelle Z');
    tableFolder.open();

    // GUI pour l'écran
    const screenFolder = gui.addFolder('Screen');
    screenFolder.add(screenMesh.position, 'x', -10, 10).name('Position X');
    screenFolder.add(screenMesh.position, 'y', -10, 10).name('Position Y');
    screenFolder.add(screenMesh.position, 'z', -10, 10).name('Position Z');
    screenFolder.add(screenMesh.scale, 'x', 0.1, 5).name('Échelle X');
    screenFolder.add(screenMesh.scale, 'y', 0.1, 5).name('Échelle Y');
    screenFolder.add(screenMesh.scale, 'z', 0.1, 5).name('Échelle Z');
    screenFolder.open();

    const garageFolder = gui.addFolder('Garage');
    garageFolder.add(garage.position, 'x', -10, 10).name('Position X');
    garageFolder.add(garage.position, 'y', -10, 10).name('Position Y');
    garageFolder.add(garage.position, 'z', -10, 10).name('Position Z');
    garageFolder.add(garage.scale, 'x', 0.1, 5).name('Échelle X');
    garageFolder.add(garage.scale, 'y', 0.1, 5).name('Échelle X');
    garageFolder.add(garage.scale, 'z', 0.1, 5).name('Échelle X');

    garageFolder.open();

    const ambientFolder = gui.addFolder('Lumière Ambiante');
    ambientFolder.add(ambientLight, 'intensity', 0, 20).name('Intensité');
    ambientFolder.open();

    // Contrôles pour la lumière directionnelle
    const directionalFolder = gui.addFolder('Lumière Directionnelle');
    directionalFolder.add(directionalLight, 'intensity', 0, 20).name('Intensité');
    directionalFolder.add(directionalLight.position, 'x', -20, 20).name('Position X');
    directionalFolder.add(directionalLight.position, 'y', -20, 20).name('Position Y');
    directionalFolder.add(directionalLight.position, 'z', -20, 20).name('Position Z');
    directionalFolder.add(directionalLight.rotation, 'x', 1, 20).name('r X');
    directionalFolder.add(directionalLight.rotation, 'y', 1, 20).name('r Y');
    directionalFolder.add(directionalLight.rotation, 'z', 1, 20).name('r Z');
    directionalFolder.open();




}
