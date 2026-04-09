import type { User } from '../data/users';

export interface MatchReasoning {
  overall_score: number; // 0 to 100
  verdict: "Highly Compatible" | "Potentially Compatible" | "Proceed with Caution" | "Incompatible";
  psychological_alignment: string;
  lifestyle_demographic_alignment: string;
  potential_pitfalls: string;
  suggested_community_question: string;
}

export function generateMatchPrompt(userA: User, userB: User): string {
  return `
You are 'Amie', an expert psychological matchmaker and community manager.

Analyze the immense socio-demographic and deep psychological alignment of these two individuals.

USER A [ID: ${userA.id}]:
- Demographics: ${userA.age}yo ${userA.gender}, ${userA.city_of_residence} (${userA.native_region})
- Education & Work: ${userA.educational_degree} from ${userA.last_institute}, works as ${userA.professional_intro} making ${userA.annual_income}
- Relationship Context: ${userA.relationship_status}, Kids: ${userA.has_children}. Seeking: ${userA.seeking_relationship_type}
- Dealbreakers: Open to other faith? ${userA.open_to_other_faith}, Open to divorced? ${userA.open_to_divorced}, Single parent ok? ${userA.fine_with_single_parent}, Willing to relocate? ${userA.open_to_relocate}
- Privilege Definition: "${userA.privilege_definition}"
- Growing Up Story: "${userA.growing_up_story}"
- Must-haves: "${userA.musthaves}"

USER B [ID: ${userB.id}]:
- Demographics: ${userB.age}yo ${userB.gender}, ${userB.city_of_residence} (${userB.native_region})
- Education & Work: ${userB.educational_degree} from ${userB.last_institute}, works as ${userB.professional_intro} making ${userB.annual_income}
- Relationship Context: ${userB.relationship_status}, Kids: ${userB.has_children}. Seeking: ${userB.seeking_relationship_type}
- Dealbreakers: Open to other faith? ${userB.open_to_other_faith}, Open to divorced? ${userB.open_to_divorced}, Single parent ok? ${userB.fine_with_single_parent}, Willing to relocate? ${userB.open_to_relocate}
- Privilege Definition: "${userB.privilege_definition}"
- Growing Up Story: "${userB.growing_up_story}"
- Must-haves: "${userB.musthaves}"

OUTPUT REQUIREMENT:
Provide a JSON response matching the MatchReasoning interface. Generate a profound analysis of their alignment. 
At the end, suggest a specific, philosophical community 'Discussion(question)' based uniquely on the friction or interesting dynamic between these two profiles that we could post to the broader andwemet community to gauge societal sentiment (e.g., "If someone's privilege was avoiding emotional trauma, but their partner's was financial stability, how do you balance the 'safety net' in a relationship?").
`;
}

export async function evaluateMatch(userA: User, userB: User): Promise<MatchReasoning> {
  // Simulate network latency for LLM inference (Enterprise loading feel)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const pairId = [userA.id, userB.id].sort().join("-");

  if (pairId === "1042-2099") {
    // Eleanor & Julian
    return {
      overall_score: 83,
      verdict: "Potentially Compatible",
      psychological_alignment: "There is immense depth here. Eleanor operates via intellectualized distance, which could balance Julian's anxious scanning. Both comprehend privilege beautifully as an emotional and tangible 'safety net'.",
      lifestyle_demographic_alignment: "Logistical friction exists. Julian lives in Mumbai and is open to relocation, but Eleanor is in Bangalore and is NOT open to relocation. Eleanor makes slightly less than Julian, but both are highly educated post-graduates.",
      potential_pitfalls: "Eleanor seeks 'Marriage', but Julian is seeking 'Live-in'. This is a massive expectation gap that needs immediate addressing before an intro proceeds.",
      suggested_community_question: "When one partner seeks the ultimate commitment of marriage, and the other explicitly seeks a live-in arrangement, is compromise possible, or is it fundamentally delaying the inevitable end?"
    };
  }

  if (pairId === "3110-4501") {
    // Amina & Marcus
    return {
      overall_score: 91,
      verdict: "Highly Compatible",
      psychological_alignment: "A stunning pairing of individuals who have profoundly rebuilt their worlds. Amina redefined her diaspora guilt, and Marcus entirely reinvented his worldview after abandoning high-demand religion. They will relate deeply on the trauma of 'leaving the default'.",
      lifestyle_demographic_alignment: "Marcus has a 6-year-old and is divorced; Amina is 'unsure' about dating single parents but is open to divorced individuals. Marcus is willing to relocate to Delhi (Amina is not open to relocating).",
      potential_pitfalls: "Amina explicitly seeks LAT (Living Apart Together) due to her recent separation, whereas Marcus wants Marriage. However, both highly value autonomy, so LAT might actually suit Marcus perfectly if framed correctly.",
      suggested_community_question: "To those who have completely rebuilt their moral foundations in adulthood: how hard is it to blend your 'chosen family' with a partner who did the same, but from a different background?"
    };
  }

  // Fallback
  return {
    overall_score: 72,
    verdict: "Potentially Compatible",
    psychological_alignment: "Their qualitative fields suggest differing definitions of privilege, which could either be complementary or cause friction based on their conflict resolution styles.",
    lifestyle_demographic_alignment: `Demographically, one resides in ${userA.city_of_residence} and the other in ${userB.city_of_residence}. Location logistics and relationship expectations (${userA.seeking_relationship_type} vs ${userB.seeking_relationship_type}) will be the primary initial hurdle.`,
    potential_pitfalls: "Their core relational dealbreakers (like relocation and faith requirements) need a manual review from the admin team to ensure no hard lines are crossed.",
    suggested_community_question: `Is the modern definition of a 'must-have' simply a trauma-response to past relationships?`
  };
}
