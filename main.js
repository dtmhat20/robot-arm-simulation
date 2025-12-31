// IMPORTS
import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://esm.sh/lil-gui@0.18.1';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a2a);

// TEXTURE
// Wall Texture
const walltextureLoader = new THREE.TextureLoader();

const wallColorMap = walltextureLoader.load('./texture/wall/Wall_1K-JPG_Color.jpg');
const wallMetalnessMap = walltextureLoader.load('./texture/wall/Wall_1K-JPG_Metalness.jpg');
const wallNormalMap = walltextureLoader.load('./texture/wall/Wall_1K-JPG_NormalGL.jpg');
const wallRoughnessMap = walltextureLoader.load('./texture/wall/Wall_1K-JPG_Roughness.jpg');

[wallColorMap, wallMetalnessMap, wallNormalMap, wallRoughnessMap].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 10); 
    tex.needsUpdate = true
});

// Floor Texture
const floortextureLoader = new THREE.TextureLoader();

const floorColorMap = floortextureLoader.load('./texture/floor/Floor_1K-JPG_Color.jpg');
const floorMetalnessMap = floortextureLoader.load('./texture/floor/Floor_1K-JPG_Metalness.jpg');
const floorNormalMap = floortextureLoader.load('./texture/floor/Floor_1K-JPG_NormalGL.jpg');
const floorRoughnessMap = floortextureLoader.load('./texture/floor/Floor_1K-JPG_Roughness.jpg');

[floorColorMap, floorMetalnessMap, floorNormalMap, floorRoughnessMap].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    tex.needsUpdate = true
});

// Robot Texture
const robotTexLoader = new THREE.TextureLoader();

// 1. Base
const baseAlbedo = robotTexLoader.load('./texture/robot/Base_Albedo.jpg');
const baseMetal   = robotTexLoader.load('./texture/robot/Base_Metallic.jpg');
const baseNormal  = robotTexLoader.load('./texture/robot/Base_NormalDX.jpg');

// 2. Arm
const armAlbedo = robotTexLoader.load('./texture/robot/Arm_Albedo.jpg');
const armMetal   = robotTexLoader.load('./texture/robot/Arm_Metallic.jpg');
const armNormal  = robotTexLoader.load('./texture/robot/Arm_NormalDX.jpg');

// 3. Joint
const jointAlbedo = robotTexLoader.load('./texture/robot/Joint_Albedo.jpg');
const jointMetal   = robotTexLoader.load('./texture/robot/Joint_Metallic.jpg');
const jointNormal  = robotTexLoader.load('./texture/robot/Joint_NormalDX.jpg');

// 4. Gripper
const gripperAlbedo = robotTexLoader.load('./texture/robot/Gripper_Albedo.jpg');
const gripperMetal  = robotTexLoader.load('./texture/robot/Gripper_Metallic.jpg');
const gripperNormal   = robotTexLoader.load('./texture/robot/Gripper_NormalDX.jpg');

// ROOM CONSTANTS
const roomSize = 60;
const wallHeight = 30;
const wallThickness = 1;

// MATERIALS
// Wall Material
const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallColorMap,
    normalMap: wallNormalMap,
    roughnessMap: wallRoughnessMap,
    metalnessMap: wallMetalnessMap,

    roughness: 0.1,
    side: THREE.DoubleSide,
});

// Floor Material
const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorColorMap,
    metalnessMap: floorMetalnessMap, 
    normalMap: floorNormalMap,
    roughnessMap: floorRoughnessMap,
});

// Robot Material
// 1. Base
const baseMaterial = new THREE.MeshStandardMaterial({
    map: baseAlbedo,
    normalMap: baseNormal,
    metalnessMap: baseMetal,
    metalness: 1,
});

// 2. Arm
const armMaterial = new THREE.MeshStandardMaterial({
    map: armAlbedo,
    normalMap: armNormal,
    metalnessMap: armMetal,
    metalness: 1,
});

// 3. Joint
const jointMaterial = new THREE.MeshStandardMaterial({
    map: jointAlbedo,
    normalMap: jointNormal,
    metalnessMap: jointMetal,
    metalness: 1,
});

// 4. Gripper
const gripperMaterial = new THREE.MeshStandardMaterial({
    map: gripperAlbedo,
    normalMap: gripperNormal,
    metalnessMap: gripperMetal,
    metalness: 1,
});

// MESHES
// Wall Meshes
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(
        roomSize + wallThickness * 4,
        wallHeight,
        wallThickness
    ),
    wallMaterial
);
backWall.position.set(0, wallHeight / 2, -roomSize / 2 - wallThickness / 2);
scene.add(backWall);

