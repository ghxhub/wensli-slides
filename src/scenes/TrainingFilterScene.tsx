import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhonePreviewShell, useSceneTransitionOut } from "./trainingShared";

const clampOptions = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type FilterPoint = {
  title: string;
  description: string;
  accent: string;
  delay: number;
};

const filterPoints: FilterPoint[] = [
  {
    title: "关键词筛选",
    description: "先输入关键词、场景和风格，把范围快速收紧到目标商品。",
    accent: "#1f3933",
    delay: 0,
  },
  {
    title: "AI 辅助推荐",
    description: "在关键词基础上补充相近款和相关推荐，减少漏选。",
    accent: "#8b6a3b",
    delay: 12,
  },
  {
    title: "预算控制",
    description: "按价格区间继续筛选，把推荐范围稳定在可接受预算内。",
    accent: "#5d4a2f",
    delay: 24,
  },
  {
    title: "结果收敛",
    description: "条件越清楚，结果越少而准，方便直接进入下一步选品。",
    accent: "#b05b46",
    delay: 36,
  },
];

const FilterBackdrop: React.FC = () => {
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

const SectionPill: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "10px 22px",
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
          fontSize: 24,
          letterSpacing: 4,
          color: "#35554c",
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const TitleBlock: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
      }}
    >
      <div
        style={{
          fontFamily:
            '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
          fontSize: 66,
          lineHeight: "78px",
          fontWeight: 700,
          color: "#1f3933",
          textWrap: "balance",
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
        }}
      >
        关键词筛选
        <br />
        AI 辅助推荐
      </div>
      <div
        style={{
          fontFamily:
            '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
          fontSize: 24,
          lineHeight: "36px",
          color: "#5d4a2f",
          letterSpacing: 1,
          fontWeight: 500,
          textWrap: "balance",
          maxWidth: 480,
        }}
      >
        先用关键词把范围缩小，再让 AI 补充相近款和相关推荐，筛选更快也更准。
      </div>
    </div>
  );
};

const PointCard: React.FC<{
  point: FilterPoint;
  index: number;
  frame: number;
}> = ({ point, index, frame }) => {
  const localFrame = Math.max(frame - point.delay, 0);
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
  const translateY = interpolate(reveal, [0, 1], [12, 0], clampOptions);
  const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
  const accentWidth = interpolate(reveal, [0, 1], [0, 12], clampOptions);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        gap: 14,
        padding: 14,
        borderRadius: 24,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.66) 0%, rgba(248,242,233,0.46) 100%)",
        border: "1px solid rgba(35, 73, 64, 0.14)",
        boxShadow: "0 16px 30px rgba(32, 53, 47, 0.06)",
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          width: 58,
          minHeight: 58,
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${point.accent}14 0%, ${point.accent}24 100%)`,
          border: `1px solid ${point.accent}22`,
          color: point.accent,
          fontFamily:
            '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        0{index + 1}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          paddingTop: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: accentWidth,
              height: 2,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${point.accent} 0%, rgba(255,255,255,0) 100%)`,
            }}
          />
          <div
            style={{
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 24,
              fontWeight: 700,
              color: "#1f3933",
              letterSpacing: 1,
            }}
          >
            {point.title}
          </div>
        </div>
        <div
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 18,
            lineHeight: "26px",
            color: "#5d4a2f",
            textWrap: "balance",
          }}
        >
          {point.description}
        </div>
      </div>
    </div>
  );
};

const SummaryRibbon: React.FC<{ frame: number }> = ({ frame }) => {
  const ribbonReveal = spring({
    fps: 30,
    frame: Math.max(frame - 54, 0),
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.05,
    },
  });

  const opacity = interpolate(ribbonReveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(ribbonReveal, [0, 1], [12, 0], clampOptions);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: "14px 18px",
        borderRadius: 22,
        background:
          "linear-gradient(90deg, rgba(31,57,51,0.92) 0%, rgba(139,106,59,0.92) 52%, rgba(93,74,47,0.92) 100%)",
        boxShadow: "0 18px 36px rgba(32, 53, 47, 0.14)",
        color: "#fff7ea",
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 20,
            lineHeight: "28px",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          关键词先定方向，AI 再补推荐
        </div>
        <div
          style={{
            fontSize: 16,
            lineHeight: "22px",
            opacity: 0.92,
          }}
        >
          从关键词、面料、预算到场景逐步收窄，结果更稳，也更便于继续推荐。
        </div>
      </div>
    </div>
  );
};

const PreviewFrame: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = spring({
    fps: 30,
    frame: Math.max(frame - 12, 0),
    config: {
      damping: 24,
      stiffness: 62,
      mass: 1.05,
    },
  });

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.4, 1], clampOptions);
  const scale = interpolate(reveal, [0, 1], [0.975, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [18, 0], clampOptions);

  return (
    <div
      style={{
          width: "100%",
        }}
      >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PhonePreviewShell
          frame={frame}
          imageSrc="training/商品筛选.png"
          width={470}
          height={920}
          revealDelay={12}
        >
          <Img
            src={staticFile("training/商品筛选.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              opacity: interpolate(reveal, [0, 0.3, 1], [0.2, 0.2, 1], clampOptions),
            }}
          />
        </PhonePreviewShell>
      </div>
    </div>
  );
};

export const TrainingFilterScene: React.FC = () => {
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
  const sceneOpacity = useSceneTransitionOut(12);

  return (
    <AbsoluteFill>
      <FilterBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 84px 58px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(470px, 470px)",
            gap: 48,
            width: "100%",
            maxWidth: 1680,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 640,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <SectionPill text="关键词筛选" />
            <TitleBlock />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              {filterPoints.map((point, index) => (
                <PointCard
                  key={point.title}
                  point={point}
                  index={index}
                  frame={frame}
                />
              ))}
            </div>

            <SummaryRibbon frame={frame} />
          </div>

          <PreviewFrame frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
