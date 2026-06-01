import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clampOptions, GlassCard, SceneBackdrop } from "./trainingShared";

const titleFonts = {
  serif:
    '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
  body: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
};

const closingLines = [
  "感谢观看",
  "愿每一次推荐，都更懂客户所需",
];

const ClosingCopy: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        width: "100%",
      }}
    >
      {closingLines.map((line, index) => {
        const reveal = spring({
          fps: 30,
          frame: Math.max(frame - index * 10, 0),
          config: {
            damping: 26,
            stiffness: 58,
            mass: 1.04,
          },
        });

        const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
        const translateY = interpolate(reveal, [0, 1], [18, 0], clampOptions);
        const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
        const lineWidth = interpolate(reveal, [0, 1], [0, index === 0 ? 180 : 240], clampOptions);

        return (
          <React.Fragment key={line}>
            <div
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                filter: `blur(${blur}px)`,
                fontFamily: index === 0 ? titleFonts.serif : titleFonts.body,
                fontSize: index === 0 ? 92 : 36,
                lineHeight: index === 0 ? "108px" : "52px",
                fontWeight: index === 0 ? 700 : 600,
                letterSpacing: index === 0 ? 2 : 1.5,
                color: index === 0 ? "#1f3933" : "#35554c",
                textAlign: "center",
                textShadow: "0 12px 34px rgba(36, 44, 41, 0.10)",
                textWrap: "balance",
              }}
            >
              {line}
            </div>
            {index === 0 ? (
              <div
                style={{
                  width: lineWidth,
                  height: 2,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(139,106,59,0.86) 50%, rgba(0,0,0,0) 100%)",
                  opacity: interpolate(reveal, [0, 0.35, 1], [0, 0.24, 0.62], clampOptions),
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ValueCard: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = spring({
    fps: 30,
    frame: Math.max(frame - 24, 0),
    config: {
      damping: 26,
      stiffness: 56,
      mass: 1.06,
    },
  });

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.36, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [20, 0], clampOptions);
  const blur = interpolate(reveal, [0, 1], [12, 0], clampOptions);

  return (
    <GlassCard
      style={{
        maxWidth: 920,
        padding: "24px 34px",
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
        background:
          "linear-gradient(90deg, rgba(31,57,51,0.10) 0%, rgba(139,106,59,0.12) 54%, rgba(255,255,255,0.28) 100%)",
        border: "1px solid rgba(35, 73, 64, 0.10)",
        boxShadow: "0 18px 38px rgba(33, 56, 49, 0.06)",
      }}
    >
      <div
        style={{
          fontFamily: titleFonts.body,
          fontSize: 26,
          lineHeight: "40px",
          color: "#5d4a2f",
          textAlign: "center",
          fontWeight: 600,
          letterSpacing: 1,
          textWrap: "balance",
        }}
      >
        万事利丝绸 AI 选品助手，将继续陪伴每一次接待、推荐与导出，
        让选品表达更高效，也让沟通体验更从容。
      </div>
    </GlassCard>
  );
};

export const TrainingThanksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const heroReveal = spring({
    fps: 30,
    frame,
    config: {
      damping: 24,
      stiffness: 58,
      mass: 1.1,
    },
  });

  const heroOpacity = interpolate(heroReveal, [0, 0.25, 1], [0, 0.36, 1], clampOptions);
  const heroTranslateY = interpolate(heroReveal, [0, 1], [18, 0], clampOptions);
  const heroBlur = interpolate(heroReveal, [0, 1], [8, 0], clampOptions);
  const silkDrift = interpolate(frame, [0, durationInFrames], [0, -26], clampOptions);
  const silkScale = interpolate(frame, [0, durationInFrames], [1, 1.04], clampOptions);
  const spotlightOpacity = interpolate(frame, [0, 18, 72], [0, 0.24, 0.34], clampOptions);
  const closingOverlayOpacity = interpolate(
    frame,
    [Math.max(durationInFrames - 24, 0), durationInFrames],
    [0, 0.12],
    clampOptions,
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${silkDrift}px) scale(${silkScale})`,
          transformOrigin: "center center",
        }}
      >
        <SceneBackdrop />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 24%, rgba(255,255,255,0) 56%)",
          opacity: spotlightOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "17%",
          height: 1,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(139,106,59,0.22) 28%, rgba(31,57,51,0.28) 50%, rgba(139,106,59,0.22) 72%, rgba(0,0,0,0) 100%)",
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "18%",
          right: "18%",
          bottom: "16%",
          height: 1,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(31,57,51,0.18) 30%, rgba(139,106,59,0.24) 50%, rgba(31,57,51,0.18) 70%, rgba(0,0,0,0) 100%)",
          opacity: 0.72,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "96px 120px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            filter: `blur(${heroBlur}px)`,
          }}
        >
          <ClosingCopy frame={frame} />
          <ValueCard frame={frame} />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(248,243,236,0) 0%, rgba(248,243,236,0.06) 60%, rgba(248,243,236,0.16) 100%)",
          opacity: closingOverlayOpacity,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
