import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const bgTexture = staticFile("poster/siyu-lixuan-silk-bg.png");

const palette = {
  cream: "#fbf5eb",
  ink: "#1f3156",
  gold: "#cf9a51",
  warm: "#8d6b42",
  softInk: "#556278",
  line: "rgba(207, 154, 81, 0.34)",
  lineStrong: "rgba(207, 154, 81, 0.48)",
  panel: "rgba(255, 250, 243, 0.84)",
  panelSoft: "rgba(255, 252, 247, 0.76)",
};

const fontSans =
  '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif';
const fontSerif =
  '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "STSong", serif';

type FeatureItem = {
  icon: string;
  title: string;
  description: string;
};

type ShotItem = {
  tab: string;
  title: string;
  description: string;
  image: string;
};

type JourneyStep = {
  index: string;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: "AI",
    title: "AI 对话式导购",
    description: "一句需求快速起步，围绕预算、对象与场景给出更贴合的推荐。",
  },
  {
    icon: "PPT",
    title: "导出图文版 PPT",
    description: "推荐结果沉淀为可汇报、可转发的方案内容，沟通更顺手。",
  },
  {
    icon: "分享",
    title: "分享与发送闭环",
    description: "支持分享预览、发送好友与文件留存，后续跟进更连贯。",
  },
];

const shotCards: ShotItem[] = [
  {
    tab: "智能导购",
    title: "一句需求快速起步",
    description: "围绕预算、对象与送礼场景，迅速收拢推荐方向。",
    image: staticFile("training/智能导购界面.png"),
  },
  {
    tab: "导出方案",
    title: "图文内容一键整理",
    description: "支持 Excel 与 PPT 导出，汇报、提案与留档更高效。",
    image: staticFile("training/导出excel和ppt.png"),
  },
  {
    tab: "方案预览",
    title: "推荐成案展示更清楚",
    description: "推荐内容沉淀成完整方案页，展示结构更直观。",
    image: staticFile("training/PPT导出显示.png"),
  },
  {
    tab: "发送好友",
    title: "分享交付一步到位",
    description: "支持发送好友与文件留存，让后续跟进更顺畅。",
    image: staticFile("training/文件助手导出.png"),
  },
];

const journeySteps: JourneyStep[] = [
  {
    index: "01",
    title: "对话收集需求",
    description: "快速确认对象、预算与礼赠语境。",
  },
  {
    index: "02",
    title: "推荐商品组合",
    description: "把合适的丝巾与礼盒方案整理清楚。",
  },
  {
    index: "03",
    title: "导出完整成案",
    description: "同步沉淀图文内容，便于提案和内部沟通。",
  },
  {
    index: "04",
    title: "发送好友留存",
    description: "直接转发与留档，跟进链路更顺。",
  },
];

const topTabs = ["对话推荐", "方案导出", "发送好友"];
const scenarioTags = ["丝巾导购", "礼盒推荐", "商务赠礼"];

const Badge: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 30px",
        height: 62,
        borderRadius: 999,
        border: `1.5px solid ${palette.line}`,
        background: "rgba(255, 251, 245, 0.72)",
        color: palette.gold,
        fontFamily: fontSerif,
        fontSize: 34,
        fontWeight: 700,
      }}
    >
      {text}
    </div>
  );
};

const MiniTab: React.FC<{
  text: string;
  active?: boolean;
}> = ({ text, active = false }) => {
  return (
    <div
      style={{
        height: 42,
        padding: "0 18px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${
          active ? "rgba(207, 154, 81, 0.42)" : "rgba(31, 49, 86, 0.08)"
        }`,
        background: active
          ? "rgba(255, 249, 239, 0.95)"
          : "rgba(255, 255, 255, 0.72)",
        color: active ? palette.gold : palette.warm,
        fontFamily: fontSans,
        fontSize: 18,
        fontWeight: 600,
        boxShadow: active ? "0 8px 20px rgba(207, 154, 81, 0.08)" : "none",
        width: "fit-content",
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
};

const FeatureIcon: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      style={{
        width: 76,
        height: 76,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1.5px solid ${palette.line}`,
        color: palette.gold,
        fontFamily: fontSans,
        fontSize: label.length > 2 ? 20 : 24,
        fontWeight: 700,
        background: "rgba(255,255,255,0.62)",
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
};

const Divider: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: 560,
      }}
    >
      <div style={{ flex: 1, height: 1.5, background: palette.line }} />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          border: `1.5px solid ${palette.line}`,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ flex: 1, height: 1.5, background: palette.line }} />
    </div>
  );
};

