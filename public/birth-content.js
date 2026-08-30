/* =====================================================================
   CONTENT — edit this block and nothing else.

   ITEMS: one object per comfort measure.
     id     unique short string (used to store yes/maybe/veto marks —
            if you change an id, that item loses its saved mark)
     name   short imperative label
     how    ONE line, specific enough to execute without thinking
     got    optional gotcha / the thing that makes it fail
     cat    which Prep-mode section it lives in (see CATS)

   TRIGGERS: what I tap in the room. Each lists item ids in priority
   order. Room mode shows the first 4 that survive (vetoes removed,
   "yes" items floated to the top), so it is fine to list 6-8 here.

   You can also add or reword items and plan options from inside the
   app (the ✎ buttons). Those live in the synced document, not here.
   ===================================================================== */

const CATS = [
  ["hands",    "Hands-on"],
  ["position", "Positions — rotate every ~30 min"],
  ["water",    "Water & temperature"],
  ["sensory",  "Sensory & mental"],
  ["mind",     "Mindfulness & hypnobirthing"],
  ["music",    "Music"],
  ["early",    "Early labor"],
  ["stall",    "Stalls"],
  ["trans",    "Transition script"],
  ["push",     "Pushing"],
  ["between",  "Between contractions"],
  ["advocacy", "Advocacy"]
];

