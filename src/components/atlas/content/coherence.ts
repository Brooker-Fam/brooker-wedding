import type { Objection } from "../types";

/* Objection I — Coherence.
   Three prongs: (A) divine vs natural causation, (B) foreknowledge vs freedom,
   (C) Euthyphro. Children attack their parent. Quotes were checked against the
   cited public-domain texts: Elwes's Spinoza (Ethics 1883; Letters, 1891
   printing), the English Dominican Fathers' Summa Theologiae (New Advent),
   H. R. James's Boethius (1897), Dods's City of God (1871), Shaw's Enchiridion
   (New Advent), Jowett's Euthyphro, the KJV, and Hume's Enquiry (Gutenberg). */

const coherence: Objection = {
  id: "coherence",
  numeral: "I",
  short: "Coherence",
  title: "The idea of God doesn't hold together",
  objection:
    "The idea of God doesn't hold together: divine causation crowds out natural causation, God's foreknowledge rules out our freedom, and Euthyphro's dilemma leaves goodness either arbitrary or above God.",
  counter:
    "Classical theism (Aquinas, David Bentley Hart) says the objection attacks a God who is one cause among others; God instead grounds every cause without competing with them, which is the same move Spinozism makes, but with a personal God. Goodness is God's nature, which gets around Euthyphro. And calling God incoherent means every model has to fail, while timelessness, Molinism and open theism each claim a consistent account of foreknowledge.",
  dek:
    "Can one God cause everything without making nature idle, know everything without making you unfree, and be goodness itself without making goodness arbitrary? The first two puzzles are mostly a family quarrel among theists, since a Spinozist's God also causes and knows everything; the objector's real target is a God who *chooses*. He wins only if every model of God fails; the theist needs just one that passes all three tests at once.",
  question:
    "Can a God who causes everything, knows every free choice and is goodness itself still be someone who chooses?",

  prongs: [
    /* ───────────────────────── Prong A: divine vs natural causation ───────────────────────── */
    {
      id: "coh-a",
      side: "skeptic",
      label: "God's causing crowds out nature's, and theism needs both",
      gist: "If fire's own power is enough to burn cotton, God's causing adds nothing; if it isn't, fire is a stage prop and God does all the burning, and theism can afford neither.",
      body: [
        "Theists built this dilemma themselves. {{ghazali}} argued in 1095 that no one can prove fire must burn cotton: God may create the burning directly, and the regularity is only his custom. {{malebranche}} made God the one true cause and creatures mere ‘occasions’, which is [[occasionalism|occasionalism]]. {{hume}} replied that long before such a theory ends, ‘we are got into fairy land’.",
        "Concurrence, the classical view that God acts in every act of every creature, was meant to escape this, but the scholastics saw the trap. If the creature's power suffices, God's concurring is idle, and {{durandus}} concluded that God merely keeps things in being. {{freddoso}}, a leading modern defender of concurrence, closes that exit himself: conservation is not enough, since God cannot keep an effect in being from its first instant without already acting in its production. If the creature's power does not suffice, occasionalism returns. Physics sharpens it: if every physical event has a sufficient physical cause ([[causal-closure|causal closure]]), {{kim}}'s [[causal-exclusion|exclusion principle]] leaves no slot for a second one.",
      ],
      quote: {
        text: "Thus, according to these philosophers, every thing is full of God. Not content with the principle, that nothing exists but by his will, that nothing possesses any power but by his concession: They rob nature, and all created beings, of every power, in order to render their dependence on the Deity still more sensible and immediate.",
        who: "David Hume",
        cite: "An Enquiry Concerning Human Understanding (1748; Selby-Bigge ed.), sect. VII, pt. 1, §56",
      },
      thinkers: ["ghazali", "malebranche", "hume", "durandus", "freddoso", "kim"],
      cedes:
        "I'd concede if someone could say what God's concurrence adds to a burning that fire's power does not, without making fire's power idle, or show that theism can let fire do nothing.",
      see: [
        { id: "nat-a-closure", why: "Causal closure again, aimed at miracles in Objection III: physics keeps finding sufficient physical causes." },
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
          label: "A personal God freely gives fire its power, never as a rival",
          gist: "God is not a bigger cause on fire's level; he freely gives fire its being and its power to burn, so the burning is wholly fire's and wholly God's, in different ways.",
          body: [
            "The dilemma treats God and fire as two horses sharing one load, so that whatever one pulls, the other doesn't. Classical theism denies exactly that. {{aquinas}} has God work in every agent as the source of its being, its power and its acting, on a different level from it ([[primary-secondary-causation|primary and secondary causation]]). {{farrer}} called this double agency, and {{tanner}} a non-competitive relation; the old picture is an author, whose characters' every line is wholly theirs and wholly his. God is not a being among beings, {{hart}} insists, but the reason there are beings at all.",
            "The Spinozist knows this move. Spinoza's God is the [[immanent-cause|immanent cause]] of all things (Ethics I P18), conditioning every finite cause (I P26) while each finite thing is caused by another (I P28): two complete stories, one vertical, one horizontal. The theist adds only that the source is a person who gives being freely.",
          ],
          quote: {
            text: "One action does not proceed from two agents of the same order. But nothing hinders the same action from proceeding from a primary and a secondary agent.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I q.105 a.5 ad 2 (trans. English Dominican Fathers)",
          },
          thinkers: ["aquinas", "farrer", "tanner", "hart"],
          cedes:
            "I'd concede if a cause working on a different level from fire could be shown to compete with fire anyway, or if a source of all being could not act freely.",
          see: [
            { id: "hid-hart-light", why: "Hart's God as the light we see by, not an object to be found: the same non-competition, applied to hiddenness." },
            { id: "coh-b-classical", why: "The same move, extended from fire's burning to your choosing." },
            { id: "nat-a-power", why: "Whether a God who never competes can still raise the dead: Spinoza presses it in Objection III." },
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
              gist: "If God has no parts, his act of creating just is God; God exists necessarily, so that act, and the world it makes, exist necessarily too: Spinoza's world, not a free creation.",
              body: [
                "The reply's God is the classical God of [[divine-simplicity|divine simplicity]]: no parts, no distinctions, essence and existence and will all one. Now run the logic. Whatever is identical with a necessary being is necessary. God's act of willing this world is identical with God. So that act is necessary, and so is the world it wills. Free creation, the very thing that makes this God personal rather than Spinozist, has quietly become [[modal-collapse|modal collapse]].",
                "This is no outsider's trick. {{mullins}}, a Christian philosopher, made the case in 2013 and again, with Shannon Byrd, in 2022. With {{schmid|Joseph Schmid}} he aimed an ‘aloneness argument’ (2022) at the obvious escape: if God is intrinsically the same whether he creates or stays alone, nothing in God makes the difference. {{spinoza}} drew the conclusion openly and welcomed it. The theist who says ‘the same move, plus a person’ has paid full price for Spinoza's God.",
              ],
              quote: {
                text: "Things could not have been brought into being by God in any manner or in any order different from that which has in fact obtained.",
                who: "Spinoza",
                cite: "Ethics I P33 (trans. R. H. M. Elwes, 1883)",
              },
              thinkers: ["mullins", "schmid", "spinoza"],
              cedes:
                "I'd concede if a simple God's act of creating could differ across possible worlds without God himself differing, and without that difference being brute.",
              see: [
                { id: "nat-b-necess", why: "Spinoza reaches the same necessity from the principle of sufficient reason, in Objection III." },
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
                  label: "God's one act is necessary; the world it makes is not",
                  gist: "God's single act is the same in every possible world; only the creatures it brings about differ, so God's necessity does not pass to the world he makes.",
                  body: [
                    "The collapse argument slides from God's act to its outcome. {{aquinas|Aquinas}} drew the line: God wills his own goodness necessarily, but that goodness is complete without creatures, so his willing them is necessary only ‘by supposition’, the way Socrates must be sitting if he is sitting. {{leibniz}}, who talked with Spinoza in The Hague in 1676 and spent decades answering him, called it the difference between absolute and hypothetical necessity.",
                    "{{tomaszewski}} argues that the usual argument is invalid: ‘God's act of creating’ picks out God's act only in worlds where there is a creation, so it is not the fixed name the argument needs. {{grant}}'s ‘extrinsic’ model makes ‘God wills this world’ true partly because of the world itself, the way ‘Everest is being photographed’ can go from false to true with no change in the mountain. What makes the difference between a world and none is a choice, explained by its reasons and not forced by them. The necessity of the source is not the necessity of the stream.",
                  ],
                  quote: {
                    text: "Hence, since the goodness of God is perfect, and can exist without other things inasmuch as no perfection can accrue to Him from them, it follows that His willing things apart from Himself is not absolutely necessary.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.3 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas", "leibniz", "tomaszewski", "grant"],
                  cedes:
                    "I'd concede if God's being the same in every world, while the world differs, left the existence of this world with no explanation at all.",
                  see: [
                    { id: "nat-b-reasons", why: "How a free choice can be explained without being forced: the theist's case, argued in Objection III." },
                    { id: "nat-b-contrast", why: "The rejoinder there: a reason that fits either choice is a brute fact in disguise." },
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
              gist: "A mind that thinks up the world before the world exists would be as unlike ours as the Dog Star is unlike a barking dog; the only divine mind that makes sense is one ours is part of.",
              body: [
                "The reply borrows Spinoza's move, which works because things are *in* God (Ethics I P15, P18), and adds ‘a person’. The addition fails. A personal creator is an intellect and will that exist before things and decide them. Such an intellect would cause both what our minds are and that they exist, and a cause differs from its effect in exactly what it gives. A father causes his son's existence, not his human nature, so the two share a nature; a mind that caused the very nature of minds would share nothing with ours but the name (I P17 Schol.).",
                "Spinoza does not deny that God thinks. Thought is an attribute of God (II P1), and the human mind is part of God's infinite intellect (II P11 Cor.): [[univocity|univocal]] thought, the same kind as ours. What he denies is a mind that precedes and chooses the world. ‘Personal’, in the counter's sense, means either a magnified human or nothing at all.",
              ],
              quote: {
                text: "… intellect and will, which should constitute the essence of God, would perforce be as far apart as the poles from the human intellect and will, in fact, would have nothing in common with them but the name; there would be about as much correspondence between the two as there is between the Dog, the heavenly constellation, and a dog, an animal that barks.",
                who: "Spinoza",
                cite: "Ethics I P17 Schol. (trans. R. H. M. Elwes, 1883)",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if someone gave real content to a divine intellect prior to things, one that neither copies ours nor shrinks to a name.",
              see: [
                { id: "hid-love-emptied", why: "The same dilemma for divine ‘love’, in Objection II: stretch the word that far and it stops saying anything." },
                { id: "evi-a-imagination", why: "Spinoza on a God known by feeling: imagination, not knowledge." },
              ],
              children: [
                {
                  id: "coh-a-analogy",
                  side: "theist",
                  label: "Analogy speaks truly of God without making him one of us",
                  gist: "‘Wise’ said of God and of Socrates is neither the same meaning nor a pun: God has first what Socrates has by gift, as a builder's mind holds first what the house displays.",
                  body: [
                    "The dog-star dilemma offers two options, the same meaning or none, and skips the third. {{aquinas|Aquinas}} held that words like ‘wise’ and ‘good’ are said of God [[analogy-of-being|by analogy]], the way ‘bright’ is said of the sun and of the wall it lights: not the same brightness, not unrelated either, and the sun's comes first. A cause cannot give what it lacks; whatever perfection is in an effect is in its cause, ‘in a more eminent degree’ (ST I q.4 a.2).",
                    "Nor is a mind that comes before its works a stranger to ours. Ours does it daily: an architect's plan exists before the house and causes it, and Aquinas compares God's knowledge to the knowledge of the artificer (ST I q.14 a.8). If priority to things made a mind alien, every builder would be a dog-star. Aquinas also kept a lesson from {{maimonides}}, who went further and allowed only [[apophatic|negative theology]]: analogy tells us truly *that* God is wise, never what God's wisdom is like.",
                  ],
                  quote: {
                    text: "Now this mode of community of idea is a mean between pure equivocation and simple univocation. For in analogies the idea is not, as it is in univocals, one and the same, yet it is not totally diverse as in equivocals; …",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.13 a.5 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas", "maimonides"],
                  cedes:
                    "I'd concede if analogical speech about God, looked at closely, always collapsed into either the same meaning as ours or no meaning at all.",
                  see: [
                    { id: "hid-hart-personal", why: "The ground of being as infinite mind and love: Hart's version, in Objection II." },
                    { id: "hid-rea-love", why: "Rea's answer to hiddenness leans on the same analogy: divine love needn't look like a parent's." },
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
                      gist: "If ‘wise’ means something different of God, no argument carries us from wise creatures to a wise God; give the word a shared core and God is back on our scale, a rival after all.",
                      body: [
                        "The reply's sun and wall show the problem: ‘bright’ works there because one thing, light, is in both. Take that away and the inference fails. {{scotus|Duns Scotus}}, a Franciscan who shared Aquinas's faith, made the point against him: an argument that shifts the meaning of ‘wise’ between premise and conclusion proves nothing, so if creatures teach us anything about God, some concept must apply to both in the same sense (*Ordinatio* I d.3). {{alston}} reached the same verdict in 1993, finding that Aquinas's analogies need a univocal core, and Thomas Williams titled a 2005 defense ‘The Doctrine of Univocity Is True and Salutary’.",
                        "So the reply must choose. With a shared core, God's wisdom is our wisdom without its limits: one more item on the scale of beings, larger but comparable, exactly the ‘being among beings’ that {{hart|Hart}} and {{tanner|Tanner}} disowned so that God would never compete with fire. Without the core, ‘wise’ and ‘personal’ give us nothing to reason with. The Dog Star returns either way.",
                      ],
                      thinkers: ["scotus", "alston", "hart", "tanner"],
                      cedes:
                        "I'd concede if an analogical term could carry an inference from creatures to God with no core of meaning shared by both.",
                      see: [
                        { id: "coh-a-concur", why: "A shared core puts God back on fire's scale: the competition non-competition was meant to end." },
                        { id: "hid-love-emptied", why: "The same squeeze on divine ‘love’, in Objection II." },
                        { id: "mor-mansel", why: "Mill's version in Objection V: a goodness with no shared sense is empty praise." },
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
          label: "Let God do all the causing: occasionalism holds together",
          gist: "Take the dilemma's second horn: God alone causes, and nature's laws are the steady habits of his will; that picture is consistent, and a charge of incoherence needs every model to fail.",
          body: [
            "The dilemma assumes theism needs fire to have powers of its own. It needs only that God be the source of all, and one consistent way to say so takes the second horn. {{ghazali|Al-Ghazali}} held that fire and cotton touch and God creates the burning. {{malebranche|Malebranche}} argued, before Hume, that we never perceive a necessary connection between any creature and its effect, and found one only in God's will. Hume kept the argument and dropped God.",
            "Nothing in science is lost. The laws still hold, because God is faithful; they describe how he customarily acts, as reliably as any power in things would. {{mccann|Hugh McCann}} and Jonathan Kvanvig defended a modified occasionalism in 1991, and {{plantinga}} gave it a sympathetic hearing in 2016. Hume's ‘fairy land’ is a sneer, not a contradiction. To call the idea of God incoherent, this model has to fail too.",
          ],
          thinkers: ["ghazali", "malebranche", "mccann", "plantinga"],
          cedes:
            "I'd concede if a God who does all the causing contradicted something theism cannot give up, not merely common sense.",
          see: [
            { id: "coh-a-concur", why: "The classical alternative: God gives creatures real power instead of doing everything himself." },
          ],
          sources: [
            { title: "The Occasionalist Proselytizer: A Modified Catechism", by: "Hugh J. McCann and Jonathan L. Kvanvig", year: "1991", note: "Philosophical Perspectives 5." },
            { title: "Law, Cause, and Occasionalism", by: "Alvin Plantinga", year: "2016", note: "In Reason and Faith, ed. Michael Bergmann and Jeffrey E. Brower." },
          ],
          children: [
            {
              id: "coh-a-sinauthor",
              side: "skeptic",
              label: "If God alone causes, God alone does every evil deed",
              gist: "On occasionalism the murderer's stab is God's work and the murderer supplies only the occasion; a holy God who is the sole agent of every sin is the contradiction, and the counter's own Aquinas rejects the view.",
              body: [
                "The model holds together until you count the sins. If God is the only cause, then when a hand drives a knife into a sleeping man, the motion is God's work and the murderer contributes an occasion. The Ash'arites said God creates the act and the human only ‘acquires’ it, a word that names the problem without solving it. {{malebranche|Malebranche}} saw the difficulty and carved out one exception, the will's consent, which he insisted is no real cause. Either it is a real power, and occasionalism has failed, or it is nothing, and God does the sinning.",
                "The privation reply, that God causes the act but not its defect ((coh-b-teleo|argued in the second prong)), needs a creature that falls short, and occasionalism leaves no creature doing anything. That is why the counter's own authority rejects the model as an insult to the Creator who gives creatures real power.",
              ],
              quote: {
                text: "Some have understood God to work in every agent in such a way that no created power has any effect in things, but that God alone is the ultimate cause of everything wrought; for instance, that it is not fire that gives heat, but God in the fire, and so forth. But this is impossible. First, because the order of cause and effect would be taken away from created things: and this would imply lack of power in the Creator …",
                who: "Thomas Aquinas",
                cite: "Summa Theologiae I q.105 a.5 (trans. English Dominican Fathers)",
              },
              thinkers: ["malebranche", "aquinas"],
              cedes:
                "I'd concede if an occasionalist could say who but God does anything when a sin is done, without giving creatures real causal power.",
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

    /* ───────────────────────── Prong B: foreknowledge vs freedom ───────────────────────── */
    {
      id: "coh-b",
      side: "skeptic",
      label: "An all-knowing God leaves no room for the freedom theism needs",
      gist: "If God already knows what you will do and can't be wrong, you can't do otherwise; and freedom, as many theists now defend it, means you could have.",
      body: [
        "{{boethius}} met the problem around 524, in a prison cell, awaiting execution. {{pike}} gave it modern rigor in 1965. Yesterday God believed you would take the job. God's beliefs cannot be mistaken. The past is fixed: no one now can make it that God believed otherwise. So no one now can do anything but take the job. Three premises (God can't be wrong, the past can't be changed, and whatever follows from the unchangeable is unchangeable too), and freedom is gone.",
        "The leading modern answers to the problem of evil need [[libertarian-freedom|libertarian freedom]], the power at the moment of choice to go either way, to explain why God permits evil and why judgment is just. If [[theological-fatalism|theological fatalism]] holds, either God does not foreknow, or no one has ever chosen anything, and the God who judges has nothing to judge.",
      ],
      quote: {
        text: "For if God foresees everything, and can in no wise be deceived, that which providence foresees to be about to happen must necessarily come to pass.",
        who: "Boethius",
        cite: "The Consolation of Philosophy V, prose 3 (trans. H. R. James, 1897)",
      },
      thinkers: ["boethius", "pike"],
      cedes:
        "I'd concede if one of the three premises (God can't be wrong, the past can't be changed, what follows from the unchangeable is unchangeable) were shown false on grounds other than the wish to save freedom, or if a God who judges could do without that freedom.",
      see: [
        { id: "mor-locked-door", why: "A hell chosen from the inside needs exactly the freedom this argument threatens." },
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
          gist: "A timeless God has no yesterday in which to believe anything; he knows your choice the way you know what you watch happen, and seeing someone sit doesn't make them sit.",
          body: [
            "The argument needs God's belief to sit in the past, fixed before you act. {{boethius|Boethius}} answered from the same cell: God is eternal, possessing his whole life at once ([[timeless-eternity|timeless eternity]]). {{aquinas|Aquinas}} gave the picture: a traveller on the road cannot see who comes behind him, but one who looks down on the whole road from a height sees every traveller at once.",
            "Seeing is not causing, and it is not earlier. Your choice is present to God as it happens, so the premise about the fixity of the past never gets a grip. {{stump}} and {{kretzmann}} gave the relation between eternity and time a precise definition in 1981, ‘ET-simultaneity’, built so that no event is earlier than God's knowing it.",
          ],
          quote: {
            text: "… thou wilt more rightly deem it not foreknowledge as of something future, but knowledge of a moment that never passes.",
            who: "Boethius",
            cite: "The Consolation of Philosophy V, prose 6 (trans. H. R. James, 1897)",
          },
          thinkers: ["boethius", "aquinas", "stump", "kretzmann"],
          cedes:
            "I'd concede if timeless knowledge turned out to be fixed and beyond our power in just the way past knowledge is.",
          see: [
            { id: "coh-b-classical", why: "Aquinas's full answer adds that God knows by causing, not only by seeing." },
          ],
          sources: [
            { title: "Eternity", by: "Stanford Encyclopedia of Philosophy", url: "https://plato.stanford.edu/entries/eternity/" },
            { title: "The Consolation of Philosophy", by: "Boethius (trans. H. R. James)", year: "c. 524", url: "https://www.gutenberg.org/ebooks/14328" },
          ],
          children: [
            {
              id: "coh-b-rerun",
              side: "skeptic",
              label: "Timeless knowledge is as fixed as yesterday's",
              gist: "Moving God's belief out of time doesn't help: a timeless belief you cannot affect fixes your act just as a past one would, and it was already true yesterday that God knows it.",
              body: [
                "Timelessness moves the problem without solving it. The fatalist argument never needed the word ‘past’; it needed a fact about God's knowledge that you cannot now alter. {{zagzebski}} showed the argument runs again with the necessity of the timeless realm in place of the necessity of the past: if God's timeless belief that you will take the job is beyond your power, so is your taking it. {{plantinga}} added a twist in 1986: even on the timeless view, it was true eighty years ago that God knows what you will do, and that past truth looks as fixed as any other.",
                "And timelessness has a puzzle of its own. If your typing is simultaneous with the whole of eternity, and so is Nero's fiddling, then, {{kenny}} pointed out, Nero is fiddling while you type. ET-simultaneity was invented to block that inference, which shows how much special machinery the view needs.",
              ],
              thinkers: ["zagzebski", "plantinga", "kenny"],
              cedes:
                "I'd concede if there were a principled reason why only temporally earlier facts are beyond our power and timeless ones are not.",
              sources: [
                { title: "The Dilemma of Freedom and Foreknowledge", by: "Linda Zagzebski", year: "1991" },
                { title: "The God of the Philosophers", by: "Anthony Kenny", year: "1979" },
              ],
              children: [
                {
                  id: "coh-b-dependence",
                  side: "theist",
                  label: "Timeless knowledge depends on your choice; the past can't",
                  gist: "God's timeless knowledge depends on what you choose, as no past fact depends on what you now do, so had you chosen otherwise God would eternally have known otherwise, and Plantinga's old truth is a soft fact.",
                  body: [
                    "There is a principled difference, the very one the rejoinder asks for. The past is beyond our power because it no longer depends on anything we do. Eternal knowledge is not over and done; it depends on what it knows. {{stump}} and {{kretzmann}} put it plainly in ‘Prophecy, Past Truth, and Eternity’ (1991): had you chosen otherwise, God would eternally have known otherwise. You cannot make God's knowledge different, but you can choose otherwise, and if you did, it would have been different all along. That is all freedom needs.",
                    "{{plantinga|Plantinga}}'s eighty-year-old truth is the same kind of thing. That God knew, eighty years ago, what you will do is true only because of what you will do: a [[soft-facts|soft fact]] about the past, as {{ockham|Ockham}} and the ((coh-b-molina|Molinists)) say, not a hard one like a broken vase. And {{kenny|Kenny}}'s Nero needs simultaneity to carry over from one pair of events to the next, which ET-simultaneity was defined not to do.",
                  ],
                  thinkers: ["stump", "kretzmann", "plantinga", "ockham", "kenny"],
                  cedes:
                    "I'd concede if a fact could depend on my choice and still be beyond my power in just the way the past is.",
                  see: [
                    { id: "coh-b-molina", why: "Ockham's way out, which the Molinist takes for God's past beliefs." },
                  ],
                  sources: [
                    { title: "Prophecy, Past Truth, and Eternity", by: "Eleonore Stump and Norman Kretzmann", year: "1991", note: "Philosophical Perspectives 5." },
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
          gist: "Before creating, God knew what every possible person would freely choose in every possible situation; he chose which situations to make real, and your choices stay your own.",
          body: [
            "The fatalist never asks how God knows, and the answer changes the picture. Theologians had given God knowledge of what *could* happen and of what *will* happen because he decides it. {{molina}}, a Jesuit, added a third kind in 1588: [[middle-knowledge|middle knowledge]], of what any creature *would* freely do in any circumstance. Knowing these [[counterfactuals-of-freedom|counterfactuals of freedom]], God chooses a world in which Peter is questioned in a courtyard, knowing that Peter would freely deny Jesus there.",
            "In the order of explanation your choice comes first: God believes you will do it because you would freely do it. That is how God can steer history without being a puppeteer. On the fixity of the past, Molinists such as {{craig}} and {{flint}} take {{ockham|Ockham}}'s way out: God's past belief is a [[soft-facts|soft fact]], one that depends on what you will do. Dominicans and Jesuits fought over middle knowledge until 1607, when Pope Paul V let both sides teach; {{plantinga|Plantinga}} revived it in 1974 for his free-will defense.",
          ],
          thinkers: ["molina", "craig", "flint", "ockham", "plantinga"],
          cedes:
            "I'd concede if there turned out to be no truths about what free creatures would do, so that God had nothing to know before creating.",
          see: [
            { id: "hid-middle-knowledge", why: "Middle knowledge at work in Objection II: who gets born where the gospel reaches." },
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
              gist: "A fact about what you would freely do has nothing to make it true: not God's will, not your character, not you, since you don't yet exist; so God has nothing there to know.",
              body: [
                "Middle knowledge needs truths for God to know, and the [[grounding-objection|grounding objection]] asks what makes them true. Not God's will, or the choice would not be yours. Not your character and circumstances, or the choice would be determined, not free in the libertarian sense Molinism wants. Not your actual choice, because in most of the situations God surveys you never exist at all. {{adams-robert-m}}, himself a Christian, made the case in 1977: there is nothing for these propositions to be true *of*.",
                "Would Peter have denied Jesus if the night had been warmer and he had stayed away from the fire? There seems to be no fact of the matter, only a range of possibilities, and possibilities are what God already knows by knowing what could be. {{hasker}} pressed the point for decades (*God, Time, and Knowledge*, 1989).",
              ],
              thinkers: ["adams-robert-m", "hasker"],
              cedes:
                "I'd concede if truths can be true with nothing making them true, and that holds for ordinary truths about the future as well.",
              sources: [
                { title: "Middle Knowledge and the Problem of Evil", by: "Robert Merrihew Adams", year: "1977" },
                { title: "God, Time, and Knowledge", by: "William Hasker", year: "1989" },
              ],
              children: [
                {
                  id: "coh-b-truthmakers",
                  side: "theist",
                  label: "Truths about free choices need nothing to make them true",
                  gist: "‘You will read this tomorrow’ can be true today with nothing yet to make it true; truths about what you would freely do are no worse off, and Scripture takes them for granted.",
                  body: [
                    "The grounding objection proves too much. Take ‘you will read this tomorrow’. If it is true today, nothing that exists today makes it true; the reading hasn't happened. Yet most philosophers grant that there are truths about the future. {{craig|Craig}}'s point (2001): any [[truthmaker|truthmaker]] rule strict enough to sink counterfactuals of freedom sinks the future tense too, and, for anyone who thinks only the present exists, the past tense as well.",
                    "So {{plantinga|Plantinga}} and {{flint|Flint}} treat counterfactuals of freedom as basic contingent truths, true because that is what the person would freely do, full stop. {{merricks|Merricks}} argues on independent grounds that many truths need no truthmakers. And Scripture is full of such conditionals. David asks whether the men of Keilah would hand him over to Saul, is told they would, and leaves (1 Samuel 23). Jesus says what Tyre and Sidon would have done.",
                  ],
                  quote: {
                    text: "Woe unto thee, Chorazin! woe unto thee, Bethsaida! for if the mighty works, which were done in you, had been done in Tyre and Sidon, they would have repented long ago in sackcloth and ashes.",
                    who: "Jesus, in Matthew's Gospel",
                    cite: "Matthew 11:21 (KJV)",
                  },
                  thinkers: ["craig", "plantinga", "flint", "merricks"],
                  cedes:
                    "I'd concede if a principled truthmaker requirement condemned counterfactuals of freedom while sparing truths about the future and the past.",
                  sources: [
                    { title: "Middle Knowledge, Truth-Makers, and the ‘Grounding Objection’", by: "William Lane Craig", year: "2001" },
                  ],
                  children: [
                    {
                      id: "coh-b-asym",
                      side: "skeptic",
                      label: "Tomorrow can make ‘will’ true; nothing ever makes ‘would’ true",
                      gist: "‘You will read this’ is made true by tomorrow's reading, if tomorrow is as real as today; ‘Peter would have denied Jesus on a warmer night’ is about a night that never comes, so nothing makes it true.",
                      body: [
                        "The parity holds only on {{craig|Craig}}'s own picture of time, where only the present exists. If past, present and future are equally real, as the block universe of relativity suggests, tomorrow's reading exists, just later, and makes the prediction true now. A counterfactual of freedom has no such luck. The warmer night on which Peter stays away from the fire never happens at any time; there is nothing, then or ever, for ‘he would have denied him anyway’ to be true of.",
                        "Suppose such truths were simply true, as the reply proposes. Then they are settled before you exist and before God decides anything, and what is settled before you exist is not up to you: {{adams-robert-m|Adams}} argued this in 1991 and {{hasker|Hasker}} in 1999. And the parity cuts both ways. An open futurist grants it and denies truth to both kinds of claim, so a draw between ‘will’ and ‘would’ favors ((coh-b-open|the open future)), not middle knowledge.",
                      ],
                      thinkers: ["craig", "adams-robert-m", "hasker"],
                      cedes:
                        "I'd concede if something real, then or ever, made it true what a never-created person would freely have done, and that truth still left the choice up to him.",
                      see: [
                        { id: "coh-b-open", why: "Where the parity points if both kinds of claim lack truthmakers." },
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
          gist: "If future free choices aren't there yet to be known, an all-knowing God misses nothing by not knowing them; and to defeat a charge of incoherence, one consistent model of God is all it takes.",
          body: [
            "The fatalist assumes there is already a fact about what you will freely do. Open theists deny it. {{aristotle}} wondered whether ‘there will be a sea battle tomorrow’ is true today; {{todd}} argues (2021) that all such [[future-contingents|future contingents]] are false. Then a God who knows every truth knows all there is, every possibility included. {{swinburne}} and {{hasker|Hasker}} hold instead that God knows everything that *can* be known, and future free acts cannot be; {{boyd}} and Todd hold that there is nothing there yet to know. Either way, the authors of *The Openness of God* (1994) built [[open-theism|open theism]] on a God who tests, relents and says to Abraham, ‘now I know’.",
            "He passes the other tests too. He keeps every creature in being and gives free agents power without settling its use, so nothing is caused twice over; and his nature is the standard of good, as for {{adams-robert-m|Adams}} ((coh-c-terminus|in the third prong)), with no need of simplicity. One consistent God answers the charge.",
          ],
          quote: {
            text: "for now I know that thou fearest God, seeing thou hast not withheld thy son, thine only son from me.",
            who: "The angel of the LORD, to Abraham",
            cite: "Genesis 22:12 (KJV)",
          },
          thinkers: ["aristotle", "todd", "swinburne", "hasker", "boyd", "adams-robert-m"],
          cedes:
            "I'd concede if future free choices could be infallibly known in advance, or if an open God failed one of the other two tests.",
          sources: [
            { title: "The Open Future: Why Future Contingents Are All False", by: "Patrick Todd", year: "2021" },
            { title: "God of the Possible", by: "Gregory A. Boyd", year: "2000" },
          ],
          children: [
            {
              id: "coh-b-package",
              side: "skeptic",
              label: "Each model saves a different God; none passes all three tests",
              gist: "The open God acts in time, so every answered prayer is an intervention and his ‘now’ needs a cosmic present physics denies; the classical answers aren't his to borrow, and three tests can't be passed by three Gods.",
              body: [
                "The open-theism reply changes the subject. Objection I is answered only if one God passes all three tests, not if each test is passed by a different God. The counter's answer to the first was Aquinas's: God is no being among beings, so he never competes. The open God lives in time, learns as we choose and answers as we pray, which makes every answer a [[special-divine-action|special act]], one more push in a world physics finds causally closed ((nat-a-closure|Objection III)). His responsiveness is the miracle problem, daily.",
                "Time sends its own bill. A God who lives through time needs a single cosmic ‘now’, which special relativity denies; {{craig|Craig}}, who holds God temporal since creation, pays by reviving a preferred state of rest that relativity abolished, a physics few physicists accept (*Time and Eternity*, 2001). The coalition frays elsewhere: followers of Aquinas (Thomists) reject Molinism because a God informed by truths he does not make is taught by his creatures, and Craig rejects strong simplicity. Every rescue saves someone else's God.",
              ],
              thinkers: ["craig"],
              cedes:
                "I'd concede if a single God, described the same way throughout, answered all three objections at once.",
              see: [
                { id: "coh-a-concur", why: "The Thomist answer to the first test, which the open God cannot share." },
                { id: "nat-a-power", why: "Spinoza's version in Objection III: a God who steps into nature is one cause among others." },
              ],
              sources: [
                { title: "Time and Eternity: Exploring God's Relationship to Time", by: "William Lane Craig", year: "2001" },
              ],
              children: [
                {
                  id: "coh-b-classical",
                  side: "theist",
                  label: "The classical God passes all three tests at once",
                  gist: "Aquinas's God answers every test with one move: as the non-competing source of all, he causes fire's burning, knows your choice timelessly by causing it as yours, and is goodness itself.",
                  body: [
                    "The coalition charge is fair against a theist who picks and mixes, but the classical package needs no allies. {{aquinas|Aquinas}} holds that God knows creatures as their cause, as an artist knows the work: not by watching it but by making it. He knows your choice not from ahead of time, nor by reading truths he did not make, but timelessly, as the one giving it being. And because he works in each thing according to its nature, his causing a free choice is what makes it free.",
                    "That is the first test's non-competition, extended to the will; {{mccabe}} defended it in the 1980s and {{grant|Grant}} develops it today. Being timeless, this God needs no cosmic ‘now’; being no rival, he pushes nothing aside. The same God is goodness itself, which answers the third test, and his act is necessary while its effects are not ((coh-a-extrinsic|the collapse reply)). One God, one move, three answers. There are costs, but a cost is not a contradiction.",
                  ],
                  quote: {
                    text: "Now it is manifest that God causes things by His intellect, since His being is His act of understanding; and hence His knowledge must be the cause of things, in so far as His will is joined to it.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.14 a.8 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas", "mccabe", "grant"],
                  cedes:
                    "I'd concede if God's causing a choice turned out to make it unfree, or to make God the author of its evil.",
                  see: [
                    { id: "coh-c-nature", why: "The third answer in the package: goodness is what God is." },
                  ],
                  sources: [
                    { title: "Summa Theologiae I q.14 (On God's Knowledge)", by: "Thomas Aquinas", url: "https://www.newadvent.org/summa/1014.htm" },
                    { title: "God Matters", by: "Herbert McCabe", year: "1987" },
                  ],
                  children: [
                    {
                      id: "coh-b-needslib",
                      side: "skeptic",
                      label: "The classical God passes only by causing the sins he judges",
                      gist: "If God causes every choice, he causes Judas's betrayal too; freedom shrinks to doing what you were made to do, and judging Judas looks like an author punishing a character.",
                      body: [
                        "The classical package buys foreknowledge with causation, and the bill comes in two parts. First, freedom. {{mele}} imagines a goddess who designs a zygote so that the man it becomes will, decades later, do just what she planned; {{pereboom}} builds a ladder of such cases down to ordinary causes. Most readers judge the designed man unfree, and nothing relevant separates him from a man whose every choice God causes, except that God's control is more complete.",
                        "Second, sin. On {{banez|Báñez}}'s account a creature falls only when God withholds the grace that would have kept it standing, so God's decree settles who falls. That was the Jesuits' charge in the quarrel over grace, and {{maritain}}, a follower of Aquinas, revised the doctrine in 1963 to escape it. {{mackie}} saw the cost in 1955: if freedom fits with being caused, God could have made creatures who always freely choose the good. A God who causes the act and condemns the agent looks less like a judge than an author punishing his characters.",
                      ],
                      thinkers: ["mele", "pereboom", "banez", "maritain", "mackie"],
                      cedes:
                        "I'd concede if God could cause every choice without its being settled by design, as the zygote's is, and without his decree settling who falls.",
                      see: [
                        { id: "mor-locked-door", why: "A hell locked from the inside needs the libertarian freedom this package gives up." },
                        { id: "mor-no-desert", why: "Spinoza presses the same point against Aquinas's hell in Objection V." },
                      ],
                      sources: [
                        { title: "Free Will and Luck", by: "Alfred R. Mele", year: "2006" },
                        { title: "Living Without Free Will", by: "Derk Pereboom", year: "2001" },
                        { title: "God and the Permission of Evil", by: "Jacques Maritain", year: "1966", note: "English translation of Dieu et la permission du mal (1963)." },
                      ],
                      children: [
                        {
                          id: "coh-b-teleo",
                          side: "theist",
                          label: "God causes every act, but not the defect that makes it sin",
                          gist: "A manipulator competes with you, but God gives you your will; sin is a lack, and lacks have no maker; and God permits evil to bring good from it, not to protect a coin-toss freedom.",
                          body: [
                            "The zygote case pictures God as a manipulator, but a manipulator is a rival cause on your level, pulling strings you might have pulled yourself. God is the source of the willing itself; {{grant}} and {{mccann|Hugh McCann}} argue that being caused by the one who gives you your will is not being handled but being made. And sin is [[privation|privation]], a lack, like a limp: God gives Judas's act its being; the defect comes from the creature falling away. {{maritain}}'s ‘shatterable motions’ make that falling away the creature's own first move, so God's permission follows it rather than deciding it.",
                            "As for {{mackie}}: yes, God could make wills that never fall, as the saints cannot sin, and for {{hart}}, who rejects ‘neutral’ libertarian choice as a false picture of freedom, those wills are the freest of all. The classical answer to evil was never the free-will defense. It is {{augustine}}'s: God ‘judged it better to bring good out of evil, than not to permit any evil to exist’ (*Enchiridion* 27).",
                          ],
                          quote: {
                            text: "Accordingly God is the cause of the act of sin: and yet He is not the cause of sin, because He does not cause the act to have a defect.",
                            who: "Thomas Aquinas",
                            cite: "Summa Theologiae I-II q.79 a.2 (trans. English Dominican Fathers)",
                          },
                          thinkers: ["grant", "mccann", "aquinas", "maritain", "mackie", "hart", "augustine"],
                          cedes:
                            "I'd concede if a defect needed a cause in the way a deed does, or if the source of a will had to compete with it as a manipulator does.",
                          see: [
                            { id: "mor-universalism", why: "The same non-libertarian freedom underwrites Hart's universalism in Objection V." },
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
                  gist: "The open God's present is the time of his own life, not a reference frame in physics, cosmology supplies a natural cosmic time anyway, and giving creatures power without settling its use is non-competition too.",
                  body: [
                    "The bill is addressed to the wrong God. The open God's ‘now’ is metaphysical, the present of his own unfolding life, not a preferred frame among the frames of special relativity. Relativity shows that no experiment picks out a single cosmic present; it does not show there is none. And cosmology supplies a natural one: cosmic time, kept by observers at rest relative to the expanding universe and its background radiation, is the clock by which the universe is 13.8 billion years old. Temporalists such as {{swinburne}}, {{hasker|Hasker}} and {{mullins}} need nothing more exotic.",
                    "Nor does responsiveness make God a rival. He gives creatures their powers and keeps them in being without settling how they use them, as ((coh-b-open|the open reply)) said: a non-competition of its own, not Aquinas's, but no push alongside the creature's push. Where answering a prayer does mean acting in the world, the open theist owes no more than any theist who allows miracles, and ((nat-a-laws|Objection III)) argues that no law of physics forbids it.",
                  ],
                  thinkers: ["swinburne", "hasker", "mullins"],
                  cedes:
                    "I'd concede if God's present had to be a physical reference frame, or if giving creatures power while leaving its use open made God one more cause among them.",
                  see: [
                    { id: "coh-a-concur", why: "Aquinas's form of non-competition, which this one parallels without divine simplicity." },
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
          label: "Real freedom is acting from your nature; foreknowledge spares it",
          gist: "If freedom means acting from your own nature rather than acting uncaused, a God who knows everything you will do takes nothing from you, and a theist who takes that freedom has all the freedom there is.",
          body: [
            "The whole dilemma assumes a freedom Spinoza denies. Nothing in nature is uncaused, the mind included (Ethics II P48). People think themselves free because they are conscious of their actions and ignorant of the causes that determine them (II P35 Schol.); a stone set flying, Spinoza wrote to Schuller in 1674, would think the same if it could think. The libertarian's power to do otherwise is that ignorance, renamed.",
            "Real freedom is something else: a thing is free when it acts from the necessity of its own nature alone (I Def. 7), and a person grows freer as understanding grows. A God who knows every act takes none of that away. So the fatalist proves only that every event is settled, which takes nothing real from anyone. {{edwards}} took a similar [[compatibilism|compatibilist]] exit in 1754, on Calvinist grounds. A theist who takes this freedom, as Edwards did, loses nothing to the fatalist.",
          ],
          quote: {
            text: "In the mind there is no absolute or free will; but the mind is determined to wish this or that by a cause, which has also been determined by another cause, and this last by another cause, and so on to infinity.",
            who: "Spinoza",
            cite: "Ethics II P48 (trans. R. H. M. Elwes, 1883)",
          },
          thinkers: ["spinoza", "edwards"],
          cedes:
            "I'd concede if libertarian freedom could be described coherently, as something other than chance or ignorance of causes.",
          see: [
            { id: "coh-b-needslib", why: "The same exit, taken by the classical theist, and the bill it runs up." },
            { id: "mor-repent", why: "Spinoza's freedom applied to guilt: wrongs call for understanding, not remorse." },
            { id: "mor-no-desert", why: "The same denial of free will, turned against hell's desert in Objection V." },
          ],
          sources: [
            { title: "Ethics", by: "Baruch Spinoza (trans. R. H. M. Elwes)", year: "1677", url: "https://www.gutenberg.org/ebooks/3800" },
          ],
          children: [
            {
              id: "coh-b-judge",
              side: "skeptic",
              label: "Harmless only to a God who judges no one",
              gist: "Spinoza can shrug off lost freedom because his God is never angry and judges no one; the counter's God judges the living and the dead, and judging people for what he settled is the problem.",
              body: [
                "Spinoza's exit is honest about its price, and the price is the counter's God. Determinism costs Spinoza nothing because his God has no passions and loves or hates no one (Ethics V P17 Cor.). Pressed by {{oldenburg}} in 1676, he said it plainly: God cannot be angry, and when Scripture calls him a judge who passes sentence, it is speaking humanly ((mor-no-desert|Objection V)).",
                "The counter cannot say that. Its God tests hearts, forgives and condemns, and Paul, who first heard this objection, answered it with the potter and the clay while keeping the judgment seat (2 Corinthians 5:10). A judge who settled every crime he sentences is the author punishing his characters, the bill ((coh-b-needslib|the classical package)) runs up. So the fatalist's conclusion is harmless only for a God the counter does not believe in.",
              ],
              quote: {
                text: "Thou wilt say then unto me, Why doth he yet find fault? For who hath resisted his will?",
                who: "Paul, voicing an objector",
                cite: "Romans 9:19 (KJV)",
              },
              thinkers: ["spinoza", "oldenburg"],
              cedes:
                "I'd concede if a God who settles every choice could still justly condemn the chooser, or if the counter's God judged no one.",
              see: [
                { id: "mor-spinoza-few", why: "The theist's answer in Objection V: desert survives determinism, and Spinoza's own excusable still perish." },
              ],
              sources: [
                {
                  title: "The Chief Works of Benedict de Spinoza, vol. 2 (Correspondence)",
                  by: "trans. R. H. M. Elwes",
                  year: "1883",
                  url: "https://archive.org/details/chiefworksofbene02spin",
                  note: "Letters 75–79 with Oldenburg; the 1891 printing is linked.",
                },
              ],
            },
          ],
        },
      ],
    },

    /* ───────────────────────── Prong C: Euthyphro ───────────────────────── */
    {
      id: "coh-c",
      side: "skeptic",
      label: "Either God's commands are arbitrary or goodness stands above God",
      gist: "If cruelty is wrong only because God forbids it, he could have commanded it and made it right; if he forbids it because it is wrong, goodness doesn't depend on God.",
      body: [
        "At the porch of the King Archon, on his way to answer the charges that will cost him his life, Socrates questions a man prosecuting his own father for murder, sure that the gods approve. Out of that conversation comes the [[euthyphro-dilemma|Euthyphro dilemma]]. Put it to one God and his commands. Say right is whatever God commands: then had he commanded cruelty, cruelty would have been right. {{ockham}}, on the standard reading, swallowed it: by his absolute power God could command even hatred of himself.",
        "Others recoiled. {{leibniz}} saw that this empties praise: why praise God for doing good if he would be just as praiseworthy for doing the opposite? {{cudworth}} saw that it makes justice a mere name, since not even omnipotence can make a thing what it is by will alone. Say instead that God commands kindness because it is good. Then goodness is a standard God consults, not one he makes, and morality stands on its own feet. Either way, ‘God is the source of morality’ fails.",
      ],
      quote: {
        text: "The point which I should first wish to understand is whether the pious or holy is beloved by the gods because it is holy, or holy because it is beloved of the gods.",
        who: "Plato (Socrates speaking)",
        cite: "Euthyphro 10a (trans. Benjamin Jowett)",
      },
      thinkers: ["plato", "ockham", "leibniz", "cudworth"],
      cedes:
        "I'd concede if there were a third option that made goodness depend on God without making it his arbitrary choice.",
      see: [
        { id: "mor-hell", why: "Objection V calls a doctrine monstrous, which presupposes a standard of goodness; this prong asks where it lives." },
      ],
      sources: [
        { title: "Theological Voluntarism", by: "Stanford Encyclopedia of Philosophy (Mark Murphy)", url: "https://plato.stanford.edu/entries/voluntarism-theological/" },
        { title: "Euthyphro", by: "Plato (trans. Benjamin Jowett)", url: "https://www.gutenberg.org/ebooks/1642" },
        { title: "A Treatise Concerning Eternal and Immutable Morality", by: "Ralph Cudworth", year: "1731", url: "https://archive.org/details/treatiseconcerni00cudw_1" },
      ],
      children: [
        {
          id: "coh-c-nature",
          side: "theist",
          label: "Goodness is what God is, so neither horn catches him",
          gist: "God neither obeys a standard nor invents one: he is goodness itself, the source and goal of everything good, so his commands are neither arbitrary nor answerable to anything above him.",
          body: [
            "The dilemma assumes goodness must be either a rule above God or a decree from him. Classical theism says it is neither: it is God. For {{aquinas|Aquinas}}, goodness is being itself, looked at as something worth wanting, and God, who is being itself, is good not by sharing in goodness but by his own essence. He is not a moral agent meeting a standard, as {{davies}} puts it, but the Good every creature seeks when it seeks anything, what {{hart|Hart}} calls the end of all desire.",
            "So the commands of this personal God come from what he is. They cannot be arbitrary, because his nature could not be otherwise; and they answer to nothing above him, because nothing is above him. God can make no exceptions to the core of the moral law, the precepts that protect justice (ST I-II q.100 a.8); particular laws, like Israel's ceremonial rules, he freely adds. {{murphy}}'s *God's Own Ethics* (2017) puts the point sharply: not obligations God has, but goodness God is.",
          ],
          quote: {
            text: "Hence it is manifest that God alone has every kind of perfection by His own essence; therefore He Himself alone is good essentially.",
            who: "Thomas Aquinas",
            cite: "Summa Theologiae I q.6 a.3 (trans. English Dominican Fathers)",
          },
          thinkers: ["aquinas", "davies", "hart", "murphy"],
          cedes:
            "I'd concede if calling God ‘goodness itself’ turned out to be either a hidden standard he meets or a word for whatever he happens to be.",
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
              gist: "Either God's nature is good because it meets a standard we can state, so the standard comes first, or ‘God is good’ just means ‘God is God’.",
              body: [
                "Moving goodness into God's nature moves the dilemma up a floor. Is God's nature good because it is loving, just and merciful? Then those qualities are the standard, and we can state it without mentioning God. Or is it good simply because it is God's? Then ‘God is good’ says only that God is like God, the empty compliment of the arbitrary horn. {{morriston}} supplies the test case: had God's nature been indifferent to suffering, would indifference then be good?",
                "Our knowledge runs the same way. We judge God good because his nature matches what we already see goodness to be; that is why the hard cases in Scripture hurt, and why believers search them for readings they can call good. {{mill}} drew the line in 1865: he would call no being good who is not good in the sense he means of his fellow creatures.",
              ],
              thinkers: ["morriston", "mill"],
              cedes:
                "I'd concede if ‘God is good’ could be informative without measuring God against a standard that comes first, in knowledge or in fact.",
              see: [
                { id: "mor-mansel", why: "Mill's ‘to hell I will go’, aimed at the doctrine of hell in Objection V." },
              ],
              sources: [
                { title: "What If God Commanded Something Terrible? A Worry for Divine-Command Meta-Ethics", by: "Wes Morriston", year: "2009" },
              ],
              children: [
                {
                  id: "coh-c-terminus",
                  side: "theist",
                  label: "God is the standard of goodness, not a thing measured by it",
                  gist: "Every theory ends in something good that isn't good by a further standard; for the theist that is God, and asking whether God meets the standard is like asking whether the standard metre is a metre long.",
                  body: [
                    "The regress the objection finds is one every ethics faces. {{plato}}'s Form of the Good makes other things good without being good by sharing in anything further; the naturalist's basic moral facts are true full stop. Something has to be the stopping point. {{alston}} proposed that for the theist it is a particular rather than a principle: as the standard metre bar once fixed what a metre is, God fixes what goodness is, and asking whether God meets the standard mistakes what a standard is.",
                    "Nor is ‘God is good’ empty. {{adams-robert-m}} borrows a lesson from chemistry: people pointed at lakes and rain and called it ‘water’ long before anyone knew it was H₂O. Our paradigms of goodness fix what ‘good’ is about in the same way, and inquiry discovers its nature. So ‘God is good’ informs the way ‘water is H₂O’ does, and ‘what if God's nature were cruel?’ has an impossible premise, like asking what water would be if it weren't H₂O.",
                  ],
                  thinkers: ["plato", "alston", "adams-robert-m"],
                  cedes:
                    "I'd concede if a person could not serve as the standard of a value the way a paradigm can, or if the water analogy failed for goodness.",
                  see: [
                    { id: "nat-b-brute", why: "Every explanation stops somewhere: the same question about a brute universe, in Objection III." },
                  ],
                  sources: [
                    { title: "Finite and Infinite Goods: A Framework for Ethics", by: "Robert Merrihew Adams", year: "1999" },
                    { title: "Some Suggestions for Divine Command Theorists", by: "William P. Alston", year: "1990" },
                  ],
                  children: [
                    {
                      id: "coh-c-brute",
                      side: "skeptic",
                      label: "Let ‘cruelty is wrong’ be the stopping point, not a person",
                      gist: "If something must be good with no further explanation, let it be the moral facts themselves, like ‘cruelty is wrong’, rather than a being whose goodness is just as unexplained.",
                      body: [
                        "Grant the stopping point; it needn't be a person. {{wielenberg}} defends [[robust-realism|robust realism]]: basic ethical facts, such as that causing pain for fun is wrong, are objective, necessary and in no need of a foundation. The theist's stopping point is just as unexplained, and it adds a being, with all the coherence costs of the first two tests, for no gain. Nor does the person add bindingness: if God's commands bind because God is good, as Adams holds, goodness is doing the work.",
                        "The water analogy fails as well. {{horgan}} and {{timmons}} imagine a Moral Twin Earth whose people anchor ‘good’ to different paradigms: when we argue with them we seem to disagree, not to talk past each other, which could not happen if ‘good’ worked like ‘water’. And the impossible premise is no escape. {{morriston}} argues that questions with impossible premises, like ‘what if God were cruel?’, still have better and worse answers, and the theory must give one.",
                      ],
                      thinkers: ["wielenberg", "horgan", "timmons", "morriston"],
                      cedes:
                        "I'd concede if brute moral facts could not explain why morality binds us, or how creatures like us could come to know them.",
                      see: [
                        { id: "coh-c-spinoza", why: "The Spinozist rejects mind-independent moral facts; the two skeptic metaethics cannot both be right." },
                      ],
                      sources: [
                        { title: "Robust Ethics: The Metaphysics and Epistemology of Godless Normative Realism", by: "Erik J. Wielenberg", year: "2014" },
                        { title: "Troubles on Moral Twin Earth: Moral Queerness Revived", by: "Terence Horgan and Mark Timmons", year: "1992", note: "Synthese 92." },
                      ],
                      children: [
                        {
                          id: "coh-c-person",
                          side: "theist",
                          label: "Only a person can make goodness bind us",
                          gist: "Brute facts just sit there; obligation is a claim someone makes on us, and a personal Good explains why goodness commands and how evolved minds came to know it.",
                          body: [
                            "Fewer ingredients win only if they explain as much, and [[brute-fact|brute]] moral facts leave the most important thing unexplained. Obligation is a demand, and {{evans}} argues that a demand needs someone who demands. Goodness does not do all the work: for {{adams-robert-m|Adams}}, God's goodness is why his commands deserve a hearing, and the command makes a thing owed, as a good friend's request binds where the same act, unasked, would only be kind. {{cudworth|Cudworth}}'s regress (a command binds only if obedience is already owed) never starts, since the reason to obey is goodness, not one more command.",
                            "Knowledge is the second gap. {{street}}'s Darwinian dilemma faces every realist: if moral facts push nothing around, evolved creatures tracking them is a lucky coincidence. On theism the coincidence disappears, because the same God grounds the facts and made the minds. Even {{mackie}}, who coined the argument from queerness, granted in 1982 that objective values would be strange items in a godless world, and would make a god more likely.",
                          ],
                          thinkers: ["evans", "adams-robert-m", "cudworth", "street", "mackie"],
                          cedes:
                            "I'd concede if non-theistic realism could explain the authority of obligation, and our knowledge of moral facts, as well as theism does.",
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
                              gist: "Commands need a commander, but obligation needn't be a command; if heeding God is already owed, that duty is as brute as any, and a godless realist can explain moral knowledge too.",
                              body: [
                                "{{evans}} shows that commands need a commander, not that obligation does. ‘Cruelty is wrong’ binds without anyone's saying so, as a valid proof compels assent unbidden. And {{adams-robert-m|Adams}}'s friend brings back {{cudworth}}'s question. A friend's request binds because we already owe our friends a hearing; God's command binds only if heeding God is already owed. That prior duty cannot itself be commanded, on pain of regress, so it is a [[brute-fact|brute]] moral fact. If the answer is that God is good, goodness is doing the binding: robust realism with an extra step.",
                                "The knowledge gap closes without God too. {{wielenberg}} answers {{street}} with a ‘third-factor’ account (*Ethics* 120, 2010): the cognitive capacities evolution gave us both make us beings with rights and lead us to believe we have them, so fact and belief share a cause and no luck is needed. And {{mackie}} granted his conditional in 1982 only to deny its antecedent: objective values would point to a god if there were any, and he held there are none.",
                              ],
                              thinkers: ["evans", "adams-robert-m", "cudworth", "wielenberg", "street", "mackie"],
                              cedes:
                                "I'd concede if the duty to heed God could be shown to need no grounding of its own, while every godless duty still needed one.",
                              see: [
                                { id: "mor-convicts", why: "Wielenberg again in Objection V: equal worth with no foundation beneath it." },
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
              gist: "The reply fixes the moral core in God's nature and lets God add the rest freely; but each added command is either required by his goodness, and so necessary, or not, and so arbitrary after all.",
              body: [
                "The reply escapes Euthyphro for the moral core and leaves the rest to God's free choice. Spinoza asks about the rest. Take a command God ‘freely adds’, such as the order to Abraham to sacrifice Isaac. Either God's goodness required it, and it could not have been otherwise: God chooses nothing, which is Spinoza's God (Ethics I P33). Or it did not, and it holds only because he willed it: the arbitrary horn. Spinoza even ranks those who make good whatever God decrees ‘less far from the truth’ than those who have God aim at the good, since that sets up a standard outside God (I P33 Schol. 2).",
                "And ‘good’ is not a property God has. It means what we certainly know to be useful to us (IV Def. 1), measured against the ‘type of human nature’ we set before ourselves (IV Pref.). Cruelty is bad because it diminishes the power of beings like us to act and to understand. But it is goodness without a chooser.",
              ],
              quote: {
                text: "As for the terms good and bad, they indicate no positive quality in things regarded in themselves, but are merely modes of thinking, or notions which we form from the comparison of things one with another.",
                who: "Spinoza",
                cite: "Ethics IV Preface (trans. R. H. M. Elwes, 1883)",
              },
              thinkers: ["spinoza"],
              cedes:
                "I'd concede if a command could be neither required by God's nature nor a bare decree, and still be chosen for a reason.",
              see: [
                { id: "coh-a-collapse", why: "Necessity in God's nature is the modal-collapse charge again." },
                { id: "mor-pity", why: "Spinoza's ethic of what reason finds useful, tested against Christian pity in Objection V." },
                { id: "nat-b-contrast", why: "The same forced-or-arbitrary dilemma, aimed at creation itself in Objection III." },
              ],
              children: [
                {
                  id: "coh-c-natlaw",
                  side: "theist",
                  label: "A command can fit God's goodness without being forced by it",
                  gist: "Between required and arbitrary lies fitting: God gives a law for reasons that make it good without making it the only good law, as an artist's choices fit a work without being forced.",
                  body: [
                    "The dilemma leaves out the ordinary way reasons work. {{aquinas|Aquinas}} says God ‘wills this to be as means to that; but does not will this on account of that’ (ST I q.19 a.5): each thing he wills fits an end, yet nothing forces his willing it. A sabbath serves rest and worship; another law might have served them too. Fitting is not forced, and it is not arbitrary. Spinoza's God chooses nothing; this one chooses everything but his own character ((nat-b-reasons|Objection III)).",
                    "On goodness itself the two sides are closer than Spinoza admits. ‘Useful to us’ means what really increases a nature's power of acting, which is very nearly Aquinas's good: all things seek their own perfection, and the first precept of [[natural-law|natural law]] is to pursue that good (ST I-II q.94 a.2). Spinoza's [[conatus|conatus]], each thing's striving to persist in its being, and Aquinas's natural inclination are one striving under two names. What Spinoza subtracts is the lawgiver.",
                  ],
                  quote: {
                    text: "The will of God is reasonable, not because anything is to God a cause of willing, but in so far as He wills one thing to be on account of another.",
                    who: "Thomas Aquinas",
                    cite: "Summa Theologiae I q.19 a.5 ad 1 (trans. English Dominican Fathers)",
                  },
                  thinkers: ["aquinas"],
                  cedes:
                    "I'd concede if every reason for a command either forced it or explained nothing about why God gave it.",
                  see: [
                    { id: "nat-b-reasons", why: "The same answer about creation itself: reasons explain a free choice without forcing it." },
                    { id: "coh-a-extrinsic", why: "Why fixed goodness doesn't make creation necessary." },
                    { id: "nat-b-contrast", why: "The forced-or-arbitrary rejoinder, aimed at creation in Objection III." },
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
    title: "A God who thinks, loves, and does not choose",
    body: [
      "Spinoza grants more of the counter than either side expects. His God is the [[immanent-cause|immanent]], non-competing cause of everything (Ethics I P18), and he denies [[libertarian-freedom|libertarian freedom]] outright (II P48), so a God who causes and knows every act takes nothing from the only freedom there is, acting from your own nature (I Def. 7). The first two prongs are theists' quarrels.",
      "His own objection is narrower. God thinks ((coh-a-dogstar|with a mind ours is part of)), and God loves, but only with the [[amor-dei-intellectualis|intellectual love]] by which he loves himself, of which your understanding love of God is literally a part (V P36). That is why ‘strictly speaking, God does not love or hate anyone’ (V P17 Cor.): ordinary love is joy at an outside cause, and God has no outside and no greater perfection to pass into. Where ((coh-a-analogy|the theist)) sees a likeness across a gap, Spinoza sees no gap: one love, seen from the part and from the whole.",
      "So everything turns on one question: could God have done otherwise? Each theist answer here leans on yes: ((coh-a-extrinsic|one act, many possible worlds)), knowing by causing without authoring sin, commands fixed at the core and free at the edges. Spinoza says no, because everything has a reason ([[psr|the principle of sufficient reason]]), and pays openly for his [[necessitarianism|necessitarianism]]: this world, horrors included, is the only one there could have been, produced ‘in the highest perfection’ (I P33 Schol. 2). And ‘good’ measures what helps beings like us flourish (IV Pref.), not a choice God made.",
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
      note: "The counter's classical theism at full strength: God as the source of being, not a being among beings.",
    },
    {
      title: "The God of the Philosophers",
      by: "Anthony Kenny",
      year: "1979",
      note: "An agnostic's careful case that the traditional attributes, omniscience above all, do not fit together.",
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
      note: "Divine command theory against godless robust realism, with replies from both sides.",
    },
    {
      title: "The End of the Timeless God",
      by: "R. T. Mullins",
      year: "2016",
      note: "A Christian philosopher's case against simplicity and timelessness; read with W. Matthews Grant's Free Will and God's Universal Causality (2019) for the classical reply.",
    },
    {
      title: "Ethics",
      by: "Baruch Spinoza (trans. R. H. M. Elwes)",
      year: "1677",
      url: "https://www.gutenberg.org/ebooks/3800",
      note: "Part I for God, necessity and the dog-star scholium; Part V for the intellectual love of God.",
    },
  ],
};

export default coherence;
