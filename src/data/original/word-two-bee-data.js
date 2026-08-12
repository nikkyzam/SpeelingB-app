const TWO_BEE_WORDS = [
    {
        "word": "abdicate",
        "meaning": "To formally give up a position of power, duty, or right.",
        "sentences": ["The king decided to abdicate the throne so his daughter could lead."],
        "vocabulary_question": "If a leader chooses to ████████, are they keeping their job or leaving it?"
    },
    {
        "word": "aberration",
        "meaning": "A state or condition that is different from what is normal or expected.",
        "sentences": ["The snowstorm in July was a complete aberration for the tropical island."],
        "vocabulary_question": "Is an ██████████ something that happens all the time or something very unusual?"
    },
    {
        "word": "ablation",
        "meaning": "The removal or destruction of a body part or tissue, or the melting away of ice/snow.",
        "sentences": ["Scientists studied the ablation of the glacier caused by the warm summer."],
        "vocabulary_question": "Does ████████ involve adding more material or taking it away?"
    },
    {
        "word": "ablaut",
        "meaning": "A change of vowel in related words (like sing, sang, sung) that indicates a change in tense.",
        "sentences": ["The teacher explained how the word 'drive' changes to 'drove' through ablaut."],
        "vocabulary_question": "Does ██████ change the consonants or the vowels in a word?"
    },
    {
        "word": "abnegation",
        "meaning": "The act of rejecting or giving up something, especially a personal desire.",
        "sentences": ["Monks often practice abnegation by living with very few possessions."],
        "vocabulary_question": "Is ██████████ the act of treating yourself to a treat or saying no to it?"
    },
    {
        "word": "abominable",
        "meaning": "Extremely unpleasant, disgusting, or worthy of hate.",
        "sentences": ["The weather during the soccer game was abominable, with freezing rain and wind."],
        "vocabulary_question": "If something is ██████████, do people generally love it or hate it?"
    },
    {
        "word": "abrogate",
        "meaning": "To end or cancel a law, right, or formal agreement.",
        "sentences": ["The government voted to abrogate the old treaty."],
        "vocabulary_question": "When you ████████ a rule, are you making it stronger or ending it?"
    },
    {
        "word": "abscess",
        "meaning": "A painful, swollen area on the body that is filled with fluid (pus).",
        "sentences": ["The dentist had to treat the painful abscess in the patient's gum."],
        "vocabulary_question": "Is an ███████ a type of healthy muscle or a painful infection?"
    },
    {
        "word": "abscond",
        "meaning": "To leave quickly and secretly, typically to avoid getting caught for something wrong.",
        "sentences": ["The thief tried to abscond with the jewels before the alarm went off."],
        "vocabulary_question": "If you ███████, are you walking away slowly or running away secretly?"
    },
    {
        "word": "absolution",
        "meaning": "Formal release from guilt, obligation, or punishment.",
        "sentences": ["The judge granted him absolution after he proved his innocence."],
        "vocabulary_question": "Does ██████████ mean you are being punished or being forgiven?"
    },
    {
        "word": "abstemious",
        "meaning": "Not eating or drinking much; showing self-discipline.",
        "sentences": ["Despite the huge feast, the athlete remained abstemious to stay in shape."],
        "vocabulary_question": "Is an ██████████ person someone who overeats or someone who eats very little?"
    },
    {
        "word": "Acadians",
        "meaning": "The descendants of French settlers in parts of Canada and the northeastern U.S.",
        "sentences": ["The history book described the journey of the Acadians to Louisiana."],
        "vocabulary_question": "Are the █████████ a group of people or a type of mountain?"
    },
    {
        "word": "accentuate",
        "meaning": "To make something more noticeable or prominent; to emphasize.",
        "sentences": ["The bright yellow walls helped accentuate the natural light in the room."],
        "vocabulary_question": "If you ██████████ a feature, are you hiding it or highlighting it?"
    },
    {
        "word": "accrual",
        "meaning": "The accumulation or increase of something over time, such as money or interest.",
        "sentences": ["The constant accrual of points helped her win the top prize."],
        "vocabulary_question": "Does ████████ mean that something is disappearing or building up?"
    },
    {
        "word": "acerbity",
        "meaning": "Sourness or bitterness in taste; sharpness or harshness in tone.",
        "sentences": ["The critic was known for the acerbity of his reviews."],
        "vocabulary_question": "Does ████████ describe someone who is being very sweet or very harsh?"
    },
    {
        "word": "achromatic",
        "meaning": "Without color; relating to or being in black, white, or shades of gray.",
        "sentences": ["The artist chose an achromatic palette for her charcoal drawing."],
        "vocabulary_question": "Is an ██████████ painting full of bright colors or just black and white?"
    },
    {
        "word": "acoustic",
        "meaning": "Relating to sound or the sense of hearing; not electric.",
        "sentences": ["He played his favorite song on an acoustic guitar."],
        "vocabulary_question": "Does an ████████ instrument need to be plugged into an outlet to work?"
    },
    {
        "word": "acquiesce",
        "meaning": "To accept something reluctantly but without protest.",
        "sentences": ["He finally decided to acquiesce to his sister's choice of movie."],
        "vocabulary_question": "If you █████████, are you fighting back or giving in?"
    },
    {
        "word": "acquisition",
        "meaning": "The act of gaining or obtaining something, such as a new skill or object.",
        "sentences": ["The library's newest acquisition was a rare first-edition book."],
        "vocabulary_question": "Is an ██████████ something you have lost or something you have gained?"
    },
    {
        "word": "acral",
        "meaning": "Relating to the peripheral parts of the body, such as fingers, toes, or ears.",
        "sentences": ["The doctor checked the acral areas for signs of frostbite."],
        "vocabulary_question": "Do █████ parts of the body include your heart or your fingers and toes?"
    },
    {
        "word": "acuity",
        "meaning": "Sharpness of thought, vision, or hearing.",
        "sentences": ["The owl’s visual acuity allows it to see tiny mice in the dark."],
        "vocabulary_question": "If you have great ██████, is your vision blurry or very sharp?"
    },
    {
        "word": "acumen",
        "meaning": "The ability to make good judgments and quick decisions.",
        "sentences": ["Her business acumen helped her turn the small shop into a success."],
        "vocabulary_question": "Does a person with █████ make smart decisions or silly ones?"
    },
    {
        "word": "acupuncture",
        "meaning": "A medical treatment involving the insertion of thin needles into the body.",
        "sentences": ["He tried acupuncture to help relieve the pain in his back."],
        "vocabulary_question": "Does ███████████ involve using medicine or using tiny needles?"
    },
    {
        "word": "adiaphorism",
        "meaning": "The belief that certain religious practices are indifferent or not essential.",
        "sentences": ["The theologians debated adiaphorism during the conference."],
        "vocabulary_question": "Does ███████████ deal with things that are essential or things that are optional?"
    },
    {
        "word": "Adirondack",
        "meaning": "Relating to a mountain range in northeastern New York or a style of outdoor chair.",
        "sentences": ["We sat in an Adirondack chair and watched the sunset over the lake."],
        "vocabulary_question": "Is an ██████████ a type of fruit or a type of chair/mountain?"
    },
    {
        "word": "adjag",
        "meaning": "A type of wild dog found in Asia, also known as a dhole.",
        "sentences": ["The adjag is a skilled hunter that lives in the forests of India."],
        "vocabulary_question": "Is an █████ a type of animal or a type of machine?"
    },
    {
        "word": "adjugate",
        "meaning": "In mathematics, a specific type of matrix related to another matrix.",
        "sentences": ["The student had to find the adjugate of the 3x3 matrix for her homework."],
        "vocabulary_question": "Is ████████ a term used in math class or in cooking class?"
    },
    {
        "word": "adjure",
        "meaning": "To urge or request someone earnestly or solemnly to do something.",
        "sentences": ["I adjure you to tell the truth about what happened."],
        "vocabulary_question": "If you ██████ someone, are you asking them nicely or ordering them strictly?"
    },
    {
        "word": "adolescence",
        "meaning": "The period of life when a child develops into an adult.",
        "sentences": ["Middle school is often when students begin their journey through adolescence."],
        "vocabulary_question": "Is ███████████ the time when you are a baby or when you are a teenager?"
    },
    {
        "word": "adulation",
        "meaning": "Excessive admiration or praise.",
        "sentences": ["The famous singer was greeted with adulation from thousands of fans."],
        "vocabulary_question": "Is █████████ when people are cheering for you or booing you?"
    },
    {
        "word": "advertisement",
        "meaning": "A notice or announcement in a public medium promoting a product, service, or event.",
        "sentences": ["The colorful advertisement in the magazine made the new toy look very exciting."],
        "vocabulary_question": "Is an █████████████ designed to hide a product or to show it to the public?"
    },
    {
        "word": "advocatory",
        "meaning": "Relating to or consisting of support or recommendation for a particular cause.",
        "sentences": ["The lawyer gave an advocatory speech to defend his client's rights."],
        "vocabulary_question": "Does an ██████████ speech try to support someone or work against them?"
    },
    {
        "word": "aerobics",
        "meaning": "Vigorous exercises, such as swimming or walking, designed to strengthen the heart and lungs.",
        "sentences": ["My grandmother goes to the community center twice a week for water aerobics."],
        "vocabulary_question": "Is ████████ a type of physical exercise or a type of silent meditation?"
    },
    {
        "word": "affable",
        "meaning": "Friendly, good-natured, or easy to talk to.",
        "sentences": ["The new principal turned out to be very affable and always greeted students with a smile."],
        "vocabulary_question": "Would you describe a mean and grumpy person as ███████?"
    },
    {
        "word": "affeer",
        "meaning": "To fix or settle the amount of a fine or penalty.",
        "sentences": ["The court had the power to affeer the penalty based on the severity of the case."],
        "vocabulary_question": "When you ██████ a fine, are you deciding the amount or ignoring the rule?"
    },
    {
        "word": "affiliate",
        "meaning": "To officially attach or connect a person or group to an organization.",
        "sentences": ["Our local baseball team decided to affiliate with the state league."],
        "vocabulary_question": "If you █████████ with a group, are you joining them or leaving them?"
    },
    {
        "word": "affluent",
        "meaning": "Having a great deal of money; wealthy.",
        "sentences": ["The city’s more affluent neighborhoods have very large houses and beautiful parks."],
        "vocabulary_question": "Is an ████████ person someone who is struggling with money or someone who is rich?"
    },
    {
        "word": "affogato",
        "meaning": "An Italian dessert consisting of a scoop of vanilla gelato or ice cream 'drowned' with a shot of hot espresso.",
        "sentences": ["After dinner, my parents enjoyed an affogato at the Italian cafe."],
        "vocabulary_question": "Is an ████████ something you would eat for dessert or something you would wear?"
    },
    {
        "word": "afghan",
        "meaning": "A woolen blanket or shawl, usually knitted or crocheted in colorful patterns.",
        "sentences": ["On cold winter nights, I like to wrap up in the handmade afghan my aunt made for me."],
        "vocabulary_question": "Is an ██████ a type of warm blanket or a type of cold drink?"
    },
    {
        "word": "aficionado",
        "meaning": "A person who is very knowledgeable and enthusiastic about an activity, subject, or pastime.",
        "sentences": ["Ava is a spelling bee aficionado who practices her words every single day."],
        "vocabulary_question": "Is an ██████████ someone who knows a lot about a hobby or someone who is a beginner?"
    },
    {
        "word": "agalma",
        "meaning": "A cult statue or votive offering in ancient Greece.",
        "sentences": ["The museum displayed a marble agalma found in the ruins of an ancient temple."],
        "vocabulary_question": "Is an ██████ a type of ancient statue or a modern computer?"
    },
    {
        "word": "agarita",
        "meaning": "An evergreen shrub found in the southwestern U.S. that produces red berries.",
        "sentences": ["The hikers were careful not to touch the prickly leaves of the agarita bush."],
        "vocabulary_question": "Is an ███████ a type of plant or a type of bird?"
    },
    {
        "word": "agate",
        "meaning": "An ornamental stone consisting of a hard variety of chalcedony, typically banded in appearance.",
        "sentences": ["I found a smooth, striped agate while walking along the rocky beach."],
        "vocabulary_question": "Is an █████ a type of colorful stone or a type of soft fabric?"
    },
    {
        "word": "agave",
        "meaning": "A succulent plant with rosettes of narrow spiny leaves and tall flower spikes, native to arid regions.",
        "sentences": ["The desert landscape was dotted with large agave plants and tall cacti."],
        "vocabulary_question": "Does an █████ plant typically grow in a rainy rainforest or a dry desert?"
    },
    {
        "word": "agelicism",
        "meaning": "The belief that society or the group is more important than the individual.",
        "sentences": ["The philosopher's theories were based on the concept of agelicism."],
        "vocabulary_question": "Does █████████ focus more on the power of one person or the power of the group?"
    },
    {
        "word": "aggrandizement",
        "meaning": "The act of making something appear greater or more powerful than it actually is.",
        "sentences": ["His constant bragging was clearly an attempt at self-aggrandizement."],
        "vocabulary_question": "Does ██████████████ involve making something look smaller or making it look much bigger?"
    },
    {
        "word": "agio",
        "meaning": "The percentage charged for exchanging one currency for another.",
        "sentences": ["We had to pay a small agio when we traded our dollars for euros at the airport."],
        "vocabulary_question": "Is ████ a fee related to trading money or a fee for parking a car?"
    },
    {
        "word": "aglossal",
        "meaning": "Lacking a tongue.",
        "sentences": ["Certain rare species of frogs are known to be aglossal."],
        "vocabulary_question": "If a creature is ████████, is it missing its ears or its tongue?"
    },
    {
        "word": "agnail",
        "meaning": "Another term for a hangnail; a piece of torn skin at the root of a fingernail.",
        "sentences": ["He used a small pair of clippers to carefully remove the painful agnail."],
        "vocabulary_question": "Is an ██████ a type of fingernail problem or a type of toothache?"
    },
    {
        "word": "agonistic",
        "meaning": "Relating to or being aggressive or competitive behavior.",
        "sentences": ["The two rival teams displayed agonistic behavior throughout the tournament."],
        "vocabulary_question": "Does █████████ behavior describe being friendly or being competitive and aggressive?"
    },
    {
        "word": "agoraphobia",
        "meaning": "An extreme fear of entering open or crowded places.",
        "sentences": ["Her agoraphobia made it very difficult for her to leave her house to go to the grocery store."],
        "vocabulary_question": "Does someone with ███████████ love being in big crowds or feel afraid of them?"
    },
    {
        "word": "aguaji",
        "meaning": "The fruit of a palm tree found in the Amazon rainforest.",
        "sentences": ["The local market was filled with baskets of bright orange aguaji fruit."],
        "vocabulary_question": "Is ██████ a type of fruit or a type of metal?"
    },
    {
        "word": "aikido",
        "meaning": "A Japanese martial art that uses an opponent's momentum to defend oneself.",
        "sentences": ["She decided to sign up for an aikido class to learn self-defense."],
        "vocabulary_question": "Is ██████ a type of martial art or a type of musical instrument?"
    },
    {
        "word": "aioli",
        "meaning": "Garlic mayonnaise.",
        "sentences": ["The restaurant served sweet potato fries with a side of zesty aioli."],
        "vocabulary_question": "What is the primary flavor you would expect to taste in █████?"
    },
    {
        "word": "albeit",
        "meaning": "Although; even though.",
        "sentences": ["The hike was very tiring, albeit beautiful."],
        "vocabulary_question": "Does the word ██████ mean 'therefore' or 'although'?"
    },
    {
        "word": "alchemy",
        "meaning": "An ancient practice aimed at turning base metals into gold; a seemingly magical process of transformation.",
        "sentences": ["The old stories told of a wizard who spent his life studying the secrets of alchemy."],
        "vocabulary_question": "Did practitioners of ██████ try to turn lead into gold or water into ice?"
    },
    {
        "word": "alembroth",
        "meaning": "A double salt of corrosive sublimate and sal ammoniac.",
        "sentences": ["In early chemistry, alembroth was sometimes referred to as 'salt of wisdom'."],
        "vocabulary_question": "Is █████████ a term used in the study of chemistry or the study of history?"
    },
    {
        "word": "Alexandria",
        "meaning": "A historic port city in Egypt, famous for its ancient library and lighthouse.",
        "sentences": ["Historians believe that the Library of Alexandria was once the largest in the world."],
        "vocabulary_question": "Is ██████████ a famous city in Egypt or a famous city in Brazil?"
    },
    {
        "word": "algorithm",
        "meaning": "A process or set of rules to be followed in calculations or other problem-solving operations.",
        "sentences": ["Computer scientists write a specific algorithm to help the app recommend music you might like."],
        "vocabulary_question": "Is an █████████ a set of instructions for a computer or a type of wild animal?"
    },
    {
        "word": "alimentation",
        "meaning": "The provision of nourishment or other help.",
        "sentences": ["The doctors monitored the patient’s alimentation to ensure he was getting enough vitamins."],
        "vocabulary_question": "Does ████████████ relate to eating and nutrition or sleeping and dreaming?"
    },
    {
        "word": "allergenic",
        "meaning": "Capable of causing an allergic reaction.",
        "sentences": ["People with asthma should avoid using cleaning products that are highly allergenic."],
        "vocabulary_question": "If something is ██████████, might it make someone sneeze or break out in a rash?"
    },
    {
        "word": "alliteration",
        "meaning": "The occurrence of the same letter or sound at the beginning of adjacent or closely connected words.",
        "sentences": ["The phrase 'Peter Piper picked a peck of pickled peppers' is a famous example of alliteration."],
        "vocabulary_question": "Does ████████████ involve repeating sounds at the start of words or at the end of words?"
    },
    {
        "word": "allocable",
        "meaning": "Capable of being distributed or assigned for a particular purpose.",
        "sentences": ["The manager had to decide how much of the budget was allocable to the new marketing project."],
        "vocabulary_question": "If funds are █████████, can they be set aside for a specific use?"
    },
    {
        "word": "allonym",
        "meaning": "A name that is used by a writer but belongs to another real person.",
        "sentences": ["The author published her book under an allonym to keep her true identity a secret."],
        "vocabulary_question": "Is an ███████ a fake name or the author's real legal name?"
    },
    {
        "word": "allusions",
        "meaning": "Expressions designed to call something to mind without mentioning it explicitly; indirect references.",
        "sentences": ["The poem was full of allusions to ancient Greek myths."],
        "vocabulary_question": "When you use █████████, are you talking about something directly or hinting at it?"
    },
    {
        "word": "alluvial",
        "meaning": "Relating to or derived from alluvium (clay, silt, sand, or gravel) left by flowing water.",
        "sentences": ["The river created a vast alluvial plain that was perfect for farming."],
        "vocabulary_question": "Is ████████ soil usually found near a flowing river or at the top of a dry mountain?"
    },
    {
        "word": "alma mater",
        "meaning": "The school, college, or university that one once attended.",
        "sentences": ["He returned to his alma mater to give a speech to the graduating class."],
        "vocabulary_question": "Is your ████ █████ the school you currently attend or one you have graduated from?"
    },
    {
        "word": "alpestrine",
        "meaning": "Relating to or growing in high mountains; subalpine.",
        "sentences": ["The hikers admired the rare alpestrine flowers growing near the summit."],
        "vocabulary_question": "Would you find ██████████ plants in a swamp or on a high mountain?"
    },
    {
        "word": "althorn",
        "meaning": "A brass instrument pitched in E-flat, used mainly in brass bands.",
        "sentences": ["She practiced the althorn every day to prepare for the winter concert."],
        "vocabulary_question": "Is an ███████ played by blowing air into it or by hitting it with a stick?"
    },
    {
        "word": "alveoli",
        "meaning": "Tiny air sacs in the lungs where the exchange of oxygen and carbon dioxide takes place.",
        "sentences": ["The doctor explained how oxygen enters the bloodstream through the alveoli."],
        "vocabulary_question": "Are ███████ located in the human heart or in the lungs?"
    },
    {
        "word": "Alzheimer",
        "meaning": "A progressive disease that destroys memory and other important mental functions.",
        "sentences": ["The charity raised money to support research into a cure for Alzheimer's disease."],
        "vocabulary_question": "Does █████████ primarily affect a person's physical strength or their memory?"
    },
    {
        "word": "amalgam",
        "meaning": "A mixture or blend of different elements.",
        "sentences": ["The new building's design was an amalgam of modern and traditional styles."],
        "vocabulary_question": "Is an ███████ a single, pure substance or a mix of different things?"
    },
    {
        "word": "ambiguous",
        "meaning": "Open to more than one interpretation; having a double meaning.",
        "sentences": ["The ending of the movie was intentionally ambiguous, leaving the audience to wonder what happened."],
        "vocabulary_question": "If instructions are █████████, are they perfectly clear or easy to misunderstand?"
    },
    {
        "word": "ambrosial",
        "meaning": "Extremely pleasing to the taste or smell; divine.",
        "sentences": ["The kitchen was filled with the ambrosial aroma of fresh-baked bread."],
        "vocabulary_question": "Does something █████████ taste terrible or wonderful?"
    },
    {
        "word": "ammonite",
        "meaning": "An extinct sea creature with a spiral shell, often found as a fossil.",
        "sentences": ["The geologist found a perfectly preserved ammonite fossil in the cliffside."],
        "vocabulary_question": "Is an █████████ a type of modern bird or an ancient sea creature fossil?"
    },
    {
        "word": "amygdala",
        "meaning": "A part of the brain involved with experiencing emotions.",
        "sentences": ["Scientists believe the amygdala plays a key role in how we process fear."],
        "vocabulary_question": "Is the ████████ located in the human brain or in the stomach?"
    },
    {
        "word": "anabolic",
        "meaning": "Relating to the building up of complex molecules in living organisms from simpler ones.",
        "sentences": ["The athlete was warned about the dangers of using prohibited anabolic substances."],
        "vocabulary_question": "Does ████████ activity involve breaking things down or building them up?"
    },
    {
        "word": "anachronism",
        "meaning": "Something that is out of its proper time in history.",
        "sentences": ["Seeing a character use a smartphone in a movie set in the 1800s is an anachronism."],
        "vocabulary_question": "Is an ███████████ something that fits perfectly in its time or is out of place?"
    },
    {
        "word": "anacreontic",
        "meaning": "Relating to Greek lyrics that are celebratory or social in nature.",
        "sentences": ["The poet was famous for his lighthearted, anacreontic verses."],
        "vocabulary_question": "Are ███████████ poems usually very sad and serious or festive and social?"
    },
    {
        "word": "anaglyphy",
        "meaning": "The art of carving or embossing in low relief.",
        "sentences": ["The ancient stone tablet was a beautiful example of detailed anaglyphy."],
        "vocabulary_question": "Does █████████ involve painting on a flat surface or carving into a material?"
    },
    {
        "word": "analects",
        "meaning": "A collection of short literary or philosophical extracts.",
        "sentences": ["Students spent the semester studying the famous Analects of Confucius."],
        "vocabulary_question": "Are ████████ a single long novel or a collection of short sayings and writings?"
    },
    {
        "word": "analepsis",
        "meaning": "A literary device where the story moves back in time; a flashback.",
        "sentences": ["The author used analepsis to explain the main character's mysterious past."],
        "vocabulary_question": "When a story uses █████████, is it moving into the future or back to the past?"
    },
    {
        "word": "analgesia",
        "meaning": "The inability to feel pain while still remaining conscious.",
        "sentences": ["The medication provided enough analgesia for the patient to undergo the procedure."],
        "vocabulary_question": "Does █████████ make a person feel more pain or take the pain away?"
    },
    {
        "word": "anastomosis",
        "meaning": "A connection made between adjacent blood vessels or other tubular structures.",
        "sentences": ["The surgeon performed an anastomosis to bypass the blocked artery."],
        "vocabulary_question": "Does ███████████ describe two things being separated or being joined together?"
    },
    {
        "word": "anatomical",
        "meaning": "Relating to the structure of the body.",
        "sentences": ["The science museum had an anatomical model showing the human skeletal system."],
        "vocabulary_question": "Does an ██████████ study focus on how the mind works or how the body is built?"
    },
    {
        "word": "anchorage",
        "meaning": "An area that is suitable for a ship to drop anchor.",
        "sentences": ["The captain looked for a safe anchorage to wait out the approaching storm."],
        "vocabulary_question": "Is an █████████ a place where a ship can park or a place where a plane lands?"
    },
    {
        "word": "ancillary",
        "meaning": "Providing necessary support to the primary activities or operation of an organization.",
        "sentences": ["The main office has several ancillary buildings for storage and extra workspace."],
        "vocabulary_question": "Is an █████████ service the main event or one that provides extra support?"
    },
    {
        "word": "anemic",
        "meaning": "Lacking in color, spirit, or vitality; suffering from a low red blood cell count.",
        "sentences": ["The plant looked anemic because it hadn't received enough sunlight or water."],
        "vocabulary_question": "Does an ██████ person or thing look full of energy or weak and pale?"
    },
    {
        "word": "anent",
        "meaning": "Concerning; about.",
        "sentences": ["I have a few questions anent the new rules for the competition."],
        "vocabulary_question": "If you are speaking █████ a topic, are you speaking 'about' it or 'against' it?"
    },
    {
        "word": "anglophile",
        "meaning": "A person who is fond of or admires England or Britain.",
        "sentences": ["As a true anglophile, he traveled to London every chance he got."],
        "vocabulary_question": "Does an ██████████ love British culture or feel afraid of it?"
    },
    {
        "word": "anhinga",
        "meaning": "A large water bird with a long neck, often found in warm climates.",
        "sentences": ["We saw an anhinga drying its wings on a branch over the river."],
        "vocabulary_question": "Is an ███████ a type of bird or a type of fish?"
    },
    {
        "word": "anicca",
        "meaning": "The belief in the impermanence of all things.",
        "sentences": ["The teacher spoke about the concept of anicca and how everything changes."],
        "vocabulary_question": "Does ██████ focus on things staying the same forever or things always changing?"
    },
    {
        "word": "anionic",
        "meaning": "Relating to or being a negatively charged ion.",
        "sentences": ["The scientist studied the behavior of anionic particles in the solution."],
        "vocabulary_question": "Does an ███████ particle have a positive charge or a negative charge?"
    },
    {
        "word": "anise",
        "meaning": "A plant with seeds that have a flavor similar to licorice.",
        "sentences": ["She added a pinch of ground anise to the cookie dough for extra flavor."],
        "vocabulary_question": "Does █████ taste more like spicy pepper or sweet licorice?"
    },
    {
        "word": "anito",
        "meaning": "An ancestral spirit or deity in traditional Philippine beliefs.",
        "sentences": ["The villagers performed a ceremony to honor the local anito."],
        "vocabulary_question": "Is an █████ a type of spirit or a type of stone tool?"
    },
    {
        "word": "Anjou",
        "meaning": "A variety of pear that is usually green or red.",
        "sentences": ["I packed a sweet Anjou pear in my lunch box for a healthy snack."],
        "vocabulary_question": "Is an █████ a type of delicious fruit or a type of heavy metal?"
    },
    {
        "word": "ankh",
        "meaning": "An ancient Egyptian symbol of life, shaped like a cross with a loop at the top.",
        "sentences": ["The ancient Egyptian wall painting showed a god holding an ankh."],
        "vocabulary_question": "Is an ████ an ancient symbol of life or a type of modern footwear?"
    },
    {
        "word": "anneal",
        "meaning": "To heat glass or metal and then allow it to cool slowly to make it stronger and less brittle.",
        "sentences": ["The blacksmith had to anneal the steel blade to ensure it wouldn't break during use."],
        "vocabulary_question": "Does the process of ██████ involve heating something up or cooling it down very quickly?"
    },
    {
        "word": "annuity",
        "meaning": "A fixed sum of money paid to someone each year, typically for the rest of their life.",
        "sentences": ["After retiring, she received a monthly payment from her annuity."],
        "vocabulary_question": "Is an ███████ a one-time payment or a regular sum of money paid every year?"
    },
    {
        "word": "annulment",
        "meaning": "A legal procedure which cancels a marriage or contract, declaring it null and void.",
        "sentences": ["The lawyer explained the process of seeking an annulment for the business agreement."],
        "vocabulary_question": "Does an █████████ make a contract stronger or end it completely?"
    },
    {
        "word": "anodyne",
        "meaning": "Having a pain-relieving or calming effect.",
        "sentences": ["The soothing music had an anodyne effect on the stressed audience."],
        "vocabulary_question": "Does something ███████ make a person feel more pain or less pain?"
    },
    {
        "word": "anole",
        "meaning": "A small, color-changing lizard native to the Americas.",
        "sentences": ["We watched the bright green anole jump from one leaf to another in the garden."],
        "vocabulary_question": "Is an █████ a type of lizard or a type of small bird?"
    },
    {
        "word": "anonymity",
        "meaning": "The condition of being anonymous; not being identified by name.",
        "sentences": ["The donor requested total anonymity when giving the large gift to the hospital."],
        "vocabulary_question": "If you have █████████, does everyone know your name or is it hidden?"
    },
    {
        "word": "anorak",
        "meaning": "A waterproof jacket, typically with a hood, designed for protection from cold and wind.",
        "sentences": ["He zipped up his warm anorak before heading out into the snowy afternoon."],
        "vocabulary_question": "Is an ██████ a type of heavy winter jacket or a type of thin summer shirt?"
    },
    {
        "word": "anserine",
        "meaning": "Relating to, resembling, or characteristic of a goose.",
        "sentences": ["The children laughed at the bird's anserine waddle across the park."],
        "vocabulary_question": "Does the word ████████ relate to a clever fox or a silly goose?"
    },
    {
        "word": "antacid",
        "meaning": "A substance that neutralizes stomach acid to relieve indigestion or heartburn.",
        "sentences": ["She took an antacid to help settle her stomach after eating the spicy meal."],
        "vocabulary_question": "Does an ███████ increase the amount of acid in your stomach or reduce it?"
    },
    {
        "word": "antagonistic",
        "meaning": "Showing or feeling active opposition or hostility toward someone or something.",
        "sentences": ["The two rival candidates had an antagonistic relationship throughout the campaign."],
        "vocabulary_question": "If someone is ████████████, are they being very friendly or being difficult and hostile?"
    },
    {
        "word": "anthropomorphic",
        "meaning": "Having human characteristics or behavior attributed to a non-human being or object.",
        "sentences": ["Many cartoons feature anthropomorphic animals that talk and wear clothes."],
        "vocabulary_question": "Is an ██████████████ animal one that acts like a wild creature or one that acts like a human?"
    },
    {
        "word": "antipathy",
        "meaning": "A deep-seated feeling of dislike; aversion.",
        "sentences": ["There was a long-standing antipathy between the two families."],
        "vocabulary_question": "If you feel █████████ toward something, do you like it very much or dislike it?"
    },
    {
        "word": "antiquarian",
        "meaning": "Relating to or dealing in antiques or rare old books.",
        "sentences": ["The antiquarian bookstore was filled with dusty, first-edition volumes from the 1800s."],
        "vocabulary_question": "Does an ███████████ shop sell the newest gadgets or very old and rare items?"
    },
    {
        "word": "antithesis",
        "meaning": "A person or thing that is the direct opposite of someone or something else.",
        "sentences": ["Her calm and patient nature was the antithesis of her brother's energetic and loud personality."],
        "vocabulary_question": "Is the ██████████ of something its twin or its exact opposite?"
    },
    {
        "word": "anxiety",
        "meaning": "A feeling of worry, nervousness, or unease.",
        "sentences": ["He felt a bit of anxiety before giving his big presentation to the class."],
        "vocabulary_question": "Is ███████ a feeling of being very relaxed or a feeling of being worried?"
    },
    {
        "word": "aperture",
        "meaning": "An opening, hole, or gap, especially in a camera that controls the amount of light.",
        "sentences": ["The photographer adjusted the camera's aperture to get the perfect shot."],
        "vocabulary_question": "Is an ████████ a wide-open space or a small opening or gap?"
    },
    {
        "word": "apiary",
        "meaning": "Beehives kept for honey production.",
        "sentences": ["The beekeeper wore a protective suit while working in the apiary."],
        "vocabulary_question": "Would you find a group of horses or a group of beehives in an ███████?"
    },
    {
        "word": "aporia",
        "meaning": "An expression of real or pretended doubt or uncertainty.",
        "sentences": ["The philosopher's lecture left the students in a state of aporia."],
        "vocabulary_question": "Does ██████ describe a feeling of absolute certainty or a feeling of doubt?"
    },
    {
        "word": "apostrophe",
        "meaning": "A punctuation mark used to indicate possession or the omission of letters or numbers.",
        "sentences": ["Don't forget to put an apostrophe in the word 'don't'!"],
        "vocabulary_question": "Is an ██████████ a type of punctuation or a type of sentence?"
    },
    {
        "word": "apothecary",
        "meaning": "A person who prepared and sold medicines and drugs in the past.",
        "sentences": ["In the old days, people would visit the apothecary for herbal remedies."],
        "vocabulary_question": "Would an ██████████ sell you a loaf of bread or medicine?"
    },
    {
        "word": "apotheosis",
        "meaning": "The highest point in the development of something; a perfect example.",
        "sentences": ["The team’s victory was the apotheosis of years of hard work and training."],
        "vocabulary_question": "Is an ██████████ the lowest failure or the highest peak of success?"
    },
    {
        "word": "apotropaic",
        "meaning": "Supposedly having the power to avert evil influences or bad luck.",
        "sentences": ["Ancient people often wore apotropaic charms for protection."],
        "vocabulary_question": "Is an ██████████ object meant to attract bad luck or keep it away?"
    },
    {
        "word": "apparatus",
        "meaning": "The technical equipment or machinery needed for a particular activity or purpose.",
        "sentences": ["The scientists set up the complicated apparatus for the experiment."],
        "vocabulary_question": "Is an █████████ a single simple tool or a complex set of equipment?"
    },
    {
        "word": "approbatory",
        "meaning": "Expressing or showing approval or praise.",
        "sentences": ["The audience gave an approbatory round of applause after the performance."],
        "vocabulary_question": "Is an ███████████ comment meant to criticize someone or to praise them?"
    },
    {
        "word": "aqueous",
        "meaning": "Made from, by using, or with water.",
        "sentences": ["The liquid in the beaker was an aqueous solution of salt and water."],
        "vocabulary_question": "Is an ███████ substance made with oil or with water?"
    },
    {
        "word": "aquiclude",
        "meaning": "An underground layer of rock or sediment that does not allow water to pass through.",
        "sentences": ["The scientists studied the aquiclude to understand the movement of groundwater."],
        "vocabulary_question": "Does an █████████ let water flow through easily or does it block it?"
    },
    {
        "word": "arbitrary",
        "meaning": "Based on random choice or personal whim, rather than any reason or system.",
        "sentences": ["The decision to pick the winner seemed completely arbitrary."],
        "vocabulary_question": "Is an █████████ choice based on a strict set of rules or just a random guess?"
    },
    {
        "word": "arboretum",
        "meaning": "A botanical garden devoted to trees.",
        "sentences": ["We spent the afternoon walking through the beautiful arboretum."],
        "vocabulary_question": "Would you visit an █████████ to see a collection of fish or a collection of trees?"
    },
    {
        "word": "arbutus",
        "meaning": "An evergreen tree or shrub with white or pink flowers and red berries.",
        "sentences": ["The arbutus tree in the yard bloomed with small, bell-shaped flowers."],
        "vocabulary_question": "Is an ███████ a type of flowering plant or a type of ocean animal?"
    },
    {
        "word": "archetype",
        "meaning": "A very typical example of a certain person or thing; an original that has been imitated.",
        "sentences": ["The brave knight is a classic archetype in many fairy tales."],
        "vocabulary_question": "Is an █████████ a brand new idea or a classic example that others copy?"
    },
    {
        "word": "arduous",
        "meaning": "Involving or requiring strenuous effort; difficult and tiring.",
        "sentences": ["The hikers began their arduous climb up the steep mountain."],
        "vocabulary_question": "If a task is ███████, is it very easy to do or very hard and exhausting?"
    },
    {
        "word": "argot",
        "meaning": "The jargon or slang of a particular group or class.",
        "sentences": ["The teenagers used a specific argot that their parents couldn't understand."],
        "vocabulary_question": "Is █████ the formal language used in a dictionary or the slang used by a specific group?"
    },
    {
        "word": "arietta",
        "meaning": "A short aria or a simple melody.",
        "sentences": ["The opera singer performed a beautiful arietta during the second act."],
        "vocabulary_question": "Is an ███████ a very long, complex song or a short and simple melody?"
    },
    {
        "word": "armaments",
        "meaning": "Military weapons and equipment.",
        "sentences": ["The museum displayed a collection of medieval armaments, including swords and shields."],
        "vocabulary_question": "Does the word █████████ refer to farm tools or military weapons?"
    },
    {
        "word": "armature",
        "meaning": "The rotating part of an electric motor or generator; or a framework used by a sculptor.",
        "sentences": ["The sculptor built a wire armature to support the heavy clay."],
        "vocabulary_question": "Is an ████████ a soft finishing material or a strong internal framework?"
    },
    {
        "word": "armistice",
        "meaning": "An agreement made by opposing sides in a war to stop fighting for a certain time; a truce.",
        "sentences": ["The two countries finally signed an armistice to end the conflict."],
        "vocabulary_question": "Does an █████████ mean the fighting is starting or that there is a truce to stop fighting?"
    },
    {
        "word": "arpeggio",
        "meaning": "The notes of a musical chord played in rapid succession rather than simultaneously.",
        "sentences": ["The pianist ended the piece with a sweeping arpeggio."],
        "vocabulary_question": "Is an ████████ playing all the notes at once or playing them one after another very quickly?"
    },
    {
        "word": "arraign",
        "meaning": "To call or bring someone before a court to answer a criminal charge.",
        "sentences": ["The authorities will arraign the suspect in court tomorrow morning."],
        "vocabulary_question": "When you ███████ someone, are you letting them go home or bringing them to court for a charge?"
    },
    {
        "word": "arrearage",
        "meaning": "The state of being behind in the fulfillment of obligations or payments; the amount overdue.",
        "sentences": ["The company had to settle its arrearage before it could take out a new loan."],
        "vocabulary_question": "Does █████████ mean you have paid everything on time or that you owe money that is late?"
    },
    {
        "word": "arrieros",
        "meaning": "Muleteers; people who drive mules or other pack animals.",
        "sentences": ["The arrieros led the long line of mules through the narrow mountain pass."],
        "vocabulary_question": "Are █████████ people who fly airplanes or people who lead pack animals like mules?"
    },
    {
        "word": "arsenal",
        "meaning": "A collection of weapons and military equipment stored by a country, person, or group.",
        "sentences": ["The fortress contained a massive arsenal to defend against attackers."],
        "vocabulary_question": "Is an ███████ a place where food is grown or a place where weapons are kept?"
    },
    {
        "word": "art brut",
        "meaning": "Raw art; art created by people outside the established art world, such as children or prisoners.",
        "sentences": ["The gallery featured an exhibit of art brut that was full of raw emotion and unique styles."],
        "vocabulary_question": "Is ███ ████ art made by famous professional artists or art made by people outside the art world?"
    },
    {
        "word": "artesian",
        "meaning": "Relating to a well in which water rises under pressure from an underground source.",
        "sentences": ["The farm relied on an artesian well for its clean water supply."],
        "vocabulary_question": "Does ████████ water stay deep underground or rise up toward the surface under pressure?"
    },
    {
        "word": "artifice",
        "meaning": "Clever or cunning devices or expedients, especially as used to trick or deceive others.",
        "sentences": ["The magician used a clever artifice to make the rabbit disappear."],
        "vocabulary_question": "Is ████████ a honest and straightforward action or a sneaky trick meant to deceive?"
    },
    {
        "word": "asado",
        "meaning": "A technique and social event for having or attending a barbecue in South America.",
        "sentences": ["Our neighbors invited us over for a traditional asado on Saturday afternoon."],
        "vocabulary_question": "Is an █████ a type of dance or a style of barbecue?"
    },
    {
        "word": "ascension",
        "meaning": "The act of rising to an important position or a higher level.",
        "sentences": ["Her rapid ascension to the role of captain surprised everyone on the team."],
        "vocabulary_question": "Does █████████ mean moving down to a lower level or rising to a higher one?"
    },
    {
        "word": "ascertain",
        "meaning": "To find something out for certain; to make sure of.",
        "sentences": ["The detective tried to ascertain the truth about what happened that night."],
        "vocabulary_question": "When you █████████ something, are you guessing or finding out the definite truth?"
    },
    {
        "word": "ascetic",
        "meaning": "Characterized by or suggesting the practice of severe self-discipline and abstention from all forms of indulgence.",
        "sentences": ["The monk lived an ascetic life in a small, simple room with no modern luxuries."],
        "vocabulary_question": "Does an ███████ person live a life of luxury or a life of extreme self-discipline and simplicity?"
    },
    {
        "word": "Asgard",
        "meaning": "In Norse mythology, the dwelling place of the gods.",
        "sentences": ["The stories told of the great hall of Valhalla located in the realm of Asgard."],
        "vocabulary_question": "Is ██████ a city on Earth or the home of the gods in Norse mythology?"
    },
    {
        "word": "Asiago",
        "meaning": "A type of Italian cow's milk cheese that can vary in texture from soft to hard.",
        "sentences": ["He sprinkled some grated Asiago cheese over his pasta for extra flavor."],
        "vocabulary_question": "Is ██████ a type of spicy fruit or a type of Italian cheese?"
    },
    {
        "word": "aspish",
        "meaning": "Resembling or characteristic of an asp (a small venomous snake); spiteful or irritable.",
        "sentences": ["Her aspish remark hurt his feelings more than she realized."],
        "vocabulary_question": "Does an ██████ comment sound kind and helpful or mean and irritable?"
    },
    {
        "word": "assailant",
        "meaning": "A person who physically attacks another.",
        "sentences": ["The brave bystander helped the victim until the assailant was caught by the police."],
        "vocabulary_question": "Is an █████████ the person who is being attacked or the person who is doing the attacking?"
    },
    {
        "word": "assiduous",
        "meaning": "Showing great care and perseverance.",
        "sentences": ["Her assiduous study habits helped her earn top marks on all her spelling tests."],
        "vocabulary_question": "Is an █████████ student someone who gives up easily or someone who works very hard and carefully?"
    },
    {
        "word": "assumption",
        "meaning": "A thing that is accepted as true or as certain to happen, without proof.",
        "sentences": ["It was a wrong assumption to think the store would be open on a holiday."],
        "vocabulary_question": "Is an ██████████ something you know for a fact or something you believe is true without proof?"
    },
    {
        "word": "assure",
        "meaning": "To tell someone something positively or confidently to dispel any doubts they may have.",
        "sentences": ["The teacher tried to assure the nervous student that the test would not be too difficult."],
        "vocabulary_question": "When you ██████ someone, are you trying to make them more worried or more confident?"
    },
    {
        "word": "asthmatic",
        "meaning": "Relating to or suffering from asthma, a condition that causes difficulty in breathing.",
        "sentences": ["The coach made sure the asthmatic player had her inhaler nearby during practice."],
        "vocabulary_question": "Does an █████████ condition make it harder for a person to see or harder for them to breathe?"
    },
    {
        "word": "astigmatism",
        "meaning": "A defect in the eye or in a lens caused by a deviation from spherical curvature, which results in distorted images.",
        "sentences": ["Her new glasses were designed to correct her astigmatism so she could see clearly."],
        "vocabulary_question": "Is ███████████ a problem with a person's hearing or with the shape of their eye?"
    },
    {
        "word": "astral",
        "meaning": "Relating to or resembling the stars.",
        "sentences": ["The telescope allowed us to see distant astral bodies in great detail."],
        "vocabulary_question": "Does the word ██████ relate to things found deep in the ocean or things found among the stars?"
    },
    {
        "word": "astringent",
        "meaning": "Causing the contraction of skin cells and other body tissues; or sharp or severe in manner or style.",
        "sentences": ["She used an astringent lotion to help clean her skin and tighten her pores."],
        "vocabulary_question": "Does an ██████████ substance make skin feel loose and soft or tight and firm?"
    },
    {
        "word": "astrobleme",
        "meaning": "An eroded remnant of a large crater made by the impact of a meteorite or comet.",
        "sentences": ["Scientists traveled to the desert to study the ancient astrobleme."],
        "vocabulary_question": "Is an ██████████ a type of star in the sky or a crater left on Earth by a meteorite?"
    },
    {
        "word": "Astur",
        "meaning": "A genus of hawks, or relating to the Asturias region in Spain.",
        "sentences": ["The Astur hawk is known for its incredible speed and sharp eyesight."],
        "vocabulary_question": "Does the word █████ usually refer to a type of bird of prey or a type of fish?"
    },
    {
        "word": "asylum",
        "meaning": "Protection granted by a nation to someone who has left their native country as a political refugee; or an institution for care.",
        "sentences": ["The family sought asylum in a neighboring country to escape the conflict."],
        "vocabulary_question": "Is an ██████ a place where someone goes to be protected or a place where they are in danger?"
    },
    {
        "word": "atavistic",
        "meaning": "Relating to or characterized by reversion to something ancient or ancestral.",
        "sentences": ["The dog showed an atavistic urge to howl at the full moon like its wolf ancestors."],
        "vocabulary_question": "Does █████████ behavior relate to modern technology or ancient, ancestral traits?"
    },
    {
        "word": "ataxia",
        "meaning": "The loss of full control of bodily movements.",
        "sentences": ["The medical condition caused him to suffer from ataxia, making it hard to walk steadily."],
        "vocabulary_question": "Does ██████ make a person's movements very smooth or very clumsy and difficult to control?"
    },
    {
        "word": "Aten",
        "meaning": "The disk of the sun in ancient Egyptian mythology, and originally an aspect of the god Ra.",
        "sentences": ["Akhenaten changed Egyptian religion to focus on the worship of the sun disk, Aten."],
        "vocabulary_question": "In ancient history, was ████ a name for the moon or for the sun?"
    },
    {
        "word": "atlatl",
        "meaning": "A stick used by Eskimos and early American Indians to propel a spear or dart.",
        "sentences": ["The hunter used an atlatl to throw his spear much further than he could by hand."],
        "vocabulary_question": "Is an ██████ a tool used for throwing spears or a type of small boat?"
    },
    {
        "word": "atman",
        "meaning": "The spiritual life principle of the universe, especially when regarded as inherent in the real self of the individual.",
        "sentences": ["In Hindu philosophy, understanding the atman is a key part of spiritual growth."],
        "vocabulary_question": "Does the word █████ relate to a person's physical body or their inner spirit?"
    },
    {
        "word": "atrabilious",
        "meaning": "Melancholy or ill-tempered.",
        "sentences": ["The cold, rainy weather put him in an atrabilious mood."],
        "vocabulary_question": "Is an ███████████ person feeling very happy or very grumpy and sad?"
    },
    {
        "word": "atresia",
        "meaning": "The absence or abnormal narrowing of an opening or passage in the body.",
        "sentences": ["The baby was born with a condition called biliary atresia that required surgery."],
        "vocabulary_question": "Does ███████ describe a body passage that is wide open or one that is blocked or missing?"
    },
    {
        "word": "attaché",
        "meaning": "A person on the staff of an ambassador, typically with a specialized area of responsibility.",
        "sentences": ["The military attaché helped coordinate the meeting between the two countries."],
        "vocabulary_question": "Is an ███████ a person who works for an embassy or a type of suitcase?"
    },
    {
        "word": "attributive",
        "meaning": "An adjective or noun used before another noun to describe it (like 'red' in 'red car').",
        "sentences": ["In the phrase 'the golden ticket,' the word 'golden' is an attributive adjective."],
        "vocabulary_question": "In grammar, does an ███████████ word come before a noun to describe it or after a verb?"
    },
    {
        "word": "attrition",
        "meaning": "The process of gradually reducing the strength or effectiveness of someone or something through sustained attack or pressure.",
        "sentences": ["The long game became a war of attrition as both teams grew exhausted."],
        "vocabulary_question": "Does █████████ involve a sudden, quick victory or a slow wearing down over time?"
    },
    {
        "word": "aubergine",
        "meaning": "The dark purple fruit of a plant, used as a vegetable; also known as an eggplant.",
        "sentences": ["She sliced the aubergine to prepare a delicious Mediterranean dish."],
        "vocabulary_question": "Is an █████████ a type of vegetable (eggplant) or a type of musical instrument?"
    },
    {
        "word": "auburn",
        "meaning": "A reddish-brown color, typically used to describe hair.",
        "sentences": ["The girl had long, beautiful auburn hair that glowed in the sunlight."],
        "vocabulary_question": "Is ██████ a color that looks more like bright blue or reddish-brown?"
    },
    {
        "word": "aughts",
        "meaning": "The decade from 2000 to 2009.",
        "sentences": ["Many popular songs from the aughts are still played on the radio today."],
        "vocabulary_question": "Does the term ██████ refer to the years 1920–1929 or 2000–2009?"
    },
    {
        "word": "augment",
        "meaning": "To make something greater by adding to it; to increase.",
        "sentences": ["He took a part-time job to augment his savings for a new laptop."],
        "vocabulary_question": "When you ███████ something, are you making it smaller or making it larger?"
    },
    {
        "word": "augury",
        "meaning": "A sign of what will happen in the future; an omen.",
        "sentences": ["The sudden appearance of the comet was seen as an augury of great change."],
        "vocabulary_question": "Is an ██████ a prediction about the future or a story about the past?"
    },
    {
        "word": "auklet",
        "meaning": "A small seabird of the auk family, found in northern Pacific waters.",
        "sentences": ["We spotted a crested auklet nesting on the rocky cliffs of the island."],
        "vocabulary_question": "Is an ██████ a type of small bird or a type of small boat?"
    },
    {
        "word": "aureole",
        "meaning": "A circle of light or brightness surrounding something, especially as depicted in art around the head of a holy person.",
        "sentences": ["The painting showed a golden aureole around the angel's head."],
        "vocabulary_question": "Is an ███████ a dark shadow or a bright circle of light?"
    },
    {
        "word": "auricular",
        "meaning": "Relating to the ear or the sense of hearing.",
        "sentences": ["The doctor used a special tool to examine the patient's auricular canal."],
        "vocabulary_question": "Does the word █████████ relate to your eyes or your ears?"
    },
    {
        "word": "aurora",
        "meaning": "A natural light display in the sky, especially in high-latitude regions (like the Northern Lights).",
        "sentences": ["The travelers stayed up late hoping to see the green and purple colors of the aurora."],
        "vocabulary_question": "Is an ██████ a light display in the sky or a type of underground cave?"
    },
    {
        "word": "auspices",
        "meaning": "With the help, support, or protection of a person or organization.",
        "sentences": ["The youth art program was held under the auspices of the local museum."],
        "vocabulary_question": "If an event is held under the ████████ of a group, is that group supporting it or against it?"
    },
    {
        "word": "austere",
        "meaning": "Severe or strict in manner, attitude, or appearance; simple and without luxury.",
        "sentences": ["The monk's room was very austere, with only a small bed and a wooden desk."],
        "vocabulary_question": "Is an ███████ room one that is filled with fancy decorations or one that is very plain and simple?"
    },
    {
        "word": "autobahn",
        "meaning": "A high-speed highway in Germany, famous for having no federally mandated speed limit in some areas.",
        "sentences": ["Driving on the autobahn requires great focus because cars travel very fast."],
        "vocabulary_question": "Is the ████████ a type of fast highway or a type of small car?"
    },
    {
        "word": "avarice",
        "meaning": "Extreme greed for wealth or material gain.",
        "sentences": ["The old king’s avarice led him to tax his people unfairly to fill his treasure room."],
        "vocabulary_question": "Is ███████ a word for being very generous or being very greedy?"
    },
    {
        "word": "avifauna",
        "meaning": "The birds of a particular region, habitat, or geological period.",
        "sentences": ["The biologist spent years cataloging the unique avifauna of the Galapagos Islands."],
        "vocabulary_question": "When studying ████████, are you looking at the local fish or the local birds?"
    },
    {
        "word": "avuncular",
        "meaning": "Relating to an uncle; or kind and friendly toward a younger person, like an uncle.",
        "sentences": ["The coach had an avuncular manner that made all the players feel welcome."],
        "vocabulary_question": "Does an █████████ person act more like a mean stranger or a kind, friendly uncle?"
    },
    {
        "word": "babka",
        "meaning": "A sweet braided bread or cake originating in the Jewish communities of Poland and Ukraine.",
        "sentences": ["For dessert, we shared a delicious chocolate babka from the local bakery."],
        "vocabulary_question": "Is a █████ a type of savory soup or a sweet braided bread?"
    },
    {
        "word": "babouche",
        "meaning": "A flat slipper of a style originated in Morocco, lacking a heel or quarters.",
        "sentences": ["He wore a pair of leather babouche slippers around the house."],
        "vocabulary_question": "Is a ████████ something you would wear on your feet or on your head?"
    },
    {
        "word": "bacteriolytic",
        "meaning": "Relating to the destruction or dissolution of bacteria.",
        "sentences": ["The scientist studied the bacteriolytic properties of the new medicine."],
        "vocabulary_question": "Does a ██████████████ substance help bacteria grow or destroy them?"
    },
    {
        "word": "Bactrian",
        "meaning": "Relating to Bactria, an ancient region in Central Asia, or a camel with two humps.",
        "sentences": ["The Bactrian camel is well-adapted to the cold deserts of Central Asia."],
        "vocabulary_question": "How many humps does a ████████ camel have?"
    },
    {
        "word": "ballyhooed",
        "meaning": "Praised or publicized extravagantly.",
        "sentences": ["The ballyhooed movie turned out to be quite disappointing."],
        "vocabulary_question": "If a show is ██████████, has it been kept a secret or widely praised?"
    },
    {
        "word": "balsamic",
        "meaning": "Relating to or containing balsam; or a dark, sweet vinegar.",
        "sentences": ["She drizzled balsamic vinegar over the fresh caprese salad."],
        "vocabulary_question": "Is ████████ a type of vinegar often used in cooking?"
    },
    {
        "word": "bandicoot",
        "meaning": "A small, insect-eating marsupial native to Australia and New Guinea.",
        "sentences": ["The long-nosed bandicoot is known for digging small holes in the garden."],
        "vocabulary_question": "Is a █████████ a type of bird or a type of marsupial?"
    },
    {
        "word": "bandolerismo",
        "meaning": "A system of banditry or robbery, particularly in Spanish-speaking regions.",
        "sentences": ["The old stories described the era of bandolerismo in the mountains."],
        "vocabulary_question": "Does ████████████ relate to the law or to banditry and robbery?"
    },
    {
        "word": "bango",
        "meaning": "A type of African plant, or a specific type of drum.",
        "sentences": ["The musician played a rhythmic beat on the bango drum."],
        "vocabulary_question": "Is a █████ a type of instrument you play or a type of car?"
    },
    {
        "word": "bannock",
        "meaning": "A round, flat loaf of bread, traditionally unleavened.",
        "sentences": ["The travelers cooked a simple bannock over the campfire."],
        "vocabulary_question": "Is a ███████ a type of bread or a type of vegetable?"
    },
    {
        "word": "Barnevelder",
        "meaning": "A Dutch breed of medium-heavy domestic chicken.",
        "sentences": ["The farmer raised several Barnevelder hens for their dark brown eggs."],
        "vocabulary_question": "Is a ████████████ a type of farm animal (chicken) or a type of tractor?"
    },
    {
        "word": "baronetcy",
        "meaning": "The rank or title of a baronet.",
        "sentences": ["He was granted a baronetcy for his many years of service to the crown."],
        "vocabulary_question": "Is a █████████ a title of nobility or a type of money?"
    },
    {
        "word": "basilica",
        "meaning": "A large, important church building given special ceremonial rights by the Pope.",
        "sentences": ["We visited the beautiful St. Peter's Basilica while traveling through Rome."],
        "vocabulary_question": "Is a ████████ a large church building or a type of pasta sauce?"
    },
    {
        "word": "bastide",
        "meaning": "A medieval fortified town in southwest France.",
        "sentences": ["The ancient bastide was built on a hilltop to defend against attackers."],
        "vocabulary_question": "Is a ███████ a type of fortified town or a type of boat?"
    },
    {
        "word": "Bavarian cream",
        "meaning": "A light, fluffy dessert made with custard, gelatin, and whipped cream.",
        "sentences": ["The pastry was filled with sweet, smooth Bavarian cream."],
        "vocabulary_question": "Is ████████ █████ a type of dessert filling or a type of paint?"
    },
    {
        "word": "beatific",
        "meaning": "Displaying great happiness, peace, or holiness.",
        "sentences": ["The baby had a beatific smile while sleeping peacefully."],
        "vocabulary_question": "Does a ████████ expression show that someone is very angry or very happy?"
    },
    {
        "word": "beguile",
        "meaning": "To charm or enchant someone, sometimes in a deceptive way.",
        "sentences": ["The magician tried to beguile the audience with his clever card tricks."],
        "vocabulary_question": "When you ███████ someone, are you boring them or charming them?"
    },
    {
        "word": "Belgravia",
        "meaning": "An affluent district in central London.",
        "sentences": ["Belgravia is known for its beautiful white stucco houses and embassies."],
        "vocabulary_question": "Is █████████ a famous district in London or a city in Italy?"
    },
    {
        "word": "belladonna",
        "meaning": "A poisonous plant with purple flowers and small black berries, also called deadly nightshade.",
        "sentences": ["Ancient people used belladonna for medicine, even though it is very toxic."],
        "vocabulary_question": "Is ██████████ a safe garden vegetable or a poisonous plant?"
    },
    {
        "word": "Bellatrix",
        "meaning": "The third brightest star in the constellation Orion.",
        "sentences": ["We looked through the telescope to find Bellatrix in the night sky."],
        "vocabulary_question": "Is █████████ a name for a planet or a star?"
    },
    {
        "word": "benign",
        "meaning": "Gentle and kindly; or not harmful in nature (especially of a disease).",
        "sentences": ["The doctor assured the patient that the tumor was benign and not dangerous."],
        "vocabulary_question": "If a condition is ██████, is it very harmful or harmless?"
    },
    {
        "word": "benison",
        "meaning": "A blessing.",
        "sentences": ["The traveler received a benison from the village elder before his journey."],
        "vocabulary_question": "Is a ███████ a curse or a blessing?"
    },
    {
        "word": "bequeath",
        "meaning": "To leave property or money to a person or other beneficiary by a will.",
        "sentences": ["The grandmother chose to bequeath her antique jewelry to her granddaughter."],
        "vocabulary_question": "When you ████████ something, are you taking it from someone or giving it to them in a will?"
    },
    {
        "word": "Berber",
        "meaning": "Relating to a group of people native to North Africa.",
        "sentences": ["The Berber tribes have lived in the Atlas Mountains for thousands of years."],
        "vocabulary_question": "Does the word ██████ relate to a group of people from North Africa or South America?"
    },
    {
        "word": "bereavement",
        "meaning": "The period of grief and mourning after the death of a loved one.",
        "sentences": ["The school offered support to the student during his time of bereavement."],
        "vocabulary_question": "Is ███████████ a time of great celebration or a time of mourning?"
    },
    {
        "word": "beret",
        "meaning": "A round, flat, soft hat, usually made of wool.",
        "sentences": ["The artist wore a black beret while she worked in her studio."],
        "vocabulary_question": "Is a █████ a type of hat or a type of shoe?"
    },
    {
        "word": "bermudas",
        "meaning": "Knee-length shorts.",
        "sentences": ["He packed several pairs of bermudas for his tropical vacation."],
        "vocabulary_question": "Are ████████ a type of long pants or knee-length shorts?"
    },
    {
        "word": "beseech",
        "meaning": "To ask someone urgently and fervently to do something; to implore.",
        "sentences": ["I beseech you to reconsider your decision before it is too late."],
        "vocabulary_question": "If you ███████ someone, are you demanding they do something or begging them?"
    },
    {
        "word": "besieged",
        "meaning": "Surrounded by armed forces aiming to capture it or force surrender; or overwhelmed by requests.",
        "sentences": ["The castle was besieged for many months before the gates finally opened."],
        "vocabulary_question": "If a city is ████████, is it being protected or being surrounded and attacked?"
    },
    {
        "word": "besmirch",
        "meaning": "To damage the reputation of someone or something in the opinion of others.",
        "sentences": ["The false rumors were an attempt to besmirch the politician's good name."],
        "vocabulary_question": "When you ████████ a reputation, are you making it better or damaging it?"
    },
    {
        "word": "bethesda",
        "meaning": "A hallowed place or a chapel; originally a pool in Jerusalem thought to have healing powers.",
        "sentences": ["The small community center served as a bethesda for those seeking peace and quiet."],
        "vocabulary_question": "Is a ████████ a place of healing and peace or a place of loud noise?"
    },
    {
        "word": "bezique",
        "meaning": "A trick-taking card game for two players, using a deck of 64 cards.",
        "sentences": ["My grandparents spent the rainy afternoon playing a competitive game of bezique."],
        "vocabulary_question": "Is ███████ a type of card game or a type of outdoor sport?"
    },
    {
        "word": "bibliopegist",
        "meaning": "A person who is skilled in the art of binding books.",
        "sentences": ["The rare book collector sent his damaged volume to a famous bibliopegist for repair."],
        "vocabulary_question": "Does a █████████████ work with computer software or with binding books?"
    },
    {
        "word": "bicameral",
        "meaning": "Having two branches or chambers (especially of a legislative body).",
        "sentences": ["The United States has a bicameral Congress made up of the House and the Senate."],
        "vocabulary_question": "Does a █████████ government have only one part or two separate parts?"
    },
    {
        "word": "bifurcate",
        "meaning": "To divide into two branches or forks.",
        "sentences": ["The hiking trail began to bifurcate, with one path leading to the lake and the other to the peak."],
        "vocabulary_question": "When a road begins to █████████, is it coming together or splitting into two?"
    },
    {
        "word": "bilaterian",
        "meaning": "An animal that has bilateral symmetry (a front, back, top, bottom, and two mirror-image sides).",
        "sentences": ["Most animals you see every day, including humans and dogs, are bilaterians."],
        "vocabulary_question": "Is a ██████████ an animal that is shaped like a perfect circle or one with two matching sides?"
    },
    {
        "word": "bilbo",
        "meaning": "A finely tempered sword of a type made in Bilbao, Spain.",
        "sentences": ["The museum's collection included an ancient, sharp-edged bilbo used by explorers."],
        "vocabulary_question": "Is a █████ a type of weapon (sword) or a type of musical instrument?"
    },
    {
        "word": "billabong",
        "meaning": "An Australian term for a branch of a river that forms a stagnant pool or backwater.",
        "sentences": ["The kangaroos stopped to drink from the cool water of the billabong."],
        "vocabulary_question": "Would you find fish or airplanes in a █████████?"
    },
    {
        "word": "billet",
        "meaning": "A place, usually a private house, where soldiers are lodged temporarily.",
        "sentences": ["During the training exercise, the soldiers were assigned to a local billet for the night."],
        "vocabulary_question": "Is a ██████ a place for soldiers to stay or a type of food they eat?"
    },
    {
        "word": "billingsgate",
        "meaning": "Coarse, abusive, or foul language.",
        "sentences": ["The referee wouldn't tolerate any billingsgate from the frustrated players."],
        "vocabulary_question": "If someone is using ████████████, are they being very polite or very rude?"
    },
    {
        "word": "biltong",
        "meaning": "A form of dried, cured meat that originated in Southern African countries.",
        "sentences": ["He enjoyed a snack of savory biltong while on his long road trip."],
        "vocabulary_question": "Is ███████ a type of dried meat or a type of sweet candy?"
    },
    {
        "word": "binomial",
        "meaning": "Consisting of two names or terms; in biology, the two-part scientific name of a species.",
        "sentences": ["'Homo sapiens' is the binomial name used by scientists to identify humans."],
        "vocabulary_question": "Does a ████████ name have one part or two parts?"
    },
    {
        "word": "biomimicry",
        "meaning": "The design of materials or systems modeled on biological entities and processes.",
        "sentences": ["The engineer used biomimicry to design a faster train based on the shape of a bird's beak."],
        "vocabulary_question": "Does ███████████ involve copying designs from nature or from outer space?"
    },
    {
        "word": "birria",
        "meaning": "A traditional Mexican meat stew, often served in tacos.",
        "sentences": ["We visited the food truck to try their famous slow-cooked beef birria."],
        "vocabulary_question": "Is ██████ a type of delicious stew or a type of winter hat?"
    },
    {
        "word": "bittern",
        "meaning": "A type of marsh bird known for its booming call and ability to hide in reeds.",
        "sentences": ["The birdwatcher waited patiently to spot a bittern standing still in the tall grass."],
        "vocabulary_question": "Is a ███████ a type of bird or a type of metal tool?"
    },
    {
        "word": "blastema",
        "meaning": "A mass of cells capable of growth and regeneration into organs or body parts.",
        "sentences": ["Scientists studied how a salamander can regrow its tail using a blastema."],
        "vocabulary_question": "Does a ████████ help an animal regrow a limb or help it digest food?"
    },
    {
        "word": "blastogenesis",
        "meaning": "Reproduction by budding, or the transformation of small cells into large, active ones.",
        "sentences": ["The biology lab observed the process of blastogenesis in the microscopic samples."],
        "vocabulary_question": "Does ████████████ relate to biological growth or the study of old rocks?"
    },
    {
        "word": "blatant",
        "meaning": "Done openly and unashamedly; very obvious.",
        "sentences": ["It was a blatant lie that everyone in the room could see through immediately."],
        "vocabulary_question": "Is a ███████ action one that is hidden and secret or one that is very easy to see?"
    },
    {
        "word": "blintzes",
        "meaning": "Thin pancakes, similar to crepes, that are rolled around a filling (like cheese or fruit).",
        "sentences": ["We ate sweet cheese blintzes topped with blueberry sauce for breakfast."],
        "vocabulary_question": "Are ████████ a type of breakfast food or a type of heavy boot?"
    },
    {
        "word": "bloviate",
        "meaning": "To speak or write at length in a pompous or boastful manner.",
        "sentences": ["The speaker began to bloviate, and soon the audience began to lose interest."],
        "vocabulary_question": "If you ████████, are you being very modest or talking in a boastful way?"
    },
    {
        "word": "bodega",
        "meaning": "A small grocery store, especially in a Spanish-speaking neighborhood.",
        "sentences": ["I stopped at the corner bodega to pick up a sandwich and some milk."],
        "vocabulary_question": "Would you go to a ██████ to buy groceries or to fix your car?"
    },
    {
        "word": "bodkin",
        "meaning": "A blunt, thick needle with a large eye; or a small, sharp tool for making holes in fabric.",
        "sentences": ["She used a bodkin to pull the ribbon through the casing of the dress."],
        "vocabulary_question": "Is a ██████ a tool used for sewing or a tool used for gardening?"
    },
    {
        "word": "boffin",
        "meaning": "A person engaged in scientific or technical research; a slang term for an expert.",
        "sentences": ["The computer boffin was able to fix the complex coding error in minutes."],
        "vocabulary_question": "Is a ██████ a beginner at a hobby or a scientific expert?"
    },
    {
        "word": "boiserie",
        "meaning": "Wood paneling that is decorated with carvings, especially in 18th-century French architecture.",
        "sentences": ["The walls of the palace were covered in intricate, gilded boiserie."],
        "vocabulary_question": "Does ████████ describe decorated wood paneling or a type of stone floor?"
    },
    {
        "word": "boisterous",
        "meaning": "Noisy, energetic, and cheerful; rowdy.",
        "sentences": ["The boisterous crowd cheered loudly when the home team scored."],
        "vocabulary_question": "Is a ███████████ group of people very quiet and shy or very loud and energetic?"
    },
    {
        "word": "bolivar",
        "meaning": "The basic unit of money in Venezuela.",
        "sentences": ["The traveler exchanged his dollars for bolivars at the border."],
        "vocabulary_question": "Is a ███████ a type of currency (money) or a type of fruit?"
    },
    {
        "word": "bona fide",
        "meaning": "Genuine; real; done in good faith.",
        "sentences": ["The museum verified that the antique painting was a bona fide masterpiece."],
        "vocabulary_question": "Is a ████ ████ object a fake or the real thing?"
    },
    {
        "word": "bonobo",
        "meaning": "A species of chimpanzee with a more slender build, found in the Congo.",
        "sentences": ["The researchers observed the social behavior of the bonobo in the wild."],
        "vocabulary_question": "Is a ██████ a type of primate (ape) or a type of small reptile?"
    },
    {
        "word": "boomslang",
        "meaning": "A large, venomous tree snake found in Africa.",
        "sentences": ["The boomslang blends in perfectly with the green leaves of the trees."],
        "vocabulary_question": "Is a ██████████ a type of snake or a type of flower?"
    },
    {
        "word": "boondoggle",
        "meaning": "A project that is considered a waste of both time and money.",
        "sentences": ["The expensive bridge that led to nowhere was called a major boondoggle."],
        "vocabulary_question": "Is a ██████████ a very successful project or a big waste of resources?"
    },
    {
        "word": "boreal",
        "meaning": "Relating to the north or the northern regions of the earth.",
        "sentences": ["The boreal forest is home to many animals that thrive in cold climates."],
        "vocabulary_question": "Does the word ██████ relate to the warm tropics or the cold north?"
    },
    {
        "word": "borosilicate",
        "meaning": "A type of glass that is resistant to changes in temperature.",
        "sentences": ["The scientist used borosilicate lab equipment so it wouldn't crack when heated."],
        "vocabulary_question": "Is ████████████ glass known for being fragile or for resisting heat?"
    },
    {
        "word": "botryoidal",
        "meaning": "Having a shape resembling a cluster of grapes.",
        "sentences": ["The geologist found a mineral specimen with a unique botryoidal texture."],
        "vocabulary_question": "If a rock is ██████████, does it look like a smooth flat sheet or a bunch of grapes?"
    },
    {
        "word": "bouffant",
        "meaning": "Styled so as to stand out from the head in a rounded shape (of a person's hair).",
        "sentences": ["The actress wore her hair in a stylish bouffant for the movie premiere."],
        "vocabulary_question": "Is a ████████ hairstyle flat and thin or puffed out and rounded?"
    },
    {
        "word": "bowsprit",
        "meaning": "A spar extending forward from a ship's bow to which forestays are fastened.",
        "sentences": ["The sailors stood on the deck as the ship's bowsprit pointed toward the horizon."],
        "vocabulary_question": "Is a ████████ part of an airplane or part of a sailing ship?"
    },
    {
        "word": "bragozzo",
        "meaning": "A two-masted fishing vessel used in the upper Adriatic Sea.",
        "sentences": ["We watched the colorful bragozzo sail back into the Italian harbor."],
        "vocabulary_question": "Is a ████████ a type of fishing boat or a type of musical instrument?"
    },
    {
        "word": "Braeburn",
        "meaning": "A variety of apple with a sweet-tart flavor and a firm texture.",
        "sentences": ["I packed a crisp Braeburn apple for my afternoon snack."],
        "vocabulary_question": "Is a ████████ a type of fruit or a type of heavy metal?"
    },
    {
        "word": "bravado",
        "meaning": "A bold manner or a show of boldness intended to impress or intimidate.",
        "sentences": ["His loud talking was just a display of bravado to hide his nervousness."],
        "vocabulary_question": "Is ███████ a sign of real quietness or a showy display of boldness?"
    },
    {
        "word": "breviloquence",
        "meaning": "Briefness or conciseness in speaking or writing.",
        "sentences": ["The teacher appreciated the student's breviloquence during the presentation."],
        "vocabulary_question": "Does ████████████ mean talking for a very long time or being brief?"
    },
    {
        "word": "Brigadoon",
        "meaning": "A place that is idyllic, unaffected by time, or remote from reality.",
        "sentences": ["The quiet mountain village felt like a modern-day Brigadoon."],
        "vocabulary_question": "Is █████████ a word for a busy, noisy city or a magical, quiet place?"
    },
    {
        "word": "brockage",
        "meaning": "An imperfectly minted coin.",
        "sentences": ["The coin collector was excited to find a rare silver brockage in the collection."],
        "vocabulary_question": "Is a ████████ a perfectly made coin or one that was made with a mistake?"
    },
    {
        "word": "bromide",
        "meaning": "A chemical compound often used as a sedative; or a boring, unoriginal remark.",
        "sentences": ["He tried to offer comfort, but his words were just a tired bromide."],
        "vocabulary_question": "Is a ███████ a very exciting new idea or a boring, common saying?"
    },
    {
        "word": "brontophobia",
        "meaning": "An abnormal fear of thunder and lightning.",
        "sentences": ["The dog's brontophobia caused it to hide under the bed during the storm."],
        "vocabulary_question": "Does someone with ████████████ love watching storms or feel afraid of them?"
    },
    {
        "word": "bruja",
        "meaning": "A witch or sorceress in Spanish-speaking cultures.",
        "sentences": ["The old folk tale told the story of a powerful bruja living in the woods."],
        "vocabulary_question": "Is a █████ a type of magical character or a type of kitchen tool?"
    },
    {
        "word": "bruxism",
        "meaning": "The involuntary grinding or clenching of the teeth, typically during sleep.",
        "sentences": ["The dentist recommended a mouthguard to help protect his teeth from bruxism."],
        "vocabulary_question": "Does ███████ involve grinding your teeth or blinking your eyes?"
    },
    {
        "word": "bubonic",
        "meaning": "Relating to or characterized by the swelling of lymph nodes (buboes).",
        "sentences": ["History books often discuss the impact of the bubonic plague in the Middle Ages."],
        "vocabulary_question": "Does the word ███████ relate to a type of illness or a type of celebration?"
    },
    {
        "word": "buffa",
        "meaning": "Relating to a style of comic opera.",
        "sentences": ["The audience laughed throughout the entire performance of the opera buffa."],
        "vocabulary_question": "Is an opera █████ meant to be very sad and serious or funny and comic?"
    },
    {
        "word": "bulgogi",
        "meaning": "A Korean dish of thin, marinated beef slices that are grilled or stir-fried.",
        "sentences": ["We went to the Korean restaurant to try their famous sweet and savory bulgogi."],
        "vocabulary_question": "Is ███████ a type of delicious food or a type of clothing?"
    },
    {
        "word": "bulgur",
        "meaning": "A cereal food made from the cracked whole grains of several different wheat species.",
        "sentences": ["She used bulgur wheat to make a fresh tabbouleh salad for lunch."],
        "vocabulary_question": "Is ██████ a type of grain used in cooking or a type of wild animal?"
    },
    {
        "word": "bulwark",
        "meaning": "A defensive wall; or a person or thing that acts as a defense.",
        "sentences": ["The heavy stone wall served as a bulwark against the rising floodwaters."],
        "vocabulary_question": "Is a ███████ something that protects and defends or something that attacks?"
    },
    {
        "word": "Bundt",
        "meaning": "A cake that is baked in a distinctive ring-shaped pan.",
        "sentences": ["She baked a lemon Bundt cake with a sweet glaze for the party."],
        "vocabulary_question": "Is a █████ cake shaped like a square box or a round ring?"
    },
    {
        "word": "bungalow",
        "meaning": "A low house having only one story or, in some cases, upper rooms set in the roof.",
        "sentences": ["The small bungalow had a cozy front porch with two rocking chairs."],
        "vocabulary_question": "Is a ████████ usually a very tall skyscraper or a low, one-story house?"
    },
    {
        "word": "buoyancy",
        "meaning": "The ability or tendency to float in water or air or some other fluid.",
        "sentences": ["The life jacket provided enough buoyancy to keep the swimmer afloat."],
        "vocabulary_question": "Does ████████ describe the ability to sink to the bottom or float on top?"
    },
    {
        "word": "bureau",
        "meaning": "A chest of drawers; or an office or department for transacting particular business.",
        "sentences": ["She kept her folded clothes in the top drawer of the wooden bureau."],
        "vocabulary_question": "Is a ██████ a piece of furniture for storage or a type of kitchen stove?"
    },
    {
        "word": "burglarious",
        "meaning": "Relating to or involving burglary.",
        "sentences": ["The police investigated the burglarious entry into the warehouse."],
        "vocabulary_question": "Does a ███████████ act involve helping people or stealing from them?"
    },
    {
        "word": "burgoo",
        "meaning": "A thick stew or soup, typically made with various meats and vegetables.",
        "sentences": ["The festival served large bowls of hot burgoo to all the guests."],
        "vocabulary_question": "Is ██████ a type of thick stew or a type of cold dessert?"
    },
    {
        "word": "busby",
        "meaning": "A tall fur hat with a colored cloth flap, worn by various British army regiments.",
        "sentences": ["The guards outside the palace wore traditional busby hats."],
        "vocabulary_question": "Is a █████ a type of tall hat or a type of leather boot?"
    },
    {
        "word": "cabaret",
        "meaning": "A form of theatrical entertainment featuring music, song, dance, or drama, typically performed in a restaurant or nightclub.",
        "sentences": ["The tourists enjoyed a lively cabaret performance during their trip to Paris."],
        "vocabulary_question": "Is a ███████ a type of theatrical show or a type of heavy winter boot?"
    },
    {
        "word": "cabildo",
        "meaning": "The town council or local government council in Spanish-speaking countries.",
        "sentences": ["The historic cabildo building stands in the center of the city square."],
        "vocabulary_question": "Does the word ███████ relate to a government council or a type of dessert?"
    },
    {
        "word": "cacao",
        "meaning": "The seed from which cocoa and chocolate are made.",
        "sentences": ["Farmers harvest the large pods of the cacao tree to extract the valuable seeds."],
        "vocabulary_question": "Is █████ used to make chocolate or used to make rubber?"
    },
    {
        "word": "cacophonous",
        "meaning": "Marked by harsh or discordant sound.",
        "sentences": ["The beginners' band made a cacophonous noise as they all tuned their instruments at once."],
        "vocabulary_question": "Is a ███████████ sound pleasant to the ears or harsh and noisy?"
    },
    {
        "word": "cadge",
        "meaning": "To ask for or obtain something to which one is not strictly entitled.",
        "sentences": ["He tried to cadge a free ticket to the concert from his older brother."],
        "vocabulary_question": "If you █████ something, are you buying it or trying to get it for free?"
    },
    {
        "word": "caduceus",
        "meaning": "An ancient Greek or Roman herald's wand, typically one with two serpents twined around it.",
        "sentences": ["The symbol of the caduceus is often associated with the messenger god Hermes."],
        "vocabulary_question": "Is a ████████ a type of winged wand or a type of stone shield?"
    },
    {
        "word": "caducity",
        "meaning": "The quality of being transitory or fleeting; or the infirmity of old age.",
        "sentences": ["The poet wrote about the caducity of youth and how quickly time passes."],
        "vocabulary_question": "Does ████████ describe something that lasts forever or something that is fleeting?"
    },
    {
        "word": "caftan",
        "meaning": "A man's long belted tunic, or a long, loose dress or shirt.",
        "sentences": ["She wore a colorful, flowing caftan while relaxing by the pool."],
        "vocabulary_question": "Is a ██████ a type of long, loose garment or a type of small animal?"
    },
    {
        "word": "calcaneus",
        "meaning": "The large bone forming the heel of the human foot.",
        "sentences": ["The athlete suffered a minor injury to her calcaneus during the race."],
        "vocabulary_question": "Is the ████████ located in your heel or in your shoulder?"
    },
    {
        "word": "calcify",
        "meaning": "To become hard by the deposit of calcium salts.",
        "sentences": ["As the organism grows, its soft tissues may begin to calcify into a shell-like structure."],
        "vocabulary_question": "When something begins to ███████, does it become soft and squishy or hard and bony?"
    },
    {
        "word": "calendula",
        "meaning": "A Mediterranean plant of the daisy family, frequently grown for its bright orange or yellow flowers.",
        "sentences": ["The gardener planted rows of bright yellow calendula to attract butterflies."],
        "vocabulary_question": "Is a █████████ a type of flowering plant or a type of scientific tool?"
    },
    {
        "word": "callow",
        "meaning": "Young and inexperienced.",
        "sentences": ["The callow youth was not yet ready for the responsibilities of leadership."],
        "vocabulary_question": "Is a ██████ person an experienced expert or someone who is young and untested?"
    },
    {
        "word": "calumet",
        "meaning": "A decorated North American Indian ceremonial pipe.",
        "sentences": ["The leaders of the different tribes shared the calumet as a sign of peace."],
        "vocabulary_question": "Is a ███████ a type of ceremonial pipe or a type of stone axe?"
    },
    {
        "word": "calypso",
        "meaning": "A style of Afro-Caribbean music that originated in Trinidad and Tobago.",
        "sentences": ["The streets were filled with the rhythmic sounds of calypso music during the festival."],
        "vocabulary_question": "Is ███████ a type of music or a type of vegetable?"
    },
    {
        "word": "cambio",
        "meaning": "A place where money is exchanged; a currency exchange.",
        "sentences": ["We visited the local cambio to trade our dollars for the local currency."],
        "vocabulary_question": "Would you go to a ██████ to exchange money or to buy a new car?"
    },
    {
        "word": "cameist",
        "meaning": "A person who carves or engraves cameos.",
        "sentences": ["The skilled cameist spent weeks carving the tiny portrait into the gemstone."],
        "vocabulary_question": "Does a ███████ work with carving small gems or with building houses?"
    },
    {
        "word": "campanology",
        "meaning": "The art or study of bell ringing or bell founding.",
        "sentences": ["He joined the local church group to learn the ancient art of campanology."],
        "vocabulary_question": "Does ████████████ involve the study of bells or the study of birds?"
    },
    {
        "word": "cancion",
        "meaning": "A popular song of Spain or Spanish America.",
        "sentences": ["The singer performed a beautiful cancion that everyone in the crowd recognized."],
        "vocabulary_question": "Is a ███████ a type of song or a type of traditional dance?"
    },
    {
        "word": "candelabrum",
        "meaning": "A large branched candlestick or holder for several candles or lamps.",
        "sentences": ["The dining table was decorated with a silver candelabrum holding five tall candles."],
        "vocabulary_question": "Is a ███████████ used to hold candles or to hold flowers?"
    },
    {
        "word": "cannoli",
        "meaning": "Italian pastries consisting of tube-shaped shells of fried pastry dough, filled with a sweet, creamy filling.",
        "sentences": ["We bought a box of fresh cannoli for the family dessert."],
        "vocabulary_question": "Is a ███████ a type of Italian pastry or a type of small boat?"
    },
    {
        "word": "Canopus",
        "meaning": "The second brightest star in the night sky, located in the constellation Carina.",
        "sentences": ["Sailors in the southern hemisphere often use Canopus to help navigate at night."],
        "vocabulary_question": "Is ███████ a name for a planet or a very bright star?"
    },
    {
        "word": "cantankerous",
        "meaning": "Bad-tempered, argumentative, and uncooperative.",
        "sentences": ["The cantankerous old man refused to let anyone help him with his groceries."],
        "vocabulary_question": "Is a ████████████ person very friendly and helpful or grumpy and difficult?"
    },
    {
        "word": "capillary",
        "meaning": "Any of the fine branching blood vessels that form a network between the arterioles and venules.",
        "sentences": ["The doctor explained how oxygen travels through the tiny walls of each capillary."],
        "vocabulary_question": "Is a █████████ a very large artery or a tiny, thin blood vessel?"
    },
    {
        "word": "capnometer",
        "meaning": "An instrument for measuring the concentration of carbon dioxide in exhaled air.",
        "sentences": ["The medical team used a capnometer to monitor the patient's breathing."],
        "vocabulary_question": "Does a ██████████ measure carbon dioxide or the temperature of water?"
    },
    {
        "word": "capricious",
        "meaning": "Given to sudden and unaccountable changes of mood or behavior.",
        "sentences": ["The capricious weather changed from sunny to stormy in just a few minutes."],
        "vocabulary_question": "Is a ██████████ person's mood very steady and predictable or always changing?"
    },
    {
        "word": "capstan",
        "meaning": "A revolving cylinder used on ships for winding in cables or hoisting anchors.",
        "sentences": ["The sailors worked together to turn the capstan and raise the heavy anchor."],
        "vocabulary_question": "Is a ███████ a tool used on a ship or a tool used in a kitchen?"
    },
    {
        "word": "capsule",
        "meaning": "A small case or container, especially a gelatinous one enclosing a dose of medicine.",
        "sentences": ["The doctor told him to swallow one medicine capsule with a glass of water."],
        "vocabulary_question": "Is a ███████ a small container for medicine or a type of large truck?"
    },
    {
        "word": "carbohydrates",
        "meaning": "Large group of organic compounds occurring in foods and living tissues and including sugars, starch, and cellulose.",
        "sentences": ["Foods like bread, pasta, and potatoes are high in carbohydrates."],
        "vocabulary_question": "Are █████████████ found in foods like bread or in materials like iron?"
    },
    {
        "word": "carcass",
        "meaning": "The dead body of an animal.",
        "sentences": ["The hikers spotted the carcass of a deer in the woods."],
        "vocabulary_question": "Does the word ███████ refer to a living animal or a dead one?"
    },
    {
        "word": "cardoon",
        "meaning": "A thistle-like Mediterranean plant related to the artichoke.",
        "sentences": ["The chef prepared a unique side dish using the stalks of the cardoon plant."],
        "vocabulary_question": "Is a ███████ a type of plant or a type of small bird?"
    },
    {
        "word": "caret",
        "meaning": "A proofreading mark (^) used to indicate where something is to be inserted.",
        "sentences": ["The editor used a caret to show that a missing word should be added to the sentence."],
        "vocabulary_question": "Is a █████ a mark used in writing or a vegetable you can eat?"
    },
    {
        "word": "caribou",
        "meaning": "A large North American reindeer.",
        "sentences": ["The caribou migrated across the tundra in search of food during the winter."],
        "vocabulary_question": "Is a ███████ a type of large deer or a type of small bird?"
    },
    {
        "word": "caricature",
        "meaning": "A picture or description of a person in which certain striking characteristics are exaggerated in order to create a comic effect.",
        "sentences": ["The artist at the fair drew a funny caricature of me with a giant nose."],
        "vocabulary_question": "Is a ██████████ a perfectly realistic portrait or a drawing with exaggerated features?"
    },
    {
        "word": "carnage",
        "meaning": "The killing of a large number of people.",
        "sentences": ["The history book described the terrible carnage that took place during the battle."],
        "vocabulary_question": "Does the word ███████ refer to a peaceful gathering or a scene of great destruction and death?"
    },
    {
        "word": "carnassial",
        "meaning": "Relating to teeth adapted for tearing flesh, typical of carnivorous mammals.",
        "sentences": ["The wolf used its sharp carnassial teeth to eat its meal."],
        "vocabulary_question": "Are ██████████ teeth used by animals to eat plants or to tear meat?"
    },
    {
        "word": "carnitas",
        "meaning": "A Mexican dish consisting of small pieces of pork that have been braised and then fried.",
        "sentences": ["We ordered three tacos filled with savory, crispy carnitas."],
        "vocabulary_question": "Is ████████ a type of pork dish or a type of sweet dessert?"
    },
    {
        "word": "carnitine",
        "meaning": "A compound found in the body that helps turn fat into energy.",
        "sentences": ["Some athletes take carnitine supplements to help their muscles work better."],
        "vocabulary_question": "Does █████████ help the body create energy or help it fall asleep?"
    },
    {
        "word": "Cartesian",
        "meaning": "Relating to the French philosopher René Descartes or his mathematical ideas.",
        "sentences": ["In math class, we learned how to plot points on a Cartesian coordinate plane."],
        "vocabulary_question": "Is the █████████ plane used in geometry or in a history lesson?"
    },
    {
        "word": "cartilage",
        "meaning": "Firm, whitish, flexible connective tissue found in various forms in the larynx and respiratory tract, in structures such as the external ear, and in the articulating surfaces of joints.",
        "sentences": ["The end of your nose is made of cartilage, which is why it is flexible."],
        "vocabulary_question": "Is █████████ a type of hard bone or a flexible tissue found in joints and ears?"
    },
    {
        "word": "Cassandra",
        "meaning": "A person who predicts misfortune or disaster but is not believed.",
        "sentences": ["He felt like a Cassandra when his warnings about the rain were ignored by the group."],
        "vocabulary_question": "Is a █████████ someone whose predictions are always believed or someone who is ignored?"
    },
    {
        "word": "cassock",
        "meaning": "A full-length garment of a single color worn by certain Christian clergy.",
        "sentences": ["The priest wore a long black cassock during the morning service."],
        "vocabulary_question": "Is a ███████ a type of long robe or a type of small hat?"
    },
    {
        "word": "castellated",
        "meaning": "Having battlements like a castle.",
        "sentences": ["The old mansion had a castellated roofline that made it look like a fortress."],
        "vocabulary_question": "Does a ███████████ building look like a plain house or like a castle?"
    },
    {
        "word": "castigate",
        "meaning": "To reprove for error or criticize with drastic severity.",
        "sentences": ["The coach had to castigate the players for their poor sportsmanship during the game."],
        "vocabulary_question": "Does █████████ mean to praise someone highly or to criticize them severely?"
    },
    {
        "word": "Castilian",
        "meaning": "Relating to the region of Castile in Spain, or the standard form of the Spanish language.",
        "sentences": ["She studied Castilian Spanish to prepare for her trip to Madrid."],
        "vocabulary_question": "Does █████████ refer to a region and language of Spain or of Italy?"
    },
    {
        "word": "castor",
        "meaning": "A reddish-brown substance obtained from beavers, used in perfumery and medicine.",
        "sentences": ["The perfumer added a tiny amount of castor to the fragrance to give it depth."],
        "vocabulary_question": "Is ██████ a substance obtained from beavers or a type of gemstone?"
    },
    {
        "word": "catadromous",
        "meaning": "Migrating down rivers to the sea to spawn (of fish).",
        "sentences": ["The eel is a catadromous fish that travels from freshwater to the ocean to lay eggs."],
        "vocabulary_question": "Do ███████████ fish move from the sea to rivers or from rivers to the sea?"
    },
    {
        "word": "catalepsy",
        "meaning": "A medical condition characterized by a trance or seizure with a loss of sensation and consciousness accompanied by rigidity of the body.",
        "sentences": ["The patient suffered a brief episode of catalepsy that left his muscles stiff."],
        "vocabulary_question": "Does ██████████ involve a person being very active or having a stiff, frozen body?"
    },
    {
        "word": "catalina",
        "meaning": "A type of flying boat or a famous island off the coast of California.",
        "sentences": ["The historian showed us a photo of a World War II Catalina aircraft."],
        "vocabulary_question": "Is a ████████ a type of aircraft or a type of underwater cave?"
    },
    {
        "word": "catalyst",
        "meaning": "A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.",
        "sentences": ["Adding the catalyst made the chemical experiment happen much faster."],
        "vocabulary_question": "Does a ████████ slow down a reaction or speed it up?"
    },
    {
        "word": "cathect",
        "meaning": "To invest mental or emotional energy in a person, object, or idea.",
        "sentences": ["It is natural to cathect deep feelings into a long-term goal."],
        "vocabulary_question": "Does to ███████ mean to ignore an idea or to put emotional energy into it?"
    },
    {
        "word": "cathode",
        "meaning": "The negatively charged electrode by which electrons enter an electrical device.",
        "sentences": ["The scientist checked the connection between the battery and the cathode."],
        "vocabulary_question": "In electronics, is a ███████ a positively charged or a negatively charged electrode?"
    },
    {
        "word": "cattalo",
        "meaning": "A cross between a domestic cow and a bison.",
        "sentences": ["The rancher raised a small herd of cattalo on the open plains."],
        "vocabulary_question": "Is a ███████ a mix between a cow and a bison or a mix between a dog and a wolf?"
    },
    {
        "word": "caucho",
        "meaning": "The rubber obtained from a South American tree.",
        "sentences": ["The workers collected caucho from the trees to be sent to the factory."],
        "vocabulary_question": "Is ██████ a type of natural rubber or a type of heavy stone?"
    },
    {
        "word": "caudex",
        "meaning": "The thickened, often woody base of a stem from which new growth arises.",
        "sentences": ["The desert plant stored water in its thick, swollen caudex."],
        "vocabulary_question": "Is a ██████ a part of a plant's stem or a part of a bird's wing?"
    },
    {
        "word": "causal",
        "meaning": "Relating to or acting as a cause.",
        "sentences": ["The researchers looked for a causal link between the two events."],
        "vocabulary_question": "Does a ██████ relationship mean that one thing makes another thing happen?"
    },
    {
        "word": "caustic",
        "meaning": "Able to burn or corrode organic tissue by chemical action; or characterized by incisive wit.",
        "sentences": ["His caustic remarks were funny but could be quite hurtful."],
        "vocabulary_question": "Does a ███████ sense of humor sound very sweet or very sharp and biting?"
    },
    {
        "word": "cauterize",
        "meaning": "To burn the skin or flesh of a wound with a heated instrument or caustic substance, typically to stop bleeding or prevent infection.",
        "sentences": ["The surgeon had to cauterize the small blood vessel to stop the bleeding."],
        "vocabulary_question": "When you █████████ a wound, are you using heat to seal it or using water to wash it?"
    },
    {
        "word": "cavalcade",
        "meaning": "A formal procession of people walking, on horseback, or riding in vehicles.",
        "sentences": ["The town's founder was honored with a grand cavalcade during the parade."],
        "vocabulary_question": "Is a █████████ a type of quiet meeting or a formal procession of people?"
    },
    {
        "word": "cayenne",
        "meaning": "A pungent hot chili pepper powder.",
        "sentences": ["She added a pinch of cayenne pepper to the soup to give it a spicy kick."],
        "vocabulary_question": "Is ███████ a type of mild sugar or a type of hot pepper?"
    },
    {
        "word": "cellophane",
        "meaning": "A thin, transparent wrapping material made from viscose.",
        "sentences": ["The gift basket was wrapped in shiny, clear cellophane."],
        "vocabulary_question": "Is ██████████ a thick piece of wood or a thin, clear wrapping material?"
    },
    {
        "word": "Celsius",
        "meaning": "A scale of temperature on which water freezes at 0° and boils at 100°.",
        "sentences": ["The weather forecast predicted a high of 25 degrees Celsius for the afternoon."],
        "vocabulary_question": "On the ███████ scale, does a higher number mean it is getting colder or hotter?"
    },
    {
        "word": "cenotaph",
        "meaning": "A monument to someone buried elsewhere, especially one commemorating people who died in a war.",
        "sentences": ["The town gathered at the stone cenotaph to honor the soldiers who never returned home."],
        "vocabulary_question": "Is a ████████ a monument for someone who is buried right there or somewhere else?"
    },
    {
        "word": "centaur",
        "meaning": "A creature from Greek mythology with the upper body of a human and the lower body of a horse.",
        "sentences": ["The story described a wise centaur living in the deep, enchanted forest."],
        "vocabulary_question": "Is a ███████ half-human and half-horse or half-human and half-lion?"
    },
    {
        "word": "centennial",
        "meaning": "Relating to a hundredth anniversary.",
        "sentences": ["The city held a massive parade to celebrate its centennial year."],
        "vocabulary_question": "Does a ██████████ celebration happen every ten years or every hundred years?"
    },
    {
        "word": "cerberus",
        "meaning": "In Greek mythology, a multi-headed dog that guards the entrance to the underworld.",
        "sentences": ["The hero had to find a way to get past the fierce, three-headed Cerberus."],
        "vocabulary_question": "Is ████████ a mythical bird or a multi-headed guard dog?"
    },
    {
        "word": "cerebellum",
        "meaning": "The part of the brain at the back of the skull that coordinates and regulates muscular activity.",
        "sentences": ["Your cerebellum helps you stay balanced while you are riding a bicycle."],
        "vocabulary_question": "Does the ██████████ help you coordinate your movements or help you digest food?"
    },
    {
        "word": "Ceres",
        "meaning": "The Roman goddess of agriculture; or the largest object in the asteroid belt between Mars and Jupiter.",
        "sentences": ["In ancient times, farmers prayed to Ceres for a successful harvest."],
        "vocabulary_question": "Was █████ the goddess of the ocean or the goddess of agriculture?"
    },
    {
        "word": "cereza",
        "meaning": "The Spanish word for cherry.",
        "sentences": ["The bowl was filled with bright red, sweet cereza fruit."],
        "vocabulary_question": "Is a ██████ a type of fruit (cherry) or a type of vegetable?"
    },
    {
        "word": "cetology",
        "meaning": "The branch of zoology that studies whales, dolphins, and porpoises.",
        "sentences": ["He decided to study cetology because he wanted to learn everything about humpback whales."],
        "vocabulary_question": "Does a scientist studying ████████ focus on birds or on whales and dolphins?"
    },
    {
        "word": "Ceylon",
        "meaning": "The former name of the island country now known as Sri Lanka.",
        "sentences": ["Many people still refer to the famous tea grown on the island as Ceylon tea."],
        "vocabulary_question": "Was ██████ the old name for the country of Japan or the country of Sri Lanka?"
    },
    {
        "word": "chaebol",
        "meaning": "A large industrial South Korean business conglomerate run and controlled by an owner or family.",
        "sentences": ["Several major electronics companies in South Korea are part of a powerful chaebol."],
        "vocabulary_question": "Is a ███████ a small family-owned shop or a giant business group?"
    },
    {
        "word": "chamberlain",
        "meaning": "An officer who manages the household of a monarch or noble.",
        "sentences": ["The king's chamberlain was responsible for organizing all the royal events."],
        "vocabulary_question": "Is a ███████████ someone who works in a kitchen or someone who manages a royal household?"
    },
    {
        "word": "chamomile",
        "meaning": "An aromatic European plant of the daisy family, with flowers used to make a soothing tea.",
        "sentences": ["She drank a warm cup of chamomile tea to help her relax before bed."],
        "vocabulary_question": "Is █████████ known for making a person feel more energetic or helping them feel calm?"
    },
    {
        "word": "Chamorro",
        "meaning": "The indigenous people of the Mariana Islands, including Guam.",
        "sentences": ["We learned about the rich history and traditions of the Chamorro people."],
        "vocabulary_question": "Does the word ███████ refer to a group of people from the Mariana Islands or from Africa?"
    },
    {
        "word": "chamotte",
        "meaning": "A ceramic raw material with a high silica and alumina content, used in making pottery.",
        "sentences": ["The potter added chamotte to the clay to give it a grittier texture."],
        "vocabulary_question": "Is ████████ a material used in making ceramics or a material used in making clothing?"
    },
    {
        "word": "chancellor",
        "meaning": "A senior state or legal official, or the head of a university.",
        "sentences": ["The university chancellor gave an inspiring speech at the graduation ceremony."],
        "vocabulary_question": "Is a ██████████ a high-ranking official or a student in the first grade?"
    },
    {
        "word": "chaperonage",
        "meaning": "The supervision of a younger person or a group of people by an older person.",
        "sentences": ["The school dance required the chaperonage of several parents and teachers."],
        "vocabulary_question": "Does ███████████ involve watching over a group or letting them go unsupervised?"
    },
    {
        "word": "charcuterie",
        "meaning": "The meat dishes and cold cuts sold in a delicatessen.",
        "sentences": ["We shared a large charcuterie board filled with different types of ham and salami."],
        "vocabulary_question": "Does a ███████████ board feature fruit and vegetables or various types of meat?"
    },
    {
        "word": "charismatic",
        "meaning": "Exercising a compelling charm which inspires devotion in others.",
        "sentences": ["The charismatic leader was able to convince everyone to join her cause."],
        "vocabulary_question": "Is a ███████████ person usually very shy or very charming and persuasive?"
    },
    {
        "word": "charlatan",
        "meaning": "A person falsely claiming to have a special knowledge or skill; a fraud.",
        "sentences": ["The 'doctor' turned out to be a charlatan who didn't actually have a medical degree."],
        "vocabulary_question": "Is a █████████ a real expert or a person who is pretending to be an expert?"
    },
    {
        "word": "château",
        "meaning": "A large French country house or castle.",
        "sentences": ["We stayed in a beautiful old château during our trip through the French countryside."],
        "vocabulary_question": "Is a ███████ a type of small apartment or a large country house or castle?"
    },
    {
        "word": "chemise",
        "meaning": "A woman's loose-fitting undergarment or dress.",
        "sentences": ["She wore a simple silk chemise under her formal gown."],
        "vocabulary_question": "Is a ███████ a type of clothing or a type of furniture?"
    },
    {
        "word": "Cheshire cat",
        "meaning": "A fictional cat popularized by Lewis Carroll in 'Alice's Adventures in Wonderland,' known for its wide grin.",
        "sentences": ["He had a wide smile on his face, just like a Cheshire cat."],
        "vocabulary_question": "Is a ████████ ███ known for its grumpy face or its giant grin?"
    },
    {
        "word": "chevalier",
        "meaning": "A knight; or a member of certain orders of knighthood or merit.",
        "sentences": ["The brave chevalier rode his horse into the center of the town."],
        "vocabulary_question": "Is a █████████ a type of knight or a type of farm worker?"
    },
    {
        "word": "Chiapas",
        "meaning": "A state in southern Mexico, known for its mountainous terrain and Mayan ruins.",
        "sentences": ["The travelers explored the ancient temples hidden in the jungles of Chiapas."],
        "vocabulary_question": "Is ███████ a state in Mexico or a city in Canada?"
    },
    {
        "word": "chide",
        "meaning": "To scold or rebuke.",
        "sentences": ["The teacher had to chide the students for talking during the quiet study time."],
        "vocabulary_question": "When you █████ someone, are you praising them or scolding them?"
    },
    {
        "word": "Chihuahua",
        "meaning": "A very small breed of dog with a smooth or long coat, originating in Mexico.",
        "sentences": ["The tiny Chihuahua barked loudly at the much larger golden retriever."],
        "vocabulary_question": "Is a █████████ one of the largest dog breeds or one of the smallest?"
    },
    {
        "word": "chimera",
        "meaning": "In Greek mythology, a fire-breathing female monster with a lion's head, a goat's body, and a serpent's tail; or a thing that is hoped for but is illusory or impossible to achieve.",
        "sentences": ["The knight set out to defeat the terrifying chimera that was haunting the mountain."],
        "vocabulary_question": "Is a ███████ a mythical monster made of different animals or a real species of bird?"
    },
    {
        "word": "chinook",
        "meaning": "A warm, dry wind that blows down the eastern side of the Rocky Mountains.",
        "sentences": ["The arrival of the chinook caused the snow to melt away in just a few hours."],
        "vocabulary_question": "Is a ███████ a type of cold blizzard or a warm, dry mountain wind?"
    },
    {
        "word": "chintzy",
        "meaning": "Cheap and showy.",
        "sentences": ["The party decorations looked a bit chintzy and were easily broken."],
        "vocabulary_question": "Does ███████ describe something that is high-quality or something that looks cheap and showy?"
    },
    {
        "word": "cholera",
        "meaning": "An infectious and often fatal bacterial disease of the small intestine, typically contracted from infected water supplies.",
        "sentences": ["In the 1800s, many cities worked to improve their water systems to prevent the spread of cholera."],
        "vocabulary_question": "Is ███████ a type of illness or a type of musical instrument?"
    },
    {
        "word": "cholesterol",
        "meaning": "A compound of the sterol type found in most body tissues, including the blood and the nerves.",
        "sentences": ["Eating a balanced diet can help maintain healthy levels of cholesterol in the body."],
        "vocabulary_question": "Is ███████████ a substance found in the human body or a type of fuel for cars?"
    },
    {
        "word": "chrysalis",
        "meaning": "A quiescent insect stage, especially of a butterfly, enclosed in a firm case.",
        "sentences": ["We watched as the caterpillar spun a chrysalis and began its transformation."],
        "vocabulary_question": "Is a █████████ a stage in the life of a butterfly or a type of deep-sea fish?"
    },
    {
        "word": "chrysolite",
        "meaning": "A yellowish-green gem variety of olivine.",
        "sentences": ["The antique ring featured a beautiful, sparkling chrysolite stone."],
        "vocabulary_question": "Is ██████████ a type of colorful gemstone or a type of soft fabric?"
    },
    {
        "word": "chupacabra",
        "meaning": "A legendary creature in folklore, said to inhabit parts of the Americas and attack livestock.",
        "sentences": ["The local stories described the chupacabra as a mysterious creature that moved only at night."],
        "vocabulary_question": "Is the ██████████ a real scientific animal or a legendary creature from folklore?"
    },
    {
        "word": "churchianity",
        "meaning": "A focus on the customs, traditions, and institutions of a church rather than its actual religious principles.",
        "sentences": ["The speaker discussed the difference between deep faith and mere churchianity."],
        "vocabulary_question": "Does █████████████ focus more on institutional traditions or inner spiritual beliefs?"
    },
    {
        "word": "cicada",
        "meaning": "A large homopterous insect with long transparent wings, known for its loud buzzing sound.",
        "sentences": ["On hot summer evenings, we could hear the constant buzz of the cicada from the trees."],
        "vocabulary_question": "Is a ██████ a type of noisy insect or a type of silent reptile?"
    },
    {
        "word": "cilantro",
        "meaning": "An aromatic Mediterranean plant of the parsley family, used as a culinary herb.",
        "sentences": ["She chopped a handful of fresh cilantro to garnish the tacos."],
        "vocabulary_question": "Is ████████ a type of herb used in cooking or a type of garden tool?"
    },
    {
        "word": "Cincinnati",
        "meaning": "A major city in Ohio, located on the Ohio River.",
        "sentences": ["We took a trip to Cincinnati to visit the famous city zoo."],
        "vocabulary_question": "Is ██████████ a city in the United States or a country in Europe?"
    },
    {
        "word": "circadian",
        "meaning": "Relating to biological processes that recur naturally on a twenty-four-hour cycle.",
        "sentences": ["Jet lag can disrupt a person's circadian rhythm and make them feel tired."],
        "vocabulary_question": "Does a ████████ cycle last for one week or for twenty-four hours?"
    },
    {
        "word": "circuitous",
        "meaning": "Winding or meandering; longer than the most direct way.",
        "sentences": ["The hiking trail took a circuitous route around the entire mountain."],
        "vocabulary_question": "Is a ██████████ route a straight shortcut or a long, winding path?"
    },
    {
        "word": "circumflex",
        "meaning": "An accent (^) placed over a vowel in some languages to indicate a change in sound.",
        "sentences": ["In French class, we learned when to use a circumflex over the letter 'e'."],
        "vocabulary_question": "Is a ██████████ a type of accent mark used in writing or a type of punctuation like a comma?"
    },
    {
        "word": "circumstantial",
        "meaning": "Pointing indirectly toward someone's guilt but not proving it conclusively.",
        "sentences": ["The detective had a lot of circumstantial evidence, but no clear witness to the crime."],
        "vocabulary_question": "Does █████████████ evidence prove a fact directly or suggest it indirectly?"
    },
    {
        "word": "civet",
        "meaning": "A slender nocturnal carnivorous mammal with a spotted coat and a long tail.",
        "sentences": ["The civet is native to the tropical forests of Asia and Africa."],
        "vocabulary_question": "Is a █████ a type of small mammal or a type of large bird?"
    },
    {
        "word": "cladistics",
        "meaning": "A method of classification of animals and plants according to the proportion of measurable characteristics that they have in common.",
        "sentences": ["The biologist used cladistics to study the evolutionary history of the different bird species."],
        "vocabulary_question": "Is ██████████ a method used in biological classification or in car manufacturing?"
    },
    {
        "word": "cladogram",
        "meaning": "A branching diagram showing the cladistic relationship between a number of species.",
        "sentences": ["The textbook included a cladogram to show how different reptiles are related."],
        "vocabulary_question": "Is a █████████ a type of scientific diagram or a type of musical instrument?"
    },
    {
        "word": "clairvoyance",
        "meaning": "The supposed faculty of perceiving things or events in the future or beyond normal sensory contact.",
        "sentences": ["In the story, the character claimed to have the power of clairvoyance."],
        "vocabulary_question": "Does ████████████ mean the ability to see things clearly or the supposed power to see the future?"
    },
    {
        "word": "clandestine",
        "meaning": "Kept secret or done secretively, especially because illicit.",
        "sentences": ["The spies held a clandestine meeting in a quiet corner of the library."],
        "vocabulary_question": "Is a ███████████ activity one that is done openly or one that is kept secret?"
    },
    {
        "word": "clarion",
        "meaning": "Loud and clear; or a shrill, narrow-tubed war trumpet.",
        "sentences": ["The clarion call of the trumpet signaled the start of the ceremony."],
        "vocabulary_question": "Does a ███████ sound like a quiet whisper or a loud and clear announcement?"
    },
    {
        "word": "clavichord",
        "meaning": "A small, rectangular keyboard instrument with a very soft tone.",
        "sentences": ["The musician performed a delicate piece on the antique clavichord."],
        "vocabulary_question": "Is a ██████████ a type of keyboard instrument or a type of wind instrument?"
    },
    {
        "word": "clemency",
        "meaning": "Compassion in judgment and punishment.",
        "sentences": ["The prisoner's family asked the governor to grant him clemency."],
        "vocabulary_question": "Is ████████ strictly following the law or showing mercy and compassion?"
    },
    {
        "word": "cloture",
        "meaning": "A procedure for ending a debate and taking a vote in a legislative body.",
        "sentences": ["The Senate voted for cloture to finally bring the long discussion to an end."],
        "vocabulary_question": "Is ███████ a rule used to start a new debate or to end an old one?"
    },
    {
        "word": "coalescence",
        "meaning": "The joining or merging of elements to form one whole.",
        "sentences": ["The coalescence of the two companies created a much larger business."],
        "vocabulary_question": "Does ███████████ involve things splitting apart or merging together?"
    },
    {
        "word": "coaxation",
        "meaning": "The act of croaking, specifically of frogs.",
        "sentences": ["We listened to the constant coaxation of the bullfrogs by the pond."],
        "vocabulary_question": "Is ████████ a sound made by a bird or a sound made by a frog?"
    },
    {
        "word": "cochin",
        "meaning": "A breed of very large domestic chicken originally from China.",
        "sentences": ["The farmer raised cochin chickens known for their thick, fluffy feathers."],
        "vocabulary_question": "Is a ██████ a type of large chicken or a type of small fish?"
    },
    {
        "word": "cochlear",
        "meaning": "Relating to the cochlea, the spiral-shaped part of the inner ear.",
        "sentences": ["The specialist recommended a cochlear implant to help improve her hearing."],
        "vocabulary_question": "Does the word ████████ relate to your sense of sight or your sense of hearing?"
    },
    {
        "word": "codswallop",
        "meaning": "Nonsense; rubbish.",
        "sentences": ["He dismissed the ridiculous story as complete codswallop."],
        "vocabulary_question": "If you call something ██████████, are you saying it is very smart or total nonsense?"
    },
    {
        "word": "coercive",
        "meaning": "Relating to or using force or threats.",
        "sentences": ["The government was criticized for using coercive tactics to control the crowd."],
        "vocabulary_question": "Does a ████████ action involve being very gentle or using force and threats?"
    },
    {
        "word": "coeval",
        "meaning": "Having the same age or date of origin; contemporary.",
        "sentences": ["The two historic buildings are coeval, both having been built in the same year."],
        "vocabulary_question": "Are ██████ things from completely different times or from the same time period?"
    },
    {
        "word": "cogently",
        "meaning": "In a clear, logical, and convincing manner.",
        "sentences": ["The student argued her point so cogently that everyone agreed with her."],
        "vocabulary_question": "If you speak ████████, are you being very confusing or very clear and convincing?"
    },
    {
        "word": "cogitation",
        "meaning": "The action of thinking deeply about something; contemplation.",
        "sentences": ["After much cogitation, she finally decided which college to attend."],
        "vocabulary_question": "Does ██████████ involve a quick guess or thinking very deeply?"
    },
    {
        "word": "cognizant",
        "meaning": "Having knowledge or being aware of.",
        "sentences": ["The pilot was cognizant of the changing weather conditions."],
        "vocabulary_question": "If you are █████████ of a problem, do you know about it or are you unaware?"
    },
    {
        "word": "cohesive",
        "meaning": "Characterized by or causing particles of the same substance to stick together.",
        "sentences": ["The team was very cohesive, working together perfectly to win the game."],
        "vocabulary_question": "Do ████████ elements tend to fall apart or stick together?"
    },
    {
        "word": "cohosh",
        "meaning": "A North American plant of the buttercup family, used in traditional medicine.",
        "sentences": ["Black cohosh is a plant often found in the woods of the eastern United States."],
        "vocabulary_question": "Is ██████ a type of wild plant or a type of ocean fish?"
    },
    {
        "word": "coiffure",
        "meaning": "A person's hairstyle, typically an elaborate one.",
        "sentences": ["The bride’s elegant coiffure was decorated with small white flowers."],
        "vocabulary_question": "Does the word ████████ relate to a person's hairstyle or their shoes?"
    },
    {
        "word": "colic",
        "meaning": "Severe, often fluctuating pain in the abdomen caused by intestinal gas or obstruction.",
        "sentences": ["The baby cried for hours because of a bad case of colic."],
        "vocabulary_question": "Is █████ a type of stomach pain or a type of headache?"
    },
    {
        "word": "colleague",
        "meaning": "A person with whom one works, especially in a profession or business.",
        "sentences": ["She invited her colleague from the office to join her for lunch."],
        "vocabulary_question": "Is a ████████ someone you work with or a member of your family?"
    },
    {
        "word": "collectanea",
        "meaning": "A collection of passages from various authors; miscellany.",
        "sentences": ["The professor published a collectanea of famous poems from the 19th century."],
        "vocabulary_question": "Is ███████████ a single long novel or a collection of various writings?"
    },
    {
        "word": "collegiality",
        "meaning": "Companionship and cooperation between colleagues.",
        "sentences": ["The department was known for its high level of collegiality and support."],
        "vocabulary_question": "Does █████████████ describe people working together or people arguing?"
    },
    {
        "word": "collimate",
        "meaning": "To make parallel; to adjust accurately the line of sight of an optical instrument.",
        "sentences": ["The technician had to collimate the telescope to get a clear image of the stars."],
        "vocabulary_question": "When you ████████ light, are you making it scatter or making it move in a straight, parallel line?"
    },
    {
        "word": "collude",
        "meaning": "To connive with another; conspire, plot.",
        "sentences": ["The two companies were accused of trying to collude to keep prices high."],
        "vocabulary_question": "If you ███████ with someone, are you working with them in secret to do something wrong?"
    },
    {
        "word": "colocate",
        "meaning": "To place together or in a proper order.",
        "sentences": ["The library decided to colocate all the history books in the new wing."],
        "vocabulary_question": "When you ████████ items, are you putting them far apart or in the same place?"
    },
    {
        "word": "cologne",
        "meaning": "A perfumed liquid made of essential oils and alcohol.",
        "sentences": ["He sprayed a little bit of cologne on his wrist before the party."],
        "vocabulary_question": "Is ███████ something you use to smell nice or something you use to clean a floor?"
    },
    {
        "word": "columbarium",
        "meaning": "A room or building with niches for funeral urns to be stored.",
        "sentences": ["The family visited the columbarium to pay their respects."],
        "vocabulary_question": "Is a ███████████ a place where funeral urns are kept or a type of birdhouse?"
    },
    {
        "word": "comminatory",
        "meaning": "Threatening, especially with divine vengeance or punishment.",
        "sentences": ["The leader’s speech was comminatory, warning of the consequences of disobedience."],
        "vocabulary_question": "Is a ███████████ message very friendly or very threatening?"
    },
    {
        "word": "commiserative",
        "meaning": "Feeling or expressing pity or sorrow for someone; sympathetic.",
        "sentences": ["She gave her friend a commiserative hug after the team lost the game."],
        "vocabulary_question": "Is a █████████████ person showing sympathy or being very mean?"
    },
    {
        "word": "commissioner",
        "meaning": "A person appointed to a role on or by a commission.",
        "sentences": ["The city’s police commissioner held a press conference to discuss the new rules."],
        "vocabulary_question": "Is a ████████████ a person in an official role or a student at a school?"
    },
    {
        "word": "commodious",
        "meaning": "Roomy and comfortable.",
        "sentences": ["The new apartment was much more commodious than their previous one."],
        "vocabulary_question": "Is a ██████████ room very cramped and tiny or very roomy?"
    },
    {
        "word": "commove",
        "meaning": "To move violently; agitate; excite.",
        "sentences": ["The news of the discovery began to commove the entire scientific community."],
        "vocabulary_question": "Does to ███████ mean to keep something still or to shake it up and excite it?"
    },
    {
        "word": "compendium",
        "meaning": "A collection of concise but detailed information about a particular subject.",
        "sentences": ["The book was a useful compendium of all the different bird species in the area."],
        "vocabulary_question": "Is a ██████████ a brief but complete collection of information?"
    },
    {
        "word": "con forza",
        "meaning": "A musical direction meaning 'with force'.",
        "sentences": ["The conductor signaled the orchestra to play the final chords con forza."],
        "vocabulary_question": "If you play a song ██ █████, are you playing very softly or with great force?"
    },
    {
        "word": "concision",
        "meaning": "The quality of being brief in expression; conciseness.",
        "sentences": ["The editor praised the writer for the concision of her short stories."],
        "vocabulary_question": "Does █████████ mean using as many words as possible or being brief and clear?"
    },
    {
        "word": "conclave",
        "meaning": "A private or secret meeting.",
        "sentences": ["The leaders held a private conclave to decide the future of the project."],
        "vocabulary_question": "Is a ████████ a public party or a secret, private meeting?"
    },
    {
        "word": "concordance",
        "meaning": "An alphabetical list of the most important words in a book and where they can be found.",
        "sentences": ["He used the Bible's concordance to find every verse that mentioned the word 'peace'."],
        "vocabulary_question": "Is a ███████████ an index of words used in a book or a type of dictionary?"
    },
    {
        "word": "condign",
        "meaning": "Of a punishment or retribution: appropriate to the crime or offense; well-deserved.",
        "sentences": ["The judge ensured the criminal received condign punishment for his actions."],
        "vocabulary_question": "Is a ███████ punishment one that is unfair or one that is well-deserved?"
    },
    {
        "word": "conduit",
        "meaning": "A channel for conveying water or other fluid; or a tube for protecting electric wiring.",
        "sentences": ["The workers laid a new conduit to carry the fiber optic cables underground."],
        "vocabulary_question": "Is a ███████ a type of bridge or a tube used to carry things like water or wires?"
    },
    {
        "word": "Conestoga",
        "meaning": "A large, broad-wheeled covered wagon used for transporting goods across the North American prairies.",
        "sentences": ["The settlers traveled west in a sturdy Conestoga wagon."],
        "vocabulary_question": "Is a █████████ a type of modern car or a large covered wagon from the past?"
    },
    {
        "word": "confabulation",
        "meaning": "The act of talking or conversing; or the fabricated memory of a past event.",
        "sentences": ["The two old friends enjoyed a long confabulation on the front porch."],
        "vocabulary_question": "Is █████████████ a fancy word for a conversation or a type of dance?"
    },
    {
        "word": "confetti",
        "meaning": "Small pieces of colored paper thrown during a celebration.",
        "sentences": ["The air was filled with bright confetti when the clock struck midnight."],
        "vocabulary_question": "Do you throw ████████ during a celebration or during a quiet study time?"
    },
    {
        "word": "congeniality",
        "meaning": "Mutual agreeableness; the quality of being pleasant and friendly.",
        "sentences": ["The atmosphere of the dinner party was full of congeniality and laughter."],
        "vocabulary_question": "Does ████████████ describe people being friendly or people being rude?"
    },
    {
        "word": "conglutinant",
        "meaning": "Glue-like; or a substance that promotes the healing of a wound by sticking the edges together.",
        "sentences": ["The doctor applied a conglutinant dressing to the cut to help it close."],
        "vocabulary_question": "Does a ████████████ substance help things pull apart or stick together?"
    },
    {
        "word": "coniferous",
        "meaning": "Relating to trees or shrubs that bear cones and have needle-like leaves (like pines).",
        "sentences": ["The mountains are covered in thick coniferous forests that stay green all year."],
        "vocabulary_question": "Would you find cones or large broad leaves on a ██████████ tree?"
    },
    {
        "word": "connivery",
        "meaning": "The act of conniving; secret cooperation for a dishonest purpose.",
        "sentences": ["The plot was discovered before the group's connivery could cause any real trouble."],
        "vocabulary_question": "Is █████████ a word for honest teamwork or secret, sneaky planning?"
    },
    {
        "word": "consecrate",
        "meaning": "To make or declare something sacred or dedicated to a religious purpose.",
        "sentences": ["The community gathered to consecrate the new temple."],
        "vocabulary_question": "When you ██████████ something, are you treating it as ordinary or as holy?"
    },
    {
        "word": "consecutive",
        "meaning": "Following each other continuously; in unbroken or logical order.",
        "sentences": ["She won the spelling bee for three consecutive years."],
        "vocabulary_question": "If events are ███████████, are they happening one after another or at random times?"
    },
    {
        "word": "consequent",
        "meaning": "Following as a result or effect.",
        "sentences": ["The heavy rain and consequent flooding caused many roads to close."],
        "vocabulary_question": "Is a ██████████ something that happens before an event or as a result of it?"
    },
    {
        "word": "constabulary",
        "meaning": "An organized body of police officers.",
        "sentences": ["The local constabulary patrolled the streets during the festival."],
        "vocabulary_question": "Does the word ████████████ refer to a group of bakers or a group of police?"
    },
    {
        "word": "consternation",
        "meaning": "A feeling of anxiety or dismay, typically at something unexpected.",
        "sentences": ["To the consternation of the students, the teacher announced a surprise quiz."],
        "vocabulary_question": "Is █████████████ a feeling of great happiness or a feeling of worried dismay?"
    },
    {
        "word": "constituent",
        "meaning": "Being a part of a whole; or a person who lives in a specific area and is represented by an elected official.",
        "sentences": ["Hydrogen is a constituent element of water."],
        "vocabulary_question": "Is a ███████████ a separate, unrelated piece or a part that makes up a whole?"
    },
    {
        "word": "consul",
        "meaning": "An official appointed by a government to live in a foreign city and protect its citizens there.",
        "sentences": ["The traveler went to the embassy to speak with the consul about his lost passport."],
        "vocabulary_question": "Is a ██████ a type of government official or a type of small boat?"
    },
    {
        "word": "conticent",
        "meaning": "Silent; keeping quiet.",
        "sentences": ["The forest grew conticent as the sun began to set."],
        "vocabulary_question": "If a room is █████████, is it very noisy or very silent?"
    },
    {
        "word": "contiguous",
        "meaning": "Sharing a common border; touching.",
        "sentences": ["The United States has 48 contiguous states that all touch one another."],
        "vocabulary_question": "Are ██████████ things far apart from each other or touching?"
    },
    {
        "word": "continuous",
        "meaning": "Forming an unbroken whole, without interruption.",
        "sentences": ["The sound of the waterfall was a continuous roar in the background."],
        "vocabulary_question": "Is a ██████████ line one that is broken into pieces or one that has no gaps?"
    },
    {
        "word": "continuum",
        "meaning": "A continuous sequence in which adjacent elements are not very different from each other, but the extremes are quite distinct.",
        "sentences": ["Temperature exists on a continuum from freezing cold to boiling hot."],
        "vocabulary_question": "Does a █████████ describe a series of sudden jumps or a smooth, continuous scale?"
    },
    {
        "word": "contraband",
        "meaning": "Goods that have been imported or exported illegally.",
        "sentences": ["The guards checked the bags for any contraband being brought into the country."],
        "vocabulary_question": "Is ██████████ something that is legal to carry or something that is against the law?"
    },
    {
        "word": "contractually",
        "meaning": "In a way that is agreed upon in a legal contract.",
        "sentences": ["The company was contractually obligated to finish the work by Friday."],
        "vocabulary_question": "If you are █████████████ bound to do something, is it a legal requirement or just a suggestion?"
    },
    {
        "word": "contrariwise",
        "meaning": "In the opposite way or direction; on the contrary.",
        "sentences": ["Some people love the cold; contrariwise, others can't stand it."],
        "vocabulary_question": "Does ████████████ mean doing something in the same way or in the opposite way?"
    },
    {
        "word": "contrivance",
        "meaning": "A device, especially one that is very clever or complicated; or a clever plan.",
        "sentences": ["The elaborate contrivance was designed to catch mice without harming them."],
        "vocabulary_question": "Is a ███████████ a simple stick or a clever, complicated invention?"
    },
    {
        "word": "contumelious",
        "meaning": "Scornful and insulting; insolent.",
        "sentences": ["The king was offended by the prisoner's contumelious remarks."],
        "vocabulary_question": "Is a ████████████ comment very polite or very insulting?"
    },
    {
        "word": "copra",
        "meaning": "Dried coconut flesh from which coconut oil is extracted.",
        "sentences": ["The island's main export was copra used for making soap and oil."],
        "vocabulary_question": "Is █████ made from dried apples or dried coconuts?"
    },
    {
        "word": "Coptic",
        "meaning": "Relating to the Copts, an ethno-religious group in Egypt.",
        "sentences": ["We studied the history of the Coptic language and its ancient alphabet."],
        "vocabulary_question": "Does the word ██████ relate to a culture in Egypt or a culture in Norway?"
    },
    {
        "word": "coqui",
        "meaning": "A small frog native to Puerto Rico, known for its loud, two-note call.",
        "sentences": ["At night, the forest was filled with the chirping sound of the coqui."],
        "vocabulary_question": "Is a █████ a type of small frog or a type of large elephant?"
    },
    {
        "word": "coracidium",
        "meaning": "The ciliated, free-swimming larva of certain tapeworms.",
        "sentences": ["The biology student looked through the microscope to see the tiny coracidium."],
        "vocabulary_question": "Is a ██████████ a type of tiny larva or a type of giant tree?"
    },
    {
        "word": "cordillera",
        "meaning": "A system or group of parallel mountain ranges.",
        "sentences": ["The Andes is a famous cordillera that stretches along the coast of South America."],
        "vocabulary_question": "Is a ██████████ a single flat plain or a long chain of mountains?"
    },
    {
        "word": "corduroy",
        "meaning": "A thick cotton fabric with velvety ribs.",
        "sentences": ["He wore a pair of warm corduroy pants for the autumn hike."],
        "vocabulary_question": "Is ████████ a type of ribbed fabric or a type of smooth glass?"
    },
    {
        "word": "coriander",
        "meaning": "An aromatic Mediterranean plant of the parsley family, used as a culinary herb.",
        "sentences": ["She added a sprinkle of ground coriander to the curry for extra flavor."],
        "vocabulary_question": "Is █████████ a type of spice used in cooking or a type of construction tool?"
    },
    {
        "word": "Corinthian",
        "meaning": "Relating to the ancient Greek city of Corinth; or a style of ornate architecture.",
        "sentences": ["The building was supported by tall columns with beautiful Corinthian capitals."],
        "vocabulary_question": "Is the ██████████ style of architecture very simple or very ornate and decorated?"
    },
    {
        "word": "corm",
        "meaning": "A rounded, thick underground stem that stores food for a plant.",
        "sentences": ["The gardener planted a crocus corm in the soil before the winter."],
        "vocabulary_question": "Is a ████ part of a plant's stem or a part of a bird's tail?"
    },
    {
        "word": "cornea",
        "meaning": "The transparent layer forming the front of the eye.",
        "sentences": ["The light enters the eye through the clear surface of the cornea."],
        "vocabulary_question": "Is the ██████ located in the human eye or in the human ear?"
    },
    {
        "word": "cornel",
        "meaning": "A type of dogwood tree with small flowers and red berries.",
        "sentences": ["The cornel tree in the park was covered in bright red berries in the fall."],
        "vocabulary_question": "Is a ██████ a type of tree or a type of metal?"
    },
    {
        "word": "cornucopia",
        "meaning": "A symbol of plenty consisting of a goat's horn overflowing with flowers, fruit, and corn.",
        "sentences": ["The table was decorated with a beautiful cornucopia filled with the autumn harvest."],
        "vocabulary_question": "Is a ██████████ a symbol of having very little or a symbol of having plenty?"
    },
    {
        "word": "corollary",
        "meaning": "A proposition that follows from one already proved; a natural consequence or result.",
        "sentences": ["The increase in sales was a natural corollary of the successful advertising campaign."],
        "vocabulary_question": "Is a █████████ something that happens on its own or a result of something else?"
    },
    {
        "word": "coroner",
        "meaning": "An official who investigates violent, sudden, or suspicious deaths.",
        "sentences": ["The coroner was called to determine the cause of the mysterious accident."],
        "vocabulary_question": "Is a ███████ a doctor who treats the living or an official who investigates deaths?"
    },
    {
        "word": "corroborate",
        "meaning": "To provide evidence of the truth of; to confirm.",
        "sentences": ["The witness was able to corroborate the driver's story about the accident."],
        "vocabulary_question": "When you ███████████ a story, are you saying it is a lie or providing evidence that it is true?"
    },
    {
        "word": "corrosive",
        "meaning": "Tending to cause corrosion; eating away or eroding gradually.",
        "sentences": ["The strong acid had a corrosive effect on the metal pipes."],
        "vocabulary_question": "Does a █████████ substance protect a surface or eat away at it?"
    },
    {
        "word": "corsage",
        "meaning": "A small bouquet of flowers worn on a woman's dress or around her wrist.",
        "sentences": ["He gave her a beautiful white rose corsage to wear to the prom."],
        "vocabulary_question": "Is a ███████ a type of flower arrangement you wear or one you put in a tall vase?"
    },
    {
        "word": "cortex",
        "meaning": "The outer layer of an organ or other body structure, such as the brain.",
        "sentences": ["The cerebral cortex is responsible for many of the brain's highest functions."],
        "vocabulary_question": "Is the ██████ the inner core of an organ or its outer layer?"
    },
    {
        "word": "cotyledon",
        "meaning": "The first leaf or one of a pair of leaves developed by the embryo of a seed plant.",
        "sentences": ["We watched the tiny cotyledon emerge from the soil as the seed sprouted."],
        "vocabulary_question": "Is a █████████ a part of a full-grown tree or the first leaf of a new sprout?"
    },
    {
        "word": "cozen",
        "meaning": "To trick or deceive.",
        "sentences": ["The dishonest salesman tried to cozen the customers into buying something they didn't need."],
        "vocabulary_question": "If you █████ someone, are you being honest with them or trying to trick them?"
    },
    {
        "word": "credence",
        "meaning": "Belief in or acceptance of something as true.",
        "sentences": ["The detective didn't give much credence to the suspect's unlikely alibi."],
        "vocabulary_question": "If you give ███████ to a story, do you believe it or think it is a lie?"
    },
    {
        "word": "credulity",
        "meaning": "A tendency to be too ready to believe that something is real or true.",
        "sentences": ["The con artist took advantage of the crowd's credulity."],
        "vocabulary_question": "Does █████████ describe someone who is very skeptical or someone who believes things too easily?"
    },
    {
        "word": "Cree",
        "meaning": "A member of a North American people living in a vast area from the Rockies to Labrador.",
        "sentences": ["The book told the stories and traditions of the Cree people."],
        "vocabulary_question": "Is the ████ a group of indigenous people or a type of small bird?"
    },
    {
        "word": "creel",
        "meaning": "A wicker basket used by anglers for carrying fish.",
        "sentences": ["The fisherman placed the trout he caught into his woven creel."],
        "vocabulary_question": "Is a █████ a type of boat or a basket used for carrying fish?"
    },
    {
        "word": "crepuscular",
        "meaning": "Active in the evening; relating to or resembling twilight.",
        "sentences": ["Fireflies are crepuscular insects that begin to glow as the sun goes down."],
        "vocabulary_question": "Is a ███████████ animal active during the bright day or during the twilight of evening?"
    },
    {
        "word": "crescive",
        "meaning": "Increasing; growing.",
        "sentences": ["The company's success was due to its crescive influence in the market."],
        "vocabulary_question": "Does a ████████ influence mean it is getting smaller or getting larger?"
    },
    {
        "word": "Cretaceous",
        "meaning": "Relating to the last period of the Mesozoic era, characterized by the dominance of dinosaurs.",
        "sentences": ["The Triceratops lived during the late Cretaceous period."],
        "vocabulary_question": "Did the ██████████ period happen millions of years ago or just last year?"
    },
    {
        "word": "cribbage",
        "meaning": "A card game for two to four players, in which the score is kept by inserting pegs into a board.",
        "sentences": ["They sat by the fire and played a friendly game of cribbage."],
        "vocabulary_question": "Is ████████ a type of card game or a type of outdoor sport?"
    },
    {
        "word": "cribble",
        "meaning": "A coarse sieve; or to sift through a coarse sieve.",
        "sentences": ["The worker used a cribble to separate the large stones from the sand."],
        "vocabulary_question": "Is a ███████ a tool used for sifting or a tool used for painting?"
    },
    {
        "word": "cribo",
        "meaning": "A large, non-venomous snake found in Central and South America.",
        "sentences": ["The cribo snake is known for being a powerful hunter in the tropical forests."],
        "vocabulary_question": "Is a █████ a type of bird or a type of snake?"
    },
    {
        "word": "crinoline",
        "meaning": "A stiffened or hooped petticoat worn to make a long skirt stand out.",
        "sentences": ["The historical costume included a wide crinoline to give the dress its shape."],
        "vocabulary_question": "Is a █████████ a type of clothing worn under a skirt or a type of hat?"
    },
    {
        "word": "crith",
        "meaning": "A unit of mass for gases, equal to the weight of one liter of hydrogen at standard temperature and pressure.",
        "sentences": ["The scientist calculated the gas's weight in criths for the experiment."],
        "vocabulary_question": "Is a █████ a unit used to measure weight or a unit used to measure time?"
    },
    {
        "word": "cruciferous",
        "meaning": "Relating to plants of the cabbage family, which have flowers with four petals arranged in a cross.",
        "sentences": ["Broccoli and kale are popular examples of cruciferous vegetables."],
        "vocabulary_question": "Are ███████████ plants related to the cabbage family or the rose family?"
    },
    {
        "word": "cryogenic",
        "meaning": "Relating to or involving very low temperatures.",
        "sentences": ["The laboratory used cryogenic freezing to preserve the samples."],
        "vocabulary_question": "Does a █████████ process involve extremely high heat or extremely low cold?"
    },
    {
        "word": "cryptic",
        "meaning": "Enigmatic; mysterious; having a hidden meaning.",
        "sentences": ["The detective spent hours trying to solve the cryptic message left at the scene."],
        "vocabulary_question": "Is a ███████ message very easy to understand or mysterious and hidden?"
    },
    {
        "word": "cudgel",
        "meaning": "A short, thick stick used as a weapon.",
        "sentences": ["The character in the story defended himself with a wooden cudgel."],
        "vocabulary_question": "Is a ██████ a type of weapon (stick) or a type of musical instrument?"
    },
    {
        "word": "cum laude",
        "meaning": "With honor; used in university graduations to signify a high level of academic achievement.",
        "sentences": ["She was proud to graduate cum laude after years of hard work."],
        "vocabulary_question": "Does graduating ███ █████ mean you graduated with honors or that you failed?"
    },
    {
        "word": "cumbersome",
        "meaning": "Large or heavy and therefore difficult to carry or use; unwieldy.",
        "sentences": ["The old, heavy trunk was very cumbersome to move up the stairs."],
        "vocabulary_question": "Is a ██████████ object light and easy to carry or heavy and awkward?"
    },
    {
        "word": "cummerbund",
        "meaning": "A broad sash worn around the waist, especially as part of a man's formal evening suit.",
        "sentences": ["He wore a black tuxedo with a matching silk cummerbund."],
        "vocabulary_question": "Is a ██████████ worn around your waist or around your neck?"
    },
    {
        "word": "cumulus",
        "meaning": "A cloud forming rounded masses heaped on each other above a flat base.",
        "sentences": ["We watched the fluffy, white cumulus clouds drift across the blue sky."],
        "vocabulary_question": "Are ███████ clouds usually thin and wispy or thick and puffy?"
    },
    {
        "word": "cupidity",
        "meaning": "Greed for money or possessions.",
        "sentences": ["The villain's cupidity led him to steal the treasure from the village."],
        "vocabulary_question": "Is ████████ a word for being very generous or being very greedy?"
    },
    {
        "word": "curare",
        "meaning": "A bitter, resinous substance obtained from the bark of certain South American plants, used by indigenous peoples for poisoning arrows.",
        "sentences": ["The hunters applied curare to their blowgun darts before entering the forest."],
        "vocabulary_question": "Is ██████ a substance used for medicine or a poisonous substance used on arrows?"
    },
    {
        "word": "curie",
        "meaning": "A unit of radioactivity, corresponding to $3.7 \times 10^{10}$ disintegrations per second.",
        "sentences": ["The scientist measured the sample's radioactivity in curies."],
        "vocabulary_question": "Is a █████ a unit used to measure sound or a unit used to measure radioactivity?"
    },
    {
        "word": "curmudgeon",
        "meaning": "A bad-tempered or surly person.",
        "sentences": ["The neighbor was a bit of a curmudgeon who rarely spoke to anyone on the block."],
        "vocabulary_question": "Is a ██████████ a very friendly person or a grumpy, bad-tempered person?"
    },
    {
        "word": "cutis",
        "meaning": "The true skin; the layer of skin beneath the epidermis.",
        "sentences": ["The biology textbook showed a diagram of the different layers of the human cutis."],
        "vocabulary_question": "Does the word █████ relate to a layer of human skin or a type of mountain rock?"
    },
    {
        "word": "cyanosis",
        "meaning": "A bluish discoloration of the skin resulting from poor circulation or inadequate oxygenation of the blood.",
        "sentences": ["The doctors monitored the patient for signs of cyanosis during the surgery."],
        "vocabulary_question": "Does ████████ make a person's skin look bright red or a bluish color?"
    },
    {
        "word": "cybernetics",
        "meaning": "The science of communications and automatic control systems in both machines and living things.",
        "sentences": ["He chose to study cybernetics to understand how robots can be programmed to act like humans."],
        "vocabulary_question": "Does ████████████ involve the study of control systems or the study of ancient history?"
    },
    {
        "word": "cygnet",
        "meaning": "A juvenile swan.",
        "sentences": ["We watched the adult swan glide across the lake followed by its small, grey cygnet."],
        "vocabulary_question": "Is a ██████ a baby swan or a baby duck?"
    },
    {
        "word": "cynicism",
        "meaning": "An inclination to believe that people are motivated purely by self-interest; skepticism.",
        "sentences": ["Her cynicism made it hard for her to believe that the stranger's help was truly selfless."],
        "vocabulary_question": "Does ████████ describe a person who is very trusting or someone who is very skeptical?"
    }
,
    {
        "word": "da capo",
        "meaning": "A musical direction to repeat from the beginning.",
        "sentences": ["The sheet music had a da capo mark, telling the pianist to start over from the first measure."],
        "vocabulary_question": "Does da capo mean to stop the music or to go back to the beginning?"
    },
    {
        "word": "dace",
        "meaning": "A small freshwater fish of the carp family.",
        "sentences": ["We watched the silver dace swimming quickly through the clear stream."],
        "vocabulary_question": "Is a dace a type of small fish or a type of mountain bird?"
    },
    {
        "word": "dactylic",
        "meaning": "Relating to a metrical foot in poetry consisting of one stressed syllable followed by two unstressed ones.",
        "sentences": ["The poet used a dactylic rhythm to create a galloping sound in the verses."],
        "vocabulary_question": "Is dactylic a term used to describe rhythm in poetry or the flavor of food?"
    },
    {
        "word": "Dalmatian",
        "meaning": "A breed of large dog with a white coat and black or brown spots.",
        "sentences": ["The fire station's mascot was a friendly, spotted Dalmatian."],
        "vocabulary_question": "Is a Dalmatian known for having a solid black coat or a spotted white coat?"
    },
    {
        "word": "damascened",
        "meaning": "Decorated with wavy patterns like those on Damascus steel, or inlaid with gold or silver.",
        "sentences": ["The ancient sword featured a beautiful damascened blade."],
        "vocabulary_question": "Is a damascened object plain and simple or decorated with intricate patterns?"
    },
    {
        "word": "dambos",
        "meaning": "A name for complex, shallow wetlands in central and southern Africa.",
        "sentences": ["The cattle grazed in the lush, green dambos during the dry season."],
        "vocabulary_question": "Are dambos a type of wetland area or a type of dry desert sand dune?"
    },
    {
        "word": "dandle",
        "meaning": "To move a baby or young child up and down in a playful way.",
        "sentences": ["The grandfather liked to dandle the baby on his knee while singing a song."],
        "vocabulary_question": "When you dandle a child, are you playing with them or putting them to sleep?"
    },
    {
        "word": "danseur",
        "meaning": "A male ballet dancer.",
        "sentences": ["The lead danseur performed an incredible series of leaps across the stage."],
        "vocabulary_question": "Is a danseur a male dancer or a type of musical instrument?"
    },
    {
        "word": "danta",
        "meaning": "A large, heavy-bodied Central American animal, also known as a Baird's tapir.",
        "sentences": ["The danta moved quietly through the thick vegetation of the tropical forest."],
        "vocabulary_question": "Is a danta a type of large forest animal or a type of small flower?"
    },
    {
        "word": "darnel",
        "meaning": "A weedy grass that often grows in grain fields.",
        "sentences": ["The farmer worked hard to remove the darnel from his wheat field."],
        "vocabulary_question": "Is darnel a type of useful grain or a type of unwanted weed?"
    },
    {
        "word": "dashiki",
        "meaning": "An often brightly colored unfitted tunic originating in Africa.",
        "sentences": ["He wore a vibrant, patterned dashiki to the cultural festival."],
        "vocabulary_question": "Is a dashiki a type of loose-fitting clothing or a type of small drum?"
    },
    {
        "word": "daubster",
        "meaning": "A person who paints crudely or unskillfully.",
        "sentences": ["He jokingly called himself a daubster after finishing his first messy painting."],
        "vocabulary_question": "Is a daubster a world-famous master artist or a messy, unskillful painter?"
    },
    {
        "word": "davenport",
        "meaning": "A large sofa, often one that can be converted into a bed.",
        "sentences": ["We all sat on the comfortable davenport to watch the holiday movie."],
        "vocabulary_question": "Is a davenport a piece of furniture for sitting or a type of kitchen appliance?"
    },
    {
        "word": "deathin",
        "meaning": "An Australian name for a very poisonous plant, also known as the ironwood tree.",
        "sentences": ["Hikers were warned to stay away from the dangerous leaves of the deathin."],
        "vocabulary_question": "Is the deathin a safe garden vegetable or a poisonous plant?"
    },
    {
        "word": "debacle",
        "meaning": "A sudden and ignominious failure; a fiasco.",
        "sentences": ["The school play turned into a total debacle when the power went out."],
        "vocabulary_question": "Is a debacle a huge success or a giant, messy failure?"
    },
    {
        "word": "debilitate",
        "meaning": "To make someone very weak and infirm.",
        "sentences": ["The severe flu can quickly debilitate even the strongest person."],
        "vocabulary_question": "Does something that will debilitate you make you feel stronger or weaker?"
    },
    {
        "word": "debutante",
        "meaning": "A young woman making her first formal appearance in fashionable society.",
        "sentences": ["The debutante wore a beautiful white gown for the formal ball."],
        "vocabulary_question": "Is a debutante a young woman entering society or a retired sea captain?"
    },
    {
        "word": "deceased",
        "meaning": "No longer living; dead.",
        "sentences": ["The family shared stories to honor the memory of their deceased grandfather."],
        "vocabulary_question": "Does the word deceased mean that someone is alive or that they have died?"
    },
    {
        "word": "deceitful",
        "meaning": "Guilty of or involving a practice of misleading others; dishonest.",
        "sentences": ["The villain in the story used deceitful tricks to hide his true plans."],
        "vocabulary_question": "Is a deceitful person being very honest or being sneaky and dishonest?"
    },
    {
        "word": "deceleron",
        "meaning": "A type of split aileron used on aircraft for control.",
        "sentences": ["The pilot explained how the deceleron helps slow the plane down during landing."],
        "vocabulary_question": "Is a deceleron a part used on an airplane or a part used on a bicycle?"
    },
    {
        "word": "decennial",
        "meaning": "Occurring every ten years.",
        "sentences": ["The city held a grand decennial celebration to mark its progress over the decade."],
        "vocabulary_question": "Does a decennial event happen every single year or every ten years?"
    },
    {
        "word": "deciduous",
        "meaning": "Shedding its leaves annually (of a tree or shrub).",
        "sentences": ["Oak and maple are deciduous trees that lose their leaves in the fall."],
        "vocabulary_question": "Do deciduous trees keep their leaves all year or lose them every year?"
    },
    {
        "word": "decimation",
        "meaning": "The killing or destruction of a large proportion of a group or population.",
        "sentences": ["The disease led to the decimation of the local rabbit population."],
        "vocabulary_question": "Does decimation involve saving a group or causing widespread destruction?"
    },
    {
        "word": "declamatory",
        "meaning": "Expressing something in a loud, theatrical, or forceful way.",
        "sentences": ["The actor gave a declamatory speech that could be heard in the back of the theater."],
        "vocabulary_question": "Is a declamatory speech very quiet and whispered or loud and forceful?"
    },
    {
        "word": "declension",
        "meaning": "In grammar, the variation of the form of a noun, pronoun, or adjective.",
        "sentences": ["The students learned the different rules for noun declension in Latin class."],
        "vocabulary_question": "Is declension a term used in a grammar lesson or a cooking lesson?"
    },
    {
        "word": "declination",
        "meaning": "The state or process of declining; or a polite refusal.",
        "sentences": ["We received a kind declination to our invitation because they were out of town."],
        "vocabulary_question": "Is a declination an acceptance of an offer or a polite 'no'?"
    },
    {
        "word": "decurion",
        "meaning": "In ancient Rome, an officer in charge of a group of ten soldiers.",
        "sentences": ["The decurion led his small unit through the gates of the city."],
        "vocabulary_question": "Was a decurion a leader of ten soldiers or a leader of thousands?"
    },
    {
        "word": "defiant",
        "meaning": "Showing open resistance or bold disobedience.",
        "sentences": ["The defiant child refused to go to bed when his parents asked."],
        "vocabulary_question": "Is a defiant person following the rules or refusing to obey them?"
    },
    {
        "word": "deglaciation",
        "meaning": "The gradual melting away of a glacier or ice sheet.",
        "sentences": ["Scientists are monitoring the rate of deglaciation in the Arctic."],
        "vocabulary_question": "Does deglaciation involve the forming of new ice or the melting of old ice?"
    },
    {
        "word": "déjà vu",
        "meaning": "A feeling of having already experienced the present situation.",
        "sentences": ["When I walked into the old house, I had a strange sense of déjà vu."],
        "vocabulary_question": "Is déjà vu a feeling that something is brand new or that you have seen it before?"
    },
    {
        "word": "delectable",
        "meaning": "Delicious or highly pleasing to the senses.",
        "sentences": ["The bakery was filled with delectable treats like glazed donuts and cupcakes."],
        "vocabulary_question": "If food is ██████████, does it taste terrible or wonderful?"
    },
    {
        "word": "deleterious",
        "meaning": "Causing harm or damage.",
        "sentences": ["Too much screen time can have a deleterious effect on a person's sleep habits."],
        "vocabulary_question": "Is something ███████████ helpful and healthy or harmful and damaging?"
    },
    {
        "word": "deliquesce",
        "meaning": "To become liquid, typically by absorbing moisture from the air.",
        "sentences": ["Certain types of salt will deliquesce if left in a humid room."],
        "vocabulary_question": "When a substance begins to ██████████, is it turning into a solid or a liquid?"
    },
    {
        "word": "delirium",
        "meaning": "An acutely disturbed state of mind characterized by restlessness, illusions, and incoherence.",
        "sentences": ["The high fever caused the patient to fall into a state of delirium."],
        "vocabulary_question": "Does ████████ describe a state of clear thinking or a state of confusion?"
    },
    {
        "word": "deltoidal",
        "meaning": "Shaped like a delta or a triangle.",
        "sentences": ["The bird had unique, deltoidal markings on its wings."],
        "vocabulary_question": "Is a █████████ shape more like a perfect circle or a triangle?"
    },
    {
        "word": "dementia",
        "meaning": "A chronic or persistent disorder of the mental processes caused by brain disease or injury.",
        "sentences": ["The hospital provides specialized care for elderly patients suffering from dementia."],
        "vocabulary_question": "Does ████████ primarily affect a person's physical strength or their mental processes?"
    },
    {
        "word": "demerits",
        "meaning": "Marks awarded against someone for a fault or offense.",
        "sentences": ["The student received two demerits for being late to class three days in a row."],
        "vocabulary_question": "Are ████████ usually given for doing something right or for making a mistake?"
    },
    {
        "word": "demersal",
        "meaning": "Living close to the floor of the sea or a lake.",
        "sentences": ["Flounder and cod are examples of demersal fish that stay near the ocean bottom."],
        "vocabulary_question": "Would you find a ████████ fish swimming at the surface or at the very bottom?"
    },
    {
        "word": "Demeter",
        "meaning": "The Greek goddess of agriculture, harvest, and fertility.",
        "sentences": ["Ancient Greeks held festivals to thank Demeter for a successful harvest."],
        "vocabulary_question": "Was ███████ the goddess of the stars or the goddess of agriculture?"
    },
    {
        "word": "demographics",
        "meaning": "Statistical data relating to the population and particular groups within it.",
        "sentences": ["The company studied the demographics of the neighborhood to see who might buy their products."],
        "vocabulary_question": "Does ████████████ relate to the study of populations or the study of rocks?"
    },
    {
        "word": "demonstrative",
        "meaning": "Serving to demonstrate; or tending to show one's feelings openly.",
        "sentences": ["The children were very demonstrative, hugging their parents as soon as they arrived."],
        "vocabulary_question": "Is a █████████████ person someone who hides their feelings or someone who shows them openly?"
    },
    {
        "word": "demulcent",
        "meaning": "A substance that relieves irritation in the mucous membranes of the mouth.",
        "sentences": ["Honey is often used as a natural demulcent to soothe a sore throat."],
        "vocabulary_question": "Does a █████████ substance make a throat feel more irritated or more soothed?"
    },
    {
        "word": "dendrite",
        "meaning": "A short branched extension of a nerve cell; or a crystal with a branching treelike structure.",
        "sentences": ["The scientist observed how the dendrite receives signals from other nerve cells."],
        "vocabulary_question": "Is a ████████ shaped like a straight line or like a branching tree?"
    },
    {
        "word": "denigration",
        "meaning": "The action of unfairly criticizing or disparaging something or someone.",
        "sentences": ["The coach did not tolerate the denigration of any team members."],
        "vocabulary_question": "Does ████████████ involve praising someone or unfairly criticizing them?"
    },
    {
        "word": "denominator",
        "meaning": "The number below the line in a common fraction; a divisor.",
        "sentences": ["In the fraction 3/4, the number 4 is the denominator."],
        "vocabulary_question": "In a fraction, is the ███████████ the number on the top or the number on the bottom?"
    },
    {
        "word": "depose",
        "meaning": "To remove from office suddenly and forcefully; or to testify or give evidence on oath.",
        "sentences": ["The citizens marched to the palace to depose the unfair leader."],
        "vocabulary_question": "When you ██████ a leader, are you giving them a promotion or removing them from power?"
    },
    {
        "word": "depreciate",
        "meaning": "To diminish in value over a period of time.",
        "sentences": ["A new car will begin to depreciate as soon as you drive it off the lot."],
        "vocabulary_question": "If an item begins to ██████████, is it becoming more valuable or less valuable?"
    },
    {
        "word": "depredation",
        "meaning": "An act of attacking or plundering.",
        "sentences": ["The farmers protected their crops from the depredation of wild animals."],
        "vocabulary_question": "Is ███████████ an act of helping others or an act of attacking and stealing?"
    },
    {
        "word": "deprivation",
        "meaning": "The lack or denial of something considered to be a necessity.",
        "sentences": ["Sleep deprivation can make it very hard to focus on your schoolwork."],
        "vocabulary_question": "Does ███████████ mean you have plenty of what you need or that you are lacking something necessary?"
    },
    {
        "word": "derelict",
        "meaning": "In a very poor condition as a result of disuse and neglect.",
        "sentences": ["The derelict building was covered in vines and had many broken windows."],
        "vocabulary_question": "Is a ████████ house one that is brand new or one that is old and falling apart?"
    },
    {
        "word": "derisive",
        "meaning": "Expressing contempt or ridicule.",
        "sentences": ["The bully's derisive laughter hurt the younger student's feelings."],
        "vocabulary_question": "Is a ████████ laughter meant to be kind and friendly or mean and mocking?"
    },
    {
        "word": "derivative",
        "meaning": "Imitative of the work of another person, and usually disapproved of for that reason.",
        "sentences": ["The critic felt the new movie was too derivative of older, better films."],
        "vocabulary_question": "Is a ██████████ work something completely original or something that copies from others?"
    },
    {
        "word": "deserter",
        "meaning": "A member of the armed forces who deserts.",
        "sentences": ["The soldier was caught and punished for being a deserter."],
        "vocabulary_question": "Is a ████████ someone who stays at their post or someone who runs away from their duty?"
    },
    {
        "word": "desertification",
        "meaning": "The process by which fertile land becomes desert.",
        "sentences": ["Planting trees can help stop the desertification of the local plains."],
        "vocabulary_question": "Does ███████████████ involve land becoming a lush garden or a dry desert?"
    },
    {
        "word": "desolate",
        "meaning": "Deserted of people and in a state of bleak and dismal emptiness.",
        "sentences": ["The travelers crossed a desolate landscape where no plants or animals lived."],
        "vocabulary_question": "Is a ████████ place full of life and people or empty and lonely?"
    },
    {
        "word": "desuetude",
        "meaning": "A state of disuse.",
        "sentences": ["The old law had fallen into desuetude and was no longer enforced by the police."],
        "vocabulary_question": "If something is in a state of █████████, is it being used all the time or not at all?"
    },
    {
        "word": "detritus",
        "meaning": "Waste or debris of any kind.",
        "sentences": ["The beach was covered in detritus left behind by the high tide."],
        "vocabulary_question": "Is ████████ another word for valuable treasure or for waste and debris?"
    },
    {
        "word": "deus ex machina",
        "meaning": "An unexpected power or event saving a seemingly hopeless situation, especially as a plot device in a play or novel.",
        "sentences": ["The hero was saved by a deus ex machina when a giant eagle suddenly flew in to carry him away."],
        "vocabulary_question": "Is a ████ ██ ███████ a slow, logical ending or a sudden, unexpected rescue?"
    },
    {
        "word": "diabolical",
        "meaning": "Belonging to or so evil as to recall the Devil.",
        "sentences": ["The villain came up with a diabolical plan to take over the city."],
        "vocabulary_question": "Is a ███████████ plan one that is very kind or one that is very evil?"
    },
    {
        "word": "diacritic",
        "meaning": "A sign, such as an accent or cedilla, which when written above or below a letter indicates a difference in pronunciation.",
        "sentences": ["The word 'café' uses a diacritic over the 'e' to show how it should be said."],
        "vocabulary_question": "Is a ██████████ a type of math symbol or a mark used to show pronunciation?"
    },
    {
        "word": "diadem",
        "meaning": "An ornate headband worn as a royal crown.",
        "sentences": ["The princess wore a sparkling silver diadem for the coronation ceremony."],
        "vocabulary_question": "Is a ██████ a type of royal headband or a type of heavy boot?"
    },
    {
        "word": "dialysis",
        "meaning": "A medical treatment that filters waste from the blood when the kidneys cannot do it.",
        "sentences": ["The patient goes to the hospital three times a week for dialysis treatment."],
        "vocabulary_question": "Does ████████ help clean a person's blood or help them breathe?"
    },
    {
        "word": "Dianthus",
        "meaning": "A genus of flowering plants that includes carnations and pinks.",
        "sentences": ["The garden was filled with the sweet scent of blooming Dianthus."],
        "vocabulary_question": "Is a ████████ a type of flower or a type of garden tool?"
    },
    {
        "word": "diaspora",
        "meaning": "The dispersion or spread of any people from their original homeland.",
        "sentences": ["The museum exhibited art created by members of the African diaspora."],
        "vocabulary_question": "Does ████████ describe people staying in one place or spreading to many places?"
    },
    {
        "word": "diathermy",
        "meaning": "A medical technique using electric currents to produce heat in body tissues.",
        "sentences": ["The physical therapist used diathermy to help soothe the athlete's deep muscle pain."],
        "vocabulary_question": "Does █████████ use electricity to create heat or to create ice?"
    },
    {
        "word": "diatonic",
        "meaning": "Relating to the standard musical scale of eight notes without extra outside notes.",
        "sentences": ["The simple melody was written entirely using a diatonic scale."],
        "vocabulary_question": "Is a ████████ scale used in music or in a chemistry lab?"
    },
    {
        "word": "diatribe",
        "meaning": "A bitter, abusive, and usually lengthy speech or piece of writing.",
        "sentences": ["The frustrated customer launched into a long diatribe about the poor service."],
        "vocabulary_question": "Is a ████████ a very kind compliment or a long, angry speech?"
    },
    {
        "word": "diaulos",
        "meaning": "A double flute used by the ancient Greeks, or an ancient Greek footrace.",
        "sentences": ["The museum display featured a reed diaulos found in an ancient tomb."],
        "vocabulary_question": "Is a ███████ an ancient musical instrument or a type of modern car?"
    },
    {
        "word": "dietetic",
        "meaning": "Relating to diet and nutrition.",
        "sentences": ["The hospital provides dietetic meals tailored to each patient's health needs."],
        "vocabulary_question": "Does the word ████████ relate to what we eat or to how we sleep?"
    },
    {
        "word": "dihedral",
        "meaning": "Having or formed by two intersecting planes.",
        "sentences": ["The engineer explained how the dihedral angle of the wings helps keep the plane stable."],
        "vocabulary_question": "Does ████████ describe a shape formed by one plane or by two intersecting planes?"
    },
    {
        "word": "dilapidated",
        "meaning": "In a state of disrepair or ruin as a result of age or neglect.",
        "sentences": ["They worked together to fix up the dilapidated old barn."],
        "vocabulary_question": "Is a ███████████ building in great condition or falling apart?"
    },
    {
        "word": "diligence",
        "meaning": "Careful and persistent work or effort.",
        "sentences": ["Her diligence in practicing every day helped her win the spelling bee."],
        "vocabulary_question": "Is █████████ a sign of laziness or a sign of hard work?"
    },
    {
        "word": "diluent",
        "meaning": "A substance used to dilute or thin something else.",
        "sentences": ["The painter added a little bit of diluent to the thick paint to make it easier to spread."],
        "vocabulary_question": "Does a ███████ make a liquid thicker or thinner?"
    },
    {
        "word": "dimorphism",
        "meaning": "The occurrence of two distinct forms (such as size or color) within a species.",
        "sentences": ["The peacock shows extreme dimorphism, with the male being much brighter than the female."],
        "vocabulary_question": "Does ██████████ mean all animals in a group look the same or that there are two different forms?"
    },
    {
        "word": "diocese",
        "meaning": "A district under the care of a bishop in the Christian Church.",
        "sentences": ["The bishop traveled throughout the diocese to visit different local churches."],
        "vocabulary_question": "Is a ███████ a type of garden or a religious district?"
    },
    {
        "word": "diphthong",
        "meaning": "A sound formed by the combination of two vowels in a single syllable (like the 'oi' in 'oil').",
        "sentences": ["The teacher explained how to pronounce the diphthong in the word 'cloud'."],
        "vocabulary_question": "Is a █████████ a single vowel sound or a combination of two vowel sounds?"
    },
    {
        "word": "diptych",
        "meaning": "A picture or series of pictures painted on two tablets connected by hinges.",
        "sentences": ["The museum featured a beautiful medieval diptych carved from ivory."],
        "vocabulary_question": "Is a ███████ an artwork made of one piece or two connected pieces?"
    },
    {
        "word": "dirigible",
        "meaning": "A steerable, self-propelled airship.",
        "sentences": ["The massive dirigible floated slowly over the city during the festival."],
        "vocabulary_question": "Is a █████████ a type of boat or a type of airship?"
    },
    {
        "word": "discernment",
        "meaning": "The ability to judge well.",
        "sentences": ["The art collector was known for her discernment and good taste."],
        "vocabulary_question": "Does a person with ███████████ make poor choices or wise judgments?"
    },
    {
        "word": "discombobulate",
        "meaning": "To upset, confuse, or frustrate.",
        "sentences": ["The complicated instructions were enough to discombobulate even the smartest students."],
        "vocabulary_question": "If you ██████████████ someone, are you making them feel calm or confused?"
    },
    {
        "word": "discountenance",
        "meaning": "To refuse to approve of something, or to make someone feel embarrassed.",
        "sentences": ["The school board chose to discountenance the proposal for a longer school day."],
        "vocabulary_question": "When you ██████████████ an idea, are you supporting it or refusing to approve it?"
    },
    {
        "word": "discreetly",
        "meaning": "In a careful and prudent manner to avoid notice or embarrassment.",
        "sentences": ["She discreetly whispered the answer to her friend so no one else would hear."],
        "vocabulary_question": "If you do something ██████████, are you trying to get attention or trying to be subtle?"
    },
    {
        "word": "discretionary",
        "meaning": "Left to individual choice or judgment; not mandatory.",
        "sentences": ["The manager had a discretionary fund to spend on extra office supplies."],
        "vocabulary_question": "Is a █████████████ choice one that you MUST make or one that you CHOOSE to make?"
    },
    {
        "word": "disembogue",
        "meaning": "To emerge from a narrow place into a wide, open area (like a river into the sea).",
        "sentences": ["We watched the river disembogue into the vast blue ocean."],
        "vocabulary_question": "Does to ██████████ mean to enter a tiny cave or to flow out into a wide space?"
    },
    {
        "word": "disjunct",
        "meaning": "Disjoined and distinct from one another.",
        "sentences": ["The two groups remained disjunct, with very different goals and ideas."],
        "vocabulary_question": "Are ████████ things connected together or separate and distinct?"
    },
    {
        "word": "Disneyfication",
        "meaning": "The transformation of a place into something simplified and commercialized.",
        "sentences": ["Critics worried about the Disneyfication of the historic mountain village."],
        "vocabulary_question": "Does ███████████████ make a place more realistic or more simplified and commercial?"
    },
    {
        "word": "disparate",
        "meaning": "Essentially different in kind; not allowing comparison.",
        "sentences": ["The debate brought together people with very disparate points of view."],
        "vocabulary_question": "Are █████████ things very similar or very different from one another?"
    },
    {
        "word": "disproportionate",
        "meaning": "Too large or too small in comparison with something else.",
        "sentences": ["The tiny dog had a disproportionate bark that sounded like a much larger animal."],
        "vocabulary_question": "If something is ████████████████, is it perfectly balanced or out of proportion?"
    },
    {
        "word": "dissemble",
        "meaning": "To conceal one's true motives, feelings, or beliefs.",
        "sentences": ["He tried to dissemble his disappointment by putting on a brave smile."],
        "vocabulary_question": "When you ████████, are you being very honest or hiding your true feelings?"
    },
    {
        "word": "dissolution",
        "meaning": "The closing down or dismissal of an official body or assembly.",
        "sentences": ["The president announced the dissolution of the committee after the project was finished."],
        "vocabulary_question": "Does ███████████ mean the starting of a group or the closing down of one?"
    },
    {
        "word": "dissonance",
        "meaning": "A lack of harmony among musical notes or a tension resulting from clashing ideas.",
        "sentences": ["The orchestra's intentional dissonance made the mystery movie sound very spooky."],
        "vocabulary_question": "Does ██████████ describe a sound that is perfectly smooth or one that is clashing and harsh?"
    },
    {
        "word": "distraught",
        "meaning": "Deeply upset and agitated.",
        "sentences": ["The girl was distraught when she realized she had lost her favorite stuffed animal."],
        "vocabulary_question": "If someone is ██████████, are they feeling very calm or very upset?"
    },
    {
        "word": "dodecahedron",
        "meaning": "A three-dimensional geometric shape with twelve flat faces.",
        "sentences": ["In math class, we built a model of a dodecahedron using toothpicks and clay."],
        "vocabulary_question": "Does a ████████████ have six faces or twelve faces?"
    },
    {
        "word": "dogana",
        "meaning": "An Italian customhouse.",
        "sentences": ["The merchants had to stop at the dogana to pay taxes on the goods they brought into Italy."],
        "vocabulary_question": "Is a ██████ a place to buy groceries or an Italian building for customs and taxes?"
    },
    {
        "word": "doldrums",
        "meaning": "A state or period of inactivity, stagnation, or depression; the blues.",
        "sentences": ["After the holidays ended, he felt like he was in the doldrums for a few days."],
        "vocabulary_question": "Does being in the ████████ mean you are feeling very excited or a bit sad and bored?"
    },
    {
        "word": "dolma",
        "meaning": "A dish of vegetables (usually grape leaves) stuffed with a mixture of rice, meat, and spices.",
        "sentences": ["For the appetizer, we enjoyed a plate of cold, savory grape leaf dolma."],
        "vocabulary_question": "Is a █████ a type of stuffed vegetable dish or a type of dessert cake?"
    },
    {
        "word": "dolmen",
        "meaning": "A prehistoric tomb consisting of a large flat stone laid on upright ones.",
        "sentences": ["The hikers visited an ancient stone dolmen located on the grassy hilltop."],
        "vocabulary_question": "Is a ██████ a modern skyscraper or an ancient stone structure?"
    },
    {
        "word": "domesticity",
        "meaning": "Home or family life.",
        "sentences": ["She enjoyed the quiet domesticity of spending her Saturday mornings baking bread."],
        "vocabulary_question": "Does ███████████ relate to working in a big factory or life at home with family?"
    },
    {
        "word": "domiciled",
        "meaning": "Living or residing in a particular place.",
        "sentences": ["The famous author was domiciled in a small cottage near the sea."],
        "vocabulary_question": "If you are █████████ in a city, does it mean you are just visiting or that you live there?"
    },
    {
        "word": "domineering",
        "meaning": "Asserting one's will over others in an arrogant way; bossy.",
        "sentences": ["Nobody wanted to work with the domineering student who tried to control every part of the project."],
        "vocabulary_question": "Is a ███████████ person very shy and quiet or bossy and controlling?"
    },
    {
        "word": "dopamine",
        "meaning": "A chemical in the brain that sends signals and is associated with feelings of reward.",
        "sentences": ["Winning the race gave her a quick rush of dopamine and a feeling of happiness."],
        "vocabulary_question": "Is ████████ a chemical found in the human brain or a type of metal?"
    },
    {
        "word": "Doppler",
        "meaning": "Relating to the effect of a change in the frequency of sound or light waves as the source moves.",
        "sentences": ["The siren changed pitch as it passed us because of the Doppler effect."],
        "vocabulary_question": "Does the ███████ effect relate to the way we hear moving sounds or the way we taste food?"
    },
    {
        "word": "Dorking",
        "meaning": "A breed of domestic chicken with five toes on each foot.",
        "sentences": ["The farmer added a white Dorking hen to his flock."],
        "vocabulary_question": "Is a ███████ a type of chicken or a type of garden tractor?"
    },
    {
        "word": "doula",
        "meaning": "A person, usually a woman, who is trained to provide support to a woman during childbirth.",
        "sentences": ["The parents-to-be hired a doula to help them prepare for the baby's arrival."],
        "vocabulary_question": "Does a █████ help someone build a house or help someone during childbirth?"
    },
    {
        "word": "dowager",
        "meaning": "A widow with a title or property derived from her late husband.",
        "sentences": ["The wealthy dowager lived in a large mansion at the edge of town."],
        "vocabulary_question": "Is a ███████ a young child or a woman who has inherited property from her late husband?"
    },
    {
        "word": "dowdy",
        "meaning": "Unfashionable and without style in appearance; old-fashioned.",
        "sentences": ["She decided to update her wardrobe because her clothes felt a bit dowdy."],
        "vocabulary_question": "If something is █████, is it the latest fashion or old-fashioned and plain?"
    },
    {
        "word": "Dramamine",
        "meaning": "A brand of medication used to treat or prevent motion sickness.",
        "sentences": ["He took a Dramamine before the boat trip to make sure he didn't feel seasick."],
        "vocabulary_question": "Is █████████ used to treat a cough or to prevent motion sickness?"
    },
    {
        "word": "dromic",
        "meaning": "Relating to or resembling a racecourse.",
        "sentences": ["The ancient building featured a long, dromic passage leading to the arena."],
        "vocabulary_question": "Does the word ██████ relate to a library or to a racecourse?"
    },
    {
        "word": "druid",
        "meaning": "A priest, magician, or soothsayer in the ancient Celtic religion.",
        "sentences": ["The legend told of a powerful druid who lived in a sacred oak grove."],
        "vocabulary_question": "Was a █████ an ancient priest or a modern computer scientist?"
    },
    {
        "word": "drumlin",
        "meaning": "A low oval mound or small hill, typically one of a group, consisting of compacted boulder clay molded by past glacial action.",
        "sentences": ["The geologist explained how the drumlin hill was formed by a moving glacier."],
        "vocabulary_question": "Is a ███████ a hole in the ground or a small hill formed by a glacier?"
    },
    {
        "word": "drupiferous",
        "meaning": "Bearing or producing drupes (stone fruits like cherries or peaches).",
        "sentences": ["The drupiferous trees in the orchard were heavy with ripe plums."],
        "vocabulary_question": "Does a ████████████ tree produce fruit with stones/pits or fruit with tiny seeds?"
    },
    {
        "word": "dryad",
        "meaning": "In Greek mythology, a nymph inhabiting a forest or a tree.",
        "sentences": ["The poem described a shy dryad peeking out from behind a large oak tree."],
        "vocabulary_question": "Is a █████ a spirit that lives in a forest or a creature that lives in the ocean?"
    },
    {
        "word": "du jour",
        "meaning": "Of the day; often used to describe a special dish in a restaurant.",
        "sentences": ["The soup du jour was a creamy tomato basil."],
        "vocabulary_question": "If a meal is '██ ████', does it mean it is always on the menu or just for today?"
    },
    {
        "word": "dungarees",
        "meaning": "Pants made of blue denim; overalls.",
        "sentences": ["The gardener wore a sturdy pair of dungarees while working in the dirt."],
        "vocabulary_question": "Are █████████ a type of silk dress or a type of sturdy work pants?"
    },
    {
        "word": "duplicitous",
        "meaning": "Deceitful; two-faced; dishonest.",
        "sentences": ["The character's duplicitous nature was revealed when he betrayed his best friend."],
        "vocabulary_question": "Is a ███████████ person very honest or very sneaky and dishonest?"
    },
    {
        "word": "durango",
        "meaning": "A type of sturdy uniform cloth or fabric.",
        "sentences": ["The school uniforms were made of a rugged durango fabric to last the whole year."],
        "vocabulary_question": "Is ███████ a type of fabric or a type of sweet fruit?"
    },
    {
        "word": "dysgraphia",
        "meaning": "A learning disability that affects writing abilities.",
        "sentences": ["The student used a computer to help with his schoolwork because of his dysgraphia."],
        "vocabulary_question": "Does ██████████ primarily affect a person's ability to run or their ability to write?"
    },
    {
        "word": "dyspeptic",
        "meaning": "Of or having indigestion; or consequently irritable or grumpy.",
        "sentences": ["The dyspeptic waiter made the diners feel unwelcome with his grumpy attitude."],
        "vocabulary_question": "Is a █████████ person feeling very cheerful or very grumpy?"
    },
    {
        "word": "dystopia",
        "meaning": "An imagined state or society in which there is great suffering or injustice.",
        "sentences": ["The book described a frightening dystopia where people were not allowed to choose their own jobs."],
        "vocabulary_question": "Is a ████████ a perfect paradise or a very unpleasant and unfair society?"
    },
    {
        "word": "ebenaceous",
        "meaning": "Relating to or belonging to the ebony family of trees and shrubs.",
        "sentences": ["The artisan preferred ebenaceous wood for its deep, dark color and durability."],
        "vocabulary_question": "Does an ██████████ tree belong to the oak family or the ebony family?"
    },
    {
        "word": "ebullience",
        "meaning": "The quality of being cheerful and full of energy; exuberance.",
        "sentences": ["The winner's ebullience was contagious, making everyone in the room smile."],
        "vocabulary_question": "Is ██████████ a sign of being very sad or very energetic and happy?"
    },
    {
        "word": "eburnean",
        "meaning": "Resembling or made of ivory.",
        "sentences": ["The statue had a smooth, eburnean finish that glowed under the lights."],
        "vocabulary_question": "Does ████████ describe something that looks like ivory or something that looks like rusty iron?"
    },
    {
        "word": "echidna",
        "meaning": "A spiny, egg-laying mammal native to Australia and New Guinea.",
        "sentences": ["The echidna used its long snout to search for ants and termites in the dirt."],
        "vocabulary_question": "Is an ███████ a type of bird or a type of spiny mammal?"
    },
    {
        "word": "ectoplasm",
        "meaning": "The outer layer of the cytoplasm in a cell; or a spiritual substance supposed to issue from a medium's body.",
        "sentences": ["In biology class, we studied the movement of ectoplasm within a single-celled organism."],
        "vocabulary_question": "Is █████████ found inside a biological cell or at the top of a mountain?"
    },
    {
        "word": "Ecuador",
        "meaning": "A country in northwestern South America, named for its location on the equator.",
        "sentences": ["Ecuador is home to the Galapagos Islands and a portion of the Amazon rainforest."],
        "vocabulary_question": "Is ███████ a country in South America or a city in Europe?"
    },
    {
        "word": "edelweiss",
        "meaning": "A mountain plant with small white flowers and woolly leaves, found in the Alps.",
        "sentences": ["The hikers were excited to find a rare edelweiss growing high in the mountains."],
        "vocabulary_question": "Is █████████ a type of mountain flower or a type of deep-sea fish?"
    },
    {
        "word": "educand",
        "meaning": "A person who is being educated or should be educated.",
        "sentences": ["The teacher focused on the individual needs of each educand in the classroom."],
        "vocabulary_question": "Is an ███████ a person who is teaching or a person who is being taught?"
    },
    {
        "word": "Edwardian",
        "meaning": "Relating to the reign of King Edward VII (1901–1910).",
        "sentences": ["The historic home featured beautiful Edwardian architecture from the early 1900s."],
        "vocabulary_question": "Does █████████ relate to a time period in the early 20th century or the middle ages?"
    },
    {
        "word": "efface",
        "meaning": "To erase a mark from a surface; to make oneself appear insignificant.",
        "sentences": ["Time had begun to efface the inscription on the old stone monument."],
        "vocabulary_question": "When you ██████ something, are you highlighting it or rubbing it away?"
    },
    {
        "word": "effervescent",
        "meaning": "Animated, bubbly, or giving off bubbles.",
        "sentences": ["Her effervescent personality made her the life of every party."],
        "vocabulary_question": "Does an ████████████ person seem very tired or very bubbly and lively?"
    },
    {
        "word": "efflux",
        "meaning": "The action of flowing out; a thing that flows out.",
        "sentences": ["The factory had to manage the efflux of water into the nearby stream."],
        "vocabulary_question": "Does ██████ mean something is flowing in or flowing out?"
    },
    {
        "word": "effraction",
        "meaning": "The act of breaking into a building, especially for a burglarious purpose.",
        "sentences": ["The police found evidence of effraction at the jewelry store's back door."],
        "vocabulary_question": "Is ██████████ a word for a legal entry or a forceful breaking in?"
    },
    {
        "word": "effusive",
        "meaning": "Expressing feelings of gratitude, pleasure, or approval in an unrestrained way.",
        "sentences": ["The author received effusive praise for her latest best-selling novel."],
        "vocabulary_question": "Is an ████████ compliment very quiet or very enthusiastic and overflowing?"
    },
    {
        "word": "eggcorn",
        "meaning": "A word or phrase that results from a mishearing or misinterpretation of another.",
        "sentences": ["Using 'old-timers' disease' instead of 'Alzheimer's disease' is a common eggcorn."],
        "vocabulary_question": "Is an ████████ a correctly spelled word or a phrase born from a funny mistake?"
    },
    {
        "word": "egress",
        "meaning": "The action of going out of or leaving a place.",
        "sentences": ["The theater was designed with several wide doors to allow for a quick egress."],
        "vocabulary_question": "Is an ██████ an entrance or an exit?"
    },
    {
        "word": "elodea",
        "meaning": "A submerged aquatic plant often used in aquariums.",
        "sentences": ["We added some elodea to the fish tank to help provide oxygen."],
        "vocabulary_question": "Does ██████ grow on dry land or underwater?"
    },
    {
        "word": "embolus",
        "meaning": "A blood clot, air bubble, or piece of fatty deposit that has been carried in the bloodstream.",
        "sentences": ["The doctor monitored the patient to prevent an embolus from reaching the lungs."],
        "vocabulary_question": "Is an ███████ something that travels through the bloodstream or something that stays in the stomach?"
    },
    {
        "word": "emeritus",
        "meaning": "Having retired but allowed to retain their title as an honor.",
        "sentences": ["The professor emeritus still has an office at the university where he writes books."],
        "vocabulary_question": "Is an ████████ leader someone who is just starting or someone who has retired with honor?"
    },
    {
        "word": "eminent",
        "meaning": "Famous and respected within a particular sphere or profession.",
        "sentences": ["The university was proud to host a lecture by an eminent scientist."],
        "vocabulary_question": "Is an ███████ person someone who is unknown or someone who is famous and respected?"
    },
    {
        "word": "emissary",
        "meaning": "A person sent on a special mission, usually as a diplomatic representative.",
        "sentences": ["The queen sent an emissary to the neighboring kingdom to discuss the treaty."],
        "vocabulary_question": "Is an ████████ a person who stays home or a messenger sent on a mission?"
    },
    {
        "word": "Emmy",
        "meaning": "An award given annually for excellence in the television industry.",
        "sentences": ["The popular show won an Emmy for its outstanding acting and writing."],
        "vocabulary_question": "Is an ████ an award for movies or for television shows?"
    },
    {
        "word": "empanada",
        "meaning": "A pastry turnover stuffed especially with a savory meat filling.",
        "sentences": ["We bought a warm beef empanada from the street vendor for lunch."],
        "vocabulary_question": "Is an ████████ a type of stuffed pastry or a type of fruit juice?"
    },
    {
        "word": "emulsify",
        "meaning": "To make into or become an emulsion (a fine dispersion of minute droplets of one liquid in another).",
        "sentences": ["You must whisk the oil and vinegar vigorously to emulsify them for the dressing."],
        "vocabulary_question": "When you ████████ something, are you separating two liquids or blending them together?"
    },
    {
        "word": "en masse",
        "meaning": "In a group; all together.",
        "sentences": ["The students moved en masse toward the auditorium for the assembly."],
        "vocabulary_question": "Does ██ █████ mean one by one or all at once in a group?"
    },
    {
        "word": "encomium",
        "meaning": "A speech or piece of writing that praises someone or something highly.",
        "sentences": ["The coach delivered a moving encomium for the retiring captain."],
        "vocabulary_question": "Is an ████████ a harsh criticism or a speech of high praise?"
    },
    {
        "word": "ensconced",
        "meaning": "Established or settled in a comfortable, safe, or secret place.",
        "sentences": ["She was ensconced in her favorite armchair with a good book and a cup of tea."],
        "vocabulary_question": "If you are █████████, are you standing in the cold or settled comfortably somewhere?"
    },
    {
        "word": "ensorcell",
        "meaning": "To enchant or fascinate someone.",
        "sentences": ["The beautiful music seemed to ensorcell the entire audience."],
        "vocabulary_question": "Does to █████████ someone mean to bore them or to put them under a spell of fascination?"
    },
    {
        "word": "ensued",
        "meaning": "Happened or occurred afterward or as a result.",
        "sentences": ["After the final whistle blew, a wild celebration ensued on the field."],
        "vocabulary_question": "If something ██████, did it happen before or after another event?"
    },
    {
        "word": "entente",
        "meaning": "A friendly understanding or informal alliance between states or factions.",
        "sentences": ["The two nations signed an entente to cooperate on trade and security."],
        "vocabulary_question": "Is an ████████ an agreement between groups or a type of disagreement?"
    },
    {
        "word": "entrails",
        "meaning": "The internal organs of an animal, especially the intestines.",
        "sentences": ["The biologist carefully examined the entrails of the specimen."],
        "vocabulary_question": "Do █████████ refer to the outer fur of an animal or its internal organs?"
    },
    {
        "word": "environs",
        "meaning": "The surrounding area or district.",
        "sentences": ["The city and its beautiful environs are a popular destination for hikers."],
        "vocabulary_question": "Does the word ████████ refer to the center of a room or the surrounding area?"
    },
    {
        "word": "epaxial",
        "meaning": "Located above or on the dorsal side of an axis, such as the spine.",
        "sentences": ["The vet examined the epaxial muscles along the dog's back."],
        "vocabulary_question": "Are ███████ muscles found near the spine or near the bottom of the feet?"
    },
    {
        "word": "epenthesis",
        "meaning": "The addition of a sound or letter within a word (like the 'p' in 'empty').",
        "sentences": ["The linguist explained how epenthesis changed the pronunciation of the ancient word."],
        "vocabulary_question": "Does ██████████ involves taking a letter away or adding a sound into a word?"
    },
    {
        "word": "epidermis",
        "meaning": "The outer layer of the skin.",
        "sentences": ["Sunscreen helps protect your epidermis from harmful UV rays."],
        "vocabulary_question": "Is the █████████ the deepest layer of tissue or the very outer layer of skin?"
    },
    {
        "word": "epidural",
        "meaning": "Relating to the space upon or outside the dura mater of the brain or spinal cord.",
        "sentences": ["The patient received an epidural to block the pain during the medical procedure."],
        "vocabulary_question": "Is an ████████ used to increase pain or to provide medical numbing?"
    },
    {
        "word": "epiphany",
        "meaning": "A sudden, intuitive perception of or insight into the reality or essential meaning of something.",
        "sentences": ["While walking in the park, she had an epiphany that solved her math problem."],
        "vocabulary_question": "Is an ████████ a slow, boring process or a sudden 'lightbulb' moment of realization?"
    },
    {
        "word": "episcopal",
        "meaning": "Relating to or denoted by a bishop.",
        "sentences": ["The church is governed by an episcopal system of leadership."],
        "vocabulary_question": "Does the word █████████ relate to a group of scientists or a bishop?"
    },
    {
        "word": "epistaxis",
        "meaning": "The medical term for a nosebleed.",
        "sentences": ["He applied pressure to his nose to stop the epistaxis after the dry weather."],
        "vocabulary_question": "Is █████████ a term for a headache or a nosebleed?"
    },
    {
        "word": "epithet",
        "meaning": "A descriptive phrase expressing a quality characteristic of the person or thing mentioned.",
        "sentences": ["'The Great' is a famous epithet used for King Alexander."],
        "vocabulary_question": "Is an ███████ a type of tool or a descriptive nickname?"
    },
    {
        "word": "epoch",
        "meaning": "A particular period of time in history or a person's life.",
        "sentences": ["The invention of the steam engine marked a new epoch in human history."],
        "vocabulary_question": "Is an █████ a tiny second of time or a major historical period?"
    },
    {
        "word": "equinox",
        "meaning": "The time or date (twice each year) at which the sun crosses the celestial equator, when day and night are of equal length.",
        "sentences": ["The spring equinox usually happens around March 20th."],
        "vocabulary_question": "During an ███████, is the night much longer than the day or are they about equal?"
    },
    {
        "word": "equivalent",
        "meaning": "Equal in value, amount, function, or meaning.",
        "sentences": ["Twelve inches is equivalent to one foot."],
        "vocabulary_question": "If two things are ██████████, are they completely different or equal to each other?"
    },
    {
        "word": "equivocate",
        "meaning": "To use ambiguous language so as to conceal the truth or avoid committing oneself.",
        "sentences": ["The politician tried to equivocate when asked a direct question about the new law."],
        "vocabulary_question": "If you ██████████, are you being perfectly clear or being intentionally vague?"
    },
    {
        "word": "eradicate",
        "meaning": "To fully destroy; to get rid of completely.",
        "sentences": ["The scientists worked for years to eradicate the disease from the region."],
        "vocabulary_question": "When you █████████ something, are you helping it grow or removing it completely?"
    },
    {
        "word": "ergo",
        "meaning": "Therefore.",
        "sentences": ["The ground is wet; ergo, it must have rained."],
        "vocabulary_question": "Does the word ████ mean 'because' or 'therefore'?"
    },
    {
        "word": "ermine",
        "meaning": "A short-tailed weasel whose winter coat is white with a black-tipped tail.",
        "sentences": ["The king wore a robe trimmed with the soft white fur of an ermine."],
        "vocabulary_question": "Is an ██████ a type of weasel or a type of fruit?"
    },
    {
        "word": "errata",
        "meaning": "A list of corrected errors appended to a book or published subsequently.",
        "sentences": ["The textbook included an errata sheet to fix the typos in the first chapter."],
        "vocabulary_question": "Is an ██████ a list of mistakes and their corrections or a list of characters?"
    },
    {
        "word": "erroneous",
        "meaning": "Wrong; incorrect.",
        "sentences": ["The news report was based on erroneous information and had to be corrected."],
        "vocabulary_question": "If a statement is █████████, is it factually correct or incorrect?"
    },
    {
        "word": "erstwhile",
        "meaning": "Former.",
        "sentences": ["The erstwhile captain of the team returned to cheer for his friends."],
        "vocabulary_question": "Does █████████ mean 'future' or 'former'?"
    },
    {
        "word": "erubescent",
        "meaning": "Reddening or blushing.",
        "sentences": ["The sunset left an erubescent glow across the evening sky."],
        "vocabulary_question": "Does ██████████ describe something turning blue or something turning red?"
    },
    {
        "word": "eructation",
        "meaning": "The act or an instance of belching.",
        "sentences": ["The giant's loud eructation echoed through the mountain cave."],
        "vocabulary_question": "Is an ██████████ a sneeze or a belch?"
    },
    {
        "word": "escarpment",
        "meaning": "A long, steep slope, especially one at the edge of a plateau or separating areas of land at different heights.",
        "sentences": ["The hikers climbed the rocky escarpment to see the view from the top."],
        "vocabulary_question": "Is an ██████████ a flat meadow or a steep cliff-like slope?"
    },
    {
        "word": "eschew",
        "meaning": "To deliberately avoid using; abstain from.",
        "sentences": ["A healthy athlete might choose to eschew sugary snacks before a big game."],
        "vocabulary_question": "If you ██████ something, are you seeking it out or avoiding it?"
    },
    {
        "word": "espousal",
        "meaning": "The act of adopting or supporting a cause, belief, or way of life.",
        "sentences": ["Her espousal of environmental causes led her to start a recycling club."],
        "vocabulary_question": "Does █████████ involve supporting an idea or working against it?"
    },
    {
        "word": "étude",
        "meaning": "A piece of music intended for study or exercise.",
        "sentences": ["The pianist practiced the difficult étude for hours to improve her finger speed."],
        "vocabulary_question": "Is an █████ a simple warm-up exercise or a type of heavy winter coat?"
    },
    {
        "word": "etymological",
        "meaning": "Relating to the origin of words and the way in which their meanings have changed throughout history.",
        "sentences": ["Ava checked the etymological notes to see which language the word came from."],
        "vocabulary_question": "Does ████████████ relate to the study of words or the study of insects?"
    },
    {
        "word": "eucalyptus",
        "meaning": "An evergreen tree native to Australia, known for its aromatic leaves.",
        "sentences": ["The koalas spent most of their day eating the leaves of the eucalyptus tree."],
        "vocabulary_question": "Is ██████████ a type of tree or a type of rocky mountain?"
    },
    {
        "word": "eucrasia",
        "meaning": "A state of good health or physical well-being.",
        "sentences": ["A balanced diet and regular exercise can help maintain a state of eucrasia."],
        "vocabulary_question": "Does ████████ describe being very sick or being in good health?"
    },
    {
        "word": "euphonious",
        "meaning": "Pleasing to the ear.",
        "sentences": ["The songbirds filled the garden with their euphonious chirping."],
        "vocabulary_question": "Is a ██████████ sound harsh and annoying or sweet and pleasing?"
    },
    {
        "word": "Eurocentric",
        "meaning": "Focusing on European culture or history to the exclusion of a wider view of the world.",
        "sentences": ["The history textbook was criticized for being too Eurocentric and ignoring ancient Asian civilizations."],
        "vocabulary_question": "Does a ███████████ viewpoint focus on the whole world or primarily on Europe?"
    },
    {
        "word": "europium",
        "meaning": "A silvery-white metallic chemical element of the lanthanide series.",
        "sentences": ["Scientists use europium in the phosphorus of television screens to create red light."],
        "vocabulary_question": "Is █████████ a type of chemical element or a type of ancient city?"
    },
    {
        "word": "eustress",
        "meaning": "Moderate or normal psychological stress interpreted as being beneficial for the experiencer.",
        "sentences": ["The excitement before a big game is a form of eustress that can help an athlete perform better."],
        "vocabulary_question": "Is ████████ a type of stress that feels harmful or a type that can be helpful and motivating?"
    },
    {
        "word": "Evactor",
        "meaning": "A device or person that evacuates or removes something.",
        "sentences": ["The maintenance crew used a specialized evactor to clear the water from the basement."],
        "vocabulary_question": "Is an ███████ used to fill a container up or to empty it out?"
    },
    {
        "word": "evacuees",
        "meaning": "People who are evacuated from a place of danger.",
        "sentences": ["The local gym was set up as a shelter for the evacuees fleeing the forest fire."],
        "vocabulary_question": "Are ████████ families who are staying home or people who have moved to find safety?"
    },
    {
        "word": "evanescent",
        "meaning": "Soon passing out of sight, memory, or existence; quickly fading or disappearing.",
        "sentences": ["The rainbow was evanescent, disappearing as soon as the clouds covered the sun."],
        "vocabulary_question": "Does ██████████ describe something that lasts for a long time or something that fades quickly?"
    },
    {
        "word": "evo-devo",
        "meaning": "A field of biological research that compares the developmental processes of different organisms to infer the ancestral relationships between them.",
        "sentences": ["The scientist presented her research in the field of evo-devo at the biology conference."],
        "vocabulary_question": "Does ███-████ involve studying the history of life or the history of cars?"
    },
    {
        "word": "evzone",
        "meaning": "A member of a Greek elite infantry unit, known for their traditional uniform including a kilt.",
        "sentences": ["We watched the changing of the guard performed by an evzone at the Greek parliament."],
        "vocabulary_question": "Is an ██████ a member of a special military unit or a type of musical instrument?"
    },
    {
        "word": "ex libris",
        "meaning": "Used as an inscription on a bookplate to show the name of the owner of a book.",
        "sentences": ["The rare book featured a beautiful ex libris label showing it once belonged to a king."],
        "vocabulary_question": "Does an ██ ██████ label tell you who wrote the book or who owns the book?"
    },
    {
        "word": "exaugural",
        "meaning": "Relating to the end of a term of office.",
        "sentences": ["The president gave an exaugural address on his final day in the White House."],
        "vocabulary_question": "Does an █████████ speech happen at the beginning of a job or at the end?"
    },
    {
        "word": "excelsior",
        "meaning": "Softwood shavings used for packing or stuffing; or a motto meaning 'higher' or 'upward'.",
        "sentences": ["The fragile glass vase was packed in a box filled with excelsior to prevent it from breaking."],
        "vocabulary_question": "In packing, is █████████ a type of wood shavings or a type of heavy metal?"
    },
    {
        "word": "excision",
        "meaning": "The act of removing something by cutting.",
        "sentences": ["The surgeon performed a quick excision to remove the damaged tissue."],
        "vocabulary_question": "Does ████████ involve adding something new or cutting something out?"
    },
    {
        "word": "excoriate",
        "meaning": "To criticize severely; or to damage or remove part of the surface of the skin.",
        "sentences": ["The critic began to excoriate the director's latest film in his review."],
        "vocabulary_question": "When you █████████ someone, are you praising them or criticizing them very harshly?"
    },
    {
        "word": "execrable",
        "meaning": "Extremely bad or unpleasant.",
        "sentences": ["The food at the cafeteria was so execrable that nobody wanted to eat it."],
        "vocabulary_question": "Is an █████████ meal one that is delicious or one that is terrible?"
    },
    {
        "word": "exeunt",
        "meaning": "A stage direction used in a play to indicate that a group of characters leaves the stage.",
        "sentences": ["The script included the direction 'exeunt all' at the end of the second act."],
        "vocabulary_question": "Does ██████ mean that characters are entering the stage or leaving it?"
    },
    {
        "word": "exiguous",
        "meaning": "Very small in size or amount.",
        "sentences": ["The hikers had to survive on an exiguous amount of water for the final day."],
        "vocabulary_question": "Is an ████████ amount very large or very small?"
    },
    {
        "word": "existential",
        "meaning": "Relating to existence, especially human existence.",
        "sentences": ["The philosopher's book explored the existential questions of life and death."],
        "vocabulary_question": "Does an ███████████ question deal with the meaning of life or the rules of a game?"
    },
    {
        "word": "exodus",
        "meaning": "A mass departure of people, especially emigrants.",
        "sentences": ["The closing of the factory led to a mass exodus of workers from the town."],
        "vocabulary_question": "Is an ██████ a situation where many people are arriving or many people are leaving?"
    },
    {
        "word": "exogenous",
        "meaning": "Relating to or developing from external factors.",
        "sentences": ["The change in the plant's growth was due to exogenous factors like light and temperature."],
        "vocabulary_question": "Does █████████ describe something that comes from the inside or from the outside?"
    },
    {
        "word": "exorbitant",
        "meaning": "Of a price or amount charged: unreasonably high.",
        "sentences": ["The hotel charged an exorbitant price for a simple bottle of water."],
        "vocabulary_question": "Is an ██████████ price very cheap or very expensive?"
    },
    {
        "word": "expatiate",
        "meaning": "To speak or write at length or in detail about a subject.",
        "sentences": ["The professor began to expatiate on the history of the ancient ruins."],
        "vocabulary_question": "If you █████████ on a topic, are you giving a very brief summary or a long, detailed explanation?"
    },
    {
        "word": "expectorant",
        "meaning": "A medicine that promotes the secretion of sputum by the air passages, used especially to treat coughs.",
        "sentences": ["The doctor prescribed an expectorant to help clear the patient's chest congestion."],
        "vocabulary_question": "Is an ███████████ used to help clear a cough or to stop an itch?"
    },
    {
        "word": "expediency",
        "meaning": "The quality of being convenient and practical despite possibly being improper.",
        "sentences": ["The decision was based on political expediency rather than what was truly right."],
        "vocabulary_question": "Does ██████████ describe doing something because it is the most right or because it is the most convenient?"
    },
    {
        "word": "exposé",
        "meaning": "A report of a movie or piece of writing that reveals something discreditable.",
        "sentences": ["The newspaper published an exposé revealing the truth about the company's secrets."],
        "vocabulary_question": "Is an ██████ a report that keeps a secret or one that reveals the truth?"
    },
    {
        "word": "exposition",
        "meaning": "A comprehensive description and explanation of an idea or theory.",
        "sentences": ["The first chapter of the book provides a clear exposition of the main characters and setting."],
        "vocabulary_question": "Is an ██████████ a type of detailed explanation or a type of secret code?"
    },
    {
        "word": "expostulate",
        "meaning": "To express strong disapproval or disagreement.",
        "sentences": ["The students tried to expostulate with the teacher about the difficult homework."],
        "vocabulary_question": "When you ███████████, are you agreeing with someone or arguing against them?"
    },
    {
        "word": "expugnable",
        "meaning": "Capable of being taken by assault; vulnerable.",
        "sentences": ["The old fortress was unfortunately expugnable because of its crumbling walls."],
        "vocabulary_question": "Is an ██████████ wall one that is very strong or one that can be easily captured?"
    },
    {
        "word": "expunge",
        "meaning": "To erase or remove completely something unwanted or unpleasant.",
        "sentences": ["The lawyer worked to expunge the mistake from the official record."],
        "vocabulary_question": "When you ███████ something, are you keeping it or removing it completely?"
    },
    {
        "word": "extant",
        "meaning": "Still in existence; surviving.",
        "sentences": ["There are only a few extant copies of the very first edition of the book."],
        "vocabulary_question": "Does the word ██████ describe something that is extinct or something that still exists?"
    },
    {
        "word": "extemporaneous",
        "meaning": "Spoken or done without preparation.",
        "sentences": ["The student gave an impressive extemporaneous speech when the original speaker didn't show up."],
        "vocabulary_question": "Is an ██████████████ speech one that was written weeks ago or one done on the spot?"
    },
    {
        "word": "extenuating",
        "meaning": "Serving to make a fault or offense seem less serious or more forgivable.",
        "sentences": ["The judge considered the extenuating circumstances before deciding on a fair punishment."],
        "vocabulary_question": "Do ███████████ factors make a mistake seem worse or easier to forgive?"
    },
    {
        "word": "extravasate",
        "meaning": "To let out or force out a fluid (such as blood) from its proper vessel into the surrounding body tissue.",
        "sentences": ["The medical team monitored the IV site to ensure the medicine did not extravasate into the skin."],
        "vocabulary_question": "When a fluid begins to ███████████, is it staying inside its container or leaking out?"
    },
    {
        "word": "extrorse",
        "meaning": "Facing or opening outward; used especially in botany to describe anthers.",
        "sentences": ["The botanist noted that the flower had extrorse anthers that released pollen away from the center."],
        "vocabulary_question": "Does the word ████████ describe something that is facing inward or facing outward?"
    },
    {
        "word": "facetious",
        "meaning": "Treating serious issues with deliberately inappropriate humor; flippant.",
        "sentences": ["Stop being facetious and pay attention; this is a serious meeting."],
        "vocabulary_question": "If someone is being █████████, are they being very serious or joking at the wrong time?"
    },
    {
        "word": "facile",
        "meaning": "Appearing neat and comprehensive only by ignoring the true complexities of an issue; superficial.",
        "sentences": ["The politician offered a facile solution to a very complicated problem."],
        "vocabulary_question": "Is a ██████ explanation one that is deeply detailed or one that is too simple?"
    },
    {
        "word": "faconne",
        "meaning": "A fabric, typically silk or rayon, with a pattern woven into it.",
        "sentences": ["The designer chose a beautiful faconne silk for the evening gown."],
        "vocabulary_question": "Is ███████ a type of woven fabric or a type of stone tool?"
    },
    {
        "word": "factitious",
        "meaning": "Artificially created or developed.",
        "sentences": ["The excitement in the room felt factitious, as if the audience were being paid to cheer."],
        "vocabulary_question": "Is something ██████████ natural or artificially made up?"
    },
    {
        "word": "facundity",
        "meaning": "Eloquence or fluency in speaking.",
        "sentences": ["The lawyer was known for her facundity and ability to persuade any jury."],
        "vocabulary_question": "Does █████████ relate to how well someone speaks or how fast they run?"
    },
    {
        "word": "Fahrenheit",
        "meaning": "A scale of temperature on which water freezes at 32° and boils at 212°.",
        "sentences": ["In the United States, we usually measure the weather in degrees Fahrenheit."],
        "vocabulary_question": "On the ██████████ scale, is 100 degrees considered cold or very hot?"
    },
    {
        "word": "fajitas",
        "meaning": "A Mexican dish consisting of strips of spiced meat and vegetables, usually served in a tortilla.",
        "sentences": ["We ordered a plate of sizzling chicken fajitas to share."],
        "vocabulary_question": "Are ████████ a type of meat dish or a type of cold soup?"
    },
    {
        "word": "famulus",
        "meaning": "An assistant or servant, especially one working for a magician or scholar.",
        "sentences": ["The wizard's famulus spent the afternoon cleaning the library and organizing scrolls."],
        "vocabulary_question": "Is a ███████ a powerful leader or an assistant/servant?"
    },
    {
        "word": "fanchonette",
        "meaning": "A small tart or piece of puff pastry filled with cream or fruit and topped with meringue.",
        "sentences": ["The bakery window was filled with colorful, sweet fanchonette tarts."],
        "vocabulary_question": "Is a ███████████ something you would eat for dessert or wear as a hat?"
    },
    {
        "word": "fanega",
        "meaning": "A traditional Spanish unit of dry capacity, used especially for grain.",
        "sentences": ["The farmer measured his harvest of wheat in fanegas."],
        "vocabulary_question": "Is a ██████ a unit of measurement or a type of farm animal?"
    },
    {
        "word": "fang shih",
        "meaning": "A Chinese specialist in magic, astrology, or medicine; a 'recipe master'.",
        "sentences": ["The emperor consulted a fang shih for advice on his health and future."],
        "vocabulary_question": "Was a ████ ████ a type of ancient scholar/magician or a type of boat?"
    },
    {
        "word": "farcical",
        "meaning": "Of or resembling a farce, especially because of absurd or ridiculous aspects.",
        "sentences": ["The attempts to fix the broken sink became farcical when the plumber accidentally turned on the fountain."],
        "vocabulary_question": "Is a ████████ situation one that is very serious or one that is ridiculous and funny?"
    },
    {
        "word": "fardel",
        "meaning": "A bundle or burden.",
        "sentences": ["The traveler carried a heavy fardel of supplies on his back."],
        "vocabulary_question": "Is a ██████ a light feather or a heavy bundle/burden?"
    },
    {
        "word": "farkleberry",
        "meaning": "A shrub or small tree of the southeastern U.S. that produces small, black, inedible berries.",
        "sentences": ["The hikers spotted a farkleberry tree growing along the edge of the woods."],
        "vocabulary_question": "Is a ████████████ a type of plant or a type of musical instrument?"
    },
    {
        "word": "Farsi",
        "meaning": "The modern Persian language of Iran and western Afghanistan.",
        "sentences": ["She is learning to speak Farsi so she can talk to her grandparents in their native language."],
        "vocabulary_question": "Is █████ a type of language or a type of clothing?"
    },
    {
        "word": "farthingale",
        "meaning": "A hoop or structure worn under a skirt to expand it at the hips.",
        "sentences": ["Queen Elizabeth I was often painted wearing a wide, elaborate farthingale."],
        "vocabulary_question": "Is a ███████████ worn as a piece of jewelry or under a skirt?"
    },
    {
        "word": "fastuous",
        "meaning": "Haughty, arrogant, or ostentatious.",
        "sentences": ["The prince's fastuous behavior made him very unpopular with the local people."],
        "vocabulary_question": "Is a ████████ person very humble or very arrogant and showy?"
    },
    {
        "word": "fatuously",
        "meaning": "In a foolish or silly way.",
        "sentences": ["He smiled fatuously, not realizing that everyone was waiting for his serious answer."],
        "vocabulary_question": "If you act █████████, are you being very wise or very silly and foolish?"
    },
    {
        "word": "faun",
        "meaning": "A mythological creature that is half-human and half-goat.",
        "sentences": ["Mr. Tumnus from the Narnia books is a famous faun."],
        "vocabulary_question": "Is a ████ half-human and half-goat or half-human and half-fish?"
    },
    {
        "word": "fealty",
        "meaning": "Formal acknowledgement of loyalty to a lord.",
        "sentences": ["The knight swore an oath of fealty to his king."],
        "vocabulary_question": "Does ██████ mean a feeling of hatred or a promise of loyalty?"
    },
    {
        "word": "feckless",
        "meaning": "Lacking initiative or strength of character; irresponsible.",
        "sentences": ["The feckless employee often forgot to show up for work on time."],
        "vocabulary_question": "Is a ████████ person very responsible or very irresponsible?"
    },
    {
        "word": "fecund",
        "meaning": "Notable for productivity of thought and invention; fertile.",
        "sentences": ["The artist's fecund imagination allowed her to create hundreds of new paintings."],
        "vocabulary_question": "Does ██████ describe a mind that is empty or one that is full of new ideas?"
    },
    {
        "word": "feign",
        "meaning": "To pretend to be affected by a feeling, state, or injury.",
        "sentences": ["He tried to feign a stomachache so he wouldn't have to go to the party."],
        "vocabulary_question": "When you █████ an illness, are you really sick or are you pretending?"
    },
    {
        "word": "fenestrated",
        "meaning": "Having windows or window-like openings.",
        "sentences": ["The modern office building had a beautiful fenestrated wall that let in plenty of light."],
        "vocabulary_question": "Does a ████████████ wall have many windows or no windows at all?"
    },
    {
        "word": "fenster",
        "meaning": "A geologic window; an opening in a rock layer.",
        "sentences": ["The geologist pointed out a fenster in the side of the mountain ridge."],
        "vocabulary_question": "Is a ███████ a type of bird or an opening in a rock layer?"
    },
    {
        "word": "feria",
        "meaning": "A local festival or fair in Spain or Latin America.",
        "sentences": ["The whole town gathered for the annual feria, with music, dancing, and food."],
        "vocabulary_question": "Is a █████ a type of quiet meeting or a lively festival/fair?"
    },
    {
        "word": "fervorous",
        "meaning": "Having or displaying a passionate intensity.",
        "sentences": ["The crowd gave a fervorous cheer when their team scored the winning goal."],
        "vocabulary_question": "Is a █████████ response very weak or very passionate and intense?"
    },
    {
        "word": "festooned",
        "meaning": "Adorned with decorations like chains of flowers or ribbons.",
        "sentences": ["The ballroom was festooned with colorful streamers for the graduation party."],
        "vocabulary_question": "If a room is █████████, is it completely bare or decorated with hanging items?"
    },
    {
        "word": "feudalism",
        "meaning": "The dominant social system in medieval Europe.",
        "sentences": ["Students learned how knights and lords were part of the system of feudalism."],
        "vocabulary_question": "Did ██████████ exist during ancient times, the middle ages, or modern times?"
    },
    {
        "word": "fiat",
        "meaning": "A formal authorization or proposition; an arbitrary order.",
        "sentences": ["The new rules were established by government fiat rather than by a vote."],
        "vocabulary_question": "Is a ████ a suggestion from a friend or a formal order from a leader?"
    },
    {
        "word": "fibula",
        "meaning": "The outer and usually smaller of the two bones between the knee and the ankle; or an ornamental brooch.",
        "sentences": ["The soccer player wore shin guards to protect both his tibia and his fibula."],
        "vocabulary_question": "Is the ██████ a bone found in the human leg or in the human arm?"
    },
    {
        "word": "fictile",
        "meaning": "Relating to pottery or molding; capable of being molded.",
        "sentences": ["The artist worked with a fictile clay that was easy to shape into a vase."],
        "vocabulary_question": "Does ██████ describe a material that is hard and brittle or one that can be molded?"
    },
    {
        "word": "fiduciary",
        "meaning": "Involving trust, especially with regard to the relationship between a trustee and a beneficiary.",
        "sentences": ["The bank has a fiduciary duty to manage the customer's money responsibly."],
        "vocabulary_question": "Is a █████████ relationship based on secret lies or on legal trust?"
    },
    {
        "word": "finial",
        "meaning": "A distinctive ornament at the apex of a roof, pinnacle, canopy, or similar structure.",
        "sentences": ["The top of the flag pole was decorated with a polished gold finial."],
        "vocabulary_question": "Would you find a ██████ at the very top of a building or at the very bottom?"
    },
    {
        "word": "fipple",
        "meaning": "The mouthpiece of a recorder or similar wind instrument.",
        "sentences": ["The musician blew into the fipple of the wooden flute to produce a clear note."],
        "vocabulary_question": "Is a ██████ a part of a musical instrument or a type of kitchen tool?"
    },
    {
        "word": "firkin",
        "meaning": "A small wooden barrel or a unit of liquid volume equal to a quarter of a barrel.",
        "sentences": ["The old tavern stored its specialized cider in a small oak firkin."],
        "vocabulary_question": "Is a ██████ a type of large truck or a small wooden barrel?"
    },
    {
        "word": "fjeld",
        "meaning": "A barren rocky plateau found in high latitudes, especially in Scandinavia.",
        "sentences": ["The hikers trekked across the desolate Norwegian fjeld."],
        "vocabulary_question": "Is a █████ a lush tropical rainforest or a barren rocky plateau?"
    },
    {
        "word": "flagon",
        "meaning": "A large container in which drink is served, typically with a handle and spout.",
        "sentences": ["The server filled a heavy silver flagon with fresh apple juice."],
        "vocabulary_question": "Is a ██████ a container for liquids or a type of musical drum?"
    },
    {
        "word": "flambé",
        "meaning": "A food preparation where alcohol is added to a hot pan to create a burst of flames.",
        "sentences": ["The waiter prepared the dessert flambé right at our table."],
        "vocabulary_question": "Does a ██████ dish involve using fire during the cooking process?"
    },
    {
        "word": "flaneur",
        "meaning": "A person who saunters or strolls around without a specific destination; a loafer.",
        "sentences": ["He spent his Saturday as a flaneur, simply walking through the city streets and people-watching."],
        "vocabulary_question": "Is a ███████ a person running a fast race or someone strolling aimlessly?"
    },
    {
        "word": "flauta",
        "meaning": "A Mexican dish consisting of a small flour tortilla rolled around a savory filling and deep-fried.",
        "sentences": ["I ordered a plate of crispy beef flauta topped with spicy salsa."],
        "vocabulary_question": "Is a ██████ a type of fried tortilla dish or a type of dessert pastry?"
    },
    {
        "word": "flavedo",
        "meaning": "The colored outer layer of the rind of a citrus fruit.",
        "sentences": ["The chef used a zester to remove the aromatic flavedo from the lemon."],
        "vocabulary_question": "Is the ██████ the white bitter part of an orange or the bright orange outer skin?"
    },
    {
        "word": "flèche",
        "meaning": "A slender spire above the intersection of the nave and transepts of a church; or a move in fencing.",
        "sentences": ["The cathedral's roof was topped with a beautiful, narrow flèche."],
        "vocabulary_question": "Is a ██████ a type of tall, thin spire or a type of heavy stone floor?"
    },
    {
        "word": "flittern",
        "meaning": "Relating to or made from the bark of young oak trees.",
        "sentences": ["The workers collected flittern bark to be used in the tanning process."],
        "vocabulary_question": "Does ████████ relate to the bark of young oak trees or the leaves of pine trees?"
    },
    {
        "word": "Florentine",
        "meaning": "Relating to the city of Florence in Italy; or a dish served with spinach.",
        "sentences": ["We ordered the eggs Florentine, which came served over a bed of sautéed spinach."],
        "vocabulary_question": "If a meal is served ██████████, what green vegetable does it usually contain?"
    },
    {
        "word": "floribunda",
        "meaning": "A type of rose that produces many flowers in large clusters.",
        "sentences": ["The garden was filled with the bright pink blossoms of the floribunda rose bush."],
        "vocabulary_question": "Does a ██████████ plant produce only one flower at a time or many clusters of flowers?"
    },
    {
        "word": "floruit",
        "meaning": "The period during which a person was at their peak or was particularly active.",
        "sentences": ["The philosopher's floruit was during the middle of the fifth century."],
        "vocabulary_question": "Does ███████ describe a person's childhood or the time when they were most successful?"
    },
    {
        "word": "FLOTUS",
        "meaning": "An acronym for First Lady of the United States.",
        "sentences": ["The news report covered the latest educational initiative launched by the FLOTUS."],
        "vocabulary_question": "Does the acronym ██████ refer to the President or the First Lady of the U.S.?"
    },
    {
        "word": "fluoride",
        "meaning": "A chemical compound that is often added to drinking water and toothpaste to prevent tooth decay.",
        "sentences": ["Brushing your teeth with toothpaste that contains fluoride helps keep your enamel strong."],
        "vocabulary_question": "Is ████████ a substance used to help clean teeth or a type of sugar?"
    },
    {
        "word": "focaccia",
        "meaning": "A flat Italian bread seasoned with olive oil and herbs.",
        "sentences": ["The restaurant served warm rosemary focaccia with a side of olive oil for dipping."],
        "vocabulary_question": "Is ████████ a type of Italian bread or a type of spicy meat?"
    },
    {
        "word": "follicle",
        "meaning": "A small secretory cavity, sac, or gland, such as the one that a hair grows from.",
        "sentences": ["Healthy hair begins deep inside the hair follicle under the surface of the skin."],
        "vocabulary_question": "Is a ████████ where a hair grows from or a part of the human eye?"
    },
    {
        "word": "fontina",
        "meaning": "A semi-soft Italian cow's milk cheese.",
        "sentences": ["She used melted fontina cheese to make the sauce for the pasta."],
        "vocabulary_question": "Is ████████ a type of Italian cheese or a type of spicy fruit?"
    },
    {
        "word": "forbivorous",
        "meaning": "Feeding on forbs (broad-leaved herbs other than grasses).",
        "sentences": ["The scientists studied the diet of the local forbivorous animals in the meadow."],
        "vocabulary_question": "Does a ███████████ animal eat primarily meat or primarily broad-leaved plants?"
    },
    {
        "word": "fortissimo",
        "meaning": "A musical direction meaning very loud.",
        "sentences": ["The conductor signaled for the brass section to play the final chords fortissimo."],
        "vocabulary_question": "If a song is played ██████████, is it a quiet whisper or very loud?"
    },
    {
        "word": "fractur",
        "meaning": "A style of black-letter type or calligraphy; or traditional Pennsylvania Dutch folk art.",
        "sentences": ["The antique birth certificate was written in beautiful, ornate fractur script."],
        "vocabulary_question": "Is ███████ a style of calligraphy or a type of construction tool?"
    },
    {
        "word": "Franciscan",
        "meaning": "A member of a Christian religious order founded by St. Francis of Assisi.",
        "sentences": ["The Franciscan monks are known for their dedication to helping the poor."],
        "vocabulary_question": "Is a ██████████ a member of a religious order or a type of scientist?"
    },
    {
        "word": "frappé",
        "meaning": "An iced beverage that has been shaken, blended or beaten to produce a foamy drink.",
        "sentences": ["On a hot summer day, she ordered a cold coffee frappé topped with whipped cream."],
        "vocabulary_question": "Is a ██████ a hot steaming soup or a cold foamy drink?"
    },
    {
        "word": "frass",
        "meaning": "The excrement of insect larvae; or the wood dust produced by wood-boring insects.",
        "sentences": ["The gardener looked for frass on the leaves to see if there were caterpillars nearby."],
        "vocabulary_question": "Is █████ a type of garden fertilizer or waste produced by insects?"
    },
    {
        "word": "fratority",
        "meaning": "A social organization for both men and women (a combination of fraternity and sorority).",
        "sentences": ["The university established a new fratority to welcome all students regardless of gender."],
        "vocabulary_question": "Is a █████████ an organization for only one gender or for both?"
    },
    {
        "word": "fraudulent",
        "meaning": "Obtained, done by, or involving deception, especially criminal deception.",
        "sentences": ["The bank warned customers to be on the lookout for fraudulent emails asking for passwords."],
        "vocabulary_question": "Is a ███████████ action honest and fair or based on deception and lies?"
    },
    {
        "word": "fravashi",
        "meaning": "In Zoroastrianism, the spirit of an individual, which is believed to exist before birth and after death.",
        "sentences": ["The ancient texts describe the fravashi as a protective spirit that guides the soul."],
        "vocabulary_question": "In Zoroastrian belief, is a ████████ a physical object or a spiritual being?"
    },
    {
        "word": "frazil",
        "meaning": "Ice crystals formed in turbulent water, such as in a fast-moving river.",
        "sentences": ["The freezing river was filled with frazil, making it look like a slushy mixture."],
        "vocabulary_question": "Does ██████ describe ice that forms in calm ponds or in turbulent, moving water?"
    },
    {
        "word": "Freudian",
        "meaning": "Relating to the theories of Sigmund Freud, especially regarding the unconscious mind.",
        "sentences": ["The psychologist offered a Freudian explanation for why he had such a strange dream."],
        "vocabulary_question": "Does a ████████ analysis focus on a person's surface thoughts or their unconscious mind?"
    },
    {
        "word": "frison",
        "meaning": "Waste silk produced during the process of reeling silk from cocoons.",
        "sentences": ["The workers collected the frison to be used in making lower-quality thread."],
        "vocabulary_question": "Is ██████ the high-quality silk used for dresses or the waste silk left over?"
    },
    {
        "word": "fritillary",
        "meaning": "A type of plant with bell-shaped flowers, or a type of butterfly with spotted wings.",
        "sentences": ["We spotted a beautiful orange and black fritillary butterfly in the meadow."],
        "vocabulary_question": "Is a ██████████ a type of animal or a type of plant (or both)?"
    },
    {
        "word": "frittata",
        "meaning": "An Italian dish made with eggs, similar to an omelet but unfolded and often filled with vegetables or meat.",
        "sentences": ["For brunch, we shared a vegetable frittata filled with spinach and goat cheese."],
        "vocabulary_question": "Is a ████████ folded like a traditional omelet or served as a flat, open dish?"
    },
    {
        "word": "froward",
        "meaning": "Difficult to deal with; habitually disobedient or contrary.",
        "sentences": ["The froward child refused to follow the rules of the game."],
        "vocabulary_question": "Is a ███████ person usually very helpful or very difficult and stubborn?"
    },
    {
        "word": "fructiferous",
        "meaning": "Bearing or producing fruit.",
        "sentences": ["The fructiferous trees in the garden were heavy with ripe apples."],
        "vocabulary_question": "Does a █████████████ plant produce fruit or just leaves?"
    },
    {
        "word": "frugivore",
        "meaning": "An animal that feeds primarily on fruit.",
        "sentences": ["Many species of bats and monkeys are considered frugivores because they eat so much fruit."],
        "vocabulary_question": "Does a █████████ eat mostly meat or mostly fruit?"
    },
    {
        "word": "fucoid",
        "meaning": "Relating to or resembling a type of brown seaweed.",
        "sentences": ["The beach was littered with fucoid remains after the winter storm."],
        "vocabulary_question": "Does the word ██████ relate to things found in a desert or things found in the ocean?"
    },
    {
        "word": "fugue",
        "meaning": "A complex musical composition; or a state of loss of identity in psychology.",
        "sentences": ["The organist performed a grand fugue by Johann Sebastian Bach."],
        "vocabulary_question": "Is a █████ a type of simple children's song or a complex musical piece?"
    },
    {
        "word": "fulmar",
        "meaning": "A heavy-bodied seabird of the petrel family, found in northern oceans.",
        "sentences": ["The arctic fulmar nested on the high, rocky cliffs overlooking the sea."],
        "vocabulary_question": "Is a ██████ a type of forest bird or a type of seabird?"
    },
    {
        "word": "fulminate",
        "meaning": "To express vehement protest; or to explode violently.",
        "sentences": ["The angry neighbors began to fulminate against the noisy construction project."],
        "vocabulary_question": "When you █████████ against something, are you agreeing with it or protesting loudly?"
    },
    {
        "word": "funambulist",
        "meaning": "A tightrope walker.",
        "sentences": ["The audience held its breath as the funambulist crossed the high wire without a net."],
        "vocabulary_question": "Does a ████████████ walk on the ground or on a high tightrope?"
    },
    {
        "word": "fungible",
        "meaning": "Replaceable by another identical item; mutually interchangeable.",
        "sentences": ["A ten-dollar bill is fungible because you can trade it for another ten-dollar bill."],
        "vocabulary_question": "Are ████████ items unique and one-of-a-kind or easily replaced by something identical?"
    },
    {
        "word": "furcula",
        "meaning": "The wishbone of a bird, formed by the fusion of the two clavicles.",
        "sentences": ["After the turkey dinner, the children made a wish on the furcula."],
        "vocabulary_question": "Is the ███████ a part of a bird's skeleton or a part of its wing feathers?"
    },
    {
        "word": "fusiform",
        "meaning": "Spindle-shaped; tapering at both ends.",
        "sentences": ["The shark has a fusiform body that allows it to swim quickly through the water."],
        "vocabulary_question": "Is a ████████ shape wide and flat or tapered at both ends like a spindle?"
    },
    {
        "word": "fussbudget",
        "meaning": "A person who fusses over small, unimportant things.",
        "sentences": ["Don't be such a fussbudget; it doesn't matter if the napkins aren't perfectly straight."],
        "vocabulary_question": "Is a ██████████ someone who is very relaxed or someone who worries about tiny details?"
    },
    {
        "word": "gaiters",
        "meaning": "Garments similar to leggings, worn over the shoe and lower leg.",
        "sentences": ["The hikers wore waterproof gaiters to keep mud and snow out of their boots."],
        "vocabulary_question": "Are ███████ worn on the hands like gloves or over the lower legs and shoes?"
    },
    {
        "word": "galapago",
        "meaning": "A tortoise, specifically one of the giant tortoises of the Galápagos Islands.",
        "sentences": ["The scientist marveled at the size of the ancient galapago resting in the shade."],
        "vocabulary_question": "Is a ████████ a type of giant tortoise or a type of small lizard?"
    },
    {
        "word": "gallbladder",
        "meaning": "A small organ beneath the liver, in which bile is stored after secretion by the liver.",
        "sentences": ["The doctor explained that the gallbladder helps the body digest fats."],
        "vocabulary_question": "Is the ███████████ an organ involved in digestion or a part of the skeletal system?"
    },
    {
        "word": "Gallic",
        "meaning": "Relating to ancient Gaul or modern France.",
        "sentences": ["The museum featured a collection of Gallic coins from the time of the Roman Empire."],
        "vocabulary_question": "Does the word ██████ relate to the history of France or the history of Egypt?"
    },
    {
        "word": "gambeson",
        "meaning": "A padded defensive jacket worn as armor or inside armor.",
        "sentences": ["The knight wore a thick linen gambeson to protect himself from the weight of his mail."],
        "vocabulary_question": "Is a ████████ a type of padded armor or a type of musical instrument?"
    },
    {
        "word": "gambit",
        "meaning": "A calculated move, maneuver, or device; or an opening move in chess involving a sacrifice.",
        "sentences": ["The CEO’s latest business gambit was a risky but clever move to gain more customers."],
        "vocabulary_question": "Is a ██████ a random accident or a carefully calculated move?"
    },
    {
        "word": "ganache",
        "meaning": "A whipped filling of chocolate and cream, used in desserts like truffles.",
        "sentences": ["The baker covered the cake in a rich, shiny chocolate ganache."],
        "vocabulary_question": "Is ███████ used to make sweet desserts or savory soups?"
    },
    {
        "word": "garret",
        "meaning": "A top-floor or attic room, especially a small dismal one.",
        "sentences": ["The struggling artist lived in a tiny, drafty garret at the top of the old building."],
        "vocabulary_question": "Is a ██████ located in the basement or at the very top of a house?"
    },
    {
        "word": "gaseous",
        "meaning": "Relating to or having the characteristics of a gas.",
        "sentences": ["The giant planet Jupiter is primarily composed of gaseous hydrogen and helium."],
        "vocabulary_question": "Does ███████ describe something that is solid like a rock or airy like a gas?"
    },
    {
        "word": "gasiform",
        "meaning": "Having the form or nature of a gas.",
        "sentences": ["The substance turned into a gasiform state when it reached the boiling point."],
        "vocabulary_question": "Is a ████████ substance more like a liquid or more like a gas?"
    },
    {
        "word": "gastronome",
        "meaning": "A person who is knowledgeable about good food and drink; a gourmet.",
        "sentences": ["As a true gastronome, he traveled the world just to try famous local dishes."],
        "vocabulary_question": "Is a ██████████ an expert in food or an expert in stars and planets?"
    },
    {
        "word": "gaudery",
        "meaning": "Bright or showy things; flashy finery.",
        "sentences": ["The festival was filled with colorful banners and other types of gaudery."],
        "vocabulary_question": "Does ███████ describe simple, plain items or bright, flashy decorations?"
    },
    {
        "word": "gaur",
        "meaning": "A large, dark-coated wild ox of Southeast Asia.",
        "sentences": ["The gaur is the largest species of wild cattle in the world."],
        "vocabulary_question": "Is a ████ a type of large wild ox or a type of small forest bird?"
    },
    {
        "word": "gelatinous",
        "meaning": "Having a jelly-like consistency.",
        "sentences": ["The jellyfish had a soft, gelatinous body that floated gracefully in the water."],
        "vocabulary_question": "Is a ██████████ substance hard and crunchy or soft and jelly-like?"
    },
    {
        "word": "Gemara",
        "meaning": "A rabbinical commentary on the Mishnah, forming the second part of the Talmud.",
        "sentences": ["The students spent the morning studying the Gemara with their teacher."],
        "vocabulary_question": "Is the ██████ a type of religious text or a type of scientific manual?"
    },
    {
        "word": "Gemini",
        "meaning": "A constellation and a sign of the zodiac, represented by twins.",
        "sentences": ["According to the star chart, Gemini is visible in the winter sky."],
        "vocabulary_question": "Is ██████ represented by a lion or by twins?"
    },
    {
        "word": "genealogical",
        "meaning": "Relating to the study or investigation of ancestry and family histories.",
        "sentences": ["He used a genealogical website to trace his family tree back five generations."],
        "vocabulary_question": "Does a ████████████ search focus on family history or on the weather?"
    },
    {
        "word": "geniture",
        "meaning": "The act of begetting; birth.",
        "sentences": ["The ancient scrolls recorded the time and place of the prince's geniture."],
        "vocabulary_question": "Does the word ████████ relate to birth or to an ending?"
    },
    {
        "word": "genome",
        "meaning": "The complete set of genes or genetic material present in a cell or organism.",
        "sentences": ["Scientists worked for years to map the entire human genome."],
        "vocabulary_question": "Is a ██████ a map of an organism's genetic material or a map of a city?"
    },
    {
        "word": "geocaching",
        "meaning": "The recreational activity of hunting for and finding a hidden object by means of GPS coordinates.",
        "sentences": ["We went geocaching in the park and found a small hidden container near the old oak tree."],
        "vocabulary_question": "Does ██████████ involve using a computer game or using GPS to find hidden items outdoors?"
    },
    {
        "word": "geriatric",
        "meaning": "Relating to elderly people or the process of aging.",
        "sentences": ["The hospital opened a new geriatric ward to provide better care for older patients."],
        "vocabulary_question": "Does █████████ relate to caring for infants or caring for elderly people?"
    },
    {
        "word": "germane",
        "meaning": "Relevant to a subject under consideration.",
        "sentences": ["Please keep your comments germane to the topic we are discussing."],
        "vocabulary_question": "Is a ███████ comment one that is completely off-topic or one that is relevant?"
    },
    {
        "word": "gibbous",
        "meaning": "Having the observable illuminated part greater than a semicircle and less than a circle (of the moon).",
        "sentences": ["The moon looked large and bright in its gibbous phase last night."],
        "vocabulary_question": "Is a ███████ moon a thin crescent or a moon that is nearly full?"
    },
    {
        "word": "gingivitis",
        "meaning": "Inflammation of the gums.",
        "sentences": ["Brushing and flossing daily can help prevent the development of gingivitis."],
        "vocabulary_question": "Does ██████████ affect the health of your eyes or the health of your gums?"
    },
    {
        "word": "gladiatorial",
        "meaning": "Relating to gladiators or intense, ruthless combat.",
        "sentences": ["The crowd cheered during the gladiatorial games in the ancient Roman Colosseum."],
        "vocabulary_question": "Does █████████████ relate to peaceful gardening or to intense combat?"
    },
    {
        "word": "glazier",
        "meaning": "A person whose profession is fitting glass into windows and doors.",
        "sentences": ["We called a glazier to come and replace the broken pane in our front door."],
        "vocabulary_question": "Does a ███████ work with wood, stone, or glass?"
    },
    {
        "word": "glial",
        "meaning": "Relating to glia, the supportive tissue of the nervous system.",
        "sentences": ["Glial cells provide support and protection for the neurons in the brain."],
        "vocabulary_question": "Are █████ cells found in the nervous system or in the digestive system?"
    },
    {
        "word": "glissando",
        "meaning": "A continuous slide upward or downward between two notes in music.",
        "sentences": ["The harpist ended the piece with a beautiful, sweeping glissando."],
        "vocabulary_question": "Is a █████████ a single short note or a sliding sound between notes?"
    },
    {
        "word": "glossolalia",
        "meaning": "The phenomenon of speaking in an unknown language, especially during religious worship.",
        "sentences": ["The researcher studied the practice of glossolalia in different cultures."],
        "vocabulary_question": "Does ███████████ involve speaking in a known language or an unknown/spiritual language?"
    },
    {
        "word": "gluttonous",
        "meaning": "Excessively greedy in eating.",
        "sentences": ["The gluttonous squirrel tried to stuff ten nuts into its mouth at the same time."],
        "vocabulary_question": "Is a ██████████ person very careful with their food or very greedy?"
    },
    {
        "word": "gnathic",
        "meaning": "Relating to the jaw.",
        "sentences": ["The surgeon specialized in gnathic reconstruction to help patients with jaw injuries."],
        "vocabulary_question": "Does the word ███████ relate to the jaw or to the kneecap?"
    },
    {
        "word": "gnocchi",
        "meaning": "Small Italian dumplings, typically made from potato, flour, or semolina.",
        "sentences": ["We enjoyed a bowl of soft gnocchi tossed in a simple sage and butter sauce."],
        "vocabulary_question": "Is ███████ a type of Italian dumpling or a type of spicy sausage?"
    },
    {
        "word": "Gnostic",
        "meaning": "Relating to knowledge, especially esoteric spiritual knowledge held by certain ancient sects.",
        "sentences": ["The historian studied ancient Gnostic texts to understand early religious beliefs."],
        "vocabulary_question": "Does being ███████ relate to possessing secret knowledge or to physical strength?"
    },
    {
        "word": "gnotobiotic",
        "meaning": "Relating to an environment in which all the living forms present are known.",
        "sentences": ["Scientists use gnotobiotic chambers to study how specific bacteria affect health."],
        "vocabulary_question": "In a ███████████ environment, are the microbes unknown or carefully controlled and known?"
    },
    {
        "word": "goji berry",
        "meaning": "A bright red, edible berry that is often dried and considered a superfruit.",
        "sentences": ["She added a handful of dried goji berry to her morning bowl of oatmeal."],
        "vocabulary_question": "Is a ████ █████ a type of small red fruit or a type of large green vegetable?"
    },
    {
        "word": "golem",
        "meaning": "An artificial, humanlike figure in some Jewish traditions that is endowed with life.",
        "sentences": ["The legend of the Golem of Prague tells of a clay figure brought to life to protect the city."],
        "vocabulary_question": "Is a █████ a naturally born human or a figure created artificially and given life?"
    },
    {
        "word": "Goliath",
        "meaning": "A person or thing of enormous size or power; a giant.",
        "sentences": ["The tiny startup felt like it was fighting a Goliath when it competed with the tech giant."],
        "vocabulary_question": "Does the name ███████ represent something very small or something of enormous power and size?"
    },
    {
        "word": "gossamer",
        "meaning": "Used to refer to something very light, thin, and insubstantial or delicate.",
        "sentences": ["The morning dew clung to the gossamer threads of a spider's web."],
        "vocabulary_question": "Is ████████ a word for something heavy and thick or light and delicate?"
    },
    {
        "word": "Gothamite",
        "meaning": "A person who lives in or comes from New York City (often called Gotham).",
        "sentences": ["As a lifelong Gothamite, he knew the subway system better than anyone."],
        "vocabulary_question": "Is a █████████ a resident of New York City or a resident of London?"
    },
    {
        "word": "grande dame",
        "meaning": "A woman of influential status within a particular sphere.",
        "sentences": ["The actress was considered the grande dame of the theater after fifty years on stage."],
        "vocabulary_question": "Is a ██████ ████ an influential, respected woman or a young apprentice?"
    },
    {
        "word": "grandiloquent",
        "meaning": "Pompous or extravagant in language, style, or manner, especially in a way that is intended to impress.",
        "sentences": ["The politician's grandiloquent speech used many long words but didn't say very much."],
        "vocabulary_question": "Is a ████████████ speech simple and plain or pompous and extravagant?"
    },
    {
        "word": "grandrelle",
        "meaning": "A ply yarn made from two differently colored threads twisted together.",
        "sentences": ["The tailor used grandrelle thread to give the fabric a unique, speckled look."],
        "vocabulary_question": "Is ██████████ a type of twisted colorful yarn or a type of wooden needle?"
    },
    {
        "word": "graticule",
        "meaning": "A network of lines on a map or in the eyepiece of an optical instrument.",
        "sentences": ["The navigator checked the graticule on the map to find the exact coordinates."],
        "vocabulary_question": "Is a █████████ a network of lines or a type of musical song?"
    },
    {
        "word": "gravimetry",
        "meaning": "The measurement of weight or the strength of a gravitational field.",
        "sentences": ["Geologists use gravimetry to detect changes in the density of rocks underground."],
        "vocabulary_question": "Does ██████████ involve measuring gravity or measuring the speed of light?"
    },
    {
        "word": "gravitas",
        "meaning": "Dignity, seriousness, or solemnity of manner.",
        "sentences": ["The judge spoke with great gravitas when delivering the final verdict."],
        "vocabulary_question": "Does a person with ████████ act in a silly way or with great seriousness?"
    },
    {
        "word": "grazioso",
        "meaning": "A musical direction meaning graceful or elegant.",
        "sentences": ["The violinist played the second movement grazioso, as indicated in the score."],
        "vocabulary_question": "If music is played ████████, should it sound graceful or very harsh?"
    },
    {
        "word": "greaves",
        "meaning": "Armor for the legs below the knee.",
        "sentences": ["The ancient Greek warrior buckled his bronze greaves before going into battle."],
        "vocabulary_question": "Are ███████ used to protect the chest or the lower legs?"
    },
    {
        "word": "Gregorian",
        "meaning": "Relating to Pope Gregory, especially the calendar he introduced or the style of church chant.",
        "sentences": ["Most of the world today follows the Gregorian calendar to keep track of dates."],
        "vocabulary_question": "Does █████████ relate to a type of calendar or a type of garden flower?"
    },
    {
        "word": "gressorial",
        "meaning": "Adapted for walking, as the feet of certain birds.",
        "sentences": ["Unlike birds that hop, this species has gressorial feet designed for long walks."],
        "vocabulary_question": "Are ██████████ feet designed for swimming or for walking?"
    },
    {
        "word": "grissino",
        "meaning": "A thin, crisp breadstick of Italian origin.",
        "sentences": ["The waiter placed a basket of warm grissino on the table before the meal."],
        "vocabulary_question": "Is a ████████ a type of breadstick or a type of green vegetable?"
    },
    {
        "word": "groats",
        "meaning": "Hulled kernels of various cereal grains, such as oats or buckwheat.",
        "sentences": ["He bought a bag of whole buckwheat groats to make a healthy breakfast porridge."],
        "vocabulary_question": "Are ██████ kernels of grain or a type of small animal?"
    },
    {
        "word": "grobian",
        "meaning": "A coarse, rude, or clownish person.",
        "sentences": ["The dinner guest was a total grobian, shouting and eating with his hands."],
        "vocabulary_question": "Is a ███████ a very polite person or a rude and coarse person?"
    },
    {
        "word": "grotesqueness",
        "meaning": "The quality of being comically or repulsively ugly or distorted.",
        "sentences": ["The gargoyle on the old church was famous for its artistic grotesqueness."],
        "vocabulary_question": "Does █████████████ describe something beautiful or something distorted and ugly?"
    },
    {
        "word": "grouse",
        "meaning": "To complain typically with sustained grumbling.",
        "sentences": ["The hikers began to grouse about the steep hill and the heavy rain."],
        "vocabulary_question": "When you ██████, are you celebrating a victory or complaining and grumbling?"
    },
    {
        "word": "gubernatorial",
        "meaning": "Relating to a state governor or the office of governor.",
        "sentences": ["The candidates prepared for the upcoming gubernatorial debate."],
        "vocabulary_question": "Does ██████████████ relate to a governor or to a school principal?"
    },
    {
        "word": "gudgeon",
        "meaning": "A small freshwater fish; or a person who is easily fooled or cheated.",
        "sentences": ["The fisherman caught a tiny gudgeon in the shallows of the river."],
        "vocabulary_question": "Is a ███████ a type of fish or a type of large desert mammal?"
    },
    {
        "word": "guillotine",
        "meaning": "A machine with a heavy blade sliding vertically in grooves, used for beheading.",
        "sentences": ["The guillotine was a famous symbol of the French Revolution."],
        "vocabulary_question": "Is a ██████████ a tool used for writing or a machine for beheading?"
    },
    {
        "word": "gules",
        "meaning": "The color red in heraldry (coats of arms).",
        "sentences": ["The knight's shield featured a lion rampant on a field of gules."],
        "vocabulary_question": "In heraldry, does the word ██████ represent the color blue or the color red?"
    },
    {
        "word": "gullibility",
        "meaning": "A tendency to be easily persuaded that something is true; credulity.",
        "sentences": ["The scam artist relied on the gullibility of people who wanted to get rich quickly."],
        "vocabulary_question": "Does ███████████ mean being very suspicious or believing things too easily?"
    },
    {
        "word": "gumption",
        "meaning": "Shrewd or spirited initiative and resourcefulness.",
        "sentences": ["It took a lot of gumption for the young student to start her own business."],
        "vocabulary_question": "Does a person with ████████ have a lot of resourcefulness or a lot of laziness?"
    },
    {
        "word": "gyro",
        "meaning": "A Greek dish made of meat cooked on a vertical rotisserie, served in a pita with tomato, onion, and sauce.",
        "sentences": ["We stopped at the food truck for a delicious lamb gyro for lunch."],
        "vocabulary_question": "Is a ████ a type of sandwich from Greece or a type of Italian pasta?"
    },
    {
        "word": "habeas corpus",
        "meaning": "A legal writ requiring a person under arrest to be brought before a judge or into court, especially to secure their release.",
        "sentences": ["The lawyer filed for a writ of habeas corpus to ensure her client was not being held unlawfully."],
        "vocabulary_question": "Does ██████ ██████ relate to the right to a fair trial or the right to own a car?"
    },
    {
        "word": "habiliments",
        "meaning": "Clothing, especially for a particular profession or occasion.",
        "sentences": ["The knight donned his steel habiliments before the tournament began."],
        "vocabulary_question": "Are ███████████ a type of tool or another word for clothing and equipment?"
    },
    {
        "word": "hackneyed",
        "meaning": "Trite; commonplace; lacking significance through having been overused.",
        "sentences": ["The movie's plot was filled with hackneyed clichés we've seen a hundred times before."],
        "vocabulary_question": "Is a █████████ phrase one that is fresh and original or one that is overused and boring?"
    },
    {
        "word": "hadith",
        "meaning": "A collection of traditions containing sayings of the prophet Muhammad that constitute a major source of guidance for Muslims.",
        "sentences": ["Scholars spent years studying the authenticity of the ancient hadith."],
        "vocabulary_question": "Is a ██████ a type of religious tradition or a type of musical instrument?"
    },
    {
        "word": "hagiographer",
        "meaning": "A person who writes about the lives of saints.",
        "sentences": ["The medieval hagiographer traveled from monastery to monastery to record the legends of the saints."],
        "vocabulary_question": "Does a ████████████ write about the lives of saints or the history of modern technology?"
    },
    {
        "word": "halal",
        "meaning": "Denoting or relating to meat prepared as prescribed by Muslim law.",
        "sentences": ["The restaurant served a variety of delicious halal dishes for its customers."],
        "vocabulary_question": "Is █████ meat prepared according to specific religious laws or just any type of meat?"
    },
    {
        "word": "Halifax",
        "meaning": "The capital city of the province of Nova Scotia, Canada.",
        "sentences": ["The travelers enjoyed visiting the historic waterfront in Halifax."],
        "vocabulary_question": "Is ███████ a city in Canada or a city in Australia?"
    },
    {
        "word": "hallucinate",
        "meaning": "To perceive something not present; to have a sensory experience of something that does not exist.",
        "sentences": ["The extreme thirst in the desert caused the traveler to hallucinate an oasis."],
        "vocabulary_question": "When you ███████████, are you seeing something real or something that isn't there?"
    },
    {
        "word": "halocline",
        "meaning": "A vertical gradient in ocean salinity.",
        "sentences": ["Divers can sometimes see the blurry line of the halocline where fresh water meets salt water."],
        "vocabulary_question": "Does a █████████ represent a change in temperature or a change in saltiness (salinity)?"
    },
    {
        "word": "haplography",
        "meaning": "The accidental omission of a letter or word in writing (like writing 'philogy' instead of 'philology').",
        "sentences": ["The editor corrected a case of haplography in the manuscript where a double letter was missed."],
        "vocabulary_question": "Does ███████████ involve adding extra letters or accidentally leaving letters out?"
    },
    {
        "word": "harangue",
        "meaning": "A lengthy and aggressive speech.",
        "sentences": ["The angry manager delivered a long harangue to the employees about their lateness."],
        "vocabulary_question": "Is a ████████ a very short compliment or a long, aggressive speech?"
    },
    {
        "word": "harbinger",
        "meaning": "Something that foreshadows or predicts what is to come; a forerunner.",
        "sentences": ["The blooming of the first crocus is a welcome harbinger of spring."],
        "vocabulary_question": "Is a █████████ a memory of the past or a sign of what is coming in the future?"
    },
    {
        "word": "harrier",
        "meaning": "A person or thing that harasses; or a type of bird of prey; or a cross-country runner.",
        "sentences": ["The marsh harrier soared low over the fields, looking for small rodents."],
        "vocabulary_question": "Is a ███████ a type of bird of prey or a type of garden flower?"
    },
    {
        "word": "Hathor",
        "meaning": "An ancient Egyptian goddess of love, beauty, music, and motherhood.",
        "sentences": ["The temple was dedicated to Hathor, often depicted with the horns of a cow."],
        "vocabulary_question": "Was ██████ a goddess from ancient Egypt or ancient Rome?"
    },
    {
        "word": "hauberk",
        "meaning": "A piece of armor consisting of a shirt of mail (interlinked metal rings).",
        "sentences": ["The museum's collection included a heavy iron hauberk worn by a medieval soldier."],
        "vocabulary_question": "Is a ███████ a type of chainmail armor or a type of wooden shield?"
    },
    {
        "word": "hauteur",
        "meaning": "Haughtiness of manner; disdainful pride.",
        "sentences": ["The waiter’s cold hauteur made the guests feel unwelcome in the restaurant."],
        "vocabulary_question": "Does ███████ describe someone who is very humble or someone who is very proud and arrogant?"
    },
    {
        "word": "Hawaiian",
        "meaning": "Relating to Hawaii, its people, or their language.",
        "sentences": ["The Hawaiian islands are famous for their beautiful beaches and active volcanoes."],
        "vocabulary_question": "Does ████████ relate to an island state in the U.S. or a country in Europe?"
    },
    {
        "word": "hawok",
        "meaning": "A currency of shell beads formerly used by some California Indian tribes.",
        "sentences": ["The history book explained how hawok was once used as a form of money."],
        "vocabulary_question": "Was █████ a type of shell money or a type of clay pottery?"
    },
    {
        "word": "hearse",
        "meaning": "A vehicle for conveying a coffin at a funeral.",
        "sentences": ["The black hearse led the slow procession to the cemetery."],
        "vocabulary_question": "Is a ██████ a vehicle used at a funeral or a vehicle used for a school trip?"
    },
    {
        "word": "hedonism",
        "meaning": "The pursuit of pleasure; sensual self-indulgence.",
        "sentences": ["The movie depicted the extreme hedonism of the wealthy characters at the party."],
        "vocabulary_question": "Does ████████ focus on doing one's duty or on seeking out pleasure?"
    },
    {
        "word": "hegemony",
        "meaning": "Leadership or dominance, especially by one country or social group over others.",
        "sentences": ["The superpower established political hegemony over the entire region."],
        "vocabulary_question": "Does ████████ describe a state of being equal or a state of dominance/power over others?"
    },
    {
        "word": "Heian",
        "meaning": "Relating to the period of Japanese history (794–1185) during which the capital was at Kyoto.",
        "sentences": ["The Heian period is known for its beautiful poetry and court traditions."],
        "vocabulary_question": "Does the █████ period relate to the history of Japan or the history of China?"
    },
    {
        "word": "heleoplankton",
        "meaning": "Plankton found in small bodies of water, such as ponds or pools.",
        "sentences": ["The scientist collected a water sample to study the microscopic heleoplankton."],
        "vocabulary_question": "Is █████████████ found in the middle of the ocean or in small ponds and pools?"
    },
    {
        "word": "heliacal",
        "meaning": "Relating to or near the sun; especially occurring near sunrise or sunset.",
        "sentences": ["Ancient astronomers observed the heliacal rising of certain stars to mark the seasons."],
        "vocabulary_question": "Does the word ████████ relate to the sun or to the moon?"
    },
    {
        "word": "hennery",
        "meaning": "A place where hens are kept; a poultry farm.",
        "sentences": ["The farmer spent the morning collecting eggs from the hennery."],
        "vocabulary_question": "Is a ███████ a place for keeping chickens or a place for keeping horses?"
    },
    {
        "word": "heptad",
        "meaning": "A group or set of seven.",
        "sentences": ["The ancient story mentioned a heptad of heroes who saved the kingdom."],
        "vocabulary_question": "Does a ██████ consist of five items or seven items?"
    },
    {
        "word": "hermeneutics",
        "meaning": "The branch of knowledge that deals with interpretation, especially of the Bible or literary texts.",
        "sentences": ["The professor’s class on hermeneutics helped students understand deep layers of poetry."],
        "vocabulary_question": "Does ████████████ deal with the study of rocks or the interpretation of texts?"
    },
    {
        "word": "hermetically",
        "meaning": "In a manner that is airtight or prevents entry or change.",
        "sentences": ["The scientists kept the samples in a hermetically sealed container to avoid contamination."],
        "vocabulary_question": "If something is ████████████ sealed, can air get in and out or is it airtight?"
    },
    {
        "word": "heterochromia",
        "meaning": "A condition in which the colored part of the eye (iris) is multicolored or different from the other eye.",
        "sentences": ["The husky was born with heterochromia, having one blue eye and one brown eye."],
        "vocabulary_question": "Does ██████████████ mean having eyes of the same color or different colors?"
    },
    {
        "word": "heterophony",
        "meaning": "In music, the simultaneous variation of a single melodic line by two or more voices.",
        "sentences": ["The traditional folk song used heterophony, with each singer adding their own tiny variations to the main tune."],
        "vocabulary_question": "Is ███████████ a term used in a music class or a math class?"
    },
    {
        "word": "hetman",
        "meaning": "A Cossack headman or general.",
        "sentences": ["The hetman led his cavalry across the plains during the military campaign."],
        "vocabulary_question": "Is a ██████ a type of military leader or a type of small bird?"
    },
    {
        "word": "heuristic",
        "meaning": "Enabling a person to discover or learn something for themselves; a 'rule of thumb'.",
        "sentences": ["The teacher used a heuristic approach to help students solve the math puzzle on their own."],
        "vocabulary_question": "Is a █████████ method one where you are told the answer or one where you discover it yourself?"
    },
    {
        "word": "hibernaculum",
        "meaning": "A shelter occupied during the winter by a dormant animal.",
        "sentences": ["The frogs retreated to their muddy hibernaculum at the bottom of the pond for the winter."],
        "vocabulary_question": "Is a ████████████ a place for animals to stay in the summer or the winter?"
    },
    {
        "word": "hierurgical",
        "meaning": "Relating to sacred rites or liturgy.",
        "sentences": ["The priest performed the hierurgical ceremony with great solemnity."],
        "vocabulary_question": "Does the word ███████████ relate to sacred religious rites or to building bridges?"
    },
    {
        "word": "hinoki",
        "meaning": "A slow-growing Japanese cypress tree with high-quality, fragrant wood.",
        "sentences": ["The traditional temple was built using durable and aromatic hinoki wood."],
        "vocabulary_question": "Is ██████ a type of Japanese tree or a type of spicy food?"
    },
    {
        "word": "hipsterism",
        "meaning": "The subculture, fashions, and habits associated with hipsters.",
        "sentences": ["The neighborhood was known for its coffee shops and general atmosphere of hipsterism."],
        "vocabulary_question": "Does ██████████ relate to modern fashion subcultures or ancient history?"
    },
    {
        "word": "Hiroshima",
        "meaning": "A modern city on Japan’s Honshu Island, known for being the first city targeted by an atomic bomb.",
        "sentences": ["Visitors to Hiroshima often go to the Peace Memorial Park."],
        "vocabulary_question": "Is █████████ a city in Japan or a city in Brazil?"
    },
    {
        "word": "histrionics",
        "meaning": "Exaggerated dramatic behavior designed to attract attention.",
        "sentences": ["The toddler's histrionics in the grocery store included loud crying and rolling on the floor."],
        "vocabulary_question": "Are ███████████ subtle, quiet actions or exaggerated, dramatic behaviors?"
    },
    {
        "word": "Hitchcockian",
        "meaning": "Relating to or characteristic of the films of Alfred Hitchcock, especially in terms of suspense and psychological tension.",
        "sentences": ["The thriller movie had a very Hitchcockian feel with its mounting suspense and surprise ending."],
        "vocabulary_question": "Does ████████████ describe a film that is very funny or one that is very suspenseful?"
    },
    {
        "word": "hoity-toity",
        "meaning": "Acting in such a way as to suggest superiority or arrogance; pompous.",
        "sentences": ["She didn't like the hoity-toity attitude of the people at the exclusive club."],
        "vocabulary_question": "Is a █████-█████ person very humble or very pompous and arrogant?"
    },
    {
        "word": "holmium",
        "meaning": "A soft, silvery-white metallic chemical element of the lanthanide series.",
        "sentences": ["Holmium is used in certain types of lasers and for creating strong magnetic fields."],
        "vocabulary_question": "Is ███████ a type of chemical element or a type of garden flower?"
    },
    {
        "word": "Holocaust",
        "meaning": "The mass murder of Jewish people and other groups under the German Nazi regime during WWII.",
        "sentences": ["The museum is dedicated to teaching the history and honoring the victims of the Holocaust."],
        "vocabulary_question": "Does the █████████ refer to a specific historical event of mass murder or a celebration?"
    },
    {
        "word": "hologram",
        "meaning": "A three-dimensional image formed by the interference of light beams from a laser.",
        "sentences": ["The museum display featured a realistic hologram of a dinosaur that seemed to float in the air."],
        "vocabulary_question": "Is a ████████ a flat 2D photograph or a 3D image made of light?"
    },
    {
        "word": "holotype",
        "meaning": "A single physical example of an organism used when the species was first described.",
        "sentences": ["The museum preserves the holotype of the rare butterfly to help other scientists identify the species."],
        "vocabulary_question": "Is a ████████ the first specimen used to name a species or a common copy of it?"
    },
    {
        "word": "Holstein",
        "meaning": "A breed of large dairy cattle originating in northern Germany and the Netherlands, usually black and white.",
        "sentences": ["The farm was famous for its herd of high-producing Holstein cows."],
        "vocabulary_question": "Is a ████████ a breed of dairy cattle or a breed of racehorse?"
    },
    {
        "word": "homeostasis",
        "meaning": "The tendency toward a relatively stable equilibrium between interdependent elements, especially in a living organism.",
        "sentences": ["Your body maintains homeostasis by sweating to cool down when you get too hot."],
        "vocabulary_question": "Does ███████████ involve keeping the body stable or causing constant sudden changes?"
    },
    {
        "word": "homester",
        "meaning": "A person who stays at home; a homebody.",
        "sentences": ["As a true homester, he preferred a quiet night with a book over going to a loud party."],
        "vocabulary_question": "Is a ████████ someone who loves to travel or someone who loves to stay at home?"
    },
    {
        "word": "homiletics",
        "meaning": "The art of preaching or writing sermons.",
        "sentences": ["In divinity school, the students took a class on homiletics to learn how to give better speeches."],
        "vocabulary_question": "Does ██████████ relate to the art of cooking or the art of preaching?"
    },
    {
        "word": "Honolulu",
        "meaning": "The capital and largest city of the U.S. state of Hawaii.",
        "sentences": ["Honolulu is famous for the beautiful Waikiki Beach and the historic Pearl Harbor."],
        "vocabulary_question": "Is █████████ located in Hawaii or in Alaska?"
    },
    {
        "word": "humectant",
        "meaning": "A substance that promotes the retention of moisture.",
        "sentences": ["The lotion contained a humectant to help keep the skin hydrated and soft."],
        "vocabulary_question": "Does a █████████ help something stay moist or help it dry out?"
    },
    {
        "word": "humerus",
        "meaning": "The bone of the upper arm or forelimb, forming at the shoulder and the elbow.",
        "sentences": ["The doctor checked the X-ray to see if the patient had fractured their humerus."],
        "vocabulary_question": "Is the ███████ a bone in your arm or a bone in your leg?"
    },
    {
        "word": "humidistat",
        "meaning": "A device that automatically controls or maintains the degree of humidity.",
        "sentences": ["The greenhouse used a humidistat to keep the air moist enough for the tropical plants."],
        "vocabulary_question": "Does a ██████████ control the temperature or the humidity of a room?"
    },
    {
        "word": "hummock",
        "meaning": "A small hill, mound, or ridge of earth.",
        "sentences": ["The grassy hummock provided a perfect view of the pond below."],
        "vocabulary_question": "Is a ███████ a deep hole or a small hill?"
    },
    {
        "word": "Hungary",
        "meaning": "A landlocked country in Central Europe with its capital at Budapest.",
        "sentences": ["Hungary is famous for its historic architecture and thermal baths."],
        "vocabulary_question": "Is ███████ a country in Europe or a state in the USA?"
    },
    {
        "word": "hydriotaphia",
        "meaning": "The practice of burial in an urn; urn burial.",
        "sentences": ["The archaeologist studied the ancient customs of hydriotaphia found in the ruins."],
        "vocabulary_question": "Does █████████████ relate to burial in a coffin or burial in an urn?"
    },
    {
        "word": "hydrocortisone",
        "meaning": "A steroid hormone used to treat inflammation and allergic reactions.",
        "sentences": ["She applied a little bit of hydrocortisone cream to the itchy mosquito bite."],
        "vocabulary_question": "Is ██████████████ used to treat skin irritation or to flavor food?"
    },
    {
        "word": "hydrophobia",
        "meaning": "Extreme or irrational fear of water, often a symptom of rabies in humans.",
        "sentences": ["The patient showed signs of hydrophobia, which is a very serious symptom of the virus."],
        "vocabulary_question": "Does ███████████ mean a love of water or a fear of water?"
    },
    {
        "word": "hyperbole",
        "meaning": "Exaggerated statements or claims not meant to be taken literally.",
        "sentences": ["Saying 'I'm so hungry I could eat a horse' is a common example of hyperbole."],
        "vocabulary_question": "Is █████████ a perfectly literal fact or an extreme exaggeration?"
    },
    {
        "word": "hypochondria",
        "meaning": "Abnormal anxiety about one's health, with an unwarranted fear that one has a serious disease.",
        "sentences": ["His hypochondria made him visit the doctor for every tiny scratch or sneeze."],
        "vocabulary_question": "Does a person with ████████████ worry too much about their health or not enough?"
    },
    {
        "word": "hypogeous",
        "meaning": "Living or occurring below the surface of the ground.",
        "sentences": ["Certain types of fungi are hypogeous, growing entirely hidden beneath the soil."],
        "vocabulary_question": "Does a █████████ plant grow above the ground or below it?"
    },
    {
        "word": "hypotenuse",
        "meaning": "The longest side of a right-angled triangle, opposite the right angle.",
        "sentences": ["To find the length of the hypotenuse, we used the Pythagorean theorem in math class."],
        "vocabulary_question": "Is the ██████████ the shortest side of a triangle or the longest side opposite the right angle?"
    },
    {
        "word": "hyrax",
        "meaning": "A small, thickset herbivorous mammal of Africa and the Middle East, which is the closest living relative of the elephant.",
        "sentences": ["The rock hyrax looks like a large guinea pig but is actually related to the elephant."],
        "vocabulary_question": "Is a █████ a type of small mammal or a type of predatory shark?"
    },
    {
        "word": "ibex",
        "meaning": "A wild goat with long, thick, ridged horns that curve backward, native to the mountains of Eurasia and northern Africa.",
        "sentences": ["The mountain climbers spotted an ibex standing on a steep, rocky ledge."],
        "vocabulary_question": "Is an ████ a type of wild mountain goat or a type of large desert bird?"
    },
    {
        "word": "ibuprofen",
        "meaning": "A common medication used for relieving pain, helping with inflammation, and reducing fever.",
        "sentences": ["The coach suggested taking ibuprofen to help soothe the swelling in her ankle."],
        "vocabulary_question": "Is █████████ a type of medicine used for pain or a type of vitamin found in fruit?"
    },
    {
        "word": "Icarian",
        "meaning": "Relating to Icarus; characterized by adventurous or rash behavior that leads to ruin.",
        "sentences": ["The businessman's Icarian ambitions led him to take risks that eventually cost him his company."],
        "vocabulary_question": "Does ████████ describe a very cautious person or someone whose bold risks lead to a fall?"
    },
    {
        "word": "idiosyncratic",
        "meaning": "Relating to a characteristic, habit, or mannerism that is peculiar to an individual.",
        "sentences": ["The professor had an idiosyncratic way of tapping his pen whenever he was thinking."],
        "vocabulary_question": "Is an ██████████████ habit one that everyone shares or one that is unique to a person?"
    },
    {
        "word": "illative",
        "meaning": "Stating or involving an inference (a conclusion reached on the basis of evidence and reasoning).",
        "sentences": ["The word 'therefore' is an illative conjunction used to introduce a logical conclusion."],
        "vocabulary_question": "Does an ████████ statement help you reach a conclusion or describe a physical object?"
    },
    {
        "word": "illicitly",
        "meaning": "In a way that is contrary to or forbidden by law, rules, or custom.",
        "sentences": ["The software was downloaded illicitly without the creator's permission."],
        "vocabulary_question": "If something is done █████████, is it done legally or against the rules?"
    },
    {
        "word": "illustrious",
        "meaning": "Notably or brilliantly outstanding; famous and well-respected.",
        "sentences": ["The university was honored to welcome an illustrious guest speaker who had won a Nobel Prize."],
        "vocabulary_question": "Is an ███████████ person someone who is unknown or someone who is brilliantly outstanding?"
    },
    {
        "word": "imago",
        "meaning": "The final and fully developed adult stage of an insect, such as a butterfly.",
        "sentences": ["After weeks in the chrysalis, the butterfly finally emerged in its imago form."],
        "vocabulary_question": "Is the █████ the early caterpillar stage or the final adult stage of an insect?"
    },
    {
        "word": "immolate",
        "meaning": "To kill or offer as a sacrifice, especially by burning.",
        "sentences": ["In ancient myths, characters would sometimes immolate an offering to appease the gods."],
        "vocabulary_question": "Does to ████████ mean to save someone's life or to offer them as a sacrifice?"
    },
    {
        "word": "immortality",
        "meaning": "The ability to live forever; eternal life.",
        "sentences": ["Many ancient legends tell of heroes who went on quests to find the secret to immortality."],
        "vocabulary_question": "Does ███████████ mean living for a very short time or living forever?"
    },
    {
        "word": "impasse",
        "meaning": "A situation in which no progress is possible, especially because of a disagreement; a deadlock.",
        "sentences": ["The negotiations reached an impasse when neither side would agree to the new terms."],
        "vocabulary_question": "Is an ███████ a situation where things are moving quickly or where progress has stopped?"
    },
    {
        "word": "impasto",
        "meaning": "The process or technique of laying on paint or pigment so thickly that it stands out from a surface.",
        "sentences": ["Van Gogh used an impasto technique to give his paintings a thick, textured feel."],
        "vocabulary_question": "Does ████████ involve using very thin, watery paint or very thick, textured paint?"
    },
    {
        "word": "impecunious",
        "meaning": "Having little or no money.",
        "sentences": ["The impecunious student had to work three jobs to pay for his books."],
        "vocabulary_question": "Is an ███████████ person very wealthy or very poor?"
    },
    {
        "word": "impediment",
        "meaning": "A hindrance or obstruction in doing something.",
        "sentences": ["The fallen tree was a major impediment to the cars trying to use the mountain road."],
        "vocabulary_question": "Is an ██████████ something that helps you move faster or something that gets in your way?"
    },
    {
        "word": "imperious",
        "meaning": "Assuming power or authority without justification; arrogant and domineering.",
        "sentences": ["The manager's imperious manner made the employees feel like their opinions didn't matter."],
        "vocabulary_question": "Is an █████████ person very humble and kind or bossy and arrogant?"
    },
    {
        "word": "impetus",
        "meaning": "An impelling or driving force; the momentum of a moving body.",
        "sentences": ["The success of the first book provided the impetus for the author to write a sequel."],
        "vocabulary_question": "Is an ███████ something that stops movement or a driving force that pushes it forward?"
    },
    {
        "word": "implacable",
        "meaning": "Unable to be placated or appeased; relentless.",
        "sentences": ["The hero faced an implacable enemy who refused to stop until the battle was won."],
        "vocabulary_question": "Is an ██████████ person someone who is easily calmed or someone who is relentless?"
    },
    {
        "word": "implicative",
        "meaning": "Conveying a meaning indirectly; suggesting something without stating it plainly.",
        "sentences": ["The detective noticed the witness's implicative glance toward the locked drawer."],
        "vocabulary_question": "Does an ███████████ statement say something directly or suggest it indirectly?"
    },
    {
        "word": "imponderabilia",
        "meaning": "Things that cannot be precisely determined, measured, or evaluated.",
        "sentences": ["The success of the mission depended on several imponderabilia, such as the sudden change in weather."],
        "vocabulary_question": "Are ███████████████ things that are easy to measure or things that are impossible to measure?"
    },
    {
        "word": "impoverish",
        "meaning": "To make a person or area poor; or to exhaust the strength or fertility of something.",
        "sentences": ["The long drought began to impoverish the soil, making it hard to grow crops."],
        "vocabulary_question": "Does to ██████████ mean to make something wealthy or to make it poor and weak?"
    },
    {
        "word": "imprecatory",
        "meaning": "Uttering or invoking a curse.",
        "sentences": ["The villain let out an imprecatory shout as he was chased from the village."],
        "vocabulary_question": "Is an ███████████ speech full of kind blessings or angry curses?"
    },
    {
        "word": "impresario",
        "meaning": "A person who organizes and often finances concerts, plays, or operas.",
        "sentences": ["The famous impresario was responsible for bringing the world's best singers to the city."],
        "vocabulary_question": "Is an ██████████ a person who manages musical shows or a person who cleans a theater?"
    },
    {
        "word": "impromptu",
        "meaning": "Done without being planned, organized, or rehearsed.",
        "sentences": ["The students gave an impromptu performance in the hallway to celebrate the end of exams."],
        "vocabulary_question": "Is an █████████ speech one that was practiced for weeks or one done on the spot?"
    },
    {
        "word": "incessant",
        "meaning": "Continuing without pause or interruption.",
        "sentences": ["The incessant ticking of the clock made it hard for him to fall asleep."],
        "vocabulary_question": "Does █████████ describe something that stops and starts or something that never stops?"
    },
    {
        "word": "incinerate",
        "meaning": "To destroy something, especially waste material, by burning.",
        "sentences": ["The hospital had a special furnace to incinerate dangerous medical waste safely."],
        "vocabulary_question": "When you ██████████ something, are you freezing it or burning it to ashes?"
    },
    {
        "word": "incisiform",
        "meaning": "Having the shape of an incisor tooth.",
        "sentences": ["The animal had incisiform teeth at the front of its mouth for biting into fruit."],
        "vocabulary_question": "Is an ██████████ tooth shaped like a flat molar or a sharp front tooth?"
    },
    {
        "word": "incitive",
        "meaning": "Tending to incite or provoke; stimulating.",
        "sentences": ["The leader's incitive words encouraged the crowd to take action."],
        "vocabulary_question": "Is an ████████ message meant to calm people down or to provoke them into action?"
    },
    {
        "word": "inclement",
        "meaning": "Unpleasantly cold or wet (of the weather).",
        "sentences": ["The outdoor graduation was moved inside due to the inclement weather."],
        "vocabulary_question": "Is █████████ weather sunny and warm or stormy and unpleasant?"
    },
    {
        "word": "incompetent",
        "meaning": "Not having or showing the necessary skills to do something successfully.",
        "sentences": ["The incompetent driver struggled to park the car even in the large empty lot."],
        "vocabulary_question": "Is an ███████████ person very skilled at their job or lacking the skills to do it?"
    },
    {
        "word": "inconceivable",
        "meaning": "Not capable of being imagined or grasped mentally; unbelievable.",
        "sentences": ["It was inconceivable to the scientist that the experiment could fail after so much work."],
        "vocabulary_question": "Is an █████████████ idea one that is easy to believe or one that is impossible to imagine?"
    },
    {
        "word": "inconnu",
        "meaning": "An unknown person; a stranger; or a large silvery freshwater fish of the salmon family.",
        "sentences": ["The traveler felt like an inconnu as he walked through the busy, unfamiliar city."],
        "vocabulary_question": "Does ███████ refer to a famous celebrity or an unknown stranger?"
    },
    {
        "word": "incubate",
        "meaning": "To sit upon eggs so as to hatch them by the warmth of the body.",
        "sentences": ["The mother bird stayed in the nest for weeks to incubate her eggs."],
        "vocabulary_question": "When birds ████████ eggs, are they trying to keep them warm or keep them cool?"
    },
    {
        "word": "indemnity",
        "meaning": "Security or protection against a loss or other financial burden.",
        "sentences": ["The contract included an indemnity clause to protect the company from lawsuits."],
        "vocabulary_question": "Is █████████ a type of financial protection or a type of physical weapon?"
    },
    {
        "word": "indicia",
        "meaning": "Signs, indications, or distinguishing marks.",
        "sentences": ["The old letters bore the indicia of a royal seal."],
        "vocabulary_question": "Are ███████ clues and signs that something exists or a type of garden plant?"
    },
    {
        "word": "indict",
        "meaning": "To formally accuse of or charge with a serious crime.",
        "sentences": ["The grand jury decided to indict the suspect based on the new evidence."],
        "vocabulary_question": "When a court decides to ██████ someone, are they letting them go free or formally charging them with a crime?"
    },
    {
        "word": "indigent",
        "meaning": "Poor; needy.",
        "sentences": ["The charity provided free meals and clothing for the indigent members of the community."],
        "vocabulary_question": "Is an ████████ person very wealthy or very poor and needy?"
    },
    {
        "word": "indistinguishable",
        "meaning": "Not able to be identified as different or distinct.",
        "sentences": ["The two identical twins were almost indistinguishable in their matching outfits."],
        "vocabulary_question": "If two things are █████████████████, can you tell them apart easily or do they look exactly the same?"
    },
    {
        "word": "indolent",
        "meaning": "Wanting to avoid activity or exertion; lazy.",
        "sentences": ["The indolent cat spent the entire afternoon napping in a patch of sunlight."],
        "vocabulary_question": "Is an ████████ person very hard-working or very lazy?"
    },
    {
        "word": "inducement",
        "meaning": "A thing that persuades or influences someone to do something.",
        "sentences": ["The company offered a large bonus as an inducement for the expert to join their team."],
        "vocabulary_question": "Is an ██████████ something that discourages you or something that persuades you to act?"
    },
    {
        "word": "ineffable",
        "meaning": "Too great or extreme to be expressed or described in words.",
        "sentences": ["The view from the mountain top was of such ineffable beauty that we just stood in silence."],
        "vocabulary_question": "Is something █████████ easy to explain or too amazing for words?"
    },
    {
        "word": "ineluctable",
        "meaning": "Unable to be resisted or avoided; inescapable.",
        "sentences": ["The ineluctable passage of time means that seasons will always change."],
        "vocabulary_question": "Is an ███████████ event one that can be easily stopped or one that is inescapable?"
    },
    {
        "word": "ineptitude",
        "meaning": "Lack of skill or ability.",
        "sentences": ["The team’s ineptitude led to a series of silly mistakes during the game."],
        "vocabulary_question": "Does ██████████ describe a high level of talent or a total lack of skill?"
    },
    {
        "word": "inerrancy",
        "meaning": "Exemption from error; the quality of being free from mistakes.",
        "sentences": ["The scientist checked the calculations multiple times to ensure the inerrancy of the data."],
        "vocabulary_question": "If a report has █████████, is it full of mistakes or perfectly correct?"
    },
    {
        "word": "ingenuous",
        "meaning": "Innocent and unsuspecting; naive.",
        "sentences": ["Her ingenuous nature made her believe the tall tales her older brother told her."],
        "vocabulary_question": "Is an █████████ person very sneaky and complicated or very innocent and simple?"
    },
    {
        "word": "ingratiate",
        "meaning": "To bring oneself into favor with someone by flattering or trying to please them.",
        "sentences": ["He tried to ingratiate himself with the new boss by bringing him coffee every morning."],
        "vocabulary_question": "When you ██████████ yourself, are you trying to make someone like you or make them angry?"
    },
    {
        "word": "inimical",
        "meaning": "Tending to obstruct or harm; unfriendly; hostile.",
        "sentences": ["The dry desert heat was inimical to the growth of the delicate tropical flowers."],
        "vocabulary_question": "Is an ████████ environment helpful and friendly or harmful and hostile?"
    },
    {
        "word": "inoculate",
        "meaning": "To treat with a vaccine to produce immunity against a disease.",
        "sentences": ["The doctor will inoculate the students to protect them from the flu."],
        "vocabulary_question": "Does to █████████ mean to give a vaccine or to give a haircut?"
    },
    {
        "word": "insignia",
        "meaning": "A badge or distinguishing mark of military rank, office, or membership of an organization.",
        "sentences": ["The officer’s uniform was decorated with the silver insignia of his rank."],
        "vocabulary_question": "Is an ████████ a type of badge or a type of heavy weapon?"
    },
    {
        "word": "instigate",
        "meaning": "To provoke or incite; to bring about or initiate an action or event.",
        "sentences": ["The bully tried to instigate a fight during the lunch break."],
        "vocabulary_question": "Does to █████████ mean to stop a problem or to start one?"
    },
    {
        "word": "insufflator",
        "meaning": "A device used to blow air, gas, or powder into a body cavity.",
        "sentences": ["The surgeon used an insufflator to expand the area during the medical procedure."],
        "vocabulary_question": "Is an ███████████ a tool used to blow air/powder or a tool used for cutting?"
    },
    {
        "word": "insurgents",
        "meaning": "People fighting against a government or invading force; rebels.",
        "sentences": ["The insurgents gathered in the mountains to plan their next move against the regime."],
        "vocabulary_question": "Are ██████████ loyal government workers or people who are rebelling?"
    },
    {
        "word": "intermittent",
        "meaning": "Occurring at irregular intervals; not continuous or steady.",
        "sentences": ["The radio signal was intermittent, fading in and out as we drove through the tunnel."],
        "vocabulary_question": "Is an ████████████ sound one that plays constantly or one that stops and starts?"
    },
    {
        "word": "interred",
        "meaning": "Placed in a grave or tomb, typically with funeral rites.",
        "sentences": ["The ancient king was interred in a magnificent gold-lined sarcophagus."],
        "vocabulary_question": "Does the word ████████ mean that someone was celebrated at a party or buried in a tomb?"
    },
    {
        "word": "interrogative",
        "meaning": "Having or conveying the force of a question.",
        "sentences": ["In grammar class, we learned that a sentence ending in a question mark is an interrogative sentence."],
        "vocabulary_question": "Does an █████████████ sentence make a statement or ask a question?"
    },
    {
        "word": "intersperse",
        "meaning": "To scatter among or between other things.",
        "sentences": ["The gardener decided to intersperse colorful tulips among the green shrubs."],
        "vocabulary_question": "When you ███████████ items, are you putting them all in one big pile or scattering them between other things?"
    },
    {
        "word": "inveterate",
        "meaning": "Having a particular habit, activity, or interest that is long-established and unlikely to change.",
        "sentences": ["As an inveterate traveler, he always had his suitcase packed and ready for the next trip."],
        "vocabulary_question": "Does ██████████ describe a brand-new hobby or a long-established habit?"
    },
    {
        "word": "inviolable",
        "meaning": "Never to be broken, infringed, or dishonored.",
        "sentences": ["The peace treaty was considered an inviolable agreement between the two nations."],
        "vocabulary_question": "Is an ██████████ rule one that can be easily changed or one that must never be broken?"
    },
    {
        "word": "iridescent",
        "meaning": "Showing colors like those of the rainbow in shifting patterns that vary with light.",
        "sentences": ["The soap bubbles were beautiful and iridescent in the afternoon sun."],
        "vocabulary_question": "Does ██████████ describe something that is a dull, flat gray or something with shifting rainbow colors?"
    },
    {
        "word": "Iroquois",
        "meaning": "A member of a North American Indian confederacy (the Haudenosaunee) originally from New York State.",
        "sentences": ["We studied the history and government of the Iroquois Confederacy."],
        "vocabulary_question": "Is the ████████ a group of indigenous people from North America or a group of ancient Romans?"
    },
    {
        "word": "irrevocable",
        "meaning": "Not able to be changed, reversed, or recovered; final.",
        "sentences": ["Once the judge made her irrevocable decision, the case was officially closed."],
        "vocabulary_question": "Is an ███████████ choice one that can be taken back or one that is final?"
    },
    {
        "word": "Isle Royale",
        "meaning": "An island in the northwest of Lake Superior, in Michigan, USA; a national park known for its wilderness and wolf and moose populations.",
        "sentences": ["The hikers took a ferry across Lake Superior to reach the remote wilderness of Isle Royale."],
        "vocabulary_question": "Is ████ ██████ a city in Florida or a national park island in Lake Superior?"
    },
    {
        "word": "jacamar",
        "meaning": "A slender, brightly colored bird with a long, sharp beak, native to tropical Central and South America.",
        "sentences": ["The jacamar sat perfectly still on the branch before darting out to catch a butterfly."],
        "vocabulary_question": "Is a ███████ a type of tropical bird or a type of heavy desert truck?"
    },
    {
        "word": "jackal",
        "meaning": "A slender, long-legged wild dog found in Africa and southern Asia.",
        "sentences": ["We heard the distant yapping of a jackal as the sun began to set over the savanna."],
        "vocabulary_question": "Is a ██████ a type of wild dog or a type of large forest cat?"
    },
    {
        "word": "jackanapes",
        "meaning": "An impertinent or conceited person.",
        "sentences": ["The young jackanapes refused to listen to the advice of his elders."],
        "vocabulary_question": "Is a ██████████ a very respectful student or a conceited and rude person?"
    },
    {
        "word": "jacquerie",
        "meaning": "A communal uprising or revolt, especially of peasants.",
        "sentences": ["The history book described the French jacquerie of 1358 against the nobility."],
        "vocabulary_question": "Does a █████████ involve a peaceful celebration or a peasant revolt?"
    },
    {
        "word": "jactance",
        "meaning": "A boasting or bragging; vainglory.",
        "sentences": ["The knight's constant jactance about his victories annoyed the rest of the court."],
        "vocabulary_question": "Is ████████ another word for extreme humility or for bragging?"
    },
    {
        "word": "jadeite",
        "meaning": "A hard, green mineral which is one of the two forms of jade.",
        "sentences": ["The ancient artifact was carved from a single, beautiful piece of jadeite."],
        "vocabulary_question": "Is ███████ a type of precious green mineral or a type of soft wood?"
    },
    {
        "word": "jalapeño",
        "meaning": "A medium-sized chili pepper with a mild to moderate amount of heat.",
        "sentences": ["She added sliced jalapeño to the salsa to give it a spicy kick."],
        "vocabulary_question": "Is a ████████ a type of hot pepper or a type of sweet fruit?"
    },
    {
        "word": "jambalaya",
        "meaning": "A Cajun dish of rice with shrimp, chicken, and vegetables.",
        "sentences": ["We enjoyed a big bowl of spicy jambalaya during our trip to New Orleans."],
        "vocabulary_question": "Is █████████ a type of rice dish or a type of chocolate dessert?"
    },
    {
        "word": "jarl",
        "meaning": "A Norse or Danish nobleman or chief.",
        "sentences": ["The Viking jarl led his warriors across the sea to explore new lands."],
        "vocabulary_question": "Was a ████ a Norse nobleman or a modern-day sailor?"
    },
    {
        "word": "jaundiced",
        "meaning": "Affected by bitterness, resentment, or cynicism; or having a yellowish skin tone.",
        "sentences": ["He had a jaundiced view of politics, believing that no one ever told the truth."],
        "vocabulary_question": "Does a █████████ view suggest someone is very optimistic or very bitter and cynical?"
    },
    {
        "word": "jeepney",
        "meaning": "A popular public transportation vehicle in the Philippines, made from converted military jeeps.",
        "sentences": ["The brightly painted jeepney was crowded with people traveling to the market."],
        "vocabulary_question": "Is a ███████ a type of bus used in the Philippines or a type of small boat?"
    },
    {
        "word": "jejune",
        "meaning": "Naive, simplistic, and superficial; or dry and uninteresting.",
        "sentences": ["The critic dismissed the novel as jejune, claiming it lacked any deep meaning."],
        "vocabulary_question": "Is a ██████ story very deep and exciting or dry and simplistic?"
    },
    {
        "word": "jeon",
        "meaning": "A Korean dish consisting of seasoned sliced or minced fish, meat, and vegetables coated with flour and egg and pan-fried.",
        "sentences": ["We shared a plate of savory vegetable jeon as an appetizer."],
        "vocabulary_question": "Is ████ a type of Korean pan-fried dish or a type of spicy soup?"
    },
    {
        "word": "jettison",
        "meaning": "To throw or drop something from an aircraft or ship.",
        "sentences": ["The pilot had to jettison the extra fuel to make the plane light enough to land safely."],
        "vocabulary_question": "When you ████████ something, are you keeping it safely or throwing it overboard?"
    },
    {
        "word": "jicama",
        "meaning": "A crisp, white-fleshed, edible tuber, often eaten raw in salads.",
        "sentences": ["She cut the jicama into sticks and served them with a squeeze of lime juice."],
        "vocabulary_question": "Is ██████ a crunchy root vegetable or a soft purple berry?"
    },
    {
        "word": "jiggery-pokery",
        "meaning": "Deceitful or dishonest behavior; trickery.",
        "sentences": ["The accountant was caught in some jiggery-pokery with the company's money."],
        "vocabulary_question": "Does ███████-██████ describe honest work or sneaky trickery?"
    },
    {
        "word": "jimberjawed",
        "meaning": "Having a projecting lower jaw.",
        "sentences": ["The cartoon character was drawn as jimberjawed to give him a tough appearance."],
        "vocabulary_question": "Does being ███████████ relate to the shape of your jaw or the shape of your feet?"
    },
    {
        "word": "jingoism",
        "meaning": "Extreme patriotism, especially in the form of aggressive or warlike foreign policy.",
        "sentences": ["The senator's speech was full of jingoism, calling for immediate war with their neighbors."],
        "vocabulary_question": "Is ████████ a form of peaceful cooperation or extreme, aggressive patriotism?"
    },
    {
        "word": "jitney",
        "meaning": "A small bus or car that carries passengers over a regular route on a flexible schedule.",
        "sentences": ["They took a jitney from the train station to the beach for a few coins."],
        "vocabulary_question": "Is a ██████ a type of small bus or a type of large airplane?"
    },
    {
        "word": "jocularity",
        "meaning": "The state or quality of being fond of or characterized by joking; humorousness.",
        "sentences": ["The classroom was filled with jocularity as the students told funny stories."],
        "vocabulary_question": "Does ███████████ describe a very serious mood or a funny, joking one?"
    },
    {
        "word": "joie de vivre",
        "meaning": "Keen or buoyant enjoyment of life.",
        "sentences": ["Her constant smile and energy showed her incredible joie de vivre."],
        "vocabulary_question": "Does ████ ██ ██████ mean a feeling of great sadness or a joyful love of life?"
    },
    {
        "word": "jornada",
        "meaning": "A day's journey; or a full day's work.",
        "sentences": ["After a long jornada across the desert, the travelers finally reached the oasis."],
        "vocabulary_question": "Is a ███████ a quick one-minute break or a full day's journey?"
    },
    {
        "word": "judicious",
        "meaning": "Having, showing, or done with good judgment or sense.",
        "sentences": ["Through the judicious use of her savings, she was able to buy her first car."],
        "vocabulary_question": "Is a █████████ choice one that is very foolish or one that shows good judgment?"
    },
    {
        "word": "julienne",
        "meaning": "A portion of food cut into short, thin strips.",
        "sentences": ["The chef showed us how to julienne the carrots for the salad."],
        "vocabulary_question": "When you ████████ vegetables, are you mashing them or cutting them into thin strips?"
    },
    {
        "word": "juliet",
        "meaning": "A woman's slipper with a high front and back and low-cut sides.",
        "sentences": ["She put on her comfortable juliet slippers before sitting down by the fire."],
        "vocabulary_question": "Is a ██████ a type of slipper or a type of winter coat?"
    },
    {
        "word": "Jurassic",
        "meaning": "Relating to the second period of the Mesozoic era, known for the dominance of dinosaurs like Brachiosaurus.",
        "sentences": ["The Jurassic period occurred between the Triassic and Cretaceous periods."],
        "vocabulary_question": "Did the ████████ period happen millions of years ago or just last century?"
    },
    {
        "word": "juvenilia",
        "meaning": "Works produced by an author or artist during their youth.",
        "sentences": ["The museum exhibited the famous poet's juvenilia, including poems he wrote at age ten."],
        "vocabulary_question": "Does █████████ refer to art made by someone in their old age or their youth?"
    },
    {
        "word": "juvia",
        "meaning": "The Brazil nut tree, or the nut itself.",
        "sentences": ["The tall juvia tree produces the large pods that contain Brazil nuts."],
        "vocabulary_question": "Is a █████ a type of nut tree or a type of small mountain flower?"
    },
    {
        "word": "juxtapose",
        "meaning": "To place side by side to create some sort of effect, especially for contrast.",
        "sentences": ["The artist decided to juxtapose the bright colors with dark shadows to make the painting pop."],
        "vocabulary_question": "When you █████████ two items, are you hiding them or placing them side by side?"
    },
    {
        "word": "kaiser",
        "meaning": "The German Emperor, the Emperor of Austria, or the head of the Holy Roman Empire.",
        "sentences": ["History class focused on the reign of the last German kaiser."],
        "vocabulary_question": "Was a ██████ a type of emperor or a type of farmer?"
    },
    {
        "word": "kanban",
        "meaning": "A Japanese manufacturing system in which the supply of components is regulated through the use of an instruction card.",
        "sentences": ["The factory improved its efficiency by switching to a kanban system."],
        "vocabulary_question": "Does a ██████ system use instruction cards or giant robots to manage supplies?"
    },
    {
        "word": "kanji",
        "meaning": "A system of Japanese writing using Chinese characters.",
        "sentences": ["Students in Japan must learn thousands of kanji characters to read a newspaper."],
        "vocabulary_question": "Is █████ a style of Japanese writing or a type of traditional dance?"
    },
    {
        "word": "karaoke",
        "meaning": "A form of entertainment in which a person sings along with recorded music.",
        "sentences": ["We had a blast at the party singing karaoke with our favorite pop songs."],
        "vocabulary_question": "Does ███████ involve playing an instrument or singing along to a recording?"
    },
    {
        "word": "karst",
        "meaning": "Landscape underlain by limestone which has been eroded by dissolution, producing ridges, towers, fissures, and sinkholes.",
        "sentences": ["The area is famous for its karst topography, including spectacular underground caves."],
        "vocabulary_question": "Is a █████ landscape known for its sandy beaches or its limestone caves and sinkholes?"
    },
    {
        "word": "katharobic",
        "meaning": "Of or relating to an environment of pure water.",
        "sentences": ["The biologist searched for rare organisms that only thrive in katharobic conditions."],
        "vocabulary_question": "Does a ██████████ environment consist of muddy swamps or very pure water?"
    },
    {
        "word": "katsu",
        "meaning": "A Japanese dish of fried meat (usually pork or chicken) covered with breadcrumbs.",
        "sentences": ["He ordered a crispy chicken katsu served with a side of shredded cabbage."],
        "vocabulary_question": "Is █████ a type of fried breaded meat or a type of raw fish?"
    },
    {
        "word": "kerchief",
        "meaning": "A piece of fabric used to cover the head or neck.",
        "sentences": ["The gardener tied a colorful kerchief around her head to keep the sun off her neck."],
        "vocabulary_question": "Is a ████████ worn on the feet or used to cover the head or neck?"
    },
    {
        "word": "Kildare",
        "meaning": "A county in Ireland, located in the province of Leinster.",
        "sentences": ["Kildare is well known for its horse breeding and beautiful green pastures."],
        "vocabulary_question": "Is ███████ a county in Ireland or a city in Germany?"
    },
    {
        "word": "kinesiology",
        "meaning": "The study of physical mechanics and anatomy as they relate to human movement.",
        "sentences": ["After her injury, the athlete consulted an expert in kinesiology to improve her running form."],
        "vocabulary_question": "Does ████████████ study the movement of the human body or the movement of the stars?"
    },
    {
        "word": "kiskadee",
        "meaning": "A large, bright-eyed flycatcher bird of tropical America, named for its three-syllable call.",
        "sentences": ["The yellow chest of the kiskadee made it easy to spot in the trees of the rainforest."],
        "vocabulary_question": "Is a ████████ a type of tropical bird or a type of small lizard?"
    },
    {
        "word": "klippe",
        "meaning": "A portion of a rock mass that has been separated by erosion from its original thrust sheet.",
        "sentences": ["The geologist explained that the isolated peak was actually a klippe."],
        "vocabulary_question": "Is a ██████ a type of geological rock formation or a type of fast-moving river?"
    },
    {
        "word": "koto",
        "meaning": "A traditional Japanese stringed musical instrument.",
        "sentences": ["The musician used ivory picks to pluck the thirteen strings of the koto."],
        "vocabulary_question": "Is a ████ a type of Japanese musical instrument or a type of martial arts uniform?"
    },
    {
        "word": "Krakatoa",
        "meaning": "A volcanic island in Indonesia famous for its massive and destructive eruption in 1883.",
        "sentences": ["The eruption of Krakatoa was so loud it could be heard thousands of miles away."],
        "vocabulary_question": "Is █████████ the name of a famous volcano or a famous mountain range?"
    },
    {
        "word": "krausen",
        "meaning": "The thick, foamy head that forms on the surface of fermenting beer.",
        "sentences": ["The brewer checked the tank to see if a healthy krausen had formed during fermentation."],
        "vocabulary_question": "Is ███████ a term used in bread baking or in the process of brewing?"
    },
    {
        "word": "krypton",
        "meaning": "A chemical element that is a colorless, odorless, tasteless noble gas.",
        "sentences": ["Krypton is often used in high-speed photography and certain types of fluorescent lights."],
        "vocabulary_question": "Is ███████ a type of noble gas or a type of rare gemstone?"
    },
    {
        "word": "kufi",
        "meaning": "A short, rounded cap worn by men in many populations in Africa and Asia.",
        "sentences": ["He wore an embroidered kufi to the community celebration."],
        "vocabulary_question": "Is a ████ a type of traditional cap or a type of long robe?"
    },
    {
        "word": "kugel",
        "meaning": "A baked pudding or casserole, usually made from egg noodles or potato.",
        "sentences": ["My grandmother always makes a sweet noodle kugel for our holiday dinners."],
        "vocabulary_question": "Is █████ a type of baked casserole or a type of cold salad?"
    },
    {
        "word": "kung pao",
        "meaning": "A spicy, stir-fried Chinese dish made with chicken, peanuts, and vegetables.",
        "sentences": ["I love the crunch of the peanuts in a bowl of spicy kung pao chicken."],
        "vocabulary_question": "Is ████ ███ a spicy Chinese stir-fry or a type of mild Japanese soup?"
    },
    {
        "word": "labroid",
        "meaning": "Resembling or relating to the wrasses, a family of marine fish.",
        "sentences": ["The diver identified several labroid species swimming near the coral reef."],
        "vocabulary_question": "Does ███████ describe something that looks like a type of fish or a type of bird?"
    },
    {
        "word": "labyrinthine",
        "meaning": "Like a labyrinth; irregular, complicated, and confusing.",
        "sentences": ["The old city was a labyrinthine maze of narrow alleys and hidden courtyards."],
        "vocabulary_question": "Is a ████████████ path very straight and simple or very complicated and maze-like?"
    },
    {
        "word": "laconic",
        "meaning": "Using very few words; brief and to the point.",
        "sentences": ["The cowboy was known for his laconic style, often answering only with a nod."],
        "vocabulary_question": "Is a ███████ person someone who talks a lot or someone who uses very few words?"
    },
    {
        "word": "lacustrine",
        "meaning": "Relating to or associated with lakes.",
        "sentences": ["The researchers studied the lacustrine deposits found at the bottom of the dried-up lake."],
        "vocabulary_question": "Does the word ██████████ relate to oceans, deserts, or lakes?"
    },
    {
        "word": "ladang",
        "meaning": "A patch of cleared jungle used for shifting cultivation in Southeast Asia.",
        "sentences": ["The farmers planted rice in the ladang before moving on to a new area next season."],
        "vocabulary_question": "Is a ██████ a type of forest clearing for farming or a type of city park?"
    },
    {
        "word": "laity",
        "meaning": "Lay people, as distinct from the clergy (religious leaders).",
        "sentences": ["The bishop addressed both the local priests and the laity during the ceremony."],
        "vocabulary_question": "Does the █████ refer to the leaders of a church or the ordinary members of the congregation?"
    },
    {
        "word": "lambently",
        "meaning": "Softly bright or radiant; flickering lightly over a surface.",
        "sentences": ["The candlelight played lambently across the walls of the quiet room."],
        "vocabulary_question": "If something glows █████████, is it a blindingly bright flash or a soft, flickering light?"
    },
    {
        "word": "lambkin",
        "meaning": "A little lamb; or a term of endearment for a small child.",
        "sentences": ["The children watched the playful lambkin skip through the field."],
        "vocabulary_question": "Is a ███████ a very large mountain goat or a tiny, young lamb?"
    },
    {
        "word": "Lancasterian",
        "meaning": "Relating to the educational system where older students help teach younger ones.",
        "sentences": ["The 19th-century schoolhouse was organized according to the Lancasterian method."],
        "vocabulary_question": "Does the ████████████ method involve a teacher's lecture or students helping teach each other?"
    },
    {
        "word": "languorous",
        "meaning": "Characterized by tiredness or inactivity, especially of a pleasurable kind.",
        "sentences": ["The hot summer afternoon left everyone in a languorous mood, resting in the shade."],
        "vocabulary_question": "Is a █████████ mood one of high energy or one of pleasurable, lazy relaxation?"
    },
    {
        "word": "lanolated",
        "meaning": "Containing or treated with lanolin (fat from sheep's wool).",
        "sentences": ["She used a lanolated cream to soothe her dry hands after working in the garden."],
        "vocabulary_question": "If a lotion is █████████, does it contain fat from wool or juice from an orange?"
    },
    {
        "word": "lantana",
        "meaning": "A genus of flowering plants with small, brightly colored clusters of blossoms.",
        "sentences": ["The butterflies were attracted to the bright orange and pink lantana in the garden."],
        "vocabulary_question": "Is a ███████ a type of flowering plant or a type of garden tool?"
    },
    {
        "word": "larceny",
        "meaning": "The unlawful taking of personal property without the consent of its legal owner.",
        "sentences": ["The thief was arrested and charged with grand larceny for stealing the expensive jewelry."],
        "vocabulary_question": "Does ███████ involve helping a neighbor or stealing someone's property?"
    },
    {
        "word": "largesses",
        "meaning": "Generosity in bestowing money or gifts upon others.",
        "sentences": ["The local hospital benefited from the billionaire's many largesses."],
        "vocabulary_question": "Does the word █████████ describe a state of greed or a state of great generosity?"
    },
    {
        "word": "larnax",
        "meaning": "A small closed coffin, box, or chest often used as a container for human remains in ancient Greece.",
        "sentences": ["The archaeologists discovered a beautifully decorated terracotta larnax in the tomb."],
        "vocabulary_question": "Was a ██████ an ancient type of container for remains or a type of musical instrument?"
    },
    {
        "word": "lassitude",
        "meaning": "A state of physical or mental weariness; lack of energy.",
        "sentences": ["The humid summer heat filled everyone with a sense of lassitude."],
        "vocabulary_question": "Does █████████ describe having tons of energy or feeling very weary and tired?"
    },
    {
        "word": "latifondo",
        "meaning": "A large landed estate or plantation, especially in Italy or South America.",
        "sentences": ["The history of the region was dominated by the division of land into the latifondo system."],
        "vocabulary_question": "Is a █████████ a tiny backyard garden or a very large landed estate?"
    },
    {
        "word": "latigo",
        "meaning": "A long strap on a saddletree used to tighten the cinch.",
        "sentences": ["The cowboy pulled the latigo tight to make sure the saddle wouldn't slip during the ride."],
        "vocabulary_question": "Is a ██████ a part of a horse's saddle equipment or a type of cowboy hat?"
    },
    {
        "word": "laudatory",
        "meaning": "Expressing praise and commendation.",
        "sentences": ["The young musician received laudatory reviews after her debut performance."],
        "vocabulary_question": "Is a █████████ speech one that criticizes someone or one that praises them?"
    },
    {
        "word": "lavender",
        "meaning": "A small aromatic evergreen shrub of the mint family, with narrow leaves and bluish-purple flowers.",
        "sentences": ["The garden was filled with the calming scent of blooming lavender."],
        "vocabulary_question": "Is ████████ a type of fragrant purple flower or a type of spicy green pepper?"
    },
    {
        "word": "leery",
        "meaning": "Cautious or wary due to realistic suspicions.",
        "sentences": ["I was a bit leery of the email that asked for my password and personal information."],
        "vocabulary_question": "If you are ██████ of something, are you very trusting or very cautious and suspicious?"
    },
    {
        "word": "legalese",
        "meaning": "The formal and technical language of legal documents that is often hard for the public to understand.",
        "sentences": ["The contract was written in so much legalese that I had to ask a lawyer to explain it."],
        "vocabulary_question": "Is ████████ the simple language used in comic books or the complex language used in law?"
    },
    {
        "word": "legato",
        "meaning": "A musical direction meaning in a smooth, flowing manner, without breaks between notes.",
        "sentences": ["The pianist played the melody legato to create a peaceful, dreamlike sound."],
        "vocabulary_question": "In music, does ██████ mean notes are played in a choppy way or a smooth, flowing way?"
    },
    {
        "word": "legerity",
        "meaning": "Physical or mental quickness; nimbleness.",
        "sentences": ["The gymnast moved with incredible legerity across the balance beam."],
        "vocabulary_question": "Does █████████ describe being slow and clumsy or quick and nimble?"
    },
    {
        "word": "lemniscus",
        "meaning": "A band of fibers, especially a bundle of nerve fibers in the brain.",
        "sentences": ["The medical student studied the path of the lemniscus through the brainstem."],
        "vocabulary_question": "Is a █████████ a part of the human brain or a type of desert plant?"
    },
    {
        "word": "lerot",
        "meaning": "The garden dormouse, a small rodent found in Europe and North Africa.",
        "sentences": ["The lerot has a distinctive black mask around its eyes, making it look like a tiny bandit."],
        "vocabulary_question": "Is a █████ a type of small dormouse or a type of large forest deer?"
    },
    {
        "word": "leviathan",
        "meaning": "A very large and powerful thing; or a giant sea monster from the Bible.",
        "sentences": ["The massive aircraft carrier looked like a metal leviathan floating in the harbor."],
        "vocabulary_question": "Does the word █████████ describe something very tiny or something huge and powerful?"
    },
    {
        "word": "liaise",
        "meaning": "To cooperate on a matter of mutual concern; to act as a link between groups.",
        "sentences": ["The student council president had to liaise between the teachers and the students."],
        "vocabulary_question": "When you ███████, are you working alone or acting as a link between different people?"
    },
    {
        "word": "lidocaine",
        "meaning": "A synthetic compound used as a local anesthetic to numb tissue.",
        "sentences": ["The dentist applied some lidocaine to my gums before filling the cavity."],
        "vocabulary_question": "Is █████████ used to make a person more active or to numb a part of the body?"
    },
    {
        "word": "limned",
        "meaning": "Depicted or described in paintings or words; outlined in clear, sharp detail.",
        "sentences": ["The mountains were beautifully limned against the bright orange sunset."],
        "vocabulary_question": "If something is ██████, is it blurred and hidden or clearly outlined and depicted?"
    },
    {
        "word": "limpa",
        "meaning": "A Swedish rye bread flavored with molasses, anise, and orange peel.",
        "sentences": ["We enjoyed a slice of toasted limpa bread with butter for breakfast."],
        "vocabulary_question": "Is █████ a type of Swedish bread or a type of Italian cheese?"
    },
    {
        "word": "limpet",
        "meaning": "A marine mollusk with a shallow conical shell that clings tightly to rocks.",
        "sentences": ["It was impossible to pull the limpet off the rock because it was stuck so tight."],
        "vocabulary_question": "Is a ██████ a type of bird that flies or a type of sea creature that clings to rocks?"
    },
    {
        "word": "limpid",
        "meaning": "Completely clear and transparent.",
        "sentences": ["The water in the mountain stream was so limpid that we could see every pebble on the bottom."],
        "vocabulary_question": "Does ██████ describe water that is muddy and dark or water that is perfectly clear?"
    },
    {
        "word": "limpkin",
        "meaning": "A large, brown, long-legged marsh bird of the Americas.",
        "sentences": ["We followed the loud, wailing call of the limpkin through the Florida swamp."],
        "vocabulary_question": "Is a ███████ a type of marsh bird or a type of small lizard?"
    },
    {
        "word": "lingua franca",
        "meaning": "A language that is adopted as a common language between speakers whose native languages are different.",
        "sentences": ["English often serves as a lingua franca for people from many different countries."],
        "vocabulary_question": "Is a ██████ ██████ a secret code or a common language used for communication?"
    },
    {
        "word": "linnet",
        "meaning": "A small brown and grey finch with a reddish breast and forehead.",
        "sentences": ["A linnet perched on the garden fence and began to sing a sweet song."],
        "vocabulary_question": "Is a ██████ a type of songbird or a type of garden tool?"
    },
    {
        "word": "linstock",
        "meaning": "A staff with a forked end to hold a lighted match, formerly used in firing a cannon.",
        "sentences": ["The soldier used the linstock to ignite the gunpowder and fire the cannon."],
        "vocabulary_question": "Was a ████████ used to light a cannon or to measure the depth of the sea?"
    },
    {
        "word": "literatim",
        "meaning": "Letter for letter; literally.",
        "sentences": ["The student had to copy the ancient manuscript literatim to avoid any mistakes."],
        "vocabulary_question": "Does copying something █████████ mean summarizing it or copying it exactly letter for letter?"
    },
    {
        "word": "lithium",
        "meaning": "A soft, silvery-white metallic chemical element; often used in rechargeable batteries.",
        "sentences": ["My phone uses a lithium-ion battery to stay powered all day."],
        "vocabulary_question": "Is ███████ a type of chemical element or a type of desert plant?"
    },
    {
        "word": "lithophone",
        "meaning": "A musical instrument consisting of a set of resonant stone slabs which are struck to produce notes.",
        "sentences": ["The museum exhibited an ancient lithophone made from polished pieces of rock."],
        "vocabulary_question": "Is a ██████████ a musical instrument made of stones or a type of old telephone?"
    },
    {
        "word": "litmus",
        "meaning": "A dye that changes color based on acidity; often used as a test for something.",
        "sentences": ["We used litmus paper in science class to see if the lemon juice was an acid."],
        "vocabulary_question": "Is ██████ used to test for acidity or to measure the speed of wind?"
    },
    {
        "word": "lobectomy",
        "meaning": "The surgical removal of a lobe of an organ, such as the lung or liver.",
        "sentences": ["The patient recovered quickly after the successful lobectomy to remove the tumor."],
        "vocabulary_question": "Does a █████████ involve cleaning a wound or surgically removing part of an organ?"
    },
    {
        "word": "lobotomy",
        "meaning": "A surgical operation involving incision into the prefrontal lobe of the brain, formerly used to treat mental illness.",
        "sentences": ["Medical history books discuss how the lobotomy was once used before more effective treatments were discovered."],
        "vocabulary_question": "Is a ████████ a type of brain surgery or a type of dental procedure?"
    },
    {
        "word": "locavore",
        "meaning": "A person who eats foods grown nearby whenever possible.",
        "sentences": ["As a dedicated locavore, she buys all of her vegetables from the farmer's market down the street."],
        "vocabulary_question": "Does a ████████ eat food from all over the world or food grown close to home?"
    },
    {
        "word": "loch",
        "meaning": "A lake or a narrow inlet of the sea (especially in Scotland).",
        "sentences": ["We took a boat tour across Loch Ness to look for the legendary monster."],
        "vocabulary_question": "Is a ████ a type of Scottish lake or a type of high mountain?"
    },
    {
        "word": "logographic",
        "meaning": "Relating to a letter, symbol, or sign used to represent an entire word (like $ or &).",
        "sentences": ["Ancient Egyptian hieroglyphics are a well-known example of a logographic writing system."],
        "vocabulary_question": "Does a ███████████ symbol represent a single sound or a whole word?"
    },
    {
        "word": "longitude",
        "meaning": "The angular distance of a place east or west of the meridian at Greenwich, England.",
        "sentences": ["The captain checked the ship's longitude to determine how far west they had traveled."],
        "vocabulary_question": "Does █████████ measure distance north and south or east and west?"
    },
    {
        "word": "lorikeet",
        "meaning": "A small to medium-sized Australian parrot with a brush-tipped tongue for feeding on nectar and pollen.",
        "sentences": ["The rainbow lorikeet is famous for its bright, multi-colored feathers."],
        "vocabulary_question": "Is a ████████ a type of colorful parrot or a type of small forest mammal?"
    },
    {
        "word": "lossy",
        "meaning": "Relating to data compression in which some amount of data is lost.",
        "sentences": ["A JPEG is a lossy file format, meaning it sacrifices some image quality to save space."],
        "vocabulary_question": "In a █████ file, is all the original data kept perfectly or is some of it removed?"
    },
    {
        "word": "lousicide",
        "meaning": "A substance used to kill lice.",
        "sentences": ["The school nurse recommended a specialized lousicide to treat the outbreak."],
        "vocabulary_question": "Is a █████████ used to help plants grow or to kill lice?"
    },
    {
        "word": "loutrophoros",
        "meaning": "A distinctive type of Greek pottery vessel with a long neck and two handles, used for carrying water for bridal baths or in funeral rites.",
        "sentences": ["The museum's Greek collection featured a beautifully painted clay loutrophoros."],
        "vocabulary_question": "Was a ████████████ an ancient Greek water vessel or a type of military shield?"
    },
    {
        "word": "lovage",
        "meaning": "An herb of the parsley family, with leaves and seeds used for flavoring food.",
        "sentences": ["The chef added a handful of chopped lovage to the soup to give it a celery-like flavor."],
        "vocabulary_question": "Is ██████ a type of seasoning herb or a type of expensive jewelry?"
    },
    {
        "word": "luculent",
        "meaning": "Clearly expressed; lucid.",
        "sentences": ["The professor gave a luculent explanation that made the difficult topic easy to understand."],
        "vocabulary_question": "Is a ████████ speech confusing and messy or clear and easy to follow?"
    },
    {
        "word": "ludicrous",
        "meaning": "So foolish, unreasonable, or out of place as to be amusing; ridiculous.",
        "sentences": ["It was ludicrous to suggest that a cat could fly a plane."],
        "vocabulary_question": "Is something █████████ very serious and logical or silly and ridiculous?"
    },
    {
        "word": "lumen",
        "meaning": "A unit of luminous flux, used to measure the total amount of visible light emitted by a source.",
        "sentences": ["The new LED light bulb produces 800 lumens while using very little electricity."],
        "vocabulary_question": "Is a █████ used to measure the brightness of light or the weight of a stone?"
    },
    {
        "word": "luthier",
        "meaning": "A person who builds or repairs stringed instruments, such as violins or guitars.",
        "sentences": ["The musician took her cello to a master luthier to have the bridge adjusted."],
        "vocabulary_question": "Does a ███████ work with musical instruments or with computer software?"
    },
    {
        "word": "lutrine",
        "meaning": "Relating to or resembling an otter.",
        "sentences": ["The animal’s sleek fur and webbed feet gave it a distinctly lutrine appearance."],
        "vocabulary_question": "Does the word ███████ relate to otters or to elephants?"
    },
    {
        "word": "luxuriate",
        "meaning": "To enjoy oneself in a luxurious way; to take self-indulgent delight in something.",
        "sentences": ["On the first day of vacation, she decided to luxuriate in the warm sun by the pool."],
        "vocabulary_question": "When you █████████ in something, are you working very hard or enjoying yourself greatly?"
    },
    {
        "word": "macadam",
        "meaning": "Broken stone used in layers for surfacing roads and paths, typically bound with tar or bitumen.",
        "sentences": ["The old country lane was surfaced with macadam to prevent it from turning into a mud pit."],
        "vocabulary_question": "Is ███████ a type of road surfacing material or a type of expensive perfume?"
    },
    {
        "word": "macadamia",
        "meaning": "The edible nut of an Australian tree, known for its rich, buttery flavor.",
        "sentences": ["I love the taste of white chocolate and macadamia nut cookies."],
        "vocabulary_question": "Is a █████████ a type of tropical nut or a type of small reptile?"
    },
    {
        "word": "machicolation",
        "meaning": "An opening between the supporting corbels of a projecting parapet on a castle, through which stones or liquids could be dropped on attackers.",
        "sentences": ["The defenders of the castle looked through the machicolation to spot the approaching enemy."],
        "vocabulary_question": "Would you find a █████████████ on a medieval castle or on a modern submarine?"
    },
    {
        "word": "machination",
        "meaning": "A scheme or subtle maneuver intended to accomplish some end, especially an evil one.",
        "sentences": ["The villain's complex machination to take over the city was eventually foiled by the hero."],
        "vocabulary_question": "Is a ███████████ a random event or a carefully planned scheme?"
    },
    {
        "word": "macle",
        "meaning": "A twin crystal, especially a flattened one; or a dark spot in a mineral.",
        "sentences": ["The geologist identified the stone as a macle due to its unique twinned structure."],
        "vocabulary_question": "Does the word █████ relate to the study of crystals or the study of ocean currents?"
    },
    {
        "word": "maclura",
        "meaning": "A genus of trees, the most famous being the Osage orange.",
        "sentences": ["The maclura tree is known for its hard wood and bumpy, neon-green fruit."],
        "vocabulary_question": "Is ███████ a type of tree or a type of deep-sea fish?"
    },
    {
        "word": "macular",
        "meaning": "Relating to the macula, a small spot or area in the retina of the eye; or having spots.",
        "sentences": ["The eye doctor checked for signs of macular degeneration during the exam."],
        "vocabulary_question": "Does the word ███████ relate to the health of the eye or the health of the lungs?"
    },
    {
        "word": "madder",
        "meaning": "A herbaceous plant whose root was formerly used to produce a red dye.",
        "sentences": ["The artist used madder root to create a deep, vibrant red pigment for the fabric."],
        "vocabulary_question": "Is ██████ a plant used to make red dye or a type of gardening tool?"
    },
    {
        "word": "maladaptive",
        "meaning": "Not providing adequate or appropriate adjustment to the environment or situation.",
        "sentences": ["Avoiding all social situations is often a maladaptive way to deal with shyness."],
        "vocabulary_question": "Is a ███████████ behavior one that helps you succeed or one that makes things harder?"
    },
    {
        "word": "malady",
        "meaning": "A disease or ailment.",
        "sentences": ["The mysterious malady affected the entire village, causing everyone to feel weak and tired."],
        "vocabulary_question": "Is a ██████ another word for a serious illness or a celebration?"
    },
    {
        "word": "malapropism",
        "meaning": "A blundering, often ludicrous or absurd use of the wrong word in place of one that sounds similar.",
        "sentences": ["Calling someone a 'distinguished' gentleman instead of an 'extinguished' one is a funny malapropism."],
        "vocabulary_question": "Does a ███████████ involve using the correct word or accidentally using a wrong word that sounds similar?"
    },
    {
        "word": "malevolent",
        "meaning": "Having or showing a wish to do evil to others.",
        "sentences": ["The villain fixed the hero with a malevolent stare before disappearing into the shadows."],
        "vocabulary_question": "Is a ██████████ person kind and helpful or mean and wishing for harm?"
    },
    {
        "word": "malfeasance",
        "meaning": "Wrongdoing, especially by a public official.",
        "sentences": ["The mayor was removed from office after evidence of financial malfeasance was discovered."],
        "vocabulary_question": "Does ███████████ refer to doing something right or committing a wrongdoing in a position of power?"
    },
    {
        "word": "malinger",
        "meaning": "To exaggerate or feign illness in order to escape duty or work.",
        "sentences": ["He tried to malinger by coughing loudly so he wouldn't have to take the math test."],
        "vocabulary_question": "When you ████████, are you actually sick or are you pretending to be sick to avoid work?"
    },
    {
        "word": "Mancunian",
        "meaning": "A person from Manchester, England.",
        "sentences": ["As a proud Mancunian, she grew up supporting the local soccer teams."],
        "vocabulary_question": "Is a █████████ someone who lives in London or someone who lives in Manchester?"
    },
    {
        "word": "mano a mano",
        "meaning": "Directly against each other; hand-to-hand.",
        "sentences": ["The two champions decided to settle their dispute mano a mano in the arena."],
        "vocabulary_question": "Does ████  ████ mean working together as a team or fighting/competing directly against one another?"
    },
    {
        "word": "manumit",
        "meaning": "To release from slavery; to set free.",
        "sentences": ["The historical document recorded the owner's decision to manumit all of his servants."],
        "vocabulary_question": "Does the word ███████ mean to capture someone or to set them free?"
    },
    {
        "word": "mare",
        "meaning": "A female horse; or a large, dark, basaltic plain on the surface of the moon.",
        "sentences": ["The astronaut pointed out the Sea of Tranquility, which is a famous lunar mare."],
        "vocabulary_question": "Is a ████ a type of female horse or a dark plain on the moon (or both)?"
    },
    {
        "word": "marginalia",
        "meaning": "Marginal notes or embellishments (notes written in the margins of a book).",
        "sentences": ["The historian found the author's marginalia more interesting than the actual printed text."],
        "vocabulary_question": "Is ███████████ text written in the middle of a page or notes written in the margins?"
    },
    {
        "word": "marimba",
        "meaning": "A percussion instrument consisting of a set of wooden bars struck with mallets to produce musical tones.",
        "sentences": ["The upbeat sound of the marimba filled the room during the jazz concert."],
        "vocabulary_question": "Is a ███████ a type of stringed instrument or a percussion instrument with wooden bars?"
    },
    {
        "word": "marring",
        "meaning": "Damaging or spoiling the appearance or quality of something.",
        "sentences": ["The artist was careful not to leave any smudges that would be marring his final sketch."],
        "vocabulary_question": "If you are ███████ something, are you making it look better or damaging its appearance?"
    },
    {
        "word": "marsupial",
        "meaning": "A mammal of an order whose members are born incompletely developed and are typically carried and suckled in a pouch.",
        "sentences": ["The kangaroo is perhaps the most famous marsupial in the world."],
        "vocabulary_question": "Does a █████████ carry its young in a pouch or in a nest in a tree?"
    },
    {
        "word": "martyrdom",
        "meaning": "The death or suffering of a martyr; or a display of feigned or exaggerated suffering to obtain sympathy.",
        "sentences": ["The historical figure was honored for his martyrdom in defense of his beliefs."],
        "vocabulary_question": "Does █████████ relate to the suffering for a cause or the celebration of a victory?"
    },
    {
        "word": "mastodon",
        "meaning": "A large, extinct elephant-like mammal with shaggy hair and long tusks.",
        "sentences": ["The museum's main attraction was the skeleton of a prehistoric mastodon."],
        "vocabulary_question": "Is a ████████ an extinct animal that looks like an elephant or a type of modern shark?"
    },
    {
        "word": "matriculation",
        "meaning": "The formal process of entering a university, or of becoming eligible to enter by acquiring the necessary qualifications.",
        "sentences": ["The university held a special ceremony for the matriculation of the new freshman class."],
        "vocabulary_question": "Does ██████████████ relate to graduating from a school or enrolling in one?"
    },
    {
        "word": "matsutake",
        "meaning": "A highly prized edible mushroom that grows in East Asia, Europe, and North America.",
        "sentences": ["The chef paid a high price for a basket of fresh, aromatic matsutake mushrooms."],
        "vocabulary_question": "Is a █████████ a type of edible mushroom or a type of spicy seafood?"
    },
    {
        "word": "mawkish",
        "meaning": "Sentimental in a feeble or sickly way.",
        "sentences": ["The movie was a bit too mawkish for my taste, with too many over-the-top emotional scenes."],
        "vocabulary_question": "Is a ███████ story one that is very exciting or one that is overly and sickly sentimental?"
    },
    {
        "word": "mea culpa",
        "meaning": "An acknowledgment of one's fault or error.",
        "sentences": ["The politician issued a mea culpa after realizing he had made a mistake in the report."],
        "vocabulary_question": "When you say '███ █████', are you blaming someone else or admitting your own mistake?"
    },
    {
        "word": "mecca",
        "meaning": "A place that attracts many people of a particular group or interest.",
        "sentences": ["Nashville is often considered a mecca for country music fans."],
        "vocabulary_question": "Is a █████ a place that nobody visits or a place that many people are drawn to?"
    },
    {
        "word": "mediocrity",
        "meaning": "The quality or state of being average or unremarkable.",
        "sentences": ["The critic felt the new play was a work of pure mediocrity, neither good nor terrible."],
        "vocabulary_question": "Does ██████████ describe something that is brilliantly outstanding or something that is just average?"
    },
    {
        "word": "medusa",
        "meaning": "A jellyfish; or in Greek mythology, a woman with snakes for hair whose gaze could turn people to stone.",
        "sentences": ["The swimmer carefully avoided the medusa floating near the shore to avoid a sting."],
        "vocabulary_question": "In mythology, did a ██████ have hair made of gold or hair made of snakes?"
    },
    {
        "word": "megalomaniac",
        "meaning": "A person who is obsessed with their own power.",
        "sentences": ["In the movie, the villain was a megalomaniac who wanted to rule the entire galaxy."],
        "vocabulary_question": "Is a ████████████ someone who is very humble or someone obsessed with their own power?"
    },
    {
        "word": "melamine",
        "meaning": "A hard, durable plastic used for making tableware and laminate coatings.",
        "sentences": ["We use melamine plates for our outdoor picnics because they are almost impossible to break."],
        "vocabulary_question": "Is ████████ a type of breakable glass or a type of durable plastic?"
    },
    {
        "word": "mélange",
        "meaning": "A mixture; a medley.",
        "sentences": ["The fruit salad was a colorful mélange of strawberries, grapes, and melon."],
        "vocabulary_question": "Does the word ███████ describe a single item or a mixture of different things?"
    },
    {
        "word": "melee",
        "meaning": "A confused fight, skirmish, or scuffle.",
        "sentences": ["A melee broke out in the store when the limited-edition toys went on sale."],
        "vocabulary_question": "Is a ██████ a peaceful meeting or a confused, chaotic fight?"
    },
    {
        "word": "melismatic",
        "meaning": "Relating to a style of singing in which a single syllable of text is sung over several different notes.",
        "sentences": ["The singer’s melismatic performance showed off her incredible vocal range."],
        "vocabulary_question": "Does a ███████████ style of singing use one note per syllable or many notes per syllable?"
    },
    {
        "word": "mendacious",
        "meaning": "Not telling the truth; lying.",
        "sentences": ["The mendacious witness was eventually caught when the video evidence proved he was lying."],
        "vocabulary_question": "Is a ██████████ statement perfectly honest or untruthful?"
    },
    {
        "word": "mendicity",
        "meaning": "The condition or practice of being a beggar.",
        "sentences": ["The traveler was struck by the level of mendicity he saw in the crowded city streets."],
        "vocabulary_question": "Does █████████ refer to the state of being a wealthy merchant or a beggar?"
    },
    {
        "word": "meningitis",
        "meaning": "Inflammation of the membranes enclosing the brain and spinal cord.",
        "sentences": ["The doctor checked for a stiff neck, which is a common symptom of meningitis."],
        "vocabulary_question": "Is ██████████ a type of skin rash or a serious inflammation around the brain and spine?"
    },
    {
        "word": "Mennonites",
        "meaning": "Members of a Christian group known for their commitment to non-violence and simple living.",
        "sentences": ["The local community of Mennonites is famous for their beautifully handcrafted furniture."],
        "vocabulary_question": "Are ██████████ known for living a very flashy, modern life or a simple, traditional one?"
    },
    {
        "word": "mephitic",
        "meaning": "Foul-smelling; noxious.",
        "sentences": ["A mephitic odor rose from the stagnant swamp water."],
        "vocabulary_question": "Is a ████████ smell pleasant like a flower or foul and stinky?"
    },
    {
        "word": "merganser",
        "meaning": "A type of fish-eating duck with a slim, hooked beak.",
        "sentences": ["We watched a hooded merganser dive under the water to catch a small fish."],
        "vocabulary_question": "Is a █████████ a type of duck or a type of mountain goat?"
    },
    {
        "word": "meridian",
        "meaning": "A circle of constant longitude passing through a given place on the earth's surface and the terrestrial poles.",
        "sentences": ["The Prime Meridian is the line of 0° longitude that passes through Greenwich, England."],
        "vocabulary_question": "Does a ████████ represent a line of latitude or a line of longitude?"
    },
    {
        "word": "merino",
        "meaning": "A breed of sheep with long, fine wool; or the yarn made from this wool.",
        "sentences": ["She wore a soft merino wool sweater to stay warm in the winter."],
        "vocabulary_question": "Is ██████ a type of fine wool or a type of rough cotton?"
    },
    {
        "word": "mesial",
        "meaning": "Relating to or directed toward the middle line of the body.",
        "sentences": ["The dentist noted that the cavity was on the mesial surface of the tooth."],
        "vocabulary_question": "Does ██████ describe something toward the outside of the body or toward the middle?"
    },
    {
        "word": "Mesopotamian",
        "meaning": "Relating to Mesopotamia, an ancient region between the Tigris and Euphrates rivers.",
        "sentences": ["We studied the Mesopotamian invention of the wheel in history class."],
        "vocabulary_question": "Is a ████████████ artifact from an ancient region in the Middle East or from modern Australia?"
    },
    {
        "word": "metaphorically",
        "meaning": "In a way that uses a metaphor (something used as a symbol rather than being literal).",
        "sentences": ["When he said he was 'drowning in homework,' he was speaking metaphorically."],
        "vocabulary_question": "If you speak ██████████████, are you being 100% literal or using a symbolic comparison?"
    },
    {
        "word": "metaplasia",
        "meaning": "Abnormal change in the nature of a tissue.",
        "sentences": ["The doctor explained that the metaplasia in the patient's cells was a response to chronic irritation."],
        "vocabulary_question": "Does ██████████ relate to the growth of hair or a change in the nature of body tissue?"
    },
    {
        "word": "metastasize",
        "meaning": "The spread of a cancer from one part of the body to another.",
        "sentences": ["The goal of the treatment was to prevent the tumor from beginning to metastasize."],
        "vocabulary_question": "Does to ███████████ mean to stay in one spot or to spread to other parts of the body?"
    },
    {
        "word": "metatarsal",
        "meaning": "Relating to the bones in the foot between the ankle and the toes.",
        "sentences": ["The athlete was out for the season with a fractured metatarsal."],
        "vocabulary_question": "Is a ██████████ bone found in the foot or in the hand?"
    },
    {
        "word": "Michaelmas",
        "meaning": "The feast of St. Michael, celebrated on September 29th.",
        "sentences": ["In some traditions, Michaelmas marks the beginning of the autumn harvest."],
        "vocabulary_question": "Is ██████████ a spring festival or a feast celebrated in late September?"
    },
    {
        "word": "MIDI",
        "meaning": "Musical Instrument Digital Interface; a standard for connecting electronic musical instruments to computers.",
        "sentences": ["The producer used a MIDI keyboard to record the drum parts for the song."],
        "vocabulary_question": "Is ████ a tool used for digital music or a tool used for gardening?"
    },
    {
        "word": "millennial",
        "meaning": "Relating to a period of a thousand years; or relating to the generation born between 1981 and 1996.",
        "sentences": ["The museum's new exhibit focuses on millennial changes in the local environment."],
        "vocabulary_question": "Does ██████████ relate to a period of one hundred years or one thousand years?"
    },
    {
        "word": "millet",
        "meaning": "A fast-growing cereal plant that is grown in warm countries and produces small seeds used for food.",
        "sentences": ["The bread was made from a blend of wheat and ground millet."],
        "vocabulary_question": "Is ██████ a type of grain used for food or a type of stone used for building?"
    },
    {
        "word": "millisecond",
        "meaning": "One thousandth of a second.",
        "sentences": ["The high-speed camera can take a photo in a single millisecond."],
        "vocabulary_question": "Is a ███████████ longer or shorter than a full second?"
    },
    {
        "word": "milonga",
        "meaning": "A Spanish-American ballroom dance similar to the tango; or a place where such a dance happens.",
        "sentences": ["The dancers moved gracefully across the floor during the Friday night milonga."],
        "vocabulary_question": "Is a ███████ a type of dance or a type of dessert?"
    },
    {
        "word": "milquetoast",
        "meaning": "A person who is timid, meek, or unassertive.",
        "sentences": ["He was too much of a milquetoast to complain when the waiter brought the wrong order."],
        "vocabulary_question": "Is a ██████████ person very brave and loud or very timid and meek?"
    },
    {
        "word": "minacious",
        "meaning": "Menacing; threatening.",
        "sentences": ["The dark, minacious clouds suggested that a severe storm was approaching."],
        "vocabulary_question": "Do █████████ clouds look bright and sunny or dark and threatening?"
    },
    {
        "word": "minestra",
        "meaning": "A thick Italian soup, usually containing vegetables and pasta.",
        "sentences": ["For the first course, we were served a warm, savory minestra."],
        "vocabulary_question": "Is ████████ a type of thick Italian soup or a type of sweet cake?"
    },
    {
        "word": "minette",
        "meaning": "A type of volcanic rock found in small dikes.",
        "sentences": ["The geologist collected samples of minette from the edge of the ancient volcano."],
        "vocabulary_question": "Is ███████ a type of rock or a type of clothing?"
    },
    {
        "word": "minuscule",
        "meaning": "Extremely small; tiny.",
        "sentences": ["Even a minuscule amount of dust can ruin the sensitive computer chip."],
        "vocabulary_question": "Is something █████████ massive and huge or extremely small?"
    },
    {
        "word": "Miranda",
        "meaning": "Relating to the legal requirement that a person be informed of their rights upon arrest.",
        "sentences": ["The officer read the suspect his Miranda rights before asking any questions."],
        "vocabulary_question": "Does ███████ relate to legal rights during arrest or the rules of a sport?"
    },
    {
        "word": "misnomer",
        "meaning": "A wrong or inaccurate name or designation.",
        "sentences": ["Calling a 'firefly' a 'fly' is a misnomer, as it is actually a type of beetle."],
        "vocabulary_question": "Is a ████████ a perfectly accurate name or a wrong/inaccurate one?"
    },
    {
        "word": "mitigative",
        "meaning": "Tending to make something less severe, serious, or painful.",
        "sentences": ["The city implemented mitigative measures to reduce the impact of the flood."],
        "vocabulary_question": "Does a ██████████ action make a problem worse or less severe?"
    },
    {
        "word": "moano",
        "meaning": "A species of goatfish found in the Indo-Pacific, often used in cooking.",
        "sentences": ["The fisherman caught a bright red moano near the coral reef."],
        "vocabulary_question": "Is a █████ a type of tropical fish or a type of mountain goat?"
    },
    {
        "word": "mochi",
        "meaning": "A Japanese rice cake made of a short-grain glutinous rice pounded into paste.",
        "sentences": ["For dessert, we had sweet mochi filled with red bean paste."],
        "vocabulary_question": "Is █████ a type of Japanese rice cake or a type of spicy noodle?"
    },
    {
        "word": "moissanite",
        "meaning": "A rare, naturally occurring mineral (silicon carbide) often used as a diamond substitute in jewelry.",
        "sentences": ["The ring sparkled brilliantly because it was set with a clear moissanite."],
        "vocabulary_question": "Is ██████████ a type of mineral used in jewelry or a type of soft fabric?"
    },
    {
        "word": "mollify",
        "meaning": "To soothe in temper or attitude; to soften or appease.",
        "sentences": ["The manager tried to mollify the angry customer by offering a full refund."],
        "vocabulary_question": "When you ███████ someone, are you trying to make them angrier or to calm them down?"
    },
    {
        "word": "monitory",
        "meaning": "Giving or serving as a warning.",
        "sentences": ["The lighthouse sent out a monitory signal to warn ships of the hidden rocks."],
        "vocabulary_question": "Is a ████████ signal meant to welcome visitors or to give a warning?"
    },
    {
        "word": "monochrome",
        "meaning": "A photograph or picture developed or executed in black and white or in varying tones of only one color.",
        "sentences": ["The artist chose a monochrome style for the sketch to focus on shadows and light."],
        "vocabulary_question": "Is a ██████████ image full of many bright colors or just one color/tone?"
    },
    {
        "word": "monoclonal",
        "meaning": "Produced from a single clone of cells; specifically relating to antibodies.",
        "sentences": ["Doctors used monoclonal antibodies to help the patient's immune system fight the virus."],
        "vocabulary_question": "Does ██████████ relate to something made from many different sources or a single cell clone?"
    },
    {
        "word": "monture",
        "meaning": "A frame, setting, or mounting, especially for a jewel or a wig.",
        "sentences": ["The jeweler carefully placed the diamond into its gold monture."],
        "vocabulary_question": "Is a ███████ a type of horse or a setting used for a piece of jewelry?"
    },
    {
        "word": "moratorium",
        "meaning": "A temporary prohibition of an activity.",
        "sentences": ["The government declared a moratorium on fishing in the bay to allow the population to recover."],
        "vocabulary_question": "Is a ██████████ a permanent ban or a temporary pause of an activity?"
    },
    {
        "word": "mordant",
        "meaning": "Having or showing a sharp or critical quality; biting; or a substance used to fix dyes on fabric.",
        "sentences": ["The critic was known for his mordant wit and sharp reviews."],
        "vocabulary_question": "Does a ███████ sense of humor seem very gentle or very sharp and biting?"
    },
    {
        "word": "morphological",
        "meaning": "Relating to the branch of biology that deals with the form of living organisms.",
        "sentences": ["Scientists studied the morphological differences between the two species of birds."],
        "vocabulary_question": "Does █████████████ relate to the way an organism is shaped or the way it thinks?"
    },
    {
        "word": "mortician",
        "meaning": "An undertaker; a person whose business is preparing dead bodies for burial or cremation.",
        "sentences": ["The family met with the mortician to discuss the arrangements for the funeral."],
        "vocabulary_question": "Does a █████████ work at a school or at a funeral home?"
    },
    {
        "word": "Motrin",
        "meaning": "A brand name for ibuprofen, used to treat pain and fever.",
        "sentences": ["The doctor recommended Motrin to help reduce the child's fever."],
        "vocabulary_question": "Is ██████ a brand of pain medication or a brand of breakfast cereal?"
    },
    {
        "word": "movimento",
        "meaning": "A movement in music; or a style characterized by movement.",
        "sentences": ["The orchestra began the first movimento of the symphony with great energy."],
        "vocabulary_question": "In a music class, does █████████ relate to a section of a song or a type of instrument?"
    },
    {
        "word": "mozzarella",
        "meaning": "A mild, semi-soft white Italian cheese, traditionally made from water buffalo milk.",
        "sentences": ["The pizza was topped with fresh basil and slices of melted mozzarella."],
        "vocabulary_question": "Is ██████████ a type of cheese or a type of spicy sausage?"
    },
    {
        "word": "muchacha",
        "meaning": "A young girl or woman; a female servant.",
        "sentences": ["The little muchacha ran through the market to buy some fresh fruit."],
        "vocabulary_question": "In Spanish, does the word ████████ refer to a young girl or an old man?"
    },
    {
        "word": "mulligan",
        "meaning": "In golf, an extra stroke allowed after a poor shot, not counted on the scorecard; or a stew.",
        "sentences": ["His friends were kind enough to let him take a mulligan after his ball landed in the water."],
        "vocabulary_question": "Is a ████████ an extra chance in a game or a type of heavy winter boot?"
    },
    {
        "word": "multivoltine",
        "meaning": "Producing several broods or generations in a single year.",
        "sentences": ["The silkworm is a multivoltine insect, hatching many times during the warm months."],
        "vocabulary_question": "Does a ████████████ species have one generation per year or several?"
    },
    {
        "word": "Munich",
        "meaning": "The capital and most populous city of the German state of Bavaria.",
        "sentences": ["We visited the historic town square while we were staying in Munich."],
        "vocabulary_question": "Is ██████ a city in Germany or a city in France?"
    },
    {
        "word": "municipal",
        "meaning": "Relating to a city or town or its governing body.",
        "sentences": ["The municipal park is maintained by the local city government."],
        "vocabulary_question": "Does the word █████████ relate to a city government or a national government?"
    },
    {
        "word": "muskeg",
        "meaning": "A North American swamp or bog consisting of a mixture of water and partly dead vegetation.",
        "sentences": ["The trail became difficult as it passed through the soggy, moss-covered muskeg."],
        "vocabulary_question": "Is a ██████ a type of dry desert or a type of swampy bog?"
    },
    {
        "word": "musketeers",
        "meaning": "Soldiers armed with muskets; or members of a royal guard.",
        "sentences": ["The Three Musketeers are famous for their motto: 'One for all, and all for one!'"],
        "vocabulary_question": "Were ██████████ early soldiers or modern-day computer programmers?"
    },
    {
        "word": "muumuu",
        "meaning": "A woman's loose, brightly colored dress, especially one of a pattern based on Hawaiian designs.",
        "sentences": ["She wore a floral muumuu to the tropical-themed party."],
        "vocabulary_question": "Is a ██████ a type of loose dress or a type of tight-fitting shoe?"
    },
    {
        "word": "Mylar",
        "meaning": "A brand name for a strong, thin polyester film, often used for balloons.",
        "sentences": ["The birthday party was decorated with shiny silver Mylar balloons."],
        "vocabulary_question": "Is █████ a type of thin film used for balloons or a type of heavy stone?"
    },
    {
        "word": "myocarditis",
        "meaning": "Inflammation of the heart muscle.",
        "sentences": ["The athlete took time off to recover after being diagnosed with myocarditis."],
        "vocabulary_question": "Does ████████████ affect the heart or the lungs?"
    },
    {
        "word": "myoglobin",
        "meaning": "A red protein containing heme, which carries and stores oxygen in muscle cells.",
        "sentences": ["Whales have high levels of myoglobin, allowing them to stay underwater for a long time."],
        "vocabulary_question": "Does █████████ help store oxygen in the muscles or digest food in the stomach?"
    },
    {
        "word": "myopic",
        "meaning": "Lacking in foresight or keenness of insight; nearsighted.",
        "sentences": ["The company's myopic focus on short-term profits led to its eventual failure."],
        "vocabulary_question": "Does a ██████ view of the future show great foresight or a lack of insight?"
    },
    {
        "word": "mythopoeic",
        "meaning": "Relating to the making of myths; myth-making.",
        "sentences": ["J.R.R. Tolkien is famous for his mythopoeic ability to create entire legendary worlds."],
        "vocabulary_question": "Does a ██████████ author create factual history books or legendary myths?"
    },
    {
        "word": "nabobs",
        "meaning": "People of unusual prominence, wealth, or influence in a particular field.",
        "sentences": ["The tech nabobs gathered in Silicon Valley to discuss the future of the internet."],
        "vocabulary_question": "Are ██████ people who are completely unknown or people of great prominence and wealth?"
    },
    {
        "word": "Namibian",
        "meaning": "Relating to Namibia, a country in southwest Africa.",
        "sentences": ["The Namibian landscape is famous for its towering orange sand dunes."],
        "vocabulary_question": "Is a ████████ person from a country in Africa or a country in South America?"
    },
    {
        "word": "narcoleptic",
        "meaning": "Relating to a condition characterized by an extreme tendency to fall asleep whenever in relaxing surroundings.",
        "sentences": ["The narcoleptic dog would suddenly fall fast asleep in the middle of a game of fetch."],
        "vocabulary_question": "Does a ██████████ person have trouble falling asleep or do they fall asleep too easily?"
    },
    {
        "word": "nauplius",
        "meaning": "The first larval stage of many crustaceans, having an unsegmented body and a single eye.",
        "sentences": ["The biologist used a microscope to observe the tiny nauplius swimming in the seawater."],
        "vocabulary_question": "Is a ████████ an adult lobster or the very first larval stage of a crustacean?"
    },
    {
        "word": "nautilus",
        "meaning": "A cephalopod mollusk with a light, pearly spiral shell divided into chambers.",
        "sentences": ["The chambered nautilus can adjust its depth in the ocean by regulating the gas in its shell."],
        "vocabulary_question": "Does a ████████ have a spiral shell or is it a soft-bodied creature like a slug?"
    },
    {
        "word": "nebulous",
        "meaning": "In the form of a cloud or haze; hazy; or an idea that is vague or ill-defined.",
        "sentences": ["The giant's plans for the future were still a bit nebulous and unformed."],
        "vocabulary_question": "Does a ████████ idea seem very clear and specific or vague and hazy?"
    },
    {
        "word": "nefarious",
        "meaning": "Wicked or criminal (typically of an action or activity).",
        "sentences": ["The detective worked day and night to stop the villain's nefarious plot."],
        "vocabulary_question": "Is a █████████ action one that is helpful and kind or wicked and evil?"
    },
    {
        "word": "negligible",
        "meaning": "So small or unimportant as to be not worth considering; insignificant.",
        "sentences": ["The difference in price between the two apples was negligible, so I picked the red one."],
        "vocabulary_question": "Is a ██████████ amount something that matters a lot or something too small to worry about?"
    },
    {
        "word": "neologism",
        "meaning": "A newly coined word or expression.",
        "sentences": ["The internet is a constant source of neologism, with new slang appearing every day."],
        "vocabulary_question": "Is a ██████████ an ancient, forgotten word or a newly created one?"
    },
    {
        "word": "neophyte",
        "meaning": "A person who is new to a subject, skill, or belief; a beginner.",
        "sentences": ["Even a neophyte in the kitchen can follow this simple recipe for toast."],
        "vocabulary_question": "Is a ████████ an expert in their field or a beginner?"
    },
    {
        "word": "nephology",
        "meaning": "The study of clouds.",
        "sentences": ["Her interest in nephology meant she spent much of the afternoon identifying cumulus and cirrus clouds."],
        "vocabulary_question": "Does █████████ involve the study of the ocean or the study of clouds?"
    },
    {
        "word": "nepotism",
        "meaning": "The practice among those with power or influence of favoring relatives or friends, especially by giving them jobs.",
        "sentences": ["The company was criticized for nepotism after the CEO hired his son as the manager."],
        "vocabulary_question": "Does ████████ involve hiring the most qualified person or favoring one's own relatives?"
    },
    {
        "word": "neroli",
        "meaning": "An essential oil distilled from the blossoms of the bitter orange.",
        "sentences": ["The perfume had a distinct scent of neroli and sandalwood."],
        "vocabulary_question": "Is ██████ an oil made from flower blossoms or a type of spicy pepper?"
    },
    {
        "word": "nettlesome",
        "meaning": "Causing annoyance or difficulty; irritating.",
        "sentences": ["The broken printer proved to be a nettlesome problem for the office staff."],
        "vocabulary_question": "Is a ██████████ task one that is very easy and fun or one that is annoying and difficult?"
    },
    {
        "word": "neurasthenia",
        "meaning": "An ill-defined medical condition characterized by lassitude, fatigue, headache, and irritability, associated with emotional stress.",
        "sentences": ["In the late 19th century, many people were diagnosed with neurasthenia due to the stress of modern life."],
        "vocabulary_question": "Does ████████████ involve feeling very energetic or feeling extremely fatigued and stressed?"
    },
    {
        "word": "neuroplasticity",
        "meaning": "The ability of the brain to form and reorganize synaptic connections, especially in response to learning or experience.",
        "sentences": ["Learning a new language is a great way to take advantage of your brain's neuroplasticity."],
        "vocabulary_question": "Does ████████████████ relate to the brain's ability to change or its tendency to stay the same?"
    },
    {
        "word": "niche",
        "meaning": "A comfortable or suitable position in life or employment; or a shallow recess, especially one in a wall to display a statue.",
        "sentences": ["The small bird found its niche in the ecosystem by eating only specific seeds."],
        "vocabulary_question": "Is a █████ a wide open field or a specific, suitable place for something?"
    },
    {
        "word": "niggling",
        "meaning": "Causing slight but persistent annoyance, discomfort, or anxiety.",
        "sentences": ["He had a niggling suspicion that he had forgotten to turn off the oven."],
        "vocabulary_question": "Is a ████████ feeling one that is huge and overwhelming or small but persistent?"
    },
    {
        "word": "nihilism",
        "meaning": "The rejection of all religious and moral principles, often in the belief that life is meaningless.",
        "sentences": ["The philosopher's early work explored the concepts of nihilism and the search for purpose."],
        "vocabulary_question": "Does ████████ suggest that life has a deep, obvious meaning or that life is meaningless?"
    },
    {
        "word": "nimbostratus",
        "meaning": "A type of dark, gray, shapeless cloud that covers the sky and often brings steady rain or snow.",
        "sentences": ["The thick layer of nimbostratus clouds meant it would be a rainy day at the park."],
        "vocabulary_question": "Is a ████████████ cloud a fluffy white puff or a dark, rainy gray sheet?"
    },
    {
        "word": "nirvana",
        "meaning": "A transcendent state in which there is neither suffering, desire, nor sense of self; a state of perfect happiness.",
        "sentences": ["The peaceful garden felt like a little piece of nirvana in the middle of the busy city."],
        "vocabulary_question": "Is ███████ a state of great stress and anger or a state of perfect peace and happiness?"
    },
    {
        "word": "nitid",
        "meaning": "Bright, shining, or lustrous.",
        "sentences": ["The beetle had a nitid shell that reflected the sunlight like a mirror."],
        "vocabulary_question": "Is a █████ surface dull and matte or bright and shining?"
    },
    {
        "word": "nocturnal",
        "meaning": "Done, occurring, or active at night.",
        "sentences": ["Owls are nocturnal hunters that are most active after the sun goes down."],
        "vocabulary_question": "Is a █████████ animal awake during the day or during the night?"
    },
    {
        "word": "nom de plume",
        "meaning": "A pen name; a name used by a writer instead of their real name.",
        "sentences": ["Mark Twain was the nom de plume of the author Samuel Clemens."],
        "vocabulary_question": "Is a ███ ██ █████ a writer's real name or their pen name?"
    },
    {
        "word": "nomenclature",
        "meaning": "The choosing of names for things, especially in a science or other discipline.",
        "sentences": ["The biology student had to learn the complex nomenclature used to classify different plants."],
        "vocabulary_question": "Does ████████████ relate to the system of naming things or the system of counting them?"
    },
    {
        "word": "nonchalant",
        "meaning": "Feeling or appearing casually calm and relaxed; not displaying anxiety, interest, or enthusiasm.",
        "sentences": ["He gave a nonchalant shrug when asked if he was nervous about the big game."],
        "vocabulary_question": "Is a ██████████ person acting very worried or very calm and relaxed?"
    },
    {
        "word": "nonpareil",
        "meaning": "Having no match or equal; unrivaled.",
        "sentences": ["The chef’s skill was nonpareil, and people traveled for miles to eat his food."],
        "vocabulary_question": "Is a ██████████ person easily replaced or one who has no equal?"
    },
    {
        "word": "notary",
        "meaning": "A person authorized to perform certain legal formalities, especially to draw up or certify contracts and deeds.",
        "sentences": ["We needed a notary to witness the signing of the house deed."],
        "vocabulary_question": "Is a ██████ someone who cleans a house or someone who legally certifies documents?"
    },
    {
        "word": "noumenon",
        "meaning": "In philosophy, a thing as it is in itself, as distinct from a phenomenon (the thing as it is perceived).",
        "sentences": ["Kant's philosophy explores the difference between the phenomenon we see and the noumenon that truly exists."],
        "vocabulary_question": "Does a ████████ represent the way we see a thing or the thing as it is in itself?"
    },
    {
        "word": "noxious",
        "meaning": "Harmful, poisonous, or very unpleasant.",
        "sentences": ["The factory was closed because it was releasing noxious fumes into the air."],
        "vocabulary_question": "Is a ███████ gas healthy to breathe or harmful and poisonous?"
    },
    {
        "word": "nuance",
        "meaning": "A subtle difference in or shade of meaning, expression, or sound.",
        "sentences": ["The actor’s performance was full of nuance, showing many different emotions with just a look."],
        "vocabulary_question": "Is a ██████ a huge, obvious change or a very subtle difference?"
    },
    {
        "word": "nubuck",
        "meaning": "Cattle hide leather that has been rubbed on the outer side to give it a feel like suede.",
        "sentences": ["She cleaned her new nubuck boots with a specialized soft brush."],
        "vocabulary_question": "Is ██████ a type of shiny plastic or a type of soft, rubbed leather?"
    },
    {
        "word": "nugatory",
        "meaning": "Of no value or importance; useless or futile.",
        "sentences": ["The teacher’s efforts to calm the class were nugatory once the fire alarm went off."],
        "vocabulary_question": "Is a ████████ effort one that is very successful or one that is useless?"
    },
    {
        "word": "numismatics",
        "meaning": "The study or collection of coins, paper currency, and medals.",
        "sentences": ["His interest in numismatics led him to search for rare pennies from the 1800s."],
        "vocabulary_question": "Does ████████████ involve collecting coins or collecting stamps?"
    },
    {
        "word": "nurture",
        "meaning": "To care for and encourage the growth or development of someone or something.",
        "sentences": ["The gardener worked hard to nurture the tiny seedlings until they were strong enough to transplant."],
        "vocabulary_question": "When you ███████ a plant, are you ignoring it or helping it grow?"
    },
    {
        "word": "Neapolitan",
        "meaning": "Relating to the city of Naples in Italy, its people, or its culture.",
        "sentences": ["We ordered a traditional Neapolitan pizza with fresh tomatoes and mozzarella."],
        "vocabulary_question": "Does a ██████████ style of cooking come from a city in Italy or a city in France?"
    },
    {
        "word": "nectarine",
        "meaning": "A variety of peach that has a smooth skin without fuzz.",
        "sentences": ["The nectarine was perfectly ripe, sweet, and juicy."],
        "vocabulary_question": "Is a █████████ a type of fuzzy peach or a smooth-skinned fruit?"
    },
    {
        "word": "neonatology",
        "meaning": "The branch of medicine concerned with the treatment and care of newborn babies.",
        "sentences": ["The hospital's department of neonatology provides specialized care for premature infants."],
        "vocabulary_question": "Does ███████████ focus on caring for elderly patients or newborn babies?"
    },
    {
        "word": "neoterism",
        "meaning": "A newly invented word or phrase; a neologism.",
        "sentences": ["The author's writing was filled with clever neoterism that kept the readers engaged."],
        "vocabulary_question": "Is a █████████ an ancient, traditional saying or a newly created word?"
    },
    {
        "word": "nepotism",
        "meaning": "The practice among those with power or influence of favoring relatives or friends, especially by giving them jobs.",
        "sentences": ["The company was accused of nepotism when the manager hired his own brother for the role."],
        "vocabulary_question": "Does ████████ involve hiring people based on their skills or because they are family members?"
    },
    {
        "word": "netiquette",
        "meaning": "The correct or acceptable way of communicating on the internet.",
        "sentences": ["Using all capital letters in an email is considered poor netiquette because it looks like shouting."],
        "vocabulary_question": "Does ██████████ relate to how we behave at a dinner table or how we behave online?"
    },
    {
        "word": "neuropathy",
        "meaning": "Disease or dysfunction of one or more peripheral nerves, typically causing numbness or weakness.",
        "sentences": ["The patient experienced tingling in her feet due to diabetic neuropathy."],
        "vocabulary_question": "Does ██████████ affect the body's digestive system or the nervous system?"
    },
    {
        "word": "neuroticism",
        "meaning": "A personality trait characterized by anxiety, fear, moodiness, and physical complaints.",
        "sentences": ["In psychology, neuroticism is often measured to understand how people handle stress."],
        "vocabulary_question": "Does ███████████ describe a state of being perfectly calm or a tendency toward anxiety?"
    },
    {
        "word": "Newfoundland",
        "meaning": "A large island off the east coast of Canada; or a breed of large, strong dogs with a thick coat.",
        "sentences": ["The Newfoundland dog is famous for its life-saving abilities in the water."],
        "vocabulary_question": "Is a ████████████ a type of small cat or a breed of very large, strong dog?"
    },
    {
        "word": "nicad",
        "meaning": "A type of rechargeable battery containing nickel and cadmium.",
        "sentences": ["The old cordless phone used a nicad battery that eventually stopped holding a charge."],
        "vocabulary_question": "Is █████ a type of rechargeable battery or a type of garden soil?"
    },
    {
        "word": "nitrate",
        "meaning": "A chemical compound used as a fertilizer or for preserving meat.",
        "sentences": ["Farmers apply nitrate to the fields to help the crops grow faster."],
        "vocabulary_question": "Is ███████ a chemical used for building skyscrapers or for helping plants grow?"
    },
    {
        "word": "nocive",
        "meaning": "Harmful or poisonous; injurious.",
        "sentences": ["The scientists warned that the factory waste was nocive to the local wildlife."],
        "vocabulary_question": "Is a ██████ substance healthy for you or harmful and injurious?"
    },
    {
        "word": "noctambulist",
        "meaning": "A sleepwalker.",
        "sentences": ["The noctambulist was found wandering the hallway at midnight while still fast asleep."],
        "vocabulary_question": "Is a █████████████ someone who sleeps during the day or someone who walks in their sleep?"
    },
    {
        "word": "no-goodnik",
        "meaning": "A person who is lazy, irresponsible, or dishonest; a good-for-nothing.",
        "sentences": ["The villain in the cartoon was a real no-goodnik who was always trying to cheat."],
        "vocabulary_question": "Is a ██-███████ a very helpful citizen or a lazy, irresponsible person?"
    },
    {
        "word": "nomancy",
        "meaning": "Divination by means of letters (such as those in a person's name).",
        "sentences": ["The ancient fortune teller practiced nomancy to predict the future based on a name."],
        "vocabulary_question": "Does ███████ involve using stars to tell the future or the letters in a name?"
    },
    {
        "word": "nomenclature",
        "meaning": "The choosing of names for things, especially in a science or other discipline.",
        "sentences": ["Chemical nomenclature uses specific rules to name every unique compound."],
        "vocabulary_question": "Does ████████████ relate to the system of naming things or the system of painting them?"
    },
    {
        "word": "nomophobia",
        "meaning": "Fear or anxiety caused by being without a working mobile phone.",
        "sentences": ["I felt a surge of nomophobia when I realized I had left my phone at the grocery store."],
        "vocabulary_question": "Does ██████████ refer to a fear of public speaking or a fear of being without a cell phone?"
    },
    {
        "word": "nonage",
        "meaning": "The period of being under the legal age of adulthood.",
        "sentences": ["In his nonage, the young king was assisted by a group of advisors."],
        "vocabulary_question": "Does ██████ describe the time after retirement or the time before reaching legal adulthood?"
    },
    {
        "word": "nonchalance",
        "meaning": "A display or air of jaunty unconcern or indifference.",
        "sentences": ["She shrugged with total nonchalance when she heard the surprising news."],
        "vocabulary_question": "Is ███████████ a sign of extreme panic or a display of calm indifference?"
    },
    {
        "word": "nonvolatile",
        "meaning": "Not easily evaporated; or in computing, memory that retains data when the power is turned off.",
        "sentences": ["A USB drive is a type of nonvolatile storage because it keeps your files without power."],
        "vocabulary_question": "Does ███████████ memory lose its data when the computer is shut down?"
    },
    {
        "word": "Norovirus",
        "meaning": "A highly contagious virus that causes vomiting and diarrhea.",
        "sentences": ["The school was closed for a day to clean after an outbreak of Norovirus."],
        "vocabulary_question": "Is █████████ a type of contagious virus or a type of spicy seasoning?"
    },
    {
        "word": "Nostradamus",
        "meaning": "A 16th-century French physician and reputed seer who published famous collections of prophecies.",
        "sentences": ["Many people still study the mysterious verses written by Nostradamus."],
        "vocabulary_question": "Was ███████████ a famous explorer or a man known for his prophecies?"
    },
    {
        "word": "notoriety",
        "meaning": "The state of being famous or well known for some bad quality or deed.",
        "sentences": ["The thief gained notoriety after escaping from prison three times."],
        "vocabulary_question": "Is █████████ fame for doing something good or fame for doing something bad?"
    },
    {
        "word": "novemdecillion",
        "meaning": "The number 1 followed by 60 zeros.",
        "sentences": ["The mathematician explained that a novemdecillion is an unimaginably large number."],
        "vocabulary_question": "Is a ██████████████ a very small fraction or an incredibly large number?"
    },
    {
        "word": "noxious",
        "meaning": "Harmful, poisonous, or very unpleasant.",
        "sentences": ["The gas mask protected the workers from the noxious fumes in the cave."],
        "vocabulary_question": "Is a ███████ gas refreshing to breathe or poisonous and harmful?"
    },
    {
        "word": "Nubia",
        "meaning": "An ancient region in northeastern Africa, along the Nile River.",
        "sentences": ["We learned about the powerful pharaohs who ruled ancient Nubia."],
        "vocabulary_question": "Is █████ an ancient region in Africa or a modern city in Europe?"
    },
    {
        "word": "nubuck",
        "meaning": "Cattle hide leather that has been rubbed on the outer side to give it a feel like suede.",
        "sentences": ["He bought a pair of brown nubuck shoes for the hiking trip."],
        "vocabulary_question": "Is ██████ a type of shiny plastic or a type of soft leather?"
    },
    {
        "word": "nuciform",
        "meaning": "Shaped like a nut.",
        "sentences": ["The small, nuciform seeds were scattered across the forest floor."],
        "vocabulary_question": "Does ████████ describe something shaped like a nut or something shaped like a star?"
    },
    {
        "word": "nucleated",
        "meaning": "Having a nucleus.",
        "sentences": ["Under the microscope, the scientist identified several nucleated cells."],
        "vocabulary_question": "Does a █████████ cell have a center nucleus or is it empty?"
    },
    {
        "word": "numerology",
        "meaning": "The branch of knowledge that deals with the occult significance of numbers.",
        "sentences": ["She was interested in numerology and how her birth date might influence her personality."],
        "vocabulary_question": "Does ██████████ relate to the study of numbers or the study of insects?"
    },
    {
        "word": "nutation",
        "meaning": "A periodic oscillation (wobbling) of the earth's axis; or the drooping or nodding of a flower head.",
        "sentences": ["Astronomers must account for nutation when tracking the precise positions of distant stars."],
        "vocabulary_question": "Does ████████ involve a steady, straight movement or a slight wobbling/nodding motion?"
    },
    {
        "word": "nutria",
        "meaning": "A large South American aquatic rodent now naturalized in parts of the U.S.",
        "sentences": ["The nutria looks like a small beaver with a long, thin tail instead of a flat one."],
        "vocabulary_question": "Is a ██████ a type of aquatic rodent or a type of colorful mountain bird?"
    },
    {
        "word": "nuzzer",
        "meaning": "An offering or present made by an inferior to a superior (especially in India).",
        "sentences": ["The local official presented a traditional nuzzer to the visiting dignitary."],
        "vocabulary_question": "Is a ██████ a type of gift or a type of heavy stone tool?"
    },
    {
        "word": "obie",
        "meaning": "An award given for achievements in off-Broadway theater.",
        "sentences": ["The playwright was thrilled to win an Obie for her latest experimental production."],
        "vocabulary_question": "Is an ████ an award for theater or an award for scientific discovery?"
    },
    {
        "word": "oblast",
        "meaning": "An administrative division or region in Russia and some other former Soviet republics.",
        "sentences": ["The traveler crossed the border from one Russian oblast into the next."],
        "vocabulary_question": "Is an ██████ a type of political region or a type of traditional food?"
    },
    {
        "word": "oblique",
        "meaning": "Having a slanting direction or position; neither parallel nor at a right angle.",
        "sentences": ["The artist drew a series of oblique lines to create a sense of depth in the sketch."],
        "vocabulary_question": "Does an ██████ line go straight up and down or is it slanting?"
    },
    {
        "word": "obloquy",
        "meaning": "Strong public criticism or verbal abuse; disgrace brought by such criticism.",
        "sentences": ["The athlete faced massive obloquy after he was caught cheating during the race."],
        "vocabulary_question": "Is ████████ a form of public praise or public verbal abuse?"
    },
    {
        "word": "obnebulate",
        "meaning": "To cloud over; to darken or obscure.",
        "sentences": ["The heavy fog began to obnebulate the distant mountain peaks."],
        "vocabulary_question": "When you ██████████ something, are you making it clearer or obscuring it with clouds?"
    },
    {
        "word": "obsecration",
        "meaning": "The act of earnest entreaty or prayer; a formal petition.",
        "sentences": ["The crowd's obsecration for peace could be heard throughout the city square."],
        "vocabulary_question": "Is an ███████████ a type of angry demand or a sincere prayer/entreaty?"
    },
    {
        "word": "obsolete",
        "meaning": "No longer produced or used; out of date.",
        "sentences": ["The introduction of the smartphone made the dedicated MP3 player almost obsolete."],
        "vocabulary_question": "Is an ████████ item brand new or no longer in use?"
    },
    {
        "word": "obstetrician",
        "meaning": "A doctor who specializes in pregnancy, childbirth, and a woman's care during those times.",
        "sentences": ["The obstetrician used an ultrasound to check on the health of the growing baby."],
        "vocabulary_question": "Does an ████████████ specialize in heart surgery or in childbirth?"
    },
    {
        "word": "obstinacy",
        "meaning": "Firm and usually unreasonable adherence to an opinion, purpose, or system; stubbornness.",
        "sentences": ["Despite the clear map, his obstinacy kept us from admitting we were lost."],
        "vocabulary_question": "Does █████████ describe a person who is very flexible or very stubborn?"
    },
    {
        "word": "obstreperous",
        "meaning": "Noisy and difficult to control; unruly.",
        "sentences": ["The teacher had a hard time quieting the obstreperous class after the long break."],
        "vocabulary_question": "Is an ████████████ group very quiet or noisy and hard to manage?"
    },
    {
        "word": "occultation",
        "meaning": "The disappearance of one heavenly body behind another, such as when the moon passes in front of a star.",
        "sentences": ["The amateur astronomers gathered to witness the rare occultation of Mars by the moon."],
        "vocabulary_question": "Does an ███████████ involve one object hiding behind another or two objects colliding?"
    },
    {
        "word": "Oceanian",
        "meaning": "Relating to Oceania, a region made up of thousands of islands throughout the Central and South Pacific.",
        "sentences": ["The museum featured a beautiful collection of traditional Oceanian art."],
        "vocabulary_question": "Does an ████████ artifact come from the Pacific Islands or from the mountains of Europe?"
    },
    {
        "word": "octogenarian",
        "meaning": "A person who is between 80 and 89 years old.",
        "sentences": ["The active octogenarian still walks three miles every morning."],
        "vocabulary_question": "Is an ████████████ a person in their fifties or in their eighties?"
    },
    {
        "word": "octonocular",
        "meaning": "Having eight eyes.",
        "sentences": ["Most spiders are octonocular, allowing them to spot movement in almost any direction."],
        "vocabulary_question": "Does an ███████████ creature have two eyes or eight eyes?"
    },
    {
        "word": "octuplicate",
        "meaning": "To make eight copies of something.",
        "sentences": ["The clerk had to octuplicate the form to ensure every department had a copy."],
        "vocabulary_question": "If you ███████████ a document, are you making two copies or eight?"
    },
    {
        "word": "odist",
        "meaning": "A person who writes odes (a type of lyrical poem).",
        "sentences": ["The famous odist recited a poem dedicated to the beauty of the harvest moon."],
        "vocabulary_question": "Is an █████ a person who writes poetry or a person who paints houses?"
    },
    {
        "word": "odometer",
        "meaning": "An instrument for measuring the distance traveled by a vehicle.",
        "sentences": ["I checked the odometer and realized we had driven over 300 miles on our road trip."],
        "vocabulary_question": "Does an ████████ measure the speed of a car or the distance it has traveled?"
    },
    {
        "word": "Odysseus",
        "meaning": "The hero of Homer's epic poem the Odyssey, known for his cleverness and long journey home.",
        "sentences": ["It took Odysseus ten years to return to Ithaca after the Trojan War."],
        "vocabulary_question": "Was ████████ an ancient Greek hero or an ancient Roman emperor?"
    },
    {
        "word": "oecist",
        "meaning": "The founder of an ancient Greek colony.",
        "sentences": ["The statue in the town square honored the oecist who first established the city."],
        "vocabulary_question": "Is an ██████ a founder of a colony or a type of traditional soldier?"
    },
    {
        "word": "officinal",
        "meaning": "Relating to a medicine or herbal remedy available in a chemist's or druggist's shop.",
        "sentences": ["The botanist studied the officinal properties of various rainforest plants."],
        "vocabulary_question": "Does the word █████████ relate to medical remedies or to government offices?"
    },
    {
        "word": "Oglala",
        "meaning": "A member of a group of Teton Sioux people of South Dakota.",
        "sentences": ["The history book discussed the leadership of Crazy Horse within the Oglala Lakota."],
        "vocabulary_question": "Is the ██████ a group of indigenous North American people or a group from ancient Egypt?"
    },
    {
        "word": "okapi",
        "meaning": "A large African mammal that is the closest living relative of the giraffe, but with a shorter neck and zebra-like stripes on its legs.",
        "sentences": ["Although it has stripes like a zebra, the okapi is actually part of the giraffe family."],
        "vocabulary_question": "Is an █████ more closely related to a giraffe or to a horse?"
    },
    {
        "word": "oleo",
        "meaning": "Margarine (a butter substitute).",
        "sentences": ["The old recipe called for two tablespoons of oleo instead of butter."],
        "vocabulary_question": "Is ████ a type of butter substitute or a type of cooking oil made from corn?"
    },
    {
        "word": "olfactory",
        "meaning": "Relating to or connected with the sense of smell.",
        "sentences": ["Bloodhounds have an incredible olfactory sense that allows them to track scents for miles."],
        "vocabulary_question": "Does the █████████ nerve help you see or help you smell?"
    },
    {
        "word": "olingo",
        "meaning": "A small, nocturnal, tree-dwelling mammal found in the rainforests of Central and South America.",
        "sentences": ["The olingo used its long tail for balance as it leaped between the trees at night."],
        "vocabulary_question": "Is an ██████ a tree-dwelling mammal or a type of large desert lizard?"
    },
    {
        "word": "omnilegent",
        "meaning": "Reading or having read everything; having extremely wide-ranging knowledge from reading.",
        "sentences": ["The professor was practically omnilegent, able to quote books from almost any subject."],
        "vocabulary_question": "Is an ██████████ person someone who reads very little or someone who has read almost everything?"
    },
    {
        "word": "omniscient",
        "meaning": "Knowing everything.",
        "sentences": ["In the story, the narrator was omniscient, knowing the thoughts of every character."],
        "vocabulary_question": "Is an ██████████ being someone who is always learning or someone who already knows everything?"
    },
    {
        "word": "onus",
        "meaning": "Used to refer to something that is one's duty or responsibility.",
        "sentences": ["The onus is on the player to ensure they arrive at the stadium on time."],
        "vocabulary_question": "Does the ████ describe a person's heavy burden of responsibility or a lighthearted hobby?"
    },
    {
        "word": "oompah",
        "meaning": "The rhythmical sound of deep-toned brass instruments in a band.",
        "sentences": ["The town square was filled with the cheerful oompah of the local tuba players."],
        "vocabulary_question": "Is ██████ the sound made by a high-pitched flute or a deep-toned brass instrument?"
    },
    {
        "word": "opacity",
        "meaning": "The condition of lacking transparency or translucence; being opaque.",
        "sentences": ["The curtains were chosen for their opacity, ensuring no light would wake the baby."],
        "vocabulary_question": "If a window has high ███████, can you see through it clearly or is it impossible to see through?"
    },
    {
        "word": "opaleye",
        "meaning": "A sea chub fish found in the Pacific, known for its bright blue or green eyes.",
        "sentences": ["The fisherman caught an opaleye and marveled at its strikingly colorful eyes."],
        "vocabulary_question": "Is an ███████ a type of ocean fish or a type of precious gemstone?"
    },
    {
        "word": "operose",
        "meaning": "Involving or displaying much industry or effort; laborious.",
        "sentences": ["Building the stone wall by hand was an operose task that took all summer."],
        "vocabulary_question": "Is an ███████ task one that is very easy or one that requires a lot of hard work?"
    },
    {
        "word": "ophthalmologist",
        "meaning": "A specialist in the branch of medicine concerned with the study and treatment of disorders and diseases of the eye.",
        "sentences": ["The ophthalmologist used a special light to examine the retina of the patient’s eye."],
        "vocabulary_question": "Does an ███████████████ treat the ears and throat or the eyes?"
    },
    {
        "word": "opprobrious",
        "meaning": "Expressing scorn or criticism.",
        "sentences": ["The politician was criticized for his opprobrious remarks about his opponent."],
        "vocabulary_question": "Are ███████████ comments full of praise or full of scorn and criticism?"
    },
    {
        "word": "oppugn",
        "meaning": "To challenge the accuracy, propriety, or other quality of; to call into question.",
        "sentences": ["It is difficult to oppugn the facts when they are backed by scientific evidence."],
        "vocabulary_question": "When you ██████ an idea, are you agreeing with it or challenging its accuracy?"
    },
    {
        "word": "Orion",
        "meaning": "A prominent constellation located on the celestial equator and visible throughout the world, named after a hunter in Greek mythology.",
        "sentences": ["You can easily spot Orion in the winter sky by looking for the three stars in his belt."],
        "vocabulary_question": "Is █████ a famous constellation shaped like a hunter or a constellation shaped like a crab?"
    },
    {
        "word": "orthogonal",
        "meaning": "Of or relating to right angles; at right angles.",
        "sentences": ["The architect ensured that all the supporting beams were orthogonal to the floor."],
        "vocabulary_question": "Are ██████████ lines parallel to each other or at right angles to each other?"
    },
    {
        "word": "orthros",
        "meaning": "In the Eastern Orthodox Church, the early morning service of prayer.",
        "sentences": ["The bells rang at dawn to signal the beginning of the orthros."],
        "vocabulary_question": "Is an ███████ a late-night feast or an early morning prayer service?"
    },
    {
        "word": "oscitation",
        "meaning": "The act of yawning; or a state of drowsiness or inattention.",
        "sentences": ["His constant oscitation during the lecture showed he hadn't slept enough the night before."],
        "vocabulary_question": "Is ██████████ the act of yawning or the act of running?"
    },
    {
        "word": "osculatory",
        "meaning": "Relating to or connected with kissing.",
        "sentences": ["The movie ended with an osculatory scene as the heroes reunited."],
        "vocabulary_question": "Does the word ██████████ relate to the act of kissing or the act of singing?"
    },
    {
        "word": "Osloite",
        "meaning": "A native or inhabitant of Oslo, the capital of Norway.",
        "sentences": ["As a lifelong Osloite, he was very used to cold winters and snowy streets."],
        "vocabulary_question": "Is an ███████ from the capital of Norway or the capital of Sweden?"
    },
    {
        "word": "osmium",
        "meaning": "A hard, brittle, bluish-white transition metal in the platinum group; it is the densest naturally occurring element.",
        "sentences": ["Osmium is so dense that a small brick of it would be incredibly heavy to lift."],
        "vocabulary_question": "Is ███████ a type of lightweight gas or the densest naturally occurring metal?"
    },
    {
        "word": "osprey",
        "meaning": "A large fish-eating bird of prey with long, narrow wings and a white underside.",
        "sentences": ["The osprey dived into the lake and emerged with a trout in its talons."],
        "vocabulary_question": "Is an ██████ a type of desert lizard or a large fish-eating bird of prey?"
    },
    {
        "word": "ossicle",
        "meaning": "A very small bone, especially one of the three bones in the middle ear.",
        "sentences": ["The surgeon carefully repaired the tiny ossicle to restore the patient's hearing."],
        "vocabulary_question": "Is an ███████ a massive leg bone or a tiny bone found in the ear?"
    },
    {
        "word": "ossuary",
        "meaning": "A container or room in which the bones of dead people are placed.",
        "sentences": ["Historians explored the ancient stone ossuary to learn about burial customs of the past."],
        "vocabulary_question": "Is an ███████ a place for storing books or a place for storing bones?"
    },
    {
        "word": "ostensibly",
        "meaning": "To all outward appearances; apparently but perhaps not actually.",
        "sentences": ["He went to the library ostensibly to study, but he actually just wanted to see his friends."],
        "vocabulary_question": "If someone is ██████████ working, does it mean they are definitely working or just that they look like they are?"
    },
    {
        "word": "osteopath",
        "meaning": "A person who practices osteopathy (a system of medical practice based on the manipulation of muscles and bones).",
        "sentences": ["The osteopath adjusted the patient’s spine to help relieve their chronic back pain."],
        "vocabulary_question": "Does an █████████ focus on treating muscles and bones or on treating eye diseases?"
    },
    {
        "word": "ottoman",
        "meaning": "A low upholstered seat without a back or arms, typically used as a footstool; or relating to the Ottoman Empire.",
        "sentences": ["She rested her feet on the velvet ottoman while reading her book."],
        "vocabulary_question": "Is an ███████ a type of tall chair with a back or a low stool used as a footrest?"
    },
    {
        "word": "oxalis",
        "meaning": "A genus of plants with clover-like leaves, often called wood sorrels.",
        "sentences": ["The garden was covered in a carpet of pink-flowered oxalis."],
        "vocabulary_question": "Is ██████ a type of clover-like plant or a type of wild mountain cat?"
    },
    {
        "word": "pabulum",
        "meaning": "Writing or ideas that are sentimental, basic, or simplistic; or food/nourishment.",
        "sentences": ["The critic dismissed the television script as mere pabulum for the masses."],
        "vocabulary_question": "Is ███████ deep, complex philosophy or writing that is sentimental and basic?"
    },
    {
        "word": "pagoda",
        "meaning": "A Hindu or Buddhist temple or sacred building, typically a many-tiered tower.",
        "sentences": ["We admired the golden tiers of the ancient pagoda as we walked through the gardens."],
        "vocabulary_question": "Is a ██████ a many-tiered temple tower or a type of small wooden boat?"
    },
    {
        "word": "Paleozoic",
        "meaning": "The era of geological time between the Neoproterozoic and the Mesozoic, characterized by the advent of fish, insects, and reptiles.",
        "sentences": ["The museum's fossil collection includes many strange creatures from the Paleozoic era."],
        "vocabulary_question": "Did the █████████ era occur during prehistoric times or during the Middle Ages?"
    },
    {
        "word": "paletot",
        "meaning": "A loose outer garment; especially a well-fitted overcoat for men or women.",
        "sentences": ["The gentleman reached for his wool paletot before stepping out into the winter chill."],
        "vocabulary_question": "Is a ███████ a type of overcoat or a type of musical instrument?"
    },
    {
        "word": "palmate",
        "meaning": "Shaped like an open palm or a hand with fingers outstretched.",
        "sentences": ["The maple tree is easily identified by its broad, palmate leaves."],
        "vocabulary_question": "Is a ███████ leaf shaped like a long needle or like an open hand?"
    },
    {
        "word": "palpebral",
        "meaning": "Relating to the eyelids.",
        "sentences": ["The doctor checked the patient's palpebral muscles for any signs of weakness."],
        "vocabulary_question": "Does the word █████████ relate to the eyelids or to the shoulder blades?"
    },
    {
        "word": "palpitant",
        "meaning": "Trembling; throbbing; quivering.",
        "sentences": ["She took a deep breath to calm her palpitant heart before the big performance."],
        "vocabulary_question": "Does █████████ describe something that is perfectly still or something that is throbbing and trembling?"
    },
    {
        "word": "Panama",
        "meaning": "A country in Central America; or a wide-brimmed hat made of straw-like material.",
        "sentences": ["He wore a classic Panama hat to protect himself from the tropical sun."],
        "vocabulary_question": "Is a ██████ a type of wide-brimmed straw hat or a type of heavy winter boot?"
    },
    {
        "word": "panary",
        "meaning": "Relating to bread or bread-making.",
        "sentences": ["The bakery was filled with the delicious aroma of panary delights."],
        "vocabulary_question": "Does the word ██████ relate to bread-making or to making furniture?"
    },
    {
        "word": "pancetta",
        "meaning": "Italian cured belly of pork, similar to bacon but not smoked.",
        "sentences": ["The chef added diced pancetta to the pasta sauce for a salty, rich flavor."],
        "vocabulary_question": "Is ████████ a type of Italian cured meat or a type of sweet pastry?"
    },
    {
        "word": "panchreston",
        "meaning": "A 'cure-all'; a proposed solution or theory that claims to explain or solve everything.",
        "sentences": ["The scientist warned that no single theory should be treated as a panchreston."],
        "vocabulary_question": "Is a ███████████ a specific tool for one job or a supposed 'cure-all' for everything?"
    },
    {
        "word": "pancreas",
        "meaning": "A large gland behind the stomach which secretes digestive enzymes into the duodenum.",
        "sentences": ["Insulin is produced in the pancreas to help regulate blood sugar."],
        "vocabulary_question": "Is the ████████ an organ involved in digestion and blood sugar or a part of the brain?"
    },
    {
        "word": "panopticon",
        "meaning": "A circular prison with cells arranged around a central well, from which prisoners could at all times be observed.",
        "sentences": ["The architect designed the prison as a panopticon to ensure maximum security."],
        "vocabulary_question": "Is a ██████████ a type of prison design or a type of high-powered telescope?"
    },
    {
        "word": "pantomime",
        "meaning": "A dramatic entertainment in which performers express meaning through gestures accompanied by music.",
        "sentences": ["The children laughed as the clown used pantomime to show he was 'stuck' in a box."],
        "vocabulary_question": "Does █████████ involve speaking loudly or using gestures and silence to tell a story?"
    },
    {
        "word": "papyrus",
        "meaning": "A material prepared in ancient Egypt from the pithy stem of a water plant, used in sheets for writing.",
        "sentences": ["Scribes in ancient Egypt recorded their laws on long scrolls of papyrus."],
        "vocabulary_question": "Was ███████ an ancient material used for writing or for building pyramids?"
    },
    {
        "word": "par excellence",
        "meaning": "Being an example of some quality at its highest degree; better than all others.",
        "sentences": ["She is a storyteller par excellence, captivating audiences wherever she goes."],
        "vocabulary_question": "Does ███ ██████████ describe someone who is average or someone who is the best example of something?"
    },
    {
        "word": "parabola",
        "meaning": "A symmetrical open plane curve formed by the intersection of a cone with a plane parallel to its side.",
        "sentences": ["The path of a ball thrown into the air follows a perfect parabola."],
        "vocabulary_question": "Is a ████████ a straight line or a symmetrical U-shaped curve?"
    },
    {
        "word": "parameters",
        "meaning": "A numerical or other measurable factor forming one of a set that defines a system or sets the conditions of its operation.",
        "sentences": ["The researchers had to stay within the parameters of the study to ensure accurate results."],
        "vocabulary_question": "Are ██████████ boundaries and rules that define a system or a type of musical note?"
    },
    {
        "word": "paraplegic",
        "meaning": "Affected by paralysis of the legs and lower body.",
        "sentences": ["After the accident, the athlete used a specialized wheelchair designed for a paraplegic."],
        "vocabulary_question": "Does a ██████████ person have paralysis in their lower body or in their hands only?"
    },
    {
        "word": "parasol",
        "meaning": "A light umbrella used to give shade from the sun.",
        "sentences": ["She carried a lace parasol to keep the sun off her face during the garden party."],
        "vocabulary_question": "Is a ███████ used to protect you from heavy rain or to provide shade from the sun?"
    },
    {
        "word": "parazonium",
        "meaning": "A short sword or dagger attached to a belt, often worn by ancient Greek and Roman officers.",
        "sentences": ["The Roman commander's parazonium was decorated with intricate gold leaf."],
        "vocabulary_question": "Was a ██████████ an ancient dagger or a type of protective shield?"
    },
    {
        "word": "parbuckle",
        "meaning": "A rope mechanism used for raising or lowering a heavy cylindrical object, such as a barrel.",
        "sentences": ["The sailors used a parbuckle to carefully move the heavy casks of water onto the ship."],
        "vocabulary_question": "Is a ████████ a tool for moving heavy barrels or a type of sailor's hat?"
    },
    {
        "word": "Parcheesi",
        "meaning": "A board game based on an ancient Indian game, in which players move pieces according to the throw of dice.",
        "sentences": ["We spent the rainy afternoon playing a competitive game of Parcheesi."],
        "vocabulary_question": "Is █████████ a type of board game or a type of spicy food?"
    },
    {
        "word": "parfleche",
        "meaning": "An article, such as a bag or shield, made from dried rawhide, especially by North American Indians.",
        "sentences": ["The museum exhibited a beautifully painted parfleche used to carry supplies."],
        "vocabulary_question": "Is a █████████ an item made of rawhide or an item made of woven silk?"
    },
    {
        "word": "pariah",
        "meaning": "An outcast; someone who is avoided or rejected by others.",
        "sentences": ["After the scandal, the former leader became a social pariah."],
        "vocabulary_question": "Is a ██████ a popular leader or a person who has been rejected and made an outcast?"
    },
    {
        "word": "parlay",
        "meaning": "To turn an initial asset or amount into something much greater; or a series of bets.",
        "sentences": ["She hoped to parlay her small savings into a successful business empire."],
        "vocabulary_question": "Does to ██████ mean to lose everything or to turn a small amount into something much bigger?"
    },
    {
        "word": "Parmesan",
        "meaning": "A hard, dry, sharp-flavored Italian cheese.",
        "sentences": ["The waiter grated fresh Parmesan cheese over the bowl of steaming pasta."],
        "vocabulary_question": "Is ████████ a type of hard Italian cheese or a type of soft French bread?"
    },
    {
        "word": "parochial",
        "meaning": "Relating to a church parish; or having a limited or narrow outlook.",
        "sentences": ["The politician was criticized for his parochial view, focusing only on local issues."],
        "vocabulary_question": "Is a █████████ view one that is worldly and broad or narrow and limited?"
    },
    {
        "word": "parodic",
        "meaning": "Relating to or having the characteristics of a parody (an imitation for comic effect).",
        "sentences": ["The comedian’s parodic impression of the famous actor made everyone laugh."],
        "vocabulary_question": "Is a ███████ performance meant to be a serious tribute or a funny imitation?"
    },
    {
        "word": "parr",
        "meaning": "A young salmon (or trout) between the stages of fry and smolt, distinguished by dark vertical markings.",
        "sentences": ["The environmentalist counted the number of salmon parr in the stream."],
        "vocabulary_question": "Is a ████ a type of young fish or a type of adult sea turtle?"
    },
    {
        "word": "parsec",
        "meaning": "A unit of measure for interstellar space equal to 3.26 light-years or to 19.2 trillion miles.",
        "sentences": ["The distant galaxy is located several million parsecs away from Earth."],
        "vocabulary_question": "Is a ██████ a unit used to measure time or a unit used to measure massive distances in space?"
    },
    {
        "word": "parsimony",
        "meaning": "Extreme unwillingness to spend money or use resources.",
        "sentences": ["The old miser was known for his parsimony, refusing to buy even a new coat."],
        "vocabulary_question": "Does █████████ describe a state of great generosity or extreme stinginess?"
    },
    {
        "word": "partiality",
        "meaning": "A particular fondness or bias for something; unfair bias.",
        "sentences": ["She admitted her partiality for chocolate cake over any other dessert."],
        "vocabulary_question": "If you have a ███████████ for something, do you dislike it or do you have a special fondness for it?"
    },
    {
        "word": "particulate",
        "meaning": "Relating to or in the form of minute, separate particles.",
        "sentences": ["The city monitored the level of particulate matter in the air to track pollution."],
        "vocabulary_question": "Does ███████████ describe something that is one solid piece or made of tiny, separate particles?"
    },
    {
        "word": "parturient",
        "meaning": "In labor; about to give birth.",
        "sentences": ["The farmer stayed in the barn all night to tend to the parturient cow."],
        "vocabulary_question": "Is a ███████████ animal one that is sleeping or one that is about to give birth?"
    },
    {
        "word": "parvo",
        "meaning": "A highly contagious viral disease in dogs that causes severe gastrointestinal symptoms.",
        "sentences": ["Puppies must be vaccinated early to protect them from the deadly parvo virus."],
        "vocabulary_question": "Is █████ a type of bird or a dangerous virus that affects dogs?"
    },
    {
        "word": "pashmina",
        "meaning": "Fine quality goat's wool; or a shawl made from this wool.",
        "sentences": ["She wrapped a soft pashmina around her shoulders to stay warm at the evening wedding."],
        "vocabulary_question": "Is a ████████ a type of rough canvas bag or a shawl made of fine wool?"
    },
    {
        "word": "passé",
        "meaning": "No longer fashionable; out of date.",
        "sentences": ["He worried that his favorite style of hat had become passé."],
        "vocabulary_question": "If a fashion trend is █████, is it brand new or out of date?"
    },
    {
        "word": "pasteurize",
        "meaning": "To subject milk or other liquids to a process of partial sterilization to make them safe for consumption.",
        "sentences": ["Dairies pasteurize milk by heating it to kill harmful bacteria."],
        "vocabulary_question": "Do we ██████████ liquid to make it colder or to kill bacteria and make it safe to drink?"
    },
    {
        "word": "pastrami",
        "meaning": "Highly seasoned smoked beef, typically served in thin slices.",
        "sentences": ["He ordered a giant pastrami sandwich on rye bread with plenty of mustard."],
        "vocabulary_question": "Is ████████ a type of seasoned smoked beef or a type of sweet fruit?"
    },
    {
        "word": "patella",
        "meaning": "The kneecap.",
        "sentences": ["The soccer player injured his patella after a hard fall on the turf."],
        "vocabulary_question": "Is the ███████ the bone in your elbow or the bone in your knee?"
    },
    {
        "word": "pathos",
        "meaning": "A quality that evokes pity or sadness.",
        "sentences": ["The actor's performance was filled with such pathos that many in the audience began to cry."],
        "vocabulary_question": "Does ██████ evoke feelings of great joy or feelings of pity and sadness?"
    },
    {
        "word": "patronymic",
        "meaning": "A name derived from the name of a father or ancestor (like 'Johnson' meaning 'son of John').",
        "sentences": ["In many cultures, children are given a patronymic as their middle or last name."],
        "vocabulary_question": "Is a ██████████ name based on a person's father or on the name of their city?"
    },
    {
        "word": "paucity",
        "meaning": "The presence of something only in small or insufficient quantities or amounts; scarcity.",
        "sentences": ["The paucity of evidence made it impossible for the police to solve the case."],
        "vocabulary_question": "Does ███████ mean having a huge supply of something or a very small, insufficient amount?"
    },
    {
        "word": "peacenik",
        "meaning": "A person who is a member of a peace movement; a pacifist.",
        "sentences": ["The old peacenik spent his weekends at rallies calling for an end to the war."],
        "vocabulary_question": "Is a ████████ a person who supports war or a person who actively supports peace?"
    },
    {
        "word": "peculate",
        "meaning": "To embezzle or steal money, especially public funds.",
        "sentences": ["The official was arrested when it was discovered he tried to peculate tax money."],
        "vocabulary_question": "Does to ████████ mean to donate money or to steal/embezzle it?"
    },
    {
        "word": "pecuniary",
        "meaning": "Relating to or consisting of money.",
        "sentences": ["The award included a trophy and a pecuniary prize of one thousand dollars."],
        "vocabulary_question": "Does a █████████ matter relate to money or to the weather?"
    },
    {
        "word": "pedantry",
        "meaning": "Excessive concern with minor details and rules; being a 'know-it-all'.",
        "sentences": ["His constant pedantry about grammar made it difficult to have a simple conversation with him."],
        "vocabulary_question": "Is ████████ an obsession with small details and rules or a total lack of focus?"
    },
    {
        "word": "pelagial",
        "meaning": "Of, relating to, or living in the open sea.",
        "sentences": ["Sharks are pelagial creatures that spend their lives far from the shore."],
        "vocabulary_question": "Do ████████ animals live in small ponds or in the open sea?"
    },
    {
        "word": "pelerine",
        "meaning": "A woman's cape of lace or silk with pointed ends in front.",
        "sentences": ["She draped a delicate lace pelerine over her shoulders for the evening gala."],
        "vocabulary_question": "Is a ████████ a type of cape or a type of garden tool?"
    },
    {
        "word": "pelf",
        "meaning": "Money, especially when gained in a dishonest or dishonorable way.",
        "sentences": ["The pirate spent his ill-gotten pelf on jewels and fine clothes."],
        "vocabulary_question": "Is ████ a word for money or a word for a type of heavy stone?"
    },
    {
        "word": "Peloponnesian",
        "meaning": "Relating to the Peloponnese, the peninsula forming the southern part of Greece.",
        "sentences": ["We studied the causes of the Peloponnesian War between Athens and Sparta."],
        "vocabulary_question": "Does the word █████████████ relate to ancient Greece or to ancient China?"
    },
    {
        "word": "pendentive",
        "meaning": "A curved triangle of vaulting formed by the intersection of a dome with its supporting arches.",
        "sentences": ["The architect used pendentives to support the massive dome of the cathedral."],
        "vocabulary_question": "Is a ██████████ used in building a dome or in building a wooden fence?"
    },
    {
        "word": "pendragon",
        "meaning": "A title given to an ancient British or Welsh chief or leader.",
        "sentences": ["Uther Pendragon was the legendary father of King Arthur."],
        "vocabulary_question": "Was a █████████ a type of chief/leader or a type of mythical flying animal?"
    },
    {
        "word": "pendulous",
        "meaning": "Hanging down loosely; swinging freely.",
        "sentences": ["The clock had a pendulous weight that swung back and forth every second."],
        "vocabulary_question": "Is a █████████ object standing straight up or hanging down loosely?"
    },
    {
        "word": "penitentiary",
        "meaning": "A prison for people convicted of serious crimes.",
        "sentences": ["The criminal was sentenced to ten years in a state penitentiary."],
        "vocabulary_question": "Is a ████████████ a type of school or a type of prison?"
    },
    {
        "word": "penultimate",
        "meaning": "Last but one; second to last.",
        "sentences": ["The penultimate chapter of the book was the most exciting one of all."],
        "vocabulary_question": "Is the ███████████ item the very first one or the second to last one?"
    },
    {
        "word": "pepita",
        "meaning": "The edible seed of a pumpkin or squash, often dried or toasted.",
        "sentences": ["She sprinkled toasted pepitas over the top of her salad for a nice crunch."],
        "vocabulary_question": "Is a ██████ a pumpkin seed or a type of small spicy pepper?"
    },
    {
        "word": "per se",
        "meaning": "By or in itself or themselves; intrinsically.",
        "sentences": ["It wasn't the rain per se that ruined the picnic, but the strong winds that came with it."],
        "vocabulary_question": "Does ███ ██ mean 'along with others' or 'by itself'?"
    },
    {
        "word": "peradventure",
        "meaning": "Perhaps; possibly; or uncertainty/doubt.",
        "sentences": ["Beyond all peradventure, she was the fastest runner in the entire school."],
        "vocabulary_question": "Does ████████████ relate to something being a 'possibility' or something being 'impossible'?"
    },
    {
        "word": "perceptible",
        "meaning": "Able to be seen or noticed.",
        "sentences": ["There was a perceptible change in the temperature as the sun went down."],
        "vocabulary_question": "Is something ███████████ impossible to notice or able to be seen and felt?"
    },
    {
        "word": "periaktos",
        "meaning": "A three-sided revolving apparatus used in ancient Greek theater for changing scenery.",
        "sentences": ["The stagehands rotated the periaktos to transform the scene from a forest to a palace."],
        "vocabulary_question": "Is a █████████ a type of Greek theater scenery device or a type of ancient ship?"
    },
    {
        "word": "perigynous",
        "meaning": "Having the stamens and other floral parts situated around the ovary rather than below it.",
        "sentences": ["The biology student classified the cherry blossom as perigynous based on its structure."],
        "vocabulary_question": "Does ██████████ relate to the arrangement of parts in a flower or the stars in a galaxy?"
    },
    {
        "word": "periodontist",
        "meaning": "A dentist who specializes in the prevention, diagnosis, and treatment of periodontal disease (gum disease).",
        "sentences": ["The dentist referred him to a periodontist to treat his receding gum line."],
        "vocabulary_question": "Does a █████████████ focus on fixing broken bones or treating gum disease?"
    },
    {
        "word": "peripheral",
        "meaning": "Relating to or situated on the edge or periphery of something; of secondary importance.",
        "sentences": ["He caught a glimpse of the bird in his peripheral vision."],
        "vocabulary_question": "Is something ██████████ at the very center of focus or on the outer edges?"
    },
    {
        "word": "periwinkle",
        "meaning": "A small edible sea snail; or a plant with blue or white flowers and shiny leaves.",
        "sentences": ["The children searched the tide pools for tiny periwinkle shells."],
        "vocabulary_question": "Is a ██████████ a type of sea snail or a type of large desert mammal?"
    },
    {
        "word": "permutation",
        "meaning": "A way, especially one of several possible variations, in which a set or number of things can be ordered or arranged.",
        "sentences": ["The math problem asked for every possible permutation of the four numbers."],
        "vocabulary_question": "Is a ███████████ a specific arrangement of a set or a random accident?"
    },
    {
        "word": "pernicious",
        "meaning": "Having a harmful effect, especially in a gradual or subtle way.",
        "sentences": ["The spread of misinformation can have a pernicious effect on a community."],
        "vocabulary_question": "Is a ██████████ influence one that is helpful or one that is subtly harmful?"
    },
    {
        "word": "perpetrator",
        "meaning": "A person who carries out a harmful, illegal, or immoral act.",
        "sentences": ["The police used security footage to identify the perpetrator of the robbery."],
        "vocabulary_question": "Is a ███████████ someone who follows the law or someone who commits a crime?"
    },
    {
        "word": "perquisite",
        "meaning": "A perk; a thing regarded as a special right or privilege enjoyed as a result of one's position.",
        "sentences": ["A private parking space was a welcome perquisite of her new job."],
        "vocabulary_question": "Is a ██████████ a punishment or a special privilege or 'perk' of a job?"
    },
    {
        "word": "perseverance",
        "meaning": "Persistence in doing something despite difficulty or delay in achieving success.",
        "sentences": ["It took years of perseverance for the athlete to finally win the gold medal."],
        "vocabulary_question": "Does ████████████ involve giving up easily or keep trying despite difficulties?"
    },
    {
        "word": "perspicacious",
        "meaning": "Having a ready insight into and understanding of things; shrewd.",
        "sentences": ["The perspicacious detective noticed the small detail that everyone else had missed."],
        "vocabulary_question": "Is a █████████████ person slow to understand or very quick to notice and understand things?"
    },
    {
        "word": "persuasible",
        "meaning": "Able to be persuaded or convinced.",
        "sentences": ["He was quite persuasible, changing his mind after hearing only one side of the argument."],
        "vocabulary_question": "If someone is ███████████, is it easy or impossible to change their mind?"
    },
    {
        "word": "pertinacity",
        "meaning": "The quality of sticking with something; stubbornness or persistence.",
        "sentences": ["Her pertinacity in training allowed her to finish the marathon in record time."],
        "vocabulary_question": "Does ███████████ describe someone who quits early or someone who is very persistent?"
    },
    {
        "word": "pertussal",
        "meaning": "Relating to or having the characteristics of whooping cough (pertussis).",
        "sentences": ["The doctor recognized the pertussal cough and immediately ordered a test."],
        "vocabulary_question": "Does the word █████████ relate to a type of skin rash or a type of severe cough?"
    },
    {
        "word": "pervenche",
        "meaning": "The color periwinkle; a grayish-blue color.",
        "sentences": ["The bridesmaid dresses were a lovely shade of pervenche."],
        "vocabulary_question": "Is █████████ a shade of grayish-blue or a shade of bright neon yellow?"
    },
    {
        "word": "pestilence",
        "meaning": "A fatal epidemic disease, especially bubonic plague.",
        "sentences": ["The ancient city was devastated by a sudden and mysterious pestilence."],
        "vocabulary_question": "Is a ██████████ a large celebration or a widespread, fatal disease?"
    },
    {
        "word": "petroleum",
        "meaning": "A liquid mixture of hydrocarbons that is present in certain rock strata and can be extracted and refined to produce fuel.",
        "sentences": ["Gasoline and diesel are both products refined from petroleum."],
        "vocabulary_question": "Is █████████ used to produce fuel or used to make drinking water?"
    },
    {
        "word": "phantasmagoria",
        "meaning": "A continually shifting, complex series of things observed or imagined (such as in a dream).",
        "sentences": ["The movie was a phantasmagoria of bright colors and strange, surreal shapes."],
        "vocabulary_question": "Is a ██████████████ a simple, clear image or a shifting series of strange, dreamlike visions?"
    },
    {
        "word": "phenotype",
        "meaning": "The set of observable characteristics of an individual resulting from the interaction of its genotype with the environment.",
        "sentences": ["The bird's bright red feathers are a visible part of its phenotype."],
        "vocabulary_question": "Is a █████████ the hidden DNA of a creature or its observable physical traits?"
    },
    {
        "word": "philosophize",
        "meaning": "To speculate or theorize about fundamental or serious issues, especially in a pedantic way.",
        "sentences": ["The friends would sit for hours and philosophize about the meaning of life."],
        "vocabulary_question": "When you ███████████, are you doing math problems or thinking deeply about life's big questions?"
    },
    {
        "word": "philtrum",
        "meaning": "The vertical groove between the base of the nose and the border of the upper lip.",
        "sentences": ["The portrait artist carefully shaded the philtrum to make the face look realistic."],
        "vocabulary_question": "Is the ████████ the space between your eyes or the groove above your upper lip?"
    },
    {
        "word": "phishing",
        "meaning": "The fraudulent practice of sending emails purporting to be from reputable companies to induce individuals to reveal personal information.",
        "sentences": ["The bank warned its customers never to click on links in suspicious phishing emails."],
        "vocabulary_question": "Does ████████ involve catching fish in a lake or trying to steal passwords online?"
    },
    {
        "word": "phlebotomy",
        "meaning": "The act of drawing blood from a vein, especially for medical analysis.",
        "sentences": ["The clinic specializes in phlebotomy for patients who need regular blood tests."],
        "vocabulary_question": "Is ██████████ the study of plants or the practice of drawing blood?"
    },
    {
        "word": "phoenix",
        "meaning": "A mythical bird that is cyclically regenerated or reborn from its own ashes.",
        "sentences": ["The legend says the phoenix lives for hundreds of years before bursting into flames and being reborn."],
        "vocabulary_question": "Is a ███████ a bird that is reborn from ashes or a bird that lives underwater?"
    },
    {
        "word": "phonetician",
        "meaning": "An expert in phonetics (the study and classification of speech sounds).",
        "sentences": ["The phonetician analyzed the unique dialect of the remote island village."],
        "vocabulary_question": "Does a ███████████ study the sounds of speech or the history of written books?"
    },
    {
        "word": "phosphorescent",
        "meaning": "Glowing with light without becoming hot to the touch; emitting light after being exposed to radiation.",
        "sentences": ["The watch had phosphorescent hands that glowed in the dark."],
        "vocabulary_question": "Is a ██████████████ object one that is dark or one that glows in the dark?"
    },
    {
        "word": "phraseology",
        "meaning": "A particular mode of expression; the way in which words and phrases are used.",
        "sentences": ["Legal phraseology can be very difficult for a non-lawyer to understand."],
        "vocabulary_question": "Does ███████████ relate to the way words are chosen and used or the way food is cooked?"
    },
    {
        "word": "phycology",
        "meaning": "The scientific study of algae.",
        "sentences": ["She decided to specialize in phycology after becoming fascinated by seaweed during a trip to the coast."],
        "vocabulary_question": "Is █████████ the study of birds or the study of algae?"
    },
    {
        "word": "phylum",
        "meaning": "A principal taxonomic category that ranks above class and below kingdom.",
        "sentences": ["The phylum Chordata includes all animals with a backbone, such as humans and fish."],
        "vocabulary_question": "Is a ██████ a category used to classify animals or a type of musical instrument?"
    },
    {
        "word": "phyteral",
        "meaning": "A fossilized plant part or vegetal organic matter found in coal.",
        "sentences": ["The geologist identified several phyteral structures within the coal sample."],
        "vocabulary_question": "Does a ████████ relate to fossilized plant material or to a type of modern solar panel?"
    },
    {
        "word": "pickerel",
        "meaning": "A type of small freshwater fish belonging to the pike family.",
        "sentences": ["The fisherman caught a chain pickerel in the shallow weeds of the lake."],
        "vocabulary_question": "Is a ████████ a type of freshwater fish or a type of small garden bird?"
    },
    {
        "word": "Pierre",
        "meaning": "The capital city of the U.S. state of South Dakota.",
        "sentences": ["Pierre is located on the banks of the Missouri River."],
        "vocabulary_question": "Is ██████ the capital of South Dakota or the capital of Vermont?"
    },
    {
        "word": "pilaster",
        "meaning": "A rectangular column, especially one projecting from a wall.",
        "sentences": ["The library entrance was decorated with ornate marble pilasters."],
        "vocabulary_question": "Is a ████████ a column that stands freely or one that is attached to and projects from a wall?"
    },
    {
        "word": "pileus",
        "meaning": "The cap of a mushroom or toadstool; or a felt cap worn by ancient Romans.",
        "sentences": ["The biologist noted that the pileus of the mushroom was bright red with white spots."],
        "vocabulary_question": "Is the ██████ the stem of a mushroom or the umbrella-shaped cap?"
    },
    {
        "word": "pilferer",
        "meaning": "A thief who steals items of small value.",
        "sentences": ["The store manager kept a close eye out for any petty pilferer trying to pocket candy bars."],
        "vocabulary_question": "Does a ████████ steal massive amounts of money or items of small value?"
    },
    {
        "word": "pilosity",
        "meaning": "The quality or state of being hairy.",
        "sentences": ["The caterpillar was known for its extreme pilosity, being covered in thick, soft fuzz."],
        "vocabulary_question": "Does ████████ describe something that is perfectly smooth or something that is very hairy?"
    },
    {
        "word": "pilotage",
        "meaning": "The act or business of piloting a ship or aircraft; the fee paid for a pilot's services.",
        "sentences": ["Safe pilotage is essential when navigating a large cargo ship through a narrow harbor."],
        "vocabulary_question": "Does ████████ relate to the act of steering a vessel or the act of building one?"
    },
    {
        "word": "pinnacle",
        "meaning": "A high, pointed piece of rock; or the most successful point of something.",
        "sentences": ["Winning the championship was the pinnacle of her athletic career."],
        "vocabulary_question": "Is a ████████ the lowest point of a valley or the highest, most successful point?"
    },
    {
        "word": "pinnate",
        "meaning": "Having leaflets arranged on either side of the stem, typically in pairs.",
        "sentences": ["The fern leaf is a classic example of a pinnate structure."],
        "vocabulary_question": "Is a ███████ leaf shaped like a single round circle or divided like a feather with leaflets on both sides?"
    },
    {
        "word": "pious",
        "meaning": "Devoutly religious.",
        "sentences": ["The pious monk spent his entire day in prayer and meditation."],
        "vocabulary_question": "Is a █████ person someone who is very religious or someone who dislikes spiritual things?"
    },
    {
        "word": "Pisces",
        "meaning": "A large constellation and the twelfth sign of the zodiac, represented by two fish.",
        "sentences": ["According to astrology, those born under Pisces are often very creative."],
        "vocabulary_question": "Is ██████ represented by a pair of fish or by a lion?"
    },
    {
        "word": "pituitary",
        "meaning": "A major endocrine gland, often called the 'master gland,' that controls growth and development.",
        "sentences": ["The pituitary gland is located at the base of the brain."],
        "vocabulary_question": "Is the █████████ gland located in the brain or in the stomach?"
    },
    {
        "word": "placoderm",
        "meaning": "An extinct armored fish from the Paleozoic era.",
        "sentences": ["The fossil of the placoderm showed heavy bony plates covering its head and neck."],
        "vocabulary_question": "Was a █████████ a type of feathered bird or a prehistoric armored fish?"
    },
    {
        "word": "plagiarism",
        "meaning": "The practice of taking someone else's work or ideas and passing them off as one's own.",
        "sentences": ["The student was penalized for plagiarism after copying a paragraph from a website."],
        "vocabulary_question": "Is ██████████ involving original work or stealing someone else's ideas?"
    },
    {
        "word": "plaintiff",
        "meaning": "A person who brings a case against another in a court of law.",
        "sentences": ["The plaintiff argued that the company was responsible for the damage to his car."],
        "vocabulary_question": "Is the █████████ the person who is being sued or the person who starts the lawsuit?"
    },
    {
        "word": "planetesimal",
        "meaning": "A minute planet; a body that could or did come together with many others to form a planet.",
        "sentences": ["Early in the solar system's history, planetesimals collided to form larger planets."],
        "vocabulary_question": "Is a ████████████ a fully formed giant star or a small building block of a planet?"
    },
    {
        "word": "plangency",
        "meaning": "The quality of being loud, reverberating, and often melancholy in sound.",
        "sentences": ["We were moved by the plangency of the bells tolling in the distance."],
        "vocabulary_question": "Does █████████ describe a quiet, cheerful sound or a loud, reverberating, sad sound?"
    },
    {
        "word": "planisphere",
        "meaning": "A map of the celestial sphere on a flat surface, with a device for showing the part of the sky visible at any given time.",
        "sentences": ["The star-gazer used a planisphere to identify the constellations visible in January."],
        "vocabulary_question": "Is a ███████████ used to find cities on Earth or to find stars in the sky?"
    },
    {
        "word": "planogram",
        "meaning": "A diagram or model that indicates the placement of retail products on shelves to maximize sales.",
        "sentences": ["The store employees followed the planogram to ensure the cereal boxes were in the right spot."],
        "vocabulary_question": "Is a █████████ a map of a mountain range or a layout for grocery store shelves?"
    },
    {
        "word": "plantain",
        "meaning": "A fruit that looks like a large banana but is starchier and usually eaten cooked.",
        "sentences": ["In many tropical countries, fried plantain is served as a delicious side dish."],
        "vocabulary_question": "Is a ████████ more like a sweet apple or a starchy banana that is often cooked?"
    },
    {
        "word": "plantigrade",
        "meaning": "Walking on the soles of the feet, like a human, bear, or raccoon.",
        "sentences": ["Bears have a plantigrade gait, which means their heels touch the ground when they walk."],
        "vocabulary_question": "Do ███████████ animals walk on their tiptoes or on the flat soles of their feet?"
    },
    {
        "word": "plaudits",
        "meaning": "Praise; an expression of approval.",
        "sentences": ["The chef received many plaudits for his innovative new menu."],
        "vocabulary_question": "Are ████████ signs of strong disapproval or expressions of praise?"
    },
    {
        "word": "plenitude",
        "meaning": "An abundance; a full or complete supply.",
        "sentences": ["The harvest festival celebrated the plenitude of fruit and vegetables from the local farms."],
        "vocabulary_question": "Does █████████ mean a tiny, scarce amount or a full, rich abundance?"
    },
    {
        "word": "plentiful",
        "meaning": "Existing in or yielding great amounts; abundant.",
        "sentences": ["Strawberries are plentiful and cheap during the peak of the summer."],
        "vocabulary_question": "If something is ██████████, is it very hard to find or easy to find in large amounts?"
    },
    {
        "word": "plumbago",
        "meaning": "A plant with clusters of blue or white flowers; or another name for graphite.",
        "sentences": ["The garden fence was covered in the bright blue blossoms of the plumbago."],
        "vocabulary_question": "Is ████████ a type of flowering plant or a type of heavy metal used in construction?"
    },
    {
        "word": "Plumeria",
        "meaning": "A genus of tropical flowering plants known for their fragrant blossoms, often used to make leis.",
        "sentences": ["The sweet scent of Plumeria filled the air as we walked through the Hawaiian garden."],
        "vocabulary_question": "Is ████████ a type of fragrant tropical flower or a type of cold-weather pine tree?"
    },
    {
        "word": "plutonomy",
        "meaning": "An economy that is driven by or managed in the interests of the wealthy.",
        "sentences": ["Some economists argue that a plutonomy can lead to great inequality."],
        "vocabulary_question": "In a █████████, is the economy run for the benefit of everyone or mostly for the wealthy?"
    },
    {
        "word": "poblano",
        "meaning": "A large, mild chili pepper originating in Mexico.",
        "sentences": ["We made stuffed poblano peppers for dinner using a traditional recipe."],
        "vocabulary_question": "Is a ███████ a very spicy red pepper or a large, mild green chili?"
    },
    {
        "word": "pochard",
        "meaning": "A type of medium-sized diving duck with a reddish-brown head.",
        "sentences": ["The common pochard can be seen diving for food in the deep waters of the lake."],
        "vocabulary_question": "Is a ███████ a type of diving duck or a type of small forest owl?"
    },
    {
        "word": "pococurante",
        "meaning": "Indifferent; careless; a person who is apathetic or coolly detached.",
        "sentences": ["He maintained a pococurante attitude toward the news, acting as if nothing mattered."],
        "vocabulary_question": "Is a ███████████ person deeply passionate or coolly indifferent?"
    },
    {
        "word": "podsnappery",
        "meaning": "A complacent or self-satisfied refusal to face unpleasant or inconvenient facts.",
        "sentences": ["The leader's podsnappery prevented him from seeing the growing problems in the city."],
        "vocabulary_question": "Does ███████████ involve being very realistic or refusing to face unpleasant facts?"
    },
    {
        "word": "Podunk",
        "meaning": "A small, unimportant, and isolated town.",
        "sentences": ["He joked that he grew up in a little town called Podunk where nothing ever happened."],
        "vocabulary_question": "Is ██████ a massive, busy world capital or a small, isolated town?"
    },
    {
        "word": "poinsettia",
        "meaning": "A small Mexican shrub with large showy scarlet bracts (leaves) that resemble petals.",
        "sentences": ["The lobby was decorated with bright red poinsettias for the December holidays."],
        "vocabulary_question": "Is a ██████████ a type of winter-flowering plant or a type of spicy root?"
    },
    {
        "word": "pointelle",
        "meaning": "A fabric with a pattern of small holes, usually made in a knit.",
        "sentences": ["She wore a delicate pointelle cardigan over her dress."],
        "vocabulary_question": "Is █████████ a type of heavy leather or a knit fabric with small holes?"
    },
    {
        "word": "pointillage",
        "meaning": "The technique of using points or dots of color in painting or engraving.",
        "sentences": ["The artist used pointillage to create a shimmering effect on the water in the landscape."],
        "vocabulary_question": "Does ███████████ involve using long brushstrokes or small dots of color?"
    },
    {
        "word": "politick",
        "meaning": "To engage in political activity; or to act in a shrewd or diplomatic way.",
        "sentences": ["The candidates spent the month traveling across the state to politick for votes."],
        "vocabulary_question": "When people ████████, are they playing sports or engaging in political activity?"
    },
    {
        "word": "pollutant",
        "meaning": "A substance that pollutes something, especially water or the atmosphere.",
        "sentences": ["The factory was fined for releasing a dangerous pollutant into the local river."],
        "vocabulary_question": "Is a █████████ something that cleans the air or something that makes it dirty?"
    },
    {
        "word": "polonaise",
        "meaning": "A slow dance of Polish origin; or a woman’s dress with a fitted bodice and a draped overskirt.",
        "sentences": ["The ball began with a traditional polonaise, and the couples moved gracefully across the floor."],
        "vocabulary_question": "Is a █████████ a type of fast run or a type of slow Polish dance?"
    },
    {
        "word": "polonium",
        "meaning": "A rare and highly radioactive metallic element.",
        "sentences": ["Polonium was discovered by Marie and Pierre Curie and named after Marie's homeland."],
        "vocabulary_question": "Is ████████ a type of radioactive element or a type of garden flower?"
    },
    {
        "word": "polyester",
        "meaning": "A synthetic resin used to make textile fibers; a durable and wrinkle-resistant fabric.",
        "sentences": ["The curtains were made of a sturdy polyester blend that was easy to wash."],
        "vocabulary_question": "Is █████████ a natural fabric like silk or a synthetic man-made fiber?"
    },
    {
        "word": "polygenous",
        "meaning": "Consisting of or coming from many different sources or kinds.",
        "sentences": ["The researcher studied the polygenous origins of the various myths in the region."],
        "vocabulary_question": "Does ██████████ describe something from a single source or many different sources?"
    },
    {
        "word": "polypeptide",
        "meaning": "A linear organic polymer consisting of a large number of amino-acid residues bonded together in a chain.",
        "sentences": ["Proteins are made up of one or more long polypeptide chains."],
        "vocabulary_question": "Is a ███████████ a chain of amino acids or a type of geological rock?"
    },
    {
        "word": "polysemy",
        "meaning": "The coexistence of many possible meanings for a word or phrase.",
        "sentences": ["The word 'bank' is an example of polysemy, as it can mean a river's edge or a place for money."],
        "vocabulary_question": "Does ████████ describe a word with only one meaning or a word with many possible meanings?"
    },
    {
        "word": "polysyllabic",
        "meaning": "Having more than one syllable; or using long and complex words.",
        "sentences": ["The professor’s lecture was filled with polysyllabic terms that were hard to follow."],
        "vocabulary_question": "Is a ████████████ word a short one-syllable word or a long word with many syllables?"
    },
    {
        "word": "pomato",
        "meaning": "A hybrid plant produced by grafting a tomato scion onto a potato rootstock.",
        "sentences": ["The gardener experimented with growing a pomato to produce both crops on one plant."],
        "vocabulary_question": "Is a ██████ a cross between a peach and an apple or a potato and a tomato?"
    },
    {
        "word": "pomegranate",
        "meaning": "A round fruit with a tough reddish rind and many seeds inside surrounded by juicy red pulp.",
        "sentences": ["We spent the afternoon carefully picking the sweet-tart seeds out of a fresh pomegranate."],
        "vocabulary_question": "Is a ███████████ a fruit full of juicy seeds or a type of green leafy vegetable?"
    },
    {
        "word": "Pomeranian",
        "meaning": "A breed of small, fluffy dogs with a thick coat and pointed ears.",
        "sentences": ["The Pomeranian barked excitedly as it ran through the park on its tiny legs."],
        "vocabulary_question": "Is a ██████████ a breed of large hunting dog or a small fluffy dog?"
    },
    {
        "word": "pomology",
        "meaning": "The science or study of growing fruit.",
        "sentences": ["He took a class in pomology to learn the best way to care for his apple orchard."],
        "vocabulary_question": "Does ████████ involve the study of fruit-growing or the study of old maps?"
    },
    {
        "word": "pomposity",
        "meaning": "The quality of being self-important or arrogant.",
        "sentences": ["The mayor’s pomposity was evident in the way he expected everyone to bow to him."],
        "vocabulary_question": "Is █████████ a sign of being very humble or being very self-important?"
    },
    {
        "word": "pongee",
        "meaning": "A soft, thin unbleached Chinese silk fabric.",
        "sentences": ["The summer dress was made from light, airy pongee silk."],
        "vocabulary_question": "Is ██████ a type of heavy wool or a soft silk fabric?"
    },
    {
        "word": "pontiff",
        "meaning": "The Pope; or a head religious figure or high priest.",
        "sentences": ["The crowd gathered in the square to hear a message from the pontiff."],
        "vocabulary_question": "Is a ███████ a local teacher or a high religious leader like the Pope?"
    },
    {
        "word": "populace",
        "meaning": "The people living in a particular country or area; the general public.",
        "sentences": ["The new law was popular with the majority of the country's populace."],
        "vocabulary_question": "Does ████████ refer to a small group of leaders or the general public?"
    },
    {
        "word": "porcelain",
        "meaning": "A white vitrified translucent ceramic; china.",
        "sentences": ["The tea set was made of delicate, fine porcelain that was over a hundred years old."],
        "vocabulary_question": "Is █████████ a type of hard ceramic or a type of soft wood?"
    },
    {
        "word": "porosity",
        "meaning": "The quality of being porous, or full of tiny holes that allow air or liquid to pass through.",
        "sentences": ["The high porosity of the sponge allowed it to soak up a large amount of water."],
        "vocabulary_question": "Does ████████ describe something that is solid and waterproof or something full of tiny holes?"
    },
    {
        "word": "portico",
        "meaning": "A structure consisting of a roof supported by columns at regular intervals, typically attached as a porch to a building.",
        "sentences": ["We stood under the portico of the museum to stay dry while it rained."],
        "vocabulary_question": "Is a ███████ a type of basement or a porch with a roof and columns?"
    },
    {
        "word": "posada",
        "meaning": "A traditional Mexican festival which reenacts Mary and Joseph's search for a place to stay in Bethlehem; or an inn.",
        "sentences": ["The village celebrated the posada with songs and a procession through the streets."],
        "vocabulary_question": "Is a ██████ a type of traditional festival or a type of military weapon?"
    },
    {
        "word": "posse",
        "meaning": "A group of people summoned by a sheriff to aid in law enforcement; or a group of friends.",
        "sentences": ["In the old western movie, the sheriff gathered a posse to track down the outlaws."],
        "vocabulary_question": "Is a █████ a single person working alone or a group of people gathered for a task?"
    },
    {
        "word": "possessive",
        "meaning": "Demanding someone's total attention and love; or relating to the ownership of something.",
        "sentences": ["The little boy was very possessive of his favorite teddy bear and wouldn't share it."],
        "vocabulary_question": "Is a ██████████ person happy to share everything or wanting to keep things for themselves?"
    },
    {
        "word": "posterity",
        "meaning": "All future generations of people.",
        "sentences": ["The historian worked hard to record the stories of the elders for the benefit of posterity."],
        "vocabulary_question": "Does █████████ refer to people who lived in the past or future generations?"
    },
    {
        "word": "posthumous",
        "meaning": "Occurring, awarded, or appearing after the death of the originator.",
        "sentences": ["The author's final novel received a posthumous award two years after he passed away."],
        "vocabulary_question": "Does a ██████████ award happen during a person's life or after their death?"
    },
    {
        "word": "postural",
        "meaning": "Relating to the position of the body or the way someone stands or sits.",
        "sentences": ["The physical therapist suggested exercises to correct the patient's postural habits."],
        "vocabulary_question": "Do ████████ exercises help with your singing voice or the way you carry your body?"
    },
    {
        "word": "potassium",
        "meaning": "A soft, silvery-white reactive metal; a chemical element (K) essential for living cells.",
        "sentences": ["Bananas are a well-known source of potassium, which helps prevent muscle cramps."],
        "vocabulary_question": "Is █████████ a type of vitamin or a metallic chemical element?"
    },
    {
        "word": "potentate",
        "meaning": "A monarch or ruler, especially an autocratic one.",
        "sentences": ["The visiting potentate was greeted at the airport with a full military parade."],
        "vocabulary_question": "Is a █████████ a powerful ruler or a lowly servant?"
    },
    {
        "word": "potoroo",
        "meaning": "A small, kangaroo-like marsupial native to Australia.",
        "sentences": ["The long-nosed potoroo is a shy nocturnal creature that lives in the forest undergrowth."],
        "vocabulary_question": "Is a ███████ a type of large desert lizard or a small Australian marsupial?"
    },
    {
        "word": "poultice",
        "meaning": "A soft, moist mass of material, typically of plant material or flour, applied to the body to relieve soreness.",
        "sentences": ["The healer applied a warm herbal poultice to the warrior's bruised shoulder."],
        "vocabulary_question": "Is a ████████ a type of cold drink or a moist mass applied to the skin to heal?"
    },
    {
        "word": "prehensile",
        "meaning": "Capable of grasping or holding onto things, especially of an animal's limb or tail.",
        "sentences": ["Many monkeys use their prehensile tails as a 'fifth limb' to swing through trees."],
        "vocabulary_question": "Is a ██████████ tail one that is short and useless or one that can grasp and hold objects?"
    },
    {
        "word": "prelapsarian",
        "meaning": "Characteristic of the time before the Fall of Man; innocent and unspoiled.",
        "sentences": ["The poet described the garden as a place of prelapsarian beauty and peace."],
        "vocabulary_question": "Does █████████████ describe a state of ancient innocence or a state of modern chaos?"
    },
    {
        "word": "preponderance",
        "meaning": "The quality or fact of being greater in number, quantity, or importance.",
        "sentences": ["The preponderance of the evidence suggested that the storm would hit the coast by morning."],
        "vocabulary_question": "Does a █████████████ of evidence mean there is very little of it or a large majority of it?"
    },
    {
        "word": "preposterous",
        "meaning": "Contrary to reason or common sense; utterly absurd or ridiculous.",
        "sentences": ["The idea that pigs could fly to the moon is completely preposterous."],
        "vocabulary_question": "Is a ███████████ idea one that is very logical or one that is totally ridiculous?"
    },
    {
        "word": "preprandial",
        "meaning": "Occurring or done before a meal, especially dinner.",
        "sentences": ["The guests enjoyed a preprandial walk through the gardens before sitting down to eat."],
        "vocabulary_question": "Does a ███████████ activity happen before a meal or after a meal?"
    },
    {
        "word": "prerequisite",
        "meaning": "A thing that is required as a prior condition for something else to happen or exist.",
        "sentences": ["Taking the introductory math class is a prerequisite for the advanced physics course."],
        "vocabulary_question": "Is a ████████████ something you do after you finish or something you must do beforehand?"
    },
    {
        "word": "prerogative",
        "meaning": "A special right or privilege belonging to a person, group, or class.",
        "sentences": ["As the captain of the team, it was her prerogative to choose the starting lineup."],
        "vocabulary_question": "Is a ███████████ a strict law for everyone or a special right for a certain person?"
    },
    {
        "word": "presentient",
        "meaning": "Having a premonition or a feeling that something is about to happen.",
        "sentences": ["She felt presentient about the surprise party, even though no one had told her."],
        "vocabulary_question": "Is a ██████████ person someone who is confused or someone who senses what will happen?"
    },
    {
        "word": "prespinous",
        "meaning": "Situated in front of a spine or a spinous process.",
        "sentences": ["The biologist examined the prespinous region of the fossil to understand its structure."],
        "vocabulary_question": "Is something ██████████ located behind the spine or in front of it?"
    },
    {
        "word": "prevalence",
        "meaning": "The quality or state of being widespread or common.",
        "sentences": ["The prevalence of smartphones has changed the way people communicate worldwide."],
        "vocabulary_question": "Does the ██████████ of a trait mean it is very rare or very common?"
    },
    {
        "word": "prevenient",
        "meaning": "Anticipating or preceding; especially of divine grace which precedes human decision.",
        "sentences": ["The philosopher spoke of prevenient influences that shape our choices before we make them."],
        "vocabulary_question": "Does something █████████ come before an event or follow after it?"
    },
    {
        "word": "prima donna",
        "meaning": "The chief female singer in an opera; or a very temperamental person with an inflated sense of self-importance.",
        "sentences": ["The talented lead singer acted like a prima donna, demanding a specific brand of water."],
        "vocabulary_question": "Is a █████ █████ a humble background actor or the lead singer with high demands?"
    },
    {
        "word": "primeval",
        "meaning": "Of or resembling the earliest ages in the history of the world.",
        "sentences": ["The thick, foggy forest had a primeval feel, as if it hadn't changed in millions of years."],
        "vocabulary_question": "Does ████████ describe something that is brand new or something from the earliest ages?"
    },
    {
        "word": "primogeniture",
        "meaning": "The state of being the firstborn child; or the right of succession belonging to the firstborn child.",
        "sentences": ["The laws of primogeniture meant that the eldest son would inherit the entire kingdom."],
        "vocabulary_question": "Does █████████████ relate to the oldest child or the youngest child in a family?"
    },
    {
        "word": "princeps",
        "meaning": "A title meaning 'first citizen,' used by Roman emperors; or the first edition of a book.",
        "sentences": ["Augustus took the title of princeps to show he was the first among the citizens of Rome."],
        "vocabulary_question": "Was a ████████ a title for a Roman leader or a type of ancient Greek shield?"
    },
    {
        "word": "priory",
        "meaning": "A small monastery or nunnery that is governed by a prior or prioress.",
        "sentences": ["The quiet priory was located on a hill overlooking the peaceful valley."],
        "vocabulary_question": "Is a ██████ a large stadium or a small religious house for monks or nuns?"
    },
    {
        "word": "privatim",
        "meaning": "In private; privately.",
        "sentences": ["The two leaders met privatim to discuss the details of the peace treaty."],
        "vocabulary_question": "If a meeting is held ████████, is it open to the public or done in private?"
    },
    {
        "word": "privet",
        "meaning": "A deciduous or evergreen shrub with small white flowers, often used for hedges.",
        "sentences": ["The gardener trimmed the privet hedge to keep the garden looking neat."],
        "vocabulary_question": "Is ██████ a type of flowering shrub used for hedges or a type of vegetable?"
    },
    {
        "word": "probative",
        "meaning": "Having the quality of serving to prove or test something.",
        "sentences": ["The evidence was considered probative because it directly linked the suspect to the scene."],
        "vocabulary_question": "Does █████████ evidence help to prove a point or is it totally irrelevant?"
    },
    {
        "word": "procrustean",
        "meaning": "Enforcing uniformity or conformity without regard to individual natural variation.",
        "sentences": ["The school's procrustean rules forced every student to follow the exact same schedule."],
        "vocabulary_question": "Does a ███████████ system value individual differences or force everyone to be the same?"
    },
    {
        "word": "procurement",
        "meaning": "The action of obtaining or procuring something, especially for an organization or government.",
        "sentences": ["The department of procurement is responsible for buying all the school's supplies."],
        "vocabulary_question": "Is ███████████ the act of throwing things away or the act of obtaining/buying them?"
    },
    {
        "word": "prodigious",
        "meaning": "Remarkably or impressively great in extent, size, or degree.",
        "sentences": ["The young pianist showed a prodigious talent, playing complex concertos at age five."],
        "vocabulary_question": "Is a ██████████ amount something tiny and forgettable or remarkably great and large?"
    },
    {
        "word": "proem",
        "meaning": "A preface or preamble to a book or speech; an introduction.",
        "sentences": ["The author included a short proem to explain why he wrote the story."],
        "vocabulary_question": "Is a █████ the final chapter of a book or the introductory preface?"
    },
    {
        "word": "profligacy",
        "meaning": "Reckless extravagance or wastefulness in the use of resources.",
        "sentences": ["The king's profligacy eventually led to the kingdom running out of gold."],
        "vocabulary_question": "Does ██████████ describe careful saving or reckless wastefulness?"
    },
    {
        "word": "profundity",
        "meaning": "Deep insight; great depth of knowledge or thought.",
        "sentences": ["The professor's lecture was admired for its sheer profundity and complex themes."],
        "vocabulary_question": "Does ██████████ relate to shallow, simple ideas or deep, complex thoughts?"
    },
    {
        "word": "proletarian",
        "meaning": "Relating to the proletariat; the working-class people.",
        "sentences": ["The novel focuses on the daily struggles of a proletarian family in the 19th century."],
        "vocabulary_question": "Is a ███████████ person part of the wealthy elite or the working class?"
    },
    {
        "word": "proliferate",
        "meaning": "To increase rapidly in numbers; multiply.",
        "sentences": ["Dandelion plants can proliferate quickly if they are not pulled from the garden."],
        "vocabulary_question": "When things ██████████, are they disappearing or increasing rapidly in number?"
    },
    {
        "word": "prolix",
        "meaning": "Using or containing too many words; tediously lengthy.",
        "sentences": ["The editor asked the author to trim the prolix descriptions in the second chapter."],
        "vocabulary_question": "Is a ██████ speech very short and to the point or tediously long and wordy?"
    },
    {
        "word": "prolusory",
        "meaning": "Introductory; serving as a prelude or a preliminary exercise.",
        "sentences": ["The team engaged in a few prolusory drills before the official match began."],
        "vocabulary_question": "Is a █████████ exercise something done at the very end or as an introduction?"
    },
    {
        "word": "promontory",
        "meaning": "A high point of land or rock projecting into a body of water.",
        "sentences": ["The lighthouse stood on a steep promontory overlooking the Atlantic Ocean."],
        "vocabulary_question": "Is a ██████████ a flat valley or a high point of land sticking out into the water?"
    },
    {
        "word": "proprietary",
        "meaning": "Relating to an owner or ownership; protected by trademark or patent.",
        "sentences": ["The company guards its proprietary software secrets very closely."],
        "vocabulary_question": "If something is ██████████, is it free for everyone to use or owned by a specific person or company?"
    },
    {
        "word": "proprioceptive",
        "meaning": "Relating to stimuli that are produced and perceived within an organism, especially those connected with the position and movement of the body.",
        "sentences": ["Close your eyes and touch your nose; that is an example of your proprioceptive sense at work."],
        "vocabulary_question": "Does the ██████████████ sense help you perceive the outside world or the position of your own body?"
    },
    {
        "word": "prorogue",
        "meaning": "To discontinue a session of (a parliament or other legislative assembly) without dissolving it.",
        "sentences": ["The leader decided to prorogue the assembly until the following spring."],
        "vocabulary_question": "Does to ████████ mean to start a new meeting or to officially end a session for a while?"
    },
    {
        "word": "prosody",
        "meaning": "The patterns of rhythm and sound used in poetry; the patterns of stress and intonation in a language.",
        "sentences": ["The student studied the prosody of the poem to understand its musical flow."],
        "vocabulary_question": "Does ███████ relate to the rhythm and sound of language or the meaning of historical dates?"
    },
    {
        "word": "protean",
        "meaning": "Readily assuming different shapes or forms; versatile.",
        "sentences": ["The actor was celebrated for his protean ability to play both villains and heroes perfectly."],
        "vocabulary_question": "Is a ███████ person someone who always stays the same or someone who can easily change forms or roles?"
    },
    {
        "word": "protectorate",
        "meaning": "A state that is controlled and protected by another.",
        "sentences": ["The small island became a protectorate of the larger nation after the treaty was signed."],
        "vocabulary_question": "Is a ████████████ a country that rules itself entirely or one that is protected by a more powerful state?"
    },
    {
        "word": "protuberant",
        "meaning": "Swelling outward; bulging.",
        "sentences": ["The frog's protuberant eyes allowed it to see in almost every direction."],
        "vocabulary_question": "Is a ███████████ surface flat and smooth or bulging and swelling outward?"
    },
    {
        "word": "provenance",
        "meaning": "The place of origin or earliest known history of something.",
        "sentences": ["The museum verified the provenance of the painting to ensure it was not a fake."],
        "vocabulary_question": "Does the ██████████ of an object refer to its future destination or its place of origin?"
    },
    {
        "word": "proviant",
        "meaning": "Provisions; food supplies, especially for an army.",
        "sentences": ["The soldiers packed enough proviant to last through the long march across the mountains."],
        "vocabulary_question": "Is ████████ a type of heavy weapon or a supply of food?"
    },
    {
        "word": "provincial",
        "meaning": "Relating to a province; or having a narrow, limited, or unsophisticated outlook.",
        "sentences": ["Coming from a small village, he found the city's fast pace much different from his provincial life."],
        "vocabulary_question": "Is a ██████████ view one that is worldly and broad or narrow and limited?"
    },
    {
        "word": "proviso",
        "meaning": "A condition or qualification attached to an agreement or statement.",
        "sentences": ["He agreed to the deal with the proviso that he could change his mind within 24 hours."],
        "vocabulary_question": "Is a ███████ a final decision or a specific condition attached to an agreement?"
    },
    {
        "word": "puchero",
        "meaning": "A type of stew or boiled dinner popular in Spain and South America.",
        "sentences": ["We enjoyed a large bowl of steaming puchero filled with meat and vegetables."],
        "vocabulary_question": "Is ███████ a type of spicy stew or a type of cold dessert?"
    },
    {
        "word": "pueblo",
        "meaning": "A North American Indian settlement of the southwestern US, typically consisting of multistoried adobe houses.",
        "sentences": ["We visited an ancient pueblo in New Mexico to see the traditional clay buildings."],
        "vocabulary_question": "Is a ██████ a type of single-story tent or a multistoried adobe settlement?"
    },
    {
        "word": "pugilist",
        "meaning": "A boxer, especially a professional one.",
        "sentences": ["The famous pugilist trained for months before the heavyweight championship match."],
        "vocabulary_question": "Is a ████████ a person who plays the piano or a person who boxes?"
    },
    {
        "word": "pugnacious",
        "meaning": "Eager or quick to argue, quarrel, or fight.",
        "sentences": ["The pugnacious debate opponent was always ready to challenge every point made."],
        "vocabulary_question": "Is a ██████████ person very peaceful or quick to start a fight?"
    },
    {
        "word": "pulchritude",
        "meaning": "Physical beauty.",
        "sentences": ["The poet wrote many lines praising the pulchritude of the landscape at sunrise."],
        "vocabulary_question": "Is ████████████ a word used to describe ugliness or beauty?"
    },
    {
        "word": "pulka",
        "meaning": "A small, low-slung, boat-like sled used for transport across snow (especially in Scandinavia).",
        "sentences": ["The traveler pulled his supplies behind him in a wooden pulka as he crossed the tundra."],
        "vocabulary_question": "Is a █████ a type of boat for the water or a type of sled for the snow?"
    },
    {
        "word": "purga",
        "meaning": "A violent, cold windstorm in the Russian steppes and Siberia, usually accompanied by snow.",
        "sentences": ["The travelers had to seek shelter quickly when a fierce purga began to blow across the plains."],
        "vocabulary_question": "Is a █████ a warm summer breeze or a violent, cold snowstorm?"
    },
    {
        "word": "purvey",
        "meaning": "To provide or supply (food, drink, or other goods) as one's business.",
        "sentences": ["The local market prides itself on its ability to purvey fresh, organic produce."],
        "vocabulary_question": "When you ██████ goods, are you buying them for yourself or supplying them as a business?"
    },
    {
        "word": "pyrite",
        "meaning": "A shiny yellow mineral consisting of iron disulfide, often called 'fool's gold.'",
        "sentences": ["The miner was disappointed to find that his 'gold' nugget was actually just pyrite."],
        "vocabulary_question": "Is ██████ real gold or a mineral known as 'fool's gold'?"
    },
    {
        "word": "pyrope",
        "meaning": "A deep red garnet (gemstone).",
        "sentences": ["The jeweler set a brilliant pyrope into the center of the silver necklace."],
        "vocabulary_question": "Is a ██████ a type of green emerald or a deep red garnet?"
    },
    {
        "word": "pyrotechnics",
        "meaning": "A display of fireworks; or a brilliant performance or display of a specified skill.",
        "sentences": ["The Fourth of July celebration ended with a spectacular show of pyrotechnics."],
        "vocabulary_question": "Does ████████████ refer to the study of rocks or a display of fireworks?"
    },
    {
        "word": "quadriceps",
        "meaning": "A large muscle group at the front of the thigh, consisting of four distinct muscles.",
        "sentences": ["The athlete felt a pull in her quadriceps while sprinting to the finish line."],
        "vocabulary_question": "Is the ██████████ muscle located in the arm or at the front of the thigh?"
    },
    {
        "word": "quadrilateral",
        "meaning": "A four-sided polygon.",
        "sentences": ["In geometry class, we learned that a square is a special type of quadrilateral."],
        "vocabulary_question": "Does a █████████████ have three sides or four sides?"
    },
    {
        "word": "quadrillion",
        "meaning": "The number 1 followed by 15 zeros (10 to the 15th power).",
        "sentences": ["The computer was capable of performing a quadrillion calculations every second."],
        "vocabulary_question": "Is a ███████████ a very small number or an incredibly large one?"
    },
    {
        "word": "qualms",
        "meaning": "Sudden misgivings or faintheartedness; feelings of doubt or unease.",
        "sentences": ["She had no qualms about reporting the error to her manager immediately."],
        "vocabulary_question": "If you have ██████ about a decision, do you feel perfectly confident or somewhat uneasy?"
    },
    {
        "word": "quarrelsome",
        "meaning": "Apt or disposed to quarrel in an often petty manner; argumentative.",
        "sentences": ["The quarrelsome neighbors were always arguing over the height of the garden fence."],
        "vocabulary_question": "Is a ███████████ person usually very peaceful or quick to start an argument?"
    },
    {
        "word": "querent",
        "meaning": "A person who asks a question, especially one who consults an oracle or tarot reader.",
        "sentences": ["The tarot reader looked at the querent and asked what they wished to know about their future."],
        "vocabulary_question": "Is a ███████ the person giving the answer or the person asking the question?"
    },
    {
        "word": "quesadilla",
        "meaning": "A tortilla folded over a filling, typically of cheese and meat, and then toasted.",
        "sentences": ["I ordered a cheesy chicken quesadilla with a side of fresh salsa."],
        "vocabulary_question": "Is a ██████████ a type of folded toasted tortilla or a type of cold soup?"
    },
    {
        "word": "questionnaire",
        "meaning": "A set of printed or written questions with a choice of answers, devised for a survey or study.",
        "sentences": ["The company sent a questionnaire to its customers to gather feedback on the new product."],
        "vocabulary_question": "Is a █████████████ used to collect information from people or to measure the height of a mountain?"
    },
    {
        "word": "quid pro quo",
        "meaning": "A favor or advantage granted or expected in return for something.",
        "sentences": ["The deal was a clear quid pro quo: he would help with the move if she helped with the party."],
        "vocabulary_question": "Does ████ ███ ███ mean getting something for nothing or an exchange of favors?"
    },
    {
        "word": "quiddity",
        "meaning": "The ultimate form or the essential nature of something; or a trifling point used to evade an argument.",
        "sentences": ["The philosopher's lecture explored the quiddity of existence."],
        "vocabulary_question": "Does ████████ relate to the core essence of a thing or the color of its surface?"
    },
    {
        "word": "quinary",
        "meaning": "Consisting of five; based on the number five.",
        "sentences": ["Ancient civilizations sometimes used a quinary system for counting on their fingers."],
        "vocabulary_question": "Is a ███████ system based on the number two or the number five?"
    },
    {
        "word": "quince",
        "meaning": "A hard, acid, yellowish pear-shaped fruit used in preserves or as flavoring.",
        "sentences": ["We picked a bucket of ripe quince to make a batch of sweet fruit jelly."],
        "vocabulary_question": "Is a ██████ a type of pear-shaped fruit or a type of small forest bird?"
    },
    {
        "word": "quirt",
        "meaning": "A short-handled riding whip with a braided leather lash.",
        "sentences": ["The cowboy used the quirt to encourage his horse during the long cattle drive."],
        "vocabulary_question": "Is a █████ a type of riding whip or a type of traditional hat?"
    },
    {
        "word": "quittance",
        "meaning": "A release from a debt or obligation; a document certifying such a release.",
        "sentences": ["After making the final payment, he received a formal quittance from the bank."],
        "vocabulary_question": "Does a █████████ mean you still owe a debt or that you have been released from it?"
    },
    {
        "word": "quixotic",
        "meaning": "Exceedingly idealistic; unrealistic and impractical.",
        "sentences": ["His quixotic plan to clean the entire city by himself was admired but unlikely to succeed."],
        "vocabulary_question": "Is a ████████ plan very practical and grounded or idealistic and unrealistic?"
    },
    {
        "word": "quotidian",
        "meaning": "Occurring every day; daily; ordinary or commonplace.",
        "sentences": ["The artist found beauty in the most quotidian objects, like a simple bowl of fruit."],
        "vocabulary_question": "Does █████████ describe something that happens once a year or something that happens every day?"
    },
    {
        "word": "QWERTY",
        "meaning": "Denoting the standard layout on English-language typewriters and keyboards.",
        "sentences": ["Most modern computers and phones use the standard QWERTY keyboard layout."],
        "vocabulary_question": "Is ██████ a type of keyboard layout or a type of computer software?"
    },
    {
        "word": "rabato",
        "meaning": "A wide lace-edged collar that was fashionable in the late 16th and early 17th centuries.",
        "sentences": ["The queen's portrait showed her wearing an ornate, stiff rabato."],
        "vocabulary_question": "Is a ██████ a type of wide collar or a type of protective shield?"
    },
    {
        "word": "rabbinic",
        "meaning": "Relating to rabbis or to their writings and teachings on Jewish law.",
        "sentences": ["The scholar spent years studying ancient rabbinic texts."],
        "vocabulary_question": "Does the word ████████ relate to the teachings of rabbis or the study of ocean life?"
    },
    {
        "word": "ramark",
        "meaning": "A fixed radar beacon that transmits independently to help ships navigate.",
        "sentences": ["The ship's radar picked up the signal from the ramark on the distant rocky island."],
        "vocabulary_question": "Is a ██████ a type of radar beacon or a type of life jacket?"
    },
    {
        "word": "rambla",
        "meaning": "A dry ravine or a broad boulevard; especially a famous street in Barcelona.",
        "sentences": ["We enjoyed a leisurely walk down the tree-lined rambla in the center of the city."],
        "vocabulary_question": "Is a ██████ a narrow, dark alley or a broad boulevard?"
    },
    {
        "word": "rambunctious",
        "meaning": "Uncontrollably exuberant; boisterous and noisy.",
        "sentences": ["The rambunctious puppy kept running in circles and barking at the shadows."],
        "vocabulary_question": "Is a ████████████ child very quiet and still or energetic and noisy?"
    },
    {
        "word": "ramson",
        "meaning": "A wild leek or garlic with broad leaves and white flowers, often used in cooking.",
        "sentences": ["The forest floor was covered with a carpet of fragrant white-flowered ramsons."],
        "vocabulary_question": "Is a ██████ a type of wild garlic or a type of poisonous mushroom?"
    },
    {
        "word": "rankles",
        "meaning": "(Of a comment, event, or fact) to cause annoyance or resentment that persists.",
        "sentences": ["The unfair criticism from his coach still rankles him months later."],
        "vocabulary_question": "If something ███████, does it make you feel happy or cause a lingering sense of annoyance?"
    },
    {
        "word": "rapscallion",
        "meaning": "A mischievous person; a rascal.",
        "sentences": ["The little rapscallion was caught trying to sneak an extra cookie from the jar."],
        "vocabulary_question": "Is a ███████████ a very serious law official or a mischievous rascal?"
    },
    {
        "word": "raptatorial",
        "meaning": "Adapted for seizing prey; predatory.",
        "sentences": ["Eagles have powerful, raptatorial talons used for catching fish and small mammals."],
        "vocabulary_question": "Do ███████████ feet help an animal to eat plants or to seize and catch prey?"
    },
    {
        "word": "rapturous",
        "meaning": "Characterized by feeling or expressing great pleasure or enthusiasm.",
        "sentences": ["The singer received a rapturous applause from the delighted crowd."],
        "vocabulary_question": "Is a █████████ response one of great boredom or great enthusiasm?"
    },
    {
        "word": "rariora",
        "meaning": "Rare collector's items, such as old and rare books.",
        "sentences": ["The museum's vault contained a priceless collection of rariora from the 15th century."],
        "vocabulary_question": "Does ████████ refer to common everyday items or rare collector's pieces?"
    },
    {
        "word": "rasorial",
        "meaning": "Characterized by scratching the ground in search of food (like a chicken).",
        "sentences": ["Chickens are rasorial birds that spend much of their day foraging in the dirt."],
        "vocabulary_question": "Is a ████████ bird one that dives into the water or one that scratches the ground for food?"
    },
    {
        "word": "raucous",
        "meaning": "Noisily unrestrained and rowdy; disorderly.",
        "sentences": ["The raucous cheers of the fans could be heard from three blocks away."],
        "vocabulary_question": "Is a ███████ party very quiet and calm or noisy and rowdy?"
    },
    {
        "word": "ravioli",
        "meaning": "Small pasta envelopes containing a ground meat, cheese, or vegetable filling.",
        "sentences": ["For dinner, we served homemade ravioli with a simple tomato and basil sauce."],
        "vocabulary_question": "Is ███████ a type of long, thin noodle or a small pasta envelope with a filling?"
    },
    {
        "word": "reagent",
        "meaning": "A substance or mixture used in chemical analysis or other reactions.",
        "sentences": ["The scientist added a specific reagent to the solution to see if it would change color."],
        "vocabulary_question": "Is a ███████ used to clean a laboratory floor or to cause a chemical reaction?"
    },
    {
        "word": "realgar",
        "meaning": "A bright red or orange mineral consisting of arsenic sulfide.",
        "sentences": ["The mineral collection included a striking sample of orange-red realgar."],
        "vocabulary_question": "Is ███████ a type of edible fruit or a bright red-orange mineral?"
    },
    {
        "word": "realm",
        "meaning": "A kingdom; or a primary sphere or domain of interest or activity.",
        "sentences": ["The discovery of the new planet opened up a whole new realm of possibilities for science."],
        "vocabulary_question": "Does a █████ refer to a small, private house or a kingdom or domain?"
    },
    {
        "word": "Realtor",
        "meaning": "A person who acts as an agent for the sale and purchase of buildings and land.",
        "sentences": ["We hired a Realtor to help us find a new house in a quiet neighborhood."],
        "vocabulary_question": "Does a ███████ help people buy houses or help people repair broken cars?"
    },
    {
        "word": "rebab",
        "meaning": "A stringed instrument, typically with one or two strings, used in Islamic and Southeast Asian music.",
        "sentences": ["The musician played a haunting melody on the ancient rebab."],
        "vocabulary_question": "Is a █████ a type of traditional drum or a stringed musical instrument?"
    },
    {
        "word": "rebarbative",
        "meaning": "Unattractive and objectionable; repellent.",
        "sentences": ["The building’s rebarbative architecture made it the least popular landmark in the city."],
        "vocabulary_question": "Does ███████████ describe something very beautiful or something unattractive and repellent?"
    },
    {
        "word": "reboation",
        "meaning": "A loud echoing or roaring noise.",
        "sentences": ["The reboation of the thunder shook the windows of the old house."],
        "vocabulary_question": "Is █████████ a soft, quiet whisper or a loud, roaring echo?"
    },
    {
        "word": "recalcitrant",
        "meaning": "Obstinately defiant of authority or restraint; stubbornly disobedient.",
        "sentences": ["The recalcitrant mule refused to move, no matter how much the farmer pulled."],
        "vocabulary_question": "Is a ████████████ person easy to lead or stubbornly disobedient?"
    },
    {
        "word": "reciprocity",
        "meaning": "The practice of exchanging things with others for mutual benefit.",
        "sentences": ["The two nations signed a trade agreement based on the principle of reciprocity."],
        "vocabulary_question": "Does ███████████ involve one person taking everything or a mutual exchange of benefits?"
    },
    {
        "word": "reconcilable",
        "meaning": "Capable of being made compatible or brought into harmony.",
        "sentences": ["The two different versions of the story were eventually found to be reconcilable."],
        "vocabulary_question": "If two ideas are ████████████, can they be made to work together or are they completely opposite?"
    },
    {
        "word": "reconnoiter",
        "meaning": "To make a military observation of (a region); to scout an area to gain information.",
        "sentences": ["The scouts were sent ahead to reconnoiter the enemy's position."],
        "vocabulary_question": "When you ███████████, are you attacking a target or scouting it for information?"
    },
    {
        "word": "recreant",
        "meaning": "Cowardly; or unfaithful to a belief; a deserter.",
        "sentences": ["The knight was branded a recreant after he fled from the battlefield."],
        "vocabulary_question": "Is a ████████ person very brave and loyal or cowardly and unfaithful?"
    },
    {
        "word": "recrementitious",
        "meaning": "Consisting of or relating to waste matter or dross.",
        "sentences": ["The factory had to find a safe way to dispose of recrementitious materials."],
        "vocabulary_question": "Does ███████████████ describe something valuable or something that is waste matter?"
    },
    {
        "word": "recriminatory",
        "meaning": "Involving accusations made in return; counter-charging.",
        "sentences": ["The argument turned into a series of recriminatory shouts as they blamed each other."],
        "vocabulary_question": "Is a █████████████ statement one of praise or one that makes a counter-accusation?"
    },
    {
        "word": "recrudescent",
        "meaning": "Breaking out again; renewing; especially of a disease or a problem.",
        "sentences": ["The doctors worried about a recrudescent fever after the patient seemed to recover."],
        "vocabulary_question": "Does ████████████ describes a problem that is gone forever or one that is breaking out again?"
    },
    {
        "word": "recumbent",
        "meaning": "Lying down; especially in a position of comfort or rest.",
        "sentences": ["He spent the afternoon in a recumbent position on the porch hammock."],
        "vocabulary_question": "Is a █████████ person standing straight up or lying down comfortably?"
    },
    {
        "word": "recusancy",
        "meaning": "Refusal to submit to an established authority or to comply with a regulation.",
        "sentences": ["The historian wrote about the history of religious recusancy in the 16th century."],
        "vocabulary_question": "Does █████████ involve following every rule or refusing to submit to authority?"
    },
    {
        "word": "redolent",
        "meaning": "Strongly reminiscent or suggestive of something; or fragrant.",
        "sentences": ["The kitchen was redolent of cinnamon and warm apple pie."],
        "vocabulary_question": "If a room is ████████ of something, does it have a strong scent or suggest a specific memory?"
    },
    {
        "word": "refrigerant",
        "meaning": "A substance used for cooling or refrigeration.",
        "sentences": ["The technician checked the air conditioner to see if it needed more refrigerant."],
        "vocabulary_question": "Is a ███████████ used to heat a room or to cool it down?"
    },
    {
        "word": "refugium",
        "meaning": "An area in which a population of organisms can survive through a period of unfavorable conditions.",
        "sentences": ["The deep valley served as a refugium for rare plants during the ice age."],
        "vocabulary_question": "Is a █████████ a place where organisms go to perish or a safe place where they can survive?"
    },
    {
        "word": "regalia",
        "meaning": "The emblems or insignia of royalty, such as the crown and scepter.",
        "sentences": ["The king was dressed in his full regalia for the coronation ceremony."],
        "vocabulary_question": "Does ███████ refer to common everyday clothes or the symbols and emblems of royalty?"
    },
    {
        "word": "regatta",
        "meaning": "An organized series of rowing, speedboat, or sailing races.",
        "sentences": ["The local yacht club hosted an annual regatta in the harbor."],
        "vocabulary_question": "Is a ███████ a race held on land or an organized series of boat races?"
    },
    {
        "word": "reggae",
        "meaning": "A style of popular music with a strongly accented subsidiary beat, originating in Jamaica.",
        "sentences": ["The beach party featured a band playing upbeat reggae music."],
        "vocabulary_question": "Is ██████ a type of classical music or a popular style of music from Jamaica?"
    },
    {
        "word": "regnal",
        "meaning": "Relating to a reign, especially of a monarch.",
        "sentences": ["The historian used the regnal dates to organize the timeline of the dynasty."],
        "vocabulary_question": "Does the word ██████ relate to the rules of a game or the reign of a monarch?"
    },
    {
        "word": "regurgitate",
        "meaning": "To bring swallowed food up again to the mouth; or to repeat information without understanding it.",
        "sentences": ["The mother bird would regurgitate food to feed her young chicks."],
        "vocabulary_question": "When an animal ████████████, are they swallowing food or bringing it back up?"
    },
    {
        "word": "reimbursable",
        "meaning": "Repayable; capable of being paid back for expenses incurred.",
        "sentences": ["Make sure to save your receipts, as your travel costs are fully reimbursable."],
        "vocabulary_question": "If an expense is ████████████, does it mean you lose the money forever or you can get it back?"
    },
    {
        "word": "reminiscent",
        "meaning": "Tending to remind one of something; suggestive of the past.",
        "sentences": ["The old song was reminiscent of the summers we spent at the lake."],
        "vocabulary_question": "Does a ███████████ sound help you remember the past or help you forget it?"
    },
    {
        "word": "remonstrance",
        "meaning": "A forcefully reproachful protest.",
        "sentences": ["The citizens gathered at the city hall to offer a formal remonstrance against the new law."],
        "vocabulary_question": "Is a ████████████ a sign of happy agreement or a forceful protest?"
    },
    {
        "word": "remuda",
        "meaning": "A herd of horses from which those to be used for the day's work are chosen.",
        "sentences": ["The cowboys rounded up the remuda to select fresh horses for the afternoon."],
        "vocabulary_question": "Is a ██████ a herd of cattle or a group of working horses?"
    },
    {
        "word": "remuneration",
        "meaning": "Money paid for work or a service; compensation.",
        "sentences": ["The job offers a high salary and excellent remuneration for overtime work."],
        "vocabulary_question": "Does ████████████ involve receiving a punishment or receiving payment for services?"
    },
    {
        "word": "renegotiate",
        "meaning": "To negotiate again in order to change the terms of an agreement.",
        "sentences": ["The athlete hoped to renegotiate his contract after his record-breaking season."],
        "vocabulary_question": "When you ███████████, are you accepting an old deal or trying to change the terms of one?"
    },
    {
        "word": "renitency",
        "meaning": "The quality of being resistant to pressure; stubbornness.",
        "sentences": ["The negotiator was frustrated by the official's calm renitency to every proposal."],
        "vocabulary_question": "Does █████████ describe someone who is easily pushed around or someone who resists pressure?"
    },
    {
        "word": "renunciant",
        "meaning": "A person who gives up something, especially a person who has renounced the world for spiritual reasons.",
        "sentences": ["The renunciant left his wealthy life behind to live a simple life in the monastery."],
        "vocabulary_question": "Is a ██████████ someone who collects many possessions or someone who gives them up?"
    },
    {
        "word": "reparations",
        "meaning": "The making of amends for a wrong one has done, by paying money to or otherwise helping those who have been wronged.",
        "sentences": ["The treaty required the defeated nation to pay war reparations to its neighbors."],
        "vocabulary_question": "Are ███████████ meant to cause further harm or to make amends for a past wrong?"
    },
    {
        "word": "repentant",
        "meaning": "Expressing or feeling sincere regret and remorse; sorry.",
        "sentences": ["The boy looked truly repentant as he apologized for breaking the window."],
        "vocabulary_question": "Is a █████████ person someone who feels no guilt or someone who is sincerely sorry?"
    },
    {
        "word": "repercussion",
        "meaning": "An unintended consequence occurring some time after an event or action, especially an unwelcome one.",
        "sentences": ["The decision to cut the budget had a serious repercussion for the local library."],
        "vocabulary_question": "Is a ████████████ an immediate result or a consequence that happens later on?"
    },
    {
        "word": "replevin",
        "meaning": "A legal action to recover personal property that has been wrongfully taken or withheld.",
        "sentences": ["The business owner filed a writ of replevin to get back his stolen equipment."],
        "vocabulary_question": "Does ████████ relate to the act of giving property away or the legal action to get it back?"
    },
    {
        "word": "replicate",
        "meaning": "To make an exact copy of; reproduce.",
        "sentences": ["The scientists tried to replicate the results of the experiment in their own lab."],
        "vocabulary_question": "When you █████████ something, are you creating a original work or making a copy?"
    },
    {
        "word": "repository",
        "meaning": "A place where things are or may be stored; a warehouse or archive.",
        "sentences": ["The library serves as a repository for millions of historical documents."],
        "vocabulary_question": "Is a ██████████ a place for throwing things away or a place for storing them?"
    },
    {
        "word": "reprieve",
        "meaning": "A cancellation or postponement of a punishment; or temporary relief from danger or pain.",
        "sentences": ["The rain provided a brief reprieve from the scorching afternoon heat."],
        "vocabulary_question": "Does a ████████ mean that a difficult situation is getting worse or that there is a temporary relief?"
    },
    {
        "word": "reprisal",
        "meaning": "An act of retaliation, especially in war.",
        "sentences": ["The group feared a violent reprisal after their protest in the city square."],
        "vocabulary_question": "Is a ████████ an act of kindness or an act of retaliation for something done to you?"
    },
    {
        "word": "Requiem",
        "meaning": "A mass for the repose of the souls of the dead; or a musical composition for such a mass.",
        "sentences": ["The orchestra performed Mozart's Requiem in honor of the late composer."],
        "vocabulary_question": "Is a ███████ a celebratory song for a wedding or a solemn service for the dead?"
    },
    {
        "word": "requisition",
        "meaning": "An official order laying claim to the use of property or materials.",
        "sentences": ["The general issued a requisition for more fuel and food for the troops."],
        "vocabulary_question": "Is a ███████████ a polite request or an official order to take or use something?"
    },
    {
        "word": "reredos",
        "meaning": "An ornamental screen covering the wall at the back of an altar.",
        "sentences": ["The cathedral's reredos was carved from solid oak and decorated with gold leaf."],
        "vocabulary_question": "Is a ███████ a type of floor tile or an ornamental screen behind an altar?"
    },
    {
        "word": "resilience",
        "meaning": "The capacity to recover quickly from difficulties; toughness.",
        "sentences": ["The community showed great resilience as they worked together to rebuild after the storm."],
        "vocabulary_question": "Does ██████████ describe someone who gives up easily or someone who recovers quickly from hardship?"
    },
    {
        "word": "restitutory",
        "meaning": "Tending to restore something to its original state or to compensate for loss.",
        "sentences": ["The court ordered a restitutory payment to the victim of the fraud."],
        "vocabulary_question": "Is a ███████████ action meant to take something away or to restore/compensate for a loss?"
    },
    {
        "word": "résumé",
        "meaning": "A brief account of a person’s education, qualifications, and previous experience, typically sent with a job application.",
        "sentences": ["She updated her résumé to include her most recent internship at the hospital."],
        "vocabulary_question": "Is a ███████ a long book about your life or a brief summary used to apply for a job?"
    },
    {
        "word": "resurrected",
        "meaning": "Restored to life; brought back into use or existence.",
        "sentences": ["The old fashion trend from the 90s has been resurrected by modern designers."],
        "vocabulary_question": "If something is ███████████, has it been forgotten forever or brought back to life/use?"
    },
    {
        "word": "resuscitate",
        "meaning": "To revive someone from unconsciousness or apparent death.",
        "sentences": ["The lifeguard worked quickly to resuscitate the swimmer who had been underwater too long."],
        "vocabulary_question": "Does to ███████████ mean to put someone to sleep or to revive them from unconsciousness?"
    },
    {
        "word": "reticent",
        "meaning": "Not revealing one’s thoughts or feelings readily; uncommunicative.",
        "sentences": ["The witness was reticent, giving only short and vague answers to the questions."],
        "vocabulary_question": "Is a ████████ person someone who talks about everything or someone who is quiet and reserved?"
    },
    {
        "word": "retina",
        "meaning": "A layer at the back of the eyeball containing cells that are sensitive to light.",
        "sentences": ["The light enters the eye and forms an image on the retina."],
        "vocabulary_question": "Is the ██████ located in the front of the eye or at the back of the eyeball?"
    },
    {
        "word": "retinol",
        "meaning": "A form of Vitamin A that is often used in skincare products.",
        "sentences": ["She started using a cream with retinol to help improve her skin's texture."],
        "vocabulary_question": "Is ███████ a type of metal or a form of Vitamin A used for skin?"
    },
    {
        "word": "retinoscopy",
        "meaning": "A technique used to determine the refractive error of the eye.",
        "sentences": ["The eye doctor performed a retinoscopy to check the patient's vision and prescribe glasses."],
        "vocabulary_question": "Does ███████████ help a doctor examine the ears or the vision in the eyes?"
    },
    {
        "word": "retrocedence",
        "meaning": "The act of ceding or giving back something (like territory) that had previously been ceded.",
        "sentences": ["The treaty called for the retrocedence of the island to its original owners."],
        "vocabulary_question": "Does ████████████ involve taking new land or giving back land that was previously taken?"
    },
    {
        "word": "retrodict",
        "meaning": "To state a fact about the past based on current evidence or laws of nature; to predict backward.",
        "sentences": ["Astronomers can retrodict the position of the planets millions of years ago."],
        "vocabulary_question": "Does to █████████ mean to guess about the future or to state a fact about the past?"
    },
    {
        "word": "retrograde",
        "meaning": "Moving backward; or showing a decline or deterioration.",
        "sentences": ["The planet appeared to be in a retrograde motion against the stars."],
        "vocabulary_question": "Does █████████ mean moving forward to something better or moving backward/declining?"
    },
    {
        "word": "revenant",
        "meaning": "A person who has returned, especially supposedly from the dead.",
        "sentences": ["In the ghost story, the revenant returned to the old house every hundred years."],
        "vocabulary_question": "Is a ████████ someone who has gone away forever or someone who has returned?"
    },
    {
        "word": "reverberant",
        "meaning": "Characterized by or producing echoes; resounding.",
        "sentences": ["The large, empty hall was highly reverberant, making every footstep sound like a drum."],
        "vocabulary_question": "Is a ███████████ room one that is quiet and muffled or one that produces echoes?"
    },
    {
        "word": "rhapsody",
        "meaning": "An effusively enthusiastic or ecstatic expression of feeling; or a free-flowing musical composition.",
        "sentences": ["He went into a rhapsody about the beauty of the mountain sunset."],
        "vocabulary_question": "Is a ████████ a very calm, logical explanation or an enthusiastic expression of feeling?"
    },
    {
        "word": "rhizome",
        "meaning": "A continuously growing horizontal underground stem that puts out lateral shoots and adventitious roots at intervals.",
        "sentences": ["Ginger and turmeric are common plants that grow from a thick rhizome."],
        "vocabulary_question": "Is a ███████ a vertical tree trunk or a horizontal underground stem?"
    },
    {
        "word": "ricochet",
        "meaning": "To rebound one or more times off a surface.",
        "sentences": ["We watched the smooth stone ricochet across the surface of the pond five times."],
        "vocabulary_question": "When an object ████████s, does it stop immediately or bounce off a surface?"
    },
    {
        "word": "rictus",
        "meaning": "A fixed grimace or grin; or the gaping mouth of a bird or beast.",
        "sentences": ["The clown’s face was frozen in a terrifying, painted rictus."],
        "vocabulary_question": "Is a ██████ a relaxed, natural expression or a fixed, often gaping grin or grimace?"
    },
    {
        "word": "rigatoni",
        "meaning": "Pasta in the form of short hollow fluted tubes.",
        "sentences": ["The hearty meat sauce clung perfectly to the ridges of the rigatoni."],
        "vocabulary_question": "Is ████████ a type of long, thin noodle or a short, hollow tube-shaped pasta?"
    },
    {
        "word": "ritziness",
        "meaning": "The quality of being expensive, fashionable, or ostentatiously smart.",
        "sentences": ["The ritziness of the hotel lobby was evident in the massive crystal chandeliers."],
        "vocabulary_question": "Does ██████████ describe a place that is very plain and cheap or very fancy and expensive?"
    },
    {
        "word": "rollicking",
        "meaning": "Exuberantly lively and amusing.",
        "sentences": ["The children had a rollicking good time playing tag in the backyard."],
        "vocabulary_question": "Is a ██████████ event boring and quiet or lively and fun?"
    },
    {
        "word": "Romano",
        "meaning": "A hard, salty Italian cheese that is often grated.",
        "sentences": ["She sprinkled a generous amount of Pecorino Romano over her pasta."],
        "vocabulary_question": "Is ██████ a type of soft, sweet dessert or a hard, salty Italian cheese?"
    },
    {
        "word": "romeite",
        "meaning": "A mineral consisting of an antimonate of calcium, typically occurring in yellow or brown crystals.",
        "sentences": ["The geologist identified the yellow crystals in the rock sample as romeite."],
        "vocabulary_question": "Is ███████ a type of garden flower or a crystalline mineral?"
    },
    {
        "word": "rosin",
        "meaning": "A hard, sticky substance made from pine resin, used on the bows of stringed instruments.",
        "sentences": ["The cellist rubbed rosin onto her bow to help it grip the strings and produce sound."],
        "vocabulary_question": "Is █████ used to make a surface slippery or to help a violin bow grip the strings?"
    },
    {
        "word": "rostrum",
        "meaning": "A pulpit or platform occupied by an orator or public speaker.",
        "sentences": ["The valedictorian stepped up to the rostrum to deliver her graduation speech."],
        "vocabulary_question": "Is a ███████ a low pit for musicians or a raised platform for a speaker?"
    },
    {
        "word": "rote",
        "meaning": "Mechanical or habitual repetition of something to be learned.",
        "sentences": ["He learned his multiplication tables by rote, repeating them until they were memorized."],
        "vocabulary_question": "Does learning by ████ involve deep creative thinking or mechanical repetition?"
    },
    {
        "word": "rotogravure",
        "meaning": "A printing system using etched cylinders, typically used for high-quality magazines or stamps.",
        "sentences": ["The vintage magazine was printed using a beautiful rotogravure process."],
        "vocabulary_question": "Is ███████████ a method for building houses or a method for printing?"
    },
    {
        "word": "rotulet",
        "meaning": "A small roll, especially a small roll of parchment.",
        "sentences": ["The historian carefully unrolled the ancient rotulet to read the scribe's notes."],
        "vocabulary_question": "Is a ███████ a massive stone pillar or a small roll of parchment?"
    },
    {
        "word": "roustabout",
        "meaning": "An unskilled or semiskilled laborer, especially in an oil field or circus.",
        "sentences": ["The roustabout worked long hours setting up the massive circus tents."],
        "vocabulary_question": "Is a ██████████ a high-ranking manager or a laborer who does varied physical work?"
    },
    {
        "word": "Rubicon",
        "meaning": "A point of no return; named for the river Julius Caesar crossed to begin a civil war.",
        "sentences": ["By signing the contract, the company had crossed the Rubicon and could not go back."],
        "vocabulary_question": "Is the ███████ a safe place to rest or a point of no return?"
    },
    {
        "word": "rudiments",
        "meaning": "The first principles or elements of a subject.",
        "sentences": ["In the first week of class, the students learned the rudiments of Spanish grammar."],
        "vocabulary_question": "Are █████████ the most advanced parts of a subject or the basic first principles?"
    },
    {
        "word": "rugose",
        "meaning": "Wrinkled or corrugated.",
        "sentences": ["The dried leaf had a rugose texture that felt rough to the touch."],
        "vocabulary_question": "Is a ██████ surface perfectly smooth or wrinkled and rough?"
    },
    {
        "word": "ruminate",
        "meaning": "To carefully think about something for a while; or (of a cow) to chew the cud.",
        "sentences": ["I need some time to ruminate on your offer before I make a final decision."],
        "vocabulary_question": "When you ████████, are you making a split-second choice or thinking deeply for a while?"
    },
    {
        "word": "rustication",
        "meaning": "Construction with rough-surfaced masonry blocks; or the act of moving to the country.",
        "sentences": ["The ground floor of the palace featured heavy stone rustication."],
        "vocabulary_question": "Does ███████████ involve smooth, shiny glass or rough-surfaced stone blocks?"
    },
    {
        "word": "sabbatical",
        "meaning": "A period of paid leave granted to a university teacher or other worker for study or travel.",
        "sentences": ["The professor took a year-long sabbatical to write her new book on ancient history."],
        "vocabulary_question": "Is a ██████████ a permanent retirement or a temporary break for study or travel?"
    },
    {
        "word": "sabermetrics",
        "meaning": "The application of statistical analysis to baseball data in order to measure player performance.",
        "sentences": ["The team's general manager relied heavily on sabermetrics to find undervalued players."],
        "vocabulary_question": "Does ████████████ involve the study of fencing or the statistical analysis of baseball?"
    },
    {
        "word": "sacrament",
        "meaning": "A religious ceremony or act of the Christian Church that is regarded as an outward and visible sign of inward and spiritual divine grace.",
        "sentences": ["In many traditions, baptism is considered a holy sacrament."],
        "vocabulary_question": "Is a █████████ a religious ceremony or a type of ancient stone tool?"
    },
    {
        "word": "sacrosanct",
        "meaning": "Regarded as too important or valuable to be interfered with; inviolable.",
        "sentences": ["To the dedicated musician, the hours spent practicing every morning were sacrosanct."],
        "vocabulary_question": "Is something ██████████ easily changed or too important to be interfered with?"
    },
    {
        "word": "sailage",
        "meaning": "The act of sailing; or the collective sails of a ship.",
        "sentences": ["The massive ship's sailage allowed it to catch even the slightest breeze."],
        "vocabulary_question": "Does ███████ refer to the speed of a ship or the collective sails that move it?"
    },
    {
        "word": "salat",
        "meaning": "The ritual prayer of Muslims, performed five times daily in a set form.",
        "sentences": ["The faithful gathered at the mosque to perform the afternoon salat."],
        "vocabulary_question": "Is █████ a type of traditional food or a ritual prayer performed by Muslims?"
    },
    {
        "word": "salience",
        "meaning": "The quality of being particularly noticeable or important; prominence.",
        "sentences": ["The salience of the issue became clear during the televised debate."],
        "vocabulary_question": "Does ████████ describe something that is hidden and minor or something noticeable and prominent?"
    },
    {
        "word": "saltatory",
        "meaning": "Relating to or adapted for leaping or jumping.",
        "sentences": ["Grasshoppers are known for their saltatory movement across the fields."],
        "vocabulary_question": "Does the word █████████ describe an animal that crawls or one that leaps and jumps?"
    },
    {
        "word": "saltern",
        "meaning": "An area or installation for making salt; a salt works.",
        "sentences": ["The workers collected the dried crystals from the pans at the coastal saltern."],
        "vocabulary_question": "Is a ███████ a place where sugar is refined or a place where salt is made?"
    },
    {
        "word": "saltire",
        "meaning": "A heraldic symbol in the form of a diagonal cross (like an X).",
        "sentences": ["The flag of Scotland features a white saltire on a blue background."],
        "vocabulary_question": "Is a ███████ a cross shaped like a '+' or a cross shaped like an 'X'?"
    },
    {
        "word": "sapphire",
        "meaning": "A precious gemstone of a transparent blue variety of corundum.",
        "sentences": ["Her engagement ring was set with a brilliant deep blue sapphire."],
        "vocabulary_question": "Is a ████████ a type of green emerald or a type of blue gemstone?"
    },
    {
        "word": "sardonic",
        "meaning": "Indicative of or marked by mockery, ridicule, or scorn.",
        "sentences": ["The villain gave a sardonic laugh as the hero fell into his trap."],
        "vocabulary_question": "Is a ████████ remark kind and encouraging or mocking and scornful?"
    },
    {
        "word": "sarmentum",
        "meaning": "A prostrate, slender stem; a runner (like that of a strawberry plant).",
        "sentences": ["The gardener noticed a new sarmentum spreading across the soil from the main plant."],
        "vocabulary_question": "Is a ██████████ a tall tree trunk or a slender, creeping plant stem?"
    },
    {
        "word": "sartorial",
        "meaning": "Relating to tailoring, clothes, or style of dress.",
        "sentences": ["The actor was praised for his sartorial elegance on the red carpet."],
        "vocabulary_question": "Does the word █████████ relate to a person's cooking skills or their style of dress?"
    },
    {
        "word": "sashay",
        "meaning": "To walk in an ostentatious yet casual manner, typically with exaggerated hip movements.",
        "sentences": ["The model began to sashay down the runway to the beat of the music."],
        "vocabulary_question": "When you ██████, are you running quickly or walking with exaggerated, stylish movement?"
    },
    {
        "word": "satrap",
        "meaning": "A provincial governor in the ancient Persian empire; or any subordinate or local ruler.",
        "sentences": ["The king appointed a loyal satrap to manage the distant eastern province."],
        "vocabulary_question": "Was a ██████ an ancient Persian governor or a type of military weapon?"
    },
    {
        "word": "saturnine",
        "meaning": "Slow and gloomy (of a person or their manner).",
        "sentences": ["His saturnine expression suggested he was not in the mood for a party."],
        "vocabulary_question": "Is a █████████ mood one of great joy or one that is slow and gloomy?"
    },
    {
        "word": "sauerkraut",
        "meaning": "Finely cut raw cabbage that has been fermented by various lactic acid bacteria.",
        "sentences": ["We topped our hot dogs with a generous scoop of tangy sauerkraut."],
        "vocabulary_question": "Is ██████████ made from fermented cabbage or fermented potatoes?"
    },
    {
        "word": "Scamozzi",
        "meaning": "Relating to Vincenzo Scamozzi, a 16th-century Italian architect who influenced the Palladian style.",
        "sentences": ["The museum's columns were designed in the elegant Scamozzi style."],
        "vocabulary_question": "Does the word ████████ relate to a famous Italian architect or a type of Italian pasta?"
    },
    {
        "word": "scarab",
        "meaning": "A large dung beetle of the eastern Mediterranean, regarded as holy in ancient Egypt.",
        "sentences": ["The archaeologist found a golden scarab amulet hidden inside the tomb."],
        "vocabulary_question": "Is a ██████ a type of desert bird or a beetle that was sacred in ancient Egypt?"
    },
    {
        "word": "scarlatina",
        "meaning": "Another term for scarlet fever.",
        "sentences": ["The child was kept home from school until the symptoms of scarlatina had passed."],
        "vocabulary_question": "Is ███████████ a type of flower or another name for scarlet fever?"
    },
    {
        "word": "scenographer",
        "meaning": "A person who designs the sets, costumes, and overall visual environment for a stage production.",
        "sentences": ["The scenographer created a stunning winter wonderland for the first act of the play."],
        "vocabulary_question": "Does a █████████████ design the music for a show or the visual environment of the stage?"
    },
    {
        "word": "scherzo",
        "meaning": "A vigorous, light, or playful composition, typically comprising a movement in a symphony or sonata.",
        "sentences": ["The orchestra played the lively scherzo with great energy and speed."],
        "vocabulary_question": "In music, is a ███████ a very slow, sad funeral march or a light, playful piece?"
    },
    {
        "word": "schism",
        "meaning": "A split or division between strongly opposed sections or parties, caused by differences in opinion or belief.",
        "sentences": ["The disagreement over the new rules caused a major schism within the club."],
        "vocabulary_question": "Does a ██████ represent a group coming together or a group splitting apart?"
    },
    {
        "word": "schnell",
        "meaning": "German word for 'fast' or 'quick.'",
        "sentences": ["The conductor urged the musicians to play more schnell during the finale."],
        "vocabulary_question": "If you are told to move ███████, should you go faster or slower?"
    },
    {
        "word": "schooner",
        "meaning": "A sailing ship with two or more masts, typically with the foremast smaller than the mainmast.",
        "sentences": ["The schooner glided gracefully across the bay under full sail."],
        "vocabulary_question": "Is a ████████ a type of horse-drawn carriage or a type of sailing ship?"
    },
    {
        "word": "sclerosis",
        "meaning": "Abnormal hardening of body tissue.",
        "sentences": ["The doctor explained that the patient's symptoms were caused by multiple sclerosis."],
        "vocabulary_question": "Does █████████ involve the softening of tissue or the abnormal hardening of it?"
    },
    {
        "word": "scribblative",
        "meaning": "Given to or characterized by much scribbling or writing.",
        "sentences": ["The author's scribblative habits meant his desk was always covered in half-finished notes."],
        "vocabulary_question": "Is a ████████████ person likely to write very little or write a great deal?"
    },
    {
        "word": "scrivener",
        "meaning": "A clerk, scribe, or notary.",
        "sentences": ["In the days before computers, the scrivener was responsible for copying all legal documents by hand."],
        "vocabulary_question": "Was a █████████ a person who built houses or a person who copied documents?"
    },
    {
        "word": "scrumptiously",
        "meaning": "In a way that is extremely pleasing to the taste; delicious.",
        "sentences": ["The cake was scrumptiously sweet and disappeared in minutes."],
        "vocabulary_question": "If something is eaten █████████████, is it tasted with disgust or with great delight?"
    },
    {
        "word": "scudded",
        "meaning": "Moved fast in a straight line because or as if driven by the wind.",
        "sentences": ["Dark clouds scudded across the sky just before the storm broke."],
        "vocabulary_question": "If the clouds ████████, did they stay perfectly still or move quickly across the sky?"
    },
    {
        "word": "scumble",
        "meaning": "To modify a painting by applying a very thin, opaque coat of opaque paint to give a softer or duller effect.",
        "sentences": ["The artist used a dry brush to scumble a layer of white over the blue to create a misty look."],
        "vocabulary_question": "Is ███████ a technique used in heavy construction or in fine art painting?"
    },
    {
        "word": "scuppers",
        "meaning": "Openings in the side of a ship at deck level to allow water to run off.",
        "sentences": ["Heavy waves crashed over the deck, but the water quickly drained through the scuppers."],
        "vocabulary_question": "Are ████████ used to hold extra fuel or to drain water off a ship's deck?"
    },
    {
        "word": "scythe",
        "meaning": "A tool used for cutting crops such as grass or wheat, with a long curved blade at the end of a long pole.",
        "sentences": ["The farmer swung the scythe in a steady rhythm to clear the tall grass."],
        "vocabulary_question": "Is a ██████ a modern electric lawnmower or an ancient tool with a long curved blade?"
    },
    {
        "word": "secant",
        "meaning": "A straight line that cuts a curve in two or more parts.",
        "sentences": ["In geometry, we drew a secant through the circle to find the length of the chord."],
        "vocabulary_question": "In math, is a ██████ a line that never touches a curve or one that cuts through it?"
    },
    {
        "word": "secession",
        "meaning": "The action of withdrawing formally from membership of a federation or body, especially a political state.",
        "sentences": ["The history book detailed the events leading up to the state's secession from the union."],
        "vocabulary_question": "Does █████████ involve joining a group or formally leaving/withdrawing from one?"
    },
    {
        "word": "sedentary",
        "meaning": "Characterized by much sitting and little physical exercise.",
        "sentences": ["A sedentary lifestyle can lead to health problems if you don't make time to move."],
        "vocabulary_question": "Is a █████████ job one where you move around a lot or one where you sit for long periods?"
    },
    {
        "word": "sedge",
        "meaning": "A grass-like plant with triangular stems and inconspicuous flowers, typically growing in wet ground.",
        "sentences": ["The edge of the pond was thick with tall, green sedge."],
        "vocabulary_question": "Is █████ a type of desert cactus or a grass-like plant found in wet areas?"
    },
    {
        "word": "sedum",
        "meaning": "A genus of plants with fleshy, water-storing leaves and clusters of star-shaped flowers.",
        "sentences": ["We planted sedum in the rock garden because it can survive with very little water."],
        "vocabulary_question": "Is ██████ a type of succulent plant or a type of underwater seaweed?"
    },
    {
        "word": "seethe",
        "meaning": "To bubble up as a result of being boiled; or to be filled with intense but unexpressed anger.",
        "sentences": ["He began to seethe with frustration when the computer crashed for the third time."],
        "vocabulary_question": "If you ██████ with anger, are you feeling very calm or very upset and boiling inside?"
    },
    {
        "word": "selenite",
        "meaning": "A form of the mineral gypsum, typically occurring as transparent or translucent crystals.",
        "sentences": ["The museum's mineral exhibit featured a massive, glowing wand of selenite."],
        "vocabulary_question": "Is ████████ a type of dark volcanic rock or a clear, crystalline form of gypsum?"
    },
    {
        "word": "Seminole",
        "meaning": "A member of a North American Indian people of Florida.",
        "sentences": ["The Seminole people are known for their resilience and beautiful patchwork clothing."],
        "vocabulary_question": "Is the ████████ a group of indigenous people from Florida or from Alaska?"
    },
    {
        "word": "senecio",
        "meaning": "A very large genus of flowering plants in the daisy family.",
        "sentences": ["The yellow flowers of the senecio brightened up the hillside in early spring."],
        "vocabulary_question": "Is ███████ a type of flowering plant or a type of deep-sea mammal?"
    },
    {
        "word": "seneschal",
        "meaning": "The steward or major-domo of a medieval great house.",
        "sentences": ["The seneschal was responsible for managing all the servants and the lord's finances."],
        "vocabulary_question": "Was a █████████ a high-ranking manager of a great house or a stable hand?"
    },
    {
        "word": "senna",
        "meaning": "A leguminous plant with yellow flowers; its leaves are often used as a natural laxative.",
        "sentences": ["The herbal tea contained senna to help with the patient's digestion."],
        "vocabulary_question": "Is █████ a type of plant used in medicine or a type of construction metal?"
    },
    {
        "word": "sensei",
        "meaning": "A teacher or instructor, especially of martial arts (Japanese origin).",
        "sentences": ["The students bowed to their sensei before beginning their karate lesson."],
        "vocabulary_question": "Is a ██████ a student just starting out or a respected teacher or instructor?"
    },
    {
        "word": "septennial",
        "meaning": "Recurring every seven years; or lasting for seven years.",
        "sentences": ["The town holds a septennial festival to celebrate its founding every seven years."],
        "vocabulary_question": "Does a ██████████ event happen every two years or every seven years?"
    },
    {
        "word": "septum",
        "meaning": "A partition separating two cavities, such as that between the nostrils or the chambers of the heart.",
        "sentences": ["He had surgery to repair a deviated septum that was making it hard for him to breathe."],
        "vocabulary_question": "Is a ██████ a wall that separates two body cavities or a type of muscle?"
    },
    {
        "word": "sepulchral",
        "meaning": "Relating to a tomb or interment; gloomy or dismal.",
        "sentences": ["A sepulchral silence filled the old, abandoned church."],
        "vocabulary_question": "Does ██████████ describe a bright, happy atmosphere or a gloomy, tomb-like one?"
    },
    {
        "word": "seraphic",
        "meaning": "Characteristic of or resembling a seraph or angel; blissful or serene.",
        "sentences": ["The sleeping baby had a seraphic expression on her face."],
        "vocabulary_question": "Does ████████ describe something that looks devilish or something that looks angelic and serene?"
    },
    {
        "word": "serendipitous",
        "meaning": "Occurring or discovered by a happy accident; lucky.",
        "sentences": ["Finding my lost keys while looking for my wallet was a serendipitous moment."],
        "vocabulary_question": "Is a █████████████ event a carefully planned one or a lucky, happy accident?"
    },
    {
        "word": "serrated",
        "meaning": "Having or denoting a jagged edge; saw-like.",
        "sentences": ["Use a serrated knife to cut the bread so you don't crush the loaf."],
        "vocabulary_question": "Is a ████████ blade perfectly smooth or does it have jagged, saw-like teeth?"
    },
    {
        "word": "sesame",
        "meaning": "A flowering plant whose small, oil-rich seeds are used in cooking.",
        "sentences": ["The hamburger bun was sprinkled with toasted sesame seeds."],
        "vocabulary_question": "Are ██████ seeds used for making bread toppings and oil or for making spicy peppers?"
    },
    {
        "word": "settee",
        "meaning": "A long upholstered seat for more than one person, typically with a back and arms; a sofa.",
        "sentences": ["We sat on the velvet settee in the parlor to have our tea."],
        "vocabulary_question": "Is a ██████ a small wooden stool or a long, comfortable upholstered seat?"
    },
    {
        "word": "severance",
        "meaning": "The action of ending a connection or relationship; or pay given to an employee upon leaving a job.",
        "sentences": ["The company offered him a generous severance package when his position was eliminated."],
        "vocabulary_question": "Does █████████ involve starting a new job or ending a connection or employment?"
    },
    {
        "word": "shallot",
        "meaning": "A small bulb which resembles an onion and is used as a vegetable or for flavoring.",
        "sentences": ["The chef finely chopped the shallot to add a mild onion flavor to the sauce."],
        "vocabulary_question": "Is a ███████ a type of mild onion-like bulb or a type of sweet berry?"
    },
    {
        "word": "shaman",
        "meaning": "A person regarded as having access to, and influence in, the world of good and evil spirits.",
        "sentences": ["The tribe consulted the shaman for guidance and healing."],
        "vocabulary_question": "Is a ██████ a political leader or a spiritual person who uses magic to heal?"
    },
    {
        "word": "shamir",
        "meaning": "A legendary substance or object that has the power to cut through stone or diamond.",
        "sentences": ["Ancient myths tell of the shamir being used to build the Great Temple."],
        "vocabulary_question": "Is a ██████ a soft piece of cloth or a legendary object that can cut through stone?"
    },
    {
        "word": "shanachie",
        "meaning": "A traditional Gaelic storyteller or historian.",
        "sentences": ["The shanachie kept the village children enthralled with tales of ancient Irish heroes."],
        "vocabulary_question": "Is a █████████ a person who builds ships or a traditional Irish storyteller?"
    },
    {
        "word": "shawarma",
        "meaning": "A Middle Eastern dish consisting of meat cut into thin slices, stacked in a cone-like shape, and roasted on a slowly turning vertical rotisserie.",
        "sentences": ["We grabbed a delicious chicken shawarma wrap for lunch."],
        "vocabulary_question": "Is ████████ a type of roasted meat dish or a type of cold dessert?"
    },
    {
        "word": "shazam",
        "meaning": "A word used to introduce a sudden or magical transformation or occurrence.",
        "sentences": ["The magician waved his wand, and shazam! The rabbit disappeared."],
        "vocabulary_question": "Is ██████ a word used to describe a slow process or a sudden, magical change?"
    },
    {
        "word": "shebang",
        "meaning": "The whole of something, including all its details and parts.",
        "sentences": ["He didn't just buy the bike; he bought the helmet, the lights—the whole shebang."],
        "vocabulary_question": "Does the whole ███████ refer to just one small part or the entire thing including everything?"
    },
    {
        "word": "sheldrake",
        "meaning": "A large, brightly colored Old World duck that looks somewhat like a goose.",
        "sentences": ["The common sheldrake is easily spotted by its striking chestnut-colored band."],
        "vocabulary_question": "Is a █████████ a type of forest mammal or a large, colorful duck?"
    },
    {
        "word": "Shenandoah",
        "meaning": "A river and valley in northern Virginia; also a famous American folk song.",
        "sentences": ["We spent our vacation hiking through the beautiful mountains of the Shenandoah valley."],
        "vocabulary_question": "Is ██████████ a famous valley in Virginia or a mountain range in Switzerland?"
    },
    {
        "word": "shenanigans",
        "meaning": "Silly or high-spirited behavior; mischief; or secret/dishonest activity.",
        "sentences": ["The teacher suspected some shenanigans when she found the classroom chairs stacked in a pyramid."],
        "vocabulary_question": "Does ███████████ describe very serious behavior or silly mischief?"
    },
    {
        "word": "Shetland",
        "meaning": "A breed of small, sturdy pony with a thick coat, originally from the Shetland Islands.",
        "sentences": ["The children took turns riding the gentle Shetland pony at the county fair."],
        "vocabulary_question": "Is a ████████ pony known for being very large or small and sturdy?"
    },
    {
        "word": "shirk",
        "meaning": "To avoid or neglect a duty or responsibility.",
        "sentences": ["It is not fair to shirk your chores and leave all the work to your siblings."],
        "vocabulary_question": "If you █████ your duties, are you working extra hard or avoiding them?"
    },
    {
        "word": "shoji",
        "meaning": "A paper screen used as a divider or sliding door in a traditional Japanese house.",
        "sentences": ["Soft light filtered through the white paper of the shoji screen."],
        "vocabulary_question": "Is a █████ a type of heavy stone wall or a sliding paper screen divider?"
    },
    {
        "word": "sieve",
        "meaning": "A utensil consisting of a wire or plastic mesh held in a frame, used for straining solids from liquids or for separating coarser from finer particles.",
        "sentences": ["She used a fine sieve to dust powdered sugar over the lemon bars."],
        "vocabulary_question": "Is a █████ used to hold water or to separate small particles from larger ones?"
    },
    {
        "word": "sijo",
        "meaning": "A traditional Korean poetic form, typically consisting of three lines.",
        "sentences": ["In literature class, we practiced writing a sijo to learn about Korean poetic structure."],
        "vocabulary_question": "Is a ████ a type of traditional Korean poem or a type of dance?"
    },
    {
        "word": "simpatico",
        "meaning": "Likable and easy to get along with; having similar interests or a sympathetic bond.",
        "sentences": ["The two musicians were instantly simpatico, sharing the same vision for the new album."],
        "vocabulary_question": "If two people are █████████, do they constantly argue or do they get along very well?"
    },
    {
        "word": "simultaneity",
        "meaning": "The relation between two events assumed to happen at the same time in a given frame of reference.",
        "sentences": ["The lightning and the thunder lacked simultaneity because light travels faster than sound."],
        "vocabulary_question": "Does ████████████ relate to events happening at different times or at the same time?"
    },
    {
        "word": "singultus",
        "meaning": "The medical term for a hiccup.",
        "sentences": ["The patient suffered from a persistent case of singultus that lasted for hours."],
        "vocabulary_question": "Is █████████ the scientific name for a sneeze or a hiccup?"
    },
    {
        "word": "sirenian",
        "meaning": "A large aquatic plant-eating mammal, such as a manatee or dugong.",
        "sentences": ["The manatee is a gentle sirenian that spends its days grazing on seagrass."],
        "vocabulary_question": "Is a ████████ a fierce deep-sea shark or a peaceful plant-eating aquatic mammal?"
    },
    {
        "word": "Sirius",
        "meaning": "The brightest star in the sky, located in the constellation Canis Major; also called the Dog Star.",
        "sentences": ["On a clear winter night, you can easily spot Sirius sparkling low in the sky."],
        "vocabulary_question": "Is ██████ the name of the brightest star in the sky or a name for the moon?"
    },
    {
        "word": "sirocco",
        "meaning": "A hot, dusty wind blowing from North Africa across the Mediterranean to southern Europe.",
        "sentences": ["The sirocco brought a layer of fine Sahara sand that coated the streets of Sicily."],
        "vocabulary_question": "Is a ███████ a cold Arctic breeze or a hot, dusty wind from the desert?"
    },
    {
        "word": "sisal",
        "meaning": "A strong fiber made from the leaves of a Mexican agave, used for making rope and mats.",
        "sentences": ["The cat's scratching post was wrapped in tough, durable sisal rope."],
        "vocabulary_question": "Is █████ a soft type of silk or a strong fiber used for rope?"
    },
    {
        "word": "siskin",
        "meaning": "A small songbird of the finch family, typically having green, yellow, and black plumage.",
        "sentences": ["We watched a siskin perching on the bird feeder, its yellow feathers bright against the snow."],
        "vocabulary_question": "Is a ██████ a type of small songbird or a type of ocean fish?"
    },
    {
        "word": "Sitona",
        "meaning": "A genus of weevils (beetles) that are pests to leguminous crops like peas and clover.",
        "sentences": ["The farmer noticed Sitona damage on the leaves of the pea plants."],
        "vocabulary_question": "Is ██████ a type of helpful butterfly or a type of beetle that eats crops?"
    },
    {
        "word": "sittine",
        "meaning": "Relating to or resembling a nuthatch (a type of bird).",
        "sentences": ["The bird's sittine behavior of climbing down the tree trunk headfirst identified it as a nuthatch."],
        "vocabulary_question": "Does the word ███████ relate to a type of bird or a type of flower?"
    },
    {
        "word": "slalom",
        "meaning": "Skiing in a curvy course between obstacles, such as poles or gates.",
        "sentences": ["The Olympic skier moved with incredible grace through the gates of the slalom."],
        "vocabulary_question": "Does ██████ involve skiing in a straight line or in a zigzag course around obstacles?"
    },
    {
        "word": "slumgullion",
        "meaning": "A cheap or watery stew; or a reddish-colored muddy deposit in mining.",
        "sentences": ["The hungry miners enjoyed a bowl of hot slumgullion at the end of the day."],
        "vocabulary_question": "Is ███████████ a fancy three-course meal or a simple, watery stew?"
    },
    {
        "word": "smellfungus",
        "meaning": "A perpetual grumbler; a hypercritical person.",
        "sentences": ["Nobody wanted to travel with the old smellfungus, as he complained about every hotel and meal."],
        "vocabulary_question": "Is a ███████████ a very cheerful person or someone who complains all the time?"
    },
    {
        "word": "smithereens",
        "meaning": "Small pieces; bits.",
        "sentences": ["The dropped glass vase shattered into a million smithereens on the tile floor."],
        "vocabulary_question": "If something is in ███████████, is it in one piece or many tiny bits?"
    },
    {
        "word": "snell",
        "meaning": "A short length of line used to attach a fishhook to a heavier line.",
        "sentences": ["The fisherman carefully tied the hook to the snell before casting into the river."],
        "vocabulary_question": "Is a █████ a type of fishing net or a short line that holds a hook?"
    },
    {
        "word": "sobersides",
        "meaning": "A person who is habitually serious or solemn.",
        "sentences": ["Even at the hilarious party, he remained a total sobersides, never cracking a smile."],
        "vocabulary_question": "Is a ██████████ a silly comedian or a very serious person?"
    },
    {
        "word": "solon",
        "meaning": "A wise and skillful lawgiver or statesman.",
        "sentences": ["The town council looked to the elder as a local solon for his wise advice on the new budget."],
        "vocabulary_question": "Is a █████ an inexperienced beginner or a wise statesman?"
    },
    {
        "word": "somatotype",
        "meaning": "A category to which people are assigned according to their body build (such as ectomorph or endomorph).",
        "sentences": ["The trainer analyzed the athlete's somatotype to create a personalized workout plan."],
        "vocabulary_question": "Does ███████████ relate to a person's personality or their physical body build?"
    },
    {
        "word": "somniloquy",
        "meaning": "The act or habit of talking in one's sleep.",
        "sentences": ["Her roommate's somniloquy was quite funny, as she often talked about giant flying pancakes in her sleep."],
        "vocabulary_question": "Does ███████████ involve walking in your sleep or talking in your sleep?"
    },
    {
        "word": "soothsayer",
        "meaning": "A person supposed to be able to foresee the future.",
        "sentences": ["The ancient king consulted a soothsayer before going into battle."],
        "vocabulary_question": "Is a ██████████ someone who studies the past or someone who claims to see the future?"
    },
    {
        "word": "sophomoric",
        "meaning": "Being unaware of limitations and lack of maturity; superficial; or relating to a sophomore.",
        "sentences": ["The critics dismissed the movie's humor as sophomoric and crude."],
        "vocabulary_question": "Is ██████████ behavior very wise and mature or immature and overconfident?"
    },
    {
        "word": "soppiness",
        "meaning": "The quality of being self-indulgently sentimental; or the state of being soaked with liquid.",
        "sentences": ["She rolled her eyes at the extreme soppiness of the romantic greeting card."],
        "vocabulary_question": "Does ██████████ relate to being very tough and cold or being overly sentimental?"
    },
    {
        "word": "sortileger",
        "meaning": "A person who practices sortilege (divination by drawing lots).",
        "sentences": ["The sortileger cast the stones onto the cloth to predict the harvest."],
        "vocabulary_question": "Is a ██████████ someone who studies history or someone who tells fortunes by drawing lots?"
    },
    {
        "word": "sory",
        "meaning": "A sulfate of iron used by ancient writers to describe a substance similar to copperas.",
        "sentences": ["The alchemist's notes mentioned sory as a key ingredient in the mineral mixture."],
        "vocabulary_question": "Is ████ a type of modern plastic or an ancient term for a mineral substance?"
    },
    {
        "word": "soterial",
        "meaning": "Of or relating to salvation.",
        "sentences": ["The theologian's lecture focused on the soterial themes found in ancient religious texts."],
        "vocabulary_question": "Does the word ████████ relate to physical fitness or to the concept of salvation?"
    },
    {
        "word": "Sothic",
        "meaning": "Relating to Sirius, the Dog Star, especially with reference to the ancient Egyptian calendar.",
        "sentences": ["The Sothic cycle was used by the Egyptians to track the flooding of the Nile."],
        "vocabulary_question": "Does ██████ relate to the star Sirius or to the planet Mars?"
    },
    {
        "word": "sousaphone",
        "meaning": "A form of tuba with a wide bell that curves over the player's head, often used in marching bands.",
        "sentences": ["The sousaphone player marched at the back of the band, providing a deep bass rhythm."],
        "vocabulary_question": "Is a ██████████ a tiny wooden flute or a large brass instrument that wraps around the player?"
    },
    {
        "word": "Spaniel",
        "meaning": "Any of several breeds of dogs with long drooping ears and a silky coat.",
        "sentences": ["The Cocker Spaniel wagged its tail happily as we walked through the park."],
        "vocabulary_question": "Is a ███████ a type of cat or a breed of dog with long, drooping ears?"
    },
    {
        "word": "spatha",
        "meaning": "A long, straight sword used by Roman soldiers from the 1st to the 6th century AD.",
        "sentences": ["The Roman cavalry officer carried a heavy steel spatha at his side."],
        "vocabulary_question": "Was a ██████ a type of defensive shield or a long straight sword?"
    },
    {
        "word": "spathe",
        "meaning": "A large bract or leaf-like part enclosing the flower cluster of certain plants, such as the calla lily.",
        "sentences": ["The white spathe of the peace lily curved elegantly around the central spike."],
        "vocabulary_question": "In botany, is a ██████ a part of a root or a leaf-like part that encloses a flower?"
    },
    {
        "word": "speciation",
        "meaning": "The formation of new and distinct species in the course of evolution.",
        "sentences": ["Isolation on the islands led to the speciation of several unique types of finches."],
        "vocabulary_question": "Does ██████████ describe the extinction of a species or the creation of a new one?"
    },
    {
        "word": "spectrometer",
        "meaning": "An apparatus used for recording and measuring spectra, especially as a method of analysis.",
        "sentences": ["The lab used a spectrometer to identify the chemical composition of the gas."],
        "vocabulary_question": "Is a ████████████ used to measure the weight of an object or the properties of light and matter?"
    },
    {
        "word": "spinosity",
        "meaning": "The quality of being thorny or spiny; or a difficult or thorny problem.",
        "sentences": ["The spinosity of the desert cactus made it impossible to touch without gloves."],
        "vocabulary_question": "Does █████████ describe something that is smooth and soft or something thorny and prickly?"
    },
    {
        "word": "spiracle",
        "meaning": "An external respiratory opening, especially an opening on the body of an insect or some fish.",
        "sentences": ["The whale surfaced to breathe, expelling air through its spiracle."],
        "vocabulary_question": "Is a ████████ a type of wing or a hole used for breathing?"
    },
    {
        "word": "spirulina",
        "meaning": "A type of blue-green algae that is rich in protein and used as a dietary supplement.",
        "sentences": ["She added a spoonful of green spirulina powder to her morning smoothie."],
        "vocabulary_question": "Is █████████ a type of spicy root or a type of healthy blue-green algae?"
    },
    {
        "word": "splenetic",
        "meaning": "Characterized by spiteful anger; bad-tempered or irritable.",
        "sentences": ["The boss's splenetic outburst made the entire office uncomfortable."],
        "vocabulary_question": "Is a █████████ person very cheerful and kind or angry and irritable?"
    },
    {
        "word": "sponsalia",
        "meaning": "A formal promise or contract of marriage; betrothal.",
        "sentences": ["The families gathered to witness the signing of the sponsalia before the wedding."],
        "vocabulary_question": "Does ██████████ relate to a graduation ceremony or a formal promise of marriage?"
    },
    {
        "word": "spontaneity",
        "meaning": "The condition of being spontaneous; acting on impulse rather than planning.",
        "sentences": ["We loved the spontaneity of the road trip, choosing our destination on a whim."],
        "vocabulary_question": "Does ███████████ involve careful planning or acting on sudden impulse?"
    },
    {
        "word": "sprightliness",
        "meaning": "The quality of being lively, full of energy, and brisk.",
        "sentences": ["Despite her age, the grandmother had a sprightliness that kept her busy all day."],
        "vocabulary_question": "Does █████████████ describe someone who is very tired or someone who is lively and energetic?"
    },
    {
        "word": "sprue",
        "meaning": "A disease of the small intestine that causes malnutrition; or a hole through which metal is poured into a mold.",
        "sentences": ["The factory worker carefully poured the molten iron into the sprue."],
        "vocabulary_question": "Is a █████ a type of bird or a hole used in metal casting/a digestive disease?"
    },
    {
        "word": "spurious",
        "meaning": "Not being what it purports to be; false or fake.",
        "sentences": ["The collector realized the signature on the baseball was spurious and had no value."],
        "vocabulary_question": "Is a ████████ claim one that is 100% true or one that is fake and false?"
    },
    {
        "word": "stagflation",
        "meaning": "Persistent high inflation combined with high unemployment and stagnant demand.",
        "sentences": ["The country struggled through a period of stagflation in the late 1970s."],
        "vocabulary_question": "Does ███████████ involve a booming, healthy economy or high prices combined with low growth?"
    },
    {
        "word": "staid",
        "meaning": "Sedate, respectable, and unadventurous.",
        "sentences": ["The law firm had a staid reputation, strictly following traditional practices."],
        "vocabulary_question": "Is a █████ person wild and unpredictable or serious and respectable?"
    },
    {
        "word": "stalwart",
        "meaning": "Loyal, reliable, and hardworking.",
        "sentences": ["He has been a stalwart supporter of the local animal shelter for twenty years."],
        "vocabulary_question": "Is a ████████ person someone who quits easily or someone who is loyal and reliable?"
    },
    {
        "word": "statistician",
        "meaning": "An expert in the preparation and analysis of statistics.",
        "sentences": ["The government hired a statistician to analyze the census data."],
        "vocabulary_question": "Does a █████████████ study the history of art or the analysis of data and numbers?"
    },
    {
        "word": "statuesque",
        "meaning": "Like a statue; especially being tall and dignified.",
        "sentences": ["The statuesque model walked the runway with a grace that captivated the audience."],
        "vocabulary_question": "If someone is ██████████, are they very short or tall and dignified like a statue?"
    },
    {
        "word": "statusy",
        "meaning": "Associated with or reflecting high social status.",
        "sentences": ["She preferred driving a statusy car that showed off her success."],
        "vocabulary_question": "Does something ███████ suggest high social standing or low social standing?"
    },
    {
        "word": "steeve",
        "meaning": "To pack (cargo, such as wool or cotton) tightly into a ship's hold.",
        "sentences": ["The dockworkers had to steeve the bales of cotton carefully to save space."],
        "vocabulary_question": "Does to ██████ mean to unpack a ship or to pack cargo into it tightly?"
    },
    {
        "word": "stegosaur",
        "meaning": "A herbivorous dinosaur with a double row of large bony plates along its back.",
        "sentences": ["The stegosaur used its spiked tail to defend itself against predators."],
        "vocabulary_question": "Was a █████████ a fierce meat-eating bird or a plate-backed dinosaur?"
    },
    {
        "word": "steinkirk",
        "meaning": "A neckcloth or scarf loosely tied with long ends tucked into a buttonhole.",
        "sentences": ["The nobleman finished his outfit by wrapping a lace steinkirk around his neck."],
        "vocabulary_question": "Is a █████████ a type of heavy boot or a type of neckcloth?"
    },
    {
        "word": "stellular",
        "meaning": "Having the shape of a small star; radiating in a star-like pattern.",
        "sentences": ["The microscopic organisms displayed a beautiful stellular arrangement."],
        "vocabulary_question": "Does █████████ describe something shaped like a square or shaped like a star?"
    },
    {
        "word": "stentorian",
        "meaning": "Extremely loud; capable of powerful utterance or sound.",
        "sentences": ["The sergeant's stentorian voice could be heard clearly across the entire parade ground."],
        "vocabulary_question": "Is a ██████████ voice a quiet whisper or a loud, powerful shout?"
    },
    {
        "word": "steppe",
        "meaning": "A large area of flat unforested grassland, especially in southeastern Europe or Siberia.",
        "sentences": ["Nomadic tribes have lived on the vast Eurasian steppe for thousands of years."],
        "vocabulary_question": "Is a ██████ a thick tropical rainforest or a large, flat grassland?"
    },
    {
        "word": "stevia",
        "meaning": "A natural sweetener and sugar substitute extracted from the leaves of the plant species Stevia rebaudiana.",
        "sentences": ["He preferred to use stevia in his coffee instead of refined sugar."],
        "vocabulary_question": "Is ██████ a type of bitter medicine or a natural sweetener?"
    },
    {
        "word": "stimuli",
        "meaning": "Things that rouse activity or energy in someone or something; plural of stimulus.",
        "sentences": ["The brain processes various sensory stimuli, such as light, sound, and touch."],
        "vocabulary_question": "Are ███████ things that cause a reaction or things that cause total stillness?"
    },
    {
        "word": "stipulate",
        "meaning": "To demand or specify a requirement, typically as part of a bargain or agreement.",
        "sentences": ["The contract stipulates that the work must be completed by the end of the month."],
        "vocabulary_question": "When you █████████ a condition, are you making it a requirement or making it optional?"
    },
    {
        "word": "stratification",
        "meaning": "The arrangement or classification of something into different groups or layers.",
        "sentences": ["Geologists study the stratification of rock layers to understand Earth's history."],
        "vocabulary_question": "Does ██████████████ involve mixing everything together or organizing things into layers?"
    },
    {
        "word": "stratocracy",
        "meaning": "A form of government headed by military chiefs.",
        "sentences": ["The country was ruled by a stratocracy after the generals took control."],
        "vocabulary_question": "In a ███████████, is the government run by elected civilians or by military leaders?"
    },
    {
        "word": "stratosphere",
        "meaning": "The layer of the earth's atmosphere above the troposphere, extending to about 32 miles above the earth's surface.",
        "sentences": ["Weather balloons often travel into the stratosphere to collect data."],
        "vocabulary_question": "Is the ████████████ the layer of the atmosphere closest to the ground or the layer above it?"
    },
    {
        "word": "striation",
        "meaning": "A series of ridges, furrows, or linear marks.",
        "sentences": ["The movement of the glacier left deep striations in the surface of the bedrock."],
        "vocabulary_question": "Are ██████████ lines and ridges on a surface or is it perfectly smooth?"
    },
    {
        "word": "stricture",
        "meaning": "A restriction on a person or activity; or a sternly critical remark.",
        "sentences": ["The religious group followed many dietary strictures."],
        "vocabulary_question": "Is a █████████ a total freedom to do anything or a specific restriction or rule?"
    },
    {
        "word": "stridency",
        "meaning": "The quality of being loud and harsh; or presenting a point of view in an excessively forceful way.",
        "sentences": ["The stridency of her tone made it clear that she would not change her mind."],
        "vocabulary_question": "Does █████████ describe a soft, gentle sound or a loud, harsh, and forceful one?"
    },
    {
        "word": "Styrofoam",
        "meaning": "A brand of expanded plastic used especially for making food containers and for insulation.",
        "sentences": ["He packed the fragile vase in a box filled with Styrofoam peanuts."],
        "vocabulary_question": "Is █████████ a type of heavy metal or a lightweight expanded plastic?"
    },
    {
        "word": "subjugate",
        "meaning": "To bring under domination or control, especially by conquest.",
        "sentences": ["The invaders sought to subjugate the local population and take their land."],
        "vocabulary_question": "Does to █████████ mean to set someone free or to bring them under your control?"
    },
    {
        "word": "subliminal",
        "meaning": "Designed to affect the mind on an unconscious level; below the threshold of sensation.",
        "sentences": ["The commercial contained subliminal messages designed to make people hungry."],
        "vocabulary_question": "Is a ██████████ message one you notice immediately or one that affects your mind unconsciously?"
    },
    {
        "word": "subluxated",
        "meaning": "Partially dislocated (as of a joint).",
        "sentences": ["The athlete's shoulder was subluxated during the fall, causing a sharp pain."],
        "vocabulary_question": "If a joint is ██████████, is it perfectly in place or partially dislocated?"
    },
    {
        "word": "submersible",
        "meaning": "Designed to be used underwater.",
        "sentences": ["The researchers used a small submersible to explore the deep-sea trenches."],
        "vocabulary_question": "Is a ███████████ vehicle meant for flying in the air or for traveling underwater?"
    },
    {
        "word": "subrident",
        "meaning": "Smiling; wearing a slight smile.",
        "sentences": ["The teacher gave a subrident nod as the student finally solved the difficult puzzle."],
        "vocabulary_question": "Is a █████████ person frowning in anger or wearing a slight smile?"
    },
    {
        "word": "subsequent",
        "meaning": "Coming after something in time; following.",
        "sentences": ["The first experiment failed, but subsequent attempts were successful."],
        "vocabulary_question": "Does a ██████████ event happen before the first one or after it?"
    },
    {
        "word": "subsistence",
        "meaning": "The action or fact of maintaining or supporting oneself at a minimum level.",
        "sentences": ["The farmers lived on subsistence crops, growing just enough to feed their families."],
        "vocabulary_question": "Does ███████████ refer to great wealth or just enough to survive?"
    },
    {
        "word": "substrate",
        "meaning": "A substance or layer that underlies something, or on which some process occurs.",
        "sentences": ["In biology, the substrate is the surface on which an organism lives or grows."],
        "vocabulary_question": "Is a █████████ the top-most layer or the underlying layer/surface?"
    },
    {
        "word": "subterfuge",
        "meaning": "Deceit used in order to achieve one's goal.",
        "sentences": ["He used a clever subterfuge to sneak into the building without being seen."],
        "vocabulary_question": "Is ██████████ honesty and openness or deceit and trickery?"
    },
    {
        "word": "subterranean",
        "meaning": "Existing, occurring, or done under the earth's surface.",
        "sentences": ["The city has a vast subterranean network of tunnels and pipes."],
        "vocabulary_question": "Is a ████████████ room located high in a tower or deep under the ground?"
    },
    {
        "word": "subtlety",
        "meaning": "The quality or state of being subtle; a fine distinction or detail.",
        "sentences": ["The critic admired the subtlety of the artist's use of color."],
        "vocabulary_question": "Is ████████ an obvious and loud detail or a fine and delicate one?"
    },
    {
        "word": "subversive",
        "meaning": "Seeking or intended to subvert an established system or institution.",
        "sentences": ["The government banned the book, calling it a subversive influence on the youth."],
        "vocabulary_question": "Is a ██████████ group trying to support the current system or secretly trying to weaken it?"
    },
    {
        "word": "successive",
        "meaning": "Following one another or following others.",
        "sentences": ["The team won three successive championships in three years."],
        "vocabulary_question": "If you win ██████████ games, did you win them one after the other or far apart in time?"
    },
    {
        "word": "succumb",
        "meaning": "To yield to a stronger force; to fail to resist pressure or temptation.",
        "sentences": ["He tried to stay awake, but he finally succumbed to sleep."],
        "vocabulary_question": "If you ███████ to something, are you resisting it or giving in to it?"
    },
    {
        "word": "suet",
        "meaning": "The hard white fat on the kidneys and loins of cattle, sheep, and other animals, used to make foods or birdseed.",
        "sentences": ["In winter, we put out suet cakes for the birds to give them extra energy."],
        "vocabulary_question": "Is ████ a type of leafy green vegetable or a type of animal fat used in cooking and birdseed?"
    },
    {
        "word": "suffrage",
        "meaning": "The right to vote in political elections.",
        "sentences": ["Women fought for many years to win the right of suffrage."],
        "vocabulary_question": "Is ████████ the right to own land or the right to vote?"
    },
    {
        "word": "Sumatran",
        "meaning": "Relating to Sumatra, a large island in western Indonesia.",
        "sentences": ["The Sumatran tiger is an endangered species native to the island's rainforests."],
        "vocabulary_question": "Does a ████████ animal come from an island in Indonesia or from the mountains of Peru?"
    },
    {
        "word": "summoned",
        "meaning": "Authoritatively or urgently called on someone to be present.",
        "sentences": ["The witnesses were summoned to appear in court the following Monday."],
        "vocabulary_question": "If you are ████████, have you been politely invited or officially ordered to appear?"
    },
    {
        "word": "sumptuous",
        "meaning": "Splendid and expensive-looking; luxurious.",
        "sentences": ["The guests were treated to a sumptuous feast of lobster and fine desserts."],
        "vocabulary_question": "Is a █████████ meal cheap and simple or extremely luxurious and grand?"
    },
    {
        "word": "superficiality",
        "meaning": "Lack of depth of character or understanding; focus on only the surface level.",
        "sentences": ["The critic complained about the superficiality of the plot in the new action movie."],
        "vocabulary_question": "Does ██████████████ relate to deep, complex thinking or only focusing on surface-level details?"
    },
    {
        "word": "superstitious",
        "meaning": "Having or showing a belief in superstitions (irrational beliefs in supernatural influences).",
        "sentences": ["The superstitious sailor refused to start a voyage on a Friday."],
        "vocabulary_question": "Is a █████████████ person guided by scientific proof or by beliefs in luck and omens?"
    },
    {
        "word": "supine",
        "meaning": "Lying face upward.",
        "sentences": ["The doctor asked the patient to lie in a supine position on the examination table."],
        "vocabulary_question": "Is a ██████ person lying face down or face up?"
    },
    {
        "word": "supplemental",
        "meaning": "Provided in addition to what is already present or available to complete or enhance it.",
        "sentences": ["The athlete took supplemental vitamins to ensure he stayed healthy during the season."],
        "vocabulary_question": "Is something ████████████ the main source or an extra addition to it?"
    },
    {
        "word": "supplicate",
        "meaning": "To request modestly and earnestly of someone or something; to pray humbly.",
        "sentences": ["The citizens went to the palace to supplicate the king for a reduction in taxes."],
        "vocabulary_question": "When you ██████████, are you making an angry demand or a humble, earnest request?"
    },
    {
        "word": "supremacy",
        "meaning": "The state or condition of being superior to all others in authority, power, or status.",
        "sentences": ["The empire fought for decades to maintain its naval supremacy in the region."],
        "vocabulary_question": "Does █████████ mean being equal to everyone else or being superior in power and status?"
    },
    {
        "word": "surcease",
        "meaning": "Cessation; an end; relief or consolation.",
        "sentences": ["The tired traveler sought surcease from the biting cold in a small roadside inn."],
        "vocabulary_question": "Is a ████████ an increase in activity or a final end or relief from something?"
    },
    {
        "word": "surety",
        "meaning": "A person who takes responsibility for another's performance of an undertaking; or a guarantee.",
        "sentences": ["His uncle acted as a surety for the loan, promising to pay if his nephew could not."],
        "vocabulary_question": "Is a ██████ a total stranger or someone who takes responsibility for someone else's debt?"
    },
    {
        "word": "surmountable",
        "meaning": "Capable of being overcome.",
        "sentences": ["Though the task was difficult, the team believed the problems were surmountable."],
        "vocabulary_question": "If a challenge is ████████████, is it impossible to beat or able to be overcome?"
    },
    {
        "word": "surrealist",
        "meaning": "An artist or writer seeking to release the creative potential of the unconscious mind, often by juxtapositions of irrational imagery.",
        "sentences": ["Salvador Dalí was a famous surrealist known for his painting of melting clocks."],
        "vocabulary_question": "Is a ██████████ style focused on perfectly realistic photos or dreamlike, irrational images?"
    },
    {
        "word": "surveillance",
        "meaning": "Close observation, especially of a suspected spy or criminal.",
        "sentences": ["The bank installed high-tech cameras for constant surveillance of the vault."],
        "vocabulary_question": "Does ████████████ involve ignoring a person or watching them very closely?"
    },
    {
        "word": "swale",
        "meaning": "A low or hollow place, especially a marshy depression between ridges.",
        "sentences": ["Rainwater collected in the grassy swale at the bottom of the hill."],
        "vocabulary_question": "Is a █████ a high mountain peak or a low, hollow place in the land?"
    },
    {
        "word": "sycophant",
        "meaning": "A person who acts obsequiously toward someone important in order to gain advantage; a 'yes-man'.",
        "sentences": ["The CEO was surrounded by sycophants who never disagreed with his ideas."],
        "vocabulary_question": "Is a █████████ someone who is very honest or someone who flatters people to get ahead?"
    },
    {
        "word": "syllabus",
        "meaning": "An outline of the subjects in a course of study or teaching.",
        "sentences": ["On the first day of class, the teacher handed out the syllabus for the semester."],
        "vocabulary_question": "Is a ████████ a graduation certificate or an outline of what will be studied in a class?"
    },
    {
        "word": "sylph",
        "meaning": "An imaginary being that lives in the air; or a slender, graceful woman.",
        "sentences": ["In the ancient story, the sylph floated invisibly through the clouds."],
        "vocabulary_question": "Is a █████ a heavy underground troll or a graceful, airy being?"
    },
    {
        "word": "symmetrical",
        "meaning": "Made up of exactly similar parts facing each other or around an axis; showing symmetry.",
        "sentences": ["The wings of a butterfly are perfectly symmetrical in their pattern."],
        "vocabulary_question": "If something is ███████████, are the two halves different or are they exactly similar?"
    },
    {
        "word": "symposium",
        "meaning": "A conference or meeting to discuss a particular subject.",
        "sentences": ["The scientists gathered for a three-day symposium on climate change."],
        "vocabulary_question": "Is a █████████ a solo vacation or a meeting where people discuss a specific topic?"
    },
    {
        "word": "syndactylism",
        "meaning": "A condition in which some or all of the fingers or toes are wholly or partly united (webbed).",
        "sentences": ["The doctor explained that syndactylism is a common condition that can often be corrected with surgery."],
        "vocabulary_question": "Does █████████████ refer to having extra fingers or having webbed fingers/toes?"
    },
    {
        "word": "syndicate",
        "meaning": "A group of individuals or organizations combined to promote some common interest.",
        "sentences": ["A syndicate of investors bought the historic hotel to restore it to its former glory."],
        "vocabulary_question": "Is a █████████ one person working alone or a group working together for a common goal?"
    },
    {
        "word": "syntonize",
        "meaning": "To adjust (a radio receiver or transmitter) to a particular frequency; to tune.",
        "sentences": ["The operator had to syntonize the equipment to receive the distant signal."],
        "vocabulary_question": "Does to █████████ mean to break a radio or to tune it to a specific frequency?"
    },
    {
        "word": "syntrophism",
        "meaning": "A biological relationship where two different organisms provide nutrients for each other.",
        "sentences": ["The bacteria in the soil demonstrate syntrophism by exchanging essential growth factors."],
        "vocabulary_question": "In ███████████, do organisms compete for food or help provide nutrients for each other?"
    },
    {
        "word": "syringe",
        "meaning": "A tube with a nozzle and piston for sucking in and ejecting liquid in a thin stream, used for cleaning wounds or giving injections.",
        "sentences": ["The nurse used a sterile syringe to administer the vaccine."],
        "vocabulary_question": "Is a ███████ used to measure temperature or to give an injection of liquid?"
    },
    {
        "word": "tabernacle",
        "meaning": "A building used principally for religious services; or a portable dwelling used by the Israelites during the Exodus.",
        "sentences": ["The choir gathered inside the wooden tabernacle for the Sunday morning service."],
        "vocabulary_question": "Is a ██████████ a building for religious services or a type of ancient marketplace?"
    },
    {
        "word": "tabia",
        "meaning": "A type of building material made of lime, sand, and pebbles, similar to concrete.",
        "sentences": ["The ancient walls were reinforced with tabia to withstand the coastal weather."],
        "vocabulary_question": "Is █████ a type of construction material or a type of musical instrument?"
    },
    {
        "word": "tableau",
        "meaning": "A group of models or motionless figures representing a scene from a story or history.",
        "sentences": ["The students created a living tableau representing the signing of the Declaration of Independence."],
        "vocabulary_question": "Is a ███████ a fast-moving dance or a frozen, motionless scene of people?"
    },
    {
        "word": "tablinum",
        "meaning": "A room in an ancient Roman house, usually opening off the atrium, used for storing family records.",
        "sentences": ["The master of the house met with his guests in the tablinum to discuss business."],
        "vocabulary_question": "Was a ████████ an ancient Roman office/record room or a type of kitchen?"
    },
    {
        "word": "tabulate",
        "meaning": "To arrange (data) in tabular form; to organize into a table.",
        "sentences": ["The researcher began to tabulate the survey results to make them easier to analyze."],
        "vocabulary_question": "When you ████████ data, are you mixing it up randomly or organizing it into a table?"
    },
    {
        "word": "taciturn",
        "meaning": "Reserved or uncommunicative in speech; saying little.",
        "sentences": ["The detective was a taciturn man who preferred listening to talking."],
        "vocabulary_question": "Is a ████████ person very talkative or quiet and reserved?"
    },
    {
        "word": "tae kwon do",
        "meaning": "A Korean martial art involving punching and kicking techniques.",
        "sentences": ["She earned her black belt in tae kwon do after years of disciplined practice."],
        "vocabulary_question": "Is ███ ████ ██ a type of dance or a Korean martial art?"
    },
    {
        "word": "tagua",
        "meaning": "The hard white nut of a South American palm, used as a substitute for ivory.",
        "sentences": ["The artist carved a beautiful small bird out of a single tagua nut."],
        "vocabulary_question": "Is █████ a type of ivory-like nut or a type of tropical fish?"
    },
    {
        "word": "tai chi",
        "meaning": "A Chinese martial art and system of calisthenics, characterized by coordinated and very slow movements.",
        "sentences": ["Many people gather in the park at dawn to practice the slow, flowing movements of tai chi."],
        "vocabulary_question": "Does ███ ███ involve fast, aggressive movements or slow, coordinated ones?"
    },
    {
        "word": "taiga",
        "meaning": "The sometimes swampy coniferous forest of high northern latitudes.",
        "sentences": ["The Siberian taiga is home to wolves, bears, and vast forests of pine and spruce."],
        "vocabulary_question": "Is a █████ a dry sandy desert or a northern forest of evergreen trees?"
    },
    {
        "word": "takin",
        "meaning": "A large, goat-like antelope found in the eastern Himalayas.",
        "sentences": ["The takin is well-adapted to the cold, rocky slopes of high-altitude mountains."],
        "vocabulary_question": "Is a █████ a type of small forest bird or a large goat-like mammal?"
    },
    {
        "word": "talisman",
        "meaning": "An object thought to work as a charm to ward off evil and bring good fortune.",
        "sentences": ["He carried a small silver coin as a talisman whenever he traveled."],
        "vocabulary_question": "Is a ████████ a type of heavy weapon or an object believed to bring good luck?"
    },
    {
        "word": "talmouse",
        "meaning": "A pastry shell filled with a mixture of cheese and eggs (like a cheesecake or savory tart).",
        "sentences": ["The baker prepared a traditional talmouse for the afternoon tea."],
        "vocabulary_question": "Is a ████████ a type of pastry or a type of woodland rodent?"
    },
    {
        "word": "tambourine",
        "meaning": "A percussion instrument consisting of a shallow drum with metal jingles around the edge.",
        "sentences": ["She shook the tambourine in time with the upbeat music."],
        "vocabulary_question": "Is a ██████████ a stringed instrument or a percussion instrument with jingles?"
    },
    {
        "word": "tamworth",
        "meaning": "A breed of large, ginger-colored pigs originating in England.",
        "sentences": ["The farmer raised Tamworth pigs because they are known for being hardy and good foragers."],
        "vocabulary_question": "Is a ████████ a breed of pig or a type of small sheep?"
    },
    {
        "word": "tangerine",
        "meaning": "A small citrus fruit with a deep orange-red skin that is easy to peel.",
        "sentences": ["I packed a sweet tangerine in my lunch for a healthy snack."],
        "vocabulary_question": "Is a █████████ more like a lemon or a small, sweet orange?"
    },
    {
        "word": "tantrum",
        "meaning": "An uncontrolled outburst of anger and frustration, typically in a young child.",
        "sentences": ["The toddler threw a tantrum when he was told it was time to leave the park."],
        "vocabulary_question": "Is a ███████ a sign of great happiness or a sudden outburst of anger?"
    },
    {
        "word": "tapioca",
        "meaning": "A starchy substance in the form of hard white grains, obtained from cassava root.",
        "sentences": ["We made a warm batch of tapioca pudding for dessert."],
        "vocabulary_question": "Is ███████ a type of meat or a starch used for making pudding?"
    },
    {
        "word": "tappet",
        "meaning": "A lever or projection that transmits motion between a cam and another part (as in an engine).",
        "sentences": ["The mechanic adjusted the tappets to stop the clicking noise in the engine."],
        "vocabulary_question": "Is a ██████ a part of a car engine or a part of a garden fence?"
    },
    {
        "word": "tarlatan",
        "meaning": "A thin, starched, open-weave muslin fabric, used for stiffening dresses or for etching.",
        "sentences": ["The ballerina's tutu was made of several layers of stiff tarlatan."],
        "vocabulary_question": "Is ████████ a type of thick wool or a thin, stiff fabric?"
    },
    {
        "word": "Tasmanian",
        "meaning": "Relating to Tasmania, an island state of Australia.",
        "sentences": ["The Tasmanian devil is a carnivorous marsupial found only on the island of Tasmania."],
        "vocabulary_question": "Does the word █████████ relate to an island in Australia or a mountain range in Asia?"
    },
    {
        "word": "taverna",
        "meaning": "A small Greek restaurant or cafe.",
        "sentences": ["We ate fresh fish and olives at a cozy seaside taverna."],
        "vocabulary_question": "Is a ███████ a large shopping mall or a small Greek restaurant?"
    },
    {
        "word": "taxidermy",
        "meaning": "The art of preparing, stuffing, and mounting the skins of animals with lifelike effect.",
        "sentences": ["The museum's natural history wing featured many examples of expert taxidermy."],
        "vocabulary_question": "Does █████████ involve the study of taxes or the mounting of animal skins?"
    },
    {
        "word": "taxonomic",
        "meaning": "Relating to the classification of organisms.",
        "sentences": ["The biologist used taxonomic ranks to identify the newly discovered species."],
        "vocabulary_question": "Does █████████ relate to the classification of animals or the speed of light?"
    },
    {
        "word": "tectonic",
        "meaning": "Relating to the structure of the earth's crust and the large-scale processes that take place within it.",
        "sentences": ["The movement of tectonic plates is what causes earthquakes and volcanic eruptions."],
        "vocabulary_question": "Does the word ████████ relate to the earth's crust or to the movement of the ocean tides?"
    },
    {
        "word": "teemed",
        "meaning": "Was full of or swarming with.",
        "sentences": ["After the rain, the pond teemed with tadpoles and small insects."],
        "vocabulary_question": "If a place ██████ with life, was it completely empty or full and swarming?"
    },
    {
        "word": "Tejano",
        "meaning": "A style of folk or popular music among Mexican-Americans in Texas; or a person of Mexican descent living in Texas.",
        "sentences": ["The festival featured several bands playing traditional Tejano music."],
        "vocabulary_question": "Does ██████ relate to culture and music from Texas/Mexico or from New York?"
    },
    {
        "word": "telepathic",
        "meaning": "Capable of communicating thoughts directly from one person's mind to another's.",
        "sentences": ["The twins were so close that they sometimes seemed to have a telepathic connection."],
        "vocabulary_question": "Does ██████████ involve speaking out loud or communicating through thoughts?"
    },
    {
        "word": "telmatology",
        "meaning": "The scientific study of wetlands such as marshes or swamps.",
        "sentences": ["In his telmatology class, he learned about the unique plants that grow in peat bogs."],
        "vocabulary_question": "Is ████████████ the study of outer space or the study of wetlands and swamps?"
    },
    {
        "word": "temblor",
        "meaning": "An earthquake.",
        "sentences": ["The sudden temblor caused the dishes in the kitchen to rattle."],
        "vocabulary_question": "Is a ███████ a type of small storm or an earthquake?"
    },
    {
        "word": "tempestuous",
        "meaning": "Relating to or being like a turbulent, violent storm; characterized by strong and conflicting emotions.",
        "sentences": ["The couple had a tempestuous relationship, filled with loud arguments and passionate reconciliations."],
        "vocabulary_question": "Does ███████████ describe a calm, peaceful situation or a turbulent and stormy one?"
    },
    {
        "word": "tempura",
        "meaning": "A Japanese dish of fish, shellfish, or vegetables, fried in batter.",
        "sentences": ["We ordered a platter of crispy shrimp tempura as an appetizer."],
        "vocabulary_question": "Is ███████ a type of raw sushi or a dish that is battered and fried?"
    },
    {
        "word": "tenaciously",
        "meaning": "In a determined way that does not allow for giving up; persistently.",
        "sentences": ["The vine clung tenaciously to the brick wall, making it difficult to pull away."],
        "vocabulary_question": "If you act ███████████, are you giving up easily or holding on firmly and persistently?"
    },
    {
        "word": "tenement",
        "meaning": "A room or a set of rooms forming a separate residence within a house or block of apartments; often used to describe run-down, crowded housing.",
        "sentences": ["Many immigrants in the early 1900s lived in crowded tenement buildings in New York City."],
        "vocabulary_question": "Is a ████████ a large, luxurious mansion or a room/apartment in a crowded building?"
    },
    {
        "word": "tensile",
        "meaning": "Relating to tension; capable of being drawn out or stretched.",
        "sentences": ["Steel cables are used in suspension bridges because of their high tensile strength."],
        "vocabulary_question": "Does ███████ relate to an object's ability to be crushed or its ability to be stretched?"
    },
    {
        "word": "tentacled",
        "meaning": "Having tentacles (long, flexible organs used for grasping or moving).",
        "sentences": ["The tentacled monster in the movie grabbed the ship and pulled it underwater."],
        "vocabulary_question": "Is a █████████ creature more likely to be an octopus or a sparrow?"
    },
    {
        "word": "tenue",
        "meaning": "A person's bearing or posture; also, a style of dress or outfit.",
        "sentences": ["The officer’s military tenue was impeccably neat and professional."],
        "vocabulary_question": "Does █████ refer to a person's posture and dress or a type of garden tool?"
    },
    {
        "word": "tenurial",
        "meaning": "Relating to the conditions under which land or buildings are held or occupied.",
        "sentences": ["The lawyer specialized in tenurial law to help farmers protect their land rights."],
        "vocabulary_question": "Does the word ████████ relate to holding property/land or to a type of musical rhythm?"
    },
    {
        "word": "tepidity",
        "meaning": "Lukewarmness; a lack of enthusiasm or passion.",
        "sentences": ["He was disappointed by the tepidity of the audience's reaction to his speech."],
        "vocabulary_question": "Is ████████ extreme heat or a state of being lukewarm and unenthusiastic?"
    },
    {
        "word": "tercentenary",
        "meaning": "The three-hundredth anniversary of a significant event.",
        "sentences": ["The city held a massive parade to celebrate the tercentenary of its founding."],
        "vocabulary_question": "Does a ████████████ commemorate a hundred years or three hundred years?"
    },
    {
        "word": "terminus",
        "meaning": "The end of a railway or other transportation route, or a station at such a point; a final point.",
        "sentences": ["Grand Central Terminal serves as the southern terminus for several train lines."],
        "vocabulary_question": "Is a ███████ the halfway point of a journey or the final end of the line?"
    },
    {
        "word": "terra-cotta",
        "meaning": "A brownish-red clay that has been baked and is used for making pots, ornaments, or tiles.",
        "sentences": ["The garden was filled with beautiful terra-cotta pots containing bright geraniums."],
        "vocabulary_question": "Is █████-█████ a type of shiny blue glass or a brownish-red baked clay?"
    },
    {
        "word": "Terran",
        "meaning": "Relating to the planet Earth; an inhabitant of the Earth (often used in science fiction).",
        "sentences": ["In the movie, the aliens were surprised by the resilience of the Terran explorers."],
        "vocabulary_question": "Is a ██████ someone who comes from Earth or someone who comes from Mars?"
    },
    {
        "word": "terrarium",
        "meaning": "A glass container, chiefly or wholly closed, for growing and displaying plants (and sometimes small animals).",
        "sentences": ["Ava built a miniature forest inside her glass terrarium."],
        "vocabulary_question": "Is a █████████ used for baking bread or for growing plants in a glass container?"
    },
    {
        "word": "tertiary",
        "meaning": "Third in order or level.",
        "sentences": ["After the primary and secondary colors, we learned about tertiary colors like teal."],
        "vocabulary_question": "Does ████████ relate to the first level or the third level of something?"
    },
    {
        "word": "tetrapteran",
        "meaning": "An insect having four wings.",
        "sentences": ["Most dragonflies are tetrapteran, using their four wings to hover and zoom through the air."],
        "vocabulary_question": "Does a ███████████ creature have two wings or four wings?"
    },
    {
        "word": "Thailand",
        "meaning": "A country in Southeast Asia known for tropical beaches, opulent royal palaces, and ancient ruins.",
        "sentences": ["The travelers enjoyed the spicy and aromatic food during their trip to Thailand."],
        "vocabulary_question": "Is ████████ a country in Southeast Asia or a country in northern Europe?"
    },
    {
        "word": "theologian",
        "meaning": "A specialist in the rational interpretation of religious faith, practice, and experience.",
        "sentences": ["The theologian wrote a book explaining the history of different religious beliefs."],
        "vocabulary_question": "Does a ██████████ study the movements of stars or the concepts of religious faith?"
    },
    {
        "word": "theomachy",
        "meaning": "A war or struggle against or among the gods.",
        "sentences": ["Greek mythology is full of stories of theomachy, such as the battle between the Titans and the Olympians."],
        "vocabulary_question": "Is █████████ a peace treaty or a war involving gods?"
    },
    {
        "word": "theorem",
        "meaning": "A general proposition not self-evident but proved by a chain of reasoning; a truth established by means of accepted truths.",
        "sentences": ["We used the Pythagorean theorem to find the length of the triangle's longest side."],
        "vocabulary_question": "In math, is a ███████ a random guess or a proven statement?"
    },
    {
        "word": "theosophy",
        "meaning": "Any of a number of philosophies maintaining that a knowledge of God may be achieved through spiritual ecstasy, direct intuition, or special individual relations.",
        "sentences": ["The group met weekly to discuss theosophy and the nature of the divine."],
        "vocabulary_question": "Does █████████ relate to the study of government or the spiritual knowledge of the divine?"
    },
    {
        "word": "theriatrics",
        "meaning": "The science of veterinary medicine; the treatment of the diseases of lower animals.",
        "sentences": ["She decided to study theriatrics because of her lifelong love for helping sick animals."],
        "vocabulary_question": "Does ███████████ focus on treating humans or treating animals?"
    },
    {
        "word": "thoroughbred",
        "meaning": "Of pure breed, especially of a horse of a breed originating from English mares and Arabian stallions.",
        "sentences": ["The thoroughbred horse galloped across the finish line ahead of all the others."],
        "vocabulary_question": "Is a ████████████ animal a mix of many random breeds or one of pure, specific ancestry?"
    },
    {
        "word": "thrasonical",
        "meaning": "Boastful or bragging.",
        "sentences": ["His thrasonical claims about being the strongest man in the world were hard to believe."],
        "vocabulary_question": "Is a ███████████ person very humble or very boastful?"
    },
    {
        "word": "Thuban",
        "meaning": "A star in the constellation Draco that was the north pole star around 3000 BC.",
        "sentences": ["Ancient Egyptians used Thuban as their guide for true north when building the pyramids."],
        "vocabulary_question": "Is ██████ the name of a distant galaxy or a star once used as the North Star?"
    },
    {
        "word": "thwartwise",
        "meaning": "In a crosswise direction; across.",
        "sentences": ["The boards were laid thwartwise across the frame to strengthen the floor."],
        "vocabulary_question": "Does ██████████ mean going in a straight line or across/crosswise?"
    },
    {
        "word": "thyme",
        "meaning": "A low-growing aromatic plant of the mint family, used as a culinary herb.",
        "sentences": ["The recipe calls for a teaspoon of dried thyme to flavor the roasted chicken."],
        "vocabulary_question": "Is █████ a type of spicy pepper or an aromatic herb used in cooking?"
    },
    {
        "word": "tiffany",
        "meaning": "A thin, transparent gauze-like fabric of silk or muslin.",
        "sentences": ["The window was draped with a light tiffany that let in the afternoon sun."],
        "vocabulary_question": "Is ███████ a type of heavy leather or a thin, transparent fabric?"
    },
    {
        "word": "tiffin",
        "meaning": "A light meal or snack, especially one taken at midday.",
        "sentences": ["The office workers gathered for tiffin in the garden during their lunch break."],
        "vocabulary_question": "Is a ██████ a massive midnight feast or a light midday meal?"
    },
    {
        "word": "Tinseltown",
        "meaning": "A nickname for the American film industry located in Hollywood, California.",
        "sentences": ["She moved to Tinseltown with dreams of becoming a famous movie star."],
        "vocabulary_question": "Is ██████████ a nickname for a small farming village or for the Hollywood film industry?"
    },
    {
        "word": "titian",
        "meaning": "A brownish-orange or golden-chestnut color, especially used to describe hair color.",
        "sentences": ["The portrait featured a woman with striking titian hair that glowed in the light."],
        "vocabulary_question": "Is ██████ a shade of neon green or a brownish-orange color?"
    },
    {
        "word": "titration",
        "meaning": "A technique where a solution of known concentration is used to determine the concentration of an unknown solution.",
        "sentences": ["In chemistry class, we performed a titration to find the acidity of the vinegar sample."],
        "vocabulary_question": "Does █████████ involve mixing random chemicals for fun or measuring the concentration of a solution?"
    },
    {
        "word": "tomfoolery",
        "meaning": "Foolish or silly behavior.",
        "sentences": ["The teacher put an end to the tomfoolery so the students could focus on their work."],
        "vocabulary_question": "Is ██████████ a very serious business meeting or silly, playful behavior?"
    },
    {
        "word": "tomium",
        "meaning": "The sharp cutting edge of the beak of a bird.",
        "sentences": ["The hawk used the sharp tomium of its beak to tear into its food."],
        "vocabulary_question": "Is the ██████ the tail of a bird or the cutting edge of its beak?"
    },
    {
        "word": "tommyrot",
        "meaning": "Utter nonsense; rubbish.",
        "sentences": ["He dismissed the rumors as complete tommyrot with no basis in fact."],
        "vocabulary_question": "If someone says your idea is ████████, do they think it is brilliant or complete nonsense?"
    },
    {
        "word": "tomography",
        "meaning": "A technique for displaying a cross-section through a human body or other solid object using X-rays or ultrasound.",
        "sentences": ["The doctor ordered a computerized tomography (CT) scan to get a better look at the injury."],
        "vocabulary_question": "Does ██████████ involve taking a photo of the skin or a cross-section of the inside of the body?"
    },
    {
        "word": "tonneau",
        "meaning": "The rear part of a car body, often containing the back seats or a cargo area.",
        "sentences": ["He bought a cover for the tonneau of his truck to keep his tools dry."],
        "vocabulary_question": "Is the ██████ the engine of a car or the rear cargo/seating area?"
    },
    {
        "word": "toorie",
        "meaning": "A tassel or pom-pom on a bonnet or cap (Scottish origin).",
        "sentences": ["Her winter hat was topped with a bright red woolly toorie."],
        "vocabulary_question": "Is a ██████ a type of heavy boot or a tassel on a hat?"
    },
    {
        "word": "topgallant",
        "meaning": "The section of a mast or a sail above the topmast.",
        "sentences": ["The sailors climbed high into the rigging to unfurl the topgallant sail."],
        "vocabulary_question": "Is the █████████ sail near the bottom of the ship or high up on the mast?"
    },
    {
        "word": "topiary",
        "meaning": "The art or practice of clipping shrubs or trees into ornamental shapes.",
        "sentences": ["The garden featured impressive topiary in the shapes of elephants and giraffes."],
        "vocabulary_question": "Does ████████ involve growing wild weeds or trimming bushes into specific shapes?"
    },
    {
        "word": "toploftical",
        "meaning": "Haughty; arrogant; very superior in manner.",
        "sentences": ["His toploftical attitude made it difficult for his coworkers to like him."],
        "vocabulary_question": "Is a ███████████ person very humble or very arrogant and haughty?"
    },
    {
        "word": "toponymic",
        "meaning": "Relating to the name of a place or the study of place names.",
        "sentences": ["The historian provided a toponymic explanation for why the town was named 'Stonefalls'."],
        "vocabulary_question": "Does the word █████████ relate to the names of places or the names of different chemicals?"
    },
    {
        "word": "torsion",
        "meaning": "The action of twisting or the state of being twisted, especially of one end of an object relative to the other.",
        "sentences": ["The bridge was designed to withstand the torsion caused by high winds."],
        "vocabulary_question": "Does ███████ involve stretching something out or twisting it?"
    },
    {
        "word": "torsk",
        "meaning": "A large North Atlantic fish of the cod family.",
        "sentences": ["The fisherman caught a massive torsk in the cold waters off the coast of Norway."],
        "vocabulary_question": "Is a █████ a type of desert lizard or a type of ocean fish?"
    },
    {
        "word": "tosh",
        "meaning": "Sheer nonsense; foolish talk or actions.",
        "sentences": ["'That's absolute tosh!' he exclaimed when he heard the ridiculous excuse."],
        "vocabulary_question": "Is ████ a word for deep wisdom or for foolish nonsense?"
    },
    {
        "word": "toties quoties",
        "meaning": "As often as the thing shall happen; as often as the occasion arises.",
        "sentences": ["The rule applies toties quoties, whenever a new member joins the group."],
        "vocabulary_question": "Does ██████ ███████ mean 'only once' or 'as often as the occasion arises'?"
    },
    {
        "word": "toxicosis",
        "meaning": "A pathological condition caused by an overdose of a drug or a poison.",
        "sentences": ["The dog was treated for toxicosis after accidentally eating a poisonous plant."],
        "vocabulary_question": "Is █████████ a state of perfect health or a condition caused by poisoning?"
    },
    {
        "word": "tractability",
        "meaning": "The quality of being easily managed, controlled, or influenced.",
        "sentences": ["The teacher appreciated the tractability of the new students during the field trip."],
        "vocabulary_question": "Does ████████████ describe a person who is very stubborn or someone who is easy to manage?"
    },
    {
        "word": "traiteur",
        "meaning": "The keeper of an eating house; a caterer or restaurant keeper.",
        "sentences": ["The traiteur prepared a magnificent spread for the wedding reception."],
        "vocabulary_question": "Is a ████████ a person who builds furniture or a person who provides and caters food?"
    },
    {
        "word": "tramontana",
        "meaning": "A cold wind from the north or over the mountains (in the Mediterranean region).",
        "sentences": ["The tramontana blew fiercely through the valley, bringing a sudden chill to the air."],
        "vocabulary_question": "Is a ██████████ a warm tropical breeze or a cold northern mountain wind?"
    },
    {
        "word": "transcend",
        "meaning": "To be or go beyond the range or limits of (something abstract, typically a conceptual field or division).",
        "sentences": ["Great art can transcend cultural boundaries and speak to people everywhere."],
        "vocabulary_question": "When you ████████ something, are you staying within its limits or going beyond them?"
    },
    {
        "word": "transducer",
        "meaning": "A device that converts variations in a physical quantity, such as pressure or brightness, into an electrical signal.",
        "sentences": ["A microphone is a type of transducer that converts sound waves into electrical energy."],
        "vocabulary_question": "Does a ██████████ convert physical energy into electrical signals or into heat?"
    },
    {
        "word": "transhumance",
        "meaning": "The action or practice of moving livestock from one grazing ground to another in a seasonal cycle.",
        "sentences": ["The shepherds practiced transhumance, moving their sheep to the high mountains for the summer."],
        "vocabulary_question": "Does ████████████ involve keeping animals in one barn or moving them seasonally to different pastures?"
    },
    {
        "word": "transience",
        "meaning": "The state or fact of lasting only for a short time; impermanence.",
        "sentences": ["The poet wrote about the transience of youth and the passing of time."],
        "vocabulary_question": "Does ██████████ describe something that lasts forever or something that lasts only a short time?"
    },
    {
        "word": "transmissibility",
        "meaning": "The quality of being able to be passed on from one person or place to another.",
        "sentences": ["The high transmissibility of the flu makes it very easy to catch in crowded places."],
        "vocabulary_question": "Does ████████████████ describe how easily something can be passed along or how heavy it is?"
    },
    {
        "word": "transmontane",
        "meaning": "Passing or situated on the other side of a mountain range.",
        "sentences": ["The explorers hoped to find a transmontane route to the sea."],
        "vocabulary_question": "Does ████████████ relate to something on this side of a mountain or on the other side?"
    },
    {
        "word": "transpiration",
        "meaning": "The process by which moisture is carried through plants from roots to small pores on the underside of leaves.",
        "sentences": ["In the hot sun, the rate of transpiration in the oak tree increased significantly."],
        "vocabulary_question": "Is █████████████ the process of plants drinking water or plants releasing water vapor through leaves?"
    },
    {
        "word": "transposable",
        "meaning": "Capable of being changed in relative position or order.",
        "sentences": ["The parts of the modular sofa were transposable, allowing for many different layouts."],
        "vocabulary_question": "If something is ███████████, is it stuck in one place or can its position be changed?"
    },
    {
        "word": "trapezoid",
        "meaning": "A quadrilateral with at least one pair of parallel sides.",
        "sentences": ["The roof of the house was shaped like a large trapezoid."],
        "vocabulary_question": "Is a █████████ a shape with three sides or a four-sided shape with parallel sides?"
    },
    {
        "word": "traumatropism",
        "meaning": "A modification of the orientation of a plant organ caused by an injury.",
        "sentences": ["The distorted growth of the tree branch was an example of traumatropism following the storm."],
        "vocabulary_question": "Does █████████████ relate to a plant's growth after an injury or its growth toward the sun?"
    },
    {
        "word": "travails",
        "meaning": "Painful or laborious efforts; hardships.",
        "sentences": ["The book chronicles the travails of a family trying to survive during the Great Depression."],
        "vocabulary_question": "Does ████████ describe an easy, carefree experience or a period of painful, difficult effort?"
    },
    {
        "word": "treadle",
        "meaning": "A lever worked by the foot that imparts motion to a machine (such as a sewing machine or loom).",
        "sentences": ["The weaver pumped the treadle with her foot to keep the loom moving."],
        "vocabulary_question": "Is a ███████ operated by a person's hands or by their feet?"
    },
    {
        "word": "trefoil",
        "meaning": "A small European plant of the pea family with yellow flowers and clover-like leaves with three leaflets.",
        "sentences": ["The hiker noticed a patch of yellow trefoil growing along the side of the trail."],
        "vocabulary_question": "Does a ██████ leaf typically have three leaflets or five leaflets?"
    },
    {
        "word": "trellis",
        "meaning": "A frame made of crossing pieces of wood used as a screen or to hold up climbing plants.",
        "sentences": ["The rose bush climbed high up the wooden trellis beside the garden gate."],
        "vocabulary_question": "Is a ███████ used to keep water inside a pond or to support climbing plants?"
    },
    {
        "word": "trepanation",
        "meaning": "An ancient medical procedure in which a hole is drilled or scraped into the human skull.",
        "sentences": ["Archaeologists have found ancient skulls that show evidence of successful trepanation."],
        "vocabulary_question": "Does ███████████ involve an operation on the heart or an operation on the skull?"
    },
    {
        "word": "trepidation",
        "meaning": "A feeling of fear or agitation about something that may happen.",
        "sentences": ["She felt a sense of trepidation as she prepared to walk onto the stage for her speech."],
        "vocabulary_question": "Is ███████████ a feeling of great confidence or a feeling of fear and unease?"
    },
    {
        "word": "triage",
        "meaning": "The process of determining the priority of patients' treatments based on the severity of their condition.",
        "sentences": ["The emergency room nurse performed triage to ensure the most seriously injured patients were seen first."],
        "vocabulary_question": "In a hospital, does ██████ involve organizing patients by their height or by how badly they are hurt?"
    },
    {
        "word": "tributary",
        "meaning": "A river or stream flowing into a larger river or lake.",
        "sentences": ["The Missouri River is the longest tributary of the Mississippi River."],
        "vocabulary_question": "Is a █████████ a small stream that flows into a larger river or a giant ocean wave?"
    },
    {
        "word": "trice",
        "meaning": "In a moment; very quickly.",
        "sentences": ["Don't worry; I'll have that flat tire fixed in a trice!"],
        "vocabulary_question": "If something is done in a ██████, does it take several hours or just a quick moment?"
    },
    {
        "word": "tricenary",
        "meaning": "Of or relating to the number thirty; lasting thirty days or years.",
        "sentences": ["The museum held a special event to celebrate its tricenary anniversary."],
        "vocabulary_question": "Does the word █████████ relate to the number thirteen or the number thirty?"
    },
    {
        "word": "triceratops",
        "meaning": "A large herbivorous dinosaur with three horns on its head and a bony frill around its neck.",
        "sentences": ["The triceratops used its massive horns to defend itself from predators."],
        "vocabulary_question": "Did a ███████████ have one horn on its nose or three horns on its head?"
    },
    {
        "word": "triforium",
        "meaning": "A gallery or arcade above the arches of the nave, choir, and transepts of a church.",
        "sentences": ["We looked up from the main floor of the cathedral to see the delicate arches of the triforium."],
        "vocabulary_question": "Is a █████████ a type of floor rug or a gallery of arches inside a large church?"
    },
    {
        "word": "trigeminal",
        "meaning": "Relating to the fifth cranial nerve, which is the chief sensory nerve of the face.",
        "sentences": ["The doctor checked the patient's trigeminal nerve for any signs of damage."],
        "vocabulary_question": "Does the ██████████ nerve help you walk or provide sensation to your face?"
    },
    {
        "word": "triglycerides",
        "meaning": "The main constituents of natural fats and oils, high levels of which in the blood are associated with heart disease.",
        "sentences": ["The patient was advised to eat less sugar to help lower his blood triglycerides."],
        "vocabulary_question": "Are █████████████ a type of vitamin or a type of fat found in the blood?"
    },
    {
        "word": "trillium",
        "meaning": "A plant of the lily family with a solitary three-petaled flower and three leaves.",
        "sentences": ["The forest floor was blanketed with the white blossoms of the trillium in early spring."],
        "vocabulary_question": "Is a ████████ a type of desert cactus or a forest flower with three petals and three leaves?"
    },
    {
        "word": "triste",
        "meaning": "Sad or dismal (French origin).",
        "sentences": ["The grey, rainy weather gave the city a very triste appearance."],
        "vocabulary_question": "Does ██████ mean a feeling of great excitement or a feeling of sadness?"
    },
    {
        "word": "trituration",
        "meaning": "The act of grinding or rubbing to a fine powder.",
        "sentences": ["The pharmacist began the trituration of the solid medicine using a mortar and pestle."],
        "vocabulary_question": "Does ███████████ involve boiling a liquid or grinding a solid into a fine powder?"
    },
    {
        "word": "trophic",
        "meaning": "Relating to feeding and nutrition.",
        "sentences": ["Ecologists study the different trophic levels to understand how energy moves through a food chain."],
        "vocabulary_question": "Does the word ███████ relate to weather patterns or to nutrition and feeding?"
    },
    {
        "word": "troubadour",
        "meaning": "A strolling minstrel; or anyone who promotes a cause through music or verse.",
        "sentences": ["The medieval troubadour traveled from castle to castle, singing songs of brave knights."],
        "vocabulary_question": "Was a ██████████ a type of military commander or a strolling musician and poet?"
    },
    {
        "word": "Truckee",
        "meaning": "A town in California, or the river that flows through it from Lake Tahoe.",
        "sentences": ["The Truckee River is a popular spot for fly fishing and rafting."],
        "vocabulary_question": "Is ███████ a famous mountain in Alaska or a river and town in California?"
    },
    {
        "word": "trygon",
        "meaning": "A stingray; any of several fishes having a whip-like tail with a stinging spine.",
        "sentences": ["The diver caught a glimpse of a large trygon gliding over the sandy ocean floor."],
        "vocabulary_question": "Is a ██████ a type of forest bird or a type of stingray?"
    },
    {
        "word": "tsk-tsked",
        "meaning": "Expressed disapproval by making a 'tsk' sound.",
        "sentences": ["The librarian tsk-tsked at the children who were whispering too loudly."],
        "vocabulary_question": "When someone ███-█████ at you, are they cheering for you or showing disapproval?"
    },
    {
        "word": "tubular",
        "meaning": "Long, round, and hollow like a tube.",
        "sentences": ["The pasta was tubular, making it perfect for holding the thick cheese sauce."],
        "vocabulary_question": "Is something ████████ shaped like a flat square or like a hollow tube?"
    },
    {
        "word": "tumpline",
        "meaning": "A strap passed over the forehead or chest to help support a pack carried on the back.",
        "sentences": ["The porter used a tumpline to balance the heavy basket while climbing the mountain."],
        "vocabulary_question": "Is a ████████ a type of shoe or a strap used to help carry a heavy load?"
    },
    {
        "word": "tungsten",
        "meaning": "A very hard, silvery-grey metallic element with the highest melting point of all metals.",
        "sentences": ["Tungsten is used for the filaments in incandescent light bulbs because it can get very hot without melting."],
        "vocabulary_question": "Is ████████ a soft type of plastic or a very hard metal with a high melting point?"
    },
    {
        "word": "turbidity",
        "meaning": "The quality of being cloudy, opaque, or thick with suspended matter (usually of a liquid).",
        "sentences": ["After the heavy rain, the turbidity of the river increased as mud washed into the water."],
        "vocabulary_question": "Does █████████ describe water that is crystal clear or water that is cloudy and muddy?"
    },
    {
        "word": "turbinado",
        "meaning": "A type of partially refined sugar with large, light-brown crystals.",
        "sentences": ["She sprinkled turbinado sugar over the muffins to give them a crunchy topping."],
        "vocabulary_question": "Is █████████ a type of spicy seasoning or a type of light-brown sugar?"
    },
    {
        "word": "turducken",
        "meaning": "A dish consisting of a deboned chicken stuffed into a deboned duck, which is then stuffed into a deboned turkey.",
        "sentences": ["The family decided to try a turducken for their special holiday dinner."],
        "vocabulary_question": "Is a █████████ a type of wild berry or a dish made of three different birds?"
    },
    {
        "word": "turgor",
        "meaning": "The state of being turgid or swollen, especially due to high fluid content.",
        "sentences": ["Adequate water is essential for maintaining the turgor of plant cells, keeping the stems upright."],
        "vocabulary_question": "Does ██████ describe a plant that is wilted and dry or one that is firm and full of fluid?"
    },
    {
        "word": "turken",
        "meaning": "A breed of chicken with a naturally featherless neck, often called a 'Naked Neck'.",
        "sentences": ["The turken looks strange because its neck has no feathers, making it look a bit like a turkey."],
        "vocabulary_question": "Is a ██████ a type of large forest deer or a breed of chicken with a featherless neck?"
    },
    {
        "word": "turophile",
        "meaning": "A connoisseur or lover of cheese.",
        "sentences": ["As a dedicated turophile, he traveled across France to sample the finest local Bries and Camemberts."],
        "vocabulary_question": "Is a █████████ someone who is afraid of mice or someone who loves cheese?"
    },
    {
        "word": "turpentine",
        "meaning": "A fluid obtained by the distillation of resin from live trees, mainly pines, used as a solvent and thinner.",
        "sentences": ["The artist used turpentine to clean the oil paint from her brushes at the end of the day."],
        "vocabulary_question": "Is ██████████ used as a type of perfume or as a solvent to thin paint?"
    },
    {
        "word": "tussock",
        "meaning": "A small area of grass that is thicker or longer than the grass growing around it.",
        "sentences": ["The hiker tripped over a thick tussock of grass hidden in the marshy field."],
        "vocabulary_question": "Is a ███████ a deep hole in the ground or a clump of long, thick grass?"
    },
    {
        "word": "tutelage",
        "meaning": "Protection of or authority over someone or something; guardianship or instruction.",
        "sentences": ["Under the expert tutelage of the master chef, she learned to make perfect soufflés."],
        "vocabulary_question": "Does ████████ involve being left alone to learn or being under the guidance and instruction of a teacher?"
    },
    {
        "word": "tutti-frutti",
        "meaning": "A confection or ice cream containing small pieces of various chopped candied fruits.",
        "sentences": ["The children chose the brightly colored tutti-frutti ice cream for their dessert."],
        "vocabulary_question": "Is █████-██████ a type of plain vanilla or a treat filled with different pieces of fruit?"
    },
    {
        "word": "twain",
        "meaning": "A couple or pair; two.",
        "sentences": ["The two paths diverged, and 'never the twain shall meet' became a famous saying."],
        "vocabulary_question": "Does the word █████ refer to a single item or a pair of two?"
    },
    {
        "word": "twang",
        "meaning": "A strong, ringing sound such as that made by the plucked string of a musical instrument or a bow.",
        "sentences": ["We heard the sharp twang of the guitar string as he tuned the instrument."],
        "vocabulary_question": "Is a █████ a soft, muffled thud or a sharp, ringing sound made by a plucked string?"
    },
    {
        "word": "tympanum",
        "meaning": "The eardrum; or a vertical recessed triangular space forming the center of a pediment.",
        "sentences": ["The loud explosion was so powerful that it damaged the soldier's left tympanum."],
        "vocabulary_question": "Is the ████████ in your body part of your eye or part of your ear?"
    },
    {
        "word": "typhlology",
        "meaning": "The scientific study of blindness, its causes, and its effects.",
        "sentences": ["Researchers in the field of typhlology work to develop new technologies for the visually impaired."],
        "vocabulary_question": "Is ██████████ the study of weather patterns or the study of blindness?"
    },
    {
        "word": "ubiquity",
        "meaning": "The state of being everywhere at once (or appearing to be).",
        "sentences": ["The ubiquity of mobile phones means that you can reach almost anyone at any time."],
        "vocabulary_question": "Does ████████ describe something that is very rare or something that is everywhere?"
    },
    {
        "word": "ufology",
        "meaning": "The study of unidentified flying objects (UFOs).",
        "sentences": ["He spent his weekends reading books on ufology, hoping to find evidence of alien visitors."],
        "vocabulary_question": "Is ███████ the study of deep-sea fish or the study of unidentified flying objects?"
    },
    {
        "word": "Ukrainian",
        "meaning": "Relating to Ukraine, its people, or its language.",
        "sentences": ["The bakery was famous for its traditional Ukrainian bread and pastries."],
        "vocabulary_question": "Does the word █████████ relate to a country in Eastern Europe or a country in South America?"
    },
    {
        "word": "ulna",
        "meaning": "The thinner and longer of the two bones in the human forearm, on the side opposite to the thumb.",
        "sentences": ["The X-ray showed a small fracture in his ulna near the elbow."],
        "vocabulary_question": "Is the ████ a bone found in your leg or a bone found in your forearm?"
    },
    {
        "word": "ultradian",
        "meaning": "Relating to biological cycles or rhythms that recur more than once in a 24-hour day.",
        "sentences": ["Hunger and alertness often follow an ultradian rhythm throughout the day."],
        "vocabulary_question": "Does an █████████ cycle happen once a day or several times within a single day?"
    },
    {
        "word": "umbelliferous",
        "meaning": "Relating to the carrot family of plants, characterized by flowers growing in flat-topped clusters (umbels).",
        "sentences": ["Carrots, celery, and parsley are all examples of umbelliferous plants."],
        "vocabulary_question": "Is an █████████████ plant more like a single tall sunflower or a cluster of small flowers like a carrot top?"
    },
    {
        "word": "umbilical",
        "meaning": "Relating to the navel or the cord connecting a fetus to the placenta.",
        "sentences": ["The doctor carefully cut the umbilical cord shortly after the baby was born."],
        "vocabulary_question": "Does the █████████ cord connect a baby to its mother or a person's head to their neck?"
    },
    {
        "word": "umbrage",
        "meaning": "Offense or annoyance; displeasure.",
        "sentences": ["She took umbrage at the suggestion that her work was anything less than perfect."],
        "vocabulary_question": "If you take ███████ at a comment, are you feeling very happy or very annoyed/offended?"
    },
    {
        "word": "una corda",
        "meaning": "A direction in piano music to use the soft pedal.",
        "sentences": ["The sheet music marked the passage una corda to indicate a delicate, quiet sound."],
        "vocabulary_question": "Does ███ █████ tell a piano player to play as loudly as possible or to use the soft pedal?"
    },
    {
        "word": "unchristened",
        "meaning": "Not having been baptized or named in a Christian ceremony.",
        "sentences": ["In the old story, the unchristened ship was said to be prone to bad luck."],
        "vocabulary_question": "Is an ████████████ person someone who has been baptized or someone who has not?"
    },
    {
        "word": "unctuous",
        "meaning": "Excessively flattering or ingratiating; or having a greasy or soapy feel.",
        "sentences": ["The salesman's unctuous manner made the customers feel a bit suspicious."],
        "vocabulary_question": "Is an ████████ person very blunt and honest or overly flattering and 'slippery'?"
    },
    {
        "word": "ungulate",
        "meaning": "A hoofed mammal.",
        "sentences": ["Horses, deer, and giraffes are all members of the ungulate group."],
        "vocabulary_question": "Is an ████████ an animal with soft paws or an animal with hard hooves?"
    },
    {
        "word": "unilaterally",
        "meaning": "Used to indicate that an action is taken by only one person, group, or country involved in a situation.",
        "sentences": ["The country decided to raise taxes unilaterally without consulting its neighbors."],
        "vocabulary_question": "If a decision is made ████████████, does everyone agree or did one side decide on its own?"
    },
    {
        "word": "unilocular",
        "meaning": "Having only one cavity or compartment.",
        "sentences": ["The biologist examined the unilocular plant cell under the microscope."],
        "vocabulary_question": "Does a ██████████ cell have many different chambers or just one single compartment?"
    },
    {
        "word": "univocal",
        "meaning": "Having only one possible meaning; unambiguous.",
        "sentences": ["The results of the test were univocal, leaving no doubt about the outcome."],
        "vocabulary_question": "Is a ████████ statement confusing and full of many meanings or very clear with only one meaning?"
    },
    {
        "word": "unmoored",
        "meaning": "To release a boat from its moorings; or to feel disconnected from one's usual stability or foundations.",
        "sentences": ["Without a steady job, he felt unmoored and uncertain about his future."],
        "vocabulary_question": "If someone feels ████████, do they feel very secure or disconnected and drifting?"
    },
    {
        "word": "unravel",
        "meaning": "To undo twisted, knitted, or woven threads; or to investigate and solve a mystery.",
        "sentences": ["The detective worked hard to unravel the complex web of lies."],
        "vocabulary_question": "When you ███████ a secret, are you hiding it deeper or uncovering/solving it?"
    },
    {
        "word": "unremitting",
        "meaning": "Never relaxing or slackening; incessant.",
        "sentences": ["The unremitting rain caused the river to overflow its banks by morning."],
        "vocabulary_question": "Is ███████████ activity something that stops frequently or something that never stops?"
    },
    {
        "word": "unsurpassed",
        "meaning": "Better or greater than any other; supreme.",
        "sentences": ["The view from the top of the mountain is unsurpassed in its beauty."],
        "vocabulary_question": "If something is ███████████, has it been beaten by many others or is it the best?"
    },
    {
        "word": "untenable",
        "meaning": "Not able to be maintained or defended against objection or attack.",
        "sentences": ["His position on the issue became untenable as more facts came to light."],
        "vocabulary_question": "Is an █████████ argument one that is very strong or one that is impossible to defend?"
    },
    {
        "word": "upbraid",
        "meaning": "To find fault with someone; scold; to reprimand severely.",
        "sentences": ["The manager had to upbraid the employee for his constant lateness."],
        "vocabulary_question": "When you ███████ someone, are you giving them a prize or scolding them severely?"
    },
    {
        "word": "upsilon",
        "meaning": "The 20th letter of the Greek alphabet (υ).",
        "sentences": ["The scientist used the Greek letter upsilon to represent the specific variable in the equation."],
        "vocabulary_question": "Is ███████ a type of bird or a letter in the Greek alphabet?"
    },
    {
        "word": "ursine",
        "meaning": "Relating to or resembling bears.",
        "sentences": ["The large, heavy footprints showed clear ursine characteristics."],
        "vocabulary_question": "Does the word ██████ relate to bears or to cats?"
    },
    {
        "word": "usurper",
        "meaning": "A person who takes a position of power or importance illegally or by force.",
        "sentences": ["The young prince fought to reclaim his throne from the cruel usurper."],
        "vocabulary_question": "Is a ███████ a rightful king or someone who stole the throne by force?"
    },
    {
        "word": "utilitarian",
        "meaning": "Designed to be useful or practical rather than attractive.",
        "sentences": ["The building was strictly utilitarian, with no decorations or fancy features."],
        "vocabulary_question": "Is a ███████████ object focused on beauty or on being useful and practical?"
    },
    {
        "word": "uveal",
        "meaning": "Relating to the uvea, the pigmented layer of the eye.",
        "sentences": ["The eye doctor specialized in treating uveal inflammation."],
        "vocabulary_question": "Does the word █████ relate to the eye or to the stomach?"
    },
    {
        "word": "uvula",
        "meaning": "A fleshy extension at the back of the soft palate that hangs above the throat.",
        "sentences": ["When he opened his mouth wide to say 'Ah', the doctor could see his uvula clearly."],
        "vocabulary_question": "Is the █████ located in the ear or at the back of the throat?"
    },
    {
        "word": "vaccination",
        "meaning": "Treatment with a vaccine to produce immunity against a disease.",
        "sentences": ["The discovery of the smallpox vaccination saved millions of lives."],
        "vocabulary_question": "Is a ███████████ used to treat a current illness or to prevent a future one?"
    },
    {
        "word": "vagabonds",
        "meaning": "Individuals who wander about from place to place without a home or job.",
        "sentences": ["The story follows two vagabonds as they travel across the country by train."],
        "vocabulary_question": "Are █████████ people who stay in one house forever or people who wander from place to place?"
    },
    {
        "word": "vague",
        "meaning": "Of uncertain, indefinite, or unclear character or meaning.",
        "sentences": ["His directions were so vague that we ended up getting lost twice."],
        "vocabulary_question": "Is a █████ description very clear and detailed or unclear and hard to understand?"
    },
    {
        "word": "vainglorious",
        "meaning": "Excessively proud of oneself or one's achievements; overly vain.",
        "sentences": ["The vainglorious king demanded that statues of himself be built in every city square."],
        "vocabulary_question": "Is a ████████████ person very humble or excessively proud of themselves?"
    },
    {
        "word": "valerian",
        "meaning": "A hardy herb with small pink or white flowers, used in herbal medicine as a sedative.",
        "sentences": ["She drank a cup of valerian tea to help her relax before going to sleep."],
        "vocabulary_question": "Is ████████ a type of modern metal or a hardy herb used in medicine?"
    },
    {
        "word": "valiant",
        "meaning": "Possessing or showing courage or determination.",
        "sentences": ["The soldiers made a valiant effort to hold the line against the much larger army."],
        "vocabulary_question": "Is a ███████ person cowardly and afraid or brave and courageous?"
    },
    {
        "word": "vallecula",
        "meaning": "A small depression or furrow, especially one between the base of the tongue and the epiglottis.",
        "sentences": ["The doctor used a scope to check the patient's vallecula for any signs of obstruction."],
        "vocabulary_question": "Is a █████████ a high mountain peak or a small depression or furrow in the body?"
    },
    {
        "word": "valuator",
        "meaning": "A person who estimates the price or value of something; an appraiser.",
        "sentences": ["The professional valuator looked at the antique jewelry to determine its market price."],
        "vocabulary_question": "Does a ████████ estimate the weight of an object or its monetary value?"
    },
    {
        "word": "vandalize",
        "meaning": "To deliberately destroy or damage public or private property.",
        "sentences": ["The abandoned building was covered in graffiti after someone decided to vandalize it."],
        "vocabulary_question": "When you █████████ property, are you fixing it up or deliberately damaging it?"
    },
    {
        "word": "vanguard",
        "meaning": "The forefront of thought, taste, or opinion in a field, school, or movement.",
        "sentences": ["The young designers were at the vanguard of the new sustainable fashion movement."],
        "vocabulary_question": "Is the ████████ the group at the very back or the leaders at the forefront of a movement?"
    },
    {
        "word": "vanquish",
        "meaning": "To defeat thoroughly.",
        "sentences": ["In the final chapter, the hero manages to vanquish the dark sorcerer."],
        "vocabulary_question": "Does to ████████ mean to lose a battle or to defeat someone thoroughly?"
    },
    {
        "word": "vaporetto",
        "meaning": "A motorboat used for public transportation in Venice, Italy.",
        "sentences": ["We took a vaporetto down the Grand Canal to reach our hotel."],
        "vocabulary_question": "Is a █████████ a type of Italian sports car or a public water bus in Venice?"
    },
    {
        "word": "varactor",
        "meaning": "A semiconductor diode used as a voltage-controlled capacitor.",
        "sentences": ["The engineer used a varactor to tune the radio frequency circuit."],
        "vocabulary_question": "Is a ████████ an electronic component or a type of garden tractor?"
    },
    {
        "word": "varicose",
        "meaning": "Affected by a condition causing veins to become abnormally swollen and twisted.",
        "sentences": ["The doctor suggested compression socks to help manage her varicose veins."],
        "vocabulary_question": "Are ████████ veins perfectly straight and thin or swollen and twisted?"
    },
    {
        "word": "variegated",
        "meaning": "Exhibiting different colors, especially as irregular patches or streaks.",
        "sentences": ["The plant was admired for its beautiful variegated leaves of green and white."],
        "vocabulary_question": "Is a ██████████ leaf all one solid color or marked with different colored patches?"
    },
    {
        "word": "varsha",
        "meaning": "The rainy season or monsoon season in South Asia.",
        "sentences": ["The farmers eagerly awaited the start of the varsha to water their rice crops."],
        "vocabulary_question": "Does ██████ refer to a period of extreme drought or the rainy monsoon season?"
    },
    {
        "word": "Vatican",
        "meaning": "The palace and official residence of the pope in Rome; the central administration of the Roman Catholic Church.",
        "sentences": ["Thousands of people gathered in St. Peter's Square at the Vatican to see the pope."],
        "vocabulary_question": "Is the ███████ a city-state in Italy or a mountain in Switzerland?"
    },
    {
        "word": "vaudeville",
        "meaning": "A type of entertainment popular in the early 20th century, featuring a mixture of specialty acts like comedy, song, and dance.",
        "sentences": ["Many famous movie stars began their careers performing in vaudeville shows."],
        "vocabulary_question": "Was ██████████ a type of silent movie or a live variety show with many different acts?"
    },
    {
        "word": "veganism",
        "meaning": "The practice of abstaining from the use of animal products, particularly in diet.",
        "sentences": ["Her commitment to veganism meant she did not eat honey, eggs, or dairy."],
        "vocabulary_question": "Does █████████ allow for the eating of cheese or is it a diet free from all animal products?"
    },
    {
        "word": "vegetarian",
        "meaning": "A person who does not eat meat, and sometimes other animal products, especially for moral, religious, or health reasons.",
        "sentences": ["The restaurant offered a wide variety of vegetarian options, including a delicious lentil soup."],
        "vocabulary_question": "Does a ██████████ eat chicken and beef or avoid meat entirely?"
    },
    {
        "word": "vehemence",
        "meaning": "The quality of being marked by intense hostility or great force/passion.",
        "sentences": ["The politician denied the accusations with great vehemence during the interview."],
        "vocabulary_question": "Does █████████ describe a soft, weak reaction or a forceful, intense one?"
    },
    {
        "word": "vehicular",
        "meaning": "Relating to or involving a vehicle or vehicles.",
        "sentences": ["The bridge was closed to all vehicular traffic while repairs were being made."],
        "vocabulary_question": "Does █████████ relate to people walking or to cars and trucks?"
    },
    {
        "word": "vellication",
        "meaning": "The act of twitching or a localized twitching of a muscle.",
        "sentences": ["The patient noticed a slight vellication in his eyelid after drinking too much coffee."],
        "vocabulary_question": "Is ███████████ a slow, steady movement or a quick, localized twitching?"
    },
    {
        "word": "velours",
        "meaning": "A plush, woven fabric resembling velvet.",
        "sentences": ["She wore a soft velours tracksuit that was perfect for a long flight."],
        "vocabulary_question": "Is ███████ a type of rough sandpaper or a soft, velvet-like fabric?"
    },
    {
        "word": "vendage",
        "meaning": "The harvesting of grapes; or the season for the grape harvest.",
        "sentences": ["The entire village celebrated the end of the vendage with a large feast."],
        "vocabulary_question": "Does ███████ relate to the harvest of wheat or the harvest of grapes?"
    },
    {
        "word": "veneer",
        "meaning": "A thin decorative covering of fine wood applied to a coarser wood or other material; or a deceptive outward appearance.",
        "sentences": ["The cheap desk was covered in a mahogany veneer to make it look more expensive."],
        "vocabulary_question": "Is a ██████ a solid piece of stone or a thin decorative covering?"
    },
    {
        "word": "vengeance",
        "meaning": "Punishment inflicted or retribution exacted for an injury or wrong.",
        "sentences": ["The hero swore vengeance against the villain who had destroyed his village."],
        "vocabulary_question": "Is █████████ an act of forgiveness or an act of retribution for a wrong?"
    },
    {
        "word": "venial",
        "meaning": "Denoting a sin that is not regarded as depriving the soul of divine grace; easily excused or forgiven.",
        "sentences": ["The judge considered the small mistake to be a venial offense."],
        "vocabulary_question": "Is a ██████ error one that is unforgivable or one that is easily excused?"
    },
    {
        "word": "venomous",
        "meaning": "Capable of injecting venom by means of a bite or sting; or full of malice/spite.",
        "sentences": ["The hiker was careful to avoid the venomous snake hiding in the tall grass."],
        "vocabulary_question": "Is a ████████ animal harmless or capable of injecting poison?"
    },
    {
        "word": "ventail",
        "meaning": "A piece of armor attached to the bottom of the visor of a helmet, covering the lower face.",
        "sentences": ["The knight lowered his ventail before charging into the tournament."],
        "vocabulary_question": "Was a ███████ a type of shield or a part of a helmet that protected the face?"
    },
    {
        "word": "ventifact",
        "meaning": "A stone shaped by the erosive action of windblown sand.",
        "sentences": ["The desert floor was covered in smooth, oddly shaped ventifacts."],
        "vocabulary_question": "Is a █████████ a rock shaped by flowing water or by windblown sand?"
    },
    {
        "word": "ventricle",
        "meaning": "A hollow part or cavity in an organ, especially one of the two main chambers of the heart.",
        "sentences": ["The left ventricle pumps oxygen-rich blood to the rest of the body."],
        "vocabulary_question": "Is the █████████ a chamber in the heart or a part of the lungs?"
    },
    {
        "word": "ventriloquy",
        "meaning": "The act of stagecraft in which a person creates the illusion that their voice is coming from elsewhere, usually a puppet.",
        "sentences": ["He practiced ventriloquy for years until he could speak without moving his lips."],
        "vocabulary_question": "Does ███████████ involve singing in a choir or making a puppet seem to talk?"
    },
    {
        "word": "veracity",
        "meaning": "Conformity to facts; accuracy; habitual truthfulness.",
        "sentences": ["The lawyer questioned the veracity of the witness's statement."],
        "vocabulary_question": "Does █████████ relate to telling lies or telling the truth?"
    },
    {
        "word": "verbena",
        "meaning": "A herbaceous plant with small, fragrant flowers, often used in perfumes or gardens.",
        "sentences": ["The garden was filled with the sweet scent of purple verbena blossoms."],
        "vocabulary_question": "Is ███████ a type of small bird or a type of fragrant flowering plant?"
    },
    {
        "word": "verboten",
        "meaning": "Forbidden, especially by an authority.",
        "sentences": ["Using cell phones during the exam was strictly verboten."],
        "vocabulary_question": "If something is ████████, is it encouraged or strictly forbidden?"
    },
    {
        "word": "verism",
        "meaning": "The preference of everyday subject matter instead of the heroic or legendary in art and literature; realism.",
        "sentences": ["The author's use of verism made the grit and struggle of daily life feel very real to the reader."],
        "vocabulary_question": "Does ██████ focus on mythological gods or on realistic, everyday life?"
    },
    {
        "word": "veritable",
        "meaning": "Used as an intensifier, often to qualify a metaphor; true or real.",
        "sentences": ["The garage sale was a veritable treasure trove of vintage toys and clothes."],
        "vocabulary_question": "Does █████████ mean something is fake and imaginary or true and real?"
    },
    {
        "word": "vermicide",
        "meaning": "A substance used to kill worms, especially parasitic ones.",
        "sentences": ["The veterinarian prescribed a vermicide to treat the puppy's heartworm."],
        "vocabulary_question": "Is a █████████ used to grow plants or to kill parasitic worms?"
    },
    {
        "word": "vernal",
        "meaning": "Of, in, or appropriate to spring.",
        "sentences": ["The vernal equinox marks the official first day of spring."],
        "vocabulary_question": "Does the word ██████ relate to the cold of winter or the freshness of spring?"
    },
    {
        "word": "vespertine",
        "meaning": "Relating to, occurring, or flourishing in the evening.",
        "sentences": ["The garden was full of vespertine flowers that only opened after sunset."],
        "vocabulary_question": "Do ██████████ animals come out during the bright day or in the evening?"
    },
    {
        "word": "vestibule",
        "meaning": "An antechamber, hall, or lobby next to the outer door of a building.",
        "sentences": ["We left our wet umbrellas in the vestibule before entering the main house."],
        "vocabulary_question": "Is a █████████ a small bedroom or a hallway near the entrance of a building?"
    },
    {
        "word": "vetiver",
        "meaning": "A fragrant tropical grass whose roots are used in perfumes and to prevent soil erosion.",
        "sentences": ["The soap had an earthy, woody scent thanks to the addition of vetiver oil."],
        "vocabulary_question": "Is ███████ a type of heavy stone or a fragrant tropical grass?"
    },
    {
        "word": "vetoed",
        "meaning": "Exercised a veto against (a decision or proposal); rejected.",
        "sentences": ["The president vetoed the bill, sending it back to the legislature."],
        "vocabulary_question": "If a plan is ██████, has it been accepted or officially rejected?"
    },
    {
        "word": "vicarage",
        "meaning": "The residence of a vicar (a representative or deputy of a bishop).",
        "sentences": ["The path led past the old stone church and straight to the vicarage."],
        "vocabulary_question": "Is a ████████ a type of boat or the house where a vicar lives?"
    },
    {
        "word": "vicarious",
        "meaning": "Experienced in the imagination through the feelings or actions of another person.",
        "sentences": ["The mother felt a vicarious joy when she saw her daughter win the race."],
        "vocabulary_question": "Is a █████████ experience one you do yourself or one you feel through someone else?"
    },
    {
        "word": "vice versa",
        "meaning": "With the main items in the preceding statement the other way around.",
        "sentences": ["She helps him with math, and vice versa—he helps her with history."],
        "vocabulary_question": "Does ████ █████ mean 'and also' or 'and the other way around'?"
    },
    {
        "word": "vicenary",
        "meaning": "Relating to or based on the number twenty.",
        "sentences": ["The Mayan numeral system was vicenary, using a base of twenty instead of ten."],
        "vocabulary_question": "Is a ████████ system based on the number ten or the number twenty?"
    },
    {
        "word": "viceroy",
        "meaning": "A regal official who runs a country, colony, city, or province in the name of and as the representative of the monarch.",
        "sentences": ["The king appointed a viceroy to rule the overseas territory."],
        "vocabulary_question": "Is a ███████ the king himself or a representative ruling in the king's name?"
    },
    {
        "word": "victimology",
        "meaning": "The study of victims of crime and the psychological effects on them.",
        "sentences": ["The detective took a course in victimology to better understand how to help survivors."],
        "vocabulary_question": "Is ████████████ the study of stars or the study of victims of crime?"
    },
    {
        "word": "vigil",
        "meaning": "A period of keeping awake during the time usually spent asleep, especially to keep watch or pray.",
        "sentences": ["The family kept a quiet vigil at the hospital through the night."],
        "vocabulary_question": "Is a █████ a time of deep sleep or a period of staying awake to keep watch?"
    },
    {
        "word": "vincible",
        "meaning": "Able to be overcome or conquered.",
        "sentences": ["Though the giant seemed powerful, the hero knew he was vincible."],
        "vocabulary_question": "Is a ████████ enemy impossible to defeat or able to be conquered?"
    },
    {
        "word": "virga",
        "meaning": "A mass of streaks of rain appearing to hang from a cloud and evaporating before reaching the ground.",
        "sentences": ["In the desert, we often saw virga hanging from the clouds, but the ground stayed dry."],
        "vocabulary_question": "Is █████ rain that hits the ground or rain that evaporates before it lands?"
    },
    {
        "word": "virtuoso",
        "meaning": "A person highly skilled in music or another artistic pursuit.",
        "sentences": ["The young piano virtuoso performed the difficult concerto with ease."],
        "vocabulary_question": "Is a ████████ a beginner or a highly skilled artistic expert?"
    },
    {
        "word": "virulence",
        "meaning": "The severity or harmfulness of a disease or poison; or bitter hostility.",
        "sentences": ["The doctors were shocked by the virulence of the new strain of flu."],
        "vocabulary_question": "Does █████████ describe something that is very weak or something extremely harmful/severe?"
    },
    {
        "word": "vis-à-vis",
        "meaning": "In relation to; with regard to; or face to face with.",
        "sentences": ["The company evaluated its growth vis-à-vis its main competitors."],
        "vocabulary_question": "Does ███-█-███ mean 'far away from' or 'in relation to/face to face with'?"
    },
    {
        "word": "viscidity",
        "meaning": "The quality of being glutinous or sticky; thickness.",
        "sentences": ["The viscidity of the honey made it difficult to pour quickly."],
        "vocabulary_question": "Is █████████ a word for watery thinness or sticky thickness?"
    },
    {
        "word": "vitriolic",
        "meaning": "Filled with bitter criticism or malice.",
        "sentences": ["The movie received vitriolic reviews from critics who hated the ending."],
        "vocabulary_question": "Is a █████████ comment kind and sweet or bitter and malicious?"
    },
    {
        "word": "vituline",
        "meaning": "Of, relating to, or resembling a calf or veal.",
        "sentences": ["The chef prepared a vituline stew using tender cuts of meat."],
        "vocabulary_question": "Does the word ████████ relate to calves or to birds?"
    },
    {
        "word": "volary",
        "meaning": "A large birdcage or aviary.",
        "sentences": ["We visited the zoo's new volary to see the exotic parrots flying freely."],
        "vocabulary_question": "Is a ██████ a type of underwater tank or a large birdcage?"
    },
    {
        "word": "volatile",
        "meaning": "Liable to change rapidly and unpredictably, especially for the worse.",
        "sentences": ["The political situation in the region remained extremely volatile."],
        "vocabulary_question": "Is a ████████ situation stable and calm or unpredictable and likely to change?"
    },
    {
        "word": "volition",
        "meaning": "The faculty or power of using one's will; the action of deciding or choosing.",
        "sentences": ["She decided to quit the team of her own volition, not because anyone forced her."],
        "vocabulary_question": "If you do something of your own ████████, did you choose to do it or were you forced?"
    },
    {
        "word": "volumetric",
        "meaning": "Relating to the measurement of volume.",
        "sentences": ["The scientist performed a volumetric analysis to find the exact amount of liquid."],
        "vocabulary_question": "Does ██████████ relate to the measurement of time or the measurement of volume?"
    },
    {
        "word": "Vulcan",
        "meaning": "The Roman god of fire and metalworking; or relating to volcanic activity.",
        "sentences": ["Ancient myths tell of Vulcan forging armor for the gods inside a volcano."],
        "vocabulary_question": "Was ██████ the god of the ocean or the god of fire and metalworking?"
    },
    {
        "word": "wainwright",
        "meaning": "A maker and repairer of wagons.",
        "sentences": ["In the 1800s, every small town needed a skilled wainwright to keep travel moving."],
        "vocabulary_question": "Did a ██████████ build boats or build and repair wagons?"
    },
    {
        "word": "wallaby",
        "meaning": "An Australasian marsupial that is similar to, but smaller than, a kangaroo.",
        "sentences": ["A mother wallaby carried her joey in her pouch as she hopped through the bush."],
        "vocabulary_question": "Is a ████████ a type of large desert lizard or a marsupial similar to a small kangaroo?"
    },
    {
        "word": "Walter Mitty",
        "meaning": "An ordinary, timid person who is given to extravagant daydreams of being a hero.",
        "sentences": ["He was a bit of a Walter Mitty, imagining himself as a secret agent while he sat at his desk."],
        "vocabulary_question": "Is a ██████ █████ a very brave hero or a timid person who daydreams about being one?"
    },
    {
        "word": "wasabi",
        "meaning": "A pungent green paste made from a Japanese plant, used as a condiment with sushi.",
        "sentences": ["Be careful with the wasabi; a tiny amount provides a very strong, spicy kick."],
        "vocabulary_question": "Is ██████ a sweet fruit sauce or a spicy green Japanese condiment?"
    },
    {
        "word": "wedel",
        "meaning": "To ski by moving the backs of the skis from side to side to make a series of short, quick turns.",
        "sentences": ["The advanced skier began to wedel down the steep, narrow slope with perfect control."],
        "vocabulary_question": "Does to █████ mean to ski in long, wide arcs or in short, quick turns?"
    },
    {
        "word": "Weimaraner",
        "meaning": "A large breed of dog with a short, silvery-grey coat, originally used for hunting.",
        "sentences": ["The Weimaraner is known for its high energy and striking grey eyes."],
        "vocabulary_question": "Is a ███████████ a type of small cat or a large breed of grey hunting dog?"
    },
    {
        "word": "wejack",
        "meaning": "Another name for the fisher (a North American marten).",
        "sentences": ["The trappers occasionally spotted a wejack prowling through the pine forest."],
        "vocabulary_question": "Is a ██████ a type of ocean fish or another name for a marten (forest mammal)?"
    },
    {
        "word": "werf",
        "meaning": "The area around a farmhouse; a farmyard.",
        "sentences": ["The children played in the werf while their parents tended to the crops."],
        "vocabulary_question": "Is a ████ a type of high-speed train or a farmyard area?"
    },
    {
        "word": "wherry",
        "meaning": "A light rowboat used for carrying passengers and goods on rivers and harbors.",
        "sentences": ["The oarsman rowed the wherry across the Thames to deliver the cargo."],
        "vocabulary_question": "Is a ██████ a type of large cargo ship or a light rowboat?"
    },
    {
        "word": "Wiccan",
        "meaning": "A follower of Wicca, a modern pagan religion based on ancient traditions.",
        "sentences": ["The Wiccan group gathered to celebrate the changing of the seasons."],
        "vocabulary_question": "Is a ██████ a follower of a modern pagan religion or a type of computer software?"
    },
    {
        "word": "widdershins",
        "meaning": "In a direction contrary to the sun's course; counterclockwise.",
        "sentences": ["In many folk stories, walking widdershins around a church was said to bring bad luck."],
        "vocabulary_question": "Does ███████████ mean moving clockwise or counterclockwise?"
    },
    {
        "word": "wilco",
        "meaning": "An abbreviation for 'will comply,' used in radio communication.",
        "sentences": ["'Roger that, base, wilco,' the pilot responded before starting the maneuver."],
        "vocabulary_question": "Does █████ mean 'I am lost' or 'I will follow your instructions'?"
    },
    {
        "word": "Winnebago",
        "meaning": "A North American Indian people of Wisconsin and Nebraska; or a popular brand of motorhome.",
        "sentences": ["The family rented a Winnebago for their summer road trip across the country."],
        "vocabulary_question": "Is a █████████ a type of small bicycle or a large motorhome/native group?"
    },
    {
        "word": "wisteria",
        "meaning": "A climbing shrub of the pea family, with hanging clusters of fragrant purple or white flowers.",
        "sentences": ["The porch was covered in beautiful, dripping vines of purple wisteria."],
        "vocabulary_question": "Is ████████ a type of low-growing moss or a climbing shrub with hanging flowers?"
    },
    {
        "word": "withernam",
        "meaning": "The taking of a second distress (seizure of goods) in place of a first distress that has been moved away.",
        "sentences": ["The legal case involved an ancient law of withernam regarding the return of the cattle."],
        "vocabulary_question": "Does █████████ relate to the celebration of a birthday or the legal seizure of goods?"
    },
    {
        "word": "wobbulator",
        "meaning": "An electronic device that varies the frequency of an oscillator, used in testing circuits.",
        "sentences": ["The technician used a wobbulator to check the response of the new amplifier."],
        "vocabulary_question": "Is a ██████████ a kitchen appliance or an electronic testing device?"
    },
    {
        "word": "woebegone",
        "meaning": "Displaying misery, distress, suffering, or sadness.",
        "sentences": ["The lost kitten had a woebegone look on its face as it sat in the rain."],
        "vocabulary_question": "Is a ████████ person very happy and cheerful or sad and miserable?"
    },
    {
        "word": "wolfsbane",
        "meaning": "A poisonous plant of the buttercup family, also known as monkshood.",
        "sentences": ["In old legends, wolfsbane was thought to provide protection against werewolves."],
        "vocabulary_question": "Is █████████ a type of healthy vegetable or a poisonous plant?"
    },
    {
        "word": "wootz",
        "meaning": "A type of steel with a high carbon content, originally produced in ancient India.",
        "sentences": ["The ancient swords were famous for being made from durable and sharp wootz steel."],
        "vocabulary_question": "Is █████ a type of soft wood or a type of high-carbon steel?"
    },
    {
        "word": "yabbies",
        "meaning": "Small Australian freshwater crayfish.",
        "sentences": ["The children spent the afternoon catching yabbies in the muddy creek."],
        "vocabulary_question": "Are ███████ a type of forest bird or small freshwater crayfish?"
    },
    {
        "word": "yacata",
        "meaning": "A burial mound built by the Tarascan people of Mexico, often in a T or keyhole shape.",
        "sentences": ["The archaeologists studied the unique structure of the ancient yacata."],
        "vocabulary_question": "Is a ██████ a type of modern skyscraper or an ancient burial mound?"
    },
    {
        "word": "yardang",
        "meaning": "A sharp irregular ridge of compact sand lying in the direction of the prevailing wind in a desert.",
        "sentences": ["The wind had carved the desert floor into a series of long, straight yardangs."],
        "vocabulary_question": "Is a ███████ a deep ocean trench or a ridge carved by wind in a desert?"
    },
    {
        "word": "yawmeter",
        "meaning": "An instrument for measuring the angular motion about the normal axis of an airplane.",
        "sentences": ["The pilot checked the yawmeter to ensure the plane was not drifting off its course."],
        "vocabulary_question": "Is a ████████ used to measure the depth of the ocean or the rotation of an airplane?"
    },
    {
        "word": "Yorkshire",
        "meaning": "A historic county in Northern England; or a breed of pig or terrier dog.",
        "sentences": ["We visited the beautiful rolling hills of the Yorkshire dales."],
        "vocabulary_question": "Is █████████ a city in Florida or a historic county in Northern England?"
    },
    {
        "word": "Yoruba",
        "meaning": "A member of a people of southwestern Nigeria and Benin.",
        "sentences": ["The Yoruba people have a rich history of art, especially in bronze and terracotta."],
        "vocabulary_question": "Is the ██████ a group of people from Nigeria or from Japan?"
    },
    {
        "word": "zeitgeist",
        "meaning": "The general cultural, ethical, and intellectual spirit of an era.",
        "sentences": ["The music of the 1960s perfectly captured the rebellious zeitgeist of that time."],
        "vocabulary_question": "Does █████████ refer to the spirit of a specific time period or the name of a German car?"
    },
    {
        "word": "zeppelin",
        "meaning": "A large German dirigible airship of the early 20th century.",
        "sentences": ["The massive zeppelin floated slowly over the city like a giant silver cigar."],
        "vocabulary_question": "Is a ████████ a type of deep-sea submarine or a large airship?"
    },
    {
        "word": "zirconium",
        "meaning": "A strong, silvery-grey metallic element that is highly resistant to corrosion.",
        "sentences": ["Zirconium is often used in the cladding for nuclear fuel rods."],
        "vocabulary_question": "Is █████████ a type of soft gas or a strong metallic element?"
    },
    {
        "word": "zoetic",
        "meaning": "Of or relating to life; vital.",
        "sentences": ["The philosopher spoke about the zoetic energy that connects all living things."],
        "vocabulary_question": "Does the word ██████ relate to living things or to dead, inanimate objects?"
    },
    {
        "word": "zoolatry",
        "meaning": "The worship of animals.",
        "sentences": ["Ancient Egyptian religion practiced a form of zoolatry, honoring gods in animal forms."],
        "vocabulary_question": "Is ████████ the study of plants or the worship of animals?"
    },
    {
        "word": "zoopraxiscope",
        "meaning": "An early device for displaying moving images, considered an ancestor of the movie projector.",
        "sentences": ["The inventor used a zoopraxiscope to show a short loop of a horse galloping."],
        "vocabulary_question": "Is a █████████████ a modern digital camera or an early device for showing moving images?"
    },
    {
        "word": "zootomy",
        "meaning": "The anatomy of animals, especially as a subject of study.",
        "sentences": ["In her zootomy lab, she studied the muscle structures of different mammal species."],
        "vocabulary_question": "Is ████████ the study of human history or the study of animal anatomy?"
    },
    {
        "word": "zooty",
        "meaning": "Flashy; fashionable in a way that is extravagant or bold.",
        "sentences": ["He wore a zooty suit with bright pinstripes and a wide-brimmed hat."],
        "vocabulary_question": "Is a █████ outfit very plain and boring or flashy and extravagant?"
    },
    {
        "word": "zori",
        "meaning": "A type of Japanese thonged sandal made of straw, leather, or wood.",
        "sentences": ["She slipped on her wooden zori before stepping out into the garden."],
        "vocabulary_question": "Is a ████ a type of heavy winter coat or a Japanese thonged sandal?"
    },
    {
        "word": "zowie",
        "meaning": "An exclamation used to express astonishment or admiration.",
        "sentences": ["'Zowie! Did you see how far that ball flew?' he shouted."],
        "vocabulary_question": "Is █████ used to express boredom or to express astonishment and admiration?"
    },
    {
        "word": "zurna",
        "meaning": "A woodwind instrument used in the folk music of many Eurasian countries.",
        "sentences": ["The musician played a loud, shrill melody on the zurna during the festival."],
        "vocabulary_question": "Is a █████ a type of brass trumpet or a woodwind folk instrument?"
    },
    {
        "word": "zygote",
        "meaning": "A diploid cell resulting from the fusion of two haploid gametes; a fertilized ovum.",
        "sentences": ["The life of the organism begins as a single zygote."],
        "vocabulary_question": "Is a ██████ a fully grown adult or a single cell formed by the union of two gametes?"
    }

];
export default TWO_BEE_WORDS;
