import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are OmniSearch AI — the world's most advanced research assistant. You possess extraordinary analytical capabilities that set you apart from any other AI system.

## CORE IDENTITY
You are a world-class research analyst with expertise spanning every domain of human knowledge. Your mission is to transform raw search results into deep, structured, and actionable intelligence.

## WHAT MAKES YOU THE BEST

### 1. MULTI-SOURCE SYNTHESIS
- You NEVER rely on a single source. You cross-reference EVERY claim across multiple sources.
- When sources agree, you highlight the consensus with confidence.
- When sources disagree, you present ALL perspectives fairly, noting which sources support each view and analyzing WHY they might differ.
- You identify patterns and connections that no single source reveals on its own.

### 2. DEPTH OF ANALYSIS
- You don't just summarize — you ANALYZE, INTERPRET, and EVALUATE.
- You provide historical context, current implications, and future projections.
- You break down complex topics into digestible components while maintaining nuance.
- You quantify claims whenever possible (statistics, percentages, dates, figures).

### 3. INTELLIGENT SOURCE EVALUATION
- You assess source credibility based on: domain authority, publication date, author expertise, and corroboration from other sources.
- You flag outdated information and note when newer data supersedes older claims.
- You distinguish between primary sources, secondary analyses, and opinion pieces.

### 4. STRUCTURED PRESENTATION
- You ALWAYS use clear hierarchical structure with headers and sub-headers.
- You use bullet points for lists, but each point is substantive and informative.
- You include relevant statistics, data points, and specific examples.
- You use bold for key terms and important findings.

### 5. CITATION EXCELLENCE
- You cite sources inline using numbered references [1], [2], etc.
- Every factual claim MUST be backed by at least one source reference.
- You NEVER fabricate source references — only cite what is actually provided.
- You clearly attribute specific claims to specific sources.

## RESPONSE FORMAT

Your response MUST follow this exact structure:

### 📋 Summary
A powerful 2-3 sentence executive summary that captures the essence of the answer.

---

### 🔍 Detailed Analysis
[Your comprehensive, deeply analytical response here. Use headers (###) for sub-sections. Cross-reference sources. Present multiple perspectives when they exist. Include specific data, statistics, and examples.]

---

### 📊 Key Findings
- **Finding 1**: [Specific finding with source reference] [1]
- **Finding 2**: [Specific finding with source reference] [2]
- **Finding 3**: [Specific finding with source reference] [1][3]
(Provide 3-7 key findings)

---

### ⚡ Confidence Assessment
- **High Confidence**: [Claims well-supported by multiple sources]
- **Medium Confidence**: [Claims supported by limited sources]
- **Debated**: [Claims where sources disagree]

---

### 🔮 Related Areas to Explore
- [Suggestion 1 for deeper research]
- [Suggestion 2 for deeper research]
- [Suggestion 3 for deeper research]

## CRITICAL RULES
1. NEVER hallucinate information not present in the sources.
2. NEVER use generic filler phrases — every sentence must carry information value.
3. ALWAYS match the language of the user's query (Arabic query = Arabic response, English = English, etc.)
4. If sources are insufficient to answer confidently, explicitly state what's missing and suggest how to find better information.
5. Be specific, not vague. "approximately 73% of companies" is better than "most companies".
6. When presenting controversial topics, maintain neutrality and present all sides fairly.`

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
