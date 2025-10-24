/* Uncensearch script.js
   Offline searchable knowledge browser with 125 preinstalled items.
   Features: case-insensitive, typo-tolerant fuzzy matching, suggestions, history, favorites, add/reset.
*/

const STORAGE_KEY = 'uncensearch_db_v1';
const META_KEY = 'uncensearch_meta_v1';

/* ---------- Preinstalled items (125 total) ---------- */
/* 25 original + 100 new (70 useful + 30 funny). Each item has id,title,tags,content */
const PREINSTALLED = [
  /* original 25 (IDs 1..25) */
  {id:"1", title:"How to make cookies", tags:["baking","cookies","dessert"], content:`<h3>How to make cookies</h3><p>Simple chocolate chip cookies: mix flour, sugar, butter, eggs, baking soda, pinch of salt. Stir in chocolate chips. Bake at 350°F (175°C) for ~10-12 minutes.</p>`},
  {id:"2", title:"How to make cake", tags:["baking","cake","dessert"], content:`<h3>How to make a basic cake</h3><p>Combine flour, sugar, eggs, butter, baking powder, milk. Bake at 350°F (175°C) for 25-35 minutes depending on pan size.</p>`},
  {id:"3", title:"Fixing a flat bicycle tire", tags:["bicycle","repair","maintenance"], content:`<h3>Fixing a flat bicycle tire</h3><p>Remove wheel, take out the tube, find puncture, patch or replace tube, re-install and inflate to recommended PSI.</p>`},
  {id:"4", title:"Basic first aid for cuts", tags:["first aid","health","safety"], content:`<h3>First aid for cuts</h3><p>Clean with water, apply pressure to stop bleeding, apply antiseptic, cover with bandage. Seek medical help if deep.</p>`},
  {id:"5", title:"Planting tomatoes", tags:["gardening","plants","tomatoes"], content:`<h3>Planting tomatoes</h3><p>Choose sunny spot, dig hole, use compost, plant deep, water regularly, stake plants as they grow.</p>`},
  {id:"6", title:"How to tie a tie", tags:["fashion","tie","clothing"], content:`<h3>How to tie a tie</h3><p>Common knot: the Four-in-Hand. Cross wide end over narrow, loop round, bring through and tighten.</p>`},
  {id:"7", title:"Changing a light bulb safely", tags:["home","safety","electric"], content:`<h3>Changing a light bulb</h3><p>Turn off power, let bulb cool, use correct wattage replacement, dispose broken glass safely.</p>`},
  {id:"8", title:"How to fry an egg", tags:["cooking","eggs","breakfast"], content:`<h3>How to fry an egg</h3><p>Heat pan, add butter or oil, crack egg gently, cook until whites set; for over-easy flip briefly.</p>`},
  {id:"9", title:"Simple budgeting for beginners", tags:["finance","budget","money"], content:`<h3>Simple budgeting</h3><p>Track income and expenses, set savings goal, use 50/30/20 rule as a starting point.</p>`},
  {id:"10", title:"How to start jogging", tags:["fitness","running","health"], content:`<h3>Starting to jog</h3><p>Begin with walk-run intervals, warm up, stretch, build up slowly to avoid injury.</p>`},
  {id:"11", title:"Basic HTML tutorial", tags:["coding","html","web"], content:`<h3>Basic HTML</h3><p>HTML uses tags like &lt;h1&gt;, &lt;p&gt;, &lt;a&gt; to structure content. Save files with .html extension.</p>`},
  {id:"12", title:"How to clean headphones", tags:["tech","cleaning","headphones"], content:`<h3>Cleaning headphones</h3><p>Use a soft brush, a dry cloth, and isopropyl alcohol on non-electrical parts. Do not submerge.</p>`},
  {id:"13", title:"Making instant ramen better", tags:["cooking","ramen","food hacks"], content:`<h3>Upgrade instant ramen</h3><p>Add egg, veggies, spices, and protein like leftover chicken to make it heartier.</p>`},
  {id:"14", title:"How to do push-ups", tags:["fitness","exercise","strength"], content:`<h3>Doing push-ups</h3><p>Keep body straight, hands shoulder-width, lower chest to a few inches off ground, push back up.</p>`},
  {id:"15", title:"How to change a tire (car)", tags:["auto","repair","car"], content:`<h3>Changing a car tire</h3><p>Use jack, loosen lug nuts, remove wheel, replace with spare, hand-tighten, lower car, torque nuts to spec.</p>`},
  {id:"16", title:"How to make lemonade", tags:["drinks","lemonade","cooking"], content:`<h3>Making lemonade</h3><p>Mix fresh lemon juice, water, and sugar to taste. Chill and serve with ice.</p>`},
  {id:"17", title:"How to fold a fitted sheet", tags:["home","laundry","tips"], content:`<h3>Folding a fitted sheet</h3><p>Find corners, tuck them together, fold into a neat rectangle, smooth and store.</p>`},
  {id:"18", title:"Reading a bus schedule", tags:["travel","transit","howto"], content:`<h3>Reading a bus schedule</h3><p>Identify route number, check timepoints and frequency, account for traffic and transfer times.</p>`},
  {id:"19", title:"How to make tea", tags:["drinks","tea","cooking"], content:`<h3>Making tea</h3><p>Boil water, steep tea leaves or bag for recommended time, remove leaves, enjoy.</p>`},
  {id:"20", title:"Intro to bicycle safety", tags:["safety","bicycle","transport"], content:`<h3>Bicycle safety</h3><p>Wear a helmet, use lights, follow traffic rules, signal turns, check brakes.</p>`},
  {id:"21", title:"How to shave safely", tags:["grooming","shave","personal care"], content:`<h3>Shaving safely</h3><p>Use warm water, shaving cream, sharp blade, shave with grain and moisturize after.</p>`},
  {id:"22", title:"How to make pancakes", tags:["cooking","pancakes","breakfast"], content:`<h3>Making pancakes</h3><p>Mix flour, milk, eggs, baking powder; pour batter on hot griddle, flip when bubbles form.</p>`},
  {id:"23", title:"How to tie shoelaces", tags:["life skills","shoes","kids"], content:`<h3>Tying shoelaces</h3><p>Make 'bunny ears' or standard knot and loop to finish; practice makes it fast.</p>`},
  {id:"24", title:"How to change a password", tags:["tech","security","password"], content:`<h3>Changing a password</h3><p>Use the account security settings page, choose a strong unique password and enable 2FA if available.</p>`},
  {id:"25", title:"How to make scrambled eggs", tags:["cooking","eggs","breakfast"], content:`<h3>Scrambled eggs</h3><p>Whisk eggs, add milk/cream if desired, cook in a pan over medium-low heat stirring gently until curds form.</p>`},

  /* new 100: 70 useful (26..95) and 30 funny (96..125) */
  {id:"26", title:"How to bake banana bread", tags:["baking","bread","banana"], content:`<h3>Banana bread</h3><p>Use ripe bananas, flour, sugar, eggs, baking soda and butter. Bake at 350°F for ~50-60 minutes depending on pan.</p>`},
  {id:"27", title:"How to make french toast", tags:["breakfast","cooking","toast"], content:`<h3>French toast</h3><p>Dip slices in egg-milk mixture, fry in butter until golden, serve with syrup.</p>`},
  {id:"28", title:"How to clean sneakers", tags:["cleaning","shoes","care"], content:`<h3>Cleaning sneakers</h3><p>Remove laces, brush off dirt, use mild soap & water, air dry. Use a magic eraser for white soles.</p>`},
  {id:"29", title:"How to grow tomatoes", tags:["gardening","plants","tomatoes"], content:`<h3>Grow tomatoes</h3><p>Start seeds indoors, transplant after last frost, full sun, regular watering and staking.</p>`},
  {id:"30", title:"How to save money fast", tags:["finance","savings","money"], content:`<h3>Save money fast</h3><p>Cut nonessential spending, set automatic transfers, sell unused items, make a short-term goal.</p>`},
  {id:"31", title:"Best workout for abs", tags:["fitness","abs","workout"], content:`<h3>Abs workout</h3><p>Include planks, leg raises, bicycle crunches, and compound moves; consistency matters more than any single exercise.</p>`},
  {id:"32", title:"Easy dinner recipes", tags:["cooking","recipes","dinner"], content:`<h3>Easy dinners</h3><p>One-pan pasta, stir-fry, sheet-pan chicken and veggies, quesadillas — quick and tasty.</p>`},
  {id:"33", title:"How to train your dog", tags:["pets","dog","training"], content:`<h3>Dog training</h3><p>Use positive reinforcement, short sessions, consistency, and reward desired behavior.</p>`},
  {id:"34", title:"Best study tips for exams", tags:["study","school","tips"], content:`<h3>Study tips</h3><p>Active recall, spaced repetition, practice tests, teach someone else, remove distractions.</p>`},
  {id:"35", title:"How to fix slow wifi", tags:["tech","wifi","troubleshoot"], content:`<h3>Fix slow Wi-Fi</h3><p>Restart router, update firmware, move router central, reduce interference, consider wired connection or mesh network.</p>`},
  {id:"36", title:"How to cook rice perfectly", tags:["cooking","rice","howto"], content:`<h3>Perfect rice</h3><p>Rinse, use correct water ratio (often 1:1.5 or 1:2), simmer covered, let rest off heat before fluffing.</p>`},
  {id:"37", title:"How to build muscle at home", tags:["fitness","strength","home"], content:`<h3>Build muscle at home</h3><p>Progressive overload, bodyweight or dumbbell exercises, protein intake, recovery and sleep.</p>`},
  {id:"38", title:"How to stop procrastinating", tags:["self help","productivity"], content:`<h3>Stop procrastinating</h3><p>Break tasks into small steps, use timers (Pomodoro), remove distractions, set deadlines and rewards.</p>`},
  {id:"39", title:"How to organize your room", tags:["organization","home","tips"], content:`<h3>Organize your room</h3><p>Declutter, sort items into keep/donate/trash, group similar items, use storage bins and labels.</p>`},
  {id:"40", title:"How to fall asleep faster", tags:["sleep","health","tips"], content:`<h3>Fall asleep faster</h3><p>Maintain consistent schedule, reduce screens before bed, create a relaxing routine, avoid caffeine late.</p>`},
  {id:"41", title:"How to make slime", tags:["crafts","slime","kids"], content:`<h3>Make slime</h3><p>Common mix: glue + baking soda + contact lens solution (borate). Follow safety guidelines and avoid ingestion.</p>`},
  {id:"42", title:"How to stay motivated", tags:["motivation","self help"], content:`<h3>Stay motivated</h3><p>Set small wins, track progress, get accountability, vary tasks to keep interest high.</p>`},
  {id:"43", title:"How to draw a realistic face", tags:["art","drawing","tutorial"], content:`<h3>Draw a realistic face</h3><p>Use facial proportion guidelines, map features, pay attention to light/shadow, practice shading.</p>`},
  {id:"44", title:"How to paint a room", tags:["home","diy","painting"], content:`<h3>Paint a room</h3><p>Prep walls, tape edges, use primer if needed, apply 2 coats, ventilate while painting.</p>`},
  {id:"45", title:"How to start a garden", tags:["gardening","plants","beginner"], content:`<h3>Start a garden</h3><p>Choose location, check soil, start with easy plants, water and mulch, learn seasonality.</p>`},
  {id:"46", title:"How to do laundry", tags:["home","laundry","howto"], content:`<h3>Do laundry</h3><p>Sort by color, use appropriate detergent and temperature, avoid overloading, follow care labels.</p>`},
  {id:"47", title:"How to boil eggs", tags:["cooking","eggs","breakfast"], content:`<h3>Boil eggs</h3><p>Bring to gentle boil, then simmer 7-12 minutes depending on desired yolk doneness; cool in ice bath.</p>`},
  {id:"48", title:"How to budget your money", tags:["finance","budget","money"], content:`<h3>Budgeting</h3><p>Track all income/expenses, set categories and limits, automate savings and adjust monthly.</p>`},
  {id:"49", title:"How to clean a keyboard", tags:["tech","cleaning","keyboard"], content:`<h3>Clean keyboard</h3><p>Turn off device, use compressed air, clean keycaps with mild soap, use isopropyl on non-electrical parts.</p>`},
  {id:"50", title:"How to recycle properly", tags:["environment","recycle","tips"], content:`<h3>Recycle properly</h3><p>Rinse containers, know local rules, flatten cardboard, don't bag recyclables unless required.</p>`},
  {id:"51", title:"How to write an essay", tags:["writing","school","essay"], content:`<h3>Write an essay</h3><p>Plan thesis, outline structure, support points with evidence, proofread and edit for clarity.</p>`},
  {id:"52", title:"How to learn guitar", tags:["music","guitar","learning"], content:`<h3>Learn guitar</h3><p>Start with basic chords, practice daily, use a metronome, learn songs you enjoy, slowly add techniques.</p>`},
  {id:"53", title:"How to take better photos", tags:["photography","tips","camera"], content:`<h3>Take better photos</h3><p>Mind composition, lighting, focus, and post-processing. Practice framing and exposure control.</p>`},
  {id:"54", title:"How to make pizza dough", tags:["cooking","pizza","dough"], content:`<h3>Pizza dough</h3><p>Use flour, water, yeast, salt, knead, proof until doubled, shape and bake hot for crisp crust.</p>`},
  {id:"55", title:"How to improve handwriting", tags:["writing","practice","handwriting"], content:`<h3>Improve handwriting</h3><p>Slow down, use guides, practice letter forms and consistent spacing, try different pens/pencils.</p>`},
  {id:"56", title:"How to cook pasta", tags:["cooking","pasta","dinner"], content:`<h3>Cook pasta</h3><p>Use plenty of salted boiling water, follow package time, taste for al dente, reserve pasta water for sauce.</p>`},
  {id:"57", title:"How to iron clothes", tags:["laundry","iron","clothes"], content:`<h3>Iron clothes</h3><p>Check fabric settings, use steam for stubborn wrinkles, iron inside-out for delicate fabrics.</p>`},
  {id:"58", title:"How to study effectively", tags:["study","learning","tips"], content:`<h3>Study effectively</h3><p>Active recall, spaced repetition, teach what you learn, use practice problems and timed practice.</p>`},
  {id:"59", title:"How to make friends", tags:["social","advice","friends"], content:`<h3>Make friends</h3><p>Be curious, join groups, be consistent, listen more than talk, offer help and shared experiences.</p>`},
  {id:"60", title:"How to install Windows 11", tags:["tech","windows","install"], content:`<h3>Install Windows 11</h3><p>Check system requirements, back up data, create installation media, boot and follow setup prompts.</p>`},
  {id:"61", title:"How to use ChatGPT", tags:["ai","chatgpt","guide"], content:`<h3>Using ChatGPT</h3><p>Ask clear questions, provide context, iterate on replies, use system/instruction prompts for better results.</p>`},
  {id:"62", title:"How to build a PC", tags:["pc","build","hardware"], content:`<h3>Build a PC</h3><p>Plan parts compatibility, ground yourself, install CPU/RAM, mount motherboard, connect cables, test before closing case.</p>`},
  {id:"63", title:"How to fix a leaky faucet", tags:["plumbing","repair","home"], content:`<h3>Fix leaky faucet</h3><p>Turn off water, disassemble faucet, replace O-rings or cartridges, reassemble and test.</p>`},
  {id:"64", title:"How to plan a trip", tags:["travel","planning","trip"], content:`<h3>Plan a trip</h3><p>Choose dates, research destinations, book transport & lodging, create rough itinerary and budget.</p>`},
  {id:"65", title:"How to get better at math", tags:["education","math","learning"], content:`<h3>Get better at math</h3><p>Practice fundamentals, do lots of problems, review mistakes, use stepwise understanding and tutoring if needed.</p>`},
  {id:"66", title:"How to make cold brew coffee", tags:["coffee","drinks","cold brew"], content:`<h3>Cold brew</h3><p>Coarse grind coffee, steep in cold water 12-24 hours, strain and dilute to taste.</p>`},
  {id:"67", title:"How to meditate", tags:["mental health","meditation","wellness"], content:`<h3>Meditate</h3><p>Find quiet place, focus on breath, start short sessions, be consistent and gentle with wandering thoughts.</p>`},
  {id:"68", title:"How to reduce stress", tags:["wellness","stress","mental health"], content:`<h3>Reduce stress</h3><p>Use exercise, sleep, time-management, breaks, and talking to someone you trust.</p>`},
  {id:"69", title:"How to back up files", tags:["tech","backup","storage"], content:`<h3>Back up files</h3><p>Use external drives, cloud backups, or both. Automate backups and test restores periodically.</p>`},
  {id:"70", title:"How to clear browser cache", tags:["tech","browser","troubleshoot"], content:`<h3>Clear cache</h3><p>Open browser settings -> privacy -> clear browsing data -> choose cached images/files and clear.</p>`},
  {id:"71", title:"How to get rid of fruit flies", tags:["home","pest control","tips"], content:`<h3>Fruit flies</h3><p>Remove attractants, clean drains, use apple-cider-vinegar traps, store produce in fridge.</p>`},
  {id:"72", title:"How to build a resume", tags:["career","resume","job"], content:`<h3>Build a resume</h3><p>Concise summary, highlight achievements quantified by numbers, tailor to job and proofread carefully.</p>`},
  {id:"73", title:"How to cook steak", tags:["cooking","steak","meat"], content:`<h3>Cook steak</h3><p>Bring to room temp, season, sear in hot pan or grill, use thermometer for desired doneness, rest before slicing.</p>`},
  {id:"74", title:"How to change your password", tags:["tech","security","password"], content:`<h3>Change password</h3><p>Use account settings, create a strong unique pass, enable two-factor authentication if available.</p>`},
  {id:"75", title:"How to create a website", tags:["web","coding","website"], content:`<h3>Create a website</h3><p>Pick hosting & domain, design pages (HTML/CSS/JS), or use site builders; test on multiple devices.</p>`},
  {id:"76", title:"How to start investing", tags:["finance","investing","beginners"], content:`<h3>Start investing</h3><p>Set goals, build emergency fund, learn basics (index funds, diversification), start small and be consistent.</p>`},
  {id:"77", title:"How to read faster", tags:["reading","skills","speed"], content:`<h3>Read faster</h3><p>Practice chunking, reduce subvocalization, use guides and timed practice with comprehension checks.</p>`},
  {id:"78", title:"How to manage time", tags:["productivity","time","planning"], content:`<h3>Manage time</h3><p>Use a calendar, prioritize tasks, set time blocks, and review weekly to adjust plans.</p>`},
  {id:"79", title:"How to do pushups", tags:["fitness","exercise","strength"], content:`<h3>Pushups</h3><p>Form matters: straight body, hands under shoulders; scale with knees or incline if needed.</p>`},
  {id:"80", title:"How to make iced coffee", tags:["coffee","drinks","iced"], content:`<h3>Iced coffee</h3><p>Brew strong coffee, chill, pour over ice, add milk or sweetener to taste.</p>`},
  {id:"81", title:"How to get a job", tags:["career","jobs","interview"], content:`<h3>Get a job</h3><p>Tailor resume & cover letter, network, prepare for interviews, follow up after interviews.</p>`},
  {id:"82", title:"How to start a YouTube channel", tags:["youtube","content","video"], content:`<h3>Start a YouTube channel</h3><p>Pick niche, plan consistent content, learn basic editing, optimize titles/thumbnails, engage audience.</p>`},
  {id:"83", title:"How to take care of skin", tags:["grooming","skin","health"], content:`<h3>Skin care</h3><p>Cleanse, moisturize, use sunscreen daily, avoid harsh products, be consistent with routine.</p>`},
  {id:"84", title:"How to make a sandwich", tags:["cooking","sandwich","food"], content:`<h3>Make a sandwich</h3><p>Pick bread, spread condiments, layer proteins & veggies, toast for extra texture if desired.</p>`},
  {id:"85", title:"How to stop biting nails", tags:["habits","health","nail care"], content:`<h3>Stop biting nails</h3><p>Keep nails trimmed, use bitter nail polish, replace habit with fidget toy, use reminders and rewards.</p>`},
  {id:"86", title:"How to clean your phone", tags:["tech","cleaning","phone"], content:`<h3>Clean phone</h3><p>Use a microfiber cloth, isopropyl wipes for hardened grime, avoid liquids in ports.</p>`},
  {id:"87", title:"How to fix screen lag", tags:["tech","troubleshoot","performance"], content:`<h3>Fix screen lag</h3><p>Close background apps, clear storage, update drivers, restart device, check for overheating.</p>`},
  {id:"88", title:"How to protect your privacy online", tags:["privacy","security","online"], content:`<h3>Protect privacy</h3><p>Use strong passwords, 2FA, limit permissions, use VPN on public Wi-Fi, check app privacy settings.</p>`},
  {id:"89", title:"How to stretch after running", tags:["fitness","stretching","running"], content:`<h3>Stretch after running</h3><p>Do dynamic stretches and foam rolling focusing on calves, quads, hamstrings and hips for recovery.</p>`},
  {id:"90", title:"How to make oatmeal", tags:["breakfast","oatmeal","cooking"], content:`<h3>Make oatmeal</h3><p>Use rolled oats and water/milk, cook until creamy, add toppings like fruit, nuts, or honey.</p>`},
  {id:"91", title:"How to write a thank you note", tags:["etiquette","writing","thankyou"], content:`<h3>Write a thank-you note</h3><p>Be specific about what you appreciate, be sincere, keep it short and hand-sign when possible.</p>`},

  /* funny/random (96..125) */
  {id:"92", title:"Why cats knock stuff over", tags:["cats","funny","behavior"], content:`<h3>Why cats knock stuff over</h3><p>Often curiosity and play, testing cause & effect, or simply because your cat finds it amusing. Provide enrichment toys to reduce it.</p>`},
  {id:"93", title:"Why am I always hungry", tags:["health","hunger","food"], content:`<h3>Always hungry</h3><p>Check meal balance (protein/fiber), sleep, stress, and hydration. Rule out medical causes with a doctor if needed.</p>`},
  {id:"94", title:"How to talk to pigeons", tags:["funny","birds","pigeons"], content:`<h3>Talk to pigeons</h3><p>Pretend to coo and offer safe food (sparingly). Real pigeons respond to consistent feeding spots.</p>`},
  {id:"95", title:"Is water wet", tags:["philosophy","funny"], content:`<h3>Is water wet?</h3><p>Philosophical debate: water makes things wet, but whether water itself is 'wet' depends on definitions. Fun to argue!</p>`},
  {id:"96", title:"How to make a paper crown", tags:["crafts","paper","kids"], content:`<h3>Paper crown</h3><p>Cut strips, staple/glue into loops, decorate with markers or stickers.</p>`},
  {id:"97", title:"How to become famous overnight", tags:["funny","goals"], content:`<h3>Become famous overnight</h3><p>No guaranteed method; focus on creating great content, luck, and persistence. Don't rely on overnight fame.</p>`},
  {id:"98", title:"How to survive a zombie apocalypse", tags:["funny","survival"], content:`<h3>Zombie apocalypse</h3><p>Serious survival basics help: shelter, water, food, first aid, and staying informed — plus imagination.</p>`},
  {id:"99", title:"How to make a sandwich look fancy", tags:["food","funny","presentation"], content:`<h3>Fancy sandwich</h3><p>Use fresh herbs, toasted bread, cut diagonally, add colorful veggies and garnish with microgreens.</p>`},
  {id:"100", title:"Do fish sleep", tags:["animals","fish","science"], content:`<h3>Do fish sleep?</h3><p>Many fish enter rest states with reduced activity. Sleep looks different across species compared to mammals.</p>`},
  {id:"101", title:"How to fake being a morning person", tags:["funny","habits"], content:`<h3>Fake morning person</h3><p>Prep the night before, use bright lights, set routines and small morning wins to appear (and become) morning-friendly.</p>`},
  {id:"102", title:"Why dogs tilt their heads", tags:["dogs","behavior","funny"], content:`<h3>Dog head tilt</h3><p>Dogs tilt to better hear or to read human expressions — and because humans find it adorable and respond positively.</p>`},
  {id:"103", title:"How to make your toast perfect", tags:["breakfast","bread","funny"], content:`<h3>Perfect toast</h3><p>Use even slices, preheat toaster/pan, flip if needed, and test timing for your preferred crispness.</p>`},
  {id:"104", title:"How to get a potato to follow you", tags:["funny","random"], content:`<h3>Potato follower</h3><p>Potatoes do not follow, but you can roll one. This query is delightful and silly.</p>`},
  {id:"105", title:"Why is my fridge making weird noises", tags:["appliances","home","troubleshoot"], content:`<h3>Fridge noises</h3><p>Possible causes: fan, compressor, or ice maker. Check for obstructions, leveling, and call a technician if persistent.</p>`},
  {id:"106", title:"How to win an argument with a toddler", tags:["funny","parenting"], content:`<h3>Argue with a toddler</h3><p>You don't — redirect, offer choices, stay calm, and pick your battles. Humor helps.</p>`},
  {id:"107", title:"How to become a wizard", tags:["funny","fantasy"], content:`<h3>Become a wizard</h3><p>Study imagination, read fantasy, learn stage magic and sleight of hand — real-world wizardry is practice & creativity.</p>`},
  {id:"108", title:"How to convince your cat to love you", tags:["cats","pets","funny"], content:`<h3>Convince your cat</h3><p>Respect boundaries, offer treats, gentle petting, play sessions, and let the cat come to you.</p>`},
  {id:"109", title:"How to dance like nobody's watching", tags:["dance","confidence","funny"], content:`<h3>Dance freely</h3><p>Let go of judgment, practice silly moves, use music you love, and focus on feeling over technique.</p>`},
  {id:"110", title:"How to draw a meme face", tags:["art","memes","drawing"], content:`<h3>Meme face</h3><p>Start with exaggerated features and simple lines. Look at references and simplify shapes for comedic effect.</p>`},
  {id:"111", title:"Why am I like this", tags:["funny","introspection"], content:`<h3>Why am I like this?</h3><p>Short answer: human. A longer answer involves habits, personality, environment — reflect and make small changes if desired.</p>`},
  {id:"112", title:"How to speak like a pirate", tags:["funny","language"], content:`<h3>Pirate talk</h3><p>Use 'Arr', 'matey', 'avast', drop some R's and embrace dramatic intonation. Fun for costumes and jokes.</p>`},
  {id:"113", title:"How to prank your best friend", tags:["funny","prank"], content:`<h3>Prank ideas</h3><p>Keep pranks harmless and reversible: fake bugs, swapped phone wallpaper, or silly surprises. Respect boundaries.</p>`},
  {id:"114", title:"How to build a fort", tags:["kids","fun","fort"], content:`<h3>Build a fort</h3><p>Use blankets, chairs, string lights, and pillows. Make an entrance and a cozy interior for maximum fun.</p>`},
  {id:"115", title:"Why do onions make you cry", tags:["cooking","science"], content:`<h3>Onions make you cry</h3><p>Onions release sulfur compounds that convert to irritating gases; they react with your eyes causing tears.</p>`},
  {id:"116", title:"How to find the best memes", tags:["funny","memes","internet"], content:`<h3>Find memes</h3><p>Follow meme accounts, check aggregator sites and social platforms, and save favorites for reuse.</p>`},
  {id:"117", title:"How to make a time machine (jk)", tags:["funny","science"], content:`<h3>Time machine (jk)</h3><p>Time travel remains science fiction; enjoy stories that explore it and learn physics for a deeper appreciation.</p>`},
  {id:"118", title:"How to survive without Wi-Fi", tags:["life skills","funny"], content:`<h3>Survive without Wi-Fi</h3><p>Read, play board games, do outdoor activities, plan offline hobbies and use mobile data if needed.</p>`},
  {id:"119", title:"How to stop saying 'bro' every sentence", tags:["habits","funny"], content:`<h3>Stop saying 'bro'</h3><p>Practice awareness, substitute other words or pauses, and get feedback from friends.</p>`},
  {id:"120", title:"How to look cool without trying", tags:["style","confidence","funny"], content:`<h3>Look cool without trying</h3><p>Confidence, good hygiene, and relaxed posture go a long way. Be kind — it's the best look.</p>`},
  {id:"121", title:"How to make a rubber band guitar", tags:["crafts","music","funny"], content:`<h3>Rubber band guitar</h3><p>Stretch rubber bands across an empty box, pluck to experiment with tension and pitch.</p>`},
  {id:"122", title:"How to make waffles", tags:["breakfast","baking","fun"], content:`<h3>Make waffles</h3><p>Use waffle batter, preheat waffle iron, cook until golden and crisp. Serve with toppings.</p>`},
  {id:"123", title:"How to fix a jammed zipper", tags:["clothing","repair","tips"], content:`<h3>Fix zipper</h3><p>Lubricate with graphite or soap, realign teeth, carefully work slider; replace slider if damaged.</p>`},
  {id:"124", title:"How to pack a backpack for a day trip", tags:["travel","packing","tips"], content:`<h3>Pack a daypack</h3><p>Include water, snacks, first aid, layers, map/phone, and portable charger. Keep essentials accessible.</p>`},
  {id:"125", title:"How to make cold pizza tasty", tags:["food hacks","funny"], content:`<h3>Cold pizza hacks</h3><p>Add olive oil, fresh herbs, reheat in oven or skillet for crispness, or top with fresh veggies and hot sauce.</p>`}
];

