alter table public.site_stats
  add column if not exists learning_data jsonb not null default '[
    {"title":"Cybersecurity","description":"Exploring penetration testing, network security, and ethical hacking fundamentals","icon":"network","progress":70},
    {"title":"AI / Machine Learning","description":"Understanding neural networks, deep learning concepts, and practical AI applications","icon":"brain","progress":45},
    {"title":"System Design","description":"Learning how to design scalable systems, microservices, and distributed architectures","icon":"database","progress":55},
    {"title":"Advanced Web Development","description":"Deepening knowledge in React, TypeScript, and modern web performance optimization","icon":"globe","progress":80}
  ]'::jsonb,
  add column if not exists skills_data jsonb not null default '[
    {"title":"Frontend","icon":"code2","skills":[{"name":"HTML/CSS","level":90},{"name":"JavaScript","level":85},{"name":"React","level":80},{"name":"TypeScript","level":75},{"name":"Tailwind CSS","level":85}]},
    {"title":"Backend","icon":"server","skills":[{"name":"Node.js","level":70},{"name":"Python","level":75},{"name":"PostgreSQL","level":65},{"name":"REST APIs","level":75}]},
    {"title":"Tools","icon":"wrench","skills":[{"name":"Git","level":85},{"name":"Linux","level":80},{"name":"Docker","level":60},{"name":"VS Code","level":90}]},
    {"title":"Security","icon":"shield","skills":[{"name":"Cybersecurity Basics","level":70},{"name":"Network Security","level":60},{"name":"Penetration Testing","level":55},{"name":"Security Best Practices","level":75}]}
  ]'::jsonb;