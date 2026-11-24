// Facts come from Profile.pdf (the LinkedIn export) and from Jamal's own additions on 2026-11-18.
// Nothing is invented. A role with start: null has no date yet and stays off the clock.
// Dates are [year, month]. end: null means "present".

export const NOW = [2026, 11];
export const FIRST = [2020, 8];

export const GROUPS = {
  lb: { label: 'AIESEC in Lebanon', color: '#FF4A1C' },
  gl: { label: 'AIESEC, global team', color: '#FFB81A' },
  en: { label: 'Software engineering', color: '#8FD8FF' },
  un: { label: 'Universities', color: '#EFEBE3' },
  bk: { label: 'Burger King', color: '#7C828B' },
};

export const EDUCATION = [
  { what: 'Mechatronics Engineering', where: 'University of Balamand', start: [2020, 8], end: [2022, 8] },
  { what: 'BS Computer Science', where: 'Haigazian University', start: [2022, 8], end: [2024, 12] },
];

// lane: vertical slot in the graph. Negative is above the trunk.
export const ROLES = [
  { id: 'pc', org: 'aiesec-lb', group: 'lb', lane: -1, title: 'Project Coordinator', start: [2023, 2], end: [2024, 1],
    points: [
      'Project coordinator and facilitator in the national summit targeting leadership.',
      'Project coordinator for the Food Heroes project targeting SDG 12, which impacted 550+ children in Lebanon.',
      'Project coordinator for a project that raised funds for a local NGO.',
    ] },
  { id: 'bm', org: 'aiesec-lb', group: 'lb', lane: -1, title: 'Branch Manager', start: [2024, 2], end: [2025, 1],
    points: [
      'Started, recruited and led the local committee at Haigazian University, 13 members.',
      'Organized and facilitated the experience of 40 youth in the Youth Speak Forum.',
      'Organized and ran the Heading for the Future program for 30 youth from a marketing background, securing internships for the top 2 participants.',
      'Established a partnership with the university, and partnerships with 6 different schools.',
      'Project manager and facilitator for the Food Heroes program: trained 7 facilitators to deliver 11 lessons that impacted 290+ kids.',
      'Interviewed 60+ youth as part of the national recruitment campaign.',
    ] },
  { id: 'ethics', org: 'aiesec-lb', group: 'lb', lane: -2, title: 'Chair of the Ethics Subcommittee', start: [2024, 8], end: [2025, 9],
    points: [
      'Responsible for ethics education across AIESEC in Lebanon.',
      'Handled and resolved the ethics cases raised.',
    ] },
  { id: 'ndt', org: 'aiesec-lb', group: 'lb', lane: -3, title: 'National Director of Technology', start: [2025, 1], end: [2026, 6],
    figure: ['Top 4', 'of 101 national offices in information management'],
    points: [
      'Started the information management department of AIESEC in Lebanon.',
      'Led the development of technical solutions, from systems to automations, that improved operations and gave more clarity.',
      'Upskilled 8 members in technical skills.',
      'Placed Lebanon as a pioneer in information management, among the top 4 of 101 national offices.',
    ] },
  { id: 'ndtm', org: 'aiesec-lb', group: 'lb', lane: -4, title: 'National Director of Talent Management', start: [2025, 7], end: [2026, 6],
    figure: ['4 to 60', 'active members after the restructure'],
    points: [
      'Restructured and scaled AIESEC in Lebanon from 4 to 60 active members.',
      'Created the processes and standard operating procedures behind it.',
      'Worked on the culture and improved it significantly.',
      'Interviewed 100+ applicants and advanced 30+ people into higher positions or new roles.',
      'Planned and delivered national trainings.',
    ] },
  { id: 'cm', org: 'aiesec-lb', group: 'lb', lane: -1, title: 'Country Manager', start: [2026, 7], end: null,
    // scope of the role (Member Committee President), not achievements: Jamal is new in it
    points: [
      'Leads the Member Committee, the national executive board of AIESEC in Lebanon, and coordinates the presidents of its local committees.',
      'Turns AIESEC\'s global strategy into a national plan, and makes sure the decisions of the national plenary are carried out.',
      'Represents AIESEC in Lebanon to AIESEC International and the other national offices.',
    ] },

  // One Global In-House Development Team role, with a different scope each year: one thread on the clock.
  { id: 'cura', org: 'aiesec-gl', group: 'gl', lane: -5, title: 'CURA Project Manager', start: [2025, 1], end: [2025, 12],
    points: [
      'Designed the architecture and led the development of CURA, a financial management platform being rolled out across 100+ countries to manage the organization\'s finances among its national and local offices.',
      'Worked with the AIESEC Global Financial Board and AIESEC International finance teams to understand their needs and turn them into a working technical solution.',
      'Ran a pilot with finance directors from 16 countries and used their feedback to ship v1.0.',
      'Led a team of 7 developers and 1 UI/UX designer from 7 countries, and upskilled 4 of them into project managers.',
      'Branded the product as CURA, working closely with a UI/UX designer to shape the look and feel.',
      'Alongside CURA: designed and developed the Women in STEM AIESEC website (womeninstem.aiesec.org).',
      'Alongside CURA: led the development of an ML platform that matches exchange participants with open opportunities based on their data.',
      'Education manager for the team: planned, coordinated and ran upskilling sessions for members across different technical roles.',
    ] },
  { id: 'auto', org: 'aiesec-gl', group: 'gl', lane: -5, title: 'Automation Project Manager', start: [2026, 1], end: null,
    points: [
      'Designed and led the development of a CV generator tool built for AIESEC exchange participants.',
      'Information Management Consultant for national offices in more than 100 countries.',
    ] },
  { id: 'im', org: 'aiesec-gl', group: 'gl', lane: -6, title: 'Head of Information Management Subcommittee, Global', start: [2026, 5], end: null,
    figure: ['CAD 280,000', 'Global Information Systems fund under the subcommittee\'s governance'], lead: true,
    points: [
      'Governs AIESEC\'s Global Information Systems fund of CAD 280,000, and keeps AIESEC International\'s information management spending transparent to the Global Plenary.',
      'Reviews the global information management strategy and advises the Global Plenary on what the organization needs.',
      'Reports monthly on the health, development progress and roadmap of expa.aiesec.org and aiesec.org.',
    ] },

  { id: 'bk', org: 'bk', group: 'bk', lane: 1, title: 'Cashier, Kitchen Crew', start: [2021, 7], end: [2022, 11],
    points: [
      'Delivered fast, customer friendly service and prepared food efficiently.',
      'Trained 10 new team members.',
      'Assisted the manager with daily, weekly and monthly inventory checks and stock counts.',
      'Thrived under pressure and at peak times.',
    ] },
  { id: 'ast', org: 'ast', group: 'en', lane: 2, title: 'Full-stack Web Developer Intern', start: [2022, 8], end: [2022, 9],
    points: ['Worked across the full stack on MERN: MongoDB, Express, React and Node.js.'] },
  { id: 'it', org: 'haigazian', group: 'un', lane: 1, title: 'Computer Lab IT Assistant', start: [2023, 1], end: [2024, 12],
    points: [
      'Assisted the IT department with on campus IT tasks and support.',
      'Helped students install software and use printing and IT services.',
    ] },
  { id: 'css', org: 'haigazian', group: 'un', lane: 2, title: 'President of the Computer Science Student Society', start: [2023, 3], end: [2024, 12],
    points: [
      'Resumed the society after years of it being stopped.',
      'Led a team of 11.',
      'Planned and executed 17 events and projects, with 600+ youth impacted.',
      'Delivered and facilitated sessions in workshops.',
      'Did the first ever collaboration with another university in the department\'s history.',
    ] },
  { id: 'tutor', org: 'haigazian', group: 'un', lane: 3, title: 'Computer Science Tutor', start: [2023, 3], end: [2024, 12],
    points: ['Delivered individual and group tutoring sessions for computer science students in various computer science and math courses.'] },
  { id: 'profiles', org: 'profiles', group: 'en', lane: 4, title: 'Software Developer', start: [2023, 8], end: [2023, 8],
    points: ['Created the WooCommerce Connector project, which connects and synchronizes WooCommerce websites with a Delphi app connected to a local ElevateDB.'] },
  { id: 'swe', org: 'do360', group: 'en', lane: 4, title: 'Software Engineer', start: [2024, 6], end: [2025, 5],
    points: ['Worked on the finance, HR and personnel, payroll, and team collaboration modules.'] },
  { id: 'sswe', org: 'do360', group: 'en', lane: 4, title: 'Senior Software Engineer', start: [2025, 6], end: null,
    points: [
      'Lead developer on the same four modules: finance, HR and personnel, payroll, and team collaboration.',
      'Led and mentored 10 interns and employees over two years at Do360, not all at the same time.',
    ] },
  { id: 'aub', org: 'aub', group: 'un', lane: 1, title: 'Lab Instructor and Teaching Assistant', start: [2025, 1], end: [2026, 5],
    points: [
      'Teaching assistant for CMPS 271, the software engineering course: led the sprint ceremonies and mentored 70 students through their projects.',
      'Lab instructor for 5 Excel labs in CMPS 208, for business students.',
    ] },
  { id: 'devnov', org: 'devnov', group: 'en', lane: 3, title: 'Co-founder, CTO and CFO', start: [2026, 9], end: null,
    points: [
      'Co-founded DevNov, the startup I am building.',
      'Products so far: a garage management app, an ERP for a sweets business, and a trading and learning system.',
    ] },
];