const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(
        roomSize + wallThickness * 4,
        wallHeight,
        wallThickness
    ),
    wallMaterial
);
frontWall.position.set(0, wallHeight / 2, roomSize / 2 + wallThickness / 2);
scene.add(frontWall);

const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(
        wallThickness,
        wallHeight,
        roomSize + wallThickness * 4
    ),
    wallMaterial
);
leftWall.position.set(-roomSize / 2 - wallThickness / 2, wallHeight / 2, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(
        wallThickness,
        wallHeight,
        roomSize + wallThickness * 4
    ),
    wallMaterial
);
rightWall.position.set(roomSize / 2 + wallThickness / 2, wallHeight / 2, 0);
scene.add(rightWall);

// Floor Meshes
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(
        roomSize + wallThickness * 4,
        roomSize + wallThickness * 4
    ),
    floorMaterial
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true; // Floor Shadow
scene.add(floor);

// Table Meshes
const tableGroup = new THREE.Group();
scene.add(tableGroup);

const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.3, 4),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
);
tableTop.position.y = 1.2 + 0.3 / 2;
tableTop.receiveShadow = true;
tableGroup.add(tableTop);

const legHeight = 1.2;
const legGeo = new THREE.BoxGeometry(0.25, legHeight, 0.25);

for (const x of [-1.7, 1.7]) {
    for (const z of [-1.7, 1.7]) {
        const leg = new THREE.Mesh(
            legGeo,
            new THREE.MeshStandardMaterial({ color: 0x444444 })
        );
        leg.position.set(x, legHeight / 2, z);
        tableGroup.add(leg);
    }
}

tableGroup.position.set(7.0, 0, 0);

// Ball Meshes
const ballRadius = 0.25;

const ball = new THREE.Mesh(
    new THREE.SphereGeometry(ballRadius, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff4444 })
);

ball.castShadow = true;
ball.receiveShadow = true;

ball.position.set(
    tableGroup.position.x,              
    1.35 + 0.3 / 2 + ballRadius,         
    tableGroup.position.z              
);

scene.add(ball);

// Ball Physics State
const BALL_STATE = {
    ON_TABLE: 0,
    ROLLING: 1,
    GRASPED: 2
};

let ballState = BALL_STATE.ON_TABLE;
let ballGrabbed = false;

const ballVelocity = new THREE.Vector3();
let lastGripperPos = new THREE.Vector3();

// Robot Meshes (Hierarchy)
// J1. Base
const robotBase = new THREE.Group();
scene.add(robotBase);

const base = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 1.2, 4.5),
    baseMaterial
);
base.position.y = 0.6;
robotBase.add(base);

const j1Joint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.75, 32),
    jointMaterial
);
j1Joint.position.y = 1.2 + 0.375;
robotBase.add(j1Joint);

const lowerArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 3.75, 32),
    armMaterial
);
lowerArm.position.y = 1.575 + 1.875;
robotBase.add(lowerArm);

// J2. Shoulder
const j2Group = new THREE.Group();
j2Group.position.y = 1.575 + 3.75 + 0.5;  
robotBase.add(j2Group);

const j2Joint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.9, 32),
    jointMaterial
);
j2Joint.rotation.z = Math.PI / 2;
j2Group.add(j2Joint);

const upperArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.525, 0.525, 4.5, 32),
    armMaterial
);
upperArm.position.set(2.25, 0, 0);
upperArm.rotation.z = Math.PI / 2;
j2Group.add(upperArm);

// J3. Elbow
const j3Group = new THREE.Group();
j3Group.position.set(4.5, 0, 0);
j2Group.add(j3Group);

const j3Joint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.675, 0.675, 0.75, 32),
    jointMaterial
);
j3Joint.rotation.z = Math.PI / 2;
j3Group.add(j3Joint);

const forearm1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 1.5, 32),
    armMaterial
);
forearm1.position.set(0.375 + 0.75, 0, 0); 
forearm1.rotation.z = Math.PI / 2;
j3Group.add(forearm1);

// J4. Mid-Forearm
const j4Group = new THREE.Group();
j4Group.position.set(0.375 + 1.5, 0, 0); 
j3Group.add(j4Group);

const j4Joint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    jointMaterial
);
j4Group.add(j4Joint);

const forearm2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 1.5, 32),
    armMaterial
);
forearm2.position.set(0.75, 0, 0); 
forearm2.rotation.z = Math.PI / 2;
j4Group.add(forearm2);

