import WorldScene from "../scenes/WorldScene";
import { useUserDataStore } from "../stores/userData";
import { moveRandomly } from "../utils/npc";
import { getTiledObjectProperty } from "../utils/object";
import { openDialog } from "../utils/ui";

export default ([npc], scene: WorldScene) => {
  const name = getTiledObjectProperty("name", npc);
  scene.gridEngine.stopMovement(name);

  const hasPokemon = !!useUserDataStore.getState().pokemons?.length;

  if (!hasPokemon) {
    openDialog({
      content: `
        You do not have a catch yet, right?;
        Then do not head into the market alone.;
        Go see PG at the accelerator. He is handing out starter OFFER LETTERS today!
      `,
      callback: () => moveRandomly(scene.gridEngine, name),
    });
  } else {
    openDialog({
      content: `
        Nice catch.;
        A founder is only as good as the monsters they can rally.;
        Good luck making it to Demo Day!
      `,
      callback: () => moveRandomly(scene.gridEngine, name),
    });
  }
};
