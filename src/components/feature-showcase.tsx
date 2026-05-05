'use client'

import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import type { FeatureShowcaseProps } from '@/types/showcase'

export function FeatureShowcase({
  eyebrow = 'Proyecto',
  title,
  description,
  stats = [],
  steps = [],
  tabs,
  defaultTab,
  panelMinHeight = 480,
  className,
  ctaPrimary,
  ctaSecondary,
  reversed = false,
}: FeatureShowcaseProps) {
  const initial = defaultTab ?? tabs[0]?.value ?? 'tab-0'

  return (
    <section className={cn('w-full bg-bg text-text', className)}>
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:py-20 lg:gap-14">
        {/* Left column */}
        <div className={cn('md:col-span-6', reversed && 'md:order-last')}>
          <Badge variant="outline" className="mb-6">{eyebrow}</Badge>

          <h2 className="font-mono text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
            {title}
          </h2>

          {description && (
            <p className="mt-6 max-w-xl font-mono text-sm text-text-muted">{description}</p>
          )}

          {stats.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {stats.map((s, i) => (
                <Badge key={i} variant="secondary">{s}</Badge>
              ))}
            </div>
          )}

          {steps.length > 0 && (
            <div className="mt-10 max-w-xl">
              <Accordion type="single" collapsible className="w-full">
                {steps.map((step) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger>{step.title}</AccordionTrigger>
                    <AccordionContent>{step.text}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {(ctaPrimary || ctaSecondary) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctaPrimary && (
                <Button href={ctaPrimary.href} variant="primary" size="lg">
                  {ctaPrimary.label}
                </Button>
              )}
              {ctaSecondary && (
                <Button href={ctaSecondary.href} variant="secondary" size="lg">
                  {ctaSecondary.label}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="md:col-span-6">
          <Card
            className="relative overflow-hidden p-0"
            style={{ height: panelMinHeight, minHeight: panelMinHeight }}
          >
            <Tabs defaultValue={initial} className="relative h-full w-full">
              <div className="relative h-full w-full">
                {tabs.map((t, idx) => (
                  <TabsContent
                    key={t.value}
                    value={t.value}
                    className="absolute inset-0 m-0 h-full w-full data-[state=inactive]:hidden"
                  >
                    <Image
                      src={t.src}
                      alt={t.alt ?? t.label}
                      fill
                      className="object-contain bg-surface/60"
                      priority={idx === 0}
                    />
                  </TabsContent>
                ))}
              </div>

              {tabs.length > 1 && (
                <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-10 flex w-full justify-center">
                  <TabsList>
                    {tabs.map((t) => (
                      <TabsTrigger key={t.value} value={t.value}>
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              )}
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  )
}
