export type StoryPage = { img: string; title: string; text: string };
export type Localized<T> = { en: T; hr: T };

export type Story = {
  slug: string;
  cover: string;
  title: Localized<string>;
  description: Localized<string>;
  pages: {
    en: StoryPage[];
    hr: StoryPage[];
  };
};

export const stories: Story[] = [
  {
    slug: "nooks-and-crooks",
    cover: "/images/covers/nooks_cover.png",
    title: {
      en: "Nooks & Crooks Learn by Doing",
      hr: "Nooks & Crooks uče djelovanjem",
    },
    description: {
      en: "Two playful bots discover treats by trial and reward.",
      hr: "Dva vesela robota otkrivaju poslastice kroz pokušaje i nagrade.",
    },
    pages: {
      en: [
        { img: "/images/eng_kids_1.png", title: "Meet Nooks & Crooks!", text: "Nooks and Crooks are playful robots learning by trying. They live in a magical engine where each choice leads to rewards or surprises." },
        { img: "/images/eng_kids_2.png", title: "Playing the Game", text: "They explore boxes filled with treats. Every time they pick the right box, they get a treat! Over time, they learn which boxes are best." },
        { img: "/images/eng_kids_3.png", title: "Learning by Reward", text: "When they make a good choice, a cheerful chime plays. A wrong turn makes a funny boing. These sounds help them remember next time." },
        { img: "/images/eng_kids_4.png", title: "Becoming Smart!", text: "Soon, they pick the best boxes almost every time. That’s RL: try, get reward, and try again!" },
      ],
      hr: [
        { img: "/images/cro_kids_1.png", title: "Upoznajte Nooks i Crooks!", text: "Nooks i Crooks su roboti koji uče isprobavanjem. Žive u stroju gdje svaka odluka donosi nagrade ili iznenađenja." },
        { img: "/images/cro_kids_2.png", title: "Igra u kutijama", text: "Istražuju kutije pune poslastica. Ako izaberu pravu, dobiju nagradu! S vremenom nauče koje su najbolje." },
        { img: "/images/cro_kids_3.png", title: "Učenje nagradom", text: "Dobar izbor = veseli zvuk, kriv = smiješan boing. Ti signali pomažu im zapamtiti što treba sljedeći put." },
        { img: "/images/cro_kids_4.png", title: "Postaju pametniji!", text: "Ubrzo biraju najbolje kutije gotovo svaki put. To je RL: pokušaj, nagrada, i opet!" },
      ],
    },
  },
  {
    slug: "garden-of-rewards",
    cover: "/images/covers/garden_cover.png",
    title: {
      en: "The Garden of Rewards",
      hr: "Vrt nagrada",
    },
    description: {
      en: "A curious gardener learns which plants thrive by gentle feedback.",
      hr: "Znalac‑vrtlar uči koje biljke uspijevaju uz nježnu povratnu informaciju.",
    },
    pages: {
      en: [
        { img: "/images/garden_1.png", title: "A New Garden", text: "A gardener tries different watering times. Sometimes plants perk up—that’s a reward!" },
        { img: "/images/garden_2.png", title: "Signals Everywhere", text: "Droopy leaves? Fewer treats. Bright petals? More rewards. The gardener learns patterns." },
        { img: "/images/garden_3.png", title: "Better Policies", text: "By repeating what worked, the gardener forms a routine—like a policy in RL." },
        { img: "/images/garden_4.png", title: "Blooming Results", text: "Soon the garden flourishes. Learning from rewards makes choices better over time." },
      ],
      hr: [
        { img: "/images/garden_hr_1.png", title: "Novi vrt", text: "Vrtlar isprobava različita vremena zalijevanja. Ponekad biljke procvjetaju—to je nagrada!" },
        { img: "/images/garden_hr_2.png", title: "Signali posvuda", text: "Mlohavo lišće? Manje nagrada. Svijetli cvjetovi? Više nagrada. Vrtlar uči obrasce." },
        { img: "/images/garden_hr_3.png", title: "Bolja pravila", text: "Ponovljajući ono što uspijeva, nastaje rutina—kao politika u RL‑u." },
        { img: "/images/garden_hr_4.png", title: "Vrt u cvatu", text: "Ubrzo vrt buja. Učenje iz nagrada poboljšava odluke kroz vrijeme." },
      ],
    },
  },
  {
    slug: "maze-mouse",
    cover: "/images/covers/maze_cover.png",
    title: {
      en: "Maze Mouse & the Cheese",
      hr: "Miš u labirintu i sir",
    },
    description: {
      en: "A tiny explorer learns routes in a maze by tasty feedback.",
      hr: "Mali istraživač uči putove kroz labirint uz ukusnu povratnu informaciju.",
    },
    pages: {
      en: [
        { img: "/images/maze_1.png", title: "First Steps", text: "Our mouse tries corridors at random. Sometimes it finds cheese—reward unlocked!" },
        { img: "/images/maze_2.png", title: "Remembering Good Turns", text: "Cheesy paths get chosen more often; dead ends get ignored." },
        { img: "/images/maze_3.png", title: "Exploit or Explore?", text: "Should the mouse try the favorite path or explore new turns? That’s the exploration‑exploitation trade‑off." },
        { img: "/images/maze_4.png", title: "Fast Finder", text: "With practice, the mouse finds cheese quickly—its ‘policy’ improved!" },
      ],
      hr: [
        { img: "/images/maze_hr_1.png", title: "Prvi koraci", text: "Miš nasumično bira hodnike. Katkad nađe sir—nagrada otključana!" },
        { img: "/images/maze_hr_2.png", title: "Pamti dobre skretanja", text: "Putovi sa sirom biraju se češće; slijepa ulica se izbjegava." },
        { img: "/images/maze_hr_3.png", title: "Iskoristi ili istraži?", text: "Hoće li miš odabrati provjereni put ili istražiti novi? To je odnos istraživanja i iskorištavanja." },
        { img: "/images/maze_hr_4.png", title: "Brzi pronalazač", text: "S vježbom miš brzo nađe sir—njegova ‘politika’ je bolja!" },
      ],
    },
  },
];
