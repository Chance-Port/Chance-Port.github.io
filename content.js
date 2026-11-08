/* =========================================================
   CONTENT FILE: everything on the site comes from here.
   Edit text between the quotes, keep the commas.
   Easier way: open editor.html, change things, click
   "Download content.js", then upload it to GitHub.
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

  timeline: [
    { when: "2023", text: "Started building and environment art" },
    { when: "2024", text: "Started modeling in Blender" },
    { when: "Now", text: "Open for commissions and collaborations" }
  ],

  skills: [
    { group: "Software", items: ["Blender", "Substance Painter"] },
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

  /* PROJECTS
     image:   "images/my-render.jpg"  (upload the file into an images folder)
     gallery: ["images/a.jpg", "images/b.jpg"]  extra images, optional
     video:   "images/turntable.mp4" or a YouTube link, optional
     featured: true makes it a big panel at the top of the grid */
  projects: [
    { title: "Project 01", category: "3D art", description: "", image: "", gallery: [], video: "", link: "https://fixupx.com/Chancy2476/status/2117361917736173888", featured: true },
    { title: "Project 02", category: "3D art", description: "", image: "", gallery: [], video: "", link: "https://fixupx.com/Chancy2476/status/2113628601736184142", featured: false },
    { title: "Project 03", category: "3D art", description: "", image: "", gallery: [], video: "", link: "https://fixupx.com/Chancy2476/status/2113594323107516612", featured: false },
    { title: "Project 04", category: "3D art", description: "", image: "", gallery: [], video: "", link: "https://fixupx.com/Chancy2476/status/2112355569801531419", featured: true },
    { title: "Project 05", category: "3D art", description: "", image: "", gallery: [], video: "", link: "https://x.com/Chancy2476/status/2074144249428234703", featured: false },
    { title: "Project 06", category: "3D art", description: "", image: "", gallery: [], video: "", link: "https://x.com/Chancy2476/status/2071539801388396868", featured: false }
  ]
};
