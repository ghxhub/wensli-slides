import React from "react";
import { Sequence } from "remotion";
import { SceneTransitionProvider } from "./scenes/trainingShared";
import { TrainingGoalsScene } from "./scenes/TrainingGoalsScene";
import { TrainingEntryScene } from "./scenes/TrainingEntryScene";
import { TrainingExportScene } from "./scenes/TrainingExportScene";
import { TrainingBrowseScene } from "./scenes/TrainingBrowseScene";
import { TrainingProductScene } from "./scenes/TrainingProductScene";
import { TrainingFilterScene } from "./scenes/TrainingFilterScene";
import { TrainingGuideScene } from "./scenes/TrainingGuideScene";
import { TrainingIntroScene } from "./scenes/TrainingIntroScene";
import { TrainingOverviewScene } from "./scenes/TrainingOverviewScene";
import { TrainingPromptScene } from "./scenes/TrainingPromptScene";
import { TrainingDetailScene } from "./scenes/TrainingDetailScene";
import { TrainingProfileChapterScene } from "./scenes/TrainingProfileChapterScene";
import { TrainingProfileEntryScene } from "./scenes/TrainingProfileEntryScene";
import { TrainingFilesScene } from "./scenes/TrainingFilesScene";
import { TrainingThanksScene } from "./scenes/TrainingThanksScene";
import { SiyuLixuanPosterScene } from "./scenes/SiyuLixuanPosterScene";

export const INTRO_DURATION_IN_FRAMES = 108;
export const GOALS_DURATION_IN_FRAMES = 126;
export const OVERVIEW_DURATION_IN_FRAMES = 150;
export const GUIDE_DURATION_IN_FRAMES = 132;
export const ENTRY_DURATION_IN_FRAMES = 144;
export const PROMPT_DURATION_IN_FRAMES = 156;
export const BROWSE_DURATION_IN_FRAMES = 150;
export const PRODUCT_DURATION_IN_FRAMES = 162;
export const DETAIL_DURATION_IN_FRAMES = 156;
export const PROFILE_CHAPTER_DURATION_IN_FRAMES = 150;
export const PROFILE_ENTRY_DURATION_IN_FRAMES = 162;
export const FILES_DURATION_IN_FRAMES = 210;
export const THANKS_DURATION_IN_FRAMES = 132;
export const FILTER_DURATION_IN_FRAMES = 144;
export const EXPORT_DURATION_IN_FRAMES = 336;
export const SIYU_LIXUAN_POSTER_DURATION_IN_FRAMES = 1;
const SCENE_OVERLAP_IN_FRAMES = 12;

const FILTER_START_IN_FRAMES =
  INTRO_DURATION_IN_FRAMES +
  GOALS_DURATION_IN_FRAMES +
  OVERVIEW_DURATION_IN_FRAMES +
  GUIDE_DURATION_IN_FRAMES +
  ENTRY_DURATION_IN_FRAMES +
  PROMPT_DURATION_IN_FRAMES;
const EXPORT_START_IN_FRAMES =
  FILTER_START_IN_FRAMES + FILTER_DURATION_IN_FRAMES - SCENE_OVERLAP_IN_FRAMES;
const BROWSE_START_IN_FRAMES =
  EXPORT_START_IN_FRAMES + EXPORT_DURATION_IN_FRAMES - SCENE_OVERLAP_IN_FRAMES;
const PRODUCT_START_IN_FRAMES =
  BROWSE_START_IN_FRAMES + BROWSE_DURATION_IN_FRAMES - SCENE_OVERLAP_IN_FRAMES;
const DETAIL_START_IN_FRAMES = PRODUCT_START_IN_FRAMES + PRODUCT_DURATION_IN_FRAMES;
const PROFILE_CHAPTER_START_IN_FRAMES =
  DETAIL_START_IN_FRAMES + DETAIL_DURATION_IN_FRAMES;
const PROFILE_ENTRY_START_IN_FRAMES =
  PROFILE_CHAPTER_START_IN_FRAMES + PROFILE_CHAPTER_DURATION_IN_FRAMES;
const FILES_START_IN_FRAMES =
  PROFILE_ENTRY_START_IN_FRAMES + PROFILE_ENTRY_DURATION_IN_FRAMES;
const THANKS_START_IN_FRAMES =
  FILES_START_IN_FRAMES + FILES_DURATION_IN_FRAMES - SCENE_OVERLAP_IN_FRAMES;

export const FULL_DURATION_IN_FRAMES =
  THANKS_START_IN_FRAMES + THANKS_DURATION_IN_FRAMES;

export const TrainingIntroComposition: React.FC = () => {
  return <TrainingIntroScene />;
};

export const TrainingGoalsComposition: React.FC = () => {
  return <TrainingGoalsScene />;
};

export const TrainingOverviewComposition: React.FC = () => {
  return <TrainingOverviewScene />;
};

export const TrainingGuideComposition: React.FC = () => {
  return <TrainingGuideScene />;
};

export const TrainingEntryComposition: React.FC = () => {
  return <TrainingEntryScene />;
};

