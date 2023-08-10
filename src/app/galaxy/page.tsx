"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending } from "three";

function range(start: number, end: number, step: number = 1): number[] {
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

let defaultConfig = {
  particles: 500,
  particlesSize: 2,
  goldParticlesSize: 1.5,
  particlesSides: 5,
  particlesBlending: true,
  lightIntensity: 0.3,
  widthRadius: 100,
  widthRatio: 1.2,
  topHeightRadius: 80,
  bottomHeightRadius: 100,
  trails: 0,
  trailWidth: 40,
  trailLength: 100,
  trailDecay: 450,
  color: "white",
  colorGold: "#b89d18",
  xThickness: 7,
  xRandomnessFactor: 2.2,
  xRandomnessShape: 2.2,
  xRandomness: 5,
  yThickness: 20,
  max_speed: 0.1,
  min_speed: -0.1,
  showGold: true,
};

const useParticlesConfig = () => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  const isDebugMode = hash.includes("#debug");
  const [particles, setParticles] = useState(range(0, defaultConfig.particles));

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
        setParticles(range(0, value));
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

  return { config, handleSetConfig, particles, setParticles, isDebugMode };
};

const ParticlesCanvas = () => {
  if (typeof window === "undefined") return null;

  const router = useRouter();

  const { config, particles } = useParticlesConfig();

  const Geometry = () =>
    useMemo(
      () => (
        <circleGeometry args={[config.particlesSize, config.particlesSides]} />
      ),
      []
    );

  const particlesInfo = [...Array(config.particles)].map((_, index) => {
    return {
      id: index,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };
  });

  const blending = config.particlesBlending ? AdditiveBlending : undefined;

  const materials = useMemo(() => {
    const materials: { [color: string]: JSX.Element } = {};

    particlesInfo.forEach((particle) => {
      materials[particle.color] = (
        <meshStandardMaterial color={particle.color} blending={blending} />
      );
    });

    return materials;
  }, [particlesInfo]);

  const Material = () =>
    useMemo(
      () => (
        <meshStandardMaterial
          color={config.color}
          blending={config.particlesBlending ? AdditiveBlending : undefined}
        />
      ),
      []
    );

  console.log("materials, particlesInfo", materials, particlesInfo);
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000000" }}>
      <Canvas dpr={[1, 2]} camera={{ fov: 75, position: [0, 0, 500] }}>
        <ambientLight intensity={config.lightIntensity} />
        <group
          position={[0, 0, 0]}
          rotation={[Math.PI * -0.3, 0, Math.PI * 0.5]}
        >
          {/* {particles?.map((_, index) => ( */}
          {particlesInfo?.map((p, index) => (
            <Particle
              key={index}
              onClick={() => router.push(`/sticker/${p.id}`)}
            >
              <Geometry />
              {materials[p.color]}
              {/* <Material /> */}
              {/* <meshStandardMaterial color={p.color} blending={blending} />, */}
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
  const particle = useRef(null);
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
    <mesh ref={particle} onClick={onClick}>
      {children}
    </mesh>
  );
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <ParticlesCanvas />
    </div>
  );
}
