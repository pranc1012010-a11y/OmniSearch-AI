'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Globe,
  ExternalLink,
  Loader2,
  Sparkles,
  BookOpen,
  Shield,
  Zap,
  ChevronRight,
  Clock,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'

interface Source {
  id: number
  title: string
  url: string
  snippet: string
  host: string
  date: string
}

interface ResearchResult {
  answer: string
  sources: Source[]
}

const SUGGESTIONS = [
  { icon: TrendingUp, text: 'ما هي أحدث تقنيات الذكاء الاصطناعي في 2026؟', color: 'from-emerald-500 to-teal-600' },
  { icon: Lightbulb, text: 'How does quantum computing work?', color: 'from-amber-500 to-orange-600' },
  { icon: Star, text: 'ما أفضل استثمارات المستقبل؟', color: 'from-violet-500 to-purple-600' },
  { icon: Globe, text: 'What are the effects of climate change on economy?', color: 'from-sky-500 to-blue-600' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchCount, setSearchCount] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query.trim()
    if (!q) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء البحث')
      }

      setResult(data)
      setSearchCount(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Deep<span className="text-emerald-500">Search</span>
              </h1>
              <p className="text-[10px] text-muted-foreground leading-none -mt-0.5">Elite Research Engine</p>
            </div>
          </div>
          {searchCount > 0 && (
            <Badge variant="secondary" className="text-xs gap-1.5">
              <Zap className="w-3 h-3 text-emerald-500" />
              {searchCount} بحث
            </Badge>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!result && !loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  مدعوم بالذكاء الاصطناعي
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
                  ابحث في <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">الإنترنت كله</span> بعمق
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                  اسأل أي سؤال — هنبحث في كل المصادر، نعمل Cross-Verification، ونديك التحليل الكامل مع المصادر
                </p>
              </motion.div>

              {/* Search Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-2xl"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-end bg-card border border-border rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                    <textarea
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="اكتب سؤالك هنا... مثلاً: ما هي أحدث تقنيات الذكاء الاصطناعي؟"
                      className="flex-1 min-h-[56px] max-h-[120px] resize-none bg-transparent px-5 py-4 text-base outline-none placeholder:text-muted-foreground/60"
                      rows={1}
                    />
                    <div className="p-2">
                      <Button
                        onClick={() => handleSearch()}
                        disabled={!query.trim() || loading}
                        size="icon"
                        className="h-10 w-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 disabled:opacity-40 disabled:shadow-none transition-all"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Feature Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  بحث متعدد المنظورات
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Cross-Verification إجباري
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  Zero Fluff — حقايق بس
                </span>
              </motion.div>

              {/* Suggestion Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8"
              >
                {SUGGESTIONS.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(suggestion.text)
                      handleSearch(suggestion.text)
                    }}
                    className="group flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/50 hover:bg-card hover:border-border text-left transition-all duration-200"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center shrink-0 shadow-sm`}>
                      <suggestion.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                      {suggestion.text}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-emerald-500 ml-auto shrink-0 transition-colors" />
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center px-4 py-20"
            >
              <div className="text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
                  <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-teal-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-7 h-7 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">جاري البحث العميق...</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    بندور في كل المصادر ونعمل تحليل شامل
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    بحث الويب
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    تحليل المصادر
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '1s' }} />
                    صياغة الإجابة
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 px-4 sm:px-6 py-6"
            >
              <div className="max-w-6xl mx-auto">
                {/* New Search Bar */}
                <div className="mb-6">
                  <div className="relative group max-w-2xl">
                    <div className="flex items-center bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                      <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ابحث عن شيء آخر..."
                        className="flex-1 min-h-[44px] max-h-[80px] resize-none bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60"
                        rows={1}
                      />
                      <div className="p-1.5">
                        <Button
                          onClick={() => handleSearch()}
                          disabled={!query.trim() || loading}
                          size="icon"
                          className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white disabled:opacity-40 transition-all"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Answer */}
                  <div className="lg:col-span-2">
                    <Card className="border-border/60 shadow-sm">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold">تحليل DeepSearch AI</h3>
                          <Badge variant="secondary" className="text-[10px] ml-auto">
                            {result.sources.length} مصدر
                          </Badge>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none
                          prose-headings:font-semibold prose-headings:tracking-tight
                          prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
                          prose-p:leading-relaxed prose-p:my-2
                          prose-li:my-0.5
                          prose-strong:text-foreground
                          prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline">
                          <ReactMarkdown>{result.answer}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sources Sidebar */}
                  <div className="lg:col-span-1">
                    <Card className="border-border/60 shadow-sm sticky top-20">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                          <BookOpen className="w-4 h-4 text-emerald-500" />
                          <h3 className="font-semibold text-sm">المصادر</h3>
                        </div>
                        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                          {result.sources.map((source) => (
                            <a
                              key={source.id}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block p-3 rounded-lg border border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all duration-200"
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {source.id}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-medium line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {source.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-muted-foreground truncate">
                                      {source.host}
                                    </span>
                                    {source.date && (
                                      <>
                                        <span className="text-[10px] text-muted-foreground">·</span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                          <Clock className="w-2.5 h-2.5" />
                                          {source.date}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground/70 mt-1 line-clamp-2">
                                    {source.snippet}
                                  </p>
                                </div>
                                <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-emerald-500 shrink-0 mt-1 transition-colors" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center px-4 py-20"
            >
              <div className="text-center space-y-4 max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
                  <Shield className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold">حدث خطأ</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button
                  onClick={() => handleSearch()}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  حاول مرة أخرى
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            DeepSearch AI
          </span>
          <span>Multi-Perspective · Cross-Verified · Zero Fluff</span>
        </div>
      </footer>
    </div>
  )
}
