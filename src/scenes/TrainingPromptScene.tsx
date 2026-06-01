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

type PromptExample = {
  text: string;
  note?: string;
};

const recommendedPrompts: PromptExample[] = [
  {
    text: "我想给女老板选一份礼物，预算 500-1000，偏真丝质感",
  },
  {
    text: "商务接待用，3 位外宾，每人预算 800",
  },
  {
    text: "客户喜欢杭州元素，要真丝长方巾和礼盒",
  },
  {
    text: "春节送女员工的小礼物，300 元以内",
  },
  {
    text: "给 35-45 岁女性客户准备高端真丝礼品，要求体面又有质感",
  },
];

const weakPrompts: PromptExample[] = [
  {
    text: "推荐一下",
    note: "太空泛，AI 很难收敛范围",
  },
  {
    text: "便宜一点的",
    note: "没有预算边界",
  },
  {
    text: "好看的丝巾",
    note: "缺少用途和偏好",
  },
  {
    text: "随便来几个",
    note: "AI 不知道该怎么筛选",
  },
];

const PromptBackdrop: React.FC = () => {
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

const PromptHeader: React.FC = () => {
  return (
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
        在底部输入框
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
        直接描述选购需求
      </div>
    </div>
  );
};

const PromptNote: React.FC<{ text: string }> = ({ text }) => {
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
        {text}
      </div>
    </div>
  );
};

const PromptChipRail: React.FC<{ frame: number }> = ({ frame }) => {
  const chips = ["人群", "场景", "预算"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, auto)",
        gap: 18,
        alignItems: "center",
      }}
    >
      {chips.map((chip, index) => {
        const chipFrame = Math.max(frame - 24 - index * 12, 0);
        const reveal = spring({
          fps: 30,
          frame: chipFrame,
          config: {
            damping: 24,
            stiffness: 64,
            mass: 1.05,
          },
        });

        const opacity = interpolate(
          reveal,
          [0, 0.3, 1],
          [0, 0.42, 1],
          clampOptions,
        );
        const translateY = interpolate(reveal, [0, 1], [12, 0], clampOptions);

        return (
          <div
            key={chip}
            style={{
              minWidth: 120,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 18px",
              borderRadius: 18,
              border: "1px solid rgba(51, 78, 71, 0.14)",
              background: "rgba(255, 255, 255, 0.46)",
              boxShadow: "0 12px 30px rgba(41, 55, 49, 0.06)",
              opacity,
              transform: `translateY(${translateY}px)`,
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 21,
              color: "#35554c",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {chip}
          </div>
        );
      })}
    </div>
  );
};

const PromptItem: React.FC<{
  index: number;
  frame: number;
  delay: number;
  variant: "good" | "bad";
  item: PromptExample;
}> = ({ index, frame, delay, variant, item }) => {
  const localFrame = Math.max(frame - delay, 0);
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
  const scale = interpolate(reveal, [0, 1], [0.98, 1], clampOptions);
  const accent = variant === "good" ? "#1f3933" : "#b05b46";
  const borderColor =
    variant === "good" ? "rgba(31, 57, 51, 0.14)" : "rgba(176, 91, 70, 0.16)";
  const background =
    variant === "good"
      ? "linear-gradient(180deg, rgba(238, 248, 243, 0.92) 0%, rgba(255,255,255,0.92) 100%)"
      : "linear-gradient(180deg, rgba(255,248,243,0.94) 0%, rgba(255,255,255,0.92) 100%)";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        gap: item.note ? 8 : 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "34px 1fr",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 20,
          background,
          border: `1px solid ${borderColor}`,
          boxShadow: "0 12px 24px rgba(32, 53, 47, 0.06)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${accent}14`,
            border: `1px solid ${accent}22`,
            color: accent,
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <div
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: variant === "good" ? 22 : 21,
            lineHeight: variant === "good" ? "30px" : "28px",
            color: "#1f3933",
            fontWeight: 600,
            textWrap: "balance",
          }}
        >
          “{item.text}”
        </div>
      </div>

      {item.note ? (
        <div
          style={{
            marginLeft: 46,
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 18,
            lineHeight: "24px",
            color: "#b05b46",
            fontWeight: 600,
          }}
        >
          {item.note}
        </div>
      ) : null}
    </div>
  );
};

