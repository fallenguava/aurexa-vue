<template>
  <div
    class="relative overflow-hidden rounded-4xl bg-[radial-gradient(circle_at_18%_22%,rgba(244,191,36,0.28),transparent_38%),linear-gradient(158deg,#0f172a_0%,#1d4ed8_48%,#0f766e_100%)] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.32)] sm:p-8"
  >
    <!-- Ambient orbs -->
    <div class="absolute -left-12 top-12 h-44 w-44 rounded-full bg-amber-300/15 blur-3xl" />
    <div class="absolute -right-10 bottom-6 h-40 w-40 rounded-full bg-cyan-300/12 blur-3xl" />

    <div class="relative flex h-full flex-col justify-between gap-8">
      <!-- Header copy -->
      <div class="space-y-5">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur"
        >
          <span class="h-2 w-2 rounded-full bg-amber-300" />
          Finance OS
        </div>

        <div class="space-y-3">
          <h1 class="max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">
            Move money with more clarity and less friction.
          </h1>
          <p class="max-w-lg text-sm leading-6 text-white/75 sm:text-base">
            Aurexa gives your team one focused place to track pockets, review transactions, and keep
            every balance visible before decisions become expensive.
          </p>
        </div>
      </div>

      <!-- Dashboard graphic -->
      <div class="grid gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
        <!-- Main chart card -->
        <div class="rounded-3xl border border-white/12 bg-slate-950/35 p-5 backdrop-blur-md">
          <svg
            viewBox="0 0 440 262"
            class="w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <!-- Header labels -->
            <text
              x="0"
              y="13"
              font-family="ui-sans-serif,sans-serif"
              font-size="9.5"
              fill="rgba(255,255,255,0.38)"
              letter-spacing=".08em"
            >
              REVENUE VS EXPENSES
            </text>
            <text
              x="440"
              y="13"
              text-anchor="end"
              font-family="ui-sans-serif,sans-serif"
              font-size="9.5"
              fill="rgba(255,255,255,0.28)"
            >
              Jul 2025
            </text>

            <!-- Grid lines -->
            <line
              x1="0"
              y1="28"
              x2="440"
              y2="28"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="1"
            />
            <line
              x1="0"
              y1="68"
              x2="440"
              y2="68"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="1"
            />
            <line
              x1="0"
              y1="108"
              x2="440"
              y2="108"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="1"
            />
            <line
              x1="0"
              y1="148"
              x2="440"
              y2="148"
              stroke="rgba(255,255,255,0.06)"
              stroke-width="1"
            />

            <!-- Y-axis labels -->
            <text
              x="0"
              y="31"
              font-family="ui-monospace,monospace"
              font-size="8.5"
              fill="rgba(255,255,255,0.22)"
            >
              200k
            </text>
            <text
              x="0"
              y="71"
              font-family="ui-monospace,monospace"
              font-size="8.5"
              fill="rgba(255,255,255,0.22)"
            >
              150k
            </text>
            <text
              x="0"
              y="111"
              font-family="ui-monospace,monospace"
              font-size="8.5"
              fill="rgba(255,255,255,0.22)"
            >
              100k
            </text>
            <text
              x="0"
              y="151"
              font-family="ui-monospace,monospace"
              font-size="8.5"
              fill="rgba(255,255,255,0.22)"
            >
              50k
            </text>

            <!-- Bars: Revenue (amber) + Expenses (rose) per month -->
            <!-- Feb -->
            <rect x="34" y="78" width="17" height="90" rx="3.5" fill="rgba(251,191,36,0.82)" />
            <rect x="54" y="108" width="17" height="60" rx="3.5" fill="rgba(244,63,94,0.60)" />
            <!-- Mar -->
            <rect x="100" y="66" width="17" height="102" rx="3.5" fill="rgba(251,191,36,0.82)" />
            <rect x="120" y="100" width="17" height="68" rx="3.5" fill="rgba(244,63,94,0.60)" />
            <!-- Apr -->
            <rect x="166" y="56" width="17" height="112" rx="3.5" fill="rgba(251,191,36,0.82)" />
            <rect x="186" y="97" width="17" height="71" rx="3.5" fill="rgba(244,63,94,0.60)" />
            <!-- May -->
            <rect x="232" y="48" width="17" height="120" rx="3.5" fill="rgba(251,191,36,0.85)" />
            <rect x="252" y="93" width="17" height="75" rx="3.5" fill="rgba(244,63,94,0.62)" />
            <!-- Jun -->
            <rect x="298" y="40" width="17" height="128" rx="3.5" fill="rgba(251,191,36,0.88)" />
            <rect x="318" y="88" width="17" height="80" rx="3.5" fill="rgba(244,63,94,0.64)" />
            <!-- Jul — highlighted -->
            <rect x="364" y="28" width="17" height="140" rx="3.5" fill="rgba(251,191,36,1.00)" />
            <rect x="384" y="82" width="17" height="86" rx="3.5" fill="rgba(244,63,94,0.72)" />

            <!-- X-axis month labels -->
            <text
              x="42"
              y="180"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.28)"
            >
              Feb
            </text>
            <text
              x="108"
              y="180"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.28)"
            >
              Mar
            </text>
            <text
              x="174"
              y="180"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.28)"
            >
              Apr
            </text>
            <text
              x="240"
              y="180"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.28)"
            >
              May
            </text>
            <text
              x="306"
              y="180"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.28)"
            >
              Jun
            </text>
            <text
              x="372"
              y="180"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="9.5"
              font-weight="600"
              fill="rgba(255,255,255,0.70)"
            >
              Jul
            </text>

            <!-- Legend -->
            <rect x="0" y="190" width="9" height="4" rx="2" fill="rgba(251,191,36,0.9)" />
            <text
              x="13"
              y="195"
              font-family="ui-sans-serif,sans-serif"
              font-size="9"
              fill="rgba(255,255,255,0.40)"
            >
              Revenue
            </text>
            <rect x="62" y="190" width="9" height="4" rx="2" fill="rgba(244,63,94,0.72)" />
            <text
              x="76"
              y="195"
              font-family="ui-sans-serif,sans-serif"
              font-size="9"
              fill="rgba(255,255,255,0.40)"
            >
              Expenses
            </text>

            <!-- Jul callout tooltip -->
            <line
              x1="373"
              y1="28"
              x2="373"
              y2="170"
              stroke="rgba(255,255,255,0.10)"
              stroke-width="1"
              stroke-dasharray="3 3"
            />
            <rect
              x="300"
              y="190"
              width="136"
              height="64"
              rx="10"
              fill="rgba(15,23,42,0.72)"
              stroke="rgba(251,191,36,0.30)"
              stroke-width="1"
            />
            <text
              x="368"
              y="207"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.40)"
            >
              Net profit · Jul
            </text>
            <text
              x="368"
              y="228"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="17"
              font-weight="600"
              fill="#fbbf24"
            >
              $87,300
            </text>
            <text
              x="368"
              y="245"
              text-anchor="middle"
              font-family="ui-sans-serif,sans-serif"
              font-size="9.5"
              fill="rgba(52,211,153,0.9)"
            >
              ▲ 47.3% margin
            </text>

            <!-- Cash flow sparkline strip -->
            <line
              x1="0"
              y1="206"
              x2="280"
              y2="206"
              stroke="rgba(255,255,255,0.05)"
              stroke-width="1"
            />
            <text
              x="0"
              y="218"
              font-family="ui-sans-serif,sans-serif"
              font-size="8.5"
              fill="rgba(255,255,255,0.25)"
            >
              Cash flow
            </text>
            <polyline
              fill="none"
              stroke="rgba(34,211,238,0.75)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              points="0,254 46,248 92,250 138,241 184,234 230,225 276,214"
            />
            <circle cx="276" cy="214" r="3.5" fill="rgba(34,211,238,0.9)" />
            <text
              x="268"
              y="211"
              text-anchor="end"
              font-family="ui-monospace,monospace"
              font-size="8.5"
              fill="rgba(34,211,238,0.75)"
            >
              ↑ 24%
            </text>
          </svg>
        </div>

        <!-- Right column: stat cards -->
        <div class="flex flex-col gap-3">
          <!-- Revenue card -->
          <div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
            <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">
              Total Revenue
            </p>
            <p class="text-xl font-semibold tracking-tight text-amber-300">$184,500</p>
            <p class="mt-1 text-[11px] text-emerald-400/90">▲ 12.4% vs last month</p>
          </div>

          <!-- Net profit + margin bar -->
          <div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
            <p class="mb-1.5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">
              Net Profit
            </p>
            <p class="text-xl font-semibold tracking-tight text-white">$87,300</p>
            <div class="mt-2.5 flex gap-1">
              <div class="h-1 flex-1 rounded-full bg-amber-400/80"></div>
              <div class="h-1 w-[40%] rounded-full bg-rose-400/60"></div>
              <div class="h-1 w-[12%] rounded-full bg-white/15"></div>
            </div>
            <p class="mt-1.5 text-[10px] text-white/35">Margin 47.3%</p>
          </div>

          <!-- Accounts mini list -->
          <div class="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md">
            <p class="mb-3 text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">
              Accounts
            </p>
            <div class="flex flex-col gap-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-amber-300/90"></span>
                  <span class="text-[11px] text-white/60">Receivable</span>
                </div>
                <span class="text-[11px] font-medium text-amber-300/90">$67.5k</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-cyan-400/80"></span>
                  <span class="text-[11px] text-white/60">Payable</span>
                </div>
                <span class="text-[11px] font-medium text-cyan-400/80">$29.1k</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-white/30"></span>
                  <span class="text-[11px] text-white/60">Cash</span>
                </div>
                <span class="text-[11px] font-medium text-white/75">$112.8k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