const ITEMS = [
/* ---------- HANDS-ON ---------- */
{id:"sacral", cat:"hands", name:"Sacral counterpressure",
 how:"Heel of your hand at the TOP of the butt crease, not the low back. Lean your body weight in; don't push with your arms.",
 got:"Ask “higher or lower” once, then stop asking. Hold steady straight through the peak — don't let up when she gets loud."},
{id:"hipsqueeze", cat:"hands", name:"Double hip squeeze",
 how:"A hand on each side of her hips, on the meat. Push in and slightly UP toward her ears for the whole contraction.",
 got:"Fleshy part, not the bony points. Squeeze, don't pinch. Best while she leans forward over the bed or the ball."},
{id:"kneepress", cat:"hands", name:"Knee press",
 how:"She sits upright, feet flat on the floor. Cup a knee in each palm and press straight back toward her hips — level, not down.",
 got:"She needs something solid behind her back or you'll push her over."},
{id:"rebozo", cat:"hands", name:"Rebozo sifting (“shaking the apple tree”)",
 how:"She's on hands and knees. Sling the scarf under her belly, hold both ends, jiggle her belly side to side — fast and light — for a minute or two.",
 got:"Between contractions, never during. Loose and floppy, not hard pulls."},
{id:"effleurage", cat:"hands", name:"Effleurage",
 how:"Fingertips, feather-light, slow circles on her belly and thighs, timed to her breathing.",
 got:"Early labor and rest only. Too light to register at the peak of hard ones."},
{id:"tennisball", cat:"hands", name:"Tennis ball / rolling pin on the sacrum",
 how:"When your hands give out, roll a tennis ball or the rolling pin over the same spot with your body weight behind it.",
 got:"Pack them. Your hands WILL give out, probably around hour six."},

/* ---------- POSITIONS ---------- */
{id:"handsknees", cat:"position", name:"Hands and knees",
 how:"On the bed or the floor, forearms on a stack of pillows. Rock her hips, or slow cat/cow between contractions.",
 got:"First thing to try for back labor — it takes the baby's weight off her spine."},
{id:"sidelying", cat:"position", name:"Side-lying with the peanut ball",
 how:"On her side, peanut ball between her knees to hold the pelvis open. Ask the nurse for a peanut ball on arrival.",
 got:"The only true rest position that still opens the pelvis. Switch sides every 30 min."},
{id:"lunges", cat:"position", name:"Standing lunge",
 how:"One foot up on a chair or the bed rail. Lunge slowly toward that side and hold there through the whole contraction.",
 got:"Lunge toward the side where she feels more pressure. Hold onto her — she is off balance."},
{id:"slowdance", cat:"position", name:"Slow dancing on me",
 how:"Her arms over your shoulders, her weight on your chest, sway side to side while you press her sacrum.",
 got:"Gravity plus counterpressure at once. This is the default when nothing in particular is wrong."},
{id:"toilet", cat:"position", name:"Toilet sitting",
 how:"Put her on the toilet for 20–30 minutes, facing forward or backward, towel over the tank to lean on.",
 got:"The “dilation station” — she relaxes her pelvic floor there without trying. Covers the hourly pee too."},
{id:"squatbar", cat:"position", name:"Squat bar",
 how:"She hangs from or squats against the bar through the contraction, resting back on the bed between.",
 got:"Ask them to attach the bar EARLY. Nobody wants to hunt one down at 8cm."},
{id:"standlean", cat:"position", name:"Standing lean over the raised bed",
 how:"Raise the bed to her chest, she drapes over it, you work her sacrum from behind.",
 got:"The easiest upright position to hold for a long stretch. Same over the ball on a chair."},
{id:"stairs", cat:"position", name:"Sideways stair climbing",
 how:"Sideways up the stairs two at a time leading with the same foot, normally back down. Ten minutes.",
 got:"Opens the pelvis asymmetrically. Hold her arm the whole way."},
{id:"walking", cat:"position", name:"Hallway walking",
 how:"Walk the hall. Stop for each contraction, lean on the wall or on you and sway, then keep going.",
 got:"Get her off continuous monitoring first — ask about wireless or intermittent."},
{id:"deepsquat", cat:"position", name:"Supported deep squat",
 how:"She squats holding your hands or the bar, for the contraction only, then back up.",
 got:"Opens the outlet a lot but burns her legs. Save it for late — don't spend it early."},
{id:"miles", cat:"position", name:"Miles Circuit",
 how:"30 min open knee-chest, then 30 min exaggerated side-lying with the peanut ball, then 30 min walking or lunging. In that order.",
 got:"For a stall or a badly positioned baby. It takes 90 minutes — start it before you're desperate."},

/* ---------- WATER & TEMP ---------- */
{id:"tub", cat:"water", name:"The tub room",
 how:"ASK ABOUT THE TUB ROOM THE MINUTE YOU ARRIVE — before she wants it.",
 got:"The Snuggery has ONE tub room, first come first served. Asking when she wants it is already too late."},
{id:"shower", cat:"water", name:"Shower, handheld sprayer on the low back",
 how:"Sit her on the ball or the shower chair, hot water from the handheld straight onto her sacrum. Reach in from outside.",
 got:"The reliable backup for the tub — always available. Pack dry clothes for yourself."},
{id:"ricesock", cat:"water", name:"Warm rice sock",
 how:"Microwave 60–90 seconds, test it on your own forearm, then onto her low back or lower belly.",
 got:"Test it on yourself every single time. Her skin is more sensitive in labor."},
{id:"coldcloth", cat:"water", name:"Cold cloth, forehead and neck",
 how:"Cold wet cloth on her forehead, a second on the back of her neck, swapped for a fresh cold one every few contractions.",
 got:"Keep two going so one is always actually cold."},
{id:"icechips", cat:"water", name:"Ice chips",
 how:"Hold the cup up between contractions. Don't ask, just offer.",
 got:"Her mouth goes bone dry from the breathing."},
{id:"popsicles", cat:"water", name:"Popsicles",
 how:"Ask the nurse where the popsicles are when you arrive. Fluid and sugar she'll actually accept.",
 got:"Best calories she'll take once active labor starts."},

/* ---------- SENSORY & MENTAL ---------- */
{id:"dimlights", cat:"sensory", name:"Dim the lights, drape the monitor",
 how:"Kill the overheads. Throw a receiving blanket over the monitor screen so nothing is glowing at her.",
 got:"Do this the moment you're in the room, before anything else. It sets the whole tone."},
{id:"candles", cat:"sensory", name:"Battery candles",
 how:"Windowsill and the bathroom counter, then leave the room lights off entirely.",
 got:"Battery only. Pack them."},
{id:"aroma", cat:"sensory", name:"Aromatherapy on a cotton ball",
 how:"Few drops on a cotton ball held near her face. Lavender to calm, peppermint for nausea, citrus to lift.",
 got:"Check the unit's policy on arrival. Cotton ball, no diffuser. If she winces at a smell it leaves the room immediately."},
{id:"toning", cat:"sensory", name:"Low open “ohhh” toning",
 how:"When her sound goes high and thin, start making a low open “ohhhh” yourself and let her find it. Don't instruct her.",
 got:"Low sounds keep her open. High tight sounds mean she's fighting the contraction."},
{id:"horselips", cat:"sensory", name:"Horse lips",
 how:"Blow a loose raspberry through slack lips and let her copy you.",
 got:"Fastest way to unclench her jaw. Do it with her, don't tell her to do it."},
{id:"counting", cat:"sensory", name:"Count out loud through it",
 how:"Count slowly out loud from one. They peak around 30–45 seconds — she hears the number and knows it's coming down.",
 got:"Gives the pain an end point she can hear."},
{id:"breathwith", cat:"sensory", name:"Breathe loud enough for her to follow",
 how:"Get in her sightline and breathe the pace you want her at, out loud. She'll lock on.",
 got:"Beats any breathing instruction you could give her."},
{id:"relaxtracks", cat:"sensory", name:"Guided relaxation tracks",
 how:"Play the exact tracks she practiced with. Downloaded to the phone, before you leave the house.",
 got:"Only the ones she already knows. Labor is not the time for a new voice."},
{id:"focalpoint", cat:"sensory", name:"Focal point",
 how:"Give her one thing to hold with her eyes — your eyes, or a photo taped to the wall she's facing.",
 got:"Your eyes are the best one. Hold still and hold the gaze."},
{id:"affirmations", cat:"sensory", name:"Affirmation cards",
 how:"Tape them where she is actually facing. Read one out loud between contractions.",
 got:"Where she's facing changes every time she changes position. Move them."},
{id:"meditation", cat:"sensory", name:"Her meditation practice",
 how:"Cue the practice she already has — same words, same order, said quietly in her ear.",
 got:"Her language, not new language."},

/* ---------- MINDFULNESS & HYPNOBIRTHING ----------
   The mindfulness items are from Nancy Bardacke's "Mindful Birthing":
   one wave at a time, the breath as an anchor (attention, not a
   technique), pain vs. suffering, and really resting in the space
   between waves. The hb_ items are the hypnobirthing practice. */
{id:"mb_onewave", cat:"mind", name:"One wave at a time",
 how:"She never has to do all of labor — only this wave. “Just this one. It's already on its way out.”",
 got:"A wave lasts about a minute. The twelve-hour version of labor only exists in your heads — keep both of you out of it."},
{id:"mb_breaths", cat:"mind", name:"Count the wave in breaths, not minutes",
 how:"Time a few waves, then say the math out loud between them: “Yours run about eight slow breaths.” During one, count quietly: “…four… five… it's coming down.”",
 got:"The number has to be real — use the Waves timer in Room mode, don't guess."},
{id:"mb_anchor", cat:"mind", name:"Back to the breath",
 how:"Not a breathing pattern — just attention. When a wave sweeps her off, one quiet cue: “Feel this one breath.” Then breathe it with her.",
 got:"If counting or pacing starts to annoy her, drop it all and just breathe audibly where she can see you."},
{id:"mb_rest", cat:"mind", name:"End the wave when it ends",
 how:"The second it releases: “Done. That one's gone.” Let her go completely slack — no replaying the last wave, no bracing for the next.",
 got:"Most of labor is the space between waves. Dreading the next one is how you both suffer twice."},
{id:"mb_scan", cat:"mind", name:"Mini body scan between waves",
 how:"Name three spots, slowly, in her ear: “jaw… shoulders… hands.” Pause after each so she can soften it.",
 got:"Works because it's specific. “Relax” is not a place in the body."},
{id:"mb_suffer", cat:"mind", name:"Sensation, not emergency",
 how:"“It's big, and it's safe. It's your body opening.” Pain fought becomes suffering; pain allowed stays a wave that ends.",
 got:"Say the reframe once, calmly, then be quiet. Repeating it turns it into arguing."},
{id:"hb_cue", cat:"mind", name:"Her hypnobirthing anchor",
 how:"The exact cue she practiced — the word, the touch on her shoulder, the track. Same one, every time.",
 got:"It works because it's rehearsed. Don't improvise new hypno language mid-labor."},
{id:"hb_language", cat:"mind", name:"Surge language, all day",
 how:"“Surge,” “wave,” “opening,” “pressure.” Never “pain,” “hurt,” or “how much longer.” Quietly ask staff to match.",
 got:"Repeat it at shift change, right after the vetoes."},

/* ---------- MUSIC ---------- */
{id:"playlist", cat:"music", name:"Her playlist",
 how:"Downloaded for offline before you leave the house. Speaker and its charger in the bag.",
 got:"Hospital wifi will fail you. Download it now, not there."},
{id:"singing", cat:"music", name:"Me singing to her",
 how:"Quiet, close to her ear, songs she knows.",
 got:"Read her face once. If it's a no, it's a no, and stop."},
{id:"mandolin", cat:"music", name:"Me playing mandolin",
 how:"Early labor only, while she still wants input in the room. Play what she asks for.",
 got:"Put it away once active labor starts."},

/* ---------- EARLY LABOR ---------- */
{id:"e_normal", cat:"early", name:"Do normal life",
 how:"Make food, watch something, walk the dog, nap. Do not start labor-coping yet.",
 got:"The #1 early labor mistake is treating early labor like active labor. You'll both burn out before it counts."},
{id:"e_eat", cat:"early", name:"Feed her a real meal",
 how:"Real food now, while she can keep it down. Later it's ice chips and popsicles.",
 got:"Feed yourself at the same time. Same meal."},
{id:"e_sleep", cat:"early", name:"Sleep if it's night",
 how:"If she can doze between them, sleep — even twenty minutes. You too.",
 got:"You cannot bank this sleep later. This is the only chance."},
{id:"e_time", cat:"early", name:"Time them, but only sometimes",
 how:"Time twenty minutes of waves every couple of hours, not continuously — the Waves timer in Room mode does the math. Call when they're 5 min apart, 1 min long, for 1 hour.",
 got:"Confirm the 5-1-1 rule with her provider ahead of time. Watching the timer all day makes it worse."},
{id:"e_ice", cat:"early", name:"Rehearse one wave with ice",
 how:"She holds ice in her fist for 60 seconds while you run the Waves timer and breathe with her. That's the length of a real one.",
 got:"Straight out of Mindful Birthing. One minute of ice teaches you both, in the body, that a minute ends."},
{id:"e_bag", cat:"early", name:"Load the car",
 how:"Bag, snacks for YOU, speaker + charger, battery candles, rice sock, tennis ball, rebozo, birth plan copies.",
 got:"Do it during early labor while you have hands and a brain."},

/* ---------- STALLS ---------- */
{id:"s_bladder", cat:"stall", name:"Empty her bladder",
 how:"Toilet, right now, before you try anything else.",
 got:"A full bladder is the most common reason labor stalls. Check this FIRST every single time."},
{id:"s_privacy", cat:"stall", name:"Clear the room",
 how:"Fewer people, lights down, door shut, thirty minutes alone with her.",
 got:"Labor stalls when she feels watched. This includes being watched by you — be present, not observing."},
{id:"s_nipple", cat:"stall", name:"Nipple stimulation",
 how:"Ask the nurse first, then her own hand or the pump, five minutes on and five off.",
 got:"Ask first — it can make contractions strong fast."},
{id:"s_eat", cat:"stall", name:"Fuel her",
 how:"Honey stick, popsicle, juice, broth. A stall is sometimes just an empty tank.",
 got:"Same for you."},

/* ---------- TRANSITION ---------- */
{id:"tr_nonew", cat:"trans", name:"Offer nothing new",
 how:"No new positions, no new ideas, no questions. Keep doing exactly what you were already doing.",
 got:"This is the rule for the entire phase. Breaking it is the main way to make transition worse."},
{id:"tr_are", cat:"trans", name:"Say: “You ARE doing it”",
 how:"Not “you can do it.” She is already doing it. Say it after every contraction.",
 got:"“You can do it” sounds like she hasn't started."},
{id:"tr_one", cat:"trans", name:"One contraction at a time",
 how:"“Just this one. You don't have to do the next one yet.” Repeat it. That's the whole script.",
 got:""},
{id:"tr_eyes", cat:"trans", name:"Breathe with her, eyes locked",
 how:"Your face a foot from hers, in her line of sight, breathing the pace. Do not break the gaze.",
 got:"Don't look at the monitor. Look at her."},
{id:"tr_water", cat:"trans", name:"Water and a cold cloth between EVERY contraction",
 how:"Every single one. Straw to her lips, fresh cold cloth on her forehead. Don't ask first.",
 got:""},
{id:"tr_short", cat:"trans", name:"Name it: this is the shortest part",
 how:"“I can't do this” usually means she's nearly there. “This is the part right before the baby. It's the shortest part.”",
 got:"Say it once, calmly. Don't argue with her about whether she can."},

/* ---------- PUSHING ---------- */
{id:"pu_breathe", cat:"push", name:"Breathe the baby down",
 how:"Let her push with her own urge and her own breath.",
 got:"Don't purple-push (held breath, counting to ten) unless the provider is directing it."},
{id:"pu_position", cat:"push", name:"Change position if pushing stalls",
 how:"Side-lying with the peanut ball, hands and knees, or the squat bar. Ask for a change after ~30 min of no progress.",
 got:"Flat on her back is the worst one. Say something if she's been stuck there."},
{id:"pu_compress", cat:"push", name:"Warm compress on the perineum",
 how:"Ask the nurse for warm compresses — it's a normal ask here.",
 got:""},
{id:"pu_hold", cat:"push", name:"Hold her up",
 how:"Take a leg, hand behind her shoulders, curl her forward into each push. Follow the nurse's lead on the hold.",
 got:"Rest her back down completely between pushes."},
{id:"pu_mirror", cat:"push", name:"Mirror, if she wants it",
 how:"Ask ONCE, between contractions: “do you want the mirror?” Take the answer and drop it.",
 got:""},
{id:"pu_water", cat:"push", name:"Water and cold cloth between pushes",
 how:"Every break. She is working harder than she has all day.",
 got:""},

/* ---------- BETWEEN CONTRACTIONS ---------- */
{id:"bt_window", cat:"between", name:"This is the only window",
 how:"New ideas, questions, water, food, position changes — only between. During a contraction you go quiet and just apply pressure.",
 got:"The single most important rule on this sheet."},
{id:"bt_water", cat:"between", name:"Water, every time",
 how:"Straw to her lips after every contraction. Don't ask, just put it there.",
 got:""},
{id:"bt_praise", cat:"between", name:"Tell her exactly what she just did",
 how:"“That was a big one and you stayed loose.” Specific, not generic cheering.",
 got:""},
{id:"bt_reset", cat:"between", name:"Reset her jaw and shoulders",
 how:"Hand on her shoulders, press down as she exhales. Touch her jaw and say one word: “soft.”",
 got:"Tight jaw means tight pelvic floor. Every time."},
{id:"bt_position", cat:"between", name:"Position change on the clock",
 how:"If it's been ~30 minutes in one position, offer the next one now, between contractions.",
 got:"Offer two options, not a list. “Shower or hands and knees?”"},
{id:"bt_me", cat:"between", name:"Take care of yourself here",
 how:"Drink, eat a handful of something, sit down for sixty seconds, shake out your hands.",
 got:"You are the equipment. If you crash at hour fourteen she loses her whole support plan."},

/* ---------- ADVOCACY ---------- */
{id:"ad_five", cat:"advocacy", name:"“Can we have five minutes to talk about that?”",
 how:"Say it out loud to any provider proposing anything non-emergency, then talk to her alone.",
 got:"Almost nothing in a normal labor needs an answer in under five minutes."},
{id:"ad_monitor", cat:"advocacy", name:"Ask about intermittent or wireless monitoring",
 how:"“Is she a candidate for intermittent or wireless monitoring so she can move around?” Ask on arrival.",
 got:"Continuous wired monitoring pins her to the bed and kills half of this list."},
{id:"ad_shift", cat:"advocacy", name:"Brief the incoming nurse at shift change",
 how:"“Here's what's working: [X, Y]. Here's what she doesn't want: [the vetoes].”",
 got:"Shift change is roughly 7 and 19. Do it before they have to guess."},
{id:"ad_words", cat:"advocacy", name:"Use her words, not yours",
 how:"“She's saying she wants X.” Don't answer for her unless she asked you to.",
 got:""}
];

