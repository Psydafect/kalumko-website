// Site content. Edit here.
// `selected` is the landing page, in the order of the current kalumko.ca home page.
// Photo order inside each project comes from media/manifest.js (tools/fetch_live.py
// keeps the order from kalumko.ca).
// Recognition / press entries are [label, link]; links come from kalumko.ca.
// Films: `ratio` is the film's own shape, so the player has no black bars.
window.SITE = {
  name: "kalum ko",
  role: "photographer + director",
  email: "kalum@kalumko.ca",
  instagram: "kalumko",
  vimeo: "kalumko",
  clocks: [
    { label: "NYC", tz: "America/New_York" },
    { label: "Kootenay Rockies", tz: "America/Edmonton" },
  ],

  selected: [
    "close-to-home", "about-now", "tinder", "wip", "the-washington-post",
    "help-from-my-friends", "mercedes-benz", "destination-bc",
  ],

  projects: [
    // ── Stills ──
    {
      slug: "close-to-home", title: "Close to Home", kind: "stills", group: "Personal",
      subtitle: "Ongoing Project",
      text: [
        "Close to Home is an ongoing project inspired by my upbringing in Kimberley, BC.",
        "Set in British Columbia’s Kootenay region, it explores the decision of whether or not to stay in your hometown.",
      ],
      recognition: [
        ["LensCulture — Feature", "https://www.lensculture.com/articles/kalum-ko-close-to-home"],
        ["BOOOOOOOM — Staff Post", "https://www.booooooom.com/2024/09/11/close-to-home-by-photographer-kalum-ko/"],
        ["LensCulture — Juror’s Pick", "https://www.lensculture.com/photo-competitions/emerging-talent-awards/2024/winners?modal=kalum-ko-the-winner-of-emerging-talent-awards-2024"],
        ["Young Guns — Winner", "https://www.oneclub.org/awards/youngguns/-award/61266/kalum-ko/"],
        ["Lucie Foundation — Finalist", "https://submit.luciefoundation.org/winner/zoom.php?eid=81-17917-24"],
        ["NYT Portfolio Review — 2025", "https://www.nytimes.com/2025/01/15/lens/nyt-portfolio-review.html"],
        ["Photo London — Group Exhibit", "https://www.lensculture.com/articles/lensculture-editors-lensculture-at-photo-london-pictures-from-the-exhibition"],
      ],
      note: "Created with the support of the Canada Council for the Arts.",
    },
    {
      slug: "tinder", title: "Tinder", kind: "stills", group: "Commissioned", cover: 2,
      subtitle: "It Starts With A Swipe",
      text: [
        "‘It Doesn’t Have to Start Like a Movie To End in a Romance.’",
        "Featuring Evan Mock, Lana Condor, Libby Larkin, Dezi, Alectra, and Noah Toth.",
      ],
      credits: [["Client", "Tinder"], ["Agency", "Mischief"], ["Prod Co.", "Smuggler"], ["Director", "rubberband."]],
    },
    {
      slug: "the-washington-post", title: "The Washington Post", kind: "stills", group: "Commissioned",
      subtitle: "Relentless",
      text: [
        "Featuring The Washington Post’s journalists and team behind the Flock Camera stalking investigation.",
        "65,000 copies of this limited-edition paper were delivered to subscribers and decision-makers across the country, including members of the Senate, city councils, mayors and the White House.",
      ],
      credits: [["Client", "Washington Post"], ["Agency", "Uncommon Creative Studio"]],
    },
    {
      slug: "help-from-my-friends", title: "Help From My Friends", kind: "stills", group: "Personal", cover: 2,
      subtitle: "Ongoing Series",
      text: ["You make it a little easier."],
    },

    // ── Motion ──
    {
      slug: "about-now", title: "About Now", kind: "motion", group: "Personal",
      subtitle: "with Phong Bui",
      text: ["Featuring Phong Bui of The Brooklyn Rail in his Greenpoint studio."],
      vimeo: "1212621218", ratio: "5 / 3", loop: "SunBW.gif",
      credits: [
        ["Director", "Kalum Ko"], ["Cinematographer", "Evan Ciniello"], ["Gaffer + Swing", "John MacKay"],
        ["Editor", "Alex Pieterse"], ["Edit House", "Church Edit"], ["Colourist", "Nielsan Bohl"],
        ["Colour House", "Selected Works"], ["Producer", "Hannah George"], ["Sound Design & Mix", "Michael Le"],
        ["Sound Studio", "Past Tense Studio"], ["Made possible by", "The Brooklyn Rail"],
        ["Special Thanks", "Phong Bui, Cal McKeever, Greenpoint Pictures, Michael Kuhn, Niles Roth, Tatiana Rudzinski, Bethany MacMillan, Champion Reps, Patrick McElroy, Valerie Messersi, Donna Salek, Rory Wagner, Caroline Kilbane"],
      ],
      recognition: [
        ["Nowness", "https://www.nowness.com/picks/about-now-with-phong-bui-kalum-ko"],
        ["Shots", "https://shots.net/news/view/kalum-ko-draws-inspiration-from-phong-bui"],
        ["Directors’ Library", "https://directorslibrary.com/2026/latest/shorts/documentary-short/about-now-with-phong-bui/"],
      ],
    },
    {
      slug: "wip", title: "WIP", kind: "motion", group: "Personal",
      text: ["Wandering NYC’s streets, hoping for chance encounters."],
      vimeo: "759624626", ratio: "1.9", loop: "WIP_Clean.gif",
      credits: [
        ["Directed, Photographed, and Edited", "Kalum Ko"], ["Music", "‘Failing to Meditate’ by Maceo Frost"],
        ["Created with the Support from", "Common Good"], ["Special Thanks", "Henry Lu + Colin Murdock"],
      ],
      recognition: [
        ["Nowness", "https://www.nowness.com/story/kalum-ko-wip"],
        ["Directors Library", "https://directorslibrary.com/2022/latest/shorts/documentary-short/wip/"],
        ["Webby Awards", "https://winners.webbyawards.com/2023/video/general-video/art-experimental/238161/wip"],
        ["Shots", "https://www.shots.net/news/view/kalum-kos-chance-encounters"],
        ["Young Guns", "https://www.oneclub.org/awards/youngguns/-award/61266/kalum-ko/"],
      ],
    },
    {
      slug: "mercedes-benz", title: "Mercedes-Benz", kind: "motion", group: "Commercial",
      subtitle: "The Detour",
      text: ["Reflections with photographer Jason Charles Hill while on assignment in Patagonia."],
      vimeo: "248692917", ratio: "16 / 9", loop: "Mercedes_GIF_V02.gif",
      credits: [
        ["Client", "Mercedes-Benz"], ["Agency", "OSK - Cologne"], ["Cinematographer", "Christopher Clark"],
        ["Score", "Landis Tanaka"], ["Sound", "Keith White at KWA"],
      ],
      recognition: [["Airows", "https://airows.com/travel/jason-charles-hill-mercedes-patagonia-video"], ["The Inertia"]],
    },
    {
      slug: "destination-bc", title: "Destination BC", kind: "motion", group: "Commercial",
      subtitle: "Moments",
      text: ["A series of 15-second spots focusing on moments of connection with the wild."],
      vimeo: "368388910", ratio: "16 / 9", loop: "DBC_OCEAN_SWIMMING_15_16x9_V8.gif",
      credits: [
        ["Client", "Destination BC"], ["Agency", "123w"], ["Prod. Co", "Boldly"], ["Producer", "Shelby Manton"],
        ["Cinematographer", "Liam Mullany"], ["Editor", "Sebastien Galina"], ["Colour", "Sam Gilling - Cycle Media"],
        ["Sound", "Keith White - KWA"],
      ],
    },
  ],

  info: {
    bio: [
      "Kalum Ko is a <b>photographer and director</b> based in <b>Brooklyn, New York.</b>",
      "Raised in Kimberley, BC, a one-stoplight town in the Canadian Rockies, he began making ski films at 13 with his mom’s point-and-shoot.",
      "Since then, his work has taken him to over 35 countries, collaborating with brands including <b>Mercedes-Benz</b>, <b>Condé Nast</b> and <b>Tinder</b>, and agencies such as <b>Droga5</b>, <b>Mischief</b> and <b>Uncommon Creative Studio</b>.",
      "His projects have been featured by <b>Nowness</b>, <b>BOOOOOOOM</b>, and <b>National Geographic</b>.",
      "He is a <b>Young Guns 2025 winner</b>, the global portfolio competition honoring the top creatives under 30, a <b>YDA Nominee</b>, and was recently awarded the <b>Juror’s Pick</b> in <b>LensCulture’s Emerging Talent Awards</b> as well as a <b>Canada Council for the Arts</b> grant for <b>Close to Home</b>.",
      "Kalum is currently developing two post-documentary projects exploring home, community, and coming-of-age across Canada.",
    ],
    representation: [
      ["USA", "Greenpoint Pictures", "https://greenpointpictures.com/directors/kalum-ko/"],
      ["Canada", "Common Good", "https://commongood.tv/kalum-ko/"],
    ],
    press: [
      ["Nowness", "https://www.nowness.com/story/kalum-ko-wip"],
      ["BOOOOOOOM", "https://www.booooooom.com/2024/09/11/close-to-home-by-photographer-kalum-ko/"],
      ["National Geographic", "https://www.nationalgeographic.com/environment/article/skating-canadian-ice-rinks-warming-winters"],
      ["The One Club", "https://www.oneclub.org/articles/-view/young-guns-23-kalum-ko/"],
      ["Directors Library", "https://directorslibrary.com/2022/latest/shorts/documentary-short/wip/"],
      ["The Trench", "https://www.thetrenchmag.com/stories/kalum-ko"],
      ["LensCulture", "https://www.lensculture.com/articles/kalum-ko-close-to-home"],
      ["Shots", "https://shots.net/news/view/experiencing-yukon-wild-for-yourself"],
    ],
    awards: [
      ["ADC Young Guns 2025", "Winner", "https://www.oneclub.org/awards/youngguns/-award/61266/kalum-ko/"],
      ["LensCulture", "Juror’s Pick", "https://www.lensculture.com/articles/kalum-ko-close-to-home"],
      ["Canada Council for the Arts", "Winner", "https://canadacouncil.ca/funding/grants"],
      ["Young Director Award", "Nominee", "https://www.youngdirectoraward.com/2019-shortlist/"],
      ["Webby Awards", "Nominee", "https://winners.webbyawards.com/2023/video-film/general-video-film/art-experimental/238161/wip"],
      ["Lucie Foundation", "Finalist", "https://submit.luciefoundation.org/winner/zoom.php?eid=81-17917-24n"],
    ],
    clients: "Condé Nast, General Electric, Kraft, Lyft, Mercedes-Benz, Meta, National Geographic, Tinder, The Washington Post",
    agencies: "Droga5, GUT, Mischief, Rethink, Uncommon Creative Studio, Zulu Alpha Kilo NY",
  },
};
