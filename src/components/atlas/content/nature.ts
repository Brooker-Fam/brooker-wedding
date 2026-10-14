import type { Objection } from "../types";

/* Objection III, Nature.
   Two parts: (A) miracles would break nature's laws, which never break, and
   (B) a God who chooses explains nothing nature can't. Children attack their
   parent. Quotes were checked against public-domain or published texts: Hume's
   Enquiry and Dialogues (Project Gutenberg), Spinoza's TTP and Ethics (Elwes,
   Gutenberg), the English Dominican Summa and Dods's City of God (New Advent),
   Latta's Leibniz (1898), Clarke's 1717 printing of the Leibniz-Clarke papers
   (Newton Project), Campbell's Dissertation (1762 printing), Paley's Natural
   Theology (archive.org scans), Reid's Inquiry (1823 edition, archive.org),
   Lewis's Miracles (1947 edition), Darwin's letter (Darwin Correspondence
   Project), Hoyle's 1981 talk (Caltech E&S), Quine's "Natural Kinds" (1969),
   Plantinga's "The Dawkins Confusion" (Books & Culture), the 1948 Russell-Copleston
   transcript (Seckel's text), and Earman's own text of Hume's Abject Failure.
   Churchland's 1987 line is as Plantinga quotes it. Other modern critics are
   paraphrased. */

