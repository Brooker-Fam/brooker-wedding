import type { Objection } from "../types";

/* Objection I: Coherence.
   Three parts: (A) divine vs natural causation, (B) foreknowledge vs freedom,
   (C) Euthyphro. Children attack their parent. Quotes were checked against the
   cited texts: Elwes's Spinoza (Ethics 1883), the English Dominican Fathers'
   Summa Theologiae (New Advent), H. R. James's Boethius (1897), Dods's City of
   God (1871), Shaw's Enchiridion (New Advent), Jowett's Euthyphro and Republic,
   the KJV, Hume's Enquiry and Dialogues (Gutenberg), Huggard's Theodicy
   (Gutenberg), Montgomery's Discourse on Metaphysics (1902), Abbott's Kant
   (Gutenberg), Lawson's Einstein (Gutenberg), Motte's Principia (1729 scan),
   Cudworth's Treatise (1731, archive.org), Mill's Examination (1865 scan),
   Russell's "Why I Am Not a Christian", Mackie's "Evil and Omnipotence" (course
   reprint), and Marmura's Ghazali and Kenny as quoted in the SEP. */

const coherence: Objection = {
  id: "coherence",
  numeral: "I",
  short: "Coherence",
  title: "The idea of God doesn't hold together",
  objection:
    "The idea of God doesn't hold together. If God causes everything, nature's causes do no work. If he knows today what you will do tomorrow, you aren't free to do otherwise. And Euthyphro's old dilemma leaves goodness either an arbitrary choice of God's or a standard above him.",
  counter:
    "Classical theism (Aquinas, David Bentley Hart) says the objection attacks a God who is one cause among others. Their God is the source of every cause and competes with none of them. Spinoza said much the same, though his God is not a person. God's nature is goodness itself, so Euthyphro's two options don't arise. And to prove the idea of God incoherent, the objector must show that every account of God fails. Three accounts of foreknowledge each claim to be consistent: God sees all of time at once, God knows what each of us would freely do (Molinism), or the future is still open (open theism).",
  dek:
    "The Objector's main target is a God who *chooses*, one who could have made a different world or none at all. Spinoza's God also causes everything and knows everything, so the first two parts mostly divide believers among themselves. The Objector wins if every account of God fails at least one of the three parts. The Defender needs just one account that gets through all of them.",
  question:
    "Can a God who causes everything, knows every free choice and is goodness itself still be someone who chooses?",

  prongs: [
    /* ───────────────────────── Part 1: divine vs natural causation ───────────────────────── */
    {
      id: "coh-a",
      side: "skeptic",
      label: "God's causing crowds out nature's, and theism needs both",
      gist: "If fire's own power burns the cotton, God adds nothing, and if it doesn't, fire is a stage prop and God does all the burning.",
      body: [
        "Believers built this dilemma themselves. {{ghazali}} argued in 1095 that no one can prove fire must burn cotton, since God may create the burning directly. {{malebranche}} made God the only true cause and creatures mere ‘occasions’ ([[occasionalism|occasionalism]]). {{hume}} thought such theories reach ‘fairy land’ long before they end.",
        "The usual view, concurrence, says God works in everything a creature does. If the creature's power is enough, God's part looks idle, and {{durandus}} concluded that God only keeps things in existence. {{freddoso}}, a modern defender of concurrence, answers that keeping a thing in being from its first instant already helps produce it. If it falls short, we are back with Malebranche.",
        "If every physical event has a complete physical cause, as physicists generally assume ([[causal-closure|causal closure]]), then {{kim}}'s [[causal-exclusion|exclusion principle]] (no effect has two complete causes) leaves God nothing to add.",
      ],
      quote: {
        text: "Thus, according to these philosophers, every thing is full of God. Not content with the principle, that nothing exists but by his will, that nothing possesses any power but by his concession: They rob nature, and all created beings, of every power, in order to render their dependence on the Deity still more sensible and immediate.",
        who: "David Hume",
        cite: "An Enquiry Concerning Human Understanding (1748; Selby-Bigge ed.), sect. VII, pt. 1, §56",
      },
      thinkers: ["ghazali", "malebranche", "hume", "durandus", "freddoso", "kim"],
      cedes:
        "This falls if someone can say what God's part adds to the burning without making fire's part idle, or shows that belief in God can live with fire doing nothing at all.",
      see: [
        { id: "nat-a-closure", why: "Causal closure again, this time used against miracles in Objection III." },
      ],
      sources: [
        { title: "Occasionalism", by: "Stanford Encyclopedia of Philosophy (Sukjae Lee)", url: "https://plato.stanford.edu/entries/occasionalism/" },
        { title: "God's General Concurrence with Secondary Causes: Why Conservation Is Not Enough", by: "Alfred J. Freddoso", year: "1991" },
        { title: "God's General Concurrence with Secondary Causes: Pitfalls and Prospects", by: "Alfred J. Freddoso", year: "1994" },
      ],
      children: [
        {
          id: "coh-a-concur",
          side: "theist",
          label: "God freely gives fire its power and never competes with it",
          gist: "God is no bigger cause standing beside fire, since he gives fire its being and power, so the burning belongs wholly to fire and wholly to God in different ways.",
          body: [
            "The dilemma assumes God and fire compete, so that whatever one does, the other doesn't. Classical theism, the tradition of Aquinas, denies this. {{aquinas}} held that God gives every creature its being, its power and its acting, and works on a different level from it ([[primary-secondary-causation|primary and secondary causation]]). {{farrer}} called this ‘double agency’, and {{tanner}} a non-competitive relation. The old picture is an author whose characters' every line is wholly theirs and wholly his. {{hart}} argues that God is the reason there are beings at all, so he can't be one more being among them.",
            "Spinoza's God works the same way. He is the [[immanent-cause|immanent cause]] of all things, the cause they exist in (Ethics I P18), while each finite thing is caused by another (I P28). The reply adds a person who gives being freely.",
          ],
          quote: {
            text: "One action does not proceed from two agents of the same order. But nothing hinders the same action from proceeding from a primary and a secondary agent.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I q.105 a.5 ad 2 (trans. English Dominican Fathers)",
          },
          thinkers: ["aquinas", "farrer", "tanner", "hart"],
          cedes:
            "If a cause working on a different level from fire could be shown to compete with it anyway, or a source of all being couldn't act freely, this reply would fail.",
          see: [
            { id: "hid-hart-light", why: "Hart's God as the light we see by, the same idea applied to hiddenness in Objection II." },
            { id: "coh-b-classical", why: "The same idea, extended from fire's burning to your choosing." },
            { id: "nat-a-power", why: "Spinoza asks in Objection III whether a God who never competes can still raise the dead." },
          ],
          sources: [
            { title: "The Experience of God: Being, Consciousness, Bliss", by: "David Bentley Hart", year: "2013", url: "https://yalebooks.yale.edu/book/9780300209358/the-experience-of-god/" },
            { title: "God and Creation in Christian Theology", by: "Kathryn Tanner", year: "1988" },
          ],
          children: [
            {
              id: "coh-a-collapse",
              side: "skeptic",
              label: "A God with no parts couldn't have made any other world",
              gist: "If God has no parts, his act of creating is God himself, and since God can't fail to exist, neither can that act or the world it makes.",
              body: [
                "The reply's God is the God of [[divine-simplicity|divine simplicity]], the classical teaching that God has no parts, so his nature, existence and will are one thing. Whatever is identical with a necessary being is itself necessary. God's act of willing this world is identical with God, so that act is necessary, and so is the world it wills. Free creation, which was meant to make this God personal and unlike Spinoza's, becomes [[modal-collapse|modal collapse]], the result that nothing could have been otherwise.",
                "{{mullins}}, a Christian philosopher, argued this in 2013 and again, with Shannon Byrd, in 2022. With {{schmid|Joseph Schmid}} he added an ‘aloneness argument’ (2022). If God is the same within himself whether he creates or stays alone, nothing in God explains the difference. {{spinoza}} drew the same conclusion and welcomed it.",
              ],
              quote: {
                text: "Things could not have been brought into being by God in any manner or in any order different from that which has in fact obtained.",
                who: "Spinoza",
                cite: "Ethics I P33 (trans. R. H. M. Elwes, 1883)",
              },
              thinkers: ["mullins", "schmid", "spinoza"],
              cedes:
                "A simple God whose act of creating could differ from world to world, without God himself differing and without the difference going unexplained, would answer this.",
              see: [
                { id: "nat-b-necess", why: "Spinoza reaches the same result in Objection III from the principle that everything has a reason." },
              ],
              sources: [
                { title: "Divine Simplicity", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/divine-simplicity/" },
                { title: "Simply Impossible: A Case against Divine Simplicity", by: "R. T. Mullins", year: "2013" },
                { title: "The Aloneness Argument against Classical Theism", by: "Joseph Schmid and R. T. Mullins", year: "2022", note: "Religious Studies 58." },
              ],
              children: [
                {
                  id: "coh-a-extrinsic",
                  side: "theist",
                  label: "God's act is necessary, but the world it makes isn't",
                  gist: "God's single act is the same in every possible world and only its results differ, so God's necessity doesn't pass to the world he makes.",
                  body: [
                    "The collapse argument slides from God's act to what the act produces. {{aquinas|Aquinas}} held that God wills his own goodness necessarily, but that goodness is complete without creatures, so his willing them is necessary only ‘by supposition’, the way Socrates must be sitting if he is sitting. {{leibniz}}, who talked with Spinoza in The Hague in 1676 and spent decades answering him, called this the difference between absolute and hypothetical necessity.",
                    "{{tomaszewski}} argues that the collapse argument is invalid, because the phrase ‘God's act of creating’ doesn't pick out the same thing in every possible world. {{grant}}'s ‘extrinsic’ model makes ‘God wills this world’ true partly because of the world, much as ‘Everest is being photographed’ can become true with no change in the mountain. On this view God's reasons explain his choice of a world without forcing it.",
                  ],
                  quote: {
                    text: "Hence, since the goodness of God is perfect, and can exist without other things inasmuch as no perfection can accrue to Him from them, it follows that His willing things apart from Himself is not absolutely necessary.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.3 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas", "leibniz", "tomaszewski", "grant"],
                  cedes:
                    "If a God who is the same in every world, while the world differs, left this world's existence with no explanation at all, the reply would fail.",
                  see: [
                    { id: "nat-b-reasons", why: "Objection III argues at length that reasons can explain a free choice without forcing it." },
                    { id: "nat-b-contrast", why: "The response there says a reason that fits either choice explains nothing." },
                  ],
                  sources: [
                    { title: "Free Will and God's Universal Causality: The Dual Sources Account", by: "W. Matthews Grant", year: "2019" },
                    { title: "Collapsing the Modal Collapse Argument", by: "Christopher Tomaszewski", year: "2019" },
                  ],
                },
              ],
            },
            {
              id: "coh-a-dogstar",
              side: "spinoza",
              label: "A creator's mind would be ‘mind’ as the Dog Star is a dog",
              gist: "A mind that planned the world before the world existed would be as unlike ours as the Dog Star is unlike a barking dog, Spinoza argues.",
              body: [
                "The reply borrows Spinoza's idea that things exist *in* God (Ethics I P15, P18) and adds ‘a person’. Spinoza thinks the addition fails, because a personal creator would be an intellect existing before things and deciding them, causing both what our minds are and that they exist. A father causes his son's existence but not his human nature, so the two share one. A mind that caused the nature of minds would share nothing with ours but the name (I P17 Schol.).",
                "Spinoza doesn't deny that God thinks. Thought is an attribute of God (II P1), and our minds are part of God's infinite intellect (II P11 Cor.), so divine and human thought are one kind ([[univocity|univocal]]). He denies a mind that precedes the world and chooses it. A ‘personal’ God, for him, is a magnified human or nothing.",
              ],
              quote: {
                text: "… intellect and will, which should constitute the essence of God, would perforce be as far apart as the poles from the human intellect and will, in fact, would have nothing in common with them but the name; there would be about as much correspondence between the two as there is between the Dog, the heavenly constellation, and a dog, an animal that barks.",
                who: "Spinoza",
                cite: "Ethics I P17 Schol. (trans. R. H. M. Elwes, 1883)",
              },
              thinkers: ["spinoza"],
              cedes:
                "Spinoza would give way if someone described a divine mind that comes before things and neither copies ours nor shrinks to a name.",
              see: [
                { id: "hid-love-emptied", why: "The same dilemma for divine ‘love’ in Objection II, where stretching the word that far empties it." },
                { id: "evi-a-imagination", why: "Spinoza on why a God known by feeling is known only by imagination, which for him falls short of knowledge." },
              ],
              children: [
                {
                  id: "coh-a-analogy",
                  side: "theist",
                  label: "Analogy lets us speak of God without making him one of us",
                  gist: "‘Wise’ said of God and of Socrates means neither the same thing nor something unrelated, because God has first what Socrates has as a gift.",
                  body: [
                    "The Dog Star dilemma offers two options, the same meaning or none, and leaves out a third. {{aquinas|Aquinas}} held that words like ‘wise’ are said of God [[analogy-of-being|by analogy]], as ‘bright’ is said of the sun and of the wall it lights. The two brightnesses differ, yet they are related and the sun's comes first. A cause can't give what it lacks, so any perfection in an effect is in its cause ‘in a more eminent degree’ (ST I q.4 a.2).",
                    "A mind that comes before its works isn't foreign to us. An architect's plan exists before the house and causes it, and Aquinas likens God's knowledge to ‘the knowledge of the artificer’ (ST I q.14 a.8). Following {{maimonides}}, who allowed only [[apophatic|negative theology]], Aquinas held that analogy tells us *that* God is wise, never what his wisdom is like.",
                  ],
                  quote: {
                    text: "Now this mode of community of idea is a mean between pure equivocation and simple univocation. For in analogies the idea is not, as it is in univocals, one and the same, yet it is not totally diverse as in equivocals; …",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.13 a.5 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas", "maimonides"],
                  cedes:
                    "If talk of God's wisdom, looked at closely, always turned out to mean either what it means for us or nothing at all, the reply would fail.",
                  see: [
                    { id: "hid-hart-personal", why: "Hart's version in Objection II, where the source of being is infinite mind and love." },
                    { id: "hid-rea-love", why: "Rea's answer to hiddenness in Objection II leans on the same analogy, since divine love needn't look like a parent's." },
                  ],
                  sources: [
                    { title: "Medieval Theories of Analogy", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/analogy-medieval/" },
                    { title: "Summa Theologiae I q.13 (The Names of God)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1013.htm" },
                  ],
                  children: [
                    {
                      id: "coh-a-univocal",
                      side: "skeptic",
                      label: "Analogy with no shared core tells us nothing about God",
                      gist: "If ‘wise’ means something different for God, we can't reason from wise creatures to a wise God, and if it means the same, God is back on our scale.",
                      body: [
                        "The sun and the wall share ‘bright’ because one thing, light, is in both. Without a shared core, an argument from creatures to God fails. {{scotus|Duns Scotus}}, a Franciscan who shared Aquinas's faith, pressed this against him. An argument that shifts the meaning of ‘wise’ between premise and conclusion proves nothing, so if creatures teach us anything about God, some concept must apply to both in the same sense (*Ordinatio* I d.3). {{alston}} reached a similar verdict in 1993.",
                        "So the reply has to choose. With a shared core, God's wisdom is ours without its limits, and God becomes one more being on the scale, larger but comparable. {{hart|Hart}} and {{tanner|Tanner}} rejected such a ‘being among beings’ so that God would never compete with fire. Without the core, ‘wise’ and ‘personal’ give us nothing to reason with.",
                      ],
                      quote: {
                        text: "Is the name, without any meaning, of such mighty importance? Or how do you mystics, who maintain the absolute incomprehensibility of the Deity, differ from Sceptics or Atheists, who assert, that the first cause of all is unknown and unintelligible?",
                        who: "Cleanthes, in Hume's dialogue",
                        cite: "David Hume, Dialogues Concerning Natural Religion (1779), Part IV",
                      },
                      thinkers: ["scotus", "alston", "hart", "tanner", "hume"],
                      cedes:
                        "This would fail if a word like ‘wise’ could carry an argument from creatures to God without any meaning the two share.",
                      see: [
                        { id: "coh-a-concur", why: "With a shared core God is back on fire's scale and competing with it again." },
                        { id: "hid-love-emptied", why: "The same problem for divine ‘love’ in Objection II." },
                        { id: "mor-mansel", why: "Mill's version in Objection V, where a goodness unlike ours is empty praise." },
                      ],
                      sources: [
                        { title: "Aquinas on Theological Predication: A Look Backward and a Look Forward", by: "William P. Alston", year: "1993", note: "In Reasoned Faith, ed. Eleonore Stump." },
                        { title: "The Doctrine of Univocity Is True and Salutary", by: "Thomas Williams", year: "2005", note: "Modern Theology 21." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "coh-a-occasion",
          side: "theist",
          label: "A God who does all the causing is a consistent picture",
          gist: "If God alone causes and nature's laws are his steady habits, the picture is still consistent, and a charge of incoherence has to defeat every picture.",
          body: [
            "The dilemma assumes theism needs fire to have powers of its own. It needs only that God be the source of everything, and one consistent way to say so is [[occasionalism|occasionalism]], on which God alone causes anything. {{ghazali|Al-Ghazali}} held that fire and cotton touch and God creates the burning. {{malebranche|Malebranche}} argued, before Hume, that we never see a necessary connection between a creature and its effect, and he found one only in God's will. Hume later used the same argument without God. Science arguably loses nothing on this view, since the laws hold because God is faithful and describe how he usually acts. {{mccann|Hugh McCann}} and Jonathan Kvanvig defended a modified occasionalism in 1991, and {{plantinga}} gave it a sympathetic hearing in 2016. Hume's ‘fairy land’ mocks the view without finding a contradiction in it.",
          ],
          quote: {
            text: "The connection (iqtirān) between what is habitually believed to be a cause and what is habitually believed to be an effect is not necessary (ḍarūrī), according to us.",
            who: "Al-Ghazali",
            cite: "The Incoherence of the Philosophers (1095), Seventeenth Discussion (trans. Michael E. Marmura), as quoted in the SEP entry “al-Ghazali”",
          },
          thinkers: ["ghazali", "malebranche", "mccann", "plantinga"],
          cedes:
            "If a God who does all the causing contradicted some belief theism can't give up, this would fail, though offending common sense isn't enough.",
          see: [
            { id: "coh-a-concur", why: "The classical alternative, where God gives creatures real power of their own." },
          ],
          sources: [
            { title: "Al-Ghazali", by: "Stanford Encyclopedia of Philosophy (Frank Griffel)", url: "https://plato.stanford.edu/entries/al-ghazali/" },
            { title: "The Occasionalist Proselytizer: A Modified Catechism", by: "Hugh J. McCann and Jonathan L. Kvanvig", year: "1991", note: "Philosophical Perspectives 5." },
            { title: "Law, Cause, and Occasionalism", by: "Alvin Plantinga", year: "2016", note: "In Reason and Faith, ed. Michael Bergmann and Jeffrey E. Brower." },
          ],
          children: [
            {
              id: "coh-a-sinauthor",
              side: "skeptic",
              label: "If God alone causes, God alone does every evil deed",
              gist: "If God is the only cause, the murderer's stab is God's work, and a holy God who commits every sin is a contradiction that Aquinas himself rejected.",
              body: [
                "Occasionalism holds together until you count the sins. If God is the only cause, then when a hand drives a knife into a sleeping man, the motion is God's work and the murderer supplies only the occasion. The Ash'arites, the school of Islamic theology Ghazali belonged to, said God creates the act and the human only ‘acquires’ it, a word that names the problem without solving it. {{malebranche|Malebranche}} made one exception, the will's consent, which he insisted is no real cause. Either consent is a real power, and occasionalism has failed, or it is nothing, and God does the sinning. The usual reply about sin, that God causes the act and not its defect ((coh-b-teleo|in Part 2)), needs a creature that falls short, and here no creature does anything. Aquinas, whom classical theism follows, rejected occasionalism outright.",
              ],
              quote: {
                text: "Some have understood God to work in every agent in such a way that no created power has any effect in things, but that God alone is the ultimate cause of everything wrought; for instance, that it is not fire that gives heat, but God in the fire, and so forth. But this is impossible. First, because the order of cause and effect would be taken away from created things: and this would imply lack of power in the Creator …",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I q.105 a.5 (trans. English Dominican Fathers)",
              },
              thinkers: ["malebranche", "aquinas"],
              cedes:
                "Someone would need to say who besides God does anything when a sin is done, without giving creatures real power to act.",
              see: [
                { id: "coh-b-needslib", why: "The same charge against the classical God who causes every choice." },
              ],
              sources: [
                { title: "Summa Theologiae I q.105 (On the Change of Creatures by God)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1105.htm" },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── Part 2: foreknowledge vs freedom ───────────────────────── */
    {
      id: "coh-b",
      side: "skeptic",
      label: "An all-knowing God leaves no room for the freedom theism needs",
      gist: "If God already knows what you will do and can't be wrong, you can't do otherwise, and freedom, as many believers now define it, means you could have.",
      body: [
        "{{boethius}} faced this problem around 524, in a prison cell, waiting to be executed. {{pike}} gave it its modern form in 1965.",
        "Suppose God believed yesterday that you would take the job today. God's beliefs can't be mistaken, and the past can't be changed, so no one now can make it the case that God believed otherwise. Whatever follows from something unchangeable is unchangeable too. So no one can now do anything but take the job.",
        "Many leading answers to the problem of evil rely on [[libertarian-freedom|libertarian freedom]], the power at the moment of choice to go either way, to explain why God permits evil and why his judgment is just. If [[theological-fatalism|theological fatalism]] is right, either God doesn't know the future or no one has ever chosen anything, and a God who judges has nothing to judge.",
      ],
      quote: {
        text: "For if God foresees everything, and can in no wise be deceived, that which providence foresees to be about to happen must necessarily come to pass.",
        who: "Boethius",
        cite: "The Consolation of Philosophy V, prose 3 (trans. H. R. James, 1897)",
      },
      thinkers: ["boethius", "pike"],
      cedes:
        "If one of the three premises (God can't be wrong, the past can't be changed, what follows from the unchangeable is unchangeable) were shown false for some reason other than saving freedom, or a judging God could do without this kind of freedom, the argument would fail.",
      see: [
        { id: "mor-locked-door", why: "A hell people choose from the inside, in Objection V, needs the freedom this argument threatens." },
      ],
      sources: [
        { title: "Foreknowledge and Free Will", by: "Stanford Encyclopedia of Philosophy (David Hunt and Linda Zagzebski)", url: "https://plato.stanford.edu/entries/free-will-foreknowledge/" },
        { title: "Divine Omniscience and Voluntary Action", by: "Nelson Pike", year: "1965" },
      ],
      children: [
        {
          id: "coh-b-eternity",
          side: "theist",
          label: "God sees all of time at once, so his knowing fixes nothing",
          gist: "A God outside time has no yesterday in which to believe anything, and he sees your choice the way you see someone sit, which doesn't make them sit.",
          body: [
            "Pike's argument needs God's belief to sit in the past, fixed before you act. {{boethius|Boethius}} answered from the same cell that God is eternal and possesses his whole life at once, [[timeless-eternity|outside time]]. {{aquinas|Aquinas}} gave a picture of it: ‘he who goes along the road, does not see those who come after him; whereas he who sees the whole road from a height, sees at once all travelling by the way’ (ST I q.14 a.13 ad 3).",
            "Seeing something happen doesn't cause it, and on this view God's seeing doesn't come earlier than the event either. Your choice is present to God as it happens, so the premise about the fixed past never applies. In 1981 {{stump}} and {{kretzmann}} gave a precise definition of how eternity relates to time, which they called ‘ET-simultaneity’. They built it so that no event is earlier than God's knowing it.",
          ],
          quote: {
            text: "… thou wilt more rightly deem it not foreknowledge as of something future, but knowledge of a moment that never passes.",
            who: "Boethius",
            cite: "The Consolation of Philosophy V, prose 6 (trans. H. R. James, 1897)",
          },
          thinkers: ["boethius", "aquinas", "stump", "kretzmann"],
          cedes:
            "If knowledge from outside time turned out to be fixed and out of our reach in the same way past knowledge is, this answer would fail.",
          see: [
            { id: "coh-b-classical", why: "Aquinas's full answer adds that God knows by causing as well as by seeing." },
          ],
          sources: [
            { title: "Eternity in Christian Thought", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/eternity/" },
            { title: "The Consolation of Philosophy", by: "Boethius (trans. H. R. James)", year: "c. 524", url: "https://www.gutenberg.org/ebooks/14328" },
          ],
          children: [
            {
              id: "coh-b-rerun",
              side: "skeptic",
              label: "Knowledge from outside time is as fixed as yesterday's",
              gist: "Moving God's belief outside time doesn't help, because a belief you can't affect fixes your act just as a past belief would.",
              body: [
                "Eternity doesn't help, since Pike's argument never needed the word ‘past’, only a fact about God's knowledge that you can't now change. {{zagzebski}} showed that the argument runs again with the fixity of eternity in place of the fixity of the past. If God's eternal belief that you will take the job is beyond your power, so is your taking it. {{plantinga}} added in 1986 that even on this view it was true eighty years ago that God knows what you will do, and that past truth looks as fixed as any other.",
                "If your typing and Nero's fiddling are both simultaneous with all of eternity, then Nero fiddles while you type, as {{kenny}} pointed out. ET-simultaneity was defined to block that inference, and critics think that is special pleading.",
              ],
              quote: {
                text: "But, on St. Thomas' view, my typing of this paper is simultaneous with the whole of eternity. Again, on his view, the great fire of Rome is simultaneous with the whole of eternity. Therefore, while I type these very words, Nero fiddles heartlessly on.",
                who: "Anthony Kenny",
                cite: "The God of the Philosophers (1979), pp. 38–39, as quoted in the SEP entry “Eternity in Christian Thought”",
              },
              thinkers: ["zagzebski", "plantinga", "kenny"],
              cedes:
                "A principled reason why only facts earlier in time are beyond our power, while facts outside time are not, would answer this.",
              sources: [
                { title: "The Dilemma of Freedom and Foreknowledge", by: "Linda Zagzebski", year: "1991" },
                { title: "The God of the Philosophers", by: "Anthony Kenny", year: "1979" },
              ],
              children: [
                {
                  id: "coh-b-dependence",
                  side: "theist",
                  label: "God's knowledge depends on your choice in a way the past doesn't",
                  gist: "God's knowledge from outside time depends on what you choose, so had you chosen otherwise, he would always have known otherwise.",
                  body: [
                    "The rejoinder asks for a principled difference, and there is one. The past is beyond our power because it no longer depends on anything we do, while God's eternal knowledge depends on what it knows. {{stump}} and {{kretzmann}} argued in 1991 that had you chosen otherwise, God would eternally have known otherwise. You can't make his knowledge different, but you can choose otherwise, and if you did, it would always have been different.",
                    "{{plantinga|Plantinga}}'s eighty-year-old truth is true only because of what you will do. {{ockham|Ockham}} would call it a fact about the past in wording only, what philosophers now call a [[soft-facts|soft fact]], unlike a hard fact such as a broken vase. {{kenny|Kenny}}'s Nero puzzle assumes that simultaneity carries over from one pair of events to the next, which ET-simultaneity was defined not to do.",
                  ],
                  quote: {
                    text: "For a man does not therefore sin because God foreknew that he would sin. … But if he shall not will to sin, even this did God foreknow.",
                    who: "Augustine",
                    cite: "The City of God V.10 (trans. Marcus Dods, 1871)",
                  },
                  thinkers: ["stump", "kretzmann", "plantinga", "ockham", "kenny", "augustine"],
                  cedes:
                    "If a fact could depend on my choice and still be beyond my power in the way the past is, this would fail.",
                  see: [
                    { id: "coh-b-molina", why: "Molina's followers use Ockham's answer for God's beliefs about the future." },
                  ],
                  sources: [
                    { title: "Prophecy, Past Truth, and Eternity", by: "Eleonore Stump and Norman Kretzmann", year: "1991", note: "Philosophical Perspectives 5." },
                    { title: "The City of God", by: "Augustine (trans. Marcus Dods)", url: "https://www.newadvent.org/fathers/120105.htm" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "coh-b-molina",
          side: "theist",
          label: "God foreknows by knowing what you would freely do",
          gist: "Before creating, God knew what every possible person would freely choose in every situation, then chose which situations to make real, so your choices stay yours.",
          body: [
            "Pike never asks how God knows, and {{molina}}, a Jesuit, thought the answer changes things. Theologians said God knows what *could* happen, and knows what *will* happen because he decides it. In 1588 Molina added [[middle-knowledge|middle knowledge]], knowledge of what any creature *would* freely do in any situation. Knowing these [[counterfactuals-of-freedom|counterfactuals of freedom]], God chooses a world where Peter is questioned in a courtyard, knowing Peter would freely deny Jesus there. Your choice comes first in the order of explanation, so God steers history without being a puppeteer.",
            "Dominicans and Jesuits argued over this until 1607, when Pope Paul V let both sides teach. {{plantinga|Plantinga}} revived it in 1974 for his free-will defense, and {{craig}} and {{flint}} defend it today, answering the problem of the fixed past the way {{ockham|Ockham}} did.",
          ],
          quote: {
            text: "Then said David, Will the men of Keilah deliver me and my men into the hand of Saul? And the LORD said, They will deliver thee up.",
            who: "David and the LORD, at Keilah",
            cite: "1 Samuel 23:12 (KJV)",
          },
          thinkers: ["molina", "craig", "flint", "ockham", "plantinga"],
          cedes:
            "If there were no truths about what free creatures would do, God would have nothing to know before creating, and this account would fail.",
          see: [
            { id: "hid-middle-knowledge", why: "Middle knowledge at work in Objection II, deciding who is born where the gospel reaches." },
          ],
          sources: [
            { title: "Divine Providence: The Molinist Account", by: "Thomas P. Flint", year: "1998" },
            { title: "The Only Wise God", by: "William Lane Craig", year: "1987" },
            { title: "On Ockham's Way Out", by: "Alvin Plantinga", year: "1986" },
          ],
          children: [
            {
              id: "coh-b-grounding",
              side: "skeptic",
              label: "Nothing makes ‘you would freely do X’ true before you exist",
              gist: "Nothing can make a claim about what you would freely do true, since God's will would make it his choice, your character would determine it, and you may never exist.",
              body: [
                "Middle knowledge needs truths for God to know, and the [[grounding-objection|grounding objection]] asks what makes them true. God's will can't, or the choice would be his. Your character and circumstances can't, or the choice would be determined, and Molina wanted it free in the sense of being able to go either way. Your actual choice can't, because in most of the situations God surveys, you never exist. {{adams-robert-m}}, himself a Christian, argued in 1977 that there is nothing for these claims to be true *of*.",
                "Would Peter have denied Jesus if the night had been warmer and he had stayed away from the fire? There seems to be no fact of the matter, only possibilities, which God already knows. {{hasker}} pressed the point for decades, and {{leibniz}} reported an older Thomist version in 1710.",
              ],
              quote: {
                text: "But the principal objection is aimed at the foundation of this knowledge. For what foundation can God have for seeing what the people of Keilah would do? A simple contingent and free act has nothing in itself to yield a principle of certainty, unless one look upon it as predetermined by the decrees of God, and by the causes that are dependent upon them.",
                who: "Leibniz, reporting the Thomists' objection",
                cite: "Theodicy (1710), Part I, §41 (trans. E. M. Huggard)",
              },
              thinkers: ["adams-robert-m", "hasker", "leibniz"],
              cedes:
                "If claims can be true with nothing making them true, and that goes for ordinary claims about the future too, the objection fails.",
              sources: [
                { title: "Middle Knowledge and the Problem of Evil", by: "Robert Merrihew Adams", year: "1977" },
                { title: "God, Time, and Knowledge", by: "William Hasker", year: "1989" },
                { title: "Theodicy", by: "G. W. Leibniz (trans. E. M. Huggard)", year: "1710", url: "https://www.gutenberg.org/ebooks/17147" },
              ],
              children: [
                {
                  id: "coh-b-truthmakers",
                  side: "theist",
                  label: "Truths about free choices need nothing to make them true",
                  gist: "‘You will read this tomorrow’ can be true today with nothing yet to make it true, and claims about what you would freely do are no worse off.",
                  body: [
                    "The grounding objection proves too much. ‘You will read this tomorrow’ may be true today, yet nothing that exists today makes it true, because the reading hasn't happened. Most philosophers still grant that there are truths about the future. {{craig|Craig}} argued in 2001 that any [[truthmaker|truthmaker]] rule, the rule that every truth needs something real to make it true, strict enough to sink claims about free choices would sink the future tense too. For anyone who thinks only the present exists, it would sink the past tense as well.",
                    "So {{plantinga|Plantinga}} and {{flint|Flint}} treat these claims as basic truths, true because that is what the person would freely do. {{merricks|Merricks}} argues on separate grounds that many truths need nothing to make them true. Scripture takes such claims for granted, as when Jesus says what Tyre and Sidon would have done.",
                  ],
                  quote: {
                    text: "Woe unto thee, Chorazin! woe unto thee, Bethsaida! for if the mighty works, which were done in you, had been done in Tyre and Sidon, they would have repented long ago in sackcloth and ashes.",
                    who: "Jesus, in Matthew's Gospel",
                    cite: "Matthew 11:21 (KJV)",
                  },
                  thinkers: ["craig", "plantinga", "flint", "merricks"],
                  cedes:
                    "If someone found a principled rule that ruled out truths about free choices and still allowed truths about the future and the past, this reply would fail.",
                  sources: [
                    { title: "Middle Knowledge, Truth-Makers, and the ‘Grounding Objection’", by: "William Lane Craig", year: "2001" },
                  ],
                  children: [
                    {
                      id: "coh-b-asym",
                      side: "skeptic",
                      label: "Tomorrow can make ‘will’ true, but nothing makes ‘would’ true",
                      gist: "Tomorrow's reading can make ‘you will read this’ true if tomorrow is as real as today, but the warmer night when Peter stays away from the fire never comes.",
                      body: [
                        "The comparison between ‘will’ and ‘would’ works only on {{craig|Craig}}'s own view of time, on which only the present exists. If past, present and future are equally real, as the ‘block universe’ reading of relativity suggests, tomorrow's reading exists, just later, and makes the prediction true now. The warmer night on which Peter stays away from the fire never happens at any time, so nothing, then or ever, makes ‘he would have denied him anyway’ true.",
                        "If such claims were true anyway, they would be settled before you exist and before God decides anything, and what is settled before you exist isn't up to you. {{adams-robert-m|Adams}} argued this in 1991 and {{hasker|Hasker}} in 1999. An open theist also accepts the comparison and denies truth to both kinds of claim, so a tie points toward ((coh-b-open|an open future)) and away from middle knowledge.",
                      ],
                      quote: {
                        text: "Verily I say unto thee, That this night, before the cock crow, thou shalt deny me thrice.",
                        who: "Jesus, to Peter",
                        cite: "Matthew 26:34 (KJV)",
                      },
                      thinkers: ["craig", "adams-robert-m", "hasker"],
                      cedes:
                        "If something real, then or ever, made it true what a never-created person would freely have done, and the choice still stayed up to him, this would fail.",
                      see: [
                        { id: "coh-b-open", why: "Where the comparison leads if neither kind of claim has anything to make it true." },
                      ],
                      sources: [
                        { title: "An Anti-Molinist Argument", by: "Robert Merrihew Adams", year: "1991", note: "Philosophical Perspectives 5." },
                        { title: "A New Anti-Molinist Argument", by: "William Hasker", year: "1999", note: "Religious Studies 35." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "coh-b-open",
          side: "theist",
          label: "An open future is a consistent way out, and one is enough",
          gist: "If future free choices aren't there yet to be known, an all-knowing God misses nothing, and one consistent account of God is enough to answer the charge.",
          body: [
            "Pike's argument assumes there is already a fact about what you will freely do, and open theists deny it. {{aristotle}} wondered whether ‘there will be a sea battle tomorrow’ is true today. {{todd}} argues (2021) that all such [[future-contingents|future contingents]], claims about free or chancy future events, are false, so a God who knows every truth still knows all there is. {{swinburne}}, {{hasker|Hasker}} and {{boyd}} defend versions of the idea. The authors of *The Openness of God* (1994) built [[open-theism|open theism]] on the biblical God who tests people, changes course and tells Abraham ‘now I know’.",
            "This God passes the other two parts as well. He gives free agents power without settling how they use it, so nothing is caused twice, and his nature is the standard of goodness, as {{adams-robert-m|Adams}} argues ((coh-c-terminus|in Part 3)), with no need for simplicity.",
          ],
          quote: {
            text: "for now I know that thou fearest God, seeing thou hast not withheld thy son, thine only son from me.",
            who: "The angel of the LORD, to Abraham",
            cite: "Genesis 22:12 (KJV)",
          },
          thinkers: ["aristotle", "todd", "swinburne", "hasker", "boyd", "adams-robert-m"],
          cedes:
            "If future free choices could be known for certain in advance, or an open God failed one of the other two parts, this would fail.",
          sources: [
            { title: "The Open Future: Why Future Contingents Are All False", by: "Patrick Todd", year: "2021" },
            { title: "God of the Possible", by: "Gregory A. Boyd", year: "2000" },
          ],
          children: [
            {
              id: "coh-b-package",
              side: "skeptic",
              label: "Each answer saves a different God, and none passes all three",
              gist: "The open God acts in time, so each answered prayer is an intervention, and his ‘now’ needs a cosmic present that physics denies.",
              body: [
                "The open-theism reply changes the subject, since Objection I is answered only if one God gets through all three parts. The classical answer to Part 1 was Aquinas's, that God is no being among beings and so never competes with fire. The open God lives in time, learns as we choose and answers as we pray, so each answer is a [[special-divine-action|special act]], one more push in a world that physics finds causally closed ((nat-a-closure|Objection III)).",
                "Living in time also needs a single cosmic ‘now’, which special relativity denies. {{craig|Craig}}, who holds that God has been in time since creation, revives a preferred state of rest that few physicists accept. Followers of Aquinas also reject Molinism, saying a God informed by truths he doesn't make is taught by his creatures, and Craig rejects strong simplicity.",
              ],
              quote: {
                text: "Every reference-body (co-ordinate system) has its own particular time; unless we are told the reference-body to which the statement of time refers, there is no meaning in a statement of the time of an event.",
                who: "Albert Einstein",
                cite: "Relativity: The Special and General Theory (1916; trans. Robert W. Lawson, 1920), ch. IX",
              },
              thinkers: ["craig", "einstein"],
              cedes:
                "If a single God, described the same way throughout, answered all three parts at once, the objection would fall.",
              see: [
                { id: "coh-a-concur", why: "Aquinas's answer to Part 1, which the open God can't share." },
                { id: "nat-a-power", why: "Spinoza's version in Objection III, where a God who steps into nature becomes one cause among others." },
              ],
              sources: [
                { title: "Time and Eternity: Exploring God's Relationship to Time", by: "William Lane Craig", year: "2001" },
                { title: "Relativity: The Special and General Theory", by: "Albert Einstein (trans. Robert W. Lawson)", year: "1920", url: "https://www.gutenberg.org/ebooks/30155" },
              ],
              children: [
                {
                  id: "coh-b-classical",
                  side: "theist",
                  label: "Aquinas's God answers all three parts at once",
                  gist: "Aquinas's God is the source of everything and competes with nothing, so he causes fire's burning, knows your choice by giving it being, and is goodness itself.",
                  body: [
                    "Mixing answers from rival camps would deserve the complaint, but Aquinas's account needs no allies. {{aquinas|Aquinas}} holds that God knows creatures as their cause, the way an artist knows a work, by making it. He knows your choice from outside time, as the one giving it being, and needs no truths he didn't make. Because God works in each thing according to its nature, his causing a free choice is what makes it free.",
                    "{{mccabe}} defended this in the 1980s and {{grant|Grant}} develops it today. It is the non-competition of Part 1 applied to the will. Outside time, this God needs no cosmic ‘now’, and as no rival, he pushes nothing aside. He is goodness itself, which answers Part 3, and his act is necessary while its effects are not ((coh-a-extrinsic|as the collapse reply says)).",
                  ],
                  quote: {
                    text: "Now it is manifest that God causes things by His intellect, since His being is His act of understanding; and hence His knowledge must be the cause of things, in so far as His will is joined to it.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.14 a.8 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas", "mccabe", "grant"],
                  cedes:
                    "If God's causing a choice made it unfree, or made God the author of its evil, this account would fail.",
                  see: [
                    { id: "coh-c-nature", why: "The answer to Part 3, that goodness is what God is." },
                  ],
                  sources: [
                    { title: "Summa Theologiae I q.14 (On God's Knowledge)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1014.htm" },
                    { title: "God Matters", by: "Herbert McCabe", year: "1987" },
                  ],
                  children: [
                    {
                      id: "coh-b-needslib",
                      side: "skeptic",
                      label: "If God causes every choice, he causes the sins he punishes",
                      gist: "If God causes every choice, he causes Judas's betrayal too, and judging Judas looks like an author punishing a character for what the author wrote.",
                      body: [
                        "If God knows our choices because he causes them, our freedom looks like that of a designed man. {{mele}} imagines a goddess who designs a zygote so that the man it becomes will later do what she planned. {{pereboom}} lines up a series of such cases ending in ordinary causes and asks where freedom appears. Most readers judge that man unfree, and someone whose every choice God causes seems no freer.",
                        "On {{banez|Báñez}}'s account of sin, a creature falls only when God withholds the grace that would have kept it standing, so God's decree decides who falls. Jesuits pressed this charge during the dispute over grace, and {{maritain}}, a follower of Aquinas, revised the doctrine in 1963 to avoid it. {{mackie}} had already asked in 1955 why such a God didn't make people who always choose well.",
                      ],
                      quote: {
                        text: "if God has made men such that in their free choices they sometimes prefer what is good and sometimes what is evil, why could he not have made men such that they always freely choose the good?",
                        who: "J. L. Mackie",
                        cite: "“Evil and Omnipotence”, Mind 64 (1955), p. 209",
                      },
                      thinkers: ["mele", "pereboom", "banez", "maritain", "mackie"],
                      cedes:
                        "I'd give this up if God could cause every choice without designing it the way Mele's goddess designs the man, and without his decree deciding who falls.",
                      see: [
                        { id: "mor-locked-door", why: "A hell locked from the inside, in Objection V, needs the two-way freedom this account gives up." },
                        { id: "mor-no-desert", why: "Spinoza makes the same point against Aquinas's hell in Objection V." },
                      ],
                      sources: [
                        { title: "Free Will and Luck", by: "Alfred R. Mele", year: "2006" },
                        { title: "Living Without Free Will", by: "Derk Pereboom", year: "2001" },
                        { title: "God and the Permission of Evil", by: "Jacques Maritain", year: "1966", note: "English translation of Dieu et la permission du mal (1963)." },
                        { title: "Evil and Omnipotence", by: "J. L. Mackie", year: "1955", note: "Mind 64." },
                      ],
                      children: [
                        {
                          id: "coh-b-teleo",
                          side: "theist",
                          label: "God causes every act, but not the defect that makes it sin",
                          gist: "A manipulator competes with you, but God gives you your will, sin is a lack that nobody makes, and God permits evil to bring good from it.",
                          body: [
                            "The zygote story pictures God as a manipulator, a rival cause on your level pulling strings you might have pulled yourself. God is the source of the willing itself, and {{grant}} and {{mccann|Hugh McCann}} argue that being caused by the giver of your will is being made, which differs from being handled. Sin is a [[privation|privation]], a lack, like a limp. God gives Judas's act its being, and the defect comes from the creature falling away. {{maritain}}'s ‘shatterable motions’ make the creature the first to act in that falling away.",
                            "As for {{mackie}}, God could make wills that never fall, as the saints can't sin, and for {{hart}}, who rejects ‘neutral’ two-way choice as a false picture of freedom, those wills are the freest of all. The classical answer to evil is {{augustine}}'s, that God ‘judged it better to bring good out of evil, than not to permit any evil to exist’ (*Enchiridion* 27).",
                          ],
                          quote: {
                            text: "Accordingly God is the cause of the act of sin: and yet He is not the cause of sin, because He does not cause the act to have a defect.",
                            who: "Thomas Aquinas",
                            cite: "Summa Theologiae I-II q.79 a.2 (trans. English Dominican Fathers)",
                          },
                          thinkers: ["grant", "mccann", "aquinas", "maritain", "mackie", "hart", "augustine"],
                          cedes:
                            "If a defect needed a cause the way a deed does, or the source of a will had to compete with it as a manipulator does, this would fail.",
                          see: [
                            { id: "mor-universalism", why: "Hart's view of freedom, which is not the two-way kind, supports his belief in Objection V that everyone is saved." },
                          ],
                          sources: [
                            { title: "Summa Theologiae I-II q.79 (On the External Causes of Sin)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/2079.htm" },
                            { title: "Creation and the Sovereignty of God", by: "Hugh J. McCann", year: "2012" },
                            { title: "Enchiridion on Faith, Hope and Love", by: "Augustine (trans. J. F. Shaw)", url: "https://www.newadvent.org/fathers/1302.htm" },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "coh-b-open-time",
                  side: "theist",
                  label: "An open God needs no physical ‘now’ and pushes nothing aside",
                  gist: "The open God's present is the time of his own life, which physics doesn't measure, and cosmology offers a natural cosmic clock anyway.",
                  body: [
                    "Craig's problem doesn't touch every God in time. The open God's ‘now’ is the present of his own life, much like {{newton}}'s absolute time, and no frame of reference in physics. Relativity shows only that no experiment picks out a single cosmic present, and cosmology even supplies one. Cosmic time, kept by observers at rest relative to the expanding universe, is the clock by which the universe is 13.8 billion years old. {{swinburne}}, {{hasker|Hasker}} and {{mullins}}, who put God in time, ask for nothing more.",
                    "Answering prayer doesn't make God a rival either. He gives creatures powers without settling their use, which is non-competition of another kind. Where an answer means acting in the world, the open theist owes no more than any believer in miracles, and ((nat-a-laws|Objection III)) finds no law of physics against it.",
                  ],
                  quote: {
                    text: "Absolute, True, and Mathematical Time, of it self, and from its own nature flows equably without regard to any thing external, and by another name is called Duration",
                    who: "Isaac Newton",
                    cite: "Principia (1687), Scholium to the Definitions (trans. Andrew Motte, 1729)",
                  },
                  thinkers: ["swinburne", "hasker", "mullins", "newton"],
                  cedes:
                    "If God's present had to be a physical frame of reference, or giving creatures power while leaving its use open made God one more cause among them, this would fail.",
                  see: [
                    { id: "coh-a-concur", why: "Aquinas's version of non-competition, which this one parallels without the doctrine that God has no parts." },
                  ],
                  sources: [
                    { title: "The End of the Timeless God", by: "R. T. Mullins", year: "2016" },
                    { title: "God, Time, and Knowledge", by: "William Hasker", year: "1989" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "coh-b-spinoza",
          side: "spinoza",
          label: "If freedom is acting from your nature, foreknowledge is harmless",
          gist: "If freedom means acting from your own nature, a God who knows everything you will do takes nothing from you.",
          body: [
            "Pike's dilemma assumes a kind of freedom Spinoza denies. Nothing in nature is uncaused, the mind included (Ethics II P48). People believe they are free because they are aware of what they do and don't know why they do it. In Spinoza's words, ‘men are mistaken in thinking themselves free; their opinion is made up of consciousness of their own actions, and ignorance of the causes by which they are conditioned’ (II P35 Schol.). A stone set flying, he wrote to Schuller in 1674, would think the same if it could think.",
            "For Spinoza a thing is free when it acts from the necessity of its own nature alone (I Def. 7), and a person grows freer as understanding grows. A God who knows every act takes none of that away. {{edwards}} took a similar [[compatibilism|compatibilist]] line in 1754, on Calvinist grounds, holding that freedom and being caused fit together.",
          ],
          quote: {
            text: "In the mind there is no absolute or free will; but the mind is determined to wish this or that by a cause, which has also been determined by another cause, and this last by another cause, and so on to infinity.",
            who: "Spinoza",
            cite: "Ethics II P48 (trans. R. H. M. Elwes, 1883)",
          },
          thinkers: ["spinoza", "edwards"],
          cedes:
            "Spinoza would give way if someone could describe the power to do otherwise coherently, as something other than chance or ignorance of causes.",
          see: [
            { id: "coh-b-needslib", why: "Classical theism's version of this answer, and the trouble it brings." },
            { id: "mor-repent", why: "Spinoza applies this view of freedom to guilt in Objection V, where wrongs call for understanding instead of remorse." },
            { id: "mor-no-desert", why: "The same denial of free will, turned against hell's desert in Objection V." },
          ],
          sources: [
            { title: "Ethics", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1677", url: "https://www.gutenberg.org/ebooks/3800" },
          ],
          children: [
            {
              id: "coh-b-judge",
              side: "skeptic",
              label: "Losing freedom is harmless only to a God who judges no one",
              gist: "Spinoza can shrug off lost freedom because his God judges no one, but the Christian God judges the living and the dead.",
              body: [
                "Spinoza's answer works for Spinoza because his God has no passions and loves or hates no one (Ethics V P17 Cor.). When {{oldenburg}} pressed him in 1676, he said plainly that God can't be angry, and that when Scripture calls God a judge who passes sentence, it is speaking in human terms ((mor-no-desert|Objection V)). Classical theism can't say that. Its God tests hearts, forgives and condemns. Paul, who first heard this objection, answered it with the potter and the clay and still kept ‘the judgment seat of Christ’ (2 Corinthians 5:10). A judge who settled every crime he sentences is the author punishing his characters from ((coh-b-needslib|the reply to Aquinas)).",
              ],
              quote: {
                text: "Thou wilt say then unto me, Why doth he yet find fault? For who hath resisted his will?",
                who: "Paul, voicing an objector",
                cite: "Romans 9:19 (KJV)",
              },
              thinkers: ["spinoza", "oldenburg"],
              cedes:
                "If a God who settles every choice could still justly condemn the chooser, or the Christian God judged no one, this would fail.",
              see: [
                { id: "mor-spinoza-few", why: "The answer in Objection V, that blame survives determinism, and that on Spinoza's own view the excusable still perish." },
              ],
              sources: [
                {
                  title: "The Chief Works of Benedict de Spinoza, vol. 2 (Correspondence)",
                  by: "trans. R. H. M. Elwes",
                  year: "1883",
                  url: "https://archive.org/details/chiefworksofbene02spin",
                  note: "Letters 75–79 with Oldenburg. The 1891 printing is linked.",
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── Part 3: Euthyphro ───────────────────────── */
    {
      id: "coh-c",
      side: "skeptic",
      label: "Either God's commands are arbitrary or goodness stands above God",
      gist: "If cruelty is wrong only because God forbids it, he could have made it right, and if he forbids it because it's wrong, goodness doesn't depend on him.",
      body: [
        "At the porch of the King Archon, on his way to answer the charges that would cost him his life, Socrates questions Euthyphro, a man prosecuting his own father for murder and sure the gods approve. The [[euthyphro-dilemma|Euthyphro dilemma]] comes from that conversation. For one God, the first option says right is whatever he commands, so had he commanded cruelty, cruelty would have been right. {{ockham}}, on the standard reading, accepted this and held that by his absolute power God could command even hatred of himself.",
        "Others recoiled. {{leibniz}} asked, ‘why praise him for what he has done, if he would be equally praiseworthy in doing the contrary?’ (*Discourse on Metaphysics* §2). {{cudworth}} argued that it makes justice a mere name, since not even omnipotence can make a thing what it is by will alone. If instead God commands kindness because it is good, goodness is a standard God consults, and morality no longer depends on him.",
      ],
      quote: {
        text: "The point which I should first wish to understand is whether the pious or holy is beloved by the gods because it is holy, or holy because it is beloved of the gods.",
        who: "Plato (Socrates speaking)",
        cite: "Euthyphro 10a (trans. Benjamin Jowett)",
      },
      thinkers: ["plato", "ockham", "leibniz", "cudworth"],
      cedes:
        "A third option that made goodness depend on God without making it his arbitrary choice would answer this.",
      see: [
        { id: "mor-hell", why: "Objection V calls a doctrine monstrous, which assumes some standard of goodness, and this part asks where that standard comes from." },
      ],
      sources: [
        { title: "Theological Voluntarism", by: "Stanford Encyclopedia of Philosophy (Mark Murphy)", url: "https://plato.stanford.edu/entries/voluntarism-theological/" },
        { title: "Euthyphro", by: "Plato (trans. Benjamin Jowett)", url: "https://www.gutenberg.org/ebooks/1642" },
        { title: "Discourse on Metaphysics", by: "G. W. Leibniz (trans. George R. Montgomery)", year: "1902", url: "https://archive.org/details/cu31924032339511" },
        { title: "A Treatise Concerning Eternal and Immutable Morality", by: "Ralph Cudworth", year: "1731", url: "https://archive.org/details/treatiseconcerni00cudw_1" },
      ],
      children: [
        {
          id: "coh-c-nature",
          side: "theist",
          label: "God is goodness itself, so neither option of the dilemma applies",
          gist: "God neither obeys a standard nor invents one, because he is goodness itself, so his commands are neither arbitrary nor answerable to anything above him.",
          body: [
            "The dilemma assumes goodness must be either a rule above God or a decree from him. Classical theism says goodness is God. For {{aquinas|Aquinas}}, goodness is being considered as worth wanting, and God, who is being itself, is good by his own essence and not by sharing in something else. {{davies}} argues that God is therefore no moral agent meeting a standard. He is the Good every creature seeks, what {{hart|Hart}} calls the end of all desire.",
            "So this God's commands can't be arbitrary, because his nature couldn't be otherwise, and they answer to nothing above him, because nothing is. God can make no exceptions to the central precepts of the moral law, those that protect justice (ST I-II q.100 a.8), though he freely adds laws such as Israel's ceremonial rules. {{murphy}} develops the idea in *God's Own Ethics* (2017).",
          ],
          quote: {
            text: "Hence it is manifest that God alone has every kind of perfection by His own essence; therefore He Himself alone is good essentially.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I q.6 a.3 (trans. English Dominican Fathers)",
          },
          thinkers: ["aquinas", "davies", "hart", "murphy"],
          cedes:
            "If calling God ‘goodness itself’ turned out to hide a standard he meets, or to be a name for whatever he happens to be, this would fail.",
          see: [
            { id: "mor-not-agent", why: "The same classical claim, that God is not one moral agent among others, applied to hell and evil in Objection V." },
          ],
          sources: [
            { title: "Summa Theologiae I q.6 (The Goodness of God)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1006.htm" },
            { title: "The Reality of God and the Problem of Evil", by: "Brian Davies", year: "2006" },
          ],
          children: [
            {
              id: "coh-c-trivial",
              side: "skeptic",
              label: "Calling God good needs a prior standard, or says nothing",
              gist: "Either God's nature is good because it meets a standard we can state, so the standard comes first, or ‘God is good’ only means ‘God is God’.",
              body: [
                "Moving goodness into God's nature moves the dilemma up a floor. If God's nature is good because it is loving, just and merciful, then those qualities are the standard, and we can state it without mentioning God. If it is good only because it is God's, then ‘God is good’ says that God is like God, which praises nothing. {{morriston}} offers a test case. Had God's nature been indifferent to suffering, would indifference then have been good?",
                "Our knowledge runs the same way. We judge God good because his nature matches what we already take goodness to be, which is why the hard cases in Scripture trouble believers and why they look for readings they can call good. {{mill}} drew the line in 1865: ‘I will call no being good, who is not what I mean when I apply that epithet to my fellow-creatures’.",
              ],
              quote: {
                text: "Even the Holy One of the Gospels must first be compared with our ideal of moral perfection before we can recognise Him as such",
                who: "Immanuel Kant",
                cite: "Groundwork of the Metaphysics of Morals (1785), Second Section (trans. T. K. Abbott, as Fundamental Principles of the Metaphysic of Morals)",
              },
              thinkers: ["morriston", "mill", "kant"],
              cedes:
                "If ‘God is good’ could tell us something without measuring God against a standard that comes first, in what we know or in fact, this would fail.",
              see: [
                { id: "mor-mansel", why: "Mill's ‘to hell I will go’, aimed at the doctrine of hell in Objection V." },
              ],
              sources: [
                { title: "What If God Commanded Something Terrible? A Worry for Divine-Command Meta-Ethics", by: "Wes Morriston", year: "2009" },
                { title: "Fundamental Principles of the Metaphysic of Morals", by: "Immanuel Kant (trans. T. K. Abbott)", year: "1785", url: "https://www.gutenberg.org/ebooks/5682" },
              ],
              children: [
                {
                  id: "coh-c-terminus",
                  side: "theist",
                  label: "God is the standard of goodness and isn't measured by it",
                  gist: "Every theory of ethics stops at something good that isn't good by a further standard, and for believers that stopping point is God.",
                  body: [
                    "Every ethics faces the regress this objection finds. {{plato}}'s Form of the Good makes other things good without being good by sharing in anything further, and in the *Republic* Socrates says ‘the good is not essence, but far exceeds essence in dignity and power’. A godless realist's basic moral facts are just true. {{alston}} proposed that for a believer the stopping point is a particular, God. As the standard metre bar once fixed what a metre is, God fixes what goodness is, so asking whether God meets the standard misunderstands what a standard is.",
                    "‘God is good’ isn't empty either. {{adams-robert-m}} points out that people called lakes and rain ‘water’ long before anyone knew it was H₂O, and our examples of goodness fix what ‘good’ is about in the same way. Then ‘what if God's nature were cruel?’ has an impossible premise, like asking what water would be if it weren't H₂O.",
                  ],
                  quote: {
                    text: "Why callest thou me good? there is none good but one, that is, God.",
                    who: "Jesus, to the rich young man",
                    cite: "Mark 10:18 (KJV)",
                  },
                  thinkers: ["plato", "alston", "adams-robert-m"],
                  cedes:
                    "If a person couldn't be the standard of a value the way a paradigm can, or the water comparison failed for goodness, this would fail.",
                  see: [
                    { id: "nat-b-brute", why: "The same question about where explanation stops, asked of the universe in Objection III." },
                  ],
                  sources: [
                    { title: "Finite and Infinite Goods: A Framework for Ethics", by: "Robert Merrihew Adams", year: "1999" },
                    { title: "Some Suggestions for Divine Command Theorists", by: "William P. Alston", year: "1990" },
                  ],
                  children: [
                    {
                      id: "coh-c-brute",
                      side: "skeptic",
                      label: "Moral facts themselves can be the stopping point",
                      gist: "If something must be good with no further explanation, it can be moral facts like ‘cruelty is wrong’, which are no more unexplained than God.",
                      body: [
                        "The stopping point needn't be a person. {{wielenberg}} defends [[robust-realism|moral realism without God]], on which basic ethical facts, such as that causing pain for fun is wrong, are objective and necessary and need no foundation. A believer's stopping point is arguably just as unexplained and adds a being, with all the trouble of Parts 1 and 2. If God's commands bind because God is good, as Adams holds, then goodness is doing the work.",
                        "{{horgan}} and {{timmons}} answer the water comparison with a Moral Twin Earth whose people anchor ‘good’ to different examples. When we argue with them we seem to disagree, which couldn't happen if ‘good’ worked like ‘water’. And {{morriston}} argues that questions with impossible premises, like ‘what if God were cruel?’, still have better and worse answers, so the theory owes us one.",
                      ],
                      quote: {
                        text: "If you are going to say, as theologians do, that God is good, you must then say that right and wrong have some meaning which is independent of God's fiat, because God's fiats are good and not bad independently of the mere fact that He made them.",
                        who: "Bertrand Russell",
                        cite: "“Why I Am Not a Christian” (1927)",
                      },
                      thinkers: ["wielenberg", "horgan", "timmons", "morriston", "russell"],
                      cedes:
                        "If moral facts with no further explanation couldn't account for why morality binds us, or how creatures like us come to know them, this would fail.",
                      see: [
                        { id: "coh-c-spinoza", why: "Spinoza rejects moral facts that hold apart from us, so he and Wielenberg can't both be right." },
                      ],
                      sources: [
                        { title: "Robust Ethics: The Metaphysics and Epistemology of Godless Normative Realism", by: "Erik J. Wielenberg", year: "2014" },
                        { title: "Troubles on Moral Twin Earth: Moral Queerness Revived", by: "Terence Horgan and Mark Timmons", year: "1992", note: "Synthese 92." },
                        { title: "Why I Am Not a Christian", by: "Bertrand Russell", year: "1927", url: "https://users.drew.edu/~jlenz/whynot.html" },
                      ],
                      children: [
                        {
                          id: "coh-c-person",
                          side: "theist",
                          label: "Only a person can make goodness bind us",
                          gist: "Bare facts just sit there, but an obligation is a claim someone makes on us, and a personal God explains both why goodness commands and how we know it.",
                          body: [
                            "A simpler theory wins only if it explains as much, and [[brute-fact|brute]] moral facts, facts with no further explanation, leave obligation unexplained. {{evans}} argues that an obligation is a demand and needs someone who makes it. For {{adams-robert-m|Adams}}, God's goodness is why his commands deserve a hearing, and the command makes a thing owed, as a good friend's request binds where the same act unasked would only be kind. That stops {{cudworth|Cudworth}}'s regress, since the reason to obey is God's goodness and not another command.",
                            "{{street}} argued in 2006 that if moral facts affect nothing, it would be luck for evolved creatures to track them. If one God grounds the facts and made the minds, the luck disappears. Even {{mackie}} granted in 1982 that objective values would be strange in a godless world and would make a god more likely.",
                          ],
                          quote: {
                            text: "For when the Gentiles, which have not the law, do by nature the things contained in the law, these, having not the law, are a law unto themselves: Which shew the work of the law written in their hearts",
                            who: "Paul",
                            cite: "Romans 2:14–15 (KJV)",
                          },
                          thinkers: ["evans", "adams-robert-m", "cudworth", "street", "mackie"],
                          cedes:
                            "If moral realism without God could explain the authority of obligation, and our knowledge of moral facts, as well as theism does, this would fail.",
                          see: [
                            { id: "nat-b-minds", why: "The same reliability worry, about reason itself, in Objection III." },
                          ],
                          sources: [
                            { title: "God and Moral Obligation", by: "C. Stephen Evans", year: "2013" },
                            { title: "A Darwinian Dilemma for Realist Theories of Value", by: "Sharon Street", year: "2006" },
                            { title: "A Debate on God and Morality", by: "William Lane Craig and Erik J. Wielenberg (Adam Lloyd Johnson, ed.)", year: "2020" },
                          ],
                          children: [
                            {
                              id: "coh-c-authority",
                              side: "skeptic",
                              label: "A divine command's authority is as unexplained as a brute duty",
                              gist: "If obeying God is owed before he commands anything, that duty is as unexplained as any godless duty, and godless realists can explain moral knowledge too.",
                              body: [
                                "{{evans}} shows that commands need a commander, which leaves open whether obligation needs one. ‘Cruelty is wrong’ binds unspoken, as a valid proof compels agreement unasked. {{adams-robert-m|Adams}}'s friend brings back {{cudworth}}'s question. A friend's request binds because we already owe friends a hearing, so God's command binds only if heeding God is already owed. That prior duty can't be commanded without a regress, so it is a [[brute-fact|brute]] moral fact, and if it rests on God's goodness, goodness does the binding.",
                                "{{wielenberg}} answers {{street}} with a ‘third-factor’ account (2010). The mental abilities evolution gave us make us beings with rights and lead us to believe we have them, so fact and belief share a cause. {{mackie}}'s 1982 concession was only that objective values would point to a god if there were any, and he held there are none.",
                              ],
                              quote: {
                                text: "For it was never heard of, that any one founded all his authority of commanding others, and others obligation or duty to obey his commands, in a law of his own making, that men should be required, obliged, or bound to obey him.",
                                who: "Ralph Cudworth",
                                cite: "A Treatise Concerning Eternal and Immutable Morality (1731), Book I, ch. 2, §3",
                              },
                              thinkers: ["evans", "adams-robert-m", "cudworth", "wielenberg", "street", "mackie"],
                              cedes:
                                "If the duty to heed God needed no grounding of its own while every godless duty still did, this would fail.",
                              see: [
                                { id: "mor-convicts", why: "Wielenberg again in Objection V, defending equal human worth with nothing to ground it." },
                              ],
                              sources: [
                                { title: "On the Evolutionary Debunking of Morality", by: "Erik J. Wielenberg", year: "2010", note: "Ethics 120." },
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
              id: "coh-c-spinoza",
              side: "spinoza",
              label: "Every ‘freely added’ command is either forced or arbitrary",
              gist: "Each command God freely adds is either required by his goodness, and so necessary, or not required, and so arbitrary after all.",
              body: [
                "The reply escapes Euthyphro for morality's central rules and leaves the rest to God's free choice. A command God ‘freely adds’, like the order to sacrifice Isaac, was either required by God's goodness or not. If it was, God chose nothing, and that is Spinoza's own God (Ethics I P33). If not, it holds only because God willed it, the arbitrary option. Spinoza even ranks the view that all depends on God's fiat ‘less far from the truth’ than the view that God aims at the good, since the latter sets a standard outside God (I P33 Schol. 2).",
                "‘Good’, for Spinoza, means ‘that which we certainly know to be useful to us’ (IV Def. 1), measured against a model of human nature we set before ourselves (IV Pref.). Cruelty is bad because it weakens our power to act and understand, and no one chose that.",
              ],
              quote: {
                text: "As for the terms good and bad, they indicate no positive quality in things regarded in themselves, but are merely modes of thinking, or notions which we form from the comparison of things one with another.",
                who: "Spinoza",
                cite: "Ethics IV Preface (trans. R. H. M. Elwes, 1883)",
              },
              thinkers: ["spinoza"],
              cedes:
                "Spinoza would give way to a command that was neither required by God's nature nor a bare decree, and was still chosen for a reason.",
              see: [
                { id: "coh-a-collapse", why: "Necessity in God's nature leads back to the argument that God couldn't have made any other world." },
                { id: "mor-pity", why: "Spinoza's ethic of what reason finds useful, tested against Christian pity in Objection V." },
                { id: "nat-b-contrast", why: "The same forced-or-arbitrary dilemma, aimed at creation itself in Objection III." },
              ],
              children: [
                {
                  id: "coh-c-natlaw",
                  side: "theist",
                  label: "A command can fit God's goodness without being forced by it",
                  gist: "Between required and arbitrary there is fitting, since God can give a law for reasons that make it good without making it the only good law.",
                  body: [
                    "Spinoza's dilemma leaves out the ordinary way reasons work. {{aquinas|Aquinas}} says God ‘wills this to be as means to that; but does not will this on account of that’ (ST I q.19 a.5). Each thing he wills fits an end, yet nothing forces his willing it. A sabbath serves rest and worship, and another law might have served them too. On this view Spinoza's God chooses nothing, while Aquinas's chooses everything except his own character ((nat-b-reasons|Objection III)).",
                    "On goodness the two are closer than Spinoza admits. His ‘useful to us’ is what increases a nature's power of acting, which is nearly Aquinas's good. For Aquinas the first precept of [[natural-law|natural law]], the moral law built into human nature, is that ‘good is to be done and pursued, and evil is to be avoided’ (ST I-II q.94 a.2). Spinoza's [[conatus|conatus]], each thing's striving to persist in its being, and Aquinas's natural inclination look like one striving, though Spinoza's has no lawgiver behind it.",
                  ],
                  quote: {
                    text: "The will of God is reasonable, not because anything is to God a cause of willing, but in so far as He wills one thing to be on account of another.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.5 ad 1 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas"],
                  cedes:
                    "If every reason for a command either forced it or explained nothing about why God gave it, this would fail.",
                  see: [
                    { id: "nat-b-reasons", why: "The same answer about creation in Objection III, where reasons explain a free choice without forcing it." },
                    { id: "coh-a-extrinsic", why: "Why fixed goodness doesn't make creation necessary." },
                    { id: "nat-b-contrast", why: "The forced-or-arbitrary response, aimed at creation in Objection III." },
                  ],
                  sources: [
                    { title: "Summa Theologiae I q.19 (The Will of God)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1019.htm" },
                    { title: "The Natural Law Tradition in Ethics", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/natural-law-ethics/" },
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
    title: "A God who thinks and loves but doesn't choose",
    body: [
      "Spinoza grants more of the classical reply than either side expects. His God is the [[immanent-cause|immanent cause]] of everything, the cause things exist in, and competes with nothing (Ethics I P18). He denies [[libertarian-freedom|libertarian freedom]], the power to do otherwise (II P48). So on his view a God who causes and knows every act takes nothing from the only freedom there is, acting from your own nature (I Def. 7). For him the first two parts are disputes among believers.",
      "Spinoza's God thinks ((coh-a-dogstar|with a mind ours is part of)), and he loves, but only with the [[amor-dei-intellectualis|intellectual love]] by which he loves himself. Your own understanding love of God is part of that love (V P36). So, in his words, ‘strictly speaking, God does not love or hate anyone’ (V P17 Cor.). Ordinary love is joy at an outside cause, and God has no outside. Where ((coh-a-analogy|Aquinas)) sees a likeness across a gap, Spinoza sees one love, looked at from the part and from the whole.",
      "Spinoza denies that God could have done otherwise, and each believer's answer in this objection needs him to be wrong. The answers are ((coh-a-extrinsic|one act with many possible worlds)), knowing by causing without causing sin, and commands fixed in their essentials but free in their details. Spinoza says no because everything has a reason ([[psr|the principle of sufficient reason]]). He accepts the consequence, which philosophers call [[necessitarianism|necessitarianism]], that this world, horrors included, is the only one there could have been, brought into being ‘in the highest perfection’ (I P33 Schol. 2). And ‘good’, for him, measures what helps beings like us flourish (IV Pref.).",
    ],
    quote: {
      text: "Hence it follows that God, in so far as he loves himself, loves man, and, consequently, that the love of God towards men, and the intellectual love of the mind towards God are identical.",
      who: "Spinoza",
      cite: "Ethics V P36 Cor. (trans. R. H. M. Elwes, 1883)",
    },
  },

  lineage: [
    "m-coh-euthyphro",
    "m-coh-seabattle",
    "m-coh-boethius",
    "m-coh-ghazali",
    "m-coh-aquinas",
    "m-coh-molina",
    "m-coh-leibniz",
    "m-coh-ethics",
    "m-coh-hume",
    "m-coh-pike",
    "m-coh-grounding",
    "m-coh-kenny",
    "m-coh-goods",
    "m-coh-mullins",
    "m-coh-hart",
    "m-coh-tomaszewski",
  ],

  reading: [
    {
      title: "The Experience of God: Being, Consciousness, Bliss",
      by: "David Bentley Hart",
      year: "2013",
      url: "https://yalebooks.yale.edu/book/9780300209358/the-experience-of-god/",
      note: "A full statement of classical theism, in which God is the source of all being and not one more being.",
    },
    {
      title: "The God of the Philosophers",
      by: "Anthony Kenny",
      year: "1979",
      note: "An agnostic argues carefully that the traditional attributes, especially knowing everything, don't fit together.",
    },
    {
      title: "Divine Foreknowledge: Four Views",
      by: "James K. Beilby and Paul R. Eddy (eds.)",
      year: "2001",
      note: "Open theism (Boyd), simple foreknowledge (Hunt), Molinism (Craig) and the Augustinian-Calvinist view (Helm), each answered by the others.",
    },
    {
      title: "A Debate on God and Morality",
      by: "William Lane Craig and Erik J. Wielenberg (Adam Lloyd Johnson, ed.)",
      year: "2020",
      note: "Divine command theory against moral realism without God, with replies from both sides.",
    },
    {
      title: "The End of the Timeless God",
      by: "R. T. Mullins",
      year: "2016",
      note: "A Christian philosopher argues against divine simplicity and a God outside time. W. Matthews Grant's Free Will and God's Universal Causality (2019) gives the classical reply.",
    },
    {
      title: "Ethics",
      by: "Baruch Spinoza (trans. R. H. M. Elwes)",
      year: "1677",
      url: "https://www.gutenberg.org/ebooks/3800",
      note: "Part I covers God, necessity and the Dog Star passage. Part V covers the intellectual love of God.",
    },
  ],
};

export default coherence;
