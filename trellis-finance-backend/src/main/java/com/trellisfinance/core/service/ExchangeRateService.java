package com.trellisfinance.core.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Fetches live exchange rates from Frankfurter.app (free, no API key required).
 * Results are cached in-process for 15 minutes to avoid rate-limit issues.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExchangeRateService {

    private final RestTemplate restTemplate;

    private static final String API_BASE = "https://api.frankfurter.app/latest";
    private static final long TTL_MS = 15 * 60_000L; // 15 minutes

    private final Map<String, CachedRate> cache = new ConcurrentHashMap<>();

    public BigDecimal getRate(String from, String to) {
        if (from.equalsIgnoreCase(to)) return BigDecimal.ONE;

        String key = from.toUpperCase() + "_" + to.toUpperCase();
        CachedRate cached = cache.get(key);
        if (cached != null && !cached.isExpired()) return cached.rate;

        try {
            String url = API_BASE + "?from=" + from.toUpperCase() + "&to=" + to.toUpperCase();
            FxResponse resp = restTemplate.getForObject(url, FxResponse.class);
            if (resp != null && resp.rates() != null) {
                BigDecimal rate = BigDecimal.valueOf(resp.rates().get(to.toUpperCase()));
                cache.put(key, new CachedRate(rate));
                log.info("FX rate fetched: {} -> {} = {}", from, to, rate);
                return rate;
            }
        } catch (Exception e) {
            log.warn("FX fetch failed ({} -> {}): {}. Using fallback.", from, to, e.getMessage());
            if (cached != null) return cached.rate; // stale but better than crash
        }
        return BigDecimal.ONE;
    }

    public BigDecimal convert(BigDecimal amount, String from, String to) {
        return amount.multiply(getRate(from, to)).setScale(4, RoundingMode.HALF_UP);
    }

    private record CachedRate(BigDecimal rate, long ts) {
        CachedRate(BigDecimal rate) { this(rate, System.currentTimeMillis()); }
        boolean isExpired() { return System.currentTimeMillis() - ts > TTL_MS; }
    }

    // Frankfurter API response shape: { "base":"USD", "rates":{"EUR":0.92,...} }
    private record FxResponse(String base, Map<String, Double> rates) {}
}