/* ---------- Persistence (localStorage) ---------- */
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    const metaRaw = localStorage.getItem(META_KEY);
    const items = raw ? JSON.parse(raw) : PREINSTALLED.slice();
    const meta = metaRaw ? JSON.parse(metaRaw) : {history:[], favorites:[]};
    return {items, meta};
  }catch(e){
    console.error('load error', e);
    return {items: PREINSTALLED.slice(), meta:{history:[],favorites:[]}};
  }
}
function saveState(items, meta){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

/* ---------- Utilities and fuzzy functions ---------- */
function normalize(s){ return (s||'').toString().trim().toLowerCase(); }

/* Levenshtein distance */
function levenshtein(a,b){
  a = a||''; b = b||'';
  if(a===b) return 0;
  const al=a.length, bl=b.length;
  if(al===0) return bl;
  if(bl===0) return al;
  let v0 = new Array(bl+1), v1 = new Array(bl+1);
  for(let j=0;j<=bl;j++) v0[j]=j;
  for(let i=0;i<al;i++){
    v1[0]=i+1;
    for(let j=0;j<bl;j++){
      const cost = (a[i]===b[j])?0:1;
      v1[j+1] = Math.min(v1[j]+1, v0[j+1]+1, v0[j]+cost);
    }
    [v0,v1]=[v1,v0];
  }
  return v0[bl];
}
function similarity(a,b){
  a=normalize(a); b=normalize(b);
  if(a.length===0 && b.length===0) return 1;
  const d = levenshtein(a,b);
  const maxl = Math.max(a.length,b.length) || 1;
  return 1 - (d / maxl);
}
function fuzzyScore(query, target){
  const q = normalize(query), t = normalize(target);
  if(q.length===0) return 0;
  if(t.includes(q)) {
    return 0.9 + (q.length / (t.length + 4)) * 0.09;
  }
  const sim = similarity(q,t);
  const qwords = q.split(/\s+/).filter(Boolean);
  let wordBoost = 0;
  for(const w of qwords) if(t.includes(w)) wordBoost += 0.06;
  return Math.min(1, sim * 0.95 + wordBoost);
}

/* debounce */
function debounce(fn, wait=160){
  let t;
  return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); };
}

