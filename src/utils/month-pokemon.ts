// Starting June 2026 = Bulbasaur #1, advancing one Pokémon per month
export function getPokemonId(year: number, month: number): number {
  const diff = (year - 2026) * 12 + (month - 5); // month is 0-indexed, June=5
  return Math.max(1, diff + 1);
}

export const TYPE_COLORS: Record<string, string> = {
  grass: "#7ac74c",
  poison: "#a33ea1",
  fire: "#ee8130",
  water: "#6390f0",
  electric: "#f7d02c",
  bug: "#a6b91a",
  normal: "#a8a77a",
  flying: "#a98ff3",
  psychic: "#f95587",
  ice: "#96d9d6",
  dragon: "#6f35fc",
  dark: "#705746",
  fairy: "#d685ad",
  fighting: "#c22e28",
  rock: "#b6a136",
  ground: "#e2bf65",
  ghost: "#735797",
  steel: "#b7b7ce",
};
