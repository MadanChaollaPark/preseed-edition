import { useEffect, useState } from "react";
import { useUIStore } from "../../stores/ui";

export const TitleScreen = () => {
  const { showTitle, hideTitle } = useUIStore();
  const [pokemonId, setPokemonId] = useState<number>(
    () => Math.floor(Math.random() * 151) + 1,
  );

  useEffect(() => {
    if (!showTitle) return;
    const id = setInterval(() => {
      setPokemonId(Math.floor(Math.random() * 151) + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [showTitle]);

  useEffect(() => {
    if (!showTitle) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key.toLowerCase() === "a") {
        hideTitle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTitle, hideTitle]);

  if (!showTitle) return null;

  return (
    <div className="titleScreen" onClick={hideTitle}>
      <div className="titleSection">
        <img className="titleLogo" src="assets/images/ui/logo.png" alt="logo" />
        <div className="titleSubtitle">Pre-Seed Edition</div>
      </div>
      <div className="titlePokemonRow">
        <img
          className="titlePokemon"
          src={`assets/images/pokemons/front/${pokemonId}.png`}
          alt="pokemon"
        />
      </div>
      <div className="titlePressStart">PRESS START</div>
    </div>
  );
};