// J5. Wrist Bend
const j5Group = new THREE.Group();
j5Group.position.set(1.5, 0, 0); 
j4Group.add(j5Group);

const j5Joint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    jointMaterial
);
j5Group.add(j5Joint);

const wrist = new THREE.Mesh(
    new THREE.CylinderGeometry(0.375, 0.375, 0.9, 32),
    armMaterial
);
wrist.position.y = 0.45;
j5Group.add(wrist);

// J6. Wrist Rotaion
const j6Group = new THREE.Group();
j6Group.position.y = 1;
j5Group.add(j6Group);

const j6Joint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.525, 0.525, 0.45, 32),
    jointMaterial
);
j6Group.add(j6Joint);

// Gripper
const gripperGroup = new THREE.Group();
gripperGroup.position.y = 0.525;
j6Group.add(gripperGroup);

const gripperBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.45, 0.9),
    gripperMaterial
);
gripperGroup.add(gripperBase);

const finger1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.2, 0.25),
    gripperMaterial
);
finger1.position.set(-0.35, 0.6, -0.35);
gripperGroup.add(finger1);

const finger2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.2, 0.25),
    gripperMaterial
);
finger2.position.set(0.35, 0.6, -0.35);
gripperGroup.add(finger2);

const finger3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.2, 0.25),
    gripperMaterial
);
finger3.position.set(-0.35, 0.6, 0.35);
gripperGroup.add(finger3);

const finger4 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.2, 0.25),
    gripperMaterial
);
finger4.position.set(0.35, 0.6, 0.35);
gripperGroup.add(finger4);

// Robot Shadow
robotBase.traverse(obj => {
    if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
    }
});