const nature: Objection = {
  id: "nature",
  numeral: "III",
  short: "Nature",
  title: "Nature runs on its own",
  objection:
    "Nothing happens outside natural law, and God explains nothing that nature can't explain on its own.",
  counter:
    "Ruling out miracles in advance is circular. Even John Earman, no apologist, argues that Hume's case against miracles fails. And God arguably explains three things that nature alone leaves unexplained: why anything exists, why the constants of physics permit life, and why minds that evolved can track truth (Plantinga).",
  dek:
    "The objection says that nature never breaks its own laws, so miracles either don't happen or can't be believed, and that a God who chooses explains nothing nature can't. {{aquinas}} raised the second point, almost word for word, as an objection to himself in the 1260s, and his reply is still argued over. {{spinoza}} counted mind as part of nature and called nature God, so what he asks both sides is whether anything needs a God who makes choices.",
  question:
    "Is nature the whole story, with no exceptions and nothing left over, or does it point past itself to a God who chooses?",

  prongs: [
    /* ───────────────────────── Part A: miracles ───────────────────────── */
    {
      id: "nat-a",
      side: "skeptic",
      label: "Miracles would break nature's laws, and those laws never break",
      gist: "A miracle would mean nature's order giving way. Everything we have checked says it never does, so a report of one is more likely a mistake.",
      body: [
        "Everything people have checked runs on regular laws. Stones fall and the dead stay dead, and thunder, plague and epilepsy, once read as the direct hand of God, all turned out to have causes inside nature. A [[miracle|miracle]] asks us to set that whole record aside for one event. {{hume}} made the case in 1748: “A miracle is a violation of the laws of nature; and as a firm and unalterable experience has established these laws, the proof against a miracle, from the very nature of the fact, is as entire as any argument from experience can possibly be imagined.”",
        "{{spinoza}} had reached a stronger conclusion in 1670 by arguing from what God is. Nature's laws are God's own decrees, he held, so nothing can happen against them. Hume claims less. He says we could never have good enough reason to believe that a miracle happened.",
      ],
      quote: {
        text: "That no testimony is sufficient to establish a miracle, unless the testimony be of such a kind, that its falsehood would be more miraculous, than the fact, which it endeavours to establish …",
        who: "David Hume",
        cite: "An Enquiry concerning Human Understanding X, §91 (1748)",
      },
      thinkers: ["hume", "spinoza"],
      cedes:
        "This would fall if a miracle claim survived checks on independent witnesses and records made beforehand as strict as a drug trial's.",
      see: [
        { id: "evi-b-prior", why: "The same weighing of odds, applied to the resurrection in Objection IV." },
        { id: "nat-b", why: "The other half of the objection. Even if something odd happened, would God explain it?" },
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
          gist: "Hume says all experience is against miracles, but that is true only if every miracle report is false, which is the question being asked.",
          body: [
            "Hume rests his case on experience showing that nature's laws never break. {{campbell-george}}, a Scottish minister who corresponded with Hume, asked in 1762 whose experience that was. Hume writes that there must be “a uniform experience against every miraculous event, otherwise the event would not merit that appellation.” But a miracle report is itself a report of experience. To call experience uniform, Hume has to set every such report aside first, which means assuming they are all false. Campbell added that most of what we call experience reaches us through other people's testimony.",
            "{{lewis-cs}} made the same charge in 1947. Learned men once dismissed peasants' reports of stones falling from the sky, until a shower of them hit L'Aigle in Normandy in 1803 and the physicist Jean-Baptiste Biot confirmed it. Whether a particular wonder happened is a question for historians, and a rule that throws out the evidence before looking has answered it without asking.",
          ],
          quote: {
            text: "Thus he falls into that parallogism, which is called begging the question. What he gives with one hand, he takes with the other.",
            who: "George Campbell",
            cite: "A Dissertation on Miracles (1762), pt. I, sect. 2",
          },
          thinkers: ["campbell-george", "lewis-cs", "hume"],
          cedes:
            "The circle charge would fail if someone stated the case against miracles without first setting every report aside unexamined.",
          see: [{ id: "evi-a-compelling", why: "Why the Christian case leans on miracle testimony at all." }],
          sources: [
            { title: "A Dissertation on Miracles", by: "George Campbell", year: "1762", url: "https://archive.org/details/dissertationonmi00camp" },
            { title: "Miracles: A Preliminary Study", by: "C. S. Lewis", year: "1947" },
          ],
          children: [
            {
              id: "nat-a-odds",
              side: "skeptic",
              label: "Weighed fairly, testimony never outweighs a law of nature",
              gist: "Hume doesn't assume the reports are false. He weighs them, and the chance that witnesses erred or lied always beats the chance that nature's order failed.",
              body: [
                "The circle charge misreads {{hume}}, who weighs the reports and assumes nothing about them in advance. His test asks which would be the greater wonder, that this testimony is false or that the event happened. Mistakes, wishful thinking and fraud turn up every day, while a dead man rising has never been seen under conditions anyone could check. For Hume, choosing the likelier explanation is what rational belief is: “A wise man, therefore, proportions his belief to the evidence.”",
                "{{fogelin}} reads the essay as one argument, in which Part 1 sets the bar and Part 2 shows that no actual report clears it. {{mackie}} also treats it as a weighing of probabilities. Historians since F. H. Bradley (1874) add that critical history has to presume nature is regular. That rule, explaining events by natural causes whatever one's private beliefs, is called [[methodological-naturalism|methodological naturalism]], and believing historians follow it too.",
              ],
              quote: {
                text: "Thus, suppose, all authors, in all languages, agree, that, from the first of January 1600, there was a total darkness over the whole earth for eight days … it is evident, that our present philosophers, instead of doubting the fact, ought to receive it as certain, and ought to search for the causes whence it might be derived.",
                who: "David Hume",
                cite: "An Enquiry concerning Human Understanding X, §99 (1748)",
              },
              thinkers: ["hume", "fogelin", "mackie"],
              cedes:
                "Hume's side would accept a miracle backed by testimony whose falsehood would be harder to believe than the event itself.",
              see: [{ id: "evi-b-prior", why: "The same argument from how rare such events are, applied to Easter." }],
              sources: [
                { title: "A Defense of Hume on Miracles", by: "Robert J. Fogelin", year: "2003" },
                { title: "The Miracle of Theism", by: "J. L. Mackie", year: "1982" },
              ],
              children: [
                {
                  id: "nat-a-earman",
                  side: "theist",
                  label: "Hume's argument fails, as witnesses can make a miracle credible",
                  gist: "Probability theory shows that enough independent, fairly reliable witnesses can make even a very unlikely event credible, so no rule settles the question before the evidence is in.",
                  body: [
                    "Hume asks us to weigh testimony, and two of his contemporaries, Thomas Bayes and {{price-richard}}, were building the mathematics for weighing it. {{earman}}, a philosopher of science who says that if he needed gods they would be those of Greece and Rome, applied that mathematics to Hume in *Hume's Abject Failure* (2000). Made precise, he concludes, Hume's principles are “either vapid, specious, or at variance with actual scientific practice.”",
                    "The force of testimony comes from independence. One witness may lie or be wrong. Two strangers who never met and who name the same license plate are hard to dismiss, and many witnesses who could not have colluded, each right more often than wrong, can together overcome any [[prior-probability|prior probability]] above zero (how likely the event seemed before anyone testified). {{babbage}} worked the numbers in 1837. So Earman thinks each miracle claim has to be weighed on its own evidence.",
                  ],
                  quote: {
                    text: "Any epistemology that does not allow for the possibility that evidence, whether from eyewitness testimony or from some other source, can establish the credibility of a UFO landing, a walking on water, or a resurrection is inadequate.",
                    who: "John Earman",
                    cite: "Hume's Abject Failure (2000), pt. I",
                  },
                  thinkers: ["earman", "price-richard", "babbage"],
                  cedes:
                    "If no realistic number of independent, minimally reliable witnesses could lift a miracle above even odds, Earman's reply would fail.",
                  see: [
                    { id: "evi-b-cumulative", why: "How likely a resurrection seems beforehand depends on what else we know about God." },
                    { id: "nat-a-circle", why: "The same conclusion by a different route, that no rule may decide in advance." },
                  ],
                  sources: [
                    { title: "Hume's Abject Failure: The Argument Against Miracles", by: "John Earman", year: "2000", url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf" },
                    { title: "Four Dissertations", by: "Richard Price", year: "1767" },
                  ],
                  children: [
                    {
                      id: "nat-a-practice",
                      side: "skeptic",
                      label: "Hume's case stands, since the actual reports fail his test",
                      gist: "Testimony could prove a miracle in principle, but the reports we have come from people who wanted them, grow in the retelling, and fall apart when checked.",
                      body: [
                        "Earman may refute Part 1 of Hume's essay read alone, but Hume's verdict rests on Part 2, as {{fogelin}} argues. Miracle reports come from communities that want them, and each religion's miracles count against its rivals', since “in matters of religion, whatever is different is contrary.” Hume's test case was the cures reported around 1730 at the Paris tomb of the Jansenist deacon François de Pâris. They were sworn to before judges, and Hume's Protestant readers believed them no more than he did.",
                        "{{earman}} ends up near this view, suspecting that religious miracle reports resemble faith healing, where group hysteria ruins the witnesses' reliability. Lourdes has recognized 72 cures since 1858 (the latest in 2025) out of many thousands claimed. The largest trial of prayer for the sick, STEP (2006, 1,802 heart-surgery patients), found no benefit, and patients who knew they were being prayed for did slightly worse.",
                      ],
                      quote: {
                        text: "But I do believe, in a way that I cannot articulate in detail, that these cases are in fact relevantly similar to the case of faith healing where there is a palpable atmosphere of collective hysteria that renders the participants unable to achieve the minimal reliability condition …",
                        who: "John Earman",
                        cite: "Hume's Abject Failure (2000), pt. I",
                      },
                      thinkers: ["hume", "earman", "fogelin"],
                      cedes:
                        "One well-documented healing that held up under independent medical review, with records from before and after and no ordinary explanation, would sink this.",
                      see: [
                        { id: "evi-b-natural", why: "Natural explanations for the Easter experiences, in Objection IV." },
                        { id: "evi-b-prior", why: "How rare such events are, applied to the resurrection." },
                      ],
                      sources: [
                        { title: "Study of the Therapeutic Effects of Intercessory Prayer (STEP)", by: "Herbert Benson et al., American Heart Journal", year: "2006" },
                      ],
                      children: [
                        {
                          id: "nat-a-keener",
                          side: "theist",
                          label: "Some healing reports pass the tests Hume set",
                          gist: "Some recoveries come with medical records and independent witnesses, and Hume's own paragraph shows he refused a resurrection because of the kind of event it was.",
                          body: [
                            "Not every report falls apart. {{keener}}'s *Miracles* (2011, two volumes) gathers healing accounts from four continents, some with before-and-after medical records for conditions that rarely reverse. An uncontrolled study in Mozambique (Candy Gunther Brown and colleagues, 2010) found hearing and sight gains after in-person prayer, enough to justify a proper trial. STEP tested scripted prayers by distant strangers, unlike the healing these reports describe.",
                            "Hume would accept unanimous reports of eight days' darkness, but if every historian agreed that Queen Elizabeth died, lay buried a month and returned to reign, he would call her death a pretense before admitting “so signal a violation of the laws of nature.” The testimony is as good in both cases. The difference, he says, is that nature's decay has parallels in experience and a return from the dead has none, which is ((nat-a-circle|the circle)) again, aimed at the event Christianity rests on.",
                          ],
                          quote: {
                            text: "I must confess that I should be surprised at the concurrence of so many odd circumstances, but should not have the least inclination to believe so miraculous an event.",
                            who: "David Hume",
                            cite: "An Enquiry concerning Human Understanding X, §99 (1748)",
                          },
                          thinkers: ["keener", "hume"],
                          cedes:
                            "If independent physicians examined the best-documented cases and found ordinary explanations or faulty records for every one, this reply would fall.",
                          see: [{ id: "evi-b-minimal", why: "The one miracle claim Christianity stakes itself on." }],
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
          gist: "A law of nature says what happens when nothing outside nature acts, so God acting from outside breaks no law, and no experiment can rule that out.",
          body: [
            "The objection pictures a miracle as nature's order snapping, and Christian tradition never did. {{augustine}} held that a portent goes against nature as we know it, since the Creator's will is the nature of each thing. {{aquinas}} wrote that God, who gives every creature its power, “can do something outside this order created by Him,” producing an effect without its usual cause.",
            "A law of motion says what a system does if nothing outside it interferes. {{lewis-cs}} drew the consequence in 1947: “Miraculous wine will intoxicate, miraculous conception will lead to pregnancy.” Once God feeds an event in, the laws carry it forward. Conservation of energy, {{larmer}} points out, holds only for closed systems, and whether nature is ever open to outside action is the point in dispute. {{plantinga}} adds that no law of physics says the physical world is closed to outside action. That is a philosophical thesis, and physics probably cannot settle it.",
          ],
          quote: {
            text: "For how is that contrary to nature which happens by the will of God, since the will of so mighty a Creator is certainly the nature of each created thing? A portent, therefore, happens not contrary to nature, but contrary to what we know as nature.",
            who: "Augustine",
            cite: "City of God XXI.8 (c. 425), trans. Marcus Dods",
          },
          thinkers: ["augustine", "aquinas", "lewis-cs", "larmer", "plantinga"],
          cedes:
            "If physics itself, with no philosophy added on top, showed the universe to be a closed system that nothing outside could act on, this would fail.",
          see: [
            { id: "coh-a", why: "An intervening God looks like one cause among others, which is the worry of Objection I." },
          ],
          sources: [
            { title: "City of God, bk. XXI", by: "Augustine, trans. Marcus Dods", year: "c. 425", url: "https://www.newadvent.org/fathers/120121.htm" },
            { title: "Summa Theologiae I q.105 a.6", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1105.htm" },
            { title: "The Legitimacy of Miracle", by: "Robert A. Larmer", year: "2014" },
            { title: "Where the Conflict Really Lies: Science, Religion, and Naturalism", by: "Alvin Plantinga", year: "2011" },
          ],
          children: [
            {
              id: "nat-a-closure",
              side: "skeptic",
              label: "Physics can rule it out, since no outside push ever shows up",
              gist: "Whether anything beyond the physical ever pushes on matter is a question evidence can answer, and a century of physics and physiology has looked hard and found nothing.",
              body: [
                "Against Plantinga, {{papineau}} argues that [[causal-closure|causal closure]], the claim that every physical event has a complete physical cause, is a finding of physics. Nineteenth-century science still allowed vital and mental forces acting on matter. Twentieth-century physiology looked for them, cell by cell and nerve by nerve, and found only the familiar physical forces. Energy is conserved only in closed systems, as Larmer says, but every system ever examined, from calorimeters to living cells, behaves as one.",
                "A single act of God, once in history, would slip past any controlled test. But a cause placed only where no one can look can never be tested. {{carroll}} adds that the physics of bodies, brains and wine has been tested at every energy that matters for them. Even {{leibniz}}, who believed in miracles of grace, mocked Newton's God for having to “wind up his Watch from Time to Time.”",
              ],
              quote: {
                text: "And I hold, that when God works Miracles, he does not do it in order to supply the Wants of Nature, but those of Grace. Whoever thinks otherwise, must needs have a very mean Notion of the Wisdom and Power of God.",
                who: "G. W. Leibniz",
                cite: "First paper to Samuel Clarke, §4 (Nov. 1715), trans. Clarke (1717)",
              },
              thinkers: ["papineau", "carroll", "leibniz"],
              cedes:
                "A well-controlled measurement that caught matter in a living body moving in a way the known physical forces can't account for would overturn this.",
              see: [{ id: "coh-a", why: "If God acts through every cause, what work is left for nature? Objection I asks." }],
              sources: [
                { title: "The Rise of Physicalism", by: "David Papineau", year: "2001" },
                { title: "The Laws Underlying the Physics of Everyday Life Are Completely Understood", by: "Sean Carroll", year: "2010" },
                { title: "Physicalism", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/physicalism/" },
                { title: "Mr. Leibnitz's First Paper, in A Collection of Papers … between Mr. Leibnitz and Dr. Clarke", by: "G. W. Leibniz, trans. Samuel Clarke", year: "1717", url: "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00226" },
              ],
            },
            {
              id: "nat-a-power",
              side: "spinoza",
              label: "A God who never competes with nature can't step into it",
              gist: "If nature's laws are God's own decrees, a miracle would set God against himself, and a God who works through every cause has no gap to step into.",
              body: [
                "Lewis pictures God feeding events into nature. {{spinoza}} called this the common error of imagining two powers, God's and nature's, taking turns. For him nature's universal laws are “decrees of God following from the necessity and perfection of the Divine nature.” An event against them would be God acting against himself, and Spinoza saw no difference between going *against* the laws and going *beyond* them. Belief in such an event, he warned, “would throw doubt upon everything, and lead to Atheism.”",
                "The reply to Objection I, drawn from {{tanner}} and {{hart}}, says God grounds every cause without competing with any. If so, God cannot also be one more cause that now and then does what a creature would have done, and that is the role the feeding-in picture gives him. A [[non-competition|non-competing]] God works through nature and never steps in. An intervening God is ((coh-a|one cause among others)) after all.",
              ],
              quote: {
                text: "They suppose, forsooth, that God is inactive so long as nature works in her accustomed order, and vice versa, that the power of nature and natural causes are idle so long as God is acting: thus they imagine two powers distinct one from the other, the power of God and the power of nature …",
                who: "Spinoza",
                cite: "Theologico-Political Treatise, ch. 6 (1670), trans. Elwes",
              },
              thinkers: ["spinoza", "tanner", "hart"],
              cedes:
                "Spinoza would give way if someone described a miracle in which God neither does what a creature would have done nor sets nature's order aside.",
              see: [
                { id: "coh-a-concur", why: "The claim that God never competes with creatures, which this dilemma turns against miracles." },
                { id: "coh-a-collapse", why: "Whether God's decrees could have been otherwise." },
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
                  gist: "God chose nature's order freely, so going beyond it contradicts nothing, and when he heals without medicine he pushes no natural cause aside.",
                  body: [
                    "Spinoza's dilemma has two horns, and {{aquinas}} answered both. God chose this order and could have chosen another, so acting beyond it breaks no decree, because the decree included the exception. Spinoza's move from decree to absurdity works only if God's will is as necessary as geometry, and that is the point argued over in ((coh-a-collapse|Objection I)).",
                    "Aquinas also denied that a miracle is competition. Every creature, he says (*Summa* III q.11 a.1), has an [[obediential-potency|obediential power]], an openness to being raised by God beyond anything a natural agent could do to it. When God heals without medicine, no creature's power is pushed aside. One is left unused. On this view a miracle is like a scene an author adds to his story, with no actor shoved off the stage.",
                  ],
                  quote: {
                    text: "… He is not subject to the order of secondary causes; but, on the contrary, this order is subject to Him, as proceeding from Him, not by a natural necessity, but by the choice of His own will; for He could have created another order of things.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.105 a.6 (trans. English Dominican Province)",
                  },
                  thinkers: ["aquinas", "lewis-cs"],
                  cedes:
                    "If a God whose will could have been otherwise proved incoherent, so that his decrees had to be necessary, this reply would collapse.",
                  see: [
                    { id: "coh-a-concur", why: "The picture of God never competing with creatures, argued in Objection I." },
                    { id: "coh-a-extrinsic", why: "How one necessary act of God can have effects that might not have been." },
                    { id: "nat-b-reasons", why: "The same free-choice reply, made about why there is a world at all." },
                    { id: "nat-b-contrast", why: "Spinoza's answer to free choice. A reason that fits either choice leaves the choice unexplained." },
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

    /* ───────────────────────── Part B: explains nothing extra ───────────────────────── */
    {
      id: "nat-b",
      side: "skeptic",
      label: "God explains nothing that nature can't explain on its own",
      gist: "Science keeps explaining nature by nature, and a God who chooses predicts nothing that nature alone doesn't, so the simpler account leaves him out.",
      body: [
        "{{aquinas}} put this objection to himself around 1265. It rests on [[ockhams-razor|Ockham's razor]], the rule that what a few causes explain shouldn't be credited to more. {{newton}} thought the planets needed God's occasional correction, and {{laplace}} showed their orbits were stable without it. {{paley}} saw a designer in the eye, and {{darwin}} showed how the look of design can arise without one. Each gap once filled by God has so far been closed by nature.",
        "The objector grants that something may underlie everything, and Spinoza called that something God. The target is a God who chooses and acts. Such a God predicts nothing nature does not, so he explains nothing extra. At best he is a [[god-of-the-gaps|God of the gaps]], called in wherever science has no answer yet and retreating each time it finds one.",
      ],
      quote: {
        text: "Further, it is superfluous to suppose that what can be accounted for by a few principles has been produced by many. But it seems that everything we see in the world can be accounted for by other principles, supposing God did not exist.",
        who: "Thomas Aquinas, stating the objection",
        cite: "Summa Theologiae I q.2 a.3, obj. 2 (trans. English Dominican Province)",
      },
      thinkers: ["aquinas", "ockham", "newton", "laplace", "paley", "darwin"],
      cedes:
        "If a God who chooses predicted some well-defined fact that nature alone did not, and the fact were then observed, this would fall.",
      see: [
        { id: "hid-hart-light", why: "The first answer from Aquinas's tradition, that God is no hypothesis inside the world." },
        { id: "coh-a-concur", why: "If God never competes with nature, what does he add?" },
      ],
      sources: [
        { title: "Summa Theologiae I q.2 a.3", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1002.htm" },
      ],
      children: [
        /* ── why anything exists ── */
        {
          id: "nat-b-exist",
          side: "theist",
          label: "Why anything exists needs an explanation nature can't give",
          gist: "Science explains each moment of the world by the one before, but never why there is a world at all, and only something that has to exist can answer that.",
          body: [
            "Ockham's razor only chooses between explanations of the same thing. Physics explains how one state of the world leads to the next, and it cannot say why there is a world with laws to describe. {{leibniz}} called this the first question. Every star, law and quantum field might never have existed, which makes them contingent, and the reason for the whole series of contingent things, Leibniz argued, cannot lie inside the series.",
            "Aquinas's reply to the objection says that “all things that are changeable and capable of defect must be traced back to an immovable and self-necessary first principle.” This is the [[contingency-argument|contingency argument]], restated in modern form by {{pruss}}. It differs from the [[kalam|kalam argument]] that the universe had a beginning, which Aquinas held reason cannot prove. Lawrence Krauss's *A Universe from Nothing* (2012) is no rival either, since a quantum vacuum governed by laws is something, as the philosopher of physics David Albert said in reviewing it.",
          ],
          quote: {
            text: "This principle being laid down, the first question we are entitled to put will be — Why does something exist rather than nothing? For ‘nothing’ is simpler and easier than ‘something.’",
            who: "G. W. Leibniz",
            cite: "Principles of Nature and of Grace §7 (written 1714), trans. Robert Latta",
          },
          thinkers: ["leibniz", "aquinas", "pruss"],
          cedes:
            "If a whole made of contingent things needed no explanation beyond its parts, the argument would fail.",
          see: [{ id: "coh-a-concur", why: "Why a source of all being is no cause among others, the reply in Objection I." }],
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
                "{{spinoza}} accepted the contingency argument's question and rejected its answer. He held the [[psr|principle of sufficient reason]], that everything has a reason, with no exceptions: “Of everything whatsoever a cause or reason must be assigned, either for its existence, or for its non-existence” (*Ethics* I P11). But what depends on nothing else, which he calls substance, exists by its own nature as [[causa-sui|cause of itself]], and there is only one, God or Nature, with nothing outside it. Even {{hume}}'s Cleanthes asked why the material universe might not be the necessary being.",
                "The principle also proves more than Aquinas wanted. If the reason for this world lies in God's nature, the world follows necessarily: “Nothing in the universe is contingent” (I P29). That view, that nothing could have been otherwise, is [[necessitarianism|necessitarianism]]. {{van-inwagen}}, a Christian, showed that the strong principle implies it, and gave up the principle. {{della-rocca}} accepts both, as Spinoza did, and on their view the source of everything chose nothing.",
              ],
              quote: {
                text: "Existence belongs to the nature of substances.",
                who: "Spinoza",
                cite: "Ethics I P7 (1677), trans. Elwes",
              },
              thinkers: ["spinoza", "hume", "van-inwagen", "della-rocca"],
              cedes:
                "A contingent world with a sufficient reason that does not make it necessary would answer Spinoza here.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's God thinks but does not choose, argued in Objection I." },
                { id: "coh-a-collapse", why: "The same necessity, aimed at the God of Aquinas, who has no parts." },
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
                    "Spinoza's step from sufficient reason to necessity runs together two kinds of explanation. A reason can explain a choice without forcing it. You took the job because it paid better, though you could have stayed. {{aquinas}} says God wills his own goodness necessarily and wills creatures freely, since that goodness lacks nothing without them. {{pruss}} and {{oconnor-timothy}} defend a version of the principle built for this case, on which a free act done for a purpose explains a fact that could have been otherwise. If nothing could have been otherwise, then this cough and this war were as necessary as two plus two, and {{van-inwagen}} took that as proof that the strong principle is false. A freely chosen creation keeps both claims, that everything has a reason and that not everything had to be.",
                  ],
                  quote: {
                    text: "The will of God is reasonable, not because anything is to God a cause of willing, but in so far as He wills one thing to be on account of another.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.5 ad 1 (trans. English Dominican Province)",
                  },
                  thinkers: ["aquinas", "pruss", "oconnor-timothy", "van-inwagen"],
                  cedes:
                    "If reasons that leave a choice open turned out to explain nothing about why it went the way it did, this would fail.",
                  see: [
                    { id: "coh-a-extrinsic", why: "Objection I's model, one necessary act of God whose effects could have been otherwise." },
                    { id: "coh-c-natlaw", why: "The same answer, that reasons fit a choice without forcing it, given for God's commands in Objection I." },
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
                      gist: "If the same reasons would have explained God making a different world or none, nothing explains why this one exists, and the unexplained fact is back.",
                      body: [
                        "Reasons that would have served equally well for the opposite choice can't explain why the choice went this way. Asked why this world exists and not another or none, the free-choice view ends with “God chose to.” That is a [[brute-fact|brute fact]], a fact with no explanation, dressed up as one. In the job example your character settles your choice, and nothing settles God's. {{spinoza}} demanded reasons without exception (*Ethics* I P11), and {{della-rocca}} makes the same [[contrastive-explanation|contrastive]] demand, asking why this and not the alternatives.",
                        "{{leibniz}} said God chooses the best because reasons incline him without forcing him, and {{rowe}} argued that this fails. If there is a best world, a perfectly good God cannot fail to make it, and creation is necessary after all. If every world has a better one, God's goodness settles nothing and the brute fact returns.",
                      ],
                      quote: {
                        text: "And that of sufficient reason, in virtue of which we hold that there can be no fact real or existing, no statement true, unless there be a sufficient reason, why it should be so and not otherwise, although these reasons usually cannot be known by us.",
                        who: "G. W. Leibniz",
                        cite: "Monadology §32 (1714), trans. Robert Latta",
                      },
                      thinkers: ["leibniz", "spinoza", "della-rocca", "rowe"],
                      cedes:
                        "Spinoza would yield if reasons could settle God's choice without either a best world that binds him or a tie that leaves the choice unexplained.",
                      see: [
                        { id: "coh-a-extrinsic", why: "The model this dilemma targets in Objection I, one act that is the same in every possible world." },
                        { id: "nat-b-brute", why: "The brute fact the contingency argument set out to avoid." },
                        { id: "coh-c-brute", why: "Objection I, where believers accept a stopping point too." },
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
              label: "The universe may exist with no reason at all",
              gist: "Every explanation stops somewhere. Believers stop at God, skeptics at the universe or its first state, and nothing shows the skeptic's stopping point is worse.",
              body: [
                "The contingency argument assumes what it needs to prove, that every contingent thing has an explanation. {{hume}}'s Cleanthes says that once each of twenty particles is explained, it is unreasonable to ask what caused the twenty. Debating the Jesuit Frederick Copleston on BBC radio in 1948, {{russell}} said: “I should say that the universe is just there, and that's all.” Every man has a mother, he added, and the human race does not. {{kant}} held that the rule that every event has a cause works inside experience and can't be stretched to the whole world.",
                "{{oppy}} argues that the two sides are on a par. Whatever the believer says of God, necessary or unexplained, the skeptic can say of the universe's first state, with one kind of thing fewer. Quantum events already happen with probabilities and no sufficient reason. On this view every account has a [[brute-fact|brute fact]] at the bottom.",
              ],
              quote: {
                text: "But the whole, you say, wants a cause. I answer, that the uniting of these parts into a whole … is performed merely by an arbitrary act of the mind, and has no influence on the nature of things.",
                who: "Cleanthes, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. IX (1779)",
              },
              thinkers: ["hume", "russell", "kant", "oppy"],
              cedes:
                "Showing that denying a reason for the universe undercuts the reasons I rely on everywhere else would change my mind.",
              see: [
                { id: "evi-a-parity", why: "The same parity argument, that every worldview starts from something unexplained." },
                { id: "coh-c-brute", why: "The same move in ethics, unexplained moral facts against God as the stopping point." },
              ],
              sources: [
                { title: "Dialogues Concerning Natural Religion", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" },
                { title: "The Existence of God: A Debate (BBC Third Programme, 1948)", by: "Bertrand Russell and F. C. Copleston", year: "1948" },
                { title: "Arguing about Gods", by: "Graham Oppy", year: "2006" },
              ],
              children: [
                {
                  id: "nat-b-psr",
                  side: "theist",
                  label: "If the universe needs no reason, nothing does",
                  gist: "If a whole universe can exist for no reason, anything could, and science would lose the expectation of reasons it relies on every day.",
                  body: [
                    "If a universe can exist for no reason, so could a brick in your kitchen. {{pruss}} argues that the brute-fact view leaves no way to call such events improbable, since probabilities come from the laws and causes it says can be missing. Cleanthes's twenty particles miss the point, because all the contingent facts taken together make one big fact that could have been otherwise, and no part explains why the whole holds ({{rowe}}; Pruss).",
                    "Oppy's parity fails, because God is proposed as something that has to exist, and a heap of contingent parts is a poor candidate. Quantum chance is no counterexample, since laws and states fix the odds of a decay. Believers who stop at a free agent ((nat-b-reasons|have to defend that stop)) too, since {{della-rocca}} follows the principle past God into necessity.",
                  ],
                  quote: {
                    text: "What was it, then, which determined Something to exist rather than Nothing, and bestowed being on a particular possibility, exclusive of the rest? External causes, there are supposed to be none. Chance is a word without a meaning. Was it Nothing? But that can never produce any thing.",
                    who: "Demea, in David Hume's Dialogues",
                    cite: "Dialogues Concerning Natural Religion, pt. IX (1779)",
                  },
                  thinkers: ["pruss", "rowe", "della-rocca"],
                  cedes:
                    "A principled line showing where things may go unexplained, drawn somewhere other than where the argument for God begins, would defeat this.",
                  see: [
                    { id: "nat-b-contrast", why: "A free choice by God faces the same charge of being unexplained." },
                    { id: "coh-c-terminus", why: "In ethics, believers accept a stopping point of their own." },
                  ],
                  sources: [
                    { title: "The Principle of Sufficient Reason: A Reassessment", by: "Alexander R. Pruss", year: "2006" },
                    { title: "The Cosmological Argument", by: "William L. Rowe", year: "1975" },
                    { title: "Dialogues Concerning Natural Religion, pt. IX", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" },
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
          label: "Physics tuned for life is evidence of God",
          gist: "Change the numbers of physics slightly and there would be no stars, chemistry or life, which is far less surprising if God intended life than if it came by chance.",
          body: [
            "Even if nature explains what happens inside it, its own settings still need explaining. Small changes to gravity, the strong force or the electron's mass would leave no long-lived stars and no chemistry for life. {{rees}} lists six numbers that must fall in narrow windows. The energy of empty space sits some 120 powers of ten below a naive quantum estimate, and a much larger value would have torn space apart before galaxies formed.",
            "{{penrose}} put the odds of so orderly a beginning at one in 10 to the power of 10¹²³. {{hoyle}}, no conventional believer, found the energy levels of carbon and oxygen nuclei (7.65 and 7.12 million electron volts) where a designer would need them.",
            "{{collins}} argues that [[fine-tuning|values like these]] are far likelier if God exists, and {{barnes}}, an astrophysicist, defends the physics against its critics.",
          ],
          quote: {
            text: "A common sense interpretation of the facts suggests that a superintellect has monkeyed with physics, as well as with chemistry and biology, and that there are no blind forces worth speaking about in nature.",
            who: "Fred Hoyle",
            cite: "“The Universe: Past and Present Reflections,” Engineering & Science (Caltech), Nov. 1981",
          },
          thinkers: ["rees", "penrose", "hoyle", "collins", "barnes"],
          cedes:
            "A deeper theory that showed life possible across most of the constants' range, or derived their values from principles that make life unremarkable, would undo this.",
          see: [{ id: "nat-b-necess", why: "Spinoza's answer, that nothing could have been otherwise, so the constants are no target anyone aimed at." }],
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
              gist: "If there are huge numbers of universes with different constants, observers can only arise in the rare life-friendly ones, so finding ourselves in one needs no designer.",
              body: [
                "Fine-tuning impresses only if ours is the only universe, and physics gives reason to doubt that. Many versions of inflation (a theory of the first instant) never stop producing bubble universes, and string theory allows perhaps 10⁵⁰⁰ settings of the constants ({{susskind}}), so there may be a [[multiverse|multiverse]]. {{carter}}'s [[anthropic-principle|anthropic principle]] (1973) adds that observers can only find themselves where observers can exist. Among billions of barren planets, no one needs a designer to explain why we live on Earth and not Venus.",
                "In 1987 {{weinberg}} used it to predict a small, probably nonzero cosmological constant, a decade before one was measured. Critics call it the inverse gambler's fallacy, like concluding from one double six that the dice had been rolled many times. {{bostrom}} replies that a gambler could see any roll, while we could only see a winning one.",
              ],
              quote: {
                text: "A finite number of particles is only susceptible of finite transpositions: and it must happen, in an eternal duration, that every possible order or position must be tried an infinite number of times.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. VIII (1779)",
              },
              thinkers: ["susskind", "carter", "weinberg", "bostrom", "hume"],
              cedes:
                "If cosmology ruled out every way of producing many universes with varied constants, this reply would fail.",
              sources: [
                { title: "The Cosmic Landscape", by: "Leonard Susskind", year: "2005" },
                { title: "Anthropic Bias", by: "Nick Bostrom", year: "2002" },
              ],
              children: [
                {
                  id: "nat-b-generator",
                  side: "theist",
                  label: "A universe-making machine would need fine-tuning too",
                  gist: "Whatever produces many universes needs finely set laws of its own, and some multiverse models predict that a typical observer would be a brief fluke, unlike us.",
                  body: [
                    "A [[multiverse|multiverse]] moves the tuning up a level. {{collins}} notes that a universe generator needs ingredients (a field to drive inflation, a way to vary the constants, quantum rules and gravity) to yield one life-friendly bubble. {{paley}} imagined in 1802 a watch that could make “another watch like itself,” and said this should raise our opinion of its maker.",
                    "Some models also predict the wrong world. Random fluctuations should produce lone, brief minds, called [[boltzmann-brain|Boltzmann brains]], far more often than whole ordered worlds, so they should outnumber evolved observers like us. {{susskind}}'s group raised this in 2002, and {{carroll}}, who sees no design in it, treats it as a test models must pass.",
                    "{{penrose}}'s orderly beginning is also far more order than observers need. {{hacking}} and {{white-roger}} add that many universes make a tuned one likelier somewhere and do nothing for this one.",
                  ],
                  quote: {
                    text: "The first effect would be to increase his admiration of the contrivance, and his conviction of the consummate skill of the contriver.",
                    who: "William Paley",
                    cite: "Natural Theology, ch. 2 (1802)",
                  },
                  thinkers: ["collins", "paley", "susskind", "carroll", "penrose", "hacking", "white-roger"],
                  cedes:
                    "A multiverse theory with untuned laws, a settled way of counting universes, and a prediction that observers like us are typical would answer this.",
                  sources: [
                    { title: "The Teleological Argument: An Exploration of the Fine-Tuning of the Universe", by: "Robin Collins, in The Blackwell Companion to Natural Theology", year: "2009" },
                    { title: "Fine-Tuning and Multiple Universes", by: "Roger White, Noûs", year: "2000" },
                    { title: "Why Boltzmann Brains Are Bad", by: "Sean M. Carroll", year: "2017", url: "https://arxiv.org/abs/1702.00850" },
                    { title: "Natural Theology, ch. 2, in The Works of William Paley", by: "William Paley", year: "1802", url: "https://archive.org/details/worksofwilliampa00pale" },
                  ],
                },
              ],
            },
            {
              id: "nat-b-odds",
              side: "skeptic",
              label: "Fine-tuning yields no odds that favor a designer",
              gist: "No one can give odds for a constant whose range has no limit, we could only ever observe a livable universe, and a God could use any physics.",
              body: [
                "The impressive odds have nothing to divide by. If a constant could take any value without limit, there is no way to spread probability evenly over that range, and every finite window gets probability zero. {{mcgrew-timothy|Timothy}} and Lydia McGrew, both Christians, made this point with Eric Vestrup in 2001. {{sober}} adds a [[anthropic-principle|selection effect]] that needs no multiverse, since we could not have observed a hostile universe and so learn little from observing a friendly one. When Fred Adams and Victor Stenger varied several constants together, much of the tuning loosened.",
                "{{carroll}} told William Lane Craig in a 2014 debate that belief in God predicts no particular physics. Life needs friendly physics only if nature works alone, since a God could keep creatures alive under any laws, and a hypothesis that fits any physics is confirmed by none in particular.",
              ],
              quote: {
                text: "But how this argument can have place, where the objects, as in the present case, are single, individual, without parallel, or specific resemblance, may be difficult to explain.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. II (1779)",
              },
              thinkers: ["mcgrew-timothy", "sober", "carroll"],
              cedes:
                "If the life-permitting ranges could be given a principled probability, and God shown to prefer these laws in particular, the argument would get its odds.",
              sources: [
                { title: "Probabilities and the Fine-Tuning Argument: A Sceptical View", by: "Timothy McGrew, Lydia McGrew and Eric Vestrup, Mind", year: "2001" },
                { title: "The Design Argument", by: "Elliott Sober, in God and Design, ed. Neil Manson", year: "2003" },
                { title: "Dialogues Concerning Natural Religion, pt. II", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" },
              ],
              children: [
                {
                  id: "nat-b-aim",
                  side: "theist",
                  label: "God would make physics like ours, fit for creatures who act",
                  gist: "A good God has reason to make a stable world where creatures can act, learn and matter to each other, and that needs physics that permits complex life.",
                  body: [
                    "Against Carroll, {{swinburne}} argues that a good God has reason to create creatures with bodies who are responsible for one another, which requires a stable world run by laws. God could keep life going by constant miracles under any laws, but creatures who act need regularities they can learn, so physics that permits complex life is what we should expect. {{collins}} answers the infinity problem by comparing only the range physicists can assess, where life-permitting values are a tiny fraction.",
                    "A [[anthropic-principle|selection effect]] explains why we see a friendly universe given that we exist, and leaves open why there is one to exist in. {{leslie}} tells of fifty marksmen who fire at a condemned man and all miss. That he would not be wondering otherwise is true and explains nothing, and he should suspect the miss was meant.",
                  ],
                  quote: {
                    text: "… He governs things inferior by superior, not on account of any defect in His power, but by reason of the abundance of His goodness; so that the dignity of causality is imparted even to creatures.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.22 a.3 (trans. English Dominican Province)",
                  },
                  thinkers: ["swinburne", "collins", "leslie", "aquinas"],
                  cedes:
                    "If a good God turned out to have no more reason to make law-bound creatures with bodies than anything else, this would fall.",
                  sources: [
                    { title: "The Existence of God", by: "Richard Swinburne", year: "2004 (2nd ed.)" },
                    { title: "Universes", by: "John Leslie", year: "1989" },
                    { title: "Summa Theologiae I q.22 a.3", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1022.htm" },
                  ],
                  children: [
                    {
                      id: "nat-b-longshot",
                      side: "skeptic",
                      label: "A God who wanted life wouldn't make it a long shot",
                      gist: "A God free to choose any laws could have made life easy, so laws on which life barely squeaks through fit chance at least as well as design.",
                      body: [
                        "Swinburne's argument needs laws that permit creatures with bodies. It doesn't need these laws, on which life squeaks through a narrow gap, and a God free to write any physics could have given life a wide margin. {{halvorson}}, a Christian philosopher of physics, asks why God, if he wanted life, would choose laws on which it is a long shot. If God exists, the precariousness that impresses the fine-tuner is one more thing to explain.",
                        "Collins's range ends wherever current physics happens to stop, and as it widens, every window's share sinks toward zero (Mark Colyvan, Jay Garfield and Graham Priest, 2005). {{sober}} answers the firing squad too. A bystander could suspect a fix, but the survivor's evidence is filtered by his survival, as ours is by our existence, so he would see the same thing on either hypothesis.",
                      ],
                      quote: {
                        text: "The Author of Nature is inconceivably powerful: his force is supposed great, if not altogether inexhaustible: nor is there any reason, as far as we can judge, to make him observe this strict frugality in his dealings with his creatures.",
                        who: "Philo, in David Hume's Dialogues",
                        cite: "Dialogues Concerning Natural Religion, pt. XI (1779)",
                      },
                      thinkers: ["swinburne", "halvorson", "sober"],
                      cedes:
                        "If belief in God, without hindsight, predicted laws on which life is precarious, and the life-permitting range could be fixed without arbitrariness, I would drop this.",
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
              gist: "Explaining an orderly universe by an orderly mind moves the puzzle up a level, since a mind able to tune a cosmos holds as much order as the cosmos.",
              body: [
                "Even if the tuning points beyond physics, a mind that surveys every possible universe and picks one contains at least as much order as the universe it explains. {{hume}}'s Philo asked why, if the world's order needs a divine mind, that mind's order needs nothing: “But if we stop, and go no further; why go so far? why not stop at the material world?” {{dawkins}} made the same point in 2006, arguing that a designer able to tune a cosmos is no likelier than the cosmos. The ideas in a designing mind must be arranged as finely as the world they plan, and an ordered mind falling into order by itself is as much a wonder as an ordered world doing so. Either both need a cause, and the regress begins, or neither does, and the world can end the chain as well as its maker can.",
              ],
              quote: {
                text: "a mental world, or universe of ideas, requires a cause as much, as does a material world, or universe of objects; and, if similar in its arrangement, must require a similar cause.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. IV (1779)",
              },
              thinkers: ["hume", "dawkins"],
              cedes:
                "If a mind able to design a universe needed less explaining than the universe it designs, this objection would fail.",
              see: [{ id: "nat-b-brute", why: "Where the chain might stop instead, at a universe with no further explanation." }],
              sources: [{ title: "Dialogues Concerning Natural Religion, pts. IV–V", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" }],
              children: [
                {
                  id: "nat-b-simple",
                  side: "theist",
                  label: "We can infer a mind unexplained, and a limitless mind is simple",
                  gist: "The best explanation of something need not come with its own explanation, and a single unlimited mind is simpler than a universe of finely balanced parts.",
                  body: [
                    "Philo's demand for an explanation of every explanation would stop science cold. Archaeologists infer toolmakers from flints with no theory of who made the toolmakers. If a radio telescope picked up the first hundred prime numbers, we would infer senders. {{plantinga}} answered {{dawkins}} this way in 2007, with explorers who find tractors on an alien planet. An [[inference-to-best-explanation|explanation]] can be the best one without an explanation of its own.",
                    "Believers defend God's simplicity in two rival ways. {{swinburne}} argues that a person with no limits on power, knowledge or freedom is the simplest kind of being there could be, much as zero and infinity need no special explanation and 1.7 does. Followers of Aquinas, called Thomists, deny that God has parts, the doctrine of [[divine-simplicity|divine simplicity]]. Aquinas concluded that God “is nowise composite, but is altogether simple,” so an argument aimed at improbable assemblies misses him.",
                  ],
                  quote: {
                    text: "For of course it is perfectly sensible, in that context, to explain the existence of those tractors in terms of intelligent life, even though (as we can concede for the moment) that intelligent life would have to be at least as complex as the tractors.",
                    who: "Alvin Plantinga",
                    cite: "“The Dawkins Confusion,” Books & Culture, March/April 2007",
                  },
                  thinkers: ["plantinga", "dawkins", "swinburne", "aquinas"],
                  cedes:
                    "If an unlimited mind turned out to need more explaining than the finite universe it was invoked to explain, this would fall.",
                  see: [{ id: "coh-a-collapse", why: "The trouble divine simplicity runs into, argued in Objection I." }],
                  sources: [
                    { title: "The Dawkins Confusion: Naturalism ad absurdum", by: "Alvin Plantinga, Books & Culture", year: "2007", url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html" },
                    { title: "Summa Theologiae I q.3 a.7", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1003.htm" },
                  ],
                  children: [
                    {
                      id: "nat-b-complex",
                      side: "skeptic",
                      label: "An unlimited mind isn't simple, and toolmakers are no analogy",
                      gist: "A mind that knows every truth holds at least as much as the world it explains, and we infer toolmakers only because we already know toolmakers exist.",
                      body: [
                        "Against {{swinburne}}, Jeremy Gwiazda (2009) argued that the case for infinite values being simpler than finite ones does not hold up. A mind that knows every truth and chooses among all possible universes holds at least as much information as the world it explains, which was {{dawkins}}'s point, argued more carefully by Herman Philipse (2012) and {{oppy}}. The reply also mixes rival views, since Swinburne's God is a person whose thoughts follow one another in time, while the God of [[divine-simplicity|divine simplicity]] has no parts and faces ((coh-a-collapse|the charge in Objection I)) that nothing could have been otherwise.",
                        "Flints and primes work as evidence because we already know that toolmakers and radio engineers exist and what they want. {{sober}} points out that we have no such knowledge of a mind without a body.",
                      ],
                      quote: {
                        text: "The Deity is known to us only by his productions, and is a single being in the universe, not comprehended under any species or genus, from whose experienced attributes or qualities, we can, by analogy, infer any attribute or quality in him.",
                        who: "David Hume, through his skeptical friend",
                        cite: "An Enquiry concerning Human Understanding XI, §113 (1748)",
                      },
                      thinkers: ["dawkins", "oppy", "swinburne", "sober"],
                      cedes:
                        "An all-knowing chooser shown to be simpler than the world it explains, by a measure not tailored to it, along with some independent idea of what such a mind would want, would answer both points.",
                      see: [{ id: "coh-a-collapse", why: "Why a God without parts may end up with Spinoza's necessity." }],
                      sources: [
                        { title: "The God Delusion, ch. 4", by: "Richard Dawkins", year: "2006" },
                        { title: "Richard Swinburne's Argument to the Simplicity of God via the Infinite", by: "Jeremy Gwiazda, Religious Studies", year: "2009" },
                        { title: "God in the Age of Science? A Critique of Religious Reason", by: "Herman Philipse", year: "2012" },
                        { title: "The Design Argument (Cambridge Elements)", by: "Elliott Sober", year: "2019" },
                        { title: "An Enquiry concerning Human Understanding, sect. XI", by: "David Hume", year: "1748", url: "https://www.gutenberg.org/ebooks/9662" },
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
              gist: "We may infer only a cause able to produce the effect, so fine-tuning shows some designer and says nothing about whether it is one, good or interested in us.",
              body: [
                "Even granting a tuner, Hume's rule about causes does more damage. From an effect we may infer only a cause able to produce it, so tuning shows a tuner at most. It does not show one tuner, or a good or all-powerful one, or one that cares about us. For all the argument shows, Philo says, the world might be “the first rude essay of some infant deity.” A committee of designers would explain the tuning as well as one. A designer indifferent to suffering would explain it as well as a loving one, since the same constants that permit life permit cancer and plague. To reach the God of the Christian creeds, the argument needs premises the tuning cannot supply.",
              ],
              quote: {
                text: "When we infer any particular cause from an effect, we must proportion the one to the other, and can never be allowed to ascribe to the cause any qualities, but what are exactly sufficient to produce the effect.",
                who: "David Hume, in the voice of Epicurus",
                cite: "An Enquiry concerning Human Understanding XI, §105 (1748)",
              },
              thinkers: ["hume"],
              cedes:
                "If the tuning, taken alone, pointed to one good and all-powerful designer and away from any other cause able to produce it, Hume's rule would be met.",
              see: [{ id: "nat-b-exist", why: "The contingency argument claims to supply what tuning can't, a single source that has to exist." }],
              sources: [{ title: "Dialogues Concerning Natural Religion, pts. V and XI", by: "David Hume", year: "1779", url: "https://www.gutenberg.org/ebooks/4583" }],
              children: [
                {
                  id: "nat-b-ground",
                  side: "theist",
                  label: "The contingency argument shows one source, and it is good",
                  gist: "Fine-tuning is one strand of a larger case, and the contingency argument adds a single source that exists of itself, lacks nothing, and so is good.",
                  body: [
                    "Hume's rule bites an argument that stands alone, and the tuning argument is one strand of a [[cumulative-case|cumulative case]], several arguments that together raise the odds. The ((nat-b-exist|contingency argument)) supplies what tuning cannot, a source that exists of itself. {{aquinas}} argued that there can be only one such source (*Summa Theologiae* I q.11 a.3).",
                    "The rest, Aquinas argues, follows from necessity. What exists by its own nature, without receiving existence from anything, has nothing outside it to limit it: “Since therefore God is subsisting being itself, nothing of the perfection of being can be wanting to Him” (I q.4 a.2). Goodness, for Aquinas, is being considered as worth desiring (I q.5 a.1). The tuning then tells us that this unlimited source made a world fit for life. {{collins}} and {{swinburne}} build the case this way, so that the arguments together point to one God.",
                  ],
                  quote: {
                    text: "If then many gods existed, they would necessarily differ from each other. Something therefore would belong to one which did not belong to another. And if this were a privation, one of them would not be absolutely perfect; but if a perfection, one of them would be without it.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.11 a.3 (trans. English Dominican Province)",
                  },
                  thinkers: ["aquinas", "collins", "swinburne"],
                  cedes:
                    "A necessary source that could be limited, or many, or indifferent to the good, with no further explanation of why, would defeat this.",
                  see: [{ id: "coh-c-nature", why: "Goodness as what God is, argued in Objection I." }],
                  sources: [
                    { title: "Summa Theologiae I q.11 a.3", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1011.htm" },
                    { title: "Summa Theologiae I q.4 a.2", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1004.htm" },
                  ],
                  children: [
                    {
                      id: "nat-b-gap",
                      side: "skeptic",
                      label: "Something that has to exist need not be a mind, or good",
                      gist: "Grant the contingency argument and it gives something that exists of itself, with no sign that it chooses or loves, and the world it grounds looks indifferent.",
                      body: [
                        "Even if the contingency argument works, it delivers a source that exists of itself and says nothing about its character. Nothing in ‘exists by its own nature’ says ‘thinks’, ‘chooses’ or ‘loves’. ((nat-b-necess|Spinoza)) accepts the necessary being and identifies it with Nature itself, which is one, unlimited and perfect in his sense, and chooses nothing. Aquinas's step from unlimited being to goodness renames being as desirable. It does not show that the source cares what becomes of us.",
                        "Hume's rule says to look at the effect. Philo surveyed a world where the same laws that permit life permit plague, and drew his conclusion from it. Tuning plus contingency yields a necessary source of a world fit for life and for cancer alike, and that fits Spinoza's God, or no God at all, better than the God of the creeds.",
                      ],
                      quote: {
                        text: "The true conclusion is, that the original Source of all things is entirely indifferent to all these principles; and has no more regard to good above ill, than to heat above cold, or to drought above moisture, or to light above heavy.",
                        who: "Philo, in David Hume's Dialogues",
                        cite: "Dialogues Concerning Natural Religion, pt. XI (1779)",
                      },
                      thinkers: ["spinoza", "hume", "aquinas"],
                      cedes:
                        "If being that exists of itself were shown, by that fact alone, to be a mind that knows and wills the good of its creatures, this would fall.",
                      see: [
                        { id: "nat-b-necess", why: "Spinoza's necessary being, which is Nature itself and chooses nothing." },
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
          gist: "Selection rewards behavior that keeps creatures alive, true beliefs or not, so someone who thinks nature is all there is can't fully trust her own evolved reason.",
          body: [
            "Unguided nature may not explain the reliability of the minds doing the explaining. {{plantinga}}'s [[eaan|evolutionary argument against naturalism]], the view that nature is all there is, holds that selection cares what a creature does and not whether its beliefs are true. Given naturalism plus evolution, he argues, the chance that our faculties are reliable is low, or impossible even to estimate. Either way the naturalist has a [[defeater|defeater]], a reason to doubt every belief her faculties produce, naturalism included. If God made minds to know the world, the problem does not arise.",
            "{{darwin}} felt the doubt himself, though he aimed it at his own sense that the universe is not the result of chance. {{lewis-cs}} made an earlier version, revised after Elizabeth Anscombe's critique in 1948. Whether Spinoza's Nature, which already includes thought, escapes the argument is ((nat-b-parallel|Spinoza's question)).",
          ],
          quote: {
            text: "But then with me the horrid doubt always arises whether the convictions of man's mind, which has been developed from the mind of the lower animals, are of any value or at all trustworthy. Would any one trust in the convictions of a monkey's mind, if there are any convictions in such a mind?",
            who: "Charles Darwin",
            cite: "Letter to William Graham, 3 July 1881",
          },
          thinkers: ["plantinga", "darwin", "lewis-cs"],
          cedes:
            "If evolution were shown to favor true belief as such, about cosmology and logic as much as about food and predators, the argument would fail.",
          see: [
            { id: "hid-designed-faculty", why: "The same reasoning in reverse, where a natural origin need not make a faculty unreliable." },
            { id: "evi-a-function", why: "Plantinga's account of knowledge as true belief from faculties working as designed, applied to belief in God." },
          ],
          sources: [
            { title: "Where the Conflict Really Lies, ch. 10", by: "Alvin Plantinga", year: "2011" },
            { title: "Letter to William Graham", by: "Charles Darwin", year: "1881", url: "https://www.darwinproject.ac.uk/letter/DCP-LETT-13230.xml" },
          ],
          children: [
            {
              id: "nat-b-adaptive",
              side: "skeptic",
              label: "Selection favors minds that track the truth",
              gist: "Creatures that misjudge food, cliffs and predators die young, and getting the world right is the easiest general way to act well, so evolution should favor reliable minds.",
              body: [
                "Selection sees truth through what true beliefs make possible. A gazelle that takes the lion for a bush leaves few grandchildren. Plantinga's own example is a hominid who wants to be eaten by a tiger but runs from each one because he thinks it unlikely to eat him. William Ramsey argued in 2002 that such a creature needs a matching false desire for every false belief, rigged case by case, which is far harder to evolve than getting things right.",
                "{{fitelson}} and {{sober}} add that Plantinga's low probability has no support, and that a believer can't vindicate reason without begging the question either. Evolution also predicts the pattern we find, minds that handle medium-sized objects and other people well and go wrong about probability and the very large and small, which is why we invented science to check ourselves.",
              ],
              quote: {
                text: "Creatures inveterately wrong in their inductions have a pathetic but praiseworthy tendency to die before reproducing their kind.",
                who: "W. V. Quine",
                cite: "“Natural Kinds” (1969)",
              },
              thinkers: ["quine", "fitelson", "sober"],
              cedes:
                "Evidence that false beliefs steer behavior as well as true ones, across the situations animals face, would sink this.",
              see: [{ id: "hid-csr-both-ways", why: "Explaining a belief away by its origins, aimed at belief in God instead." }],
              sources: [
                { title: "Plantinga's Probability Arguments Against Evolutionary Naturalism", by: "Branden Fitelson and Elliott Sober, Pacific Philosophical Quarterly", year: "1998" },
                { title: "Naturalism Defeated?", by: "James Beilby (ed.)", year: "2002" },
                { title: "Natural Kinds", by: "W. V. Quine, in Essays in Honor of Carl G. Hempel", year: "1969" },
              ],
              children: [
                {
                  id: "nat-b-content",
                  side: "theist",
                  label: "Selection sees what beliefs do, not whether they're true",
                  gist: "If beliefs are brain states, they move the body through their wiring, so selection can favor useful wiring whether the beliefs it carries are true or false.",
                  body: [
                    "The gazelle story assumes that a belief's content, what it says about the world, is what moves the legs. If materialism is true, a belief is a brain state that causes behavior through its wiring. {{plantinga}} argues that if content does no causal work, selection is blind to it, and if content rides along on neural properties, those properties do the pushing and the same useful wiring could go with any content at all. On either option, a belief's usefulness does not make it true.",
                    "Even granting reliability about survival, nothing secures it for beliefs about the universe's origin, mathematics or naturalism itself, which never fed or saved anyone. Plantinga denies begging the question in return, since he claims only that naturalism, by its own account, gives its holder a reason to distrust it, and belief in God does not.",
                  ],
                  quote: {
                    text: "Boiled down to essentials, a nervous system enables the organism to succeed in the four F's: feeding, fleeing, fighting, and reproducing. … Truth, whatever that is, definitely takes the hindmost.",
                    who: "Patricia Churchland, as Plantinga quotes her",
                    cite: "“Epistemology in the Age of Neuroscience,” Journal of Philosophy 84 (1987)",
                  },
                  thinkers: ["plantinga"],
                  cedes:
                    "A materialist account on which selection rewards a belief's content as well as its neural shape would answer this.",
                  see: [{ id: "evi-a-defeaters", why: "Defeaters and basic beliefs, the same tools used in Objection IV." }],
                  sources: [
                    { title: "Epistemology in the Age of Neuroscience", by: "Patricia S. Churchland, Journal of Philosophy", year: "1987" },
                  ],
                  children: [
                    {
                      id: "nat-b-teleo",
                      side: "skeptic",
                      label: "A belief's meaning comes from what it evolved to track",
                      gist: "What a brain state means is set by what it evolved to respond to, so selecting the states that steer behavior well is selecting states that are mostly true.",
                      body: [
                        "Plantinga goes wrong by picturing content floating free of the causal story. On [[teleosemantics|teleosemantics]] ({{millikan}}, 1984; {{papineau}}, 1987; {{dretske}}, 1988), what a brain state represents is fixed by its biological function, meaning what it was selected to signal. A state that means *lion* means it because it was selected for firing when lions were near. So the wiring can't be held fixed while any content at all is swapped in.",
                        "Abstract beliefs don't come from a separate faculty that selection never touched. The same reasoning that counts predators does our arithmetic and physics, and every eclipse forecast to the minute tests it far from home. {{bergmann}}, himself a Christian, turns Plantinga's theory of knowledge against him, drawing on {{reid}}. If belief in God can be [[properly-basic|properly basic]], reasonable without argument, so can a naturalist's trust in her own faculties.",
                      ],
                      quote: {
                        text: "Why, sir, should I believe the faculty of reason more than that of perception; they came both out of the same shop, and were made by the same artist; and if he puts one piece of false ware into my hands, what should hinder him from putting another?",
                        who: "Thomas Reid",
                        cite: "An Inquiry into the Human Mind, ch. VI, sect. XX (1764)",
                      },
                      thinkers: ["millikan", "papineau", "dretske", "bergmann", "reid"],
                      cedes:
                        "This holds unless teleosemantics fails to fix content for abstract beliefs, the ones about logic, mathematics and metaphysics.",
                      see: [{ id: "evi-a-basic", why: "The idea of basic belief that this reply borrows." }],
                      sources: [
                        { title: "Teleological Theories of Mental Content", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/content-teleological/" },
                        { title: "Commonsense Naturalism", by: "Michael Bergmann, in Naturalism Defeated?", year: "2002" },
                        { title: "An Inquiry into the Human Mind, on the Principles of Common Sense", by: "Thomas Reid", year: "1764", url: "https://archive.org/details/inquiryintohuman00reidiala" },
                      ],
                      children: [
                        {
                          id: "nat-b-loose",
                          side: "theist",
                          label: "Selection leaves meaning loose, and basic trust can be defeated",
                          gist: "Selection can't tell a belief about flies from one about small dark moving things, and even basic trust gives way once you learn your faculties may be unreliable.",
                          body: [
                            "Selection fixes content only as finely as it sees, and it sees coarsely. A frog's tongue-snap was selected because it caught flies, but every fly it caught was also a small dark moving thing, so its history can't say which it is about. {{fodor}} made this point in 1990, and with Massimo Piattelli-Palmarini in 2010. {{plantinga}} concluded in 2011 that where content is undetermined, so is truth, most of all for beliefs about logic, mathematics and naturalism.",
                            "Plantinga answered Bergmann in 2002 that a [[properly-basic|properly basic]] belief is innocent until proven guilty and can still be proven guilty. If you learn you took a drug that makes most users' reasoning unreliable, your trust in it is defeated, basic or not. A naturalist who accepts evolution has learned much the same and cannot argue the [[defeater|defeater]] away without using those faculties.",
                          ],
                          thinkers: ["fodor", "plantinga", "bergmann"],
                          cedes:
                            "Showing that selection fixes definite content for beliefs about logic and metaphysics, or that learning one's faculties are probably unreliable leaves basic trust intact, would refute this.",
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
              gist: "Mind and matter are two sides of one Nature, so the order of ideas matches the order of things, and reason fits the world without anyone designing the fit.",
              body: [
                "Plantinga's argument hits materialism, and {{spinoza}} was no materialist. For him thought is an attribute, a basic aspect, of [[deus-sive-natura|God, or Nature]]. Extension, the aspect under which things are bodies in space, is another, and the two run in one order (*Ethics* II P7). Your mind is the idea of your body, the same thing grasped as thought. So knowledge by reason, built on [[common-notions|common notions]] (ideas of what all bodies share), is necessarily true (II P41).",
                "The fit between mind and world needs neither luck nor a designer, because it is one reality described twice. Matter that feels is no puzzle either, since all individual things, Spinoza wrote, “though in different degrees, are animated” (II P13 Schol.). {{nagel}}, an atheist, thinks mind is basic to nature too. Spinoza sees no need for the person believers add, with ((nat-b-reasons|free choice)) and ((coh-c-person|a will that binds)).",
              ],
              quote: {
                text: "The order and connection of ideas is the same as the order and connection of things.",
                who: "Spinoza",
                cite: "Ethics II P7 (1677), trans. Elwes",
              },
              thinkers: ["spinoza", "nagel"],
              cedes:
                "If an impersonal Nature that includes thought could be shown unable to ground true knowledge in finite minds, Spinoza's answer would fail.",
              see: [
                { id: "coh-a-analogy", why: "Aquinas's analogy across the gap between God and us. For Spinoza our thought is part of God's and the same in kind." },
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
    title: "Spinoza on miracles and on explaining nature",
    body: [
      "{{spinoza}} goes further than Hume on miracles. Hume says we can never have good enough evidence to believe one, and Spinoza says the word names a gap in what the audience knows. Miracles, he wrote, “are only intelligible as in relation to human opinions, and merely mean events of which the natural cause cannot be explained by a reference to any ordinary occurrence, either by us, or at any rate, by the writer and narrator of the miracle” (*Theologico-Political Treatise* ch. 6, 1670). So he can grant every well-attested cure in ((nat-a-keener|the healing reports)) and lose nothing. A wonder done on command or in answer to prayer would show what the witnesses expected. To show where nature's powers end, you would need a list of all of them.",
      "On explanation he sides with Leibniz and Aquinas against the skeptic who accepts brute facts. He held the principle of sufficient reason without exception (*Ethics* I P11), so he cannot say with Russell that the universe is just there, or call life-friendly physics a lucky draw. Of the three puzzles in the counter, he thinks two, why anything exists and why minds track truth (II P7), are solved without a person. He rejects the third as badly posed. Nature aims at nothing, [[final-causes|final causes]] (purposes in nature) are human inventions, and the constants are what Nature necessarily is (I Appendix, I P33).",
      "Where he parts from believers is the step from *God explains nature* to *someone chose nature*. His God has infinite intellect and loves itself with an [[amor-dei-intellectualis|intellectual love]] (V P35–36), but has no will that picks among options (I P32–33). His strongest support here is ((nat-b-contrast|the demand for a reason why this and not that)), defended today by the Spinoza scholar {{della-rocca}}. His weakest point is ((nat-b-tune|the physics)), which has so far found nothing that makes the constants necessary. Each branch comes back to Objection I's question, whether creation is free or necessary.",
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
      note: "The classic case against believing miracle reports. It first appeared in Philosophical Essays (1748) and has been called the Enquiry since 1758.",
    },
    {
      title: "Hume's Abject Failure: The Argument Against Miracles",
      by: "John Earman",
      year: "2000",
      url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf",
      note: "Earman, who is not a believer, uses probability theory to argue that Hume's maxim fails. Robert Fogelin answered it in A Defense of Hume on Miracles (2003).",
    },
    {
      title: "The Miracle of Theism",
      by: "J. L. Mackie",
      year: "1982",
      note: "An atheist's book-length review of the case for God, with chapters on miracles, on the argument from why anything exists, and on design.",
    },
    {
      title: "The Principle of Sufficient Reason: A Reassessment",
      by: "Alexander R. Pruss",
      year: "2006",
      note: "A book-length defense of the principle that everything has a reason, which the contingency argument needs.",
    },
    {
      title: "God and Design: The Teleological Argument and Modern Science",
      by: "Neil A. Manson (ed.)",
      year: "2003",
      note: "Fine-tuning argued from both sides, with Collins, Leslie and Swinburne for it and Sober, the McGrews and others against.",
    },
    {
      title: "Naturalism Defeated? Essays on Plantinga's Evolutionary Argument against Naturalism",
      by: "James Beilby (ed.)",
      year: "2002",
      note: "Plantinga's argument, about a dozen critics, and his replies to them.",
    },
  ],
};

export default nature;