// Order and totals as they appear on the profile.
export const ORGS = [
  { id: 'aiesec-lb', name: 'AIESEC in Lebanon', short: 'AIESEC in Lebanon', total: '3 years 10 months', place: 'Beirut, Lebanon', group: 'lb' },
  { id: 'aiesec-gl', name: 'AIESEC', short: 'AIESEC', total: '1 year 11 months', place: 'Global In-House Development Team. Montreal, Quebec, Canada', group: 'gl' },
  { id: 'do360', name: 'Do360 Digital Construction SAL', short: 'Do360 Digital Construction', total: '2 years 6 months', place: 'Beirut, Lebanon', group: 'en' },
  { id: 'devnov', name: 'DevNov', short: 'DevNov', total: '3 months', place: '', group: 'en' },
  { id: 'aub', name: 'American University of Beirut', short: 'American University of Beirut', total: '1 year 5 months', place: 'Beirut, Lebanon', group: 'un' },
  { id: 'haigazian', name: 'Haigazian University', short: 'Haigazian University', total: '2 years', place: 'Beirut, Lebanon', group: 'un' },
  { id: 'profiles', name: 'Profiles Software', short: 'Profiles Software', total: '1 month', place: 'Beirut, Lebanon', group: 'en' },
  { id: 'bk', name: 'Burger King', short: 'Burger King', total: '1 year 5 months', place: 'Aley, Lebanon', group: 'bk' },
  { id: 'ast', name: 'AST', short: 'AST', total: '2 months', place: '', group: 'en' },
];

