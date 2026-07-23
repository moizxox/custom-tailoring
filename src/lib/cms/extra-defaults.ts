import { DATENSCHUTZ_SECTIONS, IMPRESSUM } from "@/content/legal";
import { SHOP_CATEGORIES, SHOP_QUALITY_TIERS, MEASUREMENT_TIMETABLES, LEGAL_LINKS } from "@/lib/site-content";

const CDN = "https://res.cloudinary.com/dohrf7n0s/image/upload/lani-kostuemschneiderei";

export const EXTRA_SECTION_DEFAULTS: Record<string, Record<string, Record<string, unknown>>> = {
  shop: {
    tiers: {
      sectionLabel: "Für jedes Budget",
      heading: "Qualitätsstufen im Überblick",
      subtext:
        "Drei Stufen — unterschiedlich in Material, Verarbeitung und Ausstattung. So erhalten Sie genau die Qualität, die zu Ihrem Projekt passt.",
      navHint: "Preise wählen — alle Angaben sind unverbindliche Richtwerte",
      items: SHOP_QUALITY_TIERS.map((t, i) => ({
        name: t.name,
        badge: i === 0 ? "Einstieg" : i === 1 ? "Beliebt" : "Premium",
        price: i === 0 ? "ab CHF 290.–" : i === 1 ? "ab CHF 480.–" : "ab CHF 720.–",
        priceNote: "pro Kostüm",
        tagline: t.tagline,
        features: t.features.join("\n"),
        recommendation: t.recommendation,
        linkUrl: `#stufe-${t.id}`,
      })),
    },
    categories: {
      heading: "Unsere Angebote",
      items: SHOP_CATEGORIES.map((c) => ({
        name: c.name,
        description: c.description,
        slug: c.slug,
      })),
    },
  },
  galerie: {
    gallery: {
      items: [
        { src: `${CDN}/gallery/gwuerztraminer-2026.jpg`, category: "Guggenmusik", title: "Gwürztraminer Waageclique 2026" },
        { src: `${CDN}/gallery/schloesslischraenzer-major.jpg`, category: "Major", title: "Schlösslischränzer Major" },
        { src: `${CDN}/gallery/waageclique-edelwaggis.jpg`, category: "Clique", title: "Edelwaggis Waageclique" },
        { src: `${CDN}/gallery/waggis-clique.jpg`, category: "Guggenmusik", title: "Waggis Clique" },
        { src: `${CDN}/gallery/schloesslischraenzer-aesch.jpg`, category: "Clique", title: "Schlösslischränzer Aesch" },
        { src: `${CDN}/gallery/rumpfel-pfyffer.jpg`, category: "Clique", title: "Rumpfel Pfyffer Pratteln" },
        { src: `${CDN}/gallery/baenkli-clique.jpg`, category: "Clique", title: "Bänkli Clique Oberrohrdorf" },
        { src: `${CDN}/gallery/wiler-zipfel.jpg`, category: "Clique", title: "Wiler Zipfel Clique" },
        { src: `${CDN}/gallery/chaote-sujet.jpg`, category: "Sujet", title: "Chaote Sujetkostüme" },
        { src: `${CDN}/gallery/hudibras-solothurn.jpg`, category: "Sujet", title: "Hudibras Chutze Solothurn" },
      ],
    },
  },
  journal: {
    posts: {
      items: [
        {
          slug: "massanfertigung-vs-konfektionskostuem",
          category: "Ratgeber",
          date: "15. März 2025",
          title: "Massanfertigung oder Konfektionskostüm?",
          excerpt: "Was sind die Unterschiede – und wann lohnt sich die Investition in ein massgefertigtes Kostüm?",
          image: `${CDN}/gallery/schloesslischraenzer-major.jpg`,
        },
        {
          slug: "fasnacht-2025-trends",
          category: "Trends",
          date: "8. Januar 2025",
          title: "Fasnacht 2025: Die Kostüm-Trends",
          excerpt: "Welche Farben, Schnitte und Materialien werden diese Fasnacht dominieren?",
          image: `${CDN}/gallery/gwuerztraminer-2026.jpg`,
        },
        {
          slug: "stoffe-fuer-guggenmusik",
          category: "Material",
          date: "3. September 2024",
          title: "Die besten Stoffe für Guggenmusik-Kostüme",
          excerpt: "Haltbarkeit, Komfort und Optik – welche Materialien sich für Gruppenausstattungen am besten eignen.",
          image: `${CDN}/gallery/baenkli-clique.jpg`,
        },
        {
          slug: "massnehmen-tipps",
          category: "Ratgeber",
          date: "12. Juli 2024",
          title: "So nehmen Sie Masse korrekt ab",
          excerpt: "Eine Schritt-für-Schritt-Anleitung, bevor Sie zu uns kommen.",
          image: `${CDN}/figures/woman-measurement.png`,
        },
        {
          slug: "atelier-einblick",
          category: "Atelier",
          date: "5. Mai 2024",
          title: "Einblick in unser Basler Atelier",
          excerpt: "Wo Ideen entstehen und Kostüme Realität werden.",
          image: `${CDN}/atelier/atelier-2.jpg`,
        },
      ],
    },
  },
  faqs: {
    hero: {
      label: "Häufige Fragen",
      heading: "FAQs",
      headingAccent: "FAQs",
      subtext: "Antworten auf die häufigsten Fragen rund um unsere Leistungen.",
      headingTag: "h1",
    },
    items: {
      items: [
        { q: "Was kostet eine Massanfertigung?", a: "Die Kosten hängen vom Kostümtyp, den Materialien und dem Aufwand ab. Wir besprechen alles transparent im Erstgespräch und erstellen ein individuelles Angebot." },
        { q: "Wie lange dauert die Anfertigung?", a: "In der Regel benötigen wir 4–8 Wochen, je nach Komplexität und Auslastung. Bei Gruppenbestellungen kann es länger dauern." },
        { q: "Wie viele Anproben sind im Preis inbegriffen?", a: "Bei einer Massanfertigung planen wir bis zu drei Anproben ein." },
        { q: "Kann ich auch Änderungen an bestehenden Kostümen vornehmen lassen?", a: "Ja, das ist einer unserer Kerndienste. Wir passen Kostüme an, reparieren Schäden und modernisieren ältere Stücke." },
        { q: "Fertigen Sie auch für ganze Gruppen oder Vereine?", a: "Ja! Wir haben viel Erfahrung mit Gruppenausstattungen für Guggenmusiken, Cliquen und Vereine." },
        { q: "Wie nehme ich Masse, bevor ich zu Ihnen komme?", a: "Sie müssen nichts vorbereiten – wir nehmen alle Masse bei Ihrer ersten Anprobe ab." },
        { q: "Welche Stoffe verwenden Sie?", a: "Wir führen eine grosse Auswahl an hochwertigen Stoffen: Seide, Wolle, Baumwolle, Samt, Dekostoffe und Spezialgewebe." },
        { q: "Bieten Sie auch Stoffdruck an?", a: "Ja, auf Anfrage bieten wir Stoffdruck für individuelle Motive und Logos an." },
      ],
      ctaText: "Noch eine Frage? Wir helfen gerne persönlich.",
      ctaButton: "Frage stellen",
    },
  },
  impressum: {
    company: {
      name: IMPRESSUM.companyName,
      owner: IMPRESSUM.owner,
      address: IMPRESSUM.address,
      city: IMPRESSUM.city,
      country: IMPRESSUM.country,
      secondLocation: IMPRESSUM.secondLocation,
      phone: IMPRESSUM.phone,
      phoneHref: IMPRESSUM.phoneHref,
      email: IMPRESSUM.email,
      companyId: IMPRESSUM.companyId,
      vatId: IMPRESSUM.vatId,
      purpose: IMPRESSUM.purpose,
    },
    sections: {
      items: [
        {
          title: "Haftungsausschluss",
          headingTag: "h2",
          body: "Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann keine Gewähr übernommen werden.",
        },
        {
          title: "Urheberrecht",
          headingTag: "h2",
          body: "Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem schweizerischen Urheberrecht.",
        },
      ],
    },
  },
  datenschutz: {
    sections: {
      intro:
        "Quelle: bestehende Datenschutzerklärung von kostuemschneiderei.ch — strukturiert für die neue Website.",
      items: DATENSCHUTZ_SECTIONS.map((s) => ({
        title: s.title,
        headingTag: "h2",
        body: s.paragraphs.join("\n\n"),
      })),
    },
  },
  agb: {
    sections: {
      intro: "Platzhaltertext — bitte durch Ihre finalen AGB ersetzen.",
      items: [
        { title: "1. Geltungsbereich", headingTag: "h2", body: "Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen der Kostümschneiderei, einschliesslich Beratung, Massanfertigung, Änderungen, Reparaturen und Veredelungen." },
        { title: "2. Angebote und Vertragsschluss", headingTag: "h2", body: "Angebote sind unverbindlich, sofern nicht ausdrücklich anders vermerkt. Ein Vertrag kommt erst mit schriftlicher Auftragsbestätigung oder Rechnungsstellung zustande." },
        { title: "3. Massanfertigung", headingTag: "h2", body: "Massgeschneiderte Kostüme werden individuell nach Kundenwunsch gefertigt. Der Kunde ist für die Richtigkeit der übermittelten Masse und Angaben verantwortlich." },
        { title: "4. Preise und Zahlung", headingTag: "h2", body: "Alle Preise verstehen sich in Schweizer Franken (CHF), sofern nicht anders angegeben." },
        { title: "5. Lieferfristen", headingTag: "h2", body: "Liefertermine werden nach Möglichkeit eingehalten. Bei höherer Gewalt können sich Fristen angemessen verlängern." },
        { title: "6. Gewährleistung", headingTag: "h2", body: "Es gelten die gesetzlichen Gewährleistungsbestimmungen." },
      ],
    },
  },
  widerruf: {
    sections: {
      intro: "Platzhaltertext — bitte durch Ihre rechtlich geprüften Widerrufsbelehrung ersetzen.",
      items: [
        { title: "Massanfertigungen", headingTag: "h2", body: "Bei individuell nach Kundenspezifikation angefertigten Kostümen kann das Widerrufsrecht eingeschränkt oder ausgeschlossen sein." },
        { title: "Lagerware", headingTag: "h2", body: "Für vorproduzierte Artikel ab Lager gelten die gesetzlichen Bestimmungen, sofern anwendbar." },
      ],
    },
  },
  "shop-bedingungen": {
    sections: {
      intro: "Platzhaltertext — bitte im CMS mit Ihren finalen Shop-Bedingungen ersetzen.",
      items: [
        { title: "Verbindliche Bestellung", headingTag: "h2", body: "Eine Bestellung im Shop ist zunächst eine Anfrage. Verbindlich wird der Auftrag erst nach schriftlicher Bestätigung durch uns." },
        { title: "Preise", headingTag: "h2", body: "Angezeigte Preise sind Richtwerte oder «ab»-Preise, sofern nicht anders gekennzeichnet." },
        { title: "Lieferkosten", headingTag: "h2", body: "Lieferkosten und Abholoptionen werden individuell mitgeteilt." },
        { title: "Massanfertigung & Rückgabe", headingTag: "h2", body: "Individuell angefertigte Kostüme sind vom Widerruf ausgeschlossen, sofern gesetzlich zulässig." },
        { title: "Zahlungsarten", headingTag: "h2", body: "Akzeptierte Zahlungsarten werden bei Auftragsbestätigung mitgeteilt." },
      ],
    },
  },
  atelier: {
    intro: {
      label: "Handwerk vor Ort",
      heading: "Wo Tradition und Kreativität aufeinandertreffen",
      headingAccent: "Kreativität",
      paragraphs: "Unser Atelier ist mehr als ein Arbeitsplatz. Hier riecht es nach Stoff, klingt es nach Nähmaschinen, und jede Ecke erzählt eine Geschichte von Handwerk und Leidenschaft.\n\nBesuchen Sie uns – ob für eine Beratung, eine Anprobe oder einfach um die Atmosphäre zu erleben.",
      addressLine: "Greifengasse 20, 4052 Basel",
      hoursWeekday: "Mo–Fr: 08:30 – 17:30 Uhr",
      hoursSaturday: "Sa nach Vereinbarung",
      ctaLabel: "Besuch vereinbaren",
      ctaUrl: "/termin",
      slides: [
        { src: `${CDN}/atelier/atelier-1.png`, alt: "Atelier – Werkstatt und Nähmaschinen" },
        { src: `${CDN}/atelier/atelier-2.jpg`, alt: "Handarbeit und Nähzubehör im Atelier" },
        { src: `${CDN}/atelier/atelier-3.jpg`, alt: "Stoffe und Materialien" },
        { src: `${CDN}/gallery/schloesslischraenzer-major.jpg`, alt: "Fertiges Kostüm im Atelier" },
      ],
    },
    workshop: {
      label: "Unsere Werkstatt",
      heading: "Wo jedes Kostüm Gestalt annimmt",
      headingAccent: "Gestalt",
      paragraphs: "In unserer Werkstatt arbeiten wir mit modernen Nähmaschinen und klassischen Handwerkstechniken.\n\nVon der ersten Skizze an der Arbeitstafel bis zur letzten Knopfloch-Naht begleiten wir jedes Projekt persönlich.",
      imageSrc: `${CDN}/atelier/atelier-2.jpg`,
      imageAlt: "Näharbeit im Atelier",
      imagePosition: "left",
      ctaLabel: "Atelier besuchen",
      ctaUrl: "/termin",
    },
    materials: {
      label: "Stoffe & Materialien",
      heading: "Die richtige Auswahl für Ihr Projekt",
      headingAccent: "Auswahl",
      paragraphs: "In unserem Atelier finden Sie eine sorgfältig zusammengestellte Auswahl an Stoffen.\n\nWir beraten Sie ehrlich: welcher Stoff hält, was er kostet und wie er sich im Alltag trägt.",
      imageSrc: `${CDN}/atelier/atelier-3.jpg`,
      imageAlt: "Stoffauswahl im Atelier",
      imagePosition: "right",
      ctaLabel: "Stoffe entdecken",
      ctaUrl: "/stoffe",
    },
  },
  stoffe: {
    fabrics: {
      items: [
        { name: "Seide & Satin", desc: "Für elegante, fliessende Kostüme mit edlem Glanz.", icon_slug: "fabric-cloth-sewing-tailoring.svg", gradient: "from-periwinkle-lighter to-sand-light" },
        { name: "Wollstoffe", desc: "Robust, warm und zeitlos – ideal für Fasnachtskostüme.", icon_slug: "wool-sewing-knitting-handcraft.svg", gradient: "from-sand-light to-stone-light" },
        { name: "Baumwolle & Leinen", desc: "Atmungsaktiv und angenehm zu tragen – für jede Saison.", icon_slug: "fabric-cloth-sewing-tailoring.svg", gradient: "from-offwhite-warm to-periwinkle-lighter" },
        { name: "Samtgewebe", desc: "Luxuriöse Textur für besondere Auftritte.", icon_slug: "box-threads-sewing-tailoring.svg", gradient: "from-periwinkle-lighter to-offwhite-warm" },
        { name: "Dekostoffe", desc: "Für auffällige Designs mit Charakter und Ausdruck.", icon_slug: "sewing-pattern-sewing-tailoring-fashion-design.svg", gradient: "from-sand-light to-periwinkle-lighter" },
        { name: "Spezialgewebe", desc: "Stretchmaterialien, Lackstoffe und mehr auf Anfrage.", icon_slug: "velcro-tape-sewing-tailoring.svg", gradient: "from-stone-light to-sand-light" },
      ],
      ctaText: "Möchten Sie Muster sehen oder haben Sie spezielle Anforderungen?",
      ctaLabel: "Termin buchen",
      ctaUrl: "/termin",
    },
    advisory: {
      label: "Persönliche Beratung",
      heading: "Gemeinsam den passenden Stoff finden",
      headingAccent: "Stoff",
      paragraphs: "Die Wahl des richtigen Stoffes entscheidet über Tragekomfort, Haltbarkeit und Ausstrahlung.\n\nFür Gruppenausstattungen achten wir auf einheitliche Farben und gleichbleibende Qualität.",
      imageSrc: `${CDN}/atelier/atelier-3.jpg`,
      imageAlt: "Stoffberatung im Atelier",
      imagePosition: "right",
      ctaLabel: "Termin buchen",
      ctaUrl: "/termin",
    },
    bottomCta: {
      heading: "Stoffmuster ansehen?",
      text: "Vereinbaren Sie einen Termin und entdecken Sie unsere Auswahl persönlich im Atelier.",
    },
  },
  kostuemveredelung: {
    main: {
      label: "Textilveredelung",
      heading: "Stickerei & Stoffdruck",
      headingAccent: "Stickerei",
      paragraphs: "Auf Wunsch veredeln wir Ihre Kostüme mit Stickerei, Applikationen oder Stoffdruck.\n\nGemeinsam klären wir Motiv, Grösse, Farbe und Platzierung.",
      imageSrc: `${CDN}/gallery/schloesslischraenzer-major.jpg`,
      imageAlt: "Veredeltes Kostüm",
      imagePosition: "right",
      ctaLabel: "Termin buchen",
      ctaUrl: "/termin",
    },
    services: {
      heading: "Unsere Veredelungsleistungen",
      items: [
        { label: "Stickerei (Maschine & Hand)" },
        { label: "Stoffdruck & Transfer" },
        { label: "Applikationen & Patches" },
        { label: "Cliquen-Logos & Schriftzüge" },
        { label: "Namensstickerei" },
        { label: "Dekorative Borten & Details" },
      ],
      ctaLabel: "Anfrage senden",
      ctaUrl: "/kontakt",
    },
  },
  "ueber-uns": {
    story: {
      label: "Unsere Geschichte",
      heading: "Tradition in jedem Stich. Moderne in jeder Linie.",
      headingAccent: "Moderne",
      paragraphs: "Was 2003 als kleines Atelier in Basel begann, ist heute ein geschätzter Treffpunkt.\n\nOb für die Basler Fasnacht, einen Theaterauftritt oder eine private Feier – wir begleiten Sie von der ersten Idee bis zur finalen Anprobe.\n\nUnsere Kundschaft reicht von Einzelpersonen über Cliquen bis hin zu grossen Guggenmusiken.",
      ctaLabel: "Uns kennenlernen →",
      ctaUrl: "/termin",
    },
    work: {
      label: "Unsere Arbeit",
      heading: "Kostüme für Fasnacht, Bühne und besondere Momente",
      headingAccent: "Fasnacht",
      paragraphs: "Ob Einzelperson, Clique oder ganze Guggenmusik – wir kennen die Anforderungen der Basler Fasnacht.\n\nNeben der Fasnacht fertigen wir auch Bühnenkostüme und individuelle Aufträge.",
      imageSrc: `${CDN}/gallery/gwuerztraminer-2026.jpg`,
      imageAlt: "Gwürztraminer Waageclique – Gruppenausstattung",
      imagePosition: "right",
      ctaLabel: "Zur Galerie",
      ctaUrl: "/galerie",
    },
    values: {
      sectionLabel: "Was uns antreibt",
      heading: "Unsere Werte",
      items: [
        { icon_slug: "tailor-dummy-ruler-sewing-tailoring.svg", title: "Qualität", text: "Wir verwenden nur hochwertige Materialien und verarbeiten sie mit grösster Sorgfalt." },
        { icon_slug: "embroidery-sewing-needlework-handcraft.svg", title: "Handwerk", text: "Jedes Kostüm wird von Hand gefertigt – mit traditionellen Techniken und modernem Know-how." },
        { icon_slug: "button-sewing-tailoring-handcraft.svg", title: "Persönlichkeit", text: "Wir nehmen uns Zeit für Sie. Ihre Wünsche stehen bei uns an erster Stelle." },
      ],
    },
    team: {
      items: [
        { name: "Lani Müller", role: "Inhaberin & Schneiderin", icon_slug: "tailor-dummy-fashion-sewing-tailoring.svg", bio: "Seit über 20 Jahren lebe ich meine Leidenschaft für das Kostümhandwerk." },
        { name: "Sarah Keller", role: "Designerin & Beraterin", icon_slug: "pencil-sewing-tailoring-drawing.svg", bio: "Kreativität und Präzision vereinen sich in meiner Arbeit." },
        { name: "Marco Brun", role: "Zuschneider", icon_slug: "scissor-cut-fabric-sewing.svg", bio: "Ein perfekter Schnitt ist die Grundlage jedes guten Kostüms." },
      ],
    },
  },
  termin: {
    timetables: {
      heading: "Massen ohne Termin — Hochsaison",
      subtext: "Feste Zeiten pro Standort während der Fasnachts-Saison",
      items: [
        {
          locationId: "pratteln",
          label: MEASUREMENT_TIMETABLES.pratteln.label,
          description: MEASUREMENT_TIMETABLES.pratteln.description,
          active: "true",
          slots: MEASUREMENT_TIMETABLES.pratteln.slots.map((s) => `${s.day}: ${s.time}${s.note ? ` (${s.note})` : ""}`).join("\n"),
        },
        {
          locationId: "therwil",
          label: MEASUREMENT_TIMETABLES.therwil.label,
          description: MEASUREMENT_TIMETABLES.therwil.description,
          active: "true",
          slots: MEASUREMENT_TIMETABLES.therwil.slots.map((s) => `${s.day}: ${s.time}${s.note ? ` (${s.note})` : ""}`).join("\n"),
        },
      ],
    },
  },
};

export const DEFAULT_LEGAL_LINKS = LEGAL_LINKS.map((l) => ({ label: l.label, href: l.href }));
