import type { Objection } from "../types";

/* Objection V, the moral picture. Three parts: hell for unbelief, guilt as
   control, and Nietzsche's charge of life-denial. Every quotation below was
   checked against a public-domain or published text: the KJV; Elwes's Spinoza
   (Ethics, Theologico-Political Treatise, Letter 78); Ludovici's and Samuel's
   Nietzsche, Kennedy's Daybreak; the English Dominican Summa (New Advent);
   Shaw's Enchiridion and Dods's City of God; the Ante-Nicene Fathers; Ross's
   Aristotle; Semple's Kant (1838); Newman (newmanreader.org); Melmoth's Pliny;
   Wensinck's Isaac of Nineveh (1923); Mill's Hamilton (1865); Flew (1950);
   Chesterton's Orthodoxy; Lewis's Problem of Pain, Great Divorce and Last
   Battle (Faded Page); Paton's Polybius (LacusCurtius); Hume's second Enquiry; the Smalcald Articles (Triglot); Trent
   (Waterworth); Lateran IV (Schroeder); Florence (Tanner); vatican.va; also
   Crombie's Origen, the NPNF Gregory of Nyssa, Beveridge's Calvin, the
   Philadelphia-edition Ninety-five Theses, and Talbott's SEP entry. Quote
   `url`s point to the free text of each work; bible links go to the verse
   on Wikisource's KJV. */

