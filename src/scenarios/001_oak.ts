import { useUserDataStore } from "../stores/userData";
import { openDialog } from "../utils/ui";

export default () => {
  const { completeScenario } = useUserDataStore.getState();

  openDialog({
    content: `BRETT: Marc! I am done waiting around!`,
    callback: () => {
      openDialog({
        content: `
          MARC: BRETT, relax. I told both of you to meet me at the accelerator.;
          Every founder starts with one great catch.;
          Inside these OFFER LETTERS are three rare startup monsters.;
          Catch the right one, and you might just survive Founder Town long enough to make Demo Day.;
          Some founders bootstrap. Some raise too fast. Some just out-execute everyone.;
          Your first catch decides the kind of company you become.;
          Go on. Pick your monster.`,
        callback: () => {
          openDialog({
            content: `BRETT: Hey! I was here first. Why does this founder get first pick?`,
            callback: () => {
              openDialog({
                content: `MARC: Because patience is also part of the game, BRETT. You will get your catch.`,
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
