import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase-server";
import { Nav } from "@/components/Nav";
import { SolvePage } from "@/components/solve/SolvePage";
import { Puzzle } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getPuzzle(id: string): Promise<Puzzle | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Puzzle;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const puzzle = await getPuzzle(id);

  if (!puzzle) {
    return { title: "Puzzle not found — crosswrd.site" };
  }

  return {
    title: `A crossword for ${puzzle.recipient_name} — crosswrd.site`,
    description: `Someone made a personal crossword puzzle for ${puzzle.recipient_name}. Open the link to solve it.`,
    openGraph: {
      title: `A crossword made for ${puzzle.recipient_name}`,
      description:
        "Someone made a personal crossword puzzle just for you. Can you solve it?",
    },
  };
}

export default async function PuzzlePage({ params }: PageProps) {
  const { id } = await params;
  const puzzle = await getPuzzle(id);

  if (!puzzle) notFound();

  return (
    <>
      <Nav />
      <SolvePage puzzle={puzzle} />
    </>
  );
}
