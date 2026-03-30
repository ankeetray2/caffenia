import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, useTexture, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function BeanCluster() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const scrollY = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
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

  const beansCount = 350; // Increased count for denser shell with smaller beans
  const beans = useMemo(() => {
    const b = [];
    for (let i = 0; i < beansCount; i++) {
      // Fibonacci sphere distribution for a more uniform shell
      const phi = Math.acos(-1 + (2 * i) / beansCount);
      const theta = Math.sqrt(beansCount * Math.PI) * phi;
      
      // Create a shell effect with some thickness
      const radius = 5 + (Math.random() - 0.5) * 1.5; 
      
      b.push({
        initialPos: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        scale: 0.15 + Math.random() * 0.15,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        speed: 0.1 + Math.random() * 0.2,
      });
    }
    return b;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Smooth continuous rotation for the "revolver" feel
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, time * 0.15 + scrollY.current * 0.001, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(time * 0.1) * 0.1 + scrollY.current * 0.0005, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(time * 0.2) * 0.2 - scrollY.current * 0.001, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.current.x * 0.2, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <directionalLight position={[10, 10, 10]} intensity={2} color="#F5F5DC" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#C68E5D" />
      <pointLight position={[0, 0, 15]} intensity={1.5} color="#FFFFFF" />
      <MouseLight mouse={mouse} />
      
      {/* Central Core Bean */}
      <group scale={1.8}>
        <pointLight intensity={4} distance={15} color="#F5F5DC" />
        <ClusterBean 
          initialPos={new THREE.Vector3(0, 0, 0)} 
          scale={0.8} 
          rotation={new THREE.Euler(0, 0, 0)} 
          speed={0.5} 
          mouse={mouse} 
          scrollY={scrollY} 
          texture={texture} 
        />
      </group>

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
      intensity={5} 
      distance={40} 
      angle={0.8} 
      penumbra={1} 
      color="#F5F5DC" 
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
    
    const mouseV3 = tempVec.set(mouse.current.x * 12, mouse.current.y * 12, 6);
    const worldPos = groupRef.current.getWorldPosition(new THREE.Vector3());
    const dist = worldPos.distanceTo(mouseV3);
    
    const mouseFromCenter = tempV2.set(mouse.current.x, mouse.current.y).length();
    const isNearCluster = mouseFromCenter < 1.2;
    const expansionFactor = isNearCluster ? 1.6 : 1;
    
    const repulsionRadius = 6.5;
    const repulsionStrength = dist < repulsionRadius ? (repulsionRadius - dist) * 1.5 : 0;
    const repulsionDir = worldPos.sub(mouseV3).normalize();
    
    const dispersion = scrollY.current * 0.005;
    const finalTarget = initialPos.clone().multiplyScalar(expansionFactor + dispersion);
    
    if (repulsionStrength > 0 && groupRef.current && groupRef.current.parent) {
      const parentQuaternion = groupRef.current.parent.quaternion;
      if (parentQuaternion) {
        const localRepulsion = repulsionDir.applyQuaternion(parentQuaternion.clone().invert());
        finalTarget.add(localRepulsion.multiplyScalar(repulsionStrength));
      }
    }
    
    groupRef.current.position.lerp(finalTarget, 0.06);
    groupRef.current.rotation.x += 0.015 * speed + (dist < 5 ? 0.06 : 0);
    groupRef.current.rotation.y += 0.015 * speed + (dist < 5 ? 0.06 : 0);
    groupRef.current.rotation.z += 0.008 * speed;
    
    // Update emissive intensity for all materials in the group
    if (groupRef.current) {
      groupRef.current.children.forEach((child: any) => {
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat: any) => {
            if (mat && mat.emissive) {
              const glow = Math.max(0, 1 - dist * 0.15) * (isNearCluster ? 1.2 : 1);
              mat.emissiveIntensity = 0.5 + glow * 1.5;
              mat.emissive.set(glow > 0.5 ? "#F5F5DC" : "#4E342E");
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
          bumpScale={0.05}
          color="#8D6E63" 
          roughness={0.3} 
          metalness={0.3} 
          emissive="#4E342E"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Right Half of the bean */}
      <mesh position={[0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          bumpMap={texture}
          bumpScale={0.05}
          color="#8D6E63" 
          roughness={0.3} 
          metalness={0.3} 
          emissive="#4E342E"
          emissiveIntensity={0.4}
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
          emissive="#F5F5DC"
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
        color="#F5F5DC"
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
            emissive="#F5F5DC"
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
        color="#C68E5D"
        size={0.1}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        opacity={0.3}
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
              emissive="#4E342E"
              emissiveIntensity={1.2}
            />
          </mesh>
          <mesh position={[0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              map={texture}
              color="#4E342E" 
              roughness={0.2} 
              metalness={0.8} 
              emissive="#4E342E"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      </Float>
      
      {/* Explosive Aura */}
      <Sphere args={[3, 32, 32]} scale={1.5}>
        <meshStandardMaterial 
          color="#4E342E" 
          transparent 
          opacity={0.05} 
          emissive="#C68E5D" 
          emissiveIntensity={1.5} 
          side={THREE.BackSide}
        />
      </Sphere>
      
      <FieryParticles count={300} />
      
      {/* Intense Point Lights to simulate fire explosion */}
      <pointLight position={[2, 2, 2]} intensity={5} color="#C68E5D" />
      <pointLight position={[-2, -2, 2]} intensity={3} color="#4E342E" />
      <pointLight position={[0, 0, -2]} intensity={2} color="#C68E5D" />
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
          emissive="#4E342E"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}
