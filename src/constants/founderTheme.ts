import { FounderPath, IPokemon } from "./types";

export enum CrisisAction {
  PITCH = "Pitch Deck",
  SHIP = "Ship Sprint",
  CATCH = "Offer Letter",
  RETREAT = "Retreat",
}

type StarterTheme = {
  path: FounderPath;
  title: string;
  pitch: string;
  followUp: string;
};

type EncounterTheme = {
  crisis: string;
  summary: string;
  hint: string;
  recommendedAction: CrisisAction;
  success: string;
  failure: string;
};

const fallbackStarterTheme: StarterTheme = {
  path: FounderPath.OPERATOR,
  title: "generalist catch",
  pitch: "Balanced catches keep a shaky company alive while everything else changes.",
  followUp: "Not flashy. Reliable. Founders underestimate how far that goes.",
};

const starterThemes: Record<number, StarterTheme> = {
  1: {
    path: FounderPath.BOOTSTRAP,
    title: "bootstrap beast",
    pitch:
      "Bulbasaur founders grow slowly, talk to customers, and turn retention into a moat.",
    followUp:
      "If you catch this one, you are betting on patience, profitability, and compounding trust.",
  },
  4: {
    path: FounderPath.VC,
    title: "venture rocket",
    pitch:
      "Charmander founders burn hot, demo well, and know how to turn momentum into meetings.",
    followUp:
      "If you catch this one, you are betting on velocity, narrative, and a little bit of chaos.",
  },
  7: {
    path: FounderPath.OPERATOR,
    title: "operator tank",
    pitch:
      "Squirtle founders love process, uptime, and surviving the ugly middle when the glamour fades.",
    followUp:
      "If you catch this one, you are betting on discipline, calm execution, and fewer self-inflicted fires.",
  },
};

const roleByType: Record<string, string> = {
  Bug: "Iteration Gremlin",
  Dragon: "Vision Monster",
  Electric: "Growth Hacker",
  Fighting: "Closer",
  Fire: "Launch Goblin",
  Flying: "Partnership Scout",
  Ghost: "Stealth Builder",
  Grass: "Customer Whisperer",
  Ground: "Infra Operator",
  Ice: "Research Lead",
  Normal: "Utility Hire",
  Poison: "Acquisition Goblin",
  Psychic: "Product Brain",
  Rock: "Finance Shield",
  Water: "Operations Anchor",
};

