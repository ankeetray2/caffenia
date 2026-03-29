import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function BeanCluster() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const scrollY = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load a single reliable realistic macro coffee bean texture
  const texture = useTexture('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=500');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const beansCount = 80;
  const beans = useMemo(() => {
    const b = [];
    for (let i = 0; i < beansCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / beansCount);
      const theta = Math.sqrt(beansCount * Math.PI) * phi;
      const radius = 3.5 + Math.random() * 2; // Move further out
      
      b.push({
        initialPos: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        scale: 0.5 + Math.random() * 0.4, // Much larger
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        speed: 0.1 + Math.random() * 0.3,
      });
    }
    return b;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.08 + scrollY.current * 0.0006;
      groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.04 + scrollY.current * 0.0003;
      groupRef.current.position.y = Math.sin(time * 0.3) * 0.15 - scrollY.current * 0.0008;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.current.x * 0.04, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sun-like directional light */}
      <directionalLight position={[5, 5, 5]} intensity={3} color="#FFD700" />
      {/* Rim light for cinematic effect */}
      <pointLight position={[0, 0, -5]} intensity={4} color="#FFA500" />
      <MouseLight mouse={mouse} />
      {beans.map((bean, i) => (
        <ClusterBean key={i} {...bean} mouse={mouse} scrollY={scrollY} texture={texture} />
      ))}
    </group>
  );
}

function MouseLight({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.position.set(mouse.current.x * 10, mouse.current.y * 10, 10);
      lightRef.current.target.position.set(mouse.current.x * 5, mouse.current.y * 5, 0);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <spotLight 
      ref={lightRef} 
      intensity={15} 
      distance={40} 
      angle={0.8} 
      penumbra={1} 
      color="#FFA500" 
      castShadow={false}
    />
  );
}

