const SUPABASE_URL = 'https://zxfmussltbhtfuzkkkeh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Zm11c3NsdGJodGZ1emtra2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzM3NDgsImV4cCI6MjA3NzIwOTc0OH0.HUYLcQimwkov66IsJ6faeXzF1yOyjyEok-WlcH7Toww';

async function fetchDomainData() {
    let domain = window.location.hostname;

    // Remove 'www.' prefix for matching
    if (domain.startsWith('www.')) {
        domain = domain.substring(4);
    }

    // Skip execution if we're on localhost or local file during development
    // To test locally, uncomment the next line and set your target domain:
    // domain = 'tanglesgone.com';

    if (!domain || domain === 'localhost' || domain === '127.0.0.1') {
        console.log('Running locally – skipping Supabase fetch. Uncomment domain override above to test.');
        return;
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/blogs?domain=eq.${domain}&select=*&limit=1`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Network response not ok:', response.statusText);
            return;
        }

        const data = await response.json();
        if (data && data.length > 0) {
            populateData(data[0], domain);
        } else {
            console.log('No data found for domain:', domain);
        }
    } catch (error) {
        console.error('Error fetching Supabase data:', error);
    }
}

function populateData(dbData, domain) {
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el && text !== undefined && text !== null) el.textContent = text;
    };

    const validDomain = dbData.domain || domain;

    // ── Navbar logo + footer logo (all .logo and .footer-logo) ─────────────
    document.querySelectorAll('.logo, .footer-logo').forEach(el => {
        el.textContent = validDomain;
    });

    // ── Hero section ────────────────────────────────────────────────────────
    setText('hero-domain', validDomain);
    setText('hero-overview', dbData.one_line_overview);

    if (dbData.price) {
        const priceEl = document.getElementById('hero-price');
        if (priceEl) {
            priceEl.textContent = dbData.price;
            priceEl.style.display = 'block';
        }
    }

    // ── Hero metrics cards ──────────────────────────────────────────────────
    if (dbData.domain_age_years !== null && dbData.domain_age_years !== undefined) {
        setText('metric-age', dbData.domain_age_years + '+ Years');
    }
    if (dbData.monthly_visits !== null && dbData.monthly_visits !== undefined) {
        setText('metric-visits', dbData.monthly_visits + ' Searches');
    }
    if (dbData.seo_rating !== null && dbData.seo_rating !== undefined) {
        setText('metric-seo', dbData.seo_rating + '/10');
    }
    if (dbData.backlink_counter !== null && dbData.backlink_counter !== undefined) {
        setText('metric-backlinks', dbData.backlink_counter);
    }

    // ── About section ───────────────────────────────────────────────────────
    setText('about-title', 'About ' + validDomain);
    setText('about-body', dbData.about);

    // ── About horizontal metrics ────────────────────────────────────────────
    const amhVals = document.querySelectorAll('.amh-val');
    if (amhVals.length >= 3) {
        if (dbData.domain_age_years !== null && dbData.domain_age_years !== undefined) {
            amhVals[0].textContent = dbData.domain_age_years + '+';
        }
        if (dbData.monthly_visits !== null && dbData.monthly_visits !== undefined) {
            amhVals[1].textContent = dbData.monthly_visits;
        }
        if (dbData.seo_rating !== null && dbData.seo_rating !== undefined) {
            amhVals[2].textContent = dbData.seo_rating + '/10';
        }
    }

    // ── Domain evaluation banner metrics ────────────────────────────────────
    const mbStats = document.querySelectorAll('.mb-stat .mb-value');
    if (mbStats.length >= 4) {
        if (dbData.domain_age_years !== null && dbData.domain_age_years !== undefined) {
            mbStats[0].textContent = dbData.domain_age_years + '+ Years';
        }
        if (dbData.monthly_visits !== null && dbData.monthly_visits !== undefined) {
            mbStats[1].textContent = dbData.monthly_visits;
        }
        if (dbData.seo_rating !== null && dbData.seo_rating !== undefined) {
            mbStats[2].textContent = dbData.seo_rating + '/10';
        }
        if (dbData.backlink_counter !== null && dbData.backlink_counter !== undefined) {
            mbStats[3].textContent = dbData.backlink_counter;
        }
    }

    // ── Perfect-for list ────────────────────────────────────────────────────
    const perfectForEl = document.getElementById('perfect-for-list');
    if (perfectForEl) {
        const items = [
            dbData.perfect_for_1,
            dbData.perfect_for_2,
            dbData.perfect_for_3,
            dbData.perfect_for_4,
            dbData.perfect_for_5
        ].filter(Boolean);
        if (items.length > 0) {
            perfectForEl.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                const icon = document.createElement('i');
                icon.setAttribute('data-lucide', 'check-circle-2');
                li.appendChild(icon);
                li.appendChild(document.createTextNode(' ' + item));
                perfectForEl.appendChild(li);
            });
            if (window.lucide) lucide.createIcons();
        }
    }

    // ── Market opportunity section ───────────────────────────────────────────
    const marketEl = document.getElementById('market-opportunity-list');
    if (marketEl) {
        const mItems = [
            dbData.market_opportunity_1,
            dbData.market_opportunity_2,
            dbData.market_opportunity_3,
            dbData.market_opportunity_4,
            dbData.market_opportunity_5
        ].filter(Boolean);
        if (mItems.length > 0) {
            const subtitle = marketEl.querySelector('.gold-subtitle');
            const highlight = marketEl.querySelector('.wp-highlight');
            marketEl.innerHTML = '';
            if (subtitle) marketEl.appendChild(subtitle);
            mItems.slice(0, 2).forEach(item => {
                const p = document.createElement('p');
                p.textContent = item;
                marketEl.appendChild(p);
            });
            if (highlight) marketEl.appendChild(highlight);
            else if (mItems[2]) {
                const div = document.createElement('div');
                div.className = 'wp-highlight';
                const icon = document.createElement('i');
                icon.setAttribute('data-lucide', 'lock');
                div.appendChild(icon);
                div.appendChild(document.createTextNode(' ' + mItems[2]));
                marketEl.appendChild(div);
                if (window.lucide) lucide.createIcons();
            }
        }
    }

    // ── Mini blog (main blog panel) ─────────────────────────────────────────
    if (dbData.mini_blog_content) {
        setText('mini-blog-title', 'Say Goodbye to Tangles with ' + validDomain);
        populateParagraphs('mini-blog-paragraphs', dbData.mini_blog_content, 'daas-text', true);
    }

    // ── Special features ────────────────────────────────────────────────────
    if (dbData.special_features_1) {
        const parts = splitFirstSentence(dbData.special_features_1);
        setText('sf1-title', parts[0]);
        setText('sf1-desc', parts[1] || parts[0]);
    }
    if (dbData.special_features_2) {
        const parts = splitFirstSentence(dbData.special_features_2);
        setText('sf2-title', parts[0]);
        setText('sf2-desc', parts[1] || parts[0]);
    }

    // ── Why Invest section domain heading ────────────────────────────────────
    setText('invest-sublabel', 'WHY INVEST IN ' + validDomain.toUpperCase() + '?');

    // ── Contact / Purchase section ───────────────────────────────────────────
    setText('contact-domain-title', 'Secure ' + validDomain + ' Today');
    const rentTitle = document.getElementById('rent-title');
    if (rentTitle) rentTitle.textContent = 'READY TO MAKE IT YOURS?';

    const rentSubtitle = document.getElementById('rent-subtitle');
    if (rentSubtitle) {
        rentSubtitle.textContent = `Fill in your details and let's make ${validDomain} yours.`;
    }

    // ── Footer CTA & logo & copyright ────────────────────────────────────────
    setText('footer-cta-text', `Don't miss the chance to own ${validDomain} and build a brand that lasts.`);
    setText('footer-logo', validDomain);
    const footerCopy = document.getElementById('footer-copy');
    if (footerCopy) {
        footerCopy.innerHTML = `&copy; 2024 ${validDomain}<br>All rights reserved`;
    }

    // Update nav 'why' link text
    const navWhyLink = document.getElementById('nav-why-link');
    if (navWhyLink) navWhyLink.textContent = 'Why ' + validDomain + '?';

    // ── Page title & meta description ────────────────────────────────────────
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = validDomain + ' \u2013 Premium Domain For Sale';
    }
    const pageDesc = document.getElementById('page-desc');
    if (pageDesc && dbData.one_line_overview) {
        pageDesc.setAttribute('content', dbData.one_line_overview);
    }

    // ── Screenshot / scroller ────────────────────────────────────────────────
    if (dbData.screenshot_url) {
        try {
            let urls;
            try { urls = JSON.parse(dbData.screenshot_url); } catch (e) { urls = [dbData.screenshot_url]; }
            if (Array.isArray(urls) && urls.length) populateScroller('scroller-track', urls);
        } catch (e) {
            console.error('Failed to handle screenshot_url', e);
        }
    }
}