// CAMERA
const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.set(15, 14, 25); 
camera.lookAt(0, 3, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.enableZoom = true;
controls.minDistance = 8;
controls.maxDistance = 30;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2.3;
controls.update();

// LIGHTS 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 5);

// Directional Light Shadow
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
scene.add(directionalLight);

// ROBOT CONTROLS
const robotControls = {
    j1Rotation: 0,
    j2Rotation: 0,
    j3Rotation: 0,
    j4Rotation: 0,
    j5Rotation: 0,
    j6Rotation: 0,
    gripperOpen: 1,
    animationSpeed: 1,
};

const robotInfo = {
    eeX: 0,
    eeY: 0,
    eeZ: 0,
};

// Joint Limits
const jointLimits = {
    j1: { min: -180, max: 180 },
    j2: { min: 0, max: 180 },
    j3: { min: -90, max: 45 },
    j4: { min: -30, max: 30 },
    j5: { min: -180, max: 0 },
    j6: { min: -180, max: 180 },
};

// Keyboard State
const keysPressed = new Set();
let moveSpeed = 2;
const speedLevels = [0.5, 1, 2, 4, 6];
let currentSpeedIndex = 2;

// Animation State
let isAnimating = false;
let animationStartTime = 0;

// Collision Robot-Table
function checkRobotTableCollision() {
    const tableTopY = 1.2 + 0.3;
    const tableMinX = tableGroup.position.x - 2;
    const tableMaxX = tableGroup.position.x + 2;
    const tableMinZ = tableGroup.position.z - 2;
    const tableMaxZ = tableGroup.position.z + 2;
    
    const robotParts = [
        { mesh: base, radius: 2.25 },
        { mesh: lowerArm, radius: 0.6 },
        { mesh: upperArm, radius: 0.525 },
        { mesh: forearm1, radius: 0.45 },
        { mesh: forearm2, radius: 0.45 },
        { mesh: wrist, radius: 0.375 },
        { mesh: j1Joint, radius: 0.9 },
        { mesh: j2Joint, radius: 0.75 },
        { mesh: j3Joint, radius: 0.675 },
        { mesh: j4Joint, radius: 0.5 },
        { mesh: j5Joint, radius: 0.5 },
        { mesh: j6Joint, radius: 0.525 },
        { mesh: gripperBase, radius: 0.45 },
        { mesh: finger1, radius: 0.2 },
        { mesh: finger2, radius: 0.2 },
        { mesh: finger3, radius: 0.2 },
        { mesh: finger4, radius: 0.2 },
    ];
    
    let hasCollision = false;
    
    for (const part of robotParts) {
        const partPos = new THREE.Vector3();
        part.mesh.getWorldPosition(partPos);
        
        if (partPos.x > tableMinX - part.radius && partPos.x < tableMaxX + part.radius &&partPos.z > tableMinZ - part.radius && partPos.z < tableMaxZ + part.radius) {
            
            if (partPos.y - part.radius < tableTopY && partPos.y + part.radius > tableTopY - 0.3) {
                hasCollision = true;
                break;
            }
            
            const legPositions = [
                { x: tableGroup.position.x - 1.7, z: tableGroup.position.z - 1.7 },
                { x: tableGroup.position.x + 1.7, z: tableGroup.position.z - 1.7 },
                { x: tableGroup.position.x - 1.7, z: tableGroup.position.z + 1.7 },
                { x: tableGroup.position.x + 1.7, z: tableGroup.position.z + 1.7 },
            ];
            
            for (const leg of legPositions) {
                const legDist = Math.sqrt(
                    Math.pow(partPos.x - leg.x, 2) + 
                    Math.pow(partPos.z - leg.z, 2)
                );
                if (legDist < part.radius + 0.125 && partPos.y < tableTopY) {
                    hasCollision = true;
                    break;
                }
            }
            if (hasCollision) break;
        }
    }
    
    return hasCollision;
}

function updateRobotFromControls() {
    // Save previous state
    const prevJ1 = robotBase.rotation.y;
    const prevJ2 = j2Group.rotation.z;
    const prevJ3 = j3Group.rotation.z;
    const prevJ4 = j4Group.rotation.z;
    const prevJ5 = j5Group.rotation.z;
    const prevJ6 = j6Group.rotation.y;
    
    // Apply new rotations
    robotBase.rotation.y = THREE.MathUtils.degToRad(robotControls.j1Rotation);
    j2Group.rotation.z = THREE.MathUtils.degToRad(robotControls.j2Rotation);
    j3Group.rotation.z = THREE.MathUtils.degToRad(robotControls.j3Rotation);
    j4Group.rotation.z = THREE.MathUtils.degToRad(robotControls.j4Rotation);
    j5Group.rotation.z = THREE.MathUtils.degToRad(robotControls.j5Rotation);
    j6Group.rotation.y = THREE.MathUtils.degToRad(robotControls.j6Rotation);
  
    // Check collision
    if (checkRobotTableCollision()) {
        // Revert to previous state
        robotBase.rotation.y = prevJ1;
        j2Group.rotation.z = prevJ2;
        j3Group.rotation.z = prevJ3;
        j4Group.rotation.z = prevJ4;
        j5Group.rotation.z = prevJ5;
        j6Group.rotation.y = prevJ6;
        
        // Revert controls
        robotControls.j1Rotation = THREE.MathUtils.radToDeg(prevJ1);
        robotControls.j2Rotation = THREE.MathUtils.radToDeg(prevJ2);
        robotControls.j3Rotation = THREE.MathUtils.radToDeg(prevJ3);
        robotControls.j4Rotation = THREE.MathUtils.radToDeg(prevJ4);
        robotControls.j5Rotation = THREE.MathUtils.radToDeg(prevJ5);
        robotControls.j6Rotation = THREE.MathUtils.radToDeg(prevJ6);
    }
    
    const spread = 0.1 + (0.35 - 0.1) * robotControls.gripperOpen;
    finger1.position.set(-spread, 0.6, -spread);
    finger2.position.set(spread, 0.6, -spread);
    finger3.position.set(-spread, 0.6, spread);
    finger4.position.set(spread, 0.6, spread);
}

// KEYBOARD CONTROLS
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
    }
    keysPressed.add(e.key.toLowerCase());
});

window.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
    }
    keysPressed.delete(e.key.toLowerCase());
});

