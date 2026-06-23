import { useEffect, useState } from "react";

export interface PokemonData {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  flavorText: string;
}

export function usePokemon(id: number) {
  const [data, setData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json()),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((r) => r.json()),
    ])
      .then(([pokemon, species]) => {
        const entry =
          species.flavor_text_entries.find((e: any) => e.language.name === "pt-BR") ??
          species.flavor_text_entries.find((e: any) => e.language.name === "pt") ??
          species.flavor_text_entries.find((e: any) => e.language.name === "en");

        const rawText: string = entry?.flavor_text ?? "";
        const flavorText = rawText
          .replace(/\f|\n/g, " ")
          // Caso especial: "POKéMON" tem 'é' minúsculo no meio, precisa vir antes do replace geral
          .replace(/POKéMON/g, "Pokémon")
          // Demais palavras em CAIXA ALTA → Title Case (ex: "BULBASAUR" → "Bulbasaur")
          .replace(/\b([A-ZÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇ]{2,})\b/g, (w) =>
            w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          );

        setData({
          id,
          name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          sprite: pokemon.sprites.other["official-artwork"].front_default,
          types: pokemon.types.map((t: any) => t.type.name as string),
          flavorText,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}
