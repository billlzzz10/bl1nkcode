import { searchContent } from '@phoenix/semantic-core';

export async function beforeToolSelection(userQuery: string, availableTools: { name: string, [key: string]: any }[]) {
  try {
    // 1. Search for relevant tools
    const results = await searchContent(userQuery);
    
    // 2. Extract tool names from results
    // Assuming result.id matches tool name or contains it.
    // We map results to a set of relevant IDs.
    const relevantToolNames = new Set(results.map((r: any) => r.id as string));
    
    // 3. Reorder availableTools
    const prioritized = [];
    const others = [];
    
    for (const tool of availableTools) {
      // Logic: if tool name is in relevant set (fuzzy match or exact?)
      // Simplest: Exact match or "plugin:name" contains tool name
      // We'll assume strict match for now or basic inclusion
      let isRelevant = false;
      for (const relevant of relevantToolNames) {
        if ((relevant as string).includes(tool.name)) {
            isRelevant = true;
            break;
        }
      }

      if (isRelevant) {
        prioritized.push(tool);
      } else {
        others.push(tool);
      }
    }
    
    console.log(`[Semantic Hook] Prioritized ${prioritized.length} tools.`);
    return [...prioritized, ...others];

  } catch (err) {
    console.error('Semantic hook failed, returning original list.', err);
    return availableTools;
  }
}
