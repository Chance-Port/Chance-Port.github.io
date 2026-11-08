/* =========================================================
   CONTENT FILE: everything on the site comes from here.
   Easiest way to edit: open editor.html, change things,
   click "Download content.js", then upload it to GitHub.
   ========================================================= */

window.SITE = {
  profile: {
    name: "Chance",
    role: "3D artist",
    intro: "I make 3D assets, environments and models in Blender, from hard-surface props to stylized, hand-painted pieces.",
    age: "16",
    location: "Egypt",
    timezoneLabel: "EET, UTC+2",
    timeZone: "Africa/Cairo",
    bio: [
      "I'm Chance, a 16-year-old 3D artist from Egypt. I like making things that are interesting to look at: assets, environments and models with a clear look of their own.",
      "I've spent three years on building and environment art and two and a half years modeling in Blender. I'm adaptable and curious about other cultures, which helps whenever a project calls for a style I haven't tried yet.",
      "What matters most to me is that you're happy with the result. I take the time to understand what you want, keep you updated while I work, and deliver what we agreed on."
    ],
    facts: [
      { label: "Building & environment art", value: "3 years" },
      { label: "Modeling in Blender", value: "2.5 years" }
    ],
    process: [
      { title: "Understand", text: "We talk through what you need, the style and how it will be used." },
      { title: "Keep you posted", text: "You see progress as I go, so changes happen early, not at the end." },
      { title: "Deliver", text: "You get the finished work, matching what we agreed on." }
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
    contactTitle: "Have a model or scene in mind?",
    contactText: "I'm open to commissions and collaborations. Send me a message on Discord or X with what you need and we'll work it out from there.",
    heroButton1: "See my work",
    heroButton2: "Commission me"
  },

  timeline: [
    { when: "2023", text: "Started building and environment art" },
    { when: "2024", text: "Started modeling in Blender" },
    { when: "Now", text: "Open for commissions and collaborations" }
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

  /* PROJECTS (shown in this order)
     image:      main picture OR video: "render.jpg", "turntable.mp4" or a YouTube link
     gallery:    more pictures/videos for the full view
     category:   one or more, separated by commas: "Environment art, 3D art"
     references: optional, shown under "Reference" in the full view:
                 [{ image: "ref.jpg", credit: "Character, Game" }]
     featured:   true makes it a big frame
     Delete a whole { ... } line to remove a slot. */
  projects: [
    { title: "Project 05", category: "3D art", description: "", image: "flame-uniform-1.jpg", gallery: ["flame-uniform-2.jpg"], video: "", featured: false, references: [{ image: "flame-uniform-ref-1.jpg", credit: "Rengoku, Demon Slayer" }, { image: "flame-uniform-ref-2.jpg", credit: "Post-apocalypse AU concept, fan art" }] },
    { title: "Project 02", category: "Environment art", description: "", image: "night-arena-1.jpg", gallery: [], video: "", featured: false, references: [{ image: "night-arena-ref-1.jpg", credit: "" }] },
    { title: "Project 04", category: "Environment art, 3D art", description: "", image: "train-interior-1.jpg", gallery: ["train-interior-2.jpg", "train-interior-3.jpg"], video: "", featured: false },
    { title: "Project 01", category: "3D art", description: "", image: "gold-armor-1.jpg", gallery: ["gold-armor-2.jpg", "gold-armor-3.jpg"], video: "", featured: false, references: [{ image: "gold-armor-ref-1.jpg", credit: "Asura, Asura's Wrath" }] },
    { title: "Project 03", category: "3D art", description: "", image: "purple-outfit-1.jpg", gallery: ["purple-outfit-2.jpg", "purple-outfit-3.jpg"], video: "", featured: false, references: [{ image: "purple-outfit-ref-1.jpg", credit: "Diavolo, JoJo's Bizarre Adventure" }] },
    { title: "Project 06", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false },
    { title: "Project 07", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false },
    { title: "Project 08", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false },
    { title: "Project 09", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false },
    { title: "Project 10", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false },
    { title: "Project 11", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false },
    { title: "Project 12", category: "3D art", description: "", image: "", gallery: [], video: "", featured: false }
  ]
};