const PromptCard: React.FC<{
  title: string;
  subtitle: string;
  accent: string;
  variant: "good" | "bad";
  frame: number;
  delay: number;
  items: PromptExample[];
}> = ({ title, subtitle, accent, variant, frame, delay, items }) => {
  const localFrame = Math.max(frame - delay, 0);
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
  const scale = interpolate(reveal, [0, 1], [0.98, 1], clampOptions);
  const borderColor =
    variant === "good" ? "rgba(35, 73, 64, 0.14)" : "rgba(176, 91, 70, 0.16)";
  const badgeText = variant === "good" ? "更精准" : "易跑偏";
  const badgeColor = variant === "good" ? accent : "#b05b46";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        padding: 20,
        borderRadius: 30,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(248,242,233,0.38) 100%)",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 18px 36px rgba(32, 53, 47, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 14,
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
              width: 12,
              height: 12,
              borderRadius: 999,
              background: accent,
              boxShadow: `0 0 0 7px ${accent}18`,
            }}
          />
          <div
            style={{
              fontFamily:
                '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
              fontSize: 30,
              lineHeight: "36px",
              fontWeight: 700,
              color: "#1f3933",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            background: `${badgeColor}14`,
            border: `1px solid ${badgeColor}22`,
            color: badgeColor,
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {badgeText}
        </div>
      </div>

      <div
        style={{
          fontFamily:
            '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
          fontSize: 18,
          lineHeight: "26px",
          color: "#5d4a2f",
          fontWeight: 600,
          marginBottom: 14,
          textWrap: "balance",
        }}
      >
        {subtitle}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, index) => (
          <PromptItem
            key={item.text}
            index={index}
            frame={frame}
            delay={delay + index * 12}
            variant={variant}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

const PromptBanner: React.FC<{ frame: number }> = ({ frame }) => {
  const bannerReveal = spring({
    fps: 30,
    frame: Math.max(frame - 48, 0),
    config: {
      damping: 24,
      stiffness: 60,
      mass: 1.05,
    },
  });

  const opacity = interpolate(bannerReveal, [0, 0.3, 1], [0, 0.42, 1], clampOptions);
  const translateY = interpolate(bannerReveal, [0, 1], [14, 0], clampOptions);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: 18,
        borderRadius: 28,
        background:
          "linear-gradient(90deg, rgba(31,57,51,0.92) 0%, rgba(139,106,59,0.92) 52%, rgba(93,74,47,0.92) 100%)",
        boxShadow: "0 18px 40px rgba(32, 53, 47, 0.14)",
        color: "#fff7ea",
        fontFamily:
          '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 24,
            lineHeight: "32px",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          人群 + 场景 + 预算
        </div>
        <div
          style={{
            fontSize: 18,
            lineHeight: "26px",
            opacity: 0.92,
          }}
        >
          说得越完整，AI 推荐越精准
        </div>
      </div>
    </div>
  );
};

export const TrainingPromptScene: React.FC = () => {
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

  return (
    <AbsoluteFill>
      <PromptBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "70px 88px 66px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(340px, 460px) 1fr",
            gap: 42,
            width: "100%",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
              maxWidth: 440,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <PromptHeader />
            <PromptNote text="把需求说完整，AI 才更容易给出精准推荐" />
            <PromptChipRail frame={frame} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr auto",
              gap: 18,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
              }}
            >
              <PromptCard
                title="推荐这样问"
                subtitle="把人群、场景、预算说清楚，AI 更容易命中合适的产品。"
                accent="#1f3933"
                variant="good"
                frame={frame}
                delay={0}
                items={recommendedPrompts}
              />

              <PromptCard
                title="不推荐这样问"
                subtitle="太空泛的问法会让 AI 只能猜，推荐结果也会变散。"
                accent="#b05b46"
                variant="bad"
                frame={frame}
                delay={10}
                items={weakPrompts}
              />
            </div>

            <PromptBanner frame={frame} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