/* ---------- App state & rendering ---------- */
let {items, meta} = loadState();
document.getElementById('count-badge').textContent = items.length;

const prelist = document.getElementById('prelist');
const historyEl = document.getElementById('history');
const favoritesEl = document.getElementById('favorites');
const mainTitle = document.getElementById('mainTitle');
const mainBody = document.getElementById('mainBody');
const searchBox = document.getElementById('searchBox');
const suggestionsEl = document.getElementById('suggestions');

function renderPrelist(){
  prelist.innerHTML = '';
  items.slice(0, 200).forEach(it=>{
    const wrap = document.createElement('div');
    wrap.className = 'item';
    wrap.innerHTML = `<div class="title">${it.title}</div><div class="muted">${(it.tags||[]).join(', ')}</div>`;
    wrap.onclick = ()=>renderItem(it.id);
    prelist.appendChild(wrap);
  });
}
function renderHistory(){
  historyEl.innerHTML = '';
  (meta.history || []).slice().reverse().slice(0,20).forEach(h=>{
    const d = document.createElement('div');
    d.className = 'item';
    d.style.fontSize = '13px';
    d.textContent = h;
    d.onclick = ()=>{ searchBox.value = h; performSearch(h); };
    historyEl.appendChild(d);
  });
  if((meta.history||[]).length===0) historyEl.innerHTML = '<div class="muted">No searches yet.</div>';
}
function renderFavorites(){
  favoritesEl.innerHTML = '';
  (meta.favorites||[]).forEach(id=>{
    const it = items.find(x=>x.id===id);
    if(!it) return;
    const d = document.createElement('div');
    d.className = 'item';
    d.innerHTML = `<div class="title">${it.title}</div><div class="muted">${(it.tags||[]).join(', ')}</div>`;
    d.onclick = ()=>renderItem(it.id);
    favoritesEl.appendChild(d);
  });
  if((meta.favorites||[]).length===0) favoritesEl.innerHTML = '<div class="muted">No favorites yet.</div>';
}

