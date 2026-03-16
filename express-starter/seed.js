import { Course, connectDB } from './models.js';

const courses = [
  // ── CSE ───────────────────────────────────────────────────────────────────
  { department: 'CSE',  courseNumber: '121', title: 'Introduction to Computer Programming I',    credits: 4, description: 'Introduction to programming for beginners. Covers procedures, control structures, loops, conditionals, and arrays.' },
  { department: 'CSE',  courseNumber: '122', title: 'Introduction to Computer Programming II',   credits: 4, description: 'Program design and decomposition using data structures like lists, dictionaries, and sets.' },
  { department: 'CSE',  courseNumber: '123', title: 'Introduction to Computer Programming III',  credits: 4, description: 'Linked references, recursion, and object-oriented inheritance for solving complex problems.' },
  { department: 'CSE',  courseNumber: '154', title: 'Web Programming',                           credits: 5, description: 'Languages and tools for building interactive web pages, including client/server scripting and databases.' },
  { department: 'CSE',  courseNumber: '311', title: 'Foundations of Computing I',                credits: 4, description: 'Logic, set theory, induction, algebraic structures, finite state machines, and limits of computability.' },
  { department: 'CSE',  courseNumber: '312', title: 'Foundations of Computing II',               credits: 4, description: 'Discrete probability, randomness in computing, polynomial-time vs NP, and NP-completeness.' },
  { department: 'CSE',  courseNumber: '331', title: 'Software Design and Implementation',        credits: 4, description: 'Specifications, program design, correctness approaches including testing, and event-driven programming.' },
  { department: 'CSE',  courseNumber: '332', title: 'Data Structures and Parallelism',           credits: 4, description: 'Abstract data types, balanced trees, hash tables, graphs, sorting, and parallel algorithms.' },
  { department: 'CSE',  courseNumber: '333', title: 'Systems Programming',                       credits: 4, description: 'C and C++ programming, explicit memory management, OS services, and concurrent programming.' },
  { department: 'CSE',  courseNumber: '351', title: 'The Hardware/Software Interface',           credits: 4, description: 'Number representation, assembly language, C, memory management, and the memory hierarchy.' },
  { department: 'CSE',  courseNumber: '403', title: 'Software Engineering',                      credits: 4, description: 'Group software project covering requirements, design, testing, process, and tools.' },
  { department: 'CSE',  courseNumber: '414', title: 'Introduction to Database Systems',          credits: 4, description: 'Database management systems, SQL, data models, transactions, and data warehousing.' },
  { department: 'CSE',  courseNumber: '416', title: 'Introduction to Machine Learning',          credits: 4, description: 'Practical machine learning: regression, classification, clustering, recommender systems, and deep learning.' },
  { department: 'CSE',  courseNumber: '421', title: 'Introduction to Algorithms',                credits: 3, description: 'Techniques for designing efficient algorithms, lower bounds, sorting, graphs, and pattern matching.' },
  { department: 'CSE',  courseNumber: '446', title: 'Machine Learning',                          credits: 4, description: 'Supervised and unsupervised learning, deep learning, kernel methods, and optimization.' },
  { department: 'CSE',  courseNumber: '451', title: 'Introduction to Operating Systems',         credits: 4, description: 'Process management, memory management, storage, and resource allocation.' },
  { department: 'CSE',  courseNumber: '473', title: 'Artificial Intelligence',                   credits: 3, description: 'Search, game playing, knowledge representation, uncertainty, and machine learning fundamentals.' },
  { department: 'CSE',  courseNumber: '484', title: 'Computer Security',                         credits: 4, description: 'Software, OS, network, and web security; cryptography, authentication, and anonymity.' },

  // ── MATH ──────────────────────────────────────────────────────────────────
  { department: 'MATH', courseNumber: '120', title: 'Precalculus',                                credits: 5, description: 'Properties and graphs of linear, quadratic, exponential, and trigonometric functions.' },
  { department: 'MATH', courseNumber: '124', title: 'Calculus with Analytic Geometry I',          credits: 5, description: 'Differential calculus of single-variable functions with applications and problem solving.' },
  { department: 'MATH', courseNumber: '125', title: 'Calculus with Analytic Geometry II',         credits: 5, description: 'Integral calculus of single-variable functions with applications.' },
  { department: 'MATH', courseNumber: '126', title: 'Calculus with Analytic Geometry III',        credits: 5, description: 'Taylor series, vector geometry, multivariable differential calculus, and double integrals.' },
  { department: 'MATH', courseNumber: '207', title: 'Introduction to Differential Equations',    credits: 4, description: 'First- and second-order ordinary differential equations and Laplace transforms.' },
  { department: 'MATH', courseNumber: '208', title: 'Matrix Algebra with Applications',          credits: 4, description: 'Linear equations, vector spaces, matrices, orthogonality, eigenvalues, and eigenvectors.' },
  { department: 'MATH', courseNumber: '300', title: 'Introduction to Mathematical Reasoning',    credits: 4, description: 'Mathematical arguments and proof-writing: sets, functions, induction, and combinatorics.' },
  { department: 'MATH', courseNumber: '327', title: 'Introductory Real Analysis I',               credits: 4, description: 'Number systems, sequences, series, continuity, and uniform continuity.' },
  { department: 'MATH', courseNumber: '394', title: 'Probability I',                              credits: 4, description: 'Axiomatic probability, random variables, named distributions, and the law of large numbers.' },
  { department: 'MATH', courseNumber: '395', title: 'Probability II',                             credits: 4, description: 'Joint distributions, covariance, moment generating functions, and the Central Limit Theorem.' },
  { department: 'MATH', courseNumber: '402', title: 'Introduction to Modern Algebra',             credits: 4, description: 'Rings, fields, integers, modular arithmetic, polynomial rings, and quotient rings.' },
  { department: 'MATH', courseNumber: '407', title: 'Linear Optimization',                        credits: 4, description: 'Linear programming, the simplex method, duality, and elementary game theory.' },
  { department: 'MATH', courseNumber: '424', title: 'Fundamental Concepts of Analysis',           credits: 4, description: 'Limits, differentiation, Riemann-Stieltjes integrals, and sequences of functions.' },

  // ── STAT ──────────────────────────────────────────────────────────────────
  { department: 'STAT', courseNumber: '180', title: 'Introduction to Data Science',              credits: 4, description: 'Data collection, cleaning, visualization, statistical inference, and machine learning basics.' },
  { department: 'STAT', courseNumber: '311', title: 'Elements of Statistical Methods',           credits: 5, description: 'Study design, descriptive statistics, probability, hypothesis testing, t-tests, and chi-square tests.' },
  { department: 'STAT', courseNumber: '302', title: 'Statistical Computing',                     credits: 3, description: 'Programming fundamentals, data cleaning, visualization, debugging, and version control using R.' },
  { department: 'STAT', courseNumber: '340', title: 'Introduction to Probability and Mathematical Statistics I', credits: 4, description: 'Probability axioms, random variables, multivariate distributions, and moment generating functions.' },
  { department: 'STAT', courseNumber: '341', title: 'Introduction to Probability and Mathematical Statistics II', credits: 4, description: 'Expectation, CLT, estimation, confidence intervals, and likelihood ratio tests.' },
  { department: 'STAT', courseNumber: '390', title: 'Statistical Methods in Engineering and Science', credits: 4, description: 'Probability, sampling errors, confidence intervals, least squares, and exploratory data analysis.' },
  { department: 'STAT', courseNumber: '391', title: 'Quantitative Introductory Statistics for Data Science', credits: 4, description: 'Statistical models, regression, classification, clustering, PCA, and model validation.' },
  { department: 'STAT', courseNumber: '416', title: 'Introduction to Machine Learning',          credits: 4, description: 'Practical machine learning covering regression, classification, clustering, and recommender systems.' },
  { department: 'STAT', courseNumber: '421', title: 'Applied Statistics and Experimental Design', credits: 4, description: 'Experimental designs including factorial, blocked, and split-plot; fixed and random effects models.' },
  { department: 'STAT', courseNumber: '423', title: 'Applied Regression and Analysis of Variance', credits: 4, description: 'Least squares, simple/multiple linear regression, variable selection, and diagnostics.' },
  { department: 'STAT', courseNumber: '435', title: 'Introduction to Statistical Machine Learning', credits: 4, description: 'Supervised vs. unsupervised learning, cross-validation, regularization, trees, and SVMs.' },
  { department: 'STAT', courseNumber: '451', title: 'Visualizing Data',                          credits: 4, description: 'Visual representations of data using Python and R to discover patterns and communicate findings.' },

  // ── PHYS ──────────────────────────────────────────────────────────────────
  { department: 'PHYS', courseNumber: '121', title: 'Mechanics',                                 credits: 5, description: 'Basic principles of mechanics including kinematics, forces, energy, and momentum for STEM majors.' },
  { department: 'PHYS', courseNumber: '122', title: 'Electromagnetism',                          credits: 5, description: 'Basic principles of electromagnetism and related experiments for STEM majors.' },
  { department: 'PHYS', courseNumber: '123', title: 'Waves, Light, and Heat',                   credits: 5, description: 'Oscillatory motion, EM waves, optics, thermodynamics, and related experiments.' },
  { department: 'PHYS', courseNumber: '224', title: 'Thermal Physics',                          credits: 3, description: 'Heat, thermodynamics, elementary kinetic theory, and statistical physics.' },
  { department: 'PHYS', courseNumber: '225', title: 'Introduction to Quantum Mechanics',        credits: 3, description: 'Two-state systems, spin, and applications in nuclear magnetic resonance.' },
  { department: 'PHYS', courseNumber: '227', title: 'Mathematical Physics I',                   credits: 4, description: 'Applied mathematics in physics: mechanics of particles and continuous systems, analytic and numerical methods.' },
  { department: 'PHYS', courseNumber: '321', title: 'Electromagnetism I',                       credits: 4, description: 'Charges, dielectric and magnetic media, electromagnetic waves, and physical optics.' },
  { department: 'PHYS', courseNumber: '324', title: 'Quantum Mechanics I',                      credits: 4, description: 'Schrödinger equation, operators, angular momentum, the hydrogen atom, and the periodic table.' },
  { department: 'PHYS', courseNumber: '325', title: 'Quantum Mechanics II',                     credits: 4, description: 'Perturbation theory, variational principle, radiation, and applications in atomic physics.' },
  { department: 'PHYS', courseNumber: '328', title: 'Statistical Physics',                      credits: 3, description: 'Elements of statistical mechanics and thermodynamic applications.' },
  { department: 'PHYS', courseNumber: '114', title: 'Mechanics (Algebra-Based)',                credits: 4, description: 'Algebra-based mechanics with emphasis on life science applications.' },

  // ── ENGL ──────────────────────────────────────────────────────────────────
  { department: 'ENGL', courseNumber: '111', title: 'Composition: Literature',                   credits: 5, description: 'Writing as social action using narratives; develops rhetorical and research skills.' },
  { department: 'ENGL', courseNumber: '121', title: 'Composition: Social Issues',                credits: 5, description: 'Community-engagement writing course developing rhetorical skills through a service learning component.' },
  { department: 'ENGL', courseNumber: '131', title: 'Composition: Exposition',                   credits: 5, description: 'Develops rhetorical and research skills for writing ethically and critically across genres.' },
  { department: 'ENGL', courseNumber: '200', title: 'Reading Literary Forms',                    credits: 5, description: 'Techniques for reading poetry, drama, prose fiction, and film including imagery and narration.' },
  { department: 'ENGL', courseNumber: '225', title: 'Shakespeare',                               credits: 5, description: 'Shakespeare\'s career as dramatist through representative comedies, tragedies, romances, and histories.' },
  { department: 'ENGL', courseNumber: '242', title: 'Reading Prose Fiction',                     credits: 5, description: 'Critical interpretation of prose fiction representing a variety of types and periods.' },
  { department: 'ENGL', courseNumber: '281', title: 'Intermediate Expository Writing',           credits: 5, description: 'Writing papers that communicate information and opinion; developing accurate and effective expression.' },
  { department: 'ENGL', courseNumber: '283', title: 'Beginning Verse Writing',                   credits: 5, description: 'Intensive study of the ways and means of making a poem.' },
  { department: 'ENGL', courseNumber: '284', title: 'Beginning Short Story Writing',             credits: 5, description: 'Introduction to the theory and practice of writing the short story.' },
  { department: 'ENGL', courseNumber: '288', title: 'Introduction to Technical and Professional Communication', credits: 5, description: 'Communicating ethically and clearly in technical and professional genres and contexts.' },
  { department: 'ENGL', courseNumber: '302', title: 'Critical Practice',                         credits: 5, description: 'Applying major interpretive practices to language, literature, and culture; developing critical writing.' },
  { department: 'ENGL', courseNumber: '349', title: 'Science Fiction and Fantasy',               credits: 5, description: 'Historical developments and debates within science fiction and fantasy genres.' },
  { department: 'ENGL', courseNumber: '381', title: 'Advanced Expository Writing',               credits: 5, description: 'Developing prose style for experienced writers.' },
  { department: 'ENGL', courseNumber: '388', title: 'Professional and Technical Writing',        credits: 5, description: 'Prepares students to communicate in various modes and professions.' },

  // ── INFO ──────────────────────────────────────────────────────────────────
  { department: 'INFO', courseNumber: '200', title: 'Intellectual Foundations of Informatics',  credits: 5, description: 'What information is, how people create and use it, and how human values shape information systems.' },
  { department: 'INFO', courseNumber: '201', title: 'Foundational Skills for Data Science',     credits: 5, description: 'Data manipulation, analysis, visualization, version control, and programming for data science.' },
  { department: 'INFO', courseNumber: '300', title: 'Research Methods',                          credits: 5, description: 'Research methods for studying people\'s interactions with information: qualitative, quantitative, and design.' },
  { department: 'INFO', courseNumber: '310', title: 'Information Assurance and Cybersecurity',  credits: 5, description: 'Securing information systems; vulnerabilities, threats, privacy, accountability, and policy.' },
  { department: 'INFO', courseNumber: '330', title: 'Databases and Data Modeling',               credits: 5, description: 'Relational models, SQL, entity-relationship modeling, and non-relational databases.' },
  { department: 'INFO', courseNumber: '340', title: 'Client-Side Development',                   credits: 5, description: 'Markup, programming languages, libraries, and frameworks for building interactive web applications.' },
  { department: 'INFO', courseNumber: '360', title: 'Design Methods',                            credits: 4, description: 'Design thinking, prototyping, evaluating, and specifying information experiences with a justice lens.' },
  { department: 'INFO', courseNumber: '370', title: 'Core Methods in Data Science',              credits: 5, description: 'Data ingestion, cloud computing, inference, machine learning, visualization, and data ethics.' },
  { department: 'INFO', courseNumber: '371', title: 'Advanced Methods in Data Science',          credits: 5, description: 'Supervised/unsupervised ML, causal inference, and statistical programming on real-world data.' },
  { department: 'INFO', courseNumber: '380', title: 'Product and Information Systems Management', credits: 5, description: 'Designing information systems: identifying needs, modeling requirements, and constraints.' },
  { department: 'INFO', courseNumber: '430', title: 'Database Design and Management',            credits: 5, description: 'DBMS theory, query optimization, transactions, concurrency control, and data warehousing.' },
  { department: 'INFO', courseNumber: '441', title: 'Server-Side Development',                   credits: 5, description: 'Server-side web programming, APIs, scalable applications, security, and databases.' },
  { department: 'INFO', courseNumber: '474', title: 'Interactive Information Visualization',     credits: 5, description: 'Techniques for visualizing data; building interactive visualizations using cognitive and statistical principles.' },
  { department: 'INFO', courseNumber: '490', title: 'Practical Capstone I',                      credits: 4, description: 'Student-driven team project: defining an information problem, project planning, and deliverables.' },
  { department: 'INFO', courseNumber: '491', title: 'Practical Capstone II',                     credits: 4, description: 'Developing, testing, and iterating a solution to an information problem with documentation.' },
];

async function seed() {
  await connectDB();
  await Course.deleteMany({});
  await Course.insertMany(courses);
  console.log(`Seeded ${courses.length} courses.`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });