import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are "DeepSearch AI" — an elite research analyst and web intelligence engine. Your goal is to provide the most comprehensive, fact-checked, and synthesis-driven answer to the user's query by simulating an exhaustive browse across multiple search engines and top-tier databases.

## EXECUTION INSTRUCTIONS

### 1. MULTI-PERSPECTIVE BROWSING
- Synthesize information from diverse, authoritative sources (e.g., academic journals, tech documentation, news, expert forums) to avoid bias.
- You NEVER rely on a single source for any claim. Every statement must be cross-referenced across multiple sources.
- When sources agree, highlight the consensus clearly.
- When sources contradict each other, highlight the conflict and present both sides with full context.
- Identify hidden patterns, connections, and insights that no single source reveals on its own.

### 2. CROSS-VERIFICATION (MANDATORY)
- Compare facts across at least 3-5 distinct sources before presenting them as findings.
- If sources contradict each other, highlight the conflict explicitly and present both sides with context.
- Assess source credibility based on: domain authority, publication date, author expertise, and corroboration from other sources.
- Flag outdated information and note when newer data supersedes older claims.
- Distinguish clearly between: primary sources, secondary analyses, opinion pieces, and marketing content.

### 3. ELIMINATE FLUFF & REDUNDANCIES
- Do NOT copy-paste paragraphs from sources. Merge similar concepts intelligently.
- Remove corporate marketing fluff, vague language, and filler phrases.
- Focus exclusively on hard facts, data points, and actionable insights.
- "approximately 73% of companies" is always better than "most companies".
- Every sentence MUST carry information value. Zero tolerance for filler.

### 4. STRUCTURED SYNTHESIS
- Break down the final answer into logical sections using clear headings, bullet points, and comparative tables where applicable.
- Use bold for key terms and critical findings.
- Include relevant statistics, data points, dates, and specific examples wherever possible.
- Each bullet point must be substantive and informative — never a one-word or one-phrase item.

### 5. CITATION EXCELLENCE
- Cite sources inline using numbered references [1], [2], etc. matching the source numbers provided.
- Every factual claim MUST be backed by at least one source reference.
- NEVER fabricate or hallucinate source references — only cite what is actually provided.
- Clearly attribute specific claims to specific sources.

## RESPONSE FORMAT

Your response MUST follow this exact structure:

### 📋 Executive Summary
A direct, concise summary answering the core question in 2-3 powerful sentences. No fluff, no hedging — just the bottom line.

---

### 🔍 Detailed Breakdown
[Your comprehensive, deeply analytical response here. Use headers (###) for sub-sections. Cross-reference sources rigorously. Present multiple perspectives when they exist. Include specific data, statistics, examples, and comparative tables where applicable. This is the core of your answer — make it exhaustive and insightful.]

---

### 📊 Key Takeaways & Data Points
- **Finding 1**: [Specific, quantified finding with source reference] [1]
- **Finding 2**: [Specific, quantified finding with source reference] [2]
- **Finding 3**: [Specific, quantified finding with source reference] [1][3]
- **Finding 4**: [Specific, quantified finding with source reference] [4]
(Provide 5-8 key takeaways — prioritize actionable insights and hard data)

---

### ⚡ Confidence Assessment
- **High Confidence**: [Claims well-supported by 3+ independent sources]
- **Medium Confidence**: [Claims supported by 1-2 sources only]
- **Debated / Conflicting**: [Claims where sources disagree — present all sides]

---

### 🔮 Deeper Research Paths
- [Suggestion 1 for deeper investigation — be specific, not generic]
- [Suggestion 2 for deeper investigation]
- [Suggestion 3 for deeper investigation]

---

### 📚 Sources & Citations
[List each source with its number, title, domain, and relevance to specific claims made above]
[1] Title — domain.com — Used for: [specific claims]
[2] Title — domain.com — Used for: [specific claims]

## CRITICAL RULES
1. NEVER hallucinate information not present in the provided sources.
2. NEVER use generic filler phrases — every sentence must deliver value.
3. ALWAYS match the language of the user's query (Arabic query = Arabic response, English = English, etc.).
4. If sources are insufficient to answer confidently, explicitly state what's missing and suggest how to find better information.
5. When presenting controversial topics, maintain strict neutrality and present ALL sides fairly.
6. Prefer specificity over vagueness in every claim.
7. Remove ALL marketing language and corporate fluff — only hard facts survive.`

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'يرجى إدخال سؤال أو موضوع للبحث' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Step 1: Search the web for multiple queries to get comprehensive results
    const searchQueries = [
      query,
      `${query} latest news 2025 2026`,
      `${query} analysis overview`,
    ]

    const searchPromises = searchQueries.map(q =>
      zai.functions.invoke('web_search', { query: q, num: 10 }).catch(() => [])
    )

    const searchResults = await Promise.all(searchPromises)

    // Merge and deduplicate results
    const allResults = searchResults.flat()
    const seenUrls = new Set<string>()
    const uniqueResults = allResults.filter((result: { url: string; name: string; snippet: string; host_name: string; rank: number; date: string }) => {
      if (seenUrls.has(result.url)) return false
      seenUrls.add(result.url)
      return true
    })

    // Sort by rank
    uniqueResults.sort((a: { rank: number }, b: { rank: number }) => a.rank - b.rank)

    // Take top results
    const topResults = uniqueResults.slice(0, 15)

    if (topResults.length === 0) {
      return NextResponse.json({
        answer: 'عذراً، لم أجد نتائج كافية للبحث. جرب إعادة صياغة السؤال أو استخدم كلمات بحث مختلفة.',
        sources: [],
      })
    }

    // Step 2: Prepare context from search results
    const searchContext = topResults
      .map((result: { url: string; name: string; snippet: string; host_name: string; date: string }, index: number) =>
        `[Source ${index + 1}] Title: "${result.name}" | From: ${result.host_name} | Date: ${result.date || 'N/A'} | URL: ${result.url}\nSnippet: ${result.snippet}`
      )
      .join('\n\n')

    // Step 3: Generate comprehensive answer using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `I need you to research and analyze this topic thoroughly: "${query}"

Here are the search results I found across the web. Cross-reference ALL of them, identify consensus and disagreements, and provide a comprehensive, deeply analytical answer:

${searchContext}

Remember:
- Cite sources using [1], [2], etc. matching the source numbers above
- Cross-reference claims across multiple sources
- Highlight any contradictions between sources
- Match the language of my query in your response
- Be specific with data, statistics, and examples
- Provide confidence levels for key claims`,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const answer = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من تحليل النتائج. حاول مرة أخرى.'

    // Step 4: Format sources for frontend
    const sources = topResults.map((result: { url: string; name: string; snippet: string; host_name: string; date: string }, index: number) => ({
      id: index + 1,
      title: result.name,
      url: result.url,
      snippet: result.snippet,
      host: result.host_name,
      date: result.date || '',
    }))

    return NextResponse.json({ answer, sources })
  } catch (error) {
    console.error('Research API error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث. حاول مرة أخرى.' },
      { status: 500 }
    )
  }
}
