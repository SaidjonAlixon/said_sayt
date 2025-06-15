// Default data for the application
export const defaultUsers = [
  {
    id: 'admin-1',
    fullName: 'TestBlok Admin',
    email: 'adminblock01@ali.com',
    phone: '+998901234567',
    role: 'admin',
    isBlocked: false,
    freeTestUsed: false,
    testAttempts: 0,
    maxTestAttempts: -1,
    allowedDirections: [],
    createdAt: new Date().toISOString(),
  }
];

export const defaultPasswords = {
  'adminblock01@ali.com': '12345BlokTest!'
};

export const defaultDirections = [
  {
    id: 'direction-1',
    name: 'Texnika yo\'nalishi',
    description: 'Muhandislik va texnika sohalari uchun',
    isActive: true,
    isFree: true,
    price: 0,
    subjects: [
      {
        id: 'subject-1-1',
        name: 'Matematika',
        type: 'main',
        questionCount: 30,
        pointsPerQuestion: 3.1,
        questions: [
          {
            id: 'math-1',
            text: '2x + 5 = 13 tenglamaning yechimi qanday?',
            options: { A: 'x = 4', B: 'x = 6', C: 'x = 8', D: 'x = 9' },
            correctAnswer: 'A',
            subject: 'Matematika',
            points: 3.1,
            difficulty: 'medium'
          },
          {
            id: 'math-2',
            text: 'Agar a = 3, b = 4 bo\'lsa, a² + b² ning qiymati nechaga teng?',
            options: { A: '7', B: '12', C: '25', D: '49' },
            correctAnswer: 'C',
            subject: 'Matematika',
            points: 3.1,
            difficulty: 'medium'
          },
          {
            id: 'math-3',
            text: 'Sin 30° ning qiymati nechaga teng?',
            options: { A: '1/2', B: '√3/2', C: '√2/2', D: '1' },
            correctAnswer: 'A',
            subject: 'Matematika',
            points: 3.1,
            difficulty: 'hard'
          },
          {
            id: 'math-4',
            text: 'Kvadrat tenglamaning diskriminanti qanday hisoblanadi?',
            options: { A: 'b² - 4ac', B: 'b² + 4ac', C: '4ac - b²', D: 'a² + b² + c²' },
            correctAnswer: 'A',
            subject: 'Matematika',
            points: 3.1,
            difficulty: 'medium'
          },
          {
            id: 'math-5',
            text: 'Cos 60° ning qiymati nechaga teng?',
            options: { A: '1/2', B: '√3/2', C: '√2/2', D: '1' },
            correctAnswer: 'A',
            subject: 'Matematika',
            points: 3.1,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'subject-1-2',
        name: 'Fizika',
        type: 'main',
        questionCount: 30,
        pointsPerQuestion: 2.1,
        questions: [
          {
            id: 'phys-1',
            text: 'Yorug\'lik tezligi vakuumda qancha?',
            options: { A: '3×10⁸ m/s', B: '3×10⁶ m/s', C: '3×10⁷ m/s', D: '3×10⁹ m/s' },
            correctAnswer: 'A',
            subject: 'Fizika',
            points: 2.1,
            difficulty: 'easy'
          },
          {
            id: 'phys-2',
            text: 'Nyutonning birinchi qonuni nima haqida?',
            options: { A: 'Kuch', B: 'Inersiya', C: 'Tezlanish', D: 'Energiya' },
            correctAnswer: 'B',
            subject: 'Fizika',
            points: 2.1,
            difficulty: 'medium'
          },
          {
            id: 'phys-3',
            text: 'Gravitatsiya tezlanishi Yerda qancha?',
            options: { A: '9.8 m/s²', B: '10 m/s²', C: '8.9 m/s²', D: '11 m/s²' },
            correctAnswer: 'A',
            subject: 'Fizika',
            points: 2.1,
            difficulty: 'easy'
          }
        ]
      },
      {
        id: 'subject-1-3',
        name: 'Ona tili',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: [
          {
            id: 'lang-1',
            text: 'O\'zbek tilida nechta unli tovush bor?',
            options: { A: '5', B: '6', C: '7', D: '8' },
            correctAnswer: 'B',
            subject: 'Ona tili',
            points: 1.1,
            difficulty: 'easy'
          },
          {
            id: 'lang-2',
            text: 'O\'zbek alifbosida nechta harf bor?',
            options: { A: '32', B: '33', C: '34', D: '35' },
            correctAnswer: 'A',
            subject: 'Ona tili',
            points: 1.1,
            difficulty: 'easy'
          }
        ]
      },
      {
        id: 'subject-1-4',
        name: 'Tarix',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: [
          {
            id: 'hist-1',
            text: 'O\'zbekiston mustaqillik e\'lon qilgan sana?',
            options: { A: '1990-yil', B: '1991-yil', C: '1992-yil', D: '1993-yil' },
            correctAnswer: 'B',
            subject: 'Tarix',
            points: 1.1,
            difficulty: 'easy'
          },
          {
            id: 'hist-2',
            text: 'Amir Temur qaysi asrda yashagan?',
            options: { A: 'XIII asr', B: 'XIV asr', C: 'XV asr', D: 'XVI asr' },
            correctAnswer: 'B',
            subject: 'Tarix',
            points: 1.1,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'subject-1-5',
        name: 'Ingliz tili',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: [
          {
            id: 'eng-1',
            text: 'What is the capital of Uzbekistan?',
            options: { A: 'Samarkand', B: 'Bukhara', C: 'Tashkent', D: 'Khiva' },
            correctAnswer: 'C',
            subject: 'Ingliz tili',
            points: 1.1,
            difficulty: 'easy'
          },
          {
            id: 'eng-2',
            text: 'How do you say "Salom" in English?',
            options: { A: 'Goodbye', B: 'Hello', C: 'Thank you', D: 'Please' },
            correctAnswer: 'B',
            subject: 'Ingliz tili',
            points: 1.1,
            difficulty: 'easy'
          }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'direction-2',
    name: 'Tibbiyot yo\'nalishi',
    description: 'Tibbiyot va farmatsevtika sohalari uchun',
    isActive: true,
    isFree: false,
    price: 15000,
    subjects: [
      {
        id: 'subject-2-1',
        name: 'Biologiya',
        type: 'main',
        questionCount: 30,
        pointsPerQuestion: 3.1,
        questions: [
          {
            id: 'bio-1',
            text: 'Hujayra yadrosi qaysi organoidda joylashgan?',
            options: { A: 'Sitoplazma', B: 'Mitoxondriya', C: 'Yadro', D: 'Ribosoma' },
            correctAnswer: 'C',
            subject: 'Biologiya',
            points: 3.1,
            difficulty: 'easy'
          },
          {
            id: 'bio-2',
            text: 'Fotosintez jarayoni qayerda sodir bo\'ladi?',
            options: { A: 'Ildiz', B: 'Poya', C: 'Barg', D: 'Gul' },
            correctAnswer: 'C',
            subject: 'Biologiya',
            points: 3.1,
            difficulty: 'medium'
          },
          {
            id: 'bio-3',
            text: 'DNK ning to\'liq nomi nima?',
            options: { A: 'Deoksiribonuklein kislota', B: 'Ribonuklein kislota', C: 'Amino kislota', D: 'Yog\' kislotasi' },
            correctAnswer: 'A',
            subject: 'Biologiya',
            points: 3.1,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'subject-2-2',
        name: 'Kimyo',
        type: 'main',
        questionCount: 30,
        pointsPerQuestion: 2.1,
        questions: [
          {
            id: 'chem-1',
            text: 'Suvning kimyoviy formulasi qanday?',
            options: { A: 'H₂O', B: 'CO₂', C: 'NaCl', D: 'O₂' },
            correctAnswer: 'A',
            subject: 'Kimyo',
            points: 2.1,
            difficulty: 'easy'
          },
          {
            id: 'chem-2',
            text: 'Kislorodning atom raqami nechaga teng?',
            options: { A: '6', B: '7', C: '8', D: '9' },
            correctAnswer: 'C',
            subject: 'Kimyo',
            points: 2.1,
            difficulty: 'easy'
          },
          {
            id: 'chem-3',
            text: 'Mendeleyev jadvalida nechta element bor?',
            options: { A: '108', B: '118', C: '128', D: '138' },
            correctAnswer: 'B',
            subject: 'Kimyo',
            points: 2.1,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'subject-2-3',
        name: 'Ona tili',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: [
          {
            id: 'lang-3',
            text: 'O\'zbek tilida nechta undosh tovush bor?',
            options: { A: '20', B: '22', C: '24', D: '26' },
            correctAnswer: 'D',
            subject: 'Ona tili',
            points: 1.1,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'subject-2-4',
        name: 'Tarix',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: [
          {
            id: 'hist-3',
            text: 'Buyuk Ipak yo\'li qaysi davlatlarni bog\'lagan?',
            options: { A: 'Sharq va G\'arb', B: 'Shimol va Janub', C: 'Evropa va Afrika', D: 'Amerika va Osiyo' },
            correctAnswer: 'A',
            subject: 'Tarix',
            points: 1.1,
            difficulty: 'medium'
          }
        ]
      },
      {
        id: 'subject-2-5',
        name: 'Ingliz tili',
        type: 'mandatory',
        questionCount: 10,
        pointsPerQuestion: 1.1,
        questions: [
          {
            id: 'eng-3',
            text: 'What does "doctor" mean in Uzbek?',
            options: { A: 'Muhandis', B: 'Shifokor', C: 'O\'qituvchi', D: 'Advokat' },
            correctAnswer: 'B',
            subject: 'Ingliz tili',
            points: 1.1,
            difficulty: 'easy'
          }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const defaultNotifications = [
  {
    id: 'notif-1',
    title: 'Xush kelibsiz!',
    message: 'TestBlok.uz platformasiga xush kelibsiz! Birinchi testingizni bepul ishlang.',
    type: 'info',
    isRead: false,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    title: 'Yangi yo\'nalish qo\'shildi',
    message: 'Texnika yo\'nalishi bo\'yicha bepul test mavjud',
    type: 'test_available',
    isRead: false,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];