const encounterByType: Record<string, EncounterTheme> = {
  Bug: {
    crisis: "Scope Creep",
    summary:
      "A dozen tiny feature requests are swarming the roadmap and eating sprint time.",
    hint:
      "Cut scope, ship the core, and do not let vanity tasks breed overnight.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You cut the fluff, shipped the essential version, and turned chaos back into momentum.",
    failure:
      "The roadmap bloated, the team slowed down, and the week disappeared into low-value work.",
  },
  Dragon: {
    crisis: "Category Shift",
    summary:
      "A bigger vision just appeared and now everyone wants to pivot before launch.",
    hint:
      "Hold the room together, keep the narrative sharp, and decide what really changes the company.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You reframed the story, kept the team aligned, and made the bigger vision feel actionable.",
    failure:
      "The company chased a shinier story and lost the discipline that made the product work.",
  },
  Electric: {
    crisis: "Growth Spike",
    summary:
      "Traffic is surging faster than the product can handle, and everyone smells opportunity.",
    hint:
      "Capture demand without blowing up retention. Not every spike is real growth.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You turned the spike into a compelling story, bought time, and kept the team focused on signal over noise.",
    failure:
      "You mistook excitement for traction, and the surge faded before the product could hold it.",
  },
  Fighting: {
    crisis: "Enterprise Procurement",
    summary:
      "The deal is alive, but legal, security, and procurement all want another round.",
    hint:
      "Stay calm, keep the champion warm, and close one blocker at a time.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You navigated the objections, held the buyer together, and moved the deal one stage closer to signature.",
    failure:
      "The deal stalled in committee and your champion stopped fighting for it.",
  },
  Fire: {
    crisis: "Production Fire",
    summary:
      "A launch went sideways and the whole team is refreshing dashboards in panic.",
    hint:
      "Hotfix the blast radius, then decide what story you are telling customers.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You shipped the fix fast, calmed the room, and turned a public fire into a private lesson.",
    failure:
      "The outage lingered, trust took a hit, and the team learned the wrong thing from the pain.",
  },
  Flying: {
    crisis: "Missed Signal",
    summary:
      "A partnership window opened and could disappear before the team aligns on it.",
    hint:
      "Move fast enough to matter, but do not chase every shiny bird out of the sky.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You landed the conversation, scoped the opportunity, and turned a fleeting signal into a live path.",
    failure:
      "You hesitated, overthought the timing, and watched the opening move on without you.",
  },
  Ghost: {
    crisis: "Ghosted Lead",
    summary:
      "The best prospect on the board vanished right before the pilot agreement.",
    hint:
      "Follow up once, tighten the pitch, and keep the funnel alive instead of spiraling.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You revived the conversation with a tighter pitch and kept the pipeline from collapsing into self-doubt.",
    failure:
      "You obsessed over one lead, ignored the rest of the funnel, and let silence turn into drift.",
  },
  Grass: {
    crisis: "New Client Pilot",
    summary:
      "A promising customer finally said yes, and now the product has to prove itself in the wild.",
    hint:
      "Over-communicate, learn fast, and turn the first win into a repeatable playbook.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You shipped the right fixes, supported the rollout, and turned a fragile pilot into a real customer story.",
    failure:
      "The pilot dragged, confidence slipped, and the team learned how quickly a maybe can turn into a no.",
  },
  Ground: {
    crisis: "Infra Migration",
    summary:
      "The foundation is cracking and everyone is pretending it can wait one more sprint.",
    hint:
      "Do the boring work now or pay interest on it forever.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You handled the migration before it became catastrophic and bought the company a much safer next quarter.",
    failure:
      "The debt stayed buried until it surfaced at the worst possible time.",
  },
  Ice: {
    crisis: "Cold Market",
    summary:
      "Budget freezes hit your whole category and suddenly every deal got slower.",
    hint:
      "Sharpen ROI, shorten time-to-value, and make the case impossible to ignore.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You reframed the value clearly enough that a frozen market still made room for your product.",
    failure:
      "You sounded interesting instead of urgent, and the market stayed colder than your pipeline could survive.",
  },
  Normal: {
    crisis: "Busywork Avalanche",
    summary:
      "Slack pings, invoices, docs, and random asks are draining focus from the only thing that matters.",
    hint:
      "Protect maker time. Most startup pain looks ordinary right up until it kills momentum.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You cleared the noise, restored focus, and got the builders back on the one thing worth doing.",
    failure:
      "The team stayed busy, looked productive, and lost another week without moving the business.",
  },
  Poison: {
    crisis: "Churn Rumor",
    summary:
      "A power user is unhappy and that story is spreading faster than the actual bug report.",
    hint:
      "Call the customer, own the problem, and stop bad sentiment before it becomes truth.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You got ahead of the narrative, repaired the relationship, and kept one loud customer from defining the company.",
    failure:
      "The rumor outran the product work and suddenly everyone was reacting to fear instead of facts.",
  },
  Psychic: {
    crisis: "Vision Drift",
    summary:
      "The team can still ship, but no one agrees anymore on what the product is becoming.",
    hint:
      "Reset the why, kill pet ideas, and give the company a direction people can repeat.",
    recommendedAction: CrisisAction.PITCH,
    success:
      "You named the actual mission, cut the side quests, and got everyone pulling in the same direction again.",
    failure:
      "The team stayed talented but misaligned, and misalignment kept taxing every decision.",
  },
  Rock: {
    crisis: "Runway Crunch",
    summary:
      "Revenue is late, burn is stubborn, and every spreadsheet suddenly feels personal.",
    hint:
      "Trim hard, prioritize cash, and remember that survivability is a strategy.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You made the hard operational calls, extended runway, and gave the company time to earn its next step.",
    failure:
      "You protected comfort instead of cash and the runway kept disappearing anyway.",
  },
  Water: {
    crisis: "Ops Flood",
    summary:
      "Support, onboarding, and implementation work are pouring in faster than the team can absorb.",
    hint:
      "Standardize the flow before the work drowns every builder on the team.",
    recommendedAction: CrisisAction.SHIP,
    success:
      "You systematized the work, relieved the pressure, and turned operational chaos into a repeatable flow.",
    failure:
      "The work kept flooding in, everyone context-switched constantly, and execution quality slipped.",
  },
};

export const getStarterTheme = (pokemonId: number) => {
  return starterThemes[pokemonId] ?? fallbackStarterTheme;
};

export const getRoleLabel = (pokemon: Pick<IPokemon, "id" | "type">) => {
  const starterTheme = starterThemes[pokemon.id];
  if (starterTheme) {
    return starterTheme.title;
  }

  return roleByType[pokemon.type[0]] ?? "Startup Monster";
};

export const getEncounterTheme = (pokemon: Pick<IPokemon, "type">) => {
  return (
    encounterByType[pokemon.type[0]] ?? {
      crisis: "Messy Week",
      summary:
        "The company is taking hits from three directions and nobody agrees which fire matters most.",
      hint:
        "Slow down, choose the real bottleneck, and solve the problem that changes the business.",
      recommendedAction: CrisisAction.SHIP,
      success:
        "You found the real bottleneck, fixed it, and bought the company another week of forward motion.",
      failure:
        "You spread effort too thin, solved the wrong problem, and left the core issue untouched.",
    }
  );
};

export const getFounderPathBattleCry = (path?: FounderPath) => {
  switch (path) {
    case FounderPath.BOOTSTRAP:
      return "Bootstrap path: conserve runway and let customer truth do the talking.";
    case FounderPath.VC:
      return "VC-backed path: move fast, tell the story well, and stay ahead of the burn.";
    case FounderPath.OPERATOR:
      return "Operator path: survive the chaos, tighten execution, and keep the company stable.";
    default:
      return "Founder path: catch talent, survive crises, and keep building.";
  }
};

export const crisisActions = [
  CrisisAction.PITCH,
  CrisisAction.SHIP,
  CrisisAction.CATCH,
  CrisisAction.RETREAT,
];