export const TrainingPromptComposition: React.FC = () => {
  return <TrainingPromptScene />;
};

export const TrainingFilterComposition: React.FC = () => {
  return <TrainingFilterScene />;
};

export const TrainingExportComposition: React.FC = () => {
  return <TrainingExportScene />;
};

export const TrainingBrowseComposition: React.FC = () => {
  return <TrainingBrowseScene />;
};

export const TrainingProductComposition: React.FC = () => {
  return <TrainingProductScene />;
};

export const TrainingDetailComposition: React.FC = () => {
  return <TrainingDetailScene />;
};

export const TrainingProfileChapterComposition: React.FC = () => {
  return <TrainingProfileChapterScene />;
};

export const TrainingProfileEntryComposition: React.FC = () => {
  return <TrainingProfileEntryScene />;
};

export const TrainingFilesComposition: React.FC = () => {
  return <TrainingFilesScene />;
};

export const TrainingThanksComposition: React.FC = () => {
  return <TrainingThanksScene />;
};

export const TrainingFullComposition: React.FC = () => {
  return (
    <SceneTransitionProvider enabled={true}>
      <>
        <Sequence durationInFrames={INTRO_DURATION_IN_FRAMES}>
          <TrainingIntroScene />
        </Sequence>
        <Sequence
          from={INTRO_DURATION_IN_FRAMES}
          durationInFrames={GOALS_DURATION_IN_FRAMES}
        >
          <TrainingGoalsScene />
        </Sequence>
        <Sequence
          from={INTRO_DURATION_IN_FRAMES + GOALS_DURATION_IN_FRAMES}
          durationInFrames={OVERVIEW_DURATION_IN_FRAMES}
        >
          <TrainingOverviewScene />
        </Sequence>
        <Sequence
          from={
            INTRO_DURATION_IN_FRAMES +
            GOALS_DURATION_IN_FRAMES +
            OVERVIEW_DURATION_IN_FRAMES
          }
          durationInFrames={GUIDE_DURATION_IN_FRAMES}
        >
          <TrainingGuideScene />
        </Sequence>
        <Sequence
          from={
            INTRO_DURATION_IN_FRAMES +
            GOALS_DURATION_IN_FRAMES +
            OVERVIEW_DURATION_IN_FRAMES +
            GUIDE_DURATION_IN_FRAMES
          }
          durationInFrames={ENTRY_DURATION_IN_FRAMES}
        >
          <TrainingEntryScene />
        </Sequence>
        <Sequence
          from={
            INTRO_DURATION_IN_FRAMES +
            GOALS_DURATION_IN_FRAMES +
            OVERVIEW_DURATION_IN_FRAMES +
            GUIDE_DURATION_IN_FRAMES +
            ENTRY_DURATION_IN_FRAMES
          }
          durationInFrames={PROMPT_DURATION_IN_FRAMES}
        >
          <TrainingPromptScene />
        </Sequence>
        <Sequence
          from={FILTER_START_IN_FRAMES}
          durationInFrames={FILTER_DURATION_IN_FRAMES}
        >
          <TrainingFilterScene />
        </Sequence>
        <Sequence
          from={EXPORT_START_IN_FRAMES}
          durationInFrames={EXPORT_DURATION_IN_FRAMES}
        >
          <TrainingExportScene />
        </Sequence>
        <Sequence
          from={BROWSE_START_IN_FRAMES}
          durationInFrames={BROWSE_DURATION_IN_FRAMES}
        >
          <TrainingBrowseScene />
        </Sequence>
        <Sequence
          from={PRODUCT_START_IN_FRAMES}
          durationInFrames={PRODUCT_DURATION_IN_FRAMES}
        >
          <TrainingProductScene />
        </Sequence>
        <Sequence
          from={DETAIL_START_IN_FRAMES}
          durationInFrames={DETAIL_DURATION_IN_FRAMES}
        >
          <TrainingDetailScene />
        </Sequence>
        <Sequence
          from={PROFILE_CHAPTER_START_IN_FRAMES}
          durationInFrames={PROFILE_CHAPTER_DURATION_IN_FRAMES}
        >
          <TrainingProfileChapterScene />
        </Sequence>
        <Sequence
          from={PROFILE_ENTRY_START_IN_FRAMES}
          durationInFrames={PROFILE_ENTRY_DURATION_IN_FRAMES}
        >
          <TrainingProfileEntryScene />
        </Sequence>
        <Sequence
          from={FILES_START_IN_FRAMES}
          durationInFrames={FILES_DURATION_IN_FRAMES}
        >
          <TrainingFilesScene />
        </Sequence>
        <Sequence
          from={THANKS_START_IN_FRAMES}
          durationInFrames={THANKS_DURATION_IN_FRAMES}
        >
          <TrainingThanksScene />
        </Sequence>
      </>
    </SceneTransitionProvider>
  );
};

export const TrainingVideoComposition: React.FC = () => {
  return <TrainingFullComposition />;
};

export const SiyuLixuanPosterComposition: React.FC = () => {
  return <SiyuLixuanPosterScene />;
};
