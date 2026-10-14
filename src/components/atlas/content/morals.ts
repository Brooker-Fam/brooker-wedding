import type { Objection } from "../types";

/* Objection V, the moral picture. Three parts: hell for unbelief, guilt as
   control, and Nietzsche's charge of life-denial. Every quotation below was
   checked against a public-domain or published text: the KJV; Elwes's Spinoza
   (Ethics, Theologico-Political Treatise, Letter 78); Ludovici's and Samuel's
   Nietzsche, Kennedy's Daybreak; the English Dominican Summa (New Advent);
   Shaw's Enchiridion and Dods's City of God; the Ante-Nicene Fathers; Ross's
   Aristotle; Semple's Kant (1838); Newman (newmanreader.org); Melmoth's Pliny;
   Wensinck's Isaac of Nineveh (1923); Mill's Hamilton (1865); Flew (1950);
   Chesterton's Orthodoxy; Lewis's Problem of Pain and Great Divorce (Faded
   Page); Hume's second Enquiry; the Smalcald Articles (Triglot); Trent
   (Waterworth); Lateran IV (Schroeder); Florence (Tanner); vatican.va. */

const morals: Objection = {
  id: "morals",
  numeral: "V",
  short: "Morals",
  title: "The moral picture is wrong",
  objection:
    "Christianity threatens hell for holding the wrong beliefs and uses guilt to keep people in line, and Nietzsche charged that the whole faith says No to life.",
  counter:
    "Some New Testament scholars, Matthew Bates among them, argue that in the earliest Christian texts saving faith means loyalty to Jesus. Annihilationism (the lost are destroyed) and David Bentley Hart's universalism (everyone is finally saved) both drop eternal torment, though most evangelicals reject both. Nietzsche's charge is about whether the faith is good for us, which settles nothing about whether it is true, as skeptics rightly say of 'Christians are hypocrites'. The faith is built on God becoming flesh and on a bodily resurrection, and it is hard to see how that says No to life. And Tom Holland's book Dominion argues that the Objector's own care for the weak is a Christian inheritance, which Nietzsche himself said can't stand once the faith is gone.",
  dek: "((mor-holland|The historian Tom Holland replies)) that the conscience doing the judging was formed by Christianity in the first place. ((mor-convicts|The Objector answers)) that if so, hell for honest doubters and guilt used as control fail Christianity's own moral test.",
  question:
    "If a faith's picture of God looks cruel, is that evidence it is false, and whose conscience gets to say so?",

  prongs: [
    /* ───────────────────────── I. HELL ───────────────────────── */
    {
      id: "mor-hell",
      side: "skeptic",
      label: "Christianity's hell, endless torment for unbelief, is monstrous",
      gist: "Christianity has long taught that people who die without the right faith suffer forever, and no good being would do that to an honest doubter, or to anyone.",
      body: [
        "This is the tradition's own teaching. The Athanasian Creed makes the catholic faith the condition of escaping everlasting loss. {{augustine}} defended a literal, unending fire (*City of God* XXI). The Council of Florence taught in 1442 that pagans, Jews and heretics outside the Church 'will go into the everlasting fire which was prepared for the devil and his angels'. {{edwards}} preached in 1741 that God held his hearers over hell 'much as one holds a spider, or some loathsome insect over the fire'. {{russell}} found 'one very serious defect' in Christ's character, 'and that is that He believed in hell.'",
        "The test is belief, which most people pass or fail by accident of birth. The penalty never ends, though no finite life of wrongdoing could earn endless torment. {{aquinas}} stated the objection against himself, that punishments are 'a kind of medicine' and 'no medicine should be infinite' (*Summa Theologiae* I-II q.87 a.3). Fixing one problem leaves the other. A father who did this to his child would be called a monster, and calling it justice in God doesn't change what it is.",
      ],
      quote: {
        text: "Whosoever will be saved, before all things it is necessary that he hold the catholic faith; which faith except every one do keep whole and undefiled, without doubt he shall perish everlastingly.",
        who: "Athanasian Creed (Quicunque vult)",
        cite: "vv. 1–2 (c. 500; Book of Common Prayer tr.)",
      },
      thinkers: ["augustine", "edwards", "russell", "aquinas"],
      cedes:
        "This charge falls if the faith turns out not to teach endless torment for unbelief, or if its sentence tracks a person's real, chosen wrong and ends when the wrong does.",
      see: [
        { id: "hid-argument", why: "Objection II adds a God who withholds the evidence people would need in order to believe." },
        { id: "coh-c-nature", why: "Objection I asks whose standard of good we use to judge God, the old question from Plato's Euthyphro." },
      ],
      sources: [
        { title: "The Problem of Hell", by: "Jonathan L. Kvanvig", year: "1993", note: "The objection that endless punishment is out of all proportion to any sin, and the main replies, from a sympathetic critic." },
      ],
      children: [
        {
          id: "mor-chosen-hell",
          side: "theist",
          label: "Hell lasts because the damned will goes on refusing God",
          gist: "Aquinas held that hell punishes a will that turned from God and stays turned, so the punishment lasts as long as the turning does.",
          body: [
            "The complaint about an infinite sentence for a finite crime assumes the crime is over. {{aquinas}} denied that. On his account sin creates a debt of punishment by disturbing the right order between a person and God, and the debt lasts while the disturbance lasts (*Summa Theologiae* I-II q.87 a.3). A will that has turned away from God, its final good, and stays turned away is still committing the offense.",
            "No court matches a sentence to the length of the deed. 'Adultery or murder is committed in a moment', Aquinas notes, and neither is punished for a moment. Someone who makes sin his final aim 'has the will to sin, everlastingly', and death settles that choice. The pain matches the sin in severity, and only its length is endless. Aquinas added that God takes no delight in punishment for its own sake, and that endless punishment still warns the living.",
          ],
          quote: {
            text: "Wherefore so long as the disturbance of the order remains the debt of punishment must needs remain also.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I-II q.87 a.3 (tr. Fathers of the English Dominican Province)",
          },
          thinkers: ["aquinas"],
          cedes: "Evidence that the damned want out, and are kept in anyway, would sink this answer.",
          see: [
            { id: "hid-hidden-resistance", why: "Objection II argues the same way, that refusal can run deeper than anyone reports." },
            { id: "mor-locked-door", why: "The other classic version, in which the door stays open to the end." },
          ],
          sources: [
            { title: "Summa Theologiae I-II q.87 (On the Debt of Punishment)", by: "Thomas Aquinas", note: "Article 3 and the replies to objections 1–3." },
          ],
          children: [
            {
              id: "mor-fixed-will",
              side: "skeptic",
              label: "If death fixes the will, God keeps the damned locked in",
              gist: "Aquinas says the will is fixed at death and only God could heal it, so the damned stay because God declines to, even though they want out.",
              body: [
                "Aquinas's answer needs the refusal to belong to the damned person, and his own account makes that hard to keep. In the *Summa Contra Gentiles* (IV.92–95) he holds that the will is fixed in its last choice at death and can never turn again. So 'as long as the will refuses' means forever. His damned also repent, though only 'indirectly, inasmuch as they will suffer from the punishment inflicted on them for sin' (*Summa Theologiae* Suppl. q.98 a.2). They want out and are kept in.",
                "Aquinas also says who could change this. The ruined will, he writes, is irreparable only when 'considered in itself', and God has the power to repair it. If the damned stay damned, it is because God could heal them and doesn't. On this picture a refusal made at the last moment of a life is made permanent by someone else, and then punished for being permanent.",
              ],
              quote: {
                text: "Consequently if a sin destroys the principle of the order whereby man's will is subject to God, the disorder will be such as to be considered in itself, irreparable, although it is possible to repair it by the power of God.",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I-II q.87 a.3 (tr. Fathers of the English Dominican Province)",
              },
              thinkers: ["aquinas"],
              cedes:
                "This fails if hell's permanence comes from the damned alone, and not from a God who could heal the will and declines to.",
              see: [
                { id: "coh-b-classical", why: "Objection I's God who moves every will, here moving one toward hell and holding it there." },
                { id: "mor-universalism", why: "If God can repair any will, Hart asks why he would leave one unrepaired." },
              ],
            },
            {
              id: "mor-no-desert",
              side: "spinoza",
              label: "No one deserves hell, because no one chooses freely",
              gist: "Spinoza denied that anyone could have chosen otherwise, so people who turn from God may be unhappy, but they cannot deserve punishment from an angry God.",
              body: [
                "Aquinas's reply assumes a will that could have turned the other way, and Spinoza denied there is such a will. 'Men are mistaken in thinking themselves free', he wrote, because 'their opinion is made up of consciousness of their own actions, and ignorance of the causes by which they are conditioned' (*Ethics* II P35 Schol.). The will 'cannot be called a free cause, but only a necessary cause' (I P32). Without a free, uncaused refusal, nobody in hell earned being there.",
                "He told {{oldenburg|Henry Oldenburg}}, secretary of the Royal Society in London, the same thing in 1676. God cannot be angry, and people who sin from weakness are excusable, though excusable people can still be unhappy. When Scripture calls God a judge who passes sentence, it is 'speaking humanly', Spinoza wrote, because its purpose is to make people obedient. On his view a weak nature brings its own loss, the way a weak body does, and nobody adds a sentence to it.",
              ],
              quote: {
                text: "I fully admit that God cannot be angry, and that all things are done in accordance with His will; but I deny that all men ought, therefore, to be blessed—men may be excusable, and, nevertheless, be without blessedness and afflicted in many ways.",
                who: "Baruch Spinoza",
                cite: "Letter 78, to Oldenburg, 7 Feb. 1676 (tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza", "oldenburg"],
              cedes: "A choice that was uncaused and yet still the chooser's own would answer Spinoza here.",
              see: [
                { id: "coh-b-spinoza", why: "The same denial of free will removes Objection I's puzzle about foreknowledge." },
                { id: "coh-b-needslib", why: "Objection I warns that this way out leaves God unable to judge fairly." },
              ],
              children: [
                {
                  id: "mor-spinoza-few",
                  side: "theist",
                  label: "Aquinas's hell needs no uncaused choice and no angry God",
                  gist: "Aquinas never needed an uncaused choice, many secular philosophers think blame survives determinism, God's 'anger' is a figure of speech, and Spinoza's own letter says the excusable still perish.",
                  body: [
                    "Spinoza's determinism answers a hell Aquinas never taught. For Aquinas, God moves the will as its first cause, and the choice is still wholly the chooser's own, as ((coh-a-concur|Objection I argues)). Many secular philosophers think blame survives determinism, the view that every choice has prior causes. Harry Frankfurt argued (1969, 1971) that you are responsible when you act from the will you want to have, whatever caused it, and {{strawson}} (1962) found no need for an uncaused choice in resentment or gratitude.",
                    "Spinoza's letter grants the rest. A man 'who goes mad from the bite of a dog' is excusable and still put down, and whoever cannot govern his desires 'necessarily perishes' (Letter 78). That is close to Aquinas's hell, a ruin following from a nature turned from God. Nor is Aquinas's God angry. 'Anger and the like are attributed to God on account of a similitude of effect', he wrote, since punishing is what angry men do (*Summa Theologiae* I q.3 a.2 ad 2).",
                  ],
                  quote: {
                    text: "He who goes mad from the bite of a dog is excusable, yet he is rightly suffocated.",
                    who: "Baruch Spinoza",
                    cite: "Letter 78, to Oldenburg (1676; tr. R. H. M. Elwes)",
                  },
                  thinkers: ["aquinas", "strawson", "spinoza"],
                  cedes:
                    "If blame turned out to require a choice with no cause at all, or if Spinoza's 'perishing' were a penalty in all but name, this reply would fail.",
                  see: [
                    { id: "coh-b-needslib", why: "Objection I argues that a God who moves every will causes the sins he judges." },
                    { id: "mor-fixed-will", why: "If God moves the will, the Objector asks who keeps it fixed." },
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
          gist: "Lewis and Walls held that God never stops offering heaven, and the damned stay because they keep choosing themselves, so hell is God respecting their refusal.",
          body: [
            "A second answer keeps the door open forever. In *The Problem of Pain* (1940) {{lewis-cs}} wrote, 'I willingly believe that the damned are, in one sense, successful, rebels to the end; that the doors of hell are locked on the *inside*.' In *The Great Divorce* (1945) a bus runs from hell to heaven, and the damned may stay in heaven if they like. Almost none do, because staying means giving up a grievance. Lewis's guide sums it up: 'There are only two kinds of people in the end: those who say to God, “Thy will be done,” and those to whom God says, in the end, “*Thy* will be done.”'",
            "{{walls}} turned the picture into an argument in *Hell: The Logic of Damnation* (1992). Love does not force anyone, and a [[libertarian-freedom|freedom]] that could never finally say No would not be freedom. Walls means the strong kind of freedom, in which a person could have chosen otherwise. If God wants to be loved, he has to allow himself to be refused, and keep allowing it. On this view hell is God's respect for a refusal he never stops inviting back.",
          ],
          quote: {
            text: "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.",
            who: "Jesus, in the Book of Revelation",
            cite: "Revelation 3:20 (KJV)",
          },
          thinkers: ["lewis-cs", "walls"],
          cedes: "This answer turns into universalism if a door held open forever would in the end win every will.",
          see: [
            { id: "coh-b-needslib", why: "Walls needs the strong kind of free will, which Objection I says causes trouble for the Defender elsewhere." },
            { id: "mor-chosen-hell", why: "Aquinas's version, in which the will is fixed at death." },
          ],
          sources: [
            { title: "Hell: The Logic of Damnation", by: "Jerry L. Walls", year: "1992" },
            { title: "The Great Divorce", by: "C. S. Lewis", year: "1945" },
            { title: "The Problem of Pain", by: "C. S. Lewis", year: "1940", note: "Chapter 8, 'Hell'." },
          ],
          children: [
            {
              id: "mor-door-empties",
              side: "skeptic",
              label: "An open door, held open forever, empties hell",
              gist: "If God never stops inviting and the door never closes, a refusal is very unlikely to last forever, so this kind of hell slowly empties.",
              body: [
                "The open door is this view's strength and its problem. Suppose there is some chance, however small, that a person turns back, and the chance comes again and again without end. Then the odds that the person never turns fall to zero. {{talbott}} argues that no one could choose endless misery with fully open eyes, and John Kronen and Eric Reitan argue in *God's Final Victory* (2011) that a hell of free choice slides into ((mor-universalism|universalism)), the view that everyone is finally saved.",
                "Lewis's own bus runs every day. {{adams-marilyn-m}} asks a further question. Why would a loving God let immature, half-informed people set a course toward endless ruin at all? No loving parent lets a toddler keep choosing to play in traffic because the choice is his, and the shepherd in Jesus' parable goes looking for the lost sheep.",
              ],
              quote: {
                text: "What man of you, having an hundred sheep, if he lose one of them, doth not leave the ninety and nine in the wilderness, and go after that which is lost, until he find it?",
                who: "Jesus, in Luke's Gospel",
                cite: "Luke 15:4 (KJV)",
              },
              thinkers: ["talbott", "adams-marilyn-m", "lewis-cs"],
              cedes:
                "A will that hardened with every chance it was given would answer this, since endless time would then fix a refusal instead of wearing it down.",
              see: [
                { id: "hid-pursues", why: "Objection II argues that perfect love goes after the person who resists instead of waiting." },
              ],
              sources: [
                { title: "The Problem of Hell: A Problem of Evil for Christians", by: "Marilyn McCord Adams", year: "1993", note: "In Eleonore Stump, ed., Reasoned Faith." },
                { title: "God's Final Victory: A Comparative Philosophical Case for Universalism", by: "John Kronen and Eric Reitan", year: "2011" },
              ],
              children: [
                {
                  id: "mor-no-becomes-self",
                  side: "theist",
                  label: "A refusal repeated long enough becomes who the person is",
                  gist: "Choices shape character, so a refusal repeated for ages stops being something a person does and becomes what they are, leaving less and less of anyone to turn back.",
                  body: [
                    "The odds argument treats each chance as a fresh coin toss, unaffected by the last. Character doesn't work that way. {{aristotle}} said we 'become just by doing just acts', and that a man who has made himself unjust cannot stop being unjust just by wishing to. {{walls}} argues (1992) that a person can reach a settled, decisive evil, a self organized around refusing. {{swinburne}} argued in 1983 that by repeated choices a person can lose the ability to choose the good at all.",
                    "{{lewis-cs}} dramatized it in *The Great Divorce*, where a woman's grumbling habit may have swallowed her: 'The question is whether she is a grumbler, or only a grumble.' If a spark of the woman is left, the guide says, it can be brought back to life. If nothing is left, nobody remains to walk through the open door.",
                  ],
                  quote: {
                    text: "So, too, to the unjust and to the self-indulgent man it was open at the beginning not to become men of this kind … but now that they have become so it is not possible for them not to be so.",
                    who: "Aristotle",
                    cite: "Nicomachean Ethics III.5 (tr. W. D. Ross)",
                  },
                  thinkers: ["walls", "swinburne", "lewis-cs", "aristotle"],
                  cedes:
                    "If a refusal repeated for ages stayed as easy to reverse as the first one, so that time wore the will down instead of forming it, this answer would fail.",
                  see: [
                    { id: "hid-hidden-resistance", why: "Objection II argues that a will can be divided in ways its owner cannot see." },
                  ],
                  sources: [
                    { title: "A Theodicy of Heaven and Hell", by: "Richard Swinburne", year: "1983", note: "In Alfred J. Freddoso, ed., The Existence and Nature of God." },
                    { title: "The Great Divorce", by: "C. S. Lewis", year: "1945", note: "Chapter 9." },
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
          gist: "The Bible's words for the fate of the lost are death and destruction, so on this view they finally cease to exist instead of suffering forever.",
          body: [
            "Endless torment assumes the soul cannot die. That idea owes more to Plato than to the Bible, where God 'only hath immortality' (1 Timothy 6:16) and gives life as a gift. The Bible's words for the fate of the lost are words of destruction. John's Gospel says whoever believes 'should not perish' (3:16), Paul says 'the wages of sin is death' (Romans 6:23), and Jesus says God can destroy soul and body alike (Matthew 10:28).",
            "This view is called [[annihilationism|annihilationism]], or conditional immortality, and it holds that the lost are finally destroyed. {{fudge}} argued for it at length in *The Fire That Consumes* (1982), and {{stott}}, a leading evangelical, tentatively endorsed it in 1988. The fire consumes what it burns, and the punishment is everlasting because its result is permanent, 'everlasting destruction' (2 Thessalonians 1:9). On this reading judgment and loss are real, but nobody is kept alive in order to suffer.",
          ],
          quote: {
            text: "And fear not them which kill the body, but are not able to kill the soul: but rather fear him which is able to destroy both soul and body in hell.",
            who: "Jesus, in Matthew's Gospel",
            cite: "Matthew 10:28 (KJV)",
          },
          thinkers: ["fudge", "stott"],
          cedes:
            "This view fails if the 'everlasting punishment' of Matthew 25:46 can only mean conscious suffering without end.",
          see: [{ id: "mor-development", why: "Arnobius taught the same around 300, so this is no modern softening." }],
          sources: [
            { title: "The Fire That Consumes", by: "Edward William Fudge", year: "1982" },
            { title: "Evangelical Essentials: A Liberal-Evangelical Dialogue", by: "David L. Edwards with John Stott", year: "1988" },
          ],
          children: [
            {
              id: "mor-perish-belief",
              side: "skeptic",
              label: "Annihilation for unbelief still punishes the wrong belief",
              gist: "Destroying the unbeliever instead of tormenting him softens the penalty but keeps the test of belief, and Jesus' words make punishment as lasting as eternal life.",
              body: [
                "Annihilationism fixes one of the two problems in the ((mor-hell|original charge)), which objected both to the test (belief) and to the penalty. The honest doubter who dies unconvinced is no longer tortured, only erased. A court that executes people for their opinions instead of torturing them has become more merciful, but no more just.",
                "{{augustine}} answered the softeners of his day from the texts, starting with Matthew 25:46, where one word, 'eternal', describes both the punishment and the life: 'If both destinies are eternal, then we must either understand both as long-continued but at last terminating, or both as endless' (*City of God* XXI.23, tr. Marcus Dods). Revelation describes 'the smoke of their torment' rising 'for ever and ever', with 'no rest day nor night' (14:11). A punishment is something someone undergoes, so annihilationists have to read the plainest descriptions of conscious suffering as figures of speech.",
              ],
              quote: {
                text: "And these shall go away into everlasting punishment: but the righteous into life eternal.",
                who: "Jesus, in Matthew's Gospel",
                cite: "Matthew 25:46 (KJV)",
              },
              thinkers: ["augustine"],
              cedes:
                "If annihilation fell only on those who knowingly refused the good, never on an honest doubter, and the texts about lasting torment read naturally as lasting destruction, I would drop this.",
              see: [
                { id: "mor-allegiance", why: "How the Defender answers the complaint about the test of belief." },
              ],
            },
          ],
        },
        {
          id: "mor-universalism",
          side: "theist",
          label: "God's love finally restores every soul, so hell ends",
          gist: "On the oldest alternative to endless hell, God's love finally heals every soul, so hell is real and corrective, and it ends.",
          body: [
            "The oldest alternative to endless hell is [[apokatastasis|apokatastasis]], Greek for 'restoration', the belief that God will finally restore all things. {{origen}} taught it and {{gregory-of-nyssa}} hoped for every creature's return. {{isaac-of-nineveh}}, a seventh-century Syrian bishop and monk, wrote that 'even those who are scourged in Hell are tormented with the scourgings of love' (*Mystic Treatises* XXVII, tr. A. J. Wensinck). Paul supplies the texts: 'as in Adam all die, even so in Christ shall all be made alive' (1 Corinthians 15:22), and God means through Christ 'to reconcile all things unto himself' (Colossians 1:20).",
            "{{hart}} argues from God's nature in *That All Shall Be Saved* (2019). A God who creates from nothing, knowing that some creatures will suffer forever, wills that outcome as surely as anything else he wills, and if he is goodness itself he cannot will it. {{talbott}} adds that no one could choose endless misery with open eyes. On this view hell is real, and it is the fire of God's love, which purifies and then ends.",
          ],
          quote: {
            text: "And when all things shall be subdued unto him, then shall the Son also himself be subject unto him that put all things under him, that God may be all in all.",
            who: "Paul",
            cite: "1 Corinthians 15:28 (KJV)",
          },
          thinkers: ["origen", "gregory-of-nyssa", "isaac-of-nineveh", "hart", "talbott"],
          cedes:
            "If a creature could go on refusing its own good forever with full understanding, or if Scripture's 'everlasting' punishment could only mean punishment without end, this hope would fail.",
          see: [{ id: "mor-locked-door", why: "Talbott's argument is aimed at the locked-door hell." }],
          sources: [
            { title: "That All Shall Be Saved: Heaven, Hell, and Universal Salvation", by: "David Bentley Hart", year: "2019" },
          ],
          children: [
            {
              id: "mor-flew",
              side: "skeptic",
              label: "Every softening of hell concedes the objection",
              gist: "The church condemned universal salvation in 543 and taught endless punishment in 1215, so reviving it now means letting conscience overrule centuries of teaching.",
              body: [
                "The church weighed restoration and rejected it. In 543 the emperor Justinian's edict against Origen condemned anyone who 'says or thinks that the punishment of demons and of impious men is only temporary, and will one day have an end'. The Fourth Lateran Council in 1215 said the damned would receive 'eternal punishment with the devil'. Michael McClymond's history of Christian universalism, *The Devil's Redemption* (2018), finds it a minority current through the centuries, often esoteric and often condemned.",
                "{{flew}} named what happens to a claim that is revised every time it meets an objection: 'A fine brash hypothesis may thus be killed by inches, the death by a thousand qualifications' (1950). The doctrine of hell did not change because new texts turned up. It changed, the Objector argues, because consciences trained to find the old picture unworthy of a good God would no longer bear it. Each softening grants the objection's premise, that a good God would not do this.",
              ],
              quote: {
                text: "It is in vain, then, that some, indeed very many, make moan over the eternal punishment, and perpetual, unintermitted torments of the lost, and say they do not believe it shall be so; not, indeed, that they directly oppose themselves to Holy Scripture, but, at the suggestion of their own feelings, they soften down everything that seems hard, and give a milder turn to statements which they think are rather designed to terrify than to be received as literally true.",
                who: "Augustine",
                cite: "Enchiridion 112 (c. 421; tr. J. F. Shaw)",
              },
              thinkers: ["augustine", "flew"],
              cedes:
                "I'd give this up if the revisions could be shown to follow from the faith's own premises instead of from mine.",
              see: [
                { id: "evi-b-inerrancy", why: "Objection IV makes a similar move, dropping a doctrine the creeds never fixed." },
              ],
              sources: [
                { title: "The Devil's Redemption: A New History and Interpretation of Christian Universalism", by: "Michael J. McClymond", year: "2018" },
                { title: "Theology and Falsification", by: "Antony Flew", year: "1950" },
              ],
              children: [
                {
                  id: "mor-development",
                  side: "theist",
                  label: "Correcting doctrine from its own core is how doctrine grows",
                  gist: "Correcting a doctrine by the faith's central claim that God is love is how doctrine has always grown, as with slavery, and the early church already disagreed about hell.",
                  body: [
                    "Revising a doctrine can be faithful to it. {{newman}} argued in 1845 that a living idea changes as the church works out what its core implies. The church once tolerated slavery and now condemns it, by reading 'there is neither bond nor free' (Galatians 3:28) more faithfully, with no outside test. {{hart}}'s case for universal salvation starts from premises Aquinas shared, that God creates from nothing and is goodness itself.",
                    "The early church was divided on hell. Augustine reports that 'very many' in his day rejected endless torment, and Arnobius taught around 300 that the wicked are finally consumed. {{gregory-of-nyssa}} was never condemned, and the Second Council of Constantinople (553) condemned Origenist ideas he did not hold. The Greek [[aionios|aiōnios]], translated 'eternal', comes from *aiōn*, 'age', so 'eternal redemption' (Hebrews 9:12) is the lasting result of one act, and Sodom's 'eternal fire' (Jude 7) went out long ago.",
                  ],
                  quote: {
                    text: "It changes with them in order to remain the same. In a higher world it is otherwise, but here below to live is to change, and to be perfect is to have changed often.",
                    who: "John Henry Newman",
                    cite: "An Essay on the Development of Christian Doctrine, ch. 1, sect. 1, §7 (1845; 1878 ed.)",
                  },
                  thinkers: ["newman", "hart", "gregory-of-nyssa"],
                  cedes: "If these views could only be defended with a premise from outside the tradition, I'd grant the objection.",
                  see: [
                    { id: "mor-convicts", why: "The Objector's version of correcting from within, aimed at the whole moral picture." },
                    { id: "evi-b-core", why: "In Objection IV, correcting from the core meets its hardest case, the miracles themselves." },
                  ],
                  sources: [
                    { title: "An Essay on the Development of Christian Doctrine", by: "John Henry Newman", year: "1845", url: "https://www.newmanreader.org/works/development/" },
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
          gist: "The Gospels' word for faith mostly meant trust and loyalty, and Jesus judges people by what they did for the least, so 'hell for wrong belief' misreads the test.",
          body: [
            "The charge assumes the test is belief, but the Greek suggests otherwise. [[pistis|*Pistis*]], the word translated 'faith', meant above all trust and loyalty in the Roman world, keeping faith with someone, as Teresa Morgan shows in *Roman Faith and Christian Faith* (2015). {{bates}} argues that the gospel's 'faith' is best translated as allegiance to Jesus as king. Correct opinion alone saves no one, since even the devils believe, as James says.",
            "When Jesus describes the judgment in Matthew 25, the nations are sorted by whether they fed the hungry and visited the prisoner, and the saved are surprised to learn they had served him. Paul says Gentiles without the law show 'the work of the law written in their hearts' (Romans 2:15). On this reading a creed sums up a loyalty, and an honest doubter who loves justice may not be on the wrong side of it.",
          ],
          quote: {
            text: "Thou believest that there is one God; thou doest well: the devils also believe, and tremble.",
            who: "James",
            cite: "James 2:19 (KJV)",
          },
          thinkers: ["bates"],
          cedes:
            "If the Gospels and Paul made explicit assent to propositions the dividing line, instead of loyalty lived out, this reading would be wrong.",
          see: [
            { id: "hid-devils-believe", why: "The Objector uses the same verse in Objection II." },
            { id: "evi-a", why: "Objection IV asks what kind of belief faith requires, and on what evidence." },
          ],
          sources: [
            { title: "Salvation by Allegiance Alone", by: "Matthew W. Bates", year: "2017", note: "One influential proposal, contested in its strong form." },
            { title: "Roman Faith and Christian Faith", by: "Teresa Morgan", year: "2015" },
          ],
          children: [
            {
              id: "mor-works",
              side: "spinoza",
              label: "If deeds decide, belief in the resurrection can't be required",
              gist: "Spinoza judged faith by works alone and drew a conclusion the church rejects, that no belief about history, even the resurrection, can be required for salvation.",
              body: [
                "Spinoza judged faith by loyalty lived out, centuries before Bates. In the *Theological-Political Treatise* (1670, ch. 14) he reads James and John and concludes that faith is known only by works, whatever a person's doctrines. Faith needs only the beliefs obedience needs, chiefly that God exists and is served by justice and charity to one's neighbour. No belief about history makes his list.",
                "The church refuses the conclusion. Loyalty to a *risen* king brings the creed back in, because you cannot pledge loyalty to a Lord you don't believe rose. Scripture ties salvation to it: 'believe in thine heart that God hath raised him from the dead' (Romans 10:9), and there is 'none other name under heaven' (Acts 4:12). Which Lord a sincere person serves depends heavily on where they were born. Either deeds decide, and the resurrection is optional, as Spinoza said, or the creed decides, and the honest doubter is judged by belief after all.",
              ],
              quote: {
                text: "… we can only judge a man faithful or unfaithful by his works. If his works be good, he is faithful, however much his doctrines may differ from those of the rest of the faithful.",
                who: "Baruch Spinoza",
                cite: "Theological-Political Treatise, ch. 14 (1670; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes: "If loyalty to Jesus could be shown to need no belief that he rose, Spinoza's dilemma would fail.",
              see: [
                { id: "hid-demographics", why: "Objection II's map of how belief in God follows history and borders." },
                { id: "evi-b-minimal", why: "Loyalty to a risen king depends on Objection IV's case for the resurrection." },
                { id: "evi-b-spinoza", why: "Spinoza thought the Gospels' ethics survive their errors and their miracles do not." },
              ],
              children: [
                {
                  id: "mor-inclusivism",
                  side: "theist",
                  label: "Christ can save people who never knew his name",
                  gist: "Catholic teaching since 1964, echoed by many Protestants, holds that people who never met the gospel, even honest atheists, can be saved by Christ through the good they served.",
                  body: [
                    "Spinoza's either-or leaves out a third option, that Christ is the only Savior and still saves some who never knew his name. Justin Martyr wrote around 155 that 'those who lived reasonably are Christians, even though they have been thought atheists', naming Socrates and Heraclitus (*First Apology* 46). The Second Vatican Council made the hope official in 1964, extending it to those who 'have not yet arrived at an explicit knowledge of God' and try to live a good life (*Lumen Gentium* 16). A year later it added that the Holy Spirit offers everyone a share in Christ's death and rising 'in a manner known only to God' (*Gaudium et Spes* 22).",
                    "{{rahner}} called such people 'anonymous Christians'. In {{lewis-cs}}'s *The Last Battle* (1956), Aslan welcomes Emeth, who served the rival god Tash all his life. On [[inclusivism|inclusivism]], the view that Christ saves some who never heard of him, the resurrection is how the rescue was won, and knowing about it is no password.",
                  ],
                  quote: {
                    text: "Those also can attain to salvation who through no fault of their own do not know the Gospel of Christ or His Church, yet sincerely seek God and moved by grace strive by their deeds to do His will as it is known to them through the dictates of conscience.",
                    who: "Second Vatican Council",
                    cite: "Lumen Gentium 16 (1964)",
                  },
                  thinkers: ["rahner", "lewis-cs"],
                  cedes:
                    "This hope would not reach the informed doubter if the church taught that he counts as knowingly refusing Christ.",
                  see: [
                    { id: "hid-messengers", why: "In Objection II, God chose to be known through people, so belief spreads unevenly." },
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
                      label: "On Objection II's replies, a doubter who heard isn't innocent",
                      gist: "Either the doubter who heard and declined is to blame, as some replies in Objection II say, or he is blameless, which grants the hiddenness argument a key premise.",
                      body: [
                        "Inclusivism covers the villager who never heard. Does it cover the Objector, who heard the gospel, weighed it and said no? Two replies in Objection II say it doesn't. If {{moser}} is right, an unconvinced seeker is resisting God somewhere, and if {{calvin}} is right, every mind senses God and suppresses it. Either way the doubter who heard is to blame, and *Lumen Gentium* 14 shuts out whoever knows and refuses.",
                        "Other replies there spare him, but grant something in return. {{rea}} accepts honest unbelief and answers {{schellenberg}} on other grounds. {{plantinga}}'s sense of God ((hid-sensus|blames no one)) for a faculty damaged by inherited sin, and {{stump}}'s divided will ((hid-hidden-resistance|carries no blame)). Each concedes that [[nonresistant-nonbelief|some nonbelief is blameless]], the third premise of Schellenberg's hiddenness argument. The Defender must choose between a guilty doubter here and an innocent one there.",
                      ],
                      quote: {
                        text: "Whosoever, therefore, knowing that the Catholic Church was made necessary by Christ, would refuse to enter or to remain in it, could not be saved.",
                        who: "Second Vatican Council",
                        cite: "Lumen Gentium 14 (1964)",
                      },
                      thinkers: ["moser", "calvin", "rea", "schellenberg", "plantinga", "stump"],
                      cedes:
                        "If the Defender could call the informed doubter innocent here without granting, in Objection II, that some nonbelief is blameless, this dilemma would fail.",
                      see: [
                        { id: "hid-moser", why: "The willingness test that would make the informed doubter guilty." },
                        { id: "hid-sensus", why: "Calvin's claim that everyone suppresses a sense of God, and Plantinga's no-fault version, one for each side of the dilemma." },
                        { id: "hid-rea-love", why: "Rea grants that honest unbelief exists and answers Schellenberg on other grounds." },
                        { id: "hid-argument", why: "The premise the second option grants, that some nonbelief is nobody's fault." },
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
          gist: "God is not one moral agent among others with duties like ours, so charging him with a judge's broken duty misses, since 'good' said of God only resembles our meaning.",
          body: [
            "Calling hell 'monstrous' assumes God's goodness is a human judge's goodness on a larger scale, with the same duties. {{aquinas}} denied this. He held that words like 'good' apply to God by [[analogy-of-being|analogy]], naming something real in God in a way we only partly grasp. Such names, he wrote, 'belong properly to God, and more properly than they belong to creatures', and only our way of using them, borrowed from creatures, falls short (*Summa Theologiae* I q.13 a.3).",
            "{{davies}} draws the conclusion (2006). Duties bind members of a moral community who depend on one another and can wrong one another. The Creator of everything is not a fellow member with obligations to the others. He stands to creatures more as an author to characters than as a neighbour to neighbours. So charges framed as broken duties miss. God's goodness can still be judged, though not by a magistrate's rulebook.",
          ],
          quote: {
            text: "For my thoughts are not your thoughts, neither are your ways my ways, saith the LORD. For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.",
            who: "Isaiah",
            cite: "Isaiah 55:8–9 (KJV)",
          },
          thinkers: ["aquinas", "davies"],
          cedes: "This reply collapses if analogy leaves 'good' so thin that it could fit any act at all.",
          see: [
            { id: "coh-a-analogy", why: "Objection I's defense of speaking about God by analogy." },
            { id: "hid-rea-love", why: "Rea's parallel argument that divine love need not look like a parent's." },
            { id: "hid-skeptical-theism", why: "The other route, argued in Objection II, that God may have reasons we cannot see." },
          ],
          sources: [{ title: "The Reality of God and the Problem of Evil", by: "Brian Davies", year: "2006" }],
          children: [
            {
              id: "mor-mansel",
              side: "skeptic",
              label: "If God's goodness is unlike ours, calling him good says nothing",
              gist: "If 'good' said of God doesn't mean what it means of people, calling God good says nothing, and a mercy that allows endless torment isn't recognizable as mercy.",
              body: [
                "When the theologian Henry Mansel argued in 1858 that God's goodness may differ in kind from ours, {{mill}} replied that a word used of God must mean what it means of people, or calling God good is empty praise. Analogy doesn't escape the problem. If what 'good' signifies belongs to God properly, then mercy in God must be recognizable as mercy, and endless torment is not.",
                "Even {{hart}}, who defends Aquinas's picture of God, makes the same point. Analogy is not equivocation, he argues (equivocation means using one word in two unrelated senses), and a 'goodness' that permits eternal torment has stopped being analogous to anything we call good. Dropping duties doesn't help either. The charge was never about a broken contract. It is that endless torment is not what goodness, in any sense we can recognize, would do.",
              ],
              quote: {
                text: "I will call no being good, who is not what I mean when I apply that epithet to my fellow-creatures; and if such a being can sentence me to hell for not so calling him, to hell I will go.",
                who: "John Stuart Mill",
                cite: "An Examination of Sir William Hamilton's Philosophy (1865), ch. VII",
              },
              thinkers: ["mill", "hart"],
              cedes:
                "If some sense of 'good' were true of God, allowed endless torment, and still meant something I could recognize, I would concede.",
              see: [
                { id: "coh-a-dogstar", why: "Spinoza's version, in which a divine 'intellect' unlike ours would share only a name with ours, as the Dog Star shares one with a dog." },
                { id: "hid-love-emptied", why: "The same argument about 'love', in Objection II." },
                { id: "coh-a-univocal", why: "Scotus's case, in Objection I, that analogy needs a shared core of meaning." },
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
      gist: "Teach people they are guilty from birth and headed for judgment, and you produce fear and shame that only the church can relieve, which keeps them coming back.",
      body: [
        "This is a claim about effects, whatever priests intend. Tell a child she was born guilty, that she is watched, and that judgment is coming, and you will probably raise an anxious adult, with the institution holding the only release. A fragment attributed to Critias says the gods were invented so that wrongdoers would fear even their secret deeds, and Polybius admired Rome for keeping the masses in check with religious dread. {{spinoza}} wrote that despots 'mask the fear, which keeps them down, with the specious garb of religion' (*Theological-Political Treatise*, Preface).",
        "{{nietzsche}} described how it works. The [[ascetic-ideal|ascetic priest]], the preacher of self-denial, takes the sufferer's [[ressentiment|ressentiment]], resentment with no outlet, and turns it inward. {{freud}} made the sense of guilt civilization's central problem. The record adds compulsory yearly confession from 1215, the indulgence trade, scrupulosity (obsessive fear of sinning, now treated as a form of OCD), and abuse hidden by shame.",
      ],
      quote: {
        text: "“I suffer: it must be somebody's fault”—so thinks every sick sheep. But his herdsman, the ascetic priest, says to him, “Quite so, my sheep, it must be the fault of some one; but thou thyself art that some one, it is all the fault of thyself alone …”",
        who: "Friedrich Nietzsche",
        cite: "The Genealogy of Morals III §15 (1887; tr. H. B. Samuel, 1910)",
      },
      thinkers: ["nietzsche", "freud", "spinoza"],
      cedes:
        "Evidence that Christian communities are, on balance, less anxious and less ruled by shame than comparable secular ones would defeat this charge.",
      see: [
        { id: "hid-coercion-subtle", why: "Objection II argues that a judge in plain view turns goodness into prudence." },
      ],
      children: [
        {
          id: "mor-gospel",
          side: "theist",
          label: "The gospel announces that guilt is forgiven and finished",
          gist: "Christianity's message is that guilt is forgiven, 'no condemnation', and churches that used guilt as a weapon betrayed that message, as reformers inside the faith said at the time.",
          body: [
            "The charge blames the doctor for the disease. The turning point of Paul's letter to the Romans is 'no condemnation'. {{luther}}'s breakthrough was relief from terror, the discovery that God's righteousness is a gift, and in 1517 he attacked the indulgence trade from inside the church. Confession ends in absolution, words spoken aloud so a person can stop carrying the thing. Abuses don't abolish the right use, and the faith's own standards condemn them.",
            "The guilt-soaked self-examination that Nietzsche and Freud attacked is also a late Western development. The scholar {{stendahl|Krister Stendahl}} argued in 1963 that Paul had a 'robust conscience', and that anguished introspection came later, with Augustine and medieval penance. In a large study of American nurses, women who attended services more than once a week had much lower suicide rates (VanderWeele and colleagues, *JAMA Psychiatry*, 2016).",
          ],
          quote: {
            text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
            who: "Paul",
            cite: "Romans 8:1 (KJV)",
          },
          thinkers: ["luther", "stendahl"],
          cedes: "If guilt and fear rose instead of falling where the gospel is preached as forgiveness, this reply would fail.",
          see: [
            { id: "evi-b-wright", why: "Stendahl's Paul, with his 'robust conscience', appears again in Objection IV's resurrection case." },
          ],
          children: [
            {
              id: "mor-debt",
              side: "skeptic",
              label: "The gospel forgives a guilt the church assigned first",
              gist: "Christianity offers release from a guilt it assigns to everyone at birth, so 'no condemnation' depends on condemning everyone first, and the cure binds people to whoever announced the debt.",
              body: [
                "'No condemnation' skips a step. Who said we were condemned? {{augustine}}'s victory over Pelagius, confirmed at the Council of Carthage in 418, made every newborn guilty in Adam. Unbaptized infants, he concluded, receive 'the mildest punishment of all', but still punishment (*Enchiridion* 93). {{luther}} made the terror a method. The law's 'chief office', he wrote, is to 'reveal original sin with all its fruits', so that a person 'becomes terrified, is humbled, desponds, despairs' (*Smalcald Articles* III.2). {{nietzsche}} called the arrangement a 'stroke of genius'. A protection racket also offers relief from a danger it announced.",
                "The nurses study measured attending services, which is community more than doctrine, and it only observed people, so healthier, better-connected people may be likelier to go in the first place. On guilt itself, research on religious and spiritual struggle (Exline, Pargament and colleagues, 2014) links feeling punished or abandoned by God to depression and anxiety.",
              ],
              quote: {
                text: "… that stroke of genius called Christianity:—God personally immolating himself for the debt of man, God paying himself personally out of a pound of his own flesh, God as the one being who can deliver man from what man had become unable to deliver himself—the creditor playing scapegoat for his debtor, from love (can you believe it?), from love of his debtor!",
                who: "Friedrich Nietzsche",
                cite: "The Genealogy of Morals II §21 (1887; tr. H. B. Samuel, 1910)",
              },
              thinkers: ["augustine", "luther", "nietzsche"],
              cedes:
                "This charge loses its force if the doctrine of sin can be taught without telling anyone they are condemned before they have done anything.",
              children: [
                {
                  id: "mor-condition",
                  side: "theist",
                  label: "Original sin names a real flaw anyone can observe",
                  gist: "Original sin names a bent anyone can see, our drift toward selfishness and cruelty, so the condemnation the gospel lifts is one our own consciences already pronounce.",
                  body: [
                    "A protection racket needs the danger to be invented, and this danger is real. {{chesterton}} called [[original-sin|original sin]] the one Christian doctrine that can be proved, and the twentieth century supplied the evidence on a large scale. The doctrine mainly describes a condition, more than a guilt charged to infants. People are turned in on themselves and cannot will their way out, as Paul says: 'For the good that I would I do not: but the evil which I would not, that I do' (Romans 7:19).",
                    "Augustine's verdict on infants is one Western reading. The Eastern churches generally reject inherited guilt and speak of 'ancestral sin', meaning inherited mortality and disordered desire, with no debt in a newborn's name. Without Augustine's reading, what remains is a diagnosis most honest people recognize in themselves, the gap between the good they see and the good they do. The gospel names that gap and offers a way across it.",
                  ],
                  quote: {
                    text: "Certain new theologians dispute original sin, which is the only part of Christian theology which can really be proved.",
                    who: "G. K. Chesterton",
                    cite: "Orthodoxy (1908), ch. 2",
                  },
                  thinkers: ["chesterton"],
                  cedes: "If the moral disorder the doctrine names turned out to be shallow, rare, or easy to will away, this defense would fail.",
                  children: [
                    {
                      id: "mor-repent",
                      side: "spinoza",
                      label: "The flaw is part of nature and calls for understanding",
                      gist: "Spinoza grants the drift toward selfishness but treats it as nature, so Chesterton proves the flaw without proving guilt before God, and the remedy is understanding its causes.",
                      body: [
                        "Chesterton's 'proved' slides between two claims. Selfishness can be observed every day, while guilt before God from birth cannot be observed at all. Spinoza accepts the first and drops the second. 'Nothing comes to pass in nature, which can be set down to a flaw therein' (*Ethics* III Preface), so he studies human desires 'as though I were concerned with lines, planes, and solids'. He does not think we are innocent, and he titled Part IV 'Of Human Bondage'. On his view a flaw is a fact to be understood, and the Eastern churches' 'ancestral sin' has already given up the idea of a debt.",
                        "Remorse, he argued, doubles the damage, because the one who repents is overcome first by a bad desire and then by pain (IV P54). The remedy is understanding, since a passion 'ceases to be a passion, as soon as we form a clear and distinct idea thereof' (V P3). The aim is to act better now, from understanding, without adding pain about the past.",
                      ],
                      quote: {
                        text: "Repentance is not a virtue, or does not arise from reason; but he who repents of an action is doubly wretched or infirm.",
                        who: "Baruch Spinoza",
                        cite: "Ethics IV P54 (1677; tr. R. H. M. Elwes)",
                      },
                      thinkers: ["spinoza", "chesterton"],
                      cedes:
                        "Spinoza would be wrong here if remorse helps people repair harms better than a clear understanding of their causes does.",
                      see: [
                        { id: "coh-b-spinoza", why: "The determinism behind Spinoza's view of remorse." },
                        { id: "mor-holland-spinoza", why: "The same Ethics on answering hatred with love." },
                      ],
                      children: [
                        {
                          id: "mor-strawson",
                          side: "theist",
                          label: "The person you wronged is owed your sorrow",
                          gist: "Spinoza offers courage and generosity in place of remorse, but the person you wronged is owed your sorrow as well as repairs, and Spinoza admits repentance helps most people.",
                          body: [
                            "Spinoza's own note on this proposition says repentance does most people more good than harm, because 'the crowd plays the tyrant, when it is not in fear' (IV P54 Schol.). On his view understanding is for the few and fear governs the rest, which is the guilt charge's own complaint turned back on him.",
                            "Remorse is also more than self-punishment. Spinoza offers courage and generosity (III P59 Schol.), love that answers hatred (IV P46), and the wish to repair. Those look forward, and the person wronged is owed a look back. Nick Smith argues in *I Was Wrong* (2008) that an apology without sorrow is defective. {{strawson}} showed in 1962 that guilt and resentment are [[reactive-attitudes|reactive attitudes]], the feelings by which we treat one another as responsible people, and {{williams-bernard}} found regret fitting even where there is no fault.",
                          ],
                          quote: {
                            text: "As men seldom live under the guidance of reason, these two emotions, namely, Humility and Repentance, as also Hope and Fear, bring more good than harm; hence, as we must sin, we had better sin in that direction.",
                            who: "Baruch Spinoza",
                            cite: "Ethics IV P54 Schol. (1677; tr. R. H. M. Elwes)",
                          },
                          thinkers: ["spinoza", "strawson", "williams-bernard"],
                          cedes:
                            "If the people we wrong were as well served by our clear understanding as by our sorrow, this reply would fail.",
                          see: [
                            { id: "mor-reparation", why: "Swinburne's account of what the wronged are owed, which is repentance, apology and reparation." },
                            { id: "coh-b-spinoza", why: "Strawson's essay also answers the determinism Spinoza argues for." },
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
              gist: "Kant argued that guilt is the most personal of debts, so punishing an innocent man instead of the guilty leaves the guilt untouched and adds a second injustice.",
              body: [
                "'No condemnation' depends on a transfer, in which Christ bears the penalty and the guilty go free. {{kant}} saw the problem in 1793. Anyone can pay a money debt, and the creditor doesn't care who settles it. Guilt for wrongdoing is different, Kant argued, because only the person who did wrong can bear it, however willing an innocent person may be to take it on (*Religion within the Boundaries of Mere Reason*, 6:72). Ezekiel said much the same: 'The son shall not bear the iniquity of the father' (Ezekiel 18:20).",
                "The Italian theologian Faustus Socinus made the same argument in 1594. If a debt is forgiven, nothing is owed, and if it is paid, it was not forgiven. A judge who punishes an innocent volunteer and releases the guilty has failed at justice twice. [[penal-substitution|Penal substitution]], the view that Christ took the punishment we deserved, asks us to call that love.",
              ],
              quote: {
                text: "… the obligation thence arising is not transferable like a money debt (where it is indifferent to the creditor whether his debtor or some one else discharge the bond) … but is, on the contrary, the most exclusively personal that can be conceived, viz. a debt of sins …",
                who: "Immanuel Kant",
                cite: "Religion within the Boundary of Pure Reason, Book II (1793; tr. J. W. Semple, 1838; Ak. 6:72)",
              },
              thinkers: ["kant"],
              cedes:
                "Kant's objection misses if atonement can be understood without any transfer of guilt or punishment from the guilty to the innocent.",
              see: [{ id: "mor-debt", why: "The other half of the guilt charge, that the debt is assigned before it is forgiven." }],
              children: [
                {
                  id: "mor-reparation",
                  side: "theist",
                  label: "Atonement needn't mean punishing an innocent in our place",
                  gist: "Punishing an innocent in our place is only one view of the cross, and on Swinburne's view Christ offers a gift we must each take up, which grants Kant's point.",
                  body: [
                    "Kant and Socinus hit one theory of the cross, [[penal-substitution|penal substitution]]. No creed shared by all churches defines it, though Reformed confessions such as Westminster (VIII.5) teach it. {{swinburne}}'s *Responsibility and Atonement* (1989) accepts Kant's premise that guilt cannot be transferred. What a wrongdoer owes is repentance, apology, reparation and penance. Christ's life and death are a perfect offering the guilty can take up and present as their own. It works like a parent giving a child the money for a neighbour's broken window, which the child must still carry next door herself.",
                    "Gustaf Aulén's *Christus Victor* (1931) recovered the early church's picture of the cross as victory over sin and death. {{stump}}'s *Atonement* (2018) reads it as God's way to union with people alienated from themselves. On none of these views must God see blood before he can forgive.",
                  ],
                  quote: {
                    text: "He properly atones for an offense who offers something which the offended one loves equally, or even more than he detested the offense. But by suffering out of love and obedience, Christ gave more to God than was required to compensate for the offense of the whole human race.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae III q.48 a.2 (tr. Fathers of the English Dominican Province)",
                  },
                  thinkers: ["swinburne", "stump", "aquinas"],
                  cedes: "If every serious account of the atonement turned out to need a transfer of guilt after all, Kant's objection would stand.",
                  sources: [
                    { title: "Responsibility and Atonement", by: "Richard Swinburne", year: "1989" },
                    { title: "Heidelberg Catechism", by: "Zacharias Ursinus and others", year: "1563", note: "Questions 12–18 and 40 teach penal substitution." },
                    { title: "Christus Victor", by: "Gustaf Aulén", year: "1931" },
                    { title: "Atonement", by: "Eleonore Stump", year: "2018" },
                  ],
                  children: [
                    {
                      id: "mor-forgive-freely",
                      side: "skeptic",
                      label: "A God who commands free forgiveness needs no offering",
                      gist: "If what we owe is repentance, a God who receives it has all a forgiver can ask, so why require an offering when Jesus tells us to forgive freely?",
                      body: [
                        "This moves the problem without removing it. If a wrongdoer owes repentance, a God who receives it has everything a forgiver can ask. Why must he also require an offering, and one only his own Son can make, before he forgives? Socinus's point survives, since whatever is paid was not freely forgiven. Jesus tells Peter to forgive without limit (Matthew 18:22), and the father in the parable runs to the prodigal and 'fell on his neck, and kissed him' before the son has finished his speech (Luke 15:20–22).",
                        "Philip Quinn, a philosopher, argued this in 1994 in a volume honouring Swinburne. A victim who would forgive only after a third party handed over a perfect gift would seem less gracious. And a God who demands the offering and supplies it is still a creditor who must be paid, only paid by himself, which is {{nietzsche}}'s 'stroke of genius' again.",
                      ],
                      quote: {
                        text: "I say not unto thee, Until seven times: but, Until seventy times seven.",
                        who: "Jesus",
                        cite: "Matthew 18:22 (KJV)",
                      },
                      thinkers: ["nietzsche"],
                      cedes:
                        "If a forgiver who first required a perfect offering could be shown to love more than one who forgave on repentance alone, I'd withdraw this.",
                      see: [
                        { id: "mor-debt", why: "Nietzsche's creditor who pays himself, earlier in this part." },
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
      gist: "Nietzsche charged that Christianity moves value to another world, calls pride, sex and strength sins, and so makes God the enemy of the life he supposedly made.",
      body: [
        "{{nietzsche}}'s charge is about where the faith points. In *The Antichrist* (1888) he says the Christian God declared war on life. In *Twilight of the Idols* (1889) he says the church fights the passions by cutting them out instead of refining them, and that 'to attack the passions at their roots, means attacking life itself at its source'. Its [[ascetic-ideal|ascetic ideal]], holiness through self-denial, is in his view a will to nothingness. His own test is [[amor-fati|amor fati]], Latin for 'love of fate', which means wishing 'nothing to be different, either in front of him or behind him, or for all eternity' (*Ecce Homo*).",
        "The church's practice gives him evidence. {{hume}} moved celibacy, fasting, penance and 'the whole train of monkish virtues' into 'the catalogue of vices'. The Council of Trent in 1563 ranked virginity above marriage. And in the *Summa*'s Supplement, compiled from {{aquinas}}'s early writings after his death, the blessed see the sufferings of the damned 'in order that the happiness of the saints may be more delightful to them' (Suppl. q.94 a.1).",
      ],
      quote: {
        text: "God degenerated into the contradiction of life, instead of being its transfiguration and eternal Yea! With God war is declared on life, nature, and the will to life!",
        who: "Friedrich Nietzsche",
        cite: "The Antichrist §18 (1888; tr. A. M. Ludovici, 1911)",
      },
      thinkers: ["nietzsche", "hume", "aquinas"],
      cedes:
        "Nietzsche's charge fails if the saints, and the church at its best, turn out to love this world more than its critics do.",
      see: [{ id: "mor-chosen-hell", why: "Aquinas's followers defend hell's justice, and the same tradition supplies the heaven Nietzsche quotes." }],
      children: [
        {
          id: "mor-body",
          side: "theist",
          label: "A God who became flesh and rose bodily says Yes to the body",
          gist: "Christianity says God called matter 'very good', became flesh and rose in a body, and it honours marriage, work, farmers and parents, which is a Yes to this world.",
          body: [
            "Nietzsche's charge fits the Gnostics, who despised matter, better than the church that fought them. God calls what he made 'very good' (Genesis 1:31), and 'the Word was made flesh' (John 1:14). Paul insists on a *bodily* resurrection, and {{irenaeus}}, around 180, called a living human being the glory of God. The hope is this world healed, as {{wright-nt}} argues, and the central act of worship is a meal.",
            "{{taylor-charles}} traces the modern sense that marriage and work are where a good life is lived to the Reformers' rejection of celibacy as the higher calling. Trent made marriage a sacrament, and Rome canonized Isidore the Farmer in 1622 and the married Louis and Zélie Martin in 2015. As for *amor fati*, wanting every atrocity to happen again looks more like resignation than a Yes. {{chesterton}} loved the world the way Rome's first citizens loved Rome: 'Men did not love Rome because she was great. She was great because they had loved her.'",
          ],
          quote: {
            text: "For the glory of God is a living man; and the life of man consists in beholding God.",
            who: "Irenaeus",
            cite: "Against Heresies IV.20.7 (c. 180; Ante-Nicene Fathers tr.)",
          },
          thinkers: ["irenaeus", "wright-nt", "taylor-charles", "chesterton"],
          cedes:
            "If the tradition's saints and teachers, read as a whole, treated the body as a prison instead of a temple, this reply would fail.",
          see: [
            { id: "evi-b-body", why: "In Objection IV, the first witnesses insisted on a body and an empty tomb." },
            { id: "mor-holland", why: "The same pattern, in which a value the critic holds turns out to have Christian roots." },
          ],
          sources: [
            { title: "Sources of the Self: The Making of the Modern Identity", by: "Charles Taylor", year: "1989", note: "Part III, 'The Affirmation of Ordinary Life'." },
            { title: "Surprised by Hope", by: "N. T. Wright", year: "2008" },
          ],
          children: [
            {
              id: "mor-beyond",
              side: "skeptic",
              label: "A risen body still moves life's center to the beyond",
              gist: "Resurrection honours the body only in the next world, so the faith still places life's meaning in a beyond, and Christian praise of ordinary life came some fifteen centuries late.",
              body: [
                "Nietzsche had the resurrection in view and called it the problem. Paul, he wrote, 'transferred the centre of gravity of the whole of that great life, to a place *behind* this life' (*The Antichrist* §42). A body raised there is still raised *there*. Paul himself says, 'If in this life only we have hope in Christ, we are of all men most miserable' (1 Corinthians 15:19). Without the beyond, on Paul's own account, this life is a loss.",
                "The risen body is also unlike the one we have. In the resurrection no one marries (Mark 12:25), and Paul wished everyone were unmarried like him (1 Corinthians 7:7–8). The Council of Trent declared it 'better and more blessed to remain in virginity, or in celibacy, than to be united in matrimony' (Session 24, canon 10, 1563). The 'affirmation of ordinary life' that {{taylor-charles}} credits to the Reformers came some 1,500 years in, against a tradition that had ranked virginity higher all along.",
              ],
              quote: {
                text: "When the centre of gravity of life is laid, not in life, but in a beyond—in nonentity,—life is utterly robbed of its balance.",
                who: "Friedrich Nietzsche",
                cite: "The Antichrist §43 (1888; tr. A. M. Ludovici, 1911)",
              },
              thinkers: ["nietzsche", "paul", "taylor-charles"],
              cedes:
                "This would fail if the hope for the body made this life, its marriages, work and pleasures, matter more, so that it is no waiting room.",
              see: [
                { id: "evi-b-flesh", why: "In Objection IV, Paul's risen body is heavenly, which is different from this flesh revived." },
              ],
            },
          ],
        },
        {
          id: "mor-holland",
          side: "theist",
          label: "The Objector's care for the weak is a Christian inheritance",
          gist: "Holland argues that the belief that the weak matter most came from Christianity, and Nietzsche's charge scorns it, so an objector who keeps that care can't borrow the charge.",
          body: [
            "Whoever presses Nietzsche's charge is judging with borrowed tools. {{holland}}'s *Dominion* (2019) argues that the West's deepest instincts, that the weak have claims on the strong and every person has equal dignity, are Christian in origin, and now pass for common sense. {{celsus}}, a second-century pagan critic, saw the novelty at once.",
            "{{nietzsche}} attacked these instincts. Pity, he wrote, 'preserves that which is ripe for death' (*The Antichrist* §7), and raising up the lowly was 'the revolt of the slaves' in morals (*Genealogy* I §7). He also warned: 'When we renounce the Christian faith, we abandon all right to Christian morality' (*Twilight of the Idols*, 'Skirmishes' §5).",
            "Nicholas Wolterstorff argues that *equal* worth, for the infant and the severely impaired as for the genius, needs something like being loved by God. The legal philosopher Jeremy Waldron doubts that basic equality can be defended 'apart from some religious foundation' (2002). An objector who keeps the care for the weak cannot also use Nietzsche's charge, which comes with contempt for them.",
          ],
          quote: {
            text: "Every one, they say, who is a sinner, who is devoid of understanding, who is a child, and, to speak generally, whoever is unfortunate, him will the kingdom of God receive.",
            who: "Celsus, quoted by Origen",
            cite: "Contra Celsum III.59 (c. 248; Ante-Nicene Fathers tr.)",
          },
          thinkers: ["holland", "celsus", "nietzsche"],
          cedes:
            "If Nietzsche's charge could be kept whole without his contempt for the weak, or if equal regard for the weak had arisen as fully in a culture Christianity never touched, this argument would fail.",
          see: [
            { id: "mor-hell", why: "If the Objector's conscience is Christian, the standard used to judge hell came from the faith being judged." },
            { id: "mor-guilt", why: "The same point applies to judging guilt as a means of control." },
            { id: "mor-mansel", why: "Mill's 'what I mean when I apply that epithet' is the inheritance in question." },
          ],
          sources: [
            { title: "Dominion: How the Christian Revolution Remade the World", by: "Tom Holland", year: "2019" },
            { title: "Justice: Rights and Wrongs", by: "Nicholas Wolterstorff", year: "2008" },
            { title: "God, Locke, and Equality", by: "Jeremy Waldron", year: "2002" },
          ],
          children: [
            {
              id: "mor-convicts",
              side: "skeptic",
              label: "Then Christianity fails its own moral test",
              gist: "If the Objector's care for the weak is Christian, the objection becomes criticism from inside, and secular countries that kept the care suggest it can outlive the faith.",
              body: [
                "Granting the inheritance makes the objection stronger. Nietzsche's charge can be kept without his contempt, since the No to life lies in the ascetic ideal and the deferred heaven, as ((mor-holland-spinoza|Spinoza)) shows. If care for the victim is the faith's deepest value, hell for honest doubters and guilt used as control fail its own test.",
                "Equal worth may not need God either. {{rawls}} grounds it in a 'range property', a capacity everyone above a threshold has equally (1971). Below it, Eva Kittay finds dignity in relations of care (1999), and {{wielenberg}} holds that basic moral facts need no foundation. Judging a value by its origin is the [[genetic-fallacy|genetic fallacy]], in either direction.",
                "Secular Denmark and Sweden have widened their care for the weak (Zuckerman, 2008). Robert H. Nelson calls that secular Lutheranism, but then no record could test the claim.",
              ],
              quote: {
                text: "… in thus wise did Christianity go to ruin as a dogma, through its own morality; in thus wise must Christianity go again to ruin to-day as a morality—we are standing on the threshold of this event.",
                who: "Friedrich Nietzsche",
                cite: "The Genealogy of Morals III §27 (1887; tr. H. B. Samuel, 1910)",
              },
              thinkers: ["nietzsche", "rawls", "wielenberg"],
              cedes: "If secular societies' care for the weak decayed as their Christian memory faded, I'd concede the point.",
              see: [
                { id: "mor-development", why: "The Defender's own version of correcting the faith from its core." },
                { id: "coh-c-brute", why: "Wielenberg's case, in Objection I, that moral facts need no foundation." },
              ],
              sources: [
                { title: "A Theory of Justice", by: "John Rawls", year: "1971", note: "Section 77, on the basis of equality." },
                { title: "Society without God", by: "Phil Zuckerman", year: "2008" },
                { title: "Love's Labor: Essays on Women, Equality, and Dependency", by: "Eva Feder Kittay", year: "1999" },
                { title: "Lutheranism and the Nordic Spirit of Social Democracy", by: "Robert H. Nelson", year: "2017", note: "The view this move answers, that Nordic welfare is secularized Lutheranism." },
              ],
            },
            {
              id: "mor-holland-spinoza",
              side: "spinoza",
              label: "Reason alone teaches love that answers hatred",
              gist: "Spinoza argued from reason, without a personal God or a cross, that we should repay hatred with love and help the suffering, so this ethic can stand on another foundation.",
              body: [
                "Holland assumes the ethic needs its Christian root, but Spinoza grew it from another. Whoever lives by reason, he wrote, 'endeavours, as far as possible, to render back love, or kindness, for other men's hatred' (*Ethics* IV P46), because hatred 'is increased by being reciprocated, and can on the other hand be destroyed by love' (III P43). The good a virtuous person wants for himself he wants for others, 'and so much the more, in proportion as he has a greater knowledge of God' (IV P37).",
                "Spinoza dropped pity, which he counted a sad passion, but kept the deed. Reason itself tells us to free others from misery, and whoever is moved to help others 'neither by reason nor by compassion, is rightly styled inhuman' (IV P50 Schol.). None of this depends on a cross or a final judgment.",
              ],
              quote: {
                text: "He who chooses to avenge wrongs with hatred is assuredly wretched. But he, who strives to conquer hatred with love, fights his battle in joy and confidence.",
                who: "Baruch Spinoza",
                cite: "Ethics IV P46 Schol. (1677; tr. R. H. M. Elwes)",
              },
              thinkers: ["spinoza"],
              cedes:
                "If the propositions of Part IV needed a premise about the worth of the weak that reason alone cannot supply, Spinoza's ethic would not stand on its own.",
              see: [{ id: "mor-repent", why: "The same Spinoza, on remorse." }],
              children: [
                {
                  id: "mor-pity",
                  side: "theist",
                  label: "Spinoza keeps the help but not the claim of the helpless",
                  gist: "Spinoza bases help on usefulness and blessedness on ability, so infants and the impaired have no claim of their own, while Christianity grounds their claim in God's love.",
                  body: [
                    "On a different foundation the ethic takes a different shape. Spinoza grounds help in shared usefulness, since 'to man there is nothing more useful than man' (IV P18 Schol.), and good is 'that which we certainly know to be useful to us' (IV Def. 1). A claim grounded that way depends on what the person reasoning finds useful. Beasts, 'whose nature is different from our own', fall outside it (IV P37 Schol. 1). Augustine and Aquinas said much the same about animals. The principle at work is that concern follows likeness.",
                    "Blessedness follows ability too. It grows with a body 'capable of the greatest number of activities' (V P39), while an infant's mind is 'scarcely conscious of itself, or of God', and the man who cannot govern his desires 'necessarily perishes' (Letter 78). The Christian claim is that the helpless matter because God loves them, and Jesus tells his host to invite 'the poor, the maimed, the lame, the blind', because 'they cannot recompense thee' (Luke 14:13–14).",
                  ],
                  quote: {
                    text: "Pity, in a man who lives under the guidance of reason, is in itself bad and useless.",
                    who: "Baruch Spinoza",
                    cite: "Ethics IV P50 (1677; tr. R. H. M. Elwes)",
                  },
                  thinkers: ["spinoza"],
                  cedes:
                    "Spinoza would answer this if his reason gave the helpless, who take no part in anyone's reasoning, the same claim on us as the wise.",
                  see: [
                    { id: "hid-spinoza-my-god", why: "Objection II meets the same God, who strictly speaking loves no one." },
                    { id: "coh-c-person", why: "Objection I's general case that obligation needs someone who makes the claim." },
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
          gist: "The life-denial charge asks whether Christianity is good for us, and Nietzsche says it would stand even if God were proved, so it says nothing about whether God exists.",
          body: [
            "Nietzsche himself treats this charge as one about value. He judged the Christian God 'not as an error, but as a *crime against life*' (*The Antichrist* §47), and by his own account a proof of God would not change that verdict. A charge built to survive a proof of God cannot count as evidence against God.",
            "Skeptics apply the same rule elsewhere. 'Christians are hypocrites, so Christianity is false' is rightly dismissed, because how believers behave is one question and whether their beliefs are true is another. 'Atheist regimes were cruel, so atheism is false' fails for the same reason. By that test, 'Christianity is bad for life' says nothing about whether Jesus rose. At most it is a reason to wish the faith were false.",
          ],
          quote: {
            text: "If the existence of this Christian God were proved to us, we should feel even less able to believe in him.",
            who: "Friedrich Nietzsche",
            cite: "The Antichrist §47 (1888; tr. A. M. Ludovici, 1911)",
          },
          thinkers: ["nietzsche"],
          cedes:
            "If a faith's harmfulness could be shown to be evidence that its central claims about history and about God are false, this reply would fail.",
          children: [
            {
              id: "mor-daybreak",
              side: "skeptic",
              label: "Explaining how a belief arose can make refuting it unnecessary",
              gist: "Nietzsche explained belief in God by fear and resentment, which would strip it of evidence, and a faith that promises abundant life can be judged by its fruits.",
              body: [
                "This misses Nietzsche's method. In *Daybreak* §95 (1881) he calls the historical refutation 'the decisive one'. Once you show how a belief arose and gained authority, refuting it directly is unnecessary. If a belief is fully explained by causes that have nothing to do with its truth, such as fear of death, the resentment of the weak, or a priestly class's will to power, it has lost its evidence. That is a [[debunking-argument|debunking argument]], and it does bear on truth.",
                "Christianity also invites the test. It claims to be good news, 'I am come that they might have life, and that they might have it more abundantly' (John 10:10), and Jesus says a tree is known by its fruits (Matthew 7:16). Value and truth can come apart for a theorem in mathematics. This message claims to heal, so whether it heals is part of whether it is true.",
              ],
              quote: {
                text: "Formerly it was sought to prove that there was no God—now it is shown how the belief that a God existed could have originated, and by what means this belief gained authority and importance: in this way the counterproof that there is no God becomes unnecessary and superfluous.",
                who: "Friedrich Nietzsche",
                cite: "The Dawn of Day (Daybreak) §95 (1881; tr. J. M. Kennedy, 1911)",
              },
              thinkers: ["nietzsche"],
              cedes:
                "The argument fails if belief in God comes from a process that tracks truth, and fear and resentment are not the whole story.",
              see: [
                { id: "mor-convicts", why: "The same question about origins, asked in reverse, about a value's Christian roots." },
                { id: "hid-designed-faculty", why: "Objection II argues that a faculty can be natural, God-given and still misfire." },
              ],
              children: [
                {
                  id: "mor-debunk-limits",
                  side: "theist",
                  label: "An origin story can't debunk a belief with its own evidence",
                  gist: "Explaining how a belief arose defeats it only if nothing else supports it, and Christianity claims historical evidence, while Nietzsche's story fits early church history badly.",
                  body: [
                    "An origin story defeats a belief only when nothing but an unreliable process supports it, as Guy Kahane argues. Christian belief claims independent support in the resurrection case of ((evi-b-minimal|Objection IV)), so the debunker must win that argument first. Nietzsche's story also fits the history badly, since the scholars Wayne Meeks and Rodney Stark find the early churches drew a cross-section of city life.",
                    "The method also backfires, because if origins in fear debunk faith, origins in blind natural selection threaten all the beliefs of someone who thinks nature is all there is, that one included, as ((nat-b-minds|Objection III)) argues. And ((mor-convicts|the Objector)) called judging a value by its origin the [[genetic-fallacy|genetic fallacy]], yet here uses an origin to refute. On fruits, studies link a religious upbringing to better mental health, and attending services to flourishing in twenty-two countries (2025).",
                  ],
                  quote: {
                    text: "… great numbers must be involved in the danger of these prosecutions, which have already extended, and are still likely to extend, to persons of all ranks and ages, and even of both sexes.",
                    who: "Pliny the Younger, governor of Bithynia, to the emperor Trajan",
                    cite: "Letters X.96 (c. 112; tr. William Melmoth)",
                  },
                  thinkers: [],
                  cedes:
                    "The debunking would succeed if the historical case for the resurrection collapsed, leaving fear and resentment as the faith's only support.",
                  see: [
                    { id: "nat-b-minds", why: "Plantinga's argument that explaining our minds by evolution alone undercuts naturalism itself." },
                    { id: "mor-convicts", why: "Where the Objector calls an argument from origins the genetic fallacy." },
                    { id: "mor-debt", why: "The Objector's caution, in the part on guilt, about survey data like these." },
                  ],
                  sources: [
                    { title: "Evolutionary Debunking Arguments", by: "Guy Kahane", year: "2011", note: "Noûs 45." },
                    { title: "The First Urban Christians", by: "Wayne A. Meeks", year: "1983" },
                    { title: "The Rise of Christianity", by: "Rodney Stark", year: "1996" },
                    { title: "Associations of Religious Upbringing With Subsequent Health and Well-Being From Adolescence to Young Adulthood", by: "Ying Chen and Tyler J. VanderWeele", year: "2018", note: "American Journal of Epidemiology." },
                    { title: "Global Flourishing Study, first-wave results", by: "Tyler J. VanderWeele, Byron R. Johnson and colleagues", year: "2025", note: "Twenty-two countries." },
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
    title: "Spinoza keeps love and drops the judge",
    body: [
      "Spinoza's God is no judge, because, as he puts it, 'Strictly speaking, God does not love or hate anyone' (*Ethics* V P17 Cor.), and so there is no anger to appease. Reward and punishment survive inside the person. He wrote that 'the highest reward of the Divine law is the law itself, namely, to know God and to love Him', and that its penalty is 'the absence of these things, and being in bondage to the flesh' (*Theological-Political Treatise* ch. 4). On this view heaven is understanding and hell is bondage, and both happen now. That is closer to ((mor-chosen-hell|Aquinas's hell)) than either side admits, since in both the penalty is the disorder itself and lasts as long as the disorder does. Spinoza drops the free refusal and the endless pain.",
      "He even grants religious fear a use. Repentance is no virtue (IV P54), but few people live by reason, so humility, repentance, hope and fear do more good than harm, and it is no wonder that the prophets, 'who consulted the good, not of a few, but of all', commended them (IV P54 Schol.). On his view fear helps those who cannot yet live by reason, and does harm only when someone takes it for the goal.",
      "He parts from {{nietzsche}}, who hailed him in 1881 as a forerunner, over love. 'God, in so far as he loves himself, loves man' (V P36 Cor.), in the [[amor-dei-intellectualis|intellectual love]] that comes from understanding God, where our love of God and God's love of us are one. Spinoza's complaint against Christianity is that it gives true love false reasons, putting fear where understanding should be. The Defender answers that understanding comes to few, and the least of these cannot wait for it. Spinoza could reply that the majority Christian picture is harder on the weak, with a narrow gate that 'few there be that find' (Matthew 7:14), Augustine's *massa damnata* (the 'condemned mass' of humanity), and unbaptized infants punished, however mildly (*Enchiridion* 93). His 'perishing' is no torment, and his commonwealth exists 'to free every man from fear' (*Theological-Political Treatise* ch. 20).",
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
      note: "Nietzsche on guilt as debt, the ascetic priest and resentment. Two of the three charges here start from it.",
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
      note: "Spinoza on human bondage, repentance and pity, answering hatred with love, and blessedness as virtue itself.",
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
      note: "An Orthodox theologian who works in Aquinas's tradition argues that endless hell is incompatible with a good God.",
    },
    {
      title: "Dominion: How the Christian Revolution Remade the World",
      by: "Tom Holland",
      year: "2019",
      note: "The history behind the claim that care for the weak is a Christian inheritance.",
    },
  ],
};

export default morals;
