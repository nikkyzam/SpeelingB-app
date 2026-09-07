const THREE_BEE_WORDS = [
    {
        "word": "abnegation",
        "meaning": "The act of rejecting or giving up something, especially a personal desire.",
        "sentences": ["Monks often practice abnegation by living with very few possessions."],
        "vocabulary_question": "Is abnegation the act of treating yourself to a treat or saying no to it?"
    },
    {
        "word": "abominable",
        "meaning": "Extremely unpleasant, disgusting, or worthy of hate.",
        "sentences": ["The weather during the soccer game was abominable, with freezing rain and wind."],
        "vocabulary_question": "If something is abominable, do people generally love it or hate it?"
    },
    {
        "word": "abrogate",
        "meaning": "To end or cancel a law, right, or formal agreement.",
        "sentences": ["The government voted to abrogate the old treaty."],
        "vocabulary_question": "When you abrogate a rule, are you making it stronger or ending it?"
    },
    {
        "word": "asymmetric",
        "meaning": "Not identical or corresponding on both sides of a dividing line; lacking symmetry.",
        "sentences": ["The building's asymmetric design gave it one tall tower and one short one."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 the same on both sides, or different on each side?"
    },
    {
        "word": "chickadee",
        "meaning": "A small North American songbird with a black cap and bib, known for its cheerful call.",
        "sentences": ["A chickadee landed on the feeder and pecked at the seeds."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of bird or a type of tree?"
    },
    {
        "word": "legation",
        "meaning": "A diplomatic mission or its headquarters, ranking below an embassy and headed by a minister.",
        "sentences": ["The small country's legation was housed in a quiet building near the capital."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a diplomatic office or a kind of legal document?"
    },
    {
        "word": "leprosy",
        "meaning": "A chronic infectious disease that affects the skin, nerves, and mucous membranes.",
        "sentences": ["Doctors have developed effective treatments for leprosy over the past century."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a disease or a type of plant?"
    },
    {
        "word": "authority",
        "meaning": "The power or right to give orders, make decisions, and enforce obedience.",
        "sentences": ["The police officer had the authority to close the street for the parade."],
        "vocabulary_question": "Does having \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 mean you can give orders, or that you must obey them?"
    },
    {
        "word": "despondent",
        "meaning": "In low spirits from loss of hope or courage; deeply dejected.",
        "sentences": ["He felt despondent after losing the championship game."],
        "vocabulary_question": "If you are \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, do you feel hopeful or hopeless?"
    },
    {
        "word": "diplomatically",
        "meaning": "In a way that is tactful and skilled at dealing with people, especially in difficult situations.",
        "sentences": ["She diplomatically settled the argument between her two friends."],
        "vocabulary_question": "If you handle a problem \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, are you being rude or tactful?"
    },
    {
        "word": "eureka",
        "meaning": "An exclamation of triumph on discovering or solving something.",
        "sentences": ["Eureka! She finally found the missing puzzle piece under the couch."],
        "vocabulary_question": "Do you shout '\u2588\u2588\u2588\u2588\u2588\u2588' when you are frustrated or when you have just discovered something?"
    },
    {
        "word": "solenodon",
        "meaning": "A small, nocturnal, burrowing mammal native to Cuba and Hispaniola, known for its long snout and venomous bite.",
        "sentences": ["The solenodon is one of the few venomous mammals in the world."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a mammal or a kind of rock?"
    },
    {
        "word": "ampulla",
        "meaning": "A rounded, flask-shaped enlargement of a canal or duct, especially one found in the inner ear.",
        "sentences": ["The ampulla in the inner ear helps the body sense motion and balance."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a shape found in the body or a musical instrument?"
    },
    {
        "word": "phantasmal",
        "meaning": "Having the quality of a phantom or illusion; not real.",
        "sentences": ["The old house seemed to have a phantasmal glow in the moonlight."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 solid and real, or ghostly and unreal?"
    },
    {
        "word": "imperial",
        "meaning": "Relating to an empire or emperor; majestic or grand in size or quality.",
        "sentences": ["The imperial palace had gold ceilings and marble floors."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe something small and plain, or grand and majestic?"
    },
    {
        "word": "lapels",
        "meaning": "The folded flaps on the front of a coat or jacket that continue from the collar.",
        "sentences": ["He pinned a small flower to the lapels of his suit jacket."],
        "vocabulary_question": "Are \u2588\u2588\u2588\u2588\u2588\u2588 found on a jacket or on a pair of shoes?"
    },
    {
        "word": "auditory",
        "meaning": "Relating to the sense of hearing.",
        "sentences": ["The auditory nerve carries sound signals from the ear to the brain."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 relate to hearing or to seeing?"
    },
    {
        "word": "newt",
        "meaning": "A small, semiaquatic salamander with a long tail and moist skin.",
        "sentences": ["We spotted a newt swimming near the edge of the pond."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588 an amphibian or an insect?"
    },
    {
        "word": "porpoises",
        "meaning": "Small, toothed whales related to dolphins, with blunt, rounded snouts.",
        "sentences": ["A group of porpoises swam alongside the boat as it crossed the bay."],
        "vocabulary_question": "Are \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 closely related to dolphins, or to sharks?"
    },
    {
        "word": "palazzo",
        "meaning": "A large, grand building, especially an Italian palace or mansion.",
        "sentences": ["Tourists lined up to tour the palazzo overlooking the canal."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a grand building or a small cottage?"
    },
    {
        "word": "settee",
        "meaning": "A long upholstered seat for two or more people, usually with a back and arms.",
        "sentences": ["The whole family squeezed onto the settee to watch the movie."],
        "vocabulary_question": "Would you sit on a \u2588\u2588\u2588\u2588\u2588\u2588 or wear one?"
    },
    {
        "word": "self-sufficient",
        "meaning": "Able to supply one's own needs without outside help.",
        "sentences": ["The farm was self-sufficient, growing all of its own food."],
        "vocabulary_question": "If a family is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, do they depend on others, or can they take care of themselves?"
    },
    {
        "word": "brazier",
        "meaning": "A portable container or metal pan used for holding lighted coals.",
        "sentences": ["Campers gathered around the brazier to warm their hands."],
        "vocabulary_question": "Would you cook over a \u2588\u2588\u2588\u2588\u2588\u2588\u2588 or sleep in one?"
    },
    {
        "word": "electrolytes",
        "meaning": "Substances such as salts that produce ions when dissolved in a liquid, helping conduct electrical signals in the body.",
        "sentences": ["Athletes drink sports drinks to replace the electrolytes lost through sweat."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 help your body conduct electrical signals, or help you see in the dark?"
    },
    {
        "word": "Addis Ababa",
        "meaning": "The capital and largest city of Ethiopia.",
        "sentences": ["Addis Ababa sits high in the mountains of Ethiopia."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 the capital of Ethiopia, or the capital of Egypt?"
    },
    {
        "word": "trenchant",
        "meaning": "Vigorous, sharp, and forceful in expression; incisive.",
        "sentences": ["The critic wrote a trenchant review of the new restaurant."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 comment sharp and forceful, or gentle and vague?"
    },
    {
        "word": "salicylic acid",
        "meaning": "An organic acid used in skincare products and as an ingredient in aspirin.",
        "sentences": ["The face wash contained salicylic acid to help clear up blemishes."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 found in skincare products, or in car engines?"
    },
    {
        "word": "sensilla",
        "meaning": "Simple sense organs found in insects and other arthropods, often shaped like tiny bristles or hairs.",
        "sentences": ["The moth's antennae are covered with sensilla that detect scents in the air."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 help an insect sense its surroundings, or help it fly faster?"
    },
    {
        "word": "curriculum",
        "meaning": "The subjects that make up a course of study at a school.",
        "sentences": ["The new curriculum includes more hands-on science projects."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe the subjects you study, or the building you study in?"
    },
    {
        "word": "hypothesis",
        "meaning": "A proposed explanation made on the basis of limited evidence, used as a starting point for further investigation.",
        "sentences": ["The scientist tested her hypothesis with a simple experiment."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a proven fact, or a guess you plan to test?"
    },
    {
        "word": "\u00e9clair",
        "meaning": "A light, oblong pastry filled with cream and topped with icing, usually chocolate.",
        "sentences": ["She bit into the \u00e9clair and found it filled with rich vanilla cream."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588 a pastry or a type of bread?"
    },
    {
        "word": "wallowing",
        "meaning": "Rolling around or lying in mud, water, or another substance, often for pleasure or relief.",
        "sentences": ["The pigs spent the hot afternoon wallowing in the cool mud."],
        "vocabulary_question": "Is an animal \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 moving quickly, or rolling around lazily?"
    },
    {
        "word": "approximation",
        "meaning": "A value or amount that is close to, but not exactly, correct.",
        "sentences": ["The number of people at the fair was only an approximation, not an exact count."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 an exact number, or a close estimate?"
    },
    {
        "word": "prospective",
        "meaning": "Likely to happen or become in the future; expected.",
        "sentences": ["The prospective student toured the campus before deciding where to apply."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe something that already happened, or something that might happen in the future?"
    },
    {
        "word": "crocheted",
        "meaning": "Made by looping yarn or thread with a hooked needle.",
        "sentences": ["Grandma crocheted a warm blanket for the new baby."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 made with a hooked needle, or with a pair of knitting needles?"
    },
    {
        "word": "blithely",
        "meaning": "In a carefree, cheerful, and casual manner, often without concern for consequences.",
        "sentences": ["She blithely ignored the warning signs and kept walking."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 mean careful and anxious, or carefree and casual?"
    },
    {
        "word": "sauntered",
        "meaning": "Walked in a slow, relaxed manner, without hurry.",
        "sentences": ["He sauntered into the room as if he had all the time in the world."],
        "vocabulary_question": "Did he walk in quickly, or \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 in slowly and calmly?"
    },
    {
        "word": "cuisine",
        "meaning": "A style or method of cooking, especially one associated with a particular country or region.",
        "sentences": ["The restaurant specialized in traditional French cuisine."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588 refer to a style of cooking, or a type of furniture?"
    },
    {
        "word": "sentinels",
        "meaning": "Guards or lookouts stationed to keep watch over an area.",
        "sentences": ["Two sentinels stood at the castle gate all through the night."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 stand guard, or do they cook meals?"
    },
    {
        "word": "increments",
        "meaning": "Small, regular amounts by which something increases.",
        "sentences": ["The savings account grew in small increments each month."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe small increases, or sudden large drops?"
    },
    {
        "word": "inanimate",
        "meaning": "Not alive; showing no signs of life; lifeless.",
        "sentences": ["A rock is an inanimate object, while a bird is a living one."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 alive, or lifeless?"
    },
    {
        "word": "modish",
        "meaning": "Fashionable; stylish in the current trend.",
        "sentences": ["She wore a modish hat that turned heads at the party."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588 describe something old-fashioned, or trendy and stylish?"
    },
    {
        "word": "frequency",
        "meaning": "The rate at which something occurs or is repeated over a period of time.",
        "sentences": ["The teacher tracked the frequency of tardiness among her students."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 measure how often something happens, or how big something is?"
    },
    {
        "word": "dominion",
        "meaning": "Supreme authority or control over an area or people; the territory controlled by a ruler.",
        "sentences": ["The king claimed dominion over the entire valley."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 mean having control over something, or having a friendship with someone?"
    },
    {
        "word": "quiche",
        "meaning": "A savory tart made with eggs, milk or cream, and fillings such as cheese, meat, or vegetables, baked in a pastry crust.",
        "sentences": ["We had a slice of quiche and a salad for lunch."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588 a savory baked dish, or a sweet dessert?"
    },
    {
        "word": "enigmatic",
        "meaning": "Difficult to interpret or understand; mysterious.",
        "sentences": ["The old man gave an enigmatic smile and walked away without answering."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe something clear and simple, or mysterious and puzzling?"
    },
    {
        "word": "a cappella",
        "meaning": "Sung without instrumental accompaniment.",
        "sentences": ["The choir performed the song a cappella, using only their voices."],
        "vocabulary_question": "Is a song sung \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 performed with instruments, or with voices alone?"
    },
    {
        "word": "odorant",
        "meaning": "A substance that has a smell, or one added to something to give it a detectable smell.",
        "sentences": ["Natural gas has an odorant added so people can smell a leak."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588 something you can smell, or something you can taste but not smell?"
    },
    {
        "word": "shar-pei",
        "meaning": "A breed of dog originally from China, known for its deeply wrinkled skin.",
        "sentences": ["The shar-pei puppy had so many wrinkles that it looked too big for its skin."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of dog or a type of cat?"
    },
    {
        "word": "finesse",
        "meaning": "Skillful and delicate handling of a situation; refined skill.",
        "sentences": ["The chef prepared the delicate sauce with great finesse."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588 mean handling something clumsily, or skillfully and delicately?"
    },
    {
        "word": "mysticetes",
        "meaning": "Baleen whales; a suborder of large whales that filter food using baleen plates instead of teeth.",
        "sentences": ["Mysticetes, like the blue whale, feed by straining tiny creatures through baleen plates."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 have teeth, or do they filter food through baleen plates?"
    },
    {
        "word": "sputum",
        "meaning": "Mucus and other matter coughed up from the respiratory tract, often examined to diagnose illness.",
        "sentences": ["The doctor asked for a sample of sputum to test for infection."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588 something coughed up from the lungs, or a type of medicine?"
    },
    {
        "word": "cerulean",
        "meaning": "A deep sky-blue color.",
        "sentences": ["The cerulean sky stretched over the calm ocean."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe a shade of blue, or a shade of green?"
    },
    {
        "word": "chitinous",
        "meaning": "Made of or containing chitin, the tough substance that forms the exoskeletons of insects and crustaceans.",
        "sentences": ["The beetle's chitinous shell protected it from predators."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 shell hard and protective, or soft and flexible?"
    },
    {
        "word": "bioluminescence",
        "meaning": "Light produced by a living organism through a chemical reaction inside its body.",
        "sentences": ["Bioluminescence lit up the waves as the fish swam through the dark water."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe light made by a living creature, or light made by a lamp?"
    },
    {
        "word": "innocuous",
        "meaning": "Not harmful or offensive; harmless.",
        "sentences": ["The comment seemed innocuous, but it hurt her feelings anyway."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 harmful, or harmless?"
    },
    {
        "word": "reassurance",
        "meaning": "Something said or done to remove someone's doubts or fears.",
        "sentences": ["She gave her brother reassurance before his big test."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 make someone feel more worried, or more calm?"
    },
    {
        "word": "euphemism",
        "meaning": "A mild or indirect word used in place of one considered harsh or unpleasant.",
        "sentences": ["\"Passed away\" is a euphemism for \"died.\""],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a harsh way to say something, or a gentler way?"
    },
    {
        "word": "mewling",
        "meaning": "Crying weakly and repeatedly, like a young animal or baby.",
        "sentences": ["The mewling kitten searched for its mother."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588 crying loudly and angrily, or weakly and softly?"
    },
    {
        "word": "cataract",
        "meaning": "A clouding of the lens of the eye that can cause blurry vision; also, a large waterfall.",
        "sentences": ["Grandpa had surgery to remove a cataract from his eye."],
        "vocabulary_question": "Can a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 affect your eyesight, or only your hearing?"
    },
    {
        "word": "mayonnaise",
        "meaning": "A thick, creamy condiment made from oil, egg yolks, and vinegar or lemon juice.",
        "sentences": ["She spread mayonnaise on the sandwich before adding the turkey."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a condiment, or a type of bread?"
    },
    {
        "word": "apologetic",
        "meaning": "Feeling or expressing regret for having done something wrong.",
        "sentences": ["He was apologetic after accidentally stepping on her foot."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe someone who feels sorry, or someone who feels proud?"
    },
    {
        "word": "Gloucester",
        "meaning": "A cathedral city in southwestern England, also the name of a type of cheese.",
        "sentences": ["Gloucester is known for its historic cathedral."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a city in England, or a city in France?"
    },
    {
        "word": "butane",
        "meaning": "A flammable gas used as fuel, often found in lighters and portable stoves.",
        "sentences": ["The camping stove ran on butane."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588 a type of gas, or a type of metal?"
    },
    {
        "word": "prosciutto",
        "meaning": "A dry-cured, thinly sliced Italian ham, typically served uncooked.",
        "sentences": ["The chef wrapped melon slices in prosciutto for the appetizer."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of ham, or a type of cheese?"
    },
    {
        "word": "neurological",
        "meaning": "Relating to the nervous system, including the brain, spinal cord, and nerves.",
        "sentences": ["The doctor ran neurological tests after the patient's fall."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 relate to the nervous system, or the digestive system?"
    },
    {
        "word": "embodiment",
        "meaning": "A person or thing that represents an idea or quality in a physical or tangible form.",
        "sentences": ["The coach was the embodiment of patience during practice."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 an example that represents an idea, or a random accident?"
    },
    {
        "word": "seminal",
        "meaning": "Strongly influencing later developments; groundbreaking or highly original.",
        "sentences": ["The scientist's seminal research changed how doctors treat the disease."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588 work influence future ideas, or copy old ones?"
    },
    {
        "word": "echolocation",
        "meaning": "A method used by animals such as bats and dolphins to locate objects by emitting sounds and listening for the echoes.",
        "sentences": ["Bats use echolocation to find insects in the dark."],
        "vocabulary_question": "Do animals use \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 to find food using sound, or using smell?"
    },
    {
        "word": "appetizing",
        "meaning": "Stimulating the appetite; looking or smelling delicious.",
        "sentences": ["The appetizing smell of fresh bread filled the kitchen."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 food make you want to eat it, or avoid it?"
    },
    {
        "word": "Amharic",
        "meaning": "The official language of Ethiopia.",
        "sentences": ["Amharic is spoken by millions of people in Ethiopia."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a language, or a type of food?"
    },
    {
        "word": "credenza",
        "meaning": "A long, low cabinet or sideboard, often used for storage in a dining room or office.",
        "sentences": ["She kept the good dishes in the credenza."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a piece of furniture, or a type of fabric?"
    },
    {
        "word": "embankment",
        "meaning": "A wall or bank of earth or stone built to hold back water or support a road or railway.",
        "sentences": ["The road ran along an embankment beside the river."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 built to hold back water, or to hold up a roof?"
    },
    {
        "word": "assemblage",
        "meaning": "A collection or gathering of things or people; also, an artwork made from a collection of objects.",
        "sentences": ["The museum displayed an assemblage of old farm tools."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a single object, or a collection of things?"
    },
    {
        "word": "psychological",
        "meaning": "Relating to the mind and mental processes; affecting or arising in the mind.",
        "sentences": ["The coach focused on the psychological side of the game, not just physical skill."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 relate to the mind, or the muscles?"
    },
    {
        "word": "alleviate",
        "meaning": "To make a problem, pain, or suffering less severe.",
        "sentences": ["The medicine helped alleviate her headache."],
        "vocabulary_question": "Does something that helps \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 pain make it worse, or better?"
    },
    {
        "word": "generator",
        "meaning": "A machine that converts mechanical energy into electrical energy, often used as a backup power source.",
        "sentences": ["During the storm, the generator kept the lights on."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 produce electricity, or store water?"
    },
    {
        "word": "comprehensible",
        "meaning": "Able to be understood; clear.",
        "sentences": ["The teacher explained the lesson in a comprehensible way so everyone understood."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 easy to understand, or confusing?"
    },
    {
        "word": "stomatopods",
        "meaning": "Mantis shrimp; a group of marine crustaceans known for their powerful claws and complex eyes.",
        "sentences": ["Stomatopods can strike their prey with incredible speed and force."],
        "vocabulary_question": "Are \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of shrimp-like sea creature, or a type of seaweed?"
    },
    {
        "word": "arsonists",
        "meaning": "People who deliberately set fire to property.",
        "sentences": ["The fire department worked with police to catch the arsonists responsible for the blaze."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 start fires on purpose, or put them out?"
    }
];

export default THREE_BEE_WORDS;
