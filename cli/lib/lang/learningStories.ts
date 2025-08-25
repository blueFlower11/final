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
    cover: "/images/nooks_cover.png",
    title: {
      en: "Nooks-&-Crooks Learn by Doing",
      hr: "Nooks-&-Crooks uči kroz pokušaje",
    },
    description: {
      en: "Playful bot discover treats by trial and reward.",
      hr: "Veseli robot otkriva poslastice kroz pokušaj i nagradu.",
    },
    pages: {
      en: [
        { img: "/images/eng_kids_1.png", title: "Meet Nooks-&-Crooks!", text: "Nooks-&-Crooks is playful robot that is learning by trying. He lives in a magical engine where each choice leads to rewards or surprises." },
        { img: "/images/eng_kids_2.png", title: "Playing the Game", text: "He explors boxes filled with treats. Every time he picks the right box, he gets a treat! Over time, he learns which boxes are best." },
        { img: "/images/eng_kids_3.png", title: "Learning by Reward", text: "When he makes a good choice, he gets a lot of treats. A wrong choice doesn't get him any treat. This helps him remember what are the best options he has to do." },
        { img: "/images/eng_kids_4.png", title: "Becoming Smart!", text: "Soon, he picks the best boxes almost every time. That’s Reinforcement Learning: try, get reward, and try again!" },
      ],
      hr: [
        { img: "/images/cro_kids_1.png", title: "Upoznajte Nooks-Crooks!", text: "Nooks-Crooks je robot koji uči kroz pokušaj i pogrešku. Živi u stroju gdje svaka odluka donosi nagrade ili iznenađenja." },
        { img: "/images/cro_kids_2.png", title: "Igra u kutijama", text: "Nooks-Crooks istražuje kutije pune poslastica. Ako izabere pravu, dobije nagradu! S vremenom nauči koje su najbolje." },
        { img: "/images/cro_kids_3.png", title: "Učenje nagradom", text: "Dobar izbor donosi mu puno poslastica, krivi odabir ne donosi mu poslastice. Te poslastice pomažu mu zapamtiti što treba sljedeći put odabrati." },
        { img: "/images/cro_kids_4.png", title: "Postaje pametniji!", text: "Ubrzo bira najbolje kutije gotovo svaki put. To je Podržano Učenje: pokušaj, nagrada, i opet!" },
      ],
    },
  },
  {
    slug: "maze-mouse",
    cover: "/images/maze_cover.png",
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
        { img: "/images/maze_1.png", title: "Prvi koraci", text: "Miš nasumično bira hodnike. Katkad nađe sir—nagrada otključana!" },
        { img: "/images/maze_2.png", title: "Pamti dobre skretanja", text: "Putovi sa sirom biraju se češće; slijepa ulica se izbjegava." },
        { img: "/images/maze_3.png", title: "Iskoristi ili istraži?", text: "Hoće li miš odabrati provjereni put ili istražiti novi? To je odnos istraživanja i iskorištavanja." },
        { img: "/images/maze_4.png", title: "Brzi pronalazač", text: "S vježbom miš brzo nađe sir—njegova ‘politika’ je bolja!" },
      ],
    },
  },
];
