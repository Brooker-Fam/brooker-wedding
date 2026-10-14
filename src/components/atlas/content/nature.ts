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
   Added later, each checked the same way: Newton's Opticks (4th ed., 1730) and
   Darwin's Life and Letters vol. 1 (both Gutenberg), Kant's Critique in
   Meiklejohn's translation (Gutenberg), Carroll's 2010 and 2014 blog posts
   and his 2017 arXiv abstract, Halvorson's 2017 Nautilus essay, Swinburne's
   "Bayes, God, and the Multiverse" (his own copy), Fitelson and Sober
   (Pacific Philosophical Quarterly 79, 1998, p. 127), and Bostrom's Anthropic
   Bias ch. 2 (anthropic-principle.com). Every url was checked to return 200.
   Churchland's 1987 line (p. 548) is as Plantinga quotes it in his "Two Dozen
   (or so) Theistic Arguments" notes and his 2008 essay. Other modern critics are
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
    "Part 1 asks whether a miracle report could ever be believed, given that nature keeps its laws. Part 2 asks whether a God who chooses explains anything nature can't. {{spinoza}}, who counted mind as part of nature and called nature God, asks both sides whether anything needs a God who makes choices.",
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
        "Everything people have checked runs on regular laws. Stones fall and the dead stay dead, and thunder, plague and epilepsy, once read as the direct hand of God, all turned out to have causes inside nature. To believe a [[miracle|miracle]] report, we would have to set that whole record aside for one event. {{hume}} made the case in 1748: “A miracle is a violation of the laws of nature; and as a firm and unalterable experience has established these laws, the proof against a miracle, from the very nature of the fact, is as entire as any argument from experience can possibly be imagined.” {{spinoza}} had reached a stronger conclusion in 1670 by arguing from what God is. Nature's laws are God's own decrees, he held, so “a miracle, whether in contravention to, or beyond, nature, is a mere absurdity.” Hume claims less, only that we could never have good enough reason to believe that a miracle happened.",
      ],
      quote: {
        text: "That no testimony is sufficient to establish a miracle, unless the testimony be of such a kind, that its falsehood would be more miraculous, than the fact, which it endeavours to establish …",
        who: "David Hume",
        cite: "An Enquiry concerning Human Understanding X, §91 (1748)",
        url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum91",
      },
      thinkers: ["hume", "spinoza"],
      cedes:
        "This would fall if a miracle claim survived checks as strict as a drug trial's, with independent witnesses and records made before the event.",
      see: [
        { id: "evi-b-prior", why: "The same weighing of odds, applied to the resurrection in Objection IV." },
        { id: "nat-b", why: "Part 2 asks whether God would explain anything, even if something odd did happen." },
      ],
      sources: [
        {
          title: "An Enquiry concerning Human Understanding, sect. X, “Of Miracles”",
          by: "David Hume",
          year: "1748",
          url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#section10",
          note: "The essay itself. Part 1 sets out how to weigh testimony against experience, and Part 2 argues that no real miracle report has ever passed the test.",
        },
        {
          title: "A Theologico-Political Treatise, ch. 6, “Of Miracles”",
          by: "Benedict de Spinoza, trans. R. H. M. Elwes",
          year: "1670",
          url: "https://www.gutenberg.org/cache/epub/990/pg990-images.html#chap06",
          note: "Spinoza's case, made 78 years before Hume's, that nothing can happen against nature's laws because they are God's own decrees.",
        },
        {
          title: "Miracles",
          by: "Stanford Encyclopedia of Philosophy",
          url: "https://plato.stanford.edu/entries/miracles/",
          note: "Timothy McGrew and Robert Larmer trace the debate from Hume and his first critics to the probability arguments of today.",
        },
        {
          title: "Hume on Religion",
          by: "Stanford Encyclopedia of Philosophy",
          url: "https://plato.stanford.edu/entries/hume-religion/",
          note: "Places the miracles essay among Hume's other writings on religion, the Dialogues included.",
        },
      ],
      children: [
        {
          id: "nat-a-circle",
          side: "theist",
          label: "Ruling out miracles in advance argues in a circle",
          gist: "Hume says all experience is against miracles, but that is true only if every miracle report is false, which is the question being asked.",
          body: [
            "Hume rests his case on experience showing that nature's laws never break. {{campbell-george}}, a Scottish minister who corresponded with Hume, asked in 1762 whose experience that was. Hume writes that there must be “a uniform experience against every miraculous event, otherwise the event would not merit that appellation.” But a miracle report is itself a report of experience. To call experience uniform, Hume has to set every such report aside first, which means assuming they are all false. Campbell added that most of what we call experience reaches us through other people's testimony.",
            "{{lewis-cs}} made the same charge about miracles in 1947: “Unfortunately we know the experience against them to be uniform only if we know that all the reports of them are false. And we can know all the reports to be false only if we know already that miracles have never occurred. In fact, we are arguing in a circle.” Learned men once dismissed peasants' reports of stones falling from the sky in the same way, until a shower of them hit L'Aigle in Normandy in 1803 and the physicist Jean-Baptiste Biot confirmed it.",
          ],
          quote: {
            text: "Thus he falls into that parallogism, which is called begging the question. What he gives with one hand, he takes with the other.",
            who: "George Campbell",
            cite: "A Dissertation on Miracles (1762), pt. I, sect. 2",
            url: "https://archive.org/details/dissertationonmi00camp",
          },
          thinkers: ["campbell-george", "lewis-cs", "hume"],
          cedes:
            "The circle charge would fail if someone stated the case against miracles without first setting every report aside unexamined.",
          see: [{ id: "evi-a-compelling", why: "Why the Christian case leans on miracle testimony at all." }],
          sources: [
            {
              title: "A Dissertation on Miracles",
              by: "George Campbell",
              year: "1762",
              url: "https://archive.org/details/dissertationonmi00camp",
              note: "Campbell's reply to Hume, printed in Edinburgh in 1762. The charge of begging the question comes in Part I, section 2.",
            },
            {
              title: "Miracles: A Preliminary Study, ch. XIII, “On Probability”",
              by: "C. S. Lewis",
              year: "1947",
              note: "Lewis's chapter on Hume, arguing that to call experience uniform is to assume every miracle report is false.",
            },
            {
              title: "An Enquiry concerning Human Understanding, sect. X, §90",
              by: "David Hume",
              year: "1748",
              url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum90",
              note: "The paragraph Campbell attacks, where Hume says a uniform experience stands against every miraculous event.",
            },
          ],
          children: [
            {
              id: "nat-a-odds",
              side: "skeptic",
              label: "Weighed fairly, testimony never outweighs a law of nature",
              gist: "Hume doesn't assume the reports are false. He weighs them, and the chance that witnesses erred or lied always beats the chance that nature's order failed.",
              body: [
                "The circle charge misreads {{hume}}, who weighs the reports and assumes nothing about them in advance. His test asks which would be the greater wonder, that this testimony is false or that the event happened. Mistakes, wishful thinking and fraud turn up every day, while a dead man rising has never been seen under conditions anyone could check. For Hume, choosing the likelier explanation is what rational belief is: “A wise man, therefore, proportions his belief to the evidence.” {{fogelin}} reads the essay as one argument, in which Part 1 sets the bar and Part 2 shows that no actual report clears it. {{mackie}} reads it the same way. Historians since the philosopher F. H. Bradley (1874) have held that critical history has to presume nature is regular. That rule, explaining events by natural causes whatever one's private beliefs, is called [[methodological-naturalism|methodological naturalism]], and believing historians follow it too.",
              ],
              quote: {
                text: "Thus, suppose, all authors, in all languages, agree, that, from the first of January 1600, there was a total darkness over the whole earth for eight days … it is evident, that our present philosophers, instead of doubting the fact, ought to receive it as certain, and ought to search for the causes whence it might be derived.",
                who: "David Hume",
                cite: "An Enquiry concerning Human Understanding X, §99 (1748)",
                url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum99",
              },
              thinkers: ["hume", "fogelin", "mackie"],
              cedes:
                "Hume's side would accept a miracle backed by testimony whose falsehood would be harder to believe than the event itself.",
              see: [{ id: "evi-b-prior", why: "Hume's test applied to Easter, in Objection IV." }],
              sources: [
                {
                  title: "A Defense of Hume on Miracles",
                  by: "Robert J. Fogelin",
                  year: "2003",
                  note: "A short book that reads Hume's two parts as one argument, written partly in reply to Earman.",
                },
                {
                  title: "The Miracle of Theism",
                  by: "J. L. Mackie",
                  year: "1982",
                  note: "Chapter 1 restates Hume's argument about testimony and weighs the replies to it.",
                },
                {
                  title: "An Enquiry concerning Human Understanding, sect. X, Part 1",
                  by: "David Hume",
                  year: "1748",
                  url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum87",
                  note: "Where Hume says a wise man proportions his belief to the evidence, and sets out his test for testimony.",
                },
              ],
              children: [
                {
                  id: "nat-a-earman",
                  side: "theist",
                  label: "Hume's case fails, since witnesses can make a miracle credible",
                  gist: "Probability theory shows that enough independent, fairly reliable witnesses can make even a very unlikely event credible, so no rule settles the question before the evidence is in.",
                  body: [
                    "Hume asks us to weigh testimony, and two of his contemporaries, Thomas Bayes and {{price-richard}}, were building the mathematics for weighing it. {{earman}}, a philosopher of science, applied that mathematics to Hume in *Hume's Abject Failure* (2000). He is not a Christian, and says in his preface, “If I had need of Gods, they would be the Gods of the Greeks and the Romans.” Made precise, he concludes, Hume's principles are “either vapid, specious, or at variance with actual scientific practice.”",
                    "One witness may lie or be wrong, but two strangers who never met and who name the same license plate are hard to dismiss. Many witnesses who could not have colluded, each likelier to report the event if it happened than if not, can together overcome any [[prior-probability|prior probability]] above zero (how likely the event seemed before anyone testified). {{babbage}} worked the numbers in 1837. So Earman thinks each miracle claim has to be weighed on its own evidence.",
                  ],
                  quote: {
                    text: "Any epistemology that does not allow for the possibility that evidence, whether from eyewitness testimony or from some other source, can establish the credibility of a UFO landing, a walking on water, or a resurrection is inadequate.",
                    who: "John Earman",
                    cite: "Hume's Abject Failure (2000), pt. I",
                    url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf",
                  },
                  thinkers: ["earman", "price-richard", "babbage"],
                  cedes:
                    "If no realistic number of independent, minimally reliable witnesses could lift a miracle above even odds, Earman's reply would fail.",
                  see: [
                    { id: "evi-b-cumulative", why: "How likely a resurrection seems beforehand depends on what else we know about God." },
                    { id: "nat-a-circle", why: "The same conclusion by a different route, that no rule may decide in advance." },
                  ],
                  sources: [
                    {
                      title: "Hume's Abject Failure: The Argument Against Miracles",
                      by: "John Earman",
                      year: "2000",
                      url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf",
                      note: "The whole book, free on Earman's site. Part I is his critique of Hume, and Part II reprints older texts from Spinoza and Locke to Laplace and Babbage, Price's reply among them.",
                    },
                    {
                      title: "Four Dissertations, Dissertation IV",
                      by: "Richard Price",
                      year: "1767",
                      url: "https://archive.org/details/fourdissertatio00pricgoog",
                      note: "Price's answer to Hume, which uses the new mathematics of probability. The scan is the 1777 printing.",
                    },
                    {
                      title: "The Ninth Bridgewater Treatise, ch. X and Note E",
                      by: "Charles Babbage",
                      year: "1837",
                      url: "https://archive.org/details/ninthbridgewater00babb",
                      note: "Babbage's arithmetic for independent witnesses. The scan is the 1838 second edition, in which he rewrote the chapter on Hume.",
                    },
                  ],
                  children: [
                    {
                      id: "nat-a-practice",
                      side: "skeptic",
                      label: "Hume's case stands, since the actual reports fail his test",
                      gist: "Testimony could prove a miracle in principle, but the reports we have come from people who wanted them, grow in the retelling, and fall apart when checked.",
                      body: [
                        "Earman may refute Part 1 of Hume's essay read alone, but Hume's verdict rests on Part 2, as {{fogelin}} argues. Miracle reports come from communities that want them, and each religion's miracles count against its rivals', since “in matters of religion, whatever is different is contrary.” Hume's test case was the cures reported around 1730 at the Paris tomb of the deacon François de Pâris. They were sworn to before judges, and Hume's Protestant readers believed them no more than he did.",
                        "{{earman}} ends up near this view, suspecting that religious miracle reports resemble faith healing, where group hysteria ruins the witnesses' reliability. Lourdes has recognized 72 cures since 1858 (the latest in 2025) out of many thousands claimed. The largest trial of prayer for the sick, STEP (2006, 1,802 heart-surgery patients), found no benefit, and patients who knew they were being prayed for did slightly worse.",
                      ],
                      quote: {
                        text: "But I do believe, in a way that I cannot articulate in detail, that these cases are in fact relevantly similar to the case of faith healing where there is a palpable atmosphere of collective hysteria that renders the participants unable to achieve the minimal reliability condition …",
                        who: "John Earman",
                        cite: "Hume's Abject Failure (2000), pt. I",
                        url: "https://sites.pitt.edu/~jearman/Earman2000HumeAbjectFailure.pdf",
                      },
                      thinkers: ["hume", "earman", "fogelin"],
                      cedes:
                        "One well-documented healing that held up under independent medical review, with records from before and after and no ordinary explanation, would sink this.",
                      see: [
                        { id: "evi-b-natural", why: "Natural explanations for the Easter experiences, in Objection IV." },
                        { id: "evi-b-prior", why: "The same question asked of the Gospel reports." },
                      ],
                      sources: [
                        {
                          title: "Study of the Therapeutic Effects of Intercessory Prayer (STEP)",
                          by: "Herbert Benson et al., American Heart Journal",
                          year: "2006",
                          note: "The trial of prayer by strangers for heart-surgery patients. It found no benefit, and patients told they were being prayed for had more complications.",
                        },
                        {
                          title: "A Defense of Hume on Miracles",
                          by: "Robert J. Fogelin",
                          year: "2003",
                          note: "Fogelin's argument that Hume's verdict rests on Part 2, where he turns to the miracle reports on record.",
                        },
                        {
                          title: "An Enquiry concerning Human Understanding, sect. X, Part 2",
                          by: "David Hume",
                          year: "1748",
                          url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum92",
                          note: "Hume's reasons for distrusting real reports, with the cures at the tomb of the Abbé Pâris in §96.",
                        },
                      ],
                      children: [
                        {
                          id: "nat-a-keener",
                          side: "theist",
                          label: "Some healing reports pass the tests Hume set",
                          gist: "Some recoveries come with medical records and independent witnesses, and Hume's own paragraph shows he refused a resurrection because of the kind of event it was.",
                          body: [
                            "{{keener}}'s *Miracles* (2011, two volumes) gathers healing accounts from four continents, some with before-and-after medical records for conditions that rarely reverse. An uncontrolled study in Mozambique (Candy Gunther Brown and colleagues, 2010) found hearing and sight gains after in-person prayer, which its authors said justified a controlled trial. STEP tested scripted prayers by distant strangers, which these reports don't describe.",
                            "Hume would accept unanimous reports of eight days' darkness, but if every historian agreed that Queen Elizabeth died, lay buried a month and returned to reign, he would call her death a pretense before admitting “so signal a violation of the laws of nature.” The testimony is as good in both cases. The difference, he says, is that nature's decay has parallels in experience and a return from the dead has none, which is ((nat-a-circle|the circle)) again, aimed at the event Christianity rests on.",
                          ],
                          quote: {
                            text: "I must confess that I should be surprised at the concurrence of so many odd circumstances, but should not have the least inclination to believe so miraculous an event.",
                            who: "David Hume",
                            cite: "An Enquiry concerning Human Understanding X, §99 (1748)",
                            url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum99",
                          },
                          thinkers: ["keener", "hume"],
                          cedes:
                            "If independent physicians examined the best-documented cases and found ordinary explanations or faulty records for every one, this reply would fall.",
                          see: [{ id: "evi-b-minimal", why: "The resurrection, argued in Objection IV." }],
                          sources: [
                            {
                              title: "Miracles: The Credibility of the New Testament Accounts",
                              by: "Craig S. Keener",
                              year: "2011",
                              note: "Two volumes of healing accounts from many countries, with long chapters answering Hume.",
                            },
                            {
                              title: "Study of the Therapeutic Effects of Proximal Intercessory Prayer (STEPP) on Auditory and Visual Impairments in Rural Mozambique",
                              by: "Candy Gunther Brown et al., Southern Medical Journal",
                              year: "2010",
                              note: "The Mozambique field study, which tested hearing and sight before and after prayer in person.",
                            },
                            {
                              title: "An Enquiry concerning Human Understanding, sect. X, §99",
                              by: "David Hume",
                              year: "1748",
                              url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum99",
                              note: "Both of Hume's test cases, the eight days of darkness and Queen Elizabeth's return from the dead.",
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
          id: "nat-a-laws",
          side: "theist",
          label: "A miracle breaks no law, so physics can't rule it out",
          gist: "A law of nature says what happens when nothing outside nature acts, so God acting from outside breaks no law, and no experiment can rule that out.",
          body: [
            "Christian writers have not usually pictured a miracle as nature's order snapping. {{augustine}} held around 425 that a portent (a wonder) goes against nature only as we know it. {{aquinas}} wrote that God, who gives every creature its power, “can do something outside this order created by Him,” producing an effect without its usual cause.",
            "A law of motion says what a system does if nothing outside it interferes. {{lewis-cs}} drew the consequence in 1947: “Miraculous wine will intoxicate, miraculous conception will lead to pregnancy.” Once God feeds an event in, the laws carry it forward. Conservation of energy, {{larmer}} points out, holds only for closed systems, and whether nature is ever open to outside action is the point in dispute. {{plantinga}} notes that no law of physics says the physical world is closed, and he argues that the claim that it is closed is a philosophical thesis, which physics probably cannot settle.",
          ],
          quote: {
            text: "For how is that contrary to nature which happens by the will of God, since the will of so mighty a Creator is certainly the nature of each created thing? A portent, therefore, happens not contrary to nature, but contrary to what we know as nature.",
            who: "Augustine",
            cite: "City of God XXI.8 (c. 425), trans. Marcus Dods",
            url: "https://www.newadvent.org/fathers/120121.htm",
          },
          thinkers: ["augustine", "aquinas", "lewis-cs", "larmer", "plantinga"],
          cedes:
            "If physics itself, with no philosophy added on top, showed the universe to be a closed system that nothing outside could act on, this would fail.",
          see: [
            { id: "coh-a", why: "An intervening God looks like one cause among others, which is the worry of Objection I." },
          ],
          sources: [
            {
              title: "City of God, bk. XXI",
              by: "Augustine, trans. Marcus Dods",
              year: "c. 425",
              url: "https://www.newadvent.org/fathers/120121.htm",
              note: "Chapter 8 argues that a portent goes against nature only as we know it.",
            },
            {
              title: "Summa Theologiae I q.105 a.6",
              by: "Thomas Aquinas",
              url: "https://www.newadvent.org/summa/1105.htm#article6",
              note: "Aquinas asks whether God can act outside the order of nature, and answers that he can, since that order depends on his will.",
            },
            {
              title: "The Legitimacy of Miracle",
              by: "Robert A. Larmer",
              year: "2014",
              note: "Larmer's case that God could add energy to nature without breaking any law, because the conservation law holds only for closed systems.",
            },
            {
              title: "Where the Conflict Really Lies: Science, Religion, and Naturalism",
              by: "Alvin Plantinga",
              year: "2011",
              note: "Chapters 3 and 4 argue that classical and quantum physics leave room for God to act, unless one adds the claim that the physical world is closed.",
            },
          ],
          children: [
            {
              id: "nat-a-closure",
              side: "skeptic",
              label: "The evidence of physics is against any outside push",
              gist: "Whether anything beyond the physical ever pushes on matter is a question evidence can answer, and physicists and physiologists have looked for a century and found nothing.",
              body: [
                "{{papineau}} argued in 2001 that physics supports [[causal-closure|causal closure]], the claim that every physical event has a complete physical cause. Nineteenth-century science still allowed vital and mental forces acting on matter. Twentieth-century physiologists looked for them in cells and nerves and found only the familiar physical forces. Energy is conserved only in closed systems, as Larmer says, but every system ever examined, from calorimeters to living cells, behaves as one.",
                "A single act of God in history would slip past any controlled test, but then the claim that God acted could never be tested either. {{carroll}} wrote in 2010 that the physics of everyday life, bodies and brains included, has been tested at every energy that matters there, so any force not yet found is “unable to influence what we see in our everyday lives.” Even {{leibniz}}, who believed in miracles of grace, mocked Newton's God for having to “wind up his Watch from Time to Time.”",
              ],
              quote: {
                text: "According to My Opinion, the same Force and Vigour remains always in the World, and only passes from one part of Matter to another, agreeably to the Laws of Nature, and the beautiful pre-established Order. And I hold, that when God works Miracles, he does not do it in order to supply the Wants of Nature, but those of Grace.",
                who: "G. W. Leibniz",
                cite: "First paper in the Leibniz–Clarke correspondence, §4 (Nov. 1715), trans. Samuel Clarke (1717)",
                url: "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00226",
              },
              thinkers: ["papineau", "carroll", "leibniz"],
              cedes:
                "A well-controlled measurement that caught matter in a living body moving in a way the known physical forces can't account for would overturn this.",
              see: [{ id: "coh-a", why: "Objection I asks what work is left for nature if God acts through every cause." }],
              sources: [
                {
                  title: "The Rise of Physicalism",
                  by: "David Papineau",
                  year: "2001",
                  note: "Papineau's history of how physiologists stopped finding room for vital and mental forces, which he takes as evidence for causal closure.",
                },
                {
                  title: "The Laws Underlying the Physics of Everyday Life Are Completely Understood",
                  by: "Sean Carroll",
                  year: "2010",
                  url: "https://www.preposterousuniverse.com/blog/2010/09/23/the-laws-underlying-the-physics-of-everyday-life-are-completely-understood/",
                  note: "Carroll's blog post arguing that any undiscovered force strong enough to matter in everyday life would already have been detected.",
                },
                {
                  title: "Physicalism",
                  by: "Stanford Encyclopedia of Philosophy",
                  url: "https://plato.stanford.edu/entries/physicalism/",
                  note: "Covers the argument from causal closure and how much it can prove.",
                },
                {
                  title: "Mr. Leibnitz's First Paper, in A Collection of Papers … between Mr. Leibnitz and Dr. Clarke",
                  by: "G. W. Leibniz, trans. Samuel Clarke",
                  year: "1717",
                  url: "https://www.newtonproject.ox.ac.uk/view/texts/normalized/THEM00226",
                  note: "Leibniz's opening letter to Samuel Clarke, in Clarke's 1717 translation, mocking Newton's God as a watchmaker who has to keep mending his watch.",
                },
              ],
            },
            {
              id: "nat-a-power",
              side: "spinoza",
              label: "A God who never competes with nature can't step into it",
              gist: "If nature's laws are God's own decrees, a miracle would set God against himself, and a God who works through every cause has no gap to step into.",
              body: [
                "Lewis pictures God feeding events into nature, and {{spinoza}} had already called that picture the common error of imagining two powers, God's and nature's, taking turns. For him nature's universal laws are “decrees of God following from the necessity and perfection of the Divine nature.” An event against them would be God acting against himself, and Spinoza saw no difference between going *against* the laws and going *beyond* them. Belief in such an event, he warned, “would throw doubt upon everything, and lead to Atheism.”",
                "In the reply to Objection I, {{tanner}} and {{hart}} say that God gives every cause its being and power without competing with any. If so, God cannot also be one more cause that now and then does what a creature would have done, which is the role the feeding-in picture gives him. A [[non-competition|non-competing]] God works through nature, so a God who steps into it is ((coh-a|one cause among others)) after all.",
              ],
              quote: {
                text: "They suppose, forsooth, that God is inactive so long as nature works in her accustomed order, and vice versa, that the power of nature and natural causes are idle so long as God is acting: thus they imagine two powers distinct one from the other, the power of God and the power of nature …",
                who: "Spinoza",
                cite: "Theologico-Political Treatise, ch. 6 (1670), trans. Elwes",
                url: "https://www.gutenberg.org/cache/epub/990/pg990-images.html#chap06",
              },
              thinkers: ["spinoza", "tanner", "hart"],
              cedes:
                "Spinoza would give way if someone described a miracle in which God neither does what a creature would have done nor sets nature's order aside.",
              see: [
                { id: "coh-a-concur", why: "The claim that God never competes with creatures, which this dilemma turns against miracles." },
                { id: "coh-a-collapse", why: "Whether God's decrees could have been otherwise." },
              ],
              sources: [
                {
                  title: "God and Creation in Christian Theology: Tyranny or Empowerment?",
                  by: "Kathryn Tanner",
                  year: "1988",
                  note: "Tanner's account of God and creatures acting on different levels, so that more of one is never less of the other.",
                },
                {
                  title: "A Theologico-Political Treatise, ch. 6",
                  by: "Benedict de Spinoza, trans. R. H. M. Elwes",
                  year: "1670",
                  url: "https://www.gutenberg.org/cache/epub/990/pg990-images.html#chap06",
                  note: "Spinoza's chapter on miracles, which argues that an event against nature's laws would set God against himself.",
                },
                {
                  title: "The Experience of God: Being, Consciousness, Bliss",
                  by: "David Bentley Hart",
                  year: "2013",
                  note: "Hart's account of the classical God as the source of all being, as opposed to a very powerful being inside the world.",
                },
              ],
              children: [
                {
                  id: "nat-a-free",
                  side: "theist",
                  label: "God chose nature's order freely, so he can act beyond it",
                  gist: "God chose nature's order freely, so going beyond it contradicts nothing, and when he heals without medicine he pushes no natural cause aside.",
                  body: [
                    "{{aquinas}} had answered both of Spinoza's charges four centuries earlier. God chose this order and could have chosen another, so acting beyond it breaks no decree. In Aquinas's words, God “fixed a certain order in things in such a way that at the same time He reserved to Himself whatever he intended to do otherwise than by a particular cause” (I q.105 a.6 ad 3). Spinoza's argument works only if God's will is as necessary as geometry, and that is the point argued over in ((coh-a-collapse|Objection I)).",
                    "Aquinas also denied that a miracle competes with nature. Every creature, he says, has an [[obediential-potency|obediential power]], an openness to being raised by God “to a higher act than a natural agent can reduce it” (*Summa* III q.11 a.1), meaning beyond anything nature could do to it. When God heals someone without medicine, he overrules no natural cause, because none was at work on the cure. On this view a miracle is like a scene an author adds to his story, and no character is pushed out to make room.",
                  ],
                  quote: {
                    text: "… He is not subject to the order of secondary causes; but, on the contrary, this order is subject to Him, as proceeding from Him, not by a natural necessity, but by the choice of His own will; for He could have created another order of things.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.105 a.6 (trans. English Dominican Province)",
                    url: "https://www.newadvent.org/summa/1105.htm#article6",
                  },
                  thinkers: ["aquinas", "lewis-cs"],
                  cedes:
                    "If a God whose will could have been otherwise proved incoherent, so that his decrees had to be necessary, this reply would collapse.",
                  see: [
                    { id: "coh-a-concur", why: "The picture of God never competing with creatures, argued in Objection I." },
                    { id: "coh-a-extrinsic", why: "How one necessary act of God can have effects that might not have been." },
                    { id: "nat-b-reasons", why: "The same free-choice reply, made about why there is a world at all." },
                    { id: "nat-b-contrast", why: "Spinoza's reply to this free-choice answer." },
                  ],
                  sources: [
                    {
                      title: "Summa Theologiae I q.105 a.6",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1105.htm#article6",
                      note: "The reply to the third objection says God kept for himself whatever he meant to do apart from secondary causes.",
                    },
                    {
                      title: "Summa Theologiae III q.11 a.1",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/4011.htm#article1",
                      note: "An article on Christ's infused knowledge, where Aquinas names the obediential power in passing.",
                    },
                    {
                      title: "Miracles",
                      by: "David Corner, Internet Encyclopedia of Philosophy",
                      url: "https://iep.utm.edu/miracles/",
                      note: "Corner surveys definitions of miracle, including Aquinas's view that a miracle goes beyond nature's usual order without being contrary to nature.",
                    },
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
        "The objection, which {{aquinas}} stated against himself, rests on the rule later named [[ockhams-razor|Ockham's razor]], that what a few causes explain shouldn't be credited to more. {{newton}} wrote in his *Opticks* that small irregularities in the planets' orbits “will be apt to increase, till this System wants a Reformation,” meaning a correction by God. {{laplace}} later showed the orbits were stable without it. {{paley}} saw a designer in the eye in 1802, and in 1859 {{darwin}} showed how the look of design can arise without one. Darwin later wrote: “The old argument from design in Nature, as given by Paley, which formerly seemed to me so conclusive, fails, now that the law of natural selection has been discovered.”",
        "Its target is a God who chooses and acts, since such a God predicts nothing nature does not and so explains nothing extra. It leaves open whether something impersonal underlies everything, as Spinoza thought. At best the God who chooses is a [[god-of-the-gaps|God of the gaps]], called in wherever science has no answer yet and retreating each time it finds one.",
      ],
      quote: {
        text: "Further, it is superfluous to suppose that what can be accounted for by a few principles has been produced by many. But it seems that everything we see in the world can be accounted for by other principles, supposing God did not exist.",
        who: "Thomas Aquinas, stating the objection",
        cite: "Summa Theologiae I q.2 a.3, obj. 2 (trans. English Dominican Province)",
        url: "https://www.newadvent.org/summa/1002.htm#article3",
      },
      thinkers: ["aquinas", "ockham", "newton", "laplace", "paley", "darwin"],
      cedes:
        "If a God who chooses predicted some well-defined fact that nature alone did not, and the fact were then observed, this would fall.",
      see: [
        { id: "hid-hart-light", why: "The first answer from Aquinas's tradition, that God is no hypothesis inside the world." },
        { id: "coh-a-concur", why: "If God never competes with nature, what does he add?" },
      ],
      sources: [
        {
          title: "Summa Theologiae I q.2 a.3",
          by: "Thomas Aquinas",
          url: "https://www.newadvent.org/summa/1002.htm#article3",
          note: "The five ways. Objection 2 is stated at the start of the article, and Aquinas answers it at the end.",
        },
        {
          title: "Opticks, Query 31",
          by: "Isaac Newton",
          year: "1730 (4th ed.)",
          url: "https://www.gutenberg.org/cache/epub/33504/pg33504-images.html#Page_402",
          note: "The last query in Newton's book, where he says the planets' orbits will in time need correcting.",
        },
        {
          title: "The Life and Letters of Charles Darwin, vol. 1, ch. VIII, “Religion”",
          by: "Francis Darwin (ed.)",
          year: "1887",
          url: "https://www.gutenberg.org/cache/epub/2087/pg2087-images.html#link2HCH0008",
          note: "Prints the part of Darwin's autobiography about religion, including his verdict on Paley.",
        },
        {
          title: "Simplicity",
          by: "Stanford Encyclopedia of Philosophy",
          url: "https://plato.stanford.edu/entries/simplicity/",
          note: "What Ockham's razor says, in its different forms, and why anyone should trust it.",
        },
      ],
      children: [
        /* ── why anything exists ── */
        {
          id: "nat-b-exist",
          side: "theist",
          label: "Why anything exists needs an explanation nature can't give",
          gist: "Science explains each moment of the world by the one before, but never why there is a world at all, and only something that has to exist can answer that.",
          body: [
            "Ockham's razor only chooses between explanations of the same thing. Physics explains how one state of the world leads to the next, but not why there is a world with laws to describe. {{leibniz}} called this the first question. Every star, law and quantum field might never have existed, which makes them contingent. The reason for the whole series, Leibniz argued, “must be outside of the sequence or series of particular contingent things, however infinite this series may be” (*Monadology* §37). Aquinas's reply to the objection says that “all things that are changeable and capable of defect must be traced back to an immovable and self-necessary first principle.” This is the [[contingency-argument|contingency argument]], restated today by {{pruss}}. It differs from the [[kalam|kalam argument]] (from medieval Islamic theology) that the universe had a beginning, which Aquinas held reason cannot prove. The physicist Lawrence Krauss's *A Universe from Nothing* (2012) is no rival either, since a quantum vacuum governed by laws is something, as the philosopher of physics David Albert said in his review.",
          ],
          quote: {
            text: "This principle being laid down, the first question we are entitled to put will be — Why does something exist rather than nothing? For ‘nothing’ is simpler and easier than ‘something.’",
            who: "G. W. Leibniz",
            cite: "Principles of Nature and of Grace §7 (written 1714), trans. Robert Latta",
            url: "https://archive.org/details/themonadology00leibuoft",
          },
          thinkers: ["leibniz", "aquinas", "pruss"],
          cedes:
            "If a whole made of contingent things needed no explanation beyond its parts, the argument would fail.",
          see: [{ id: "coh-a-concur", why: "Why a source of all being is no cause among others, the reply in Objection I." }],
          sources: [
            {
              title: "Cosmological Argument",
              by: "Stanford Encyclopedia of Philosophy",
              url: "https://plato.stanford.edu/entries/cosmological-argument/",
              note: "Bruce Reichenbach's entry follows the argument from Aquinas and Leibniz to Pruss, with the main objections.",
            },
            {
              title: "Necessary Existence",
              by: "Alexander Pruss and Joshua Rasmussen",
              year: "2018",
              note: "A recent book-length case that there is a necessary being, built from several independent arguments.",
            },
            {
              title: "Principles of Nature and of Grace, §§7–8, in The Monadology and Other Philosophical Writings",
              by: "G. W. Leibniz, trans. Robert Latta",
              year: "1898",
              url: "https://archive.org/details/themonadology00leibuoft",
              note: "Leibniz's late summary of his system. Sections 7 and 8 ask why there is something and answer with a necessary being.",
            },
            {
              title: "Summa Theologiae I q.46 a.2",
              by: "Thomas Aquinas",
              url: "https://www.newadvent.org/summa/1046.htm#article2",
              note: "Where Aquinas holds that only faith, and no proof, shows that the world had a beginning.",
            },
          ],
          children: [
            {
              id: "nat-b-necess",
              side: "spinoza",
              label: "The necessary being is Nature itself, and it chooses nothing",
              gist: "If everything has a reason, the thing that has to exist is Nature itself, and everything follows from it the way theorems follow from axioms, with no one choosing.",
              body: [
                "{{spinoza}} accepted the contingency argument's question and rejected its answer. He held the [[psr|principle of sufficient reason]], that everything has a reason, with no exceptions: “Of everything whatsoever a cause or reason must be assigned, either for its existence, or for its non-existence” (*Ethics* I P11). But what depends on nothing else, which he calls substance, exists by its own nature as [[causa-sui|cause of itself]], and there is only one, God or Nature, with nothing outside it. Even {{hume}}'s Cleanthes asked, “why may not the material universe be the necessarily existent Being”?",
                "The principle also proves more than Aquinas wanted. If the reason for this world lies in God's nature, the world follows necessarily: “Nothing in the universe is contingent” (I P29). That view, that nothing could have been otherwise, is [[necessitarianism|necessitarianism]]. {{van-inwagen}}, a Christian, argued that the principle, held without exceptions, implies it, and gave up the principle. {{della-rocca}} accepts both, as Spinoza did, and on their view nothing was chosen.",
              ],
              quote: {
                text: "Existence belongs to the nature of substances.",
                who: "Spinoza",
                cite: "Ethics I P7 (1677), trans. Elwes",
                url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap01",
              },
              thinkers: ["spinoza", "hume", "van-inwagen", "della-rocca"],
              cedes:
                "A world that could have been otherwise, with a full reason for it that doesn't make it inevitable, would answer Spinoza here.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's God thinks but does not choose, argued in Objection I." },
                { id: "coh-a-collapse", why: "The same necessity, aimed at the God of Aquinas, who has no parts." },
              ],
              sources: [
                {
                  title: "Ethics, pt. I",
                  by: "Benedict de Spinoza, trans. R. H. M. Elwes",
                  year: "1677",
                  url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap01",
                  note: "Part I, “Concerning God”, which argues that there is one substance and that everything follows from it of necessity.",
                },
                {
                  title: "PSR",
                  by: "Michael Della Rocca, Philosophers' Imprint",
                  year: "2010",
                  note: "Della Rocca's argument that the principle of sufficient reason, held without exceptions, leads to Spinoza's conclusions and further.",
                },
                {
                  title: "Spinoza's Modal Metaphysics",
                  by: "Stanford Encyclopedia of Philosophy",
                  url: "https://plato.stanford.edu/entries/spinoza-modal/",
                  note: "Samuel Newlands on whether Spinoza held that nothing could have been otherwise, and how scholars read the evidence.",
                },
                {
                  title: "Dialogues Concerning Natural Religion, pt. IX",
                  by: "David Hume",
                  year: "1779",
                  url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap09",
                  note: "Demea's argument for a necessary being, and Cleanthes's reply that the material world could fill the role.",
                },
              ],
              children: [
                {
                  id: "nat-b-reasons",
                  side: "theist",
                  label: "A free choice made for good reasons explains creation",
                  gist: "Good reasons can fully explain a choice even when the chooser could have done otherwise, so creation can have a reason without having been forced.",
                  body: [
                    "Spinoza's step from sufficient reason to necessity runs together two kinds of explanation. A reason can explain a choice without forcing it. You took the job because it paid better, though you could have stayed. {{aquinas}} says God wills his own goodness necessarily and wills creatures freely: “since the goodness of God is perfect, and can exist without other things inasmuch as no perfection can accrue to Him from them, it follows that His willing things apart from Himself is not absolutely necessary” (I q.19 a.3). {{pruss}} and {{oconnor-timothy}} defend a version of the principle built for this case, on which a free act done for a purpose explains a fact that could have been otherwise. On Spinoza's view nothing could have been otherwise, so this cough and this war were as necessary as two plus two, and {{van-inwagen}} took that consequence as proof that the strong principle is false.",
                  ],
                  quote: {
                    text: "The will of God is reasonable, not because anything is to God a cause of willing, but in so far as He wills one thing to be on account of another.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.5 ad 1 (trans. English Dominican Province)",
                    url: "https://www.newadvent.org/summa/1019.htm#article5",
                  },
                  thinkers: ["aquinas", "pruss", "oconnor-timothy", "van-inwagen"],
                  cedes:
                    "If reasons that leave a choice open turned out to explain nothing about why it went the way it did, the free-choice answer would collapse.",
                  see: [
                    { id: "coh-a-extrinsic", why: "Objection I's model, one necessary act of God whose effects could have been otherwise." },
                    { id: "coh-c-natlaw", why: "The same answer, that reasons fit a choice without forcing it, given for God's commands in Objection I." },
                  ],
                  sources: [
                    {
                      title: "Summa Theologiae I q.19 aa.3, 5",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1019.htm#article3",
                      note: "Article 3 asks whether God wills creatures necessarily, and article 5 whether anything causes God's will.",
                    },
                    {
                      title: "Theism and Ultimate Explanation",
                      by: "Timothy O'Connor",
                      year: "2008",
                      note: "O'Connor defends a necessary God who creates freely, with a version of the sufficient-reason principle that allows it.",
                    },
                    {
                      title: "Principle of Sufficient Reason",
                      by: "Stanford Encyclopedia of Philosophy",
                      url: "https://plato.stanford.edu/entries/sufficient-reason/",
                      note: "Yitzhak Melamed and Martin Lin's history of the principle, from Spinoza and Leibniz to its defenders and critics today.",
                    },
                  ],
                  children: [
                    {
                      id: "nat-b-contrast",
                      side: "spinoza",
                      label: "Reasons that fit either choice leave God's choice unexplained",
                      gist: "If the same reasons would have explained God making a different world or none, they can't explain why he made this one.",
                      body: [
                        "Reasons that would have served equally well for the opposite choice can't explain why it went this way. Asked why this world exists and not another or none, the free-choice view ends with “God chose to.” That answer is a [[brute-fact|brute fact]], a fact with no explanation, offered as an explanation. In the job example your character settles your choice, and nothing settles God's. {{spinoza}} demanded reasons without exception (*Ethics* I P11), and {{della-rocca}} makes the same [[contrastive-explanation|contrastive]] demand, asking why this and not the alternatives.",
                        "{{leibniz}} said reasons incline God to the best world without forcing him: “His goodness makes Him choose it, and His power makes Him produce it” (*Monadology* §55). {{rowe}} argued that if there is a best world, a perfectly good God cannot fail to make it, so creation is necessary after all. If instead every world has a better one, God's goodness can't explain why he made this one.",
                      ],
                      quote: {
                        text: "And that of sufficient reason, in virtue of which we hold that there can be no fact real or existing, no statement true, unless there be a sufficient reason, why it should be so and not otherwise, although these reasons usually cannot be known by us.",
                        who: "G. W. Leibniz",
                        cite: "Monadology §32 (1714), trans. Robert Latta",
                        url: "https://archive.org/details/themonadology00leibuoft",
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
                        {
                          title: "Principle of Sufficient Reason",
                          by: "Stanford Encyclopedia of Philosophy",
                          url: "https://plato.stanford.edu/entries/sufficient-reason/",
                          note: "Includes Spinoza's and Leibniz's versions of the principle and the worry that it makes everything necessary.",
                        },
                        {
                          title: "Can God Be Free?",
                          by: "William L. Rowe",
                          year: "2004",
                          note: "Rowe's argument that a perfectly good God must create the best world, or, if there is no best, can't be explained in creating this one.",
                        },
                        {
                          title: "The Monadology and Other Philosophical Writings",
                          by: "G. W. Leibniz, trans. Robert Latta",
                          year: "1898",
                          url: "https://archive.org/details/themonadology00leibuoft",
                          note: "Latta's translation with notes. Monadology §§32–55 move from sufficient reason to God's choice of the best world.",
                        },
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
              gist: "Believers end their explanations at God and skeptics end theirs at the universe or its first state, and nothing shows the skeptic's stopping point is worse.",
              body: [
                "The contingency argument assumes what it needs to prove, that every contingent thing has an explanation. {{hume}}'s Cleanthes says that once each of twenty particles is explained, it is unreasonable to ask what caused the twenty. Debating the Jesuit Frederick Copleston on BBC radio in 1948, {{russell}} said: “I should say that the universe is just there, and that's all.” Every man has a mother, he added, and the human race does not. {{kant}} called the rule that everything contingent has a cause “a principle without significance, except in the sensuous world,” the world of experience, so it can't cover the whole.",
                "{{oppy}} argues the two sides are on a par. Whatever the believer says of God, necessary or unexplained, the skeptic can say of the universe's first state, with one kind of thing fewer. On many readings of quantum mechanics, some events happen with no sufficient reason. Oppy concludes that every account bottoms out in a [[brute-fact|brute fact]].",
              ],
              quote: {
                text: "But the whole, you say, wants a cause. I answer, that the uniting of these parts into a whole … is performed merely by an arbitrary act of the mind, and has no influence on the nature of things.",
                who: "Cleanthes, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. IX (1779)",
                url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap09",
              },
              thinkers: ["hume", "russell", "kant", "oppy"],
              cedes:
                "If denying a reason for the universe undercut the reasons I rely on everywhere else, I'd give this up.",
              see: [
                { id: "evi-a-parity", why: "The same parity argument, that every worldview starts from something unexplained." },
                { id: "coh-c-brute", why: "The same choice in ethics, between moral facts with no further explanation and God as the place explanation stops." },
              ],
              sources: [
                {
                  title: "Dialogues Concerning Natural Religion",
                  by: "David Hume",
                  year: "1779",
                  url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap09",
                  note: "Part IX, where Demea argues for a necessary being and Cleanthes answers with his twenty particles.",
                },
                {
                  title: "The Existence of God: A Debate (BBC Third Programme, 1948)",
                  by: "Bertrand Russell and F. C. Copleston",
                  year: "1948",
                  url: "https://strangenotions.com/the-most-famous-debate-on-the-existence-of-god/",
                  note: "A transcript of the debate, taken from Al Seckel's edition. The argument from contingency comes first.",
                },
                {
                  title: "Arguing about Gods",
                  by: "Graham Oppy",
                  year: "2006",
                  note: "Oppy's case that no argument about God's existence should persuade every reasonable person, with a long chapter on cosmological arguments.",
                },
                {
                  title: "Critique of Pure Reason, “Of the Impossibility of a Cosmological Proof of the Existence of God”",
                  by: "Immanuel Kant, trans. J. M. D. Meiklejohn",
                  year: "1787",
                  url: "https://www.gutenberg.org/cache/epub/4280/pg4280-images.html#chap92",
                  note: "Kant's critique of the cosmological proof, with his list of what he takes to be its fallacies.",
                },
              ],
              children: [
                {
                  id: "nat-b-psr",
                  side: "theist",
                  label: "If the universe needs no reason, nothing does",
                  gist: "If a whole universe can exist for no reason, anything could, and scientists could no longer assume, as they do every day, that events have reasons.",
                  body: [
                    "Copleston told Russell, “I can't see how you can rule out the legitimacy of asking the question how the total, or anything at all comes to be there.” If a universe can exist for no reason, so could a brick in your kitchen. {{pruss}} argues that the brute-fact view leaves no way to call such events improbable, since probabilities come from the laws and causes it says can be missing. Cleanthes's twenty particles miss the point, because all the contingent facts together make one fact that could have been otherwise, which no part explains ({{rowe}}; Pruss).",
                    "Oppy's claim that the two sides are on a par fails, because God is proposed as something that has to exist, and a heap of contingent parts is a poor candidate. Quantum chance is no counterexample, since laws and states fix the odds of a decay. Believers who end with God's free choice ((nat-b-reasons|still have to defend it)), since {{della-rocca}} follows the principle past God into necessity.",
                  ],
                  quote: {
                    text: "What was it, then, which determined Something to exist rather than Nothing, and bestowed being on a particular possibility, exclusive of the rest? External causes, there are supposed to be none. Chance is a word without a meaning. Was it Nothing? But that can never produce any thing.",
                    who: "Demea, in David Hume's Dialogues",
                    cite: "Dialogues Concerning Natural Religion, pt. IX (1779)",
                    url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap09",
                  },
                  thinkers: ["pruss", "rowe", "della-rocca", "hume"],
                  cedes:
                    "This would fail if someone gave a principled reason why the universe as a whole may go unexplained while a brick in the kitchen may not.",
                  see: [
                    { id: "nat-b-contrast", why: "A free choice by God faces the same charge of being unexplained." },
                    { id: "coh-c-terminus", why: "Where believers stop explaining in ethics, argued in Objection I." },
                  ],
                  sources: [
                    {
                      title: "The Principle of Sufficient Reason: A Reassessment",
                      by: "Alexander R. Pruss",
                      year: "2006",
                      note: "Pruss defends the principle that every contingent fact has an explanation and answers the standard objections.",
                    },
                    {
                      title: "The Cosmological Argument",
                      by: "William L. Rowe",
                      year: "1975",
                      note: "Rowe's study of Samuel Clarke's argument, including whether the whole series of contingent beings needs its own explanation.",
                    },
                    {
                      title: "Dialogues Concerning Natural Religion, pt. IX",
                      by: "David Hume",
                      year: "1779",
                      url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap09",
                      note: "Part IX, the source of Demea's question about why something exists and of Cleanthes's twenty particles.",
                    },
                    {
                      title: "The Existence of God: A Debate (BBC Third Programme, 1948)",
                      by: "Bertrand Russell and F. C. Copleston",
                      year: "1948",
                      url: "https://strangenotions.com/the-most-famous-debate-on-the-existence-of-god/",
                      note: "Copleston presses the question of the whole universe, and Russell declines to ask it.",
                    },
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
          gist: "Slightly different numbers in physics would mean no stars or life, and numbers like ours are far likelier if God intended life than if they arose by chance.",
          body: [
            "Even if nature explains what happens inside it, its settings need explaining. Small changes to gravity, the strong force or the electron's mass would leave no long-lived stars and no chemistry for life. {{rees}} lists six numbers that must fall in narrow windows. The energy of empty space sits some 120 powers of ten below a naive quantum estimate, and a much larger value would have stopped galaxies forming.",
            "{{penrose}} put the odds of so orderly a beginning at one in 10 to the power of 10¹²³. {{hoyle}}, long an atheist, predicted an energy level in carbon nuclei that lets stars make carbon, and experiment confirmed it. In 1981 he said a sensible superintellect “would conclude that the carbon atom is a fix.”",
            "{{collins}} argues that [[fine-tuning|values like these]] are far likelier if God exists than if he doesn't, and {{barnes}}, an astrophysicist, defends the physics against its critics.",
          ],
          quote: {
            text: "A common sense interpretation of the facts suggests that a superintellect has monkeyed with physics, as well as with chemistry and biology, and that there are no blind forces worth speaking about in nature.",
            who: "Fred Hoyle",
            cite: "“The Universe: Past and Present Reflections,” Engineering & Science (Caltech), Nov. 1981",
            url: "https://calteches.library.caltech.edu/527/2/Hoyle.pdf",
          },
          thinkers: ["rees", "penrose", "hoyle", "collins", "barnes"],
          cedes:
            "This would fail if a deeper theory showed life possible across most of the constants' range, or fixed their values by principles that have nothing to do with life.",
          see: [{ id: "nat-b-necess", why: "Spinoza's answer, that nothing could have been otherwise, so the constants are no target anyone aimed at." }],
          sources: [
            {
              title: "Fine-Tuning",
              by: "Stanford Encyclopedia of Philosophy",
              url: "https://plato.stanford.edu/entries/fine-tuning/",
              note: "Simon Friederich's entry on the physics and on the design, multiverse and selection-effect replies.",
            },
            {
              title: "A Fortunate Universe: Life in a Finely Tuned Cosmos",
              by: "Geraint F. Lewis and Luke A. Barnes",
              year: "2016",
              note: "Two astrophysicists explain the fine-tuning cases for general readers.",
            },
            {
              title: "The Universe: Past and Present Reflections",
              by: "Fred Hoyle",
              year: "1981",
              url: "https://calteches.library.caltech.edu/527/2/Hoyle.pdf",
              note: "Hoyle's Caltech talk, with the story of the carbon energy level and the superintellect passage.",
            },
            {
              title: "The Fine-Tuning of the Universe for Intelligent Life",
              by: "Luke A. Barnes, Publications of the Astronomical Society of Australia",
              year: "2012",
              url: "https://arxiv.org/abs/1112.4647",
              note: "Barnes's technical review of the physics, written in reply to Victor Stenger's claim that the tuning is overstated.",
            },
          ],
          children: [
            {
              id: "nat-b-multi",
              side: "skeptic",
              label: "With enough universes, a livable one is no surprise",
              gist: "If there are huge numbers of universes with different constants, observers can only arise in the rare life-friendly ones, so finding ourselves in one needs no designer.",
              body: [
                "Fine-tuning impresses only if ours is the only universe. Many inflation models (theories of the first instant) produce endless bubble universes, and string theory allows perhaps 10⁵⁰⁰ settings of the constants ({{susskind}}), so there may be a [[multiverse|multiverse]]. {{carter}}'s [[anthropic-principle|anthropic principle]] (1973) says observers can only find themselves where they can exist. With billions of barren planets, we need no designer to explain why we live on Earth.",
                "In 1987 {{weinberg}} used the principle to predict a small, nonzero energy of empty space, a decade before it was measured. {{hacking}} called inferring earlier universes from ours the inverse gambler's fallacy, like concluding from one double six that there were many rolls. {{white-roger}} applies the charge to any multiverse. {{bostrom}} replies that in Hacking's example “there is no observation selection effect,” since the gambler could see any roll and we could only see a winning one.",
              ],
              quote: {
                text: "A finite number of particles is only susceptible of finite transpositions: and it must happen, in an eternal duration, that every possible order or position must be tried an infinite number of times.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. VIII (1779)",
                url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap08",
              },
              thinkers: ["susskind", "carter", "weinberg", "hacking", "white-roger", "bostrom", "hume"],
              cedes:
                "If cosmology ruled out every way of producing many universes with varied constants, this reply would fail.",
              sources: [
                {
                  title: "The Anthropic Landscape of String Theory",
                  by: "Leonard Susskind",
                  year: "2003",
                  url: "https://arxiv.org/abs/hep-th/0302219",
                  note: "Susskind's lecture arguing that string theory's vast range of possible worlds supports anthropic reasoning. He expanded it in The Cosmic Landscape (2005).",
                },
                {
                  title: "The Inverse Gambler's Fallacy",
                  by: "Ian Hacking, Mind",
                  year: "1987",
                  note: "The paper that named the fallacy. Hacking aimed it at inferring a sequence of earlier universes from ours, and accepted the version in which many universes exist side by side.",
                },
                {
                  title: "Fine-Tuning and Multiple Universes",
                  by: "Roger White, Noûs",
                  year: "2000",
                  note: "White argues that a universe fit for life gives no evidence that other universes exist.",
                },
                {
                  title: "Anthropic Bias, ch. 2",
                  by: "Nick Bostrom",
                  year: "2002",
                  url: "https://www.anthropic-principle.com/anthropic-bias/chapter-2/",
                  note: "Free online. The chapter answers Hacking's charge and discusses White's analysis.",
                },
              ],
              children: [
                {
                  id: "nat-b-generator",
                  side: "theist",
                  label: "A universe-making machine would need fine-tuning too",
                  gist: "Whatever produces many universes needs finely set laws of its own, and some multiverse models predict that a typical observer would be a brief fluke, unlike us.",
                  body: [
                    "{{collins}} argues that a [[multiverse|multiverse]] still needs tuning, because a universe generator needs its own ingredients (a field to drive inflation, a way to vary the constants, quantum rules and gravity) to yield one life-friendly bubble. {{paley}} imagined in 1802 a watch that could make “another watch like itself,” and said this should raise our opinion of its maker.",
                    "Some multiverse models also predict the wrong kind of world, where random fluctuations produce lone, brief minds, called [[boltzmann-brain|Boltzmann brains]], far more often than whole ordered worlds, so such minds should outnumber observers like us. {{carroll}}, who rejects design, treats this as a test any model must pass, since such theories “cannot simultaneously be true and justifiably believed.”",
                    "{{penrose}}'s odds for our orderly beginning count against these models, since a lucky fluctuation would likely give a beginning only just orderly enough for observers, and ours was far more orderly than that.",
                  ],
                  quote: {
                    text: "The first effect would be to increase his admiration of the contrivance, and his conviction of the consummate skill of the contriver.",
                    who: "William Paley",
                    cite: "Natural Theology, ch. 2 (1802)",
                    url: "https://archive.org/details/worksofwilliampa00pale",
                  },
                  thinkers: ["collins", "paley", "carroll", "penrose"],
                  cedes:
                    "A multiverse theory with untuned laws, a settled way of counting universes, and a prediction that observers like us are typical would answer this.",
                  sources: [
                    {
                      title: "The Teleological Argument: An Exploration of the Fine-Tuning of the Universe",
                      by: "Robin Collins, in The Blackwell Companion to Natural Theology",
                      year: "2009",
                      note: "Collins's long statement of the argument, including why a universe generator would itself need tuning.",
                    },
                    {
                      title: "Why Boltzmann Brains Are Bad",
                      by: "Sean M. Carroll",
                      year: "2017",
                      url: "https://arxiv.org/abs/1702.00850",
                      note: "Carroll argues that theories predicting mostly Boltzmann brains undercut the evidence for themselves.",
                    },
                    {
                      title: "Natural Theology, ch. 2, in The Works of William Paley",
                      by: "William Paley",
                      year: "1802",
                      url: "https://archive.org/details/worksofwilliampa00pale",
                      note: "Paley's works in one volume (1830). Chapter 2 of Natural Theology has the watch that makes a copy of itself.",
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-odds",
              side: "skeptic",
              label: "Fine-tuning yields no odds that favor a designer",
              gist: "No one can give odds for a constant with no upper limit. We could only ever observe a livable universe anyway, and a God could use any physics.",
              body: [
                "If a constant could take any value without limit, there is no way to spread probability evenly over it, and every finite window, however wide, gets probability zero. {{mcgrew-timothy|Timothy}} and Lydia McGrew, both Christians, made this point in 2001. {{sober}} points to a [[anthropic-principle|selection effect]] that needs no multiverse. We could not have observed a hostile universe, so a friendly one tells us little. When the physicists Fred Adams and Victor Stenger varied several constants at once, they found much less tuning than one-at-a-time studies suggest.",
                "{{carroll}} told the Christian philosopher William Lane Craig in a 2014 debate that belief in God predicts no particular physics. In his notes after the debate he wrote: “Fine-tuning for life would only potentially be relevant if we already accepted naturalism; God could create life under arbitrary physical conditions.” On his view, a hypothesis that fits any physics gets no support from ours.",
              ],
              quote: {
                text: "But how this argument can have place, where the objects, as in the present case, are single, individual, without parallel, or specific resemblance, may be difficult to explain.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. II (1779)",
                url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap02",
              },
              thinkers: ["mcgrew-timothy", "sober", "carroll"],
              cedes:
                "If the life-permitting ranges could be given a principled probability, and God shown to prefer these laws in particular, the argument would get its odds.",
              sources: [
                {
                  title: "Probabilities and the Fine-Tuning Argument: A Sceptical View",
                  by: "Timothy McGrew, Lydia McGrew and Eric Vestrup, Mind",
                  year: "2001",
                  note: "The paper showing that no probability can be spread evenly over an unlimited range.",
                },
                {
                  title: "The Design Argument",
                  by: "Elliott Sober, in God and Design, ed. Neil Manson",
                  year: "2003",
                  note: "Sober treats design arguments as comparisons of likelihoods and presses the selection-effect objection.",
                },
                {
                  title: "Dialogues Concerning Natural Religion, pt. II",
                  by: "David Hume",
                  year: "1779",
                  url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap02",
                  note: "Philo's objection that the universe is a single case, with nothing to compare it to.",
                },
                {
                  title: "Post-Debate Reflections",
                  by: "Sean Carroll",
                  year: "2014",
                  url: "https://www.preposterousuniverse.com/blog/2014/02/24/post-debate-reflections/",
                  note: "Carroll's notes after debating William Lane Craig, with his five reasons fine-tuning is poor evidence for God.",
                },
              ],
              children: [
                {
                  id: "nat-b-aim",
                  side: "theist",
                  label: "God would make physics like ours, fit for creatures who act",
                  gist: "A good God has reason to make a stable world where creatures can act and learn, and that needs physics that permits complex life.",
                  body: [
                    "{{swinburne}} argues that a good God has reason to create creatures with bodies who are responsible for one another: “Intelligent beings are as such a good thing, and so God has reason to bring them about” (2012). Such creatures require a stable, law-governed world. God could keep life going by constant miracles under any laws, but creatures who act need regularities they can learn, so we should expect physics that permits complex life. {{collins}} answers the McGrews' point about unlimited ranges by comparing the range physicists can assess, where life-permitting values are a tiny fraction.",
                    "A [[anthropic-principle|selection effect]] explains why we see a friendly universe given that we exist, but not why there is one to exist in. {{leslie}} tells of fifty marksmen who fire at a condemned man and all miss. He wouldn't be here to wonder if they had hit him, which is true and explains nothing, and he should suspect they missed on purpose.",
                  ],
                  quote: {
                    text: "… He governs things inferior by superior, not on account of any defect in His power, but by reason of the abundance of His goodness; so that the dignity of causality is imparted even to creatures.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.22 a.3 (trans. English Dominican Province)",
                    url: "https://www.newadvent.org/summa/1022.htm#article3",
                  },
                  thinkers: ["swinburne", "collins", "leslie", "aquinas"],
                  cedes:
                    "If a good God turned out to have no more reason to make law-bound creatures with bodies than anything else, Swinburne would have no prediction left.",
                  sources: [
                    {
                      title: "The Existence of God",
                      by: "Richard Swinburne",
                      year: "2004 (2nd ed.)",
                      note: "Swinburne's full case for God. The chapters on design argue that God would make a law-governed world for embodied agents.",
                    },
                    {
                      title: "Bayes, God, and the Multiverse",
                      by: "Richard Swinburne, in Probability in the Philosophy of Religion (Oxford)",
                      year: "2012",
                      url: "https://users.ox.ac.uk/~orie0087/pdf_files/Papers%20from%20Philosophical%20Journals/Swinburne_2012-bayes.pdf",
                      note: "The author's copy. Swinburne explains why God would make beings like us and argues that a possible multiverse barely weakens the fine-tuning argument.",
                    },
                    {
                      title: "Universes",
                      by: "John Leslie",
                      year: "1989",
                      note: "Leslie's book on fine-tuning, with the firing-squad story, giving both design and many worlds a hearing.",
                    },
                    {
                      title: "Summa Theologiae I q.22 a.3",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1022.htm#article3",
                      note: "Aquinas on why God governs lower things through higher ones and lets creatures be real causes.",
                    },
                  ],
                  children: [
                    {
                      id: "nat-b-longshot",
                      side: "skeptic",
                      label: "A God who wanted life wouldn't make it a long shot",
                      gist: "A God free to choose any laws could have made life easy, so laws on which life only just works fit chance at least as well as design.",
                      body: [
                        "Swinburne's argument needs laws that permit creatures with bodies. It doesn't need these laws in particular, on which life fits through a narrow gap, and a God free to write any physics could have given life a wide margin. {{halvorson}}, a Christian philosopher of physics, asks why God, if he wanted life, would choose laws on which it is a long shot, since “if God exists, then the odds didn't have to be stacked this way.” For a believer, the precariousness that impresses Collins and Swinburne is one more thing to explain.",
                        "Collins's range ends wherever current physics stops, and as it widens, every window's share sinks toward zero (Colyvan, Garfield and Priest, 2005). {{sober}} also replies to Leslie's firing squad. A bystander could suspect a fix, but the survivor's evidence is filtered by his survival, as ours is by our existence, so he would see the same thing on either hypothesis.",
                      ],
                      quote: {
                        text: "The Author of Nature is inconceivably powerful: his force is supposed great, if not altogether inexhaustible: nor is there any reason, as far as we can judge, to make him observe this strict frugality in his dealings with his creatures.",
                        who: "Philo, in David Hume's Dialogues",
                        cite: "Dialogues Concerning Natural Religion, pt. XI (1779)",
                        url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap11",
                      },
                      thinkers: ["swinburne", "halvorson", "sober"],
                      cedes:
                        "If belief in God, without hindsight, predicted laws on which life is precarious, and the life-permitting range could be fixed without choosing it arbitrarily, I would drop this.",
                      see: [{ id: "nat-b-multi", why: "Where a selection effect has many draws to work on." }],
                      sources: [
                        {
                          title: "A Theological Critique of the Fine-Tuning Argument",
                          by: "Hans Halvorson, in Knowledge, Belief, and God (Oxford)",
                          year: "2018",
                          note: "Halvorson's argument that a God who wanted life could have set the odds in its favor, which turns the improbability into a problem for design.",
                        },
                        {
                          title: "The Cosmos' Fine-Tuning Does Not Imply a Fine-Tuner",
                          by: "Hans Halvorson, Nautilus",
                          year: "2017",
                          url: "https://nautil.us/the-cosmos-fine_tuning-does-not-imply-a-fine_tuner-236378",
                          note: "A short version for general readers, with a game of Russian roulette as the analogy.",
                        },
                        {
                          title: "Problems with the Argument from Fine Tuning",
                          by: "Mark Colyvan, Jay L. Garfield and Graham Priest, Synthese",
                          year: "2005",
                          note: "Argues that the range used to judge tuning is arbitrary, and that every finite window shrinks toward zero as the range widens.",
                        },
                        {
                          title: "Absence of Evidence and Evidence of Absence: Evidential Transitivity in Connection with Fossils, Fishing, Fine-Tuning, and Firing Squads",
                          by: "Elliott Sober, Philosophical Studies",
                          year: "2009",
                          note: "Includes Sober's reply to Leslie's firing squad, built on the survivor's selection effect.",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-tuner",
              side: "skeptic",
              label: "A mind able to tune a universe needs explaining too",
              gist: "A mind able to tune a universe holds at least as much order as the universe, so it needs explaining as much as the universe does.",
              body: [
                "Even if the tuning points beyond physics, a mind that surveys every possible universe and picks one contains at least as much order as the universe it explains. {{hume}}'s Philo asked why, if the world's order needs a divine mind, that mind's order needs nothing: “But if we stop, and go no further; why go so far? why not stop at the material world?” {{dawkins}} made the same point in 2006, arguing that a designer able to tune a cosmos would be at least as improbable as the cosmos it designed. Either both need a cause, and the regress begins, or neither does, and the world can end the chain as well as its maker can.",
              ],
              quote: {
                text: "a mental world, or universe of ideas, requires a cause as much, as does a material world, or universe of objects; and, if similar in its arrangement, must require a similar cause.",
                who: "Philo, in David Hume's Dialogues",
                cite: "Dialogues Concerning Natural Religion, pt. IV (1779)",
                url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap04",
              },
              thinkers: ["hume", "dawkins"],
              cedes:
                "If a mind able to design a universe needed less explaining than the universe it designs, Philo's question would lose its force.",
              see: [{ id: "nat-b-brute", why: "The case for ending the chain at the universe." }],
              sources: [
                {
                  title: "Dialogues Concerning Natural Religion, pts. IV–V",
                  by: "David Hume",
                  year: "1779",
                  url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap04",
                  note: "Philo asks why the chain of causes should stop at a mind, and argues that ideas need a cause as much as matter does.",
                },
                {
                  title: "The God Delusion, ch. 4",
                  by: "Richard Dawkins",
                  year: "2006",
                  note: "Dawkins's argument that any designer able to make a universe would be more improbable than the universe.",
                },
                {
                  title: "Teleological Arguments for God's Existence",
                  by: "Stanford Encyclopedia of Philosophy",
                  url: "https://plato.stanford.edu/entries/teleological-arguments/",
                  note: "Del Ratzsch and Jeffrey Koperski's survey of design arguments, which notes Hume's point that a designer would need explaining in turn.",
                },
              ],
              children: [
                {
                  id: "nat-b-simple",
                  side: "theist",
                  label: "We needn't explain the designer, and an unlimited mind is simple",
                  gist: "The best explanation of something need not come with its own explanation, and a single unlimited mind is simpler than a universe of finely balanced parts.",
                  body: [
                    "Philo's demand that every explanation be explained would stop science cold. Archaeologists infer toolmakers from flints without knowing who made the toolmakers. If a radio telescope picked up the first hundred prime numbers, we would infer senders. {{plantinga}} answered {{dawkins}} this way in 2007, with explorers who find tractors on an alien planet. An [[inference-to-best-explanation|inference to the best explanation]], which reasons to whatever best accounts for the evidence, doesn't wait until the explainer is explained.",
                    "{{swinburne}} argues that a person with no limits on power, knowledge or freedom is the simplest possible being, much as zero and infinity need no special explanation and 1.7 does. Aquinas and his followers instead deny that God has parts at all, the doctrine of [[divine-simplicity|divine simplicity]]. Aquinas concluded that God “is nowise composite, but is altogether simple,” so Dawkins's argument about improbable complex things does not apply to him.",
                  ],
                  quote: {
                    text: "For of course it is perfectly sensible, in that context, to explain the existence of those tractors in terms of intelligent life, even though (as we can concede for the moment) that intelligent life would have to be at least as complex as the tractors.",
                    who: "Alvin Plantinga",
                    cite: "“The Dawkins Confusion,” Books & Culture, March/April 2007",
                    url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html",
                  },
                  thinkers: ["plantinga", "dawkins", "swinburne", "aquinas"],
                  cedes:
                    "If an unlimited mind turned out to need more explaining than the finite universe it was invoked to explain, the reply would lose its second half.",
                  see: [{ id: "coh-a-collapse", why: "The trouble divine simplicity runs into, argued in Objection I." }],
                  sources: [
                    {
                      title: "The Dawkins Confusion: Naturalism ad absurdum",
                      by: "Alvin Plantinga, Books & Culture",
                      year: "2007",
                      url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html",
                      note: "Plantinga's review of The God Delusion, with the tractors and his reply to the regress about the designer.",
                    },
                    {
                      title: "Summa Theologiae I q.3 a.7",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1003.htm#article7",
                      note: "Aquinas's argument that God has no parts of any kind.",
                    },
                    {
                      title: "Divine Simplicity",
                      by: "Stanford Encyclopedia of Philosophy",
                      url: "https://plato.stanford.edu/entries/divine-simplicity/",
                      note: "What the doctrine claims and the main objections to it, Plantinga's among them.",
                    },
                    {
                      title: "The Existence of God",
                      by: "Richard Swinburne",
                      year: "2004 (2nd ed.)",
                      note: "Where Swinburne argues that a person without limits is the simplest kind of person there could be.",
                    },
                  ],
                  children: [
                    {
                      id: "nat-b-complex",
                      side: "skeptic",
                      label: "An unlimited mind isn't simple, and toolmakers are no analogy",
                      gist: "A mind that knows every truth holds at least as much as the world it explains, and we infer toolmakers only because we already know toolmakers exist.",
                      body: [
                        "Against {{swinburne}}, the philosopher Jeremy Gwiazda (2009) argued that the case for infinite values being simpler than finite ones does not hold up. A mind that knows every truth and chooses among all possible universes holds at least as much information as the world it explains, which was {{dawkins}}'s point. The reply also mixes rival views, since Swinburne's God is a person whose thoughts follow one another in time, while the God of [[divine-simplicity|divine simplicity]] has no parts and faces ((coh-a-collapse|the charge in Objection I)) that nothing could have been otherwise.",
                        "Flints and primes work as evidence because we already know that toolmakers and radio engineers exist and what they want. In Hume's *Enquiry* (1748) the skeptical friend says we infer a human maker because “man is a being, whom we know by experience, whose motives and designs we are acquainted with.” {{sober}} points out that we have no such knowledge of a mind without a body.",
                      ],
                      quote: {
                        text: "The Deity is known to us only by his productions, and is a single being in the universe, not comprehended under any species or genus, from whose experienced attributes or qualities, we can, by analogy, infer any attribute or quality in him.",
                        who: "The skeptical friend in David Hume's Enquiry",
                        cite: "An Enquiry concerning Human Understanding XI, §113 (1748)",
                        url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum113",
                      },
                      thinkers: ["dawkins", "swinburne", "sober"],
                      cedes:
                        "This would fail if someone found a measure of simplicity, not tailored to God, on which an all-knowing chooser comes out simpler than the world, and also had some independent idea of what such a mind would want.",
                      see: [{ id: "coh-a-collapse", why: "Why a God without parts may end up with Spinoza's necessity." }],
                      sources: [
                        {
                          title: "The God Delusion, ch. 4",
                          by: "Richard Dawkins",
                          year: "2006",
                          note: "Dawkins's case that a designer would need at least as much explaining as what it designs.",
                        },
                        {
                          title: "Richard Swinburne's Argument to the Simplicity of God via the Infinite",
                          by: "Jeremy Gwiazda, Religious Studies",
                          year: "2009",
                          note: "Gwiazda's reply to Swinburne's claim that infinite values are simpler than finite ones.",
                        },
                        {
                          title: "The Design Argument (Cambridge Elements)",
                          by: "Elliott Sober",
                          year: "2019",
                          note: "A short book on design arguments, including the point that we know nothing of a bodiless designer's aims.",
                        },
                        {
                          title: "An Enquiry concerning Human Understanding, sect. XI",
                          by: "David Hume",
                          year: "1748",
                          url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum111",
                          note: "Hume's narrator compares inferring a builder from a half-finished house with inferring a God from the world (§111), and the skeptical friend replies that we know human makers by experience (§112).",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "nat-b-proportion",
              side: "skeptic",
              label: "Fine-tuning can't show there is one designer, or a good one",
              gist: "We may infer only a cause able to produce the effect, so fine-tuning shows some designer and says nothing about whether it is one, good or interested in us.",
              body: [
                "Even if there is a tuner, Hume's rule about causes limits what we can say about it. From an effect we may infer only a cause able to produce it, so tuning shows a tuner at most. It does not show one tuner, or a good or all-powerful one, or one that cares about us. Men join in building a house or ship, Philo noted, so “why may not several deities combine in contriving and framing a world?” (*Dialogues* pt. V). For all the argument shows, he says, the world might be “the first rude essay of some infant deity.” A designer indifferent to suffering would explain the tuning as well as a loving one, since the same constants that permit life permit cancer and plague. To reach the God of the Christian creeds, the argument needs premises the tuning cannot supply.",
              ],
              quote: {
                text: "When we infer any particular cause from an effect, we must proportion the one to the other, and can never be allowed to ascribe to the cause any qualities, but what are exactly sufficient to produce the effect.",
                who: "The skeptical friend in David Hume's Enquiry, speaking as Epicurus",
                cite: "An Enquiry concerning Human Understanding XI, §105 (1748)",
                url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum105",
              },
              thinkers: ["hume"],
              cedes:
                "If the tuning, taken alone, pointed to one good and all-powerful designer and away from any other cause able to produce it, Hume's rule would be met.",
              see: [{ id: "nat-b-exist", why: "Where the Defender looks for one source that has to exist." }],
              sources: [
                {
                  title: "Dialogues Concerning Natural Religion, pts. V and XI",
                  by: "David Hume",
                  year: "1779",
                  url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap05",
                  note: "Part V has Philo's many gods and his infant deity. Part XI weighs the world's mix of good and ill.",
                },
                {
                  title: "An Enquiry concerning Human Understanding, sect. XI",
                  by: "David Hume",
                  year: "1748",
                  url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#mnum105",
                  note: "Hume's friend, speaking as Epicurus, argues that we may give a cause only the powers its effect shows.",
                },
                {
                  title: "Hume on Religion",
                  by: "Stanford Encyclopedia of Philosophy",
                  url: "https://plato.stanford.edu/entries/hume-religion/",
                  note: "Paul Russell and Anders Kraal on how Hume's objections to design fit together across the Enquiry and the Dialogues.",
                },
              ],
              children: [
                {
                  id: "nat-b-ground",
                  side: "theist",
                  label: "The contingency argument shows one source, and it is good",
                  gist: "Fine-tuning is one strand of a larger case, and the contingency argument adds a single source that exists of itself, lacks nothing, and so is good.",
                  body: [
                    "Hume's rule applies to an argument taken alone, and the tuning argument is one strand of a [[cumulative-case|cumulative case]], several arguments that together raise the odds. The ((nat-b-exist|contingency argument)) supplies what tuning cannot, a source that exists of itself. {{aquinas}} argued that there can be only one such source (*Summa Theologiae* I q.11 a.3).",
                    "Aquinas argues that the rest follows from what such a source is. What exists by its own nature, without receiving existence from anything, has nothing outside it to limit it: “Since therefore God is subsisting being itself, nothing of the perfection of being can be wanting to Him” (I q.4 a.2). Goodness, for Aquinas, is being considered as worth desiring (I q.5 a.1). The tuning then tells us that this unlimited source made a world fit for life. {{swinburne}} and {{collins}} defend cumulative cases of this general kind, though neither relies on Aquinas's steps.",
                  ],
                  quote: {
                    text: "If then many gods existed, they would necessarily differ from each other. Something therefore would belong to one which did not belong to another. And if this were a privation, one of them would not be absolutely perfect; but if a perfection, one of them would be without it.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.11 a.3 (trans. English Dominican Province)",
                    url: "https://www.newadvent.org/summa/1011.htm#article3",
                  },
                  thinkers: ["aquinas", "collins", "swinburne"],
                  cedes:
                    "If a source that exists of itself could still be limited, or one of many, or indifferent to the good, this reply would fail.",
                  see: [{ id: "coh-c-nature", why: "Goodness as what God is, argued in Objection I." }],
                  sources: [
                    {
                      title: "Summa Theologiae I q.11 a.3",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1011.htm#article3",
                      note: "Aquinas's three arguments that God is one.",
                    },
                    {
                      title: "Summa Theologiae I q.4 a.2",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1004.htm#article2",
                      note: "Why being that subsists of itself lacks no perfection.",
                    },
                    {
                      title: "Summa Theologiae I q.5 a.1",
                      by: "Thomas Aquinas",
                      url: "https://www.newadvent.org/summa/1005.htm#article1",
                      note: "Where Aquinas says goodness and being are the same thing, with goodness adding the idea of being desirable.",
                    },
                  ],
                  children: [
                    {
                      id: "nat-b-gap",
                      side: "skeptic",
                      label: "Something that has to exist need not be a mind, or good",
                      gist: "Grant the contingency argument and it gives something that exists of itself, with no sign that it chooses or loves, and the world it grounds looks indifferent.",
                      body: [
                        "Even if the contingency argument works, it delivers a source that exists of itself and says nothing about its character. Nothing in ‘exists by its own nature’ says ‘thinks’, ‘chooses’ or ‘loves’. ((nat-b-necess|Spinoza)) accepts the necessary being and identifies it with Nature itself, which is one, unlimited and perfect in his sense, and chooses nothing. He held “that nature has no particular goal in view, and that final causes are mere human figments” (*Ethics* I, Appendix). Aquinas gets from unlimited being to goodness by defining goodness as being considered as worth desiring. That definition does not show that the source cares what becomes of us. Hume's rule says to look at the effect. Philo surveyed a world that mixes good and ill and drew his conclusion from it. Tuning plus contingency yields a necessary source of a world like that, which fits Spinoza's God, or no God at all, better than the God of the creeds.",
                      ],
                      quote: {
                        text: "The true conclusion is, that the original Source of all things is entirely indifferent to all these principles; and has no more regard to good above ill, than to heat above cold, or to drought above moisture, or to light above heavy.",
                        who: "Philo, in David Hume's Dialogues",
                        cite: "Dialogues Concerning Natural Religion, pt. XI (1779)",
                        url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap11",
                      },
                      thinkers: ["spinoza", "hume", "aquinas"],
                      cedes:
                        "If being that exists of itself were shown, by that fact alone, to be a mind that knows and wills the good of its creatures, this would fall.",
                      see: [
                        { id: "nat-b-necess", why: "Spinoza's version of a source that has to exist." },
                        { id: "coh-c-spinoza", why: "Why, for Spinoza, ‘good’ is no property of God." },
                      ],
                      sources: [
                        {
                          title: "Dialogues Concerning Natural Religion, pt. XI",
                          by: "David Hume",
                          year: "1779",
                          url: "https://www.gutenberg.org/cache/epub/4583/pg4583-images.html#chap11",
                          note: "Philo's survey of the world's good and ill, which ends with his verdict that its source cares for neither.",
                        },
                        {
                          title: "Ethics, pt. I, Appendix",
                          by: "Benedict de Spinoza, trans. R. H. M. Elwes",
                          year: "1677",
                          url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap01",
                          note: "Spinoza's attack on the idea that nature acts for ends, at the close of Part I.",
                        },
                        {
                          title: "Cosmological Argument",
                          by: "Stanford Encyclopedia of Philosophy",
                          url: "https://plato.stanford.edu/entries/cosmological-argument/",
                          note: "Section 10 asks whether the necessary being the argument reaches would be God.",
                        },
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
          label: "Only a God who meant us to know explains why minds track truth",
          gist: "Selection rewards behavior that keeps creatures alive, true beliefs or not, so someone who thinks nature is all there is can't fully trust her own evolved reason.",
          body: [
            "{{plantinga}}'s [[eaan|evolutionary argument against naturalism]], the view that nature is all there is, holds that selection cares what a creature does and not whether its beliefs are true. Given naturalism plus evolution, he argues, the chance that our faculties are reliable is low, or impossible even to estimate. He wrote in 2007: “It's as likely, given unguided evolution, that we live in a sort of dream world as that we actually know something about ourselves and our world.” Then anyone who holds naturalism has a [[defeater|defeater]], a reason to doubt every belief their faculties produce, naturalism included. If God made minds to know the world, the problem does not arise.",
            "{{darwin}} felt the doubt himself, though he aimed it at his sense that the universe is not the result of chance. {{lewis-cs}} made an earlier version in *Miracles* (1947) and rewrote that chapter in 1960 after the philosopher Elizabeth Anscombe criticized it in 1948. ((nat-b-parallel|Spinoza)) would say his Nature, which includes thought, escapes the argument.",
          ],
          quote: {
            text: "But then with me the horrid doubt always arises whether the convictions of man's mind, which has been developed from the mind of the lower animals, are of any value or at all trustworthy. Would any one trust in the convictions of a monkey's mind, if there are any convictions in such a mind?",
            who: "Charles Darwin",
            cite: "Letter to William Graham, 3 July 1881",
            url: "https://www.darwinproject.ac.uk/letter/DCP-LETT-13230.xml",
          },
          thinkers: ["plantinga", "darwin", "lewis-cs"],
          cedes:
            "If evolution were shown to favor true belief as such, about cosmology and logic as much as about food and predators, Plantinga's argument would collapse.",
          see: [
            { id: "hid-designed-faculty", why: "The same reasoning in reverse, where a natural origin need not make a faculty unreliable." },
            { id: "evi-a-function", why: "Plantinga's account of knowledge as true belief from faculties working as designed, applied to belief in God." },
          ],
          sources: [
            {
              title: "Where the Conflict Really Lies, ch. 10",
              by: "Alvin Plantinga",
              year: "2011",
              note: "The fullest statement of the argument, in the last chapter of Plantinga's book on science and religion.",
            },
            {
              title: "Letter to William Graham",
              by: "Charles Darwin",
              year: "1881",
              url: "https://www.darwinproject.ac.uk/letter/DCP-LETT-13230.xml",
              note: "Darwin's letter with the “horrid doubt”, in the Darwin Correspondence Project.",
            },
            {
              title: "The Dawkins Confusion: Naturalism ad absurdum",
              by: "Alvin Plantinga, Books & Culture",
              year: "2007",
              url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html",
              note: "A short version of the argument, at the end of Plantinga's review of Dawkins.",
            },
            {
              title: "Miracles, ch. III",
              by: "C. S. Lewis",
              year: "1947, rev. 1960",
              note: "Titled “The Self-Contradiction of the Naturalist” in 1947, and rewritten as “The Cardinal Difficulty of Naturalism” after Anscombe's criticism.",
            },
          ],
          children: [
            {
              id: "nat-b-adaptive",
              side: "skeptic",
              label: "Selection favors minds that track the truth",
              gist: "Creatures that misjudge food, cliffs and predators die young, and getting the world right is the easiest general way to act well, so evolution should favor reliable minds.",
              body: [
                "Selection acts on behavior, and true beliefs usually help a creature act well. A gazelle that takes the lion for a bush leaves few grandchildren. Plantinga imagines a hominid who wants to be eaten by a tiger but runs from each one because he thinks it unlikely to eat him. The philosopher William Ramsey argued in 2002 that such a creature needs a matching false desire for every false belief, which is far harder to evolve than getting things right.",
                "{{fitelson}} and {{sober}} reply that Plantinga's low probability has no support, and that the believer is in the same position: “The theist, like the evolutionary naturalist, is unable to construct a non-question-begging argument that refutes global skepticism.” Evolution also predicts what we find, minds that handle medium-sized objects and other people well and go wrong about probability and the very large and small, which may be why we needed science to check ourselves.",
              ],
              quote: {
                text: "Creatures inveterately wrong in their inductions have a pathetic but praiseworthy tendency to die before reproducing their kind.",
                who: "W. V. Quine",
                cite: "“Natural Kinds” (1969)",
              },
              thinkers: ["quine", "fitelson", "sober"],
              cedes:
                "If false beliefs steered behavior as well as true ones across the situations animals face, this would fail.",
              see: [{ id: "hid-csr-both-ways", why: "Explaining a belief away by its origins, aimed at belief in God instead." }],
              sources: [
                {
                  title: "Plantinga's Probability Arguments Against Evolutionary Naturalism",
                  by: "Branden Fitelson and Elliott Sober, Pacific Philosophical Quarterly",
                  year: "1998",
                  url: "https://drive.google.com/file/d/19GqbeQynpdMGiagSp0nrW051j--wKjVI/view?usp=share_link",
                  note: "The main probability-based critique of Plantinga. The link is Sober's own copy of the November 1997 preprint. Plantinga answered it in the same journal in 2003.",
                },
                {
                  title: "Naturalism Defeated?",
                  by: "James Beilby (ed.)",
                  year: "2002",
                  note: "Includes William Ramsey's point that false beliefs would need matching false desires to work.",
                },
                {
                  title: "Natural Kinds",
                  by: "W. V. Quine, in Essays in Honor of Carl G. Hempel",
                  year: "1969",
                  note: "Quine's essay on induction and similarity, with the line about creatures wrong in their inductions.",
                },
              ],
              children: [
                {
                  id: "nat-b-content",
                  side: "theist",
                  label: "Selection rewards useful beliefs whether or not they're true",
                  gist: "If beliefs are brain states, they move the body through their wiring, so selection can favor useful wiring whether the beliefs it carries are true or false.",
                  body: [
                    "The gazelle story assumes that a belief's content, what it says about the world, is what moves the legs. If materialism is true, a belief is a brain state that causes behavior through its wiring. {{plantinga}} argues that if content does no causal work, selection is blind to it, and if content rides along on neural properties, those properties do the pushing and the same useful wiring could go with any content at all. Either way, he wrote in 2007, the wiring may be adaptive, “but nothing follows about the *truth of the beliefs* depending on that neurophysiology.” Even granting reliability about survival, nothing secures it for beliefs about the universe's origin, mathematics or naturalism itself, which made no difference to survival. Plantinga denies begging the question in return, since he claims only that naturalism, by its own account, gives its holder a reason to distrust it, and belief in God does not.",
                  ],
                  quote: {
                    text: "Boiled down to essentials, a nervous system enables the organism to succeed in the four F's: feeding, fleeing, fighting and reproducing. … Truth, whatever that is, definitely takes the hindmost.",
                    who: "Patricia Churchland, as Plantinga quotes her",
                    cite: "“Epistemology in the Age of Neuroscience,” Journal of Philosophy 84 (1987), p. 548",
                  },
                  thinkers: ["plantinga"],
                  cedes:
                    "An account of the brain on which selection rewards what a belief says, as well as its wiring, would answer this.",
                  see: [{ id: "evi-a-defeaters", why: "Defeaters and basic beliefs, the same tools used in Objection IV." }],
                  sources: [
                    {
                      title: "Epistemology in the Age of Neuroscience",
                      by: "Patricia S. Churchland, Journal of Philosophy",
                      year: "1987",
                      note: "The article Plantinga quotes on what nervous systems are for. The line is on p. 548.",
                    },
                    {
                      title: "The Dawkins Confusion: Naturalism ad absurdum",
                      by: "Alvin Plantinga, Books & Culture",
                      year: "2007",
                      url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html",
                      note: "Plantinga's short version of the claim that adaptive wiring tells us nothing about true belief.",
                    },
                    {
                      title: "Mental Causation",
                      by: "Stanford Encyclopedia of Philosophy",
                      url: "https://plato.stanford.edu/entries/mental-causation/",
                      note: "On whether what a belief says can make any difference to what the body does.",
                    },
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
                        url: "https://archive.org/details/inquiryintohuman00reidiala",
                      },
                      thinkers: ["millikan", "papineau", "dretske", "bergmann", "reid"],
                      cedes:
                        "This holds unless the evolutionary account of meaning fails for abstract beliefs, the ones about logic, mathematics and metaphysics.",
                      see: [{ id: "evi-a-basic", why: "The idea of basic belief that this reply borrows." }],
                      sources: [
                        {
                          title: "Teleological Theories of Mental Content",
                          by: "Stanford Encyclopedia of Philosophy",
                          url: "https://plato.stanford.edu/entries/content-teleological/",
                          note: "Peter Schulte and Karen Neander on the theories of Millikan, Papineau and Dretske, and on the problems Fodor raised.",
                        },
                        {
                          title: "Language, Thought, and Other Biological Categories",
                          by: "Ruth Garrett Millikan",
                          year: "1984",
                          note: "Millikan's founding statement of the view that meaning comes from biological function.",
                        },
                        {
                          title: "Commonsense Naturalism",
                          by: "Michael Bergmann, in Naturalism Defeated?",
                          year: "2002",
                          note: "Bergmann's reply to Plantinga, drawing on Reid, that a naturalist may trust her faculties without arguing for them.",
                        },
                        {
                          title: "An Inquiry into the Human Mind, on the Principles of Common Sense",
                          by: "Thomas Reid",
                          year: "1764",
                          url: "https://archive.org/details/inquiryintohuman00reidiala",
                          note: "Reid's defense of common sense. The “same shop” passage is in chapter VI, section XX. The scan is the 1823 edition.",
                        },
                      ],
                      children: [
                        {
                          id: "nat-b-loose",
                          side: "theist",
                          label: "Selection leaves meaning loose, and basic trust can be defeated",
                          gist: "Selection can't tell a belief about flies from one about small dark moving things, and even basic trust gives way once you learn your faculties may be unreliable.",
                          body: [
                            "Selection can fix what a belief is about only as precisely as the behavior it rewards. A frog's tongue-snap was selected for catching flies, but every fly it caught was also a small dark moving thing, so nothing in its history settles whether its fly-detector means *fly* or *small dark moving thing*. {{fodor}} made this point in 1990. {{plantinga}} concluded in 2011 that where content is undetermined, so is truth, especially for beliefs about logic, mathematics and naturalism.",
                            "Plantinga answered Bergmann that a [[properly-basic|properly basic]] belief, though reasonable without argument, can still be overturned by evidence. If you learn you took a drug that makes most users' reasoning unreliable, your trust in your own is defeated, basic or not. A naturalist who accepts evolution has learned much the same and cannot argue the [[defeater|defeater]] away without using those faculties.",
                          ],
                          quote: {
                            text: "So the naturalist has a defeater for naturalism; naturalism, therefore, is self-defeating and cannot be rationally believed.",
                            who: "Alvin Plantinga",
                            cite: "“The Dawkins Confusion,” Books & Culture, March/April 2007",
                            url: "https://www.booksandculture.com/articles/2007/marapr/1.21.html",
                          },
                          thinkers: ["fodor", "plantinga", "bergmann"],
                          cedes:
                            "This would fail if selection could be shown to fix definite content for beliefs about logic and metaphysics, or if basic trust could survive learning that one's faculties are probably unreliable.",
                          see: [{ id: "evi-a-defeaters", why: "Defeaters for basic beliefs, aimed at belief in God in Objection IV." }],
                          sources: [
                            {
                              title: "A Theory of Content and Other Essays",
                              by: "Jerry A. Fodor",
                              year: "1990",
                              note: "Includes Fodor's frog, his case against grounding meaning in biological function.",
                            },
                            {
                              title: "Content and Natural Selection",
                              by: "Alvin Plantinga, Philosophy and Phenomenological Research",
                              year: "2011",
                              note: "Plantinga's reply to teleosemantics, arguing that selection leaves the content of abstract beliefs undetermined.",
                            },
                            {
                              title: "Reply to Beilby's Cohorts",
                              by: "Alvin Plantinga, in Naturalism Defeated?",
                              year: "2002",
                              note: "Plantinga's answers to his critics in the volume, Bergmann among them.",
                            },
                            {
                              title: "Teleological Theories of Mental Content, §4.1",
                              by: "Stanford Encyclopedia of Philosophy",
                              url: "https://plato.stanford.edu/entries/content-teleological/",
                              note: "The section on functional indeterminacy, which sets out Fodor's frog case.",
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
              id: "nat-b-parallel",
              side: "spinoza",
              label: "Minds track truth because thought and things are one order",
              gist: "Mind and matter are two sides of one Nature, so the order of ideas matches the order of things, and reason fits the world without anyone designing the fit.",
              body: [
                "Plantinga's argument targets materialism, the view that only matter is real, which {{spinoza}} rejected. For him thought is an attribute, a basic aspect, of [[deus-sive-natura|God, or Nature]]. Extension, or things as bodies in space, is another, and both run in one order (*Ethics* II P7). Your mind is the idea of your body, the same thing grasped as thought. So knowledge by reason, built on [[common-notions|common notions]] (ideas of what all bodies share, ours included), is necessarily true (II P41).",
                "On his view mind and world fit without luck or a designer, since they are one reality described in two ways. Matter that feels is no puzzle either, since individual things, Spinoza wrote, “though in different degrees, are animated” (II P13 Schol.), a view the atheist {{nagel}} takes seriously. Spinoza sees no need for the person believers add, with ((nat-b-reasons|free choice)) and ((coh-c-person|a will that binds)).",
              ],
              quote: {
                text: "The order and connection of ideas is the same as the order and connection of things.",
                who: "Spinoza",
                cite: "Ethics II P7 (1677), trans. Elwes",
                url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap02",
              },
              thinkers: ["spinoza", "nagel"],
              cedes:
                "If an impersonal Nature that includes thought could be shown unable to ground true knowledge in finite minds, Spinoza's answer would fail.",
              see: [
                { id: "coh-a-analogy", why: "Aquinas's analogy across the gap between God and us. For Spinoza our thought is part of God's and the same in kind." },
                { id: "coh-a-dogstar", why: "Why Spinoza still denies God an intellect like ours." },
              ],
              sources: [
                {
                  title: "Ethics, pt. II",
                  by: "Benedict de Spinoza, trans. R. H. M. Elwes",
                  year: "1677",
                  url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap02",
                  note: "Part II, on the mind. P7 states the single order of ideas and things, and P13 calls the mind the idea of the body.",
                },
                {
                  title: "Mind and Cosmos",
                  by: "Thomas Nagel",
                  year: "2012",
                  note: "Nagel, an atheist, argues that materialism can't account for mind, and gives the idea that mind is basic to nature a serious hearing.",
                },
                {
                  title: "Spinoza's Theory of Attributes",
                  by: "Stanford Encyclopedia of Philosophy",
                  url: "https://plato.stanford.edu/entries/spinoza-attributes/",
                  note: "How thought and extension relate in Spinoza's system, and how to read II P7.",
                },
                {
                  title: "Panpsychism",
                  by: "Stanford Encyclopedia of Philosophy",
                  url: "https://plato.stanford.edu/entries/panpsychism/",
                  note: "Counts Spinoza among the historical panpsychists and surveys the view's modern revival.",
                },
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
      "{{spinoza}} thought the word *miracle* names a gap in what the audience knows. Miracles, he wrote, “are only intelligible as in relation to human opinions, and merely mean events of which the natural cause cannot be explained by a reference to any ordinary occurrence, either by us, or at any rate, by the writer and narrator of the miracle” (*Theologico-Political Treatise* ch. 6, 1670). So he can grant every well-attested cure in ((nat-a-keener|the healing reports)) and lose nothing. Even the wonders of the Exodus, he argued, could not give the Egyptians and the Jews a true idea of God, and could only make them “admit that there was a Deity more powerful than anything known to them” (ch. 6). Since he saw no “sound reason for limiting the power and efficacy of nature,” no event could show where nature's powers end.",
      "On explanation he sides with Leibniz and Aquinas against the skeptic who accepts brute facts. He held the principle of sufficient reason without exception (*Ethics* I P11), so he cannot say with Russell that the universe is just there, or call life-friendly physics a lucky draw. Of the three things the Defender says God explains, he thinks two, why anything exists and why minds track truth (II P7), are solved without a person. He rejects the third as badly posed. Nature aims at nothing, [[final-causes|final causes]] (purposes in nature) are human inventions, and the constants are what Nature necessarily is (I Appendix, I P33).",
      "He parts from believers at the step from *God explains nature* to *someone chose nature*. His God has infinite intellect and loves itself with an [[amor-dei-intellectualis|intellectual love]] (V P35–36), but has no will that picks among options (I P32–33). The Spinoza scholar {{della-rocca}} defends ((nat-b-contrast|his demand for a reason why this and not that)) today. Spinoza is on weaker ground with ((nat-b-tune|the physics)), which has so far found nothing that makes the constants necessary.",
    ],
    quote: {
      text: "So they will pursue their questions from cause to cause, till at last you take refuge in the will of God—in other words, the sanctuary of ignorance.",
      who: "Spinoza",
      cite: "Ethics I, Appendix (1677), trans. Elwes",
      url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap01",
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
      url: "https://www.gutenberg.org/cache/epub/9662/pg9662-images.html#section10",
      note: "Hume's argument that no report of a miracle should be believed. It first appeared in Philosophical Essays (1748) and has been called the Enquiry since 1758.",
    },
    {
      title: "Dialogues Concerning Natural Religion",
      by: "David Hume",
      year: "1779",
      url: "https://www.gutenberg.org/ebooks/4583",
      note: "Hume's dialogue on design and on a necessary being, published after his death. Philo's objections lie behind several of the Objector's moves here.",
    },
    {
      title: "Summa Theologiae I q.105, “The change of creatures by God”",
      by: "Thomas Aquinas",
      url: "https://www.newadvent.org/summa/1105.htm",
      note: "Articles 6 to 8 give Aquinas's account of miracles as God acting outside the order he freely set up.",
    },
    {
      title: "A Theologico-Political Treatise, ch. 6, “Of Miracles”",
      by: "Benedict de Spinoza, trans. R. H. M. Elwes",
      year: "1670",
      url: "https://www.gutenberg.org/cache/epub/990/pg990-images.html#chap06",
      note: "Spinoza's case that a miracle would contradict God's own decrees, and that the word only marks the limits of what people know.",
    },
    {
      title: "Miracles: A Preliminary Study",
      by: "C. S. Lewis",
      year: "1947, rev. 1960",
      note: "Lewis's defense of miracles for general readers, with chapters on Hume and on whether naturalism undermines reason.",
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
      title: "Arguing about Gods",
      by: "Graham Oppy",
      year: "2006",
      note: "Oppy argues that no argument about God's existence should persuade every reasonable person, and treats cosmological and design arguments at length.",
    },
    {
      title: "The Principle of Sufficient Reason: A Reassessment",
      by: "Alexander R. Pruss",
      year: "2006",
      note: "A book-length defense of the principle that everything has a reason, which the contingency argument needs.",
    },
    {
      title: "Where the Conflict Really Lies: Science, Religion, and Naturalism",
      by: "Alvin Plantinga",
      year: "2011",
      note: "Plantinga argues that science fits Christian belief and conflicts with naturalism. The last chapter is his evolutionary argument.",
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
      note: "About a dozen critics take on Plantinga's argument, and he answers them.",
    },
  ],
};

export default nature;
