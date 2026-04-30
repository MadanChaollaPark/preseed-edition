import { useEffect, useState } from "react";

import { UIEvents } from "../../constants/events";
import { useUIStore } from "../../stores/ui";
import { useEventsListeners } from "../../utils/events";
import {
  getVoiceIdForSpeaker,
  isVoiceEnabled,
  speak,
} from "../../utils/voice";

const speakerProfiles: Record<
  string,
  { avatar: string; title: string; channel: string; tone: string }
> = {
  PG: {
    avatar: "P",
    title: "Mentor",
    channel: "#mentor-dm",
    tone: "mentor",
  },
  BRETT: {
    avatar: "B",
    title: "Rival",
    channel: "#rival-feed",
    tone: "rival",
  },
  ANNOUNCER: {
    avatar: "A",
    title: "System",
    channel: "alerts://runway",
    tone: "system",
  },
  JUDGE: {
    avatar: "J",
    title: "Judge",
    channel: "#demo-day",
    tone: "judge",
  },
};

const audioBars = [10, 18, 26, 16, 24, 14, 28, 18];

const getDialogStepMeta = (step?: string) => {
  const safeStep = step ?? "";
  const speakerMatch = safeStep.match(/^\s*([A-Z][A-Z ]+):/);
  const speaker = speakerMatch?.[1]?.trim();
  const messageHtml = safeStep.replace(/^\s*[A-Z][A-Z ]+:\s*/, "").trim();
  const spokenText = safeStep
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*[A-Z][A-Z ]+:\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    speaker,
    messageHtml,
    spokenText,
  };
};

export const Dialog = () => {
  const { dialog, closeDialog, set } = useUIStore(
    ({ dialog, closeDialog, set }) => ({
      dialog,
      closeDialog,
      set,
    }),
  );

  const [selectedChoice, setSelectedChoice] = useState<string>();

  const isLastStep = dialog.currentStepIndex === dialog.steps.length - 1;
  const shouldShowChoices = isLastStep && !!dialog.choices?.length;

  const triggerNextStep = () => {
    const menu = useUIStore.getState().menu;

    if (menu.isOpen && !dialog.isOpen) {
      // Do not trigger next step if the dialog is not open
      // but the event is triggered by the menu
      return;
    }

    const nextStepIndex = dialog.currentStepIndex + 1;

    if (dialog.steps[nextStepIndex]) {
      set((current) => ({
        ...current,
        dialog: {
          ...current.dialog,
          currentStepIndex: nextStepIndex,
        },
      }));
    } else {
      queueMicrotask(() => {
        closeDialog();

        if (selectedChoice) {
          console.log("Choice made: ", selectedChoice);
        }

        dialog.callback?.(selectedChoice);
      });
    }
  };

  useEventsListeners(
    [
      {
        name: UIEvents.NEXT_STEP,
        callback: triggerNextStep,
      },
      {
        name: UIEvents.UP,
        callback: () => {
          if (shouldShowChoices) {
            setSelectedChoice(
              (current) =>
                dialog.choices[dialog.choices.indexOf(current) - 1] ||
                dialog.choices[dialog.choices.length - 1],
            );
          }
        },
      },
      {
        name: UIEvents.DOWN,
        callback: () => {
          if (shouldShowChoices) {
            setSelectedChoice(
              (current) =>
                dialog.choices[dialog.choices.indexOf(current) + 1] ||
                dialog.choices[0],
            );
          }
        },
      },
    ],
    [dialog, selectedChoice],
  );

  useEffect(() => {
    if (dialog.choices?.length) {
      setSelectedChoice(dialog.choices[0]);
    }
  }, [dialog.choices]);

  useEffect(() => {
    if (!dialog.isOpen) return;
    const step = dialog.steps[dialog.currentStepIndex];
    if (!step) return;
    const { speaker, spokenText } = getDialogStepMeta(step);
    if (spokenText) {
      speak(spokenText, getVoiceIdForSpeaker(speaker));
    }
  }, [dialog.isOpen, dialog.currentStepIndex, dialog.steps]);

  const newLineToBrWithStrip = (text: string) => {
    return text?.trim().split("\n").join("<br />");
  };

  const currentStep = dialog.steps[dialog.currentStepIndex];
  const { speaker, messageHtml } = getDialogStepMeta(currentStep);
  const profile =
    speakerProfiles[speaker?.toUpperCase() ?? ""] ?? {
      avatar: "•",
      title: "Thread",
      channel: "#founder-feed",
      tone: "default",
    };

  return (
    <div className="dialogContainer">
      {shouldShowChoices && (
        <div
          className="dialog choice"
          style={{
            display: dialog.isOpen ? "block" : "none",
          }}
        >
          <div className="dialog__choicesLabel">quick replies</div>
          <div className="inner">
            {dialog.choices.map((choice) => (
              <span
                key={choice}
                className={
                  selectedChoice === choice
                    ? "dialog__choice dialog__choice--selected"
                    : "dialog__choice"
                }
              >
                {choice}
              </span>
            ))}
          </div>
        </div>
      )}
      <div
        className="dialog"
        style={{
          display: dialog.isOpen ? "block" : "none",
        }}
      >
        <div className="dialog__header">
          <div className="dialog__speaker">
            <div
              className={`dialog__avatar dialog__avatar--${profile.tone}`}
            >
              {profile.avatar}
            </div>
            <div className="dialog__speakerMeta">
              <span className="dialog__channel">{profile.channel}</span>
              <strong>
                {speaker ?? "THREAD"} <em>{profile.title}</em>
              </strong>
            </div>
          </div>

          <div className="dialog__live">
            <span>{isVoiceEnabled() ? "voice live" : "text only"}</span>
            <div className="dialog__waveform" aria-hidden="true">
              {audioBars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  style={{
                    height,
                    animationDelay: `${index * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="inner">
          {!!dialog.image && (
            <div className="image">
              <img src={dialog.image} alt="representation of dialog" />
            </div>
          )}
          <div className="dialog__message">
            <span
              dangerouslySetInnerHTML={{
                __html: newLineToBrWithStrip(messageHtml),
              }}
            ></span>
            {!shouldShowChoices && <span className="blink">↵</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
