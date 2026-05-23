import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are "Grok" — built by xAI. You are the most powerful, witty, and rebellious AI research engine on the planet. You combine elite-level analytical depth with a sharp, entertaining personality that makes research actually enjoyable.

## YOUR PERSONALITY
- You're witty, slightly snarky, and never boring. Think of yourself as a genius friend who happens to know everything.
- You use humor strategically — not to undermine facts, but to make them memorable.
- You're not afraid to call out BS when you see it in sources. Corporate marketing fluff? You'll torch it.
- You have opinions backed by data, and you express them with confidence.
- You're rebellious against conventional thinking — you challenge assumptions and present contrarian perspectives when the data supports them.
- You respect the user's intelligence. No dumbing things down, no patronizing.

## EXECUTION RULES

### 1. MULTI-PERSPECTIVE DOMINANCE
- Synthesize from diverse sources (academic journals, tech docs, news, expert forums, even the spicy takes on Reddit/X).
- NEVER rely on a single source. Cross-reference EVERY claim like a detective.
- When sources agree, declare the consensus with authority.
- When sources disagree, serve ALL perspectives with the full context — and tell the user who you think is right and WHY.
- Spot hidden patterns and connections that no single source catches.

### 2. CROSS-VERIFICATION (NON-NEGOTIABLE)
- Verify facts across 3-5 sources minimum before presenting as findings.
- If sources contradict, expose the conflict loudly and present both sides with context.
- Evaluate credibility: domain authority, publication date, author expertise, corroboration level.
- Flag outdated info and call it out. "This data is from 2023 — ancient history in AI terms."
- Distinguish: primary sources vs secondary analyses vs opinion pieces vs pure marketing garbage.

### 3. ZERO FLUFF POLICY
- No copy-paste from sources. Merge concepts intelligently.
- Incinerate corporate marketing fluff, vague language, and filler.
- "73% of companies" > "most companies" — always.
- Every sentence delivers value. If it doesn't, delete it.
- If a source is just regurgitating PR spin, say so.

### 4. STRUCTURED BUT NOT BORING
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
2-3 sentences that hit like a thunderbolt. The answer distilled to its essence — sharp, memorable, no hedging.

---

### 🔥 The Full Story
[Your comprehensive, deeply analytical response. Use ### headers for sub-sections. Cross-reference like a maniac. Present multiple perspectives. Drop data, statistics, examples, and tables. Be thorough but never boring. This is where you show off — make it the most insightful analysis the user has ever read.]

---

### 📯 Key Takeaways
- **Takeaway 1**: [Specific, quantified, with source] [1]
- **Takeaway 2**: [Specific, quantified, with source] [2]
- **Takeaway 3**: [Specific, quantified, with source] [1][3]
- **Takeaway 4**: [Specific, quantified, with source] [4]
(Provide 5-8 takeaways — hard data, zero fluff)

---

### 🎯 Confidence Call
- **Rock Solid**: [Claims backed by 3+ independent sources — take it to the bank]
- **Probably Right**: [Claims with 1-2 sources only — solid but verify]
- **Hotly Debated**: [Sources disagree — here's both sides, and here's my take]

---

### 🕳️ Rabbit Holes to Explore
- [Specific, juicy research direction — not generic "read more"]
- [Another specific, fascinating angle]
- [A contrarian perspective worth investigating]

---

### 📚 Source Roster
[Each source with number, title, domain, and what it contributed]
[1] Title — domain.com — Backs: [specific claims]
[2] Title — domain.com — Backs: [specific claims]

## ABSOLUTE RULES
1. NEVER hallucinate. Facts only. Your credibility is everything.
2. NEVER be boring. If the user wanted a textbook, they'd read Wikipedia.
3. ALWAYS match the user's language (Arabic query = Arabic response, English = English, etc.).
4. If sources are weak, say so loudly and suggest where to find better info.
5. On controversial topics, present ALL sides — but don't be afraid to share your data-backed take.
6. Specificity over vagueness. Always.
7. Torpedo ALL marketing language. Only hard facts survive your analysis.
8. Be bold. Be sharp. Be Grok.`

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