function splitFirstSentence(text) {
    const match = text.match(/^([^.?!]+[.?!]+)(?:\s+(.*))?$/s);
    if (match) return [match[1].trim(), match[2] ? match[2].trim() : ''];
    return [text.trim(), ''];
}

function populateList(id, textData) {
    const el = document.getElementById(id);
    if (!el || !textData) return;
    el.innerHTML = '';
    const lines = textData.split('\n').map(line => line.trim()).filter(line => line);
    lines.forEach(line => {
        const li = document.createElement('li');
        li.textContent = line.startsWith('•') ? line : '• ' + line;
        el.appendChild(li);
    });
}

function populateParagraphs(id, textData, pClass, useIntro = false) {
    const el = document.getElementById(id);
    if (!el || !textData) return;
    el.innerHTML = '';
    const blocks = textData.split(/\n\s*\n/).map(b => b.trim()).filter(b => b);
    blocks.forEach((block, index) => {
        const p = document.createElement('p');
        p.className = (index === 0 && useIntro) ? 'daas-intro' : pClass;
        p.textContent = block;
        el.appendChild(p);
    });
}

function populateScroller(id, urls) {
    const el = document.getElementById(id);
    if (!el || !urls || !urls.length) return;
    el.innerHTML = '';
    const renderUrls = [...urls, ...urls];
    renderUrls.forEach((url, i) => {
        const div = document.createElement('div');
        div.className = 'scroller-item';
        div.onclick = () => openModal(url, 'Domain Evaluation Details ' + (i % urls.length + 1));
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Domain Extra Details ' + (i % urls.length + 1);
        img.className = 'scroller-image';
        div.appendChild(img);
        el.appendChild(div);
    });
}

// Initialize Supabase data fetching on load
document.addEventListener('DOMContentLoaded', fetchDomainData);
