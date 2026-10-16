import type { Objection } from "../types";

/* Objection II — Divine hiddenness. Two parts: Schellenberg's argument from
   nonresistant nonbelief, and Maitzen's figures on belief and birthplace. Every
   quotation below was checked word for word against its source: the KJV
   (Gutenberg #10 and the per-book Gutenberg KJV, #8001–8066; the Bible links
   go to the verse anchors of Wikisource's KJV, whose spelling John 15:22 'cloke' and
   Psalm 22:2 'daytime' follow); Elwes's
   Spinoza (Ethics, Gutenberg #3800; Theologico-Political Treatise, Gutenberg #990;
   Letter 73 in Elwes's Chief Works vol. 2, archive.org); Trotter's Pascal (Gutenberg
   #18269, Brunschvicg numbering; the Gutenberg text numbers 552–585 one lower, so
   Brunschvicg 585 appears there as 584); Kennedy's Nietzsche (Gutenberg #39955);
   Abbott's Kant (Gutenberg #5683); Pusey's Augustine (Gutenberg #3296); Deane's
   Anselm (CCEL); Beveridge's Calvin (CCEL); Butler's Analogy (CCEL); Peers's John of
   the Cross (CCEL); Plantinga's Warranted Christian Belief (CCEL); the English
   Dominican Summa (New Advent); Hume's Natural History of Religion (davidhume.org);
   Reid's Inquiry (archive.org scan, long s modernized); the Book of Mormon
   (Gutenberg #17); Lewis's A Grief Observed (Project Gutenberg Canada).
   Modern authors: Maitzen (2006) from the published article (Religious Studies 42);
   Drange (1998) and Craig (1989) from the texts on infidels.org and
   reasonablefaith.org (the line on birthplace in hid-molinism-clustering is John
   Hick's, from 'Jesus and the World Religions' (1977), quoted in Craig's text).
   A few short modern quotations were checked against a
   reliable source that quotes them with page numbers: Schellenberg (2015, pp. 103,
   106, 111) and Schellenberg (2009, p. 3) via Notre Dame Philosophical Reviews;
   Moser's phrase "purposively available" via his publisher's page; Bergmann (2001),
   Marsh (2008, 2013) and Baker-Hytch (2016) via the Stanford Encyclopedia. Rea,
   Hart, Kierkegaard, Dumsday, Howard-Snyder and Maitzen (2008) are paraphrased. */