const TRIGGERS = [
  {id:"early", short:"Early labor", ic:"○", name:"Early labor", sub:"nothing's happening yet",
   rule:"Do not start coping yet. Rest, eat, and stay home as long as you can.",
   items:["e_normal","e_sleep","e_eat","e_time","e_ice","effleurage","walking","slowdance","mandolin","e_bag"]},

  {id:"back", short:"Back labor", ic:"↓", name:"It's in her back", sub:"back labor",
   rule:"Tell the nurse “she's having back labor” — they have tricks. Baby is probably facing her front.",
   items:["sacral","handsknees","hipsqueeze","shower","tennisball","lunges","sidelying","ricesock","rebozo"]},

  {id:"stalled", short:"Stalled", pin:1, ic:"⏸", name:"Stalled", sub:"contractions spacing out",
   rule:"Bladder first, privacy second, movement third.",
   items:["s_bladder","s_privacy","walking","miles","stairs","lunges","toilet","s_eat","s_nipple","tub"]},

  {id:"tense", short:"Tensing up", ic:"≈", name:"She's tensing up", sub:"tight jaw, high sounds",
   rule:"Don't tell her to relax. Demonstrate and let her copy you.",
   items:["horselips","toning","breathwith","mb_anchor","mb_suffer","hb_cue","bt_reset","coldcloth","counting","shower"]},

  {id:"rest", short:"Rest", ic:"☽", name:"She needs to rest", sub:"between the work",
   rule:"Lights off, everybody quiet — including you. Silence is a comfort measure.",
   items:["mb_rest","sidelying","dimlights","tub","relaxtracks","mb_scan","e_sleep","effleurage","ricesock","meditation"]},

  {id:"transition", short:"Transition", pin:3, ic:"⚑", name:"“I can't do this”", sub:"transition",
   rule:"OFFER NOTHING NEW. Keep doing exactly what you were doing.",
   items:["tr_nonew","tr_are","tr_one","mb_breaths","tr_eyes","tr_water","tr_short","coldcloth","sacral"]},

  {id:"pushing", short:"Pushing", pin:1, ic:"▼", name:"Pushing", sub:"",
   rule:"Her urge, her breath, unless the provider says otherwise.",
   items:["pu_breathe","pu_position","pu_hold","pu_compress","pu_water","pu_mirror","tr_are"]},

  {id:"between", short:"Between", pin:1, ic:"▫", name:"Between contractions", sub:"my checklist",
   rule:"This is the ONLY time to offer something new, ask a question, or hand her water.",
   items:["bt_window","mb_rest","bt_water","bt_reset","mb_scan","mb_onewave","bt_praise","bt_position","bt_me","ad_five","ad_shift"]}
];

