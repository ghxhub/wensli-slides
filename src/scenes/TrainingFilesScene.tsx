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

const titleFonts = {
  serif:
    '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
  body: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
};

const featureCards = [
  {
    title: "文件助手",
    description: "导出后的文件统一归档，保留操作痕迹，便于回看和继续处理。",
    accent: "#1f3933",
  },
  {
    title: "收藏夹导出",
    description: "将心仪商品批量整理后导出，形成更完整的备选方案。",
    accent: "#8b6a3b",
  },
  {
    title: "保存本地",
    description: "文件落到本地，方便离线传递和后续修改。",
    accent: "#5d4a2f",
  },
];

const SectionTitle: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
        文件助手导出
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
        从个人中心到文件助手，再到收藏夹导出，形成顺手的收口动作。
      </div>
    </div>
  );
};

const SummaryCard: React.FC = () => {
  return (
    <GlassCard style={{ maxWidth: 460 }}>
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
        文件助手负责归档，收藏夹负责沉淀，两者一起把导出动作收得更完整。
      </div>
    </GlassCard>
  );
};

const FeatureCard: React.FC<{
  index: number;
  title: string;
  description: string;
  frame: number;
}> = ({ index, title, description, frame }) => {
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
          width: 72,
          minHeight: 72,
          borderRadius: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${accent}14 0%, ${accent}24 100%)`,
          border: `1px solid ${accent}22`,
          color: accent,
          fontFamily: titleFonts.serif,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        0{index + 1}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
            fontFamily: titleFonts.body,
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

const ExportPreview: React.FC<{ frame: number }> = ({ frame }) => {
  const shelfReveal = spring({
    fps: 30,
    frame: Math.max(frame - 10, 0),
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.05,
    },
  });

  const overlayReveal = spring({
    fps: 30,
    frame: Math.max(frame - 36, 0),
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.05,
    },
  });

  const baseY = interpolate(shelfReveal, [0, 1], [18, 0], clampOptions);
  const overlayOpacity = interpolate(overlayReveal, [0, 0.3, 1], [0, 0.22, 1], clampOptions);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      <div
        style={{
          opacity: interpolate(shelfReveal, [0, 0.3, 1], [0, 0.35, 1], clampOptions),
          transform: `translateY(${baseY}px)`,
        }}
      >
        <PhonePreviewShell frame={frame} imageSrc="training/文件助手导出.png" width={470} height={920} revealDelay={10}>
        </PhonePreviewShell>
      </div>

      <div
        style={{
          opacity: overlayOpacity,
          transform: `translateY(${interpolate(overlayReveal, [0, 1], [14, 0], clampOptions)}px)`,
        }}
      >
        <PhonePreviewShell frame={frame} imageSrc="training/收藏夹导出.png" width={470} height={920} revealDelay={36} />
      </div>
    </div>
  );
};

export const TrainingFilesScene: React.FC = () => {
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
            gap: 88,
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
            <SectionPill text="文件助手导出" />
            <SectionTitle />
            <SummaryCard />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {featureCards.map((card, index) => (
                <FeatureCard
                  key={card.title}
                  index={index}
                  title={card.title}
                  description={card.description}
                  frame={frame}
                />
              ))}
            </div>
          </div>

          <ExportPreview frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
