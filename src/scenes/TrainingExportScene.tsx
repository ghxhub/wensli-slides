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

type ExportStep = {
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  accent: string;
};

const exportSteps: ExportStep[] = [
  {
    title: "导出 Excel / PPT",
    subtitle: "点击左上「选择导出」进入多选，勾选商品后直接生成 Excel 和 PPT。",
    badge: "导出入口",
    image: "training/导出excel和ppt.png",
    accent: "#1f3933",
  },
  {
    title: "PPT 导出结果",
    subtitle: "PPT 导出结果页。",
    badge: "结果页",
    image: "training/PPT导出显示.png",
    accent: "#8b6a3b",
  },
  {
    title: "生成分享卡",
    subtitle: "点击右上「分享」，勾选商品后选择「生成分享卡」。",
    badge: "分享入口",
    image: "training/导出分享卡.png",
    accent: "#5d4a2f",
  },
  {
    title: "分享卡导出完成",
    subtitle: "分享卡导出完成页。",
    badge: "最终结果",
    image: "training/分享卡导出显示.png",
    accent: "#1f3933",
  },
];

const EXPORT_PHASE_DURATION = 78;

const ExportBackdrop: React.FC = () => {
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
        gap: 12,
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
          textWrap: "balance",
          textShadow: "0 10px 30px rgba(36, 44, 41, 0.12)",
        }}
      >
        导出与分享
      </div>
    </div>
  );
};

const StepRow: React.FC<{
  step: ExportStep;
  index: number;
  frame: number;
  activeStep: number;
}> = ({ step, index, frame, activeStep }) => {
  const localFrame = Math.max(frame - index * 10, 0);
  const reveal = spring({
    fps: 30,
    frame: localFrame,
    config: {
      damping: 24,
      stiffness: 64,
      mass: 1.05,
    },
  });

  const isActive = activeStep === index;
  const opacity = interpolate(
    reveal,
    [0, 0.3, 1],
    [0, isActive ? 0.75 : 0.45, isActive ? 1 : 0.82],
    clampOptions,
  );
  const translateY = interpolate(reveal, [0, 1], [14, 0], clampOptions);
  const scale = interpolate(reveal, [0, 1], [0.98, isActive ? 1 : 0.992], clampOptions);
  const blur = interpolate(reveal, [0, 1], [10, 0], clampOptions);
  const accentWidth = interpolate(
    reveal,
    [0, 1],
    [0, isActive ? 16 : 12],
    clampOptions,
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "72px 1fr",
        gap: 18,
        padding: 18,
        borderRadius: 28,
        background: isActive
          ? "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(248,242,233,0.56) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(248,242,233,0.38) 100%)",
        border: `1px solid ${isActive ? "rgba(35, 73, 64, 0.22)" : "rgba(35, 73, 64, 0.12)"}`,
        boxShadow: isActive
          ? "0 28px 54px rgba(32, 53, 47, 0.11)"
          : "0 16px 32px rgba(32, 53, 47, 0.06)",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
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
          background: `linear-gradient(135deg, ${step.accent}14 0%, ${step.accent}24 100%)`,
          border: `1px solid ${step.accent}22`,
          color: step.accent,
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
              background: `linear-gradient(90deg, ${step.accent} 0%, rgba(255,255,255,0) 100%)`,
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
            {step.title}
          </div>
        </div>
        <div
          style={{
            fontFamily:
              '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 18,
            lineHeight: "26px",
            color: "#5d4a2f",
            textWrap: "balance",
          }}
        >
          {step.subtitle}
        </div>
      </div>
    </div>
  );
};

const ScreenshotPanel: React.FC<{
  step: ExportStep;
}> = ({ step }) => {
  const stepIndex = Math.max(exportSteps.indexOf(step), 0);

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
          width: "min(900px, 100%)",
          padding: 18,
          borderRadius: 40,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(248,242,233,0.38) 100%)",
          border: "1px solid rgba(35, 73, 64, 0.14)",
          boxShadow: "0 30px 60px rgba(32, 53, 47, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            padding: "0 4px 14px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                fontFamily:
                  '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
                fontSize: 18,
                letterSpacing: 3,
                color: "#35554c",
                fontWeight: 600,
              }}
            >
              步骤 0{stepIndex + 1} / 04
            </div>
            <div
              style={{
                fontFamily:
                  '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif',
                fontSize: 34,
                lineHeight: "42px",
                color: "#1f3933",
                fontWeight: 700,
              }}
            >
              {step.title}
            </div>
          </div>

          <div
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              background: `${step.accent}14`,
              border: `1px solid ${step.accent}22`,
              color: step.accent,
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {step.badge}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            borderRadius: 32,
            overflow: "hidden",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(245,240,232,0.86) 100%)",
            border: "1px solid rgba(255,255,255,0.7)",
            minHeight: 620,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0) 38%), radial-gradient(circle at 82% 82%, rgba(139,106,59,0.08) 0%, rgba(139,106,59,0) 34%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <Img
              src={staticFile(step.image)}
              style={{
                width: "100%",
                height: 620,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily:
                '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
              fontSize: 22,
              lineHeight: "32px",
              color: "#5d4a2f",
              fontWeight: 600,
              textWrap: "balance",
              maxWidth: 580,
            }}
          >
            {step.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TrainingExportScene: React.FC = () => {
  const frame = useCurrentFrame();

  const heroReveal = spring({
    fps: 30,
    frame,
    config: {
      damping: 22,
      stiffness: 58,
      mass: 1.1,
    },
  });

  const heroOpacity = interpolate(heroReveal, [0, 0.25, 1], [0, 0.38, 1], clampOptions);
  const heroTranslateY = interpolate(heroReveal, [0, 1], [16, 0], clampOptions);
  const heroBlur = interpolate(heroReveal, [0, 1], [8, 0], clampOptions);
  const sceneOpacity = useSceneTransitionOut(12);

  const activeStep = Math.min(
    Math.floor(frame / EXPORT_PHASE_DURATION),
    exportSteps.length - 1,
  );
  const step = exportSteps[activeStep];

  return (
    <AbsoluteFill>
      <ExportBackdrop />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "68px 88px 60px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(420px, 520px) 1fr",
            gap: 42,
            width: "100%",
            maxWidth: 1780,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 500,
              opacity: heroOpacity,
              transform: `translateY(${heroTranslateY}px)`,
              filter: `blur(${heroBlur}px)`,
            }}
          >
            <TitleBlock />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {exportSteps.map((item, index) => (
                <StepRow
                  key={item.title}
                  step={item}
                  index={index}
                  frame={frame}
                  activeStep={activeStep}
                />
              ))}
            </div>
          </div>

          <ScreenshotPanel step={step} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