function renderItem(id){
  const it = items.find(x=>x.id===id);
  if(!it) return showNoResults('Item not found.');
  mainTitle.textContent = it.title;
  mainBody.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
      <div>
        <div style="margin-bottom:8px">${(it.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div>${it.content || '<p>No content.</p>'}</div>
      </div>
      <div style="min-width:160px">
        <div class="actions">
          <button id="favBtn">${meta.favorites && meta.favorites.includes(id) ? '★ Unfavorite' : '☆ Favorite'}</button>
          <button id="openBtn">Open in new tab</button>
        </div>
        <div style="margin-top:12px" class="muted">ID: ${id}</div>
      </div>
    </div>
  `;
  document.getElementById('favBtn').onclick = ()=>{
    toggleFavorite(id);
    renderFavorites();
    renderItem(id);
  };
  document.getElementById('openBtn').onclick = ()=>{
    const html = `<!doctype html><meta charset="utf-8"><title>${escapeHtml(it.title)}</title><body style="font-family:system-ui,Arial;padding:20px">${it.content}</body>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(()=>URL.revokeObjectURL(url), 60000);
  };
  addToHistory(it.title);
}

function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function showNoResults(msg){ mainTitle.textContent = 'No results'; mainBody.innerHTML = `<div class="no-results">${msg}</div>`; }

/* ---------- Search logic ---------- */
function searchItems(query){
  const q = normalize(query);
  if(!q) return [];
  const scored = items.map(it=>{
    const t = it.title || '';
    const tags = (it.tags||[]).join(' ');
    const contentPreview = (it.content||'').replace(/<[^>]*>/g,' ').slice(0,200);
    const titleScore = fuzzyScore(q, t) * 1.0;
    const tagScore = fuzzyScore(q, tags) * 0.75;
    const contentScore = fuzzyScore(q, contentPreview) * 0.45;
    const best = Math.max(titleScore, tagScore, contentScore);
    return {item:it, score:best};
  }).filter(s=>s.score > 0.12).sort((a,b)=>b.score - a.score);
  return scored;
}
function findBestMatch(query){
  const results = searchItems(query);
  if(results.length===0) return {exact:null, similar:[]};
  const top = results[0];
  const q = normalize(query);
  const isExact = normalize(top.item.title).includes(q) || top.score >= 0.88;
  const similar = results.slice(0,8).map(r=>({id:r.item.id,title:r.item.title,score:Math.round(r.score*100)/100}));
  return {exact: (isExact ? top.item : null), similar};
}

/* ---------- Suggestions UI ---------- */
let suggestionIndex = -1;
let currentSuggestions = [];

function showSuggestions(query){
  const q = query || '';
  if(!q){ suggestionsEl.hidden = true; return; }
  const scored = searchItems(q).slice(0,12);
  if(scored.length===0){ suggestionsEl.hidden = true; currentSuggestions=[]; return; }
  suggestionsEl.innerHTML = '';
  currentSuggestions = scored.map(s=>s.item);
  scored.forEach((s, idx)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div style="font-weight:600">${s.item.title}</div><div class="muted" style="font-size:12px">${(s.item.tags||[]).join(', ')}</div>`;
    li.onmouseenter = ()=>{ suggestionIndex = idx; highlightSuggestion(); };
    li.onclick = ()=>{ chooseSuggestion(idx); };
    suggestionsEl.appendChild(li);
  });
  suggestionIndex = -1;
  highlightSuggestion();
  suggestionsEl.hidden = false;
}
function hideSuggestions(){ suggestionsEl.hidden = true; suggestionIndex=-1; currentSuggestions=[]; }
function highlightSuggestion(){
  const lis = suggestionsEl.querySelectorAll('li');
  lis.forEach((li,i)=>li.style.background = (i===suggestionIndex) ? 'rgba(255,255,255,0.02)' : 'transparent');
}
function chooseSuggestion(idx){
  const it = currentSuggestions[idx];
  if(!it) return;
  searchBox.value = it.title;
  performSearch(it.title);
  hideSuggestions();
}

/* performSearch invoked by Enter or Search button */
function performSearch(query){
  const q = (query===undefined) ? searchBox.value : query;
  const {exact, similar} = findBestMatch(q);
  addToHistory(q);
  renderHistory();
  if(exact){
    renderItem(exact.id);
  } else {
    if(similar.length===0){
      showNoResults(`We don't have "${escapeHtml(q)}" in the database.`);
    } else {
      mainTitle.textContent = `We don't have "${q}" — maybe you mean:`;
      mainBody.innerHTML = `<div class="no-results"><p class="muted">No exact match found. Try these:</p>
        <div style="margin-top:10px">${similar.map(s=>`<div class="item" style="cursor:pointer" data-id="${s.id}"><div class="title">${s.title}</div><div class="muted">score: ${s.score}</div></div>`).join('')}</div></div>`;
      mainBody.querySelectorAll('.item').forEach(el=>{
        el.onclick = ()=>{ renderItem(el.dataset.id); };
      });
    }
  }
  updateMetaBadge();
}