export const WORK = [
  { id: 'cura', roles: ['cura'], group: 'gl', title: 'CURA', when: '2025', where: 'AIESEC, Global In-House Development Team', role: 'CURA Project Manager',
    body: [
      'A financial management platform for AIESEC\'s national and local offices, being rolled out across 100+ countries. I designed the architecture, led the development, and gave the product its name and brand with a UI/UX designer.',
      'The requirements came from the AIESEC Global Financial Board and AIESEC International\'s finance teams. A pilot with finance directors from 16 countries shaped v1.0.',
    ],
    figures: [['100+', 'countries in the rollout'], ['16', 'countries in the pilot'], ['7+1', 'developers and a UI/UX designer, from 7 countries'], ['4', 'teammates upskilled into project managers']],
    slot: 'CURA screens' },
  { id: 'do360', roles: ['swe', 'sswe'], group: 'en', title: 'Do360 modules', when: '2024 to now', where: 'Do360 Digital Construction', role: 'Lead developer',
    body: ['I am the lead developer on four modules: finance, HR and personnel, payroll, and team collaboration. Over two years I led and mentored 10 interns and employees, not all at the same time.'],
    figures: [['4', 'modules I lead'], ['10', 'interns and employees mentored over two years']] },
  { id: 'devnov', roles: ['devnov'], group: 'en', title: 'DevNov', when: 'Since September 2026', where: 'my startup', role: 'Co-founder, CTO and CFO',
    body: ['The startup I co-founded and help run as CTO and CFO. What it has built so far: a garage management app, an ERP for a sweets business, and a trading and learning system.'],
    figures: [] },
  { id: 'match', roles: ['cura'], group: 'gl', title: 'Exchange matching', when: '2025', where: 'AIESEC, Global In-House Development Team', role: 'Led its development alongside CURA',
    body: ['A machine learning platform that matches exchange participants with open opportunities, based on their data. I led its development.'],
    figures: [],
    slot: 'Matching platform screens' },
  { id: 'wis', roles: ['cura'], group: 'gl', title: 'Women in STEM', when: '2025', where: 'AIESEC, Global In-House Development Team', role: 'Designer and developer, alongside CURA',
    body: ['The Women in STEM AIESEC website. I designed it and I developed it.'],
    link: ['womeninstem.aiesec.org', 'https://womeninstem.aiesec.org'],
    figures: [],
    slot: 'Women in STEM site capture' },
  { id: 'cv', roles: ['auto'], group: 'gl', title: 'CV generator', when: '2026', where: 'AIESEC, Global In-House Development Team', role: 'Automation Project Manager',
    body: ['A CV generator tool built for AIESEC exchange participants. I designed it and led its development.'],
    figures: [],
    slot: 'CV generator screens' },
  { id: 'woo', roles: ['profiles'], group: 'en', title: 'WooCommerce Connector', when: 'August 2023', where: 'Profiles Software', role: 'Software Developer',
    body: ['A connector that links and synchronizes WooCommerce websites with a Delphi app connected to a local ElevateDB.'],
    figures: [] },
  { id: 'food', roles: ['pc', 'bm'], group: 'lb', title: 'Food Heroes', when: '2023 to 2025', where: 'AIESEC in Lebanon', role: 'Project Coordinator, then Project Manager and facilitator',
    body: ['A program for children targeting SDG 12. I coordinated it in my first year at AIESEC, then came back as project manager and facilitator and trained the people who delivered it.'],
    figures: [['550+', 'children reached as coordinator'], ['290+', 'kids reached as project manager'], ['7', 'facilitators trained'], ['11', 'lessons delivered']] },
  { id: 'society', roles: ['css'], group: 'un', title: 'Computer Science Student Society', when: 'March 2023 to December 2024', where: 'Haigazian University', role: 'President',
    body: ['The society had been stopped for years. I resumed it, led a team of 11, and ran the first collaboration with another university in the department\'s history.'],
    figures: [['17', 'events and projects'], ['600+', 'youth impacted'], ['11', 'people on the team']] },
];
