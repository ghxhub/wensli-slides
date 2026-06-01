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

const EntryBackdrop: React.FC = () => {
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

const InfoCard: React.FC<{
  index: number;
  title: string;
  description: string;
  frame: number;
}> = ({ index, title, description, frame }) => {
  const localFrame = Math.max(frame - 20 - index * 12, 0);
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

const LabelPill: React.FC<{
  label: string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  align?: "left" | "center" | "right";
  accent: string;
  delay: number;
  frame: number;
}> = ({ label, top, left, right, bottom, align = "left", accent, delay, frame }) => {
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

  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 0.4, 1], clampOptions);
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
        padding: "10px 16px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(35, 73, 64, 0.14)",
        boxShadow: "0 14px 30px rgba(32, 53, 47, 0.08)",
        backdropFilter: "blur(10px)",
        color: "#1f3933",
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
        fontSize: 18,
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

export const TrainingEntryScene: React.FC = () => {
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

  const phoneReveal = spring({
    fps: 30,
    frame: Math.max(frame - 12, 0),
    config: {
      damping: 24,
      stiffness: 62,
      mass: 1.05,
    },
  });
  const phoneOpacity = interpolate(phoneReveal, [0, 0.3, 1], [0, 0.4, 1], clampOptions);
  const phoneScale = interpolate(phoneReveal, [0, 1], [0.975, 1], clampOptions);
  const phoneY = interpolate(phoneReveal, [0, 1], [18, 0], clampOptions);

  return (
    <AbsoluteFill>
      <EntryBackdrop />

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
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
                进入
              </div>
              <div
                style={{
                  fontFamily:
                    '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
                  fontSize: 76,
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
                  letterSpacing: 2,
                  fontWeight: 600,
                }}
              >
                默认就在「智能导购」页
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
                顶部 Tab 功能按钮、中间聊天区、底部筛选与输入框一眼可见
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <InfoCard
                index={0}
                title="导出与分享"
                description="状态栏 点击「选择导出」进入多选导出；点击「分享」生成分享卡片。"
                frame={frame}
              />
              <InfoCard
                index={1}
                title="AI对话"
                description="聊天区承接 AI 对话与推荐内容，是最常用的沟通主区域。"
                frame={frame}
              />
              <InfoCard
                index={2}
                title="需求输入"
                description="底部保留商品筛选和输入框，方便快速调整条件并继续发起需求。"
                frame={frame}
              />
            </div>
          </div>

          <div
            style={{
              position: "relative",
              height: 880,
              opacity: phoneOpacity,
              transform: `translateY(${phoneY}px) scale(${phoneScale})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 42,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(248,242,233,0.38) 100%)",
                border: "1px solid rgba(35, 73, 64, 0.14)",
                boxShadow: "0 30px 60px rgba(32, 53, 47, 0.12)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 20,
                borderRadius: 34,
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(245,240,232,0.82) 100%)",
              }}
            >
              <Img
                src={staticFile("training/选择导出.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              <LabelPill
                label="选择导出"
                top={22}
                left={22}
                accent="#8b6a3b"
                delay={0}
                frame={frame}
              />
              <LabelPill
                label="智能导购"
                top={18}
                left="50%"
                align="center"
                accent="#1f3933"
                delay={8}
                frame={frame}
              />
              <LabelPill
                label="分享"
                top={22}
                right={22}
                align="right"
                accent="#5d4a2f"
                delay={16}
                frame={frame}
              />
              <LabelPill
                label="聊天区"
                top="44%"
                left={22}
                accent="#1f3933"
                delay={24}
                frame={frame}
              />
              <LabelPill
                label="商品筛选"
                bottom={104}
                left={22}
                accent="#8b6a3b"
                delay={32}
                frame={frame}
              />
              <LabelPill
                label="输入框"
                bottom={82}
                right={18}
                align="right"
                accent="#5d4a2f"
                delay={40}
                frame={frame}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
