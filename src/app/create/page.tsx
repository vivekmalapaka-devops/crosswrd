import { Nav } from "@/components/Nav";
import { CreateFlow } from "@/components/create/CreateFlow";

export const metadata = {
  title: "Create a crossword — crosswrd.site",
};

export default function CreatePage() {
  return (
    <>
      <Nav />
      <CreateFlow />
    </>
  );
}
