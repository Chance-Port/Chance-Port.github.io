/* =========================================================
   CONTENT FILE: everything on the site comes from here.
   Easiest way to edit: open editor.html, change things,
   click "Download content.js", then upload it to GitHub.
   ========================================================= */

window.SITE = {
  profile: {
    name: "Chance",
    role: "3D artist",
    intro: "Armor, outfits, weapons and whole rooms, sculpted in Blender and painted by hand until they feel alive.",
    age: "16",
    location: "Egypt",
    timezoneLabel: "EET, UTC+2",
    timeZone: "Africa/Cairo",
    bio: [
      "Hey, I'm Chance. I'm 16, from Egypt, and I spend most of my time turning ideas into 3D: armor sets, wild weapons, little worlds you could walk into.",
      "I've been building environments for about 3 years and modeling in Blender for 2.5. I love painted looks with heavy ink lines, but I'll go realistic when a piece calls for it.",
      "Got a character, an outfit or a place stuck in your head? I'll help you get it out, and I'll keep you in the loop the whole way so it turns out how you pictured it."
    ],
    facts: [
      { label: "Building & environment art", value: "3 years" },
      { label: "Modeling in Blender", value: "2.5 years" }
    ],
    process: [
      { title: "Tell me your idea", text: "Send me what you're picturing: sketches, references, vibes, anything." },
      { title: "I keep you posted", text: "You'll see it come together as I go, so we can tweak stuff early." },
      { title: "You get your piece", text: "Finished, polished and how you pictured it." }
    ]
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
    howIWork: "How I work",
    soFar: "So far",
    skills: "Skills",
    contact: "Contact",
    contactTitle: "Got an idea? Let's make it.",
    contactText: "Hit me up on Discord or X with what you've got in mind and we'll figure it out together.",
    heroButton1: "Check out my work",
    heroButton2: "Contact me"
  },

  timeline: [
    { when: "2023", text: "Started building and environment art" },
    { when: "2024", text: "Started modeling in Blender" },
    { when: "Now", text: "Open for requests and collabs" }
  ],

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
     featured:   true makes it a big frame */
  projects: [
    { title: "Project 03", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "purple-outfit-1.jpg", gallery: ["purple-outfit-2.jpg", "purple-outfit-3.jpg"], video: "", featured: false, references: [{ image: "purple-outfit-ref-1.jpg", credit: "Diavolo, JoJo's Bizarre Adventure" }] },
    { title: "Project 16", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "hood-mask-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 11", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "hokage-robe-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 25", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "red-knight-1.jpg", gallery: [], video: "", featured: false, references: [{ image: "red-knight-ref-1.jpg", credit: "Igris, Solo Leveling" }] },
    { title: "Project 20", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "straw-hat-cape-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 18", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "bloody-headband-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 15", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "tactical-mask-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 12", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "gear-cloak-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 05", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "flame-uniform-1.jpg", gallery: ["flame-uniform-2.jpg"], video: "", featured: false, references: [{ image: "flame-uniform-ref-1.jpg", credit: "Rengoku, Demon Slayer" }, { image: "flame-uniform-ref-2.jpg", credit: "Post-apocalypse AU concept, fan art" }] },
    { title: "Project 08", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "hooded-cape-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 19", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "red-coat-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 28", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "layered-robe-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 17", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "skull-knight-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 26", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "purple-wrap-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 01", style: "Stylized-Cel Shaded", category: "Character Cosmetics", description: "", image: "gold-armor-1.jpg", gallery: ["gold-armor-2.jpg", "gold-armor-3.jpg"], video: "", featured: false, references: [{ image: "gold-armor-ref-1.jpg", credit: "Asura, Asura's Wrath" }] },
    { title: "Project 09", style: "Stylized-Cel Shaded", category: "Character Cosmetics, Weapons", description: "", image: "viking-set-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 23", style: "Stylized-Cel Shaded", category: "Character Cosmetics, Weapons", description: "", image: "white-jacket-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 10", style: "Stylized-Cel Shaded", category: "Characters", description: "", image: "dante-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 14", style: "Stylized-Cel Shaded", category: "Creatures", description: "", image: "dragon-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 07", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "blaster-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 24", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "jagged-sword-1.jpg", gallery: ["jagged-sword-2.jpg"], video: "", featured: false },
    { title: "Project 22", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "cleaver-sword-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 21", style: "Stylized-Cel Shaded", category: "Weapons", description: "", image: "star-greatsword-1.jpg", gallery: [], video: "", featured: false },
    { title: "Project 13", style: "Stylized-Cel Shaded", category: "Vehicles", description: "", image: "hoverbike-1.jpg", gallery: [], video: "", featured: false, references: [{ image: "hoverbike-ref-1.jpg", credit: "" }] },
    { title: "Project 04", style: "Stylized-Cel Shaded", category: "Environment art, Props", description: "", image: "train-interior-1.jpg", gallery: ["train-interior-2.jpg", "train-interior-3.jpg"], video: "", featured: false },
    { title: "Project 27", style: "Stylized-Cel Shaded", category: "Environment art, 3D art", description: "", image: "storage-room-1.jpg", gallery: ["storage-room-2.jpg"], video: "", featured: false },
    { title: "Project 02", style: "Stylized-Cel Shaded", category: "Environment art", description: "", image: "night-arena-1.jpg", gallery: [], video: "", featured: false, references: [{ image: "night-arena-ref-1.jpg", credit: "" }] },
    { title: "Project 06", style: "Realistic", category: "Character Cosmetics", description: "", image: "bronze-armor-1.jpg", gallery: [], video: "", featured: false }
  ]
};