function handleKeyboardInput() {
    if (keysPressed.size > 0) {
        isAnimating = false;
    }
    
    // J1 - Base (Q/A)
    if (keysPressed.has('q')) {
        robotControls.j1Rotation = THREE.MathUtils.clamp(
            robotControls.j1Rotation + moveSpeed,
            jointLimits.j1.min,
            jointLimits.j1.max
        );
    }
    if (keysPressed.has('a')) {
        robotControls.j1Rotation = THREE.MathUtils.clamp(
            robotControls.j1Rotation - moveSpeed,
            jointLimits.j1.min,
            jointLimits.j1.max
        );
    }
    
    // J2 - Shoulder (W/S)
    if (keysPressed.has('w')) {
        robotControls.j2Rotation = THREE.MathUtils.clamp(
            robotControls.j2Rotation + moveSpeed,
            jointLimits.j2.min,
            jointLimits.j2.max
        );
    }
    if (keysPressed.has('s')) {
        robotControls.j2Rotation = THREE.MathUtils.clamp(
            robotControls.j2Rotation - moveSpeed,
            jointLimits.j2.min,
            jointLimits.j2.max
        );
    }
    
    // J3 - Elbow (E/D)
    if (keysPressed.has('e')) {
        robotControls.j3Rotation = THREE.MathUtils.clamp(
            robotControls.j3Rotation + moveSpeed,
            jointLimits.j3.min,
            jointLimits.j3.max
        );
    }
    if (keysPressed.has('d')) {
        robotControls.j3Rotation = THREE.MathUtils.clamp(
            robotControls.j3Rotation - moveSpeed,
            jointLimits.j3.min,
            jointLimits.j3.max
        );
    }
    
    // J4 - Mid-forearm (R/F)
    if (keysPressed.has('r')) {
        robotControls.j4Rotation = THREE.MathUtils.clamp(
            robotControls.j4Rotation + moveSpeed,
            jointLimits.j4.min,
            jointLimits.j4.max
        );
    }
    if (keysPressed.has('f')) {
        robotControls.j4Rotation = THREE.MathUtils.clamp(
            robotControls.j4Rotation - moveSpeed,
            jointLimits.j4.min,
            jointLimits.j4.max
        );
    }
    
    // J5 - Wrist Bend (T/G)
    if (keysPressed.has('t')) {
        robotControls.j5Rotation = THREE.MathUtils.clamp(
            robotControls.j5Rotation + moveSpeed,
            jointLimits.j5.min,
            jointLimits.j5.max
        );
    }
    if (keysPressed.has('g')) {
        robotControls.j5Rotation = THREE.MathUtils.clamp(
            robotControls.j5Rotation - moveSpeed,
            jointLimits.j5.min,
            jointLimits.j5.max
        );
    }
    
    // J6 - Wrist Rotate (Y/H)
    if (keysPressed.has('y')) {
        robotControls.j6Rotation = THREE.MathUtils.clamp(
            robotControls.j6Rotation + moveSpeed,
            jointLimits.j6.min,
            jointLimits.j6.max
        );
    }
    if (keysPressed.has('h')) {
        robotControls.j6Rotation = THREE.MathUtils.clamp(
            robotControls.j6Rotation - moveSpeed,
            jointLimits.j6.min,
            jointLimits.j6.max
        );
    }
    
    // Gripper (U/J)
    if (keysPressed.has('u')) {
        robotControls.gripperOpen = THREE.MathUtils.clamp(
            robotControls.gripperOpen + 0.02,
            0,
            1
        );
    }
    if (keysPressed.has('j')) {
        robotControls.gripperOpen = THREE.MathUtils.clamp(
            robotControls.gripperOpen - 0.02,
            0,
            1
        );
    }
    
    // Animation controls
    if (keysPressed.has(' ')) {
        if (!isAnimating) {
            isAnimating = true;
            window.animTargets = null;
            window.nextTargetTime = 0;
            animationStartTime = Date.now();
        }
        keysPressed.delete(' ');
    }
    if (keysPressed.has('escape')) {
        isAnimating = false;
        keysPressed.delete('escape');
    }
    
    // Speed controls
    if (keysPressed.has('=')) {
        currentSpeedIndex = Math.min(currentSpeedIndex + 1, speedLevels.length - 1);
        moveSpeed = speedLevels[currentSpeedIndex];
        updateSpeedDisplay();
        keysPressed.delete('=');
    }
    if (keysPressed.has('-')) {
        currentSpeedIndex = Math.max(currentSpeedIndex - 1, 0);
        moveSpeed = speedLevels[currentSpeedIndex];
        updateSpeedDisplay();
        keysPressed.delete('-');
    }
}

// GUI 
function fixLilGui(gui) {
    const root = gui.domElement;

    // Root panel
    root.style.background = 'rgba(20,20,20,0.95)';
    root.style.boxShadow = 'none';
    root.style.border = 'none';

    // Title bar
    const title = root.querySelector('.title');
    if (title) {
        title.style.background = 'rgba(30,30,30,0.95)';
        title.style.borderBottom = 'none';
    }

    // Folder backgrounds
    root.querySelectorAll('.children').forEach(el => {
        el.style.background = 'rgba(25,25,25,0.95)';
    });

    // Controllers
    root.querySelectorAll('.controller').forEach(el => {
        el.style.background = 'transparent';
        el.style.border = 'none';
    });

    // Remove borders 
    root.querySelectorAll('*').forEach(el => {
        el.style.border = 'none';
        el.style.outline = 'none';
        el.style.boxShadow = 'none';
    });
}

