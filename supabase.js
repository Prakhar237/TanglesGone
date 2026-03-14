const SUPABASE_URL = 'https://njixgaybvkzemikghmob.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qaXhnYXlidmt6ZW1pa2dobW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyOTk5MjksImV4cCI6MjA4ODg3NTkyOX0.NeXqQwnyCOJ-atNsajAO3Ps_aMZ8Aa0SW04zWH6-XKw'; // Replace with your Supabase Anon Key

async function fetchDomainData() {
    const domain = window.location.hostname;
    
    // Skip execution if we're on localhost or local file during development
    // If you want to test locally, you can uncomment the next line and put your target domain
    // const domain = 'tanglesgone.com';

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/websites?domain=eq.${domain}&select=*&limit=1`, {
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

    setText('hero-domain', dbData.domain);
    setText('hero-overview', dbData.overview);
    setText('hero-price', dbData.price);
    setText('metric-backlinks', dbData.backlink_counter);
    setText('metric-age', dbData.domain_age);
    setText('metric-visits', dbData.monthly_visits);
    setText('metric-seo', dbData.seo_rating);
    setText('about-body', dbData.about);

    if (dbData.special_feature_1) {
        const parts = splitFirstSentence(dbData.special_feature_1);
        setText('sf1-title', parts[0]);
        setText('sf1-desc', parts[1] || parts[0]);
    }
    if (dbData.special_feature_2) {
        const parts = splitFirstSentence(dbData.special_feature_2);
        setText('sf2-title', parts[0]);
        setText('sf2-desc', parts[1] || parts[0]);
    }

    populateList('perfect-for-list', dbData.perfect_for);
    populateList('market-opportunity-list', dbData.market_opportunity);

    setText('mini-blog-title', dbData.mini_blog_title);
    populateParagraphs('mini-blog-paragraphs', dbData.mini_blog, 'daas-text', true);

    setText('secondary-blog-title', dbData.secondary_blog_title);
    populateParagraphs('secondary-blog-paragraphs', dbData.secondary_blog, 'daas-text', true);

    setText('cont-blog1-title', dbData.contnious_blog_title1);
    populateParagraphs('cont-blog1-paragraphs', dbData.contnious_blog_content1, 'daas-text', true);

    if (dbData.contnious_blog_title2) {
        setText('cont-blog2-title', dbData.contnious_blog_title2);
    }
    if (dbData.contnious_blog_content2) {
        populateParagraphs('cont-blog2-paragraphs', dbData.contnious_blog_content2, 'daas-text', true);
    }

    if (dbData.screenshot_urls) {
        try {
            const urls = JSON.parse(dbData.screenshot_urls);
            populateScroller('scroller-track', urls);
        } catch (e) {
            console.error('Failed to parse screenshot_urls', e);
        }
    }

    const badge = document.getElementById('powered-by-badge');
    if (badge) {
        badge.style.display = dbData.powered_by_promotionocean ? 'block' : 'none';
    }

    const validDomain = dbData.domain || domain;
    setText('about-title', 'About ' + validDomain);
    setText('rent-title', 'Rent ' + validDomain + ' to Market Your Service');

    const rentSubtitle = document.getElementById('rent-subtitle');
    if (rentSubtitle) {
        rentSubtitle.textContent = `Not ready to purchase? Rent ${validDomain} to promote your brand with instant credibility and SEO benefits.`;
    }

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = validDomain + ' – Premium Domain For Sale';
    }
    const pageDesc = document.getElementById('page-desc');
    if (pageDesc && dbData.overview) {
        pageDesc.setAttribute('content', dbData.overview);
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
