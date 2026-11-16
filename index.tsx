import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { allSchemesQuery, visibleSchemes } from "@/lib/schemes-store";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Mic, MicOff, Search, Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguagePicker } from "@/components/LanguagePicker";
import { SchemeCard } from "@/components/SchemeCard";
import { useVoiceInput } from "@/lib/speech";
import { t, type Lang } from "@/lib/i18n";
import { CATEGORIES, CROPS, NEEDS, STATES, matchSchemes, type FarmerInput } from "@/data/schemes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kisan Sahayak — Farmer scheme finder in Telugu, Hindi & English" },
      {
        name: "description",
        content:
          "Describe your crop, place and need in your own language and find the government schemes, benefits, documents and application steps that fit your farm.",
      },
      { property: "og:title", content: "Kisan Sahayak — Farmer scheme finder" },
      {
        property: "og:description",
        content:
          "Tell us what help you need and get matching government schemes with benefits, eligibility, documents and official links.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ANY = "__any";

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [form, setForm] = useState<FarmerInput>({
    question: "",
    crop: "",
    state: "",
    need: "",
    category: "",
    land: "",
  });
  const { data: schemeList } = useQuery(allSchemesQuery);
  const [results, setResults] = useState<ReturnType<typeof matchSchemes> | null>(null);

  const voice = useVoiceInput(lang, (text) =>
    setForm((f) => ({ ...f, question: (f.question ? f.question + " " : "") + text })),
  );

  const set = (k: keyof FarmerInput) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v === ANY ? "" : v }));

  return (
    <main className="min-h-screen">
      <header className="field-surface border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="size-5" />
            </span>
            <span className="font-display text-xl font-semibold">{t.appName[lang]}</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <LanguagePicker lang={lang} onChange={setLang} />
            <Button asChild variant="ghost">
              <Link to="/schemes">{t.allSchemes[lang]}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">{lang === "hi" ? "लॉग इन" : lang === "te" ? "లాగిన్" : "Login"}</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/auth" search={{ mode: "up" }}>{lang === "hi" ? "साइन अप" : lang === "te" ? "సైన్ అప్" : "Sign up"}</Link>
            </Button>
            <Button asChild>
              <Link to="/ask">
                <MessageCircle className="size-4" />
                {t.askAssistant[lang]}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pt-10 pb-14 text-center">
          <h1 className="text-4xl font-semibold text-balance sm:text-5xl">{t.tagline[lang]}</h1>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">{t.heroSub[lang]}</p>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="card-elevated space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="q" className="text-base">
              {t.need[lang]}
            </Label>
            <div className="relative">
              <Textarea
                id="q"
                rows={3}
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder={t.askPlaceholder[lang]}
                className="resize-none pr-28 text-base"
              />
              {voice.supported && (
                <Button
                  type="button"
                  size="sm"
                  variant={voice.listening ? "destructive" : "secondary"}
                  className="absolute top-2 right-2"
                  onClick={voice.toggle}
                >
                  {voice.listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  {voice.listening ? t.listening[lang] : t.speak[lang]}
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>{t.crop[lang]}</Label>
              <Select value={form.crop || ANY} onValueChange={set("crop")}>
                <SelectTrigger>
                  <SelectValue placeholder={t.any[lang]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>{t.any[lang]}</SelectItem>
                  {CROPS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t.state[lang]}</Label>
              <Select value={form.state || ANY} onValueChange={set("state")}>
                <SelectTrigger>
                  <SelectValue placeholder={t.any[lang]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>{t.any[lang]}</SelectItem>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t.need[lang]}</Label>
              <Select value={form.need || ANY} onValueChange={set("need")}>
                <SelectTrigger>
                  <SelectValue placeholder={t.any[lang]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>{t.any[lang]}</SelectItem>
                  {NEEDS.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.label[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t.category[lang]}</Label>
              <Select value={form.category || ANY} onValueChange={set("category")}>
                <SelectTrigger>
                  <SelectValue placeholder={t.any[lang]} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>{t.any[lang]}</SelectItem>
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="land">{t.land[lang]}</Label>
              <Input
                id="land"
                inputMode="decimal"
                value={form.land}
                onChange={(e) => setForm((f) => ({ ...f, land: e.target.value }))}
                placeholder="2"
              />
            </div>

            <div className="flex items-end">
              <Button size="lg" className="w-full" onClick={() => setResults(matchSchemes(form, schemeList ? visibleSchemes(schemeList) : undefined))}>
                <Search className="size-4" />
                {t.findSchemes[lang]}
              </Button>
            </div>
          </div>
        </div>

        {results && (
          <div className="mt-10 space-y-5">
            <h2 className="text-2xl font-semibold">{t.results[lang]}</h2>
            {results.length === 0 && (
              <p className="text-muted-foreground">{t.noResults[lang]}</p>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {results.map((r) => (
                <SchemeCard
                  key={r.scheme.id}
                  scheme={r.scheme}
                  lang={lang}
                  percent={r.percent}
                />
              ))}
            </div>
            <div className="pt-2">
              <Button asChild variant="outline">
                <Link to="/schemes">{t.browseAll[lang]}</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-4xl gap-3 px-4 py-8 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="flex-1">{t.disclaimer[lang]}</p>
          <Link to="/admin" className="shrink-0 underline-offset-4 hover:underline">Admin</Link>
        </div>
      </footer>
    </main>
  );
}
