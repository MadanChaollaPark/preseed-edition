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
    // Scientist tells you to go see Marc if you don't have an agent yet
    openDialog({
      content: `
        You haven't recruited an AGENT yet, right?;
        This is a great opportunity to get one!;
        Go see Marc at YC! He's onboarding new founders today!
      `,
      callback: () => moveRandomly(scene.gridEngine, name),
    });
  } else {
    // Scientist congratulates you for having an agent and wishes you good luck
    openDialog({
      content: `
        Oh, I like your AGENT!;
        I hope you become a great FOUNDER!
      `,
      callback: () => moveRandomly(scene.gridEngine, name),
    });
  }
};
