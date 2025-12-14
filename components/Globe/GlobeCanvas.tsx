'use client';

import { BALLOON_COLORS, GLOBE_RADIUS, MAP_GEO_JSON_URL, MAP_STYLE } from '@/lib/constants';
import { useBalloonStore } from '@/lib/store/balloonStore';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface GlobeCanvasProps {}

// Converts geographical coordinates to 3D Cartesian coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

const GlobeCanvas: React.FC<GlobeCanvasProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const balloonMeshesRef = useRef<THREE.Mesh[]>([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(30);

  // Material refs for theme switching
  const globeMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const atmosphereMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const mapLineMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);

  const { balloonData, minAltitudeFilter, maxAltitudeFilter, isGlobeRotating } =
    useBalloonStore();

  // Get filtered balloons
  const filteredBalloons = useMemo(() => {
    return balloonData.filter(
      (balloon) =>
        balloon.alt >= minAltitudeFilter && balloon.alt <= maxAltitudeFilter
    );
  }, [balloonData, minAltitudeFilter, maxAltitudeFilter]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.z = zoomRef.current;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    const container = containerRef.current;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create globe group for unified rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Create globe base
    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 40);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e1c1d,
      transparent: true,
      opacity: 0.9,
    });
    globeMaterialRef.current = globeMaterial;
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 40, 40);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xcec47f,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    atmosphereMaterialRef.current = atmosphereMaterial;
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Load and add map geometry (country boundaries)
    const addMapGeometry = async () => {
      try {
        const response = await fetch(MAP_GEO_JSON_URL);
        const data = await response.json();

        const lineMaterial = new THREE.LineBasicMaterial({
          color: MAP_STYLE.NORMAL_COLOR,
          opacity: MAP_STYLE.NORMAL_OPACITY,
          transparent: true,
        });
        mapLineMaterialRef.current = lineMaterial;

        // Apply initial theme to the new line material
        const isDark = document.documentElement.classList.contains('dark');
        lineMaterial.color.setHex(isDark ? 0xdae0d4 : 0x1e1c1d);

        data.features.forEach((feature: GeoJSON.Feature) => {
          if (!feature.geometry) return;
          if (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') return;
          
          const geometry = feature.geometry;
          const coordinates = geometry.coordinates as number[][][] | number[][][][];
          const polygons: number[][][][] = geometry.type === 'MultiPolygon' 
            ? (coordinates as number[][][][]) 
            : [coordinates as number[][][]];

          polygons.forEach((polygon) => {
            polygon.forEach((ring) => {
              const points: THREE.Vector3[] = [];

              for (let i = 0; i < ring.length; i++) {
                const [lon, lat] = ring[i];
                const vector = latLonToVector3(lat, lon, GLOBE_RADIUS + 0.02);
                points.push(vector);
              }

              if (points.length > 1) {
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, lineMaterial);
                globeGroup.add(line);
              }
            });
          });
        });
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    addMapGeometry();

    // Theme handling
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      if (globeMaterialRef.current) {
        globeMaterialRef.current.color.setHex(isDark ? 0x1e1c1d : 0xdae0d4);
      }
      
      if (atmosphereMaterialRef.current) {
        // Dark mode: Gold glow. Light mode: Dark glow.
        atmosphereMaterialRef.current.color.setHex(isDark ? 0xcec47f : 0x1e1c1d);
        atmosphereMaterialRef.current.opacity = isDark ? 0.1 : 0.05;
      }

      if (mapLineMaterialRef.current) {
        mapLineMaterialRef.current.color.setHex(isDark ? 0xdae0d4 : 0x1e1c1d);
      }
    };

    // Initial update
    updateTheme();

    // Observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Mouse events
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = event.clientX - previousMousePositionRef.current.x;
        const deltaY = event.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;

        previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
      }

      // Raycasting for hover
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(balloonMeshesRef.current);

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        const hoveredBalloonData = hoveredMesh.userData;
        
        if (hoveredBalloonData) {
          // Get current balloonData from store to avoid stale closure
          const currentBalloonData = useBalloonStore.getState().balloonData;
          const balloon = currentBalloonData.find((b) => b.index === hoveredBalloonData.balloonIndex);
          
          if (balloon) {
            useBalloonStore.getState().setHoveredBalloon(balloon);
          }
        }
        document.body.style.cursor = 'pointer';
      } else {
        useBalloonStore.getState().setHoveredBalloon(null);
        document.body.style.cursor = 'default';
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(balloonMeshesRef.current);

      if (intersects.length > 0) {
        const selectedMesh = intersects[0].object as THREE.Mesh;
        const selectedBalloonData = selectedMesh.userData;
        if (selectedBalloonData) {
          // Get current balloonData from store to avoid stale closure
          const currentBalloonData = useBalloonStore.getState().balloonData;
          
          // Find the balloon from current balloonData by index
          const balloon = currentBalloonData.find((b) => b.index === selectedBalloonData.balloonIndex);
          if (balloon) {
            useBalloonStore.getState().setSelectedBalloon(balloon);
          }
        }
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomRef.current += event.deltaY * 0.05;
      zoomRef.current = Math.max(15, Math.min(60, zoomRef.current));
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Update rotation - read from store directly to avoid stale closure
      const { isGlobeRotating: isRotating } = useBalloonStore.getState();
      if (isRotating) {
        targetRotationRef.current.y += 0.0003;
      }

      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.05;
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.05;

      // Rotate the entire globe group (includes globe, atmosphere, map lines, and balloons)
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = rotationRef.current.x;
        globeGroupRef.current.rotation.y = rotationRef.current.y;
      }

      // Update camera zoom
      camera.position.z += (zoomRef.current - camera.position.z) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    const domElement = renderer.domElement;
    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('mousemove', onMouseMove);
      domElement.removeEventListener('mousedown', onMouseDown);
      domElement.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onClick);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Update balloons based on filtered data
  useEffect(() => {
    if (!globeGroupRef.current) return;

    // Remove old balloon meshes
    balloonMeshesRef.current.forEach((mesh) => {
      globeGroupRef.current?.remove(mesh);
      const geometry = mesh.geometry as THREE.BufferGeometry;
      const material = mesh.material as THREE.Material;
      geometry.dispose();
      material.dispose();
    });
    balloonMeshesRef.current = [];

    // Create new balloon meshes
    filteredBalloons.forEach((balloon) => {
      // Use latLonToVector3 helper for consistency
      const position = latLonToVector3(balloon.lat, balloon.lon, GLOBE_RADIUS + 0.15);

      // Determine color based on altitude (in km)
      let color = BALLOON_COLORS.LOWER_TROPOSPHERE;
      if (balloon.alt > 25) {
        color = BALLOON_COLORS.STRATOSPHERE;
      } else if (balloon.alt > 12) {
        color = BALLOON_COLORS.UPPER_TROPOSPHERE;
      }

      const geometry = new THREE.SphereGeometry(0.15, 8, 8);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.userData = { balloonIndex: balloon.index };

      globeGroupRef.current?.add(mesh);
      balloonMeshesRef.current.push(mesh);
    });
  }, [filteredBalloons]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default GlobeCanvas;
