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

const entryCards = [
  {
    title: "收藏",
    description: "心仪商品的清单，方便回头复用。",
    accent: "#1f3933",
  },
  {
    title: "足迹",
    description: "最近浏览过的商品，顺着兴趣继续跟进。",
    accent: "#8b6a3b",
  },
  {
    title: "我的文件",
    description: "所有导出的 Excel / PPT 都能在这里找到。",
    accent: "#5d4a2f",
  },
  {
    title: "客服服务",
    description: "内部帮助渠道、设置与退出登录都在此页完成。",
    accent: "#3f5b53",
  },
];

const EntryTitle: React.FC = () => {
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
        个人中心入口
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
        点击底部右侧
        <br />
        进入个人中心
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
        这里集中放着收藏、足迹、文件、客服与设置入口。
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
        这个页面既是结果的归档处，也是后续复用、导出和切换账号的起点。
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
  const badgeSize = 48;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 14,
        padding: 14,
        borderRadius: 24,
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
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${accent}14 0%, ${accent}24 100%)`,
          border: `1px solid ${accent}22`,
          color: accent,
          fontFamily: titleFonts.serif,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        0{index + 1}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              fontSize: 20,
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
            fontSize: 16,
            lineHeight: "24px",
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

const ScreenshotStage: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "min(470px, 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 920,
        }}
      >
        <PhonePreviewShell
          frame={frame}
          imageSrc="training/个人中心导出.png"
          width={470}
          height={920}
          revealDelay={10}
        />
      </div>
    </div>
  );
};

export const TrainingProfileEntryScene: React.FC = () => {
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
          padding: "72px 96px 70px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(340px, 430px) minmax(560px, 1fr)",
            gap: 40,
            width: "100%",
            maxWidth: 1540,
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
            <SectionPill text="个人中心入口" />
            <EntryTitle />
            <SummaryCard />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              {entryCards.map((card, index) => (
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

          <ScreenshotStage frame={frame} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