const SilkArc: React.FC<{
  size: number;
  left: number;
  bottom: number;
  rotate?: number;
}> = ({ size, left, bottom, rotate = 0 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid rgba(207, 154, 81, 0.18)`,
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
};

const FlatShotCard: React.FC<ShotItem> = ({ tab, title, description, image }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100%",
        padding: 18,
        borderRadius: 34,
        background:
          "linear-gradient(180deg, rgba(255, 253, 249, 0.94) 0%, rgba(255, 248, 239, 0.88) 100%)",
        border: `1px solid ${palette.line}`,
        boxShadow: "0 20px 38px rgba(92, 67, 31, 0.10)",
      }}
    >
      <div
        style={{
          borderRadius: 28,
          padding: 12,
          background: "rgba(255, 255, 255, 0.72)",
          border: "1px solid rgba(255,255,255,0.72)",
          boxShadow: "inset 0 0 0 1px rgba(207, 154, 81, 0.08)",
        }}
      >
        <div
          style={{
            height: 430,
            borderRadius: 22,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid rgba(31, 49, 86, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={image}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "16px 8px 0",
          minHeight: 146,
        }}
      >
        <MiniTab text={tab} active={true} />
        <div
          style={{
            fontFamily: fontSans,
            fontSize: 24,
            lineHeight: "34px",
            fontWeight: 700,
            color: palette.ink,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: fontSans,
            fontSize: 18,
            lineHeight: "28px",
            color: palette.warm,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

export const SiyuLixuanPosterScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: palette.cream,
        overflow: "hidden",
      }}
    >
      <Img
        src={bgTexture}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(251,245,235,0.72) 0%, rgba(251,245,235,0.62) 24%, rgba(251,245,235,0.82) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 22% 24%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0) 26%), radial-gradient(circle at 82% 76%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 28%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "54px",
          borderRadius: 42,
          border: "1px solid rgba(255,255,255,0.42)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "78px 72px 70px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                color: palette.gold,
                fontFamily: fontSerif,
                fontSize: 72,
                lineHeight: "78px",
              }}
            >
              WENSLI
            </div>
            <div
              style={{
                color: palette.gold,
                fontFamily: fontSerif,
                fontSize: 28,
                lineHeight: "34px",
                letterSpacing: 6,
              }}
            >
              一 万 事 利 丝 绸 一
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              padding: "10px 22px",
              borderRadius: 999,
              border: `1px solid ${palette.line}`,
              color: palette.warm,
              fontFamily: fontSans,
              fontSize: 22,
              fontWeight: 600,
              background: "rgba(255, 252, 246, 0.56)",
            }}
          >
            AI 礼赠导购小程序
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.93fr 1.07fr",
            gap: 34,
            marginTop: 82,
            flex: 1,
            minHeight: 0,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 28,
                paddingTop: 10,
              }}
            >
              <Badge text="丝语礼选" />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    color: palette.ink,
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontSerif,
                      fontSize: 150,
                      lineHeight: "122px",
                      color: palette.gold,
                      fontWeight: 700,
                    }}
                  >
                    AI
                  </span>
                  <span
                    style={{
                      fontFamily: fontSerif,
                      fontSize: 68,
                      lineHeight: "78px",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    客户方案
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: fontSerif,
                    fontSize: 64,
                    lineHeight: "82px",
                    color: palette.ink,
                    fontWeight: 700,
                  }}
                >
                  自动化小程序
                </div>
              </div>

              <Divider />

              <div
                style={{
                  width: 540,
                  fontFamily: fontSans,
                  fontSize: 28,
                  lineHeight: "46px",
                  color: "#4f5566",
                }}
              >
                面向丝巾、礼盒与商务赠礼场景，把 AI 推荐、商品筛选、图文版 PPT
                导出与好友分享，串成更顺滑的一条成交沟通链路。
              </div>

              <div
                style={{
                  width: 564,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "76px 1fr",
                      gap: 18,
                      alignItems: "start",
                    }}
                  >
                    <FeatureIcon label={feature.icon} />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: fontSans,
                          fontSize: 30,
                          lineHeight: "38px",
                          fontWeight: 700,
                          color: palette.ink,
                        }}
                      >
                        {feature.title}
                      </div>
                      <div
                        style={{
                          fontFamily: fontSans,
                          fontSize: 22,
                          lineHeight: "34px",
                          color: palette.warm,
                        }}
                      >
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                position: "relative",
                marginTop: "auto",
                paddingTop: 42,
              }}
            >
              <SilkArc size={250} left={-28} bottom={-18} rotate={-10} />
              <SilkArc size={320} left={44} bottom={-72} rotate={2} />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.14fr 0.86fr",
                  gap: 20,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    padding: "28px 28px 26px",
                    borderRadius: 34,
                    background:
                      "linear-gradient(180deg, rgba(255, 252, 247, 0.90) 0%, rgba(255, 247, 238, 0.76) 100%)",
                    border: `1px solid ${palette.line}`,
                    boxShadow: "0 16px 34px rgba(92, 67, 31, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 22,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fontSerif,
                        fontSize: 28,
                        lineHeight: "34px",
                        color: palette.gold,
                        fontWeight: 700,
                      }}
                    >
                      礼赠成案链路
                    </div>
                    <div
                      style={{
                        fontFamily: fontSans,
                        fontSize: 18,
                        lineHeight: "24px",
                        color: palette.warm,
                      }}
                    >
                      对话 / 推荐 / 成案 / 发送
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                    }}
                  >
                    {journeySteps.map((step, index) => (
                      <div
                        key={step.index}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "54px 1fr",
                          gap: 14,
                          alignItems: "start",
                          paddingTop: index === 0 ? 0 : 2,
                        }}
                      >
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: 999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255, 255, 255, 0.72)",
                            border: `1px solid ${palette.line}`,
                            color: palette.gold,
                            fontFamily: fontSans,
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          {step.index}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            paddingTop: 2,
                          }}
                        >
                          <div
                            style={{
                              fontFamily: fontSans,
                              fontSize: 24,
                              lineHeight: "30px",
                              color: palette.ink,
                              fontWeight: 700,
                            }}
                          >
                            {step.title}
                          </div>
                          <div
                            style={{
                              fontFamily: fontSans,
                              fontSize: 19,
                              lineHeight: "29px",
                              color: palette.warm,
                            }}
                          >
                            {step.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      padding: "24px 22px",
                      borderRadius: 32,
                      background: palette.panel,
                      border: `1px solid ${palette.line}`,
                      boxShadow: "0 14px 28px rgba(92, 67, 31, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fontSerif,
                        fontSize: 24,
                        lineHeight: "30px",
                        color: palette.gold,
                        fontWeight: 700,
                        marginBottom: 16,
                      }}
                    >
                      适用场景
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      {scenarioTags.map((tag) => (
                        <div
                          key={tag}
                          style={{
                            padding: "9px 14px",
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.72)",
                            border: `1px solid ${palette.line}`,
                            fontFamily: fontSans,
                            fontSize: 18,
                            lineHeight: "24px",
                            color: palette.warm,
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      flex: 1,
                      padding: "24px 22px",
                      borderRadius: 32,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.76) 0%, rgba(255,249,242,0.86) 100%)",
                      border: `1px solid ${palette.line}`,
                      boxShadow: "0 14px 28px rgba(92, 67, 31, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 999,
                        border: `1px solid ${palette.lineStrong}`,
                        color: palette.gold,
                        fontFamily: fontSerif,
                        fontSize: 28,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.58)",
                      }}
                    >
                      丝
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: fontSerif,
                          fontSize: 30,
                          lineHeight: "40px",
                          color: palette.ink,
                          fontWeight: 700,
                        }}
                      >
                        让推荐表达更得体
                      </div>
                      <div
                        style={{
                          fontFamily: fontSans,
                          fontSize: 20,
                          lineHeight: "32px",
                          color: palette.softInk,
                        }}
                      >
                        用更轻的交互完成更完整的礼赠方案表达，把品牌温度和成案效率放在同一页里。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              minHeight: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 44,
                background:
                  "linear-gradient(180deg, rgba(255,251,244,0.84) 0%, rgba(255,247,237,0.70) 100%)",
                border: "1px solid rgba(255,255,255,0.72)",
                boxShadow: "0 28px 70px rgba(94, 68, 28, 0.10)",
                backdropFilter: "blur(14px)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: "24px 24px 22px",
                borderRadius: 34,
                border: `1px solid rgba(207, 154, 81, 0.12)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: 40,
                right: 40,
                top: 34,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {topTabs.map((tab, index) => (
                  <MiniTab key={tab} text={tab} active={index === 0} />
                ))}
              </div>

              <div
                style={{
                  height: 42,
                  padding: "0 16px",
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.54)",
                  border: `1px solid rgba(207, 154, 81, 0.18)`,
                  color: palette.warm,
                  fontFamily: fontSans,
                  fontSize: 18,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                4 步完成导购闭环
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 38,
                right: 38,
                top: 106,
                bottom: 38,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                gap: 24,
                alignItems: "stretch",
                zIndex: 2,
              }}
            >
              {shotCards.map((item) => (
                <FlatShotCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            paddingBottom: 4,
          }}
        >
          <div
            style={{
              width: 1180,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div style={{ height: 1.5, background: palette.line }} />
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 999,
                border: `1.5px solid ${palette.lineStrong}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.gold,
                fontFamily: fontSerif,
                fontSize: 34,
                fontWeight: 700,
                background: "rgba(255, 252, 246, 0.52)",
              }}
            >
              丝
            </div>
            <div style={{ height: 1.5, background: palette.line }} />
          </div>

          <div
            style={{
              fontFamily: fontSerif,
              fontSize: 22,
              lineHeight: "30px",
              letterSpacing: 10,
              color: palette.gold,
            }}
          >
            匠 心 丝 绸 · 智 慧 相 伴
          </div>
          <div
            style={{
              fontFamily: fontSans,
              fontSize: 20,
              lineHeight: "30px",
              color: palette.warm,
              letterSpacing: 4,
            }}
          >
            让 每 一 次 推 荐 ， 都 成 为 更 高 效 的 连 接
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