/* The printed sheet is two sides of one page. FRONT is what you grab when
   things are hard; BACK is everything else. Reorder freely. */
const PRINT_PAGES = [
  ["transition", "between", "back", "tense"],
  ["stalled", "rest", "pushing", "early"]
];

const JOBS = {
  arrival: [
    ["j_tub",     "Ask about the tub room",        "ONE tub room, first come first served. Ask now."],
    ["j_peanut",  "Ask for a peanut ball",         "And ask them to attach the squat bar early."],
    ["j_monitor", "Ask about wireless monitoring", "So she can move and walk."],
    ["j_lights",  "Lights off, drape the monitor", "Battery candles out."],
    ["j_pops",    "Find the popsicles and ice",    "Ask where they live on the unit."],
    ["j_vetoes",  "Tell the nurse her vetoes",     "Read them off the top of this sheet."]
  ],
  ongoing: [
    ["j_pee",   "Pee — every hour",        "A full bladder stalls labor and hurts. Don't wait for her to ask."],
    ["j_water", "Water after every contraction","Straw to her lips. Don't ask."],
    ["j_food",  "Food for her",                 "Popsicle, honey stick, broth, juice."],
    ["j_myfood","EAT SOMETHING YOURSELF",       "You are the equipment. Do not skip this."],
    ["j_pos",   "Position change ~every 30 min","Offer two options, not a list."],
    ["j_shift", "Shift change handoff",         "What's working, what she doesn't want. Roughly 7 and 19."]
  ]
};

