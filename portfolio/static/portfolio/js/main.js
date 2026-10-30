import * as THREE from "three";

const canvas = document.querySelector("#scene-canvas");
const glow = document.querySelector(".cursor-glow");
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)")
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

const themeButton = document.querySelector(".theme-toggle");
function updateThemeButton() {
  const isLight = document.documentElement.dataset.theme === "light";
  const label = isLight ? "Switch to night mode" : "Switch to day mode";
  themeButton?.setAttribute("aria-label", label);
  themeButton?.setAttribute("title", label);
}
updateThemeButton();
themeButton?.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  updateThemeButton();
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Could not save the theme preference.", error);
  }
});

window.addEventListener("pointermove", (event) => {
  if (glow) {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}

// Three.js scene: a 3D constellation of skills orbiting a glowing tech core.
if (canvas) {
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.z = 9.2;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    scene.add(new THREE.HemisphereLight(0xe9f7ff, 0x51436f, 1.8));
    const keyLight = new THREE.PointLight(0x55dce8, 24, 20);
    keyLight.position.set(4, 4, 6);
    const accentLight = new THREE.PointLight(0x9b72ff, 18, 18);
    accentLight.position.set(-5, 1, 4);
    const rimLight = new THREE.PointLight(0xfa75bd, 14, 16);
    rimLight.position.set(2, -3, 2);
    scene.add(keyLight, accentLight, rimLight);

    const backRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.025, 18, 180),
      new THREE.MeshBasicMaterial({ color: 0x7b6cff, transparent: true, opacity: 0.5 })
    );
    backRing.rotation.x = 1.2;
    backRing.rotation.y = 0.7;
    avatarGroup.add(backRing);

    const person = new THREE.Group();
    person.visible = false;
    avatarGroup.add(person);
    const skillNodes = new THREE.Group();
    avatarGroup.add(skillNodes);

    function createLabelTexture(label, accent) {
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 640;
      textureCanvas.height = 256;
      const ctx = textureCanvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 640, 256);
      gradient.addColorStop(0, "#11152a");
      gradient.addColorStop(1, "#20183b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 640, 256);

      ctx.strokeStyle = `#${accent.toString(16).padStart(6, "0")}`;
      ctx.lineWidth = 7;
      ctx.strokeRect(8, 8, 624, 240);

      ctx.shadowColor = `#${accent.toString(16).padStart(6, "0")}`;
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#f4f2ff";
      ctx.font = "700 56px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 320, 128);
      ctx.shadowBlur = 0;

      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    function createSkillNode(label, accent, x, y, z) {
      const card = new THREE.Group();
      card.position.set(x, y, z);
      card.userData.baseZ = z;

      const edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(accent).multiplyScalar(0.6),
        emissive: accent,
        emissiveIntensity: 0.2,
        metalness: 0.72,
        roughness: 0.26,
        clearcoat: 1
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.8, 0.24), edgeMaterial);
      card.add(body);

      const faceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x171a2b,
        metalness: 0.52,
        roughness: 0.3,
        clearcoat: 1
      });
      const face = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.7, 0.1), faceMaterial);
      face.position.z = 0.13;
      card.add(face);

      const faceLabel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 0.58),
        new THREE.MeshBasicMaterial({
          map: createLabelTexture(label, accent),
          side: THREE.DoubleSide
        })
      );
      faceLabel.position.z = 0.186;
      card.add(faceLabel);

      const edgeOutline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.92, 0.8, 0.24)),
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.85 })
      );
      card.add(edgeOutline);
      skillNodes.add(card);
      return card;
    }

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.12, 2),
      new THREE.MeshBasicMaterial({
        color: 0x9b85ff,
        transparent: true,
        opacity: 0.82,
        wireframe: true
      })
    );
    avatarGroup.add(core);

    const coreInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.66, 1),
      new THREE.MeshBasicMaterial({ color: 0x62eee6, wireframe: true, transparent: true, opacity: 0.8 })
    );
    avatarGroup.add(coreInner);

    const coreLabel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.55, 0.58),
      new THREE.MeshBasicMaterial({
        map: createLabelTexture("FULL STACK", 0x8feeea),
        transparent: true,
        side: THREE.DoubleSide
      })
    );
    coreLabel.position.set(0, 0, 1.18);
    avatarGroup.add(coreLabel);

    const skills = [
      { label: "PYTHON", color: 0x55f6e5, x: -2.35, y: 1.4, z: 0.6 },
      { label: "DJANGO", color: 0x7b6cff, x: 0, y: 2.2, z: 0.2 },
      { label: "JAVASCRIPT", color: 0xfa4fba, x: 2.35, y: 1.4, z: 0.6 },
      { label: "SQL", color: 0xc7ff65, x: -2.35, y: -1.3, z: 0.6 },
      { label: "HTML + CSS", color: 0x9edcff, x: 2.35, y: -1.3, z: 0.6 },
      { label: "GIT / GITHUB", color: 0xffd166, x: 0, y: -2.2, z: 0.2 }
    ];
    skills.forEach(skill => {
      const connector = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(skill.x * 0.72, skill.y * 0.72, skill.z * 0.72)
      ]);
      avatarGroup.add(new THREE.Line(
        connector,
        new THREE.LineBasicMaterial({ color: skill.color, transparent: true, opacity: 0.32 })
      ));
      createSkillNode(skill.label, skill.color, skill.x, skill.y, skill.z);
    });

    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xd99c78, roughness: 0.78 });
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x28263a, roughness: 0.62 });
    const jacketMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5266ae,
      emissive: 0x30266b,
      emissiveIntensity: 0.48,
      metalness: 0.35,
      roughness: 0.28,
      clearcoat: 0.9
    });
    const trimMaterial = new THREE.MeshBasicMaterial({ color: 0x71e9e9 });

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.58, 40, 32), skinMaterial);
    head.scale.set(0.9, 1.08, 0.82);
    head.position.set(0, 1.48, 0.15);
    person.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.61, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.58),
      hairMaterial
    );
    hair.scale.set(0.98, 0.95, 0.9);
    hair.position.set(0, 1.75, 0.1);
    person.add(hair);

    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 18), hairMaterial);
    fringe.scale.set(1.5, 0.55, 0.82);
    fringe.position.set(-0.2, 1.93, 0.43);
    person.add(fringe);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.4, 24), skinMaterial);
    neck.position.set(0, 0.94, 0.02);
    person.add(neck);

    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x28213c });
    [-0.19, 0.19].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), eyeMaterial);
      eye.position.set(x, 1.48, 0.61);
      person.add(eye);
    });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.72, 1.1, 8, 24), jacketMaterial);
    torso.scale.set(1.18, 1, 0.82);
    torso.position.set(0, 0.08, 0);
    person.add(torso);

    const leftArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.62, 6, 16), jacketMaterial);
    leftArm.position.set(-0.78, -0.12, 0.54);
    leftArm.rotation.z = 0.3;
    person.add(leftArm);
    const rightArm = leftArm.clone();
    rightArm.position.x = 0.78;
    rightArm.rotation.z = -0.3;
    person.add(rightArm);
    [-0.62, 0.62].forEach(x => {
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 16), skinMaterial);
      hand.position.set(x, -0.61, 0.88);
      person.add(hand);
    });

    const jacketTrim = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.025, 10, 64, Math.PI), trimMaterial);
    jacketTrim.position.set(0, 0.52, 0.44);
    jacketTrim.rotation.z = Math.PI;
    person.add(jacketTrim);

    const laptop = new THREE.Group();
    laptop.position.set(0, -0.78, 1.08);
    laptop.rotation.x = -0.12;
    person.add(laptop);

    const laptopFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.05, 0.08),
      new THREE.MeshPhysicalMaterial({
        color: 0x28263f,
        emissive: 0x241858,
        emissiveIntensity: 0.5,
        metalness: 0.58,
        roughness: 0.25,
        clearcoat: 1
      })
    );
    laptopFrame.position.set(0, 0.52, -0.08);
    laptop.add(laptopFrame);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 512;
    screenCanvas.height = 320;
    const ctx = screenCanvas.getContext("2d");
    ctx.fillStyle = "#101427";
    ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = "#252d45";
    ctx.fillRect(0, 0, 512, 36);
    ["#ff758f", "#ffd166", "#62e6d5"].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(20 + index * 22, 18, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    const codeLines = [
      ["const", "#d994ff", " build = () => {"],
      ["  return", "#68e0db", " creativeIdeas;"],
      ["}", "#d994ff", ""],
      ["class", "#ff8fc7", " Developer {"],
      ["  skill", "#74c8ff", " = 'full stack';"],
      ["}", "#ff8fc7", ""]
    ];
    ctx.font = "600 21px monospace";
    codeLines.forEach((line, index) => {
      ctx.fillStyle = "#777e9b";
      ctx.fillText(String(index + 1).padStart(2, "0"), 22, 88 + index * 34);
      ctx.fillStyle = line[1];
      ctx.fillText(line[0], 66, 88 + index * 34);
      ctx.fillStyle = "#e7e8f4";
      ctx.fillText(line[2], 66 + ctx.measureText(line[0]).width, 88 + index * 34);
    });
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.54, 0.88),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    screen.position.set(0, 0.53, -0.035);
    laptop.add(screen);

    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.92, 0.11, 0.8),
      new THREE.MeshPhysicalMaterial({
        color: 0x77758d,
        metalness: 0.82,
        roughness: 0.27,
        clearcoat: 0.9
      })
    );
    laptopBase.position.set(0, -0.02, 0.31);
    laptopBase.rotation.x = -0.08;
    laptop.add(laptopBase);

    const laptopGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.018, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x62eee6 })
    );
    laptopGlow.position.set(0, 0.043, 0.53);
    laptop.add(laptopGlow);

    const orbitGroup = new THREE.Group();
    orbitGroup.position.z = -4;
    avatarGroup.add(orbitGroup);
    const orbitSpecs = [
      { radius: 2.85, tube: 0.016, color: 0x54dce8, opacity: 0.62, x: 1.18, y: 0.15 },
      { radius: 3.15, tube: 0.012, color: 0xa184f3, opacity: 0.52, x: 0.58, y: -0.65 }
    ];
    const orbits = orbitSpecs.map(spec => {
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(spec.radius, spec.tube, 12, 180),
        new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: spec.opacity })
      );
      orbit.rotation.set(spec.x, spec.y, 0);
      orbitGroup.add(orbit);
      return orbit;
    });

    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particlePalette = [
      new THREE.Color(0x45dce7),
      new THREE.Color(0xa58af4),
      new THREE.Color(0xf181be)
    ];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2.6;
      const color = particlePalette[Math.floor(Math.random() * particlePalette.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
      })
    );
    avatarGroup.add(particles);

    const mouse = { x: 0, y: 0 };
    window.addEventListener("pointermove", e => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function resize() {
      const width = canvas.clientWidth || 500;
      const height = canvas.clientHeight || 500;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      if (!reduceMotion) {
        avatarGroup.rotation.y = THREE.MathUtils.lerp(avatarGroup.rotation.y, mouse.x * 0.12, 0.035);
        avatarGroup.rotation.x = THREE.MathUtils.lerp(avatarGroup.rotation.x, -mouse.y * 0.08, 0.035);
        person.position.y = Math.sin(t * 1.15) * 0.08;
        person.rotation.y = Math.sin(t * 0.55) * 0.09;
        laptop.rotation.y = Math.sin(t * 0.65) * 0.035;
        orbitGroup.rotation.y = t * 0.08;
        orbitGroup.rotation.z = Math.sin(t * 0.35) * 0.06;
        orbits[0].rotation.z = t * 0.12;
        orbits[1].rotation.z = -t * 0.09;
        particles.rotation.y = t * 0.025;
        core.rotation.x = t * 0.16;
        core.rotation.y = t * 0.22;
        coreInner.rotation.x = -t * 0.2;
        coreInner.rotation.y = t * 0.28;
        skillNodes.rotation.y = Math.sin(t * 0.45) * 0.07;
        skillNodes.children.forEach((tag, index) => {
          tag.lookAt(camera.position);
          tag.rotation.y += Math.sin(t * 0.65 + index * 1.4) * 0.16;
          tag.rotation.z = Math.sin(t * 0.7 + index) * 0.035;
          tag.position.z = tag.userData.baseZ + Math.sin(t * 1.1 + index) * 0.045;
        });
        backRing.rotation.z = t * 0.12;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  } catch (error) {
    console.warn("Three.js failed to initialize; falling back to a static layout.", error);
    canvas.style.display = "none";
  }
}

// GSAP scroll reveals and subtle project-card depth.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (!reduceMotion) {
    gsap.to(".hero-copy .reveal", {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.15
    });
    gsap.to(".hero-visual", {
      opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.25
    });
    gsap.utils.toArray(".reveal:not(.hero-copy .reveal)").forEach((element) => {
      gsap.to(element, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true }
      });
    });
    gsap.utils.toArray(".project-card").forEach(card => {
      gsap.fromTo(card, { y: 24 }, {
        y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 85%", once: true }
      });
    });
  } else {
    document.querySelectorAll(".reveal").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
  }
} else {
  document.querySelectorAll(".reveal").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
}
