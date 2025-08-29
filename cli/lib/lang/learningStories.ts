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
        { img: "/images/eng_kids_1.png", title: "Meet Nooks-&-Crooks!", text: "Nooks-Crooks is a little robot trying to learn to play tic-tac-toe. In order to learn to play tic-tac-toe, he decided to try to reward every good move he makes and punish every bad one. He uses lots of candy to do this. And he wants even more." },
        { img: "/images/eng_kids_2.png", title: "Playing the Game", text: "To keep track of his every move, he decided to draw a tic-tac-toe board on each box of candy and fill the box with candy for each move he could make. And so he began to learn like a real little student. To learn, he had to play tic-tac-toe many times." },
        { img: "/images/eng_kids_3.png", title: "Learning by Reward", text: "In order for his friends to learn the game, he decided to make a deal with them: If he wins, then his friends will fill his boxes with the candy he wants for his moves, otherwise he will give the candy drawn from the boxes to his friends." },
        { img: "/images/eng_kids_4.png", title: "Becoming Smart!", text: "After playing so many times and exchanging candies with his friends, little Nooks-Crooks noticed that only the candies he always won with were left in his boxes, and finally, with a lot of effort, he managed to learn to play tic-tac-toe."},
      ],
      hr: [
        { img: "/images/cro_kids_1.png", title: "Upoznajte Nooks-Crooks!", text: "Nooks-Crooks je maleni robot koji pokušava naučiti igrati križić-kružić. Da bi naučio igrati križić-kružić odlučio je pokušati nagraditi svaki dobar potez koji napravi, a kazniti svaki loši. Za to koristi punooooo bombona. I želi ih još više." },
        { img: "/images/cro_kids_2.png", title: "Igra u kutijama", text: "Kako bi pratio svaki svoj potez odlučio je nacrtati križić-kružić ploču na svaku kutiju bombona te kutiju napuniti bombonima za svaki potez koji može napraviti. I tako je započeo kao pravi mali đak učiti. Da bi naučio mora puno puta odigrati križić-kružić." },
        { img: "/images/cro_kids_3.png", title: "Učenje nagradom", text: "Kako bi i njegovi prijatelji naučili igru, odlučio se sa njima dogovoriti: Ako on pobjedi, onda će prijatelji za njegove poteze napuniti njegove kutijice sa bombonima koje traži, u suprotnom će on bombone izvučene iz kutijica dati prijateljima." },
        { img: "/images/cro_kids_4.png", title: "Postaje pametniji!", text: "Igrajući tako puno puta i razmijenjujući bombone sa prijateljima, maleni Nooks-Crooks primjetio je da su mu u kutijicama ostali samo bomboni sa kojima uvijek pobjeđuje te je napokon uz puno truda uspio naučiti igrati križić-kružić." },
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
        { img: "/images/maze_1.png", title: "First Steps", text: "A little mouse is trying to learn his way through the maze to his cheese." },
        { img: "/images/maze_2.png", title: "Remembering Good Turns", text: "The first time he enters the maze, he doesn't know where his cheese is, so on his way to the cheese he has to take many turns, reach a dead end, and then return. But the more time passes, the hungrier the mouse gets and the faster he wants to get to his cheese." },
        { img: "/images/maze_3.png", title: "Exploit or Explore?", text: "The next day he has to repeat the journey, but he is still unsure, so he wanders and wanders again. But he doesn't want to wait that long for the cheese, so he decides to remember his way to the cheese as best he can." },
        { img: "/images/maze_4.png", title: "Fast Finder", text: "So the little mouse memorized and learned every day until in the end he knew how to quickly find his way to the cheese almost without error so that he wouldn't be hungry." },
      ],
      hr: [
        { img: "/images/maze_1.png", title: "Prvi koraci", text: "Maleni mišić pokušava naučiti put kroz labirint do svoga sira." },
        { img: "/images/maze_2.png", title: "Pamti dobre skretanja", text: "Prvi puta kada uđe u labirint, ne zna gdje je njego sir pa na putu do sira mora puno puta skrenuti, doći do slijepe ulice i vraćati se. No što više vremena prođe miš je sve gladniji i htio bi što prije doći do svoga sira." },
        { img: "/images/maze_3.png", title: "Iskoristi ili istraži?", text: "Drugoga dana opet mora ponoviti put, ali i daljen nije siguran tako da opet luta i luta. Ali on ne želi toliko dugo čekati na sir tako da je odlučio što bolje može pamtiti svoj put do sira." },
        { img: "/images/maze_4.png", title: "Brzi pronalazač", text: "Tako je maleni mišić svakoga dana pamtio i učio dok na kraju nije skoro bez pogreške znao vrlo brzo pronači put do sira da ne bude gladan." },
      ],
    },
  },
];
