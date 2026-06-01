import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useSceneTransitionOut } from "./trainingShared";

const clampOptions = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type FeatureCardProps = {
  index: number;
  title: string;
  description: string;
  frame: number;
};

const SectionPill: React.FC<{ text: string }> = ({ text }) => {
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
          background: "#8b6a3b",
          boxShadow: "0 0 0 6px rgba(139, 106, 59, 0.14)",
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

const GuideBackdrop: React.FC = () => {
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

const FeatureCard: React.FC<FeatureCardProps> = ({
  index,
  title,
  description,
  frame,
}) => {
  const localFrame = Math.max(frame - 18 - index * 12, 0);
  const reveal = spring({
    fps: 30,
    frame: localFrame,
    config: {
      damping: 24,
      stiffness: 62,
      mass: 1.08,
    },
  });

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [14, 0], clampOptions);
  const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
  const accentWidth = interpolate(reveal, [0, 1], [0, 12], clampOptions);

  const accents = ["#1f3933", "#8b6a3b", "#5d4a2f"];
  const accent = accents[index] ?? "#1f3933";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr",
        gap: 18,
        padding: 18,
        borderRadius: 28,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(248,242,233,0.42) 100%)",
        border: "1px solid rgba(35, 73, 64, 0.14)",
        boxShadow: "0 18px 36px rgba(32, 53, 47, 0.08)",
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          width: 72,
          minHeight: 72,
          borderRadius: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${accent}14 0%, ${accent}24 100%)`,
          border: `1px solid ${accent}22`,
          color: accent,
          fontFamily:
            '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        0{index + 1}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingTop: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: accentWidth,
              height: 2,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${accent} 0%, rgba(255,255,255,0) 100%)`,
            }}
          />
          <div
            style={{
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 28,
              fontWeight: 700,
              color: "#1f3933",
              letterSpacing: 1,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 22,
            lineHeight: "32px",
            color: "#5d4a2f",
            textWrap: "balance",
            maxWidth: 360,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export const TrainingGuideScene: React.FC = () => {
  const frame = useCurrentFrame();

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
  const sceneOpacity = useSceneTransitionOut(10);

  return (
    <AbsoluteFill>
      <GuideBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "72px 92px 70px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(340px, 460px) 1fr",
            gap: 48,
            width: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              maxWidth: 440,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <SectionPill text="第一部分" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily:
                    '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
                  fontSize: 74,
                  lineHeight: "88px",
                  fontWeight: 700,
                  color: "#1f3933",
                  textWrap: "balance",
                  textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
                }}
              >
                智能导购
              </div>
              <div
                style={{
                  fontFamily:
                    '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                  fontSize: 30,
                  lineHeight: "42px",
                  color: "#35554c",
                  letterSpacing: 3,
                  fontWeight: 600,
                }}
              >
                AI辅助选品
              </div>
            </div>

            <div
              style={{
                padding: "18px 22px",
                borderRadius: 22,
                background:
                  "linear-gradient(90deg, rgba(31,57,51,0.1) 0%, rgba(139,106,59,0.14) 52%, rgba(255,255,255,0.32) 100%)",
                border: "1px solid rgba(35, 73, 64, 0.12)",
                boxShadow: "0 16px 34px rgba(33, 56, 49, 0.08)",
                maxWidth: 400,
              }}
            >
              <div
                style={{
                  fontFamily:
                    '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                  fontSize: 26,
                  lineHeight: "38px",
                  color: "#5d4a2f",
                  letterSpacing: 1,
                  fontWeight: 600,
                }}
              >
                最核心、最常用的功能
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              paddingLeft: 18,
            }}
          >
            <FeatureCard
              index={0}
              title="AI 对话推荐"
              description="通过自然对话快速理解客户需求，并给出适合的丝绸选品方向。"
              frame={frame}
            />
            <FeatureCard
              index={1}
              title="商品检索筛选"
              description="围绕预算、偏好和场景精准筛选，把合适的商品迅速收拢到可选范围。"
              frame={frame}
            />
            <FeatureCard
              index={2}
              title="导出方案"
              description="将推荐结果整理成 Excel、PPT 或分享卡，方便继续和客户沟通。"
              frame={frame}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
