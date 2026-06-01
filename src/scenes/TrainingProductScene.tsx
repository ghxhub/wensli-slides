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

type CalloutProps = {
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
};

type CalloutConfig = Omit<CalloutProps, "frame" | "opacity">;

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

const productFeatures = [
  {
    title: "底部切换",
    description: "点击中间的「商品」图标，直接进入商品库浏览。",
    accent: "#1f3933",
  },
  {
    title: "顶部搜索栏",
    description: "输入商品名、分类或材质关键词，快速定位目标商品。",
    accent: "#8b6a3b",
  },
  {
    title: "排序与筛选",
    description:
      "综合是默认推荐顺序；价格可升序、降序、取消；筛选会弹出多维面板。",
    accent: "#5d4a2f",
  },
];

const browseCallouts: CalloutConfig[] = [
  {
    label: "点击「商品」图标",
    accent: "#1f3933",
    bottom: 104,
    left: 8,
    delay: 4,
  },
  {
    label: "顶部搜索栏",
    accent: "#8b6a3b",
    top: 72,
    left: 8,
    delay: 16,
  },
  {
    label: "综合 / 价格 / 筛选",
    accent: "#5d4a2f",
    top: 146,
    left: 8,
    delay: 30,
  },
];

const filterCallouts: CalloutConfig[] = [
  {
    label: "多维筛选面板",
    accent: "#1f3933",
    top: 320,
    left: 8,
    delay: 82,
  },
  {
    label: "确定(1473)",
    accent: "#b05b46",
    bottom: 62,
    left: 8,
    delay: 96,
  },
];

const ProductBackdrop: React.FC = () => {
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
          fontSize: 42,
          lineHeight: "50px",
          fontWeight: 700,
          color: "#35554c",
        }}
      >
        切换到
      </div>
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
        商品 Tab
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
        底部点中间的「商品」图标进入商品库，搜索、排序和筛选都在这一页完成。
      </div>
    </div>
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
  const accent = ["#1f3933", "#8b6a3b", "#5d4a2f"][index] ?? "#1f3933";

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
            fontSize: 20,
            lineHeight: "30px",
            color: "#5d4a2f",
            textWrap: "balance",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const CalloutPill: React.FC<CalloutProps> = ({
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

  const pillOpacity = opacity * interpolate(reveal, [0, 0.3, 1], [0, 0.35, 1], clampOptions);
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
        padding: "9px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(35, 73, 64, 0.14)",
        boxShadow: "0 14px 30px rgba(32, 53, 47, 0.08)",
        backdropFilter: "blur(10px)",
        color: "#1f3933",
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        pointerEvents: "none",
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
      {label}
    </div>
  );
};

const PhonePreview: React.FC<{ frame: number }> = ({ frame }) => {
  const filterReveal = spring({
    fps: 30,
    frame: Math.max(frame - 72, 0),
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.05,
    },
  });

  const previewReveal = spring({
    fps: 30,
    frame: Math.max(frame - 12, 0),
    config: {
      damping: 24,
      stiffness: 62,
      mass: 1.05,
    },
  });

  const opacity = interpolate(previewReveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(previewReveal, [0, 1], [18, 0], clampOptions);
  const scale = interpolate(previewReveal, [0, 1], [0.975, 1], clampOptions);

  const browseOpacity = interpolate(filterReveal, [0, 1], [1, 0.2], clampOptions);
  const filterOpacity = interpolate(filterReveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const filterSlide = interpolate(filterReveal, [0, 1], [36, 0], clampOptions);
  const browseCalloutOpacity = interpolate(filterReveal, [0, 0.1, 0.18], [1, 0.12, 0], clampOptions);
  const browseCalloutLift = interpolate(filterReveal, [0, 1], [0, -10], clampOptions);

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
          width: "min(720px, 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 920,
        }}
      >
        <div
          style={{
            width: "min(470px, 100%)",
            height: "100%",
            padding: 16,
            borderRadius: 40,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(248,242,233,0.38) 100%)",
            border: "1px solid rgba(35, 73, 64, 0.14)",
            boxShadow: "0 30px 60px rgba(32, 53, 47, 0.12)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Img
            src={staticFile("training/商品浏览界面.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              opacity: browseOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: filterOpacity,
              transform: `translateX(${filterSlide}px)`,
            }}
          >
            <Img
              src={staticFile("training/商品分类.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            width: 220,
            height: "100%",
            flexShrink: 0,
          }}
        >
          {browseCallouts.map((callout) => (
            <CalloutPill
              key={callout.label}
              frame={frame}
              opacity={browseOpacity * browseCalloutOpacity}
              bottom={callout.bottom}
              top={callout.top}
              left={callout.left}
              right={callout.right}
              align={callout.align}
              accent={callout.accent}
              delay={callout.delay}
              label={callout.label}
            />
          ))}

          {filterCallouts.map((callout) => (
            <CalloutPill
              key={callout.label}
              frame={frame}
              opacity={filterOpacity}
              top={typeof callout.top === "number" ? callout.top + browseCalloutLift : callout.top}
              {...callout}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrainingProductScene: React.FC = () => {
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
      <ProductBackdrop />

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
            <SectionPill text="商品入口" />
            <TitleBlock />
            <SummaryCard />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {productFeatures.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  index={index}
                  title={feature.title}
                  description={feature.description}
                  frame={frame}
                />
              ))}
            </div>
          </div>

          <PhonePreview frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
