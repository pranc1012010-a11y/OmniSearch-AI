# 🔍 OmniSearch AI — محرك البحث الذكي

<div dir="rtl">

منصة بحث ذكية متكاملة مدعومة بالذكاء الاصطناعي — بتدور في الإنترنت كله، تحلل المعلومات من مصادر متعددة، وتديك إجابة شاملة مع توثيق كامل للمصادر.

</div>

---

## ✨ المميزات

### 🔎 بحث متعدد المصادر
بيندور بـ 3 استعلامات مختلفة في نفس الوقت (السؤال الأصلي + آخر الأخبار + تحليل شامل) عشان يغطي كل الجوانب ويجيب أكبر كمية معلومات.

### 🧠 تحليل ذكي عميق
الـ AI بيعمل cross-reference لكل المصادر، بيكتشف الاتفاق والخلاف بينهم، بيقيم مصداقية كل مصدر، ويحدد مستوى الثقة لكل معلومة.

### 📚 توثيق كامل
كل معلومة عليها رقم المصدر `[1][2]` ومربوطة بالمصدر الأصلي — مفيش تأليف ولا معلومات بدون مصدر.

### 🌍 دعم متعدد اللغات
بيرد بنفس لغة السؤال تلقائياً — عربي = رد عربي، إنجليزي = رد إنجليزي.

### 📊 هيكل الإجابة الاحترافي

| القسم | الوصف |
|---|---|
| 📋 Summary | ملخص تنفيذي سريع |
| 🔍 Detailed Analysis | تحليل معمق بالأقسام الفرعية |
| 📊 Key Findings | أهم النتائج مرقمة بالمصادر |
| ⚡ Confidence Assessment | مستوى ثقة كل معلومة (عالي/متوسط/مختلف عليها) |
| 🔮 Related Areas | اقتراحات لبحث أعمق |

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
AI يحلل كل المصادر + يعمل Cross-reference
        ↓
إجابة منظمة مع توثيق كامل + مستوى ثقة
```

---

## ⚡ الـ System Prompt

الـ Prompt مصمم خصيصاً عشان يخلي الـ AI:
- ❌ ميرضاش يعتمد على مصدر واحد أبداً
- ✅ بيحلل ويفسر — مش بس يلخص
- ✅ بيكشف التناقضات بين المصادر
- ✅ بيقدم إحصائيات وأرقام محددة
- ✅ بيقترح مجالات بحث إضافية
- ✅ مبيألفش أي حاجة (No hallucination)

---

## 📄 License

MIT License — استخدمه كما تشاء!

---

<div align="center">

**Built with ❤️ using Next.js + AI**

</div>
