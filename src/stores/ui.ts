import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CrisisAction } from "../constants/founderTheme";

interface UIStore {
  loading: boolean;
  showTitle: boolean;
  dialog: {
    isOpen: boolean;
    callback?: (selectedChoice?: string) => void;
    steps: string[];
    currentStepIndex: number;
    choices?: string[];
    image?: string;
  };
  menu: {
    isOpen: boolean;
  };
  battle: {
    isOpen: boolean;
    title?: string;
    summary?: string;
    hint?: string;
    encounterPokemonId?: number;
    encounterPokemonName?: string;
    encounterRole?: string;
    recommendedAction?: CrisisAction;
    successCopy?: string;
    failureCopy?: string;
  };
  setLoading: (loading: boolean) => void;
  hideTitle: () => void;
  toggleDialog: (
    content?: string,
    image?: string,
    choices?: string[],
    callback?: (selectedChoice?: string) => void,
  ) => void;
  closeDialog: () => void;
  toggleMenu: () => void;
  toggleBattle: () => void;
  setBattleCopy: (params: {
    title: string;
    summary: string;
    hint: string;
    encounterPokemonId: number;
    encounterPokemonName: string;
    encounterRole: string;
    recommendedAction: CrisisAction;
    successCopy: string;
    failureCopy: string;
  }) => void;
  clearBattleCopy: () => void;
  set: (fn: (state: UIStore) => UIStore) => void;
}

export const useUIStore = create<UIStore>()(
  devtools((set) => ({
    loading: true,
    showTitle: true,
    dialog: {
      isOpen: false,
      callback: undefined,
      steps: [],
      currentStepIndex: 0,
      choices: [],
      image: undefined,
    },
    menu: {
      isOpen: false,
    },
    battle: {
      isOpen: false,
      title: undefined,
      summary: undefined,
      hint: undefined,
      encounterPokemonId: undefined,
      encounterPokemonName: undefined,
      encounterRole: undefined,
      recommendedAction: undefined,
      successCopy: undefined,
      failureCopy: undefined,
    },
    setLoading: (loading) => set(() => ({ loading })),
    hideTitle: () => set(() => ({ showTitle: false })),
    toggleDialog: (content, image, choices, callback) =>
      set((state) => ({
        dialog: {
          isOpen: !state.dialog.isOpen,
          callback,
          steps: content?.split(";") ?? [],
          currentStepIndex: 0,
          choices,
          image,
        },
      })),
    closeDialog: () =>
      set(() => ({
        dialog: {
          isOpen: false,
          callback: undefined,
          steps: [],
          currentStepIndex: 0,
          choices: [],
          image: undefined,
        },
      })),
    toggleMenu: () =>
      set((state) => ({
        menu: {
          isOpen: !state.menu.isOpen,
        },
      })),
    toggleBattle: () =>
      set((state) => ({
        battle: {
          isOpen: !state.battle.isOpen,
          title: state.battle.title,
          summary: state.battle.summary,
          hint: state.battle.hint,
          encounterPokemonId: state.battle.encounterPokemonId,
          encounterPokemonName: state.battle.encounterPokemonName,
          encounterRole: state.battle.encounterRole,
          recommendedAction: state.battle.recommendedAction,
          successCopy: state.battle.successCopy,
          failureCopy: state.battle.failureCopy,
        },
      })),
    setBattleCopy: ({
      title,
      summary,
      hint,
      encounterPokemonId,
      encounterPokemonName,
      encounterRole,
      recommendedAction,
      successCopy,
      failureCopy,
    }) =>
      set((state) => ({
        ...state,
        battle: {
          ...state.battle,
          title,
          summary,
          hint,
          encounterPokemonId,
          encounterPokemonName,
          encounterRole,
          recommendedAction,
          successCopy,
          failureCopy,
        },
      })),
    clearBattleCopy: () =>
      set((state) => ({
        ...state,
        battle: {
          isOpen: false,
          title: undefined,
          summary: undefined,
          hint: undefined,
          encounterPokemonId: undefined,
          encounterPokemonName: undefined,
          encounterRole: undefined,
          recommendedAction: undefined,
          successCopy: undefined,
          failureCopy: undefined,
        },
      })),
    set,
  })),
);