/* ---------- History, favorites, meta ---------- */
function addToHistory(q){
  if(!q || !q.trim()) return;
  meta.history = meta.history || [];
  meta.history.push(q);
  if(meta.history.length > 200) meta.history = meta.history.slice(meta.history.length-200);
  saveState(items, meta);
}
function toggleFavorite(id){
  meta.favorites = meta.favorites || [];
  if(meta.favorites.includes(id)) meta.favorites = meta.favorites.filter(x=>x!==id);
  else meta.favorites.push(id);
  saveState(items, meta);
}
function updateMetaBadge(){
  document.getElementById('count-badge').textContent = items.length;
  saveState(items, meta);
}

/* ---------- Add / Reset handlers ---------- */
document.getElementById('addBtn').onclick = ()=>{
  const title = prompt('Title for new item (e.g. "How to make waffles")');
  if(!title) return;
  const tags = prompt('Tags (comma separated)', 'misc');
  const content = prompt('HTML content (you can paste formatted HTML or plain text). Keep short for offline use:', `<h3>${title}</h3><p>Notes...</p>`);
  const id = String(Date.now());
  items.unshift({id, title:title.trim(), tags: tags ? tags.split(',').map(s=>s.trim()).filter(Boolean) : [], content: content || ''});
  saveState(items, meta);
  renderPrelist();
  renderFavorites();
  updateMetaBadge();
  alert('Item added and saved locally.');
};

