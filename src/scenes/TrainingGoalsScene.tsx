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

const goalItems = [
  "用 AI 对话为客户找到合适的丝绸产品",
  "用商品检索筛选精准匹配预算与偏好",
  "一键导出 Excel 商品清单和 PPT 推荐方案",
  "使用分享卡片把方案发给客户",
  "管理收藏、购物车、客户足迹与历史导出文件",
];

const TitleBlock: React.FC<{
  titleTop: string;
  titleBottom: string;
  subtitle: string;
}> = ({ titleTop, titleBottom, subtitle }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          fontFamily:
            '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
          maxWidth: 420,
        }}
      >
        <div
          style={{
            fontSize: 36,
            lineHeight: "46px",
            fontWeight: 600,
            letterSpacing: 2,
            color: "#35554c",
          }}
        >
          {titleTop}
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: "86px",
            fontWeight: 700,
            color: "#1f3933",
            textAlign: "left",
            textWrap: "balance",
          }}
        >
          {titleBottom}
        </div>
      </div>
      <div
        style={{
          fontFamily:
            '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
          fontSize: 26,
          lineHeight: "38px",
          color: "#5d4a2f",
          letterSpacing: 1,
          fontWeight: 500,
          textAlign: "left",
          textWrap: "balance",
          maxWidth: 420,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const RevealRow: React.FC<{
  index: number;
  text: string;
  frame: number;
}> = ({ index, text, frame }) => {
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
  const numberScale = interpolate(reveal, [0, 1], [0.85, 1], clampOptions);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 22,
        padding: "20px 22px",
        borderRadius: 22,
        border: "1px solid rgba(45, 76, 68, 0.14)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.66) 0%, rgba(248, 242, 232, 0.56) 100%)",
        boxShadow: "0 18px 36px rgba(32, 53, 47, 0.06)",
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
      }}
    >
      <div
        style={{
          width: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(30, 63, 55, 0.96) 0%, rgba(126, 99, 55, 0.94) 100%)",
            color: "#fff7ea",
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1,
            transform: `scale(${numberScale})`,
            boxShadow: "0 10px 18px rgba(30, 63, 55, 0.18)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div
        style={{
          width: accentWidth,
          borderRadius: 999,
          background:
            "linear-gradient(180deg, rgba(137, 104, 58, 0.82) 0%, rgba(30, 63, 55, 0.72) 100%)",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          minHeight: 86,
        }}
      >
        <div
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 30,
            lineHeight: "42px",
            color: "#24473f",
            fontWeight: 600,
            textWrap: "balance",
          }}
        >
          {text}
        </div>
      </div>
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
          "linear-gradient(135deg, #f4efe6 0%, #eee2d1 38%, #dfe9e2 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0) 40%), radial-gradient(circle at 82% 78%, rgba(193, 157, 98, 0.18) 0%, rgba(193, 157, 98, 0) 42%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-14%",
          right: "-12%",
          width: width * 0.42,
          height: height * 0.54,
          borderRadius: "48% 52% 38% 62% / 56% 40% 60% 44%",
          background:
            "linear-gradient(180deg, rgba(31, 57, 51, 0.16) 0%, rgba(31, 57, 51, 0.04) 68%, rgba(31, 57, 51, 0) 100%)",
          filter: "blur(14px)",
          transform: "rotate(-14deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-14%",
          bottom: "-18%",
          width: width * 0.54,
          height: height * 0.42,
          borderRadius: "54% 46% 58% 42% / 48% 58% 42% 52%",
          background:
            "linear-gradient(180deg, rgba(171, 126, 72, 0.2) 0%, rgba(171, 126, 72, 0.05) 72%, rgba(171, 126, 72, 0) 100%)",
          filter: "blur(20px)",
          transform: "rotate(12deg)",
        }}
      />
    </AbsoluteFill>
  );
};

export const TrainingGoalsScene: React.FC = () => {
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
  const heroTranslateY = interpolate(heroReveal, [0, 1], [14, 0], clampOptions);
  const heroBlur = interpolate(heroReveal, [0, 1], [8, 0], clampOptions);
  const sceneOpacity = useSceneTransitionOut(10);

  return (
    <AbsoluteFill>
      <TrainingBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "78px 92px 84px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(360px, 480px) 1fr",
            gap: 36,
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 460,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <div
              style={{
                width: 92,
                height: 2,
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(137, 104, 58, 0) 0%, rgba(137, 104, 58, 0.78) 50%, rgba(137, 104, 58, 0) 100%)",
                opacity: 0.72,
              }}
            />
            <TitleBlock
              titleTop="学完本课程"
              titleBottom="你将掌握"
              subtitle="从对话、检索到导出和跟进，一次打通完整选品流程"
            />
          </div>

          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 26,
                top: 48,
                bottom: 48,
                width: 1,
                background:
                  "linear-gradient(180deg, rgba(35, 73, 64, 0) 0%, rgba(35, 73, 64, 0.26) 14%, rgba(137, 104, 58, 0.34) 50%, rgba(35, 73, 64, 0.26) 86%, rgba(35, 73, 64, 0) 100%)",
                opacity: 0.8,
              }}
            />

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                paddingLeft: 46,
              }}
            >
              {goalItems.map((text, index) => (
                <RevealRow key={text} index={index} text={text} frame={frame} />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
