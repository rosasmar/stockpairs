import Image from "next/image";
import CopyAddress from "@/app/copy-address";
import { getMarketData } from "@/lib/dexscreener";
import { formatPercent, formatPrice, formatUsd } from "@/lib/format";
import { type Chain, chainLabels, pairedKindLabels, pairs } from "@/lib/pairs";

const chainPillStyles: Record<Chain, string> = {
  solana: "bg-purple/20",
  robinhood: "bg-green/20",
};

export default async function Home() {
  const market = await getMarketData(pairs);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-12 pb-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-5xl">stockpairs</h1>
        <p className="text-muted">
          Meme coins paired with tokenized stocks and crypto, live from
          DexScreener.
        </p>
        <div
          aria-hidden="true"
          className="mt-2 h-1 w-24 rounded-full bg-linear-to-r from-pink via-yellow to-blue"
        />
      </header>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-wide whitespace-nowrap text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">24h</th>
              <th className="px-4 py-3 text-right font-medium">Market cap</th>
              <th className="px-4 py-3 text-right font-medium">Liquidity</th>
              <th className="px-4 py-3 text-right font-medium">24h volume</th>
              <th className="px-4 py-3 font-medium">Paired with</th>
              <th className="px-4 py-3 font-medium">Chain</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Pool</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair) => {
              const data = market.get(pair);
              const change = data?.priceChange24h ?? null;
              return (
                <tr
                  key={`${pair.chain}:${pair.token.address}`}
                  className="border-t border-border transition-colors hover:bg-background/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {data?.imageUrl ? (
                        <Image
                          src={data.imageUrl}
                          alt=""
                          width={32}
                          height={32}
                          className="size-8 rounded-full"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="size-8 shrink-0 rounded-full bg-border"
                        />
                      )}
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="font-semibold">
                          ${pair.token.symbol}
                        </span>
                        <CopyAddress address={pair.token.address} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatPrice(data?.priceUsd ?? null)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium tabular-nums ${
                      change === null || change === 0
                        ? "text-muted"
                        : change > 0
                          ? "text-up"
                          : "text-down"
                    }`}
                  >
                    {formatPercent(change)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatUsd(data?.marketCap ?? null)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatUsd(data?.liquidityUsd ?? null)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatUsd(data?.volume24h ?? null)}
                  </td>
                  <td className="min-w-64 px-4 py-3">
                    <div className="flex flex-col items-start gap-0.5">
                      <span>
                        <span className="font-semibold">
                          ${pair.pairedWith.symbol}
                        </span>{" "}
                        <span className="text-muted">
                          · {pairedKindLabels[pair.pairedWith.kind]} for{" "}
                          {pair.pairedWith.name}
                        </span>
                      </span>
                      <CopyAddress address={pair.pairedWith.address} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs whitespace-nowrap ${chainPillStyles[pair.chain]}`}
                    >
                      {chainLabels[pair.chain]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={pair.dexscreenerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border px-3 py-1 text-xs whitespace-nowrap hover:border-foreground"
                    >
                      DexScreener ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted">
        <p>
          Market data from DexScreener, refreshed about once a minute. Price,
          24h change and market cap are for the token across its main pool;
          liquidity and 24h volume are for the pool listed here.
        </p>
        <p>
          Every pair trades against a token, not the asset itself. A tokenized
          stock is a token that tracks a share price — it is not the share, it
          carries no ownership or voting rights, and it can trade above or below
          the real stock. Bridged crypto is a token on this chain backed by the
          real coin held elsewhere.
        </p>
      </div>
    </main>
  );
}
