import type { Objection } from "../types";

/* Objection IV · Evidence.
   Part A: the ethics of belief (believing beyond the evidence) and
   Part B: the Gospels as evidence. Each child attacks its parent. Quotes were
   checked against the cited public-domain texts (Elwes's Spinoza, Cunningham,
   Menzies, Salmond, Crombie, Tanner, Whiston's Josephus, Beveridge's Calvin,
   Trotter's Pascal, the KJV, the English Dominican Summa on New Advent,
   Hume's Enquiry, Reid's Inquiry, Paley, Butler, Clifford, James, Church
   and Brodribb's Tacitus, Stewart and Long's Plutarch, the 1662 Book of
   Common Prayer, the 1879 English Strauss), the Vatican's English texts of
   Dei Verbum and Providentissimus Deus, or, for Plantinga and the Martin
   passage he quotes, Warranted Christian Belief on CCEL. */

const evidence: Objection = {
  id: "evidence",
  numeral: "IV",
  short: "Evidence",
  title: "Faith asks for more than the evidence gives",
  objection:
    "Christianity asks people to believe more firmly than the evidence allows, and the four Gospels, its main evidence, contradict each other.",
  counter:
    "Alvin Plantinga argues that belief in God can be rational without proof, the way belief in other minds is. The contradictions refute strict inerrancy, the claim that the Bible contains no errors at all, and the creeds never required that. The case for the resurrection rests on facts most critical scholars accept. Jesus was crucified, his followers sincerely believed they saw him alive afterwards, and Paul and Jesus's brother James, who had not followed him, came to believe he had risen.",
  dek:
    "W. K. Clifford argued in 1877 that it is wrong to believe anything on insufficient evidence, and the main evidence for Christianity is four Gospels, written decades after the events, that disagree on details. Alvin Plantinga and other Christian philosophers answer that belief in God needs no proof, any more than trust in your memory does. Scholars such as Gary Habermas, Mike Licona and N. T. Wright argue that the history, read carefully, is strong anyway. Plantinga thinks faith doesn't need the history the others defend.",
  question: "Can Christian belief be rational without proof, when its main witnesses disagree?",

  prongs: [
    /* ───────────────────────── Part A: the ethics of belief ───────────────────────── */
    {
      id: "evi-a",
      side: "skeptic",
      label: "Believing beyond the evidence is wrong, and faith does it",
      gist: "A belief should be only as firm as its evidence, and Christian faith is firmer than its evidence.",
      body: [
        "{{clifford}} opened his 1877 essay with a shipowner who quiets his doubts about an old ship and collects the insurance when she sinks with everyone aboard. The man is guilty, Clifford says, because “he had no right to believe on such evidence as was before him”, and he would be guilty even if she had come home. {{hume}} had stated the principle in 1748: “A wise man, therefore, proportions his belief to the evidence.” Philosophers now call this view [[evidentialism|evidentialism]].",
        "The New Testament asks for more than proportioned belief. Jesus blesses those “that have not seen, and yet have believed” (John 20:29), and John's Gospel warns that “he that believeth not is condemned already” (3:18). {{aquinas}} quotes Pope Gregory, “there is no merit in believing what is shown by reason”, and answers him, but his own definition says that to believe is to assent to divine truth “at the command of the will” (Summa II-II q.2 a.9). If the will has to command the assent, the evidence alone was not enough.",
      ],
      quote: {
        text: "To sum up: it is wrong always, everywhere, and for anyone, to believe anything upon insufficient evidence.",
        who: "W. K. Clifford",
        cite: "“The Ethics of Belief” (1877), pt. I",
      },
      thinkers: ["clifford", "hume", "aquinas"],
      cedes:
        "This would fall if someone with no stake in the outcome weighed the evidence for the Christian God and found it strong enough to carry the confidence the creeds ask for.",
      see: [
        { id: "hid-argument", why: "Objection II asks why God, if he wants to be believed, would leave the evidence this thin." },
        { id: "mor-hell", why: "Objection V asks whether condemning people for unbelief could ever be just." },
      ],
      sources: [
        { title: "The Ethics of Belief", by: "W. K. Clifford", year: "1877", url: "https://en.wikisource.org/wiki/The_Ethics_of_Belief" },
        { title: "An Enquiry concerning Human Understanding, sect. X, “Of Miracles”", by: "David Hume", year: "1748", url: "https://www.gutenberg.org/ebooks/9662" },
        { title: "Evidentialism: Essays in Epistemology", by: "Earl Conee & Richard Feldman", year: "2004" },
      ],
      children: [
        {
          id: "evi-a-basic",
          side: "theist",
          label: "Like belief in other minds, belief in God needs no proof",
          gist: "Nobody can prove that other people have minds or that memory works, yet believing both is rational, and belief in God can be rational in the same way.",
          body: [
            "Clifford's rule would condemn trusting memory or believing that other people have minds, since nobody has proved either. {{plantinga}} argued in 1983 that the rule also fails its own test. It comes from [[classical-foundationalism|classical foundationalism]], which allows only beliefs that are self-evident, evident to the senses or impossible to be wrong about, or else proved from such beliefs, a standard that is itself none of these.",
            "In *Warranted Christian Belief* (2000) Plantinga calls a belief [[properly-basic|properly basic]] when it is reasonable to hold without argument because it comes from a faculty working properly, as memory does. {{calvin}} taught that God gave everyone a natural [[sensus-divinitatis|sense of the divine]], and Plantinga's [[aquinas-calvin-model|extended model]] of Christian belief adds the inner witness of the Holy Spirit. He claims only that belief in God *can* be rational without proof.",
          ],
          quote: {
            text: "Why, Sir, should I believe the faculty of reason more than that of perception; they came both out of the same shop, and were made by the same artist; and if he puts one piece of false ware into my hands, what should hinder him from putting another?",
            who: "Thomas Reid",
            cite: "An Inquiry into the Human Mind (1764), ch. 6, sect. 20",
          },
          thinkers: ["plantinga", "reid", "calvin"],
          cedes:
            "If someone found a fair test for basic belief that lets in memory, perception and other minds but keeps out belief in God, this would fail.",
          see: [
            { id: "evi-b-minimal", why: "Habermas argues from history, which Plantinga says faith doesn't need." },
            { id: "hid-sensus", why: "Objection II uses the same faculty, damaged by sin, to explain why honest people can miss God." },
          ],
          sources: [
            { title: "Reason and Belief in God", by: "Alvin Plantinga", year: "1983", note: "In Plantinga & Wolterstorff, eds., Faith and Rationality." },
            { title: "Warranted Christian Belief", by: "Alvin Plantinga", year: "2000", url: "https://www.ccel.org/ccel/plantinga/warrant3" },
            { title: "An Inquiry into the Human Mind, on the Principles of Common Sense", by: "Thomas Reid", year: "1764", url: "https://archive.org/details/inquiryintohuman00reiduoft", note: "Ch. 6, sect. 20. The 1818 printing is linked." },
            { title: "The Epistemology of Religion", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/religion-epistemology/" },
          ],
          children: [
            {
              id: "evi-a-pumpkin",
              side: "skeptic",
              label: "Then any creed can call itself basic, Great Pumpkin included",
              gist: "If Christians may believe in God without evidence, any group can excuse its own beliefs the same way, and belief in God, unlike belief in other minds, isn't universal.",
              body: [
                "If belief in God can be basic, reasonable without argument, why not belief in the Great Pumpkin, who in Plantinga's words “returns every Halloween to the most sincere pumpkin patch”? Plantinga raised the worry and dismissed it, since allowing some beliefs doesn't allow all. {{martin-michael}}, an atheist philosopher, pressed a harder version in 1990. Any community, voodoo followers included, could use Plantinga's method, starting from its own examples of obviously rational belief, and call its own beliefs basic.",
                "Belief in other minds is universal and confirmed hourly as people act as expected, while many careful people don't believe in God at all. [[csr|The cognitive science of religion]] explains why so many others sense gods anyway, without needing a God. Minds may have evolved to detect agents everywhere, because mistaking the wind for a predator does little harm and missing one can kill you (Stewart Guthrie, Pascal Boyer).",
              ],
              quote: {
                text: "Plantinga’s proposal would generate many different communities that could legitimately claim that their basic beliefs are rational.",
                who: "Michael Martin",
                cite: "Atheism: A Philosophical Justification (1990), p. 272, as quoted in Plantinga, Warranted Christian Belief, ch. 10",
              },
              thinkers: ["martin-michael", "plantinga"],
              cedes:
                "This would lose its force if belief in God turned out to be nearly as universal, and as steadily confirmed, as belief in other minds.",
              see: [
                { id: "hid-csr-both-ways", why: "Objection II aims the same agent-detection argument at divine hiddenness." },
                { id: "evi-b-natural", why: "History raises the same problem, since sincere witnesses show that people believed and leave open whether they were right." },
              ],
              sources: [
                { title: "Atheism: A Philosophical Justification", by: "Michael Martin", year: "1990" },
                { title: "Warranted Christian Belief, ch. 10, “Son of Great Pumpkin?”", by: "Alvin Plantinga", year: "2000", url: "https://ccel.org/ccel/plantinga/warrant3/warrant3.vi.v.iv.html" },
              ],
              children: [
                {
                  id: "evi-a-function",
                  side: "theist",
                  label: "Whether belief in God is rational depends on whether God exists",
                  gist: "Plantinga says a belief needs no argument if it comes from a faculty working as designed, so if God made us to sense him, belief in God qualifies.",
                  body: [
                    "Plantinga replies that Martin confuses having [[warrant|warrant]], the property that turns a true belief into knowledge and requires properly working faculties in the right setting, with doing your honest best, which the Pumpkin believer may well be doing. The Pumpkin belief also meets a [[defeater|defeater]], a reason that overturns it, in the empty patch on November 1st. A reliable faculty may be rare, like perfect pitch, and on the Christian story sin has damaged this one.",
                    "Finding a natural cause for the sense of God doesn't show that it misleads. If God works through [[primary-secondary-causation|secondary causes]], ordinary natural processes, a believer would expect a natural mechanism, and to call it misleading the critic must already assume there is no God. Plantinga concludes that [[de-jure-de-facto|whether belief in God is rational]] depends on whether it is true.",
                  ],
                  quote: {
                    text: "a successful atheological objection will have to be to the truth of theism, not to its rationality, justification, intellectual respectability, rational justification, or whatever.",
                    who: "Alvin Plantinga",
                    cite: "Warranted Christian Belief (2000), ch. 6, sect. III",
                  },
                  thinkers: ["plantinga"],
                  cedes:
                    "It fails if someone can show the sense of God to be unreliable without first assuming that there is no God.",
                  see: [
                    { id: "coh-a-concur", why: "How God works through natural causes without competing with them, from the reply to Objection I." },
                    { id: "nat-b-minds", why: "Objection III turns the worry around and asks why faculties shaped by unguided evolution should be trusted at all." },
                    { id: "hid-designed-faculty", why: "Objection II argues that a natural faculty that overshoots can still be God's design." },
                  ],
                  sources: [
                    { title: "Warranted Christian Belief, ch. 6, sect. III", by: "Alvin Plantinga", year: "2000", url: "https://ccel.org/ccel/plantinga/warrant3/warrant3.vi.i.iii.html" },
                  ],
                  children: [
                    {
                      id: "evi-a-defeaters",
                      side: "skeptic",
                      label: "Answering objections means weighing evidence after all",
                      gist: "Even a belief held without argument can be overturned, and answering the objections that might overturn it means weighing evidence.",
                      body: [
                        "Plantinga lets evidence back in through his own conditions. A basic belief keeps its warrant only while it faces no unanswered [[defeater|defeaters]], reasons that would overturn it, and in *Warranted Christian Belief* Plantinga takes up historical criticism of the Bible, religious pluralism, and suffering and evil. A believer who has read the Gospels side by side and buried a child has met these defeaters and has to answer them.",
                        "Whether she can answer them depends on her evidence, and deciding that doesn't require first assuming there is no God. Plantinga's fallback, that a basic belief may outweigh its defeaters, would serve the Pumpkin believer too. That leaves answering each defeater, as Plantinga does when he charges that biblical critics assume God never acts in history ([[methodological-naturalism|methodological naturalism]]), and that means weighing evidence about ((evi-b|the Gospels)), ((hid-argument|hiddenness)) and evil.",
                      ],
                      quote: {
                        text: "No simplicity of mind, no obscurity of station, can escape the universal duty of questioning all that we believe.",
                        who: "W. K. Clifford",
                        cite: "“The Ethics of Belief” (1877), pt. I",
                      },
                      thinkers: ["plantinga", "clifford"],
                      cedes:
                        "If a believer who knew these objections could stay rational without weighing any argument about them, I'd be wrong.",
                      see: [
                        { id: "evi-b-core", why: "Historical criticism of the Bible as a defeater, the subject of Plantinga's own chapter on it." },
                        { id: "nat-b-content", why: "In Objection III Plantinga turns the same reasoning about defeaters against naturalism." },
                      ],
                      sources: [
                        { title: "Warranted Christian Belief, Part IV, “Defeaters?”", by: "Alvin Plantinga", year: "2000", url: "https://ccel.org/ccel/plantinga/warrant3/warrant3.vii.html" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "evi-a-imagination",
              side: "spinoza",
              label: "A God you feel comes from imagination, the only source of error",
              gist: "Spinoza held that reason can know God with certainty, but a God you sense comes from imagination, the only kind of knowing that produces error.",
              body: [
                "Spinoza held, against Clifford, that God can be known with certainty: “The human mind has an adequate knowledge of the eternal and infinite essence of God” (Ethics II P47). By adequate he meant complete and true. But he denied that a felt sense of God can be trusted, which parts him from Plantinga. The first of his three kinds of knowledge is [[imaginatio|imagination]], built from images and hearsay, and it “is the only source of falsity” (II P41).",
                "Prophecy belongs to the first kind, and so does any sense of God that shows him as sight shows a tree. The *Treatise* notes that cheerful prophets were shown victories and peace, and melancholy ones wars and massacres (ch. 2), which on his view is why the God people feel has moods and favourites. Intuition, his highest kind of knowledge, also works without argument, so what he distrusted was the images. The love of God he valued comes “not in so far as we imagine him as present … but in so far as we understand him to be eternal” (V P32 Cor.).",
              ],
              quote: {
                text: "Therefore the power of prophecy implies not a peculiarly perfect mind, but a peculiarly vivid imagination",
                who: "Spinoza",
                cite: "Theological-Political Treatise ch. 1 (1670), trans. Elwes",
              },
              thinkers: ["spinoza"],
              cedes:
                "Spinoza is wrong if feeling God's presence turns out to be as reliable a guide to what God is like as reasoning about him.",
              see: [{ id: "coh-a-dogstar", why: "Why Spinoza thought 'intellect' and 'will' said of God share only a name with ours, as the constellation called the Dog shares a name with the animal that barks." }],
              sources: [
                { title: "Ethics", by: "Benedict de Spinoza", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "Elwes translation." },
                { title: "A Theologico-Political Treatise", by: "Benedict de Spinoza", year: "1670", url: "https://www.gutenberg.org/ebooks/989", note: "Elwes translation, chs. 1–2." },
              ],
              children: [
                {
                  id: "evi-a-owngod",
                  side: "theist",
                  label: "Spinoza's verdict on the sense of God assumes his own God",
                  gist: "Spinoza's own highest knowledge of God needs no argument either, so he objects only to a God with purposes, which assumes his own God is the true one.",
                  body: [
                    "Spinoza assumes what he should prove. His own highest kind of knowledge, [[scientia-intuitiva|intuitive knowledge]], moves without inference from a complete and true (adequate) idea of God's attributes to the essence of things (Ethics II P40 Schol. 2), so knowing God without argument can't be what he objects to. He objects to the God people sense, one who has purposes and loves. That is a claim about which God is real, and how a belief was formed can't settle it, which is ((evi-a-function|Plantinga's point)) again.",
                    "A vision coloured by the prophet's temperament need not be false. {{calvin}} taught that God, speaking of himself, “lisps with us as nurses are wont to do with little children” (Institutes I.13.1), an idea known as [[accommodation|accommodation]]. {{aquinas}} held that prophets may see in images, and that a man is a prophet only if “his mind be enlightened for the purpose of judgment” (Summa II-II q.173 a.2). Even the *Treatise* tells each believer to “adapt these dogmas to his own way of thinking” (ch. 14).",
                  ],
                  quote: {
                    text: "each man's faith must be judged pious or impious only in respect of its producing obedience or obstinacy, and not in respect of its truth",
                    who: "Spinoza",
                    cite: "Theological-Political Treatise ch. 14 (1670), trans. Elwes",
                  },
                  thinkers: ["calvin", "aquinas", "spinoza"],
                  cedes:
                    "Spinoza wins this point if he can fault the God people feel on grounds that a believer in a personal God would also accept.",
                  see: [{ id: "coh-a-analogy", why: "Why the classical tradition holds that images and words can say true things about God." }],
                  sources: [
                    { title: "Institutes of the Christian Religion, Book I, ch. 13", by: "John Calvin", year: "1559", url: "https://ccel.org/ccel/calvin/institutes.iii.xiv.html", note: "Beveridge translation." },
                    { title: "Summa Theologiae II-II q.173", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/3173.htm", note: "English Dominican translation." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "evi-a-tradition",
          side: "theist",
          label: "Christian tradition backs faith with sound arguments and signs",
          gist: "The main Christian tradition rejected believing without reasons and offers arguments for God, signs that the revelation is credible, and a case built from many clues.",
          body: [
            "The objection treats Christianity as [[fideism|fideism]], the view that faith needs no reasons, which the main tradition condemned. {{aquinas}} answered Gregory that when a willing believer “loves the truth he believes” and looks for reasons, the reasoning is “a sign of greater merit” (Summa II-II q.2 a.10). He held that the [[preambles-of-faith|preambles of faith]], truths such as that God exists, can be proved by reason, and that a believer “would not believe unless, on the evidence of signs, or of something similar, he saw that they ought to be believed” (q.1 a.4). John's Gospel, two verses after blessing those who believe without seeing, says its signs were written “that ye might believe” (20:31).",
            "In England, {{locke}} (1690) made reason the judge of what counts as revelation, {{butler}} (1736) wrote that “probability is the very guide of life”, and {{paley}} (1794) argued like a barrister. {{newman}} explained in 1870 how people reach certainty from many probabilities that point the same way. Philosophers call such an argument a [[cumulative-case|cumulative case]], and {{swinburne}} has built one for God since *The Existence of God* (1979).",
          ],
          quote: {
            text: "Nevertheless, in order that the submission of our faith should be in accordance with reason, it was God's will that there should be linked to the internal assistance of the holy Spirit external indications of his revelation, that is to say divine acts, and first and foremost miracles and prophecies…",
            who: "First Vatican Council",
            cite: "Dei Filius ch. 3 (1870), trans. Tanner",
          },
          thinkers: ["aquinas", "locke", "butler", "paley", "newman", "swinburne"],
          cedes:
            "This fails if the arguments for God and the signs of revelation, taken together, give Christianity no more support than its rivals get.",
          sources: [
            { title: "Dei Filius (Dogmatic Constitution on the Catholic Faith)", by: "First Vatican Council", year: "1870", url: "https://www.papalencyclicals.net/councils/ecum20.htm" },
            { title: "Summa Theologiae II-II qq.1–2", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/3002.htm", note: "English Dominican translation." },
            { title: "The Analogy of Religion", by: "Joseph Butler", year: "1736", url: "https://www.gutenberg.org/ebooks/53346", note: "The line on probability is in the Introduction." },
          ],
          children: [
            {
              id: "evi-a-compelling",
              side: "skeptic",
              label: "No argument compels, and the 'signs' are disputed miracles",
              gist: "After centuries of effort no argument for God convinces most careful thinkers, and the evidence for Christianity in particular, miracles and prophecy, is what is in dispute.",
              body: [
                "Each part of that case is disputed. {{mackie}} weighed the arguments in *The Miracle of Theism* (1982) and found none tips the balance, and {{oppy}} argues that none compels a reasonable non-believer. {{aquinas}} himself held that the Trinity can't be proved, so reason reaches at most a first cause, and {{spinoza}}'s God, which is Nature itself, is a first cause too.",
                "Everything specifically Christian depends on revelation, and the First Vatican Council rested revelation's credibility on “miracles and prophecies”. Defenders must then rely on miracle reports, argued in ((nat-a|Objection III)), and on Gospels that disagree, argued in ((evi-b|Part 2)). A cumulative case must also count the evidence against, such as evil, hiddenness and rival faiths, as Oppy argues. Clues that depend on each other, like a miracle story and the church that told it, can't be counted twice.",
              ],
              quote: {
                text: "It is impossible to attain to the knowledge of the Trinity by natural reason.",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I q.32 a.1, English Dominican trans.",
              },
              thinkers: ["mackie", "oppy", "aquinas", "spinoza"],
              cedes:
                "I'd drop this if one argument for the specifically Christian God, more than a bare first cause, won over a fair share of informed non-believers.",
              see: [{ id: "nat-a-circle", why: "Objection III asks whether miracle reports can be weighed at all, or are ruled out in advance." }],
              sources: [
                { title: "The Miracle of Theism", by: "J. L. Mackie", year: "1982" },
                { title: "Arguing about Gods", by: "Graham Oppy", year: "2006" },
                { title: "Cumulative Cases", by: "Paul Draper", year: "2010", note: "In Taliaferro, Draper & Quinn, eds., A Companion to Philosophy of Religion, 2nd ed." },
                { title: "Summa Theologiae I q.32", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1032.htm", note: "English Dominican translation." },
              ],
            },
          ],
        },
        {
          id: "evi-a-experience",
          side: "theist",
          label: "Religious experience counts as evidence too",
          gist: "If seeming to see a tree is evidence of a tree, seeming to sense God is evidence of God, unless there is a reason for doubt.",
          body: [
            "The objection counts only arguments, but the commonest religious evidence is people's sense of being aware of God. {{swinburne}}'s [[principle-of-credulity|principle of credulity]] says that if it seems to you that something is present, it probably is, unless you have a special reason for doubt, such as having been drugged. We rely on it everywhere else, so dropping it only for experiences of God would be special pleading, an exception without a reason.",
            "{{alston}} argued in *Perceiving God* (1991) that Christian mystical practice, like sense perception, is an established way of forming beliefs with its own checks, such as agreement with Scripture. Neither can be shown reliable without relying on itself, so if you may keep trusting your eyes, the mystic may keep trusting her practice. {{james-william}} had said in 1902 that such experiences bind only those who have them.",
          ],
          quote: {
            text: "Mystical states, when well developed, usually are, and have the right to be, absolutely authoritative over the individuals to whom they come.",
            who: "William James",
            cite: "The Varieties of Religious Experience (1902), Lectures XVI–XVII",
          },
          thinkers: ["swinburne", "alston", "james-william"],
          cedes:
            "This fails if religious experience has no checks at all, or if one known cause of false reports explains every case.",
          see: [
            { id: "hid-rea-presence", why: "Objection II suggests that experiences of God may come unlabelled and go unrecognized." },
          ],
          sources: [
            { title: "Perceiving God", by: "William P. Alston", year: "1991" },
            { title: "The Existence of God", by: "Richard Swinburne", year: "1979", note: "Ch. 13, on religious experience." },
            { title: "The Varieties of Religious Experience", by: "William James", year: "1902", url: "https://www.gutenberg.org/ebooks/621", note: "Lectures XVI–XVII, on mysticism." },
          ],
          children: [
            {
              id: "evi-a-diversity",
              side: "skeptic",
              label: "Religious experiences conflict, so none is a reliable guide",
              gist: "The same kind of experience vouches for Krishna, Allah, the Trinity and an impersonal Absolute, so it can't be a reliable guide to any one of them.",
              body: [
                "Swinburne's rule works for perception because perceptions agree. A Hindu and a Christian looking at the same tree agree that it is a tree, but mystics meet Krishna, Allah, the Trinity, the Buddha-nature or a Godhead without attributes, and each tradition checks its experiences by its own standards. {{hume}} made the same point about miracles in 1748. He argued that each religion's wonders are offered to prove a system that rules out the others, so the reports cancel each other, since “in matters of religion, whatever is different is contrary” (Enquiry X). {{alston}} himself called religious diversity the hardest problem for his view. {{feldman}} concludes that when equally informed and equally careful people disagree, neither has grounds to think she sees more clearly, so both should suspend judgment.",
              ],
              quote: {
                text: "it never troubles him that mere accident has decided which of these numerous worlds is the object of his reliance, and that the same causes which make him a Churchman in London, would have made him a Buddhist or a Confucian in Pekin.",
                who: "J. S. Mill",
                cite: "On Liberty ch. 2 (1859)",
              },
              thinkers: ["hume", "alston", "feldman", "mill"],
              cedes:
                "If mystics from different traditions, checked against one another, kept meeting the same God, the way observers agree about one tree, the argument would fail.",
              see: [
                { id: "evi-a-pumpkin", why: "The same worry about believing without argument, since every tradition can claim that right." },
                { id: "hid-demographics", why: "Objection II reads the same fact, that belief follows borders, as an argument about hiddenness." },
              ],
              sources: [
                { title: "On Liberty", by: "John Stuart Mill", year: "1859", url: "https://www.gutenberg.org/ebooks/34901" },
                { title: "An Enquiry concerning Human Understanding, sect. X", by: "David Hume", year: "1748", url: "https://www.gutenberg.org/ebooks/9662" },
                { title: "Reasonable Religious Disagreements", by: "Richard Feldman", year: "2007", note: "In Antony, ed., Philosophers Without Gods." },
              ],
              children: [
                {
                  id: "evi-a-parity",
                  side: "theist",
                  label: "The argument from disagreement counts against every view",
                  gist: "Upbringing shapes the skeptic's outlook too, and careful people disagree about nearly everything, so the rule would forbid almost every view.",
                  body: [
                    "Applied evenly, the diversity argument proves too much. {{plantinga}} grants that, born in Madagascar, he might not have been a Christian, and that a pluralist, who thinks no one religion is uniquely right, might not be one if born there either. If upbringing discredits a belief about religion, it discredits the pluralist's too. {{alston}} concluded that, with no neutral way to show a rival practice more reliable, it is rational to stay with your own (*Perceiving God*, ch. 7).",
                    "{{van-inwagen}} rejects views on free will that the philosopher David Lewis, his equal in ability and information, held on the same evidence, and no one calls either man irrational. [[conciliationism|Conciliationism]], the view that disagreement among equals requires suspending judgment, is itself disputed, so by its own rule it should be suspended, as its defender Adam Elga, a Princeton philosopher, admits.",
                  ],
                  quote: {
                    text: "If he continues in that belief, therefore, he will be in the same condition as the person he criticizes; but if he doesn’t continue in this belief, he no longer has an objection.",
                    who: "Alvin Plantinga, on the pluralist critic",
                    cite: "Warranted Christian Belief (2000), ch. 13, note 564",
                  },
                  thinkers: ["plantinga", "alston", "van-inwagen"],
                  cedes:
                    "I'd give this up if the only rational response to disagreement among equals were to suspend judgment about everything, atheism included.",
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
                    { title: "Warranted Christian Belief, ch. 13, sect. II", by: "Alvin Plantinga", year: "2000", url: "https://ccel.org/ccel/plantinga/warrant3/warrant3.vii.iii.ii.ii.html" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "evi-a-james",
          side: "theist",
          label: "The religious question can't wait for the evidence to come in",
          gist: "When a momentous choice can't be avoided or settled by evidence, refusing to choose is itself a choice.",
          body: [
            "{{james-william}} answered Clifford in 1896, in a lecture called “The Will to Believe”. We have two duties, he said, to believe truth and to shun error, and Clifford attends only to the second. He called an option [[genuine-option|genuine]] when it is live (both answers tempt you), forced (there is no third way) and momentous (the chance won't come again). When you face one, suspending judgment is itself a choice, and if the truth is there, agnosticism misses it as surely as disbelief does. {{pascal}}'s wager was a cruder version: “If you gain, you gain all; if you lose, you lose nothing.”",
            "Some facts also depend on our going first. Whether you like me may depend on whether I meet you halfway, and if the universe is personal, it may respond to our advances in the same way. James concluded that “a rule of thinking which would absolutely prevent me from acknowledging certain kinds of truth if those kinds of truth were really there, would be an irrational rule” (§X).",
          ],
          quote: {
            text: "Our passional nature not only lawfully may, but must, decide an option between propositions, whenever it is a genuine option that cannot by its nature be decided on intellectual grounds",
            who: "William James",
            cite: "“The Will to Believe” (1896), §IV",
          },
          thinkers: ["james-william", "pascal"],
          cedes:
            "James's case fails if evidence can settle the religious question after all, or if agnosticism loses nothing should God be real.",
          see: [{ id: "hid-moser", why: "Paul Moser's version of the same point, that God offers evidence to people willing to be changed by it." }],
          sources: [
            { title: "The Will to Believe", by: "William James", year: "1896", url: "https://www.gutenberg.org/ebooks/26659" },
            { title: "Pensées", by: "Blaise Pascal", year: "1670", url: "https://www.gutenberg.org/ebooks/18269", note: "Trotter translation, §233 (the wager)." },
          ],
          children: [
            {
              id: "evi-a-wishful",
              side: "skeptic",
              label: "The choice isn't forced, and no one can believe at will",
              gist: "Agnosticism loses nothing unless God shuts out honest doubters, and no one can believe on demand.",
              body: [
                "James's case needs the option to be forced, and it isn't. Agnosticism loses the prize only if God rewards those who believed before the evidence came, and {{schellenberg}} argues ((hid-argument|in Objection II)) that a loving God wouldn't shut out an honest seeker. James's test of whether an option feels live isn't neutral either, since what tempts us is mostly what we were raised on. In 1746 {{diderot}} answered {{pascal}} that an imam could offer the same wager.",
                "{{williams-bernard}} argued in 1970 against [[doxastic-voluntarism|doxastic voluntarism]], the idea that we can choose our beliefs at will. A belief you knew you had adopted for comfort couldn't count as aiming at truth, and James granted that no one can will ordinary beliefs. His example of meeting a friend halfway assumes the friend exists, and in God's case that is what's in dispute.",
              ],
              quote: {
                text: "Can we, by just willing it, believe that Abraham Lincoln's existence is a myth, and that the portraits of him in McClure's Magazine are all of some one else?",
                who: "William James",
                cite: "“The Will to Believe” (1896), §II",
              },
              thinkers: ["schellenberg", "diderot", "pascal", "williams-bernard"],
              cedes:
                "If faith could be taken up honestly, without fooling yourself, and rival creeds weren't equally available by the same method, the objection would collapse.",
              see: [
                { id: "mor-inclusivism", why: "Objection V asks whether an honest agnostic loses anything at all." },
                { id: "hid-willing-found-nothing", why: "Objection II's version, that no seeker can submit to a Lord she doesn't yet believe in." },
              ],
              children: [
                {
                  id: "evi-a-trust",
                  side: "theist",
                  label: "Faith can start as acting on trust, without willing belief",
                  gist: "No one is asked to switch a belief on, since faith can begin as trust acted on under uncertainty, which is how most serious commitments start.",
                  body: [
                    "Williams is right that belief can't be switched on, and most Christian writers never asked for that. {{pascal}} advised the doubter to copy believers and let the practice change him, and {{alston}} distinguished belief from *acceptance*, which means acting on a claim without feeling sure of it. Hebrews says the seeker “must believe that he is” (11:6), yet it illustrates faith with Abraham, who “went out, not knowing whither he went” (11:8). When Paul writes “believe in thine heart” (Romans 10:9), his verb, *pisteuō*, is the verb form of [[pistis|pistis]], a Greek word for faith that also means trust and loyalty. Most serious commitments start this way, as when people marry without proof that the marriage will last. Upbringing explains where anyone starts, the skeptic included. A commitment tested for years against doubt and rival options is not self-deception, even if it began as trust.",
                  ],
                  quote: {
                    text: "Follow the way by which they began; by acting as if they believed, taking the holy water, having masses said, etc. Even this will naturally make you believe, and deaden your acuteness.",
                    who: "Blaise Pascal",
                    cite: "Pensées §233 (pub. 1670; tr. W. F. Trotter)",
                  },
                  thinkers: ["pascal", "alston"],
                  cedes:
                    "This holds unless acting on trust under uncertainty is always self-deception, or the creeds require full belief before anyone can enter.",
                  see: [
                    { id: "hid-faith-without-belief", why: "Objection II uses the same distinction against hiddenness, since faith doesn't have to be full belief." },
                    { id: "mor-allegiance", why: "Objection V develops the idea of faith as loyalty to a person." },
                  ],
                  sources: [
                    { title: "Pensées", by: "Blaise Pascal", year: "1670", url: "https://www.gutenberg.org/ebooks/18269", note: "Trotter translation, §233." },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── Part B: the Gospels as evidence ───────────────────────── */
    {
      id: "evi-b",
      side: "skeptic",
      label: "Gospels that contradict each other can't carry the case",
      gist: "The four accounts disagree on checkable details, such as who found the tomb, how Judas died and on what day Jesus was crucified.",
      body: [
        "The Gospels, the main evidence that a man rose from the dead, disagree on details anyone can check. Mark names three women at the Easter tomb, Matthew two, Luke a larger group and John only Mary Magdalene. In Matthew, Judas “went and hanged himself” and the priests bought a field (27:5–7), while in Acts he buys the field himself and dies “falling headlong” (1:18). Mark makes the Last Supper a Passover meal, while John has Jesus die as the Passover lambs were killed. Luke ties the birth to the census of Quirinius, which Josephus dates to 6 CE, about ten years after the death of Herod, under whom Matthew sets it.",
        "{{reimarus}}, published after his death by {{lessing}}, called the Easter accounts irreconcilable. {{strauss}} read the Gospels as myth in 1835, and {{ehrman}} catalogued the contradictions for general readers in 2009.",
      ],
      quote: {
        text: "Now this man purchased a field with the reward of iniquity; and falling headlong, he burst asunder in the midst, and all his bowels gushed out.",
        who: "The Acts of the Apostles",
        cite: "Acts 1:18 (KJV)",
      },
      thinkers: ["reimarus", "lessing", "strauss", "ehrman"],
      cedes:
        "If the core claims rest on sources that don't need the Gospels to agree in detail, the contradictions matter much less.",
      sources: [{ title: "Jesus, Interrupted", by: "Bart D. Ehrman", year: "2009" }],
      children: [
        {
          id: "evi-b-minimal",
          side: "theist",
          label: "A resurrection best explains facts most scholars accept",
          gist: "Most critical scholars accept the crucifixion, the disciples' belief that they saw Jesus alive, and the conversions of Paul and James, and a resurrection explains them best.",
          body: [
            "The case doesn't need the Gospels to agree. {{habermas|Gary Habermas}} and {{licona|Mike Licona}} argue only from [[minimal-facts|facts most specialists accept]]. Tacitus, no friend of the Christians, wrote that “Christus, from whom the name had its origin, suffered the extreme penalty during the reign of Tiberius at the hands of one of our procurators, Pontius Pilatus” (Annals 15.44). Paul hands on a creed of appearances he “received”, which most scholars date within a few years of the cross. Paul went from persecutor to apostle, and James, whose family thought Jesus mad (Mark 3:21), is named among the witnesses (1 Corinthians 15:7) and later led the Jerusalem church.",
            "They then ask [[inference-to-best-explanation|which explanation fits all four facts best]]. A stolen body or a wrong tomb produces no appearances, and a Jesus who survived the cross, {{strauss}} argued in 1864, would have “crept about weak and ill, wanting medical treatment”. Even {{ludemann}}, who left the faith, judged the disciples' experiences of the risen Christ historically certain, though he took them to be visions.",
          ],
          quote: {
            text: "For I delivered unto you first of all that which I also received, how that Christ died for our sins according to the scriptures; And that he was buried, and that he rose again the third day according to the scriptures: And that he was seen of Cephas, then of the twelve",
            who: "Paul",
            cite: "1 Corinthians 15:3–5 (KJV)",
          },
          thinkers: ["habermas", "licona", "strauss", "ludemann"],
          cedes:
            "The case fails if most critical scholars come to doubt the appearance experiences themselves, or if one natural explanation covers all four facts without strain.",
          see: [
            { id: "nat-a-earman", why: "Objection III explains why independent witnesses can outweigh even a very low starting probability." },
          ],
          sources: [
            { title: "The Case for the Resurrection of Jesus", by: "Gary R. Habermas & Michael R. Licona", year: "2004" },
            { title: "The Resurrection of Jesus: A New Historiographical Approach", by: "Michael R. Licona", year: "2010", note: "Scores the rival explanations on criteria adapted from the historian C. Behan McCullagh." },
            { title: "Annals, Book XV", by: "Tacitus", url: "https://en.wikisource.org/wiki/The_Annals_(Tacitus)/Book_15", note: "Ch. 44. Church and Brodribb translation." },
            { title: "A New Life of Jesus, vol. 1", by: "David Friedrich Strauss", year: "1864", url: "https://archive.org/details/newlifeofjesusa01strauoft", note: "English translation, 2nd ed. (1879), p. 412." },
          ],
          children: [
            {
              id: "evi-b-natural",
              side: "skeptic",
              label: "Grief visions, dissonance and legend explain those facts",
              gist: "Grieving people often see their dead, failed prophecies can deepen conviction, and legend does the rest, so the facts need no miracle.",
              body: [
                "Each fact has a natural explanation. Bereaved people often see their dead, occasionally in groups. {{allison}}, a Christian New Testament scholar, finds such reports resemble the Easter appearances, though he leaves the question open. In *When Prophecy Fails* (1956) {{festinger}} described a flying-saucer group that preached harder after its predicted flood never came. He called the strain of beliefs clashing with events *cognitive dissonance*, and a crucified Messiah would cause plenty of it.",
                "{{ludemann}} explains Peter's vision by grief and guilt, and Paul's by inner conflict. Paul says only that Jesus appeared to James. James's earlier skepticism comes from Mark and John, so that part rests on the Gospels after all. Dying for a belief shows only that people held it. The Book of Mormon's three witnesses (1829) stood by their testimony for decades, some after breaking with Joseph Smith.",
              ],
              quote: {
                text: "we declare with words of soberness, that an angel of God came down from heaven, and he brought and laid before our eyes, that we beheld and saw the plates, and the engravings thereon",
                who: "Oliver Cowdery, David Whitmer and Martin Harris",
                cite: "“The Testimony of Three Witnesses”, Book of Mormon, modern LDS text (first printed 1830)",
              },
              thinkers: ["allison", "festinger", "ludemann"],
              cedes:
                "If the reports have features that no recorded case of grief or group experience has ever had, the natural explanation fails.",
              see: [
                { id: "evi-a-diversity", why: "Rival revelations with sincere witnesses, the same problem raised by religious experience." },
                { id: "nat-a-practice", why: "Hume's case in Objection III, that miracle reports grow as they are retold and fail when checked." },
              ],
              sources: [
                { title: "The Resurrection of Jesus: Apologetics, Polemics, History", by: "Dale C. Allison Jr.", year: "2021" },
                { title: "The Book of Mormon", by: "Joseph Smith, Jr. (publisher)", year: "1830", url: "https://www.gutenberg.org/ebooks/17", note: "“The Testimony of Three Witnesses” is in the front matter. Modern LDS text." },
              ],
              children: [
                {
                  id: "evi-b-wright",
                  side: "theist",
                  label: "Only an empty tomb plus sightings explains the word 'risen'",
                  gist: "Ancient people never called visions of the dead resurrection, so only an empty tomb plus sightings explains why Jews said one man had been raised.",
                  body: [
                    "{{wright-nt}} argues that grief visions can't explain the Christian claim. Ancient people called visions of the dead ghosts or angels, and in Luke the disciples, seeing Jesus, “supposed that they had seen a spirit” (24:37). *Resurrection* meant bodily life for all the righteous at the end, and the first Christians changed it, saying one man had been raised already. Appearances alone would have meant a ghost, and an empty tomb alone a theft, so it took both to make anyone say *risen*.",
                    "Dissonance fails too, since followers of other slain would-be messiahs, such as Simon bar Giora and Bar Kokhba, gave up or found a new leader, and none said their man had risen. Grief visions are usually private, yet Paul names “above five hundred brethren at once” (1 Corinthians 15:6). {{ludemann}}'s guilt-ridden Paul is hard to square with Paul calling himself “blameless” under the Law (Philippians 3:6), as {{stendahl}} noted in 1963.",
                  ],
                  quote: {
                    text: "After that, he was seen of above five hundred brethren at once; of whom the greater part remain unto this present, but some are fallen asleep.",
                    who: "Paul",
                    cite: "1 Corinthians 15:6 (KJV)",
                  },
                  thinkers: ["wright-nt", "ludemann", "stendahl"],
                  cedes:
                    "If a pre-Christian Jewish text clearly said that one person had been raised bodily before the end, with no empty tomb involved, Wright's argument would fail.",
                  sources: [
                    { title: "The Resurrection of the Son of God", by: "N. T. Wright", year: "2003" },
                    { title: "The Apostle Paul and the Introspective Conscience of the West", by: "Krister Stendahl", year: "1963", note: "Harvard Theological Review 56." },
                  ],
                  children: [
                    {
                      id: "evi-b-parallels",
                      side: "skeptic",
                      label: "Others were said to be raised, and the empty tomb is shaky",
                      gist: "Herod's court thought John the Baptist had risen, ancient stories had heroes taken up bodily, and the empty tomb, which Wright's case needs, rests on weak evidence.",
                      body: [
                        "Mark's Gospel has a counterexample to Wright. Hearing of Jesus, Herod says that John the Baptist has risen from the dead (6:16), one man raised before the end. Jewish tradition had Enoch and Elijah taken up bodily, and Roman stories had heroes such as Romulus vanish and become gods. Richard C. Miller, a scholar of early Christianity, thinks early readers heard the Gospel endings as such stories, called translation fables.",
                        "The empty tomb, which Wright needs to turn visions into resurrection, is probably the weakest point. Paul never mentions it, and Rome usually left the crucified to the birds or a common pit. {{crossan}} doubts that Jesus was laid in a known tomb, and {{ehrman}} thinks a decent burial would have been a rare exception. Without a known tomb, visions plus stories like these could lead followers to say *risen*.",
                      ],
                      quote: {
                        text: "But when Herod heard thereof, he said, It is John, whom I beheaded: he is risen from the dead.",
                        who: "Mark",
                        cite: "Mark 6:16 (KJV)",
                      },
                      thinkers: ["crossan", "ehrman"],
                      cedes:
                        "I'd withdraw this if the burial and the empty tomb turned out to be as early and as widely reported as the appearances.",
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
                          gist: "None of the parallels is a death followed by a rising, and the burial is in the earliest creed, so the tomb was probably empty.",
                          body: [
                            "{{wright-nt}} reads Herod's guess as talk of John's spirit at work in another man. Enoch, Elijah and Romulus were taken up without dying, so none of them was raised, while the Gospels insist that Jesus died and was buried first.",
                            "The creed Paul received says “he was buried” (1 Corinthians 15:4), and Jewish law said a hanged man's body “shall not remain all night upon the tree, but thou shalt in any wise bury him that day” (Deuteronomy 21:23). The nailed heel bone of Yehohanan, found in a family bone box in Jerusalem in 1968, shows that a crucified man could be properly buried.",
                            "The first witnesses at the tomb are women, whose word counted for little then, and the pagan critic {{celsus}} mocked a story resting on “a half-frantic woman”. Historians trust such a detail under the [[criterion-of-embarrassment|criterion of embarrassment]], since a teller is unlikely to invent what embarrasses his own side, and even the cautious {{allison}} judges the tomb probably empty.",
                          ],
                          quote: {
                            text: "the Jews used to take so much care of the burial of men, that they took down those that were condemned and crucified, and buried them before the going down of the sun.",
                            who: "Josephus",
                            cite: "The Jewish War 4.5.2 (c. 75), trans. Whiston",
                          },
                          thinkers: ["wright-nt", "celsus", "allison"],
                          cedes:
                            "If the burial clause turned out to be a late addition to the creed, or Jesus's body stayed in a known grave, I'd give this up.",
                          see: [{ id: "evi-b-body", why: "Why the creed's “he was buried” points to an empty grave." }],
                          sources: [
                            { title: "Ossuaries and the Burials of Jesus and James", by: "Jodi Magness", year: "2005", note: "Journal of Biblical Literature 124." },
                            { title: "The Wars of the Jews", by: "Flavius Josephus", year: "c. 75", url: "https://www.gutenberg.org/ebooks/2850", note: "Book IV, ch. 5, sect. 2. Whiston translation." },
                            { title: "Against Celsus, Book II", by: "Origen", year: "c. 248", url: "https://www.newadvent.org/fathers/04162.htm", note: "Ch. 55, where Origen quotes Celsus. Crombie translation." },
                          ],
                        },
                      ],
                    },
                    {
                      id: "evi-b-prior",
                      side: "skeptic",
                      label: "Miracle reports usually fail, so a natural story is likelier",
                      gist: "Every religion counts most of history's miracle reports as false, so a historian should always prefer a natural explanation, even a strained one.",
                      body: [
                        "Even if every natural explanation Wright rejects failed, his conclusion wouldn't follow. Every religion rejects the miracle reports of the others, which is most of them. {{hume}} gave reasons in 1748, among them the love of wonder, the zeal of believers, and the way miracle stories “abound among ignorant and barbarous nations” and “grow thinner every page, in proportion as we advance nearer the enlightened ages”. Hume set against every such report the most uniform experience there is, that the dead stay dead. {{ehrman}} argues that historians weigh explanations by probability, and a miracle is by definition the least probable explanation of anything. A stolen body, a mistaken tomb and grief visions are unlikely, but they are the kind of unlikely thing that happens. Whether a miracle's starting probability, its [[prior-probability|prior]], can be raised at all is the subject of ((nat-a|Objection III)).",
                      ],
                      quote: {
                        text: "But it is a miracle, that a dead man should come to life; because that has never been observed in any age or country.",
                        who: "David Hume",
                        cite: "An Enquiry concerning Human Understanding X.90 (1748)",
                      },
                      thinkers: ["hume", "ehrman"],
                      cedes:
                        "This holds unless there is already good reason to think a God exists who would raise Jesus, which would make a resurrection far less improbable.",
                      see: [
                        { id: "nat-a-odds", why: "Hume's argument treated as a weighing of odds, argued in full in Objection III." },
                        { id: "nat-a-practice", why: "Why miracle reports tend to fail when they are checked." },
                      ],
                      sources: [
                        { title: "An Enquiry concerning Human Understanding, sect. X, “Of Miracles”", by: "David Hume", year: "1748", url: "https://www.gutenberg.org/ebooks/9662" },
                      ],
                      children: [
                        {
                          id: "evi-b-cumulative",
                          side: "theist",
                          label: "The odds of a resurrection depend on whether there's a God",
                          gist: "A resurrection is wildly improbable as a random event, but much less so as the act of a God who exists and has reason to vindicate Jesus.",
                          body: [
                            "Hume treats the [[prior-probability|prior]], an event's probability before the evidence is weighed, as fixed by nature's track record. The odds that a corpse revives by chance are negligible, but if a God exists who has reason to show that Jesus was right, the odds that he raises Jesus are much higher. {{swinburne}}, in *The Resurrection of God Incarnate* (2003), combines natural theology (arguments for God from reason and nature), the expectation of an incarnation and the historical evidence, and puts the resurrection at about 97 percent. Even {{earman}}, no apologist, argued that Hume's case fails when read as probability, because independent witnesses can add up until they outweigh a tiny prior, and the philosophers Timothy and Lydia McGrew argue that the Easter testimony does.",
                          ],
                          quote: {
                            text: "In a word, once believe that there is a God, and miracles are not incredible.",
                            who: "William Paley",
                            cite: "A View of the Evidences of Christianity (1794), Preparatory Considerations",
                          },
                          thinkers: ["swinburne", "earman", "paley"],
                          cedes:
                            "If God's existence is itself wildly improbable on the rest of the evidence, this reply fails.",
                          see: [
                            { id: "nat-a-earman", why: "Earman's case against Hume, argued in Objection III." },
                            { id: "coh-a-collapse", why: "A God with reasons to vindicate Jesus has to choose freely, and Spinoza held that God acts from necessity." },
                          ],
                          sources: [
                            { title: "The Resurrection of God Incarnate", by: "Richard Swinburne", year: "2003" },
                            { title: "A View of the Evidences of Christianity", by: "William Paley", year: "1794", url: "https://www.gutenberg.org/ebooks/14780" },
                          ],
                          children: [
                            {
                              id: "evi-b-soft",
                              side: "skeptic",
                              label: "The odds are soft guesses, and the history can't stand alone",
                              gist: "Every number in these sums is a guess, and the history persuades only someone who already thinks God likely.",
                              body: [
                                "Swinburne is careful with the arithmetic, but his inputs are soft. How likely is an incarnation if God exists, or the women's story if it was invented? Small changes in such judgment calls swing the result by orders of magnitude. The McGrews rate the combined testimony at a factor of about 10⁴⁴, and that figure rests on dozens of guesses of the same kind.",
                                "Swinburne argues for his prior from natural theology, so his case depends on ((nat-b|Objection III)), which must also survive evil and ((hid-argument|hiddenness)). For an unpersuaded agnostic, the resurrection becomes credible only after a God who would raise Jesus seems likely. {{lessing}} saw a wider gap in 1777 between truths of history, which happen to be so, and truths of reason, which could not be otherwise, and called it [[lessings-ditch|the ugly broad ditch]] he could not cross.",
                              ],
                              quote: {
                                text: "a miracle can never be proved, so as to be the foundation of a system of religion.",
                                who: "David Hume",
                                cite: "An Enquiry concerning Human Understanding X.99 (1748)",
                              },
                              thinkers: ["swinburne", "lessing", "hume"],
                              cedes:
                                "If a fair-minded agnostic, starting from assumptions she already accepts, still found the resurrection highly probable after weighing the history, this would fail.",
                              see: [
                                { id: "evi-a-james", why: "James offers another way across Lessing's ditch, since some questions can't wait for proof." },
                                { id: "nat-b-odds", why: "The same worry about soft numbers, aimed at fine-tuning in Objection III." },
                              ],
                              sources: [
                                {
                                  title: "The Argument from Miracles: A Cumulative Case for the Resurrection of Jesus of Nazareth",
                                  by: "Timothy McGrew & Lydia McGrew",
                                  year: "2009",
                                  note: "In Craig & Moreland, eds., The Blackwell Companion to Natural Theology.",
                                },
                                { title: "Über den Beweis des Geistes und der Kraft (On the Proof of the Spirit and of Power)", by: "G. E. Lessing", year: "1777" },
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
          label: "The errors refute only a flawless Bible, which no creed requires",
          gist: "The discrepancies refute the idea that every detail is free of error, and no ancient creed asks Christians to believe that.",
          body: [
            "The discrepancies refute a doctrine the creeds never defined, and honest witnesses usually differ on details anyway. The Nicene Creed in its final form of 381 says that “the third day he rose again according to the Scriptures” and that the Spirit “spake by the Prophets” (Book of Common Prayer, 1662), but says nothing about every detail being free of error. Strict [[inerrancy|inerrancy]], the claim that the Bible contains no error of any kind, was codified by American evangelicals in the Chicago Statement of 1978 and belongs to no creed the whole church shares. The Second Vatican Council placed Scripture's freedom from error in “that truth which God wanted put into sacred writings for the sake of salvation” (Dei Verbum §11).",
            "Christians noticed the discrepancies long before modern scholars. {{origen}} granted in the 230s that the Gospels conflict if read as plain chronicle, and Protestants such as {{barth}} and {{lewis-cs}} have treated Scripture as true testimony in fallible human words.",
          ],
          quote: {
            text: "The spiritual truth was often preserved, as one might say, in the material falsehood.",
            who: "Origen",
            cite: "Commentary on John X.4, trans. Menzies (ANF 9)",
          },
          thinkers: ["origen", "barth", "lewis-cs"],
          cedes:
            "This fails if the death, burial and rising turn out to depend on the details that conflict.",
          see: [
            { id: "mor-development", why: "Objection V uses the same reasoning, separating the essentials from the details, to revise the doctrine of hell." },
          ],
          sources: [
            { title: "Commentary on John, Book X", by: "Origen", year: "c. 231–40", url: "https://www.newadvent.org/fathers/101510.htm" },
            { title: "Dei Verbum (Dogmatic Constitution on Divine Revelation)", by: "Second Vatican Council", year: "1965", url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html" },
          ],
          children: [
            {
              id: "evi-b-core",
              side: "skeptic",
              label: "Once errors are conceded, nothing protects the miracle stories",
              gist: "If the Gospels err on checkable details and reshape events to make a point, nothing exempts the miracles.",
              body: [
                "The church did hold the Gospel writers free of error, and {{leo-xiii|Leo XIII}} wrote in 1893 that it is “absolutely wrong and forbidden … to admit that the sacred writer has erred” (*Providentissimus Deus* §20). Some changes look deliberate, as when John has Jesus die as the Passover lambs were slaughtered, after the Baptist had hailed him as “the Lamb of God” (1:29). {{ehrman}} argues that John moved the day, and {{licona}}, a defender of the Gospels, allows that he probably did.",
                "Nor are there four independent witnesses. Most scholars hold that Matthew and Luke copied Mark ([[markan-priority|Markan priority]]), so where they differ they are editing. The earliest manuscripts of Mark end at 16:8 with no appearance, Matthew and Luke add appearances, and John has Thomas invited to touch the wounds, so the stories grow with each Gospel. If John could redate the crucifixion to make a point, nothing shows the resurrection stories were left untouched.",
              ],
              quote: {
                text: "I have learned to yield this respect and honour only to the canonical books of Scripture: of these alone do I most firmly believe that the authors were completely free from error.",
                who: "Augustine",
                cite: "Letter 82.3, to Jerome (c. 405), trans. Cunningham",
              },
              thinkers: ["augustine", "leo-xiii", "ehrman", "licona"],
              cedes:
                "This falls if the miracle accounts prove to be among the best-attested and least-developed parts of the tradition.",
              see: [
                { id: "mor-flew", why: "Objection V's version, in which each softening of hell is what Antony Flew called a “death by a thousand qualifications”." },
              ],
              sources: [
                { title: "Letter 82", by: "Augustine", year: "c. 405", url: "https://www.newadvent.org/fathers/1102082.htm" },
                { title: "Providentissimus Deus", by: "Leo XIII", year: "1893", url: "https://www.vatican.va/content/leo-xiii/en/encyclicals/documents/hf_l-xiii_enc_18111893_providentissimus-deus.html", note: "§20." },
              ],
              children: [
                {
                  id: "evi-b-bios",
                  side: "theist",
                  label: "Ancient biographers moved scenes around but kept the events",
                  gist: "The Gospels are ancient biographies, a genre that rearranged freely while keeping the main events, and their Easter core is promised in Mark and listed by Paul years earlier.",
                  body: [
                    "Critics who count errors hold the Gospels to a court transcript's standard, but {{burridge|Richard Burridge}} argued in 1992 that they are Greco-Roman [[bios|bios]], or lives. {{licona}} compares them with Plutarch, who tells the same events differently in different *Lives* and asked readers not to fault him if they found famous exploits “recorded imperfectly, and with large excisions”, since “I am writing biography, not history” (*Life of Alexander* 1). If John set the death at a symbolic hour, he used that licence, and no one concludes that Plutarch invented Caesar's assassination.",
                    "Mark's ending is less bare than it looks. Earlier, Jesus promises to meet his disciples in Galilee (14:28), and the young man at the tomb repeats it: “there shall ye see him” (16:7). Paul had listed the appearances years earlier (1 Corinthians 15:5–8). Many scholars count Paul, Mark and John as independent sources for the death, burial and rising, and historians call such agreement [[multiple-attestation|multiple attestation]].",
                  ],
                  quote: {
                    text: "what difference does it make whether he inserts the matter in its proper order, or brings in at a particular point what was previously omitted, or mentions at an earlier stage what really happened at a later, provided only that he contradicts neither himself nor a second writer in the narrative of the same facts or of others?",
                    who: "Augustine",
                    cite: "The Harmony of the Gospels II.21.51 (c. 400), trans. Salmond",
                  },
                  thinkers: ["burridge", "licona", "augustine"],
                  cedes:
                    "If the Gospel writers invented events, where other ancient biographers only rearranged them, this fails.",
                  sources: [
                    { title: "What Are the Gospels? A Comparison with Graeco-Roman Biography", by: "Richard A. Burridge", year: "1992" },
                    { title: "Why Are There Differences in the Gospels?", by: "Michael R. Licona", year: "2017" },
                    { title: "Plutarch's Lives, vol. 3 (Life of Alexander)", by: "Plutarch", url: "https://www.gutenberg.org/ebooks/14140", note: "Ch. 1. Stewart and Long translation." },
                    { title: "The Harmony of the Gospels, Book II", by: "Augustine", year: "c. 400", url: "https://www.newadvent.org/fathers/1602221.htm", note: "Ch. 21." },
                  ],
                  children: [
                    {
                      id: "evi-b-saints",
                      side: "skeptic",
                      label: "If genre excuses a moved date, it can excuse a miracle",
                      gist: "If genre can explain away a moved date, it can explain away a miracle, as Licona tentatively did with Matthew's raised saints.",
                      body: [
                        "In 2010 {{licona}} himself suggested that Matthew's saints, who rise from their graves at the crucifixion, may be apocalyptic imagery, the symbolic language Jewish writers used for the end of the world. Critics who hold the Bible free of all error protested, and in 2011 he left his post with the North American Mission Board over it.",
                        "Nothing in the genre says which stories are reports and which are imagery. Matthew tells of the raised saints in the same plain voice as the earthquake beside them (27:51) and the empty tomb a chapter later (28:6). A reader who calls one imagery must say why the others are reports. The answer has to come from a prior judgment about which miracles happened, the question the Gospels were supposed to settle.",
                      ],
                      quote: {
                        text: "And the graves were opened; and many bodies of the saints which slept arose, And came out of the graves after his resurrection, and went into the holy city, and appeared unto many.",
                        who: "Matthew",
                        cite: "Matthew 27:52–53 (KJV)",
                      },
                      thinkers: ["licona"],
                      cedes:
                        "If the genre itself, without a prior verdict on miracles, marked which wonder stories are reports and which are imagery, the objection would fail.",
                      see: [
                        { id: "evi-b-spinoza", why: "Spinoza's approach to the wonder stories, which he read as fitted to their hearers and kept for what they teach." },
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
              gist: "Spinoza held that Scripture's authority rests on its teaching of justice and charity and never on accurate history, so the miracle stories can go without loss.",
              body: [
                "In his *Theological-Political Treatise* (1670) Spinoza reads Scripture through its own history and language, by a method he calls “almost the same” as interpreting nature (ch. 7). He finds Scripture's authority in its moral teaching, to obey God by practising justice and charity toward your neighbour (chs. 5, 13–14), so errors in the narratives take away nothing that made it authoritative.",
                "The miracles can go too, because Scripture tells its wonders to suit ordinary people, who take whatever they can't explain for the hand of God (ch. 6). Its purpose, he told Oldenburg, “is not to teach philosophy, nor to render men wise, but to make them obedient” (Ep. 78). On his view the stories were told to move people toward justice and charity, and they can still do that when read as stories.",
              ],
              quote: {
                text: "the truth of narratives, be they what they may, has nothing to do with the Divine law",
                who: "Spinoza",
                cite: "Theological-Political Treatise ch. 5 (1670), trans. Elwes",
              },
              thinkers: ["spinoza"],
              cedes:
                "Spinoza is wrong if the Gospels' ethics can't be stated or lived apart from the miracle stories.",
              see: [
                { id: "nat-a-power", why: "Why Spinoza held that nothing can happen against nature, since its laws are God's own decrees." },
                { id: "mor-allegiance", why: "A Christian version of the same move, with faith understood as loyalty to Christ." },
                { id: "evi-b-core", why: "The Objector's argument that once errors are conceded, the miracle stories lose their protection." },
              ],
              sources: [
                { title: "A Theologico-Political Treatise", by: "Benedict de Spinoza", year: "1670", url: "https://www.gutenberg.org/ebooks/989", note: "Elwes translation, Part 1 of 4 on Project Gutenberg." },
              ],
              children: [
                {
                  id: "evi-b-event",
                  side: "theist",
                  label: "Christianity stands or falls with a bodily rising",
                  gist: "From the start the faith said it depends on something that happened to a buried body, so retreating to ethics alone swaps it for a different religion.",
                  body: [
                    "Moving the core to ethics gives away the faith {{paul|Paul}} preached. He wrote in the mid-50s: “if Christ be not risen, then is our preaching vain, and your faith is also vain” (1 Corinthians 15:14). The first Christians announced something that happened to a body, which “was buried” and “rose again the third day” (15:4). That makes the faith open to [[falsification|falsification]], as the philosopher {{flew}} demanded in 1950, since Paul named the fact that would refute it. Spinoza's friend {{oldenburg|Henry Oldenburg}} pressed this on him in February 1676.",
                    "Spinoza, {{kant}} in *Religion within the Bounds of Mere Reason* (1793) and {{harnack}} in *What Is Christianity?* (1900) kept the ethics and set the miracles aside, and each ended with a different religion, perhaps an admirable one. From the start the rising was what offended, as in Athens, where Paul's hearers listened until he reached the resurrection and then “some mocked” (Acts 17:32).",
                  ],
                  quote: {
                    text: "And on this article of the resurrection the whole Christian religion and its truth rest, and with its removal Christ's mission and heavenly doctrine collapse.",
                    who: "Henry Oldenburg",
                    cite: "Letter to Spinoza, Ep. 79 (11 Feb 1676), trans. Elwes",
                  },
                  thinkers: ["paul", "flew", "oldenburg", "kant", "harnack"],
                  cedes:
                    "If the earliest preaching centred on a teaching, with the death and rising added later, I'd concede.",
                  see: [{ id: "mor-body", why: "Objection V reads the bodily resurrection as God's verdict in favour of life." }],
                  children: [
                    {
                      id: "evi-b-spiritual",
                      side: "spinoza",
                      label: "The rising was a real revelation, and no corpse left a tomb",
                      gist: "Spinoza read the resurrection as a revelation, fitted to the disciples' understanding, that Christ's life had won eternity, and denied that a corpse left a tomb.",
                      body: [
                        "Spinoza didn't call the disciples liars. He wrote to Oldenburg that biblical apparitions were adapted to the understanding and opinions of those who received them, and that the resurrection was a revelation to the faithful that Christ, by his life and death, had attained eternity (Ep. 75). In his next letter to Oldenburg he put it in one line: “I accept Christ's passion, death, and burial literally, as you do, but His resurrection I understand allegorically” (Ep. 78). His reading escapes ((evi-b-wright|Wright's argument)) that only an empty tomb plus appearances could produce the word *risen*, because a revelation that Christ lives eternally can be called a rising without any grave being emptied. For Spinoza revelation is vivid imagination at work, and it never breaks the order of nature.",
                      ],
                      quote: {
                        text: "I therefore conclude, that the resurrection of Christ from the dead was in reality spiritual, and that to the faithful alone, according to their understanding, it was revealed that Christ was endowed with eternity, and had risen from the dead",
                        who: "Spinoza",
                        cite: "Letter to Oldenburg, Ep. 75 (1675–76), trans. Elwes",
                      },
                      thinkers: ["spinoza"],
                      cedes:
                        "Spinoza's reading fails if the earliest witnesses, Paul included, clearly meant a physical body that had left a tomb.",
                      see: [
                        { id: "nat-a-power", why: "Spinoza reads it this way because nature's laws are God's decrees, and God does not break them." },
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
                          gist: "The earliest creed names a burial, Paul's 'spiritual body' is still a body, and Luke and John take pains to show the risen Jesus was no ghost.",
                          body: [
                            "Spinoza's reading fails on the earliest texts. The creed Paul hands on runs died, buried, raised, appeared (1 Corinthians 15:3–5), and the burial matters only if the grave is part of the point. Paul's “spiritual body” (15:44), in Greek [[soma-pneumatikon|soma pneumatikon]], is on {{wright-nt}}'s reading a body animated by the Spirit. Luke and John rule out a ghost, with flesh and bones and a meal of fish.",
                            "Spinoza conceded that “we cannot deny that they themselves believed Christ's body to have risen from the dead” (Ep. 78), saying only that they might have been deceived. On his own theory the visions were [[imaginatio|imagination]], ((evi-a-imagination|the source of error)), and the *Treatise* says we must not go to the prophets for knowledge “either of natural or of spiritual phenomena” (ch. 2), so the visions can't show that Christ attained eternity either. Oldenburg asked by what right the rising, told as soberly as the passion, death and burial, is made into allegory, and said Spinoza relied “on no proof at all”.",
                          ],
                          quote: {
                            text: "Behold my hands and my feet, that it is I myself: handle me, and see; for a spirit hath not flesh and bones, as ye see me have.",
                            who: "Luke",
                            cite: "Luke 24:39 (KJV)",
                          },
                          thinkers: ["wright-nt", "spinoza", "oldenburg"],
                          cedes:
                            "Proof that Paul meant something other than a physical body by 'body' would change my mind.",
                          children: [
                            {
                              id: "evi-b-flesh",
                              side: "spinoza",
                              label: "Paul, the earliest witness, describes a heavenly body",
                              gist: "Paul counts his own vision as an appearance, never mentions an empty tomb, and says flesh and blood cannot inherit God's kingdom.",
                              body: [
                                "The texts that insist on flesh are later. Paul counts his encounter, which Acts calls a “heavenly vision” (26:19), as an appearance like Peter's (1 Corinthians 15:8), never mentions an empty tomb, and says “flesh and blood cannot inherit the kingdom of God” (15:50). {{jeremias|Joachim Jeremias}}, the German scholar, read that as an idiom for mortals, but Paul says “thou sowest not that body that shall be” (15:37). Dale Martin of Yale reads Paul's “spiritual body” as one made of *pneuma*, a fine heavenly substance.",
                                "Spinoza leaned on 2 Corinthians 5:16, but most modern translations read its “after the flesh” as *by worldly standards*, leaving 1 Corinthians 15 to carry the case. Oldenburg's missing proof is in the *Treatise* (ch. 6). A death is ordinary, but a corpse rising would break the order of nature, which for Spinoza is God's decree. So of two reports told in the same sober voice, one may record what happened and the other only what the witnesses believed.",
                              ],
                              quote: {
                                text: "But Paul, to whom Christ afterwards appeared, rejoices, that he knew Christ not after the flesh, but after the spirit.",
                                who: "Spinoza",
                                cite: "Letter to Oldenburg, Ep. 78 (7 Feb 1676), trans. Elwes",
                              },
                              thinkers: ["spinoza", "jeremias"],
                              cedes:
                                "If Paul's letters, read on their own terms, plainly assumed an emptied grave, this reading would fail.",
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
    title: "God can be proved, and faith is about obedience",
    body: [
      "On the Gospels Spinoza sides with the skeptic. His *Theological-Political Treatise* (1670) reads Scripture the way he reads nature, through its own history. On God and evidence he is no evidentialist, because he doesn't think belief in God has to wait on outside evidence. He held that [[deus-sive-natura|God, or Nature]], can be proved (Ethics I P11), and that a true idea needs no outside support: “as light displays both itself and darkness, so is truth a standard both of itself and of falsity” (II P43 Schol.). Against Clifford, then, he agrees with Plantinga. The two differ over which ideas of God are adequate, that is, complete and true.",
      "He divided the work between philosophy and faith in chapters 14 and 15 of the *Treatise*: “Philosophy has no end in view save truth: faith, as we have abundantly proved, looks for nothing but obedience and piety.” Faith needs only a handful of pious dogmas, judged by how much justice and charity they produce, which is why he could grant every contradiction in the Gospels and lose nothing. He gave no weight to a felt sense of the divine, which he counted as [[imaginatio|imagination]]. The knowledge he valued ends in love: “the intellectual love of the mind towards God is that very love of God whereby God loves himself” (Ethics V P36).",
      "His God acts from the necessity of his own nature and has no will (I P32 Coroll. 1), so he raises no one from the dead. The Christ Spinoza admired, who “communed with God mind to mind” (*Treatise* ch. 1), can be the wisest of teachers but can't be a risen Lord. Yet the creed he offers ordinary believers in the *Treatise* begins with a God “sovereignly just and merciful” (ch. 14), which the *Ethics* says God is not. Spinoza's answer is that each dogma has a true reading, since God's decrees are the laws of nature. ((evi-a-owngod|His Christian critics ask)) whether that is honest translation into simpler terms or a noble lie, Plato's name for a useful falsehood told to the public.",
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
      note: "The shipowner, and the classic case for a duty to believe only on evidence.",
    },
    {
      title: "Warranted Christian Belief",
      by: "Alvin Plantinga",
      year: "2000",
      url: "https://www.ccel.org/ccel/plantinga/warrant3",
      note: "Plantinga's case that Christian belief can be rational without argument, with his replies to pluralism and to historical criticism of the Bible. The full text is free to read online.",
    },
    {
      title: "The Miracle of Theism",
      by: "J. L. Mackie",
      year: "1982",
      note: "A careful skeptical review of the arguments for God, including Hume on miracles.",
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
      note: "The fullest case that only an empty tomb and real appearances explain what the first Christians believed.",
    },
    {
      title: "The Resurrection of Jesus: Apologetics, Polemics, History",
      by: "Dale C. Allison Jr.",
      year: "2021",
      note: "A Christian New Testament scholar weighs Wright's case against the skeptics' and leaves several questions open.",
    },
  ],
};

export default evidence;
