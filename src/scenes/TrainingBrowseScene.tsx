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

type BrowseFeature = {
  title: string;
  description: string;
  accent: string;
  delay: number;
  tags?: string[];
};

const browseFeatures: BrowseFeature[] = [
  {
    title: "综合筛选",
    description:
      "先用新品首发、真丝甄选、限时折扣、礼盒专区、国风系列等标签，一步缩小浏览范围。",
    accent: "#1f3933",
    delay: 0,
    tags: ["新品首发", "真丝甄选", "限时折扣", "礼盒专区", "国风系列"],
  },
  {
    title: "销量筛选",
    description:
      "按销量高低排序，优先看到热销产品，先抓住市场认可度高的款式。",
    accent: "#8b6a3b",
    delay: 12,
  },
  {
    title: "价格筛选",
    description:
      "按价格区间或排序浏览，快速锁定预算合适、性价比更稳的产品。",
    accent: "#5d4a2f",
    delay: 24,
  },
];

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

const BrowseBackdrop: React.FC = () => {
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

const TitleBlock: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
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
        商品浏览
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
        用户主动筛选
      </div>
    </div>
  );
};

const SummaryCard: React.FC = () => {
  return (
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
        先看标签，再看销量和价格，手动把范围继续收窄，更适合已有方向的客户。
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  feature: BrowseFeature;
  index: number;
  frame: number;
}> = ({ feature, index, frame }) => {
  const localFrame = Math.max(frame - 16 - index * 10, 0);
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
          background: `linear-gradient(135deg, ${feature.accent}14 0%, ${feature.accent}24 100%)`,
          border: `1px solid ${feature.accent}22`,
          color: feature.accent,
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
              background: `linear-gradient(90deg, ${feature.accent} 0%, rgba(255,255,255,0) 100%)`,
            }}
          />
          <div
            style={{
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 26,
              fontWeight: 700,
              color: "#1f3933",
              letterSpacing: 1,
            }}
          >
            {feature.title}
          </div>
        </div>
        <div
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 19,
            lineHeight: "28px",
            color: "#5d4a2f",
            textWrap: "balance",
          }}
        >
          {feature.description}
        </div>

        {feature.tags?.length ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              paddingTop: 4,
            }}
          >
            {feature.tags.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "6px 9px",
                  borderRadius: 999,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.76) 0%, rgba(247,241,231,0.82) 100%)",
                  border: "1px solid rgba(45, 76, 68, 0.12)",
                  fontFamily:
                    '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                  fontSize: 14,
                  color: "#24473f",
                  fontWeight: 600,
                  letterSpacing: 0.3,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const TrainingBrowseScene: React.FC = () => {
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
      <BrowseBackdrop />

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
            maxWidth: 1680,
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
            <SectionPill text="第二部分" />
            <TitleBlock />
            <SummaryCard />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              paddingLeft: 18,
            }}
          >
            {browseFeatures.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                frame={frame}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
