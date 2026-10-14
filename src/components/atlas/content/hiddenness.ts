import type { Objection } from "../types";

/* Objection II — Divine hiddenness. Two parts: Schellenberg's argument from
   nonresistant nonbelief, and Maitzen's map of belief. Every quotation below was
   checked word for word against a public-domain text: the KJV (Gutenberg #10);
   Elwes's Spinoza (Ethics, Gutenberg #3800; Theologico-Political Treatise,
   Gutenberg #990; Letter 73 via sacred-texts); Trotter's Pascal (Gutenberg #18269,
   Brunschvicg numbering; the Gutenberg text numbers 552–585 one lower, so Brunschvicg
   585 appears there as 584); Kennedy's Nietzsche (Gutenberg #39955); Abbott's Kant
   (Gutenberg #5683); Pusey's Augustine (Gutenberg #3296); Deane's Anselm (CCEL);
   Beveridge's Calvin (CCEL); the English Dominican Summa (New Advent); Hume's
   Natural History of Religion (davidhume.org); the Book of Mormon (Gutenberg #17);
   Lewis's A Grief Observed (Project Gutenberg Canada); Butler's Analogy (CCEL).
   Maitzen is quoted from the published article (Religious Studies 42, 2006).
   Rea, Moser, Hart, Kierkegaard, Marsh (2008), Craig (1989) and Maitzen (2008)
   are paraphrased. */

