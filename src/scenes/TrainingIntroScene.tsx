import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useSceneTransitionOut } from "./trainingShared";

type IntroBlockProps = {
  text: string;
  delay: number;
  size: number;
  weight?: number;
  tracking?: number;
  color: string;
  lineHeight?: number;
  uppercase?: boolean;
};

const clampOptions = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const IntroBlock: React.FC<IntroBlockProps> = ({
  text,
  delay,
  size,
  weight = 700,
  tracking = 0,
  color,
  lineHeight,
  uppercase = false,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(frame - delay, 0);

  const reveal = spring({
    fps: 30,
    frame: localFrame,
    config: {
      damping: 24,
      stiffness: 68,
      mass: 1.08,
    },
  });

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [18, 0], clampOptions);
  const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
  const lineWidth = interpolate(reveal, [0, 1], [0, 140], clampOptions);
  const lineOpacity = interpolate(reveal, [0, 0.35, 1], [0, 0.2, 0.55], clampOptions);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          fontFamily:
            '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
          fontSize: size,
          lineHeight: `${lineHeight ?? Math.round(size * 1.14)}px`,
          fontWeight: weight,
          letterSpacing: tracking,
          color,
          textAlign: "center",
          textWrap: "balance",
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
          textTransform: uppercase ? "uppercase" : "none",
        }}
      >
        {text}
      </div>
      <div
        style={{
          width: lineWidth,
          height: 2,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(153, 116, 62, 0.82) 50%, rgba(0,0,0,0) 100%)",
          opacity: lineOpacity,
        }}
      />
    </div>
  );
};

const SilkRibbon: React.FC<{
  width: number;
  height: number;
}> = ({ width, height }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-10% -12%",
          background:
            "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 38%), radial-gradient(circle at 82% 16%, rgba(202, 226, 218, 0.34) 0%, rgba(202, 226, 218, 0) 34%), radial-gradient(circle at 82% 82%, rgba(214, 171, 106, 0.28) 0%, rgba(214, 171, 106, 0) 36%), linear-gradient(135deg, #f8f1e7 0%, #f1e3d0 36%, #dfe9e3 74%, #d6e0d8 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            "repeating-linear-gradient(118deg, rgba(255,255,255,0.08) 0 8px, rgba(255,255,255,0) 8px 38px)",
          opacity: 0.34,
          transform: "rotate(-8deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-12%",
          top: "8%",
          width: width * 0.52,
          height: height * 0.56,
          borderRadius: "62% 38% 56% 44% / 48% 54% 46% 52%",
          background:
            "linear-gradient(135deg, rgba(28, 63, 54, 0.36) 0%, rgba(28, 63, 54, 0.12) 48%, rgba(28, 63, 54, 0) 100%)",
          filter: "blur(12px)",
          transform: "rotate(-16deg)",
          opacity: 0.65,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-8%",
          bottom: "-14%",
          width: width * 0.58,
          height: height * 0.48,
          borderRadius: "54% 46% 38% 62% / 60% 40% 60% 40%",
          background:
            "linear-gradient(180deg, rgba(176, 132, 71, 0.32) 0%, rgba(176, 132, 71, 0.12) 52%, rgba(176, 132, 71, 0) 100%)",
          filter: "blur(18px)",
          transform: "rotate(10deg)",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 24%, rgba(255,255,255,0) 56%)",
        }}
      />
    </div>
  );
};

export const TrainingIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const heroReveal = spring({
    fps: 30,
    frame,
    config: {
      damping: 22,
      stiffness: 58,
      mass: 1.15,
    },
  });

  const heroOpacity = interpolate(heroReveal, [0, 0.25, 1], [0, 0.38, 1], clampOptions);
  const heroTranslateY = interpolate(heroReveal, [0, 1], [16, 0], clampOptions);
  const heroBlur = interpolate(heroReveal, [0, 1], [8, 0], clampOptions);
  const vignette = interpolate(frame, [0, 18, durationInFrames], [0, 0.18, 0.34], clampOptions);
  const sceneOpacity = useSceneTransitionOut(10);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #f3ede3 0%, #ece0cf 40%, #dbe7df 100%)",
      }}
    >
      <SilkRibbon width={width} height={height} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 48%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 52%)",
          opacity: vignette,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "7%",
          top: "10%",
          width: width * 0.18,
          height: height * 0.18,
          borderTop: "1px solid rgba(110, 91, 58, 0.32)",
          borderLeft: "1px solid rgba(110, 91, 58, 0.32)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "7%",
          bottom: "10%",
          width: width * 0.2,
          height: height * 0.2,
          borderRight: "1px solid rgba(28, 63, 54, 0.26)",
          borderBottom: "1px solid rgba(28, 63, 54, 0.26)",
          opacity: 0.5,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 120px",
          opacity: sceneOpacity,
        }}
      >
        <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          marginTop: 18,
          maxWidth: 1420,
          opacity: heroOpacity,
          transform: `translateY(${heroTranslateY}px)`,
          filter: `blur(${heroBlur}px)`,
        }}
      >
          <IntroBlock
            text="万事利丝绸选品助手"
            delay={0}
            size={96}
            lineHeight={114}
            color="#1f3933"
          />

          <IntroBlock
            text="让世界爱上中国丝绸"
            delay={22}
            size={48}
            weight={500}
            tracking={5}
            lineHeight={60}
            color="#5d4a2f"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, auto)",
              gap: 16,
              marginTop: 6,
              alignItems: "center",
            }}
          >
            {["智能推荐", "高效选品", "文件导出"].map((label, index) => {
              const badgeFrame = Math.max(frame - 30 - index * 12, 0);
              const badgeReveal = spring({
                fps: 30,
                frame: badgeFrame,
                config: { damping: 24, stiffness: 64, mass: 1.1 },
              });
              const badgeOpacity = interpolate(
                badgeReveal,
                [0, 0.3, 1],
                [0, 0.45, 1],
                clampOptions,
              );
              const badgeY = interpolate(badgeReveal, [0, 1], [14, 0], clampOptions);

              return (
                <div
                  key={label}
                  style={{
                    minWidth: 164,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 22px",
                    borderRadius: 18,
                    border: "1px solid rgba(51, 78, 71, 0.14)",
                    background: "rgba(255, 255, 255, 0.46)",
                    boxShadow: "0 12px 30px rgba(41, 55, 49, 0.06)",
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeY}px)`,
                    fontFamily:
                      '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                    fontSize: 21,
                    color: "#35554c",
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