const morals: Objection = {
  id: "morals",
  numeral: "V",
  short: "Morals",
  title: "The moral picture is wrong",
  objection:
    "Christianity threatens hell for holding the wrong beliefs and uses guilt to keep people in line, and {{nietzsche}} charged that the whole faith says No to life.",
  counter:
    "Some New Testament scholars, {{bates|Matthew Bates}} among them, argue that in the earliest Christian texts saving faith means loyalty to Jesus. [[annihilationism|Annihilationism]] (the lost are destroyed) and the Orthodox theologian {{hart}}'s [[universalism|universalism]] (everyone is finally saved) both drop eternal torment, though most evangelicals reject both. Nietzsche's charge is about whether the faith is good for us, and that settles nothing about whether it is true, any more than “Christians are hypocrites” does. The faith is built on God becoming flesh and on a bodily resurrection, and it is hard to see how that says No to life. And the historian {{holland}}'s book *Dominion* argues that the Objector's own care for the weak is a Christian inheritance, which Nietzsche himself said can't stand once the faith is gone.",
  dek: "((mor-holland|The historian Tom Holland replies)) that the conscience doing the judging was formed by Christianity in the first place. ((mor-convicts|The Objector answers)) that if so, hell for honest doubters and guilt used as control fail Christianity's own moral test.",
  question:
    "If a faith's picture of God looks cruel, is that evidence it is false, and whose conscience gets to say so?",

  prongs: [
    /* ───────────────────────── I. HELL ───────────────────────── */
    {
      id: "mor-hell",
      side: "skeptic",
      label: "Christianity's hell, endless torment for unbelief, is monstrous",
      gist: "Christianity has long taught that people who die without the right faith suffer forever, and no good being would do that to anyone.",
      body: [
        "The Athanasian Creed, from about 500, makes “the catholic faith” (orthodox Christian belief) the condition of escaping everlasting loss. {{augustine}} defended a literal, unending fire, in which the bodies of the damned “may burn without being consumed, and may suffer without perishing” (*City of God* XXI.4). The Catholic Council of Florence taught in 1442 that pagans, Jews and heretics outside the Church “will go into the everlasting fire which was prepared for the devil and his angels”. {{edwards}} preached in 1741 that God held his hearers over hell “much as one holds a spider, or some loathsome insect over the fire”. {{russell}} found “one very serious defect” in Christ's character, “and that is that He believed in hell.”",
        "The test is belief, which most people pass or fail by accident of birth. The penalty never ends, though no finite life of wrongdoing could earn endless torment. Even {{aquinas}}, who defended endless hell, raised the objection against himself that punishments are “a kind of medicine” and “no medicine should be infinite” (*Summa Theologiae* I-II q.87 a.3) before answering it. Making the penalty gentler would leave the test as unfair as before. A father who did this to his child would be called a monster.",
      ],
      quote: {
        text: "Whosoever will be saved, before all things it is necessary that he hold the catholic faith; Which faith except every one do keep whole and undefiled, without doubt he shall perish everlastingly.",
        who: "Athanasian Creed (Quicunque vult)",
        cite: "vv. 1–2 (c. 500)",
        url: "https://www.ccel.org/creeds/athanasian.creed.html",
      },
      thinkers: ["augustine", "edwards", "russell", "aquinas"],
      cedes:
        "This charge falls if the faith turns out not to teach endless torment for unbelief, or if its sentence tracks a person's real, chosen wrong and ends when the wrong does.",
      see: [
        { id: "hid-argument", why: "Objection II adds a God who withholds the evidence people would need in order to believe." },
        { id: "coh-c-nature", why: "Objection I asks whose standard of good we use to judge God, the old question from Plato's dialogue Euthyphro." },
      ],
      sources: [
        { title: "Athanasian Creed (Quicunque vult)", by: "Anonymous, traditionally ascribed to Athanasius", year: "c. 500", url: "https://www.ccel.org/creeds/athanasian.creed.html", note: "The whole creed, which opens and closes by making the catholic faith the condition of salvation." },
        { title: "Sinners in the Hands of an Angry God", by: "Jonathan Edwards", year: "1741", url: "https://www.ccel.org/ccel/edwards/sermons.sinners.html", note: "The sermon with the spider held over the fire." },
        { title: "The Problem of Hell", by: "Jonathan L. Kvanvig", year: "1993", note: "The objection that endless punishment is out of all proportion to any sin, and the main replies, from a sympathetic critic." },
        { title: "Hell", by: "Internet Encyclopedia of Philosophy (C. P. Ragland)", url: "https://iep.utm.edu/hell/", note: "A survey of the traditional view, annihilation, the free-will view and universalism, and of the charge that endless hell is unjust." },
      ],
      children: [
        {
          id: "mor-chosen-hell",
          side: "theist",
          label: "Hell lasts because the damned keep refusing God",
          gist: "{{aquinas}} held that the damned go on refusing God after death, so their punishment lasts as long as their offense does.",
          body: [
            "The complaint about an infinite sentence for a finite crime assumes the crime is over, and {{aquinas}} denied that it is. On his account sin disturbs the right order between a person and God, and the debt of punishment lasts while the disturbance does (*Summa Theologiae* I-II q.87 a.3). A will that has turned away from God, its final good, and stays turned away is still committing the offense.",
            "No court matches a sentence to the length of the deed. “Adultery or murder is committed in a moment”, Aquinas notes, and neither is punished for a moment. Someone who makes sin his final aim “has the will to sin, everlastingly”, and death settles that choice. The pain matches the sin in severity, and only its length is endless. Aquinas added that endless punishment still warns the living, and that “God does not delight in punishments for their own sake; but He does delight in the order of His justice, which requires them.”",
          ],
          quote: {
            text: "Wherefore so long as the disturbance of the order remains the debt of punishment must needs remain also.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I-II q.87 a.3 (tr. Fathers of the English Dominican Province)",
            url: "https://www.newadvent.org/summa/2087.htm#article3",
          },
          thinkers: ["aquinas"],
          cedes: "Evidence that the damned want out, and are kept in anyway, would sink this answer.",
          see: [
            { id: "hid-hidden-resistance", why: "Objection II argues the same way, that refusal can run deeper than anyone reports." },
            { id: "mor-locked-door", why: "The other classic version, in which the door stays open to the end." },
          ],
          sources: [
            { title: "Summa Theologiae I-II q.87 (On the Debt of Punishment)", by: "Thomas Aquinas", year: "c. 1271", url: "https://www.newadvent.org/summa/2087.htm#article3", note: "Article 3 argues that sin can earn endless punishment, and its replies take up the objections from proportion, medicine and God's delight." },
            { title: "Heaven and Hell in Christian Thought", by: "Stanford Encyclopedia of Philosophy (Thomas Talbott)", year: "2013, rev. 2025", url: "https://plato.stanford.edu/entries/heaven-hell/", note: "Section 2 covers Augustine's hell and the objection that no finite sin deserves an infinite penalty." },
            { title: "Dante's Hell, Aquinas's Moral Theory, and the Love of God", by: "Eleonore Stump", year: "1986", note: "Canadian Journal of Philosophy 16. A sympathetic reading of Aquinas on why God keeps the damned in being." },
          ],
          children: [
            {
              id: "mor-fixed-will",
              side: "skeptic",
              label: "If death fixes the will, God keeps the damned locked in",
              gist: "{{aquinas}} says the will is fixed at death and only God could heal it, so the damned stay because God declines to, though they want out of the pain.",
              body: [
                "{{aquinas}}'s answer needs the refusal to belong to the damned person, and his other writings make that hard to keep. In the *Summa Contra Gentiles* (IV.92–95) he holds that the will is fixed in its last choice at death and can never turn again, so the debt of punishment, which lasts “so long as the disturbance of the order remains”, never ends. His damned do not repent of sin itself, because “consent in the malice of sin will remain in them”, but they repent “indirectly, inasmuch as they will suffer from the punishment inflicted on them for sin” (*Summa Theologiae* Suppl. q.98 a.2). So they want out of the pain and are kept in anyway.",
                "Aquinas also writes that the ruined will is irreparable only when “considered in itself”, and that God has the power to repair it. So the damned are held in hell by a choice made in the last moment of life, which God could undo but leaves fixed and punishes without end.",
              ],
              quote: {
                text: "Consequently if a sin destroys the principle of the order whereby man's will is subject to God, the disorder will be such as to be considered in itself, irreparable, although it is possible to repair it by the power of God.",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I-II q.87 a.3 (tr. Fathers of the English Dominican Province)",
                url: "https://www.newadvent.org/summa/2087.htm#article3",
              },
              thinkers: ["aquinas"],
              cedes:
                "This fails if hell's permanence comes from the damned alone, and not from a God who could heal the will and declines to.",
              see: [
                { id: "coh-b-classical", why: "Objection I's God who moves every will, here moving one toward hell and holding it there." },
                { id: "mor-universalism", why: "If God can repair any will, Hart asks why he would leave one unrepaired." },
              ],
              sources: [
                { title: "Summa Contra Gentiles, Book IV, chapters 92–95", by: "Thomas Aquinas", year: "c. 1265", url: "https://isidore.co/aquinas/ContraGentiles4.htm", note: "The chapters arguing that at death the will is fixed in good or in evil and can never change." },
                { title: "Summa Theologiae, Supplement q.98 (On the Will and Intellect of the Damned)", by: "Thomas Aquinas (compiled after his death)", url: "https://www.newadvent.org/summa/5098.htm#article2", note: "Article 2 asks whether the damned repent, and answers that they regret the punishment but not the sin." },
                { title: "Hell", by: "Internet Encyclopedia of Philosophy (C. P. Ragland)", url: "https://iep.utm.edu/hell/", note: "Section 4, on hell and freedom, asks whether God could or should change the character the damned have chosen." },
              ],
            },
            {
              id: "mor-no-desert",
              side: "spinoza",
              label: "No one deserves hell, because no one chooses freely",
              gist: "{{spinoza}} denied that anyone could have chosen otherwise, so people who turn from God may be unhappy, but they cannot deserve punishment from an angry God.",
              body: [
                "{{aquinas}}'s reply assumes a will that could have turned the other way, and {{spinoza}} denied there is such a will. “Men are mistaken in thinking themselves free”, he wrote, because “their opinion is made up of consciousness of their own actions, and ignorance of the causes by which they are conditioned” (*Ethics* II P35 Schol.). The will “cannot be called a free cause, but only a necessary cause” (I P32). If no refusal is free and uncaused, no one in hell deserves to be there. In a 1676 letter to {{oldenburg|Henry Oldenburg}}, secretary of the Royal Society in London, he wrote that God cannot be angry, and that people who sin from weakness are excusable but can still be unhappy. When Scripture calls God a judge who passes sentence, it is “speaking humanly”, he added, since “its purpose is not to teach philosophy, nor to render men wise, but to make them obedient”. In his view “we can no more command for ourselves a healthy body than a healthy mind”, and a weak nature brings its own loss, as a weak body does, with no judge adding a penalty.",
              ],
              quote: {
                text: "I fully admit that God cannot be angry, and that all things are done in accordance with His will; but I deny that all men ought, therefore, to be blessed—men may be excusable, and, nevertheless, be without blessedness and afflicted in many ways.",
                who: "Baruch Spinoza",
                cite: "Letter 78, to Oldenburg, 7 Feb. 1676 (tr. R. H. M. Elwes)",
                url: "https://archive.org/details/chiefworksofbene02spin/page/306",
              },
              thinkers: ["spinoza", "oldenburg"],
              cedes: "A choice that was uncaused and yet still the chooser's own would answer {{spinoza}} here.",
              see: [
                { id: "coh-b-spinoza", why: "The same denial of free will removes Objection I's puzzle about foreknowledge." },
                { id: "coh-b-needslib", why: "Objection I warns that this way out leaves God unable to judge fairly." },
              ],
              sources: [
                { title: "The Chief Works of Benedict de Spinoza, vol. 2, Letter 78 (Elwes XXV)", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1884 (1891 printing)", url: "https://archive.org/details/chiefworksofbene02spin/page/305", note: "To Oldenburg, 7 Feb. 1676. Spinoza argues that people can be excusable and still unhappy." },
                { title: "Ethics, Parts I–II", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "Part I, proposition 32, and the scholium to Part II, proposition 35, on why the will is not free." },
                { title: "Baruch Spinoza", by: "Stanford Encyclopedia of Philosophy (Steven Nadler)", year: "2001, rev. 2023", url: "https://plato.stanford.edu/entries/spinoza/", note: "A general introduction, including Spinoza's rejection of a God who acts for ends, rewarding and punishing." },
              ],
              children: [
                {
                  id: "mor-spinoza-few",
                  side: "theist",
                  label: "Aquinas's hell needs no uncaused choice and no angry God",
                  gist: "{{aquinas}} never said choices are uncaused or that God gets angry, and {{spinoza}}'s own letter says people can be excusable and still perish.",
                  body: [
                    "{{spinoza}}'s [[determinism|determinism]] answers a hell {{aquinas}} never taught. For Aquinas, God moves the will as its [[primary-secondary-causation|first cause]] and the choice is still the chooser's own, as ((coh-a-concur|Objection I argues)). Many secular philosophers think blame survives determinism too. Harry Frankfurt argued in 1969 that you can be morally responsible for an act you could not have avoided, and {{strawson}} argued in 1962 that [[reactive-attitudes|resentment and gratitude]], the ways we hold one another to account, don't depend on uncaused choices.",
                    "Spinoza's letter also grants that whoever cannot govern his desires “necessarily perishes”, excusable or not (Letter 78). That is close to Aquinas's hell, a ruin that follows from turning from God. Aquinas's God is not angry either. “Anger and the like are attributed to God on account of a similitude of effect”, he wrote, since punishing is what angry men do (*Summa Theologiae* I q.3 a.2 ad 2).",
                  ],
                  quote: {
                    text: "He who goes mad from the bite of a dog is excusable, yet he is rightly suffocated.",
                    who: "Baruch Spinoza",
                    cite: "Letter 78, to Oldenburg (1676; tr. R. H. M. Elwes)",
                    url: "https://archive.org/details/chiefworksofbene02spin/page/306",
                  },
                  thinkers: ["aquinas", "strawson", "spinoza"],
                  cedes:
                    "This reply collapses if blame turns out to require a choice with no cause at all, or if the “perishing” that {{spinoza}} says awaits the weak is nothing like a penalty.",
                  see: [
                    { id: "coh-b-needslib", why: "Objection I argues that a God who moves every will causes the sins he judges." },
                    { id: "mor-fixed-will", why: "If God moves the will, the Objector asks who keeps it fixed." },
                  ],
                  sources: [
                    { title: "Summa Theologiae I q.3 a.2", by: "Thomas Aquinas", year: "c. 1268", url: "https://www.newadvent.org/summa/1003.htm#article2", note: "The reply to objection 2 explains why anger is said of God." },
                    { title: "Freedom and Resentment", by: "P. F. Strawson", year: "1962", note: "Proceedings of the British Academy 48. Strawson's case that holding people responsible rests on attitudes like resentment and gratitude." },
                    { title: "Alternate Possibilities and Moral Responsibility", by: "Harry G. Frankfurt", year: "1969", note: "Journal of Philosophy 66. Cases in which someone is responsible for an act he could not have avoided." },
                    { title: "Moral Responsibility", by: "Stanford Encyclopedia of Philosophy (Matthew Talbert)", year: "2019, rev. 2024", url: "https://plato.stanford.edu/entries/moral-responsibility/", note: "Sections 1 and 2 explain Frankfurt's cases and Strawson's reactive attitudes." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-locked-door",
          side: "theist",
          label: "The damned lock hell's door from the inside",
          gist: "{{lewis-cs}} and the philosopher {{walls}} held that God never stops offering heaven, and the damned stay because they keep choosing themselves, so hell is God respecting their refusal.",
          body: [
            "In *The Problem of Pain* (1940) {{lewis-cs}} wrote, “I willingly believe that the damned are, in one sense, successful, rebels to the end; that the doors of hell are locked on the *inside*.”",
            "In *The Great Divorce* (1945) a bus runs from hell to heaven, and the damned may stay in heaven if they like. Almost none do, because staying means giving up something they cling to, such as a grudge or their pride. Lewis's guide in the book, the Scottish writer {{macdonald-george|George MacDonald}}, puts it this way: “There are only two kinds of people in the end: those who say to God, ‘Thy will be done,’ and those to whom God says, in the end, ‘*Thy* will be done.’”",
            "{{walls}} turned the picture into an argument in *Hell: The Logic of Damnation* (1992). He argues that love does not force anyone, and that a [[libertarian-freedom|freedom]] that could never finally say No would not be freedom. By freedom he means the strong kind, in which a person could have chosen otherwise. If God wants to be loved, he has to allow himself to be refused, and keep allowing it.",
          ],
          quote: {
            text: "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.",
            who: "Jesus, in the Book of Revelation",
            cite: "Revelation 3:20 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Revelation#3:20",
          },
          thinkers: ["lewis-cs", "walls"],
          cedes: "If a door held open forever would in the end win every will, this answer turns into the view that [[universalism|everyone is finally saved]].",
          see: [
            { id: "coh-b-needslib", why: "Walls needs the strong kind of free will, which Objection I argues the classical God, who causes every choice, can't allow." },
            { id: "mor-chosen-hell", why: "Aquinas's version, in which the will is fixed at death." },
          ],
          sources: [
            { title: "Hell: The Logic of Damnation", by: "Jerry L. Walls", year: "1992", note: "The philosophical case that a loving God must allow a final refusal." },
            { title: "The Great Divorce", by: "C. S. Lewis", year: "1945", note: "Lewis's story of a bus trip from hell to heaven, where almost no one chooses to stay." },
            { title: "The Problem of Pain", by: "C. S. Lewis", year: "1940", note: "Chapter 8, “Hell”, where Lewis says the doors of hell are locked on the inside." },
            { title: "Hell", by: "Internet Encyclopedia of Philosophy (C. P. Ragland)", url: "https://iep.utm.edu/hell/", note: "Its section on the free-will view explains hell as God honoring the choices the damned have made." },
          ],
          children: [
            {
              id: "mor-door-empties",
              side: "skeptic",
              label: "A door held open forever would empty hell",
              gist: "If God never stops inviting and the door never closes, a refusal is very unlikely to last forever, so this kind of hell slowly empties.",
              body: [
                "Suppose there is some chance, however small, that a person turns back, and the chance never shrinks and comes again and again without end. Then the odds that the person never turns fall to zero. {{talbott}} argues that no one could choose endless misery with fully open eyes, and the philosophers John Kronen and Eric Reitan argue in *God's Final Victory* (2011) that a hell of free choice slides into ((mor-universalism|universalism)), the view that everyone is finally saved. In {{lewis-cs}}'s own story, *The Great Divorce*, “the damned have holidays”, excursions to heaven offered to “those that will take them”. The philosopher {{adams-marilyn-m}} asks why a loving God would let immature, half-informed people set a course toward endless ruin at all. No loving parent lets a toddler keep choosing to play in traffic because the choice is his, and the shepherd in Jesus' parable goes looking for the lost sheep.",
              ],
              quote: {
                text: "What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after that which is lost, until he find it?",
                who: "Jesus, in Luke's Gospel",
                cite: "Luke 15:4 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/Luke#15:4",
              },
              thinkers: ["talbott", "adams-marilyn-m", "lewis-cs"],
              cedes:
                "A will that hardened with every chance it was given would answer this, since endless time would then fix the refusal in place.",
              see: [
                { id: "hid-pursues", why: "Objection II argues that perfect love goes after the person who resists it." },
              ],
              sources: [
                { title: "The Problem of Hell: A Problem of Evil for Christians", by: "Marilyn McCord Adams", year: "1993", note: "In Eleonore Stump, ed., Reasoned Faith. Adams argues that choices made in ignorance and confusion cannot earn endless ruin." },
                { title: "God's Final Victory: A Comparative Philosophical Case for Universalism", by: "John Kronen and Eric Reitan", year: "2011", note: "Two philosophers argue that the main defenses of hell, the free-will one included, point toward universal salvation." },
                { title: "The Inescapable Love of God", by: "Thomas Talbott", year: "1999", note: "Talbott's book-length case that no one could reject God forever with full understanding." },
                { title: "Heaven and Hell in Christian Thought", by: "Stanford Encyclopedia of Philosophy (Thomas Talbott)", year: "2013, rev. 2025", url: "https://plato.stanford.edu/entries/heaven-hell/", note: "Sections 3.1 and 4.2, on universalism and human freedom." },
              ],
              children: [
                {
                  id: "mor-no-becomes-self",
                  side: "theist",
                  label: "A refusal repeated long enough becomes who the person is",
                  gist: "Choices shape character, so someone who refuses God for ages may become a person who can no longer turn back.",
                  body: [
                    "The odds argument treats each chance as a fresh coin toss, unaffected by the last, but character doesn't work like that. {{aristotle}} said we “become just by doing just acts” (*Nicomachean Ethics* II.1), and that for a man who has made himself unjust, “it does not follow that if he wishes he will cease to be unjust and will be just” (III.5). {{walls}} argues (1992) that a person can reach a settled, decisive evil, a self organized around refusing. {{swinburne}} argued in 1983 that by repeated choices a person can lose the ability to choose the good at all.",
                    "{{lewis-cs}} dramatized it in *The Great Divorce*. Of a woman whose grumbling habit may have swallowed her, Lewis's guide, {{macdonald-george|George MacDonald}}, says, “The question is whether she is a grumbler, or only a grumble.” He adds: “If there's one wee spark under all those ashes, we'll blow it till the whole pile is red and clear. But if there's nothing but ashes we'll not go on blowing them in our own eyes forever. They must be swept up.”",
                  ],
                  quote: {
                    text: "So, too, to the unjust and to the self-indulgent man it was open at the beginning not to become men of this kind … but now that they have become so it is not possible for them not to be so.",
                    who: "Aristotle",
                    cite: "Nicomachean Ethics III.5 (tr. W. D. Ross)",
                    url: "https://classics.mit.edu/Aristotle/nicomachaen.3.iii.html",
                  },
                  thinkers: ["walls", "swinburne", "lewis-cs", "aristotle"],
                  cedes:
                    "A refusal that stayed as easy to reverse after ages as it was the first time would sink this answer.",
                  see: [
                    { id: "hid-hidden-resistance", why: "Objection II argues that a will can be divided in ways its owner cannot see." },
                  ],
                  sources: [
                    { title: "Nicomachean Ethics, Book III", by: "Aristotle (trans. W. D. Ross)", year: "c. 340 BCE", url: "https://classics.mit.edu/Aristotle/nicomachaen.3.iii.html", note: "Chapter 5 argues that people are responsible for the characters their choices make." },
                    { title: "A Theodicy of Heaven and Hell", by: "Richard Swinburne", year: "1983", note: "In Alfred J. Freddoso, ed., The Existence and Nature of God. Swinburne argues that repeated choices can leave a person unable to choose the good." },
                    { title: "The Great Divorce", by: "C. S. Lewis", year: "1945", note: "Chapter 9, the woman who may have become only a grumble." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-annihilation",
          side: "theist",
          label: "The lost are finally destroyed and do not suffer forever",
          gist: "The Bible speaks of the lost dying or being destroyed, so on this view they [[annihilationism|finally cease to exist]].",
          body: [
            "Endless torment assumes the soul cannot die. Defenders of [[annihilationism|annihilationism]], the view that the lost are finally destroyed (also called conditional immortality), trace that idea to {{plato}}, and point out that in the Bible God “only hath immortality” (1 Timothy 6:16) and gives life as a gift. They note that the Bible's words for the fate of the lost are words of destruction. John's Gospel says whoever believes “should not perish” (3:16), {{paul|Paul}} says “the wages of sin is death” (Romans 6:23), and Jesus says God can destroy soul and body alike (Matthew 10:28).",
            "{{fudge}} argued for it at length in *The Fire That Consumes* (1982), and {{stott}}, a leading evangelical, tentatively endorsed it in 1988. On their reading the fire consumes what it burns, and the punishment is everlasting because its result is permanent, “everlasting destruction” (2 Thessalonians 1:9).",
          ],
          quote: {
            text: "And fear not them which kill the body, but are not able to kill the soul: but rather fear him which is able to destroy both soul and body in hell.",
            who: "Jesus, in Matthew's Gospel",
            cite: "Matthew 10:28 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#10:28",
          },
          thinkers: ["fudge", "stott"],
          cedes:
            "This view fails if the “everlasting punishment” of Matthew 25:46 can only mean conscious suffering without end.",
          see: [{ id: "mor-development", why: "Arnobius, a North African Christian writer, taught the same around 300, so this is no modern softening." }],
          sources: [
            { title: "The Fire That Consumes", by: "Edward William Fudge", year: "1982", note: "The main modern case that the lost are finally destroyed, argued from the Bible's language of death and destruction." },
            { title: "Evangelical Essentials: A Liberal-Evangelical Dialogue", by: "David L. Edwards with John Stott", year: "1988", note: "Stott's tentative case for annihilation is in his reply on judgment and hell." },
            { title: "Hell", by: "Internet Encyclopedia of Philosophy (C. P. Ragland)", url: "https://iep.utm.edu/hell/", note: "Its section on annihilationism sets out the view and the objections to it." },
          ],
          children: [
            {
              id: "mor-perish-belief",
              side: "skeptic",
              label: "Annihilation still punishes people for what they believe",
              gist: "Destroying unbelievers is gentler than tormenting them but keeps the test of belief, and Jesus uses one word, “eternal”, for both the punishment and the life.",
              body: [
                "[[annihilationism|Annihilationism]] fixes one of the two problems in the ((mor-hell|original charge)), which objected both to the test (belief) and to the penalty. An honest doubter who dies unconvinced is now erased where before he was tortured, and he is still being punished for what he believed. A court that stopped torturing people for their opinions and executed them instead would still be punishing opinions.",
                "{{augustine}} answered the softeners of his day from the texts, citing Matthew 25:46, where one word, “eternal”, describes both the punishment and the life: “If both destinies are eternal, then we must either understand both as long-continued but at last terminating, or both as endless” (*City of God* XXI.23, tr. Marcus Dods). Revelation describes “the smoke of their torment” rising “for ever and ever”, with “no rest day nor night” (14:11). A punishment is something someone undergoes, so annihilationists have to read the plainest descriptions of conscious suffering as figures of speech.",
              ],
              quote: {
                text: "And these shall go away into everlasting punishment: but the righteous into life eternal.",
                who: "Jesus, in Matthew's Gospel",
                cite: "Matthew 25:46 (KJV)",
                url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#25:46",
              },
              thinkers: ["augustine"],
              cedes:
                "If annihilation fell only on those who knowingly refused the good, never on an honest doubter, and the texts about lasting torment read naturally as lasting destruction, I would drop this.",
              see: [
                { id: "mor-allegiance", why: "How the Defender answers the complaint about the test of belief." },
              ],
              sources: [
                { title: "The City of God, Book XXI", by: "Augustine (trans. Marcus Dods)", year: "c. 426", url: "https://www.newadvent.org/fathers/120121.htm", note: "Chapter 23 answers those who deny that punishment is eternal, arguing from Matthew 25:41 and 25:46." },
                { title: "Revelation 14:9–11 (King James Version)", by: "King James Bible", year: "1611", url: "https://en.wikisource.org/wiki/Bible_(King_James)/Revelation#14:9", note: "Revelation, c. 95. The passage about the smoke of their torment rising for ever and ever." },
                { title: "Four Views on Hell", by: "Preston Sprinkle, ed.", year: "2016", note: "Denny Burk defends eternal conscious torment and John Stackhouse annihilation, and each answers the other." },
              ],
            },
          ],
        },
        {
          id: "mor-universalism",
          side: "theist",
          label: "God's love finally restores every soul, so hell ends",
          gist: "The third-century theologian {{origen}} and others taught that God's love [[universalism|finally heals every soul]], so hell is real but corrective, and it ends.",
          body: [
            "One of the oldest alternatives to endless hell is [[apokatastasis|apokatastasis]], Greek for “restoration”, the belief that God will finally restore all things. {{origen}} taught it. “We think, indeed,” he wrote, “that the goodness of God, through His Christ, may recall all His creatures to one end, even His enemies being conquered and subdued” (*On First Principles* I.6.1). {{gregory-of-nyssa}}, a fourth-century bishop, hoped for every creature's return. {{isaac-of-nineveh}}, a seventh-century bishop and monk who wrote in Syriac, said that “even those who are scourged in Hell are tormented with the scourgings of love” (*Mystic Treatises* XXVII).",
            "{{paul|Paul}} supplies the texts: “as in Adam all die, even so in Christ shall all be made alive” (1 Corinthians 15:22), and God means through Christ “to reconcile all things unto himself” (Colossians 1:20).",
            "The Orthodox theologian {{hart}} argues from God's nature in *That All Shall Be Saved* (2019). A God who creates from nothing, knowing that some creatures will suffer forever, wills that outcome as surely as anything else he wills, and if he is goodness itself he cannot will it. {{talbott}} adds, in the Stanford Encyclopedia of Philosophy, that choosing a life apart from God with full understanding would be “utterly and almost inconceivably irrational”, too irrational to count as free.",
          ],
          quote: {
            text: "And when all things shall be subdued unto him, then shall the Son also himself be subject unto him that put all things under him, that God may be all in all.",
            who: "Paul",
            cite: "1 Corinthians 15:28 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/1_Corinthians#15:28",
          },
          thinkers: ["origen", "gregory-of-nyssa", "isaac-of-nineveh", "hart", "talbott"],
          cedes:
            "A creature able to refuse its own good forever with full understanding, or a Scripture whose “everlasting” punishment can only mean punishment without end, would defeat this hope.",
          see: [{ id: "mor-locked-door", why: "Talbott's argument is aimed at the locked-door hell." }],
          sources: [
            { title: "That All Shall Be Saved: Heaven, Hell, and Universal Salvation", by: "David Bentley Hart", year: "2019", note: "Hart's argument that a good God who creates from nothing cannot will endless torment." },
            { title: "On First Principles (De Principiis), Book I", by: "Origen (trans. Frederick Crombie)", year: "c. 230", url: "https://www.newadvent.org/fathers/04121.htm", note: "Chapter 6, on the end of all things, where Origen hopes God will recall every creature." },
            { title: "On the Soul and the Resurrection", by: "Gregory of Nyssa", year: "c. 380", url: "https://www.newadvent.org/fathers/2915.htm", note: "A dialogue in which his sister Macrina argues that evil will finally be wiped out and God be all in all." },
            { title: "Mystic Treatises", by: "Isaac of Nineveh (trans. A. J. Wensinck, 1923)", year: "7th century", url: "https://archive.org/details/isaac_of_nineveh_mystical_treatises", note: "Translated from the Syriac. Treatise XXVII has the line about the scourgings of love." },
          ],
          children: [
            {
              id: "mor-flew",
              side: "skeptic",
              label: "Every softening of hell concedes the objection",
              gist: "The church condemned [[universalism|universal salvation]] in 543 and taught endless punishment in 1215, so reviving it now means letting conscience overrule centuries of teaching.",
              body: [
                "The church weighed [[apokatastasis|restoration]] and rejected it. In 543 the emperor {{justinian|Justinian}}'s edict against {{origen}} condemned anyone who “says or thinks that the punishment of demons and of impious men is only temporary, and will one day have an end”. The Fourth Lateran Council in 1215 said the damned would receive “eternal punishment with the devil”. Michael McClymond's history of Christian [[universalism|universalism]], *The Devil's Redemption* (2018), finds it a minority current through the centuries, often esoteric and often condemned. The British philosopher {{flew}} named what happens to a claim that is revised every time it meets an objection: “A fine brash hypothesis may thus be killed by inches, the death by a thousand qualifications” (1950). The Objector argues that the doctrine of hell changed because consciences trained to find the old picture unworthy of a good God could no longer bear it, though no new texts had turned up. Each softening grants the objection's premise, that a good God would not do this.",
              ],
              quote: {
                text: "It is in vain, then, that some, indeed very many, make moan over the eternal punishment, and perpetual, unintermitted torments of the lost, and say they do not believe it shall be so; not, indeed, that they directly oppose themselves to Holy Scripture, but, at the suggestion of their own feelings, they soften down everything that seems hard, and give a milder turn to statements which they think are rather designed to terrify than to be received as literally true.",
                who: "Augustine",
                cite: "Enchiridion 112 (c. 421; tr. J. F. Shaw)",
                url: "https://www.newadvent.org/fathers/1302.htm",
              },
              thinkers: ["augustine", "flew"],
              cedes:
                "I'd give this up if the revisions could be shown to follow from the faith's own premises, with no help from mine.",
              see: [
                { id: "evi-b-inerrancy", why: "Objection IV makes a similar move, dropping a doctrine the creeds never fixed." },
              ],
              sources: [
                { title: "The Devil's Redemption: A New History and Interpretation of Christian Universalism", by: "Michael J. McClymond", year: "2018", note: "A critical history arguing that Christian universalism was a minority view, often esoteric and often condemned." },
                { title: "Theology and Falsification", by: "Antony Flew", year: "1950", note: "Flew's short essay on claims that die “the death by a thousand qualifications”." },
                { title: "The Anathemas of the Emperor Justinian Against Origen", by: "Justinian I", year: "543", url: "https://www.newadvent.org/fathers/3812.htm", note: "Printed with the acts of the Second Council of Constantinople. The ninth anathema condemns the view that punishment will end." },
                { title: "Fourth Lateran Council, canon 1", by: "Fourth Lateran Council", year: "1215", url: "https://sourcebooks.fordham.edu/basis/lateran4.asp", note: "The council's creed, in which the damned receive “eternal punishment with the devil”." },
              ],
              children: [
                {
                  id: "mor-development",
                  side: "theist",
                  label: "Doctrine can change by working out what the faith's core implies",
                  gist: "Cardinal {{newman}} argued that a living doctrine grows by working out what its core implies, as Christians did over slavery, and the early church already disagreed about hell.",
                  body: [
                    "{{newman}} argued in 1845 that a living doctrine grows as the church works out what its core implies. The church once tolerated slavery and now condemns it, and Christian abolitionists cited “there is neither bond nor free” (Galatians 3:28). The theologian {{hart}} argues for [[universalism|universal salvation]] from {{aquinas}}'s own premises.",
                    "Early Christians disagreed about hell. {{augustine}} reports that “very many” rejected endless torment, and Arnobius, a North African Christian, taught around 300 that the wicked are finally consumed. {{justinian|Justinian}}'s edict of 543 was an emperor's decree. The anathemas, or formal curses, attached to the Second Council of Constantinople (553) condemned “the monstrous restoration” tied to souls existing before birth, a view that {{gregory-of-nyssa}}, a universalist bishop, did not hold. Gregory himself was never condemned.",
                    "The Greek [[aionios|aiōnios]], translated “eternal”, comes from *aiōn*, “age”, and can mean “of the age to come” or “lasting in its effect” without meaning “endless”. “Eternal redemption” (Hebrews 9:12) is the lasting result of one act, and Sodom's “eternal fire” (Jude 7) went out long ago.",
                  ],
                  quote: {
                    text: "It changes with them in order to remain the same. In a higher world it is otherwise, but here below to live is to change, and to be perfect is to have changed often.",
                    who: "John Henry Newman",
                    cite: "An Essay on the Development of Christian Doctrine, ch. 1, sect. 1, §7 (1845; 1878 ed.)",
                    url: "https://www.newmanreader.org/works/development/chapter1.html",
                  },
                  thinkers: ["newman", "hart", "gregory-of-nyssa"],
                  cedes: "If these views could only be defended with a premise from outside the tradition, I'd grant the objection.",
                  see: [
                    { id: "mor-convicts", why: "The Objector's version of correcting from within, aimed at the whole moral picture." },
                    { id: "evi-b-core", why: "Objection IV tries the same kind of correction on the hardest case, the miracles themselves." },
                  ],
                  sources: [
                    { title: "An Essay on the Development of Christian Doctrine", by: "John Henry Newman", year: "1845", url: "https://www.newmanreader.org/works/development/", note: "Chapter 1 explains how a living idea develops over time and still stays itself." },
                    { title: "Against the Heathen, Book II", by: "Arnobius", year: "c. 300", url: "https://www.newadvent.org/fathers/06312.htm", note: "Chapter 14, where the souls of the wicked are finally annihilated." },
                    { title: "The Anathemas Against Origen", by: "Second Council of Constantinople (attributed)", year: "553", url: "https://www.newadvent.org/fathers/3812.htm", note: "The first anathema ties “the monstrous restoration” to souls existing before birth." },
                    { title: "The Christian Doctrine of Apokatastasis", by: "Ilaria L. E. Ramelli", year: "2013", note: "A long scholarly study arguing that many early Christian writers hoped for universal restoration." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-allegiance",
          side: "theist",
          label: "The faith that saves is loyalty, and Jesus judges by deeds",
          gist: "The Gospels' word for faith mostly meant trust and loyalty, and Jesus judges people by what they did for the least, so “hell for wrong belief” misreads the test.",
          body: [
            "The charge assumes the test is belief, but the Greek suggests otherwise. [[pistis|Pistis]], the word translated “faith”, meant above all trust and loyalty in the Roman world, keeping faith with someone, as the classicist Teresa Morgan argues in *Roman Faith and Christian Faith* (2015). {{bates}}, a New Testament scholar, proposes that the gospel's “faith” is best translated as allegiance to Jesus as king.",
            "When Jesus describes the judgment in Matthew 25, the nations are sorted by whether they fed the hungry and visited the prisoner, and the saved are surprised to learn they had served him: “Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me” (25:40). {{paul|Paul}} says Gentiles, who lacked the Jewish law, show “the work of the law written in their hearts” (Romans 2:15). On this reading an honest doubter who feeds the hungry may be on the right side of the judgment.",
          ],
          quote: {
            text: "Thou believest that there is one God; thou doest well: the devils also believe, and tremble.",
            who: "The Letter of James",
            cite: "James 2:19 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/James#2:19",
          },
          thinkers: ["bates"],
          cedes:
            "If the Gospels and Paul made agreeing with certain statements the dividing line, this reading would be wrong.",
          see: [
            { id: "hid-devils-believe", why: "The Objector uses the same verse in Objection II." },
            { id: "evi-a", why: "Objection IV asks what kind of belief faith requires, and on what evidence." },
          ],
          sources: [
            { title: "Salvation by Allegiance Alone", by: "Matthew W. Bates", year: "2017", note: "One influential proposal, contested in its strong form." },
            { title: "Roman Faith and Christian Faith", by: "Teresa Morgan", year: "2015", note: "A classicist's study of pistis as trust and loyalty in the Roman world and the early church." },
            { title: "Faith", by: "Stanford Encyclopedia of Philosophy (John Bishop and Daniel J. McKaughan)", year: "2010, rev. 2023", url: "https://plato.stanford.edu/entries/faith/", note: "Section 6 treats faith as an act of trust and cites Morgan on the Greek word." },
            { title: "Matthew 25:31–46 (King James Version)", by: "King James Bible", year: "1611", url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#25:31", note: "Matthew, c. 80–90. The judgment of the nations, sorted by what they did for the least." },
          ],
          children: [
            {
              id: "mor-works",
              side: "spinoza",
              label: "If deeds decide, belief in the resurrection can't be required",
              gist: "{{spinoza}} judged faith by works alone and drew a conclusion the church rejects, that no belief about history, even the resurrection, can be required for salvation.",
              body: [
                "{{spinoza}} judged faith by loyalty lived out, centuries before the scholar {{bates}}. In the *Theological-Political Treatise* (1670, ch. 14) he reads the letters of James and John and concludes that faith is known only by works, whatever a person's doctrines. Faith, he wrote, “does not so much require truth as piety”, and needs only the beliefs obedience needs, chiefly that God exists and is served by justice and charity to one's neighbor. No belief about history makes his list.",
                "The church rejects this, on the ground that you cannot pledge loyalty to a *risen* king without believing he rose. Scripture ties salvation to it: “believe in thine heart that God hath raised him from the dead” (Romans 10:9), and there is “none other name under heaven” (Acts 4:12). Which Lord a sincere person serves depends heavily on where they were born. Either deeds decide, and the resurrection is optional, as Spinoza said, or the creed decides, and the honest doubter is judged by belief after all.",
              ],
              quote: {
                text: "… we can only judge a man faithful or unfaithful by his works. If his works be good, he is faithful, however much his doctrines may differ from those of the rest of the faithful.",
                who: "Baruch Spinoza",
                cite: "Theological-Political Treatise, ch. 14 (1670; tr. R. H. M. Elwes)",
                url: "https://www.gutenberg.org/cache/epub/991/pg991-images.html#chap14",
              },
              thinkers: ["spinoza"],
              cedes: "If loyalty to Jesus could be shown to need no belief that he rose, {{spinoza}}'s dilemma would fail.",
              see: [
                { id: "hid-demographics", why: "Objection II on how belief in God follows history and borders." },
                { id: "evi-b-minimal", why: "Loyalty to a risen king depends on Objection IV's case for the resurrection." },
                { id: "evi-b-spinoza", why: "Spinoza thought the Gospels' ethics survive their errors, while their miracles do not." },
              ],
              sources: [
                { title: "A Theologico-Political Treatise, Part III (chapters 11–15)", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1670", url: "https://www.gutenberg.org/ebooks/991", note: "Chapter 14 defines faith by obedience and lists the few beliefs it needs." },
                { title: "Spinoza's Political Philosophy", by: "Stanford Encyclopedia of Philosophy (Justin Steinberg)", year: "2008, rev. 2024", url: "https://plato.stanford.edu/entries/spinoza-political/", note: "Section 3 covers the Treatise, including its view that faith is whatever beliefs lead to piety and obedience." },
                { title: "A Book Forged in Hell: Spinoza's Scandalous Treatise and the Birth of the Secular Age", by: "Steven Nadler", year: "2011", note: "A readable account of the Treatise and the uproar it caused." },
              ],
              children: [
                {
                  id: "mor-inclusivism",
                  side: "theist",
                  label: "Christ can save people who never knew his name",
                  gist: "[[vatican-ii|Catholic teaching since 1964]], echoed by many Protestants, holds that people who never met the gospel, even honest atheists, can be saved by Christ through the good they served.",
                  body: [
                    "{{spinoza}}'s either-or leaves out [[inclusivism|inclusivism]], the view that Christ is the only Savior and still saves some who never knew his name. The Christian philosopher Justin Martyr wrote around 155 that “those who lived reasonably are Christians, even though they have been thought atheists”, naming Socrates and Heraclitus (*First Apology* 46).",
                    "The Catholic Church's [[vatican-ii|Second Vatican Council]] made the hope official in 1964, extending it to those who “have not yet arrived at an explicit knowledge of God” and try to live a good life (*Lumen Gentium* 16). In 1965 it added that the Holy Spirit offers everyone a share in Christ's death and rising “in a manner known only to God” (*Gaudium et Spes* 22).",
                    "The Catholic theologian {{rahner}} called such people “anonymous Christians”. In {{lewis-cs}}'s *The Last Battle* (1956), Aslan, the lion who stands for Christ, tells Emeth, who served the rival god Tash all his life, “Child, all the service thou hast done to Tash, I account as service done to me” (ch. 15). For inclusivists the resurrection is how Christ saves, and knowing about it is not required.",
                  ],
                  quote: {
                    text: "Those also can attain to salvation who through no fault of their own do not know the Gospel of Christ or His Church, yet sincerely seek God and moved by grace strive by their deeds to do His will as it is known to them through the dictates of conscience.",
                    who: "Second Vatican Council",
                    cite: "Lumen Gentium 16 (1964)",
                    url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html",
                  },
                  thinkers: ["rahner", "lewis-cs"],
                  cedes:
                    "This hope would not reach the informed doubter if the church taught that he counts as knowingly refusing Christ.",
                  see: [
                    { id: "hid-messengers", why: "In Objection II, God chose to be known through people, so belief spreads unevenly." },
                    { id: "hid-seeking-is-finding", why: "The seeker's longing as a first, unrecognized contact with God." },
                  ],
                  sources: [
                    { title: "Lumen Gentium (Dogmatic Constitution on the Church)", by: "Second Vatican Council", year: "1964", url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html", note: "Read §14 and §16 together." },
                    { title: "Gaudium et Spes (Pastoral Constitution on the Church in the Modern World)", by: "Second Vatican Council", year: "1965", url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651207_gaudium-et-spes_en.html", note: "Section 22, on the Holy Spirit offering everyone a share in Christ's death and rising." },
                    { title: "The First Apology", by: "Justin Martyr", year: "c. 155", url: "https://www.newadvent.org/fathers/0126.htm", note: "Chapter 46, on Socrates and others who lived by reason before Christ." },
                    { title: "Religious Diversity (Pluralism)", by: "Stanford Encyclopedia of Philosophy (David Basinger)", year: "2004, rev. 2025", url: "https://plato.stanford.edu/entries/religious-pluralism/", note: "Section 6 sets out exclusivist, inclusivist and pluralist views of salvation, including Rahner's “anonymous Christian”." },
                  ],
                  children: [
                    {
                      id: "mor-honest-doubter",
                      side: "skeptic",
                      label: "Blame the informed doubter, or grant Objection II's key premise",
                      gist: "Either the doubter who heard the gospel and declined is to blame, or he is blameless, which grants Objection II's premise that some unbelief is nobody's fault.",
                      body: [
                        "[[inclusivism|Inclusivism]] covers the villager who never heard the gospel. Two replies in Objection II leave it no room for the Objector, who heard it, weighed it and said no. If {{moser}} is right, an unconvinced seeker is resisting God somewhere, and if {{calvin}} is right, God has “endued all men with some idea of his Godhead” so that all who do not worship him “may be condemned by their own conscience” (*Institutes* I.3.1). Either way he is to blame, and [[vatican-ii|Catholic teaching]] (*Lumen Gentium* 14) shuts out whoever knows and refuses.",
                        "Other replies there spare him, and each concedes that [[nonresistant-nonbelief|some nonbelief is blameless]], a premise of {{schellenberg}}'s argument from God's hiddenness. {{rea}} accepts honest unbelief and answers Schellenberg on other grounds. {{plantinga}} ((hid-sensus|blames no one)) whose [[sensus-divinitatis|inborn sense of God]] is damaged by inherited sin, and {{stump}}'s account of a will divided against itself ((hid-hidden-resistance|carries no blame)). So sparing the informed doubter grants that premise in Objection II.",
                      ],
                      quote: {
                        text: "Whosoever, therefore, knowing that the Catholic Church was made necessary by Christ, would refuse to enter or to remain in it, could not be saved.",
                        who: "Second Vatican Council",
                        cite: "Lumen Gentium 14 (1964)",
                        url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html",
                      },
                      thinkers: ["moser", "calvin", "rea", "schellenberg", "plantinga", "stump"],
                      cedes:
                        "A way to call the informed doubter innocent here without granting, in Objection II, that some nonbelief is blameless would break this dilemma.",
                      see: [
                        { id: "hid-moser", why: "The willingness test that would make the informed doubter guilty." },
                        { id: "hid-sensus", why: "Calvin's claim that unbelievers suppress an inborn sense of God, and Plantinga's no-fault version, one for each side of the dilemma." },
                        { id: "hid-rea-love", why: "Rea's reply to Schellenberg, which accepts that honest unbelief exists." },
                        { id: "hid-argument", why: "The premise the second option grants, that some nonbelief is nobody's fault." },
                      ],
                      sources: [
                        { title: "Institutes of the Christian Religion, Book I, chapter 3", by: "John Calvin (trans. Henry Beveridge)", year: "1559", url: "https://www.ccel.org/ccel/calvin/institutes.iii.iv.html", note: "Calvin's case that knowledge of God is planted in every mind." },
                        { title: "Divine Hiddenness and Human Reason", by: "J. L. Schellenberg", year: "1993", note: "The book that launched the argument from blameless nonbelief." },
                        { title: "Hiddenness of God", by: "Stanford Encyclopedia of Philosophy (Daniel Howard-Snyder and Adam Green)", year: "2016, rev. 2022", url: "https://plato.stanford.edu/entries/divine-hiddenness/", note: "Sections 2 and 3 set out Schellenberg's argument and the attempts to explain blameless nonbelief." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-not-agent",
          side: "theist",
          label: "We can't measure God's goodness by a human judge's duties",
          gist: "God has no duties like ours, and “good” said of God only resembles what it means of us, so he can't be charged with a judge's broken duty.",
          body: [
            "Calling hell “monstrous” assumes God's goodness is a human judge's goodness on a larger scale, with the same duties. {{aquinas}} held instead that words like “good” apply to God by [[analogy-of-being|analogy]], naming something real in God in a way we only partly grasp. Such names, he wrote, “belong properly to God, and more properly than they belong to creatures”, and only our way of using them, borrowed from creatures, falls short (*Summa Theologiae* I q.13 a.3). The Dominican philosopher {{davies}} argues (2006) that duties bind members of a moral community, who depend on one another and can wrong one another. In his view the Creator of everything is not a fellow member with obligations to the others, and stands to creatures more as an author stands to characters, so a charge that he broke a duty doesn't apply. Davies still holds that God's goodness can be judged in other ways.",
          ],
          quote: {
            text: "For my thoughts are not your thoughts, neither are your ways my ways, saith the LORD. For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.",
            who: "The prophet Isaiah",
            cite: "Isaiah 55:8–9 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Isaiah#55:8",
          },
          thinkers: ["aquinas", "davies"],
          cedes: "This reply collapses if [[analogy-of-being|analogy]] leaves “good” so thin that it could fit any act at all.",
          see: [
            { id: "coh-a-analogy", why: "Objection I's defense of speaking about God by analogy." },
            { id: "hid-rea-love", why: "Rea's parallel argument that divine love need not look like a parent's." },
            { id: "hid-skeptical-theism", why: "The other route, argued in Objection II, that God may have reasons we cannot see." },
          ],
          sources: [
            { title: "The Reality of God and the Problem of Evil", by: "Brian Davies", year: "2006", note: "Davies argues that God is not a moral agent with duties to creatures." },
            { title: "Summa Theologiae I q.13 (The Names of God)", by: "Thomas Aquinas", year: "c. 1268", url: "https://www.newadvent.org/summa/1013.htm#article3", note: "Article 3 asks whether names like “good” apply to God literally, and article 5 explains analogy." },
            { title: "Medieval Theories of Analogy", by: "Stanford Encyclopedia of Philosophy (E. Jennifer Ashworth and Domenic D'Ettore)", year: "1999, rev. 2025", url: "https://plato.stanford.edu/entries/analogy-medieval/", note: "Section 6 explains Aquinas on analogy." },
          ],
          children: [
            {
              id: "mor-mansel",
              side: "skeptic",
              label: "If God's goodness is unlike ours, calling him good says nothing",
              gist: "If “good” said of God doesn't mean what it means of people, calling God good says nothing, and no mercy we could recognize allows endless torment.",
              body: [
                "When the theologian {{mansel|Henry Mansel}} argued in 1858 that God's goodness may differ in kind from ours, {{mill}} replied, “To say that God's goodness may be different in kind from man's goodness, what is it but saying, with a slight change of phraseology, that God may possibly not be good?” {{aquinas}}'s [[analogy-of-being|analogy]] doesn't escape the problem, because if what “good” signifies belongs to God properly, mercy in God must be recognizable as mercy, and endless torment is not. Even {{hart}}, who defends Aquinas's picture of God, makes the same point. Analogy is not equivocation, he argues (equivocation means using one word in two unrelated senses), and a “goodness” that permits eternal torment has stopped being analogous to anything we call good. {{davies}}'s point about duties doesn't help either. Whatever the answer to the [[euthyphro-dilemma|Euthyphro dilemma]], the charge needs only one premise, that endless torment is not what goodness, in any sense we can recognize, would do.",
              ],
              quote: {
                text: "I will call no being good, who is not what I mean when I apply that epithet to my fellow-creatures; and if such a being can sentence me to hell for not so calling him, to hell I will go.",
                who: "John Stuart Mill",
                cite: "An Examination of Sir William Hamilton's Philosophy (1865), ch. VII",
                url: "https://archive.org/details/examinationofsir01mill",
              },
              thinkers: ["mill", "hart"],
              cedes:
                "If some sense of “good” were true of God, allowed endless torment, and still meant something I could recognize, I would concede.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's version, in which a divine “intellect” unlike ours would share only a name with ours, as the Dog Star shares one with a dog." },
                { id: "hid-love-emptied", why: "The same argument about “love”, in Objection II." },
                { id: "coh-a-univocal", why: "Scotus's case, in Objection I, that analogy needs a shared core of meaning." },
                { id: "hid-logical-foul", why: "The answer to the unseen-reasons route, argued in Objection II." },
              ],
              sources: [
                { title: "An Examination of Sir William Hamilton's Philosophy", by: "John Stuart Mill", year: "1865", url: "https://archive.org/details/examinationofsir01mill", note: "Chapter 7 answers Mansel and contains the “to hell I will go” passage." },
                { title: "The Limits of Religious Thought", by: "Henry Longueville Mansel", year: "1858", url: "https://archive.org/details/limitsofreligiou00mans", note: "The Bampton Lectures Mill was answering." },
                { title: "Religious Language", by: "Stanford Encyclopedia of Philosophy (Michael Scott)", year: "2017, rev. 2022", url: "https://plato.stanford.edu/entries/religious-language/", note: "Section 3.1 covers analogy and metaphor in talk about God." },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── II. GUILT ───────────────────────── */
    {
      id: "mor-guilt",
      side: "skeptic",
      label: "The faith breeds guilt, and only the church holds the cure",
      gist: "People taught they are guilty from birth tend to live in fear and shame that only the church can relieve, so they keep coming back.",
      body: [
        "If a child is told she was born guilty, that she is watched and that judgment is coming, she will probably grow into an anxious adult, whatever the priests intended, and the church holds the only release. A fragment attributed to Critias, an Athenian politician of the 400s BCE, says the gods were invented so that wrongdoers would fear even their secret deeds, and the Greek historian Polybius admired Rome's religion because “the multitude must be held in by invisible terrors and suchlike pageantry” (*Histories* VI.56, tr. W. R. Paton). {{spinoza}} wrote that despots “mask the fear, which keeps them down, with the specious garb of religion” (*Theological-Political Treatise*, Preface).",
        "{{nietzsche}} described the [[ascetic-ideal|ascetic priest]], the preacher of self-denial, taking the sufferer's [[ressentiment|ressentiment]], resentment with no outlet, and turning it inward. {{freud}} made the sense of guilt civilization's central problem. Church history adds compulsory yearly confession from 1215, the [[indulgence|indulgence]] trade, scrupulosity (obsessive fear of sinning, a form of OCD), and abuse hidden by shame.",
      ],
      quote: {
        text: "“I suffer: it must be somebody's fault”—so thinks every sick sheep. But his herdsman, the ascetic priest, says to him, “Quite so, my sheep, it must be the fault of some one; but thou thyself art that some one, it is all the fault of thyself alone …”",
        who: "Friedrich Nietzsche",
        cite: "The Genealogy of Morals III §15 (1887; tr. H. B. Samuel, 1910)",
        url: "https://www.gutenberg.org/cache/epub/52319/pg52319-images.html#Page_165",
      },
      thinkers: ["nietzsche", "freud", "spinoza"],
      cedes:
        "Evidence that Christian communities are, on balance, less anxious and less ruled by shame than comparable secular ones would defeat this charge.",
      see: [
        { id: "hid-coercion-subtle", why: "Objection II argues that if God's judgment were plain to see, people would be good out of self-interest." },
      ],
      sources: [
        { title: "The Genealogy of Morals", by: "Friedrich Nietzsche (trans. Horace B. Samuel)", year: "1887", url: "https://www.gutenberg.org/ebooks/52319", note: "The third essay, sections 15–20, on the ascetic priest." },
        { title: "Histories, Book VI", by: "Polybius (trans. W. R. Paton)", year: "c. 150 BCE", url: "https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Polybius/6*.html", note: "Chapter 56 praises Roman religion for keeping the people in awe." },
        { title: "A Theologico-Political Treatise, Preface", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1670", url: "https://archive.org/details/chiefworksofbene01spin", note: "In Elwes's Chief Works, volume 1. Spinoza on how fear breeds superstition and how rulers use it." },
        { title: "Nietzsche's Moral and Political Philosophy", by: "Stanford Encyclopedia of Philosophy (Brian Leiter)", year: "2004, rev. 2024", url: "https://plato.stanford.edu/entries/nietzsche-moral-political/", note: "Leiter on Nietzsche's critique of morality and the psychology behind it." },
      ],
      children: [
        {
          id: "mor-gospel",
          side: "theist",
          label: "The gospel ends guilt and doesn't cause it",
          gist: "Christianity's message is that guilt is forgiven, “no condemnation”, and churches that used guilt as a weapon betrayed that message, as reformers inside the faith said at the time.",
          body: [
            "The turning point of {{paul|Paul}}'s letter to the Romans is “no condemnation”. {{luther}}'s breakthrough was relief from terror, the discovery that God's righteousness is a gift, and in 1517 he attacked the [[indulgence|indulgence]] trade from inside the church, denouncing preachers who said that “so soon as the penny jingles into the money-box, the soul flies out” (*Ninety-five Theses* 27). Confession ends in absolution, words spoken aloud so a person can stop carrying the thing. The faith's own standards condemn the abuses the Objector lists.",
            "The anxious self-examination that {{nietzsche}} and {{freud}} attacked may also be a late Western development. The Lutheran bishop and scholar {{stendahl|Krister Stendahl}} argued in 1963 that Paul's conscience was untroubled by guilt, and that anguished introspection came later, with {{augustine}} and medieval penance. In a large study of American nurses, women who attended services more than once a week had much lower suicide rates (*JAMA Psychiatry*, 2016).",
          ],
          quote: {
            text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
            who: "Paul",
            cite: "Romans 8:1 (KJV)",
            url: "https://en.wikisource.org/wiki/Bible_(King_James)/Romans#8:1",
          },
          thinkers: ["luther", "stendahl"],
          cedes: "Rising guilt and fear where the gospel is preached as forgiveness would sink this reply.",
          see: [
            { id: "evi-b-wright", why: "Stendahl's Paul, untroubled by guilt, appears again in Objection IV's resurrection case." },
          ],
          sources: [
            { title: "Disputation on the Power and Efficacy of Indulgences (the Ninety-five Theses)", by: "Martin Luther", year: "1517", url: "https://www.gutenberg.org/ebooks/274", note: "The theses against the indulgence trade." },
            { title: "The Apostle Paul and the Introspective Conscience of the West", by: "Krister Stendahl", year: "1963", note: "Harvard Theological Review 56. Stendahl's case that Paul's conscience was untroubled by guilt." },
            { title: "Association Between Religious Service Attendance and Lower Suicide Rates Among US Women", by: "Tyler J. VanderWeele, Shanshan Li, Alexander C. Tsai and Ichiro Kawachi", year: "2016", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7228478/", note: "JAMA Psychiatry 73. The Nurses' Health Study analysis behind the suicide figures." },
          ],
          children: [
            {
              id: "mor-debt",
              side: "skeptic",
              label: "The gospel forgives a guilt the church assigned first",
              gist: "Christianity offers release from a guilt it assigns to everyone at birth, which ties people to the church that announced it.",
              body: [
                "“No condemnation” is good news only if someone was condemned first. When {{augustine}} defeated Pelagius, a British monk who denied inherited guilt, the Council of Carthage (418) made every newborn share Adam's guilt. Unbaptized infants, Augustine concluded, receive “the mildest punishment of all”, but still punishment (*Enchiridion* 93). {{luther}} wrote that the “chief office” of God's law is to “reveal original sin with all its fruits”, so that a person “becomes terrified, is humbled, desponds, despairs” (*Smalcald Articles* III.2). {{nietzsche}} called the arrangement a “stroke of genius”. Like a protection racket, it offers relief from a danger it announced itself.",
                "The 2016 study of nurses measured how often people went to services, which may reflect community as much as doctrine. It was observational, so it can't rule out that healthier, better-connected people are likelier to go in the first place. On guilt itself, a 2014 study led by the psychologist Julie Exline links feeling punished or abandoned by God to depression and anxiety.",
              ],
              quote: {
                text: "… that stroke of genius called Christianity:—God personally immolating himself for the debt of man, God paying himself personally out of a pound of his own flesh, God as the one being who can deliver man from what man had become unable to deliver himself—the creditor playing scapegoat for his debtor, from love (can you believe it?), from love of his debtor!",
                who: "Friedrich Nietzsche",
                cite: "The Genealogy of Morals II §21 (1887; tr. H. B. Samuel, 1910)",
                url: "https://www.gutenberg.org/cache/epub/52319/pg52319-images.html#Page_111",
              },
              thinkers: ["augustine", "luther", "nietzsche"],
              cedes:
                "This charge loses its force if the doctrine of sin can be taught without telling anyone they are condemned before they have done anything.",
              sources: [
                { title: "Enchiridion", by: "Augustine (trans. J. F. Shaw)", year: "c. 421", url: "https://www.newadvent.org/fathers/1302.htm", note: "Section 93, on unbaptized infants." },
                { title: "Smalcald Articles, Part III", by: "Martin Luther", year: "1537", url: "https://bookofconcord.org/smalcald-articles/iii/", note: "Article 2, on the law's chief office." },
                { title: "The Religious and Spiritual Struggles Scale", by: "Julie J. Exline, Kenneth I. Pargament, Joshua B. Grubbs and Ann Marie Yali", year: "2014", note: "Psychology of Religion and Spirituality 6. The paper that introduced the scale, including struggles with God." },
                { title: "Sin in Christian Thought", by: "Stanford Encyclopedia of Philosophy (Kevin Timpe)", year: "2021, rev. 2025", url: "https://plato.stanford.edu/entries/sin-christian/", note: "Section 4 covers original sin and the debate over inherited guilt." },
              ],
              children: [
                {
                  id: "mor-condition",
                  side: "theist",
                  label: "The guilt the gospel lifts is real, and conscience confirms it",
                  gist: "[[original-sin|Original sin]] names a bent anyone can see, our drift toward selfishness and cruelty, so the condemnation the gospel lifts is one our own consciences already pronounce.",
                  body: [
                    "A protection racket needs the danger to be invented, and this danger is real. {{chesterton}} called [[original-sin|original sin]] the one Christian doctrine that can be proved, and the world wars and death camps of the next decades supplied evidence on a large scale. On this reading the doctrine describes a condition, in which people are turned in on themselves and cannot will their way out, as {{paul|Paul}} says: “For the good that I would I do not: but the evil which I would not, that I do” (Romans 7:19).",
                    "{{augustine}}'s verdict that unbaptized infants are punished is one Western reading. The Eastern churches generally reject inherited guilt and speak of “ancestral sin”, meaning inherited mortality and disordered desire, with no debt in a newborn's name. Without Augustine's reading, the doctrine describes something most people recognize in themselves, that they don't do the good they can see, and the gospel offers a way out.",
                  ],
                  quote: {
                    text: "Certain new theologians dispute original sin, which is the only part of Christian theology which can really be proved.",
                    who: "G. K. Chesterton",
                    cite: "Orthodoxy (1908), ch. 2",
                    url: "https://www.gutenberg.org/cache/epub/130/pg130-images.html#id00019",
                  },
                  thinkers: ["chesterton"],
                  cedes: "A moral disorder that turned out to be shallow, rare or easy to will away would undo this defense.",
                  sources: [
                    { title: "Orthodoxy", by: "G. K. Chesterton", year: "1908", url: "https://www.gutenberg.org/ebooks/130", note: "Chapter 2, “The Maniac”, where Chesterton calls original sin the one provable doctrine." },
                    { title: "Romans 7:14–25 (King James Version)", by: "King James Bible", year: "1611", url: "https://en.wikisource.org/wiki/Bible_(King_James)/Romans#7:14", note: "Romans, c. 57. Paul on doing the evil he does not want to do." },
                    { title: "The Ancestral Sin", by: "John S. Romanides", year: "1957", note: "A Greek Orthodox theologian's case against inherited guilt." },
                  ],
                  children: [
                    {
                      id: "mor-repent",
                      side: "spinoza",
                      label: "The flaw is natural, and remorse only doubles the harm",
                      gist: "{{spinoza}} treats the drift toward selfishness as part of nature, so it shows a flaw but not guilt before God, and remorse only adds a second harm.",
                      body: [
                        "{{chesterton}} says [[original-sin|original sin]] can be “proved”, but he runs two claims together, because selfishness can be observed every day and guilt before God from birth cannot be observed at all. {{spinoza}} accepts the first claim and rejects the second. “Nothing comes to pass in nature, which can be set down to a flaw therein”, he wrote (*Ethics* III Preface), so he studied human desires “as though I were concerned with lines, planes, and solids”. He does not deny the damage, and he titled Part IV “Of Human Bondage”. The Defender's own appeal to the Eastern churches' “ancestral sin” already gives up the idea of a debt.",
                        "Remorse, he argued, doubles the damage, because the one who repents is overcome first by a bad desire and then by pain (IV P54). For Spinoza the remedy is understanding, since a passion (an emotion that happens to us) “ceases to be a passion, as soon as we form a clear and distinct idea thereof” (V P3). He wanted people to act better, without adding pain about the past.",
                      ],
                      quote: {
                        text: "Repentance is not a virtue, or does not arise from reason; but he who repents of an action is doubly wretched or infirm.",
                        who: "Baruch Spinoza",
                        cite: "Ethics IV P54 (1677; tr. R. H. M. Elwes)",
                        url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap04:~:text=Repentance%20is%20not%20a%20virtue",
                      },
                      thinkers: ["spinoza", "chesterton"],
                      cedes:
                        "{{spinoza}} would be wrong here if remorse helps people repair harms better than a clear understanding of their causes does.",
                      see: [
                        { id: "coh-b-spinoza", why: "The determinism behind Spinoza's view of remorse." },
                        { id: "mor-holland-spinoza", why: "The same Ethics on answering hatred with love." },
                      ],
                      sources: [
                        { title: "Ethics, Parts III–V", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "The Preface to Part III, IV P54 and V P3." },
                        { title: "Spinoza's Psychological Theory", by: "Stanford Encyclopedia of Philosophy (Michael LeBuffe)", year: "2001, rev. 2024", url: "https://plato.stanford.edu/entries/spinoza-psychological/", note: "LeBuffe on Spinoza's account of the emotions, including where he parts with Christian views of humility and repentance." },
                        { title: "Think Least of Death: Spinoza on How to Live and How to Die", by: "Steven Nadler", year: "2020", note: "A readable guide to the ethics of Parts IV and V." },
                      ],
                      children: [
                        {
                          id: "mor-strawson",
                          side: "theist",
                          label: "The person you wronged is owed your sorrow",
                          gist: "{{spinoza}} offers courage and generosity in place of remorse, but the person you wronged is owed your sorrow as well as repairs, and Spinoza admits repentance helps most people.",
                          body: [
                            "{{spinoza}}'s own note on his claim that repentance is no virtue says it does most people more good than harm, because “the crowd plays the tyrant, when it is not in fear” (*Ethics* IV P54 Schol.). So on his view understanding is for the few and fear governs the rest, which is close to what the guilt charge accused the church of.",
                            "In place of remorse Spinoza offers courage and generosity (III P59 Schol.), love that answers hatred (IV P46), and the wish to repair. All of these look to the future, but the person you wronged is also owed sorrow for what you did. The philosopher Nick Smith argues in *I Was Wrong* (2008) that an apology without sorrow is defective. {{strawson}} argued in 1962 that guilt and resentment are [[reactive-attitudes|reactive attitudes]], the feelings by which we treat one another as responsible people, and {{williams-bernard}} found regret fitting even where there is no fault.",
                          ],
                          quote: {
                            text: "As men seldom live under the guidance of reason, these two emotions, namely, Humility and Repentance, as also Hope and Fear, bring more good than harm; hence, as we must sin, we had better sin in that direction.",
                            who: "Baruch Spinoza",
                            cite: "Ethics IV P54 Schol. (1677; tr. R. H. M. Elwes)",
                            url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap04:~:text=As%20men%20seldom%20live%20under%20the%20guidance",
                          },
                          thinkers: ["spinoza", "strawson", "williams-bernard"],
                          cedes:
                            "{{spinoza}}'s point stands if the people we wrong are as well served by our clear understanding as by our sorrow.",
                          see: [
                            { id: "mor-reparation", why: "Swinburne's account of what the wronged are owed, which is repentance, apology and reparation." },
                            { id: "coh-b-spinoza", why: "Strawson's essay also answers the determinism Spinoza argues for." },
                          ],
                          sources: [
                            { title: "Freedom and Resentment", by: "P. F. Strawson", year: "1962", note: "Proceedings of the British Academy 48. Guilt and resentment as the attitudes by which we hold one another responsible." },
                            { title: "I Was Wrong: The Meanings of Apologies", by: "Nick Smith", year: "2008", note: "What a full apology includes, sorrow among its parts." },
                            { title: "Moral Luck", by: "Bernard Williams", year: "1981", note: "The title essay describes “agent-regret”, regret for harm one caused without fault." },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "mor-kant",
              side: "skeptic",
              label: "Guilt can't be transferred, so Christ can't bear ours",
              gist: "{{kant}} argued that guilt is the most personal of debts, so punishing an innocent man in place of the guilty leaves the guilt untouched and adds a second injustice.",
              body: [
                "On one common reading, the gospel's “no condemnation” depends on a transfer, in which Christ bears the penalty and the guilty go free. {{kant}} objected in 1793 that anyone can pay a money debt, and the creditor doesn't care who settles it, but guilt for wrongdoing is different, because only the person who did wrong can bear it, however willing an innocent may be (*Religion within the Boundaries of Mere Reason*, 6:72). The prophet Ezekiel said much the same: “The son shall not bear the iniquity of the father” (Ezekiel 18:20). The Italian theologian {{socinus|Faustus Socinus}} had argued in 1594 that if a debt is forgiven, nothing is owed, and if it is paid, it was not forgiven. A judge who punishes an innocent volunteer and lets the guilty go has done two injustices, and defenders of [[penal-substitution|penal substitution]], the view that Christ took the punishment we deserved, call that love.",
              ],
              quote: {
                text: "… the obligation thence arising is not transferable like a money debt (where it is indifferent to the creditor whether his debtor or some one else discharge the bond) … but is, on the contrary, the most exclusively personal that can be conceived, viz. a debt of sins …",
                who: "Immanuel Kant",
                cite: "Religion within the Boundaries of Mere Reason, Book II (1793; Ak. 6:72), in J. W. Semple's 1838 translation, Religion within the Boundary of Pure Reason",
                url: "https://archive.org/details/religionwithin00kantuoft",
              },
              thinkers: ["kant"],
              cedes:
                "{{kant}}'s objection misses if [[atonement|atonement]] can be understood without any transfer of guilt or punishment from the guilty to the innocent.",
              see: [{ id: "mor-debt", why: "The other half of the guilt charge, that the debt is assigned before it is forgiven." }],
              sources: [
                { title: "Religion within the Boundary of Pure Reason", by: "Immanuel Kant (trans. J. W. Semple)", year: "1793", url: "https://archive.org/details/religionwithin00kantuoft", note: "Semple's 1838 translation. Book II has the passage on the debt of sin that no one else can pay." },
                { title: "Kant's Philosophy of Religion", by: "Stanford Encyclopedia of Philosophy (Lawrence Pasternack and Courtney Fugate)", year: "2004, rev. 2025", url: "https://plato.stanford.edu/entries/kant-religion/", note: "Section 3.7.3 covers the part of the Religion where Kant rejects vicarious atonement." },
                { title: "Atonement", by: "Stanford Encyclopedia of Philosophy (Joshua C. Thurow)", year: "2023", url: "https://plato.stanford.edu/entries/atonement/", note: "Section 4.4 sets out penal substitution and the objection that no innocent person may justly be punished for another, and section 2.8 traces that objection back to Socinus." },
              ],
              children: [
                {
                  id: "mor-reparation",
                  side: "theist",
                  label: "Christ supplies the offering we owe, with no transfer of guilt",
                  gist: "Punishing an innocent in our place is one [[atonement|theory of the cross]] among several, and the philosopher {{swinburne}} offers another in which no guilt is transferred.",
                  body: [
                    "{{kant}} and the theologian {{socinus|Socinus}} object to one theory of the cross, [[penal-substitution|penal substitution]]. No creed shared by all churches defines it, though the Calvinist Westminster Confession (1646, VIII.5) teaches it. In 1989 {{swinburne}} accepted that guilt cannot be transferred, and held that a wrongdoer owes repentance, apology, reparation and penance, and that Christ's life and death, which {{paul|Paul}} calls “an offering and a sacrifice to God” (Ephesians 5:2), are a perfect offering the guilty can present as their own. It is like a parent giving a child money for a neighbor's broken window, which the child must still carry next door. Bishop Gustaf Aulén's *Christus Victor* (1931) recovered the early church's picture of the cross as victory over sin and death. {{stump}}'s *Atonement* (2018) reads it as God's way to union with people alienated from themselves. None of these views has God punishing someone before he can forgive.",
                  ],
                  quote: {
                    text: "He properly atones for an offense who offers something which the offended one loves equally, or even more than he detested the offense. But by suffering out of love and obedience, Christ gave more to God than was required to compensate for the offense of the whole human race.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae III q.48 a.2 (tr. Fathers of the English Dominican Province)",
                    url: "https://www.newadvent.org/summa/4048.htm#article2",
                  },
                  thinkers: ["swinburne", "stump", "aquinas"],
                  cedes: "If every serious account of the [[atonement|atonement]] turned out to need a transfer of guilt after all, {{kant}}'s objection would stand.",
                  sources: [
                    { title: "Responsibility and Atonement", by: "Richard Swinburne", year: "1989", note: "Swinburne's account of atonement as an offering the guilty can make their own." },
                    { title: "Heidelberg Catechism", by: "Zacharias Ursinus and others", year: "1563", url: "https://www.ccel.org/creeds/heidelberg-cat.html", note: "Questions 12–18 and 40 teach penal substitution." },
                    { title: "Christus Victor", by: "Gustaf Aulén", year: "1931", note: "Aulén's history of the “classic” view of the cross as victory over sin and death." },
                    { title: "Atonement", by: "Eleonore Stump", year: "2018", note: "Stump reads the atonement as God's way to union with people divided within themselves." },
                  ],
                  children: [
                    {
                      id: "mor-forgive-freely",
                      side: "skeptic",
                      label: "A God who commands free forgiveness needs no offering",
                      gist: "If what we owe is repentance, a God who receives it has all a forgiver can ask, so why require an offering when Jesus tells us to forgive freely?",
                      body: [
                        "If a wrongdoer owes repentance, as {{swinburne}} says, a God who receives it has everything a forgiver can ask. Why must he also require an offering, and one only his own Son can make, before he forgives? As the Italian theologian {{socinus|Faustus Socinus}} argued in 1594, whatever is paid was not freely forgiven. Jesus tells Peter to forgive without limit (Matthew 18:22), and the father in the parable runs to the prodigal and “fell on his neck, and kissed him” before the son has said a word (Luke 15:20). Philip Quinn, a philosopher, argued this in 1994 in a volume honoring Swinburne. A victim who would forgive only after a third party handed over a perfect gift would seem less gracious. And a God who demands the offering and supplies it is still a creditor who must be paid, only paid by himself, which is {{nietzsche}}'s “stroke of genius” again.",
                      ],
                      quote: {
                        text: "I say not unto thee, Until seven times: but, Until seventy times seven.",
                        who: "Jesus",
                        cite: "Matthew 18:22 (KJV)",
                        url: "https://en.wikisource.org/wiki/Bible_(King_James)/Matthew#18:22",
                      },
                      thinkers: ["nietzsche"],
                      cedes:
                        "If a forgiver who first required a perfect offering could be shown to love more than one who forgave on repentance alone, I'd withdraw this.",
                      see: [
                        { id: "mor-debt", why: "Nietzsche's creditor who pays himself, earlier in this part." },
                      ],
                      sources: [
                        { title: "Swinburne on Guilt, Atonement, and Christian Redemption", by: "Philip L. Quinn", year: "1994", note: "In Alan G. Padgett, ed., Reason and the Christian Religion." },
                        { title: "Luke 15:11–32 (King James Version)", by: "King James Bible", year: "1611", url: "https://en.wikisource.org/wiki/Bible_(King_James)/Luke#15:11", note: "Luke, c. 80–90. The parable of the prodigal son." },
                        { title: "Forgiveness", by: "Stanford Encyclopedia of Philosophy (Luke Russell and Brandon Warmke)", year: "2010, rev. 2026", url: "https://plato.stanford.edu/entries/forgiveness/", note: "Section 5.2 is on divine forgiveness." },
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

    /* ───────────────────────── III. LIFE ───────────────────────── */
    {
      id: "mor-life",
      side: "skeptic",
      label: "Christianity says No to life, and that counts against it",
      gist: "{{nietzsche}} charged that Christianity moves value to another world, calls pride, sex and strength sins, and so makes God the enemy of the life he supposedly made.",
      body: [
        "In *Twilight of the Idols* (1889) {{nietzsche}} says the church fights the passions by cutting them out and never asks “how can a desire be spiritualised, beautified, deified?” In his words, “to attack the passions at their roots, means attacking life itself at its source: the method of the Church is hostile to life”. Its [[ascetic-ideal|ascetic ideal]], holiness through self-denial, is in his view a will to nothingness. His own test is [[amor-fati|amor fati]], Latin for “love of fate”, which means wishing “nothing to be different, either in front of him or behind him, or for all eternity” (*Ecce Homo*, “Why I Am So Clever” §10). {{hume}} had already moved celibacy, fasting, penance and “the whole train of monkish virtues” into “the catalogue of vices” in *An Enquiry Concerning the Principles of Morals* (1751). The Catholic [[council-of-trent|Council of Trent]] in 1563 ranked virginity above marriage. And in the *Summa*'s Supplement, compiled from {{aquinas}}'s early writings after his death, the blessed see the sufferings of the damned “in order that the happiness of the saints may be more delightful to them” (Suppl. q.94 a.1), a passage Nietzsche quoted against the church (*Genealogy* I §15).",
      ],
      quote: {
        text: "God degenerated into the contradiction of life, instead of being its transfiguration and eternal Yea! With God war is declared on life, nature, and the will to life!",
        who: "Friedrich Nietzsche",
        cite: "The Antichrist §18 (1888; tr. A. M. Ludovici, 1911)",
        url: "https://www.gutenberg.org/cache/epub/52263/pg52263-images.html#Page_146",
      },
      thinkers: ["nietzsche", "hume", "aquinas"],
      cedes:
        "{{nietzsche|Nietzsche}}'s charge fails if the saints, and the church at its best, turn out to love this world more than its critics do.",
      see: [{ id: "mor-chosen-hell", why: "Aquinas's defense of hell's justice, from the same tradition as the heaven Nietzsche quoted." }],
      sources: [
        { title: "The Twilight of the Idols and The Antichrist", by: "Friedrich Nietzsche (trans. Anthony M. Ludovici)", year: "1888", url: "https://www.gutenberg.org/ebooks/52263", note: "Ludovici's translation of both books. The chapter “Morality as the Enemy of Nature” is in Twilight." },
        { title: "An Enquiry Concerning the Principles of Morals", by: "David Hume", year: "1751", url: "https://www.gutenberg.org/ebooks/4320", note: "Section 9, part 1, where the “monkish virtues” become vices." },
        { title: "Summa Theologiae, Supplement q.94 (On the Relations of the Saints to the Damned)", by: "Thomas Aquinas (compiled after his death)", url: "https://www.newadvent.org/summa/5094.htm#article1", note: "Article 1, on whether the blessed see the sufferings of the damned." },
        { title: "Friedrich Nietzsche", by: "Stanford Encyclopedia of Philosophy (R. Lanier Anderson)", year: "2017, rev. 2026", url: "https://plato.stanford.edu/entries/nietzsche/", note: "An overview of his critique of Christian morality and his ideal of amor fati." },
      ],
      children: [
        {
          id: "mor-body",
          side: "theist",
          label: "A God who became flesh and rose bodily says Yes to the body",
          gist: "Christianity teaches that God called matter “very good”, became flesh and rose in a body, which is a Yes to this world.",
          body: [
            "{{nietzsche}}'s charge fits the Gnostics, who despised matter, better than the church that fought them. God calls what he made “very good” (Genesis 1:31), and “the Word was made flesh” (John 1:14). {{paul|Paul}} insists on a *bodily* resurrection, and {{irenaeus}}, a second-century bishop, called a living human being the glory of God. The hope is this world healed, as {{wright-nt}} argues, and the central act of worship is a meal.",
            "{{taylor-charles}} traces the modern sense that marriage and work are where a good life is lived to the Protestant Reformers' rejection of celibacy as the higher calling. The [[council-of-trent|Council of Trent]] reaffirmed marriage as a sacrament, and Rome canonized Isidore the Farmer in 1622 and the married Louis and Zélie Martin in 2015. [[amor-fati|Amor fati]] means wishing nothing different, atrocities included, which is hard to tell from resignation. {{chesterton}} loved the world the way Rome's first citizens loved Rome: “Men did not love Rome because she was great. She was great because they had loved her.”",
          ],
          quote: {
            text: "For the glory of God is a living man; and the life of man consists in beholding God.",
            who: "Irenaeus",
            cite: "Against Heresies IV.20.7 (c. 180; Ante-Nicene Fathers tr.)",
            url: "https://www.newadvent.org/fathers/0103420.htm",
          },
          thinkers: ["irenaeus", "wright-nt", "taylor-charles", "chesterton"],
          cedes:
            "A tradition whose saints and teachers, read as a whole, treated the body as a prison would refute this.",
          see: [
            { id: "evi-b-body", why: "In Objection IV, the first witnesses insisted on a body and an empty tomb." },
            { id: "mor-holland", why: "The same pattern, in which a value the critic holds turns out to have Christian roots." },
          ],
          sources: [
            { title: "Sources of the Self: The Making of the Modern Identity", by: "Charles Taylor", year: "1989", url: "https://www.hup.harvard.edu/books/9780674824263", note: "Part III, “The Affirmation of Ordinary Life”." },
            { title: "Surprised by Hope", by: "N. T. Wright", year: "2008", note: "Wright's case that Christian hope is for a renewed creation, bodies included." },
            { title: "Against Heresies, Book IV", by: "Irenaeus", year: "c. 180", url: "https://www.newadvent.org/fathers/0103420.htm", note: "Chapter 20, where Irenaeus writes that “the glory of God is a living man”." },
            { title: "Orthodoxy", by: "G. K. Chesterton", year: "1908", url: "https://www.gutenberg.org/ebooks/130", note: "Chapter 5, “The Flag of the World”, on loving the world the way early Romans loved Rome." },
          ],
          children: [
            {
              id: "mor-beyond",
              side: "skeptic",
              label: "A risen body still moves life's center to the beyond",
              gist: "Resurrection honors the body only in the next world, so the faith still places life's meaning in a beyond, and Christian praise of ordinary life came some fifteen centuries late.",
              body: [
                "{{nietzsche}} had the resurrection in view and called it the problem. {{paul|Paul}}, he wrote, “transferred the centre of gravity of the whole of that great life, to a place *behind* this life” (*The Antichrist* §42). Paul himself says, “If in this life only we have hope in Christ, we are of all men most miserable” (1 Corinthians 15:19). The risen body is also unlike the one we have. Jesus says that in the resurrection “they neither marry, nor are given in marriage” (Mark 12:25), and Paul wished everyone were unmarried like him (1 Corinthians 7:7–8). The Catholic [[council-of-trent|Council of Trent]] declared it “better and more blessed to remain in virginity, or in celibacy, than to be united in matrimony” (Session 24, canon 10, 1563). The “affirmation of ordinary life” that {{taylor-charles}} credits to the Protestant Reformers came some 1,500 years in, against a tradition that had ranked virginity higher all along.",
              ],
              quote: {
                text: "When the centre of gravity of life is laid, not in life, but in a beyond—in nonentity,—life is utterly robbed of its balance.",
                who: "Friedrich Nietzsche",
                cite: "The Antichrist §43 (1888; tr. A. M. Ludovici, 1911)",
                url: "https://www.gutenberg.org/cache/epub/52263/pg52263-images.html#Page_185",
              },
              thinkers: ["nietzsche", "paul", "taylor-charles"],
              cedes:
                "This would fail if the hope for a risen body made this life, with its marriages, work and pleasures, matter more.",
              see: [
                { id: "evi-b-flesh", why: "In Objection IV, Paul's risen body is heavenly, which is different from this flesh revived." },
              ],
              sources: [
                { title: "The Antichrist", by: "Friedrich Nietzsche (trans. Anthony M. Ludovici)", year: "1888", url: "https://www.gutenberg.org/ebooks/52263", note: "Sections 42–43, on Paul moving life's center of gravity to the beyond." },
                { title: "Council of Trent, Session 24", by: "Council of Trent (trans. J. Waterworth)", year: "1563", url: "https://history.hanover.edu/texts/trent/ct24.html", note: "Canon 10 puts virginity and celibacy above marriage." },
                { title: "1 Corinthians 7 (King James Version)", by: "King James Bible", year: "1611", url: "https://en.wikisource.org/wiki/Bible_(King_James)/1_Corinthians#7:7", note: "1 Corinthians, c. 54. Paul's wish that the unmarried stay as he is." },
              ],
            },
          ],
        },
        {
          id: "mor-holland",
          side: "theist",
          label: "Care for the weak is Christian, and Nietzsche's charge scorns it",
          gist: "The historian {{holland}} argues that the belief that the weak matter most came from Christianity, which {{nietzsche}}'s charge scorns, so an objector who keeps that care can't borrow the charge.",
          body: [
            "The historian {{holland}}'s *Dominion* (2019) argues that the West's deepest instincts, that the weak have claims on the strong and every person has equal dignity, are Christian in origin, and now pass for common sense. {{celsus}}, a second-century pagan critic, saw the novelty at once.",
            "{{nietzsche}} wrote that pity “preserves that which is ripe for death” (*The Antichrist* §7), and called raising up the lowly “the revolt of the slaves” in morals (*Genealogy* I §7). He also warned: “When we renounce the Christian faith, we abandon all right to Christian morality” (*Twilight of the Idols*, “Skirmishes” §5).",
            "The philosopher Nicholas Wolterstorff argues that *equal* worth, for the infant and the severely impaired as for the genius, needs something like being loved by God. The legal philosopher Jeremy Waldron doubts that basic equality can be defended “apart from some religious foundation” (2002). An objector who keeps the care for the weak cannot also use Nietzsche's charge, which comes with contempt for them.",
          ],
          quote: {
            text: "Every one, they say, who is a sinner, who is devoid of understanding, who is a child, and, to speak generally, whoever is unfortunate, him will the kingdom of God receive.",
            who: "Celsus, quoted by Origen",
            cite: "Contra Celsum III.59 (c. 248; Ante-Nicene Fathers tr.)",
            url: "https://www.newadvent.org/fathers/04163.htm",
          },
          thinkers: ["holland", "celsus", "nietzsche"],
          cedes:
            "This argument is wrong if {{nietzsche|Nietzsche}}'s charge can be kept whole without his contempt for the weak, or if equal regard for the weak arose as fully in a culture Christianity never touched.",
          see: [
            { id: "mor-hell", why: "If the Objector's conscience is Christian, the standard used to judge hell came from the faith being judged." },
            { id: "mor-guilt", why: "The same point applies to judging guilt as a means of control." },
            { id: "mor-mansel", why: "Mill's “what I mean when I apply that epithet” is the inheritance in question." },
          ],
          sources: [
            { title: "Dominion: How the Christian Revolution Remade the World", by: "Tom Holland", year: "2019", note: "Holland's history of how Christian ideas about the weak became the West's common sense." },
            { title: "Justice: Rights and Wrongs", by: "Nicholas Wolterstorff", year: "2008", note: "Wolterstorff argues that equal human worth needs grounding in God's love." },
            { title: "God, Locke, and Equality", by: "Jeremy Waldron", year: "2002", note: "Waldron on the Christian foundations of Locke's case for basic equality." },
            { title: "Dignity", by: "Stanford Encyclopedia of Philosophy (Remy Debes)", year: "2023", url: "https://plato.stanford.edu/entries/dignity/", note: "Section 1.2 compares four stories of where human dignity came from, the biblical image of God among them." },
          ],
          children: [
            {
              id: "mor-convicts",
              side: "skeptic",
              label: "By its own moral standard, Christianity fails",
              gist: "If the Objector's care for the weak is Christian, the objection becomes criticism from inside, and secular countries that kept the care suggest it can outlive the faith.",
              body: [
                "Granting {{holland}} that care for the weak is Christian makes the objection stronger, since if care for the victim is the faith's deepest value, hell for honest doubters and guilt used as control fail its own test. {{nietzsche}}'s charge can also be kept without his contempt, as ((mor-holland-spinoza|Spinoza)) shows by keeping kindness without self-denial or a deferred heaven.",
                "Equal worth may not need God either. {{rawls}} grounds it in a “range property”, a capacity everyone above a threshold has equally (1971), and for the severely disabled, below it, the philosopher Eva Kittay finds dignity in relations of care. {{wielenberg}} holds that [[robust-realism|basic moral facts need no foundation]], and judging a value by where it came from is the [[genetic-fallacy|genetic fallacy]].",
                "Secular Denmark and Sweden have widened their care for the weak. Calling that secularized Lutheranism, as the economist Robert Nelson does, makes Holland's claim impossible to test.",
              ],
              quote: {
                text: "… in thus wise did Christianity go to ruin as a dogma, through its own morality; in thus wise must Christianity go again to ruin to-day as a morality—we are standing on the threshold of this event.",
                who: "Friedrich Nietzsche",
                cite: "The Genealogy of Morals III §27 (1887; tr. H. B. Samuel, 1910)",
                url: "https://www.gutenberg.org/cache/epub/52319/pg52319-images.html#Page_209",
              },
              thinkers: ["nietzsche", "rawls", "wielenberg"],
              cedes: "If secular societies' care for the weak decayed as their Christian memory faded, I'd concede the point.",
              see: [
                { id: "mor-development", why: "The Defender's own version of correcting the faith from its core." },
                { id: "coh-c-brute", why: "Wielenberg's case, in Objection I, that moral facts need no foundation." },
              ],
              sources: [
                { title: "A Theory of Justice", by: "John Rawls", year: "1971", note: "Section 77, on the basis of equality." },
                { title: "Society without God", by: "Phil Zuckerman", year: "2008", note: "A sociologist's study of largely secular Denmark and Sweden." },
                { title: "Love's Labor: Essays on Women, Equality, and Dependency", by: "Eva Feder Kittay", year: "1999", note: "Kittay grounds the dignity of severely disabled people in relations of care." },
                { title: "Lutheranism and the Nordic Spirit of Social Democracy", by: "Robert H. Nelson", year: "2017", note: "The view this move answers, that Nordic welfare is secularized Lutheranism." },
              ],
            },
            {
              id: "mor-holland-spinoza",
              side: "spinoza",
              label: "Reason alone grounds care for the weak, with no cross needed",
              gist: "{{spinoza}} argued from reason alone, without a personal God or a cross, that we should repay hatred with love and help the suffering.",
              body: [
                "The historian {{holland}} assumes the ethic of caring for the weak needs Christianity, but {{spinoza}} reached it by reason alone. Whoever lives by reason, he wrote, “endeavours, as far as possible, to render back love, or kindness, for other men's hatred” (*Ethics* IV P46), because hatred “is increased by being reciprocated, and can on the other hand be destroyed by love” (III P43). The good a virtuous person wants for himself he wants for others, “and so much the more, in proportion as he has a greater knowledge of God” (IV P37). Spinoza had no use for pity, which he counted a painful emotion that weakens us, but he held that reason itself tells us to free others from misery, and that whoever is moved to help others “neither by reason nor by compassion, is rightly styled inhuman” (IV P50 Schol.).",
              ],
              quote: {
                text: "He who chooses to avenge wrongs with hatred is assuredly wretched. But he, who strives to conquer hatred with love, fights his battle in joy and confidence.",
                who: "Baruch Spinoza",
                cite: "Ethics IV P46 Schol. (1677; tr. R. H. M. Elwes)",
                url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap04:~:text=He%20who%20chooses%20to%20avenge%20wrongs",
              },
              thinkers: ["spinoza"],
              cedes:
                "If the arguments of {{spinoza}}'s *Ethics* needed a premise about the worth of the weak that reason alone cannot supply, his ethic would not stand on its own.",
              see: [{ id: "mor-repent", why: "The same Spinoza, on remorse." }],
              sources: [
                { title: "Ethics, Part IV", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "Propositions 37, 46 and 50, on wanting good for others and answering hatred with love." },
                { title: "Think Least of Death: Spinoza on How to Live and How to Die", by: "Steven Nadler", year: "2020", note: "Nadler on the free person of Ethics IV, who lives by reason and repays hatred with love." },
              ],
              children: [
                {
                  id: "mor-pity",
                  side: "theist",
                  label: "Spinoza's ethic gives the helpless no clear claim of their own",
                  gist: "{{spinoza}} bases help on usefulness and happiness on ability, which leaves infants and the impaired with no clear claim of their own, while Christianity grounds their claim in God's love.",
                  body: [
                    "{{spinoza}} grounds help in shared usefulness, since “to man there is nothing more useful than man” (*Ethics* IV P18 Schol.), and good is “that which we certainly know to be useful to us” (IV Def. 1). A claim grounded that way depends on what the person reasoning finds useful. Beasts, “whose nature is different from our own”, fall outside it (IV P37 Schol. 1). {{augustine}} and {{aquinas}} said much the same about animals.",
                    "He ties blessedness, his word for the happiness of the wise, to ability as well. It grows with a body “capable of the greatest number of activities” (V P39), while an infant's mind is “scarcely conscious of itself, or of God”, and the man who cannot govern his desires “necessarily perishes” (Letter 78). The Christian claim is that the helpless matter because God loves them, and Jesus tells his host to invite “the poor, the maimed, the lame, the blind”, because “they cannot recompense thee” (Luke 14:13–14).",
                  ],
                  quote: {
                    text: "Pity, in a man who lives under the guidance of reason, is in itself bad and useless.",
                    who: "Baruch Spinoza",
                    cite: "Ethics IV P50 (1677; tr. R. H. M. Elwes)",
                    url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap04:~:text=Pity%2C%20in%20a%20man%20who%20lives",
                  },
                  thinkers: ["spinoza"],
                  cedes:
                    "{{spinoza}} would answer this if his reason gave the helpless, who take no part in anyone's reasoning, the same claim on us as the wise.",
                  see: [
                    { id: "hid-spinoza-my-god", why: "Objection II meets the same God, who strictly speaking loves no one." },
                    { id: "coh-c-person", why: "Objection I's general case that obligation needs someone who makes the claim." },
                  ],
                  sources: [
                    { title: "Ethics, Part IV", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "The scholia to propositions 18 and 37 ground ethics in what is useful." },
                    { title: "Luke 14:12–14 (King James Version)", by: "King James Bible", year: "1611", url: "https://en.wikisource.org/wiki/Bible_(King_James)/Luke#14:12", note: "Luke, c. 80–90. Jesus tells his host to invite those who cannot repay him." },
                    { title: "Spinoza's Psychological Theory", by: "Stanford Encyclopedia of Philosophy (Michael LeBuffe)", year: "2001, rev. 2024", url: "https://plato.stanford.edu/entries/spinoza-psychological/", note: "Explains why Spinoza counts pity a kind of sadness that weakens us." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-value",
          side: "theist",
          label: "A charge about value can't show the faith is false",
          gist: "The life-denial charge asks whether Christianity is good for us, and {{nietzsche}} says it would stand even if God were proved, so it says nothing about whether God exists.",
          body: [
            "{{nietzsche}} himself treats this charge as one about value. He judged the Christian God “not as an error, but as a *crime against life*” (*The Antichrist* §47), and by his own account a proof of God would not change that verdict. A charge built to survive a proof of God cannot count as evidence against God. Skeptics themselves dismiss “Christians are hypocrites, so Christianity is false”, because how believers behave is one question and whether their beliefs are true is another. “Atheist regimes were cruel, so atheism is false” fails for the same reason. By that test, “Christianity is bad for life” says nothing about whether Jesus rose, though it might be a reason to wish the faith were false.",
          ],
          quote: {
            text: "If the existence of this Christian God were proved to us, we should feel even less able to believe in him.",
            who: "Friedrich Nietzsche",
            cite: "The Antichrist §47 (1888; tr. A. M. Ludovici, 1911)",
            url: "https://www.gutenberg.org/cache/epub/52263/pg52263-images.html#Page_196",
          },
          thinkers: ["nietzsche"],
          cedes:
            "Evidence that a faith's harm shows its claims about history and God to be false would defeat this reply.",
          sources: [
            { title: "The Antichrist", by: "Friedrich Nietzsche (trans. Anthony M. Ludovici)", year: "1888", url: "https://www.gutenberg.org/ebooks/52263", note: "Section 47, where Nietzsche calls the Christian God a crime against life." },
            { title: "Nietzsche's Moral and Political Philosophy", by: "Stanford Encyclopedia of Philosophy (Brian Leiter)", year: "2004, rev. 2024", url: "https://plato.stanford.edu/entries/nietzsche-moral-political/", note: "Leiter reads Nietzsche's attack as a judgment about what morality does to the flourishing of the best people." },
          ],
          children: [
            {
              id: "mor-daybreak",
              side: "skeptic",
              label: "Explaining how a belief arose can make refuting it unnecessary",
              gist: "{{nietzsche}} explained belief in God by fear and resentment, which would strip it of evidence, and a faith that promises abundant life can be judged by its fruits.",
              body: [
                "In *Daybreak* §95 (1881) {{nietzsche}} calls the historical refutation “the decisive one”. If a belief is fully explained by causes that have nothing to do with its truth, such as fear of death, the resentment of the weak, or a priestly class's will to power, it has lost its evidence. Philosophers call this a [[debunking-argument|debunking argument]], and unlike the hypocrisy charge it bears on whether anyone should hold the belief. Christianity also invites the test, since it claims to be good news, “I am come that they might have life, and that they might have it more abundantly” (John 10:10), and Jesus says “Ye shall know them by their fruits” (Matthew 7:16). A mathematical theorem's truth has nothing to do with whether it does anyone good. The gospel claims to heal, so whether it heals bears on whether it is true.",
              ],
              quote: {
                text: "Formerly it was sought to prove that there was no God—now it is shown how the belief that a God existed could have originated, and by what means this belief gained authority and importance: in this way the counterproof that there is no God becomes unnecessary and superfluous.",
                who: "Friedrich Nietzsche",
                cite: "The Dawn of Day (Daybreak) §95 (1881; tr. J. M. Kennedy, 1911)",
                url: "https://www.gutenberg.org/cache/epub/39955/pg39955-images.html#Pg093",
              },
              thinkers: ["nietzsche"],
              cedes:
                "The argument fails if belief in God comes from a process that tracks truth, and fear and resentment are not the whole story.",
              see: [
                { id: "mor-convicts", why: "The same question about origins, asked in reverse, about a value's Christian roots." },
                { id: "hid-designed-faculty", why: "Objection II argues that a faculty can be natural, God-given and still misfire." },
              ],
              sources: [
                { title: "The Dawn of Day (Daybreak)", by: "Friedrich Nietzsche (trans. J. M. Kennedy)", year: "1881", url: "https://www.gutenberg.org/ebooks/39955", note: "Kennedy's translation. Section 95 is titled “The historical refutation as the decisive one”." },
                { title: "Morality and Evolutionary Biology", by: "Stanford Encyclopedia of Philosophy (William FitzPatrick)", year: "2008, rev. 2025", url: "https://plato.stanford.edu/entries/morality-biology/", note: "Section 4 explains debunking arguments, which explain a belief by causes unconnected to its truth." },
              ],
              children: [
                {
                  id: "mor-debunk-limits",
                  side: "theist",
                  label: "An origin story can't debunk a belief that has other evidence",
                  gist: "Explaining how a belief arose defeats it only if nothing else supports it, and Christianity claims historical evidence, while {{nietzsche}}'s story fits early church history badly.",
                  body: [
                    "An origin story defeats a belief only when nothing but an unreliable process supports it, as the philosopher Guy Kahane argues. Christian belief claims independent support in the resurrection case of ((evi-b-minimal|Objection IV)), so the debunker must win that argument first. {{nietzsche}}'s story also fits the history badly, since the New Testament scholar Wayne Meeks and the sociologist Rodney Stark find the early churches drew a cross-section of city life, and Pliny, a Roman governor, reported around 112 that they came from “all ranks and ages”.",
                    "The method also backfires, because if fear debunks faith, blind natural selection would debunk every belief of someone who thinks nature is all there is, that one included, as ((nat-b-minds|Objection III)) argues. As for fruits, a 2018 Harvard study by Ying Chen and Tyler VanderWeele links a religious upbringing to better mental health in young adults, and the Global Flourishing Study (2025) links attending services to well-being in twenty-two countries.",
                  ],
                  quote: {
                    text: "… great numbers must be involved in the danger of these prosecutions, which have already extended, and are still likely to extend, to persons of all ranks and ages, and even of both sexes.",
                    who: "Pliny the Younger, governor of Bithynia, to the emperor Trajan",
                    cite: "Letters X.96 (c. 112; tr. William Melmoth, rev. F. C. T. Bosanquet)",
                    url: "https://www.gutenberg.org/cache/epub/2811/pg2811-images.html#link2H_4_0209",
                  },
                  thinkers: [],
                  cedes:
                    "The [[debunking-argument|debunking]] would succeed if the historical case for the resurrection collapsed, leaving fear and resentment as the faith's only support.",
                  see: [
                    { id: "nat-b-minds", why: "Plantinga's argument that explaining our minds by evolution alone undercuts naturalism, the view that nature is all there is." },
                    { id: "mor-convicts", why: "Where the Objector calls an argument from origins the genetic fallacy." },
                    { id: "mor-debt", why: "The Objector's caution, in the part on guilt, about observational studies like these." },
                  ],
                  sources: [
                    { title: "Evolutionary Debunking Arguments", by: "Guy Kahane", year: "2011", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3175808/", note: "Noûs 45. When explaining the causes of a belief undermines it, and when it does not." },
                    { title: "The First Urban Christians", by: "Wayne A. Meeks", year: "1983", note: "A social history of the churches Paul founded." },
                    { title: "The Rise of Christianity", by: "Rodney Stark", year: "1996", note: "A sociologist's account of how the early church grew." },
                    { title: "Associations of Religious Upbringing With Subsequent Health and Well-Being From Adolescence to Young Adulthood", by: "Ying Chen and Tyler J. VanderWeele", year: "2018", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6211237/", note: "American Journal of Epidemiology." },
                    { title: "The Global Flourishing Study: Study Profile and Initial Results on Flourishing", by: "Tyler J. VanderWeele, Byron R. Johnson and colleagues", year: "2025", url: "https://www.nature.com/articles/s44220-025-00423-5", note: "Nature Mental Health. Twenty-two countries, with flourishing higher among those who attend services." },
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
    title: "Spinoza's God judges no one",
    body: [
      "{{spinoza}}'s God is no judge, because, as he puts it, “Strictly speaking, God does not love or hate anyone” (*Ethics* V P17 Cor.), and so there is no anger to appease. For Spinoza, reward and punishment happen inside a person. He wrote that “the highest reward of the Divine law is the law itself, namely, to know God and to love Him”, and that its penalty is “the absence of these things, and being in bondage to the flesh” (*Theological-Political Treatise* ch. 4). So for him heaven means understanding God and hell means being ruled by one's passions, both in this life. ((mor-chosen-hell|Aquinas's hell)) is similar in one respect, since in both the penalty follows from a disorder in the soul and lasts as long as the disorder does. Spinoza, unlike Aquinas, has no place for a free refusal or for endless pain.",
      "He even grants religious fear a use. Repentance is no virtue (IV P54), but few people live by reason, so humility, repentance, hope and fear do more good than harm, and it is no wonder that the prophets, “who consulted the good, not of a few, but of all”, commended them (IV P54 Schol.). He still held that fear is never good in itself (“Emotions of hope and fear cannot be in themselves good”, IV P47).",
      "{{nietzsche}} hailed Spinoza as a forerunner in 1881, but the two part ways over love. God has no feelings of love or hate, yet Spinoza still writes that “God, in so far as he loves himself, loves man” (V P36 Cor.). He means the [[amor-dei-intellectualis|intellectual love]] that comes from understanding God, in which our love of God and God's love of us are one. Spinoza's complaint against Christianity is that it teaches people to love God out of fear, when they should love him because they understand him.",
      "The Defender answers that few people ever reach that understanding, and the weakest can't wait until they do. Spinoza could reply that the majority Christian picture is harder on the weak, with a narrow gate that “few there be that find” (Matthew 7:14), {{augustine}}'s *massa damnata* (the “condemned mass” of humanity), and unbaptized infants punished, however mildly (*Enchiridion* 93). The “perishing” Spinoza grants to people who can't govern their desires (Letter 78) is no torment, and his commonwealth exists “to free every man from fear” (*Theological-Political Treatise* ch. 20).",
    ],
    quote: {
      text: "Blessedness is not the reward of virtue, but virtue itself; neither do we rejoice therein, because we control our lusts, but, contrariwise, because we rejoice therein, we are able to control our lusts.",
      who: "Baruch Spinoza",
      cite: "Ethics V P42 (1677; tr. R. H. M. Elwes)",
      url: "https://www.gutenberg.org/cache/epub/3800/pg3800-images.html#chap05:~:text=Blessedness%20is%20not%20the%20reward%20of%20virtue",
    },
  },

  lineage: [
    "m-mor-lucretius",
    "m-mor-celsus",
    "m-mor-origen",
    "m-mor-augustine",
    "m-mor-aquinas",
    "m-mor-luther",
    "m-mor-ttp",
    "m-mor-ethics",
    "m-mor-edwards",
    "m-mor-hume",
    "m-mor-mill",
    "m-mor-overbeck",
    "m-mor-genealogy",
    "m-mor-lumen",
    "m-mor-hart",
    "m-mor-holland",
  ],

  reading: [
    { title: "The Genealogy of Morals", by: "Friedrich Nietzsche (trans. Horace B. Samuel)", year: "1887", url: "https://www.gutenberg.org/ebooks/52319", note: "Nietzsche on guilt as debt, the ascetic priest and resentment. The guilt and life-denial charges both draw on it." },
    { title: "The Antichrist", by: "Friedrich Nietzsche", year: "1888", url: "https://www.gutenberg.org/ebooks/52263", note: "Nietzsche's late attack on Christianity as hostile to life. Ludovici's translation is bound with Twilight of the Idols." },
    { title: "Why I Am Not a Christian", by: "Bertrand Russell", year: "1927", url: "https://users.drew.edu/~jlenz/whynot.html", note: "Russell's lecture, including his complaint that Christ believed in hell." },
    { title: "An Examination of Sir William Hamilton's Philosophy, chapter 7", by: "John Stuart Mill", year: "1865", url: "https://archive.org/details/examinationofsir01mill", note: "Mill's reply to Mansel, including the “to hell I will go” passage." },
    { title: "Heaven and Hell: A History of the Afterlife", by: "Bart D. Ehrman", year: "2020", note: "A critical historian traces how the idea of eternal torment took shape." },
    { title: "Ethics, Parts IV–V", by: "Baruch Spinoza", year: "1677", url: "https://www.gutenberg.org/ebooks/3800", note: "Spinoza on human bondage, repentance and pity, answering hatred with love, and blessedness as virtue itself." },
    { title: "The City of God, Book XXI", by: "Augustine", year: "c. 426", url: "https://www.newadvent.org/fathers/120121.htm", note: "The classic defense of eternal punishment, written against the doubters of Augustine's own day." },
    { title: "Hell: The Logic of Damnation", by: "Jerry L. Walls", year: "1992", note: "The philosophical case for a freely chosen hell." },
    { title: "The Great Divorce", by: "C. S. Lewis", year: "1945", note: "A short novel about a bus trip from hell to heaven, and the best-known picture of a hell people choose." },
    { title: "That All Shall Be Saved", by: "David Bentley Hart", year: "2019", note: "An Orthodox theologian who works in Aquinas's tradition argues that endless hell is incompatible with a good God." },
    { title: "Dominion: How the Christian Revolution Remade the World", by: "Tom Holland", year: "2019", note: "The history behind the claim that care for the weak is a Christian inheritance." },
    { title: "Hell", by: "Internet Encyclopedia of Philosophy (C. P. Ragland)", url: "https://iep.utm.edu/hell/", note: "A survey of the main views of hell and the arguments for and against each." },
  ],
};

export default morals;
