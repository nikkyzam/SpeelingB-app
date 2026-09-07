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
    },
    {
        "word": "phenomenon",
        "meaning": "A fact or situation that is observed to exist or happen, especially one whose cause is uncertain or unclear.",
        "sentences": ["Lightning is a natural phenomenon that has fascinated scientists for centuries."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 something that happens, or something that never happens?"
    },
    {
        "word": "diffidence",
        "meaning": "Shyness or a lack of confidence in oneself.",
        "sentences": ["His diffidence kept him from raising his hand, even when he knew the answer."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe feeling shy and unsure, or bold and confident?"
    },
    {
        "word": "kerosene",
        "meaning": "A thin, flammable oil used as fuel for lamps, heaters, and some engines.",
        "sentences": ["The old lantern burned kerosene instead of electricity."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of fuel, or a type of food?"
    },
    {
        "word": "persistent",
        "meaning": "Continuing firmly despite difficulty or opposition; not giving up.",
        "sentences": ["Her persistent practice finally paid off at the recital."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe someone who gives up easily, or keeps trying?"
    },
    {
        "word": "protectorate",
        "meaning": "A state or territory that is controlled and defended by a more powerful country.",
        "sentences": ["The small island became a protectorate under the larger nation's care."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 protected and controlled by another country, or fully independent?"
    },
    {
        "word": "unrelenting",
        "meaning": "Not yielding in strength, severity, or determination; relentless.",
        "sentences": ["The unrelenting rain flooded the streets for three days straight."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe something that eases up, or something that keeps going without letting up?"
    },
    {
        "word": "tenuous",
        "meaning": "Very weak or slight; barely holding together.",
        "sentences": ["Their friendship felt tenuous after the disagreement."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588 strong and solid, or weak and flimsy?"
    },
    {
        "word": "Eritrea",
        "meaning": "A country in East Africa, on the coast of the Red Sea.",
        "sentences": ["Eritrea shares a border with Ethiopia and Sudan."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a country in Africa, or a country in South America?"
    },
    {
        "word": "dachshund",
        "meaning": "A breed of dog with a long body and short legs, originally bred to hunt badgers.",
        "sentences": ["The dachshund's long body made it perfect for chasing animals into burrows."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 known for its short legs and long body, or its tall, thin frame?"
    },
    {
        "word": "doberman",
        "meaning": "A breed of large, muscular dog known for its intelligence and loyalty, often used as a guard dog.",
        "sentences": ["The doberman stood alert at the gate, watching for strangers."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of dog, or a type of horse?"
    },
    {
        "word": "Pennsylvania",
        "meaning": "A state in the northeastern United States, home to Philadelphia and Pittsburgh.",
        "sentences": ["The Liberty Bell is on display in Pennsylvania."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a U.S. state, or a Canadian province?"
    },
    {
        "word": "cul-de-sac",
        "meaning": "A street or passage closed at one end, with only one way in or out.",
        "sentences": ["The children rode their bikes safely in the quiet cul-de-sac."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 have one way in and out, or two ways through?"
    },
    {
        "word": "conspicuous",
        "meaning": "Standing out so as to be easily seen or noticed.",
        "sentences": ["Her bright red coat made her conspicuous in the crowd."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe something easy to notice, or something hidden away?"
    },
    {
        "word": "arugula",
        "meaning": "A leafy green vegetable with a peppery, slightly bitter flavor, often used in salads.",
        "sentences": ["She added arugula to the salad for a peppery kick."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a leafy vegetable, or a type of grain?"
    },
    {
        "word": "censers",
        "meaning": "Vessels in which incense is burned, often used in religious ceremonies.",
        "sentences": ["The priests swung the censers, filling the chapel with fragrant smoke."],
        "vocabulary_question": "Are \u2588\u2588\u2588\u2588\u2588\u2588\u2588 used to burn incense, or to hold water?"
    },
    {
        "word": "unconscious",
        "meaning": "Not awake or aware; lacking conscious control or perception.",
        "sentences": ["He was unconscious for several minutes after the fall."],
        "vocabulary_question": "Is someone who is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 awake and alert, or not aware of their surroundings?"
    },
    {
        "word": "acolyte",
        "meaning": "A person who assists a member of the clergy in a religious service; a devoted follower or assistant.",
        "sentences": ["The acolyte carried the candle down the aisle during the service."],
        "vocabulary_question": "Is an \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a helper or follower, or a leader who acts alone?"
    },
    {
        "word": "thermotaxis",
        "meaning": "The movement of an organism in response to changes in temperature.",
        "sentences": ["Thermotaxis helps some insects find warmer spots to survive the cold."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe movement toward light, or movement in response to temperature?"
    },
    {
        "word": "bogong moth",
        "meaning": "A species of moth native to Australia, known for its long-distance migration to cool mountain caves.",
        "sentences": ["Each summer, the bogong moth migrates to the cool caves of the Australian Alps."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 known for migrating to cool caves, or for spinning silk?"
    },
    {
        "word": "propeller",
        "meaning": "A device with rotating blades used to move a boat, plane, or other vehicle through air or water.",
        "sentences": ["The boat's propeller churned the water as it sped away from the dock."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 spin to move a vehicle, or sit still to steer it?"
    },
    {
        "word": "eponymous",
        "meaning": "Giving one's name to something, such as a book, product, or era.",
        "sentences": ["The band's eponymous album shared its title with the group's own name."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe something named after itself, or named after something unrelated?"
    },
    {
        "word": "trimmings",
        "meaning": "Small pieces cut off in trimming something; also, extra decorations or accompaniments to a meal.",
        "sentences": ["Grandma served turkey with all the trimmings for the holiday dinner."],
        "vocabulary_question": "Are \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 the small extras that go with something, or the main dish itself?"
    },
    {
        "word": "vibrometer",
        "meaning": "An instrument used to measure the frequency or intensity of vibrations.",
        "sentences": ["Engineers used a vibrometer to check whether the bridge was vibrating too much."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 measure vibrations, or measure temperature?"
    },
    {
        "word": "ototoxic",
        "meaning": "Harmful to the ear or to the nerves involved in hearing and balance.",
        "sentences": ["Some medications are ototoxic and can damage a patient's hearing."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 harmful to the ears, or harmful to the eyes?"
    },
    {
        "word": "alabaster",
        "meaning": "A soft, usually white, translucent stone often carved into sculptures and ornaments.",
        "sentences": ["The sculptor carved a delicate vase out of alabaster."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of stone, or a type of wood?"
    },
    {
        "word": "glycerin",
        "meaning": "A thick, sweet, colorless liquid used in soaps, lotions, and medicines to keep them moist.",
        "sentences": ["The lotion contained glycerin to keep her skin soft."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a liquid used to keep things moist, or a gas used to inflate balloons?"
    },
    {
        "word": "perpendicular",
        "meaning": "At an angle of ninety degrees to a given line, plane, or surface; upright.",
        "sentences": ["The two walls met at a perpendicular angle in the corner of the room."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 lines meet at a right angle, or run side by side without meeting?"
    },
    {
        "word": "generosity",
        "meaning": "The quality of being kind and giving, especially with money, time, or gifts.",
        "sentences": ["Her generosity was clear when she gave her lunch to a classmate who forgot theirs."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe someone who shares freely, or someone who keeps everything to themselves?"
    },
    {
        "word": "pulmonary",
        "meaning": "Relating to the lungs.",
        "sentences": ["The doctor listened to the patient's pulmonary sounds through a stethoscope."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 relate to the lungs, or to the stomach?"
    },
    {
        "word": "preconception",
        "meaning": "An idea or opinion formed before having enough information or experience.",
        "sentences": ["Her preconception about the new student changed once she got to know him."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 formed before you know all the facts, or after careful research?"
    },
    {
        "word": "forsythia",
        "meaning": "A shrub with bright yellow flowers that bloom early in spring.",
        "sentences": ["The forsythia bushes burst into yellow bloom as soon as the snow melted."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 bloom with yellow flowers in spring, or red flowers in fall?"
    },
    {
        "word": "conflagration",
        "meaning": "A large, destructive fire.",
        "sentences": ["The conflagration destroyed several city blocks before firefighters could stop it."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a small spark, or a large, destructive fire?"
    },
    {
        "word": "miscibility",
        "meaning": "The ability of two or more liquids to mix together completely and form a single solution.",
        "sentences": ["Oil and water have poor miscibility, so they separate instead of blending."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe how well liquids mix together, or how bright they are?"
    },
    {
        "word": "mortar",
        "meaning": "A mixture of cement, sand, and water used to bind bricks or stones together; also, a bowl used for grinding.",
        "sentences": ["The bricklayer spread mortar between each brick to hold the wall together."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588 used to bind bricks together, or to paint a wall?"
    },
    {
        "word": "Krio",
        "meaning": "A creole language spoken in Sierra Leone, blending English with African and other influences.",
        "sentences": ["Krio is widely spoken as a common language across Sierra Leone."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588 a language, or a type of currency?"
    },
    {
        "word": "annelids",
        "meaning": "A group of worms with segmented bodies, including earthworms and leeches.",
        "sentences": ["Earthworms are a familiar example of annelids found in garden soil."],
        "vocabulary_question": "Do \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 have segmented bodies, or hard shells?"
    },
    {
        "word": "Presbyterian",
        "meaning": "A member or follower of a Protestant church governed by elders, tracing its roots to the teachings of John Calvin.",
        "sentences": ["Her family has attended the same Presbyterian church for three generations."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a term for a type of church, or a type of government?"
    },
    {
        "word": "thrummed",
        "meaning": "Made a continuous rhythmic humming or drumming sound.",
        "sentences": ["The engine thrummed steadily as the boat crossed the lake."],
        "vocabulary_question": "Did the engine make a sudden crash, or a steady, rhythmic sound as it \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588?"
    },
    {
        "word": "subscription",
        "meaning": "An arrangement to receive something regularly, such as a magazine or service, usually by paying in advance.",
        "sentences": ["He renewed his subscription so the magazine would keep arriving each month."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 let you receive something regularly, or only once?"
    },
    {
        "word": "foliage",
        "meaning": "The leaves of plants and trees, collectively.",
        "sentences": ["The mountains were covered in colorful autumn foliage."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588 the leaves of plants, or the roots of plants?"
    },
    {
        "word": "endothermy",
        "meaning": "The ability of an animal to generate and maintain its own body heat internally.",
        "sentences": ["Endothermy allows mammals to stay active even in cold weather."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 let an animal make its own body heat, or rely only on the sun for warmth?"
    },
    {
        "word": "procession",
        "meaning": "A group of people or vehicles moving forward in an orderly line, often as part of a ceremony.",
        "sentences": ["The wedding procession moved slowly down the aisle."],
        "vocabulary_question": "Does a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 move in an orderly line, or scatter in every direction?"
    },
    {
        "word": "torrential",
        "meaning": "Describing rain that falls very heavily and rapidly.",
        "sentences": ["The torrential downpour flooded the streets within minutes."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 rain fall lightly and slowly, or heavily and fast?"
    },
    {
        "word": "irrelevant",
        "meaning": "Not connected with or important to the matter at hand.",
        "sentences": ["His comment about the weather was irrelevant to the science discussion."],
        "vocabulary_question": "Is something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 important to the topic, or unrelated to it?"
    },
    {
        "word": "burnished",
        "meaning": "Made shiny by rubbing or polishing.",
        "sentences": ["The knight's burnished armor gleamed in the sunlight."],
        "vocabulary_question": "Does something \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 look dull and rusty, or shiny and polished?"
    },
    {
        "word": "juniper",
        "meaning": "An evergreen shrub or tree with small, cone-like berries, often used for flavoring or in landscaping.",
        "sentences": ["The juniper bush's blue berries gave off a sharp, piney scent."],
        "vocabulary_question": "Is a \u2588\u2588\u2588\u2588\u2588\u2588\u2588 a type of evergreen plant, or a type of flower that blooms once a year?"
    },
    {
        "word": "Delaware",
        "meaning": "A small state on the East Coast of the United States, the first to ratify the U.S. Constitution.",
        "sentences": ["Delaware was the first state to join the United States."],
        "vocabulary_question": "Is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 a U.S. state, or a river in Europe?"
    },
    {
        "word": "reluctance",
        "meaning": "Unwillingness or hesitation to do something.",
        "sentences": ["She agreed to help, though with some reluctance."],
        "vocabulary_question": "Does \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 describe eagerness to do something, or hesitation about doing it?"
    }
];

export default THREE_BEE_WORDS;
