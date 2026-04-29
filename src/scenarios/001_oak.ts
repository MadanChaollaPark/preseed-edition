import { useUserDataStore } from "../stores/userData";
import { openDialog } from "../utils/ui";

export default () => {
  const { completeScenario } = useUserDataStore.getState();

  openDialog({
    content: `BRETT: Marc! I'm fed up with waiting!`,
    callback: () => {
      openDialog({
        content: `
          MARC: BRETT? Let me think...;
          Oh, right — I told you to come by the office! Just wait!;
          Here, kid! There are 3 AGENTS here!;
          Haha! They're inside these OFFER LETTERS.;
          When I was young I was a serious FOUNDER too!;
          These days I'm just a YC partner, but you can take one!;
          Pick your co-founder!`,
        callback: () => {
          openDialog({
            content: `BRETT: Hey! Marc! What about me?`,
            callback: () => {
              openDialog({
                content: `MARC: Be patient! BRETT, you can have one too!`,
                callback: () => {
                  completeScenario(1);
                },
              });
            },
          });
        },
      });
    },
  });
};
