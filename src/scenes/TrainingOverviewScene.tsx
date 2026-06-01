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

type EntryData = {
  title: string;
  subtitle: string;
  chips: string[];
  image: string;
  accent: string;
};

const entries: EntryData[] = [
  {
    title: "智能导购",
    subtitle: "AI 对话推荐、商品检索筛选、导出 Excel / PPT / 分享卡",
    chips: ["AI 对话", "商品筛选", "导出方案"],
    image: "training/智能导购界面.png",
    accent: "#1f3933",
  },
  {
    title: "商品浏览",
    subtitle: "分类 / 搜索、排序 / 筛选、收藏 / 加购",
    chips: ["分类搜索", "排序筛选", "收藏加购"],
    image: "training/商品浏览界面.png",
    accent: "#8b6a3b",
  },
  {
    title: "个人中心",
    subtitle: "收藏 / 购物车、足迹 / 我的文件、设置 / 退出",
    chips: ["收藏购物车", "足迹文件", "设置退出"],
    image: "training/个人中心界面.png",
    accent: "#5d4a2f",
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

const TitleBlock: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
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
          textAlign: "center",
          textWrap: "balance",
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
        }}
      >
        小程序整体功能介绍
      </div>
      <div
        style={{
          fontFamily:
            '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
          fontSize: 28,
          lineHeight: "40px",
          color: "#5d4a2f",
          letterSpacing: 2,
          fontWeight: 500,
          textAlign: "center",
          textWrap: "balance",
          maxWidth: 640,
        }}
      >
        底部三个 Tab，对应三大入口
      </div>
    </div>
  );
};

const OverviewCard: React.FC<{
  entry: EntryData;
  index: number;
  frame: number;
  activeIndex: number;
}> = ({ entry, index, frame, activeIndex }) => {
  const localFrame = Math.max(frame - 24 - index * 10, 0);
  const reveal = spring({
    fps: 30,
    frame: localFrame,
    config: {
      damping: 24,
      stiffness: 64,
      mass: 1.05,
    },
  });

  const focusFrame = Math.max(frame - activeIndex * 18, 0);
  const focus = spring({
    fps: 30,
    frame: focusFrame,
    config: {
      damping: 22,
      stiffness: 74,
      mass: 1,
    },
  });

  const baseOpacity = interpolate(reveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [18, 0], clampOptions);
  const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
  const focusScale = interpolate(focus, [0, 1], [0.96, 1], clampOptions);
  const focusLift = interpolate(focus, [0, 1], [8, 0], clampOptions);
  const focusOpacity = interpolate(focus, [0, 0.3, 1], [0.88, 0.96, 1], clampOptions);
  const isActive = activeIndex === index;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        opacity: baseOpacity * focusOpacity,
        transform: `translateY(${translateY + focusLift}px) scale(${focusScale})`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 8px",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: entry.accent,
            boxShadow: `0 0 0 6px ${entry.accent}22`,
          }}
        />
        <span
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 28,
            fontWeight: 700,
            color: "#1f3933",
            letterSpacing: 1,
          }}
        >
          {entry.title}
        </span>
      </div>

      <div
        style={{
          borderRadius: 30,
          padding: 14,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(248,242,233,0.34) 100%)",
          border: `1px solid ${isActive ? "rgba(35, 73, 64, 0.22)" : "rgba(35, 73, 64, 0.12)"}`,
          boxShadow: isActive
            ? "0 28px 56px rgba(32, 53, 47, 0.12)"
            : "0 18px 36px rgba(32, 53, 47, 0.06)",
        }}
      >
        <div
          style={{
            borderRadius: 22,
            overflow: "hidden",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(245,240,232,0.78) 100%)",
            border: "1px solid rgba(255,255,255,0.65)",
          }}
        >
          <div
            style={{
              padding: 10,
            }}
          >
            <Img
              src={staticFile(entry.image)}
              style={{
                width: "100%",
                height: 590,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 22,
              lineHeight: "32px",
              color: "#5d4a2f",
              textAlign: "left",
              textWrap: "balance",
            }}
          >
            {entry.subtitle}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {entry.chips.map((chip) => (
              <div
                key={chip}
                style={{
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(247,241,231,0.76) 100%)",
                  border: "1px solid rgba(45, 76, 68, 0.12)",
                  fontFamily:
                    '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                  fontSize: 18,
                  color: "#24473f",
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabRail: React.FC<{ activeIndex: number }> = ({ activeIndex }) => {
  const tabs = ["智能导购", "商品", "个人中心"];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        borderRadius: 28,
        width: "min(920px, 100%)",
        background: "rgba(255, 255, 255, 0.34)",
        border: "1px solid rgba(35, 73, 64, 0.14)",
        boxShadow: "0 18px 40px rgba(33, 56, 49, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      {tabs.map((tab, index) => {
        const active = index === activeIndex;
        return (
          <div
            key={tab}
            style={{
              flex: 1,
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
              background: active
                ? "linear-gradient(135deg, rgba(31, 57, 51, 0.96) 0%, rgba(126, 99, 55, 0.92) 100%)"
                : "rgba(255, 255, 255, 0.52)",
              border: active
                ? "1px solid rgba(255,255,255,0.16)"
                : "1px solid rgba(45, 76, 68, 0.12)",
              color: active ? "#fff7ea" : "#35554c",
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 2,
              boxShadow: active
                ? "0 16px 28px rgba(30, 63, 55, 0.18)"
                : "none",
            }}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};

const TrainingBackdrop: React.FC = () => {
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
          opacity: 0.28,
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

export const TrainingOverviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const heroReveal = spring({
    fps: 30,
    frame,
    config: {
      damping: 22,
      stiffness: 58,
      mass: 1.1,
    },
  });

  const heroOpacity = interpolate(heroReveal, [0, 0.25, 1], [0, 0.4, 1], clampOptions);
  const heroTranslateY = interpolate(heroReveal, [0, 1], [16, 0], clampOptions);
  const heroBlur = interpolate(heroReveal, [0, 1], [8, 0], clampOptions);
  const sceneOpacity = useSceneTransitionOut(10);

  const activeIndex = Math.min(Math.floor(frame / 48), 2);

  return (
    <AbsoluteFill>
      <TrainingBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "56px 88px 60px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: "100%",
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            filter: `blur(${heroBlur}px)`,
          }}
        >
          <SectionPill text="功能总览" />
          <TitleBlock />
        </div>

        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 24,
            alignItems: "start",
            maxWidth: 1240,
            marginTop: -8,
          }}
        >
          {entries.map((entry, index) => (
            <OverviewCard
              key={entry.title}
              entry={entry}
              index={index}
              frame={frame}
              activeIndex={activeIndex}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            width: "100%",
          }}
        >
          <TabRail activeIndex={activeIndex} />
          <div
            style={{
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 24,
              lineHeight: "34px",
              color: "#5d4a2f",
              textAlign: "center",
              letterSpacing: 1,
              opacity: interpolate(frame, [84, 108, durationInFrames], [0, 1, 1], clampOptions),
            }}
          >
            三大入口从对话到浏览再到管理，形成完整闭环
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