const hiddenness: Objection = {
  id: "hiddenness",
  numeral: "II",
  short: "Hiddenness",
  title: "A God who wanted us wouldn't hide",
  objection:
    "A God who wanted a relationship with each of us wouldn't leave a sincere, open seeker unsure that he exists (J. L. Schellenberg's hiddenness argument).",
  counter:
    "Michael Rea argues that God's love needn't look like a parent's, and that God can be present without being felt. Paul Moser argues that God offers the evidence to people willing to be changed by it, and holds it back from people who only want to inspect it.",
  dek: "J. L. Schellenberg, a Canadian philosopher, has asked since 1993 why so many honest people, some searching hard and some never told, find no one there. His question is a cousin of the problem of evil, which asks why a good God allows suffering. In 2006 Stephen Maitzen added a world map on which belief follows birthplace. Three centuries earlier, Pascal had made God's hiding part of his case for Christianity: 'every religion which does not affirm that God is hidden, is not true' (*Pensées* 585).",
  question: "Would a perfectly loving God leave anyone who isn't running from him unsure he is there?",

  prongs: [
    /* ───────────────────── I. THE OPEN SEEKER ───────────────────── */
    {
      id: "hid-argument",
      side: "skeptic",
      label: "Honest seekers who find no God rule out a perfectly loving one",
      gist: "A perfectly loving God would make sure everyone not turning away from him believed he exists, and some honest people don't, so there is no such God.",
      body: [
        "{{schellenberg}}, a Canadian philosopher, published this argument in 1993. It starts from [[perfect-being-theology|what believers say a perfect God must be like]] and runs in four steps:",
        "(1) A perfectly loving God would always be open to a conscious, two-way relationship with each of us. (2) You can't relate to someone you don't believe exists, so such a God would make sure everyone able to have the relationship believed in him, unless they were resisting him. (3) But some people lack belief without resisting God, which Schellenberg calls [[nonresistant-nonbelief|nonresistant nonbelief]]. His examples are former believers who prayed to keep their faith, lifelong seekers, converts to religions with no personal God, such as Buddhism, and people who never heard of one. (4) So there is no perfectly loving God.",
        "{{nietzsche}} had made the same complaint in 1881, and the philosopher {{mckim}} framed it as an argument in 1990.",
      ],
      quote: {
        text: "An omniscient and omnipotent God who does not even take care that His intentions shall be understood by His creatures—could He be a God of goodness?",
        who: "Friedrich Nietzsche",
        cite: "Daybreak (The Dawn of Day) §91 (1881; tr. J. M. Kennedy, 1911)",
      },
      thinkers: ["schellenberg", "nietzsche", "mckim"],
      cedes:
        "The argument fails if a loving God could have a reason, weightier than the relationship itself, to leave a non-resisting person without belief, or if no one is in that position after all.",
      see: [
        { id: "hid-demographics", why: "Part 2 maps the same unbelief by birthplace and century." },
        { id: "evi-a", why: "Objection IV asks the reverse question, why belief runs ahead of the evidence." },
        { id: "mor-hell", why: "If God also judges people for unbelief, Objection V's charge gets worse." },
      ],
      sources: [
        {
          title: "The Hiddenness Argument: Philosophy's New Challenge to Belief in God",
          by: "J. L. Schellenberg",
          year: "2015",
          note: "The argument restated for general readers. The premises are on p. 103.",
        },
        { title: "Divine Hiddenness and Human Reason", by: "J. L. Schellenberg", year: "1993", note: "The original argument from reasonable nonbelief." },
      ],
      children: [
        /* ── Premise one: Rea on transcendent love ── */
        {
          id: "hid-rea-love",
          side: "theist",
          label: "God's love needn't look like a parent's, so he may stay hidden",
          gist: "Premise one assumes God loves like an ideal parent, but a God far beyond us can love perfectly in his own way, which we can't predict.",
          body: [
            "{{rea}} answers premise one in his 2017 Gifford Lectures. The premise, he argues, pictures God's love as a parent's, scaled up and always reaching out. That picture keeps God personal by giving up his transcendence, the old teaching that God is beyond every category that fits created things. Such a God can be described only by [[analogy-of-being|analogy]], so our words apply to him in a stretched sense and can't tell us what his love must do in our case.",
            "Rea also draws on the philosopher Susan Wolf's 1982 essay 'Moral Saints', which argues that a life organized wholly around other people's welfare is less admirable than it sounds. Rea thinks a God whose every act revolved around us would be less admirable for the same reason. On his view God's perfect love takes its shape from God's own goodness and purposes.",
          ],
          quote: {
            text: "Hence, since to love anything is nothing else than to will good to that thing, it is manifest that God loves everything that exists. Yet not as we love.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I q.20 a.2 (tr. Fathers of the English Dominican Province)",
          },
          thinkers: ["rea", "aquinas"],
          cedes: "Rea is wrong if any love worth calling perfect must always seek the beloved's awareness of it.",
          see: [
            { id: "coh-a-analogy", why: "In Objection I, the Defender explains analogy, a way of saying true things about God without making him one of us." },
            { id: "mor-not-agent", why: "In Objection V, Brian Davies argues the same about God's goodness, which is unlike a human judge's." },
          ],
          sources: [
            {
              title: "The Hiddenness of God",
              by: "Michael C. Rea",
              year: "2018",
              note: "The Gifford Lectures (St Andrews, 2017). Chapter 5 argues that God's love can be perfect without being 'ideal' in the human sense.",
            },
          ],
          children: [
            {
              id: "hid-love-emptied",
              side: "skeptic",
              label: "A love that won't let you know it's there is a lesser love",
              gist: "We can easily picture a greater love than one that leaves a willing beloved forever unsure, so Rea's reply makes God's love smaller.",
              body: [
                "{{schellenberg}} replies that premise one never needed the parent picture. It needs only what believers already say, that God's love can't be surpassed. Of two lovers, one who leaves a willing beloved forever unsure he exists and one who makes himself known, almost anyone would call the first love the lesser.",
                "The Bible also says God 'will have all men to be saved, and to come unto the knowledge of the truth' (1 Timothy 2:4), and the philosopher Theodore Drange built his 1998 argument from nonbelief on verses like it. Rea's appeal to God's own purposes makes things worse, since a love shaped by the lover's interests falls short of the self-giving love Christians see on the cross. If *love* is stretched further still, God's love would resemble ours only as the Dog Star resembles the dog that barks, sharing a name and no [[univocity|common meaning]], which is ((coh-a-dogstar|Spinoza's point)) about God's mind.",
              ],
              quote: {
                text: "If ye then, being evil, know how to give good gifts unto your children, how much more shall your Father which is in heaven give good things to them that ask him?",
                who: "Jesus, in the Gospel of Matthew",
                cite: "Matthew 7:11 (KJV)",
              },
              thinkers: ["schellenberg"],
              cedes:
                "I'd drop this if a love that leaves a willing beloved unaware of it turned out to be no less a love than one that makes itself known.",
              see: [
                { id: "coh-a-dogstar", why: "In Objection I, Spinoza argues that a divine mind unlike ours shares only a name with ours." },
                { id: "hid-pursues", why: "There the father in the parable of the prodigal son runs out to meet his son, a picture of love that goes after the beloved." },
                { id: "coh-a-univocal", why: "Duns Scotus argued that a word used of God must share a core meaning with ours, or no argument can rest on it (Objection I)." },
              ],
              sources: [
                { title: "Nonbelief and Evil: Two Arguments for the Nonexistence of God", by: "Theodore M. Drange", year: "1998" },
              ],
              children: [
                {
                  id: "hid-skeptical-theism",
                  side: "theist",
                  label: "We can't see far enough to judge what perfect love would do",
                  gist: "A hiding love looks lesser to us, but that is weak evidence that it is lesser, because we can't see all the goods an infinite mind can see.",
                  body: [
                    "Schellenberg's two-lovers comparison works only if we can see everything that depends on the choice, and we probably can't. This is [[skeptical-theism|skeptical theism]], the view that our failure to see God's reasons is poor evidence that he has none. Unlike Rea's reply, this one lets *love* keep its ordinary meaning. A four-year-old can't see why a good parent makes her wait, and the distance between us and God is greater than that. When God finally answered Job, he asked him question after question, among them 'Where wast thou when I laid the foundations of the earth?' (Job 38:4).",
                    "The philosophers Justin McBrayer and Philip Swenson argued in 2012 that the hiddenness argument rests on an unstated premise, that if God had a reason to allow nonresistant nonbelief, we would probably see it, and that nothing supports that premise. {{bergmann}} argues more generally that we have no good reason to think the goods we know of are a representative sample of the goods there are.",
                  ],
                  quote: {
                    text: "For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.",
                    who: "The Book of Isaiah",
                    cite: "Isaiah 55:9 (KJV)",
                  },
                  thinkers: ["bergmann"],
                  cedes: "This reply falls if the goods at stake in hiddenness are all goods we can fully survey.",
                  see: [
                    { id: "hid-responsibility", why: "Travis Dumsday names a possible reason, a good that needs some people not to believe yet." },
                    { id: "mor-not-agent", why: "In Objection V, defenders answer the charge about hell by denying that God has duties like ours." },
                  ],
                  sources: [
                    {
                      title: "Scepticism about the Argument from Divine Hiddenness",
                      by: "Justin P. McBrayer and Philip Swenson",
                      year: "2012",
                      note: "Religious Studies 48: 129–150.",
                    },
                  ],
                  children: [
                    {
                      id: "hid-logical-foul",
                      side: "skeptic",
                      label: "Unseen reasons can't defeat an argument from what love is",
                      gist: "Unseen reasons may weaken arguments from piles of evil, but this argument starts from what perfect love is, and the goods in question would be human goods.",
                      body: [
                        "Skeptical theism answers arguments that go from what we see to what is probably true, such as *I see no reason for this evil, so there probably is none*. {{schellenberg}} reasons instead from what perfect love is. His argument is deductive, meaning the conclusion follows with certainty if the premises are true. So if we can see that the premises are true, no hidden good can block the conclusion.",
                        "Schellenberg adds that any good God had in mind here would be a good for us, a good of human relationship or growth, and those are the goods we understand best. And if we can't judge what perfect love would do about our unbelief, we can't be sure God will keep his promises either, including 'I will never leave thee, nor forsake thee' (Hebrews 13:5).",
                      ],
                      quote: {
                        text: "He that loveth not knoweth not God; for God is love.",
                        who: "The First Letter of John",
                        cite: "1 John 4:8 (KJV)",
                      },
                      thinkers: ["schellenberg"],
                      cedes:
                        "Schellenberg would have to give way if openness to relationship turned out not to be part of perfect love, making this a question of hidden goods after all.",
                      see: [
                        { id: "mor-mansel", why: "John Stuart Mill answers a similar move in Objection V by saying that a goodness unlike ours isn't goodness." },
                        { id: "coh-a-analogy", why: "Whether openness belongs to perfect love depends on the dispute over analogy in Objection I." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        /* ── Premise two: Rea on unrecognized presence ── */
        {
          id: "hid-rea-presence",
          side: "theist",
          label: "People can meet God without knowing it is God",
          gist: "Feeling God near and God being near are different, and people can meet God in Scripture, worship and ordinary life without knowing it is him.",
          body: [
            "{{rea}} doubts premise two, which says no one can relate to God without first believing he exists. Feeling God near and God's being near are different things, he argues. Ordinary experiences of thunder, of beauty, or of a text read aloud in church can be experiences of God whether or not they come labeled. In 2009 he argued that Scripture and liturgy, the set forms of public worship, carry God's presence to anyone who takes part.",
            "{{stump}} and the philosopher Matthew Benton add that knowing a person may not require believing the person exists. A stranger can steady you long before you learn his name. Philosophers call a belief about a particular person, held without knowing who he is, [[de-re-belief|*de re*]], Latin for 'about the thing'. Stump and Benton think you can be in touch with God in this way before you believe that it is God you are in touch with. The psalmist asked, 'whither shall I flee from thy presence?' (Psalm 139:7).",
          ],
          quote: {
            text: "Surely the LORD is in this place; and I knew it not.",
            who: "Jacob, waking at Bethel",
            cite: "Genesis 28:16 (KJV)",
          },
          thinkers: ["rea", "stump"],
          cedes: "If relating to God requires believing, from the first moment, that it is God you are dealing with, Rea's reply doesn't work.",
          see: [{ id: "evi-a-experience", why: "Objection IV asks whether religious experience counts as evidence, and how common it is." }],
          sources: [
            {
              title: "Narrative, Liturgy, and the Hiddenness of God",
              by: "Michael C. Rea",
              year: "2009",
              note: "God's presence comes through Scripture and worship, open to anyone who takes part.",
            },
            {
              title: "God and Interpersonal Knowledge",
              by: "Matthew A. Benton",
              year: "2018",
              note: "Res Philosophica 95: 421–447.",
            },
            {
              title: "Theology and the Knowledge of Persons",
              by: "Eleonore Stump",
              year: "2018",
              note: "In Fiona Ellis (ed.), New Models of Religious Understanding, 172–190.",
            },
          ],
          children: [
            {
              id: "hid-presence-not-belief",
              side: "skeptic",
              label: "You can't relate to someone you don't believe is there",
              gist: "Schellenberg's argument is about a two-way relationship you know you're in, and an encounter you don't recognize as anyone isn't that.",
              body: [
                "{{schellenberg}} can grant that God might be present unrecognized, because his argument is about a *conscious* relationship, one you know you are in and can answer from your side. His premises require only belief, with no particular felt experience, because believing someone is there is the least such a relationship needs. Rea himself treats hiddenness as a family of problems, and his reply mainly addresses the believer's sense that God is absent.",
                "The stranger example supports Schellenberg, since you know the stranger who steadies you is someone, even without his name, while a nonbeliever who hears thunder thinks only of the weather. Jacob already believed in the God of his fathers when he woke at Bethel. The Bible itself says that 'he that cometh to God must believe that he is' (Hebrews 11:6). And someone raised where no liturgy is ever read never meets it at all.",
              ],
              quote: {
                text: "But if thou art everywhere, why do I not see thee present?",
                who: "Anselm of Canterbury",
                cite: "Proslogion ch. 1 (1077–78; tr. S. N. Deane)",
              },
              thinkers: ["schellenberg", "anselm"],
              cedes:
                "One clear case of a two-way relationship with God, in someone with no belief at all that he is there, would refute this.",
              children: [
                {
                  id: "hid-faith-without-belief",
                  side: "theist",
                  label: "Trust without belief is enough to begin a relationship with God",
                  gist: "You can trust God, hope in him and act on that hope while unsure he exists, so a relationship can begin before belief is settled.",
                  body: [
                    "Schellenberg's claim that relating to God requires believing in him doesn't fit faith as people live it. {{howard-snyder}} argues that [[nondoxastic-faith|faith that God exists doesn't require believing]] that he does, just as you can have faith that a friend will pull through surgery without quite believing she will. Such faith rests on hope and trust. The philosophers Ted Poston and Trent Dougherty add that belief comes in degrees, so someone for whom God is a live maybe can still turn toward him. The New Testament's own definition puts hope first: 'faith is the substance of things hoped for, the evidence of things not seen' (Hebrews 11:1).",
                    "In Mark's Gospel a father who can't settle his doubts prays anyway, and Jesus heals his son. Even {{schellenberg}}, in *The Will to Imagine* (2009), recommends a faith without belief, aimed at an ultimate reality he describes only in the most general terms, as the right response to religious doubt.",
                  ],
                  quote: {
                    text: "Lord, I believe; help thou mine unbelief.",
                    who: "A father, to Jesus",
                    cite: "Mark 9:24 (KJV)",
                  },
                  thinkers: ["howard-snyder", "schellenberg"],
                  cedes:
                    "If someone could hope in God and live by that hope with no relationship to him at all, this reply would fall.",
                  see: [
                    { id: "evi-a-trust", why: "Objection IV describes faith that begins as trust acted on, since no one can believe at will." },
                    { id: "evi-a-james", why: "William James on questions that cannot wait for the evidence." },
                  ],
                  sources: [
                    {
                      title: "Propositional Faith: What It Is and What It Is Not",
                      by: "Daniel Howard-Snyder",
                      year: "2013",
                      note: "American Philosophical Quarterly 50.",
                    },
                    {
                      title: "Divine Hiddenness and the Nature of Belief",
                      by: "Ted Poston and Trent Dougherty",
                      year: "2007",
                      note: "Religious Studies 43.",
                    },
                  ],
                  children: [
                    {
                      id: "hid-conscious-relationship",
                      side: "skeptic",
                      label: "Perfect love would want both sides aware from the start",
                      gist: "Hope can reach toward a God who might be there, but no one can knowingly be comforted or answered by someone they don't believe exists.",
                      body: [
                        "{{schellenberg}} replied in 2007, in an article whose title borrows Paul's 'through a glass, darkly', that the relationship perfect love seeks is conscious and two-way, and that faith without belief supplies only the human side of it. You can't knowingly receive comfort or forgiveness from someone you don't believe is giving it, and a child who hopes someone is in the next room is not yet being held. A perfectly loving God who could give more would not settle, even at the beginning, for a relationship one side can't know it is in. Howard-Snyder's reply also helps only people who already have the idea of God to hope toward, and many people never had it.",
                      ],
                      quote: {
                        text: "Oh that I knew where I might find him! that I might come even to his seat!",
                        who: "Job",
                        cite: "Job 23:3 (KJV)",
                      },
                      thinkers: ["schellenberg"],
                      cedes:
                        "I'd concede if a relationship one partner can't know is happening were as good, for as long as it lasts, as one both can know.",
                      see: [
                        { id: "hid-demographics", why: "Part 2 is about people who never had the idea of God to hope toward." },
                      ],
                      sources: [
                        {
                          title: "On Not Unnecessarily Darkening the Glass: A Reply to Poston and Dougherty",
                          by: "J. L. Schellenberg",
                          year: "2007",
                          note: "Religious Studies 43.",
                        },
                      ],
                      children: [
                        {
                          id: "hid-seeking-is-finding",
                          side: "theist",
                          label: "The relationship can start unnoticed and become two-way later",
                          gist: "Perfect love wants a relationship both sides know about, though not necessarily from the first day, and a seeker's longing may already be God's work.",
                          body: [
                            "Schellenberg assumes the relationship must be conscious from the start, since premise one says God would be open *always*, as if every delay were a refusal. A relationship meant to last forever could begin below awareness and be named later. {{augustine}} wrote that 'our heart is restless, until it repose in Thee' (*Confessions* I.1, tr. E. B. Pusey), and on his view the restlessness is already God's doing, the pull of the one it seeks.",
                            "{{aquinas}} says knowledge that God exists 'in a general and confused way is implanted in us by nature', though this 'is not to know absolutely that God exists; just as to know that someone is approaching is not the same as to know that Peter is approaching, even though it is Peter who is approaching' (*Summa Theologiae* I q.2 a.1, reply 1). His reason is that everyone naturally desires happiness, which is finally found in God, though many people think it lies in riches or pleasure. The Oxford philosopher T. J. Mawson asked in 2012 what deadline God has set for belief, and suggested death, or the end of all things. Paul expected the rest to come later: 'For now we see through a glass, darkly; but then face to face' (1 Corinthians 13:12).",
                          ],
                          quote: {
                            text: "Console thyself, thou wouldst not seek Me, if thou hadst not found Me.",
                            who: "Blaise Pascal",
                            cite: "Pensées 553, 'The Mystery of Jesus' (Brunschvicg numbering; tr. W. F. Trotter)",
                          },
                          thinkers: ["augustine", "pascal", "aquinas"],
                          cedes:
                            "The reply collapses if perfect love requires a relationship both sides are aware of at every moment, so that no delay, however short against eternity, could be loving.",
                          see: [
                            { id: "mor-inclusivism", why: "Objection V asks whether Christ can save people who sought the good without knowing his name." },
                          ],
                          sources: [
                            {
                              title: "The Rationality of Classical Theism and Its Demographics",
                              by: "T. J. Mawson",
                              year: "2012",
                              note: "In Y. Nagasawa (ed.), Scientific Approaches to the Philosophy of Religion, 184–204.",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "hid-horror",
              side: "skeptic",
              label: "God's silence when people suffer most refutes Rea's reply",
              gist: "If God allows horrors for reasons beyond us, love would at least let the sufferer know he is there, yet a child dying alone in pain gets no such sign.",
              body: [
                "{{rowe}}, an atheist philosopher best known for his argument from evil, argued that if God allows horrible suffering for reasons beyond our grasp, a loving God would at least be consciously present to the sufferer and assure her of his love, which Rea's unrecognized presence doesn't do. {{schellenberg}} argued in 2010 that hiddenness in the middle of horror makes a stronger case than either the problem of evil or the problem of hiddenness alone. His example is a child dying in pain, alone, with no sense of anyone there.",
                "Christians have said this too, among them {{lewis-cs}}, the author of *Mere Christianity*. After his wife died he wrote in *A Grief Observed* (1961) that if you go to God 'when your need is desperate, when all other help is vain', you find 'A door slammed in your face, and a sound of bolting and double bolting on the inside. After that, silence.'",
              ],
              quote: {
                text: "O my God, I cry in the day time, but thou hearest not; and in the night season, and am not silent.",
                who: "Psalm 22",
                cite: "Psalm 22:2 (KJV)",
              },
              thinkers: ["rowe", "schellenberg", "lewis-cs"],
              cedes:
                "Evidence that felt silence helps sufferers in a way felt presence could not would answer this.",
              see: [
                { id: "hid-skeptical-theism", why: "Rowe grants, for the sake of argument, that God may have reasons beyond us." },
              ],
              sources: [
                {
                  title: "The Hiddenness Problem and the Problem of Evil",
                  by: "J. L. Schellenberg",
                  year: "2010",
                  note: "Faith and Philosophy 27.",
                },
              ],
              children: [
                {
                  id: "hid-hiding-god",
                  side: "theist",
                  label: "The Bible's God hides, and believers have met him in lament",
                  gist: "The Bible's God hides his face, and Christians hear God himself in Jesus' cry from the cross, 'why hast thou forsaken me?'",
                  body: [
                    "The Bible never promised sufferers the felt presence Rowe expects, and {{luther}} and Pascal both made Isaiah's phrase, the [[deus-absconditus|hidden God]], central to their theology. {{rea}} argues that God authorizes the protests in the Psalms, so that arguing with an absent God is a way of being with him. {{john-of-the-cross}} described the [[dark-night|dark night]] as a time when God purifies love.",
                    "Luther taught a [[theology-of-the-cross|theology of the cross]], on which God shows himself most in weakness, and found God on the cross, where Jesus prays Psalm 22: 'My God, my God, why hast thou forsaken me?' {{adams-marilyn-m|Marilyn McCord Adams}} argues that God *defeats* horrors, her term for making them part of a life that is good on the whole, partly by sharing them, so that a child who dies alone can later see her worst hour as one God entered.",
                    "Lewis kept writing, and later in the same book he described God's silence differently: 'It is not the locked door. It is more like a silent, certainly not uncompassionate, gaze.'",
                  ],
                  quote: {
                    text: "Verily thou art a God that hidest thyself, O God of Israel, the Saviour.",
                    who: "The Book of Isaiah",
                    cite: "Isaiah 45:15 (KJV; Vulgate: Vere tu es Deus absconditus)",
                  },
                  thinkers: ["rea", "john-of-the-cross", "luther", "adams-marilyn-m", "lewis-cs"],
                  cedes:
                    "This reply fails if felt abandonment ends every relationship it touches, or if no sufferer, even afterward, could find God in her worst hour.",
                  see: [
                    { id: "hid-presence-not-belief", why: "A lament is addressed to someone, so it may already assume the belief the argument is about." },
                  ],
                  sources: [
                    {
                      title: "St. John of the Cross and the Necessity of Divine Hiddenness",
                      by: "Laura L. Garcia",
                      year: "2002",
                      note: "In Howard-Snyder & Moser (eds.), Divine Hiddenness: New Essays, 83–97.",
                    },
                    { title: "Horrendous Evils and the Goodness of God", by: "Marilyn McCord Adams", year: "1999" },
                    { title: "Christ and Horrors: The Coherence of Christology", by: "Marilyn McCord Adams", year: "2006" },
                  ],
                },
              ],
            },
          ],
        },

        /* ── Premise three: Moser on the willing ── */
        {
          id: "hid-moser",
          side: "theist",
          label: "God shows himself to people willing to be changed by him",
          gist: "Moser holds that God's evidence is meant to change people, so God gives it through conscience to everyone willing to be changed.",
          body: [
            "{{moser}} answers premise three by asking what kind of openness it tests. Being open to a relationship on your own terms, he argues, differs from being willing to yield to God as Lord. On Moser's view, evidence of a perfectly loving God is a call to change, so God makes it 'purposively available', given in the ways and to the people that suit his aim of remaking us. A message written in the sky would be what Moser calls spectator evidence. It would inform people and leave their wills untouched.",
            "The call comes first through conscience, Moser holds, as a pull toward unselfish love, even of enemies, so it reaches everyone. Demanding proof on our own terms before any surrender is what he calls [[cognitive-idolatry|cognitive idolatry]], treating God as an object to inspect. The promise in Jeremiah has a condition: 'ye shall seek me, and find me, when ye shall search for me with all your heart' (Jeremiah 29:13).",
          ],
          quote: {
            text: "There is enough light for those who only desire to see, and enough obscurity for those who have a contrary disposition.",
            who: "Blaise Pascal",
            cite: "Pensées 430 (Brunschvicg; pub. 1670; tr. W. F. Trotter)",
          },
          thinkers: ["moser", "pascal"],
          cedes:
            "Many people who were ready to let God remake their lives, who searched with all their heart and received nothing, would refute Moser.",
          see: [
            { id: "evi-a-james", why: "In Objection IV, William James argues that some truths show themselves only to people who commit first." },
          ],
          sources: [
            { title: "The Elusive God: Reorienting Religious Epistemology", by: "Paul K. Moser", year: "2008" },
            {
              title: "Cognitive Idolatry and Divine Hiding",
              by: "Paul K. Moser",
              year: "2002",
              note: "In Howard-Snyder & Moser (eds.), Divine Hiddenness: New Essays, 120–148.",
            },
          ],
          children: [
            {
              id: "hid-willing-found-nothing",
              side: "skeptic",
              label: "Seekers willing to be changed still found nothing",
              gist: "Many who begged to be remade lost their belief or never found it, and no seeker can promise obedience to a Lord she doesn't yet believe in.",
              body: [
                "If Moser is right, everyone willing to be changed should find God. {{schellenberg}} describes former believers who begged God to keep them believing and watched honest inquiry dissolve their faith, and lifelong seekers who knocked for years on a door that never opened. Moser's test also demands something no seeker can give in advance, since being willing to obey a Lord assumes you believe there is one. A doubter can offer only something like *if you are there, I am yours*, and that is what these seekers offered.",
                "{{pascal}} granted that such people exist. He describes those 'occupied in seeking Him, not having found Him', whom he calls 'unhappy and reasonable' (*Pensées* 257), and the fragment that promises 'enough light' also says God should not come so hidden 'that He could not be known by those who should sincerely seek Him' (*Pensées* 430). The same test would also confirm rival faiths. The Book of Mormon promises that 'if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you' (Moroni 10:4), and sincere askers come away with answers that contradict each other.",
              ],
              quote: {
                text: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.",
                who: "Jesus, in the Sermon on the Mount",
                cite: "Matthew 7:7 (KJV)",
              },
              thinkers: ["schellenberg", "pascal"],
              cedes:
                "I'd concede if the people who searched hardest and found nothing turned out, on some independent test, to have been less willing than those who found.",
              see: [
                { id: "evi-a-diversity", why: "In Objection IV, seekers in other traditions do find something, and what they find differs." },
                { id: "evi-a-tradition", why: "In Objection IV the Defender says the signs are public and God's existence can be proved, while Moser says the evidence goes only to the willing." },
              ],
              sources: [
                {
                  title: "The Wisdom to Doubt",
                  by: "J. L. Schellenberg",
                  year: "2007",
                  note: "Chapter 10 covers former believers, lifelong seekers, converts to religions with no personal God, and people who never heard of one.",
                },
              ],
              children: [
                {
                  id: "hid-hidden-resistance",
                  side: "theist",
                  label: "A seeker's divided will can explain God's silence",
                  gist: "Wanting evidence differs from being ready to be ruled by love, and a person's will can be divided without her knowing it, so sincere reports can't settle who is open.",
                  body: [
                    "The seekers' own reports can't settle the question. {{moser}} separates openness to proof from openness to God as Lord. A person can sincerely want the first while shrinking from the second, and can say *if you are there, I am yours* in earnest with a will still at war with itself. Schellenberg himself counts self-deception as resistance, and people who deceive themselves don't know they are doing it.",
                    "{{aquinas}}, quoting Aristotle, defined love as 'to wish good to someone' (*Summa Theologiae* I-II q.26 a.4), and {{stump}} reads him as holding that love also seeks union. Union needs a beloved who is whole inside, so a divided person can't receive full presence even when asking for it, through no one's fault, as you can't be fully known by a friend while hiding from yourself.",
                    "{{howard-snyder}} adds that belief given too soon, to someone who would answer with rejection or the wrong motives, could make the person harder to win.",
                  ],
                  quote: {
                    text: "A double minded man is unstable in all his ways.",
                    who: "The Letter of James",
                    cite: "James 1:8 (KJV)",
                  },
                  thinkers: ["moser", "stump", "aquinas", "howard-snyder"],
                  cedes:
                    "If those who search hardest and find nothing prove as humble and charitable as those who find God, this explanation falls apart.",
                  see: [
                    { id: "mor-chosen-hell", why: "Objection V describes a refusal of God that lasts as long as the will keeps turning away." },
                    { id: "mor-honest-doubter", why: "In Objection V the Objector asks whether the honest doubter is to blame or innocent, and argues that this reply has trouble either way." },
                  ],
                  sources: [
                    { title: "Wandering in Darkness: Narrative and the Problem of Suffering", by: "Eleonore Stump", year: "2010" },
                    {
                      title: "The Argument from Divine Hiddenness",
                      by: "Daniel Howard-Snyder",
                      year: "1996",
                      note: "Canadian Journal of Philosophy 26.",
                    },
                  ],
                  children: [
                    {
                      id: "hid-pursues",
                      side: "skeptic",
                      label: "A loving God would go after even those who resist him",
                      gist: "Even if some unbelief hid resistance, a loving parent helps a child out of a mess it partly made, and hidden resistance wouldn't follow national borders.",
                      body: [
                        "Even if some unbelief hides a divided will, a perfectly loving God would still go after it. {{maitzen}} writes: 'A loving parent can often be expected to help his or her child out of a miserable predicament, even if the child is in some sense to blame for being in the predicament.' The prodigal son's father didn't wait for a purer motive. And as {{schellenberg}} notes, God already relates to immature, double-minded believers, so readiness can't be a condition of belief.",
                        "Maitzen adds that whatever hidden fault is supposed to block belief, such as pride or a lack of humility, presumably doesn't cluster by country, yet unbelief follows national borders. And a resistance hidden even from the resister can't be checked, since no seeker's report could ever count against it.",
                      ],
                      quote: {
                        text: "But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.",
                        who: "Jesus, in the parable of the prodigal son",
                        cite: "Luke 15:20 (KJV)",
                      },
                      thinkers: ["maitzen", "schellenberg"],
                      cedes:
                        "This would be answered if belief given to a resister made healing less likely, and if hidden resistance showed some sign other than the unbelief it is meant to explain.",
                      see: [
                        { id: "mor-hell", why: "Objection V asks what judgment for unbelief adds to hiddenness." },
                        { id: "hid-demographics", why: "Maitzen on why the resistance story needs resistance to follow national borders." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        /* ── Premise one again: the freedom defense ── */
        {
          id: "hid-coercion-subtle",
          side: "theist",
          label: "Belief in an all-seeing judge would make goodness self-serving",
          gist: "If God's majesty were obvious to all, people would do good out of fear, and some distance leaves room to choose the good for its own sake.",
          body: [
            "Schellenberg assumes that giving everyone belief is always the loving thing to do, and defenders of free will argue that it isn't, if what love wants is a free answer. {{hick}} argued that people need [[epistemic-distance|epistemic distance]] from God, a distance in what they can know, so that God's existence doesn't overwhelm them and they can grow into goodness without being pressed into it. {{swinburne}} argues that moral choice needs a God whose existence is not too evident, because with God in plain view the right act would always be the prudent one.",
            "{{murray}} argued in 1993 that belief in a God who is all-powerful and judges every act would coerce, because coercion comes from a threat that is evident and near, and no one calls handing over a wallet at gunpoint generosity. {{kant}} imagined God and eternity 'with their awful majesty' (awful in the old sense, awe-inspiring) standing 'unceasingly before our eyes'. Then, he wrote, most lawful acts 'would be done from fear, a few only from hope, and none at all from duty', and human conduct would become a puppet show in which 'everything would gesticulate well, but there would be no life in the figures.'",
          ],
          quote: {
            text: "Thomas, because thou hast seen me, thou hast believed: blessed are they that have not seen, and yet have believed.",
            who: "Jesus, to Thomas",
            cite: "John 20:29 (KJV)",
          },
          thinkers: ["hick", "swinburne", "murray", "kant"],
          cedes:
            "This reply is finished if people certain of God turn out to do good as freely, and as much for its own sake, as anyone else.",
          see: [
            { id: "coh-b-spinoza", why: "Objection I asks what kind of freedom is at stake, and gives Spinoza's account of it." },
            { id: "mor-locked-door", why: "Objection V's freely chosen hell relies on the same freedom this reply protects." },
            { id: "mor-universalism", why: "Objection V asks whether a clear sight of God would finally win every will." },
          ],
          sources: [
            { title: "Evil and the God of Love", by: "John Hick", year: "1966", note: "Epistemic distance as the condition for growing into goodness." },
            { title: "The Existence of God", by: "Richard Swinburne", year: "2nd ed. 2004" },
            {
              title: "Coercion and the Hiddenness of God",
              by: "Michael J. Murray",
              year: "1993",
              note: "American Philosophical Quarterly 30.",
            },
            {
              title: "Critique of Practical Reason",
              by: "Immanuel Kant",
              year: "1788",
              url: "https://www.gutenberg.org/ebooks/5683",
              note: "Part I, Book II, ch. II, §IX, 'Of the Wise Adaptation of Man's Cognitive Faculties to his Practical Destination' (tr. T. K. Abbott).",
            },
          ],
          children: [
            {
              id: "hid-devils-believe",
              side: "skeptic",
              label: "Every good that hiddenness protects is open to believers too",
              gist: "The argument asks only for belief, and belief leaves people free, since devils believe and rebel and no one calls devout believers puppets.",
              body: [
                "The coercion reply confuses believing someone exists with being cornered by them. {{schellenberg}} asks only for belief, and Christian tradition itself holds that you can know God exists and still defy him. Thomas saw the wounds and Paul was thrown to the road, and neither lost his freedom. {{maitzen}} notes that churches praise believers for whom God is as certain as anything they know, and no one pities their lost freedom.",
                "{{kant}} worried about certainty as strong as sight, far beyond the modest belief Schellenberg asks for. In ((coh-b-teleo|Objection I)), defenders of God call wills that can't fall, like the saints', 'the freest of all'. Schellenberg's general answer, the [[accommodation-strategy|accommodation strategy]], is that every good these defenses name can be had inside belief. If relationship with God is the greatest good, no good that requires its absence could outweigh it.",
              ],
              quote: {
                text: "Thou believest that there is one God; thou doest well: the devils also believe, and tremble.",
                who: "The Letter of James",
                cite: "James 2:19 (KJV)",
              },
              thinkers: ["schellenberg", "maitzen", "kant"],
              cedes:
                "This fails if modest belief overwhelms the freedom of those who hold it, or if some good worth having can come only through real, temporary unbelief.",
              see: [
                { id: "hid-testimony-accommodation", why: "Part 2 uses the same strategy against the map of belief." },
                { id: "mor-allegiance", why: "In Objection V the Defender cites the same verse to show that bare belief saves no one." },
                { id: "coh-b-teleo", why: "In Objection I the Defender calls wills that never fall 'the freest of all'." },
              ],
              sources: [
                {
                  title: "The Hiddenness Argument Revisited (II)",
                  by: "J. L. Schellenberg",
                  year: "2005",
                  note: "Religious Studies 41. Replies to the freedom and coercion defenses.",
                },
              ],
              children: [
                {
                  id: "hid-responsibility",
                  side: "theist",
                  label: "Sharing God's work needs people who don't yet believe",
                  gist: "If God gave everyone belief directly, no one could join him in bringing others to know him, and that partnership needs people who don't know him yet.",
                  body: [
                    "Schellenberg's accommodation reply assumes every good survives if God puts the basic belief in place himself. {{dumsday}} argued in 2010 that one doesn't. Among the greatest goods open to us, he says, is working with God, as friends, to bring others to know him. That good needs people who don't yet believe and whose coming to believe depends partly on us. Paul called himself and his helpers 'labourers together with God' (1 Corinthians 3:9). {{swinburne}} adds the goods of finding God out for oneself and of helping one another search, and both would vanish if the answer came installed. Parents could do their children's homework, and love sometimes means they don't. On this view the unbelief is temporary, and the people no messenger reaches are still within God's reach.",
                  ],
                  quote: {
                    text: "How then shall they call on him in whom they have not believed? and how shall they believe in him of whom they have not heard? and how shall they hear without a preacher?",
                    who: "Paul, to the Romans",
                    cite: "Romans 10:14 (KJV)",
                  },
                  thinkers: ["dumsday", "swinburne"],
                  cedes:
                    "Dumsday is wrong if helping others come to God could be had as fully in a world where everyone already believed.",
                  see: [
                    { id: "hid-messengers", why: "Part 2 finds the same good in the map of belief, where faith passes from person to person." },
                    { id: "mor-inclusivism", why: "Objection V asks what becomes of people the messengers never reach." },
                  ],
                  sources: [
                    {
                      title: "Divine Hiddenness and the Responsibility Argument: Assessing Schellenberg's Argument against Theism",
                      by: "Travis Dumsday",
                      year: "2010",
                      note: "Philosophia Christi 12: 357–371.",
                    },
                    { title: "Providence and the Problem of Evil", by: "Richard Swinburne", year: "1998" },
                  ],
                },
              ],
            },
          ],
        },

        /* ── Premise one, classically: Hart's ground of being ── */
        {
          id: "hid-hart-light",
          side: "theist",
          label: "The loving God is the light we see by, so nothing is missing",
          gist: "The argument pictures God as one more being who could show up or not, but God is the source of all being and present in every thought.",
          body: [
            "Schellenberg's argument imagines God as a great someone who could step into view and has, for some reason, declined. Classical theism, the tradition of Augustine and Aquinas, rejects that picture. {{hart}} insists that God is no being among beings. He is being itself, the ground of every existence and every act of knowing, and looking for him among things is like looking for the light among the objects it lets you see. ((coh-a-concur|Objection I's counter)) says the same about causes.",
            "On this view God is hidden only the way the obvious is hidden, by being everywhere, and what the seeker lacks is attention. {{aquinas}} wrote that 'God is in all things; not, indeed, as part of their essence, nor as an accident, but as an agent is present to that upon which it works', and that he is in them 'innermostly' (*Summa Theologiae* I q.8 a.1). {{augustine}} found him the same way: 'Thou wert within, and I abroad, and there I searched for Thee' (*Confessions* X.27, tr. E. B. Pusey).",
          ],
          quote: {
            text: "For in him we live, and move, and have our being.",
            who: "Paul, at the Areopagus",
            cite: "Acts 17:28 (KJV)",
          },
          thinkers: ["hart", "aquinas", "augustine"],
          cedes: "The reply is in trouble if classical theism, to escape the argument, has to stop saying that God knows and loves each person.",
          see: [
            { id: "coh-a-concur", why: "In Objection I, God is said to ground every cause without competing with any." },
            { id: "mor-not-agent", why: "Brian Davies argues in Objection V that God is not a moral agent who owes each creature its due." },
          ],
          sources: [{ title: "The Experience of God: Being, Consciousness, Bliss", by: "David Bentley Hart", year: "2013" }],
          children: [
            {
              id: "hid-nonobject-belief",
              side: "skeptic",
              label: "A God who is no object can still put a belief in a mind",
              gist: "The argument never asked to see God among objects, only to believe he exists, and a God who causes every thought can cause that one.",
              body: [
                "Hart's point explains why God doesn't turn up in a telescope. It doesn't explain why honest people lack the belief, and belief is all {{schellenberg}} asked for. A God who is not one more thing can still cause a thought in a mind, and on the classical view he causes every thought there is. The argument also starts from love, which Hart says God is.",
                "Hart's own tradition says God can be known. {{aquinas}} holds that God's existence can be proved from his effects, and he explains why God revealed it anyway. The truth that reason can reach, he says, 'would only be known by a few, and that after a long time, and with the admixture of many errors' (*Summa Theologiae* I q.1 a.1). Revelation was meant as the remedy, but it travels by ((hid-demographics|birthplace and century)), so it reaches people as unevenly as the problem does.",
              ],
              quote: {
                text: "Now because we do not know the essence of God, the proposition is not self-evident to us; but needs to be demonstrated by things that are more known to us, though less known in their nature—namely, by effects.",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I q.2 a.1 (tr. Fathers of the English Dominican Province)",
              },
              thinkers: ["schellenberg", "aquinas"],
              cedes:
                "I'd concede if a God who causes every thought couldn't cause this one without ceasing to be the ground of being.",
              see: [
                { id: "nat-b-exist", why: "Objection III follows the route to God from his effects." },
                { id: "hid-sensus", why: "Part 2 asks whether every mind already has some sense of God, as Calvin held." },
              ],
            },
            {
              id: "hid-spinoza-my-god",
              side: "spinoza",
              label: "Spinoza says a God who hides from no one also seeks no one",
              gist: "A God who grounds everything is the most knowable thing there is, but such a God has no feelings and chooses nothing, so he seeks no one.",
              body: [
                "Spinoza would accept nearly every word of Hart's and draw the opposite conclusion. A God in whom we live and move is no object, and for that reason he isn't hidden at all. Spinoza wrote that 'The human mind has an adequate knowledge of the eternal and infinite essence of God' (*Ethics* II P47), where *adequate* means true and complete. He even claimed Paul's sentence, telling Oldenburg in 1675, 'I say that all things are in God and move in God, thus agreeing with Paul' (Letter 73).",
                "If God is the ground of being in Spinoza's full sense, the lover drops out. Spinoza's God 'is without passions' and, 'Strictly speaking, God does not love or hate anyone' (V P17 and Cor.). He 'does not act according to freedom of the will' (I P32 Cor. 1). Spinoza does speak of an [[amor-dei-intellectualis|intellectual love]] in which 'the love of God towards men, and the intellectual love of the mind towards God are identical' (V P36 Cor.), but that love chooses no one and waits for no reply. On Spinoza's view, Hart escapes the argument only by describing a God who couldn't want a relationship at all.",
              ],
              quote: {
                text: "He, who loves God, cannot endeavour that God should love him in return.",
                who: "Baruch Spinoza",
                cite: "Ethics V P19 (1677; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes:
                "Spinoza would be wrong if a God who is being itself could also choose to seek one person and wait on another without becoming one more thing among things.",
              see: [
                { id: "coh-a-collapse", why: "Objection I asks whether a God with no parts can choose freely at all, or creates by necessity." },
                { id: "hid-spinoza-allknow", why: "Spinoza's other point here is that every mind knows God, under the wrong name." },
                { id: "nat-b-necess", why: "Objection III explains why Spinoza's God chooses nothing, starting from the principle that everything has a reason." },
              ],
              children: [
                {
                  id: "hid-hart-personal",
                  side: "theist",
                  label: "God's love is no passion, yet in Christ it came seeking us",
                  gist: "God's love isn't a reaction to us, which makes it pure gift, and in Jesus that love came looking for the lost.",
                  body: [
                    "Classical theists agree with Spinoza that the ground of being has no passions. {{hart}} defends divine [[impassibility|impassibility]], the teaching that nothing we do adds to God's joy or wounds it. A love that isn't a reaction, Hart argues, is love with nothing to gain, the source of every reaching out. {{aquinas}} holds that God wills his own goodness necessarily but wills creatures freely, since 'no perfection can accrue to Him from them' (*Summa Theologiae* I q.19 a.3), a distinction ((coh-a-extrinsic|Objection I)) defends.",
                    "The Gospels deny that God seeks no one: 'the Son of man is come to seek and to save that which was lost' (Luke 19:10). {{kierkegaard}} told a parable about a king who loves a humble maiden and wants her love without her awe. A disguise would be a deceit, so Kierkegaard concluded that God would have to become a servant in fact, and that the servant form in Jesus was his true form. Jesus told Philip, 'he that hath seen me hath seen the Father' (John 14:9).",
                  ],
                  quote: {
                    text: "No man hath seen God at any time, the only begotten Son, which is in the bosom of the Father, he hath declared him.",
                    who: "The Gospel of John",
                    cite: "John 1:18 (KJV)",
                  },
                  thinkers: ["hart", "aquinas", "kierkegaard"],
                  cedes:
                    "Hart would be wrong if love required passion, being moved by the beloved, so that a God beyond change couldn't also know and seek each person.",
                  see: [
                    { id: "coh-a-extrinsic", why: "Objection I answers the worry that a necessary God makes everything necessary. God's act is necessary and its effects are not." },
                    { id: "hid-demographics", why: "Part 2 asks whether one incarnation, in one time and place, reaches everyone." },
                    { id: "nat-b-contrast", why: "In Objection III, Spinoza's reply to free creation is that a reason fitting either choice explains neither." },
                  ],
                  sources: [
                    {
                      title: "No Shadow of Turning: On Divine Impassibility",
                      by: "David Bentley Hart",
                      year: "2002",
                      note: "Pro Ecclesia 11.",
                    },
                    {
                      title: "Philosophical Fragments",
                      by: "Søren Kierkegaard",
                      year: "1844",
                      note: "Chapter 2: the parable of the king and the humble maiden.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────── II. THE MAP OF BELIEF ───────────────────── */
    {
      id: "hid-demographics",
      side: "skeptic",
      label: "A God open to every heart wouldn't let belief follow birthplace",
      gist: "If God were open to every heart, belief wouldn't depend on where and when you were born, but it clusters by culture and was absent for most of history.",
      body: [
        "{{maitzen}} looked at where believers live. Saudi Arabia is at least 95 percent theistic, meaning its people believe in one personal God, while Thailand, 95 percent Buddhist, is at most 5 percent theistic. No one supposes Thais resist God more than Saudis do. Culture and politics predict the pattern easily, and a God open to every heart makes it a puzzle.",
        "Over time the pattern is starker. For most of our species' history no one had the idea of a single personal creator to accept or resist, and {{schellenberg}} treats these people as the clearest cases. {{nietzsche}} had asked about a God who 'for thousands of years, has permitted innumerable doubts and scruples to continue unchecked'. {{marsh}} argued in 2013 that such [[natural-nonbelief|natural nonbelief]], unbelief from never having met the idea, is what unguided evolution predicts. Psychologists also find that belief spreads mainly by imitation, from parents and neighbors.",
      ],
      quote: {
        text: "…the patchiness of theistic belief has everything to do with the notoriously haphazard play of human culture and politics and nothing to do with God: the messy, uneven data have messy, uneven causes.",
        who: "Stephen Maitzen",
        cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 183",
      },
      thinkers: ["maitzen", "schellenberg", "nietzsche", "marsh"],
      cedes:
        "I'd concede if the spread of belief turned out to follow anything like openness of heart, and not birthplace and century.",
      see: [
        { id: "evi-a-diversity", why: "In Objection IV, religious experience divides along the same cultural lines." },
        { id: "mor-inclusivism", why: "Objection V asks whether people the gospel never reaches are lost, which makes this map matter more." },
      ],
      sources: [
        {
          title: "Divine Hiddenness and the Demographics of Theism",
          by: "Stephen Maitzen",
          year: "2006",
          url: "https://doi.org/10.1017/S0034412506008274",
          note: "Religious Studies 42: 177–191.",
        },
        { title: "Darwin and the Problem of Natural Nonbelief", by: "Jason Marsh", year: "2013", note: "The Monist 96." },
      ],
      children: [
        {
          id: "hid-messengers",
          side: "theist",
          label: "God works through messengers, so belief must travel unevenly",
          gist: "People learn most of what they know from one another, a good God would respect that, and knowledge passed hand to hand spreads unevenly.",
          body: [
            "Maitzen's map shows how knowledge of God travels from person to person. Nearly everything people know, from medicine to mathematics, they know by trusting one another. {{baker-hytch}} argued in 2016 that this [[mutual-epistemic-dependence|mutual dependence]] for knowledge is a great good, and that a God who values it should expect belief to spread unevenly, along the roads people travel.",
            "{{butler}} answered the objection in 1736. Nature hands out its gifts, such as health, strength, knowledge and the means to improve, 'with the most promiscuous variety', which in Butler's English means without regard to who needs or deserves them, and Butler held that revelation is handed out the same way. {{pascal}} even counted the diversity of religions as a sign of the hidden God: 'If there were only one religion, God would indeed be manifest' (*Pensées* 584).",
          ],
          quote: {
            text: "…the Author of Nature, in numberless instances, bestows that upon some, which he does not upon others, who seem equally to stand in need of it.",
            who: "Joseph Butler",
            cite: "The Analogy of Religion, Part II, ch. VI (1736)",
          },
          thinkers: ["baker-hytch", "butler", "pascal"],
          cedes:
            "This fails if God could keep every good of shared, handed-down knowledge while also giving each person belief directly.",
          see: [
            { id: "mor-inclusivism", why: "Objection V asks whether people the messengers never reach can still be saved." },
            { id: "hid-responsibility", why: "Dumsday's good of being a messenger, working with God to bring others to know him." },
          ],
          sources: [
            {
              title: "Mutual Epistemic Dependence and the Demographic Divine Hiddenness Problem",
              by: "Max Baker-Hytch",
              year: "2016",
              note: "Religious Studies 52.",
            },
          ],
          children: [
            {
              id: "hid-testimony-accommodation",
              side: "skeptic",
              label: "God could prize our witness and still reach everyone",
              gist: "Valuing testimony doesn't require leaving whole civilizations without the idea of God, since God could give everyone a bare belief and leave the rest to human witness.",
              body: [
                "Baker-Hytch's good doesn't require rationing the basics. A God who valued our dependence on one another could give every person the bare belief that he exists and leave the fuller knowledge of his character and will to be handed on. That would not leave the San of the Kalahari, or our ancestors for tens of thousands of years, without the idea at all. {{maitzen}} asked why the San, or any culture, should be 'less lucky' in this regard.",
                "Pascal's sign doesn't fit the map either, because religious diversity comes in sealed national blocs and hardly exists within each culture. The testimony reply predicts what an atheist would also predict, that belief goes wherever its carriers went. And Butler's comparison helps the objection, since truth handed out as unevenly as health is what the world would look like if there were no providence.",
              ],
              quote: {
                text: "…why doesn't this valuable diversity flourish within the cultures of Saudi Arabia and Thailand?",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 183",
              },
              thinkers: ["maitzen"],
              cedes: "A good of human witness that required whole peoples to lack even the idea of God would answer this.",
              see: [
                { id: "hid-devils-believe", why: "Schellenberg uses the same strategy against the freedom reply in Part 1." },
                { id: "hid-responsibility", why: "Dumsday names a good that is said to need real, temporary unbelief." },
              ],
            },
          ],
        },
        {
          id: "hid-middle-knowledge",
          side: "theist",
          label: "God places those who would respond where the message reaches",
          gist: "A God who knows what anyone would freely do can arrange history so that people who would respond are born where they can hear the gospel.",
          body: [
            "The map looks like an accident of birth only if God placed people at random. {{craig}} argued in 1989 that he need not have. If God has [[middle-knowledge|middle knowledge]], meaning he knows what every possible person would freely do in any situation, he can order history so that anyone who would accept the gospel is born where they will hear it. Those who never hear are people who would not have believed if they had heard, so no one misses out by the luck of the draw.",
            "Craig calls their condition transworld damnation, meaning that in no world God could make would they freely believe. On his account the unreached are lost by their own choice. Paul told the Athenians that God set the bounds of each people's dwelling so that they would seek him.",
          ],
          quote: {
            text: "…and hath determined the times before appointed, and the bounds of their habitation; That they should seek the Lord, if haply they might feel after him, and find him…",
            who: "Paul, at the Areopagus",
            cite: "Acts 17:26–27 (KJV)",
          },
          thinkers: ["craig"],
          cedes:
            "Craig's model fails if there is nothing for God to know about what people would freely do, or if those who would refuse in every circumstance can't be the ones born out of reach.",
          see: [
            { id: "coh-b-molina", why: "Objection I asks whether anything could make God's middle knowledge true." },
            { id: "hid-spared", why: "Jason Marsh's gentler version, in which the unreached are spared." },
          ],
          sources: [
            {
              title: "'No Other Name': A Middle Knowledge Perspective on the Exclusivity of Salvation through Christ",
              by: "William Lane Craig",
              year: "1989",
              note: "Faith and Philosophy 6.",
            },
          ],
          children: [
            {
              id: "hid-molinism-clustering",
              side: "skeptic",
              label: "Souls who'd refuse God don't come sorted by birthplace",
              gist: "Craig's story needs the people who would refuse God to be born mostly in certain countries and centuries, and nothing supports that apart from the map itself.",
              body: [
                "Craig's reply explains the map only by turning it into a fact about souls. Thailand would have to be where God placed people who would refuse him in any circumstances, along with the thousands of generations who lived before anyone preached a single creator. {{maitzen}} argued in 2006 and 2008 that this is implausible, and less plausible than the explanation from culture. Culture predicts the pattern without positing anything, while Craig needs an unseen sorting of souls that matches it border for border. His story implies that a child born in Bangkok is likelier than one born in Riyadh to be someone God foresaw would turn him down. And the sorting is needed only if the unreached are lost, which other defenders of God deny in ((mor-inclusivism|Objection V)).",
              ],
              quote: {
                text: "These dispositions thus resemble other fundamental human characteristics, such as the ability to hear; despite marked differences among individuals, we don't find entire countries whose citizens are nearly all deaf.",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 184",
              },
              thinkers: ["maitzen"],
              cedes:
                "I'd concede if independent evidence showed that people who would refuse God in every circumstance are concentrated where belief in God is rare.",
              see: [
                { id: "hid-pursues", why: "The same clustering problem, applied to hidden resistance." },
                { id: "coh-b-grounding", why: "Objection I raises a deeper problem, that nothing could make facts about what people would freely do true." },
                { id: "mor-inclusivism", why: "In Objection V the unreached can be saved, which leaves the sorting with nothing to do." },
              ],
              sources: [
                {
                  title: "Does Molinism Explain the Demographics of Theism?",
                  by: "Stephen Maitzen",
                  year: "2008",
                  note: "Religious Studies 44: 473–477.",
                },
              ],
            },
          ],
        },
        {
          id: "hid-spared",
          side: "theist",
          label: "God may spare would-be refusers by placing them out of reach",
          gist: "A loving God who foresaw that some people would reject him if they believed now might keep belief from them, leaving them innocent for a later chance.",
          body: [
            "{{marsh|Jason Marsh}} proposed a gentler model in a 2008 reply to {{maitzen}}. He supposes that some people would freely reject God in this life if they came to believe. A loving God might spare them that refusal by placing them where belief won't reach them, keeping them innocent until a later time, beyond this life, when they could love him freely. Then an uneven map is what perfect love, knowing each of us, would draw. Unlike Craig's model, this one damns no one. The unreached are protected, which fits the hope, discussed in ((mor-inclusivism|Objection V)), that Christ reaches those who never knew his name. A refusal made too early, with too little understanding, is the kind of harm a good parent shields a child from.",
          ],
          quote: {
            text: "If I had not come and spoken unto them, they had not had sin: but now they have no cloak for their sin.",
            who: "Jesus, in John's Gospel",
            cite: "John 15:22 (KJV)",
          },
          thinkers: ["marsh", "maitzen"],
          cedes:
            "This fails if hearing of God never makes a refusal more likely or more lasting, so that no one could need sparing from it.",
          see: [
            { id: "hid-seeking-is-finding", why: "Another 'not yet', a relationship that can be completed after death." },
            { id: "hid-hidden-resistance", why: "Howard-Snyder argues that belief given too soon could harden what it hoped to win." },
          ],
          sources: [
            {
              title: "Do the Demographics of Theistic Belief Disconfirm Theism? A Reply to Maitzen",
              by: "Jason Marsh",
              year: "2008",
              note: "Religious Studies 44: 465–471.",
            },
          ],
          children: [
            {
              id: "hid-missionary",
              side: "skeptic",
              label: "On Marsh's model, missionaries endanger those God spared",
              gist: "If God shields would-be refusers by keeping belief from them, every missionary who reaches them removes the shield and exposes them to the refusal God meant to prevent.",
              body: [
                "Marsh's model has a problem with missionaries. If God places people who would refuse him where belief won't reach them, for their own protection, then whoever brings belief to them removes that protection. Every new mission field would be a region of people God was guarding, and every sermon there would risk the refusal he arranged history to prevent. Jesus' command to teach all nations becomes either a mistake or a bet against God's own arrangement.",
                "Marsh could reply that God foresaw the missionaries too, and puts in their path only people ready to hear. Then the map is no longer mercy for the unreached. It becomes Craig's sorting of souls by birthplace again, with all of {{maitzen}}'s ((hid-molinism-clustering|clustering problems)). And since nothing independent tells us who is being spared, the model fits any map at all.",
              ],
              quote: {
                text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost",
                who: "Jesus, in Matthew's Gospel",
                cite: "Matthew 28:19 (KJV)",
              },
              thinkers: ["marsh", "maitzen"],
              cedes:
                "This objection goes away if the model can say whom God is sparing without pointing to where the gospel hasn't reached.",
              see: [
                { id: "hid-responsibility", why: "Dumsday's good of being a messenger, which this model turns into a hazard." },
              ],
            },
          ],
        },
        {
          id: "hid-sensus",
          side: "theist",
          label: "Every mind is built to sense a maker, whatever the map shows",
          gist: "Calvin held that everyone has a built-in sense of God, and children everywhere seem primed to see a maker, so the map shows how cultures name that sense.",
          body: [
            "Maitzen's map counts creeds, and the sense of God lies underneath creeds. {{calvin}} held it 'beyond dispute' that the human mind has, 'by natural instinct, some sense of Deity', the [[sensus-divinitatis|sensus divinitatis]] ('sense of the divine'). {{plantinga}} built this into a model on which belief in God is [[properly-basic|properly basic]], reasonable without argument, like trusting your memory. On his model sin has damaged the faculty in ways people inherit, so unbelief need not be anyone's fault.",
            "[[csr|Cognitive science of religion]], the study of how ordinary minds come to religious ideas, gives the old claim some support. {{barrett}} reports in *Born Believers* (2012) that young children everywhere see purpose in nature and credit a super-knowing maker, and the psychologist Deborah Kelemen asked whether children are 'intuitive theists'. {{evans}} calls such pointers natural signs, widely available and easy to resist. Culture, on this view, changes what people call them.",
          ],
          quote: {
            text: "…God himself, to prevent any man from pretending ignorance, has endued all men with some idea of his Godhead, the memory of which he constantly renews and occasionally enlarges…",
            who: "John Calvin",
            cite: "Institutes of the Christian Religion I.3.1 (1559; tr. Henry Beveridge)",
          },
          thinkers: ["calvin", "plantinga", "barrett", "evans"],
          cedes:
            "Whole populations lacking the natural sense of the divine, or with one that points nowhere near God, would refute this.",
          see: [
            { id: "evi-a-basic", why: "Objection IV treats belief in God as properly basic, like belief in other minds." },
            { id: "mor-honest-doubter", why: "In Objection V, Calvin's charge of suppression and Plantinga's no-fault version each feed one side of the honest doubter's dilemma." },
          ],
          sources: [
            { title: "Born Believers: The Science of Children's Religious Belief", by: "Justin L. Barrett", year: "2012" },
            { title: "Natural Signs and Knowledge of God: A New Look at Theistic Arguments", by: "C. Stephen Evans", year: "2010" },
          ],
          children: [
            {
              id: "hid-csr-both-ways",
              side: "skeptic",
              label: "The built-in sense finds spirits, so it's no pointer to God",
              gist: "Cognitive science finds a readiness to see agents and purposes everywhere, which produces ghosts and ancestors as easily as one God.",
              body: [
                "The cognitive science doesn't give Calvin what he needs. It describes a hair-trigger for detecting agents, which Barrett calls the [[hadd|hypersensitive agency detection device]] (the reflex that turns a rustle in the grass into someone), and a bias toward seeing purpose everywhere. These produce spirits, ancestors and many gods as readily as a loving creator. {{hume}} noticed the habit in 1757: 'We find human faces in the moon, armies in the clouds.' The philosopher Helen De Cruz concluded in 2015 that the science shows a pull toward supernatural agents in general.",
                "Widening 'theism' to cover any supernatural being, says {{maitzen}}, 'merely changes the subject'. If uptake of Evans's signs is what varies, it varies by birthplace, and resistance does not follow borders. Calvin's own sentence ends in accusation. The sense exists so that all 'may be condemned by their own conscience', and a faculty that mostly produced other gods is a strange tool for that.",
              ],
              quote: {
                text: "Granted, belief in the supernatural is more widespread and more evenly distributed than belief in God, but divine hiddenness is a problem for theism in particular, not for supernaturalism in general.",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 179",
              },
              thinkers: ["maitzen", "hume"],
              cedes:
                "I'd concede if the natural sense of the divine pointed, across cultures, toward one loving creator more than toward many spirits.",
              see: [
                { id: "evi-a-pumpkin", why: "In Objection IV, a natural faculty that grounds belief grounds every tradition's belief." },
                { id: "nat-b-minds", why: "Objection III asks whether evolved minds can be trusted on questions like this." },
                { id: "mor-daybreak", why: "In Objection V, Nietzsche argues that explaining how a belief arose strips it of its evidence." },
              ],
              sources: [
                {
                  title: "Divine Hiddenness and the Cognitive Science of Religion",
                  by: "Helen De Cruz",
                  year: "2015",
                  note: "In Green & Stump (eds.), Hidden Divinity and Religious Belief, 53–68.",
                },
                {
                  title: "The Natural History of Religion",
                  by: "David Hume",
                  year: "1757",
                  url: "https://davidhume.org/texts/n/3",
                  note: "Section 3, on the human habit of seeing faces and purposes everywhere.",
                },
              ],
              children: [
                {
                  id: "hid-designed-faculty",
                  side: "theist",
                  label: "A God-given seed can sprout as spirits and still lead to God",
                  gist: "A natural faculty can be God's design even when it misfires, as sight survives its illusions, and a sense of the sacred that first finds spirits can grow toward God.",
                  body: [
                    "That the sense overshoots doesn't show it isn't God's. Vision produces illusions and still sees, and a smoke alarm that goes off for burnt toast is still a smoke alarm. Kelly James Clark and {{barrett}} follow {{reid|Thomas Reid}}, who held that we trust perception and memory without first proving them reliable. Tracing a belief to its mechanism commits the [[genetic-fallacy|genetic fallacy]], judging a belief by where it came from, unless the mechanism is shown unreliable on that question. {{calvin}} said that 'a seed of religion is divinely sown in all', though 'scarcely one in a hundred is found who cherishes it in his heart'.",
                    "On the testimony view God planted both the seed and the gardeners. {{rea}} argues that a relationship with God need not run through a standard concept of God, so people whose sense of the sacred found spirits and ancestors were not cut off from the one they were groping toward.",
                  ],
                  quote: {
                    text: "Whom therefore ye ignorantly worship, him declare I unto you.",
                    who: "Paul, at the Areopagus",
                    cite: "Acts 17:23 (KJV)",
                  },
                  thinkers: ["barrett", "reid", "calvin", "rea"],
                  cedes:
                    "This fails if the sense of the sacred is unreliable about whether there is a God at all, beyond being wrong about which spirits there are.",
                  see: [
                    { id: "mor-daybreak", why: "Nietzsche's argument from origins in Objection V, which this reply resists." },
                    { id: "evi-a-function", why: "Objection IV asks when a faculty working as designed makes belief rational without argument." },
                  ],
                },
              ],
            },
            {
              id: "hid-spinoza-allknow",
              side: "spinoza",
              label: "Spinoza says every mind knows God, as the order of nature",
              gist: "Spinoza agrees with Calvin that everyone knows God, but what they know is the eternal order of things, and what people reject is only an image of a judge.",
              body: [
                "Spinoza agrees with Calvin that every mind knows God, since to know anything through its causes is to see it following from God's nature (*Ethics* II P45–47). People miss this, he says, because 'they have associated the name God with images of things that they are in the habit of seeing', so they don't recognize what they already know.",
                "But what everyone knows, on Spinoza's view, is the eternal order of things, with no maker in it watching for submission. That is why 'No one can hate God' (V P18). The idea of God in us is adequate, meaning true and complete, and understanding brings no pain. What the supposed resister turns away from is an [[imaginatio|image]], a judge built out of human hopes and fears, of the kind Spinoza takes apart in the Appendix to *Ethics* I. The map shows where that image was taught, and nothing about anyone suppressing God.",
              ],
              quote: {
                text: "Hence we see, that the infinite essence and the eternity of God are known to all.",
                who: "Baruch Spinoza",
                cite: "Ethics II P47 Schol. (1677; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes:
                "Spinoza would be wrong if some mind could know anything at all without, in that knowing, knowing something of God.",
              see: [
                { id: "evi-a-imagination", why: "In Objection IV, Spinoza counts a God known by feeling as imagination." },
                { id: "hid-spinoza-my-god", why: "Spinoza's other point here, that a God who hides from no one seeks no one." },
                { id: "nat-b-parallel", why: "Objection III explains why, for Spinoza, every mind knows God. Thought and things are one order." },
              ],
            },
          ],
        },
      ],
    },
  ],

  spinoza: {
    title: "The God who cannot hide",
    body: [
      "The hiddenness argument gets no grip on Spinoza's [[deus-sive-natura|God, or Nature]]. On his view God is the most knowable thing there is, since every mind that knows anything has an adequate idea of God's eternal essence (*Ethics* II P47). In the *Theological-Political Treatise* (1670) he denied that miracles could show God, and wrote that God's nature and existence 'can all be much better perceived from the fixed and immutable order of nature' (ch. 6). A God who could appear as an event could also fail to appear, and a God who is the order every event displays can't. {{schellenberg}} himself aims the argument only at a personal God, and leaves room for an ultimate reality that is not a person.",
      "Like {{calvin}}, and against Schellenberg, Spinoza holds that no one lacks knowledge of God, and that the nonbeliever has only attached the name to the wrong images. Like Schellenberg, and against Calvin and {{moser}}, he holds that no one is suppressing a judge or refusing a Lord, because 'No one can hate God' (V P18), and God, being without passions, 'does not love or hate anyone' (V P17 Cor.). The freedom reply gets no help from him either, since 'In the mind there is no absolute or free will' (II P48).",
      "Spinoza has a hiddenness problem of his own. If every mind holds the idea of God, why do almost none live by it? He asks this on the last page of the *Ethics* and answers that salvation is rare because it is hard (V P42 Schol.). The answer works for him because no one, on his view, is trying to be found. Without a God who wants us, an uneven map is a fact about people and evidence against nothing. Christians and Spinoza disagree about whether that answers the seeker's longing or tells the seeker, politely, that no one is there.",
    ],
    quote: {
      text: "How would it be possible, if salvation were ready to our hand, and could without great labour be found, that it should be by almost all men neglected? But all things excellent are as difficult as they are rare.",
      who: "Baruch Spinoza",
      cite: "Ethics V P42 Schol. (1677; tr. R. H. M. Elwes)",
    },
  },

  lineage: [
    "m-hid-isaiah",
    "m-hid-anselm",
    "m-hid-john-of-the-cross",
    "m-hid-pascal",
    "m-hid-spinoza",
    "m-hid-butler",
    "m-hid-kant",
    "m-hid-nietzsche",
    "m-hid-einstein",
    "m-hid-lewis",
    "m-hid-craig",
    "m-hid-mckim",
    "m-hid-schellenberg-1993",
    "m-hid-maitzen",
    "m-hid-schellenberg-2007",
    "m-hid-moser",
    "m-hid-marsh",
    "m-hid-rea",
  ],

  reading: [
    {
      title: "The Hiddenness Argument: Philosophy's New Challenge to Belief in God",
      by: "J. L. Schellenberg",
      year: "2015",
      note: "Schellenberg restates his argument for general readers.",
    },
    {
      title: "The Hiddenness of God",
      by: "Michael C. Rea",
      year: "2018",
      note: "Rea's Gifford Lectures. He argues that God's love needn't look like a parent's, and that God is more present than we notice.",
    },
    {
      title: "The Elusive God: Reorienting Religious Epistemology",
      by: "Paul K. Moser",
      year: "2008",
      note: "Moser argues that God gives evidence of himself on purpose, to people willing to be changed by it.",
    },
    {
      title: "Divine Hiddenness and the Demographics of Theism",
      by: "Stephen Maitzen",
      year: "2006",
      url: "https://doi.org/10.1017/S0034412506008274",
      note: "Religious Studies 42. The article behind Part 2, arguing that the uneven spread of belief may be the hardest form of the problem.",
    },
    {
      title: "Pensées",
      by: "Blaise Pascal",
      year: "1670",
      url: "https://www.gutenberg.org/ebooks/18269",
      note: "Trotter's translation. Pascal argues that a true religion must say God is hidden, and explain why.",
    },
    {
      title: "Hiddenness of God (Stanford Encyclopedia of Philosophy)",
      by: "Daniel Howard-Snyder and Adam Green",
      url: "https://plato.stanford.edu/entries/divine-hiddenness/",
      note: "A careful survey of the debate, with the main replies on both sides.",
    },
  ],
};

export default hiddenness;