// Gripper Information
const infoGui = new GUI({ autoPlace: false });
infoGui.title('Gripper Information');
document.body.appendChild(infoGui.domElement);
fixLilGui(infoGui);

Object.assign(infoGui.domElement.style, {
    position: 'fixed',
    top: '50%',
    left: '12px',
    transform: 'translate(0, calc(-50% - 100px))',
    zIndex: '9999',
    maxHeight: '40vh',
    overflow: 'auto',
});

infoGui.add(robotInfo, 'eeX').name('Gripper X').listen();
infoGui.add(robotInfo, 'eeY').name('Gripper Y').listen();
infoGui.add(robotInfo, 'eeZ').name('Gripper Z').listen();
infoGui.open();

// Light Controls (moved to left side)
const lightGui = new GUI({ autoPlace: false });

lightGui.title('Lighting');
document.body.appendChild(lightGui.domElement);
fixLilGui(lightGui);

Object.assign(lightGui.domElement.style, {
    position: 'fixed',
    top: '50%',
    left: '12px',
    transform: 'translate(0, calc(-50% + 80px))',
    zIndex: '9999',
    maxHeight: '30vh',
    overflow: 'auto',
});

const lightControls = {
    ambientIntensity: 0.8,
    directionalIntensity: 1.2,
};

lightGui.add(lightControls, 'ambientIntensity', 0, 2, 0.1)
.name('Ambient')
.onChange((value) => {
    ambientLight.intensity = value;
});

lightGui.add(lightControls, 'directionalIntensity', 0, 3, 0.1)
.name('Directional')
.onChange((value) => {
    directionalLight.intensity = value;
});
lightGui.open();

// Control Panels 
const controlGui = new GUI({ autoPlace: false, width: 280 });
document.body.appendChild(controlGui.domElement);

Object.assign(controlGui.domElement.style, {
    position: 'fixed',
    top: '50%',
    right: '12px',
    transform: 'translateY(-50%)',
    zIndex: '9998',
    maxHeight: '70vh',
    overflow: 'auto',
});

// Hide main title bar
const titleBar = controlGui.domElement.querySelector('.title');
if (titleBar) {
    titleBar.style.display = 'none';
}

// Joint Controls
const jointFolder = controlGui.addFolder('Joint Controls');
const jointDisplay = {
    'Q / A': 'Base Rotation',
    'W / S': 'Shoulder',
    'E / D': 'Elbow',
    'R / F': 'Mid-forearm',
    'T / G': 'Wrist Bend',
    'Y / H': 'Wrist Rotate',
    'U / J': 'Gripper Open/Close',
};

for (const [keys, name] of Object.entries(jointDisplay)) {
    const dummy = { value: name };
    jointFolder.add(dummy, 'value').name(keys).disable();
}
jointFolder.open();

// Animation Controls
const animFolder = controlGui.addFolder('Animation');
const animDisplay = {
    'SPACE': 'Play Animation',
    'ESC': 'Stop Animation',
};

for (const [key, name] of Object.entries(animDisplay)) {
    const dummy = { value: name };
    animFolder.add(dummy, 'value').name(key).disable();
}
animFolder.open();

// Speed Controls
const speedFolder = controlGui.addFolder('Speed Control');

const speedState = { 
    current: moveSpeed,
    display: `${moveSpeed}x`
};

speedFolder.add(speedState, 'display').name('Current Speed').listen();

const speedInstructions = {
    'EQUAL (=)': 'Increase Speed',
    'MINUS (-)': 'Decrease Speed',
};

for (const [key, name] of Object.entries(speedInstructions)) {
    const dummy = { value: name };
    speedFolder.add(dummy, 'value').name(key).disable();
}
speedFolder.open();

// Function to update speed display
function updateSpeedDisplay() {
    speedState.current = moveSpeed;
    speedState.display = `${moveSpeed}x`;
}

// RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ANIMATE
function animate() {
    requestAnimationFrame(animate);
    
    handleKeyboardInput();
    
    if (isAnimating) {
        const realElapsed = (Date.now() - animationStartTime) * 0.001;
        if (!window.animTargets || realElapsed > window.nextTargetTime) {
            window.nextTargetTime = realElapsed + 3; 
            window.animTargets = {
                j1: THREE.MathUtils.randFloat(-180, 180),
                j2: THREE.MathUtils.randFloat(0, 180),
                j3: THREE.MathUtils.randFloat(-90, 45),
                j4: THREE.MathUtils.randFloat(-30, 30),
                j5: THREE.MathUtils.randFloat(-180, 0),
                j6: THREE.MathUtils.randFloat(-180, 180),
                gripper: Math.random() > 0.5 ? 1 : 0,
            };
            window.animStart = {
                j1: robotControls.j1Rotation,
                j2: robotControls.j2Rotation,
                j3: robotControls.j3Rotation,
                j4: robotControls.j4Rotation,
                j5: robotControls.j5Rotation,
                j6: robotControls.j6Rotation,
                gripper: robotControls.gripperOpen,
            };
            window.transitionStart = realElapsed;
        }
        const transitionDuration = 3 / robotControls.animationSpeed; 
        const transitionTime = Math.min((realElapsed - window.transitionStart) / transitionDuration, 1);
        const eased = transitionTime < 0.5 ? 2 * transitionTime * transitionTime : 1 - Math.pow(-2 * transitionTime + 2, 2) / 2;

        robotControls.j1Rotation = THREE.MathUtils.lerp(window.animStart.j1, window.animTargets.j1, eased);
        robotControls.j2Rotation = THREE.MathUtils.lerp(window.animStart.j2, window.animTargets.j2, eased);
        robotControls.j3Rotation = THREE.MathUtils.lerp(window.animStart.j3, window.animTargets.j3, eased);
        robotControls.j4Rotation = THREE.MathUtils.lerp(window.animStart.j4, window.animTargets.j4, eased);
        robotControls.j5Rotation = THREE.MathUtils.lerp(window.animStart.j5, window.animTargets.j5, eased);
        robotControls.j6Rotation = THREE.MathUtils.lerp(window.animStart.j6, window.animTargets.j6, eased);
        robotControls.gripperOpen = THREE.MathUtils.lerp(window.animStart.gripper, window.animTargets.gripper, eased);
    }
    updateRobotFromControls();
    const currentGripperPos = new THREE.Vector3();
    gripperGroup.getWorldPosition(currentGripperPos);
    const eePos = currentGripperPos;
    const gripperVelocity = currentGripperPos.clone().sub(lastGripperPos);
    lastGripperPos.copy(currentGripperPos);
    
    if (!ballGrabbed) {
        const ballPos = ball.position.clone();
        
        const robotParts = [
            { mesh: base, radius: 3.2 },
            { mesh: lowerArm, radius: 0.8 },
            { mesh: upperArm, radius: 0.7 },
            { mesh: forearm1, radius: 0.6 },
            { mesh: forearm2, radius: 0.6 },
            { mesh: wrist, radius: 0.5 },
            { mesh: j1Joint, radius: 1.1 },
            { mesh: j2Joint, radius: 0.95 },
            { mesh: j3Joint, radius: 0.85 },
            { mesh: j4Joint, radius: 0.65 },
            { mesh: j5Joint, radius: 0.65 },
            { mesh: j6Joint, radius: 0.65 },
            { mesh: gripperBase, radius: 0.65 },
        ];

        for (const part of robotParts) {
            const partPos = new THREE.Vector3();
            part.mesh.getWorldPosition(partPos);
            const dist = partPos.distanceTo(ballPos);
        
            if (dist < part.radius + ballRadius) {
                // Calculate collision normal
                const normal = ballPos.clone().sub(partPos).normalize();
            
                // Push ball away from robot part
                const overlap = (part.radius + ballRadius) - dist;
                ball.position.add(normal.multiplyScalar(overlap * 1.1));
            
                // Transfer momentum from robot movement 
                const impulse = gripperVelocity.clone().multiplyScalar(0.8);
                ballVelocity.add(impulse);
            
                // Add gentle bounce effect 
                const normalVelocity = ballVelocity.dot(normal);
                if (normalVelocity < 0) {
                    ballVelocity.add(normal.multiplyScalar(-normalVelocity * 0.6));
                }
                
                ballState = BALL_STATE.ROLLING;
                break;
            }
        }
        
        ball.position.add(ballVelocity);

        // Air resistance 
        ballVelocity.multiplyScalar(0.94);

        const tableTopY = 1.2 + 0.3; 
        const tableMinX = tableGroup.position.x - 2;
        const tableMaxX = tableGroup.position.x + 2;
        const tableMinZ = tableGroup.position.z - 2;
        const tableMaxZ = tableGroup.position.z + 2;

        // Table collision
        if (ball.position.x > tableMinX && ball.position.x < tableMaxX &&
            ball.position.z > tableMinZ && ball.position.z < tableMaxZ) {
            
            // Top collision
            if (ball.position.y < tableTopY + ballRadius && ball.position.y > tableTopY - 0.5) { 
                ball.position.y = tableTopY + ballRadius;
                if (ballVelocity.y < 0) {
                    ballVelocity.y *= -0.5; // Bounce
                }
            }
            
            // Edge collision 
            const edgeThreshold = 0.1;
            if (ball.position.x < tableMinX + edgeThreshold) {
                ball.position.x = tableMinX + edgeThreshold;
                ballVelocity.x = Math.abs(ballVelocity.x) * 0.5;
            }
            if (ball.position.x > tableMaxX - edgeThreshold) {
                ball.position.x = tableMaxX - edgeThreshold;
                ballVelocity.x = -Math.abs(ballVelocity.x) * 0.5;
            }
            if (ball.position.z < tableMinZ + edgeThreshold) {
                ball.position.z = tableMinZ + edgeThreshold;
                ballVelocity.z = Math.abs(ballVelocity.z) * 0.5;
            }
            if (ball.position.z > tableMaxZ - edgeThreshold) {
                ball.position.z = tableMaxZ - edgeThreshold;
                ballVelocity.z = -Math.abs(ballVelocity.z) * 0.5;
            }
        } else {
            // Ball fell off table 
            ballVelocity.y -= 0.05; 
        }

        // Floor collision
        if (ball.position.y < ballRadius) {
            ball.position.y = ballRadius;
            if (ballVelocity.y < 0) {
                ballVelocity.y *= -0.3; 
            }
            // Floor friction
            ballVelocity.x *= 0.85;
            ballVelocity.z *= 0.85;
        }
    }
    
    // End-Effector
    const eeDist = currentGripperPos.distanceTo(
        ball.getWorldPosition(new THREE.Vector3())
    );

    // Grab Ball 
    if (!ballGrabbed && robotControls.gripperOpen < 0.5) {
        // Get world positions of all 4 fingers
        const finger1Pos = new THREE.Vector3();
        const finger2Pos = new THREE.Vector3();
        const finger3Pos = new THREE.Vector3();
        const finger4Pos = new THREE.Vector3();
    
        finger1.getWorldPosition(finger1Pos);
        finger2.getWorldPosition(finger2Pos);
        finger3.getWorldPosition(finger3Pos);
        finger4.getWorldPosition(finger4Pos);
    
        const ballWorldPos = ball.position.clone();
    
        // Calculate the center of the 4 fingers
        const centerX = (finger1Pos.x + finger2Pos.x + finger3Pos.x + finger4Pos.x) / 4;
        const centerY = (finger1Pos.y + finger2Pos.y + finger3Pos.y + finger4Pos.y) / 4;
        const centerZ = (finger1Pos.z + finger2Pos.z + finger3Pos.z + finger4Pos.z) / 4;
    
        // Distance from ball to finger center
        const distToCenter = Math.sqrt(
            Math.pow(ballWorldPos.x - centerX, 2) +
            Math.pow(ballWorldPos.y - centerY, 2) +
            Math.pow(ballWorldPos.z - centerZ, 2)
        );
    
        // Check finger spacing
        const fingerSpacingX = Math.abs(finger2Pos.x - finger1Pos.x);
        const fingerSpacingZ = Math.abs(finger3Pos.z - finger1Pos.z);
        const avgSpacing = (fingerSpacingX + fingerSpacingZ) / 2;
    
        const isNearCenter = distToCenter < 0.6;
        const isTightEnough = avgSpacing < 0.7 && avgSpacing > 0.25;
    
        if (isNearCenter && isTightEnough) {
            ballGrabbed = true;
            ballState = BALL_STATE.GRASPED;
        
            ballVelocity.set(0, 0, 0);
            gripperGroup.add(ball);
        
            ball.position.set(0, 0.3, 0);
        }
    }

    // Release Ball
    if (ballGrabbed && robotControls.gripperOpen > 0.6) {
        ballGrabbed = false;
        ballState = BALL_STATE.ON_TABLE;

        scene.add(ball);
        ball.position.copy(currentGripperPos);
    }
    robotInfo.eeX = eePos.x.toFixed(2);
    robotInfo.eeY = eePos.y.toFixed(2);
    robotInfo.eeZ = eePos.z.toFixed(2);

    controls.update();
    renderer.render(scene, camera);
}
animate();
