/* =========================================================
   CONTENT FILE: everything on the site comes from here.
   Easiest way to edit: open editor.html, change things,
   click "Download content.js", then upload it to GitHub.
   ========================================================= */

window.SITE = {
  profile: {
    name: "Chance",
    role: "3D artist",
    intro: "Hand-painted, stylized, comic-style or realistic, wtv the work needs. Game-ready assets made in Blender & Substance Painter.",
    age: "16",
    location: "Egypt",
    timezoneLabel: "EET, UTC+2",
    timeZone: "Africa/Cairo",
    bio: [
      "16 y/o 3D artist, 2.5 yrs in Blender & Substance Painter. Stylized, realistic, clothing, armor, characters, creatures, environments, I'm into all of it. Everything's game-ready.",
      "Been building for 3 yrs, took a break & just got back into it, so u'll see environments here too.",
      "Can match diff styles if u need, but what u see here is the quality u'll get."
    ],
    facts: [
      { label: "Blender", value: "2.5 yrs" },
      { label: "Building", value: "3 yrs" }
    ],
    /* "What I do" list + the line under it */
    services: [
      "Props, weapons, clothing & accessories",
      "Environments, maps & scenes",
      "Creatures, sculpting & retopology"
    ],
    servicesNote: "Clean, optimized models that actually work in-game. Fair turnaround & clear communication."
  },

  /* Software shown as framed pictures at the top.
     Upload the logo files next to index.html with these names.
     If a file is missing, a hand-drawn sketch shows instead. */
  tools: [
    { name: "Blender", image: "blender.png" },
    { name: "Substance Painter", image: "substance-painter.png" },
    { name: "Roblox Studio", image: "roblox-studio.png" }
  ],

  /* Titles and button text around the site */
  labels: {
    work: "Work",
    workNote: "click a frame to flip it",
    about: "About",
    howIWork: "What I do",
    badge: "Commissions open",
    soFar: "So far",
    skills: "Skills",
    contact: "Contact",
    contactTitle: "Got an idea? Let's make it.",
    contactText: "Commissions open. DM me on Discord or X to talk about ur project.",
    topPicks: "Top picks",
    heroButton1: "Check out my work",
    heroButton2: "Contact me"
  },

  timeline: [
    { when: "2023", text: "Started building" },
    { when: "2024", text: "Started modeling in Blender & Substance" },
    { when: "Now", text: "Back to building & taking commissions" }
  ],

  /* Commission info box (above Contact) */
  commission: {
    title: "Commission info",
    items: [
      { label: "Payment", text: "PayPal (USD) or Robux" },
      { label: "Terms", text: "50% upfront. Files sent after full payment. No refunds." }
    ]
  },

  skills: [
    { group: "Software", items: ["Blender", "Substance Painter", "Roblox Studio"] },
    { group: "Texturing & shading", items: ["Hand-painted texturing", "Stylized texturing", "Cel shading", "Anime-inspired shading", "Realistic texturing", "Semi-realistic texturing"] },
    { group: "3D modeling", items: ["Hard-surface modeling", "General 3D modeling", "Sculpting", "Retopology", "UVs & topology optimization"] },
    { group: "Also", items: ["Building & environment art", "Rigging", "Animation | still learning"] }
  ],

  contact: {
    discord: "chance_2476",
    xHandle: "@Chancy2476",
    xUrl: "https://x.com/Chancy2476",
    email: ""
  },

  /* CATEGORIES: main groups and their smaller groups (shown as filter buttons) */
  categories: [
    { name: "3D art", description: "", subs: [
      { name: "Character Cosmetics", description: "Clothes, armor and UGC accessories" },
      { name: "Characters", description: "" },
      { name: "Creatures", description: "" },
      { name: "Weapons", description: "" },
      { name: "Vehicles", description: "" },
      { name: "Props", description: "" }
    ] },
    { name: "Environment art", description: "", subs: [] }
  ],

  /* STYLES: the wall is grouped by style, in this order */
  styles: ["Stylized-Cel Shaded", "Realistic"],

  /* PROJECTS (shown in this order inside each style)
     style:      one of the styles above
     category:   one or more, separated by commas: "Character Cosmetics, Weapons" or "Environment art, Props"
     image:      main picture OR video file name, or a YouTube link
     gallery:    more pictures/videos for the full view
     references: optional, shown under "Reference" in the full view
     featured:   true puts it in "Top picks" at the top */
  projects: [
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "purple-outfit-1.jpg", gallery: ["purple-outfit-2.jpg", "purple-outfit-3.jpg"], video: "", featured: false, references: [{ image: "purple-outfit-ref-1.jpg", credit: "Diavolo, JoJo's Bizarre Adventure" }] },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "hood-mask-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "hokage-robe-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "red-knight-1.jpg", gallery: [], video: "", featured: true, references: [{ image: "red-knight-ref-1.jpg", credit: "Igris, Solo Leveling" }] },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "straw-hat-cape-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "bloody-headband-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "tactical-mask-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "gear-cloak-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "flame-uniform-1.jpg", gallery: ["flame-uniform-2.jpg"], video: "", featured: true, references: [{ image: "flame-uniform-ref-1.jpg", credit: "Rengoku, Demon Slayer" }, { image: "flame-uniform-ref-2.jpg", credit: "Post-apocalypse AU concept, fan art" }] },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "hooded-cape-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "red-coat-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "layered-robe-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "skull-knight-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "purple-wrap-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "bat-samurai-helmet-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "fox-cloak-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "gold-armor-1.jpg", gallery: ["gold-armor-2.jpg", "gold-armor-3.jpg"], video: "", featured: false, references: [{ image: "gold-armor-ref-1.jpg", credit: "Asura, Asura's Wrath" }] },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics, Weapons", description: "", image: "viking-set-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Character Cosmetics, Weapons", description: "", image: "white-jacket-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Characters", description: "", image: "dante-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Characters", description: "", image: "wheel-robot-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Creatures", description: "", image: "dragon-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "blaster-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "jagged-sword-1.jpg", gallery: ["jagged-sword-2.jpg"], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "cleaver-sword-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "star-greatsword-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Vehicles", description: "", image: "dirt-bike-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Vehicles", description: "", image: "hoverbike-1.jpg", gallery: [], video: "", featured: true, references: [{ image: "hoverbike-ref-1.jpg", credit: "" }] },
    { title: "", style: "Stylized-Cel Shaded", category: "Environment art, Props", description: "", image: "train-interior-1.jpg", gallery: ["train-interior-2.jpg", "train-interior-3.jpg"], video: "", featured: true },
    { title: "", style: "Stylized-Cel Shaded", category: "Environment art, 3D art", description: "", image: "storage-room-1.jpg", gallery: ["storage-room-2.jpg"], video: "", featured: false },
    { title: "", style: "Stylized-Cel Shaded", category: "Environment art", description: "", image: "night-arena-1.jpg", gallery: [], video: "", featured: false, references: [{ image: "night-arena-ref-1.jpg", credit: "" }] },
    { title: "", style: "Realistic", category: "Character Cosmetics", description: "", image: "power-armor-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Realistic", category: "Character Cosmetics", description: "", image: "bronze-armor-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Realistic", category: "Character Cosmetics", description: "", image: "blue-helmet-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Realistic", category: "Weapons", description: "", image: "combat-knife-1.jpg", gallery: [], video: "", featured: false },
    { title: "", style: "Realistic", category: "Weapons", description: "", image: "scoped-blaster-1.jpg", gallery: [], video: "", featured: false }
  ]
};
