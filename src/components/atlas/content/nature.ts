import type { Objection } from "../types";

/* Objection III — Nature.
   Two prongs: (A) miracles would break nature's laws, which never break, and
   (B) a God who chooses explains nothing nature can't. Children attack their
   parent. Quotes were checked against public-domain texts: Hume's Enquiry and
   Dialogues (Project Gutenberg), Spinoza's TTP and Ethics (Elwes), the English
   Dominican Summa and Dods's City of God (New Advent), Latta's Leibniz (1898),
   Campbell's Dissertation (1762 printing), Darwin's letter (Darwin
   Correspondence Project), Hoyle's 1981 talk (Caltech E&S), and Earman's own
   text of Hume's Abject Failure. Lewis, Quine, Russell, Leibniz's letters to
   Clarke and the modern critics are paraphrased. */

const nature: Objection = {
  id: "nature",
  numeral: "III",
  short: "Nature",
  title: "Nature runs on its own",
  objection:
    "Nothing happens outside natural law, and God explains nothing that nature can't explain on its own.",
  counter:
    "Ruling out miracles in advance is circular, and even John Earman, no apologist, argues that Hume's case against miracles fails. And God arguably explains what naturalism leaves unexplained: why anything exists, why the constants of physics permit life, and why evolved minds track truth (Plantinga).",
  dek:
    "It makes two claims: that nature never breaks its own laws, and that a God who chooses explains nothing nature can't. The second is almost word for word an objection {{aquinas}} raised against himself in the 1260s, and his reply is still in play. Watch the word *nature*: for the Spinozist it already includes mind and is itself God, so the real quarrel is whether anything needs a chooser.",
  question:
    "Is nature the whole story, with no exceptions and nothing left over, or does it point past itself to a God who chooses?",

  prongs: [
    /* ───────────────────────── Prong A: miracles ───────────────────────── */
    {
      id: "nat-a",
      side: "skeptic",
      label: "Miracles would break nature's laws, and those laws never break",
      gist: "A miracle means nature's order giving way, and everything we have ever checked says that order never gives way, so a report of one is likelier to be error than fact.",
      body: [
        "Everything we have checked runs on unbroken regularity. Stones fall, the dead stay dead, and thunder, plague and epilepsy, once read as the direct hand of God, all turned out to have causes inside nature. A [[miracle|miracle]] is the one claim that asks us to set that whole record aside. {{hume}} drew the moral in 1748: a firm and unalterable experience establishes the laws, so the case against any miracle is as strong as an argument from experience can be, and a wise man proportions his belief to the evidence.",
        "{{spinoza}} reached the same verdict seventy-eight years earlier, from metaphysics rather than evidence: nothing happens in nature that does not follow from her laws, because those laws are God's own. So the objection cuts twice. Spinoza says there are no exceptions; Hume says we could never be justified in believing in one.",
      ],
      quote: {
        text: "That no testimony is sufficient to establish a miracle, unless the testimony be of such a kind, that its falsehood would be more miraculous, than the fact, which it endeavours to establish …",
        who: "David Hume",
        cite: "An Enquiry concerning Human Understanding X, §91 (1748)",
      },
      thinkers: ["hume", "spinoza"],
      cedes:
        "I'd concede if a miracle claim survived controls for independence and prior documentation as strict as a drug trial's.",
      see: [
        { id: "evi-b-prior", why: "The same weighing of odds, applied to the resurrection in Objection IV." },
        { id: "nat-b", why: "The other half of the objection: even if something odd happened, would God explain it?" },
      ],
      sources: [
        { title: "An Enquiry concerning Human Understanding, sect. X, “Of Miracles”", by: "David Hume", year: "1748", url: "https://www.gutenberg.org/ebooks/9662" },
        { title: "Miracles", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/miracles/" },
      ],
      children: [
        {
          id: "nat-a-circle",
          side: "theist",
          label: "Ruling out miracles in advance argues in a circle",
          gist: "Hume says all experience is against miracles, but that is true only if every miracle report is false, which is the very question at issue.",
          body: [
            "Against the claim that experience shows the laws never break: whose experience? {{hume}} writes that there must be “a uniform experience against every miraculous event, otherwise the event would not merit that appellation.” But a miracle report is itself a report of experience. To call experience uniform, Hume must first set aside every such report, which is to assume they are all false. {{campbell-george}}, a Scottish minister who traded letters with Hume, made the charge in 1762, adding that most of what any of us calls experience reaches us through testimony in the first place.",
            "{{lewis-cs}} pressed the same charge in 1947. Learned men once ruled out stones falling from the sky this way, dismissing peasants' reports until a shower of them hit L'Aigle in Normandy in 1803 and the physicist Jean-Baptiste Biot confirmed it. Whether a particular wonder occurred is a question of history, and a rule that discounts every possible piece of evidence before looking has answered it without asking.",
          ],
          quote: {
            text: "Thus he falls into that parallogism, which is called begging the question. What he gives with one hand, he takes with the other.",
            who: "George Campbell",
            cite: "A Dissertation on Miracles (1762), pt. I, sect. 2",
          },
          thinkers: ["campbell-george", "lewis-cs", "hume"],
          cedes:
            "I'd concede if the case against miracles could be stated without first setting aside, unexamined, every report of one.",
          see: [{ id: "evi-a-compelling", why: "Why the distinctively Christian case leans on miracle testimony at all." }],
          sources: [
            { title: "A Dissertation on Miracles", by: "George Campbell", year: "1762", url: "https://archive.org/details/dissertationonmi00camp" },
            { title: "Miracles: A Preliminary Study", by: "C. S. Lewis", year: "1947" },
          ],
          children: [
            {
              id: "nat-a-odds",
              side: "skeptic",
              label: "Weighed fairly, testimony never outweighs a law of nature",
              gist: "Hume doesn't assume the reports are false: he weighs them, and the chance that witnesses erred or lied always beats the chance that nature's order failed.",
              body: [
                "The circle charge misreads the argument: {{hume}} weighs, he does not presuppose. Ask which would be the greater wonder, that this testimony is false or that the event happened. Error, wishful thinking and fraud are observed every day; the dead rising is observed never, under any conditions we can check. Preferring the likelier is not begging the question; it is what rational belief is. Hume even grants that testimony could establish a wonder if it were universal and consistent enough.",
                "{{fogelin}} reads the essay as one argument: Part 1 sets the bar, Part 2 shows that no actual report clears it; {{mackie}} likewise treats it as a weighing of probabilities, not a ban laid down before looking. Historians since F. H. Bradley (1874) add that critical history is impossible unless nature's regularity is presumed, which is why [[methodological-naturalism|methodological naturalism]] is the working rule of every historian, believer or not, and no atheist's prejudice.",
              ],
              quote: {
                text: "Thus, suppose, all authors, in all languages, agree, that, from the first of January 1600, there was a total darkness over the whole earth for eight days … it is evident, that our present philosophers, instead of doubting the fact, ought to receive it as certain, and ought to search for the causes whence it might be derived.",
                who: "David Hume",
                cite: "An Enquiry concerning Human Understanding X, §99 (1748)",
              },
              thinkers: ["hume", "fogelin", "mackie"],
              cedes:
                "I'd concede if some miracle report came with testimony whose falsehood really would be harder to believe than the event itself.",
              see: [{ id: "evi-b-prior", why: "The base-rate argument as it bears on Easter." }],
              sources: [
                { title: "A Defense of Hume on Miracles", by: "Robert J. Fogelin", year: "2003" },
                { title: "The Miracle of Theism", by: "J. L. Mackie", year: "1982" },
              ],
              children: [
                {
                  id: "nat-a-earman",
                  side: "theist",
                  label: "Hume's case fails: witnesses can make a miracle credible",
                  gist: "Probability theory shows that enough independent, fairly reliable witnesses can make even a very improbable event credible, so no rule of thumb can settle the question before the evidence is weighed.",
                  body: [
                    "Weigh it, then, but with the mathematics of chance that Hume's own contemporaries, Thomas Bayes and {{price-richard}}, were building. {{earman}}, a philosopher of science who says that if he needed gods they would be those of Greece and Rome, ran the numbers in *Hume's Abject Failure* (2000). Made precise, he concludes, Hume's principles are “either vapid, specious, or at variance with actual scientific practice.”",
                    "The key is independence. One witness may lie or err. But two strangers who never met, each naming the same license plate, are hard to dismiss, and many witnesses who could not have colluded, each right more often than wrong, multiply their force until they can overcome any [[prior-probability|prior]] above zero; {{babbage}} made the calculation in 1837. So no maxim settles a miracle claim in advance. Each must be weighed on its own evidence, and that is all this reply asks: that the question stay open.",
                  ],
                  quote: {
                    text: "Any epistemology that does not allow for the possibility that evidence, whether from eyewitness testimony or from some other source, can establish the credibility of a UFO landing, a walking on water, or a resurrection is inadequate.",
                    who: "John Earman",
                    cite: "Hume's Abject Failure (2000), pt. I",
                  },
                  thinkers: ["earman", "price-richard", "babbage"],
                  cedes:
                    "I'd concede if no realistic number of independent, minimally reliable witnesses could lift a miracle's probability above even odds.",
                  see: [
                    { id: "evi-b-cumulative", why: "How the prior for a resurrection depends on what else we know about God." },
                    { id: "nat-a-circle", why: "The same verdict reached by a different road: no rule may decide in advance." },
                  ],
                  sources: [
                    { title: "Hume's Abject Failure: The Argument Against Miracles", by: "John Earman", year: "2000", url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf" },
                    { title: "Four Dissertations", by: "Richard Price", year: "1767" },
                  ],
                  children: [
                    {
                      id: "nat-a-practice",
                      side: "skeptic",
                      label: "Hume's case stands: Part 2 shows real reports fail",
                      gist: "Testimony could prove a miracle in principle, but the reports we actually have come from people who wanted them, grow in the retelling, and fall apart when checked.",
                      body: [
                        "Let Earman refute Part 1 read on its own; Hume's verdict lives in Part 2, as {{fogelin}} argues. Miracle reports come from communities that want them and travel through people who love to tell of wonders, and every religion's miracles discredit its rivals'. His test case was the cures reported around 1730 at the Paris tomb of François de Pâris, a Catholic deacon, sworn to before judges in a learned age, which his Protestant readers believed no more than he did. If testimony that good fails for a rival creed, it fails for one's own.",
                        "{{earman}} himself ends up here. He sees no barrier in principle, but judges religious miracle reports to be like faith healing, where collective hysteria wrecks the witnesses' reliability. Lourdes has recognized 72 cures since 1858 (the latest in 2025) out of many thousands claimed, and the largest trial of intercessory prayer, STEP (2006, 1,802 heart-surgery patients), found no benefit; patients who knew they were being prayed for fared slightly worse.",
                      ],
                      quote: {
                        text: "But I do believe, in a way that I cannot articulate in detail, that these cases are in fact relevantly similar to the case of faith healing where there is a palpable atmosphere of collective hysteria that renders the participants unable to achieve the minimal reliability condition …",
                        who: "John Earman",
                        cite: "Hume's Abject Failure (2000), pt. I",
                      },
                      thinkers: ["hume", "earman", "fogelin"],
                      cedes:
                        "I'd concede if one well-documented healing held up under independent medical review, with records from before and after, and no ordinary explanation fitting it.",
                      see: [
                        { id: "evi-b-natural", why: "Natural explanations for the Easter experiences, in Objection IV." },
                        { id: "evi-b-prior", why: "Base rates applied to the resurrection." },
                      ],
                      sources: [
                        { title: "Study of the Therapeutic Effects of Intercessory Prayer (STEP)", by: "Herbert Benson et al., American Heart Journal", year: "2006" },
                      ],
                      children: [
                        {
                          id: "nat-a-keener",
                          side: "theist",
                          label: "Some healing reports pass the very tests Hume set",
                          gist: "Some recoveries come with medical records and independent witnesses, and Hume's own paragraph shows he refused a resurrection not for weak testimony but because of what kind of event it was.",
                          body: [
                            "Not every report fails when checked. {{keener}}'s two-volume *Miracles* (2011) gathers healing accounts from four continents, mostly eyewitness testimony but some with before-and-after medical records for conditions that do not usually reverse. A small, uncontrolled study in Mozambique (Candy Gunther Brown and colleagues, 2010) found hearing and sight gains after in-person prayer, enough to warrant a controlled trial. STEP tested scripted prayers by distant strangers, which is not the healing these reports describe.",
                            "Read on in Hume's paragraph. He would accept unanimous reports of eight days' darkness. But if every historian agreed that Queen Elizabeth died, lay buried a month and returned to reign, he would call her death a pretense rather than admit “so signal a violation of the laws of nature.” The testimony is as good in both cases. What differs, he says, is only that nature's decay has analogies in experience and a return from the dead has none. That is ((nat-a-circle|the circle)) again, and it falls on exactly the kind of event Christianity stakes itself on.",
                          ],
                          quote: {
                            text: "I must confess that I should be surprised at the concurrence of so many odd circumstances, but should not have the least inclination to believe so miraculous an event.",
                            who: "David Hume",
                            cite: "An Enquiry concerning Human Understanding X, §99 (1748)",
                          },
                          thinkers: ["keener", "hume"],
                          cedes:
                            "I'd concede if the best-documented cases, examined by independent physicians, all turned out to have ordinary explanations or faulty records.",
                          see: [{ id: "evi-b-minimal", why: "The one miracle claim Christianity actually stakes itself on." }],
                          sources: [
                            { title: "Miracles: The Credibility of the New Testament Accounts", by: "Craig S. Keener", year: "2011" },
                            { title: "Study of the Therapeutic Effects of Proximal Intercessory Prayer (STEPP) on Auditory and Visual Impairments in Rural Mozambique", by: "Candy Gunther Brown et al., Southern Medical Journal", year: "2010" },
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
          id: "nat-a-laws",
          side: "theist",
          label: "A miracle breaks no law, so physics can't rule it out",
          gist: "A law of nature says what happens when nothing outside nature acts, so a miracle, God acting from beyond, breaks no law, and no experiment could rule it out.",
          body: [
            "The objection pictures a miracle as nature's order snapping. The tradition never did. {{augustine}} held that a portent goes against the nature we know, not against nature, since the Creator's will is the nature of each thing. {{aquinas}} distinguished acting against nature from acting beyond the order of created causes: the God who gives every creature its power can also produce an effect without its usual cause.",
            "The modern version runs through the laws themselves. A law of motion says what a system does if nothing outside it intervenes. {{lewis-cs}} put it plainly: once a miraculous event is fed in, every law carries it forward, so miraculous wine still makes you drunk. Even conservation of energy, {{larmer}} points out, holds only for isolated systems, and whether nature is ever not isolated is the very question at issue. {{plantinga}} adds that no law of physics says the universe is causally closed; that is a philosophical extra laid over the science, and physics cannot settle it.",
          ],
          quote: {
            text: "For how is that contrary to nature which happens by the will of God, since the will of so mighty a Creator is certainly the nature of each created thing? A portent, therefore, happens not contrary to nature, but contrary to what we know as nature.",
            who: "Augustine",
            cite: "City of God XXI.8 (c. 425), trans. Marcus Dods",
          },
          thinkers: ["augustine", "aquinas", "lewis-cs", "larmer", "plantinga"],
          cedes:
            "I'd concede if physics itself, not a philosophy laid over it, showed the universe to be a closed system that nothing beyond it could act on.",
          see: [
            { id: "coh-a", why: "Tension: an intervening God looks like one cause among others, the worry of Objection I." },
          ],
          sources: [
            { title: "City of God, bk. XXI", by: "Augustine, trans. Marcus Dods", year: "c. 425", url: "https://www.newadvent.org/fathers/120121.htm" },
            { title: "The Legitimacy of Miracle", by: "Robert A. Larmer", year: "2014" },
            { title: "Where the Conflict Really Lies: Science, Religion, and Naturalism", by: "Alvin Plantinga", year: "2011" },
          ],
          children: [
            {
              id: "nat-a-closure",
              side: "skeptic",
              label: "Physics can rule it out: no outside push ever shows up",
              gist: "Whether anything beyond the physical ever pushes on matter is a question evidence can answer, and a century of physics and physiology has looked hard and found nothing.",
              body: [
                "Closure is not a law of physics, as Plantinga says; it is a finding of physics. {{papineau}} traces how it was won: nineteenth-century science still allowed vital and mental forces acting on matter; twentieth-century physiology looked for them, cell by cell and nerve by nerve, and found only the familiar physical ones. Conservation binds only isolated systems, as Larmer says, but every system ever examined, from calorimeters to living cells, behaves as one. [[causal-closure|Causal closure]] is the generalization from that search, not a dogma laid over it.",
                "Granted, the search targeted regular forces; a single act, once in history, would slip past any controlled test. That is a cost, not a refuge: a cause posited only where no one can look is unfalsifiable. {{carroll}} adds that the physics of bodies, brains and wine has been tested at every relevant energy. Even {{leibniz}}, a believer in miracles of grace, mocked Newton's God for mending his own clockwork: miracles, he told Clarke in 1715, supply the wants of grace, not of nature.",
              ],
              thinkers: ["papineau", "carroll", "leibniz"],
              cedes:
                "I'd concede if a well-controlled measurement ever caught matter in a living body moving in a way the known physical forces can't account for.",
              see: [{ id: "coh-a", why: "If God acts through every cause, what work is left for nature? Objection I asks." }],
              sources: [
                { title: "The Rise of Physicalism", by: "David Papineau", year: "2001" },
                { title: "The Laws Underlying the Physics of Everyday Life Are Completely Understood", by: "Sean Carroll", year: "2010" },
                { title: "Physicalism", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/physicalism/" },
              ],
            },
            {
              id: "nat-a-power",
              side: "spinoza",
              label: "A God who never competes with nature can't step into it",
              gist: "If nature's laws are God's own decrees, a miracle would set God against himself, and a God who works through every cause, as the theist says, has no gap to step into.",
              body: [
                "Lewis's picture of God feeding events into nature is what {{spinoza}} called the common error: imagining two powers, God's and nature's, taking turns, so that God idles while nature runs and nature idles while God acts. In truth nature's universal laws are decrees of God, following from the necessity of his nature. An event against them would be God acting against himself, and Spinoza saw no difference between *against* the laws and *beyond* them. Belief in such an event, he warned, would throw doubt on everything and lead to atheism.",
                "Now hold the theist to his own word. Objection I's reply, with {{tanner}} and {{hart}}, says God grounds every cause without competing with any. Then God is not one more cause that now and then supplies what a creature would have supplied, which is exactly what the feeding-in model makes him. Choose: a [[non-competition|non-competing]] God works through nature and never steps in, or an intervening God is ((coh-a|one cause among others)) after all.",
              ],
              quote: {
                text: "They suppose, forsooth, that God is inactive so long as nature works in her accustomed order, and vice versa, that the power of nature and natural causes are idle so long as God is acting: thus they imagine two powers distinct one from the other, the power of God and the power of nature …",
                who: "Spinoza",
                cite: "Theologico-Political Treatise, ch. 6 (1670), trans. Elwes",
              },
              thinkers: ["spinoza", "tanner", "hart"],
              cedes:
                "I'd concede if someone could describe a miracle in which God neither does what a creature would have done nor sets nature's order aside.",
              see: [
                { id: "coh-a-concur", why: "The non-competition claim this dilemma turns against the miracle model." },
                { id: "coh-a-collapse", why: "Whether God's decrees could have been otherwise: the modal-collapse question." },
              ],
              sources: [
                { title: "God and Creation in Christian Theology: Tyranny or Empowerment?", by: "Kathryn Tanner", year: "1988" },
                { title: "A Theologico-Political Treatise, ch. 6", by: "Benedict de Spinoza, trans. R. H. M. Elwes", year: "1670", url: "https://www.gutenberg.org/ebooks/990" },
              ],
              children: [
                {
                  id: "nat-a-free",
                  side: "theist",
                  label: "A freely chosen order leaves its Maker free to exceed it",
                  gist: "God chose nature's order freely, so going beyond it contradicts nothing, and when he heals without medicine he pushes no natural cause aside, so a miracle is neither self-contradiction nor competition.",
                  body: [
                    "Spinoza's dilemma has two horns, and {{aquinas}} met both. Against the first: God chose this order and could have chosen another, so acting beyond it breaks no decree; the decree included it. Spinoza's step from decree to absurdity works only if God's will is as necessary as geometry, which is the point in dispute in ((coh-a-collapse|Objection I)).",
                    "Against the second: a miracle is not competition. Every creature, Aquinas says (*Summa* III q.11 a.1), has an [[obediential-potency|obediential power]], an openness to be raised by its first cause beyond anything a natural agent could do. When God heals without medicine, no creaturely cause is pushed aside; one is simply not used. Lewis's image of a new event fed into nature is right about the laws, which carry it forward, but the feeding is an author adding a scene, not an actor elbowing another off the stage.",
                  ],
                  quote: {
                    text: "… He is not subject to the order of secondary causes; but, on the contrary, this order is subject to Him, as proceeding from Him, not by a natural necessity, but by the choice of His own will; for He could have created another order of things.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.105 a.6 (trans. English Dominican Province)",
                  },
                  thinkers: ["aquinas", "lewis-cs"],
                  cedes:
                    "I'd concede if a God whose will could have been otherwise proved incoherent, so that his decrees had to be necessary.",
                  see: [
                    { id: "coh-a-concur", why: "The non-competition picture a miracle must fit, argued in Objection I." },
                    { id: "coh-a-extrinsic", why: "How one necessary divine act can have contingent effects." },
                    { id: "nat-b-reasons", why: "The same free-choice reply, made about why there is a world at all." },
                    { id: "nat-b-contrast", why: "The Spinozist rejoinder to free choice: a reason that fits either choice leaves it brute." },
                  ],
                  sources: [
                    { title: "Summa Theologiae I q.105 a.6", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1105.htm" },
                    { title: "Summa Theologiae III q.11 a.1", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/4011.htm" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── Prong B: explains nothing extra ───────────────────────── */
    {
      id: "nat-b",
      side: "skeptic",
      label: "God explains nothing that nature can't explain on its own",
      gist: "Science keeps explaining nature by nature, and a God who chooses predicts nothing that nature alone doesn't, so the simpler account leaves him out.",
      body: [
        "{{aquinas}} put this objection better than most atheists: what a few principles explain shouldn't be credited to many, and nature plus human will seem to explain everything we see. The principle has a name, [[ockhams-razor|Ockham's razor]], and a record. {{newton}} thought the planets needed God's occasional correction; {{laplace}} showed their orbits stable without it. {{paley}} saw a designer in the eye; {{darwin}} showed how the look of design arrives without one. Each gap once filled by God was closed by nature, never the reverse.",
        "The target needs naming. The objector does not deny that something underlies everything; for a Spinozist that something is God. The target is a God who chooses and acts, offered as an explanation. Such a God predicts nothing nature does not, so he explains nothing extra; at best he is a [[god-of-the-gaps|God of the gaps]], waiting for the next gap to close.",
      ],
      quote: {
        text: "Further, it is superfluous to suppose that what can be accounted for by a few principles has been produced by many. But it seems that everything we see in the world can be accounted for by other principles, supposing God did not exist.",
        who: "Thomas Aquinas, stating the objection",
        cite: "Summa Theologiae I q.2 a.3, obj. 2 (trans. English Dominican Province)",
      },
      thinkers: ["aquinas", "ockham", "newton", "laplace", "paley", "darwin"],
      cedes:
        "I'd concede if some well-defined fact were predicted by a God who chooses, and not by nature alone, and then observed.",
      see: [
        { id: "hid-hart-light", why: "The classical theist's first answer: God is not a hypothesis inside the world at all." },
        { id: "coh-a-concur", why: "If God never competes with nature, what exactly does he add?" },
      ],
      sources: [
        { title: "Summa Theologiae I q.2 a.3", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1002.htm" },
      ],
      children: [
        /* ── why anything exists ── */
        {
          id: "nat-b-exist",
          side: "theist",
          label: "Why anything exists needs a ground nature can't supply",
          gist: "Science explains each moment of the world by the one before, but never why there is a world at all, and only something that has to exist can answer that.",
          body: [
            "The razor cuts only between explanations of the same thing. Physics explains how one state of the world leads to the next; it cannot, even in principle, say why there is a world with laws to describe. {{leibniz}} called this the first question. Every star, law and quantum field might never have existed, so the reason for the whole series of such contingent things cannot lie inside the series.",
            "{{aquinas}}'s own reply to this objection makes the move: whatever can change or fail must be traced to a first principle that is necessary of itself. This is the [[contingency-argument|contingency argument]], restated with modern rigor by {{pruss}}, not the [[kalam|kalam argument]]: Aquinas held that reason cannot prove the world had a beginning. Nor is Lawrence Krauss's *A Universe from Nothing* (2012) a rival, since a quantum vacuum governed by laws is not nothing, as the philosopher of physics David Albert said in reviewing it.",
          ],
          quote: {
            text: "This principle being laid down, the first question we are entitled to put will be — Why does something exist rather than nothing? For ‘nothing’ is simpler and easier than ‘something.’",
            who: "G. W. Leibniz",
            cite: "Principles of Nature and of Grace §7 (written 1714), trans. Robert Latta",
          },
          thinkers: ["leibniz", "aquinas", "pruss"],
          cedes:
            "I'd concede if it were shown that a whole made of contingent things needs no explanation beyond its parts.",
          see: [{ id: "coh-a-concur", why: "A ground of being is not one cause among others: the counter of Objection I." }],
          sources: [
            { title: "Cosmological Argument", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/cosmological-argument/" },
            { title: "Necessary Existence", by: "Alexander Pruss and Joshua Rasmussen", year: "2018" },
          ],
          children: [
            {
              id: "nat-b-necess",
              side: "spinoza",
              label: "The necessary being is Nature itself, and it chooses nothing",
              gist: "If everything has a reason, the thing that has to exist is Nature itself, and everything follows from it the way theorems follow from axioms, with no one choosing.",
              body: [
                "The contingency argument is right about the question and wrong about the answer. {{spinoza}} holds the [[psr|principle of sufficient reason]] without exception: of everything a cause or reason must be given, for its existence or its non-existence (*Ethics* I P11). But the necessary being need not stand outside nature. What exists in itself and depends on nothing else, which Spinoza calls substance, exists by its own nature, [[causa-sui|cause of itself]], and there is only one: God, or Nature. Even {{hume}}'s Cleanthes asked why the material universe might not be the necessary being.",
                "And the principle goes further. If the reason this world exists rather than another lies in God's nature, the world follows necessarily: nothing in it is contingent (I P29). That is [[necessitarianism|necessitarianism]]. {{van-inwagen}}, a Christian, showed that the strong principle implies it and so gave up the principle; {{della-rocca}} accepts both. Hold the principle all the way, as the contingency argument asks, and you reach a ground that could not have done otherwise, not a will that chose.",
              ],
              quote: {
                text: "Existence belongs to the nature of substances.",
                who: "Spinoza",
                cite: "Ethics I P7 (1677), trans. Elwes",
              },
              thinkers: ["spinoza", "hume", "van-inwagen", "della-rocca"],
              cedes:
                "I'd concede if a contingent world could have a sufficient reason that does not make it necessary.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's God thinks but does not choose, argued in Objection I." },
                { id: "coh-a-collapse", why: "The same necessity, pressed against the classical theist's simple God." },
              ],
              sources: [
                { title: "Ethics, pt. I", by: "Benedict de Spinoza, trans. R. H. M. Elwes", year: "1677", url: "https://www.gutenberg.org/ebooks/3800" },
                { title: "PSR", by: "Michael Della Rocca, Philosophers' Imprint", year: "2010" },
              ],
              children: [
                {
                  id: "nat-b-reasons",
                  side: "theist",
                  label: "A free choice made for good reasons explains creation",
                  gist: "Good reasons can fully explain a choice even when the chooser could have done otherwise, so creation can have a reason without having been forced.",
                  body: [
                    "The leap from sufficient reason to necessity runs two kinds of explanation together. A reason can explain a choice without forcing it: you took the job because it paid better, though you could have stayed. {{aquinas}} says God wills his own goodness necessarily but creatures freely, since that goodness lacks nothing without them; God's will has reasons, not causes. {{pruss}} and {{oconnor-timothy}} defend a principle of reason fitted to this: an agent's free act for a purpose explains a fact that could have been otherwise without making it inevitable.",
                    "And weigh the price of the alternative. If nothing could have been otherwise, this cough, this typo and this war were as necessary as two plus two. {{van-inwagen}} took that as proof the strong principle is false, not a discovery about the world. A free creation keeps both halves: everything has a reason, and not everything had to be.",
                  ],
                  quote: {
                    text: "The will of God is reasonable, not because anything is to God a cause of willing, but in so far as He wills one thing to be on account of another.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.5 ad 1 (trans. English Dominican Province)",
                  },
                  thinkers: ["aquinas", "pruss", "oconnor-timothy", "van-inwagen"],
                  cedes:
                    "I'd concede if reasons that leave a choice open turned out to explain nothing about why it went the way it did.",
                  see: [
                    { id: "coh-a-extrinsic", why: "Objection I's model: one necessary divine act with contingent effects." },
                    { id: "coh-c-natlaw", why: "The same fitting-not-forced answer, given for God's commands in Objection I." },
                  ],
                  sources: [
                    { title: "Summa Theologiae I q.19 aa.3, 5", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1019.htm" },
                    { title: "Theism and Ultimate Explanation", by: "Timothy O'Connor", year: "2008" },
                  ],
                  children: [
                    {
                      id: "nat-b-contrast",
                      side: "spinoza",
                      label: "A reason that fits either choice is a brute fact in disguise",
                      gist: "If the same reasons would equally have explained God making a different world or none, nothing explains why this one exists rather than another, and the brute fact the theist refused is back.",
                      body: [
                        "Reasons that would have served equally for the opposite choice explain why a choice was possible, not why it went this way. Why this world rather than another, or none? On the free-choice view, the last answer is: he chose to. That is a [[brute-fact|brute fact]] with a halo. The job analogy hides it, because your character and circumstances settle your choice; nothing settles God's. {{leibniz}} demanded a reason why things are so *and not otherwise*; {{spinoza}} held that demand without exception (*Ethics* I P11), and {{della-rocca}} presses that [[contrastive-explanation|contrastive]] demand today.",
                        "Leibniz's own way out was that reasons incline without necessitating: God chooses the best by a moral, not a metaphysical, necessity. {{rowe}} showed why that fails. If there is a best world, a perfectly good God cannot fail to make it, and creation is necessary after all. If there is no best, his goodness settles nothing, since every world he could make has a better, and the brute fact returns. Either way, the promised complete explanation never arrives.",
                      ],
                      quote: {
                        text: "And that of sufficient reason, in virtue of which we hold that there can be no fact real or existing, no statement true, unless there be a sufficient reason, why it should be so and not otherwise, although these reasons usually cannot be known by us.",
                        who: "G. W. Leibniz",
                        cite: "Monadology §32 (1714), trans. Robert Latta",
                      },
                      thinkers: ["leibniz", "spinoza", "della-rocca", "rowe"],
                      cedes:
                        "I'd concede if reasons could settle God's choice without either a best world that binds him or a tie that leaves his choice brute.",
                      see: [
                        { id: "coh-a-extrinsic", why: "The model this dilemma targets in Objection I: one act, the same in every world." },
                        { id: "nat-b-brute", why: "The brute fact the contingency argument set out to avoid." },
                        { id: "coh-c-brute", why: "Objection I: the theist accepts a stopping point too." },
                      ],
                      sources: [
                        { title: "Principle of Sufficient Reason", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/sufficient-reason/" },
                        { title: "Can God Be Free?", by: "William L. Rowe", year: "2004" },
                        { title: "The Monadology and Other Philosophical Writings", by: "G. W. Leibniz, trans. Robert Latta", year: "1898", url: "https://archive.org/details/themonadology00leibuoft" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-brute",
              side: "skeptic",
              label: "Existence may need no ground: the universe can simply be",
              gist: "Every explanation stops somewhere; the theist stops at God, the naturalist at the universe or its first state, and nothing shows the naturalist's stopping point is worse.",
              body: [
                "The demand for a ground of the whole assumes what it must prove: that every contingent thing has an explanation. Explain each of twenty particles, says {{hume}}'s Cleanthes, and it is unreasonable to ask what caused the twenty; the whole is explained in explaining the parts. {{russell}} told Copleston on BBC radio in 1948 that the universe is just there; every man has a mother, but the human race does not. {{kant}} argued that the causal principle has its proper use inside experience and cannot be stretched to the world as a whole.",
                "{{oppy}}'s parity argument finishes the job. Whatever the theist says of God, necessary or brute, the naturalist can say of the universe's initial state, with one kind of thing fewer. Quantum events already happen with probabilities but no sufficient reason, and physics is none the worse. A [[brute-fact|brute fact]] at the bottom is no scandal; every view has one.",
              ],
              quote: {
                text: "But the whole, you say, wants a cause. I answer, that the uniting of these parts into a whole … is performed merely by an arbitrary act of the mind, and has no influence on the nature of things.",
                who: "Cleanthes, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. IX (1779)",
              },
              thinkers: ["hume", "russell", "kant", "oppy"],
              cedes:
                "I'd concede if denying a reason for the universe could be shown to undercut the reasons I rely on everywhere else.",
              see: [
                { id: "evi-a-parity", why: "Parity again: every worldview has its unexplained starting points." },
                { id: "coh-c-brute", why: "The same move in ethics: brute moral facts against a divine terminus." },
              ],
              sources: [
                { title: "Dialogues Concerning Natural Religion", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" },
                { title: "Arguing about Gods", by: "Graham Oppy", year: "2006" },
              ],
              children: [
                {
                  id: "nat-b-psr",
                  side: "theist",
                  label: "If the universe needs no reason, nothing does",
                  gist: "If a whole universe can exist for no reason, anything could, and science would lose the expectation of reasons it relies on every day.",
                  body: [
                    "Allow brute existence at the largest scale and you cannot fence it in. If a universe can simply be, why not a brick popping into being in your kitchen? {{pruss}} argues that the brute-fact view leaves no way to call such events improbable, since probabilities come from the very laws and causes it says can be absent. And the twenty particles miss the point. Take every contingent fact together as one giant fact: it too could have been otherwise, and no part of it explains why the whole obtains ({{rowe}}; Pruss).",
                    "Parity fails. God is proposed as necessary; a heap of contingent parts with arbitrary-looking constants is the poorest candidate, and quantum chance is no counterexample, since laws and states fix a decay's odds. The theist owes a principled line as well: {{della-rocca}} follows the principle past God into necessity, while the theist stops at a free agent, a stop ((nat-b-reasons|he must defend)). But stopping at the universe puts the brute fact exactly where an explanation was on offer.",
                  ],
                  thinkers: ["pruss", "rowe", "della-rocca"],
                  cedes:
                    "I'd concede if a principled line could be drawn where things may go unexplained, one not drawn just where the argument for God begins.",
                  see: [
                    { id: "nat-b-contrast", why: "The theist's own free choice faces the same charge of bruteness." },
                    { id: "coh-c-terminus", why: "In ethics the theist accepts a terminus of his own." },
                  ],
                  sources: [
                    { title: "The Principle of Sufficient Reason: A Reassessment", by: "Alexander R. Pruss", year: "2006" },
                    { title: "The Cosmological Argument", by: "William L. Rowe", year: "1975" },
                  ],
                },
              ],
            },
          ],
        },

        /* ── why the constants permit life ── */
        {
          id: "nat-b-tune",
          side: "theist",
          label: "Life-permitting physics is evidence of God behind it",
          gist: "Nudge the numbers of physics even slightly and there would be no stars, no chemistry and no life, which is far less surprising if God intended life than if it all came by chance.",
          body: [
            "Grant that nature explains what happens inside it; the question is why its own settings allow anything interesting to happen. Change the strength of gravity, the strong force or the electron's mass a little, and there are no long-lived stars, no carbon, no chemistry rich enough for life. {{rees}} picks out six numbers that must fall in narrow windows. The energy of empty space sits some 120 powers of ten below a naive quantum estimate; much larger, and space would have flown apart before any galaxy formed. {{penrose}} put the odds of so orderly a beginning at one in ten to the power of ten to the 123.",
            "{{hoyle}}, no conventional believer, found the energy levels of carbon and oxygen nuclei (7.65 and 7.12 million electron volts) just where a designer would need them. {{collins}} gives the inference its form: [[fine-tuning|values like these]] are far more probable if there is a God than if there is not. {{barnes}}, an astrophysicist, has defended the physics, constant by constant, against its critics.",
          ],
          quote: {
            text: "A common sense interpretation of the facts suggests that a superintellect has monkeyed with physics, as well as with chemistry and biology, and that there are no blind forces worth speaking about in nature.",
            who: "Fred Hoyle",
            cite: "“The Universe: Past and Present Reflections,” Engineering & Science (Caltech), Nov. 1981",
          },
          thinkers: ["rees", "penrose", "hoyle", "collins", "barnes"],
          cedes:
            "I'd concede if a deeper theory showed life possible across most of the constants' range, or derived their values from principles that make life unremarkable.",
          see: [{ id: "nat-b-necess", why: "Spinoza's answer: the constants are no target someone hit, since nothing could have been otherwise." }],
          sources: [
            { title: "Fine-Tuning", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/fine-tuning/" },
            { title: "A Fortunate Universe: Life in a Finely Tuned Cosmos", by: "Geraint F. Lewis and Luke A. Barnes", year: "2016" },
            { title: "The Universe: Past and Present Reflections", by: "Fred Hoyle", year: "1981", url: "https://calteches.library.caltech.edu/527/2/Hoyle.pdf" },
          ],
          children: [
            {
              id: "nat-b-multi",
              side: "skeptic",
              label: "With enough universes, a livable one is no surprise",
              gist: "If there are vast numbers of universes with differing constants, observers can only arise in the rare life-friendly ones, so finding ourselves in one needs no designer.",
              body: [
                "Fine-tuning impresses only if ours is the only draw, and physics itself gives reason to doubt that. Inflation, the leading theory of the universe's first instant, never stops in many versions, spawning endless bubble universes, and string theory allows perhaps 10⁵⁰⁰ settings of the constants ({{susskind}}): a [[multiverse|multiverse]]. Add what {{carter}} named the [[anthropic-principle|anthropic principle]] in 1973: observers can only find themselves where observers can exist. Earth sits in its star's habitable zone among billions of barren planets, and no one needs a designer to explain why we don't live on Venus.",
                "Nor is it a just-so story: in 1987 {{weinberg}} used this reasoning to bound the cosmological constant, implying a small but probably nonzero value, a decade before one was measured. Critics call it the inverse gambler's fallacy, like inferring from one double six that the dice were rolled many times before. But a gambler can see any roll; we can only ever see a winning one, so *this* universe just is whichever one observers find themselves in ({{bostrom}}).",
              ],
              quote: {
                text: "A finite number of particles is only susceptible of finite transpositions: and it must happen, in an eternal duration, that every possible order or position must be tried an infinite number of times.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. VIII (1779)",
              },
              thinkers: ["susskind", "carter", "weinberg", "bostrom", "hume"],
              cedes:
                "I'd concede if cosmology ruled out every mechanism for producing many universes with varied constants.",
              sources: [
                { title: "The Cosmic Landscape", by: "Leonard Susskind", year: "2005" },
                { title: "Anthropic Bias", by: "Nick Bostrom", year: "2002" },
              ],
              children: [
                {
                  id: "nat-b-generator",
                  side: "theist",
                  label: "A universe-making machine would need fine-tuning too",
                  gist: "Whatever produces many universes needs finely set laws of its own, and some multiverse models predict that a typical observer would be a fleeting fluctuation, not an evolved creature in a vast ordered cosmos like ours.",
                  body: [
                    "A [[multiverse|multiverse]] moves the tuning up a level rather than removing it. {{collins}} notes that a universe generator needs specific ingredients (a field to drive inflation, a mechanism to vary the constants, quantum rules, gravity) before it yields even one life-friendly bubble. A machine that turns out good loaves is no argument against a baker.",
                    "And some multiverse models predict the wrong world. Among random fluctuations, a patch ordered enough for one fleeting observer is vastly likelier than a whole ordered cosmos, so momentary [[boltzmann-brain|Boltzmann brains]] should outnumber evolved observers like us. Dyson, Kleban and {{susskind}} raised the problem in 2002 for any universe that lingers forever in a state like ours, and cosmologists treat it as a test models must pass, not a sign of design ({{carroll}}). Still, a multiverse is no free lunch, and {{penrose}}'s orderly beginning is far more order than observers need. {{hacking}} and {{white-roger}} press the gambler's-fallacy charge anyway: many universes make it likelier that some universe is tuned, not that this one is.",
                  ],
                  thinkers: ["collins", "susskind", "carroll", "penrose", "hacking", "white-roger"],
                  cedes:
                    "I'd concede if a multiverse theory arrived with untuned laws, a settled measure, and a prediction that observers like us are typical.",
                  sources: [
                    { title: "The Teleological Argument: An Exploration of the Fine-Tuning of the Universe", by: "Robin Collins, in The Blackwell Companion to Natural Theology", year: "2009" },
                    { title: "Fine-Tuning and Multiple Universes", by: "Roger White, Noûs", year: "2000" },
                    { title: "Why Boltzmann Brains Are Bad", by: "Sean M. Carroll", year: "2017", url: "https://arxiv.org/abs/1702.00850" },
                  ],
                },
              ],
            },
            {
              id: "nat-b-odds",
              side: "skeptic",
              label: "Fine-tuning yields no odds that favor a designer",
              gist: "No one can say how probable a constant is when its possible range is unbounded, we could only ever observe a life-permitting universe, and theism predicts no particular physics, so the numbers never get started.",
              body: [
                "The impressive odds have no denominator. If a constant could in principle take any value without limit, no even spread of probability over that range exists, and every finite window, however generous, gets probability zero; {{mcgrew-timothy|Timothy}} and Lydia McGrew, both Christians, made the point with Eric Vestrup in 2001. {{sober}} adds the [[anthropic-principle|selection effect]], no multiverse needed: we could not have observed a hostile universe, so observing a friendly one tells us nothing. Vary several constants together, as Fred Adams and Victor Stenger did, and much of the tuning loosens.",
                "Then ask what theism predicts. {{carroll}} put it to William Lane Craig in 2014: life needs friendly physics only if nature works alone, since a God could sustain life under any laws at all. A hypothesis that fits any physics whatever is confirmed by none in particular.",
              ],
              thinkers: ["mcgrew-timothy", "sober", "carroll"],
              cedes:
                "I'd concede if the life-permitting ranges could be given a principled probability, and God shown to prefer exactly these laws.",
              sources: [
                { title: "Probabilities and the Fine-Tuning Argument: A Sceptical View", by: "Timothy McGrew, Lydia McGrew and Eric Vestrup, Mind", year: "2001" },
                { title: "The Design Argument", by: "Elliott Sober, in God and Design, ed. Neil Manson", year: "2003" },
              ],
              children: [
                {
                  id: "nat-b-aim",
                  side: "theist",
                  label: "Theism predicts physics like ours, fit for embodied agents",
                  gist: "A good God has reason to make a stable, discoverable world where finite creatures act, learn and matter to one another, and such a world needs physics that permits complex life.",
                  body: [
                    "Theism does predict something. {{swinburne}} argues that a good God has reason to create embodied agents who are responsible for one another, which requires a stable, law-governed physical world rather than a stage of constant wonders. A God could sustain life by perpetual miracle under any laws, but agents need regularities they can learn and use, so physics that permits complex life is just what theism predicts. {{collins}} meets the infinity problem by comparing only the range physicists can actually assess, within which life-permitting values remain a tiny fraction.",
                    "A [[anthropic-principle|selection effect]] explains why we see a friendly universe given that we exist, not why there is one to exist in. {{leslie}}'s firing squad makes the point: fifty marksmen fire and every shot misses. That you would not be wondering otherwise is true and explains nothing; you should suspect the miss was meant.",
                  ],
                  thinkers: ["swinburne", "collins", "leslie"],
                  cedes:
                    "I'd concede if a good God turned out to have no more reason to make embodied, law-bound agents than anything else.",
                  sources: [
                    { title: "The Existence of God", by: "Richard Swinburne", year: "2004 (2nd ed.)" },
                    { title: "Universes", by: "John Leslie", year: "1989" },
                  ],
                  children: [
                    {
                      id: "nat-b-longshot",
                      side: "skeptic",
                      label: "Theism predicts life, not life as a long shot",
                      gist: "A God free to choose any laws could have made life robust, so laws on which life barely squeaks through fit chance at least as well as design, and the odds themselves rest on an arbitrary range.",
                      body: [
                        "The prediction proves too little. {{swinburne}}'s argument needs laws that permit embodied agents, not these laws, on which life squeaks through a narrow gap. A God free to write any physics could have made life robust. {{halvorson}}, a Christian philosopher of physics, presses exactly this: if God wanted life, why choose laws on which it is a long shot? The precariousness that impresses the fine-tuner is, on theism, one more thing to explain.",
                        "Nor do the odds get started. Collins's assessable range is just wherever current physics happens to stop; widen it as physics advances and every window's share, the life-permitting one included, sinks toward zero (Mark Colyvan, Jay Garfield and Graham Priest, 2005). And {{sober}} answers the firing squad head-on: a bystander watching the volley could suspect a fix, but the survivor's evidence is filtered by his survival, as ours is by our existence, so on either hypothesis he observes the same thing.",
                      ],
                      thinkers: ["swinburne", "halvorson", "sober"],
                      cedes:
                        "I'd concede if theism, without hindsight, predicted laws on which life is precarious rather than robust, and the life-permitting range could be fixed without arbitrariness.",
                      see: [{ id: "nat-b-multi", why: "Where a selection effect has many draws to work on." }],
                      sources: [
                        { title: "A Theological Critique of the Fine-Tuning Argument", by: "Hans Halvorson, in Knowledge, Belief, and God (Oxford)", year: "2018" },
                        { title: "Problems with the Argument from Fine Tuning", by: "Mark Colyvan, Jay L. Garfield and Graham Priest, Synthese", year: "2005" },
                        { title: "Absence of Evidence and Evidence of Absence: Evidential Transitivity in Connection with Fossils, Fishing, Fine-Tuning, and Firing Squads", by: "Elliott Sober, Philosophical Studies", year: "2009" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-tuner",
              side: "skeptic",
              label: "A tuner would need explaining as much as the tuning",
              gist: "Explaining an orderly universe by an orderly mind moves the puzzle up a level: a mind able to tune a cosmos holds at least as much order as the cosmos it explains.",
              body: [
                "Grant that the tuning points beyond physics. A mind that surveys every possible universe and picks one contains at least as much order as the universe it explains. {{hume}}'s Philo asked why, if the world's order needs a divine mind, that mind's order needs nothing; and if we stop there, why not stop at the material world? {{dawkins}} recast it in 2006: a designer able to tune a cosmos is no likelier than the cosmos.",
                "So the design inference trades one improbable arrangement for another. The ideas in a designing mind must be arranged as finely as the world they plan, and an ordered mind falling into order by itself is no less a wonder than an ordered world doing so. Either both need a cause, and the regress begins, or neither does, and the world can end the chain as well as its maker.",
              ],
              quote: {
                text: "a mental world, or universe of ideas, requires a cause as much, as does a material world, or universe of objects; and, if similar in its arrangement, must require a similar cause.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. IV (1779)",
              },
              thinkers: ["hume", "dawkins"],
              cedes:
                "I'd concede if a mind able to design a universe could be shown to need less explaining than the universe it designs.",
              see: [{ id: "nat-b-brute", why: "Where the chain may stop instead: the naturalist's brute universe." }],
              sources: [{ title: "Dialogues Concerning Natural Religion, pts. IV–V", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" }],
              children: [
                {
                  id: "nat-b-simple",
                  side: "theist",
                  label: "We can infer a mind unexplained, and a limitless mind is simple",
                  gist: "The best explanation of something need not come with its own explanation, and a single unlimited mind is a simpler hypothesis than a universe of finely balanced parts.",
                  body: [
                    "The regress demand would stop science cold. Archaeologists infer toolmakers from flints with no theory of who made the toolmakers; if a radio telescope caught the first hundred primes, we would infer senders. {{plantinga}} answered {{dawkins}} this way in 2007: an [[inference-to-best-explanation|explanation]] need not come with its own explanation to be the best one.",
                    "Nor is the designer an improbable machine, and theists defend that in two rival ways. {{swinburne}} argues that a person with no limits on power, knowledge or freedom is the simplest kind of being there could be, as zero and infinity need no special explanation where 1.7 does. Followers of Aquinas (Thomists) instead deny that God has parts at all ([[divine-simplicity|divine simplicity]]), so an argument aimed at improbable assemblies misses its target.",
                  ],
                  thinkers: ["plantinga", "dawkins", "swinburne"],
                  cedes:
                    "I'd concede if an unlimited mind turned out to need more explaining than the finite universe it was invoked to explain.",
                  see: [{ id: "coh-a-collapse", why: "The price of divine simplicity, pressed in Objection I." }],
                  sources: [
                    { title: "The Dawkins Confusion: Naturalism ad absurdum", by: "Alvin Plantinga, Books & Culture", year: "2007", url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html" },
                  ],
                  children: [
                    {
                      id: "nat-b-complex",
                      side: "skeptic",
                      label: "An unlimited mind isn't simple, and toolmakers are no analogy",
                      gist: "A mind that knows every truth and weighs every possible world holds at least as much as the world it explains, and we infer toolmakers only because we already know such makers exist.",
                      body: [
                        "Calling an unlimited mind simple is a definition, not a discovery. Jeremy Gwiazda (2009) argued that Swinburne's claim that infinite values are simpler than finite ones does not hold up, and a mind that knows every truth and chooses among all possible universes holds at least as much information as the world it explains: {{dawkins}}'s point, pressed with more care by Herman Philipse (2012) and {{oppy}}. The reply also splices rivals. {{swinburne}}'s God is a person whose thoughts succeed one another in time, not the partless God of classical [[divine-simplicity|divine simplicity]], and that God faces ((coh-a-collapse|modal collapse)) in Objection I.",
                        "Flints and primes work because we already know that toolmakers and radio engineers exist and what they want. {{sober}} points out that we have no such knowledge of a disembodied mind.",
                      ],
                      thinkers: ["dawkins", "oppy", "swinburne", "sober"],
                      cedes:
                        "I'd concede if an all-knowing chooser could be shown simpler than the world it explains, by a measure not tailored to it, and we had some independent grip on what such a mind would want.",
                      see: [{ id: "coh-a-collapse", why: "Why the partless God of classical theism may collapse into Spinoza's necessity." }],
                      sources: [
                        { title: "The God Delusion, ch. 4", by: "Richard Dawkins", year: "2006" },
                        { title: "Richard Swinburne's Argument to the Simplicity of God via the Infinite", by: "Jeremy Gwiazda, Religious Studies", year: "2009" },
                        { title: "God in the Age of Science? A Critique of Religious Reason", by: "Herman Philipse", year: "2012" },
                        { title: "The Design Argument (Cambridge Elements)", by: "Elliott Sober", year: "2019" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-proportion",
              side: "skeptic",
              label: "Tuning shows a tuner, not a good God",
              gist: "From an effect we may infer only a cause sufficient to produce it, so fine-tuning shows at most some designer: not one, not good, not all-powerful, and not interested in us.",
              body: [
                "Grant the tuner; Hume's sharper rule matters more. From an effect we may infer only a cause sufficient to produce it. Tuning shows, at most, a tuner: not one, not good, not all-powerful, not interested in us. For all the argument shows, Philo says, the world might be “the first rude essay of some infant deity.” That is the original form of *God explains nothing extra*.",
                "A committee of designers would explain the tuning as well as one. A designer indifferent to suffering would explain it as well as a loving one, since the same constants that permit life permit cancer and plague. To reach the God of the counter, the argument needs premises the tuning cannot supply.",
              ],
              quote: {
                text: "When we infer any particular cause from an effect, we must proportion the one to the other, and can never be allowed to ascribe to the cause any qualities, but what are exactly sufficient to produce the effect.",
                who: "David Hume, in the voice of Epicurus",
                cite: "An Enquiry concerning Human Understanding XI, §105 (1748)",
              },
              thinkers: ["hume"],
              cedes:
                "I'd concede if the tuning, on its own, pointed to one good and all-powerful designer rather than to any cause able to produce it.",
              see: [{ id: "nat-b-exist", why: "The contingency argument claims to supply what tuning alone cannot: a single, necessary ground." }],
              sources: [{ title: "Dialogues Concerning Natural Religion, pts. V and XI", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" }],
              children: [
                {
                  id: "nat-b-ground",
                  side: "theist",
                  label: "The contingency argument supplies one necessary ground",
                  gist: "Fine-tuning is one strand of a cumulative case, not a stand-alone proof: the contingency argument supplies a single ground that exists of itself, and what exists of itself is unlimited, which is why classical theists call it good.",
                  body: [
                    "Hume's rule bites an argument that stands alone, and the tuning argument does not. It is one strand in a [[cumulative-case|cumulative case]]. The ((nat-b-exist|contingency argument)) supplies what tuning cannot: a ground that exists of itself, not a committee and not an apprentice. Two necessary beings would need something to tell them apart, and whatever differed would be a perfection one had and the other lacked (*Summa Theologiae* I q.11 a.3).",
                    "From necessity, {{aquinas}} argues, comes the rest. What exists by its own nature, rather than by receiving existence, has nothing outside it to cap it, so it lacks no perfection (I q.4 a.2), and goodness is being itself, seen as worth desiring (I q.5 a.1). The tuning then tells us that this unlimited ground made a world fit for life. {{collins}} and {{swinburne}} build the case this way: each argument raises the odds, and together they point to one God, not an infant deity.",
                  ],
                  thinkers: ["aquinas", "collins", "swinburne"],
                  cedes:
                    "I'd concede if a necessary ground could be limited, or many, or indifferent to the good, with no further explanation of why.",
                  see: [{ id: "coh-c-nature", why: "Goodness as what God is, argued in Objection I." }],
                  children: [
                    {
                      id: "nat-b-gap",
                      side: "skeptic",
                      label: "A necessary ground is not thereby a mind, let alone a good one",
                      gist: "Grant the contingency argument and it delivers something that exists of itself, not a chooser or a lover; Spinoza takes that ground to be Nature, and the world it grounds looks indifferent, not good.",
                      body: [
                        "Grant the contingency argument everything it claims, and it delivers a ground that exists of itself, not a character. Nothing in ‘exists by its own nature’ says ‘thinks’, ‘chooses’ or ‘loves’. ((nat-b-necess|Spinoza)) accepts the necessary being and identifies it with Nature itself: one, unlimited, perfect in his sense, and choosing nothing. Aquinas's step from unlimited being to goodness renames being as desirable; it does not show that the ground cares what becomes of us.",
                        "And look at the effect, as Hume's rule says to. Philo surveyed a world where the same laws that permit life permit plague, and drew the conclusion the evidence supports. Tuning plus contingency yields a necessary ground of a world fit for life and for cancer alike. That is Spinoza's God, or no God, not the one the counter needs.",
                      ],
                      quote: {
                        text: "The true conclusion is, that the original Source of all things is entirely indifferent to all these principles; and has no more regard to good above ill, than to heat above cold, or to drought above moisture, or to light above heavy.",
                        who: "Philo, in David Hume's Dialogues",
                        cite: "Dialogues Concerning Natural Religion, pt. XI (1779)",
                      },
                      thinkers: ["spinoza", "hume", "aquinas"],
                      cedes:
                        "I'd concede if being that exists of itself could be shown to be, by that fact alone, a mind that knows and wills the good of its creatures.",
                      see: [
                        { id: "nat-b-necess", why: "Spinoza's necessary being: Nature itself, choosing nothing." },
                        { id: "coh-c-spinoza", why: "Why, for Spinoza, ‘good’ is no property of God." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        /* ── why evolved minds track truth ── */
        {
          id: "nat-b-minds",
          side: "theist",
          label: "Only a God who intends knowers explains why minds track truth",
          gist: "Natural selection rewards behavior that keeps creatures alive, not beliefs that are true, so a materialist who trusts her evolved reason, including her case for materialism, saws off the branch she sits on.",
          body: [
            "Here is one thing unguided nature does not explain: the reliability of the minds doing the explaining. {{plantinga}}'s [[eaan|evolutionary argument against naturalism]] runs like this: selection cares what a creature does, not whether its beliefs are true. Given materialism plus evolution, the chance that our faculties are reliable is low, or impossible even to estimate. Either way the naturalist acquires a [[defeater|defeater]] for every belief her faculties produce, naturalism included. On theism there is no such problem: we were made to know a world made to be known.",
            "{{darwin}} felt the doubt himself, though he aimed it at his own sense that the universe is not the result of chance. {{lewis-cs}} pressed an earlier form, revised after Elizabeth Anscombe's critique in 1948. The target is materialism, nature with no mind in it; how such a nature could produce consciousness at all is the same puzzle one level down. Whether the Spinozist's Nature, which already includes Thought, escapes is ((nat-b-parallel|Spinoza's question)).",
          ],
          quote: {
            text: "But then with me the horrid doubt always arises whether the convictions of man's mind, which has been developed from the mind of the lower animals, are of any value or at all trustworthy. Would any one trust in the convictions of a monkey's mind, if there are any convictions in such a mind?",
            who: "Charles Darwin",
            cite: "Letter to William Graham, 3 July 1881",
          },
          thinkers: ["plantinga", "darwin", "lewis-cs"],
          cedes:
            "I'd concede if evolution were shown to favor true belief as such, about cosmology and logic as much as about food and predators.",
          see: [
            { id: "hid-designed-faculty", why: "The same reasoning in reverse: a natural origin need not make a faculty unreliable." },
            { id: "evi-a-function", why: "Plantinga's proper-function account of warrant, applied to belief in God." },
          ],
          sources: [
            { title: "Where the Conflict Really Lies, ch. 10", by: "Alvin Plantinga", year: "2011" },
            { title: "Letter to William Graham", by: "Charles Darwin", year: "1881", url: "https://www.darwinproject.ac.uk/letter/DCP-LETT-13230.xml" },
          ],
          children: [
            {
              id: "nat-b-adaptive",
              side: "skeptic",
              label: "True beliefs pay: selection favors minds that track truth",
              gist: "Creatures that misjudge food, cliffs and predators die young, and getting the world right is the cheapest general way to act well in it, so evolution gives reason to expect mostly reliable minds.",
              body: [
                "Selection cannot see truth directly, but it sees what truth buys. A gazelle that takes the lion for a bush does not leave many grandchildren. {{quine}} put it drily in 1969: creatures inveterately wrong in their inductions tend, pathetically but praiseworthily, to die before reproducing. Plantinga's own example, a hominid who longs to be eaten by a tiger but runs from each one because he thinks it unlikely to eat him, shows the cost: every false belief needs a matching false desire, rigged case by case, which is far harder to evolve than simply getting things right, as William Ramsey argued in 2002.",
                "{{fitelson}} and {{sober}} add that Plantinga's low probability is unsupported, and that the theist, too, cannot vindicate the reliability of reason without begging the question. And evolution predicts the pattern we actually find: minds good at medium-sized objects and other people, error-prone about probability and the very large and small. That is why we invented science, a method that checks itself.",
              ],
              thinkers: ["quine", "fitelson", "sober"],
              cedes:
                "I'd concede if beliefs could be shown to steer behavior equally well whether true or false across the range of situations animals face.",
              see: [{ id: "hid-csr-both-ways", why: "Debunking by origins, aimed at belief in God instead." }],
              sources: [
                { title: "Plantinga's Probability Arguments Against Evolutionary Naturalism", by: "Branden Fitelson and Elliott Sober, Pacific Philosophical Quarterly", year: "1998" },
                { title: "Naturalism Defeated?", by: "James Beilby (ed.)", year: "2002" },
              ],
              children: [
                {
                  id: "nat-b-content",
                  side: "theist",
                  label: "Selection sees what beliefs do, not whether they're true",
                  gist: "If beliefs are brain states, they move the body through their wiring, not their meaning, so selection can favor useful wiring whether the beliefs it carries are true or false.",
                  body: [
                    "The gazelle story assumes what it needs to prove: that a belief's content is what moves the legs. On materialism a belief is a brain state, and it causes behavior by its neurophysiology. {{plantinga}} splits the options. If content does no causal work, selection is blind to it. If content rides on the neural properties, those properties still do the pushing, and the same adaptive wiring is compatible with any content at all. Either way, being useful does not make a belief true.",
                    "Even if reliability is granted for survival-relevant beliefs, nothing secures it for beliefs about the origin of the universe, the nature of mathematics or the truth of naturalism, which never fed or saved anyone. Those are exactly the beliefs this debate is about. Nor does the theist beg the question in turn: the argument is not that theism proves reason reliable, but that naturalism, by its own account, gives its holder a reason to distrust it, and theism does not.",
                  ],
                  thinkers: ["plantinga"],
                  cedes:
                    "I'd concede if there were a materialist account on which a belief's content, not just its neural shape, is what selection rewards.",
                  see: [{ id: "evi-a-defeaters", why: "Defeaters and basic beliefs: the same machinery in Objection IV." }],
                  children: [
                    {
                      id: "nat-b-teleo",
                      side: "skeptic",
                      label: "A belief's meaning comes from what it evolved to track",
                      gist: "What a brain state means is set by what it evolved to respond to, so selecting the states that steer behavior well is selecting states that are mostly true about what they track.",
                      body: [
                        "Plantinga's picture of content floating free of the causal story is the mistake. On [[teleosemantics|teleosemantics]] ({{millikan}}, 1984; {{papineau}}, 1987; {{dretske}}, 1988), what a brain state represents is fixed by its biological function, what it was selected to indicate. A state that means *lion* means it because it was selected for firing when lions were near. So you cannot hold the wiring fixed and swap in any content you like: content and adaptive role are tied together by what content is.",
                        "Nor are abstract beliefs a separate faculty that selection never touched. The same inference that counts predators and predicts where the herd will go does our arithmetic and physics, and every eclipse forecast to the minute tests that machinery far from home. And {{bergmann}}, himself a Christian, turns Plantinga's own epistemology on him: if belief in God can be [[properly-basic|properly basic]], so can the naturalist's trust in her faculties, held without argument like every reasoner's.",
                      ],
                      thinkers: ["millikan", "papineau", "dretske", "bergmann"],
                      cedes:
                        "I'd concede if teleosemantics failed to fix content for abstract beliefs, the ones about logic, mathematics and metaphysics.",
                      see: [{ id: "evi-a-basic", why: "The basic-belief model the naturalist borrows here." }],
                      sources: [
                        { title: "Teleological Theories of Mental Content", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/content-teleological/" },
                        { title: "Commonsense Naturalism", by: "Michael Bergmann, in Naturalism Defeated?", year: "2002" },
                      ],
                      children: [
                        {
                          id: "nat-b-loose",
                          side: "theist",
                          label: "Selection leaves meaning loose, and basic trust can be defeated",
                          gist: "Selection can't tell a belief about flies from one about small dark moving things, least of all for beliefs about logic or naturalism, and even a basic belief gives way once you learn your faculties may be unreliable.",
                          body: [
                            "Teleosemantics fixes content only as finely as selection can see, and selection is coarse. A frog's tongue-snap was selected because it caught flies, but every fly it caught was also a small dark moving thing, so nothing in its history settles which it means. {{fodor}} pressed this indeterminacy in 1990, and again with Massimo Piattelli-Palmarini in 2010. {{plantinga}} drew the moral in 2011: where content is indeterminate, so is truth, worst of all for beliefs about logic, mathematics and naturalism, which no ancestor's survival ever turned on.",
                            "Bergmann's parity fails too. A [[properly-basic|properly basic]] belief is innocent until proven guilty, not immune to evidence, as Plantinga replied in 2002. Learn that you have swallowed a drug that makes most users' reasoning unreliable, and your trust in that reasoning is defeated, basic or not. The naturalist who accepts evolution has learned something like that about herself, and she cannot argue the [[defeater|defeater]] away without using the very faculties in question.",
                          ],
                          thinkers: ["fodor", "plantinga", "bergmann"],
                          cedes:
                            "I'd concede if selection could be shown to fix determinate content for beliefs about logic and metaphysics, or if learning that one's faculties are probably unreliable left basic trust untouched.",
                          see: [{ id: "evi-a-defeaters", why: "Defeaters for basic beliefs, aimed at belief in God in Objection IV." }],
                          sources: [
                            { title: "A Theory of Content and Other Essays", by: "Jerry A. Fodor", year: "1990" },
                            { title: "Content and Natural Selection", by: "Alvin Plantinga, Philosophy and Phenomenological Research", year: "2011" },
                            { title: "Reply to Beilby's Cohorts", by: "Alvin Plantinga, in Naturalism Defeated?", year: "2002" },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-parallel",
              side: "spinoza",
              label: "Minds track truth because thought and things are one order",
              gist: "Mind and matter are two aspects of one Nature, so the order of ideas matches the order of things, and reason fits the world without anyone designing the fit.",
              body: [
                "Plantinga's argument hits the materialist, not {{spinoza}}. Thought is not something blind matter stumbled into. It is one of Nature's basic aspects, which Spinoza calls attributes; Extension, the aspect under which things are bodies in space, is another, and the order of ideas is the order of things (*Ethics* II P7). Your mind is the idea of your body, the same thing grasped as thought. So reason's [[common-notions|common notions]], ideas of what all bodies share, can only be grasped truly, and knowledge by reason is necessarily true (II P41).",
                "The fit between mind and world is no lucky accident and no designer's gift; it is one reality described twice. The puzzle of how matter could ever feel anything yields the same way: all individual things, Spinoza says, are animated, though in different degrees (II P13 Schol.). {{nagel}}, an atheist, now thinks mind basic to nature too. What would a person add to [[deus-sive-natura|God, or Nature]]? The theist answers elsewhere, with ((nat-b-reasons|free choice)) and ((coh-c-person|a will that binds)); here, nothing is needed.",
              ],
              quote: {
                text: "The order and connection of ideas is the same as the order and connection of things.",
                who: "Spinoza",
                cite: "Ethics II P7 (1677), trans. Elwes",
              },
              thinkers: ["spinoza", "nagel"],
              cedes:
                "I'd concede if an impersonal Nature with the attribute of Thought could be shown unable to ground adequate knowledge in finite minds.",
              see: [
                { id: "coh-a-analogy", why: "The theist's analogy across a gap; for Spinoza our thought is the same kind as God's, a part of it." },
                { id: "coh-a-dogstar", why: "Why Spinoza still denies God an intellect like ours." },
              ],
              sources: [
                { title: "Ethics, pt. II", by: "Benedict de Spinoza, trans. R. H. M. Elwes", year: "1677", url: "https://www.gutenberg.org/ebooks/3800" },
                { title: "Mind and Cosmos", by: "Thomas Nagel", year: "2012" },
              ],
            },
          ],
        },
      ],
    },
  ],

  spinoza: {
    title: "No miracles, no brute facts, and no chooser",
    body: [
      "On miracles {{spinoza}} goes further than Hume. Hume shuts the door for lack of evidence; Spinoza denies there is a door. *Miracle* names an event whose natural cause the witness or the narrator could not explain, so it records the limits of an audience, not an act of God (*Theologico-Political Treatise* ch. 6, 1670). He can grant the theist every well-attested cure in ((nat-a-keener|the healing reports)) and lose nothing. Even a wonder on command, or in answer to prayer, shows what the witnesses expected, not where nature's powers end; to know that, you would need an inventory of them all.",
      "On explanation he changes teams. He holds the principle of sufficient reason without exception (*Ethics* I P11), which puts him with Leibniz and Aquinas against the brute-fact naturalist and closes two of the skeptic's easiest exits: he cannot say with Russell that the universe is just there, and he cannot call life-friendly physics a lucky draw. Of the counter's three puzzles he counts two solved without a person, existence and minds that track truth (II P7), and rejects the third as misframed. Nature aims at nothing, [[final-causes|final causes]] are human inventions, and the constants are not a target someone hit but what Nature necessarily is (I Appendix, I P33).",
      "What he refuses is the step from *God explains nature* to *someone chose nature*. His God has infinite intellect and loves itself with an [[amor-dei-intellectualis|intellectual love]] (V P35–36), but has no will that picks among options (I P32–33). His best ally here is ((nat-b-contrast|the contrastive demand)), pressed today by {{della-rocca}}, a Spinoza scholar; his exposed flank is ((nat-b-tune|the physics)), which so far finds nothing that makes the constants necessary. Every branch ends at Objection I's question: is creation free, or necessary?",
    ],
    quote: {
      text: "So they will pursue their questions from cause to cause, till at last you take refuge in the will of God—in other words, the sanctuary of ignorance.",
      who: "Spinoza",
      cite: "Ethics I, Appendix (1677), trans. Elwes",
    },
  },

  lineage: [
    "m-nat-plato",
    "m-nat-lucretius",
    "m-nat-cicero",
    "m-nat-augustine",
    "m-nat-aquinas",
    "m-nat-ttp",
    "m-nat-leibniz-clarke",
    "m-nat-hume",
    "m-nat-campbell",
    "m-nat-dialogues",
    "m-nat-laplace",
    "m-nat-darwin",
    "m-nat-copleston",
    "m-nat-carter",
    "m-nat-plantinga",
    "m-nat-earman",
  ],

  reading: [
    {
      title: "An Enquiry concerning Human Understanding, sect. X, “Of Miracles”",
      by: "David Hume",
      year: "1748",
      url: "https://www.gutenberg.org/ebooks/9662",
      note: "The classic case against miracle testimony. First published as Philosophical Essays; titled Enquiry from 1758.",
    },
    {
      title: "Hume's Abject Failure: The Argument Against Miracles",
      by: "John Earman",
      year: "2000",
      url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf",
      note: "A non-believer's Bayesian demolition of Hume's maxim. Read with Robert Fogelin's reply, A Defense of Hume on Miracles (2003).",
    },
    {
      title: "The Miracle of Theism",
      by: "J. L. Mackie",
      year: "1982",
      note: "The strongest single-volume atheist audit of miracles, the cosmological argument and design.",
    },
    {
      title: "The Principle of Sufficient Reason: A Reassessment",
      by: "Alexander R. Pruss",
      year: "2006",
      note: "The modern defense of the principle behind the contingency argument.",
    },
    {
      title: "God and Design: The Teleological Argument and Modern Science",
      by: "Neil A. Manson (ed.)",
      year: "2003",
      note: "Fine-tuning argued from both sides: Collins, Leslie and Swinburne against Sober, McGrew and others.",
    },
    {
      title: "Naturalism Defeated? Essays on Plantinga's Evolutionary Argument against Naturalism",
      by: "James Beilby (ed.)",
      year: "2002",
      note: "Plantinga's argument, a dozen critics, and his replies.",
    },
  ],
};

export default nature;