function ClusterBean({ initialPos, scale, rotation, speed, mouse, scrollY, texture }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const tempV2 = useMemo(() => new THREE.Vector2(), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const mouseV3 = tempVec.set(mouse.current.x * 8, mouse.current.y * 8, 4);
    const worldPos = groupRef.current.getWorldPosition(new THREE.Vector3());
    const dist = worldPos.distanceTo(mouseV3);
    
    const mouseFromCenter = tempV2.set(mouse.current.x, mouse.current.y).length();
    const isNearCluster = mouseFromCenter < 0.8;
    const expansionFactor = isNearCluster ? 1.25 : 1;
    
    const repulsionRadius = 4.5;
    const repulsionStrength = dist < repulsionRadius ? (repulsionRadius - dist) * 0.9 : 0;
    const repulsionDir = worldPos.sub(mouseV3).normalize();
    
    const dispersion = scrollY.current * 0.003;
    const finalTarget = initialPos.clone().multiplyScalar(expansionFactor + dispersion);
    
    if (repulsionStrength > 0 && groupRef.current && groupRef.current.parent) {
      const parentQuaternion = groupRef.current.parent.quaternion;
      if (parentQuaternion) {
        const localRepulsion = repulsionDir.applyQuaternion(parentQuaternion.clone().invert());
        finalTarget.add(localRepulsion.multiplyScalar(repulsionStrength));
      }
    }
    
    groupRef.current.position.lerp(finalTarget, 0.04);
    groupRef.current.rotation.x += 0.01 * speed + (dist < 3 ? 0.04 : 0);
    groupRef.current.rotation.y += 0.01 * speed + (dist < 3 ? 0.04 : 0);
    groupRef.current.rotation.z += 0.005 * speed;
    
    // Update emissive intensity for all materials in the group
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any) => {
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat: any) => {
            if (mat && mat.emissive) {
              const glow = Math.max(0, 1 - dist * 0.2) * (isNearCluster ? 1.2 : 1);
              mat.emissiveIntensity = 0.5 + glow * 2.5;
              mat.emissive.set(glow > 0.3 ? "#FFD700" : "#4E342E");
            }
          });
        }
      });
    }
  });

  return (
    <group ref={groupRef} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Left Half of the bean */}
      <mesh position={[-0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          bumpMap={texture}
          bumpScale={0.04}
          color="#8D6E63" 
          roughness={0.35} 
          metalness={0.25} 
          emissive="#4E342E"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Right Half of the bean */}
      <mesh position={[0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          bumpMap={texture}
          bumpScale={0.04}
          color="#8D6E63" 
          roughness={0.35} 
          metalness={0.25} 
          emissive="#4E342E"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}


export function CoffeeBean({ position, rotation, scale, texture }: { position: [number, number, number], rotation: [number, number, number], scale: number, texture?: THREE.Texture }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.015;
      meshRef.current.rotation.y += 0.015;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={[scale, scale * 1.5, scale * 0.8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          color="#8D6E63" 
          roughness={0.3} 
          metalness={0.2} 
          emissive="#FFA500"
          emissiveIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

export function CoffeeDust({ count = 600 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const meshRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0008;
      meshRef.current.rotation.x += 0.0004;
      meshRef.current.position.setY(Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#D4AF37"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </points>
  );
}

export function CoffeeSteam({ count = 40 }) {
  const meshRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 8,
        z: (Math.random() - 0.5) * 4,
        speed: 0.005 + Math.random() * 0.01,
        opacity: 0.05 + Math.random() * 0.15,
        scale: 0.2 + Math.random() * 0.8
      });
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current && particles.length > 0) {
      meshRef.current.children.forEach((child, i) => {
        if (particles[i]) {
          child.position.y += particles[i].speed;
          child.position.x += Math.sin(state.clock.getElapsedTime() + i) * 0.005;
          if (child.position.y > 8) child.position.y = 0;
          child.rotation.y += 0.005;
        }
      });
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={[p.scale, p.scale, p.scale]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial 
            color="#FFF4E0" 
            transparent 
            opacity={p.opacity} 
            emissive="#FFD700"
            emissiveIntensity={0.2}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FieryParticles({ count = 100 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const meshRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current && meshRef.current.geometry && meshRef.current.geometry.attributes.position) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      if (positions) {
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += Math.sin(time + i) * 0.01;
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        color="#FF4500"
        size={0.15}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </points>
  );
}

export function ExplodingHeroBean() {
  const beanRef = useRef<THREE.Group>(null);
  const texture = useTexture('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=500');

  useFrame((state) => {
    if (beanRef.current) {
      const time = state.clock.getElapsedTime();
      beanRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      beanRef.current.rotation.y = time * 0.3;
      beanRef.current.position.y = Math.sin(time * 1.5) * 0.1;
    }
  });

  return (
    <group ref={beanRef}>
      <Float speed={4} rotationIntensity={2} floatIntensity={2}>
        <group scale={2.5}>
          {/* Main Bean Body with Fiery Glow */}
          <mesh position={[-0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              map={texture}
              color="#4E342E" 
              roughness={0.2} 
              metalness={0.8} 
              emissive="#FF4500"
              emissiveIntensity={2.5}
            />
          </mesh>
          <mesh position={[0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              map={texture}
              color="#4E342E" 
              roughness={0.2} 
              metalness={0.8} 
              emissive="#FF4500"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      </Float>
      
      {/* Explosive Aura */}
      <Sphere args={[3, 32, 32]} scale={1.5}>
        <meshStandardMaterial 
          color="#FF8C00" 
          transparent 
          opacity={0.1} 
          emissive="#FF4500" 
          emissiveIntensity={5} 
          side={THREE.BackSide}
        />
      </Sphere>
      
      <FieryParticles count={300} />
      
      {/* Intense Point Lights to simulate fire explosion */}
      <pointLight position={[2, 2, 2]} intensity={20} color="#FF4500" />
      <pointLight position={[-2, -2, 2]} intensity={15} color="#FF8C00" />
      <pointLight position={[0, 0, -2]} intensity={10} color="#FFD700" />
    </group>
  );
}

export function LiquidBlob() {
  return (
    <Float speed={3} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere args={[1, 64, 64]} scale={2.8} position={[0, -2, -8]}>
        <MeshDistortMaterial
          color="#2B1B12"
          speed={2.5}
          distort={0.5}
          radius={1}
          metalness={0.6}
          roughness={0.1}
          emissive="#FFA500"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  );
}
