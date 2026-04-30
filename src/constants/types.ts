import type { BasePokemon } from "./pokemons";

export type ObjectProperties = {
  name?: string;
  x?: number;
  y?: number;
  value?: string | number | boolean;
};

export enum PokemonGender {
  MALE = "♂",
  FEMALE = "♀",
}

export enum FounderPath {
  BOOTSTRAP = "Bootstrap",
  VC = "VC-backed",
  OPERATOR = "Operator",
}

export interface IPokemon extends BasePokemon {
  uniqId: number;
  hp: number;
  ability: string;
  gender: PokemonGender;
  isShiny: boolean;
}
