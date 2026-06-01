import React, { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const clampOptions = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SceneTransitionContext = createContext(false);

export const SceneTransitionProvider: React.FC<{
  enabled: boolean;
  children: React.ReactNode;
}> = ({ enabled, children }) => {
  return (
    <SceneTransitionContext.Provider value={enabled}>
      {children}
    </SceneTransitionContext.Provider>
  );
};

export const useSceneTransitionOut = (fadeFrames: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const transitionsEnabled = useContext(SceneTransitionContext);

  if (!transitionsEnabled) {
    return 1;
  }

  return interpolate(
    frame,
    [Math.max(durationInFrames - fadeFrames, 0), durationInFrames],
    [1, 0],
    clampOptions,
  );
};

export const SceneBackdrop: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #f3ede3 0%, #ece0cf 40%, #dbe7df 100%)",
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
          opacity: 0.3,
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
            "linear-gradient(135deg, rgba(28, 63, 54, 0.24) 0%, rgba(28, 63, 54, 0.08) 48%, rgba(28, 63, 54, 0) 100%)",
          filter: "blur(12px)",
          transform: "rotate(-16deg)",
          opacity: 0.7,
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
            "linear-gradient(180deg, rgba(176, 132, 71, 0.28) 0%, rgba(176, 132, 71, 0.1) 52%, rgba(176, 132, 71, 0) 100%)",
          filter: "blur(18px)",
          transform: "rotate(10deg)",
          opacity: 0.95,
        }}
      />
    </AbsoluteFill>
  );
};

export const SectionPill: React.FC<{
  text: string;
  accent?: string;
}> = ({ text, accent = "#8b6a3b" }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "12px 24px",
        borderRadius: 999,
        border: "1px solid rgba(35, 73, 64, 0.18)",
        background: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 18px 40px rgba(33, 56, 49, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 0 6px ${accent}14`,
        }}
      />
      <span
        style={{
          fontFamily:
            '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
          fontSize: 26,
          letterSpacing: 5,
          color: "#35554c",
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        padding: "18px 22px",
        borderRadius: 22,
        background:
          "linear-gradient(90deg, rgba(31,57,51,0.1) 0%, rgba(139,106,59,0.14) 52%, rgba(255,255,255,0.32) 100%)",
        border: "1px solid rgba(35, 73, 64, 0.12)",
        boxShadow: "0 16px 34px rgba(33, 56, 49, 0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const FocusLabel: React.FC<{
  frame: number;
  delay: number;
  label: string;
  accent: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  align?: "left" | "center" | "right";
  opacity?: number;
  fontSize?: number;
  padding?: string;
  maxWidth?: number;
}> = ({
  frame,
  delay,
  label,
  accent,
  top,
  left,
  right,
  bottom,
  align = "left",
  opacity = 1,
  fontSize = 16,
  padding = "10px 14px",
  maxWidth,
}) => {
  const localFrame = Math.max(frame - delay, 0);
  const reveal = spring({
    fps: 30,
    frame: localFrame,
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.05,
    },
  });

  const pillOpacity =
    opacity * interpolate(reveal, [0, 0.3, 1], [0, 0.35, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [12, 0], clampOptions);
  const scale = interpolate(reveal, [0, 1], [0.98, 1], clampOptions);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        opacity: pillOpacity,
        transform:
          align === "center"
            ? `translate(-50%, ${translateY}px) scale(${scale})`
            : `translateY(${translateY}px) scale(${scale})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding,
        borderRadius: 999,
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(35, 73, 64, 0.10)",
        boxShadow: "0 10px 22px rgba(32, 53, 47, 0.06)",
        backdropFilter: "blur(10px)",
        color: "#1f3933",
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
        fontSize,
        fontWeight: 600,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        maxWidth,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: accent,
          boxShadow: `0 0 0 5px ${accent}18`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const PhonePreviewShell: React.FC<{
  frame: number;
  imageSrc: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  revealDelay?: number;
}> = ({
  frame,
  imageSrc,
  children,
  width = 470,
  height = 920,
  revealDelay = 12,
}) => {
  const previewReveal = spring({
    fps: 30,
    frame: Math.max(frame - revealDelay, 0),
    config: {
      damping: 24,
      stiffness: 62,
      mass: 1.05,
    },
  });

  const opacity = interpolate(previewReveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(previewReveal, [0, 1], [18, 0], clampOptions);
  const scale = interpolate(previewReveal, [0, 1], [0.975, 1], clampOptions);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `min(${width}px, 100%)`,
          height,
          padding: 16,
          borderRadius: 40,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(248,242,233,0.38) 100%)",
          border: "1px solid rgba(35, 73, 64, 0.14)",
          boxShadow: "0 30px 60px rgba(32, 53, 47, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 30,
            overflow: "hidden",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(245,240,232,0.82) 100%)",
            position: "relative",
          }}
        >
          <Img
            src={staticFile(imageSrc)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};
