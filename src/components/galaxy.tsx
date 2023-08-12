"use client";

import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending } from "three";

function range(start: number, end: number, step = 1): number[] {
  if (step === 0) {
    throw new Error("Step cannot be zero.");
  }

  const result: number[] = [];

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }

  return result;
}

const defaultConfig = {
  particles: 500,
  particlesSize: 2,
  particlesSides: 12,
  particlesBlending: true,
  lightIntensity: 0.5,
  widthRadius: 120,
  widthRatio: 1.2,
  topHeightRadius: 80,
  bottomHeightRadius: 100,
  trails: 0,
  trailWidth: 40,
  trailLength: 100,
  trailDecay: 450,
  color: "white",
  xThickness: 7,
  xRandomnessFactor: 2.2,
  xRandomnessShape: 2.2,
  xRandomness: 5,
  yThickness: 20,
  max_speed: 0.1,
  min_speed: -0.1,
};

const useParticlesConfig = () => {
  const hash = window.location.hash;
  const isDebugMode = hash.includes("#debug");

  const [config, setConfig] = useState(defaultConfig);

  const handleSetConfig = (name, value) => {
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  const init = async () => {
    if (!isDebugMode) return;
    const dat = await import("dat.gui");
    const gui = new dat.GUI();
    const particlesFolder = gui.addFolder("Particles");
    const shapeFolder = gui.addFolder("Shape");

    particlesFolder
      .add(config, "particles")
      .min(1)
      .max(5000)
      .step(1)
      .onChange((value) => {
        handleSetConfig("particles", value);
      });
    shapeFolder
      .add(config, "widthRadius")
      .min(1)
      .max(200)
      .step(1)
      .onChange((value) => handleSetConfig("widthRadius", value));

    // add desired folders and parameters

    particlesFolder.open();
    shapeFolder.open();
  };

  useEffect(() => {
    init();
  }, []);

  return { config, handleSetConfig, isDebugMode };
};

export const ParticlesCanvas = ({
  particles,
}: {
  particles: {
    stickerId: number;
    color: string;
  }[];
}) => {
  const router = useRouter();

  const { config } = useParticlesConfig();

  const Geometry = () =>
    useMemo(
      () => (
        <circleGeometry args={[config.particlesSize, config.particlesSides]} />
      ),
      []
    );

  const blending = config.particlesBlending ? AdditiveBlending : undefined;

  const materials = useMemo(() => {
    const materials: { [color: string]: JSX.Element } = {};

    particles.forEach((particle) => {
      materials[particle.color] = (
        <meshStandardMaterial color={particle.color} blending={blending} />
      );
    });

    return materials;
  }, [blending, particles]);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-gray-900">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 75, position: [0, 0, 500] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0d010d");
        }}
      >
        <ambientLight intensity={config.lightIntensity} />
        <group
          position={[0, 0, 0]}
          rotation={[Math.PI * -0.3, 0, Math.PI * 0.3]}
        >
          {particles?.map((p, index) => (
            <Particle
              key={index}
              onClick={() => router.push(`/explore/${p.stickerId}`)}
            >
              <Geometry />
              {materials[p.color]}
            </Particle>
          ))}
        </group>
      </Canvas>
    </div>
  );
};

const Particle = ({
  children,
  onClick,
}: PropsWithChildren & {
  onClick?: () => void;
}) => {
  const particle = useRef<MeshProps>(null);
  const { config } = useParticlesConfig();

  const pathOffset =
    Math.pow(
      Math.random() * config.xRandomnessShape,
      config.xRandomness - config.xRandomness / 2
    ) * config.xThickness;

  const verticalRandomness =
    Math.random() * (config.yThickness - 1) + 1 - config.yThickness / 2;

  const speed =
    Math.random() * (config.min_speed - config.max_speed) + config.max_speed;

  const circumference = (config.widthRadius * Math.PI * 2) / 100;
  const delayOffsetFactor = 100;
  const delayOffset = Math.random() * delayOffsetFactor;

  useFrame(({ clock }) => {
    const timer = clock.getElapsedTime() * speed + delayOffset;
    const isEven = Math.floor(timer / circumference) % 2 == 0;

    if (!particle.current?.position) return;

    // When the loop count is even, draw bottom 8 shape
    // if odd, draw top 8 shape
    particle.current.position.x = isEven
      ? Math.sin(timer) * config.widthRadius * config.widthRatio + pathOffset
      : Math.sin(timer) * config.widthRadius * config.widthRatio + pathOffset;
    particle.current.position.y = isEven
      ? Math.cos(timer) * config.bottomHeightRadius -
        config.bottomHeightRadius +
        verticalRandomness
      : -Math.cos(timer) * config.topHeightRadius +
        config.topHeightRadius +
        verticalRandomness;
  });

  return (
    <motion.mesh
      ref={particle}
      onClick={onClick}
      whileHover={{
        scale: 5,
        cursor: "pointer",
      }}
    >
      {children}
    </motion.mesh>
  );
};
