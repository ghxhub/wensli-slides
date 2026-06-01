import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type TrainingTargetSceneProps = {
  startFrame?: number;
};

type ObjectiveItem = {
  title: string;
  delay: number;
};

const clampOptions = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const objectives: ObjectiveItem[] = [
  { title: "用 AI 对话为客户找到合适的丝绸产品", delay: 0 },
  { title: "用商品检索筛选精准匹配预算与偏好", delay: 10 },
  { title: "一键导出 Excel 商品清单和 PPT 推荐方案", delay: 20 },
  { title: "使用分享卡片把方案发给客户", delay: 30 },
  { title: "管理收藏、购物车、客户足迹与历史导出文件", delay: 40 },
];

const ObjectiveCard: React.FC<{
  index: number;
  title: string;
  frame: number;
  delay: number;
  fps: number;
}> = ({ index, title, frame, delay, fps }) => {
  const localFrame = Math.max(frame - delay, 0);
  const reveal = spring({
    fps,
    frame: localFrame,
    config: {
      damping: 22,
      stiffness: 150,
      mass: 0.85,
    },
  });

  const opacity = interpolate(reveal, [0, 0.2, 1], [0, 0.55, 1], clampOptions);
  const translateY = interpolate(reveal, [0, 1], [26, 0], clampOptions);
  const scale = interpolate(reveal, [0, 1], [0.98, 1], clampOptions);
  const accentWidth = interpolate(reveal, [0, 1], [0, 12], clampOptions);
  const numberScale = interpolate(reveal, [0, 1], [0.8, 1], clampOptions);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 22,
        padding: "18px 22px",
        borderRadius: 22,
        border: "1px solid rgba(45, 76, 68, 0.14)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.66) 0%, rgba(248, 242, 232, 0.56) 100%)",
        boxShadow: "0 18px 36px rgba(32, 53, 47, 0.06)",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
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
            fontSize: 34,
            lineHeight: "48px",
            letterSpacing: 0,
            color: "#24473f",
            fontWeight: 600,
            textWrap: "balance",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export const TrainingTargetScene: React.FC<TrainingTargetSceneProps> = ({
  startFrame = 0,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const frame = Math.max(currentFrame - startFrame, 0);

  const titleReveal = spring({
    fps,
    frame,
    config: {
      damping: 26,
      stiffness: 110,
      mass: 0.9,
    },
  });

  const titleOpacity = interpolate(
    titleReveal,
    [0, 0.25, 1],
    [0, 0.5, 1],
    clampOptions,
  );
  const titleTranslateY = interpolate(titleReveal, [0, 1], [30, 0], clampOptions);
  const titleBlur = interpolate(titleReveal, [0, 1], [12, 0], clampOptions);

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

      <AbsoluteFill
        style={{
          padding: "78px 92px 84px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(340px, 470px) 1fr",
            gap: 42,
            height: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              maxWidth: 440,
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px)`,
              filter: `blur(${titleBlur}px)`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(35, 73, 64, 0.16)",
                background: "rgba(255, 255, 255, 0.34)",
                boxShadow: "0 16px 32px rgba(33, 56, 49, 0.06)",
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
                培训目标
              </span>
            </div>

            <div
              style={{
                fontFamily:
                  '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
                fontSize: 76,
                lineHeight: "92px",
                color: "#1f3933",
                fontWeight: 700,
                textShadow: "0 10px 28px rgba(36, 44, 41, 0.1)",
              }}
            >
              学完本课程，
              <br />
              你将掌握:
            </div>

            <div
              style={{
                fontFamily:
                  '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                fontSize: 28,
                lineHeight: "42px",
                color: "#5d4a2f",
                letterSpacing: 1,
                maxWidth: 380,
              }}
            >
              从客户对话、商品检索到方案导出，完整掌握日常选品工作流。
            </div>
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
                gap: 18,
                paddingLeft: 52,
              }}
            >
              {objectives.map((item, index) => (
                <ObjectiveCard
                  key={item.title}
                  index={index}
                  title={item.title}
                  frame={frame}
                  delay={item.delay}
                  fps={fps}
                />
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
