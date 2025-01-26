export const soundManager = {
    sounds: {},

    loadSounds() {
        this.sounds.footstep = new Audio('assets/sounds/footstep.mp3');
        this.sounds.footstep.loop = false;
        this.sounds.footstep.volume = 0.5;

        this.sounds.mouseClick = new Audio('assets/sounds/mouse_click.mp3');
        this.sounds.mouseClick.loop = false;
        this.sounds.mouseClick.volume = 0.5;
    },

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Reset to start
            sound.play();
        } else {
            console.warn(`Sound "${soundName}" not found.`);
        }
    },

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0; // Reset to start
        }
    }
};
