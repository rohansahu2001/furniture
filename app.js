AFRAME.registerComponent('ar-session-manager', {
    init: function () {
        this.measureBtn = document.getElementById('measure-btn');
        this.placeBtn = document.getElementById('place-btn');
        this.measurementInfo = document.getElementById('measurement-info');
        this.freezer = document.getElementById('freezer');
        this.measurementPlane = document.getElementById('measurementPlane');

        this.measureBtn.addEventListener('click', this.measureSpace.bind(this));
        this.placeBtn.addEventListener('click', this.placeFreezer.bind(this));

        this.freezer.addEventListener('loaded', () => {
            console.log('Freezer model loaded');
        });

        this.setupDragRotation();
    },

    measureSpace: function () {
        // This is a simplified measurement. In a real app, you'd use more advanced techniques.
        const width = Math.random() * 2 + 1; // Random width between 1 and 3 meters
        const height = Math.random() * 2 + 1; // Random height between 1 and 3 meters

        this.measurementPlane.setAttribute('scale', `${width} ${height} 1`);
        this.measurementPlane.setAttribute('visible', 'true');

        this.measurementInfo.textContent = `Width: ${width.toFixed(2)}m, Height: ${height.toFixed(2)}m`;

        // Check if freezer fits (assuming freezer is 1x1x1 meter when scale is 1,1,1)
        if (width >= 1 && height >= 1) {
            this.placeBtn.style.display = 'block';
        } else {
            this.placeBtn.style.display = 'none';
            this.measurementInfo.textContent += ' (Freezer does not fit)';
        }
    },

    placeFreezer: function () {
        this.freezer.setAttribute('visible', 'true');
        this.freezer.setAttribute('position', this.measurementPlane.getAttribute('position'));
    },

    setupDragRotation: function () {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (event) => {
            isDragging = true;
        };

        const onMouseMove = (event) => {
            if (isDragging && this.freezer.getAttribute('visible')) {
                const deltaMove = {
                    x: event.clientX - previousMousePosition.x,
                    y: event.clientY - previousMousePosition.y
                };

                const rotation = this.freezer.getAttribute('rotation');
                rotation.y += deltaMove.x * 0.5;
                this.freezer.setAttribute('rotation', rotation);

                previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        };

        const onMouseUp = (event) => {
            isDragging = false;
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});

// Add this component to the scene
document.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        scene.setAttribute('ar-session-manager', '');
    } else {
        scene.addEventListener('loaded', () => {
            scene.setAttribute('ar-session-manager', '');
        });
    }
});