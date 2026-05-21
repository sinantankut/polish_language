import { LessonUnit } from "./types";

export const POLISH_LESSONS: LessonUnit[] = [
  {
    id: "basics",
    title: "Podstawy i Wymowa",
    englishTitle: "Basics & Pronunciation",
    category: "Basics",
    grammarConcept: "The most core Polish social greetings, personal pronouns, and the basic present tense of 'to be' (być).",
    grammarFocus: "Present tense of BYĆ (to be): Ja jestem (I am), Ty jesteś (you are), On/Ona/Ono jest (he/she/it is), My jesteśmy (we are), Wy jesteście (you-all are), Oni/One są (they are).",
    grammarExplanation: "Polish is highly phonetic, which means spelling is extremely consistent. Pronunciation key pairs: 'sz' sounds like 'sh' in 'shoe', 'cz' sounds like 'ch' in 'check', 'rz'/'ż' sounds like 's' in 'treasure', and 'ć'/'ci' is a soft 'ch'. Letters like 'ł' sound like 'w' in 'water', and 'w' itself sounds like English 'v'. In Polish, pronouns can often be omitted because the verb ending already indicates who is speaking! For example, instead of 'Ja jestem z Anglii', you can simply say 'Jestem z Anglii'.",
    words: [
      {
        polish: "Cześć",
        english: "Hello / Hi / Bye",
        category: "Greetings",
        pronunciation: "cheshch",
        examplePolish: "Cześć, co słychać?",
        exampleEnglish: "Hi, what's up?"
      },
      {
        polish: "Dzień dobry",
        english: "Good morning / Good afternoon",
        category: "Greetings",
        pronunciation: "jeen-doh-bree",
        examplePolish: "Dzień dobry, pani Anno.",
        exampleEnglish: "Good morning, Mrs. Anna."
      },
      {
        polish: "Dziękuję",
        english: "Thank you",
        category: "Phrases",
        pronunciation: "jen-koo-yeh",
        examplePolish: "Dziękuję bardzo za kawę.",
        exampleEnglish: "Thank you very much for the coffee."
      },
      {
        polish: "Proszę",
        english: "Please / You are welcome / Here you go",
        category: "Phrases",
        pronunciation: "proh-sheh",
        examplePolish: "Proszę bardzo, oto herbata.",
        exampleEnglish: "You are very welcome, here is the tea."
      },
      {
        polish: "Przepraszam",
        english: "Sorry / Excuse me",
        category: "Phrases",
        pronunciation: "psheh-prah-shahm",
        examplePolish: "Przepraszam, gdzie jest łazienka?",
        exampleEnglish: "Excuse me, where is the bathroom?"
      },
      {
        polish: "Tak",
        english: "Yes",
        category: "Basics",
        pronunciation: "tahk",
        examplePolish: "Tak, jestem studentem.",
        exampleEnglish: "Yes, I am a student."
      },
      {
        polish: "Nie",
        english: "No / Not",
        category: "Basics",
        pronunciation: "nyeh",
        examplePolish: "Nie, dziękuję, nie piję kawy.",
        exampleEnglish: "No, thank you, I do not drink coffee."
      },
      {
        polish: "Jestem",
        english: "I am (from 'być')",
        category: "Verbs",
        pronunciation: "yes-tehm",
        examplePolish: "Jestem z Londynu.",
        exampleEnglish: "I am from London."
      }
    ],
    exercises: [
      {
        id: "basics-1",
        type: "multiple-choice",
        instruction: "Choose the correct informal Polish translation for 'Hello' or 'Hi'.",
        englishPrompt: "Hello",
        options: ["Dzień dobry", "Przepraszam", "Cześć", "Dziękuję"],
        correctAnswer: "Cześć",
        grammarHint: "'Cześć' is used informally for both hi and bye! Pronounce it as 'cheshch'."
      },
      {
        id: "basics-2",
        type: "fill-in-the-blank",
        instruction: "Fill in the blank to complete 'Good morning / Good afternoon'.",
        sentence: "Dzień ___",
        englishPrompt: "Good morning / afternoon",
        options: ["dobry", "dziękuję", "cześć", "proszę"],
        correctAnswer: "dobry",
        grammarHint: "'Dzień' means day, and 'dobry' means good. Together they make up 'Good morning' or 'Good afternoon'."
      },
      {
        id: "basics-3",
        type: "reorder",
        instruction: "Arrange the words to say 'Thank you very much'.",
        englishPrompt: "Thank you very much",
        options: ["bardzo", "Dziękuję"],
        correctAnswer: "Dziękuję bardzo",
        grammarHint: "'Dziękuję' means 'Thank you' and 'bardzo' is 'very/very much'."
      }
    ]
  },
  {
    id: "gender",
    title: "Rodzaj i Zaimki",
    englishTitle: "Noun Gender & Dem. Pronouns",
    category: "Nouns & Gender",
    grammarConcept: "Grammatical gender in Polish (Masculine, Feminine, Neuter) and matching word endings.",
    grammarFocus: "Subject Demonstratives: TEN (this, masculine), TA (this, feminine), TO (this, neuter). Singular noun endings rule of thumb.",
    grammarExplanation: "Unlike English, every noun in Polish has a grammatical gender: Masculine, Feminine, or Neuter. This affects adjectives, pronouns, and verbs. \n- **Masculine** nouns usually end in a consonant (chleb, pies, dom).\n- **Feminine** nouns usually end in '-a' (kobieta, woda, kawa).\n- **Neuter** nouns usually end in '-o', '-e', or '-ę' (jabłko, dziecko, okno, imię).\nNotice how 'this' changes to match: 'ten pies' (masculine), 'ta woda' (feminine), 'to jabłko' (neuter).",
    words: [
      {
        polish: "Kobieta",
        english: "Woman",
        category: "People",
        gender: "feminine",
        pronunciation: "koh-byeh-tah",
        examplePolish: "Ta kobieta jest nauczycielką.",
        exampleEnglish: "This woman is a teacher."
      },
      {
        polish: "Mężczyzna",
        english: "Man",
        category: "People",
        gender: "masculine", // despite ending in -a, it's logically masculine
        pronunciation: "menzh-chiz-nah",
        examplePolish: "Ten mężczyzna pije wodę.",
        exampleEnglish: "This man is drinking water."
      },
      {
        polish: "Chleb",
        english: "Bread",
        category: "Food",
        gender: "masculine",
        pronunciation: "hlep",
        examplePolish: "Ten chleb jest świeży.",
        exampleEnglish: "This bread is fresh."
      },
      {
        polish: "Woda",
        english: "Water",
        category: "Drinks",
        gender: "feminine",
        pronunciation: "voh-dah",
        examplePolish: "Zimna woda jest dobra.",
        exampleEnglish: "Cold water is good."
      },
      {
        polish: "Jabłko",
        english: "Apple",
        category: "Food",
        gender: "neuter",
        pronunciation: "yabw-koh",
        examplePolish: "To jabłko jest czerwone.",
        exampleEnglish: "This apple is red."
      },
      {
        polish: "Pies",
        english: "Dog",
        category: "Animals",
        gender: "masculine",
        pronunciation: "pyes",
        examplePolish: "Mój pies ma na imię Burek.",
        exampleEnglish: "My dog is named Burek."
      }
    ],
    exercises: [
      {
        id: "gender-1",
        type: "multiple-choice",
        instruction: "What is the grammatical gender of the word 'jabłko' (apple)?",
        englishPrompt: "apple",
        options: ["Masculine", "Feminine", "Neuter", "It has no gender"],
        correctAnswer: "Neuter",
        grammarHint: "'Jabłko' ends in '-o', which is the dominant ending for singular Neuter nouns in Polish."
      },
      {
        id: "gender-2",
        type: "fill-in-the-blank",
        instruction: "Select the correct form of the word 'this' to match the feminine word 'woda' (water).",
        sentence: "___ woda",
        englishPrompt: "this water",
        options: ["Ten", "Ta", "To", "Te"],
        correctAnswer: "Ta",
        grammarHint: "Demonstrative pronouns must match the noun. Use 'ta' for feminine nouns like 'woda'."
      },
      {
        id: "gender-3",
        type: "reorder",
        instruction: "Arrange these words to make: 'This man is eating bread'.",
        englishPrompt: "This man is eating bread",
        options: ["mężczyzna", "chleb", "Ten", "je"],
        correctAnswer: "Ten mężczyzna je chleb",
        grammarHint: "'Ten' matches the masculine 'mężczyzna', 'je' is 'eats/is eating', and 'chleb' is 'bread'."
      }
    ]
  },
  {
    id: "accusative",
    title: "Codzienne przedmioty i Biernik",
    englishTitle: "Objects & The Accusative Case",
    category: "Accusative Case",
    grammarConcept: "Understanding the Accusative case (Biernik) used for direct objects in positive sentences.",
    grammarFocus: "Feminine nouns: change -a to -ę in Accusative (np. woda -> wodę, kawa -> kawę). Masculine inanimate nouns stay unchanged.",
    grammarExplanation: "Whenever an action directly impacts a noun, we place that noun in the Accusative Case (*Biernik*). This answers the questions 'Kogo? Co?' (Whom? What?). Verbs like *mieć* (to have), *pić* (to drink), *jeść* (to eat), *kochać* (to love), and *widzieć* (to see) require the Accusative!\n- **Feminine nouns** ending in '-a' cleanly swap to '-ę' (e.g., Kawa -> piję *kawę*, Książka -> czytam *książkę*).\n- **Masculine inanimate** (objects like *samochód*, *chleb*) and **Neuter nouns** (*jabłko*) do NOT change their spelling in the Accusative! (e.g. Mam *chleb*).\n- **Masculine animate** (living beings like *pies*) change to end in '-a' (e.g., pies -> mam *psa*, kot -> widzę *kota*).",
    words: [
      {
        polish: "Kawa",
        english: "Coffee",
        category: "Drinks",
        gender: "feminine",
        pronunciation: "kah-vah",
        examplePolish: "Rano piję mocną kawę.",
        exampleEnglish: "In the morning I drink strong coffee."
      },
      {
        polish: "Herbata",
        english: "Tea",
        category: "Drinks",
        gender: "feminine",
        pronunciation: "her-bah-tah",
        examplePolish: "Czy pijesz herbatę z cytryną?",
        exampleEnglish: "Do you drink tea with lemon?"
      },
      {
        polish: "Książka",
        english: "Book",
        category: "Objects",
        gender: "feminine",
        pronunciation: "kshonzh-kah",
        examplePolish: "Czytam polską książkę.",
        exampleEnglish: "I am reading a Polish book."
      },
      {
        polish: "Kot",
        english: "Cat",
        category: "Animals",
        gender: "masculine",
        pronunciation: "koht",
        examplePolish: "Mój brat ma czarnego kota.",
        exampleEnglish: "My brother has a black cat."
      },
      {
        polish: "Samochód",
        english: "Car",
        category: "Objects",
        gender: "masculine",
        pronunciation: "sah-moh-hoot",
        examplePolish: "Widzę nowy samochód.",
        exampleEnglish: "I see a new car."
      }
    ],
    exercises: [
      {
        id: "accusative-1",
        type: "fill-in-the-blank",
        instruction: "Which is the correct Accusative spelling for 'kawa' in: 'I want coffee' (Chcę ___).",
        sentence: "Chcę ___",
        englishPrompt: "I want coffee",
        options: ["kawy", "kawę", "kawą", "kawa"],
        correctAnswer: "kawę",
        grammarHint: "'Kawa' is a feminine noun ending in '-a'. In the Accusative case, feminine nouns ending in '-a' change to '-ę'!"
      },
      {
        id: "accusative-2",
        type: "multiple-choice",
        instruction: "Which sentence is grammatically correct to say 'I have a cat'?",
        englishPrompt: "I have a cat",
        options: ["Mam kot", "Mam kotem", "Mam kota", "Mam koty"],
        correctAnswer: "Mam kota",
        grammarHint: "For masculine animate nouns (like 'kot'), the Accusative form adds an '-a' suffix, turning 'kot' into 'kota'."
      },
      {
        id: "accusative-3",
        type: "reorder",
        instruction: "Arrange the words to translate 'I have a book'.",
        englishPrompt: "I have a book",
        options: ["książkę", "Mam"],
        correctAnswer: "Mam książkę",
        grammarHint: "'Książka' becomes 'książkę' in the Accusative, and 'Mam' means 'I have'."
      }
    ]
  },
  {
    id: "genitive",
    title: "Jedzenie, picie i Dopełniacz",
    englishTitle: "Food, Drinks & The Genitive Case",
    category: "Genitive Case",
    grammarConcept: "The Genitive case (Dopełniacz) for negation, possession, and quantities.",
    grammarFocus: "Direct negation: When 'nie mam' (I don't have) is used, the direct object is placed in the Genitive.",
    grammarExplanation: "The Genitive Case (*Dopełniacz*) is Polish's most common case. It answers 'Kogo? Czego?' (Whom/What is missing?). It has three major trigger zones:\n1. **Negation**: Whenever an action in the Accusative is negated, the noun becomes Genitive! 'Mam *kawę*' (Acc.) -> 'Nie mam *kawy*' (Gen.).\n2. **Possession**: E.g., 'auto mojego brata' (the car of my brother).\n3. **Quantities & Numbers**: 'dużo chleba' (a lot of bread), 'mało wody' (little water).\n\n**Ending changes in Genitive:**\n- **Feminine**: -a swaps to **-y** or **-i** (kawa -> kawy, woda -> wody).\n- **Masculine/Neuter**: usually swaps to **-a** or **-u** (chleb -> chleba, mleko -> mleka, sok -> soku).",
    words: [
      {
        polish: "Mleko",
        english: "Milk",
        category: "Drinks",
        gender: "neuter",
        pronunciation: "mleh-koh",
        examplePolish: "Nie lubię mleka.",
        exampleEnglish: "I do not like milk."
      },
      {
        polish: "Miód",
        english: "Honey",
        category: "Food",
        gender: "masculine",
        pronunciation: "myoot",
        examplePolish: "Dodaję dużo miodu do herbaty.",
        exampleEnglish: "I add a lot of honey to the tea."
      },
      {
        polish: "Ser",
        english: "Cheese",
        category: "Food",
        gender: "masculine",
        pronunciation: "sehr",
        examplePolish: "Nie jem sera.",
        exampleEnglish: "I do not eat cheese."
      },
      {
        polish: "Zupa",
        english: "Soup",
        category: "Food",
        gender: "feminine",
        pronunciation: "zoo-pah",
        examplePolish: "To jest talerz ciepłej zupy.",
        exampleEnglish: "This is a plate of warm soup."
      }
    ],
    exercises: [
      {
        id: "genitive-1",
        type: "fill-in-the-blank",
        instruction: "Select the correct spelling of 'milk' in this negative sentence: 'I am not drinking milk'.",
        sentence: "Nie piję ___",
        englishPrompt: "I am not drinking milk",
        options: ["mleko", "mlekem", "mleka", "mlekoę"],
        correctAnswer: "mleka",
        grammarHint: "'Mleko' is neuter. In positive sentences it's Accusative ('piję mleko'), but in negative sentences it becomes Genitive ('nie piję mleka')."
      },
      {
        id: "genitive-2",
        type: "multiple-choice",
        instruction: "Complete the negation: 'I do not have a car' (Nie mam ___).",
        englishPrompt: "I do not have a car",
        options: ["samochód", "samochodem", "samochodu", "samochoda"],
        correctAnswer: "samochodu",
        grammarHint: "Accusative 'Mam samochód' changes to Genitive 'Nie mam samochodu' when negated. Many masculine inanimate objects take the '-u' ending."
      },
      {
        id: "genitive-3",
        type: "reorder",
        instruction: "Order the words to say 'I don't drink water' (Note Genitive form!).",
        englishPrompt: "I don't drink water",
        options: ["wody", "piję", "Nie"],
        correctAnswer: "Nie piję wody",
        grammarHint: "Negation of 'piję wodę' (Acc.) forces Genitive: 'Nie piję wody'."
      }
    ]
  },
  {
    id: "instrumental",
    title: "Zawody i Narzędnik",
    englishTitle: "Professions & The Instrumental Case",
    category: "Instrumental Case",
    grammarConcept: "Using the Instrumental case (Narzędnik) to express professions, instrumentalities, and companion prepositions (z).",
    grammarFocus: "Trigger: jest + noun (professions) and preposition 'z' (with). Feminine changes to -ą, Masculine changes to -em.",
    grammarExplanation: "The Instrumental Case (*Narzędnik*) answers 'Kim? Czym?' (With whom? With what?). It is incredibly satisfying because the endings are regular and easy to remember!\n- Used to state nationalities or professions after the verb *być* (to be): *Jestem lekarzem* (I am a doctor).\n- Used with the preposition **z** meaning 'together with' or 'made of': *kawa z mlekiem* (coffee with milk).\n- Used to describe the tool you do an action with: *piszę długopisem* (I write with a pen).\n\n**Endings in Instrumental case:**\n- **Feminine** nouns end in **-ą** (np. nauczycielka -> nauczycielką, lekarka -> lekarką).\n- **Masculine/Neuter** nouns end in **-em** (np. lekarz -> lekarzem, student -> studentem).",
    words: [
      {
        polish: "Nauczyciel",
        english: "Teacher (M)",
        category: "Professions",
        gender: "masculine",
        pronunciation: "now-chih-chehl",
        examplePolish: "Mój ojciec jest nauczycielem.",
        exampleEnglish: "My father is a teacher."
      },
      {
        polish: "Nauczycielka",
        english: "Teacher (F)",
        category: "Professions",
        gender: "feminine",
        pronunciation: "now-chih-chehl-kah",
        examplePolish: "Ona jest świetną nauczycielką.",
        exampleEnglish: "She is a great teacher."
      },
      {
        polish: "Lekarz",
        english: "Doctor (M)",
        category: "Professions",
        gender: "masculine",
        pronunciation: "leh-kahsh",
        examplePolish: "Chcę być dobrym lekarzem.",
        exampleEnglish: "I want to be a good doctor."
      },
      {
        polish: "Student",
        english: "Student (M)",
        category: "Professions",
        gender: "masculine",
        pronunciation: "stoo-dehnt",
        examplePolish: "Jestem studentem na uniwersytecie.",
        exampleEnglish: "I am a student at the university."
      },
      {
        polish: "Przyjaciel",
        english: "Friend (M)",
        category: "People",
        gender: "masculine",
        pronunciation: "pshih-yah-chehl",
        examplePolish: "Rozmawiam z przyjacielem.",
        exampleEnglish: "I am talking with a friend."
      }
    ],
    exercises: [
      {
        id: "instrumental-1",
        type: "fill-in-the-blank",
        instruction: "Select the correct Instrumental ending for 'Ona jest nauczycielka' (She is a teacher).",
        sentence: "Ona jest ___",
        englishPrompt: "She is a teacher",
        options: ["nauczycielka", "nauczycielką", "nauczycielki", "nauczycielkę"],
        correctAnswer: "nauczycielką",
        grammarHint: "Professions using 'być' trigger the Instrumental case. Feminine singular nouns ending in '-a' change to the nasal vowel '-ą'."
      },
      {
        id: "instrumental-2",
        type: "multiple-choice",
        instruction: "What is the correct way to order 'coffee with milk' in Polish?",
        englishPrompt: "coffee with milk",
        options: ["kawa z mleko", "kawa z mlekem", "kawa z mlekiem", "kawa z mleka"],
        correctAnswer: "kawa z mlekiem",
        grammarHint: "'Z' (with) triggers the Instrumental case. Neuter 'mleko' adds 'em' to become 'mlekiem' (adding an 'i' first to soften the 'k')."
      },
      {
        id: "instrumental-3",
        type: "reorder",
        instruction: "Arrange the words to say 'I am a student' (masculine).",
        englishPrompt: "I am a student",
        options: ["jestem", "studentem"],
        correctAnswer: "jestem studentem",
        grammarHint: "'Jestem' means 'I am', and the profession 'student' takes the Instrumental ending '-em' to become 'studentem'."
      }
    ]
  },
  {
    id: "reservations",
    title: "Rezerwacje i Pokoje",
    englishTitle: "Making Reservations",
    category: "Reservations",
    grammarConcept: "Learn polite requests like 'Chciałbym/Chciałabym' (I would like), checking availability, and Locative structures for staying in hotels.",
    grammarFocus: "Conditional request: Chciałbym (masculine speakers) vs Chciałabym (feminine speakers) + infinitive verb.",
    grammarExplanation: "In Polish, being polite is very easy with conditional forms! 'I would like' is gender-sensitive: males say 'chciałbym' and females say 'chciałabym'. When talking about stays or rooms, look out for 'wolny' (free/vacant) and 'pokój' (room, plural: pokoje). Locative ending is also used after the preposition 'w' (in): 'Jestem w hotelu' (I am in the hotel).",
    words: [
      {
        polish: "Chciałbym",
        english: "I would like (masculine)",
        category: "Phrases",
        pronunciation: "hchiahw-beem",
        examplePolish: "Chciałbym zarezerwować pokój jednoosobowy.",
        exampleEnglish: "I would like to reserve a single room."
      },
      {
        polish: "Chciałabym",
        english: "I would like (feminine)",
        category: "Phrases",
        pronunciation: "hchiahw-ah-beem",
        examplePolish: "Chciałabym klucz do pokoju.",
        exampleEnglish: "I would like the key to the room."
      },
      {
        polish: "Pokój",
        english: "Room",
        category: "Lodging",
        gender: "masculine",
        pronunciation: "poh-kooy",
        examplePolish: "Ten pokój jest bardzo przestronny.",
        exampleEnglish: "This room is very spacious."
      },
      {
        polish: "Rezerwacja",
        english: "Reservation",
        category: "Lodging",
        gender: "feminine",
        pronunciation: "reh-zehr-vah-tsyah",
        examplePolish: "Mam rezerwację na nazwisko Smith.",
        exampleEnglish: "I have a reservation under the name Smith."
      },
      {
        polish: "Wolny",
        english: "Free / Vacant / Available",
        category: "Lodging",
        pronunciation: "vohl-nee",
        examplePolish: "Czy mają Państwo wolne pokoje?",
        exampleEnglish: "Do you have any available rooms?"
      },
      {
        polish: "Hotel",
        english: "Hotel",
        category: "Lodging",
        gender: "masculine",
        pronunciation: "hoh-tehl",
        examplePolish: "Nasz hotel jest blisko centrum.",
        exampleEnglish: "Our hotel is close to the city center."
      },
      {
        polish: "Klucz",
        english: "Key",
        category: "Objects",
        gender: "masculine",
        pronunciation: "klooch",
        examplePolish: "Proszę oddać klucz w recepcji.",
        exampleEnglish: "Please return the key at the reception."
      }
    ],
    exercises: [
      {
        id: "reservations-1",
        type: "fill-in-the-blank",
        instruction: "Which is the correct 'I would like' for a feminine speaker in: '___ zarezerwować pokój'.",
        sentence: "___ zarezerwować pokój.",
        englishPrompt: "I would like (F) to reserve a room.",
        options: ["Chciałbym", "Chciałabym", "Chcę", "Chcielibyśmy"],
        correctAnswer: "Chciałabym",
        grammarHint: "Feminine conditional ends with '-abym'. Male speakers would say 'Chciałbym'."
      },
      {
        id: "reservations-2",
        type: "multiple-choice",
        instruction: "How do you ask 'Is this room available?' in Polish?",
        englishPrompt: "Is this room available?",
        options: ["Czy ten pokój jest wolny?", "Czy to piwo jest zimne?", "Gdzie jest hotel?", "Mam wolny pokój."],
        correctAnswer: "Czy ten pokój jest wolny?",
        grammarHint: "'Czy' is the question particle, 'ten pokój' is this room (masculine) and 'wolny' means free or available."
      },
      {
        id: "reservations-3",
        type: "reorder",
        instruction: "Arrange the words to say 'I have a reservation'.",
        englishPrompt: "I have a reservation",
        options: ["rezerwację", "Mam"],
        correctAnswer: "Mam rezerwację",
        grammarHint: "'Mam' means I have, and 'rezerwacja' is converted into the Accusative case ending in '-ę'."
      }
    ]
  },
  {
    id: "numbers-time",
    title: "Liczby, Dni i Pory Roku",
    englishTitle: "Numbers, Days, & Seasons",
    category: "Numbers & Calendars",
    grammarConcept: "Learn the numerical scale (1-10), days of the week, and names of the four seasons in Polish.",
    grammarFocus: "Gender agreements with numbers and correct capitalized formatting (days/seasons are NOT capitalized in sentences!).",
    grammarExplanation: "Unlike English, weekdays and seasons in Polish are NOT capitalized when used in a sentence (e.g. 'we wtorek' - on Tuesday, 'lato' - summer). Let's review standard words for counts, days, and climate cycles.",
    words: [
      {
        polish: "Jeden",
        english: "One",
        category: "Numbers",
        pronunciation: "yeh-dehn",
        examplePolish: "Poproszę jeden chleb.",
        exampleEnglish: "One bread, please."
      },
      {
        polish: "Dwa",
        english: "Two",
        category: "Numbers",
        pronunciation: "dvah",
        examplePolish: "Mam dwa psy.",
        exampleEnglish: "I have two dogs."
      },
      {
        polish: "Trzy",
        english: "Three",
        category: "Numbers",
        pronunciation: "tshih",
        examplePolish: "Trzy kawy poproszęsz.",
        exampleEnglish: "Three coffees, please."
      },
      {
        polish: "Poniedziałek",
        english: "Monday",
        category: "Days",
        pronunciation: "poh-nyeh-jah-wek",
        examplePolish: "W poniedziałek idę do pracy.",
        exampleEnglish: "On Monday I go to work."
      },
      {
        polish: "Piątek",
        english: "Friday",
        category: "Days",
        pronunciation: "pyon-tehk",
        examplePolish: "Piątek to mój ulubiony dzień.",
        exampleEnglish: "Friday is my favorite day."
      },
      {
        polish: "Wiosna",
        english: "Spring",
        category: "Seasons",
        gender: "feminine",
        pronunciation: "vyohs-nah",
        examplePolish: "Wiosna przynosi piękne kwiaty.",
        exampleEnglish: "Spring brings beautiful flowers."
      },
      {
        polish: "Lato",
        english: "Summer",
        category: "Seasons",
        gender: "neuter",
        pronunciation: "lah-toh",
        examplePolish: "Lubię gorące lato.",
        exampleEnglish: "I like hot summer."
      },
      {
        polish: "Jesień",
        english: "Autumn / Fall",
        category: "Seasons",
        gender: "feminine",
        pronunciation: "yeh-shehn",
        examplePolish: "Jesień jest złota w Polsce.",
        exampleEnglish: "Autumn is golden in Poland."
      },
      {
        polish: "Zima",
        english: "Winter",
        category: "Seasons",
        gender: "feminine",
        pronunciation: "zee-mah",
        examplePolish: "Zima w górach ma dużo śniegu.",
        exampleEnglish: "Winter in the mountains has lots of snow."
      }
    ],
    exercises: [
      {
        id: "numbers-1",
        type: "fill-in-the-blank",
        instruction: "Fill in the starting digit 'One' in '___, dwa, trzy':",
        sentence: "___, dwa, trzy.",
        englishPrompt: "One, two, three.",
        options: ["Jeden", "Mleko", "Piątek", "Dwa"],
        correctAnswer: "Jeden",
        grammarHint: "'Jeden' is the Polish word for the first cardinal number 1."
      },
      {
        id: "numbers-2",
        type: "multiple-choice",
        instruction: "What is the Polish word for 'Friday'?",
        englishPrompt: "Friday",
        options: ["Poniedziałek", "Piątek", "Jesień", "Wiosna"],
        correctAnswer: "Piątek",
        grammarHint: "'Piątek' translates to Friday (notice it is not capitalized in standard body sentences!)."
      },
      {
        id: "numbers-3",
        type: "reorder",
        instruction: "Arrange these seasons in order: 'Spring, Summer, Autumn, Winter'.",
        englishPrompt: "Spring, Summer, Autumn, Winter",
        options: ["Zima", "Jesień", "Lato", "Wiosna"],
        correctAnswer: "Wiosna Lato Jesień Zima",
        grammarHint: "Separate these Polish seasons starting with spring. In lists they flow: Wiosna, Lato, Jesień, Zima!"
      }
    ]
  }
];
