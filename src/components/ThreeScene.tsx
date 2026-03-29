import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function BeanCluster() {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const scrollY = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load multiple realistic coffee bean textures for variety
  const textures = useTexture([
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=500',
    'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&q=80&w=500'
  ]);

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

  const beansCount = 45;
  const beans = useMemo(() => {
    const b = [];
    for (let i = 0; i < beansCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / beansCount);
      const theta = Math.sqrt(beansCount * Math.PI) * phi;
      const radius = 3.2 + Math.random() * 1.2;
      
      b.push({
        initialPos: new THREE.Vector3(
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ),
        scale: 0.18 + Math.random() * 0.12,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        speed: 0.15 + Math.random() * 0.4,
        textureIndex: i % textures.length
      });
    }
    return b;
  }, [textures.length]);

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
      {/* Rim light for cinematic effect */}
      <pointLight position={[0, 0, -5]} intensity={2} color="#C68E5D" />
      <MouseLight mouse={mouse} />
      {beans.map((bean, i) => (
        <ClusterBean key={i} {...bean} mouse={mouse} scrollY={scrollY} texture={textures[bean.textureIndex]} />
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
      intensity={3} 
      distance={25} 
      angle={0.5} 
      penumbra={1} 
      color="#FFD700" 
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
    
    if (repulsionStrength > 0) {
      const localRepulsion = repulsionDir.applyQuaternion(groupRef.current.parent!.quaternion.clone().invert());
      finalTarget.add(localRepulsion.multiplyScalar(repulsionStrength));
    }
    
    groupRef.current.position.lerp(finalTarget, 0.04);
    groupRef.current.rotation.x += 0.002 * speed + (dist < 3 ? 0.02 : 0);
    groupRef.current.rotation.y += 0.002 * speed + (dist < 3 ? 0.02 : 0);
    
    // Update emissive intensity for all materials in the group
    groupRef.current.children.forEach((child: any) => {
      if (child.material) {
        const glow = Math.max(0, 1 - dist * 0.2) * (isNearCluster ? 1.2 : 1);
        child.material.emissiveIntensity = 0.15 + glow * 1.8;
        child.material.emissive.set(glow > 0.35 ? "#C68E5D" : "#1a0f0a");
      }
    });
  });

  return (
    <group ref={groupRef} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Left Half of the bean */}
      <mesh position={[-0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          color="#3E2723" 
          roughness={0.4} 
          metalness={0.3} 
          emissive="#1a0f0a"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Right Half of the bean */}
      <mesh position={[0.08, 0, 0]} scale={[0.85, 1.4, 0.65]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          color="#3E2723" 
          roughness={0.4} 
          metalness={0.3} 
          emissive="#1a0f0a"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}


export function CoffeeBean({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={[scale, scale * 1.5, scale * 0.8]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#3E2723" 
          roughness={0.3} 
          metalness={0.2} 
          emissive="#1a0f0a"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

export function CoffeeDust({ count = 300 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const meshRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.position.setY(Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2);
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
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </points>
  );
}

export function CoffeeSteam({ count = 50 }) {
  const meshRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 5,
        z: (Math.random() - 0.5) * 2,
        speed: 0.01 + Math.random() * 0.02,
        opacity: 0.1 + Math.random() * 0.3
      });
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.children.forEach((child, i) => {
        child.position.y += particles[i].speed;
        if (child.position.y > 5) child.position.y = 0;
        child.rotation.y += 0.01;
      });
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color="#F5E6D3" 
            transparent 
            opacity={p.opacity} 
            emissive="#F5E6D3"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function LiquidBlob() {
  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1, 100, 100]} scale={2.5} position={[0, -1, -2]}>
        <MeshDistortMaterial
          color="#3E2723"
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.5}
          roughness={0.2}
          emissive="#2B1B12"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}
