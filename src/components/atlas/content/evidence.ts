import type { Objection } from "../types";

/* Objection IV — Evidence.
   Two prongs: (A) the ethics of belief (believing beyond the evidence) and
   (B) the Gospels as evidence. Children attack their parent. Quotes were
   checked against the cited public-domain translations (Elwes, Cunningham,
   Menzies, Tanner, KJV, Benedictine Summa), the Vatican's English text of
   Dei Verbum, or the original English. */

const evidence: Objection = {
  id: "evidence",
  numeral: "IV",
  short: "Evidence",
  title: "Faith asks more than the evidence gives",
  objection:
    "Belief is demanded beyond what the evidence supports, and the Gospels, the main evidence, contradict each other.",
  counter:
    "Plantinga argues that belief in God can be rational without proof, like belief in other minds. The contradictions sink strict inerrancy, which the creeds never required. And the resurrection case rests on facts most critical scholars grant: the crucifixion, followers who sincerely believed they saw him alive, and the conversions of Paul and James.",
  dek:
    "Two complaints travel together. Faith asks people to believe more than the evidence shows, and the evidence it leans on hardest, four Gospels, can't keep its story straight. Defenders answer from opposite directions, some saying belief in God needs no proof, others that the history is better than it looks. Follow either path, and watch the two defenses pull against each other.",
  question: "Can Christian belief be rational without proof, when its chief witnesses disagree?",

  prongs: [
    /* ───────────────────────── Prong A: the ethics of belief ───────────────────────── */
    {
      id: "evi-a",
      side: "skeptic",
      label: "Believing beyond the evidence is wrong, and faith does it",
      gist: "A belief should be no firmer than its evidence, and Christianity asks for firm, life-shaping trust on evidence that would not convince us of anything else this important.",
      body: [
        "{{clifford}} began with a parable. A shipowner silences his doubts about an old ship, collects the insurance when she sinks with all hands, and is guilty, not because she sank but because he had no right to believe she was sound on the evidence he had. Drop the thunder and the core stands, as {{hume}} put it: a wise man proportions his belief to the evidence. Today's [[evidentialism|evidentialism]] (Earl Conee and {{feldman}}, 2004) states it soberly: a belief is justified only as far as it fits your evidence.",
        "Christianity asks for more than proportion, on pain of judgment. Jesus blesses those “that have not seen, and yet have believed” (John 20:29); “he that believeth not is condemned already” (John 3:18); “without faith it is impossible to please him” (Hebrews 11:6). {{aquinas}} quotes Pope Gregory, “there is no merit in believing what is shown by reason”, to answer him, yet his own definition concedes the point: belief is the intellect assenting “at the command of the will” (Summa II-II q.2 a.9).",
      ],
      quote: {
        text: "To sum up: it is wrong always, everywhere, and for anyone, to believe anything upon insufficient evidence.",
        who: "W. K. Clifford",
        cite: "“The Ethics of Belief” (1877), pt. I",
      },
      thinkers: ["clifford", "hume", "feldman", "aquinas"],
      cedes:
        "I'd concede if the evidence for the Christian God, weighed by someone with no stake in the outcome, proved strong enough to carry the confidence the creeds ask for.",
      see: [
        { id: "hid-argument", why: "If God wanted to be believed, why leave the evidence this thin? Objection II asks." },
        { id: "mor-hell", why: "Condemned for not believing: whether that could be just is Objection V's question." },
      ],
      sources: [
        { title: "The Ethics of Belief", by: "W. K. Clifford", year: "1877", url: "https://en.wikisource.org/wiki/The_Ethics_of_Belief" },
        { title: "Evidentialism: Essays in Epistemology", by: "Earl Conee & Richard Feldman", year: "2004" },
      ],
      children: [
        {
          id: "evi-a-basic",
          side: "theist",
          label: "Belief in God can be rational without proof, like other minds",
          gist: "You can't prove other people have minds or that your memory works, yet believing both is rational, and belief in God can be rational the same way: without argument, from a faculty working as designed.",
          body: [
            "The evidentialist assumes that rational belief must rest on evidence. Look at what you actually believe: that other people have inner lives, that your memory of breakfast is roughly right. Neither is proved, and both are rational. Nor does the evidentialist's rule pass its own test. {{plantinga}} argued in 1983 that [[classical-foundationalism|classical foundationalism]], the picture of knowledge behind the objection, is neither self-evident nor proved from anything that is. Two centuries earlier, {{reid}} had asked why we should trust reason over perception, when both came out of the same shop.",
            "The mature claim, in *Warranted Christian Belief* (2000), is sharper. A belief is [[properly-basic|properly basic]] when it is formed directly, not inferred, by a faculty working properly in the right environment. {{calvin}} called the faculty the [[sensus-divinitatis|sensus divinitatis]]. Plantinga's [[aquinas-calvin-model|extended model]] adds a second source, the Holy Spirit's inner testimony, so that the gospel's own claims can be known in the same direct way. The claim is modest: not that God is proved, but that belief *can* be rational without proof.",
          ],
          thinkers: ["plantinga", "reid", "calvin"],
          cedes:
            "I'd concede if someone produced a principled test for basic belief that admits memory, perception and other minds but shuts out belief in God.",
          see: [
            { id: "evi-b-minimal", why: "Plantinga says faith needs no history; Habermas says the history makes the case. Two theist strategies, in tension." },
            { id: "hid-sensus", why: "Objection II: the same faculty, damaged by sin, explaining why honest people can miss God." },
          ],
          sources: [
            { title: "Reason and Belief in God", by: "Alvin Plantinga", year: "1983", note: "In Plantinga & Wolterstorff, eds., Faith and Rationality." },
            { title: "Warranted Christian Belief", by: "Alvin Plantinga", year: "2000", url: "https://www.ccel.org/ccel/plantinga/warrant3" },
            { title: "The Epistemology of Religion", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/religion-epistemology/" },
          ],
          children: [
            {
              id: "evi-a-pumpkin",
              side: "skeptic",
              label: "Then any creed can call itself basic, Great Pumpkin included",
              gist: "If Christians may believe in God without evidence, so may any sect about anything, and unlike belief in other minds, belief in God is neither shared by everyone nor confirmed every day.",
              body: [
                "If belief in God can be basic, why not belief in the Great Pumpkin, who rises every Halloween? {{plantinga}} raised the worry against himself, and {{martin-michael}} sharpened it: never mind pumpkins, what stops any community, voodoo priests included, from running the same model and declaring its own revelations basic by its own lights? From the inside, every sense of the divine feels like it is working properly.",
                "And the analogy Plantinga leans on breaks down. Belief in other minds is universal, involuntary and confirmed hourly: we predict what people will do, and they do it. Belief in God is absent in many careful people, fades in some who once held it, and predicts nothing comparable. [[csr|Cognitive science]] even offers a mechanism: minds tuned to detect agents everywhere, because a false alarm costs little and a missed predator costs everything (Stewart Guthrie, Pascal Boyer). That explains the sense of God without God.",
              ],
              thinkers: ["martin-michael", "plantinga"],
              cedes:
                "I'd concede if the sense of the divine converged across cultures the way perception and belief in other minds do.",
              see: [
                { id: "hid-csr-both-ways", why: "The same agent-detector argument, aimed at divine hiddenness." },
                { id: "evi-b-natural", why: "Sincere testimony that proves sincerity, not truth: a Pumpkin case in history." },
              ],
              children: [
                {
                  id: "evi-a-function",
                  side: "theist",
                  label: "Basic isn't a free pass, and it stands or falls with truth",
                  gist: "Permission to believe without argument isn't permission to believe anything: the faculty must work as designed and face no known refutation, so whether belief in God is warranted turns on whether God is there.",
                  body: [
                    "The Pumpkin objection runs two things together. Pumpkinites may be *internally* rational, doing their best by their own lights, and Plantinga grants it. [[warrant|Warrant]], what turns true belief into knowledge, is another matter: it needs faculties functioning properly, in the right environment, aimed at truth. The Pumpkin belief also meets a [[defeater|defeater]] anyone can check, an empty patch on November 1st. Nor must a reliable faculty be universal: perfect pitch is rare, and on the Christian story the sense of God is damaged by sin, not missing.",
                    "As for cognitive science, a natural mechanism is no rival to God. On classical theism it is how God works, through [[primary-secondary-causation|secondary causes]]. The debunker has to assume there is no God to conclude that the sense of God misleads. That is Plantinga's real result: no objection to the *rationality* of Christian belief stands apart from the question of its *truth* ([[de-jure-de-facto|de jure vs. de facto]]). The critic must argue that God does not exist.",
                  ],
                  thinkers: ["plantinga"],
                  cedes:
                    "I'd concede if the debunker could show the sense of God unreliable without first assuming that there is no God.",
                  see: [
                    { id: "coh-a-concur", why: "God working through natural causes, not alongside them: the counter of Objection I." },
                    { id: "nat-b-minds", why: "The mirror image: if our faculties are unguided, why trust any of them?" },
                    { id: "hid-designed-faculty", why: "Objection II: a natural faculty that overshoots can still be God's design." },
                  ],
                  children: [
                    {
                      id: "evi-a-defeaters",
                      side: "skeptic",
                      label: "Answering objections means weighing evidence after all",
                      gist: "Even belief without argument can be knocked down, and a believer who knows about Gospel contradictions, rival religions and evil needs answers to them, which means weighing evidence after all.",
                      body: [
                        "Take Plantinga's own conditions: a faculty working properly, and no unanswered [[defeater|defeaters]]. The second is the opening. He concedes that basic beliefs can be overturned, and gives the last part of *Warranted Christian Belief* to candidate defeaters: historical biblical criticism, postmodernism, religious pluralism, suffering and evil. A believer who has read the Gospels side by side, met devout Hindus and buried a child is not in the position of someone who never heard an objection.",
                        "Whether she can answer each one is a question about her evidence, not about whether God exists. So here, after all, is a challenge to rationality that doesn't first require proving there is no God. Plantinga's fallback, that a basic belief may carry enough warrant to outweigh its defeaters, would serve any confident believer, the Pumpkinite included. That leaves rebuttal, such as his charge that biblical criticism's [[methodological-naturalism|methodological naturalism]] assumes what it should prove. Rebuttal is evidential work, and it sends the burden back to ((evi-b|the Gospels)), ((hid-argument|hiddenness)) and evil.",
                      ],
                      thinkers: ["plantinga"],
                      cedes:
                        "I'd concede if a believer who knows these defeaters could stay rational without ever weighing an argument about them.",
                      see: [
                        { id: "evi-b-core", why: "Biblical criticism as a defeater: the subject of Plantinga's own chapter on it." },
                        { id: "nat-b-content", why: "Plantinga turns the defeater machinery on naturalism in Objection III." },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "evi-a-imagination",
              side: "spinoza",
              label: "A God known by feeling is imagination, not knowledge",
              gist: "God can be known with certainty, Spinoza says, but a God sensed the way we see a tree comes from imagination, the one kind of knowing that breeds error.",
              body: [
                "A sense of God that works like perception? Here the Spinozist parts company with Clifford and Plantinga alike. God is no distant object to be inferred from clues: “The human mind has an adequate knowledge of the eternal and infinite essence of God” (Ethics II P47). But knowledge comes in three kinds (II P40 Schol. 2): [[imaginatio|imagination]], built from images and hearsay; reason; and intuition. And knowledge of the first kind “is the only source of falsity” (II P41).",
                "A [[sensus-divinitatis|sensus divinitatis]] that delivers God the way sight delivers a tree belongs to the first kind. So did prophecy: in the *Treatise*, cheerful prophets were shown victories and peace, melancholy ones wars and massacres. That is why the felt God has moods, plans and favourites. Directness is not the fault, since intuition is direct too; the fault is images. Intellectual love of God comes “not in so far as we imagine him as present, but in so far as we understand him to be eternal” (V P32 Cor.).",
              ],
              quote: {
                text: "Therefore the power of prophecy implies not a peculiarly perfect mind, but a peculiarly vivid imagination",
                who: "Spinoza",
                cite: "Theological-Political Treatise ch. 1 (1670), trans. Elwes",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if a felt sense of God delivered the same God, with the same attributes, to every culture that has it.",
              see: [{ id: "coh-a-dogstar", why: "Why 'intellect' and 'will' said of God share only a name with ours: the dog-star and the barking dog." }],
              sources: [{ title: "Ethics", by: "Benedict de Spinoza", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "Elwes translation." }],
              children: [
                {
                  id: "evi-a-owngod",
                  side: "theist",
                  label: "Calling the felt God imagination assumes Spinoza's God",
                  gist: "Spinoza's own highest knowledge of God comes without argument, so his real complaint is that the felt God is the wrong God, and that assumes the point in dispute.",
                  body: [
                    "Spinoza's verdict assumes what it should prove. His own highest knowledge, [[scientia-intuitiva|scientia intuitiva]], runs from an adequate idea of God's attributes to the essence of things without inference (Ethics II P40 Schol. 2). So knowing God without argument is fine by him; his complaint is that the felt God is the wrong God, one with purposes and love. That is a verdict on which God is real, not on how belief is formed: ((evi-a-function|Plantinga's point)) again, a [[de-jure-de-facto|de facto]] objection in de jure dress.",
                    "Nor does a vision coloured by temperament prove the vision false. {{calvin}}'s doctrine of [[accommodation|accommodation]] says God speaks to us as nurses lisp to infants (Institutes I.13.1), and {{aquinas}} taught that prophecy may work through images, judged by a light given to the intellect (Summa II-II q.173 a.2). Even the *Treatise* bids each believer “adapt these dogmas to his own way of thinking” (ch. 14). If a pictured God can make the many just and loving, the picture may be a likeness, not a mistake.",
                  ],
                  quote: {
                    text: "each man's faith must be judged pious or impious only in respect of its producing obedience or obstinacy, and not in respect of its truth",
                    who: "Spinoza",
                    cite: "Theological-Political Treatise ch. 14 (1670), trans. Elwes",
                  },
                  thinkers: ["calvin", "aquinas", "spinoza"],
                  cedes:
                    "I'd concede if Spinoza could show the felt God to be error without first assuming that God has no purposes, no love and no will.",
                  see: [{ id: "coh-a-analogy", why: "How the classical tradition holds that images and words can speak truly of God." }],
                },
              ],
            },
          ],
        },
        {
          id: "evi-a-tradition",
          side: "theist",
          label: "Christian faith was never meant to be blind",
          gist: "The mainstream tradition condemned believing without reasons, and offers arguments for God, signs that the revelation is credible, and a case built from many clues, the kind we trust in court.",
          body: [
            "The objection paints Christianity as [[fideism|fideism]], which the mainstream tradition condemned. {{aquinas}} quotes Gregory only to answer him: reasons sought by someone who already loves the truth add to faith's merit (Summa II-II q.2 a.10). Nor does the will command blindly. No one would believe, Aquinas says, without first seeing from signs that the thing ought to be believed (q.1 a.4), and the [[preambles-of-faith|preambles of faith]], that God exists and is one, can be demonstrated. Even John's blessing on those who have not seen comes with its reason attached: “these are written, that ye might believe” (20:31). They believe on testimony, as we believe most of what we know.",
            "Protestant England built the evidential case. {{locke}} made reason the judge of what counts as revelation; {{butler}} told the deists that “probability is the very guide of life”; {{paley}} argued the evidences like a barrister. {{newman}}, by then a Catholic, explained why such a case can suffice: certitude comes from many converging probabilities, a [[cumulative-case|cumulative case]]. Today {{swinburne}} builds such a case for God.",
          ],
          quote: {
            text: "Nevertheless, in order that the submission of our faith should be in accordance with reason, it was God's will that there should be linked to the internal assistance of the holy Spirit external indications of his revelation, that is to say divine acts, and first and foremost miracles and prophecies…",
            who: "First Vatican Council",
            cite: "Dei Filius ch. 3 (1870), trans. Tanner",
          },
          thinkers: ["aquinas", "locke", "butler", "paley", "newman", "swinburne"],
          cedes:
            "I'd concede if the arguments of natural theology and the signs of revelation, taken together, gave Christianity no more support than its rivals get.",
          sources: [
            { title: "Dei Filius (Dogmatic Constitution on the Catholic Faith)", by: "First Vatican Council", year: "1870", url: "https://www.papalencyclicals.net/councils/ecum20.htm" },
            { title: "The Analogy of Religion", by: "Joseph Butler", year: "1736" },
          ],
          children: [
            {
              id: "evi-a-compelling",
              side: "skeptic",
              label: "No argument compels, and the 'signs' are disputed miracles",
              gist: "After centuries of effort, no argument for God wins over most careful thinkers, and the evidence for Christianity in particular, miracles and prophecy, is what's in dispute.",
              body: [
                "The tradition wants evidence; what it has is contested at every step. {{mackie}} worked through the arguments one by one in *The Miracle of Theism* (1982) and found that none tips the balance; {{oppy}} argues that no argument for God is one a reasonable non-believer must accept. And {{aquinas}} himself held that the Trinity and the Incarnation cannot be demonstrated at all. Reason reaches, at most, a first cause, and the Spinozist has one of those too.",
                "Everything distinctively Christian rides on revelation, and the Council rests revelation's credibility on “miracles and prophecies”. So the case comes down to testimony about miracles, which is ((nat-a|Objection III)), and to four Gospels that disagree, which is ((evi-b|this objection's other prong)). And a cumulative case must total both columns. Evil, hiddenness and the spread of rival faiths go into the ledger too, as Paul Draper and Oppy insist, and clues that lean on one another, a miracle story and the faith that told it, cannot be counted as independent.",
              ],
              thinkers: ["mackie", "oppy", "aquinas"],
              cedes:
                "I'd concede if a single argument for the distinctively Christian God, not a bare first cause, won over a fair share of informed non-believers.",
              see: [{ id: "nat-a-circle", why: "Whether miracle testimony can be weighed at all, or is ruled out in advance." }],
              sources: [
                { title: "The Miracle of Theism", by: "J. L. Mackie", year: "1982" },
                { title: "Arguing about Gods", by: "Graham Oppy", year: "2006" },
              ],
            },
          ],
        },
        {
          id: "evi-a-experience",
          side: "theist",
          label: "Religious experience is evidence too, and plenty of it",
          gist: "If seeming to see a tree is evidence that a tree is there, then seeming to be aware of God is evidence of God, unless something specific counts against it.",
          body: [
            "The objection counts only arguments as evidence. But evidence includes experience, and the most widespread religious evidence is people's apparent awareness of God, in prayer, in conversion, in moments they cannot explain away. {{swinburne}}'s [[principle-of-credulity|principle of credulity]] states what we assume everywhere else. If it seems to you that something is present, it probably is, unless there is special reason for doubt: you were drugged, you are unreliable in such matters, or the thing was very probably absent anyway. Withholding that standing only when the experience concerns God is special pleading.",
            "{{alston}} went further in *Perceiving God* (1991). Christian mystical practice is a socially established way of forming beliefs, with its own checks and its own lore about which experiences to trust, just as sense perception has, and neither can be shown reliable without relying on itself. If it is reasonable to go on trusting your eyes without a non-circular proof, it is reasonable for the mystic to go on trusting hers.",
          ],
          thinkers: ["swinburne", "alston"],
          cedes:
            "I'd concede if religious experience had no checks at all, or if something that makes such reports unreliable explained them across the board.",
          see: [
            { id: "hid-rea-presence", why: "Objection II: experiences of God may come unlabeled and unrecognized." },
          ],
          sources: [
            { title: "Perceiving God", by: "William P. Alston", year: "1991" },
            { title: "The Existence of God", by: "Richard Swinburne", year: "1979", note: "Ch. 13, on religious experience." },
          ],
          children: [
            {
              id: "evi-a-diversity",
              side: "skeptic",
              label: "Religious experiences contradict one another",
              gist: "The same kind of experience certifies Krishna, Allah, the Trinity and an impersonal Absolute, so it can't be a reliable guide to any one of them.",
              body: [
                "Credulity works for perception because perception converges: a Hindu and a Christian looking at the same tree agree it is a tree. Mystical perception doesn't converge. Its practitioners meet Krishna, Allah, the Trinity, the Buddha-nature, a Godhead without attributes, and each tradition's checks are internal to that tradition. {{hume}} saw the consequence for miracles: each religion's wonders are offered to prove a system that excludes the others, so they cancel out.",
                "{{alston}} himself conceded that religious diversity is the hardest problem his view faces. If you can predict a person's religious experience from her birthplace, the experience is tracking the birthplace. {{feldman}} draws the moral: when equally informed, equally careful peers disagree, neither has grounds to think herself the one seeing clearly, and both should suspend judgment.",
              ],
              quote: {
                text: "it never troubles him that mere accident has decided which of these numerous worlds is the object of his reliance, and that the same causes which make him a Churchman in London, would have made him a Buddhist or a Confucian in Pekin.",
                who: "J. S. Mill",
                cite: "On Liberty ch. 2 (1859)",
              },
              thinkers: ["hume", "alston", "feldman", "mill"],
              cedes:
                "I'd concede if the mystical traditions, checked against one another, converged on one God the way observers converge on one tree.",
              see: [
                { id: "evi-a-pumpkin", why: "The same worry about basic belief: every tradition can claim it." },
                { id: "hid-demographics", why: "Belief follows borders: the same fact, read as an argument about hiddenness." },
              ],
              sources: [
                { title: "On Liberty", by: "John Stuart Mill", year: "1859", url: "https://www.gutenberg.org/ebooks/34901" },
                { title: "Reasonable Religious Disagreements", by: "Richard Feldman", year: "2007", note: "In Antony, ed., Philosophers Without Gods." },
              ],
              children: [
                {
                  id: "evi-a-parity",
                  side: "theist",
                  label: "Disagreement cuts every worldview, naturalism included",
                  gist: "Accidents of birth shape every outlook, the skeptic's included, and peers disagree as deeply about naturalism as about God, so a rule against believing amid disagreement would forbid nearly every view.",
                  body: [
                    "The diversity argument proves too much; apply it evenly. Take birthplace first. Had {{plantinga}} been born in Madagascar, he notes, he might not be a Christian; but had the pluralist been born there, she might not be a pluralist. If upbringing discredits a belief about religion, it discredits hers too. And {{alston}}, facing rival mystical practices in *Perceiving God* (ch. 7), concluded that with no neutral way to show a rival more reliable, it is rational to go on in the practice that has proved itself in your own life.",
                    "Peer disagreement fares no better. {{van-inwagen}} rejects views that David Lewis, his equal in ability and information, held on the same evidence, and no one calls either man irrational. Every serious philosophy, naturalism included, faces careful peers who think it false. Applied to itself, [[conciliationism|conciliationism]] even recommends suspending judgment about conciliationism, a problem one of its leading defenders, Adam Elga, states frankly.",
                  ],
                  thinkers: ["plantinga", "alston", "van-inwagen"],
                  cedes:
                    "I'd concede if the only rational response to disagreement among peers were to suspend judgment across the board, my naturalist neighbour's views included.",
                  see: [
                    { id: "hid-demographics", why: "Objection II turns the birthplace point into an argument against God himself." },
                  ],
                  sources: [
                    {
                      title: "It Is Wrong, Everywhere, Always, and for Anyone, to Believe Anything upon Insufficient Evidence",
                      by: "Peter van Inwagen",
                      year: "1996",
                      note: "In Jordan & Howard-Snyder, eds., Faith, Freedom, and Rationality.",
                    },
                    { title: "Pluralism: A Defense of Religious Exclusivism", by: "Alvin Plantinga", year: "1995" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "evi-a-james",
          side: "theist",
          label: "Some questions can't wait for the evidence to come in",
          gist: "When a choice can't be dodged, matters enormously and can't be settled by evidence, holding back is itself a bet, and some truths show themselves only to those who meet them halfway.",
          body: [
            "{{james-william}} answered Clifford directly, in an 1896 address to the philosophical clubs of Yale and Brown. Clifford treats avoiding error as the only duty, but there are two: believe truth, and shun error. For a [[genuine-option|genuine option]], one that is live (both answers tempt you), forced (there is no third way) and momentous (the chance won't come again), suspending judgment is not neutral. If the truth is there, agnosticism forfeits it as surely as disbelief. {{pascal}}'s wager was the cruder ancestor of the point.",
            "Some facts, moreover, wait on us to go first. Will he like me? The man who waits for proof before acting warmly may never get it; the one who trusts first often creates the evidence. If the universe is personal, as the religious hypothesis says, it may answer our advances, and a rule demanding proof first would lock us out. A rule that would keep me from recognizing a truth even if it were really there, James concluded, is an irrational rule.",
          ],
          quote: {
            text: "Our passional nature not only lawfully may, but must, decide an option between propositions, whenever it is a genuine option that cannot by its nature be decided on intellectual grounds",
            who: "William James",
            cite: "“The Will to Believe” (1896), §IV",
          },
          thinkers: ["james-william", "pascal"],
          cedes:
            "I'd concede if evidence could settle the religious question after all, or if agnosticism cost nothing should God be real.",
          see: [{ id: "hid-moser", why: "Moser's version of the same point: evidence offered to the willing, not to spectators." }],
          sources: [{ title: "The Will to Believe", by: "William James", year: "1896", url: "https://www.gutenberg.org/ebooks/26659" }],
          children: [
            {
              id: "evi-a-wishful",
              side: "skeptic",
              label: "The option isn't forced, and wanting doesn't make believing",
              gist: "Agnosticism forfeits nothing unless God shuts out honest doubters, which beliefs feel like real possibilities depends on where you grew up, and no one can decide to believe because the stakes are high.",
              body: [
                "James's case needs the option to be forced, and it isn't. Agnosticism loses the prize only if the prize goes to those who believed before the evidence came, and a loving God would not shut out an honest seeker, as {{schellenberg}} argues ((hid-argument|in Objection II)). The all-or-nothing stakes are set by the creed under test. Nor is liveness neutral: what feels live is mostly what you were raised on, so a method that lets liveness decide licenses every creed at once. {{diderot}} made the point against {{pascal}}: an imam could run the same wager.",
                "The deeper trouble is psychological. {{williams-bernard}} argued that you cannot believe at will while understanding belief as aimed at truth ([[doxastic-voluntarism|doxastic voluntarism]]); a belief you knew you had adopted because it was comforting would not be a belief. And the friendship example misleads. A friend is already there to meet you halfway. Whether God is there is the question.",
              ],
              thinkers: ["schellenberg", "diderot", "pascal", "williams-bernard"],
              cedes:
                "I'd concede if faith could be taken up honestly, without self-deception, and if rival creeds weren't equally available by the same method.",
              see: [
                { id: "mor-inclusivism", why: "Objection V: whether an honest agnostic forfeits anything at all." },
                { id: "hid-willing-found-nothing", why: "Objection II's version: no seeker can yield to a Lord she doesn't yet believe in." },
              ],
              children: [
                {
                  id: "evi-a-trust",
                  side: "theist",
                  label: "Faith can begin as trust acted on, not a belief willed",
                  gist: "No one is asked to switch a belief on: faith can begin as trust acted on under uncertainty, which is how most serious commitments begin.",
                  body: [
                    "Williams is right that belief can't be switched on; the tradition never asked that. {{pascal}}'s advice to the doubter was practical: do what believers do, take the holy water, have masses said, and let the practice reshape you. {{alston}} distinguished belief from *acceptance*, acting and thinking on a claim without feeling sure of it. Even Hebrews, which says the seeker “must believe that he is”, illustrates faith with Abraham, who “went out, not knowing whither he went” (11:6, 8), and Paul's “believe in thine heart” (Romans 10:9) uses the verb of [[pistis|pistis]], trust that acts.",
                    "That is how serious commitments usually start. You marry without proof the marriage will last; you join a cause before seeing it win. Agnosticism, too, is a practice that shapes you. As for upbringing, it explains where anyone starts, the skeptic included, not whether they are right; a commitment tested for years against doubt and rival options is no longer an accident of birth. Acting on one in good faith, still listening, is not self-deception.",
                  ],
                  thinkers: ["pascal", "alston"],
                  cedes:
                    "I'd concede if acting on trust under uncertainty were always self-deception, or if the creeds plainly demanded full belief as the price of entry.",
                  see: [
                    { id: "hid-faith-without-belief", why: "The same distinction answers hiddenness: faith needn't be full belief." },
                    { id: "mor-allegiance", why: "Faith as allegiance rather than correct opinion." },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── Prong B: the Gospels as evidence ───────────────────────── */
    {
      id: "evi-b",
      side: "skeptic",
      label: "Gospels that contradict each other can't carry the case",
      gist: "The four accounts disagree on checkable details, from who found the tomb to how Judas died to the day Jesus died, and the disagreements cluster around the events the faith rests on.",
      body: [
        "Read the Easter stories side by side. Who went to the tomb? Mark names three women, Matthew two, Luke a larger group, John Mary Magdalene alone. Did Judas hang himself while the priests bought a field (Matthew 27), or buy the field himself and fall headlong (Acts 1)? Was Joseph's father Jacob (Matthew) or Heli (Luke)? Was the Last Supper a Passover meal (Mark), or did Jesus die as the Passover lambs were slaughtered (John)? Luke ties the birth to Quirinius's census, which Josephus dates to 6 CE, about a decade after the death of Herod, under whom Matthew sets it.",
        "None of this is news. {{reimarus}}, published after his death by {{lessing}}, called the Easter accounts irreconcilable; {{strauss}} read the Gospels as myth; {{ehrman}} put the catalogue before a mass readership. This isn't trivia: these are the documents asked to establish that a man rose from the dead.",
      ],
      thinkers: ["reimarus", "lessing", "strauss", "ehrman"],
      cedes:
        "I'd concede if the core claims could be established from sources that don't depend on the Gospels agreeing in detail.",
      sources: [{ title: "Jesus, Interrupted", by: "Bart D. Ehrman", year: "2009" }],
      children: [
        {
          id: "evi-b-minimal",
          side: "theist",
          label: "The resurrection case rests on facts most critics grant",
          gist: "Set the discrepancies aside: most critical scholars grant the crucifixion, the followers' sincere belief that they saw Jesus alive, and the conversions of Paul and James, and a rising explains all four better than any rival.",
          body: [
            "The case doesn't need the Gospels to agree. {{habermas|Gary Habermas}} and {{licona|Mike Licona}} argue only from [[minimal-facts|facts most specialists grant]]. Jesus was crucified under Pilate, as Tacitus confirms. His followers sincerely believed he appeared to them: Paul hands on a creed he says he “received”, usually dated within a few years of the cross. Paul went from persecutor to apostle. And James, whose family thought Jesus out of his mind (Mark 3:21), saw him and led the Jerusalem church.",
            "Then ask [[inference-to-best-explanation|which explanation covers all four best]]. Licona (2010) scores the rivals on criteria adapted from C. Behan McCullagh. Theft or a wrong tomb yields no appearances; a swoon yields a battered survivor, not a conqueror of death; grief visions fit Peter but not Paul the persecutor or James the skeptic. Even {{ludemann}}, who left the faith, judged it historically certain that Peter and the disciples had experiences in which Jesus appeared to them as the risen Christ. He called them visions; what matters is that he granted them.",
          ],
          quote: {
            text: "For I delivered unto you first of all that which I also received, how that Christ died for our sins according to the scriptures; And that he was buried, and that he rose again the third day according to the scriptures: And that he was seen of Cephas, then of the twelve",
            who: "Paul",
            cite: "1 Corinthians 15:3–5 (KJV)",
          },
          thinkers: ["habermas", "licona", "ludemann"],
          cedes:
            "I'd concede if most critical scholars came to doubt the appearance experiences themselves, or if one natural explanation covered all four facts without strain.",
          see: [
            { id: "nat-a-earman", why: "Objection III: why independent witnesses can outweigh even a tiny prior." },
          ],
          sources: [
            { title: "The Case for the Resurrection of Jesus", by: "Gary R. Habermas & Michael R. Licona", year: "2004" },
            { title: "The Resurrection of Jesus: A New Historiographical Approach", by: "Michael R. Licona", year: "2010" },
          ],
          children: [
            {
              id: "evi-b-natural",
              side: "skeptic",
              label: "Grief visions, dissonance and legend explain those facts",
              gist: "Bereaved people often see their dead, groups can share such experiences, failed prophecies can intensify conviction, and legend does the rest, so the facts need no miracle.",
              body: [
                "Every minimal fact can stand without a miracle. Bereavement visions are common, vivid, sometimes tactile, occasionally shared. {{allison}}, himself a Christian, has gathered a large literature of them that looks strikingly like the Easter appearances, though he does not think the parallels settle the question. {{festinger}}'s *When Prophecy Fails* (1956) followed a flying-saucer group whose promised flood never came; instead of giving up, they evangelized harder. Festinger called the strain *cognitive dissonance*, and a crucified Messiah would produce it in bulk. {{ludemann}} explains Peter's vision through grief and guilt, and Paul's through inner conflict.",
                "The James evidence is thin: 1 Corinthians 15:7 says only that Jesus appeared to him, and the skeptic-turned-believer story is stitched together from Mark and John. Sincere conviction, even unto death, proves sincerity, not truth. The Book of Mormon's witnesses to the golden plates (1829) went on affirming their testimony for decades, some of them after breaking with Joseph Smith.",
              ],
              thinkers: ["allison", "festinger", "ludemann"],
              cedes:
                "I'd concede if the reports included features that no bereavement or group experience on record has ever produced.",
              see: [
                { id: "evi-a-diversity", why: "Rival revelations with sincere witnesses: the same problem, posed by experience." },
                { id: "nat-a-practice", why: "Hume's case in Objection III: miracle reports grow in the retelling and fail when checked." },
              ],
              sources: [{ title: "The Resurrection of Jesus: Apologetics, Polemics, History", by: "Dale C. Allison Jr.", year: "2021" }],
              children: [
                {
                  id: "evi-b-wright",
                  side: "theist",
                  label: "Only a real event explains the new shape of Jewish hope",
                  gist: "Ancient people knew visions of the dead well and never called them resurrection, so only an empty tomb plus sightings explains why Jews suddenly said one man had already been raised bodily.",
                  body: [
                    "The grief-vision story misses what the first Christians actually said. Visions of the dead were a known category, and the vocabulary was ready: a ghost, an angel, a soul exalted. *Resurrection* meant new bodily life for all the righteous at the end of the age. {{wright-nt}} shows the first Christians changed that hope at once: one man raised, ahead of everyone, in a transformed body. Appearances without an empty tomb would mean “we saw his ghost”; an empty tomb without appearances, “the body was stolen”. Together they yield “risen”.",
                    "Dissonance doesn't explain it either. Followers of other would-be messiahs killed in their cause, Judas the Galilean, Simon bar Giora, bar Kokhba, gave up or found a new leader; none said their man had risen. Grief visions are private, yet Paul names “above five hundred brethren at once” (1 Corinthians 15:6). And Paul was no tormented rabbi: he called himself “blameless” under the Law (Philippians 3:6), and {{stendahl}} argued in 1963 that the guilt-ridden Paul is a Western projection.",
                  ],
                  thinkers: ["wright-nt", "stendahl"],
                  cedes:
                    "I'd concede if a clear pre-Christian Jewish case turned up of one person said to be bodily raised before the end, with no empty tomb involved.",
                  sources: [
                    { title: "The Resurrection of the Son of God", by: "N. T. Wright", year: "2003" },
                    { title: "The Apostle Paul and the Introspective Conscience of the West", by: "Krister Stendahl", year: "1963", note: "Harvard Theological Review 56." },
                  ],
                  children: [
                    {
                      id: "evi-b-parallels",
                      side: "skeptic",
                      label: "Others were said to be raised, and the empty tomb is shaky",
                      gist: "Herod's court thought John the Baptist had risen, ancient stories had heroes bodily taken up, and the empty tomb, the half of Wright's case that does the work, rests on doubtful evidence.",
                      body: [
                        "Wright's claim that nothing else explains the new hope is too quick. In Mark 6:14–16, Herod and others say that Jesus is John the Baptist, risen from the dead: an individual raised before the end, in the Gospels themselves. Jewish tradition had Enoch and Elijah taken up bodily; Greek and Roman stories had heroes like Romulus vanish and be honoured as gods, and Richard C. Miller argues that early readers would have heard the Gospel endings as just such translation fables.",
                        "And the empty tomb, the half of Wright's case that turns visions into resurrection, is the weakest link. Paul never mentions it. Rome usually left the crucified to the birds or a common pit; {{crossan}} doubts that Jesus was ever laid in a known tomb, and {{ehrman}} argues that a decent burial by Joseph of Arimathea would have been a rare exception. Without a tomb, followers primed by visions and by such stories needed nothing more to reach for the word.",
                      ],
                      thinkers: ["crossan", "ehrman"],
                      cedes:
                        "I'd concede if the burial and the empty tomb proved as early and as widely attested as the appearances.",
                      sources: [
                        { title: "Resurrection and Reception in Early Christianity", by: "Richard C. Miller", year: "2015" },
                        { title: "How Jesus Became God", by: "Bart D. Ehrman", year: "2014" },
                        { title: "Jesus: A Revolutionary Biography", by: "John Dominic Crossan", year: "1994" },
                      ],
                      children: [
                        {
                          id: "evi-b-tomb",
                          side: "theist",
                          label: "No parallel is a resurrection, and the burial is early",
                          gist: "Herod's guess was about a prophet's spirit returning, Enoch and Elijah never died, and the burial stands in the earliest creed and fits Jewish law, so the tomb was most likely empty.",
                          body: [
                            "The parallels prove less than they seem. {{wright-nt}} reads Herod's guess as talk of John's spirit at work in another man, not of John's body leaving its grave; no one went to check. Enoch and Elijah never died, so they were never raised. And a translation fable ends with a hero gone to the sky, not with a crucified man seen by hundreds and handled by his friends.",
                            "Nor is the burial late. “He was buried” stands in the creed Paul received (1 Corinthians 15:4). Jewish law required burial before nightfall (Deuteronomy 21:23), Josephus says Jews buried even the crucified before sunset, and the archaeologist Jodi Magness finds the Gospel burial consistent with the evidence; the nailed heel bone of Yehohanan, found in a family ossuary, shows a crucified man could be buried. Women, whom the pagan {{celsus}} mocked as hysterical, are the tomb's first witnesses, a detail no inventor would choose ([[criterion-of-embarrassment|criterion of embarrassment]]). {{allison}}, who weighs every doubt, judges the tomb probably empty.",
                          ],
                          thinkers: ["wright-nt", "celsus", "allison"],
                          cedes:
                            "I'd concede if the burial clause proved a late addition to the creed, or if Jesus's body were shown to have stayed in a known grave.",
                          see: [{ id: "evi-b-body", why: "Why the burial matters: the earliest creed, read for its body." }],
                          sources: [
                            { title: "Ossuaries and the Burials of Jesus and James", by: "Jodi Magness", year: "2005", note: "Journal of Biblical Literature 124." },
                          ],
                        },
                      ],
                    },
                    {
                      id: "evi-b-prior",
                      side: "skeptic",
                      label: "Miracle reports usually fail, so a natural story is likelier",
                      gist: "Every religion counts most of history's miracle reports as false, so for a historian a natural explanation, however strained, is always the better bet.",
                      body: [
                        "Even if Wright's rivals all failed, the inference would not go through. Start with the track record. Every religion counts most of history's miracle reports, the other religions', as false. {{hume}} named the reasons: the love of the marvellous, the zeal of believers, and the way wonders crowd into ignorant ages and thin out wherever people check. Against that record stands the most uniform experience we have: the dead stay dead.",
                        "So the ranking is settled before the sources are opened. A historian weighs explanations by probability, {{ehrman}} argues, and a miracle is by definition the least probable account of anything. Stolen bodies, mistaken tombs and grief visions are all unlikely, but they are the kind of unlikely that happens. Whether that [[prior-probability|prior]] can be raised at all is the business of ((nat-a|Objection III)).",
                      ],
                      thinkers: ["hume", "ehrman"],
                      cedes:
                        "I'd concede if the prior probability of a resurrection were not low, which is to say, if there were already good reason to think a God exists who would raise Jesus.",
                      see: [
                        { id: "nat-a-odds", why: "Hume's argument as a weighing of odds, argued in full." },
                        { id: "nat-a-practice", why: "Why miracle reports, in practice, tend to fail." },
                      ],
                      children: [
                        {
                          id: "evi-b-cumulative",
                          side: "theist",
                          label: "The odds of a resurrection depend on whether there's a God",
                          gist: "A resurrection is wildly improbable as a random event, but not as the act of a God who exists and has reason to vindicate Jesus, so the evidence has to be weighed whole.",
                          body: [
                            "The appeal to the track record treats the [[prior-probability|prior]] as a number written on nature. It isn't. The odds that a corpse revives by chance are negligible; the odds that a God who exists raises the one man whose life and claims called for vindication are another matter. {{swinburne}}'s *The Resurrection of God Incarnate* (2003) folds natural theology (arguments for God from reason and nature), the expectation of an incarnation and the historical evidence into a single calculation of odds, and puts the resurrection at about 97 percent. Timothy and Lydia McGrew argue that the testimony of the women, the disciples and Paul together could overcome even a very low prior.",
                            "Even {{earman}}, no apologist, argued that Hume's case, read as probability, fails: independent witnesses can add up until they overwhelm a tiny prior. So “the dead stay dead” does not end the inquiry. The prior depends on whether there is a God, which is why this objection is tangled up with all the others.",
                          ],
                          thinkers: ["swinburne", "earman"],
                          cedes:
                            "I'd concede if the probability that God exists, judged on the rest of the evidence, were itself negligible.",
                          see: [
                            { id: "nat-a-earman", why: "Earman's case against Hume, argued in Objection III." },
                            { id: "coh-a-collapse", why: "A God with reasons to vindicate Jesus must choose freely; the Spinozist says God acts from necessity." },
                          ],
                          sources: [{ title: "The Resurrection of God Incarnate", by: "Richard Swinburne", year: "2003" }],
                          children: [
                            {
                              id: "evi-b-soft",
                              side: "skeptic",
                              label: "The odds are soft guesses, and the history can't stand alone",
                              gist: "Every number in the resurrection sums is a judgment call, and the history persuades only someone who already finds God likely, so it can add to a case for God but cannot found one.",
                              body: [
                                "Swinburne's arithmetic is impressive and its inputs are soft. How likely is it, given God, that God becomes incarnate? That he raises the incarnate one? That the women's story would be invented? Each number is a judgment call, and small changes swing the result by orders of magnitude. The McGrews rate the combined testimony at a factor of about 10⁴⁴; Swinburne's 97 percent rests on guesses like these. Such figures measure the modeller's confidence.",
                                "And the history cannot carry the load alone. Swinburne argues for his prior from natural theology, arguments for God from reason and nature, rather than assuming it, but then the work is done there, in ((nat-b|Objection III)), and that case must also survive evil and ((hid-argument|hiddenness)). For an agnostic not already moved by it, the resurrection becomes credible only once a God likely to raise Jesus is in place. {{lessing}} saw a wider gap in 1777: the accidental truths of history cannot prove the necessary truths of reason, [[lessings-ditch|the ugly broad ditch]] he could never cross.",
                              ],
                              thinkers: ["swinburne", "lessing"],
                              cedes:
                                "I'd concede if the resurrection stayed highly probable on priors a fair-minded agnostic would accept before weighing the history.",
                              see: [
                                { id: "evi-a-james", why: "Another answer to Lessing's ditch: some questions can't wait for proof." },
                                { id: "nat-b-odds", why: "The same soft-numbers worry, aimed at fine-tuning in Objection III." },
                              ],
                              sources: [
                                {
                                  title: "The Argument from Miracles: A Cumulative Case for the Resurrection of Jesus of Nazareth",
                                  by: "Timothy McGrew & Lydia McGrew",
                                  year: "2009",
                                  note: "In Craig & Moreland, eds., The Blackwell Companion to Natural Theology.",
                                },
                              ],
                            },
                          ],
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
          id: "evi-b-inerrancy",
          side: "theist",
          label: "Errors sink a flawless Bible, which no creed ever required",
          gist: "The discrepancies do refute the idea that every detail is error-free, but none of the ancient creeds asks for that, since they ask for trust in Christ, not in a flawless chronology.",
          body: [
            "Concede the discrepancies: they refute a doctrine the creeds never defined. The Nicene Creed, in its final form of 381, confesses that Christ rose according to the Scriptures and that the Spirit spoke through the prophets. It says nothing about every detail being free of error. The detailed doctrine of [[inerrancy|inerrancy]], as American evangelicals codified it in the Chicago Statement of 1978, belongs to no creed the whole church shares, and Vatican II located Scripture's freedom from error in “that truth which God wanted put into sacred writings for the sake of salvation” (Dei Verbum §11).",
            "Nor were the discrepancies a modern discovery. {{origen}} granted in the 230s that the Gospels conflict if read as bare chronicle, and judged that the evangelists sometimes preferred spiritual truth to material accuracy. Protestant voices from {{barth}} to {{lewis-cs}} have treated Scripture as true witness in fallible human words. Four witnesses to a car crash who agree on every detail have usually compared notes.",
          ],
          quote: {
            text: "The spiritual truth was often preserved, as one might say, in the material falsehood.",
            who: "Origen",
            cite: "Commentary on John X.4, trans. Menzies (ANF 9)",
          },
          thinkers: ["origen", "barth", "lewis-cs"],
          cedes:
            "I'd concede if the faith's central claims, the death, burial and rising, turned out to depend on the details that conflict.",
          see: [
            { id: "mor-development", why: "Objection V makes the same appeal from the letter to the core, to revise hell." },
          ],
          sources: [
            { title: "Commentary on John, Book X", by: "Origen", year: "c. 231–40", url: "https://www.newadvent.org/fathers/101510.htm" },
            { title: "Dei Verbum (Dogmatic Constitution on Divine Revelation)", by: "Second Vatican Council", year: "1965", url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html" },
          ],
          children: [
            {
              id: "evi-b-core",
              side: "skeptic",
              label: "Once errors are conceded, why trust the miraculous core?",
              gist: "If the Gospels err on checkable details and even reshape history for theology, there's no principled reason to exempt the miracles at their centre, and the church itself long held the authors free of error.",
              body: [
                "The concession is larger than it sounds. The church did hold the evangelists free of error: {{augustine}} told Jerome so in plain words, and {{leo-xiii|Leo XIII}}'s *Providentissimus Deus* (1893) called it absolutely wrong to admit that a sacred writer had erred. And some errors are not slips but theology. John has Jesus die as the Passover lambs are slaughtered, in the Gospel whose first chapter hails him as “the Lamb of God” (1:29). {{ehrman}} argues John moved the day, and {{licona}}, who defends the Gospels by appeal to their genre, has allowed that John probably did.",
                "Nor are the sources four independent witnesses. Matthew and Luke copied Mark ([[markan-priority|Markan priority]]): where they differ they are editing, and the growth is visible. The earliest manuscripts of Mark end at 16:8, with an empty tomb and no appearance; Matthew and Luke add appearances; John has Thomas touch the wounds. A tradition loose enough to move a crucifixion for symbolism cannot certify that its most theologically loaded events were left untouched.",
              ],
              quote: {
                text: "I have learned to yield this respect and honour only to the canonical books of Scripture: of these alone do I most firmly believe that the authors were completely free from error.",
                who: "Augustine",
                cite: "Letter 82.3, to Jerome (c. 405), trans. Cunningham",
              },
              thinkers: ["augustine", "leo-xiii", "ehrman", "licona"],
              cedes:
                "I'd concede if the miracle accounts proved to be among the best-attested and least-developed parts of the tradition rather than the most developed.",
              see: [
                { id: "mor-flew", why: "Objection V's version: each softening of hell is a death by a thousand qualifications." },
              ],
              sources: [
                { title: "Letter 82", by: "Augustine", year: "c. 405", url: "https://www.newadvent.org/fathers/1102082.htm" },
                { title: "Providentissimus Deus", by: "Leo XIII", year: "1893", url: "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_18111893_providentissimus-deus.html", note: "§20." },
              ],
              children: [
                {
                  id: "evi-b-bios",
                  side: "theist",
                  label: "Ancient biographers moved dates and scenes, not events",
                  gist: "The Gospels are ancient biographies, a genre that rearranged freely while keeping the main events, and their Easter core is promised in Mark and listed by Paul decades earlier.",
                  body: [
                    "The errors charge holds ancient biography to a court-transcript standard. {{burridge|Richard Burridge}} showed in 1992 that the Gospels belong to the Greco-Roman [[bios|bios]]. {{licona}} compared Plutarch, who tells the same events differently in different *Lives*, moving scenes, merging events and squeezing weeks into days, much as the evangelists do. Setting a death at a symbolic hour, if John did, is that kind of licence; no historian concludes that Plutarch invented Caesar's assassination. Even {{augustine}}, in *The Harmony of the Gospels*, allowed the evangelists to differ in order and wording without falsehood.",
                    "Nor does the growth survive a closer look. Mark's Jesus promises to meet his disciples in Galilee, and at the empty tomb the angel repeats it: “there shall ye see him” (Mark 14:28, 16:7). Paul had listed the appearances a decade or two before Mark wrote, from a creed older still (1 Corinthians 15:5–8). The core is told independently by Paul, Mark and John ([[multiple-attestation|multiple attestation]]), and it is early.",
                  ],
                  thinkers: ["burridge", "licona", "augustine"],
                  cedes:
                    "I'd concede if the Gospels' changes went beyond anything the genre tolerated, inventing events rather than rearranging them.",
                  sources: [
                    { title: "What Are the Gospels? A Comparison with Graeco-Roman Biography", by: "Richard A. Burridge", year: "1992" },
                    { title: "Why Are There Differences in the Gospels?", by: "Michael R. Licona", year: "2017" },
                  ],
                  children: [
                    {
                      id: "evi-b-saints",
                      side: "skeptic",
                      label: "Genre licence lets defenders demote miracles too",
                      gist: "If genre can explain away a moved date, it can explain away a miracle: Licona himself read Matthew's raised saints as possible apocalyptic imagery, and if one miracle story can be demoted, so can the others.",
                      body: [
                        "Genre licence cuts both ways. In *The Resurrection of Jesus* (2010) {{licona}} suggested that Matthew's saints, rising from their graves at the crucifixion and appearing to many in Jerusalem, may be apocalyptic imagery rather than a report. Inerrantist critics protested, and in 2011 he left his post with the North American Mission Board over it. Their alarm was logical.",
                        "If the conventions of ancient biography and Jewish apocalyptic let one miracle story become symbol, nothing in the genre marks which stories are reports and which are imagery. Matthew tells the raised saints in the same narrative voice, in the same chapter, as the earthquake and the empty tomb. A reader who demotes one must say why the others stand, and the answer cannot be the genre, which licenses both readings. It has to be a prior judgment about which miracles happened, which is the question the Gospels were supposed to settle.",
                      ],
                      quote: {
                        text: "And the graves were opened; and many bodies of the saints which slept arose, And came out of the graves after his resurrection, and went into the holy city, and appeared unto many.",
                        who: "Matthew",
                        cite: "Matthew 27:52–53 (KJV)",
                      },
                      thinkers: ["licona"],
                      cedes:
                        "I'd concede if the genre itself, not a prior verdict on miracles, marked which wonder stories are reports and which are imagery.",
                      see: [
                        { id: "evi-b-spinoza", why: "Spinoza's way with the wonders: stories fitted to their hearers, kept for what they teach." },
                      ],
                      sources: [
                        { title: "The Resurrection of Jesus: A New Historiographical Approach", by: "Michael R. Licona", year: "2010" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "evi-b-spinoza",
              side: "spinoza",
              label: "Scripture's authority is its ethics, so the miracles can go",
              gist: "Spinoza agrees that Scripture's authority never rested on accurate history and locates it in what Scripture teaches, justice and charity, so the miracle stories can go without taking anything that matters with them.",
              body: [
                "The theist's concession goes further than he thinks. The *Theological-Political Treatise* (1670) reads Scripture from its own history, language and authors, by a method “almost the same” as interpreting nature (ch. 7), and finds its authority in its moral teaching, not its accuracy: obey God by practising justice and charity toward your neighbour (chs. 5, 13–14). Let the narratives err, and nothing that made Scripture authoritative is lost.",
                "The miracles can go without loss, because they were never the point. Scripture tells its wonders to suit the opinions of ordinary people, who take whatever they cannot explain for the hand of God (ch. 6), and its aim throughout is obedience, not knowledge (ch. 13). The stories did their work by moving the many to justice and charity, and that work survives their being read as stories. The core that remains is ethics, where no contradiction between Matthew and John can touch it.",
              ],
              quote: {
                text: "the truth of narratives, be they what they may, has nothing to do with the Divine law",
                who: "Spinoza",
                cite: "Theological-Political Treatise ch. 5 (1670), trans. Elwes",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if the Gospels' ethical teaching could not be stated, understood or lived apart from the miracle stories.",
              see: [
                { id: "nat-a-power", why: "Why, for Spinoza, nothing can happen against nature: its laws are God's own decrees." },
                { id: "mor-allegiance", why: "The theist's own version: faith as allegiance, not correct opinion." },
                { id: "evi-b-core", why: "The skeptic's warrant argument: once errors are conceded, why trust the miraculous core?" },
              ],
              sources: [
                { title: "A Theologico-Political Treatise", by: "Benedict de Spinoza", year: "1670", url: "https://www.gutenberg.org/ebooks/989", note: "Elwes translation, Part 1 of 4 on Project Gutenberg." },
              ],
              children: [
                {
                  id: "evi-b-event",
                  side: "theist",
                  label: "Christianity stakes itself on a bodily rising, not a moral",
                  gist: "From the start the faith said it stands or falls with something that happened to a buried body, so retreating to timeless ethics doesn't save its core but swaps it for another.",
                  body: [
                    "Moving the core to ethics gives away the faith {{paul|Paul}} preached. He settled the point in the mid-50s: “if Christ be not risen, then is our preaching vain, and your faith is also vain” (1 Corinthians 15:14). The first Christians did not announce a better ethic; they announced that something had happened, and to a body: he “was buried” and “rose again the third day” (15:4). That makes the faith falsifiable in just the way {{flew}} demanded ([[falsification|falsification]]): Paul had named the fact that would sink it. {{oldenburg|Henry Oldenburg}}, Spinoza's friend, pressed the point on him in February 1676.",
                    "The moral-core strategy has been tried often, by Spinoza, by {{kant}}'s *Religion within the Bounds of Mere Reason*, by {{harnack}}'s liberal Protestantism, and each time it yields a different religion: admirable perhaps, but not this one. The Sermon on the Mount was never the scandal; the empty tomb was. And the case for the event never depended on harmonizing the Gospels; it rests on ((evi-b-minimal|facts most critics grant)).",
                  ],
                  quote: {
                    text: "And on this article of the resurrection the whole Christian religion and its truth rest, and with its removal Christ's mission and heavenly doctrine collapse.",
                    who: "Henry Oldenburg",
                    cite: "Letter to Spinoza, Ep. 79 (11 Feb 1676), trans. Elwes",
                  },
                  thinkers: ["paul", "flew", "oldenburg", "kant", "harnack"],
                  cedes:
                    "I'd concede if the earliest Christian preaching could be shown to have centred on a teaching rather than on a death and a rising.",
                  see: [{ id: "mor-body", why: "A faith of bodily resurrection, read as a verdict for life: Objection V." }],
                  children: [
                    {
                      id: "evi-b-spiritual",
                      side: "spinoza",
                      label: "A real event, but a revelation, not a resuscitation",
                      gist: "Spinoza read the resurrection as a revelation, fitted to the disciples' understanding, that Christ's life had won eternity, not as a corpse leaving a tomb.",
                      body: [
                        "A rising, yes; a corpse leaving a tomb, no. The question is what happened. Spinoza did not call the disciples liars. Biblical apparitions, he wrote, were adapted to the understanding and opinions of those who received them, and the resurrection was a revelation to the faithful that Christ, by his life and death, had attained eternity (Ep. 75). In his next letter he put it in a line: “I accept Christ's passion, death, and burial literally, as you do, but His resurrection I understand allegorically” (Ep. 78).",
                        "This takes the Easter experiences more seriously than the hallucination theory does: they disclosed something true. It also slips past ((evi-b-wright|Wright's dilemma)): a revelation that Christ lives eternally can be called a rising without a body leaving a grave. And it keeps the event Oldenburg insists on, a real disclosure at a real time, while declining the miracle: for Spinoza, revelation is vivid imagination at work, not a breach of nature.",
                      ],
                      quote: {
                        text: "I therefore conclude, that the resurrection of Christ from the dead was in reality spiritual, and that to the faithful alone, according to their understanding, it was revealed that Christ was endowed with eternity, and had risen from the dead",
                        who: "Spinoza",
                        cite: "Letter to Oldenburg, Ep. 75 (1675–76), trans. Elwes",
                      },
                      thinkers: ["spinoza"],
                      cedes:
                        "I'd concede if the earliest witnesses, Paul included, plainly meant a physical body that had left a tomb.",
                      see: [
                        { id: "nat-a-power", why: "Why Spinoza reads it so: nature's laws are God's decrees, and God does not break them." },
                      ],
                      sources: [
                        {
                          title: "The Chief Works of Benedict de Spinoza, vol. 2 (Correspondence)",
                          by: "trans. R. H. M. Elwes",
                          year: "1883",
                          url: "https://archive.org/details/chiefworksofbene02spin",
                          note: "The 1891 printing is linked.",
                        },
                      ],
                      children: [
                        {
                          id: "evi-b-body",
                          side: "theist",
                          label: "The first witnesses insisted on a body and an empty tomb",
                          gist: "The earliest creed names a burial, Paul's 'spiritual body' is still a body, and Luke and John go out of their way to show the risen Jesus was no ghost.",
                          body: [
                            "The spiritual reading founders on the earliest texts. The creed Paul hands on runs: died, was buried, was raised, appeared (1 Corinthians 15:3–5). Burial matters only if the grave is part of the point. Paul's [[soma-pneumatikon|soma pneumatikon]], the “spiritual body” of 15:44, is on {{wright-nt}}'s reading a body animated by the Spirit, not made of spirit. Luke and John rule out a ghost: flesh and bones, a meal of fish, Thomas invited to touch.",
                            "Spinoza conceded as much: “we cannot deny that they themselves believed Christ's body to have risen from the dead” (Ep. 78); he said only that they might have been deceived. And on his own theory the Easter visions were [[imaginatio|imagination]], ((evi-a-imagination|the kind of knowing that breeds error)), and the *Treatise* forbids going to prophets for knowledge “either of natural or of spiritual phenomena” (ch. 2). Oldenburg pressed the inconsistency: if passion, death and burial are literal, by what right is the rising, told as soberly, made allegory? Spinoza, he said, relied “on no proof at all”.",
                          ],
                          quote: {
                            text: "Behold my hands and my feet, that it is I myself: handle me, and see; for a spirit hath not flesh and bones, as ye see me have.",
                            who: "Luke",
                            cite: "Luke 24:39 (KJV)",
                          },
                          thinkers: ["wright-nt", "spinoza", "oldenburg"],
                          cedes:
                            "I'd concede if Paul, the earliest witness, could be shown to have meant something other than a body by 'body'.",
                          children: [
                            {
                              id: "evi-b-flesh",
                              side: "spinoza",
                              label: "The earliest witness saw a heavenly body, not a revived corpse",
                              gist: "Paul, the one witness who wrote in his own name, says flesh and blood cannot inherit God's kingdom, counts his own vision as an appearance like the others, and never mentions an empty tomb.",
                              body: [
                                "The texts that insist on flesh are the late ones. Paul lists his own encounter, called a “heavenly vision” in Acts itself (26:19), as the same kind of appearance as Peter's (1 Corinthians 15:8). He never mentions an empty tomb. He says “flesh and blood cannot inherit the kingdom of God” (15:50); {{jeremias|Joachim Jeremias}} read that as an idiom for mortal humanity, but even so Paul insists, “thou sowest not that body that shall be” (15:37). Dale Martin reads the *soma pneumatikon* as a body made of *pneuma*, a fine heavenly stuff.",
                                "Spinoza leaned on 2 Corinthians 5:16; if its “after the flesh” means only “by worldly standards”, chapter 15 carries the case alone. As for Oldenburg's “no proof at all”, the proof is in the *Treatise*: a death is ordinary, but a corpse rising would break the order of nature, which is God's own decree (ch. 6). Told in the same sober voice, one report records what happened, the other what the witnesses believed.",
                              ],
                              quote: {
                                text: "But Paul, to whom Christ afterwards appeared, rejoices, that he knew Christ not after the flesh, but after the spirit.",
                                who: "Spinoza",
                                cite: "Letter to Oldenburg, Ep. 78 (7 Feb 1676), trans. Elwes",
                              },
                              thinkers: ["spinoza", "jeremias"],
                              cedes:
                                "I'd concede if Paul's letters, read on their own terms, plainly presupposed an emptied grave.",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  spinoza: {
    title: "God by demonstration, faith by obedience",
    body: [
      "Spinoza splits this objection down the middle. On the Gospels he is the skeptic's ancestor: the *Theological-Political Treatise* (1670) reads Scripture like nature, from its own history. On God and evidence he is nobody's evidentialist. [[deus-sive-natura|God, or Nature]], is demonstrated (Ethics I P11), and a true idea needs no outside certificate: “as light displays both itself and darkness, so is truth a standard both of itself and of falsity” (II P43 Schol.). Against Clifford, he stands with Plantinga; the quarrel is over which ideas of God are adequate.",
      "His settlement is a division of labour (TTP chs. 14–15). Philosophy seeks truth; faith seeks obedience and needs only a handful of pious dogmas, judged by the justice and charity they produce. So contradictions in the Gospels cost him nothing, and a felt sense of the divine earns nothing: it is [[imaginatio|imagination]]. What the intellect understands, it loves, with a love that is part of God's love for himself (V P36).",
      "The bill comes in two parts. A God who acts from necessity, not will (I P32 Coroll. 1), raises no one, so the Christ Spinoza honours, who “communed with God mind to mind” (TTP ch. 1), is the wisest of teachers, not a risen Lord. And the many are asked to trust a just and merciful Judge whom the *Ethics* denies. Spinoza's defence is that each dogma has a true reading, God's decrees being the laws of nature; ((evi-a-owngod|the theist asks)) whether that is translation or a noble lie.",
    ],
    quote: {
      text: "faith does not demand that dogmas should be true as that they should be pious—that is, such as will stir up the heart to obey",
      who: "Spinoza",
      cite: "Theological-Political Treatise ch. 14 (1670), trans. Elwes",
    },
  },

  lineage: [
    "m-evi-celsus",
    "m-evi-origen",
    "m-evi-aquinas",
    "m-evi-ttp",
    "m-evi-oldenburg",
    "m-evi-butler",
    "m-nat-hume",
    "m-evi-lessing",
    "m-evi-jacobi",
    "m-evi-strauss",
    "m-evi-clifford",
    "m-evi-james",
    "m-evi-flew",
    "m-evi-plantinga",
    "m-evi-wright",
    "m-evi-ehrman",
  ],

  reading: [
    {
      title: "The Ethics of Belief",
      by: "W. K. Clifford",
      year: "1877",
      url: "https://en.wikisource.org/wiki/The_Ethics_of_Belief",
      note: "The shipowner, and the strongest statement of a duty to believe only on evidence.",
    },
    {
      title: "Warranted Christian Belief",
      by: "Alvin Plantinga",
      year: "2000",
      url: "https://www.ccel.org/ccel/plantinga/warrant3",
      note: "The case that Christian belief can be rational without argument, with its answers to pluralism and biblical criticism.",
    },
    {
      title: "The Miracle of Theism",
      by: "J. L. Mackie",
      year: "1982",
      note: "The classic skeptical audit of the arguments for God, Hume on miracles included.",
    },
    {
      title: "Jesus, Interrupted",
      by: "Bart D. Ehrman",
      year: "2009",
      note: "The Gospel discrepancies, set out for general readers by a leading critical scholar.",
    },
    {
      title: "The Resurrection of the Son of God",
      by: "N. T. Wright",
      year: "2003",
      note: "The fullest case that only an empty tomb and real appearances explain the first Christians' belief.",
    },
    {
      title: "The Resurrection of Jesus: Apologetics, Polemics, History",
      by: "Dale C. Allison Jr.",
      year: "2021",
      note: "A believer's scrupulously even-handed weighing of the evidence, engaging Wright and the skeptics alike.",
    },
  ],
};

export default evidence;
