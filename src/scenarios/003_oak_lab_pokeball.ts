import WorldScene from "../scenes/WorldScene";
import { useUserDataStore } from "../stores/userData";
import {
  convertObjectPositionToTilePosition,
  getTiledObjectProperty,
  handlePokeball,
  removeObject,
} from "../utils/object";
import { openDialog } from "../utils/ui";
import { pokemons } from "../constants/pokemons";
import { getStarterTheme } from "../constants/founderTheme";
import { FounderPath } from "../constants/types";

import { Layers, Objects, Sprites } from "../constants/assets";
import { Direction } from "grid-engine";
import { wait } from "../utils/time";

const weaknessMap = {
  1: 4,
  4: 7,
  7: 1,
};

export default ([pokeball], scene: WorldScene) => {
  const { hasCompletedScenario, completeScenario } =
    useUserDataStore.getState();

  if (hasCompletedScenario(3) || !hasCompletedScenario(1)) {
    return openDialog({
      content: "It's an offer letter from Marc!",
    });
  }

  const pokemon_inside_id = getTiledObjectProperty("pokemon_inside", pokeball);
  const pokemon = pokemons.find(({ id }) => id === Number(pokemon_inside_id));
  const starterTheme = getStarterTheme(pokemon.id);

  openDialog({
    content: `MARC: So. You want to catch ${pokemon.name}, the ${starterTheme.title}?`,
    image: `assets/images/pokemons/front/${pokemon.id}.png`,
    choices: ["Yes", "No"],
    callback: async (choice) => {
      if (choice === "Yes") {
        useUserDataStore.getState().update({
          founderPath: starterTheme.path,
        });

        handlePokeball(scene, pokeball, () =>
          openDialog({
            content: `MARC: Smart catch.;
            ${starterTheme.pitch};
            ${starterTheme.followUp}`,
            callback: () => {
              const otherPokeballs = scene.tilemap
                .getObjectLayer(Layers.OBJECTS)
                .objects.filter(({ name }) => name === Objects.POKEBALL);
              const bluePokeball = convertObjectPositionToTilePosition(
                otherPokeballs.find(
                  (otherPokemon) =>
                    getTiledObjectProperty("pokemon_inside", otherPokemon) ===
                    String(weaknessMap[pokemon.id]),
                ),
              );

              scene.gridEngine
                .moveTo(Sprites.BLUE, {
                  x: bluePokeball.x,
                  y: bluePokeball.y + 1,
                })
                .subscribe({
                  complete: async () => {
                    await wait(100);
                    scene.gridEngine.turnTowards(Sprites.BLUE, Direction.UP);
                    await wait(200);
                    const rivalPath =
                      starterTheme.path === FounderPath.BOOTSTRAP
                        ? "a faster play"
                        : starterTheme.path === FounderPath.VC
                          ? "the disciplined path"
                          : "the growth rocket";
                    openDialog({
                      content: `BRETT: Fine. Then I am catching this one and taking ${rivalPath} to Demo Day!`,
                      callback: () => {
                        removeObject(scene, bluePokeball);
                        useUserDataStore
                          .getState()
                          .addObjectToInventory(bluePokeball.id, scene.map);
                        completeScenario(3);
                      },
                    });
                  },
                });
            },
          }),
        );
      }
    },
  });
};
