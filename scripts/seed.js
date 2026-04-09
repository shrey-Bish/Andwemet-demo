import fs from 'fs';

const firstNamesMale = ["Aarav","Vihaan","Aditya","Rohan","Kabir","Arjun","Sai","Dhruv","Ishaan","Krishna","Ravi","Amit","Nikhil","Siddharth","Vikram"];
const firstNamesFemale = ["Ananya","Diya","Sanya","Kavya","Ira","Myra","Nisha","Riya","Priya","Neha","Zara","Meera","Tara","Pooja","Shreya"];
const cities = ["Mumbai","Delhi","Bangalore","Hyderabad","Ahmedabad","Chennai","Kolkata","Surat","Pune","Jaipur","Lucknow","Kanpur"];
const regions = ['North India','East India','West India','Central India','South India','North East India'];
const incomes = ['Under 12 Lakhs','Between 12-15 Lakhs','Between 15-18 Lakhs','Between 18-20 Lakhs','Between 20-24 Lakhs','Between 24-30 Lakhs','Between 30-35 lakhs','Between 35-40 Lakhs','Between 40-50 Lakhs','Between 50-70 Lakhs','Between 70-90 Lakhs','Over 90 Lakhs','Over 1 crore','Over few crores'];
const degrees = ['Graduate Degree (Undergraduate)','Masters','PG Diploma','Phd and equivalent','Vocational Degree','High School','College Dropout'];
const relationStatuses = ['Never married','Divorced','Widow/Widower','Separated, filed for a divorce','Separated, yet to file for a divorce'];
const seekings = ['Marriage','Live-in','Companionship (committed, living under separate roofs)','I seek committed relationship, but unsure what'];
const religions = ['Hindu','Muslim','Christian','Jain','Buddhist','Sikh','Spiritual','Atheist','Agnostic','Other'];
const pipelines = ['Pending Video','Available','In Active Intro','Payment Pending','On Hold'];
const engagements = ['High','Medium','Low'];
const purchases = ['Has purchased','Never purchased','Purchased this month'];
const privilegeDefinitions = ["Having a supportive family unconditionally.","The invisible safety net of time and financial stability.","The absence of systemic friction in society.","Being able to dream without the panic of survival.","The default assumption of respect when I speak.","Having dependable friends when everything falls apart."];
const growingUpStories = ["Grew up very sheltered, learning to break out.","Moved around a lot due to parents' military background.","Child of diaspora, balancing two cultures heavily.","Raised in a strict academic household.","Caretaker to a sick parent, learned independence too early.","Huge joint family system, very community-oriented."];
const coreMustHaves = ["Absolute honesty and kindness.","An intellectual sparring partner who is gentle.","Emotional availability and zero mind games.","Must be deeply ambitious and driven.","Sense of humor, especially a dark one.","Someone who understands that independence and intimacy are compatible."];
const healthFlagSets = [
  ["Bio complete","Preferences added","Video uploaded","Engagement present"],
  ["Bio complete","Preferences added","Video uploaded"],
  ["Bio complete","No video","Preferences added"],
  ["Bio complete","No video"],
  ["Incomplete bio","No video"],
  ["Bio complete","Preferences added","Video uploaded","Engagement present"]
];

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const seededUsers = [];

for (let i = 0; i < 100; i++) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? "Male" : "Female";
    const firstName = isMale ? randomChoice(firstNamesMale) : randomChoice(firstNamesFemale);
    const flags = randomChoice(healthFlagSets);
    const hasVideo = flags.includes("Video uploaded");
    const engLevel = randomChoice(engagements);
    const replies = engLevel === 'High' ? 10 + Math.floor(Math.random() * 20) : engLevel === 'Medium' ? 3 + Math.floor(Math.random() * 8) : Math.floor(Math.random() * 3);
    const healthScore = flags.length >= 4 ? 85 + Math.floor(Math.random() * 16) : flags.length === 3 ? 60 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 30);
    const purStatus = randomChoice(purchases);
    const intros = [];
    if (purStatus !== 'Never purchased') {
      const numIntros = 1 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numIntros; j++) {
        intros.push({
          target_user_id: 5000 + Math.floor(Math.random() * 100),
          date: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
          amount_paid: randomChoice([499, 999, 1499]),
          connected: Math.random() > 0.5
        });
      }
    }

    seededUsers.push({
        id: 5000 + i,
        first_name: firstName,
        email: firstName.toLowerCase() + (5000+i) + "@gmail.com",
        gender: gender,
        age: 25 + Math.floor(Math.random() * 20),
        whatsapp_number: "+91" + Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        city_of_residence: randomChoice(cities),
        native_region: randomChoice(regions),
        languages_spoken: ["English", randomChoice(["Hindi","Marathi","Tamil","Telugu","Bengali","Kannada"])],
        educational_degree: randomChoice(degrees),
        last_institute: "University of " + randomChoice(cities),
        professional_intro: randomChoice(["Software Engineer","Marketing Exec","Doctor","Designer","Consultant","Entrepreneur","Teacher","Lawyer","Data Scientist","Product Manager"]),
        annual_income: randomChoice(incomes),
        privilege_definition: randomChoice(privilegeDefinitions),
        growing_up_story: randomChoice(growingUpStories),
        relationship_status: randomChoice(relationStatuses),
        has_children: Math.random() > 0.8,
        seeking_relationship_type: randomChoice(seekings),
        looking_for_long_term: Math.random() > 0.1,
        religious_inclination: randomChoice(religions),
        open_to_other_faith: randomChoice(['Yes','I am not sure','No']),
        open_to_divorced: randomChoice(['Yes','I am not sure','I am not']),
        fine_with_single_parent: randomChoice(['Yes I am','I am not sure','It will not work for me']),
        open_to_relocate: randomChoice(['Yes','No']),
        musthaves: randomChoice(coreMustHaves),
        additional_mentions: randomChoice(["Avid traveler.","Looking for something profound.","Open to long-distance initially.","Vegetarian preferred.","Love pets.","Cat person."]),
        heard_about_from: randomChoice(["Linkedin","Instagram","Reddit","Friend recommended","Google search","From an existing member"]),
        video_approved: hasVideo,
        pipeline_status: randomChoice(pipelines),
        is_soft_deleted: false,
        soft_deleted_at: null,
        admin_notes: Math.random() > 0.7 ? "Flagged for follow up." : "",
        activity_timeline: [
            { timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(), action: "Signed Up" },
            ...(hasVideo ? [{ timestamp: new Date(Date.now() - Math.random() * 8000000000).toISOString(), action: "Video Approved" }] : [])
        ],
        engagement_level: engLevel,
        engagement_replies: replies,
        last_active: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
        profile_health_score: healthScore,
        profile_health_flags: flags,
        purchase_status: purStatus,
        introductions: intros
    });
}

const fileContent = "import type { User } from './users';\n\nexport const generated100Users: User[] = " + JSON.stringify(seededUsers, null, 2) + " as User[];";
fs.writeFileSync('src/data/generatedUsers.ts', fileContent);
console.log("Written 100 users with expanded schema to src/data/generatedUsers.ts");
