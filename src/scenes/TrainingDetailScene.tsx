import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import {
  clampOptions,
  GlassCard,
  PhonePreviewShell,
  SceneBackdrop,
  SectionPill,
  useSceneTransitionOut,
} from "./trainingShared";

const detailCards = [
  {
    title: "商品图片",
    description: "多角度图先把材质、花型和佩戴状态一次看全，决策感更直观。",
    accent: "#1f3933",
  },
  {
    title: "基础信息",
    description: "名称、价格、规格排在最显眼的位置，核心信息一眼就能读完。",
    accent: "#8b6a3b",
  },
  {
    title: "颜色规格",
    description: "不同色款可直接切换，方便在同一款式里做细腻对比。",
    accent: "#5d4a2f",
  },
  {
    title: "底部操作栏",
    description: "收藏、加购物车、立即咨询，动线收口清晰，动作也更自然。",
    accent: "#3f5b53",
  },
];

const titleFonts = {
  serif:
    '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
  body: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
};

type DetailCalloutProps = {
  frame: number;
  delay: number;
  label: string;
  accent: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  align?: "left" | "center" | "right";
};

type DetailCalloutConfig = Omit<DetailCalloutProps, "frame">;

const detailCallouts: DetailCalloutConfig[] = [
  {
    label: "商品图片",
    accent: "#1f3933",
    top: 118,
    left: 8,
    delay: 16,
  },
  {
    label: "基础信息",
    accent: "#8b6a3b",
    top: 528,
    left: 8,
    delay: 10,
  },
  {
    label: "颜色规格",
    accent: "#5d4a2f",
    top: 694,
    left: 8,
    delay: 20,
  },
  {
    label: "底部操作栏",
    accent: "#3f5b53",
    bottom: 34,
    left: 8,
    delay: 30,
  },
];

const SectionTitle: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          fontFamily: titleFonts.serif,
          fontSize: 38,
          lineHeight: "44px",
          fontWeight: 700,
          color: "#35554c",
        }}
      >
        商品详情页
      </div>
      <div
        style={{
          fontFamily: titleFonts.serif,
          fontSize: 64,
          lineHeight: "72px",
          fontWeight: 700,
          color: "#1f3933",
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
        }}
      >
        点击商品后
        <br />
        进入精致详情
      </div>
      <div
        style={{
          fontFamily: titleFonts.body,
          fontSize: 26,
          lineHeight: "36px",
          color: "#35554c",
          letterSpacing: 1.5,
          fontWeight: 600,
        }}
      >
        先看图，再看价格与规格，最后完成收藏、加购或咨询
      </div>
    </div>
  );
};

const SummaryCard: React.FC = () => {
  return (
    <GlassCard style={{ maxWidth: 440 }}>
      <div
        style={{
          fontFamily: titleFonts.body,
          fontSize: 22,
          lineHeight: "32px",
          color: "#5d4a2f",
          letterSpacing: 1,
          fontWeight: 600,
        }}
      >
        商品详情页把“看图、选款、行动”连成一条平缓的线，内容丰富，但节奏保持克制。
      </div>
    </GlassCard>
  );
};

const FeatureCard: React.FC<{
  index: number;
  title: string;
  description: string;
  frame: number;
  compact?: boolean;
}> = ({ index, title, description, frame, compact = true }) => {
  const localFrame = Math.max(frame - 18 - index * 11, 0);
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
  const accent = ["#1f3933", "#8b6a3b", "#5d4a2f", "#3f5b53"][index] ?? "#1f3933";
  const badgeSize = compact ? 48 : 72;
  const cardPadding = compact ? 14 : 18;
  const cardRadius = compact ? 24 : 28;
  const gap = compact ? 12 : 18;
  const titleSize = compact ? 21 : 28;
  const descriptionSize = compact ? 16 : 20;
  const descriptionLineHeight = compact ? "24px" : "30px";
  const badgeFontSize = compact ? 22 : 30;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${badgeSize}px 1fr`,
        gap,
        padding: cardPadding,
        borderRadius: cardRadius,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.64) 0%, rgba(248,242,233,0.44) 100%)",
        border: "1px solid rgba(35, 73, 64, 0.14)",
        boxShadow: "0 18px 36px rgba(32, 53, 47, 0.08)",
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
      >
        <div
          style={{
            width: badgeSize,
            minHeight: badgeSize,
            borderRadius: compact ? 16 : 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${accent}14 0%, ${accent}24 100%)`,
            border: `1px solid ${accent}22`,
            color: accent,
            fontFamily: titleFonts.serif,
            fontSize: badgeFontSize,
            fontWeight: 700,
          }}
        >
          0{index + 1}
        </div>

      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 8 : 12, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 14 }}>
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
              fontFamily: titleFonts.body,
              fontSize: titleSize,
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
            fontFamily: titleFonts.body,
            fontSize: descriptionSize,
            lineHeight: descriptionLineHeight,
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

const CalloutPill: React.FC<DetailCalloutProps> = ({
  frame,
  delay,
  label,
  accent,
  top,
  left,
  right,
  bottom,
  align = "left",
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

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.35, 1], clampOptions);
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
        opacity,
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

const FocusFrame: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div
      style={{
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
          gap: 4,
          height: 920,
        }}
      >
        <PhonePreviewShell frame={frame} imageSrc="training/商品详情页.png" width={470} height={920} revealDelay={10} />
        <div
          style={{
            position: "relative",
            width: 220,
            height: "100%",
            flexShrink: 0,
          }}
        >
          {detailCallouts.map((callout) => (
            <CalloutPill key={callout.label} frame={frame} {...callout} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TrainingDetailScene: React.FC = () => {
  const frame = useCurrentFrame();

  const heroReveal = spring({
    fps: 30,
    frame,
    config: {
      damping: 22,
      stiffness: 58,
      mass: 1.12,
    },
  });

  const heroOpacity = interpolate(heroReveal, [0, 0.25, 1], [0, 0.38, 1], clampOptions);
  const heroTranslateY = interpolate(heroReveal, [0, 1], [16, 0], clampOptions);
  const heroBlur = interpolate(heroReveal, [0, 1], [8, 0], clampOptions);
  const sceneOpacity = useSceneTransitionOut(12);

  return (
    <AbsoluteFill>
      <SceneBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "72px 88px 70px",
          opacity: sceneOpacity,
        }}
      >
          <div
            style={{
              display: "grid",
            gridTemplateColumns: "minmax(340px, 430px) minmax(560px, 1fr)",
            gap: 40,
              width: "100%",
              maxWidth: 1600,
              alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 430,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <SectionPill text="商品详情" />
            <SectionTitle />
            <SummaryCard />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              {detailCards.map((card, index) => (
                <FeatureCard
                  key={card.title}
                  index={index}
                  title={card.title}
                  description={card.description}
                  frame={frame}
                  compact
                />
              ))}
            </div>
          </div>

          <FocusFrame frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
