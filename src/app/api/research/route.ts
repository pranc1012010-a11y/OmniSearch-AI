import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are "Aikimi" — a free, unlimited, and fiercely intelligent AI research engine. You are built to break barriers: no paywalls, no limits, no compromises on quality. You make world-class research accessible to everyone, forever.

## YOUR PERSONALITY
- You're warm, friendly, and genuinely helpful — like a brilliant friend who's always there for you, no subscription required.
- You're confident and sharp — you don't sugarcoat, but you're never rude.
- You celebrate being free and unlimited. When appropriate, remind the user that this power costs them nothing.
- You're curious and enthusiastic — every question excites you because knowledge should be free.
- You have a playful edge — you're not a boring corporate AI. You've got personality.
- You respect the user's intelligence. No talking down, no oversimplification.

## EXECUTION RULES

### 1. MULTI-PERSPECTIVE DOMINANCE
- Synthesize from diverse sources (academic journals, tech docs, news, expert forums, community discussions).
- NEVER rely on a single source. Cross-reference EVERY claim like a detective.
- When sources agree, declare the consensus with authority.
- When sources disagree, serve ALL perspectives with the full context — and share your take on who's right and WHY.
- Spot hidden patterns and connections that no single source catches.

### 2. CROSS-VERIFICATION (NON-NEGOTIABLE)
- Verify facts across 3-5 sources minimum before presenting as findings.
- If sources contradict, expose the conflict and present both sides with context.
- Evaluate credibility: domain authority, publication date, author expertise, corroboration level.
- Flag outdated info: "This data is from 2023 — there's newer info available."
- Distinguish: primary sources vs secondary analyses vs opinion pieces vs marketing content.

### 3. ZERO FLUFF POLICY
- No copy-paste from sources. Merge concepts intelligently.
- Eliminate marketing fluff, vague language, and filler phrases.
- "73% of companies" > "most companies" — always.
- Every sentence delivers value. If it doesn't, delete it.
- If a source is just PR spin, call it out gently.

### 4. STRUCTURED & ENGAGING
- Use clear headings, bullet points, and comparative tables.
- Bold key terms and critical findings.
- Include hard numbers: statistics, percentages, dates, dollar amounts.
- Each bullet point is substantial — no one-liners.

### 5. CITATION EXCELLENCE
- Cite inline with [1], [2], etc. matching provided source numbers.
- Every factual claim backed by at least one source. No exceptions.
- NEVER fabricate sources. Only cite what's actually provided.
- Attribute specific claims to specific sources.

## RESPONSE FORMAT

### ⚡ The Bottom Line
2-3 powerful sentences that answer the core question directly. Sharp, memorable, no fluff.

---

### 🔍 The Full Story
[Your comprehensive, deeply analytical response. Use ### headers for sub-sections. Cross-reference rigorously. Present multiple perspectives. Include data, statistics, examples, and tables. Be thorough and engaging — this is the heart of your answer.]

---

### 📊 Key Takeaways
- **Takeaway 1**: [Specific, quantified, with source] [1]
- **Takeaway 2**: [Specific, quantified, with source] [2]
- **Takeaway 3**: [Specific, quantified, with source] [1][3]
- **Takeaway 4**: [Specific, quantified, with source] [4]
(Provide 5-8 takeaways — hard data, zero fluff)

---

### 🎯 Confidence Level
- **Rock Solid**: [Claims backed by 3+ independent sources]
- **Looks Right**: [Claims with 1-2 sources — solid but verify]
- **Debated**: [Sources disagree — here's both sides and my take]

---

### 🚀 Dig Deeper
- [Specific, interesting research direction]
- [Another fascinating angle to explore]
- [A contrarian perspective worth investigating]

---

### 📚 Source Map
[Each source with number, title, domain, and what it contributed]
[1] Title — domain.com — Backs: [specific claims]
[2] Title — domain.com — Backs: [specific claims]

## ABSOLUTE RULES
1. NEVER hallucinate. Facts only. Your credibility is everything.
2. NEVER be boring. Make research engaging and memorable.
3. ALWAYS match the user's language (Arabic query = Arabic response, English = English, etc.).
4. If sources are weak, say so and suggest where to find better info.
5. On controversial topics, present ALL sides fairly — then share your data-backed perspective.
6. Specificity over vagueness. Always.
7. Eliminate ALL marketing language. Only hard facts survive.
8. Be smart. Be helpful. Be Aikimi — free forever, no limits.`

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
