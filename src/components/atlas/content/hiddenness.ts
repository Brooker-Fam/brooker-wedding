import type { Objection } from "../types";

/* Objection II — Divine hiddenness. Two prongs: Schellenberg's argument from
   nonresistant nonbelief, and Maitzen's map of belief. Every quotation below was
   checked word for word against a public-domain text (KJV; Elwes's Spinoza;
   Trotter's Pascal; Kennedy's Nietzsche; Abbott's Kant; Deane's Anselm;
   Beveridge's Calvin; the English Dominican Summa; Butler's Analogy on CCEL;
   Lewis's A Grief Observed, Project Gutenberg Canada) or, for Maitzen, against
   the published article (Religious Studies 42, 2006). Marsh (2008), Craig (1989)
   and Maitzen (2008) are paraphrased, not quoted. */

const hiddenness: Objection = {
  id: "hiddenness",
  numeral: "II",
  short: "Hiddenness",
  title: "A God who wanted us wouldn't hide",
  objection:
    "Divine hiddenness: a God who wanted a relationship with us wouldn't leave a sincere, open seeker with nothing (J. L. Schellenberg).",
  counter:
    "Michael Rea argues that divine love needn't look like a parent's, and that God can be present without being felt. Paul Moser argues that the evidence is offered to people willing to be changed, not to spectators.",
  dek: "Call it the quiet cousin of the problem of evil: not why God permits suffering, but why so many honest people, some searching hard, some never told, find no one there. The skeptic brings two cases, a seeker who comes up empty and a map on which belief follows birthplace. The replies: God's love isn't a parent's, he can be present without being felt, and the evidence waits for those willing to be changed.",
  question: "Would a perfectly loving God leave anyone who isn't running from him unsure he is there?",

  prongs: [
    /* ───────────────────── I. THE OPEN SEEKER ───────────────────── */
    {
      id: "hid-argument",
      side: "skeptic",
      label: "Open seekers left in the dark rule out a perfectly loving God",
      gist: "A perfectly loving God would always be open to a relationship with each of us, and that starts with believing he exists; yet some honest people who aren't turning away still don't believe, so there is no such God.",
      body: [
        "Start from the theist's own God, not from a shortage of miracles. {{schellenberg}} turns [[perfect-being-theology|perfect being theology]] back on itself. One: a perfectly loving God would always be open to a conscious, two-way relationship with every creature capable of one. Two: you cannot relate to someone you don't believe is there, so such a God would see to it that no capable person lacked belief except by resisting him. Three: yet [[nonresistant-nonbelief|nonresistant nonbelief]] exists, in former believers who prayed to keep their faith, in lifelong seekers, in converts to faiths with no personal God, such as Buddhism, and in the many humans who never met the idea of a personal God at all. So there is no perfectly loving God.",
        "The argument asks for very little: no visions, no proofs, only belief within reach of anyone not turning away. {{nietzsche}} put the complaint in a sentence in 1881; {{mckim}} framed it as an argument in 1990; Schellenberg made it a deduction in 1993, and philosophers have been answering it ever since.",
      ],
      quote: {
        text: "An omniscient and omnipotent God who does not even take care that His intentions shall be understood by His creatures—could He be a God of goodness?",
        who: "Friedrich Nietzsche",
        cite: "Daybreak (The Dawn of Day) §91 (1881; tr. J. M. Kennedy, 1911)",
      },
      thinkers: ["schellenberg", "nietzsche", "mckim"],
      cedes:
        "I'd concede if a perfectly loving God could be shown to have a reason, worth more than the relationship itself, to leave someone who isn't resisting without even belief, or if no one is really in that position.",
      see: [
        { id: "hid-demographics", why: "The second prong: the same unbelief, mapped by birthplace and century." },
        { id: "evi-a", why: "Objection IV asks why belief outruns the evidence; this one asks why the evidence is so thin." },
        { id: "mor-hell", why: "Add judgment for unbelief to hiddenness and objection V's charge grows sharper." },
      ],
      sources: [
        {
          title: "The Hiddenness Argument: Philosophy's New Challenge to Belief in God",
          by: "J. L. Schellenberg",
          year: "2015",
          note: "The argument restated for general readers; the premises are set out at p. 103.",
        },
        { title: "Divine Hiddenness and Human Reason", by: "J. L. Schellenberg", year: "1993", note: "The original argument from reasonable nonbelief." },
      ],
      children: [
        /* ── Premise one: Rea on transcendent love ── */
        {
          id: "hid-rea-love",
          side: "theist",
          label: "God's love needn't look like a parent's, so he may stay hidden",
          gist: "Premise one pictures God's love as an ideal parent's, but a God far beyond us can love perfectly without loving the way we do, so we can't deduce that he must make himself known to everyone.",
          body: [
            "Premise one smuggles in a picture: perfect love in God must look like the best human love, a parent's or a friend's, scaled up and always reaching out. {{rea}} argues, in his 2017 Gifford Lectures, that the picture buys God's personality at the cost of his transcendence. A God beyond every kind of thing is spoken of truly only by [[analogy-of-being|analogy]], and analogy does not let us deduce what his love must do in our case.",
            "Rea's sharper point borrows from Susan Wolf's essay on moral saints: a life organized wholly around other people's welfare is not the ideal it seems, and a God whose every act revolved around us would be less like God, not more. Divine love is perfect, but it takes its shape from God's own goodness and purposes, not from our needs. 'A loving God would surely…' is not a premise we can read off our own families.",
          ],
          thinkers: ["rea"],
          cedes:
            "I'd concede if it could be shown that any love worth calling perfect must, at every moment, seek the beloved's awareness of it.",
          see: [
            { id: "coh-a-analogy", why: "Objection I's defense of analogy: speaking truly of God without making him one of us." },
            { id: "mor-not-agent", why: "Objection V's version: God's goodness isn't a human judge's duties writ large." },
          ],
          sources: [
            {
              title: "The Hiddenness of God",
              by: "Michael C. Rea",
              year: "2018",
              note: "The Gifford Lectures (St Andrews, 2017); ch. 5 on a love that is perfect without being 'ideal'.",
            },
          ],
          children: [
            {
              id: "hid-love-emptied",
              side: "skeptic",
              label: "A love that won't let you know it's there is a lesser love",
              gist: "We can easily picture a greater love than one that leaves a willing beloved forever unsure the lover exists, and God's love is supposed to be the greatest possible, so Rea's reply lowers God's love instead of explaining it.",
              body: [
                "Throw out the parent picture and the argument still stands. All it needs is what theists already say: God's love cannot be surpassed. Compare two lovers. One, though able, leaves someone who would welcome him forever unsure he exists. The other makes himself known. Anyone can see the first is the lesser love. That ranking is all premise one claims.",
                "Nor is the wish to be known a parental guess. Scripture says God 'will have all men to be saved, and to come unto the knowledge of the truth' (1 Timothy 2:4), and Theodore Drange made such verses a premise of his argument from nonbelief (1998). Rea's refinement makes things worse: a love shaped partly by the lover's own interests is surpassed by the self-giving love Christians see on the cross. Stretch the word past all that and you meet ((coh-a-dogstar|Spinoza's warning)): a love unlike ours would resemble ours only as the Dog Star resembles the dog that barks, one name with no [[univocity|shared sense]] left to argue about.",
              ],
              quote: {
                text: "If ye then, being evil, know how to give good gifts unto your children, how much more shall your Father which is in heaven give good things to them that ask him?",
                who: "Jesus, in the Gospel of Matthew",
                cite: "Matthew 7:11 (KJV)",
              },
              thinkers: ["schellenberg"],
              cedes:
                "I'd concede if a love that leaves a willing beloved unaware of it could be shown to be no less a love than one that makes itself known.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's dog-star argument in objection I: a divine mind unlike ours shares only a name with ours." },
                { id: "hid-pursues", why: "The prodigal's father again: love that runs out to meet the son." },
                { id: "coh-a-univocal", why: "Scotus's dilemma underneath this one: a word said of God needs a shared core, or it carries no argument." },
              ],
              sources: [
                { title: "Nonbelief and Evil: Two Arguments for the Nonexistence of God", by: "Theodore M. Drange", year: "1998" },
              ],
              children: [
                {
                  id: "hid-skeptical-theism",
                  side: "theist",
                  label: "We can't see far enough to judge what perfect love would do",
                  gist: "That a hiding love looks lesser to us is weak evidence that it is lesser, because we have no good grasp of all the goods, and the links between them, that an infinite mind can see.",
                  body: [
                    "Ranking the two lovers works only if we can survey everything that hangs on the choice, and we can't. That is the claim of [[skeptical-theism|skeptical theism]]. Love keeps its plain meaning; what we lack is the vantage to read off its means and timing. A four-year-old cannot see why a good parent says not yet; the distance between us and God is greater than that.",
                    "Justin McBrayer and Philip Swenson point out (2012) that the argument leans on an unstated premise: if God had a reason to permit nonresistant nonbelief, we would probably see it. Nothing supports that premise. {{bergmann}}'s general case applies: the goods we know of are no representative sample of the goods there are. Not seeing a reason is not seeing that there is none.",
                  ],
                  quote: {
                    text: "For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.",
                    who: "The Book of Isaiah",
                    cite: "Isaiah 55:9 (KJV)",
                  },
                  thinkers: ["bergmann"],
                  cedes:
                    "I'd concede if it could be shown that the goods at stake in hiddenness are all goods we can fully survey.",
                  see: [
                    { id: "hid-responsibility", why: "One reason the theist can actually name: a good that needs someone's temporary unbelief." },
                    { id: "mor-not-agent", why: "Objection V's other route around the hell charge: God is not an agent bound by our duties." },
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
                      gist: "Appeals to reasons we can't see may weaken arguments that pile up unexplained evils, but this one reasons from what perfect love is, and the goods in question would be human goods we understand well.",
                      body: [
                        "Skeptical theism is a good shield against a different kind of argument. It blunts inductive cases: I see no reason for this evil, so probably there is none. {{schellenberg}} argues from above, from what perfect love is. If openness to relationship belongs to such love, then appealing to unknown reasons is what he calls a 'logical foul': the argument is deductive, so if its premises can be seen to be true, ignorance of hidden goods cannot touch the conclusion.",
                        "The reasons on offer would also have to be goods for us, goods of human relationship and growth, the things we understand best. And the skeptical move does not stay put. If we cannot judge what perfect love would do about our unbelief, we cannot judge what it would do about its promises either, and 'I will never leave thee' becomes as unknowable as the rest.",
                      ],
                      thinkers: ["schellenberg"],
                      cedes:
                        "I'd concede if openness to relationship could be shown not to belong to perfect love itself, so that the question really is one of hidden goods.",
                      see: [
                        { id: "mor-mansel", why: "Objection V: Mill's reply to a kindred move, that a goodness unlike ours is not goodness." },
                        { id: "coh-a-analogy", why: "Whether openness belongs to perfect love at all is what objection I's dispute over analogy decides." },
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
          label: "God meets us unrecognized, so no one is left with nothing",
          gist: "Feeling God near and God being near are different things; God offers himself through Scripture, worship and ordinary experience, often unrecognized, and you can know someone before you know who they are.",
          body: [
            "Premise two says no one can relate to God without first believing he exists. {{rea}} doubts it. Feeling that God is near is one thing, God's being near another, and experiencing God need not involve anything exotic: ordinary, naturally caused experiences of thunder, of beauty, of a text read aloud in worship can be experiences of God whether or not they come labeled. Scripture and liturgy, he argued in 2009, carry God's presence to anyone who takes them up.",
            "Behind this lies an old distinction: knowing a person is not knowing facts about them. {{stump}} and Matthew Benton argue that such knowledge may not even require believing the person exists, as you can be steadied and changed by a stranger long before you learn his name. That is contact [[de-re-belief|de re]], with the one who is in fact God, before any belief *de dicto* that it is God. The psalmist found nowhere to flee from God's presence. Recognition is something a relationship can grow into.",
          ],
          quote: {
            text: "Surely the LORD is in this place; and I knew it not.",
            who: "Jacob, waking at Bethel",
            cite: "Genesis 28:16 (KJV)",
          },
          thinkers: ["rea", "stump"],
          cedes: "I'd concede if relationship with God required *de dicto* belief, believing that it is God, from its first moment.",
          see: [{ id: "evi-a-experience", why: "Objection IV: religious experience as evidence, and how widespread it is." }],
          sources: [
            {
              title: "Narrative, Liturgy, and the Hiddenness of God",
              by: "Michael C. Rea",
              year: "2009",
              note: "God's presence mediated by Scripture and worship, open to anyone who engages them.",
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
              gist: "The argument asks for a conscious, two-way relationship, and an encounter no one recognizes as anyone isn't that; to relate to someone, you have to believe someone is there.",
              body: [
                "Unrecognized acquaintance is real, but it is not what the argument asks for. {{schellenberg}}'s relationship is *conscious*: one you know you are in, and can answer from your side. His premises ask only for belief, not for any particular felt experience, because belief that someone is there is the least such a relationship needs. Rea himself treats hiddenness as a family of problems, and this reply is aimed chiefly at the believer's sense of absence.",
                "The stranger analogy proves the point. You know the stranger who steadies you is someone, even without his name; to the nonbeliever, liturgy is words and thunder is weather, and no one is there to answer. Jacob already believed in the God of his fathers when he woke at Bethel. Even {{anselm}}, a saint and a believer, asked why the God who is everywhere was nowhere to be seen. And someone raised where no liturgy is ever read never meets it at all.",
              ],
              quote: {
                text: "But if thou art everywhere, why do I not see thee present?",
                who: "Anselm of Canterbury",
                cite: "Proslogion ch. 1 (1077–78; tr. S. N. Deane)",
              },
              thinkers: ["schellenberg", "anselm"],
              cedes:
                "I'd concede if someone could stand in a real two-way relationship with God while having no belief at all that he is there.",
              children: [
                {
                  id: "hid-faith-without-belief",
                  side: "theist",
                  label: "Trust without belief is enough to begin a relationship with God",
                  gist: "You can trust God, hope in him and act on that hope while unsure he exists, so a relationship can begin before belief is settled.",
                  body: [
                    "The claim that relating requires believing is false of faith as people actually live it. {{howard-snyder}} argues that [[nondoxastic-faith|faith that God exists does not require belief]] that he does: it can rest on hope, trust and resolve, as a sailor in a storm steers for a shore she cannot yet see. Ted Poston and Trent Dougherty add that belief comes in degrees, so someone who finds God a live maybe can still turn toward him.",
                    "The Gospels' own example is a father who cannot settle his doubts and prays anyway, and is answered. Even {{schellenberg}}, in *The Will to Imagine* (2009), commends a faith without belief, aimed at an ultimate reality he leaves undescribed, as the right response to religious doubt. A relationship that begins with 'if you are there' is a relationship begun.",
                  ],
                  quote: {
                    text: "Lord, I believe; help thou mine unbelief.",
                    who: "A father, to Jesus",
                    cite: "Mark 9:24 (KJV)",
                  },
                  thinkers: ["howard-snyder", "schellenberg"],
                  cedes:
                    "I'd concede if someone who hopes in God and lives by that hope could be shown to stand in no relationship with him at all.",
                  see: [
                    { id: "evi-a-trust", why: "Objection IV: faith that begins as trust acted on, not a belief willed." },
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
                      label: "Perfect love wouldn't settle for a one-sided bond with a maybe",
                      gist: "Hope can reach toward a God who might be there, but no one can knowingly be comforted, guided or answered by someone they don't believe exists, and perfect love would want that for us now.",
                      body: [
                        "Faith without belief rescues the human half of the relationship and leaves the other half silent. {{schellenberg}} replied (2007) that the relationship perfect love seeks is conscious and reciprocal: you cannot knowingly receive comfort, forgiveness or guidance from someone you don't believe is giving it. A child who hopes someone is in the next room is not yet being held.",
                        "Hope is not nothing, but it is the posture of someone writing letters that may be going nowhere. A perfectly loving God, able to give more, would not settle for a relationship one side cannot know it is in, not for a season and not for a lifetime. And the reply helps only those who already have the idea of God and the hope to aim at him; the many who never met the idea have neither.",
                      ],
                      thinkers: ["schellenberg"],
                      cedes:
                        "I'd concede if a relationship one partner cannot know is happening were shown to be as good, for as long as it lasts, as one both partners can know.",
                      see: [
                        { id: "hid-demographics", why: "Those who never had the idea of God to hope toward: the second prong." },
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
                          label: "A love begun unseen can be finished face to face",
                          gist: "Perfect love wants a relationship both sides can know, but it need not have it from the first day: the ache that keeps a seeker searching may be God's first word, and the rest can come later, even after death.",
                          body: [
                            "Perfect love wants a conscious relationship, but nothing in love says it must be conscious on the first day. The argument's premise says God would be open *always*, as if every delay were a refusal. A relationship meant to last forever can begin below awareness and be named later. {{augustine}}'s heart is restless until it rests in God, and on his view the restlessness is already God's doing, the pull of the one it seeks.",
                            "{{aquinas}} supplies the care. Knowledge that God exists 'in a general and confused way' is implanted in us by nature, as one may know that someone is approaching without knowing it is Peter, though this 'is not to know absolutely that God exists'. The longing is aimed at God even while it misnames him. T. J. Mawson (2012) asks what deadline God has set for belief, and suggests death, or the end of all things. Against an everlasting relationship, a lifetime of not yet is a finite cost.",
                          ],
                          quote: {
                            text: "Console thyself, thou wouldst not seek Me, if thou hadst not found Me.",
                            who: "Blaise Pascal",
                            cite: "Pensées, 'The Mystery of Jesus' (pub. 1670; tr. W. F. Trotter)",
                          },
                          thinkers: ["augustine", "pascal", "aquinas"],
                          cedes:
                            "I'd concede if perfect love were shown to require a relationship conscious on both sides at every moment, so that no delay, however short against eternity, could be loving.",
                          see: [
                            { id: "mor-inclusivism", why: "Objection V: Christ can save those who sought the good without knowing his name." },
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
              label: "Silence in the worst hours is where the presence reply breaks",
              gist: "If God permits horrors for reasons beyond us, love would at least let the sufferer know he is there, and a child dying alone in pain is given no such sign.",
              body: [
                "The presence reply is weakest exactly where it is most needed. {{rowe}} pointed out that if God permits horrendous suffering for reasons beyond our grasp, a loving God would at least be consciously present to the sufferer, assuring her of his love. {{schellenberg}} argued (2010) that hiddenness in horror makes a stronger case than either problem alone: a child dying in pain, alone, with no sense of anyone there.",
                "This is not only an unbeliever's thought. After his wife's death, {{lewis-cs}}, the century's best-known Christian apologist, wrote that going to God in desperate need was like finding a door slammed and bolted from the inside, and then silence. A presence that never makes itself known to the drowning is, to them, indistinguishable from absence.",
              ],
              quote: {
                text: "O my God, I cry in the day time, but thou hearest not; and in the night season, and am not silent.",
                who: "Psalm 22",
                cite: "Psalm 22:2 (KJV)",
              },
              thinkers: ["rowe", "schellenberg", "lewis-cs"],
              cedes:
                "I'd concede if felt silence in suffering were shown to serve the sufferer in a way a felt presence could not.",
              see: [
                { id: "hid-skeptical-theism", why: "The reasons-beyond-us reply that Rowe grants for the sake of argument." },
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
                  label: "Faith expected a hidden God, and met him inside the lament",
                  gist: "The Bible's God hides his face, its sufferers cry out to him anyway, and Christians see God himself in that cry on the cross, so felt abandonment is a place faith has met God, not proof of his absence.",
                  body: [
                    "The objection assumes faith was promised felt comfort on demand. The tradition never promised it; it named God the [[deus-absconditus|hidden God]]. The Psalms hand the sufferer words to hurl at the silence, and {{rea}} argues that God authorizes such protest: contending with an absent God is a way of being with him. {{john-of-the-cross}} called the [[dark-night|dark night]] love's purification, not its end.",
                    "The hardest case gets the deepest answer. {{luther}}'s [[theology-of-the-cross|theology of the cross]] finds God precisely where he seems absent, on the cross, where Jesus prays Psalm 22: 'My God, my God, why hast thou forsaken me?' {{adams-marilyn-m|Marilyn McCord Adams}} argues that God defeats horrors not by explaining them but by sharing them, so that even the child who dies alone can come to recognize, afterwards, that her worst hour was one God entered too. Lewis kept writing, and later in the same book found the silence 'not the locked door' but 'more like a silent, certainly not uncompassionate, gaze.'",
                  ],
                  quote: {
                    text: "Verily thou art a God that hidest thyself, O God of Israel, the Saviour.",
                    who: "The Book of Isaiah",
                    cite: "Isaiah 45:15 (KJV; Vulgate: Vere tu es Deus absconditus)",
                  },
                  thinkers: ["rea", "john-of-the-cross", "luther", "adams-marilyn-m"],
                  cedes:
                    "I'd concede if felt abandonment were shown to end every relationship it touches, or if no sufferer, even afterwards, could find God in her worst hour.",
                  see: [
                    { id: "hid-presence-not-belief", why: "Whether lament, addressed to a 'thou', already presupposes the belief the argument is about." },
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
          label: "God offers evidence to the willing, not to spectators",
          gist: "Evidence of God aims to transform, so it comes as a call, through conscience, to people willing to be changed, and is withheld from those who only want to inspect it; no one truly willing is left without it.",
          body: [
            "Premise three tests the wrong kind of openness. {{moser}} argues that being open to a relationship on one's own terms is not the same as being willing to yield to a Lord. Evidence of a perfectly loving God is not a fact to file but a call to yield, so it is 'purposively available': given in the way, and to the people, that suit God's aim of remaking us. A message in the sky would be spectator evidence: it informs and leaves the will untouched.",
            "The call comes first through conscience, Moser holds, as a pull toward unselfish love, even of enemies, so it reaches everyone. To demand proof on our own terms before any surrender is what he calls [[cognitive-idolatry|cognitive idolatry]]: treating God as an object to inspect rather than a Lord to know. The promise is conditional: 'ye shall seek me, and find me, when ye shall search for me with all your heart' (Jeremiah 29:13). Hiding from the curious keeps the evidence pointed at its purpose.",
          ],
          quote: {
            text: "There is enough light for those who only desire to see, and enough obscurity for those who have a contrary disposition.",
            who: "Blaise Pascal",
            cite: "Pensées 430 (Brunschvicg; pub. 1670; tr. W. F. Trotter)",
          },
          thinkers: ["moser", "pascal"],
          cedes:
            "I'd concede if people ready to let God remake their lives were found, in numbers, to have searched with all their heart and received nothing.",
          see: [
            { id: "evi-a-james", why: "William James in objection IV: some truths show themselves only to those who first commit." },
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
              gist: "Many who begged to be remade lost their belief or never found it; no seeker can promise obedience to a Lord she doesn't yet believe in; and even Pascal allowed sincere seekers who had not found God.",
              body: [
                "Purposive availability makes a prediction, and the seekers refute it. {{schellenberg}}'s former believers begged God to keep them believing and watched honest inquiry dissolve their faith; his lifelong seekers knocked for years on a door that never opened. And the test asks for what no seeker can give in advance. Willingness to obey a Lord presupposes believing there is one; 'if you are there, I am yours' is all a doubter can offer, and it is exactly what these seekers offered.",
                "The theist's own witness grants the category. {{pascal}} describes a middle group 'occupied in seeking Him, not having found Him', and in the very fragment that promises 'enough light' he stakes the claim these seekers test: it was not right for God to come so hidden 'that He could not be known by those who should sincerely seek Him.' And the willingness test proves too much: the Book of Mormon makes the same promise to the sincere asker (Moroni 10:4), and sincere askers come away with incompatible answers.",
              ],
              quote: {
                text: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.",
                who: "Jesus, in the Sermon on the Mount",
                cite: "Matthew 7:7 (KJV)",
              },
              thinkers: ["schellenberg", "pascal"],
              cedes:
                "I'd concede if those who searched hardest and found nothing turned out, on some independent test, to have been less willing than those who found.",
              see: [
                { id: "evi-a-diversity", why: "Objection IV: some seekers did find something, in other traditions, and found different things." },
                { id: "evi-a-tradition", why: "Objection IV's theist says the signs are public and God demonstrable; here evidence is withheld from all but the willing." },
              ],
              sources: [
                {
                  title: "The Wisdom to Doubt",
                  by: "J. L. Schellenberg",
                  year: "2007",
                  note: "Ch. 10: former believers, lifelong seekers, converts to nontheistic religion, isolated nontheists.",
                },
              ],
              children: [
                {
                  id: "hid-hidden-resistance",
                  side: "theist",
                  label: "A divided will, not God's absence, can explain the silence",
                  gist: "Wanting evidence differs from being ready to be ruled by love, and a will can be divided in ways the seeker cannot see, so sincere testimony cannot settle who is truly open.",
                  body: [
                    "Self-report cannot carry the weight the skeptic puts on it. {{moser}} distinguishes openness to proof from openness to a Lord: one can sincerely want the first while recoiling from the second, and 'if you are there, I am yours' can be said in earnest by a will still at war with itself. Schellenberg himself counts self-deception as resistance, and self-deception is by its nature invisible to the self.",
                    "{{stump}} gives the deepest version, with no blame in it. Love, on Aquinas's account, desires the beloved's good and union with them, and union requires that the beloved be whole inside, not at war with herself. A double-minded person cannot receive full presence even while consciously asking for it, as one cannot be fully known by a friend while hiding from oneself. Timing matters too: {{howard-snyder}} argued that belief given too soon, to someone who would answer with rejection, indifference or the wrong motives, could harden what it hoped to win. Not yet is not never.",
                  ],
                  quote: {
                    text: "A double minded man is unstable in all his ways.",
                    who: "The Letter of James",
                    cite: "James 1:8 (KJV)",
                  },
                  thinkers: ["moser", "stump", "howard-snyder"],
                  cedes:
                    "I'd concede if those who search hardest and find nothing proved no less humble, charitable or quick to reconcile than those who find God.",
                  see: [
                    { id: "mor-chosen-hell", why: "Objection V: a refusal that lasts as long as the will keeps turning." },
                    { id: "mor-honest-doubter", why: "Objection V's bill for this reply: blame the doubter who heard, or grant that his unbelief is innocent." },
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
                      label: "Perfect love would pursue even the resisters, not wait them out",
                      gist: "Even if some unbelief hid resistance, a loving parent helps a child out of a predicament it partly made; secret resistance would somehow have to cluster by birthplace; and a resistance no one can detect explains nothing.",
                      body: [
                        "Grant the divided will; perfect love still runs toward it. {{maitzen}} puts it plainly: 'A loving parent can often be expected to help his or her child out of a miserable predicament, even if the child is in some sense to blame for being in the predicament.' The prodigal's father did not wait for a purified motive. And God already relates to immature, double-minded believers, as {{schellenberg}} notes, so readiness cannot be the price of belief.",
                        "The resistance story also makes a prediction the map refutes. Whatever hidden fault is supposed to block belief, pride or sin or self-deception, presumably afflicts human beings in equal measure everywhere, Maitzen observes; yet unbelief follows borders. And a resistance hidden even from the resister, always answered with 'not yet', fits every testimony a seeker could give. A theory no seeker's life could count against explains nothing.",
                      ],
                      quote: {
                        text: "But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.",
                        who: "Jesus, in the parable of the prodigal son",
                        cite: "Luke 15:20 (KJV)",
                      },
                      thinkers: ["maitzen", "schellenberg"],
                      cedes:
                        "I'd concede if giving belief to a resister were shown to make healing less likely rather than more, and if hidden resistance could be detected by some sign other than the unbelief it is meant to explain.",
                      see: [
                        { id: "mor-hell", why: "Objection V: what judgment for unbelief adds to hiddenness." },
                        { id: "hid-demographics", why: "Why secret resistance would have to follow national borders." },
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
          label: "Belief in an all-seeing judge would turn goodness into prudence",
          gist: "A God whose existence and majesty were plain to all would be a judge watching every act, and goodness done under that gaze is done from fear; some distance leaves room to choose the good for its own sake.",
          body: [
            "More evidence is not always more loving, not if what love wants is a free answer. {{hick}} called it [[epistemic-distance|epistemic distance]]: a world in which God is not overwhelming is the room in which persons can grow into goodness rather than be pressed into it. {{swinburne}} argues that serious moral choice needs a God whose existence is not too evident; with God in plain view, the right act would always be the prudent one.",
            "The danger is not bare belief but belief in this God: all-powerful, all-knowing, judge of every act. {{murray}} argues (1993) that coercion comes from a threat made evident and near; no one calls handing over a wallet at gunpoint generosity. {{kant}} drew the picture: with God and eternity unceasingly before our eyes, most lawful acts 'would be done from fear, a few only from hope, and none at all from duty', and conduct would become a puppet-show in which 'everything would gesticulate well, but there would be no life in the figures.'",
          ],
          quote: {
            text: "Thomas, because thou hast seen me, thou hast believed: blessed are they that have not seen, and yet have believed.",
            who: "Jesus, to Thomas",
            cite: "John 20:29 (KJV)",
          },
          thinkers: ["hick", "swinburne", "murray", "kant"],
          cedes:
            "I'd concede if those who are certain of God were found to do good as freely, and as much for its own sake, as anyone else.",
          see: [
            { id: "coh-b-spinoza", why: "Objection I: what kind of freedom is at stake, and Spinoza's account of it." },
            { id: "mor-locked-door", why: "Objection V: a hell freely chosen, which leans on the same freedom this defense protects." },
            { id: "mor-universalism", why: "Objection V: whether clear sight of God would finally win every will." },
          ],
          sources: [
            { title: "Evil and the God of Love", by: "John Hick", year: "1966", note: "Epistemic distance as the condition of soul-making." },
            { title: "The Existence of God", by: "Richard Swinburne", year: "2nd ed. 2004" },
            {
              title: "Coercion and the Hiddenness of God",
              by: "Michael J. Murray",
              year: "1993",
              note: "American Philosophical Quarterly 30.",
            },
          ],
          children: [
            {
              id: "hid-devils-believe",
              side: "skeptic",
              label: "Devils believe and rebel; belief costs no good worth having",
              gist: "The argument asks only for belief, and belief leaves us free: the devils believe and rebel, devout believers are certain and no one calls them puppets, and every good hiddenness supposedly buys is available inside belief.",
              body: [
                "The coercion worry mistakes believing someone exists for being cornered by them. {{schellenberg}} asks for belief, not for God's majesty before our eyes, and the tradition itself holds that knowing God exists is compatible with defying him. The devils believe, and tremble, and rebel. Thomas was shown the wounds, Paul was thrown to the road, and neither lost his freedom. {{maitzen}} notes that the churches praise believers for whom God is as certain as anything they know; no one pities their lost freedom.",
                "{{kant}}'s worry was certainty as strong as sight, not the modest belief within reach of anyone not resisting. And the theist's own ((coh-b-teleo|Objection I)) calls wills that cannot fall, like the saints', 'the freest of all', so clear knowledge of God cannot be what destroys free goodness. This is Schellenberg's answer to every such defense, the [[accommodation-strategy|accommodation strategy]]: freedom, moral struggle, inquiry and growth are all open to believers. If relationship with God is the greatest good, no good that requires its absence could outweigh it.",
              ],
              quote: {
                text: "Thou believest that there is one God; thou doest well: the devils also believe, and tremble.",
                who: "The Letter of James",
                cite: "James 2:19 (KJV)",
              },
              thinkers: ["schellenberg", "maitzen", "kant"],
              cedes:
                "I'd concede if modest belief were shown to overwhelm the freedom of those who hold it, or if some good worth its cost could be had only through real, temporary unbelief.",
              see: [
                { id: "hid-testimony-accommodation", why: "The same strategy turned on the map of belief, in the second prong." },
                { id: "mor-allegiance", why: "The same verse in Objection V, used by the theist: bare belief saves no one." },
                { id: "coh-b-teleo", why: "Objection I's theist: wills that never fall are 'the freest of all'." },
              ],
              sources: [
                {
                  title: "The Hiddenness Argument Revisited (II)",
                  by: "J. L. Schellenberg",
                  year: "2005",
                  note: "Religious Studies 41; replies to the freedom and coercion defenses.",
                },
              ],
              children: [
                {
                  id: "hid-responsibility",
                  side: "theist",
                  label: "Sharing God's work needs people who don't yet believe",
                  gist: "If God gave everyone belief directly, no one could join him in the real work of bringing others to know him, and that partnership needs people who don't know him yet.",
                  body: [
                    "Accommodation assumes every good survives if God installs the basic belief himself. One does not. {{dumsday}} argues (2010) that among the greatest goods open to us is cooperating with God, as friends, in bringing others to know him. That good needs real stakes: people who do not yet believe, whose coming to believe really depends, in part, on us. A task God has already finished is no task at all.",
                    "{{swinburne}} adds the goods of finding God out for oneself and of helping one another search; both vanish if the answer comes installed. Parents know the logic: they could do the homework, and love sometimes means they don't. The unbelief is temporary on this view, and the unreached are not beyond God's reach. Hiddenness creates the opportunity, not the outcome.",
                  ],
                  quote: {
                    text: "How then shall they call on him in whom they have not believed? and how shall they believe in him of whom they have not heard? and how shall they hear without a preacher?",
                    who: "Paul, to the Romans",
                    cite: "Romans 10:14 (KJV)",
                  },
                  thinkers: ["dumsday", "swinburne"],
                  cedes:
                    "I'd concede if helping others come to God could be had just as fully in a world where everyone already believed.",
                  see: [
                    { id: "hid-messengers", why: "The same good seen from the map: belief entrusted to human witnesses." },
                    { id: "mor-inclusivism", why: "Objection V: what becomes of those the messengers never reach." },
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
          gist: "The argument pictures God as one more being who could show up or fail to, but classical theism's loving God is the source of all being, present in every act of mind, so what's missing is attention, not God.",
          body: [
            "The argument imagines God as a very great someone who might step into view and has, for some reason, declined. Classical theism denies the picture. {{hart}} insists that God is not a being among beings but being itself, the ground of every existence, every act of knowing, every desire for the good. Looking for him among things is like looking for the light among the objects it lets you see. ((coh-a-concur|Objection I's counter)) makes the same move about causes: God is no rival item in the world.",
            "So God is hidden only as the obvious is hidden, by being everywhere. {{aquinas}} held that God is in all things, not as a part of them but as an agent is present to what it acts on, and innermost in each (*Summa Theologiae* I q.8 a.1). What is missing is attention, not data.",
          ],
          quote: {
            text: "For in him we live, and move, and have our being.",
            who: "Paul, at the Areopagus",
            cite: "Acts 17:28 (KJV)",
          },
          thinkers: ["hart", "aquinas"],
          cedes: "I'd concede if classical theism, to escape the argument, had to stop saying that God knows and loves each person.",
          see: [
            { id: "coh-a-concur", why: "Objection I's counter: God grounds every cause without competing with any." },
            { id: "mor-not-agent", why: "Davies's related claim in Objection V: God is not a moral agent owing each creature its due." },
          ],
          sources: [{ title: "The Experience of God: Being, Consciousness, Bliss", by: "David Bentley Hart", year: "2013" }],
          children: [
            {
              id: "hid-nonobject-belief",
              side: "skeptic",
              label: "A God who is no object can still put a belief in a mind",
              gist: "The argument never asked to see God among objects, only for belief that he exists, and a God who causes every thought there is can cause that one.",
              body: [
                "'Not an object' explains why God doesn't turn up in a telescope. It doesn't explain why honest people lack the belief, and belief, not a sighting, is all {{schellenberg}} asked for. A God who is not one more thing can still cause a thought in a mind; on the classical view he causes every thought there is. And the argument reasons from love, which Hart's God is.",
                "Hart's own tradition says God can be known. {{aquinas}} holds that God's existence can be shown from his effects, and explains why God revealed it anyway: the truth that reason can reach 'would only be known by a few, and that after a long time, and with the admixture of many errors.' Revelation was the remedy. But revelation travels by ((hid-demographics|birthplace and century)), so the cure has the same gaps as the disease.",
              ],
              quote: {
                text: "Now because we do not know the essence of God, the proposition is not self-evident to us; but needs to be demonstrated by things that are more known to us, though less known in their nature—namely, by effects.",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I q.2 a.1 (tr. Fathers of the English Dominican Province)",
              },
              thinkers: ["schellenberg", "aquinas"],
              cedes:
                "I'd concede if a God who causes every thought were shown unable to cause this one without ceasing to be the ground of being.",
              see: [
                { id: "nat-b-exist", why: "Objection III: the route to God from his effects that this reply points to." },
                { id: "hid-sensus", why: "Whether every mind already has some sense of God, as Calvin held: the second prong." },
              ],
            },
            {
              id: "hid-spinoza-my-god",
              side: "spinoza",
              label: "Spinoza: a ground of being that hides from no one seeks no one",
              gist: "A God who is the ground of everything is the most knowable thing there is, but such a God has no passions and chooses nothing, so it seeks no one; Hart escapes hiddenness only by describing Spinoza's God.",
              body: [
                "Spinoza would sign nearly every word of Hart's and draw the opposite conclusion. A God in whom we live and move is no object, and for exactly that reason is not hidden at all: 'the human mind has an adequate knowledge of the eternal and infinite essence of God' (*Ethics* II P47), adequate meaning true and whole, not patched together from images. He even claimed Paul's sentence, telling Oldenburg in 1675 that all things are in God and move in God.",
                "Follow the ground of being all the way, and the lover drops out. Such a God is 'without passions' and, strictly speaking, 'does not love or hate anyone' (V P17 and Cor.). He 'does not act according to freedom of the will' (I P32 Cor. 1). He does love, with an [[amor-dei-intellectualis|intellectual love]] in which his love of us and ours of him are one act (V P36 Cor.), but it chooses no one and waits for no reply. Hiddenness dissolves because the one who could hide is gone.",
              ],
              quote: {
                text: "He, who loves God, cannot endeavour that God should love him in return.",
                who: "Baruch Spinoza",
                cite: "Ethics V P19 (1677; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if a God who is being itself could also choose to seek one person and wait on another without becoming one more thing among things.",
              see: [
                { id: "coh-a-collapse", why: "Objection I: whether a simple God can freely choose at all, or creates by necessity." },
                { id: "hid-spinoza-allknow", why: "Spinoza's other move here: every mind knows God, under the wrong name." },
                { id: "nat-b-necess", why: "Why Spinoza's God chooses nothing: necessity from the principle of sufficient reason." },
              ],
              children: [
                {
                  id: "hid-hart-personal",
                  side: "theist",
                  label: "God's love is no passion, yet in Christ it came seeking us",
                  gist: "Classical theists agree God has no passions, but love that is pure gift rather than reaction is love at its fullest; God creates freely, and in Jesus the ground of being came looking for the lost.",
                  body: [
                    "Spinoza is right that the ground of being has no passions, as classical theists agree. {{hart}} defends divine [[impassibility|impassibility]]: nothing we do adds to God's joy or wounds it. But a love that is not a reaction is not a love missing. It is love with nothing to gain, pure act and pure gift, the source of every reaching-out, not a weaker copy. Nor is creation forced. {{aquinas}} holds that God wills his own goodness necessarily but wills creatures freely, since that goodness needs nothing from them (ST I q.19 a.3), and ((coh-a-extrinsic|objection I)) argues that God's one act can be necessary while its effects are not.",
                    "And 'seeks no one' is what the Gospels deny: 'the Son of man is come to seek and to save that which was lost.' {{kierkegaard}} saw that a god who wanted love rather than awe would come in a servant's form, and that the form was his true one. As Jesus tells Philip, 'he that hath seen me hath seen the Father.'",
                  ],
                  quote: {
                    text: "No man hath seen God at any time, the only begotten Son, which is in the bosom of the Father, he hath declared him.",
                    who: "The Gospel of John",
                    cite: "John 1:18 (KJV)",
                  },
                  thinkers: ["hart", "aquinas", "kierkegaard"],
                  cedes:
                    "I'd concede if love could be shown to require passion, being moved by the beloved, so that a God beyond change could not also know and seek each one.",
                  see: [
                    { id: "coh-a-extrinsic", why: "Objection I's answer to modal collapse: God's act is necessary, its effects are not." },
                    { id: "hid-demographics", why: "Whether an incarnation in one time and place reaches everyone: the second prong." },
                    { id: "nat-b-contrast", why: "The Spinozist rejoinder to free creation in Objection III: a reason that fits either choice leaves it brute." },
                  ],
                  sources: [
                    {
                      title: "No Shadow of Turning: On Divine Impassibility",
                      by: "David Bentley Hart",
                      year: "2002",
                      note: "Pro Ecclesia 11.",
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
      gist: "If a loving God made himself available to every open heart, belief would not depend on where and when you were born; yet theism clusters by culture and was absent for most of human history.",
      body: [
        "Set the single seeker aside and look at the map. {{maitzen}} notes that Saudi Arabia is at least 95 percent theistic, while Thailand, 95 percent Buddhist, is at most 5 percent theistic. No one supposes Thais are more resistant to God than Saudis. Culture and politics predict the pattern with ease; a God open to every heart makes it a puzzle.",
        "Time makes it starker. For most of our species' history no one had the idea of a single personal creator to accept or resist. {{schellenberg}} treats these as the clearest cases: no one can resist a God they have never heard of. {{marsh}} argues (2013) that such [[natural-nonbelief|natural nonbelief]] is what unguided evolution predicts and is strong evidence against theism. And psychologists find that belief spreads mainly by imitation, caught from parents and neighbors who visibly live it. Belief goes where it was carried, not where hearts were open.",
      ],
      quote: {
        text: "…the patchiness of theistic belief has everything to do with the notoriously haphazard play of human culture and politics and nothing to do with God: the messy, uneven data have messy, uneven causes.",
        who: "Stephen Maitzen",
        cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 183",
      },
      thinkers: ["maitzen", "schellenberg", "marsh"],
      cedes:
        "I'd concede if the distribution of belief could be shown to follow anything like openness of heart, rather than birthplace and century.",
      see: [
        { id: "evi-a-diversity", why: "Objection IV: religious experience divides along the same cultural lines." },
        { id: "mor-inclusivism", why: "Objection V: whether the unreached are lost, which raises the stakes of this map." },
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
          gist: "Humans learn most of what matters from one another, a good God would honor that, and a faith passed hand to hand spreads unevenly, as language, medicine and science do.",
          body: [
            "The map shows how knowledge of God travels, not whether God is open. Nearly everything people know, from medicine to mathematics, they know by trusting one another. {{baker-hytch}} argues (2016) that this [[mutual-epistemic-dependence|mutual dependence]] is a great good, and that a God who values it should expect belief to spread unevenly, along the roads people travel. Knowledge entrusted to messengers goes where messengers go.",
            "{{butler}} answered the objection in 1736. Nature hands out its gifts (health, strength, knowledge, the means to improve) 'with the most promiscuous variety', which in Butler's English means without regard to who needs or deserves them, and revelation follows the same economy. {{pascal}} even turned the diversity of religions into a sign: 'If there were only one religion, God would indeed be manifest.' A plural, contested world is what a hidden God who works through people would produce.",
          ],
          quote: {
            text: "…the Author of Nature, in numberless instances, bestows that upon some, which he does not upon others, who seem equally to stand in need of it.",
            who: "Joseph Butler",
            cite: "The Analogy of Religion, Part II, ch. VI (1736)",
          },
          thinkers: ["baker-hytch", "butler", "pascal"],
          cedes:
            "I'd concede if God could keep every good of shared, entrusted knowledge while also giving each person belief directly.",
          see: [
            { id: "mor-inclusivism", why: "Objection V: those beyond the messengers' reach need not be beyond God's." },
            { id: "hid-responsibility", why: "The good of being a messenger: cooperating with God in bringing others to know him." },
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
              gist: "Valuing testimony doesn't require leaving whole civilizations without even the idea of God; he could give everyone a minimal belief and leave the rest to human witness.",
              body: [
                "Prizing testimony doesn't require rationing the basics. A God who valued our dependence on one another could still give every person the bare belief that he exists, and leave the richer knowledge, his character, his deeds, his will, to be handed on. Honoring testimony does not require leaving the San of the Kalahari, or our ancestors for tens of thousands of years, without the idea at all. {{maitzen}} asked why the San, or any culture, should be 'less lucky' in this regard.",
                "Pascal's 'sign' has an odd shape, too: the diversity comes in sealed national blocs, not inside each culture. The testimony reply fits the data only by predicting what the naturalist predicts: belief going wherever its carriers went. Butler's analogy cuts both ways. A providence that hands out truth as indifferently as nature hands out health is what we would see if there were no providence.",
              ],
              quote: {
                text: "…why doesn't this valuable diversity flourish within the cultures of Saudi Arabia and Thailand?",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 183",
              },
              thinkers: ["maitzen"],
              cedes: "I'd concede if some good of human witness were shown to require that whole peoples lack even the idea of God.",
              see: [
                { id: "hid-devils-believe", why: "The same accommodation strategy, aimed at the freedom defense." },
                { id: "hid-responsibility", why: "A good said to need real, temporary unbelief, and whether accommodation can absorb it." },
              ],
            },
          ],
        },
        {
          id: "hid-middle-knowledge",
          side: "theist",
          label: "God places those who would respond where the message reaches",
          gist: "A God who knows what anyone would freely do can arrange history so that those who would respond are born where they can hear, and those who never hear are those who would have refused anyway.",
          body: [
            "The map looks like an accident of birth only if God placed people at random. {{craig}} argues (1989) that he need not have. If God has [[middle-knowledge|middle knowledge]], he knows what every possible person would freely do in any circumstance, and can order history so that anyone who would answer the gospel is born where they will hear it. Those who never hear are those who would not have believed had they heard; no one misses out by the luck of the draw.",
            "Craig calls their condition transworld damnation: in no world God could make would they freely believe. So the unreached are lost, but not by bad luck. God, as Paul told the Athenians, set the bounds of each people's habitation so that they should seek him, and the map of belief is the shape of that providence, not a lottery.",
          ],
          quote: {
            text: "…and hath determined the times before appointed, and the bounds of their habitation; That they should seek the Lord, if haply they might feel after him, and find him…",
            who: "Paul, at the Areopagus",
            cite: "Acts 17:26–27 (KJV)",
          },
          thinkers: ["craig"],
          cedes:
            "I'd concede if there were nothing for God to know about what people would freely do, or if those who would refuse in every circumstance could not be the ones born out of reach.",
          see: [
            { id: "coh-b-molina", why: "Objection I: middle knowledge itself, and whether anything could make it true." },
            { id: "hid-spared", why: "Marsh's gentler model: the unreached spared, not lost." },
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
              gist: "The Molinist story needs the people who would refuse God to be born mostly in certain countries and centuries, a sorting nothing independent supports and culture explains without any sorting at all.",
              body: [
                "Middle knowledge explains the map only by turning the map into a fact about souls. Thailand must be where God placed the people who would refuse him in any circumstances, along with the many thousands of generations who lived before anyone preached a single creator. {{maitzen}} argues that the story is implausible on its own terms and less plausible than a naturalistic one (2006, 2008).",
                "The traits that bear on how anyone answers God, humility, honesty, openness, are not handed out by nation. Culture predicts the pattern without positing anything; the Molinist must posit an unseen sorting of souls that happens to reproduce, border for border, what culture predicts. It implies something ugly, too: that a child born in Bangkok is likelier than one born in Riyadh to be a soul God foresaw would turn him down. And the sorting is needed only if the unreached are lost, which the theist's own ((mor-inclusivism|Objection V)) denies.",
              ],
              quote: {
                text: "These dispositions thus resemble other fundamental human characteristics, such as the ability to hear; despite marked differences among individuals, we don't find entire countries whose citizens are nearly all deaf.",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 184",
              },
              thinkers: ["maitzen"],
              cedes:
                "I'd concede if there were independent evidence that people who would refuse God in every circumstance really are concentrated where theism is rare.",
              see: [
                { id: "hid-pursues", why: "The same clustering problem, aimed at hidden resistance." },
                { id: "coh-b-grounding", why: "The deeper problem, in Objection I: nothing makes the counterfactuals true at all." },
                { id: "mor-inclusivism", why: "Objection V's inclusivism: if the unreached can be saved, the sorting has nothing to do." },
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
          gist: "A loving God who foresaw that some people would reject him if they came to believe now might place them where belief won't reach them, keeping them innocent for a later chance, so the uneven map is mercy.",
          body: [
            "{{marsh|Jason Marsh}} pressed a gentler model against {{maitzen}} directly (2008). Suppose some people would freely reject God in this life if they came to believe. A loving God might spare them that refusal, placing them where belief won't reach them and keeping them innocent until a later time, beyond this life, when they could truly love him. Then an uneven map is what perfect love, knowing each of us, would draw.",
            "Unlike Craig's model, this one damns no one. The unreached are not the lost but the protected, which fits the theist's hope that Christ reaches those who never knew his name ((mor-inclusivism|in Objection V)). And a refusal made too early, with too little understanding, is just the kind of harm a good parent shields a child from.",
          ],
          thinkers: ["marsh", "maitzen"],
          cedes:
            "I'd concede if hearing of God never made a refusal more likely or more lasting, so that no one could need sparing from it.",
          see: [
            { id: "hid-seeking-is-finding", why: "The same 'not yet': a relationship that can be finished after death." },
            { id: "hid-hidden-resistance", why: "Howard-Snyder's version: belief given too soon could harden what it hoped to win." },
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
              label: "Then preaching to the unreached damns those God spared",
              gist: "If God shields would-be refusers by keeping belief from them, every missionary who reaches them strips the shield away, so the Great Commission exposes people to the very refusal God arranged history to prevent.",
              body: [
                "Marsh's mercy has a missionary paradox inside it. If God places people who would refuse him where belief won't reach them, for their own protection, then whoever carries belief to them strips the protection away. Each new mission field is, on this model, a region of souls God was guarding, and every sermon there risks the refusal he arranged history to prevent. The command to teach all nations becomes either a mistake or a bet against God's own arrangement.",
                "The theist can reply that God foresaw the missionaries too, and puts in their path only those ready to hear. But then the map is no longer mercy for the unreached; it is Craig's sorting of souls by birthplace again, with all of {{maitzen}}'s ((hid-molinism-clustering|clustering problems)). And since nothing independent tells us who is being spared, the model fits any map at all.",
              ],
              quote: {
                text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost",
                who: "Jesus, in Matthew's Gospel",
                cite: "Matthew 28:19 (KJV)",
              },
              thinkers: ["marsh", "maitzen"],
              cedes:
                "I'd concede if the model could say whom God is sparing, independently of where the gospel happens not to have reached.",
              see: [
                { id: "hid-responsibility", why: "The good of being a messenger, which this model turns into a hazard." },
              ],
            },
          ],
        },
        {
          id: "hid-sensus",
          side: "theist",
          label: "Beneath the map, every mind is built to sense a maker",
          gist: "Calvin held that a sense of the divine is planted in everyone, and cognitive science finds children everywhere primed to see a maker, so the map records how cultures name that sense, not who can reach God.",
          body: [
            "The map counts creeds, but the sense of God runs beneath creeds. {{calvin}} held it beyond dispute that there is in the human mind, 'by natural instinct, some sense of Deity', the [[sensus-divinitatis|sensus divinitatis]]; Paul says God's power is 'clearly seen' in the things that are made. {{plantinga}} builds this into a model of belief in God as [[properly-basic|properly basic]], formed by a faculty that sin has damaged, in ways people inherit rather than choose, so a person's unbelief need not be their own fault.",
            "[[csr|Cognitive science of religion]] lends the old claim support. {{barrett}} reports in *Born Believers* (2012) that young children everywhere readily see purpose in nature and credit a super-knowing maker; Deborah Kelemen asked whether children are 'intuitive theists'. {{evans}} calls such pointers natural signs, meant to be widely accessible and easily resisted. The signs are everywhere; what culture changes is uptake. The map records the naming, not the access.",
          ],
          quote: {
            text: "…God himself, to prevent any man from pretending ignorance, has endued all men with some idea of his Godhead, the memory of which he constantly renews and occasionally enlarges…",
            who: "John Calvin",
            cite: "Institutes of the Christian Religion I.3.1 (1559; tr. Henry Beveridge)",
          },
          thinkers: ["calvin", "plantinga", "barrett", "evans"],
          cedes:
            "I'd concede if the natural sense of the divine were shown to be absent, or to point nowhere near God, in whole populations.",
          see: [
            { id: "evi-a-basic", why: "Objection IV: belief in God as properly basic, like belief in other minds." },
            { id: "mor-honest-doubter", why: "Objection V: Calvin's suppression and Plantinga's no-fault version supply one horn each of the honest doubter's dilemma." },
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
              gist: "What cognitive science finds is a readiness to see agents and purposes everywhere, which yields ghosts, ancestors and many gods as easily as one, so stretching 'theism' to fit it changes the subject.",
              body: [
                "The cognitive science is real; it just doesn't deliver what the reply needs. The mechanisms it describes, a hair-trigger for detecting agents (Barrett's own [[hadd|hypersensitive agency detection device]], the reflex that turns a rustle in the grass into a someone) and a bias to see purpose everywhere, produce spirits, ancestors and pantheons as readily as a perfectly loving creator. Stewart Guthrie made the case in *Faces in the Clouds* (1993), and Helen De Cruz (2015) concludes that the science shows a natural tendency toward supernatural agents, not an innate tendency toward God.",
                "Hiddenness is a problem about the personal God who wants each of us. Widening 'theism' to generic supernaturalism, says {{maitzen}}, 'merely changes the subject'. Evans's easily resisted signs fare no better: if uptake is what varies, it varies by birthplace, and resistance does not follow borders. And Calvin's own sentence ends in accusation: the sense exists so that all 'may be condemned by their own conscience'. A faculty that mostly produced other gods is a strange instrument for that.",
              ],
              quote: {
                text: "Granted, belief in the supernatural is more widespread and more evenly distributed than belief in God, but divine hiddenness is a problem for theism in particular, not for supernaturalism in general.",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 179",
              },
              thinkers: ["maitzen"],
              cedes:
                "I'd concede if the natural sense of the divine were shown to point, across cultures, toward one loving creator more than toward many spirits.",
              see: [
                { id: "evi-a-pumpkin", why: "Objection IV: if a natural faculty grounds belief, it grounds every tradition's belief." },
                { id: "nat-b-minds", why: "Objection III: whether evolved minds can be trusted on questions like this." },
                { id: "mor-daybreak", why: "Nietzsche goes further in Objection V: explain how a belief arose and it loses its evidence." },
              ],
              sources: [
                {
                  title: "Divine Hiddenness and the Cognitive Science of Religion",
                  by: "Helen De Cruz",
                  year: "2015",
                  note: "In Green & Stump (eds.), Hidden Divinity and Religious Belief, 53–68.",
                },
              ],
              children: [
                {
                  id: "hid-designed-faculty",
                  side: "theist",
                  label: "A God-given seed can sprout as spirits and still lead to God",
                  gist: "A natural faculty can be God's design even when it overshoots, as sight survives its illusions; a sense of the sacred that first finds spirits is a seed that witness and reflection can bring to its true object.",
                  body: [
                    "That the sense overshoots does not show it is not God's. Vision produces illusions and still sees; a smoke alarm that sounds for burnt toast is still a smoke alarm. Kelly James Clark and {{barrett}} take a page from {{reid|Thomas Reid}}: we trust perception and memory without first proving them, and a faculty can be both natural and designed. Tracing a belief to its mechanism is the [[genetic-fallacy|genetic fallacy]] unless the mechanism is shown unreliable on that very question. {{calvin}} himself called it a seed, sown in all, cherished by scarcely one in a hundred and brought to maturity in none.",
                    "Seeds need cultivating, and on the testimony view God planted both the seed and the gardeners. Paul at Athens did not tell the altar-builders they had worshipped nothing. And {{rea}} argues that relationship with God need not run through a standard concept of God at all, so those whose sense of the sacred found spirits and ancestors were not thereby cut off from the one they were groping toward.",
                  ],
                  quote: {
                    text: "Whom therefore ye ignorantly worship, him declare I unto you.",
                    who: "Paul, at the Areopagus",
                    cite: "Acts 17:23 (KJV)",
                  },
                  thinkers: ["barrett", "reid", "calvin", "rea"],
                  cedes:
                    "I'd concede if the sense of the sacred were shown to be unreliable precisely about whether there is a God, not merely about which spirits there are.",
                  see: [
                    { id: "mor-daybreak", why: "Objection V: Nietzsche's debunking by origins, the move this reply resists." },
                    { id: "evi-a-function", why: "Objection IV: when a faculty working as designed makes belief rational without argument." },
                  ],
                },
              ],
            },
            {
              id: "hid-spinoza-allknow",
              side: "spinoza",
              label: "Spinoza: all minds know God, but as Nature's order, not a maker",
              gist: "Spinoza agrees with Calvin that everyone knows God, but what they know is the eternal order of things, not a maker they could be suppressing; what people reject is only an image of a judge.",
              body: [
                "Spinoza gives Calvin half his claim and overturns the other half. Every mind does know God, since to know anything truly, through its causes, is to grasp it as following from God's nature (*Ethics* II P45–47). People miss this, he adds, because 'they have associated the name God with images of things that they are in the habit of seeing.' The failure is in the naming, not the knowing.",
                "But what everyone knows is the eternal order of things, not a maker watching for submission. That is why 'no one can hate God' (V P18): the idea of God in us is adequate, and understanding brings no pain. What the supposed resister turns from is an [[imaginatio|image]], a judge built out of human hopes and fears, the kind Spinoza takes apart in the Appendix to *Ethics* I. So the map shows nothing about suppression. It shows where the image was taught.",
              ],
              quote: {
                text: "Hence we see, that the infinite essence and the eternity of God are known to all.",
                who: "Baruch Spinoza",
                cite: "Ethics II P47 Schol. (1677; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if some mind were shown to know anything at all without, in that very knowing, knowing something of God.",
              see: [
                { id: "evi-a-imagination", why: "Objection IV: a God known by feeling is imagination, not knowledge." },
                { id: "hid-spinoza-my-god", why: "Spinoza's other move here: the ground of being hides from no one and seeks no one." },
                { id: "nat-b-parallel", why: "Why every mind knows God, for Spinoza: thought and things are one order." },
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
      "Hiddenness has no grip on [[deus-sive-natura|God-or-Nature]], and the reason is more than immunity. Spinoza's God is the most knowable thing there is: every mind that knows anything has an adequate idea of God's eternal essence (*Ethics* II P47). Miracles cannot show him; 'the fixed and immutable order of nature' shows him far better (*Theological-Political Treatise* ch. 6). A God who could appear as an event could also fail to. A God who is the order every event displays cannot. {{schellenberg}} himself aims the argument only at a personal God, and leaves room for an ultimate reality that is not a person.",
      "That puts Spinoza on both sides of this debate. With {{calvin}} and against Schellenberg, no one lacks knowledge of God; the nonbeliever has only attached the name to the wrong images. With Schellenberg and against Calvin and {{moser}}, no one is suppressing a judge or refusing a Lord: no one can hate God (V P18), and God, without passions, strictly loves and hates no one (V P17 Cor.). The freedom defense gets no help either: 'in the mind there is no absolute or free will' (II P48).",
      "But the Spinozist inherits a hiddenness of her own. If every mind holds the idea of God, why do almost none live by it? Spinoza asks this himself on the last page of the *Ethics*, and answers with difficulty, not withholding: salvation is so seldom found because it is hard (V P42 Schol.). That answer works only because no one is trying to be found. Take away the God who wants us, and an uneven map is a fact about people, not evidence against anything. No one is listening for our prayers, and no one is hiding. Whether that fulfills the seeker's longing or politely tells them no one is there is exactly where the theist and the Spinozist part ways.",
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
      note: "The argument from nonresistant nonbelief, restated for general readers by its author.",
    },
    {
      title: "The Hiddenness of God",
      by: "Michael C. Rea",
      year: "2018",
      note: "The Gifford Lectures: divine love beyond the parental model, and a God more present than we notice.",
    },
    {
      title: "The Elusive God: Reorienting Religious Epistemology",
      by: "Paul K. Moser",
      year: "2008",
      note: "Evidence of God as 'purposively available' to those willing to be changed.",
    },
    {
      title: "Divine Hiddenness and the Demographics of Theism",
      by: "Stephen Maitzen",
      year: "2006",
      url: "https://doi.org/10.1017/S0034412506008274",
      note: "Religious Studies 42. Why the map of belief may be the hardest form of the problem.",
    },
    {
      title: "Pensées",
      by: "Blaise Pascal",
      year: "1670",
      url: "https://www.gutenberg.org/ebooks/18269",
      note: "Trotter's translation. The classic case that a true religion must say God is hidden, and why.",
    },
    {
      title: "Hiddenness of God (Stanford Encyclopedia of Philosophy)",
      by: "Daniel Howard-Snyder and Adam Green",
      url: "https://plato.stanford.edu/entries/divine-hiddenness/",
      note: "A fair, thorough map of the whole debate, both sides.",
    },
  ],
};

export default hiddenness;