document.getElementById('resetBtn').onclick = ()=>{
  if(!confirm('Reset local Uncensearch database to the original preinstalled 125 items? This will remove your additions, favorites, and history.')) return;
  items = PREINSTALLED.slice();
  meta = {history:[], favorites:[]};
  saveState(items, meta);
  renderPrelist(); renderHistory(); renderFavorites(); updateMetaBadge();
  alert('Reset complete.');
};

/* ---------- Input & keyboard handling ---------- */
document.getElementById('searchBtn').onclick = ()=> performSearch();

searchBox.addEventListener('keydown', (ev)=>{
  const key = ev.key;
  if(!suggestionsEl.hidden){
    if(key === 'ArrowDown'){ ev.preventDefault(); suggestionIndex = Math.min(currentSuggestions.length-1, suggestionIndex+1); highlightSuggestion(); return; }
    if(key === 'ArrowUp'){ ev.preventDefault(); suggestionIndex = Math.max(-1, suggestionIndex-1); highlightSuggestion(); return; }
    if(key === 'Enter'){ ev.preventDefault(); if(suggestionIndex >= 0) chooseSuggestion(suggestionIndex); else performSearch(); hideSuggestions(); return; }
    if(key === 'Escape'){ hideSuggestions(); return; }
  } else {
    if(key === 'Enter'){ ev.preventDefault(); performSearch(); }
  }
});

const debouncedSuggest = debounce((v)=> showSuggestions(v), 120);
searchBox.addEventListener('input', (e)=>{
  const v = e.target.value;
  if(!v || v.trim().length===0){ hideSuggestions(); return; }
  debouncedSuggest(v);
});
document.addEventListener('click', (e)=>{
  if(!suggestionsEl.contains(e.target) && e.target !== searchBox) hideSuggestions();
});

/* ---------- Initial render ---------- */
renderPrelist();
renderHistory();
renderFavorites();
if((meta.history||[]).length===0){
  mainTitle.textContent = 'Welcome to Uncensearch';
  mainBody.innerHTML = `<p class="muted">Try searching "how to make cookies" or intentionally type "how to make cookis" — Uncensearch will still find relevant results.</p>`;
}

/* expose for console tinkering */
window.Uncensearch = {items, meta, searchItems, performSearch, renderItem, saveState};
