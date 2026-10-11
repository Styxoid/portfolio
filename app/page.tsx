import Hero from "@/components/hero/Hero";
import DealerSpread from "@/components/projects/DealerSpread";
import CardBinder from "@/components/skills/CardBinder";
import PocketAces from "@/components/profiles/PocketAces";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section: The Shuffle & The Cut */}
      <Hero />

      {/* 2. Projects Showcase: The Dealer's Spread */}
      <DealerSpread />

      {/* 3. Tech Stack: The Card Binder */}
      <CardBinder />

      {/* 4. Profiles & Contact: The Final Hand / Pocket Aces */}
      <PocketAces />
    </div>
  );
}