const hiddenness: Objection = {
  id: "hiddenness",
  numeral: "II",
  short: "Hiddenness",
  title: "A God who wanted us wouldn't hide",
  objection:
    "A God who wanted a relationship with each of us wouldn't leave a sincere, open seeker unsure that he exists ({{schellenberg|J. L. Schellenberg}}'s hiddenness argument).",
  counter:
    "{{rea|Michael Rea}} argues that God's love needn't look like a parent's, and that God can be present without being felt. {{moser|Paul Moser}} argues that God offers the evidence to people willing to be changed by it, and holds it back from people who only want to inspect it.",
  dek: "{{schellenberg|J. L. Schellenberg}}, a Canadian philosopher, has asked since 1993 why so many honest people, some searching hard and some never told, find no one there. His question is a cousin of [[problem-of-evil|the problem of evil]]. In 2006 the philosopher {{maitzen|Stephen Maitzen}} pointed out that belief in God follows birthplace, with Saudi Arabia at least 95 percent theist and Thailand at most 5 percent. More than three centuries earlier, {{pascal}} had made God's hiding part of his case for Christianity: “every religion which does not affirm that God is hidden, is not true” (*Pensées* 585).",
  question: "Would a perfectly loving God leave anyone who isn't running from him unsure he is there?",

  prongs: [
    /* ───────────────────── I. THE OPEN SEEKER ───────────────────── */
    {
      id: "hid-argument",
      side: "skeptic",
      label: "Honest seekers who find no God rule out a perfectly loving one",
      gist: "{{schellenberg|Schellenberg}} argues that a perfectly loving God would make sure everyone not turning away from him believed he exists, and some honest people don't, so there is no such God.",
      body: [
        "{{schellenberg}}, a Canadian philosopher, published this argument in 1993. It starts from [[perfect-being-theology|what believers say a perfect God must be like]] and runs in four steps:",
        "(1) In Schellenberg's 2015 wording, “If a perfectly loving God exists, then there exists a God who is always open to a personal relationship with any finite person.” (2) You can't relate to someone you don't believe exists, so such a God would make sure everyone able to have the relationship believed in him, unless they resisted him. (3) But some people lack belief without resisting God, which Schellenberg calls [[nonresistant-nonbelief|nonresistant nonbelief]]. His examples are former believers who prayed to keep their faith, lifelong seekers, converts to religions with no personal God, such as Buddhism, and people who never heard of one. (4) So there is no perfectly loving God.",
        "{{nietzsche}} had complained in 1881 that religions as yet know nothing of “the *duty of God*, the duty of being clear and truthful in His communications with men” (*Daybreak* §91), and the philosopher {{mckim}} made the complaint an argument in 1990.",
      ],
      quote: {
        text: "An omniscient and omnipotent God who does not even take care that His intentions shall be understood by His creatures—could He be a God of goodness?",
        who: "Friedrich Nietzsche",
        cite: "Daybreak (The Dawn of Day) §91 (1881; tr. J. M. Kennedy, 1911)",
        url: "https://www.gutenberg.org/cache/epub/39955/pg39955-images.html#Pg090",
      },
      thinkers: ["schellenberg", "nietzsche", "mckim"],
      cedes:
        "The argument fails if a loving God could have a reason, weightier than the relationship itself, to leave a non-resisting person without belief, or if no one is in that position after all.",
      see: [
        { id: "hid-demographics", why: "Part 2 traces the same unbelief by birthplace and century." },
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
        {
          title: "Divine Hiddenness and Human Reason",
          by: "J. L. Schellenberg",
          year: "1993",
          url: "https://www.cornellpress.cornell.edu/book/9780801473463/divine-hiddenness-and-human-reason/",
          note: "The original argument, framed in terms of reasonable nonbelief.",
        },
        {
          title: "Hiddenness of God",
          by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
          year: "2016, rev. 2022",
          url: "https://plato.stanford.edu/entries/divine-hiddenness/",
          note: "Section 2 states the argument from nonresistant nonbelief and the case for each premise.",
        },
        {
          title: "The Dawn of Day (Daybreak), §91",
          by: "Friedrich Nietzsche (tr. J. M. Kennedy)",
          year: "1881",
          url: "https://www.gutenberg.org/ebooks/39955",
          note: "Nietzsche's short section 'The Honesty of God', where both of his lines come from.",
        },
      ],
      children: [
        /* ── Premise one: Rea on transcendent love ── */
        {
          id: "hid-rea-love",
          side: "theist",
          label: "God's love needn't look like a parent's, so he may stay hidden",
          gist: "{{rea|Rea}} says the argument assumes God loves like an ideal parent, but a God far beyond us can love perfectly in his own way, which we can't predict.",
          body: [
            "{{rea}} answers premise one in his 2017 Gifford Lectures. The premise, he argues, pictures God's love as a parent's, scaled up and always reaching out. That picture keeps God personal by giving up his transcendence, the old teaching that God is beyond every category that fits created things. Such a God can be described only by [[analogy-of-being|analogy]], so our words for him can't tell us what his love must do in our case.",
            "Rea also cites the philosopher Susan Wolf's 1982 essay 'Moral Saints', which argues that a life organized wholly around other people's welfare is less admirable than it sounds, and he applies the point to a God whose every act revolved around us. On his view God's perfect love takes its shape from God's own goodness and purposes. The atheist philosopher {{drange|Theodore Drange}} objected to {{schellenberg|Schellenberg}} in 1998 that “There is no contradiction in the statement ‘X loves Y, but X does not want Y to be aware of X's existence.’”",
          ],
          quote: {
            text: "Hence, since to love anything is nothing else than to will good to that thing, it is manifest that God loves everything that exists. Yet not as we love.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I q.20 a.2 (tr. Fathers of the English Dominican Province)",
            url: "https://www.newadvent.org/summa/1020.htm",
          },
          thinkers: ["rea", "aquinas"],
          cedes: "{{rea|Rea}} is wrong if any love worth calling perfect must always seek the beloved's awareness of it.",
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
            {
              title: "Review of The Hiddenness of God",
              by: "Charity Anderson (Notre Dame Philosophical Reviews)",
              year: "2019",
              url: "https://ndpr.nd.edu/reviews/the-hiddenness-of-god/",
              note: "A chapter-by-chapter account of Rea's lectures.",
            },
            {
              title: "Nonbelief as Support for Atheism",
              by: "Theodore M. Drange",
              year: "1998",
              url: "https://infidels.org/library/modern/theodore-drange-nonbelief/",
              note: "Drange's critique of Schellenberg's version, including his point that love need not want to be known.",
            },
            {
              title: "Summa Theologiae I q.20, 'God's Love'",
              by: "Thomas Aquinas",
              url: "https://www.newadvent.org/summa/1020.htm",
              note: "Article 2 asks whether God loves all things, and answers that he does, though not as we love.",
            },
          ],
          children: [
            {
              id: "hid-love-emptied",
              side: "skeptic",
              label: "A love that won't let you know it's there is a lesser love",
              gist: "We can easily picture a greater love than one that leaves a willing beloved forever unsure, so {{rea|Rea}}'s reply makes God's love smaller.",
              body: [
                "{{schellenberg}} replies that premise one never needed the parent picture. It needs only what believers already say, that God's love can't be surpassed. Of two lovers, one who leaves a willing beloved forever unsure he exists and one who makes himself known, almost anyone would call the first love the lesser. The Bible also says God “will have all men to be saved, and to come unto the knowledge of the truth” (1 Timothy 2:4). {{rea|Rea}}'s appeal to God's own purposes makes things worse, since a love shaped by the lover's interests falls short of the self-giving love Christians see on the cross. If *love* is stretched further still, God's love would resemble ours only as the Dog Star resembles the dog that barks, sharing a name and no [[univocity|common meaning]], which is {{spinoza|Spinoza}}'s ((coh-a-dogstar|point about God's mind)).",
              ],
              quote: {
                text: "If ye then, being evil, know how to give good gifts unto your children, how much more shall your Father which is in heaven give good things to them that ask him?",
                who: "Jesus, in the Gospel of Matthew",
                cite: "Matthew 7:11 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#7:11",
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
                {
                  title: "Nonbelief and Evil: Two Arguments for the Nonexistence of God",
                  by: "Theodore M. Drange",
                  year: "1998",
                  note: "An argument from nonbelief built on verses like 1 Timothy 2:4.",
                },
                {
                  title: "The Argument from Non-belief",
                  by: "Theodore M. Drange",
                  year: "1993",
                  url: "https://www.cambridge.org/core/journals/religious-studies/article/argument-from-nonbelief/424C2FBBCFE18C972E7FC388F38DF678",
                  note: "Religious Studies 29. Drange's first journal statement of the argument.",
                },
                {
                  title: "Ethics, Part I, Proposition 17, Scholium",
                  by: "Baruch Spinoza (tr. R. H. M. Elwes)",
                  year: "1677",
                  url: "https://www.gutenberg.org/ebooks/3800",
                  note: "Spinoza's comparison of the Dog Star and the dog that barks, aimed at talk of God's intellect.",
                },
              ],
              children: [
                {
                  id: "hid-skeptical-theism",
                  side: "theist",
                  label: "We can't see far enough to judge what perfect love would do",
                  gist: "A hiding love looks lesser to us, but that is weak evidence that it is lesser, because we can't see all the goods an infinite mind can see.",
                  body: [
                    "{{schellenberg|Schellenberg}}'s two-lovers comparison works only if we can see everything that depends on the choice, and we probably can't. This is [[skeptical-theism|skeptical theism]], the view that our failure to see God's reasons is poor evidence that he has none. God answered Job's complaints with question after question, among them “Where wast thou when I laid the foundations of the earth?” (Job 38:4). The philosophers Justin McBrayer and Philip Swenson argued in 2012 that the hiddenness argument rests on an unstated premise, that if God had a reason to allow [[nonresistant-nonbelief|nonresistant nonbelief]], we would probably see it, and that nothing supports that premise. {{bergmann}} states the general point this way: “We have no good reason for thinking that the possible goods we know of are representative of the possible goods there are.”",
                  ],
                  quote: {
                    text: "For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.",
                    who: "The Book of Isaiah",
                    cite: "Isaiah 55:9 (KJV)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/Isaiah#55:9",
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
                      url: "https://www.cambridge.org/core/journals/religious-studies/article/abs/scepticism-about-the-argument-from-divine-hiddenness/4D6B1DC29875B7A657ED4020BDAB3677",
                      note: "Religious Studies 48: 129–150. The case that we shouldn't expect to see God's reasons for hiding.",
                    },
                    {
                      title: "Skeptical Theism and Rowe's New Evidential Argument from Evil",
                      by: "Michael Bergmann",
                      year: "2001",
                      note: "Noûs 35. Bergmann's thesis about known and unknown goods is on p. 279.",
                    },
                    {
                      title: "Skeptical Theism",
                      by: "Stanford Encyclopedia of Philosophy (Timothy Perrine)",
                      year: "2023",
                      url: "https://plato.stanford.edu/entries/skeptical-theism/",
                      note: "Section 2 sets out Bergmann's three theses; section 7.3 applies skeptical theism to the hiddenness argument.",
                    },
                  ],
                  children: [
                    {
                      id: "hid-logical-foul",
                      side: "skeptic",
                      label: "Unseen reasons can't defeat an argument from what love is",
                      gist: "Unseen reasons can answer arguments from how much evil we see, but this one starts from what perfect love is, and any reason God had would be a human good we can judge.",
                      body: [
                        "[[skeptical-theism|Skeptical theism]] answers arguments that go from what we see to what is probably true, such as *I see no reason for this evil, so there probably is none*. {{schellenberg}} reasons instead from what perfect love is. His argument is deductive, meaning the conclusion follows with certainty if the premises are true. So if we can see that the premises are true, no hidden good can block the conclusion. In 2015 he called the appeal to unknown goods a “logical foul” for that reason. Schellenberg adds that any good God had in mind here would be a good for us, a good of human relationship or growth, and those are the goods we understand best. And if we can't judge what perfect love would do about our unbelief, we can't be sure God will keep his promises either, including “I will never leave thee, nor forsake thee” (Hebrews 13:5).",
                      ],
                      quote: {
                        text: "He that loveth not knoweth not God; for God is love.",
                        who: "The First Letter of John",
                        cite: "1 John 4:8 (KJV)",
                        url: "https://en.wikisource.org/wiki/Bible_(King_James)/1_John#4:8",
                      },
                      thinkers: ["schellenberg"],
                      cedes:
                        "{{schellenberg|Schellenberg}} would have to give way if openness to relationship turned out not to be part of perfect love, making this a question of hidden goods after all.",
                      see: [
                        { id: "mor-mansel", why: "John Stuart Mill answers a similar move in Objection V by saying that a goodness unlike ours isn't goodness." },
                        { id: "coh-a-analogy", why: "Whether openness belongs to perfect love depends on the dispute over analogy in Objection I." },
                      ],
                      sources: [
                        {
                          title: "The Hiddenness Argument: Philosophy's New Challenge to Belief in God",
                          by: "J. L. Schellenberg",
                          year: "2015",
                          note: "Page 111 explains why he calls the appeal to unknown goods a 'logical foul'.",
                        },
                        {
                          title: "Review of The Hiddenness Argument",
                          by: "Adam Green (Notre Dame Philosophical Reviews)",
                          year: "2016",
                          url: "https://ndpr.nd.edu/reviews/the-hiddenness-argument-philosophys-new-challenge-to-belief-in-god/",
                          note: "Quotes the whole argument and doubts that skeptical theists will accept the 'logical foul' charge.",
                        },
                        {
                          title: "Divine Hiddenness Argument against God's Existence",
                          by: "Internet Encyclopedia of Philosophy (Luke Teeninga)",
                          url: "https://iep.utm.edu/divine-hiddenness-argument-against-gods-existence/",
                          note: "Section 2d describes skeptical theism as a reply to hiddenness arguments.",
                        },
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
          gist: "{{rea|Rea}} argues that feeling God near and God being near are different, and people can meet God in Scripture, worship and ordinary life without knowing it is him.",
          body: [
            "{{rea}} doubts premise two, which says no one can relate to God without first believing he exists. Feeling God near differs from God's being near, he argues. Thunder, beauty or a text read aloud in church can be experiences of God even when no one recognizes them. In 2009 he argued that Scripture and liturgy, the set forms of public worship, carry God's presence to anyone who takes part. {{stump}} and the philosopher Matthew Benton add that knowing a person may not require believing that he exists, just as a stranger can steady you long before you learn his name. Philosophers call a belief about someone you can't yet identify [[de-re-belief|*de re*]], Latin for 'about the thing'. On their view you can be in touch with God this way before you believe it is God. The psalmist asked, “whither shall I flee from thy presence?” (Psalm 139:7).",
          ],
          quote: {
            text: "Surely the LORD is in this place; and I knew it not.",
            who: "Jacob, waking from a dream at Bethel",
            cite: "Genesis 28:16 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Genesis#28:16",
          },
          thinkers: ["rea", "stump"],
          cedes: "If relating to God requires believing, from the first moment, that it is God you are dealing with, {{rea|Rea}}'s reply doesn't work.",
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
            {
              title: "Divine Hiddenness Argument against God's Existence",
              by: "Internet Encyclopedia of Philosophy (Luke Teeninga)",
              url: "https://iep.utm.edu/divine-hiddenness-argument-against-gods-existence/",
              note: "Section 2b covers replies on which a relationship with God needn't begin with belief; section 2c summarizes Rea on liturgy and Scripture.",
            },
          ],
          children: [
            {
              id: "hid-presence-not-belief",
              side: "skeptic",
              label: "You can't relate to someone you don't believe is there",
              gist: "{{schellenberg|Schellenberg}}'s argument is about a two-way relationship you know you're in, and an encounter you don't recognize as anyone isn't that.",
              body: [
                "{{schellenberg}} can grant that God might be present unrecognized, because his argument is about what he calls a “conscious, reciprocal relationship”, one you know you are in and can answer from your side. His premises require only belief, with no particular felt experience, because believing someone is there is the least such a relationship needs. The Defender's example of a stranger who steadies you supports Schellenberg, since you know the stranger is someone, even without his name, while a nonbeliever who hears thunder thinks only of the weather. Jacob, in the Genesis story, already believed in the God of his fathers when he woke at Bethel. The Bible itself says that “he that cometh to God must believe that he is” (Hebrews 11:6). And someone raised where no Christian worship is ever held never meets it at all.",
              ],
              quote: {
                text: "But if thou art everywhere, why do I not see thee present?",
                who: "Anselm of Canterbury",
                cite: "Proslogion ch. 1 (1077–78; tr. S. N. Deane)",
                url: "https://ccel.org/ccel/anselm/basic_works.iii.ii.html",
              },
              thinkers: ["schellenberg", "anselm"],
              cedes:
                "One clear case of a two-way relationship with God, in someone with no belief at all that he is there, would refute this.",
              sources: [
                {
                  title: "The Hiddenness Argument: Philosophy's New Challenge to Belief in God",
                  by: "J. L. Schellenberg",
                  year: "2015",
                  note: "Page 106 says the relationship at issue is a conscious, reciprocal one, and that belief is all Schellenberg requires.",
                },
                {
                  title: "Proslogion, ch. 1",
                  by: "Anselm of Canterbury (tr. S. N. Deane)",
                  year: "1077–78",
                  url: "https://ccel.org/ccel/anselm/basic_works.iii.ii.html",
                  note: "Anselm's prayer to a God he believes in and can't find.",
                },
                {
                  title: "Hiddenness of God",
                  by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
                  year: "2016, rev. 2022",
                  url: "https://plato.stanford.edu/entries/divine-hiddenness/",
                  note: "Section 4 weighs the replies, including Benton's and Stump's, on which a relationship can begin before belief.",
                },
              ],
              children: [
                {
                  id: "hid-faith-without-belief",
                  side: "theist",
                  label: "Trust without belief is enough to begin a relationship with God",
                  gist: "You can trust God, hope in him and act on that hope while unsure he exists, so a relationship can begin before belief is settled.",
                  body: [
                    "{{schellenberg|Schellenberg}}'s claim that relating to God requires believing in him doesn't fit faith as people live it. {{howard-snyder}} argues that [[nondoxastic-faith|faith that God exists doesn't require believing]] that he does, just as you can have faith that a friend will pull through surgery without quite believing she will. Such faith rests on hope and trust. The New Testament's own definition puts hope first: “faith is the substance of things hoped for, the evidence of things not seen” (Hebrews 11:1). In Mark's Gospel a father who can't settle his doubts prays anyway, and Jesus heals his son.",
                    "Even Schellenberg, in *The Will to Imagine* (2009), recommends a faith without belief, aimed at an ultimate reality he describes only in general terms, as the right response to religious doubt. On his account such faith “involves voluntary assent to a proposition, undertaken in circumstances where one views the state of affairs it reports as good and desirable but in which one lacks belief of the proposition”.",
                  ],
                  quote: {
                    text: "Lord, I believe; help thou mine unbelief.",
                    who: "A father, to Jesus",
                    cite: "Mark 9:24 (KJV)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/Mark#9:24",
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
                      url: "https://www.cambridge.org/core/journals/religious-studies/article/divine-hiddenness-and-the-nature-of-belief/79461FEDB40A12214BF1442BEDA07464",
                      note: "Religious Studies 43. Belief comes in degrees, so someone unsure about God can still turn toward him.",
                    },
                    {
                      title: "Faith",
                      by: "Stanford Encyclopedia of Philosophy (John Bishop and Daniel J. McKaughan)",
                      year: "2010, rev. 2023",
                      url: "https://plato.stanford.edu/entries/faith/",
                      note: "Section 8, 'Venturing faith, without belief', covers the accounts of Schellenberg and Howard-Snyder.",
                    },
                    {
                      title: "Review of The Will to Imagine",
                      by: "James A. Keller (Notre Dame Philosophical Reviews)",
                      year: "2010",
                      url: "https://ndpr.nd.edu/reviews/the-will-to-imagine-a-justification-of-skeptical-religion/",
                      note: "Summarizes Schellenberg's case for faith, without belief, in an ultimate reality, and quotes his definition (p. 3).",
                    },
                  ],
                  children: [
                    {
                      id: "hid-conscious-relationship",
                      side: "skeptic",
                      label: "Perfect love would want both sides aware from the start",
                      gist: "Hope can reach toward a God who might be there, but no one can knowingly be comforted or answered by someone they don't believe exists.",
                      body: [
                        "{{schellenberg}} replied in 2007, in an article whose title borrows {{paul|Paul}}'s “through a glass, darkly”, that the relationship perfect love seeks is conscious and two-way, and that [[nondoxastic-faith|faith without belief]] supplies only the human side of it. You can't knowingly receive comfort or forgiveness from someone you don't believe is giving it, and a child who hopes someone is in the next room is not yet being held. A perfectly loving God who could give more would not settle, even at the beginning, for a relationship one side can't know it is in. {{howard-snyder}}'s reply also helps only people who already have the idea of God to hope toward, and many people never had it.",
                      ],
                      quote: {
                        text: "Oh that I knew where I might find him! that I might come even to his seat!",
                        who: "Job",
                        cite: "Job 23:3 (KJV)",
                        url: "https://en.wikisource.org/wiki/Bible_(King_James)/Job#23:3",
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
                        {
                          title: "Divine Hiddenness and the Nature of Belief",
                          by: "Ted Poston and Trent Dougherty",
                          year: "2007",
                          url: "https://www.cambridge.org/core/journals/religious-studies/article/divine-hiddenness-and-the-nature-of-belief/79461FEDB40A12214BF1442BEDA07464",
                          note: "The article Schellenberg was answering.",
                        },
                        {
                          title: "1 Corinthians 13 (King James Version)",
                          by: "King James Bible",
                          year: "1611",
                          url: "https://en.wikisource.org/wiki/Bible_(King_James)/1_Corinthians#13:1",
                          note: "1 Corinthians, c. 54. The chapter on love, where Paul says we now see 'through a glass, darkly', the phrase in Schellenberg's title.",
                        },
                      ],
                      children: [
                        {
                          id: "hid-seeking-is-finding",
                          side: "theist",
                          label: "The relationship can start unnoticed and become two-way later",
                          gist: "Perfect love wants a relationship both sides know about, though not necessarily from the first day, and a seeker's longing may already be God's work.",
                          body: [
                            "{{schellenberg|Schellenberg}} assumes the relationship must be conscious from the start, since premise one says God would be open *always*, as if every delay were a refusal. A relationship meant to last forever could begin below awareness and be named later. {{augustine}} wrote that “our heart is restless, until it repose in Thee” (*Confessions* I.1, tr. E. B. Pusey), and on his view the restlessness is already God's doing, the pull of the one it seeks.",
                            "{{aquinas}} says knowledge that God exists “in a general and confused way is implanted in us by nature”, though this “is not to know absolutely that God exists; just as to know that someone is approaching is not the same as to know that Peter is approaching, even though it is Peter who is approaching” (*Summa Theologiae* I q.2 a.1, reply 1). His reason is that everyone naturally desires happiness, which is finally found in God, though many people think it lies in riches or pleasure.",
                            "The Oxford philosopher T. J. Mawson asked in 2012 what deadline God has set for belief. He suggested either “the moment of his or her death” or “one and the same deadline, the Eschaton/Last Judgment”. {{paul|Paul}} expected the rest to come later: “For now we see through a glass, darkly; but then face to face” (1 Corinthians 13:12).",
                          ],
                          quote: {
                            text: "Console thyself, thou wouldst not seek Me, if thou hadst not found Me.",
                            who: "Blaise Pascal",
                            cite: "Pensées 553, 'The Mystery of Jesus' (Brunschvicg numbering; tr. W. F. Trotter); no. 552 in the Gutenberg text",
                            url: "https://www.gutenberg.org/cache/epub/18269/pg18269-images.html#p_552",
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
                              note: "In Y. Nagasawa (ed.), Scientific Approaches to the Philosophy of Religion, 184–204. The deadlines are on p. 194.",
                            },
                            {
                              title: "Confessions, Book I",
                              by: "Augustine of Hippo (tr. E. B. Pusey)",
                              year: "c. 400",
                              url: "https://www.gutenberg.org/ebooks/3296",
                              note: "The opening chapter, with the restless heart.",
                            },
                            {
                              title: "Summa Theologiae I q.2, 'The Existence of God'",
                              by: "Thomas Aquinas",
                              url: "https://www.newadvent.org/summa/1002.htm",
                              note: "Article 1 and its first reply, on knowing God 'in a general and confused way'.",
                            },
                            {
                              title: "Pensées",
                              by: "Blaise Pascal (tr. W. F. Trotter)",
                              year: "1670",
                              url: "https://www.gutenberg.org/ebooks/18269",
                              note: "'The Mystery of Jesus' is fragment 553 (552 in the Gutenberg text's numbering).",
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
              gist: "If God allows horrors for reasons beyond us, love would at least let the sufferer know he is there, which {{rea|Rea}}'s reply can't promise a child dying alone.",
              body: [
                "{{rowe}}, an atheist philosopher best known for his [[problem-of-evil|argument from evil]], argued that if God allows horrible suffering for reasons beyond our grasp, a loving God would at least be consciously present to the sufferer and assure her of his love, which the unrecognized presence {{rea|Rea}} describes doesn't do. {{schellenberg}} argued in 2010 that hiddenness in the middle of horror makes a stronger case than either the problem of evil or the problem of hiddenness alone. His example is a child dying in pain, alone, with no sense of anyone there. Christians have said this too, among them {{lewis-cs}}, the author of *Mere Christianity*. After his wife died he wrote in *A Grief Observed* (1961) that if you go to God “when your need is desperate, when all other help is vain”, you find “A door slammed in your face, and a sound of bolting and double bolting on the inside. After that, silence.”",
              ],
              quote: {
                text: "O my God, I cry in the daytime, but thou hearest not; and in the night season, and am not silent.",
                who: "Psalm 22",
                cite: "Psalm 22:2 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/Psalms#22:2",
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
                  url: "https://place.asburyseminary.edu/faithandphilosophy/vol27/iss1/3",
                  note: "Faith and Philosophy 27: 45–60. The link is the journal's archive page.",
                },
                {
                  title: "A Grief Observed",
                  by: "C. S. Lewis",
                  year: "1961",
                  note: "Lewis's notebooks after his wife's death, which hold both the slammed door and the later silent gaze.",
                },
                {
                  title: "The Problem of Evil",
                  by: "Stanford Encyclopedia of Philosophy (Michael Tooley)",
                  year: "2002, rev. 2015",
                  url: "https://plato.stanford.edu/entries/evil/",
                  note: "Explains William Rowe's evidential argument from evil and the replies to it.",
                },
              ],
              children: [
                {
                  id: "hid-hiding-god",
                  side: "theist",
                  label: "The Bible's God hides, and believers have met him in lament",
                  gist: "The Bible's God hides his face, and Christians hear God himself in Jesus' cry from the cross, 'why hast thou forsaken me?'",
                  body: [
                    "The Bible never promised sufferers the felt presence {{rowe}} expects, and {{luther}} and {{pascal}} made the prophet Isaiah's phrase, the [[deus-absconditus|hidden God]], central to their theology. {{rea}} argues that God authorizes the protests in the Psalms, so that arguing with an absent God is a way of being with him. The Spanish mystic {{john-of-the-cross}} called the [[dark-night|dark night]] “an inflowing of God into the soul, which purges it from its ignorances and imperfections” (*Dark Night* II.5, tr. E. Allison Peers).",
                    "Luther taught a [[theology-of-the-cross|theology of the cross]], on which God shows himself most in weakness, above all on the cross, where Jesus prays Psalm 22: “My God, my God, why hast thou forsaken me?” {{adams-marilyn-m|Marilyn McCord Adams}} argues that God *defeats* horrors, her term for making them part of a life that is good overall, partly by sharing them, so that a child who dies alone can later see her worst hour as one God entered.",
                    "Later in *A Grief Observed* {{lewis-cs|C. S. Lewis}} took back his image of the bolted door: “It is not the locked door. It is more like a silent, certainly not uncompassionate, gaze.”",
                  ],
                  quote: {
                    text: "Verily thou art a God that hidest thyself, O God of Israel, the Saviour.",
                    who: "The Book of Isaiah",
                    cite: "Isaiah 45:15 (KJV; Vulgate: Vere tu es Deus absconditus)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/Isaiah#45:15",
                  },
                  thinkers: ["rea", "john-of-the-cross", "luther", "adams-marilyn-m", "lewis-cs"],
                  cedes:
                    "This reply would not survive if felt abandonment ended every relationship it touched, or if no sufferer, even afterward, could find God in her worst hour.",
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
                    {
                      title: "Dark Night of the Soul, Book II, ch. 5",
                      by: "John of the Cross (tr. E. Allison Peers)",
                      year: "c. 1585",
                      url: "https://ccel.org/ccel/john_cross/dark_night/dark_night.viii.v.html",
                      note: "John's account of the dark night as God's own work of purifying the soul.",
                    },
                    {
                      title: "Horrendous Evils and the Goodness of God",
                      by: "Marilyn McCord Adams",
                      year: "1999",
                      url: "https://www.cornellpress.cornell.edu/book/9780801486869/horrendous-evils-and-the-goodness-of-god/",
                      note: "Adams's account of how God defeats horrors.",
                    },
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
          gist: "{{moser|Moser}} holds that God's evidence is meant to change people, so God gives it through conscience to everyone willing to be changed.",
          body: [
            "{{moser}} answers premise three by asking what kind of openness the honest seekers have. Being open to a relationship on your own terms, he argues, differs from being willing to yield to God as Lord. On Moser's view, evidence of a perfectly loving God is a call to change, so God makes it “purposively available”, given in the ways and to the people that suit his aim of remaking us. A message written in the sky would be what Moser calls spectator evidence, informing people and leaving their wills untouched.",
            "The call comes first through conscience, Moser holds, as a pull toward unselfish love, even of enemies, so it reaches everyone. Demanding proof on our own terms before any surrender is what he calls [[cognitive-idolatry|cognitive idolatry]], treating God as an object to inspect. The promise in the Book of Jeremiah has a condition: “ye shall seek me, and find me, when ye shall search for me with all your heart” (Jeremiah 29:13).",
          ],
          quote: {
            text: "There is enough light for those who only desire to see, and enough obscurity for those who have a contrary disposition.",
            who: "Blaise Pascal",
            cite: "Pensées 430 (Brunschvicg; pub. 1670; tr. W. F. Trotter)",
            url: "https://www.gutenberg.org/cache/epub/18269/pg18269-images.html#p_430",
          },
          thinkers: ["moser", "pascal"],
          cedes:
            "Many people who were ready to let God remake their lives, who searched with all their heart and received nothing, would refute {{moser|Moser}}.",
          see: [
            { id: "evi-a-james", why: "In Objection IV, William James argues that some truths show themselves only to people who commit first." },
          ],
          sources: [
            {
              title: "The Elusive God: Reorienting Religious Epistemology",
              by: "Paul K. Moser",
              year: "2008",
              url: "https://www.cambridge.org/core/books/elusive-god/8C09572E1F084E8E8134632DE75A8980",
              note: "Moser's main statement of the view that evidence of God is 'purposively available'.",
            },
            {
              title: "Cognitive Idolatry and Divine Hiding",
              by: "Paul K. Moser",
              year: "2002",
              note: "In Howard-Snyder & Moser (eds.), Divine Hiddenness: New Essays, 120–148.",
            },
            {
              title: "Review of The Elusive God",
              by: "Bruce Russell (Notre Dame Philosophical Reviews)",
              year: "2009",
              url: "https://ndpr.nd.edu/reviews/the-elusive-god-reorienting-religious-epistemology/",
              note: "A critical review that quotes Moser at length on why God's evidence is easy to ignore.",
            },
          ],
          children: [
            {
              id: "hid-willing-found-nothing",
              side: "skeptic",
              label: "Seekers willing to be changed still found nothing",
              gist: "Many who begged to be remade lost their belief or never found it, and no seeker can promise obedience to a Lord she doesn't yet believe in.",
              body: [
                "If {{moser|Moser}} is right, everyone willing to be changed should find God. {{schellenberg}} describes former believers who begged God to keep them believing and watched honest inquiry dissolve their faith, and lifelong seekers who knocked for years on a door that never opened. Moser's test also demands something no seeker can give in advance, since being willing to obey a Lord assumes you believe there is one. These seekers offered all a doubter can, something like *if you are there, I am yours*.",
                "{{pascal}} granted that such people exist, those “occupied in seeking Him, not having found Him”, whom he calls “unhappy and reasonable” (*Pensées* 257), and the fragment that promises “enough light” also says God should not come so hidden “that He could not be known by those who should sincerely seek Him” (*Pensées* 430).",
                "The same test would also confirm rival faiths. The Book of Mormon promises that “if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you” (Moroni 10:4), and sincere askers come away with answers that contradict each other.",
              ],
              quote: {
                text: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.",
                who: "Jesus, in the Sermon on the Mount",
                cite: "Matthew 7:7 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#7:7",
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
                  url: "https://www.cornellpress.cornell.edu/book/9780801445545/the-wisdom-to-doubt/",
                  note: "Chapter 10 covers former believers, lifelong seekers, converts to religions with no personal God, and people who never heard of one.",
                },
                {
                  title: "Review of The Wisdom to Doubt",
                  by: "Stephen Wykstra and Timothy Perrine (Notre Dame Philosophical Reviews)",
                  year: "2008",
                  url: "https://ndpr.nd.edu/reviews/the-wisdom-to-doubt-a-justification-of-religious-skepticism/",
                  note: "A summary of the book's three parts and its case for religious skepticism.",
                },
                {
                  title: "Pensées",
                  by: "Blaise Pascal (tr. W. F. Trotter)",
                  year: "1670",
                  url: "https://www.gutenberg.org/ebooks/18269",
                  note: "Fragment 257 on those who seek without finding, and 430 on light and obscurity.",
                },
                {
                  title: "The Book of Mormon",
                  by: "Joseph Smith Jr. (named “Author and Proprietor” on the 1830 title page)",
                  year: "1830",
                  url: "https://www.gutenberg.org/ebooks/17",
                  note: "Moroni 10:4 promises that sincere askers will be shown the book's truth.",
                },
              ],
              children: [
                {
                  id: "hid-hidden-resistance",
                  side: "theist",
                  label: "A seeker's divided will can explain God's silence",
                  gist: "Wanting evidence differs from being ready to be ruled by love, and a person's will can be divided without her knowing it, so sincere reports can't settle who is open.",
                  body: [
                    "{{moser}} separates openness to proof from openness to God as Lord. A person can sincerely want the first while shrinking from the second, and can say *if you are there, I am yours* with a divided will, so the seekers' reports can't settle which openness they had. {{schellenberg|Schellenberg}} himself counts self-deception as resistance, and people who deceive themselves don't know it.",
                    "{{aquinas}}, quoting {{aristotle}}, defined love as “to wish good to someone” (*Summa Theologiae* I-II q.26 a.4), and on {{stump}}'s reading love also seeks union. Union needs a beloved who is whole inside, so a divided person can't receive full presence even when asking, through no one's fault, as no friend can fully know you while you hide from yourself.",
                    "{{howard-snyder}} adds that belief given too soon, to someone who would answer with rejection or the wrong motives, could make the person harder to win.",
                  ],
                  quote: {
                    text: "A double minded man is unstable in all his ways.",
                    who: "The Letter of James",
                    cite: "James 1:8 (KJV)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/James#1:8",
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
                      url: "https://www.cambridge.org/core/journals/canadian-journal-of-philosophy/article/abs/argument-from-divine-hiddenness/404B49AB13C2288217C419C240A8375D",
                      note: "Canadian Journal of Philosophy 26. Argues that belief given too soon could lead someone to reject God or accept him for the wrong reasons.",
                    },
                    {
                      title: "Summa Theologiae I-II q.26, 'Of Love'",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/2026.htm",
                      note: "Article 4, where Aquinas takes Aristotle's definition of love as wishing good to someone.",
                    },
                    {
                      title: "Review of Wandering in Darkness",
                      by: "Paul Draper (Notre Dame Philosophical Reviews)",
                      year: "2011",
                      url: "https://ndpr.nd.edu/reviews/wandering-in-darkness-narrative-and-the-problem-of-suffering/",
                      note: "An assessment of Stump's account of love, suffering and second-person knowledge.",
                    },
                  ],
                  children: [
                    {
                      id: "hid-pursues",
                      side: "skeptic",
                      label: "A loving God would go after even those who resist him",
                      gist: "Even if some unbelief hid resistance, a loving parent helps a child out of a mess it partly made, and hidden resistance wouldn't follow national borders.",
                      body: [
                        "Even if some unbelief hides a divided will, a perfectly loving God would still go after it. {{maitzen}} writes: “A loving parent can often be expected to help his or her child out of a miserable predicament, even if the child is in some sense to blame for being in the predicament.” The atheist philosopher {{drange|Theodore Drange}} had made the same point in 1998: “A perfectly loving deity would set vindictiveness aside and still want to help nonbelievers (by supplying them with evidence of his existence), despite their culpability.” The prodigal son's father didn't wait for a purer motive. And as {{schellenberg}} notes, God already relates to immature, double-minded believers, so readiness can't be a condition of belief. Maitzen adds that whatever hidden fault is supposed to block belief, such as pride or a lack of humility, presumably doesn't cluster by country, yet unbelief follows national borders. And a resistance hidden even from the resister can't be checked, since no seeker's report could ever count against it.",
                      ],
                      quote: {
                        text: "But when he was yet a great way off, his father saw him, and had compassion, and ran, and fell on his neck, and kissed him.",
                        who: "Jesus, in the parable of the prodigal son",
                        cite: "Luke 15:20 (KJV)",
                        url: "https://en.wikisource.org/wiki/Bible_(King_James)/Luke#15:20",
                      },
                      thinkers: ["maitzen", "schellenberg"],
                      cedes:
                        "This would be answered if belief given to a resister made healing less likely, and if hidden resistance showed some sign other than the unbelief it is meant to explain.",
                      see: [
                        { id: "mor-hell", why: "Objection V asks what judgment for unbelief adds to hiddenness." },
                        { id: "hid-demographics", why: "Maitzen on why the resistance story needs resistance to follow national borders." },
                      ],
                      sources: [
                        {
                          title: "Divine Hiddenness and the Demographics of Theism",
                          by: "Stephen Maitzen",
                          year: "2006",
                          url: "https://doi.org/10.1017/S0034412506008274",
                          note: "Religious Studies 42. The loving parent is on p. 181; why hidden faults don't cluster by country, on p. 184.",
                        },
                        {
                          title: "Nonbelief as Support for Atheism",
                          by: "Theodore M. Drange",
                          year: "1998",
                          url: "https://infidels.org/library/modern/theodore-drange-nonbelief/",
                          note: "Drange argues that whether or not nonbelief is anyone's fault, a loving God would supply the evidence.",
                        },
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
            "{{schellenberg|Schellenberg}} assumes that giving everyone belief is always loving, and defenders of free will deny it, since love wants a free answer. {{hick}} argued that people need [[epistemic-distance|epistemic distance]], a distance in what they can know of God, so they can grow into goodness without being pressed into it. {{swinburne}} argues that moral choice needs a God whose existence is not too evident, because with God in plain view doing right would always be prudent.",
            "{{murray}} argued in 1993 that belief in an all-powerful God who judges every act would coerce, since a threat that is evident and near coerces, and no one calls handing over a wallet at gunpoint generosity. {{kant}} imagined God and eternity “with their awful majesty” (awful meaning awe-inspiring) standing “unceasingly before our eyes”. Then, he wrote, most lawful acts “would be done from fear, a few only from hope, and none at all from duty”, and human conduct would become a puppet show in which “everything would gesticulate well, but there would be no life in the figures.”",
          ],
          quote: {
            text: "Thomas, because thou hast seen me, thou hast believed: blessed are they that have not seen, and yet have believed.",
            who: "Jesus, to Thomas",
            cite: "John 20:29 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/John#20:29",
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
              gist: "{{schellenberg|Schellenberg}} wants only belief, which leaves people free, since devils believe and still rebel and no one calls devout believers puppets.",
              body: [
                "The coercion reply confuses believing someone exists with being cornered by them. {{schellenberg}}'s argument needs only belief, and Christian tradition itself holds that you can know God exists and still defy him. The apostle Thomas saw the risen Jesus' wounds and {{paul|Paul}} fell to the ground on the road to Damascus, and neither lost his freedom. {{maitzen}} asks “what happens to the freedom of those many believers who claim that God's existence is as certain for them as anything they believe?” The atheist philosopher {{drange|Theodore Drange}} argued that “People's free will is not affected by them merely learning or being shown the truth about something, even by God.”",
                "{{kant}} worried about certainty as strong as sight, far beyond the modest belief Schellenberg's argument needs. Schellenberg's general answer, the [[accommodation-strategy|accommodation strategy]], is that every good these defenses name can be had inside belief. Since Christians count relationship with God as the greatest good, he argues, no good that requires its absence could outweigh it.",
              ],
              quote: {
                text: "Thou believest that there is one God; thou doest well: the devils also believe, and tremble.",
                who: "The Letter of James",
                cite: "James 2:19 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/James#2:19",
              },
              thinkers: ["schellenberg", "maitzen", "kant"],
              cedes:
                "This fails if modest belief overwhelms the freedom of those who hold it, or if some good worth having can come only through real, temporary unbelief.",
              see: [
                { id: "hid-testimony-accommodation", why: "Part 2 uses the same strategy against the spread of belief." },
                { id: "mor-allegiance", why: "In Objection V the Defender cites the same verse to show that bare belief saves no one." },
                { id: "coh-b-teleo", why: "Objection I on whether a will that can't fall is free." },
              ],
              sources: [
                {
                  title: "The Hiddenness Argument Revisited (II)",
                  by: "J. L. Schellenberg",
                  year: "2005",
                  note: "Religious Studies 41. Replies to the freedom and coercion defenses.",
                },
                {
                  title: "Nonbelief as Support for Atheism",
                  by: "Theodore M. Drange",
                  year: "1998",
                  url: "https://infidels.org/library/modern/theodore-drange-nonbelief/",
                  note: "Drange's replies to the free-will defense.",
                },
                {
                  title: "Divine Hiddenness and the Demographics of Theism",
                  by: "Stephen Maitzen",
                  year: "2006",
                  url: "https://doi.org/10.1017/S0034412506008274",
                  note: "Religious Studies 42. Page 182 asks about believers who are already certain.",
                },
              ],
              children: [
                {
                  id: "hid-responsibility",
                  side: "theist",
                  label: "Sharing God's work needs people who don't yet believe",
                  gist: "If God gave everyone belief directly, no one could help bring another person to know him, which {{dumsday|Dumsday}} counts among the greatest goods.",
                  body: [
                    "{{schellenberg|Schellenberg}}'s [[accommodation-strategy|accommodation reply]] assumes every good survives if God puts the basic belief in place himself. {{dumsday}} argued in 2010 that one doesn't. Among the greatest goods open to us, he says, is working with God, as friends, to bring others to know him. That good needs people who don't yet believe and whose coming to believe depends partly on us. {{paul|Paul}} called himself and his helpers “labourers together with God” (1 Corinthians 3:9). {{swinburne}} adds the goods of finding God out for oneself and of helping one another search, and both would vanish if God simply supplied the answer, as they would for a child whose parents did all her homework. On this view the unbelief is temporary, and God can still save people no messenger ever meets.",
                  ],
                  quote: {
                    text: "How then shall they call on him in whom they have not believed? and how shall they believe in him of whom they have not heard? and how shall they hear without a preacher?",
                    who: "Paul, to the Romans",
                    cite: "Romans 10:14 (KJV)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/Romans#10:14",
                  },
                  thinkers: ["dumsday", "swinburne"],
                  cedes:
                    "If helping others come to God could be had as fully in a world where everyone already believed, {{dumsday|Dumsday}}'s good gives God no reason to hide.",
                  see: [
                    { id: "hid-messengers", why: "Part 2 finds the same good in the spread of belief, where faith passes from person to person." },
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
                    {
                      title: "Hiddenness of God",
                      by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
                      year: "2016, rev. 2022",
                      url: "https://plato.stanford.edu/entries/divine-hiddenness/",
                      note: "Section 3 lists this and the other proposed reasons for God to allow nonbelief, with references.",
                    },
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
          label: "God isn't one more being who could show up or stay away",
          gist: "The argument pictures God as one more being who could show up or not, but {{hart|Hart}} says God is the source of all being and present in every thought.",
          body: [
            "{{schellenberg|Schellenberg}}'s argument imagines God as a great someone who could step into view and has, for some reason, declined. [[classical-theism|Classical theists]], in the tradition of {{augustine}} and {{aquinas}}, reject that picture. {{hart}} insists that God is no being among beings. He is being itself, the ground of every existence and every act of knowing, and looking for him among things is like looking for the light among the objects it lets you see. In ((coh-a-concur|Objection I)), the Defender says the same about causes.",
            "On this view God is hard to notice because he is present in everything, and a seeker needs attention more than new evidence. Aquinas wrote that “God is in all things; not, indeed, as part of their essence, nor as an accident, but as an agent is present to that upon which it works”, and that he is in them “innermostly” (*Summa Theologiae* I q.8 a.1). Augustine found him the same way: “Thou wert within, and I abroad, and there I searched for Thee” (*Confessions* X.27, tr. E. B. Pusey).",
          ],
          quote: {
            text: "For in him we live, and move, and have our being.",
            who: "Paul, preaching in Athens",
            cite: "Acts 17:28 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Acts#17:28",
          },
          thinkers: ["hart", "aquinas", "augustine"],
          cedes: "The reply is in trouble if, to escape the argument, it has to stop saying that God knows and loves each person.",
          see: [
            { id: "coh-a-concur", why: "In Objection I, God is said to ground every cause without competing with any." },
            { id: "mor-not-agent", why: "Brian Davies argues in Objection V that God is not a moral agent who owes each creature its due." },
          ],
          sources: [
            {
              title: "The Experience of God: Being, Consciousness, Bliss",
              by: "David Bentley Hart",
              year: "2013",
              url: "https://yalebooks.yale.edu/book/9780300209358/the-experience-of-god/",
              note: "Hart's case that God is being itself, the source of everything that exists.",
            },
            {
              title: "Summa Theologiae I q.8, 'The Existence of God in Things'",
              by: "Thomas Aquinas",
              url: "https://www.newadvent.org/summa/1008.htm",
              note: "Article 1, on how God is in all things 'innermostly'.",
            },
            {
              title: "Confessions, Book X",
              by: "Augustine of Hippo (tr. E. B. Pusey)",
              year: "c. 400",
              url: "https://www.gutenberg.org/ebooks/3296",
              note: "Chapter 27, 'Too late loved I Thee', where Augustine finds God within.",
            },
          ],
          children: [
            {
              id: "hid-nonobject-belief",
              side: "skeptic",
              label: "A God who is no object can still put a belief in a mind",
              gist: "The argument never asked to see God among objects, only to believe he exists, and a God who causes every thought can cause that one.",
              body: [
                "{{hart}}'s point explains why God doesn't turn up in a telescope, but {{schellenberg}}'s argument is about why honest people lack the belief. A God who is not one more thing can still cause a thought in a mind, and on Hart's view he causes every thought there is. {{aquinas}}, in the same tradition, holds that God's existence can be proved, and explains why God [[revelation|revealed]] it anyway, since without revelation the truth “would only be known by a few, and that after a long time, and with the admixture of many errors” (*Summa Theologiae* I q.1 a.1). On Aquinas's view revelation was the remedy, but it has reached people according to their ((hid-demographics|birthplace and century)). And Hart himself says God is love, so he can't set aside Schellenberg's first premise, which is about love.",
              ],
              quote: {
                text: "Now because we do not know the essence of God, the proposition is not self-evident to us; but needs to be demonstrated by things that are more known to us, though less known in their nature—namely, by effects.",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I q.2 a.1 (tr. Fathers of the English Dominican Province)",
                url: "https://www.newadvent.org/summa/1002.htm",
              },
              thinkers: ["schellenberg", "aquinas"],
              cedes:
                "I'd concede if a God who causes every thought couldn't cause this one without ceasing to be the source of all being.",
              see: [
                { id: "nat-b-exist", why: "Objection III follows the route to God from his effects." },
                { id: "hid-sensus", why: "Part 2 asks whether every mind already has some sense of God, as Calvin held." },
              ],
              sources: [
                {
                  title: "Summa Theologiae I q.1, 'The Nature and Extent of Sacred Doctrine'",
                  by: "Thomas Aquinas",
                  url: "https://www.newadvent.org/summa/1001.htm",
                  note: "Article 1 explains why even truths that reason can reach about God were also revealed.",
                },
                {
                  title: "Summa Theologiae I q.2, 'The Existence of God'",
                  by: "Thomas Aquinas",
                  url: "https://www.newadvent.org/summa/1002.htm",
                  note: "Article 1, on why God's existence must be shown from his effects.",
                },
              ],
            },
            {
              id: "hid-spinoza-my-god",
              side: "spinoza",
              label: "Spinoza says a God who can't hide also can't love anyone",
              gist: "{{spinoza|Spinoza}} agrees that a God who grounds everything is the most knowable thing there is, but such a God has no feelings and chooses nothing, so he loves no one.",
              body: [
                "{{spinoza|Spinoza}} would agree with {{hart}} that a God in whom we live and move, in {{paul|Paul}}'s words, is no object and isn't hidden at all, and would conclude that such a God can't love anyone. Spinoza wrote that “The human mind has an adequate knowledge of the eternal and infinite essence of God” (*Ethics* II P47), where *adequate* means true and complete. He claimed Paul's sentence, telling {{oldenburg|Henry Oldenburg}}, secretary of the Royal Society, in 1675, “I say that all things are in God and move in God, thus agreeing with Paul” (Letter 73).",
                "If God is the ground of being in Spinoza's sense, the one substance from whose nature everything follows by necessity, he can't also be a lover. Spinoza's God “is without passions” and, “Strictly speaking, God does not love or hate anyone” (V P17 and Cor.). He “does not act according to freedom of the will” (I P32 Cor. 1).",
                "Spinoza does speak of an [[amor-dei-intellectualis|intellectual love]] in which “the love of God towards men, and the intellectual love of the mind towards God are identical” (V P36 Cor.), but that love chooses no one and waits for no reply. On Spinoza's view, Hart escapes the argument only by describing a God who couldn't want a relationship at all.",
              ],
              quote: {
                text: "He, who loves God, cannot endeavour that God should love him in return.",
                who: "Baruch Spinoza",
                cite: "Ethics V P19 (1677; tr. R. H. M. Elwes)",
                url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap05:~:text=He%2C%20who%20loves%20God%2C%20cannot%20endeavour",
              },
              thinkers: ["spinoza"],
              cedes:
                "{{spinoza|Spinoza}} would be wrong if a God who is being itself could also choose to seek one person and wait on another without becoming one more thing among things.",
              see: [
                { id: "coh-a-collapse", why: "Objection I asks whether a God with no parts can choose freely at all, or creates by necessity." },
                { id: "hid-spinoza-allknow", why: "Spinoza's other point here is that every mind knows God, under the wrong name." },
                { id: "nat-b-necess", why: "Objection III explains why Spinoza's God chooses nothing, starting from the principle that everything has a reason." },
              ],
              sources: [
                {
                  title: "Ethics, Parts I, II and V",
                  by: "Baruch Spinoza (tr. R. H. M. Elwes)",
                  year: "1677",
                  url: "https://www.gutenberg.org/ebooks/3800",
                  note: "Spinoza's lines on God come from I P32, II P47, and V P17–19 and P36.",
                },
                {
                  title: "The Chief Works of Benedict de Spinoza, vol. 2, Letter 73 (Elwes XXI)",
                  by: "Baruch Spinoza (trans. R. H. M. Elwes)",
                  year: "1884 (1891 printing)",
                  url: "https://archive.org/details/chiefworksofbene02spin/page/298",
                  note: "To Oldenburg, late 1675, where Spinoza says all things 'are in God and move in God'.",
                },
                {
                  title: "Baruch Spinoza",
                  by: "Stanford Encyclopedia of Philosophy (Steven Nadler)",
                  year: "2001, rev. 2023",
                  url: "https://plato.stanford.edu/entries/spinoza/",
                  note: "An overview of Spinoza's God, or Nature, and of the Ethics.",
                },
              ],
              children: [
                {
                  id: "hid-hart-personal",
                  side: "theist",
                  label: "A God without passions can still love and seek each person",
                  gist: "God's love isn't a reaction to us, {{hart|Hart}} argues, so it is pure gift, and in Jesus that love came looking for the lost.",
                  body: [
                    "{{aquinas}} and his followers agree with {{spinoza|Spinoza}} that the source of all being has no passions. {{hart}} defends divine [[impassibility|impassibility]], the teaching that nothing we do adds to God's joy or wounds it. He argues that a love that doesn't react to us has nothing to gain from us, so it is pure gift. Aquinas holds that God wills his own goodness necessarily but wills creatures freely, since “no perfection can accrue to Him from them” (*Summa Theologiae* I q.19 a.3).",
                    "The Gospels say God does seek people: “the Son of man is come to seek and to save that which was lost” (Luke 19:10). {{kierkegaard}} told a parable about a king who loves a humble maiden and wants her love without her awe. A disguise would be a deceit, so Kierkegaard concluded that God would have to become a servant in fact, and that the servant form in Jesus was his true form. Jesus told Philip, “he that hath seen me hath seen the Father” (John 14:9).",
                  ],
                  quote: {
                    text: "No man hath seen God at any time, the only begotten Son, which is in the bosom of the Father, he hath declared him.",
                    who: "The Gospel of John",
                    cite: "John 1:18 (KJV)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/John#1:18",
                  },
                  thinkers: ["hart", "aquinas", "kierkegaard"],
                  cedes:
                    "{{hart|Hart}} would be wrong if love required passion, being moved by the beloved, so that a God beyond change couldn't also know and seek each person.",
                  see: [
                    { id: "coh-a-extrinsic", why: "In Objection I, the Defender answers the worry that a necessary God makes everything necessary, by arguing that God's act is necessary and its effects are not." },
                    { id: "hid-demographics", why: "Part 2 asks whether one incarnation, in one time and place, reaches everyone." },
                    { id: "nat-b-contrast", why: "In Objection III, Spinoza argues against free creation that a reason which would fit either choice can't explain why God made one of them." },
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
                    {
                      title: "Summa Theologiae I q.19, 'The Will of God'",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1019.htm",
                      note: "Article 3, on why God wills his own goodness necessarily and creatures freely.",
                    },
                    {
                      title: "Immutability",
                      by: "Stanford Encyclopedia of Philosophy (Brian Leftow)",
                      year: "2002, rev. 2024",
                      url: "https://plato.stanford.edu/entries/immutability/",
                      note: "Section 2 separates the claim that God can't change from the claim that nothing can affect him, the impassibility Hart defends.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    /* ──────────────── II. BELIEF FOLLOWS BIRTHPLACE ──────────────── */
    {
      id: "hid-demographics",
      side: "skeptic",
      label: "A God open to every heart wouldn't let belief follow birthplace",
      gist: "If God were open to every heart, belief wouldn't depend on where and when you were born, but it clusters by culture and was absent for most of history.",
      body: [
        "The philosopher {{maitzen}} looked at where believers live: “The populace of Saudi Arabia is at least 95 per cent Muslim and therefore at least 95 per cent theistic, while the populace of Thailand is 95 per cent Buddhist and therefore at most 5 per cent theistic.” Theistic here means believing in one personal God. No one supposes Thais resist God more than Saudis do. Maitzen argues that culture and politics explain the pattern easily, while a God open to every heart would leave it a puzzle.",
        "For most of our species' history probably no one had the idea of a single personal creator to accept or resist. {{schellenberg}} treats these people as the clearest cases, since they “never have had a real chance to *think* about God” (*The Hiddenness Argument*, p. 106). {{nietzsche}} had asked in *Daybreak* (1881, §91) about a God who “for thousands of years, has permitted innumerable doubts and scruples to continue unchecked”.",
        "{{marsh}} argued in 2013 that early humans “originally lacked a concept of God and were religiously restricted to concepts of limited, and sometimes mean, supernatural agents”, and that such [[natural-nonbelief|natural nonbelief]], unbelief from never having met the idea, is what unguided evolution predicts.",
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
        { id: "mor-inclusivism", why: "Objection V asks whether people the gospel never reaches are lost, which makes this pattern matter more." },
      ],
      sources: [
        {
          title: "Divine Hiddenness and the Demographics of Theism",
          by: "Stephen Maitzen",
          year: "2006",
          url: "https://doi.org/10.1017/S0034412506008274",
          note: "Religious Studies 42: 177–191. The Saudi and Thai figures are on p. 179.",
        },
        {
          title: "Darwin and the Problem of Natural Nonbelief",
          by: "Jason Marsh",
          year: "2013",
          note: "The Monist 96. The passage on early humans is on p. 359.",
        },
        {
          title: "Hiddenness of God",
          by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
          year: "2016, rev. 2022",
          url: "https://plato.stanford.edu/entries/divine-hiddenness/",
          note: "Sections 5 and 6 cover the argument from the demographics of nonbelief and the argument from natural nonbelief, with replies.",
        },
        {
          title: "Divine Hiddenness Argument against God's Existence",
          by: "Internet Encyclopedia of Philosophy (Luke Teeninga)",
          url: "https://iep.utm.edu/divine-hiddenness-argument-against-gods-existence/",
          note: "Section 1b summarizes Maitzen's argument and why it sidesteps the usual replies.",
        },
      ],
      children: [
        {
          id: "hid-messengers",
          side: "theist",
          label: "God works through messengers, so belief must travel unevenly",
          gist: "People learn most of what they know from one another, and {{baker-hytch|Baker-Hytch}} argues that a God who values that should expect belief in him to spread unevenly.",
          body: [
            "{{baker-hytch}} argued in 2016 that {{maitzen}}'s figures show knowledge of God passing from person to person. We are, he writes, “cognitively constituted in such a way that it is a practical necessity that we rely upon testimony for much of what we know about the world”. He counts this [[mutual-epistemic-dependence|mutual dependence]] for knowledge as a great good, so a God who values it should expect belief to spread unevenly, along the roads people travel.",
            "In 1736 the Anglican clergyman {{butler}} answered critics who thought [[revelation|revelation]] suspect because its light had not reached everyone. God, he observed, hands out health, strength, knowledge and the means of improvement “with the most promiscuous variety”, meaning indiscriminately, without regard to who needs them, and he held that revelation is given the same way. {{pascal}} even counted the diversity of religions as a sign of the hidden God: “If there were only one religion, God would indeed be manifest” (*Pensées* 585).",
          ],
          quote: {
            text: "…the Author of Nature, in numberless instances, bestows that upon some, which he does not upon others, who seem equally to stand in need of it.",
            who: "Joseph Butler",
            cite: "The Analogy of Religion, Part II, ch. VI (1736)",
            url: "https://ccel.org/ccel/butler/analogy/analogy.iv.ii.vi.html",
          },
          thinkers: ["baker-hytch", "butler", "pascal"],
          cedes:
            "If God could keep every good of shared, handed-down knowledge and still give each person belief directly, {{baker-hytch|Baker-Hytch}} has no answer.",
          see: [
            { id: "mor-inclusivism", why: "Objection V asks whether people the messengers never reach can still be saved." },
            { id: "hid-responsibility", why: "Dumsday's good of being a messenger, working with God to bring others to know him." },
          ],
          sources: [
            {
              title: "Mutual Epistemic Dependence and the Demographic Divine Hiddenness Problem",
              by: "Max Baker-Hytch",
              year: "2016",
              note: "Religious Studies 52. The passage on testimony is on p. 376.",
            },
            {
              title: "The Analogy of Religion, Part II, ch. VI",
              by: "Joseph Butler",
              year: "1736",
              url: "https://ccel.org/ccel/butler/analogy/analogy.iv.ii.vi.html",
              note: "'Of the Want of Universality in Revelation', Butler's answer to the complaint that revelation hasn't reached everyone.",
            },
            {
              title: "Hiddenness of God",
              by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
              year: "2016, rev. 2022",
              url: "https://plato.stanford.edu/entries/divine-hiddenness/",
              note: "Section 5 sets out Baker-Hytch's reply to Maitzen step by step.",
            },
          ],
          children: [
            {
              id: "hid-testimony-accommodation",
              side: "skeptic",
              label: "God could value testimony and still give everyone basic belief",
              gist: "Valuing testimony doesn't require leaving whole civilizations without the idea of God, since God could give everyone a bare belief and leave the rest to human witness.",
              body: [
                "A God who valued our dependence on one another could still give every person the bare belief that he exists and leave knowledge of his character and will to be handed on. That would keep {{baker-hytch}}'s good while giving the idea of God to the San hunter-gatherers of the Kalahari, and to people tens of thousands of years ago. {{maitzen}} had asked in 2006 why the San, or any culture, should be “less lucky”.",
                "The variety of religions, which {{pascal}} took as a sign of the hidden God, doesn't fit the pattern either, since inside Saudi Arabia or Thailand nearly everyone shares one faith and the diversity lies between countries. Bishop {{butler|Butler}}'s comparison arguably helps the Objector, since truth handed out as unevenly as health is what we would expect if no one were handing it out. As Maitzen puts it, “Suffering does not respect geography the way non-belief does.”",
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
              sources: [
                {
                  title: "Divine Hiddenness and the Demographics of Theism",
                  by: "Stephen Maitzen",
                  year: "2006",
                  url: "https://doi.org/10.1017/S0034412506008274",
                  note: "Religious Studies 42. The San are on p. 183; suffering and geography, on p. 189.",
                },
                {
                  title: "The Analogy of Religion, Part II, ch. VI",
                  by: "Joseph Butler",
                  year: "1736",
                  url: "https://ccel.org/ccel/butler/analogy/analogy.iv.ii.vi.html",
                  note: "Butler's passage on unequal gifts such as health and strength.",
                },
              ],
            },
          ],
        },
        {
          id: "hid-middle-knowledge",
          side: "theist",
          label: "God places those who would respond where the message reaches",
          gist: "A God who knows what anyone would freely do, {{craig|Craig}} argues, can arrange history so that people who would respond are born where they can hear the gospel.",
          body: [
            "The pattern looks like an accident of birth only if God placed people at random, and {{craig}} argued in 1989 that he need not have. If God has [[middle-knowledge|middle knowledge]], meaning he knows what every possible person would freely do in any situation, he can order history so that anyone who would accept the gospel is born where they will hear it. In Craig's words, “God in His providence has so arranged the world that anyone who would receive Christ has the opportunity to do so.” Those who never hear would not have believed in any history God could have created, a condition Craig calls transworld damnation. On his account they are lost because of how they would freely have responded, and no one is lost because of where they happened to be born.",
          ],
          quote: {
            text: "…and hath determined the times before appointed, and the bounds of their habitation; That they should seek the Lord, if haply they might feel after him, and find him…",
            who: "Paul, preaching in Athens",
            cite: "Acts 17:26–27 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Acts#17:26",
          },
          thinkers: ["craig"],
          cedes:
            "{{craig|Craig}}'s model fails if there is nothing for God to know about what people would freely do, or if those who would refuse in every circumstance can't be the ones born out of reach.",
          see: [
            { id: "coh-b-molina", why: "Objection I asks whether anything could make God's middle knowledge true." },
            { id: "hid-spared", why: "Jason Marsh's gentler version, in which the unreached are spared." },
          ],
          sources: [
            {
              title: "'No Other Name': A Middle Knowledge Perspective on the Exclusivity of Salvation through Christ",
              by: "William Lane Craig",
              year: "1989",
              url: "https://www.reasonablefaith.org/writings/scholarly-writings/the-/no-other-name-a-middle-knowledge-perspective-on-the-exclusivity-of-salvatio/",
              note: "Faith and Philosophy 6: 172–188. The full text, including Craig's definition of 'transworld damnation'.",
            },
            {
              title: "Middle Knowledge",
              by: "Internet Encyclopedia of Philosophy (John D. Laing)",
              url: "https://iep.utm.edu/middlekn/",
              note: "Explains middle knowledge, the doctrine Craig's model depends on, and the objections to it.",
            },
            {
              title: "Foreknowledge and Free Will",
              by: "Stanford Encyclopedia of Philosophy (David Hunt and Linda Zagzebski)",
              year: "2004, rev. 2026",
              url: "https://plato.stanford.edu/entries/free-will-foreknowledge/",
              note: "Section 2.6, 'The transfer of necessity', sets out Luis de Molina's theory of middle knowledge.",
            },
          ],
          children: [
            {
              id: "hid-molinism-clustering",
              side: "skeptic",
              label: "Souls who'd refuse God don't come sorted by birthplace",
              gist: "{{craig|Craig}}'s story needs the people who would refuse God to be born mostly in certain countries and centuries, and nothing supports that apart from the pattern itself.",
              body: [
                "{{craig}}'s reply explains the pattern only by turning it into a fact about souls. Thailand would have to be where God placed people who would refuse him in any circumstances, along with the thousands of generations who lived before anyone preached a single creator. Craig's paper begins from {{hick}}'s question whether it is “credible that the loving God and Father of all men has decreed that only those born within one particular thread of human history shall be saved”. {{maitzen}} argued in 2008, answering a model built on [[middle-knowledge|middle knowledge]], that such sorting is less plausible than the explanation from culture, which needs nothing beyond what we already know about how beliefs spread. Craig's story implies that a child born in Buddhist Bangkok is likelier than one born in Catholic Manila to be someone God foresaw would turn him down. And the sorting is needed only if the unreached are lost, which other defenders of God deny in ((mor-inclusivism|Objection V)).",
              ],
              quote: {
                text: "These dispositions thus resemble other fundamental human characteristics, such as the ability to hear; despite marked differences among individuals, we don't find entire countries whose citizens are nearly all deaf.",
                who: "Stephen Maitzen",
                cite: "'Divine Hiddenness and the Demographics of Theism', Religious Studies 42 (2006), p. 184",
              },
              thinkers: ["maitzen", "hick"],
              cedes:
                "I'd concede if independent evidence showed that people who would refuse God in every circumstance are concentrated where belief in God is rare.",
              see: [
                { id: "hid-pursues", why: "The same clustering problem, applied to hidden resistance." },
                { id: "coh-b-grounding", why: "Objection I raises a deeper problem, that nothing could make facts about what people would freely do true." },
                { id: "mor-inclusivism", why: "In Objection V some defenders of God hold that the unreached can be saved, which would leave Craig's sorting with nothing to do." },
              ],
              sources: [
                {
                  title: "Does Molinism Explain the Demographics of Theism?",
                  by: "Stephen Maitzen",
                  year: "2008",
                  url: "https://www.cambridge.org/core/journals/religious-studies/article/does-molinism-explain-the-demographics-of-theism/758E90D34D0F98E6E25E79D3186C84C9",
                  note: "Religious Studies 44: 473–477. Maitzen's answer to Marsh's model built on middle knowledge.",
                },
                {
                  title: "'No Other Name': A Middle Knowledge Perspective on the Exclusivity of Salvation through Christ",
                  by: "William Lane Craig",
                  year: "1989",
                  url: "https://www.reasonablefaith.org/writings/scholarly-writings/the-/no-other-name-a-middle-knowledge-perspective-on-the-exclusivity-of-salvatio/",
                  note: "Craig quotes John Hick's worry about birthplace ('Jesus and the World Religions', 1977, pp. 179–80) before giving his answer.",
                },
                {
                  title: "Divine Hiddenness and the Demographics of Theism",
                  by: "Stephen Maitzen",
                  year: "2006",
                  url: "https://doi.org/10.1017/S0034412506008274",
                  note: "Religious Studies 42. Page 184 explains why such dispositions shouldn't cluster by country.",
                },
              ],
            },
          ],
        },
        {
          id: "hid-spared",
          side: "theist",
          label: "God may spare would-be refusers by placing them out of reach",
          gist: "On {{marsh|Marsh}}'s model, a loving God who foresaw that some people would reject him if they believed now might keep belief from them, leaving them innocent for a later chance.",
          body: [
            "{{marsh|Jason Marsh}} proposed a gentler model, also built on [[middle-knowledge|middle knowledge]], in a 2008 reply to {{maitzen}}. He supposes that some people would freely reject God in this life if they came to believe. A loving God might spare them that refusal by placing them where belief won't reach them until after this life. That choice, Marsh writes, “largely cashes out in terms of the geographic circumstances in which they are placed”, and keeps them “innocent for a later time, when they will be in a position truly to love God”. On this view a refusal made too early, with too little understanding, is a harm, and a good parent shields a child from such harms. Unlike {{craig}}'s ((hid-middle-knowledge|model)), Marsh's damns no one. The unreached are protected, which fits the hope, discussed in ((mor-inclusivism|Objection V)), that Christ reaches those who never knew his name.",
          ],
          quote: {
            text: "If I had not come and spoken unto them, they had not had sin: but now they have no cloke for their sin.",
            who: "Jesus, in John's Gospel",
            cite: "John 15:22 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/John#15:22",
          },
          thinkers: ["marsh", "maitzen"],
          cedes:
            "{{marsh|Marsh}}'s model needs hearing of God to make some refusals more likely or more lasting, and if it never does, no one needs sparing.",
          see: [
            { id: "hid-seeking-is-finding", why: "Another reply on which a relationship with God can be completed after death." },
            { id: "hid-hidden-resistance", why: "Howard-Snyder argues that belief given too soon could make a person harder to win." },
          ],
          sources: [
            {
              title: "Do the Demographics of Theistic Belief Disconfirm Theism? A Reply to Maitzen",
              by: "Jason Marsh",
              year: "2008",
              url: "https://www.cambridge.org/core/journals/religious-studies/article/do-the-demographics-of-theistic-belief-disconfirm-theism-a-reply-to-maitzen/462CE1AF11C26F64F5BBE2D9848B7DA0",
              note: "Religious Studies 44: 465–471. The passages on geography and innocence are on p. 468.",
            },
            {
              title: "Hiddenness of God",
              by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
              year: "2016, rev. 2022",
              url: "https://plato.stanford.edu/entries/divine-hiddenness/",
              note: "Section 5 summarizes Marsh's model and raises objections to it.",
            },
            {
              title: "Does Molinism Explain the Demographics of Theism?",
              by: "Stephen Maitzen",
              year: "2008",
              url: "https://www.cambridge.org/core/journals/religious-studies/article/does-molinism-explain-the-demographics-of-theism/758E90D34D0F98E6E25E79D3186C84C9",
              note: "Maitzen's answer, printed in the same issue.",
            },
          ],
          children: [
            {
              id: "hid-missionary",
              side: "skeptic",
              label: "On Marsh's model, missionaries endanger those God spared",
              gist: "If God shields would-be refusers by keeping belief from them, as {{marsh|Marsh}} proposes, every missionary who reaches them removes the shield, exposing them to the refusal God meant to prevent.",
              body: [
                "On {{marsh}}'s model God places people who would refuse him where belief won't reach them, for their own protection, so a missionary who brings them belief removes that protection. Every new mission field would be a region of people God was guarding, and every sermon there would risk the refusal he arranged history to prevent. Jesus' command to teach all nations would then work against God's own arrangement.",
                "Marsh could reply that God foresaw the missionaries too, and puts in their path only people ready to hear. {{craig}} described missions that way in 1989: “it is our duty to proclaim the gospel to the whole world, trusting that God has so providentially ordered things that through us the good news will be brought to persons who God knew would respond if they heard it.” Then Marsh's model is Craig's sorting of souls by birthplace again, with all of {{maitzen}}'s ((hid-molinism-clustering|clustering problems)). And nothing independent tells us who is being spared.",
              ],
              quote: {
                text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost",
                who: "Jesus, in Matthew's Gospel",
                cite: "Matthew 28:19 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#28:19",
              },
              thinkers: ["marsh", "maitzen", "craig"],
              cedes:
                "{{marsh|Marsh}} could answer this by saying whom God is sparing without pointing to where the gospel hasn't reached.",
              see: [
                { id: "hid-responsibility", why: "Dumsday's good of being a messenger, which this model turns into a hazard." },
              ],
              sources: [
                {
                  title: "'No Other Name': A Middle Knowledge Perspective on the Exclusivity of Salvation through Christ",
                  by: "William Lane Craig",
                  year: "1989",
                  url: "https://www.reasonablefaith.org/writings/scholarly-writings/the-/no-other-name-a-middle-knowledge-perspective-on-the-exclusivity-of-salvatio/",
                  note: "The passage on missions comes near the end.",
                },
                {
                  title: "Should Peter Go to the Mission Field?",
                  by: "William Lane Craig",
                  year: "1993",
                  url: "https://www.reasonablefaith.org/writings/scholarly-writings/the-/should-peter-go-to-the-mission-field/",
                  note: "Faith and Philosophy 10. A letter answering William Hasker on what middle knowledge means for missionaries.",
                },
                {
                  title: "Do the Demographics of Theistic Belief Disconfirm Theism? A Reply to Maitzen",
                  by: "Jason Marsh",
                  year: "2008",
                  url: "https://www.cambridge.org/core/journals/religious-studies/article/do-the-demographics-of-theistic-belief-disconfirm-theism-a-reply-to-maitzen/462CE1AF11C26F64F5BBE2D9848B7DA0",
                  note: "Marsh's model of sparing people by placing them out of reach.",
                },
              ],
            },
          ],
        },
        {
          id: "hid-sensus",
          side: "theist",
          label: "Every mind is built to sense a maker, wherever it was born",
          gist: "{{calvin|Calvin}} held that everyone has a built-in sense of God, and children everywhere seem primed to see a maker, so the spread of creeds shows how cultures name that sense.",
          body: [
            "{{maitzen}}'s figures count creeds, and a sense of God may lie beneath them. {{calvin}} held it “beyond dispute” that the mind has, “by natural instinct, some sense of Deity”, the [[sensus-divinitatis|sensus divinitatis]] ('sense of the divine'). Echoing {{cicero|Cicero}}, he added that “there is no nation so barbarous, no race so brutish, as not to be imbued with the conviction that there is a God” (*Institutes* I.3.1). {{plantinga}} built this into a model on which belief in God is [[properly-basic|properly basic]], reasonable without argument, like trusting your memory. Plantinga writes, “Were it not for sin and its effects, God's presence and glory would be as obvious and uncontroversial to us all as the presence of other minds, physical objects, and the past.” The damage is inherited, so unbelief need not be the unbeliever's own fault.",
            "[[csr|Cognitive science of religion]], the study of how ordinary minds come to religious ideas, partly supports Calvin. {{barrett}} reports in *Born Believers* (2012) that young children in many cultures see purpose in nature and credit a super-knowing maker, and the psychologist Deborah Kelemen asked whether children are 'intuitive theists'. {{evans}} calls such pointers natural signs, widely available and easy to resist. Culture, on this view, changes what people call them.",
          ],
          quote: {
            text: "…God himself, to prevent any man from pretending ignorance, has endued all men with some idea of his Godhead, the memory of which he constantly renews and occasionally enlarges…",
            who: "John Calvin",
            cite: "Institutes of the Christian Religion I.3.1 (1559; tr. Henry Beveridge)",
            url: "https://ccel.org/ccel/calvin/institutes.iii.iv.html",
          },
          thinkers: ["calvin", "plantinga", "barrett", "evans"],
          cedes:
            "Whole populations lacking the natural sense of the divine, or with one that points nowhere near God, would refute this.",
          see: [
            { id: "evi-a-basic", why: "Objection IV treats belief in God as properly basic, like belief in other minds." },
            { id: "mor-honest-doubter", why: "In Objection V, Calvin's charge of suppression and Plantinga's no-fault version each feed one side of the honest doubter's dilemma." },
          ],
          sources: [
            {
              title: "Institutes of the Christian Religion, Book I, ch. 3",
              by: "John Calvin (tr. Henry Beveridge)",
              year: "1559",
              url: "https://ccel.org/ccel/calvin/institutes.iii.iv.html",
              note: "Calvin's chapter on the knowledge of God 'naturally implanted' in the mind.",
            },
            {
              title: "Warranted Christian Belief, ch. 7, 'Sin and Its Cognitive Consequences'",
              by: "Alvin Plantinga",
              year: "2000",
              url: "https://ccel.org/ccel/plantinga/warrant3/warrant3.vi.ii.iv.i.html",
              note: "Plantinga on how sin dims the sense of God, with a footnote saying the damage need not come from the person's own sin. Chapter 6 sets out the model.",
            },
            { title: "Born Believers: The Science of Children's Religious Belief", by: "Justin L. Barrett", year: "2012" },
            { title: "Natural Signs and Knowledge of God: A New Look at Theistic Arguments", by: "C. Stephen Evans", year: "2010" },
          ],
          children: [
            {
              id: "hid-csr-both-ways",
              side: "skeptic",
              label: "The built-in sense finds spirits, so it's no pointer to God",
              gist: "[[csr|Cognitive science]] finds a readiness to see agents and purposes everywhere, which produces ghosts and ancestors as easily as one God.",
              body: [
                "{{barrett}}'s findings don't give {{calvin|Calvin}} what he needs. They describe a hair-trigger for detecting agents, which Barrett calls the [[hadd|hypersensitive agency detection device]] (the reflex that turns a rustle in the grass into someone), and a bias toward seeing purpose everywhere. These produce spirits, ancestors and many gods as readily as a loving creator. {{hume}} noticed the habit in 1757: “We find human faces in the moon, armies in the clouds.” Widening 'theism' to cover any supernatural being, says {{maitzen}}, “merely changes the subject”. {{evans}} might say everyone gets God's natural signs and only the response varies, but the response varies by birthplace, and resistance shouldn't follow borders. Calvin himself said the sense was given so that all “may be condemned by their own conscience” (*Institutes* I.3.1), and a faculty that mostly produced other gods would be a strange tool for that.",
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
                { id: "evi-a-pumpkin", why: "In Objection IV, the Objector argues that if a natural faculty justifies Christian belief, it justifies every tradition's belief." },
                { id: "nat-b-minds", why: "Objection III asks whether evolved minds can be trusted on questions like this." },
                { id: "mor-daybreak", why: "In Objection V, Nietzsche argues that explaining how a belief arose strips it of its evidence." },
              ],
              sources: [
                {
                  title: "Divine Hiddenness and the Cognitive Science of Religion",
                  by: "Helen De Cruz",
                  year: "2015",
                  note: "In Green & Stump (eds.), Hidden Divinity and Religious Belief, 53–68. Concludes that the science shows a pull toward supernatural agents generally.",
                },
                {
                  title: "The Natural History of Religion",
                  by: "David Hume",
                  year: "1757",
                  url: "https://davidhume.org/texts/n/3",
                  note: "Section 3, on the human habit of seeing faces and purposes everywhere.",
                },
                {
                  title: "Divine Hiddenness and the Demographics of Theism",
                  by: "Stephen Maitzen",
                  year: "2006",
                  url: "https://doi.org/10.1017/S0034412506008274",
                  note: "Religious Studies 42. Page 179 explains why belief in spirits in general doesn't answer the argument.",
                },
              ],
              children: [
                {
                  id: "hid-designed-faculty",
                  side: "theist",
                  label: "A God-given sense can misfire and still lead people to God",
                  gist: "A natural faculty can be God's design even when it misfires, as sight survives its illusions, and a sense of the sacred that first finds spirits can grow toward God.",
                  body: [
                    "A sense that overshoots can still be God's design, as a smoke alarm that goes off for burnt toast still warns of real fires. {{barrett}} and the philosopher Kelly James Clark follow the eighteenth-century Scot {{reid|Thomas Reid}}, who held that we may trust our senses without proving them reliable: “This belief, Sir, is none of my manufacture; it came from the mint of nature”. Rejecting a belief because of the mechanism that produced it commits the [[genetic-fallacy|genetic fallacy]], judging a belief by its origin, unless the mechanism is shown to be unreliable. {{calvin}} said that “a seed of religion is divinely sown in all”, though “scarcely one in a hundred is found who cherishes it in his heart” (*Institutes* I.4.1).",
                    "On {{baker-hytch}}'s view the people who pass on knowledge of God are part of the design too. {{rea}} argues that a relationship with God need not run through a standard concept of God, so people whose sense of the sacred found spirits and ancestors were not cut off from the one they were groping toward.",
                  ],
                  quote: {
                    text: "Whom therefore ye ignorantly worship, him declare I unto you.",
                    who: "Paul, preaching in Athens",
                    cite: "Acts 17:23 (KJV)",
                    url: "https://en.wikisource.org/wiki/Bible_(King_James)/Acts#17:23",
                  },
                  thinkers: ["barrett", "reid", "calvin", "rea"],
                  cedes:
                    "This fails if the sense of the sacred is unreliable about whether there is a God at all, beyond being wrong about which spirits there are.",
                  see: [
                    { id: "mor-daybreak", why: "Nietzsche's argument from origins in Objection V, which this reply resists." },
                    { id: "evi-a-function", why: "Objection IV asks when a faculty working as designed makes belief rational without argument." },
                  ],
                  sources: [
                    {
                      title: "An Inquiry into the Human Mind, on the Principles of Common Sense",
                      by: "Thomas Reid",
                      year: "1764",
                      url: "https://archive.org/details/aninquiryintothe00reiduoft",
                      note: "Chapter 6, section 20, 'Of perception in general', where Reid says belief in the senses comes 'from the mint of nature' (a scan of the fifth edition).",
                    },
                    {
                      title: "Reidian Religious Epistemology and the Cognitive Science of Religion",
                      by: "Kelly James Clark and Justin L. Barrett",
                      year: "2011",
                      note: "Journal of the American Academy of Religion 79. Applies Reid's trust in our faculties to the findings of cognitive science.",
                    },
                    {
                      title: "Institutes of the Christian Religion, Book I, ch. 4",
                      by: "John Calvin (tr. Henry Beveridge)",
                      year: "1559",
                      url: "https://ccel.org/ccel/calvin/institutes.iii.v.html",
                      note: "Chapter 4, 'The Knowledge of God Stifled or Corrupted', which opens with the seed of religion sown in all.",
                    },
                    {
                      title: "Reformed Epistemology",
                      by: "Internet Encyclopedia of Philosophy (Anthony Bolos and Kyle Scott)",
                      url: "https://iep.utm.edu/ref-epis/",
                      note: "Explains Plantinga's model of the sense of the divine and the main objections, including religious diversity.",
                    },
                  ],
                },
              ],
            },
            {
              id: "hid-spinoza-allknow",
              side: "spinoza",
              label: "Spinoza says every mind knows God as the order of nature",
              gist: "{{spinoza|Spinoza}} agrees with {{calvin|Calvin}} that everyone knows God, but what they know is the eternal order of things, and what people reject is only an image of a judge.",
              body: [
                "{{spinoza|Spinoza}} agrees with {{calvin|Calvin}} that every mind knows God, since every idea of any particular thing that exists, he argues, “necessarily involves the eternal and infinite essence of God” (*Ethics* II P45). People miss this, he says, because “they have associated the name God with images of things that they are in the habit of seeing” (II P47 Schol.), so they don't recognize what they already know.",
                "But what everyone knows, on Spinoza's view, is the eternal order of things, with no maker in it watching for submission. Because the idea of God in us is adequate, meaning true and complete, it brings no pain, and so, Spinoza concludes, “No one can hate God” (V P18). What the supposed resister turns away from is an [[imaginatio|image]], a judge built out of human hopes and fears, of the kind Spinoza takes apart in the Appendix to *Ethics* I. On his view the birthplace pattern shows only where that image was taught.",
              ],
              quote: {
                text: "Hence we see, that the infinite essence and the eternity of God are known to all.",
                who: "Baruch Spinoza",
                cite: "Ethics II P47 Schol. (1677; tr. R. H. M. Elwes)",
                url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap02:~:text=Hence%20we%20see%2C%20that%20the%20infinite%20essence",
              },
              thinkers: ["spinoza"],
              cedes:
                "A single piece of knowledge that involved no knowledge of God would refute {{spinoza|Spinoza}}.",
              see: [
                { id: "evi-a-imagination", why: "In Objection IV, Spinoza counts a God known by feeling as imagination." },
                { id: "hid-spinoza-my-god", why: "Spinoza's other point here, that a God who can't hide can't love anyone either." },
                { id: "nat-b-parallel", why: "Objection III explains Spinoza's view that thought and things are one order, which is why every mind knows God." },
              ],
              sources: [
                {
                  title: "Ethics, Parts I, II and V",
                  by: "Baruch Spinoza (tr. R. H. M. Elwes)",
                  year: "1677",
                  url: "https://www.gutenberg.org/ebooks/3800",
                  note: "II P45–47 on every mind's knowledge of God, V P18 on why no one can hate him, and the Appendix to Part I on the image of God as judge.",
                },
                {
                  title: "Baruch Spinoza",
                  by: "Stanford Encyclopedia of Philosophy (Steven Nadler)",
                  year: "2001, rev. 2023",
                  url: "https://plato.stanford.edu/entries/spinoza/",
                  note: "An overview of Spinoza's God, or Nature, and of his account of knowledge.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  spinoza: {
    title: "Spinoza's God can't hide, and loves no one in particular",
    body: [
      "The hiddenness argument doesn't apply to {{spinoza|Spinoza}}'s [[deus-sive-natura|God, or Nature]]. On his view God is the most knowable thing there is, since every mind that knows anything has a true and complete idea of God's eternal essence (*Ethics* II P47). In the *Theological-Political Treatise* (1670) he denied that miracles could show God, and wrote that God's nature and existence “can all be much better perceived from the fixed and immutable order of nature” (ch. 6). Only a God who appeared in particular events could fail to appear, he thought, and the order of nature is present in every event. {{schellenberg}} himself aims the argument only at a personal God, and leaves room for an ultimate reality that is not a person.",
      "Spinoza agrees with {{calvin}} that no one lacks knowledge of God, and thinks the nonbeliever has only attached the name to the wrong images. On resistance he sides with Schellenberg against Calvin and {{moser}}. No one, he holds, is pushing away a judge or refusing a Lord, because “No one can hate God” (V P18), and God, being without passions, “does not love or hate anyone” (V P17 Cor.). ((hid-coercion-subtle|The freedom reply)) gets no help from him either, since “In the mind there is no absolute or free will” (II P48).",
      "On the last page of his *Ethics* Spinoza asks why almost everyone neglects salvation if it lies so close to hand, and answers that it is rare because it is hard (V P42 Schol.). The answer works for him because every mind already holds the idea of God and no one, on his view, is trying to be found. Christians reply that this leaves the seeker's longing with no one to answer it.",
    ],
    quote: {
      text: "How would it be possible, if salvation were ready to our hand, and could without great labour be found, that it should be by almost all men neglected? But all things excellent are as difficult as they are rare.",
      who: "Baruch Spinoza",
      cite: "Ethics V P42 Schol. (1677; tr. R. H. M. Elwes)",
      url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap05:~:text=How%20would%20it%20be%20possible%2C%20if%20salvation",
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
      title: "Divine Hiddenness and Human Reason",
      by: "J. L. Schellenberg",
      year: "1993",
      url: "https://www.cornellpress.cornell.edu/book/9780801473463/divine-hiddenness-and-human-reason/",
      note: "The book that started the current debate, arguing from reasonable nonbelief.",
    },
    {
      title: "Nonbelief as Support for Atheism",
      by: "Theodore M. Drange",
      year: "1998",
      url: "https://infidels.org/library/modern/theodore-drange-nonbelief/",
      note: "A short, free essay by an atheist philosopher who criticizes Schellenberg's version and offers his own argument from nonbelief.",
    },
    {
      title: "Divine Hiddenness and the Demographics of Theism",
      by: "Stephen Maitzen",
      year: "2006",
      url: "https://doi.org/10.1017/S0034412506008274",
      note: "Religious Studies 42. The article behind Part 2, arguing that the uneven spread of belief may be the hardest form of the problem.",
    },
    {
      title: "The Hiddenness of God",
      by: "Michael C. Rea",
      year: "2018",
      note: "Rea's Gifford Lectures, arguing that God's love needn't look like a parent's and that God is more present than we notice.",
    },
    {
      title: "The Elusive God: Reorienting Religious Epistemology",
      by: "Paul K. Moser",
      year: "2008",
      url: "https://www.cambridge.org/core/books/elusive-god/8C09572E1F084E8E8134632DE75A8980",
      note: "Moser argues that God gives evidence of himself on purpose, to people willing to be changed by it.",
    },
    {
      title: "'No Other Name': A Middle Knowledge Perspective on the Exclusivity of Salvation through Christ",
      by: "William Lane Craig",
      year: "1989",
      url: "https://www.reasonablefaith.org/writings/scholarly-writings/the-/no-other-name-a-middle-knowledge-perspective-on-the-exclusivity-of-salvatio/",
      note: "A Christian philosopher's answer to why the gospel hasn't reached everyone, free on the author's site.",
    },
    {
      title: "Pensées",
      by: "Blaise Pascal",
      year: "1670",
      url: "https://www.gutenberg.org/ebooks/18269",
      note: "In Trotter's translation, Pascal argues that a true religion must say God is hidden, and explain why.",
    },
    {
      title: "Divine Hiddenness: New Essays",
      by: "Daniel Howard-Snyder and Paul K. Moser (eds.)",
      year: "2002",
      note: "Essays from both sides of the problem by Peter van Inwagen, Michael Murray, Laura Garcia, Paul Moser and Schellenberg himself, among others.",
    },
    {
      title: "Hidden Divinity and Religious Belief: New Perspectives",
      by: "Adam Green and Eleonore Stump (eds.)",
      year: "2015",
      note: "Fifteen newer essays, including De Cruz on cognitive science, Rea on transcendence, and chapters on Jewish, Islamic and Eastern Christian views.",
    },
    {
      title: "Hiddenness of God",
      by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)",
      year: "2016, rev. 2022",
      url: "https://plato.stanford.edu/entries/divine-hiddenness/",
      note: "A careful survey of the debate, with the main replies on both sides.",
    },
    {
      title: "Divine Hiddenness Argument against God's Existence",
      by: "Internet Encyclopedia of Philosophy (Luke Teeninga)",
      url: "https://iep.utm.edu/divine-hiddenness-argument-against-gods-existence/",
      note: "A shorter survey that sorts the different hiddenness arguments, including Drange's, Maitzen's and Marsh's, and the kinds of reply to each.",
    },
  ],
};

export default hiddenness;
