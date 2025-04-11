// Initialize both containers
const galaxyContainer = document.getElementById('galaxy-container');
const cosmicContainer = document.getElementById('cosmic-3d');

// ===== GALAXY SCENE =====
const galaxyScene = new THREE.Scene();
const galaxyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const galaxyRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
galaxyRenderer.setSize(window.innerWidth, window.innerHeight);
galaxyContainer.appendChild(galaxyRenderer.domElement);

// Galaxy setup
const galaxyParams = { stars: 15000, arms: 7, spin: 5, brightness: 0.8 };
const galaxyGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(galaxyParams.stars * 3);
const colors = new Float32Array(galaxyParams.stars * 3);

// Generate spiral galaxy pattern
const armAngle = (Math.PI * 2) / galaxyParams.arms;

for (let i = 0; i < galaxyParams.stars; i++) {
    const arm = Math.floor(i / (galaxyParams.stars / galaxyParams.arms));
    const radius = Math.random() * 50;
    const angle = armAngle * arm + Math.random() * 0.2 + radius * 0.05 * galaxyParams.spin;
    
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    
    colors[i * 3] = 0.7 + Math.random() * 0.3;
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
    colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
}

galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const galaxyMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
galaxyScene.add(galaxy); // Changed from scene to galaxyScene

// ===== COSMIC SCENE =====
const cosmicScene = new THREE.Scene();
const cosmicCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cosmicRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
cosmicRenderer.setSize(window.innerWidth, window.innerHeight);
cosmicContainer.appendChild(cosmicRenderer.domElement);

// Cosmic stars
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];
for (let i = 0; i < 5000; i++) {
  starsVertices.push(
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000,
    (Math.random() - 0.5) * 2000
  );
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.2,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
cosmicScene.add(stars);

// Cosmic galaxy spiral
const cosmicGalaxyGeometry = new THREE.BufferGeometry();
const cosmicGalaxyVertices = [];
const arms = 3;
const starsPerArm = 500;

for (let i = 0; i < arms; i++) {
  const angle = (i / arms) * Math.PI * 2;
  for (let j = 0; j < starsPerArm; j++) {
    const radius = Math.random() * 300 + 50;
    const spiralAngle = angle + (j / starsPerArm) * Math.PI * 4;
    cosmicGalaxyVertices.push(
      Math.cos(spiralAngle) * radius,
      Math.random() * 40 - 20,
      Math.sin(spiralAngle) * radius
    );
  }
}

cosmicGalaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cosmicGalaxyVertices, 3));

const cosmicGalaxyMaterial = new THREE.PointsMaterial({
  color: 0x7e22ce,
  size: 0.5,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});

const cosmicGalaxy = new THREE.Points(cosmicGalaxyGeometry, cosmicGalaxyMaterial);
cosmicScene.add(cosmicGalaxy);

// Camera positions
galaxyCamera.position.z = 30;
cosmicCamera.position.z = 200;

// Animation state
let animationComplete = false;

// Combined animation loop
function animate() {
  requestAnimationFrame(animate);

  // Animate galaxy
  galaxy.rotation.y += 0.001;
  galaxyRenderer.render(galaxyScene, galaxyCamera);

  // Animate cosmic scene
  stars.rotation.x += 0.0001;
  stars.rotation.y += 0.0002;
  cosmicGalaxy.rotation.y += 0.001;
  cosmicRenderer.render(cosmicScene, cosmicCamera);

  // Fly-through effect
  if (!animationComplete) {
    if (galaxyCamera.position.z > 5) {
      galaxyCamera.position.z -= 0.25;
    } else {
      animationComplete = true;
      transitionToWebsite();
    }
  }
}

// Transition function
function transitionToWebsite() {
    const flash = document.getElementById('flash');
    gsap.to(flash, { 
      opacity: 1, 
      duration: 0.5, 
      onComplete: () => {
        galaxyContainer.style.display = 'none';
        document.getElementById('content').style.opacity = 1;
        gsap.to(flash, { opacity: 0, duration: 0.5 });
      }
    });
  }

// Handle resize
window.addEventListener('resize', () => {
  galaxyCamera.aspect = window.innerWidth / window.innerHeight;
  galaxyCamera.updateProjectionMatrix();
  galaxyRenderer.setSize(window.innerWidth, window.innerHeight);

  cosmicCamera.aspect = window.innerWidth / window.innerHeight;
  cosmicCamera.updateProjectionMatrix();
  cosmicRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
