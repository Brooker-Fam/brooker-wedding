import type { Objection } from "../types";

/* Objection V — the moral picture. Three prongs: hell for unbelief, guilt as
   control, and Nietzsche's charge of life-denial. Every quote below was checked
   against a public-domain text (KJV; Elwes's Spinoza; Ludovici, Samuel and
   Kennedy's Nietzsche; ANF; the English Dominican Summa; Shaw's Enchiridion;
   Chesterton's Orthodoxy; vatican.va). Lewis's "locked on the inside" (The
   Problem of Pain, ch. 8) is quoted inline only. */

const morals: Objection = {
  id: "morals",
  numeral: "V",
  short: "Morals",
  title: "The moral picture is wrong",
  objection:
    "The moral picture fails: hell for holding the wrong beliefs, guilt used as control, and Nietzsche's charge that the whole faith says No to life.",
  counter:
    "Biblical faith means allegiance, not correct opinions, and annihilationism or Hart's universalism remove eternal torment, though most evangelicals reject both. Nietzsche's charge is about value, not truth, so it fails the test skeptics rightly apply to hypocrisy arguments, and a faith built on incarnation and bodily resurrection is hard to call life-denying. Tom Holland's Dominion adds the sting: the care for the weak the objector has kept is a Christian inheritance, which Nietzsche himself said can't stand once the faith is gone.",
  dek: "This objection comes from conscience, not the laboratory. Hell for honest doubters, guilt that keeps people coming back, a faith that seems to say No to the body and the world: if the picture is ugly, does that count against it being true? Three charges, the strongest replies, and two stings that cut opposite ways: the conscience doing the judging may have been raised by the faith it judges, and if so, the faith's own conscience convicts it.",
  question:
    "If a faith's picture of God looks cruel, is that evidence it is false, and whose conscience gets to say so?",

  prongs: [
    /* ───────────────────────── I. HELL ───────────────────────── */
    {
      id: "mor-hell",
      side: "skeptic",
      label: "Christianity's hell, endless torment for unbelief, is monstrous",
      gist: "Christianity has long taught that whoever dies without the right faith suffers forever, and no good being would sentence an honest doubter, or anyone at all, to torment without end.",
      body: [
        "This is the tradition's own teaching, in its own words, not a caricature. The Athanasian Creed makes keeping the catholic faith the condition of escaping everlasting perishing. {{augustine}} defended a literal, unending fire (*City of God* XXI); the Council of Florence (1442) sent pagans, Jews and heretics outside the Church into 'everlasting fire'; {{edwards}} dangled the sinner over the pit 'as one holds a spider'. {{russell}} found 'one very serious defect' in Christ himself: he believed in hell.",
        "The charge has two parts. The criterion is belief, a creed and a name that most people hold or miss by accident of birth. And the penalty is endless. Even with a fairer criterion, no finite life of wrongdoing earns torment without end; {{aquinas}} even raises the point against himself: punishment is a kind of medicine, and no medicine should be infinite. Soften one part and the other remains. A father who did this to a child would be a monster. Calling it justice in God does not change what it is.",
      ],
      quote: {
        text: "Whosoever will be saved, before all things it is necessary that he hold the catholic faith; which faith except every one do keep whole and undefiled, without doubt he shall perish everlastingly.",
        who: "Athanasian Creed (Quicunque vult)",
        cite: "vv. 1–2 (c. 500; Book of Common Prayer tr.)",
      },
      thinkers: ["augustine", "edwards", "russell", "aquinas"],
      cedes:
        "I'd concede if the faith turned out not to teach endless torment for unbelief, or if its sentence could be shown to track a person's real, chosen wrong and to end when the wrong does.",
      see: [
        { id: "hid-argument", why: "Hell for unbelief plus a God who withholds the evidence: objection II compounds this one." },
        { id: "coh-c-nature", why: "Whose standard of 'good' judges God is objection I's Euthyphro question." },
      ],
      sources: [
        { title: "The Problem of Hell", by: "Jonathan L. Kvanvig", year: "1993", note: "The proportionality objection and the main replies, from a sympathetic critic." },
      ],
      children: [
        {
          id: "mor-chosen-hell",
          side: "theist",
          label: "Hell lasts as long as the will refuses, not for a past act",
          gist: "On Aquinas's view hell is not a sentence for a past act but the debt of a will that has turned from God and stays turned, fixed at death, so the punishment lasts as long as the disorder does.",
          body: [
            "'An infinite sentence for a finite crime' assumes the crime is over. {{aquinas}} denies it. Punishment follows a disordered relation, and the debt lasts as long as the disorder does (*Summa Theologiae* I-II q.87 a.3). A will that has turned from its last end, and keeps turning, is not serving time for an old offense. It is still committing it.",
            "Length of sentence never tracked length of deed: a murder takes a moment, Aquinas notes, and no court punishes it for a moment. What counts is the will. Whoever fixes his end in sin 'has the will to sin, everlastingly', and at death that turning is settled. The pain is proportioned to the sin in severity; only its duration is endless, because the refusal is. Nor is it vengeance. The medicine in it, he answers his own objection, is for the living, who are warned.",
          ],
          quote: {
            text: "Wherefore so long as the disturbance of the order remains the debt of punishment must needs remain also.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I-II q.87 a.3 (tr. Fathers of the English Dominican Province)",
          },
          thinkers: ["aquinas"],
          cedes: "I'd concede if the damned could be shown to want out, and to be kept in anyway.",
          see: [
            { id: "hid-hidden-resistance", why: "The same structure in objection II: refusal can run deeper than anyone reports." },
            { id: "mor-locked-door", why: "The other classic version, which keeps the door open to the end." },
          ],
          sources: [
            { title: "Summa Theologiae I-II q.87 (On the Debt of Punishment)", by: "Thomas Aquinas", note: "Article 3 and the replies to objections 1–2." },
          ],
          children: [
            {
              id: "mor-fixed-will",
              side: "skeptic",
              label: "If death fixes the will, God keeps the damned locked in",
              gist: "On Aquinas's account the will is fixed at death and only God could unfix it, so the damned stay because he declines to heal them, and by Aquinas's own account they want out.",
              body: [
                "Follow the debt to its source. On {{aquinas}}'s account the will is fixed in its last choice at death and can never turn again (*Summa Contra Gentiles* IV.92–95). Then 'it lasts as long as the will refuses' means 'as long as the will stays fixed', which is forever. And his damned do repent, though only indirectly, grieving for the punishment rather than the sin (*Summa Theologiae* Suppl. q.98 a.2). They want out, and are kept in.",
                "Aquinas's own text says who holds the key. The ruined will is irreparable only 'considered in itself', he writes, 'although it is possible to repair it by the power of God' (I-II q.87 a.3). The damned stay damned, then, because God, able to heal them, declines. That is not respect for a No. It is a passing No, made at the last moment of a life, made permanent by someone else and punished for being permanent.",
              ],
              thinkers: ["aquinas"],
              cedes:
                "I'd concede if hell's permanence could be shown to come from the damned alone, not from a God who could heal the will and declines to.",
              see: [
                { id: "coh-b-classical", why: "Objection I's God who moves every will, here moving one toward hell and holding it there." },
                { id: "mor-universalism", why: "If God can repair any will, Hart asks why he would leave one unrepaired." },
              ],
            },
            {
              id: "mor-no-desert",
              side: "spinoza",
              label: "No one deserves hell, because no one chooses freely",
              gist: "A will that turned from God earns hell only if it could have done otherwise, and Spinoza denies it could: people act from causes, so they may be unhappy, but cannot deserve punishment from a God without anger.",
              body: [
                "A will that turned from God deserves its debt only if it could have turned the other way. Spinoza denies there is such a will. 'Men are mistaken in thinking themselves free'; their idea of freedom is only their ignorance of the causes of what they do (*Ethics* II P35 Schol.). The will 'cannot be called a free cause, but only a necessary cause' (I P32). Remove the uncaused No and hell has no one in it who earned it.",
                "Spinoza said as much to Oldenburg in 1676. God cannot be angry. People who sin from a weak nature are excusable, though not for that reason blessed. When Scripture calls God a judge who passes sentence it is 'speaking humanly', because its purpose is not to make people wise 'but to make them obedient'. A weak nature brings its own loss, as a weak body does. That is sad, and it is natural. It is not a sentence, and no one stands over it keeping score.",
              ],
              quote: {
                text: "I fully admit that God cannot be angry, and that all things are done in accordance with His will; but I deny that all men ought, therefore, to be blessed—men may be excusable, and, nevertheless, be without blessedness and afflicted in many ways.",
                who: "Baruch Spinoza",
                cite: "Letter 78, to Oldenburg, 7 Feb. 1676 (tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes: "I'd concede if a choice could be shown to be both uncaused and still the chooser's own.",
              see: [
                { id: "coh-b-spinoza", why: "The same denial of free will dissolves objection I's foreknowledge puzzle." },
                { id: "coh-b-needslib", why: "Objection I's warning that this exit costs the theist fair judgment." },
              ],
              children: [
                {
                  id: "mor-spinoza-few",
                  side: "theist",
                  label: "The classical hell needs no uncaused choice and no angry God",
                  gist: "The classical view never needed an uncaused choice: God moves the will as its first cause, desert survives determinism, anger is said of God only by metaphor, and Spinoza's own letter grants that the excusable still perish.",
                  body: [
                    "Spinoza's determinism answers a hell the classical tradition never taught. {{aquinas}} does not need an uncaused No. God moves the will as its first cause, and the choice is still wholly the chooser's, as ((coh-a-concur|objection I argues)). Secular philosophers agree that desert survives determinism. On Harry Frankfurt's account (1969, 1971) you are responsible when you act from the will you want to have, whatever caused it, and {{strawson}}'s reactive attitudes need no uncaused choice either.",
                    "Spinoza's letter grants the rest. The man bitten by a mad dog is excusable and is still put down; the man who cannot govern his desires 'necessarily perishes' (Letter 78). That is Aquinas's hell as a built-in consequence: a nature turned from God brings its own ruin. Nor does Aquinas's God rage. Anger is said of him only by a likeness of effect, because punishing is what angry men do (*Summa Theologiae* I q.3 a.2 ad 2). Remove the caricature and the two pictures differ less than Spinoza claims.",
                  ],
                  quote: {
                    text: "He who goes mad from the bite of a dog is excusable, yet he is rightly suffocated.",
                    who: "Baruch Spinoza",
                    cite: "Letter 78, to Oldenburg (1676; tr. R. H. M. Elwes)",
                  },
                  thinkers: ["aquinas", "strawson", "spinoza"],
                  cedes:
                    "I'd concede if desert turned out to require a choice with no cause at all, or if Spinoza's 'perishing' were not a penalty in all but name.",
                  see: [
                    { id: "coh-b-needslib", why: "Objection I's rejoinder: a God who moves every will causes the sins he judges." },
                    { id: "mor-fixed-will", why: "If God moves the will, the skeptic asks who keeps it fixed." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-locked-door",
          side: "theist",
          label: "Hell's door is locked from the inside, and God never locks it",
          gist: "On Lewis's and Walls's view God never stops offering heaven, and the damned stay because they keep preferring themselves, so hell is God's terrible respect for a No, not a sentence he refuses to lift.",
          body: [
            "A second version keeps the door open for ever. In *The Problem of Pain* (1940) {{lewis-cs}} put it in a phrase: the damned are rebels to the end, and the doors of hell are 'locked on the inside'. In *The Great Divorce* (1945) a bus leaves for heaven whenever the damned like; almost none stay, because staying means letting go of a grievance. In the end, Lewis concluded, there are those who say to God 'Thy will be done', and those to whom God says it.",
            "{{walls}} turns the picture into an argument (*Hell: The Logic of Damnation*, 1992). Love does not coerce, and a [[libertarian-freedom|freedom]] that can never finally say No is not freedom. If God wants to be loved, he must let himself be refused, and go on letting himself be refused. Hell, on this view, is not a sentence God declines to lift. It is his terrible respect for a No he never stops inviting back.",
          ],
          quote: {
            text: "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.",
            who: "Jesus, in the Book of Revelation",
            cite: "Revelation 3:20 (KJV)",
          },
          thinkers: ["lewis-cs", "walls"],
          cedes: "I'd concede if endless open-door chances could be shown to win every will in the end, so that no one stays.",
          see: [
            { id: "coh-b-needslib", why: "Walls's version needs libertarian freedom, which objection I says costs the theist elsewhere." },
            { id: "mor-chosen-hell", why: "Aquinas's version, where the will is fixed at death." },
          ],
          sources: [
            { title: "Hell: The Logic of Damnation", by: "Jerry L. Walls", year: "1992" },
            { title: "The Great Divorce", by: "C. S. Lewis", year: "1945" },
          ],
          children: [
            {
              id: "mor-door-empties",
              side: "skeptic",
              label: "An open door, held open forever, empties hell",
              gist: "If the door never closes and God never stops wooing, a refusal that can be revisited for endless ages becomes vanishingly unlikely to hold, so the open-door hell slides into universalism.",
              body: [
                "The open door is this version's glory and its undoing. A refusal that can be revisited for endless ages, by a person God never stops wooing, is vanishingly unlikely to hold: give any chance of turning, however small, renew it without end, and the odds of never turning fall to zero. {{talbott}} argues that no one could choose endless misery with fully open eyes, and Kronen and Reitan, in *God's Final Victory* (2011), that the free-will hell slides into ((mor-universalism|universalism)).",
                "Lewis's own bus runs every day. And {{adams-marilyn-m}} asks why a loving God would let immature, half-informed agents set their own course toward endless ruin at all, revisable or not. No loving parent lets a toddler go on choosing to play in traffic because the choice is his, and no lover worth the name stands knocking forever while the beloved wastes away inside.",
              ],
              thinkers: ["talbott", "adams-marilyn-m", "lewis-cs"],
              cedes:
                "I'd concede if a will could be shown to set harder with every chance it is given, so that endless time fixes a refusal rather than wearing it away.",
              see: [
                { id: "hid-pursues", why: "Objection II: perfect love pursues the resister instead of waiting him out." },
              ],
              sources: [
                { title: "The Problem of Hell: A Problem of Evil for Christians", by: "Marilyn McCord Adams", year: "1993", note: "In Eleonore Stump, ed., Reasoned Faith." },
                { title: "God's Final Victory: A Comparative Philosophical Case for Universalism", by: "John Kronen and Eric Reitan", year: "2011" },
              ],
              children: [
                {
                  id: "mor-no-becomes-self",
                  side: "theist",
                  label: "A No repeated long enough becomes the self that says it",
                  gist: "Choices make characters, so a refusal repeated for ages stops being something a person does and becomes what the person is; endless chances need not wear it down, because less and less of anyone is left to take them.",
                  body: [
                    "The odds argument treats every chance as a fresh coin toss, independent of the last. Character does not work that way. We become just by doing just acts, Aristotle observed, and a choice made again and again grows easier to make and harder to unmake. {{walls}} argues (1992) that a person can reach a settled, decisive evil: not one refusal among many, but a self organized around refusing. {{swinburne}} made the point in 1983: by repeated choices a person can lose the very capacity to choose the good.",
                    "{{lewis-cs}} dramatized it in *The Great Divorce*. A woman who began with a grumble, the teacher explains, may end as nothing but the grumble, with no one left inside to stop it. The door stays open; there is less and less of anyone to walk through. That is not a coin that must one day land heads. It is a self that has spent itself.",
                  ],
                  thinkers: ["walls", "swinburne", "lewis-cs", "aristotle"],
                  cedes:
                    "I'd concede if a refusal repeated for ages could be shown to stay as revisable as the first, so that time wore the will down rather than forming it.",
                  see: [
                    { id: "hid-hidden-resistance", why: "Objection II: a will can be divided in ways its owner cannot see." },
                  ],
                  sources: [
                    { title: "A Theodicy of Heaven and Hell", by: "Richard Swinburne", year: "1983", note: "In Alfred J. Freddoso, ed., The Existence and Nature of God." },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-annihilation",
          side: "theist",
          label: "The lost perish; they are not kept alive to suffer",
          gist: "Scripture's words for the fate of the lost are death and destruction, so on annihilationism the unredeemed finally cease to exist: judgment is real and final, but no one is kept alive in order to suffer.",
          body: [
            "Endless torment assumes the soul cannot die, an idea owed more to Plato than to the Bible, where God 'only hath immortality' (1 Timothy 6:16) and gives life as a gift. Scripture's vocabulary for the lost is destruction: whoever believes 'should not perish' (John 3:16); 'the wages of sin is death' (Romans 6:23); God can destroy soul and body alike (Matthew 10:28).",
            "On [[annihilationism|annihilationism]], or conditional immortality, argued at length by {{fudge}} in *The Fire That Consumes* (1982) and tentatively endorsed by {{stott}} in 1988, the fire consumes rather than preserves. The punishment is everlasting because its result is: a death with no return, 'everlasting destruction' (2 Thessalonians 1:9). Judgment and loss are real. Torment without end is not.",
          ],
          quote: {
            text: "And fear not them which kill the body, but are not able to kill the soul: but rather fear him which is able to destroy both soul and body in hell.",
            who: "Jesus, in Matthew's Gospel",
            cite: "Matthew 10:28 (KJV)",
          },
          thinkers: ["fudge", "stott"],
          cedes:
            "I'd concede if the New Testament's 'everlasting punishment' could only mean conscious suffering without end.",
          see: [{ id: "mor-development", why: "Arnobius taught the same around 300: the view is old, not a modern softening." }],
          sources: [
            { title: "The Fire That Consumes", by: "Edward William Fudge", year: "1982" },
            { title: "Evangelical Essentials: A Liberal-Evangelical Dialogue", by: "David L. Edwards with John Stott", year: "1988" },
          ],
          children: [
            {
              id: "mor-perish-belief",
              side: "skeptic",
              label: "Annihilation for unbelief still punishes the wrong belief",
              gist: "Destroying the unbeliever instead of tormenting him softens the penalty but keeps the criterion, and Jesus' own words make the punishment of the lost as everlasting as the life of the saved.",
              body: [
                "Annihilationism repairs one half of the charge and leaves the other. ((mor-hell|The prong)) had two parts, the criterion and the penalty, and softening one leaves the other standing. The honest doubter who dies unconvinced is no longer tortured; he is erased. A court that executes people for their opinions instead of torturing them has become more merciful, not just.",
                "And the texts push back. {{augustine}} answered the softeners of his day from Matthew 25:46: one adjective governs both halves of the verse, so if the punishment ends, so does the life. A punishment, unlike a disappearance, is something someone undergoes, and Revelation has 'the smoke of their torment' ascending 'for ever and ever', with 'no rest day nor night' (14:11). Annihilationism must read the plainest descriptions of conscious suffering as figures for its end.",
              ],
              quote: {
                text: "And these shall go away into everlasting punishment: but the righteous into life eternal.",
                who: "Jesus, in Matthew's Gospel",
                cite: "Matthew 25:46 (KJV)",
              },
              thinkers: ["augustine"],
              cedes:
                "I'd concede if annihilation fell only on those who knowingly refused the good, never on an honest doubter, and the texts of lasting torment read naturally as lasting destruction.",
              see: [
                { id: "mor-allegiance", why: "The theist's answer to the criterion: saving faith as allegiance, not opinion." },
              ],
            },
          ],
        },
        {
          id: "mor-universalism",
          side: "theist",
          label: "God's love finally restores every soul, so hell ends",
          gist: "On apokatastasis, the restoration of all things, God's love finally heals every soul, so hell is real and corrective, and it ends.",
          body: [
            "The oldest alternative to endless hell is [[apokatastasis|apokatastasis]], the restoration of all things. {{origen}} taught it, {{gregory-of-nyssa}} hoped for every creature's return, and {{isaac-of-nineveh}} wrote that the damned are scourged by love itself. Paul supplies the texts: 'as in Adam all die, even so in Christ shall all be made alive' (1 Corinthians 15:22), and God means through Christ 'to reconcile all things unto himself' (Colossians 1:20).",
            "{{hart}} argues from God's nature. A God who creates from nothing, knowing that some creatures will suffer forever, wills that end as surely as anything else he wills; if he is the Good itself, he cannot will it. {{talbott}} adds that no one could choose endless misery with open eyes, so a love that never stops wooing will not be refused forever. Hell is real, and it is the fire of that love, which purifies and then is done.",
          ],
          quote: {
            text: "And when all things shall be subdued unto him, then shall the Son also himself be subject unto him that put all things under him, that God may be all in all.",
            who: "Paul",
            cite: "1 Corinthians 15:28 (KJV)",
          },
          thinkers: ["origen", "gregory-of-nyssa", "isaac-of-nineveh", "hart", "talbott"],
          cedes:
            "I'd concede if a creature could, with full understanding, go on refusing its own good forever, or if Scripture's 'everlasting' punishment could only mean punishment without end.",
          see: [{ id: "mor-locked-door", why: "Talbott's argument is aimed squarely at the locked-door hell." }],
          sources: [
            { title: "That All Shall Be Saved: Heaven, Hell, and Universal Salvation", by: "David Bentley Hart", year: "2019" },
          ],
          children: [
            {
              id: "mor-flew",
              side: "skeptic",
              label: "Every softening of hell concedes the objection",
              gist: "Universal restoration is a minority reading the church condemned in 543 and again in 1215, and it wins only by letting conscience overrule centuries of teaching, which concedes the objection instead of answering it.",
              body: [
                "Restoration has a price, and the church weighed it. Justinian's edict against Origen (543) anathematized anyone who says the punishment of demons and the wicked is temporary and will one day end. The Fourth Lateran Council (1215) confessed that the damned receive perpetual punishment with the devil. And Michael McClymond's history of Christian universalism, *The Devil's Redemption* (2018), finds it a minority current through the centuries, often esoteric and often condemned.",
                "So the modern revival needs a name for what it is doing. {{flew}} supplied one: a claim revised every time it meets an objection dies 'the death by a thousand qualifications'. The doctrine did not change because new texts turned up. It changed because consciences, trained to find the old picture unworthy of a good God, would no longer bear it. Each softening grants the objector's premise.",
              ],
              quote: {
                text: "It is in vain, then, that some, indeed very many, make moan over the eternal punishment, and perpetual, unintermitted torments of the lost, and say they do not believe it shall be so; not, indeed, that they directly oppose themselves to Holy Scripture, but, at the suggestion of their own feelings, they soften down everything that seems hard, and give a milder turn to statements which they think are rather designed to terrify than to be received as literally true.",
                who: "Augustine",
                cite: "Enchiridion 112 (c. 421; tr. J. F. Shaw)",
              },
              thinkers: ["augustine", "flew"],
              cedes:
                "I'd concede if the revisions could be shown to follow from the faith's own premises rather than from mine.",
              see: [
                { id: "evi-b-inerrancy", why: "Objection IV's parallel move: dropping a doctrine the creeds never fixed." },
              ],
              sources: [
                { title: "The Devil's Redemption: A New History and Interpretation of Christian Universalism", by: "Michael J. McClymond", year: "2018" },
              ],
              children: [
                {
                  id: "mor-development",
                  side: "theist",
                  label: "Correcting doctrine from its own core is growth, not surrender",
                  gist: "Correcting a doctrine by the faith's own core, that God is love, is how doctrine has always grown, as with slavery, and the early church was already divided on hell.",
                  body: [
                    "Revision is how doctrine grows, not how it surrenders: 'here below to live is to change, and to be perfect is to have changed often,' wrote {{newman}}, who described how doctrine unfolds as the church draws out what its core implies. The church once tolerated slavery and now condemns it, by reading 'neither bond nor free' (Galatians 3:28) more faithfully, not by importing a secular test. {{hart}}'s case runs on classical premises, creation from nothing and God as the Good itself.",
                    "Nor are these modern softenings. Augustine himself testifies that 'very many' in his day rejected endless torment; Arnobius taught c. 300 that the wicked are finally consumed; {{gregory-of-nyssa}} was never condemned, and the anathemas of 553 (the Second Council of Constantinople) struck at an Origenist package he did not hold. The texts give way too. The adjective [[aionios|aiōnios]] comes from *aiōn*, 'age'; 'eternal redemption' (Hebrews 9:12) is a lasting result, not an endless act, and Sodom's 'eternal fire' (Jude 7) went out long ago.",
                  ],
                  thinkers: ["newman", "hart", "gregory-of-nyssa"],
                  cedes: "I'd concede if the case for these views needed a premise no classical theist holds.",
                  see: [
                    { id: "mor-convicts", why: "The skeptic's version of internal correction, aimed at the whole moral picture." },
                    { id: "evi-b-core", why: "Objection IV: where correcting from the core meets its hardest case, the miracles themselves." },
                  ],
                  sources: [
                    { title: "An Essay on the Development of Christian Doctrine", by: "John Henry Newman", year: "1845" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "mor-allegiance",
          side: "theist",
          label: "Saving faith is allegiance to a person, not correct opinion",
          gist: "In the New Testament, pistis is chiefly trust and loyalty, and Jesus judges by what people did for the least, so 'hell for wrong belief' misdescribes the criterion the texts actually use.",
          body: [
            "The prong says the criterion is belief. The Greek says otherwise. [[pistis|Pistis]] in the Roman world was primarily relational, not merely assent: trust, fidelity, keeping faith with someone, as Teresa Morgan's *Roman Faith and Christian Faith* (2015) shows. {{bates}} argues that the gospel's 'faith' is best rendered as allegiance to Jesus as king. Bare correct opinion saves no one; even the devils believe.",
            "When Jesus describes the judgment in Matthew 25, the nations are sorted by whether they fed the hungry and visited the prisoner, and the saved are surprised to learn they served him. Paul says Gentiles without the law show 'the work of the law written in their hearts' (Romans 2:15). A creed is the summary of a loyalty, not an entrance exam, and an honest doubter who loves justice is not simply on the wrong side of it.",
          ],
          quote: {
            text: "Thou believest that there is one God; thou doest well: the devils also believe, and tremble.",
            who: "James",
            cite: "James 2:19 (KJV)",
          },
          thinkers: ["bates"],
          cedes:
            "I'd concede if the New Testament made explicit assent to propositions, not loyalty lived out, the dividing line.",
          see: [
            { id: "hid-devils-believe", why: "The same verse, wielded by the skeptic in objection II." },
            { id: "evi-a", why: "Objection IV: what kind of belief faith asks for, and on what evidence." },
          ],
          sources: [
            { title: "Salvation by Allegiance Alone", by: "Matthew W. Bates", year: "2017", note: "One influential proposal; contested in its strong form." },
            { title: "Roman Faith and Christian Faith", by: "Teresa Morgan", year: "2015" },
          ],
          children: [
            {
              id: "mor-works",
              side: "spinoza",
              label: "Judge faith by works, and the risen-king creed drops out",
              gist: "Spinoza made the allegiance move first, judging faith by works alone, and drew the conclusion the church will not: then no belief about history, not even the resurrection, can be required for salvation.",
              body: [
                "Judging faith by loyalty lived out was Spinoza's move before it was the theologians'. In chapter 14 of the *Theological-Political Treatise* (1670) he reads James and John and concludes that faith is known only by works, whatever a person's doctrines. Faith needs only the few beliefs obedience needs, chiefly that God exists and is served by justice and charity toward one's neighbour. No belief about history makes the list.",
                "The church grants the premise and refuses the conclusion. Allegiance to a *risen* king smuggles the creed back in. You cannot pledge loyalty to a Lord you do not believe rose, and the texts tie salvation to that belief: 'believe in thine heart that God hath raised him from the dead' (Romans 10:9); there is 'none other name' (Acts 4:12). Which Lord a sincere person serves tracks, with near certainty, where they were born. Either works decide, and the resurrection is optional, as Spinoza said, or the creed decides, and the honest doubter is sorted by belief after all.",
              ],
              quote: {
                text: "… we can only judge a man faithful or unfaithful by his works. If his works be good, he is faithful, however much his doctrines may differ from those of the rest of the faithful.",
                who: "Baruch Spinoza",
                cite: "Theological-Political Treatise, ch. 14 (1670; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes: "I'd concede if allegiance to Jesus could be shown to require no belief that he rose.",
              see: [
                { id: "hid-demographics", why: "Objection II's map: belief in God follows history and borders." },
                { id: "evi-b-minimal", why: "Allegiance to a risen king leans on objection IV's resurrection case." },
                { id: "evi-b-spinoza", why: "Spinoza on what survives the Gospels' errors: ethics, not miracle." },
              ],
              children: [
                {
                  id: "mor-inclusivism",
                  side: "theist",
                  label: "Christ can save people who never knew his name",
                  gist: "Catholic teaching since Vatican II, echoed by many Protestants, holds that people who never truly met the gospel, even honest atheists, can be saved by Christ through the good they served: the creed names the Savior, not the only route.",
                  body: [
                    "The either-or misses a third option: Christ is the only Savior, but not only of those who know his name. Justin Martyr (*First Apology* 46, c. 155) called Socrates and Heraclitus Christians who lived by the Word, 'even though they have been thought atheists'. The Second Vatican Council made it church teaching, extending hope even to those who 'have not yet arrived at an explicit knowledge of God' but strive to live a good life (*Lumen Gentium* 16). The Spirit, 'in a manner known only to God', offers every person a share in Christ's death and rising (*Gaudium et Spes* 22).",
                    "{{rahner}} spoke of 'anonymous Christians'; {{lewis-cs}}, in *The Last Battle* (1956), has Aslan welcome Emeth, a lifelong servant of the rival god Tash. On [[inclusivism|inclusivism]] the resurrection is how the rescue was won, not a password the rescued must know.",
                  ],
                  quote: {
                    text: "Those also can attain to salvation who through no fault of their own do not know the Gospel of Christ or His Church, yet sincerely seek God and moved by grace strive by their deeds to do His will as it is known to them through the dictates of conscience.",
                    who: "Second Vatican Council",
                    cite: "Lumen Gentium 16 (1964)",
                  },
                  thinkers: ["rahner", "lewis-cs"],
                  cedes:
                    "I'd concede if the church taught that an honest, informed doubter counts as knowingly refusing Christ.",
                  see: [
                    { id: "hid-messengers", why: "Objection II: God chose to be known through people, so belief travels unevenly." },
                    { id: "hid-seeking-is-finding", why: "The seeker's longing as a first, unrecognized contact with God." },
                  ],
                  sources: [
                    {
                      title: "Lumen Gentium (Dogmatic Constitution on the Church)",
                      by: "Second Vatican Council",
                      year: "1964",
                      url: "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html",
                      note: "Read §14 and §16 together.",
                    },
                  ],
                  children: [
                    {
                      id: "mor-honest-doubter",
                      side: "skeptic",
                      label: "On the theist's Objection II, a doubter who heard isn't innocent",
                      gist: "If objection II's resistance replies are right, the doubter who heard and declined is culpable and inclusivism does not reach him; if he is blameless, the theist has granted Schellenberg's premise that innocent nonbelief exists.",
                      body: [
                        "Inclusivism plainly covers the villager who never heard. Does it cover the objector, who heard the gospel, weighed it and declined? Take the theist at his word in objection II. If {{moser}} is right, an unconvinced seeker is resisting somewhere; if {{calvin}} is right, every mind senses God and suppresses what it senses. Either way the doubter who heard is not innocent, *Lumen Gentium* 14 shuts out whoever knows and refuses, and inclusivism stops short of the objector.",
                        "The theist's other replies spare him, at a price. {{rea}}'s route grants that honest unbelief is real and answers {{schellenberg}} on other grounds. {{plantinga}}'s version of the sense of God ((hid-sensus|blames no one)) for a faculty damaged by inherited sin, and {{stump}}'s divided will ((hid-hidden-resistance|carries no blame)). Each concedes that [[nonresistant-nonbelief|nonbelief can be blameless]], which is Schellenberg's third premise. The theist must choose a horn: a guilty doubter here, or an innocent one there.",
                      ],
                      quote: {
                        text: "Whosoever, therefore, knowing that the Catholic Church was made necessary by Christ, would refuse to enter or to remain in it, could not be saved.",
                        who: "Second Vatican Council",
                        cite: "Lumen Gentium 14 (1964)",
                      },
                      thinkers: ["moser", "calvin", "rea", "schellenberg", "plantinga", "stump"],
                      cedes:
                        "I'd concede if the theist could call the informed doubter innocent here without granting, in objection II, that some nonbelief is blameless.",
                      see: [
                        { id: "hid-moser", why: "The willingness test that would make the doubter who heard culpable." },
                        { id: "hid-sensus", why: "Calvin's suppression thesis and Plantinga's no-fault version: one horn each." },
                        { id: "hid-rea-love", why: "Rea's route: honest unbelief granted, Schellenberg answered on other grounds." },
                        { id: "hid-argument", why: "The premise the second horn grants: nonresistant nonbelief exists." },
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
          gist: "God is not one moral agent among others, bound by duties as we are, so an indictment framed as a judge's broken duty misfires: goodness is said of God by analogy, not as a bigger version of ours.",
          body: [
            "'Monstrous' assumes that God's goodness is a human judge's goodness writ large: the same duties, applied to a bigger agent. Classical theists deny this. For {{aquinas}}, 'good' is said of God by [[analogy-of-being|analogy]]: what the word signifies belongs to God properly, more than to us, and only our way of signifying it, borrowed from creatures, falls short (*Summa Theologiae* I q.13 a.3).",
            "{{davies}} draws the conclusion. Duties bind members of a moral community, who depend on one another, owe one another and can wrong one another. The Creator of everything is not a member of that community with obligations to its other members; he stands to creatures as an author to characters, not as a neighbour to neighbours. So indictments framed as broken duties misfire. That leaves God's goodness to be judged, but not by a magistrate's rulebook.",
          ],
          thinkers: ["aquinas", "davies"],
          cedes: "I'd concede if the analogy left 'good' so thin that it could fit any act at all.",
          see: [
            { id: "coh-a-analogy", why: "Objection I's defense of analogical predication." },
            { id: "hid-rea-love", why: "Rea's parallel move: divine love need not look like a parent's." },
            { id: "hid-skeptical-theism", why: "The other route, that God may have reasons we cannot see, argued in Objection II." },
          ],
          sources: [{ title: "The Reality of God and the Problem of Evil", by: "Brian Davies", year: "2006" }],
          children: [
            {
              id: "mor-mansel",
              side: "skeptic",
              label: "A goodness unlike ours is not goodness: 'to hell I will go'",
              gist: "If 'good' said of God doesn't mean what it means of people, calling God good says nothing, and a mercy that permits endless torment is not recognizably mercy.",
              body: [
                "This move is old, and so is the answer. When the Oxford theologian Henry Mansel argued that divine goodness may differ in kind from ours, {{mill}} replied that a word used of God must mean what it means of people, or calling God good is empty praise. Analogy does not escape. If what 'good' signifies belongs to God properly, then mercy in God must be recognizably mercy, and endless torment is not.",
                "Even {{hart}}, a classical theist, presses the point: analogy is not equivocation, and a 'goodness' that permits eternal torment has stopped being analogous to anything we call good. Dropping duties does not help either. The charge was never that God broke a contract with his creatures. It is that endless torment is not what goodness, in any sense we can recognize, would do.",
              ],
              quote: {
                text: "I will call no being good, who is not what I mean when I apply that epithet to my fellow-creatures; and if such a being can sentence me to hell for not so calling him, to hell I will go.",
                who: "John Stuart Mill",
                cite: "An Examination of Sir William Hamilton's Philosophy (1865), ch. VII",
              },
              thinkers: ["mill", "hart"],
              cedes:
                "I'd concede if there were a sense of 'good' that is true of God, permits endless torment, and still means something I could recognize.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's version: a divine 'intellect' unlike ours is a dog-star, not a dog." },
                { id: "hid-love-emptied", why: "Objection II's twin: stretch 'love' that far and it stops saying anything." },
                { id: "coh-a-univocal", why: "Scotus's original case in Objection I: analogy needs a shared core or proves nothing." },
                { id: "hid-logical-foul", why: "The answer to the unseen-reasons route, argued in Objection II." },
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
      gist: "Teach people they are guilty from birth and headed for judgment and you produce fear and shame that only the church can relieve, whatever anyone intends, and the relief keeps them coming back.",
      body: [
        "This is not a claim about cynical priests. It is a claim about effects. Tell a child she was born guilty, that she is watched, and that judgment is coming, and you will raise an anxious adult, with the institution holding the only release. The insight is old. A fragment attributed to Critias has the gods invented so that wrongdoers fear even their secret deeds; Polybius admired Rome for holding the masses in check with religious dread; {{spinoza}} saw despots 'mask the fear, which keeps them down, with the specious garb of religion' (*Theological-Political Treatise*, Preface).",
        "{{nietzsche}} described the mechanism: the [[ascetic-ideal|ascetic priest]] takes the sufferer's [[ressentiment|ressentiment]] and turns it inward. {{freud}} made the sense of guilt civilization's central problem. The record supplies the rest: compulsory yearly confession from 1215, the indulgence trade, scrupulosity that clinicians now treat as a form of OCD, abuse hidden by shame.",
      ],
      quote: {
        text: "“I suffer: it must be somebody's fault”—so thinks every sick sheep. But his herdsman, the ascetic priest, says to him, “Quite so, my sheep, it must be the fault of some one; but thou thyself art that some one, it is all the fault of thyself alone …”",
        who: "Friedrich Nietzsche",
        cite: "The Genealogy of Morals III §15 (1887; tr. H. B. Samuel, 1910)",
      },
      thinkers: ["nietzsche", "freud", "spinoza"],
      cedes:
        "I'd concede if Christian communities turned out, on balance, less anxious and less ruled by shame than comparable secular ones.",
      see: [
        { id: "hid-coercion-subtle", why: "Objection II: a judge in plain view turns goodness into prudence." },
      ],
      children: [
        {
          id: "mor-gospel",
          side: "theist",
          label: "The gospel is the end of guilt, not its engine",
          gist: "The Christian message is that guilt is forgiven and finished, 'no condemnation', and churches that weaponized guilt betrayed that message, as reformers inside the faith said at the time.",
          body: [
            "This blames the doctor for the disease. The hinge of Paul's letter to the Romans is 'no condemnation'. {{luther}}'s breakthrough was relief from terror, the discovery that God's righteousness is a gift, and in 1517 he attacked the indulgence trade from inside the church. Confession ends in absolution: words spoken aloud so a person can stop carrying the thing. Abuse does not abolish right use, and the abuses stand condemned by the faith's own standards.",
            "The guilt-soaked introspection Nietzsche and Freud attacked is also a late Western development. Krister Stendahl showed that Paul had a 'robust conscience' (1963); the anguished self-examination came later, with Augustine and the medieval penitential system. And the data cut against the charge: in a large study of American nurses, women who attended services more than once a week had markedly lower suicide rates (VanderWeele and colleagues, *JAMA Psychiatry*, 2016).",
          ],
          quote: {
            text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
            who: "Paul",
            cite: "Romans 8:1 (KJV)",
          },
          thinkers: ["luther"],
          cedes: "I'd concede if, where the gospel is preached as forgiveness, guilt and fear rose rather than fell.",
          see: [
            { id: "evi-b-wright", why: "Stendahl's robust-conscience Paul again, in the resurrection case of Objection IV." },
          ],
          children: [
            {
              id: "mor-debt",
              side: "skeptic",
              label: "The cure first needs the debt it cancels",
              gist: "Christianity offers release from a guilt it assigns to everyone at birth, so 'no condemnation' needs universal condemnation first, and the remedy binds people to whoever wrote the bill.",
              body: [
                "'No condemnation' skips a step: who said we were condemned? {{augustine}}'s victory over Pelagius, ratified at Carthage in 418, made every newborn guilty in Adam; unbaptized infants, he concluded, receive 'the mildest punishment of all', but punishment (*Enchiridion* 93). {{luther}} made the terror a method: the law's chief office is to reveal sin and terrify the conscience, so that the gospel can console it (*Smalcald Articles* III.2). {{nietzsche}} called it a stroke of genius. A protection racket also offers relief, from a danger it announced.",
                "As for the data, the nurses study measured attending services, which is community, not doctrine, and it is observational: the healthy and well connected are likelier to go. The charge concerns guilt itself, and there the research on religious and spiritual struggle (Exline, Pargament and colleagues, 2014) links feeling punished or abandoned by God to depression and anxiety.",
              ],
              quote: {
                text: "… that stroke of genius called Christianity:—God personally immolating himself for the debt of man, God paying himself personally out of a pound of his own flesh, God as the one being who can deliver man from what man had become unable to deliver himself—the creditor playing scapegoat for his debtor, from love (can you believe it?), from love of his debtor!",
                who: "Friedrich Nietzsche",
                cite: "The Genealogy of Morals II §21 (1887; tr. H. B. Samuel, 1910)",
              },
              thinkers: ["augustine", "luther", "nietzsche"],
              cedes:
                "I'd concede if the doctrine of sin could be taught without telling anyone they are condemned before they have done anything.",
              children: [
                {
                  id: "mor-condition",
                  side: "theist",
                  label: "The guilt answers to something real, not an invented debt",
                  gist: "Original sin names a bent anyone can observe, our drift toward selfishness and cruelty, so the condemnation the gospel lifts is one our own consciences already pronounce.",
                  body: [
                    "A protection racket needs the danger to be fictional. This one is not. {{chesterton}} called [[original-sin|original sin]] the one Christian doctrine that can really be proved, and the twentieth century supplied the proof at scale. The doctrine's core is not infant guilt but a condition: we are curved in on ourselves and cannot simply will our way out.",
                    "Augustine's verdict on infants is one Western reading, not the essence. The Eastern churches generally reject inherited guilt, speaking of 'ancestral sin': inherited mortality and disordered desire, not a bill in a newborn's name. Strip away that reading and what remains is a diagnosis most honest people recognize in themselves, the gap between the good they see and the good they do. The gospel does not invent that gap. It names it, and then says it is not the last word.",
                  ],
                  quote: {
                    text: "Certain new theologians dispute original sin, which is the only part of Christian theology which can really be proved.",
                    who: "G. K. Chesterton",
                    cite: "Orthodoxy (1908), ch. 2",
                  },
                  thinkers: ["chesterton"],
                  cedes: "I'd concede if the moral disorder the doctrine names turned out to be shallow, rare, or easily willed away.",
                  children: [
                    {
                      id: "mor-repent",
                      side: "spinoza",
                      label: "The bent is nature, not sin, and it calls for understanding",
                      gist: "Spinoza grants the drift toward selfishness but calls it nature, not sin: what Chesterton can prove is the bent, not guilt before God, and the way out is understanding its causes, not remorse.",
                      body: [
                        "Chesterton's 'proved' slides between two claims. Selfishness is observed every day; guilt before God from birth is not observable at all. Spinoza takes the first and drops the second. 'Nothing comes to pass in nature, which can be set down to a flaw therein' (*Ethics* III Preface), so he studies human desires 'as though I were concerned with lines, planes, and solids'. Part IV is titled 'Of Human Bondage'; he does not think we are innocent. But a bent is a fact to be understood, not a debt to be paid, and the Eastern retreat to 'ancestral sin' already gives up the debt.",
                        "Remorse doubles the damage: the penitent is overcome first by a bad desire and then by pain (IV P54). The remedy is understanding. A passion 'ceases to be a passion, as soon as we form a clear and distinct idea thereof' (V P3). The aim is not to feel worse about the past but to act better in the present, from understanding instead of pain.",
                      ],
                      quote: {
                        text: "Repentance is not a virtue, or does not arise from reason; but he who repents of an action is doubly wretched or infirm.",
                        who: "Baruch Spinoza",
                        cite: "Ethics IV P54 (1677; tr. R. H. M. Elwes)",
                      },
                      thinkers: ["spinoza", "chesterton"],
                      cedes:
                        "I'd concede if remorse could be shown to help people repair harms better than a clear understanding of their causes does.",
                      see: [
                        { id: "coh-b-spinoza", why: "The determinism that makes remorse look like a category mistake." },
                        { id: "mor-holland-spinoza", why: "The same Ethics, on love that answers hatred." },
                      ],
                      children: [
                        {
                          id: "mor-strawson",
                          side: "theist",
                          label: "Remorse is owed to the person wronged, not a second injury",
                          gist: "Spinoza offers courage and generosity in place of remorse, but the person you wronged is owed your sorrow, not just your repairs, and Spinoza himself admits repentance does most people more good than harm.",
                          body: [
                            "Spinoza's own scholium keeps remorse for the many. Since people seldom live by reason, he writes, humility and repentance, hope and fear do more good than harm, for 'the crowd plays the tyrant, when it is not in fear' (IV P54 Schol.). So the Spinozist reserves understanding for the few and leaves fear to govern the rest, which is the guilt charge's own complaint, turned on him.",
                            "Nor is remorse mere self-punishment. Spinoza does not counsel numbness; he offers courage and highmindedness (III P59 Schol.), love that answers hatred (IV P46), and the wish to repair. But those look forward, and the person wronged is owed a look back. An apology without sorrow is defective, as Nick Smith argues in *I Was Wrong* (2008). {{strawson}} showed that guilt and resentment are among the [[reactive-attitudes|reactive attitudes]] by which we treat one another as persons, and {{williams-bernard}} found regret fitting even where there is no fault.",
                          ],
                          quote: {
                            text: "As men seldom live under the guidance of reason, these two emotions, namely, Humility and Repentance, as also Hope and Fear, bring more good than harm; hence, as we must sin, we had better sin in that direction.",
                            who: "Baruch Spinoza",
                            cite: "Ethics IV P54 Schol. (1677; tr. R. H. M. Elwes)",
                          },
                          thinkers: ["spinoza", "strawson", "williams-bernard"],
                          cedes:
                            "I'd concede if the people we wrong were as well served by our clear understanding as by our sorrow.",
                          see: [
                            { id: "mor-reparation", why: "What the wronged are owed: repentance, apology, reparation." },
                            { id: "coh-b-spinoza", why: "Strawson's essay is also an answer to the determinism Spinoza argues for." },
                          ],
                          sources: [
                            { title: "Freedom and Resentment", by: "P. F. Strawson", year: "1962" },
                            { title: "I Was Wrong: The Meanings of Apologies", by: "Nick Smith", year: "2008" },
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
              label: "No one can pay another person's moral debt",
              gist: "Guilt is the most personal of liabilities, as Kant argued, so punishing an innocent man in the guilty's place doesn't cancel guilt; it adds a second injustice to the first.",
              body: [
                "'No condemnation' depends on a transfer: Christ bears the penalty and the guilty go free. {{kant}} saw the problem in 1793. A money debt can be paid by anyone; the creditor does not care who settles it. The debt of sin, he argued, is not like that. It is the most personal of all liabilities, one only the culprit, not the innocent, can bear (*Religion within the Boundaries of Mere Reason*, 6:72).",
                "Faustus Socinus pressed the same point in 1594: if the debt is forgiven, nothing is owed; if it is paid, it was not forgiven. A judge who punishes an innocent volunteer and releases the guilty has not done justice twice; he has failed at it twice. [[penal-substitution|Penal substitution]] asks us to call that love.",
              ],
              thinkers: ["kant"],
              cedes:
                "I'd concede if atonement could be understood without any transfer of guilt or punishment from the guilty to the innocent.",
              see: [{ id: "mor-debt", why: "The other half of the guilt charge: the debt is assigned before it is forgiven." }],
              children: [
                {
                  id: "mor-reparation",
                  side: "theist",
                  label: "Atonement needn't mean punishing an innocent in our place",
                  gist: "Penal substitution is one model among several: on Swinburne's reparation view, Christ offers a perfect life that each person must take up as their own, which accepts Kant's point that guilt can't be transferred.",
                  body: [
                    "Kant and Socinus hit one theory of the cross, [[penal-substitution|penal substitution]], which no ecumenical creed defines, though Reformed confessions teach it (Westminster VIII.5; Heidelberg Q.12–18, 40). {{swinburne}}'s *Responsibility and Atonement* (1989) accepts Kant's premise: guilt cannot be shifted onto someone else. What a wrongdoer owes is repentance, apology, reparation and penance. The cross supplies a perfect offering the guilty can take up and present as their own, as a parent might give a child the money for a neighbour's broken window, which the child must still carry next door and hand over herself.",
                    "Gustaf Aulén's *Christus Victor* (1931) recovered the early church's picture of the cross as victory over sin and death, not payment to a wrathful Father. {{stump}}'s *Atonement* (2018) reads it as God's way to union with people alienated from themselves. On none of these is God an accountant who must see blood before he can forgive.",
                  ],
                  thinkers: ["swinburne", "stump"],
                  cedes: "I'd concede if every serious model of the atonement turned out to need a transfer of guilt after all.",
                  sources: [
                    { title: "Responsibility and Atonement", by: "Richard Swinburne", year: "1989" },
                    { title: "Atonement", by: "Eleonore Stump", year: "2018" },
                  ],
                  children: [
                    {
                      id: "mor-forgive-freely",
                      side: "skeptic",
                      label: "A God who commands free forgiveness needs no offering",
                      gist: "If what we owe is repentance, a God who receives it has all a forgiver can ask, and Jesus tells us to forgive seventy times seven without payment, so why must God require an offering first?",
                      body: [
                        "Reparation moves the problem without removing it. If what a wrongdoer owes is repentance, a God who receives that repentance has everything a forgiver can ask. Why must he also require an offering, and one only his own Son can make, before he forgives? Socinus's point survives: whatever is paid was not freely forgiven. And Jesus asks more of us than this. Peter is told to forgive seventy times seven (Matthew 18:22), and the father in the parable runs to the prodigal before the son has finished his speech (Luke 15:20–22).",
                        "Philip Quinn pressed this line in a 1994 volume honouring Swinburne himself. A victim who would forgive only after a third party handed over a perfect gift would seem less gracious, not more. And a God who demands the offering and supplies it too is still a creditor who must be paid, only paid by himself, which is {{nietzsche}}'s 'stroke of genius' over again.",
                      ],
                      quote: {
                        text: "I say not unto thee, Until seven times: but, Until seventy times seven.",
                        who: "Jesus",
                        cite: "Matthew 18:22 (KJV)",
                      },
                      thinkers: ["nietzsche"],
                      cedes:
                        "I'd concede if a forgiver who first required a perfect offering could be shown to love more, not less, than one who forgave on repentance alone.",
                      see: [
                        { id: "mor-debt", why: "Nietzsche's creditor who pays himself, in the other half of the guilt prong." },
                      ],
                      sources: [
                        { title: "Swinburne on Guilt, Atonement, and Christian Redemption", by: "Philip L. Quinn", year: "1994", note: "In Alan G. Padgett, ed., Reason and the Christian Religion." },
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
      gist: "Nietzsche's charge is that Christianity moves value to another world, calls pride, sex and strength sins, and so makes God the enemy of the very life he supposedly made, which is a reason to reject it.",
      body: [
        "This is {{nietzsche}}'s indictment, and it is about where the faith points. In *The Antichrist* (1888) the Christian God declares war on life, nature and the will to live; in *Twilight of the Idols* (1889) the church fights the passions by cutting them out instead of spiritualizing them. Its [[ascetic-ideal|ascetic ideal]] is a will to nothingness dressed as holiness, and even its Yes waits until the world is remade. His test is [[amor-fati|amor fati]]: wanting nothing different.",
        "The lived tradition bears him out. {{hume}} moved celibacy, fasting, penance and 'the whole train of monkish virtues' into the catalogue of vices. Trent anathematized anyone who says marriage is better than virginity (1563). And its heaven betrays the motive: in the *Summa*'s Supplement, compiled from {{aquinas}}'s early writings after his death, the blessed see the sufferings of the damned 'in order that the happiness of the saints may be more delightful to them' (Suppl. q.94 a.1). A faith that sets its God against life has given us a reason to refuse it.",
      ],
      quote: {
        text: "God degenerated into the contradiction of life, instead of being its transfiguration and eternal Yea! With God war is declared on life, nature, and the will to life!",
        who: "Friedrich Nietzsche",
        cite: "The Antichrist §18 (1888; tr. A. M. Ludovici, 1911)",
      },
      thinkers: ["nietzsche", "hume", "aquinas"],
      cedes:
        "I'd concede if the saints, and the church at its best, turned out to love this world more, not less, than its critics do.",
      see: [{ id: "mor-chosen-hell", why: "The same Thomist tradition that defends hell's justice supplies the heaven Nietzsche quotes." }],
      children: [
        {
          id: "mor-body",
          side: "theist",
          label: "A faith of incarnation and resurrection says Yes to the body",
          gist: "Christianity says God called matter 'very good', became flesh and rose in a body, it hallows marriage and work and canonizes farmers and parents, and loving a fallen world is a Yes, not a deferral.",
          body: [
            "Nietzsche's charge fits the Gnostics, whom the church fought, better than the church. God calls what he made 'very good' (Genesis 1:31); 'the Word was made flesh' (John 1:14); Paul insists on a *bodily* resurrection, and {{irenaeus}}, writing against those who despised matter, called a living human being the glory of God. The hope is this world healed, not abandoned ({{wright-nt}}, *Surprised by Hope*, 2008), and the central act of worship is a meal.",
            "Nor did the tradition live otherwise. The case against the monks was itself a Christian achievement: {{taylor-charles}} traces the modern sense that marriage and work are where a good life is lived to the Reformers' rejection of celibacy as the higher calling (*Sources of the Self*, 1989). Rome canonized Isidore the Farmer (1622) and the married Louis and Zélie Martin (2015), and Trent made marriage a sacrament. As for *amor fati*, a love that wants every atrocity again is resignation, not a Yes; {{chesterton}} loved the world as Rome's citizens loved Rome, before it was great.",
          ],
          quote: {
            text: "For the glory of God is a living man; and the life of man consists in beholding God.",
            who: "Irenaeus",
            cite: "Against Heresies IV.20.7 (c. 180; Ante-Nicene Fathers tr.)",
          },
          thinkers: ["irenaeus", "wright-nt", "taylor-charles", "chesterton"],
          cedes:
            "I'd concede if the tradition's saints and teachers, read as a whole, treated the body as a prison rather than a temple.",
          see: [
            { id: "evi-b-body", why: "Objection IV: the first witnesses insisted on a body and an empty tomb." },
            { id: "mor-holland", why: "The same pattern: a value the critic holds turns out to have a Christian pedigree." },
          ],
          sources: [
            { title: "Sources of the Self: The Making of the Modern Identity", by: "Charles Taylor", year: "1989", note: "Part III, 'The Affirmation of Ordinary Life'." },
          ],
          children: [
            {
              id: "mor-beyond",
              side: "skeptic",
              label: "A risen body still moves life's center to the beyond",
              gist: "Resurrection hallows the body only in the next world, so the faith still stakes life's meaning on a beyond, and the Christian 'affirmation of ordinary life' arrived some fifteen centuries late.",
              body: [
                "Nietzsche had the resurrection in view, and called it the problem, not the answer. Paul, he wrote, 'transferred the centre of gravity of the whole of that great life, to a place behind this life' (*The Antichrist* §42). A body raised there is still raised *there*. Paul says as much himself: 'If in this life only we have hope in Christ, we are of all men most miserable' (1 Corinthians 15:19). Without the beyond, this life is a loss.",
                "Nor is the risen body the one we have. In the resurrection no one marries (Mark 12:25), and Paul wished everyone were unmarried, as he was (1 Corinthians 7:7–8). What is saved is a body without appetite or death; what it now is must go. The 'affirmation of ordinary life' that {{taylor-charles}} credits to the Reformers arrived some 1,500 years in, against a tradition that had ranked virginity higher all along. A Yes deferred to the next world is the No Nietzsche meant.",
              ],
              quote: {
                text: "When the centre of gravity of life is laid, not in life, but in a beyond—in nonentity,—life is utterly robbed of its balance.",
                who: "Friedrich Nietzsche",
                cite: "The Antichrist §43 (1888; tr. A. M. Ludovici, 1911)",
              },
              thinkers: ["nietzsche", "paul", "taylor-charles"],
              cedes:
                "I'd concede if the tradition's hope for the body were shown to make this life, its marriages, work and pleasures, matter more rather than serve as a waiting room.",
              see: [
                { id: "evi-b-flesh", why: "Objection IV: Paul's risen body is heavenly, not this flesh revived." },
              ],
            },
          ],
        },
        {
          id: "mor-holland",
          side: "theist",
          label: "Your care for the weak is Christian; you can't borrow his No",
          gist: "The modern conviction that the weak and the victim matter most came from Christianity, and Nietzsche's charge condemns exactly that, so an objector who keeps the care cannot borrow the charge without its contempt.",
          body: [
            "Whoever presses Nietzsche's charge is judging with borrowed tools. {{holland}}'s *Dominion* (2019) argues that the West's deepest instincts, that the weak have claims on the strong and every person has equal dignity, are Christian in origin, absorbed so thoroughly that secular people mistake them for common sense. {{celsus}} saw the novelty at once.",
            "{{nietzsche}}'s test comes bundled with a verdict on these very instincts. Pity 'preserves that which is ripe for death' (*The Antichrist* §7); raising up the lowly was the slave revolt in morality (*Genealogy* I §7). 'When we renounce the Christian faith, we abandon all right to Christian morality' (*Twilight of the Idols*, 'Skirmishes in a War with the Age' §5).",
            "Nicholas Wolterstorff argues that *equal* worth, for the infant and the severely impaired as for the genius, needs something like being loved by God, and Jeremy Waldron doubts that basic equality can be defended 'apart from some religious foundation' (*God, Locke, and Equality*, 2002). The objector who keeps the care cannot borrow Nietzsche's charge without his contempt.",
          ],
          quote: {
            text: "Every one, they say, who is a sinner, who is devoid of understanding, who is a child, and, to speak generally, whoever is unfortunate, him will the kingdom of God receive.",
            who: "Celsus, quoted by Origen",
            cite: "Contra Celsum III.59 (c. 248; Ante-Nicene Fathers tr.)",
          },
          thinkers: ["holland", "celsus", "nietzsche"],
          cedes:
            "I'd concede if Nietzsche's charge could be kept whole without his contempt for the weak, or if equal regard for the weak had arisen as fully in a culture Christianity never touched.",
          see: [
            { id: "mor-hell", why: "If the objector's conscience is Christian, the standard that judges hell is on loan from the faith it judges." },
            { id: "mor-guilt", why: "The same loan, used to judge guilt as control." },
            { id: "mor-mansel", why: "Mill's 'what I mean by good' is the inheritance in question." },
          ],
          sources: [
            { title: "Dominion: How the Christian Revolution Remade the World", by: "Tom Holland", year: "2019" },
            { title: "Justice: Rights and Wrongs", by: "Nicholas Wolterstorff", year: "2008" },
          ],
          children: [
            {
              id: "mor-convicts",
              side: "skeptic",
              label: "Then the Christian conscience convicts Christianity",
              gist: "If the objector's care for the weak is Christian, the objection becomes an internal critique, which is harder to dismiss, and secular societies that kept the care after losing the faith test whether it can survive.",
              body: [
                "Grant the inheritance, and the objection gets stronger. Nietzsche's charge comes apart from his contempt: the No to life lies in the ascetic ideal and the deferred heaven, not in compassion, as ((mor-holland-spinoza|Spinoza)) shows. If care for the victim is the faith's deepest value, hell for honest doubters and guilt used as control fail its own test.",
                "Nor does equal worth need God beneath it. {{rawls}} grounds it in a 'range property', a capacity everyone above a threshold has equally (*A Theory of Justice* §77); for those below it, Eva Kittay finds dignity in relations of care (1999); {{wielenberg}} takes basic moral facts to need no foundation. To think otherwise is the [[genetic-fallacy|genetic fallacy]], used to credit a value instead of to discredit it.",
                "The claim can be tested. Denmark and Sweden, deeply secular, have widened their care for the weak (Zuckerman, 2008). Call that Lutheran capital still being spent, as Robert H. Nelson does, and 'can't outlive the faith' becomes a claim no track record could test.",
              ],
              quote: {
                text: "… in thus wise did Christianity go to ruin as a dogma, through its own morality; in thus wise must Christianity go again to ruin to-day as a morality—we are standing on the threshold of this event.",
                who: "Friedrich Nietzsche",
                cite: "The Genealogy of Morals III §27 (1887; tr. H. B. Samuel, 1910)",
              },
              thinkers: ["nietzsche", "rawls", "wielenberg"],
              cedes: "I'd concede if secular societies' care for the weak decayed as their Christian memory faded.",
              see: [
                { id: "mor-development", why: "The theist's own version: correction from the faith's core." },
                { id: "coh-c-brute", why: "Objection I: Wielenberg's case that moral facts need no foundation." },
              ],
              sources: [
                { title: "Society without God", by: "Phil Zuckerman", year: "2008" },
                { title: "Love's Labor: Essays on Women, Equality, and Dependency", by: "Eva Feder Kittay", year: "1999" },
                { title: "Lutheranism and the Nordic Spirit of Social Democracy", by: "Robert H. Nelson", year: "2017", note: "The comeback this node answers: Nordic welfare as secularized Lutheranism." },
              ],
            },
            {
              id: "mor-holland-spinoza",
              side: "spinoza",
              label: "Reason alone teaches love that answers hatred",
              gist: "Spinoza derives from reason, without a personal God or a cross, that we should repay hatred with love and help the suffering, so the ethic credited to the faith can stand on another foundation.",
              body: [
                "Holland's claim assumes the ethic needs its Christian root. Spinoza grew it from another. Whoever lives by reason 'endeavours, as far as possible, to render back love, or kindness, for other men's hatred' (*Ethics* IV P46), because hatred grows when returned and 'can on the other hand be destroyed by love' (III P43). The good a virtuous person wants for himself he wants for all, 'and so much the more, in proportion as he has a greater knowledge of God' (IV P37).",
                "And the free person helps. Spinoza drops pity as a sad passion, but not the deed: freeing others from misery is something reason itself dictates, and whoever is moved to help 'neither by reason nor by compassion, is rightly styled inhuman' (IV P50 Schol.). No cross, no judgment, no debt, and love still at the center.",
              ],
              quote: {
                text: "He who chooses to avenge wrongs with hatred is assuredly wretched. But he, who strives to conquer hatred with love, fights his battle in joy and confidence.",
                who: "Baruch Spinoza",
                cite: "Ethics IV P46 Schol. (1677; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if the propositions of Part IV needed a premise about the worth of the weak that reason alone cannot supply.",
              see: [{ id: "mor-repent", why: "The same Spinoza, on remorse." }],
              children: [
                {
                  id: "mor-pity",
                  side: "theist",
                  label: "Spinoza keeps the help but not the claim of the helpless",
                  gist: "Spinoza grounds help in what reason finds useful and blessedness in capacity, so the infant, the impaired and the weak-willed have no claim of their own, while Christianity grounds their claim in God's love.",
                  body: [
                    "Reason alone changes the foundation, and the building changes shape. Spinoza grounds help in shared usefulness: 'to man there is nothing more useful than man' (IV P18 Schol.), and good is 'that which we certainly know to be useful to us' (IV Def. 1). A claim grounded that way depends on what the one reasoning finds useful. Beasts, 'whose nature is different from our own', fall outside it (IV P37 Schol. 1). Augustine and Aquinas said much the same of animals; the telling thing is the principle, that concern follows likeness.",
                    "Blessedness follows capacity too. It grows with a body 'capable of the greatest number of activities' (V P39); an infant's mind is 'scarcely conscious of itself, or of God'; the man who cannot govern his desires 'necessarily perishes' (Letter 78). The Christian claim is that the helpless matter because God loves them, which is why Jesus tells his host to invite 'the poor, the maimed, the lame, the blind', since 'they cannot recompense thee' (Luke 14:13–14).",
                  ],
                  quote: {
                    text: "Pity, in a man who lives under the guidance of reason, is in itself bad and useless.",
                    who: "Baruch Spinoza",
                    cite: "Ethics IV P50 (1677; tr. R. H. M. Elwes)",
                  },
                  thinkers: ["spinoza"],
                  cedes:
                    "I'd concede if Spinoza's reason gave the helpless, who share in no one's reasoning, the same claim on us as the wise.",
                  see: [
                    { id: "hid-spinoza-my-god", why: "Objection II meets the same God, who strictly speaking loves no one." },
                    { id: "coh-c-person", why: "Objection I's general case: obligation needs someone who makes the claim." },
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
          gist: "The life-denial charge asks whether Christianity is good for us, not whether it is true, and Nietzsche says it would stand even if God were proved, so like the hypocrisy argument it leaves God's existence untouched.",
          body: [
            "Nietzsche himself says this charge is about value, not truth. He would refuse the Christian God even if its existence were proved, because he judges it 'not as an error, but as a *crime against life*' (*The Antichrist* §47). A charge built to survive a proof of God cannot be evidence against God.",
            "Skeptics rightly apply this rule elsewhere. 'Christians are hypocrites, so Christianity is false' is dismissed: conduct and consequences are one question, truth another. 'Atheist regimes were cruel, so atheism is false' fails for the same reason. By that test, 'Christianity is bad for life' tells us nothing about whether Jesus rose. It may be a reason to wish the faith false. It is not a reason to think it is.",
          ],
          quote: {
            text: "If the existence of this Christian God were proved to us, we should feel even less able to believe in him.",
            who: "Friedrich Nietzsche",
            cite: "The Antichrist §47 (1888; tr. A. M. Ludovici, 1911)",
          },
          thinkers: ["nietzsche"],
          cedes:
            "I'd concede if a faith's harmfulness could be shown to be evidence that its central historical and metaphysical claims are false.",
          children: [
            {
              id: "mor-daybreak",
              side: "skeptic",
              label: "Show how a belief arose and you no longer need to refute it",
              gist: "Nietzsche's method is genealogy: explain belief in God by fear, weakness and resentment and it loses its evidence; and a faith that promises abundant life can be tested by its fruits.",
              body: [
                "That misses Nietzsche's method. In *Daybreak* §95 he calls the historical refutation 'the decisive one': once you show how a belief arose and gained authority, refuting it directly becomes unnecessary. If a belief is fully explained by causes that have nothing to do with its truth (fear of death, the resentment of the weak, a priestly class's will to power), it has lost its evidence, whatever it says. That is a [[debunking-argument|debunking argument]], and it bears on truth.",
                "And Christianity invites the test. It claims to be good news, 'life… more abundantly' (John 10:10), a tree known by its fruits (Matthew 7:16). Evidence that it diminishes life tests a claim the faith itself makes. Value and truth come apart for abstract theorems, not for a message whose content is that it heals.",
              ],
              quote: {
                text: "Formerly it was sought to prove that there was no God—now it is shown how the belief that a God existed could have originated, and by what means this belief gained authority and importance: in this way the counterproof that there is no God becomes unnecessary and superfluous.",
                who: "Friedrich Nietzsche",
                cite: "The Dawn of Day (Daybreak) §95 (1881; tr. J. M. Kennedy, 1911)",
              },
              thinkers: ["nietzsche"],
              cedes:
                "I'd concede if the origin of belief in God turned out to involve a process that tracks truth, not just fear and resentment.",
              see: [
                { id: "mor-convicts", why: "Origins argued the other way: whether a value's Christian pedigree settles anything about it." },
                { id: "hid-designed-faculty", why: "Objection II: a faculty can be natural, God-given, and still misfire." },
              ],
              children: [
                {
                  id: "mor-debunk-limits",
                  side: "theist",
                  label: "A genealogy can't debunk a belief with independent evidence",
                  gist: "Explaining how a belief arose defeats it only if nothing else supports it, and Christianity claims historical evidence, while Nietzsche's slave-revolt story fits the social history badly and the fruits test cuts the faith's way.",
                  body: [
                    "A genealogy defeats a belief only when its sole support is a process that does not track truth, as Guy Kahane argues (2011). Christian belief claims independent support, the case for the resurrection that ((evi-b-minimal|objection IV)) weighs, so the genealogist must win that argument, not step around it. And the story is guesswork: Wayne Meeks (1983) and Rodney Stark (1996) find the early churches drew a cross-section of the cities, not a resentful underclass.",
                    "The method also cuts both ways. If origins in fear debunk faith, origins in blind selection threaten every belief a naturalist holds, naturalism included, as ((nat-b-minds|objection III)) argues. Nor can the skeptic use it only when it suits: when Holland traced the care for the weak to the faith, ((mor-convicts|the reply)) called that the [[genetic-fallacy|genetic fallacy]], and here an origin is supposed to refute. As for fruits, a religious upbringing predicts better mental health in young adults (Chen and VanderWeele, 2018), and the Global Flourishing Study links service attendance to flourishing across twenty-two countries (2025).",
                  ],
                  thinkers: [],
                  cedes:
                    "I'd concede if the historical case for the resurrection collapsed, leaving fear and resentment as the faith's only support.",
                  see: [
                    { id: "nat-b-minds", why: "Plantinga's EAAN: debunking by origins can cut against naturalism too." },
                    { id: "mor-convicts", why: "Where the skeptic calls an argument from origins the genetic fallacy." },
                    { id: "mor-debt", why: "The skeptic's caution about observational data like these, in the guilt prong." },
                  ],
                  sources: [
                    { title: "Evolutionary Debunking Arguments", by: "Guy Kahane", year: "2011", note: "Noûs 45." },
                    { title: "The First Urban Christians", by: "Wayne A. Meeks", year: "1983" },
                    { title: "The Rise of Christianity", by: "Rodney Stark", year: "1996" },
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
    title: "No judge, no wrath, and still love",
    body: [
      "Spinoza removes the judge, not the stakes. 'Strictly speaking, God does not love or hate anyone' (*Ethics* V P17 Cor.), so there is no wrath to appease. But reward and punishment survive on the inside: 'the highest reward of the Divine law is the law itself, namely, to know God and to love Him', and its penalty is 'the absence of these things, and being in bondage to the flesh' (*Theological-Political Treatise* ch. 4). Heaven is understanding, hell is bondage, and both are now. That is closer to ((mor-chosen-hell|Aquinas's hell)) than either side admits: a penalty that is simply the disorder itself, lasting as long as it does, minus the free refusal and the endless pain.",
      "He even grants religious fear its use. Repentance is no virtue (IV P54), yet since few live by reason, humility, repentance, hope and fear do more good than harm, and no wonder the prophets, 'who consulted the good, not of a few, but of all', commended them (IV P54 Schol.). Fear is a crutch, not a crime: a harm only when it is mistaken for walking.",
      "Where he parts from {{nietzsche}}, who hailed him in 1881 as a precursor, is love: 'God, in so far as he loves himself, loves man' (V P36 Cor.), in the [[amor-dei-intellectualis|intellectual love]] where our love of God and God's love of us are one. So the Spinozist's quarrel is that Christianity gives true love false reasons, fear where understanding should be. The theist answers that understanding comes to few, and the least of these cannot wait for it. The Spinozist answers that the majority Christian picture is harder on the weak: a narrow gate that few find (Matthew 7:13–14), a *massa damnata*, unbaptized infants punished, however mildly (*Enchiridion* 93). Spinoza's 'perishing' is no torment, and his commonwealth exists 'to free every man from fear' (*Theological-Political Treatise* ch. 20).",
    ],
    quote: {
      text: "Blessedness is not the reward of virtue, but virtue itself; neither do we rejoice therein, because we control our lusts, but, contrariwise, because we rejoice therein, we are able to control our lusts.",
      who: "Baruch Spinoza",
      cite: "Ethics V P42 (1677; tr. R. H. M. Elwes)",
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
    {
      title: "On the Genealogy of Morality",
      by: "Friedrich Nietzsche",
      year: "1887",
      url: "https://www.gutenberg.org/ebooks/52319",
      note: "Guilt from debt, the ascetic priest, ressentiment: the source of two of the three charges.",
    },
    {
      title: "Heaven and Hell: A History of the Afterlife",
      by: "Bart D. Ehrman",
      year: "2020",
      note: "A critical historian traces how the idea of eternal torment took shape.",
    },
    {
      title: "Ethics, Parts IV–V",
      by: "Baruch Spinoza",
      year: "1677",
      url: "https://www.gutenberg.org/ebooks/3800",
      note: "Human bondage, repentance and pity, love that answers hatred, blessedness as virtue itself.",
    },
    {
      title: "Hell: The Logic of Damnation",
      by: "Jerry L. Walls",
      year: "1992",
      note: "The philosophical case for a freely chosen hell.",
    },
    {
      title: "That All Shall Be Saved",
      by: "David Bentley Hart",
      year: "2019",
      note: "A classical theist's case that endless hell is incompatible with a good God.",
    },
    {
      title: "Dominion: How the Christian Revolution Remade the World",
      by: "Tom Holland",
      year: "2019",
      note: "The history behind the counter's sting: care for the weak as a Christian inheritance.",
    },
  ],
};

export default morals;