/* =====================================================================
   BIRTH PLAN WIZARD
   ---------------------------------------------------------------------
   Britt's document, for the care team. Presented NEUTRALLY -- no
   defaults, no lean. The tool does not have an opinion about epidurals.

   A step is { id, title, blurb?, qs:[...] } or a comfort-triage step
   { id, title, blurb?, triage:["catId", ...] }.

   Question types:
     text  one line          note  free text (a paragraph)
     one   pick one          many  pick any number

   Every option has:
     v      stored value (changing it drops that saved answer)
     label  what you see while deciding
     say    the line that PRINTS on the plan. Clinical, third-party
            readable, complete on its own. Omit `say` and the option
            prints nothing (use for "no preference" answers).

   The printed plan shows ONLY questions you answered. Skipping a
   question is a real choice -- it keeps the sheet to one page.
   ===================================================================== */

const PLAN = [

/* ------------------------------------------------------------------ */
{id:"basics", title:"The basics", blurb:"The header of the printed plan.", qs:[
  {id:"names", type:"text", q:"Your names", ph:"Brittany & Matt Brooker"},
  {id:"due", type:"text", q:"Due date", ph:"e.g. March 14"},
  {id:"provider", type:"text", q:"Provider or practice", ph:"Name of the midwife / OB / practice"},
  {id:"support", type:"text", q:"Who is in the room", ph:"Matt (partner)"},
  {id:"health", type:"note", q:"Anything the team should know up front",
   ph:"Allergies, GBS status, blood type, prior births, medical conditions, anything that made a past hospital visit hard"}
]},

/* ------------------------------------------------------------------ */
{id:"arrival", title:"The room", blurb:"How you want the space when you walk in.", qs:[
  {id:"env", type:"many", q:"Environment", opts:[
    {v:"dim",     label:"Lights dimmed or off",        say:"Please keep the lights dim."},
    {v:"monitor", label:"Monitor screen draped",       say:"Please drape or dim the monitor screen."},
    {v:"music",   label:"Our own music playing",       say:"We'll have our own music playing."},
    {v:"quiet",   label:"Quiet voices",                say:"Quiet voices, please."},
    {v:"few",     label:"As few people as possible",   say:"Please keep the number of people in the room to a minimum."},
    {v:"door",    label:"Door closed",                 say:"Please keep the door closed."},
    {v:"candles", label:"Our battery candles out",     say:"We'll set out battery candles."}
  ]},
  {id:"students", type:"one", q:"Students and observers", opts:[
    {v:"yes",  label:"Welcome",             say:"Students and observers are welcome."},
    {v:"ask",  label:"Please ask first",    say:"Please ask before bringing students or observers in."},
    {v:"no",   label:"Prefer not",          say:"We'd prefer no students or observers."}
  ]},
  {id:"photos", type:"one", q:"Photos and video", opts:[
    {v:"all",    label:"Anytime, anything",              say:"Photos and video are welcome throughout."},
    {v:"nobirth",label:"Photos yes, no video of the birth", say:"Photos welcome; no video of the birth itself."},
    {v:"after",  label:"After the birth only",           say:"Please, photos after the birth only."},
    {v:"none",   label:"None",                           say:"No photos or video, please."}
  ]}
]},

/* ------------------------------------------------------------------ */
{id:"monitor", title:"Monitoring & movement", blurb:"This section decides how much of the comfort plan is even possible. Wired continuous monitoring pins her to the bed.", qs:[
  {id:"fetal", type:"one", q:"Fetal monitoring", opts:[
    {v:"intermittent", label:"Intermittent, if I'm a candidate", say:"I'd like intermittent auscultation rather than continuous monitoring, if I'm a candidate."},
    {v:"wireless",     label:"Wireless telemetry if available",  say:"If continuous monitoring is needed, I'd like wireless telemetry so I can keep moving."},
    {v:"continuous",   label:"Continuous is fine",               say:"Continuous monitoring is fine."},
    {v:"clinical",     label:"Whatever is clinically needed"}
  ]},
  {id:"iv", type:"one", q:"IV access", opts:[
    {v:"none",  label:"No IV unless it's needed",  say:"I'd prefer no IV unless it becomes necessary."},
    {v:"lock",  label:"Saline lock only",          say:"A saline lock is fine; I'd prefer not to be on continuous fluids."},
    {v:"fluids",label:"Fluids are fine",           say:"IV fluids are fine."}
  ]},
  {id:"move", type:"many", q:"Freedom to move — what should be set up", opts:[
    {v:"walk",   label:"Walking the halls",         say:"I'd like to walk the halls."},
    {v:"tub",    label:"The tub room",              say:"We'd like the tub room if it's available — please tell us on arrival."},
    {v:"shower", label:"Shower with the sprayer",   say:"I'd like to use the shower."},
    {v:"ball",   label:"A birth ball",              say:"Please bring a birth ball."},
    {v:"peanut", label:"A peanut ball",             say:"Please bring a peanut ball."},
    {v:"bar",    label:"Squat bar on the bed",      say:"Please attach the squat bar to the bed early."}
  ]},
  {id:"eat", type:"one", q:"Eating and drinking", opts:[
    {v:"free",   label:"As I want",        say:"I'd like to eat and drink as I feel able."},
    {v:"clear",  label:"Clear fluids",     say:"I'd like clear fluids throughout."},
    {v:"policy", label:"Follow the unit's policy"}
  ]}
]},

/* ------------------------------------------------------------------ */
{id:"augment", title:"Moving labor along", blurb:"What you'd like to happen before things get escalated.", qs:[
  {id:"pace", type:"many", q:"Before any intervention", opts:[
    {v:"why",    label:"Tell us what and why",     say:"Please explain what you're proposing and why before we decide."},
    {v:"five",   label:"Five minutes to talk alone", say:"Please give us a few minutes alone to talk before we answer."},
    {v:"alts",   label:"Offer the alternatives",   say:"Please tell us the alternatives, including waiting."},
    {v:"time",   label:"More time first, if it's safe", say:"If mother and baby are well, we'd like more time before intervening."}
  ]},
  {id:"sweep", type:"one", q:"Membrane sweep", opts:[
    {v:"ok",      label:"Fine",           say:"A membrane sweep is fine."},
    {v:"discuss", label:"Discuss first",  say:"Please discuss a membrane sweep with me first."},
    {v:"no",      label:"Prefer not",     say:"I'd prefer not to have a membrane sweep."}
  ]},
  {id:"waters", type:"one", q:"Breaking the waters", opts:[
    {v:"spont",   label:"Let them break on their own", say:"I'd prefer to let my waters break on their own."},
    {v:"discuss", label:"Discuss first",               say:"Please discuss breaking my waters with me first."},
    {v:"ok",      label:"Fine if it helps",            say:"Breaking my waters is fine if it will help."}
  ]},
  {id:"pit", type:"one", q:"Pitocin / augmentation", opts:[
    {v:"natural", label:"Try position and movement first", say:"I'd like to try position changes and movement before Pitocin."},
    {v:"discuss", label:"Discuss first",                   say:"Please discuss Pitocin with me before starting it."},
    {v:"ok",      label:"Fine if needed",                  say:"Pitocin is fine if it's needed."}
  ]},
  {id:"exams", type:"one", q:"Cervical checks", opts:[
    {v:"min",  label:"As few as possible",     say:"Please keep cervical checks to a minimum."},
    {v:"ask",  label:"Ask before each one",    say:"Please ask before each cervical check."},
    {v:"nonum",label:"Don't tell me the number unless I ask", say:"Please don't tell me the number unless I ask."},
    {v:"ok",   label:"Routine is fine"}
  ]}
]},

/* ------------------------------------------------------------------ */
{id:"pain", title:"Pain management", blurb:"There is no right answer here and this tool doesn't have an opinion. Pick what's true today — you can change it any time, including during labor.", qs:[
  {id:"approach", type:"one", q:"Where you're starting from", opts:[
    {v:"unmed_dontoffer", label:"Unmedicated — please don't offer, I'll ask",
     say:"I'm planning an unmedicated birth. Please don't offer pain medication — I'll ask for it if I want it."},
    {v:"unmed_offer",     label:"Unmedicated — but tell me my options if I'm struggling",
     say:"I'm planning an unmedicated birth, but I'd like to hear my options if you think I'm struggling."},
    {v:"epi_when",        label:"Epidural, when I ask for it",
     say:"I'm planning to have an epidural. I'd like it when I ask."},
    {v:"epi_early",       label:"Epidural, as early as I can have one",
     say:"I'd like an epidural as early as I'm able to have one."},
    {v:"undecided",       label:"Undecided — talk me through it in the moment",
     say:"I haven't decided about pain medication. Please talk me through the options when it's relevant."}
  ]},
  {id:"open", type:"many", q:"Open to trying", opts:[
    {v:"nitrous", label:"Nitrous oxide, if available", say:"I'd like to try nitrous oxide if it's available."},
    {v:"iv",      label:"IV pain medication",          say:"I'm open to IV pain medication."},
    {v:"sterile", label:"Sterile water injections for back labor", say:"I'm open to sterile water injections for back labor."},
    {v:"epidural",label:"Epidural",                    say:"I'm open to an epidural."},
    {v:"local",   label:"Local anesthetic only, if repair is needed", say:"Local anesthetic only, if a repair is needed."}
  ]},
  {id:"lang", type:"many", q:"Language in the room — we're using hypnobirthing & Mindful Birthing", opts:[
    {v:"surge",   label:"Say “surge” or “wave”, not “contraction”",
     say:"We use hypnobirthing — we say “surge” or “wave” rather than “contraction.” Please join us if you can."},
    {v:"nopain",  label:"Avoid “pain” and “hurt” unless I use them first",
     say:"Please avoid the words “pain” and “hurt” unless I use them first."},
    {v:"norate",  label:"Only ask me to rate pain when it's clinically needed",
     say:"Please only ask me to rate my pain when it's clinically needed."},
    {v:"between", label:"Questions between surges only",
     say:"Please save questions and conversation for the breaks between surges."},
    {v:"tracks",  label:"I'll have relaxation tracks / headphones going",
     say:"I may be listening to hypnobirthing tracks — please don't take the headphones as rudeness."}
  ]},
  {id:"painnote", type:"note", q:"Anything else about pain",
   ph:"e.g. 'If I ask for an epidural before 6cm, remind me once what I said I wanted, then get it.'"}
]},

/* ------------------------------------------------------------------ */
{id:"push", title:"Pushing & birth", qs:[
  {id:"style", type:"one", q:"How you want to push", opts:[
    {v:"spont", label:"My own urge, my own breath", say:"I'd like to push with my own urge rather than directed pushing."},
    {v:"coach", label:"Coached counting is fine",   say:"Coached pushing is fine."},
    {v:"lead",  label:"Follow my lead in the moment", say:"Please follow my lead on pushing."}
  ]},
  {id:"pos", type:"many", q:"Positions", opts:[
    {v:"choose",  label:"Whatever feels right at the time", say:"I'd like to choose my own pushing position."},
    {v:"upright", label:"Upright or supported squat",       say:"I'd like to try upright or supported squatting positions."},
    {v:"side",    label:"Side-lying",                       say:"I'd like to try side-lying."},
    {v:"hk",      label:"Hands and knees",                  say:"I'd like to try hands and knees."},
    {v:"noback",  label:"Not flat on my back",              say:"I'd prefer not to push flat on my back."}
  ]},
  {id:"per", type:"many", q:"Perineum", opts:[
    {v:"warm",    label:"Warm compresses",              say:"I'd like warm compresses on the perineum."},
    {v:"support", label:"Perineal support",             say:"I'd like perineal support during crowning."},
    {v:"slow",    label:"Tell me when to slow down",    say:"Please tell me when to slow down and breathe the head out."},
    {v:"touch",   label:"Let me touch the head",        say:"I'd like to reach down and touch the baby's head."},
    {v:"mirror",  label:"Offer a mirror",               say:"I'd like a mirror offered."}
  ]},
  {id:"epis", type:"one", q:"Episiotomy", opts:[
    {v:"tear",    label:"I'd rather tear than be cut", say:"I'd prefer a natural tear to an episiotomy."},
    {v:"consent", label:"Emergency only, with my consent", say:"Please perform an episiotomy only in an emergency, and tell me first."},
    {v:"judge",   label:"Provider's judgment"}
  ]},
  {id:"catch", type:"one", q:"Catching the baby", opts:[
    {v:"me",       label:"I want to reach down and lift my baby up", say:"I'd like to reach down and bring my baby to my chest myself."},
    {v:"partner",  label:"My partner helps catch",     say:"My partner would like to help catch the baby."},
    {v:"provider", label:"Provider catches"}
  ]},
  {id:"announce", type:"one", q:"Announcing the sex", opts:[
    {v:"us",   label:"Let us discover it ourselves", say:"Please let us discover the baby's sex ourselves."},
    {v:"tell", label:"Tell us"},
    {v:"known",label:"We already know"}
  ]}
]},

/* ------------------------------------------------------------------ */
{id:"golden", title:"The first hour", blurb:"The golden hour. This is the section most worth being specific about — it happens fast and everyone is busy.", qs:[
  {id:"cord", type:"one", q:"Cord clamping", opts:[
    {v:"pulse",  label:"Wait until it stops pulsing", say:"Please delay cord clamping until the cord has stopped pulsing."},
    {v:"delay",  label:"At least 1–3 minutes",        say:"Please delay cord clamping for at least 1–3 minutes."},
    {v:"now",    label:"Immediate is fine",           say:"Immediate cord clamping is fine."},
    {v:"judge",  label:"Provider's judgment"}
  ]},
  {id:"cut", type:"one", q:"Who cuts the cord", opts:[
    {v:"partner", label:"My partner",  say:"My partner would like to cut the cord."},
    {v:"me",      label:"Me",          say:"I'd like to cut the cord."},
    {v:"provider",label:"Provider",    say:"Please cut the cord yourselves."},
    {v:"none",    label:"No preference"}
  ]},
  {id:"blood", type:"one", q:"Cord blood", opts:[
    {v:"bank",   label:"Banking it — kit is in our bag", say:"We are banking cord blood; our collection kit is in our bag."},
    {v:"donate", label:"Donating it",                    say:"We'd like to donate cord blood."},
    {v:"no",     label:"Not collecting"}
  ]},
  {id:"skin", type:"many", q:"Skin to skin", opts:[
    {v:"imm",   label:"Immediately, straight onto my chest", say:"Please place the baby directly on my chest immediately after birth."},
    {v:"uninterrupted", label:"Uninterrupted for at least an hour", say:"We'd like at least an uninterrupted hour of skin-to-skin."},
    {v:"onchest",label:"Do the newborn checks on my chest", say:"Please do the newborn assessment on my chest wherever possible."},
    {v:"delayw", label:"Delay weighing and measuring",     say:"Please delay weighing and measuring until after the first hour."},
    {v:"quiet",  label:"Lights low, voices down",          say:"Please keep the lights low and the room quiet during the first hour."},
    {v:"partner",label:"If I can't, my partner does skin-to-skin", say:"If I'm not able, please do skin-to-skin with my partner instead."},
    {v:"nosep",  label:"No separation from the baby",      say:"Please don't separate us unless it's medically necessary."}
  ]},
  {id:"placenta", type:"one", q:"Placenta", opts:[
    {v:"see",   label:"We'd like to see it",  say:"We'd like to see the placenta."},
    {v:"keep",  label:"We're taking it home", say:"We'd like to keep the placenta — please save it for us."},
    {v:"hosp",  label:"Hospital disposal"}
  ]},
  {id:"goldnote", type:"note", q:"Anything else about the first hour", ph:"Optional"}
]},

/* ------------------------------------------------------------------ */
{id:"feed", title:"Feeding", qs:[
  {id:"plan", type:"one", q:"Feeding plan", opts:[
    {v:"bf",    label:"Breastfeeding",              say:"I plan to breastfeed."},
    {v:"both",  label:"Breastfeeding and formula",  say:"I plan to breastfeed and supplement with formula."},
    {v:"formula",label:"Formula",                   say:"I plan to formula feed."},
    {v:"undecided", label:"Undecided"}
  ]},
  {id:"asks", type:"many", q:"What would help", opts:[
    {v:"firsthour", label:"Help latching in the first hour", say:"I'd like help with the first latch within the first hour."},
    {v:"lc",        label:"Lactation consultant before discharge", say:"Please arrange a lactation consultant before we're discharged."},
    {v:"nosupp",    label:"No formula, water or pacifier without asking me", say:"Please don't give the baby formula, water, or a pacifier without asking me first."},
    {v:"hand",      label:"Show me hand expression", say:"I'd like to be shown hand expression."},
    {v:"noshield",  label:"No bottles or nipple shields unless I ask", say:"Please don't introduce bottles or nipple shields unless I ask."}
  ]}
]},

/* ------------------------------------------------------------------ */
{id:"newborn", title:"Newborn procedures", blurb:"These are medical decisions — worth talking through with your pediatrician, not just deciding here. The tool states your choice; it doesn't have one.", qs:[
  {id:"vitk", type:"one", q:"Vitamin K", opts:[
    {v:"inj",   label:"Injection",           say:"Yes to the vitamin K injection."},
    {v:"oral",  label:"Oral, if available",  say:"We'd like oral vitamin K if that's available."},
    {v:"delay", label:"After the first hour", say:"Yes to vitamin K, but please wait until after the first hour."},
    {v:"decline",label:"Declining",          say:"We are declining vitamin K. We understand the risks and have discussed it with our pediatrician."}
  ]},
  {id:"eye", type:"one", q:"Erythromycin eye ointment", opts:[
    {v:"yes",    label:"Yes",                 say:"Yes to the eye ointment."},
    {v:"delay",  label:"After the first hour", say:"Yes to the eye ointment, but please wait until after the first hour so we can make eye contact."},
    {v:"decline",label:"Declining",           say:"We are declining the erythromycin eye ointment."}
  ]},
  {id:"hepb", type:"one", q:"Hepatitis B vaccine", opts:[
    {v:"yes",    label:"At birth",            say:"Yes to the hepatitis B vaccine at birth."},
    {v:"delay",  label:"At the pediatrician instead", say:"We'll do the hepatitis B vaccine at our pediatrician's office."},
    {v:"decline",label:"Declining",           say:"We are declining the hepatitis B vaccine."}
  ]},
  {id:"bath", type:"one", q:"First bath", opts:[
    {v:"delay24",label:"Delay at least 24 hours", say:"Please delay the first bath at least 24 hours — we'd like to keep the vernix."},
    {v:"us",     label:"We'll do it ourselves",   say:"We'd like to give the first bath ourselves."},
    {v:"routine",label:"Routine timing is fine"}
  ]},
  {id:"screen", type:"one", q:"Newborn screening & hearing test", opts:[
    {v:"yes",  label:"Yes",                  say:"Yes to newborn screening and the hearing test."},
    {v:"room", label:"Yes — in the room with us", say:"Yes to newborn screening — please do it in the room with us."},
    {v:"discuss", label:"Discuss first",     say:"Please discuss newborn screening with us first."}
  ]},
  {id:"where", type:"one", q:"Exams and procedures", opts:[
    {v:"room",  label:"In the room with us", say:"Please do all exams and procedures in the room with us."},
    {v:"partner",label:"Partner goes along if baby leaves", say:"If the baby has to leave the room, my partner goes too."},
    {v:"nursery",label:"Nursery is fine"}
  ]},
  {id:"circ", type:"one", q:"Circumcision (skip if not applicable)", opts:[
    {v:"na",     label:"Not applicable"},
    {v:"hosp",   label:"Yes, at the hospital", say:"We'd like a circumcision done at the hospital."},
    {v:"later",  label:"Not here — we'll decide later", say:"No circumcision during this stay."},
    {v:"no",     label:"No",                   say:"No circumcision."}
  ]}
]},

/* ------------------------------------------------------------------ */
{id:"postpartum", title:"After", qs:[
  {id:"room", type:"one", q:"Where the baby sleeps", opts:[
    {v:"with",   label:"With us at all times", say:"We'd like the baby to room in with us at all times."},
    {v:"night",  label:"Nursery overnight is fine", say:"The nursery overnight is fine."},
    {v:"decide", label:"We'll decide in the moment"}
  ]},
  {id:"partner", type:"one", q:"Partner staying", opts:[
    {v:"stay",  label:"My partner stays the whole time", say:"My partner will be staying with me overnight."},
    {v:"na",    label:"No preference"}
  ]},
  {id:"visitors", type:"one", q:"Visitors", opts:[
    {v:"none",  label:"None until we say",     say:"No visitors until we say we're ready."},
    {v:"family",label:"Immediate family only", say:"Immediate family only, please."},
    {v:"open",  label:"Open"}
  ]},
  {id:"mypain", type:"note", q:"Pain management for you afterward",
   ph:"e.g. 'Ibuprofen and Tylenol first; ask me before anything stronger.'"},
  {id:"ppnote", type:"note", q:"Anything else about the stay", ph:"Optional"}
]},

/* ------------------------------------------------------------------ */
{id:"change", title:"If things change", blurb:"The section that matters most on the day it matters. Filling it in is not inviting it — it's making sure you still get choices if the plan goes out the window.", qs:[
  {id:"cs", type:"many", q:"If a cesarean becomes necessary", opts:[
    {v:"partner",  label:"My partner stays with me the whole time", say:"I'd like my partner with me for the entire procedure."},
    {v:"drape",    label:"Clear drape, or lower it so I can see the birth", say:"I'd like a clear drape, or the drape lowered so I can see my baby being born."},
    {v:"arms",     label:"Arms free, not strapped down", say:"Please leave my arms free."},
    {v:"skin",     label:"Skin to skin in the OR",       say:"I'd like skin-to-skin in the operating room if the baby and I are both well."},
    {v:"cord",     label:"Delayed cord clamping if possible", say:"Please still delay cord clamping if it's safe to do so."},
    {v:"explain",  label:"Explain each step as it happens", say:"Please talk me through each step as it happens."},
    {v:"quiet",    label:"Quiet at the moment of birth",  say:"Please keep the room quiet at the moment of birth."},
    {v:"nosep",    label:"Don't separate us",             say:"Please don't separate us unless it's medically necessary."},
    {v:"nurse",    label:"Help me nurse in recovery",     say:"I'd like help breastfeeding as soon as possible in recovery."}
  ]},
  {id:"assisted", type:"one", q:"Vacuum or forceps", opts:[
    {v:"first",  label:"Try position changes and more time first", say:"If pushing stalls, I'd like to try position changes and more time before vacuum or forceps."},
    {v:"discuss",label:"Discuss the options with me",  say:"Please discuss the options with me before an assisted delivery."},
    {v:"judge",  label:"Provider's judgment in an emergency"}
  ]},
  {id:"nicu", type:"one", q:"If the baby needs the NICU", opts:[
    {v:"partner", label:"My partner goes with the baby, always", say:"If the baby goes to the NICU, my partner goes with the baby."},
    {v:"me",      label:"I go too, as soon as I'm able",         say:"I'd like to come to the NICU as soon as I'm physically able."},
    {v:"milk",    label:"Help me start expressing right away",   say:"Please help me start expressing milk as soon as possible."},
    {v:"decide",  label:"We'll decide then"}
  ]},
  {id:"emergency", type:"note", q:"In an emergency, what matters most to you?",
   ph:"One or two sentences. This is the line a team reads when there's no time to ask."}
]},

/* ------------------------------------------------------------------ */
{id:"closing", title:"Closing note", blurb:"How the plan ends changes how it gets read. A plan that acknowledges things change gets followed; one that reads like a list of demands gets skimmed.", qs:[
  {id:"words", type:"note", q:"Closing line on the printed plan",
   ph:"We know birth doesn't follow a script. If something needs to change, please tell us what's happening and why — we want to be part of the decision. Thank you for taking care of us."}
]}
];

/* Comfort-measure triage: the same corpus as Prep mode, broken into
   short finishable steps instead of one long accordion. */
const TRIAGE = [
  {id:"t_hands",   title:"Hands-on",              cats:["hands"]},
  {id:"t_pos",     title:"Positions",             cats:["position"]},
  {id:"t_water",   title:"Water & temperature",   cats:["water"]},
  {id:"t_sensory", title:"Sensory & mental",      cats:["sensory","music"]},
  {id:"t_mind",    title:"Mindfulness & hypnobirthing", cats:["mind"]},
  {id:"t_phases",  title:"Early labor & stalls",  cats:["early","stall"]},
  {id:"t_birth",   title:"Transition & pushing",  cats:["trans","push"]},
  {id:"t_me",      title:"My job & advocacy",     cats:["between","advocacy"]}
];

/* Which plan sections print, and in what order. Drop one to leave it
   off the sheet entirely while keeping the answers. */
const PLAN_PRINT = ["arrival","monitor","augment","pain","push","golden",
                    "feed","newborn","postpartum","change"];
