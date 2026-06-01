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
  SceneBackdrop,
  SectionPill,
  useSceneTransitionOut,
} from "./trainingShared";

const titleFonts = {
  serif:
    '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
  body: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
};

const moduleCards = [
  {
    title: "收藏",
    description: "心仪商品的清单",
    accent: "#1f3933",
    delay: 0,
    offsetX: -24,
    offsetY: -18,
  },
  {
    title: "足迹",
    description: "最近浏览过的商品",
    accent: "#8b6a3b",
    delay: 10,
    offsetX: 16,
    offsetY: -24,
  },
  {
    title: "文件",
    description: "所有导出的 Excel / PPT",
    accent: "#5d4a2f",
    delay: 20,
    offsetX: -30,
    offsetY: 28,
  },
  {
    title: "分享",
    description: "转发给同事或客户",
    accent: "#3f5b53",
    delay: 30,
    offsetX: 18,
    offsetY: 34,
  },
];

const ChapterTitle: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          fontFamily: titleFonts.serif,
          fontSize: 42,
          lineHeight: "50px",
          fontWeight: 700,
          color: "#35554c",
        }}
      >
        第三部分
      </div>
      <div
        style={{
          fontFamily: titleFonts.serif,
          fontSize: 74,
          lineHeight: "88px",
          fontWeight: 700,
          color: "#1f3933",
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
        }}
      >
        个人中心
      </div>
      <div
        style={{
          fontFamily: titleFonts.body,
          fontSize: 30,
          lineHeight: "42px",
          color: "#35554c",
          letterSpacing: 2,
          fontWeight: 600,
        }}
      >
        日常管理
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
          fontSize: 26,
          lineHeight: "38px",
          color: "#5d4a2f",
          letterSpacing: 1,
          fontWeight: 600,
        }}
      >
        收藏、足迹、文件、分享，把浏览、沉淀和复用串成一条更稳定的管理线。
      </div>
    </GlassCard>
  );
};

const ModuleTile: React.FC<{
  title: string;
  description: string;
  accent: string;
  frame: number;
  delay: number;
  offsetX: number;
  offsetY: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}> = ({
  title,
  description,
  accent,
  frame,
  delay,
  offsetX,
  offsetY,
  top,
  left,
  right,
  bottom,
}) => {
  const localFrame = Math.max(frame - delay, 0);
  const reveal = spring({
    fps: 30,
    frame: localFrame,
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.08,
    },
  });

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateX = interpolate(reveal, [0, 1], [offsetX, 0], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [offsetY + 14, 0], clampOptions);
  const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
  const scale = interpolate(reveal, [0, 1], [0.98, 1], clampOptions);

  return (
    <div
      style={{
        position: "absolute",
        width: 280,
        padding: 18,
        borderRadius: 28,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.70) 0%, rgba(248,242,233,0.48) 100%)",
        border: `1px solid ${accent}22`,
        boxShadow: `0 18px 34px rgba(32, 53, 47, 0.08)`,
        opacity,
        top,
        left,
        right,
        bottom,
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            background: accent,
            boxShadow: `0 0 0 7px ${accent}16`,
            flexShrink: 0,
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
  );
};

const OrbitStage: React.FC<{ frame: number }> = ({ frame }) => {
  const stageReveal = spring({
    fps: 30,
    frame: Math.max(frame - 8, 0),
    config: {
      damping: 22,
      stiffness: 58,
      mass: 1.12,
    },
  });

  const opacity = interpolate(stageReveal, [0, 0.25, 1], [0, 0.35, 1], clampOptions);
  const translateY = interpolate(stageReveal, [0, 1], [18, 0], clampOptions);
  const scale = interpolate(stageReveal, [0, 1], [0.975, 1], clampOptions);
  const rotate = interpolate(frame % 360, [0, 360], [0, 360], clampOptions);

  return (
    <div
      style={{
        position: "relative",
        width: "min(760px, 100%)",
        height: 700,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 18,
          borderRadius: 42,
          background:
            "radial-gradient(circle at 50% 48%, rgba(31,57,51,0.08) 0%, rgba(31,57,51,0) 46%), radial-gradient(circle at 30% 20%, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0) 46%), radial-gradient(circle at 80% 74%, rgba(139,106,59,0.10) 0%, rgba(139,106,59,0) 46%)",
          border: "1px solid rgba(35, 73, 64, 0.10)",
          boxShadow: "0 24px 58px rgba(32, 53, 47, 0.08) inset",
          transform: `rotate(${rotate * 0.015}deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.48) 28%, rgba(255,255,255,0.1) 62%, rgba(255,255,255,0) 74%)",
          border: "1px solid rgba(255,255,255,0.56)",
          boxShadow: "0 24px 60px rgba(31,57,51,0.09)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontFamily: titleFonts.serif,
              fontSize: 34,
              fontWeight: 700,
              color: "#1f3933",
            }}
          >
            个人中心
          </div>
          <div
            style={{
              fontFamily: titleFonts.body,
              fontSize: 22,
              lineHeight: "30px",
              color: "#35554c",
              fontWeight: 600,
            }}
          >
            日常管理中枢
          </div>
        </div>
      </div>

      {moduleCards.map((card, index) => {
        const placements = [
          { top: 48, left: 82 },
          { top: 58, right: 72 },
          { bottom: 52, left: 68 },
          { bottom: 62, right: 88 },
        ];
        const placement = placements[index];

        return (
          <ModuleTile
            key={card.title}
            title={card.title}
            description={card.description}
            accent={card.accent}
            frame={frame}
            delay={card.delay}
            offsetX={card.offsetX}
            offsetY={card.offsetY}
            {...placement}
          />
        );
      })}
    </div>
  );
};

export const TrainingProfileChapterScene: React.FC = () => {
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
            gridTemplateColumns: "minmax(360px, 480px) 1fr",
            gap: 48,
            width: "100%",
            maxWidth: 1780,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              maxWidth: 460,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <SectionPill text="个人中心" />
            <ChapterTitle />
            <SummaryCard />
          </div>

          <OrbitStage frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
