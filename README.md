# 🔍 DeepSearch AI — محرك البحث الذكي

<div dir="rtl">

منصة بحث ذكية متكاملة مدعومة بالذكاء الاصطناعي — بتدور في الإنترنت كله من منظورات متعددة، تعمل Cross-Verification لكل المعلومات، تزيل الـ Fluff والـ Marketing، وتديك تحليل عميق مع توثيق كامل للمصادر.

</div>

---

## ✨ المميزات اللي تخليه الأقوى

### 🔎 Multi-Perspective Browsing
بيندور بـ 3 استعلامات مختلفة في نفس الوقت (السؤال الأصلي + آخر الأخبار + تحليل شامل) عشان يغطي كل الجوانب ويجيب أكبر كمية معلومات من مصادر متنوعة.

### ✅ Cross-Verification (إجباري)
كل معلومة لازم تتأكد من 3-5 مصادر مختلفة قبل ما تتعرض. لو المصادر بتتناقض، البيّن الخلاف والجنبين مع السياق الكامل.

### 🚫 Zero Fluff
بيشيل أي Marketing Fluff، لغة غامضة، أو Filler — وبيركز على الحقايق الصلبة والبيانات والأرقام بس. "73% من الشركات" أحسن بكتير من "معظم الشركات".

### 📚 توثيق كامل
كل معلومة عليها رقم المصدر `[1][2]` ومربوطة بالمصدر الأصلي — مفيش تأليف ولا معلومات بدون مصدر.

### 🌍 دعم متعدد اللغات
بيرد بنفس لغة السؤال تلقائياً — عربي = رد عربي، إنجليزي = رد إنجليزي.

### 📊 هيكل الإجابة الاحترافي

| القسم | الوصف |
|---|---|
| 📋 Executive Summary | ملخص تنفيذي مباشر ومختصر |
| 🔍 Detailed Breakdown | تحليل معمق بالأقسام الفرعية وجداول مقارنة |
| 📊 Key Takeaways & Data Points | أهم النتائج مرقمة بالمصادر (5-8 نتائج) |
| ⚡ Confidence Assessment | مستوى ثقة كل معلومة (عالي/متوسط/مختلف عليها) |
| 🔮 Deeper Research Paths | اقتراحات محددة لبحث أعمق |
| 📚 Sources & Citations | قائمة كاملة بالمصادر واستخدام كل واحد |

---

## 🛠️ التقنيات

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **AI**: z-ai-web-dev-sdk (Web Search + Chat Completions)
- **Markdown**: react-markdown
- **Icons**: Lucide React

---

## 🚀 التشغيل

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Open in browser
http://localhost:3000
```

---

## 🏗️ هيكل المشروع

```
src/
├── app/
│   ├── api/
│   │   └── research/
│   │       └── route.ts        # Backend: Web Search + AI Analysis
│   ├── globals.css              # Custom styles & animations
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main UI: Search + Results + Sources
├── components/
│   └── ui/                      # shadcn/ui components
└── lib/
    └── utils.ts                 # Utility functions
```

---

## 🤖 كيف يعمل؟

```
المستخدم يكتب سؤال
        ↓
3 بحث متزامن على الويب (سؤال + أخبار + تحليل)
        ↓
دمج وتصنيف النتائج (حتى 15 مصدر)
        ↓
DeepSearch AI يعمل:
  → Multi-Perspective Synthesis
  → Cross-Verification (3-5 مصادر لكل معلومة)
  → Eliminate Fluff & Redundancies
  → Structured Synthesis مع جداول مقارنة
        ↓
إجابة منظمة مع توثيق كامل + مستوى ثقة + مصادر
```

---

## ⚡ الـ System Prompt

الـ Prompt مصمم خصيصاً عشان يخلي الـ AI:
- ❌ ميرضاش يعتمد على مصدر واحد أبداً (3-5 مصادر إجباري)
- ✅ بيعمل Cross-Verification لكل معلومة
- ✅ بيكشف التناقضات وبيقدم كل الجوانب
- ✅ بيشيل أي Fluff أو Marketing Language
- ✅ بيفضل الأرقام المحددة على الكلام العام
- ✅ بيقترح مسارات بحث محددة (مش عامة)
- ✅ مبيألفش أي حاجة (No hallucination)

---

## 📄 License

MIT License — استخدمه كما تشاء!

---

<div align="center">

**Built with ❤️ using Next.js + AI**

</div>
