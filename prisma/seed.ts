import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.savedComparison.deleteMany();
  await prisma.savedCompany.deleteMany();
  await prisma.compensationEntry.deleteMany();
  await prisma.company.deleteMany();
  await prisma.role.deleteMany();
  await prisma.level.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // ---- Demo User ----
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@compintel.in",
      name: "Demo User",
      passwordHash: await bcrypt.hash("demo1234", 12),
    },
  });
  console.log("✅ Demo user created: demo@compintel.in / demo1234");

  // ---- Levels ----
  const levelsData = [
    { name: "L1", rank: 1 },
    { name: "L2", rank: 2 },
    { name: "L3", rank: 3 },
    { name: "L4", rank: 4 },
    { name: "L5", rank: 5 },
    { name: "L6", rank: 6 },
  ];

  const levels = await Promise.all(
    levelsData.map((l) => prisma.level.create({ data: l }))
  );
  console.log(`✅ ${levels.length} levels created`);

  // ---- Locations ----
  const locationsData = [
    { city: "Bangalore", state: "Karnataka", country: "India" },
    { city: "Hyderabad", state: "Telangana", country: "India" },
    { city: "Mumbai", state: "Maharashtra", country: "India" },
    { city: "Pune", state: "Maharashtra", country: "India" },
    { city: "Delhi NCR", state: "Delhi", country: "India" },
    { city: "Chennai", state: "Tamil Nadu", country: "India" },
  ];

  const locations = await Promise.all(
    locationsData.map((l) => prisma.location.create({ data: l }))
  );
  console.log(`✅ ${locations.length} locations created`);

  // ---- Roles ----
  const rolesData = [
    { title: "Software Engineer", normalizedTitle: "software-engineer", category: "Engineering" },
    { title: "Senior Software Engineer", normalizedTitle: "senior-software-engineer", category: "Engineering" },
    { title: "Product Manager", normalizedTitle: "product-manager", category: "Product" },
    { title: "Data Scientist", normalizedTitle: "data-scientist", category: "Data" },
    { title: "Data Engineer", normalizedTitle: "data-engineer", category: "Data" },
    { title: "DevOps Engineer", normalizedTitle: "devops-engineer", category: "Engineering" },
    { title: "Frontend Engineer", normalizedTitle: "frontend-engineer", category: "Engineering" },
    { title: "Backend Engineer", normalizedTitle: "backend-engineer", category: "Engineering" },
    { title: "Engineering Manager", normalizedTitle: "engineering-manager", category: "Management" },
    { title: "UX Designer", normalizedTitle: "ux-designer", category: "Design" },
  ];

  const roles = await Promise.all(
    rolesData.map((r) => prisma.role.create({ data: r }))
  );
  console.log(`✅ ${roles.length} roles created`);

  // ---- Companies ----
  const companiesData = [
    {
      name: "Google",
      normalizedName: "google",
      industry: "Technology",
      description: "A multinational technology company specializing in search, cloud computing, and AI. Known for top-tier compensation and engineering culture.",
      website: "https://google.com",
      founded: 1998,
      headquarters: "Bangalore, India",
      employeeCount: "10,000+ (India)",
    },
    {
      name: "Amazon",
      normalizedName: "amazon",
      industry: "E-Commerce & Cloud",
      description: "Global e-commerce and cloud computing giant. Amazon India is one of the largest tech employers in the country.",
      website: "https://amazon.in",
      founded: 1994,
      headquarters: "Hyderabad, India",
      employeeCount: "100,000+ (India)",
    },
    {
      name: "Microsoft",
      normalizedName: "microsoft",
      industry: "Technology",
      description: "A leading technology company known for Windows, Azure, and enterprise software. Microsoft India Development Center is a major hub.",
      website: "https://microsoft.com",
      founded: 1975,
      headquarters: "Hyderabad, India",
      employeeCount: "20,000+ (India)",
    },
    {
      name: "Meta",
      normalizedName: "meta",
      industry: "Social Media & Technology",
      description: "Parent company of Facebook, Instagram, and WhatsApp. Offers premium compensation packages for engineering talent in India.",
      website: "https://meta.com",
      founded: 2004,
      headquarters: "Gurugram, India",
      employeeCount: "3,000+ (India)",
    },
    {
      name: "Uber",
      normalizedName: "uber",
      industry: "Transportation & Technology",
      description: "A ride-hailing and food delivery platform. Uber's Hyderabad office is one of its largest engineering centers globally.",
      website: "https://uber.com",
      founded: 2009,
      headquarters: "Hyderabad, India",
      employeeCount: "5,000+ (India)",
    },
    {
      name: "Atlassian",
      normalizedName: "atlassian",
      industry: "Enterprise Software",
      description: "Creator of Jira, Confluence, and Trello. Known for strong work culture and competitive compensation in Bangalore.",
      website: "https://atlassian.com",
      founded: 2002,
      headquarters: "Bangalore, India",
      employeeCount: "3,000+ (India)",
    },
    {
      name: "Salesforce",
      normalizedName: "salesforce",
      industry: "Cloud Computing & CRM",
      description: "The world's #1 CRM platform. Salesforce India Tower in Hyderabad is a major tech hub with competitive salaries.",
      website: "https://salesforce.com",
      founded: 1999,
      headquarters: "Hyderabad, India",
      employeeCount: "8,000+ (India)",
    },
    {
      name: "Adobe",
      normalizedName: "adobe",
      industry: "Software & Creative Tools",
      description: "Creator of Photoshop, Premiere Pro, and Experience Cloud. Adobe India in Noida is their largest office outside the US.",
      website: "https://adobe.com",
      founded: 1982,
      headquarters: "Noida, India",
      employeeCount: "6,000+ (India)",
    },
    {
      name: "Flipkart",
      normalizedName: "flipkart",
      industry: "E-Commerce",
      description: "India's leading e-commerce marketplace. A Walmart subsidiary offering highly competitive packages for tech talent.",
      website: "https://flipkart.com",
      founded: 2007,
      headquarters: "Bangalore, India",
      employeeCount: "30,000+",
    },
    {
      name: "Razorpay",
      normalizedName: "razorpay",
      industry: "Fintech",
      description: "India's leading payments gateway and financial services platform. Known for startup culture with competitive compensation.",
      website: "https://razorpay.com",
      founded: 2014,
      headquarters: "Bangalore, India",
      employeeCount: "3,000+",
    },
    {
      name: "Infosys",
      normalizedName: "infosys",
      industry: "IT Services & Consulting",
      description: "One of India's largest IT services companies. A pioneer in the Indian IT industry with global presence.",
      website: "https://infosys.com",
      founded: 1981,
      headquarters: "Bangalore, India",
      employeeCount: "300,000+",
    },
    {
      name: "TCS",
      normalizedName: "tcs",
      industry: "IT Services & Consulting",
      description: "Tata Consultancy Services is the largest Indian IT company by market cap and revenue. Part of the Tata Group.",
      website: "https://tcs.com",
      founded: 1968,
      headquarters: "Mumbai, India",
      employeeCount: "600,000+",
    },
    {
      name: "Swiggy",
      normalizedName: "swiggy",
      industry: "Food Delivery & Quick Commerce",
      description: "India's leading food delivery and quick commerce platform. Offers competitive packages to attract top engineering talent.",
      website: "https://swiggy.com",
      founded: 2014,
      headquarters: "Bangalore, India",
      employeeCount: "5,000+",
    },
    {
      name: "PhonePe",
      normalizedName: "phonepe",
      industry: "Fintech & Digital Payments",
      description: "India's largest UPI payments platform. Backed by Walmart, PhonePe offers strong compensation for tech roles.",
      website: "https://phonepe.com",
      founded: 2015,
      headquarters: "Bangalore, India",
      employeeCount: "6,000+",
    },
    {
      name: "Paytm",
      normalizedName: "paytm",
      industry: "Fintech & Digital Payments",
      description: "One of India's largest digital payments and financial services companies. Headquartered in Noida with offices across India.",
      website: "https://paytm.com",
      founded: 2010,
      headquarters: "Noida, India",
      employeeCount: "8,000+",
    },
  ];

  const companies = await Promise.all(
    companiesData.map((c) => prisma.company.create({ data: c }))
  );
  console.log(`✅ ${companies.length} companies created`);

  // ---- Compensation Entry Generation ----
  // Base salary ranges per level (annual, INR)
  const baseSalaryByLevel: Record<number, { min: number; max: number }> = {
    1: { min: 400000, max: 1000000 },     // L1: 4-10 LPA
    2: { min: 800000, max: 1800000 },     // L2: 8-18 LPA
    3: { min: 1500000, max: 3000000 },    // L3: 15-30 LPA
    4: { min: 2500000, max: 5000000 },    // L4: 25-50 LPA
    5: { min: 4000000, max: 8000000 },    // L5: 40-80 LPA
    6: { min: 6000000, max: 12000000 },   // L6: 60-120 LPA
  };

  // Company compensation tier multipliers
  const companyTier: Record<string, number> = {
    "google": 1.4,
    "meta": 1.45,
    "amazon": 1.2,
    "microsoft": 1.15,
    "uber": 1.25,
    "atlassian": 1.2,
    "salesforce": 1.1,
    "adobe": 1.05,
    "flipkart": 1.15,
    "razorpay": 1.1,
    "phonepe": 1.05,
    "swiggy": 1.0,
    "paytm": 0.85,
    "infosys": 0.6,
    "tcs": 0.55,
  };

  // Location cost multipliers
  const locationMultiplier: Record<string, number> = {
    "Bangalore": 1.1,
    "Hyderabad": 1.0,
    "Mumbai": 1.05,
    "Pune": 0.95,
    "Delhi NCR": 1.0,
    "Chennai": 0.95,
  };

  function randomInRange(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }

  function generateEntry(
    company: typeof companies[0],
    role: typeof roles[0],
    level: typeof levels[0],
    location: typeof locations[0]
  ) {
    const levelRange = baseSalaryByLevel[level.rank];
    const tier = companyTier[company.normalizedName] || 1.0;
    const locMult = locationMultiplier[location.city] || 1.0;

    const baseSalary = Math.round(
      randomInRange(levelRange.min, levelRange.max) * tier * locMult / 1000
    ) * 1000;

    // Bonus: 5-20% of base for most companies, lower for IT services
    const bonusPercent = tier > 0.8
      ? randomInRange(5, 20) / 100
      : randomInRange(0, 10) / 100;
    const bonus = Math.round(baseSalary * bonusPercent / 1000) * 1000;

    // Stock/RSUs: Higher levels and tier companies get more equity
    let stock = 0;
    if (tier >= 1.0 && level.rank >= 2) {
      const stockPercent = randomInRange(10, 50) / 100 * (level.rank / 3);
      stock = Math.round(baseSalary * stockPercent / 1000) * 1000;
    }

    const yearsOfExp = Math.max(0, level.rank * 2 - 2 + randomInRange(-1, 3));

    return {
      companyId: company.id,
      roleId: role.id,
      levelId: level.id,
      locationId: location.id,
      baseSalary,
      bonus,
      stock,
      yearsOfExp,
      verified: Math.random() > 0.3,
    };
  }

  // Generate ~400 entries
  const entries: ReturnType<typeof generateEntry>[] = [];

  for (const company of companies) {
    // Each company gets entries across multiple roles, levels, and locations
    const numEntries = randomInRange(20, 35);

    for (let i = 0; i < numEntries; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      entries.push(generateEntry(company, role, level, location));
    }
  }

  // Batch create entries
  const createdEntries = await prisma.compensationEntry.createMany({
    data: entries,
  });
  console.log(`✅ ${createdEntries.count} compensation entries created`);

  // ---- Seed saved companies for demo user ----
  await prisma.savedCompany.createMany({
    data: [
      { userId: demoUser.id, companyId: companies[0].id }, // Google
      { userId: demoUser.id, companyId: companies[1].id }, // Amazon
      { userId: demoUser.id, companyId: companies[2].id }, // Microsoft
    ],
  });
  console.log("✅ Saved companies created for demo user");

  console.log("\n🎉 Seed completed successfully!");
  console.log("   Demo login: demo@compintel.in / demo1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
